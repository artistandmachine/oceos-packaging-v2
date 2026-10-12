"use client";

/** Any "Book a call" button anywhere on the page calls openContact();
 * ContactDrawer listens for the event. Avoids threading state through
 * every section. */
export const CONTACT_EVENT = "oceos:open-contact";

export function openContact() {
  window.dispatchEvent(new Event(CONTACT_EVENT));
}
