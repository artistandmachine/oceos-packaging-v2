/** Dev-only "TBC" badge next to any value flagged `"placeholder": true` in
 * data/site.json. Renders nothing in a production build, so a forgotten
 * placeholder never ships with a visible marker (but check the JSON flags
 * before launch anyway). */
export default function Tbc({ show = true }: { show?: boolean }) {
  if (!show || process.env.NODE_ENV === "production") return null;
  return (
    <span
      title="Placeholder value in data/site.json"
      className="ml-1.5 inline-block translate-y-[-0.4em] rounded-sm bg-amber-300 px-1 py-px align-top text-[10px] font-medium uppercase leading-3 tracking-wider text-black"
    >
      TBC
    </span>
  );
}
