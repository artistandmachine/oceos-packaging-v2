"use client";

import { useEffect, useState, type RefObject } from "react";

/** Preloader -> Hero handoff. The hero's intro animation waits for this
 * instead of guessing a delay. */
const EVENT = "oceos:loaded";
let loaded = false;

export function markLoaded() {
  loaded = true;
  window.dispatchEvent(new Event(EVENT));
}

export function useLoaded() {
  const [ready, setReady] = useState(loaded);
  useEffect(() => {
    if (loaded) {
      setReady(true);
      return;
    }
    const on = () => setReady(true);
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  return ready;
}

/** What the preloader is actually waiting on. Anything above the fold
 * registers here (fonts, hero poster, hero video); the preloader polls
 * assetProgress() each frame, so late registrations (the desktop video
 * only mounts after the first render) still count. */
const assets = new Map<symbol, boolean>();

export function trackAsset() {
  const id = Symbol();
  assets.set(id, false);
  return {
    settle: () => assets.has(id) && assets.set(id, true),
    untrack: () => assets.delete(id),
  };
}

/** 0..1 share of registered assets that have loaded (or failed). */
export function assetProgress() {
  if (assets.size === 0) return 1;
  let settled = 0;
  assets.forEach((s) => s && settled++);
  return settled / assets.size;
}

/** Holds the preloader until this <img> has loaded or this <video> can
 * play through. Errors count as settled: the fallbacks take over. */
export function usePreloadAsset(ref: RefObject<HTMLImageElement | HTMLVideoElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || loaded) return;
    const isVideo = el instanceof HTMLVideoElement;
    if (isVideo ? el.readyState >= 4 : (el as HTMLImageElement).complete) return;

    const asset = trackAsset();
    const ev = isVideo ? "canplaythrough" : "load";
    el.addEventListener(ev, asset.settle);
    el.addEventListener("error", asset.settle);
    return () => {
      el.removeEventListener(ev, asset.settle);
      el.removeEventListener("error", asset.settle);
      asset.untrack();
    };
  }, [ref]);
}

