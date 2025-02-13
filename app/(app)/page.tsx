import NewsletterFormSignup from "@/app/(app)/newsletter-sigup-form";
import { Cross } from "lucide-react";

export default function Home() {
  return (
    <div className="text-center max-w-md mx-auto space-y-8">
      {/* Icon */}
      <div className="relative w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
        <Cross className="w-10 h-10 text-amber-800" />
      </div>
      {/* Heading */}
      <div className="space-y-4">
        <h1 className="text-3xl font-serif font-semibold text-slate-800 md:text-4xl">
          Newsletter da Liturgia Católica Diária
        </h1>
        <p className="text-slate-600 text-lg">
          Receba a liturgia católica diária em seu e-mail todas as manhãs.
        </p>
      </div>

      <p className="text-sm text-slate-600">Junte-se à nossa comunidade</p>
      {/* Subscriber count
    <p className="text-sm text-slate-600">
      Junte-se à nossa comunidade de{" "}
      <span className="font-medium text-slate-800">
        12.840 fiéis leitores
      </span>
    </p> */}
      <NewsletterFormSignup></NewsletterFormSignup>
      {/* Footer text */}
      <p className="text-xs text-slate-500 mt-4">
        Comece cada dia com a Palavra de Deus. Cancele quando quiser.
      </p>
      <p className="text-xs text-slate-500">
        Aceitamos sugestões, críticas ou dúvidas. Compartilhe também seu
        testemunho para futuras edições.
      </p>
      <p>
        <a
          href="/contact"
          className="text-xs text-amber-700 underline hover:text-amber-800"
        >
          Fale conosco
        </a>
      </p>
    </div>
  );
}
