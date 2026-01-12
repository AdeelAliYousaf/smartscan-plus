import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/use-color-scheme';

// --- Constants & Configuration ---
const { width } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 70; // Height of the SVG/Background
const FOOTER_PADDING = 10; // Extra padding for iPhone home indicator
const TAB_COUNT = 5;
const TAB_WIDTH = width / TAB_COUNT;
const CIRCLE_SIZE = 50; // Size of the floating ball
const ACTIVE_ICON_SIZE = 24;
const INACTIVE_ICON_SIZE = 22;
const SCAN_ICON_SIZE = 28; // Bigger scan icon

// --- Theme Colors ---
import { ColorValue } from 'react-native';

const getColors = (isDark: boolean) => ({
  background: isDark ? '#1a1a1e' : '#ffffff',
  activeBall: isDark ? '#1a1a1e' : '#ffffff',
  activeIcon: isDark ? '#398bffff' : '#0067eeff',
  inactiveIcon: '#888888',
  text: isDark ? '#888888' : '#888888',
  shadow: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  scanGradient: ['#0e2551ff', 'rgb(39, 104, 255)'] as [ColorValue, ColorValue],
});

// --- Animations ---
const ANIMATION_CONFIG = {
  duration: 300,
  useNativeDriver: true, // Native driver for transforms
};

// ------------------------------------------------------------------
// 1. The Individual Tab Button
// ------------------------------------------------------------------
interface TabBarButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  isFocused: boolean;
  onPress: () => void;
  index: number;
  isScanTab?: boolean;
  colors: ReturnType<typeof getColors>;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
  icon,
  label,
  isFocused,
  onPress,
  isScanTab = false,
  colors,
}) => {
  const animatedValue = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isFocused]);

  // Icon Movement: Goes UP when active to sit in the ball
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30], // Lift up by 30px
  });

  // Icon Opacity: Fades slightly when inactive
  const iconOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1], // Keep full opacity, color change handles the rest
  });

  // Label Opacity: Fades OUT when active (Cleaner look)
  const labelOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  // Label Scale: Shrinks when active
  const labelScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.5],
  });

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  // Special styling for scan tab
  if (isScanTab) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={styles.tabButton}
      >
        <Animated.View
          style={[
            styles.scanContainer,
            {
              transform: [{ translateY }],
              opacity: iconOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={colors.scanGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.scanGradient}
          >
            <Ionicons
              name={icon}
              size={SCAN_ICON_SIZE}
              color="#ffffff"
            />
          </LinearGradient>
        </Animated.View>

        <Animated.Text
          style={[
            styles.label,
            {
              opacity: labelOpacity,
              transform: [{ scale: labelScale }, { translateY: 5 }],
              color: colors.activeIcon,
              fontWeight: '700',
            },
          ]}
        >
          {label}
        </Animated.Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={styles.tabButton}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ translateY }],
            opacity: iconOpacity,
          },
        ]}
      >
        <Ionicons
          // @ts-ignore
          name={isFocused ? icon : `${icon}-outline`}
          size={isFocused ? ACTIVE_ICON_SIZE : INACTIVE_ICON_SIZE}
          color={isFocused ? colors.activeIcon : colors.inactiveIcon}
        />
      </Animated.View>

      <Animated.Text
        style={[
          styles.label,
          {
            opacity: labelOpacity,
            transform: [{ scale: labelScale }, { translateY: 5 }],
            color: colors.text,
          },
        ]}
      >
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
};

// ------------------------------------------------------------------
// 2. The Main Custom Tab Bar
// ------------------------------------------------------------------
interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  const animatedIndex = useRef(new Animated.Value(state.index)).current;

  // Configuration for tabs (Scan in center position)
  const tabConfig = {
    index: { icon: 'home', label: 'Home' },
    chat: { icon: 'chatbubble-ellipses', label: 'Chat' },
    scan: { icon: 'scan', label: '', isScanTab: true },
    history: { icon: 'time', label: 'History' },
    profile: { icon: 'person', label: 'Profile' },
  };

  // Smooth slide animation for the curve and the ball
  useEffect(() => {
    Animated.spring(animatedIndex, {
      toValue: state.index,
      friction: 8, // Bounciness
      tension: 60, // Speed
      useNativeDriver: true, // Native driver works for transform, but not SVG d-path in some versions.
      // Note: react-native-svg usually requires a JS listener or Reanimated for path updates.
      // Below we use a standard Interpolation approach compatible with basic Animated.
    }).start();
  }, [state.index]);

  const AnimatedSvg = Animated.createAnimatedComponent(Svg);
  const AnimatedPath = Animated.createAnimatedComponent(Path);

  // --- Curve Generation ---
  const getPath = (index: number) => {
    const curveDepth = 40; // How deep the curve goes
    const curveWidth = TAB_WIDTH * 0.8; // Width of the curve mouth
    const centerX = index * TAB_WIDTH + TAB_WIDTH / 2;
    
    // Logic:
    // M = Move to start
    // L = Line to
    // C = Cubic Bezier Curve (x1 y1, x2 y2, x y)

    // Start at top left
    return `
      M 0 0 
      L ${centerX - curveWidth} 0 
      C ${centerX - curveWidth / 2} 0, 
        ${centerX - curveWidth / 2} ${curveDepth}, 
        ${centerX} ${curveDepth} 
      C ${centerX + curveWidth / 2} ${curveDepth}, 
        ${centerX + curveWidth / 2} 0, 
        ${centerX + curveWidth} 0 
      L ${width} 0 
      L ${width} ${TAB_BAR_HEIGHT + insets.bottom} 
      L 0 ${TAB_BAR_HEIGHT + insets.bottom} 
      Z
    `;
  };

  // Interpolate the SVG Path string
  // Note: Interpolating strings requires the exact same format/length in all frames
  const path = animatedIndex.interpolate({
    inputRange: Array.from({ length: TAB_COUNT }, (_, i) => i),
    outputRange: Array.from({ length: TAB_COUNT }, (_, i) => getPath(i)),
  });

  // Interpolate the Floating Ball Position
  const ballTranslateX = animatedIndex.interpolate({
    inputRange: [0, 1, 2, 3, 4], // All 5 tabs
    outputRange: [
      TAB_WIDTH * 0 + TAB_WIDTH / 2 - CIRCLE_SIZE / 2, // Tab 0 (Home)
      TAB_WIDTH * 1 + TAB_WIDTH / 2 - CIRCLE_SIZE / 2, // Tab 1 (Explore)
      TAB_WIDTH * 2 + TAB_WIDTH / 2 - CIRCLE_SIZE / 2, // Tab 2 (Scan)
      TAB_WIDTH * 3 + TAB_WIDTH / 2 - CIRCLE_SIZE / 2, // Tab 3 (History)
      TAB_WIDTH * 4 + TAB_WIDTH / 2 - CIRCLE_SIZE / 2, // Tab 4 (Profile)
    ],
  });

  return (
    <View style={[styles.container, { height: TAB_BAR_HEIGHT + insets.bottom }]}>
      
      {/* 1. The Background SVG Shape */}
      <View style={StyleSheet.absoluteFill}>
        <AnimatedSvg
            width={width} 
            height={TAB_BAR_HEIGHT + insets.bottom}
            style={styles.shadow}
        >
          <AnimatedPath
            // @ts-ignore
            d={path}
            fill={colors.background}
          />
        </AnimatedSvg>
      </View>

      {/* 2. The Floating Ball (Background for Active Icon) */}
      <Animated.View
        style={[
          styles.floatingBall,
          {
            transform: [{ translateX: ballTranslateX }],
            backgroundColor: colors.activeBall,
            shadowColor: colors.shadow,
          },
        ]}
      />

      {/* 3. The Tab Buttons */}
      <View style={styles.tabsContainer}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          // @ts-ignore
          const config = tabConfig[route.name];
          if (!config) return null;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabBarButton
              key={route.key}
              icon={config.icon}
              label={config.label}
              isFocused={isFocused}
              onPress={onPress}
              index={index}
              isScanTab={config.isScanTab}
              colors={colors}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent', // Important for SVG to show
    elevation: 0,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10, // Android shadow
  },
  floatingBall: {
    position: 'absolute',
    top: -20, // Negative top moves it up out of the bar
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    // backgroundColor set dynamically
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
  scanContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
  },
  scanGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  iconContainer: {
    // We don't set absolute positioning here, we use transform
    justifyContent: 'center',
    alignItems: 'center',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    // color set dynamically
    position: 'absolute',
    bottom: 12, // Pin to bottom of bar
  },
});