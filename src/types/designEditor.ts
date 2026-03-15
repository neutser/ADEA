/**
 * Design Editor types — layer-based design model for 2D Customization Studio.
 */

export type CraftEffect = 'engrave' | 'emboss' | 'deboss' | 'foil' | 'uv' | 'laser' | 'none';

export type LayerType = 'text' | 'image' | 'path' | 'shape' | 'pattern';

export interface ZoneBounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ProductZone {
  id: string;
  surfaceId: string;
  bounds: ZoneBounds;
  type: 'flat' | 'wrap' | 'curved';
}

export interface DesignLayer {
  id: string;
  type: LayerType;
  effect?: CraftEffect;
  fabricJson: Record<string, unknown>;
  zoneId: string;
  locked: boolean;
  visible: boolean;
  order: number;
  name?: string;
}

export interface DesignDocument {
  id?: string;
  productId: string;
  layers: DesignLayer[];
  zoneBounds: Record<string, ZoneBounds>;
  version: number;
  configVersion: 2;
}

export interface DesignEditorState {
  productId: string | null;
  productSchema: unknown;
  heroImage: string | null;
  zoneBounds: Record<string, ZoneBounds>;
  selectedLayerId: string | null;
  selectedObject: unknown;
}
