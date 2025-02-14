import { Button } from "@/components/ui/button";
import livePixImage from "@/public/livepix.png";
import { ExternalLink, Heart, Mail, Server } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Donate() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-serif font-semibold text-slate-800">
          Apoie Nossa Missão
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Ajude-nos a continuar levando a Palavra de Deus e as leituras diárias
          da liturgia para milhares de fiéis.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-serif font-semibold text-slate-800">
              Por que precisamos do seu apoio?
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Server className="w-5 h-5 text-amber-700 mt-1 flex-shrink-0" />
                <span className="text-slate-600">
                  Manutenção dos servidores para garantir que as newsletters
                  cheguem pontualmente todos os dias
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-amber-700 mt-1 flex-shrink-0" />
                <span className="text-slate-600">
                  Custos com serviços de email para enviar newsletters
                  diariamente
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-amber-700 mt-1 flex-shrink-0" />
                <span className="text-slate-600">
                  Desenvolvimento contínuo para melhorar a experiência dos
                  nossos leitores
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-serif font-semibold text-slate-800">
              Como doar?
            </h2>
            <p className="text-slate-600">
              Você pode fazer sua doação através do LivePix escaneando o QR Code
              ao lado ou clicando no botão abaixo.
            </p>
            <Button
              className="bg-amber-700 hover:bg-amber-800 text-white inline-flex items-center"
              asChild
            >
              <Link href="https://livepix.gg/liturgianews" target="_blank">
                Fazer Doação
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Image
              src={livePixImage}
              alt="QR Code para doação via LivePix"
              width={250}
              height={250}
              className="w-full h-auto"
            />
          </div>
          <p className="text-sm text-slate-500">livepix.gg/liturgianews</p>
        </div>
      </div>

      <div className="bg-amber-50 p-8 rounded-lg text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-serif font-semibold text-slate-800">
          Agradecemos seu Apoio
        </h2>
        <p className="text-slate-600">
          Cada doação nos ajuda a continuar nossa missão de levar a Palavra de
          Deus e as leituras diárias da liturgia para mais pessoas. Que Deus
          abençoe sua generosidade!
        </p>
        <div className="pt-4">
          <p className="text-sm text-slate-500 italic">
            &quot;Cada um dê conforme determinou em seu coração, não com pesar
            ou por obrigação, pois Deus ama quem dá com alegria.&quot;
          </p>
          <p className="text-sm text-slate-500 mt-2">- 2 Coríntios 9:7</p>
        </div>
      </div>
    </div>
  );
}
