import { Keyboard, StyleSheet, View, ViewProps } from "react-native";
import { PaginationSize } from "../../types";
import { Typography } from "../typography";
import { Button } from "../button";
import { useCallback, useRef, useState } from "react";
import { useGetPaginationStyles } from "./use-get-pagination-styles";
import { InputNumber } from "../input-number";

export type PaginationProps = ViewProps & {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  size?: PaginationSize;
  disabled?: boolean;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  size = "md",
  disabled = false,
  ...viewProps
}: PaginationProps) => {
  const styles = useGetPaginationStyles({ size, disabled });
  const safeCurrent = clamp(currentPage, 1, Math.max(totalPages, 1));
  const [inputValue, setInputValue] = useState<number | undefined>(safeCurrent);
  const [isFocused, setIsFocused] = useState(false);
  const latestInputRef = useRef<number | undefined>(inputValue);

  // Sync input when currentPage changes externally and input is not focused
  if (!isFocused && inputValue !== safeCurrent) {
    setInputValue(safeCurrent);
  }

  const handlePrevious = useCallback(() => {
    Keyboard.dismiss();
    if (safeCurrent > 1 && !disabled) {
      onPageChange(safeCurrent - 1);
    }
  }, [safeCurrent, disabled, onPageChange]);

  const handleNext = useCallback(() => {
    Keyboard.dismiss();
    if (safeCurrent < totalPages && !disabled) {
      onPageChange(safeCurrent + 1);
    }
  }, [safeCurrent, totalPages, disabled, onPageChange]);

  const handleChange = useCallback((value: number | undefined) => {
    setInputValue(value);
    latestInputRef.current = value;
  }, []);

  const handleSubmit = useCallback(() => {
    setIsFocused(false);
    const val = latestInputRef.current;
    if (!val || val < 1) {
      setInputValue(safeCurrent);
      latestInputRef.current = safeCurrent;
      return;
    }

    const clamped = clamp(val, 1, totalPages);
    setInputValue(clamped);
    latestInputRef.current = clamped;
    if (clamped !== safeCurrent) {
      onPageChange(clamped);
    }
  }, [safeCurrent, totalPages, onPageChange]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    latestInputRef.current = inputValue;
  }, [inputValue]);

  if (totalPages <= 0) return null;

  const isPrevDisabled = disabled || safeCurrent === 1;
  const isNextDisabled = disabled || safeCurrent === totalPages;

  return (
    <View
      {...viewProps}
      testID="YOKTER_PAGINATION"
      style={StyleSheet.flatten([styles.container, viewProps?.style])}
    >
      <Button
        variant="outlined"
        size={size}
        disabled={isPrevDisabled}
        onPress={handlePrevious}
        style={styles.arrowButton}
      >
        <Typography style={styles.arrowText}>{"‹"}</Typography>
      </Button>

      <InputNumber
        value={inputValue}
        onChange={handleChange}
        onBlur={handleSubmit}
        onFocus={handleFocus}
        editable={!disabled}
        size={size}
        decimalScale={0}
        selectTextOnFocus
        containerStyle={styles.inputContainer}
        style={styles.inputText}
      />

      <Typography style={styles.separator}>{"/"}</Typography>

      <Typography style={styles.total}>{String(totalPages)}</Typography>

      <Button
        variant="outlined"
        size={size}
        disabled={isNextDisabled}
        onPress={handleNext}
        style={styles.arrowButton}
      >
        <Typography style={styles.arrowText}>{"›"}</Typography>
      </Button>
    </View>
  );
};
