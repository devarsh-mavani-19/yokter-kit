import { useState } from "react";
import { Animated, Dimensions, Easing } from "react-native";

const screenHeight = Dimensions.get("window").height;
const ANIMATION_DURATION = 300;

export function useAnimatedBottomModal(visible: boolean) {
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [translateYAnim] = useState(() => new Animated.Value(screenHeight));
  const [prevVisible, setPrevVisible] = useState(visible);
  const [animating, setAnimating] = useState(false);

  // Detect visibility changes during render (no effect needed)
  if (visible !== prevVisible) {
    setPrevVisible(visible);

    if (visible) {
      // Opening: start animate-in on next frame
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: ANIMATION_DURATION,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      // Closing: keep modal mounted during animation
      setAnimating(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: screenHeight,
          duration: ANIMATION_DURATION,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => setAnimating(false));
    }
  }

  return {
    modalVisible: visible || animating,
    fadeAnim,
    translateYAnim,
  };
}
