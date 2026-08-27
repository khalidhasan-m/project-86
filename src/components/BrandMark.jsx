export default function BrandMark({ className = "h-14 w-16" }) {
  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-sm ${className}`} aria-label="Organization logo">
      <svg viewBox="0 0 64 56" className="h-full w-full" role="img" aria-hidden="true">
        <rect width="21" height="56" fill="#dce5ef" />
        <rect x="21" width="22" height="56" fill="#e51f38" />
        <rect x="43" width="21" height="56" fill="#bdd8c7" />
        <path d="M0 0h21v15H0z" fill="#eef2f6" />
        <path d="M43 37h21v19H43z" fill="#a8ccb5" />
      </svg>
    </div>
  );
}
