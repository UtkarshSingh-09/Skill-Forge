import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface SimulatorViewProps {
  simId?: string;
  height?: number;
  showCodeButton?: boolean;
}

const DEFAULT_ARDUINO_CODE = `// SkillForge: Sim 1 — LED Blink on Pin 13
// Target: Arduino Uno R3 + Breadboard Rig

const int LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("SkillForge Circuit Initialized: Ready");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);   // Turn LED ON (5V)
  delay(500);                    // Wait 500ms
  digitalWrite(LED_PIN, LOW);    // Turn LED OFF (GND)
  delay(500);                    // Wait 500ms
}
`;

export function SimulatorView({
  simId = 'sim1_led_blink',
  height = 240,
  showCodeButton = true,
}: SimulatorViewProps) {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [codeModalVisible, setCodeModalVisible] = useState<boolean>(false);

  return (
    <View style={[styles.container, { height }]}>
      {/* Top Header Strip */}
      <View style={styles.headerStrip}>
        <View style={styles.titleGroup}>
          <Text style={styles.circuitLabel}>BLUEPRINT</Text>
          <Text style={styles.circuitTitle}>LED Blink (Pin 13)</Text>
        </View>

        <View style={styles.controlsGroup}>
          {showCodeButton && (
            <Pressable
              style={styles.codeButton}
              onPress={() => setCodeModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="View Arduino Code"
            >
              <Ionicons name="code-slash" size={13} color={theme.color.textDim} />
              <Text style={styles.codeButtonText}>Code</Text>
            </Pressable>
          )}

          <Pressable
            style={styles.controlIconBtn}
            onPress={() => setIsRunning(!isRunning)}
            accessibilityRole="button"
            accessibilityLabel={isRunning ? "Pause Simulation" : "Resume Simulation"}
          >
            <View style={[styles.statusDot, { backgroundColor: isRunning ? theme.color.pass : '#64748B' }]} />
            <Ionicons
              name={isRunning ? "pause" : "play"}
              size={12}
              color={theme.color.text}
            />
          </Pressable>
        </View>
      </View>

      {/* Simulator Circuit Schematic Graphic Area */}
      <View style={styles.graphicContainer}>
        <Image
          source={require('../../../assets/sim_arduino_led.png')}
          style={styles.simImage}
          resizeMode="contain"
        />
      </View>

      {/* Arduino Code & Run Modal */}
      <Modal
        visible={codeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCodeModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Ionicons name="hardware-chip-outline" size={18} color={theme.color.accent} />
                <Text style={styles.modalTitle}>Arduino Firmware Source</Text>
              </View>
              <Pressable
                style={styles.closeBtn}
                onPress={() => setCodeModalVisible(false)}
              >
                <Ionicons name="close" size={20} color={theme.color.textDim} />
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              Target: Arduino Uno · Circuit: {simId.replace(/_/g, ' ').toUpperCase()}
            </Text>

            <ScrollView style={styles.codeScrollView}>
              <Text style={styles.codeText}>{DEFAULT_ARDUINO_CODE}</Text>
            </ScrollView>

            <View style={styles.modalActionRow}>
              <Pressable
                style={styles.runSimBtn}
                onPress={() => {
                  setIsRunning(true);
                  setCodeModalVisible(false);
                }}
              >
                <Ionicons name="play" size={14} color="#FFFFFF" />
                <Text style={styles.runSimBtnText}>Run in Simulator</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
    overflow: 'hidden',
  },
  headerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#0D1017',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  circuitLabel: {
    color: theme.color.accent,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  circuitTitle: {
    color: theme.color.text,
    fontSize: 12,
    fontWeight: '600',
  },
  controlsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
    gap: 4,
  },
  codeButtonText: {
    color: theme.color.textDim,
    fontSize: 11,
    fontWeight: '600',
  },
  controlIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  graphicContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D0F14',
    padding: 6,
  },
  simImage: {
    width: '100%',
    height: '100%',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.color.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    padding: 20,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    color: theme.color.text,
    fontSize: 15,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  modalSubtitle: {
    color: theme.color.textDim,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  codeScrollView: {
    backgroundColor: '#090B0E',
    borderRadius: theme.radius.sm,
    padding: 12,
    maxHeight: 280,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  codeText: {
    color: '#93C5FD',
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  modalActionRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  runSimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.color.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
  },
  runSimBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
