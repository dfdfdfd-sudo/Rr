#!/usr/bin/env node
// Şarap verisini doğrular ve veritabanına yüklenecek SQL'i üretir. Yapay zekâ KULLANMAZ.
// Kullanım: node araclar/veritabani-hazirla.js
//   Girdi:  veritabani/saraplar.json
//   Çıktı:  veritabani/seed.sql  (sema.sql'den SONRA çalıştırılır)
const fs = require('fs');
const path = require('path');

const KOK = path.join(__dirname, '..', 'veritabani');
const saraplar = JSON.parse(fs.readFileSync(path.join(KOK, 'saraplar.json'), 'utf8'));

// Bilinen üzümler: renk, köken, yerli mi?
const UZUMLER = {
  'Öküzgözü':           { renk: 'kirmizi', koken: 'Elazığ', yerli: true },
  'Boğazkere':          { renk: 'kirmizi', koken: 'Diyarbakır', yerli: true },
  'Kalecik Karası':     { renk: 'kirmizi', koken: 'Kalecik, Ankara', yerli: true },
  'Karasakız':          { renk: 'kirmizi', koken: 'Bozcaada, Çanakkale', yerli: true },
  'Çalkarası':          { renk: 'kirmizi', koken: 'Denizli', yerli: true },
  'Narince':            { renk: 'beyaz',   koken: 'Tokat', yerli: true },
  'Emir':               { renk: 'beyaz',   koken: 'Kapadokya', yerli: true },
  'Sultaniye':          { renk: 'beyaz',   koken: 'Manisa, Denizli', yerli: true },
  'Cabernet Sauvignon': { renk: 'kirmizi', koken: 'Bordeaux, Fransa', yerli: false },
  'Merlot':             { renk: 'kirmizi', koken: 'Bordeaux, Fransa', yerli: false },
  'Syrah':              { renk: 'kirmizi', koken: 'Rhône, Fransa', yerli: false },
};
const URETICILER = {
  'Kavaklıdere':     { bolge: 'Ankara', kurulus: 1929 },
  'Doluca':          { bolge: 'Trakya / Ankara', kurulus: 1926 },
  'Kayra':           { bolge: 'Elazığ / Trakya', kurulus: null },
  'Urla Şarapçılık': { bolge: 'Urla, İzmir', kurulus: null },
  'Suvla':           { bolge: 'Eceabat, Çanakkale', kurulus: null },
  'Vinkara':         { bolge: 'Kalecik, Ankara', kurulus: null },
  'Turasan':         { bolge: 'Ürgüp, Nevşehir', kurulus: 1943 },
};

const TURLER = ['kirmizi', 'beyaz', 'roze', 'kopuklu', 'tatli'];
const slug = (s) => s.toLocaleLowerCase('tr')
  .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u').replace(/â/g, 'a')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------- Doğrulama ----------
const hatalar = [];
const uyarilar = [];
const idler = new Set();
for (const s of saraplar) {
  const h = (m) => hatalar.push(`${s.id || '(id yok)'}: ${m}`);
  for (const alan of ['id', 'ad', 'uretici', 'tur', 'ozet']) if (!s[alan]) h(`'${alan}' boş`);
  if (idler.has(s.id)) h('aynı id iki kez kullanılmış'); idler.add(s.id);
  if (s.id !== slug(`${s.uretici} ${s.ad}`)) uyarilar.push(`${s.id}: id, üretici+ad'dan beklenen '${slug(`${s.uretici} ${s.ad}`)}' ile aynı değil`);
  if (!TURLER.includes(s.tur)) h(`geçersiz tür '${s.tur}'`);
  if (!URETICILER[s.uretici]) h(`bilinmeyen üretici '${s.uretici}' (URETICILER listesine ekleyin)`);
  for (const u of s.uzumler || []) {
    if (!UZUMLER[u.ad]) h(`bilinmeyen üzüm '${u.ad}' (UZUMLER listesine ekleyin)`);
    if (u.oran != null && (u.oran < 1 || u.oran > 100)) h(`'${u.ad}' oranı 1–100 arası olmalı`);
  }
  const toplam = (s.uzumler || []).reduce((t, u) => t + (u.oran || 0), 0);
  if (toplam > 100) h(`üzüm oranları toplamı ${toplam} (100'ü geçemez)`);
  for (const [k, v] of Object.entries(s.tat_profili || {})) if (!(Number.isInteger(v) && v >= 1 && v <= 5)) h(`tat_profili.${k} 1–5 arası tam sayı olmalı`);
  for (const k of ['goz', 'burun', 'damak']) if (!s.tadim?.[k]) h(`tadim.${k} boş`);
  if (!(s.kaynaklar || []).length) h('en az bir kaynak gerekli');
  for (const u of s.kaynaklar || []) if (!/^https:\/\//.test(u)) h(`kaynak https ile başlamalı: ${u}`);
  if (!(s.etiket_kelimeleri || []).length) h('etiket_kelimeleri boş (etiket eşleştirme için gerekli)');
  if (s.alkol == null && !s.dogrulanmayan?.some((d) => d.startsWith('alkol'))) uyarilar.push(`${s.id}: alkol boş ama 'dogrulanmayan' listesinde değil`);
}

if (uyarilar.length) console.log('⚠ Uyarılar:\n  ' + uyarilar.join('\n  '));
if (hatalar.length) { console.error('✗ Hatalar:\n  ' + hatalar.join('\n  ')); process.exit(1); }

// ---------- SQL üretimi ----------
const q = (v) => v == null ? 'null' : `'${String(v).replace(/'/g, "''")}'`;
const dizi = (a) => `array[${(a || []).map(q).join(', ')}]::text[]`;
const json = (o) => `${q(JSON.stringify(o || {}))}::jsonb`;

const satirlar = ['-- Otomatik üretildi: node araclar/veritabani-hazirla.js — elle düzenlemeyin.', 'begin;', ''];

const kullanilanUreticiler = [...new Set(saraplar.map((s) => s.uretici))];
for (const ad of kullanilanUreticiler) {
  const u = URETICILER[ad];
  satirlar.push(`insert into ureticiler (id, ad, bolge, kurulus) values (${q(slug(ad))}, ${q(ad)}, ${q(u.bolge)}, ${u.kurulus ?? 'null'}) on conflict (id) do update set ad = excluded.ad, bolge = excluded.bolge, kurulus = excluded.kurulus;`);
}
satirlar.push('');
const kullanilanUzumler = [...new Set(saraplar.flatMap((s) => s.uzumler.map((u) => u.ad)))];
for (const ad of kullanilanUzumler) {
  const u = UZUMLER[ad];
  satirlar.push(`insert into uzumler (id, ad, renk, koken, yerli) values (${q(slug(ad))}, ${q(ad)}, ${q(u.renk)}, ${q(u.koken)}, ${u.yerli}) on conflict (id) do update set ad = excluded.ad, renk = excluded.renk, koken = excluded.koken, yerli = excluded.yerli;`);
}
satirlar.push('');
for (const s of saraplar) {
  const t = s.tat_profili || {};
  satirlar.push(`insert into saraplar (id, uretici_id, ad, tur, stil, bolge_cografi, bolge_alt, alkol, fici, tadim, servis, eslesme, ozet, oduller, govde, tanen, asit, tatlilik, etiket_kelimeleri, dogrulanmayan, kaynaklar)
values (${q(s.id)}, ${q(slug(s.uretici))}, ${q(s.ad)}, ${q(s.tur)}, ${q(s.stil)}, ${q(s.bolge?.cografi)}, ${q(s.bolge?.alt)}, ${q(s.alkol)}, ${q(s.fici)}, ${json(s.tadim)}, ${json(s.servis)}, ${dizi(s.eslesme)}, ${q(s.ozet)}, ${dizi(s.oduller)}, ${t.govde ?? 'null'}, ${t.tanen ?? 'null'}, ${t.asit ?? 'null'}, ${t.tatlilik ?? 'null'}, ${dizi(s.etiket_kelimeleri)}, ${dizi(s.dogrulanmayan)}, ${dizi(s.kaynaklar)})
on conflict (id) do update set uretici_id = excluded.uretici_id, ad = excluded.ad, tur = excluded.tur, stil = excluded.stil, bolge_cografi = excluded.bolge_cografi, bolge_alt = excluded.bolge_alt, alkol = excluded.alkol, fici = excluded.fici, tadim = excluded.tadim, servis = excluded.servis, eslesme = excluded.eslesme, ozet = excluded.ozet, oduller = excluded.oduller, govde = excluded.govde, tanen = excluded.tanen, asit = excluded.asit, tatlilik = excluded.tatlilik, etiket_kelimeleri = excluded.etiket_kelimeleri, dogrulanmayan = excluded.dogrulanmayan, kaynaklar = excluded.kaynaklar, guncellendi = now();`);
  satirlar.push(`delete from sarap_uzumleri where sarap_id = ${q(s.id)};`);
  for (const u of s.uzumler) satirlar.push(`insert into sarap_uzumleri (sarap_id, uzum_id, oran) values (${q(s.id)}, ${q(slug(u.ad))}, ${u.oran ?? 'null'});`);
  satirlar.push('');
}
satirlar.push('commit;', '');

fs.writeFileSync(path.join(KOK, 'seed.sql'), satirlar.join('\n'));
const yerli = kullanilanUzumler.filter((u) => UZUMLER[u].yerli).length;
console.log(`✓ ${saraplar.length} şarap, ${kullanilanUreticiler.length} üretici, ${kullanilanUzumler.length} üzüm (${yerli} yerli) doğrulandı.`);
console.log('✓ SQL yazıldı: veritabani/seed.sql');
