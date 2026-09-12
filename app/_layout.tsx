import { Stack } from 'expo-router';
import { theme } from '../src/ui/theme';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: theme.color.surface },
        headerTintColor: theme.color.text,
        contentStyle: { backgroundColor: theme.color.bg },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="analyse" options={{ headerShown: false }} />
      <Stack.Screen name="learn" options={{ headerShown: false }} />
      <Stack.Screen name="workbench" options={{ headerShown: false }} />
      <Stack.Screen
        name="summary"
        options={{
          headerShown: true,
          presentation: 'modal',
          title: 'Session Summary',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          presentation: 'modal',
          title: 'Settings',
        }}
      />
    </Stack>
  );
}
