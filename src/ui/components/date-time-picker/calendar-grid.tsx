import { DateTime } from "luxon";
import { Pressable, StyleSheet, View } from "react-native";
import { useCallback } from "react";
import { Typography } from "../typography";
import { useCalendar } from "./use-calendar";
import { ChevronNavIcon } from "./chevron-nav-icon";
import { UseGetDateTimePickerStylesReturn } from "./use-get-date-time-picker-styles";

type CalendarGridProps = {
  value?: DateTime;
  minimumDate?: DateTime;
  maximumDate?: DateTime;
  locale?: string;
  onSelect: (date: DateTime) => void;
  styles: UseGetDateTimePickerStylesReturn;
};

export const CalendarGrid = ({
  value,
  minimumDate,
  maximumDate,
  locale,
  onSelect,
  styles,
}: CalendarGridProps) => {
  const {
    days,
    weekdayHeaders,
    goToPrevMonth,
    goToNextMonth,
    canGoToPrevMonth,
    canGoToNextMonth,
    monthLabel,
  } = useCalendar({ value, minimumDate, maximumDate, locale });

  const handleDayPress = useCallback(
    (date: DateTime) => {
      onSelect(date);
    },
    [onSelect],
  );

  // Render 6 rows of 7 days
  const rows: React.ReactNode[] = [];
  for (let row = 0; row < 6; row++) {
    const cells: React.ReactNode[] = [];
    for (let col = 0; col < 7; col++) {
      const dayData = days[row * 7 + col];

      const cellStyle = StyleSheet.flatten([
        styles.dayCell,
        dayData.isToday && !dayData.isSelected && styles.dayCellToday,
        dayData.isSelected && styles.dayCellSelected,
      ]);

      const textStyle = StyleSheet.flatten([
        styles.dayCellText,
        dayData.type === "filler" && styles.dayCellFiller,
        dayData.isDisabled && styles.dayCellDisabled,
        dayData.isToday && !dayData.isSelected && styles.dayCellTodayText,
        dayData.isSelected && styles.dayCellSelectedText,
      ]);

      cells.push(
        <Pressable
          key={col}
          style={cellStyle}
          disabled={dayData.isDisabled}
          onPress={() => handleDayPress(dayData.date)}
        >
          <Typography style={textStyle}>{String(dayData.day)}</Typography>
        </Pressable>,
      );
    }
    rows.push(
      <View key={row} style={{ flexDirection: "row" }}>
        {cells}
      </View>,
    );
  }

  return (
    <View>
      {/* Navigation bar */}
      <View style={styles.navBar}>
        <Pressable
          onPress={goToPrevMonth}
          disabled={!canGoToPrevMonth}
          style={StyleSheet.flatten([
            styles.navArrow,
            !canGoToPrevMonth && styles.navArrowDisabled,
          ])}
        >
          <ChevronNavIcon
            size={18}
            color={canGoToPrevMonth ? styles.navArrowColor : styles.navArrowDisabledColor}
            direction="left"
          />
        </Pressable>
        <Typography style={styles.navLabel}>{monthLabel}</Typography>
        <Pressable
          onPress={goToNextMonth}
          disabled={!canGoToNextMonth}
          style={StyleSheet.flatten([
            styles.navArrow,
            !canGoToNextMonth && styles.navArrowDisabled,
          ])}
        >
          <ChevronNavIcon
            size={18}
            color={canGoToNextMonth ? styles.navArrowColor : styles.navArrowDisabledColor}
            direction="right"
          />
        </Pressable>
      </View>

      {/* Weekday headers */}
      <View style={styles.weekdayRow}>
        {weekdayHeaders.map((header) => (
          <Typography key={header} style={styles.weekdayText}>
            {header}
          </Typography>
        ))}
      </View>

      {/* Day grid */}
      {rows}
    </View>
  );
};
