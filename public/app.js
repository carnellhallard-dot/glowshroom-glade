'use strict';
const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search);const room=(params.get('room')||'GLADE1').toUpperCase().replace(/[^A-Z0-9_-]/g,'').slice(0,20)||'GLADE1';const host=params.get('view')==='host'||params.get('view')==='teacher';
const studentUrl=new URL(location.origin+'/');studentUrl.searchParams.set('view','student');studentUrl.searchParams.set('room',room);
$('roomTitle').textContent=room;const choices={colour:'amethyst',cap:'round',size:'medium',mark:'spots',mood:'calm'};
const palette={amethyst:['#a45cf0','#f0a7ff'],moonblue:['#2e77ea','#8ed8ff'],rose:['#e365b5','#ffd0fa'],ruby:['#d94e59','#ff9a80'],emerald:['#22a982','#b6ff9d'],amber:['#efa840','#fff0a6'],aqua:['#24c9cc','#bafff3'],silver:['#a6adc8','#ffffff']};
const names={amethyst:'Amethyst',moonblue:'Moonlight blue',rose:'Rose',ruby:'Ruby red',emerald:'Emerald',amber:'Golden amber',aqua:'Aquamarine',silver:'Silver'};
const moods={calm:['🌿','Calm','Gentle glow'],sleepy:['🌙','Sleepy','Soft shimmer'],happy:['☀️','Happy','Golden radiance'],curious:['✨','Curious','Twinkling light'],excited:['⚡','Excited','Bright sparks'],unsure:['🌫️','Unsure','Quiet flicker'],overwhelmed:['🌧️','Overwhelmed','Subtle glow'],magical:['🔮','Need magic','Mystical aura']};
// Rendered SVG uses only enumerated, hard-coded options. No user input is injected into SVG markup.
function mushroomSVG(o){
 const [c,hi]=palette[o.colour]||palette.amethyst;
 let cap=o.cap||'round';let path={round:'M13 67 Q18 12 67 17 Q114 14 121 67 Q71 83 13 67Z',bell:'M29 69 Q39 6 67 7 Q98 9 106 69 Q68 86 29 69Z',umbrella:'M5 68 Q25 30 66 32 Q109 30 129 68 Q65 90 5 68Z',droopy:'M14 57 Q18 10 65 22 Q108 17 123 58 Q137 88 114 83 Q62 68 24 85 Q5 86 14 57Z',frilly:'M11 68 Q29 12 67 16 Q111 13 123 66 L114 74 L106 69 L96 76 L86 70 L77 77 L67 70 L57 78 L47 70 L37 76 L27 69 L18 75 Z',cluster:'M12 70 Q7 37 35 38 Q42 10 70 15 Q100 10 104 40 Q132 37 123 71 Q69 88 12 70Z'}[cap];
 let spots='';if(o.mark==='spots')spots='<ellipse cx="40" cy="53" rx="8" ry="5"/><ellipse cx="67" cy="38" rx="11" ry="7"/><ellipse cx="96" cy="54" rx="7" ry="5"/>';
 else if(o.mark==='dots')spots='<circle cx="40" cy="52" r="3"/><circle cx="60" cy="34" r="4"/><circle cx="86" cy="44" r="3"/><circle cx="105" cy="57" r="3"/><circle cx="25" cy="65" r="3"/>';
 else if(o.mark==='stars')spots='<path d="M48 33l3 8 8 2-8 3-3 8-3-8-8-3 8-2z M87 43l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>';
 else if(o.mark==='swirls')spots='<path d="M35 56 q-4-14 10-14 q12 0 8 11 q-3 6-9 2 M78 49 q-6-14 7-16 q12-1 12 11 q0 9-10 8" fill="none" stroke-width="5" stroke-linecap="round"/>';
 let uid='m'+Math.random().toString(36).slice(2,10);
 return `<svg viewBox="0 0 134 142" role="img" aria-label="Magical mushroom"><defs><linearGradient id="${uid}c" x1="0" x2=".9" y1="0" y2="1"><stop stop-color="${hi}"/><stop offset=".56" stop-color="${c}"/><stop offset="1" stop-color="#332255"/></linearGradient><linearGradient id="${uid}s"><stop stop-color="#fff8e4"/><stop offset=".53" stop-color="#e9c7de"/><stop offset="1" stop-color="#a083af"/></linearGradient></defs><ellipse cx="67" cy="131" rx="40" ry="7" fill="${hi}" opacity=".32"/><path d="M54 70 Q61 94 53 127 Q65 138 80 127 Q74 96 81 70Z" fill="url(#${uid}s)" stroke="#f9e7ef" stroke-width="1.5"/><path d="M51 70 Q65 92 83 70" stroke="${hi}" stroke-width="9" fill="none" opacity=".7"/><path d="${path}" fill="url(#${uid}c)" stroke="${hi}" stroke-width="2"/><path d="M18 68Q65 83 116 68" stroke="#fff0ed" stroke-width="3" fill="none" opacity=".7"/><g fill="#fff9de" opacity=".9" stroke="#fff9de">${spots}</g><path d="M52 104q5-5 9 0 M74 104q5-5 9 0" stroke="#7b587c" fill="none" stroke-width="2" opacity=".75"/><circle cx="66" cy="112" r="2" fill="#b97aa2"/></svg>`;
}
function moodText(m){return moods[m]?.[2]||moods.calm[2]}
let userId;try{userId=sessionStorage.getItem('glade-id-'+room)}catch{}if(!userId){userId=(typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/[^a-zA-Z0-9_-]/g,'');try{sessionStorage.setItem('glade-id-'+room,userId)}catch{}}
function initStudent(){
 $('studentView').classList.remove('hidden');$('viewForestLink').href='/?view=host&room='+encodeURIComponent(room);
 $('colours').innerHTML=Object.entries(palette).map(([k,[base]])=>`<button type="button" class="swatch ${k==='amethyst'?'selected':''}" data-colour="${k}" style="--sw:${base}" title="${names[k]}" aria-label="${names[k]}" aria-pressed="${k==='amethyst'}"></button>`).join('');
 $('moods').innerHTML=Object.entries(moods).map(([k,[emoji,text]])=>`<button type="button" class="mood ${k==='calm'?'selected':''}" data-mood="${k}" aria-pressed="${k==='calm'}"><span>${emoji}</span>${text}</button>`).join('');
 $('colours').addEventListener('click',e=>{let b=e.target.closest('[data-colour]');if(!b)return;choices.colour=b.dataset.colour;document.querySelectorAll('[data-colour]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')});preview()});
 $('moods').addEventListener('click',e=>{let b=e.target.closest('[data-mood]');if(!b)return;choices.mood=b.dataset.mood;document.querySelectorAll('[data-mood]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')});preview()});
 for(let k of ['cap','size','mark'])$(k).addEventListener('change',()=>{choices[k]=$(k).value;preview()});$('nickname').addEventListener('input',preview);preview();
 $('joinForm').addEventListener('submit',async(e)=>{e.preventDefault();$('joinBtn').disabled=true;$('feedback').textContent='Waking your mushroom…';try{let r=await fetch('/api/join?room='+encodeURIComponent(room),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({client:userId,name:$('nickname').value,...choices})});let j=await r.json();if(!r.ok)throw Error(j.error||'Could not join');$('joinForm').classList.add('hidden');$('joined').classList.remove('hidden');$('feedback').textContent='';try{sessionStorage.setItem('glade-joined-'+room,'1')}catch{}}catch(ex){$('feedback').textContent=ex.message}finally{$('joinBtn').disabled=false}});
 $('editBtn').addEventListener('click',()=>{$('joined').classList.add('hidden');$('joinForm').classList.remove('hidden')});
}
function preview(){$('mushPreview').innerHTML=mushroomSVG(choices);$('mushPreview').style.setProperty('--glow',palette[choices.colour][1]);$('previewMood').textContent=moodText(choices.mood)+' · '+moods[choices.mood][1];$('previewName').textContent=$('nickname').value.trim()||'Your magic mushroom'}
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),16777619)}return h>>>0};
let lastVersion=-1;
function position(item,i,n){let h=hash(item.id);let cols=Math.max(6,Math.ceil(Math.sqrt(n*2.35)));let row=Math.floor(i/cols);let col=i%cols;
 // Cluster over the clearing; jitter is deterministic so mushrooms do not jump around on refresh.
 let x=14+((col+.5)/cols)*72+((h%17)-8)*.34;
 let depthRows=Math.max(1,Math.ceil(n/cols));let y=83-((row+.4)/(depthRows+1.4))*54+((h>>8)%11-5)*.5;
 if(n<=12){x=22+((i*31+(h%13)*2)%59);y=76-((i*19)%32)}
 return {x:Math.min(90,Math.max(10,x)),y:Math.min(92,Math.max(34,y))};
}
function renderForest(data){if(data.version===lastVersion)return;lastVersion=data.version;let arr=data.items||[];let f=$('mushroomField');let existing=new Map([...f.children].map(x=>[x.dataset.id,x]));
 arr.forEach((m,i)=>{let el=existing.get(m.id);if(!el){el=document.createElement('div');el.className='sprout';el.dataset.id=m.id;el.innerHTML='<div class="mushSvg"></div><div class="nametag"></div>';f.appendChild(el)}existing.delete(m.id);let p=position(m,i,arr.length);let sizes={tiny:46,small:64,medium:82,large:102,giant:120};let width=sizes[m.size]||82;if(arr.length>100)width*=.76;else if(arr.length>50)width*=.87;el.style.left=p.x+'%';el.style.top=p.y+'%';el.style.setProperty('--w',width+'px');el.style.setProperty('--blur',m.mood==='excited'?'21px':m.mood==='sleepy'?'6px':'13px');el.style.setProperty('--shine',palette[m.colour]?.[1]||'#efbbfa');el.style.setProperty('--sway',(2.6+(hash(m.id)%13)/10)+'s');el.style.zIndex=String(Math.round(p.y));el.querySelector('.mushSvg').innerHTML=mushroomSVG(m);el.querySelector('.nametag').textContent=m.name;el.title=`${m.name} · ${moods[m.mood]?.[1]||'Calm'}`;});
 for(let el of existing.values())el.remove();$('count').textContent=arr.length;$('emptyMessage').classList.toggle('hidden',arr.length>0);
}
function hostInit(){
 $('hostView').classList.remove('hidden');$('shareLink').value=studentUrl.href;$('qr').src='/qr.svg?room='+encodeURIComponent(room);$('shareBtn').onclick=()=>{$('shareModal').classList.remove('hidden')};$('closeShare').onclick=()=>{$('shareModal').classList.add('hidden')};$('shareModal').onclick=e=>{if(e.target===$('shareModal'))$('shareModal').classList.add('hidden')};$('copyLink').onclick=async()=>{try{await navigator.clipboard.writeText(studentUrl.href);$('copyLink').textContent='Copied!';setTimeout(()=>$('copyLink').textContent='Copy',1600)}catch{$('shareLink').select()}};
 $('resetBtn').onclick=async()=>{if(!confirm('Clear all mushrooms from '+room+'? Travellers can add new ones afterwards.'))return;try{let r=await fetch('/api/reset?room='+encodeURIComponent(room),{method:'POST'});if(!r.ok)throw Error('Could not clear');$('status').textContent='The glade is ready for a new group'}catch(e){alert(e.message)}};
 let fl=$('fireflies');let seed=88;function rng(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
 for(let i=0;i<29;i++){let d=document.createElement('span');d.className='firefly';d.style.left=(6+rng()*88)+'%';d.style.top=(6+rng()*80)+'%';d.style.animationDelay=(-rng()*6)+'s';d.style.animationDuration=(3+rng()*5)+'s';fl.appendChild(d)}
 function connect(){let es=new EventSource('/api/events?room='+encodeURIComponent(room));es.addEventListener('update',e=>{try{renderForest(JSON.parse(e.data));$('status').textContent='✦ Forest connected · Live'}catch{}});es.onerror=()=>{$('status').textContent='Reconnecting to the forest…'};return es}
 if('EventSource'in window)connect();else {async function poll(){try{let r=await fetch('/api/state?room='+room);if(r.ok){renderForest(await r.json());$('status').textContent='✦ Forest connected'}}catch{ $('status').textContent='Reconnecting…'}}poll();setInterval(poll,3000)}
}
if(host)hostInit();else initStudent();
