import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Conditionally import liquid-glass only on iOS to avoid Android build issues
let LiquidGlassView: any = null;
let isLiquidGlassSupported = false;
if (Platform.OS === 'ios') {
  try {
    const liquidGlass = require('@callstack/liquid-glass');
    LiquidGlassView = liquidGlass.LiquidGlassView;
    isLiquidGlassSupported = liquidGlass.isLiquidGlassSupported;
  } catch (e) {
    // Fallback if module not available
    console.log('Liquid Glass not available');
  }
}

interface AuthOverlayProps {
  onGoogleLogin: () => void;
  onProfessionalRegister: () => void;
}

export default function AuthOverlay({ onGoogleLogin, onProfessionalRegister }: AuthOverlayProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.overlay}>
      {isLiquidGlassSupported ? (
        <LiquidGlassView style={styles.fullGlass} effect="regular" interactive={false} />
      ) : (
        <BlurView intensity={100} tint="default" style={styles.fullGlass} />
      )}

      <View style={styles.container}>
        <View style={[styles.card, { backgroundColor: isDark ? '#1E1E2E' : '#FFFFFF' }]}>
          <Ionicons name="lock-closed" size={64} color="#4A90E2" style={{ marginBottom: 20 }} />
          <ThemedText style={styles.title}>Login to continue</ThemedText>
          <ThemedText style={styles.subtitle}>
            Sign in to access your messages and profile features
          </ThemedText>

          <TouchableOpacity style={styles.googleButton} onPress={onGoogleLogin} activeOpacity={0.85}>
            <Ionicons name="logo-google" size={20} color="#FFFFFF" />
            <ThemedText style={styles.googleButtonText}>Continue with Google</ThemedText>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />
            <ThemedText style={styles.dividerText}>or</ThemedText>
            <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />
          </View>

          <TouchableOpacity
            style={[styles.professionalButton, { backgroundColor: isDark ? '#2A2A3E' : '#F5F5F5' }]}
            onPress={onProfessionalRegister}
            activeOpacity={0.85}
          >
            <Ionicons name="medical" size={22} color="#4A90E2" />
            <View style={styles.proTextBox}>
              <ThemedText style={styles.proTitle}>Are you a Doctor?</ThemedText>
              <ThemedText style={styles.proSubtitle}>Register as a Professional</ThemedText>
            </View>
            <Ionicons name="arrow-forward" size={18} color="#4A90E2" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  fullGlass: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    width: '90%',
    maxWidth: 420,
  },
  card: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  googleButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 22,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    opacity: 0.5,
  },
  professionalButton: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  proTextBox: {
    flex: 1,
    marginLeft: 12,
  },
  proTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  proSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
});
