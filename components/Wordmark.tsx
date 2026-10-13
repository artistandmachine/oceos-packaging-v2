/** The OCEOS PACKAGING wordmark (company.wordmark, public/brand/
 * logoOceosWordmark.svg) as a CSS mask filled with the current text
 * color, so it follows the band like type does. Size it by height. */
export default function Wordmark({ src, label = "OCEOS Packaging", className = "" }: { src: string; label?: string; className?: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`block bg-current ${className}`}
      style={{
        aspectRatio: "324 / 24",
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}
