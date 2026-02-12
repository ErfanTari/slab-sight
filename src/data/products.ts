import slabCalacatta from "@/assets/slab-calacatta.jpg";
import slabNoir from "@/assets/slab-noir.jpg";
import slabSandstone from "@/assets/slab-sandstone.jpg";
import slabPietra from "@/assets/slab-pietra.jpg";
import slabStatuario from "@/assets/slab-statuario.jpg";
import slabOnyx from "@/assets/slab-onyx.jpg";

export type ProductFormat = "120x280" | "160x320" | "120x120" | "60x120";

export interface Product {
  id: string;
  name: string;
  sku: string;
  collection: string;
  format: ProductFormat;
  faceCount: number;
  thumbnail: string;
  bookMatch: boolean;
}

export interface FormatConfig {
  label: string;
  faceCount: number;
  layout: "strip" | "grid";
  columns?: number;
  rows?: number;
  aspectRatio: number; // width/height of individual slab
}

export const FORMAT_CONFIGS: Record<ProductFormat, FormatConfig> = {
  "120x280": {
    label: "120×280 cm",
    faceCount: 10,
    layout: "strip",
    aspectRatio: 120 / 280,
  },
  "160x320": {
    label: "160×320 cm",
    faceCount: 8,
    layout: "strip",
    aspectRatio: 160 / 320,
  },
  "120x120": {
    label: "120×120 cm",
    faceCount: 20,
    layout: "grid",
    columns: 5,
    rows: 4,
    aspectRatio: 1,
  },
  "60x120": {
    label: "60×120 cm",
    faceCount: 40,
    layout: "grid",
    columns: 5,
    rows: 8,
    aspectRatio: 60 / 120,
  },
};

const TEXTURES = [slabCalacatta, slabNoir, slabSandstone, slabPietra, slabStatuario, slabOnyx];

function getTexture(index: number) {
  return TEXTURES[index % TEXTURES.length];
}

export const PRODUCTS: Product[] = [
  { id: "1", name: "Calacatta Royale", sku: "CAL-280-01", collection: "Prestige Marble", format: "120x280", faceCount: 10, thumbnail: slabCalacatta, bookMatch: true },
  { id: "2", name: "Noir Marquina", sku: "NOR-280-01", collection: "Prestige Marble", format: "120x280", faceCount: 10, thumbnail: slabNoir, bookMatch: true },
  { id: "3", name: "Statuario Venato", sku: "STA-320-01", collection: "Grand Format", format: "160x320", faceCount: 8, thumbnail: slabStatuario, bookMatch: true },
  { id: "4", name: "Pietra Grey", sku: "PIE-320-01", collection: "Grand Format", format: "160x320", faceCount: 8, thumbnail: slabPietra, bookMatch: true },
  { id: "5", name: "Sahara Dune", sku: "SAH-120-01", collection: "Natural Stone", format: "120x120", faceCount: 20, thumbnail: slabSandstone, bookMatch: false },
  { id: "6", name: "Verde Onyx", sku: "VER-120-01", collection: "Precious", format: "120x120", faceCount: 20, thumbnail: slabOnyx, bookMatch: false },
  { id: "7", name: "Calacatta Micro", sku: "CAL-060-01", collection: "Essentials", format: "60x120", faceCount: 40, thumbnail: slabCalacatta, bookMatch: false },
  { id: "8", name: "Noir Micro", sku: "NOR-060-01", collection: "Essentials", format: "60x120", faceCount: 40, thumbnail: slabNoir, bookMatch: false },
  { id: "9", name: "Onyx Emerald", sku: "ONX-280-01", collection: "Precious", format: "120x280", faceCount: 10, thumbnail: slabOnyx, bookMatch: true },
  { id: "10", name: "Pietra Micro", sku: "PIE-060-01", collection: "Essentials", format: "60x120", faceCount: 40, thumbnail: slabPietra, bookMatch: false },
];

export function getFacesForProduct(product: Product): string[] {
  const faces: string[] = [];
  for (let i = 0; i < product.faceCount; i++) {
    // Cycle through textures with slight variation conceptually
    faces.push(getTexture(TEXTURES.indexOf(product.thumbnail) + i));
  }
  return faces;
}
