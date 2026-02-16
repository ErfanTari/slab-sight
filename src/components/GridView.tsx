import { type FormatConfig } from "@/data/products";

interface GridViewProps {
  faces: string[];
  config: FormatConfig;
}

const GridView = ({ faces, config }: GridViewProps) => {
  const cols = config.columns || 5;

  return (
    <div
      className="grid gap-0.5 w-full"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {faces.map((face, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-sm border border-border bg-secondary animate-fade-in"
          style={{
            aspectRatio: config.aspectRatio,
            animationDelay: `${i * 20}ms`,
          }}
        >
          <img
            src={face}
            alt={`Face ${i + 1}`}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0.5 left-1">
            <span className="text-[9px] font-medium text-white/80 drop-shadow-sm">
              F{String(i + 1).padStart(2, "0")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridView;
