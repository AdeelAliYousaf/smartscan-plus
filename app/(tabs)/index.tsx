import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text'; // Assuming these exist from your snippet
import { useColorScheme } from '@/hooks/use-color-scheme';
import MorphTransition from '@/components/morph-transition';

const { width } = Dimensions.get('window');

// --- Reusable Components ---

const FadeInView = ({ delay, children, style }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
  isDark?: boolean;
}

const FeatureCard = ({ icon, title, description, color, isDark }: FeatureCardProps) => (
  <TouchableOpacity
    activeOpacity={0.9}
    style={[
      styles.featureCard,
      { backgroundColor: isDark ? '#1E1E2E' : '#FFFFFF' },
    ]}
  >
    <View style={[styles.iconBadge, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={28} color={color} />
    </View>
    <ThemedText style={styles.featureTitle}>{title}</ThemedText>
    <ThemedText style={styles.featureDescription} numberOfLines={3}>
      {description}
    </ThemedText>
    <View style={styles.cardFooter}>
      <ThemedText style={[styles.learnMore, { color }]}>Learn more</ThemedText>
      <Ionicons name="arrow-forward" size={16} color={color} />
    </View>
  </TouchableOpacity>
);

interface InfoStepProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  iconColor: string;
  isLast?: boolean;
  isDark?: boolean;
}

const InfoStep = ({ icon, title, description, iconColor, isLast, isDark }: InfoStepProps) => (
  <View style={styles.stepContainer}>
    <View style={styles.stepLeft}>
      <View style={[styles.stepIconContainer, { backgroundColor: iconColor + '15', borderColor: iconColor }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      {!isLast && <View style={[styles.stepLine, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />}
    </View>
    <View style={styles.stepContent}>
      <ThemedText style={styles.stepTitle}>{title}</ThemedText>
      <ThemedText style={styles.stepDescription}>{description}</ThemedText>
    </View>
  </View>
);

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Dynamic Styles
  const bgStyle = { backgroundColor: isDark ? '#0F0F13' : '#F2F6F9' };
  const cardBg = isDark ? '#1E1E2E' : '#FFFFFF';

  return (
    <MorphTransition style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, bgStyle]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // Space for bottom tab bar
      >
      {/* Hero Section */}
      <LinearGradient
        colors={isDark ? ['#1a1a2e', '#0f0f1e'] : ['#4A90E2', '#357ABD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <View style={styles.heroHeader}>
          <View>
            <ThemedText style={styles.greetingText}>Welcome back</ThemedText>
            <ThemedText style={styles.heroTitle}>SmartScan+</ThemedText>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logoImage}
              />
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.heroSubtitle}>
          Medical-grade AI screening assistant at your fingertips.
        </ThemedText>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>98%</ThemedText>
            <ThemedText style={styles.statLabel}>Accuracy</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>24/7</ThemedText>
            <ThemedText style={styles.statLabel}>Available</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>ISO</ThemedText>
            <ThemedText style={styles.statLabel}>Certified</ThemedText>
          </View>
        </View>
      </LinearGradient>

      {/* Floating Disclaimer Card - UX Improvement: Make it distinct but not aggressive */}
      <FadeInView delay={100} style={styles.disclaimerWrapper}>
        <View style={[styles.disclaimerCard, { backgroundColor: isDark ? '#2C2020' : '#FFF8E1', borderColor: isDark ? '#4A3030' : '#FFE082' }]}>
          <Ionicons name="shield-checkmark" size={24} color={isDark ? '#FF8A80' : '#F57F17'} />
          <View style={styles.disclaimerTextContainer}>
            <ThemedText style={[styles.disclaimerTitle, { color: isDark ? '#FF8A80' : '#F57F17' }]}>
              Screening Tool Only
            </ThemedText>
            <ThemedText style={[styles.disclaimerBody, { color: isDark ? '#FFCCBC' : '#FF6F00' }]}>
              Results are for informational purposes. Always consult a certified healthcare professional.
            </ThemedText>
          </View>
        </View>
      </FadeInView>

      {/* Horizontal Scroll for Services - UX Improvement: Better use of space */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Services</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAllText}>See all</ThemedText>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.horizontalScroll}
          decelerationRate="fast"
          snapToInterval={width * 0.75 + 16} // Card width + gap
        >
          <FeatureCard
            icon="body-outline"
            title="Skin Lesion Check"
            description="AI analysis of moles, spots, and skin irregularities."
            color="#E74C3C"
            isDark={isDark}
          />
          <FeatureCard
            icon="eye-outline"
            title="Anemia Detect"
            description="Non-invasive anemia screening via eye conjunctiva analysis."
            color="#9B59B6"
            isDark={isDark}
          />
          <FeatureCard
            icon="pulse-outline"
            title="Vitals Monitor"
            description="Track health trends and historical screening data."
            color="#3498DB"
            isDark={isDark}
          />
        </ScrollView>
      </View>

      {/* Grid Layout for Lesions - UX Improvement: Easier scanning */}
      <FadeInView delay={300} style={styles.sectionContainer}>
        <ThemedText style={styles.sectionTitle}>Detectable Conditions</ThemedText>
        <ThemedText style={styles.sectionSubtitle}>
          Our AI is trained to recognize these specific patterns
        </ThemedText>

        <View style={styles.gridContainer}>
          {[
            { name: 'Melanoma', type: 'High Risk', color: '#E74C3C' },
            { name: 'Basal Cell', type: 'High Risk', color: '#E74C3C' },
            { name: 'Actinic Kera.', type: 'Warning', color: '#F39C12' },
            { name: 'Benign Kera.', type: 'Low Risk', color: '#27AE60' },
            { name: 'Dermatofibroma', type: 'Low Risk', color: '#27AE60' },
            { name: 'Vascular Lesion', type: 'Low Risk', color: '#27AE60' },
          ].map((item, index) => (
            <View key={index} style={[styles.gridItem, { backgroundColor: cardBg }]}>
              <View style={[styles.gridDot, { backgroundColor: item.color }]} />
              <View>
                <ThemedText style={styles.gridTitle}>{item.name}</ThemedText>
                <ThemedText style={[styles.gridSubtitle, { color: item.color }]}>
                  {item.type}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      </FadeInView>

      {/* Timeline Layout for Process - UX Improvement: Clear flow */}
      <FadeInView delay={500} style={styles.sectionContainer}>
        <ThemedText style={styles.sectionTitle}>Simple Process</ThemedText>
        <View style={[styles.processCard, { backgroundColor: cardBg }]}>
          <InfoStep
            icon="camera-outline"
            title="Capture"
            description="Take a clear, focused photo of the area."
            iconColor="#4A90E2"
            isDark={isDark}
          />
          <InfoStep
            icon="scan-outline"
            title="Analyze"
            description="AI processes visual patterns instantly."
            iconColor="#9B59B6"
            isDark={isDark}
          />
          <InfoStep
            icon="document-text-outline"
            title="Review"
            description="Get immediate risk assessment results."
            iconColor="#27AE60"
            isLast
            isDark={isDark}
          />
        </View>
      </FadeInView>

      {/* Large CTA - UX Improvement: Clear primary action */}
      <FadeInView delay={700} style={styles.ctaContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4A90E2', '#357ABD']}
            style={styles.gradientButton}
          >
            <Ionicons name="scan" size={24} color="#FFF" />
            <ThemedText style={styles.primaryButtonText}>Start New Scan</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton}>
          <ThemedText style={styles.secondaryButtonText}>Book Consultation</ThemedText>
        </TouchableOpacity>
      </FadeInView>

      </ScrollView>
    </MorphTransition>
  );
}

const styles = StyleSheet.create({
  logoImage: {
    width: 70,
    height: 70,
    borderRadius: 16,
  },
  container: {
    flex: 1,
  },
  // Hero
  heroSection: {
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileButton: {
    padding: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 30,
    lineHeight: 24,
    maxWidth: '90%',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    backdropFilter: 'blur(10px)', // Works on Web, ignored on native
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    height: '80%',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  // Disclaimer
  disclaimerWrapper: {
    marginTop: -25,
    paddingHorizontal: 20,
  },
  disclaimerCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  disclaimerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  disclaimerBody: {
    fontSize: 12,
    lineHeight: 18,
  },
  // Sections
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.5,
    marginBottom: 16,
  },
  seeAllText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
  },
  // Horizontal Scroll
  horizontalScroll: {
    paddingRight: 24,
    gap: 16,
  },
  featureCard: {
    width: width * 0.75,
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  iconBadge: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.6,
    lineHeight: 22,
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  learnMore: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: (width - 48 - 12) / 2, // (Screen - padding - gap) / 2
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  gridDot: {
    width: 8,
    height: 32,
    borderRadius: 4,
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  gridSubtitle: {
    fontSize: 11,
    fontWeight: '600',
  },
  // Process
  processCard: {
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  stepContainer: {
    flexDirection: 'row',
  },
  stepLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  stepLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
    borderRadius: 1,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 32, // Space for the line
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    opacity: 0.6,
    lineHeight: 20,
  },
  // CTA
  ctaContainer: {
    padding: 24,
    gap: 16,
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  gradientButton: {
    paddingVertical: 18,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
});