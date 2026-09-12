import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { SkillBars } from '../components/SkillBars';
import { LearningGraph } from '../components/LearningGraph';
import { initialSkillProfile } from '../../session/skillProfile';

export function ProfileScreen() {
  const router = useRouter();
  const profile = initialSkillProfile;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color={theme.color.accent} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.name}>{profile.studentName}</Text>
            <Text style={styles.stats}>
              {profile.sessionsCompleted} lab sessions recorded · Offline verified
            </Text>
          </View>
        </View>

        {/* Learning Graph Showcase Component */}
        <LearningGraph />

        {/* Skill Indicators Component */}
        <SkillBars profile={profile} />

        {/* Recent Sessions List */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Lab Sessions</Text>
          <View style={styles.sessionsList}>
            {profile.recentSessions.map((sess) => (
              <View key={sess.id} style={styles.sessionCard}>
                <View style={styles.sessionLeft}>
                  <View style={[styles.statusDot, { backgroundColor: sess.passed ? theme.color.pass : theme.color.fail }]} />
                  <View>
                    <Text style={styles.sessionTitle}>{sess.procedureTitle}</Text>
                    <Text style={styles.sessionMeta}>
                      {Math.round(sess.durationSeconds / 60)}m {sess.durationSeconds % 60}s · {sess.errorsCount} {sess.errorsCount === 1 ? 'correction' : 'corrections'}
                    </Text>
                  </View>
                </View>
                <View style={styles.sessionBadge}>
                  <Text style={[styles.sessionBadgeText, { color: sess.passed ? theme.color.pass : theme.color.fail }]}>
                    {sess.passed ? 'PASSED' : 'INCOMPLETE'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Practice Again CTA */}
        <Pressable
          style={styles.practiceBtn}
          onPress={() => router.push('/')}
        >
          <Ionicons name="play-circle-outline" size={20} color={theme.color.bg} />
          <Text style={styles.practiceBtnText}>Practice Again</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bg,
  },
  scrollContent: {
    padding: theme.space.lg,
    gap: theme.space.lg,
    paddingBottom: theme.space.xl * 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
    backgroundColor: theme.color.surface,
    padding: theme.space.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.color.accent,
  },
  headerText: {
    flex: 1,
  },
  name: {
    color: theme.color.text,
    fontSize: theme.font.h2,
    fontWeight: '700',
  },
  stats: {
    color: theme.color.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  recentSection: {
    gap: theme.space.sm,
  },
  sectionTitle: {
    color: theme.color.text,
    fontSize: theme.font.body,
    fontWeight: '700',
  },
  sessionsList: {
    gap: theme.space.xs,
  },
  sessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.color.surface,
    padding: theme.space.md,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: '#252C37',
  },
  sessionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sessionTitle: {
    color: theme.color.text,
    fontSize: 14,
    fontWeight: '600',
  },
  sessionMeta: {
    color: theme.color.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  sessionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#0F172A',
    borderRadius: 4,
  },
  sessionBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  practiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.color.accent,
    paddingVertical: theme.space.md,
    borderRadius: theme.radius.md,
    marginTop: theme.space.xs,
  },
  practiceBtnText: {
    color: theme.color.bg,
    fontSize: theme.font.body,
    fontWeight: '700',
  },
});
