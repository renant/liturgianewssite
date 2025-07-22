"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormState } from "@/hooks/use-form-state";
import { AlertTriangle, CheckCircle, Loader2, Send } from "lucide-react";
import { sendContact } from "./actions";

export default function ContactForm() {
  const [formState, handleSubmit, isPending] = useFormState(sendContact);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4"
      aria-label="Formulário de contato"
      noValidate
    >
      {formState.success === false && formState.message && (
        <Alert variant="destructive" role="alert">
          <AlertTriangle className="size-4" aria-hidden="true" />
          <AlertTitle>Erro ao enviar mensagem!</AlertTitle>
          <AlertDescription>{formState.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">
          Nome <span className="text-red-500" aria-label="campo obrigatório">*</span>
        </Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="Seu nome completo" 
          required 
          aria-required="true"
          autoComplete="name"
          disabled={isPending}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">
          E-mail <span className="text-red-500" aria-label="campo obrigatório">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          required
          aria-required="true"
          autoComplete="email"
          disabled={isPending}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subject">
          Assunto <span className="text-red-500" aria-label="campo obrigatório">*</span>
        </Label>
        <Input
          id="subject"
          name="subject"
          placeholder="Assunto da mensagem"
          required
          aria-required="true"
          disabled={isPending}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">
          Mensagem <span className="text-red-500" aria-label="campo obrigatório">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Sua mensagem..."
          required
          aria-required="true"
          rows={5}
          className="resize-none"
          disabled={isPending}
        />
      </div>
      
      <Button
        type="submit"
        className="w-full bg-amber-700 hover:bg-amber-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        disabled={isPending}
        aria-busy={isPending}
        aria-label={isPending ? "Enviando mensagem..." : "Enviar mensagem de contato"}
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" aria-hidden="true" />
            <span>Enviando...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" aria-hidden="true" />
            Enviar Mensagem
          </>
        )}
      </Button>

      {formState.success && formState.message && (
        <Alert variant="default" role="status">
          <CheckCircle className="size-4 text-green-600" aria-hidden="true" />
          <AlertTitle>Sucesso!</AlertTitle>
          <AlertDescription>{formState.message}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
