import { FORMAT_CONFIGS, type Product } from "@/data/products";
import { BookOpen } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const config = FORMAT_CONFIGS[product.format];

  return (
    <button
      onClick={() => onClick(product)}
      className="group text-left bg-card rounded-lg border border-border overflow-hidden hover:border-primary/40 transition-all duration-200 animate-fade-in"
    >
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={product.thumbnail}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold truncate">{product.name}</h3>
          {product.bookMatch && (
            <BookOpen className="h-3.5 w-3.5 text-primary flex-shrink-0 ml-1" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">{product.sku}</p>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-badge text-badge-foreground">
            {config.label}
          </span>
          <span className="text-[10px] text-dim">
            {product.faceCount} faces · {config.layout}
          </span>
        </div>
      </div>
    </button>
  );
};

export default ProductCard;
