interface BrandLogoProps {
  compact?: boolean;
  inverse?: boolean;
}

export function BrandLogo({ compact = false, inverse = false }: BrandLogoProps) {
  return (
    <span className="inline-flex items-center">
      <img 
        src="/logo.png" 
        alt="BidTracker" 
        className={`h-12 w-auto object-contain scale-[1.7] origin-left ${compact ? 'w-12 object-left' : ''} ${inverse ? 'brightness-0 invert' : ''}`}
        style={compact ? { objectPosition: 'left', width: '48px', objectFit: 'cover' } : {}}
      />
    </span>
  );
}
