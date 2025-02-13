import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Shield } from "lucide-react";
import Link from "next/link";

export default function ConfirmSubscription() {
  return (
    <div className="text-center max-w-md mx-auto space-y-8">
      <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />

      <div className="space-y-4">
        <h1 className="text-3xl font-serif font-semibold text-slate-800">
          Quase lá!
        </h1>
        <p className="text-slate-600 text-lg">
          Verifique seu e-mail para confirmar sua inscrição na Newsletter da
          Liturgia Católica Diária.
        </p>
      </div>

      <div className="space-y-6 text-left">
        <div className="flex items-start space-x-3">
          <Mail className="w-6 h-6 text-amber-700 mt-1 flex-shrink-0" />
          <div>
            <h2 className="font-medium text-slate-800">Verifique seu e-mail</h2>
            <p className="text-sm text-slate-600">
              Enviamos um e-mail de confirmação. Clique no link para ativar sua
              inscrição.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-amber-700 mt-1 flex-shrink-0" />
          <div>
            <h2 className="font-medium text-slate-800">
              Verifique a pasta de spam
            </h2>
            <p className="text-sm text-slate-600">
              Se não encontrar o e-mail na caixa de entrada, verifique sua pasta
              de spam ou lixo eletrônico.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-medium text-slate-800 mb-2">
            Adicione-nos aos seus contatos
          </h2>
          <p className="text-sm text-slate-600">
            Para garantir que você sempre receba nossas mensagens, adicione
            nosso endereço de e-mail à sua lista de contatos:
          </p>
          <ol className="list-decimal list-inside text-sm text-slate-600 mt-2 space-y-1">
            <li>Abra o e-mail de confirmação</li>
            <li>Adicione o remetente aos seus contatos</li>
            <li>
              Mova o e-mail para a caixa de entrada principal, se necessário
            </li>
          </ol>
        </div>
      </div>

      <Button
        className="w-full bg-amber-700 hover:bg-amber-800 text-white"
        asChild
      >
        <Link href="/">Voltar para a página inicial</Link>
      </Button>

      <p className="text-xs text-slate-500 mt-4">
        Se você não receber o e-mail em alguns minutos, verifique se digitou o
        endereço corretamente.
      </p>
    </div>
  );
}
