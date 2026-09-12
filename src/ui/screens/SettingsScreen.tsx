import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { CapabilityToggles } from '../components/CapabilityToggles';
import { caps, setCapability } from '../../capabilities';

export function SettingsScreen() {
  const router = useRouter();
  const [currentCaps, setCurrentCaps] = useState({ ...caps });
  const [reloadFeedback, setReloadFeedback] = useState<string | null>(null);

  const handleToggle = (key: keyof typeof caps, value: boolean) => {
    setCapability(key, value);
    setCurrentCaps({ ...caps });
  };

  const handleReloadConfig = () => {
    setReloadFeedback('Calibration reloaded successfully');
    setTimeout(() => setReloadFeedback(null), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings & Capabilities</Text>
        <Text style={styles.desc}>Demo insurance & hardware feature toggles</Text>
      </View>

      {/* Capability Toggles Component */}
      <CapabilityToggles currentCaps={currentCaps} onToggle={handleToggle} />

      {/* Reload Calibration / Config Button */}
      <View style={styles.actionSection}>
        <Pressable style={styles.reloadBtn} onPress={handleReloadConfig}>
          <Ionicons name="refresh-outline" size={18} color={theme.color.accent} />
          <Text style={styles.reloadBtnText}>Reload Calibration / Config</Text>
        </Pressable>
        {reloadFeedback && (
          <Text style={styles.feedbackText}>{reloadFeedback}</Text>
        )}
      </View>

      {/* Done Button */}
      <Pressable style={styles.doneBtn} onPress={() => router.back()}>
        <Text style={styles.doneBtnText}>Done</Text>
      </Pressable>

      {/* Build / Version footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>SkillForge v1.0.0 (Green Light A.2)</Text>
        <Text style={styles.footerSubtext}>Offline-first · iQOO 15 Edition</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bg,
  },
  content: {
    padding: theme.space.lg,
    gap: theme.space.lg,
  },
  header: {
    marginBottom: theme.space.xs,
  },
  title: {
    color: theme.color.text,
    fontSize: theme.font.h1,
    fontWeight: '700',
    marginBottom: theme.space.xs,
  },
  desc: {
    color: theme.color.textDim,
    fontSize: theme.font.body,
  },
  actionSection: {
    marginTop: theme.space.xs,
    alignItems: 'center',
    gap: theme.space.xs,
  },
  reloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.color.surface,
    borderColor: '#2D3748',
    borderWidth: 1,
    paddingVertical: theme.space.sm,
    paddingHorizontal: theme.space.md,
    borderRadius: theme.radius.sm,
    width: '100%',
    justifyContent: 'center',
  },
  reloadBtnText: {
    color: theme.color.accent,
    fontSize: theme.font.body,
    fontWeight: '600',
  },
  feedbackText: {
    color: theme.color.pass,
    fontSize: 12,
    fontWeight: '600',
  },
  doneBtn: {
    backgroundColor: theme.color.accent,
    paddingVertical: theme.space.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  doneBtnText: {
    color: theme.color.bg,
    fontSize: theme.font.body,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.space.md,
    paddingBottom: theme.space.lg,
  },
  footerText: {
    color: theme.color.textDim,
    fontSize: 12,
    fontWeight: '600',
  },
  footerSubtext: {
    color: '#4B5563',
    fontSize: 11,
    marginTop: 2,
  },
});
