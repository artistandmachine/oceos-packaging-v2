/**
 * UC's headline signature: wide, deliberate gaps between some words
 * ("Every     leg of the     journey"). In data/site.json a "|" marks a
 * gap; <GapText> renders the string with .word-gap spacers in place.
 */
export function Gap() {
  return <span aria-hidden="true" className="word-gap" />;
}

export function GapText({ text }: { text: string }) {
  const parts = text.split("|");
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && <Gap />}
          {p.trim()}
        </span>
      ))}
    </>
  );
}

/** Plain-text version of a gap string, for aria-labels and metadata. */
export function plain(text: string) {
  return text.split("|").map((s) => s.trim()).join(" ");
}
