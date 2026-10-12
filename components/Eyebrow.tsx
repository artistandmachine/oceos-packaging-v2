/** Section eyebrow: a bold expanded label, nothing else (the hero's
 * "Changing the world" set the look). */
export default function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`t-label ${className}`}>{children}</p>;
}
