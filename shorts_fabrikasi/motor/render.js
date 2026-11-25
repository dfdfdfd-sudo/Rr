// Kullanım: node render.js <is_klasoru> [--onizleme 1,8.5,30] [--fps 30]
// Sahneyi başsız (headless) Chromium'da açar, her kareyi t zamanına göre çizer,
// ekran görüntüsünü doğrudan ffmpeg'e akıtır ve miks.wav ile birleştirir.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(path.join(require('child_process').execSync('npm root -g').toString().trim(), 'playwright'))); }

const MOTOR = __dirname;
const arg = process.argv.slice(2);
const isKlasoru = path.resolve(arg[0]);
const secenek = (ad, vars) => { const i = arg.indexOf(ad); return i >= 0 ? arg[i + 1] : vars; };
const FPS = Number(secenek('--fps', 30));
const onizleme = secenek('--onizleme', null);

const tipler = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.otf': 'font/otf' };
const sunucu = http.createServer((q, r) => {
  const dosya = path.join(MOTOR, decodeURIComponent(q.url.split('?')[0]));
  if (!dosya.startsWith(MOTOR) || !fs.existsSync(dosya)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': tipler[path.extname(dosya)] || 'application/octet-stream' });
  fs.createReadStream(dosya).pipe(r);
});

(async () => {
  await new Promise((ok) => sunucu.listen(0, ok));
  const port = sunucu.address().port;
  const veri = JSON.parse(fs.readFileSync(path.join(isKlasoru, 'zaman_cizelgesi.json'), 'utf8'));
  const tarayici = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const sayfa = await tarayici.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  sayfa.on('pageerror', (e) => console.error('Sayfa hatası:', e.message));
  sayfa.on('console', (m) => m.type() === 'error' && console.error('Konsol:', m.text()));
  await sayfa.goto(`http://127.0.0.1:${port}/sahne.html`);
  await sayfa.waitForFunction(() => typeof window.hazirla === 'function');
  await sayfa.evaluate((v) => window.hazirla(v), veri);

  if (onizleme) {
    for (const t of onizleme.split(',').map(Number)) {
      await sayfa.evaluate((t) => window.kare(t), t);
      await sayfa.screenshot({ path: path.join(isKlasoru, `onizleme_${t}.jpg`), type: 'jpeg', quality: 85 });
    }
    console.log('Önizlemeler kaydedildi.');
  } else {
    const toplam = Math.ceil(veri.sure * FPS);
    const cikti = path.join(isKlasoru, 'video.mp4');
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
      '-i', path.join(isKlasoru, 'miks.wav'),
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart',
      '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', cikti], { stdio: ['pipe', 'inherit', 'inherit'] });
    const bas = Date.now();
    for (let f = 0; f < toplam; f++) {
      await sayfa.evaluate((t) => window.kare(t), f / FPS);
      const kare = await sayfa.screenshot({ type: 'jpeg', quality: 93 });
      if (!ff.stdin.write(kare)) await new Promise((ok) => ff.stdin.once('drain', ok));
      if (f % 150 === 0) {
        const gecen = (Date.now() - bas) / 1000, kalan = f ? gecen / f * (toplam - f) : 0;
        console.log(`  kare ${f}/${toplam}  (~${Math.round(kalan)} sn kaldı)`);
      }
    }
    ff.stdin.end();
    await new Promise((ok, hata) => ff.on('close', (k) => (k === 0 ? ok() : hata(new Error('ffmpeg ' + k)))));
    console.log(`Video hazır: ${cikti}  (${Math.round((Date.now() - bas) / 1000)} sn)`);
  }
  await tarayici.close();
  sunucu.close();
})().catch((e) => { console.error(e); process.exit(1); });
