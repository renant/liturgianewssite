export type SyntheticTrafficEnv = {
  webdriver?: boolean;
  userAgent?: string;
  languages?: readonly string[];
  viewportWidth?: number;
  referrer?: string;
  pathname?: string;
  now?: Date;
};

export type SyntheticTrafficResult = {
  skip: boolean;
  suspect: boolean;
  reasons: string[];
};

const BOT_UA_PATTERN = /HeadlessChrome|Lighthouse|Chrome-Lighthouse|PTST|GTmetrix|bot|crawler|spider/i;
const SUSPECT_PATHS = new Set(["/", "/donate", "/liturgia/hoje"]);

function isSuspectUtcWindow(date: Date): boolean {
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const totalMinutes = hour * 60 + minute;
  return (
    (totalMinutes >= 9 * 60 && totalMinutes <= 9 * 60 + 10) ||
    (totalMinutes >= 15 * 60 && totalMinutes <= 15 * 60 + 10)
  );
}

export function detectSyntheticTraffic(env: SyntheticTrafficEnv): SyntheticTrafficResult {
  const reasons: string[] = [];
  let skip = false;
  let suspect = false;

  if (env.webdriver === true) {
    skip = true;
    reasons.push("webdriver");
  }

  const ua = env.userAgent ?? "";
  if (BOT_UA_PATTERN.test(ua)) {
    skip = true;
    reasons.push("bot_user_agent");
  }

  if (Array.isArray(env.languages) && env.languages.length === 0) {
    skip = true;
    reasons.push("empty_languages");
  }

  const now = env.now ?? new Date();
  const referrer = (env.referrer ?? "").trim();
  const pathname = env.pathname ?? "";

  if (
    env.viewportWidth === 1920 &&
    referrer === "" &&
    SUSPECT_PATHS.has(pathname) &&
    isSuspectUtcWindow(now)
  ) {
    suspect = true;
    reasons.push("datacenter_schedule_1920");
  }

  return { skip, suspect, reasons };
}
