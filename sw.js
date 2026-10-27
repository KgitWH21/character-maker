'use strict';
const PREFIX='character-maker-'+encodeURIComponent(self.registration.scope)+'-';
const VERSION=PREFIX+'v14';
const FILES=['./','./index.html','./style.css','./original-data.js','./additions.js','./core.js','./right-now-data.js','./right-now.js','./languages.js','./dialogue-data.js','./dialogue.js','./medical.js','./character-canvas.js','./character-tools.js','./app.js','./manifest.webmanifest','./icon.svg','./icons/icon-192.png','./icons/icon-512.png','./character_elements.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// Local development should reflect edits on reload, even with offline support installed.
const LOCAL_PREVIEW=['localhost','127.0.0.1','[::1]'].includes(self.location.hostname);
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
 if(new URL(e.request.url).pathname.endsWith('.zip'))return;
 e.respondWith((async()=>{
  const cache=await caches.open(VERSION);
  const fromNetwork=async()=>{const response=await fetch(e.request,LOCAL_PREVIEW?{cache:'no-store'}:{});if(response.ok)await cache.put(e.request,response.clone());return response;};
  if(LOCAL_PREVIEW){try{return await fromNetwork();}catch{const cached=await cache.match(e.request);if(cached)return cached;}}
  else{const cached=await cache.match(e.request);if(cached)return cached;try{return await fromNetwork();}catch{}}
  return e.request.mode==='navigate'?(await cache.match('./index.html'))||Response.error():Response.error();
 })());
});
