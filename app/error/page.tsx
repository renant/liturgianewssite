import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";

interface ErrorPageProps {
  statusCode?: number;
  title?: string;
  message?: string;
}

export default function DefaultErrorPage({
  statusCode = 500,
  title = "Ops! Algo deu errado",
  message = "Desculpe, encontramos um problema. Por favor, tente novamente mais tarde.",
}: ErrorPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-white p-4">
      <div className="text-center max-w-md mx-auto space-y-8">
        <AlertTriangle className="w-16 h-16 text-amber-600 mx-auto" />

        <div className="space-y-4">
          <h1 className="text-3xl font-serif font-semibold text-slate-800">
            {title}
          </h1>
          <p className="text-slate-600 text-lg">{message}</p>
          {statusCode && (
            <p className="text-sm text-slate-500">
              Código de erro: {statusCode}
            </p>
          )}
        </div>

        <Button
          className="bg-amber-700 hover:bg-amber-800 text-white inline-flex items-center"
          asChild
        >
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </Button>

        <p className="text-xs text-slate-500 mt-4">
          Se o problema persistir, por favor entre em contato com nosso suporte.
        </p>
      </div>
    </div>
  );
}
