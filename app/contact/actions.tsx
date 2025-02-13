"use server";
import ContactFormEmailTemplate from "@/components/emails/contact-email";
import { ActionResult } from "@/hooks/use-form-state";
import { Resend } from "resend";
import { z } from "zod";

type ContactData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const contactSchema = z.object({
  name: z.string().nonempty({ message: "Por favor, forneça seu nome." }),
  email: z
    .string()
    .email({ message: "Por favor, forneça um endereço de e-mail válido." }),
  subject: z.string().nonempty({ message: "Por favor, forneça um assunto." }),
  message: z.string().nonempty({ message: "Por favor, forneça uma mensagem." }),
});

export async function sendContact(
  data: FormData
): Promise<ActionResult<ContactData>> {
  try {
    const result = contactSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
      return {
        success: false,
        message: "Por favor, preencha todos os campos corretamente.",
        errors: result.error.flatten().fieldErrors,
      };
    }

    const { name, email, subject, message } = result.data;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const response = await resend.emails.send({
      from: "Liturgia do Dia <newsletter@liturgianews.site>",
      to: process.env.CONTACT_EMAIL,
      subject: "Formulário de Contato",
      react: await ContactFormEmailTemplate({ name, email, subject, message }),
    });

    if (response.error) {
      return {
        success: false,
        message: "Erro ao enviar mensagem. Por favor, tente novamente.",
        errors: null,
      };
    }

    return {
      success: true,
      message: "Mensagem enviada com sucesso.",
      errors: null,
      data: result.data as ContactData,
    };
  } catch {
    return {
      success: false,
      message: "Erro ao enviar mensagem. Por favor, tente novamente.",
      errors: null,
    };
  }
}
