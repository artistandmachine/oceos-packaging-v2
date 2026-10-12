"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CONTACT_EVENT } from "@/lib/contact";
import { lockScroll } from "@/lib/scroll";
import { EASE } from "./Reveal";
import { Roll } from "./Button";

/**
 * ERA's "Book a call" panel. Slides in from the right over a dimmed page.
 *
 * The site is a static export (no server), so submissions go to a form
 * service that emails them on to the company address. Set
 * site.json contact.form.endpoint (and any fields the service needs,
 * e.g. Web3Forms' access_key, in contact.form.fields). Until one is set,
 * or if the service fails, it falls back to a pre-filled email in the
 * visitor's own mail app. A hidden honeypot field drops most bots.
 */
export default function ContactDrawer({
  heading,
  body,
  success,
  sent,
  error,
  form,
  email,
}: {
  heading: string;
  body: string;
  /** Shown after the mail-app fallback opens */
  success: string;
  /** Shown after the form service accepted it */
  sent: string;
  error: string;
  form: { endpoint: string; fields: Record<string, string> };
  email: string;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto" | "error">("idle");

  useEffect(() => {
    const onOpen = () => {
      setStatus("idle");
      setOpen(true);
      lockScroll(true);
    };
    window.addEventListener(CONTACT_EVENT, onOpen);
    return () => window.removeEventListener(CONTACT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
    lockScroll(false);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    // Honeypot: people never see or fill it; bots usually do.
    if (get("_gotcha")) {
      setStatus("sent");
      return;
    }
    const subject = `Book a call: ${get("company") || get("name")}`;
    const lines = [
      `Name: ${get("name")}`,
      `Company: ${get("company")}`,
      `Email: ${get("email")}`,
      `Phone: ${get("phone")}`,
      "",
      get("message"),
    ];
    const mailto = () => {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
      setStatus("mailto");
    };

    if (!form.endpoint) return mailto();

    setStatus("sending");
    try {
      const res = await fetch(form.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...form.fields,
          subject,
          name: get("name"),
          company: get("company"),
          email: get("email"),
          phone: get("phone"),
          message: get("message"),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={heading}
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.8, ease: EASE }}
            data-lenis-prevent
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-xl flex-col overflow-y-auto bg-surface p-6 text-on-surface md:p-10"
          >
            <div className="flex items-center justify-between">
              <span className="t-label text-on-surface-variant">OCEOS</span>
              <button type="button" onClick={close} className="group t-label flex h-10 items-center rounded-full border border-border px-5">
                <Roll>Close</Roll>
              </button>
            </div>

            {/* Sized for the panel (max-w-xl), not the page: the page-scale
                headings run off its edge. */}
            <h2 className="t-h2 mt-14 text-balance text-[clamp(2.5rem,4.5vw,4rem)]">{heading}</h2>
            <p className="t-body mt-5 max-w-sm text-on-surface-variant">{body}</p>

            {status === "sent" || status === "mailto" ? (
              <p className="t-lead mt-12" role="status">
                {status === "sent" ? sent : success}
              </p>
            ) : (
              <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-6">
                <Field name="name" label="Name" required autoComplete="name" />
                <Field name="company" label="Company" autoComplete="organization" />
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field name="email" label="Email" type="email" required autoComplete="email" />
                  <Field name="phone" label="Phone" type="tel" autoComplete="tel" />
                </div>
                <Field name="message" label="Bag type, quantities, timing" textarea />
                {/* Honeypot, off screen and out of the tab order */}
                <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
                {status === "error" && (
                  <p className="t-body" role="alert">
                    {error}{" "}
                    <a href={`mailto:${email}`} className="underline underline-offset-4">
                      {email}
                    </a>
                    .
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group t-label mt-4 flex h-14 items-center justify-center rounded-full bg-accent text-on-accent transition-[transform,opacity] active:scale-[0.98] disabled:opacity-60"
                >
                  <Roll>{status === "sending" ? "Sending" : "Submit"}</Roll>
                </button>
              </form>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  textarea,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  autoComplete?: string;
}) {
  const cls =
    "w-full border-b border-border bg-transparent py-3 text-lg leading-[1.2] outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-accent";
  return (
    <label className="flex flex-col gap-1">
      <span className="t-label text-on-surface-variant">
        {label}
        {required && " *"}
      </span>
      {textarea ? (
        <textarea name={name} rows={4} className={`${cls} resize-none`} />
      ) : (
        <input name={name} type={type} required={required} autoComplete={autoComplete} className={cls} />
      )}
    </label>
  );
}
