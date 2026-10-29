"use client";

export function captureEvent(name: string, properties?: Record<string, string | boolean>) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || typeof window === "undefined") return;
  void import("posthog-js").then(({ default: posthog }) => {
    posthog.capture(name, properties);
  });
}
