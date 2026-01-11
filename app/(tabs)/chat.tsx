import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import MorphTransition from '@/components/morph-transition';

const { width } = Dimensions.get('window');

// --- Animations ---
const FadeInItem = ({ index, children }: { index: number; children: React.ReactNode }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }],
      }}
    >
      {children}
    </Animated.View>
  );
};

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced Mock Data
  const mockChats = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Dermatologist',
      lastMessage: 'The redness should fade in 2 days. Keep applying the cream.',
      time: '10:30 AM',
      unread: 2,
      online: true,
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'General Practitioner',
      lastMessage: 'Please bring your blood test results to the next appointment.',
      time: 'Yesterday',
      unread: 0,
      online: false,
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
    {
      id: 3,
      name: 'Nurse Emily',
      specialty: 'Triage Support',
      lastMessage: 'Your appointment for next Tuesday is confirmed.',
      time: 'Tue',
      unread: 1,
      online: true,
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Cardiologist',
      lastMessage: 'Results look normal. No need to worry.',
      time: 'Mon',
      unread: 0,
      online: false,
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    },
  ];

  // Colors
  const bgStyle = { backgroundColor: isDark ? '#0F0F13' : '#F2F6F9' };
  const cardBg = isDark ? '#1E1E2E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const subTextColor = isDark ? '#A1A1AA' : '#64748B';

  return (
    <MorphTransition style={{ flex: 1 }}>
      <View style={[styles.container, bgStyle]}>
      {/* 1. Header with Gradient Background & Search */}
      <LinearGradient
        colors={isDark ? ['#1a1a2e', '#0f0f1e'] : ['#4A90E2', '#357ABD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <ThemedText style={styles.headerTitle}>Messages</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              {mockChats.filter(c => c.unread > 0).length} Unread Conversations
            </ThemedText>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Integrated Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)' }]}>
            <Ionicons name="search" size={20} color="#FFF" style={{ opacity: 0.8 }} />
            <TextInput
              placeholder="Search doctors or messages..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              selectionColor="#FFF"
            />
          </View>
        </View>
      </LinearGradient>

      {/* 2. Chat List */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listHeader}>
          <ThemedText style={styles.sectionTitle}>Recent</ThemedText>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={16} color={isDark ? '#4A90E2' : '#357ABD'} />
            <ThemedText style={[styles.filterText, { color: isDark ? '#4A90E2' : '#357ABD' }]}>Filter</ThemedText>
          </TouchableOpacity>
        </View>

        {mockChats.map((chat, index) => (
          <FadeInItem key={chat.id} index={index}>
            <TouchableOpacity
              style={[styles.chatCard, { backgroundColor: cardBg }]}
              activeOpacity={0.7}
            >
              <View style={styles.avatarContainer}>
                <Image source={{ uri: chat.avatar }} style={styles.avatarImage} />
                {chat.online && <View style={[styles.onlineBadge, { borderColor: cardBg }]} />}
              </View>

              <View style={styles.chatDetails}>
                <View style={styles.chatHeaderRow}>
                  <ThemedText style={[styles.doctorName, { color: textColor }]}>
                    {chat.name}
                  </ThemedText>
                  <ThemedText style={styles.timeText}>{chat.time}</ThemedText>
                </View>

                <ThemedText style={styles.specialtyText}>{chat.specialty}</ThemedText>

                <View style={styles.messageRow}>
                  <ThemedText
                    style={[
                      styles.lastMessage,
                      {
                        color: chat.unread > 0 ? (isDark ? '#E0E0E0' : '#2C3E50') : subTextColor,
                        fontWeight: chat.unread > 0 ? '600' : '400',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {chat.lastMessage}
                  </ThemedText>
                  
                  {chat.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <ThemedText style={styles.unreadText}>{chat.unread}</ThemedText>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </FadeInItem>
        ))}

        {/* Bottom padding for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 3. Floating Action Button (FAB) */}
      <TouchableOpacity
        style={[
            styles.fab, 
            { 
                shadowColor: isDark ? '#000' : '#4A90E2',
                backgroundColor: isDark ? '#1a1a1a' : '#fff' // Fallback bg
            }
        ]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#4A90E2', '#357ABD']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="create-outline" size={28} color="#FFF" />
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
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  // --- Search ---
  searchContainer: {
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 15,
    height: '100%',
  },
  // --- Content ---
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // --- Chat Cards ---
  chatCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E1E1E1',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
  },
  chatDetails: {
    flex: 1,
  },
  chatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 12,
    opacity: 0.5,
  },
  specialtyText: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '500',
    marginBottom: 4,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: '#FF5252',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  // --- FAB ---
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    borderRadius: 28,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});