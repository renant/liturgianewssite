"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {formState.success === false && formState.message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4"></AlertTriangle>
          <AlertTitle>Erro ao se inscrever!</AlertTitle>
          <AlertDescription>{formState.message}</AlertDescription>
        </Alert>
      )}

      <Input
        type="email"
        placeholder="Seu endereço de e-mail"
        className="w-full text-center"
        name="email"
        id="email"
      />
      <Button
        type="submit"
        className="w-full bg-amber-700 hover:bg-amber-800 text-white"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Inscreva-se (Grátis)"
        )}
      </Button>
    </form>
  );
}
