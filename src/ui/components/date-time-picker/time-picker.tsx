import { useMemo } from "react";
import { TextStyle, View, ViewStyle } from "react-native";
import { Typography } from "../typography";
import { WheelInput, WheelInputOption } from "../wheel-input";

export type TimePickerStyles = {
  timeContainer: ViewStyle;
  timeColumn: ViewStyle;
  timeItemHeight: number;
  timeVisibleItems: number;
  timeItemText: TextStyle;
  timeItemTextActive: TextStyle;
  timeItemTextFaded: TextStyle;
  timeHighlight: ViewStyle;
  timeSeparator: TextStyle;
};

type TimePickerProps = {
  hour: number;
  minute: number;
  second: number;
  showSeconds?: boolean;
  onChangeHour: (h: number) => void;
  onChangeMinute: (m: number) => void;
  onChangeSecond: (s: number) => void;
  styles: TimePickerStyles;
};

function padTwo(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function buildOptions(count: number): WheelInputOption<number>[] {
  return Array.from({ length: count }, (_, i) => ({
    value: i,
    label: padTwo(i),
  }));
}

const HOUR_OPTIONS = buildOptions(24);
const MINUTE_OPTIONS = buildOptions(60);
const SECOND_OPTIONS = buildOptions(60);

export const TimePicker = ({
  hour,
  minute,
  second,
  showSeconds = true,
  onChangeHour,
  onChangeMinute,
  onChangeSecond,
  styles,
}: TimePickerProps) => {
  const wheelStyles = useMemo(
    () => ({
      container: styles.timeColumn,
      highlight: styles.timeHighlight,
      itemText: styles.timeItemText,
      itemTextActive: styles.timeItemTextActive,
      itemTextFaded: styles.timeItemTextFaded,
      measurer: { position: "absolute" as const, opacity: 0, pointerEvents: "none" as const, flexDirection: "row" as const },
      measurerText: { fontSize: styles.timeItemTextActive.fontSize ?? 16, fontWeight: "600" as const, paddingHorizontal: 8 },
      itemHeight: styles.timeItemHeight,
    }),
    [styles],
  );

  return (
    <View style={styles.timeContainer}>
      <WheelInput
        options={HOUR_OPTIONS}
        value={hour}
        onChange={onChangeHour}
        visibleItems={styles.timeVisibleItems}
        _styles={wheelStyles}
      />
      <Typography style={styles.timeSeparator}>:</Typography>
      <WheelInput
        options={MINUTE_OPTIONS}
        value={minute}
        onChange={onChangeMinute}
        visibleItems={styles.timeVisibleItems}
        _styles={wheelStyles}
      />
      {showSeconds && (
        <>
          <Typography style={styles.timeSeparator}>:</Typography>
          <WheelInput
            options={SECOND_OPTIONS}
            value={second}
            onChange={onChangeSecond}
            visibleItems={styles.timeVisibleItems}
            _styles={wheelStyles}
          />
        </>
      )}
    </View>
  );
};
