import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import DoctorRegistrationModal from './doctor-registration-modal';

const { width } = Dimensions.get('window');

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = "990437588250-vgut9dep710gpm19ms08k609aji4m4mj.apps.googleusercontent.com";

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

// Google Logo Component (Official Multi-color G)
const GoogleLogo = () => (
  <Svg width={20} height={20} viewBox="0 0 48 48">
    <Path fill="#FBBC04" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
    <Path fill="#EA4335" d="M6.3 14.7l6.6 4.8C14.2 15.1 18.7 12 24 12c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.7 2 10.3 6.1 6.3 14.7z"/>
    <Path fill="#34A853" d="M24 46c5.6 0 10.6-2 14.4-5.4l-6.7-5.5C29.5 36.9 26.9 38 24 38c-6.1 0-11.3-3.9-13.2-9.3l-6.6 5.1C8.3 41.9 15.6 46 24 46z"/>
    <Path fill="#4285F4" d="M46 24c0-1.4-.1-2.8-.4-4H24v8h12.7c-.6 2.9-2.2 5.4-4.7 7l6.7 5.5C42.2 36.8 46 31 46 24z"/>
  </Svg>
);

interface AuthOverlayProps {
  onProfessionalRegister: () => void;
}

export default function AuthOverlay({ onProfessionalRegister }: AuthOverlayProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  
  // State to track if the user wants 'register' or 'login'
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');

  // --- Google OAuth Setup ---
  const redirectUri = 'http://localhost:8081/redirect';

  console.log('Redirect URI:', redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
    },
    discovery
  );

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

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Google Sign-In successful:', authentication);
      fetchGoogleUserInfo(authentication?.accessToken);
    }
  }, [response]);

  const fetchGoogleUserInfo = async (token: string | undefined) => {
    if (!token) return;
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await response.json();
      console.log('Patient Google User Info:', user);
      alert(`Welcome, ${user.name}!\nEmail: ${user.email}\n\nPatient account created successfully.`);
      // TODO: Save patient user data and navigate to home screen
    } catch (error) {
      console.error('Error fetching Google user info:', error);
    }
  };

  const handleDoctorAction = (mode: 'register' | 'login') => {
    setAuthMode(mode);
    setShowDoctorModal(true);
  };

  // --- Theme Colors ---
  const cardBg = isDark ? '#1A1A24' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#111827';
  const subTextColor = isDark ? '#9CA3AF' : '#6B7280';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
  const linkColor = '#3B82F6'; // Blue for links
  
  // Pro Card Colors
  const proCardBg = isDark ? '#232333' : '#F8FAFC';

  return (
    <View style={styles.overlay}>
      {/* 1. High Intensity Backdrop Blur */}
      <BlurView 
        intensity={Platform.OS === 'ios' ? 60 : 100} 
        tint={isDark ? 'dark' : 'light'} 
        style={StyleSheet.absoluteFill} 
      />

      {/* 2. Content Container */}
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
              colors={['#3B82F6', '#2563EB']}
              style={styles.iconGradient}
            >
              <Ionicons name="lock-closed" size={28} color="white" />
            </LinearGradient>
          </View>

          <ThemedText style={[styles.title, { color: textColor }]}>
            Welcome to SmartScan +
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: subTextColor }]}>
            Sign in to access your secure medical records and AI screenings.
          </ThemedText>

          {/* Primary Login: Google */}
          <TouchableOpacity 
            style={styles.googleButton} 
            onPress={() => promptAsync()}
            disabled={!request}
            activeOpacity={0.8}
          >
            <View style={styles.googleIconBg}>
              <GoogleLogo />
            </View>
            <ThemedText style={styles.googleButtonText}>Continue with Google</ThemedText>
            <Ionicons name="arrow-forward" size={20} color="#374151" style={{ opacity: 0.5 }} />
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.line, { backgroundColor: borderColor }]} />
            <ThemedText style={[styles.orText, { color: subTextColor }]}>Medical Staff</ThemedText>
            <View style={[styles.line, { backgroundColor: borderColor }]} />
          </View>

          {/* Secondary: Doctor Registration (Big Button) */}
          <TouchableOpacity
            style={[
              styles.proButton, 
              { backgroundColor: proCardBg, borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : '#E2E8F0' }
            ]}
            onPress={() => handleDoctorAction('register')}
            activeOpacity={0.7}
          >
            <View style={[styles.proIconBox, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF' }]}>
               <Ionicons name="medkit" size={20} color="#3B82F6" />
            </View>
            
            <View style={styles.proContent}>
              <ThemedText style={[styles.proTitle, { color: textColor }]}>
                Join as a Specialist
              </ThemedText>
              <ThemedText style={[styles.proSubtitle, { color: subTextColor }]}>
                Create a professional account
              </ThemedText>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#3B82F6" />
          </TouchableOpacity>

          {/* Tertiary: Doctor Login (Link) */}
          <TouchableOpacity 
            style={styles.loginLinkContainer}
            onPress={() => router.push('/(tabs)/doctor-login')}
            activeOpacity={0.6}
          >
            <ThemedText style={[styles.loginLinkText, { color: subTextColor }]}>
              Already registered as a Doctor? <ThemedText style={{ color: linkColor, fontWeight: '600', fontSize: 13 }}>Log in</ThemedText>
            </ThemedText>
          </TouchableOpacity>

          {/* Footer Terms */}
          <ThemedText style={[styles.footerText, { color: subTextColor }]}>
            By continuing, you agree to our Terms of Service & Privacy Policy.
          </ThemedText>

        </View>
      </Animated.View>

      {/* Doctor Registration Modal */}
      {showDoctorModal && (
        <DoctorRegistrationModal 
          // @ts-ignore - Assuming you will add this prop to your modal component
          initialMode={authMode}
          onClose={() => setShowDoctorModal(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.2)', // Slight dim for better contrast
  },
  container: {
    width: width * 0.88,
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
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  // Google Button
  googleButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 4, 
    paddingRight: 16,
    borderRadius: 16,
    marginBottom: 8,
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 0.5,
    borderColor: '#F3F4F6',
  },
  googleButtonText: {
    flex: 1,
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },
  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Pro Button
  proButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed', 
  },
  proIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  proContent: {
    flex: 1,
  },
  proTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  proSubtitle: {
    fontSize: 12,
  },
  // Login Link Logic
  loginLinkContainer: {
    marginTop: 16,
    paddingVertical: 4,
  },
  loginLinkText: {
    fontSize: 13,
    fontWeight: '500',
  },
  // Footer
  footerText: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 24,
    opacity: 0.6,
    maxWidth: '80%',
  },
});