/* 奇幻小鎮大搜查．第 8 關 竹林神社
   需要 sakura_common.js、level7.js（老朋友：招財貓、風鈴）。
   使用者定案：場景 D（兩段式：下段竹林＋小溪，石階上到上段白砂神社院）；光線＝清晨薄霧（霧要像不規則、稀疏的雲朵，不是橢圓）；
   鹿威放在小溪東岸、石階前的小空地；小溪 1 座木橋。
   場景（上北下南）：南＝竹林入口；小徑蜿蜒到小溪和木橋；東岸小空地有鹿威；石階往上是白砂神社院（主殿、手水舍、狛犬、繪馬架、御神籤架、御神木）；
   西側稻荷小神社（連續小鳥居＋石狐狸）；北端遠處竹縫間露出天守閣屋頂（第 9 關伏筆）。 */
(function(){
const H=window.TH;if(!H)return;
const N=8;
const {T,f,r,sr,pk,ri,OL,kid,act,add,mark,canPlace,scatter,skyBirds,KIND,POOL,VPLAN,REG,SCREG,LEVELS,ART,DECOY,SCENE_IMPL,
 WATERFN,RIDES,HERE,OUTFITS,STORIES,HOSTK,HOSTN,TAPHOOKS,MAPHOOKS,ALWAYSX,HEAVYX,tone,typeOf}=H;
const S=H.SAKURA;if(!S)return;
const C=S.C;

/* ================= 1. 場景範圍、天空（清晨薄霧）、場地邊緣 ================= */
H.SCENES[N]={x0:600,x1:1900,y1:2400,c:[1250,1950]};
H.TARGET[N]=330;
H.SKYC[N]='#e6eeea';H.SKYY[N]=170;
H.EDGEM[N]='';H.EDGED[N]='LRB';
H.EDGEDECO[N]=[['skBamboo',3],['bush',.8],['round',.5]];
H.FRINGE[N]=[['grassClump',2.4],['skBamboo',1]];
H.DENS[N]=1.33;
H.FRINGEX[N]=[[880,2050,1150,2350],[740,1060,960,1340]]; /* 早操那塊不要長竹子 */

/* ================= 2. 當地人的穿著：沉穩的顏色、薄外套（和服之後讓主專案做） ================= */
OUTFITS[N]=o=>{if(o.top)return o;
 /* 主帳號合併時補：約 7 成穿和服（神社參拜：和服＋羽織、振袖較多，浴衣少） */
 if(r()<.7){const st=pk(['C','C','A','A','B']);o.top='kimono';o.bottom='kimono';o.kim=st;
  o.shirt=pk(st==='B'?['#3e5e8a','#e8eef6','#fbf6ea','#7a9ac8']:['#5f7a6a','#8a6aa8','#c8645a','#3b5a8a','#e8c86a','#f4b6c2']);
  o.obi=pk(['#f0c040','#d8413a','#3b5a8a','#fbf6ea','#e8a0b4']);o.pat=st==='B'?pk(['#3b5a8a','#fbf6ea','#5f8a3a']):pk(['#fde4ec','#fff','#f7c4d3','#e8c86a']);
  if(st!=='C')o.hat=-1;return o}
 o.top=pk(['long','long','coat','tee']);o.bottom=pk(['pants','pants','shorts']);
 o.shirt=o.shirt||pk(['#5f7a6a','#3e5e8a','#fbf6ea','#c8645a','#8a6aa8','#e8c86a','#9a8a6a','#7a9ac8']);return o};

/* ================= 3. 物件與干擾物（畫在 0,0 附近約 30×30） ================= */
const gold='#f0c040';
Object.assign(ART,{
 sk_omamori:`<path d="M0,-12 q-4,-5 0,-9 q4,4 0,9" fill="none" stroke="${OL}" stroke-width="3.4"/><path d="M0,-12 q-4,-5 0,-9 q4,4 0,9" fill="none" stroke="${gold}" stroke-width="1.6"/><rect x="-8.5" y="-12" width="17" height="25" rx="3" fill="#d8413a"/><path d="M-8.5,-6 H8.5" fill="none" stroke="${gold}" stroke-width="1.6"/><path d="M-4,-3 V10 M4,-3 V10" fill="none" stroke="#f08a80" stroke-width="1"/><circle cx="0" cy="4" r="3.4" fill="${gold}" stroke-width="1.1"/>`,
 sk_ema:`<path d="M0,-16 q-3,-5 0,-7 q3,2 0,7" fill="none" stroke="#d8413a" stroke-width="1.6"/><path d="M-12,13 V-4 L0,-15 L12,-4 V13Z" fill="#e2bd80"/><path d="M-8,0 H8 M-8,4 H8 M-8,8 H8" fill="none" stroke="#c9a060" stroke-width=".8"/><path d="M-6,5 q1,-7 6,-7 l3,-3 l1,3 q4,1 4,5 l-1,5 h-2 l0,-3 h-6 l-1,3 h-2Z" fill="#8a4a2a" stroke-width="1"/>`,
 sk_kagura:`<path d="M0,-14 V10" fill="none" stroke="${OL}" stroke-width="4.6"/><path d="M0,-14 V10" fill="none" stroke="#c99a5b" stroke-width="2.4"/><g fill="${gold}" stroke-width="1.1"><circle cx="-7" cy="-12" r="3.2"/><circle cx="7" cy="-12" r="3.2"/><circle cx="0" cy="-15" r="3.2"/><circle cx="-8" cy="-5" r="3.4"/><circle cx="8" cy="-5" r="3.4"/><circle cx="0" cy="-8" r="3.4"/></g><path d="M-3,6 Q-6,14 -3,20 M3,6 Q6,14 3,20" fill="none" stroke="#d8413a" stroke-width="2.4"/><path d="M-3,8 Q0,12 3,8 M-3,13 Q0,17 3,13" fill="none" stroke="#fbf6ea" stroke-width="1.6"/>`,
 sk_omikuji:`<path d="M-3,-10 L-4,-20 M1,-10 L1,-22 M5,-10 L7,-19" fill="none" stroke="#e2bd80" stroke-width="2.4"/><path d="M-4,-20 l1,3 M1,-22 l0,3 M7,-19 l-1,3" stroke="#d8413a" stroke-width="2.4" fill="none"/><path d="M-10,-9 H10 L11,11 Q0,15 -11,11Z" fill="#b5703a"/><path d="M-10,-9 Q0,-5 10,-9" fill="none" stroke-width="1.2"/><path d="M-4,-7 L-5,12 M4,-7 L5,12" fill="none" stroke="#8a5028" stroke-width="1.1"/><rect x="-5" y="-3" width="10" height="8" rx="1" fill="#fbf6ea" stroke-width="1"/>`,
 sk_hishaku:`<path d="M-13,15 L7,-5" fill="none" stroke="${OL}" stroke-width="5"/><path d="M-13,15 L7,-5" fill="none" stroke="#d8c070" stroke-width="2.8"/><path d="M-9,11 l3,3 M-3,5 l3,3" stroke="#a89040" stroke-width="1.2" fill="none"/><path d="M4,-10 Q4,2 13,2 Q16,-8 9,-14Z" fill="#d8c070" transform="rotate(10 8 -6)"/><ellipse cx="9.5" cy="-8" rx="5.6" ry="3.4" fill="#5a4a20" transform="rotate(40 9.5 -8)" stroke-width="1"/>`,
 sk_komainu:`<ellipse cx="0" cy="11" rx="13" ry="3.6" fill="#a9a597"/><rect x="-10" y="4" width="20" height="8" rx="1.5" fill="#b8b3a4"/><path d="M-7,5 Q-9,-8 -2,-11 H3 Q9,-8 7,5Z" fill="#c9c5b8"/><g fill="#c9c5b8" stroke-width="1.1"><circle cx="-6" cy="-9" r="3.6"/><circle cx="0" cy="-12" r="3.8"/><circle cx="6" cy="-9" r="3.6"/><circle cx="-8" cy="-3" r="3"/><circle cx="8" cy="-3" r="3"/></g><circle cx="0" cy="-6" r="6" fill="#d4d0c4"/><circle cx="-2.4" cy="-7" r="1" fill="${OL}" stroke="none"/><circle cx="2.4" cy="-7" r="1" fill="${OL}" stroke="none"/><path d="M-3,-3 Q0,0 3,-3" fill="#3a2e2a" stroke-width="1"/>`,
 sk_takekopter:`<path d="M0,-6 V20" fill="none" stroke="${OL}" stroke-width="4.6"/><path d="M0,-6 V20" fill="none" stroke="#d8c070" stroke-width="2.4"/><path d="M-15,-9 Q-6,-14 0,-8 Q6,-2 15,-7 Q6,-9 0,-6 Q-8,-5 -15,-9Z" fill="#c8b060"/><path d="M-12,-8 Q0,-9 12,-7" fill="none" stroke="#a89040" stroke-width="1"/><circle cx="0" cy="-7" r="2" fill="#8a6a4a" stroke-width="1"/>`,
 sk_shimenawa:`<path d="M-13,-4 Q-14,-14 0,-14 Q14,-14 13,-4 Q12,2 0,2 Q-12,2 -13,-4Z" fill="none" stroke="${OL}" stroke-width="7"/><path d="M-13,-4 Q-14,-14 0,-14 Q14,-14 13,-4 Q12,2 0,2 Q-12,2 -13,-4Z" fill="none" stroke="#d8c070" stroke-width="4.4"/><path d="M-10,-12 l3,6 M-3,-14 l3,6 M4,-14 l3,6 M10,-10 l3,5" stroke="#a89040" stroke-width="1" fill="none"/><path d="M-7,2 l-2,6 l4,-1 l-3,7 M6,2 l-2,6 l4,-1 l-3,7" fill="#fbf9f3" stroke-width="1.2"/>`,
 sk_shishi:`<path d="M-9,14 L-3,-4 M9,14 L3,-4" fill="none" stroke="#8a6a4a" stroke-width="3.4"/><path d="M-5,-4 H5" fill="none" stroke="#8a6a4a" stroke-width="3.4"/><g transform="translate(0,-5) rotate(-20)"><rect x="-14" y="-4" width="28" height="8" rx="4" fill="#8fb05a"/><path d="M-4,-4 v8 M7,-4 v8" stroke="#6a8a3a" stroke-width="1.2" fill="none"/><ellipse cx="14" cy="0" rx="2" ry="4" fill="#2b3a1a" stroke-width="1"/></g><rect x="-13" y="12" width="26" height="6" rx="2" fill="#b8b3a4"/><path d="M-15,-14 q3,5 0,9" fill="none" stroke="#8fd0e8" stroke-width="2"/>`,
 sk_goshuin:`<path d="M-13,-9 L-8,-12 L-3,-9 L2,-12 L7,-9 L12,-12 V9 L7,12 L2,9 L-3,12 L-8,9 L-13,12Z" fill="#fbf6ea"/><path d="M-8,-12 V9 M-3,-9 V12 M2,-12 V9 M7,-9 V12" fill="none" stroke-width=".9"/><rect x="-14" y="-10" width="12" height="22" rx="1.5" fill="#3e5e8a"/><g stroke="#fbf6ea" stroke-width=".9" fill="none"><path d="M-12,-6 l4,4 l4,-4 M-12,0 l4,4 l4,-4 M-12,6 l4,4 l4,-4"/></g><path d="M-2,-4 H12" fill="none" stroke="#d8413a" stroke-width="2.4"/>`});
Object.assign(DECOY,{
 skPouch:`<path d="M-4,-10 H4 Q14,-4 13,6 Q12,13 0,13 Q-12,13 -13,6 Q-14,-4 -4,-10Z" fill="#6a8ac8"/><path d="M-5,-9 Q0,-6 5,-9" fill="none" stroke-width="1.4"/><path d="M-4,-10 Q-9,-15 -3,-16 M4,-10 Q9,-15 3,-16" fill="none" stroke="#e8c86a" stroke-width="1.8"/>`,
 skBlankPlank:`<path d="M-12,13 V-4 L0,-15 L12,-4 V13Z" fill="#e2bd80"/><path d="M-8,0 H8 M-8,4 H8 M-8,8 H8 M-6,-4 H6" fill="none" stroke="#c9a060" stroke-width=".8"/><path d="M0,-16 q-3,-5 0,-7 q3,2 0,7" fill="none" stroke="#8a6a4a" stroke-width="1.6"/>`,
 skCowbell:`<path d="M-4,-16 Q0,-22 4,-16" fill="none" stroke="#8a5a32" stroke-width="3"/><path d="M-10,12 Q-11,-4 -6,-12 H6 Q11,-4 10,12Z" fill="#b8802a"/><path d="M-10,12 H10" fill="none" stroke-width="1.4"/><path d="M-6,-4 H6" fill="none" stroke="#e0a840" stroke-width="1.4"/><circle cx="0" cy="14" r="2.6" fill="#6a4a1a" stroke-width="1"/>`,
 skPenHolder:`<path d="M-7,-14 L-4,-3 M0,-17 V-3 M6,-13 L3,-3" fill="none" stroke-width="2.6"/><path d="M-7,-14 L-4,-3" stroke="#4f7fb0" stroke-width="1.4"/><path d="M0,-17 V-3" stroke="#d8413a" stroke-width="1.4"/><path d="M6,-13 L3,-3" stroke="#f5c842" stroke-width="1.4"/><path d="M-9,-4 H9 V12 Q0,15 -9,12Z" fill="#8fc4a0"/><path d="M-9,-4 Q0,0 9,-4" fill="none" stroke-width="1.2"/>`,
 skBambooTube:`<rect x="-6" y="-12" width="12" height="25" rx="2" fill="#8fb05a"/><path d="M-6,0 H6" fill="none" stroke="#6a8a3a" stroke-width="1.6"/><ellipse cx="0" cy="-12" rx="6" ry="2.6" fill="#2b3a1a" stroke-width="1.2"/><path d="M-3,-6 V-3 M3,5 V8" stroke="#b5d080" stroke-width="1" fill="none"/>`,
 skDogFigure:`<ellipse cx="0" cy="11" rx="12" ry="3" fill="#a9a597"/><path d="M-8,10 Q-10,-2 -3,-5 H4 Q10,-2 8,10Z" fill="#d8b070"/><circle cx="0" cy="-8" r="7" fill="#d8b070"/><path d="M-6,-12 Q-12,-8 -9,-2 Q-6,-4 -5,-8Z M6,-12 Q12,-8 9,-2 Q6,-4 5,-8Z" fill="#8a5a32"/><circle cx="-2.4" cy="-8" r="1" fill="${OL}" stroke="none"/><circle cx="2.4" cy="-8" r="1" fill="${OL}" stroke="none"/><ellipse cx="0" cy="-4.6" rx="2" ry="1.4" fill="${OL}" stroke="none"/>`,
 skPropeller:`<path d="M0,0 V20" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M0,0 V20" fill="none" stroke="#fbf9f3" stroke-width="2.2"/><path d="M0,0 L-13,-6 L-7,-12Z" fill="#d8413a"/><path d="M0,0 L7,-12 L13,-6Z" fill="#f5c842"/><path d="M0,0 L0,12 L-9,8Z" fill="#4f7fb0"/><circle r="2.6" fill="#fbf9f3" stroke-width="1.1"/>`,
 skRopeRing:`<path d="M-13,-2 Q-13,-14 0,-14 Q13,-14 13,-2 Q13,10 0,10 Q-13,10 -13,-2Z" fill="none" stroke="${OL}" stroke-width="6.4"/><path d="M-13,-2 Q-13,-14 0,-14 Q13,-14 13,-2 Q13,10 0,10 Q-13,10 -13,-2Z" fill="none" stroke="#b8905a" stroke-width="3.6"/><path d="M-9,-10 l3,5 M2,-14 l3,5 M10,-6 l-1,5 M-1,10 l3,-5 M-11,4 l4,-2" stroke="#8a6a3a" stroke-width="1" fill="none"/>`,
 skBambooPipe:`<g transform="rotate(-25)"><rect x="-16" y="-5" width="32" height="10" rx="5" fill="#8fb05a"/><path d="M-6,-5 v10 M7,-5 v10" stroke="#6a8a3a" stroke-width="1.4" fill="none"/><ellipse cx="16" cy="0" rx="2.2" ry="5" fill="#2b3a1a" stroke-width="1"/></g><path d="M14,10 q-2,5 0,9" fill="none" stroke="#8fd0e8" stroke-width="2.2"/>`,
 /* skNotebook（2026-11-11 使用者選 D：原本藍色螺旋筆記本太突兀，改成綠色和紙手帳；名字沿用 skNotebook） */
 skNotebook:`<rect x="-11" y="-13" width="22" height="27" rx="2" fill="#5f7a6a"/><rect x="-6" y="-9" width="10" height="16" rx="1" fill="#fbf6ea" stroke-width="1"/><path d="M-4,-5 h6 M-4,-1 h6 M-4,3 h4" stroke="#9a9488" stroke-width="1"/><path d="M11,-13 V14" stroke="#e8c86a" stroke-width="2"/>`});
const dec=(id,s=.95)=>({w:28,h:28,fn:()=>T(0,-12,s,DECOY[id])});
Object.assign(KIND,{skPouch:dec('skPouch'),skBlankPlank:dec('skBlankPlank'),skCowbell:dec('skCowbell'),skPenHolder:dec('skPenHolder'),skBambooTube:dec('skBambooTube'),
 skDogFigure:dec('skDogFigure'),skPropeller:dec('skPropeller'),skRopeRing:dec('skRopeRing'),skBambooPipe:dec('skBambooPipe'),skNotebook:dec('skNotebook')});

/* 12 種 × 4 個。老朋友：招財貓、風鈴（第 7 關的）。 */
const RS={s:'sk8S',m:'sk8Mid',sh:'sk8Shrine',w:'sk8W',e:'sk8E',st:'sk8Stair'};
const rg=(...a)=>a.map(k=>RS[k]);
const old=(id,regions)=>({...typeOf(id),regions});
const TYPES=[
 old('sk_maneki',rg('sh','s','e','m')),old('sk_furin',rg('w','sh','m','st')),
 {id:'sk_omamori',name:'御守',short:'御守',r:14,rot:15,regions:rg('sh','e','m','st')},
 {id:'sk_ema',name:'繪馬',short:'繪馬',r:14,rot:12,regions:rg('e','sh','w','s')},
 {id:'sk_kagura',name:'神樂鈴',short:'神樂鈴',r:14,rot:15,regions:rg('sh','st','s','w')},
 {id:'sk_omikuji',name:'御神籤筒',short:'神籤筒',r:14,rot:10,regions:rg('e','m','sh','s')},
 {id:'sk_hishaku',name:'手水勺',short:'手水勺',r:14,rot:25,regions:rg('sh','m','w','st')},
 {id:'sk_komainu',name:'狛犬小像',short:'狛犬',r:14,rot:8,regions:rg('st','e','s','sh')},
 {id:'sk_takekopter',name:'竹蜻蜓',short:'竹蜻蜓',r:14,rot:20,regions:rg('s','m','w','e')},
 {id:'sk_shimenawa',name:'注連繩',short:'注連繩',r:14,rot:10,regions:rg('w','sh','st','m')},
 {id:'sk_shishi',name:'鹿威',short:'鹿威',r:14,rot:12,regions:rg('m','s','st','e')},
 {id:'sk_goshuin',name:'御朱印帳',short:'朱印帳',r:14,rot:15,regions:rg('m','e','w','sh')}];
LEVELS[N].types=TYPES;

/* ================= 4. 區域 ================= */
Object.assign(REG,{
 sk8S:{x:640,y:1940,w:1220,h:440},sk8Mid:{x:640,y:1440,w:1220,h:500},sk8Shrine:{x:840,y:300,w:820,h:700},
 sk8W:{x:620,y:300,w:300,h:1140},sk8E:{x:1640,y:300,w:260,h:1140},sk8Stair:{x:980,y:1000,w:540,h:440},sk8All:{x:620,y:260,w:1260,h:2120}});
H.SCREG[N]=['sk8S','sk8Mid','sk8Shrine','sk8W','sk8E','sk8Stair','sk8All'];
WATERFN[N]=()=>false;
/* ================= 5. 幾何：小徑、小溪（座標是場景座標，往北＝y 變小） ================= */
const bz=(p,t)=>{const u=1-t,a=u*u*u,b=3*u*u*t,c=3*u*t*t,d=t*t*t;return [a*p[0][0]+b*p[1][0]+c*p[2][0]+d*p[3][0],a*p[0][1]+b*p[1][1]+c*p[2][1]+d*p[3][1]]};
const sample=(segs,n=30)=>{const o=[];segs.forEach(p=>{for(let i=0;i<=n;i++){const [x,y]=bz(p,i/n);o.push([x,y])}});return o};
const TRAILSEG=[[[1250,2400],[1069,2193],[1394,2040],[1250,1836]],[[1250,1836],[1250,1700],[1250,1560],[1250,1400]]];
const STREAMSEG=[[[180,1900],[300,1895],[450,1890],[600,1887]],[[600,1887],[925,1810],[1142,1963],[1503,1862]],[[1503,1862],[1650,1830],[1827,1912],[1900,1862]],[[1900,1862],[2040,1850],[2180,1860],[2320,1862]]];
const TP=sample(TRAILSEG),SP=sample(STREAMSEG);
const dmin=(P,x,y)=>P.reduce((m,q)=>Math.min(m,Math.hypot(q[0]-x,q[1]-y)),1e9);
const segD=s=>'M'+s[0][0]+s.map(p=>' C'+p[1]+' '+p[2]+' '+p[3]).join('');
const trailD=segD(TRAILSEG),streamD=segD(STREAMSEG);
const okPos=(x,y)=>{if(y>1400&&dmin(TP,x,y)<85)return false;if(dmin(SP,x,y)<75)return false;
 if(x>1120&&x<1380&&y>940&&y<1460)return false;if(x>760&&x<875&&y>560&&y<1070)return false;if(x>740&&x<960&&y>1060&&y<1340)return false;if(x>730&&x<1770&&y>955&&y<1045)return false;if(x>880&&x<1150&&y>2060&&y<2350)return false;/* 拍照、早操留空地 */
 if(x>1170&&x<1330&&y>600&&y<960)return false;return true};
['sk8S','sk8Mid','sk8Shrine','sk8W','sk8E','sk8Stair','sk8All'].forEach(k=>H.SCATOK[k]=okPos);

/* ================= 6. 薄霧：像雲朵的一團團（不規則、稀疏、邊緣有碎雲，不是橢圓） ================= */
function mistSvg(){const w=sr(140,250),n=ri(5,8);let x=-w/2,t='';
 for(let i=0;i<n;i++){x+=sr(w/n*.55,w/n*1.1);const edge=1-Math.abs(i/(n-1)-.5)*1.1;const rr=Math.max(7,sr(10,30)*edge);t+=`<circle cx="${f(x)}" cy="${f(sr(-12,8))}" r="${f(rr)}"/>`}
 t+=`<rect x="${f(-w*.38)}" y="${f(sr(-2,3))}" width="${f(w*.7)}" height="${f(sr(6,9))}" rx="4"/>`;
 for(let i=0;i<ri(3,5);i++){const sd=r()<.5?-1:1;t+=`<circle cx="${f(sd*(w/2+sr(6,40)))}" cy="${f(sr(-16,14))}" r="${f(sr(3,8))}"/>`}
 if(r()<.6)t+=`<rect x="${f(sr(-w*.6,-w*.1))}" y="${f(sr(12,18))}" width="${f(sr(24,60))}" height="5" rx="2.5"/>`;
 return `<g fill="#fff" stroke="none" opacity="${f(sr(.24,.38))}">${t}</g>`}
KIND.skMist={w:260,h:60,fn:mistSvg};


/* ================= 7a. 石階（2026-11-11 使用者看 A～D 選 B：筆直一整段，畫在地面層；原本 6 小段疊起來像鋸齒，又有竹林裡不該有的櫻花瓣） ================= */
const STB=1462,STT=966;
function stairG(){const ST='#cfc9b9',RS='#a9a597',ED='#9a9488',MOSS='#8fae6a',n=26,h=(STB-STT)/n,w=196,xc=1250;let t='';
 const wall=x=>`<path d="M${x-9},${STB} V${STT} H${x+9} V${STB}Z" fill="${ED}" stroke-width="1.6"/>`+Array.from({length:14},(_,i)=>`<path d="M${x-9},${f(STB-(i+.5)*35)} h18" fill="none" stroke-width="1"/>`).join('');
 t+=wall(xc-w/2-10)+wall(xc+w/2+10);
 for(let i=0;i<n;i++){const y=STB-i*h;
  t+=`<path d="M${xc-w/2},${f(y)} H${xc+w/2} V${f(y-h*.36)} H${xc-w/2}Z" fill="${RS}" stroke-width="1.3"/><path d="M${xc-w/2},${f(y-h*.36)} H${xc+w/2} V${f(y-h)} H${xc-w/2}Z" fill="${ST}" stroke-width="1.3"/>`;
  if(r()<.35)t+=`<ellipse cx="${f(xc+(r()<.5?-1:1)*(w/2-8))}" cy="${f(y-h*.7)}" rx="6" ry="2.4" fill="${MOSS}" stroke="none"/>`}
 return t}

/* ================= 7. 地面 ================= */
function ground(){
 const Sc=H.SCENES[N],X0=Sc.x0-420,WW=Sc.x1-Sc.x0+840;let g='';
 g+=`<rect x="${X0}" y="0" width="${WW}" height="${Sc.y1+420}" fill="#a9c47e" stroke="none"/>`;
 for(let i=0;i<54;i++){const x=sr(X0,X0+WW),y=sr(180,Sc.y1);g+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(50,130))}" ry="${f(sr(18,40))}" fill="${pk(['#b3d086','#9fbd72','#b8cf8a','#a2c078'])}" stroke="none" opacity=".65"/>`}
 /* 北邊（2026-11-11 使用者說原本的竹林小坡不自然）：遠山淡影＋天守閣屋頂（第 9 關伏筆）→ 一整片茂密竹林當背景（高低錯落、越下面越暗）→ 神社院北緣竹籬 */
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="560" fill="#e6eeea" stroke="none"/><path d="M${X0},120 L760,58 L900,96 L1080,40 L1250,84 L1420,34 L1600,90 L1760,52 L${X0+WW},110 V180 H${X0}Z" fill="#d5e2d2" stroke="none"/><path d="M${X0},150 Q860,92 1120,118 Q1400,86 1700,120 Q1800,128 ${X0+WW},146 V200 H${X0}Z" fill="#cbdbc6" stroke="none"/>`;
 g+=`<path d="M${X0},170 Q1000,96 1250,112 Q1500,92 ${X0+WW},170 V260 H${X0}Z" fill="#c9d8bf" stroke="none"/>`;
 g+=`<g transform="translate(1250,150) scale(1.15)"><path d="M-34,0 V-14 H34 V0Z" fill="#fbf9f3"/><g transform="translate(0,-14)">${S.tileRoof(92,14)}</g><path d="M-22,-14 V-26 H22 V-14Z" fill="#fbf9f3"/><g transform="translate(0,-26)">${S.tileRoof(66,12)}</g><path d="M-12,-26 V-36 H12 V-26Z" fill="#fbf9f3"/><g transform="translate(0,-36)">${S.tileRoof(44,11)}</g></g>`;
 {let b='';const GX0=X0,GX1=X0+WW;
  for(let x=GX0;x<GX1;x+=sr(9,15)){if(Math.abs(x-1250)<44&&r()<.85)continue;const top=sr(118,176)+(Math.abs(x-1250)<70?28:0),w=sr(5,8),c=pk(['#9cc068','#8fb05a','#a9c87a']);
   b+=`<rect x="${f(x)}" y="${f(top)}" width="${f(w)}" height="${f(296-top)}" fill="${c}" stroke="#5f7a3a" stroke-width=".8"/>`;for(let y=top+26;y<290;y+=sr(24,34))b+=`<path d="M${f(x)},${f(y)} h${f(w)}" stroke="#6a8a3a" stroke-width="1"/>`}
  /* 竹葉：細長、往下垂的一簇簇（2026-11-11 使用者說原本的淡綠橢圓很奇怪） */
  const leaf=(x,y,a,l,c)=>`<path d="M0,0 Q${f(l*.45)},${f(-l*.16)} ${f(l)},0 Q${f(l*.45)},${f(l*.12)} 0,0Z" fill="${c}" transform="translate(${f(x)},${f(y)}) rotate(${f(a)})"/>`;
  let lv='';for(let x=GX0;x<GX1;x+=sr(16,28)){if(Math.abs(x-1250)<52)continue;const y0=sr(112,176)+(Math.abs(x-1250)<80?26:0);
   for(let k=0;k<ri(2,3);k++){const yy=y0+k*sr(16,30),cx=x+sr(-6,6),c=pk(['#7fae5a','#6f9e4a','#8fbc66','#5f8e3e']);
    for(let m=0;m<ri(4,6);m++){const side=m%2?1:-1;lv+=leaf(cx,yy+sr(-3,3),side>0?sr(10,55):sr(125,170),sr(14,22),c)}}}
  b+=`<g stroke="none" opacity=".95">${lv}</g>`;
  b+=`<rect x="${GX0}" y="236" width="${GX1-GX0}" height="62" fill="#3f5a2a" opacity=".22" stroke="none"/>`;
  g+=`<g>${b}</g>`}
 /* 上段白砂神社院：耙過的砂紋 */
 g+=`<path d="M744,292 H1756 V934 Q1756,970 1720,970 H780 Q744,970 744,934Z" fill="#e8e0cc"/>`;
 for(let k=0;k<18;k++){const y=318+k*36;if(y>950)break;g+=`<path d="M770,${y} Q900,${y-8} 1030,${y} T1290,${y} T1550,${y} T1730,${y}" fill="none" stroke="#d6cdb4" stroke-width="1.4"/>`}
 /* 神社院北緣的竹籬（四目垣） */
 g+=`<path d="M744,292 H1756" stroke="#c9b484" stroke-width="3" fill="none"/>`+Array.from({length:40},(_,i)=>`<path d="M${f(752+i*25.3)},298 V270" stroke="#a89040" stroke-width="3.4" fill="none"/>`).join("")+`<path d="M744,278 H1756 M744,288 H1756" stroke="#d8c070" stroke-width="3.4" fill="none"/><path d="M744,278 H1756 M744,288 H1756" stroke-width="1" fill="none" opacity=".6"/>`;
 g+=`<path d="M1250,970 V560" stroke="#d2cab4" stroke-width="124" fill="none"/><path d="M1250,970 V560" stroke="#e2dccd" stroke-width="116" fill="none" stroke-dasharray="2 30"/>`;
 g+=`<path d="M817,1070 V590" stroke="#d9c79a" stroke-width="74" fill="none"/>`;
 /* 神社院是墊高的台地（2026-11-11 使用者：石階上去的平台要看得出比較高）：南邊一道石垣擋土牆＋牆下的影子；稻荷小徑穿過牆的地方有小石階 */
 {const WY=966,WH=62,X0=744,X1=1756;let w=`<path d="M${X0},${WY+WH+12} H${X1}" stroke="#000" stroke-opacity=".12" stroke-width="22" fill="none"/>`;
  w+=`<path d="M${X0},${WY} H${X1} V${WY+WH-10} Q${X1},${WY+WH} ${X1-12},${WY+WH} H${X0+12} Q${X0},${WY+WH} ${X0},${WY+WH-10}Z" fill="#a9a597" stroke-width="2.2"/>`;
  const R2_=H.mulberry32?H.mulberry32(808):r;
  for(let row=0;row<3;row++){const y=WY+8+row*17;let x=X0+(row%2?-18:0);while(x<X1){const bw=34+R2_()*36,x1=Math.min(X1-2,x+bw);if(x1-Math.max(X0+2,x)>8)w+=`<rect x="${f(Math.max(X0+2,x))}" y="${y}" width="${f(x1-Math.max(X0+2,x)-3)}" height="14" rx="4" fill="${pk(['#b8b3a4','#c2bdae','#aea999'])}" stroke-width="1.1"/>`;x+=bw}}
  w+=`<path d="M${X0},${WY} H${X1}" stroke="#d8d2c2" stroke-width="7" fill="none"/><path d="M${X0},${WY+3.5} H${X1}" stroke-width="1.2" fill="none"/>`;
  for(let i=0;i<5;i++){const x=X0+60+R2_()*(X1-X0-120);if(Math.abs(x-1250)<130||Math.abs(x-817)<60)continue;w+=`<path d="M${f(x)},${WY+6} q-6,14 -2,26" fill="none" stroke="#6f9a4a" stroke-width="3"/>`}
  /* 稻荷小徑的小石階 */
  for(let i=0;i<4;i++){const y=WY+WH-i*(WH/4);w+=`<path d="M780,${f(y)} H854 V${f(y-WH/4*.4)} H780Z" fill="#a9a597" stroke-width="1.2"/><path d="M780,${f(y-WH/4*.4)} H854 V${f(y-WH/4)} H780Z" fill="#cfc9b9" stroke-width="1.2"/>`}
  g+=w}

 /* 下段：泥土小徑、小溪、東岸小空地 */
 g+=`<path d="${trailD}" fill="none" stroke="#d9c79a" stroke-width="84" stroke-linecap="round"/><path d="${trailD}" fill="none" stroke="#c9b484" stroke-width="2.4" stroke-dasharray="3 16" stroke-linecap="round"/>`;
 g+=`<path d="M1557,1560 q-120,10 -150,60 q-10,60 90,90 q150,30 210,-30 q50,-70 -40,-110 q-60,-26 -110,-10Z" fill="#d9c79a" stroke="none"/>`;
 g+=stairG();
 g+=`<path d="${streamD}" fill="none" stroke="#6aa8c8" stroke-width="96"/><path d="${streamD}" fill="none" stroke="#8fd0e8" stroke-width="82"/><path d="${streamD}" fill="none" stroke="#e8f8fc" stroke-width="2.2" stroke-dasharray="14 26"/>`;
 return `<g stroke="${OL}" stroke-width="2" stroke-linejoin="round">${g}</g>`}

/* ================= 8. 佈景圖鑑 ================= */
const shrineSvg=()=>`<ellipse cx="0" cy="2" rx="82" ry="7" fill="#000" opacity=".18" stroke="none"/><rect x="-64" y="-46" width="128" height="46" fill="#f4ecd8"/>`+[-60,-31,0,31,60].map(x=>`<rect x="${x-4}" y="-46" width="8" height="46" fill="#c8362f" stroke-width="1.4"/>`).join('')+`<rect x="-16" y="-32" width="32" height="32" fill="#3d322c"/><g transform="translate(0,-46)">${S.tileRoof(160,32)}</g><path d="M-50,-36 H50" stroke="#fbf6ea" stroke-width="3" fill="none"/><path d="M-12,-52 H12 V-44 H-12Z" fill="#c8362f" stroke="none"/>`;
const temizuya=()=>`<ellipse cx="0" cy="2" rx="28" ry="4" fill="#000" opacity=".16" stroke="none"/><rect x="-24" y="-14" width="48" height="14" rx="3" fill="#b8b3a4"/><ellipse cx="0" cy="-14" rx="21" ry="5" fill="#8fd0e8" stroke-width="1.5"/><path d="M-22,-14 V-36 M22,-14 V-36" stroke-width="3" fill="none"/><g transform="translate(0,-36)">${S.tileRoof(64,12)}</g><path d="M-6,-14 L-10,-24" stroke="#8fb05a" stroke-width="3" fill="none"/>`;
const komainuS=()=>`<ellipse cx="0" cy="2" rx="14" ry="3" fill="#000" opacity=".16" stroke="none"/><rect x="-12" y="-8" width="24" height="8" fill="#b8b3a4"/><path d="M-8,-8 Q-10,-24 -2,-28 H3 Q10,-24 8,-8Z" fill="#c9c5b8"/><g fill="#c9c5b8" stroke-width="1.2"><circle cx="-7" cy="-27" r="4"/><circle cx="0" cy="-31" r="4.4"/><circle cx="7" cy="-27" r="4"/><circle cx="-10" cy="-20" r="3.4"/><circle cx="10" cy="-20" r="3.4"/></g><circle cx="0" cy="-24" r="7" fill="#d4d0c4"/><circle cx="-2.8" cy="-25" r="1.1" fill="${OL}" stroke="none"/><circle cx="2.8" cy="-25" r="1.1" fill="${OL}" stroke="none"/><path d="M-3,-20 Q0,-17 3,-20" fill="#3a2e2a" stroke-width="1"/>`;
const emaRack=()=>`<ellipse cx="0" cy="2" rx="32" ry="4" fill="#000" opacity=".14" stroke="none"/><rect x="-30" y="-44" width="60" height="5" fill="${C.wood}"/><path d="M-28,-44 V0 M28,-44 V0" stroke-width="3.4" fill="none"/><path d="M-28,-24 H28" stroke="${C.wood}" stroke-width="3" fill="none"/>`+[-20,-7,6,19].map((x,i)=>`<path d="M${x-5.5},-38 h11 v11 l-5.5,5 l-5.5,-5Z" fill="#e2bd80" stroke-width="1.2"/><path d="M${x-5.5},-20 h11 v10 l-5.5,5 l-5.5,-5Z" fill="#e8c890" stroke-width="1.2"/>`).join('');
const omikujiRack=()=>`<ellipse cx="0" cy="2" rx="32" ry="4" fill="#000" opacity=".14" stroke="none"/><path d="M-28,0 V-40 M28,0 V-40" stroke-width="3.4" fill="none"/><rect x="-30" y="-44" width="60" height="5" fill="${C.wood}"/><path d="M-28,-30 H28 M-28,-16 H28" stroke="${C.wood}" stroke-width="3" fill="none"/>`+Array.from({length:9},(_,i)=>{const x=-24+i*6;return `<path d="M${x},-30 v8 l2,3 l-2,3 l2,3" fill="#fbf9f3" stroke-width="1"/><path d="M${x+1},-16 v7 l2,3 l-2,3" fill="#fbf9f3" stroke-width="1"/>`}).join('');
const goshinboku=()=>`<ellipse cx="0" cy="2" rx="40" ry="6" fill="#000" opacity=".18" stroke="none"/><path d="M-20,0 Q-26,-40 -14,-86 H14 Q26,-40 20,0Z" fill="#8a6a4a"/><path d="M-10,-6 V-70 M4,-4 V-76 M12,-10 V-60" stroke="#6a4a30" stroke-width="1.4" fill="none"/>`+
 `<g fill="#4f7a4a" stroke-width="2"><circle cx="-34" cy="-98" r="26"/><circle cx="32" cy="-100" r="28"/><circle cx="0" cy="-118" r="32"/><circle cx="-8" cy="-92" r="26"/></g>`+
 `<path d="M-22,-46 Q0,-38 22,-46" fill="none" stroke="${OL}" stroke-width="8"/><path d="M-22,-46 Q0,-38 22,-46" fill="none" stroke="#d8c070" stroke-width="5"/><path d="M-12,-40 l-2,10 l5,-2 l-3,12 M6,-38 l-2,10 l5,-2 l-3,12 M16,-42 l-2,9 l4,-1" fill="#fbf9f3" stroke-width="1.2"/>`;
const foxStone=()=>`<ellipse cx="0" cy="2" rx="12" ry="3" fill="#000" opacity=".16" stroke="none"/><rect x="-10" y="-7" width="20" height="7" fill="#b8b3a4"/><path d="M-7,-7 Q-9,-22 -2,-26 H3 Q9,-22 7,-7Z" fill="#c9c5b8"/><path d="M-6,-24 L-8,-35 L-1,-27 M6,-24 L8,-35 L1,-27" fill="#c9c5b8"/><path d="M-5,-18 Q0,-13 5,-18 L4,-11 Q0,-8 -4,-11Z" fill="#d8413a" stroke-width="1.2"/><path d="M8,-14 Q16,-18 14,-28 Q12,-20 8,-18Z" fill="#c9c5b8" stroke-width="1.2"/><circle cx="-2.4" cy="-22" r="1" fill="${OL}" stroke="none"/><circle cx="2.4" cy="-22" r="1" fill="${OL}" stroke="none"/>`;
const inariHut=()=>`<ellipse cx="0" cy="2" rx="36" ry="5" fill="#000" opacity=".16" stroke="none"/><rect x="-26" y="-26" width="52" height="26" fill="#f4ecd8"/><rect x="-26" y="-26" width="6" height="26" fill="#c8362f"/><rect x="20" y="-26" width="6" height="26" fill="#c8362f"/><rect x="-10" y="-18" width="20" height="18" fill="#3d322c"/><g transform="translate(0,-26)">${S.tileRoof(70,18)}</g><path d="M-8,-36 L-4,-30 M8,-36 L4,-30" stroke="#d8413a" stroke-width="3" fill="none"/>`;
const woodBridge=()=>`<rect x="-44" y="-62" width="88" height="124" fill="#c99a5b"/>`+Array.from({length:10},(_,i)=>`<path d="M-44,${-62+i*12.4} H44" stroke="#8a6a4a" stroke-width="1.6"/>`).join('')+`<rect x="-47" y="-64" width="8" height="128" fill="#c8362f"/><rect x="39" y="-64" width="8" height="128" fill="#c8362f"/>`;
const shishiSvg=()=>`<ellipse cx="0" cy="3" rx="32" ry="5" fill="#000" opacity=".16" stroke="none"/><rect x="-28" y="-8" width="56" height="10" rx="3" fill="#b8b3a4"/><ellipse cx="0" cy="-8" rx="25" ry="4.4" fill="#8fd0e8" stroke-width="1.4"/>`+
 `<path d="M-15,-8 V-32 M15,-8 V-32" stroke="#8a6a4a" stroke-width="4.4" fill="none"/><path d="M-15,-32 H15" stroke="#8a6a4a" stroke-width="4.4" fill="none"/>`+
 `<g class="skShTube" transform="translate(0,-28) rotate(-18)"><rect x="-24" y="-5.4" width="48" height="10.8" rx="5.4" fill="#8fb05a"/><path d="M-13,-5.4 v10.8 M11,-5.4 v10.8" stroke="#6a8a3a" stroke-width="1.5" fill="none"/><ellipse cx="24" cy="0" rx="2.6" ry="5.4" fill="#2b3a1a" stroke-width="1"/></g>`+`<path d="M-34,-42 q4,6 0,13" fill="none" stroke="#8fd0e8" stroke-width="2.6"/>`;
Object.assign(KIND,{skShrineHall:{w:160,h:110,fn:shrineSvg},skTemizuya:{w:62,h:52,fn:temizuya},skKomainuS:{w:30,h:44,fn:komainuS},skEmaRack:{w:62,h:48,fn:emaRack},skOmikujiRack:{w:62,h:48,fn:omikujiRack},
 skGoshinboku:{w:100,h:170,fn:goshinboku},skFoxStone:{w:26,h:40,fn:foxStone},skInariHut:{w:62,h:56,fn:inariHut},skWoodBridge:{w:100,h:130,fn:woodBridge},skShishiOdo:{w:72,h:64,fn:shishiSvg}});
Object.assign(HOSTN,{skBamboo:'竹叢',skTemizuya:'手水舍'});
['skBamboo','skLantern','skLanternDim','skTemizuya'].forEach(k=>HOSTK.add(k));
ALWAYSX[N]=new Set([]);
HEAVYX[N]=new Set(['skShrineHall','skTemizuya','skGoshinboku','skInariHut','skWoodBridge','skShishiOdo','skEmaRack','skOmikujiRack','skKomainuS','skFoxStone','skBamboo']);

/* ================= 9. 撒佈景 ================= */
const BAM=[['skBamboo',3.4],['bush',.6],['grassClump',1.2],['skLanternDim',.3]];
Object.assign(POOL,{
 sk8S:[...BAM,['skPouch',.3],['skBlankPlank',.3],['skPropeller',.3],['skBambooTube',.3],['skDogFigure',.25],['skDollCat',.2]],
 sk8Mid:[...BAM,['skCowbell',.3],['skRopeRing',.3],['skBambooPipe',.3],['skNotebook',.3],['skPenHolder',.25],['skBellString',.2]],
 sk8Shrine:[['skLantern',.7],['skLanternDim',.5],['bush',.5],['round',.3],['skPouch',.3],['skCowbell',.3],['skPenHolder',.3],['skDogFigure',.3],['skDollCat',.25],['skNotebook',.25]],
 sk8W:[...BAM,['skRopeRing',.3],['skBlankPlank',.3],['skBambooTube',.3],['skPropeller',.25],['skBellString',.2]],
 sk8E:[...BAM,['skPenHolder',.3],['skNotebook',.3],['skDogFigure',.3],['skBambooPipe',.3],['skDollCat',.2]],
 sk8Stair:[...BAM,['skRopeRing',.3],['skBambooPipe',.3],['skCowbell',.25],['skPouch',.25],['skBellString',.2]],
 sk8All:[['skBamboo',2.6],['bush',.5],['grassClump',1.4]]});
Object.assign(VPLAN,{sk8S:{walker:3,chat:2,carryBox:1},sk8Mid:{walker:3,chat:2,flowerWatch:2,reading:1},sk8Shrine:{chat:1,walker:1,sweep:1,painting:1},
 sk8W:{walker:2,chat:2,flowerWatch:1},sk8E:{chat:2,walker:2,reading:1},sk8Stair:{walker:1,chat:1},sk8All:{walker:2,chat:2}});


/* ================= 9b. 人群小故事（2026-11-11 使用者選：參拜搖鈴、神前婚禮、手水舍潑到爸爸、石階喘氣＋揹阿嬤、稻荷鳥居拍照、晨間早操）
   每組點了會說一句話（festTap8，接在 TAPHOOKS[N] 最前面） ================= */
const sh8=(w,o=.14)=>`<ellipse cx="3" cy="2" rx="${w}" ry="6" fill="#000" opacity="${o}" stroke="none"/>`;
const kimo=(o={})=>({top:'kimono',bottom:'kimono',kim:'C',hat:-1,...o});
const sweat8=(x,y)=>`<path d="M${x},${y} q-2,3.4 0,4.4 q2,-1 0,-4.4Z" fill="#cfe9f2" stroke-width=".9"/>`;
/* 參拜：賽錢箱＋鈴繩，小孩踮腳搖鈴，爸媽在旁邊拍手 */
const prayG=()=>{let t=sh8(40,.12);
 t+=`<rect x="-26" y="-34" width="52" height="16" rx="2" fill="#8a5a32"/><path d="M-22,-30 H22 M-22,-26 H22 M-22,-22 H22" fill="none" stroke="#5f3e22" stroke-width="1.2"/>`;
 t+=`<circle cx="2" cy="-112" r="7" fill="${gold}" stroke-width="1.6"/><path d="M-2,-110 h8" stroke-width="1.2" fill="none"/>`+
  `<path d="M2,-105 Q5,-80 2,-50" fill="none" stroke="${OL}" stroke-width="6"/><path d="M2,-105 Q5,-80 2,-50" fill="none" stroke="#d8413a" stroke-width="3.4"/><path d="M2,-100 l2,4 M3,-90 l2,4 M3,-80 l2,4 M3,-70 l2,4 M2,-60 l2,4" stroke="#fbf6ea" stroke-width="1.6"/>`;
 t+=act(-26,0,1,{view:'back',pose:'reach',...kimo({kim:'C',shirt:'#3e5e8a'})},'nod');
 t+=act(28,0,1,{view:'back',pose:'reach',...kimo({kim:'A',shirt:'#c8645a',pat:'#fde4ec'})},'nod');
 t+=act(2,-4,1,{view:'back',pose:'up2',s:.82,top:'long',bottom:'shorts',shirt:'#e8c86a',hat:-1},'hop');
 return t};
const queueG=()=>sh8(30,.1)+act(-14,0,1,{view:'back',pose:'stand',...kimo({kim:'C',shirt:'#5f7a6a'})},'lean')+act(14,4,1,{view:'bq',pose:'stand',...kimo({kim:'A',shirt:'#8a6aa8'})},'lean');
/* 神前婚禮：神職帶路，白無垢新娘撐紅傘，新郎黑紋付，親友跟在後面（大家都往主殿走，背影） */
const wataboshi=`<path d="M-12,-50 Q-13,-66 0,-67 Q13,-66 12,-50 Q6,-55 0,-55 Q-6,-55 -12,-50Z" fill="#fbfbf6" stroke-width="1.4"/>`;
const weddingG=()=>{let t='';
 t+=act(0,-104,1,{view:'back',pose:'stand',top:'kimono',bottom:'kimono',kim:'C',shirt:'#fbf6ea',obi:'#3e5e8a',pat:'#fbf6ea',hat:-1,hair:'#2f2622',hs:1},'step');
 t+=`<path d="M-4,-156 h8 l-1,-8 h-6z" fill="#2b2420" stroke-width="1"/>`;
 t+=sh8(34,.12);
 t+=act(-14,-44,1,{view:'back',pose:'stand',top:'kimono',bottom:'kimono',kim:'A',shirt:'#fbfbf6',obi:'#fbfbf6',pat:'#efeae0',hat:-1,hair:'#2f2622',hs:1,extra:wataboshi},'step');
 t+=act(16,-44,1,{view:'back',pose:'stand',top:'kimono',bottom:'kimono',kim:'C',shirt:'#2b2b30',obi:'#8a8a90',pat:'#2b2b30',hat:-1,hair:'#2f2622',hs:1},'step');
 t+=act(-40,-20,1,{view:'bq',pose:'hold',...kimo({kim:'C',shirt:'#c8362f',hs:1})},'step');
 t+=`<path d="M-33,-52 L-26,-124" stroke="#8a5a32" stroke-width="2.6"/><ellipse cx="-26" cy="-126" rx="27" ry="11" fill="#d8413a" stroke-width="1.8"/><path d="M-53,-126 Q-26,-119 1,-126 M-26,-137 V-115" fill="none" stroke="#a8322e" stroke-width="1.2"/><circle cx="-26" cy="-128" r="3" fill="#2b2420" stroke="none"/>`;
 t+=act(-14,22,1,{view:'back',pose:'stand',...kimo({kim:'C',shirt:'#3e5e8a',hs:1})},'step')+act(16,24,1,{view:'back',pose:'stand',...kimo({kim:'A',shirt:'#8a6aa8',pat:'#fde4ec',hs:2})},'step');
 return t};
/* 手水舍：小孩舀水太用力，潑到旁邊的爸爸 */
const ladle=`<g transform="translate(16,-24) rotate(-30)"><path d="M0,0 H16" stroke="#d8c070" stroke-width="2.4"/><ellipse cx="18" cy="0" rx="4" ry="3" fill="#d8c070" stroke-width="1.1"/></g>`;
const splashG=()=>sh8(34,.12)+act(-18,0,1,{view:'side',pose:'reach',s:.85,top:'long',bottom:'shorts',shirt:'#7a9ac8',hat:-1,extra:ladle},'work')+
 act(22,0,-1,{view:'side',pose:'up2',top:'long',bottom:'pants',shirt:'#9a8a6a',hat:-1,mood:1},'hop')+
 `<g fill="#8fd0e8" stroke-width="1"><circle cx="6" cy="-46" r="2.4"/><circle cx="12" cy="-54" r="2"/><circle cx="2" cy="-58" r="1.8"/><circle cx="16" cy="-42" r="2"/></g><path d="M0,-38 Q8,-52 18,-46" fill="none" stroke="#8fd0e8" stroke-width="2"/>`;
/* 石階：坐在邊上喘氣的叔叔（毛巾、汗）；揹著阿嬤爬石階的孫子 */
const restG=()=>sh8(18,.12)+act(0,0,1,{view:'fq',pose:'sit',top:'long',bottom:'pants',shirt:'#c8645a',hat:-1,hair:'#4a3a30',extra:`<path d="M-9,-36 Q0,-30 9,-36 L8,-31 Q0,-26 -8,-31Z" fill="#fbf9f3" stroke-width="1.1"/>`+sweat8(-12,-58)+sweat8(12,-62)},'nod');
const piggyG=()=>{const gm=kid({view:'back',pose:'reach',...kimo({kim:'C',shirt:'#8a6aa8',hair:'#e8e4dc',hs:3})});
 return sh8(20,.12)+act(0,0,1,{view:'back',pose:'stand',top:'long',bottom:'pants',shirt:'#5f7a6a',hat:-1},'step')+`<g transform="translate(0,-26) scale(.86)">${gm}</g>`};
/* 稻荷：鳥居前比耶拍照，朋友蹲著拍，後面有人等 */
const posePh=()=>sh8(16,.12)+act(0,0,1,{view:'fq',pose:'up',...kimo({kim:'A',shirt:'#f4b6c2',pat:'#fff'}),mood:2},'cheer');
const camG=()=>sh8(28,.12)+act(-12,0,1,{view:'bq',pose:'hold',top:'long',bottom:'pants',shirt:'#3e5e8a',hat:-1,extra:`<rect x="10" y="-30" width="9" height="12" rx="2" fill="#2b2420" stroke-width="1"/>`},'nod')+act(18,2,1,{view:'bq',pose:'stand',...kimo({kim:'B',shirt:'#e8eef6'})},'lean');
/* 竹林入口：一群阿公阿嬤在薄霧裡做早操，前面的帶操老師面向大家，地上一台小收音機 */
const taisoG=()=>{let t=sh8(70,.1);
 t+=act(0,-40,1,{view:'fq',pose:'up2',top:'long',bottom:'pants',shirt:'#fbf6ea',hat:-1,hair:'#e8e4dc',hs:3},'groove');
 t+=`<g transform="translate(34,-42)"><rect x="-9" y="-10" width="18" height="11" rx="2" fill="#c8645a" stroke-width="1.3"/><circle cx="-3" cy="-4.5" r="3" fill="#2b2420" stroke="none"/><path d="M3,-7 h4 M3,-4 h4" stroke="#fbf6ea" stroke-width="1"/><path d="M-6,-10 L-2,-16" stroke-width="1.3"/></g>`;
 const el=[[-48,0,'#7a9ac8','#e8e4dc'],[-16,4,'#5f7a6a','#bdb6aa'],[16,2,'#c8645a','#e8e4dc'],[48,0,'#8a6aa8','#d0ccc0']];
 el.forEach(([x,y,c,hr],i)=>{t+=act(x,y,1,{view:'back',pose:'up2',top:'long',bottom:'pants',shirt:c,hat:-1,hair:hr,hs:3},'groove')});
 return t};
Object.assign(KIND,{skPray8:{w:100,h:120,fn:prayG},skQueue8:{w:60,h:60,fn:queueG},skWedding8:{w:110,h:170,fn:weddingG},skSplash8:{w:80,h:60,fn:splashG},
 skRest8:{w:40,h:56,fn:restG},skPiggy8:{w:44,h:80,fn:piggyG},skPose8:{w:34,h:62,fn:posePh},skCam8:{w:66,h:60,fn:camG},skTaiso8:{w:150,h:110,fn:taisoG}});
['skPray8','skWedding8','skTaiso8'].forEach(k=>HEAVYX[N].add(k));
const FEST8={};
function groups8(){
 add(1250,700,140,130,'skPray8',prayG(),{s:1.15});FEST8.pray={x:1250,y:700};
 add(1312,760,80,70,'skQueue8',queueG(),{s:1.05});FEST8.queue={x:1312,y:760};
 add(1250,920,140,200,'skWedding8',weddingG(),{s:1.0});FEST8.wed={x:1250,y:920};
 add(1000,880,110,80,'skSplash8',splashG(),{s:1.15});FEST8.splash={x:1000,y:880};
 add(1164,1290,40,56,'skRest8',restG(),{s:1.1});FEST8.rest={x:1164,y:1290};
 add(1290,1140,44,80,'skPiggy8',piggyG(),{s:1.1});FEST8.piggy={x:1290,y:1140};
 add(817,1100,90,80,'skPose8',posePh(),{s:1.15});FEST8.pose={x:817,y:1100};
 add(845,1170,120,90,'skCam8',camG(),{s:1.1});FEST8.cam={x:845,y:1170};
 add(1015,2200,230,150,'skTaiso8',taisoG(),{s:1.1});FEST8.taiso={x:1015,y:2200};
}
const near8=(o,x,y,w,h)=>o&&Math.abs(x-o.x)<w&&y<o.y+12&&y>o.y-h;let festT8=0;
const festTap8=(x,y)=>{const t=performance.now(),say=(m,d=2800)=>{if(t-festT8>700){festT8=t;H.toast(m,d)}return true};
 if(near8(FEST8.pray,x,y,60,140)){if(t-festT8>700)try{[880,1175,880].forEach((q,i)=>setTimeout(()=>tone(q,.18,'triangle',.04),i*120));setTimeout(()=>{tone(220,.06,'square',.05);setTimeout(()=>tone(220,.06,'square',.05),180)},520)}catch(_){}return say('搖搖鈴、拍兩下手⋯小朋友：我許願把東西全部找到！')}
 if(near8(FEST8.queue,x,y,40,70))return say('排隊參拜的人：下一個就輪到我們了。');
 if(near8(FEST8.wed,x,y,64,200))return say('神前婚禮！白無垢的新娘撐著紅傘，慢慢走向主殿。');
 if(near8(FEST8.splash,x,y,54,70))return say('爸爸：哇！好冰！是先洗左手再洗右手，不是潑我啦～');
 if(near8(FEST8.rest,x,y,30,70))return say('叔叔：呼⋯呼⋯這石階也太長了，休息一下再爬。');
 if(near8(FEST8.piggy,x,y,30,96))return say('孫子：阿嬤抓好喔，再幾階就到了！\n阿嬤：乖孫，等等請你吃糰子。');
 if(near8(FEST8.pose,x,y,26,76)||near8(FEST8.cam,x,y,44,70))return say('來，看這邊～一、二、三！紅鳥居一層一層，拍起來好好看。');
 if(near8(FEST8.taiso,x,y,90,130))return say('一、二、三、四！清晨在竹林裡做早操，空氣好新鮮～');
 return false};

function structures(){
 skyBirds(N);
 /* 上段：神社主殿、手水舍、狛犬一對、繪馬架、御神籤架、御神木 */
 add(1250,610,160,110,'skShrineHall',shrineSvg(),{s:1.9});
 add(943,826,62,52,'skTemizuya',temizuya(),{s:1.5});
 add(1136,872,30,44,'skKomainuS',komainuS(),{s:1.4});add(1364,872,30,44,'skKomainuS',komainuS(),{s:1.4,fl:true});
 add(1560,832,62,48,'skEmaRack',emaRack(),{s:1.3});add(1650,940,62,48,'skOmikujiRack',omikujiRack(),{s:1.3});
 add(1690,520,100,170,'skGoshinboku',goshinboku(),{s:1.5});
 for(const [x,y] of [[1166,950],[1334,950],[1160,800],[1340,800],[1170,690],[1330,690]])add(x,y,36,64,'skLantern',S.stoneLantern({glow:false}),{s:1});
 /* 石階：往上接神社院（一層一層接起來） */
 /* 石階畫在地面層（stairG），這裡不再疊 skStairs */
 for(const y of [1400,1250,1100]){add(1100,y,36,64,'skLanternDim',S.stoneLantern({moss:true,glow:false}),{s:1});add(1400,y,36,64,'skLanternDim',S.stoneLantern({moss:true,glow:false}),{s:1})}
 /* 西側稻荷小神社：連續小鳥居（越往裡越密）＋石狐狸 */
 [1010,910,820,740,675].forEach(y=>add(817,y,108,96,'skTorii',S.torii({}),{s:.72,mark:false}));
 add(790,1050,26,40,'skFoxStone',foxStone(),{s:1.3});add(844,1050,26,40,'skFoxStone',foxStone(),{s:1.3,fl:true});
 add(817,590,62,56,'skInariHut',inariHut(),{s:1.5});
 /* 下段：木橋、東岸小空地的鹿威、小徑旁石燈籠 */
 add(1250,1884,100,130,'skWoodBridge',woodBridge(),{s:1,mark:false});
 add(1557,1630,72,64,'skShishiOdo',shishiSvg(),{s:1.45});
 for(const [x,y] of [[1130,1720],[1370,1720],[1135,2120],[1365,2120]])add(x,y,36,64,'skLanternDim',S.stoneLantern({moss:true,glow:false}),{s:1});
 /* 薄霧：一團一團不規則的雲朵，夾在前後景之間 */
 groups8();
 for(let i=0;i<26;i++){const x=sr(640,1880),y=i<10?sr(1300,2350):sr(380,1300);add(x,y,260,60,'skMist',mistSvg(),{mark:false,s:sr(1.1,2.1)})}
}
function scatterAll(){
 scatter('sk8S',POOL.sk8S,4200,90);scatter('sk8Mid',POOL.sk8Mid,3600,80);scatter('sk8Shrine',POOL.sk8Shrine,3000,60);scatter('sk8W',POOL.sk8W,3400,60);
 scatter('sk8E',POOL.sk8E,3200,60);scatter('sk8Stair',POOL.sk8Stair,3200,60);scatter('sk8All',POOL.sk8All,6000,90);
 /* 耙過的白砂上不長竹子和草叢（其他區域撒到神社院裡的拿掉，留空位） */
 for(const sp of H.sprites)if((sp.kind==='skBamboo'||sp.kind==='grassClump')&&sp.x>752&&sp.x<1748&&sp.y>296&&sp.y<968){sp.svg='';sp.kind='skGone'}
}
SCENE_IMPL[N]={ground,structures,scatter:scatterAll};
/* ================= 10. 連環小故事「偷偷變身的小狸貓」 ================= */
const tanukiLantern=()=>S.stoneLantern({glow:false})+`<path d="M13,-18 Q31,-22 29,-42 Q25,-53 17,-45 Q23,-34 15,-28Z" fill="#9a6a45"/><path d="M17,-30 q8,-2 12,2 M19,-38 q7,-3 10,1" fill="none" stroke="#5a3a22" stroke-width="2.2"/><path d="M-2,-68 q9,-11 16,-2 q-6,9 -16,2Z" fill="#6fb070" stroke-width="1.4"/>`;
const broomMan=()=>act(0,0,1,{view:'fq',pose:'hold',hat:-1,hair:'#d8d4cc',hs:4,shirt:'#5f7a6a',pants:'#4a4a5a',mood:1,
 extra:`<path d="M9,-6 L24,-44" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M9,-6 L24,-44" fill="none" stroke="#c99a5b" stroke-width="2.2"/><path d="M19,-40 L30,-38 L32,-24 L22,-26Z" fill="#d8c070" stroke-width="1.4"/><path d="M23,-37 l2,12 M27,-37 l2,12" stroke="#a89040" stroke-width="1" fill="none"/>`});
STORIES[N]={title:'偷偷變身的小狸貓',who:'小巫女',
 giver:()=>act(0,0,1,{view:'fq',pose:'reach',hat:-1,hair:'#2f2622',hs:2,shirt:'#fbf6ea',pants:'#c8362f',mood:2}),
 target:()=>`<g transform="scale(1.15)">${tanukiLantern()}</g>`,tw:56,th:76,
 helper:()=>broomMan(),hw:46,hh:70,
 ask:'小巫女：我照顧的小狸貓不見了！牠頭上頂著一片綠葉，最愛變身玩捉迷藏。',
 need:'有一盞石燈籠，怎麼長了條蓬蓬的尾巴？拿竹掃把的老園丁也許有辦法。',
 got:'老園丁：用掃把輕輕搔癢，牠就憋不住笑啦！',
 ok:'小狸貓噗哧笑出來，現形了！快帶回小巫女身邊。'};

/* ================= 11. 場景彩蛋：點鹿威，竹筒倒水「咚」一聲，水面泛起圈圈（不算點錯） ================= */
let dripping=0;
TAPHOOKS[N]=(x,y)=>{if(festTap8(x,y))return true;
 const t=H.sprites.find(s=>s.kind==='skShishiOdo'&&Math.abs(x-s.x)<62&&y<s.y+8&&y>s.y-90);if(!t)return false;
 const fx=document.getElementById('fx');if(!fx||dripping>1)return true;dripping++;
 try{tone(196,.3,'sine',.09);setTimeout(()=>tone(98,.5,'sine',.07),40);setTimeout(()=>tone(1760,.08,'sine',.02),160)}catch(_){}
 const NS='http://www.w3.org/2000/svg',g=document.createElementNS(NS,'g');fx.appendChild(g);
 const rings=[0,1,2].map(i=>{const e=document.createElementNS(NS,'ellipse');e.setAttribute('fill','none');e.setAttribute('stroke','#e8f8fc');e.setAttribute('stroke-width','3');g.appendChild(e);return {e,d:i*260}});
 const drops=[0,1,2,3,4].map(i=>{const e=document.createElementNS(NS,'circle');e.setAttribute('r','3');e.setAttribute('fill','#8fd0e8');e.setAttribute('stroke','#2b2420');e.setAttribute('stroke-width','1.2');g.appendChild(e);return {e,a:-Math.PI/2+(i-2)*.5,v:sr(34,54)}});
 const bx=t.x,by=t.y-20,t0=performance.now(),D=1800;
 const step=now=>{const k=(now-t0)/D;if(k>=1){g.remove();dripping--;return}
  rings.forEach(R=>{const q=Math.max(0,(now-t0-R.d)/1000);R.e.setAttribute('cx',bx);R.e.setAttribute('cy',by);R.e.setAttribute('rx',(8+q*46).toFixed(1));R.e.setAttribute('ry',(3+q*17).toFixed(1));R.e.setAttribute('opacity',Math.max(0,.9-q*.95).toFixed(2))});
  drops.forEach(d=>{const q=Math.min(1,k*3);d.e.setAttribute('cx',(bx+Math.cos(d.a)*d.v*q).toFixed(1));d.e.setAttribute('cy',(by+Math.sin(d.a)*d.v*q+q*q*30).toFixed(1));d.e.setAttribute('opacity',(1-k*1.4>0?1-k*1.4:0).toFixed(2))});
  requestAnimationFrame(step)};
 requestAnimationFrame(step);return true};

/* ================= 12. 過場：走過朱紅鳥居，走進竹林步道（竹子越來越密、霧越來越濃） ================= */
RIDES.bamboo=(()=>{
 const strip=()=>{
  let w=`<defs><linearGradient id="skBmSky" x1="0" x2="1"><stop offset="0" stop-color="#dcebf6"/><stop offset="1" stop-color="#e6eeea"/></linearGradient><linearGradient id="skBmGnd" x1="0" x2="1"><stop offset="0" stop-color="#9fbd72"/><stop offset="1" stop-color="#b6d98f"/></linearGradient></defs>`;
  w+=`<rect x="-10" y="0" width="1220" height="800" fill="url(#skBmSky)" stroke="none"/>`;
  /* 右（起點）：溫泉街的屋頂和朱紅鳥居；越往左竹子越密 */
  w+=[[1130,350,.8],[1050,346,.7]].map(([x,y,k])=>T(x,y,k,S.shop({noren:pk(['#a8322e','#3e5e8a'])}),false)).join('');
  w+=`<rect x="-10" y="430" width="1220" height="400" fill="url(#skBmGnd)" stroke="none"/><path d="M-10,430 H1210" fill="none"/>`;
  const far=[],mid=[],near=[];
  for(let x=-20;x<1210;x+=sr(26,46)){const p=1-x/1200;if(r()<.25+.75*p)far.push(x)}
  far.forEach(x=>{w+=`<g opacity=".55">${T(x,sr(330,380),sr(.45,.6),S.bamboo(),false)}</g>`});
  for(let x=0;x<1210;x+=sr(40,70)){const p=1-x/1200;if(r()<.2+.8*p)mid.push(x)}
  mid.forEach(x=>{w+=T(x,sr(420,460),sr(.75,.95),S.bamboo(),false)});
  w+=T(1000,470,.62,S.torii({}),false);
  /* 土徑＋踏石 */
  w+=`<rect x="-10" y="500" width="1220" height="220" fill="#d9c79a" stroke="none"/><path d="M-10,500 H1210" stroke="#b8a370" stroke-width="3" fill="none"/>`;
  for(let x=10;x<1210;x+=88)w+=`<rect x="${x}" y="${ri(530,560)}" width="${ri(30,44)}" height="14" rx="5" fill="#cfc9b9" stroke-width="1.6"/>`;
  /* 近景大竹子（左側多） */
  for(let x=0;x<1210;x+=sr(120,210)){const p=1-x/1200;if(r()<.15+.7*p)w+=T(x,sr(560,620),sr(1.3,1.7),S.bamboo(),false)}
  /* 霧：雲朵狀（不是橢圓），左邊（深處）比較多 */
  for(let i=0;i<14;i++){const x=sr(-20,1200),p=1-x/1200;if(r()<.3+.6*p)w+=`<g transform="translate(${f(x)},${f(sr(380,560))}) scale(${f(sr(1.3,2.4))})">${mistSvg()}</g>`}
  return `<g transform="translate(0,-85)">${w}</g>`};
 const walker=()=>`<ellipse cx="0" cy="2" rx="26" ry="5" fill="#000" opacity=".18" stroke="none"/>`+act(0,0,-1,{view:'side',pose:'stand',s:1,hat:-1,shirt:'#f4b6c2',pants:'#4a4a5a'});
 return {text:'走過朱紅鳥居，進到霧氣淡淡的竹林步道⋯',every:420,tick:k=>tone(k%2?330:260,.04,'triangle',.04),
  svg:()=>`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><style>@keyframes skBmPan{from{transform:translateX(-800px)}to{transform:translateX(0)}}.skWalk{animation:skBmBob .32s ease-in-out infinite alternate}@keyframes skBmBob{to{transform:translateY(-4px)}}</style>`+
   `<g style="animation:skBmPan 4.2s cubic-bezier(.35,0,.65,1) forwards;transform:translateX(-800px)">${strip()}</g>`+
   `<g class="skWalk"><g transform="translate(205,472)">${walker()}</g></g></g></svg>`}})();

/* ================= 13. 冒險地圖：第 8 關節點（接在第 7 關上方、在櫻花山前面；座標是加寬後地圖的西邊） ================= */
HERE[N]=[-80,184];
MAPHOOKS.push(({U,P,ink,FN})=>{if(U<N)return '';
 const road='M-82,242 Q-96,230 -86,218 Q-80,212 -80,210';
 let m=H.mapRoute(road,'road',ink);
 m+=`<g class="mnode" data-n="${N}"><circle cx="-80" cy="204" r="24" fill="transparent"/><ellipse cx="-80" cy="210" rx="19" ry="6" fill="#b9d490" stroke="${ink}" stroke-width="1.3"/>`+
  `<g stroke="${ink}" stroke-width="1.2" fill="#8fb05a"><rect x="-96" y="190" width="4" height="20" rx="1.6"/><rect x="-90" y="186" width="4" height="24" rx="1.6"/><rect x="-66" y="188" width="4" height="22" rx="1.6"/><rect x="-60" y="193" width="4" height="17" rx="1.6"/></g>`+
  P('M-84,210 V196 M-74,210 V196','none',2.4)+`<path d="M-87,198 H-71 M-89,194 Q-79,191 -69,194" fill="none" stroke="#d8413a" stroke-width="2.6" stroke-linecap="round"/>`+
  `<g transform="translate(-34,206)"><rect x="-26" y="-10" width="52" height="19" rx="9.5" fill="#fffaf0" stroke="${ink}" stroke-width="1.6"/><text y="4" text-anchor="middle" font-size="11" fill="${ink}" font-family="${FN}">竹林神社</text></g></g>`;
 return m});
})();

/* ===== 物件的合理位置（2026-11-12）：SPOTS 合理的地方（佔 55～65%）、BLEND 顏色相近的東西（其餘的至少一半）。說明在 core.js 的 placeItems ===== */
(function(){const H=window.TH;if(!H||!H.SPOTS)return;
H.SPOTS[8]={"sk_maneki":[["skLantern",0.05,0.6],["skShrineHall",0.03,0.3],["skInariHut",0.05,0.5],["skTemizuya",0.05,0.6],["skEmaRack",0.05,0.6]],"sk_furin":[["skShrineHall",0.6,0.35],["skTemizuya",0.7,0.3],["skInariHut",0.7,0.3],["skTorii",0.8,0.3]],"sk_omamori":[["skLantern",0.05,0.6],["skTorii",0.03,0.45],["skShrineHall",0.03,0.3],["skOmikujiRack",0.4,0.3],["skEmaRack",0.4,0.3],["skTemizuya",0.05,0.6]],"sk_ema":[["skTorii",0.03,0.45],["skEmaRack",0.5,0.35],["skGoshinboku",0.03,0.4],["skShrineHall",0.03,0.35],["skInariHut",0.05,0.5]],"sk_kagura":[["skLantern",0.05,0.6],["skShrineHall",0.03,0.3],["skOmikujiRack",0.05,0.6],["skEmaRack",0.05,0.6],["skInariHut",0.05,0.5]],"sk_omikuji":[["skTorii",0.03,0.45],["skLantern",0.05,0.6],["skOmikujiRack",0.4,0.3],["skShrineHall",0.03,0.3],["skEmaRack",0.05,0.6],["skTemizuya",0.05,0.6]],"sk_hishaku":[["skTemizuya",0.5,0.3],["skTemizuya",0.05,0.6],["skShishiOdo",0.05,0.6],["skInariHut",0.05,0.5]],"sk_komainu":[["skLantern",0.05,0.6],["skFoxStone",0.05,0.6],["skShrineHall",0.03,0.45],["skTorii",0.03,0.45],["skInariHut",0.05,0.5],["skGoshinboku",0.03,0.4]],"sk_takekopter":[["skBamboo",0.03,0.6],["skBamboo",0.4,0.2],["skWoodBridge",0.05,0.4],["bush",0.05,0.6]],"sk_shimenawa":[["skGoshinboku",0.35,0.2],["skTorii",0.75,0.3],["skShrineHall",0.55,0.3],["skInariHut",0.6,0.3]],"sk_shishi":[["skShishiOdo",0.05,0.6],["skTemizuya",0.05,0.6],["skBamboo",0.03,0.6],["skWoodBridge",0.05,0.4]],"sk_goshuin":[["skLantern",0.05,0.6],["skTorii",0.03,0.45],["skShrineHall",0.03,0.3],["skOmikujiRack",0.05,0.6],["skEmaRack",0.05,0.6],["skInariHut",0.05,0.5]]};
H.BLEND[8]={"sk_maneki":["skDollCat"],"sk_furin":["skBellString","skCowbell"],"sk_omamori":["skPouch"],"sk_ema":["skBlankPlank"],"sk_kagura":["skCowbell","skBellString"],"sk_omikuji":["skPenHolder","skBambooTube"],"sk_hishaku":["skBambooPipe","skBambooTube"],"sk_komainu":["skDogFigure","skKomainuS","skFoxStone"],"sk_takekopter":["skPropeller"],"sk_shimenawa":["skRopeRing"],"sk_shishi":["skBambooPipe"],"sk_goshuin":["skNotebook"]};
})();
