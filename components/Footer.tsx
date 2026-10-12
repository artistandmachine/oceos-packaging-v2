"use client";

import { scrollToHash } from "@/lib/scroll";
import { InstagramIcon, LinkedInIcon } from "./Icons";
import Button from "./Button";
import Tbc from "./Tbc";
import FitText from "./FitText";

type Link = { label: string; href: string };

/** Closing screen on forest: tagline and Book a call, the email (OCEOS is
 * email only) over the location in small labels, slim link columns, then
 * the name set edge to edge across the whole footer, and the legal row. */
export default function Footer({
  tagline,
  nav,
  products,
  company,
}: {
  tagline: string;
  nav: Link[];
  products: string[];
  company: {
    name: string;
    email: string;
    emailPlaceholder?: boolean;
    address: string[];
    addressPlaceholder?: boolean;
    instagram: string;
    linkedin: string;
  };
}) {
  const year = new Date().getFullYear();

  return (
    <footer data-theme="dark" className="weave gutter relative overflow-hidden pt-28 md:pt-40">
      <div className="flex flex-col items-center gap-10 text-center">
        <p className="t-h2">{tagline}</p>
        <Button href="#contact">Book a call</Button>
      </div>

      <div className="mt-16 flex flex-col items-center gap-5 text-center md:mt-20">
        <a href={`mailto:${company.email}`} className="t-h3 break-all transition-opacity hover:opacity-70 sm:break-normal">
          {company.email}
        </a>
        <Tbc show={!!company.emailPlaceholder} />
        <div className="t-label flex flex-col items-center gap-1">
          {company.address.map((l) => (
            <span key={l}>{l}</span>
          ))}
          <Tbc show={!!company.addressPlaceholder} />
        </div>
      </div>

      <div className="mx-auto mt-24 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-12 border-t border-border py-14 md:grid-cols-3">
        <Col title="Company">
          {nav.map((l) => (
            <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
          ))}
        </Col>
        <Col title="Products">
          {products.map((p) => (
            <FooterLink key={p} href="#products">{p}</FooterLink>
          ))}
        </Col>
        <Col title="Follow">
          <div className="flex gap-4">
            <a href={company.instagram} aria-label="Instagram" className="hover:opacity-70"><InstagramIcon className="h-5 w-5" /></a>
            <a href={company.linkedin} aria-label="LinkedIn" className="hover:opacity-70"><LinkedInIcon className="h-5 w-5" /></a>
          </div>
        </Col>
      </div>

      {/* The brand signed off edge to edge: full bleed past the gutter,
          sized to the width by FitText. */}
      <div className="-mx-5 mt-4 px-[1.5vw] md:-mx-10 lg:-mx-[9rem]">
        <FitText text={`${company.name}`} className="font-serif uppercase leading-[0.86] tracking-[-0.02em]" />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col gap-3 py-8">
        <p className="t-label">
          © {year} {company.name}. All rights reserved.
        </p>
        {/* Right-aligned with the fixed nav links (Header: right-5 / md:right-10
            / lg:right-16), not the centered column, so it lines up under
            them. On the copyright's line from sm up. */}
        <a
          href="#top"
          onClick={(e) => scrollToHash(e, "#top")}
          className="t-label self-end hover:opacity-70 sm:absolute sm:bottom-8 sm:right-5 md:right-10 lg:right-16"
        >
          To top ↑
        </a>
      </div>
    </footer>
  );
}

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="t-label mb-2 text-on-surface-variant">{title}</p>
      {children}
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} onClick={(e) => scrollToHash(e, href)} className="t-label w-fit transition-opacity hover:opacity-70">
      {children}
    </a>
  );
}
