export const NEWSLETTER_SOURCES = [
  "home",
  "liturgia_hoje",
  "liturgia_datada",
  "liturgia_hoje_evangelho",
  "liturgia_datada_evangelho",
  "tempo_liturgico",
  "acompanhar",
  "lectio_divina",
  "blog",
  "header",
] as const;

export type NewsletterSource = (typeof NEWSLETTER_SOURCES)[number];

const SOURCE_SET = new Set<string>(NEWSLETTER_SOURCES);
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidNewsletterSource(value: unknown): value is NewsletterSource {
  return typeof value === "string" && SOURCE_SET.has(value);
}

export function isValidSignupRef(value: unknown): value is string {
  return typeof value === "string" && UUID_REGEX.test(value.trim());
}

export function buildConfirmSubscriptionUrl(
  origin: string,
  params: { id: string; ref?: string | null; source?: string | null },
): string {
  const url = new URL("/api/confirm-subscription", origin);
  url.searchParams.set("id", params.id);
  if (isValidSignupRef(params.ref)) {
    url.searchParams.set("ref", params.ref.trim());
  }
  if (isValidNewsletterSource(params.source)) {
    url.searchParams.set("source", params.source);
  }
  return url.toString();
}

export function buildConfirmedRedirectPath(params: {
  ref?: string | null;
  source?: string | null;
}): string {
  const query = new URLSearchParams();
  if (isValidSignupRef(params.ref)) {
    query.set("ref", params.ref.trim());
  }
  if (isValidNewsletterSource(params.source)) {
    query.set("source", params.source);
  }
  const search = query.toString();
  return search ? `/subscription-confirmed?${search}` : "/subscription-confirmed";
}

export function hasLocalNewsletterAnchor(pathname: string): boolean {
  if (
    pathname === "/" ||
    pathname === "/tempo-liturgico" ||
    pathname === "/acompanhar" ||
    pathname === "/lectio-divina" ||
    pathname === "/liturgia/hoje"
  ) {
    return true;
  }
  if (
    pathname.startsWith("/liturgia/") &&
    pathname !== "/liturgia" &&
    !pathname.startsWith("/liturgia/calendario")
  ) {
    return true;
  }
  return false;
}
