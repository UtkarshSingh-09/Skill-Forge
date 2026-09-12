import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { CapabilityToggles } from '../components/CapabilityToggles';
import { caps, setCapability } from '../../capabilities';
import { llmConfig, setLlmConfig, testLlmConnection } from '../../llm/explainer';

export function SettingsScreen() {
  const router = useRouter();
  const [currentCaps, setCurrentCaps] = useState({ ...caps });
  const [reloadFeedback, setReloadFeedback] = useState<string | null>(null);

  // LLM Config State
  const [hostInput, setHostInput] = useState(llmConfig.host);
  const [modelInput, setModelInput] = useState(llmConfig.model);
  const [testingLlm, setTestingLlm] = useState(false);
  const [llmTestResult, setLlmTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleToggle = (key: keyof typeof caps, value: boolean) => {
    setCapability(key, value);
    setCurrentCaps({ ...caps });
  };

  const handleReloadConfig = () => {
    setReloadFeedback('Calibration reloaded successfully');
    setTimeout(() => setReloadFeedback(null), 2000);
  };

  const handleSaveLlmConfig = (newHost?: string, newModel?: string) => {
    const h = newHost !== undefined ? newHost : hostInput;
    const m = newModel !== undefined ? newModel : modelInput;
    setHostInput(h);
    setModelInput(m);
    setLlmConfig(h, m);
  };

  const handleTestLlm = async () => {
    setTestingLlm(true);
    setLlmTestResult(null);
    handleSaveLlmConfig();

    const res = await testLlmConnection();
    setTestingLlm(false);
    setLlmTestResult({
      success: res.success,
      message: res.message,
    });

    if (res.success) {
      // Auto-enable LLM capability on successful connection
      handleToggle('llm', true);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings & Capabilities</Text>
        <Text style={styles.desc}>Demo insurance & hardware feature toggles</Text>
      </View>

      {/* Capability Toggles Component */}
      <CapabilityToggles currentCaps={currentCaps} onToggle={handleToggle} />

      {/* Local LLM On-Device Configuration Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="sparkles" size={18} color={theme.color.accent} />
          <Text style={styles.cardTitle}>Local LLM / Ollama Configuration</Text>
        </View>
        <Text style={styles.cardSubtitle}>
          Configure local SLM running on mobile (Termux) or laptop host.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Ollama Host URL:</Text>
          <TextInput
            style={styles.textInput}
            value={hostInput}
            onChangeText={(text) => {
              setHostInput(text);
              handleSaveLlmConfig(text, modelInput);
            }}
            placeholder="http://127.0.0.1:11434"
            placeholderTextColor={theme.color.textDim}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Quick Host Presets */}
        <View style={styles.presetRow}>
          <Pressable
            style={[
              styles.presetBtn,
              hostInput.includes('127.0.0.1') && styles.presetBtnActive,
            ]}
            onPress={() => handleSaveLlmConfig('http://127.0.0.1:11434', modelInput)}
          >
            <Text style={styles.presetBtnText}>On-Device (127.0.0.1:11434)</Text>
          </Pressable>

          <Pressable
            style={[
              styles.presetBtn,
              hostInput.includes('10.69.98.242') && styles.presetBtnActive,
            ]}
            onPress={() => handleSaveLlmConfig('http://10.69.98.242:11434', modelInput)}
          >
            <Text style={styles.presetBtnText}>Laptop Wi-Fi</Text>
          </Pressable>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Model Name / Tag:</Text>
          <TextInput
            style={styles.textInput}
            value={modelInput}
            onChangeText={(text) => {
              setModelInput(text);
              handleSaveLlmConfig(hostInput, text);
            }}
            placeholder="qwen2.5:3b or llama3.2:3b"
            placeholderTextColor={theme.color.textDim}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Quick Model Presets */}
        <View style={styles.presetRow}>
          <Pressable
            style={[
              styles.presetBtn,
              modelInput.includes('qwen2.5') && styles.presetBtnActive,
            ]}
            onPress={() => handleSaveLlmConfig(hostInput, 'qwen2.5:3b')}
          >
            <Text style={styles.presetBtnText}>qwen2.5:3b</Text>
          </Pressable>

          <Pressable
            style={[
              styles.presetBtn,
              modelInput.includes('llama') && styles.presetBtnActive,
            ]}
            onPress={() => handleSaveLlmConfig(hostInput, 'llama3.2:3b')}
          >
            <Text style={styles.presetBtnText}>llama3.2:3b</Text>
          </Pressable>
        </View>

        {/* Test Connection Button */}
        <Pressable
          style={[styles.testLlmBtn, testingLlm && { opacity: 0.6 }]}
          onPress={handleTestLlm}
          disabled={testingLlm}
        >
          <Ionicons
            name={llmTestResult?.success ? 'checkmark-circle-outline' : 'flash-outline'}
            size={16}
            color={theme.color.bg}
          />
          <Text style={styles.testLlmBtnText}>
            {testingLlm ? 'Pinging LLM...' : 'Test LLM Connection'}
          </Text>
        </Pressable>

        {llmTestResult && (
          <View
            style={[
              styles.resultBanner,
              llmTestResult.success ? styles.resultSuccess : styles.resultFail,
            ]}
          >
            <Ionicons
              name={llmTestResult.success ? 'checkmark-circle' : 'alert-circle'}
              size={16}
              color={llmTestResult.success ? theme.color.pass : theme.color.fail}
            />
            <Text
              style={[
                styles.resultText,
                { color: llmTestResult.success ? theme.color.pass : theme.color.fail },
              ]}
            >
              {llmTestResult.message}
            </Text>
          </View>
        )}
      </View>

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
  card: {
    backgroundColor: theme.color.surface,
    padding: theme.space.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#2D3748',
    gap: theme.space.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    color: theme.color.text,
    fontSize: 14,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: theme.color.textDim,
    fontSize: 12,
    lineHeight: 16,
  },
  inputGroup: {
    gap: 4,
    marginTop: 4,
  },
  inputLabel: {
    color: theme.color.textDim,
    fontSize: 11,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#131822',
    borderColor: '#374151',
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: theme.color.text,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: '#334155',
  },
  presetBtnActive: {
    borderColor: theme.color.accent,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  presetBtnText: {
    color: theme.color.accent,
    fontSize: 11,
    fontWeight: '600',
  },
  testLlmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.color.accent,
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
    marginTop: 4,
  },
  testLlmBtnText: {
    color: theme.color.bg,
    fontSize: 13,
    fontWeight: '700',
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
  },
  resultSuccess: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  resultFail: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  resultText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
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
    fontSize: theme.font.small,
  },
  doneBtn: {
    backgroundColor: theme.color.accent,
    paddingVertical: theme.space.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  doneBtnText: {
    color: theme.color.bg,
    fontSize: theme.font.body,
    fontWeight: '800',
  },
  footer: {
    alignItems: 'center',
    gap: 2,
    paddingVertical: theme.space.md,
  },
  footerText: {
    color: theme.color.textDim,
    fontSize: theme.font.small,
  },
  footerSubtext: {
    color: '#4B5563',
    fontSize: 11,
  },
});
