import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import {
  BackHandler,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FormData {
  fullName: string;
  licenseNumber: string;
  specialization: string;
  hospital: string;
  yearsExperience: string;
  email: string;
  phone: string;
  licenseImage: string | null;
  idImage: string | null;
  certificateImage: string | null;
}

export default function DoctorRegistrationScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    licenseNumber: '',
    specialization: '',
    hospital: '',
    yearsExperience: '',
    email: '',
    phone: '',
    licenseImage: null,
    idImage: null,
    certificateImage: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const totalSteps = 3;

  const bgColor = isDark ? '#0F0F13' : '#F2F6F9';
  const cardBg = isDark ? '#1A1A24' : '#FFFFFF';
  const inputBg = isDark ? '#232333' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB';
  const textColor = isDark ? '#FFFFFF' : '#111827';
  const subTextColor = isDark ? '#9CA3AF' : '#6B7280';

  // Handle hardware back button on Android
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (showSuccessModal) {
          // If success modal is showing, back button should finish the flow
          handleSuccessDismiss();
          return true;
        }
        if (currentStep > 1) {
          setCurrentStep(currentStep - 1);
          return true;
        } else {
          setShowConfirmCancel(true);
          return true;
        }
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => backHandler.remove();
    }, [currentStep, showSuccessModal])
  );

  const handleConfirmCancel = () => {
    setShowConfirmCancel(false);
    router.back();
  };

  const handleSuccessDismiss = () => {
    setShowSuccessModal(false);
    router.back();
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddImage = (field: 'licenseImage' | 'idImage' | 'certificateImage') => {
    // Placeholder for image picker logic
    // In a real app, you would open ImagePicker here
    setFormData(prev => ({ ...prev, [field]: 'selected' }));
  };

  const handleContinue = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleGoBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setShowConfirmCancel(true);
    }
  };

  const handleSubmit = () => {
    // TODO: Submit form data to backend
    console.log('Form submitted:', formData);
    // Show success modal instead of immediate back navigation
    setShowSuccessModal(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity 
          onPress={handleGoBack} 
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
            <ThemedText style={styles.headerTitle}>Doctor Registration</ThemedText>
        </View>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${(currentStep / totalSteps) * 100}%`,
                backgroundColor: '#10B981'
              }
            ]} 
          />
        </View>
        <ThemedText style={[styles.progressText, { color: subTextColor }]}>
          Step {currentStep} of {totalSteps}
        </ThemedText>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <View>
              <ThemedText style={[styles.stepTitle, { color: textColor }]}>
                Personal Information
              </ThemedText>
              <ThemedText style={[styles.stepSubtitle, { color: subTextColor }]}>
                Enter your professional details
              </ThemedText>

              <View style={styles.formGroup}>
                <ThemedText style={[styles.label, { color: textColor }]}>Full Name *</ThemedText>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
                  placeholder="Dr. John Doe"
                  placeholderTextColor={subTextColor}
                  value={formData.fullName}
                  onChangeText={(value) => handleInputChange('fullName', value)}
                />
              </View>

              <View style={styles.formGroup}>
                <ThemedText style={[styles.label, { color: textColor }]}>License Number *</ThemedText>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
                  placeholder="e.g., MC123456"
                  placeholderTextColor={subTextColor}
                  value={formData.licenseNumber}
                  onChangeText={(value) => handleInputChange('licenseNumber', value)}
                />
              </View>

              <View style={styles.formGroup}>
                <ThemedText style={[styles.label, { color: textColor }]}>Specialization *</ThemedText>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
                  placeholder="e.g., Dermatology, Internal Medicine"
                  placeholderTextColor={subTextColor}
                  value={formData.specialization}
                  onChangeText={(value) => handleInputChange('specialization', value)}
                />
              </View>

              <View style={styles.formGroup}>
                <ThemedText style={[styles.label, { color: textColor }]}>Hospital/Clinic Name *</ThemedText>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
                  placeholder="Your affiliated hospital"
                  placeholderTextColor={subTextColor}
                  value={formData.hospital}
                  onChangeText={(value) => handleInputChange('hospital', value)}
                />
              </View>

              <View style={styles.formGroup}>
                <ThemedText style={[styles.label, { color: textColor }]}>Years of Experience *</ThemedText>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
                  placeholder="e.g., 5"
                  placeholderTextColor={subTextColor}
                  keyboardType="number-pad"
                  value={formData.yearsExperience}
                  onChangeText={(value) => handleInputChange('yearsExperience', value)}
                />
              </View>
            </View>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <View>
              <ThemedText style={[styles.stepTitle, { color: textColor }]}>
                Contact Information
              </ThemedText>
              <ThemedText style={[styles.stepSubtitle, { color: subTextColor }]}>
                How can we reach you?
              </ThemedText>

              <View style={styles.formGroup}>
                <ThemedText style={[styles.label, { color: textColor }]}>Email Address *</ThemedText>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
                  placeholder="doctor@email.com"
                  placeholderTextColor={subTextColor}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                />
              </View>

              <View style={styles.formGroup}>
                <ThemedText style={[styles.label, { color: textColor }]}>Phone Number *</ThemedText>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
                  placeholder="+1 (555) 000-0000"
                  placeholderTextColor={subTextColor}
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                />
              </View>

              <View style={[styles.infoBox, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF', borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE' }]}>
                <Ionicons name="information-circle" size={20} color="#3B82F6" />
                <ThemedText style={[styles.infoText, { color: subTextColor }]}>
                  We'll use these details to contact you about your registration status.
                </ThemedText>
              </View>
            </View>
          )}

          {/* Step 3: Document Upload */}
          {currentStep === 3 && (
            <View>
              <ThemedText style={[styles.stepTitle, { color: textColor }]}>
                Upload Documents
              </ThemedText>
              <ThemedText style={[styles.stepSubtitle, { color: subTextColor }]}>
                Provide clear, legible copies of your credentials
              </ThemedText>

              {/* Medical License */}
              <View style={styles.documentSection}>
                <ThemedText style={[styles.documentTitle, { color: textColor }]}>
                  Medical License *
                </ThemedText>
                <TouchableOpacity
                  style={[
                    styles.uploadButton, 
                    { 
                        borderColor: formData.licenseImage ? '#10B981' : (isDark ? 'rgba(255,255,255,0.2)' : '#E5E7EB'), 
                        backgroundColor: formData.licenseImage ? (isDark ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5') : inputBg,
                        borderStyle: formData.licenseImage ? 'solid' : 'dashed'
                    }
                  ]}
                  onPress={() => handleAddImage('licenseImage')}
                >
                  <Ionicons 
                    name={formData.licenseImage ? 'checkmark-circle' : 'cloud-upload-outline'} 
                    size={32} 
                    color={formData.licenseImage ? '#10B981' : subTextColor} 
                  />
                  <ThemedText style={[styles.uploadText, { color: formData.licenseImage ? '#10B981' : subTextColor }]}>
                    {formData.licenseImage ? 'License Uploaded' : 'Tap to Upload License'}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* Government ID */}
              <View style={styles.documentSection}>
                <ThemedText style={[styles.documentTitle, { color: textColor }]}>
                  Government ID *
                </ThemedText>
                <TouchableOpacity
                  style={[
                    styles.uploadButton, 
                    { 
                        borderColor: formData.idImage ? '#10B981' : (isDark ? 'rgba(255,255,255,0.2)' : '#E5E7EB'), 
                        backgroundColor: formData.idImage ? (isDark ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5') : inputBg,
                        borderStyle: formData.idImage ? 'solid' : 'dashed'
                    }
                  ]}
                  onPress={() => handleAddImage('idImage')}
                >
                  <Ionicons 
                    name={formData.idImage ? 'checkmark-circle' : 'card-outline'} 
                    size={32} 
                    color={formData.idImage ? '#10B981' : subTextColor} 
                  />
                  <ThemedText style={[styles.uploadText, { color: formData.idImage ? '#10B981' : subTextColor }]}>
                    {formData.idImage ? 'ID Uploaded' : 'Tap to Upload ID'}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* Certificates */}
              <View style={styles.documentSection}>
                <ThemedText style={[styles.documentTitle, { color: textColor }]}>
                  Certifications *
                </ThemedText>
                <TouchableOpacity
                  style={[
                    styles.uploadButton, 
                    { 
                        borderColor: formData.certificateImage ? '#10B981' : (isDark ? 'rgba(255,255,255,0.2)' : '#E5E7EB'), 
                        backgroundColor: formData.certificateImage ? (isDark ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5') : inputBg,
                        borderStyle: formData.certificateImage ? 'solid' : 'dashed'
                    }
                  ]}
                  onPress={() => handleAddImage('certificateImage')}
                >
                  <Ionicons 
                    name={formData.certificateImage ? 'checkmark-circle' : 'school-outline'} 
                    size={32} 
                    color={formData.certificateImage ? '#10B981' : subTextColor} 
                  />
                  <ThemedText style={[styles.uploadText, { color: formData.certificateImage ? '#10B981' : subTextColor }]}>
                    {formData.certificateImage ? 'Certificates Uploaded' : 'Tap to Upload Certificates'}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <View style={[styles.infoBox, { backgroundColor: isDark ? 'rgba(220, 38, 38, 0.1)' : '#FEF2F2', borderColor: isDark ? 'rgba(220, 38, 38, 0.3)' : '#FCA5A5' }]}>
                <Ionicons name="warning-outline" size={20} color="#DC2626" />
                <ThemedText style={[styles.infoText, { color: '#B91C1C' }]}>
                  Ensure all documents are clear, valid, and readable to avoid rejection.
                </ThemedText>
              </View>
            </View>
          )}
          
          <View style={{height: 20}} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Action Buttons */}
      <View style={[styles.footer, { backgroundColor: bgColor, borderTopColor: borderColor }]}>
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton, { borderColor }]}
          onPress={handleGoBack}
        >
          <ThemedText style={[styles.buttonText, { color: textColor }]}>
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]}
          onPress={currentStep === totalSteps ? handleSubmit : handleContinue}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.buttonGradient}
          >
            <ThemedText style={styles.primaryButtonText}>
              {currentStep === totalSteps ? 'Submit Application' : 'Continue'}
            </ThemedText>
            <Ionicons name={currentStep === totalSteps ? 'checkmark-circle' : 'arrow-forward'} size={18} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal (Cancel) */}
      <Modal
        visible={showConfirmCancel}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmCancel(false)}
      >
        <View style={styles.confirmOverlay}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]} />
          )}
          
          <View style={[styles.confirmCard, { backgroundColor: cardBg }]}>
            <View style={styles.confirmIconCircle}>
              <LinearGradient
                colors={['#EF4444', '#DC2626']}
                style={styles.confirmIconGradient}
              >
                <Ionicons name="alert" size={32} color="white" />
              </LinearGradient>
            </View>

            <ThemedText style={[styles.confirmTitle, { color: textColor }]}>
              Cancel Registration?
            </ThemedText>
            <ThemedText style={[styles.confirmMessage, { color: subTextColor }]}>
              You have unsaved progress. Are you sure you want to discard this application?
            </ThemedText>

            <View style={styles.confirmButtonsContainer}>
              <TouchableOpacity
                style={[styles.confirmButton, { borderColor }]}
                onPress={() => setShowConfirmCancel(false)}
              >
                <ThemedText style={[styles.confirmButtonText, { color: textColor }]}>
                  Continue Registering
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButtonDanger}
                onPress={handleConfirmCancel}
              >
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  style={styles.confirmButtonGradient}
                >
                  <ThemedText style={styles.confirmButtonDangerText}>
                    Yes, Discard
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal (Submit) */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessDismiss}
      >
        <View style={styles.confirmOverlay}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]} />
          )}

          <View style={[styles.confirmCard, { backgroundColor: cardBg }]}>
            <View style={styles.confirmIconCircle}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.confirmIconGradient}
              >
                <Ionicons name="checkmark-done" size={32} color="white" />
              </LinearGradient>
            </View>

            <ThemedText style={[styles.confirmTitle, { color: textColor }]}>
              Application Received
            </ThemedText>
            
            <ThemedText style={[styles.confirmMessage, { color: subTextColor, marginBottom: 8 }]}>
              Your form has been successfully registered in our records. Our team will verify your details and may contact you for further verification.
            </ThemedText>

             <ThemedText style={[styles.confirmMessage, { color: subTextColor, marginBottom: 20 }]}>
              Once verified, you will be able to log in.
            </ThemedText>

             <View style={[styles.infoBox, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2', borderColor: isDark ? 'rgba(220, 38, 38, 0.3)' : '#FCA5A5', marginTop: 0, marginBottom: 24, paddingVertical: 12 }]}>
                <Ionicons name="alert-circle" size={20} color="#DC2626" />
                <ThemedText style={[styles.infoText, { color: '#B91C1C', fontSize: 12 }]}>
                  Remember: This is a medical app. Wrong or false information can cause account suspension anytime and legal actions.
                </ThemedText>
              </View>

            <View style={styles.confirmButtonsContainer}>
              <TouchableOpacity
                style={styles.confirmButtonDanger}
                onPress={handleSuccessDismiss}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.confirmButtonGradient}
                >
                  <ThemedText style={styles.confirmButtonDangerText}>
                    Got it, Return Home
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    marginBottom: 32,
    opacity: 0.8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  infoBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 1,
  },
  documentSection: {
    marginBottom: 24,
  },
  documentTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  uploadButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
  },
  secondaryButton: {
    borderWidth: 1,
    flex: 0.6,
  },
  primaryButton: {
    flex: 1.4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // Confirmation Modal Styles
  confirmOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confirmCard: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  confirmIconCircle: {
    marginBottom: 20,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  confirmIconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  confirmMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 8,
    opacity: 0.8,
  },
  confirmButtonsContainer: {
    width: '100%',
    gap: 12,
  },
  confirmButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  confirmButtonDanger: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDangerText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});