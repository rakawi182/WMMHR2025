const CACHE='wmmhr-compass-v5';
const ASSETS=['./','./index.html','./manifest.webmanifest','./favicon.svg','./favicon-32.png','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
// Stale-while-revalidate for same-origin GET requests: instant offline start, silent update for the next launch.
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(r,{ignoreSearch:true});
const net=fetch(r).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res}).catch(()=>hit);
return hit||net}))});
