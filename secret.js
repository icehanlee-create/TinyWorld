/* 奇幻小鎮大搜查．秘境引擎（所有秘境共用）
   秘境不是主線關卡：從舊場景的入口進去，玩家操控主角走路找東西。
   - 左手虛擬搖桿走路，鏡頭固定放大跟著角色（測試模式的「全景」才能縮小看整張）。
   - 走近物件 → 點一下拿起來 → 特寫卡檢查（小動作）→「就是它／放回去」。拿錯不扣分。
   - 草叢、石堆、木箱可以翻開，翻過的留痕跡；物件可以藏在底下。
   - 提示改成角色頭上的方向箭頭；下方清單同一種找齊才打勾，不顯示剩幾個。
   - 特寫卡、對話期間計時暫停。
   各秘境的場景與資料寫在 level{n}.js，用 H.SECRET.make({...}) 註冊。 */
(function(){
const H=window.TH;if(!H||H.SECRET)return;
const {T,f,OL,SECRETS,STORIES,SEQ,ART}=H;
const NSv='http://www.w3.org/2000/svg';
const $=s=>document.querySelector(s);
const REACH=105;           /* 走到多近才拿得到（世界座標，約一個半角色高） */
const ZOOM=1.5;            /* 秘境鏡頭：開場大小的 1.5 倍，固定不變 */

/* ---------- 共用樣式：搖桿、特寫卡 ---------- */
const css=document.createElement('style');css.textContent=`
#joy{position:absolute;left:14px;bottom:120px;width:136px;height:136px;z-index:7;touch-action:none;display:none}
body.secret #joy{display:block}body.secret.pano #joy,body:has(.overlay:not(.hide)) #joy,body:has(#ride.on) #joy,body:has(#curtain.on) #joy{visibility:hidden}
#joy .jb{position:absolute;left:14px;top:14px;width:108px;height:108px;border-radius:50%;background:rgba(255,250,240,.55);border:2.5px solid rgba(43,36,32,.55);box-shadow:inset 0 0 0 10px rgba(255,250,240,.35)}
#joy .jk{position:absolute;left:43px;top:43px;width:50px;height:50px;border-radius:50%;background:#fffaf0;border:2.5px solid #2b2420;box-shadow:0 3px 0 #2b2420;transition:transform .12s}
#joy.on .jk{transition:none}
#joy .jt{position:absolute;left:118px;top:40px;background:#2b2420;color:#fffaf0;font-size:13px;padding:6px 10px;border-radius:12px;white-space:nowrap;animation:jtb 1.4s ease-in-out infinite}
#joy .jt::before{content:'';position:absolute;right:100%;top:50%;margin-top:-6px;border:6px solid transparent;border-right-color:#2b2420}
@keyframes jtb{50%{transform:translateX(5px)}}
#secCard .pcard{padding:16px 16px 16px;text-align:center;max-width:360px}
#secCard .ttl{font-size:19px;display:block;margin:0 0 2px}#secCard .sub{font-size:13px;color:var(--muted);margin:0 0 6px}
#secCard .box{width:220px;height:220px;margin:0 auto;border:2.5px solid var(--ink);border-radius:18px;background:#fbf3e2;overflow:hidden}
#secCard .box svg{width:100%;height:100%;display:block}
#secCard .note{min-height:44px;margin:8px 0 8px;font-size:15px;line-height:1.5}
#secCard .act{width:100%;min-height:46px;margin-bottom:10px}
#secCard .row2{display:flex;gap:10px}#secCard .row2 .pbtn{flex:1;min-height:50px;font-size:17px}#secCard .row2 .sbtn{flex:1}
#secCard .act:disabled{opacity:.5}
.secHi{animation:secHi 1.2s ease-in-out infinite}@keyframes secHi{50%{opacity:.35}}
`;document.head.appendChild(css);

/* ---------- 搖桿（DOM，畫面左下角） ---------- */
const joy=document.createElement('div');joy.id='joy';joy.innerHTML='<div class="jb"></div><div class="jk"></div>';
document.getElementById('app').appendChild(joy);
const JV={x:0,y:0,id:null};const knob=joy.querySelector('.jk');
function joyAt(e){const r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const d=Math.hypot(dx,dy),R=44;
 if(d>R){dx*=R/d;dy*=R/d}knob.style.transform=`translate(${dx}px,${dy}px)`;JV.x=dx/R;JV.y=dy/R}
joy.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();JV.id=e.pointerId;try{joy.setPointerCapture(e.pointerId)}catch(_){}joy.classList.add('on');joyAt(e);
 const tip=joy.querySelector('.jt');if(tip){tip.remove();try{localStorage.setItem('townhunt-secret-tip','1')}catch(_){}}});
joy.addEventListener('pointermove',e=>{if(e.pointerId===JV.id)joyAt(e)});
const joyEnd=e=>{if(e.pointerId!==JV.id)return;JV.id=null;JV.x=JV.y=0;knob.style.transform='';joy.classList.remove('on')};
joy.addEventListener('pointerup',joyEnd);joy.addEventListener('pointercancel',joyEnd);
/* 電腦測試：方向鍵／WASD */
const KEYS={};window.addEventListener('keydown',e=>{KEYS[e.key.toLowerCase()]=1});window.addEventListener('keyup',e=>{KEYS[e.key.toLowerCase()]=0});
const keyVec=()=>{const x=(KEYS.arrowright||KEYS.d?1:0)-(KEYS.arrowleft||KEYS.a?1:0),y=(KEYS.arrowdown||KEYS.s?1:0)-(KEYS.arrowup||KEYS.w?1:0);const d=Math.hypot(x,y);return d?{x:x/d,y:y/d}:null};
function placeJoy(){joy.style.bottom=(H.pads().b+12)+'px'}
window.addEventListener('resize',placeJoy);

/* ---------- 8 方位：5 張圖，往左的 3 個方位左右鏡像 ---------- */
/* 0 東=side、1 東南=fq、2 南=front、3 西南=fq 鏡像、4 西=side 鏡像、5 西北=bq 鏡像、6 北=back、7 東北=bq */
const DIRV=[['side',1],['fq',1],['front',1],['fq',-1],['side',-1],['bq',-1],['back',1],['bq',1]];
const dirOf=(x,y)=>((Math.round(Math.atan2(y,x)/(Math.PI/4))%8)+8)%8;

function make(C){
 const E={C,how:C.how,rule:C.rule,homeBtn:C.homeBtn,homeNote:C.homeNote};SECRETS[C.n]=E;
 let on=false,raf=0,last=0,pano=false,card=null,cut=0,pausedAt=0,tipShown=false;
 const P={x:C.start.x,y:C.start.y,dir:2,walk:false,ph:0,frame:-1,view:''};
 let all=[],real=[],FL=[],ent={},story=null,clv={story:null,bonus:null},arrowUntil=0,arrowT=null,occT=0,occKey='',farT=0;
 const LIDS=['secW','secF','secI','secD','secO','secS','secA'],L=()=>['secF','secI','secD','secO','secA'].map(id=>document.getElementById(id));
 function layers(){let a=document.getElementById('secF');if(a)return L();const fg=document.getElementById('fgSvg'),mk=document.getElementById('marks');
  LIDS.forEach(id=>{const g=document.createElementNS(NSv,'g');g.id=id;if(id==='secW'||id==='secS')g.setAttribute('class','on');[['stroke',OL],['stroke-width','2'],['stroke-linejoin','round'],['stroke-linecap','round']].forEach(([k,v])=>g.setAttribute(k,v));fg.insertBefore(g,mk)});return L()}
 function clearLayers(){C.movers&&C.movers.forEach(m=>m.el=null);LIDS.forEach(id=>{const e=document.getElementById(id);if(e)e.remove()})}
 const spEl=sp=>document.querySelector(`#bg [data-n="${sp.n}"]`);

 /* ---- 能不能走：地形（海、湖）＋不能穿過的東西（摩艾、石台、房子…） ---- */
 const solid=(x,y,pad=9)=>{for(const s of C.solids){const dx=(x-s.x)/(s.rx+pad),dy=(y-s.y)/(s.ry+pad*.6);if(dx*dx+dy*dy<1)return true}return false};
 const walkable=(x,y)=>C.terrain(x,y)&&!solid(x,y)&&!Object.values(ent).some(e=>e.block&&!e.gone&&Math.hypot((x-e.x)/1.6,y-e.y)<12);
 E.walkable=walkable;

 /* ---- 擺物件：每局隨機（照 C.types[].spots／C.decoys 的區域；host＝藏在可翻開的東西底下） ---- */
 const inRect=(g,x,y)=>x>=g.x&&x<=g.x+g.w&&y>=g.y&&y<=g.y+g.h;
 const covered=(x,y)=>H.sprites.some(sp=>!C.thin.has(sp.kind)&&Math.abs(x-sp.x)<sp.w*.5+6&&y<=sp.y+10&&y>=sp.y-sp.h-6);
 function spot(reg,used){const g=H.REG[reg];for(let t=0;t<900;t++){const x=g.x+Math.random()*g.w,y=g.y+Math.random()*g.h;
   if(C.inReg&&!C.inReg(reg,x,y))continue;if(!walkable(x,y)||solid(x,y,22))continue;if(covered(x,y))continue;
   if(all.some(o=>Math.hypot(o.x-x,o.y-y)<(t<600?90:50)))continue;if(Math.hypot(x-C.start.x,y-C.start.y)<120)continue;return{x,y}}return null}
 function hostIn(reg,kind){const g=H.REG[reg],c=FL.filter(h=>!h.hold&&h.kind===kind&&inRect(g,h.x,h.y));return c.length?c[Math.floor(Math.random()*c.length)]:null}
 function placeOne(t,reg,host,decoy){const o={t,id:t.id,decoy,r:t.r||13,rot:(Math.random()-.5)*2*(t.rot||15),sc:.9+Math.random()*.12,found:false,hidden:false,host:null,fl:Math.random()<.5};
  if(host){const h=hostIn(reg,host);if(h){h.hold=o;o.host=h;o.hidden=true;o.x=h.x+(Math.random()-.5)*h.w*.3;o.y=h.y-4;all.push(o);return o}}
  const p=spot(reg)||spot(C.anyReg);if(!p)return null;o.x=p.x;o.y=p.y;all.push(o);return o}
 E.items=()=>{reset();
  for(const t of C.types)t.spots.forEach(([reg,host])=>{const o=placeOne(t,reg,host,false);if(o)real.push(o)});
  for(const [id,reg,host] of C.decoys){const t=C.decoyT[id];placeOne(t,reg,host,true)}
  placeClovers();return real};

 function reset(){stop(false);all=[];real=[];FL=C.flips;FL.forEach(h=>{h.open=false;h.hold=null;h.clover=null;const el=spEl(h.sp);if(el)el.style.display=''});
  clv={story:null,bonus:null};story={step:0,done:false};Object.keys(ent).forEach(k=>delete ent[k]);arrowUntil=0;P.x=C.start.x;P.y=C.start.y;P.dir=C.startDir??2;P.frame=-1;P.view='';
  C.story&&C.story.reset&&C.story.reset(E)}

 /* ---- 幸運草：每局各藏一株在可翻開的東西底下（故事幸運草要完成小故事才翻得出來） ---- */
 function placeClovers(){const ok=FL.filter(h=>C.cloverHosts.has(h.kind)&&!h.hold),g=C.story&&C.story.giver;
  const pick=test=>{const c=ok.filter(h=>!h.clover&&test(h));if(!c.length)return null;const h=c[Math.floor(Math.random()*c.length)];return h};
  if(g){const h=pick(h=>Math.hypot(h.x-g.x,h.y-g.y)>420)||pick(()=>true);if(h){clv.story={kind:'story',host:h,revealed:false,found:false};h.clover=clv.story}}
  const s=clv.story&&clv.story.host,h2=pick(h=>!s||Math.hypot(h.x-s.x,h.y-s.y)>500)||pick(()=>true);if(h2){clv.bonus={kind:'bonus',host:h2,revealed:false,found:false};h2.clover=clv.bonus}}

 /* ---- 畫 ---- */
 const shadow=r=>`<ellipse cx="2" cy="${f(r*.75)}" rx="${f(r*.9)}" ry="3" fill="#000" opacity=".18" stroke="none"/>`;
 function drawItems(){const [,lI]=L();lI.innerHTML=all.map((o,i)=>o.found||o.hidden||o.held?'':`<g class="sitem" data-k="${i}" transform="translate(${f(o.x)},${f(o.y)}) rotate(${f(o.rot)}) scale(${f(o.fl?-o.sc:o.sc)},${f(o.sc)})">${shadow(o.r)}${ART[o.id]||C.decoyArt[o.id]}</g>`).join('')
  +[clv.story,clv.bonus].map(c=>c&&c.revealed&&!c.found?`<g class="cpop" transform="translate(${f(c.host.x)},${f(c.host.y-6)})">${C.clover}</g>`:'').join('')}
 function drawFlips(){const [lF]=L();lF.innerHTML=FL.filter(h=>h.open).map(h=>T(h.x,h.y,1,h.openArt||(h.openArt=C.openArt(h)),h.sp.fl)).join('')}
 function sparks(){const [,,,,lA]=L();let s='';
  for(const c of [clv.story,clv.bonus]){if(!c||c.found||c.revealed)continue;if(c.kind==='story'&&!story.done)continue;const h=c.host;
   s+=`<g transform="translate(${f(h.x+h.w*.15)},${f(h.y-h.h*.75)})"><path class="spark ${c.kind==='story'?'fast':'slow'}" d="M0,-7 L1.6,-1.6 L7,0 L1.6,1.6 L0,7 L-1.6,1.6 L-7,0 L-1.6,-1.6Z" fill="#fff6b0" stroke="#e0b44a" stroke-width="1"/></g>`}
  let g=document.getElementById('secSpk');if(!g){g=document.createElementNS(NSv,'g');g.id='secSpk';lA.appendChild(g)}g.innerHTML=s}

 /* 角色與動態人物（依 y 排先後） */
 function drawDyn(){const [,,lD]=L();const list=[{id:'P',x:P.x,y:P.y},...Object.entries(ent).filter(([,e])=>!e.gone).map(([id,e])=>({id,x:e.x,y:e.y}))].sort((a,b)=>a.y-b.y);
  const key=list.map(o=>o.id).join(',');if(lD.dataset.k!==key){lD.dataset.k=key;
   lD.innerHTML=list.map(o=>o.id==='P'?`<g id="secP"></g>`:`<g id="secE-${o.id}"></g>`).join('');P.frame=-1;P.view='';Object.values(ent).forEach(e=>e.drawn=null)}
  for(const [id,e] of Object.entries(ent)){if(e.gone)continue;const el=document.getElementById('secE-'+id);if(!el)continue;
   const art=(e._a||(e._a=e.art()))+(e.bub?bubble(e.bub,e.bh||-74):'');if(e.drawn!==art){el.innerHTML=art;e.drawn=art}el.setAttribute('transform',`translate(${f(e.x)},${f(e.y)})${e.fl?' scale(-1,1)':''}`)}
  const pe=document.getElementById('secP');if(!pe)return;const [v,fl]=DIRV[P.dir],fr=P.walk?(Math.floor(P.ph*7)%2):-1,k=v+fl+fr;
  if(P.view!==k){P.view=k;pe.innerHTML=C.playerArt(v,fr)}
  pe.setAttribute('transform',`translate(${f(P.x)},${f(P.y-(P.walk&&fr?1.6:0))})${fl<0?' scale(-1,1)':''}`)}
 const bubble=(t,y)=>`<g class="cpop" transform="translate(0,${y})"><path d="M-11,-10 h22 q4,0 4,4 v9 q0,4 -4,4 h-9 l-5,5 v-5 h-8 q-4,0 -4,-4 v-9 q0,-4 4,-4z" fill="#fff7d6" stroke-width="1.6"/><text x="0" y="1.5" text-anchor="middle" font-size="12" font-weight="800" fill="${t==='♥'?'#d8413a':OL}" stroke="none" font-family="PingFang TC,Noto Sans TC,sans-serif">${t}</text></g>`;
 E.ent=ent;E.addEnt=(id,o)=>{ent[id]=o;drawDyn()};E.redraw=()=>{drawDyn()};

 /* 角色被高的東西（摩艾、房子、樹）擋住時，把那個東西再畫一次在角色上面 */
 function occlude(){const [,,,lO]=L();const hit=H.sprites.filter(sp=>C.tall.has(sp.kind)&&sp.y>P.y+2&&P.y>sp.y-sp.h*.95&&Math.abs(P.x-sp.x)<sp.w*.5+12);
  const key=hit.map(s=>s.n).join(',');if(key!==occKey){occKey=key;lO.innerHTML=hit.sort((a,b)=>a.y-b.y).map(s=>s.svg.replace(/data-n="\d+"/,'')).join('')+'<g id="secGhost" opacity=".38"></g>'}
  /* 被擋住時，在上面淡淡畫出角色的輪廓，才找得到自己 */
  const gh=document.getElementById('secGhost'),pe=document.getElementById('secP');if(!gh)return;
  if(hit.length&&pe){if(gh.dataset.v!==P.view){gh.dataset.v=P.view;gh.innerHTML=pe.innerHTML}gh.setAttribute('transform',pe.getAttribute('transform'))}else if(gh.innerHTML){gh.innerHTML='';gh.dataset.v=''}}
 /* ---- 鏡頭 ---- */
 function cam(snap){const v=H.view(),sc=H.scr(),Pd=H.pads(),s=sc.base*ZOOM;v.s=s;
  const cy=Pd.t+(sc.h-Pd.t-Pd.b)*.5;const tx=sc.w/2-P.x*s,ty=cy-(P.y-28)*s;
  if(snap){v.tx=tx;v.ty=ty}else{if(Math.abs(tx-v.tx)<.3&&Math.abs(ty-v.ty)<.3)return;v.tx+=(tx-v.tx)*.18;v.ty+=(ty-v.ty)*.18}H.clampV();H.apply()}

 /* ---- 會移動的生物（海裡游的、天上飛的）：在自己的範圍裡亂逛，碰到邊界就轉彎 ---- */
 const MV=C.movers||[];
 function drawMovers(){const w=document.getElementById('secW'),sk=document.getElementById('secS');if(!w)return;
  for(const m of MV){if(m.el&&m.el.isConnected)continue;const g=document.createElementNS(NSv,'g');
   g.innerHTML=`<g class="mvf"><g class="mvj">${m.anim?`<g class="an a-${m.anim}" style="--d:${(m.anim==='flap'?.6:3)+Math.random()*.4}s;animation-delay:-${Math.random()*3}s">${m.art}</g>`:m.art}</g></g>`;
   (m.sky?sk:w).appendChild(g);m.el=g;m.fe=g.firstChild;m.je=m.fe.firstChild;m.fl=null;
   m.setArt=svg=>{m.je.innerHTML=svg};m.jig=()=>{m.je.classList.remove('jig');void m.je.getBBox;requestAnimationFrame(()=>m.je.classList.add('jig'));setTimeout(()=>m.je.classList.remove('jig'),560)};place(m,true)}}
 /* 朝移動的方向：往左就左右翻轉；水裡的生物再依上下方向斜一點（最多 30 度），不會倒著游 */
 function place(m,force){const v=H.view(),sc=H.scr(),x=m.x*v.s+v.tx,y=m.y*v.s+v.ty,vis=x>-160&&x<sc.w+160&&y>-160&&y<sc.h+160;
  if(!vis&&!force)return;m.el.setAttribute('transform',`translate(${f(m.x)},${f(m.y)})`);const c=Math.cos(m.a),sn=Math.sin(m.a),fl=c<0;
  const tl=(m.sky||m.noTilt)?0:Math.max(-30,Math.min(30,Math.atan2(sn*.75,Math.abs(c))*180/Math.PI));
  if(fl!==m.fl||Math.abs(tl-(m.tl||0))>3){m.fl=fl;m.tl=tl;m.fe.setAttribute('transform',(fl?'scale(-1,1) ':'')+(tl?`rotate(${f(tl)})`:''))}}
 function moveMovers(dt){for(const m of MV){if(!m.el)continue;m.t-=dt;if(m.tick)m.tick(m,dt);
   if(m.t<=0){m.a+=(Math.random()-.5)*(m.turn||1);m.t=1.2+Math.random()*3}
   const spd=m.sp*(m.spF??1);if(!spd){place(m);continue}const nx=m.x+Math.cos(m.a)*spd*dt,ny=m.y+Math.sin(m.a)*spd*dt*.75;
   if(m.ok(nx,ny)){m.x=nx;m.y=ny}else{for(let k=0;k<8;k++){const a=m.a+(Math.PI*(.35+Math.random()*1.3))*(Math.random()<.5?1:-1),tx=m.x+Math.cos(a)*m.sp*.6,ty=m.y+Math.sin(a)*m.sp*.45;if(m.ok(tx,ty)){m.a=a;m.t=1+Math.random()*2;break}}}
   place(m)}}
 E.resetMovers=()=>{for(const m of MV){m.x=m.x0;m.y=m.y0;m.t=0;m.st=undefined;m.stT=undefined;m.spF=undefined}};
 /* ---- 主迴圈 ---- */
 const busy=()=>!H.game().running||!!document.querySelector('.overlay:not(.hide)')||document.getElementById('ride').classList.contains('on')||document.getElementById('curtain').classList.contains('on')||!!card||cut>0;
 function loop(t){raf=requestAnimationFrame(loop);const dt=Math.min(.05,(t-(last||t))/1000);last=t;if(!on)return;
  let vx=JV.x,vy=JV.y;const kv=keyVec();if(kv){vx=kv.x;vy=kv.y}const m=Math.hypot(vx,vy);
  if(busy()||pano||m<.15){P.walk=false}else{
   const sp=C.speed*Math.min(1,m),ux=vx/m,uy=vy/m,nx=P.x+ux*sp*dt,ny=P.y+uy*sp*dt;
   if(walkable(nx,ny)){P.x=nx;P.y=ny}else if(walkable(nx,P.y)){P.x=nx}else if(walkable(P.x,ny)){P.y=ny}else{P.bump=(P.bump||0)+dt}
   P.dir=dirOf(ux,uy);P.walk=true;P.ph+=dt}
  for(const e of Object.values(ent))if(e.tick)e.tick(dt,P);
  moveMovers(dt);
  drawDyn();if(!pano)cam(false);
  if(t-occT>90||(P.walk&&occKey)){occT=t;occlude()}
  if(t-(P.animT||0)>400){P.animT=t;H.updAnim()}
  if(arrowUntil)arrow(t)}
 function arrow(t){const [,,,,lA]=L();let g=document.getElementById('secArr');
  const rest=real.filter(o=>!o.found);if(t>arrowUntil||!rest.length){arrowUntil=0;if(g)g.remove();return}
  let best=null,bd=1e9;for(const o of rest){const d=Math.hypot(o.x-P.x,o.y-P.y);if(d<bd){bd=d;best=o}}
  if(!g){g=document.createElementNS(NSv,'g');g.id='secArr';lA.appendChild(g);g.innerHTML=`<g class="secHi"><circle r="17" fill="#fffaf0" stroke-width="2.2"/><path d="M-9,-4 H3 V-10 L12,0 L3,10 V4 H-9Z" fill="#f5c842" stroke-width="2"/></g>`}
  const a=Math.atan2(best.y-P.y,best.x-P.x)*180/Math.PI;g.setAttribute('transform',`translate(${f(P.x)},${f(P.y-100)}) rotate(${f(a)})`);
  if(bd<REACH*.8&&!g.dataset.near){g.dataset.near=1;arrowUntil=Math.min(arrowUntil,t+1200)}}
 E.hint=()=>{if(!real.some(o=>!o.found))return false;arrowUntil=performance.now()+9000;const g=document.getElementById('secArr');if(g)g.remove();return true};

 E.start=()=>{layers();on=true;placeJoy();E.resetMovers();drawMovers();drawFlips();drawItems();sparks();drawDyn();occKey='';cam(true);
  if(!tipShown){tipShown=true;let seen=false;try{seen=!!localStorage.getItem('townhunt-secret-tip')}catch(_){}if(!seen&&!joy.querySelector('.jt'))joy.insertAdjacentHTML('beforeend','<div class="jt">按住拖曳，走路</div>')}
  cancelAnimationFrame(raf);last=0;raf=requestAnimationFrame(loop)};
 function stop(hard=true){on=false;cancelAnimationFrame(raf);closeCard(true);if(hard){clearLayers();setPano(false,true)}}
 H.NGHOOKS.push(sc=>{if(sc!==C.n)stop(true)});

 /* ---- 全景（測試用）：可以縮小看整張、拖到任何地方 ---- */
 function setPano(v,quiet){pano=!!v;document.body.classList.toggle('pano',pano);if(!on&&!quiet)return;H.rezoom();
  if(quiet)return;if(pano){const SC=H.SCENES[C.n],sc=H.scr();H.tweenTo(sc.base*.28,(SC.x0+SC.x1)/2,(SC.y1)/2,500);H.toast('🧪 全景：可以拖曳、縮放看整張秘境\n再按一次「全景」回到角色',3200)}
  else{cam(true);H.toast('回到角色',1200)}}
 E.pano=v=>{if(v===undefined)return pano;setPano(v)};

 /* ---- 點擊 ---- */
 const near=(x,y)=>Math.hypot(x-P.x,y-P.y)<=REACH;
 const tooFar=()=>{const t=performance.now();if(t-farT>1400){farT=t;H.toast('再走近一點才拿得到',1300)}};
 E.tap=(wx,wy)=>{if(busy())return;const s=H.view().s,tol=Math.max(0,14/s-10);
  /* 2. 幸運草 */
  for(const c of [clv.story,clv.bonus]){if(c&&c.revealed&&!c.found&&Math.hypot(wx-c.host.x,wy-(c.host.y-6))<16+tol){if(!near(c.host.x,c.host.y))return tooFar();gotClover(c);return}}
  /* 3. 物件（含干擾物） */
  let best=null,bd=1e9;for(const o of all){if(o.found||o.hidden||o.held)continue;const d=Math.hypot(o.x-wx,o.y-(wy+2));if(d<o.r*o.sc+6+tol&&d<bd){best=o;bd=d}}
  if(best){if(!near(best.x,best.y))return tooFar();openCard(best);return}
  /* 3.5 故事人物（看得到就能點；物件優先，免得藏在人旁邊的東西點不到） */
  for(const [id,e] of Object.entries(ent)){if(e.gone||!e.role)continue;if(Math.abs(wx-e.x)<e.w*.6+tol&&wy<=e.y+8+tol&&wy>=e.y-e.h-10-tol){roleTap(e.role);return}}
  /* 4. 可以翻開的東西 */
  {let hb=null,hd=1e9;for(const h of FL){if(Math.abs(wx-h.x)<h.w*.55+tol&&wy<=h.y+6+tol&&wy>=h.y-h.h-6-tol){const d=Math.hypot(wx-h.x,wy-(h.y-h.h*.4));if(d<hd){hd=d;hb=h}}}
   if(hb){if(!near(hb.x,hb.y))return tooFar();flip(hb);return}}
  /* 5. 場景小互動 */
  if(C.tapScene&&C.tapScene(wx,wy,E))return;
  ripple(wx,wy)};
 function ripple(x,y){const fx=document.getElementById('fx'),g=document.createElementNS(NSv,'circle');g.setAttribute('cx',x);g.setAttribute('cy',y);g.setAttribute('fill','none');g.setAttribute('stroke','#7a6e60');g.setAttribute('stroke-width',2/H.view().s);fx.appendChild(g);
  const t0=performance.now();const st=t=>{const k=(t-t0)/400;if(k>=1){g.remove();return}g.setAttribute('r',(4+12*k)/H.view().s);g.setAttribute('opacity',1-k);requestAnimationFrame(st)};requestAnimationFrame(st)}

 /* ---- 翻開 ---- */
 function flip(h){const c=h.clover,canC=c&&!c.revealed&&!c.found&&(c.kind==='bonus'||story.done);
  if(h.open){if(canC){reveal(c);return}H.toast(C.flipName(h)+'已經翻過了',1200);return}
  h.open=true;const el=spEl(h.sp);if(el)el.style.display='none';drawFlips();H.burst(h.x,h.y-h.h*.4);try{H.tone(300,.12,'triangle',.08);H.tone(420,.1,'triangle',.06,.08)}catch(_){}
  if(h.hold){h.hold.hidden=false;drawItems();const el2=document.querySelector(`#secI .sitem[data-k="${all.indexOf(h.hold)}"]`);if(el2){el2.classList.add('cpop')}H.toast(`${C.flipName(h)}底下有東西！走近點一下拿起來看看。`,2000);return}
  if(canC){reveal(c);return}
  H.toast(C.emptyMsg(h),1300)}
 function reveal(c){c.revealed=true;drawItems();sparks();H.burst(c.host.x,c.host.y-6);H.sfx.found();H.toast(c.kind==='bonus'?'咦？這底下竟然藏著一株幸運草！':'找到了！幸運草就藏在這裡！',1800)}
 function gotClover(c){c.found=true;drawItems();sparks();const g=H.game();if(c.kind==='story'){g.clover=true;H.colClover(C.n)}else{g.bonus=true;H.colBonus(C.n)}
  H.burst(c.host.x,c.host.y-6);H.floatText(c.host.x,c.host.y-26,c.kind==='bonus'?'隱藏幸運草！':'幸運草！');H.sfx.typeDone();
  H.toast(c.kind==='bonus'?'✨ 找到隱藏的幸運草！過關時會多一顆隱藏星星':'🍀 拿到這座島的幸運草了！',2600)}

 /* ---- 特寫卡：拿起來檢查 ---- */
 const ov=document.createElement('div');ov.className='overlay hide';ov.id='secCard';document.body.appendChild(ov);
 function pause(){if(pausedAt)return;pausedAt=performance.now();H.clockHold()}
 function resume(){const g=H.game();if(pausedAt&&g.running)g.t0+=performance.now()-pausedAt;pausedAt=0;if(g.running)H.clockRun(false)}
 E.pause=pause;E.resume=resume;
 function openCard(o){const I=C.inspect[o.id];card=o;o.held=true;drawItems();pause();try{H.tone(520,.08,'triangle',.08)}catch(_){}
  const name=o.decoy?I.name:o.t.name;
  ov.innerHTML=`<div class="pcard"><b class="ttl">${I.pick||'拿起來看看'}</b><p class="sub">${I.hintQ||'是要找的東西嗎？'}</p><div class="box"><svg viewBox="-50 -50 100 100"><g id="scStage" stroke="${OL}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><g id="scBg"></g><g id="scItem"><g id="scIn" transform="scale(2.5)">${I.front}</g></g><g id="scFx"></g></g></svg></div>
   <p class="note" id="scNote">${I.first||'先檢查一下，再決定是不是它。'}</p><button class="sbtn act" id="scAct">${I.btn}</button>
   <div class="row2"><button class="sbtn" id="scBack">↩ 放回去</button><button class="pbtn" id="scYes">✓ 就是它</button></div></div>`;
  ov.classList.remove('hide');
  ov.querySelector('#scAct').onclick=e=>{e.currentTarget.disabled=true;doInspect(I,()=>{$('#scNote').innerHTML=I.note})};
  ov.querySelector('#scBack').onclick=()=>{closeCard();H.toast('放回原地了',1000)};
  ov.querySelector('#scYes').onclick=()=>{if(o.decoy){closeCard();try{H.tone(260,.16,'sine',.08)}catch(_){}H.toast('好像不是這個⋯先放回原地吧',2200);return}
   closeCard();found(o)};
  E.cardEl=ov}
 function closeCard(silent){if(!card)return;card.held=false;card=null;ov.classList.add('hide');ov.innerHTML='';if(!silent){drawItems();resume()}else pausedAt=0}
 /* 檢查的小動作：turn 轉過來看背面、flip 翻面／翻過來看底部、spin 轉一圈、mag 放大鏡、light 對著光 */
 function doInspect(I,done){const it=$('#scItem'),inn=$('#scIn'),fxg=$('#scFx'),bg=$('#scBg');const t0=performance.now();
  const swap=()=>{inn.innerHTML=I.after};
  const run=(D,fn,end)=>{const st=t=>{const k=Math.min(1,(t-t0)/D);fn(k);if(k<1)requestAnimationFrame(st);else end&&end()};requestAnimationFrame(st)};
  try{H.tone(440,.12,'sine',.07)}catch(_){}
  if(I.act==='turn'||I.act==='flip'){let sw=false;run(700,k=>{const c=Math.cos(k*Math.PI);if(!sw&&k>=.5){sw=true;swap()}const a=Math.abs(c);it.setAttribute('transform',I.act==='turn'?`scale(${f(Math.max(.02,a))},1)`:`scale(1,${f(Math.max(.02,a))})`)},()=>{it.setAttribute('transform','');done()})}
  else if(I.act==='spin'){let sw=false;run(1100,k=>{if(!sw&&k>=.75){sw=true;swap()}const a=Math.abs(Math.cos(k*Math.PI*2));it.setAttribute('transform',`scale(${f(Math.max(.05,a))},1)`)},()=>{it.setAttribute('transform','');done()})}
  else if(I.act==='light'){bg.innerHTML=`<circle id="scSun" cx="0" cy="-6" r="1" fill="#fff6c4" stroke="none"/><circle id="scSun2" cx="0" cy="-6" r="1" fill="#fffbe6" stroke="none"/>`;let sw=false;
   run(900,k=>{$('#scSun').setAttribute('r',f(46*k));$('#scSun2').setAttribute('r',f(30*k));if(!sw&&k>=.55){sw=true;swap()}it.setAttribute('transform',`translate(0,${f(-6*Math.sin(k*Math.PI/2))})`)},done)}
  else if(I.act==='mag'){const [lx,ly]=I.lens||[6,-6];fxg.innerHTML=`<defs><clipPath id="scClip"><circle r="26"/></clipPath></defs><g id="scMag"><g clip-path="url(#scClip)"><circle r="26" fill="#fbf3e2" stroke="none"/>${I.after}</g><circle r="26" fill="none" stroke-width="3.2"/><circle r="26" fill="none" stroke="#fff" stroke-width="1" opacity=".7"/><path d="M18,18 L34,34" stroke-width="7"/><path d="M18,18 L34,34" stroke="#a8703f" stroke-width="4.4"/></g>`;
   const mg=$('#scMag');run(800,k=>{const e=1-Math.pow(1-k,3);mg.setAttribute('transform',`translate(${f(60+(lx-60)*e)},${f(50+(ly-50)*e)})`)},done)}
  else{swap();done()}}

 /* ---- 找到 ---- */
 function found(o){o.found=true;H.colAdd(o.id);drawItems();H.burst(o.x,o.y);const left=real.filter(x=>x.id===o.id&&!x.found).length;
  H.floatText(o.x,o.y-26,left?o.t.short+'！':o.t.short+' 找齊了！');H.updateCounts(o.id);if(left)H.sfx.found();else H.sfx.typeDone();
  if(!real.some(x=>!x.found))setTimeout(()=>H.win(),500)}

 /* ---- 連環小故事（5 步：提問的人 → 目標 → 幫手 → 目標 → 提問的人） ---- */
 function roleTap(role){const S=STORIES[C.n];if(!S)return;
  if(story.done){H.toast(role==='giver'?`${S.who}：謝謝你！`:C.story.thanks?.[role]||'牠現在很開心～',1800);return}
  const want=SEQ[story.step];
  if(role===want){const k=story.step,msg=[S.ask,S.need,S.got,S.ok][k];const go=()=>{story.step++;if(story.step>=SEQ.length){finish();return}H.toast(msg,4600);if(story.step===1)setBub('giver','…');if(story.step===3)H.sfx.found()};
   const hook=C.story.on&&C.story.on[k];if(hook){cut++;pause();hook(E,()=>{cut--;resume();go()})}else go();return}
  const hint=role==='giver'?(story.step===0?S.ask:`${S.who}：拜託你了，${story.step>=4?'快帶回來給我！':'找到了嗎？'}`)
   :role==='target'?(story.step===0?(C.story.who0||'這是誰家的寶貝？好像有人在找牠⋯'):story.step===2?S.need:'牠乖乖跟著你，快帶回去吧！')
   :(story.step<2?(C.story.busy||'（看起來正在忙⋯也許之後會需要幫忙）'):'已經幫過你囉！');
  H.toast(hint,3400);if(story.step===0&&role==='giver'){story.step=1;setBub('giver','…')}}
 function setBub(id,t){const e=ent[id];if(e){e.bub=t;e.drawn=null}}
 E.setBub=setBub;
 function finish(){story.done=true;story.step=SEQ.length;const S=STORIES[C.n],g=ent.giver;setBub('giver','♥');H.colStory(C.n);H.sfx.typeDone();
  if(C.story.finish)C.story.finish(E);
  if(g){H.burst(g.x,g.y-40);H.floatText(g.x,g.y-70,'📖 故事完成！')}
  const c=clv.story;sparks();
  if(c&&!c.found)H.toast(`📖 ${S.title}：完成！\n${S.who}：謝謝你！我看到 🍀 幸運草藏在${C.where(g||P,c.host)}，去翻翻看！`,6500);
  else if(!c){H.game().clover=true;H.colClover(C.n);H.toast(`📖 故事完成：${S.title}！送你一株幸運草 🍀`,3200)}}
 E.storyState=()=>story;E.clovers=()=>clv;E.P=P;E.all=()=>all;E.flips=()=>FL;E.near=near;E.REACH=REACH;
 E.cut=v=>{cut+=v};E.busy=busy;

 /* 測試用 */
 H.dbg.secret=H.dbg.secret||{};H.dbg.secret[C.n]={E,P,all:()=>all,real:()=>real,flips:()=>FL,story:()=>story,clv:()=>clv,ent:()=>ent,
  joy:(x,y)=>{JV.x=x;JV.y=y},set:(x,y)=>{P.x=x;P.y=y;cam(true);drawDyn()},tap:(x,y)=>E.tap(x,y),card:()=>card,walkable,solid,
  screen:(x,y)=>{const v=H.view(),r=document.getElementById('stage').getBoundingClientRect();return [r.left+x*v.s+v.tx,r.top+y*v.s+v.ty]}};
 return E}
H.SECRET={make,REACH,ZOOM};
})();
