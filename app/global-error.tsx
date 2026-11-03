"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { captureError } from "@/lib/analytics";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureError(error, {
      boundary: "global_error",
      ...(error.digest ? { digest: error.digest } : {}),
    });
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <div className="site-shell">
          <main className="site-main site-container">
            <section className="status-page" aria-labelledby="global-error-title">
              <AlertCircle className="status-icon" aria-hidden="true" />
              <p className="eyebrow">Erro inesperado</p>
              <h1 id="global-error-title" className="page-title">
                Não foi possível carregar esta página
              </h1>
              <p className="page-description mt-4">
                Ocorreu uma falha temporária. Você pode tentar novamente ou seguir direto para a liturgia de hoje.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="inline-flex min-h-11 items-center rounded-md bg-amber-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-800"
                >
                  Tentar novamente
                </button>
                <Link
                  href="/liturgia/hoje"
                  className="text-link inline-flex min-h-11 items-center text-sm"
                >
                  Abrir a liturgia de hoje
                </Link>
              </div>
            </section>
          </main>
        </div>
      </body>
    </html>
  );
}
