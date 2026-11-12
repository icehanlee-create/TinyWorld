/* 奇幻小鎮大搜查．第 7 關 溫泉商店街（半山）
   需要 sakura_common.js 和 level6.js（老朋友：三色糰子、油紙傘）。
   使用者定案：排法 B（大 S 彎坡道、店順著彎道錯落、足湯 2 個小池在彎內側小廣場、旅館在東側），氣氛＝白天。
   場景（上北下南）：南＝山腳入口；一條 S 形石板坡道往北，兩側兩層木造商店；彎內小廣場有足湯＋竹籬笆；東側溫泉旅館冒蒸氣；北端朱紅鳥居通往竹林（第 8 關入口）。 */
(function(){
const H=window.TH;if(!H)return;
const N=7;
const {T,f,r,sr,pk,ri,OL,kid,act,wrapAn,add,mark,canPlace,scatter,skyBirds,KIND,POOL,VPLAN,REG,SCREG,LEVELS,ART,DECOY,SCENE_IMPL,
 WATERFN,RIDES,HERE,OUTFITS,STORIES,HOSTK,HOSTN,TAPHOOKS,MAPHOOKS,ALWAYSX,HEAVYX,tone,typeOf}=H;
const S=H.SAKURA;if(!S)return;
const C=S.C;

/* ================= 1. 場景範圍、天空、場地邊緣（白天） ================= */
H.SCENES[N]={x0:600,x1:1900,y1:2500,c:[1300,2050]};
H.TARGET[N]=330;
H.SKYC[N]='#dcebf6';H.SKYY[N]=170;
H.EDGEM[N]='';H.EDGED[N]='LRB';
H.EDGEDECO[N]=[['skBamboo',2],['skSakuraHalf',1.6],['bush',1],['round',.8]];
H.FRINGE[N]=[['grassClump',2.4],['skPetalPile',.5]];
H.DENS[N]=1.33;

/* ================= 2. 當地人的穿著：溫泉街約 7 成穿和服，浴衣最多（主帳號 2026-11-11 合併時加；畫法在 art.js top:'kimono'） ================= */
OUTFITS[N]=o=>{if(o.top)return o;
 if(r()<.7){const st=pk(['B','B','B','A','C','C']);o.top='kimono';o.bottom='kimono';o.kim=st;
  o.shirt=pk(st==='B'?['#3e5e8a','#e8eef6','#fbf6ea','#dfe9f2','#7a9ac8','#f6e3ec']:['#f4b6c2','#c8645a','#8a6aa8','#5f8a7a','#e8c86a','#3b5a8a']);
  o.obi=pk(['#f0c040','#d8413a','#3b5a8a','#fbf6ea','#e8a0b4']);o.pat=st==='B'?pk(['#3b5a8a','#fbf6ea','#e86a8a','#5f8a3a']):pk(['#fde4ec','#fff','#f7c4d3']);
  if(st!=='C'||r()<.5)o.hat=-1;return o}
 o.top=pk(['long','long','coat','tee']);o.bottom=pk(['pants','pants','shorts']);
 o.shirt=o.shirt||pk(['#3e5e8a','#7a9ac8','#f4b6c2','#fbf6ea','#c8645a','#8a6aa8','#5f8a7a','#e8c86a']);return o};

/* ================= 3. 物件與干擾物（畫在 0,0 附近約 30×30） ================= */
const gloss=(x,y)=>`<circle cx="${x-1.5}" cy="${y-1.7}" r="1.2" fill="#fff" stroke="none" opacity=".9"/>`;
Object.assign(ART,{
 sk_maneki:`<ellipse cx="0" cy="10" rx="11" ry="6" fill="#fbf9f3"/><path d="M-10,10 Q-12,-4 -3,-8 H3 Q12,-4 10,10Z" fill="#fbf9f3"/><path d="M-8,-8 L-9,-17 L-3,-11Z M8,-8 L9,-17 L3,-11Z" fill="#fbf9f3"/><circle cx="0" cy="-6" r="8" fill="#fbf9f3"/>`+
  `<path d="M7,-3 Q14,-8 12,-17 Q10,-19 8,-16 Q8,-10 5,-6Z" fill="#fbf9f3"/><circle cx="-3" cy="-7" r="1.2" fill="${OL}" stroke="none"/><circle cx="3" cy="-7" r="1.2" fill="${OL}" stroke="none"/><path d="M-1.5,-4.5 L1.5,-4.5 L0,-3Z" fill="#f08cb0" stroke-width=".8"/>`+
  `<path d="M-7,-0.5 Q0,3 7,-0.5" fill="none" stroke="#d8413a" stroke-width="2.6"/><circle cx="0" cy="3" r="2.4" fill="#f5c842" stroke-width="1"/><ellipse cx="-4" cy="9" rx="4.4" ry="5.2" fill="#f5c842" stroke-width="1.2"/><path d="M-6,7 h4" fill="none" stroke-width=".9"/>`,
 sk_furin:`<path d="M0,-17 V-12" fill="none" stroke-width="1.4"/><path d="M-11,-3 Q-11,-13 0,-13 Q11,-13 11,-3 Z" fill="#cfe9f2"/><path d="M-9,-7 Q-6,-11 -2,-11" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/><path d="M0,-3 V4" fill="none" stroke-width="1.2"/><circle cx="0" cy="5" r="1.6" fill="#f5c842" stroke-width="1"/><path d="M0,5 V9" fill="none" stroke-width=".9"/><rect x="-3.4" y="9" width="6.8" height="13" rx="1" fill="#f7a8c0" stroke-width="1.2"/><path d="M-1,12 h2 M-1,15 h2 M-1,18 h2" stroke-width=".8" fill="none"/>`,
 sk_geta:`<rect x="-14" y="-6" width="28" height="12" rx="5.5" fill="#c99a5b"/><path d="M-9,-3 H9 M-9,0 H9 M-9,3 H9" fill="none" stroke="#a8703f" stroke-width=".8"/><rect x="-9" y="6" width="5" height="7" rx="1" fill="#a8703f"/><rect x="5" y="6" width="5" height="7" rx="1" fill="#a8703f"/><path d="M0,-4 L-5,-6 M0,-4 L5,-6 M0,-4 V1" fill="none" stroke="#d8413a" stroke-width="3"/>`,
 sk_daruma:`<path d="M0,-15 Q-14,-15 -14,0 Q-14,13 0,13 Q14,13 14,0 Q14,-15 0,-15Z" fill="#d8413a"/><path d="M0,-12 Q-9,-12 -9,-3 Q-9,5 0,5 Q9,5 9,-3 Q9,-12 0,-12Z" fill="#fbf6ea" stroke-width="1.3"/><path d="M-7,-7 Q-4,-9 -1,-6 M7,-7 Q4,-9 1,-6" fill="none" stroke-width="2"/><circle cx="-4" cy="-3" r="2" fill="#fff" stroke-width="1.2"/><circle cx="4" cy="-3" r="2" fill="#fff" stroke-width="1.2"/><path d="M-6,2 Q0,6 6,2" fill="none" stroke-width=".9"/><path d="M-6,9 Q0,11 6,9" fill="none" stroke="#f5c842" stroke-width="1.6"/>`,
 sk_manju:`<ellipse cx="0" cy="2" rx="13" ry="11" fill="#b5703a"/><path d="M-9,-3 Q-4,-8 2,-7" fill="none" stroke="#d9a070" stroke-width="2.2" stroke-linecap="round"/><circle cx="0" cy="0" r="4.2" fill="#d8413a" stroke-width="1"/><path d="M-2,-1 h4 M0,-3 v4" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round"/>`,
 sk_sensu:`<path d="M-1,13 L-14,-8 Q0,-17 14,-8Z" fill="#f4e4c0"/><path d="M-1,13 L-14,-8 M-1,13 L-7,-12 M-1,13 L-1,-14 M-1,13 L5,-12 M-1,13 L14,-8" fill="none" stroke="#a8703f" stroke-width="1.3"/><circle cx="-1" cy="-5" r="3.2" fill="#f7a8c0" stroke-width="1"/><path d="M-9,-4 q2,-3 4,0 M3,-6 q2,-3 4,0" fill="none" stroke="#7fb08a" stroke-width="1.1"/><circle cx="-1" cy="13" r="1.8" fill="#d8413a" stroke-width="1"/>`,
 sk_towel:`<rect x="-12" y="-7" width="24" height="15" rx="7.5" fill="#fbf9f3"/><ellipse cx="-12" cy="0.5" rx="4" ry="7.5" fill="#fbf9f3"/><ellipse cx="-12" cy="0.5" rx="2" ry="3.6" fill="none" stroke-width="1"/><path d="M-6,-6.5 V7.5 M0,-7 V8 M6,-6.5 V7.5" fill="none" stroke="#7fb4d8" stroke-width="1.8"/><path d="M8,-6 q5,-3 8,0" fill="none" stroke-width="1.1"/>`,
 sk_kazaguruma:`<path d="M-1,2 L1,22" fill="none" stroke="${OL}" stroke-width="4"/><path d="M-1,2 L1,22" fill="none" stroke="#c99a5b" stroke-width="1.8"/><path d="M0,0 L-13,-6 L-7,-13Z" fill="#f08cb0"/><path d="M0,0 L-7,-13 L2,-14Z" fill="#fbf6ea" opacity="0"/><path d="M0,0 L7,-13 L13,-6Z" fill="#f5c842"/><path d="M0,0 L13,-6 L9,7Z" fill="#6fb0d8"/><path d="M0,0 L9,7 L-4,10Z" fill="#8fc88a"/><path d="M0,0 L-4,10 L-13,-6Z" fill="#fbf6ea"/><circle r="2.2" fill="#d8413a" stroke-width="1"/>`,
 sk_milk:`<path d="M-5,-14 H5 V-9 Q11,-6 11,2 V10 Q11,13 8,13 H-8 Q-11,13 -11,10 V2 Q-11,-6 -5,-9Z" fill="#e8f4f6"/><path d="M-11,1 H11 V10 Q11,13 8,13 H-8 Q-11,13 -11,10Z" fill="#fbf9f3" stroke="none"/><path d="M-11,1 H11" fill="none" stroke-width="1"/><rect x="-6" y="-17" width="12" height="5" rx="1.5" fill="#fbf6ea" stroke-width="1.2"/><path d="M-7,-5 Q-8,-1 -8,3" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>`,
 sk_kingyo:`<path d="M-9,-8 Q-14,-1 -12,8 Q-9,14 0,14 Q9,14 12,8 Q14,-1 9,-8Z" fill="#dff1f7" opacity=".95"/><path d="M-9,-8 Q0,-12 9,-8" fill="none"/><path d="M-3,-9 Q0,-16 3,-9" fill="none" stroke="#d8413a" stroke-width="2"/><ellipse cx="-1" cy="3" rx="5.5" ry="3.6" fill="#f08a3a" stroke-width="1.2"/><path d="M4,3 L9,-1 L9,7Z" fill="#f08a3a" stroke-width="1.1"/><circle cx="-4" cy="2" r=".9" fill="${OL}" stroke="none"/><path d="M-10,9 Q0,12 10,9" fill="none" stroke="#a8d8e8" stroke-width="1"/>`});
Object.assign(DECOY,{
 skDollCat:`<ellipse cx="0" cy="10" rx="11" ry="6" fill="#fbf9f3"/><path d="M-10,10 Q-12,-4 -3,-8 H3 Q12,-4 10,10Z" fill="#fbf9f3"/><path d="M-8,-8 L-9,-17 L-3,-11Z M8,-8 L9,-17 L3,-11Z" fill="#fbf9f3"/><circle cx="0" cy="-6" r="8" fill="#fbf9f3"/><path d="M-8,0 Q-10,6 -7,9 M8,0 Q10,6 7,9" fill="none" stroke-width="1.4"/><circle cx="-3" cy="-7" r="1.2" fill="${OL}" stroke="none"/><circle cx="3" cy="-7" r="1.2" fill="${OL}" stroke="none"/><path d="M-1.5,-4.5 L1.5,-4.5 L0,-3Z" fill="#f08cb0" stroke-width=".8"/>`,
 skBellString:`<path d="M-14,-12 Q0,-6 14,-12" fill="none" stroke-width="1.4"/><path d="M-9,-9 V-2 M0,-8 V0 M9,-9 V-2" fill="none" stroke-width="1"/><circle cx="-9" cy="2" r="4.4" fill="#e8c24a"/><circle cx="0" cy="4" r="4.4" fill="#e8c24a"/><circle cx="9" cy="2" r="4.4" fill="#e8c24a"/><path d="M-12,2 h6 M-3,4 h6 M6,2 h6" fill="none" stroke-width=".9"/>`,
 skSlipper:`<path d="M-14,0 Q-14,-8 -4,-8 H6 Q14,-8 14,0 Q14,8 6,8 H-6 Q-14,8 -14,0Z" fill="#6aa0d8"/><path d="M-4,-6 Q4,-9 5,0 Q4,8 -4,6" fill="#9ac4ea" stroke-width="1.3"/><path d="M-10,-2 H-6 M-10,2 H-6" fill="none" stroke="#fff" stroke-width="1" opacity=".7"/>`,
 skRedBall:`<circle r="12.5" fill="#d8413a"/><path d="M-10,-4 Q0,2 10,-4" fill="none" stroke="#fbf6ea" stroke-width="3"/><path d="M-9,5 Q0,10 9,5" fill="none" stroke="#fbf6ea" stroke-width="2"/>`+gloss(-4,-5),
 skBaozi:`<path d="M0,-11 Q-14,-10 -13,2 Q-12,11 0,11 Q12,11 13,2 Q14,-10 0,-11Z" fill="#fbf9f3"/><path d="M0,-11 Q-3,-5 0,-1 M-5,-10 Q-6,-5 -3,-2 M5,-10 Q6,-5 3,-2" fill="none" stroke="#d8d2c0" stroke-width="1.3"/>`,
 skMapFold:`<path d="M-13,-9 L-5,-12 L5,-9 L13,-12 V9 L5,12 L-5,9 L-13,12Z" fill="#f2e6c4"/><path d="M-5,-12 V9 M5,-9 V12" fill="none" stroke-width="1"/><path d="M-10,4 Q-4,-6 2,0 T10,-4" fill="none" stroke="#d8413a" stroke-width="1.2" stroke-dasharray="2 2"/><path d="M7,-6 l3,3 m0,-3 l-3,3" fill="none" stroke="#d8413a" stroke-width="1.4"/>`,
 skTissue:`<rect x="-11" y="-8" width="22" height="16" rx="3" fill="#fbf9f3"/><ellipse cx="-11" cy="0" rx="4" ry="8" fill="#fbf9f3"/><ellipse cx="-11" cy="0" rx="1.8" ry="3.6" fill="#b8a58a" stroke-width="1"/><path d="M-4,-7.5 V7.5 M4,-7.5 V7.5" fill="none" stroke="#e0dac8" stroke-width="1" stroke-dasharray="1.4 2"/><path d="M9,-7 q4,2 3,9" fill="none" stroke-width="1"/>`,
 skSwirlPop:`<path d="M0,6 V22" fill="none" stroke="${OL}" stroke-width="4"/><path d="M0,6 V22" fill="none" stroke="#fbf9f3" stroke-width="1.8"/><circle cx="0" cy="-3" r="12" fill="#f7a8c0"/><path d="M0,-3 m0,0 a2,2 0 1 1 2,2 a4,4 0 1 1 -4,-4 a7,7 0 1 1 7,7 a10,10 0 1 1 -10,-10" fill="none" stroke="#fbf6ea" stroke-width="2.2"/>`,
 skVaseWhite:`<path d="M-3,-6 H3 Q4,-2 9,1 V9 Q9,13 4,13 H-4 Q-9,13 -9,9 V1 Q-4,-2 -3,-6Z" fill="#fbf9f3"/><path d="M0,-6 V-14" fill="none" stroke="#5f8a3a" stroke-width="1.6"/><circle cx="0" cy="-16" r="4" fill="#f4a0b8" stroke-width="1.1"/><circle cx="0" cy="-16" r="1.4" fill="#f5c842" stroke="none"/>`,
 skBalloonOr:`<path d="M0,-12 Q-12,-12 -12,-1 Q-12,9 0,10 Q12,9 12,-1 Q12,-12 0,-12Z" fill="#f08a3a"/><path d="M-2,10 L0,13 L2,10Z" fill="#d8702a" stroke-width="1.1"/><path d="M0,13 q-3,4 1,8" fill="none" stroke-width="1"/>`+gloss(-4,-5)});
const dec=(id,s=.95)=>({w:28,h:28,fn:()=>T(0,-12,s,DECOY[id])});
Object.assign(KIND,{skDollCat:dec('skDollCat'),skBellString:dec('skBellString'),skSlipper:dec('skSlipper'),skRedBall:dec('skRedBall'),skBaozi:dec('skBaozi'),
 skMapFold:dec('skMapFold'),skTissue:dec('skTissue'),skSwirlPop:dec('skSwirlPop'),skVaseWhite:dec('skVaseWhite'),skBalloonOr:dec('skBalloonOr')});

/* 12 種 × 4 個，每個區域 8 個。老朋友：三色糰子、油紙傘（第 6 關的）。
   「溫泉木桶」改成「溫泉手巾」（使用者定案），木桶改當幸運草的藏身處；達摩的干擾物是紅色皮球（使用者定案）。 */
const RS={s:'sk7S',pl:'sk7Pl',mid:'sk7Mid',n:'sk7N',w:'sk7W',e:'sk7E'};
const rg=(...a)=>a.map(k=>RS[k]);
const old=(id,regions)=>({...typeOf(id),regions});
const TYPES=[
 old('sk_dango',rg('pl','w','n','mid')),old('sk_wagasa',rg('s','e','mid','n')),
 {id:'sk_maneki',name:'招財貓',short:'招財貓',r:14,rot:12,regions:rg('s','mid','e','w')},
 {id:'sk_furin',name:'風鈴',short:'風鈴',r:14,rot:15,regions:rg('pl','n','s','mid')},
 {id:'sk_geta',name:'木屐',short:'木屐',r:14,rot:22,regions:rg('w','e','pl','n')},
 {id:'sk_daruma',name:'達摩',short:'達摩',r:14,rot:8,regions:rg('mid','n','s','w')},
 {id:'sk_manju',name:'溫泉饅頭',short:'饅頭',r:14,rot:15,regions:rg('pl','e','mid','s')},
 {id:'sk_sensu',name:'折扇',short:'折扇',r:14,rot:20,regions:rg('n','w','e','pl')},
 {id:'sk_towel',name:'溫泉手巾',short:'手巾',r:14,rot:15,regions:rg('pl','s','n','e')},
 {id:'sk_kazaguruma',name:'紙風車',short:'紙風車',r:14,rot:18,regions:rg('e','mid','w','s')},
 {id:'sk_milk',name:'玻璃瓶牛奶',short:'牛奶',r:14,rot:8,regions:rg('w','pl','n','mid')},
 {id:'sk_kingyo',name:'金魚水袋',short:'金魚水袋',r:14,rot:12,regions:rg('mid','n','e','pl')}];
LEVELS[N].types=TYPES;

/* ================= 4. 區域 ================= */
Object.assign(REG,{
 sk7S:{x:700,y:2050,w:1000,h:430},sk7Pl:{x:1060,y:1540,w:860,h:500},sk7Mid:{x:600,y:1040,w:1300,h:500},
 sk7N:{x:640,y:300,w:1260,h:740},sk7W:{x:560,y:1480,w:520,h:820},sk7E:{x:1640,y:300,w:300,h:1200},sk7All:{x:560,y:270,w:1380,h:2180}});
H.SCREG[N]=['sk7S','sk7Pl','sk7Mid','sk7N','sk7W','sk7E','sk7All'];
WATERFN[N]=(x,y)=>inCreek(x,y,8);   /* 西北邊的小溪（7c） */
/* ================= 5. S 形坡道的幾何（座標是場景座標，往北＝y 變小） ================= */
const SEG=[[[1394,2500],[1394,2234],[925,2128],[997,1809]],[[997,1809],[1069,1490],[1575,1436],[1466,1064]],[[1466,1064],[1376,798],[1033,745],[1141,426]],[[1141,426],[1160,360],[1170,310],[1178,260]]];
const bz=(p,t)=>{const u=1-t,a=u*u*u,b=3*u*u*t,c=3*u*t*t,d=t*t*t;return [a*p[0][0]+b*p[1][0]+c*p[2][0]+d*p[3][0],a*p[0][1]+b*p[1][1]+c*p[2][1]+d*p[3][1]]};
const PTS=[];let acc=0,last=null;
SEG.forEach(p=>{for(let i=0;i<=40;i++){const [x,y]=bz(p,i/40);if(last)acc+=Math.hypot(x-last[0],y-last[1]);last=[x,y];PTS.push({x,y,d:acc})}});
const LEN=acc,PW=190;
/* d＝沿路距離，side＝+1 東側／-1 西側，off＝離中線多遠 */
function at(d,side=0,off=0){let i=1;while(i<PTS.length-1&&PTS[i].d<d)i++;
 const a=PTS[i-1],b=PTS[Math.min(i+1,PTS.length-1)],tx=b.x-a.x,ty=b.y-a.y,L=Math.hypot(tx,ty)||1,nx=-ty/L,ny=tx/L;
 const sg=nx<0&&false?1:1;return {x:PTS[i].x+nx*off*side*sg,y:PTS[i].y+ny*off*side*sg,nx,ny}}
const pathD='M'+SEG[0][0]+SEG.map(p=>' C'+p[1]+' '+p[2]+' '+p[3]).join('');

/* ================= 6. 地面 ================= */
function ground(){
 const Sc=H.SCENES[N],X0=Sc.x0-420,WW=Sc.x1-Sc.x0+840;let g='';
 g+=`<rect x="${X0}" y="0" width="${WW}" height="${Sc.y1+420}" fill="#bdd890" stroke="none"/>`;
 for(let i=0;i<50;i++){const x=sr(X0,X0+WW),y=sr(180,Sc.y1);g+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(50,130))}" ry="${f(sr(18,40))}" fill="${pk(['#c6df9a','#b3d086','#cfe3a6','#c9d79a'])}" stroke="none" opacity=".7"/>`}
 /* 坡道：石板路 */
 g+=`<path d="${pathD}" fill="none" stroke="#a59f8f" stroke-width="${PW+8}" stroke-linecap="butt"/><path d="${pathD}" fill="none" stroke="#e2dccd" stroke-width="${PW}" stroke-linecap="butt"/><path d="${pathD}" fill="none" stroke="#cbc4b2" stroke-width="${PW-6}" stroke-dasharray="2 34" stroke-linecap="butt"/>`;
 /* 彎內小廣場（足湯）、旅館前院 */
 g+=`<ellipse cx="1420" cy="1810" rx="270" ry="235" fill="#d8d0bc"/>`;
 for(let k=0;k<7;k++){const y=1650+k*50;g+=`<path d="M1200,${y} H1640" stroke="#c4bca6" stroke-width="1.3" fill="none"/>`}
 g+=`<rect x="1580" y="1640" width="330" height="240" rx="20" fill="#d8d0bc"/>`;
 /* 路邊土徑：通往西側的商店後巷 */
 g+=`<path d="M900,2000 Q800,1990 700,1940 M1100,1300 Q980,1290 860,1230" stroke="#d9c79a" stroke-width="30" fill="none" stroke-linecap="round" opacity=".9"/>`;
 /* 西北邊的小溪（7c） */
 g+=creekG();
 /* 北端：竹林前的空地 */
 g+=`<ellipse cx="1178" cy="300" rx="190" ry="60" fill="#cfc9b9"/>`;
 return `<g stroke="${OL}" stroke-width="2" stroke-linejoin="round">${g}</g>`}

/* ================= 7. 佈景圖鑑 ================= */
const shop7=nor=>`${S.shop({noren:nor})}`;
const hotelSvg=()=>`<ellipse cx="0" cy="2" rx="90" ry="7" fill="#000" opacity=".2" stroke="none"/><rect x="-74" y="-52" width="148" height="52" fill="#f1e8d2"/><rect x="-74" y="-52" width="148" height="6" fill="${C.wood}"/>`+
 `<g transform="translate(0,-52)">${S.tileRoof(176,30)}</g><rect x="-52" y="-104" width="104" height="52" fill="#efe4cb"/><g transform="translate(0,-104)">${S.tileRoof(132,26)}</g>`+
 [-44,-20,4,28].map(x=>`<rect x="${x}" y="-92" width="14" height="16" fill="#8a6a4a"/><path d="M${x+7},-92 v16 M${x},-84 h14" stroke-width="1" fill="none"/>`).join('')+
 `<rect x="-14" y="-34" width="28" height="34" fill="#3d322c"/><path d="M-20,-34 H20 V-28 H-20Z" fill="#a8322e" stroke-width="1.3"/><rect x="-62" y="-38" width="22" height="16" fill="#8a6a4a"/><rect x="40" y="-38" width="22" height="16" fill="#8a6a4a"/>`+
 `<rect x="-11" y="-71" width="22" height="18" rx="2" fill="#fbf9f3" stroke-width="1.2"/>${H.signIcon('onsen',.95,0,-62)}`+
 `<g transform="translate(46,-116) scale(1.2)">${S.steam(1)}</g><g transform="translate(-34,-112)">${S.steam(1)}</g>`;
const footSvg=()=>`<ellipse cx="0" cy="3" rx="64" ry="8" fill="#000" opacity=".14" stroke="none"/><rect x="-56" y="-34" width="112" height="36" rx="12" fill="#c99a5b"/><rect x="-48" y="-28" width="96" height="24" rx="9" fill="#9fd9d6"/><path d="M-36,-20 q6,-3 12,0 M6,-14 q6,-3 12,0" fill="none" stroke="#e8f8f6" stroke-width="1.6"/><g transform="translate(-6,-34) scale(.9)">${S.steam(1)}</g>`;
const bambooFence=()=>`<ellipse cx="0" cy="2" rx="50" ry="4" fill="#000" opacity=".14" stroke="none"/>`+[-48,-36,-24,-12,0,12,24,36,48].map(x=>`<rect x="${x-4.5}" y="-32" width="9" height="34" rx="3" fill="#8fb05a" stroke-width="1.4"/>`).join('')+`<path d="M-54,-22 H54 M-54,-10 H54" stroke="#6a8a3a" stroke-width="3" fill="none"/>`;
const redLamp=()=>`<ellipse cx="2" cy="1" rx="10" ry="3" fill="#000" opacity=".14" stroke="none"/><rect x="-1.6" y="-56" width="3.2" height="56" fill="${C.wood}" stroke-width="1.3"/><path d="M-12,-56 H12" stroke-width="3" fill="none"/><path d="M-6,-52 v3" fill="none"/><ellipse cx="0" cy="-36" rx="9" ry="12" fill="#d8413a"/><rect x="-5.5" y="-50" width="11" height="3.6" rx="1" fill="#2f2622" stroke-width="1"/><rect x="-5.5" y="-26" width="11" height="3.6" rx="1" fill="#2f2622" stroke-width="1"/><path d="M-8,-40 Q0,-36 8,-40 M-9,-34 Q0,-30 9,-34" fill="none" stroke="#a02a24" stroke-width="1"/><circle cx="0" cy="-37" r="3" fill="#fbf6ea" stroke-width="1"/>`;
const okeStack=()=>{const barrel=(x,y)=>`<g transform="translate(${x},${y})"><path d="M-10,0 Q-12,-10 -10,-18 H10 Q12,-10 10,0Z" fill="#c99a5b"/><path d="M-11,-12 H11 M-11,-5 H11" stroke="#8a6a4a" stroke-width="2.2" fill="none"/><ellipse cx="0" cy="-18" rx="10" ry="3.4" fill="#e2bd80" stroke-width="1.3"/></g>`;
 return `<ellipse cx="2" cy="2" rx="26" ry="5" fill="#000" opacity=".14" stroke="none"/>`+barrel(-11,0)+barrel(11,0)+barrel(0,-14)+`<rect x="-6" y="-38" width="12" height="7" rx="3" fill="#fbf9f3" stroke-width="1.2"/><path d="M-2,-37 V-32" stroke="#7fb4d8" stroke-width="1.4" fill="none"/>`};
const awning=(col,w=30,y=-44)=>`<path d="M${-w-6},${y} H${w+6} L${w},${y+18} H${-w}Z" fill="${col}"/>`+Array.from({length:4},(_,i)=>`<path d="M${-w+8+i*(w*2-8)/3},${y} v18" stroke="#fbf6ea" stroke-width="3" fill="none"/>`).join('');
const kingyoStall0=()=>`<ellipse cx="2" cy="2" rx="50" ry="5" fill="#000" opacity=".14" stroke="none"/><rect x="-42" y="-22" width="84" height="22" fill="#c99a5b"/><rect x="-42" y="-24" width="84" height="5" fill="#a8703f" stroke-width="1.2"/>`+
 [-26,0,26].map(x=>`<ellipse cx="${x}" cy="-26" rx="13" ry="6" fill="#8fd0e8" stroke-width="1.5"/><ellipse cx="${x-2}" cy="-26" rx="4" ry="2.2" fill="#f08a3a" stroke-width="1"/>`).join('')+
 `<path d="M-40,-62 V-24 M40,-62 V-24" stroke-width="3" fill="none"/>`+awning('#4f7fb0',40,-64);
const manjuStall0=()=>`<ellipse cx="2" cy="2" rx="46" ry="5" fill="#000" opacity=".14" stroke="none"/><rect x="-38" y="-20" width="76" height="20" fill="#c99a5b"/><rect x="-38" y="-22" width="76" height="5" fill="#a8703f" stroke-width="1.2"/>`+
 [-22,0,22].map(x=>`<g transform="translate(${x},-22)"><rect x="-10" y="-12" width="20" height="12" rx="2" fill="#e2bd80"/><path d="M-10,-6 H10" stroke-width="1.2" fill="none"/><g transform="translate(0,-12) scale(.7)">${S.steam(1)}</g></g>`).join('')+
 `<path d="M-36,-64 V-22 M36,-64 V-22" stroke-width="3" fill="none"/>`+awning('#c8362f',36,-66);
const getaShop0=()=>`<ellipse cx="2" cy="2" rx="56" ry="6" fill="#000" opacity=".15" stroke="none"/><rect x="-50" y="-52" width="100" height="52" fill="#efe4cb"/><rect x="-50" y="-52" width="6" height="52" fill="${C.wood}"/><rect x="44" y="-52" width="6" height="52" fill="${C.wood}"/>`+
 `<rect x="-40" y="-40" width="80" height="32" fill="#3d322c"/><rect x="-40" y="-26" width="80" height="4" fill="${C.wood}"/><rect x="-40" y="-12" width="80" height="4" fill="${C.wood}"/>`+
 [-30,-14,2,18,34].map((x,i)=>`<rect x="${x-6}" y="-32" width="12" height="5" rx="2.4" fill="#c99a5b" stroke-width="1"/><rect x="${x-6}" y="-18" width="12" height="5" rx="2.4" fill="#d9b070" stroke-width="1"/>`).join('')+
 `<g transform="translate(0,-52)">${S.tileRoof(124,24)}</g><rect x="-22" y="-76" width="44" height="14" rx="2" fill="#fbf9f3"/>${H.signIcon('geta',.9,0,-69)}`;
const souvenirStall0=()=>`<ellipse cx="2" cy="2" rx="46" ry="5" fill="#000" opacity=".14" stroke="none"/><rect x="-38" y="-20" width="76" height="20" fill="#c99a5b"/><rect x="-38" y="-22" width="76" height="5" fill="#a8703f" stroke-width="1.2"/>`+
 `<rect x="-30" y="-34" width="12" height="12" rx="2" fill="#e8688a" stroke-width="1.2"/><circle cx="-4" cy="-28" r="6" fill="#8fc4a0" stroke-width="1.2"/><rect x="8" y="-36" width="9" height="14" rx="2" fill="#f5c842" stroke-width="1.2"/><circle cx="26" cy="-27" r="5" fill="#fbf6ea" stroke-width="1.2"/>`+
 `<path d="M-36,-62 V-22 M36,-62 V-22" stroke-width="3" fill="none"/>`+awning('#5f9a8a',36,-64);
const kingyoStall=()=>kingyoStall0()+vendorK();
const manjuStall=()=>manjuStall0()+vendorM();
const getaShop=()=>getaShop0()+vendorG();
const souvenirStall=()=>souvenirStall0()+vendorS();
/* 站在招財貓店門口的大招財貓（彩蛋：點了招手、響鈴） */
const manekiBig=()=>`<ellipse cx="2" cy="2" rx="22" ry="5" fill="#000" opacity=".15" stroke="none"/><rect x="-18" y="-12" width="36" height="12" rx="3" fill="#c99a5b"/><path d="M-14,-12 Q-17,-34 -6,-40 H6 Q17,-34 14,-12Z" fill="#fbf9f3"/><path d="M-11,-40 L-12,-52 L-4,-44Z M11,-40 L12,-52 L4,-44Z" fill="#fbf9f3"/><circle cx="0" cy="-37" r="12" fill="#fbf9f3"/>`+
 `<g class="skPaw"><path d="M9,-30 Q18,-34 17,-48 Q14,-51 11,-47 Q11,-38 7,-33Z" fill="#fbf9f3"/></g><circle cx="-4.4" cy="-39" r="1.7" fill="${OL}" stroke="none"/><circle cx="4.4" cy="-39" r="1.7" fill="${OL}" stroke="none"/><path d="M-2,-34 L2,-34 L0,-32Z" fill="#f08cb0" stroke-width="1"/><path d="M-10,-27 Q0,-23 10,-27" fill="none" stroke="#d8413a" stroke-width="3.4"/><circle cx="0" cy="-23" r="3.2" fill="#f5c842" stroke-width="1.2"/><ellipse cx="-6" cy="-17" rx="6" ry="7" fill="#f5c842" stroke-width="1.3"/><path d="M-9,-20 h5" fill="none" stroke-width="1"/>`;
Object.assign(KIND,{skShopR:{w:132,h:104,fn:()=>shop7('#a8322e')},skShopB:{w:132,h:104,fn:()=>shop7('#3e5e8a')},skShopG:{w:132,h:104,fn:()=>shop7('#4f8a5a')},skShopP:{w:132,h:104,fn:()=>shop7('#7a4f8a')},
 skHotel:{w:210,h:150,fn:hotelSvg},skFootbath:{w:118,h:44,fn:footSvg},skBambooFence:{w:112,h:36,fn:bambooFence},skRedLamp:{w:30,h:64,fn:redLamp},skOkeStack:{w:50,h:44,fn:okeStack},
 skKingyoStall:{w:92,h:72,fn:kingyoStall},skManjuStall:{w:84,h:72,fn:manjuStall},skGetaShop:{w:112,h:84,fn:getaShop},skSouvenirStall:{w:84,h:70,fn:souvenirStall},skManekiBig:{w:48,h:56,fn:manekiBig}});
Object.assign(HOSTN,{skSteamer:'蒸籠',skRedLamp:'紅燈籠',skOkeStack:'溫泉木桶'});
['skSteamer','skRedLamp','skOkeStack'].forEach(k=>HOSTK.add(k));
ALWAYSX[N]=new Set([]);
HEAVYX[N]=new Set(['skShopR','skShopB','skShopG','skShopP','skHotel','skFootbath','skKingyoStall','skManjuStall','skGetaShop','skSouvenirStall','skManekiBig','skBambooFence']);

/* ================= 7b. 溫泉街的人群與活動（2026-11-11 主帳號合併時加；使用者選：人群小故事 A～H、②日本舞踊小舞台、③舞獅、⑤花見幕；動作照 GUIDE「動作怎麼選」） ================= */
const sh=(w,o=.15)=>`<ellipse cx="3" cy="2" rx="${w}" ry="6" fill="#000" opacity="${o}" stroke="none"/>`;
const yk=(o={})=>({top:'kimono',bottom:'kimono',kim:'B',hat:-1,...o});           /* 浴衣 */
const towelTop=`<rect x="-10" y="-58" width="20" height="7" rx="3.5" fill="#fbf9f3" stroke-width="1.2"/><path d="M-5,-57 v5 M0,-57.5 v5.5 M5,-57 v5" stroke="#7fb4d8" stroke-width="1.2" fill="none"/>`;
const towelNeck=`<path d="M-8,-19 Q0,-14 8,-19 L7,-8 L4,-8 L4,-16 Q0,-14 -4,-16 L-4,-8 L-7,-8Z" fill="#fbf9f3" stroke-width="1.1"/>`;
const tear=(x,y)=>`<path d="M${x},${y} q-2.6,4 0,5.2 q2.6,-1.2 0,-5.2Z" fill="#9fd0e8" stroke-width=".9"/>`;
const sweat=(x,y)=>`<path d="M${x},${y} q-2,3.4 0,4.4 q2,-1 0,-4.4Z" fill="#cfe9f2" stroke-width=".9"/>`;
const band7=`<path d="M-13,-41 Q0,-45 13,-41 L13,-37 Q0,-41 -13,-37Z" fill="#fbf6ea" stroke-width="1.2"/>`;
const say=c=>wrapAn('lean',H.bubble(0,0,c),true);

/* ---- 足湯（重畫：石頭池邊、木板長凳、竹筒引溫泉水、水面漣漪和花瓣、小木牌；有人坐在凳上泡腳） ---- */
const FOOTW=150,FOOTH=92;
function footbathArt(v=0){
 const stones=(pts)=>pts.map(([x,y,rx,ry],i)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${['#b9b4a8','#a9a395','#c4bfb2','#9b968a'][i%4]}" stroke-width="1.5"/>`).join('');
 let s=sh(72,.14);
 /* 池子外框：不規則的石頭圍一圈 */
 s+=`<path d="M-66,-20 Q-68,-44 -40,-48 Q0,-54 42,-48 Q68,-44 66,-20 Q64,4 34,6 Q0,9 -34,6 Q-64,4 -66,-20Z" fill="#a9a395"/>`;
 /* 後面的木板長凳（坐泡腳的人） */
 s+=`<rect x="-56" y="-62" width="112" height="9" rx="3" fill="#c99a5b"/><path d="M-50,-53 v6 M50,-53 v6 M0,-53 v6" stroke="#8a6a4a" stroke-width="3" fill="none"/><path d="M-56,-58 H56" stroke="#a8703f" stroke-width="1" fill="none"/>`;
 /* 坐在凳上的人：先畫人，再畫水，腳就像泡在水裡 */
 const P=[[[-34,yk({view:'front',pose:'sit',kim:'B',shirt:'#3e5e8a',pat:'#fbf6ea',mood:3,extra:towelTop})],[-8,yk({view:'front',pose:'sit',kim:'B',shirt:'#f6e3ec',pat:'#e86a8a',mood:0})],[26,{view:'front',pose:'sit',top:'long',bottom:'shorts',hat:-1,mood:1}]],
  [[-30,yk({view:'front',pose:'sit',kim:'C',hair:'#e8e4dc',hs:3,mood:3})],[-6,yk({view:'front',pose:'sit',kim:'C',hair:'#d8d4cc',hs:0,mood:0,extra:towelTop})],[30,yk({view:'front',pose:'sit',kim:'B',shirt:'#e8eef6',pat:'#3b5a8a',mood:1})]]][v%2];
 for(const [x,o] of P)s+=act(x,-44,1,o,o.mood===3?false:'nod');
 /* 水：兩層藍綠＋漣漪＋花瓣 */
 s+=`<path d="M-56,-26 Q-58,-42 -36,-44 Q0,-48 36,-44 Q58,-42 56,-26 Q54,-6 30,-4 Q0,-2 -30,-4 Q-54,-6 -56,-26Z" fill="#8fd3d0"/>`;
 s+=`<path d="M-48,-26 Q-48,-38 -30,-39 Q0,-42 30,-39 Q48,-38 48,-26 Q46,-12 26,-10 Q0,-9 -26,-10 Q-46,-12 -48,-26Z" fill="#a9e2df" stroke="none"/>`;
 s+=`<g fill="none" stroke="#e8f8f6" stroke-width="1.6"><ellipse cx="-28" cy="-20" rx="9" ry="3"/><ellipse cx="-28" cy="-20" rx="4" ry="1.4"/><ellipse cx="18" cy="-16" rx="10" ry="3.2"/><path d="M-6,-30 q6,-3 12,0"/></g>`;
 s+=`<g fill="#f7c4d3" stroke="none">`+[[-40,-14],[4,-24],[32,-28],[-14,-12],[40,-14]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="3" ry="1.7"/>`).join('')+`</g>`;
 /* 前緣的石頭 */
 s+=stones([[-58,-8,10,7],[-42,1,11,7],[-22,4,10,6],[0,5,12,6],[22,4,10,6],[42,1,11,7],[58,-8,10,7],[-64,-24,7,9],[64,-24,7,9]]);
 /* 竹筒引水：從右後方伸進來，一道水流進池子 */
 s+=`<path d="M70,-66 V-26" stroke="${OL}" stroke-width="6" fill="none"/><path d="M70,-66 V-26" stroke="#8fb05a" stroke-width="3.6" fill="none"/>`+
  `<path d="M74,-62 L46,-52" stroke="${OL}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M74,-62 L46,-52" stroke="#8fb05a" stroke-width="4.6" fill="none" stroke-linecap="round"/><path d="M62,-57.5 v-1" stroke="#6a8a3a" stroke-width="5" fill="none"/>`+
  `<path d="M45,-51 Q42,-44 44,-34" stroke="#d8f2f0" stroke-width="3" fill="none"/><ellipse cx="44" cy="-33" rx="6" ry="2" fill="none" stroke="#fff" stroke-width="1.3"/>`;
 /* 小木牌「足湯」 */
 s+=`<g transform="translate(-74,6)"><path d="M0,0 V-30" stroke="#8a6a4a" stroke-width="3" fill="none"/><rect x="-10" y="-46" width="20" height="18" rx="2" fill="#e2bd80"/>${H.signIcon('foot',.95,0,-37)}</g>`;
 /* 蒸氣（會慢慢飄） */
 s+=wrapAn('float',`<g opacity=".75"><g transform="translate(-52,-30) scale(.6)">${S.steam(1)}</g><g transform="translate(40,-24) scale(.5)">${S.steam(1)}</g></g>`,true);
 return s}

/* ---- 攤位老闆（照動作分配：撈金魚 nod、蒸饅頭 work、擺木屐 bend、紀念品 nod） ---- */
const tongs=`<path d="M12,-17 L22,-30 M14,-16 L24,-28" stroke="#8a6a4a" stroke-width="1.6" fill="none"/>`;
const vendorK=()=>act(54,0,-1,{view:'fq',pose:'stand',hat:-1,top:'long',shirt:'#3e5e8a',extra:band7},'nod');
const vendorM=()=>act(-50,0,1,{view:'side',pose:'reach',hat:-1,top:'long',shirt:'#fbf6ea',pants:'#3a3a50',extra:band7+tongs},'work');
const vendorG=()=>act(-40,6,1,{view:'side',pose:'crouch',...yk({kim:'C',shirt:'#5f8a7a'}),extra:`<g transform="translate(15,-10)">${ART.sk_geta?`<g transform="scale(.42)">${ART.sk_geta}</g>`:''}</g>`},'bend');
const vendorS=()=>act(50,0,-1,{view:'fq',pose:'stand',...yk({kim:'A',shirt:'#f4b6c2'})},'nod');

/* ---- A 扠腰喝牛奶：泡完湯的大叔，旁邊小孩學他 ---- */
const milkB=(x,y,a)=>`<g transform="translate(${x},${y}) rotate(${a})"><rect x="-3" y="-8" width="6" height="11" rx="2" fill="#fbf9f3" stroke-width="1.1"/><rect x="-2.6" y="-10.5" width="5.2" height="3" rx="1" fill="#f0c040" stroke-width=".9"/></g>`;
const milkMan=()=>sh(26,.13)+act(-10,0,1,{view:'side',pose:'up',...yk({kim:'B',shirt:'#e8eef6',pat:'#3b5a8a'}),hair:'#2f2622',hs:1,mood:3,extra:towelNeck+milkB(17,-31,-120)},'nod')+
 act(18,0,1,{view:'side',pose:'up',s:.72,hat:-1,top:'tee',bottom:'shorts',mood:3,extra:milkB(17,-31,-120)},'nod')+say('heart');
/* ---- B 溫泉桌球：旅館前院兩個穿浴衣的人對打，球飛來飛去，旁邊有人加油 ---- */
const paddle=`<g transform="translate(15,-19)"><circle r="4.6" fill="#d8413a" stroke-width="1.1"/><path d="M-2,3 l-3,4" stroke="#a8703f" stroke-width="2.4" fill="none"/></g>`;
const pingpong=()=>{let s=sh(60,.13)+`<path d="M-34,-18 V0 M34,-18 V0 M-28,-14 V2 M28,-14 V2" stroke-width="2.4" fill="none"/><path d="M-40,-24 H40 L36,-16 H-36Z" fill="#3f7a5a"/><path d="M0,-24 V-32 M-3,-24 V-31 H3 V-24" stroke-width="1.4" fill="none"/><path d="M-38,-20 H38" stroke="#fbf6ea" stroke-width="1" fill="none"/>`;
 s+=act(-54,0,1,{view:'side',pose:'reach',...yk({kim:'B',shirt:'#3e5e8a',pat:'#fbf6ea'}),extra:paddle},'hop')+act(54,0,-1,{view:'side',pose:'reach',...yk({kim:'B',shirt:'#f6e3ec',pat:'#e86a8a'}),extra:paddle},'hop');
 s+=`<circle r="2.6" fill="#fff" stroke-width="1"><animateMotion dur="1.1s" repeatCount="indefinite" path="M-40,-32 Q-20,-58 0,-34 Q20,-58 40,-32 Q20,-58 0,-34 Q-20,-58 -40,-32"/></circle>`;
 s+=act(8,-34,1,{view:'back',pose:'up2',s:.85,...yk({kim:'B'})},'cheer');return s};
/* ---- C 撈金魚破網：小孩蹲著，紙網破了一臉沮喪，爸爸在旁邊笑 ---- */
const poi=`<g transform="translate(15,-14)"><circle r="5" fill="#fbf9f3" stroke-width="1.2"/><path d="M-1,-2 L2,1 L-2,2Z" fill="#8fd0e8" stroke-width=".8"/><path d="M-3,4 l-4,6" stroke="#d8413a" stroke-width="2" fill="none"/></g>`;
const fishBag=`<g transform="translate(14,-18)"><path d="M-5,0 Q-7,9 0,10 Q7,9 5,0Z" fill="#dff1f7" stroke-width="1"/><ellipse cx="0" cy="5" rx="2.4" ry="1.5" fill="#f08a3a" stroke="none"/><path d="M0,0 v-4" stroke-width="1" fill="none"/></g>`;
const kingyoKid=()=>sh(30,.12)+`<ellipse cx="-4" cy="-4" rx="16" ry="5" fill="#8fd0e8"/><path d="M-12,-5 q3,-2 5,0 q-2,2 -5,0Z" fill="#f08a3a" stroke-width=".8"/>`+
 act(-14,0,1,{view:'side',pose:'crouch',s:.8,hat:-1,top:'tee',bottom:'shorts',mood:2,extra:poi+sweat(10,-50)},'bend')+act(20,0,-1,{view:'fq',pose:'hold',mood:3,extra:fishBag},'nod');
/* ---- D 饅頭賣完了：排隊的人，最後一個看到「賣完」牌子哭臉 ---- */
const soldOut=()=>sh(40,.12)+`<g transform="translate(-44,0)"><path d="M0,0 V-26" stroke="#8a6a4a" stroke-width="2.6" fill="none"/><rect x="-13" y="-40" width="26" height="15" rx="2" fill="#fbf9f3"/>${H.signIcon('soldout',.92,0,-32.5)}</g>`+
 act(-18,0,1,{view:'back',pose:'stand'},'lean')+act(4,1,1,{view:'bq',pose:'stand'},'lean')+act(28,0,-1,{view:'fq',pose:'reach',mood:1,extra:tear(-5,-30)+tear(4,-30)},'lean');
/* ---- E 浴衣情侶分吃一串烤糰子（醬色，和要找的三色糰子不同） ---- */
const mitarashi=`<g transform="translate(16,-24)"><path d="M-6,8 L6,-8" stroke="#c99a5b" stroke-width="1.6" fill="none"/>${[-3,0,3].map(k=>`<circle cx="${k}" cy="${-k}" r="3" fill="#b5703a" stroke-width=".9"/>`).join('')}</g>`;
const couple=()=>sh(26,.12)+act(-12,0,1,{view:'side',pose:'hold',...yk({kim:'B',shirt:'#3e5e8a',pat:'#fbf6ea'}),extra:mitarashi},'nod')+act(12,0,-1,{view:'side',pose:'reach',...yk({kim:'B',shirt:'#f6e3ec',pat:'#e86a8a'}),mood:1},'nod')+
 wrapAn('float',H.heart(0,-62,'#e86a8a'),true);
/* ---- F 問路的觀光客：揹大背包拿地圖，店員伸手指方向 ---- */
const bigPack=`<path d="M-15,-34 H-5 V-6 H-15Z" fill="#d8913a" stroke-width="1.3"/><rect x="-14" y="-40" width="8" height="6" rx="2" fill="#a8622e" stroke-width="1.1"/>`;
const openMap=`<g transform="translate(14,-22)"><path d="M-8,-7 L-2,-5 L4,-7 L10,-5 V7 L4,5 L-2,7 L-8,5Z" fill="#f2e6c4" stroke-width="1.1"/><path d="M-6,2 Q0,-4 7,0" stroke="#d8413a" stroke-width=".9" fill="none"/></g>`;
const askWay=()=>sh(30,.12)+act(-14,0,1,{view:'side',pose:'hold',hat:pk([1,2]),top:'long',bottom:'pants',shirt:'#6f9a7a',extra:bigPack+openMap+`<text x="4" y="-58" font-size="11" stroke="none" fill="#2b2420">?</text>`},'nod')+
 act(18,0,-1,{view:'side',pose:'up',...yk({kim:'C',shirt:'#5f8a7a'}),mood:0},'nod');
/* ---- G 學招財貓拍照：小孩舉手學招財貓，媽媽拿相機 ---- */
const camera7=`<g transform="translate(14,-20)"><rect x="-5" y="-4" width="10" height="7" rx="1.5" fill="#4a4f5c" stroke-width="1.1"/><circle cx="0" cy="-.5" r="2" fill="#9fd0e8" stroke-width=".9"/></g>`;
const catPose=()=>sh(26,.12)+act(-16,0,-1,{view:'front',pose:'stand',arm:1,s:.78,hat:-1,top:'tee',bottom:'shorts',mood:1,extra:`<path d="M-11,-44 L-8,-52 L-4,-46Z M11,-44 L8,-52 L4,-46Z" fill="#fbf9f3" stroke-width="1"/>`},'hop')+
 act(20,0,-1,{view:'side',pose:'hold',...yk({kim:'A',shirt:'#f4b6c2'}),extra:camera7},'lean');
/* ---- H 抱著大木桶的小孩搖搖晃晃，後面阿嬤追著 ---- */
const bigOke=`<g transform="translate(2,-6)"><path d="M-13,0 Q-15,-13 -13,-24 H13 Q15,-13 13,0Z" fill="#c99a5b"/><path d="M-14,-17 H14 M-14,-7 H14" stroke="#8a6a4a" stroke-width="2.4" fill="none"/><ellipse cx="0" cy="-24" rx="13" ry="4" fill="#e2bd80" stroke-width="1.3"/></g>`;
const okeKid=()=>sh(30,.12)+act(-20,0,1,{view:'side',pose:'reach',...yk({kim:'C',hair:'#e8e4dc',hs:3}),mood:1,extra:sweat(-2,-56)},'step')+
 wrapAn('lean',act(14,0,1,{view:'front',pose:'stand',s:.72,hat:-1,top:'tee',bottom:'shorts',mood:2})+`<g transform="translate(15,3) scale(.72)">${bigOke}</g>`,true);
/* ---- 旅館女將在門口鞠躬迎客、提行李的客人 ---- */
const suitcase=`<g transform="translate(12,-4)"><rect x="-6" y="-12" width="12" height="13" rx="2" fill="#6a86b0" stroke-width="1.2"/><path d="M-3,-12 v-3 h6 v3" fill="none" stroke-width="1.2"/></g>`;
const okami=()=>sh(30,.12)+act(-14,0,1,{view:'front',pose:'stand',...yk({kim:'C',shirt:'#7a4f8a',hair:'#2f2a3a',hs:3}),mood:3},'bend')+act(18,0,-1,{view:'side',pose:'stand',hat:pk([0,1]),top:'coat',bottom:'pants',extra:suitcase},'lean');
/* ---- 掃落花的店員 ---- */
const broom=`<path d="M12,-24 L22,4" stroke="#a8703f" stroke-width="2.4" fill="none"/><path d="M17,0 L29,6 L24,10 L15,4Z" fill="#d9b070" stroke-width="1.2"/>`;
const sweeper=()=>sh(22,.12)+`<ellipse cx="26" cy="2" rx="14" ry="3.6" fill="#f7c4d3" stroke="none" opacity=".9"/>`+act(0,0,1,{view:'side',pose:'hold',...yk({kim:'C',shirt:pk(['#3e5e8a','#5f8a7a','#7a4f8a'])}),extra:band7+broom},'work');

/* ---- ② 日本舞踊小舞台：金屏風、扇子舞、三味線 ---- */
const fan=`<g transform="translate(22,-30) rotate(-20)"><path d="M0,0 L-9,-11 Q0,-17 9,-11Z" fill="#f0c040" stroke-width="1.1"/><path d="M0,0 L-4,-14 M0,0 L0,-15 M0,0 L4,-14" stroke="#d8413a" stroke-width=".8" fill="none"/></g>`;
const shamisen=`<g transform="translate(10,-14) rotate(-35)"><rect x="-5" y="-5" width="10" height="10" rx="2" fill="#e8dcc4" stroke-width="1.1"/><path d="M0,-5 V-30" stroke="#3a2e2a" stroke-width="2.4" fill="none"/><path d="M-2,-30 h4" stroke-width="1.4"/></g>`;
const buyoStage=()=>{let s=sh(84,.15)+`<path d="M-82,-22 H82 V0 H-82Z" fill="#c99a5b"/><path d="M-82,-22 H82" fill="none"/><path d="M-86,-24 H86 L82,-30 H-82Z" fill="#a8703f"/>`;
 for(let i=0;i<6;i++)s+=`<rect x="${-72+i*24}" y="-108" width="24" height="78" fill="${i%2?'#f0c548':'#e8b838'}" stroke-width="1.5"/>`;
 s+=`<path d="M-60,-90 q14,-10 26,0 q10,6 22,-2 M10,-76 q16,-12 30,0" stroke="#fbf6ea" stroke-width="2.2" fill="none" opacity=".8"/><circle cx="44" cy="-92" r="7" fill="#f7c4d3" stroke-width="1.1"/><circle cx="-46" cy="-62" r="5" fill="#f7c4d3" stroke-width="1"/>`;
 s+=act(-50,-30,1,{view:'fq',pose:'hold',legs:'sit',...yk({kim:'C',shirt:'#2f2a3a',hair:'#2b2420',hs:0}),mood:3,extra:shamisen},'groove');
 s+=act(10,-30,1,{view:'side',pose:'up',top:'kimono',bottom:'kimono',kim:'A',shirt:'#c8362f',obi:'#f0c040',pat:'#fde4ec',hat:-1,hair:'#2b2420',hs:3,extra:fan},'dance');
 s+=wrapAn('lean',noteAt(-28,-74),true);return s};
const noteAt=(x,y)=>(H.noteM?H.noteM(x,y):'');
const buyoFans=()=>act(-20,0,1,{view:'back',pose:'sit',...yk({})},'nod')+act(4,2,1,{view:'back',pose:'sit',...yk({kim:'A'})},'nod')+act(28,0,1,{view:'bq',pose:'sit',...yk({kim:'C'})},false);
/* ---- ③ 舞獅：紅色獅頭、綠底白紋的獅身，兩個人在裡面；敲鑼的人、興奮的小孩 ---- */
const shishi=()=>{let s=sh(64,.15);
 const legs=x=>`<rect x="${x-6}" y="-14" width="5" height="14" rx="2" fill="#2f2622"/><rect x="${x+2}" y="-14" width="5" height="14" rx="2" fill="#2f2622"/>`;
 let lion=legs(-30)+legs(14);
 lion+=`<path d="M-50,-14 Q-56,-40 -26,-48 Q0,-54 20,-44 L24,-16 Q-10,-8 -50,-14Z" fill="#3f8a5a"/>`;
 lion+=`<g fill="none" stroke="#fbf6ea" stroke-width="2.2">${[[-38,-30],[-18,-38],[-4,-24],[-28,-20],[10,-34]].map(([x,y])=>`<path d="M${x-5},${y} a5,5 0 1 1 5,5 a3,3 0 1 1 -3,-3"/>`).join('')}</g>`;
 lion+=`<path d="M-52,-20 q-8,-4 -6,-12" stroke="#3f8a5a" stroke-width="5" fill="none"/>`;
 /* 獅頭：紅漆、金眼、白牙、下巴會開合 */
 let head=`<rect x="14" y="-62" width="34" height="28" rx="7" fill="#d8413a"/><path d="M14,-58 Q8,-66 18,-68 M30,-62 Q30,-70 38,-68" fill="#3a2e2a" stroke-width="1.6"/><circle cx="24" cy="-52" r="4.2" fill="#f0c040" stroke-width="1.2"/><circle cx="38" cy="-52" r="4.2" fill="#f0c040" stroke-width="1.2"/><circle cx="25" cy="-52" r="1.6" fill="${OL}" stroke="none"/><circle cx="39" cy="-52" r="1.6" fill="${OL}" stroke="none"/><path d="M18,-40 H46" stroke="#fbf6ea" stroke-width="3" fill="none"/>`;
 head+=`<g><path d="M16,-38 H46 L44,-28 H18Z" fill="#b8302a"/><path d="M20,-37 H44" stroke="#fbf6ea" stroke-width="2.4" fill="none"/><animateTransform attributeName="transform" type="rotate" values="0 16 -38;12 16 -38;0 16 -38" dur=".7s" repeatCount="indefinite"/></g>`;
 s+=wrapAn('dance',lion+head,true);
 s+=act(-80,0,1,{view:'side',pose:'hold',hat:-1,top:'long',shirt:'#c8362f',pants:'#2f2622',extra:band7+`<g transform="translate(16,-20)"><circle r="7" fill="#f0c040" stroke-width="1.3"/><circle r="2.4" fill="#d8a020" stroke="none"/></g><path d="M8,-26 L14,-34" stroke="#8a6a4a" stroke-width="2" fill="none"/>`},'work');
 return s};
const shishiKids=()=>act(-16,0,-1,{view:'fq',pose:'up2',s:.75,hat:-1,top:'tee',bottom:'shorts',mood:1},'cheer')+act(8,2,-1,{view:'fq',pose:'up',s:.72,hat:-1,...yk({kim:'B'}),mood:1},'hop')+act(30,0,-1,{view:'side',pose:'reach',hat:-1,mood:0},'lean');
/* ---- ⑤ 花見幕：紅白直條紋布幕圍起來，裡面的人坐著野餐 ---- */
const maku=()=>{let s=sh(92,.13)+`<path d="M-80,-6 L76,-10 L86,10 L-70,14Z" fill="#9fd0e8"/><path d="M-50,-7 L-44,12 M-10,-8 L-4,13 M30,-9 L36,12" stroke="#fff" stroke-width="1.4" opacity=".6" fill="none"/>`;
 const stripes=(x0,y0,x1,y1,h,n)=>{let t='';for(let i=0;i<n;i++){const a=i/n,b=(i+1)/n,xa=x0+(x1-x0)*a,ya=y0+(y1-y0)*a,xb=x0+(x1-x0)*b,yb=y0+(y1-y0)*b;t+=`<path d="M${f(xa)},${f(ya)} L${f(xb)},${f(yb)} L${f(xb)},${f(yb-h)} L${f(xa)},${f(ya-h)}Z" fill="${i%2?'#fbf6ea':'#d8413a'}" stroke-width="1.2"/>`}return t+`<path d="M${x0},${y0-h} L${x1},${y1-h}" stroke-width="2.4" fill="none"/>`};
 s+=stripes(-84,-14,80,-18,46,14);  /* 後面的幕 */
 s+=[-84,80].map(x=>`<path d="M${x},${x<0?-14:-18} V-66" stroke="#7a5235" stroke-width="3" fill="none"/>`).join('');
 s+=`<rect x="-30" y="-2" width="16" height="10" rx="1.6" fill="#c8362f" stroke-width="1.2"/><rect x="-30" y="-6" width="16" height="5" rx="1.6" fill="#2f2622" stroke-width="1.1"/><circle cx="8" cy="4" r="4.4" fill="#fbf6ea" stroke-width="1.1"/><rect x="18" y="-2" width="6" height="9" rx="1.6" fill="#e8dcc4" stroke-width="1"/>`;
 s+=act(-56,0,1,{view:'fq',pose:'hold',legs:'sit',...yk({kim:'A'}),extra:`<path d="M12,-22 l6,0 l-1,4 h-4Z" fill="#fbf6ea" stroke-width="1"/>`},'nod');
 s+=act(-8,-8,1,{view:'front',pose:'sit',top:'kimono',bottom:'kimono',kim:'C',hat:-1,mood:1},'cheer');
 s+=act(42,-2,-1,{view:'fq',pose:'reach',legs:'sit',...yk({kim:'B'})},'nod');
 s+=act(66,10,-1,{view:'bq',pose:'sit',hat:-1,top:'long',bottom:'pants'},false);
 s+=stripes(56,10,90,-2,34,3);      /* 右邊側幕（斜的） */
 return s};

Object.assign(KIND,{skFootbath:{w:FOOTW,h:FOOTH,fn:()=>footbathArt(ri(0,1))},skMilkMan:{w:56,h:60,fn:milkMan},skPingPong:{w:140,h:60,fn:pingpong},skKingyoKid:{w:56,h:56,fn:kingyoKid},
 skSoldOut:{w:96,h:56,fn:soldOut},skCouple:{w:50,h:66,fn:couple},skAskWay:{w:60,h:60,fn:askWay},skCatPose:{w:56,h:56,fn:catPose},skOkeKid:{w:56,h:58,fn:okeKid},
 skOkami:{w:60,h:56,fn:okami},skSweeper:{w:56,h:52,fn:sweeper},skBuyo:{w:176,h:112,fn:buyoStage},skBuyoFans:{w:70,h:44,fn:buyoFans},skShishi:{w:160,h:72,fn:shishi},
 skShishiKids:{w:64,h:50,fn:shishiKids},skMaku:{w:180,h:72,fn:maku}});
['skBuyo','skShishi','skMaku','skPingPong'].forEach(k=>HEAVYX[N].add(k));

/* ================= 7c. 草地上的景（2026-11-11 使用者：人都在路上、草地太空；選 2 煮溫泉蛋、3 露天溫泉猴子、5 小祠堂＋綁籤樹、6 小溪＋水車（湯畑、山坡茶園使用者看過後刪掉）） ================= */
const CREEK=[[860,240],[900,330],[930,430],[880,540],[820,640],[790,760],[740,880],[700,1000],[660,1120],[620,1230],[580,1320]];
const creekD='M'+CREEK.map(p=>p.join(',')).join(' L');
const segD=(x,y,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)};
const inCreek=(x,y,m=0)=>{for(let i=1;i<CREEK.length;i++)if(segD(x,y,CREEK[i-1],CREEK[i])<17+m)return true;return false};
const creekG=()=>`<path d="${creekD}" fill="none" stroke="#a9a395" stroke-width="40" stroke-linejoin="round" stroke-linecap="round"/><path d="${creekD}" fill="none" stroke="${OL}" stroke-width="32" stroke-linejoin="round" stroke-linecap="round"/><path d="${creekD}" fill="none" stroke="#8fd3e0" stroke-width="28" stroke-linejoin="round" stroke-linecap="round"/>`+
 `<path d="${creekD}" fill="none" stroke="#e8f8fa" stroke-width="2" stroke-dasharray="10 26" stroke-linecap="round"/>`+
 CREEK.slice(1,-1).map(([x,y],i)=>`<ellipse cx="${x+(i%2?-20:20)}" cy="${y+8}" rx="7" ry="5" fill="#b9b4a8" stroke-width="1.4"/>`).join('');
const smk=(x,y,k=1)=>wrapAn('float',`<g transform="translate(${x},${y}) scale(${k})" opacity=".85">${S.steam(1)}</g>`,true);
const strawHat=`<path d="M-15,-46 L0,-58 L15,-46 Q0,-43 -15,-46Z" fill="#e2c78a" stroke-width="1.3"/>`;
/* ---- 2 煮溫泉蛋：冒煙的小泉眼，竹籃吊著雞蛋泡在裡面；有人拉繩子撈蛋，小孩剝蛋吃 ---- */
const eggSpring=()=>{let s=sh(44,.12)+`<ellipse cx="0" cy="-8" rx="38" ry="14" fill="#a9a395"/><ellipse cx="0" cy="-9" rx="30" ry="10" fill="#b8e0c8"/><path d="M-14,-10 q6,-3 12,0" stroke="#eef8f0" stroke-width="1.4" fill="none"/>`;
 s+=`<path d="M-20,-46 V-6 M20,-46 V-6 M-24,-46 H24" stroke="#7a5235" stroke-width="3" fill="none"/><path d="M6,-46 V-18" stroke-width="1" fill="none"/><path d="M-2,-18 Q6,-10 14,-18Z" fill="#c99a5b" stroke-width="1.2"/>`+
  [[2,-17],[6,-19],[10,-17]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="2.6" ry="3" fill="#fbf6ea" stroke-width=".9"/>`).join('');
 s+=smk(-12,-24,.8)+smk(16,-30,.7);
 s+=act(-44,0,1,{view:'side',pose:'reach',...yk({kim:'B',shirt:'#e8eef6',pat:'#3b5a8a'})},'bend');
 s+=act(42,0,-1,{view:'fq',pose:'hold',s:.72,hat:-1,top:'tee',bottom:'shorts',mood:1,extra:`<ellipse cx="13" cy="-17" rx="3" ry="3.6" fill="#fbf6ea" stroke-width="1"/><ellipse cx="13" cy="-16" rx="1.6" ry="1.8" fill="#f5c842" stroke="none"/>`},'hop');
 return s};
/* ---- 3 露天溫泉猴子：石頭圍的小湯池，猴子泡湯（一隻頭頂小毛巾），旁邊有人拍照 ---- */
const mk=(x,y,tw)=>`<g transform="translate(${x},${y}) scale(1.3)"><circle r="8.5" fill="#b9a48a"/><ellipse cx="0" cy="1" rx="5.8" ry="5.2" fill="#e8a0a0"/><circle cx="-2" cy="0" r="1" fill="${OL}" stroke="none"/><circle cx="2" cy="0" r="1" fill="${OL}" stroke="none"/><path d="M-1.5,3 q1.5,1 3,0" fill="none" stroke-width=".9"/>${tw?`<rect x="-6" y="-12" width="12" height="4.6" rx="2.2" fill="#fbf9f3" stroke-width="1"/>`:''}</g>`;
const monkeyOnsen=()=>{let s=sh(80,.13)+`<path d="M-80,-20 Q-82,-52 -40,-56 Q0,-62 40,-56 Q82,-52 80,-20 Q78,4 40,6 Q0,10 -40,6 Q-78,4 -80,-20Z" fill="#a9a395"/>`;
 s+=`<path d="M-70,-24 Q-72,-46 -38,-48 Q0,-52 38,-48 Q72,-46 70,-24 Q68,-4 36,-2 Q0,1 -36,-2 Q-68,-4 -70,-24Z" fill="#9fd3cf" opacity=".92"/>`;
 s+=`<path d="M-52,-20 q8,-3 16,0 M10,-14 q8,-3 16,0" stroke="#e6f4f2" stroke-width="1.5" fill="none"/>`;
 s+=mk(-34,-34,false)+mk(-6,-38,true)+mk(22,-32,false)+mk(48,-28,false);
 s+=[[-34,-26],[-6,-30],[22,-24],[48,-20]].map(([x,y])=>`<ellipse cx="${x}" cy="${y+1}" rx="11" ry="3" fill="#9fd3cf" stroke="none" opacity=".9"/><path d="M${x-11},${y+1} q11,4 22,0" stroke="#e6f4f2" stroke-width="1.3" fill="none"/>`).join('');
 s+=[[-74,-6,12,8],[-54,4,12,7],[-28,8,12,6],[0,9,13,6],[28,8,12,6],[54,4,12,7],[74,-6,12,8],[-80,-28,8,10],[80,-28,8,10],[-60,-50,10,7],[60,-50,10,7]].map(([x,y,a,b],i)=>`<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="${['#b9b4a8','#a9a395','#c4bfb2'][i%3]}" stroke-width="1.5"/>`).join('');
 s+=`<g transform="translate(-64,-56) scale(.7)">${'<circle r="8.5" fill="#b9a48a"/><ellipse cx="0" cy="1" rx="5.8" ry="5.2" fill="#e8a0a0"/><circle cx="-2" cy="0" r="1" fill="'+OL+'" stroke="none"/><circle cx="2" cy="0" r="1" fill="'+OL+'" stroke="none"/><ellipse cx="0" cy="13" rx="8" ry="8" fill="#b9a48a"/>'}</g>`;
 s+=smk(-20,-60,1)+smk(30,-64,.8);
 s+=act(104,4,-1,{view:'side',pose:'hold',hat:pk([0,1]),top:'coat',bottom:'pants',extra:camera7},'lean');
 return s};
/* ---- 5 小祠堂＋綁籤樹：紅屋頂小祠、紅圍兜地藏，樹上綁滿白色籤紙；有人抽籤、有人綁籤 ---- */
const shrine=()=>{let s=sh(60,.12);
 s+=`<rect x="-62" y="-6" width="40" height="6" fill="#a9a395"/><rect x="-56" y="-40" width="28" height="34" fill="#c99a5b"/><rect x="-50" y="-34" width="16" height="22" fill="#3d322c"/><path d="M-66,-38 L-42,-58 L-18,-38Z" fill="#d8413a"/><path d="M-50,-16 h16" stroke="#f0c040" stroke-width="2" fill="none"/>`;
 s+=`<g transform="translate(-6,0)"><ellipse cx="0" cy="-10" rx="7" ry="10" fill="#b9b4a8"/><circle cy="-24" r="6.5" fill="#b9b4a8"/><path d="M-6,-16 Q0,-8 6,-16 L5,-12 Q0,-6 -5,-12Z" fill="#d8413a" stroke-width="1.1"/><path d="M-3,-25 q1,1 2,0 M1,-25 q1,1 2,0" stroke-width=".9" fill="none"/></g>`;
 /* 綁籤樹 */
 s+=`<path d="M40,0 Q36,-24 40,-46" stroke="#7a5235" stroke-width="6" fill="none"/><path d="M40,-30 Q24,-40 14,-38 M40,-36 Q56,-46 66,-42" stroke="#7a5235" stroke-width="3" fill="none"/>`;
 s+=H.SAKURA.blobs?S.blobs([[24,-58,16,'#8fb05a'],[44,-68,18,'#7fa04a'],[62,-56,15,'#8fb05a'],[40,-50,14,'#86a852']]):'';
 s+=[[18,-40],[26,-44],[50,-46],[58,-42],[66,-44],[36,-42],[44,-40]].map(([x,y])=>`<path d="M${x},${y} v6" stroke="#fbf9f3" stroke-width="3" fill="none"/><path d="M${x-2},${y+1} h4" stroke="#fbf9f3" stroke-width="2" fill="none"/>`).join('');
 s+=act(14,14,-1,{view:'fq',pose:'hold',...yk({kim:'A'}),extra:`<g transform="translate(14,-20)"><rect x="-3.4" y="-6" width="6.8" height="10" rx="1" fill="#c8362f" stroke-width="1"/><path d="M0,-6 v-4" stroke-width="1.2"/></g>`},'nod');
 s+=act(76,10,-1,{view:'side',pose:'up',...yk({kim:'B'})},'work');
 return s};
/* ---- 6 小溪邊：木頭水車（會轉）、釣魚的阿公、玩水的小孩 ---- */
/* ---- 水車（使用者選 D：沒有屋子，大水車＋木水道，旁邊有水車帶動的搗米杵） ---- */
const wheel=(R,n,spin=9)=>{let w=`<circle r="${R}" fill="none" stroke="${OL}" stroke-width="7"/><circle r="${R}" fill="none" stroke="#a8703f" stroke-width="4.4"/><circle r="${R*.62}" fill="none" stroke="#8a6a4a" stroke-width="2.4"/>`;
 for(let i=0;i<n;i++){const a=i*Math.PI*2/n;w+=`<path d="M${f(Math.cos(a)*R*.18)},${f(Math.sin(a)*R*.18)} L${f(Math.cos(a)*R)},${f(Math.sin(a)*R)}" stroke="#7a5235" stroke-width="2.6" fill="none"/>`;
  const x=Math.cos(a)*R,y=Math.sin(a)*R,deg=a*180/Math.PI;w+=`<rect x="-2.6" y="-6" width="5.2" height="12" rx="1" fill="#c99a5b" stroke-width="1.2" transform="translate(${f(x)},${f(y)}) rotate(${f(deg)})"/>`}
 w+=`<circle r="${R*.2}" fill="#7a5235" stroke-width="1.6"/><circle r="${R*.07}" fill="#3a2e2a" stroke="none"/>`;
 return `<g>${w}<animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="${spin}s" repeatCount="indefinite"/></g>`};
const drops=(x,y)=>wrapAn('float',`<g fill="#e8f8fa" stroke="#9fd3e0" stroke-width=".8">${[[-8,0],[0,-4],[8,1],[-4,5],[5,6]].map(([a,b])=>`<circle cx="${x+a}" cy="${y+b}" r="2.4"/>`).join('')}</g>`,true);
const millHut=()=>{let s=sh(60,.13);
 s+=`<path d="M-68,0 V-58 M-2,0 V-58 M-72,-58 H2" stroke="#7a5235" stroke-width="4" fill="none"/>`;
 s+=`<g transform="translate(-35,-34)">${wheel(32,12,11)}</g>`;
 s+=`<path d="M-110,-78 L-40,-72" stroke="${OL}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-110,-78 L-40,-72" stroke="#a8703f" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-110,-79.5 L-40,-73.5" stroke="#8fd3e0" stroke-width="2.4" fill="none"/><path d="M-100,-77 V0" stroke="#7a5235" stroke-width="3.4" fill="none"/>`;
 s+=`<path d="M-41,-72 Q-38,-64 -40,-58" stroke="#d8f2f6" stroke-width="4" fill="none" stroke-linecap="round"/>`+drops(-36,-2);
 s+=`<path d="M10,0 V-48 M58,0 V-48" stroke="#7a5235" stroke-width="3" fill="none"/><path d="M2,-48 L34,-66 L66,-48Z" fill="#c9a96a"/><path d="M-2,-36 H40" stroke="#7a5235" stroke-width="3" fill="none"/>`;
 s+=`<ellipse cx="40" cy="-4" rx="11" ry="5" fill="#9b968a"/><path d="M29,-4 V-12 Q40,-17 51,-12 V-4" fill="#b9b4a8"/>`;
 s+=`<g><rect x="37" y="-40" width="6" height="26" fill="#a8703f" stroke-width="1.2"/><rect x="34" y="-18" width="12" height="7" rx="2" fill="#8a6a4a" stroke-width="1.2"/><animateTransform attributeName="transform" type="translate" values="0,0;0,-8;0,0" dur="1.4s" repeatCount="indefinite"/></g>`;
 return s};
/* ---- 鹿群餵仙貝：小孩拿鹿仙貝被追著跑，一隻鹿點頭鞠躬，媽媽在笑 ---- */
const deer=(bow)=>{let d=`<path d="M-14,0 V-12 M-8,0 V-12 M8,0 V-12 M14,0 V-12" stroke="#8a5a32" stroke-width="3" fill="none"/><ellipse cx="0" cy="-17" rx="19" ry="9" fill="#c98a52"/>`+
 [[-8,-20],[-1,-22],[6,-19],[-4,-15],[3,-14]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.5" fill="#fbf6ea" stroke="none"/>`).join('')+`<path d="M-19,-18 l-4,-3" stroke="#fbf6ea" stroke-width="2.4" fill="none"/>`;
 const head=`<path d="M12,-22 L18,-36" stroke="${OL}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M12,-22 L18,-36" stroke="#c98a52" stroke-width="5.4" fill="none" stroke-linecap="round"/><ellipse cx="22" cy="-38" rx="7" ry="5.4" fill="#c98a52"/><path d="M15,-42 l-5,-4 l6,1Z M20,-43 l-1,-6 l4,4Z" fill="#c98a52" stroke-width="1.2"/><circle cx="21" cy="-39" r="1.2" fill="${OL}" stroke="none"/><circle cx="28.5" cy="-37" r="1.4" fill="${OL}" stroke="none"/>`;
 d+=bow?`<g>${head}<animateTransform attributeName="transform" type="rotate" values="0 13 -22;34 13 -22;0 13 -22" dur="1.6s" repeatCount="indefinite"/></g>`:head;return d};
const senbei=`<g transform="translate(15,-20)"><circle r="5" fill="#e2bd80" stroke-width="1.1"/><circle r="1.4" fill="#c99a5b" stroke="none"/></g>`;
const deerPark=()=>sh(70,.12)+T(-48,-6,1,deer(false),true)+T(-16,4,1.05,deer(true))+T(44,-2,.9,deer(false))+T(30,14,.75,deer(false),true)+
 act(64,10,1,{view:'side',pose:'run',s:.75,hat:-1,top:'tee',bottom:'shorts',mood:1,extra:senbei},'hop')+act(-80,6,1,{view:'fq',pose:'stand',...yk({kim:'A'}),mood:3},'nod');
/* ---- 旅館後院曬浴衣：衣桁上掛著浴衣和毛巾，風一吹會飄；女中正在晾 ---- */
const yukataHang=(x,c,p)=>`<g transform="translate(${x},-62)"><g><path d="M-16,0 H16 L13,10 V40 H-13 V10Z" fill="${c}" stroke-width="1.5"/><path d="M-6,0 L0,12 L6,0" fill="none" stroke-width="1.2"/><path d="M-13,20 H13" stroke="${p}" stroke-width="3" fill="none"/>${[-8,0,8].map(k=>`<path d="M${k},26 v10" stroke="${p}" stroke-width="1.4" fill="none"/>`).join('')}<animateTransform attributeName="transform" type="skewX" values="0;5;-2;0" dur="${2.4+x%3*.3}s" repeatCount="indefinite"/></g></g>`;
const laundry=()=>{let s=sh(80,.12)+`<path d="M-80,0 V-66 M80,0 V-66 M-86,-62 H86" stroke="#7a5235" stroke-width="3.4" fill="none"/>`;
 s+=yukataHang(-54,'#e8eef6','#3b5a8a')+yukataHang(-18,'#fbf6ea','#e86a8a')+yukataHang(18,'#dfe9f2','#3b5a8a');
 s+=[44,58,70].map(x=>`<g transform="translate(${x},-62)"><g><rect x="-5" y="0" width="10" height="22" fill="#fbf9f3" stroke-width="1.3"/><path d="M-5,16 H5" stroke="#7fb4d8" stroke-width="2" fill="none"/><animateTransform attributeName="transform" type="skewX" values="0;6;0" dur="2s" repeatCount="indefinite"/></g></g>`).join('');
 s+=`<g transform="translate(100,0)"><path d="M-12,0 Q-14,-12 -10,-16 H10 Q14,-12 12,0Z" fill="#c99a5b"/><path d="M-8,-16 h16" stroke-width="1"/><rect x="-7" y="-20" width="14" height="5" rx="2" fill="#fbf6ea" stroke-width="1"/></g>`;
 s+=act(96,8,-1,{view:'side',pose:'up',...yk({kim:'C',shirt:'#7a4f8a'}),extra:`<path d="M-7,-14 H7 V-2 H-7Z" fill="#fbf9f3" stroke-width="1"/>`},'work');
 return s};
/* ---- 竹林邊挖竹筍：阿公拿鋤頭挖，阿嬤揹竹簍，地上冒出小竹筍 ---- */
const shoot=(x,y,k=1)=>`<g transform="translate(${x},${y}) scale(${k})"><path d="M-6,0 Q-6,-10 0,-18 Q6,-10 6,0Z" fill="#c99a5b"/><path d="M-6,0 Q-2,-8 0,-18 M6,0 Q2,-8 0,-18" stroke="#8a6a4a" stroke-width="1" fill="none"/><path d="M0,-18 l1,-4" stroke="#7a9a3a" stroke-width="2" fill="none"/></g>`;
const hoe=`<path d="M12,-22 L26,4" stroke="#a8703f" stroke-width="2.6" fill="none"/><path d="M22,2 L32,-2 L30,6Z" fill="#9b968a" stroke-width="1.2"/>`;
const basketBack=`<path d="M-16,-36 H-4 L-6,-12 H-14Z" fill="#c9a96a" stroke-width="1.3"/><path d="M-15,-28 h10 M-14,-20 h9" stroke="#8a6a4a" stroke-width="1" fill="none"/>`+shoot(-10,-36,.6);
const takenoko=()=>sh(56,.12)+`<ellipse cx="20" cy="2" rx="16" ry="4" fill="#a8835a" stroke="none" opacity=".7"/>`+shoot(-40,4)+shoot(8,8,.8)+shoot(46,0,1.1)+shoot(28,6,.7)+
 act(-6,0,1,{view:'side',pose:'hold',legs:'crouch',hair:'#e8e4dc',hs:0,...yk({kim:'C',shirt:'#5a6a7a'}),hat:-1,extra:strawHat+hoe},'work')+
 act(-58,-4,1,{view:'side',pose:'stand',hair:'#e8e4dc',hs:3,...yk({kim:'B',shirt:'#e8eef6'}),extra:basketBack},'nod');
/* ---- 人力車休息站：人力車停在樹下，車夫坐著擦汗喝水，客人正要上車 ---- */
const parkedRick=()=>`<path d="M-4,-24 L-54,-4" stroke="${OL}" stroke-width="5" fill="none"/><path d="M-4,-24 L-54,-4" stroke="#a8703f" stroke-width="2.6" fill="none"/>`+
 `<path d="M-8,-26 H26 V-42 Q26,-48 18,-48 H0 Q-8,-48 -8,-40Z" fill="#c8362f"/><rect x="-8" y="-28" width="34" height="5" fill="#a8703f" stroke-width="1.3"/><path d="M-12,-46 Q8,-80 32,-46Z" fill="#2f2622"/><path d="M-8,-46 V-28 M28,-46 V-30" stroke-width="2.4" fill="none"/>`+
 `<circle cx="10" cy="-17" r="17" fill="none" stroke-width="6"/><circle cx="10" cy="-17" r="17" fill="none" stroke="#8a4a2a" stroke-width="3"/><path d="M-7,-17 H27 M10,-34 V0 M-2,-29 L22,-5 M22,-29 L-2,-5" stroke="#a8703f" stroke-width="1.8" fill="none"/>`;
const rickRest=()=>sh(70,.12)+parkedRick()+
 `<rect x="-96" y="-16" width="40" height="5" rx="1.5" fill="#c99a5b"/><path d="M-92,-11 v11 M-60,-11 v11" stroke="#8a6a4a" stroke-width="2.6" fill="none"/>`+
 act(-80,-12,1,{view:'fq',pose:'hold',legs:'sit',hat:-1,top:'long',bottom:'pants',shirt:'#2f4a6a',pants:'#2f2622',mood:3,extra:towelNeck+sweat(10,-54)+`<rect x="11" y="-24" width="5" height="9" rx="1.5" fill="#cfe6f0" stroke-width="1"/>`},'nod')+
 act(50,6,-1,{view:'side',pose:'reach',...yk({kim:'A'})},'lean')+act(74,6,-1,{view:'side',pose:'stand',...yk({kim:'C'})},'nod');
/* ---- 小孩玩羽子板：兩個穿浴衣的小孩打羽子，羽子在中間飛；旁邊有人打陀螺 ---- */
const paddleH=`<g transform="translate(15,-22) rotate(-20)"><rect x="-3.6" y="-10" width="7.2" height="13" rx="2" fill="#f0c040" stroke-width="1.1"/><circle cx="0" cy="-5" r="1.8" fill="#d8413a" stroke="none"/><path d="M0,3 v5" stroke="#a8703f" stroke-width="2" fill="none"/></g>`;
const hanetsuki=()=>{let s=sh(52,.12)+act(-40,0,1,{view:'side',pose:'reach',s:.78,...yk({kim:'A',shirt:'#f4b6c2'}),mood:1,extra:paddleH},'hop')+act(40,0,-1,{view:'side',pose:'up',s:.78,...yk({kim:'B'}),mood:1,extra:paddleH},'hop');
 s+=`<g><circle r="2.6" fill="#3a2e2a" stroke="none"/><path d="M0,-2 l-3,-6 M0,-2 l0,-7 M0,-2 l3,-6" stroke="#d8413a" stroke-width="2" fill="none"/><animateMotion dur="1.4s" repeatCount="indefinite" path="M-26,-32 Q0,-64 26,-36 Q0,-64 -26,-32"/></g>`;
 s+=act(4,26,1,{view:'side',pose:'crouch',s:.7,hat:-1,top:'tee',bottom:'shorts'},'bend')+`<g transform="translate(20,26)"><g><path d="M-6,-6 L6,-6 L0,2Z" fill="#d8413a" stroke-width="1.1"/><path d="M-6,-6 H6" stroke="#f0c040" stroke-width="2" fill="none"/><animateTransform attributeName="transform" type="scale" values="1,1;-1,1;1,1" dur=".4s" repeatCount="indefinite"/></g></g>`;
 return s};
const fisher=()=>act(0,0,-1,{view:'side',pose:'hold',legs:'sit',hair:'#e8e4dc',hs:0,...yk({kim:'C',shirt:'#5a6a7a'}),hat:-1,extra:strawHat+`<path d="M12,-18 L40,-44" stroke="#a8703f" stroke-width="2" fill="none"/><path d="M40,-44 Q46,-20 44,4" stroke-width=".8" fill="none"/>`},false)+`<rect x="-14" y="-10" width="16" height="10" rx="2" fill="#c99a5b" stroke-width="1.2"/>`;
const splash=()=>act(-12,0,1,{view:'side',pose:'up2',s:.72,hat:-1,top:'tee',bottom:'shorts',mood:1},'hop')+act(14,2,-1,{view:'fq',pose:'reach',s:.7,hat:-1,top:'tee',bottom:'shorts',mood:1},'cheer')+
 `<g fill="#cfeef2" stroke-width="1">${[[-2,-30],[4,-36],[10,-28]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.4"/>`).join('')}</g><ellipse cx="0" cy="2" rx="26" ry="5" fill="#8fd3e0" stroke="none" opacity=".7"/>`;
Object.assign(KIND,{skEggSpring:{w:110,h:60,fn:eggSpring},skMonkeyOnsen:{w:200,h:80,fn:monkeyOnsen},
 skShrine:{w:150,h:80,fn:shrine},skMill:{w:130,h:90,fn:millHut},skDeer:{w:180,h:70,fn:deerPark},skLaundry:{w:200,h:80,fn:laundry},skTakenoko:{w:130,h:60,fn:takenoko},skRickRest:{w:190,h:80,fn:rickRest},skHane:{w:100,h:70,fn:hanetsuki},skFisher:{w:50,h:56,fn:fisher},skSplash:{w:56,h:44,fn:splash}});
['skMonkeyOnsen','skShrine','skMill','skDeer','skLaundry','skRickRest'].forEach(k=>HEAVYX[N].add(k));

/* ================= 8. 撒佈景 ================= */
const BASE=[['bush',.7],['grassClump',1],['round',.3],['skRedLamp',.7],['skSteamer',.5],['skOkeStack',.45],['crate',.4],['barrel',.35],['skBench',.25],['skPetalPile',.3]];
Object.assign(POOL,{
 sk7S:[...BASE,['skSlipper',.3],['skDollCat',.3],['skBalloonOr',.25],['skBallStr',.25],['skUmbrella',.25]],
 sk7Pl:[...BASE,['skBellString',.3],['skBaozi',.3],['skVaseWhite',.3],['skTissue',.3],['skBallStr',.2]],
 sk7Mid:[...BASE,['skDollCat',.3],['skBellString',.25],['skRedBall',.3],['skMapFold',.25],['skBaozi',.25],['skSwirlPop',.3],['skUmbrella',.2]],
 sk7N:[...BASE,['skBamboo',.9],['skMapFold',.3],['skTissue',.25],['skSwirlPop',.25],['skVaseWhite',.3],['skBalloonOr',.25],['skBallStr',.2]],
 sk7W:[...BASE,['skSlipper',.3],['skRedBall',.3],['skVaseWhite',.25],['skSwirlPop',.25],['skUmbrella',.2]],
 sk7E:[...BASE,['skBamboo',.7],['skBaozi',.3],['skTissue',.25],['skBalloonOr',.25],['skMapFold',.25],['skBallStr',.2]],
 sk7All:[['bush',.9],['grassClump',1.4],['round',.5],['skBamboo',.5],['skSakuraHalf',.4]]});
Object.assign(VPLAN,{sk7S:{walker:3,chat:2,carryBox:2,dogWalk:1},sk7Pl:{benchPair:2,chat:3,flowerWatch:1,walker:2,sleeping:1},sk7Mid:{walker:3,chat:3,handInHand:2,carryBox:1,petCat:1},
 sk7N:{walker:3,chat:2,handInHand:1,flowerWatch:1},sk7W:{chat:2,walker:2,benchPair:1},sk7E:{walker:2,chat:2,carryBox:1},sk7All:{walker:2,chat:2}});
H.SCATOK.sk7All=(x,y)=>{const p=PTS.reduce((m,q)=>Math.min(m,Math.hypot(q.x-x,q.y-y)),1e9);return p>PW/2+90&&Math.hypot((x-1420)/290,(y-1810)/255)>1};

const FEST={};
function structures(){
 skyBirds(N);
 /* 彎內小廣場：兩個足湯池（2026-11-11 重畫）＋竹籬笆、木桶、長椅 */
 add(1320,1800,FOOTW,FOOTH,'skFootbath',footbathArt(0),{s:1.2});add(1530,1850,FOOTW,FOOTH,'skFootbath',footbathArt(1),{s:1.2});
 add(1424,1838,112,36,'skBambooFence',bambooFence(),{s:1.0});
 add(1260,1930,50,44,'skOkeStack',okeStack(),{s:1.15});add(1620,1965,50,44,'skOkeStack',okeStack(),{s:1.15});
 add(1400,1950,52,24,'skBench',H.KIND.skBench?H.KIND.skBench.fn():'',{s:1.2});
 /* 東側溫泉旅館、門口的女將、前院的溫泉桌球 */
 add(1730,1730,210,150,'skHotel',hotelSvg(),{s:1.6});
 add(1700,1790,60,56,'skOkami',okami(),{s:1.1});FEST.okami={x:1700,y:1790};
 add(1790,1880,140,60,'skPingPong',pingpong(),{s:1.1});FEST.pp={x:1790,y:1880};
 /* 足湯廣場的小故事：扠腰喝牛奶、抱木桶的小孩 */
 add(1600,2045,56,60,'skMilkMan',milkMan(),{s:1.1});FEST.milk={x:1600,y:2045};
 add(1450,2050,56,58,'skOkeKid',okeKid(),{s:1.1});FEST.oke={x:1450,y:2050};
 /* ②日本舞踊小舞台（北段彎道東側）、③舞獅（坡道中段）、⑤花見幕（西側草地） */
 add(1475,770,176,112,'skBuyo',buyoStage(),{s:1.15});FEST.buyo={x:1475,y:770};
 add(1475,850,70,44,'skBuyoFans',buyoFans(),{s:1.1});
 { const p=at(1200);add(p.x,p.y+10,160,72,'skShishi',shishi(),{s:1.15});FEST.shishi={x:p.x,y:p.y+10};
   add(p.x+40,p.y+90,64,50,'skShishiKids',shishiKids(),{s:1.05}) }
 add(735,1720,180,72,'skMaku',maku(),{s:1.15});FEST.maku={x:735,y:1720};
 add(700,1640,40,90,'skSakura',KIND.skSakura.fn(),{s:1.3});add(840,1625,40,90,'skSakuraHalf',KIND.skSakuraHalf.fn(),{s:1.2});
 /* 草地上的景（7c）：東邊猴子露天溫泉；西邊小溪＋水車、小祠堂、煮溫泉蛋 */
 add(1745,905,200,80,'skMonkeyOnsen',monkeyOnsen(),{s:1.1});FEST.monkey={x:1745,y:905};
 add(840,730,130,90,'skMill',millHut(),{s:1.15});
 /* 使用者 2026-11-11 換上的：鹿群、旅館後院曬浴衣、挖竹筍、人力車休息站、羽子板 */
 add(1760,1250,180,70,'skDeer',deerPark(),{s:1.1});FEST.deer={x:1760,y:1250};
 add(1770,1455,200,80,'skLaundry',laundry(),{s:1.05});FEST.laundry={x:1770,y:1455};
 add(1440,320,40,90,'skBamboo',KIND.skBamboo.fn(),{s:1.3,mark:false});add(1500,350,40,90,'skBamboo',KIND.skBamboo.fn(),{s:1.2,mark:false});
 add(1450,420,130,60,'skTakenoko',takenoko(),{s:1.1});FEST.take={x:1450,y:420};
 add(1720,580,40,90,'skSakuraHalf',KIND.skSakuraHalf.fn(),{s:1.3});
 add(1740,640,190,80,'skRickRest',rickRest(),{s:1.1});FEST.rick={x:1740,y:640};
 add(690,1510,100,70,'skHane',hanetsuki(),{s:1.1});FEST.hane={x:690,y:1510};
 add(742,1040,50,56,'skFisher',fisher(),{s:1.1});add(700,1170,56,44,'skSplash',splash(),{s:1.1});
 add(700,470,150,80,'skShrine',shrine(),{s:1.1});FEST.shrine={x:700,y:470};
 add(800,1360,110,60,'skEggSpring',eggSpring(),{s:1.1});FEST.egg={x:800,y:1360};
 /* 攤位（老闆畫在攤位裡）：金魚、饅頭蒸籠、木屐屋、招財貓店（含大招財貓）、紀念品 */
 const stall=(d,side,off,k,svg,w,h,s)=>{const p=at(d,side,off);if(canPlace(p.x,p.y,w,h,false,.5)){add(p.x,p.y,w,h,k,svg,{s});return p}return null};
 FEST.stalls=[];
 { const p=stall(520,1,150,'skKingyoStall',kingyoStall(),92,72,1.3);if(p){FEST.stalls.push({...p,k:'kingyo'});add(p.x-10,p.y+70,56,56,'skKingyoKid',kingyoKid(),{s:1.1})} }
 { const p=stall(980,-1,150,'skManjuStall',manjuStall(),84,72,1.3);if(p){FEST.stalls.push({...p,k:'manju'});add(p.x+10,p.y+66,96,56,'skSoldOut',soldOut(),{s:1.05})} }
 { const p=stall(1500,1,170,'skGetaShop',getaShop(),112,84,1.3);if(p)FEST.stalls.push({...p,k:'geta'}) }
 { const p=at(1980,-1,175);add(p.x,p.y,132,104,'skShopP',shop7('#7a4f8a'),{s:1.2});
   add(p.x+96,p.y+4,48,56,'skManekiBig',manekiBig(),{s:1.4});add(p.x+150,p.y+10,56,56,'skCatPose',catPose(),{s:1.05});FEST.shopP=p }
 { const p=stall(2300,1,150,'skSouvenirStall',souvenirStall(),84,70,1.3);if(p)FEST.stalls.push({...p,k:'souv'}) }
 /* 路上的小故事：浴衣情侶、問路的觀光客、掃落花的店員 */
 { const p=at(1680,-1,62);add(p.x,p.y,50,66,'skCouple',couple(),{s:1.1}) }
 { const p=at(300,1,58);add(p.x,p.y,60,60,'skAskWay',askWay(),{s:1.1});FEST.ask={x:p.x,y:p.y} }
 for(const [d,sd] of [[430,-1],[1880,1],[2380,-1]]){const p=at(d,sd,70);if(canPlace(p.x,p.y,56,52,false,.4))add(p.x,p.y,56,52,'skSweeper',sweeper(),{s:1.05})}
 /* 路邊的紅燈籠柱 */
 for(let d=200,k=0;d<LEN-120;d+=170,k++){const side=k%2?1:-1,p=at(d,side,PW/2+22);if(canPlace(p.x,p.y,30,64,false,.3))add(p.x,p.y,30,64,'skRedLamp',redLamp(),{s:1.15})}
 /* 兩層木造商店：沿著彎道兩側錯落 */
 const KS=['skShopR','skShopB','skShopG','skShopP'];let ki=0;
 for(let d=170;d<LEN-210;d+=205){for(const side of [1,-1]){const dd=d+(side<0?100:0),p0=at(dd,side,0),off=PW/2+84+46*Math.abs(p0.ny),p=at(dd,side,off),k=KS[(ki++)%4];
   if(FEST.shopP&&Math.abs(p.x-FEST.shopP.x)<260&&Math.abs(p.y-FEST.shopP.y)<170)continue;
   if(canPlace(p.x,p.y,132,104,false,.55))add(p.x,p.y,132,104,k,KIND[k].fn(),{s:1.2,fl:r()<.5})}}
 /* 北端：朱紅鳥居通往竹林（第 8 關入口） */
 add(1178,330,108,96,'skTorii',S.torii({}),{s:1.6,mark:false});
 for(const [x,y,s] of [[1040,250,1.3],[1090,210,1.5],[1140,190,1.4],[1230,196,1.5],[1290,220,1.4],[1340,255,1.3],[980,290,1.2],[1400,300,1.2]])add(x,y,40,90,'skBamboo',KIND.skBamboo.fn(),{s,mark:false});
}
function scatterAll(){
 scatter('sk7S',POOL.sk7S,2800,50);scatter('sk7Pl',POOL.sk7Pl,3000,55);scatter('sk7Mid',POOL.sk7Mid,3000,60);scatter('sk7N',POOL.sk7N,4000,80);
 scatter('sk7W',POOL.sk7W,3200,50);scatter('sk7E',POOL.sk7E,2600,40);scatter('sk7All',POOL.sk7All,5000,70);
}
SCENE_IMPL[N]={ground,structures,scatter:scatterAll};
/* ================= 9. 連環小故事「睡著的小水獺」 ================= */
const otterBasin=()=>`<ellipse cx="0" cy="3" rx="26" ry="5" fill="#000" opacity=".15" stroke="none"/><path d="M-24,-14 Q-24,2 0,2 Q24,2 24,-14Z" fill="#c99a5b"/><path d="M-24,-8 H24 M-22,-2 H22" stroke="#8a6a4a" stroke-width="2" fill="none"/><ellipse cx="0" cy="-14" rx="24" ry="7" fill="#8fd0e8"/>`+
 `<path d="M-13,-17 Q-14,-30 0,-31 Q14,-30 13,-17 Q8,-12 0,-12 Q-8,-12 -13,-17Z" fill="#9a6a45"/><circle cx="-11" cy="-27" r="3.6" fill="#9a6a45"/><circle cx="11" cy="-27" r="3.6" fill="#9a6a45"/><ellipse cx="0" cy="-19" rx="8" ry="5.4" fill="#e8d2b0" stroke-width="1.2"/>`+
 `<path d="M-7,-24 Q-4,-22 -1,-24 M1,-24 Q4,-22 7,-24" fill="none" stroke-width="1.5"/><ellipse cx="0" cy="-20" rx="2.2" ry="1.5" fill="${OL}" stroke="none"/><path d="M-9,-19 h-5 M9,-19 h5" fill="none" stroke-width=".9"/>`+
 `<rect x="-8" y="-39" width="16" height="9" rx="4" fill="#fbf9f3" stroke-width="1.4"/><path d="M-4,-37 V-32 M0,-37 V-32 M4,-37 V-32" stroke="#7fb4d8" stroke-width="1.2" fill="none"/>`+
 `<g transform="translate(14,-34)"><text font-size="9" fill="#2b2420" stroke="none" font-family="sans-serif">z Z</text></g>`;
const fishNetMan=()=>act(0,0,1,{view:'fq',pose:'hold',hat:-1,hair:'#2f2622',hs:1,shirt:'#3e5e8a',pants:'#4a4a5a',mood:1,
 extra:`<path d="M10,-10 L28,-44" fill="none" stroke="${OL}" stroke-width="4"/><path d="M10,-10 L28,-44" fill="none" stroke="#c99a5b" stroke-width="2"/><ellipse cx="31" cy="-50" rx="9" ry="7" fill="#dff1f7" opacity=".8" stroke-width="1.5"/><path d="M26,-50 H36 M31,-56 V-44" stroke-width=".8" fill="none"/>`});
STORIES[N]={title:'睡著的小水獺',who:'旅館女將',
 giver:()=>act(0,0,1,{view:'fq',pose:'reach',hat:-1,hair:'#2f2a3a',hs:3,shirt:'#7a4f8a',pants:'#3a3a50',mood:2}),
 target:()=>`<g transform="scale(1.3)">${otterBasin()}</g>`,tw:56,th:52,
 helper:()=>fishNetMan(),hw:46,hh:70,
 ask:'旅館女將：我照顧的小水獺，頭上頂著小毛巾，泡到一半不見了！',
 need:'小水獺睡在金魚攤的水盆裡⋯拿小網的金魚攤老闆也許有辦法。',
 got:'老闆：小聲點，我用網子輕輕把牠托起來。',
 ok:'小水獺抱著毛巾，迷迷糊糊地走回溫泉了！快帶回女將身邊。'};

/* ================= 10. 場景彩蛋：點大招財貓，牠會招手並響一聲小鈴（不算點錯） ================= */
let waving=0;
/* 點人群與活動：說一句話（不算點錯） */
const near=(o,x,y,w,h)=>o&&Math.abs(x-o.x)<w&&y<o.y+12&&y>o.y-h;let festT=0;
const festTap=(x,y)=>{const t=performance.now(),say=(m,d=2600)=>{if(t-festT>700){festT=t;H.toast(m,d)}return true};
 if(near(FEST.buyo,x,y,110,140)){if(t-festT>700)try{[392,523,587].forEach((q,i)=>setTimeout(()=>tone(q,.16,'triangle',.05),i*160))}catch(_){}return say('三味線叮叮咚咚，舞者跟著節拍慢慢轉扇子。')}
 if(near(FEST.shishi,x,y,100,90)){if(t-festT>700)try{[0,140,280].forEach(d=>setTimeout(()=>tone(780,.12,'square',.03),d))}catch(_){}return say('鏘鏘鏘！舞獅來了，被獅子咬一下頭，今年都會平安喔！')}
 if(near(FEST.deer,x,y,110,80))return say('鹿一直點頭鞠躬：給我仙貝～給我仙貝～');
 if(near(FEST.laundry,x,y,120,90))return say('女中：今天天氣好，浴衣一下子就曬乾了。');
 if(near(FEST.take,x,y,80,70))return say('阿公：剛冒頭的竹筍最嫩，晚上煮竹筍飯！');
 if(near(FEST.rick,x,y,110,90))return say('車夫：休息一下，等等載你們上山！');
 if(near(FEST.hane,x,y,60,70))return say('羽子板打輸的人，臉上要被畫一筆喔！');
 if(near(FEST.monkey,x,y,100,90))return say('猴子們舒服地泡湯，頭上那隻還頂著小毛巾！');
 if(near(FEST.egg,x,y,60,70))return say('溫泉蛋煮好囉！剝開來黃黃軟軟的～');
 if(near(FEST.shrine,x,y,90,90))return say('抽到大吉！把籤綁在樹上，願望會實現喔。');
 if(near(FEST.maku,x,y,110,90))return say('紅白布幕圍起來，就是我們家的賞花小天地～');
 if(near(FEST.pp,x,y,80,70))return say('泡完湯就是要來一場溫泉桌球！');
 if(near(FEST.milk,x,y,34,70))return say('大叔：泡完湯，手扠腰，一口氣喝完牛奶，這才對嘛！');
 if(near(FEST.oke,x,y,40,70))return say('阿嬤：慢一點慢一點，木桶比你還大啦！');
 if(near(FEST.okami,x,y,40,70))return say('女將：歡迎光臨，請慢慢休息。');
 if(near(FEST.ask,x,y,40,70))return say('店員：足湯往上走，看到竹籬笆就到了！');
 const st=(FEST.stalls||[]).find(o=>near(o,x,y,70,100));
 if(st)return say({kingyo:'金魚攤老闆：紙網破了也沒關係，再來一次！',manju:'饅頭攤老闆：今天的溫泉饅頭賣完了，明天請早～',geta:'木屐屋：來試穿看看，走起來喀啦喀啦響喔。',souv:'紀念品攤：招財貓、手巾、風鈴都有喔！'}[st.k]);
 return false};
TAPHOOKS[N]=(x,y)=>{if(festTap(x,y))return true;
 const t=H.sprites.find(s=>s.kind==='skManekiBig'&&Math.abs(x-s.x)<34&&y<s.y+8&&y>s.y-90);if(!t)return false;
 const fx=document.getElementById('fx');if(!fx||waving>1)return true;waving++;
 try{[1568,2093,1568].forEach((q,i)=>setTimeout(()=>tone(q,.22,'sine',.05),i*180))}catch(_){}
 const NS='http://www.w3.org/2000/svg',g=document.createElementNS(NS,'g');fx.appendChild(g);
 /* 直接轉動招財貓原本舉起的那隻手（以前是另外畫一隻手疊上去，原本的手還留在後面像殘影） */
 const paws=[...document.querySelectorAll('.skPaw')];paws.forEach(e=>[...e.children].forEach(c=>{c.setAttribute('vector-effect','non-scaling-stroke');c.setAttribute('stroke-linejoin','round')}));
 const sp=[];for(let i=0;i<8;i++){const e=document.createElementNS(NS,'path');e.setAttribute('d','M0,-4 L1.2,-1.2 L4,0 L1.2,1.2 L0,4 L-1.2,1.2 L-4,0 L-1.2,-1.2Z');e.setAttribute('fill','#f5c842');g.appendChild(e);sp.push({e,a:i*Math.PI/4,r:sr(14,24)})}
 const t0=performance.now(),D=2400,ks=t.s||1.4,px=t.x+14*ks,py=t.y-44*ks;
 const step=now=>{const k=(now-t0)/D;if(k>=1){g.remove();paws.forEach(e=>{e.removeAttribute('transform');[...e.children].forEach(c=>c.removeAttribute('vector-effect'))});waving--;return}
  {const q=(1-Math.cos(k*Math.PI*8))/2;paws.forEach(e=>e.setAttribute('transform',`translate(9,-31) scale(${(1+q*.14).toFixed(3)},${(1-q*.36).toFixed(3)}) skewX(${(-q*8).toFixed(1)}) translate(-9,31)`))} /* 招手是前後揮：手掌往前彎下來再抬起（畫面上看是手變短、手尖往下再回來） */
  sp.forEach(p=>{const rr=p.r*(.4+k);p.e.setAttribute('transform',`translate(${(px+Math.cos(p.a)*rr).toFixed(1)},${(py-8+Math.sin(p.a)*rr).toFixed(1)}) scale(${(1-k*.7).toFixed(2)})`);p.e.setAttribute('opacity',(1-k).toFixed(2))});
  requestAnimationFrame(step)};
 requestAnimationFrame(step);return true};

/* ================= 11. 過場：走石階上半山 ================= */
/* 過場：從第 6 關參道走石階上半山（2026-11-11 使用者選 B 正面：看著背影穿過一座座鳥居往上；原本是人力車，人力車留在街上當景） */
const town=(x0,y0)=>{let w='';[[x0,y0,1],[x0+110,y0-6,.9],[x0+215,y0+4,1.05]].forEach(([x,y,k])=>w+=T(x,y,k*.8,S.shop({noren:pk(['#a8322e','#3e5e8a','#4f8a5a'])}),false));
 [[x0+20,y0-90],[x0+130,y0-96],[x0+240,y0-84]].forEach(([x,y])=>w+=`<g transform="translate(${x},${y}) scale(1.5)" opacity=".85">${S.steam(1)}</g>`);return w};
const walkers=(view)=>[[-18,0,{view,pose:'walk',top:'kimono',bottom:'kimono',kim:'B',shirt:'#cfe0f0',obi:'#3e5e8a',pat:'#3e5e8a',hat:-1}],[14,6,{view,pose:'walk',hat:-1,shirt:'#e86a6a'}],[0,-14,{view,pose:'walk',top:'kimono',bottom:'kimono',kim:'A',shirt:'#f4b6c2',obi:'#c8362f',pat:'#fff',hat:-1}]];
/* 鳥居前後：人物腳底在畫面 y=FEET；鳥居底部走到 FEET 下面（比人更靠近鏡頭）時，前景那一份才顯示、半透明蓋在人物上面（像秘境走到高的東西後面一樣，人還看得到）。2026-11-11 使用者說人物蓋掉鳥居很怪 */
const STFEET=474,STY0=-1090;
const stDepth=()=>{const el=document.getElementById('ride');if(!el)return;const g=el.querySelector('.skStPan');if(!g)return;
 const ty=new DOMMatrix(getComputedStyle(g).transform).m42;el.querySelectorAll('.skStFront [data-ty]').forEach(t=>{t.style.display=(+t.dataset.ty+ty>STFEET)?'':'none'})};
RIDES.stairs={text:'穿過一座座鳥居，石階一直往上⋯',every:380,tick:k=>{tone(k%2?330:280,.04,'triangle',.04);if(k===0){const t0=performance.now(),loop=()=>{stDepth();if(performance.now()-t0<4400)requestAnimationFrame(loop)};loop()}},svg:()=>{
 let w=`<rect x="-100" y="-300" width="600" height="2000" fill="#dcebf6" stroke="none"/>`;
 w+=`<path d="M-100,230 Q60,170 200,210 Q340,170 500,230 V1700 H-100Z" fill="#b9cf92" stroke="none" opacity=".8"/>`;
 w+=town(70,170);
 w+=`<rect x="-100" y="260" width="600" height="1440" fill="#a9c47e" stroke="none"/>`;
 const half=y=>46+ (y-260)*.045;
 w+=`<path d="M${200-half(260)},260 H${200+half(260)} L${200+half(1700)},1700 H${200-half(1700)}Z" fill="${C.stone}"/>`;
 for(let y=1690;y>262;y-=15)w+=`<path d="M${f(200-half(y))},${y} H${f(200+half(y))}" stroke="${C.stone2}" stroke-width="2.4" fill="none"/>`;
 w+=`<path d="M${200-half(260)},260 L${200-half(1700)},1700 M${200+half(260)},260 L${200+half(1700)},1700" fill="none" stroke-width="2.4"/>`;
 const side=[];for(let y=300;y<1650;y+=110)side.push(y);
 side.forEach((y,i)=>{const k=.55+(y-300)/1350*.6;w+=T(200-half(y)-60-r()*30,y,k,S.sakuraTree(i%2?'full':'half'),false)+T(200+half(y)+60+r()*30,y+40,k,S.sakuraTree(i%2?'half':'full'),true)});
 side.forEach((y,i)=>{if(i%2)return;const k=.5+(y-300)/1350*.5;w+=T(200-half(y)-14,y+30,k,S.stoneLantern({}),false)+T(200+half(y)+14,y+30,k,S.stoneLantern({}),false)});
 let fr='';for(let y=330;y<1650;y+=175){const k=(half(y)*2+40)/104,tg=T(200,y,k,S.torii({lamps:y>900}),false);w+=tg;fr+=`<g data-ty="${y}"${y+STY0>STFEET?'':' style="display:none"'}>${tg}</g>`}
 let pt='';for(let i=0;i<50;i++)pt+=`<ellipse cx="${f(sr(-50,450))}" cy="${f(sr(200,1650))}" rx="3.2" ry="1.8" fill="${pk(['#f7c4d3','#fde4ec','#eea6bb'])}" stroke="none" opacity=".8"/>`;
 const ppl=walkers('back').map(([x,y,o])=>`<g transform="translate(${x*1.05},${-y*1.2})">${act(0,0,1,{...o,s:1.1},'step')}</g>`).join('');
 return `<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><style>@keyframes skStB{from{transform:translateY(-1090px)}to{transform:translateY(0)}}</style>`+
  `<g class="skStPan" style="animation:skStB 4.2s cubic-bezier(.3,0,.6,1) forwards;transform:translateY(-1090px)">${w+pt}</g><g transform="translate(200,470)">${ppl}</g>`+
  `<g class="skStFront" opacity=".45" style="animation:skStB 4.2s cubic-bezier(.3,0,.6,1) forwards;transform:translateY(-1090px)">${fr}</g></g></svg>`}};

/* ================= 12. 冒險地圖：第 7 關節點（接在第 6 關上方，座標是加寬後地圖的西邊） ================= */
HERE[N]=[-82,222];
MAPHOOKS.push(({U,P,ink,FN})=>{if(U<N)return '';
 const road='M-78,278 Q-62,266 -74,254 Q-84,248 -82,246';
 let m=H.mapRoute(road,'road',ink);
 m+=`<g class="mnode" data-n="${N}"><circle cx="-82" cy="244" r="26" fill="transparent"/><ellipse cx="-82" cy="250" rx="21" ry="7" fill="#cfd9a0" stroke="${ink}" stroke-width="1.3"/>`+
  P('M-94,248 V238 L-88,232 L-82,238 V248Z','#f1e8d2',1.3)+P('M-98,239 L-88,229 L-78,239Z','#6f7088',1.3)+P('M-80,248 V240 L-74,235 L-68,240 V248Z','#efe4cb',1.3)+P('M-83,241 L-74,232 L-65,241Z','#6f7088',1.3)+
  `<g fill="#fff" stroke="${ink}" stroke-width="1"><circle cx="-90" cy="224" r="3.4"/><circle cx="-85" cy="219" r="4.2"/><circle cx="-77" cy="222" r="3"/></g>`+
  `<g transform="translate(-34,246)"><rect x="-26" y="-10" width="52" height="19" rx="9.5" fill="#fffaf0" stroke="${ink}" stroke-width="1.6"/><text y="4" text-anchor="middle" font-size="11" fill="${ink}" font-family="${FN}">溫泉老街</text></g></g>`;
 return m});
})();


