import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Bolum, Ekran } from '@/components/Ekran';
import { Ikon } from '@/components/Ikon';
import { Cubuk, Hap, kartStil } from '@/components/ortak';
import { Y } from '@/components/Y';
import { esyaAcik, ESYALAR, odaCiz } from '@/modules/oda/cizim';
import { useOdaVerisi } from '@/modules/oda/veri';
import { renk } from '@/theme';

export default function Odam() {
  const x = useOdaVerisi();
  const acik = ESYALAR.filter((e) => esyaAcik(e.id, x));
  const kilitli = ESYALAR.filter((e) => !esyaAcik(e.id, x))
    .map((e) => ({ e, p: Math.min(0.99, e.ilerleme(x)) }))
    .sort((a, b) => b.p - a.p);
  const sira = kilitli[0];
  const [secili, setSecili] = useState<string | null>(null);
  const sec = ESYALAR.find((e) => e.id === secili);

  return (
    <Ekran
      baslik="Odam"
      sag={
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Hap>{`Seviye ${x.level}`}</Hap>
          <Hap>{`${acik.length}/${ESYALAR.length}`}</Hap>
        </View>
      }
    >
      <View style={s.odaKart}>
        <View style={{ width: '100%', aspectRatio: 320 / 312 }}>
          <SvgXml xml={odaCiz(x, x.gece)} width="100%" height="100%" />
        </View>
        <Y k={600} b={12} r="#8a8d93" style={{ textAlign: 'center', marginTop: 2 }}>
          {x.gece ? (esyaAcik('lamp', x) ? 'Gece · lamba yanıyor' : 'Gece') : 'Gündüz'} · eşyaya dokun
        </Y>
      </View>

      {sec ? (
        <View style={[kartStil, s.secili]}>
          <View style={[s.ci_ikon, esyaAcik(sec.id, x) && s.ci_ikonAcik]}>
            <Ikon ad={esyaAcik(sec.id, x) ? sec.ikon : 'kilit'} renk={esyaAcik(sec.id, x) ? renk.iyi : renk.soluk} />
          </View>
          <View style={{ flex: 1 }}>
            <Y k={700} b={16}>
              {sec.ad}
            </Y>
            <Y k={600} b={12} r={renk.soluk}>
              {esyaAcik(sec.id, x) ? 'Odanda' : sec.kosul}
            </Y>
          </View>
          <Pressable accessibilityLabel="Kapat" onPress={() => setSecili(null)} hitSlop={10}>
            <Ikon ad="kapat" renk={renk.soluk} />
          </Pressable>
        </View>
      ) : null}

      {sira ? (
        <>
          <Bolum ad="Sıradaki eşya" />
          <View style={[kartStil, s.lrow]}>
            <Ikon ad={sira.e.ikon} boyut={20} renk={renk.soluk} />
            <View style={{ flex: 1 }}>
              <Y k={600} b={16}>
                {sira.e.ad}
              </Y>
              <Y k={600} b={12} r={renk.soluk}>
                {sira.e.kosul}
              </Y>
              <View style={{ marginTop: 8 }}>
                <Cubuk oran={sira.p} />
              </View>
            </View>
            <Y k={700} b={15}>
              %{Math.round(sira.p * 100)}
            </Y>
          </View>
        </>
      ) : null}

      <Bolum ad="Koleksiyon" sayac={`${acik.length}/${ESYALAR.length}`} />
      <View style={s.koleksiyon}>
        {ESYALAR.map((e) => {
          const o = esyaAcik(e.id, x);
          const p = Math.min(1, e.ilerleme(x));
          return (
            <Pressable
              key={e.id}
              accessibilityRole="button"
              accessibilityLabel={`${e.ad}${o ? '' : ', kilitli: ' + e.kosul}`}
              onPress={() => {
                Haptics.selectionAsync();
                setSecili(e.id);
              }}
              style={[s.ci, secili === e.id && { borderColor: renk.yazi }]}
            >
              <View style={[s.ci_ikon, o && s.ci_ikonAcik]}>
                <Ikon ad={o ? e.ikon : 'kilit'} renk={o ? renk.iyi : renk.soluk} />
              </View>
              <Y k={700} b={12} r={o ? renk.yazi : renk.soluk} style={{ textAlign: 'center', lineHeight: 15 }}>
                {e.ad}
              </Y>
              {!o ? (
                <View style={s.mini}>
                  <View style={{ width: `${p * 100}%`, height: '100%', backgroundColor: renk.iyi }} />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
      <Y k={500} b={13} r={renk.soluk} style={{ marginTop: 12, marginHorizontal: 2, lineHeight: 20 }}>
        Odan gerçek hayatını yansıtır: bitirdiğin kitaplar rafa dizilir, su içmezsen bitki solar, gece pencere kararır ve lamba yanar.
      </Y>
    </Ekran>
  );
}

const s = StyleSheet.create({
  odaKart: { marginTop: 6, borderRadius: 24, overflow: 'hidden', backgroundColor: '#121318', borderWidth: 1, borderColor: renk.cizgi, paddingTop: 10, paddingBottom: 12 },
  secili: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, marginTop: 12 },
  lrow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 16, minHeight: 60 },
  koleksiyon: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 8 },
  ci: { width: '32.2%', alignItems: 'center', gap: 6, paddingTop: 14, paddingBottom: 12, paddingHorizontal: 6, borderRadius: 18, backgroundColor: renk.kart, borderWidth: 1, borderColor: renk.cizgi },
  ci_ikon: { width: 40, height: 40, borderRadius: 12, backgroundColor: renk.kart2, alignItems: 'center', justifyContent: 'center' },
  ci_ikonAcik: { backgroundColor: 'rgba(46,229,157,0.18)' },
  mini: { width: '70%', height: 4, borderRadius: 9, backgroundColor: renk.iz, overflow: 'hidden' },
});
