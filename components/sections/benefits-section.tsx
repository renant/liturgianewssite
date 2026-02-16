import { BookOpen, Cross, MessageCircle } from "lucide-react";

const benefits = [
    {
        icon: BookOpen,
        title: "Leituras Diárias",
        description:
            "Acompanhe a primeira leitura, salmo e segunda leitura (quando houver) de forma organizada.",
    },
    {
        icon: Cross,
        title: "Santo Evangelho",
        description:
            "Receba o Evangelho do dia na íntegra, pronto para sua leitura e meditação matinal.",
    },
    {
        icon: MessageCircle,
        title: "Reflexão Espiritual",
        description:
            "Uma breve reflexão para ajudar você a aplicar a Palavra de Deus em sua vida cotidiana.",
    },
];

export function BenefitsSection() {
    return (
        <section
            className="py-16 bg-amber-50/50 w-full"
            aria-labelledby="benefits-heading"
        >
            <div className="container mx-auto px-4 max-w-6xl">
                <h2
                    id="benefits-heading"
                    className="text-2xl md:text-3xl font-serif font-bold text-center text-amber-900 mb-12"
                >
                    Tudo o que você precisa para sua oração diária
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-amber-100 hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-700">
                                <benefit.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-medium text-amber-800 mb-2">
                                {benefit.title}
                            </h3>
                            <p className="text-muted-foreground">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
