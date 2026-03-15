/**
 * useConfigurator — Config state, history, pricing, and validation for product configurator.
 * Extracted from DynamicConfigurator to reduce component complexity.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
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

export function useConfigurator({
  product,
  apiBase,
}: UseConfiguratorOptions): UseConfiguratorResult {
  const [config, setConfig] = useState<Record<string, unknown>>({});
  const [quantity, setQuantity] = useState(1);
  const [history, setHistory] = useState<Record<string, unknown>[]>([{}]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [apiPricing, setApiPricing] = useState<{
    unitPrice: number;
    lineTotal: number;
    discount: number;
  } | null>(null);

  const initForProduct = useCallback(
    (p: MarketplaceProduct, overrideConfig?: Record<string, unknown>) => {
      const defaults = buildDefaults(p.customization_schema);
      const initial = overrideConfig ? { ...defaults, ...overrideConfig } : defaults;
      setConfig(initial);
      setHistory([initial]);
      setHistoryIndex(0);
      setApiPricing(null);
    },
    []
  );

  const schema = product?.customization_schema;
  const pricingFallback = product
    ? calculatePrice(
        product.customization_schema,
        product.pricing_rules,
        product.base_price,
        config,
        quantity
      )
    : { unitPrice: 0, lineTotal: 0, discount: 0 };
  const pricing = apiPricing ?? pricingFallback;

  useEffect(() => {
    if (!product) return;
    const t = setTimeout(() => {
      fetch(`${apiBase}/api/pricing/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          config,
          quantity,
        }),
      })
        .then((r) => r.json())
        .then((data) =>
          setApiPricing({
            unitPrice: data.unitPrice,
            lineTotal: data.lineTotal,
            discount: data.discount ?? 0,
          })
        )
        .catch(() => setApiPricing(null));
    }, 300);
    return () => clearTimeout(t);
  }, [product?.id, config, quantity, apiBase]);

  const validation = useMemo(
    () =>
      schema
        ? validateConfig(schema, config)
        : { valid: true, errors: [], warnings: [] },
    [schema, config]
  );

  const updateConfigAndHistory = useCallback(
    (id: string, value: unknown) => {
      setConfig((prev) => {
        const next = { ...prev, [id]: value };
        setHistory((h) => {
          const newHistory = h.slice(0, historyIndex + 1);
          newHistory.push(next);
          return newHistory;
        });
        setHistoryIndex((i) => i + 1);
        return next;
      });
    },
    [historyIndex]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setConfig(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setConfig(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const goToHistoryIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < history.length) {
        setHistoryIndex(index);
        setConfig(history[index]);
      }
    },
    [history]
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
