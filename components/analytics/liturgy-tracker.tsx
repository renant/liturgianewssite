"use client";

import { captureEvent, type AnalyticsProperties } from "@/lib/analytics";
import { isValidNewsletterSource, isValidSignupRef } from "@/lib/newsletter";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function LiturgyTracker({ slug, isToday }: { slug: string; isToday: boolean }) {
  useEffect(() => {
    captureEvent("liturgy_view", { slug, is_today: isToday });
  }, [slug, isToday]);
  return null;
}

export function EmailConfirmedTracker() {
  const searchParams = useSearchParams();
  const rawRef = searchParams.get("ref");
  const rawSource = searchParams.get("source");

  useEffect(() => {
    const validRef = isValidSignupRef(rawRef) ? rawRef.trim() : null;
    const validSource = isValidNewsletterSource(rawSource) ? rawSource : null;
    // A chave do sessionStorage inclui o signup_ref quando disponível, evitando contar reload da confirmação.
    // Não há id de contato do Resend nem e-mail no cliente de propósito.
    const key = validRef
      ? `liturgianews:email-confirmed:${validRef}`
      : "liturgianews:email-confirmed";
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* Tracking remains optional when storage is unavailable. */
    }
    const properties: AnalyticsProperties = {};
    if (validRef) properties.signup_ref = validRef;
    if (validSource) properties.source = validSource;
    captureEvent(
      "newsletter_email_confirmed",
      Object.keys(properties).length > 0 ? properties : undefined,
    );
  }, [rawRef, rawSource]);
  return null;
}
