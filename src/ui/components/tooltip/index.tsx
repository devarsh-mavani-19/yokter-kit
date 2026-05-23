import { ReactNode, useCallback, useState } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { TooltipPlacement } from "../../types";
import { Typography } from "../typography";
import { useGetTooltipStyles } from "./use-get-tooltip-styles";

export type TooltipProps = {
  /** Text content to display in the tooltip. */
  content: string;
  /** Placement of the tooltip relative to the trigger. @default "top" */
  placement?: TooltipPlacement;
  /** Size of the tooltip. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Whether the tooltip is disabled. */
  disabled?: boolean;
  /** Controlled visibility. If provided, the tooltip won't manage its own state. */
  visible?: boolean;
  /** Called when visibility changes (controlled mode). */
  onVisibleChange?: (visible: boolean) => void;
  /** The trigger element. */
  children: ReactNode;
  /** Override styles for the tooltip container wrapper. */
  containerStyle?: ViewStyle;
};

export const Tooltip = ({
  content,
  placement = "top",
  size = "md",
  disabled,
  visible: controlledVisible,
  onVisibleChange,
  children,
  containerStyle,
}: TooltipProps) => {
  const [internalVisible, setInternalVisible] = useState(false);

  const isControlled = controlledVisible !== undefined;
  const isVisible = isControlled ? controlledVisible : internalVisible;

  const styles = useGetTooltipStyles({ size, placement });

  const show = useCallback(() => {
    if (disabled) return;
    if (isControlled) {
      onVisibleChange?.(true);
    } else {
      setInternalVisible(true);
    }
  }, [disabled, isControlled, onVisibleChange]);

  const hide = useCallback(() => {
    if (isControlled) {
      onVisibleChange?.(false);
    } else {
      setInternalVisible(false);
    }
  }, [isControlled, onVisibleChange]);

  const toggle = useCallback(() => {
    if (isVisible) {
      hide();
    } else {
      show();
    }
  }, [isVisible, show, hide]);

  return (
    <View style={[{ position: "relative" }, containerStyle]}>
      <Pressable onPress={toggle} onLongPress={show}>
        {children}
      </Pressable>

      {isVisible && (
        <View style={styles.tooltipContainer} pointerEvents="none">
          <View style={styles.tooltip}>
            <Typography style={styles.tooltipText}>{content}</Typography>
            <View style={styles.arrow} />
          </View>
        </View>
      )}
    </View>
  );
};
