import { useLocalSearchParams } from 'expo-router';

import { Ekran } from '@/components/Ekran';
import { Yakinda } from '@/components/Yakinda';
import { ARACLAR } from '@/data/varsayilan';

export default function Modul() {
  const { ad } = useLocalSearchParams<{ ad: string }>();
  const a = ARACLAR.find((x) => x.id === ad) ?? { ad: ad === 'ruh' ? 'Ruh hali' : 'Modül', ikon: 'simsek' };
  return (
    <Ekran baslik={a.ad} geri>
      <Yakinda ikon={a.ikon} metin={`${a.ad} modülü prototipten sırayla taşınacak. Şu an Su modülü hazırlanıyor.`} />
    </Ekran>
  );
}
