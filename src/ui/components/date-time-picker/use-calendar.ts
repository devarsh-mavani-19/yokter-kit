import { DateTime } from "luxon";
import { useCallback, useMemo, useState } from "react";
import { CalendarDay } from "./types";

const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function isSameDay(a: DateTime, b: DateTime): boolean {
  return a.hasSame(b, "day");
}

export function startOfDay(d: DateTime): DateTime {
  return d.startOf("day");
}

type UseCalendarProps = {
  value?: DateTime;
  minimumDate?: DateTime;
  maximumDate?: DateTime;
  locale?: string;
};

export const useCalendar = ({
  value,
  minimumDate,
  maximumDate,
  locale,
}: UseCalendarProps) => {
  const initial = value ?? DateTime.now();
  const [viewYear, setViewYear] = useState(initial.year);
  const [viewMonth, setViewMonth] = useState(initial.month); // 1-12 in Luxon

  const today = useMemo(() => DateTime.now(), []);

  const days = useMemo<CalendarDay[]>(() => {
    const firstOfMonth = DateTime.local(viewYear, viewMonth, 1);
    // Luxon weekday: 1=Mon..7=Sun. We need 0=Sun..6=Sat for the grid.
    const startWeekday = firstOfMonth.weekday % 7; // Sun=0
    const daysInMonth = firstOfMonth.daysInMonth ?? 30;
    const prevMonth = firstOfMonth.minus({ months: 1 });
    const daysInPrevMonth = prevMonth.daysInMonth ?? 30;

    const cells: CalendarDay[] = [];

    // Previous month filler days
    for (let i = startWeekday - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = prevMonth.set({ day });
      cells.push({
        date,
        day,
        type: "filler",
        isToday: isSameDay(date, today),
        isSelected: value ? isSameDay(date, value) : false,
        isDisabled: isDateDisabled(date, minimumDate, maximumDate),
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = firstOfMonth.set({ day });
      cells.push({
        date,
        day,
        type: "current",
        isToday: isSameDay(date, today),
        isSelected: value ? isSameDay(date, value) : false,
        isDisabled: isDateDisabled(date, minimumDate, maximumDate),
      });
    }

    // Next month filler days (fill to 42 cells = 6 rows)
    const nextMonth = firstOfMonth.plus({ months: 1 });
    const remaining = 42 - cells.length;
    for (let day = 1; day <= remaining; day++) {
      const date = nextMonth.set({ day });
      cells.push({
        date,
        day,
        type: "filler",
        isToday: isSameDay(date, today),
        isSelected: value ? isSameDay(date, value) : false,
        isDisabled: isDateDisabled(date, minimumDate, maximumDate),
      });
    }

    return cells;
  }, [viewYear, viewMonth, value, minimumDate, maximumDate, today]);

  const goToPrevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 1) {
        setViewYear((y) => y - 1);
        return 12;
      }
      return m - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 12) {
        setViewYear((y) => y + 1);
        return 1;
      }
      return m + 1;
    });
  }, []);

  const canGoToPrevMonth = useMemo(() => {
    if (!minimumDate) return true;
    const firstOfView = DateTime.local(viewYear, viewMonth, 1);
    return firstOfView > startOfDay(minimumDate);
  }, [viewYear, viewMonth, minimumDate]);

  const canGoToNextMonth = useMemo(() => {
    if (!maximumDate) return true;
    const firstOfView = DateTime.local(viewYear, viewMonth, 1);
    const lastOfView = firstOfView.endOf("month");
    return lastOfView < startOfDay(maximumDate);
  }, [viewYear, viewMonth, maximumDate]);

  // Use locale-aware month name if locale provided
  const monthDt = DateTime.local(viewYear, viewMonth, 1);
  const monthName = locale
    ? monthDt.setLocale(locale).toFormat("LLLL")
    : monthDt.toFormat("LLLL");
  const monthLabel = `${monthName} ${viewYear}`;

  return {
    viewYear,
    viewMonth,
    days,
    weekdayHeaders: WEEKDAY_HEADERS,
    goToPrevMonth,
    goToNextMonth,
    canGoToPrevMonth,
    canGoToNextMonth,
    monthLabel,
  };
};

function isDateDisabled(
  date: DateTime,
  min?: DateTime,
  max?: DateTime,
): boolean {
  const d = startOfDay(date);
  if (min && d < startOfDay(min)) return true;
  if (max && d > startOfDay(max)) return true;
  return false;
}
