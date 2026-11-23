/* 奇幻小鎮大搜查．城堡系列〔圖書館〕（找路發現的新關卡，第 19 關）
   2026-11-21 使用者：宮廷院東北塔樓的小側門 → 圖書館。氣氛：午後陽光魔法圖書館（會飛的書、魔法角落先不放，留給之後更奇幻的圖書館）。
   入口：第 18 關宮廷院，東北塔樓小側門旁的書僮——程式在這個檔案最後面（H.RESERVE[18]／H.EXITS[19]）；宮廷院拿 2 星後才出現（find:{after:18,from:18}）。
   冒險地圖不另外放節點（隸屬奇幻小鎮，只出現在地圖下方的卡片）。
   使用者選：旋轉樓梯 1A 木頭螺旋梯＋頂端平台、二樓迴廊 2B 石拱迴廊、光柱 3D 光柱＋閃閃灰塵＋地上窗格光斑、館貓 4D 黑貓「逗點」。
   場景（上北下南）：北＝兩層樓高的書牆（上面高拱窗、中間石拱迴廊、下面書架）、館長大書桌 → 中＝圓形大廳＋木頭螺旋梯
   → 西＝閱覽長桌區 → 東＝抄寫室（斜面書寫台、裝訂、晾書頁、修書）→ 南＝入口、借還書櫃台、說故事角落。
   景物不要和物件太像：人物不戴眼鏡、佈景沒有地球儀和懷錶、抄寫員拿蘆葦筆（不拿羽毛筆）、書架上沒有貓頭鷹。
   新名字都以 19 結尾。 */
(function(){
const H=window.TH;if(!H)return;
const N=19;
const {T,f,r,sr,pk,OL,kid,act,add,mark,scatter,KIND,POOL,VPLAN,REG,SCREG,LEVELS,ART,DECOY,
 SCENE_IMPL,RIDES,HERE,OUTFITS,STORIES,HOSTK,HOSTN,tone,typeOf,HATS,noteM}=H;
const mk=(x0,y0,x1,y1)=>mark((x0+x1)/2,y1,x1-x0,y1-y0,1);   /* 佔掉一個長方形（左上、右下） */
const sh=(rx,ry=6)=>`<ellipse cx="0" cy="3" rx="${rx}" ry="${ry}" fill="#000" opacity=".15" stroke="none"/>`;
/* 書架上的書用自己的亂數（不動到場景的亂數） */
let SEED=1;const rq=()=>{SEED=(SEED*16807)%2147483647;return SEED/2147483647};
const BC=['#8e2630','#2f4f8a','#3f6a4a','#c99a3a','#6a3f8a','#a8502e','#1f5f6a','#7a3a5a','#4a3a6a','#b8667a','#5a6a3a','#2f2f3a'];
const shelf=(x,y,w,h,rows,wood='#8a5a34',seed)=>{if(seed)SEED=seed;let s=`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${wood}"/>`;const rh=h/rows;
 for(let k=0;k<rows;k++){const y0=y+k*rh+4,y1=y+(k+1)*rh-3;s+=`<rect x="${f(x+4)}" y="${f(y0)}" width="${f(w-8)}" height="${f(y1-y0)}" fill="#4a3022" stroke="none"/>`;
  let bx=x+6,b='';while(bx<x+w-10){const bw=4+rq()*4,bh=(y1-y0)*(.62+rq()*.34);if(rq()<.07){bx+=bw+3;continue}
   if(rq()<.05&&bx<x+w-24){b+=`<path d="M${f(bx)},${f(y1)} L${f(bx+bh*.5)},${f(y1-bh*.86)} L${f(bx+bh*.5+bw)},${f(y1-bh*.86+2)} L${f(bx+bw)},${f(y1)}Z" fill="${BC[Math.floor(rq()*BC.length)]}" stroke-width="1"/>`;bx+=bh*.5+bw+1;continue}
   b+=`<rect x="${f(bx)}" y="${f(y1-bh)}" width="${f(bw)}" height="${f(bh)}" fill="${BC[Math.floor(rq()*BC.length)]}" stroke-width="1"/>`;bx+=bw+.6}
  s+=b+`<rect x="${f(x)}" y="${f(y1)}" width="${f(w)}" height="4" fill="#b07a48"/>`}
 return s+`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="none" stroke-width="2.4"/>`};

/* ================= 1. 場景範圍、場地外（兩側高書牆） ================= */
H.SCENES[N]={x0:600,x1:1900,y1:2150,c:[1250,1880]};
H.TARGET[N]=330;
H.SKYC[N]='#5a3e2c';H.SKYY[N]=0;
H.EDGEM[N]='';H.EDGED[N]='';
H.EDGEDECO[N]=[];
H.FRINGE[N]=[['bookstack19',.6],['plant19',.25],['stool19',.25]];
H.FRINGEX[N]=[[0,0,2600,690]];
H.DENS[N]=1;
const WY=640;   /* 北牆腳（地板從這裡開始） */
if(H.FOGFN)H.FOGFN[N]=({X0,X1,Y1})=>{const C='#3a2a20';
 const gd=(n,x1,x2,y1,y2)=>`<linearGradient id="${n}" x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}"><stop offset="0" stop-color="${C}" stop-opacity="1"/><stop offset=".5" stop-color="${C}" stop-opacity=".84"/><stop offset="1" stop-color="${C}" stop-opacity="0"/></linearGradient>`;
 let g=`<defs>${gd('lL19',0,1,0,0)+gd('lR19',1,0,0,0)+gd('lB19',0,0,1,0)}</defs><path d="M-6000,-4000 H8800 V5800 H-6000Z M${X0-295},-295 V${Y1+295} H${X1+295} V-295Z" fill="${C}" fill-rule="evenodd"/>`;
 g+=`<rect x="${X0-300}" y="-300" width="300" height="${Y1+600}" fill="url(#lL19)"/><rect x="${X1}" y="-300" width="300" height="${Y1+600}" fill="url(#lR19)"/><rect x="${X0-300}" y="${Y1+40}" width="${X1-X0+600}" height="260" fill="url(#lB19)"/>`;
 /* 兩側牆邊的高書架（場地外，暗暗的） */
 g+=`<g stroke="#1a1310" stroke-width="2" stroke-linejoin="round" opacity=".9">`;
 let k=0;for(let y=WY+260;y<Y1+200;y+=300,k++)for(const x of [X0-150,X1+150]){g+=shelf(x-55,y-250,110,250,5,'#6a4228',300+k*7+(x<X0?1:2))}
 return g+`</g>`};

/* ================= 2. 當地人：讀書的貴族、學者長袍、館員深綠背心、抄寫員褐色長袍 ================= */
const HAT_TIARA=HATS.push(H.HATKIT.tiaraV)-1;
const HAT_BERET=HATS.push(v=>H.HATKIT.beretB(pk(['#8e2630','#2f4f8a','#3f6a4a','#6a3f8a','#2f2f3a']))(v) /* 2026-11-23c 使用者選羽毛帽 B */)-1;
/* 學者的軟帽（深色、圓圓扁扁） */
const HAT_SOFT=HATS.push(()=>{const c=pk(['#2f2f3a','#3a2e4a','#4a2a2a']);return `<path d="M-15,-43 Q-16,-56 0,-57 Q16,-56 15,-43 Q0,-47 -15,-43Z" fill="${c}"/><path d="M-15,-43 Q0,-47 15,-43" fill="none" stroke="#c99a3a" stroke-width="1.6"/>`})-1;
const HAT_CAP=HATS.push(()=>`<path d="M-13,-43 Q-12,-53 0,-53 Q12,-53 13,-43 Q7,-46 0,-45.4 Q-7,-46 -13,-43Z" fill="#fbf9f2"/><path d="M-13,-43 q3,2 6,0 q3,2 6,0 q3,2 6,0 q3,2 6,0" fill="none" stroke-width="1.2"/>`)-1;
const RICH=['#8e2630','#2f4f8a','#3f6a4a','#6a3f8a','#c99a3a','#7a3a5a','#1f5f6a','#a8502e','#4a3a6a','#b8667a','#d98a9a','#7aa8c4'];
const gown=c=>`<path d="M-8.4,-8.4 L-12,.6 H12 L8.4,-8.4Z" fill="${c}"/><path d="M-10.6,-2.6 H10.6" fill="none" stroke="#e0b44a" stroke-width="1.6"/>`;
const robe=c=>`<path d="M-8.4,-8.4 L-11,.6 H11 L8.4,-8.4Z" fill="${c}"/>`;   /* 學者、抄寫員的長袍下擺（沒有金邊） */
OUTFITS[N]=o=>{if(o.top)return o;
 o.skin=o.skin||pk(['#f2d2b4','#e8c4a0','#d9a578','#c98d5e','#f0cfae','#8f5a36']);
 o.top='long';o.bottom='pants';o.shirt=o.shirt||pk(RICH);o.pants=o.pants||pk(['#3a2e2a','#4a3f5a','#2f3a4a','#5a3a2a','#6a5a48']);
 if(o.hat==null&&!o.plain){const x=r();o.hat=x<.14?HAT_BERET:x<.24?HAT_TIARA:x<.4?HAT_SOFT:-1;if(o.hat===HAT_TIARA)o.hs=pk([2,4,3])}
 if(o.pose!=='sit'&&!o.extra){const x=r();if(x<.3)o.extra=gown(o.shirt);else if(x<.5)o.extra=robe(o.shirt)}
 return o};
const vest=`<path d="M-6,-17 L-2,-17 L0,-10 L2,-17 L6,-17 L7,-6 H-7Z" fill="#3f6a4a" stroke-width="1.1"/>`;
const libO=(o={})=>Object.assign({top:'long',bottom:'pants',shirt:'#f4ecd6',pants:'#3a3a40',hat:-1,extra:vest},o);   /* 館員：白襯衫＋深綠背心 */
const scribeO=(o={})=>Object.assign({top:'long',bottom:'pants',shirt:'#7a5a3a',pants:'#7a5a3a',hat:-1,extra:robe('#7a5a3a')},o);   /* 抄寫員：褐色長袍 */
const maidO=(o={})=>Object.assign({top:'long',bottom:'pants',shirt:'#3f4a6a',pants:'#3f4a6a',hat:HAT_CAP,extra:`<path d="M-6,-14 Q0,-11 6,-14 L7,-4 Q0,-1 -7,-4Z" fill="#fbf9f2" stroke-width="1.1"/>`},o);

/* ================= 3. 物件與干擾物（原圖最長邊約 34，細長的約 40，畫在 ±20 內） ================= */
/* 老朋友（第 17 關）的圖：沒載入第 17 關時用這裡的後備 */
const ART17={gkey17:`<g transform="rotate(-38)"><circle cx="-14" cy="0" r="8" fill="#4a4f5c"/><circle cx="-14" cy="0" r="4" fill="#fbf6ea"/><rect x="-7" y="-2.6" width="27" height="5.2" rx="1.6" fill="#4a4f5c"/>`+
  `<path d="M13,2.4 V9 H17 V5 H20 V2.4" fill="#4a4f5c"/><path d="M-19,-4 Q-17,-7 -13,-7.6" fill="none" stroke="#8a929c" stroke-width="1.6"/><path d="M-4,-2.6 V2.6" fill="none" stroke="#2b2420" stroke-width="1.2"/></g>`};
const DECOY17={ring17:`<circle cx="0" cy="2" r="11" fill="none" stroke="${OL}" stroke-width="6.4"/><circle cx="0" cy="2" r="11" fill="none" stroke="#5a5e6a" stroke-width="3.6"/><path d="M-3,-9 V-15 H3 V-9" fill="#5a5e6a" stroke-width="1.4"/>`};
for(const k in ART17)if(!ART[k])ART[k]=ART17[k];
for(const k in DECOY17)if(!DECOY[k])DECOY[k]=DECOY17[k];
Object.assign(ART,{
 /* 紫色扣鎖古書（2026-11-21 使用者：骨瓷茶杯組改成特別的書）：厚厚的紫色皮革封面、金色護角、中間金色星星、右邊黃銅扣帶 */
 tome19:`<g transform="rotate(-8)"><path d="M-12,-18 L-17,-15 V19 L-12,17Z" fill="#4a2a5a"/><path d="M12,-17 L15,-15 V19 L12,17Z" fill="#f4ecd6"/><path d="M13,-12 V14 M14.4,-11 V15" fill="none" stroke="#c9b48a" stroke-width=".8"/>`+
  `<rect x="-12" y="-18" width="25" height="35" rx="1.6" fill="#6a3f8a"/><path d="M-12,-18 h7 l-7,7Z M13,-18 h-7 l7,7Z M-12,17 h7 l-7,-7Z M13,17 h-7 l7,-7Z" fill="#e0b44a" stroke-width="1.1"/>`+
  `<path d="M.5,-7 l2.2,4.6 l5,.6 l-3.7,3.4 l1,5 l-4.5,-2.5 l-4.5,2.5 l1,-5 l-3.7,-3.4 l5,-.6Z" fill="#f0c94a" stroke-width="1.1"/>`+
  `<rect x="10" y="-4" width="8" height="8" rx="1.4" fill="#8e5a2a"/><rect x="14" y="-2.6" width="5" height="5.2" rx="1" fill="#e0b44a" stroke-width="1.1"/><path d="M-9,-14 Q-6,-16 -3,-15" fill="none" stroke="#9a78b8" stroke-width="1.4"/></g>`,
 /* 羽毛筆：白色長羽毛斜放、筆尖沾了墨 */
 quill19:`<g transform="rotate(38)"><path d="M0,20 L0,-2" fill="none" stroke="${OL}" stroke-width="2.6"/><path d="M0,20 L0,-2" fill="none" stroke="#e8dcc0" stroke-width="1.2"/>`+
  `<path d="M0,10 Q-8,-2 -7,-14 Q-4,-22 0,-22 Q5,-20 6,-12 Q6,0 0,10Z" fill="#fbfaf4"/><path d="M0,8 V-20" fill="none" stroke="#c9c0ac" stroke-width="1.2"/><path d="M0,0 l-5,-3 M0,-6 l-5,-3 M0,-12 l-4,-3 M0,2 l4,-3 M0,-4 l5,-3 M0,-10 l4,-3" fill="none" stroke="#d6cdb8" stroke-width="1"/>`+
  `<path d="M-1.4,18 L0,22 L1.4,18Z" fill="#2f2f3a" stroke-width="1"/></g>`,
 /* 墨水瓶：矮矮方圓的深藍玻璃瓶、軟木塞、瓶口有一點墨 */
 ink19:`<path d="M-13,14 Q-15,2 -10,-4 H10 Q15,2 13,14 Q0,17 -13,14Z" fill="#2a3a6a"/><path d="M-6,-4 V-10 H6 V-4Z" fill="#2a3a6a"/><rect x="-5" y="-16" width="10" height="7" rx="1.6" fill="#c9965a"/>`+
  `<path d="M-9,2 Q-10,8 -8,11" fill="none" stroke="#6a86c4" stroke-width="2"/><rect x="-7" y="3" width="14" height="7" rx="1" fill="#f4ecd6" stroke-width="1.1"/><path d="M-4,6.5 H4" fill="none" stroke="#2a3a6a" stroke-width="1.2"/><path d="M6,-4 q2,3 0,6" fill="none" stroke="#1a1a2a" stroke-width="1.6"/>`,
 /* 圓框眼鏡：兩個金色圓框、鼻架、兩邊鏡腳 */
 glass19:`<path d="M-17,-3 L-21,-10 M17,-3 L21,-10" fill="none" stroke="${OL}" stroke-width="3.4" stroke-linecap="round"/><path d="M-17,-3 L-21,-10 M17,-3 L21,-10" fill="none" stroke="#c99a3a" stroke-width="1.6" stroke-linecap="round"/>`+
  `<circle cx="-9" cy="2" r="8.4" fill="#dcecf4" stroke="${OL}" stroke-width="4"/><circle cx="9" cy="2" r="8.4" fill="#dcecf4" stroke="${OL}" stroke-width="4"/><circle cx="-9" cy="2" r="8.4" fill="none" stroke="#e0b44a" stroke-width="2"/><circle cx="9" cy="2" r="8.4" fill="none" stroke="#e0b44a" stroke-width="2"/>`+
  `<path d="M-2,0 Q0,-3 2,0" fill="none" stroke="#e0b44a" stroke-width="2"/><path d="M-13,-1 l3,-3 M5,-1 l3,-3" fill="none" stroke="#fff" stroke-width="1.6"/>`,
 /* 放大鏡：金色圓框、木頭手把斜放 */
 lens19:`<g transform="rotate(-35)"><path d="M0,9 V24" fill="none" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><path d="M0,9 V24" fill="none" stroke="#8a5a34" stroke-width="5" stroke-linecap="round"/><rect x="-3" y="8" width="6" height="4" fill="#e0b44a" stroke-width="1.1"/>`+
  `<circle cx="0" cy="-6" r="13" fill="#d8eef6"/><circle cx="0" cy="-6" r="13" fill="none" stroke="#e0b44a" stroke-width="3"/><path d="M-7,-11 Q-4,-15 1,-15" fill="none" stroke="#fff" stroke-width="2.2"/></g>`,
 /* 桌上地球儀：藍色球、綠色陸地（原創形狀）、黃銅半圓架、木頭底座 */
 globe19:`<path d="M-9,18 H9 L6,13 H-6Z" fill="#8a5a34"/><path d="M0,13 V8" fill="none" stroke-width="2.6"/>`+
  `<circle cx="0" cy="-4" r="13" fill="#5a9ad0"/><path d="M-9,-12 Q-4,-15 -1,-11 Q-3,-6 -8,-6 Q-11,-8 -9,-12Z M3,-3 Q8,-6 10,-1 Q9,5 4,6 Q1,2 3,-3Z M-6,3 Q-3,2 -2,6 Q-5,8 -7,6Z" fill="#7ab85a" stroke-width="1"/>`+
  `<path d="M-6,-14 Q-2,-17 3,-16" fill="none" stroke="#bfe0f4" stroke-width="1.6"/><path d="M-12,8 A16,16 0 0 1 4,-20" fill="none" stroke="${OL}" stroke-width="4"/><path d="M-12,8 A16,16 0 0 1 4,-20" fill="none" stroke="#e0b44a" stroke-width="2"/>`,
 /* 流蘇書籤：細長紅緞帶、金色花紋、下面一束金色流蘇 */
 bmark19:`<g transform="rotate(20)"><path d="M-4,-20 H4 V10 L0,7 L-4,10Z" fill="#b8323a"/><path d="M0,-17 V3" fill="none" stroke="#e0b44a" stroke-width="1.2" stroke-dasharray="2 2"/><circle cx="0" cy="-12" r="1.8" fill="#e0b44a" stroke="none"/>`+
  `<path d="M0,9 V13" fill="none" stroke="#c99a3a" stroke-width="1.6"/><circle cx="0" cy="13.6" r="2.2" fill="#e0b44a" stroke-width="1"/><path d="M-2,15 L-4,22 M-.7,15.6 L-1.4,22.6 M.7,15.6 L1.4,22.6 M2,15 L4,22" fill="none" stroke="#e0b44a" stroke-width="1.6"/></g>`,
 /* 封蠟印章：木頭圓頭手把、黃銅印座、旁邊一灘紅色封蠟 */
 wax19:`<ellipse cx="7" cy="14" rx="9" ry="4" fill="#c4473a"/><circle cx="7" cy="13.4" r="2.6" fill="none" stroke="#8a2a24" stroke-width="1.1"/>`+
  `<g transform="translate(-6,0) rotate(-12)"><rect x="-6" y="8" width="12" height="7" rx="1.4" fill="#c99a3a"/><path d="M-3,8 V-4 H3 V8Z" fill="#8a5a34"/><ellipse cx="0" cy="-10" rx="7" ry="8" fill="#a8703f"/><path d="M-3,-14 Q-1,-17 2,-16" fill="none" stroke="#d6a868" stroke-width="1.6"/><path d="M-5,11 H5" fill="none" stroke="#f0c94a" stroke-width="1.2"/></g>`,
 /* 小貓頭鷹：圓滾滾、耳羽、大眼睛 */
 owl19:`<path d="M-11,16 Q-15,0 -11,-8 Q0,-16 11,-8 Q15,0 11,16Z" fill="#a8784a"/><path d="M-6,15 Q-8,4 0,0 Q8,4 6,15Z" fill="#e8d4b0" stroke="none"/><path d="M-4,8 l2,-2 l2,2 M0,12 l2,-2 l2,2 M-3,12 l-2,-2" fill="none" stroke="#a8784a" stroke-width="1"/>`+
  `<path d="M-11,-8 L-13,-17 L-5,-11 M11,-8 L13,-17 L5,-11" fill="#a8784a"/><circle cx="-5" cy="-6" r="5" fill="#fbf6ea" stroke-width="1.3"/><circle cx="5" cy="-6" r="5" fill="#fbf6ea" stroke-width="1.3"/><circle cx="-5" cy="-6" r="2.6" fill="${OL}" stroke="none"/><circle cx="5" cy="-6" r="2.6" fill="${OL}" stroke="none"/><circle cx="-4" cy="-7" r=".9" fill="#fff" stroke="none"/><circle cx="6" cy="-7" r=".9" fill="#fff" stroke="none"/>`+
  `<path d="M-1.6,-2 L0,1.4 L1.6,-2Z" fill="#e0a83a" stroke-width="1"/><path d="M-11,-1 Q-17,6 -12,13 M11,-1 Q17,6 12,13" fill="#8a5a34"/><path d="M-5,16 v3 M-3,16 v3 M3,16 v3 M5,16 v3" fill="none" stroke="#e0a83a" stroke-width="1.4"/>`,
 /* 字母積木：三塊彩色積木疊起來，面上有字母 */
 abc19:`<rect x="-17" y="2" width="16" height="16" rx="1.6" fill="#d8413a"/><rect x="1" y="2" width="16" height="16" rx="1.6" fill="#4f86c4"/><rect x="-8" y="-15" width="16" height="16" rx="1.6" fill="#f0c94a"/>`+
  `<path d="M-13,15 L-9,5 L-5,15 M-11.6,11.4 H-6.4" fill="none" stroke="#fbf6ea" stroke-width="2"/><path d="M5,5 V15 H9 Q13,15 13,12.4 Q13,10 9,10 H5 M5,5 H8.6 Q12,5 12,7.4 Q12,10 9,10" fill="none" stroke="#fbf6ea" stroke-width="1.8"/><path d="M4,-10 Q0,-13 -3,-10 Q-5,-7 -3,-4 Q0,-1 4,-4" fill="none" stroke="#8a5a2a" stroke-width="2"/>`,
 /* 懷錶：金色錶殼、白色錶面、上面的錶冠和一段錶鏈 */
 watch19:`<path d="M2,-16 Q12,-22 16,-12 Q18,-6 14,-2" fill="none" stroke="#c99a3a" stroke-width="1.8" stroke-dasharray="2.4 1.4"/><circle cx="-2" cy="3" r="14" fill="#e0b44a"/><circle cx="-2" cy="3" r="10.4" fill="#fbfaf4" stroke-width="1.3"/>`+
  `<rect x="-5" y="-15" width="6" height="5" rx="1.4" fill="#e0b44a"/><circle cx="-2" cy="-16.4" r="2.6" fill="none" stroke="#c99a3a" stroke-width="1.6"/>`+
  `<path d="M-2,3 V-4 M-2,3 L3,5" fill="none" stroke-width="1.6"/><path d="M-2,-5.6 v1.6 M-2,10 v1.6 M-10.6,3 h1.6 M6.6,3 h-1.6" fill="none" stroke="#8a7f68" stroke-width="1.2"/><path d="M-11,-4 Q-8,-9 -3,-10" fill="none" stroke="#f8e6a0" stroke-width="1.8"/>`});
Object.assign(DECOY,{
 jbox19:`<rect x="-16" y="-4" width="32" height="18" rx="2" fill="#6a3f8a"/><path d="M-17,-4 Q-16,-13 0,-13 Q16,-13 17,-4Z" fill="#7a4f9a"/><path d="M-16,-4 H16 M-16,10 H16" fill="none" stroke="#e0b44a" stroke-width="2"/><circle cx="0" cy="3" r="2.6" fill="#e0b44a" stroke-width="1.1"/><path d="M0,4 v3" fill="none" stroke-width="1.2"/>`,
 twig19:`<g transform="rotate(38)"><path d="M0,20 Q-1,4 1,-20 M0,0 Q5,-6 7,-12" fill="none" stroke="${OL}" stroke-width="3.6" stroke-linecap="round"/><path d="M0,20 Q-1,4 1,-20 M0,0 Q5,-6 7,-12" fill="none" stroke="#8a6a46" stroke-width="2" stroke-linecap="round"/><path d="M1,-12 q-6,-3 -5,-8 q5,2 5,8Z" fill="#7aa85a" stroke-width="1"/></g>`,
 jam19:`<path d="M-11,14 Q-13,0 -9,-4 H9 Q13,0 11,14 Q0,17 -11,14Z" fill="#5a2a4a"/><path d="M-12,-4 Q-13,-12 0,-12 Q13,-12 12,-4 Q0,-1 -12,-4Z" fill="#e8dcc0"/><path d="M-11,-6 H11" fill="none" stroke="#c4473a" stroke-width="1.6"/><path d="M-6,4 Q-7,8 -5,11" fill="none" stroke="#9a6a8a" stroke-width="1.8"/>`,
 earr19:`<circle cx="-8" cy="2" r="7" fill="none" stroke="${OL}" stroke-width="3.6"/><circle cx="-8" cy="2" r="7" fill="none" stroke="#c99a3a" stroke-width="1.8"/><circle cx="9" cy="4" r="7" fill="none" stroke="${OL}" stroke-width="3.6"/><circle cx="9" cy="4" r="7" fill="none" stroke="#c99a3a" stroke-width="1.8"/><circle cx="-8" cy="9" r="2" fill="#d8413a" stroke-width="1"/><circle cx="9" cy="11" r="2" fill="#4f86c4" stroke-width="1"/>`,
 pan19:`<g transform="rotate(-35)"><path d="M0,9 V24" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><path d="M0,9 V24" fill="none" stroke="#3a3a40" stroke-width="4" stroke-linecap="round"/><circle cx="0" cy="-5" r="13" fill="#3a3a40"/><circle cx="0" cy="-5" r="9.6" fill="#5a5e6a" stroke="none"/></g>`,
 yarn19:`<circle cx="-2" cy="-1" r="13" fill="#5a9ad0"/><path d="M-12,-6 Q-2,-2 9,-10 M-14,2 Q-2,6 11,-2 M-8,9 Q0,4 8,8 M-6,-12 Q-10,0 -4,11" fill="none" stroke="#3a6a9a" stroke-width="1.3"/><path d="M10,6 Q16,12 13,18 Q10,20 16,20" fill="none" stroke="#5a9ad0" stroke-width="2"/>`,
 tie19:`<g transform="rotate(20)"><path d="M-4,-19 H4 L3,-13 H-3Z" fill="#b8323a"/><path d="M-3,-13 H3 L7,12 L0,20 L-7,12Z" fill="#b8323a"/><path d="M-2,-6 L4,-2 M-4,2 L5,6" fill="none" stroke="#8a2228" stroke-width="1.4"/></g>`,
 top19:`<path d="M-11,-4 Q0,-12 11,-4 L0,16Z" fill="#a8703f"/><path d="M-11,-4 Q0,2 11,-4" fill="none" stroke="#d8413a" stroke-width="2.4"/><path d="M-2,-9 V-19 H2 V-9Z" fill="#8a5a34"/><path d="M-6,4 L6,4" fill="none" stroke="#f0c94a" stroke-width="1.6"/>`,
 pine19:`<path d="M0,-17 Q-12,-8 -10,6 Q-6,16 0,18 Q6,16 10,6 Q12,-8 0,-17Z" fill="#9a6a3a"/><path d="M-8,-4 Q0,0 8,-4 M-9,4 Q0,8 9,4 M-6,11 Q0,14 6,11 M-4,-11 Q0,-8 4,-11" fill="none" stroke="#6a4222" stroke-width="1.4"/><path d="M0,-17 V-21" fill="none" stroke="#6a4222" stroke-width="2"/>`,
 sugar19:`<rect x="-15" y="2" width="14" height="14" rx="1.4" fill="#fbfaf4"/><rect x="1" y="2" width="14" height="14" rx="1.4" fill="#f4f0e4"/><rect x="-7" y="-13" width="14" height="14" rx="1.4" fill="#fbfaf4"/><path d="M-12,6 h2 M5,9 h2 M-3,-8 h2" fill="none" stroke="#d6cdb8" stroke-width="1.4"/>`,
 cookie19:`<path d="M-14,3 A14,14 0 1 0 12,-6 Q8,-6 8,-10 Q4,-10 4,-14 A14,14 0 0 0 -14,3Z" fill="#d9a05a"/><circle cx="-5" cy="0" r="1.8" fill="#6a3a1a" stroke="none"/><circle cx="3" cy="6" r="1.8" fill="#6a3a1a" stroke="none"/><circle cx="-6" cy="8" r="1.6" fill="#6a3a1a" stroke="none"/><circle cx="4" cy="-3" r="1.4" fill="#6a3a1a" stroke="none"/>`});

/* ---- 佈景 ---- */
const bookstack=()=>{const n=3+Math.floor(r()*3);let s=sh(18,4);for(let i=0;i<n;i++){const w=26+(i%2)*4-i*1.4,dx=sr(-3,3);s+=`<rect x="${f(-w/2+dx)}" y="${-7*(i+1)}" width="${f(w)}" height="7" rx="1" fill="${pk(BC)}" stroke-width="1.3"/><path d="M${f(-w/2+dx+3)},${-7*(i+1)+3.5} H${f(w/2+dx-3)}" fill="none" stroke="#f4ecd6" stroke-width=".9" opacity=".7"/>`}return s};
const plant=()=>sh(18,4)+`<path d="M-12,-20 L-10,0 H10 L12,-20Z" fill="#b8643a"/><path d="M-13,-22 H13 V-18 H-13Z" fill="#a85a32"/>`+
 [[-14,-50],[-4,-58],[8,-56],[16,-44],[-18,-36],[2,-46]].map(([x,y])=>`<path d="M0,-22 Q${f(x*.4)},${f(y*.6)} ${x},${y}" fill="none" stroke="#3f7a3a" stroke-width="2.4"/><ellipse cx="${x}" cy="${y}" rx="6" ry="9" fill="#5f9a48" stroke-width="1.2" transform="rotate(${f(x*2)} ${x} ${y})"/>`).join('');
const stool=()=>sh(14,3)+`<path d="M-10,0 L-8,-16 M10,0 L8,-16" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M-10,0 L-8,-16 M10,0 L8,-16" fill="none" stroke="#8a5a34" stroke-width="2.6"/><ellipse cx="0" cy="-17" rx="12" ry="4" fill="#a8703f"/>`;
const chest=()=>sh(24,4)+`<rect x="-22" y="-28" width="44" height="28" rx="2" fill="#a8703f"/><path d="M-22,-19 H22 M-22,-10 H22" fill="none" stroke="#8a5a34" stroke-width="1.6"/>`+
 `<path d="M-22,-28 h7 v7 M22,-28 h-7 v7 M-22,0 h7 v-7 M22,0 h-7 v-7" fill="none" stroke="#4a4f5c" stroke-width="3"/><rect x="-3" y="-24" width="6" height="7" rx="1" fill="#4a4f5c"/>`;
const paper=()=>sh(16,3)+`<path d="M-15,-2 L-13,-12 H15 L13,-2Z" fill="#f4ecd6"/><path d="M-14,-6 H14 M-13.5,-9 H14.5" fill="none" stroke="#d6cdb8" stroke-width="1"/><path d="M-6,-12 L-2,-18 L12,-16 L10,-11" fill="#fbf8f0" stroke-width="1.2"/>`;
/* 單獨的矮書架（雙面，前面看得到書） */
const shelfS=()=>sh(42,5)+shelf(-40,-110,80,110,4,'#8a5a34',Math.floor(r()*9000)+11)+`<rect x="-44" y="-114" width="88" height="8" rx="2" fill="#a8703f"/>`;
/* 推書車（空車也可以當藏東西的地方） */
const bcart=()=>sh(34,5)+`<circle cx="-22" cy="-5" r="5" fill="#4a3022"/><circle cx="22" cy="-5" r="5" fill="#4a3022"/><rect x="-30" y="-36" width="60" height="28" rx="2" fill="#a8703f"/><path d="M-30,-22 H30" fill="none" stroke="#8a5a34" stroke-width="3"/>`+
 [-24,-17,-11,-5,2,8,14,21].map((x,i)=>`<rect x="${x}" y="${-36-10-(i%3)*3}" width="6" height="${10+(i%3)*3}" fill="${BC[(i*5)%BC.length]}" stroke-width="1"/>`).join('')+
 `<path d="M30,-34 L42,-46" fill="none" stroke="${OL}" stroke-width="4"/><path d="M30,-34 L42,-46" fill="none" stroke="#6a4228" stroke-width="2.2"/>`;
/* 綠罩檯燈（閱覽桌上） */
const lamp=(x,y)=>`<g transform="translate(${x},${y})"><rect x="-5" y="-3" width="10" height="3" rx="1" fill="#c99a3a"/><path d="M0,-3 V-14" fill="none" stroke-width="2.4"/><path d="M0,-3 V-14" fill="none" stroke="#e0b44a" stroke-width="1.2"/><path d="M-9,-13 Q-9,-20 0,-20 Q9,-20 9,-13Z" fill="#3f8a5a"/><ellipse cx="0" cy="-12" rx="7" ry="2" fill="#fff4c0" stroke="none" opacity=".9"/></g>`;
const openB=(x,y,c='#8e2630')=>`<g transform="translate(${x},${y})"><path d="M-10,0 L-9,-4 Q-5,-6 0,-4 Q5,-6 9,-4 L10,0 Q5,-2 0,0 Q-5,-2 -10,0Z" fill="#fbf6ea" stroke-width="1"/><path d="M-10,0 Q-5,-2 0,0 Q5,-2 10,0 L10,1.4 H-10Z" fill="${c}" stroke-width="1"/></g>`;
const dk=(id,w,h,cy=-12)=>({w,h,fn:()=>T(0,cy,1,DECOY[id])});
Object.assign(KIND,{
 bookstack19:{w:36,h:34,fn:bookstack},plant19:{w:40,h:62,fn:plant},stool19:{w:28,h:24,fn:stool},chest19:{w:48,h:34,fn:chest},paper19:{w:32,h:20,fn:paper},
 shelfS19:{w:88,h:118,fn:shelfS},bcart19:{w:84,h:52,fn:bcart},
 jbox19:dk('jbox19',36,26,-4),twig19:dk('twig19',30,40,-6),jam19:dk('jam19',26,32,-6),earr19:dk('earr19',36,24,-4),pan19:dk('pan19',34,36,-6),yarn19:dk('yarn19',34,32,-6),
 tie19:dk('tie19',24,40,-6),top19:dk('top19',26,34,-6),pine19:dk('pine19',24,38,-6),sugar19:dk('sugar19',32,30,-6),cookie19:dk('cookie19',30,28,-4),
 ring17:KIND.ring17||dk('ring17',28,32,-4)});
['bookstack19','plant19','shelfS19','bcart19','chest19'].forEach(k=>H.OCCK.add(k));

/* ================= 4. 12 種 × 4 個（11 種新東西＋1 種第 17 關的老朋友） ================= */
const OLD={gkey17:{id:'gkey17',name:'城門大鑰匙',short:'大鑰匙',r:15,rot:30}};
const old=(id,regions)=>({...(typeOf(id)||OLD[id]),regions});
const TYPES=[
 old('gkey17',['north19','south19','east19','west19']),
 {id:'tome19',name:'紫色扣鎖古書',short:'古書',r:16,rot:10,regions:['west19','north19','center19','east19']},
 {id:'quill19',name:'羽毛筆',short:'羽毛筆',r:16,rot:20,regions:['east19','west19','north19','south19']},
 {id:'ink19',name:'墨水瓶',short:'墨水瓶',r:15,rot:6,regions:['east19','west19','south19','north19']},
 {id:'glass19',name:'圓框眼鏡',short:'眼鏡',r:16,rot:15,regions:['west19','south19','north19','center19']},
 {id:'lens19',name:'放大鏡',short:'放大鏡',r:16,rot:20,regions:['east19','west19','center19','south19']},
 {id:'globe19',name:'桌上地球儀',short:'地球儀',r:15,rot:6,regions:['north19','center19','west19','south19']},
 {id:'bmark19',name:'流蘇書籤',short:'書籤',r:15,rot:20,regions:['west19','south19','center19','east19']},
 {id:'wax19',name:'封蠟印章',short:'印章',r:15,rot:8,regions:['north19','east19','south19','west19']},
 {id:'owl19',name:'小貓頭鷹',short:'貓頭鷹',r:15,rot:6,regions:['center19','north19','east19','south19']},
 {id:'abc19',name:'字母積木',short:'積木',r:15,rot:8,nofl:true,regions:['south19','center19','west19','east19']},
 {id:'watch19',name:'懷錶',short:'懷錶',r:15,rot:15,regions:['south19','east19','north19','center19']}];
LEVELS[N].types=TYPES;
/* BORROW：不借 */

/* ================= 5. 區域、建築位置 ================= */
Object.assign(REG,{north19:{x:640,y:690,w:1220,h:170},west19:{x:620,y:900,w:460,h:700},center19:{x:1090,y:880,w:320,h:720},
 east19:{x:1420,y:900,w:460,h:700},south19:{x:620,y:1650,w:1260,h:480},all19:{x:620,y:690,w:1260,h:1440}});
H.SCREG[N]=['north19','west19','center19','east19','south19'];
const WINX=[760,1010,1490,1740];   /* 北牆高拱窗 */
const DESK={x:1250,y:820};          /* 館長大書桌（腳底中心）；桌鈴在 (DESK.x+60, DESK.y-58) */
const STAIR={x:1250,y:1330};        /* 木頭螺旋梯（腳底中心） */
const RUG={x:1250,y:1290,rx:250,ry:130};
const SPOT={giver:[1400,1610],target:[1838,1190],helper:[700,1660]};   /* 故事角色固定位置 */
const GAL=470;                      /* 石拱迴廊的地板 */
const BEAM=WINX.map(x=>[x,x+250]);  /* 光柱：從窗戶斜斜照到地板（窗戶 x → 地板光斑中心 x） */

/* ================= 6. 地面（北牆書牆、窗戶、迴廊、木地板、圓形地毯、光柱） ================= */
function ground(){
 const Sc=H.SCENES[N],X0=Sc.x0-420,X1=Sc.x1+420,YB=Sc.y1+420,WW=X1-X0;let g='';
 g+=`<defs><linearGradient id="sky19" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe0f4"/><stop offset="1" stop-color="#fdf2cc"/></linearGradient>`+
  `<linearGradient id="bm19" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6d0" stop-opacity=".5"/><stop offset="1" stop-color="#fff6d0" stop-opacity=".18"/></linearGradient></defs>`;
 g+=`<style>.ds19{animation:ds19 2.6s ease-in-out infinite}@keyframes ds19{0%,100%{opacity:.15}50%{opacity:1}}</style>`;
 /* 木地板 */
 g+=`<rect x="${X0}" y="${WY-10}" width="${WW}" height="${YB-WY+10}" fill="#caa070" stroke="none"/>`;
 let fl='';for(let y=WY+30,k=0;y<YB;y+=30,k++){fl+=`M${X0},${y} H${X1} `;for(let x=X0+(k%3)*60;x<X1;x+=180)fl+=`M${x},${y-30} V${y} `}
 g+=`<path d="${fl}" fill="none" stroke="#b08452" stroke-width="1.3"/>`;
 /* ---- 北牆：石牆、天花板大梁、高拱窗 ---- */
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="${WY+420}" fill="#e2d6ba"/>`;
 let bl='';for(let y=60,k=0;y<GAL-200;y+=32,k++){bl+=`M${X0},${y} H${X1} `;for(let x=X0+(k%2)*40;x<X1;x+=80)bl+=`M${x},${y} V${y+32} `}
 g+=`<path d="${bl}" fill="none" stroke="#cfc2a2" stroke-width="1.2"/>`;
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="440" fill="#5a3e2c" stroke="none" opacity=".5"/><rect x="${X0}" y="6" width="${WW}" height="30" fill="#6a4228"/><path d="M${X0},14 H${X1}" fill="none" stroke="#4a3022" stroke-width="1.4"/>`;
 for(let x=640;x<=1880;x+=155)g+=`<path d="M${x-12},36 h24 l-7,30 h-10Z" fill="#6a4228"/>`;
 const win=cx=>{const w=46,y0=90,y1=250;let s=`<path d="M${cx-w-10},${y1+8} V${y0+w} Q${cx-w-10},${y0-12} ${cx},${y0-32} Q${cx+w+10},${y0-12} ${cx+w+10},${y0+w} V${y1+8}Z" fill="#c9bf9f"/>`;
  s+=`<path d="M${cx-w},${y1} V${y0+w} Q${cx-w},${y0} ${cx},${y0-20} Q${cx+w},${y0} ${cx+w},${y0+w} V${y1}Z" fill="url(#sky19)"/>`;
  s+=`<ellipse cx="${cx-14}" cy="${y0+50}" rx="20" ry="7" fill="#fbfbf6" stroke="none" opacity=".9"/>`;
  s+=`<path d="M${cx},${y0-20} V${y1} M${cx-w},${y0+70} H${cx+w} M${cx-w},${y0+120} H${cx+w}" fill="none" stroke="#6a4228" stroke-width="3.4"/>`;
  s+=`<path d="M${cx-w},${y1} V${y0+w} Q${cx-w},${y0} ${cx},${y0-20} Q${cx+w},${y0} ${cx+w},${y0+w} V${y1}Z" fill="none" stroke-width="2.4"/><rect x="${cx-w-14}" y="${y1+4}" width="${2*w+28}" height="12" rx="3" fill="#cbbf9f"/>`;
  return s};
 WINX.forEach(x=>g+=win(x));
 /* 中間的大圓窗 */
 {const cx=1250,cy=160,R=74;g+=`<circle cx="${cx}" cy="${cy}" r="${R+12}" fill="#c9bf9f"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#sky19)"/>`+
  Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<path d="M${cx},${cy} L${f(cx+Math.cos(a)*R)},${f(cy+Math.sin(a)*R)}" fill="none" stroke="#6a4228" stroke-width="3"/>`}).join('')+
  `<circle cx="${cx}" cy="${cy}" r="${R*.45}" fill="none" stroke="#6a4228" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="12" fill="#e0b44a" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke-width="2.4"/>`}
 /* ---- 石拱迴廊（使用者選 2B）：一排石拱，拱裡面是書架；迴廊欄杆是 sprite（galFront），迴廊上的人站在欄杆後面 ---- */
 const AW=124;g+=`<rect x="${X0}" y="${GAL-200}" width="${WW}" height="200" fill="#d6cbae"/>`;
 for(let cx=X0+AW/2,k=0;cx<X1;cx+=AW,k++){g+=`<path d="M${cx-48},${GAL} V${GAL-150} Q${cx},${GAL-196} ${cx+48},${GAL-150} V${GAL}Z" fill="#4a3022"/>`+shelf(cx-44,GAL-150,88,150,3,'#7a4e2a',500+k*13);
  g+=`<path d="M${cx-48},${GAL} V${GAL-150} Q${cx},${GAL-196} ${cx+48},${GAL-150} V${GAL}" fill="none" stroke="#c9bf9f" stroke-width="7"/><path d="M${cx-48},${GAL} V${GAL-150} Q${cx},${GAL-196} ${cx+48},${GAL-150} V${GAL}" fill="none"/>`}
 g+=`<path d="M${X0},${GAL-200} H${X1}" fill="none" stroke="#b9ad8c" stroke-width="4"/>`;
 /* 迴廊地板（厚石板）＋下面一樓的大書架 */
 g+=`<rect x="${X0}" y="${GAL}" width="${WW}" height="16" fill="#cbbf9f"/><rect x="${X0}" y="${GAL+16}" width="${WW}" height="6" fill="#000" opacity=".18" stroke="none"/>`;
 for(let x=X0,k=0;x<X1;x+=150,k++)g+=shelf(x,GAL+16,150,WY-GAL-16,3,'#8a5a34',700+k*17);
 g+=`<path d="M${X0},${WY} H${X1}" fill="none" stroke="#6a4228" stroke-width="5"/>`;
 /* ---- 光柱（使用者選 3D：光柱＋閃閃灰塵＋地上窗格光斑）：半透明，不用模糊濾鏡 ---- */
 BEAM.forEach(([wx,fx])=>{const by=900;
  /* 2026-11-21 使用者選 D（只從右半邊窗戶出來），再往左上移：光柱上緣的右上角留在玻璃裡、不碰窗框（往下灑出去碰到窗框沒關係） */
  const a=wx-18,b=wx+38,ty=158;
  g+=`<path d="M${fx-70},${by-34} L${fx+60},${by-34} L${fx+90},${by+40} L${fx-40},${by+40}Z" fill="#fff4c8" opacity=".5" stroke="none"/><path d="M${fx+10},${by-34} L${fx+25},${by+40} M${fx-55},${by+3} H${fx+75}" fill="none" stroke="#e8c88a" stroke-width="3" opacity=".6"/>`;
  g+=`<path d="M${a},${ty} L${b},${ty} L${fx+75},${by} L${fx-55},${by}Z" fill="url(#bm19)" stroke="none"/>`;
  g+=`<path d="M${(a+b)/2-10},${ty} L${(a+b)/2+12},${ty} L${fx+30},${by} L${fx-10},${by}Z" fill="#fffbe8" opacity=".22" stroke="none"/>`;
  let ds='';for(let i=0;i<10;i++){const t=sr(.08,.95),x=(a+b)/2+(fx+10-(a+b)/2)*t+sr(-36,36),y=ty+(by-ty)*t;ds+=`<circle class="ds19" style="animation-delay:-${f(sr(0,2.6))}s" cx="${f(x)}" cy="${f(y)}" r="${f(sr(1.4,2.8))}" fill="#fff" stroke="none"/>`}
  g+=ds});
 /* 2026-11-21 使用者：兩側的綠地毯、抄寫室石板要在中間紅色圓地毯下面 → 先畫 */
 /* 西邊閱覽區的長條綠地毯、南邊入口的門墊和門口的亮光 */
 g+=`<rect x="680" y="960" width="380" height="620" rx="14" fill="#4f7a5a" opacity=".55"/><rect x="694" y="972" width="352" height="596" rx="10" fill="none" stroke="#c9b48a" stroke-width="2.4" opacity=".8"/>`;
 g+=`<ellipse cx="1250" cy="2150" rx="150" ry="70" fill="#fff4c8" opacity=".35" stroke="none"/><rect x="1180" y="2090" width="140" height="50" rx="8" fill="#a8502e"/><path d="M1192,2102 H1308 M1192,2128 H1308" fill="none" stroke="#e0b44a" stroke-width="2"/>`;
 /* 東邊抄寫室：石板地 */
 g+=`<rect x="1440" y="930" width="440" height="660" rx="10" fill="#d6cbae" opacity=".75"/>`;
 let st='';for(let y=966;y<1590;y+=36)st+=`M1440,${y} H1880 `;for(let x=1480;x<1880;x+=44)st+=`M${x},930 V1590 `;g+=`<path d="${st}" fill="none" stroke="#c4b896" stroke-width="1.2"/>`;
 /* ---- 中間的圓形大地毯（螺旋梯在中央） ---- */
 g+=`<ellipse cx="${RUG.x}" cy="${RUG.y}" rx="${RUG.rx}" ry="${RUG.ry}" fill="#8e2630"/><ellipse cx="${RUG.x}" cy="${RUG.y}" rx="${RUG.rx-16}" ry="${RUG.ry-10}" fill="none" stroke="#e0b44a" stroke-width="4"/>`+
  `<ellipse cx="${RUG.x}" cy="${RUG.y}" rx="${RUG.rx-40}" ry="${RUG.ry-26}" fill="#a83a3a" stroke="none"/>`+Array.from({length:16},(_,i)=>{const a=i*Math.PI/8;return `<circle cx="${f(RUG.x+Math.cos(a)*(RUG.rx-28))}" cy="${f(RUG.y+Math.sin(a)*(RUG.ry-18))}" r="4" fill="#e0b44a" stroke="none"/>`}).join('');
 return `<g stroke="${OL}" stroke-width="2" stroke-linejoin="round">${g}</g>`}

/* ---- 迴廊欄杆（sprite，原點在迴廊地板 y=GAL+18，x 用場景座標） ---- */
const galFront=(xa,xb)=>{let s=`<path d="M${xa},-6 H${xb} V-2 H${xa}Z" fill="#cbbf9f"/>`;let b='';for(let x=xa+6;x<xb;x+=16)b+=`<path d="M${x-3},-6 Q${x-6},-16 ${x},-20 Q${x+6},-16 ${x+3},-6Z" fill="#e2d8c0" stroke-width="1.3"/>`;
 return s+b+`<rect x="${xa}" y="-28" width="${xb-xa}" height="8" rx="2" fill="#d6cbae"/>`};

/* ---- 木頭螺旋梯（使用者選 1A）：中柱、一階一階繞上去、扶手、頂端圓平台＋欄杆 ---- */
const SPIR={R:66,n:24,hh:13};
const railPts=()=>{const P=[];for(let i=0;i<=SPIR.n;i++){const a=i*.52,y=-i*SPIR.hh;P.push([Math.cos(a)*SPIR.R,y+Math.sin(a)*SPIR.R*.32-34,Math.sin(a)])}return P};
const spiral=()=>{const {R,n,hh}=SPIR,pw=9,wood='#a8703f',top=-(n+1)*hh;let back='',front='',rb='',rf='';
 for(let i=0;i<=n;i++){const a=i*.52,c=Math.cos(a),s=Math.sin(a),y=-i*hh,a2=a+.5,c2=Math.cos(a2),s2=Math.sin(a2),X1=c*R,Y1=y+s*R*.32,X2=c2*R,Y2=y+s2*R*.32,px=((c+c2)/2>0?1:-1)*pw;
  const st=`<path d="M${f(px)},${f(y)} L${f(X1)},${f(Y1)} L${f(X2)},${f(Y2)}Z" fill="#c48a52"/><path d="M${f(X1)},${f(Y1)} L${f(X2)},${f(Y2)} L${f(X2)},${f(Y2+6)} L${f(X1)},${f(Y1+6)}Z" fill="${wood}"/><path d="M${f(X1)},${f(Y1)} V${f(Y1-34)}" fill="none" stroke="#7a4e2a" stroke-width="2"/>`;
  if(s<0)back+=st;else front+=st}
 const P=railPts();for(let i=0;i<P.length-1;i++){const [x1,y1,s1]=P[i],[x2,y2]=P[i+1];const p=`<path d="M${f(x1)},${f(y1)} L${f(x2)},${f(y2)}" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><path d="M${f(x1)},${f(y1)} L${f(x2)},${f(y2)}" fill="none" stroke="#7a4e2a" stroke-width="3" stroke-linecap="round"/>`;if(s1<0)rb+=p;else rf+=p}
 const post=`<rect x="${-pw}" y="${top}" width="${pw*2}" height="${-top+6}" fill="#8a5a34"/><path d="M${pw*.3},${top} V6" fill="none" stroke="#000" opacity=".15" stroke-width="${pw*.8}"/>`;
 const L=R+10,ry=L*.32;let lr='',lf='';
 for(let k=0;k<14;k++){const a=Math.PI*(k/13),x=-Math.cos(a)*(L-2);lr+=`<path d="M${f(x)},${f(top-3-Math.sin(a)*(L-2)*.32)} v-26" fill="none" stroke="#7a4e2a" stroke-width="2.4"/>`;lf+=`<path d="M${f(x)},${f(top-3+Math.sin(a)*(L-2)*.32)} v-26" fill="none" stroke="#7a4e2a" stroke-width="2.4"/>`}
 lr+=`<path d="M${-L+2},${top-29} A${L-2},${f(ry)} 0 0 1 ${L-2},${top-29}" fill="none" stroke="#7a4e2a" stroke-width="4"/>`;lf+=`<path d="M${-L+2},${top-29} A${L-2},${f(ry)} 0 0 0 ${L-2},${top-29}" fill="none" stroke="#7a4e2a" stroke-width="4"/>`;
 const land=`<ellipse cx="0" cy="${top}" rx="${L}" ry="${f(ry)}" fill="${wood}"/><ellipse cx="0" cy="${top-3}" rx="${L}" ry="${f(ry)}" fill="#c48a52"/>`;
 /* 彩蛋：從扶手溜下來的小朋友（平常藏起來），沿著扶手的幾個點往下滑 */
 const pts=P.filter((_,i)=>i%4===0).reverse(),kf=pts.map((q,i)=>`${f(i/(pts.length-1)*100)}%{transform:translate(${f(q[0])}px,${f(q[1]+6)}px)}`).join('');
 const slide=`<style>.sl19{animation:sl19 2.4s ease-in forwards}@keyframes sl19{${kf}}</style><g class="sld19" opacity="0">${T(0,0,.8,kid({view:'side',pose:'up2',hat:-1,mood:1,shirt:'#d8413a',top:'tee',bottom:'pants'}))}</g>`;
 return `<ellipse cx="0" cy="6" rx="${R+16}" ry="15" fill="#000" opacity=".18" stroke="none"/>`+rb+back+post+lr+land+lf+front+rf+slide};

/* ---- 館長大書桌（正面）：桌上帳簿、羽毛筆架（空的）、桌鈴；館長坐在後面 ---- */
const deskBell=`<g transform="translate(60,-58)"><ellipse cx="0" cy="0" rx="9" ry="3" fill="#8a7f68"/><path d="M-7,0 Q-7,-10 0,-10 Q7,-10 7,0Z" fill="#d6dce4"/><circle cx="0" cy="-12" r="2.4" fill="#c4cad2" stroke-width="1"/><path d="M-4,-6 Q-3,-8 -1,-8.6" fill="none" stroke="#fff" stroke-width="1.4"/></g>`;
const headDesk=()=>{let s=sh(110,8);
 s+=act(-10,-36,1,{view:'front',pose:'stand',hat:-1,hs:3,hair:'#e8e4dc',skin:'#f0cfae',shirt:'#3f6a4a',top:'long',bottom:'pants',mood:2},'nod');
 s+=`<rect x="-104" y="-58" width="208" height="12" rx="2" fill="#a8703f"/><rect x="-98" y="-46" width="196" height="46" fill="#8a5a34"/><path d="M-90,-40 H-20 V-6 H-90Z M20,-40 H90 V-6 H20Z" fill="none" stroke="#6a4228" stroke-width="2.4"/><circle cx="-55" cy="-23" r="3" fill="#e0b44a" stroke-width="1"/><circle cx="55" cy="-23" r="3" fill="#e0b44a" stroke-width="1"/>`;
 s+=`<g transform="translate(-60,-58)"><path d="M-16,0 L-14,-6 H14 L16,0Z" fill="#f4ecd6"/><path d="M-16,0 H16" fill="none" stroke="#8e2630" stroke-width="3"/></g>`+`<g transform="translate(-74,-58)"><rect x="-6" y="-14" width="12" height="14" rx="1" fill="#3f6a4a" stroke-width="1.2"/><rect x="-4" y="-22" width="8" height="8" fill="#8e2630" stroke-width="1.2"/></g>`;
 s+=`<g transform="translate(18,-58)"><rect x="-10" y="-5" width="20" height="5" fill="#2f4f8a" stroke-width="1"/><rect x="-8" y="-10" width="16" height="5" fill="#c99a3a" stroke-width="1"/></g>`+deskBell;
 return s};

/* ---- 閱覽長桌（正面）：人坐在後面，桌面擋住下半身；桌上綠罩檯燈、攤開的書 ---- */
const rdTable=(seats,deco)=>{let s=sh(124,8);seats.forEach(([x,o,an])=>s+=act(x,-14,o.dir||1,{view:'front',pose:'stand',...o},an));
 s+=`<rect x="-124" y="-34" width="248" height="10" rx="2" fill="#a8703f"/><path d="M-118,-24 V0 M118,-24 V0 M-60,-24 V0 M60,-24 V0" fill="none" stroke="${OL}" stroke-width="5"/><path d="M-118,-24 V0 M118,-24 V0 M-60,-24 V0 M60,-24 V0" fill="none" stroke="#8a5a34" stroke-width="3"/><rect x="-120" y="-25" width="240" height="7" fill="#8a5a34"/>`;
 return s+(deco||'')};
/* ---- 抄寫室：斜面書寫台＋坐在高凳上的抄寫員（側面），拿細細的蘆葦筆 ---- */
const reed=`<path d="M10,-22 L18,-34" fill="none" stroke="#8a6a3a" stroke-width="1.6"/>`;
const lectern=(o,say)=>{let s=sh(34,5)+`<path d="M-22,0 L-18,-20 M-6,0 L-10,-20" fill="none" stroke="${OL}" stroke-width="4"/><path d="M-22,0 L-18,-20 M-6,0 L-10,-20" fill="none" stroke="#8a5a34" stroke-width="2.4"/><ellipse cx="-14" cy="-21" rx="10" ry="3" fill="#a8703f"/>`;
 s+=act(-14,-20,1,{...scribeO(o),view:'side',pose:'sit',mood:o.mood??2,extra:robe('#7a5a3a')+reed},'work');
 s+=`<path d="M14,0 V-28 M30,0 V-34" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M14,0 V-28 M30,0 V-34" fill="none" stroke="#8a5a34" stroke-width="2.6"/><path d="M6,-28 L36,-40 L38,-34 L8,-22Z" fill="#a8703f"/><path d="M10,-29 L32,-38 L33,-35 L11,-26Z" fill="#fbf6ea" stroke-width="1.1"/><path d="M14,-29 L28,-35 M15,-27 L29,-33" fill="none" stroke="#8a7f68" stroke-width=".8"/>`;
 s+=`<g transform="translate(36,-42)"><rect x="-3" y="-5" width="6" height="5" rx="1" fill="#2a3a6a" stroke-width="1"/></g>`;
 return s};


/* ---- 小圓桌＋兩把椅子（側面坐） ---- */
const chairS=(x,dir)=>`<g transform="translate(${x},0) scale(${dir},1)"><path d="M-10,0 V-16 M8,0 V-16 M-10,-16 V-42" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M-10,0 V-16 M8,0 V-16 M-10,-16 V-42" fill="none" stroke="#8a5a34" stroke-width="2.6"/><rect x="-13" y="-19" width="24" height="5" rx="1.4" fill="#a8703f"/><rect x="-13" y="-44" width="6" height="16" rx="1.4" fill="#6a3f8a"/></g>`;
const roundTbl=(pa,pb,deco='')=>sh(56,6)+chairS(-34,1)+chairS(34,-1)+act(-30,-18,1,{view:'side',pose:'sit',...pa},pa.an??'nod')+act(30,-18,-1,{view:'side',pose:'sit',...pb},pb.an??'lean')+
 `<path d="M0,-26 V0 M-12,0 H12" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M0,-26 V0 M-12,0 H12" fill="none" stroke="#8a5a34" stroke-width="2.6"/><ellipse cx="0" cy="-28" rx="22" ry="6" fill="#a8703f"/>`+deco;
/* ================= 7. 建築與佈景、人群小故事 ================= */
Object.assign(POOL,{
 north19:[['bookstack19',.8],['stool19',.4],['plant19',.3],['jbox19',.2],['earr19',.2],['tie19',.2],['ring17',.2],['sugar19',.15]],
 west19:[['bookstack19',.9],['stool19',.5],['chest19',.2],['twig19',.2],['earr19',.25],['pan19',.15],['jbox19',.25],['tie19',.2],['cookie19',.25],['sugar19',.2]],
 center19:[['bookstack19',.7],['plant19',.3],['stool19',.3],['yarn19',.2],['pine19',.25],['top19',.2],['jbox19',.15]],
 east19:[['bookstack19',.6],['chest19',.3],['stool19',.3],['jam19',.3],['twig19',.3],['pan19',.15],['top19',.15],['pine19',.2],['ring17',.15]],
 south19:[['bookstack19',.7],['plant19',.4],['stool19',.3],['bcart19',.2],['yarn19',.25],['top19',.25],['sugar19',.2],['cookie19',.25],['jam19',.15],['ring17',.15],['pine19',.15]],
 decor19:[['bookstack19',1],['stool19',.4]]});
const grp=(x,y,w,h,kind,svg,say,o={})=>add(x,y,w,h,kind,svg,{say,...o});
let stairSp=null;
function structures(){
 /* ---- 北：迴廊上的人（站在欄杆後面，mark:false）、迴廊欄杆、館長大書桌 ---- */
 const galP=(x,svg,say)=>{const sp=add(x,GAL+4,40,60,'galp19',svg,{mark:false,say});sp.y=GAL+4};
 galP(780,act(0,0,1,{view:'back',pose:'up',hat:HAT_SOFT,shirt:'#4a3a6a',mood:1},'nod'),'學者：（在迴廊上找書）第三排⋯第三排⋯咦，這排怎麼也是第三排？');
 galP(1090,act(-12,0,1,{view:'side',pose:'hold',hat:HAT_TIARA,hs:2,shirt:'#b8667a',mood:1,extra:gown('#b8667a')},'lean')+act(14,0,-1,{view:'side',pose:'stand',hat:HAT_BERET,shirt:'#2f4f8a',mood:3},'nod'),'貴婦人：（在迴廊上小聲聊天）從這裡往下看，大家都好小喔！');
 galP(1420,act(0,0,-1,{...libO(),view:'fq',pose:'up2',mood:2},'step'),'館員：迴廊上的書都是古書，要借的話請先登記喔。');
 galP(1700,act(0,0,1,{view:'fq',pose:'hold',hat:-1,shirt:'#1f5f6a',mood:1,extra:robe('#1f5f6a')},'nod'),'學生：迴廊這裡陽光最好，看書看到都不想下去了。');
 galP(940,act(0,0,1,{view:'bq',pose:'up2',hat:-1,hs:1,shirt:'#7a3a5a',mood:1},'step'),'小姐：（從迴廊欄杆往下看）哇，螺旋梯從這裡看像一個大蝸牛殼！');
 galP(1560,act(-12,0,1,{...libO(),view:'side',pose:'hold',mood:1},'nod')+act(14,0,-1,{view:'side',pose:'stand',hat:HAT_SOFT,shirt:'#4a3a6a',mood:2,extra:robe('#4a3a6a')},'nod'),'館員：這本古書要戴手套才能翻喔。——學者：我、我剛剛已經翻了三頁⋯');
 galP(1820,act(0,0,-1,{view:'fq',pose:'up',hat:HAT_BERET,shirt:'#c99a3a',mood:3},'nod'),'貴族：（在迴廊上伸懶腰）看書看到肩膀好痠——');
 {const sp=add(0,GAL+18,4,4,'galF19',galFront(H.SCENES[N].x0-420,H.SCENES[N].x1+420),{mark:false});sp.y=GAL+18}
 grp(DESK.x,DESK.y,210,90,'desk19',headDesk(),'館長：借書要登記，還書要準時，書頁不可以折角喔！');
 grp(770,720,50,80,'reach19',act(0,0,1,{view:'bq',pose:'up2',hat:-1,shirt:'#a8502e',mood:3},'step'),'貴族：（踮腳）最上面那本⋯就差一點點⋯搆不到！');
 grp(1610,716,50,80,'dust19',act(0,0,-1,{...maidO(),view:'side',pose:'up',mood:1,extra:`<path d="M12,-40 l8,-6 l3,6Z" fill="#f4ecd6" stroke-width="1"/>`},'work'),'女僕：書架上的灰塵擦乾淨，陽光照進來才不會「哈啾」！');
 /* ---- 中：螺旋梯、旁邊的人 ---- */
 stairSp=add(STAIR.x,STAIR.y,170,360,'stair19',spiral(),{sh:.9});stairSp.say='（木頭螺旋梯一圈一圈往上繞，踩上去會嘎吱嘎吱響）';
 grp(1130,1400,50,60,'kidread19',T(0,0,.85,kid({view:'front',pose:'crouch',hat:-1,mood:1,extra:`<g transform="translate(0,-10)">${openB(0,0,'#2f4f8a')}</g>`})),'小朋友：（坐在樓梯口看書）這本書的龍會噴火，好酷！');
 grp(1380,1420,50,80,'count19',act(0,0,-1,{view:'fq',pose:'hold',hat:HAT_SOFT,shirt:'#3a2e4a',mood:2,extra:robe('#3a2e4a')},'nod'),'老學者：這座樓梯一共有⋯一百零八階？我每次數都不一樣。');
 /* ---- 西：閱覽長桌 ---- */
 const W=[[870,1000],[870,1160],[870,1320],[870,1480]];   /* 2026-11-21 使用者：人、桌椅、佈景再多 0.5 倍 → 閱覽長桌 3 張變 4 張 */
 grp(W[0][0],W[0][1],250,90,'rdTable19',rdTable([[-70,{hat:HAT_SOFT,shirt:'#4a3a6a',hair:'#e8e4dc',beard:true,mood:2},'nod'],[0,{hat:-1,shirt:'#3f6a4a',mood:2},'nod'],[70,{hat:HAT_BERET,shirt:'#8e2630',mood:2},'nod']],lamp(-35,-34)+lamp(35,-34)+openB(-70,-34)+openB(0,-34,'#2f4f8a')+openB(70,-34,'#3f6a4a')),'學者：再讀一頁⋯再一頁就好⋯（已經說了三個小時）');
 grp(W[1][0],W[1][1],250,90,'rdTable19',rdTable([[-50,{hat:-1,hs:1,shirt:'#7aa8c4',mood:1},'lean'],[50,{hat:-1,hs:2,shirt:'#c99a3a',mood:3},'lean']],lamp(0,-34)+openB(-50,-34,'#a8502e')+openB(50,-34,'#6a3f8a')+`<rect x="-8" y="-38" width="10" height="6" fill="#fbf6ea" transform="rotate(-12)" stroke-width="1"/>`),'學生：（小聲）待會去宮廷院看孔雀嗎？——另一個：噓，館長在看！');
 grp(W[2][0],W[2][1],250,90,'rdTable19',rdTable([[-60,{hat:-1,shirt:'#2f4f8a',mood:4},false],[40,{hat:HAT_TIARA,hs:4,shirt:'#d98a9a',mood:1},'nod'],[90,{hat:HAT_TIARA,hs:2,shirt:'#7a3a5a',mood:3},'lean']],lamp(-10,-34)+openB(-60,-34)+openB(55,-34,'#c99a3a')+`<g transform="translate(-60,-42)"><text x="10" y="-8" font-size="11" fill="#6a5a48" stroke="none">z z</text></g>`),'（趴在書上睡著了）⋯呼⋯——貴婦人：這本古老食譜說，蛋糕要加三匙月光⋯月光要去哪裡買？');
 grp(W[3][0],W[3][1],250,90,'rdTable19',rdTable([[-75,{hat:HAT_BERET,shirt:'#1f5f6a',mood:1},'nod'],[-15,{hat:-1,hs:2,shirt:'#b8667a',mood:2},'nod'],[45,{hat:HAT_SOFT,shirt:'#3a2e4a',mood:3},'lean'],[95,{hat:-1,shirt:'#a8502e',mood:1},'nod']],lamp(-45,-34)+lamp(70,-34)+openB(-75,-34,'#6a3f8a')+openB(-15,-34)+openB(45,-34,'#2f4f8a')+`<g transform="translate(95,-40)"><rect x="-9" y="-5" width="18" height="5" fill="#3f6a4a" stroke-width="1"/><rect x="-8" y="-10" width="16" height="5" fill="#c99a3a" stroke-width="1"/></g>`),'學生們：（四個人圍著一本地圖書）這條河通到海底世界？——不對，那是書頁的摺痕啦！');
 grp(700,1580,90,80,'shush19',act(-18,0,1,{...libO(),view:'side',pose:'hold',mood:2,extra:`<path d="M9,-30 V-38" fill="none" stroke="#f0cfae" stroke-width="2.4"/>`},'nod')+T(22,0,.8,kid({view:'side',pose:'stand',hat:-1,mood:3}),true),'館員：噓——圖書館裡要小聲喔。——小朋友：（小小聲）好⋯');
 grp(1040,1590,70,80,'armch19',`<path d="M-26,0 V-30 Q-26,-46 0,-46 Q26,-46 26,-30 V0Z" fill="#6a3f8a"/><rect x="-30" y="-24" width="12" height="24" rx="4" fill="#5a2f7a"/><rect x="18" y="-24" width="12" height="24" rx="4" fill="#5a2f7a"/>`+act(0,-6,1,{view:'front',pose:'stand',hat:-1,hs:0,hair:'#c9c4bc',shirt:'#8e2630',mood:2,extra:`<g transform="translate(0,-18)">${openB(0,0,'#3f6a4a')}</g>`},'nod')+`<rect x="-20" y="-16" width="40" height="16" rx="3" fill="#6a3f8a"/>`,'老爺爺：坐在這張扶手椅上看書，一下午就過去了。');
 /* ---- 東：抄寫室 ---- */
 grp(1520,1020,80,80,'lect19',lectern({hair:'#4a3424'}),'抄寫員：這個字的尾巴要彎得漂亮⋯糟糕，墨水滴下來了！');
 grp(1700,1020,80,80,'lect19',lectern({hair:'#c9c4bc',beard:true}),'老抄寫員：一天抄一頁，抄完這本書⋯大概是明年春天吧。');
 grp(1560,1220,80,80,'lect19',lectern({hair:'#8a5a2a',mood:3}),'見習抄寫員：師傅說，抄錯一個字就要整頁重來⋯（嘆氣）');
 grp(1560,1420,120,80,'bind19',`<rect x="-50" y="-36" width="100" height="8" rx="2" fill="#a8703f"/><path d="M-44,-28 V0 M44,-28 V0" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M-44,-28 V0 M44,-28 V0" fill="none" stroke="#8a5a34" stroke-width="2.6"/>`+
  `<g transform="translate(-20,-36)"><rect x="-12" y="-6" width="24" height="6" fill="#8e2630" stroke-width="1.1"/><rect x="-11" y="-12" width="22" height="6" fill="#f4ecd6" stroke-width="1.1"/></g><g transform="translate(18,-36)"><rect x="-10" y="-4" width="20" height="4" fill="#f4ecd6" stroke-width="1"/><path d="M-10,-8 H10" fill="none" stroke="#c9b48a" stroke-width="1"/></g>`+
  act(-10,-30,1,{view:'front',pose:'reach',hat:-1,shirt:'#5a6a3a',mood:1,extra:`<path d="M14,-22 Q22,-30 26,-20" fill="none" stroke="#c9b48a" stroke-width="1"/>`},'work')+`<rect x="-46" y="-30" width="92" height="6" fill="#8a5a34"/>`,'裝訂師傅：一針、兩針⋯這本書要縫三百針！');
 grp(1790,1400,120,110,'dry19',`<path d="M-50,0 V-90 M50,0 V-90" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M-50,0 V-90 M50,0 V-90" fill="none" stroke="#8a5a34" stroke-width="2.6"/><path d="M-50,-84 Q0,-74 50,-84" fill="none" stroke="#c9b48a" stroke-width="1.6"/>`+
  [-36,-14,8,30].map((x,i)=>`<g transform="translate(${x},${-80+Math.abs(x)*.12})"><rect x="-8" y="0" width="16" height="22" fill="#fbf6ea" stroke-width="1.2"/><path d="M-5,5 H5 M-5,9 H5 M-5,13 H3" fill="none" stroke="#6a6a7a" stroke-width=".9"/>${i===1?`<circle cx="3" cy="17" r="2.6" fill="#c4473a" stroke="none"/>`:''}</g>`).join(''),'（剛抄好的書頁掛起來晾乾，紙上的墨還亮亮的）');
 grp(1700,1560,100,80,'repair19',`<rect x="-40" y="-30" width="80" height="8" rx="2" fill="#a8703f"/><path d="M-34,-22 V0 M34,-22 V0" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M-34,-22 V0 M34,-22 V0" fill="none" stroke="#8a5a34" stroke-width="2.6"/>`+
  `<g transform="translate(10,-30)"><path d="M-14,0 L-12,-6 Q-6,-8 0,-6 Q6,-8 12,-6 L14,0Z" fill="#e8dcc0" stroke-width="1.1"/><path d="M-4,-6 L2,-1" fill="none" stroke="#a8502e" stroke-width="1.2"/></g><g transform="translate(-24,-30)"><path d="M-5,0 V-8 H5 V0Z" fill="#c9b48a" stroke-width="1.1"/><path d="M0,-8 L4,-16" fill="none" stroke="#8a5a34" stroke-width="1.6"/></g>`+
  act(-6,-24,1,{view:'front',pose:'reach',hat:HAT_SOFT,hair:'#e8e4dc',beard:true,shirt:'#5a4a3a',mood:2},'work')+`<rect x="-36" y="-24" width="72" height="6" fill="#8a5a34"/>`,'老師傅：這本書比我爺爺還老，要輕輕地補⋯');
 grp(1460,1580,50,80,'carry19',act(0,0,1,{...scribeO({hair:'#4a3424'}),view:'side',pose:'up2',mood:1,extra:`<g transform="translate(6,-44)"><rect x="-10" y="-8" width="20" height="8" fill="#f4ecd6" stroke-width="1.1"/><rect x="-9" y="-14" width="18" height="6" fill="#fbf8f0" stroke-width="1.1"/></g>`},'step'),'見習生：新的羊皮紙送到了！師傅說要先把手洗乾淨才能碰。');
 /* ---- 南：借還書櫃台、說故事角落、推書車、找書的人、書僮 ---- */
 grp(820,1800,210,90,'circ19',act(-50,-30,1,{...libO(),view:'front',pose:'reach',mood:1},'nod')+act(30,-30,1,{...libO({hair:'#c9853a',hs:2}),view:'front',pose:'hold',mood:2},'nod')+
  `<rect x="-100" y="-50" width="200" height="12" rx="2" fill="#a8703f"/><rect x="-96" y="-38" width="192" height="38" fill="#8a5a34"/><path d="M-86,-32 H86 V-8 H-86Z" fill="none" stroke="#6a4228" stroke-width="2.4"/>`+
  `<g transform="translate(-10,-50)"><rect x="-12" y="-6" width="24" height="6" fill="#2f4f8a" stroke-width="1"/><rect x="-10" y="-12" width="20" height="6" fill="#a8502e" stroke-width="1"/></g><g transform="translate(66,-50)"><path d="M-12,0 L-10,-5 H10 L12,0Z" fill="#f4ecd6"/></g>`+
  act(118,6,-1,{view:'side',pose:'hold',hat:HAT_BERET,shirt:'#c99a3a',mood:3,extra:`<g transform="translate(12,-22)"><rect x="-6" y="-5" width="12" height="10" fill="#6a3f8a" stroke-width="1"/></g>`},'lean'),'館員：這本書已經逾期三個月囉⋯——貴族：我、我是看太慢了！');
 grp(1650,1830,220,110,'story19',`<ellipse cx="10" cy="-6" rx="100" ry="26" fill="#c4704a" opacity=".85"/><ellipse cx="10" cy="-6" rx="86" ry="20" fill="none" stroke="#f0c94a" stroke-width="2" opacity=".8"/>`+
  `<g transform="translate(70,-20)"><path d="M-24,0 V-32 Q-24,-48 0,-48 Q24,-48 24,-32 V0Z" fill="#2f4f8a"/>${act(0,-6,-1,{view:'fq',pose:'hold',hat:-1,hs:0,hair:'#e8e4dc',beard:true,shirt:'#8e2630',mood:1,extra:`<g transform="translate(-10,-18)">${openB(0,0,'#c99a3a')}</g>`},'nod')}<rect x="-20" y="-16" width="40" height="16" rx="3" fill="#2f4f8a"/></g>`+
  [[-70,-2,'back'],[-40,-14,'bq'],[-10,0,'back'],[20,-12,'bq']].map(([x,y,v],i)=>T(x,y,.78,kid({view:v,pose:'crouch',hat:-1,mood:1,shirt:pk(['#d8413a','#f5d34a','#4f86c4','#6fc06a'])}))).join(''),'老爺爺：⋯於是勇敢的騎士打開了城堡的大門——小朋友：然後呢然後呢？');
 grp(1150,1760,110,70,'push19',act(-30,0,1,{...libO(),view:'side',pose:'reach',mood:1},'step')+T(26,0,1,bcart()),'館員：還回來的書要一本一本放回原位⋯這本是放哪裡的來著？');
 grp(1430,1980,50,80,'seek19',act(0,0,-1,{view:'fq',pose:'hold',hat:HAT_TIARA,hs:3,shirt:'#7aa8c4',mood:3,extra:gown('#7aa8c4')+`<g transform="translate(12,-24)"><rect x="-5" y="-8" width="10" height="13" fill="#fbf6ea" stroke-width="1"/><path d="M-3,-4 h6 M-3,-1 h6 M-3,2 h4" fill="none" stroke="#8a7f68" stroke-width=".8"/></g>`},'nod'),'小姐：「龍」的書應該在哪一排？我已經繞了三圈了⋯');
 grp(1320,2070,40,80,'page19',act(0,0,-1,{view:'fq',pose:'hold',hat:-1,hs:1,hair:'#4a3424',shirt:'#3f6a4a',top:'long',bottom:'pants',pants:'#3a3a40',mood:1,s:.9,extra:`<g transform="translate(13,-20)"><circle cx="0" cy="0" r="4" fill="none" stroke="#c99a3a" stroke-width="1.6"/><path d="M2,3 V9 H4" fill="none" stroke="#c99a3a" stroke-width="1.6"/></g>`},'nod'),'書僮：圖書館到了！要小聲喔，不然館長會「噓」你。');
 grp(960,2030,70,80,'pair19',act(-14,0,1,{view:'side',pose:'hold',hat:HAT_SOFT,shirt:'#4a3a6a',mood:2,extra:`<g transform="translate(12,-22)"><rect x="-6" y="-5" width="12" height="10" fill="#8e2630" stroke-width="1"/></g>`},'nod')+act(16,0,-1,{view:'side',pose:'stand',hat:-1,shirt:'#1f5f6a',mood:1},'lean'),'學者：這本書的結局我不能說⋯——朋友：拜託告訴我嘛！');
 /* 2026-11-21 使用者：人、桌椅、佈景再多 0.5 倍 → 多幾組人、小圓桌、植物、矮書架 */
 grp(1010,720,50,90,'step19',`<path d="M-14,0 L-6,-40 M10,0 L4,-40 M-12,-12 H8 M-9,-26 H6" fill="none" stroke="${OL}" stroke-width="4"/><path d="M-14,0 L-6,-40 M10,0 L4,-40 M-12,-12 H8 M-9,-26 H6" fill="none" stroke="#a8703f" stroke-width="2.4"/>`+act(-2,-40,1,{view:'back',pose:'up2',hat:-1,hs:0,hair:'#c9c4bc',shirt:'#3f6a4a',mood:1},'step'),'老館員：（站在小梯子上）把這本放回最上層⋯好，不要往下看、不要往下看。');
 grp(1470,714,60,80,'pull19',T(-12,0,.82,kid({view:'bq',pose:'up',hat:-1,mood:1,shirt:'#f5d34a'}))+act(18,0,-1,{view:'side',pose:'hold',hat:HAT_TIARA,hs:2,shirt:'#7aa8c4',mood:2,extra:gown('#7aa8c4')},'nod'),'媽媽：只能借三本喔。——小朋友：那這本、這本、這本、還有這本⋯');
 grp(1120,1180,50,80,'look19',act(0,0,1,{view:'bq',pose:'up',hat:HAT_SOFT,shirt:'#1f5f6a',mood:1,extra:robe('#1f5f6a')},'nod'),'學者：（抬頭看螺旋梯）上面那層好像有一本我找了十年的書⋯');
 grp(1390,1180,60,80,'chat19',act(-14,0,1,{view:'side',pose:'hold',hat:-1,hs:1,shirt:'#c99a3a',mood:1},'nod')+act(16,0,-1,{view:'side',pose:'stand',hat:HAT_BERET,shirt:'#2f4f8a',mood:3},'lean'),'學生：（小聲）你也在找「龍」的書？——另一個：剛剛被一位小姐借走了！');
 grp(1700,1220,80,80,'lect19',lectern({hair:'#2f2f3a',mood:1}),'抄寫員：畫插圖最好玩了，這條龍的鱗片我要畫一百片！');
 grp(1840,1430,50,80,'ink19g',act(0,0,-1,{...scribeO({hair:'#c9853a'}),view:'fq',pose:'hold',mood:2},'nod'),'見習生：師傅說墨水要慢慢磨，磨太快字會變醜⋯');
 grp(1360,1830,130,80,'rtbl19',roundTbl({hat:-1,hs:2,shirt:'#b8667a',an:'nod'},{hat:HAT_SOFT,shirt:'#3a2e4a'},`<g transform="translate(-6,-34)">${openB(0,0,'#3f6a4a')}</g>`),'貴婦人：這本詩集借你看——學者：謝謝，我會小心不折到角。');
 grp(700,2010,130,80,'rtbl19',roundTbl({hat:-1,shirt:'#3f6a4a',an:'nod'},{hat:HAT_TIARA,hs:4,shirt:'#d98a9a'},`<g transform="translate(-4,-34)"><rect x="-7" y="-5" width="14" height="5" fill="#2f4f8a" stroke-width="1"/></g>`),'小朋友：（一起看故事書）然後公主自己打敗了龍！——另一個：好帥！');
 grp(1540,2050,130,80,'rtbl19',roundTbl({hat:HAT_BERET,shirt:'#a8502e',an:'nod'},{hat:-1,hs:0,hair:'#e8e4dc',beard:true,shirt:'#4a3a6a'}),'老爺爺：年輕人，這本書我年輕時也讀過喔。——貴族：真的嗎？結局是什麼？——老爺爺：忘了。');
 grp(1100,1960,60,80,'walk19',act(-12,0,1,{...maidO(),view:'side',pose:'reach',mood:1,extra:`<g transform="translate(14,-26)"><rect x="-8" y="-4" width="16" height="4" fill="#8e2630" stroke-width="1"/><rect x="-7" y="-8" width="14" height="4" fill="#2f4f8a" stroke-width="1"/></g>`},'step'),'女僕：館長的下午茶，還有⋯三本要還的書。');
 [[1040,1700],[1470,1720],[1840,1240],[660,1240]].forEach(([x,y])=>add(x,y,40,62,'plant19',plant(),{sh:.7}));
 [[1100,1380],[1410,1420]].forEach(([x,y])=>add(x,y,88,118,'shelfS19',shelfS(),{sh:.8}));
 [[1300,760],[1180,1800],[640,1120],[1880,1990],[1260,2010]].forEach(([x,y])=>add(x,y,28,24,'stool19',stool(),{sh:.6}));
 /* 角落的植物和矮書架 */
 [[660,900],[1840,900],[650,1540],[1840,1680]].forEach(([x,y])=>add(x,y,40,62,'plant19',plant(),{sh:.7}));
 [[1100,960],[1400,960],[1100,1600],[1600,2100]].forEach(([x,y])=>add(x,y,88,118,'shelfS19',shelfS(),{sh:.8}));
 /* 2026-11-21 使用者：北牆和兩邊的書架上也放一些顏色相近、要找的物件 → 北牆書架、迴廊拱門書架放看不見的定位點（SPOTS 用），不佔位置 */
 for(let x=690;x<=1830;x+=152){const sp=add(x,WY,140,150,'wallS19','<g></g>',{mark:false});sp.y=WY}
 for(let cx=614;cx<=1854;cx+=124){const sp=add(cx,GAL,80,150,'galS19','<g></g>',{mark:false});sp.y=GAL}
 /* 不能放東西的地方：北牆、迴廊、故事角色的固定位置、螺旋梯周圍 */
 mk(600,0,1900,700);
 mk(STAIR.x-90,STAIR.y-400,STAIR.x+90,STAIR.y+12);   /* 螺旋梯後面（頂端平台擋住的地方）不放東西，不然人會像站在平台上 */
 Object.values(SPOT).forEach(([x,y])=>mk(x-44,y-100,x+44,y+8));
}
function scatterAll(){
 const S=H.dbg.storySp();if(S){moveSp(S.giver,SPOT.giver);moveSp(S.target,SPOT.target);moveSp(S.helper,SPOT.helper)}
 scatter('north19',POOL.north19,2100,18);scatter('west19',POOL.west19,3600,39);scatter('center19',POOL.center19,2700,24);   /* 2026-11-21 使用者：佈景再多 0.5 倍 */
 scatter('east19',POOL.east19,3600,39);scatter('south19',POOL.south19,3900,45);scatter('all19',POOL.decor19,3900,36);
}
const CELL=H.CELL,occ=H.occ,GC=H.GC,GR=H.GR;
function clearCells(x,y,w,h){const a=Math.floor((x-w*.3)/CELL),c=Math.floor((x+w*.3)/CELL),b=Math.floor((y-h*.5)/CELL),d=Math.floor(y/CELL);for(let j=Math.max(0,b);j<=Math.min(GR-1,d);j++)for(let i=Math.max(0,a);i<=Math.min(GC-1,c);i++)occ[j*GC+i]=0}
function moveSp(sp,p){if(!sp||!p)return;clearCells(sp.x,sp.y,sp.w,sp.h);const[x,y]=p;sp.svg=sp.svg.replace(/translate\([^)]*\)/,`translate(${f(x)},${f(y)})`).replace(/data-x="[^"]*" data-y="[^"]*"/,`data-x="${f(x)}" data-y="${f(y)}"`);sp.x=x;sp.y=y}
SCENE_IMPL[N]={ground,structures,scatter:scatterAll};
Object.assign(VPLAN,{north19:{walker:6,chat:5,reading:3},west19:{walker:5,chat:3,reading:3},center19:{walker:6,chat:3,reading:2},   /* 2026-11-21 使用者：人再多 0.5 倍 */
 east19:{walker:5,chat:3,reading:2},south19:{walker:9,chat:6,handInHand:3,reading:3}});
HOSTK.add('bookstack19');HOSTK.add('plant19');HOSTK.add('shelfS19');HOSTK.add('bcart19');HOSTK.add('chest19');HOSTK.add('rdTable19');HOSTK.add('rtbl19');
Object.assign(HOSTN,{bookstack19:'書堆',plant19:'盆栽',shelfS19:'矮書架',bcart19:'推書車',chest19:'木箱',rdTable19:'閱覽長桌',rtbl19:'小圓桌'});
/* 物件的合理位置：每種最多一個台子（桌面）選項，其他放在書堆、書架、植物、人群旁；2026-11-21 使用者：北牆書架、迴廊書架、矮書架的層板上也放顏色相近的（古書、墨水、書籤、印章、貓頭鷹、積木） */
const onTop=(dy,w=80)=>sp=>[Math.random()*w-w/2,dy];
/* 放在書架的某一層上（物件底部貼著層板）：北牆一樓大書架 3 層（層板 y 534／586／637）、迴廊拱門書架 2 層（y 367／417）、矮書架 4 層 */
const pick=a=>a[Math.floor(Math.random()*a.length)];
const onWall=sp=>[Math.random()*110-55,pick([534,586,637])-WY-11];
const onGal=sp=>[Math.random()*44-22,pick([367,417])-GAL-11];
const onShelfS=sp=>[Math.random()*50-25,pick([-86,-58,-31])-9];
H.SPOTS[N]={
 gkey17:[['desk19',.05,.6],['circ19',.05,.6],['chest19',.06,.7]],
 tome19:[['shelfS19',onTop(-118,50)],['wallS19',onWall],['galS19',onGal],['shelfS19',onShelfS],['armch19',.05,.6]],
 quill19:[['lect19',.04,.6],['bind19',.04,.6],['bookstack19',.05,-.7]],
 ink19:[['repair19',onTop(-34,50)],['galS19',onGal],['lect19',.04,-.6],['circ19',.05,-.6]],
 glass19:[['rdTable19',onTop(-36,200)],['story19',.05,.55],['bookstack19',.05,.7]],
 lens19:[['repair19',.05,.6],['shelfS19',.05,.6],['bookstack19',.05,-.7]],
 globe19:[['desk19',onTop(-60,120)],['shelfS19',.05,-.6],['plant19',.05,.7]],
 bmark19:[['wallS19',onWall],['shelfS19',onShelfS],['rtbl19',.05,-.6],['rdTable19',.05,.55],['story19',.05,-.55]],
 wax19:[['bind19',onTop(-36,60)],['wallS19',onWall],['circ19',.05,.6],['desk19',.05,-.6]],
 owl19:[['shelfS19',.05,.6],['galS19',onGal],['shelfS19',onShelfS],['stair19',.03,.55],['plant19',.05,-.7]],
 abc19:[['story19',.05,.55],['wallS19',onWall],['plant19',.05,.7]],
 watch19:[['chest19',.06,.7],['rtbl19',.05,.6],['circ19',.05,.6],['armch19',.05,-.6]]};
/* 2026-11-23c 使用者重選的干擾物（同一個名稱在第 17～20 關都一樣，最後載入的檔案也會設成同一張圖） */
Object.assign(DECOY,{ring17:"<g transform=\"rotate(-40)\"><path d=\"M-2.4,-14 V16 L0,22 L2.4,16 V-14Z\" fill=\"#3d4248\"/><rect x=\"-7\" y=\"-19\" width=\"14\" height=\"5\" rx=\"1.5\" fill=\"#3d4248\"/></g>",twig19:"<g transform=\"rotate(30)\"><path d=\"M0,-20 V10\" fill=\"none\" stroke=\"#2b2420\" stroke-width=\"5.8\" stroke-linecap=\"round\"/><path d=\"M0,-20 V10\" fill=\"none\" stroke=\"#a8703f\" stroke-width=\"3.4\" stroke-linecap=\"round\"/><path d=\"M-3,10 Q-4,18 0,24 Q4,18 3,10Z\" fill=\"#fbf9f3\"/></g>",tie19:"<circle cx=\"0\" cy=\"-14\" r=\"4\" fill=\"none\" stroke=\"#2b2420\" stroke-width=\"3.6\"/><circle cx=\"0\" cy=\"-14\" r=\"4\" fill=\"none\" stroke=\"#e0b44a\" stroke-width=\"2\"/><path d=\"M-4,-8 H4 L5,6 H-5Z\" fill=\"#8e2630\"/><path d=\"M-4,6 L-6,18 M-1,6 V18 M2,6 V18 M5,6 L7,18\" fill=\"none\" stroke=\"#8e2630\" stroke-width=\"1.6\"/>",top19:"<circle cx=\"0\" cy=\"-8\" r=\"8\" fill=\"#a8703f\"/><rect x=\"-3\" y=\"0\" width=\"6\" height=\"8\" fill=\"#8a5a32\"/><rect x=\"-10\" y=\"8\" width=\"20\" height=\"6\" rx=\"2\" fill=\"#8a5a32\"/><path d=\"M-4,-12 q2,-2 4,-2\" fill=\"none\" stroke=\"#c99a5b\" stroke-width=\"1.6\"/>",pine19:"<ellipse cx=\"0\" cy=\"-2\" rx=\"11\" ry=\"14\" fill=\"#a8703f\"/><path d=\"M-7,-8 Q0,-4 7,-8 M-9,2 Q0,6 9,2\" fill=\"none\" stroke=\"#7a4a2a\" stroke-width=\"1.2\"/><ellipse cx=\"0\" cy=\"13\" rx=\"8\" ry=\"2.6\" fill=\"#7a4a2a\"/>",sugar19:"<rect x=\"-16\" y=\"-2\" width=\"14\" height=\"14\" fill=\"#3f6f9a\"/><rect x=\"0\" y=\"-2\" width=\"14\" height=\"14\" fill=\"#e0b44a\"/><rect x=\"-8\" y=\"-16\" width=\"14\" height=\"14\" fill=\"#c4473c\"/>",cookie19:"<circle cx=\"-2\" cy=\"-4\" r=\"10\" fill=\"#dff1fa\"/><circle cx=\"-2\" cy=\"-4\" r=\"10\" fill=\"none\" stroke=\"#2b2420\" stroke-width=\"4.4\"/><circle cx=\"-2\" cy=\"-4\" r=\"10\" fill=\"none\" stroke=\"#e8c04a\" stroke-width=\"2.6\"/><path d=\"M-6,-9 Q-8,-4 -6,0\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2\"/><path d=\"M6,3 Q10,12 4,18 Q0,20 -4,16\" fill=\"none\" stroke=\"#e8c04a\" stroke-width=\"1.6\" stroke-dasharray=\"2 1.6\"/>"});
H.BLEND[N]={gkey17:['ring17','bookstack19'],tome19:['jbox19','bookstack19'],quill19:['twig19','bookstack19'],ink19:['jam19','bookstack19'],glass19:['earr19','bookstack19'],
 lens19:['pan19','stool19'],globe19:['yarn19','plant19'],bmark19:['tie19','bookstack19'],wax19:['top19','chest19'],owl19:['pine19','plant19'],
 abc19:['sugar19','bookstack19'],watch19:['cookie19','stool19']};

/* ================= 8. 連環小故事：爬上書架的館貓 ================= */
/* 黑貓逗點：紅領結、金色小鈴鐺（使用者選 4D、取名逗點） */
const cat=()=>{const body='#2e2c34';let s=`<path d="M14,-4 Q32,-8 30,-26 Q28,-36 22,-34" fill="none" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><path d="M14,-4 Q32,-8 30,-26 Q28,-36 22,-34" fill="none" stroke="${body}" stroke-width="4.4" stroke-linecap="round"/>`;
 s+=`<path d="M-16,0 Q-20,-26 -8,-34 H8 Q20,-26 16,0Z" fill="${body}"/><path d="M-10,0 V-8 M10,0 V-8" fill="none" stroke="#5a5862" stroke-width="1.4"/>`;
 s+=`<path d="M-15,-50 L-14,-64 L-4,-55Z M15,-50 L14,-64 L4,-55Z" fill="${body}"/><path d="M-13,-53 L-12.6,-60 L-8,-56Z M13,-53 L12.6,-60 L8,-56Z" fill="#a87a8a" stroke="none"/><ellipse cx="0" cy="-46" rx="16" ry="13" fill="${body}"/>`;
 s+=`<ellipse cx="-6" cy="-47" rx="2.6" ry="3.2" fill="#f5d34a" stroke-width="1"/><ellipse cx="6" cy="-47" rx="2.6" ry="3.2" fill="#f5d34a" stroke-width="1"/><path d="M-6,-49 v4 M6,-49 v4" fill="none" stroke-width="1.6"/>`;
 s+=`<path d="M-1.6,-42 h3.2 l-1.6,2Z" fill="#f08a9a" stroke-width=".8"/><path d="M0,-40 q-2,2.4 -4,1 M0,-40 q2,2.4 4,1" fill="none" stroke="#8a8892" stroke-width="1"/><path d="M-9,-41 h-9 M-9,-39 l-8,2 M9,-41 h9 M9,-39 l8,2" fill="none" stroke="#8a8892" stroke-width=".8"/>`;
 s+=`<path d="M-11,-33 Q0,-29 11,-33" fill="none" stroke="#d8413a" stroke-width="3.4"/><path d="M0,-31 l-7,-5 l0,9Z M0,-31 l7,-5 l0,9Z" fill="#d8413a" stroke-width="1.2"/><circle cx="0" cy="-26" r="3" fill="#f0c94a" stroke-width="1.2"/>`;
 return s};
/* 東邊最高的書架：貓坐在頂上，前面一疊書擋住牠的下半身（露出頭、領結、鈴鐺） */
const catShelf=()=>sh(48,6)+shelf(-46,-230,92,230,6,'#7a4e2a',911)+`<rect x="-50" y="-234" width="100" height="8" rx="2" fill="#a8703f"/>`+T(-8,-234,.9,cat())+
 `<g transform="translate(14,-234)">${['#2f4f8a','#8e2630','#3f6a4a'].map((c,i)=>`<rect x="${-22+i*2}" y="${-8*(i+1)}" width="${30-i*3}" height="8" rx="1" fill="${c}" stroke-width="1.2"/>`).join('')}</g>`;
const ladder=`<path d="M6,4 L22,-104 M18,4 L34,-104" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M6,4 L22,-104 M18,4 L34,-104" fill="none" stroke="#a8703f" stroke-width="2.6"/>`+
 Array.from({length:9},(_,i)=>{const y=-6-i*12,x=7+(-y)*.148;return `<path d="M${f(x)},${y} H${f(x+12)}" fill="none" stroke="#8a5a34" stroke-width="2.4"/>`}).join('');
const dish=`<g transform="translate(13,-22)"><ellipse cx="0" cy="0" rx="7" ry="2.6" fill="#fbfaf6" stroke-width="1.1"/><path d="M-4,-1 q4,-3 8,0" fill="#c9965a" stroke="none"/></g>`;
STORIES[N]={title:'爬上書架的館貓',who:'小學徒',
 giver:()=>act(0,0,1,{...libO({hair:'#8a5a2a',hs:1}),view:'fq',pose:'reach',mood:2,s:.88,skin:'#f2d2b4',extra:vest+dish}),
 target:()=>catShelf(),tw:100,th:300,
 helper:()=>act(0,0,1,{...libO({hair:'#4a3424',hs:0}),view:'fq',pose:'hold',mood:1,skin:'#e8c4a0',extra:vest+ladder}),hw:60,hh:110,
 ask:'小學徒：館貓「逗點」不見了！牠是一隻黑貓，脖子上繫著紅領結和金色小鈴鐺，你有看到嗎？',
 need:'逗點爬到東邊最高的書架頂上，躲在一疊書後面，喵喵叫卻下不來⋯聽說館員那裡有一座好高的木梯子！',
 got:'館員：書架頂上的貓？我把梯子扛過去就好！',
 ok:'逗點順著梯子慢慢爬下來，叮鈴叮鈴——紅領結和小鈴鐺都還在。快帶回去給小學徒！'};

/* ================= 9. 冒險地圖與過場 ================= */
HERE[N]=[100,170];   /* 冒險地圖不另外放節點（隸屬奇幻小鎮），卡片用 levels.js 的 map */
/* 過場：跟著書僮走上塔樓的石頭旋轉梯（背後視角往上爬：石階往下捲），最上面一扇木門打開，陽光照進來、門慢慢放大 */
RIDES.stairs19={text:'跟著書僮走上塔樓的石頭旋轉梯⋯',every:420,tick:k=>tone(k%2?440:392,.07,'triangle',.03),
 svg:()=>{let s=`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><style>.st19{animation:st19 .8s linear infinite}@keyframes st19{to{transform:translateY(64px)}}`+
   `.dr19{transform-origin:200px 150px;animation:dr19 4.3s ease-in forwards}@keyframes dr19{0%{transform:scale(.7)}60%{transform:scale(1)}100%{transform:scale(3.4)}}`+
   `.lt19{animation:lt19 4.3s ease-in forwards}@keyframes lt19{0%,40%{opacity:0}100%{opacity:1}}.dl19{transform-origin:156px 150px;animation:dl19 4.3s ease-in forwards}@keyframes dl19{0%,45%{transform:scaleX(1)}80%,100%{transform:scaleX(.15)}}`+
   `.dq19{transform-origin:244px 150px;animation:dq19 4.3s ease-in forwards}@keyframes dq19{0%,45%{transform:scaleX(1)}80%,100%{transform:scaleX(.15)}}.wk19{animation:wk19 .4s ease-in-out infinite alternate}@keyframes wk19{to{transform:translateY(-4px)}}</style>`;
  s+=`<g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect width="400" height="600" fill="#5a4a3c" stroke="none"/>`;
  /* 塔樓裡的石牆（兩側往中間收，像在旋轉梯的井裡） */
  s+=`<path d="M0,0 H90 Q60,300 120,600 H0Z" fill="#7a6a58"/><path d="M400,0 H310 Q340,300 280,600 H400Z" fill="#6a5a4a"/>`;
  let br='';for(let y=20;y<600;y+=40)br+=`M0,${y} H${f(90-(y/600)*-30)} M400,${y} H${f(310+(y/600)*-30)} `;s+=`<path d="${br}" fill="none" stroke="#5a4a3c" stroke-width="2"/>`;
  s+=`<path d="M40,120 V80 Q50,66 60,80 V120Z" fill="#bfe0f4"/><path d="M40,120 V80 Q50,66 60,80 V120" fill="none" stroke-width="3"/>`;
  /* 最上面的木門（打開時兩扇往外收，後面是陽光） */
  s+=`<g class="dr19"><rect x="146" y="82" width="108" height="150" fill="#3a2e28"/><rect x="152" y="90" width="96" height="142" fill="#fff4c8" class="lt19"/>`+
   `<g class="dl19"><path d="M152,232 V112 Q152,90 200,86 V232Z" fill="#8a5a34"/><path d="M164,120 V220 M176,110 V222 M188,100 V224" fill="none" stroke="#6a4228" stroke-width="2"/></g>`+
   `<g class="dq19"><path d="M248,232 V112 Q248,90 200,86 V232Z" fill="#8a5a34"/><path d="M236,120 V220 M224,110 V222 M212,100 V224" fill="none" stroke="#6a4228" stroke-width="2"/><circle cx="210" cy="170" r="4" fill="#e0b44a"/></g>`+
   `<path d="M146,232 V108 Q146,76 200,72 Q254,76 254,108 V232" fill="none" stroke="#3a2e28" stroke-width="8"/></g>`;
  /* 一階一階的石頭台階（往下捲＝往上爬） */
  s+=`<defs><clipPath id="stc19"><rect x="-200" y="232" width="800" height="600"/></clipPath></defs><g clip-path="url(#stc19)"><g class="st19">${Array.from({length:8},(_,i)=>{const y=232+i*64-64,w=110+i*34;return `<path d="M${200-w/2},${y} H${200+w/2} L${200+w/2+10},${y+64} H${200-w/2-10}Z" fill="${i%2?'#a89a82':'#b8aa90'}"/><path d="M${200-w/2},${y} H${200+w/2} V${y+12} H${200-w/2}Z" fill="#cfc2a6"/>`}).join('')}</g></g>`;
  /* 書僮和主角背影往上爬 */
  s+=`<g transform="translate(170,430) scale(1.1)"><g class="wk19">${kid({view:'back',pose:'walk',hat:-1,hs:1,hair:'#4a3424',shirt:'#3f6a4a',top:'long',bottom:'pants',pants:'#3a3a40'})}</g></g>`;
  s+=`<g transform="translate(236,560) scale(1.35)"><g class="wk19" style="animation-delay:-.2s">${kid({view:'back',pose:'walk',hat:-1,hs:0,top:'tee',bottom:'pants'})}</g></g>`;
  return s+`</g></svg>`}};

/* ================= 10. 場景彩蛋：點螺旋梯 → 小朋友溜扶手；點窗戶光柱 → 灰塵閃閃；點館長的桌鈴 → 全場「噓——」 ================= */
const domOf=sp=>document.querySelector(`#bg [data-n="${sp.n}"]`);
let busy=0;
H.TAPHOOKS[N]=(x,y)=>{const sps=H.sprites||[];
 if(Math.abs(x-(DESK.x+60))<20&&y>DESK.y-84&&y<DESK.y-44){H.burst(DESK.x+60,DESK.y-70);tone(1568,.25,'sine',.05);
  setTimeout(()=>{H.toast('🔔 叮！——全場的人一起轉過頭來：「噓——！」',2400);tone(220,.4,'sine',.02)},350);return true}
 if(Math.abs(x-STAIR.x)<SPIR.R+14&&y>STAIR.y-SPIR.hh*SPIR.n-70&&y<STAIR.y+8){const sp=sps.find(s=>s.kind==='stair19'),el=sp&&domOf(sp);
  if(el&&!busy){const k=el.querySelector('.sld19');if(k){busy=1;k.setAttribute('opacity','1');k.classList.remove('sl19');void k.getBBox();k.classList.add('sl19');setTimeout(()=>{k.setAttribute('opacity','0');k.classList.remove('sl19');busy=0},2500)}}
  H.toast('咻——！有個小朋友從扶手溜下來了！館長：「不可以溜扶手！」',2400);[784,659,523,392].forEach((q,i)=>tone(q,.12,'triangle',.04,i*.12));return true}
 for(const [wx] of BEAM)if(Math.abs(x-wx)<56&&y>60&&y<270){H.burst(wx,170);H.burst(wx+120,520);H.toast('☀️ 陽光裡的灰塵閃閃發亮，像小星星在跳舞。',2200);[1047,1319,1568].forEach((q,i)=>tone(q,.12,'sine',.03,i*.1));return true}
 return false};
})();

/* ================= 入口：第 18 關宮廷院，東北塔樓小側門旁的書僮 =================
   levels.js 這一關有 find:{after:18,from:18,hint:[…]}：發現宮廷院、而且宮廷院拿到 2 顆星之後，塔樓側門左邊出現書僮（頭上有「…」）；
   點書僮 → 「要上去塔樓裡的圖書館看看嗎？」→ 出發才算發現。這個檔案在第 18 關載入時會一起載入（ensureFull）。
   書僮站在塔樓前面（第 18 關本來就把塔樓一帶標成不能擺東西：mk(TOW.x-90,620,1900,TOW.y+14)），所以宮廷院的其他東西位置不受影響。
   點塔樓側門本身（x 1852～1908）還是宮廷院原本的伏筆對話；書僮在門的左邊（x 1810～1850）。 */
(function(){
const H=window.TH;if(!H)return;const N=19;const {T,OL,act}=H;
const EX={x:1830,y:958};
(H.RESERVE[18]||(H.RESERVE[18]=[])).push([EX.x,EX.y,50,60]);
const keys=`<g transform="translate(13,-20)"><circle cx="0" cy="0" r="4" fill="none" stroke="#c99a3a" stroke-width="1.6"/><path d="M2,3 V9 H4 M-1,4 V10 H1" fill="none" stroke="#c99a3a" stroke-width="1.6"/></g>`;
const vest=`<path d="M-6,-17 L-2,-17 L0,-10 L2,-17 L6,-17 L7,-6 H-7Z" fill="#3f6a4a" stroke-width="1.1"/>`;
let bs=null;const page=()=>bs||(bs=act(0,0,1,{view:'fq',pose:'hold',hat:-1,hs:1,hair:'#4a3424',skin:'#f0cfae',shirt:'#f4ecd6',top:'long',bottom:'pants',pants:'#3a3a40',mood:1,extra:vest+keys}));
const svg=found=>T(0,0,.88,(found?'':`<g class="qbob">${H.bubble(14,-74,'dots').replace(/r="1\.7"/g,'r="1.75"')}</g>`)+page());
const pv=()=>`<svg viewBox="0 0 220 110" width="220" height="110" style="display:block"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect x="0" y="0" width="220" height="110" rx="10" fill="#e2d6ba" stroke="none"/>`+
 `<path d="M20,52 V20 Q20,6 34,6 Q48,6 48,20 V52Z M172,52 V20 Q172,6 186,6 Q200,6 200,20 V52Z" fill="#cfe6f2" stroke-width="1.4"/><path d="M34,6 V52 M186,6 V52" fill="none" stroke="#6a4228" stroke-width="2"/>`+
 `<path d="M48,24 L120,92 H160 L60,24Z M172,24 L210,92 H200 L184,24Z" fill="#fff6d0" opacity=".55" stroke="none"/>`+
 `<rect x="0" y="54" width="220" height="10" fill="#8a5a34" stroke-width="1.4"/><rect x="0" y="64" width="220" height="46" fill="#caa070" stroke="none"/>`+
 [70,84,98,112,126,140].map((x,i)=>`<rect x="${x}" y="${40-((i%3)*4)}" width="10" height="${14+(i%3)*4}" fill="${['#8e2630','#2f4f8a','#3f6a4a','#c99a3a','#6a3f8a','#a8502e'][i]}" stroke-width="1"/>`).join('')+
 `<g transform="translate(110,104)"><path d="M-6,0 V-40 H6 V0Z" fill="#8a5a34" stroke-width="1.4"/>${[0,1,2,3,4].map(i=>`<path d="M0,${-8*i-4} L${i%2?-26:26},${-8*i-8}" fill="none" stroke="#a8703f" stroke-width="4"/>`).join('')}<ellipse cx="0" cy="-44" rx="26" ry="7" fill="#c48a52" stroke-width="1.4"/></g>`+
 `<g transform="translate(190,106) scale(.55)">${page()}</g></g></svg>`;
H.EXITS[N]={x:EX.x,y:EX.y,w:44,h:64,svg,ask:{pv,title:'要上去塔樓裡的圖書館看看嗎？',
 text:'書僮：這座塔樓上面是城堡的圖書館，<br>午後的陽光最漂亮了。要我帶你上樓嗎？',again:'書僮：歡迎再來！<br>今天館長心情很好，比較不會「噓」人喔。',
 go:'📚 跟書僮上樓',wait:'之後再說',waitMsg:'書僮：好的，我會在側門這裡等你。'}};
})();
