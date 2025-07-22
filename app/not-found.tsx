import { Home, BookOpen, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página Não Encontrada - LiturgiaNews",
  description: "A página que você está procurando não foi encontrada. Volte para a página inicial ou navegue pelo nosso conteúdo.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NotFound() {
  return (
    <div className="text-center max-w-md mx-auto space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-serif font-semibold text-slate-800">
          404
        </h1>
        <h2 className="text-2xl font-serif font-semibold text-slate-700">
          Página Não Encontrada
        </h2>
        <p className="text-slate-600 text-lg">
          Desculpe, não conseguimos encontrar a página que você está procurando.
          Ela pode ter sido movida ou não existe mais.
        </p>
      </header>

      <nav aria-label="Opções de navegação" className="space-y-4">
        <h3 className="text-lg font-medium text-slate-700">
          Você pode tentar:
        </h3>
        <ul className="space-y-3" role="list">
          <li>
            <Link
              href="/"
              className="text-amber-700 hover:text-amber-800 hover:underline inline-flex items-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
              aria-label="Voltar para a página inicial"
            >
              <Home className="w-4 h-4 mr-2" aria-hidden="true" />
              Voltar para a página inicial
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="text-amber-700 hover:text-amber-800 hover:underline inline-flex items-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
              aria-label="Visitar nosso blog"
            >
              <BookOpen className="w-4 h-4 mr-2" aria-hidden="true" />
              Visitar nosso blog
            </Link>
          </li>
          <li>
            <Link
              href="/liturgia"
              className="text-amber-700 hover:text-amber-800 hover:underline inline-flex items-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
              aria-label="Ver liturgias diárias"
            >
              <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
              Ver liturgias diárias
            </Link>
          </li>
        </ul>
      </nav>

      <footer className="text-sm text-slate-500 mt-8">
        Se você acredita que isso é um erro, por favor{" "}
        <Link 
          href="/contact" 
          className="text-amber-700 hover:text-amber-800 hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
          aria-label="Entre em contato conosco para reportar o erro"
        >
          entre em contato conosco
        </Link>
        .
      </footer>
    </div>
  );
}
