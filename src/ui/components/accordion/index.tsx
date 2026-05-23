import { ReactNode, useCallback, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { Typography } from "../typography";
import { useGetAccordionStyles } from "./use-get-accordion-styles";
import { ChevronIcon } from "./chevron-icon";

export type AccordionItem = {
  /** Unique key for the item. */
  key: string;
  /** Title shown in the header. */
  title: string;
  /** Content rendered when expanded. Can be a string or a ReactNode. */
  content: ReactNode;
  /** Whether this item is disabled. */
  disabled?: boolean;
};

export type AccordionProps = {
  /** Items to render. */
  items: AccordionItem[];
  /** Allow multiple items to be expanded at once. @default false */
  multiple?: boolean;
  /** Controlled expanded keys. */
  expandedKeys?: string[];
  /** Default expanded keys (uncontrolled). */
  defaultExpandedKeys?: string[];
  /** Called when expanded keys change. */
  onExpandedChange?: (keys: string[]) => void;
  /** Whether the entire accordion is disabled. */
  disabled?: boolean;
};

export const Accordion = ({
  items,
  multiple = false,
  expandedKeys: controlledKeys,
  defaultExpandedKeys,
  onExpandedChange,
  disabled,
}: AccordionProps) => {
  const [internalKeys, setInternalKeys] = useState<string[]>(
    defaultExpandedKeys ?? [],
  );

  const isControlled = controlledKeys !== undefined;
  const expandedKeys = isControlled ? controlledKeys : internalKeys;

  const styles = useGetAccordionStyles();

  const handleToggle = useCallback(
    (key: string) => {
      const isExpanded = expandedKeys.includes(key);
      let next: string[];

      if (isExpanded) {
        next = expandedKeys.filter((k) => k !== key);
      } else {
        next = multiple ? [...expandedKeys, key] : [key];
      }

      if (!isControlled) {
        setInternalKeys(next);
      }
      onExpandedChange?.(next);
    },
    [expandedKeys, multiple, isControlled, onExpandedChange],
  );

  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        const isExpanded = expandedKeys.includes(item.key);
        const isDisabled = Boolean(disabled) || Boolean(item.disabled);
        const isLast = index === items.length - 1;

        return (
          <View
            key={item.key}
            style={!isLast ? styles.item : undefined}
          >
            <AccordionHeader
              title={item.title}
              expanded={isExpanded}
              disabled={isDisabled}
              onPress={() => handleToggle(item.key)}
              styles={styles}
            />
            {isExpanded && (
              <View style={styles.content}>
                {typeof item.content === "string" ? (
                  <Typography style={styles.contentText}>
                    {item.content}
                  </Typography>
                ) : (
                  item.content
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

type AccordionHeaderProps = {
  title: string;
  expanded: boolean;
  disabled?: boolean;
  onPress: () => void;
  styles: ReturnType<typeof useGetAccordionStyles>;
};

const AccordionHeader = ({
  title,
  expanded,
  disabled,
  onPress,
  styles,
}: AccordionHeaderProps) => {
  const [rotateAnim] = useState(
    () => new Animated.Value(expanded ? 1 : 0),
  );

  const [prevExpanded, setPrevExpanded] = useState(expanded);

  if (expanded !== prevExpanded) {
    setPrevExpanded(expanded);
    Animated.timing(rotateAnim, {
      toValue: expanded ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={StyleSheet.flatten([
        styles.header,
        disabled && styles.headerDisabled,
      ])}
    >
      <Typography
        style={StyleSheet.flatten([
          styles.title,
          disabled && styles.titleDisabled,
        ])}
        numberOfLines={1}
      >
        {title}
      </Typography>
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <ChevronIcon
          size={styles.chevronSize}
          color={disabled ? styles.chevronDisabledColor : styles.chevronColor}
        />
      </Animated.View>
    </Pressable>
  );
};
