"use client";

import { captureEvent } from "@/lib/analytics";
import { useEffect } from "react";

export function LiturgyTracker({ slug, isToday }: { slug: string; isToday: boolean }) {
  useEffect(() => {
    captureEvent("liturgy_view", { slug, is_today: isToday });
  }, [slug, isToday]);
  return null;
}

export function EmailConfirmedTracker() {
  useEffect(() => {
    const key = "liturgianews:email-confirmed";
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch { /* Tracking remains optional when storage is unavailable. */ }
    captureEvent("newsletter_email_confirmed");
  }, []);
  return null;
}
