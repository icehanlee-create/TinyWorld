/* 奇幻小鎮大搜查．第 6 關 櫻花林＋鳥居參道（山腳）
   需要 sakura_common.js（levels.js 第 6 關那一行有 pre:'sakura_common.js'，引擎會先載入）。
   使用者定案：車站 C（茶屋風白牆黑瓦站）＋參道 D（掛燈籠鳥居 4 座、兩側石燈籠列）。
   場景（上北下南）：南＝小車站＋月台＋小火車；中＝參道往北，4 座鳥居越往北越密；東＝賞花草坪；西＝石燈籠列＋長椅；北＝石階接第 7 關。 */
(function(){
const H=window.TH;if(!H)return;
const N=6;
const {T,f,r,sr,pk,ri,OL,kid,act,wrapAn,bubble,add,mark,canPlace,scatter,skyBirds,KIND,POOL,VPLAN,REG,SCREG,LEVELS,ART,DECOY,SCENE_IMPL,
 WATERFN,RIDES,HERE,OUTFITS,STORIES,HOSTK,HOSTN,BORROW,TAPHOOKS,MAPHOOKS,ANIMX,ALWAYSX,HEAVYX,tone,typeOf}=H;
const S=H.SAKURA;if(!S)return;
const C=S.C;

/* ================= 1. 場景範圍、天空、場地邊緣 ================= */
H.SCENES[N]={x0:500,x1:2000,y1:2480,c:[1250,1850]};
H.TARGET[N]=330;
H.SKYC[N]='#e9eef6';H.SKYY[N]=170;
H.EDGEM[N]='';H.EDGED[N]='LRB';
H.EDGEDECO[N]=[['skSakura',3],['skSakuraHalf',2],['bush',1],['round',.8]];
H.FRINGE[N]=[['grassClump',2.4],['skPetalPile',.8]];   /* 靠邊只補草和花瓣：樹會擋住車站和小火車 */
H.DENS[N]=1.33;

/* ================= 2. 當地人的穿著：春天薄外套為主 ================= */
OUTFITS[N]=o=>{if(o.top)return o;
 /* 和服（主帳號 2026-11-11 加，使用者選 A 振袖／B 浴衣／C 羽織混搭，約 7 成路人，羽織 C 佔一半；畫法在 art.js top:'kimono'） */
 if(r()<.7){const st=pk(['A','B','C','C']);o.top='kimono';o.bottom='kimono';o.kim=st;
  o.shirt=pk(st==='B'?['#e8eef6','#fbf6ea','#dfe9f2','#f6e3ec']:['#f4b6c2','#e86a8a','#b9d3e8','#cfe3a6','#d9c2e8','#c8362f','#3b5a8a']);
  o.obi=pk(['#f0c040','#d8413a','#3b5a8a','#fbf6ea','#e8a0b4']);o.pat=st==='B'?pk(['#3b5a8a','#e86a8a','#5f8a3a']):pk(['#fde4ec','#fff','#f7c4d3']);
  if(st!=='C'||r()<.5)o.hat=-1;return o}o.top=pk(['coat','long','long','tee']);o.bottom=pk(['pants','pants','shorts']);
 o.shirt=o.shirt||pk(['#f4b6c2','#cfe3a6','#f7e3a0','#b9d3e8','#fbf6ea','#e8a0b4','#a8c47a','#d9c2e8']);return o};

/* ================= 3. 物件與干擾物（畫在 0,0 附近約 30×30） ================= */
const stick=`<path d="M-14,13 L14,-13" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M-14,13 L14,-13" fill="none" stroke="#c99a5b" stroke-width="2.2"/>`;
const gloss=(x,y)=>`<circle cx="${x-1.6}" cy="${y-1.8}" r="1.3" fill="#fff" stroke="none" opacity=".9"/>`;
Object.assign(ART,{
 sk_dango:stick+`<circle cx="-6" cy="6" r="5.6" fill="#f4b6c8"/><circle cx="0" cy="0" r="5.6" fill="#fbf6ea"/><circle cx="6" cy="-6" r="5.6" fill="#a8c47a"/>`,
 sk_wagasa:`<path d="M2,12 L8,22" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M2,12 L8,22" fill="none" stroke="#c99a5b" stroke-width="2.2"/><circle r="14" fill="#d8413a"/><circle r="9" fill="#fbf6ea" stroke-width="1.2"/><circle r="5" fill="#d8413a" stroke-width="1.2"/>`+
  [0,1,2,3,4,5,6,7,8,9,10,11].map(i=>{const a=i*Math.PI/6;return `<path d="M${f(Math.cos(a)*5)},${f(Math.sin(a)*5)} L${f(Math.cos(a)*14)},${f(Math.sin(a)*14)}" fill="none" stroke="#8a2a22" stroke-width=".9"/>`}).join('')+`<circle r="1.6" fill="#7a5235" stroke="none"/>`,
 sk_kanzashi:`<path d="M-13,14 L7,-6" fill="none" stroke="${OL}" stroke-width="4.6"/><path d="M-13,14 L7,-6" fill="none" stroke="#f0c040" stroke-width="2.4"/>`+
  [0,1,2,3,4].map(i=>{const a=-Math.PI/2+i*Math.PI*2/5;return `<circle cx="${f(9+Math.cos(a)*4.6)}" cy="${f(-9+Math.sin(a)*4.6)}" r="3.6" fill="#f7a8c0" stroke-width="1.3"/>`}).join('')+`<circle cx="9" cy="-9" r="2.4" fill="#f0c040" stroke-width="1.1"/>`+
  `<path d="M4,-4 Q10,2 8,8" fill="none" stroke-width="1.1"/><circle cx="8" cy="9.4" r="2.2" fill="#f7a8c0" stroke-width="1.1"/><circle cx="6.6" cy="14" r="1.8" fill="#fde4ec" stroke-width="1"/>`,
 sk_jubako:`<rect x="-13" y="3" width="26" height="9" rx="1.8" fill="#2f2622"/><rect x="-13" y="-6" width="26" height="9" rx="1.8" fill="#c8362f"/><rect x="-13" y="-15" width="26" height="9" rx="1.8" fill="#2f2622"/><rect x="-14" y="-19" width="28" height="5" rx="2.2" fill="#c8362f"/>`+
  `<g fill="#f3c542" stroke="none"><circle cx="-6" cy="-1.5" r="1.8"/><circle cx="0" cy="-1.5" r="1.8"/><circle cx="6" cy="-1.5" r="1.8"/><circle cx="-5" cy="7.5" r="1.5"/><circle cx="5" cy="7.5" r="1.5"/><circle cx="0" cy="-10.5" r="1.5"/></g>`,
 sk_kitsune:`<path d="M-13,-3 L-12,-17 L-5,-9 Q0,-11 5,-9 L12,-17 L13,-3 Q12,8 0,14 Q-12,8 -13,-3Z" fill="#fbf6ea"/><path d="M-11,-8 L-10.5,-14 L-7,-10Z M11,-8 L10.5,-14 L7,-10Z" fill="#d8413a" stroke="none"/>`+
  `<path d="M-9,-3 Q-6,-6 -3,-2 M9,-3 Q6,-6 3,-2" fill="none" stroke="#d8413a" stroke-width="2"/><path d="M-12,2 Q-8,3 -6,7 M12,2 Q8,3 6,7" fill="none" stroke="#d8413a" stroke-width="1.8"/><path d="M-2,3 L2,3 L0,6Z" fill="${OL}" stroke-width="1"/><path d="M0,-8 V-4" fill="none" stroke="#d8413a" stroke-width="1.8"/>`,
 sk_chochin:`<path d="M-4,-17 Q0,-24 4,-17" fill="none" stroke="${OL}" stroke-width="4"/><path d="M-4,-17 Q0,-24 4,-17" fill="none" stroke="#f0c040" stroke-width="1.8"/><rect x="-6" y="-16" width="12" height="4" rx="1.2" fill="#2f2622"/><ellipse cx="0" cy="-1" rx="11" ry="12" fill="#f8ecd0"/><path d="M-10,-6 Q0,-2 10,-6 M-11,-1 Q0,3 11,-1 M-10,4 Q0,8 10,4" fill="none" stroke="#d8b890" stroke-width="1"/><circle cx="0" cy="-1" r="3" fill="#f7a8c0" stroke-width="1"/><rect x="-6" y="9" width="12" height="4" rx="1.2" fill="#2f2622"/><path d="M0,13 v5" fill="none" stroke-width="1.4"/>`,
 sk_sakuramochi:`<ellipse cx="0" cy="-1" rx="12.5" ry="9.5" fill="#f4b6c8"/><path d="M-14,2 Q-10,12 0,12 Q10,12 14,2 Q8,-4 0,-2 Q-8,-4 -14,2Z" fill="#8ab45a"/><path d="M0,-1 V11 M-6,0 L-7,8 M6,0 L7,8" fill="none" stroke="#5f8a3a" stroke-width="1"/><circle cx="-3" cy="-5" r="1.5" fill="#fde4ec" stroke="none"/>`,
 sk_matcha:`<circle cx="-3" cy="-2" r="12.5" fill="#e8dcc4"/><circle cx="-3" cy="-2" r="9" fill="#6f9a3a" stroke-width="1.3"/><path d="M-9,-3 Q-4,-8 1,-4 M-8,2 Q-3,-1 2,3" fill="none" stroke="#a8d06a" stroke-width="1.3"/>`+
  `<g transform="translate(14,10)"><path d="M-4,-3 Q-6,4 -3,8 H3 Q6,4 4,-3Z" fill="#e2c78a" stroke-width="1.3"/><path d="M-1.5,-3 V8 M1.5,-3 V8" fill="none" stroke-width=".9"/><rect x="-2.6" y="-9" width="5.2" height="6" rx="1" fill="#c99a5b" stroke-width="1.2"/></g>`,
 sk_temari:`<circle r="12.5" fill="#e86a8a"/><g fill="none"><ellipse rx="12.5" ry="5" transform="rotate(30)" stroke="#f5c842" stroke-width="1.8"/><ellipse rx="12.5" ry="5" transform="rotate(90)" stroke="#fbf6ea" stroke-width="1.8"/><ellipse rx="12.5" ry="5" transform="rotate(150)" stroke="#8fc4a0" stroke-width="1.8"/></g><circle r="2.2" fill="#f5c842" stroke-width="1"/><circle cx="-6" cy="-6" r="1.5" fill="#fff" stroke="none" opacity=".8"/>`,
 sk_orizuru:`<path d="M-16,3 L-6,6 L-6,0Z" fill="#f08cb0"/><path d="M-6,0 L2,-4 L8,4 L-1,10Z" fill="#f4b6c8"/><path d="M8,4 L13,-8 L15,-6 L11,6Z" fill="#fbf6ea"/><path d="M13,-8 L18,-6 L14,-5Z" fill="#f08cb0" stroke-width="1.2"/><path d="M-1,-2 L-9,-17 L5,-5Z" fill="#fbf6ea"/><path d="M2,-3 L12,-15 L9,2Z" fill="#f08cb0"/><g fill="#d8413a" stroke="none"><circle cx="0" cy="3" r="1.2"/><circle cx="3" cy="6" r="1.1"/><circle cx="-4" cy="2" r="1"/></g>`});
Object.assign(DECOY,{
 skBallStr:stick+`<circle cx="-6" cy="6" r="5.6" fill="#d8413a"/><circle cx="0" cy="0" r="5.6" fill="#f5c842"/><circle cx="6" cy="-6" r="5.6" fill="#4f86c8"/>`+gloss(-6,6)+gloss(0,0)+gloss(6,-6),
 skUmbrella:`<path d="M-15,3 Q-15,-12 0,-14 Q15,-12 15,3 Q8,-1 0,3 Q-8,-1 -15,3Z" fill="#6f86b0"/><path d="M0,3 V13 Q0,18 5,17" fill="none" stroke="${OL}" stroke-width="4"/><path d="M0,3 V13 Q0,18 5,17" fill="none" stroke="#7a7f88" stroke-width="1.8"/>`,
 skClip:`<g transform="rotate(-25)"><rect x="-14" y="-5" width="28" height="10" rx="5" fill="#f08cb0"/><path d="M-9,0 H9" fill="none" stroke="#fff" stroke-width="1.6" opacity=".7"/><rect x="-14" y="-1.5" width="9" height="3" rx="1.5" fill="#d8688a" stroke-width="1"/></g>`,
 skBento1:`<rect x="-14" y="-8" width="28" height="19" rx="4.5" fill="#9fd0e8"/><path d="M-14,-1 H14" fill="none" stroke-width="1.4"/><rect x="-4" y="-3" width="8" height="5" rx="1.5" fill="#fff" stroke-width="1.1"/><path d="M-10,-8 Q0,-14 10,-8" fill="none" stroke-width="1.4"/>`,
 skDogMask:`<path d="M-13,-4 Q-12,-14 0,-14 Q12,-14 13,-4 Q12,8 0,13 Q-12,8 -13,-4Z" fill="#d9b07a"/><path d="M-13,-6 Q-20,-2 -17,9 Q-10,8 -10,-5Z M13,-6 Q20,-2 17,9 Q10,8 10,-5Z" fill="#6a4a32"/><circle cx="-5" cy="-3" r="1.8" fill="${OL}" stroke="none"/><circle cx="5" cy="-3" r="1.8" fill="${OL}" stroke="none"/><ellipse cx="0" cy="4" rx="4.4" ry="3.2" fill="${OL}" stroke="none"/><path d="M0,7 V10 M-3,10 Q0,12 3,10" fill="none" stroke-width="1.2"/>`,
 skPumpkin:`<path d="M0,-12 Q-14,-12 -14,0 Q-14,11 0,11 Q14,11 14,0 Q14,-12 0,-12Z" fill="#e8683a"/><path d="M0,-12 Q-6,0 0,11 M0,-12 Q6,0 0,11 M-7,-10 Q-12,0 -7,10 M7,-10 Q12,0 7,10" fill="none" stroke="#b8481f" stroke-width="1.1"/><path d="M0,-12 q1,-5 4,-6" fill="none" stroke="#5f8a3a" stroke-width="3"/>`,
 skBun:`<ellipse cx="0" cy="1" rx="13" ry="11" fill="#f4b6c8"/><path d="M-9,-5 Q-4,-9 1,-8" fill="none" stroke="#fde4ec" stroke-width="2.2" stroke-linecap="round"/><circle cx="0" cy="-10" r="1.6" fill="#e08aa8" stroke-width="1"/>`,
 skCup:`<circle r="13" fill="#fbf9f3"/><circle r="8" fill="#fbf9f3" stroke-width="1.4"/><circle r="6" fill="#6f4a2e" stroke-width="1.2"/><path d="M8,-2 q8,-2 8,3 q0,5 -8,3" fill="none" stroke="${OL}" stroke-width="4"/><path d="M8,-2 q8,-2 8,3 q0,5 -8,3" fill="none" stroke="#fbf9f3" stroke-width="1.8"/>`,
 skYarn:`<circle r="12" fill="#7fa7a0"/><path d="M-10,-4 Q0,-12 10,-4 M-11,2 Q0,-6 11,2 M-8,8 Q0,2 8,8 M-4,-10 Q4,0 -2,11" fill="none" stroke="#56807a" stroke-width="1.3"/><path d="M8,8 q6,4 4,9 q-3,3 2,6" fill="none" stroke="#7fa7a0" stroke-width="2"/>`,
 skPlane:`<path d="M-15,2 L15,-9 L3,11 L1,3Z" fill="#fbf9f3"/><path d="M1,3 L15,-9" fill="none" stroke-width="1.3"/>`});

/* 干擾物也是佈景：KIND 名稱要和 DECOY 的名稱一樣 */
const dec=(id,s=.95)=>({w:28,h:28,fn:()=>T(0,-12,s,DECOY[id])});
Object.assign(KIND,{skBallStr:dec('skBallStr'),skUmbrella:dec('skUmbrella'),skClip:dec('skClip'),skBento1:dec('skBento1'),skDogMask:dec('skDogMask'),
 skPumpkin:dec('skPumpkin'),skBun:dec('skBun'),skCup:dec('skCup'),skYarn:dec('skYarn'),skPlane:dec('skPlane')});

/* 12 種 × 4 個。每個區域各放 8 個。舊物件：金鑰匙、羅盤 */
const RS={stn:'sk6Stn',path:'sk6Path',lawn:'sk6Lawn',west:'sk6West',upW:'sk6UpW',upE:'sk6UpE'};
const rg=(...a)=>a.map(k=>RS[k]);
const old=(id,regions)=>({...typeOf(id),regions});
const TYPES=[
 old('compass',rg('stn','path','upE','west')),old('key',rg('lawn','upW','stn','path')),
 {id:'sk_dango',name:'三色糰子',short:'糰子',r:14,rot:20,regions:rg('lawn','path','west','upE')},
 {id:'sk_wagasa',name:'油紙傘',short:'油紙傘',r:15,rot:25,regions:rg('path','upW','lawn','stn')},
 {id:'sk_kanzashi',name:'櫻花髮簪',short:'髮簪',r:14,rot:30,regions:rg('west','upE','path','upW')},
 {id:'sk_jubako',name:'重箱便當',short:'重箱',r:14,rot:10,regions:rg('lawn','stn','upW','west')},
 {id:'sk_kitsune',name:'狐狸面具',short:'狐狸面具',r:14,rot:15,regions:rg('upW','west','upE','lawn')},
 {id:'sk_chochin',name:'紙燈籠',short:'紙燈籠',r:14,rot:12,regions:rg('path','upE','stn','upW')},
 {id:'sk_sakuramochi',name:'櫻餅',short:'櫻餅',r:14,rot:15,regions:rg('lawn','upE','west','stn')},
 {id:'sk_matcha',name:'抹茶碗',short:'抹茶碗',r:15,rot:15,regions:rg('stn','upW','lawn','path')},
 {id:'sk_temari',name:'手鞠球',short:'手鞠球',r:13,rot:20,regions:rg('west','lawn','upW','upE')},
 {id:'sk_orizuru',name:'紙鶴',short:'紙鶴',r:14,rot:25,regions:rg('upE','stn','path','west')}];
LEVELS[N].types=TYPES;

/* ================= 4. 區域 ================= */
Object.assign(REG,{
 sk6Stn:{x:600,y:1850,w:1300,h:370},sk6StnL:{x:540,y:1850,w:210,h:380},sk6StnR:{x:1770,y:1850,w:210,h:380},sk6Path:{x:1130,y:450,w:240,h:1400},sk6Lawn:{x:1420,y:930,w:530,h:850},
 sk6West:{x:560,y:1000,w:550,h:840},sk6UpW:{x:560,y:300,w:550,h:700},sk6UpE:{x:1420,y:300,w:530,h:630},
 sk6All:{x:540,y:260,w:1440,h:2080}});
H.SCREG[N]=['sk6Stn','sk6StnL','sk6StnR','sk6Path','sk6Lawn','sk6West','sk6UpW','sk6UpE','sk6All'];
/* 水池、大櫻花（2026-11-11 主帳號加：使用者說場景太鬆，要大櫻花、水池、賞櫻的人） */
/* 使用者在 A～D 中選 A＋B：東邊錦鯉池＋紅橋、西邊池塘，四周大櫻花 */
const LAY={ponds:[{cx:1690,cy:1330,rx:210,ry:120,bridge:1},{cx:830,cy:1230,rx:220,ry:130}],
 big:[[1500,1150],[1885,1165],[650,1080],[1015,1095],[1515,1575],[1890,1590],[640,1470]]},PONDS=LAY.ponds;
const inPond=(x,y,m=0)=>PONDS.some(p=>{const v=((x-p.cx)/(p.rx+m))**2+((y-p.cy)/(p.ry+m))**2<1;if(!v)return false;const I=p.island;return !(I&&((x-I.x)/(I.rx-m))**2+((y-I.y)/(I.ry-m))**2<1)});
WATERFN[N]=(x,y)=>inPond(x,y,28); /* 連石頭池邊一起算水，路人、佈景、物件不會站到池子裡 */

/* ================= 5. 地面 ================= */
const PX=1250,PW=180;                                   /* 參道中線與寬度 */
const slabs=(x,y,w,h,col='#e2dccd')=>{let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}" stroke="none"/>`;
 for(let yy=y+22;yy<y+h;yy+=36)s+=`<path d="M${x},${yy} H${x+w}" stroke="#cbc4b2" stroke-width="1.4" fill="none"/>`;
 for(let yy=y,k=0;yy<y+h;yy+=36,k++)for(let xx=x+(k%2?30:0)+30;xx<x+w;xx+=60)s+=`<path d="M${xx},${yy} v22" stroke="#cbc4b2" stroke-width="1.2" fill="none"/>`;return s};
function ground(){
 const Sc=H.SCENES[N],X0=Sc.x0-420,WW=Sc.x1-Sc.x0+840;let g='';
 g+=`<rect x="${X0}" y="0" width="${WW}" height="${Sc.y1+420}" fill="#bdd890" stroke="none"/>`;
 for(let i=0;i<46;i++){const x=sr(X0,X0+WW),y=sr(180,Sc.y1);g+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(50,130))}" ry="${f(sr(18,40))}" fill="${pk(['#c6df9a','#b3d086','#cfe3a6'])}" stroke="none" opacity=".7"/>`}
 /* 東側賞花草坪、西側小片草地 */
 g+=`<rect x="1440" y="960" width="500" height="790" rx="60" fill="#d4e8ad" stroke="none"/><rect x="580" y="1380" width="480" height="300" rx="50" fill="#d0e5a8" stroke="none"/>`;
 /* 參道：石板路，北邊接石階，南邊到車站廣場 */
 g+=slabs(PX-PW/2,300,PW,1640);
 g+=`<path d="M${PX-PW/2},300 V1940 M${PX+PW/2},300 V1940" stroke="#a59f8f" stroke-width="3" fill="none"/>`;
 /* 土路小徑：通往草坪、西側長椅 */
 g+=`<path d="M${PX+PW/2},1500 Q1400,1480 1480,1440 M${PX-PW/2},1580 Q1100,1560 1040,1540" stroke="#d9c79a" stroke-width="26" fill="none" stroke-linecap="round" opacity=".9"/>`;
 /* 車站廣場、月台、鐵軌 */
 g+=slabs(760,1940,1000,290);
 g+=`<rect x="${X0}" y="2230" width="${WW}" height="56" fill="#d9d2c2" stroke="none"/><path d="M${X0},2230 H${X0+WW}" stroke="${OL}" stroke-width="2.4" fill="none"/>`;
 g+=`<rect x="${X0}" y="2286" width="${WW}" height="150" fill="#cdbf9a" stroke="none"/>`;
 for(let x=X0+10;x<X0+WW;x+=30)g+=`<rect x="${x}" y="2330" width="14" height="46" fill="#8a6a4a" stroke="none"/>`;
 g+=`<path d="M${X0},2342 H${X0+WW} M${X0},2366 H${X0+WW}" stroke="#6f6a60" stroke-width="5" fill="none"/>`;
 /* FORESHADOW7：北邊遠處山腰的商店屋頂和溫泉煙（第 7 關的伏筆） */
 g+=`<path d="M880,250 Q1000,180 1130,200 Q1260,170 1400,205 Q1500,215 1620,250 V300 H880Z" fill="#a9c47e"/>`;
 g+=[[960,238,.9],[1050,226,1],[1150,232,.85],[1370,228,.95],[1470,238,.85]].map(([x,y,k])=>`<g transform="translate(${x},${y}) scale(${k})"><path d="M-30,0 V-18 H30 V0Z" fill="#efe4cb"/><g transform="translate(0,-18)">${S.tileRoof(74,16)}</g></g>`).join('');
 g+=[[1005,196,1.2],[1190,186,1.5],[1420,194,1.3]].map(([x,y,k])=>`<g transform="translate(${x},${y}) scale(${k})" opacity=".8" stroke="none">${S.steam(1)}</g>`).join('');
 /* 北邊石階前的空地底色 */
 g+=`<rect x="${PX-PW/2-40}" y="230" width="${PW+80}" height="90" fill="#cfc9b9" stroke="none"/>`;
 /* 水池：石頭池邊、睡蓮葉、錦鯉、水面花瓣 */
 const blob=(p,k,dx=0,dy=0)=>{let d='';for(let i=0;i<28;i++){const t=i/28*Math.PI*2,w=1+.05*Math.sin(t*3+p.cx)+.03*Math.cos(t*5);d+=(i?'L':'M')+f(p.cx+dx+Math.cos(t)*p.rx*k*w)+','+f(p.cy+dy+Math.sin(t)*p.ry*k*w)}return d+'Z'};
 for(const p of PONDS){g+=`<path d="${blob(p,1.12)}" fill="#a9a395"/><path d="${blob(p,1)}" fill="#8ccbd2"/><path d="${blob(p,.8,0,6)}" fill="#7cc0cc" stroke="none"/>`;
  for(let i=0;i<14;i++){const t=i/14*Math.PI*2;g+=`<ellipse cx="${f(p.cx+Math.cos(t)*p.rx*1.06)}" cy="${f(p.cy+Math.sin(t)*p.ry*1.06)}" rx="${f(sr(10,16))}" ry="${f(sr(6,9))}" fill="${pk(['#b9b4a8','#a9a395','#c4bfb2'])}" stroke-width="1.4"/>`}
  for(let i=0;i<7;i++){const t=sr(0,6.28),k=sr(.35,.8),x=p.cx+Math.cos(t)*p.rx*k,y=p.cy+Math.sin(t)*p.ry*k;if(p.island&&Math.hypot((x-p.island.x)/p.island.rx,(y-p.island.y)/p.island.ry)<1.3)continue;
   g+=`<path d="M${f(x)},${f(y)} m-11,0 a11,7 0 1 0 22,0 a11,7 0 1 0 -22,0 M${f(x)},${f(y)} l9,-3" fill="#7fae5a" stroke-width="1.3"/>`;if(r()<.4)g+=`<circle cx="${f(x+3)}" cy="${f(y-3)}" r="3.2" fill="#f7c4d3" stroke-width="1"/>`}
  for(let i=0;i<4;i++){const t=sr(0,6.28),x=p.cx+Math.cos(t)*p.rx*.55,y=p.cy+Math.sin(t)*p.ry*.55,a=sr(-30,30),c=pk(['#e8683a','#fbf6ea','#f0a040']);
   g+=`<g transform="translate(${f(x)},${f(y)}) rotate(${f(a)})"><ellipse rx="9" ry="3.6" fill="${c}" stroke-width="1.1"/><path d="M8,0 l6,-3 v6Z" fill="${c}" stroke-width="1"/><circle cx="-2" cy="-1" r="1.6" fill="#d8413a" stroke="none"/></g>`}
  g+=`<g fill="#f7c4d3" stroke="none" opacity=".9">`+Array.from({length:22},()=>{const t=sr(0,6.28),k=sr(.1,.9);return `<ellipse cx="${f(p.cx+Math.cos(t)*p.rx*k)}" cy="${f(p.cy+Math.sin(t)*p.ry*k)}" rx="3" ry="1.7"/>`}).join('')+`</g>`;
  if(p.island)g+=`<ellipse cx="${p.island.x}" cy="${p.island.y+4}" rx="${p.island.rx+6}" ry="${p.island.ry+5}" fill="#a9a395"/><ellipse cx="${p.island.x}" cy="${p.island.y}" rx="${p.island.rx}" ry="${p.island.ry}" fill="#c6df9a"/>`;}
 return `<g stroke="${OL}" stroke-width="2" stroke-linejoin="round">${g}</g>`;
}

/* ================= 6. 佈景圖鑑 ================= */
const sign=txt=>`<rect x="-16" y="-14" width="32" height="12" rx="2" fill="#fff"/>${H.signIcon('sakura',.75,-7,-8)}<g transform="translate(6,-8) scale(.55)" stroke="#2b2420"><rect x="-9" y="-6" width="16" height="10" rx="2.5" fill="#d8413a" stroke-width="1.4"/><rect x="-6" y="-4" width="5" height="4" fill="#d6ecf0" stroke="none"/><circle cx="-5" cy="5" r="2" fill="#3d3833"/><circle cx="3" cy="5" r="2" fill="#3d3833"/><path d="M7,-2 h3" stroke-width="1.6"/></g>`;
const stationSvg=()=>`<g>${S.shop({noren:'#a8322e'})}</g><g transform="translate(0,-108)">${sign('櫻山')}</g>`;
function train(col){let t=`<ellipse cx="0" cy="2" rx="96" ry="6" fill="#000" opacity=".18" stroke="none"/><rect x="-90" y="-36" width="98" height="32" rx="5" fill="#f4ecd8"/><rect x="-90" y="-15" width="98" height="9" fill="${col}"/>`;
 for(let i=0;i<4;i++)t+=`<rect x="${-84+i*23}" y="-30" width="16" height="13" rx="3" fill="#cfe6f0"/>`;
 t+=`<rect x="12" y="-32" width="66" height="28" rx="4" fill="${col}"/><rect x="42" y="-51" width="24" height="21" fill="${col}"/><rect x="45" y="-47" width="17" height="10" rx="2" fill="#cfe6f0"/><rect x="14" y="-47" width="11" height="17" fill="#3a2e2a"/>`;
 t+=`<g class="skSmoke"><circle cx="20" cy="-56" r="6" fill="#fff" opacity=".85" stroke="none"/><circle cx="28" cy="-65" r="8" fill="#fff" opacity=".75" stroke="none"/><circle cx="38" cy="-76" r="9" fill="#fff" opacity=".6" stroke="none"/></g>`;
 for(const x of [-72,-44,-16,32,60])t+=`<circle cx="${x}" cy="-3" r="7.5" fill="#4a4f5c"/><circle cx="${x}" cy="-3" r="2.2" fill="#bbb" stroke="none"/>`;
 return t}
const bench=()=>`<ellipse cx="2" cy="1" rx="26" ry="4" fill="#000" opacity=".15" stroke="none"/><rect x="-24" y="-20" width="48" height="5" rx="1.5" fill="#a8703f"/><rect x="-24" y="-12" width="48" height="6" rx="1.5" fill="#c99a5b"/><path d="M-20,-6 v6 M20,-6 v6" stroke-width="3" fill="none"/>`;
const mat=()=>{const c=pk(['#f4a6b8','#a8d8f0','#f7e3a0','#cfe3a6']);return `<rect x="-24" y="-16" width="48" height="18" rx="2" fill="${c}"/><path d="M-12,-16 v18 M0,-16 v18 M12,-16 v18" stroke="#fff" stroke-width="1.4" opacity=".6" fill="none"/>`+
 `<rect x="-14" y="-13" width="14" height="9" rx="1.6" fill="#c8362f" stroke-width="1.3"/><circle cx="9" cy="-8" r="3.4" fill="#fbf6ea" stroke-width="1.2"/><rect x="14" y="-12" width="6" height="7" rx="1" fill="#e8dcc4" stroke-width="1.1"/>`};
const stationSign=()=>`<rect x="-2" y="-50" width="4" height="50" fill="#8a6a4a"/><rect x="-22" y="-62" width="44" height="18" rx="3" fill="#fbf9f3"/>${H.signIcon('sakura',1,-9,-53)}<path d="M2,-46 L9,-58 L16,-46Z" fill="#8fb07a" stroke-width="1.1"/><path d="M6.6,-54 L9,-58 L11.4,-54Z" fill="#fbf6ea" stroke="none"/>`;
const dangoStall=()=>`<ellipse cx="2" cy="2" rx="40" ry="5" fill="#000" opacity=".15" stroke="none"/><rect x="-32" y="-26" width="64" height="26" fill="#c99a5b"/><rect x="-32" y="-26" width="64" height="5" fill="#a8703f" stroke-width="1.2"/>`+
 `<path d="M-30,-70 V-26 M30,-70 V-26" stroke-width="3" fill="none"/><path d="M-38,-70 H38 L32,-52 H-32Z" fill="#c8362f"/><path d="M-20,-70 L-17,-52 M-4,-70 L-3,-52 M12,-70 L11,-52 M28,-70 L25,-52" stroke="#fbf6ea" stroke-width="3" fill="none"/>`+
 `<g stroke-width="1.2"><path d="M-14,-26 v-12 M-4,-26 v-12 M6,-26 v-12 M16,-26 v-12" fill="none"/><circle cx="-14" cy="-34" r="3.6" fill="#f4b6c8"/><circle cx="-4" cy="-34" r="3.6" fill="#fbf6ea"/><circle cx="6" cy="-34" r="3.6" fill="#a8c47a"/><circle cx="16" cy="-34" r="3.6" fill="#f4b6c8"/></g>`;
const bigSakura=()=>`<g transform="scale(1.75)">${S.sakuraFull()}</g>`+S.petals(16,[-60,-8,120,12],'#f7c4d3');
const redBridge=w=>{const a=w/2;return `<ellipse cx="0" cy="4" rx="${a}" ry="6" fill="#000" opacity=".15" stroke="none"/><path d="M${-a},0 Q0,-34 ${a},0 L${a},8 Q0,-24 ${-a},8Z" fill="#d8413a"/>`+
 `<path d="M${-a+4},-6 Q0,-46 ${a-4},-6" fill="none" stroke="${OL}" stroke-width="5"/><path d="M${-a+4},-6 Q0,-46 ${a-4},-6" fill="none" stroke="#d8413a" stroke-width="2.6"/>`+
 [-.7,-.35,0,.35,.7].map(k=>{const x=k*a,y=-6-40*(1-k*k)*.85;return `<path d="M${f(x)},${f(y)} V${f(-34*(1-k*k)*.85+4)}" stroke-width="2.4" fill="none"/>`}).join('')+
 `<circle cx="${-a+4}" cy="-8" r="3.4" fill="#f3c542" stroke-width="1.2"/><circle cx="${a-4}" cy="-8" r="3.4" fill="#f3c542" stroke-width="1.2"/>`};
/* 賞櫻的人：坐在野餐墊上，便當、茶，有人抬頭指櫻花 */
const hanami=()=>{const c=pk(['#f4a6b8','#a8d8f0','#f7e3a0','#cfe3a6']);let s=`<ellipse cx="2" cy="2" rx="40" ry="6" fill="#000" opacity=".14" stroke="none"/><path d="M-38,-12 L34,-14 L40,4 L-34,6Z" fill="${c}"/><path d="M-20,-13 L-16,5 M0,-13.5 L3,5 M18,-14 L22,4.5" stroke="#fff" stroke-width="1.4" opacity=".6" fill="none"/>`;
 s+=`<rect x="-8" y="-12" width="14" height="8" rx="1.5" fill="#c8362f" stroke-width="1.2"/><rect x="-7" y="-15" width="12" height="4" rx="1" fill="#2f2622" stroke-width="1"/><circle cx="12" cy="-6" r="3" fill="#e8dcc4" stroke-width="1.1"/>`;
 const n=pk([2,3,3]);const spots=[[-24,-2,1],[24,-4,-1],[0,-10,1]];
 for(let i=0;i<n;i++){const [x,y,d]=spots[i];const up=r()<.35;s+=act(x,y,d,{view:i===2?'back':pk(['side','fq']),pose:up?'up':'sit',legs:'sit',s:.95},r()<.5?'nod':false)}
 if(r()<.7)s+=wrapAn('bob',bubble(pk([-26,22]),-62,pk(['heart','note','heart'])),true);
 return s};
Object.assign(KIND,{skSakuraBig:{w:120,h:120,fn:bigSakura},skHanami:{w:84,h:56,fn:hanami},skBridge:{w:200,h:40,fn:()=>redBridge(200)},
 skStation:{w:128,h:112,fn:stationSvg},skTrain:{w:200,h:70,fn:()=>train('#4f7fb0')},skBench:{w:52,h:24,fn:bench},skMat:{w:52,h:22,fn:mat},
 skStationSign:{w:46,h:66,fn:stationSign},skDangoStall:{w:78,h:76,fn:dangoStall}});
Object.assign(HOSTN,{skSakuraBig:'大櫻花樹',skSakura:'櫻花樹',skSakuraHalf:'櫻花樹',skSakuraFall:'落花的櫻花樹',skLantern:'石燈籠',skLanternDim:'石燈籠',skMat:'野餐墊'});
['skSakuraBig','skSakura','skSakuraHalf','skSakuraFall','skLantern','skLanternDim','skMat'].forEach(k=>HOSTK.add(k));
ANIMX[N]={skPetalDrift:['float']};ALWAYSX[N]=new Set(['skPetalDrift']);
HEAVYX[N]=new Set(['skTaiko','skTea','skYatai','skSakuraBig','skSakura','skSakuraHalf','skSakuraFall','skShop','skStation','skTorii','skToriiLamp','skTrain','skStairs','skStairsLow']);

/* ================= 6b. 祭典活動（2026-11-11 主帳號加，使用者選：太鼓表演台、野點茶會、屋台街、燈籠串、池邊小活動） ================= */
const sh=(w,o=.16)=>`<ellipse cx="3" cy="2" rx="${w}" ry="6" fill="#000" opacity="${o}" stroke="none"/>`;
const strike=(inner,d)=>`<g>${inner}<animateTransform attributeName="transform" type="rotate" values="0 0 -6;9 0 -6;0 0 -6" dur="${d}s" repeatCount="indefinite"/></g>`;
const happi=(o={})=>({hat:-1,top:'long',bottom:'pants',shirt:'#2f4a7a',pants:'#2f2622',...o});
const band=`<path d="M-13,-41 Q0,-45 13,-41 L13,-37 Q0,-41 -13,-37Z" fill="#fbf6ea" stroke-width="1.2"/>`;
/* 1. 太鼓表演台：木台、紅白幕、大太鼓兩人對打、旁邊小太鼓、「櫻花祭」看板 */
const drum=(w,h)=>`<rect x="${-w/2}" y="${-h}" width="${w}" height="${h}" rx="${w*.18}" fill="#a8622e"/><ellipse cx="0" cy="${-h/2}" rx="${w*.5}" ry="${h*.5}" fill="none" stroke="#7a4220" stroke-width="1.4"/>`+
 `<ellipse cx="${-w/2+2}" cy="${-h/2}" rx="${w*.12}" ry="${h*.5}" fill="#efe2c4"/><ellipse cx="${w/2-2}" cy="${-h/2}" rx="${w*.12}" ry="${h*.5}" fill="#efe2c4"/><path d="M${-w*.3},${-h} V0 M${w*.3},${-h} V0" stroke="#7a4220" stroke-width="1.2" fill="none"/>`;
const taikoStage=()=>{let s=sh(92)+`<path d="M-88,-30 H88 V0 H-88Z" fill="#c99a5b"/>`;
 for(let i=0;i<8;i++)s+=`<rect x="${-88+i*22}" y="-28" width="11" height="28" fill="#d8413a" stroke="none"/>`;
 s+=`<path d="M-88,-28 H88" fill="none"/><path d="M-92,-30 H92 L88,-36 H-88Z" fill="#a8703f"/>`;
 s+=`<path d="M-80,-36 V-120 M80,-36 V-120" stroke-width="3" fill="none"/><rect x="-62" y="-130" width="124" height="24" rx="4" fill="#fbf6ea"/>${H.signIcon('sakura',1.2,-36,-118)}${H.signIcon('taiko',1.2,0,-117)}${H.signIcon('sakura',1.2,36,-118)}`;
 s+=[-80,80].map(x=>`<path d="M${x},-120 q-6,4 -6,10 q6,4 6,-2" fill="#d8413a" stroke-width="1.2"/>`).join('');
 s+=`<g transform="translate(0,-36)"><path d="M-22,0 L-16,-14 M22,0 L16,-14" stroke="#7a4220" stroke-width="3" fill="none"/><g transform="translate(0,-12)">${drum(46,40)}</g></g>`;
 s+=strike(act(-40,-36,1,happi({view:'side',pose:'up',extra:band+`<path d="M21,-25 L31,-35" stroke="#7a4220" stroke-width="3" fill="none"/>`})),.55);
 s+=strike(act(40,-36,-1,happi({view:'side',pose:'up',shirt:'#c8362f',extra:band+`<path d="M21,-25 L31,-35" stroke="#7a4220" stroke-width="3" fill="none"/>`})),.62);
 s+=`<g transform="translate(-66,-36)"><path d="M-8,0 V-10 M8,0 V-10" stroke-width="2" fill="none"/><g transform="translate(0,-10)">${drum(20,16)}</g></g>`;
 s+=`<g transform="translate(-66,-58)">`+wrapAn('work',kid(happi({view:'front',pose:'stand',arm:2,shirt:'#3f6a5a'})),true)+`</g>`;
 return s};
const audience=()=>act(-12,0,1,{view:'back',pose:pk(['up2','stand','up'])},'cheer')+act(12,0,1,{view:'back',pose:pk(['stand','up2','reach'])},'cheer'); /* 太鼓前的觀眾：興奮地跳 */
/* 4. 野點茶會：紅毛毯、大紅傘、茶師刷抹茶、跪坐的客人、和菓子 */
const teaParty=()=>{let s=sh(78)+`<path d="M-74,-30 L62,-34 L76,4 L-62,8Z" fill="#c8362f"/><path d="M-70,-26 L60,-30" stroke="#e86a6a" stroke-width="1.2" fill="none" opacity=".6"/>`;
 s+=`<g transform="translate(-30,-22)"><path d="M-7,0 h14 v-8 h-14Z" fill="#4a4f5c" stroke-width="1.3"/><path d="M-9,-8 Q0,-22 9,-8Z" fill="#3a2e2a"/><path d="M0,-15 v-3" stroke-width="1.4" fill="none"/></g>`;
 s+=`<g transform="translate(-6,-8)"><path d="M-6,0 Q-7,-6 -5,-7 H5 Q7,-6 6,0Z" fill="#6f9a3a" stroke-width="1.2"/></g><g transform="translate(30,-4)"><ellipse rx="10" ry="4" fill="#fbf6ea" stroke-width="1.2"/><circle cx="-3" cy="-3" r="3" fill="#f4b6c8" stroke-width="1"/><circle cx="3" cy="-3" r="3" fill="#a8c47a" stroke-width="1"/></g>`;
 s+=act(-44,-14,1,{view:'side',pose:'reach',legs:'sit',top:'kimono',bottom:'kimono',kim:'C',shirt:'#3f6a5a',obi:'#f0c040',pat:'#fff',hat:-1,hair:'#2b2420',hs:0,extra:`<path d="M14,-18 v-7" stroke="#e2c78a" stroke-width="2.4" fill="none"/>`},'nod'); /* 茶師點頭刷茶 */
 s+=act(10,-26,-1,{view:'fq',pose:'sit',legs:'sit',top:'kimono',bottom:'kimono',kim:'A',hat:-1});
 s+=act(42,-14,-1,{view:'fq',pose:'sit',legs:'sit',top:'kimono',bottom:'kimono',kim:pk(['A','B']),hat:-1});
 s+=act(20,6,-1,{view:'bq',pose:'sit',legs:'sit',top:'kimono',bottom:'kimono',kim:'C',hat:-1});
 s+=`<path d="M-58,4 V-112" stroke="#7a5235" stroke-width="3.2" fill="none"/><path d="M-118,-96 Q-58,-140 2,-96 Q-58,-108 -118,-96Z" fill="#d8413a"/>`+
  [-100,-80,-58,-36,-16].map(x=>`<path d="M-58,-124 L${x},${f(-98-Math.abs(x+58)*-.02)}" stroke="#a8322e" stroke-width="1" fill="none"/>`).join('')+`<circle cx="-58" cy="-126" r="3" fill="#2b2420" stroke="none"/>`;
 return s};
/* 6. 屋台：章魚燒、蘋果糖、撈金魚、棉花糖（攤主在櫃台後面） */
const YT={tako:{c:'#2f4a7a',t:'章魚燒'},ringo:{c:'#c8362f',t:'蘋果糖'},kingyo:{c:'#3f8fb0',t:'撈金魚'},wata:{c:'#e86a8a',t:'棉花糖'}};
/* 攤位的商品圖案（不用文字） */
const ytIcon=(k,z=1)=>{let g='';
 if(k==='tako')g=`<path d="M-15,4 H15 L12,10 H-12Z" fill="#c99a5b"/>`+[[-8,0],[0,-2],[8,0],[-4,-8],[4,-8]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5.4" fill="#d8a050"/><path d="M${x-3},${y-2} q3,-2 6,0" stroke="#5a3a2a" stroke-width="1.6" fill="none"/>`).join('')+`<path d="M10,-14 L4,-4" stroke="#e8d9b0" stroke-width="1.8" fill="none"/>`;
 if(k==='ringo')g=`<path d="M0,6 V20" stroke="#c99a5b" stroke-width="2.6" fill="none"/><circle cx="0" cy="-2" r="11" fill="#d8262a"/><path d="M0,-12 q2,-5 6,-6" stroke="#5f8a3a" stroke-width="2" fill="none"/><ellipse cx="-4" cy="-6" rx="3" ry="2" fill="#fff" stroke="none" opacity=".85"/>`;
 if(k==='kingyo')g=`<path d="M-12,0 Q-4,-11 8,-3 Q12,0 8,3 Q-4,11 -12,0Z" fill="#e8683a"/><path d="M8,-3 L17,-10 L14,0 L17,10 L8,3" fill="#f0a040"/><circle cx="-6" cy="-2" r="1.6" fill="#2b2420" stroke="none"/><circle cx="-14" cy="-10" r="2" fill="#bfe6f2" stroke-width="1"/><circle cx="-18" cy="-16" r="1.4" fill="#bfe6f2" stroke-width=".9"/>`;
 if(k==='wata')g=`<path d="M0,6 V20" stroke="#c99a5b" stroke-width="2.6" fill="none"/><g><circle cx="-6" cy="-2" r="8" fill="#f7c4d3"/><circle cx="6" cy="-3" r="8" fill="#f7c4d3"/><circle cx="0" cy="-10" r="8" fill="#f7c4d3"/><circle cx="0" cy="2" r="7" fill="#f7c4d3"/></g><g fill="#f7c4d3" stroke="none"><circle cx="-6" cy="-2" r="6.6"/><circle cx="6" cy="-3" r="6.6"/><circle cx="0" cy="-10" r="6.6"/><circle cx="0" cy="2" r="5.6"/></g><circle cx="-3" cy="-8" r="2.2" fill="#fde4ec" stroke="none"/>`;
 return `<g transform="scale(${z})">${g}</g>`};
const yatai=k=>{const Y=YT[k];let s=sh(44);
 s+=`<g transform="translate(0,-30)">`+kid({view:'front',pose:'stand',arm:0,hat:-1,top:'long',shirt:pk(['#fbf6ea','#f0c040','#8fc4a0']),extra:band})+`</g>`;
 s+=`<rect x="-36" y="-30" width="72" height="30" fill="#c99a5b"/><rect x="-36" y="-30" width="72" height="5" fill="#a8703f" stroke-width="1.2"/>`;
 s+=`<path d="M-34,-82 V-30 M34,-82 V-30" stroke-width="3" fill="none"/><path d="M-42,-82 H42 L36,-64 H-36Z" fill="${Y.c}"/>`+[-24,-8,8,24].map(x=>`<path d="M${x},-82 L${x*.9},-64" stroke="#fbf6ea" stroke-width="3" fill="none"/>`).join('');
 s+=`<g transform="translate(0,-96)">${ytIcon(k,1.5)}</g>`; /* 招牌不用文字：屋頂上放大的商品模型（使用者在 A～D 選 A） */
 if(k==='tako')s+=`<rect x="-24" y="-38" width="30" height="9" rx="2" fill="#3a2e2a" stroke-width="1.2"/>`+[-19,-13,-7,-1].map(x=>`<circle cx="${x}" cy="-37" r="2.6" fill="#d8a050" stroke-width=".9"/>`).join('')+`<circle cx="18" cy="-34" r="4" fill="#fbf6ea" stroke-width="1"/>`;
 if(k==='ringo')s+=[-20,-10,0,10,20].map((x,i)=>`<path d="M${x},-34 v-10" stroke="#c99a5b" stroke-width="1.6" fill="none"/><circle cx="${x}" cy="-${i%2?36:37}" r="4.4" fill="#d8262a" stroke-width="1.1"/><circle cx="${x-1.4}" cy="-38" r="1.1" fill="#fff" stroke="none"/>`).join('');
 if(k==='kingyo')s+=`<ellipse cx="0" cy="-2" rx="34" ry="10" fill="#5aa8d0"/><ellipse cx="0" cy="-3" rx="29" ry="7" fill="#8ccbe0" stroke="none"/>`+[[-16,-3],[-4,-5],[8,-2],[18,-4]].map(([x,y])=>`<path d="M${x},${y} q4,-2 6,0 q-2,2 -6,0Z M${x},${y} l-3,-2 v4Z" fill="#e8683a" stroke-width=".8"/>`).join('');
 if(k==='wata')s+=[-18,-6,6,18].map((x,i)=>`<path d="M${x},-30 v-6" stroke="#c99a5b" stroke-width="1.4" fill="none"/><circle cx="${x}" cy="-41" r="6" fill="${i%2?'#fbf6ea':'#f7c4d3'}" stroke-width="1.1"/>`).join('');
 s+=[-38,38].map(x=>`<path d="M${x},-64 v4" stroke-width="1" fill="none"/><ellipse cx="${x}" cy="-54" rx="4.5" ry="6" fill="#d8413a" stroke-width="1.2"/>`).join('');
 return s};
const queue=()=>act(-10,0,1,{view:'back',pose:'stand'},'lean')+act(10,2,1,{view:pk(['back','bq']),pose:pk(['stand','reach'])},'lean');
/* 7. 燈籠串：參道兩邊立柱，紅白燈籠一串橫過參道 */
const LW=PW+44;
const lanternRun=()=>{let s=[-LW/2,LW/2].map(x=>`<path d="M${x},0 V-92" stroke="#7a5235" stroke-width="3.4" fill="none"/>`).join('');
 s+=`<path d="M${-LW/2},-88 Q0,-62 ${LW/2},-88" stroke-width="1.2" fill="none"/>`;
 for(let i=1;i<10;i++){const t=i/10,x=-LW/2+LW*t,y=-88+26*4*t*(1-t);s+=`<path d="M${f(x)},${f(y)} v3" stroke-width="1" fill="none"/><ellipse cx="${f(x)}" cy="${f(y+9)}" rx="5" ry="6.5" fill="${i%2?'#d8413a':'#fbf6ea'}" stroke-width="1.2"/>`}
 return s};
/* 8. 池邊小活動：餵錦鯉、放紙船、紅橋上拍照 */
const koiFeed=()=>{let s=`<g transform="translate(0,-62)">`+[[-10,-4,'#e8683a'],[6,-8,'#fbf6ea'],[14,2,'#f0a040'],[-2,6,'#e8683a']].map(([x,y,c])=>`<g transform="translate(${x},${y}) rotate(${pk([-50,40,120,200])})"><ellipse rx="8" ry="3.2" fill="${c}" stroke-width="1"/><path d="M7,0 l5,-3 v6Z" fill="${c}" stroke-width=".9"/></g>`).join('')+
 `<g fill="#c99a5b" stroke="none"><circle cx="0" cy="-2" r="1.3"/><circle cx="4" cy="1" r="1.2"/><circle cx="-3" cy="2" r="1.2"/></g></g>`;
 return s+act(-6,0,1,{view:'back',pose:'crouch'},'bend')+act(14,2,1,{view:'bq',pose:'up'},'bend')};
const paperBoat=()=>[[-16,-72],[12,-88]].map(([x,y],i)=>`<g transform="translate(${x},${y})"><path d="M-9,0 H9 L6,4 H-6Z" fill="${i?'#fbf6ea':'#f7c4d3'}" stroke-width="1.2"/><path d="M-5,0 L0,-8 L5,0" fill="${i?'#fbf6ea':'#f7c4d3'}" stroke-width="1.2"/><animateTransform attributeName="transform" type="translate" values="${x},${y};${x+4},${y-2};${x},${y}" dur="${3+i}s" repeatCount="indefinite"/></g>`).join('')+
 act(-8,0,1,{view:'back',pose:'crouch',s:.85},'bend')+act(12,0,1,{view:'bq',pose:'reach',s:.85},'bend');
const camera=`<g transform="translate(14,-20)"><rect x="-5" y="-4" width="10" height="7" rx="1.5" fill="#4a4f5c" stroke-width="1.1"/><circle cx="0" cy="-.5" r="2" fill="#9fd0e8" stroke-width=".9"/></g>`;
const bridgePhoto=()=>`<g transform="translate(0,-16)">`+act(-22,0,1,{view:'side',pose:'hold',extra:camera})+act(16,0,-1,{view:'fq',pose:'up2'},'cheer')+act(30,0,-1,{view:'fq',pose:'stand'},'hop')+`</g>`;
/* 賞櫻的熱鬧小場面（2026-11-11 使用者：左上、右上人太少，要喝酒跳舞、學生告白） */
const tieHead=`<path d="M-11,-44 Q0,-50 11,-44" stroke="#3b5a8a" stroke-width="2.6" fill="none"/><path d="M9,-45 L15,-36 L12,-35 L7,-43Z" fill="#3b5a8a" stroke-width="1"/>`;
const sake=`<g transform="translate(4,-4)"><path d="M-3,0 Q-5,-8 -2,-12 V-16 H2 V-12 Q5,-8 3,0Z" fill="#fbf6ea" stroke-width="1.2"/><rect x="-3" y="-9" width="6" height="4" fill="#3b5a8a" stroke="none"/></g>`;
const cup=`<path d="M12,-22 l6,0 l-1,4 h-4Z" fill="#fbf6ea" stroke-width="1"/>`;
const party=()=>{let s=sh(46,.14)+`<path d="M-44,-12 L40,-14 L46,4 L-40,6Z" fill="#7fb0d8"/><path d="M-26,-13 L-22,5 M-4,-13.5 L-1,5 M18,-14 L22,4.5" stroke="#fff" stroke-width="1.4" opacity=".6" fill="none"/>`+sake+
 `<rect x="-14" y="-10" width="12" height="7" rx="1.5" fill="#c8362f" stroke-width="1.1"/>`;
 s+=act(-28,-2,1,{view:'side',pose:'hold',legs:'sit',extra:cup},'nod')+act(26,-4,-1,{view:'fq',pose:'up',legs:'sit',extra:cup},'cheer');
 s+=act(0,-22,1,{view:'front',pose:'stand',arm:2,top:'long',bottom:'pants',shirt:'#fbf6ea',pants:'#4a4f5c',hat:-1,extra:tieHead},'dance'); /* 頭綁領帶跳舞的大叔 */
 s+=wrapAn('lean',bubble(-30,-62,'note'),true);return s};
const uniform=g=>({hat:-1,top:'long',bottom:'pants',shirt:g?'#fbf6ea':'#2f3a5a',pants:g?'#2f3a5a':'#2b2420',plain:true}); /* 學生制服：女生白上衣＋紅領結、男生深藍立領 */
const ribbon=`<path d="M-4,-17 L0,-15 L4,-17 L4,-13 L0,-15 L-4,-13Z" fill="#d8413a" stroke-width=".9"/>`;
const confess=()=>{const heart=`<path d="M0,4 C-8,-2 -5,-9 0,-5 C5,-9 8,-2 0,4Z" fill="#e86a8a" stroke-width="1.2"/>`;
 return sh(30,.12)+S.petals(10,[-30,-60,60,50],'#f7c4d3')+
 act(-14,0,1,{view:'side',pose:'reach',...uniform(0),hs:2,mood:0,extra:`<g transform="translate(16,-17)"><rect x="-6" y="-4" width="12" height="8" rx="1" fill="#fbf6ea" stroke-width="1.1"/><g transform="scale(.45)">${heart}</g></g>`},'bend')+
 act(16,0,-1,{view:'fq',pose:'stand',...uniform(1),hs:pk([3,4]),mood:2,extra:ribbon},'lean')+
 wrapAn('float',`<g transform="translate(2,-66)">${heart}</g><g transform="translate(12,-78) scale(.6)">${heart}</g>`,true)};
const viewer=()=>act(0,0,r()<.5?1:-1,{view:pk(['fq','side','bq']),pose:pk(['up','stand','hold']),extra:r()<.4?`<g transform="translate(14,-20)"><rect x="-4" y="-6" width="8" height="12" rx="1.5" fill="#4a4f5c" stroke-width="1"/></g>`:''},pk(['lean','nod']));
Object.assign(KIND,{skParty:{w:96,h:60,fn:party},skConfess:{w:60,h:52,fn:confess},skViewer:{w:30,h:56,fn:viewer},
 skTaiko:{w:190,h:70,fn:taikoStage},skAudience:{w:48,h:56,fn:audience},skTea:{w:150,h:60,fn:teaParty},
 skYatai:{w:84,h:52,fn:()=>yatai(pk(Object.keys(YT)))},skQueue:{w:40,h:56,fn:queue},skLanternRun:{w:LW,h:12,fn:lanternRun},
 skKoiFeed:{w:48,h:56,fn:koiFeed},skPaperBoat:{w:44,h:50,fn:paperBoat},skBridgePhoto:{w:80,h:20,fn:bridgePhoto}});
/* 各區要撒的佈景（干擾物少而精） */
const SAK=[['skSakura',3],['skSakuraHalf',2],['skSakuraFall',1],['skPetalDrift',.7],['skPetalPile',.9],['bush',.7],['round',.3],['grassClump',1.2]];
Object.assign(POOL,{
 sk6Stn:[['skBench',.5],['crate',.6],['barrel',.5],['skPetalPile',.6],['skCup',.3],['skUmbrella',.3],['skBento1',.25],['skPumpkin',.2]],
 sk6StnL:[['skSakura',2],['skSakuraHalf',1.4],['bush',1],['grassClump',1.4],['skPetalPile',.6]],
 sk6StnR:[['skSakura',2],['skSakuraHalf',1.4],['bush',1],['grassClump',1.4],['skPetalPile',.6]],
 sk6Path:[['skPetalPile',1.2],['skBallStr',.3],['skPumpkin',.3],['skUmbrella',.25],['skPlane',.2]],
 sk6Lawn:[...SAK.slice(0,3),['skPetalPile',1],['grassClump',1.4],['skMat',.4],['skBento1',.3],['skBallStr',.3],['skBun',.3],['skPlane',.3],['skYarn',.2]],
 sk6West:[...SAK,['skLantern',.8],['skLanternDim',.5],['skBench',.4],['skClip',.3],['skDogMask',.3],['skUmbrella',.2],['skYarn',.25],['skCup',.25]],
 sk6UpW:[...SAK,['skLanternDim',.5],['skDogMask',.3],['skPumpkin',.3],['skClip',.3],['skBun',.25],['skPlane',.2]],
 sk6UpE:[...SAK,['skLantern',.4],['skPumpkin',.3],['skBun',.3],['skCup',.25],['skYarn',.25],['skBallStr',.25]],
 sk6All:[['skSakura',1.2],['skSakuraHalf',.9],['skPetalPile',.6],['bush',.5],['grassClump',1.4]]});
Object.assign(VPLAN,{sk6Stn:{chat:3,carryBox:2,dogWalk:1,walker:2},sk6Path:{walker:3,handInHand:2,chat:2},sk6Lawn:{skHanami:4,skParty:1,skViewer:2,painting:1,reading:1,kiteFly:2,sleeping:1,chat:2,flowerWatch:2},
 sk6West:{skHanami:2,benchPair:2,chat:2,walker:2,flowerWatch:2},sk6UpW:{skHanami:3,skParty:1,skConfess:1,skViewer:4,walker:2,chat:3,flowerWatch:2,handInHand:1},sk6UpE:{skHanami:3,skParty:1,skViewer:4,walker:2,handInHand:2,chat:3,flowerWatch:2,kiteFly:1},sk6All:{chat:2,walker:2}});

/* 櫻花樹位置（點櫻花樹的彩蛋用） */
const TREES=[],FEST={};
function structures(){
 skyBirds(N);
 /* 車站：茶屋站房、站牌、小火車（停在月台前的鐵軌上） */
 add(900,2205,128,112,'skStation',stationSvg(),{s:1.45});
 add(1560,2220,46,66,'skStationSign',stationSign(),{s:1.1});
 add(1230,2374,200,70,'skTrain',train('#4f7fb0'),{s:1.2,mark:false});
 add(700,2215,52,24,'skBench',bench(),{s:1.2});add(1760,2215,52,24,'skBench',bench(),{s:1.2});
 /* 參道：4 座掛燈籠鳥居，越往北越密；兩側石燈籠列 */
 [1680,1330,1030,790].forEach(y=>add(PX,y,108,96,'skToriiLamp',S.torii({lamps:true}),{s:1.5}));
 for(let y=1880,k=0;y>470;k++){const gap=150-(1880-y)/1410*70;
  add(PX-PW/2-34,y,36,64,k%3===2?'skLanternDim':'skLantern',S.stoneLantern({moss:k%3===2,glow:k%3!==2}),{s:1.1});
  add(PX+PW/2+34,y-18,36,64,k%4===3?'skLanternDim':'skLantern',S.stoneLantern({moss:k%4===3,glow:k%4!==3}),{s:1.1});y-=gap}
 /* 北邊石階（接第 7 關） */
 [420,360,300].forEach(y=>add(PX,y,100,66,'skStairs',S.stairs(6),{s:1.7}));
 add(PX,250,108,96,'skToriiLamp',S.torii({lamps:true}),{s:1.5,mark:false});
 /* 水池上的紅橋、大櫻花樹（樹下坐著賞櫻的人） */
 for(const p of PONDS)if(p.bridge)add(p.cx,p.cy+p.ry*.25,p.rx*1.1,40,'skBridge',redBridge(p.rx*1.1),{mark:false});
 for(const [x,y] of LAY.big){add(x,y,120,120,'skSakuraBig',bigSakura(),{fl:r()<.5});TREES.push([x,y,1])}
 for(const [x,y] of LAY.big.slice(0,3)){const hx=x+pk([-70,70]),hy=y+46;if(canPlace(hx,hy,84,56,false,.75)&&!inPond(hx,hy,40))add(hx,hy,84,56,'skHanami',hanami(),{fl:r()<.5})}
 /* 祭典：燈籠串橫過參道（避開鳥居）、太鼓台＋觀眾、野點茶會、屋台街＋排隊的人、池邊小活動 */
 [1860,1530,1180,910,640].forEach(y=>add(PX,y,LW,12,'skLanternRun',lanternRun(),{mark:false}));
 const TK6={x:1730,y:1705};add(TK6.x,TK6.y,190,70,'skTaiko',taikoStage(),{s:1.15});FEST.taiko=TK6;
 [[1650,1785],[1730,1800],[1810,1785],[1690,1835],[1780,1840]].forEach(([x,y])=>add(x,y,48,56,'skAudience',audience(),{}));
 const TE6={x:840,y:1600};add(TE6.x,TE6.y,150,60,'skTea',teaParty(),{s:1.15});FEST.tea=TE6;
 FEST.yatai=[];[[1012,1995,'ringo'],[1104,1995,'tako'],[1400,1995,'kingyo'],[1500,1995,'wata'],[1600,1995,'tako']].forEach(([x,y,k])=>{add(x,y,84,52,'skYatai',yatai(k),{s:1.15});FEST.yatai.push({x,y,k});add(x+pk([-14,14]),y+62,40,56,'skQueue',queue(),{})});
 add(1630,1488,48,56,'skKoiFeed',koiFeed(),{});add(1770,1486,48,56,'skKoiFeed',koiFeed(),{fl:1});
 add(940,1392,44,50,'skPaperBoat',paperBoat(),{});add(730,1396,44,50,'skPaperBoat',paperBoat(),{fl:1});
 for(const p of PONDS)if(p.bridge)add(p.cx,p.cy+p.ry*.25+2,80,20,'skBridgePhoto',bridgePhoto(),{mark:false});
 /* 東側賞花草坪：野餐墊、賣糰子的攤位 */
 [[1560,1100],[1760,1180],[1620,1340],[1830,1420],[1530,1560],[1850,1010]].filter(([x,y])=>!inPond(x,y,60)).forEach(([x,y])=>add(x,y,52,22,'skMat',mat(),{s:1.25,fl:r()<.5}));
 add(1480,1740,78,76,'skDangoStall',dangoStall(),{s:1.3});
 /* 西側：長椅與櫻花林 */
 [[1010,1690]].filter(([x,y])=>!inPond(x,y,50)).forEach(([x,y])=>add(x,y,52,24,'skBench',bench(),{s:1.2}));
 /* 沿路兩側的櫻花樹（盛開、半開、落花輪流） */
 const side=(x0,x1)=>{for(let y=1800;y>380;y-=sr(95,140)){const x=sr(x0,x1),k=pk(['skSakura','skSakura','skSakuraHalf','skSakuraFall']);const K=KIND[k];
   if(canPlace(x,y,K.w,K.h,false,.6)){add(x,y,K.w,K.h,k,K.fn(),{fl:r()<.5,s:1.15});TREES.push([x,y])}}};
 side(790,1060);side(1440,1700);
}
function scatterAll(){
 scatter('sk6West',POOL.sk6West,3200,70);scatter('sk6Lawn',POOL.sk6Lawn,3000,60);scatter('sk6UpW',POOL.sk6UpW,3200,80);scatter('sk6UpE',POOL.sk6UpE,3000,70);
 scatter('sk6Path',POOL.sk6Path,1200,24);scatter('sk6Stn',POOL.sk6Stn,2400,40);scatter('sk6StnL',POOL.sk6StnL,1600,16);scatter('sk6StnR',POOL.sk6StnR,1600,16);scatter('sk6All',POOL.sk6All,6000,90);
}
/* 位置檢查：all 區補的樹不要長到車站廣場、參道和賞花草坪上；參道上不撒雜物 */
H.SCATOK.sk6All=(x,y)=>y<1830&&Math.abs(x-PX)>PW/2+70&&!(x>1420&&x<1960&&y>930&&y<1790);
H.SCATOK.sk6Path=(x,y)=>Math.abs(x-PX)<PW/2-24;
SCENE_IMPL[N]={ground,structures,scatter:scatterAll};

/* ================= 7. 連環小故事「追風箏的小柴犬」 ================= */
const shibaBundle=()=>{const c='#d9884a',w='#fbf6ea';let s=`<ellipse cx="2" cy="1" rx="18" ry="3.4" fill="#000" opacity=".15" stroke="none"/>`;
 for(const x of [-9,-4,6,11])s+=`<rect x="${x-2}" y="-8" width="4" height="9" rx="1.6" fill="${c}"/>`;
 s+=`<path d="M-11,-14 Q-21,-22 -13,-27 Q-7,-27 -7,-20" fill="none" stroke="${OL}" stroke-width="6.4" stroke-linecap="round"/><path d="M-11,-14 Q-21,-22 -13,-27 Q-7,-27 -7,-20" fill="none" stroke="${c}" stroke-width="3.6" stroke-linecap="round"/>`;
 s+=`<ellipse cx="0" cy="-13" rx="13.5" ry="6.6" fill="${c}"/><ellipse cx="9" cy="-10" rx="4.5" ry="4.5" fill="${w}" stroke="none"/>`;
 s+=`<path d="M9,-24 L9.5,-33 L14.5,-26Z" fill="${c}"/><path d="M15,-26 L19.5,-33 L19.5,-23Z" fill="${c}"/><circle cx="14" cy="-20" r="7" fill="${c}"/><path d="M12,-17 Q14,-14.5 18,-14 Q22,-14 22.6,-17.5 Q20,-20.5 17,-19 Q14,-19.5 12,-17Z" fill="${w}" stroke-width="1.2"/><circle cx="16.3" cy="-21.5" r="1.3" fill="${OL}" stroke="none"/><circle cx="22.4" cy="-17.8" r="1.5" fill="${OL}" stroke="none"/>`;
 /* 背上的綠色包袱：圓鼓鼓、打結 */
 s+=`<path d="M-9,-17 Q-12,-28 -1,-29 Q10,-28 8,-17 Q0,-13 -9,-17Z" fill="#4f9a5a"/><path d="M-6,-24 Q-1,-21 4,-24" fill="none" stroke="#7fc08a" stroke-width="1.4"/><path d="M-4,-29 q-3,-5 1,-6 q3,0 1,6 M-1,-29 q4,-4 6,-1 q-1,3 -6,1" fill="#4f9a5a" stroke-width="1.3"/>`;
 return s};
const kiteBoy=()=>act(0,0,1,{view:'side',pose:'hold',hat:-1,shirt:'#5a86b0',pants:'#4a5a78',extra:`<path d="M10,-22 Q16,-34 22,-40" fill="none" stroke-width=".9"/><g transform="translate(24,-48)"><path d="M0,-12 L9,0 L0,12 L-9,0Z" fill="#d8413a"/><path d="M0,-12 V12 M-9,0 H9" fill="none" stroke-width="1"/><path d="M0,12 q4,5 0,9 q-4,4 0,8" fill="none" stroke="#f5c842" stroke-width="1.6"/></g>`});
STORIES[N]={title:'追風箏的小柴犬',who:'賞花阿嬤',
 giver:()=>act(0,0,1,{view:'fq',pose:'reach',hat:-1,hair:'#e8e4dc',hs:3,shirt:'#d98aa8',pants:'#6a5a7a',mood:2}),
 target:()=>`<g transform="scale(1.35)">${shibaBundle()}</g>`,tw:50,th:48,
 helper:()=>kiteBoy(),hw:46,hh:70,
 ask:'賞花阿嬤：我叫背著綠色包袱的小柴犬回家拿便當，怎麼還沒回來？',
 need:'小柴犬看到風箏就追著跑，玩到忘了正事⋯拿著紅風箏的小男孩也許有辦法。',
 got:'小男孩：我把風箏往回家的方向拉，牠就會跟過來！',
 ok:'小柴犬追著風箏開心跑回來了！快帶回阿嬤身邊！'};

/* ================= 8. 場景彩蛋：點櫻花樹，花瓣飄成一陣櫻吹雪（不算點錯） ================= */
let blowing=0;
const near=(o,x,y,w,h)=>o&&Math.abs(x-o.x)<w&&y<o.y+10&&y>o.y-h;let festT=0;
const festTap=(x,y)=>{const t=performance.now();
 if(near(FEST.taiko,x,y,110,150)){if(t-festT>500){festT=t;try{tone(90,.18,'sine',.12);setTimeout(()=>tone(90,.12,'sine',.1),180);setTimeout(()=>tone(120,.2,'sine',.12),330)}catch(_){}H.toast('咚！咚咚！櫻花祭的太鼓表演正熱鬧！',2200)}return true}
 if(near(FEST.tea,x,y,90,150)){if(t-festT>800){festT=t;H.toast('茶師：歡迎來到櫻花樹下的茶會，請用一碗抹茶。',3000)}return true}
 const Y=(FEST.yatai||[]).find(o=>near(o,x,y,48,100));if(Y){if(t-festT>800){festT=t;H.toast({tako:'章魚燒老闆：剛烤好的章魚燒，小心燙喔！',ringo:'蘋果糖老闆：亮晶晶的蘋果糖，一支一支慢慢挑～',kingyo:'撈金魚的老闆：紙網破了也沒關係，再試一次！',wata:'棉花糖老闆：粉紅色的櫻花棉花糖，像一朵雲！'}[Y.k],3000)}return true}
 return false};
TAPHOOKS[N]=(x,y)=>{if(festTap(x,y))return true;
 const t=H.sprites.find(s=>/^skSakura/.test(s.kind)&&Math.abs(x-s.x)<(s.kind==='skSakuraBig'?70:40)&&y<s.y+8&&y>s.y-(s.kind==='skSakuraBig'?175:100));if(!t)return false;
 const fx=document.getElementById('fx');if(!fx||blowing>3)return true;blowing++;
 try{tone(660,.1,'sine',.04);setTimeout(()=>tone(880,.12,'sine',.03),110)}catch(_){}
 const NS='http://www.w3.org/2000/svg',g=document.createElementNS(NS,'g');fx.appendChild(g);
 const ps=[];for(let i=0;i<26;i++){const e=document.createElementNS(NS,'ellipse');e.setAttribute('rx','4');e.setAttribute('ry','2.3');e.setAttribute('fill',pk(['#f7c4d3','#f9cdd9','#fde4ec','#eea6bb']));g.appendChild(e);
  ps.push({e,x:t.x+sr(-26,26),y:t.y-sr(40,88),vx:sr(-.5,1.6),vy:sr(.3,1),ph:sr(0,6),rot:sr(0,180),w:sr(.6,1.6)})}
 const t0=performance.now(),D=2600;
 const step=now=>{const k=(now-t0)/D;if(k>=1){g.remove();blowing--;return}
  const tt=(now-t0)/16;ps.forEach(p=>{const X=p.x+p.vx*tt*.9+Math.sin(tt*.06*p.w+p.ph)*10,Y=p.y+p.vy*tt*.7;
   p.e.setAttribute('transform',`translate(${X.toFixed(1)},${Y.toFixed(1)}) rotate(${(p.rot+tt*3*p.w).toFixed(0)})`);p.e.setAttribute('opacity',(1-Math.max(0,(k-.6)/.4)).toFixed(2))});
  requestAnimationFrame(step)};
 requestAnimationFrame(step);return true};

/* ================= 9. 過場：渡輪回小鎮港口 → 換小火車 → 沿海岸往西 → 轉進山裡（櫻花一路變多）→ 山腳小車站 ================= */
RIDES.train=(()=>{
 const strip=()=>{ /* 一整條 1200 寬的風景（右：海與小鎮港口 → 中：海岸與草原 → 左：山腳，櫻花最多）；火車固定在畫面中央，風景往右滑 */
  let w=`<defs><linearGradient id="skTrSky" x1="0" x2="1"><stop offset="0" stop-color="#e9eef6"/><stop offset=".55" stop-color="#eee4ee"/><stop offset="1" stop-color="#e6eef4"/></linearGradient>
   <linearGradient id="skTrGnd" x1="0" x2="1"><stop offset="0" stop-color="#b6d98f"/><stop offset=".45" stop-color="#bddb98"/><stop offset=".62" stop-color="#e8d9a4"/><stop offset="1" stop-color="#7cc0cc"/></linearGradient></defs>`;
  w+=`<rect x="-10" y="0" width="1220" height="800" fill="url(#skTrSky)" stroke="none"/>`;
  /* 遠山：左邊櫻花山，右邊淡淡的小鎮屋頂 */
  w+=`<path d="M-10,340 L60,230 L130,300 L210,200 L290,300 L360,250 L430,340Z" fill="#c9cfc0"/><path d="M-10,340 Q80,280 170,320 Q250,270 340,330 Q400,300 440,340Z" fill="#b9d49a"/>`;
  w+=[[40,300,1.1],[120,318,1],[210,296,1.2],[290,318,1],[360,306,.9]].map(([x,y,k])=>T(x,y,k*.7,S.sakuraTree(pk(['full','half'])))).join('');
  w+=`<g opacity=".9">`+[[760,336],[830,330],[900,338]].map(([x,y])=>T(x,y,.6,S.tileRoof(110,20))).join('')+`</g>`;
  /* 地面 */
  w+=`<rect x="-10" y="340" width="1220" height="460" fill="url(#skTrGnd)" stroke="none"/><path d="M-10,340 H1210" fill="none"/>`;
  /* 右邊：海與渡輪 */
  w+=`<rect x="900" y="340" width="310" height="110" fill="#7cc0cc" stroke="none"/><path d="M900,340 H1210" fill="none"/>`;
  w+=[[930,380],[1020,400],[1110,374],[1160,420]].map(([x,y])=>`<path d="M${x},${y} q8,-5 16,0 q8,5 16,0" fill="none" stroke="#d8f0f2" stroke-width="2"/>`).join('');
  w+=T(1090,420,.5,H.ferry(true));
  /* 櫻花由右（少）往左（多） */
  const xs=[];for(let i=0;i<30;i++){const x=sr(10,880),p=1-x/880;if(r()<.15+.85*p*p)xs.push(x)}
  xs.sort((a,b)=>a-b).forEach(x=>{const y=sr(420,470);w+=T(x,y,sr(.5,.8),S.sakuraTree(r()<.5?'full':pk(['half','full'])))});
  /* 鳥居與山腳站房出現在最左邊 */
  w+=T(70,450,.5,S.torii({lamps:true}))+T(270,452,.5,S.torii({lamps:true}));
  /* 鐵軌（整條） */
  w+=`<rect x="-10" y="500" width="1220" height="200" fill="#cdbf9a" stroke="none"/>`;
  for(let x=0;x<1210;x+=26)w+=`<rect x="${x}" y="514" width="12" height="38" fill="#8a6a4a" stroke="none"/>`;
  w+=`<path d="M-10,526 H1210 M-10,546 H1210" stroke="#6f6a60" stroke-width="4" fill="none"/>`;
  /* 近景：路邊的花瓣 */
  let pt='';for(let i=0;i<46;i++)pt+=`<ellipse cx="${f(sr(-5,1200))}" cy="${f(sr(380,590))}" rx="3.2" ry="1.8" fill="${pk(['#f7c4d3','#fde4ec','#eea6bb'])}" stroke="none" opacity="${f(sr(.5,.9))}"/>`;
  return `<g transform="translate(0,-85)">${w+pt}</g>`};

 /* 第一段（2026-11-11 主帳號加，使用者說直接搭火車很怪）：渡輪從海島往西開回小鎮港口 */
 const sea=()=>{let w=`<rect x="0" y="0" width="400" height="600" fill="#e6eef4" stroke="none"/>`;
  /* 遠方的小鎮：城堡、屋頂、碼頭（左邊） */
  w+=`<g transform="translate(96,300)"><path d="M-110,0 Q-20,-30 40,-14 Q90,-26 130,0Z" fill="#b9d49a"/>`+
   `<path d="M-6,-14 V-46 H26 V-14Z" fill="#ece2cb"/><path d="M-10,-46 L10,-66 L30,-46Z" fill="#5c6f96"/><path d="M-24,-14 V-34 H-8 V-14Z" fill="#ece2cb"/><path d="M-28,-34 L-16,-48 L-4,-34Z" fill="#b14d27"/>`+
   `<path d="M34,-12 V-26 H52 V-12Z" fill="#f3e8cf"/><path d="M30,-26 L43,-36 L56,-26Z" fill="#c98a3a"/><path d="M60,-10 V-22 H76 V-10Z" fill="#f3e8cf"/><path d="M56,-22 L68,-31 L80,-22Z" fill="#b14d27"/>`+
   `<rect x="80" y="-6" width="60" height="7" fill="#a8703f"/></g>`;
  /* 右邊漸漸遠去的海島 */
  w+=`<g transform="translate(360,296)"><path d="M-36,0 Q0,-18 40,0Z" fill="#ecd9a8"/><path d="M14,-4 L16,-28 H20 L22,-4Z" fill="#fbf9f3"/><path d="M13,-28 L18,-35 L23,-28Z" fill="#d8413a"/></g>`;
  w+=`<rect x="0" y="300" width="400" height="300" fill="#7cc0cc" stroke="none"/><path d="M0,300 H400" fill="none"/>`;
  w+=[[30,350],[150,380],[270,345],[80,450],[220,470],[330,420],[120,540],[300,560]].map(([x,y])=>`<path d="M${x},${y} q8,-5 16,0 q8,5 16,0" fill="none" stroke="#d8f0f2" stroke-width="2"/>`).join('');
  return w};
 const ferryG=()=>`<g class="skFerry">${sea()}<g class="skFerryBoat"><g transform="translate(250,410) scale(.9)">${H.ferry(true)}</g></g></g>`;
 return {text:'搭渡輪回小鎮港口，換小火車往西進櫻花山⋯',every:380,tick:k=>tone(k%2?210:170,.06,'triangle',.05),
  svg:()=>`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><style>@keyframes skTrPan{from{transform:translateX(-800px)}to{transform:translateX(0)}}.skTrain{animation:skTrBob .26s ease-in-out infinite alternate}@keyframes skTrBob{to{transform:translateY(-2px)}}</style>`+
   `<style>.skTrSeg{opacity:0;animation:skTrIn .4s 1.9s forwards}@keyframes skTrIn{to{opacity:1}}.skFerry{animation:skFeOut .4s 1.9s forwards}@keyframes skFeOut{to{opacity:0}}.skFerryBoat{animation:skFeGo 2.3s cubic-bezier(.3,0,.6,1) forwards}@keyframes skFeGo{from{transform:translateX(60px)}to{transform:translateX(-70px)}}</style>`+
   `<g class="skTrSeg"><g style="animation:skTrPan 2.4s 1.9s cubic-bezier(.35,0,.65,1) forwards;transform:translateX(-800px)">${strip()}</g>`+
   `<g class="skTrain"><g transform="translate(200,462) scale(-.9,.9)">${train('#4f7fb0')}</g></g></g>`+ferryG()+`</g></svg>`}})();

/* ================= 10. 冒險地圖：櫻花山、小火車線、第 6 關節點（座標用加寬後的地圖，西邊是負的 x） =================
   地圖向西加寬 120（viewBox -120 0 462 430）要主帳號改 core.js：見 notes-sakura.md「需要引擎新增」。這裡只畫自己的東西。 */
HERE[N]=[-78,262];
MAPHOOKS.push(({U,P,ink,FN})=>{if(U<N)return '';
 const route='M98,297 Q36,296 -22,291 Q-56,288 -78,284';
 let m=H.mapRoute(route,'rail',ink);
 /* 小鎮港口的月台 */
 m+=P('M92,293 h12 v6 h-12Z','#c99a5b',1.1);
 /* 櫻花山（縮小版）：淡粉的圓團樹冠蓋在山上 */
 m+=P('M-108,214 L-84,176 L-66,198 L-44,160 L-18,214Z','#b9c6a0',1.5)+`<path d="M-44,160 L-18,214 L-36,214Z" fill="#9fae86" opacity=".9"/>`;
 m+=[[-96,206],[-78,196],[-60,206],[-44,184],[-28,204],[-70,180],[-52,170]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="7" fill="#f7c4d3" stroke="${ink}" stroke-width="1.1"/><circle cx="${x-2}" cy="${y-2}" r="2.2" fill="#fde4ec" stroke="none"/>`).join('');
 /* 第 6 關節點：小鳥居＋短名牌 */
 m+=`<g class="mnode" data-n="${N}"><circle cx="-78" cy="284" r="26" fill="transparent"/><ellipse cx="-78" cy="288" rx="20" ry="7" fill="#d4e8ad" stroke="${ink}" stroke-width="1.3"/>`+
  P('M-86,286 V272 M-70,286 V272','none',2.4)+`<path d="M-88,274 H-68 M-90,270 Q-78,267 -66,270" fill="none" stroke="#d8413a" stroke-width="2.6" stroke-linecap="round"/>`+
  `<g transform="translate(-34,284)"><rect x="-26" y="-10" width="52" height="19" rx="9.5" fill="#fffaf0" stroke="${ink}" stroke-width="1.6"/><text y="4" text-anchor="middle" font-size="11" fill="${ink}" font-family="${FN}">櫻花參道</text></g></g>`;
 return m});
})();

