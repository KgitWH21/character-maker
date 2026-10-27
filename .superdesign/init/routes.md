# View mapping

Single document `/` (`index.html`), state-driven navigation without URL routes. Shared shell: `index.html`.

- `build`: Foundation, suggestion candidate and accepted details; renderer in `app.js`.
- `quick`: Customizable generated field assortment; renderer in `app.js`.
- `full`: All generated character sections; renderer in `app.js`.
- `dialogue`: Dialogue habits, wildcards and kept recipe; renderer in `app.js`.
- `now`: Moment prompts and fictional information states; renderer in `app.js`.
- `medical`: Measurements, medical history and food prompts; renderer in `app.js`.
- `sheet`: Kept snapshots and notes; renderer in `app.js`.
- `saved`: Local saved snapshots and backup controls; renderer in `app.js`.
- `history`: Recent rolls and changes; renderer in `app.js`.
- `connections`: Connected independent profiles and relationship notes; renderer in `app.js`.
- `pressure`: Dilemmas, authored responses and kept situations; renderer in `app.js`.
- `brief`: Printable character brief and export; renderer in `app.js`.

## View controller
```js
function setView(tab,target=null){if(!['build','quick','full','dialogue','now','medical','sheet','saved','history','connections','pressure','brief'].includes(tab))return;state.tab=tab;closeActionMenus();render();store();if(target){const f=findField(target),fallback=fields.find(x=>x.group===f?.group);const el=$('results').querySelector?.(`[data-field="${target}"]`)||$('results').querySelector?.(`[data-field="${fallback?.id}"]`);el?.scrollIntoView({block:'start'});if(f)$('groupJump').value=el?.closest('section')?.id||$('groupJump').value;}else window.scrollTo?.(0,0);}
```
