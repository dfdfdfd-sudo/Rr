import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Bolum, Ekran } from '@/components/Ekran';
import { Ikon } from '@/components/Ikon';
import { RitimHalkasi } from '@/components/RitimHalkasi';
import { Y } from '@/components/Y';
import { ALISKANLIKLAR, ARACLAR, IPUCLARI, SABAH, SU_HEDEF_ML } from '@/data/varsayilan';
import { skorRengi, skorYazisi } from '@/lib/skor';
import { bugun, GUN_KISA, haftaGunleri, sayi, selam, son7, tarihten, uzunTarih } from '@/lib/tarih';
import { useGunluk } from '@/store/gunluk';
import { aracRenk, kose, renk } from '@/theme';

const tikla = () => Haptics.selectionAsync();

export default function Bugun() {
  const g = useGunluk();
  const k = bugun();
  const gun = g.gun(k);
  const skor = g.skor(k);
  const tamam = ALISKANLIKLAR.filter((a) => gun.aliskanlik[a.id]).length;
  const [pop, setPop] = useState<string | null>(null);

  const modul = (id: string) => router.push(id === 'su' ? '/modul/su' : { pathname: '/modul/[ad]', params: { ad: id } });

  return (
    <Ekran>
      {/* Üst: tarih + selam + profil harfi */}
      <View style={s.ust}>
        <View style={{ flex: 1 }}>
          <Y k={600} b={13} r={renk.soluk}>
            {uzunTarih(k)}
          </Y>
          <Y k={700} b={17} style={{ marginTop: 2, letterSpacing: -0.2 }}>
            {selam()}, {g.ad}
          </Y>
        </View>
        <Pressable accessibilityLabel="Profil" onPress={() => router.navigate('/profil')} style={s.harf}>
          <Y k={800} b={15}>
            {g.ad.charAt(0).toLocaleUpperCase('tr-TR')}
          </Y>
        </Pressable>
      </View>

      {/* Skor kartı */}
      <View style={s.hero}>
        <View style={{ alignItems: 'center' }}>
          <RitimHalkasi skor={skor} />
        </View>
        <View style={{ alignItems: 'center', marginTop: 4 }}>
          <Y k={700} b={17} r={skorRengi(skor)}>
            {skorYazisi(skor)}
          </Y>
          <Y k={600} b={13} r={renk.soluk}>
            {tamam}/{ALISKANLIKLAR.length} alışkanlık
          </Y>
        </View>
        <View style={s.mets}>
          <Metrik ad="Uyku" deger={gun.uykuDk ? `${Math.floor(gun.uykuDk / 60)}s ${gun.uykuDk % 60}d` : '—'} alt="kaydet" onPress={() => modul('uyku')} ilk />
          <Metrik genis ad="Antrenman" deger="Dinlenme" alt="toparlanma günü" onPress={() => router.navigate('/antrenman')} />
          <Metrik
            ad="Su"
            deger={`${sayi(gun.suMl / 1000)} L`}
            alt={`/ ${sayi(SU_HEDEF_ML / 1000)} L · dokun +su`}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              g.suEkle(k, 250);
            }}
          />
        </View>
      </View>

      {/* Haftalık şerit */}
      <View style={s.hafta}>
        {haftaGunleri(k).map((x) => {
          const gelecek = x > k;
          const sk = gelecek ? 0 : g.skor(x);
          return (
            <View key={x} style={[s.hgun, gelecek && { opacity: 0.4 }]}>
              <View style={[s.hcubuk, x === k && s.hsecili]}>
                <View style={{ height: `${Math.max(4, sk)}%`, backgroundColor: gelecek ? renk.iz : skorRengi(sk), borderRadius: 9 }} />
              </View>
              <Y k={700} b={11} r={x === k ? renk.yazi : renk.soluk}>
                {GUN_KISA[tarihten(x).getDay()]}
              </Y>
            </View>
          );
        })}
      </View>

      {/* Bugünün antrenmanı (Antrenman modülü gelene kadar: dinlenme günü) */}
      <View style={[s.satir2, { marginTop: 14 }]}>
        <View style={s.kucukResim}>
          <Ikon ad="ay" boyut={30} renk={renk.soluk} />
        </View>
        <View style={{ flex: 1 }}>
          <Y k={700} b={12} r={renk.soluk}>
            Bugün
          </Y>
          <Y k={800} b={17} style={{ letterSpacing: -0.2 }}>
            Dinlenme günü
          </Y>
          <Y k={500} b={13} r={renk.soluk}>
            Hafif yürüyüş ya da nefes egzersizi iyi gelir
          </Y>
        </View>
        <Pressable accessibilityLabel="Antrenman seç" onPress={() => router.navigate('/antrenman')} style={s.oynat}>
          <Ikon ad="ileri" renk={renk.yazi} />
        </Pressable>
      </View>

      {/* Alışkanlıklar */}
      <Bolum ad="Alışkanlıklar" sayac={`${tamam}/${ALISKANLIKLAR.length}`} eylem="Ekle" />
      <View style={s.izgara}>
        {ALISKANLIKLAR.map((a) => {
          const on = !!gun.aliskanlik[a.id];
          return (
            <Pressable
              key={a.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              accessibilityLabel={a.ad}
              onPress={() => {
                Haptics.notificationAsync(on ? Haptics.NotificationFeedbackType.Warning : Haptics.NotificationFeedbackType.Success);
                setPop(on ? null : a.id);
                g.aliskanlikDegistir(k, a.id);
              }}
              style={({ pressed }) => [s.hab, on && s.habOn, pressed && { transform: [{ scale: 0.97 }] }]}
            >
              <View style={[s.hico, on && { backgroundColor: renk.iyi }, pop === a.id && on && { transform: [{ scale: 1.08 }] }]}>
                <Ikon ad={on ? 'tik' : a.ikon} renk={on ? '#06240f' : renk.yazi2} />
              </View>
              <Y k={700} b={15} style={{ lineHeight: 19 }}>
                {a.ad}
              </Y>
              <Y k={600} b={12} r={renk.soluk}>
                {on ? 'Bugün tamam' : 'Dokun, tamamla'}
              </Y>
              <View style={s.noktalar}>
                {son7(k).map((x) => {
                  const ok = !!g.gun(x).aliskanlik[a.id];
                  return <View key={x} style={[s.nokta, ok ? s.noktaTamam : x < k ? s.noktaKacti : null]} />;
                })}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Güne başla */}
      <GuneBasla />

      {/* Kayıtlar */}
      <Bolum ad="Kayıtlar" />
      <View style={s.liste}>
        <Satir ikon="kalp" ad="Ruh hali" deger="Ekle" onPress={() => modul('ruh')} />
        <Satir ikon="tarti" ad="Vücut" deger="Ekle" onPress={() => modul('vucut')} ust />
      </View>

      {/* Araçlar */}
      <Bolum ad="Araçlar" />
      <View style={s.araclar}>
        {ARACLAR.map((a) => (
          <Pressable
            key={a.id}
            accessibilityRole="button"
            accessibilityLabel={a.ad}
            onPress={() => {
              tikla();
              modul(a.id);
            }}
            style={s.arac}
          >
            {({ pressed }) => (
              <>
                <View style={[s.aracIkon, { backgroundColor: aracRenk[a.id], shadowColor: aracRenk[a.id] }, pressed && { transform: [{ scale: 0.92 }] }]}>
                  <Ikon ad={a.ikon} boyut={26} renk="#fff" />
                </View>
                <Y k={600} b={11.5} r={renk.yazi2} style={{ textAlign: 'center' }}>
                  {a.ad}
                </Y>
              </>
            )}
          </Pressable>
        ))}
      </View>

      <Y k={500} b={13} r={renk.soluk} style={{ marginTop: 22, marginHorizontal: 4, lineHeight: 20 }}>
        {IPUCLARI[tarihten(k).getDate() % IPUCLARI.length]}
      </Y>
    </Ekran>
  );
}

function Metrik({ ad, deger, alt, onPress, ilk, genis }: { ad: string; deger: string; alt: string; onPress: () => void; ilk?: boolean; genis?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${ad}: ${deger}`} onPress={onPress} style={[s.met, ilk && s.metIlk, genis && { flex: 1.35 }]}>
      <Y k={700} b={11} r={renk.soluk} style={{ letterSpacing: 0.7 }}>
        {ad.toLocaleUpperCase('tr-TR')}
      </Y>
      <Y k={800} b={20} numberOfLines={1} style={{ marginTop: 2, letterSpacing: -0.4 }}>
        {deger}
      </Y>
      <Y k={500} b={12} r={renk.soluk} numberOfLines={1}>
        {alt}
      </Y>
    </Pressable>
  );
}

function Satir({ ikon, ad, deger, onPress, ust }: { ikon: string; ad: string; deger: string; onPress: () => void; ust?: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [s.lrow, ust && s.lrowCizgi, pressed && { backgroundColor: renk.kart2 }]}>
      <Ikon ad={ikon} boyut={20} renk={renk.soluk} />
      <Y k={600} b={16} style={{ flex: 1 }}>
        {ad}
      </Y>
      <Y k={700} b={15}>
        {deger}
      </Y>
      <Ikon ad="ileri" boyut={18} renk={renk.soluk} />
    </Pressable>
  );
}

/** Sabah rutini: adımlar tamamlandıkça gökyüzü aydınlanır, güneş yükselir. */
function GuneBasla() {
  const g = useGunluk();
  const k = bugun();
  const gun = g.gun(k);
  const dn = SABAH.filter((_, i) => gun.sabah[i]).length;
  const p = dn / SABAH.length;
  const sira = SABAH.find((_, i) => !gun.sabah[i]);
  const karis = (a: string, b: string) => {
    // a (gece) → b (gündüz) renk geçişi
    const h = (x: string) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16));
    const [x, y] = [h(a), h(b)];
    return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * p)).join(',')})`;
  };

  return (
    <>
      <Bolum ad="Güne başla" sayac={`${dn}/${SABAH.length}`} />
      <View style={s.sabah}>
        <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none" viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="gok" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={karis('#1d2c57', '#5fa8e0')} />
              <Stop offset="1" stopColor={karis('#e08a5a', '#f8d9a0')} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100" height="100" fill="url(#gok)" />
        </Svg>
        <View style={[s.gunes, { top: 70 - p * 52 }]} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {SABAH.map((ad, i) => {
            const on = !!gun.sabah[i];
            return (
              <Pressable
                key={ad}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                accessibilityLabel={ad}
                onPress={() => {
                  tikla();
                  g.sabahDegistir(k, i);
                }}
                style={[s.mck, on && s.mckOn]}
              >
                {on ? <Ikon ad="tik" boyut={18} renk="#3a2a08" kalinlik={2.5} /> : <Y k={800} b={15} r="#fff">{i + 1}</Y>}
              </Pressable>
            );
          })}
        </View>
        <Y k={500} b={14} r="#fff" style={s.sabahYazi}>
          {sira ? (
            <>
              Sıradaki: <Y k={700} b={14} r="#fff">{sira}</Y>
            </>
          ) : (
            'Sabah rutini tamam, günaydın!'
          )}
        </Y>
      </View>
    </>
  );
}

const kart = { backgroundColor: renk.kart, borderWidth: 1, borderColor: renk.cizgi } as const;

const s = StyleSheet.create({
  ust: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48 },
  harf: { width: 38, height: 38, borderRadius: 19, backgroundColor: renk.kart2, borderWidth: 1, borderColor: renk.cizgi, alignItems: 'center', justifyContent: 'center' },
  hero: { ...kart, marginTop: 18, paddingTop: 22, paddingHorizontal: 18, paddingBottom: 18, borderRadius: kose.buyuk },
  mets: { flexDirection: 'row', marginTop: 18, borderTopWidth: 1, borderTopColor: renk.cizgi, paddingTop: 14 },
  met: { flex: 1, paddingVertical: 2, paddingHorizontal: 10, borderLeftWidth: 1, borderLeftColor: renk.cizgi, minHeight: 56 },
  metIlk: { borderLeftWidth: 0, paddingLeft: 2 },
  hafta: { ...kart, flexDirection: 'row', marginTop: 14, paddingVertical: 12, paddingHorizontal: 14, borderRadius: kose.kart },
  hgun: { flex: 1, alignItems: 'center', gap: 6 },
  hcubuk: { width: 8, height: 44, borderRadius: 9, backgroundColor: renk.iz, justifyContent: 'flex-end', overflow: 'hidden' },
  hsecili: { borderWidth: 1.5, borderColor: renk.yazi, width: 11 },
  satir2: { ...kart, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, borderRadius: kose.kart },
  kucukResim: { width: 64, height: 64, borderRadius: 14, backgroundColor: renk.kart2, alignItems: 'center', justifyContent: 'center' },
  oynat: { width: 48, height: 48, borderRadius: 24, backgroundColor: renk.kart2, alignItems: 'center', justifyContent: 'center' },
  izgara: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  hab: { ...kart, width: '48.5%', flexGrow: 1, flexBasis: '45%', gap: 4, padding: 14, minHeight: 132, borderRadius: kose.kart },
  habOn: { backgroundColor: '#13241d', borderColor: '#1d5a43' },
  hico: { width: 40, height: 40, borderRadius: 14, backgroundColor: renk.kart2, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  noktalar: { flexDirection: 'row', gap: 4, marginTop: 'auto', paddingTop: 8 },
  nokta: { width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: renk.cizgi },
  noktaTamam: { backgroundColor: renk.iyi, borderColor: renk.iyi },
  noktaKacti: { backgroundColor: renk.iz, borderColor: renk.iz },
  sabah: { padding: 14, borderRadius: kose.kart, overflow: 'hidden', borderWidth: 1, borderColor: renk.cizgi },
  gunes: { position: 'absolute', right: 22, width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff3c4', shadowColor: '#ffc85a', shadowOpacity: 0.8, shadowRadius: 20, shadowOffset: { width: 0, height: 0 } },
  mck: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)' },
  mckOn: { backgroundColor: '#ffc85a', borderColor: '#ffc85a' },
  sabahYazi: { marginTop: 12, textShadowColor: 'rgba(0,0,0,0.35)', textShadowRadius: 4, textShadowOffset: { width: 0, height: 1 } },
  liste: { ...kart, borderRadius: kose.kart, overflow: 'hidden' },
  lrow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 16, minHeight: 60 },
  lrowCizgi: { borderTopWidth: 1, borderTopColor: renk.cizgi },
  araclar: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 14 },
  arac: { width: '25%', alignItems: 'center', gap: 6, paddingHorizontal: 4 },
  aracIkon: { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.3, shadowRadius: 7, shadowOffset: { width: 0, height: 6 } },
});
