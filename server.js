'use strict';
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
let QR;try{QR=require('qrcode')}catch{}
const PORT=Number(process.env.PORT||3000);
const root=path.join(__dirname,'public');
const rooms=new Map();
const MAX=250;
const palettes=['amethyst','moonblue','rose','ruby','emerald','amber','aqua','silver'];
const caps=['round','bell','umbrella','droopy','frilly','cluster'];
const marks=['spots','stars','swirls','dots','plain'];
const moods=['calm','sleepy','happy','curious','excited','unsure','overwhelmed','magical'];
const sizes=['tiny','small','medium','large','giant'];
const clients=new Map();
const send=(res,code,obj)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'same-origin'});res.end(JSON.stringify(obj));};
function roomId(x){let s=String(x||'GLADE1').trim().toUpperCase();if(!/^[A-Z0-9_-]{1,20}$/.test(s))return null;return s;}
function roomFor(id){let r=rooms.get(id);if(!r){r={items:new Map(),listeners:new Set(),version:0};rooms.set(id,r)}return r;}
function snapshot(r){return {items:[...r.items.values()],version:r.version,count:r.items.size,max:MAX};}
function broadcast(r){r.version++;let msg=`event: update\ndata: ${JSON.stringify(snapshot(r))}\n\n`;for(let s of r.listeners){try{s.write(msg)}catch{r.listeners.delete(s)}}}
function readBody(req){return new Promise((resolve,reject)=>{let str='';req.on('data',b=>{str+=b;if(str.length>12000){reject(Error('Request too large'));req.destroy()}});req.on('end',()=>{try{resolve(JSON.parse(str||'{}'))}catch{reject(Error('Invalid JSON'))}});req.on('error',reject)})}
function cleanStr(v,n=30){return String(v||'').trim().replace(/[<>\u0000-\u001f]/g,'').slice(0,n)}
function option(v,arr,def){return arr.includes(v)?v:def}
function corsSafety(res){res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Frame-Options','SAMEORIGIN');}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
 corsSafety(res);
 let url;try{url=new URL(req.url,'http://localhost')}catch{return send(res,400,{error:'Invalid URL'})}
 const id=roomId(url.searchParams.get('room'));
 if(url.pathname.startsWith('/api/')||url.pathname==='/qr.svg'){
  if(!id)return send(res,400,{error:'Invalid room code'});
  const room=roomFor(id);
  if(url.pathname==='/api/state'&&req.method==='GET')return send(res,200,{room:id,...snapshot(room)});
  if(url.pathname==='/api/events'&&req.method==='GET'){
   res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'});
   res.write(`event: update\ndata: ${JSON.stringify(snapshot(room))}\n\n`);room.listeners.add(res);
   const heartbeat=setInterval(()=>{try{res.write(': keepalive\n\n')}catch{}},20000);
   req.on('close',()=>{clearInterval(heartbeat);room.listeners.delete(res)});return;
  }
  if(url.pathname==='/api/join'&&req.method==='POST'){
   try{
    let b=await readBody(req);let client=cleanStr(b.client,80);
    if(!/^[a-zA-Z0-9_-]{10,80}$/.test(client))return send(res,400,{error:'Please refresh and try again'});
    let exists=room.items.has(client);if(!exists&&room.items.size>=MAX)return send(res,409,{error:'This glade is full — try a new room'});
    let mushroom={id:client,name:cleanStr(b.name,24)||'Mystery traveller',colour:option(b.colour,palettes,'amethyst'),cap:option(b.cap,caps,'round'),mark:option(b.mark,marks,'spots'),size:option(b.size,sizes,'medium'),mood:option(b.mood,moods,'calm'),joinedAt:exists?room.items.get(client).joinedAt:Date.now(),seed:exists?room.items.get(client).seed:crypto.randomInt(1,1000000)};
    room.items.set(client,mushroom);broadcast(room);return send(res,200,{ok:true,mushroom,count:room.items.size});
   }catch(e){return send(res,400,{error:e.message})}
  }
  if(url.pathname==='/api/reset'&&req.method==='POST'){
   // Informal shared activity: host link is not authenticated. Do not use for confidential data.
   room.items.clear();broadcast(room);return send(res,200,{ok:true,count:0});
  }
  if(url.pathname==='/qr.svg'&&req.method==='GET'){
   if(!QR){res.writeHead(503);return res.end('QR unavailable')}
   const target=new URL('/',`https://${req.headers.host||'glowshroom-glade.onrender.com'}`);target.searchParams.set('view','student');target.searchParams.set('room',id);
   try{let svg=await QR.toString(target.href,{type:'svg',margin:1,width:360,color:{dark:'#14342c',light:'#ffffff'}});res.writeHead(200,{'Content-Type':'image/svg+xml','Cache-Control':'no-store'});return res.end(svg)}catch{return send(res,500,{error:'Could not build QR'})}
  }
  return send(res,404,{error:'Not found'});
 }
 if(req.method!=='GET'&&req.method!=='HEAD')return send(res,405,{error:'Not allowed'});
 const requested=url.pathname==='/'?'/index.html':url.pathname;
 let resolved=path.resolve(root,'.'+decodeURIComponent(requested));
 if(!resolved.startsWith(root+path.sep)&&resolved!==root)return send(res,403,{error:'Forbidden'});
 fs.stat(resolved,(err,st)=>{
  if(err||!st.isFile()){res.writeHead(404);res.end('Not found');return}
  let ext=path.extname(resolved).toLowerCase();res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream','Cache-Control':ext==='.html'?'no-cache':'public, max-age=3600'});
  fs.createReadStream(resolved).pipe(res);
 });
});
server.listen(PORT,'0.0.0.0',()=>console.log(`Glowshroom Glade listening on ${PORT}`));
module.exports={server,roomId};
