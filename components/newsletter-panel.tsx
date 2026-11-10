import Link from "next/link";
import NewsletterFormSignup, { type NewsletterSource } from "@/app/(app)/newsletter-sigup-form";

export function NewsletterPanel({ source }: { source: NewsletterSource }) {
  const isLiturgyPage = source === "liturgia_hoje" || source === "liturgia_datada";
  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className="newsletter-panel">
      <p className="eyebrow">Um hábito de fé</p>
      <h2 id="newsletter-title">
        {isLiturgyPage ? "Receba amanhã cedo o Evangelho de amanhã" : "A Palavra, todas as manhãs."}
      </h2>
      <p className="mb-5 mt-3">
        {isLiturgyPage
          ? "Crie o hábito diário: leituras, salmo e Evangelho gratuitamente no seu e-mail antes do dia começar."
          : "Receba a liturgia diária gratuitamente por e-mail."}
      </p>
      <NewsletterFormSignup source={source} ariaLabelledBy="newsletter-title" />
      <p className="mt-4 text-xs">
        Gratuita. Cancele quando quiser.{" "}
        <Link className="text-link" href="/privacidade">
          Saiba como cuidamos dos seus dados.
        </Link>
      </p>
    </section>
  );
}
