export function decodeRouteSegment(value: string): string | null {
  try {
    const decoded = decodeURIComponent(value).normalize("NFC");
    return decoded.includes("/") || decoded.includes("\\") ? null : decoded;
  } catch {
    return null;
  }
}
