"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormState } from "@/hooks/use-form-state";
import { AlertTriangle, Loader2, Send } from "lucide-react";
import { sendContact } from "./actions";

export default function ContactForm() {
  const [formState, handleSubmit, isPending] = useFormState(sendContact);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formState.success === false && formState.message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4"></AlertTriangle>
          <AlertTitle>Erro ao se inscrever!</AlertTitle>
          <AlertDescription>{formState.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" placeholder="Seu nome completo" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Assunto</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="Assunto da mensagem"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Mensagem</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Sua mensagem..."
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-amber-700 hover:bg-amber-800 text-white"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            {" "}
            <Send className="w-4 h-4 mr-2" />
            Enviar Mensagem
          </>
        )}
      </Button>

      {formState.success && formState.message && (
        <Alert variant="default">
          <AlertTitle>Sucesso!</AlertTitle>
          <AlertDescription>{formState.message}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
