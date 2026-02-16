export type ProductFormat = "120x280" | "160x320" | "120x120" | "90x180" | "60x120" | "60x60" | "30x60";

export interface ProductSize {
  format: ProductFormat;
  faceCount: number;
  faces: string[];
}

export interface Product {
  id: string;
  name: string;
  collection: string;
  thumbnail: string;
  sizes: ProductSize[];
  bookMatch: boolean;
}

export interface FormatConfig {
  label: string;
  layout: "strip" | "grid";
  columns?: number;
  rows?: number;
  aspectRatio: number;
}

export const FORMAT_CONFIGS: Record<ProductFormat, FormatConfig> = {
  "120x280": {
    label: "120×280 cm",
    layout: "strip",
    aspectRatio: 120 / 280,
  },
  "160x320": {
    label: "160×320 cm",
    layout: "strip",
    aspectRatio: 160 / 320,
  },
  "120x120": {
    label: "120×120 cm",
    layout: "grid",
    columns: 5,
    rows: 4,
    aspectRatio: 1,
  },
  "90x180": {
    label: "90×180 cm",
    layout: "strip",
    aspectRatio: 180 / 90,
  },
  "60x120": {
    label: "60×120 cm",
    layout: "grid",
    columns: 5,
    rows: 8,
    aspectRatio: 60 / 120,
  },
  "60x60": {
    label: "60×60 cm",
    layout: "grid",
    columns: 10,
    rows: 8,
    aspectRatio: 1,
  },
  "30x60": {
    label: "30×60 cm",
    layout: "grid",
    columns: 10,
    rows: 16,
    aspectRatio: 60 / 30,
  },
};

function faces(product: string, format: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `/images/${product}/${format}/F${i + 1}.jpg`);
}

function thumb(product: string): string {
  return `/images/${product}/thumb.jpg`;
}

function getCollection(name: string): string {
  if (name.startsWith("Calacatta_")) return "Calacatta";
  if (name.startsWith("Lithoform_Crosscut_")) return "Lithoform Crosscut";
  if (name.startsWith("Lithoform_Veincut_")) return "Lithoform Veincut";
  if (name.startsWith("Serena_")) return "Serena";
  if (name.startsWith("Bianco_")) return "Bianco";
  if (name.startsWith("Travertino_")) return "Travertino";
  return name.replace(/_/g, " ");
}

function displayName(dirName: string): string {
  return dirName.replace(/_/g, " ");
}

interface ProductDef {
  dir: string;
  sizes: [ProductFormat, number][];
  bookMatch?: boolean;
}

const BOOKMATCH_PRODUCTS = ["Bianco_Dior", "Macchia_Vecchia", "Gemma_Bronz"];

const PRODUCT_DEFS: ProductDef[] = [
  { dir: "Arabescato_Corchia", sizes: [["120x280", 10], ["160x320", 8], ["120x120", 20], ["60x120", 40], ["60x60", 24], ["30x60", 160]] },
  { dir: "Ariel_Bianco", sizes: [["120x280", 10], ["160x320", 8], ["120x120", 20], ["60x120", 40], ["60x60", 69], ["30x60", 160]] },
  { dir: "Atlantic_Ocean", sizes: [["120x280", 10], ["160x320", 8], ["120x120", 20], ["60x120", 40], ["30x60", 160]] },
  { dir: "Bianco_Dior", sizes: [["120x280", 2]] },
  { dir: "Bianco_Gioia", sizes: [["120x280", 10], ["160x320", 8], ["120x120", 20], ["60x120", 40], ["60x60", 20], ["30x60", 40]] },
  { dir: "Bianco_Stratura", sizes: [["120x280", 8], ["160x320", 6], ["90x180", 20], ["60x120", 40], ["30x60", 120]] },
  { dir: "Calacatta_Borghini", sizes: [["120x280", 10], ["160x320", 8], ["120x120", 20], ["60x120", 40], ["30x60", 120]] },
  { dir: "Calacatta_Corchia", sizes: [["120x280", 10], ["160x320", 8], ["120x120", 20], ["60x120", 40], ["60x60", 60], ["30x60", 120]] },
  { dir: "Calacatta_Cremo", sizes: [["120x280", 10], ["120x120", 20], ["60x120", 40], ["60x60", 39], ["30x60", 40]] },
  { dir: "Calacatta_noir", sizes: [["120x280", 10], ["120x120", 20], ["60x120", 40], ["30x60", 144]] },
  { dir: "Calacatta_oro", sizes: [["120x280", 10]] },
  { dir: "Ceppo_Di_Gre", sizes: [["120x120", 20]] },
  { dir: "Crystal_Bianco", sizes: [["120x280", 10], ["120x120", 20], ["60x120", 40], ["60x60", 80], ["30x60", 152]] },
  { dir: "Foresta", sizes: [["120x280", 10], ["160x320", 8], ["60x120", 40]] },
  { dir: "Forge_Eleganza", sizes: [["120x280", 10], ["160x320", 8], ["60x120", 40], ["60x60", 80], ["30x60", 159]] },
  { dir: "French_Vanilla", sizes: [["160x320", 8]] },
  { dir: "Gemma_Bronz", sizes: [["120x280", 2]] },
  { dir: "Lithoform_Crosscut_Coast", sizes: [["120x280", 10]] },
  { dir: "Lithoform_Crosscut_Dunes", sizes: [["120x280", 10]] },
  { dir: "Lithoform_Crosscut_Twilight", sizes: [["120x280", 10]] },
  { dir: "Lithoform_Crosscut_Vista", sizes: [["120x280", 10]] },
  { dir: "Lithoform_Veincut_Coast", sizes: [["120x280", 8], ["90x180", 10]] },
  { dir: "Lithoform_Veincut_Dunes", sizes: [["120x280", 8]] },
  { dir: "Lithoform_Veincut_Twilight", sizes: [["120x280", 8]] },
  { dir: "Lithoform_Veincut_Vista", sizes: [["120x280", 8]] },
  { dir: "Macchia_Vecchia", sizes: [["120x280", 2]] },
  { dir: "Onyx", sizes: [["120x120", 21], ["60x120", 35], ["60x60", 84], ["30x60", 152]] },
  { dir: "Onyx_Halo", sizes: [["120x280", 10], ["120x120", 17], ["60x120", 20], ["30x60", 21]] },
  { dir: "Pietra_Imperialle", sizes: [["120x280", 9], ["160x320", 8], ["60x120", 40], ["60x60", 81], ["30x60", 160]] },
  { dir: "Sahara_Noir", sizes: [["120x280", 8], ["60x120", 41], ["30x60", 120]] },
  { dir: "Serena_Crater", sizes: [["120x280", 10]] },
  { dir: "Serena_Dusk", sizes: [["120x280", 10]] },
  { dir: "Serena_Flint", sizes: [["120x280", 10]] },
  { dir: "Serena_Pewter", sizes: [["120x280", 10]] },
  { dir: "Serena_Shale", sizes: [["120x280", 10]] },
  { dir: "Serena_Valley", sizes: [["120x280", 10]] },
  { dir: "Statuario_Extra", sizes: [["120x280", 10], ["120x120", 20], ["60x120", 40], ["60x60", 20], ["30x60", 20]] },
  { dir: "Taj_Mahal", sizes: [["120x280", 10], ["160x320", 8], ["120x120", 20], ["60x120", 39], ["60x60", 60], ["30x60", 120]] },
  { dir: "Travertino_Classico", sizes: [["120x280", 8], ["160x320", 6], ["90x180", 20], ["60x120", 40], ["30x60", 120]] },
  { dir: "Travertino_Titanium", sizes: [["120x280", 8], ["160x320", 6]] },
  { dir: "Verdi_Alpi", sizes: [["120x280", 10], ["160x320", 8], ["60x120", 40], ["60x60", 81]] },
];

export const PRODUCTS: Product[] = PRODUCT_DEFS.map((def, idx) => ({
  id: String(idx + 1),
  name: displayName(def.dir),
  collection: getCollection(def.dir),
  thumbnail: thumb(def.dir),
  sizes: def.sizes.map(([format, count]) => ({
    format,
    faceCount: count,
    faces: faces(def.dir, format, count),
  })),
  bookMatch: BOOKMATCH_PRODUCTS.includes(def.dir),
}));
