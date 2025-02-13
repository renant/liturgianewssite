import EmailConfirmation from "@/components/emails/email-confirmation";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET(request: NextRequest) {
  const mainUrl = request.nextUrl.clone();
  const resend = new Resend(process.env.RESEND_API_KEY);

  const id = request.nextUrl.searchParams.get("id");
  const email = request.nextUrl.searchParams.get("email");

  if (!id) {
    return NextResponse.json({ error: "ID não encontrado" }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json(
      { error: "E-mail não encontrado" },
      { status: 400 }
    );
  }

  const response = await resend.emails.send({
    from: "Liturgia do Dia <newsletter@liturgianews.site>",
    to: email,
    subject: "Confirme seu e-mail",
    react: await EmailConfirmation({
      confirmationLink: `${mainUrl.origin}/api/confirm-subscription?id=${id}`,
    }),
  });

  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: 500 });
  }

  return NextResponse.json(
    { message: "E-mail enviado com sucesso" },
    { status: 200 }
  );
}
