import { ReactNode } from "react";
import {
  Modal as RNModal,
  Pressable,
  View,
  ViewStyle,
  KeyboardAvoidingView,
  Animated,
  StyleSheet,
} from "react-native";
import { ModalSize } from "../../types";
import { Typography } from "../typography";
import { useGetBottomModalStyles } from "./use-get-bottom-modal-styles";
import { CloseIcon } from "../modal/close-icon";
import { useAnimatedBottomModal } from "./use-animated-bottom-modal";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type BottomModalProps = {
  /** Whether the modal is visible. */
  visible: boolean;
  /** Called when the modal should close. */
  onClose: () => void;
  /** Modal title shown in the header. If omitted, no header is rendered. */
  title?: string;
  /** Whether to show the close (X) button in the header. @default true */
  showCloseButton?: boolean;
  /** Whether to show the drag handle at the top. @default true */
  showHandle?: boolean;
  /** Whether pressing the overlay closes the modal. @default true */
  closeOnOverlayPress?: boolean;
  /** Modal size. @default "md" */
  size?: ModalSize;
  /** Content rendered in the modal body. */
  children?: ReactNode;
  /** Content rendered in the footer area below the body. */
  footer?: ReactNode;
  /** Override styles for the modal container. */
  containerStyle?: ViewStyle;
};

export const BottomModal = ({
  visible,
  onClose,
  title,
  showCloseButton = true,
  showHandle = true,
  closeOnOverlayPress = true,
  size = "md",
  children,
  footer,
  containerStyle,
}: BottomModalProps) => {
  const styles = useGetBottomModalStyles({ size });
  const showHeader = title != null || showCloseButton;

  const { modalVisible, fadeAnim, translateYAnim } =
    useAnimatedBottomModal(visible);

  return (
    <RNModal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <AnimatedPressable
        onPress={closeOnOverlayPress ? onClose : undefined}
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: styles.overlayColor, opacity: fadeAnim },
        ]}
      />
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior="height"
        style={internalStyles.safeArea}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            styles.container,
            containerStyle,
            { transform: [{ translateY: translateYAnim }] },
          ]}
        >
          {showHandle && (
            <View style={styles.handle}>
              <View style={styles.handleBar} />
            </View>
          )}

          {showHeader && (
            <View style={styles.header}>
              {title != null ? (
                <Typography style={styles.title} numberOfLines={1}>
                  {title}
                </Typography>
              ) : (
                <View style={{ flex: 1 }} />
              )}
              {showCloseButton && (
                <Pressable style={styles.closeButton} onPress={onClose}>
                  <CloseIcon
                    size={styles.closeIconSize}
                    color={styles.closeIconColor}
                  />
                </Pressable>
              )}
            </View>
          )}

          <View style={styles.body}>{children}</View>

          {footer != null && <View style={styles.footer}>{footer}</View>}
        </Animated.View>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

const internalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    flexDirection: "column-reverse",
  },
});
