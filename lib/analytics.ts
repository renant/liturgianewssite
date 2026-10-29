"use client";

export type AnalyticsProperties = Record<string, string | boolean>;

export type AnalyticsClient = {
  capture: (name: string, properties?: AnalyticsProperties) => void;
};

export function createAnalyticsTracker() {
  let client: AnalyticsClient | null = null;
  const queue: Array<{ name: string; properties?: AnalyticsProperties }> = [];

  return {
    capture(name: string, properties?: AnalyticsProperties) {
      if (client) {
        client.capture(name, properties);
        return;
      }
      queue.push({ name, properties });
    },
    attachClient(readyClient: AnalyticsClient) {
      client = readyClient;
      while (queue.length > 0) {
        const event = queue.shift()!;
        client.capture(event.name, event.properties);
      }
    },
  };
}

const tracker = createAnalyticsTracker();

export function attachAnalyticsClient(client: AnalyticsClient) {
  tracker.attachClient(client);
}

export function captureEvent(name: string, properties?: AnalyticsProperties) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || typeof window === "undefined") return;
  tracker.capture(name, properties);
}
