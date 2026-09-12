import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export function CoachScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coach</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.color.bg, justifyContent: 'center', alignItems: 'center' },
  title: { color: theme.color.text, fontSize: theme.font.h1 },
});
