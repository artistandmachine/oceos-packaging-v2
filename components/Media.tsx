"use client";

import { useState } from "react";
import Photo from "./Photo";

/**
 * Every image/video slot. Paints an rPET-weave skeleton (globals.css .hatch) in the current
 * theme's skeleton-fill until a real file exists at `src` (Photo unmounts
 * itself on 404), so the layout reads as designed before photography lands.
 * In dev, the expected filename is printed in the corner.
 */
export default function Media({
  src,
  video,
  alt = "",
  sizes = "100vw",
  priority,
  className = "",
  rounded = false,
}: {
  src: string;
  video?: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  rounded?: boolean;
}) {
  const [videoFailed, setVideoFailed] = useState(false);
  const dev = process.env.NODE_ENV !== "production";

  return (
    <div className={`hatch relative overflow-hidden bg-skeleton-fill ${rounded ? "rounded-[2px]" : ""} ${className}`}>
      {dev && (
        <span className="t-label absolute bottom-3 left-3 z-0 max-w-[80%] truncate normal-case tracking-normal text-on-surface-variant opacity-70">
          {src.split("/").pop()}
        </span>
      )}
      {video && !videoFailed ? (
        <video
          src={video}
          poster={src}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 z-10 h-full w-full object-cover"
        />
      ) : (
        <Photo src={src} alt={alt} fill sizes={sizes} priority={priority} className="z-10 object-cover" />
      )}
    </div>
  );
}
