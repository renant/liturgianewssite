import NewsletterFormSignup, { type NewsletterSource } from "@/app/(app)/newsletter-sigup-form";

export function NewsletterInline({ source }: { source: NewsletterSource }) {
  return (
    <aside
      aria-label="Receber o Evangelho por e-mail"
      className="newsletter-inline not-prose"
    >
      <p className="newsletter-inline-lead">
        Quer meditar o Evangelho todas as manhãs? Receba a liturgia diária gratuitamente no seu e-mail.
      </p>
      <NewsletterFormSignup
        source={source}
        submitLabel="Receber o Evangelho todo dia"
        formLabel="Inscrição rápida na newsletter"
        compact
      />
    </aside>
  );
}
