/**
 * useConfigurator — Config state, history, pricing, and validation for product configurator.
 * Extracted from DynamicConfigurator to reduce component complexity.
 */

import { useCallback, useMemo, useEffect, useReducer, useState } from 'react';
import type { MarketplaceProduct } from '@/services/CustomizationEngine';
import {
  validateConfig,
  calculatePrice,
  buildDefaults,
} from '@/services/CustomizationEngine';

export interface UseConfiguratorOptions {
  product: MarketplaceProduct | null;
  apiBase: string;
}

export interface UseConfiguratorResult {
  config: Record<string, unknown>;
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  quantity: number;
  setQuantity: (n: number) => void;
  history: Record<string, unknown>[];
  historyIndex: number;
  updateConfigAndHistory: (id: string, value: unknown) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  pricing: { unitPrice: number; lineTotal: number; discount: number };
  validation: { valid: boolean; errors: string[]; warnings: string[] };
  /** Call when product is selected to reset config. Pass overrideConfig to merge (e.g. from share). */
  initForProduct: (p: MarketplaceProduct, overrideConfig?: Record<string, unknown>) => void;
  /** Jump to a specific history version. */
  goToHistoryIndex: (index: number) => void;
}

type Config = Record<string, unknown>;

interface ServerPricing {
  unitPrice: number;
  lineTotal: number;
  discount: number;
}

/**
 * Config, history and the history cursor are ONE piece of state. They were three
 * separate useState values updated from inside a setConfig updater, which React
 * may invoke more than once per commit (StrictMode does exactly that in dev) —
 * the cursor then advanced twice per edit, so the first Undo appeared to do
 * nothing. A reducer keeps the three in lockstep and is safe to re-run.
 */
interface HistoryState {
  config: Config;
  history: Config[];
  historyIndex: number;
}

/** Dragging a slider commits on every step; without a cap history grows unbounded. */
const MAX_HISTORY = 50;

type HistoryAction =
  | { type: 'init'; config: Config }
  | { type: 'set'; updater: React.SetStateAction<Config> }
  | { type: 'commit'; id: string; value: unknown }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'goto'; index: number };

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'init':
      return { config: action.config, history: [action.config], historyIndex: 0 };

    case 'set': {
      const next =
        typeof action.updater === 'function'
          ? (action.updater as (prev: Config) => Config)(state.config)
          : action.updater;
      // Transient edits (scene handoff, prefilled text) do not create a version.
      return next === state.config ? state : { ...state, config: next };
    }

    case 'commit': {
      const next = { ...state.config, [action.id]: action.value };
      const truncated = state.history.slice(0, state.historyIndex + 1);
      const history = [...truncated, next].slice(-MAX_HISTORY);
      return { config: next, history, historyIndex: history.length - 1 };
    }

    case 'undo': {
      if (state.historyIndex <= 0) return state;
      const index = state.historyIndex - 1;
      return { ...state, historyIndex: index, config: state.history[index] };
    }

    case 'redo': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const index = state.historyIndex + 1;
      return { ...state, historyIndex: index, config: state.history[index] };
    }

    case 'goto': {
      if (action.index < 0 || action.index >= state.history.length) return state;
      return { ...state, historyIndex: action.index, config: state.history[action.index] };
    }

    default:
      return state;
  }
}

export function useConfigurator({
  product,
  apiBase,
}: UseConfiguratorOptions): UseConfiguratorResult {
  const [{ config, history, historyIndex }, dispatch] = useReducer(historyReducer, {
    config: {},
    history: [{}],
    historyIndex: 0,
  });
  const [quantity, setQuantity] = useState(1);
  const [apiPricing, setApiPricing] = useState<ServerPricing | null>(null);

  const initForProduct = useCallback(
    (p: MarketplaceProduct, overrideConfig?: Config) => {
      const defaults = buildDefaults(p.customization_schema);
      dispatch({ type: 'init', config: overrideConfig ? { ...defaults, ...overrideConfig } : defaults });
      setApiPricing(null);
    },
    []
  );

  const setConfig = useCallback<React.Dispatch<React.SetStateAction<Config>>>(
    (updater) => dispatch({ type: 'set', updater }),
    []
  );

  const schema = product?.customization_schema;
  const pricingFallback = useMemo(
    () =>
      product
        ? calculatePrice(
            product.customization_schema,
            product.pricing_rules,
            product.base_price,
            config,
            quantity
          )
        : { unitPrice: 0, lineTotal: 0, discount: 0 },
    [product, config, quantity]
  );
  const pricing = apiPricing ?? pricingFallback;

  const productId = product?.id;
  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    const t = setTimeout(() => {
      fetch(`${apiBase}/api/pricing/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, config, quantity }),
      })
        .then((r) => r.json() as Promise<Partial<ServerPricing>>)
        .then((data) => {
          if (cancelled) return;
          // Only trust a fully-formed response; anything else keeps the local estimate.
          if (typeof data?.unitPrice !== 'number' || typeof data?.lineTotal !== 'number') {
            setApiPricing(null);
            return;
          }
          setApiPricing({
            unitPrice: data.unitPrice,
            lineTotal: data.lineTotal,
            discount: data.discount ?? 0,
          });
        })
        // Fall back to the local estimate rather than showing a stale server price.
        .catch(() => {
          if (!cancelled) setApiPricing(null);
        });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [productId, config, quantity, apiBase]);

  const validation = useMemo(
    () =>
      schema
        ? validateConfig(schema, config)
        : { valid: true, errors: [], warnings: [] },
    [schema, config]
  );

  const updateConfigAndHistory = useCallback(
    (id: string, value: unknown) => dispatch({ type: 'commit', id, value }),
    []
  );

  const undo = useCallback(() => dispatch({ type: 'undo' }), []);
  const redo = useCallback(() => dispatch({ type: 'redo' }), []);
  const goToHistoryIndex = useCallback(
    (index: number) => dispatch({ type: 'goto', index }),
    []
  );

  return {
    config,
    setConfig,
    quantity,
    setQuantity: (n) => setQuantity(Math.max(1, n)),
    history,
    historyIndex,
    updateConfigAndHistory,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    pricing,
    validation,
    initForProduct,
    goToHistoryIndex,
  };
}
