"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MONTH_NAMES } from "@/lib/liturgical-date";
import {
  groupCalendarMonthsByYear,
  type CalendarMonthItem,
} from "@/lib/liturgy-calendar";

export function CalendarPicker({
  year,
  month,
  months,
}: {
  year: number;
  month: number;
  months: CalendarMonthItem[];
}) {
  const pathname = usePathname();
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const groups = groupCalendarMonthsByYear(months);
  const [jsReady, setJsReady] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(year);

  useEffect(() => {
    setJsReady(true);
  }, []);

  useEffect(() => {
    setSelectedYear(year);
  }, [year]);

  // Fechar o picker ao navegar entre rotas
  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  }, [pathname]);

  // Fechar ao tocar fora ou pressionar Escape
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const details = detailsRef.current;
      if (!details || !details.open) return;
      if (event.target instanceof Node && !details.contains(event.target)) {
        details.open = false;
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      const details = detailsRef.current;
      if (!details || !details.open) return;
      if (event.key === "Escape") {
        details.open = false;
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, { passive: true });
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleToggle = () => {
    const details = detailsRef.current;
    if (!details || !details.open) return;
    setSelectedYear(year);
    window.requestAnimationFrame(() => {
      const currentLink = details.querySelector<HTMLElement>(
        'a[aria-current="page"]',
      );
      currentLink?.scrollIntoView({ block: "nearest" });
    });
  };

  const activeGroup =
    groups.find((group) => group.year === selectedYear) ?? groups[0];

  return (
    <details
      ref={detailsRef}
      className="calendar-picker"
      onToggle={handleToggle}
    >
      <summary>
        Mês e ano
        <ChevronDown className="size-4" aria-hidden="true" />
      </summary>
      <nav aria-label="Escolher mês e ano">
        {jsReady && groups.length > 0 ? (
          <div>
            {groups.length > 1 && (
              <div
                role="group"
                aria-label="Selecionar ano"
                className="calendar-year-tabs"
              >
                {groups.map((group) => {
                  const isSelected = group.year === activeGroup?.year;
                  return (
                    <button
                      key={group.year}
                      type="button"
                      aria-pressed={isSelected}
                      className="calendar-year-tab"
                      onClick={() => setSelectedYear(group.year)}
                    >
                      {group.year}
                    </button>
                  );
                })}
              </div>
            )}
            {activeGroup && (
              <div>
                <h3 className="sr-only">{activeGroup.year}</h3>
                <ul role="list">
                  {activeGroup.months.map((item) => {
                    const monthName = MONTH_NAMES[item.month - 1];
                    const isCurrent =
                      item.year === year && item.month === month;
                    return (
                      <li key={item.key}>
                        <Link
                          href={item.href}
                          aria-label={`${monthName} de ${item.year}`}
                          aria-current={isCurrent ? "page" : undefined}
                          data-ph-capture-attribute-nav="calendar_picker_month"
                          data-ph-capture-attribute-month={item.key}
                          onClick={() => {
                            if (detailsRef.current) {
                              detailsRef.current.open = false;
                            }
                          }}
                        >
                          {monthName}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.year}>
              <h3>{group.year}</h3>
              <ul role="list">
                {group.months.map((item) => {
                  const monthName = MONTH_NAMES[item.month - 1];
                  const isCurrent =
                    item.year === year && item.month === month;
                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        aria-label={`${monthName} de ${item.year}`}
                        aria-current={isCurrent ? "page" : undefined}
                        data-ph-capture-attribute-nav="calendar_picker_month"
                        data-ph-capture-attribute-month={item.key}
                      >
                        {monthName}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </nav>
    </details>
  );
}
