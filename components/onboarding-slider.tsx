import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken
} from 'react-native';
import { ThemedText } from './themed-text';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SlideData {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  details?: string;
  color: string;
  colorDark: string;
}

const slides: SlideData[] = [
  {
    id: '1',
    icon: 'medical-outline',
    title: 'Welcome to SmartScan+',
    description: 'AI-Powered Skin Lesion & Anemia Screening',
    details: 'SmartScan+ uses advanced technology to help you monitor skin lesions and anemia safely and effectively.',
    color: '#1565C0',      // Deep trustworthy blue
    colorDark: '#1976D2',
  },
  {
    id: '2',
    icon: 'shield-checkmark-outline',
    title: 'Important Notice',
    description: 'Screening Tool Only',
    details: 'SmartScan+ provides preliminary results. Always consult licensed healthcare professionals for diagnosis and treatment.',
    color: '#EF6C00',      // Orange for caution/warning
    colorDark: '#FF9800',
  },
  {
    id: '3',
    icon: 'body-outline',
    title: 'Skin Lesion Screening',
    description: 'Monitor 7 Common Conditions',
    details: 'Early detection of melanoma, basal cell carcinoma, actinic keratosis, and other skin lesions can save lives.',
    color: '#6A1B9A',      // Purple for clinical sophistication
    colorDark: '#8E24AA',
  },
  {
    id: '4',
    icon: 'eye-outline',
    title: 'Anemia Detection',
    description: 'Conjunctiva Analysis Made Simple',
    details: 'SmartScan+ screens for potential anemia using validated AI analysis of eye images with medical-grade accuracy.',
    color: '#C62828',      // Red for alert, health attention
    colorDark: '#8c2e2e',
  },
  {
    id: '5',
    icon: 'people-outline',
    title: 'Connect with Experts',
    description: 'Book Consultations Easily',
    details: 'Share your screening results with healthcare providers and schedule appointments directly through the app.',
    color: '#2E7D32',      // Green for trust, growth, health
    colorDark: '#388E3C',
  },
  {
    id: '6',
    icon: 'lock-closed-outline',
    title: 'Your Privacy Matters',
    description: 'Data Security & Confidentiality',
    details: 'We prioritize your privacy with end-to-end encryption and strict data protection policies. Your health data is secure with us.',
    color: '#455A64',      // Slate gray for security/reliability
    colorDark: '#607D8B',
  },

];


interface OnboardingSliderProps {
  onComplete: () => void;
}

export default function OnboardingSlider({ onComplete }: OnboardingSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Animation values for icon animations
  const blinkAnim = useRef(new Animated.Value(1)).current; // For blinking eyes
  const rotateAnim = useRef(new Animated.Value(0)).current; // For unlocking lock
  const pulseAnim = useRef(new Animated.Value(1)).current; // For pulsing icons
  const scaleAnim = useRef(new Animated.Value(1)).current; // For logo scaling
  const swayAnim = useRef(new Animated.Value(0)).current; // For body/people swaying
  const breatheAnim = useRef(new Animated.Value(1)).current; // For shield breathing
  
  // Content animation
  const contentFadeAnim = useRef(new Animated.Value(0)).current;
  const contentSlideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Reset animations
    contentFadeAnim.setValue(0);
    contentSlideAnim.setValue(50);
    blinkAnim.setValue(1);
    rotateAnim.setValue(0);
    pulseAnim.setValue(1);
    scaleAnim.setValue(1);
    swayAnim.setValue(0);
    breatheAnim.setValue(1);

    // Determine animation based on current slide
    const animationSequence: Animated.CompositeAnimation[] = [];

    // Icon animation based on slide index
    switch (currentIndex) {
      case 0: // Logo - scale pulse
        animationSequence.push(
          Animated.loop(
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 1.1,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
              }),
            ])
          )
        );
        break;
      case 1: // Shield - breathing/pulse effect
        animationSequence.push(
          Animated.loop(
            Animated.sequence([
              Animated.timing(breatheAnim, {
                toValue: 0.85,
                duration: 1200,
                useNativeDriver: true,
              }),
              Animated.timing(breatheAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
              }),
            ])
          )
        );
        break;
      case 2: // Body - gentle sway
        animationSequence.push(
          Animated.loop(
            Animated.sequence([
              Animated.timing(swayAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(swayAnim, {
                toValue: -1,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(swayAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
              }),
            ])
          )
        );
        break;
      case 3: // Eye - blink effect
        animationSequence.push(
          Animated.loop(
            Animated.sequence([
              Animated.timing(blinkAnim, {
                toValue: 0.3,
                duration: 150,
                useNativeDriver: true,
                delay: 2000,
              }),
              Animated.timing(blinkAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
              }),
            ])
          )
        );
        break;
      case 4: // People - wave/sway effect
        animationSequence.push(
          Animated.loop(
            Animated.sequence([
              Animated.timing(swayAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(swayAnim, {
                toValue: -1,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(swayAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
              }),
            ])
          )
        );
        break;
      case 5: // Lock - unlock and lock rotation
        animationSequence.push(
          Animated.loop(
            Animated.sequence([
              Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
                delay: 2000,
              }),
              Animated.timing(rotateAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
              }),
            ])
          )
        );
        break;
    }

    // Animate content in
    Animated.timing(contentFadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      delay: 300,
    }).start();

    Animated.spring(contentSlideAnim, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
      delay: 300,
    }).start();

    // Start icon animation if available
    if (animationSequence.length > 0) {
      Animated.parallel(animationSequence).start();
    }

    return () => {
      // Cleanup animations
      animationSequence.forEach(anim => anim.stop?.());
    };
  }, [currentIndex]);

  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ 
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('@onboarding_complete', 'true');
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      onComplete();
    }
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const renderSlide = ({ item, index }: { item: SlideData; index: number }) => {
    const isActive = index === currentIndex;
    const accentColor = isDark ? item.colorDark : item.color;
    
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    // Subtle parallax
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.92, 1, 0.92],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });

    // Icon-specific animations
    const blinkScale = blinkAnim.interpolate({
      inputRange: [0.3, 1],
      outputRange: [0.5, 1],
    });

    const unlockRotation = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-25deg'],
    });

    const pulseScale = pulseAnim.interpolate({
      inputRange: [0.8, 1],
      outputRange: [0.8, 1],
    });

    const logoScale = scaleAnim.interpolate({
      inputRange: [1, 1.1],
      outputRange: [1, 1.1],
    });

    const swayRotate = swayAnim.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: ['-8deg', '0deg', '8deg'],
    });

    const breatheScale = breatheAnim.interpolate({
      inputRange: [0.85, 1],
      outputRange: [0.85, 1],
    });

    return (
      <Animated.View 
        style={[
          styles.slide,
          {
            opacity,
            transform: [{ scale }],
          }
        ]}
      >
        <View style={styles.slideContent}>
          {/* Icon/Image with custom animations */}
          <Animated.View style={[
            styles.iconContainer,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
              borderColor: `${accentColor}20`,
            }
          ]}>
            {/* Subtle glow */}
            <View style={[
              styles.iconGlow,
              { backgroundColor: accentColor, opacity: 0.1 }
            ]} />
            
            {index === 0 ? (
              // First slide - Logo image
              <Animated.Image
                source={require('@/assets/images/logo.png')}
                style={[styles.logoImage, { transform: [{ scale: logoScale }] }]}
              />
            ) : (
              // Other slides - Icon with animations
              <Animated.View
                style={[
                  {
                    transform: [
                      { 
                        scale: index === 1 ? breatheScale : index === 3 ? blinkScale : 1
                      },
                      { 
                        rotate: index === 2 || index === 4 ? swayRotate : index === 5 ? unlockRotation : '0deg'
                      },
                    ],
                  }
                ]}
              >
                <Ionicons 
                  name={item.icon} 
                  size={56} 
                  color={accentColor} 
                />
              </Animated.View>
            )}
          </Animated.View>

          {/* Content with fade and slide animation - Always rendered but hidden until active */}
          <Animated.View style={[
            styles.textContainer,
            {
              opacity: isActive ? contentFadeAnim : new Animated.Value(0),
              transform: [{ translateY: isActive ? contentSlideAnim : new Animated.Value(50) }],
              pointerEvents: isActive ? 'auto' : 'none',
            }
          ]}>
            <View style={styles.badge}>
              <ThemedText style={[
                styles.badgeText,
                { color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)' }
              ]}>
                {index + 1} of {slides.length}
              </ThemedText>
            </View>

            <ThemedText style={[
              styles.slideTitle,
              { color: isDark ? '#FFFFFF' : '#000000' }
            ]}>
              {item.title}
            </ThemedText>
            
            <ThemedText style={[
              styles.slideDescription,
              { color: accentColor }
            ]}>
              {item.description}
            </ThemedText>

            <View style={[
              styles.divider,
              { backgroundColor: `${accentColor}30` }
            ]} />

            <ThemedText style={[
              styles.slideDetails,
              { color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }
            ]}>
              {item.details}
            </ThemedText>
          </Animated.View>
        </View>
      </Animated.View>
    );
  };

  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((slide, index) => {
          const inputRange = [
            (index - 1) * SCREEN_WIDTH, 
            index * SCREEN_WIDTH, 
            (index + 1) * SCREEN_WIDTH
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 32, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          const accentColor = isDark ? slide.colorDark : slide.color;

          return (
            <Animated.View
              key={index.toString()}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: accentColor,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const currentColor = isDark ? slides[currentIndex].colorDark : slides[currentIndex].color;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
      {/* Subtle gradient overlay */}
      <View style={[
        styles.gradientOverlay,
        { backgroundColor: `${currentColor}05` }
      ]} />

      <FlatList
        ref={slidesRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        decelerationRate="fast"
      />

      {/* Bottom Navigation */}
      <View style={[
        styles.bottomContainer,
        { 
          backgroundColor: isDark ? '#000000' : '#FFFFFF',
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        }
      ]}>
        <Pagination />

        <View style={styles.buttonContainer}>
          {currentIndex < slides.length - 1 ? (
            <>
              <TouchableOpacity 
                style={styles.skipButton} 
                onPress={handleComplete} 
                activeOpacity={0.6}
              >
                <ThemedText style={[
                  styles.skipText,
                  { color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' }
                ]}>
                  Skip
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.nextButton,
                  { backgroundColor: currentColor }
                ]}
                onPress={scrollTo} 
                activeOpacity={0.85}
              >
                <ThemedText style={styles.buttonText}>Continue</ThemedText>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={[
                styles.getStartedButton,
                { backgroundColor: currentColor }
              ]}
              onPress={handleComplete} 
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
              <ThemedText style={styles.buttonText}>Get Started</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  slide: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 440,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
    borderWidth: 2,
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  logoImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  slideDescription: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 24,
    letterSpacing: 0.2,
  },
  divider: {
    width: 50,
    height: 4,
    borderRadius: 2,
    marginBottom: 24,
  },
  slideDetails: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.1,
    paddingHorizontal: 8,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
    borderTopWidth: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    height: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  skipButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 28,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 28,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});