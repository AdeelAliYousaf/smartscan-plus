import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import MorphTransition from '@/components/morph-transition';

// --- Animations ---
const FadeInItem = ({ index, children }: { index: number; children: React.ReactNode }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateX }],
      }}
    >
      {children}
    </Animated.View>
  );
};

// --- Mock Data & Types ---
interface HistoryItemProps {
  id: number;
  type: string;
  date: string;
  result: 'Normal' | 'Review Needed' | 'Critical';
  icon: keyof typeof Ionicons.glyphMap;
  category: string;
}

const mockHistory: HistoryItemProps[] = [
  { id: 1, type: 'Skin Lesion', date: 'Jan 9, 2026', result: 'Normal', icon: 'body-outline', category: 'This Month' },
  { id: 2, type: 'Anemia Check', date: 'Jan 7, 2026', result: 'Review Needed', icon: 'eye-outline', category: 'This Month' },
  { id: 3, type: 'General Checkup', date: 'Dec 28, 2025', result: 'Normal', icon: 'pulse-outline', category: 'December 2025' },
  { id: 4, type: 'Skin Lesion', date: 'Dec 15, 2025', result: 'Normal', icon: 'body-outline', category: 'December 2025' },
  { id: 5, type: 'Vitals Monitor', date: 'Nov 20, 2025', result: 'Critical', icon: 'heart-outline', category: 'November 2025' },
];

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedFilter, setSelectedFilter] = useState('All');

  // --- Dynamic Styles ---
  const bgStyle = { backgroundColor: isDark ? '#0F0F13' : '#F2F6F9' };
  const cardBg = isDark ? '#1E1E2E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const subTextColor = isDark ? '#A1A1AA' : '#64748B';

  // --- Helper to get color by result ---
  const getStatusColor = (result: string) => {
    switch (result) {
      case 'Normal': return '#27AE60';
      case 'Review Needed': return '#F39C12';
      case 'Critical': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  // --- Group Data ---
  const groupedData = mockHistory.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof mockHistory>);

  return (
    <MorphTransition style={{ flex: 1 }}>
      <View style={[styles.container, bgStyle]}>
      {/* 1. Header with Stats */}
      <LinearGradient
        colors={isDark ? ['#1a1a2e', '#0f0f1e'] : ['#4A90E2', '#357ABD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>Scan History</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Your health journey timeline</ThemedText>
        </View>
        
        {/* Quick Stats Dashboard */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)' }]}>
            <ThemedText style={styles.statNumber}>{mockHistory.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Total Scans</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: isDark ? 'rgba(231, 76, 60, 0.2)' : 'rgba(231, 76, 60, 0.3)' }]}>
            <ThemedText style={styles.statNumber}>
              {mockHistory.filter(i => i.result !== 'Normal').length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Action Needed</ThemedText>
          </View>
        </View>
      </LinearGradient>

      {/* 2. Timeline List */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupedData).map(([category, items], sectionIndex) => (
          <View key={category} style={styles.section}>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: isDark ? '#4A90E2' : '#357ABD' }]} />
              <ThemedText style={styles.sectionTitle}>{category}</ThemedText>
            </View>

            {/* Items */}
            <View style={styles.timelineContainer}>
              {/* Vertical Timeline Line */}
              <View style={[styles.timelineLine, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />
              
              <View style={styles.itemsList}>
                {items.map((item, index) => {
                  const statusColor = getStatusColor(item.result);
                  return (
                    <FadeInItem key={item.id} index={index + (sectionIndex * 2)}>
                      <TouchableOpacity
                        style={[styles.historyCard, { backgroundColor: cardBg }]}
                        activeOpacity={0.7}
                      >
                        {/* Icon Box */}
                        <View style={[styles.iconBox, { backgroundColor: statusColor + '15' }]}>
                          <Ionicons name={item.icon} size={24} color={statusColor} />
                        </View>

                        {/* Content */}
                        <View style={styles.cardContent}>
                          <View style={styles.cardTopRow}>
                            <ThemedText style={[styles.typeText, { color: textColor }]}>
                              {item.type}
                            </ThemedText>
                            <ThemedText style={styles.dateText}>{item.date}</ThemedText>
                          </View>
                          
                          <View style={styles.cardBottomRow}>
                            <View style={[styles.statusChip, { backgroundColor: statusColor + '20' }]}>
                              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                              <ThemedText style={[styles.statusText, { color: statusColor }]}>
                                {item.result}
                              </ThemedText>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color={subTextColor} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </FadeInItem>
                  );
                })}
              </View>
            </View>
          </View>
        ))}
        {/* Spacer for bottom navigation */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* 3. Floating "New Scan" Button */}
      <TouchableOpacity
        style={[styles.fab, { shadowColor: isDark ? '#000' : '#4A90E2' }]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#4A90E2', '#357ABD']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={30} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
      </View>
    </MorphTransition>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // --- Header ---
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  headerContent: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  // --- Content ---
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 8,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.6,
  },
  timelineContainer: {
    position: 'relative',
    paddingLeft: 12, // Indent for the timeline line
  },
  timelineLine: {
    position: 'absolute',
    left: 11, // Center the line relative to padding
    top: 0,
    bottom: 0,
    width: 2,
    borderRadius: 1,
  },
  itemsList: {
    paddingLeft: 20, // Space between line and cards
    gap: 12,
  },
  // --- Card Styles ---
  historyCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 12,
    opacity: 0.5,
    fontWeight: '500',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // --- FAB ---
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    borderRadius: 30,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});