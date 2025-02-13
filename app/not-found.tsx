import { Home } from "lucide-react";
import Link from "next/link";

export default async function NotFound() {
  return (
    <div className="text-center max-w-md mx-auto space-y-8">
      <div className="space-y-4">
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
      </div>
      v
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-700">
          Você pode tentar:
        </h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className="text-amber-700 hover:underline inline-flex items-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar para a página inicial
            </Link>
          </li>
        </ul>
      </div>
      <p className="text-sm text-slate-500 mt-8">
        Se você acredita que isso é um erro, por favor{" "}
        <Link href="/contact" className="text-amber-700 hover:underline">
          entre em contato conosco
        </Link>
        .
      </p>
    </div>
  );
}
