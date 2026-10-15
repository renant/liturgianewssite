import type { Metadata } from "next";
import { MailCheck } from "lucide-react";
import { StatusPage } from "@/components/status-page";

export const metadata: Metadata = { title: "Confirme seu e-mail", robots: { index: false, follow: true, googleBot: { index: false, follow: true } } };

export default function Page() {
  return <StatusPage icon={<MailCheck className="size-10" />} eyebrow="Sua inscrição" title="Confirme seu e-mail">
    <p>Após se inscrever, abra a mensagem da LiturgiaNews e clique no link de confirmação para começar a receber a liturgia diária.</p>
    <ol className="list-decimal space-y-3 pl-5"><li>Procure a mensagem na sua caixa de entrada.</li><li>Se não encontrar, verifique a pasta de spam e confirme se o endereço informado está correto.</li></ol>
    <p>Enquanto isso, você já pode acompanhar as leituras no site.</p>
  </StatusPage>;
}
