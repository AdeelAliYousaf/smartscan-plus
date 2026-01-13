import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DoctorLoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const bgColor = isDark ? '#0F0F13' : '#F2F6F9';
  const cardBg = isDark ? '#1A1A24' : '#FFFFFF';
  const inputBg = isDark ? '#2D2D3F' : '#F3F4F6';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB';
  const textColor = isDark ? '#FFFFFF' : '#111827';
  const subTextColor = isDark ? '#9CA3AF' : '#6B7280';

  const handleLogin = () => {
    // TODO: Implement doctor login logic
    console.log('Doctor login:', { email, password });
    alert('Doctor login functionality coming soon!');
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password flow
    console.log('Forgot password');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Icon */}
          <View style={styles.iconCircle}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.iconGradient}
            >
              <Ionicons name="medical" size={32} color="white" />
            </LinearGradient>
          </View>

          {/* Title */}
          <ThemedText style={[styles.title, { color: textColor }]}>
            Doctor Login
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: subTextColor }]}>
            Access your professional account
          </ThemedText>

          {/* Login Form Card */}
          <View style={[styles.formCard, { backgroundColor: cardBg, borderColor }]}>
            {/* Email Input */}
            <View style={styles.formGroup}>
              <ThemedText style={[styles.label, { color: textColor }]}>Email Address</ThemedText>
              <View style={[styles.inputContainer, { backgroundColor: inputBg, borderColor }]}>
                <Ionicons name="mail-outline" size={20} color={subTextColor} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="doctor@example.com"
                  placeholderTextColor={subTextColor}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.formGroup}>
              <ThemedText style={[styles.label, { color: textColor }]}>Password</ThemedText>
              <View style={[styles.inputContainer, { backgroundColor: inputBg, borderColor }]}>
                <Ionicons name="lock-closed-outline" size={20} color={subTextColor} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Enter your password"
                  placeholderTextColor={subTextColor}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons 
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
                    size={20} 
                    color={subTextColor} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
              <ThemedText style={[styles.forgotPasswordText, { color: '#3B82F6' }]}>
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.loginButtonGradient}
              >
                <ThemedText style={styles.loginButtonText}>Sign In</ThemedText>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View style={[styles.infoBox, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)', borderColor: '#3B82F6' }]}>
            <Ionicons name="information-circle" size={20} color="#3B82F6" />
            <ThemedText style={[styles.infoText, { color: subTextColor }]}>
              Only approved medical professionals can access this portal.
            </ThemedText>
          </View>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <ThemedText style={[styles.registerText, { color: subTextColor }]}>
              Don't have an account?{' '}
            </ThemedText>
            <TouchableOpacity onPress={() => router.push('/(tabs)/doctor-register')}>
              <ThemedText style={[styles.registerLink, { color: '#3B82F6' }]}>
                Register Now
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  iconCircle: {
    marginBottom: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
  },
  formCard: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  loginButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 24,
    width: '100%',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});

// Hide tab bar when this screen is active
DoctorLoginScreen.options = {
  tabBarStyle: { display: 'none' },
};
