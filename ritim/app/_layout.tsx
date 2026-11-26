import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { renk } from '@/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = { anchor: '(tabs)' };

const tema = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: renk.zemin, card: renk.kart, border: renk.cizgi, text: renk.yazi },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={tema}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: renk.zemin } }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
