import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Switch,
  Platform,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import MorphTransition from '@/components/morph-transition';
import AuthOverlay from '@/components/auth-overlay';
import { useAuth } from '@/contexts/auth-context';

const { width } = Dimensions.get('window');

// --- Animations ---
const FadeInView = ({ delay, children }: { delay: number; children: React.ReactNode }) => {
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
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

// --- Types ---
interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  color: string;
  hasSwitch?: boolean;
  value?: boolean;
  onPress?: () => void;
  isDestructive?: boolean;
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const { isAuthenticated, signInWithGoogle, registerAsProfessional } = useAuth();

  // --- Dynamic Styles ---
  const bgStyle = { backgroundColor: isDark ? '#0F0F13' : '#F2F6F9' };
  const cardBg = isDark ? '#1E1E2E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const subTextColor = isDark ? '#A1A1AA' : '#64748B';

  const MenuSection = ({ title, items }: { title: string; items: MenuItemProps[] }) => (
    <View style={styles.sectionContainer}>
      <ThemedText style={styles.sectionHeader}>{title}</ThemedText>
      <View style={[styles.sectionCard, { backgroundColor: cardBg }]}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index !== items.length - 1 && { borderBottomWidth: 1, borderBottomColor: isDark ? '#333' : '#F0F0F0' }
            ]}
            onPress={item.onPress}
            activeOpacity={item.hasSwitch ? 1 : 0.7}
            disabled={item.hasSwitch}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            
            <View style={styles.menuTextContainer}>
              <ThemedText style={[styles.menuTitle, item.isDestructive && { color: '#FF3B30' }]}>
                {item.title}
              </ThemedText>
              {item.subtitle && (
                <ThemedText style={styles.menuSubtitle}>{item.subtitle}</ThemedText>
              )}
            </View>

            {item.hasSwitch ? (
              <Switch
                value={isNotificationsEnabled}
                onValueChange={setIsNotificationsEnabled}
                trackColor={{ false: '#767577', true: '#4A90E2' }}
                thumbColor={isNotificationsEnabled ? '#fff' : '#f4f3f4'}
              />
            ) : (
              <Ionicons name="chevron-forward" size={20} color={subTextColor} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <MorphTransition style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, bgStyle]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEnabled={isAuthenticated}
      >
      {/* 1. Header Profile Section */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={isDark ? ['#1a1a2e', '#0f0f1e'] : ['#4A90E2', '#357ABD']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
            <View style={styles.headerContent}>
                <View style={styles.avatarWrapper}>
                    <Image 
                        source={{ uri: 'https://i.pravatar.cc/300' }} 
                        style={styles.avatarImage} 
                    />
                    <TouchableOpacity style={styles.editBadge}>
                        <Ionicons name="camera" size={14} color="#FFF" />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.userInfo}>
                    <View style={styles.nameRow}>
                        <ThemedText style={styles.userName}>Alex Morgan</ThemedText>
                        <View style={styles.proBadge}>
                            <ThemedText style={styles.proText}>PRO</ThemedText>
                        </View>
                    </View>
                    <ThemedText style={styles.userEmail}>alex.morgan@example.com</ThemedText>
                </View>
            </View>
        </LinearGradient>

        {/* 2. Floating Stats Dashboard */}
        <FadeInView delay={100}>
            <View style={[styles.statsCard, { backgroundColor: cardBg }]}>
                <View style={styles.statItem}>
                    <ThemedText style={[styles.statNumber, { color: textColor }]}>12</ThemedText>
                    <ThemedText style={styles.statLabel}>Total Scans</ThemedText>
                </View>
                <View style={[styles.verticalDivider, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />
                <View style={styles.statItem}>
                    <ThemedText style={[styles.statNumber, { color: textColor }]}>3</ThemedText>
                    <ThemedText style={styles.statLabel}>Consults</ThemedText>
                </View>
                <View style={[styles.verticalDivider, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />
                <View style={styles.statItem}>
                    <ThemedText style={[styles.statNumber, { color: textColor }]}>98%</ThemedText>
                    <ThemedText style={styles.statLabel}>Health Score</ThemedText>
                </View>
            </View>
        </FadeInView>
      </View>

      {/* 3. Settings Menu */}
      <View style={styles.contentContainer}>
        <FadeInView delay={200}>
            <MenuSection
            title="Account"
            items={[
                { icon: 'person-outline', title: 'Personal Information', subtitle: 'Profile, Weight, Height', color: '#4A90E2' },
                { icon: 'document-text-outline', title: 'Medical Records', color: '#9B59B6' },
            ]}
            />
        </FadeInView>

        <FadeInView delay={300}>
            <MenuSection
            title="Preferences"
            items={[
                { icon: 'notifications-outline', title: 'Push Notifications', color: '#F39C12', hasSwitch: true },
                { icon: 'shield-checkmark-outline', title: 'Privacy & Security', color: '#27AE60' },
                { icon: 'moon-outline', title: 'Appearance', subtitle: 'Dark Mode, Text Size', color: '#34495E' },
            ]}
            />
        </FadeInView>

        <FadeInView delay={400}>
            <MenuSection
            title="Support"
            items={[
                { icon: 'help-circle-outline', title: 'Help & Support', color: '#E67E22' },
                { icon: 'information-circle-outline', title: 'About SmartScan+', color: '#16A085' },
                { icon: 'log-out-outline', title: 'Log Out', color: '#FF3B30', isDestructive: true },
            ]}
            />
        </FadeInView>

        <View style={styles.footer}>
            <ThemedText style={styles.versionText}>Version 2.4.0 (Build 202)</ThemedText>
        </View>
      </View>

      </ScrollView>
      {/* Authentication Overlay */}
      {!isAuthenticated && (
        <AuthOverlay onGoogleLogin={signInWithGoogle} onProfessionalRegister={registerAsProfessional} />
      )}
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
    paddingTop: 60,
    paddingBottom: 50, // Extra space for floating card
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 20,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A90E2',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  proBadge: {
    backgroundColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.5)',
  },
  proText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '800',
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  // --- Floating Stats ---
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: -30, // Negative margin to overlap
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: '60%',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  // --- Content ---
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 4,
    opacity: 0.5,
    textTransform: 'uppercase',
  },
  sectionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuSubtitle: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    fontSize: 12,
    opacity: 0.3,
  },
});