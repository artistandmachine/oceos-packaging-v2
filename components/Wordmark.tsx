/** Temporary serif wordmark until a real OCEOS logo SVG exists
 * (drop it at public/brand/logo.svg and swap this for an <img>). */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif tracking-[-0.02em] ${className}`} aria-label="OCEOS Packaging">
      OCEOS
    </span>
  );
}
