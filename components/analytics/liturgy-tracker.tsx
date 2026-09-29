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
    // Recarregar a página conta novamente: nenhum identificador do contato é exposto ao cliente.
    captureEvent("newsletter_email_confirmed");
  }, []);
  return null;
}
