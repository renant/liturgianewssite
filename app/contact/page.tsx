import ContactForm from "./contact-form";

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-serif font-semibold text-slate-800">
          Entre em Contato
        </h1>
        <p className="text-slate-600 text-lg">
          Estamos aqui para ajudar. Envie-nos sua mensagem e responderemos o
          mais breve possível.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ContactForm></ContactForm>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-serif font-semibold text-slate-800">
              Perguntas Frequentes
            </h2>
            <ul className="space-y-3">
              <li>
                <h3 className="font-medium text-slate-700">
                  Como faço para me inscrever na newsletter?
                </h3>
                <p className="text-slate-600">
                  Visite nossa página inicial e preencha o formulário de
                  inscrição.
                </p>
              </li>
              <li>
                <h3 className="font-medium text-slate-700">
                  Posso cancelar minha inscrição a qualquer momento?
                </h3>
                <p className="text-slate-600">
                  Sim, você pode cancelar sua inscrição através do link no
                  rodapé de qualquer e-mail que enviamos.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
