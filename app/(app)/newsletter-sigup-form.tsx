"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "@/hooks/use-form-state";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { subscribe } from "./actions";

export default function NewsletterFormSignup() {
  const router = useRouter();
  const [formState, handleSubmit, isPending] = useFormState(
    subscribe,
    async (data) => {
      if (!data) return;

      const response = await fetch(
        `/api/send-confirm-email?id=${data.id}&email=${data.email}`
      );

      if (response.ok) {
        router.push("/confirm-subscription");
      } else {
        router.push("/error");
      }
    }
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      aria-label="Formulário de inscrição na newsletter"
      noValidate
    >
      {formState.success === false && formState.message && (
        <Alert variant="destructive" role="alert">
          <AlertTriangle className="size-4" aria-hidden="true" />
          <AlertTitle>Erro ao se inscrever!</AlertTitle>
          <AlertDescription>{formState.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="sr-only">
          Endereço de e-mail
        </Label>
        <Input
          type="email"
          placeholder="Seu endereço de e-mail"
          className="w-full text-center"
          name="email"
          id="email"
          required
          aria-required="true"
          aria-describedby="email-description"
          autoComplete="email"
          disabled={isPending}
        />
        <p id="email-description" className="sr-only">
          Digite seu e-mail para receber a liturgia diária gratuitamente
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        disabled={isPending}
        aria-busy={isPending}
        aria-label={
          isPending
            ? "Processando inscrição..."
            : "Receber Liturgia Diária gratuitamente"
        }
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" aria-hidden="true" />
            <span>Processando...</span>
          </>
        ) : (
          "Receber Liturgia Diária"
        )}
      </Button>
    </form>
  );
}
