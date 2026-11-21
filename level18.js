/* 奇幻小鎮大搜查．城堡系列〔宮廷院〕（找路發現的新關卡，編號 18 只是程式用）
   2026-11-21 使用者：城堡系列第二關改成「宮廷院」（原本第 18 關的奇幻晚宴改成第 20 關，level20.js）。
   從宮廷院可以分別到：北邊主殿大門 → 奇幻晚宴（20）；西邊綠籬拱門 → 樹籬迷宮（秘境，之後做）；東邊塔樓側門 → 圖書館（19，之後做）。
   入口：第 17 關城門廣場，主堡大門前的管家——程式在這個檔案最後面（H.RESERVE[17]／H.EXITS[18]）；第 17 關拿 2 星後才出現（find:{after:17,from:17}）。
   冒險地圖不另外放節點（隸屬奇幻小鎮，只出現在地圖下方的卡片）。
   氣氛：午後陽光花園。場景（上北下南）：北＝主殿正面（大門、石階、衛兵）→ 中＝十字步道、四塊幾何花壇、中央三層噴水池
   → 西＝樹籬雕塑（兔子、天鵝、圓球，使用者選 B 毛茸茸＋綠籬底座）、西北綠籬迷宮＋拱門（迷宮的伏筆）、槌球草坪
   → 東＝玫瑰拱門步道、白色圓頂涼亭下午茶（使用者選 A）、東北塔樓側門（圖書館的伏筆）→ 南＝兩側石柱迴廊＋回主堡的拱門。
   新名字都以 18c 結尾（18 結尾的名字是奇幻晚宴用的）。 */
(function(){
const H=window.TH;if(!H)return;
const N=18;
const {T,f,r,sr,pk,OL,kid,act,add,mark,scatter,KIND,POOL,VPLAN,REG,SCREG,LEVELS,ART,DECOY,
 SCENE_IMPL,RIDES,HERE,OUTFITS,STORIES,HOSTK,HOSTN,tone,typeOf,HATS,noteM}=H;
const mk=(x0,y0,x1,y1)=>mark((x0+x1)/2,y1,x1-x0,y1-y0,1);   /* 佔掉一個長方形（左上、右下） */
const sh=(rx,ry=6)=>`<ellipse cx="0" cy="3" rx="${rx}" ry="${ry}" fill="#000" opacity=".15" stroke="none"/>`;

/* ================= 1. 場景範圍、天空、場地邊緣 ================= */
H.SCENES[N]={x0:600,x1:1900,y1:2150,c:[1250,1700]};
H.TARGET[N]=330;
H.SKYC[N]='#d6ebf5';H.SKYY[N]=300;
H.EDGEM[N]='B';H.EDGED[N]='LRB';
H.EDGEDECO[N]=[['round',2],['bush',2.4],['flowersY',1]];
H.FRINGE[N]=[['bush',.8],['flowersY',.8],['pebbles',.6],['walker',.3]];
H.FRINGEX[N]=[[0,0,2600,760],[0,0,730,840],[0,1800,2600,2600]];   /* 迷宮 11-21m 往北移，迷宮上面不長東西 */   /* 2026-11-21 使用者：南邊迴廊不長草長花 */
if(H.EDGELAND)H.EDGELAND[N]=(x,y)=>(y>1640||(x<740&&y<850))?false:undefined;   /* 迴廊和南邊走道（場地外也是）不種樹、不長草叢 */
H.DENS[N]=1;

/* ================= 2. 當地人：宮廷貴族（華麗長袍、約 4 成禮服裙、小皇冠、羽毛扁帽）；園丁草帽綠圍裙；侍女白圍裙；衛兵 ================= */
const HAT_TIARA=HATS.push(()=>`<path d="M-10,-45 Q0,-49 10,-45 L7,-50 L3.4,-47.6 L0,-54 L-3.4,-47.6 L-7,-50Z" fill="#efe0a8" stroke-width="1.4"/><circle cx="0" cy="-49.4" r="1.6" fill="#d8413a" stroke="none"/>`)-1;
const HAT_BERET=HATS.push(()=>{const c=pk(['#8e2630','#2f4f8a','#3f6a4a','#6a3f8a','#2f2f3a']),fe=pk(['#f4ecd6','#e0b44a','#e8e0f0']);
 return `<path d="M-14,-42 Q-12,-55 2,-55 Q16,-54 17,-45 Q8,-44 -14,-42Z" fill="${c}"/><path d="M-14,-42 Q2,-46 17,-45" fill="none" stroke-width="1.6"/><path d="M6,-52 Q18,-68 25,-62 Q18,-58 9,-50Z" fill="${fe}" stroke-width="1.4"/>`})-1;
const HAT_STRAW=HATS.push(()=>`<ellipse cx="0" cy="-43" rx="21" ry="5" fill="#e8cf8a"/><path d="M-12,-44 Q-12,-57 0,-57 Q12,-57 12,-44Z" fill="#e8cf8a"/><path d="M-12,-46 Q0,-49 12,-46" fill="none" stroke="#5f8a4a" stroke-width="2.4"/><path d="M-16,-42 q4,1 8,0 M4,-42 q4,1 8,0" fill="none" stroke="#c9a85a" stroke-width="1"/>`)-1;
const HAT_CAP=HATS.push(()=>`<path d="M-13,-43 Q-12,-53 0,-53 Q12,-53 13,-43 Q7,-46 0,-45.4 Q-7,-46 -13,-43Z" fill="#fbf9f2"/><path d="M-13,-43 q3,2 6,0 q3,2 6,0 q3,2 6,0 q3,2 6,0" fill="none" stroke-width="1.2"/>`)-1;
const HAT_HELM=HATS.push(()=>`<ellipse cx="0" cy="-41" rx="19" ry="4.4" fill="#a3aab4"/><path d="M-13,-42 Q-14,-60 0,-60 Q14,-60 13,-42Z" fill="#c4cad2"/><path d="M0,-60 V-42" fill="none" stroke="#8a929c" stroke-width="1.6"/><path d="M-8,-52 Q-6,-57 -2,-58" fill="none" stroke="#fff" stroke-width="1.6"/>`)-1;
const RICH=['#8e2630','#2f4f8a','#3f6a4a','#6a3f8a','#c99a3a','#7a3a5a','#1f5f6a','#a8502e','#4a3a6a','#b8667a','#d98a9a','#7aa8c4'];
const gown=c=>`<path d="M-8.4,-8.4 L-12,.6 H12 L8.4,-8.4Z" fill="${c}"/><path d="M-10.6,-2.6 H10.6" fill="none" stroke="#e0b44a" stroke-width="1.6"/>`;
OUTFITS[N]=o=>{if(o.top)return o;
 o.skin=o.skin||pk(['#f2d2b4','#e8c4a0','#d9a578','#c98d5e','#f0cfae','#8f5a36']);
 o.top='long';o.bottom='pants';o.shirt=o.shirt||pk(RICH);o.pants=o.pants||pk(['#3a2e2a','#4a3f5a','#2f3a4a','#5a3a2a','#6a5a48']);
 if(o.hat==null&&!o.plain){const x=r();o.hat=x<.2?HAT_BERET:x<.32?HAT_TIARA:-1;if(o.hat===HAT_TIARA)o.hs=pk([2,4,3])}
 if(o.pose!=='sit'&&!o.extra&&r()<.4)o.extra=gown(o.shirt);
 return o};
const apronG=`<path d="M-7,-14 Q0,-11 7,-14 L8,-2 Q0,1 -8,-2Z" fill="#6f9a4a" stroke-width="1.1"/>`;
const gardener=(o={})=>Object.assign({top:'long',bottom:'pants',shirt:pk(['#e8dcc0','#c9b48a','#d9c4a0']),pants:'#5a4a3a',hat:HAT_STRAW,extra:apronG},o);
const maidO=(o={})=>Object.assign({top:'long',bottom:'pants',shirt:'#3f4a6a',pants:'#3f4a6a',hat:HAT_CAP,extra:`<path d="M-6,-14 Q0,-11 6,-14 L7,-4 Q0,-1 -7,-4Z" fill="#fbf9f2" stroke-width="1.1"/>`},o);
const spear=`<path d="M13,4 V-74" fill="none" stroke="${OL}" stroke-width="4.6" stroke-linecap="round"/><path d="M13,4 V-74" fill="none" stroke="#8a6a40" stroke-width="2.4" stroke-linecap="round"/><path d="M13,-73 l-4,-2 l4,-13 l4,13Z" fill="#c9ced6" stroke-width="1.4"/>`;
const tabard=`<path d="M-5,-17 H5 L6,-4 H-6Z" fill="#3f6f9a" stroke-width="1.1" opacity=".95"/><path d="M-2,-13 l2,-2 l2,2 l-2,2Z" fill="#e0b44a" stroke="none"/>`;
const guard=(dir,view='fq',anim=false)=>act(0,0,dir,{view,pose:'hold',hat:HAT_HELM,skin:pk(['#e8c4a0','#d9a578','#c98d5e']),hair:'#4a3424',shirt:'#3f6f9a',top:'long',bottom:'pants',pants:'#4a4f5c',mood:0,extra:tabard+spear},anim);

/* ================= 3. 物件與干擾物（原圖最長邊約 34，細長的約 40） ================= */
/* 老朋友（第 17 關）的圖：沒載入第 17 關時用這裡的後備 */
const ART17={
 scroll17:`<rect x="-17" y="-8" width="34" height="16" rx="7" fill="#f1e2bc"/><ellipse cx="-17" cy="0" rx="3.6" ry="8" fill="#e2cc98"/><ellipse cx="-17" cy="0" rx="1.4" ry="3.6" fill="none" stroke-width="1.1"/>`+
  `<path d="M-6,-8 V8 M-2,-8 V8" fill="none" stroke="#b8402e" stroke-width="2.4"/><path d="M-4,8 l-4,7 M-4,8 l3,7" fill="none" stroke="#b8402e" stroke-width="2"/><circle cx="-4" cy="2" r="5.4" fill="#c4473a" stroke-width="1.5"/>`};
const DECOY17={
 rpin17:`<g transform="rotate(-20)"><rect x="-11" y="-5.4" width="22" height="10.8" rx="5" fill="#e0b880"/><rect x="-19" y="-2.4" width="8" height="4.8" rx="2.2" fill="#a8703f"/><rect x="11" y="-2.4" width="8" height="4.8" rx="2.2" fill="#a8703f"/></g>`};
for(const k in ART17)if(!ART[k])ART[k]=ART17[k];
for(const k in DECOY17)if(!DECOY[k])DECOY[k]=DECOY17[k];
Object.assign(ART,{
 /* 修枝大剪刀：兩片長刀刃交叉，木頭把手 */
 shears18c:`<g transform="rotate(-35)"><path d="M-2,-3 L-21,-6 Q-24,-3 -21,-1 L-2,2Z" fill="#c9ced6"/><path d="M-2,3 L-21,6 Q-24,3 -21,1 L-2,-2Z" fill="#dfe3e8"/>`+
  `<path d="M1,-3 L18,-11" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><path d="M1,-3 L18,-11" fill="none" stroke="#a8703f" stroke-width="3.8" stroke-linecap="round"/>`+
  `<path d="M1,3 L18,11" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><path d="M1,3 L18,11" fill="none" stroke="#a8703f" stroke-width="3.8" stroke-linecap="round"/><circle cx="0" cy="0" r="3" fill="#5a5e6a" stroke-width="1.3"/><path d="M-18,-4.4 L-6,-2.6" fill="none" stroke="#fff" stroke-width="1.2"/></g>`,
 /* 銅澆花壺：圓肚、長壺嘴＋蓮蓬頭、提把 */
 can18c:`<path d="M-13,12 L-11,-6 Q0,-10 11,-6 L13,12 Q0,15 -13,12Z" fill="#c4783a"/><ellipse cx="0" cy="-6" rx="11" ry="3" fill="#a85f2a"/><path d="M-11,-6 Q-6,-20 0,-18 Q8,-18 10,-6" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M-11,-6 Q-6,-20 0,-18 Q8,-18 10,-6" fill="none" stroke="#c4783a" stroke-width="2.4"/>`+
  `<path d="M11,6 L24,-10" fill="none" stroke="${OL}" stroke-width="5.4" stroke-linecap="round"/><path d="M11,6 L24,-10" fill="none" stroke="#c4783a" stroke-width="3.2" stroke-linecap="round"/><ellipse cx="25" cy="-11" rx="5" ry="3" fill="#a85f2a" transform="rotate(-50 25 -11)"/>`+
  `<path d="M-7,0 Q0,-2 7,0" fill="none" stroke="#e8a060" stroke-width="1.6"/><path d="M-9,8 Q0,10 9,8" fill="none" stroke="#8a4a22" stroke-width="1.3"/>`,
 /* 珍珠項鍊：一圈白珍珠＋藍寶石墜子 */
 pearl18c:`${Array.from({length:16},(_,i)=>{const a=-.3+i/15*(Math.PI+.6),x=Math.cos(a)*14,y=-Math.sin(a)*10-2;return `<circle cx="${f(x)}" cy="${f(-y-6)}" r="2.9" fill="#fbfaf4" stroke-width="1.1"/>`}).join('')}`+
  `<path d="M0,6 l5,4 l-5,8 l-5,-8Z" fill="#4f86c4" stroke-width="1.3"/><path d="M-1.6,9 l2,-1" fill="none" stroke="#fff" stroke-width="1"/><circle cx="0" cy="5" r="2.2" fill="#e0b44a" stroke-width="1"/>`,
 /* 槌球木槌：長柄斜放、彩色條紋槌頭 */
 mallet18c:`<g transform="rotate(-40)"><path d="M0,-2 V30" fill="none" stroke="${OL}" stroke-width="5.4" stroke-linecap="round"/><path d="M0,-2 V30" fill="none" stroke="#c9a46a" stroke-width="3.2" stroke-linecap="round"/>`+
  `<rect x="-14" y="-9" width="28" height="11" rx="3" fill="#a8703f"/><path d="M-8,-9 V2 M8,-9 V2" fill="none" stroke="#d8413a" stroke-width="3"/><path d="M-4,-9 V2" fill="none" stroke="#4f86c4" stroke-width="2.4"/><path d="M-12,-6 H12" fill="none" stroke="#d6a868" stroke-width="1.2"/></g>`,
 /* 金色鳥籠：圓頂、直欄杆、頂環、裡面一隻小黃鳥 */
 cage18c:`<ellipse cx="0" cy="15" rx="13" ry="3.4" fill="#c99a2a"/><path d="M-12,14 V-2 Q-12,-17 0,-17 Q12,-17 12,-2 V14" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M-12,14 V-2 Q-12,-17 0,-17 Q12,-17 12,-2 V14" fill="none" stroke="#e0b44a" stroke-width="2.4"/>`+
  `<path d="M-6,14 V-4 Q-6,-15 0,-17 M6,14 V-4 Q6,-15 0,-17 M0,14 V-17" fill="none" stroke="#c99a2a" stroke-width="1.5"/><path d="M-12,3 H12" fill="none" stroke="#c99a2a" stroke-width="2"/>`+
  `<circle cx="0" cy="-20" r="3" fill="none" stroke="#e0b44a" stroke-width="2"/><ellipse cx="2" cy="7" rx="5" ry="4" fill="#f5d34a" stroke-width="1.2"/><circle cx="5" cy="3" r="3" fill="#f5d34a" stroke-width="1.2"/><path d="M8,3 l3,1 l-3,1Z" fill="#e8742a" stroke="none"/><path d="M-6,11 H8" fill="none" stroke="#8a6a3a" stroke-width="1.6"/>`,
 /* 玫瑰花束：三朵紅玫瑰、綠葉、白色包裝紙＋粉紅緞帶 */
 rose18c:`<path d="M-11,-6 L0,18 L11,-6Z" fill="#fbf6ea"/><path d="M-4,-6 L0,18 L5,-6" fill="none" stroke="#e8e0cc" stroke-width="1.2"/>`+
  `<path d="M-13,-8 Q-17,-16 -9,-14Z M13,-8 Q17,-16 9,-14Z M-2,-14 Q0,-22 3,-14Z" fill="#5f9a48" stroke-width="1.3"/>`+
  [[-7,-12],[6,-12],[0,-19]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5.4" fill="#d8413a" stroke-width="1.4"/><path d="M${x-2.6},${y} q2.6,-3.4 5.2,0 q-2.6,2.6 -2.6,-1.6" fill="none" stroke="#a82a2a" stroke-width="1.1"/>`).join('')+
  `<path d="M-4,8 Q0,5 4,8 L2,11 L0,9 L-2,11Z" fill="#f0a8b8" stroke-width="1.2"/>`,
 /* 骨瓷茶杯組：白杯藍花紋＋碟子 */
 cup18c:`<ellipse cx="0" cy="10" rx="17" ry="5" fill="#fbfaf6"/><ellipse cx="0" cy="9" rx="9" ry="2.4" fill="none" stroke="#c9d4e2" stroke-width="1.2"/>`+
  `<path d="M-11,-6 Q-11,8 0,9 Q11,8 11,-6Z" fill="#fbfaf6"/><ellipse cx="0" cy="-6" rx="11" ry="3" fill="#b8805a"/><path d="M11,-3 Q19,-3 17,4 Q15,7 9,5" fill="none" stroke="${OL}" stroke-width="3.4"/><path d="M11,-3 Q19,-3 17,4 Q15,7 9,5" fill="none" stroke="#fbfaf6" stroke-width="1.6"/>`+
  `<path d="M-7,0 q2,-3 4,0 q2,3 4,0 q2,-3 4,0" fill="none" stroke="#3f6fb0" stroke-width="1.4"/><circle cx="-2" cy="4" r="1" fill="#3f6fb0" stroke="none"/><circle cx="4" cy="4" r="1" fill="#3f6fb0" stroke="none"/>`,
 /* 日晷：石座上的圓盤，三角形晷針 */
 sundial18c:`<path d="M-7,16 L-5,0 H5 L7,16Z" fill="#d6cdb8"/><rect x="-10" y="14" width="20" height="4" rx="1" fill="#c4b9a0"/>`+
  `<ellipse cx="0" cy="-2" rx="16" ry="6" fill="#c4b9a0"/><ellipse cx="0" cy="-4" rx="16" ry="6" fill="#ece6d8"/>`+
  [0,1,2,3,4,5,6].map(i=>{const a=Math.PI*(.1+i*.133);return `<path d="M${f(Math.cos(a)*-11)},${f(-4-Math.sin(a)*-4)} l${f(Math.cos(a)*-3)},${f(Math.sin(a)*1.2)}" fill="none" stroke="#8a7f68" stroke-width="1.2"/>`}).join('')+
  `<path d="M-2,-4 L0,-18 L2,-4Z" fill="#c99a3a" stroke-width="1.3"/>`,
 /* 孔雀羽毛：細長羽桿、頂端的眼狀花紋 */
 feather18c:`<g transform="scale(.84) rotate(25)"><path d="M0,22 V-10" fill="none" stroke="${OL}" stroke-width="3"/><path d="M0,22 V-10" fill="none" stroke="#c9b48a" stroke-width="1.4"/>`+
  `<path d="M0,-2 Q-9,6 -6,16 M0,-2 Q9,6 6,16 M0,4 Q-7,10 -4,18 M0,4 Q7,10 4,18" fill="none" stroke="#6faa5a" stroke-width="1.3"/>`+
  `<ellipse cx="0" cy="-12" rx="9" ry="12" fill="#3f9a6a"/><ellipse cx="0" cy="-12" rx="6" ry="8" fill="#e0b44a" stroke="none"/><ellipse cx="0" cy="-11" rx="4" ry="5.4" fill="#2f7ab0" stroke="none"/><ellipse cx="0" cy="-10" rx="2.2" ry="3" fill="#1f2f6a" stroke="none"/></g>`,
 /* 蕾絲陽傘：打開的粉白傘面、波浪蕾絲邊、彎把手（2026-11-21 圖示上下被切到 → 整個縮 .82；孔雀羽毛也縮 .84） */
 parasol18c:`<g transform="scale(.82) translate(0,-.5)"><path d="M0,-4 V20 Q0,24 -4,24 Q-7,24 -7,21" fill="none" stroke="${OL}" stroke-width="4"/><path d="M0,-4 V20 Q0,24 -4,24 Q-7,24 -7,21" fill="none" stroke="#a8703f" stroke-width="2"/>`+
  `<path d="M-20,-2 Q-18,-20 0,-21 Q18,-20 20,-2Z" fill="#f6c8d4"/><path d="M-7,-2 Q-6,-17 0,-21 Q6,-17 7,-2" fill="none" stroke="#e8a0b4" stroke-width="1.4"/>`+
  `<path d="M-20,-2 q2.5,4 5,0 q2.5,4 5,0 q2.5,4 5,0 q2.5,4 5,0 q2.5,4 5,0 q2.5,4 5,0 q2.5,4 5,0 q2.5,4 5,0" fill="#fbf6ea" stroke-width="1.2"/><circle cx="0" cy="-22" r="1.8" fill="#e0b44a" stroke-width="1"/></g>`,
 /* 蝸牛：橘棕色螺旋殼、伸出觸角 */
 snail18c:`<path d="M-17,12 Q-18,6 -8,6 H12 Q20,6 20,-2 Q20,-6 17,-6 Q15,4 8,4" fill="#d9c08a"/>`+
  `<path d="M16,-4 L18,-15 M19,-4 L23,-14" fill="none" stroke="${OL}" stroke-width="2.4" stroke-linecap="round"/><circle cx="18" cy="-16" r="1.8" fill="#d9c08a" stroke-width="1.1"/><circle cx="23.4" cy="-15" r="1.8" fill="#d9c08a" stroke-width="1.1"/>`+
  `<path d="M-17,12 H14" fill="none"/><circle cx="-2" cy="-4" r="13" fill="#c4783a"/><path d="M-2,-4 m0,-2 a2,2 0 1,1 -2,2 a4.4,4.4 0 1,1 4.4,4.4 a7.4,7.4 0 1,1 -7.4,-7.4 a10.4,10.4 0 1,1 10.4,10.4" fill="none" stroke="#8a4a22" stroke-width="1.6"/><path d="M-9,-12 Q-4,-15 1,-14" fill="none" stroke="#f0b070" stroke-width="2"/>`});
Object.assign(DECOY,{
 tongs18c:`<g transform="rotate(-35)"><path d="M-20,-4 L14,-1 M-20,4 L14,1" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><path d="M-20,-4 L14,-1 M-20,4 L14,1" fill="none" stroke="#5a5e6a" stroke-width="3" stroke-linecap="round"/><circle cx="17" cy="0" r="4" fill="none" stroke="#5a5e6a" stroke-width="2.6"/></g>`,
 milk18c:`<path d="M-9,14 V-4 L-6,-10 V-14 H6 V-10 L9,-4 V14Z" fill="#c4783a"/><rect x="-8" y="-17" width="16" height="4" rx="1.4" fill="#a85f2a"/><path d="M-9,2 H9" fill="none" stroke="#8a4a22" stroke-width="1.6"/><path d="M-9,-2 Q-15,-2 -15,4 Q-15,8 -9,8" fill="none" stroke="${OL}" stroke-width="3"/>`,
 beads18c:`${Array.from({length:12},(_,i)=>{const a=-.2+i/11*(Math.PI+.4);return `<ellipse cx="${f(Math.cos(a)*14)}" cy="${f(Math.sin(a)*9-4)}" rx="3.6" ry="2.6" fill="#ece2c4" stroke-width="1.1" transform="rotate(${f(a*57)} ${f(Math.cos(a)*14)} ${f(Math.sin(a)*9-4)})"/>`}).join('')}`,
 ladle18c:`<g transform="rotate(-40)"><path d="M0,-6 V28" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><path d="M0,-6 V28" fill="none" stroke="#c9a46a" stroke-width="3" stroke-linecap="round"/><path d="M-9,-8 Q-9,-18 0,-18 Q9,-18 9,-8Z" fill="#b98a56"/></g>`,
 lamp18c:`<rect x="-9" y="-8" width="18" height="20" rx="2" fill="#f5e0a0"/><path d="M-9,-8 V12 M9,-8 V12 M0,-8 V12" fill="none" stroke="#3a3a40" stroke-width="2"/><path d="M-12,-8 L0,-17 L12,-8Z M-11,12 H11 V16 H-11Z" fill="#3a3a40"/><circle cx="0" cy="-20" r="3" fill="none" stroke="#3a3a40" stroke-width="2"/>`,
 brush18c:`<rect x="-12" y="-6" width="24" height="9" rx="3" fill="#a8703f"/><path d="M-10,3 V12 M-6,3 V13 M-2,3 V12 M2,3 V13 M6,3 V12 M10,3 V13" fill="none" stroke="#c4473a" stroke-width="2.6"/><path d="M12,-2 L22,-8" fill="none" stroke="${OL}" stroke-width="4.4" stroke-linecap="round"/><path d="M12,-2 L22,-8" fill="none" stroke="#a8703f" stroke-width="2.4" stroke-linecap="round"/>`,
 potbowl18c:`<path d="M-15,-4 Q-14,12 0,12 Q14,12 15,-4Z" fill="#c4885a"/><ellipse cx="0" cy="-4" rx="15" ry="4" fill="#8a5a3a"/><path d="M-12,3 Q0,6 12,3" fill="none" stroke="#e8b080" stroke-width="1.4"/>`,
 mortar18c:`<path d="M-14,-4 Q-13,13 0,13 Q13,13 14,-4Z" fill="#b9b2a2"/><ellipse cx="0" cy="-4" rx="14" ry="4" fill="#8a8476"/><path d="M4,-6 L16,-20" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><path d="M4,-6 L16,-20" fill="none" stroke="#d6cdb8" stroke-width="4" stroke-linecap="round"/>`,
 fern18c:`<g transform="rotate(25)"><path d="M0,22 Q2,0 0,-20" fill="none" stroke="#4a7a3a" stroke-width="2"/>${[-14,-8,-2,4,10,16].map((y,i)=>`<path d="M0,${y} q${-9+i},-3 ${-11+i},-8 M0,${y} q${9-i},-3 ${11-i},-8" fill="none" stroke="#5f9a48" stroke-width="3" stroke-linecap="round"/>`).join('')}</g>`,
 mush18c:`<path d="M-5,14 Q-6,2 -4,-2 H4 Q6,2 5,14Z" fill="#f4ecd6"/><path d="M-18,0 Q-16,-18 0,-18 Q16,-18 18,0 Q0,4 -18,0Z" fill="#fbf8f0"/><circle cx="-6" cy="-9" r="2.4" fill="#e8e0cc" stroke="none"/><circle cx="6" cy="-11" r="2" fill="#e8e0cc" stroke="none"/>`,
 cinna18c:`<ellipse cx="0" cy="2" rx="17" ry="11" fill="#d9963a"/><path d="M0,2 m0,-2 a2,2 0 1,1 -2,2 a5,5 0 1,1 5,4 a9,8 0 1,1 -9,-7 a13,10 0 1,1 13,10" fill="none" stroke="#8a4a1a" stroke-width="1.7"/><path d="M-10,-4 q4,3 8,0 q4,-3 8,0" fill="none" stroke="#fbf6ea" stroke-width="1.6"/>`});

/* ---- 樹籬雕塑（使用者選 B：毛茸茸葉叢＋綠籬底座） ---- */
const G='#4f8a3e',GL='#6aa64e',GD='#3c6e30';
const fluff=(cx,cy,rx,ry,n)=>{let d='';for(let i=0;i<=n;i++){const a=i/n*Math.PI*2,x=cx+Math.cos(a)*rx,y=cy+Math.sin(a)*ry;
  if(i===0){d+=`M${f(x)},${f(y)}`;continue}const am=(i-.5)/n*Math.PI*2,k=1.16;d+=` Q${f(cx+Math.cos(am)*rx*k)},${f(cy+Math.sin(am)*ry*k)} ${f(x)},${f(y)}`}
  return `<path d="${d}Z" fill="${G}"/>`};
const hi=(cx,cy,rx,ry)=>`<ellipse cx="${f(cx-rx*.32)}" cy="${f(cy-ry*.38)}" rx="${f(rx*.42)}" ry="${f(ry*.3)}" fill="${GL}" stroke="none" opacity=".75"/>`;
const dots=(cx,cy,rx,ry,n=7)=>{let s='';for(let i=0;i<n;i++){const a=i*2.4,k=.25+(i%3)*.22;s+=`M${f(cx+Math.cos(a)*rx*k)},${f(cy+Math.sin(a)*ry*k)} l2,-2.4 l2,2.4 `}return `<path d="${s}" fill="none" stroke="${GD}" stroke-width="1.4"/>`};
const blob=(cx,cy,rx,ry)=>fluff(cx,cy,rx,ry,Math.max(8,Math.round((rx+ry)/4)))+hi(cx,cy,rx,ry)+dots(cx,cy,rx,ry);
const hbase=(w=30)=>`<path d="M${-w},0 V-18 Q0,-22 ${w},-18 V0Z" fill="${GD}"/><path d="M${-w+4},-12 l3,-3 l3,3 M${-6},-10 l3,-3 l3,3 M${w-12},-12 l3,-3 l3,3" fill="none" stroke="#2f5a26" stroke-width="1.3"/>`;
const topiRabbit=()=>sh(36,7)+hbase()+`<g transform="translate(0,-16)">`+blob(-30,-18,9,9)+blob(-4,-26,28,25)+
 `<g transform="rotate(-12 16 -78)">${blob(16,-90,6,19)}</g><g transform="rotate(8 26 -76)">${blob(26,-88,6,18)}</g>`+blob(20,-58,16,15)+blob(10,-6,10,7)+`</g>`;
const topiSwan=()=>sh(40,7)+hbase(32)+`<g transform="translate(0,-16)">`+blob(-30,-40,11,15)+blob(-4,-22,34,20)+blob(-10,-34,20,12)+
 `<path d="M14,-30 Q32,-48 22,-64 Q14,-78 22,-90" fill="none" stroke="${OL}" stroke-width="20" stroke-linecap="round"/><path d="M14,-30 Q32,-48 22,-64 Q14,-78 22,-90" fill="none" stroke="${G}" stroke-width="16" stroke-linecap="round"/>`+
 blob(40,-89,7,4)+blob(26,-93,12,9)+`</g>`;
const topiBall=(lop=false)=>sh(30,6)+hbase(24)+`<g transform="translate(0,-16)"><path d="M-3,0 V-50 H3 V0Z" fill="#7a5235"/>`+blob(0,-30,14,10)+
 (lop?`<g transform="rotate(-14 0 -60)">`+blob(4,-70,18,25)+`<path d="M-12,-92 Q-16,-72 -12,-50" fill="none" stroke="${GD}" stroke-width="3"/></g>`:blob(0,-72,24,23))+`</g>`;
const TOPI={rabbit:topiRabbit,swan:topiSwan,ball:()=>topiBall()};

/* ---- 噴水池（使用者選 A：三層圓盤噴泉）；點了會噴高、出現彩虹（.jt18c 平常藏起來） ---- */
const WC='#8cc4d4',WL='#d4eef4',ST='#ece6d8',ST2='#d6cdb8';
const basin=(rx,ry,h)=>`<path d="M${-rx},0 V${h} A${rx},${ry} 0 0 0 ${rx},${h} V0Z" fill="${ST2}"/><ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${ST}"/><ellipse cx="0" cy="0" rx="${rx-8}" ry="${ry-5}" fill="${WC}"/>`;
const jet=(x,y,h,w=14)=>`<path d="M${x},${y} Q${x},${y-h} ${x-w},${y-h*.55} M${x},${y} Q${x},${y-h} ${x+w},${y-h*.55}" fill="none" stroke="${WL}" stroke-width="3" stroke-linecap="round" opacity=".95"/><path d="M${x},${y} V${y-h*.8}" fill="none" stroke="${WL}" stroke-width="3.4" stroke-linecap="round"/>`;
const fall=(x0,x1,y0,y1)=>`<path d="M${x0},${y0} Q${x0-6},${(y0+y1)/2} ${x0-4},${y1} M${x1},${y0} Q${x1+6},${(y0+y1)/2} ${x1+4},${y1}" fill="none" stroke="${WL}" stroke-width="3" opacity=".9"/><path class="fw18c" d="M${x0},${y0} Q${x0-6},${(y0+y1)/2} ${x0-4},${y1} M${x1},${y0} Q${x1+6},${(y0+y1)/2} ${x1+4},${y1}" fill="none" stroke="#ffffff" stroke-width="1.6" opacity=".85"/>`;
/* 2026-11-21 使用者：噴水池的水要微微流動 → 流下來的水簾虛線往下跑、池面的漣漪一圈圈擴散、頂端水柱上下輕輕跳（sprite 自己的 @keyframes，一直會跑） */
const FWS=`<style>.fw18c{stroke-dasharray:8 6;animation:fw18c .7s linear infinite}@keyframes fw18c{to{stroke-dashoffset:-14}}`+
 `.rp18c{transform-box:fill-box;transform-origin:50% 50%;animation:rp18c 2.6s ease-out infinite}@keyframes rp18c{from{transform:scale(.35);opacity:.9}to{transform:scale(1);opacity:0}}`+
 `.jt18c{transform-box:fill-box;transform-origin:50% 100%;animation:jt18c 1.1s ease-in-out infinite alternate}@keyframes jt18c{to{transform:scaleY(1.12)}}</style>`;
const fountain=()=>{let s=FWS+`<ellipse cx="0" cy="2" rx="120" ry="16" fill="#000" opacity=".12" stroke="none"/><g transform="translate(0,-52)">`;
 s+=basin(110,30,22)+`<path d="M-55,6 q10,-4 20,0 q10,4 20,0 M16,-9 q8,-3 16,0 q8,3 16,0 M-30,16 q8,-3 16,0 q8,3 16,0" fill="none" stroke="${WL}" stroke-width="1.8"/>`;
 s+=`<path d="M-10,0 L-8,-62 H8 L10,0Z" fill="${ST}"/><g transform="translate(0,-64)">${basin(46,13,10)}</g>`+fall(-42,42,-60,-6);
 s+=`<path d="M-6,-70 L-5,-104 H5 L6,-70Z" fill="${ST}"/><g transform="translate(0,-106)">${basin(22,7,7)}</g>`+fall(-20,20,-104,-66);
 s+=`<g class="jt18c">${jet(0,-110,34)}</g>`;
 /* 池面的漣漪（落水處一圈圈擴散） */
 s+=[[-46,6,0],[48,4,.9],[0,16,1.7],[-20,-4,.5],[24,-2,1.3]].map(([x,y,d])=>`<ellipse class="rp18c" style="animation-delay:-${d}s" cx="${x}" cy="${y}" rx="16" ry="4.4" fill="none" stroke="#e8f6fa" stroke-width="1.6"/>`).join('');
 /* 彩蛋：噴高的水柱＋彩虹（平常 opacity 0） */
 s+=`<g class="jb18c" opacity="0" style="transition:opacity .4s">${jet(0,-110,120,40)}<path d="M-118,-40 A120,104 0 0 1 122,-40" fill="none" stroke="#e8605a" stroke-width="5" opacity=".7"/><path d="M-110,-40 A112,96 0 0 1 114,-40" fill="none" stroke="#f5c84a" stroke-width="5" opacity=".7"/><path d="M-102,-40 A104,88 0 0 1 106,-40" fill="none" stroke="#6fc06a" stroke-width="5" opacity=".7"/><path d="M-94,-40 A96,80 0 0 1 98,-40" fill="none" stroke="#5a8ee0" stroke-width="5" opacity=".7"/></g>`;
 return s+`</g>`};

/* ---- 白色圓頂涼亭（使用者選 A）＋裡面的下午茶 ---- */
const gzCol=(x,y,h)=>`<path d="M${x-5},${y} V${y-h} H${x+5} V${y}Z" fill="#fbfaf6"/><path d="M${x-7},${y-h} H${x+7} V${y-h-6} H${x-7}Z" fill="#ece6d8"/>`;
const teaParty=()=>{let s='';
 s+=act(-28,-24,1,{view:'side',pose:'sit',hat:HAT_TIARA,hs:2,shirt:'#b8667a',mood:1},'nod');
 s+=act(32,-24,-1,{view:'side',pose:'sit',hat:HAT_BERET,shirt:'#2f4f8a',mood:3},'lean');
 s+=act(4,-34,1,{view:'front',pose:'reach',hat:-1,hs:3,hair:'#e8e4dc',shirt:'#6a3f8a',mood:2,extra:gown('#6a3f8a')},'nod');
 s+=`<ellipse cx="0" cy="-24" rx="26" ry="7" fill="#fbfaf6"/><path d="M-3,-20 V-6 H3 V-20Z" fill="#ece6d8"/>`;
 s+=`<g transform="translate(-8,-30)"><path d="M-6,0 Q-7,-9 0,-10 Q7,-9 6,0Z" fill="#fbfaf6"/><path d="M6,-6 L11,-11" fill="none" stroke="${OL}" stroke-width="2.6"/><circle cx="0" cy="-11" r="1.6" fill="#e0b44a" stroke-width="1"/></g>`;
 s+=`<g transform="translate(10,-28)"><path d="M-7,0 H7 L5,-7 H-5Z" fill="#f6c8d4"/><path d="M-5,-7 Q0,-11 5,-7" fill="#fbf6ea" stroke-width="1.2"/><circle cx="0" cy="-11" r="1.8" fill="#d8413a" stroke-width="1"/></g>`;
 s+=`<path d="M13,-36 Q15,-28 12,-24" fill="none" stroke="#b8805a" stroke-width="2"/><ellipse cx="12" cy="-23" rx="5" ry="1.6" fill="#b8805a" stroke="none" opacity=".8"/>`;
 return s};
const gazebo=()=>{let s=`<ellipse cx="0" cy="4" rx="96" ry="14" fill="#000" opacity=".13" stroke="none"/>`;
 s+=`<path d="M-92,-14 V0 A92,26 0 0 0 92,0 V-14Z" fill="#cbbf9f"/><ellipse cx="0" cy="-14" rx="92" ry="26" fill="#e4dccb"/>`;
 s+=gzCol(-52,-30,110)+gzCol(52,-30,110)+`<path d="M-52,-62 H52" fill="none" stroke="#e6e0d2" stroke-width="4"/>`;
 s+=T(0,0,1,teaParty());
 s+=[-76,-62,62,76].map(x=>`<path d="M${x},-18 V-44" fill="none" stroke="#fbfaf6" stroke-width="3"/>`).join('')+`<path d="M-86,-44 H-50 M50,-44 H86" fill="none" stroke="#fbfaf6" stroke-width="4"/>`;
 s+=gzCol(-84,-14,120)+gzCol(84,-14,120);
 s+=`<path d="M-98,-136 H98 L92,-148 H-92Z" fill="#ece6d8"/><path d="M-96,-148 Q-90,-210 0,-226 Q90,-210 96,-148Z" fill="#7fa8b4"/><path d="M0,-226 Q40,-210 50,-148 H96 Q90,-210 0,-226Z" fill="#000" opacity=".1" stroke="none"/>`;
 s+=`<path d="M-60,-148 Q-50,-200 0,-224 M60,-148 Q50,-200 0,-224 M0,-148 V-224" fill="none" stroke="#5f8a96" stroke-width="1.6"/><path d="M0,-226 V-246" fill="none" stroke-width="3"/><circle cx="0" cy="-248" r="6" fill="#e0b44a"/>`;
 s+=`<path d="M-98,-136 q12,10 24,0 q12,10 24,0 q12,10 24,0 q12,10 24,0 q12,10 24,0 q12,10 24,0 q12,10 24,0 q12,10 24,0" fill="none" stroke="#e6e0d2" stroke-width="2.4"/>`;
 return s};

/* ---- 其他佈景 ---- */
const urn=()=>sh(18,4)+`<path d="M-9,0 L-7,-8 H7 L9,0Z" fill="#d6cdb8"/><path d="M-4,-8 V-14 H4 V-8Z" fill="#ece6d8"/><path d="M-16,-30 Q-15,-14 0,-14 Q15,-14 16,-30Z" fill="#ece6d8"/><path d="M-18,-30 H18 V-34 H-18Z" fill="#d6cdb8"/>`+
 `<path d="M-16,-34 Q-14,-46 -6,-42 Q0,-50 6,-42 Q14,-46 16,-34Z" fill="#5f9a48"/>`+[[-10,-40,'#d8413a'],[-2,-45,'#f0a8b8'],[7,-41,'#f5d34a'],[13,-36,'#d8413a'],[-14,-35,'#f0a8b8']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="3.2" fill="${c}" stroke-width="1.1"/>`).join('');
const benchBack=()=>`<path d="M-30,-14 V-34 M30,-14 V-34" fill="none" stroke="${OL}" stroke-width="5"/><path d="M-30,-14 V-34 M30,-14 V-34" fill="none" stroke="#fbfaf6" stroke-width="3"/><path d="M-32,-34 H32 M-32,-27 H32" fill="none" stroke="${OL}" stroke-width="4.6"/><path d="M-32,-34 H32 M-32,-27 H32" fill="none" stroke="#fbfaf6" stroke-width="2.6"/>`;
const benchSeat=()=>`<path d="M-34,-14 V0 M34,-14 V0" fill="none" stroke="${OL}" stroke-width="5"/><path d="M-34,-14 V0 M34,-14 V0" fill="none" stroke="#fbfaf6" stroke-width="3"/><rect x="-38" y="-18" width="76" height="6" rx="2" fill="#fbfaf6"/>`;
/* 2026-11-21 使用者：坐著的人腳被橫桿擋住 → 先畫椅背和椅面，再畫人，最後只畫兩端的椅腳 */
const benchLegs=()=>`<path d="M-34,-14 V0 M34,-14 V0" fill="none" stroke="${OL}" stroke-width="5"/><path d="M-34,-14 V0 M34,-14 V0" fill="none" stroke="#fbfaf6" stroke-width="3"/>`;
const bench=(who='')=>sh(38,5)+benchBack()+`<rect x="-38" y="-18" width="76" height="6" rx="2" fill="#fbfaf6"/>`+who+benchLegs();
/* 孔雀：深藍綠身體、拖著長尾羽；.pf18c 開屏（平常藏起來） */
const peacock=(open=false)=>{let s=sh(26,5);
 s+=`<g class="pf18c" opacity="${open?1:0}" style="transition:opacity .35s">`+Array.from({length:11},(_,i)=>{const a=Math.PI*(.08+i*.084),x=-6-Math.cos(a)*56,y=-22-Math.sin(a)*52;return `<path d="M-6,-22 L${f(x)},${f(y)}" fill="none" stroke="#4f8a4a" stroke-width="2"/><ellipse cx="${f(x)}" cy="${f(y)}" rx="8" ry="10" fill="#3f9a6a" stroke-width="1.3" transform="rotate(${f(90-a*57.3)} ${f(x)} ${f(y)})"/><circle cx="${f(x)}" cy="${f(y)}" r="4" fill="#2f7ab0" stroke="none"/><circle cx="${f(x)}" cy="${f(y)}" r="1.8" fill="#1f2f6a" stroke="none"/>`}).join('')+`</g>`;
 s+=`<g class="pt18c" opacity="${open?0:1}"><path d="M-8,-14 Q-34,-12 -46,-2 Q-30,2 -8,-4Z" fill="#3f8a5a"/><path d="M-14,-10 Q-30,-8 -40,-3" fill="none" stroke="#2f6a4a" stroke-width="1.2"/><circle cx="-32" cy="-5" r="2.4" fill="#2f7ab0" stroke="none"/><circle cx="-22" cy="-8" r="2.4" fill="#2f7ab0" stroke="none"/></g>`;
 s+=`<path d="M-4,0 V-8 M4,0 V-8" fill="none" stroke="#8a7a6a" stroke-width="2"/><ellipse cx="0" cy="-15" rx="12" ry="9" fill="#2f6aa8"/><path d="M-6,-14 Q0,-18 6,-14" fill="none" stroke="#4f8ac4" stroke-width="1.4"/>`;
 s+=`<path d="M6,-18 Q12,-28 10,-36" fill="none" stroke="${OL}" stroke-width="7.4" stroke-linecap="round"/><path d="M6,-18 Q12,-28 10,-36" fill="none" stroke="#2f6aa8" stroke-width="5" stroke-linecap="round"/>`;
 s+=`<circle cx="11" cy="-38" r="4.6" fill="#2f6aa8"/><path d="M15,-38 l5,1.4 l-5,1Z" fill="#c9b48a" stroke-width="1"/><circle cx="12.6" cy="-39" r="1.1" fill="${OL}" stroke="none"/><path d="M8,-42 l-1,-6 M10,-43 l0,-6 M12,-42 l1,-6" fill="none" stroke="#2f6aa8" stroke-width="1.2"/>`;
 return s};
/* 玫瑰拱門（正面）：兩根白柱、拱頂爬滿玫瑰 */
const roseArch=()=>{let s=sh(46,5)+`<path d="M-40,0 V-100 Q-40,-140 0,-140 Q40,-140 40,-100 V0" fill="none" stroke="${OL}" stroke-width="8"/><path d="M-40,0 V-100 Q-40,-140 0,-140 Q40,-140 40,-100 V0" fill="none" stroke="#fbfaf6" stroke-width="5"/>`;
 let lv='';const pts=[];for(let t=0;t<=1.001;t+=.07){const a=Math.PI*(1-t);pts.push([Math.cos(a)*40,-100-Math.sin(a)*40])}
 for(const x of [-40,40])for(let y=-10;y>-100;y-=16)pts.push([x+(y%32?3:-3),y]);
 pts.forEach(([x,y],i)=>{lv+=`<circle cx="${f(x+(i%2?4:-4))}" cy="${f(y)}" r="${5+(i%3)}" fill="#5f9a48" stroke-width="1.1"/>`;if(i%3===0)lv+=`<circle cx="${f(x+(i%2?-3:3))}" cy="${f(y-3)}" r="4.2" fill="${i%2?'#d8413a':'#f0a8b8'}" stroke-width="1.1"/>`});
 return s+lv};
/* 西邊綠籬拱門（樹籬迷宮的入口，現在是佈景） */
const mazeArch=()=>sh(66,6)+`<path d="M-66,0 V-118 Q-66,-160 0,-160 Q66,-160 66,-118 V0 H36 V-104 Q36,-128 0,-128 Q-36,-128 -36,-104 V0Z" fill="${G}"/>`+
 `<path d="M-36,0 V-104 Q-36,-128 0,-128 Q36,-128 36,-104 V0Z" fill="#c9bf9f"/><path d="M-26,0 L-10,-104 H10 L26,0Z" fill="#e2d8bc" stroke="none"/><path d="M-36,-104 Q-36,-128 0,-128 Q36,-128 36,-104 L28,-96 Q26,-114 0,-116 Q-26,-114 -28,-96Z" fill="#2f5a26" stroke="none" opacity=".6"/>`+
 dots(-52,-60,10,50,6)+dots(52,-60,10,50,6)+dots(0,-146,50,10,6)+`<path d="M-58,-140 Q-40,-156 -8,-158" fill="none" stroke="${GL}" stroke-width="5" opacity=".8"/>`;

/* ---- 佈景圖鑑 ---- */
const dk=(id,w,h,cy=-12)=>({w,h,fn:()=>T(0,cy,1,DECOY[id])});
Object.assign(KIND,{
 topi18c:{w:76,h:120,fn:()=>TOPI[pk(['rabbit','swan','ball'])]()},urn18c:{w:38,h:50,fn:urn},bench18c:{w:78,h:40,fn:bench},pcock18c:{w:56,h:46,fn:peacock},
 rarch18c:{w:96,h:150,fn:roseArch},
 tongs18c:dk('tongs18c',38,26,-4),milk18c:dk('milk18c',26,34,-6),beads18c:dk('beads18c',34,22,-4),ladle18c:dk('ladle18c',34,34,-6),lamp18c:dk('lamp18c',26,38,-6),
 brush18c:dk('brush18c',34,26,-4),potbowl18c:dk('potbowl18c',32,22,-4),mortar18c:dk('mortar18c',32,30,-6),fern18c:dk('fern18c',30,40,-6),mush18c:dk('mush18c',34,30,-6),cinna18c:dk('cinna18c',36,24,-4),
 rpin17:KIND.rpin17||dk('rpin17',40,22,-2)});
['topi18c','urn18c','bench18c','rarch18c'].forEach(k=>H.OCCK.add(k));

/* ================= 4. 12 種 × 4 個（11 種新東西＋1 種第 17 關的老朋友） ================= */
/* 2026-11-21 使用者：老朋友只留捲軸信，盾牌改成蝸牛 */
const OLD={scroll17:{id:'scroll17',name:'封蠟捲軸信',short:'捲軸信',r:15,rot:20}};
const old=(id,regions)=>({...(typeOf(id)||OLD[id]),regions});
const TYPES=[
 old('scroll17',['north18c','plaza18c','south18c','east18c']),
 {id:'shears18c',name:'修枝大剪刀',short:'大剪刀',r:16,rot:20,regions:['west18c','lawn18c','east18c','north18c']},
 {id:'can18c',name:'銅澆花壺',short:'澆花壺',r:16,rot:10,regions:['west18c','east18c','lawn18c','plaza18c']},
 {id:'pearl18c',name:'珍珠項鍊',short:'項鍊',r:15,rot:15,regions:['east18c','plaza18c','south18c','north18c']},
 {id:'mallet18c',name:'槌球木槌',short:'槌球木槌',r:16,rot:20,regions:['lawn18c','west18c','south18c','plaza18c']},
 {id:'cage18c',name:'金色鳥籠',short:'鳥籠',r:16,rot:8,regions:['east18c','north18c','south18c','west18c']},
 {id:'rose18c',name:'玫瑰花束',short:'花束',r:15,rot:15,regions:['east18c','lawn18c','plaza18c','north18c']},
 {id:'cup18c',name:'骨瓷茶杯組',short:'茶杯',r:15,rot:8,regions:['east18c','south18c','plaza18c','lawn18c']},
 {id:'sundial18c',name:'日晷',short:'日晷',r:15,rot:6,regions:['west18c','lawn18c','north18c','plaza18c']},
 {id:'feather18c',name:'孔雀羽毛',short:'孔雀羽毛',r:16,rot:20,regions:['lawn18c','west18c','east18c','south18c']},
 {id:'parasol18c',name:'蕾絲陽傘',short:'陽傘',r:16,rot:12,regions:['plaza18c','south18c','lawn18c','north18c']},
 {id:'snail18c',name:'花園蝸牛',short:'蝸牛',r:15,rot:8,regions:['west18c','east18c','lawn18c','south18c']}];
LEVELS[N].types=TYPES;
/* BORROW：不借 */

/* ================= 5. 區域、建築位置 ================= */
Object.assign(REG,{north18c:{x:780,y:730,w:940,h:200},west18c:{x:620,y:850,w:270,h:750},plaza18c:{x:990,y:1150,w:520,h:240},
 east18c:{x:1550,y:1000,w:330,h:610},lawn18c:{x:630,y:1590,w:1240,h:230},south18c:{x:620,y:2010,w:1260,h:130},all18c:{x:620,y:730,w:1260,h:1090}});
H.SCREG[N]=['north18c','west18c','plaza18c','east18c','lawn18c','south18c'];
const DOOR={x:1250,y:640};          /* 主殿大門（腳底中心）：奇幻晚宴的入口（level20.js） */
const FOUNT={x:1250,y:1292};         /* 噴水池（腳底中心）；2026-11-21 使用者：最底層水池落地那圈的圓心（FOUNT.y-30）要和廣場石子圓（cy 1262）一致 */
const PART=[[1020,1040],[1480,1040],[1020,1470],[1480,1470]],PW=230,PHt=150;   /* 四塊花壇中心 */
const ARC={y0:1838,y1:1996};         /* 南邊迴廊 */
let towS='';
const TOW={x:1880,y:950};           /* 東北塔樓（圖書館的伏筆） */
const MAZE={x0:600,x1:720,y0:550,y1:828,ax:648};   /* 2026-11-21 使用者：迷宮再往北（入口拱門底部約在 y 834，整個比 11-21c 往上 140） */   /* 2026-11-21 使用者：迷宮、塔樓再往兩側、往上，不要佔太多空間 */   /* 西北綠籬迷宮 */
const SPOT={giver:[1590,1300],target:[760,1312],helper:[1430,1720]};   /* 故事角色固定位置 */

/* ---- 花壇（原點在花壇下緣中央，寬 PW、高 PHt） ---- */
const bedFrame=inner=>`<rect x="${-PW/2}" y="${-PHt}" width="${PW}" height="${PHt}" rx="18" fill="${GD}"/><rect x="${-PW/2}" y="-2" width="${PW}" height="10" rx="4" fill="#2f5a26"/><rect x="${-PW/2+10}" y="${-PHt+8}" width="${PW-20}" height="${PHt-18}" rx="12" fill="${inner}"/>`;
const bedRing=()=>`<rect x="${-PW/2}" y="${-PHt}" width="${PW}" height="${PHt}" rx="18" fill="none" stroke="${GL}" stroke-width="3" opacity=".6"/>`;
const flw=(x,y,c,k=1)=>{let p='';for(let i=0;i<5;i++){const a=i*1.2566;p+=`<circle cx="${f(x+Math.cos(a)*3*k)}" cy="${f(y+Math.sin(a)*2.4*k)}" r="${f(2.4*k)}" fill="${c}" stroke-width=".9"/>`}return p+`<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.5*k)}" fill="#f5d34a" stroke="none"/>`};
const bush2=(cx,cy,rx,ry)=>fluff(cx,cy,rx,ry,10)+hi(cx,cy,rx,ry);
const BED={
 /* C：中央玫瑰花叢、四角小樹籬球、薰衣草鑲邊、碎石地 */
 C:()=>{let s=bedFrame('#d8cfb2');let gv='';for(let i=0;i<160;i++)gv+=`M${f(sr(-96,96))},${f(sr(-134,-16))} h2 `;s+=`<path d="${gv}" fill="none" stroke="#b9ad8c" stroke-width="2.2" stroke-linecap="round"/>`;
  let lv='';for(let x=-92;x<=92;x+=7)lv+=`M${x},-128 v-7 M${x},-18 v-7 `;for(let y=-120;y<=-26;y+=7)lv+=`M-94,${y} v-7 M94,${y} v-7 `;
  s+=`<path d="${lv}" fill="none" stroke="#5f9a48" stroke-width="2.6"/><path d="${lv}" fill="none" stroke="#9a7ad0" stroke-width="2.4" stroke-dasharray="3 4"/>`;
  s+=bush2(0,-74,56,34);for(let i=0;i<16;i++){const a=i*2.4,k=.3+(i%4)*.18,x=Math.cos(a)*50*k,y=-78+Math.sin(a)*28*k;s+=`<circle cx="${f(x)}" cy="${f(y)}" r="4.4" fill="${i%3?'#d8413a':'#f0a8b8'}" stroke-width="1.1"/><path d="M${f(x-2)},${f(y)} q2,-2.6 4,0" fill="none" stroke="#a82a2a" stroke-width=".9"/>`}
  [[-74,-112],[74,-112],[-74,-36],[74,-36]].forEach(([x,y])=>s+=`<ellipse cx="${x}" cy="${y+10}" rx="12" ry="4" fill="#000" opacity=".15" stroke="none"/>`+bush2(x,y,14,13));
  return s+bedRing()},
 /* D：刺繡花壇：草地上的綠籬卷草紋、紅色碎石、白色碎石、小花、中央石甕 */
 D:()=>{let s=bedFrame('#9fc060');s+=`<ellipse cx="-60" cy="-75" rx="28" ry="40" fill="#c4704a"/><ellipse cx="60" cy="-75" rx="28" ry="40" fill="#c4704a"/><path d="M-26,-130 Q0,-112 26,-130 Q0,-96 -26,-130Z M-26,-20 Q0,-38 26,-20 Q0,-54 -26,-20Z" fill="#f0ead8"/>`;
  const sc='M-96,-75 Q-96,-128 -60,-128 Q-30,-128 -30,-100 Q-30,-84 -46,-84 Q-58,-84 -56,-96 M-96,-75 Q-96,-22 -60,-22 Q-30,-22 -30,-50 Q-30,-66 -46,-66 Q-58,-66 -56,-54',hd=d=>`<path d="${d}" fill="none" stroke="${OL}" stroke-width="10" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${G}" stroke-width="7" stroke-linecap="round"/>`;
  s+=hd(sc)+`<g transform="scale(-1,1)">${hd(sc)}</g>`+hd('M-30,-75 H30');
  [[-62,-104],[-62,-46],[62,-104],[62,-46]].forEach(([x,y],i)=>s+=flw(x,y,i%2?'#f0a8b8':'#d8413a',1.3)+flw(x+8,y+6,'#f5d34a',1.1));
  s+=`<g transform="translate(0,-68)"><path d="M-7,0 L-5,-8 H5 L7,0Z" fill="#d6cdb8"/><path d="M-13,-22 Q-12,-8 0,-8 Q12,-8 13,-22Z" fill="#ece6d8"/><path d="M-12,-24 Q-8,-34 0,-30 Q8,-34 12,-24Z" fill="#5f9a48"/>${flw(-5,-29,'#d8413a',.9)}${flw(5,-29,'#f0a8b8',.9)}</g>`;
  return s+bedRing()}};
/* ---- 城堡畫法小工具（和第 17 關同一種） ---- */
const crn=(x0,x1,y,h=14,st=26,mw=15,fill='#ece4d0')=>{let d='';for(let x=x0;x<=x1-mw;x+=st)d+=`M${f(x)},${f(y)} v-${h} h${mw} v${h} `;return `<path d="${d}" fill="${fill}"/>`};
const stn=(x0,x1,y0,y1,dy=20,len=44,col='#cfc4a8')=>{let s='',k=0;for(let y=y0+dy;y<y1-2;y+=dy,k++)for(let x=x0+6+(k%2)*(len*.68);x<x1-len*.5;x+=len*1.36)s+=`M${f(x)},${f(y)} h${f(Math.min(len,x1-x-6))} `;return `<path d="${s}" fill="none" stroke="${col}" stroke-width="1.3"/>`};
const wavFlag=(px,py,W,Hh,col,ph=0)=>{const n=8,A=Hh*.22,frame=p=>{const top=[],bot=[];for(let i=0;i<=n;i++){const u=i/n,x=W*u,dy=A*Math.sin(u*5.2+p)*u;top.push([x,Hh/2*u+dy]);bot.push([x,Hh-Hh/2*u+dy])}
  return 'M'+top.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' L')+' L'+bot.slice(0,n).reverse().map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' L')+'Z'};
 const v=[0,1.6,3.2,4.8,0].map(k=>frame(k+ph)).join(';');
 return `<g transform="translate(${f(px)},${f(py)})"><path d="${frame(ph)}" fill="${col}" stroke-width="1.5"><animate attributeName="d" values="${v}" dur="${(1.3+(ph%1)*.4).toFixed(2)}s" repeatCount="indefinite"/></path></g>`};
let FLC=0;const flg=(x,y,col='#e0b44a')=>`<path d="M${f(x)},${f(y)} v-20" fill="none"/>`+wavFlag(x,y-20,20,10,col,(FLC++)*1.3);
const rTower=(cx,by,w,h,roof,C='#ece4d0',C2='#d8cdb2')=>{const x0=cx-w/2,x1=cx+w/2,top=by-h,e=w*.14;let s='';
 s+=`<path d="M${f(x0)},${f(top)} V${f(by)} Q${f(cx)},${f(by+e*2)} ${f(x1)},${f(by)} V${f(top)}Z" fill="${C}"/>`;
 s+=`<path d="M${f(cx+w*.2)},${f(top)} V${f(by+e*.84)} Q${f(cx+w*.36)},${f(by+e*.6)} ${f(x1)},${f(by)} V${f(top)}Z" fill="${C2}" stroke="none"/>`;
 let b='';for(let y=top+26;y<by-8;y+=24)b+=`M${f(x0+2)},${f(y)} Q${f(cx)},${f(y+e*1.8)} ${f(x1-2)},${f(y)} `;s+=`<path d="${b}" fill="none" stroke="#cbbf9f" stroke-width="1.1" opacity=".75"/>`;
 s+=`<path d="M${f(x0)},${f(top)} V${f(by)} Q${f(cx)},${f(by+e*2)} ${f(x1)},${f(by)} V${f(top)}" fill="none"/>`;
 for(let y=top+34;y<by-60;y+=Math.max(60,h/3.2))s+=`<path d="M${f(cx-6)},${f(y+18)} V${f(y+6)} Q${f(cx)},${f(y-2)} ${f(cx+6)},${f(y+6)} V${f(y+18)}Z" fill="#3a3040"/>`;
 const pt=top-12;s+=`<path d="M${f(x0-5)},${f(top)} V${f(pt)} Q${f(cx)},${f(pt+e*2)} ${f(x1+5)},${f(pt)} V${f(top)} Q${f(cx)},${f(top+e*2)} ${f(x0-5)},${f(top)}Z" fill="${C}"/>`;
 const ap=pt-w*1.12;s+=`<path d="M${f(x0-9)},${f(pt)} Q${f(cx)},${f(pt+e*2.4)} ${f(x1+9)},${f(pt)} L${f(cx)},${f(ap)}Z" fill="${roof}"/><path d="M${f(cx)},${f(ap)} L${f(cx+w*.22)},${f(pt+e*1.5)} Q${f(cx+w*.42)},${f(pt+e*1.1)} ${f(x1+9)},${f(pt)}Z" fill="#000" opacity=".13" stroke="none"/>`+flg(cx,ap);
 return s};

/* ---- 南邊迴廊的前面（石柱、拱、紅瓦屋頂）：sprite，原點在迴廊地板（y=ARC.y1），x 用場景座標 ---- */
const arcFront=(xa,xb)=>{const Y=v=>f(v-ARC.y1);let s='';const step=72,cols=[];for(let x=xa;x<=xb+1;x+=step)cols.push(x);
 for(let i=0;i<cols.length-1;i++){const a=cols[i],b=cols[i+1],m=(a+b)/2;s+=`<path d="M${a},${Y(ARC.y0+74)} Q${m},${Y(ARC.y0+22)} ${b},${Y(ARC.y0+74)} V${Y(ARC.y0+10)} H${a}Z" fill="#ece4d0"/>`}
 s+=`<path d="M${xa},${Y(ARC.y0+10)} H${xb}" fill="none"/>`;
 cols.forEach(x=>s+=`<path d="M${x-7},0 V${Y(ARC.y0+64)} H${x+7} V0Z" fill="#f6f1e6"/><path d="M${x-10},${Y(ARC.y0+64)} H${x+10} V${Y(ARC.y0+56)} H${x-10}Z" fill="#e2d8c0"/><path d="M${x-10},0 H${x+10} V-6 H${x-10}Z" fill="#e2d8c0"/>`);
 s+=`<path d="M${xa-6},${Y(ARC.y0+12)} H${xb+6} V${Y(ARC.y0-2)} H${xa-6}Z" fill="#e2d8c0"/><path d="M${xa-12},${Y(ARC.y0-2)} H${xb+12} L${xb+4},${Y(ARC.y0-24)} H${xa-4}Z" fill="#c4704a"/>`;
 let tl='';for(let x=xa;x<xb;x+=14)tl+=`M${x},${Y(ARC.y0-4)} l3,-18 `;s+=`<path d="${tl}" fill="none" stroke="#a85a3a" stroke-width="1.3"/>`;
 return s+`<path d="M${xa-4},0 H${xb+4} V8 H${xa-4}Z" fill="#e2d8c0"/>`};
/* ================= 6. 地面（天空、主殿、迷宮、步道、花壇、塔樓、迴廊） ================= */
function ground(){
 const Sc=H.SCENES[N],X0=Sc.x0-420,WW=Sc.x1-Sc.x0+840,X1=X0+WW;let g='';
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="${Sc.y1+840}" fill="#9fc060" stroke="none"/>`;
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="760" fill="#d6ebf5" stroke="none"/>`;
 g+=`<circle cx="1690" cy="110" r="38" fill="#fdf0c0" stroke="none" opacity=".9"/><circle cx="1690" cy="110" r="60" fill="#fdf0c0" stroke="none" opacity=".25"/>`;
 g+=`<ellipse cx="780" cy="150" rx="80" ry="22" fill="#fbfbf6" stroke="none" opacity=".9"/><ellipse cx="1440" cy="100" rx="96" ry="24" fill="#fbfbf6" stroke="none" opacity=".9"/>`;
 g+=`<path d="M${X0},330 Q700,262 980,316 Q1250,250 1520,312 Q1800,262 ${X1},326 V700 H${X0}Z" fill="#a9c3b2" stroke="none"/>`;
 /* ---- 主殿正面（2026-11-21 使用者：主殿改成兩層樓；中央高塔加高、比兩邊圓塔再高一點；兩邊圓塔往內收，右邊圓塔和圖書塔之間有空中廊道） ---- */
 const pl=DOOR.y,MW0=900,MW1=1600,F2=480,RT=330,CT=160,SX=[870,1630];
 g+=`<path d="M${X0},${pl-60} H${X1} V${pl+70} H${X0}Z" fill="#9fc060" stroke="none"/>`;
 g+=`<path d="M${MW0},${pl} V${RT} H${MW1} V${pl}Z" fill="#ece4d0"/>`+stn(MW0,MW1,RT,pl,22,46);
 g+=`<path d="M${MW0},${F2} H${MW1} V${F2+8} H${MW0}Z" fill="#e2d8c0"/>`;   /* 一樓、二樓之間的腰線 */
 {const RV='C',ex=0,ev=`M${MW0-16},${RT} Q1250,${RT+ex*2} ${MW1+16},${RT}`;
  if(RV==='C'){g+=`<path d="M${MW0-16},${RT} L${MW0+4},${RT-44} H${MW1-4} L${MW1+16},${RT}Z" fill="#4f6188"/><path d="M${MW0+4},${RT-44} L${MW0+40},${RT-70} H${MW1-40} L${MW1-4},${RT-44}Z" fill="#6a7ca4"/><path d="M${MW0+4},${RT-44} H${MW1-4}" fill="none" stroke="#e2d8c0" stroke-width="3"/>`}
  else{g+=`<path d="${ev} L${MW1-30},${RT-62} H${MW0+30}Z" fill="#5c6f96"/><path d="M${MW0-16},${RT} L${MW0+30},${RT-62} L${MW0+60},${RT-62} L${MW0+26},${RT+ex*.4}Z" fill="#46577c" stroke="none"/><path d="M${MW1+16},${RT} L${MW1-30},${RT-62} L${MW1-60},${RT-62} L${MW1-26},${RT+ex*.4}Z" fill="#46577c" stroke="none"/>`+
   `<path d="${ev} L${MW1-30},${RT-62} H${MW0+30}Z" fill="none"/><path d="M${MW0+6},${RT-20} H${MW1-6} M${MW0+18},${RT-40} H${MW1-18}" fill="none" stroke="#4a5a80" stroke-width="1.4"/>`}
  g+=`<path d="M${MW0},${RT+1} Q1250,${RT+ex*2+1} ${MW1},${RT+1} V${RT+12} Q1250,${RT+ex*2+12} ${MW0},${RT+12}Z" fill="#000" opacity=".14" stroke="none"/>`}
 [980,1070,1430,1520].forEach(x=>g+=`<path d="M${x-14},${RT-28} V${RT-44} L${x},${RT-56} L${x+14},${RT-44} V${RT-28}Z" fill="#ece4d0" stroke-width="1.6"/><rect x="${x-6}" y="${RT-44}" width="12" height="13" fill="#8cb8d0" stroke-width="1.2"/>`);
 /* 2026-11-21 使用者：兩側的窗離圓塔太近 → 在圓塔（930／1570）和中間塔（1150／1350）之間平均分配 */
 const WX=[978,1040,1102,1398,1460,1522];
 /* 一樓：高高的尖拱窗＋窗台花箱 */
 WX.forEach(x=>{g+=`<path d="M${x-15},${pl-56} V${pl-120} Q${x},${pl-142} ${x+15},${pl-120} V${pl-56}Z" fill="#9cc4d8"/><path d="M${x},${pl-136} V${pl-56} M${x-15},${pl-92} H${x+15}" fill="none" stroke="#ece4d0" stroke-width="2.4"/>`;
  g+=`<rect x="${x-20}" y="${pl-58}" width="40" height="10" rx="2" fill="#a8784a"/>`+[-12,-4,4,12].map((d,i)=>`<circle cx="${x+d}" cy="${pl-60}" r="3.4" fill="${['#d8413a','#f0a8b8','#f5d34a','#d8413a'][i]}" stroke-width="1"/>`).join('')});
 /* 二樓：小一點的窗＋小陽台欄杆 */
 WX.forEach(x=>{g+=`<path d="M${x-12},${F2-14} V${F2-80} Q${x},${F2-98} ${x+12},${F2-80} V${F2-14}Z" fill="#9cc4d8"/><path d="M${x},${F2-92} V${F2-14} M${x-12},${F2-50} H${x+12}" fill="none" stroke="#ece4d0" stroke-width="2.2"/>`;
  g+=`<rect x="${x-20}" y="${F2-16}" width="40" height="6" rx="1" fill="#e2d8c0"/><path d="M${x-16},${F2-16} v-10 M${x-8},${F2-16} v-10 M${x},${F2-16} v-10 M${x+8},${F2-16} v-10 M${x+16},${F2-16} v-10 M${x-20},${F2-27} H${x+20}" fill="none" stroke="#d6cbb0" stroke-width="2"/>`});
 /* 中央高塔（大門、玫瑰窗、紋章、上層小窗、尖屋頂）：比兩邊圓塔再高一點 */
 /* 2026-11-21 使用者：中間塔的垛口岔出屋頂、立體感不夠 → 拿掉垛口，右邊一條背光面，屋簷做成往下彎的圓弧＋屋簷陰影 */
 g+=`<path d="M1150,${pl} V${CT} H1350 V${pl}Z" fill="#f2ead8"/><path d="M1310,${pl} V${CT} H1350 V${pl}Z" fill="#ddd2b8" stroke="none"/>`+stn(1150,1350,CT,pl,22,40)+`<path d="M1150,${pl} V${CT} H1350 V${pl}Z" fill="none"/>`;
 for(const y of [CT+36,CT+106])[1200,1250,1300].forEach(x=>g+=`<path d="M${x-8},${y+30} V${y+8} Q${x},${y-4} ${x+8},${y+8} V${y+30}Z" fill="#3a3040"/>`);
 g+=`<path d="M1150,${F2} H1350 M1150,${RT} H1350" fill="none" stroke="#d8cdb2" stroke-width="4"/>`;
 /* 2026-11-21 使用者：中間塔屋頂的兩條藍色稜線不好看 → 屋頂、屋簷改成跟兩側圓塔（rTower）一樣：一圈圓弧屋簷帶＋底部圓弧的尖屋頂＋右側一塊陰影，沒有稜線 */
 {const x0=1150,x1=1350,cx=1250,e=28,pt=CT-12,ap=CT-138;g+=`<path d="M${x0-5},${CT} V${pt} Q${cx},${pt+e*2} ${x1+5},${pt} V${CT} Q${cx},${CT+e*2} ${x0-5},${CT}Z" fill="#f2ead8"/>`;g+=`<path d="M${x0-9},${pt} Q${cx},${pt+e*2.4} ${x1+9},${pt} L${cx},${ap}Z" fill="#5c6f96"/><path d="M${cx},${ap} L${cx+44},${pt+e*.98} Q${cx+84},${pt+e*.85} ${x1+9},${pt}Z" fill="#000" opacity=".13" stroke="none"/>`+flg(cx,ap,'#3f6f9a')}
 g+=`<circle cx="1250" cy="410" r="32" fill="#9cc4d8"/>`+[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return `<path d="M1250,410 L${f(1250+Math.cos(a)*32)},${f(410+Math.sin(a)*32)}" fill="none" stroke="#f2ead8" stroke-width="2.4"/>`}).join('')+`<circle cx="1250" cy="410" r="9" fill="#e0b44a" stroke-width="1.6"/>`;
 g+=`<path d="M1230,${RT+4} H1270 V${RT+20} Q1270,${RT+36} 1250,${RT+44} Q1230,${RT+36} 1230,${RT+20}Z" fill="#3f6f9a" stroke-width="1.8"/><path d="M1238,${RT+22} L1250,${RT+12} L1262,${RT+22}" fill="none" stroke="#e0b44a" stroke-width="2.6"/>`;
 g+=`<path d="M1196,${pl} V${pl-92} Q1250,${pl-150} 1304,${pl-92} V${pl}Z" fill="#7a4e32"/><path d="M1250,${pl-122} V${pl}" fill="none" stroke="#5a3a22" stroke-width="2.4"/><path d="M1204,${pl-60} H1296" fill="none" stroke="#4a4f5c" stroke-width="5"/><circle cx="1240" cy="${pl-40}" r="3.4" fill="#e0b44a" stroke-width="1.2"/><circle cx="1260" cy="${pl-40}" r="3.4" fill="#e0b44a" stroke-width="1.2"/>`;
 g+=`<path d="M1196,${pl} V${pl-92} Q1250,${pl-150} 1304,${pl-92} V${pl}" fill="none" stroke="#d6cbb0" stroke-width="6"/>`;
 /* 兩側掛的藍色長旗 */
 [1176,1324].forEach(x=>g+=`<path d="M${x-12},${pl-210} H${x+12} V${pl-120} L${x},${pl-132} L${x-12},${pl-120}Z" fill="#3f6f9a" stroke-width="1.6"/><path d="M${x-6},${pl-180} L${x},${pl-190} L${x+6},${pl-180} L${x},${pl-170}Z" fill="#e0b44a" stroke-width="1.1"/>`);
 g+=rTower(SX[0],pl+8,120,420,'#5c6f96')+rTower(SX[1],pl+8,120,420,'#5c6f96');
 /* 大門前的石階（晚宴的侍從站在石階下） */
 for(let i=0;i<4;i++){const y=pl+i*15,w=130+i*30;g+=`<path d="M${DOOR.x-w/2},${y} H${DOOR.x+w/2} V${y+15} H${DOOR.x-w/2}Z" fill="${i%2?'#d6cbb0':'#e2d8c0'}"/>`}
 /* ---- 石子步道：南北主道、東西橫道、噴水池廣場、往塔樓和玫瑰步道的小徑 ---- */
 const PATH='#ebe1c6',PE='#d4c8a8';
 g+=`<path d="M1190,${pl+58} H1310 V${Sc.y1+300} H1190Z" fill="${PATH}" stroke="none"/>`;
 g+=`<path d="M820,1206 H1690 V1300 H820Z" fill="${PATH}" stroke="none"/>`;
 g+=`<ellipse cx="${FOUNT.x}" cy="1262" rx="262" ry="150" fill="${PATH}" stroke="none"/>`;
 g+=`<path d="M780,${pl+70} H1720 V${pl+160} H780Z" fill="${PATH}" stroke="none"/>`;
 g+=`<path d="M1640,1150 H1770 V1640 H1640Z" fill="${PATH}" stroke="none"/>`;
 g+=`<path d="M1705,1160 Q1712,1010 ${TOW.x-10},${TOW.y+16}" fill="none" stroke="${PATH}" stroke-width="56" stroke-linecap="round"/>`;
 g+=`<path d="M620,1206 H820 V1300 H700 Q660,1250 620,1300Z" fill="${PATH}" stroke="none"/>`;
 g+=`<path d="M${X0},2000 H${X1} V${Sc.y1+420} H${X0}Z" fill="${PATH}" stroke="none"/>`;
 let pb='';for(let i=0;i<900;i++){const x=sr(620,1880),y=sr(700,2140);pb+=`M${f(x)},${f(y)} h2 `}g+=`<path d="${pb}" fill="none" stroke="${PE}" stroke-width="2.2" stroke-linecap="round" opacity=".55"/>`;
 /* 草地上的小花和草 */
 const onPath=(x,y)=>(x>1180&&x<1320)||(y>1196&&y<1310&&x>810&&x<1700)||((x-FOUNT.x)**2/270**2+(y-1262)**2/158**2<1)||(y>pl+60&&y<pl+170&&x>770&&x<1730)||(x>1630&&x<1780&&y>1140&&y<1650);
 let tu='';for(let i=0;i<520;i++){const x=sr(X0,X1),y=sr(pl+60,ARC.y0-40);if(onPath(x,y))continue;tu+=`M${f(x)},${f(y)} l-3,-6 M${f(x)},${f(y)} l3,-6 `}g+=`<path d="${tu}" fill="none" stroke="#7a9a45" stroke-width="1.3" opacity=".7"/>`;
 /* ---- 四塊花壇（2026-11-21 使用者選：左上、右下 D 刺繡花壇；右上、左下 C 玫瑰花叢＋四角樹籬球＋薰衣草邊） ---- */
 PART.forEach(([cx,cy],k)=>g+=`<g transform="translate(${cx},${cy+PHt/2})">${BED[k===0||k===3?'D':'C'](k)}</g>`);
 /* ---- 西北：一般的高綠籬牆（2026-11-21 使用者：迷宮提示太明顯 → 拿掉頂視圖的彎曲小路和拱門；樹籬迷宮的入口改成牆上的小缺口，在 level102.js） ---- */
 g+=`<path d="M${X0},${MAZE.y0} H${MAZE.x1} V${MAZE.y1-90} H${X0}Z" fill="${GL}"/>`;
 {let tp='';for(let i=0;i<70;i++){const x=sr(X0+8,MAZE.x1-10),y=sr(MAZE.y0+10,MAZE.y1-100);tp+=`M${f(x)},${f(y)} l2,-2.4 l2,2.4 `}g+=`<path d="${tp}" fill="none" stroke="${G}" stroke-width="1.4"/>`}
 g+=`<path d="M${X0},${MAZE.y0} H${MAZE.x1} V${MAZE.y1-90} H${X0}Z" fill="none" stroke="${G}" stroke-width="6"/>`;
 g+=`<path d="M${X0},${MAZE.y1-90} H${MAZE.x1} V${MAZE.y1} H${X0}Z" fill="${G}"/><path d="M${X0},${MAZE.y1-90} H${MAZE.x1}" fill="none" stroke="${GL}" stroke-width="6"/>`;
 let lf='';for(let i=0;i<40;i++){const x=sr(X0,MAZE.x1-6),y=sr(MAZE.y1-80,MAZE.y1-8);lf+=`M${f(x)},${f(y)} l2,-2.4 l2,2.4 `}g+=`<path d="${lf}" fill="none" stroke="${GD}" stroke-width="1.4"/>`;
 /* ---- 東北：塔樓（紫屋頂、爬藤、小側門＝圖書館的伏筆） ---- */
 /* 右邊圓塔 → 圖書塔的空中廊道（有屋頂、小拱窗、紅瓦），圖書塔加高，廊道接在它上面幾層 */
 {const corr=(x0,x1,by)=>{let c=`<path d="M${x0},${by} V${by-40} H${x1} V${by}Z" fill="#ece4d0"/>`+stn(x0,x1,by-40,by,13,30);for(let x=x0+24;x<x1-14;x+=46)c+=`<path d="M${x-6},${by-8} V${by-24} Q${x},${by-32} ${x+6},${by-24} V${by-8}Z" fill="#3a3040"/>`;
   c+=`<path d="M${x0-6},${by-40} H${x1+6} L${x1},${by-58} H${x0}Z" fill="#c4704a"/>`;let tl='';for(let x=x0;x<x1;x+=14)tl+=`M${x},${by-42} l3,-14 `;c+=`<path d="${tl}" fill="none" stroke="#a85a3a" stroke-width="1.2"/>`;
   for(let x=x0+30;x<x1;x+=60)c+=`<path d="M${x-8},${by} L${x},${by+14} L${x+8},${by}Z" fill="#d8cdb2"/>`;return c};
   /* 2026-11-21 使用者：小拱窗要跟著斜的角度（側面看）；下面的三角托架看不懂 → 改成廊道下方一條加厚的石砌底座（有石縫） */
  const corrS=(x0,y0,x1,y1)=>{const L=(t,o=0)=>[f(x0+(x1-x0)*t),f(y0+(y1-y0)*t+o)],sk=f(Math.atan2(y1-y0,x1-x0)*180/Math.PI);
   /* 2026-11-21 使用者選 C：石拱支撐的厚底座（一排石拱洞）＋凹進去的小拱窗 */
   const P=(a,b,c2,d,fill)=>`<path d="M${a} L${b} L${c2} L${d}Z" fill="${fill}"/>`;
   let c=P(L(0,12),L(1,12),L(1),L(0),'#cfc4a8')+P(L(0,46),L(1,46),L(1,12),L(0,12),'#d8cdb2');
   for(let t=.04;t<.98;t+=.19){const m=L(t+.075,16);c+=`<path d="M${L(t,46)} L${L(t,28)} Q${m} ${L(t+.15,28)} L${L(t+.15,46)}Z" fill="#6a5a46" opacity=".8"/>`}
   c+=`<path d="M${L(0,46)} L${L(1,46)}" fill="none" stroke="#a89c78" stroke-width="2"/>`;
   c+=P(L(0),L(1),L(1,-40),L(0,-40),'#ece4d0');
   for(let t=.18;t<.95;t+=.3){const [x,y]=L(t,-16);c+=`<g transform="translate(${x},${y}) skewY(${sk}) scale(.75,1)"><path d="M-9,10 V-7 Q0,-18 9,-7 V10Z" fill="#d8cdb2"/><path d="M-6,8 V-6 Q0,-14 6,-6 V8Z" fill="#3a3040"/><path d="M-10,10 H10" fill="none" stroke="#b5a988" stroke-width="3"/></g>`}
   /* 2026-11-21 使用者：廊道本身還是很扁平 → 牆面石塊橫縫、凸出的壁柱（亮面＋側面陰影＋柱頭柱基）、窗洞內側陰影、窗台凸出、腰線 */
   let sc='';for(const o of [-12,-24])sc+=`M${L(0,o)} L${L(1,o)} `;
   for(let t=.05,k=0;t<1;t+=.1,k++){sc+=`M${L(t+(k%2?.05:0),-1)} V${L(t,-11)[1]} M${L(t+(k%2?0:.05),-13)} V${L(t,-23)[1]} `}
   c+=`<path d="${sc}" fill="none" stroke="#cbbf9f" stroke-width="1.1" opacity=".8"/>`;
   c+=P(L(0,-1),L(1,-1),L(1,-6),L(0,-6),'#d8cdb2');
   for(let t=.18;t<.95;t+=.3){const [x,y]=L(t,-16);c+=`<g transform="translate(${x},${y}) skewY(${sk}) scale(.75,1)"><path d="M1,8 V-6 Q3,-12 6,-6 V8Z" fill="#000" opacity=".45" stroke="none"/><path d="M-11,11 H11 V8 H-11Z" fill="#f4ecd6"/></g>`}
   /* 2026-11-21 使用者：屋頂左端不是尖角，要往右上斜的半圓弧 → 整個屋頂用 clipPath 切成左端圓弧 */
   const yb=L(0,-39)[1],tx=f(x0+20),ty=f(y0+(y1-y0)*(20/(x1-x0))-72),cp=`M${f(x0-2)},${yb} Q${f(x0-6)},${f(ty+6)} ${tx},${ty} L${f(x1+8)},${L(1,-72)[1]} L${f(x1+8)},${L(1,-39)[1]}Z`;
   c+=`<clipPath id="rfc18c"><path d="${cp}"/></clipPath><g clip-path="url(#rfc18c)">`;
   /* 2026-11-21 屋頂加立體感：背面斜坡（暗）→ 正面斜坡 → 屋脊亮線 → 瓦片橫列＋直縫 → 下緣厚度 → 屋簷在牆上的陰影 */
   const Q=(t,o)=>L(t,o),px=(t)=>f(x0+(x1-x0)*t);
   c+=`<path d="M${L(0,-40)} L${L(1,-40)} L${L(1,-47)} L${L(0,-47)}Z" fill="#000" opacity=".16" stroke="none"/>`;
   c+=`<path d="M${f(x0-2)},${L(0,-66)[1]} L${f(x1+8)},${L(1,-66)[1]} L${f(x1+8)},${L(1,-72)[1]} L${f(x0-2)},${L(0,-72)[1]}Z" fill="#a85a3a"/>`;
   c+=`<path d="M${f(x0-2)},${L(0,-44)[1]} L${f(x1+8)},${L(1,-44)[1]} L${f(x1+8)},${L(1,-66)[1]} L${f(x0-2)},${L(0,-66)[1]}Z" fill="#c4704a"/>`;
   c+=`<path d="M${f(x0-2)},${L(0,-44)[1]} L${f(x1+8)},${L(1,-44)[1]} L${f(x1+8)},${L(1,-56)[1]} L${f(x0-2)},${L(0,-56)[1]}Z" fill="#000" opacity=".1" stroke="none"/>`;
   let tl='';for(const o of [-50,-56,-61])tl+=`M${f(x0-2)},${L(0,o)[1]} L${f(x1+8)},${L(1,o)[1]} `;
   for(let t=.02,k=0;t<1;t+=.045,k++){const o1=k%2?-44:-50,o2=k%2?-56:-61;tl+=`M${Q(t,o1)} L${Q(t,o1-6)} `}
   c+=`<path d="${tl}" fill="none" stroke="#8e4a30" stroke-width="1.2" opacity=".85"/>`;
   c+=`<path d="M${f(x0-2)},${L(0,-66)[1]} L${f(x1+8)},${L(1,-66)[1]}" fill="none" stroke="#e8a87c" stroke-width="2.4" stroke-linecap="round"/>`;
   c+=`<path d="M${f(x0-2)},${L(0,-44)[1]} L${f(x1+8)},${L(1,-44)[1]} L${f(x1+8)},${L(1,-39)[1]} L${f(x0-2)},${L(0,-39)[1]}Z" fill="#8e4a30"/>`;
   c+=`<path d="M${L(0,-38)} L${L(1,-38)} L${L(1,-30)} L${L(0,-30)}Z" fill="#6a5a46" opacity=".28" stroke="none"/>`;
   c+=`</g><path d="M${f(x0-2)},${yb} Q${f(x0-6)},${f(ty+6)} ${tx},${ty}" fill="none"/>`;
   return c};
  /* 2026-11-21 使用者選 F（只稍微斜一點），而且要接在右邊圓塔中間偏上，不是屋頂 */const dy=90;
  g+=corrS(1668,392,TOW.x-40,392+dy);towS=rTower(TOW.x,TOW.y,150,TOW.y-180,'#6a4f8a')}
 towS+=`<path d="M${TOW.x-24},${TOW.y+8} V${TOW.y-46} Q${TOW.x},${TOW.y-76} ${TOW.x+24},${TOW.y-46} V${TOW.y+8}Z" fill="#6a4228"/><path d="M${TOW.x-24},${TOW.y-30} H${TOW.x+24} M${TOW.x-24},${TOW.y-8} H${TOW.x+24}" fill="none" stroke="#4a4f5c" stroke-width="3"/><circle cx="${TOW.x+12}" cy="${TOW.y-20}" r="2.6" fill="#e0b44a" stroke-width="1"/>`;
 towS+=`<path d="M${TOW.x-48},${TOW.y-70} h-10 M${TOW.x-54},${TOW.y-70} v12" fill="none" stroke="#3a3a40" stroke-width="3"/><path d="M${TOW.x-62},${TOW.y-58} h16 l-2,16 h-12Z" fill="#f5e0a0" stroke-width="1.6"/>`;
 towS+=`<circle cx="${TOW.x}" cy="${TOW.y-250}" r="16" fill="#9cc4d8"/><path d="M${TOW.x-8},${TOW.y-244} h6 v-10 h-6Z M${TOW.x},${TOW.y-244} h5 v-12 h-5Z M${TOW.x+5},${TOW.y-244} h4 v-8 h-4Z" fill="#8e2630" stroke-width="1"/>`;
 let iv='';for(let i=0;i<34;i++){const y=TOW.y-40-i*9,x=TOW.x-66+Math.sin(i*.7)*8;iv+=`<circle cx="${f(x)}" cy="${f(y)}" r="${4+(i%3)}" fill="${i%4?'#5f9a48':'#4a7a3a'}" stroke-width="1"/>`}towS+=iv;
 /* ---- 南邊：兩側石柱迴廊＋中間回主堡的拱門 ---- */
 /* 迴廊後面（陰影裡的走廊和後牆）畫在地面層；前面的石柱、拱、屋頂是 sprite（arcFront），迴廊裡的人才會在柱子後面 */
 const arcBack=(xa,xb)=>`<path d="M${xa},${ARC.y1} V${ARC.y0+40} H${xb} V${ARC.y1}Z" fill="#8f8470"/><path d="M${xa},${ARC.y0+40} H${xb} V${ARC.y0+60} H${xa}Z" fill="#7a705e" stroke="none"/><path d="M${xa},${ARC.y1-30} H${xb} V${ARC.y1} H${xa}Z" fill="#a89c84" stroke="none"/>`;
 g+=arcBack(X0,1150)+arcBack(1350,X1);

 g+=`<path d="M1146,${ARC.y1+8} V${ARC.y0-70} H1354 V${ARC.y1+8}Z" fill="#ece4d0"/>`+stn(1146,1354,ARC.y0-70,ARC.y1,22,40)+crn(1146,1354,ARC.y0-70,14,27.42,16,'#ece4d0');
 g+=`<path d="M1196,${ARC.y1+8} V${ARC.y0+30} Q1250,${ARC.y0-24} 1304,${ARC.y0+30} V${ARC.y1+8}Z" fill="#3a2e28"/><path d="M1204,${ARC.y0+34} Q1250,${ARC.y0-14} 1296,${ARC.y0+34}" fill="none" stroke="#4a4f5c" stroke-width="4"/>`;
 g+=`<path d="M1236,${ARC.y0-52} H1264 V${ARC.y0-40} Q1264,${ARC.y0-28} 1250,${ARC.y0-22} Q1236,${ARC.y0-28} 1236,${ARC.y0-40}Z" fill="#3f6f9a" stroke-width="1.8"/><path d="M1240,${ARC.y0-38} L1250,${ARC.y0-46} L1260,${ARC.y0-38}" fill="none" stroke="#e0b44a" stroke-width="2.4"/>`;
 return `<g stroke="${OL}" stroke-width="2" stroke-linejoin="round">${g}</g>`}

/* ================= 7. 建築與佈景、人群小故事 ================= */
Object.assign(POOL,{
 north18c:[['urn18c',.3],['flowersY',.4],['pebbles',.5],['bench18c',.15],['lamp18c',.25],['milk18c',.2],['brush18c',.2],['potbowl18c',.2],['rpin17',.2]],
 west18c:[['bush',.8],['flowersY',.8],['grassClump',1],['pebbles',.4],['tongs18c',.25],['milk18c',.25],['mortar18c',.25],['fern18c',.35],['mush18c',.3],['cinna18c',.15],['ladle18c',.2]],
 plaza18c:[['flowersY',.3],['pebbles',.5],['urn18c',.2],['beads18c',.25],['potbowl18c',.2],['mush18c',.2],['brush18c',.2],['rpin17',.15]],
 east18c:[['bush',.6],['flowersY',1],['grassClump',.6],['pebbles',.3],['lamp18c',.25],['beads18c',.25],['brush18c',.3],['fern18c',.25],['cinna18c',.2],['potbowl18c',.2]],
 lawn18c:[['bush',.6],['flowersY',.8],['grassClump',1.2],['pebbles',.4],['ladle18c',.3],['tongs18c',.2],['mortar18c',.2],['fern18c',.3],['mush18c',.3],['cinna18c',.2]],
 south18c:[['urn18c',.25],['pebbles',.5],['beads18c',.2],['lamp18c',.2],['cinna18c',.2],['potbowl18c',.2],['rpin17',.2]],
 decor18c:[['pebbles',1.2],['flowersY',.6],['grassClump',.8]]});
const grp=(x,y,w,h,kind,svg,say,o={})=>add(x,y,w,h,kind,svg,{say,...o});
const flower1=`<path d="M12,-20 L22,-40" fill="none" stroke="#5f9a48" stroke-width="2"/><circle cx="23" cy="-42" r="4" fill="#fbf6ea" stroke-width="1.2"/><circle cx="23" cy="-42" r="1.6" fill="#f5d34a" stroke="none"/>`;
const clarinet=`<path d="M8,-28 L20,-4" fill="none" stroke="${OL}" stroke-width="4.4" stroke-linecap="round"/><path d="M8,-28 L20,-4" fill="none" stroke="#2f2f3a" stroke-width="2.6" stroke-linecap="round"/><path d="M18,-6 l5,4 l-7,2Z" fill="#2f2f3a" stroke-width="1"/>`;
const stick=`<path d="M14,-20 L18,8" fill="none" stroke="${OL}" stroke-width="3.6"/><path d="M14,-20 L18,8" fill="none" stroke="#c9a46a" stroke-width="1.8"/>`;
const carrotB=`<g transform="translate(16,-18)"><path d="M-11,-2 Q-11,10 0,10 Q11,10 11,-2Z" fill="#c99a5b"/><path d="M-11,-2 H11" fill="none" stroke-width="1.6"/><path d="M-8,2 H8 M-6,6 H6" fill="none" stroke="#8a6a3a" stroke-width="1.1"/>`+
 [[-6,-2],[0,-3],[6,-2]].map(([x,y])=>`<path d="M${x-2},${y} L${x},${y-11} L${x+2},${y}Z" fill="#e8742a" stroke-width="1.1"/><path d="M${x},${y-11} l-2,-4 M${x},${y-11} l2,-4" fill="none" stroke="#5f9a48" stroke-width="1.6"/>`).join('')+`</g>`;
const easel=()=>`<path d="M-14,0 L-4,-62 M14,0 L4,-62 M0,4 V-40" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M-14,0 L-4,-62 M14,0 L4,-62 M0,4 V-40" fill="none" stroke="#a8784a" stroke-width="2.6"/>`+
 `<rect x="-20" y="-64" width="40" height="32" fill="#fbf6ea"/><path d="M-16,-40 Q-6,-52 4,-44 Q10,-40 16,-48" fill="none" stroke="#6faa5a" stroke-width="3"/><circle cx="-6" cy="-54" r="4" fill="#f0a8b8" stroke="none"/><path d="M8,-58 h6" fill="none" stroke="#5a8ee0" stroke-width="3"/><path d="M-22,-32 H22" fill="none" stroke="#7a5235" stroke-width="3"/>`;
const hoop=(x)=>`<path d="M${x-6},0 V-10 Q${x},-16 ${x+6},-10 V0" fill="none" stroke="${OL}" stroke-width="3.6"/><path d="M${x-6},0 V-10 Q${x},-16 ${x+6},-10 V0" fill="none" stroke="#fbfaf6" stroke-width="1.8"/>`;
const ball=(x,c)=>`<circle cx="${x}" cy="-4" r="4.6" fill="${c}" stroke-width="1.3"/>`;
const napTable=()=>`<rect x="-34" y="-30" width="68" height="8" rx="2" fill="#a8784a"/><path d="M-28,-22 V0 M28,-22 V0" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M-28,-22 V0 M28,-22 V0" fill="none" stroke="#8a5a30" stroke-width="2.6"/>`+
 [-22,-10,2,14].map((x,i)=>`<path d="M${x-5},-30 L${x},${-36-i%2*3} L${x+5},-30Z" fill="#fbfaf6" stroke-width="1.2"/>`).join('');
function structures(){
 /* 北：主殿大門兩側的衛兵、換班的衛兵、石甕 */
 grp(DOOR.x-92,DOOR.y+110,40,92,'guard18c',guard(1,'fq'),'衛兵：大餐廳正在準備今晚的宴會，現在只有受邀的客人能進去。');
 grp(DOOR.x+92,DOOR.y+110,40,92,'guard18c',guard(-1,'fq'),'衛兵：（站得筆直，偷偷聞到烤肉的香味⋯）');
 grp(1500,830,110,92,'change18c',T(-30,0,1,guard(1,'side','step'))+T(30,0,1,guard(-1,'side','step')),'衛兵：換班時間到！——左轉，齊步走！⋯咦，你怎麼往右轉？');
 [[900,770],[1600,770],[1150,950],[1350,950],[1150,1600],[1350,1600]].forEach(([x,y])=>add(x,y,38,50,'urn18c',urn(),{sh:.7}));
 /* 中：噴水池、吹豎笛的樂師、長椅 */
 const ft=add(FOUNT.x,FOUNT.y,300,150,'fount18c',fountain(),{sh:.9});ft.say='（噴水池的水嘩啦嘩啦地流，水面閃閃發亮）';
 grp(1066,1350,40,80,'clar18c',act(0,0,1,{view:'fq',pose:'hold',hat:HAT_BERET,shirt:'#7a3a5a',mood:1,extra:clarinet},'groove')+noteM(18,-82)+noteM(30,-70),'樂師：♪ 噴水池旁邊吹豎笛，聲音會跟著水花一起跳舞喔。');
 /* 2026-11-21 使用者：中間的白色長椅要有人坐 */
 /* 2026-11-21 使用者：坐著的人只有一隻腳（正面卻用了側坐的腳）→ 改成正面坐姿：兩條腿從椅面垂下（長度和走路的人一樣，2026-11-21 使用者：不要變長）；
    看書的人要雙手把書拿到眼睛高度 → read:true 時把兩隻手改成往上舉到臉前，再畫一本打開的書蓋在手上 */
 const sitLegs=c=>[-6.5,1].map(x=>`<rect x="${x}" y="-3" width="5.5" height="7" rx="2.6" fill="${c}"/>`).join('');
 const openBook=`<g transform="translate(0,-21)"><path d="M-11,-6.5 L-11,5 L0,6 L11,5 L11,-6.5 L0,-5.5Z" fill="#fbf6ea" stroke-width="1"/><path d="M-12,-5 Q-6,-7 0,-5.5 V6.5 Q-6,5 -12,6.5Z M12,-5 Q6,-7 0,-5.5 V6.5 Q6,5 12,6.5Z" fill="#8e2630" stroke-width="1.3"/><path d="M0,-5.5 V6.5" fill="none" stroke="#5a1820" stroke-width="2.2"/><path d="M-9,-2 H-3 M-9,3 H-3 M3,-2 H9 M3,3 H9" fill="none" stroke="#e0b44a" stroke-width="1"/><circle cx="-6" cy=".5" r="1.4" fill="#e0b44a" stroke="none"/><circle cx="6" cy=".5" r="1.4" fill="#e0b44a" stroke="none"/></g>`;   /* 書是朝著自己看的，玩家看到的是封面（2026-11-21 使用者） */
 const armsUp=svg=>svg.replace(/M(-?)6,-14 L(-?[\d.]+),(-?[\d.]+)/g,(m,sg,x,y)=>{const t=Math.min(1,Math.abs(+y+14)/6),X=(sg?-1:1)*(6+3.5*t),Y=-14-6*t;return `M${sg}6,-14 L${Math.round(X*10)/10},${Math.round(Y*10)/10}`});
 const sit=(x,o,an='nod')=>{const pa=o.pants||'#4a4f5c',read=o.read;const oo={view:'front',pose:'stand',arm:0,...o,extra:sitLegs(pa)+(o.extra||'')+(read?openBook:'')};delete oo.read;
  let svg=act(x,-12,1,oo,an);return read?armsUp(svg):svg};
 [[900,1192,sit(-14,{hat:-1,hs:3,hair:'#e8e4dc',shirt:'#6a3f8a',mood:1})+sit(14,{hat:HAT_BERET,hs:0,hair:'#e8e4dc',beard:true,shirt:'#2f4f8a',mood:1},'lean'),'老夫妻：年輕的時候，我們就是在這張椅子上認識的喔。'],
  [1600,1192,sit(-12,{hat:HAT_TIARA,hs:2,shirt:'#d98a9a',mood:1,read:true},false),'小姐：（在長椅上看書）⋯這本騎士故事好精采，停不下來！'],
  [900,1384,sit(-14,{hat:-1,shirt:'#3f6a4a',mood:0},false)+sit(16,{hat:HAT_BERET,shirt:'#a8502e',mood:4},'lean'),'貴族：呼⋯呼⋯（曬著太陽打起瞌睡）——旁邊的人：噓，別吵醒他。'],
  [1600,1384,sit(-14,{hat:-1,hs:2,shirt:'#7aa8c4',mood:1})+sit(14,{hat:-1,hs:1,shirt:'#c99a3a',mood:2},'nod')+`<g transform="translate(0,4)"><circle cx="-30" cy="0" r="3" fill="#a8906a" stroke-width="1"/><circle cx="34" cy="-2" r="3" fill="#a8906a" stroke-width="1"/></g>`,'小朋友：（撒麵包屑）麻雀麻雀，快過來吃！']
 ].forEach(([x,y,who,say])=>add(x,y,78,60,'bench18c',bench(who),{sh:.7,say}));
 /* 西：樹籬雕塑、迷宮拱門、修剪樹籬的園丁 */
 [[668,1150,'ball'],[846,1166,'swan'],[664,1452,'rabbit'],[852,1470,'ball'],[1130,1720,'swan'],[1380,1810,'ball']].forEach(([x,y,k])=>add(x,y,76,120,'topi18c',TOPI[k](),{sh:.8}));
 grp(760,1606,110,124,'trim18c',T(-24,0,.9,topiBall(true))+act(30,0,-1,{...gardener({hat:HAT_STRAW}),view:'fq',pose:'hold',mood:2,extra:stick},'nod'),'園丁：嗯⋯左邊好像剪太多了？沒關係，就說這是「流行的造型」！');
 /* 南邊草坪：槌球比賽、寫生、騎士獻花、追孔雀 */
 grp(940,1720,180,70,'croq18c',hoop(-60)+hoop(10)+hoop(70)+ball(-30,'#d8413a')+ball(40,'#4f86c4')+
  act(-70,0,1,{view:'back',pose:'crouch',hat:HAT_BERET,mood:2},'work')+act(10,4,-1,{view:'fq',pose:'up',mood:3,shirt:'#b8667a',extra:gown('#b8667a')},'nod'),'貴族：我的黃色球呢？——好像滾進花壇裡了⋯園丁會不會生氣啊？');
 grp(1560,1796,150,90,'paint18c',T(-30,0,1,easel())+act(-62,0,1,{view:'side',pose:'reach',hat:HAT_BERET,shirt:'#4a6a3a',mood:1},'work')+act(40,0,-1,{view:'fq',pose:'stand',hat:HAT_TIARA,hs:2,shirt:'#d98a9a',mood:1,extra:gown('#d98a9a')},'lean'),'畫家：請不要動⋯小姐，妳又在偷看噴水池了！');
 grp(1100,1590,100,80,'knee18c',act(-24,0,1,{view:'side',pose:'crouch',hat:-1,hs:0,shirt:'#c4cad2',pants:'#8a929c',mood:1,extra:flower1},'nod')+act(26,0,-1,{view:'side',pose:'stand',hat:HAT_TIARA,hs:4,shirt:'#7aa8c4',mood:3,extra:gown('#7aa8c4')},'lean'),'騎士：美麗的小姐，這朵花送給妳！——小姐：哎呀，臉好紅⋯');
 grp(1430,1600,120,70,'chase18c',T(-30,0,.8,kid({view:'side',pose:'reach',hat:-1,mood:1}))+T(30,2,.9,peacock()),'小朋友：孔雀孔雀，打開你的尾巴給我看嘛！');
 /* 2026-11-21 使用者：要有部分孔雀開屏 → 4 隻裡 2 隻一直開著（點了會收起來 3 秒），2 隻收著（點了開屏） */
 [[1150,876,1],[640,1668,0],[1580,1625,1],[1440,960,0]].forEach(([x,y,o],i)=>{const sp=add(x,y,o?110:56,o?70:46,'pcock18c',peacock(!!o),{fl:i%2===0,sh:.6});sp.open=!!o});
 /* 東：玫瑰拱門步道、涼亭下午茶 */
 [1172,1300,1428].forEach(y=>{const s=add(1705,y,96,150,'rarch18c',roseArch(),{sh:.85});s.say='（玫瑰拱門下面香香的，有蜜蜂嗡嗡飛）'});
 grp(1740,1660,200,180,'gaz18c',gazebo(),'貴族：再來一杯紅茶⋯哎呀，倒太滿了，都流到碟子上了！',{sh:.9});
 /* 2026-11-21 使用者：迷宮、塔樓往外移之後，空出來的地方多放一些人和東西 */
 const books=`<g transform="translate(0,-60)">${['#8e2630','#2f4f8a','#3f6a4a','#c99a3a','#6a3f8a','#a8502e'].map((c,i)=>`<rect x="${-10+(i%2)*3}" y="${-i*6}" width="20" height="6" rx="1" fill="${c}" stroke-width="1.1"/>`).join('')}<g transform="translate(6,-40) rotate(25)"><rect x="-10" y="-3" width="20" height="6" rx="1" fill="#1f5f6a" stroke-width="1.1"/></g></g>`;
 const kiteS=`<path d="M14,-30 Q40,-90 46,-150" fill="none" stroke="#f4ecd6" stroke-width="1.2"/><g transform="translate(48,-156)"><path d="M0,-16 L11,0 L0,16 L-11,0Z" fill="#d8413a" stroke-width="1.5"/><path d="M0,-16 V16 M-11,0 H11" fill="none" stroke="#f5d34a" stroke-width="1.4"/><path d="M0,16 q-6,8 0,14 q6,6 0,12" fill="none" stroke="#4f86c4" stroke-width="1.6"/></g>`;
 const rake=`<path d="M12,-20 L22,4" fill="none" stroke="#a8703f" stroke-width="2.6"/><path d="M16,4 H30 M18,4 v4 M22,4 v4 M26,4 v4" fill="none" stroke="#5a5e6a" stroke-width="1.8"/>`;
 const sniff=`<g transform="translate(14,-30)">${'<circle cx="0" cy="0" r="3" fill="#f0a8b8" stroke-width="1"/>'}<path d="M0,3 V12" fill="none" stroke="#5f9a48" stroke-width="1.6"/></g>`;
 /* 西：迷宮拱門前探頭的一家人、耙碎石的園丁 */
 grp(790,866,100,80,'peek18c',T(-26,0,.8,kid({view:'bq',pose:'reach',hat:-1,mood:1}))+act(20,0,-1,{view:'fq',pose:'hold',hat:HAT_BERET,shirt:'#1f5f6a',mood:2},'nod'),'小朋友：爸爸，這面樹籬好高喔，後面有什麼？——爸爸：應該就是一大片樹籬吧⋯');
 grp(712,1120,50,70,'rake18c',act(0,0,1,{...gardener(),view:'side',pose:'reach',mood:1,extra:rake},'work'),'園丁：碎石小路要耙得整整齊齊，客人走起來才舒服。');
 /* 東：塔樓前抱著一疊書的管理員、看書的小朋友 */
 grp(1800,1030,50,110,'libr18c',act(0,0,-1,{view:'fq',pose:'up2',hat:-1,hs:0,hair:'#c9c4bc',shirt:'#4a3a6a',mood:2,extra:books},'step'),'管理員：這些書要搬回塔樓⋯哎呀，最上面那本快掉下來了！');
 grp(1650,1020,70,60,'kidread18c',T(-14,0,.8,kid({view:'front',pose:'crouch',hat:-1,mood:1}))+T(16,0,.8,kid({view:'side',pose:'crouch',hat:-1,mood:3})),'小朋友：這本圖畫書裡有會噴火的龍耶！——另一個：好可怕，翻下一頁快！');
 /* 北邊空地：放風箏的小孩、聞花香的貴婦人 */
 grp(1660,880,60,170,'kite18c',act(0,0,1,{view:'bq',pose:'up',hat:-1,mood:1,extra:kiteS},'step'),'小朋友：風來了！風箏飛得比塔樓還高！');
 grp(860,880,50,80,'smell18c',act(0,0,1,{view:'side',pose:'hold',hat:HAT_TIARA,hs:2,shirt:'#7aa8c4',mood:1,extra:gown('#7aa8c4')+sniff},'nod'),'貴婦人：嗯——宮廷院的玫瑰今天特別香。');
 [[760,1060],[1760,1110]].forEach(([x,y])=>add(x,y,38,50,'urn18c',urn(),{sh:.7}));
 /* 南：迴廊（2026-11-21 使用者：迴廊裡面要有人在互動）。人站在柱子之間，前面的石柱 sprite 排在人的後面畫 */
 const AY=ARC.y1-12;
 const fan=`<g transform="translate(13,-24)"><path d="M0,0 L-7,-9 Q0,-13 7,-9Z" fill="#f4ecd6" stroke-width="1.1"/><path d="M0,0 L-3,-11 M0,0 L3,-11" fill="none" stroke="#c9b48a" stroke-width=".9"/></g>`;
 const book=`<g transform="translate(12,-22)"><rect x="-7" y="-5" width="14" height="10" rx="1" fill="#6a3f2a" stroke-width="1.1"/><path d="M0,-5 V5" fill="none" stroke="#f4ecd6" stroke-width="1.4"/></g>`;
 const harpS=`<g transform="translate(13,-22)"><path d="M-4,8 L-4,-12 Q6,-12 7,4Z" fill="none" stroke="${OL}" stroke-width="3.4"/><path d="M-4,8 L-4,-12 Q6,-12 7,4Z" fill="none" stroke="#c99a3a" stroke-width="1.8"/><path d="M-2,-8 V6 M1,-8 V5 M4,-5 V4" fill="none" stroke="#f4ecd6" stroke-width=".8"/></g>`;
 const cart=`<g transform="translate(26,0)"><path d="M-14,-24 H14 V-8 H-14Z" fill="#a8784a"/><circle cx="-9" cy="-4" r="4" fill="#5a3a20" stroke-width="1.2"/><circle cx="9" cy="-4" r="4" fill="#5a3a20" stroke-width="1.2"/><path d="M-10,-24 L-8,-32 H8 L10,-24Z" fill="#f6c8d4" stroke-width="1.2"/><circle cx="-3" cy="-34" r="3" fill="#d8413a" stroke-width="1"/><circle cx="4" cy="-34" r="3" fill="#fbf6ea" stroke-width="1"/></g>`;
 const broom=`<path d="M12,-20 L18,4" fill="none" stroke="#a8703f" stroke-width="2.4"/><path d="M14,2 L24,6 L20,8 Z" fill="#d9c08a" stroke-width="1"/>`;
 grp(664,AY,90,80,'hide18c',T(-30,0,.8,kid({view:'back',pose:'up2',hat:-1,mood:1}))+T(26,0,.8,kid({view:'side',pose:'crouch',hat:-1,mood:1}),true),'小朋友：（躲在柱子後面）嘻嘻⋯一、二、三，找不到我吧！');
 grp(792,AY,60,80,'ladies18c',act(-14,0,1,{view:'side',pose:'hold',hat:HAT_TIARA,hs:2,shirt:'#b8667a',mood:1,extra:gown('#b8667a')+fan},'nod')+act(16,0,-1,{view:'side',pose:'stand',hat:HAT_BERET,shirt:'#3f6a4a',mood:3,extra:gown('#3f6a4a')},'lean'),'貴婦人：聽說今晚的宴會有烤全豬喔！——另一位：噓，小聲點，國王還沒宣布呢！');
 grp(936,AY,50,80,'scholar18c',act(0,0,1,{view:'fq',pose:'hold',hat:-1,hs:0,hair:'#e8e4dc',beard:true,shirt:'#4a3a6a',mood:2,extra:book},'nod'),'老學者：這本書是從東邊塔樓借來的，裡面畫滿了古老的地圖⋯');
 grp(1080,AY,64,80,'harp18c',act(-14,0,1,{view:'fq',pose:'hold',hat:HAT_BERET,shirt:'#7a3a5a',mood:1,extra:harpS},'groove')+act(18,0,-1,{view:'side',pose:'stand',mood:1},'nod')+noteM(-2,-84),'樂師：♪ 迴廊裡的回音最好聽了，你也來聽一首吧！');
 grp(1458,AY,90,80,'tcart18c',act(-16,0,1,{...maidO(),view:'side',pose:'reach',mood:1,extra:cart},'step'),'侍女：茶點要送去涼亭囉，請讓一讓！');
 grp(1602,AY,64,80,'knights18c',act(-14,0,1,{view:'side',pose:'hold',hat:HAT_HELM,shirt:'#c4cad2',pants:'#8a929c',mood:2},'nod')+act(16,0,-1,{view:'side',pose:'stand',hat:-1,hs:1,shirt:'#c4cad2',pants:'#8a929c',mood:1},'lean'),'騎士：比武大會累死我了⋯晚上一定要多吃兩塊肉！');
 grp(1746,AY,64,70,'pup18c',T(-12,0,.8,kid({view:'side',pose:'reach',hat:-1,mood:1}))+T(16,0,1,H.KIND.dog?H.KIND.dog.fn():''),'小男孩：小狗狗，握手！——（小狗伸出了左腳）');
 grp(1818,AY,40,80,'sweep18c',act(0,0,-1,{...maidO(),view:'side',pose:'reach',mood:1,extra:broom},'work'),'女僕：迴廊的地板要擦得亮晶晶，晚上客人才會走這裡！');
 {const sp=add(0,TOW.y+30,4,4,'towF18c',`<g transform="translate(0,${-(TOW.y+30)})" stroke="${OL}" stroke-width="2" stroke-linejoin="round">${towS}</g>`,{mark:false});sp.y=TOW.y+30}
 [[H.SCENES[N].x0-420,1150],[1350,H.SCENES[N].x1+420]].forEach(([a,b])=>{const sp=add(0,ARC.y1+1,4,4,'arcF18c',arcFront(a,b),{mark:false});sp.y=ARC.y1+1});
 /* 南：迴廊前摺餐巾的侍女 */
 grp(880,2070,110,70,'nap18c',napTable()+act(-30,0,1,{...maidO(),view:'side',pose:'reach',mood:1},'work')+act(32,0,-1,{...maidO({hat:-1,hs:3}),view:'fq',pose:'reach',mood:2},'work'),'侍女：餐巾要摺成天鵝的樣子⋯咦，怎麼摺成鴨子了？');
 /* 不能放東西的地方：主殿（侍從站的石階下留給晚宴入口）、迷宮、塔樓、花壇、迴廊、故事角色的固定位置 */
 mk(600,0,1900,DOOR.y+86);mk(MAZE.x0,MAZE.y0,MAZE.x1+4,MAZE.y1);mk(TOW.x-90,620,1900,TOW.y+14);
 PART.forEach(([cx,cy])=>mk(cx-PW/2-6,cy-PHt/2-4,cx+PW/2+6,cy+PHt/2+12));
 mk(1636,1380,1846,1600);   /* 涼亭後面（圓頂擋住的地方）不放東西 */
 mk(600,ARC.y0-80,1900,ARC.y1+12);
 Object.values(SPOT).forEach(([x,y])=>mk(x-40,y-90,x+40,y+8));
}
function scatterAll(){
 /* 故事角色搬到固定的地方 */
 const S=H.dbg.storySp();if(S){moveSp(S.giver,SPOT.giver);moveSp(S.target,SPOT.target);moveSp(S.helper,SPOT.helper)}
 scatter('north18c',POOL.north18c,1600,14);scatter('west18c',POOL.west18c,2600,34);scatter('plaza18c',POOL.plaza18c,1600,12);
 scatter('east18c',POOL.east18c,2600,30);scatter('lawn18c',POOL.lawn18c,3200,40);scatter('south18c',POOL.south18c,1800,16);
 scatter('all18c',POOL.decor18c,3000,30);
}
const CELL=H.CELL,occ=H.occ,GC=H.GC,GR=H.GR;
function clearCells(x,y,w,h){const a=Math.floor((x-w*.3)/CELL),c=Math.floor((x+w*.3)/CELL),b=Math.floor((y-h*.5)/CELL),d=Math.floor(y/CELL);for(let j=Math.max(0,b);j<=Math.min(GR-1,d);j++)for(let i=Math.max(0,a);i<=Math.min(GC-1,c);i++)occ[j*GC+i]=0}
function moveSp(sp,p){if(!sp||!p)return;clearCells(sp.x,sp.y,sp.w,sp.h);const[x,y]=p;sp.svg=sp.svg.replace(/translate\([^)]*\)/,`translate(${f(x)},${f(y)})`).replace(/data-x="[^"]*" data-y="[^"]*"/,`data-x="${f(x)}" data-y="${f(y)}"`);sp.x=x;sp.y=y}
SCENE_IMPL[N]={ground,structures,scatter:scatterAll};
/* 人要多：照晚宴的密度（路上 1.5 倍） */
Object.assign(VPLAN,{north18c:{chat:5,walker:6,handInHand:2},west18c:{walker:4,chat:3,handInHand:1},plaza18c:{chat:4,walker:5,handInHand:2,reading:1},
 east18c:{walker:4,chat:3,handInHand:2,reading:1},lawn18c:{chat:5,walker:6,dogWalk:2,throwCatch:1},south18c:{chat:6,walker:7,handInHand:2,dogWalk:1}});
HOSTK.add('topi18c');HOSTK.add('urn18c');HOSTK.add('bench18c');HOSTK.add('rarch18c');HOSTK.add('gaz18c');
Object.assign(HOSTN,{topi18c:'樹籬雕塑',urn18c:'石甕花盆',bench18c:'白色長椅',rarch18c:'玫瑰拱門',gaz18c:'涼亭'});
/* 物件的合理位置：每種最多一個台子（涼亭茶桌）選項，其他放在雕塑、長椅、石甕、人群旁；BLEND 是顏色相近的東西 */
H.SPOTS[N]={
 scroll17:[['guard18c',.04,.7],['bench18c',.4,.2],['nap18c',.03,.6]],
 shears18c:[['topi18c',.04,.6],['trim18c',.03,.6]],
 can18c:[['urn18c',.05,.7],['rarch18c',.03,.6],['topi18c',.04,-.6]],
 pearl18c:[['bench18c',.4,-.2],['knee18c',.03,.6],['paint18c',.03,.6]],
 mallet18c:[['croq18c',.03,.6],['bench18c',.05,.6],['topi18c',.04,.6]],
 cage18c:[['rarch18c',.03,-.6],['urn18c',.05,-.7],['guard18c',.04,-.7]],
 rose18c:[['rarch18c',.03,.6],['knee18c',.03,-.6],['urn18c',.05,.7]],
 cup18c:[['gaz18c',()=>[Math.random()*40-20,-64]],['bench18c',.4,.25],['nap18c',.03,-.6]],
 sundial18c:[['topi18c',.04,.6],['urn18c',.05,-.7],['croq18c',.03,-.6]],
 feather18c:[['pcock18c',.05,.7],['chase18c',.03,.6],['topi18c',.04,-.6]],
 parasol18c:[['bench18c',.05,-.6],['paint18c',.03,-.6],['fount18c',.04,.55]],
 snail18c:[['topi18c',.04,.6],['rarch18c',.03,.6],['urn18c',.05,.7]]};
H.BLEND[N]={scroll17:['rpin17','pebbles'],shears18c:['tongs18c','bush'],can18c:['milk18c','urn18c'],pearl18c:['beads18c','pebbles'],mallet18c:['ladle18c','grassClump'],
 cage18c:['lamp18c','flowersY'],rose18c:['brush18c','flowersY'],cup18c:['potbowl18c','bench18c'],sundial18c:['mortar18c','pebbles'],feather18c:['fern18c','bush'],
 parasol18c:['mush18c','flowersY'],snail18c:['cinna18c','pebbles']};

/* ================= 8. 連環小故事：躲進樹籬雕塑的小白兔 ================= */
/* 小白兔：白色、粉紅耳朵、脖子綁藍色緞帶 */
const bunny=()=>`<path d="M-10,0 Q-14,-14 -4,-18 Q8,-20 11,-8 Q12,0 8,0Z" fill="#fbfaf6"/><circle cx="-12" cy="-8" r="4" fill="#fbfaf6"/>`+
 `<path d="M-1,-30 Q-6,-46 -1,-48 Q4,-46 2,-30Z" fill="#fbfaf6"/><path d="M-1,-32 Q-3,-42 -1,-44 Q1,-42 1,-32Z" fill="#f4a8b4" stroke="none"/><path d="M5,-30 Q6,-46 11,-46 Q14,-42 8,-29Z" fill="#fbfaf6"/><path d="M6,-31 Q8,-42 10,-43 Q11,-40 8,-31Z" fill="#f4a8b4" stroke="none"/>`+
 `<circle cx="4" cy="-23" r="9" fill="#fbfaf6"/><circle cx="7" cy="-25" r="1.5" fill="${OL}" stroke="none"/><circle cx="12" cy="-21" r="1.3" fill="#f08a9a" stroke="none"/><path d="M10,-19 q1,1.6 2,0" fill="none" stroke="#9a8a7a" stroke-width=".9"/>`+
 `<path d="M-4,-15 Q4,-12 11,-15" fill="none" stroke="#3f7ad0" stroke-width="3"/><path d="M4,-13 l-5,4 l3,1 Z M4,-13 l4,5 l-3,1Z" fill="#3f7ad0" stroke-width="1"/>`;
/* 兩隻兔子樹籬中間夾著小白兔，前面一叢矮樹籬擋住牠的腳 */
const bunnyHide=()=>T(-44,0,.82,topiRabbit())+T(46,0,.82,topiRabbit(),true)+T(2,-14,1,bunny())+
 `<g transform="translate(0,-2)">${blob(-10,-6,14,9)}${blob(12,-6,14,9)}</g>`;
const tiaraP=HAT_TIARA;
const pinkGown=gown('#f0a8c0');
STORIES[N]={title:'躲進樹籬雕塑的小白兔',who:'小公主',
 giver:()=>act(0,0,1,{view:'fq',pose:'reach',hat:tiaraP,hs:4,hair:'#e8c05a',mood:2,skin:'#f2d2b4',shirt:'#f0a8c0',top:'long',bottom:'pants',pants:'#f0a8c0',extra:pinkGown}),
 target:()=>bunnyHide(),tw:150,th:110,
 helper:()=>act(0,0,1,{...gardener({hat:HAT_STRAW}),view:'fq',pose:'hold',mood:1,beard:true,hair:'#e8e4dc',hs:1,skin:'#e8c4a0',extra:apronG+carrotB}),hw:56,hh:76,
 ask:'小公主：我的小白兔不見了！牠脖子上綁著藍色緞帶，剛剛還在花壇邊吃草⋯',
 need:'小白兔夾在兩隻兔子樹籬中間，假裝自己也是雕塑，一伸手牠就往裡面躲⋯聽說園丁爺爺有一籃新鮮的胡蘿蔔！',
 got:'園丁爺爺：混在兔子樹籬裡啊？用胡蘿蔔引牠出來就行了！',
 ok:'小白兔聞到胡蘿蔔香，蹦蹦跳跳跑出來，藍色緞帶還好好的。快帶回去給小公主！'};

/* ================= 9. 冒險地圖與過場 ================= */
/* 冒險地圖：不另外放節點（隸屬奇幻小鎮）；levels.js 的 map 只給名稱、卡片用 */
HERE[N]=[100,170];
/* 過場：穿過主堡大門的石頭拱道，前面越來越亮，看到陽光下的花園和噴水池；拱道慢慢放大到畫面外（往前走），地面紋路往下捲 */
RIDES.court18c={text:'穿過主堡大門的拱道，走進宮廷院⋯',every:460,tick:k=>tone(k%2?392:330,.08,'triangle',.03),
 svg:()=>{let s=`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><style>.ga18c{transform-origin:200px 330px;animation:ga18c 4.3s ease-in forwards}@keyframes ga18c{from{transform:scale(1)}to{transform:scale(3.2)}}`+
   `.gd18c{transform-origin:200px 330px;animation:gd18c 4.3s ease-in forwards}@keyframes gd18c{from{transform:scale(.78)}to{transform:scale(1.12)}}`+
   `.rl18c{animation:rl18c .9s linear infinite}@keyframes rl18c{to{transform:translateY(60px)}}.wk18c{animation:wk18c .45s ease-in-out infinite alternate}@keyframes wk18c{to{transform:translateY(-3px)}}</style>`;
  s+=`<g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect width="400" height="600" fill="#d6ebf5" stroke="none"/>`;
  /* 花園（遠景，慢慢靠近） */
  s+=`<g class="gd18c"><circle cx="320" cy="90" r="22" fill="#fdf0c0" stroke="none"/><path d="M0,230 Q100,200 200,222 Q300,196 400,226 V600 H0Z" fill="#a9c3b2" stroke="none"/>`;
  s+=`<path d="M70,286 V200 H330 V286Z" fill="#ece4d0" stroke-width="1.6"/><path d="M62,200 L84,176 H316 L338,200Z" fill="#5c6f96" stroke-width="1.6"/><path d="M170,286 V160 H230 V286Z" fill="#f2ead8" stroke-width="1.6"/><path d="M164,160 L200,118 L236,160Z" fill="#5c6f96" stroke-width="1.6"/>`;
  s+=[96,124,276,304].map(x=>`<path d="M${x-6},262 V228 Q${x},218 ${x+6},228 V262Z" fill="#9cc4d8" stroke-width="1.2"/>`).join('')+`<path d="M186,286 V252 Q200,236 214,252 V286Z" fill="#7a4e32" stroke-width="1.4"/>`;
  s+=`<rect y="286" width="400" height="600" fill="#9fc060" stroke="none"/><path d="M176,286 H224 L340,860 H60Z" fill="#ebe1c6" stroke="none"/>`;
  s+=[[60,330],[340,330],[40,420],[360,420]].map(([x,y])=>`<g transform="translate(${x},${y}) scale(${(y-200)/260})"><rect x="-50" y="-22" width="100" height="44" rx="10" fill="${GD}"/><rect x="-42" y="-16" width="84" height="32" rx="8" fill="#8a6a46"/><circle cx="-20" cy="-4" r="5" fill="#d8413a" stroke-width="1"/><circle cx="0" cy="4" r="5" fill="#f5d34a" stroke-width="1"/><circle cx="20" cy="-4" r="5" fill="#f0a8b8" stroke-width="1"/></g>`).join('');
  s+=`<g transform="translate(200,372) scale(.62)">${fountain()}</g>`;
  s+=[[110,316],[290,316]].map(([x,y])=>`<g transform="translate(${x},${y}) scale(.45)">${topiRabbit()}</g>`).join('');
  s+=`</g>`;
  /* 地面紋路往下捲 */
  s+=`<g clip-path="inset(420px 0 0 0)"><g class="rl18c">${[400,460,520,580,640].map((y,i)=>`<path d="M${130-i*16},${y} q10,-4 20,0 M${250+i*14},${y+20} q10,-4 20,0" fill="none" stroke="#c9bf9f" stroke-width="2"/>`).join('')}</g></g>`;
  /* 前景：石頭拱道（越走越大，拱門滑出畫面） */
  const GA='M-400,-200 H800 V900 H-400Z M120,520 V250 Q200,150 280,250 V520Z';
  s+=`<defs><clipPath id="gac18c"><path d="${GA}" clip-rule="evenodd"/></clipPath></defs><g class="ga18c"><path d="${GA}" fill="#8f8470" fill-rule="evenodd"/>`+
   `<g clip-path="url(#gac18c)">${stn(-60,460,0,600,24,50,'#7a705e')}</g><path d="M120,520 V250 Q200,150 280,250 V520" fill="none" stroke="#6a6050" stroke-width="10"/></g>`;
  s+=`<g transform="translate(250,576) scale(1.25)"><g class="wk18c">${kid({view:'back',pose:'walk',hat:-1,hs:0,top:'tee',bottom:'pants'})}</g></g>`;
  s+=`<g transform="translate(150,566) scale(1.15)"><g class="wk18c">${kid({view:'back',pose:'walk',hat:-1,hs:0,hair:'#c9c4bc',shirt:'#2f2f3a',top:'long',bottom:'pants',pants:'#2f2f3a'})}</g></g>`;
  return s+`</g></svg>`}};

/* ================= 10. 場景彩蛋：點噴水池 → 水柱噴高＋彩虹；點孔雀 → 開屏；點迷宮拱門、塔樓側門 → 之後的伏筆 ================= */
const domOf=sp=>document.querySelector(`#bg [data-n="${sp.n}"]`);
H.TAPHOOKS[N]=(x,y)=>{const sps=H.sprites||[];
 if(Math.abs(x-FOUNT.x)<130&&y>FOUNT.y-200&&y<FOUNT.y+10){const sp=sps.find(s=>s.kind==='fount18c'),el=sp&&domOf(sp);
  if(el){const b=el.querySelector('.jb18c');if(b){b.setAttribute('opacity','1');clearTimeout(sp._t);sp._t=setTimeout(()=>b.setAttribute('opacity','0'),3200)}}
  H.burst(FOUNT.x,FOUNT.y-170);H.toast('⛲ 嘩——！水柱一下子噴得好高，還掛起了一道小彩虹！',2200);[523,659,784].forEach((q,i)=>tone(q,.16,'sine',.04,i*.08));return true}
 for(const sp of sps){if((sp.kind==='pcock18c'||sp.kind==='chase18c')&&Math.abs(x-sp.x)<(sp.kind==='chase18c'?60:sp.open?50:30)&&y>sp.y-(sp.open?75:50)&&y<sp.y+6){
  const el=domOf(sp),op=!!sp.open;if(el){const a=el.querySelectorAll('.pf18c'),t=el.querySelectorAll('.pt18c'),set=v=>{a.forEach(e=>e.setAttribute('opacity',v?'1':'0'));t.forEach(e=>e.setAttribute('opacity',v?'0':'1'))};set(!op);clearTimeout(sp._t);sp._t=setTimeout(()=>set(op),3000)}
  H.burst(sp.x,sp.y-40);H.toast(sp.kind==='chase18c'?'小朋友：哇——！孔雀真的開屏了！好漂亮！':op?'🦚 孔雀害羞地把尾巴收起來了⋯過一下又會打開喔。':'🦚 刷——！孔雀把尾巴整個打開了！',2000);tone(880,.08,'triangle',.04);tone(1175,.12,'triangle',.04,.08);return true}}
 if(Math.abs(x-TOW.x)<28&&y>TOW.y-80&&y<TOW.y+10){H.burst(TOW.x,TOW.y-40);H.toast('📚 小側門關著⋯門縫裡飄出舊書和墨水的味道。',2400);tone(262,.1,'triangle',.04);return true}
 return false};
})();

/* ================= 入口：第 17 關城門廣場，主堡大門前的管家 =================
   levels.js 這一關有 find:{after:17,from:17,hint:[…]}：發現城門廣場、而且城門廣場拿到 2 顆星之後，主堡大門前的石階下出現管家（頭上有「…」）；
   點管家 → 「要進宮廷院看看嗎？」→ 出發才算發現。這個檔案在第 17 關載入時會一起載入（ensureFull）。
   管家站在主堡石階正下方（第 17 關本來就把主堡一帶標成不能擺東西），所以第 17 關的其他東西位置不受影響。
   （2026-11-21 以前這個入口是去奇幻晚宴；晚宴改成第 20 關，入口搬到宮廷院北邊的主殿大門。） */
(function(){
const H=window.TH;if(!H)return;const N=18;const {T,OL,act}=H;
const EX={x:1250,y:714};
(H.RESERVE[17]||(H.RESERVE[17]=[])).push([EX.x,EX.y+4,70,60]);
const cravat=`<path d="M-3,-17 L0,-12 L3,-17Z" fill="#fbf9f2" stroke-width="1"/>`,towel=`<path d="M-12,-17 Q-16,-12 -14,-4 L-9,-6 L-9,-15Z" fill="#fbf9f2" stroke-width="1.1"/>`;
let bs=null;const butler=()=>bs||(bs=act(0,0,1,{view:'fq',pose:'hold',hat:-1,hs:0,hair:'#c9c4bc',skin:'#f0cfae',shirt:'#2f2f3a',top:'long',bottom:'pants',pants:'#2f2f3a',mood:1,extra:cravat+towel}));
const svg=found=>T(0,0,.95,(found?'':`<g class="qbob">${H.bubble(14,-74,'dots').replace(/r="1\.7"/g,'r="1.75"')}</g>`)+butler());
const pv=()=>`<svg viewBox="0 0 220 110" width="220" height="110" style="display:block"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect x="0" y="0" width="220" height="110" rx="10" fill="#d6ebf5" stroke="none"/>`+
 `<path d="M30,62 V30 H190 V62Z" fill="#ece4d0" stroke-width="1.4"/><path d="M24,30 L36,20 H184 L196,30Z" fill="#5c6f96" stroke-width="1.4"/><path d="M92,62 V16 H128 V62Z" fill="#f2ead8" stroke-width="1.4"/><path d="M88,16 L110,0 L132,16Z" fill="#5c6f96" stroke-width="1.4"/>`+
 `<rect x="0" y="62" width="220" height="48" fill="#9fc060" stroke="none"/><path d="M96,62 H124 L150,110 H70Z" fill="#ebe1c6" stroke="none"/>`+
 `<rect x="20" y="70" width="52" height="24" rx="6" fill="#3c6e30" stroke-width="1.4"/><rect x="148" y="70" width="52" height="24" rx="6" fill="#3c6e30" stroke-width="1.4"/>`+[[34,80,'#d8413a'],[48,84,'#f5d34a'],[60,78,'#f0a8b8'],[160,82,'#f0a8b8'],[174,78,'#d8413a'],[188,84,'#f5d34a']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="3.4" fill="${c}" stroke-width="1"/>`).join('')+
 `<ellipse cx="110" cy="82" rx="26" ry="7" fill="#ece6d8" stroke-width="1.4"/><ellipse cx="110" cy="81" rx="20" ry="4.4" fill="#8cc4d4" stroke="none"/><path d="M107,80 V62 H113 V80Z" fill="#ece6d8" stroke-width="1.2"/><path d="M110,60 Q110,46 102,52 M110,60 Q110,46 118,52" fill="none" stroke="#d4eef4" stroke-width="2.4"/>`+
 `<g transform="translate(184,106) scale(.55)">${butler()}</g></g></svg>`;
H.EXITS[N]={x:EX.x,y:EX.y,w:64,h:72,svg,ask:{pv,title:'要進宮廷院看看嗎？',
 text:'管家：國王今晚為冠軍騎士辦慶功宴，<br>宴會開始前，宮廷院的花園開放給大家散步。要我帶你進去嗎？',again:'管家：歡迎再度光臨！<br>花園的噴水池今天也很漂亮喔。',
 go:'⛲ 跟管家進宮廷院',wait:'之後再說',waitMsg:'管家：好的，我會在門口恭候您。'}};
})();
