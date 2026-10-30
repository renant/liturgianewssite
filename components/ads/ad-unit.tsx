"use client";

import { useEffect, useRef, useState } from "react";
import { getAdSenseConfig, isLocalHostname } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export type AdUnitPosition = "after-reflection" | "after-reading";

export function AdUnit({
  slot,
  position,
}: {
  slot: string | null;
  position: AdUnitPosition;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const insRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);
  const [nearViewport, setNearViewport] = useState(false);
  const [localDevPreview, setLocalDevPreview] = useState(false);

  const { clientId, previewEnabled } = getAdSenseConfig();
  const isLiveConfigured = Boolean(clientId && slot);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV === "development" && isLocalHostname(window.location.hostname)) {
      const timerId = globalThis.setTimeout(() => setLocalDevPreview(true), 0);
      return () => globalThis.clearTimeout(timerId);
    }
  }, []);

  useEffect(() => {
    if (!isLiveConfigured || nearViewport) return;
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof window === "undefined") return;

    if (!("IntersectionObserver" in window)) {
      const timerId = globalThis.setTimeout(() => setNearViewport(true), 0);
      return () => globalThis.clearTimeout(timerId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          setNearViewport(true);
        }
      },
      { rootMargin: "350px 0px" },
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [isLiveConfigured, nearViewport]);

  useEffect(() => {
    if (!isLiveConfigured || !nearViewport || pushedRef.current) return;
    if (typeof window === "undefined" || isLocalHostname(window.location.hostname)) return;

    const element = insRef.current;
    if (!element) return;
    if (element.getAttribute("data-adsbygoogle-status")) {
      pushedRef.current = true;
      return;
    }

    try {
      pushedRef.current = true;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Bloqueadores de conteúdo podem interceptar o AdSense; falha silenciosa preserva a leitura.
    }
  }, [isLiveConfigured, nearViewport]);

  if (!isLiveConfigured && !previewEnabled) {
    return null;
  }

  const labelText =
    position === "after-reflection" ? "Liturgia — Pós-Reflexão" : "Liturgia — Fim da Leitura";

  return (
    <div
      ref={wrapperRef}
      className="ad-unit-wrapper not-prose"
      data-ad-position={position}
    >
      <p className="ad-unit-label">Publicidade</p>
      <div className="ad-unit-frame">
        {localDevPreview || (!isLiveConfigured && previewEnabled) ? (
          <div className="ad-unit-preview">
            Prévia local AdSense · {labelText}
            {slot ? ` (slot ${slot})` : ""}
          </div>
        ) : isLiveConfigured && nearViewport ? (
          <ins
            ref={insRef}
            className="adsbygoogle block w-full"
            style={{ display: "block" }}
            data-ad-client={clientId!}
            data-ad-slot={slot!}
            data-ad-format="auto"
            data-full-width-responsive="false"
          />
        ) : null}
      </div>
    </div>
  );
}
