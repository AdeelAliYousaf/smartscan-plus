import React, { useRef, useEffect } from 'react';
import { Animated, StyleProp, ViewStyle, Easing } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

interface MorphTransitionProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

// Professional Enterprise-Grade Morphism: Figma/Apple standard
// Pure native driver for performance
export default function MorphTransition({ 
  children, 
  duration = 350, 
  delay = 0,
  style
}: MorphTransitionProps) {
  const isFocused = useIsFocused();
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;
  const translateYAnim = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    if (isFocused) {
      // Smooth fade in + scale + rise
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration,
          delay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Smooth fade out + scale down + drop
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.96,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 8,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFocused, duration, delay]);

  return (
    <Animated.View 
      style={[
        style,
        {
          opacity: opacityAnim,
          transform: [
            { translateY: translateYAnim },
            { scale: scaleAnim }
          ],
        }
      ]}
    > 
      {children}
    </Animated.View>
  );
}
