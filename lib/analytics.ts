"use client";

export type AnalyticsProperties = Record<string, string | boolean>;

export type AnalyticsClient = {
  capture: (name: string, properties?: AnalyticsProperties) => void;
  captureException?: (error: unknown, properties?: AnalyticsProperties) => void;
};

type QueuedItem =
  | { kind: "event"; name: string; properties?: AnalyticsProperties }
  | { kind: "exception"; error: unknown; properties?: AnalyticsProperties };

function flushException(
  client: AnalyticsClient,
  error: unknown,
  properties?: AnalyticsProperties,
) {
  if (typeof client.captureException === "function") {
    client.captureException(error, properties);
    return;
  }
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "unknown_error";
  client.capture("$exception", {
    $exception_message: message,
    ...(properties ?? {}),
  });
}

export function createAnalyticsTracker() {
  let client: AnalyticsClient | null = null;
  const queue: QueuedItem[] = [];

  return {
    capture(name: string, properties?: AnalyticsProperties) {
      if (client) {
        client.capture(name, properties);
        return;
      }
      queue.push({ kind: "event", name, properties });
    },
    captureError(error: unknown, properties?: AnalyticsProperties) {
      if (client) {
        flushException(client, error, properties);
        return;
      }
      queue.push({ kind: "exception", error, properties });
    },
    attachClient(readyClient: AnalyticsClient) {
      client = readyClient;
      while (queue.length > 0) {
        const item = queue.shift()!;
        if (item.kind === "event") {
          client.capture(item.name, item.properties);
        } else {
          flushException(client, item.error, item.properties);
        }
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

export function captureError(error: unknown, context?: AnalyticsProperties) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || typeof window === "undefined") return;
  tracker.captureError(error, context);
}
