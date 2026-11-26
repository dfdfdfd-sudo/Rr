# 🍷 Şarap Kartı Agent'ı

Bir şarabın adını yazın ya da etiketinin fotoğrafını atın. Agent şarabı internetten araştırır ve iki şey hazırlar:

1. **Detaylı bilgi dosyası** (`detay.md`): garson eğitimi için üretici, bölge, üzüm, tadım, servis, yemek eşleşmesi, müşteri soruları ve kaynaklar.
2. **Minik garson kartı** (`kart.pdf`, A6 boyutunda): yazdırılıp menünün yanında veya barda tutulabilir.

## Nasıl kullanılır?
Bu repo açıkken Claude Code'a şunlardan birini yazın:

```
/sarap-karti Kavaklıdere Yakut 2021
```
veya etiketin fotoğrafını ekleyip: `bu şarabın garson kartını hazırla`

Sonuçlar `saraplar/<şarap-adı>/` klasörüne kaydedilir:

| Dosya | Ne işe yarar |
|---|---|
| `veri.json` | Araştırılan bilgiler (elle düzeltilebilir) |
| `detay.md` | Uzun eğitim notu |
| `kart.html` / `kart.pdf` / `kart.png` | Yazdırılacak kart |

## Kartta bir bilgiyi elle düzeltmek
`veri.json` dosyasını açın, istediğiniz alanı değiştirin ve şu komutu çalıştırın. Yapay zekâ kullanılmaz, maliyeti sıfırdır:
```bash
node araclar/kart-olustur.js saraplar/<şarap-adı>/veri.json
```

## Kart tasarımını değiştirmek
Renkler, yazı tipi ve düzen `sablon/kart.html` dosyasındadır. Şarap türüne göre kartın üst şerit rengi değişir: kırmızı, beyaz, roze, köpüklü, tatlı.

## Maliyet neden düşük?
- Yapay zekâ yalnızca **araştırma ve yazma** işini yapar ve şarap başına en fazla 3–5 arama ile sınırlıdır.
- Kart tasarımı ve PDF üretimi **bedava bir script** ile yapılır.
- Bir şarap bir kez araştırılır, sonra kartı istediğiniz kadar yeniden basabilirsiniz.

## Önemli
- Agent bulamadığı bilgiyi **uydurmaz**, "Doğrulanmadı" yazar. Servis öncesi etiketle kontrol edin.
- Kartlar **iç kullanım** içindir (personel eğitimi). Alkollü içki tanıtım ve reklam kısıtlamaları nedeniyle müşteriye yönelik reklam materyali olarak kullanmayın.
