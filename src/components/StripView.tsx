import { type FormatConfig } from "@/data/products";

interface StripViewProps {
  faces: string[];
  config: FormatConfig;
}

const StripView = ({ faces, config }: StripViewProps) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-thin pb-2">
      <div className="flex gap-0.5 min-w-max px-1">
        {faces.map((face, i) => (
          <div
            key={i}
            className="flex-shrink-0 animate-fade-in"
            style={{
              width: `${Math.round(config.aspectRatio * 640)}px`,
              animationDelay: `${i * 40}ms`,
            }}
          >
            <div
              className="relative overflow-hidden rounded-sm border border-border bg-secondary"
              style={{ aspectRatio: config.aspectRatio }}
            >
              <img
                src={face}
                alt={`Face ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-1.5">
                <span className="text-[10px] font-medium text-white/80 drop-shadow-sm">
                  F{String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StripView;
