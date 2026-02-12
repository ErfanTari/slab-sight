import { useState } from "react";
import { type Product, FORMAT_CONFIGS, getFacesForProduct } from "@/data/products";
import Breadcrumbs from "./Breadcrumbs";
import StripView from "./StripView";
import GridView from "./GridView";
import BookMatchView from "./BookMatchView";
import { Layers, BookOpen, ArrowLeft } from "lucide-react";

interface ProductViewerProps {
  product: Product;
  onBack: () => void;
}

type ViewMode = "sequence" | "bookmatch";

const ProductViewer = ({ product, onBack }: ProductViewerProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("sequence");
  const config = FORMAT_CONFIGS[product.format];
  const faces = getFacesForProduct(product);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Breadcrumbs
            items={[
              { label: "Portfolio", onClick: onBack },
              { label: product.collection, onClick: onBack },
              { label: product.name },
            ]}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 rounded-md bg-secondary hover:bg-surface-hover transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold">{product.name}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {product.sku} · {config.label} · {product.faceCount} faces
              </p>
            </div>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          <button
            onClick={() => setViewMode("sequence")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "sequence"
                ? "bg-primary text-primary-foreground"
                : "text-secondary-foreground hover:bg-surface-hover"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Sequential
          </button>
          {product.bookMatch && (
            <button
              onClick={() => setViewMode("bookmatch")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === "bookmatch"
                  ? "bg-primary text-primary-foreground"
                  : "text-secondary-foreground hover:bg-surface-hover"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Book-Match
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-card rounded-xl border border-border p-4">
        {viewMode === "sequence" ? (
          config.layout === "strip" ? (
            <StripView faces={faces} config={config} />
          ) : (
            <GridView faces={faces} config={config} />
          )
        ) : (
          <BookMatchView faces={faces} config={config} />
        )}
      </div>
    </div>
  );
};

export default ProductViewer;
