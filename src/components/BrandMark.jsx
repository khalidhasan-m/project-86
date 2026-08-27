export default function BrandMark({ className = "h-20 w-24" }) {
  return (
    <div className={`flex shrink-0 items-center justify-center ${className}`} aria-label="Organization logo">
      <img src="/dbbl.svg" alt="Organization logo" className="h-full w-full object-contain block" />
    </div>
  );
}