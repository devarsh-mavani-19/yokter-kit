import { DateTime } from "luxon";
import { useCallback, useState } from "react";
import { Modal, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { DateTimePickerMode, DateTimePickerSize } from "../../types";
import { FormInputFieldProps } from "../../types";
import { Typography } from "../typography";
import { useGetDateTimePickerStyles } from "./use-get-date-time-picker-styles";
import { CalendarGrid } from "./calendar-grid";
import { TimePicker } from "./time-picker";
import { CalendarIcon } from "./calendar-icon";
import { ClockIcon } from "./clock-icon";

export type DateTimePickerLabels = {
  /** Label for the "Next" button. @default "Next" */
  next?: string;
  /** Label for the "Done" button. @default "Done" */
  done?: string;
  /** Label for the "Cancel" button. @default "Cancel" */
  cancel?: string;
  /** Label for the "Back" button. @default "Back" */
  back?: string;
};

export type DateTimePickerProps = Omit<
  FormInputFieldProps<DateTime>,
  "errorMessage"
> & {
  size?: DateTimePickerSize;
  mode?: DateTimePickerMode;
  disabled?: boolean;
  error?: boolean;
  placeholder?: string;
  minimumDate?: DateTime;
  maximumDate?: DateTime;
  /** Show seconds column in the time picker. Defaults to true. */
  showSeconds?: boolean;
  /** Locale for formatting. Falls back to system default. */
  locale?: string;
  /** Custom format string (Luxon format tokens). Overrides default formatting. */
  format?: string;
  /** Configurable text labels for buttons. */
  labels?: DateTimePickerLabels;
  containerStyle?: ViewStyle;
};

function defaultFormat(
  dt: DateTime,
  mode: DateTimePickerMode,
  locale?: string,
): string {
  const loc = locale ? dt.setLocale(locale) : dt;
  switch (mode) {
    case "date":
      return loc.toLocaleString(DateTime.DATE_SHORT);
    case "time":
      return loc.toLocaleString(DateTime.TIME_WITH_SECONDS);
    case "datetime":
      return loc.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
  }
}

export const DateTimePicker = ({
  size = "md",
  mode = "date",
  disabled,
  error,
  placeholder,
  minimumDate,
  maximumDate,
  showSeconds = true,
  locale,
  format,
  labels,
  value,
  onChange,
  onBlur,
  containerStyle,
}: DateTimePickerProps) => {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [step, setStep] = useState<"date" | "time">("date");
  const [pendingDate, setPendingDate] = useState<DateTime | undefined>();

  const styles = useGetDateTimePickerStyles({
    size,
    disabled,
    error,
    focused: pickerVisible,
  });

  const nextLabel = labels?.next ?? "Next";
  const doneLabel = labels?.done ?? "Done";
  const cancelLabel = labels?.cancel ?? "Cancel";
  const backLabel = labels?.back ?? "Back";

  const displayText = value
    ? format
      ? (locale ? value.setLocale(locale) : value).toFormat(format)
      : defaultFormat(value, mode, locale)
    : undefined;

  const handleOpen = useCallback(() => {
    if (disabled) return;
    if (mode === "datetime") {
      setStep("date");
      setPendingDate(value ?? DateTime.now());
    }
    setPickerVisible(true);
  }, [disabled, mode, value]);

  const handleClose = useCallback(() => {
    setPickerVisible(false);
    setStep("date");
    setPendingDate(undefined);
    onBlur?.();
  }, [onBlur]);

  // --- Date mode handlers ---

  const handleDateSelect = useCallback(
    (date: DateTime) => {
      if (mode === "date") {
        // Preserve existing time if value exists
        const merged = value
          ? date.set({
              hour: value.hour,
              minute: value.minute,
              second: value.second,
            })
          : date;
        onChange?.(merged);
        setPickerVisible(false);
        onBlur?.();
      } else {
        // datetime mode — store date, advance to time step
        const source = pendingDate ?? value ?? DateTime.now();
        const merged = date.set({
          hour: source.hour,
          minute: source.minute,
          second: source.second,
        });
        setPendingDate(merged);
        setStep("time");
      }
    },
    [mode, value, pendingDate, onChange, onBlur],
  );

  // --- Time mode handlers ---

  const timeSource = mode === "datetime" ? pendingDate : value;
  const currentHour = timeSource?.hour ?? 0;
  const currentMinute = timeSource?.minute ?? 0;
  const currentSecond = timeSource?.second ?? 0;

  const handleHourChange = useCallback(
    (h: number) => {
      if (mode === "time") {
        const next = (value ?? DateTime.now()).set({ hour: h });
        onChange?.(next);
      } else {
        const next = (pendingDate ?? DateTime.now()).set({ hour: h });
        setPendingDate(next);
      }
    },
    [mode, value, pendingDate, onChange],
  );

  const handleMinuteChange = useCallback(
    (m: number) => {
      if (mode === "time") {
        const next = (value ?? DateTime.now()).set({ minute: m });
        onChange?.(next);
      } else {
        const next = (pendingDate ?? DateTime.now()).set({ minute: m });
        setPendingDate(next);
      }
    },
    [mode, value, pendingDate, onChange],
  );

  const handleSecondChange = useCallback(
    (s: number) => {
      if (mode === "time") {
        const next = (value ?? DateTime.now()).set({ second: s });
        onChange?.(next);
      } else {
        const next = (pendingDate ?? DateTime.now()).set({ second: s });
        setPendingDate(next);
      }
    },
    [mode, value, pendingDate, onChange],
  );

  // --- Datetime confirm ---

  const handleConfirm = useCallback(() => {
    if (mode === "time") {
      setPickerVisible(false);
      onBlur?.();
      return;
    }
    if (mode === "datetime") {
      if (step === "date") {
        setStep("time");
        return;
      }
      if (pendingDate) {
        onChange?.(pendingDate);
      }
    }
    setPickerVisible(false);
    setStep("date");
    setPendingDate(undefined);
    onBlur?.();
  }, [mode, step, pendingDate, onChange, onBlur]);

  const handleBack = useCallback(() => {
    setStep("date");
  }, []);

  const IconComponent = mode === "time" ? ClockIcon : CalendarIcon;

  const showCalendar =
    mode === "date" || (mode === "datetime" && step === "date");

  const showTime = mode === "time" || (mode === "datetime" && step === "time");

  const showFooter = mode === "time" || mode === "datetime";

  return (
    <View style={containerStyle}>
      <Pressable
        onPress={handleOpen}
        disabled={disabled}
        style={styles.trigger}
        testID="YOKTER_DATE_TIME_PICKER_TRIGGER"
      >
        <Typography
          style={StyleSheet.flatten([
            styles.triggerText,
            !displayText && { color: styles.placeholder.color },
          ])}
          numberOfLines={1}
        >
          {displayText ?? placeholder}
        </Typography>
        <IconComponent size={styles.icon.size} color={styles.icon.color} />
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
                <CalendarGrid
                  value={mode === "datetime" ? pendingDate : value}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                  locale={locale}
                  onSelect={handleDateSelect}
                  styles={styles}
                />
              )}

              {showTime && (
                <TimePicker
                  hour={currentHour}
                  minute={currentMinute}
                  second={currentSecond}
                  showSeconds={showSeconds}
                  onChangeHour={handleHourChange}
                  onChangeMinute={handleMinuteChange}
                  onChangeSecond={handleSecondChange}
                  styles={styles}
                />
              )}

              {showFooter && (
                <View style={styles.footer}>
                  {mode === "datetime" && step === "time" && (
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
                  <Pressable onPress={handleConfirm}>
                    <Typography style={styles.footerButtonPrimaryText}>
                      {mode === "datetime" && step === "date" ? nextLabel : doneLabel}
                    </Typography>
                  </Pressable>
                </View>
              )}
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};
