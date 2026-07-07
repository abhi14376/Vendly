interface BrandLogoProps {
  compact?: boolean;
  inverse?: boolean;
}

export function BrandLogo({ compact = false, inverse = false }: BrandLogoProps) {
  const commonClasses = `h-10 w-auto object-contain scale-[4.8] origin-left ${compact ? 'w-10 object-left' : ''}`;
  const commonStyles = compact ? { objectPosition: 'left', width: '40px', objectFit: 'cover' } as const : {};

  if (inverse) {
    return (
      <span className="inline-flex items-center">
        <img src="/logo-dark.png" alt="BidTracker" className={commonClasses} style={commonStyles} />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center">
      <img src="/logo.png" alt="BidTracker" className={`${commonClasses} dark:hidden`} style={commonStyles} />
      <img src="/logo-dark.png" alt="BidTracker" className={`${commonClasses} hidden dark:block`} style={commonStyles} />
    </span>
  );
}
