"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormState } from "@/hooks/use-form-state";
import { Loader2, Send } from "lucide-react";
import { useEffect, useRef } from "react";
import { sendContact } from "./actions";

const fields = [
  { name: "name", label: "Nome", type: "text", autoComplete: "name", placeholder: "Seu nome", enterKeyHint: "next" as const },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email", inputMode: "email" as const, autoCorrect: "off", autoCapitalize: "none", placeholder: "voce@exemplo.com", enterKeyHint: "next" as const },
  { name: "subject", label: "Assunto", type: "text", autoComplete: "off", placeholder: "Sobre o que você quer conversar?", enterKeyHint: "next" as const },
];

export default function ContactForm() {
  const [formState, handleSubmit, isPending] = useFormState(sendContact);
  const formRef = useRef<HTMLFormElement | null>(null);
  const errors = formState.errors;

  useEffect(() => {
    if (!errors) return;
    const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    firstInvalid?.focus();
  }, [errors]);

  return <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" aria-label="Formulário de contato" noValidate>
    <p className="text-sm text-slate-600">Todos os campos são obrigatórios.</p>
    {fields.map(field => <div key={field.name} className="space-y-2">
      <Label htmlFor={`contact-${field.name}`}>{field.label}</Label>
      <Input id={`contact-${field.name}`} {...field} className="min-h-12 bg-white text-base" spellCheck={field.type !== "email"} required disabled={isPending} aria-invalid={Boolean(errors?.[field.name])} aria-describedby={errors?.[field.name] ? `contact-${field.name}-error` : undefined} />
      {errors?.[field.name] && <p id={`contact-${field.name}-error`} role="alert" className="text-sm text-red-700">{errors[field.name][0]}</p>}
    </div>)}
    <div className="space-y-2"><Label htmlFor="contact-message">Mensagem</Label><Textarea id="contact-message" name="message" required rows={6} className="resize-y bg-white text-base" placeholder="Escreva sua mensagem…" disabled={isPending} aria-invalid={Boolean(errors?.message)} aria-describedby={errors?.message ? "contact-message-error" : undefined} />{errors?.message && <p id="contact-message-error" role="alert" className="text-sm text-red-700">{errors.message[0]}</p>}</div>
    {!formState.success && formState.message && <p role="alert" className="text-sm text-red-700">{formState.message}</p>}
    <Button type="submit" className="w-full bg-amber-700 text-white hover:bg-amber-800 sm:w-auto" disabled={isPending} aria-busy={isPending}>{isPending ? <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}{isPending ? "Enviando…" : "Enviar mensagem"}</Button>
    {formState.success && <p role="status" className="text-sm text-green-800">{formState.message}</p>}
  </form>;
}
