import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";
import Link from "next/link";

export default function SubscriptionConfirmed() {
  return (
    <div className="text-center max-w-md mx-auto space-y-8">
      <CheckCircle
        className="w-16 h-16 text-green-600 mx-auto"
        aria-label="Inscrição confirmada"
      />

      <div className="space-y-4">
        <h1 className="text-3xl font-serif font-semibold text-slate-800">
          Inscrição Confirmada!
        </h1>
        <p className="text-slate-600 text-lg">
          Bem-vindo à nossa comunidade de fiéis. Sua inscrição na Newsletter da
          Liturgia Católica Diária foi confirmada com sucesso.
        </p>
      </div>

      <p className="text-slate-600">
        Sua primeira newsletter chegará amanhã pela manhã. Prepare-se para
        começar seu dia com a Palavra de Deus!
      </p>

      <Button
        className="bg-amber-700 hover:bg-amber-800 text-white inline-flex items-center"
        asChild
      >
        <Link href="/">
          <Home className="w-4 h-4 mr-2" aria-label="Página inicial" />
          Voltar para a página inicial
        </Link>
      </Button>

      <p className="text-xs text-slate-500 mt-4">
        Se você tiver alguma dúvida ou precisar de ajuda, não hesite em entrar
        em contato conosco.
      </p>
    </div>
  );
}
