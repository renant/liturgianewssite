import Link from "next/link";
import NewsletterFormSignup from "@/app/(app)/newsletter-sigup-form";

export function NewsletterPanel({ source = "home" }: { source?: "home" | "liturgia_hoje" | "liturgia_datada" }) {
  return <section id="newsletter" aria-labelledby="newsletter-title" className="newsletter-panel">
    <p className="eyebrow">Um hábito de fé</p><h2 id="newsletter-title">A Palavra, todas as manhãs.</h2>
    <p className="mb-5 mt-3">Receba a liturgia diária gratuitamente por e-mail.</p>
    <NewsletterFormSignup source={source} />
    <p className="mt-4 text-xs">Gratuita. Cancele quando quiser. <Link className="text-link" href="/privacidade">Saiba como cuidamos dos seus dados.</Link></p>
  </section>;
}
