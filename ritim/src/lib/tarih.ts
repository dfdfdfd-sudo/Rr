// Tarih yardımcıları. Gün anahtarı: "2026-11-26" (yerel saat).

export const GUN_UZUN = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
export const GUN_KISA = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
export const AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

const iki = (n: number) => String(n).padStart(2, '0');

export function anahtar(d: Date): string {
  return `${d.getFullYear()}-${iki(d.getMonth() + 1)}-${iki(d.getDate())}`;
}

export function bugun(): string {
  return anahtar(new Date());
}

export function tarihten(k: string): Date {
  const [y, m, g] = k.split('-').map(Number);
  return new Date(y, m - 1, g);
}

export function gunEkle(k: string, n: number): string {
  const d = tarihten(k);
  d.setDate(d.getDate() + n);
  return anahtar(d);
}

/** Pazartesiden başlayan haftanın 7 günü. */
export function haftaGunleri(k: string): string[] {
  const d = tarihten(k);
  const fark = (d.getDay() + 6) % 7; // Pazartesi = 0
  const pzt = gunEkle(k, -fark);
  return Array.from({ length: 7 }, (_, i) => gunEkle(pzt, i));
}

/** Bu gün dahil geriye doğru 7 gün (eskiden yeniye). */
export function son7(k: string): string[] {
  return Array.from({ length: 7 }, (_, i) => gunEkle(k, i - 6));
}

export function selam(saat = new Date().getHours()): string {
  return saat < 5 ? 'İyi geceler' : saat < 12 ? 'Günaydın' : saat < 18 ? 'İyi günler' : 'İyi akşamlar';
}

export function uzunTarih(k: string): string {
  const d = tarihten(k);
  return `${GUN_UZUN[d.getDay()]}, ${d.getDate()} ${AY[d.getMonth()]}`;
}

/** 1,5 gibi Türkçe ondalık. */
export function sayi(n: number, basamak = 1): string {
  return n.toLocaleString('tr-TR', { maximumFractionDigits: basamak, minimumFractionDigits: 0 });
}
