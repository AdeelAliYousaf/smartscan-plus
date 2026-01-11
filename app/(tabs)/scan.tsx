import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  ImageBackground,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import MorphTransition from '@/components/morph-transition';

const { width } = Dimensions.get('window');

// --- Animations ---
const FadeInView = ({ delay, children }: { delay: number; children: React.ReactNode }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

// Pulse Animation for the main icon
const PulseIcon = ({ name, color }: { name: any; color: string }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Ionicons name={name} size={64} color={color} />
        </Animated.View>
    );
};

export default function ScanScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // --- Dynamic Styles ---
  const bgStyle = { backgroundColor: isDark ? '#0F0F13' : '#F2F6F9' };
  const cardBg = isDark ? '#1E1E2E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';

  return (
    <MorphTransition style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, bgStyle]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
      {/* 1. Immersive Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={isDark ? ['#1a1a2e', '#0f0f1e'] : ['#1976D2', '#1565C0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
             <PulseIcon name="scan-circle" color="#FFFFFF" />
             <ThemedText style={styles.headerTitle}>Start a Checkup</ThemedText>
             <ThemedText style={styles.headerSubtitle}>
               AI-powered analysis for early detection
             </ThemedText>
          </View>

          {/* Camera Status Badge */}
          <View style={styles.permissionBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
            <ThemedText style={styles.permissionText}>Camera Ready</ThemedText>
          </View>
        </LinearGradient>
      </View>

      {/* 2. Main Scan Options */}
      <View style={styles.contentContainer}>
        <ThemedText style={styles.sectionTitle}>Select Screening Type</ThemedText>
        
        {/* Option A: Skin Lesion */}
        <FadeInView delay={200}>
            <TouchableOpacity
                style={[styles.scanCard, { backgroundColor: cardBg }]}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={['#FF9A9E', '#FECFEF']}
                    style={styles.cardIconBackground}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Ionicons name="body" size={32} color="#FFF" />
                </LinearGradient>
                
                <View style={styles.cardTextContent}>
                    <View style={styles.cardHeaderRow}>
                        <ThemedText style={styles.cardTitle}>Skin Lesion Scan</ThemedText>
                        <View style={[styles.tag, { backgroundColor: '#FFEFF0' }]}>
                            <ThemedText style={[styles.tagText, { color: '#E74C3C' }]}>Popular</ThemedText>
                        </View>
                    </View>
                    <ThemedText style={styles.cardDescription}>
                        Detect melanoma, carcinoma, and other skin irregularities.
                    </ThemedText>
                </View>
                
                <View style={styles.arrowContainer}>
                    <Ionicons name="chevron-forward" size={24} color={isDark ? '#888' : '#C7C7CC'} />
                </View>
            </TouchableOpacity>
        </FadeInView>

        {/* Option B: Anemia */}
        <FadeInView delay={400}>
            <TouchableOpacity
                style={[styles.scanCard, { backgroundColor: cardBg }]}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={['#4facfe', '#00f2fe']}
                    style={styles.cardIconBackground}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Ionicons name="eye" size={32} color="#FFF" />
                </LinearGradient>
                
                <View style={styles.cardTextContent}>
                    <ThemedText style={styles.cardTitle}>Anemia Detection</ThemedText>
                    <ThemedText style={styles.cardDescription}>
                        Non-invasive screening via conjunctiva (eye) analysis.
                    </ThemedText>
                </View>

                <View style={styles.arrowContainer}>
                    <Ionicons name="chevron-forward" size={24} color={isDark ? '#888' : '#C7C7CC'} />
                </View>
            </TouchableOpacity>
        </FadeInView>
      </View>

      {/* 3. Helper Section */}
      <FadeInView delay={600}>
        <View style={styles.tipsContainer}>
            <View style={[styles.tipsHeader, { borderColor: isDark ? '#333' : '#E0E0E0' }]}>
                <Ionicons name="bulb-outline" size={20} color={isDark ? '#FFD700' : '#F57F17'} />
                <ThemedText style={styles.tipsTitle}>Best Practices</ThemedText>
            </View>
            
            <View style={[styles.tipsContent, { backgroundColor: isDark ? '#1a1a1a' : '#FFF' }]}>
                <View style={styles.tipItem}>
                    <Ionicons name="sunny-outline" size={20} color={isDark ? '#888' : '#666'} />
                    <ThemedText style={styles.tipText}>Use natural daylight when possible</ThemedText>
                </View>
                <View style={styles.tipItem}>
                    <Ionicons name="resize-outline" size={20} color={isDark ? '#888' : '#666'} />
                    <ThemedText style={styles.tipText}>Center the area within the frame</ThemedText>
                </View>
                <View style={styles.tipItem}>
                    <Ionicons name="hand-left-outline" size={20} color={isDark ? '#888' : '#666'} />
                    <ThemedText style={styles.tipText}>Hold device steady for 3 seconds</ThemedText>
                </View>
            </View>
        </View>
      </FadeInView>

      {/* Spacer for Bottom Nav */}
      <View style={{ height: 100 }} />
      </ScrollView>
    </MorphTransition>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // --- Header ---
  headerContainer: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '80%',
  },
  permissionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    backdropFilter: 'blur(10px)',
  },
  permissionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  // --- Content ---
  contentContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 4,
    opacity: 0.8,
  },
  // --- Scan Cards ---
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 8,
  },
  cardIconBackground: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContent: {
    flex: 1,
    gap: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 13,
    opacity: 0.6,
    lineHeight: 18,
    marginRight: 8,
  },
  arrowContainer: {
    justifyContent: 'center',
  },
  // --- Tips Section ---
  tipsContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingLeft: 4,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContent: {
    borderRadius: 20,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipText: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
});