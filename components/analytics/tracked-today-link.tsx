"use client";

import { captureEvent } from "@/lib/analytics";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

export function TrackedTodayLink(props: Omit<ComponentProps<typeof Link>, "href">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      href="/liturgia/hoje"
      onClick={(event) => {
        captureEvent("liturgy_today_click", { from: pathname });
        props.onClick?.(event);
      }}
    />
  );
}
