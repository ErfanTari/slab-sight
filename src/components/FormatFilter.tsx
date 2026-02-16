import { FORMAT_CONFIGS, type ProductFormat } from "@/data/products";

interface FormatFilterProps {
  selected: ProductFormat | "all";
  onChange: (format: ProductFormat | "all") => void;
}

const FormatFilter = ({ selected, onChange }: FormatFilterProps) => {
  const formats = Object.entries(FORMAT_CONFIGS) as [ProductFormat, typeof FORMAT_CONFIGS[ProductFormat]][];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onChange("all")}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
          selected === "all"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
        }`}
      >
        All Formats
      </button>
      {formats.map(([key, config]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            selected === key
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
          }`}
        >
          {config.label}
        </button>
      ))}
    </div>
  );
};

export default FormatFilter;
