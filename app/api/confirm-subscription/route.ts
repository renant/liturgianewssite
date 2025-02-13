import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone();
  const resend = new Resend(process.env.RESEND_API_KEY);

  const response = await resend.contacts.update({
    id: request.nextUrl.searchParams.get("id"),
    unsubscribed: false,
    audienceId: process.env.RESEND_AUDIENCE_ID ?? "",
  });

  if (response.error) {
    redirectUrl.pathname = "/error";
    return NextResponse.redirect(redirectUrl);
  }

  redirectUrl.pathname = "/subscription-confirmed";
  return NextResponse.redirect(redirectUrl);
}
