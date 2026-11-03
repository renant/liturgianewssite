// Nota: auditorias de Lighthouse local (e navegadores headless com navigator.webdriver === true)
// são filtradas por detectSyntheticTraffic e não carregam o posthog-js. Assim, o Lighthouse mede
// o site sem o custo do SDK de analytics; o monitoramento real de campo continua vindo do Web Vitals
// coletado em sessões humanas pelo PostHog.
import { attachAnalyticsClient } from "./lib/analytics";
import { detectSyntheticTraffic } from "./lib/bot-detection";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (posthogKey && typeof window !== "undefined") {
  const traffic = detectSyntheticTraffic({
    webdriver: navigator.webdriver,
    userAgent: navigator.userAgent,
    languages: navigator.languages,
    viewportWidth: window.innerWidth,
    referrer: document.referrer,
    pathname: window.location.pathname,
    now: new Date(),
  });

  if (!traffic.skip) {
    const initPosthog = () => {
      void import("posthog-js").then(({ default: posthog }) => {
        posthog.init(posthogKey, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest",
          ui_host: "https://us.posthog.com",
          person_profiles: "identified_only",
          capture_pageview: "history_change",
          capture_pageleave: true,
          capture_exceptions: true,
          autocapture: {
            dom_event_allowlist: ["click", "submit"],
            element_allowlist: ["a", "button", "form"],
          },
          capture_dead_clicks: false,
          session_recording: {
            maskAllInputs: true,
          },
          disable_surveys: true,
          loaded: (instance) => {
            if (traffic.suspect) {
              instance.register({
                traffic_suspect: true,
                traffic_suspect_reason: traffic.reasons.join(","),
              });
              instance.stopSessionRecording?.();
            }
            attachAnalyticsClient(instance);
          },
        });
      });
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(initPosthog, { timeout: 2500 });
    } else {
      globalThis.setTimeout(initPosthog, 1200);
    }
  }
}
