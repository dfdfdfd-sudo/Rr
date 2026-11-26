// Hareketler ve hazır antrenmanlar — reference/ritim-web.html içindeki EX ve PROG verisinden birebir aktarıldı.
// A ve B: figürün iki pozu (baş, omuz, kalça, dirsek, bilek, diz, ayak; arka uzuvlar isteğe bağlı).

export type Hareket = {
  n: string;
  m: string[];
  eq: string;
  lv: number;
  t: string;
  pat: string;
  A: string;
  B: string;
  st: string[];
  er: string[];
  ez?: string;
  hd?: string;
  prop?: string;
  load?: string;
};

export type Program = { id: string; n: string; w: string; lv: number; min: number; d: string; rest?: number; it: [string, number, number][] };

export const HAREKETLER: Record<string, Hareket> = {
  "pushup": {
    "n": "Şınav",
    "m": [
      "Göğüs",
      "Arka kol",
      "Omuz"
    ],
    "eq": "Yok",
    "lv": 2,
    "t": "reps",
    "pat": "push",
    "ez": "kneepush",
    "hd": "pike",
    "A": "79,53 72,56 42,71 72,72 72,88 27,79 12,86",
    "B": "80,73 72,76 42,81 62,82 72,88 27,84 12,86",
    "st": [
      "Eller omuz genişliğinde, vücut baştan topuğa tek çizgi.",
      "Göğsün yere bir yumruk kalana kadar dirsekleri 45° açıyla bük.",
      "Avuçlardan yeri itip başlangıca dön, nefesi iterken ver."
    ],
    "er": [
      "Kalçanın düşmesi ya da havaya kalkması",
      "Dirsekleri yanlara tam açmak (omzu zorlar)"
    ]
  },
  "kneepush": {
    "n": "Diz üstü şınav",
    "m": [
      "Göğüs",
      "Arka kol"
    ],
    "eq": "Yok",
    "lv": 1,
    "t": "reps",
    "pat": "push",
    "hd": "pushup",
    "A": "79,55 72,58 46,72 72,73 72,88 30,88 16,80",
    "B": "80,73 72,76 47,82 62,82 72,88 30,88 16,80",
    "st": [
      "Dizlerini yere koy, ayaklarını çaprazla.",
      "Dizden başa düz çizgiyi koruyarak göğsünü indir.",
      "Yeri iterek yukarı çık."
    ],
    "er": [
      "Kalçayı geride bırakıp sadece başı indirmek",
      "Hareketi yarım yapmak"
    ]
  },
  "pike": {
    "n": "Pike şınav",
    "m": [
      "Omuz",
      "Arka kol"
    ],
    "eq": "Yok",
    "lv": 3,
    "t": "reps",
    "pat": "push",
    "ez": "pushup",
    "A": "69,75 64,70 44,48 68,79 72,88 33,68 22,88",
    "B": "69,86 62,80 44,52 55,78 72,88 33,70 22,88",
    "st": [
      "Kalçanı yukarı kaldırıp ters V şekli yap.",
      "Başını ellerinin arasına doğru indir.",
      "Omuzlarınla iterek geri çık."
    ],
    "er": [
      "Sırtı yuvarlamak",
      "Başı ellerin önüne indirmek"
    ]
  },
  "squat": {
    "n": "Squat",
    "m": [
      "Ön bacak",
      "Kalça"
    ],
    "eq": "Yok",
    "lv": 1,
    "t": "reps",
    "pat": "legs",
    "hd": "lunge",
    "A": "50,18 50,27 50,52 60,28 70,28 52,70 50,88",
    "B": "55,35 50,43 38,63 62,44 74,44 58,66 50,88",
    "st": [
      "Ayaklar omuz genişliğinde, parmak uçları hafif dışa.",
      "Sandalyeye oturur gibi kalçayı geri ve aşağı it.",
      "Topuklardan güç alarak kalk."
    ],
    "er": [
      "Dizlerin içe kapanması",
      "Topukların yerden kalkması"
    ]
  },
  "lunge": {
    "n": "Lunge",
    "m": [
      "Ön bacak",
      "Kalça",
      "Denge"
    ],
    "eq": "Yok",
    "lv": 2,
    "t": "reps",
    "pat": "legs",
    "ez": "squat",
    "A": "50,18 50,27 50,52 44,40 47,50 57,70 62,88 46,40 49,50 44,70 38,88",
    "B": "50,30 50,39 50,62 44,52 47,62 64,70 66,88 46,52 49,62 42,84 28,88",
    "st": [
      "Bir adım öne at, gövde dik kalsın.",
      "İki dizi de yaklaşık 90° olana kadar in.",
      "Ön ayaktan iterek başlangıca dön, bacak değiştir."
    ],
    "er": [
      "Ön dizin parmak ucunu çok geçmesi",
      "Gövdenin öne eğilmesi"
    ]
  },
  "wallsit": {
    "n": "Duvarda oturma",
    "m": [
      "Ön bacak"
    ],
    "eq": "Duvar",
    "lv": 1,
    "t": "time",
    "pat": "legs",
    "prop": "wall",
    "A": "37,39 37,48 37,68 46,55 39,58 58,68 58,88",
    "B": "37,40 37,49 37,69 46,56 39,59 58,69 58,88",
    "st": [
      "Sırtını duvara yasla.",
      "Dizler 90° olana kadar kay.",
      "Süre bitene kadar pozisyonu koru."
    ],
    "er": [
      "Dizlerin ayak bileğinin önüne geçmesi",
      "Ellerle bacaktan destek almak"
    ]
  },
  "calf": {
    "n": "Baldır kaldırma",
    "m": [
      "Baldır"
    ],
    "eq": "Yok",
    "lv": 1,
    "t": "reps",
    "pat": "legs",
    "A": "50,18 50,27 50,52 50,40 51,53 50,70 50,86",
    "B": "50,13 50,22 50,47 50,35 51,48 50,65 50,81",
    "st": [
      "Dik dur, ayaklar kalça genişliğinde.",
      "Parmak uçlarında yüksel, 1 sn bekle.",
      "Kontrollü in."
    ],
    "er": [
      "Hızlı zıplar gibi yapmak",
      "Dizleri bükmek"
    ]
  },
  "bridge": {
    "n": "Kalça köprüsü",
    "m": [
      "Kalça",
      "Arka bacak"
    ],
    "eq": "Yok",
    "lv": 1,
    "t": "reps",
    "pat": "hinge",
    "A": "80,84 72,86 48,86 60,88 50,88 36,72 26,88",
    "B": "80,84 71,84 48,72 60,88 50,88 35,68 26,88",
    "st": [
      "Sırt üstü yat, dizler bükülü, ayaklar yerde.",
      "Kalçanı sıkarak yukarı it.",
      "Tepede 1 sn bekle, yavaş in."
    ],
    "er": [
      "Belden kavis yapmak",
      "Kalçayı sıkmadan sadece itmek"
    ]
  },
  "plank": {
    "n": "Plank",
    "m": [
      "Karın",
      "Omuz"
    ],
    "eq": "Yok",
    "lv": 1,
    "t": "time",
    "pat": "core",
    "hd": "climber",
    "A": "78,67 70,70 42,73 70,86 82,86 27,79 12,86",
    "B": "78,66 70,69 42,71 70,86 82,86 27,78 12,86",
    "st": [
      "Dirsekler omuzların altında.",
      "Karnını ve kalçanı sık, vücut tek çizgi.",
      "Nefesini tutmadan süre boyunca kal."
    ],
    "er": [
      "Kalçanın düşmesi",
      "Başı aşağı sarkıtmak"
    ]
  },
  "deadbug": {
    "n": "Dead bug",
    "m": [
      "Karın"
    ],
    "eq": "Yok",
    "lv": 1,
    "t": "reps",
    "pat": "core",
    "A": "75,81 64,84 40,84 64,72 64,60 40,70 28,70 62,72 62,60 38,70 26,70",
    "B": "75,81 64,84 40,84 73,76 84,80 26,80 12,82 62,72 62,60 38,70 26,70",
    "st": [
      "Sırt üstü, kollar yukarı, dizler 90°.",
      "Bir kolu ve karşı bacağı yere doğru uzat.",
      "Belini yere bastırarak geri getir, taraf değiştir."
    ],
    "er": [
      "Belin yerden kalkması",
      "Hızlı ve kontrolsüz yapmak"
    ]
  },
  "superman": {
    "n": "Superman",
    "m": [
      "Bel",
      "Sırt"
    ],
    "eq": "Yok",
    "lv": 1,
    "t": "reps",
    "pat": "pull",
    "A": "72,81 64,84 38,85 76,84 90,84 23,86 8,86",
    "B": "73,76 64,81 38,85 76,78 90,72 23,81 8,75",
    "st": [
      "Yüz üstü uzan, kollar önde.",
      "Kol ve bacakları aynı anda kaldır.",
      "2 sn tut, yavaşça indir."
    ],
    "er": [
      "Boynu geriye kırmak",
      "Ani hareketle sallanmak"
    ]
  },
  "climber": {
    "n": "Mountain climber",
    "m": [
      "Karın",
      "Kardiyo"
    ],
    "eq": "Yok",
    "lv": 2,
    "t": "time",
    "pat": "core",
    "ez": "plank",
    "A": "80,55 72,58 44,68 73,73 74,88 60,74 52,84 71,73 72,88 28,78 14,86",
    "B": "80,55 72,58 44,68 73,73 74,88 28,78 14,86 71,73 72,88 60,74 52,84",
    "st": [
      "Yüksek plank pozisyonunda başla.",
      "Dizleri sırayla göğsüne çek.",
      "Kalçayı sabit tutarak tempoyu koru."
    ],
    "er": [
      "Kalçayı havaya kaldırmak",
      "Omuzların ellerin gerisinde kalması"
    ]
  },
  "jack": {
    "n": "Jumping jack",
    "m": [
      "Kardiyo",
      "Tüm vücut"
    ],
    "eq": "Yok",
    "lv": 1,
    "t": "time",
    "pat": "cardio",
    "A": "50,17 50,26 50,52 43,38 41,50 46,70 44,88 57,38 59,50 54,70 56,88",
    "B": "50,15 50,24 50,50 39,16 35,6 41,69 33,87 61,16 65,6 59,69 67,87",
    "st": [
      "Ayaklar bitişik, kollar yanda.",
      "Zıplayarak bacakları aç, kolları başın üstünde birleştir.",
      "Zıplayarak başlangıca dön."
    ],
    "er": [
      "Topukların sert yere çarpması",
      "Kolları yarıda bırakmak"
    ]
  },
  "dips": {
    "n": "Sandalye dips",
    "m": [
      "Arka kol",
      "Göğüs"
    ],
    "eq": "Sandalye",
    "lv": 2,
    "t": "reps",
    "pat": "push",
    "prop": "chair",
    "ez": "kneepush",
    "A": "46,31 46,40 48,64 41,50 40,60 70,65 86,88",
    "B": "46,45 46,54 48,77 33,54 40,60 69,73 86,88",
    "st": [
      "Ellerini sandalyenin kenarına koy, bacaklar önde.",
      "Dirsekleri geriye bükerek in.",
      "Avuçlardan iterek kalk."
    ],
    "er": [
      "Dirsekleri yanlara açmak",
      "Omuzları kulaklara kadar çekmek"
    ]
  },
  "pullup": {
    "n": "Barfiks",
    "m": [
      "Sırt",
      "Pazı"
    ],
    "eq": "Bar",
    "lv": 3,
    "t": "reps",
    "pat": "pull",
    "prop": "bar",
    "ez": "superman",
    "A": "50,27 50,36 50,60 44,26 43,15 52,74 50,85 56,26 57,15 48,74 50,85",
    "B": "50,9 50,19 50,43 36,22 43,15 55,56 50,68 64,22 57,15 45,56 50,68",
    "st": [
      "Barı omuz genişliğinde, avuç önde tut.",
      "Kürek kemiklerini sıkıp çeneni barın üstüne çek.",
      "Kontrollü in, kolları tam aç."
    ],
    "er": [
      "Sallanarak güç almak",
      "Yarım tekrarla inmek"
    ]
  },
  "bench": {
    "n": "Bench press",
    "m": [
      "Göğüs",
      "Arka kol"
    ],
    "eq": "Halter",
    "lv": 2,
    "t": "reps",
    "pat": "push",
    "prop": "bench",
    "load": "bar",
    "A": "68,58 60,61 36,62 60,44 60,32 22,66 16,88",
    "B": "68,58 60,61 36,62 52,58 60,50 22,66 16,88",
    "st": [
      "Sehpaya uzan, ayaklar yerde.",
      "Barı göğsün ortasına kontrollü indir.",
      "Güçlü şekilde yukarı it."
    ],
    "er": [
      "Kalçayı sehpadan kaldırmak",
      "Barı göğse çarptırıp sektirmek"
    ]
  },
  "row": {
    "n": "Dambıl row",
    "m": [
      "Sırt",
      "Pazı"
    ],
    "eq": "Dambıl",
    "lv": 2,
    "t": "reps",
    "pat": "pull",
    "load": "db",
    "A": "70,44 62,48 40,54 62,62 62,74 46,72 42,88",
    "B": "70,44 62,48 40,54 52,50 58,60 46,72 42,88",
    "st": [
      "Kalçadan öne eğil, sırt düz.",
      "Dambılı kalçana doğru çek.",
      "Yavaşça indir."
    ],
    "er": [
      "Sırtı yuvarlamak",
      "Gövdeyi döndürerek çekmek"
    ]
  },
  "ohp": {
    "n": "Omuz press",
    "m": [
      "Omuz",
      "Arka kol"
    ],
    "eq": "Halter",
    "lv": 2,
    "t": "reps",
    "pat": "push",
    "load": "bar",
    "A": "50,18 50,27 50,52 58,36 56,26 50,70 50,88",
    "B": "50,18 50,27 50,52 55,14 52,4 50,70 50,88",
    "st": [
      "Barı köprücük hizasında tut.",
      "Başın üstüne düz yukarı it.",
      "Kontrollü indir."
    ],
    "er": [
      "Belden geriye kaykılmak",
      "Dirsekleri çok öne atmak"
    ]
  },
  "curl": {
    "n": "Biceps curl",
    "m": [
      "Pazı"
    ],
    "eq": "Dambıl",
    "lv": 1,
    "t": "reps",
    "pat": "pull",
    "load": "db",
    "A": "50,18 50,27 50,52 51,40 52,54 50,70 50,88",
    "B": "50,18 50,27 50,52 51,40 58,32 50,70 50,88",
    "st": [
      "Dirsekler gövdeye yakın.",
      "Dambılı omza doğru kaldır.",
      "Yavaşça indir."
    ],
    "er": [
      "Gövdeyi sallamak",
      "Dirsekleri öne kaydırmak"
    ]
  },
  "gsquat": {
    "n": "Halter squat",
    "m": [
      "Ön bacak",
      "Kalça"
    ],
    "eq": "Halter",
    "lv": 2,
    "t": "reps",
    "pat": "legs",
    "load": "bar",
    "ez": "squat",
    "A": "50,18 50,27 50,52 44,30 50,26 52,70 50,88",
    "B": "55,35 50,43 38,63 46,46 52,42 58,66 50,88",
    "st": [
      "Barı üst sırtına yerleştir.",
      "Kalçayı geri iterek paralele kadar in.",
      "Topuklardan iterek kalk."
    ],
    "er": [
      "Dizlerin içe kapanması",
      "Sırtın yuvarlanması"
    ]
  },
  "deadlift": {
    "n": "Deadlift",
    "m": [
      "Arka bacak",
      "Kalça",
      "Sırt"
    ],
    "eq": "Halter",
    "lv": 3,
    "t": "reps",
    "pat": "hinge",
    "load": "bar",
    "ez": "bridge",
    "A": "64,52 57,58 38,58 58,70 60,82 50,72 46,88",
    "B": "50,20 49,28 48,52 50,42 50,56 48,70 46,88",
    "st": [
      "Bar ayak ortasının üstünde, sırt düz.",
      "Bacaklarla iterek barı bacaklara yakın kaldır.",
      "Kalçayı öne iterek dik dur, kontrollü indir."
    ],
    "er": [
      "Sırtı yuvarlamak",
      "Barı vücuttan uzak tutmak"
    ]
  },
  "downdog": {
    "n": "Aşağı bakan köpek",
    "m": [
      "Esneklik",
      "Omuz",
      "Arka bacak"
    ],
    "eq": "Mat",
    "lv": 1,
    "t": "time",
    "pat": "yoga",
    "A": "69,77 64,70 44,46 68,79 74,88 33,67 22,88",
    "B": "69,79 64,72 44,43 68,81 74,88 33,65 22,88",
    "st": [
      "Dört ayak pozisyonundan kalçanı yukarı kaldır.",
      "Avuçlarla yeri it, topukları yere doğru bırak.",
      "Boynunu gevşet, derin ve yavaş nefes al."
    ],
    "er": [
      "Sırtı yuvarlamak (gerekirse dizleri bük)",
      "Omuzları kulaklara sıkıştırmak"
    ]
  },
  "warrior": {
    "n": "Savaşçı II",
    "m": [
      "Bacak",
      "Denge",
      "Kalça"
    ],
    "eq": "Mat",
    "lv": 1,
    "t": "time",
    "pat": "yoga",
    "A": "50,18 50,27 50,52 38,27 26,27 62,66 72,88 62,27 74,27 38,70 28,88",
    "B": "50,19 50,28 50,53 38,28 26,28 62,67 72,88 62,28 74,28 38,71 28,88",
    "st": [
      "Ayakları geniş aç, ön ayağı dışa çevir.",
      "Ön dizini ayak bileğinin üstüne gelecek şekilde bük.",
      "Kolları yere paralel uzat, ön elinin ötesine bak."
    ],
    "er": [
      "Ön dizin içe düşmesi",
      "Gövdeyi öne eğmek"
    ]
  },
  "tree": {
    "n": "Ağaç duruşu",
    "m": [
      "Denge",
      "Bacak"
    ],
    "eq": "Mat",
    "lv": 1,
    "t": "time",
    "pat": "yoga",
    "A": "50,16 50,25 50,50 44,12 49,2 50,69 50,88 56,12 51,2 60,62 51,66",
    "B": "50,17 50,26 50,51 44,13 49,3 50,70 50,88 56,13 51,3 60,63 51,67",
    "st": [
      "Tek ayak üzerinde dur, diğer tabanı baldır ya da uyluğun iç tarafına koy.",
      "Elleri göğüste birleştir ya da yukarı uzat.",
      "Sabit bir noktaya bak, karnını hafif sık."
    ],
    "er": [
      "Ayağı dizin tam üstüne bastırmak",
      "Nefesi tutmak"
    ]
  },
  "cobra": {
    "n": "Kobra",
    "m": [
      "Sırt",
      "Esneklik"
    ],
    "eq": "Mat",
    "lv": 1,
    "t": "time",
    "pat": "yoga",
    "A": "72,82 64,85 38,86 66,88 72,88 23,87 8,87",
    "B": "76,66 68,72 40,85 68,80 70,88 24,87 8,87",
    "st": [
      "Yüz üstü uzan, ellerin omuz altında.",
      "Nefes alırken göğsünü yerden kaldır.",
      "Kalça ve bacaklar yerde kalsın, omuzlar geride."
    ],
    "er": [
      "Belinde ağrı olacak kadar zorlamak",
      "Boynu geriye atmak"
    ]
  },
  "child": {
    "n": "Çocuk pozu",
    "m": [
      "Esneklik",
      "Rahatlama"
    ],
    "eq": "Mat",
    "lv": 1,
    "t": "time",
    "pat": "yoga",
    "A": "66,84 58,80 34,72 70,86 84,86 46,88 26,88",
    "B": "66,82 58,78 34,71 70,85 84,86 46,88 26,88",
    "st": [
      "Dizlerinin üstüne otur, kalçanı topuklara bırak.",
      "Gövdeni öne uzatıp alnını yere koy.",
      "Kolları önde uzat ve sırtına nefes ver."
    ],
    "er": [
      "Kalçayı topuklardan kaldırmak",
      "Omuzları gergin tutmak"
    ]
  },
  "catcow": {
    "n": "Kedi - inek",
    "m": [
      "Sırt",
      "Esneklik"
    ],
    "eq": "Mat",
    "lv": 1,
    "t": "time",
    "pat": "yoga",
    "A": "74,58 66,64 36,64 66,76 66,88 36,76 36,88",
    "B": "72,74 66,61 36,61 66,75 66,88 36,75 36,88",
    "st": [
      "Eller omuz, dizler kalça altında.",
      "Nefes alırken göğsü öne, başı yukarı (inek).",
      "Nefes verirken sırtı yuvarla, çeneyi göğse (kedi)."
    ],
    "er": [
      "Hızlı yapmak",
      "Kolları kilitleyip omuzları çökertmek"
    ]
  }
};

export const PROGRAMLAR: Program[] = [
  {
    "id": "ev-a",
    "n": "Tüm vücut A",
    "w": "Ev",
    "lv": 1,
    "min": 25,
    "d": "Yeni başlayanlar için temel kuvvet",
    "it": [
      [
        "kneepush",
        3,
        8
      ],
      [
        "squat",
        3,
        12
      ],
      [
        "bridge",
        3,
        12
      ],
      [
        "plank",
        3,
        30
      ],
      [
        "superman",
        3,
        10
      ]
    ]
  },
  {
    "id": "ev-b",
    "n": "Tüm vücut B",
    "w": "Ev",
    "lv": 2,
    "min": 30,
    "d": "Sandalye ve duvarla, ekipmansız",
    "it": [
      [
        "pushup",
        3,
        10
      ],
      [
        "lunge",
        3,
        10
      ],
      [
        "dips",
        3,
        10
      ],
      [
        "deadbug",
        3,
        10
      ],
      [
        "wallsit",
        3,
        40
      ]
    ]
  },
  {
    "id": "hiit",
    "n": "10 dakika HIIT",
    "w": "Ev",
    "lv": 2,
    "min": 12,
    "d": "Kısa ve terletici, kalori yakımı",
    "rest": 20,
    "it": [
      [
        "jack",
        3,
        40
      ],
      [
        "climber",
        3,
        30
      ],
      [
        "squat",
        3,
        15
      ],
      [
        "plank",
        3,
        30
      ]
    ]
  },
  {
    "id": "park",
    "n": "Park kalistenik",
    "w": "Park",
    "lv": 3,
    "min": 35,
    "d": "Barfiks barı olan her yerde",
    "it": [
      [
        "pullup",
        4,
        5
      ],
      [
        "pike",
        3,
        8
      ],
      [
        "lunge",
        3,
        12
      ],
      [
        "climber",
        3,
        30
      ]
    ]
  },
  {
    "id": "gym-u",
    "n": "Salon · Üst vücut",
    "w": "Salon",
    "lv": 2,
    "min": 45,
    "d": "Göğüs, sırt, omuz ve kollar",
    "rest": 90,
    "it": [
      [
        "bench",
        4,
        8
      ],
      [
        "row",
        4,
        10
      ],
      [
        "ohp",
        3,
        10
      ],
      [
        "curl",
        3,
        12
      ]
    ]
  },
  {
    "id": "gym-l",
    "n": "Salon · Alt vücut",
    "w": "Salon",
    "lv": 2,
    "min": 45,
    "d": "Bacak ve kalça kuvveti",
    "rest": 90,
    "it": [
      [
        "gsquat",
        4,
        8
      ],
      [
        "deadlift",
        3,
        6
      ],
      [
        "lunge",
        3,
        10
      ],
      [
        "calf",
        4,
        15
      ]
    ]
  },
  {
    "id": "yoga",
    "n": "15 dakika yoga",
    "w": "Ev",
    "lv": 1,
    "min": 15,
    "d": "Esneklik, denge ve rahatlama",
    "rest": 10,
    "it": [
      [
        "catcow",
        2,
        40
      ],
      [
        "downdog",
        2,
        40
      ],
      [
        "cobra",
        2,
        30
      ],
      [
        "warrior",
        2,
        30
      ],
      [
        "tree",
        2,
        30
      ],
      [
        "child",
        1,
        60
      ]
    ]
  }
];

export const SEVIYE_AD = ['', 'Başlangıç', 'Orta', 'İleri'];
