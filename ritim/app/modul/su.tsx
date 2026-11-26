import { Ekran } from '@/components/Ekran';
import { Yakinda } from '@/components/Yakinda';

// Su modülü docs/plan-su.md'deki adımlarla burada kurulacak.
export default function Su() {
  return (
    <Ekran baslik="Su" geri>
      <Yakinda ikon="su" metin="Dolan şişe, içecekler, hatırlatıcı ve şişe çevirme oyunu planlandı (docs/plan-su.md). İlk adımı bekliyor." />
    </Ekran>
  );
}
