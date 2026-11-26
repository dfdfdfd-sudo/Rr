import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { GunlukSaglayici } from '@/store/gunluk';
import { renk } from '@/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = { anchor: '(tabs)' };

SplashScreen.preventAutoHideAsync().catch(() => {});

const tema = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: renk.zemin, card: renk.kart, border: renk.cizgi, text: renk.yazi },
};

export default function RootLayout() {
  const [yuklendi, hata] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (yuklendi || hata) SplashScreen.hideAsync().catch(() => {});
  }, [yuklendi, hata]);

  // Yazı tipi yüklenemezse sistem yazısıyla devam et (uygulama kilitlenmesin).
  if (!yuklendi && !hata) return null;

  return (
    <GunlukSaglayici>
      <ThemeProvider value={tema}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: renk.zemin } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="hizli"
            options={{ presentation: 'formSheet', sheetAllowedDetents: [0.5], sheetGrabberVisible: true, contentStyle: { backgroundColor: renk.kart } }}
          />
        </Stack>
      </ThemeProvider>
    </GunlukSaglayici>
  );
}
