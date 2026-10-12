"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

/**
 * Wraps next/image so a missing/broken source never flashes the
 * browser's native broken-image glyph. Starts invisible, fades in once
 * the image actually decodes, and unmounts itself on error instead of
 * relying on onError to hide it after the glyph has already painted.
 */
export default function Photo({ className = "", ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <Image
      {...props}
      className={`${className} transition-opacity duration-500 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
    />
  );
}
