import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { ColorValue } from 'react-native';

import { renk } from '@/theme';

type Ikon = SymbolViewProps['name'];

const ikon = (name: Ikon) =>
  function TabIkon({ color }: { color: ColorValue }) {
    return <SymbolView name={name} tintColor={color} size={24} />;
  };

export default function SekmeDuzeni() {
  return (
    <Tabs
      screenListeners={{ tabPress: () => Haptics.selectionAsync() }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: renk.yazi,
        tabBarInactiveTintColor: renk.soluk,
        tabBarStyle: { backgroundColor: renk.kart, borderTopColor: renk.cizgi },
        tabBarLabelStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Bugün', tabBarIcon: ikon({ ios: 'sun.max.fill', android: 'wb_sunny', web: 'wb_sunny' }) }}
      />
      <Tabs.Screen
        name="antrenman"
        options={{
          title: 'Antrenman',
          tabBarIcon: ikon({ ios: 'figure.strengthtraining.traditional', android: 'fitness_center', web: 'fitness_center' }),
        }}
      />
      <Tabs.Screen
        name="odam"
        options={{ title: 'Odam', tabBarIcon: ikon({ ios: 'house.fill', android: 'home', web: 'home' }) }}
      />
      <Tabs.Screen
        name="profil"
        options={{ title: 'Profil', tabBarIcon: ikon({ ios: 'person.crop.circle', android: 'person', web: 'person' }) }}
      />
    </Tabs>
  );
}
