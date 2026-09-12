import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { speak } from '../speech/tts';

interface HintSheetProps {
  visible: boolean;
  template: string;
  llmText?: string;
  onClose: () => void;
}

export function HintSheet({
  visible,
  template,
  llmText,
  onClose,
}: HintSheetProps) {
  const [expanded, setExpanded] = useState(false);

  // Pan responder to handle swipe-down to dismiss
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 40) {
        onClose();
      }
    },
  });

  if (!visible) return null;

  const displayText = llmText || template;
  const isLlm = Boolean(llmText);

  // Extract first sentence for concise default view
  const firstSentenceMatch = displayText.match(/^.*?[.!?](\s|$)/);
  const firstSentence = firstSentenceMatch ? firstSentenceMatch[0].trim() : displayText;
  const hasMore = displayText.length > firstSentence.length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheetContainer} {...panResponder.panHandlers}>
          <Pressable style={styles.sheetBody} onPress={(e) => e.stopPropagation()}>
            {/* Drag Handle Bar */}
            <View style={styles.handleContainer}>
              <View style={styles.handleBar} />
            </View>

            {/* Header Row: Title, Tag, Speaker, Close */}
            <View style={styles.headerRow}>
              <View style={styles.titleWithBadge}>
                <Ionicons name="bulb-outline" size={20} color={theme.color.accent} />
                <Text style={styles.title}>Step Hint</Text>
                {isLlm && (
                  <View style={styles.llmBadge}>
                    <Text style={styles.llmBadgeText}>AI CO-PILOT</Text>
                  </View>
                )}
              </View>

              <View style={styles.headerActions}>
                <Pressable
                  style={styles.iconBtn}
                  onPress={() => speak(displayText)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Speak hint"
                >
                  <Ionicons name="volume-high-outline" size={18} color={theme.color.textDim} />
                </Pressable>

                <Pressable
                  style={styles.iconBtn}
                  onPress={onClose}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Close hint"
                >
                  <Ionicons name="close-outline" size={20} color={theme.color.textDim} />
                </Pressable>
              </View>
            </View>

            {/* Hint Content (max ~40% total screen height) */}
            <ScrollView
              style={styles.scrollArea}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.contentContainer}
            >
              <Text style={styles.hintText}>
                {expanded ? displayText : firstSentence}
              </Text>

              {hasMore && (
                <Pressable
                  style={styles.moreToggle}
                  onPress={() => setExpanded(!expanded)}
                >
                  <Text style={styles.moreText}>
                    {expanded ? 'Show less' : 'Read more details'}
                  </Text>
                  <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={14}
                    color={theme.color.accent}
                  />
                </Pressable>
              )}
            </ScrollView>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
    maxHeight: '40%', // strictly capped at 40% so camera is never covered
  },
  sheetBody: {
    backgroundColor: theme.color.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    borderTopWidth: 1,
    borderColor: '#2D3748',
    paddingHorizontal: theme.space.lg,
    paddingBottom: theme.space.xl,
    paddingTop: theme.space.xs,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: theme.space.xs,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4B5563',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: theme.space.xs,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    color: theme.color.text,
    fontSize: theme.font.body,
    fontWeight: '700',
  },
  llmBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: theme.color.accent,
  },
  llmBadgeText: {
    color: theme.color.accent,
    fontSize: 9,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 4,
  },
  scrollArea: {
    marginTop: theme.space.xs,
    maxHeight: 180,
  },
  contentContainer: {
    paddingBottom: theme.space.sm,
  },
  hintText: {
    color: theme.color.text,
    fontSize: 14,
    lineHeight: 20,
  },
  moreToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: theme.space.xs,
  },
  moreText: {
    color: theme.color.accent,
    fontSize: 12,
    fontWeight: '600',
  },
});
