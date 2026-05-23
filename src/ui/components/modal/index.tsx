import { ReactNode } from "react";
import {
  Modal as RNModal,
  Pressable,
  View,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ModalSize } from "../../types";
import { Typography } from "../typography";
import { useGetModalStyles } from "./use-get-modal-styles";
import { CloseIcon } from "./close-icon";

export type ModalProps = {
  /** Whether the modal is visible. */
  visible: boolean;
  /** Called when the modal should close (overlay press, close button, back button). */
  onClose: () => void;
  /** Modal title shown in the header. If omitted, no header is rendered. */
  title?: string;
  /** Whether to show the close (X) button in the header. @default true */
  showCloseButton?: boolean;
  /** Whether pressing the overlay closes the modal. @default true */
  closeOnOverlayPress?: boolean;
  /** Modal size. @default "md" */
  size?: ModalSize;
  /** Animation type. @default "fade" */
  animationType?: "none" | "slide" | "fade";
  /** Content rendered in the modal body. */
  children?: ReactNode;
  /** Content rendered in the footer area below the body. */
  footer?: ReactNode;
  /** Override styles for the modal container. */
  containerStyle?: ViewStyle;
};

export const Modal = ({
  visible,
  onClose,
  title,
  showCloseButton = true,
  closeOnOverlayPress = true,
  size = "md",
  animationType = "fade",
  children,
  footer,
  containerStyle,
}: ModalProps) => {
  const styles = useGetModalStyles({ size });

  const showHeader = title != null || showCloseButton;

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={closeOnOverlayPress ? onClose : undefined}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            style={[styles.container, containerStyle]}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
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
          </View>
        </KeyboardAvoidingView>
      </Pressable>
    </RNModal>
  );
};
