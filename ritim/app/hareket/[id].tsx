import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Ekran } from '@/components/Ekran';
import { Figur } from '@/components/Figur';
import { Baslik2, Hap, kartStil, SeviyeNoktalari } from '@/components/ortak';
import { Y } from '@/components/Y';
import { HAREKETLER, SEVIYE_AD } from '@/data/hareketler';
import { renk } from '@/theme';

/** Kolaydan zora basamaklar: ez (kolayı) ve hd (zoru) bağlantılarını takip eder (prototipteki vEx). */
function basamaklar(id: string): string[] {
  const zincir: string[] = [];
  let c = id;
  while (HAREKETLER[c].ez && !zincir.includes(HAREKETLER[c].ez!) && zincir.length < 4) c = HAREKETLER[c].ez!;
  let n: string | undefined = c;
  let say = 0;
  while (n && say < 6) {
    if (!zincir.includes(n)) zincir.push(n);
    n = HAREKETLER[n].hd;
    say++;
  }
  if (!zincir.includes(id)) zincir.push(id);
  return zincir;
}

export default function Hareket() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const x = HAREKETLER[id];
  if (!x) return <Ekran baslik="Hareket" geri />;
  const zincir = basamaklar(id);

  return (
    <Ekran baslik={x.n} geri>
      <View style={s.dfig}>
        <Figur id={id} boyut={270} />
      </View>
      <View style={s.etiketler}>
        {x.m.map((m) => (
          <Hap key={m}>{m}</Hap>
        ))}
        <Hap ikon="dambil">{x.eq}</Hap>
        <View style={s.seviye}>
          <SeviyeNoktalari n={x.lv} />
          <Y k={700} b={13} r={renk.yazi2}>
            {SEVIYE_AD[x.lv]}
          </Y>
        </View>
      </View>

      <Baslik2 ad="Nasıl yapılır" />
      <Liste maddeler={x.st} />
      <Baslik2 ad="Sık yapılan hatalar" />
      <Liste maddeler={x.er} hata />

      {zincir.length > 1 ? (
        <>
          <Baslik2 ad="İlerleme basamakları" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -18 }} contentContainerStyle={{ gap: 10, paddingHorizontal: 18 }}>
            {zincir.map((c) => (
              <Pressable
                key={c}
                accessibilityRole="button"
                onPress={() => c !== id && router.replace({ pathname: '/hareket/[id]', params: { id: c } })}
                style={[kartStil, s.basamak, c === id && { borderColor: renk.yazi, borderWidth: 2 }]}
              >
                <View style={s.basamakFig}>
                  <Figur id={c} boyut={96} oynasin={c === id} />
                </View>
                <View style={{ padding: 10 }}>
                  <Y k={800} b={14}>
                    {HAREKETLER[c].n}
                  </Y>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <SeviyeNoktalari n={HAREKETLER[c].lv} />
                    <Y k={600} b={12} r={renk.soluk}>
                      {SEVIYE_AD[HAREKETLER[c].lv]}
                    </Y>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
          <Y k={500} b={13} r={renk.soluk} style={{ marginTop: 12, marginHorizontal: 2 }}>
            Kolay basamakta 3×12 tekrarı rahat yapınca bir üste geç.
          </Y>
        </>
      ) : null}
    </Ekran>
  );
}

function Liste({ maddeler, hata }: { maddeler: string[]; hata?: boolean }) {
  return (
    <View style={[kartStil, { paddingHorizontal: 18, paddingVertical: 8 }]}>
      {maddeler.map((m, i) => (
        <View key={m} style={{ flexDirection: 'row', gap: 12, paddingVertical: 10 }}>
          <View style={[s.no, hata && { backgroundColor: 'rgba(255,122,89,0.14)' }]}>
            <Y k={800} b={14} r={hata ? renk.sicak : renk.yazi}>
              {i + 1}
            </Y>
          </View>
          <Y k={500} b={15} style={{ flex: 1, lineHeight: 22 }}>
            {m}
          </Y>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  dfig: { height: 280, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  etiketler: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  seviye: { flexDirection: 'row', alignItems: 'center', minHeight: 34, paddingHorizontal: 12, borderRadius: 99, backgroundColor: renk.kart2 },
  no: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  basamak: { width: 150, overflow: 'hidden' },
  basamakFig: { height: 100, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
});
