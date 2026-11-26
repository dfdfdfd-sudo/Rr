import { router } from 'expo-router';

import { Ekran } from '@/components/Ekran';
import { Kart } from '@/components/Kart';
import { renk } from '@/theme';

function gunEtiketi() {
  return new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
}

// Şimdilik iskelet: modüller tek tek eklendikçe bu kartlar gerçek nesnelere dönüşecek.
export default function Bugun() {
  return (
    <Ekran ust={gunEtiketi()} baslik="Bugün">
      <Kart baslik="Su" alt="Şişe yakında burada dolacak" vurgu={renk.su} onPress={() => router.push('/modul/su')} />
      <Kart baslik="Uyku" alt="Sıradaki modül" vurgu={renk.uyku} />
      <Kart baslik="Meditasyon" alt="Sıradaki modül" vurgu={renk.tamam} />
      <Kart baslik="Ruh hali" alt="Sıradaki modül" vurgu={renk.ruh} />
    </Ekran>
  );
}
