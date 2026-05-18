import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { DropdownSize } from "../../types";
import { Typography } from "../typography";
import { useGetDropdownStyles } from "./use-get-dropdown-styles";
import { ChevronIcon } from "./chevron-icon";
import { CrossIcon } from "./cross-icon";
import { CheckIcon } from "../checkbox/check-icon";

export type DropdownOption<T> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type DropdownBaseProps<T> = {
  options: DropdownOption<T>[];
  size?: DropdownSize;
  disabled?: boolean;
  error?: boolean;
  clearable?: boolean;
  placeholder?: string;
  containerStyle?: ViewStyle;
  triggerStyle?: ViewStyle;
  panelStyle?: ViewStyle;
  renderItem?: (option: DropdownOption<T>, isSelected: boolean) => ReactNode;
  renderSelected?: (selected: DropdownOption<T>[]) => ReactNode;
  keyExtractor?: (option: DropdownOption<T>) => string;
};

export type DropdownSingleProps<T> = DropdownBaseProps<T> & {
  mode?: "single";
  value?: T;
  onChange?: (value: T | undefined) => void;
  onBlur?: () => void;
};

export type DropdownMultiProps<T> = DropdownBaseProps<T> & {
  mode: "multi";
  value?: T[];
  onChange?: (value: T[]) => void;
  onBlur?: () => void;
};

export type DropdownProps<T> = DropdownSingleProps<T> | DropdownMultiProps<T>;

function isMultiMode<T>(
  props: DropdownProps<T>,
): props is DropdownMultiProps<T> {
  return props.mode === "multi";
}

export const Dropdown = <T,>(props: DropdownProps<T>) => {
  const {
    options,
    size = "md",
    disabled,
    error,
    clearable,
    placeholder = "Select...",
    containerStyle,
    triggerStyle,
    panelStyle,
    renderItem,
    renderSelected,
    keyExtractor,
    onChange,
    onBlur,
  } = props;

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<View>(null);
  const [triggerLayout, setTriggerLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const styles = useGetDropdownStyles({ size, open, disabled, error });

  const selectedSet = useMemo(() => {
    if (isMultiMode(props)) {
      return new Set(props.value ?? []);
    }
    return new Set(props.value !== undefined ? [props.value] : []);
  }, [props]);

  const selectedOptions = useMemo(
    () => options.filter((o) => selectedSet.has(o.value)),
    [options, selectedSet],
  );

  const getKey = useCallback(
    (option: DropdownOption<T>) => {
      if (keyExtractor) return keyExtractor(option);
      return String(option.value);
    },
    [keyExtractor],
  );

  const handleToggle = useCallback(() => {
    if (disabled) return;

    if (open) {
      setOpen(false);
      onBlur?.();
      return;
    }

    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height });
      setOpen(true);
    });
  }, [disabled, open, onBlur]);

  const handleClose = useCallback(() => {
    setOpen(false);
    onBlur?.();
  }, [onBlur]);

  const handleClear = useCallback(() => {
    if (isMultiMode(props)) {
      (onChange as DropdownMultiProps<T>["onChange"])?.([]);
    } else {
      (onChange as DropdownSingleProps<T>["onChange"])?.(undefined);
    }
  }, [props, onChange]);

  const handleSelect = useCallback(
    (option: DropdownOption<T>) => {
      if (option.disabled) return;

      if (isMultiMode(props)) {
        const current = props.value ?? [];
        const exists = current.some((v) => v === option.value);
        const next = exists
          ? current.filter((v) => v !== option.value)
          : [...current, option.value];
        (onChange as DropdownMultiProps<T>["onChange"])?.(next);
      } else {
        const isSame = props.value === option.value;
        (onChange as DropdownSingleProps<T>["onChange"])?.(
          isSame ? undefined : option.value,
        );
        setOpen(false);
        onBlur?.();
      }
    },
    [props, onChange, onBlur],
  );

  const renderTriggerContent = () => {
    if (renderSelected && selectedOptions.length > 0) {
      return renderSelected(selectedOptions);
    }

    if (selectedOptions.length === 0) {
      return (
        <Typography
          style={StyleSheet.flatten([
            styles.triggerText,
            { color: styles.placeholder.color },
          ])}
        >
          {placeholder}
        </Typography>
      );
    }

    if (isMultiMode(props)) {
      const text = selectedOptions.map((o) => o.label).join(", ");
      return (
        <Typography style={styles.triggerText} numberOfLines={1}>
          {text}
        </Typography>
      );
    }

    return (
      <Typography style={styles.triggerText} numberOfLines={1}>
        {selectedOptions[0].label}
      </Typography>
    );
  };

  const renderDefaultItem = (option: DropdownOption<T>, isSelected: boolean) => (
    <View
      style={StyleSheet.flatten([
        styles.item,
        isSelected && styles.itemActive,
        option.disabled && { opacity: 0.4 },
      ])}
    >
      <Typography
        style={StyleSheet.flatten([
          styles.itemText,
          { flex: 1 },
          isSelected && styles.itemActiveText,
        ])}
      >
        {option.label}
      </Typography>
      {isSelected && (
        <CheckIcon
          size={styles.chevron.size * 0.75}
          color={
            (isSelected
              ? styles.itemActiveText.color
              : styles.itemText.color) as string
          }
        />
      )}
    </View>
  );

  return (
    <View style={containerStyle}>
      <Pressable
        ref={triggerRef}
        onPress={handleToggle}
        disabled={disabled}
        style={StyleSheet.flatten([styles.trigger, triggerStyle])}
      >
        {renderTriggerContent()}
        {clearable && !disabled && selectedOptions.length > 0 ? (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            hitSlop={4}
          >
            <CrossIcon
              size={styles.chevron.size}
              color={styles.chevron.color}
            />
          </Pressable>
        ) : (
          <ChevronIcon
            size={styles.chevron.size}
            color={styles.chevron.color}
            direction={open ? "up" : "down"}
          />
        )}
      </Pressable>

      {open && triggerLayout && (
        <Modal
          visible
          transparent
          animationType="none"
          onRequestClose={handleClose}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleClose}
          />
          <View
            style={[
              {
                position: "absolute",
                top: triggerLayout.y + triggerLayout.height + 4,
                left: triggerLayout.x,
                width: triggerLayout.width,
              },
            ]}
          >
            <View style={StyleSheet.flatten([styles.panel, panelStyle])}>
              <FlatList
                data={options}
                keyExtractor={getKey}
                renderItem={({ item }) => {
                  const isSelected = selectedSet.has(item.value);
                  return (
                    <Pressable
                      onPress={() => handleSelect(item)}
                      disabled={item.disabled}
                    >
                      {renderItem
                        ? renderItem(item, isSelected)
                        : renderDefaultItem(item, isSelected)}
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};
