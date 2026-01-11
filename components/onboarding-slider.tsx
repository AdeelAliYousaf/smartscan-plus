import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  FlatList,
  ViewToken,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SlideData {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  details?: string;
}

const slides: SlideData[] = [
  {
    id: '1',
    icon: 'medical-outline',
    title: 'Welcome to SmartScan+',
    description: 'AI-Powered Health Screening Assistant',
    details: 'Advanced technology to help you monitor your health and make informed decisions about when to seek professional medical care.',
  },
  {
    id: '2',
    icon: 'alert-circle-outline',
    title: 'Important Notice',
    description: 'Screening Tool, Not Diagnostic Device',
    details: 'SmartScan+ provides preliminary health screening only. Results are not a substitute for professional medical diagnosis. Always consult qualified healthcare providers.',
  },
  {
    id: '3',
    icon: 'body-outline',
    title: 'Skin Lesion Screening',
    description: '7 Types of Skin Conditions',
    details: 'Screen for melanoma, basal cell carcinoma, actinic keratosis, and other skin lesions. Early detection through regular monitoring.',
  },
  {
    id: '4',
    icon: 'eye-outline',
    title: 'Anemia Detection',
    description: 'Conjunctiva Image Analysis',
    details: 'Screen for potential anemia through advanced AI analysis of conjunctiva images using validated medical algorithms.',
  },
  {
    id: '5',
    icon: 'people-outline',
    title: 'Professional Consultation',
    description: 'Book Appointments & Get Expert Care',
    details: 'Use screening results as a guide to discuss with your healthcare provider. Schedule appointments directly through the app for proper diagnosis and treatment.',
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

  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
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

  const renderSlide = ({ item, index }: { item: SlideData; index: number }) => {
    const isWarningSlide = index === 1;
    
    return (
      <View style={[styles.slide, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}>
        <Animated.View style={[styles.slideContent, { opacity: fadeAnim }]}>
          {/* Icon Container */}
          <View style={[
            styles.iconContainer,
            { 
              backgroundColor: isWarningSlide 
                ? (isDark ? '#332200' : '#FFF8E1')
                : (isDark ? '#1a2332' : '#E3F2FD'),
              borderColor: isWarningSlide
                ? (isDark ? '#664400' : '#FFE082')
                : (isDark ? '#2d4a6e' : '#90CAF9'),
            }
          ]}>
            <Ionicons 
              name={item.icon} 
              size={72} 
              color={isWarningSlide 
                ? (isDark ? '#FFB300' : '#F57C00')
                : (isDark ? '#4A90E2' : '#1976D2')
              } 
            />
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <ThemedText style={[styles.progressText, { color: isDark ? '#888888' : '#666666' }]}>
              {index + 1} / {slides.length}
            </ThemedText>
          </View>

          {/* Content */}
          <View style={styles.textContainer}>
            <ThemedText style={[
              styles.slideTitle,
              { color: isDark ? '#ffffff' : '#1a1a1a' }
            ]}>
              {item.title}
            </ThemedText>
            
            <ThemedText style={[
              styles.slideDescription,
              { 
                color: isWarningSlide
                  ? (isDark ? '#FFB300' : '#F57C00')
                  : (isDark ? '#4A90E2' : '#1976D2')
              }
            ]}>
              {item.description}
            </ThemedText>

            <View style={[
              styles.divider,
              { backgroundColor: isDark ? '#333333' : '#e0e0e0' }
            ]} />

            <ThemedText style={[
              styles.slideDetails,
              { color: isDark ? '#b0b0b0' : '#555555' }
            ]}>
              {item.details}
            </ThemedText>
          </View>
        </Animated.View>
      </View>
    );
  };

  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];

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

          return (
            <Animated.View
              key={index.toString()}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: isDark ? '#4A90E2' : '#1976D2',
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}>
      <View style={styles.flatListContainer}>
        <FlatList
          ref={slidesRef}
          data={slides}
          renderItem={renderSlide}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
        />
      </View>

      {/* Bottom Navigation */}
      <View style={[
        styles.bottomContainer,
        { 
          backgroundColor: isDark ? '#0a0a0a' : '#f8f9fa',
          borderTopColor: isDark ? '#222222' : '#e0e0e0',
        }
      ]}>
        <Pagination />

        <View style={styles.buttonContainer}>
          {currentIndex < slides.length - 1 ? (
            <>
              <TouchableOpacity 
                style={styles.skipButton} 
                onPress={handleComplete} 
                activeOpacity={0.7}
              >
                <ThemedText style={[
                  styles.skipText,
                  { color: isDark ? '#888888' : '#666666' }
                ]}>
                  Skip
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.nextButton,
                  { backgroundColor: isDark ? '#1a4a7a' : '#1976D2' }
                ]}
                onPress={scrollTo} 
                activeOpacity={0.8}
              >
                <ThemedText style={styles.nextText}>Next</ThemedText>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={[
                styles.getStartedButton,
                { backgroundColor: isDark ? '#1a4a7a' : '#1976D2' }
              ]}
              onPress={handleComplete} 
              activeOpacity={0.8}
            >
              <ThemedText style={styles.getStartedText}>Get Started</ThemedText>
              <Ionicons name="checkmark-circle-outline" size={24} color="#ffffff" />
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
  flatListContainer: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 180,
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 480,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
    borderWidth: 2,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  slideDescription: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  divider: {
    width: 60,
    height: 3,
    borderRadius: 2,
    marginVertical: 20,
  },
  slideDetails: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderTopWidth: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  nextText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  getStartedButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: '#ffffff',
    fontWeight: '600',
  },
});
