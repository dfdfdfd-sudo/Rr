import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, ScrollViewInstance, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

import { Ekran } from '@/components/Ekran';
import { Figur } from '@/components/Figur';
import { Ikon } from '@/components/Ikon';
import { KasHaritasi } from '@/components/KasHaritasi';
import { Baslik2, Cip, kartStil, PlanSeridi, SeviyeNoktalari } from '@/components/ortak';
import { Y } from '@/components/Y';
import { HAREKETLER, PROGRAMLAR, SEVIYE_AD } from '@/data/hareketler';
import { useGunluk } from '@/store/gunluk';
import { renk, yaziTipi } from '@/theme';

export default function Antrenman() {
  const g = useGunluk();
  const [ara, setAra] = useState('');
  const [kas, setKas] = useState('Tümü');
  const [ekipman, setEkipman] = useState('Tümü');
  const kaydir = useRef<ScrollViewInstance>(null);
  const kutuphaneY = useRef(0);

  const yogaAcik = g.modulAcik('yoga');
  const hepsi = useMemo(() => Object.entries(HAREKETLER).filter(([, x]) => x.pat !== 'yoga' || yogaAcik), [yogaAcik]);
  const kaslar = ['Tümü', ...new Set(hepsi.flatMap(([, x]) => x.m))];
  const ekipmanlar = ['Tümü', ...new Set(hepsi.map(([, x]) => x.eq))];
  const q = ara.toLocaleLowerCase('tr');
  const liste = hepsi.filter(
    ([, x]) =>
      (!q || x.n.toLocaleLowerCase('tr').includes(q) || x.m.join(' ').toLocaleLowerCase('tr').includes(q)) &&
      (kas === 'Tümü' || x.m.includes(kas)) &&
      (ekipman === 'Tümü' || x.eq === ekipman),
  );
  const hedef = Object.keys(g.plan).length || 3;
  const yapilan = 0; // rehberli antrenman gelince dolacak

  return (
    <Ekran baslik="Antrenman" kaydirRef={kaydir}>
      <Baslik2 ad="Haftalık plan" eylem="Düzenle" onEylem={() => router.navigate('/profil')} ilk />
      <PlanSeridi />
      <Y k={500} b={13} r={renk.soluk} style={{ marginTop: 12, marginHorizontal: 2 }}>
        Bir güne dokunarak programını değiştir.
      </Y>

      {/* Bu hafta */}
      <View style={[kartStil, s.wsum]}>
        <MiniHalka n={yapilan} hedef={hedef} />
        <View style={{ flex: 1 }}>
          <Y k={800} b={16}>
            Bu hafta
          </Y>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 6 }}>
            {[
              ['Süre', '0 dk'],
              ['Hacim', '0 kg'],
              ['Toplam', String(g.istatistik.antrenman)],
            ].map(([a, b]) => (
              <View key={a}>
                <Y k={600} b={11} r={renk.soluk}>
                  {a}
                </Y>
                <Y k={800} b={15}>
                  {b}
                </Y>
              </View>
            ))}
          </View>
        </View>
      </View>

      <Baslik2 ad="Kas haritası" hap="son 7 gün" />
      <KasHaritasi
        secili={kas === 'Tümü' ? undefined : kas}
        onKas={(m) => {
          setKas(m);
          kaydir.current?.scrollTo({ y: kutuphaneY.current, animated: true });
        }}
      />

      <Baslik2 ad="Hazır antrenmanlar" />
      {g.modulAcik('kardiyo') ? (
        <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/modul/[ad]', params: { ad: 'kardiyo' } })} style={[kartStil, s.pg]}>
          <View style={[s.pgFig, { backgroundColor: 'rgba(46,229,157,0.13)' }]}>
            <Ikon ad="kos" renk={renk.iyi} />
          </View>
          <View style={{ flex: 1 }}>
            <Y k={800} b={17}>
              Yürüyüş, koşu, bisiklet
            </Y>
            <Y k={600} b={13} r={renk.soluk}>
              Kronometre ve kayıt
            </Y>
          </View>
          <Ikon ad="ileri" renk={renk.yazi} />
        </Pressable>
      ) : null}
      {PROGRAMLAR.filter((p) => p.id !== 'yoga' || yogaAcik).map((p) => (
        <Pressable key={p.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/program/[id]', params: { id: p.id } })} style={[kartStil, s.pg]}>
          <View style={s.pgFig}>
            <Figur id={p.it[0][0]} boyut={70} oynasin={false} />
          </View>
          <View style={{ flex: 1 }}>
            <Y k={800} b={17}>
              {p.n}
            </Y>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
              <Y k={600} b={13} r={renk.soluk}>
                {p.w} · {p.min} dk ·{' '}
              </Y>
              <SeviyeNoktalari n={p.lv} />
              <Y k={600} b={13} r={renk.soluk}>
                {SEVIYE_AD[p.lv]}
              </Y>
            </View>
            <Y k={600} b={13} r={renk.soluk}>
              {p.d}
            </Y>
          </View>
          <Ikon ad="ileri" renk={renk.yazi} />
        </Pressable>
      ))}

      <View onLayout={(e) => (kutuphaneY.current = e.nativeEvent.layout.y - 10)}>
        <Baslik2 ad="Hareket kütüphanesi" hap={String(hepsi.length)} />
      </View>
      <View style={s.ara}>
        <Ikon ad="ara" boyut={20} renk={renk.soluk} />
        <TextInput
          value={ara}
          onChangeText={setAra}
          placeholder="Hareket ya da kas ara"
          placeholderTextColor={renk.soluk}
          style={s.araGirdi}
          accessibilityLabel="Hareket ara"
          returnKeyType="search"
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12, marginHorizontal: -18 }} contentContainerStyle={s.cipler}>
        {kaslar.map((m) => (
          <Cip key={m} ad={m} secili={kas === m} onPress={() => setKas(m)} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8, marginHorizontal: -18 }} contentContainerStyle={s.cipler}>
        {ekipmanlar.map((m) => (
          <Cip key={m} ad={m === 'Tümü' ? 'Tüm ekipman' : m} secili={ekipman === m} onPress={() => setEkipman(m)} />
        ))}
      </ScrollView>
      <View style={s.izgara}>
        {liste.map(([id, x]) => (
          <Pressable key={id} accessibilityRole="button" accessibilityLabel={x.n} onPress={() => router.push({ pathname: '/hareket/[id]', params: { id } })} style={[kartStil, s.ex]}>
            <View style={s.exFig}>
              <Figur id={id} boyut={112} />
            </View>
            <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 12 }}>
              <Y k={800} b={15} style={{ lineHeight: 19 }}>
                {x.n}
              </Y>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <SeviyeNoktalari n={x.lv} />
                <Y k={600} b={12} r={renk.soluk} numberOfLines={1} style={{ flex: 1 }}>
                  {x.m.slice(0, 2).join(', ')}
                </Y>
              </View>
            </View>
          </Pressable>
        ))}
        {!liste.length ? (
          <Y k={500} b={14} r={renk.soluk}>
            Bu filtrelere uyan hareket yok.
          </Y>
        ) : null}
      </View>
    </Ekran>
  );
}

function MiniHalka({ n, hedef }: { n: number; hedef: number }) {
  const R = 34;
  const C = 2 * Math.PI * R;
  const p = Math.min(1, n / hedef);
  return (
    <Svg width={84} height={84} viewBox="0 0 84 84">
      <Circle cx={42} cy={42} r={R} fill="none" stroke={renk.iz} strokeWidth={9} />
      <Circle cx={42} cy={42} r={R} fill="none" stroke={renk.vurgu} strokeWidth={9} strokeLinecap="round" strokeDasharray={`${C * p} ${C}`} transform="rotate(-90 42 42)" />
      <SvgText x={42} y={48} textAnchor="middle" fontSize={18} fontFamily={yaziTipi[800]} fontWeight="800" fill={renk.yazi}>
        {`${n}/${hedef}`}
      </SvgText>
    </Svg>
  );
}

const s = StyleSheet.create({
  wsum: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, marginTop: 14 },
  pg: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, marginTop: 10 },
  pgFig: { width: 76, height: 76, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  ara: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 50, paddingHorizontal: 14, borderRadius: 99, borderWidth: 1, borderColor: renk.cizgi, backgroundColor: renk.kart },
  araGirdi: { flex: 1, color: renk.yazi, fontFamily: yaziTipi[500], fontSize: 16, paddingVertical: 12 },
  cipler: { gap: 8, paddingHorizontal: 18 },
  izgara: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10, marginTop: 12 },
  ex: { width: '48.5%', overflow: 'hidden' },
  exFig: { height: 120, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
});
