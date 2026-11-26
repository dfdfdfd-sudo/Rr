import { Ekran } from '@/components/Ekran';
import { Kart } from '@/components/Kart';

export default function Profil() {
  return (
    <Ekran ust="Ayarlar ve hedefler" baslik="Profil">
      <Kart baslik="Merhaba Emre" alt="Verilerin sadece bu telefonda duruyor" />
    </Ekran>
  );
}
