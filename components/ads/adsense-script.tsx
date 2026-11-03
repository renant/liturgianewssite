"use client";

import { useEffect } from "react";
import { getAdSenseConfig, isLocalHostname } from "@/lib/adsense";

const SCRIPT_SELECTOR = 'script[data-adsense-loader="true"]';

export function ensureAdSenseScript(clientId: string | null | undefined) {
  if (!clientId || typeof window === "undefined") return;
  if (isLocalHostname(window.location.hostname)) return;
  if (document.querySelector(SCRIPT_SELECTOR)) return;

  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`;
  script.setAttribute("data-adsense-loader", "true");
  script.onerror = () => {
    document.documentElement.dataset.adsBlocked = "true";
  };
  document.head.appendChild(script);
}

export function AdSenseScript() {
  const { clientId } = getAdSenseConfig();

  useEffect(() => {
    // Carregamento sob demanda ocorre em AdUnit via ensureAdSenseScript quando nearViewport vira true.
    void clientId;
  }, [clientId]);

  return null;
}
