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
        className={`h-10 w-auto object-contain scale-[3] origin-left ${compact ? 'w-10 object-left' : ''} ${inverse ? 'brightness-0 invert' : ''}`}
        style={compact ? { objectPosition: 'left', width: '40px', objectFit: 'cover' } : {}}
      />
    </span>
  );
}
