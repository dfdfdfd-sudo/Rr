import { Tabs } from 'expo-router';

import { AltMenu } from '@/components/AltMenu';
import { renk } from '@/theme';

export default function SekmeDuzeni() {
  return (
    <Tabs
      tabBar={(p) => <AltMenu {...p} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: renk.zemin } }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="antrenman" />
      <Tabs.Screen name="odam" />
      <Tabs.Screen name="profil" />
    </Tabs>
  );
}
