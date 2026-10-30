"use client";

import { useEffect } from "react";
import { getAdSenseConfig, isLocalHostname } from "@/lib/adsense";

const SCRIPT_SELECTOR = 'script[data-adsense-loader="true"]';

export function AdSenseScript() {
  const { clientId } = getAdSenseConfig();

  useEffect(() => {
    if (!clientId || typeof window === "undefined") return;
    if (isLocalHostname(window.location.hostname)) return;
    if (document.querySelector(SCRIPT_SELECTOR)) return;

    const injectScript = () => {
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
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(injectScript, { timeout: 2500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timerId = globalThis.setTimeout(injectScript, 1500);
    return () => globalThis.clearTimeout(timerId);
  }, [clientId]);

  return null;
}
