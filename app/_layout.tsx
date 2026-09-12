import { Stack } from 'expo-router';
import { theme } from '../src/ui/theme';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.color.surface },
        headerTintColor: theme.color.text,
        contentStyle: { backgroundColor: theme.color.bg },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="summary"
        options={{
          presentation: 'modal',
          title: 'Session Summary',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          presentation: 'modal',
          title: 'Settings',
        }}
      />
    </Stack>
  );
}
