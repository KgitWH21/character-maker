/* Installed-app update checks and an explicit, state-preserving reload. */
(function(root){
'use strict';
const release='v22';
const isInstalled=()=>root.matchMedia?.('(display-mode: standalone)').matches===true||root.navigator.standalone===true;
function start({persist=()=>true,notify=()=>{}}={}){
 const $=id=>root.document.getElementById(id),sw=root.navigator.serviceWorker;
 let registration=null,checking=false,lastCheck=0,hadController=!!sw?.controller,available=false,reloading=false,reloaded=false;
 $('appVersion').textContent='Release '+release;
 function status(message,announce=false){$('updateStatus').textContent=message;if(announce)notify(message);}
 function readyToReload(){available=true;$('updateBanner').hidden=false;root.document.body.classList.add('update-available');notify('');status('An app update is ready. Apply open field edits, then tap Update & reload.');}
 function reload(){if(reloaded)return;reloaded=true;root.location.reload();}
 function watch(worker){if(!worker)return;const updating=hadController;
  const changed=()=>{if(worker.state==='installed'){if(updating)readyToReload();else{status('Ready for offline use.');notify('Ready for offline use.');}}else if(worker.state==='redundant')status('The app update could not finish downloading. Check your connection and try again.',true);};worker.addEventListener('statechange',changed);changed();
 }
 const supported=!!sw&&/^https?:$/.test(root.location.protocol);
 const ready=supported?sw.register('./sw.js',{updateViaCache:'none'}).then(reg=>{registration=reg;if(reg.waiting)readyToReload();watch(reg.installing);reg.addEventListener('updatefound',()=>watch(reg.installing));return reg;}).catch(()=>{status('Update check is unavailable. Reopen the app while online.');return null;}):Promise.resolve(null);
 async function check(manual=false){if(checking||!manual&&Date.now()-lastCheck<60000)return;checking=true;lastCheck=Date.now();for(const id of ['checkUpdates','helpCheckUpdates'])$(id).disabled=true;
  try{await ready;if(!registration){status(supported?'Could not check for updates. Check your connection and try again.':'Open the published app to check for updates.',manual);return;}
   if(root.navigator.onLine===false){status('You’re offline. Your current app still works; reconnect to check for updates.',manual);return;}
   status('Checking for app updates…');await registration.update();if(registration.waiting)readyToReload();else if(registration.installing)status('Downloading the app update…');else if(available)readyToReload();else status('You’re up to date · '+release+'.',manual);
  }catch{status('Could not check for updates. Check your connection and try again.',manual);}finally{checking=false;for(const id of ['checkUpdates','helpCheckUpdates'])$(id).disabled=false;}
 }
 async function apply(){if(reloading||!available)return;if(persist()===false){status('Your draft could not be saved. Export a backup before reloading.',true);return;}
  reloading=true;$('applyUpdate').disabled=true;status('Opening the updated app…');
  if(registration?.waiting){registration.waiting.postMessage({type:'SKIP_WAITING'});root.setTimeout(()=>{if(!reloaded){reloading=false;$('applyUpdate').disabled=false;status('The update has not finished. Check your connection and try again.',true);}},10000);}else reload();
 }
 $('checkUpdates').onclick=$('helpCheckUpdates').onclick=()=>check(true);$('applyUpdate').onclick=apply;$('dismissUpdate').onclick=()=>{$('updateBanner').hidden=true;root.document.body.classList.remove('update-available');};
 if(supported){sw.addEventListener('controllerchange',()=>{if(reloading)reload();else if(hadController)readyToReload();hadController=true;});
  root.addEventListener('pageshow',()=>check());root.addEventListener('focus',()=>check());root.addEventListener('online',()=>{lastCheck=0;check();});root.document.addEventListener('visibilitychange',()=>{if(root.document.visibilityState==='visible')check();});ready.then(()=>check());
 }else status('Open the published app to check for updates.');
 return {check,apply,ready,isInstalled,getStatus:()=>({available,checking,release})};
}
root.CharacterUpdates={start,isInstalled,release};
})(typeof window==='undefined'?globalThis:window);
