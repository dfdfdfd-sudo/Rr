#!/usr/bin/env bash
# Uygulamanın web sürümünü, claude.ai bağlantısında (artifact) açılacak şekilde derler.
# Kullanım: scripts/web-onizleme.sh <çıktı-klasörü>
# Çıktı: <klasör>/ritim.html + <klasör>/app/... + <klasör>/assets/...
set -euo pipefail
OUT="${1:?çıktı klasörü ver}"
TMP="$(mktemp -d)"
EXPO_OFFLINE=1 npx expo export --platform web --output-dir "$TMP" >/dev/null
mkdir -p "$OUT"
cp -r "$TMP/assets" "$OUT/"
rm -rf "$OUT/app" && mv "$TMP/_expo" "$OUT/app"
JS="$OUT/app/static/js/web"
# 1) Mutlak yolları göreli yap, "_expo" adını "app" yap (artifact "_" ile başlayan adı kabul etmez)
sed -i 's#"/_expo/static/js/web/#"./app/static/js/web/#g; s#"/assets/#"./assets/#g; s#_expo/static/js/web/#app/static/js/web/#g' "$JS"/*.js
# 2) Sayfa parçaları, sayfanın gerçek klasöründen yüklensin
sed -i 's#"\./app/static/js/web/#(self.__RB||"/")+"app/static/js/web/#g' "$JS"/entry-*.js
SCRIPTS=$(grep -o '<script src="[^"]*"' "$TMP/index.html" | sed 's#src="/_expo/#charset="utf-8" src="./app/#; s#$# defer></script>#' | tr -d '\n')
cat > "$OUT/ritim.html" <<H
<title>Ritim</title>
<meta name="theme-color" content="#08090a">
<style>
:root{color-scheme:dark}
html,body{height:100%;background:#08090a}
body{overflow:hidden}
#root{display:flex;height:100%;flex:1}
</style>
<script>(function(){try{var d=location.href.split('#')[0].split('?')[0];d=d.slice(0,d.lastIndexOf('/')+1);var b=document.createElement('base');b.href=d;self.__RB=d;document.head.appendChild(b);if(location.pathname!=='/')history.replaceState(null,'','/'+location.hash)}catch(e){}})();</script>
<div id="root"></div>
$SCRIPTS
H
rm -rf "$TMP"
echo "Hazır: $OUT/ritim.html"
