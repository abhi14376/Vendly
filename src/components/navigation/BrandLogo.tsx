interface BrandLogoProps {
  compact?: boolean;
  inverse?: boolean;
}

export function BrandLogo({ compact = false, inverse = false }: BrandLogoProps) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-md bg-primary-600 text-base font-bold text-white">
        V
      </span>
      {!compact && (
        <span className={`text-lg font-bold ${inverse ? "text-white" : "text-slate-900 dark:text-white"}`}>
          Vendly
        </span>
      )}
    </span>
  );
}
