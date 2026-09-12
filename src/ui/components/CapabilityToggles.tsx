import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { theme } from '../theme';
import { caps } from '../../capabilities';

interface CapabilityTogglesProps {
  currentCaps: typeof caps;
  onToggle: (key: keyof typeof caps, value: boolean) => void;
}

export function CapabilityToggles({ currentCaps, onToggle }: CapabilityTogglesProps) {
  const items: Array<{
    key: keyof typeof caps;
    label: string;
    description: string;
    locked?: boolean;
  }> = [
    {
      key: 'tts',
      label: 'Voice Guidance (TTS)',
      description: 'Speaks instructions and correction hints aloud',
    },
    {
      key: 'overlay',
      label: 'AR Breadboard Overlay',
      description: 'Draws live highlight boxes over breadboard holes',
    },
    {
      key: 'llm',
      label: 'Local LLM Explanations',
      description: 'Pedagogical feedback via on-device Llama-3.2 (optional)',
    },
    {
      key: 'arduino',
      label: 'Arduino Ground Truth',
      description: 'Hardware continuity and truth table verification (optional)',
    },
    {
      key: 'stt',
      label: 'Voice Trigger (STT)',
      description: 'Allows hands-free voice command to trigger TEST (optional)',
    },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.key} style={styles.toggleRow}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          <Switch
            value={currentCaps[item.key]}
            onValueChange={(val) => onToggle(item.key, val)}
            trackColor={{ false: '#374151', true: theme.color.accent }}
            thumbColor={currentCaps[item.key] ? '#FFFFFF' : '#9CA3AF'}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: theme.space.md,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.color.surface,
    padding: theme.space.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  textContainer: {
    flex: 1,
    paddingRight: theme.space.md,
  },
  label: {
    color: theme.color.text,
    fontSize: theme.font.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    color: theme.color.textDim,
    fontSize: 12,
    lineHeight: 16,
  },
});
