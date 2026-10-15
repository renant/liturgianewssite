"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "@/hooks/use-form-state";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useRef } from "react";
import { subscribe } from "./actions";
import { captureEvent } from "@/lib/analytics";

type NewsletterSource = "home" | "liturgia_hoje" | "liturgia_datada";

export default function NewsletterFormSignup({ source = "home" }: { source?: NewsletterSource }) {
  const router = useRouter();
  const id = useId();
  const started = useRef(false);
  const captureStart = () => {
    if (started.current) return;
    started.current = true;
    captureEvent("newsletter_signup_start", { source });
  };
  const [formState, handleSubmit, isPending] = useFormState(subscribe, async data => {
    if (!data) return;
    const query = new URLSearchParams({ id: data.id, email: data.email });
    const response = await fetch(`/api/send-confirm-email?${query}`);
    if (response.ok) {
      captureEvent("newsletter_signup_completed", { source });
      router.push("/confirm-subscription");
    } else router.push("/error");
  });
  const error = formState.errors?.email?.[0];
  return <form onSubmit={handleSubmit} className="space-y-4" aria-label="Inscrição na newsletter" noValidate>
    <div className="space-y-2">
      <Label htmlFor={`${id}-email`}>Seu e-mail</Label>
      <Input id={`${id}-email`} name="email" type="email" autoComplete="email" inputMode="email" spellCheck={false} placeholder="voce@exemplo.com" className="min-h-12 bg-white text-base" required disabled={isPending} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onFocus={captureStart} onChange={captureStart} />
      {error && <p id={`${id}-error`} className="text-sm text-red-700">{error}</p>}
    </div>
    {!formState.success && formState.message && <p role="alert" className="text-sm text-red-700">{formState.message}</p>}
    <Button type="submit" className="w-full bg-amber-700 text-white hover:bg-amber-800" disabled={isPending} aria-busy={isPending}>
      {isPending && <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}{isPending ? "Enviando…" : "Receber a liturgia diária"}
    </Button>
  </form>;
}
