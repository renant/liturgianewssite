export const DEFAULT_ADSENSE_CLIENT_ID = "ca-pub-9729996201347510";
export const DEFAULT_ADSENSE_SLOT_LITURGY_MID = "7536712146";
export const DEFAULT_ADSENSE_SLOT_LITURGY_BOTTOM = "1431514972";

export type AdSenseConfig = {
  clientId: string | null;
  publisherId: string | null;
  midSlot: string | null;
  bottomSlot: string | null;
  previewEnabled: boolean;
};

const PUBLISHER_PATTERN = /^(?:ca-)?(pub-\d{16})$/;
const SLOT_PATTERN = /^\d{6,20}$/;

export function parseAdSenseIds(rawClientId?: string | null): {
  clientId: string | null;
  publisherId: string | null;
} {
  const trimmed = rawClientId?.trim() ?? "";
  if (!trimmed || trimmed === "off" || trimmed === "false") {
    return { clientId: null, publisherId: null };
  }
  const match = PUBLISHER_PATTERN.exec(trimmed);
  if (!match) {
    return { clientId: null, publisherId: null };
  }
  const publisherId = match[1];
  return {
    clientId: `ca-${publisherId}`,
    publisherId,
  };
}

export function parseAdSenseSlot(rawSlot?: string | null): string | null {
  const trimmed = rawSlot?.trim() ?? "";
  if (!trimmed || trimmed === "off" || trimmed === "false") {
    return null;
  }
  return SLOT_PATTERN.test(trimmed) ? trimmed : null;
}

export function buildAdsTxt(publisherId: string): string {
  return `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;
}

export function buildAdSenseMetaOther(
  clientId: string | null,
): Record<string, string> | undefined {
  if (!clientId) return undefined;
  return {
    "google-adsense-account": clientId,
  };
}

export function isLocalHostname(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".local")
  );
}

export function getAdSenseConfig(env?: {
  clientId?: string | null;
  midSlot?: string | null;
  bottomSlot?: string | null;
  preview?: string | null;
  nodeEnv?: string | null;
}): AdSenseConfig {
  const rawClient = env
    ? env.clientId
    : (process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || DEFAULT_ADSENSE_CLIENT_ID);
  const rawMid = env
    ? env.midSlot
    : (process.env.NEXT_PUBLIC_ADSENSE_SLOT_LITURGY_MID || DEFAULT_ADSENSE_SLOT_LITURGY_MID);
  const rawBottom = env
    ? env.bottomSlot
    : (process.env.NEXT_PUBLIC_ADSENSE_SLOT_LITURGY_BOTTOM || DEFAULT_ADSENSE_SLOT_LITURGY_BOTTOM);
  const rawPreview = env ? env.preview : process.env.NEXT_PUBLIC_ADSENSE_PREVIEW;
  const nodeEnv = env ? env.nodeEnv : process.env.NODE_ENV;

  const { clientId, publisherId } = parseAdSenseIds(rawClient);

  return {
    clientId,
    publisherId,
    midSlot: parseAdSenseSlot(rawMid),
    bottomSlot: parseAdSenseSlot(rawBottom),
    previewEnabled: rawPreview === "true" && nodeEnv !== "test",
  };
}
