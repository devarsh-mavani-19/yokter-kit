import {
  GestureResponderEvent,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Vibration,
  View,
  ViewStyle,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { WheelInputSize } from "../../types";
import { FormInputFieldProps } from "../../types";
import { Typography } from "../typography";
import {
  useGetWheelInputStyles,
  UseGetWheelInputStylesReturn,
} from "./use-get-wheel-input-styles";

export type WheelInputOption<T> = {
  value: T;
  label: string;
};

export type WheelInputProps<T> = Omit<
  FormInputFieldProps<T>,
  "errorMessage"
> & {
  options: WheelInputOption<T>[];
  size?: WheelInputSize;
  disabled?: boolean;
  /** Number of visible items. Must be odd. Defaults to 5. */
  visibleItems?: number;
  /** Vibrate on each step change while dragging. Defaults to false. */
  haptic?: boolean;
  containerStyle?: ViewStyle;
  /** Pass pre-computed styles to skip the internal hook (used by DateTimePicker). */
  _styles?: UseGetWheelInputStylesReturn;
};

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export const WheelInput = <T,>({
  options,
  size = "md",
  disabled,
  visibleItems = 5,
  haptic = false,
  value,
  onChange,
  onBlur,
  containerStyle,
  _styles,
}: WheelInputProps<T>) => {
  const internalStyles = useGetWheelInputStyles({ size, disabled });
  const styles = _styles ?? internalStyles;
  const itemHeight = styles.itemHeight;
  const pickerHeight = itemHeight * visibleItems;
  const halfVisible = Math.floor(visibleItems / 2);

  // --- Width measurement ---
  const [measuredWidth, setMeasuredWidth] = useState(0);

  const handleMeasureLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) {
      setMeasuredWidth(w);
    }
  }, []);

  // Find the longest label to use as the single measurement source
  const longestLabel = options.reduce(
    (longest, o) => (o.label.length > longest.length ? o.label : longest),
    "",
  );

  // --- Scroll state ---
  const selectedIndex = options.findIndex((o) => o.value === value);
  const safeIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const [offset, setOffset] = useState(safeIndex * itemHeight);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartOffset = useRef(0);
  const lastHapticIndex = useRef(safeIndex);

  // Sync offset when value changes externally (not mid-drag)
  useEffect(() => {
    if (!isDragging.current) {
      const idx = options.findIndex((o) => o.value === value);
      const target = idx >= 0 ? idx : 0;
      setOffset(target * itemHeight);
      lastHapticIndex.current = target;
    }
  }, [value, itemHeight, options]);

  const activeIndex = clamp(
    Math.round(offset / itemHeight),
    0,
    options.length - 1,
  );

  const handleStartShouldSetResponder = useCallback(
    () => !disabled,
    [disabled],
  );
  const handleMoveShouldSetResponder = useCallback(
    () => !disabled,
    [disabled],
  );

  const handleResponderGrant = useCallback(
    (e: GestureResponderEvent) => {
      isDragging.current = true;
      dragStartY.current = e.nativeEvent.pageY;
      dragStartOffset.current = offset;
    },
    [offset],
  );

  const handleResponderMove = useCallback(
    (e: GestureResponderEvent) => {
      const dy = dragStartY.current - e.nativeEvent.pageY;
      const raw = dragStartOffset.current + dy;
      const clamped = clamp(raw, 0, (options.length - 1) * itemHeight);
      setOffset(clamped);

      if (haptic) {
        const idx = clamp(
          Math.round(clamped / itemHeight),
          0,
          options.length - 1,
        );
        if (idx !== lastHapticIndex.current) {
          lastHapticIndex.current = idx;
          Vibration.vibrate(Platform.OS === "ios" ? 1 : 10);
        }
      }
    },
    [options.length, itemHeight, haptic],
  );

  const handleResponderRelease = useCallback(() => {
    isDragging.current = false;
    const idx = clamp(
      Math.round(offset / itemHeight),
      0,
      options.length - 1,
    );
    setOffset(idx * itemHeight);
    lastHapticIndex.current = idx;
    if (idx !== safeIndex) {
      onChange?.(options[idx].value);
    }
    onBlur?.();
  }, [offset, itemHeight, options, safeIndex, onChange, onBlur]);

  // Build visible items
  const items: React.ReactNode[] = [];
  for (let i = 0; i < options.length; i++) {
    const top = (i - activeIndex + halfVisible) * itemHeight;
    const subPx = offset - activeIndex * itemHeight;
    const adjustedTop = top - subPx;

    if (adjustedTop < -itemHeight || adjustedTop > pickerHeight) continue;

    const isActive = i === activeIndex;
    const distance = Math.abs(i - activeIndex);

    items.push(
      <View
        key={i}
        style={{
          position: "absolute",
          top: adjustedTop,
          left: 0,
          right: 0,
          height: itemHeight,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          style={StyleSheet.flatten([
            styles.itemText,
            isActive && styles.itemTextActive,
            distance >= 2 && styles.itemTextFaded,
          ])}
        >
          {options[i].label}
        </Typography>
      </View>,
    );
  }

  const highlightTop = halfVisible * itemHeight;

  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        { height: pickerHeight },
        measuredWidth > 0 ? { width: measuredWidth } : undefined,
        containerStyle,
      ])}
      onStartShouldSetResponder={handleStartShouldSetResponder}
      onMoveShouldSetResponder={handleMoveShouldSetResponder}
      onResponderGrant={handleResponderGrant}
      onResponderMove={handleResponderMove}
      onResponderRelease={handleResponderRelease}
      onResponderTerminate={handleResponderRelease}
    >
      {/* Hidden text to measure the widest label */}
      <View style={styles.measurer} onLayout={handleMeasureLayout}>
        <Typography style={styles.measurerText}>
          {longestLabel}
        </Typography>
      </View>

      <View
        style={[styles.highlight, { top: highlightTop }]}
        pointerEvents="none"
      />
      {items}
    </View>
  );
};
