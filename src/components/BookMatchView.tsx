import { type FormatConfig } from "@/data/products";

interface BookMatchViewProps {
  faces: string[];
  config: FormatConfig;
}

const BookMatchView = ({ faces, config }: BookMatchViewProps) => {
  // Create pairs for book-matching (butterfly effect)
  const pairs: [string, string][] = [];
  for (let i = 0; i < faces.length - 1; i += 2) {
    pairs.push([faces[i], faces[i + 1] || faces[i]]);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Book-Match Pairs
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pairs.map(([left, right], i) => (
          <div
            key={i}
            className="animate-fade-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="text-[10px] text-muted-foreground mb-1.5 font-medium">
              Pair {i + 1} — F{String(i * 2 + 1).padStart(2, "0")} + F{String(i * 2 + 2).padStart(2, "0")}
            </div>
            <div className="flex overflow-hidden rounded-md border border-border">
              <div
                className="flex-1 bg-secondary"
                style={{ aspectRatio: config.aspectRatio }}
              >
                <img
                  src={left}
                  alt={`Face ${i * 2 + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="flex-1 bg-secondary"
                style={{
                  aspectRatio: config.aspectRatio,
                  transform: "scaleX(-1)",
                }}
              >
                <img
                  src={right}
                  alt={`Face ${i * 2 + 2} mirrored`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookMatchView;
