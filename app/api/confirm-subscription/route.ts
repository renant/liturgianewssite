import { buildConfirmedRedirectPath, resolvePublicOrigin } from "@/lib/newsletter";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET(request: NextRequest) {
  const publicOrigin = resolvePublicOrigin({
    nextUrlOrigin: request.nextUrl.origin,
    headers: request.headers,
  });
  const resend = new Resend(process.env.RESEND_API_KEY);

  const id = request.nextUrl.searchParams.get("id");
  const ref = request.nextUrl.searchParams.get("ref");
  const source = request.nextUrl.searchParams.get("source");

  const response = await resend.contacts.update({
    id: id ?? undefined,
    unsubscribed: false,
    audienceId: process.env.RESEND_AUDIENCE_ID ?? "",
  });

  if (response.error) {
    return NextResponse.redirect(new URL("/error", publicOrigin));
  }

  const confirmedPath = buildConfirmedRedirectPath({ ref, source });
  return NextResponse.redirect(new URL(confirmedPath, publicOrigin));
}
