"use client";

import Button from "./Button";
import ArchPanel from "./ArchPanel";

/** ERA's closing "Sea views" arch (components/ArchPanel.tsx) with UC's
 * "Ready to move smarter?" copy: giant caps over the photo, then
 * Start a conversation + email. */
export default function Cta({
  eyebrow,
  heading,
  body,
  primary,
  image,
  email,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  primary: string;
  image: string;
  email: string;
}) {
  return (
    <section id="contact-cta" aria-label={eyebrow}>
      <ArchPanel eyebrow={eyebrow} heading={heading} image={image}>
        <p className="t-body max-w-[36ch]">{body}</p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <Button href="#contact">{primary}</Button>
          <Button href={`mailto:${email}`} variant="outline">Email us</Button>
        </div>
      </ArchPanel>
    </section>
  );
}
