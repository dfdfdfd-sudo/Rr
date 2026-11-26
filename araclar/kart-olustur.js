#!/usr/bin/env node
// Şarap kartı üretici. Yapay zekâ KULLANMAZ: veri.json + şablon -> kart.html (+ kart.pdf).
// Kullanım: node araclar/kart-olustur.js saraplar/<kisa-ad>/veri.json
const fs = require('fs');
const path = require('path');

const veriYolu = process.argv[2];
if (!veriYolu) {
  console.error('Kullanım: node araclar/kart-olustur.js saraplar/<kisa-ad>/veri.json');
  process.exit(1);
}

const veri = JSON.parse(fs.readFileSync(veriYolu, 'utf8'));
const sablon = fs.readFileSync(path.join(__dirname, '..', 'sablon', 'kart.html'), 'utf8');

// Şarap türüne göre kartın renk ve etiketi
const TURLER = {
  kirmizi: { ad: 'Kırmızı', renk: '#7b1e2b' },
  beyaz:   { ad: 'Beyaz',   renk: '#a08a2c' },
  roze:    { ad: 'Roze',    renk: '#c25b73' },
  kopuklu: { ad: 'Köpüklü', renk: '#3f6a7a' },
  tatli:   { ad: 'Tatlı',   renk: '#a0602c' },
};
const tur = TURLER[veri.tur] || { ad: veri.tur || 'Şarap', renk: '#5a4a42' };

// HTML'e güvenli yazmak için özel karakterleri kaçır
const kacir = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// "tadim.goz" gibi noktalı yolları veriden okur
const oku = (yol) => yol.split('.').reduce((o, k) => (o == null ? o : o[k]), veri);

const ekstra = { tur_adi: tur.ad, renk: tur.renk };

const html = sablon.replace(/\{\{([\w.]+)\}\}/g, (_, alan) => {
  if (alan in ekstra) return kacir(ekstra[alan]);
  const deger = oku(alan);
  if (Array.isArray(deger)) return deger.map((x) => `<li>${kacir(x)}</li>`).join('');
  return kacir(deger ?? '');
});

const klasor = path.dirname(veriYolu);
const htmlYolu = path.join(klasor, 'kart.html');
fs.writeFileSync(htmlYolu, html);
console.log('✓ HTML kart:', htmlYolu);

// PDF: Playwright varsa üret, yoksa HTML'i tarayıcıdan yazdırmak yeterli
(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch {
    console.log('ℹ Playwright yok; kart.html dosyasını tarayıcıda açıp Yazdır > PDF yapabilirsiniz.');
    return;
  }
  const tarayici = await chromium.launch();
  const sayfa = await tarayici.newPage();
  await sayfa.goto('file://' + path.resolve(htmlYolu));
  const pdfYolu = path.join(klasor, 'kart.pdf');
  await sayfa.pdf({ path: pdfYolu, format: 'A6', printBackground: true, preferCSSPageSize: true });
  await sayfa.screenshot({ path: path.join(klasor, 'kart.png'), clip: await sayfa.locator('.kart').boundingBox() });
  await tarayici.close();
  console.log('✓ PDF kart:', pdfYolu);
})();
