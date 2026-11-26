import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Share, StyleSheet, TextInput, View } from 'react-native';

import { Ekran } from '@/components/Ekran';
import { Ikon } from '@/components/Ikon';
import { Anahtar, Baslik2, Hap, kartStil, PlanSeridi } from '@/components/ortak';
import { Y } from '@/components/Y';
import { Hedefler, MODUL_GRUPLARI } from '@/data/varsayilan';
import { SEVIYE_AD } from '@/data/hareketler';
import { useGunluk } from '@/store/gunluk';
import { renk, yaziTipi } from '@/theme';

const HEDEF_ALANLARI: [keyof Hedefler, string][] = [
  ['su', 'Su (ml)'],
  ['kalori', 'Kalori'],
  ['protein', 'Protein (g)'],
  ['uyku', 'Uyku (saat)'],
  ['dinlenme', 'Dinlenme (sn)'],
  ['mesai', 'Mesai (sa/gün)'],
  ['haftaMesai', 'Mesai (sa/hafta)'],
];

export default function Profil() {
  const g = useGunluk();
  const [emin, setEmin] = useState(false);
  const ilk = g.ad.charAt(0).toLocaleUpperCase('tr-TR');

  return (
    <Ekran>
      {/* Kimlik kartı */}
      <View style={[kartStil, s.kimlik]}>
        <View style={s.harf}>
          <Y k={800} b={34} r={renk.vurguYazi}>
            {ilk}
          </Y>
        </View>
        <Y k={800} b={30} style={{ marginTop: 12, letterSpacing: -0.6 }}>
          {g.ad}
        </Y>
        <Y k={500} b={15} r={renk.yazi2} style={{ marginTop: 6 }}>
          {g.amac} · {SEVIYE_AD[g.seviye]} · {g.yer}
        </Y>
        <View style={s.meta}>
          <Hap ikon="simsek">{`Seviye ${g.istatistik.seviye}`}</Hap>
          <Hap ikon="dambil">{`${g.istatistik.antrenman} antrenman`}</Hap>
          <Hap ikon="alev" sicak>{`${g.istatistik.enIyiSeri} gün`}</Hap>
        </View>
      </View>

      <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/modul/[ad]', params: { ad: 'ilerleme' } })} style={[kartStil, s.row2]}>
        <View style={s.thumb}>
          <Ikon ad="grafik" boyut={30} renk={renk.yazi} />
        </View>
        <View style={{ flex: 1 }}>
          <Y k={800} b={17}>
            İlerleme ve istatistikler
          </Y>
          <Y k={500} b={13} r={renk.soluk}>
            Seviye, alışkanlık haritası, kilo, rekorlar, rozetler
          </Y>
        </View>
        <Ikon ad="ileri" renk={renk.yazi} />
      </Pressable>

      <Baslik2 ad="Haftalık plan" />
      <View style={[kartStil, { padding: 18 }]}>
        <PlanSeridi kisa />
      </View>

      <Baslik2 ad="Alışkanlıklarım" eylem="+ Ekle" onEylem={() => router.push('/aliskanlik-ekle')} />
      <View style={[kartStil, { paddingHorizontal: 16, paddingVertical: 4 }]}>
        {g.aliskanliklar.map((a, i) => (
          <View key={a.id} style={[s.li, i > 0 && s.cizgi]}>
            <View style={[s.tile, { backgroundColor: a.renk + '21' }]}>
              <Ikon ad={a.ikon} renk={a.renk} />
            </View>
            <View style={{ flex: 1 }}>
              <Y k={700} b={16}>
                {a.ad}
              </Y>
              <Y k={500} b={13} r={renk.soluk}>
                Her gün
              </Y>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${a.ad} alışkanlığını sil`}
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                g.aliskanlikSil(a.id);
              }}
              style={s.del}
            >
              <Ikon ad="cop" renk={renk.soluk} />
            </Pressable>
          </View>
        ))}
        {!g.aliskanliklar.length ? (
          <Y k={500} b={14} r={renk.soluk} style={{ paddingVertical: 14 }}>
            Henüz yok.
          </Y>
        ) : null}
      </View>

      <Baslik2 ad="Hedefler" />
      <View style={[kartStil, s.hedefler]}>
        {HEDEF_ALANLARI.map(([k, ad]) => (
          <View key={k} style={{ width: '47.5%' }}>
            <Y k={600} b={13} r={renk.yazi2}>
              {ad}
            </Y>
            <TextInput
              defaultValue={String(g.hedefler[k]).replace('.', ',')}
              keyboardType="decimal-pad"
              accessibilityLabel={ad}
              onChangeText={(t) => {
                const v = Number(t.replace(',', '.'));
                if (t.trim() && Number.isFinite(v) && v >= 0) g.hedefAyarla(k, v);
              }}
              style={s.girdi}
            />
          </View>
        ))}
      </View>

      <Baslik2 ad="Modüller" />
      <Y k={500} b={15} r={renk.yazi2} style={{ marginTop: -6 }}>
        Kullanmadıklarını kapat; menülerden ve Bugün ekranından kalkar. Verilerin silinmez.
      </Y>
      {MODUL_GRUPLARI.map((grup) => (
        <View key={grup.ad}>
          <Y k={600} b={13} r={renk.soluk} style={{ marginTop: 16, marginBottom: 8, marginHorizontal: 4 }}>
            {grup.ad}
          </Y>
          <View style={[kartStil, { paddingHorizontal: 16 }]}>
            {grup.moduller.map((m, i) => (
              <View key={m.id} style={[s.tog, i > 0 && s.cizgi]}>
                <View style={[s.tile, { backgroundColor: 'rgba(255,255,255,0.06)' }]}>
                  <Ikon ad={m.ikon} renk={renk.yazi} />
                </View>
                <Y k={700} b={16} style={{ flex: 1 }}>
                  {m.ad}
                </Y>
                <Anahtar acik={g.modulAcik(m.id)} onPress={() => g.modulDegistir(m.id)} etiket={m.ad} />
              </View>
            ))}
          </View>
        </View>
      ))}

      <Baslik2 ad="Hesap ve veri" />
      <View style={[kartStil, { padding: 18 }]}>
        <Y k={500} b={13} r={renk.soluk}>
          Veriler bu cihazda saklanıyor. Ara ara yedek al.
        </Y>
        <View style={s.dugmeler}>
          <Pressable
            accessibilityRole="button"
            onPress={() => Share.share({ message: g.yedek() }).catch(() => {})}
            style={s.btn}
          >
            <Y k={700} b={14}>
              Yedeği paylaş
            </Y>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              if (!emin) {
                setEmin(true);
                return;
              }
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              g.sifirla();
              setEmin(false);
            }}
            style={s.btn}
          >
            <Y k={700} b={14} r={renk.sicak}>
              {emin ? 'Emin misin? Tekrar dokun' : 'Verileri sıfırla'}
            </Y>
          </Pressable>
        </View>
      </View>
    </Ekran>
  );
}

const s = StyleSheet.create({
  kimlik: { alignItems: 'center', padding: 18, marginTop: 8 },
  harf: { width: 84, height: 84, borderRadius: 42, backgroundColor: renk.vurgu, alignItems: 'center', justifyContent: 'center' },
  meta: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 12 },
  row2: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, marginTop: 14 },
  thumb: { width: 64, height: 64, borderRadius: 14, backgroundColor: renk.kart2, alignItems: 'center', justifyContent: 'center' },
  li: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  cizgi: { borderTopWidth: 1, borderTopColor: renk.cizgi },
  tile: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  del: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  hedefler: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12, padding: 18 },
  girdi: { marginTop: 6, minHeight: 52, borderRadius: 14, borderWidth: 1, borderColor: renk.cizgi, backgroundColor: renk.zemin, paddingHorizontal: 16, color: renk.yazi, fontFamily: yaziTipi[600], fontSize: 17 },
  tog: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  dugmeler: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btn: { flex: 1, minHeight: 48, borderRadius: 99, borderWidth: 1, borderColor: renk.cizgi, backgroundColor: renk.kart, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
});
