import React, { useCallback, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { SimId, encodeRNToWeb, decodeWebToRN } from '../../sim/simProtocol';
import { HEX_DATA } from '../../../assets/sim/hexData';
import { SIMULATOR_HTML } from '../../../assets/sim/simHtml';

export interface SimulatorViewProps {
  simId?: SimId | string;
  running?: boolean;
  height?: number;
  showCodeButton?: boolean;
  onLedState?: (pin: number, on: boolean) => void;
  onError?: (message: string) => void;
}

const HEX_ASSETS: Partial<Record<string, string>> = HEX_DATA;

const SIM_NAMES: Record<string, string> = {
  sim1_led_blink: 'LED Blink (Pin 7)',
  sim2_alternate_blink: 'Alternate Dual-LED (D7 & D8)',
  sim3_binary_count: '2-Bit Binary Counter',
  sim4_morse: 'SOS Morse Beacon Signal',
};

const ARDUINO_SKETCHES: Record<string, string> = {
  sim1_led_blink: `// SkillForge: Sim 1 — LED Blink on Pin 7
const int LED_PIN = 7;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}`,
  sim2_alternate_blink: `// SkillForge: Sim 2 — Alternate Blink (2 LEDs)
const int LED1_PIN = 7;
const int LED2_PIN = 8;

void setup() {
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED1_PIN, HIGH);
  digitalWrite(LED2_PIN, LOW);
  delay(1000);

  digitalWrite(LED1_PIN, LOW);
  digitalWrite(LED2_PIN, HIGH);
  delay(1000);
}`,
  sim3_binary_count: `// SkillForge: Sim 3 — 2-Bit Binary Counter
const int LED1 = 7;
const int LED2 = 8;

void setup() {
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
}

void loop() {
  for (int count = 0; count < 4; count++) {
    digitalWrite(LED1, count & 1);
    digitalWrite(LED2, (count >> 1) & 1);
    delay(1000);
  }
}`,
  sim4_morse: `// SkillForge: Sim 4 — SOS Morse Code
const int LED_PIN = 7;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void dot() {
  digitalWrite(LED_PIN, HIGH); delay(200);
  digitalWrite(LED_PIN, LOW); delay(200);
}

void dash() {
  digitalWrite(LED_PIN, HIGH); delay(600);
  digitalWrite(LED_PIN, LOW); delay(200);
}

void loop() {
  // S = ...
  dot(); dot(); dot(); delay(400);
  // O = ---
  dash(); dash(); dash(); delay(400);
  // S = ...
  dot(); dot(); dot(); delay(2000);
}`,
};

export function SimulatorView({
  simId = 'sim1_led_blink',
  running,
  height = 240,
  showCodeButton = true,
  onLedState,
  onError,
}: SimulatorViewProps) {
  const webviewRef = useRef<any>(null);
  const WebRenderer: any = WebView;
  const [ready, setReady] = useState(false);
  const [internalRunning, setInternalRunning] = useState(true);
  const [codeModalVisible, setCodeModalVisible] = useState(false);

  // If `running` prop is explicitly provided, respect it; otherwise use internal toggle state
  const isSimRunning = running !== undefined ? running : internalRunning;

  const currentSimId = simId as SimId;
  const currentTitle = SIM_NAMES[simId] || simId.replace(/_/g, ' ').toUpperCase();
  const currentCode = ARDUINO_SKETCHES[simId] || ARDUINO_SKETCHES.sim1_led_blink;

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const msg = decodeWebToRN(event.nativeEvent.data);
        if (msg.type === 'READY') {
          setReady(true);
          const hexBase64 = HEX_ASSETS[currentSimId];
          if (hexBase64) {
            webviewRef.current?.postMessage(
              encodeRNToWeb({ type: 'LOAD_HEX', simId: currentSimId, hexBase64 })
            );
            if (isSimRunning) {
              webviewRef.current?.postMessage(encodeRNToWeb({ type: 'RUN' }));
            }
          } else {
            onError?.(`No compiled hex bundled for ${simId}.`);
          }
        } else if (msg.type === 'LED_STATE') {
          onLedState?.(msg.pin, msg.on);
        } else if (msg.type === 'ERROR') {
          onError?.(msg.message);
        }
      } catch (err) {
        onError?.(err instanceof Error ? err.message : 'SimulatorView: failed to parse WebView message');
      }
    },
    [currentSimId, isSimRunning, onLedState, onError, simId]
  );

  useEffect(() => {
    if (!ready) return;
    webviewRef.current?.postMessage(encodeRNToWeb({ type: isSimRunning ? 'RUN' : 'STOP' }));
  }, [isSimRunning, ready]);

  // Handle dynamic simId changes
  useEffect(() => {
    if (!ready) return;
    const hexBase64 = HEX_ASSETS[currentSimId];
    if (hexBase64) {
      webviewRef.current?.postMessage(
        encodeRNToWeb({ type: 'LOAD_HEX', simId: currentSimId, hexBase64 })
      );
      if (isSimRunning) {
        webviewRef.current?.postMessage(encodeRNToWeb({ type: 'RUN' }));
      }
    }
  }, [currentSimId, ready, isSimRunning]);

  return (
    <View style={[styles.container, { height }]}>
      {/* Top Header Strip */}
      <View style={styles.headerStrip}>
        <View style={styles.titleGroup}>
          <Text style={styles.circuitLabel}>SIMULATOR</Text>
          <Text style={styles.circuitTitle}>{currentTitle}</Text>
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
            onPress={() => setInternalRunning(!isSimRunning)}
            accessibilityRole="button"
            accessibilityLabel={isSimRunning ? 'Pause Simulation' : 'Resume Simulation'}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isSimRunning ? theme.color.pass : '#64748B' },
              ]}
            />
            <Ionicons
              name={isSimRunning ? 'pause' : 'play'}
              size={12}
              color={theme.color.text}
            />
          </Pressable>
        </View>
      </View>

      {/* Simulator Circuit avr8js WebView Container */}
      <View style={styles.graphicContainer}>
        <WebRenderer
          ref={webviewRef}
          source={{ html: SIMULATOR_HTML }}
          onMessage={handleMessage}
          onError={(syntheticEvent: any) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('Simulator WebView load error:', nativeEvent);
            onError?.(nativeEvent.description || 'WebView load error');
          }}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          allowFileAccess
          allowFileAccessFromFileURLs
          allowUniversalAccessFromFileURLs
          mixedContentMode="always"
          scalesPageToFit={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          style={styles.webview}
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
              Target: Arduino Uno · Circuit: {currentTitle}
            </Text>

            <ScrollView style={styles.codeScrollView}>
              <Text style={styles.codeText}>{currentCode}</Text>
            </ScrollView>

            <View style={styles.modalActionRow}>
              <Pressable
                style={styles.runSimBtn}
                onPress={() => {
                  setInternalRunning(true);
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
    backgroundColor: '#0E1116',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
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
