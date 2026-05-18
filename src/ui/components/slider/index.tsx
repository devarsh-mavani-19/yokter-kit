import { Animated, GestureResponderEvent, Platform, StyleSheet, Vibration, View, ViewStyle } from "react-native";
import { useCallback, useRef, useState } from "react";
import { SliderSize } from "../../types";
import { FormInputFieldProps } from "../../types";
import { useGetSliderStyles } from "./use-get-slider-styles";
import { sliderSizeConfig } from "../../constants";

export type SliderProps = Omit<FormInputFieldProps<number>, "errorMessage"> & {
  size?: SliderSize;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Vibrate on each step change while dragging. Defaults to false. */
  haptic?: boolean;
  containerStyle?: ViewStyle;
};

function clampAndStep(raw: number, min: number, max: number, step: number): number {
  const stepped = Math.round((raw - min) / step) * step + min;
  return Math.min(Math.max(stepped, min), max);
}

export const Slider = ({
  size = "md",
  min = 0,
  max = 100,
  step = 1,
  disabled,
  haptic = false,
  value = min,
  onChange,
  onBlur,
  containerStyle,
}: SliderProps) => {
  const styles = useGetSliderStyles({ size, disabled });
  const dims = sliderSizeConfig[size];
  const trackRef = useRef<View>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const lastSteppedValue = useRef(value);

  const fraction = max > min ? (value - min) / (max - min) : 0;

  const resolveValue = useCallback(
    (evt: GestureResponderEvent) => {
      trackRef.current?.measureInWindow((trackX) => {
        const touchX = evt.nativeEvent.pageX - trackX;
        if (trackWidth <= 0) return;
        const ratio = Math.min(Math.max(touchX / trackWidth, 0), 1);
        const newValue = clampAndStep(min + ratio * (max - min), min, max, step);
        if (haptic && newValue !== lastSteppedValue.current) {
          lastSteppedValue.current = newValue;
          Vibration.vibrate(Platform.OS === "ios" ? 1 : 10);
        }
        onChange?.(newValue);
      });
    },
    [trackWidth, min, max, step, onChange, haptic],
  );

  const handleStartShouldSetResponder = useCallback(() => !disabled, [disabled]);

  const handleResponderGrant = useCallback(
    (evt: GestureResponderEvent) => {
      resolveValue(evt);
    },
    [resolveValue],
  );

  const handleResponderMove = useCallback(
    (evt: GestureResponderEvent) => {
      resolveValue(evt);
    },
    [resolveValue],
  );

  const handleResponderRelease = useCallback(() => {
    onBlur?.();
  }, [onBlur]);

  const handleTrackLayout = useCallback(
    (e: { nativeEvent: { layout: { width: number } } }) => {
      setTrackWidth(e.nativeEvent.layout.width);
    },
    [setTrackWidth],
  );

  const thumbOffset = fraction * trackWidth - dims.thumbSize / 2;

  return (
    <View
      style={StyleSheet.flatten([
        {
          height: dims.thumbSize,
          justifyContent: "center",
        },
        disabled && { opacity: 0.5 },
        containerStyle,
      ])}
      onStartShouldSetResponder={handleStartShouldSetResponder}
      onMoveShouldSetResponder={handleStartShouldSetResponder}
      onResponderGrant={handleResponderGrant}
      onResponderMove={handleResponderMove}
      onResponderRelease={handleResponderRelease}
    >
      <View
        ref={trackRef}
        onLayout={handleTrackLayout}
        style={styles.track}
      >
        <Animated.View
          style={[
            styles.fill,
            { width: trackWidth > 0 ? `${fraction * 100}%` : 0 },
          ]}
        />
      </View>
      {trackWidth > 0 && (
        <View
          style={[
            styles.thumb,
            {
              position: "absolute",
              left: thumbOffset,
            },
          ]}
        />
      )}
    </View>
  );
};
