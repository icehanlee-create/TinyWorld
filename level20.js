/* 奇幻小鎮大搜查．城堡系列〔奇幻晚宴〕（2026-11-20 使用者把關卡名從「奇幻大餐廳」改成「奇幻晚宴」）（找路發現的新關卡，編號 20 只是程式用）
   2026-11-21 使用者：城堡系列改成 17 城門廣場 → 18 宮廷院 → 19 圖書館／20 奇幻晚宴／樹籬迷宮（秘境）。這一關從原本的 18 改成 20；
   kind、物件 id 的後綴「18」照舊不改（改號只改 const N、入口）。
   入口：第 18 關宮廷院北邊主殿大門前的侍從——程式在這個檔案最後面（H.RESERVE[18]／H.EXITS[20]）。
   使用者 2026-11-20 決定：城堡系列第二關＝奇幻大餐廳；入口是第 17 關主堡大門；第 17 關拿 2 星後才出現管家（find:{after:17,from:17}）；
   冒險地圖不另外放節點（和城門廣場一樣隸屬奇幻小鎮）。
   氣氛：入夜不久（藍色時刻）：北牆高窗外是深藍紫的夜空＋一點晚霞、月亮剛升起；室內靠浮空蠟燭、壁爐暖光照亮。
   只用一般奇幻共通元素（浮空蠟燭、長木桌、高窗、宴會），不放學院旗、分類帽、會顯示天空的天花板等特定作品的東西；長桌 3 張。
   國王為比武大會的冠軍騎士辦慶功宴。
   場景（上北下南）：北牆高窗＋王室掛毯 → 高台主桌（國王、王后、冠軍騎士）＋兩側守護騎士、牆上小火炬 → 3 張長桌（賓客、浮空蠟燭）＋西邊樂師台和舞池、東邊點心桌和酒桶
                     → 西南後廚（隔一道拱門牆：烤全豬、麵包窯、燉湯大鍋、洗碗）→ 東南玄關（管家迎賓、斗篷架、下棋的貴族）。
   新名字都以 18 結尾。 */
(function(){
const H=window.TH;if(!H)return;
const N=20;
const {T,f,r,sr,pk,OL,kid,act,add,mark,scatter,KIND,POOL,VPLAN,REG,SCREG,LEVELS,ART,DECOY,
 SCENE_IMPL,RIDES,HERE,OUTFITS,STORIES,HOSTK,HOSTN,tone,typeOf,HATS,noteM,barrel,crate}=H;
const mk=(x0,y0,x1,y1)=>mark((x0+x1)/2,y1,x1-x0,y1-y0,1);   /* 佔掉一個長方形（左上、右下） */
const sh=(rx,ry=6)=>`<ellipse cx="0" cy="3" rx="${rx}" ry="${ry}" fill="#000" opacity=".16" stroke="none"/>`;
const an=(a,d,inner)=>`<g class="an a-${a}" style="--d:${d}s;animation-delay:-${f(sr(0,3))}s">${inner}</g>`;
const tube=(d,c,w=3.4)=>`<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w+2.6}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;

/* ================= 1. 場景範圍、場地外（暗暗的石牆＋石柱） ================= */
H.SCENES[N]={x0:600,x1:1900,y1:2150,c:[1520,1880]};
H.TARGET[N]=330;
H.SKYC[N]='#3a2c25';H.SKYY[N]=0;
H.EDGEM[N]='';H.EDGED[N]='';
H.EDGEDECO[N]=[['barrel',1]];
H.FRINGE[N]=[['barrel',.5],['crate',.4]];
H.FRINGEX[N]=[[0,0,2600,880]];
H.DENS[N]=1;
if(H.FOGFN)H.FOGFN[N]=({X0,X1,Y1})=>{const C='#2a1f1a';
 const gd=(n,x1,x2,y1,y2)=>`<linearGradient id="${n}" x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}"><stop offset="0" stop-color="${C}" stop-opacity="1"/><stop offset=".5" stop-color="${C}" stop-opacity=".86"/><stop offset="1" stop-color="${C}" stop-opacity="0"/></linearGradient>`;
 let g=`<defs>${gd('hL18',0,1,0,0)+gd('hR18',1,0,0,0)+gd('hT18',0,0,0,1)+gd('hB18',0,0,1,0)}</defs><path d="M-6000,-4000 H8800 V5800 H-6000Z M${X0-295},-295 V${Y1+295} H${X1+295} V-295Z" fill="${C}" fill-rule="evenodd"/>`;
 g+=`<rect x="${X0-300}" y="-300" width="300" height="${Y1+600}" fill="url(#hL18)"/><rect x="${X1}" y="-300" width="300" height="${Y1+600}" fill="url(#hR18)"/><rect x="${X0-300}" y="-300" width="${X1-X0+600}" height="260" fill="url(#hT18)"/><rect x="${X0-300}" y="${Y1+40}" width="${X1-X0+600}" height="260" fill="url(#hB18)"/>`;
 /* 兩側牆上的石柱和牆上火把的暖光 */
 g+=`<g stroke="#1a1310" stroke-width="2" stroke-linejoin="round">`;
 for(let y=760;y<Y1+200;y+=380)for(const x of [X0-170,X1+170]){
  g+=`<rect x="${x-30}" y="${y-330}" width="60" height="330" fill="#4a3a30"/><rect x="${x-38}" y="${y-344}" width="76" height="16" fill="#5a4838"/><rect x="${x-38}" y="${y-14}" width="76" height="16" fill="#5a4838"/><path d="M${x+10},${y-330} V${y-14}" fill="none" stroke="#3a2c24" stroke-width="5"/>`;
  /* 2026-11-20 使用者：兩邊的棕色蠟燭改成掛在牆邊的火炬 → 選 B：側面看的 A 火炬（鐵壁座＋斜插木火炬），掛在牆柱朝場內那一面 */
  const L=x<X0,ty=y-150;g+=`<g transform="translate(${L?x+30:x-30},${ty}) scale(${L?1:-1},1)"><circle cx="20" cy="-64" r="34" fill="#ffb24a" opacity=".2" stroke="none"/><rect x="0" y="-46" width="8" height="26" rx="1.4" fill="#4a4f5c"/><path d="M8,-34 H18" fill="none" stroke="#4a4f5c" stroke-width="4"/><path d="M14,-40 L19,-30 L24,-40" fill="none" stroke="#4a4f5c" stroke-width="3"/>`+
   `<path d="M15,-24 L25,-58" fill="none" stroke="#1a1310" stroke-width="7" stroke-linecap="round"/><path d="M15,-24 L25,-58" fill="none" stroke="#7a5235" stroke-width="4.6" stroke-linecap="round"/><path d="M21,-52 l8,2 l-2,7 l-8,-2Z" fill="#5a3a22" stroke-width="1.2"/>`+
   `<g transform="translate(26,-58) rotate(16)"><path d="M0,0 q-9,-10 -3,-22 q2,6 5,4 q-1,-8 3,-14 q8,12 4,30Z" fill="#f08a3a" stroke-width="1.3"/><path d="M1,-2 q-4,-6 0,-12 q4,6 0,12Z" fill="#f5d34a" stroke="none"/></g></g>`}
 return g+`</g>`};

/* ================= 2. 當地人：宴會賓客（華麗長袍、禮服、頭冠、羽毛扁帽）；僕人圍裙、廚師戴廚師帽 ================= */
const HAT_CROWN=HATS.push(()=>`<path d="M-11,-44 L-12,-58 L-6,-51 L0,-62 L6,-51 L12,-58 L11,-44Z" fill="#e8c04a"/><rect x="-12" y="-47" width="24" height="5" rx="1.4" fill="#d9a83a" stroke-width="1.4"/><circle cx="0" cy="-44.6" r="1.8" fill="#c4473a" stroke="none"/><circle cx="-6.4" cy="-44.6" r="1.3" fill="#4f86c4" stroke="none"/><circle cx="6.4" cy="-44.6" r="1.3" fill="#4f86c4" stroke="none"/><circle cx="0" cy="-62" r="1.8" fill="#fbf1c8" stroke-width="1"/>`)-1;
const HAT_TIARA=HATS.push(()=>`<path d="M-10,-45 Q0,-49 10,-45 L7,-50 L3.4,-47.6 L0,-54 L-3.4,-47.6 L-7,-50Z" fill="#efe0a8" stroke-width="1.4"/><circle cx="0" cy="-49.4" r="1.6" fill="#d8413a" stroke="none"/>`)-1;
const HAT_BERET=HATS.push(()=>{const c=pk(['#8e2630','#2f4f8a','#3f6a4a','#6a3f8a','#2f2f3a']),fe=pk(['#f4ecd6','#e0b44a','#e8e0f0']);
 return `<path d="M-14,-42 Q-12,-55 2,-55 Q16,-54 17,-45 Q8,-44 -14,-42Z" fill="${c}"/><path d="M-14,-42 Q2,-46 17,-45" fill="none" stroke-width="1.6"/><path d="M6,-52 Q18,-68 25,-62 Q18,-58 9,-50Z" fill="${fe}" stroke-width="1.4"/>`})-1;
const HAT_CHEFT=HATS.push(()=>`<path d="M-11,-42 L-12,-60 Q-19,-66 -12,-71 Q-9,-80 0,-76 Q9,-80 12,-71 Q19,-66 12,-60 L11,-42Z" fill="#fbf9f2"/><path d="M-11,-46 H11 M-4,-62 V-48 M4,-62 V-48" fill="none" stroke="#d9d2c0" stroke-width="1.5"/>`)-1;  /* 主廚的高帽 */
const HAT_CHEF=HATS.push(()=>`<path d="M-11,-42 L-12,-54 Q-18,-60 -11,-64 Q-8,-72 0,-68 Q8,-72 11,-64 Q18,-60 12,-54 L11,-42Z" fill="#fbf9f2"/><path d="M-11,-46 H11" fill="none" stroke="#d9d2c0" stroke-width="1.6"/>`)-1;
const HAT_CAP=HATS.push(()=>`<path d="M-13,-43 Q-12,-53 0,-53 Q12,-53 13,-43 Q7,-46 0,-45.4 Q-7,-46 -13,-43Z" fill="#fbf9f2"/><path d="M-13,-43 q3,2 6,0 q3,2 6,0 q3,2 6,0 q3,2 6,0" fill="none" stroke-width="1.2"/>`)-1;  /* 女僕的白色小帽 */
const RICH=['#8e2630','#2f4f8a','#3f6a4a','#6a3f8a','#c99a3a','#7a3a5a','#1f5f6a','#a8502e','#4a3a6a','#b8667a'];
const gown=c=>`<path d="M-8.4,-8.4 L-12,.6 H12 L8.4,-8.4Z" fill="${c}"/><path d="M-10.6,-2.6 H10.6" fill="none" stroke="#e0b44a" stroke-width="1.6"/>`;
OUTFITS[N]=o=>{if(o.top)return o;
 o.skin=o.skin||pk(['#f2d2b4','#e8c4a0','#d9a578','#c98d5e','#f0cfae','#8f5a36']);
 o.top='long';o.bottom='pants';o.shirt=o.shirt||pk(RICH);o.pants=o.pants||pk(['#3a2e2a','#4a3f5a','#2f3a4a','#5a3a2a']);
 if(o.hat==null&&!o.plain){const x=r();o.hat=x<.15?HAT_BERET:x<.27?HAT_TIARA:-1;if(o.hat===HAT_TIARA)o.hs=pk([2,4,3])}
 if(o.pose!=='sit'&&!o.extra&&r()<.4)o.extra=gown(o.shirt);
 return o};
/* 僕人、廚房的人：直接給穿著（不走 OUTFITS） */
const servant=(o={})=>Object.assign({top:'long',bottom:'pants',shirt:pk(['#e8dcc0','#d9c4a0','#c9b48a']),pants:'#4a3f36',hat:pk([HAT_CAP,-1,HAT_CAP]),
 extra:`<path d="M-6,-14 Q0,-11 6,-14 L7,-4 Q0,-1 -7,-4Z" fill="#fbf9f2" stroke-width="1.1"/>`},o);  /* 白色圍裙 */
const cook=(o={})=>Object.assign({top:'long',bottom:'pants',shirt:'#fbf9f2',pants:'#4a4f5c',hat:HAT_CHEF,
 extra:`<path d="M-7,-10 Q0,-8 7,-10 L7.6,-2 Q0,0 -7.6,-2Z" fill="#e8e2d2" stroke-width="1.1"/>`},o);

/* ================= 3. 物件與干擾物（原圖最長邊約 34，細長的約 40） ================= */
/* 老朋友（第 17 關）的圖：沒載入第 17 關時用這裡的後備 */
const ART17={
 goblet17:`<path d="M-12,-15 H12 Q12,-1 2,1 V9 H-2 V1 Q-12,-1 -12,-15Z" fill="#e0b44a"/><path d="M-9,14 Q0,9 9,14 Z" fill="#e0b44a"/><path d="M-10,14 H10" fill="none" stroke-width="2"/>`+
  `<path d="M-12,-15 H12" fill="none" stroke-width="2.4"/><circle cx="0" cy="-7" r="3" fill="#c4473a" stroke-width="1.2"/><circle cx="-7" cy="-9" r="1.6" fill="#4f86c4" stroke="none"/><circle cx="7" cy="-9" r="1.6" fill="#4f86c4" stroke="none"/><path d="M-8,-12 Q-8,-5 -4,-2" fill="none" stroke="#fbe08a" stroke-width="1.6"/>`,
 lute17:`<g transform="rotate(-30)"><path d="M-2,-6 L-3,-28 L3,-28 L2,-6Z" fill="#8a5a30"/><path d="M-3,-28 L-6,-34 L4,-36 L3,-28Z" fill="#6a4228" stroke-width="1.4"/>`+
  `<path d="M0,-8 Q14,-6 13,8 Q12,18 0,18 Q-12,18 -13,8 Q-14,-6 0,-8Z" fill="#c99a5b"/><circle cx="0" cy="4" r="4" fill="#4a3424"/><path d="M-1,-26 V14 M1,-26 V14" fill="none" stroke="#fbf6ea" stroke-width=".7"/><rect x="-4" y="12" width="8" height="2.6" fill="#6a4228" stroke-width="1"/></g>`};
const DECOY17={
 hglass17:`<rect x="-11" y="-17" width="22" height="4.4" rx="1.4" fill="#a8703f"/><rect x="-11" y="12.6" width="22" height="4.4" rx="1.4" fill="#a8703f"/><path d="M-8,-12.6 Q-8,-3 0,0 Q8,-3 8,-12.6Z M-8,12.6 Q-8,3 0,0 Q8,3 8,12.6Z" fill="#dfeef2"/>`+
  `<path d="M-5,12.6 Q0,6 5,12.6Z M-3,-8 Q0,-4 3,-8Z" fill="#e4c070" stroke="none"/><path d="M-9.4,-12.6 V12.6 M9.4,-12.6 V12.6" fill="none" stroke="#7a5235" stroke-width="2"/>`,
 gourd17:`<path d="M0,-17 Q5,-17 5,-10 Q5,-6 3,-4 Q12,0 11,9 Q10,17 0,17 Q-10,17 -11,9 Q-12,0 -3,-4 Q-5,-6 -5,-10 Q-5,-17 0,-17Z" fill="#d9b25a"/><path d="M-3,-4 Q0,-2 3,-4" fill="none" stroke="#b8402e" stroke-width="2"/><path d="M0,-17 V-21" fill="none" stroke="#6a4228" stroke-width="2.2"/><path d="M-6,4 Q-6,10 -3,13" fill="none" stroke="#f4dc9a" stroke-width="1.6"/>`};
for(const k in ART17)if(!ART[k])ART[k]=ART17[k];
for(const k in DECOY17)if(!DECOY[k])DECOY[k]=DECOY17[k];
Object.assign(ART,{
 /* 烤雞腿 */
 drum18:`<path d="M-15,6 Q-21,-8 -8,-15 Q5,-21 11,-9 Q15,1 5,7 Q-5,13 -15,6Z" fill="#b5672c"/><path d="M-11,-6 Q-5,-14 4,-13" fill="none" stroke="#e8a35a" stroke-width="2.2"/><circle cx="-6" cy="0" r="1.6" fill="#7a3e1a" stroke="none"/><circle cx="1" cy="-5" r="1.3" fill="#7a3e1a" stroke="none"/><circle cx="-10" cy="-3" r="1.1" fill="#7a3e1a" stroke="none"/>`+
  `<path d="M5,5 L14,13" fill="none" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><path d="M5,5 L14,13" fill="none" stroke="#f6efe0" stroke-width="4.4" stroke-linecap="round"/><circle cx="16.4" cy="11" r="3.4" fill="#f6efe0" stroke-width="1.5"/><circle cx="12.6" cy="16.2" r="3.4" fill="#f6efe0" stroke-width="1.5"/>`,
 /* 三叉銀燭台 */
 cdl18:`<g transform="scale(.9)"><path d="M-10,19 Q0,11 10,19Z" fill="#c9ced6"/><path d="M-11,19 H11" fill="none" stroke-width="2"/>`+tube('M0,15 V-10','#c9ced6',3)+tube('M-13,-10 Q-13,-1 0,-1 Q13,-1 13,-10','#c9ced6',2.8)+
  [[-13,-12,-24],[0,-14,-28],[13,-12,-24]].map(([x,b,t])=>`<rect x="${x-4}" y="${b}" width="8" height="3.4" rx="1" fill="#b9c0c8" stroke-width="1.2"/><rect x="${x-2.6}" y="${t}" width="5.2" height="${b-t}" fill="#fbf6e4" stroke-width="1.3"/><path d="M${x},${t-1} q-3,-4 0,-9 q3,5 0,9Z" fill="#f5a83a" stroke-width="1.1"/>`).join('')+
  `<path d="M-3,8 Q-3,2 -1,-4" fill="none" stroke="#fff" stroke-width="1.2"/></g>`,
 /* 蜂蜜罐（附木杓） */
 honey18:`<path d="M10,-6 L15,-25" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><path d="M10,-6 L15,-25" fill="none" stroke="#a8703f" stroke-width="2.8" stroke-linecap="round"/><circle cx="15.4" cy="-26" r="2.6" fill="#8a5a30" stroke-width="1.2"/>`+
  `<path d="M-13,-6 Q-17,8 -9,15 H9 Q17,8 13,-6Z" fill="#e8a52a"/><path d="M-14,-8 Q0,-15 14,-8 L12.4,-3 Q0,-7 -12.4,-3Z" fill="#f1e2bc"/><path d="M-13,-4 Q0,-1 13,-4" fill="none" stroke="#b8402e" stroke-width="1.8"/>`+
  `<path d="M-6,-3 Q-7.4,5 -5,7 Q-3,5 -4,-3Z" fill="#c98412" stroke="none"/><path d="M8,2 Q9,8 6,11" fill="none" stroke="#fbe08a" stroke-width="1.8"/>`,
 /* 切一角的起司輪 */
 cheese18:`<g transform="scale(1.1)"><path d="M-16,-2 V6 A16,6 0 0,0 8,11.2 V3.2 A16,6 0 0,1 -16,-2Z" fill="#e3a92a"/><path d="M0,-2 L16,-2 V6 L0,6Z" fill="#f2c94c"/><path d="M0,-2 L8,3.2 V11.2 L0,6Z" fill="#f6d462"/>`+
  `<path d="M0,-2 L16,-2 A16,6 0 1,0 8,3.2Z" fill="#f6d462"/><circle cx="10" cy="2" r="1.6" fill="#d9a320" stroke="none"/><circle cx="4" cy="5" r="1.2" fill="#d9a320" stroke="none"/><circle cx="5" cy="8.6" r="1.1" fill="#d9a320" stroke="none"/>`+
  `<ellipse cx="-7" cy="-3" rx="2.2" ry="1" fill="#e8b83a" stroke="none"/><ellipse cx="-2" cy="-6" rx="1.6" ry=".8" fill="#e8b83a" stroke="none"/></g>`,
 /* 搖晃的果凍 */
 jelly18:`<ellipse cx="0" cy="13" rx="16" ry="4.4" fill="#f4f1ea"/><path d="M-12,12 Q-14,-2 -9,-10 Q0,-16 9,-10 Q14,-2 12,12Z" fill="#e2485a"/><path d="M-13,2 Q0,6 13,2 L12.6,6 Q0,10 -12.6,6Z" fill="#fbe6c8" stroke="none"/>`+
  `<path d="M-6,-11 V10 M0,-13 V11 M6,-11 V10" fill="none" stroke="#b8303f" stroke-width="1.1" opacity=".7"/><path d="M-12,12 Q-14,-2 -9,-10 Q0,-16 9,-10 Q14,-2 12,12" fill="none"/><path d="M-8,-6 Q-7,-10 -4,-11" fill="none" stroke="#fff" stroke-width="1.8"/>`+
  `<circle cx="0" cy="-16" r="3.4" fill="#c4202e" stroke-width="1.3"/><path d="M0,-19 Q2,-24 6,-25" fill="none" stroke="#5a7a2a" stroke-width="1.4"/><path d="M-18,-4 q-2,3 0,6 M18,-4 q2,3 0,6" fill="none" stroke="#9a8a7a" stroke-width="1.4"/>`,
 /* 金色手搖餐鈴 */
 bell18:`<rect x="-3" y="-25" width="6" height="15" rx="2.6" fill="#7a5235"/><circle cx="0" cy="-27" r="3.4" fill="#7a5235" stroke-width="1.4"/><path d="M-12,12 Q-12,-6 0,-10 Q12,-6 12,12 L15,14.6 H-15Z" fill="#e0b44a"/>`+
  `<circle cx="0" cy="16.6" r="2.8" fill="#c99a2a" stroke-width="1.3"/><path d="M-7,8 Q-7,-3 -2,-6" fill="none" stroke="#fbe08a" stroke-width="2"/><path d="M-12,8 H12" fill="none" stroke="#b8902a" stroke-width="1.4"/>`,
 /* 胡椒研磨罐 */
 pep18:`<path d="M-6,17 H6 L7,12 Q9,2 5,-4 Q3,-8 5,-12 Q6,-16 3,-18 H-3 Q-6,-16 -5,-12 Q-3,-8 -5,-4 Q-9,2 -7,12Z" fill="#8a5a30"/><path d="M-7,12 H7 M-5.6,-4 H5.6 M-4.6,-12 H4.6" fill="none" stroke="#5a3a20" stroke-width="1.3"/>`+
  `<circle cx="0" cy="-21" r="3" fill="#6a4228" stroke-width="1.4"/><path d="M-3,6 Q-4,0 -2,-3" fill="none" stroke="#c99a5b" stroke-width="1.6"/><circle cx="11" cy="15" r="1.6" fill="#2b2420" stroke="none"/><circle cx="14" cy="13" r="1.4" fill="#2b2420" stroke="none"/><circle cx="-11" cy="16" r="1.5" fill="#2b2420" stroke="none"/>`,
 /* 銀色圓頂餐蓋 */
 cloche18:`<ellipse cx="0" cy="12" rx="18" ry="4.4" fill="#e8ecef"/><path d="M-15,11 Q-15,-10 0,-11 Q15,-10 15,11Z" fill="#cfd5dc"/><path d="M-15,11 H15" fill="none" stroke-width="2"/><path d="M-9,4 Q-10,-5 -3,-8" fill="none" stroke="#fff" stroke-width="2.2"/>`+
  `<circle cx="0" cy="-13" r="3.2" fill="#b9c0c8" stroke-width="1.5"/><path d="M-15,7 Q0,11 15,7" fill="none" stroke="#a3aab4" stroke-width="1.3"/>`,
 /* 蠟封邀請函 */
 invit18:`<rect x="-16" y="-10" width="32" height="21" rx="1.6" fill="#f5ead0"/><path d="M-16,11 L-3,0 M16,11 L3,0" fill="none" stroke="#c9b48a" stroke-width="1.2"/><path d="M-16,-10 L0,3 L16,-10" fill="none" stroke-width="1.6"/>`+
  `<path d="M-3,3 L-6,10 M3,3 L6,10" fill="none" stroke="#e0b44a" stroke-width="2"/><circle cx="0" cy="3" r="5.2" fill="#c4303a" stroke-width="1.4"/><path d="M-2.6,4.6 L-2.6,1.4 L-1.2,3 L0,1 L1.2,3 L2.6,1.4 L2.6,4.6Z" fill="#f0a8a0" stroke="none"/>`,
 /* 編織麵包環 */
 wreath18:`<path d="M-17,0 A17,12 0 1,0 17,0 A17,12 0 1,0 -17,0Z M-7,0 A7,4.6 0 1,1 7,0 A7,4.6 0 1,1 -7,0Z" fill="#d08a3a" fill-rule="evenodd"/>`+
  [0,40,80,120,160,200,240,280,320].map(a=>{const t=a*Math.PI/180,x=Math.cos(t)*12,y=Math.sin(t)*8.4;return `<path d="M${f(x-3)},${f(y-2)} q3,4 6,0" fill="none" stroke="#a8642a" stroke-width="1.4" transform="rotate(${a+90} ${f(x)} ${f(y)})"/>`}).join('')+
  `<path d="M-12,-6 Q-4,-11 6,-10" fill="none" stroke="#f0b866" stroke-width="2"/><circle cx="-9" cy="4" r=".9" fill="#fbf0d0" stroke="none"/><circle cx="4" cy="8" r=".9" fill="#fbf0d0" stroke="none"/><circle cx="12" cy="-3" r=".9" fill="#fbf0d0" stroke="none"/><circle cx="-2" cy="-9" r=".9" fill="#fbf0d0" stroke="none"/>`});
Object.assign(DECOY,{
 yam18:`<path d="M-17,4 Q-15,-8 0,-8 Q14,-8 17,0 Q14,8 0,9 Q-12,10 -17,4Z" fill="#8a4a5a"/><ellipse cx="15.4" cy="0" rx="2.6" ry="5.6" fill="#f2b84a" stroke-width="1.3"/><path d="M-9,-4 Q-2,-7 6,-5" fill="none" stroke="#b07080" stroke-width="1.6"/><path d="M-4,2 l2,1 M5,3 l2,1" fill="none" stroke="#5a2a3a" stroke-width="1.2"/>`,
 fork18:`<g transform="rotate(-30)">`+tube('M-7,-10 V-24 M0,-10 V-26 M7,-10 V-24','#5a5e6a',2.2)+tube('M-8,-10 H8','#5a5e6a',2.6)+tube('M0,-10 V2','#5a5e6a',3)+`<rect x="-3.4" y="2" width="6.8" height="20" rx="2.8" fill="#6a4228"/></g>`,
 jar18:`<path d="M-13,-6 Q-17,8 -9,15 H9 Q17,8 13,-6Z" fill="#e0be4a"/><ellipse cx="0" cy="-6" rx="13" ry="3.8" fill="#c99a5b"/><circle cx="0" cy="-10" r="2.6" fill="#a8703f" stroke-width="1.2"/><path d="M8,2 Q9,8 6,11" fill="none" stroke="#f4dc9a" stroke-width="1.8"/>`,
 cush18:`<ellipse cx="0" cy="2" rx="16" ry="10" fill="#e8c24a"/><ellipse cx="-2" cy="-1" rx="10" ry="5" fill="#f2d470" stroke="none"/><circle cx="0" cy="2" r="2" fill="#c99a2a" stroke-width="1.1"/><path d="M-16,2 l-3,4 M16,2 l3,4" fill="none" stroke="#b8402e" stroke-width="2.2"/>`,
 shade18:`<path d="M-14,12 Q-15,-2 -8,-10 Q0,-14 8,-10 Q15,-2 14,12Z" fill="#7fb68a"/><rect x="-15" y="10" width="30" height="4" rx="1.4" fill="#c99a3a" stroke-width="1.3"/><path d="M-6,-11 L-8,10 M6,-11 L8,10" fill="none" stroke="#5f9068" stroke-width="1.2"/><circle cx="0" cy="-14" r="2.4" fill="#c99a3a" stroke-width="1.2"/><path d="M-9,4 Q-9,-4 -5,-8" fill="none" stroke="#e0f2e2" stroke-width="1.8"/>`,
 funnel18:`<rect x="-2.6" y="-24" width="5.2" height="18" fill="#c98a4a"/><path d="M-15,12 L-4,-7 H4 L15,12Z" fill="#c98a4a"/><ellipse cx="0" cy="12" rx="15" ry="3" fill="#a8683a"/><path d="M-8,6 L-2,-4" fill="none" stroke="#f0c08a" stroke-width="2"/>`,
 rook18:`<path d="M-9,16 H9 V12 H7 L5,-6 H8 V-16 H4.4 V-12 H1.4 V-16 H-1.4 V-12 H-4.4 V-16 H-8 V-6 H-5 L-7,12 H-9Z" fill="#c99a5b"/><path d="M-6,-6 H6 M-7,12 H7" fill="none" stroke="#8a5a30" stroke-width="1.3"/><path d="M-3,8 L-2,-3" fill="none" stroke="#f0d4a0" stroke-width="1.6"/>`,
 bowl18:`<path d="M-15,11 Q-14,-6 0,-7 Q14,-6 15,11Z" fill="#7a808a"/><rect x="-6" y="-10" width="12" height="4" rx="1.2" fill="#6a6f78" stroke-width="1.3"/><path d="M-15,11 H15" fill="none" stroke-width="2"/><path d="M-9,5 Q-9,-2 -4,-4" fill="none" stroke="#b9c0c8" stroke-width="1.8"/>`,
 napkin18:`<rect x="-15" y="-10" width="30" height="20" rx="2" fill="#fbf8f0"/><path d="M-15,10 L15,-10" fill="none" stroke="#d9d2c0" stroke-width="1.4"/><path d="M15,-10 L15,-2 L8,-10Z" fill="#ece5d4" stroke-width="1.2"/><path d="M-12,-7 H4" fill="none" stroke="#e8e0cc" stroke-width="1.2"/>`,
 straw18:`<path d="M-17,0 A17,12 0 1,0 17,0 A17,12 0 1,0 -17,0Z M-7.6,0 A7.6,5 0 1,1 7.6,0 A7.6,5 0 1,1 -7.6,0Z" fill="#e6cf86" fill-rule="evenodd"/>`+
  `<path d="M-14,-4 l5,2 M-10,-9 l4,3 M0,-11 l1,4 M10,-9 l-3,3 M14,-3 l-5,2 M12,6 l-4,-2 M-12,6 l4,-2" fill="none" stroke="#c9a95a" stroke-width="1.2"/>`+
  `<circle cx="-11" cy="-6" r="2.4" fill="#d8413a" stroke-width="1"/><circle cx="9" cy="-8" r="2.4" fill="#4f86c4" stroke-width="1"/><circle cx="13" cy="4" r="2.2" fill="#f0a8a0" stroke-width="1"/><path d="M-3,11 l-5,5 M3,11 l5,5 M-3,11 h6" fill="none" stroke="#b8402e" stroke-width="2"/>`});

/* ---- 景物 ---- */
/* 牆上小火炬（2026-11-20 使用者選 D-B：黃銅壁座＋火盆碗；取代原本的兩座大壁爐）。點了火焰會變彩色（.fl18／.fl18b） */
const torch=()=>`<circle cx="0" cy="-150" r="40" fill="#ffb24a" opacity=".2" stroke="none"/><ellipse cx="0" cy="2" rx="40" ry="8" fill="#ffb24a" opacity=".16" stroke="none"/>`+
 `<path d="M-7,-104 Q0,-96 7,-104 L5,-116 H-5Z" fill="#c99a3a"/><path d="M0,-116 V-130" fill="none" stroke="#c99a3a" stroke-width="3.4"/><path d="M-15,-136 Q0,-126 15,-136 L12,-143 H-12Z" fill="#c99a3a"/><path d="M-9,-138 H9" fill="none" stroke="#e8c870" stroke-width="1.4"/>`+
 `<g class="an a-fire" style="--d:.8s"><path class="fl18" d="M0,-142 q-12,-12 -4,-28 q3,8 7,5 q-1,-11 4,-19 q11,16 5,42Z" fill="#f08a3a" stroke-width="1.4"/><path class="fl18b" d="M1,-145 q-5,-8 0,-16 q5,8 0,16Z" fill="#f5d34a" stroke="none"/></g>`;
/* 王座＋坐著的國王／王后（桌子會擋住下半身） */
const ermine=`<path d="M-9.4,-18 Q0,-12.6 9.4,-18 L9.4,-14 Q0,-8.6 -9.4,-14Z" fill="#fbf6ea"/><circle cx="-5" cy="-14.6" r=".9" fill="${OL}" stroke="none"/><circle cx="0" cy="-12.6" r=".9" fill="${OL}" stroke="none"/><circle cx="5" cy="-14.6" r=".9" fill="${OL}" stroke="none"/>`;
const throne=()=>`<path d="M-27,0 V-100 Q-27,-118 0,-124 Q27,-118 27,-100 V0Z" fill="#d9b04a"/><path d="M-19,-30 V-94 Q-19,-108 0,-112 Q19,-108 19,-94 V-30Z" fill="#9a2a3a"/><circle cx="-27" cy="-102" r="5" fill="#e8c04a" stroke-width="1.4"/><circle cx="27" cy="-102" r="5" fill="#e8c04a" stroke-width="1.4"/><circle cx="0" cy="-124" r="5" fill="#e8c04a" stroke-width="1.4"/><circle cx="0" cy="-100" r="4" fill="#4f86c4" stroke-width="1.2"/>`;
const goldCup=`<g transform="translate(21,-30)"><path d="M-2.8,-18 L-2.1,-9 Q0,-6.6 2.1,-9 L2.8,-18Z" fill="#eef8fb" stroke-width="1.1"/><path d="M-2.4,-14 L-1.9,-9.2 Q0,-7.4 1.9,-9.2 L2.4,-14Z" fill="#f2d98a" stroke="none"/><circle cx="-.6" cy="-11.5" r=".5" fill="#fff" stroke="none"/><circle cx=".7" cy="-13" r=".45" fill="#fff" stroke="none"/><path d="M0,-6.8 V1.2 M-3.2,1.6 H3.2" fill="none" stroke-width="1.2"/></g>`;  /* 香檳杯（細長高腳玻璃杯、淡金色香檳；2026-11-20 使用者要求主桌敬酒拿香檳杯，不用錫杯；也不是要找的金色高腳杯） */
/* 主桌貴族的椅子（2026-11-20 使用者選 A：深色木頭圓頂椅背＋紅色椅墊，比王座矮、樸素） */
const chairA=`<path d="M-24,-38 V-112 Q-24,-128 0,-130 Q24,-128 24,-112 V-38Z" fill="#7a4e2c"/><path d="M-16,-46 V-108 Q-16,-120 0,-122 Q16,-120 16,-108 V-46Z" fill="#8e2630"/><circle cx="-24" cy="-114" r="4" fill="#5a3a20" stroke-width="1.2"/><circle cx="24" cy="-114" r="4" fill="#5a3a20" stroke-width="1.2"/>`;
const chairOn=inner=>T(0,38,1,chairA)+inner;
/* 冠軍騎士（2026-11-20 使用者選 A）：比武大會的冠軍，銀甲、藍披風、金色月桂冠，頭盔夾在腋下 */
const laurel=`<path d="M-11,-46 Q-14,-40 -13,-34 M11,-46 Q14,-40 13,-34" fill="none" stroke="#e0b44a" stroke-width="3.4"/>`+[-1,1].map(s=>[0,1,2].map(i=>`<ellipse cx="${s*(11.6+i*.6)}" cy="${-44+i*4}" rx="2.4" ry="1.4" fill="#e8c04a" stroke-width=".8" transform="rotate(${s*40} ${s*(11.6+i*.6)} ${-44+i*4})"/>`).join('')).join('');
const champ=()=>`<path d="M-13,-18 Q-18,-6 -16,0 H16 Q18,-6 13,-18Z" fill="#2f4f8a"/>`+kid({view:'front',pose:'sit',arm:2,mood:1,hat:-1,hs:1,skin:'#d9a578',hair:'#4a3424',shirt:'#c4cad2',top:'long',bottom:'pants',pants:'#8a929c'})+
 `<path d="M-9,-17 Q0,-20 9,-17 L8,-5 Q0,-2 -8,-5Z" fill="#c4cad2"/><circle cx="-10" cy="-15" r="5" fill="#c4cad2"/><circle cx="10" cy="-15" r="5" fill="#c4cad2"/><path d="M0,-18 V-5" fill="none" stroke="#8a929c" stroke-width="1.1"/>`+laurel+
 `<g transform="translate(-20,-16)"><path d="M-8,4 V-6 Q-8,-14 0,-14 Q8,-14 8,-6 V4 Q0,6 -8,4Z" fill="#c4cad2"/><path d="M-6,-6 H6" fill="none" stroke="${OL}" stroke-width="2"/><path d="M0,-14 Q-2,-22 4,-24 Q8,-18 3,-14Z" fill="#2f4f8a" stroke-width="1"/></g>`+goldCup;
const king=()=>throne()+T(0,-8,1,kid({view:'front',pose:'sit',arm:1,hat:HAT_CROWN,beard:true,mood:1,skin:'#f0cfae',hair:'#e8e0d0',hs:0,shirt:'#a8302e',top:'long',bottom:'pants',pants:'#6a2a2a',extra:ermine+goldCup}));
const queen=()=>throne()+T(0,-8,1,kid({view:'front',pose:'sit',arm:0,hat:HAT_TIARA,mood:1,skin:'#f2d2b4',hair:'#c9853a',hs:2,shirt:'#6a3f8a',top:'long',bottom:'pants',pants:'#4a2a5a',extra:ermine+goldCup}));
/* 守護騎士（2026-11-20 使用者選 A-A×2，再加一位 A-B 當護衛長）：大一點、肩膀寬，站在主桌兩側 */
const kHelm=`<path d="M-14,-24 V-40 Q-14,-51 0,-51 Q14,-51 14,-40 V-24 Q0,-19 -14,-24Z" fill="#c4cad2"/><path d="M-11,-36 H11" fill="none" stroke="${OL}" stroke-width="3"/><path d="M0,-50 V-24" fill="none" stroke="#8a929c" stroke-width="1.4"/><path d="M-4,-30 v3 M0,-30 v3 M4,-30 v3" fill="none" stroke="${OL}" stroke-width="1.4"/><path d="M0,-51 Q-4,-64 6,-70 Q12,-60 4,-50Z" fill="#b8402e" stroke-width="1.4"/>`;
const kHelmG=`<path d="M-14,-26 V-40 Q-14,-51 0,-52 Q14,-51 14,-40 V-26 L8,-24 V-34 H-8 V-24Z" fill="#e0b44a"/><path d="M0,-52 V-60 M-6,-58 Q0,-74 6,-58" fill="#fbf6ea" stroke-width="1.4"/><path d="M-8,-34 H8" fill="none" stroke="#a8802a" stroke-width="1.6"/>`;
const kPlate=(c,c2)=>`<path d="M-12,-19 Q0,-23 12,-19 L11,-3 Q0,1 -11,-3Z" fill="${c}"/><path d="M0,-21 V-2 M-10,-11 Q0,-8 10,-11" fill="none" stroke="${c2}" stroke-width="1.3"/><circle cx="-14" cy="-16" r="7.6" fill="${c}"/><circle cx="14" cy="-16" r="7.6" fill="${c}"/><path d="M-20,-14 Q-14,-19 -8,-14 M8,-14 Q14,-19 20,-14" fill="none" stroke="${c2}" stroke-width="1.1"/>`;
const kCape=c=>`<path d="M-15,-20 Q-24,-6 -21,2 H21 Q24,-6 15,-20Z" fill="${c}"/>`;
const kSword=`<path d="M17,2 V-22" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M17,2 V-22" fill="none" stroke="#dfe4ea" stroke-width="2.6"/><path d="M11,-22 H23" fill="none" stroke="${OL}" stroke-width="4"/><path d="M11,-22 H23" fill="none" stroke="#e0b44a" stroke-width="2.2"/><path d="M17,-22 V-28" fill="none" stroke="#6a4228" stroke-width="3"/><circle cx="17" cy="-29" r="2.2" fill="#e0b44a" stroke-width="1"/>`;
const kHalb=`<path d="M18,4 V-70" fill="none" stroke="${OL}" stroke-width="4.6"/><path d="M18,4 V-70" fill="none" stroke="#7a5235" stroke-width="2.6"/><path d="M18,-70 l-3,-3 l3,-10 l3,10Z M18,-64 Q30,-62 30,-52 Q24,-56 18,-54Z" fill="#dfe4ea" stroke-width="1.4"/><path d="M18,-58 l-6,-4" fill="none" stroke="#dfe4ea" stroke-width="2.4"/>`;
const knight=cap=>{const o={view:'front',pose:'stand',arm:0,mood:0,top:'long',bottom:'pants',hat:-1,hs:0,hair:'#3a2e2a',skin:'#e8c4a0'};
 if(cap)return kCape('#2f4f8a')+kid({...o,shirt:'#e0b44a',pants:'#a8802a',mood:1})+kPlate('#e8c25a','#a8802a')+`<path d="M-4,-14 L0,-10 L4,-14" fill="none" stroke="#b8402e" stroke-width="2"/>`+kHelmG+kHalb;
 return kCape('#b8402e')+kid({...o,shirt:'#c4cad2',pants:'#8a929c'})+kPlate('#c4cad2','#8a929c')+kHelm+kSword};
/* 主桌（正面）：白桌巾、金邊、紅色垂幔，桌上金盤、水果塔、派、花 */
const headTable=()=>{let s=sh(300,8)+`<path d="M-300,-48 H300 L304,-34 H-304Z" fill="#f6eedb"/><path d="M-304,-34 H304 V0 H-304Z" fill="#efe3c6"/><path d="M-304,-30 H304" fill="none" stroke="#e0b44a" stroke-width="3"/>`;
 let sw='';for(let x=-304;x<304;x+=76)sw+=`M${x},-30 Q${x+38},-6 ${x+76},-30 `;s+=`<path d="${sw}" fill="#9a2a3a" stroke-width="1.6"/>`;
 for(let x=-304;x<=304;x+=76)s+=`<circle cx="${x}" cy="-30" r="3.6" fill="#e0b44a" stroke-width="1.2"/>`;
 [-250,-170,-90,90,170,250].forEach(x=>s+=`<ellipse cx="${x}" cy="-40" rx="13" ry="3.6" fill="#e8c25a" stroke-width="1.2"/>`);
 s+=`<g transform="translate(-130,-44)"><path d="M-14,0 Q-12,-8 0,-9 Q12,-8 14,0Z" fill="#d9963a"/><path d="M-10,-3 L10,-6 M-10,-6 L10,-3" fill="none" stroke="#a8682a" stroke-width="1.2"/></g>`;
 s+=`<g transform="translate(130,-44)"><ellipse cx="0" cy="0" rx="14" ry="3.4" fill="#e8ecef"/>${[[-7,-4,'#d8413a'],[0,-5,'#7aa856'],[7,-4,'#e8742a'],[-3,-10,'#e0b44a'],[4,-10,'#d8413a'],[0,-15,'#7a4f8a']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="4" fill="${c}" stroke-width="1.1"/>`).join('')}</g>`;
 s+=`<g transform="translate(0,-44)"><path d="M-8,0 Q-10,-8 -5,-12 H5 Q10,-8 8,0Z" fill="#e0b44a" stroke-width="1.4"/>${[[-7,-16,'#f0a8a0'],[0,-19,'#d8413a'],[7,-16,'#fbf6ea'],[-3,-22,'#e0b44a'],[4,-22,'#f0a8a0']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="4" fill="${c}" stroke-width="1"/>`).join('')}</g>`;
 return s};
/* 長桌上的一段擺設（桌巾在地面層；這段放盤子、錫杯、水果、派、花瓶、麵包） */
/* 2026-11-20 使用者：長桌擺設太平民 → 選 B：金邊盤子、玻璃高腳杯（紅色飲料）、每隔一段一盞雙根銅燭台（要找的是三叉銀燭台，所以這裡只做雙根、銅色），中間放大盤菜 */
const plate=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="11" ry="5" fill="#e8e0c8" stroke-width="1.3"/><ellipse cx="${x}" cy="${y}" rx="8" ry="3.4" fill="#fbf8f0" stroke="#e0b44a" stroke-width="1"/><ellipse cx="${x}" cy="${y-.6}" rx="4.6" ry="1.8" fill="${pk(['#c9853a','#7aa856','#d8413a','#e0b44a'])}" stroke="none"/>`;
const glassG=(x,y)=>`<path d="M${x-3.4},${y-12} Q${x-3.4},${y-6} ${x},${y-5} Q${x+3.4},${y-6} ${x+3.4},${y-12}Z" fill="#e8f4f6" stroke-width="1.1"/><path d="M${x-2.6},${y-9} Q${x},${y-6.4} ${x+2.6},${y-9}Z" fill="${pk(['#d8413a','#9a2a3a','#e8742a'])}" stroke="none"/><path d="M${x},${y-5} V${y-1}" fill="none" stroke-width="1.1"/><ellipse cx="${x}" cy="${y-.6}" rx="3" ry="1" fill="#e8f4f6" stroke-width="1"/>`;
const candle2=(x,y)=>`<circle cx="${x}" cy="${y-28}" r="15" fill="#ffd98a" opacity=".3" stroke="none"/><ellipse cx="${x}" cy="${y}" rx="6" ry="2.4" fill="#b8723a" stroke-width="1.2"/><path d="M${x},${y} V${y-8} M${x-7},${y-12} Q${x-7},${y-8} ${x},${y-8} Q${x+7},${y-8} ${x+7},${y-12}" fill="none" stroke="#b8723a" stroke-width="2.4"/>`+
 [-7,7].map(d=>`<rect x="${x+d-2.2}" y="${y-24}" width="4.4" height="12" fill="#fbf6e4" stroke-width="1.1"/><g class="an a-fire" style="--d:.7s"><path d="M${x+d},${y-25} q-2.4,-3 0,-6 q2.4,3 0,6Z" fill="#f5b03a" stroke-width="1"/></g>`).join('');
const CENTER=[
 ()=>`<ellipse cx="0" cy="-3" rx="15" ry="6" fill="#d9dee4" stroke-width="1.3"/><path d="M-10,-6 Q-12,-14 -4,-16 Q6,-18 10,-10 Q12,-4 4,-3 Q-6,-1 -10,-6Z" fill="#c9783a"/><path d="M-6,-12 Q0,-15 6,-12" fill="none" stroke="#e8a35a" stroke-width="1.6"/><circle cx="-9" cy="-3" r="1.6" fill="#7aa856" stroke="none"/><circle cx="9" cy="-3" r="1.6" fill="#d8413a" stroke="none"/>`,
 ()=>`<ellipse cx="0" cy="-3" rx="13" ry="5" fill="#e0b44a" stroke-width="1.3"/>`+[[-6,-6,'#d8413a'],[0,-6,'#7aa856'],[6,-6,'#e8742a'],[-3,-11,'#9a6fb0'],[3,-11,'#d8413a'],[0,-16,'#e0b44a']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="3.6" fill="${c}" stroke-width="1"/>`).join(''),
 ()=>`<ellipse cx="0" cy="-3" rx="13" ry="5" fill="#d9dee4" stroke-width="1.3"/><ellipse cx="0" cy="-5" rx="9" ry="3.6" fill="#d9963a" stroke-width="1.2"/><path d="M-6,-6 L6,-4 M-6,-4 L6,-6" fill="none" stroke="#a8682a" stroke-width="1"/>`,
 ()=>`<ellipse cx="0" cy="-3" rx="13" ry="5" fill="#d9dee4" stroke-width="1.3"/><path d="M-9,-5 Q-9,-12 0,-12 Q9,-12 9,-5Z" fill="#e8d9a8" stroke-width="1.2"/><path d="M-5,-8 h10" fill="none" stroke="#c9a46a" stroke-width="1"/>`,
 ()=>`<path d="M-5,-2 Q-7,-10 -3,-14 H3 Q7,-10 5,-2Z" fill="#7fb6c8" stroke-width="1.3"/><circle cx="-4" cy="-18" r="3.4" fill="#f0a8a0" stroke-width="1"/><circle cx="3" cy="-19" r="3.4" fill="#fbf6ea" stroke-width="1"/><circle cx="0" cy="-15" r="3" fill="#d8413a" stroke-width="1"/>`];
const tblSeg=(k=0)=>{let s=plate(-34,-12)+plate(34,-12)+glassG(-42,-17)+glassG(42,-17);s+=k%2?candle2(0,-6):T(0,-8,1,pk(CENTER)());return s};
/* 浮空蠟燭（一小群 3～4 根，輕輕上下飄、火苗閃） */
const candleGrp=()=>{let s='';const n=pk([3,4,4]);for(let i=0;i<n;i++){const x=sr(-34,34),y=sr(-16,16),h=sr(14,22);
  s+=an('float',f(sr(3.6,5.6)),`<circle cx="${f(x)}" cy="${f(y-h-6)}" r="15" fill="#ffd98a" opacity=".22" stroke="none"/><rect x="${f(x-3)}" y="${f(y-h)}" width="6" height="${f(h)}" rx="1.2" fill="#f8f1dc" stroke-width="1.3"/><path d="M${f(x-3)},${f(y-h+3)} q1.4,3 2.4,0" fill="none" stroke="#e8dcc0" stroke-width="1.2"/>`+
   `<g class="an a-fire" style="--d:.${ri9()}s"><path d="M${f(x)},${f(y-h-1)} q-3.2,-4 0,-9 q3.2,5 0,9Z" fill="#f5b03a" stroke-width="1.1"/></g>`)}
 return s};
const ri9=()=>Math.floor(sr(5,9));
/* 點心桌（2026-11-20 使用者選 E-A，但要橫放）：和長桌一樣的俯瞰角度，粉紅桌巾＋金色蕾絲邊，前面（南邊）露出波浪小裙襬；桌上三層點心架、蛋糕、塔、馬卡龍、水果塔、杯子蛋糕 */
const dSweet=[
 (x,y)=>`<g transform="translate(${x},${y})"><ellipse cx="0" cy="0" rx="13" ry="5" fill="#d9dee4" stroke-width="1.2"/><rect x="-9" y="-12" width="18" height="11" rx="2" fill="${pk(['#fbf3ea','#7a4a2a','#fbe9a8'])}" stroke-width="1.2"/><path d="M-9,-9 Q-4.5,-6 0,-9 Q4.5,-6 9,-9" fill="none" stroke="#f0a0b4" stroke-width="1.8"/><circle cx="0" cy="-14" r="2.4" fill="#d8413a" stroke-width="1"/></g>`,
 (x,y)=>`<g transform="translate(${x},${y})"><ellipse cx="0" cy="0" rx="12" ry="4.6" fill="#e0b44a" stroke-width="1.2"/>${[[-5,-3,'#f0a8c0'],[0,-3,'#9fd0a0'],[5,-3,'#fbe08a'],[-2.5,-7,'#c9a0e0'],[2.5,-7,'#f0a8c0']].map(([a,b,c])=>`<circle cx="${a}" cy="${b}" r="2.6" fill="${c}" stroke-width=".9"/>`).join('')}</g>`,
 (x,y)=>`<g transform="translate(${x},${y})"><ellipse cx="0" cy="0" rx="11" ry="4.4" fill="#d9963a" stroke-width="1.2"/><ellipse cx="0" cy="-1" rx="8" ry="3" fill="${pk(['#e8742a','#d8413a','#9a6fb0'])}" stroke="none"/><path d="M-6,-1 L6,-1 M0,-3.6 V1.6" fill="none" stroke="#c9853a" stroke-width="1"/></g>`,
 (x,y)=>`<g transform="translate(${x},${y})"><path d="M-6,0 L-7,-6 H7 L6,0Z" fill="#f0a8c0" stroke-width="1"/><path d="M-7,-6 Q0,-13 7,-6Z" fill="#fbf6ea" stroke-width="1"/><circle cx="0" cy="-10" r="1.6" fill="#d8413a" stroke="none"/></g>`,
 (x,y)=>`<g transform="translate(${x},${y})"><ellipse cx="0" cy="0" rx="12" ry="4.4" fill="#d9dee4" stroke-width="1.2"/>${[[-6,-3,'#e8742a'],[0,-3,'#d8413a'],[6,-3,'#7aa856'],[-3,-8,'#e0b44a'],[3,-8,'#9a6fb0'],[0,-13,'#d8413a']].map(([a,b,c])=>`<circle cx="${a}" cy="${b}" r="3" fill="${c}" stroke-width=".9"/>`).join('')}</g>`];
const stand3=(x,y)=>`<g transform="translate(${x},${y})"><path d="M0,0 V-34" fill="none" stroke="#c99a3a" stroke-width="2.4"/>${[[0,13],[-12,10],[-24,7]].map(([dy,r])=>`<ellipse cx="0" cy="${dy}" rx="${r}" ry="${r*.36}" fill="#f4f1ea" stroke-width="1.1"/>${[-.6,0,.6].map((k,i)=>`<circle cx="${f(k*r*.6)}" cy="${dy-2}" r="2.2" fill="${['#f0a8c0','#9fd0a0','#fbe08a'][i]}" stroke-width=".8"/>`).join('')}`).join('')}</g>`;
const SWW=104,SWD=76; /* 半寬、桌面深度 */
const sweetTable=()=>{let s=sh(SWW,6)+`<rect x="${-SWW}" y="${-SWD-18}" width="${2*SWW}" height="${SWD}" rx="3" fill="#fbe9ee"/>`;
 let lc='';for(let x=-SWW;x<SWW;x+=13)lc+=`M${x},${-SWD-18} q6.5,-4 13,0 `;s+=`<path d="${lc}" fill="none" stroke="#f0a0b4" stroke-width="1.6"/>`;
 let sk=`M${-SWW},-18 H${SWW} V-4 `;for(let x=SWW;x>-SWW;x-=16)sk+=`Q${x-8},${f(5)} ${x-16},-4 `;s+=`<path d="${sk}Z" fill="#f4cfd8"/>`;
 let lace='';for(let x=-SWW+8;x<SWW;x+=16)lace+=`<circle cx="${x}" cy="-12" r="2" fill="#fbf8f0" stroke-width=".8"/>`;s+=lace+`<path d="M${-SWW},-18 H${SWW}" fill="none" stroke="#e0b44a" stroke-width="2.2"/>`;
 s+=stand3(-48,-44)+stand3(52,-44);
 [[-84,-72],[-14,-72],[16,-74],[84,-72],[-84,-34],[-12,-36],[18,-30],[86,-34],[0,-56]].forEach(([x,y],i)=>s+=pk(dSweet)(x,y));
 return s};
/* 酒桶架：兩個大木桶躺在架子上，前面有龍頭，管理員拿陶壺接葡萄汁 */
const caskRack=()=>{let s=sh(56,7)+`<path d="M-50,0 V-20 M50,0 V-20 M-54,-20 H54" fill="none" stroke="${OL}" stroke-width="6"/><path d="M-50,0 V-20 M50,0 V-20 M-54,-20 H54" fill="none" stroke="#7a5235" stroke-width="3.6"/>`;
 for(const [x,y] of [[-24,-40],[24,-40],[0,-74]]){s+=`<ellipse cx="${x}" cy="${y}" rx="22" ry="20" fill="#a8703f"/><ellipse cx="${x}" cy="${y}" rx="16" ry="14.4" fill="#c99a5b" stroke-width="1.4"/><ellipse cx="${x}" cy="${y}" rx="22" ry="20" fill="none" stroke="#5a5e6a" stroke-width="3"/><circle cx="${x}" cy="${y+4}" r="2.4" fill="#5a3a20" stroke="none"/><path d="M${x},${y+6} v6 h4" fill="none" stroke="#8a929c" stroke-width="2.4"/>`}
 s+=act(-62,0,1,{view:'side',pose:'reach',hat:-1,hs:1,beard:true,skin:'#e8c4a0',hair:'#8a6a50',shirt:'#6a5a48',top:'long',bottom:'pants',pants:'#3a2e2a',
  extra:`<path d="M13,-22 Q11,-12 15,-10 H21 Q25,-12 23,-22Z" fill="#c4704a" stroke-width="1.3"/>`},'nod');
 return s};
/* 獵犬（坐著仰頭看桌子） */
const hound=(c='#9a8e84')=>`<path d="M-14,0 Q-18,-14 -8,-20 Q4,-24 8,-14 L10,0Z" fill="${c}"/><path d="M-16,-4 Q-24,-6 -22,-14" fill="none" stroke="${OL}" stroke-width="4.4" stroke-linecap="round"/><path d="M-16,-4 Q-24,-6 -22,-14" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>`+
 `<path d="M2,-20 Q2,-34 12,-36 Q22,-36 24,-28 L26,-26 Q22,-22 16,-24 Q10,-20 8,-14Z" fill="${c}"/><path d="M8,-34 Q2,-30 4,-20 Q9,-24 11,-32Z" fill="#6a5e54" stroke-width="1.3"/><circle cx="16" cy="-31" r="1.6" fill="${OL}" stroke="none"/><circle cx="25.6" cy="-27" r="1.6" fill="${OL}" stroke="none"/>`+
 `<path d="M4,0 V-8 M8,0 V-10" fill="none" stroke="${OL}" stroke-width="4"/><path d="M4,0 V-8 M8,0 V-10" fill="none" stroke="${c}" stroke-width="2.4"/><path d="M22,-24 q1,4 -1,6" fill="none" stroke="#9fd0e0" stroke-width="1.6"/>`;
/* 斗篷架、盔甲、盆栽、凳子、陶壺、籃子、麵粉袋、柴堆 */
const cloakRack=()=>sh(24,5)+`<path d="M-14,0 L0,-8 L14,0" fill="none" stroke="#5a3a22" stroke-width="3.4"/><path d="M0,-6 V-92" fill="none" stroke="${OL}" stroke-width="5.4"/><path d="M0,-6 V-92" fill="none" stroke="#7a5235" stroke-width="3.2"/><circle cx="0" cy="-94" r="4" fill="#7a5235" stroke-width="1.4"/>`+
 `<path d="M-2,-84 Q-22,-80 -20,-40 L-6,-36 Q-10,-60 -2,-74Z" fill="#2f4f8a" stroke-width="1.8"/><path d="M2,-84 Q22,-80 20,-44 L8,-40 Q10,-62 2,-74Z" fill="#8e2630" stroke-width="1.8"/><path d="M-12,-92 Q-12,-104 0,-104 Q12,-104 12,-92 Z" fill="#3a2e2a" stroke-width="1.6"/><path d="M-16,-92 H16" fill="none" stroke-width="2.4"/><path d="M6,-102 Q14,-114 20,-108" fill="none" stroke="#e0b44a" stroke-width="2.6"/>`;
/* 玄關站崗的衛兵（2026-11-20 使用者選 A 騎士：側身、拿藍底皇冠旗、沒有披風、頭盔包住整顆頭）；kind 仍叫 armor18（物件、幸運草位置沿用） */
const gHelm=`<path d="M-16,-23 V-40 Q-16,-55 1,-55 Q17,-54 17,-40 L17,-25 Q2,-18 -16,-23Z" fill="#c4cad2"/><path d="M-16,-30 Q-12,-26 -9,-27" fill="none" stroke="#8a929c" stroke-width="1.2"/><path d="M2,-37 H17" fill="none" stroke="${OL}" stroke-width="3"/><path d="M9,-31 v3 M13,-31 v3" fill="none" stroke="${OL}" stroke-width="1.3"/><path d="M-15,-42 Q0,-46 16,-42" fill="none" stroke="#8a929c" stroke-width="1.4"/><path d="M-2,-55 Q-10,-66 -2,-74 Q6,-64 2,-54Z" fill="#b8402e" stroke-width="1.4"/>`;
const gPlate=`<path d="M-8,-18 Q2,-21 9,-17 L9,-4 Q0,-1 -8,-4Z" fill="#c4cad2"/><path d="M-6,-11 Q2,-8 9,-11" fill="none" stroke="#8a929c" stroke-width="1.2"/><circle cx="0" cy="-15" r="6.4" fill="#c4cad2"/><path d="M-5,-14 Q0,-18 5,-14" fill="none" stroke="#8a929c" stroke-width="1.1"/><path d="M-6,-5 H8 V-1 H-6Z" fill="#a3aab4" stroke-width="1.2"/>`;
const gFlag=`<path d="M14,4 V-104" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M14,4 V-104" fill="none" stroke="#8a6a40" stroke-width="2.4"/><circle cx="14" cy="-107" r="3.4" fill="#e0b44a" stroke-width="1.2"/><path d="M15,-102 h26 v30 l-13,-7 l-13,7Z" fill="#2f4f8a" stroke-width="1.4"/><path d="M22,-88 l5,-5 l5,5 v5 h-10Z" fill="#e0b44a" stroke="none"/>`;
const armorStand=()=>sh(18,5)+T(0,0,1.3,gFlag+kid({view:'side',pose:'hold',hat:-1,hs:0,hair:'#c4cad2',skin:'#e8c4a0',shirt:'#c4cad2',pants:'#8a929c',top:'long',bottom:'pants',mood:0})+gPlate+gHelm);
const plant=()=>sh(18,5)+`<path d="M-12,0 L-14,-20 H14 L12,0Z" fill="#a8564a"/><path d="M-15,-20 H15" fill="none" stroke-width="2.6"/>`+[[-14,-50],[-6,-60],[4,-58],[13,-48],[0,-44],[-10,-36],[10,-34]].map(([x,y])=>`<path d="M0,-20 Q${x*.4},${(y-20)/2} ${x},${y} Q${x*.8+4},${(y-20)/2+6} 0,-20Z" fill="#5f8e48" stroke-width="1.4"/>`).join('');
const stool=()=>sh(12,4)+`<path d="M-8,0 L-6,-14 M8,0 L6,-14" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M-8,0 L-6,-14 M8,0 L6,-14" fill="none" stroke="#8a5a30" stroke-width="2.6"/><ellipse cx="0" cy="-15" rx="11" ry="4" fill="#a8703f"/>`;
const jug=()=>sh(8,3)+`<path d="M-7,0 Q-10,-10 -5,-16 V-20 H5 V-16 Q10,-10 7,0Z" fill="#b8724a"/><path d="M5,-16 q7,2 2,10" fill="none" stroke-width="2"/><path d="M-5,-20 l-3,-2" fill="none" stroke-width="2"/>`;
const vbasket=()=>sh(16,4)+`<path d="M-14,-12 Q-14,0 0,0 Q14,0 14,-12Z" fill="#c99a5b"/><path d="M-14,-12 H14 M-10,-6 H10" fill="none" stroke="#8a6a3a" stroke-width="1.2"/>`+[[-8,-15,'#e8742a'],[-2,-17,'#7aa856'],[5,-15,'#d8413a'],[10,-14,'#f0e0b0']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="4.4" fill="${c}" stroke-width="1.2"/>`).join('')+`<path d="M-8,-19 l-2,-6 M-6,-19 l1,-6" fill="none" stroke="#5f8e48" stroke-width="1.6"/>`;
const sack=()=>sh(22,5)+`<path d="M-18,0 Q-21,-16 -12,-22 L-14,-26 H-4 L-6,-22 Q4,-16 1,0Z" fill="#efe6d2"/><path d="M-14,-26 H-4" fill="none" stroke="#8a6a3a" stroke-width="2"/><path d="M-2,0 Q-5,-18 5,-24 L3,-28 H13 L11,-24 Q21,-18 18,0Z" fill="#e8dcc0"/><path d="M3,-28 H13" fill="none" stroke="#8a6a3a" stroke-width="2"/><circle cx="8" cy="-28.6" r="3" fill="#fbfaf6" stroke="none" opacity=".9"/>`;
const firewood=()=>sh(22,5)+[[-12,-6],[0,-6],[12,-6],[-6,-16],[6,-16],[0,-26]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6.4" fill="#a8703f" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="3" fill="none" stroke="#7a5235" stroke-width="1"/>`).join('');
/* 廚房：大灶（烤全豬）、麵包窯、燉湯大鍋、工作桌、甜點工作桌、洗碗盆 */
const pigRoast=(sc=1)=>`<g transform="scale(${sc})"><path d="M-30,0 Q-32,-18 -10,-22 Q14,-24 26,-12 Q32,-4 28,2 Q0,8 -30,0Z" fill="#c9783a"/><path d="M-22,-12 Q-6,-20 12,-17" fill="none" stroke="#e8a35a" stroke-width="2.4"/>`+
 `<path d="M26,-12 L34,-8 Q36,-2 30,0" fill="#c9783a"/><circle cx="34" cy="-4" r="4.6" fill="#d8413a" stroke-width="1.3"/><path d="M34,-9 l1,-3" fill="none" stroke="#5a7a2a" stroke-width="1.4"/><path d="M18,-18 l3,-6 l3,5" fill="#b8682a" stroke-width="1.2"/><path d="M22,-12 q2,-2 4,0" fill="none" stroke-width="1.4"/>`+
 `<path d="M-30,-4 q-6,-2 -8,-8" fill="none" stroke="#b8682a" stroke-width="2"/><path d="M-20,1 v5 M-6,3 v5 M8,3 v5 M18,1 v5" fill="none" stroke="#a8582a" stroke-width="3.2" stroke-linecap="round"/></g>`;
const spit=()=>{let s=`<ellipse cx="0" cy="2" rx="108" ry="14" fill="#ffb24a" opacity=".22" stroke="none"/><path d="M-100,0 V-140 H100 V0Z" fill="#8f7a66"/><path d="M-100,-100 H-74 M74,-100 H100 M-100,-60 H-74 M74,-60 H100 M-100,-20 H-74 M74,-20 H100 M-88,-140 V-100 M88,-100 V-60 M-88,-60 V-20 M88,-20 V0" fill="none" stroke="#6e5a4a" stroke-width="1.3"/>`;
 s+=`<rect x="-108" y="-150" width="216" height="12" rx="2" fill="#6e5444"/><path d="M-74,0 V-96 Q0,-132 74,-96 V0Z" fill="#2a1c18"/><ellipse cx="0" cy="-22" rx="58" ry="26" fill="#ff9a3a" opacity=".3" stroke="none"/>`;
 s+=`<path d="M-48,-6 L44,-14 M-44,-14 L48,-6" fill="none" stroke="#5a3a22" stroke-width="7" stroke-linecap="round"/>`;
 /* 2026-11-20 使用者選 C-B 再修改：火的上方更尖、不分色改漸層（現在的色調）；偶爾冒出火精靈的眼睛（全黑瞳孔）和張開的橢圓嘴巴 */
 /* 2026-11-20 使用者：漸層不錯，上方要更紅、要有立體感、底部是圓弧 → 選 D 的顏色＋B 三層火焰（外紅、中橘、內黃，各有火舌） */
 s+=`<defs><linearGradient id="fo18" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f5c84a"/><stop offset=".35" stop-color="#ea7a2c"/><stop offset=".7" stop-color="#d0301e"/><stop offset="1" stop-color="#9e1a14"/></linearGradient>`+
  `<linearGradient id="fm18" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fbe08a"/><stop offset=".5" stop-color="#f5a83a"/><stop offset="1" stop-color="#ec6a2a"/></linearGradient><linearGradient id="fi18" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff6c8"/><stop offset="1" stop-color="#f5d34a"/></linearGradient></defs>`+
  `<style>.fs18{animation:fs18 9s ease-in-out infinite}@keyframes fs18{0%,48%{opacity:0}54%,90%{opacity:1}96%,100%{opacity:0}}.fe18{transform-box:fill-box;transform-origin:50% 50%;animation:fe18 9s infinite}@keyframes fe18{0%,70%,74%,100%{transform:scaleY(1)}72%{transform:scaleY(.1)}}</style>`;
 s+=`<g class="an a-fire" style="--d:.7s"><path d="M-42,-6 Q-50,-24 -36,-36 L-32,-62 Q-24,-42 -15,-42 L-6,-78 Q3,-50 9,-46 L19,-68 Q24,-42 31,-40 L38,-54 Q48,-28 40,-8 Q0,6 -42,-6Z" fill="url(#fo18)"/>`+
  `<path d="M-32,-6 Q-38,-20 -28,-30 L-24,-48 Q-18,-34 -11,-34 L-4,-62 Q3,-40 8,-37 L15,-52 Q19,-34 25,-32 L29,-42 Q36,-22 30,-7 Q0,3 -32,-6Z" fill="url(#fm18)" stroke="#c8501f" stroke-width="1.2"/>`+
  `<path d="M-20,-6 Q-24,-16 -16,-24 L-12,-36 Q-8,-26 -3,-27 L2,-46 Q6,-30 10,-27 L14,-36 Q20,-20 18,-7 Q0,0 -20,-6Z" fill="url(#fi18)" stroke="none"/></g>`;
 s+=`<g class="fs18">${[-9,9].map(x=>`<ellipse class="fe18" cx="${x}" cy="-30" rx="5" ry="6" fill="#fff" stroke-width="1.3"/>`).join('')}${[-8,10].map(x=>`<circle cx="${x}" cy="-29" r="2.8" fill="${OL}" stroke="none"/>`).join('')}<ellipse cx="0" cy="-16" rx="5.4" ry="4.2" fill="#7a2a18" stroke-width="1.4"/></g>`;
 s+=`<path d="M-64,-68 V-20 M64,-68 V-20" fill="none" stroke="#4a4f5c" stroke-width="4"/><path d="M-72,-68 H76" fill="none" stroke="${OL}" stroke-width="5"/><path d="M-72,-68 H76" fill="none" stroke="#8a929c" stroke-width="2.6"/>`;
 s+=T(0,-56,1.05,pigRoast());
 s+=`<circle cx="80" cy="-68" r="9" fill="none" stroke="#4a4f5c" stroke-width="3"/><path d="M80,-68 L88,-60" fill="none" stroke="#4a4f5c" stroke-width="3"/>`;
 s+=act(106,0,-1,{...cook({hat:HAT_CHEF,shirt:'#fbf9f2'}),view:'side',pose:'reach',mood:1,skin:'#d9a578'},'work');
 return s};
const oven=()=>{let s=sh(56,7)+`<rect x="-14" y="-118" width="22" height="34" fill="#a85640"/><circle cx="-2" cy="-128" r="8" fill="#e8e4dc" stroke="none" opacity=".75"/><circle cx="6" cy="-140" r="6" fill="#e8e4dc" stroke="none" opacity=".55"/>`;
 s+=`<path d="M-50,0 V-40 Q-50,-96 0,-98 Q50,-96 50,-40 V0Z" fill="#b5663f"/>`;
 let br='';for(let y=-12;y>-90;y-=14)br+=`M-48,${y} H48 `;s+=`<path d="${br}" fill="none" stroke="#934a2c" stroke-width="1.2"/>`;
 s+=`<path d="M-24,0 V-26 Q0,-50 24,-26 V0Z" fill="#3a1e14"/><path d="M-18,0 Q-14,-18 0,-22 Q14,-18 18,0Z" fill="#f08a3a" opacity=".85" stroke="none"/><ellipse cx="0" cy="-6" rx="12" ry="4" fill="#d9963a" stroke-width="1.2"/>`;
 s+=`<path d="M-60,0 L-36,-60" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M-60,0 L-36,-60" fill="none" stroke="#a8784a" stroke-width="2.6"/><ellipse cx="-34" cy="-66" rx="7" ry="10" fill="#c99a5b" transform="rotate(22 -34 -66)"/>`;
 /* 開窯的麵包師，熱氣撲臉 */
 s+=act(64,0,-1,{...cook({hat:HAT_CHEF}),view:'side',pose:'reach',mood:2,skin:'#e8c4a0'},'bend')+an('steam','2.2',`<circle cx="36" cy="-48" r="8" fill="#fbf6ea" opacity=".75" stroke="none"/>`)+an('steam','2.6',`<circle cx="46" cy="-40" r="6" fill="#fbf6ea" opacity=".7" stroke="none"/>`);
 return s};
const cauldron=()=>{let s=sh(40,6)+`<path d="M-26,0 L-30,6 M26,0 L30,6 M0,2 V8" fill="none" stroke="#3a3a40" stroke-width="3"/>`;
 s+=`<g class="an a-fire" style="--d:.7s"><path d="M-18,2 Q-20,-10 -8,-16 Q-4,-8 0,-12 Q6,-20 12,-10 Q20,-6 18,2Z" fill="#f08a3a"/></g>`;
 s+=`<path d="M-32,-30 Q-34,-6 -20,-2 H20 Q34,-6 32,-30Z" fill="#3a3a40"/><ellipse cx="0" cy="-30" rx="32" ry="8" fill="#4a4a52"/><ellipse cx="0" cy="-30" rx="27" ry="5.6" fill="#c9853a"/><circle cx="-10" cy="-30" r="2.4" fill="#e8742a" stroke="none"/><circle cx="8" cy="-31" r="2" fill="#7aa856" stroke="none"/>`;
 /* 自己攪拌的湯杓 */
 s+=`<g class="an a-swing" style="--d:2.2s">${tube('M4,-32 L18,-74','#a8703f',2.6)}<ellipse cx="2" cy="-31" rx="6" ry="2.6" fill="#8a5a30" stroke-width="1.2"/></g>`;
 s+=an('steam','3.2',`<circle cx="-10" cy="-46" r="8" fill="#fbf6ea" opacity=".75" stroke="none"/>`)+an('steam','3.8',`<circle cx="8" cy="-50" r="7" fill="#fbf6ea" opacity=".7" stroke="none"/>`);
 s+=act(52,0,-1,{...cook({hat:HAT_CHEF}),view:'side',pose:'hold',mood:2,skin:'#c98d5e',extra:`<path d="M12,-18 L4,-30" fill="none" stroke="#a8703f" stroke-width="2.4"/><ellipse cx="3" cy="-31" rx="4" ry="2" fill="#8a5a30" stroke-width="1"/>`},'nod');
 return s};
const kTable=(cakes)=>{let s=sh(80,7)+`<path d="M-76,0 V-30 M76,0 V-30 M-66,0 V-30 M66,0 V-30" fill="none" stroke="${OL}" stroke-width="6"/><path d="M-76,0 V-30 M76,0 V-30" fill="none" stroke="#7a5235" stroke-width="3.6"/>`;
 s+=`<path d="M-80,-44 H80 L84,-32 H-84Z" fill="#c99a5b"/><rect x="-84" y="-32" width="168" height="8" fill="#a8703f"/><path d="M-80,-38 H80" fill="none" stroke="#a8784a" stroke-width="1.1"/>`;
 if(cakes){s+=[[-50,'#fbf3ea','#f0a0b4'],[-12,'#7a4a2a','#fbf6ea'],[30,'#fbe9a8','#d8413a']].map(([x,c,c2])=>`<g transform="translate(${x},-42)"><rect x="-14" y="-16" width="28" height="16" rx="3" fill="${c}"/><path d="M-14,-13 Q-7,-8 0,-13 Q7,-8 14,-13" fill="none" stroke="${c2}" stroke-width="2.2"/></g>`).join('');
  s+=`<g transform="translate(62,-44)"><path d="M-8,0 L-4,-14 H4 L8,0Z" fill="#fbf8f0" stroke-width="1.3"/><path d="M-4,-14 L0,-20 L4,-14" fill="#e8dcc0" stroke-width="1.2"/></g>`}
 else{s+=`<g transform="translate(-48,-42)"><circle cx="-8" cy="-6" r="8" fill="#7aa856"/><path d="M-12,-6 Q-8,-12 -4,-6" fill="none" stroke="#5f8e48" stroke-width="1.2"/>${tube('M4,-4 L22,-10','#e8742a',3.6)}</g>`;
  s+=`<g transform="translate(-2,-42)"><ellipse cx="0" cy="-4" rx="16" ry="5" fill="#f4ead2"/><path d="M-8,-6 Q0,-10 8,-6" fill="none" stroke="#d9c49a" stroke-width="1.2"/></g>`;
  s+=`<g transform="translate(40,-42)"><circle cx="-6" cy="-4" r="5" fill="#e8dcc0" stroke-width="1.3"/><circle cx="4" cy="-4" r="5" fill="#b07aa0" stroke-width="1.3"/><path d="M12,-2 L26,-10" fill="none" stroke="#9aa2ad" stroke-width="2.4"/><rect x="22" y="-10" width="10" height="5" rx="1.4" fill="#5a3a20" stroke-width="1.1" transform="rotate(-30 27 -8)"/></g>`}
 return s};
const washTub=()=>{let s=sh(34,6)+`<path d="M-26,-22 L-22,0 H22 L26,-22Z" fill="#a8784a"/><path d="M-25,-14 H25 M-24,-6 H24" fill="none" stroke="#5a5e6a" stroke-width="2.2"/><ellipse cx="0" cy="-22" rx="26" ry="6" fill="#9fc8d4"/><circle cx="-10" cy="-26" r="4" fill="#fbfbf6" stroke="none" opacity=".9"/><circle cx="6" cy="-27" r="5" fill="#fbfbf6" stroke="none" opacity=".9"/>`;
 let pt='';for(let i=0;i<9;i++)pt+=`<ellipse cx="${f(36+Math.sin(i*1.7)*3)}" cy="${-4-i*6}" rx="12" ry="3.4" fill="#fbf8f0" stroke-width="1.3"/>`;
 s+=`<g class="an a-lean" style="--d:1.6s">${pt}</g>`+act(-2,0,1,{...servant({hat:-1,hs:1}),view:'fq',pose:'up2',mood:2,skin:'#f0cfae'},false);
 return s};

/* ---- 佈景圖鑑（KIND）：場地外、POOL、干擾物都要登記 ---- */
const dk=(id,w,h,cy=-12)=>({w,h,fn:()=>T(0,cy,1,DECOY[id])});
Object.assign(KIND,{
 torch18:{w:40,h:170,fn:torch},head18:{w:610,h:60,fn:headTable},tbl18:{w:96,h:30,fn:()=>tblSeg(0)},candles18:{w:80,h:40,fn:candleGrp},
 sweet18:{w:212,h:96,fn:sweetTable},cask18:{w:150,h:100,fn:caskRack},cloak18:{w:50,h:110,fn:cloakRack},armor18:{w:50,h:150,fn:armorStand},
 plant18:{w:36,h:62,fn:plant},stool18:{w:24,h:20,fn:stool},jug18:{w:18,h:22,fn:jug},basket18:{w:32,h:24,fn:vbasket},sack18:{w:42,h:30,fn:sack},firewood18:{w:40,h:34,fn:firewood},
 spit18:{w:220,h:160,fn:spit},oven18:{w:130,h:130,fn:oven},soup18:{w:110,h:80,fn:cauldron},ktable18:{w:170,h:60,fn:()=>kTable(false)},ptable18:{w:170,h:60,fn:()=>kTable(true)},wash18:{w:90,h:70,fn:washTub},
 yam18:dk('yam18',36,22,-2),fork18:dk('fork18',30,40,-6),jar18:dk('jar18',30,32,-6),cush18:dk('cush18',36,24,-4),shade18:dk('shade18',30,30,-6),
 funnel18:dk('funnel18',30,38,-6),rook18:dk('rook18',20,34,-6),bowl18:dk('bowl18',32,22,-4),napkin18:dk('napkin18',32,22,-4),straw18:dk('straw18',36,26,-4),
 hglass17:KIND.hglass17||dk('hglass17',24,36,-6),gourd17:KIND.gourd17||dk('gourd17',26,40,-6)});
['sweet18','cask18','ktable18','ptable18','oven18','cloak18','armor18','sack18','basket18','firewood18','plant18'].forEach(k=>H.OCCK.add(k));

/* ================= 4. 12 種 × 4 個（10 種新東西＋2 種第 17 關的老朋友） ================= */
const OLD={goblet17:{id:'goblet17',name:'高腳金杯',short:'金杯',r:15,rot:8},lute17:{id:'lute17',name:'魯特琴',short:'魯特琴',r:16,rot:12}};
const old=(id,regions)=>({...(typeOf(id)||OLD[id]),regions});
const TYPES=[
 old('goblet17',['dais18','hallC18','sweets18','foyer18']),old('lute17',['music18','foyer18','hallW18','dais18']),
 {id:'drum18',name:'烤雞腿',short:'雞腿',r:16,rot:20,regions:['kitchen18','hallW18','hallE18','sweets18']},
 {id:'cdl18',name:'三叉銀燭台',short:'燭台',r:16,rot:6,regions:['dais18','hallC18','music18','foyer18']},
 {id:'honey18',name:'蜂蜜罐',short:'蜂蜜罐',r:15,rot:8,regions:['kitchen18','sweets18','hallE18','hallW18']},
 {id:'cheese18',name:'起司輪',short:'起司',r:16,rot:8,regions:['kitchen18','hallC18','dais18','sweets18']},
 {id:'jelly18',name:'搖晃的果凍',short:'果凍',r:15,rot:6,regions:['sweets18','hallE18','dais18','kitchen18']},
 {id:'bell18',name:'金色餐鈴',short:'餐鈴',r:15,rot:15,regions:['foyer18','dais18','hallW18','music18']},
 {id:'pep18',name:'胡椒研磨罐',short:'胡椒罐',r:15,rot:12,regions:['kitchen18','hallC18','hallW18','foyer18']},
 {id:'cloche18',name:'銀色圓頂餐蓋',short:'餐蓋',r:16,rot:6,regions:['hallE18','kitchen18','dais18','sweets18']},
 {id:'invit18',name:'蠟封邀請函',short:'邀請函',r:15,rot:25,regions:['foyer18','music18','hallC18','hallE18']},
 {id:'wreath18',name:'編織麵包環',short:'麵包環',r:16,rot:20,regions:['kitchen18','hallW18','foyer18','music18']}];
LEVELS[N].types=TYPES;
/* BORROW：不借（大餐廳的物件不混進前面的關卡） */

/* ================= 5. 地形、區域 ================= */
const WY=600;                                  /* 北牆底 */
const TX=[930,1250,1570],TY0=870,TY1=1450;     /* 3 張長桌（南北向） */
const DAIS={x0:880,x1:1620,y1:792};            /* 高台 */
const STEPX=[1090,1410];                       /* 高台的兩組台階＋走道紅地毯 */
const PART=1560,PX=1192,DOORX=[1040,1124],SIDE=[1880,1960];  /* 後廚隔牆、拱門、側門 */
const WINX=[860,1050,1450,1640];
const KING={x:1215,y:712},QUEEN={x:1285,y:712};
const TORCH=[[660,606],[770,606],[1735,606],[1845,606]];  /* 牆上小火炬（原本兩座大壁爐的位置） */
Object.assign(REG,{dais18:{x:900,y:650,w:700,h:150},hallW18:{x:840,y:860,w:250,h:680},hallC18:{x:1090,y:860,w:320,h:680},hallE18:{x:1410,y:860,w:250,h:680},
 music18:{x:620,y:840,w:220,h:700},sweets18:{x:1660,y:820,w:220,h:740},kitchen18:{x:630,y:1600,w:540,h:520},foyer18:{x:1240,y:1580,w:640,h:540},all18:{x:620,y:820,w:1260,h:1300}});
H.SCREG[N]=['hallW18','hallC18','hallE18','music18','sweets18','kitchen18','foyer18'];
/* 小故事三個角色的固定位置：主廚在後廚、小白鼠在東邊的蛋糕塔、甜點師在後廚的甜點工作桌旁 */
const SPOT={giver:[880,1730],target:[1722,1440],helper:[1096,2070]};

function ground(){
 const Sc=H.SCENES[N],X0=Sc.x0-420,X1=Sc.x1+420,YB=Sc.y1+420,WW=X1-X0;let g='';
 g+=`<defs><linearGradient id="win18" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2452"/><stop offset=".5" stop-color="#363a78"/><stop offset=".78" stop-color="#734d88"/><stop offset=".93" stop-color="#e08a5c"/><stop offset="1" stop-color="#f3b46c"/></linearGradient>`+
  `<radialGradient id="glow18"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".5"/><stop offset="1" stop-color="#ffe2a0" stop-opacity="0"/></radialGradient></defs>`;
 /* 石板地 */
 g+=`<rect x="${X0}" y="${WY-10}" width="${WW}" height="${YB-WY+10}" fill="#c4a67a" stroke="none"/>`;
 let fl='';for(let y=WY+40,k=0;y<YB;y+=44,k++){fl+=`M${X0},${y} H${X1} `;for(let x=X0+(k%2)*38;x<X1;x+=76)fl+=`M${x},${y-44} V${y} `}
 g+=`<path d="${fl}" fill="none" stroke="#ad8f66" stroke-width="1.3"/>`;
 /* 蠟燭、壁爐照在地上的暖光（半透明漸層，不用模糊濾鏡） */
 [[930,1160,250,440],[1250,1160,250,440],[1570,1160,250,440],[715,640,150,70],[1790,640,150,70],[725,1225,160,120],[1560,1900,300,220],[1250,760,420,120]].forEach(([x,y,rx,ry])=>g+=`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#glow18)" stroke="none"/>`);
 /* ---- 北牆：石塊、天花板大梁、高窗、王室掛毯、旗幟 ---- */
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="${WY+420}" fill="#76604f"/>`;
 let bl='';for(let y=WY-34,k=0;y>-420;y-=34,k++){bl+=`M${X0},${y} H${X1} `;for(let x=X0+(k%2)*40;x<X1;x+=80)bl+=`M${x},${y} V${y+34} `}
 g+=`<path d="${bl}" fill="none" stroke="#62503f" stroke-width="1.3"/>`;
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="440" fill="#2e221c" stroke="none" opacity=".55"/><rect x="${X0}" y="20" width="${WW}" height="80" fill="#2e221c" stroke="none" opacity=".25"/>`;
 g+=`<rect x="${X0}" y="6" width="${WW}" height="30" fill="#5a3e2c"/><path d="M${X0},14 H${X1}" fill="none" stroke="#4a3022" stroke-width="1.4"/>`;
 for(let x=640;x<=1880;x+=155)g+=`<path d="M${x-12},36 h24 l-7,34 h-10Z" fill="#5a3e2c"/>`;
 const win=(cx,moon)=>{const w=58,y0=170,y1=520;let s=`<path d="M${cx-w-10},${y1+8} V240 Q${cx-w-10},${y0-14} ${cx},${y0-40} Q${cx+w+10},${y0-14} ${cx+w+10},240 V${y1+8}Z" fill="#9a8470"/>`;
  s+=`<path d="M${cx-w},${y1} V242 Q${cx-w},${y0} ${cx},${y0-26} Q${cx+w},${y0} ${cx+w},242 V${y1}Z" fill="url(#win18)"/>`;
  for(let i=0;i<7;i++)s+=`<circle cx="${f(cx+sr(-w+8,w-8))}" cy="${f(sr(y0-4,340))}" r="${f(sr(.9,1.8))}" fill="#fff8d8" stroke="none"/>`;
  if(moon)s+=`<circle cx="${cx+14}" cy="${y0+66}" r="19" fill="#fbf1c8" stroke="none"/><circle cx="${cx+22}" cy="${y0+60}" r="16" fill="#3a3c78" stroke="none" opacity=".55"/><circle cx="${cx+14}" cy="${y0+66}" r="30" fill="#fbf1c8" opacity=".12" stroke="none"/>`;
  s+=`<path d="M${cx-w},${y1} V${y1-40} Q${cx-30},${y1-64} ${cx},${y1-46} Q${cx+30},${y1-62} ${cx+w},${y1-38} V${y1}Z" fill="#2a2342" stroke="none"/>`;
  for(let i=0;i<6;i++)s+=`<circle cx="${f(cx+sr(-w+10,w-10))}" cy="${f(sr(y1-30,y1-8))}" r="1.9" fill="#ffd36a" stroke="none"/>`;
  s+=`<path d="M${cx},${y0-26} V${y1} M${cx-w},380 H${cx+w} M${cx-w},455 H${cx+w}" fill="none" stroke="#3a2e28" stroke-width="4"/><circle cx="${cx}" cy="${y0+30}" r="15" fill="none" stroke="#3a2e28" stroke-width="3.4"/>`;
  s+=`<path d="M${cx-w},${y1} V242 Q${cx-w},${y0} ${cx},${y0-26} Q${cx+w},${y0} ${cx+w},242 V${y1}Z" fill="none" stroke-width="2.4"/>`;
  s+=`<rect x="${cx-w-16}" y="${y1+4}" width="${2*w+32}" height="14" rx="3" fill="#a8927c"/>`;
  return s};
 WINX.forEach((x,i)=>g+=win(x,i===2));
 /* 王室掛毯（王座後面）：紅底金邊、盾牌＋皇冠＋星星（原創紋章） */
 const tp=1250;
 g+=`<rect x="${tp-118}" y="84" width="236" height="12" rx="6" fill="#6a4228"/><circle cx="${tp-122}" cy="90" r="8" fill="#e0b44a" stroke-width="1.6"/><circle cx="${tp+122}" cy="90" r="8" fill="#e0b44a" stroke-width="1.6"/>`;
 g+=`<path d="M${tp-104},96 H${tp+104} V520 L${tp+78},548 L${tp+52},520 L${tp+26},548 L${tp},520 L${tp-26},548 L${tp-52},520 L${tp-78},548 L${tp-104},520Z" fill="#8e2630"/>`;
 g+=`<path d="M${tp-92},110 H${tp+92} V506 H${tp-92}Z" fill="none" stroke="#e0b44a" stroke-width="4"/>`;
 g+=`<path d="M${tp-48},250 H${tp+48} V330 Q${tp+48},392 ${tp},416 Q${tp-48},392 ${tp-48},330Z" fill="#2f4f8a" stroke-width="2.4"/><path d="M${tp-40},258 H${tp+40} V330 Q${tp+40},384 ${tp},406 Q${tp-40},384 ${tp-40},330Z" fill="none" stroke="#e0b44a" stroke-width="2"/>`;
 {const c=tp,cy=330,R=22,ri=9;let d='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?ri:R;d+=`${i?'L':'M'}${f(c+Math.cos(a)*rr)},${f(cy+Math.sin(a)*rr)} `}g+=`<path d="${d}Z" fill="#f0c94a" stroke-width="1.6"/>`}
 g+=`<path d="M${tp-38},236 L${tp-40},196 L${tp-22},216 L${tp},180 L${tp+22},216 L${tp+40},196 L${tp+38},236Z" fill="#e8c04a" stroke-width="2"/><circle cx="${tp}" cy="224" r="5" fill="#c4473a" stroke-width="1.2"/>`;
 /* 兩面藍色燕尾旗（窗戶之間） */
 [955,1545].forEach(x=>{g+=`<path d="M${x-26},128 H${x+26}" fill="none" stroke="#6a4228" stroke-width="5"/><path d="M${x-22},130 H${x+22} V410 L${x},388 L${x-22},410Z" fill="#2f4f8a"/><path d="M${x-16},136 V398 M${x+16},136 V398" fill="none" stroke="#e0b44a" stroke-width="2"/>`;
  g+=`<path d="M${x-12},250 L${x-13},226 L${x-6},236 L${x},220 L${x+6},236 L${x+13},226 L${x+12},250Z" fill="#e8c04a" stroke-width="1.4"/>`});
 g+=`<rect x="${X0}" y="${WY-18}" width="${WW}" height="18" fill="#5e4a3c"/>`;
 /* ---- 高台：木地板、王座後面的紅地毯、前緣石階＋兩組台階 ---- */
 g+=`<path d="M${DAIS.x0},${WY} H${DAIS.x1} V${DAIS.y1} H${DAIS.x0}Z" fill="#9c6a42"/>`;
 let pl='';for(let y=WY+24;y<DAIS.y1;y+=24)pl+=`M${DAIS.x0},${y} H${DAIS.x1} `;g+=`<path d="${pl}" fill="none" stroke="#7f5232" stroke-width="1.3"/>`;
 g+=`<rect x="1110" y="${WY+4}" width="280" height="96" fill="#8e2630"/><rect x="1118" y="${WY+10}" width="264" height="84" fill="none" stroke="#e0b44a" stroke-width="2.4"/>`;
 g+=`<rect x="${DAIS.x0}" y="${DAIS.y1}" width="${DAIS.x1-DAIS.x0}" height="26" fill="#7d6a58"/><path d="M${DAIS.x0},${DAIS.y1+1} H${DAIS.x1}" fill="none" stroke="#e0b44a" stroke-width="3"/>`;
 let ds='';for(let x=DAIS.x0+30;x<DAIS.x1;x+=60)ds+=`M${x},${DAIS.y1+4} V${DAIS.y1+26} `;g+=`<path d="${ds}" fill="none" stroke="#655444" stroke-width="1.3"/>`;
 STEPX.forEach(sx=>{for(let i=0;i<3;i++){const w=104+i*14,y=DAIS.y1+i*16;g+=`<rect x="${sx-w/2}" y="${y}" width="${w}" height="16" fill="${i%2?'#a07c58':'#b08a64'}"/>`}
  g+=`<rect x="${sx-34}" y="${DAIS.y1+48}" width="68" height="${PART-DAIS.y1-58}" fill="#8e2630" stroke="none"/><path d="M${sx-28},${DAIS.y1+48} V${PART-12} M${sx+28},${DAIS.y1+48} V${PART-12}" fill="none" stroke="#e0b44a" stroke-width="2.2" stroke-dasharray="10 6"/>`;
  let fr='';for(let x=sx-32;x<=sx+32;x+=6)fr+=`M${x},${PART-10} v8 `;g+=`<path d="${fr}" fill="none" stroke="#e0b44a" stroke-width="1.4"/>`});
 /* ---- 3 張長桌（桌巾、金色桌旗）＋兩側長椅 ---- */
 TX.forEach(tx=>{
  for(const sg of [-1,1]){const bx=tx+sg*73;g+=`<rect x="${bx-11}" y="${TY0+6}" width="22" height="${TY1-TY0}" rx="3" fill="#7a4e2c"/><rect x="${bx-11}" y="${TY1+6}" width="22" height="10" fill="#5e3a20"/>`}
  g+=`<rect x="${tx-54}" y="${TY0}" width="108" height="${TY1-TY0}" rx="3" fill="#f3ead6"/><rect x="${tx-10}" y="${TY0}" width="20" height="${TY1-TY0}" fill="#c99e48" stroke-width="1.4"/>`;
  let sc=`M${tx-54},${TY1} H${tx+54} V${TY1+20} `;for(let x=tx+54;x>tx-54;x-=27)sc+=`Q${x-13.5},${TY1+29} ${x-27},${TY1+20} `;g+=`<path d="${sc}Z" fill="#e5d6b4"/>`});
 /* ---- 西邊樂師台＋舞池 ---- */
 g+=`<path d="M624,900 H828 V1040 H624Z" fill="#a8784c"/>`;let st='';for(let y=920;y<1040;y+=20)st+=`M624,${y} H828 `;g+=`<path d="${st}" fill="none" stroke="#86603c" stroke-width="1.2"/><rect x="624" y="1040" width="204" height="16" fill="#86603c"/>`;
 g+=`<ellipse cx="725" cy="1240" rx="96" ry="60" fill="#d9c194" stroke="#b89a68" stroke-width="2.4"/><ellipse cx="725" cy="1240" rx="66" ry="40" fill="none" stroke="#c4a674" stroke-width="2"/>`;
 {let d='';for(let i=0;i<8;i++){const a=i*Math.PI/4;d+=`M725,1240 L${f(725+Math.cos(a)*64)},${f(1240+Math.sin(a)*38)} `}g+=`<path d="${d}" fill="none" stroke="#c4a674" stroke-width="1.6"/>`}
 /* ---- 後廚：地磚、隔牆（拱門、掛著的鍋子和香草）、側邊矮牆 ---- */
 g+=`<rect x="${X0}" y="${PART}" width="${PX-X0}" height="${YB-PART}" fill="#a68f70" stroke="none"/>`;
 let kt='';for(let y=PART+40,k=0;y<YB;y+=40,k++){kt+=`M${X0},${y} H${PX} `;for(let x=X0+(k%2)*20;x<PX;x+=40)kt+=`M${x},${y-40} V${y} `}g+=`<path d="${kt}" fill="none" stroke="#8d775a" stroke-width="1.2"/>`;
 g+=`<ellipse cx="880" cy="1800" rx="300" ry="220" fill="url(#glow18)" stroke="none" opacity=".7"/>`;
 g+=`<rect x="${X0}" y="${PART-92}" width="${PX+20-X0}" height="14" fill="#ad977f"/><rect x="${X0}" y="${PART-78}" width="${PX+20-X0}" height="78" fill="#8b7563"/>`;
 let pb='';for(let y=PART-60,k=0;y<PART;y+=20,k++)for(let x=X0+(k%2)*30;x<PX+20;x+=60)pb+=`M${x},${y} h44 `;g+=`<path d="${pb}" fill="none" stroke="#735f4f" stroke-width="1.2"/>`;
 const dm=(DOORX[0]+DOORX[1])/2;
 g+=`<path d="M${DOORX[0]},${PART} V${PART-44} Q${dm},${PART-84} ${DOORX[1]},${PART-44} V${PART}Z" fill="#c4a67a"/><path d="M${DOORX[0]},${PART} V${PART-44} Q${dm},${PART-84} ${DOORX[1]},${PART-44} V${PART}" fill="none" stroke="#6a4228" stroke-width="6"/>`;
 g+=`<path d="M640,${PART-66} H1010" fill="none" stroke="#4a4f5c" stroke-width="3"/>`;
 [[660,'pan'],[700,'herb'],[735,'pan'],[775,'ladle'],[805,'garlic'],[840,'pan'],[880,'herb'],[915,'ladle'],[950,'pan'],[985,'garlic']].forEach(([x,k])=>{
  if(k==='pan')g+=`<path d="M${x},${PART-66} V${PART-56}" fill="none" stroke-width="1.6"/><circle cx="${x}" cy="${PART-44}" r="11" fill="#c4703a"/><circle cx="${x}" cy="${PART-44}" r="6.4" fill="#a8582a" stroke="none"/><rect x="${x-2}" y="${PART-58}" width="4" height="6" fill="#5a3a20" stroke-width="1"/>`;
  else if(k==='ladle')g+=`<path d="M${x},${PART-66} V${PART-38}" fill="none" stroke="#8a929c" stroke-width="2.6"/><path d="M${x-6},${PART-38} Q${x},${PART-28} ${x+6},${PART-38}Z" fill="#9aa2ad" stroke-width="1.3"/>`;
  else if(k==='herb')g+=`<path d="M${x},${PART-66} V${PART-60}" fill="none" stroke-width="1.4"/><path d="M${x-7},${PART-60} L${x},${PART-30} L${x+7},${PART-60}Z" fill="#6f9a4a" stroke-width="1.4"/><path d="M${x-6},${PART-61} H${x+6}" fill="none" stroke="#b8402e" stroke-width="2"/>`;
  else g+=`<path d="M${x},${PART-66} V${PART-30}" fill="none" stroke="#c9a46a" stroke-width="1.6"/>${[-58,-48,-38].map(y=>`<circle cx="${x}" cy="${PART+y}" r="4.4" fill="#f4ecd6" stroke-width="1.2"/>`).join('')}`});
 /* 側邊矮牆（後廚和玄關之間，中間有門） */
 for(const [y0,y1] of [[PART-78,SIDE[0]],[SIDE[1],YB]]){g+=`<rect x="${PX}" y="${y0}" width="22" height="${y1-y0-40}" fill="#ad977f"/><rect x="${PX}" y="${y1-40}" width="22" height="40" fill="#8b7563"/>`}
 /* ---- 東南玄關：從大門進來的紅地毯 ---- */
 g+=`<rect x="1520" y="1600" width="80" height="${YB-1600}" fill="#8e2630" stroke="none"/><path d="M1526,1600 V${YB} M1594,1600 V${YB}" fill="none" stroke="#e0b44a" stroke-width="2.2" stroke-dasharray="10 6"/>`;
 return `<g stroke="${OL}" stroke-width="2" stroke-linejoin="round">${g}</g>`}

/* ================= 6. 建築與佈景 ================= */
Object.assign(POOL,{
 hall18:[['stool18',.5],['jug18',.6],['basket18',.3],['napkin18',.35],['bowl18',.3],['yam18',.3],['fork18',.25],['shade18',.2],['cush18',.25],['hglass17',.2],['gourd17',.2]],
 music18:[['stool18',1],['cush18',.5],['jug18',.4],['gourd17',.3],['napkin18',.3],['straw18',.3],['rook18',.2]],
 sweets18:[['basket18',.6],['jug18',.6],['jar18',.4],['cush18',.3],['napkin18',.3],['shade18',.3],['bowl18',.3]],
 kitchen18:[['sack18',1],['barrel',.9],['crate',.9],['basket18',.8],['firewood18',.6],['jug18',.5],['jar18',.4],['bowl18',.35],['fork18',.35],['yam18',.35],['funnel18',.35]],
 foyer18:[['plant18',.5],['stool18',.4],['cush18',.35],['straw18',.3],['napkin18',.3],['rook18',.25],['hglass17',.25],['funnel18',.2]]});
/* 人群小故事：每組在做一件有趣的事，點了說一句話 */
const grp=(x,y,w,h,kind,svg,say,o={})=>add(x,y,w,h,kind,svg,{say,...o});
const lyre=`<g transform="translate(14,-20)"><path d="M-6,4 Q-10,-8 -6,-16 M6,4 Q10,-8 6,-16 M-6,4 H6 M-7,-12 H7" fill="none" stroke="${OL}" stroke-width="4"/><path d="M-6,4 Q-10,-8 -6,-16 M6,4 Q10,-8 6,-16 M-6,4 H6 M-7,-12 H7" fill="none" stroke="#e0b44a" stroke-width="2.2"/><path d="M-3,3 V-12 M0,3 V-12 M3,3 V-12" fill="none" stroke="#fbf6ea" stroke-width=".8"/></g>`;
const harp=`<g transform="translate(14,-4)"><path d="M0,0 V-50 Q14,-54 20,-40 Q24,-22 32,-4 Z" fill="none" stroke="${OL}" stroke-width="5"/><path d="M0,0 V-50 Q14,-54 20,-40 Q24,-22 32,-4 Z" fill="none" stroke="#e0b44a" stroke-width="3"/><path d="M5,-1 V-48 M10,-2 V-46 M15,-2 V-42 M20,-3 V-36 M25,-3 V-22" fill="none" stroke="#fbf6ea" stroke-width=".8"/></g>`;
const tabor=`<g transform="translate(0,-10)"><rect x="-9" y="-4" width="18" height="10" rx="2" fill="#b8402e" stroke-width="1.4"/><ellipse cx="0" cy="-4" rx="9" ry="3" fill="#f4ecd6" stroke-width="1.3"/><path d="M-9,1 L-4,6 L1,1 L6,6" fill="none" stroke="#e0b44a" stroke-width="1.2"/></g><path d="M12,-20 L18,-30" fill="none" stroke="#7a5235" stroke-width="2.4"/>`;
const flute=`<path d="M6,-31 L28,-27" fill="none" stroke="${OL}" stroke-width="4"/><path d="M6,-31 L28,-27" fill="none" stroke="#c9ced6" stroke-width="2.2"/>`;
const tray=`<g transform="translate(16,-40)"><ellipse cx="0" cy="0" rx="16" ry="4" fill="#b9c0c8" stroke-width="1.5"/>${[-8,0,8].map(x=>`<path d="M${x-3},-1 L${x-3.6},-9 H${x+3.6} L${x+3},-1Z" fill="#9aa2ad" stroke-width="1.1"/>`).join('')}</g>`;
const spoonPea=`<path d="M12,-18 L22,-28" fill="none" stroke="#9aa2ad" stroke-width="2.2"/><ellipse cx="23" cy="-29" rx="3" ry="1.8" fill="#9aa2ad" stroke-width="1"/><path d="M24,-32 Q34,-52 46,-40" fill="none" stroke="#7aa856" stroke-width="1.2" stroke-dasharray="2 3"/><circle cx="46" cy="-40" r="2.4" fill="#7aa856" stroke-width="1"/>`;
const balls=`<g>${[[-24,-52,'#d8413a'],[0,-88,'#9fc84a'],[24,-58,'#e0b44a']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="4.8" fill="${c}" stroke-width="1.3"/><path d="M${x},${y-4.6} l1,-3" fill="none" stroke="#6a4228" stroke-width="1.2"/>`).join('')}<path d="M-22,-60 Q-16,-82 -6,-88 M6,-88 Q16,-82 22,-66" fill="none" stroke="#9a8a6a" stroke-width="1.2" stroke-dasharray="2 3"/></g>`;
const teapot=`<g transform="translate(26,-62) rotate(-28)"><path d="M-10,6 Q-12,-8 0,-9 Q12,-8 10,6Z" fill="#fbf8f0"/><path d="M-10,0 Q-18,-2 -20,-8" fill="none" stroke="${OL}" stroke-width="4"/><path d="M-10,0 Q-18,-2 -20,-8" fill="none" stroke="#fbf8f0" stroke-width="2.4"/><path d="M10,-2 q7,0 6,6" fill="none" stroke-width="2.2"/><circle cx="0" cy="-10" r="2.4" fill="#4f86c4" stroke-width="1"/><path d="M-6,-2 h12" fill="none" stroke="#4f86c4" stroke-width="1.6"/></g>`;
const pieStand=`<g transform="translate(0,-30)"><path d="M-3,30 V0 M-12,30 H6" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M-3,30 V0" fill="none" stroke="#7a5235" stroke-width="2.6"/><ellipse cx="-3" cy="0" rx="16" ry="4" fill="#e8ecef"/><path d="M-12,-2 L4,-2 L-4,-9Z" fill="#d9963a" stroke-width="1.3"/><path d="M-11,-4 L3,-4" fill="none" stroke="#9a4a6a" stroke-width="1.6"/></g>`;
const chessT=`<g><path d="M-3,0 V-24 M-12,0 H6" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M-3,0 V-24" fill="none" stroke="#7a5235" stroke-width="2.6"/><path d="M-22,-26 H16 L20,-30 H-18Z" fill="#a8703f"/>`+
 `<path d="M-14,-29 h6 l1,-3 h-6Z M-2,-29 h6 l1,-3 h-6Z M-8,-31 h6 l1,-3 h-6Z M4,-31 h6 l1,-3 h-6Z" fill="#3a2e2a" stroke="none"/><path d="M-10,-30 v-6 M6,-30 v-6" fill="none" stroke="#fbf6ea" stroke-width="2.4"/><path d="M-4,-31 v-5 M10,-31 v-5" fill="none" stroke="#3a2e2a" stroke-width="2.4"/></g>`;
const cloakHand=`<path d="M14,-20 Q22,-22 24,-8 L16,-6Z" fill="#2f4f8a" stroke-width="1.3"/>`;
const towel=`<path d="M-12,-17 Q-16,-12 -14,-4 L-9,-6 L-9,-15Z" fill="#fbf9f2" stroke-width="1.1"/>`;
const cravat=`<path d="M-3,-17 L0,-12 L3,-17Z" fill="#fbf9f2" stroke-width="1"/>`;
const butlerO=o=>Object.assign({hat:-1,hs:0,hair:'#c9c4bc',skin:'#f0cfae',shirt:'#2f2f3a',top:'long',bottom:'pants',pants:'#2f2f3a',mood:1,extra:cravat+towel},o);
function structures(){
 /* 北邊：牆上小火炬、王座、主桌、主桌後面的貴族和冠軍騎士、守護騎士 */
 TORCH.forEach(([x,y])=>add(x,y,40,170,'torch18',torch(),{mark:false}));
 grp(KING.x,KING.y,56,124,'king18',king(),'');
 grp(QUEEN.x,QUEEN.y,56,124,'queen18',queen(),'王后：今晚的蛋糕塔是主廚特別做的，最上面還要放一顆大草莓呢！');
 [[990,'#3f6a4a'],[1050,'#c99a3a'],[1370,'#7a3a5a'],[1430,'#1f5f6a'],[1490,'#a8502e']].forEach(([x,c],i)=>add(x,KING.y-4,34,64,'noble18',chairOn(T(0,-6,1,kid({view:'front',pose:'sit',arm:i%2,mood:1,shirt:c,hat:i===2?HAT_TIARA:i===4?HAT_BERET:-1,hs:i===2?2:undefined,extra:goldCup}))),{mark:false}));
 grp(1130,KING.y-4,40,70,'champ18',chairOn(T(0,-6,1,champ())),'冠軍騎士：謝謝大家！這次比武大會能贏，要謝謝我的老馬，牠才是真正的冠軍！',{mark:false});
 add(1250,750,610,60,'head18',headTable(),{sh:1});
 /* 主桌兩側的守護騎士、旁邊的護衛長 */
 grp(912,786,60,110,'knight18',T(0,0,1.45,knight(false)),'守護騎士：（站得筆直，一動也不動）');
 grp(1588,786,60,110,'knight18',T(0,0,1.45,knight(false),true),'守護騎士：（頭盔裡傳出小小的肚子咕嚕聲⋯）');
 grp(1680,820,64,120,'captain18',T(0,0,1.5,knight(true),true),'護衛長：國王的安全交給我們！今晚誰也別想靠近蛋糕塔⋯咦，有老鼠？');
 mk(DAIS.x0,WY-40,DAIS.x1,DAIS.y1+50);
 /* 3 張長桌：桌上一段段擺設＋兩側長椅坐滿賓客 */
 TX.forEach(tx=>{for(let k=0;k<8;k++){const y=TY0+(k+1)*72.5;add(tx,y-4,96,30,'tbl18',tblSeg(k),{mark:false})}
  for(let k=0;k<11;k++){const y=TY0+(k+1)*52.7+4;
   for(const sg of [-1,1]){if(r()<.08)continue;const sit=r()<.3?(sg<0?'bq':'fq'):'side',fl=sg>0;
    add(tx+sg*74,y-10,30,62,'guest18',act(0,0,fl?-1:1,{view:sit,pose:'sit',mood:pk([0,1,1,3]),extra:r()<.4?`<g transform="translate(12,-18)"><rect x="-3" y="-7" width="6.4" height="8" rx="1.2" fill="#9aa2ad" stroke-width="1.2"/></g>`:''},pk(['nod','lean',false,'nod'])),{mark:false})}}
  mk(tx-90,TY0-14,tx+90,TY1+32)});
 /* 浮空蠟燭：飄在長桌和走道上空（畫在最上層） */
 let ci=0;for(let row=0;row<5;row++)for(const x of [930,1090,1250,1410,1570]){if(r()<.08)continue;const sp=add(x+sr(-20,20),800+row*140+sr(-20,20),80,40,'candles18',candleGrp(),{mark:false});sp.y=1e6+(ci++)}
 /* 西邊：樂師台、舞池 */
 grp(726,1000,200,100,'band18',act(-62,-6,1,{view:'side',pose:'sit',hat:HAT_BERET,shirt:'#6a3f8a',extra:harp},'groove')+T(-60,0,1,stool())+
  act(6,0,1,{view:'front',arm:1,hat:-1,shirt:'#8e2630',extra:tabor},'nod')+act(60,0,-1,{view:'side',pose:'hold',hat:HAT_BERET,shirt:'#3f6a4a',extra:flute},'groove')+noteM(-22,-84)+noteM(30,-92)+noteM(80,-70),
  '樂師：下一首是輕快的舞曲，大家一起來跳舞吧！');
 grp(726,1250,170,80,'dance18',act(-50,0,1,{view:'side',pose:'reach',mood:1},'dance')+act(-18,0,-1,{view:'side',pose:'reach',mood:1,shirt:'#b8667a',extra:gown('#b8667a')},'dance')+
  act(22,0,1,{view:'fq',pose:'reach',mood:1},'dance')+act(54,0,-1,{view:'side',pose:'reach',mood:3,shirt:'#2f4f8a',extra:gown('#2f4f8a')},'dance'),'跳舞的人：一二三、一二三⋯哎喲，你踩到我的腳了！');
 /* 走道：吟遊詩人、雜耍、抬烤全豬的僕人、端飲料的僕人 */
 grp(STEPX[0],905,40,80,'bard18',act(0,0,1,{view:'fq',pose:'hold',hat:HAT_BERET,shirt:'#7a3a5a',mood:1,extra:lyre},'groove')+noteM(18,-82)+noteM(30,-70),'吟遊詩人：♪ 長槍一揮～馬兒飛奔～冠軍騎士凱旋歸～');
 grp(STEPX[1],910,100,100,'juggle18',act(0,0,1,{view:'front',arm:2,hat:HAT_BERET,shirt:'#c4473a',pants:'#e0b44a',mood:1},'hop')+balls,'雜耍藝人：蘋果、梨子、再加一顆⋯哎呀，被狗狗叼走了！');
 grp(STEPX[0],1260,110,70,'pig18',act(-34,0,1,{...servant(),view:'side',pose:'hold',mood:2},'step')+act(34,0,1,{...servant(),view:'side',pose:'hold',mood:1},'step')+
  `<g transform="translate(0,-30)"><ellipse cx="0" cy="0" rx="42" ry="7" fill="#e0b44a" stroke-width="1.8"/>${T(-2,-2,.9,pigRoast())}</g>`,'僕人：讓一讓、讓一讓！烤全豬來囉！');
 grp(STEPX[1],1190,40,80,'tray18',act(0,0,1,{...servant(),view:'fq',pose:'up',mood:1,extra:tray},'step'),'僕人：蘋果汁、葡萄汁⋯還有誰要續杯？');
 /* 長桌南端：搶最後一塊派的貴族、偷彈豌豆的小朋友 */
 grp(STEPX[1],1515,100,70,'pie18',act(-30,0,1,{view:'side',pose:'reach',mood:3,hat:HAT_BERET},'work')+T(0,0,1,pieStand)+act(30,0,-1,{view:'side',pose:'reach',mood:3,shirt:'#6a3f8a',extra:gown('#6a3f8a')},'work'),'貴族：最後一塊派是我的！——明明是我先看到的！');
 grp(TX[1],1522,90,70,'peas18',T(-18,0,.85,kid({view:'side',pose:'reach',hat:-1,mood:1,extra:spoonPea}))+T(26,0,.8,kid({view:'fq',pose:'crouch',hat:-1,mood:2})),'小朋友：（偷偷用湯匙彈豌豆）噓——不要告訴我媽媽！');
 /* 東邊：點心桌、蛋糕塔（小故事）、酒桶架、獵犬 */
 [960,1130,1300].forEach(y=>{add(1772,y,212,96,'sweet18',sweetTable(),{sh:.9});mk(1655,y-180,1892,y+6)});  /* 桌子後面那一帶不站人（不然對話框會被桌子擋住） */
 const ck=add(1814,1600,150,100,'cask18',caskRack(),{sh:.85});ck.say='酒窖管理員：這桶是國王最愛的葡萄汁，倒慢一點才不會灑出來。';
 grp(1690,1610,70,44,'hound18',hound()+T(30,2,.9,hound('#b8906a'),true),'（獵犬盯著桌上的烤肉，口水快要流下來了）');
 /* 後廚 */
 grp(760,1652,220,160,'spit18',spit(),'廚師：烤全豬要轉得均勻，外皮才會又香又脆！',{sh:.9});
 grp(958,1640,130,130,'oven18',oven(),'麵包師：一打開窯門，熱氣就撲到臉上⋯我的眉毛還在吧？',{sh:.9});
 grp(760,1880,110,80,'soup18',cauldron(),'廚師：（試喝一口）好燙好燙！不過味道剛剛好！',{sh:.85});
 add(1010,1820,170,60,'ktable18',kTable(false),{sh:.85});
 add(960,2040,170,60,'ptable18',kTable(true),{sh:.85});
 grp(690,2060,90,70,'wash18',washTub(),'洗碗小弟：盤子越疊越高⋯誰來幫我扶一下！',{sh:.85});
 grp(700,1770,40,70,'kboy18',act(0,0,1,{...servant({hat:-1,hs:1}),view:'side',pose:'hold',mood:2,skin:'#d9a578',extra:`<g transform="translate(14,-24) scale(.6)">${firewood()}</g>`},'step'),'雜工小弟：柴火來囉！烤全豬的火可不能熄！');
 grp(1046,1792,40,70,'chop18',act(0,0,1,{...cook({}),view:'fq',pose:'hold',mood:1,skin:'#f0cfae',extra:`<path d="M12,-18 L20,-26" fill="none" stroke="#9aa2ad" stroke-width="3"/>`},'work'),'廚師：咚咚咚咚！紅蘿蔔要切得一樣大，國王才會滿意。');
 grp(1150,1980,40,70,'maid18',act(0,0,-1,{...servant(),view:'side',pose:'hold',mood:1,extra:`<g transform="translate(14,-20)"><ellipse rx="12" ry="3.4" fill="#e8ecef" stroke-width="1.3"/>${T(0,-2,.5,CENTER[1]())}</g>`},'step'),'女僕：水果塔要端去點心桌，小心小心⋯');
 /* 2026-11-20 使用者：後廚的人再多一倍 */
 grp(830,1990,50,60,'peel18',T(-14,0,1,stool())+act(-14,-8,1,{...cook({hat:HAT_CAP}),view:'fq',pose:'sit',mood:1,skin:'#f0cfae',extra:`<path d="M10,-14 l6,-4" fill="none" stroke="#9aa2ad" stroke-width="2"/>`},'nod')+T(16,0,.9,vbasket()),'幫廚：削了一百顆馬鈴薯⋯手好痠，但是今晚的燉湯要用！');
 grp(920,2008,40,70,'pipe18',act(0,0,1,{...cook({}),view:'fq',pose:'hold',mood:1,skin:'#c98d5e',extra:`<path d="M10,-18 L18,-10 L14,-6 Z" fill="#fbf8f0" stroke-width="1.2"/>`},'work'),'甜點助手：奶油擠成小花⋯一朵、兩朵、三朵！');
 grp(1150,1700,40,70,'bread18',act(0,0,-1,{...servant({hat:-1,hs:3}),view:'side',pose:'hold',mood:1,skin:'#e8c4a0',extra:`<g transform="translate(14,-22)">${T(0,0,.8,vbasket())}<ellipse cx="0" cy="-12" rx="8" ry="4" fill="#d9963a" stroke-width="1.1"/></g>`},'step'),'學徒：剛出爐的麵包，要送到長桌上！');
 grp(1000,1930,90,70,'glass18',act(-24,0,1,{...servant(),view:'side',pose:'hold',mood:1},'step')+act(24,0,1,{...servant({hat:-1,hs:1}),view:'side',pose:'hold',mood:2},'step')+
  `<g transform="translate(0,-30)"><rect x="-30" y="-3" width="60" height="6" rx="2" fill="#a8703f"/>${[-20,-8,4,16].map(x=>`<path d="M${x-3},-3 L${x-3.4},-12 H${x+3.4} L${x+3},-3Z" fill="#e8f4f6" stroke-width="1"/>`).join('')}</g>`,'僕人：玻璃杯要擦得亮晶晶，國王會看喔！');
 grp(972,1712,40,70,'stir18',act(0,0,1,{...cook({}),view:'side',pose:'reach',mood:1,skin:'#d9a578'},'work'),'廚師：大鍋湯要一直攪，不然鍋底會燒焦！');
 grp(1080,1580+150,40,70,'taste18',act(0,0,-1,{...cook({hat:HAT_CHEF}),view:'fq',pose:'hold',mood:3,skin:'#f0cfae',extra:`<ellipse cx="14" cy="-24" rx="3" ry="2" fill="#9aa2ad" stroke-width="1"/>`},'nod'),'廚師：嗯⋯醬汁再加一點點胡椒就完美了。');
 grp(660,1880,40,70,'wood18',act(0,0,1,{...servant({hat:-1,hs:0}),view:'fq',pose:'up2',mood:2,skin:'#c98d5e',extra:`<g transform="translate(0,-58) scale(.6)">${firewood()}</g>`},'step'),'雜工：柴火疊太高了⋯看不到前面啦！');
 grp(870,1860,40,70,'mop18',act(0,0,-1,{...servant(),view:'side',pose:'reach',mood:1,extra:`<path d="M14,-18 L22,2" fill="none" stroke="#a8703f" stroke-width="2.4"/><path d="M16,2 H28" fill="none" stroke="#d9d2c0" stroke-width="4"/>`},'work'),'女僕：地板濕滑，大家小心腳下！');
 grp(1150,1820,40,70,'pot18',act(0,0,-1,{...servant({hat:-1,hs:2}),view:'side',pose:'hold',mood:2,extra:`<g transform="translate(16,-22)"><path d="M-8,-6 H8 L6,6 H-6Z" fill="#c4703a" stroke-width="1.3"/><path d="M-10,-6 H10" fill="none" stroke-width="2"/></g>`},'step'),'女僕：銅鍋好重⋯讓一讓！');
 grp(1100,1640,40,70,'maid18',act(0,0,1,{...servant(),view:'side',pose:'hold',mood:1,extra:`<g transform="translate(14,-20)"><ellipse rx="12" ry="3.4" fill="#e8ecef" stroke-width="1.3"/>${T(0,-2,.5,CENTER[1]())}</g>`},'step'),'女僕：熱騰騰的派出爐了，我先端去給國王！');
 /* 東南玄關：管家迎賓、斗篷架、盔甲、下棋的貴族、喝茶的老奶奶（茶壺自己飄過來倒茶） */
 grp(1560,2070,120,80,'butler18',act(-30,0,1,{...butlerO({}),view:'side',pose:'reach'},'nod')+act(18,0,-1,{view:'side',pose:'reach',mood:1,extra:cloakHand})+act(48,4,-1,{view:'fq',pose:'stand',mood:1},'lean'),'管家：歡迎光臨！請把斗篷交給我，宴會就在前面。');
 add(1850,1660,50,110,'cloak18',cloakRack(),{sh:.8});
 [[1858,1900],[1858,2100]].forEach(([x,y],i)=>add(x,y,50,150,'armor18',armorStand(),{sh:.8,fl:true,say:i?'衛兵：大門這邊由我們守著，請安心享用晚宴。':'衛兵：（偷偷看了一眼點心桌⋯不行不行，站好！）'}));
 grp(1700,1800,110,70,'chess18',act(-36,0,1,{view:'side',pose:'sit',mood:1,hat:HAT_BERET},'nod')+T(-36,0,1,stool())+T(4,0,1,chessT)+act(42,0,-1,{view:'side',pose:'sit',mood:2,shirt:'#4a3a6a'},'nod')+T(42,0,1,stool()),'下棋的貴族：將軍！⋯咦，我的城堡棋子跑去哪了？');
 grp(1350,1720,110,80,'tea18',`<rect x="-46" y="-16" width="70" height="8" rx="2" fill="#a8703f"/><path d="M-40,-8 V0 M18,-8 V0" fill="none" stroke="#7a5235" stroke-width="3.4"/>`+act(-12,-10,1,{view:'fq',pose:'sit',hat:-1,hs:3,hair:'#e8e4dc',mood:1,shirt:'#7a3a5a',
  extra:`<g transform="translate(14,-18)"><path d="M-4,0 L-3,-6 H3 L4,0Z" fill="#fbf8f0" stroke-width="1.2"/></g>`},'nod')+an('float','3',teapot+`<path d="M8,-58 Q10,-40 12,-28" fill="none" stroke="#c98a4a" stroke-width="1.8"/>`),'老奶奶：哎呀，茶壺自己飄過來倒茶，這城堡真是太貼心了。');
 add(1268,1640,36,62,'plant18',plant(),{sh:.7});add(1268,2110,36,62,'plant18',plant(),{sh:.7});
 /* 不能放東西的地方：北牆、隔牆、矮牆、樂師台、故事角色的固定位置 */
 mk(600,0,1900,WY+20);mk(600,PART-110,PX+30,PART+12);mk(PX-8,PART,PX+30,SIDE[0]);mk(PX-8,SIDE[1],PX+30,2160);mk(620,880,830,1060);
 Object.values(SPOT).forEach(([x,y])=>mk(x-30,y-70,x+30,y+6));
 HEARTHSP=sprites().filter(s=>s.kind==='torch18');
}
let HEARTHSP=[];const sprites=()=>H.sprites||[];
function scatterAll(){
 /* 故事角色搬到固定的地方 */
 const S=H.dbg.storySp();if(S){moveSp(S.giver,SPOT.giver);moveSp(S.target,SPOT.target);moveSp(S.helper,SPOT.helper)}
 scatter('hallW18',POOL.hall18,1400,10);scatter('hallC18',POOL.hall18,1400,10);scatter('hallE18',POOL.hall18,1400,10);
 scatter('music18',POOL.music18,1600,12);scatter('sweets18',POOL.sweets18,1600,14);scatter('kitchen18',POOL.kitchen18,3200,34);scatter('foyer18',POOL.foyer18,2400,18);
}
const CELL=H.CELL,occ=H.occ,GC=H.GC,GR=H.GR;
function clearCells(x,y,w,h){const a=Math.floor((x-w*.3)/CELL),c=Math.floor((x+w*.3)/CELL),b=Math.floor((y-h*.5)/CELL),d=Math.floor(y/CELL);for(let j=Math.max(0,b);j<=Math.min(GR-1,d);j++)for(let i=Math.max(0,a);i<=Math.min(GC-1,c);i++)occ[j*GC+i]=0}
function moveSp(sp,p){if(!sp||!p)return;clearCells(sp.x,sp.y,sp.w,sp.h);const[x,y]=p;sp.svg=sp.svg.replace(/translate\([^)]*\)/,`translate(${f(x)},${f(y)})`).replace(/data-x="[^"]*" data-y="[^"]*"/,`data-x="${f(x)}" data-y="${f(y)}"`);sp.x=x;sp.y=y}
SCENE_IMPL[N]={ground,structures,scatter:scatterAll};
/* 人要多：玄關最熱鬧，走道和兩側也有人走動 */
Object.assign(VPLAN,{hallW18:{walker:3,chat:2},hallC18:{walker:5,chat:1},hallE18:{walker:3,chat:2},music18:{chat:3,walker:2},sweets18:{chat:4,walker:3},
 kitchen18:{carryBox:3},foyer18:{chat:12,walker:12,handInHand:3,reading:1}});  /* 2026-11-20 使用者：路上、廚房的人多 1.5 倍 */
HOSTK.add('sweet18');HOSTK.add('cask18');HOSTK.add('oven18');HOSTK.add('cloak18');HOSTK.add('armor18');HOSTK.add('ktable18');HOSTK.add('ptable18');
Object.assign(HOSTN,{sweet18:'點心桌',cask18:'酒桶架',oven18:'麵包窯',cloak18:'斗篷架',armor18:'盔甲',ktable18:'廚房工作桌',ptable18:'甜點工作桌'});
/* 物件的合理位置：每種最多一個桌子選項，其他放在人群、壁爐、架子旁邊；BLEND 是顏色相近的東西 */
const onHead=()=>[Math.random()*480-240,-46];
H.SPOTS[N]={
 goblet17:[['head18',onHead],['cask18',.05,.6],['champ18',.03,.7]],
 lute17:[['band18',.03,.6],['knight18',.03,.6],['stool18',.6,.1]],
 drum18:[['tbl18',.6,.3],['spit18',.04,.55],['hound18',.05,.6]],
 cdl18:[['head18',onHead],['captain18',.03,.6],['armor18',.03,.7]],
 honey18:[['ktable18',.75,.35],['sack18',.05,.6],['oven18',.04,.6]],
 cheese18:[['ktable18',.75,.35],['cask18',.05,.6],['basket18',.05,.7]],
 jelly18:[['sweet18',()=>[Math.random()*170-85,-30-Math.random()*50]],['tray18',.03,.7],['queen18',.03,.7]],
 bell18:[['head18',onHead],['butler18',.03,.6],['cloak18',.05,.7]],
 pep18:[['tbl18',.6,.3],['soup18',.04,.6],['jug18',.05,.8]],
 cloche18:[['tbl18',.6,.3],['wash18',.04,.6],['pig18',.03,.6]],
 invit18:[['cloak18',.05,.7],['butler18',.03,.6],['chess18',.03,.6]],
 wreath18:[['ptable18',.75,.35],['oven18',.04,.6],['maid18',.03,.7]]};
H.BLEND[N]={goblet17:['hglass17','jar18'],lute17:['gourd17','stool18'],drum18:['yam18','firewood18'],cdl18:['fork18','jug18'],honey18:['jar18','basket18'],cheese18:['cush18','sack18'],
 jelly18:['shade18','basket18'],bell18:['funnel18','jar18'],pep18:['rook18','jug18'],cloche18:['bowl18','napkin18'],invit18:['napkin18','sack18'],wreath18:['straw18','basket18']};

/* ================= 7. 連環小故事：蛋糕塔上的小廚師 ================= */
/* 小白鼠（原創造型）：白色、粉紅耳朵、小紅領巾、高高的廚師帽，抱著一顆草莓 */
const chefMouse=()=>`<path d="M-6,-2 Q-18,0 -20,-10 Q-21,-16 -16,-18" fill="none" stroke="${OL}" stroke-width="3.6" stroke-linecap="round"/><path d="M-6,-2 Q-18,0 -20,-10 Q-21,-16 -16,-18" fill="none" stroke="#f2b8b8" stroke-width="1.8" stroke-linecap="round"/>`+
 `<path d="M-9,0 Q-12,-14 -4,-19 Q6,-21 9,-12 Q11,-3 6,0Z" fill="#fbfaf6"/><path d="M-6,-17 Q1,-13 8,-16 L4,-10.6 L1,-14 L-2,-10.6Z" fill="#d8413a" stroke-width="1.3"/>`+
 `<circle cx="-6.4" cy="-31" r="4.6" fill="#fbfaf6"/><circle cx="-6.4" cy="-31" r="2.4" fill="#f4a8b4" stroke="none"/><circle cx="8.6" cy="-31" r="4.6" fill="#fbfaf6"/><circle cx="8.6" cy="-31" r="2.4" fill="#f4a8b4" stroke="none"/>`+
 `<circle cx="1" cy="-25" r="8" fill="#fbfaf6"/><path d="M7,-26 Q14,-24 9,-20 Q6,-20 6,-23Z" fill="#fbfaf6" stroke-width="1.4"/><circle cx="12.6" cy="-23.4" r="1.6" fill="#f08a9a" stroke="none"/>`+
 `<circle cx="1.6" cy="-26.4" r="1.4" fill="${OL}" stroke="none"/><circle cx="6" cy="-26.8" r="1.2" fill="${OL}" stroke="none"/><path d="M9,-22 l7,-1 M9,-21 l6,2" fill="none" stroke="#9a8a7a" stroke-width=".8"/><path d="M-2,-21 q1,1 2,0" fill="none" stroke="#f08a9a" stroke-width="1"/>`+
 `<path d="M-6,-33 L-7,-41 Q-12,-45 -7,-49 Q-5,-56 1,-53 Q7,-56 9,-49 Q14,-45 8,-41 L7,-33Z" fill="#fff"/><path d="M-6,-36 H7" fill="none" stroke="#d9d2c0" stroke-width="1.4"/>`+
 `<path d="M7,-12 Q14,-15 14,-7 Q12,-2 9,-4 Q5,-6 7,-12Z" fill="#e2384a" stroke-width="1.4"/><path d="M8,-13 l2,-3 l1,3 l3,-1" fill="#5fa04a" stroke-width="1"/><circle cx="10" cy="-8" r=".6" fill="#fbe08a" stroke="none"/><circle cx="12" cy="-10" r=".6" fill="#fbe08a" stroke="none"/>`+
 `<circle cx="5" cy="-9" r="2.4" fill="#fbfaf6" stroke-width="1.2"/><circle cx="12.6" cy="-5" r="2.4" fill="#fbfaf6" stroke-width="1.2"/>`;
/* 蛋糕塔（放在木頭推車上），小白鼠坐在最上面 */
const cakeTower=()=>{let s=sh(32,6)+`<path d="M-24,-6 V-28 M24,-6 V-28 M-24,-14 H24" fill="none" stroke="${OL}" stroke-width="5"/><path d="M-24,-6 V-28 M24,-6 V-28 M-24,-14 H24" fill="none" stroke="#8a5a30" stroke-width="3"/><circle cx="-20" cy="-4" r="5" fill="#5a3a20" stroke-width="1.4"/><circle cx="20" cy="-4" r="5" fill="#5a3a20" stroke-width="1.4"/>`;
 s+=`<rect x="-28" y="-34" width="56" height="8" rx="2" fill="#a8703f"/><path d="M-14,-34 L-6,-40 H6 L14,-34Z" fill="#c9ced6"/>`;
 for(const [w,y0,h] of [[22,-60,20],[16,-78,18],[10,-92,14]]){s+=`<rect x="${-w}" y="${y0}" width="${2*w}" height="${h}" rx="4" fill="#fbf3ea"/>`;
  let d='';for(let x=-w;x<w;x+=w/2)d+=`M${f(x)},${y0+5} Q${f(x+w/4)},${y0+11} ${f(x+w/2)},${y0+5} `;s+=`<path d="${d}" fill="none" stroke="#f0a0b4" stroke-width="2.2"/>`;
  for(let x=-w+5;x<w;x+=w/1.6)s+=`<path d="M${f(x)},${y0} q-3,-4 0,-6 q3,2 0,6Z" fill="#e2384a" stroke-width="1"/>`}
 return s+T(-1,-90,.66,chefMouse())};
const chefCoat=`<path d="M-1,-18 V-4" fill="none" stroke="#d9d2c0" stroke-width="1.2"/><circle cx="-3" cy="-14" r="1" fill="${OL}" stroke="none"/><circle cx="-3" cy="-9" r="1" fill="${OL}" stroke="none"/><path d="M-6,-18 Q0,-15 6,-18 L4,-14 L0,-16 L-4,-14Z" fill="#d8413a" stroke-width="1.1"/>`;
const spatula=`<path d="M12,-18 L30,-46" fill="none" stroke="${OL}" stroke-width="4"/><path d="M12,-18 L30,-46" fill="none" stroke="#a8703f" stroke-width="2.2"/><path d="M29,-45 L44,-66 Q47,-68 46,-64 L32,-42Z" fill="#c9ced6" stroke-width="1.4"/>`;
const pinkApron=`<path d="M-6,-14 Q0,-11 6,-14 L7,-3 Q0,0 -7,-3Z" fill="#f4b8c8" stroke-width="1.1"/>`;
STORIES[N]={title:'蛋糕塔上的小廚師',who:'主廚',
 giver:()=>act(0,0,1,{view:'fq',pose:'reach',hat:HAT_CHEFT,mood:2,beard:true,skin:'#e8c4a0',hair:'#6a4a30',hs:1,shirt:'#fbf9f2',top:'long',bottom:'pants',pants:'#4a4f5c',extra:chefCoat}),
 target:()=>cakeTower(),tw:60,th:128,
 helper:()=>act(0,0,1,{view:'fq',pose:'hold',hat:HAT_CHEF,mood:1,skin:'#f0cfae',hair:'#c9853a',hs:2,shirt:'#fbf9f2',top:'long',bottom:'pants',pants:'#6a5a48',extra:pinkApron+spatula}),hw:56,hh:80,
 ask:'主廚：我的小幫手不見了！牠戴著小廚師帽，說要親手幫國王的蛋糕放最後一顆草莓⋯',
 need:'小白鼠抱著草莓坐在蛋糕塔最上面，下不來了⋯聽說後廚的甜點師有一把長長的蛋糕鏟！',
 got:'甜點師：爬到蛋糕塔頂上啦？我把鏟子伸過去，讓牠溜下來！',
 ok:'小白鼠順著鏟子溜下來，廚師帽沾了一坨奶油！快帶回去給主廚！'};

/* ================= 8. 冒險地圖與過場 ================= */
/* 冒險地圖：不另外放節點（和城門廣場一樣隸屬奇幻小鎮）；levels.js 的 map 只給名稱、卡片用 */
HERE[N]=[100,170];
/* 過場：管家推開大門，長長的大廳往裡延伸，浮空蠟燭從近到遠一盞盞亮起；整座大廳慢慢靠近（往前走） */
RIDES.hall18={text:'管家推開大門，晚宴開始了⋯',every:520,tick:k=>tone(k%2?262:330,.08,'triangle',.03),
 svg:()=>{const VX=200,VY=236,HC=364;
  let s=`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="rw18" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2452"/><stop offset=".55" stop-color="#3d3a78"/><stop offset=".85" stop-color="#7a4f86"/><stop offset="1" stop-color="#e8925a"/></linearGradient></defs>`+
   `<style>.hz18{transform-origin:200px 250px;animation:hz18 4.3s ease-in forwards}@keyframes hz18{from{transform:scale(1)}to{transform:scale(1.5)}}`+
   `.dL18{transform-origin:0 0;animation:dL18 1.3s .15s ease-in-out forwards}.dR18{transform-origin:400px 0;animation:dL18 1.3s .15s ease-in-out forwards}@keyframes dL18{to{transform:scaleX(.06)}}`+
   `.cd18{opacity:0;animation:cd18 .5s ease-out forwards}@keyframes cd18{to{opacity:1}}.fk18{transform-box:fill-box;transform-origin:50% 100%;animation:fk18 .6s ease-in-out infinite alternate}@keyframes fk18{to{transform:scale(.85,1.2)}}`+
   `.wk18{animation:wk18 .45s ease-in-out infinite alternate}@keyframes wk18{to{transform:translateY(-3px)}}</style>`;
  s+=`<g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect width="400" height="600" fill="#2a1f1a" stroke="none"/>`;
  s+=`<g class="hz18">`;
  /* 側牆、後牆（兩扇高窗＋掛毯）、地板 */
  s+=`<path d="M0,0 L130,140 V${VY+20} L0,600Z" fill="#5a4638"/><path d="M400,0 L270,140 V${VY+20} L400,600Z" fill="#4e3c30"/>`;
  s+=`<rect x="130" y="140" width="140" height="${VY+20-140}" fill="#76604f"/>`;
  [152,248].forEach(x=>s+=`<path d="M${x-12},226 V170 Q${x},152 ${x+12},170 V226Z" fill="url(#rw18)" stroke-width="1.4"/><path d="M${x},158 V226" fill="none" stroke="#3a2e28" stroke-width="1.6"/>`);
  s+=`<circle cx="254" cy="176" r="4" fill="#fbf1c8" stroke="none"/>`;
  s+=`<path d="M184,150 H216 V214 L208,220 L200,214 L192,220 L184,214Z" fill="#8e2630" stroke-width="1.4"/><path d="M193,176 L192,168 L196,172 L200,164 L204,172 L208,168 L207,176Z" fill="#e8c04a" stroke-width="1"/>`;
  s+=`<path d="M130,${VY+20} H270 L400,600 H0Z" fill="#c4a67a"/>`;
  /* 地板石縫（橫線，越遠越密；整座大廳放大時會往下移，像往前走） */
  {let fl='';for(const z of [1.08,1.3,1.6,2,2.6,3.4,4.6,6.4,9]){const t=1/z,y=VY+20+(580-VY)*t,x=130*(1-t);fl+=`M${f(x)},${f(y)} H${f(400-x)} `}s+=`<path d="${fl}" fill="none" stroke="#ad8f66" stroke-width="1.4"/>`}
  /* 側牆上的柱子（越遠越小、越淡） */
  for(const z of [1.2,1.8,2.7,4,6]){const k=1/z;const xl=f(VX-200*k-62*(1-k)),xr=f(VX+200*k+62*(1-k)),top=f(140*(1-k)),bot=f(VY+20+(600-VY-20)*k);
   s+=`<rect x="${f(+xl-8*k)}" y="${top}" width="${f(16*k)}" height="${f(bot-top)}" fill="#3a2c24" stroke="none" opacity="${f(.4+.5*k)}"/><rect x="${f(+xr-8*k)}" y="${top}" width="${f(16*k)}" height="${f(bot-top)}" fill="#3a2c24" stroke="none" opacity="${f(.4+.5*k)}"/>`}
  /* 3 張長桌（往後縮）＋主桌 */
  s+=`<rect x="150" y="${VY+4}" width="100" height="14" fill="#efe3c6" stroke-width="1.4"/>`;
  for(const l of [-1,0,1]){const xf=VX+l*150,xb=VX+l*36;s+=`<path d="M${xb-9},${VY+26} H${xb+9} L${xf+44},600 H${xf-44}Z" fill="#f3ead6" stroke-width="1.6"/><path d="M${xb-2},${VY+26} H${xb+2} L${xf+8},600 H${xf-8}Z" fill="#c99e48" stroke="none"/>`;
   for(const z of [1.3,1.8,2.6,3.8,5.5]){const k=1/z,x=xb+(xf-xb)*k,y=VY+26+(600-VY-26)*k;for(const sg of [-1,1])s+=`<g transform="translate(${f(x+sg*60*k)},${f(y)}) scale(${f(1.05*k)})"><circle cx="0" cy="-36" r="13" fill="${pk(['#e8c4a0','#d9a578','#f0cfae'])}"/><path d="M-8,-5 Q-9,-17 0,-18 Q9,-17 8,-5Z" fill="${pk(RICH)}"/></g>`}}
  /* 浮空蠟燭：從近到遠一盞盞亮起 */
  let i=0;for(const z of [1.15,1.5,1.9,2.4,3,3.8,4.8,6]){const k=1/z;for(const l of [-1.6,-.8,0,.8,1.6]){const x=VX+l*150*k;
    const yy=VY-10+ (160)*k,sz=k;s+=`<g class="cd18" style="animation-delay:${f(.5+i*.035)}s"><g transform="translate(${f(x)},${f(yy)}) scale(${f(sz)})"><circle cx="0" cy="-24" r="14" fill="#ffd98a" opacity=".3" stroke="none"/><rect x="-3" y="-18" width="6" height="18" fill="#f8f1dc" stroke-width="1.3"/><path class="fk18" d="M0,-19 q-3.4,-4 0,-10 q3.4,6 0,10Z" fill="#f5b03a" stroke-width="1.1"/></g></g>`;i++}}
  s+=`</g>`;
  /* 大門：兩扇木門往兩邊推開 */
  const door=(cls,x0)=>`<g class="${cls}"><rect x="${x0}" y="0" width="200" height="600" fill="#7a4e32"/>${[40,80,120,160].map(d=>`<path d="M${x0+d},0 V600" fill="none" stroke="#5a3a22" stroke-width="2"/>`).join('')}<path d="M${x0},140 H${x0+200} M${x0},440 H${x0+200}" fill="none" stroke="#4a4f5c" stroke-width="10"/><circle cx="${x0===0?180:220}" cy="300" r="12" fill="none" stroke="#e0b44a" stroke-width="5"/></g>`;
  s+=door('dL18',0)+door('dR18',200);
  /* 前景：管家側身伸手「請進」，主角往裡走 */
  s+=`<g transform="translate(84,566) scale(1.25)">${kid({view:'side',pose:'reach',...butlerO({})})}</g>`;
  s+=`<g transform="translate(306,570) scale(-1.3,1.3)"><g class="wk18">${kid({view:'side',pose:'walk',hat:-1,hs:0,top:'tee',bottom:'pants'})}</g></g>`;
  return s+`</g></svg>`}};

/* ================= 9. 場景彩蛋：點國王 → 全場舉杯「乾杯！」；點牆上火炬 → 火焰變成彩色 ================= */
/* 2026-11-20 使用者：點樂師台可以真的聽到旋律 → 原創的中世紀風小舞曲（約 4 秒），用遊戲內建的音色；旁邊冒出音符 */
const TUNE=[[440,.2],[587,.2],[523,.2],[440,.2],[392,.2],[440,.4],[349,.2],[392,.2],[440,.2],[294,.2],[330,.2],[349,.4],[330,.2],[294,.6]];
let tuneT=0;
const playTune=()=>{const now=Date.now();if(now<tuneT)return;let t=0;for(const [q,d] of TUNE){tone(q,d*.9,'triangle',.05,t);t+=d}tuneT=now+t*1000;
 [0,.4,.8,1.2,1.6,2,2.4].forEach(t=>tone(147,.25,'sine',.025,t))};
H.TAPHOOKS[N]=(x,y)=>{
 if(Math.abs(x-726)<104&&y>880&&y<1018){playTune();H.toast('樂師：♪ 這首是我們自己寫的〈冠軍之舞〉！',2600);[0,500,1000,1500,2000].forEach((d,i)=>setTimeout(()=>H.burst(660+i*32,930-(i%2)*20),d));return true}
 if(Math.abs(x-KING.x)<26&&y>KING.y-128&&y<KING.y+4){
  H.toast('國王：為我們的冠軍騎士——乾杯！🥂\n全場：乾杯！',2600);
  const gs=sprites().filter(s=>s.kind==='guest18'||s.kind==='noble18'||s.kind==='champ18');
  for(let i=0;i<10&&gs.length;i++){const s=gs[Math.floor(Math.random()*gs.length)];setTimeout(()=>H.burst(s.x,s.y-46),i*90)}
  [523,659,784,1047].forEach((q,i)=>tone(q,.18,'triangle',.05,i*.09));return true}
 for(const sp of HEARTHSP){if(Math.abs(x-sp.x)<26&&y>sp.y-190&&y<sp.y-96){
  const el=document.querySelector(`#bg [data-n="${sp.n}"]`);if(el){const a=el.querySelectorAll('.fl18'),b=el.querySelectorAll('.fl18b'),C=[['#7ab8ff','#d8eaff'],['#b07aff','#f0d8ff'],['#6fd88a','#e0ffd8']],c=pk(C);
   a.forEach(e=>e.setAttribute('fill',c[0]));b.forEach(e=>e.setAttribute('fill',c[1]));clearTimeout(sp._t);sp._t=setTimeout(()=>{a.forEach(e=>e.setAttribute('fill','#f08a3a'));b.forEach(e=>e.setAttribute('fill','#f5d34a'))},3200)}
  H.burst(sp.x,sp.y-160);H.toast('🔥 呼——！火炬的火焰變成了彩色的！',1800);tone(392,.1,'sine',.05);tone(587,.14,'sine',.05,.1);return true}}
 return false};
})();


/* ================= 入口：第 18 關宮廷院，北邊主殿大門前的侍從 =================
   2026-11-21 使用者：城堡系列改成 17 城門廣場 → 18 宮廷院 → 20 奇幻晚宴（原本晚宴的入口是第 17 關的管家，現在管家帶去宮廷院）。
   levels.js 這一關有 find:{after:18,from:18,hint:[…]}：發現宮廷院、而且宮廷院拿到 2 顆星之後，主殿大門前的石階下出現拿燭台的侍從（頭上有「…」）；
   點侍從 → 「要進去參加晚宴嗎？」→ 出發才算發現。這個檔案在第 18 關載入時會一起載入（ensureFull）。
   侍從站在主殿石階正下方（宮廷院本來就把主殿一帶標成不能擺東西），所以宮廷院的其他東西位置不受影響。 */
(function(){
const H=window.TH;if(!H)return;const N=20;const {T,OL,act}=H;
const EX={x:1250,y:718};
(H.RESERVE[18]||(H.RESERVE[18]=[])).push([EX.x,EX.y+4,70,60]);
const livery=`<path d="M-5,-17 H5 L6,-4 H-6Z" fill="#e0b44a" stroke-width="1.1" opacity=".9"/><path d="M-2,-13 l2,-2 l2,2 l-2,2Z" fill="#3f6f9a" stroke="none"/>`;
const candle=`<g transform="translate(15,-22)"><path d="M0,0 V-10 M-7,-10 H7" fill="none" stroke="${OL}" stroke-width="3.4"/><path d="M0,0 V-10 M-7,-10 H7" fill="none" stroke="#e0b44a" stroke-width="1.8"/><ellipse cx="0" cy="1" rx="5" ry="1.8" fill="#e0b44a" stroke-width="1"/>`+
 [-7,0,7].map(x=>`<rect x="${x-1.6}" y="-20" width="3.2" height="9" fill="#f8f1dc" stroke-width="1"/><path d="M${x},-21 q-2,-3 0,-6 q2,3 0,6Z" fill="#f5b03a" stroke="none"/>`).join('')+`</g>`;
let ps=null;const page=()=>ps||(ps=act(0,0,1,{view:'fq',pose:'hold',hat:-1,hs:1,hair:'#6a4a30',skin:'#f0cfae',shirt:'#3f6f9a',top:'long',bottom:'pants',pants:'#2f3a4a',mood:1,extra:livery+candle}));
const svg=found=>T(0,0,.95,(found?'':`<g class="qbob">${H.bubble(14,-74,'dots').replace(/r="1\.7"/g,'r="1.75"')}</g>`)+page());
const pv=()=>`<svg viewBox="0 0 220 110" width="220" height="110" style="display:block"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect x="0" y="0" width="220" height="110" rx="10" fill="#3a2c25" stroke="none"/>`+
 `<rect x="10" y="8" width="200" height="56" fill="#76604f" stroke="none"/>${[40,90,130,180].map(x=>`<path d="M${x-10},56 V26 Q${x},14 ${x+10},26 V56Z" fill="#363a78" stroke-width="1.4"/>`).join('')}<circle cx="136" cy="28" r="4" fill="#fbf1c8" stroke="none"/>`+
 `<rect x="0" y="64" width="220" height="46" fill="#c4a67a" stroke="none"/>${[40,110,180].map(x=>`<rect x="${x-14}" y="66" width="28" height="40" fill="#f3ead6" stroke-width="1.4"/>`).join('')}`+
 [[30,60],[70,52],[110,58],[150,50],[190,60],[52,80],[130,78],[168,84]].map(([x,y])=>`<circle cx="${x}" cy="${y-6}" r="6" fill="#ffd98a" opacity=".35" stroke="none"/><rect x="${x-1.6}" y="${y-4}" width="3.2" height="8" fill="#f8f1dc" stroke-width="1"/><path d="M${x},${y-5} q-2,-3 0,-6 q2,3 0,6Z" fill="#f5b03a" stroke="none"/>`).join('')+
 `<g transform="translate(110,106) scale(.6)">${page()}</g></g></svg>`;
H.EXITS[N]={x:EX.x,y:EX.y,w:64,h:72,svg,ask:{pv,title:'要進去參加晚宴嗎？',
 text:'侍從：天快黑了，國王的慶功宴就要開始囉！<br>大餐廳的蠟燭都點亮了。要我帶你進去嗎？',again:'侍從：歡迎再度光臨！<br>宴會還熱鬧著呢。',
 go:'🕯️ 跟侍從去參加晚宴',wait:'之後再說',waitMsg:'侍從：好的，我會在大門口等您。'}};
})();
