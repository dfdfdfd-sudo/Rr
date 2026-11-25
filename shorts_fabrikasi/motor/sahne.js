// 3D sahne + motion graphics. Her kare yalnızca "t" (saniye) değerinden hesaplanır,
// böylece render tamamen deterministiktir: aynı t -> aynı görüntü.
import * as THREE from 'three';

const G = 1080, Y = 1920;
const $ = (s) => document.querySelector(s);
const kel = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const aralik = (t, a, b) => kel((t - a) / (b - a));
const karis = (a, b, u) => a + (b - a) * u;
const yumusak = (u) => u * u * (3 - 2 * u);
const cikis = (u) => 1 - Math.pow(1 - u, 3);
const cikisExpo = (u) => (u >= 1 ? 1 : 1 - Math.pow(2, -10 * u));
const geriEsnek = (u) => { const c = 1.7; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
const trBuyuk = (s) => s.toLocaleUpperCase('tr-TR');
const binlik = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// ---------------------------------------------------------------- Gürültü (noise)
function hash(x, y, s) {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function deger(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 2 - 1;
}
function fbm(x, y, s, okt = 5) {
  let t = 0, a = 0.5, f = 1;
  for (let i = 0; i < okt; i++) { t += a * deger(x * f, y * f, s + i * 17); f *= 2.03; a *= 0.5; }
  return t;
}
function sirtli(x, y, s, okt = 5) {
  let t = 0, a = 0.55, f = 1;
  for (let i = 0; i < okt; i++) { const n = 1 - Math.abs(deger(x * f, y * f, s + i * 31)); t += a * n * n; f *= 2.1; a *= 0.5; }
  return t;
}

// ---------------------------------------------------------------- Arazi (dağ) üretimi
const BOY = 9000, BOLUM = 230, R = 1700, OLCEK = 1000; // OLCEK: en yüksek dağın 3D yüksekliği

function dagGeometrisi(sekil, H, tohum) {
  const g = new THREE.PlaneGeometry(BOY, BOY, BOLUM, BOLUM);
  g.rotateX(-Math.PI / 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i);
    const r = Math.hypot(x, z) / R;
    const nx = x / 900, nz = z / 900;
    let profil;
    if (sekil === 'volkan') {
      profil = Math.pow(Math.max(0, 1 - r), 1.55);
      profil -= 0.06 * Math.exp(-Math.pow(r / 0.045, 2)); // krater
      profil += 0.08 * fbm(nx * 2, nz * 2, tohum) * profil;
    } else if (sekil === 'kalkan') {
      profil = Math.pow(Math.max(0, 1 - r * 0.78), 1.05) * 0.92;
      profil = Math.min(profil, 0.86 + 0.14 * Math.exp(-Math.pow(r / 0.12, 2)));
      profil += 0.06 * fbm(nx * 2, nz * 2, tohum) * profil;
    } else { // sarp: sırtlı, keskin
      const s = sirtli(nx * 1.4, nz * 1.4, tohum);
      const sirt = Math.exp(-Math.pow(Math.abs(z * 0.8 + x * 0.35) / (R * 0.32), 2));
      profil = Math.pow(Math.max(0, 1 - r * 0.92), 1.3) * (0.55 + 0.45 * s) + 0.22 * sirt * s * Math.max(0, 1 - r * 0.8);
      profil = profil / 1.02;
    }
    const tepeler = (0.5 + 0.5 * fbm(nx * 0.7, nz * 0.7, tohum + 5)) * 0.16 * kel(r - 0.4, 0, 1.4); // etek tepeleri
    p.setY(i, H * (Math.max(0, profil) + tepeler) + 12 * fbm(nx * 8, nz * 8, tohum + 9));
  }
  g.computeVertexNormals();
  // Normalize ederek zirveyi tam H'ye oturt
  let maks = 0; for (let i = 0; i < p.count; i++) maks = Math.max(maks, p.getY(i));
  for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) * H / maks);
  g.computeVertexNormals();

  // Yükseklik ve eğime göre renk: orman -> toprak -> kaya -> kar
  const n = g.attributes.normal, renk = new Float32Array(p.count * 3), c = new THREE.Color();
  const orman = new THREE.Color('#24402b'), toprak = new THREE.Color('#6d5a44'), kaya = new THREE.Color('#7b7c84'),
        koyuKaya = new THREE.Color('#4b4c55'), kar = new THREE.Color('#f3f6ff');
  for (let i = 0; i < p.count; i++) {
    const e = p.getY(i) / H, egim = 1 - n.getY(i), x = p.getX(i), z = p.getZ(i);
    const kr = fbm(x / 300, z / 300, tohum + 3) * 0.07;
    if (e < 0.18 + kr) c.copy(orman).lerp(toprak, aralik(e, 0.05, 0.2));
    else if (e < 0.45 + kr) c.copy(toprak).lerp(kaya, aralik(e, 0.18, 0.45));
    else c.copy(kaya);
    if (egim > 0.42) c.lerp(koyuKaya, 0.7);
    const karCizgisi = 0.6 + kr;
    if (e > karCizgisi && egim < 0.55) c.lerp(kar, aralik(e, karCizgisi, karCizgisi + 0.06));
    renk.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(renk, 3));
  return g;
}

// ---------------------------------------------------------------- Dokular (kodla çizilen)
function yumusakDoku(boyut, ic, dis) {
  const cv = document.createElement('canvas'); cv.width = cv.height = boyut;
  const x = cv.getContext('2d'), gr = x.createRadialGradient(boyut / 2, boyut / 2, 0, boyut / 2, boyut / 2, boyut / 2);
  gr.addColorStop(0, ic); gr.addColorStop(1, dis); x.fillStyle = gr; x.fillRect(0, 0, boyut, boyut);
  return new THREE.CanvasTexture(cv);
}
function bulutDoku(tohum) {
  const b = 256, cv = document.createElement('canvas'); cv.width = cv.height = b;
  const x = cv.getContext('2d');
  for (let i = 0; i < 26; i++) {
    const r = 30 + hash(i, 1, tohum) * 60, px = b / 2 + (hash(i, 2, tohum) - 0.5) * 120, py = b / 2 + (hash(i, 3, tohum) - 0.5) * 50;
    const gr = x.createRadialGradient(px, py, 0, px, py, r);
    gr.addColorStop(0, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = gr; x.fillRect(0, 0, b, b);
  }
  return new THREE.CanvasTexture(cv);
}

// ---------------------------------------------------------------- Kurulum
let V, renderer, scene, kamera, gok, gunes, hemi, daglar = [], dizi = [], bulutlar, kar, zirveHalka, isin, sahneler;
const paletler = [ // gece mavisinden altın gün doğumuna
  { ust: '#0b1630', ufuk: '#3b5b8f', sis: '#2a3e63', gunes: '#9fb6ff' },
  { ust: '#1a1840', ufuk: '#8a5a8c', sis: '#4b3c63', gunes: '#ffb3c8' },
  { ust: '#20163a', ufuk: '#e0845e', sis: '#6b4a5a', gunes: '#ffc08a' },
  { ust: '#2a1a36', ufuk: '#ffb45e', sis: '#8a5e50', gunes: '#ffd9a0' },
];

window.hazirla = async (veri) => {
  V = veri;
  sahneler = V.sahneler;
  renderer = new THREE.WebGLRenderer({ canvas: $('#gl'), antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(G, Y, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2('#2a3e63', 0.00021);
  kamera = new THREE.PerspectiveCamera(42, G / Y, 10, 40000);

  // Gökyüzü kubbesi (gradyan shader)
  gok = new THREE.Mesh(new THREE.SphereGeometry(30000, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { ust: { value: new THREE.Color() }, ufuk: { value: new THREE.Color() }, gunesYon: { value: new THREE.Vector3() }, gunesRenk: { value: new THREE.Color() } },
    vertexShader: 'varying vec3 vY; void main(){ vY = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `uniform vec3 ust, ufuk, gunesRenk; uniform vec3 gunesYon; varying vec3 vY;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
      void main(){ float y = clamp(vY.y, -0.2, 1.0); vec3 c = mix(ufuk, ust, pow(max(y,0.0), 0.55));
        float g = max(dot(normalize(vY), normalize(gunesYon)), 0.0); c += gunesRenk * (pow(g, 18.0)*0.9 + pow(g, 3.0)*0.18);
        vec2 st = floor(vY.xz / max(vY.y,0.05) * 220.0); float yildiz = step(0.9975, h(st)) * smoothstep(0.25, 0.7, y) * 0.8; c += yildiz;
        gl_FragColor = vec4(c, 1.0); }`,
  }));
  scene.add(gok);

  hemi = new THREE.HemisphereLight('#bcd4ff', '#2b2230', 0.9);
  scene.add(hemi);
  gunes = new THREE.DirectionalLight('#ffd9a0', 3.2);
  gunes.castShadow = true;
  gunes.shadow.mapSize.set(2048, 2048);
  Object.assign(gunes.shadow.camera, { left: -2600, right: 2600, top: 2600, bottom: -2600, near: 100, far: 12000 });
  gunes.shadow.bias = -0.0005;
  scene.add(gunes, gunes.target);

  // Her dağı bir kez üret
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.92, metalness: 0 });
  V.ogeler.forEach((o, i) => {
    const H = o.deger / V.maks_deger * OLCEK;
    const geo = dagGeometrisi(o.sekil, H, 11 + i * 7);
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = m.receiveShadow = true; m.visible = false;
    m.userData = { H, o };
    scene.add(m); daglar.push(m);
  });

  // Giriş/kapanış için 10 dağın minyatür dizisi (soldan sağa 10 -> 1)
  const diziGrup = new THREE.Group(); diziGrup.position.set(0, 0, 0); diziGrup.visible = false;
  const zemin = new THREE.Mesh(new THREE.CircleGeometry(9000, 64).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#141a2a', roughness: 1 }));
  zemin.receiveShadow = true; diziGrup.add(zemin);
  daglar.forEach((d, i) => {
    const m = new THREE.Mesh(d.geometry, mat);
    const s = 0.2; m.scale.set(s, 0.55, s);
    m.position.set(Math.sin(i * 0.9) * 420, 0, 1800 - i * 520);
    m.castShadow = m.receiveShadow = true;
    m.userData = d.userData; diziGrup.add(m); dizi.push(m);
  });
  scene.add(diziGrup);
  dizi.grup = diziGrup;

  // Bulutlar
  bulutlar = new THREE.Group();
  for (let i = 0; i < 34; i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: bulutDoku(i), transparent: true, depthWrite: false, opacity: 0.75, fog: true }));
    const a = hash(i, 4, 1) * Math.PI * 2, r = 2000 + hash(i, 5, 1) * 3500;
    sp.userData = { a, r, y: 0.25 + hash(i, 6, 1) * 0.3, hiz: 0.01 + hash(i, 7, 1) * 0.02 };
    const b = 500 + hash(i, 8, 1) * 600; sp.scale.set(b * 2.4, b, 1);
    bulutlar.add(sp);
  }
  scene.add(bulutlar);

  // Kar taneleri
  const kn = 1800, kp = new Float32Array(kn * 3);
  for (let i = 0; i < kn; i++) kp.set([hash(i, 1, 9), hash(i, 2, 9), hash(i, 3, 9)], i * 3);
  const kg = new THREE.BufferGeometry(); kg.setAttribute('position', new THREE.BufferAttribute(kp.slice(), 3)); kg.userData.taban = kp;
  kar = new THREE.Points(kg, new THREE.PointsMaterial({ size: 7, map: yumusakDoku(64, 'rgba(255,255,255,1)', 'rgba(255,255,255,0)'), transparent: true, depthWrite: false, opacity: 0.8 }));
  scene.add(kar);

  // Zirve işareti: parlayan halka + ışık sütunu
  zirveHalka = new THREE.Mesh(new THREE.RingGeometry(40, 52, 64).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: '#ffd84d', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
  isin = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 1, 12, 1, true).translate(0, 0.5, 0),
    new THREE.MeshBasicMaterial({ color: '#ffe68a', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  scene.add(zirveHalka, isin);

  // Arayüzü hazırla
  const k = V.konu;
  $('#ust .hap').textContent = trBuyuk(k.baslik);
  $('#baslik .ust').textContent = k.ust_baslik;
  $('#baslik .dev').textContent = k.alt_baslik;
  $('#baslik .soru').textContent = '1 NUMARA SENİ ŞAŞIRTACAK';
  $('#cta .buyuk').innerHTML = 'SEN HANGİSİNE<br>TIRMANIRDIN?';
  $('#not').textContent = k.not || '';
  $('#noktalar').innerHTML = V.ogeler.map(() => '<i></i>').join('');
  const cetvel = $('#cetvel');
  for (let m = 0; m <= 5000; m += 1000) {
    const d = document.createElement('div'); d.className = 'cizgi'; d.style.top = (100 - m / 5500 * 100) + '%'; d.textContent = m ? (m / 1000) + 'K' : '0';
    cetvel.appendChild(d);
  }
  V.ogeler.forEach((o) => { const h = document.createElement('div'); h.className = 'hayalet'; h.style.bottom = (o.deger / 5500 * 100) + '%'; h.dataset.d = o.deger; cetvel.appendChild(h); });
  const isa = document.createElement('div'); isa.className = 'isaret'; cetvel.appendChild(isa);

  // Gren dokusu için önceden üretilmiş kareler
  window._gren = [];
  for (let f = 0; f < 6; f++) {
    const id = new ImageData(540, 960);
    for (let i = 0; i < id.data.length; i += 4) { const v = hash(i, f, 3) * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
    window._gren.push(id);
  }
  await Promise.all([600, 700, 800, 900].map((w) => document.fonts.load(`${w} 60px Fabrika`, 'AĞİŞÇÖÜ#0123')));
  await document.fonts.ready;
  return true;
};

// ---------------------------------------------------------------- Yardımcılar
function sahneBul(t) {
  for (let i = 0; i < sahneler.length; i++) if (t < sahneler[i].bitis) return [i, sahneler[i]];
  return [sahneler.length - 1, sahneler[sahneler.length - 1]];
}
function paletUygula(u) { // u: 0 (ilk) -> 1 (son)
  const f = u * (paletler.length - 1), i = Math.min(paletler.length - 2, Math.floor(f)), w = f - i;
  const a = paletler[i], b = paletler[i + 1], c = (k) => new THREE.Color(a[k]).lerp(new THREE.Color(b[k]), w);
  gok.material.uniforms.ust.value.copy(c('ust'));
  gok.material.uniforms.ufuk.value.copy(c('ufuk'));
  gok.material.uniforms.gunesRenk.value.copy(c('gunes'));
  scene.fog.color.copy(c('sis'));
  gunes.color.copy(c('gunes'));
}
function harfHarf(el, metin, t0, t, gecikme = 0.035) {
  if (el.dataset.m !== metin) { el.innerHTML = [...metin].map((h) => `<span>${h === ' ' ? '&nbsp;' : h}</span>`).join(''); el.dataset.m = metin; }
  [...el.children].forEach((s, i) => {
    const u = cikis(aralik(t, t0 + i * gecikme, t0 + i * gecikme + 0.45));
    s.style.transform = `translateY(${(1 - u) * 90}px) rotate(${(1 - u) * 8}deg)`;
    s.style.opacity = u;
  });
}
function goster(el, op, tr = '') { el.style.opacity = op; el.style.transform = tr; el.style.display = op > 0.001 ? '' : 'none'; }

// ---------------------------------------------------------------- Her kare
window.kare = (t) => {
  const [si, s] = sahneBul(t);
  const yerel = t - s.baslangic, sure = s.bitis - s.baslangic, u = kel(yerel / sure);
  const ogeSay = V.ogeler.length;
  const ogeIndex = s.tur === 'oge' ? V.ogeler.findIndex((o) => o.sira === s.oge.sira) : (s.tur === 'giris' ? -1 : ogeSay);
  paletUygula(kel((ogeIndex + 1) / (ogeSay + 1)));
  const finalMi = s.tur === 'oge' && s.oge.sira === 1;

  daglar.forEach((d) => (d.visible = false));
  dizi.grup.visible = false;
  zirveHalka.visible = isin.visible = false;

  let hedef = new THREE.Vector3(), zirve = null;
  scene.fog.density = 0.00021;
  if (s.tur === 'oge') {
    const d = daglar[ogeIndex]; d.visible = true;
    const H = d.userData.H;
    const giris = cikisExpo(aralik(yerel, 0, 1.1));             // hızlı süzülerek giriş
    const yavas = yumusak(u);
    const aci = (ogeIndex * 1.3) + karis(-0.55, 0, giris) + 0.35 * yavas;
    let r = karis(5200, 2700, giris) - 450 * yavas;
    let y = karis(H * 2.0, H * 0.8, giris) + 120 * yavas;
    if (finalMi) { // final: alçaktan başlayıp yükselen vinç (crane) hareketi
      const vinc = cikis(aralik(yerel, 0.2, 3.2));
      r = karis(3600, 3100, vinc) - 300 * yavas; y = karis(H * 0.15, H * 0.85, vinc);
    }
    kamera.position.set(Math.sin(aci) * r, y, Math.cos(aci) * r);
    hedef.set(0, H * (finalMi ? karis(0.9, 1.2, cikis(aralik(yerel, 0.2, 3.2))) : 1.2), 0);
    zirve = new THREE.Vector3(0, H, 0);
    // zirvenin gerçek konumu (en yüksek vertex)
    if (!d.userData.zirve) {
      const p = d.geometry.attributes.position; let mi = 0;
      for (let i = 0; i < p.count; i++) if (p.getY(i) > p.getY(mi)) mi = i;
      d.userData.zirve = new THREE.Vector3(p.getX(mi), p.getY(mi), p.getZ(mi));
    }
    zirve.copy(d.userData.zirve);
    hedef.x = zirve.x * 0.6; hedef.z = zirve.z * 0.6;
    const zu = cikis(aralik(yerel, 0.6, 1.2));
    zirveHalka.visible = isin.visible = zu > 0;
    zirveHalka.position.copy(zirve).add(new THREE.Vector3(0, 6, 0));
    const nab = 1 + 0.25 * Math.sin(t * 6);
    zirveHalka.scale.setScalar(zu * nab * (finalMi ? 1.8 : 1.2));
    zirveHalka.material.opacity = zu * 0.9;
    isin.position.copy(zirve); isin.scale.set(finalMi ? 3 : 1.5, 1500 * zu, finalMi ? 3 : 1.5); isin.material.opacity = 0.35 * zu;
    gunes.position.set(Math.sin(aci + 1.1) * 6000, H * 2.2, Math.cos(aci + 1.1) * 6000);
    gunes.target.position.set(0, 0, 0);
  } else {
    dizi.grup.visible = true;
    const g = cikisExpo(aralik(yerel, 0, 1.6));
    const aci = s.tur === 'giris' ? karis(0.55, 0.25, yumusak(u)) : karis(-0.1, 0.2, cikis(u));
    const r = karis(5200, 3300, g);
    kamera.position.set(Math.sin(aci) * r, karis(2600, 1100, g), 1800 + Math.cos(aci) * r);
    hedef.set(0, 750, -900);
    scene.fog.density = 0.00009;
    gunes.position.set(-4000, 3500, 3000);
    // Minyatürler sırayla yükselir (bar grafik gibi)
    dizi.forEach((m, i) => {
      const yuk = s.tur === 'giris' ? cikis(aralik(yerel, 0.4 + i * 0.12, 1.0 + i * 0.12)) : 1;
      m.scale.y = Math.max(0.001, yuk) * 0.55;
    });
  }
  kamera.lookAt(hedef);
  gok.material.uniforms.gunesYon.value.copy(gunes.position).normalize();

  // Bulutlar yavaşça döner, kamera yönüne bakar
  const H0 = s.tur === 'oge' ? daglar[ogeIndex].userData.H : 600;
  bulutlar.visible = s.tur === 'oge';
  bulutlar.children.forEach((b) => {
    const d = b.userData, a = d.a + t * d.hiz;
    b.position.set(Math.sin(a) * d.r, H0 * d.y, Math.cos(a) * d.r);
    b.material.opacity = 0.7 * kel((b.position.distanceTo(kamera.position) - 1400) / 1600);
  });
  // Kar taneleri: kameranın çevresinde, zamanla düşer
  const kp = kar.geometry.attributes.position, taban = kar.geometry.userData.taban;
  for (let i = 0; i < kp.count; i++) {
    const bx = taban[i * 3], by = taban[i * 3 + 1], bz = taban[i * 3 + 2];
    const yy = ((by - t * 0.06 * (0.6 + bx)) % 1 + 1) % 1;
    kp.setXYZ(i, kamera.position.x + (bx - 0.5) * 1600 + Math.sin(t + bz * 9) * 20, kamera.position.y + (yy - 0.5) * 1200, kamera.position.z + (bz - 0.5) * 1600);
  }
  kp.needsUpdate = true;
  renderer.render(scene, kamera);

  // ---------------- 2D motion graphics katmanı
  const oge = s.tur === 'oge';
  goster($('#ust'), oge ? cikis(aralik(t, sahneler[1].baslangic, sahneler[1].baslangic + 0.5)) : 0);
  goster($('#noktalar'), oge ? 1 : 0);
  [...$('#noktalar').children].forEach((n, i) => n.classList.toggle('dolu', oge && i <= ogeIndex));
  goster($('#cetvel'), oge ? cikis(aralik(t, sahneler[1].baslangic, sahneler[1].baslangic + 0.6)) : 0);

  if (oge) {
    const o = s.oge;
    const a = cikis(aralik(yerel, 0.05, 0.55)), cik = 1 - aralik(yerel, sure - 0.35, sure);
    $('#sira').innerHTML = `<b>#</b>${o.sira}`;
    goster($('#sira'), a * cik, `translateX(${(1 - geriEsnek(aralik(yerel, 0.05, 0.6))) * -260}px) scale(${karis(1.25, 1, a)})`);
    goster($('#ad'), cik);
    harfHarf($('#ad'), trBuyuk(o.ad), s.baslangic + 0.25, t);
    const ad = $('#ad'); ad.style.fontSize = (o.ad.length > 9 ? 110 : 128) * (finalMi ? 1.08 : 1) + 'px';
    $('#yer span').textContent = o.yer;
    const yu = cikis(aralik(yerel, 0.55, 0.95));
    goster($('#yer'), yu * cik, `translateX(${(1 - yu) * -80}px)`);
    const sayU = cikis(aralik(yerel, 0.35, 1.1));
    $('#sayac').innerHTML = `${binlik(o.deger * sayU)}<small>m</small>`;
    goster($('#sayac'), aralik(yerel, 0.3, 0.5) * cik, `scale(${karis(0.85, 1, cikis(aralik(yerel, 0.3, 0.7)))})`);
    $('#sayac').style.transformOrigin = 'left center';
    // Cetvel
    const oran = o.deger / 5500 * sayU;
    $('#cetvel .dolgu').style.height = oran * 100 + '%';
    $('#cetvel .isaret').style.bottom = oran * 100 + '%';
    [...document.querySelectorAll('#cetvel .hayalet')].forEach((h) => (h.style.opacity = V.ogeler.indexOf(V.ogeler.find((x) => x.deger == h.dataset.d)) < ogeIndex ? 1 : 0));
    // Zirve etiketi 3D noktayı takip eder
    const ekran = zirve.clone().project(kamera);
    const zx = (ekran.x * 0.5 + 0.5) * G, zy = (-ekran.y * 0.5 + 0.5) * Y;
    $('#zirve').textContent = `▲ ${binlik(o.deger)} m`;
    goster($('#zirve'), cikis(aralik(yerel, 1.0, 1.4)) * cik * (ekran.z < 1 && zy > 950 ? 1 : 0), `translate(${zx}px, ${zy - 90}px) translateX(-50%)`);
    document.documentElement.style.setProperty('--vurgu', finalMi ? '#ffcf33' : '#ffd84d');
  } else {
    ['#sira', '#ad', '#yer', '#sayac', '#zirve'].forEach((q) => goster($(q), 0));
  }

  // Giriş başlığı
  if (s.tur === 'giris') {
    const a = cikisExpo(aralik(yerel, 0.1, 0.9)), cik = 1 - aralik(yerel, sure - 0.3, sure);
    goster($('#baslik'), cik);
    $('#baslik .ust').style.cssText = `opacity:${a};transform:translateY(${(1 - a) * -40}px);letter-spacing:${karis(30, 6, a)}px`;
    const d = geriEsnek(aralik(yerel, 0.25, 0.95));
    $('#baslik .dev').style.cssText = `opacity:${aralik(yerel, 0.25, 0.45)};transform:scale(${karis(2.2, 1, d)})`;
    const q = cikis(aralik(yerel, 1.2, 1.6));
    $('#baslik .soru').style.cssText = `opacity:${q};transform:translateY(${(1 - q) * 30}px) rotate(-2deg)`;
  } else goster($('#baslik'), 0);

  // Kapanış
  if (s.tur === 'kapanis') {
    const a = cikis(aralik(yerel, 0.2, 0.8));
    goster($('#cta'), a, `translateY(${(1 - a) * 60}px)`);
    const nabiz = 1 + 0.04 * Math.sin(yerel * 7);
    $('#cta .kucuk').style.transform = `scale(${cikis(aralik(yerel, 0.7, 1.1)) * nabiz})`;
  } else goster($('#cta'), 0);
  goster($('#not'), (s.tur === 'kapanis' || finalMi) ? aralik(yerel, 1.0, 1.5) * 0.9 : 0);

  // Karaoke altyazı: aynı anda en fazla 3 kelime, aktif kelime vurgulu
  const kelimeler = s.kelimeler, at = $('#altyazi');
  let html = '', ai = kelimeler.findIndex((k) => t >= k.b && t < k.s);
  if (ai === -1) { for (let i = kelimeler.length - 1; i >= 0; i--) if (t >= kelimeler[i].s) { ai = i; break; } }
  if (ai >= 0 && t < kelimeler[kelimeler.length - 1].s + 0.4) {
    const grup = Math.floor(ai / 3) * 3, parca = kelimeler.slice(grup, grup + 3);
    html = parca.map((k, j) => {
      const idx = grup + j, aktif = idx === ai, gorundu = t >= k.b;
      const p = cikis(aralik(t, k.b, k.b + 0.12));
      const sk = aktif ? 1 + 0.12 * (1 - aralik(t, k.b, k.b + 0.2)) : 1;
      return `<span class="${aktif ? 'aktif' : ''}" style="opacity:${gorundu ? 1 : 0.0};transform:scale(${sk * karis(0.6, 1, p)})">${trBuyuk(k.k.replace(/[.,!?…:]+$/, ''))}</span>`;
    }).join('');
  }
  at.innerHTML = html;

  // Geçişler: sahne sınırında çapraz perde + beyaz flaş
  let perde = -2, flas = 0;
  for (let i = 1; i < sahneler.length; i++) {
    const b = sahneler[i].baslangic, d = t - b;
    if (d > -0.3 && d < 0.3) perde = d / 0.3;           // -1 -> 1 arası süpürme
    if (d >= 0 && d < 0.25) flas = Math.max(flas, (1 - d / 0.25) * (sahneler[i].oge?.sira === 1 ? 0.9 : 0.35));
  }
  const pe = $('#perde');
  if (perde > -2) { pe.style.display = ''; pe.style.transform = `translateX(${perde * 2400}px)`; } else pe.style.display = 'none';
  goster($('#flas'), flas);

  // Film greni
  $('#gren').getContext('2d').putImageData(window._gren[Math.floor(t * 24) % 6], 0, 0);
  return true;
};
