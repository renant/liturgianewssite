"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "@/hooks/use-form-state";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef } from "react";
import { subscribe } from "./actions";
import { captureError, captureEvent } from "@/lib/analytics";
import type { NewsletterSource } from "@/lib/newsletter";

export type { NewsletterSource } from "@/lib/newsletter";

export default function NewsletterFormSignup({
  source,
  submitLabel = "Receber a liturgia diária",
  compact = false,
  formLabel,
  ariaLabelledBy,
}: {
  source: NewsletterSource;
  submitLabel?: string;
  compact?: boolean;
  formLabel?: string;
  ariaLabelledBy?: string;
}) {
  const router = useRouter();
  const id = useId();
  const started = useRef(false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const captureStart = () => {
    if (started.current) return;
    started.current = true;
    captureEvent("newsletter_signup_start", { source });
  };
  const [formState, handleSubmit, isPending] = useFormState(subscribe, async (data) => {
    if (!data) return;
    const signupRef =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : undefined;
    try {
      const response = await fetch("/api/send-confirm-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.id,
          email: data.email,
          ref: signupRef,
          source,
        }),
      });
      if (response.ok) {
        captureEvent("newsletter_signup_completed", {
          source,
          ...(signupRef ? { signup_ref: signupRef } : {}),
        });
        router.push("/confirm-subscription");
      } else {
        captureError(new Error(`send-confirm-email returned ${response.status}`), {
          context: "newsletter_send_confirm_email",
          source,
        });
        router.push("/error");
      }
    } catch (err) {
      captureError(err, { context: "newsletter_send_confirm_email", source });
      router.push("/error");
    }
  });
  const error = formState.errors?.email?.[0];

  useEffect(() => {
    if (error) {
      emailInputRef.current?.focus();
    }
  }, [error]);

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? "space-y-3" : "space-y-4"}
      aria-label={ariaLabelledBy ? undefined : (formLabel ?? "Inscrição na newsletter")}
      aria-labelledby={ariaLabelledBy}
      noValidate
    >
      <div className={compact ? "flex flex-col gap-2.5 sm:flex-row sm:items-start" : "space-y-2"}>
        <div className={compact ? "flex-1 space-y-1.5" : "space-y-2"}>
          <Label htmlFor={`${id}-email`} className={compact ? "sr-only" : undefined}>
            Seu e-mail
          </Label>
          <Input
            ref={emailInputRef}
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            autoCorrect="off"
            autoCapitalize="none"
            enterKeyHint="send"
            spellCheck={false}
            placeholder="voce@exemplo.com"
            className="min-h-12 bg-white text-base"
            required
            disabled={isPending}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onFocus={captureStart}
            onChange={captureStart}
          />
          {error && (
            <p id={`${id}-error`} role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className={
            compact
              ? "min-h-12 shrink-0 bg-amber-700 px-5 text-white hover:bg-amber-800 sm:w-auto"
              : "w-full bg-amber-700 text-white hover:bg-amber-800"
          }
          disabled={isPending}
          aria-busy={isPending}
        >
          {isPending && (
            <Loader2
              className="size-4 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          )}
          {isPending ? "Enviando…" : submitLabel}
        </Button>
      </div>
      {!formState.success && formState.message && (
        <p role="alert" className="text-sm text-red-700">
          {formState.message}
        </p>
      )}
    </form>
  );
}
