import { cn } from "@/lib/utils";

export function Chip({
  label, selected, onClick, className,
}: { label: string; selected?: boolean; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm transition-smooth",
        selected
          ? "border-secondary bg-secondary text-secondary-foreground shadow-soft"
          : "border-border bg-background hover:border-secondary/60 hover:text-secondary",
        className,
      )}
    >
      {label}
    </button>
  );
}

export function ChipGroup({
  options, value, onChange, multi = true,
}: {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  multi?: boolean;
}) {
  const toggle = (opt: string) => {
    if (multi) {
      onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
    } else {
      onChange([opt]);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Chip key={opt} label={opt} selected={value.includes(opt)} onClick={() => toggle(opt)} />
      ))}
    </div>
  );
}
