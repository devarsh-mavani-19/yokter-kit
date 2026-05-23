import { DateTime } from "luxon";
import { useCallback, useState } from "react";
import { Modal, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import {
  DateTimeRangePickerMode,
  DateTimeRangePickerSize,
  DateTimeRangeValue,
} from "../../types";
import { Typography } from "../typography";
import { useGetDateTimeRangePickerStyles } from "./use-get-date-time-range-picker-styles";
import { RangeCalendarGrid } from "./range-calendar-grid";
import { TimePicker } from "../date-time-picker/time-picker";
import { CalendarIcon } from "../date-time-picker/calendar-icon";
import { ClockIcon } from "../date-time-picker/clock-icon";
import { ArrowIcon } from "./arrow-icon";

export type DateTimeRangePickerLabels = {
  /** Label for the "Next" button. @default "Next" */
  next?: string;
  /** Label for the "Done" button. @default "Done" */
  done?: string;
  /** Label for the "Cancel" button. @default "Cancel" */
  cancel?: string;
  /** Label for the "Back" button. @default "Back" */
  back?: string;
  /** Header when selecting start date. @default "Select start date" */
  selectStartDate?: string;
  /** Header when selecting end date. @default "Select end date" */
  selectEndDate?: string;
  /** Label above start time picker. @default "Start time" */
  startTimeLabel?: string;
  /** Label above end time picker. @default "End time" */
  endTimeLabel?: string;
};

export type DateTimeRangePickerProps = {
  size?: DateTimeRangePickerSize;
  mode?: DateTimeRangePickerMode;
  disabled?: boolean;
  error?: boolean;
  placeholderStart?: string;
  placeholderEnd?: string;
  minimumDate?: DateTime;
  maximumDate?: DateTime;
  showSeconds?: boolean;
  /** Locale for formatting. Falls back to system default. */
  locale?: string;
  /** Custom Luxon format string. Overrides default formatting. */
  format?: string;
  /** Configurable text labels for buttons and headers. */
  labels?: DateTimeRangePickerLabels;
  value?: DateTimeRangeValue;
  onChange?: (value: DateTimeRangeValue) => void;
  onBlur?: () => void;
  containerStyle?: ViewStyle;
};

function formatDt(
  dt: DateTime,
  mode: DateTimeRangePickerMode,
  locale?: string,
  format?: string,
  showSeconds?: boolean,
): string {
  const loc = locale ? dt.setLocale(locale) : dt;
  if (format) return loc.toFormat(format);
  if (mode === "time")
    return loc.toLocaleString(
      showSeconds ? DateTime.TIME_WITH_SECONDS : DateTime.TIME_SIMPLE,
    );
  return mode === "datetime"
    ? loc.toLocaleString(DateTime.DATETIME_SHORT)
    : loc.toLocaleString(DateTime.DATE_SHORT);
}

export const DateTimeRangePicker = ({
  size = "md",
  mode = "date",
  disabled,
  error,
  placeholderStart,
  placeholderEnd,
  minimumDate,
  maximumDate,
  showSeconds = false,
  locale,
  format,
  labels,
  value,
  onChange,
  onBlur,
  containerStyle,
}: DateTimeRangePickerProps) => {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectingSide, setSelectingSide] = useState<"start" | "end">("start");
  const [step, setStep] = useState<"date" | "time">("date");
  const [pending, setPending] = useState<DateTimeRangeValue>({});

  const styles = useGetDateTimeRangePickerStyles({
    size,
    disabled,
    error,
    focused: pickerVisible,
    focusedSide: selectingSide,
  });

  const nextLabel = labels?.next ?? "Next";
  const doneLabel = labels?.done ?? "Done";
  const cancelLabel = labels?.cancel ?? "Cancel";
  const backLabel = labels?.back ?? "Back";
  const selectStartDateLabel = labels?.selectStartDate ?? "Select start date";
  const selectEndDateLabel = labels?.selectEndDate ?? "Select end date";
  const startTimeLabel = labels?.startTimeLabel ?? "Start time";
  const endTimeLabel = labels?.endTimeLabel ?? "End time";

  const startText = value?.start
    ? formatDt(value.start, mode, locale, format, showSeconds)
    : undefined;
  const endText = value?.end
    ? formatDt(value.end, mode, locale, format, showSeconds)
    : undefined;

  // --- Open / Close ---

  const handleOpen = useCallback(
    (side: "start" | "end") => {
      if (disabled) return;
      setSelectingSide(side);
      setStep(mode === "time" ? "time" : "date");
      const now = DateTime.now();
      setPending({
        start: value?.start ?? (mode === "time" ? now : undefined),
        end: value?.end ?? (mode === "time" ? now : undefined),
      });
      setPickerVisible(true);
    },
    [disabled, value, mode],
  );

  const handleClose = useCallback(() => {
    setPickerVisible(false);
    setStep(mode === "time" ? "time" : "date");
    setPending({});
    onBlur?.();
  }, [onBlur, mode]);

  // --- Date selection ---

  const handleDateSelect = useCallback(
    (date: DateTime) => {
      if (selectingSide === "start") {
        const newStart = pending.start
          ? date.set({
              hour: pending.start.hour,
              minute: pending.start.minute,
              second: pending.start.second,
            })
          : date;
        const newEnd =
          pending.end && date <= pending.end ? pending.end : undefined;
        setPending({ start: newStart, end: newEnd });
        setSelectingSide("end");
      } else {
        if (pending.start && date < pending.start) {
          setPending({ start: date, end: undefined });
          setSelectingSide("end");
        } else {
          const newEnd = pending.end
            ? date.set({
                hour: pending.end.hour,
                minute: pending.end.minute,
                second: pending.end.second,
              })
            : date;
          const newPending = { start: pending.start, end: newEnd };
          setPending(newPending);

          if (mode === "date") {
            onChange?.(newPending);
            setPickerVisible(false);
            setStep("date");
            setPending({});
            onBlur?.();
          } else {
            setStep("time");
            setSelectingSide("start");
          }
        }
      }
    },
    [selectingSide, pending, mode, onChange, onBlur],
  );

  // --- Time handlers ---

  const makeTimeHandler = useCallback(
    (side: "start" | "end", field: "hour" | "minute" | "second") => {
      return (v: number) => {
        setPending((prev) => {
          const source = side === "start" ? prev.start : prev.end;
          const next = (source ?? DateTime.now()).set({ [field]: v });
          return side === "start"
            ? { ...prev, start: next }
            : { ...prev, end: next };
        });
      };
    },
    [],
  );

  const handleStartHour = makeTimeHandler("start", "hour");
  const handleStartMinute = makeTimeHandler("start", "minute");
  const handleStartSecond = makeTimeHandler("start", "second");
  const handleEndHour = makeTimeHandler("end", "hour");
  const handleEndMinute = makeTimeHandler("end", "minute");
  const handleEndSecond = makeTimeHandler("end", "second");

  // --- Confirm ---

  const handleConfirm = useCallback(() => {
    if (mode === "datetime" && step === "date") {
      if (pending.start && pending.end) {
        setStep("time");
        setSelectingSide("start");
      }
      return;
    }
    onChange?.(pending);
    setPickerVisible(false);
    setStep(mode === "time" ? "time" : "date");
    setPending({});
    onBlur?.();
  }, [mode, step, pending, onChange, onBlur]);

  const handleBack = useCallback(() => {
    setStep("date");
  }, []);

  const showCalendar = step === "date" && mode !== "time";
  const showTime = step === "time" && (mode === "time" || mode === "datetime");

  return (
    <View style={containerStyle}>
      <Pressable
        onPress={() => handleOpen("start")}
        disabled={disabled}
        style={styles.trigger}
        testID="YOKTER_DATE_TIME_RANGE_PICKER_TRIGGER"
      >
        <Pressable
          onPress={() => handleOpen("start")}
          disabled={disabled}
          style={{ flex: 1, justifyContent: "center" }}
        >
          <Typography
            style={StyleSheet.flatten([
              styles.triggerTextStart,
              !startText && { color: styles.placeholder.color },
            ])}
            numberOfLines={1}
          >
            {startText ?? placeholderStart}
          </Typography>
        </Pressable>
        <View style={styles.triggerSeparator}>
          <ArrowIcon size={styles.icon.size} color={styles.placeholder.color} />
        </View>
        <Pressable
          onPress={() => handleOpen("end")}
          disabled={disabled}
          style={{ flex: 1, justifyContent: "center" }}
        >
          <Typography
            style={StyleSheet.flatten([
              styles.triggerTextEnd,
              !endText && { color: styles.placeholder.color },
            ])}
            numberOfLines={1}
          >
            {endText ?? placeholderEnd}
          </Typography>
        </Pressable>
        {mode === "time" ? (
          <ClockIcon size={styles.icon.size} color={styles.icon.color} />
        ) : (
          <CalendarIcon size={styles.icon.size} color={styles.icon.color} />
        )}
      </Pressable>

      {pickerVisible && (
        <Modal transparent animationType="fade" onRequestClose={handleClose}>
          <Pressable style={styles.modalOverlay} onPress={handleClose}>
            <View
              style={styles.modalContent}
              onStartShouldSetResponder={() => true}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              {showCalendar && (
                <>
                  <Typography
                    style={StyleSheet.flatten([
                      styles.footerButtonText,
                      { textAlign: "center", marginBottom: 8 },
                    ])}
                  >
                    {selectingSide === "start"
                      ? selectStartDateLabel
                      : selectEndDateLabel}
                  </Typography>
                  <RangeCalendarGrid
                    startDate={pending.start}
                    endDate={pending.end}
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                    locale={locale}
                    onSelect={handleDateSelect}
                    styles={styles}
                  />
                </>
              )}

              {showTime && (
                <View>
                  <Typography style={styles.timeLabel}>
                    {startTimeLabel}
                  </Typography>
                  <TimePicker
                    hour={pending.start?.hour ?? 0}
                    minute={pending.start?.minute ?? 0}
                    second={pending.start?.second ?? 0}
                    showSeconds={showSeconds}
                    onChangeHour={handleStartHour}
                    onChangeMinute={handleStartMinute}
                    onChangeSecond={handleStartSecond}
                    styles={styles}
                  />
                  <Typography
                    style={StyleSheet.flatten([
                      styles.timeLabel,
                      { marginTop: 8 },
                    ])}
                  >
                    {endTimeLabel}
                  </Typography>
                  <TimePicker
                    hour={pending.end?.hour ?? 0}
                    minute={pending.end?.minute ?? 0}
                    second={pending.end?.second ?? 0}
                    showSeconds={showSeconds}
                    onChangeHour={handleEndHour}
                    onChangeMinute={handleEndMinute}
                    onChangeSecond={handleEndSecond}
                    styles={styles}
                  />
                </View>
              )}

              <View style={styles.footer}>
                {showTime && mode !== "time" && (
                  <Pressable onPress={handleBack}>
                    <Typography style={styles.footerButtonText}>
                      {backLabel}
                    </Typography>
                  </Pressable>
                )}
                <Pressable onPress={handleClose}>
                  <Typography style={styles.footerButtonText}>
                    {cancelLabel}
                  </Typography>
                </Pressable>
                {(mode === "datetime" || mode === "time" || showTime) && (
                  <Pressable
                    onPress={handleConfirm}
                    disabled={!pending.start || !pending.end}
                  >
                    <Typography
                      style={StyleSheet.flatten([
                        styles.footerButtonPrimaryText,
                        (!pending.start || !pending.end) && { opacity: 0.4 },
                      ])}
                    >
                      {mode === "datetime" && step === "date"
                        ? nextLabel
                        : doneLabel}
                    </Typography>
                  </Pressable>
                )}
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};
