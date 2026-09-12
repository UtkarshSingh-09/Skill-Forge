import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useStore } from '../../session/store';

interface InteractiveQACardProps {
  onConfirm?: (answer: boolean) => void;
  onVoiceInput?: () => void;
}

export function InteractiveQACard({ onConfirm, onVoiceInput }: InteractiveQACardProps) {
  const interaction = useStore((s) => s.interaction);
  const setInteraction = useStore((s) => s.actions.setInteraction);
  const setSensor = useStore((s) => s.actions.setSensor);

  const [answered, setAnswered] = useState<string | null>(null);

  if (!interaction || !interaction.active) {
    return null;
  }

  const handleAnswer = (isRight: boolean) => {
    setAnswered(isRight ? 'Confirmed' : 'Adjusting');
    if (onConfirm) onConfirm(isRight);
    setTimeout(() => {
      setInteraction(null);
      setAnswered(null);
    }, 1200);
  };

  const handleMicToggle = () => {
    setSensor('mic', true);
    if (onVoiceInput) onVoiceInput();
    setTimeout(() => setSensor('mic', false), 3000);
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Ionicons name="help-circle-outline" size={14} color={theme.color.accent} />
          <Text style={styles.badgeText}>Circuit Verification Query</Text>
        </View>
        <Pressable
          style={styles.closeBtn}
          onPress={() => setInteraction(null)}
          accessibilityRole="button"
          accessibilityLabel="Dismiss query"
        >
          <Ionicons name="close" size={16} color={theme.color.textDim} />
        </Pressable>
      </View>

      <Text style={styles.questionText}>{interaction.question}</Text>

      {answered ? (
        <View style={styles.responseNotification}>
          <Ionicons
            name={answered === 'Confirmed' ? 'checkmark-circle' : 'refresh-circle'}
            size={16}
            color={answered === 'Confirmed' ? theme.color.pass : theme.color.uncertain}
          />
          <Text style={styles.responseText}>{answered}</Text>
        </View>
      ) : (
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.btn, styles.confirmBtn]}
            onPress={() => handleAnswer(true)}
            accessibilityRole="button"
            accessibilityLabel="Right"
          >
            <Ionicons name="checkmark" size={14} color="#0E1116" />
            <Text style={styles.confirmBtnText}>Right</Text>
          </Pressable>

          <Pressable
            style={[styles.btn, styles.denyBtn]}
            onPress={() => handleAnswer(false)}
            accessibilityRole="button"
            accessibilityLabel="Wrong"
          >
            <Ionicons name="close" size={14} color={theme.color.fail} />
            <Text style={styles.denyBtnText}>Wrong</Text>
          </Pressable>

          <Pressable
            style={styles.micBtn}
            onPress={handleMicToggle}
            accessibilityRole="button"
            accessibilityLabel="Speak answer"
          >
            <Ionicons name="mic" size={16} color={theme.color.accent} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#12151C',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    color: theme.color.textDim,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  closeBtn: {
    padding: 2,
  },
  questionText: {
    color: theme.color.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: theme.radius.sm,
    gap: 4,
  },
  confirmBtn: {
    backgroundColor: theme.color.pass,
  },
  confirmBtnText: {
    color: '#0A0C10',
    fontWeight: '700',
    fontSize: 12,
  },
  denyBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  denyBtnText: {
    color: theme.color.textDim,
    fontWeight: '600',
    fontSize: 12,
  },
  micBtn: {
    padding: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  responseNotification: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  responseText: {
    color: theme.color.textDim,
    fontSize: 12,
    fontWeight: '600',
  },
});
