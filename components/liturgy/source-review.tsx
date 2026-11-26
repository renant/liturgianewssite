import Link from "next/link";

export function SourceReview() {
  return (
    <section
      className="my-8 rounded-lg border border-amber-200/80 bg-white/60 p-4 text-sm leading-relaxed text-slate-700 sm:p-5"
      aria-labelledby="source-review-title"
    >
      <h2
        id="source-review-title"
        className="font-serif text-base font-semibold text-slate-900"
      >
        Fonte e revisão
      </h2>
      <ul className="mt-2 space-y-1.5">
        <li>
          Leituras segundo o Lecionário da CNBB, conferidas com a{" "}
          <a
            href="https://liturgia.cancaonova.com/pb/"
            className="text-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            liturgia diária da Canção Nova
          </a>
          .
        </li>
        <li>A reflexão do Evangelho é produzida pela equipe da LiturgiaNews.</li>
        <li>
          Encontrou algum erro? <Link href="/contact" className="text-link">Avise pelo formulário de contato</Link>.
        </li>
        <li>
          Saiba como trabalhamos na{" "}
          <Link href="/politica-editorial" className="text-link">
            política editorial
          </Link>
          .
        </li>
      </ul>
    </section>
  );
}
