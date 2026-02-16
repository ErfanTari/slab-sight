import { useState, useMemo } from "react";
import { PRODUCTS, FORMAT_CONFIGS, type Product, type ProductFormat } from "@/data/products";
import SearchBar from "@/components/SearchBar";
import FormatFilter from "@/components/FormatFilter";
import ProductCard from "@/components/ProductCard";
import ProductViewer from "@/components/ProductViewer";

const Index = () => {
  const [search, setSearch] = useState("");
  const [formatFilter, setFormatFilter] = useState<ProductFormat | "all">("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q);
      const matchesFormat = formatFilter === "all" || p.format === formatFilter;
      return matchesSearch && matchesFormat;
    });
  }, [search, formatFilter]);

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-background p-6">
        <ProductViewer
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
        />
      </div>
    );
  }

  const formatEntries = Object.entries(FORMAT_CONFIGS) as [ProductFormat, typeof FORMAT_CONFIGS[ProductFormat]][];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-lg font-semibold tracking-tight text-foreground">
              Slab QC Viewer
            </h1>
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <FormatFilter selected={formatFilter} onChange={setFormatFilter} />
        </div>
      </header>

      {/* Hero — Format Guide */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
          Available Formats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formatEntries.map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFormatFilter(key)}
              className="text-left p-5 rounded-md border border-border bg-card hover:border-foreground/20 transition-colors"
            >
              <p className="text-2xl font-display font-semibold text-foreground">{config.label}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {config.faceCount} faces · {config.layout === "strip" ? "Strip view" : `${config.columns}×${config.rows} grid`}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-sm">No products match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
