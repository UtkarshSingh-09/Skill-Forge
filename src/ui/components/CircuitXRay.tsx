import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Procedure, EvaluationResult } from '../../contract/types';

interface CircuitXRayProps {
  visible: boolean;
  onClose: () => void;
  procedure: Procedure | null;
  stepIndex: number;
  lastResult: EvaluationResult | null;
}

export function CircuitXRay({
  visible,
  onClose,
  procedure,
  stepIndex,
  lastResult,
}: CircuitXRayProps) {
  if (!procedure) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="scan-outline" size={22} color={theme.color.accent} />
              <Text style={styles.title}>Circuit X-Ray</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={theme.color.textDim} />
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            Expected Schematic · Per-Connection Verified State
          </Text>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Visual Schematic Chain */}
            <View style={styles.schematicChain}>
              <Text style={styles.chainTitle}>TOPOLOGY NETLIST</Text>
              <View style={styles.chainFlow}>
                {procedure.steps.map((step, idx) => {
                  const isVerified =
                    idx < stepIndex || (idx === stepIndex && lastResult?.result === 'PASS');
                  const isCurrent = idx === stepIndex && lastResult?.result !== 'PASS';
                  const isFail = isCurrent && lastResult?.result === 'FAIL';

                  const badgeColor = isVerified
                    ? theme.color.pass
                    : isFail
                    ? theme.color.fail
                    : isCurrent
                    ? theme.color.accent
                    : '#374151';

                  return (
                    <View key={step.id} style={styles.chainNodeWrapper}>
                      <View style={[styles.chainNode, { borderColor: badgeColor }]}>
                        <Text style={styles.chainNodeType}>
                          {step.expect.type.toUpperCase()}
                        </Text>
                        <Text style={styles.chainNodeCells}>
                          {(step.expect.cells || []).join(' ➔ ')}
                        </Text>
                      </View>
                      {idx < procedure.steps.length - 1 && (
                        <Text style={[styles.chainArrow, { color: isVerified ? theme.color.pass : theme.color.textDim }]}>
                          ↓
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Detailed Connection List */}
            <View style={styles.stepsList}>
              <Text style={styles.listHeader}>SCHEMATIC ELEMENTS</Text>
              {procedure.steps.map((step, idx) => {
                const isVerified =
                  idx < stepIndex || (idx === stepIndex && lastResult?.result === 'PASS');
                const isCurrent = idx === stepIndex && lastResult?.result !== 'PASS';
                const isFail = isCurrent && lastResult?.result === 'FAIL';

                let statusLabel = 'PENDING';
                let statusColor: string = theme.color.textDim;
                let statusIcon: keyof typeof Ionicons.glyphMap = 'ellipse-outline';

                if (isVerified) {
                  statusLabel = 'VERIFIED ✓';
                  statusColor = theme.color.pass;
                  statusIcon = 'checkmark-circle';
                } else if (isFail) {
                  statusLabel = 'MISMATCH ✕';
                  statusColor = theme.color.fail;
                  statusIcon = 'close-circle';
                } else if (isCurrent) {
                  statusLabel = 'TARGET ➔';
                  statusColor = theme.color.accent;
                  statusIcon = 'radio-button-on';
                }

                return (
                  <View
                    key={step.id}
                    style={[
                      styles.stepCard,
                      isCurrent && styles.stepCardCurrent,
                      isVerified && styles.stepCardVerified,
                    ]}
                  >
                    <View style={styles.stepCardTop}>
                      <View style={styles.stepTitleCol}>
                        <Text style={styles.stepNum}>Step {step.id}: {step.expect.type.toUpperCase()}</Text>
                        <Text style={styles.stepHoles}>Holes: {(step.expect.cells || []).join(', ')}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: `${statusColor}22` }]}>
                        <Ionicons name={statusIcon} size={14} color={statusColor} />
                        <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
                      </View>
                    </View>
                    <Text style={styles.stepInstruction}>{step.instruction}</Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: theme.color.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    maxHeight: '75%',
    padding: theme.space.md,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: theme.color.text,
    fontSize: theme.font.h2,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
  },
  subtitle: {
    color: theme.color.textDim,
    fontSize: 12,
    marginBottom: theme.space.md,
  },
  content: {
    maxHeight: 450,
  },
  schematicChain: {
    backgroundColor: '#12161D',
    padding: theme.space.sm,
    borderRadius: theme.radius.sm,
    marginBottom: theme.space.md,
    borderWidth: 1,
    borderColor: '#252C37',
  },
  chainTitle: {
    color: theme.color.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  chainFlow: {
    alignItems: 'center',
  },
  chainNodeWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  chainNode: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#1A202C',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
  },
  chainNodeType: {
    color: theme.color.text,
    fontSize: 12,
    fontWeight: '700',
  },
  chainNodeCells: {
    color: theme.color.textDim,
    fontSize: 11,
    fontFamily: 'monospace',
  },
  chainArrow: {
    fontSize: 14,
    fontWeight: '700',
    marginVertical: 2,
  },
  stepsList: {
    gap: theme.space.sm,
    marginBottom: theme.space.xl,
  },
  listHeader: {
    color: theme.color.textDim,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  stepCard: {
    backgroundColor: '#161B22',
    padding: theme.space.sm,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: '#2D3748',
    gap: 4,
  },
  stepCardCurrent: {
    borderColor: theme.color.accent,
    backgroundColor: '#182332',
  },
  stepCardVerified: {
    borderColor: '#1E3A2F',
    backgroundColor: '#101B17',
  },
  stepCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitleCol: {
    flex: 1,
  },
  stepNum: {
    color: theme.color.text,
    fontSize: 13,
    fontWeight: '700',
  },
  stepHoles: {
    color: theme.color.textDim,
    fontSize: 11,
    fontFamily: 'monospace',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stepInstruction: {
    color: theme.color.textDim,
    fontSize: 12,
    lineHeight: 16,
  },
});
