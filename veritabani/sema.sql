-- ============================================================
--  Şarap uygulaması — veritabanı şeması (Supabase / PostgreSQL)
--
--  Basit anlatım:
--   • ureticiler / saraplar / uzumler  → herkesin okuduğu "ansiklopedi"
--   • profiller / puanlar / yorumlar / sarap_listem → kullanıcıya ait veriler
--   • bildirimler → uygunsuz yorum şikâyetleri (Apple kuralı 1.2 için zorunlu)
--   • taramalar → etiket okutma kayıtları (hangi şarap bulunamadı, öğrenmek için)
-- ============================================================

create extension if not exists pg_trgm;   -- "benzer yazılış" araması (etiket eşleştirme için)
create extension if not exists unaccent;  -- ş/ı/ğ gibi harfleri yok sayarak arama

-- ---------- Ansiklopedi ----------

create table ureticiler (
  id          text primary key,                 -- ör. 'kavaklidere'
  ad          text not null,                    -- ör. 'Kavaklıdere'
  bolge       text,
  kurulus     int,
  web         text,
  olusturuldu timestamptz not null default now()
);

create table uzumler (
  id    text primary key,                       -- ör. 'okuzgozu'
  ad    text not null unique,                   -- ör. 'Öküzgözü'
  renk  text check (renk in ('kirmizi', 'beyaz')),
  koken text,                                   -- ör. 'Elazığ'
  yerli boolean not null default false          -- Türkiye'ye özgü mü?
);

create table saraplar (
  id                text primary key,           -- ör. 'kavaklidere-yakut'
  uretici_id        text not null references ureticiler(id),
  ad                text not null,
  tur               text not null check (tur in ('kirmizi', 'beyaz', 'roze', 'kopuklu', 'tatli')),
  stil              text,                       -- kuru, yarı tatlı, tatlı
  bolge_cografi     text,                       -- Ege, Trakya, İç Anadolu...
  bolge_alt         text,                       -- Urla, Kalecik, Elazığ...
  alkol             text,                       -- metin: "%13,5–14 (yıla göre)" gibi aralıklar olabilir
  fici              text,
  tadim             jsonb not null default '{}',  -- {goz, burun, damak}
  servis            jsonb not null default '{}',  -- {sicaklik, kadeh, dekant}
  eslesme           text[] not null default '{}',
  ozet              text,
  oduller           text[] not null default '{}',
  -- Tat profili 1–5: "zevk profili" ve "benzer şaraplar" önerileri bunlarla hesaplanır
  govde             smallint check (govde between 1 and 5),
  tanen             smallint check (tanen between 1 and 5),
  asit              smallint check (asit between 1 and 5),
  tatlilik          smallint check (tatlilik between 1 and 5),
  etiket_kelimeleri text[] not null default '{}', -- etiketten okunan yazıyla eşleştirme için
  dogrulanmayan     text[] not null default '{}', -- kaynakta bulunamayan / çelişkili alanlar
  kaynaklar         text[] not null default '{}',
  durum             text not null default 'yayinda' check (durum in ('taslak', 'yayinda', 'gizli')),
  ekleyen           text not null default 'agent' check (ekleyen in ('agent', 'editor', 'kullanici')),
  -- Topluluk puanı özeti (puanlar tablosundan tetikleyiciyle güncellenir)
  puan_ortalama     numeric(2,1),
  puan_sayisi       int not null default 0,
  olusturuldu       timestamptz not null default now(),
  guncellendi       timestamptz not null default now()
);

create table sarap_uzumleri (
  sarap_id text not null references saraplar(id) on delete cascade,
  uzum_id  text not null references uzumler(id),
  oran     smallint check (oran between 1 and 100),   -- bilinmiyorsa null
  primary key (sarap_id, uzum_id)
);

-- Etiket eşleştirme ve arama için indeksler
create index saraplar_ad_trgm on saraplar using gin (ad gin_trgm_ops);
create index saraplar_etiket_idx on saraplar using gin (etiket_kelimeleri);
create index saraplar_tur_idx on saraplar (tur);

-- ---------- Kullanıcı verileri ----------

create table profiller (
  id          uuid primary key references auth.users(id) on delete cascade,
  kullanici_adi text unique,
  yas_onayi   boolean not null default false,   -- 18+ onayı (zorunlu)
  olusturuldu timestamptz not null default now()
);

create table puanlar (
  kullanici_id uuid not null references profiller(id) on delete cascade,
  sarap_id     text not null references saraplar(id) on delete cascade,
  yil          smallint,                         -- içilen kuşak (isteğe bağlı)
  puan         numeric(2,1) not null check (puan between 1 and 5 and (puan * 2) = floor(puan * 2)), -- 1, 1.5 ... 5
  olusturuldu  timestamptz not null default now(),
  primary key (kullanici_id, sarap_id)
);

create table yorumlar (
  id           bigint generated always as identity primary key,
  kullanici_id uuid not null references profiller(id) on delete cascade,
  sarap_id     text not null references saraplar(id) on delete cascade,
  metin        text not null check (char_length(metin) between 2 and 1000),
  durum        text not null default 'yayinda' check (durum in ('yayinda', 'incelemede', 'kaldirildi')),
  olusturuldu  timestamptz not null default now()
);

create table sarap_listem (
  kullanici_id uuid not null references profiller(id) on delete cascade,
  sarap_id     text not null references saraplar(id) on delete cascade,
  liste        text not null check (liste in ('ictiklerim', 'istek', 'tekrar_alirim')),
  not_metni    text,
  olusturuldu  timestamptz not null default now(),
  primary key (kullanici_id, sarap_id, liste)
);

create table engellemeler (
  engelleyen uuid not null references profiller(id) on delete cascade,
  engellenen uuid not null references profiller(id) on delete cascade,
  primary key (engelleyen, engellenen)
);

create table bildirimler (
  id           bigint generated always as identity primary key,
  bildiren_id  uuid not null references profiller(id) on delete cascade,
  yorum_id     bigint not null references yorumlar(id) on delete cascade,
  neden        text not null,
  durum        text not null default 'acik' check (durum in ('acik', 'incelendi')),
  olusturuldu  timestamptz not null default now()
);

create table taramalar (
  id           bigint generated always as identity primary key,
  kullanici_id uuid references profiller(id) on delete set null,
  okunan_metin text,                             -- telefonun etiketten okuduğu yazı
  bulunan_sarap text references saraplar(id),    -- null = veritabanında yok → agent araştırır
  olusturuldu  timestamptz not null default now()
);

-- ---------- Puan özetini otomatik güncelle ----------

-- security definer: kullanıcılar saraplar tablosuna yazamaz (RLS), ama puan özeti
-- güncellenmeli; bu yüzden bu fonksiyon sistem yetkisiyle çalışır ve yalnızca özeti yazar.
create or replace function puan_ozetini_guncelle() returns trigger
  language plpgsql security definer set search_path = public as $$
declare hedef text := coalesce(new.sarap_id, old.sarap_id);
begin
  update saraplar s set
    puan_ortalama = (select round(avg(puan)::numeric, 1) from puanlar where sarap_id = hedef),
    puan_sayisi   = (select count(*) from puanlar where sarap_id = hedef)
  where s.id = hedef;
  return null;
end $$;

create trigger puanlar_ozet after insert or update or delete on puanlar
  for each row execute function puan_ozetini_guncelle();

-- ---------- Erişim kuralları (Row Level Security) ----------
-- Ansiklopedi herkese açık okunur; yazma yalnızca sunucu (service role) ile.
-- Kullanıcı verilerini herkes kendisi yazar; puan ve yorumlar herkese görünür.

alter table ureticiler     enable row level security;
alter table uzumler        enable row level security;
alter table saraplar       enable row level security;
alter table sarap_uzumleri enable row level security;
alter table profiller      enable row level security;
alter table puanlar        enable row level security;
alter table yorumlar       enable row level security;
alter table sarap_listem   enable row level security;
alter table engellemeler   enable row level security;
alter table bildirimler    enable row level security;
alter table taramalar      enable row level security;

create policy "ansiklopedi okunur" on ureticiler     for select using (true);
create policy "ansiklopedi okunur" on uzumler        for select using (true);
create policy "ansiklopedi okunur" on saraplar       for select using (durum = 'yayinda');
create policy "ansiklopedi okunur" on sarap_uzumleri for select using (true);

create policy "profil herkese görünür" on profiller for select using (true);
create policy "kendi profilini yazar"  on profiller for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "puanlar görünür"        on puanlar for select using (true);
create policy "kendi puanını yazar"    on puanlar for all using (auth.uid() = kullanici_id) with check (auth.uid() = kullanici_id);

create policy "yayındaki yorumlar görünür" on yorumlar for select
  using (durum = 'yayinda' and not exists (
    select 1 from engellemeler e where e.engelleyen = auth.uid() and e.engellenen = yorumlar.kullanici_id));
create policy "kendi yorumunu görür"   on yorumlar for select using (auth.uid() = kullanici_id);
create policy "kendi yorumunu ekler"   on yorumlar for insert with check (auth.uid() = kullanici_id);
create policy "kendi yorumunu siler"   on yorumlar for delete using (auth.uid() = kullanici_id);

create policy "listem yalnız bana"     on sarap_listem for all using (auth.uid() = kullanici_id) with check (auth.uid() = kullanici_id);
create policy "engellemelerim"         on engellemeler for all using (auth.uid() = engelleyen) with check (auth.uid() = engelleyen);
create policy "şikâyet ekler"          on bildirimler for insert with check (auth.uid() = bildiren_id);
create policy "tarama ekler"           on taramalar for insert with check (auth.uid() = kullanici_id or kullanici_id is null);
