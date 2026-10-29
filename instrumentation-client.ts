import { attachAnalyticsClient } from "./lib/analytics";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (posthogKey && typeof window !== "undefined") {
  const initPosthog = () => {
    void import("posthog-js").then(({ default: posthog }) => {
      posthog.init(posthogKey, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: "identified_only",
        autocapture: false,
        capture_dead_clicks: false,
        disable_session_recording: true,
        disable_surveys: true,
        loaded: (instance) => {
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
