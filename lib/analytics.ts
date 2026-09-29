"use client";

import posthog from "posthog-js";

export function captureEvent(name: string, properties?: Record<string, string | boolean>) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.capture(name, properties);
}
