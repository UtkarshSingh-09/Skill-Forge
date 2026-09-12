import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useStore } from '../../session/store';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

interface SimChatbotProps {
  simId?: string;
}

const INITIAL_MESSAGES: Record<string, Message[]> = {
  sim1_led_blink: [
    {
      id: 'm1',
      sender: 'bot',
      text: 'Hello! I am your SkillForge Circuit Tutor for the LED Blink experiment. Ask me anything about breadboard rows, current limiting resistors, or Arduino pin 13.',
    },
  ],
};

const SUGGESTIONS = [
  'Why do we need a 1kΩ resistor?',
  'Which leg of the LED is the anode?',
  'Why does pin 13 toggle every 500ms?',
];

export function SimChatbot({ simId = 'sim1_led_blink' }: SimChatbotProps) {
  const [messages, setMessages] = useState<Message[]>(
    INITIAL_MESSAGES[simId] || INITIAL_MESSAGES.sim1_led_blink
  );
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const setSensor = useStore((s) => s.actions.setSensor);

  const sendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Contextual responses for the circuit tutor
    setTimeout(() => {
      let reply = 'Remember: Pin 13 outputs 5V. Ensure your LED anode points towards the signal pin and the resistor connects to GND.';
      const lower = textToSend.toLowerCase();
      if (lower.includes('resistor')) {
        reply = 'The 1kΩ resistor limits the current flowing through the LED to around 15–20mA. Without it, the LED will burn out immediately due to excessive current!';
      } else if (lower.includes('anode') || lower.includes('leg') || lower.includes('polarity')) {
        reply = 'The longer leg is the Anode (+) and must connect towards Pin 13 / positive voltage. The shorter leg with the flat edge on the plastic body is the Cathode (-) and goes to GND.';
      } else if (lower.includes('pin 13') || lower.includes('500ms') || lower.includes('blink')) {
        reply = 'The Arduino loop function writes HIGH for 500ms, then LOW for 500ms. This creates a 1 Hz oscillation (one blink cycle per second).';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `b_${Date.now()}`,
          sender: 'bot',
          text: reply,
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleMic = () => {
    setSensor('mic', true);
    setTimeout(() => {
      setSensor('mic', false);
      sendMessage('Why do we need a 1kΩ resistor?');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.botTitleRow}>
          <View style={styles.avatar}>
            <Ionicons name="sparkles" size={14} color="#0E1116" />
          </View>
          <View>
            <Text style={styles.title}>AI Circuit Tutor</Text>
            <Text style={styles.subtitle}>On-Device Socratic Guide</Text>
          </View>
        </View>
        <View style={styles.activePill}>
          <View style={styles.dot} />
          <Text style={styles.activeText}>Ready</Text>
        </View>
      </View>

      {/* Suggestion Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.suggestionScroll}
        contentContainerStyle={styles.suggestionContent}
      >
        {SUGGESTIONS.map((s, idx) => (
          <Pressable
            key={idx}
            style={styles.chip}
            onPress={() => sendMessage(s)}
          >
            <Text style={styles.chipText}>{s}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Messages List */}
      <ScrollView
        style={styles.messagesScroll}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.messageBubble,
              m.sender === 'user' ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                m.sender === 'user' ? styles.userText : styles.botText,
              ]}
            >
              {m.text}
            </Text>
          </View>
        ))}
        {isTyping && (
          <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
            <Text style={styles.typingText}>Tutor is reasoning...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Row */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask tutor about this circuit..."
          placeholderTextColor={theme.color.textDim}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => sendMessage(inputText)}
        />

        <Pressable
          style={styles.micBtn}
          onPress={handleMic}
          accessibilityRole="button"
          accessibilityLabel="Speak Question"
        >
          <Ionicons name="mic-outline" size={18} color={theme.color.accent} />
        </Pressable>

        <Pressable
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim()}
          accessibilityRole="button"
          accessibilityLabel="Send Question"
        >
          <Ionicons name="arrow-up" size={16} color={inputText.trim() ? '#0E1116' : theme.color.textDim} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(14, 17, 22, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  botTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.color.text,
    fontSize: 13,
    fontWeight: '700',
  },
  subtitle: {
    color: theme.color.textDim,
    fontSize: 10,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.color.pass,
  },
  activeText: {
    color: theme.color.pass,
    fontSize: 10,
    fontWeight: '700',
  },
  suggestionScroll: {
    maxHeight: 38,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  suggestionContent: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  chipText: {
    color: theme.color.accent,
    fontSize: 11,
    fontWeight: '600',
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: 12,
    gap: 8,
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    borderBottomRightRadius: 2,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  userText: {
    color: theme.color.text,
  },
  botText: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 18,
  },
  typingBubble: {
    opacity: 0.6,
  },
  typingText: {
    color: theme.color.textDim,
    fontSize: 11,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(14, 17, 22, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    gap: 6,
  },
  input: {
    flex: 1,
    backgroundColor: '#13171F',
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: theme.color.text,
    fontSize: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  micBtn: {
    padding: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  sendBtn: {
    padding: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.color.accent,
  },
  sendBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
});
