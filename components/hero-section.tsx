import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;

const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return 'Good Morning';
  } else if (hour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

export default function HeroSection({ isDark }: { isDark: boolean }) {
  return (
    <View style={styles.heroContainer}>
      <LinearGradient
        colors={isDark ? ['#0c4a6e', '#0891b2'] : ['#1e40af', '#0369a1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      >
        {/* Background Pattern Elements for Depth */}
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

        {/* Header Row */}
        <View style={styles.headerTop}>
          <View>
            <ThemedText style={styles.greeting}>{getGreeting()}</ThemedText>
            <ThemedText style={styles.headerTitle}>SmartScan Plus</ThemedText>
            <ThemedText style={styles.subTitle}>Your Medical AI Screening assistant at your fingertips.</ThemedText>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logoImage}
            />
          </TouchableOpacity>
        </View>

        {/* --- THE GLASSMORPHISM CONTAINER --- */}
        <View style={styles.glassStatsContainer}>
           <View style={styles.statBox}>
              <Ionicons name="shield-checkmark" size={20} color="#BFDBFE" />
              <ThemedText style={styles.statNumber}>92%</ThemedText>
              <ThemedText style={styles.statLabel}>Accuracy</ThemedText>
           </View>
           
           <View style={styles.statDivider} />
           
           <View style={styles.statBox}>
              <Ionicons name="time" size={20} color="#BFDBFE" />
              <ThemedText style={styles.statNumber}>24/7</ThemedText>
              <ThemedText style={styles.statLabel}>Available</ThemedText>
           </View>
           
           <View style={styles.statDivider} />
           
           <View style={styles.statBox}>
              <Ionicons name="apps-outline" size={20} color="#BFDBFE" />
              <ThemedText style={styles.statNumber}>AI</ThemedText>
              <ThemedText style={styles.statLabel}>Assisted</ThemedText>
           </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    height: 340,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  heroGradient: {
    flex: 1,
    paddingTop: STATUS_BAR_HEIGHT + 20,
    paddingHorizontal: 24,
    position: 'relative',
  },
  // Abstract background shapes improve the glass effect
  bgCircle1: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  bgCircle2: {
    position: 'absolute',
    top: 100,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  greeting: {
    fontSize: 14,
    color: '#DBEAFE',
    fontWeight: '600',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    color: 'white',
    fontWeight: '800',
    zIndex: 1000,

  },
  subTitle: {
    fontSize: 12,
    color: '#DBEAFE',
    marginTop: 4,
    maxWidth: 250,
  },
  profileBtn: {
    width: 4,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  logoImage: {
    width: 70,
    height: 70,
    resizeMode: 'cover',
  },
  // --- Glassmorphism Styles ---
  glassStatsContainer: {
    flexDirection: 'row',
    // 1. Semi-transparent background
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    // 2. Rounded corners
    borderRadius: 20,
    padding: 20,
    // 3. Thin, semi-transparent border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'space-between',
    // 4. Web-only blur (for Native, use expo-blur if needed)
    // backdropFilter is not supported in React Native
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statNumber: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    color: '#DBEAFE',
    fontSize: 12,
    marginTop: 2,
  },
});
