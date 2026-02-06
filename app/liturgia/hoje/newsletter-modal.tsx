"use client";

import NewsletterFormSignup from "@/app/(app)/newsletter-sigup-form";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NewsletterModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Track if component has mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const dismissed = sessionStorage.getItem("ln_newsletter_dismissed");
    if (dismissed === "true") {
      setIsOpen(false);
      return;
    }
    const timer = setTimeout(() => setIsOpen(true), 300);
    return () => clearTimeout(timer);
  }, [mounted]);

  const handleClose = () => {
    sessionStorage.setItem("ln_newsletter_dismissed", "true");
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    modalRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-modal-title"
      aria-describedby="newsletter-modal-description"
    >
      <button
        className="absolute inset-0 bg-black/50 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        onClick={handleClose}
        aria-label="Fechar modal"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") handleClose();
        }}
      />
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-md rounded-lg bg-white shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        <button
          onClick={handleClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="p-6">
          <h2
            id="newsletter-modal-title"
            className="mb-2 text-xl font-semibold text-foreground"
          >
            Receba a Liturgia de hoje por e-mail
          </h2>
          <p
            id="newsletter-modal-description"
            className="mb-4 text-sm text-muted-foreground"
          >
            Inscreva-se gratuitamente e receba a liturgia diária no seu e-mail.
          </p>
          <NewsletterFormSignup />
          <p className="mt-3 text-xs text-muted-foreground">
            Prometemos não enviar spam. Você pode cancelar a inscrição quando
            quiser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterModal;
