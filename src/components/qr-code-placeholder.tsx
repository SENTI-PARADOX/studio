export function QrCodePlaceholder({ className }: { className?: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      className={className}
      aria-label="QR Code Placeholder"
    >
      <defs>
        <pattern id="p" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="5" height="5" className="fill-foreground" />
          <rect x="5" y="5" width="5" height="5" className="fill-foreground" />
        </pattern>
      </defs>
      <rect width="100" height="100" className="fill-background" />
      <rect width="100" height="100" fill="url(#p)" className="opacity-80" />

      {/* Anchor squares */}
      <rect width="30" height="30" className="fill-background" />
      <rect x="5" y="5" width="20" height="20" className="fill-foreground" />

      <rect x="70" width="30" height="30" className="fill-background" />
      <rect x="75" y="5" width="20" height="20" className="fill-foreground" />
      
      <rect y="70" width="30" height="30" className="fill-background" />
      <rect x="5" y="75" width="20" height="20" className="fill-foreground" />
    </svg>
  );
}
