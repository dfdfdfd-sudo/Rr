import { Ekran } from '@/components/Ekran';
import { Kart } from '@/components/Kart';
import { renk } from '@/theme';

export default function Odam() {
  return (
    <Ekran ust="Her modül odana bir şey kazandırır" baslik="Odam">
      <Kart baslik="Odan boş… şimdilik" alt="İlk su kaydınla ilk eşyan gelecek" vurgu={renk.ruh} />
    </Ekran>
  );
}
