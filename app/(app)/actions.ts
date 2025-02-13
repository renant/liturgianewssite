"use server";
import { ActionResult } from "@/hooks/use-form-state";
import { Resend } from "resend";
import { z } from "zod";

type SubscribeData = {
  id: string;
  email: string;
};

const subscribeSchema = z.object({
  email: z
    .string()
    .email({ message: "Por favor, forneça um endereço de e-mail válido." }),
});

export async function subscribe(
  data: FormData
): Promise<ActionResult<SubscribeData>> {
  try {
    const result = subscribeSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
      return {
        success: false,
        message: "Por favor, forneça um endereço de e-mail válido.",
        errors: result.error.flatten().fieldErrors,
      };
    }

    const { email } = result.data;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const response = await resend.contacts.create({
      email: email,
      unsubscribed: true,
      audienceId: process.env.RESEND_AUDIENCE_ID ?? "",
    });

    if (response.error) {
      return {
        success: false,
        message: "Erro ao cadastrar e-mail. Por favor, tente novamente.",
        errors: null,
      };
    }

    return {
      success: true,
      message: "E-mail cadastrado com sucesso.",
      errors: null,
      data: {
        id: response.data?.id ?? "",
        email: email,
      },
    };
  } catch {
    return {
      success: false,
      message: "Erro ao cadastrar e-mail. Por favor, tente novamente.",
      errors: null,
    };
  }
}
