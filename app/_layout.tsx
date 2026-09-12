import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="summary" options={{ presentation: 'modal', title: 'Summary' }} />
      <Stack.Screen name="settings" options={{ presentation: 'modal', title: 'Settings' }} />
    </Stack>
  );
}
