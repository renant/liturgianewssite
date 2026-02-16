import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Maria Silva",
        role: "Assinante há 2 anos",
        content:
            "Começar o dia lendo a liturgia transformou minha rotina. É prático e muito espiritual.",
    },
    {
        name: "João Santos",
        role: "Assinante há 6 meses",
        content:
            "A reflexão diária me ajuda muito a entender o Evangelho. Recomendo para todos da minha paróquia.",
    },
    {
        name: "Ana Oliveira",
        role: "Assinante há 1 ano",
        content:
            "Gosto muito da praticidade de receber no e-mail. Não preciso ficar procurando em sites diferentes.",
    },
];

export function TestimonialsSection() {
    return (
        <section
            className="py-16 bg-white w-full"
            aria-labelledby="testimonials-heading"
        >
            <div className="container mx-auto px-4 max-w-6xl">
                <h2
                    id="testimonials-heading"
                    className="text-2xl md:text-3xl font-serif font-bold text-center text-amber-900 mb-12"
                >
                    O que dizem nossos assinantes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="flex flex-col p-6 bg-amber-50/30 rounded-lg border border-amber-100"
                        >
                            <div className="flex gap-1 text-amber-500 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-muted-foreground italic mb-6 flex-grow">
                                "{testimonial.content}"
                            </p>
                            <div className="mt-auto">
                                <p className="font-medium text-amber-900">{testimonial.name}</p>
                                <p className="text-sm text-amber-700/80">{testimonial.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
