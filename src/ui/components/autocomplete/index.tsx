import {
  BlurEvent,
  FlatList,
  FocusEvent,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { ReactNode, useCallback, useRef, useMemo, useState } from "react";
import { InputSize, InputState } from "../../types";
import { Typography } from "../typography";
import { useGetInputStyles } from "../input/use-get-input-styles";
import { useGetDropdownStyles } from "../dropdown/use-get-dropdown-styles";
import { CrossIcon } from "../dropdown/cross-icon";
import { FormInputFieldProps } from "../../types";

export type AutoCompleteOption<T = string> = {
  value: T;
  label: string;
};

export type AutoCompleteProps<T = string> = FormInputFieldProps<T> &
  Omit<TextInputProps, "onChange" | "value"> & {
    options: AutoCompleteOption<T>[];
    size?: InputSize;
    disabled?: boolean;
    error?: boolean;
    clearable?: boolean;
    containerStyle?: ViewStyle;
    panelStyle?: ViewStyle;
    /** Client-side filter. Return true to include the option. Defaults to case-insensitive label match. Pass false to disable filtering (useful for async search). */
    filterOption?: false | ((inputValue: string, option: AutoCompleteOption<T>) => boolean);
    /** Called when the text in the input changes (for async search). */
    onSearch?: (text: string) => void;
    /** Called when an option is selected from the panel. */
    onSelect?: (value: T, option: AutoCompleteOption<T>) => void;
    /** Content shown when no options match. */
    notFoundContent?: ReactNode;
    /** Custom render function for each option row. */
    renderItem?: (option: AutoCompleteOption<T>, isSelected: boolean) => ReactNode;
    /** Extracts a unique key from an option. Defaults to String(option.value). */
    keyExtractor?: (option: AutoCompleteOption<T>) => string;
  };

const defaultFilter = <T,>(inputValue: string, option: AutoCompleteOption<T>) =>
  option.label.toLowerCase().includes(inputValue.toLowerCase());

export const AutoComplete = <T = string,>(props: AutoCompleteProps<T>) => {
  const {
    options,
    size = "md",
    disabled,
    error,
    clearable,
    style,
    onFocus,
    onBlur,
    onChange,
    onSearch,
    onSelect,
    editable = true,
    containerStyle,
    panelStyle,
    filterOption,
    notFoundContent,
    renderItem,
    keyExtractor,
    value,
    ...textInputProps
  } = props;

  const [inputState, setInputState] = useState<InputState>("default");
  const [open, setOpen] = useState(false);
  const isDisabled = disabled ?? !editable;

  const inputRef = useRef<TextInput>(null);
  // Guards against blur closing the panel before onPress fires on an option
  const selectingRef = useRef(false);

  const inputStyles = useGetInputStyles({
    size,
    inputState: open ? "focused" : inputState,
    disabled: isDisabled,
    error,
  });

  const dropdownStyles = useGetDropdownStyles({ size, open });

  const displayText = value != null ? String(value) : "";

  const filteredOptions = useMemo(() => {
    if (filterOption === false) return options;
    const filterFn = filterOption ?? defaultFilter;
    return options.filter((o) => filterFn(displayText, o));
  }, [options, displayText, filterOption]);

  const getKey = useCallback(
    (option: AutoCompleteOption<T>) => {
      if (keyExtractor) return keyExtractor(option);
      return String(option.value);
    },
    [keyExtractor],
  );

  const handleFocus = useCallback(
    (e: FocusEvent) => {
      if (!isDisabled) {
        setInputState("focused");
        setOpen(true);
      }
      onFocus?.(e);
    },
    [isDisabled, onFocus],
  );

  const handleBlur = useCallback(
    (e: BlurEvent) => {
      if (selectingRef.current) return;
      if (!isDisabled) setInputState("default");
      setOpen(false);
      onBlur?.(e);
    },
    [isDisabled, onBlur],
  );

  const handleChangeText = useCallback(
    (text: string) => {
      onChange?.(text as unknown as T);
      onSearch?.(text);
      if (!open) setOpen(true);
    },
    [onChange, onSearch, open],
  );

  const handleSelect = useCallback(
    (option: AutoCompleteOption<T>) => {
      selectingRef.current = false;
      onChange?.(option.value);
      onSelect?.(option.value, option);
      setOpen(false);
      inputRef.current?.blur();
    },
    [onChange, onSelect],
  );

  const handleOptionPressIn = useCallback(() => {
    selectingRef.current = true;
  }, []);

  const handleClear = useCallback(() => {
    onChange?.(undefined as unknown as T);
    onSearch?.("");
  }, [onChange, onSearch]);

  const showClear = clearable && !isDisabled && value != null && !open;
  const showPanel = open && filteredOptions.length > 0;
  const showNotFound = open && filteredOptions.length === 0 && notFoundContent != null;

  const renderDefaultItem = (option: AutoCompleteOption<T>, isSelected: boolean) => (
    <View
      style={StyleSheet.flatten([
        dropdownStyles.item,
        isSelected && dropdownStyles.itemActive,
      ])}
    >
      <Typography
        style={StyleSheet.flatten([
          dropdownStyles.itemText,
          { flex: 1 },
          isSelected && dropdownStyles.itemActiveText,
        ])}
      >
        {option.label}
      </Typography>
    </View>
  );

  return (
    <View style={[{ zIndex: open ? 9999 : 0 }, containerStyle]}>
      <View
        style={StyleSheet.flatten([
          inputStyles.container,
          { flexDirection: "row", alignItems: "center" },
        ])}
      >
        <TextInput
          {...textInputProps}
          ref={inputRef}
          editable={!isDisabled}
          value={displayText}
          placeholderTextColor={
            textInputProps.placeholderTextColor ?? inputStyles.placeholder.color
          }
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          style={StyleSheet.flatten([
            inputStyles.input,
            {
              flex: 1,
              padding: 0,
              margin: 0,
              minHeight: 0,
              includeFontPadding: false,
            },
            style,
          ])}
        />
        {showClear && (
          <Pressable onPress={handleClear} hitSlop={4}>
            <CrossIcon
              size={dropdownStyles.chevron.size}
              color={dropdownStyles.chevron.color}
            />
          </Pressable>
        )}
      </View>

      {(showPanel || showNotFound) && (
        <View
          style={StyleSheet.flatten([
            dropdownStyles.panel,
            {
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: 4,
            },
            panelStyle,
          ])}
        >
          {showNotFound ? (
            <View style={{ padding: 12, alignItems: "center" }}>
              {typeof notFoundContent === "string" ? (
                <Typography style={dropdownStyles.itemText}>
                  {notFoundContent}
                </Typography>
              ) : (
                notFoundContent
              )}
            </View>
          ) : (
            <FlatList
              data={filteredOptions}
              keyExtractor={getKey}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected = value != null && item.value === value;
                return (
                  <Pressable
                    onPressIn={handleOptionPressIn}
                    onPress={() => handleSelect(item)}
                  >
                    {renderItem
                      ? renderItem(item, isSelected)
                      : renderDefaultItem(item, isSelected)}
                  </Pressable>
                );
              }}
            />
          )}
        </View>
      )}
    </View>
  );
};
