import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface DoctorRegistrationModalProps {
  onClose: () => void;
}

export default function DoctorRegistrationModal({ onClose }: DoctorRegistrationModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // --- Animations ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // --- Theme Colors ---
  const cardBg = isDark ? '#1A1A24' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#111827';
  const subTextColor = isDark ? '#9CA3AF' : '#4B5563';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

  const handleContinue = () => {
    onClose();
    router.push('/(tabs)/doctor-register');
  };

  return (
    <View style={styles.overlay}>
      <BlurView 
        intensity={Platform.OS === 'ios' ? 60 : 100} 
        tint={isDark ? 'dark' : 'light'} 
        style={StyleSheet.absoluteFill} 
      />

      <Animated.View 
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          
          {/* Header Icon */}
          <View style={styles.iconCircle}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.iconGradient}
            >
              <Ionicons name="shield-checkmark" size={32} color="white" />
            </LinearGradient>
          </View>

          <ThemedText style={[styles.title, { color: textColor }]}>
            Doctor Registration
          </ThemedText>

          {/* Main Warning Message */}
          <View style={styles.messageBox}>
            <ThemedText style={[styles.messageTitle, { color: '#DC2626' }]}>
              Professional Verification Required
            </ThemedText>
            <ThemedText style={[styles.messageText, { color: subTextColor }]}>
              To register as a healthcare professional, you'll need to provide:
            </ThemedText>

            {/* Bullet Points */}
            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <View style={styles.bulletIcon}>
                    <Ionicons name="document-text" size={16} color="#3B82F6" />
                </View>
                <ThemedText style={[styles.bulletText, { color: subTextColor }]}>
                  Professional credentials and licenses
                </ThemedText>
              </View>

              <View style={styles.bulletItem}>
                <View style={styles.bulletIcon}>
                    <Ionicons name="id-card" size={16} color="#3B82F6" />
                </View>
                <ThemedText style={[styles.bulletText, { color: subTextColor }]}>
                  Government-issued identification
                </ThemedText>
              </View>

              <View style={styles.bulletItem}>
                <View style={styles.bulletIcon}>
                    <Ionicons name="school" size={16} color="#3B82F6" />
                </View>
                <ThemedText style={[styles.bulletText, { color: subTextColor }]}>
                  Educational qualifications and certifications
                </ThemedText>
              </View>
            </View>

            {/* Warning Section */}
            <View style={[styles.warningBox, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2', borderColor: '#FCA5A5' }]}>
              <Ionicons name="warning" size={20} color="#DC2626" style={{marginTop: 1}} />
              <ThemedText style={[styles.warningText, { color: '#B91C1C' }]}>
                Submitting false documents or information may result in account suspension and legal action.
              </ThemedText>
            </View>

            {/* Privacy Section */}
            <View style={[styles.privacyBox, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF', borderColor: '#BFDBFE' }]}>
              <Ionicons name="lock-closed" size={18} color="#2563EB" style={{marginTop: 1}} />
              <ThemedText style={[styles.privacyText, { color: subTextColor }]}>
                Your documents are securely stored and reviewed only by our verification team.
              </ThemedText>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.secondaryBtn, { borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#E5E7EB' }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <ThemedText style={[styles.secondaryBtnText, { color: subTextColor }]}>
                Cancel
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.primaryBtn}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.primaryBtnGradient}
              >
                <ThemedText style={styles.primaryBtnText}>Continue</ThemedText>
                <Ionicons name="arrow-forward" size={18} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer Agreement */}
            

        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    width: width * 0.9,
    maxWidth: 400,
  },
  card: {
    borderRadius: 28,
    padding: 24,
    paddingTop: 32,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
    alignItems: 'center',
  },
  // Header
  iconCircle: {
    marginBottom: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  iconGradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  // Message Box
  messageBox: {
    width: '100%',
    marginBottom: 20,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  // Bullet List
  bulletList: {
    marginBottom: 20,
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: 16,
    borderRadius: 16,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bulletIcon: {
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 14, // Increased from 13
    lineHeight: 20,
    fontWeight: '500',
  },
  // Warning Box
  warningBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  // Privacy Box
  privacyBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'flex-start',
    gap: 12,
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  // Buttons
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryBtn: {
    flex: 1.5, // Slightly larger continue button
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // Footer
  footerText: {
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 16,
    paddingHorizontal: 12,
  },
});