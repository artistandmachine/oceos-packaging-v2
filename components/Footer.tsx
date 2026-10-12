"use client";

import { scrollToHash } from "@/lib/scroll";
import { InstagramIcon, LinkedInIcon } from "./Icons";
import Button from "./Button";
import Tbc from "./Tbc";

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
    wordmark: string;
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
    <footer
      data-theme="dark"
      className="weave gutter relative overflow-hidden pt-28 md:pt-40"
    >
      <div className="flex flex-col items-center gap-10 text-center">
        <p className="t-h2">{tagline}</p>
        <Button href="#contact">Book a call</Button>
      </div>

      <div className="mt-16 flex flex-col items-center gap-5 text-center md:mt-20">
        <a
          href={`mailto:${company.email}`}
          className="t-h3 break-all transition-opacity hover:opacity-70 sm:break-normal"
        >
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

      {/* The hairline runs out to the same inset as the wordmark below;
          the links sit a further 12.5vw in (160px at 1280): Company left,
          Products centred, Follow right. */}
      <div className="-mx-5 mt-24 px-4 md:-mx-10 md:px-6 lg:-mx-[9rem] lg:px-[2.25rem]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 border-t border-border py-14 md:grid-cols-3 md:px-[12.5vw]">
          <Col title="Company">
            {nav.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </Col>
          <Col title="Products" className="md:justify-self-center">
            {products.map((p) => (
              <FooterLink key={p} href="#products">
                {p}
              </FooterLink>
            ))}
          </Col>
          <Col title="Follow" className="md:items-end md:justify-self-end">
            <div className="flex gap-4">
              <a
                href={company.instagram}
                aria-label="Instagram"
                className="hover:opacity-70"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={company.linkedin}
                aria-label="LinkedIn"
                className="hover:opacity-70"
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>
            </div>
          </Col>
        </div>
      </div>

      {/* The brand signed off edge to edge: the wordmark, out past the
          gutter to the header corners' inset (16 / 24 / 36px, same as the
          mark and Book a call). A mask so it takes the band's text color. */}
      <div className="-mx-5 mt-4 px-4 md:-mx-10 md:px-6 lg:-mx-[9rem] lg:px-[2.25rem]">
        <span
          role="img"
          aria-label={company.name}
          className="block w-full bg-current"
          style={{
            aspectRatio: "324 / 24",
            maskImage: `url("${company.wordmark}")`,
            WebkitMaskImage: `url("${company.wordmark}")`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        />
      </div>

      <div className="mx-auto max-w-3xl py-8">
        <p className="t-label text-center">
          © {year} {company.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function Col({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <p className="t-label mb-2 text-on-surface-variant">{title}</p>
      {children}
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={(e) => scrollToHash(e, href)}
      className="t-label w-fit transition-opacity hover:opacity-70"
    >
      {children}
    </a>
  );
}
