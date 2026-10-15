import type { Metadata } from "next";
import { CheckCircle } from "lucide-react";
import { StatusPage } from "@/components/status-page";
import { EmailConfirmedTracker } from "@/components/analytics/liturgy-tracker";

export const metadata: Metadata = { title: "Inscrição confirmada", robots: { index: false, follow: true, googleBot: { index: false, follow: true } } };

export default function Page() {
  return <><EmailConfirmedTracker /><StatusPage icon={<CheckCircle className="size-10" />} eyebrow="Tudo pronto" title="Sua inscrição está confirmada">
    <p>A liturgia diária chegará ao seu e-mail nas próximas edições. Obrigado por acompanhar a LiturgiaNews.</p><p>Comece agora pelas leituras de hoje.</p>
  </StatusPage></>;
}
