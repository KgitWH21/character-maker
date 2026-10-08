'use strict';
const PREFIX='character-maker-'+encodeURIComponent(self.registration.scope)+'-';
const VERSION=PREFIX+'v1';
const FILES=['./','./index.html','./style.css','./original-data.js','./additions.js','./core.js','./app.js','./manifest.webmanifest','./icon.svg','./icons/icon-192.png','./icons/icon-512.png','./character_elements.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;if(new URL(e.request.url).pathname.endsWith('.zip'))return;e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(VERSION).then(c=>c.put(e.request,copy));}return response;})).catch(()=>e.request.mode==='navigate'?caches.match('./index.html'):Response.error()));});
