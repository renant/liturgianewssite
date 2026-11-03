import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle } from "lucide-react";
import { StatusPage } from "@/components/status-page";
import { EmailConfirmedTracker } from "@/components/analytics/liturgy-tracker";

export const metadata: Metadata = {
  title: "Inscrição confirmada",
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function Page() {
  return (
    <>
      <Suspense fallback={null}>
        <EmailConfirmedTracker />
      </Suspense>
      <StatusPage
        icon={<CheckCircle className="size-10" />}
        eyebrow="Tudo pronto"
        title="Sua inscrição está confirmada"
      >
        <p>
          A liturgia diária chegará ao seu e-mail nas próximas edições. Obrigado por acompanhar a LiturgiaNews.
        </p>
        <p>
          Para garantir que a leitura chegue na caixa principal (e não no spam), adicione o remetente{" "}
          <strong className="font-medium text-slate-800">newsletter@liturgianews.site</strong> aos seus contatos.
        </p>
        <p>
          Comece agora pela{" "}
          <Link className="text-link" href="/liturgia/hoje">
            liturgia de hoje
          </Link>
          .
        </p>
      </StatusPage>
    </>
  );
}
