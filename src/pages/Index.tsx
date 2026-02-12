import { useState, useMemo } from "react";
import { PRODUCTS, type Product, type ProductFormat } from "@/data/products";
import SearchBar from "@/components/SearchBar";
import FormatFilter from "@/components/FormatFilter";
import ProductCard from "@/components/ProductCard";
import ProductViewer from "@/components/ProductViewer";
import { Gem } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Gem className="h-5 w-5 text-primary" />
              <h1 className="font-display text-lg font-bold tracking-tight">
                Slab QC Viewer
              </h1>
            </div>
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <FormatFilter selected={formatFilter} onChange={setFormatFilter} />
        </div>
      </header>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-6 py-6">
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
