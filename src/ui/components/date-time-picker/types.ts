import { DateTime } from "luxon";

export type CalendarDay = {
  date: DateTime;
  day: number;
  type: "current" | "filler";
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
};
