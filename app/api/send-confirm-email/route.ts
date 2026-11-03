import EmailConfirmation from "@/components/emails/email-confirmation";
import {
  buildConfirmSubscriptionUrl,
  isValidNewsletterSource,
  isValidSignupRef,
} from "@/lib/newsletter";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

type SendConfirmPayload = {
  id: string | null;
  email: string | null;
  ref: string | null;
  source: string | null;
};

async function sendConfirmationEmail(
  origin: string,
  payload: SendConfirmPayload,
) {
  const { id, email, ref, source } = payload;

  if (!id) {
    return NextResponse.json({ error: "ID não encontrado" }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json(
      { error: "E-mail não encontrado" },
      { status: 400 },
    );
  }

  const validRef = isValidSignupRef(ref) ? ref.trim() : null;
  const validSource = isValidNewsletterSource(source) ? source : null;

  const confirmationLink = buildConfirmSubscriptionUrl(origin, {
    id,
    ref: validRef,
    source: validSource,
  });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from: "Liturgia do Dia <newsletter@liturgianews.site>",
    to: email,
    subject: "Confirme seu e-mail",
    react: await EmailConfirmation({
      confirmationLink,
    }),
  });

  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: 500 });
  }

  return NextResponse.json(
    { message: "E-mail enviado com sucesso" },
    { status: 200 },
  );
}

export async function POST(request: NextRequest) {
  let body: Partial<Record<string, unknown>> = {};
  try {
    body = (await request.json()) as Partial<Record<string, unknown>>;
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  return sendConfirmationEmail(request.nextUrl.origin, {
    id: typeof body.id === "string" ? body.id : request.nextUrl.searchParams.get("id"),
    email:
      typeof body.email === "string"
        ? body.email
        : request.nextUrl.searchParams.get("email"),
    ref:
      typeof body.ref === "string"
        ? body.ref
        : request.nextUrl.searchParams.get("ref"),
    source:
      typeof body.source === "string"
        ? body.source
        : request.nextUrl.searchParams.get("source"),
  });
}

export async function GET(request: NextRequest) {
  return sendConfirmationEmail(request.nextUrl.origin, {
    id: request.nextUrl.searchParams.get("id"),
    email: request.nextUrl.searchParams.get("email"),
    ref: request.nextUrl.searchParams.get("ref"),
    source: request.nextUrl.searchParams.get("source"),
  });
}
