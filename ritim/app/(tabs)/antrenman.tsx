import { Ekran } from '@/components/Ekran';
import { Kart } from '@/components/Kart';
import { renk } from '@/theme';

export default function Antrenman() {
  return (
    <Ekran ust="Kas haritası · hareket kütüphanesi" baslik="Antrenman">
      <Kart baslik="Yakında" alt="Prototipteki antrenman ekranı buraya taşınacak" vurgu={renk.sicak} />
    </Ekran>
  );
}
