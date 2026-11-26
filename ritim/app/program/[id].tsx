import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Ekran } from '@/components/Ekran';
import { Figur } from '@/components/Figur';
import { Ikon } from '@/components/Ikon';
import { Hap, kartStil, SeviyeNoktalari } from '@/components/ortak';
import { Y } from '@/components/Y';
import { HAREKETLER, PROGRAMLAR, SEVIYE_AD } from '@/data/hareketler';
import { useGunluk } from '@/store/gunluk';
import { renk } from '@/theme';

export default function ProgramSayfasi() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const g = useGunluk();
  const p = PROGRAMLAR.find((x) => x.id === id);
  if (!p) return <Ekran baslik="Antrenman" geri />;

  return (
    <Ekran baslik={p.n} geri>
      <View style={s.dfig}>
        <Figur id={p.it[0][0]} boyut={230} />
      </View>
      <Y k={500} b={15} r={renk.yazi2} style={{ marginTop: 14 }}>
        {p.d}
      </Y>
      <View style={s.etiketler}>
        <Hap ikon="saat">{`${p.min} dk`}</Hap>
        <Hap>{p.w}</Hap>
        <View style={s.seviye}>
          <SeviyeNoktalari n={p.lv} />
          <Y k={700} b={13} r={renk.yazi2}>
            {SEVIYE_AD[p.lv]}
          </Y>
        </View>
        <Hap>{`Dinlenme ${p.rest ?? g.hedefler.dinlenme} sn`}</Hap>
      </View>

      <View style={[kartStil, { marginTop: 16, paddingHorizontal: 16, paddingVertical: 4 }]}>
        {p.it.map(([e, set, tekrar], i) => (
          <Pressable
            key={e + i}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/hareket/[id]', params: { id: e } })}
            style={[s.satir, i > 0 && { borderTopWidth: 1, borderTopColor: renk.cizgi }]}
          >
            <View style={s.kucuk}>
              <Figur id={e} boyut={52} oynasin={false} />
            </View>
            <View style={{ flex: 1 }}>
              <Y k={700} b={16}>
                {HAREKETLER[e].n}
              </Y>
              <Y k={500} b={13} r={renk.soluk}>
                {set} set × {tekrar}
                {HAREKETLER[e].t === 'time' ? ' sn' : ' tekrar'}
              </Y>
            </View>
            <Ikon ad="ileri" renk={renk.soluk} />
          </Pressable>
        ))}
      </View>

      <View style={[kartStil, s.not]}>
        <Ikon ad="oynat" renk={renk.soluk} />
        <Y k={500} b={14} r={renk.soluk} style={{ flex: 1, lineHeight: 20 }}>
          Rehberli antrenman (set sayacı, dinlenme süresi, sesli yönlendirme) sıradaki adımlarda gelecek.
        </Y>
      </View>
    </Ekran>
  );
}

const s = StyleSheet.create({
  dfig: { height: 240, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  etiketler: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  seviye: { flexDirection: 'row', alignItems: 'center', minHeight: 34, paddingHorizontal: 12, borderRadius: 99, backgroundColor: renk.kart2 },
  satir: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  kucuk: { width: 56, height: 56, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  not: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, marginTop: 14 },
});
