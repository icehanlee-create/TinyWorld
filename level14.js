/* 奇幻小鎮大搜查．綠島（找路發現的新關卡，編號 14 只是程式用）
   入口：第 5 關海島港口「水上屋旁的小艇」，潛水教練頭上「…」——程式在這個檔案最後面（H.RESERVE[5]／H.EXITS[14]）。
   使用者 2026-11-17 定案：從第 5 關再延伸一個海島，綠島風味的奇幻小島（取特色元素，不照真實位置）。
   場景四個元素：北＝海崖小路＋白色燈塔；西＝草地＋梅花鹿＋像動物的大岩石（像狗、像睡美人）；東＝礁石間的海邊露天溫泉；
   南＝浮潛沙灘＋民宿小街（機車出租、飛魚乾攤只當佈景）＋小艇碼頭（開場位置）。
   使用者 2026-11-18 選：地圖位置 C（東邊更遠、略偏北，地圖往東加寬 east:true）、老朋友＝海星＋珍珠貝、
   穿著＝潛水觀光客多一點、人群小故事 6 組、BORROW 不借。
   小故事「躲在大岩石後面的小梅花鹿」。本檔案不依賴別關的程式碼（只在 POOL／VPLAN 用到第 5 關的 kind 名稱，且會先確認存在），
   物件 id 和 kind 都以 14 結尾。 */
(function(){
const H=window.TH;if(!H)return;
const N=14;
const {T,f,r,sr,pk,ri,OL,SKIN,kid,act,wrapAn,add,mark,canPlace,scatter,skyBirds,KIND,POOL,VPLAN,REG,SCREG,LEVELS,ART,DECOY,
 SCENE_IMPL,WATERFN,RIDES,HERE,OUTFITS,STORIES,HOSTK,HOSTN,tone,typeOf,HATS,peekHead}=H;

/* ================= 1. 場景範圍、天空（其實是北邊的海）、場地邊緣 ================= */
H.SCENES[N]={x0:250,x1:2250,y1:2150,c:[1250,1780]}; /* 2026-11-26e 難度調整：東西各加寬 350（約 6.99 畫面），島的輪廓也跟著長出去 */
H.TARGET[N]=330;
H.SKYC[N]='#6fbcc9';H.SKYY[N]=0;
H.EDGEM[N]='';H.EDGED[N]='';
H.EDGEDECO[N]=[['palm14',1]];
H.FRINGE[N]=[['hibiscus14',1.2],['rock14s',1]];
H.DENS[N]=1;   /* 2026-11-26e 加寬後 1.1→1，控制 sprite 數 */

/* ================= 2. 當地人：夏季海島，潛水觀光客多一點（約一半） ================= */
const MASKR=(y)=>`<path d="M-12,${y+2} Q-12,${y-1} -8,${y-1} H8 Q12,${y-1} 12,${y+2} V${y+7} Q12,${y+10} 8,${y+10} H3 Q0,${y+7} -3,${y+10} H-8 Q-12,${y+10} -12,${y+7}Z" fill="#e86a4a"/><path d="M-9.4,${y+2.4} Q-9.4,${y+1} -7,${y+1} H7 Q9.4,${y+1} 9.4,${y+2.4} V${y+6} Q9.4,${y+7.6} 7,${y+7.6} H3 Q0,${y+5.6} -3,${y+7.6} H-7 Q-9.4,${y+7.6} -9.4,${y+6}Z" fill="#bdeef6" stroke="none"/><path d="M-7,${y+3} l4,0" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
const maskHat=()=>`<path d="M-13.6,-38 Q0,-44 13.6,-38" fill="none" stroke="#2b3a55" stroke-width="3.4"/>`+MASKR(-49)+`<path d="M12.6,-44 V-62" fill="none" stroke="${OL}" stroke-width="4.6" stroke-linecap="round"/><path d="M12.6,-44 V-62" fill="none" stroke="#f2c230" stroke-width="2.4" stroke-linecap="round"/><rect x="10.6" y="-46" width="4" height="4" rx="1" fill="#2b3a55" stroke-width="1"/>`;
H.MASKHAT14=maskHat;
const HAT_M=HATS.push(maskHat)-1;
OUTFITS[N]=o=>{if(o.top)return o;const S=SKIN;
 o.skin=o.skin||pk([S[1],S[2],S[2],S[3],S[3],S[4]]);
 if(r()<.5){ /* 潛水觀光客：防曬衣＋短褲，面鏡推在額頭上 */
  o.top=pk(['tee','tee','tank']);o.bottom=pk(['shorts','shorts','trunks']);o.shirt=o.shirt||pk(['#2f7fa8','#e86a4a','#3fa89a','#f2c230','#7a5fb0','#2b3a55']);
  o.pants=o.pants||pk(['#2b3a55','#d8413a','#3f8f8a','#2f4f7a','#f2c230']);
  if(o.hat==null&&!o.plain)o.hat=r()<.6?HAT_M:-1;return o}
 o.top=pk(['tee','tee','tank']);o.bottom='shorts';
 if(o.top==='tee'&&r()<.35)o.aloha=pk(['#fbf6ea','#f5c842','#e86a9a','#6fb8c8']);
 o.pants=o.pants||pk(['#c9a46a','#5a86b0','#3f8f8a','#e8d6b0','#8a6a4a']);
 if(o.hat==null&&!o.plain)o.hat=r()<.35?1:-1;return o};

/* ================= 3. 物件與干擾物（12 種 × 4 個） ================= */
const WOOD='#a8703f',WOOD2='#c99a5b';
Object.assign(ART,{
 /* 浮潛面鏡：深藍框＋兩片水藍鏡片，旁邊接一根橘色呼吸管 */
 mask14:`<path d="M19,12 V-16 Q19,-21 14,-21" fill="none" stroke="${OL}" stroke-width="5.6" stroke-linecap="round"/><path d="M19,12 V-16 Q19,-21 14,-21" fill="none" stroke="#f2c230" stroke-width="3" stroke-linecap="round"/><path d="M19,12 Q19,16 14,16" fill="none" stroke="#2b3a55" stroke-width="3.6" stroke-linecap="round"/><rect x="15" y="-3" width="8" height="5" rx="1.6" fill="#2b3a55" stroke-width="1.2"/>`+
  `<g transform="translate(-4,0)"><path d="M-16,-2 Q-16,-12 -8,-12 H8 Q16,-12 16,-2 Q16,9 8,9 H4 Q0,4 -4,9 H-8 Q-16,9 -16,-2Z" fill="#e86a4a"/><path d="M-12.6,-2 Q-12.6,-8.6 -7.4,-8.6 H7.4 Q12.6,-8.6 12.6,-2 Q12.6,5.6 7.4,5.6 H4 Q0,1.6 -4,5.6 H-7.4 Q-12.6,5.6 -12.6,-2Z" fill="#bdeef6"/><path d="M-8,-5 L-2,-5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></g>`,
 /* 紅白浮球：浮潛引導繩上的浮球，頂端一個繩圈，旁邊拖一小段繩子 */
 buoy14:`<path d="M10,12 q10,6 19,0" fill="none" stroke="#d9c8a0" stroke-width="2.6" stroke-linecap="round"/><circle cx="0" cy="2" r="13.4" fill="#fbf6ea"/><path d="M-12.6,-1 Q0,-5 12.6,-1 L12.6,7 Q0,11 -12.6,7Z" fill="#d8413a" stroke="none"/><circle cx="0" cy="2" r="13.4" fill="none"/><path d="M-5,-11 Q-6,-24 0,-24 Q6,-24 5,-11" fill="none" stroke="#fff" stroke-width="5.2"/><path d="M-5,-11 Q-6,-24 0,-24 Q6,-24 5,-11" fill="none" stroke="${OL}" stroke-width="1.8"/><path d="M-9,-5 Q-7,-8 -4,-9" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,
 /* 梅花鹿玩偶：坐著的毛絨小鹿，背上白點，小鹿角 */
 deer14:`<ellipse cx="2" cy="6" rx="14" ry="10" fill="#d49a5e"/><path d="M-9,13 V17 M-3,15 V18 M7,15 V18 M13,12 V16" fill="none" stroke="#a8703f" stroke-width="3.4" stroke-linecap="round"/><circle cx="-3" cy="2" r="1.8" fill="#fbf6ea" stroke="none"/><circle cx="5" cy="-1" r="1.8" fill="#fbf6ea" stroke="none"/><circle cx="9" cy="6" r="1.8" fill="#fbf6ea" stroke="none"/><circle cx="0" cy="9" r="1.6" fill="#fbf6ea" stroke="none"/>`+
  `<path d="M-6,-6 Q-10,-8 -12,-14 M-2,-8 Q-2,-14 -5,-19 M6,-8 Q8,-14 12,-16 M3,-8 Q3,-14 6,-20" fill="none" stroke="#7a5230" stroke-width="2" stroke-linecap="round"/><ellipse cx="-2" cy="-3" rx="10" ry="9" fill="#e0a868"/><ellipse cx="-12" cy="-6" rx="3.4" ry="5.4" fill="#e0a868" transform="rotate(-30 -12 -6)"/><ellipse cx="9" cy="-6" rx="3.4" ry="5.4" fill="#e0a868" transform="rotate(30 9 -6)"/><circle cx="-5.4" cy="-4" r="1.6" fill="${OL}" stroke="none"/><circle cx="1.6" cy="-4" r="1.6" fill="${OL}" stroke="none"/><ellipse cx="-2" cy="1" rx="3.2" ry="2.4" fill="#fbe8cc" stroke="none"/><circle cx="-2" cy="0" r="1.2" fill="${OL}" stroke="none"/>`,
 /* 條紋浴巾捲：藍白條紋的浴巾捲起來 */
 towel14:`<rect x="-17" y="-11" width="34" height="22" rx="4" fill="#f6f1e4"/><path d="M-17,-5 H17 M-17,1 H17 M-17,7 H17" fill="none" stroke="#2f7fa8" stroke-width="3.6"/><rect x="-17" y="-11" width="34" height="22" rx="4" fill="none"/><ellipse cx="17" cy="0" rx="5" ry="11" fill="#eae3d0"/><ellipse cx="17" cy="0" rx="2.2" ry="5.4" fill="none" stroke-width="1.3"/><path d="M-6,-11 V11" fill="none" stroke="#c4473a" stroke-width="2"/>`,
 /* 海龜吊飾：綠色小海龜掛在鑰匙圈上 */
 turtle14:`<circle cx="0" cy="-17" r="5.6" fill="none" stroke="${OL}" stroke-width="3.6"/><circle cx="0" cy="-17" r="5.6" fill="none" stroke="#c9ccd0" stroke-width="1.8"/><path d="M0,-11.6 V-7" fill="none" stroke-width="1.6"/>`+
  `<path d="M-10,-4 L-19,-8 L-16,-1Z M10,-4 L19,-8 L16,-1Z M-9,8 L-17,13 L-12,5Z M9,8 L17,13 L12,5Z" fill="#7ac08a"/><ellipse cx="0" cy="2" rx="12" ry="11" fill="#4f9a5f"/><path d="M-5,-5 H5 L8,2 L5,9 H-5 L-8,2Z" fill="none" stroke="#2f6f43" stroke-width="1.3"/><path d="M-8,2 L-12,2 M8,2 L12,2 M-5,-5 L-7,-8 M5,-5 L7,-8 M-5,9 L-7,12 M5,9 L7,12" fill="none" stroke="#2f6f43" stroke-width="1.2"/><circle cx="0" cy="-10" r="4.6" fill="#7ac08a"/><circle cx="-1.8" cy="-11" r=".9" fill="${OL}" stroke="none"/><circle cx="1.8" cy="-11" r=".9" fill="${OL}" stroke="none"/>`,
 /* 大香菇珊瑚模型：粉紫色圓圓的菇狀珊瑚，放在小石座上 */
 coral14:`<path d="M-10,12 Q-8,4 -3,2 H3 Q8,4 10,12Z" fill="#b8a898"/><path d="M-4,2 Q-5,-2 -3,-4 H3 Q5,-2 4,2Z" fill="#d9b6cf"/><path d="M-19,-4 Q-20,-20 0,-22 Q20,-20 19,-4 Q10,1 0,1 Q-10,1 -19,-4Z" fill="#d98ab6"/><path d="M0,-22 V0 M-8,-20 L-12,-1 M8,-20 L12,-1 M-14,-17 L-17,-5 M14,-17 L17,-5" fill="none" stroke="#a8527f" stroke-width="1.3"/><path d="M-14,-14 Q-8,-19 -2,-19" fill="none" stroke="#f6c6dc" stroke-width="2.2" stroke-linecap="round"/>`,
 /* 貝殼風鈴：木條上垂下四串小貝殼 */
 chime14:`<rect x="-16" y="-20" width="32" height="5" rx="2.4" fill="${WOOD2}"/><path d="M0,-20 V-25" fill="none" stroke-width="1.8"/><path d="M-12,-15 V-3 M-4,-15 V4 M5,-15 V-1 M13,-15 V7" fill="none" stroke="#d9c8a0" stroke-width="1.4"/>`+
  [[-12,-3,'#f2c6cf'],[-4,4,'#fbf6ea'],[5,-1,'#f6d9a8'],[13,7,'#f2c6cf']].map(([x,y,c])=>`<path d="M${x-5},${y+5} Q${x-6},${y-3} ${x},${y-4} Q${x+6},${y-3} ${x+5},${y+5}Z" fill="${c}"/><path d="M${x},${y-4} V${y+5} M${x-3},${y-2} L${x-2},${y+5} M${x+3},${y-2} L${x+2},${y+5}" fill="none" stroke="#c98a8a" stroke-width=".9"/>`).join(''),
 /* 夾腳拖：橘色鞋底、藍色人字帶 */
 flip14:`<path d="M-7,15 Q-11,2 -9,-10 Q-6,-17 0,-17 Q6,-17 9,-10 Q11,2 7,15 Q0,18 -7,15Z" fill="#f2a030"/><path d="M-6,13 Q-8,2 -6,-9 Q-4,-14 0,-14 Q4,-14 6,-9 Q8,2 6,13 Q0,16 -6,13Z" fill="#f8c46a" stroke="none"/><path d="M0,-6 L-8,3 M0,-6 L8,3" fill="none" stroke="${OL}" stroke-width="5.6" stroke-linecap="round"/><path d="M0,-6 L-8,3 M0,-6 L8,3" fill="none" stroke="#2f7fa8" stroke-width="3.2" stroke-linecap="round"/><circle cx="0" cy="-6" r="2.4" fill="#2f7fa8"/>`,
 /* 燈塔模型：木底座上的小白燈塔，兩條青綠橫帶 */
 lhmodel14:`<ellipse cx="0" cy="13" rx="14" ry="4.6" fill="${WOOD2}"/><path d="M-8,12 L-5,-12 H5 L8,12Z" fill="#fbf9f2"/><path d="M-7,3 H7 L7.4,-3 H-6.6Z" fill="#2f7a88" stroke="none"/><path d="M-7.4,9 H7.4" fill="none" stroke-width="1.4"/><rect x="-6" y="-16" width="12" height="4.6" fill="#3b4a58"/><rect x="-4.6" y="-23" width="9.2" height="7" rx="1.6" fill="#fff3b8"/><path d="M-5.6,-23 Q0,-30 5.6,-23Z" fill="#2f7a88"/>`,
 /* 防曬乳：黃色瓶身、太陽圖案、白色掀蓋 */
 sun14:`<rect x="-8" y="-8" width="16" height="23" rx="4" fill="#f5c842"/><rect x="-6.4" y="-18" width="12.8" height="10" rx="2.4" fill="#fbf6ea"/><path d="M-6.4,-14 H6.4" fill="none" stroke-width="1.2"/><circle cx="0" cy="4" r="4.2" fill="#f08a30" stroke="none"/><path d="M0,-2 V-4 M0,10 V12 M-6,4 H-8 M6,4 H8 M-4.4,0 L-6,-1.6 M4.4,0 L6,-1.6 M-4.4,8 L-6,9.6 M4.4,8 L6,9.6" fill="none" stroke="#f08a30" stroke-width="1.5" stroke-linecap="round"/>`});
Object.assign(DECOY,{
 goggles14:`<path d="M-24,3 Q-30,2 -30,8 M24,3 Q30,2 30,8" fill="none" stroke="#2b3a55" stroke-width="2.4" stroke-linecap="round"/><circle cx="-10" cy="0" r="9.4" fill="#2f4f7a"/><circle cx="10" cy="0" r="9.4" fill="#2f4f7a"/><circle cx="-10" cy="0" r="6.2" fill="#8fc4e8"/><circle cx="10" cy="0" r="6.2" fill="#8fc4e8"/><path d="M-1,-1 H1" stroke-width="2.6" fill="none"/><path d="M-13,-3 L-9,-3 M7,-3 L11,-3" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
 balloon14:`<path d="M2,13 q-6,6 2,10 q8,3 0,9" fill="none" stroke="#9a8a70" stroke-width="1.6"/><ellipse cx="0" cy="-3" rx="14" ry="15.4" fill="#fbf6ea"/><path d="M-9,-14 Q-13,-3 -9,9 M-3,-17 Q-5,-3 -3,13 M4,-17 Q6,-3 4,13 M10,-12 Q14,-1 10,8" fill="none" stroke="#d8413a" stroke-width="3.6"/><ellipse cx="0" cy="-3" rx="14" ry="15.4" fill="none"/><path d="M-3,12 L0,16 L3,12Z" fill="#d8413a" stroke-width="1.2"/><path d="M-7,-12 Q-9,-8 -8,-5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,
 lamb14:`<ellipse cx="2" cy="6" rx="14" ry="10" fill="#f6f1e4"/><path d="M-8,10 q-3,-6 2,-9 q2,-7 8,-3 q6,-5 10,2 q5,2 3,8 q-6,5 -15,3 q-6,1 -8,-1Z" fill="#fbf9f2"/><path d="M-9,13 V17 M-3,15 V18 M7,15 V18 M13,12 V16" fill="none" stroke="#5a4a42" stroke-width="3.4" stroke-linecap="round"/><ellipse cx="-3" cy="-3" rx="9" ry="8" fill="#5a4a42"/><ellipse cx="-12" cy="-4" rx="3.6" ry="5" fill="#5a4a42" transform="rotate(-50 -12 -4)"/><ellipse cx="6" cy="-4" rx="3.6" ry="5" fill="#5a4a42" transform="rotate(50 6 -4)"/><path d="M-9,-9 q3,-6 6,-1 q3,-5 6,1" fill="#fbf9f2"/><circle cx="-6" cy="-3" r="1.4" fill="#fff" stroke="none"/><circle cx="0" cy="-3" r="1.4" fill="#fff" stroke="none"/><ellipse cx="-3" cy="1.4" rx="2.6" ry="2" fill="#8a7a72" stroke="none"/>`,
 mat14:`<rect x="-17" y="-11" width="34" height="22" rx="4" fill="#d9b878"/><path d="M-17,-6 H17 M-17,0 H17 M-17,6 H17 M-12,-11 V11 M-6,-11 V11 M0,-11 V11 M6,-11 V11 M12,-11 V11" fill="none" stroke="#b8924e" stroke-width="1.1"/><rect x="-17" y="-11" width="34" height="22" rx="4" fill="none"/><ellipse cx="17" cy="0" rx="5" ry="11" fill="#c9a460"/><ellipse cx="17" cy="0" rx="2.2" ry="5.4" fill="none" stroke-width="1.3"/><path d="M-9,-12 V12 M7,-12 V12" fill="none" stroke="#8a5a32" stroke-width="2.6"/>`,
 leaf14:`<path d="M-16,12 Q-20,-8 0,-16 Q16,-12 18,6 Q2,16 -16,12Z" fill="#6fb85a"/><path d="M-16,12 Q-4,2 14,-8 M-6,5 L-8,-4 M2,0 L0,-9 M8,-3 L11,5" fill="none" stroke="#3f7a38" stroke-width="1.4" stroke-linecap="round"/><path d="M-16,12 L-21,17" fill="none" stroke="#5a8a3a" stroke-width="2.4" stroke-linecap="round"/>`,
 mushroom14:`<path d="M-5,12 Q-6,2 -4,-1 H4 Q6,2 5,12Z" fill="#efe0c0"/><path d="M-20,-1 Q-22,-18 0,-20 Q22,-18 20,-1 Q10,3 0,3 Q-10,3 -20,-1Z" fill="#c4966a"/><circle cx="-8" cy="-10" r="2.2" fill="#f6ecd4" stroke="none"/><circle cx="6" cy="-13" r="2.6" fill="#f6ecd4" stroke="none"/><circle cx="11" cy="-5" r="1.8" fill="#f6ecd4" stroke="none"/><circle cx="-3" cy="-4" r="1.6" fill="#f6ecd4" stroke="none"/>`,
 keys14:`<circle cx="0" cy="-16" r="6" fill="none" stroke="${OL}" stroke-width="3.6"/><circle cx="0" cy="-16" r="6" fill="none" stroke="#c9ccd0" stroke-width="1.8"/>`+
  [[-11,'#d8b04a'],[-4,'#c9ccd0'],[4,'#d8b04a'],[11,'#c9ccd0']].map(([x,c],i)=>`<path d="M${x*.5},-11 L${x},${-1+i%2*3}" fill="none" stroke-width="1.2"/><circle cx="${x}" cy="${1+i%2*3}" r="3.6" fill="${c}"/><path d="M${x},${4+i%2*3} V${14+i%2*2} M${x},${11+i%2*2} h3.4" fill="none" stroke="${OL}" stroke-width="3.2"/><path d="M${x},${4+i%2*3} V${14+i%2*2} M${x},${11+i%2*2} h3.4" fill="none" stroke="${c}" stroke-width="1.6"/>`).join(''),
 slipper14:`<path d="M-17,10 Q-19,-2 -12,-8 Q-3,-13 8,-9 Q18,-6 17,4 Q16,12 6,13 H-12 Q-17,13 -17,10Z" fill="#8a7ab0"/><path d="M-17,10 H17" fill="none" stroke-width="1.2"/><path d="M-14,-2 Q-6,-10 8,-7 Q16,-4 15,3 Q4,-1 -14,-2Z" fill="#fbf6ea"/><path d="M-12,-2 q2,-3 4,0 q2,-3 4,0 q2,-3 4,0 q2,-3 4,0 q2,-3 4,0" fill="none" stroke="#d8cfbd" stroke-width="1.2"/>`,
 salt14:`<path d="M-8,14 L-9,-2 Q-9,-9 0,-10 Q9,-9 9,-2 L8,14Z" fill="#fbf9f2"/><path d="M-8.6,2 H8.6 M-8.4,8 H8.4" fill="none" stroke="#e0dac8" stroke-width="1.4"/><path d="M-9,-2 Q-9,-9 0,-10 Q9,-9 9,-2Z" fill="#c9ccd0"/><circle cx="-3" cy="-6" r=".9" fill="${OL}" stroke="none"/><circle cx="1" cy="-7" r=".9" fill="${OL}" stroke="none"/><circle cx="4" cy="-5" r=".9" fill="${OL}" stroke="none"/><circle cx="-1" cy="-4" r=".9" fill="${OL}" stroke="none"/><rect x="-9.4" y="12" width="18.8" height="3.6" rx="1.4" fill="#e0dac8"/>`,
 toothpaste14:`<g transform="rotate(-28)"><path d="M-20,-6 L10,-7 L10,7 L-20,6 L-23,0Z" fill="#fbf9f2"/><path d="M-20,-6 L-20,6 M-17,-5.6 V5.6" fill="none" stroke-width="1.3"/><path d="M-3,-6.6 H3 V6.6 H-3Z" fill="#d8413a" stroke="none"/><path d="M10,-4.6 H14 V4.6 H10Z" fill="#8fc4e8"/><rect x="14" y="-5.6" width="12" height="11.2" rx="2.4" fill="#4f8fc4"/><path d="M17,-5.6 V5.6 M20,-5.6 V5.6" fill="none" stroke="#2f5f8a" stroke-width="1.1"/></g>`});

/* 2026-11-18 使用者：物件看起來太大 → 原圖本身比前面關卡大，縮到和前面關卡差不多（最長邊約 34，細長的約 40），引擎再縮 15% */
const SCL=(o,t)=>Object.entries(t).forEach(([k,v])=>{if(o[k])o[k]=`<g transform="scale(${v})">${o[k]}</g>`});
SCL(ART,{mask14:.79,buoy14:.82,deer14:.89,towel14:.87,turtle14:.89,coral14:.89,chime14:.92,lhmodel14:.9});
SCL(DECOY,{goggles14:.73,balloon14:.8,toothpaste14:.8,mushroom14:.85,leaf14:.87,mat14:.87,keys14:.9});

/* ================= 4. 12 種 × 4 個 ================= */
const OLD={starfish:{id:'starfish',name:'橘色海星',short:'海星',r:14,rot:35},pearl:{id:'pearl',name:'珍珠貝',short:'珍珠貝',r:14,rot:15}};
const old=(id,regions)=>({...(typeOf(id)||OLD[id]),regions});
const TYPES=[
 old('starfish',['beach14','tideE14','onsen14','tideE14']),old('pearl',['beach14','tideE14','street14','campW14']), /* 2026-11-26e：每種 4 個區域裡放 1～2 個兩側新區 */
 {id:'mask14',name:'浮潛面鏡',short:'面鏡',r:16,rot:10,regions:['subE14','street14','beach14','archE14']},
 {id:'buoy14',name:'紅白浮球',short:'浮球',r:15,rot:15,regions:['beach14','subE14','cliff14','subE14']},
 {id:'deer14',name:'梅花鹿玩偶',short:'鹿玩偶',r:16,rot:10,regions:['meadow14','hillW14','grove14','flowerW14']},
 {id:'towel14',name:'條紋浴巾捲',short:'浴巾捲',r:16,rot:8,regions:['onsen14','campW14','street14','tideE14']},
 {id:'turtle14',name:'海龜吊飾',short:'海龜吊飾',r:15,rot:12,regions:['street14','subE14','grove14','campW14']},
 {id:'coral14',name:'大香菇珊瑚模型',short:'珊瑚模型',r:16,rot:8,regions:['beach14','archE14','cliff14','tideE14']},
 {id:'chime14',name:'貝殼風鈴',short:'風鈴',r:15,rot:10,regions:['street14','campW14','cliff14','flowerW14']},
 {id:'flip14',name:'夾腳拖',short:'夾腳拖',r:15,rot:25,regions:['beach14','campW14','tideE14','onsen14']},
 {id:'lhmodel14',name:'燈塔模型',short:'燈塔模型',r:15,rot:8,regions:['cliff14','flowerW14','archE14','grove14']},
 {id:'sun14',name:'防曬乳',short:'防曬乳',r:14,rot:12,regions:['beach14','campW14','hillW14','subE14']}];
LEVELS[N].types=TYPES;
/* BORROW：不借（綠島物件不混進前面的關卡） */

/* ================= 5. 地形：海島輪廓、區域 ================= */
const ISLE=[[460,560],[640,500],[800,480],[1000,455],[1200,470],[1400,440],[1600,470],[1800,500],[1980,560],[2120,720],[2170,1000],[2190,1300],[2160,1600],[2080,1860],[1900,2000],[1640,2030],[1440,2040],[1250,2050],[1060,2040],[880,2020],[640,1990],[440,1900],[340,1660],[310,1300],[330,1000],[380,740]];
const smoothD=P=>{const n=P.length,mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2],m0=mid(P[n-1],P[0]);let d=`M${f(m0[0])},${f(m0[1])}`;for(let i=0;i<n;i++){const c=P[i],m=mid(P[i],P[(i+1)%n]);d+=` Q${c[0]},${c[1]} ${f(m[0])},${f(m[1])}`}return d+'Z'};
const ISLED=smoothD(ISLE);
const ISPTS=(()=>{const n=ISLE.length,mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2],out=[];for(let i=0;i<n;i++){const a=mid(ISLE[(i+n-1)%n],ISLE[i]),c=ISLE[i],b=mid(ISLE[i],ISLE[(i+1)%n]);for(let t=0;t<1;t+=.125){const u=1-t;out.push([u*u*a[0]+2*u*t*c[0]+t*t*b[0],u*u*a[1]+2*u*t*c[1]+t*t*b[1]])}}return out})();
const inPoly=(P,x,y)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if(((yi>y)!==(yj>y))&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
const inIsle=(x,y)=>inPoly(ISPTS,x,y);
const POOLC={x:1690,y:1255,rx:112,ry:66};
const inPool=(x,y)=>((x-POOLC.x)/POOLC.rx)**2+((y-POOLC.y)/POOLC.ry)**2<1;
WATERFN[N]=(x,y)=>!inIsle(x,y)||inPool(x,y);
Object.assign(REG,{cliff14:{x:790,y:560,w:1000,h:340},meadow14:{x:700,y:930,w:440,h:700},grove14:{x:1130,y:930,w:360,h:640},onsen14:{x:1500,y:960,w:340,h:560},
 street14:{x:760,y:1580,w:1020,h:250},beach14:{x:760,y:1840,w:1000,h:200},all14:{x:330,y:440,w:1860,h:1600},
 /* 2026-11-26e 加寬的新區：西＝花海、牛頭山草原、露營區；東＝海蝕拱門、潮間帶、半潛艇碼頭 */
 flowerW14:{x:400,y:570,w:390,h:340},hillW14:{x:340,y:930,w:360,h:480},campW14:{x:380,y:1440,w:380,h:440},
 archE14:{x:1800,y:560,w:330,h:420},tideE14:{x:1860,y:1000,w:310,h:540},subE14:{x:1800,y:1570,w:330,h:380}});
H.SCREG[N]=['cliff14','meadow14','grove14','onsen14','street14','beach14','flowerW14','hillW14','campW14','archE14','tideE14','subE14'];
const LH={x:1560,y:612},DOG={x:870,y:1150},SLEEP={x:940,y:1480},PIER={x:1250};

function ground(){
 const Sc=H.SCENES[N],X0=Sc.x0-420,WW=Sc.x1-Sc.x0+840;let g='';
 /* 海：深色底、近岸淺藍綠、浪紋 */
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="${Sc.y1+840}" fill="#6fbcc9" stroke="none"/>`;
 for(let i=0;i<70;i++){const x=sr(X0,X0+WW),y=sr(-200,Sc.y1+300);g+=`<path d="M${f(x)},${f(y)} q9,-5 18,0 q9,5 18,0" fill="none" stroke="#a8e0e4" stroke-width="2" opacity=".7"/>`}
 g+=`<path d="${ISLED}" fill="none" stroke="#8ed0d4" stroke-width="230" stroke-linejoin="round" opacity=".55"/><path d="${ISLED}" fill="none" stroke="#a6dfdc" stroke-width="150" stroke-linejoin="round" opacity=".8"/><path d="${ISLED}" fill="none" stroke="#c4eee6" stroke-width="86" stroke-linejoin="round" opacity=".9"/>`;
 /* 北邊海崖：岩石邊（只在北半邊） */
 g+=`<defs><clipPath id="up14"><rect x="150" y="300" width="2300" height="640"/></clipPath><clipPath id="isle14"><path d="${ISLED}"/></clipPath><clipPath id="low14"><rect x="150" y="960" width="2300" height="1200"/></clipPath></defs>`;
 g+=`<g clip-path="url(#up14)"><path d="${ISLED}" fill="none" stroke="#8c8474" stroke-width="30" stroke-linejoin="round"/><path d="${ISLED}" fill="none" stroke="#a89c86" stroke-width="16" stroke-linejoin="round"/></g>`;
 g+=`<path d="${ISLED}" fill="#9fc063" stroke-width="2.6"/>`;
 g+=`<g clip-path="url(#isle14)">`;
 for(let i=0;i<90;i++){const x=sr(320,2180),y=sr(470,2040);g+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(40,120))}" ry="${f(sr(16,46))}" fill="${pk(['#8fb458','#b0cb72','#a6c468','#94b85c'])}" stroke="none" opacity=".55"/>`}
 /* 西邊草地比較黃綠、有小花 */
 g+=`<ellipse cx="900" cy="1290" rx="240" ry="360" fill="#b0cc6c" stroke="none" opacity=".65"/>`;
 for(let i=0;i<46;i++){const x=sr(680,1120),y=sr(960,1620);g+=`<circle cx="${f(x)}" cy="${f(y)}" r="${f(sr(1.8,3))}" fill="${pk(['#fbf6ea','#f5c842','#f0a8c8','#fbf6ea'])}" stroke="none"/>`}
 /* 沙地：南邊沙灘＋東西沿岸一圈細沙 */
 g+=`<path d="M200,1900 Q500,1880 800,1890 Q900,1896 1000,1906 T1400,1888 T1960,1860 Q2120,1850 2300,1820 V2200 H200Z" fill="#efdcae" stroke="none"/><path d="M200,1918 Q500,1900 800,1910 Q900,1916 1000,1926 T1400,1910 T1960,1880 Q2120,1870 2300,1840" fill="none" stroke="#e3cb92" stroke-width="3" stroke-dasharray="14 10"/>`;
 g+=`<g clip-path="url(#low14)"><path d="${ISLED}" fill="none" stroke="#efdcae" stroke-width="60" stroke-linejoin="round"/></g>`;
 /* 2026-11-26e 加寬區的地面：西北花海底（亮綠）、西邊牛頭山草原（黃綠＋放牧的草皮）、西南露營區（踩平的草地）、東邊潮間帶（濕礁岩帶） */
 g+=`<ellipse cx="580" cy="760" rx="200" ry="150" fill="#b0cc6c" stroke="none" opacity=".7"/><ellipse cx="520" cy="1180" rx="190" ry="250" fill="#a8c468" stroke="none" opacity=".7"/><ellipse cx="560" cy="1660" rx="200" ry="200" fill="#b8c87a" stroke="none" opacity=".6"/>`;
 for(let i=0;i<40;i++){const x=sr(360,700),y=sr(940,1420);g+=`<path d="M${f(x-5)},${f(y)} q2,-7 4,-1 q2,-8 4,0" fill="none" stroke="#7fa650" stroke-width="1.4" stroke-linecap="round"/>`}
 g+=`<path d="M1930,960 Q2060,980 2200,1000 L2220,1560 Q2080,1560 1950,1520 Q1900,1250 1930,960Z" fill="#9a9282" stroke="none" opacity=".75"/>`;
 for(let i=0;i<26;i++){const x=sr(1960,2180),y=sr(1000,1520);g+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(10,26))}" ry="${f(sr(4,9))}" fill="${pk(['#6fbcc9','#5f8a4a','#7e8a6c'])}" stroke="none" opacity=".8"/>`}
 /* 路：不畫框線，土色小路（北邊海崖小路、中央幹道、民宿街、碼頭路） */
 const roads=[['M1250,2000 Q1250,1880 1250,1770 Q1255,1500 1300,1220 Q1330,1040 1400,880 Q1440,780 1470,720 Q1520,670 1560,650',46],
  ['M1470,720 Q1300,670 1100,640 Q940,625 820,660',40],['M730,1770 Q1000,1752 1250,1766 Q1520,1752 1790,1772',46],['M1300,1220 Q1180,1240 1000,1190',34],['M1300,1240 Q1450,1260 1590,1230',34],
  /* 2026-11-26e 加寬區的支線 */['M820,660 Q700,690 600,760',30],['M1000,1190 Q800,1150 640,1180 Q560,1196 520,1240',30],['M740,1770 Q620,1760 560,1700',30],['M1560,650 Q1750,640 1900,720',30],['M1800,1250 Q1900,1240 1980,1270',28],['M1790,1772 Q1900,1780 1980,1800',34]];
 roads.forEach(([d,w])=>{g+=`<path d="${d}" fill="none" stroke="#d9c690" stroke-width="${w+10}" stroke-linecap="round" opacity=".55"/><path d="${d}" fill="none" stroke="#ecdcae" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#f4e8c4" stroke-width="${w*.35}" stroke-linecap="round" stroke-dasharray="3 26" opacity=".8"/>`});
 g+=`</g>`;
 /* 海崖欄杆：沿北邊崖頂的木樁＋繩子 */
 const fp=[[820,560],[900,530],[1000,512],[1100,516],[1200,524],[1300,510],[1400,498],[1480,506]];
 g+=`<path d="${fp.map((p,i)=>(i?'L':'M')+p[0]+','+(p[1]-18)).join(' ')}" fill="none" stroke="#fbf6ea" stroke-width="2.4"/>`;
 fp.forEach(([x,y])=>{g+=`<path d="M${x},${y} V${y-24}" fill="none" stroke="${OL}" stroke-width="6.4" stroke-linecap="round"/><path d="M${x},${y} V${y-24}" fill="none" stroke="${WOOD}" stroke-width="3.6" stroke-linecap="round"/>`});
 /* 露天溫泉：礁石圍著的池子，水是乳綠色 */
 g+=`<ellipse cx="${POOLC.x}" cy="${POOLC.y+4}" rx="${POOLC.rx+14}" ry="${POOLC.ry+12}" fill="#c9bfa6" stroke="none" opacity=".7"/><ellipse cx="${POOLC.x}" cy="${POOLC.y}" rx="${POOLC.rx}" ry="${POOLC.ry}" fill="#a6e0d4"/><ellipse cx="${POOLC.x-10}" cy="${POOLC.y-6}" rx="${POOLC.rx*.7}" ry="${POOLC.ry*.62}" fill="#c4efe2" stroke="none"/>`;
 g+=`<path d="M${POOLC.x-70},${POOLC.y+18} q10,-6 20,0 q10,6 20,0 M${POOLC.x+10},${POOLC.y-26} q10,-6 20,0 q10,6 20,0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".9"/>`;
 for(let i=0;i<22;i++){const a=i/22*Math.PI*2,x=POOLC.x+Math.cos(a)*(POOLC.rx+4+sr(-3,5)),y=POOLC.y+Math.sin(a)*(POOLC.ry+4+sr(-3,5)),s=sr(.8,1.3);
  g+=`<path d="M${f(x-13*s)},${f(y+6*s)} Q${f(x-14*s)},${f(y-8*s)} ${f(x-2*s)},${f(y-10*s)} Q${f(x+12*s)},${f(y-9*s)} ${f(x+13*s)},${f(y+6*s)}Z" fill="${pk(['#807a70','#8c867a','#767068'])}"/><path d="M${f(x-8*s)},${f(y-4*s)} Q${f(x-2*s)},${f(y-9*s)} ${f(x+5*s)},${f(y-7*s)}" fill="none" stroke="#aaa496" stroke-width="2" stroke-linecap="round"/>`}
 /* 東岸礁石（半泡在水裡） */
 [[2148,1030],[2168,1130],[2170,1330],[2176,1420],[2150,1540],[2200,1220],[2194,1090],[2204,1370]].forEach(([x,y])=>{const s=sr(.9,1.4);
  g+=`<ellipse cx="${x}" cy="${y+5}" rx="${f(26*s)}" ry="${f(8*s)}" fill="#fff" opacity=".6" stroke="none"/><path d="M${f(x-24*s)},${y+4} Q${f(x-26*s)},${f(y-14*s)} ${f(x-6*s)},${f(y-20*s)} Q${f(x+16*s)},${f(y-22*s)} ${f(x+24*s)},${y+4}Z" fill="#7e766c"/><path d="M${f(x-14*s)},${f(y-10*s)} Q${f(x-4*s)},${f(y-19*s)} ${f(x+8*s)},${f(y-16*s)}" fill="none" stroke="#a69e90" stroke-width="2.2" stroke-linecap="round"/>`});
 /* 浪花：南岸、東岸、西岸 */
 for(let i=0;i<34;i++){const x=440+i*50,yb=Math.max(...ISPTS.filter(p=>Math.abs(p[0]-x-20)<40&&p[1]>1700).map(p=>p[1]),1880),y=yb+34+Math.sin(i*1.3)*8;g+=`<path d="M${x},${f(y)} q10,-6 20,0 q10,6 20,0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".85"/>`}
 ISPTS.forEach((p,i)=>{if(i%6||p[0]>700||p[1]<620||p[1]>1880)return;g+=`<path d="M${f(p[0]-34)},${f(p[1])} q-6,10 0,20 q6,10 0,20" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>`}); /* 2026-11-26e 西岸浪花沿著新的島邊 */
 /* 碼頭：木棧橋從沙灘伸進海裡 */
 g+=`<rect x="${PIER.x-34}" y="1978" width="68" height="190" fill="#c99a5b"/>`;for(let y=1986;y<2168;y+=11)g+=`<path d="M${PIER.x-34},${y} H${PIER.x+34}" fill="none" stroke="#8a5a32" stroke-width="1.5"/>`;
 g+=`<path d="M${PIER.x-34},1978 V2168 M${PIER.x+34},1978 V2168" fill="none" stroke="#7a4a22" stroke-width="3"/>`;
 [2000,2060,2120].forEach(y=>[-34,34].forEach(dx=>g+=`<path d="M${PIER.x+dx},${y} V${y-14}" fill="none" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><path d="M${PIER.x+dx},${y} V${y-14}" fill="none" stroke="#7a4a22" stroke-width="4.4" stroke-linecap="round"/>`));
 g+=`<path d="M${PIER.x-46},2148 q8,-5 16,0 q8,5 16,0 M${PIER.x+16},2156 q8,-5 16,0 q8,5 16,0" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".85"/>`;
 return `<g stroke="${OL}" stroke-width="2" stroke-linejoin="round">${g}</g>`}

/* ================= 6. 佈景美術 ================= */
const sh=(w,o=.13)=>`<ellipse cx="2" cy="2" rx="${w}" ry="${f(w*.16)}" fill="#000" opacity="${o}" stroke="none"/>`;
const palm14=(lean)=>{const L=lean??sr(-14,14),c1=pk(['#5f9a3a','#6fa84a','#4f8a3a']);let s=sh(24);
 s+=`<path d="M-4,0 Q${f(L*.6)},-50 ${f(L)},-96" fill="none" stroke="${OL}" stroke-width="11" stroke-linecap="round"/><path d="M-4,0 Q${f(L*.6)},-50 ${f(L)},-96" fill="none" stroke="#b08050" stroke-width="7.6" stroke-linecap="round"/>`;
 for(let i=1;i<7;i++){const t=i/7,x=-4+(L+4)*(t*t*.6+t*.4),y=-96*t;s+=`<path d="M${f(x-4)},${f(y)} l8,-1" fill="none" stroke="#7a5230" stroke-width="1.4"/>`}
 [-160,-125,-95,-60,-25,10].forEach(a=>{const rd=a*Math.PI/180,c=Math.cos(rd),sn=Math.sin(rd);s+=`<path d="M${f(L)},-96 Q${f(L+c*30)},${f(-96+sn*30-22)} ${f(L+c*54)},${f(-96+sn*54+12)} Q${f(L+c*30)},${f(-96+sn*30-8)} ${f(L)},-96Z" fill="${c1}"/>`});
 return s+`<circle cx="${f(L-4)}" cy="-92" r="4.4" fill="#7a5230" stroke-width="1.3"/><circle cx="${f(L+5)}" cy="-91" r="4.4" fill="#8a6038" stroke-width="1.3"/>`};
const hibiscus14=()=>{let s=sh(22,.12);[[-14,-8,13],[8,-12,15],[18,-4,11],[-2,-18,12]].forEach(([x,y,rr])=>s+=`<circle cx="${x}" cy="${y}" r="${rr}" fill="#5f8f3a"/>`);
 [[-14,-12],[8,-20],[18,-8],[-4,-24],[2,-6]].forEach(([x,y])=>{const c=pk(['#e8413a','#f06a8a','#f5a030']);s+=`<circle cx="${x}" cy="${y}" r="4.6" fill="${c}" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="1.4" fill="#f5e04a" stroke="none"/>`});return s};
const rock14s=()=>`<ellipse cx="0" cy="3" rx="22" ry="5" fill="#000" opacity=".12" stroke="none"/><path d="M-20,2 Q-22,-10 -8,-14 Q8,-18 16,-8 Q22,-2 20,2Z" fill="#8c867a"/><path d="M-12,-6 Q-4,-14 6,-12" fill="none" stroke="#aaa496" stroke-width="2" stroke-linecap="round"/>`;
const reefRock14=()=>`<ellipse cx="0" cy="3" rx="42" ry="7" fill="#000" opacity=".14" stroke="none"/><path d="M-38,3 Q-40,-14 -24,-18 Q-10,-22 -2,-12 Q4,-6 0,3Z" fill="#7e766c"/><path d="M-6,3 Q-8,-18 8,-26 Q26,-30 34,-14 Q40,-4 36,3Z" fill="#8a8278"/><path d="M-30,-6 Q-24,-16 -12,-15 M12,-18 Q22,-26 30,-18" fill="none" stroke="#aaa496" stroke-width="2.2" stroke-linecap="round"/><path d="M20,-4 Q22,-10 28,-9" fill="none" stroke="#6f9a4a" stroke-width="2"/>`;
/* 像哈巴狗的大岩石：側面趴著，頭朝左；大圓頭、扁扁的短鼻子、皺紋、小摺耳、前腳往前伸、捲捲的尾巴（小梅花鹿躲在牠背後） */
const ROCKC='#948f86',ROCKL='#b0aa9e',ROCKD='#6f6a62',ROCKM='#7c776f';
const dogRock14=()=>sh(100,.15)+
 `<path d="M74,-58 Q90,-70 84,-84 Q76,-94 66,-86 Q60,-78 68,-74 Q74,-78 74,-72 Q70,-66 62,-64Z" fill="${ROCKC}"/>`+
 `<path d="M-46,0 Q-54,-40 -30,-64 Q0,-84 44,-76 Q82,-68 88,-34 Q92,-8 84,0Z" fill="${ROCKC}"/>`+
 `<path d="M40,0 Q30,-22 44,-38 Q66,-46 76,-26 Q80,-8 72,0Z" fill="${ROCKC}"/><path d="M48,0 Q56,-6 66,-2" fill="none" stroke="${ROCKD}" stroke-width="2" stroke-linecap="round"/>`+
 `<path d="M-108,0 Q-114,-14 -98,-16 H-34 V0Z" fill="${ROCKC}"/><path d="M-104,-16 Q-110,-30 -94,-30 H-38 L-36,-16" fill="${ROCKC}"/>`+
 `<path d="M-104,-6 h8 M-104,-2 h8 M-100,-22 h8 M-100,-26 h8" fill="none" stroke="${ROCKD}" stroke-width="1.6" stroke-linecap="round"/>`+
 `<circle cx="-58" cy="-70" r="40" fill="${ROCKC}"/>`+
  `<path d="M-96,-82 Q-104,-70 -98,-54 Q-90,-40 -76,-42 Q-66,-48 -68,-62 Q-72,-80 -96,-82Z" fill="${ROCKM}"/>`+
 `<path d="M-84,-92 Q-70,-100 -54,-96 M-82,-100 Q-68,-108 -52,-104 M-88,-84 Q-84,-90 -76,-90" fill="none" stroke="${ROCKD}" stroke-width="2.2" stroke-linecap="round"/>`+
 `<ellipse cx="-69" cy="-78" rx="5.6" ry="6.4" fill="#2b2a28" stroke="none"/><circle cx="-67.4" cy="-80.4" r="2" fill="#fff" stroke="none"/>`+
 `<ellipse cx="-96" cy="-66" rx="6" ry="5" fill="#2b2a28" stroke="none"/><path d="M-96,-61 V-54 M-100,-50 Q-96,-46 -96,-54 Q-94,-46 -86,-50" fill="none" stroke="${ROCKD}" stroke-width="2" stroke-linecap="round"/><path d="M-90,-44 Q-82,-38 -74,-44" fill="none" stroke="${ROCKD}" stroke-width="2" stroke-linecap="round"/>`+
 `<path d="M-58,-108 Q-30,-122 -16,-100 Q-4,-70 -18,-44 Q-30,-32 -42,-46 Q-52,-58 -60,-70 Q-72,-84 -58,-108Z" fill="${ROCKM}"/><path d="M-48,-104 Q-28,-110 -22,-90 Q-16,-70 -24,-56" fill="none" stroke="${ROCKL}" stroke-width="3.4" stroke-linecap="round"/>`+
 `<path d="M-20,-60 Q-24,-34 -18,-16 M10,-74 Q26,-50 22,-20" fill="none" stroke="${ROCKD}" stroke-width="2.2" stroke-linecap="round"/>`+
 `<path d="M-60,-106 Q-40,-110 -28,-98" fill="none" stroke="${ROCKL}" stroke-width="4" stroke-linecap="round"/><path d="M0,-78 Q30,-80 60,-68" fill="none" stroke="${ROCKL}" stroke-width="5" stroke-linecap="round"/>`+
 `<path d="M14,-80 Q36,-82 50,-74 Q32,-70 14,-80Z" fill="#7fa650" stroke="none"/><path d="M-70,-108 Q-58,-112 -48,-108 Q-60,-104 -70,-108Z" fill="#7fa650" stroke="none"/>`;
/* 像睡美人的長岩石：躺著的側臉（額頭、鼻尖、下巴）、胸口、膝蓋、腳尖，頭髮是一長片青苔 */
const sleeperRock14=()=>sh(130,.14)+`<path d="M-132,0 L-132,-20 Q-130,-34 -118,-38 Q-108,-48 -98,-50 Q-92,-58 -86,-62 Q-82,-56 -83,-52 Q-76,-52 -78,-47 Q-72,-46 -74,-42 Q-66,-36 -58,-40 Q-44,-62 -28,-56 Q-12,-50 0,-42 Q16,-46 30,-52 Q50,-56 64,-64 Q76,-66 86,-54 Q100,-46 112,-52 Q124,-62 128,-50 L132,0Z" fill="${ROCKC}"/>`+
 `<path d="M-132,-20 Q-130,-34 -118,-38 Q-110,-30 -122,-14 Q-132,-6 -132,-20Z" fill="#6f9a4a" stroke="none"/><path d="M-120,-36 Q-104,-40 -98,-50 Q-96,-36 -110,-26 Z" fill="#7fa650" stroke="none"/>`+
 `<path d="M-100,-8 Q-96,-24 -88,-30 M-40,-26 Q-30,-36 -16,-34 M20,-30 Q40,-38 56,-44 M96,-30 Q106,-36 116,-34" fill="none" stroke="${ROCKD}" stroke-width="2" stroke-linecap="round"/><path d="M-92,-56 Q-88,-60 -86,-60 M-28,-54 Q-18,-50 -6,-44 M68,-62 Q78,-62 84,-54" fill="none" stroke="${ROCKL}" stroke-width="3.4" stroke-linecap="round"/><path d="M-96,-45 q3,-2 6,0" fill="none" stroke="${ROCKD}" stroke-width="1.6" stroke-linecap="round"/>`;
/* 梅花鹿：褐色、背上白點；公的有分岔鹿角，也有低頭吃草的 */
const deerS=(o={})=>{const c=o.c||'#b97b48',st=o.graze;let s=sh(24,.12);
 s+=`<path d="M-12,-14 V-1 M-4,-14 V0 M8,-14 V0 M16,-14 V-2" fill="none" stroke="#8a5a30" stroke-width="3.4" stroke-linecap="round"/><path d="M-12,-2 v2 M-4,-1 v2 M8,-1 v2 M16,-3 v2" fill="none" stroke="#3a2a22" stroke-width="3.4" stroke-linecap="round"/>`;
 s+=`<ellipse cx="2" cy="-22" rx="22" ry="11" fill="${c}"/><ellipse cx="2" cy="-17" rx="16" ry="5" fill="#e8c8a0" stroke="none"/>`;
 [[-10,-26],[-2,-29],[8,-28],[15,-24],[3,-22],[-7,-21],[11,-19]].forEach(([x,y])=>s+=`<circle cx="${x}" cy="${y}" r="1.8" fill="#fbf6ea" stroke="none"/>`);
 s+=`<path d="M23,-26 Q28,-24 27,-18 Q24,-20 22,-18Z" fill="#fbf6ea" stroke-width="1.2"/>`;
 if(st){s+=`<path d="M-16,-28 Q-26,-26 -30,-14" fill="none" stroke="${OL}" stroke-width="9" stroke-linecap="round"/><path d="M-16,-28 Q-26,-26 -30,-14" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/><ellipse cx="-32" cy="-9" rx="8" ry="5.4" fill="${c}" transform="rotate(30 -32 -9)"/><path d="M-26,-14 l-5,-4" fill="none" stroke="${c}" stroke-width="3.4"/><circle cx="-34" cy="-8" r="1.2" fill="${OL}" stroke="none"/><ellipse cx="-27" cy="-17" rx="2.4" ry="3.6" fill="${c}" transform="rotate(-20 -27 -17)"/>`}
 else{s+=`<path d="M-16,-28 Q-24,-34 -26,-46" fill="none" stroke="${OL}" stroke-width="9" stroke-linecap="round"/><path d="M-16,-28 Q-24,-34 -26,-46" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/><ellipse cx="-29" cy="-50" rx="8" ry="5.6" fill="${c}"/><path d="M-35,-49 l-5,2" fill="none" stroke="${c}" stroke-width="3.6"/><circle cx="-31" cy="-52" r="1.3" fill="${OL}" stroke="none"/><circle cx="-39" cy="-47" r="1.4" fill="${OL}" stroke="none"/><ellipse cx="-22" cy="-55" rx="2.6" ry="4" fill="${c}" transform="rotate(30 -22 -55)"/>`;
  if(o.antler)s+=`<path d="M-27,-55 Q-28,-66 -33,-72 M-28,-62 Q-24,-68 -20,-70 M-25,-55 Q-20,-64 -14,-66 M-21,-60 L-16,-62" fill="none" stroke="#7a5a3a" stroke-width="2.2" stroke-linecap="round"/>`}
 return s};
/* 小梅花鹿（故事目標）：戴花圈、只露出頭和耳朵，躲在大岩石後面 */
const fawn14=()=>{let s=`<ellipse cx="0" cy="-80" rx="13" ry="14" fill="#c4854c"/><circle cx="-4" cy="-78" r="1.6" fill="#fbf6ea" stroke="none"/><circle cx="5" cy="-84" r="1.6" fill="#fbf6ea" stroke="none"/>`;
 s+=`<ellipse cx="-17" cy="-100" rx="5" ry="8" fill="#c4854c" transform="rotate(-35 -17 -100)"/><ellipse cx="-17" cy="-100" rx="2.4" ry="5" fill="#f0a8a0" stroke="none" transform="rotate(-35 -17 -100)"/><ellipse cx="17" cy="-100" rx="5" ry="8" fill="#c4854c" transform="rotate(35 17 -100)"/><ellipse cx="17" cy="-100" rx="2.4" ry="5" fill="#f0a8a0" stroke="none" transform="rotate(35 17 -100)"/>`;
 s+=`<ellipse cx="0" cy="-98" rx="13" ry="12" fill="#d49a60"/><ellipse cx="0" cy="-92" rx="7" ry="5.4" fill="#fbe8cc" stroke="none"/><circle cx="-5.4" cy="-99" r="2" fill="${OL}" stroke="none"/><circle cx="5.4" cy="-99" r="2" fill="${OL}" stroke="none"/><circle cx="-4.8" cy="-99.8" r=".7" fill="#fff" stroke="none"/><circle cx="6" cy="-99.8" r=".7" fill="#fff" stroke="none"/><ellipse cx="0" cy="-93" rx="2.4" ry="1.8" fill="${OL}" stroke="none"/>`;
 s+=`<path d="M-12,-106 Q0,-116 12,-106" fill="none" stroke="#5f9a3a" stroke-width="3.4" stroke-linecap="round"/>`;
 [[-11,-107,'#f0a8c8'],[-4,-111,'#fbf6ea'],[4,-111,'#f5c842'],[11,-107,'#f0a8c8']].forEach(([x,y,c])=>s+=`<circle cx="${x}" cy="${y}" r="3.4" fill="${c}" stroke-width="1.1"/><circle cx="${x}" cy="${y}" r="1" fill="#f5a030" stroke="none"/>`);
 return s};
/* 白色燈塔（和第 5 關紅白條紋的不一樣）：白色方屋＋逐漸變細的白塔，青綠色橫帶和圓頂 */
const lighthouse14=()=>sh(48,.14)+`<path d="M-36,0 V-30 H36 V0Z" fill="#f7f4ea"/><path d="M-40,-30 H40 L32,-42 H-32Z" fill="#2f7a88"/><rect x="-8" y="-22" width="16" height="22" rx="2" fill="#3b5a6a"/><rect x="-28" y="-25" width="11" height="10" fill="#9fd8e4"/><rect x="17" y="-25" width="11" height="10" fill="#9fd8e4"/><path d="M-28,-20 H-17 M-22.5,-25 V-15 M17,-20 H28 M22.5,-25 V-15" fill="none" stroke-width="1.2"/>`+
 `<path d="M-17,-42 L-11,-178 H11 L17,-42Z" fill="#fbf9f2"/><path d="M-14.6,-92 H14.6 L14.2,-106 H-14.2Z" fill="#2f7a88"/><path d="M-12.4,-132 H12.4 L12,-144 H-12Z" fill="#2f7a88"/><rect x="-5" y="-72" width="10" height="14" rx="5" fill="#3b5a6a"/><path d="M-11,-176 L-9,-60" fill="none" stroke="#e0dac8" stroke-width="2.4" stroke-linecap="round"/>`+
 `<path d="M-22,-178 H22 V-172 H-22Z" fill="#3b4a58"/><path d="M-20,-172 V-186 M-10,-172 V-186 M0,-172 V-186 M10,-172 V-186 M20,-172 V-186 M-22,-186 H22" fill="none" stroke-width="1.8"/>`+
 `<rect x="-11" y="-208" width="22" height="22" rx="3" fill="#fff3b8"/><path d="M-11,-198 H11 M0,-208 V-186" fill="none" stroke="#c8a850" stroke-width="1.4"/><path d="M-14,-208 Q0,-236 14,-208Z" fill="#2f7a88"/><path d="M0,-234 V-244" fill="none" stroke-width="2"/><circle cx="0" cy="-246" r="2.6" fill="#d8413a" stroke-width="1.2"/>`;
/* 民宿：兩層樓平頂小房子，陽台＋盆栽＋條紋遮雨棚，水塔放在屋頂 */
const inn14=(c1,c2)=>sh(70,.14)+`<path d="M-62,0 V-100 H62 V0Z" fill="${c1}"/><path d="M-66,-100 H66 V-108 H-66Z" fill="#fbf9f2"/><rect x="38" y="-130" width="16" height="22" rx="3" fill="#c9ccd0"/><path d="M38,-122 H54" fill="none" stroke-width="1.2"/><path d="M42,-108 V-100 M50,-108 V-100" fill="none" stroke-width="2"/>`+
 `<rect x="-52" y="-86" width="30" height="24" fill="#9fd8e4"/><path d="M-37,-86 V-62 M-52,-74 H-22" fill="none" stroke-width="1.4"/><rect x="-14" y="-90" width="38" height="3.6" fill="${c2}" stroke-width="1.4"/><path d="M-12,-86 V-62 M-4,-86 V-62 M4,-86 V-62 M12,-86 V-62 M20,-86 V-62 M-14,-86 H24 M-14,-62 H24" fill="none" stroke="#fbf9f2" stroke-width="1.6"/><rect x="32" y="-86" width="22" height="24" fill="#9fd8e4"/><path d="M43,-86 V-62 M32,-74 H54" fill="none" stroke-width="1.4"/>`+
 `<rect x="-30" y="-52" width="60" height="4" fill="#fbf9f2"/><path d="M-28,-52 V-44 M-14,-52 V-44 M0,-52 V-44 M14,-52 V-44 M28,-52 V-44" fill="none" stroke-width="1.6"/>`+
 `<rect x="-14" y="-36" width="28" height="36" fill="#7a5a3a"/><path d="M-14,-36 Q0,-46 14,-36 L14,-30 H-14Z" fill="${c2}"/><path d="M-14,-36 H14" fill="none"/><path d="M-9,-30 V0 M9,-30 V0" fill="none" stroke="#5a3e22" stroke-width="1.2"/><circle cx="8" cy="-14" r="1.8" fill="#f5c842" stroke="none"/>`+
 `<rect x="-58" y="-18" width="16" height="18" rx="2" fill="#a8703f"/><circle cx="-50" cy="-24" r="8" fill="#5f9a3a"/><circle cx="-46" cy="-26" r="3" fill="#e8413a" stroke-width="1"/><rect x="42" y="-18" width="16" height="18" rx="2" fill="#a8703f"/><circle cx="50" cy="-24" r="8" fill="#5f9a3a"/><circle cx="53" cy="-27" r="3" fill="#f5c842" stroke-width="1"/>`;
/* 機車（出租用）：側面踏板車 */
const scooter14=(c,fl)=>`<ellipse cx="0" cy="2" rx="26" ry="4" fill="#000" opacity=".13" stroke="none"/><circle cx="-17" cy="-6" r="7" fill="#3a3a3a"/><circle cx="-17" cy="-6" r="2.6" fill="#c9ccd0" stroke="none"/><circle cx="17" cy="-6" r="7" fill="#3a3a3a"/><circle cx="17" cy="-6" r="2.6" fill="#c9ccd0" stroke="none"/>`+
 `<path d="M-22,-10 Q-22,-22 -12,-22 H4 Q10,-22 12,-14 L16,-14 L18,-30 H22 L22,-18 L20,-8 H8 Q4,-6 -4,-8Z" fill="${c}"/><path d="M-22,-22 Q-14,-30 -2,-26 L-2,-20 H-20Z" fill="#3b3b3b"/><path d="M16,-30 L22,-38 H28" fill="none" stroke="${OL}" stroke-width="3.2" stroke-linecap="round"/><path d="M16,-30 L22,-38 H28" fill="none" stroke="#c9ccd0" stroke-width="1.4" stroke-linecap="round"/><path d="M20,-26 L26,-26" fill="none" stroke="#f5e04a" stroke-width="3.6" stroke-linecap="round"/><path d="M-16,-3 H8" fill="none" stroke="#fbf6ea" stroke-width="1.6" opacity=".7"/>`;
const scooterRow14=()=>T(-30,4,.9,scooter14('#e8413a'))+T(6,0,.9,scooter14('#2f7fa8'),true)+T(40,4,.9,scooter14('#f2c230'));
/* 機車出租小攤：條紋遮雨棚、安全帽、鑰匙 */
const rentStand14=()=>sh(44,.14)+`<rect x="-36" y="-44" width="72" height="44" fill="#d9b878"/><path d="M-36,-44 V0 M36,-44 V0" fill="none" stroke="#7a4a22" stroke-width="3"/><rect x="-30" y="-36" width="60" height="22" fill="#f4ecd0" stroke-width="1.4"/>`+
 [-20,-4,12].map((x,i)=>`<path d="M${x-7},-18 Q${x-7},-32 ${x},-32 Q${x+7},-32 ${x+7},-18Z" fill="${['#e8413a','#2f7fa8','#f2c230'][i]}"/><path d="M${x-5},-24 H${x+5}" fill="none" stroke="#fbf6ea" stroke-width="1.6"/>`).join('')+
 `<path d="M-42,-44 L-36,-58 H36 L42,-44Z" fill="#fbf6ea"/>`+[-30,-14,2,18].map(x=>`<path d="M${x},-58 L${x+8},-44 H${x-8}Z" fill="#2f7fa8" stroke="none"/>`).join('')+`<path d="M-42,-44 L-36,-58 H36 L42,-44Z" fill="none"/>`+`<path d="M24,-14 q4,-8 8,0" fill="none" stroke="#c9ccd0" stroke-width="2"/>`;
/* 飛魚乾架：曬著一排排翅膀長長的小飛魚 */
const fishRack14=()=>sh(40,.12)+`<path d="M-36,0 L-30,-60 M36,0 L30,-60 M-32,-58 H32 M-34,-30 H34" fill="none" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><path d="M-36,0 L-30,-60 M36,0 L30,-60 M-32,-58 H32 M-34,-30 H34" fill="none" stroke="${WOOD}" stroke-width="4" stroke-linecap="round"/>`+
 [[-22,-58],[-8,-58],[6,-58],[20,-58],[-24,-30],[-10,-30],[4,-30],[18,-30]].map(([x,y])=>`<path d="M${x},${y} V${y+4}" fill="none" stroke-width="1.2"/><path d="M${x},${y+4} Q${x-5},${y+10} ${x-2},${y+22} Q${x},${y+25} ${x+2},${y+22} Q${x+5},${y+10} ${x},${y+4}Z" fill="#b8c8d0" stroke-width="1.2"/><path d="M${x-1},${y+8} Q${x-9},${y+12} ${x-11},${y+20} Q${x-5},${y+16} ${x-1},${y+14}Z M${x+1},${y+8} Q${x+9},${y+12} ${x+11},${y+20} Q${x+5},${y+16} ${x+1},${y+14}Z" fill="#dfe8ec" stroke-width="1"/>`).join('');
/* 潛水店：木小屋＋潛水旗＋氧氣瓶＋掛著的潛水衣 */
const diveHut14=()=>sh(60,.14)+`<path d="M-50,0 V-52 H50 V0Z" fill="#3fa8a8"/><path d="M-56,-52 L-34,-80 H34 L56,-52Z" fill="#d9c07a"/><path d="M-44,-58 L-30,-76 M-24,-58 L-14,-76 M-4,-58 L2,-76 M16,-58 L18,-76 M36,-58 L32,-76" fill="none" stroke="#b8a060" stroke-width="1.4"/><rect x="-14" y="-40" width="26" height="40" fill="#7a5a3a"/><path d="M-14,-40 H12" fill="none"/><rect x="-42" y="-42" width="20" height="16" fill="#9fd8e4"/><path d="M-32,-42 V-26" fill="none" stroke-width="1.2"/>`+
 `<path d="M-58,-84 V0" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><path d="M-58,-84 V0" fill="none" stroke="#8a5a32" stroke-width="2.6" stroke-linecap="round"/><path d="M-58,-84 H-34 V-62 H-58Z" fill="#d8413a"/><path d="M-58,-62 L-34,-84" fill="none" stroke="#fbf6ea" stroke-width="5" stroke-linecap="butt"/><path d="M-58,-84 H-34 V-62 H-58Z" fill="none"/>`+
 `<rect x="26" y="-34" width="12" height="34" rx="6" fill="#f2c230"/><rect x="40" y="-30" width="12" height="30" rx="6" fill="#4f8fc4"/><path d="M28,-34 V-40 H36 V-34M42,-30 V-35 H50 V-30" fill="none" stroke-width="2"/>`+
 `<path d="M-48,-26 q-4,6 0,14 l6,0 l-1,-14Z" fill="#2b3a55"/><path d="M4,-50 L4,-44 M-4,-50 H12" fill="none" stroke-width="1.6"/>`;
/* 浴巾架（溫泉旁）：竹架上掛三條浴巾、旁邊疊木桶 */
const towelRack14=()=>sh(36,.12)+`<path d="M-32,0 L-28,-58 M32,0 L28,-58 M-30,-56 H30" fill="none" stroke="${OL}" stroke-width="6.4" stroke-linecap="round"/><path d="M-32,0 L-28,-58 M32,0 L28,-58 M-30,-56 H30" fill="none" stroke="#c9b060" stroke-width="3.6" stroke-linecap="round"/>`+
 [[-18,'#f4f0e4','#2f7fa8'],[0,'#fbe8cc','#e86a4a'],[18,'#f4f0e4','#3fa89a']].map(([x,c1,c2])=>`<path d="M${x-9},-56 H${x+9} V-14 Q${x},-10 ${x-9},-14Z" fill="${c1}"/><path d="M${x-9},-44 H${x+9} M${x-9},-36 H${x+9}" fill="none" stroke="${c2}" stroke-width="3"/>`).join('')+
 `<g transform="translate(44,0)"><path d="M-8,0 L-9,-14 H9 L8,0Z" fill="#c99a5b"/><path d="M-9,-8 H9" fill="none" stroke="#7a4a22" stroke-width="1.6"/></g>`;
/* 小艇（碼頭邊停著）：白船身藍線、船尾小馬達、氧氣瓶 */
const boat14=(fl)=>`<ellipse cx="0" cy="3" rx="56" ry="7" fill="#fff" opacity=".6" stroke="none"/><path d="M-52,-14 Q-48,2 -30,4 H34 Q50,2 56,-16 Z" fill="#fbf9f2"/><path d="M-50,-8 Q-46,-2 -30,-2 H34 Q48,-2 54,-10" fill="none" stroke="#2f7fa8" stroke-width="4"/><path d="M-52,-14 H56" fill="none" stroke-width="2.4"/><path d="M-20,-14 V-18 H24 V-14" fill="none" stroke-width="1.6"/>`+
 `<path d="M54,-14 L62,-22 V-4 L54,0Z" fill="#4a4f5c"/><path d="M62,-4 V6" fill="none" stroke-width="3"/><rect x="-36" y="-30" width="9" height="16" rx="4.4" fill="#f2c230"/><rect x="-24" y="-28" width="9" height="14" rx="4.4" fill="#4f8fc4"/><path d="M-8,-14 q6,-14 14,-14 q8,0 8,14Z" fill="#e86a4a"/>`;
/* 溫泉裡的人：頭上頂毛巾、手靠在池邊，前面一圈水波 */
const soak14=()=>`<g transform="translate(0,-6)">${peekHead(0,0,.62,true)}</g><path d="M-9,-25 Q0,-31 9,-25 L8,-21 H-8Z" fill="#fbf6ea"/><path d="M-8,-23 H8" fill="none" stroke="#2f7fa8" stroke-width="1.6"/><path d="M-22,8 Q0,16 22,8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".9"/><path d="M-16,13 Q0,19 16,13" fill="none" stroke="#c4efe2" stroke-width="2" stroke-linecap="round"/>`;
/* 浮潛的人，兩種輪流（使用者 11-18 選 A＋B）：
   A 冒出水面：頭和肩膀露出水面、紅框面鏡戴在臉上、黃管直直伸出；B 從上面看：整個人趴平、手腳張開、腳蹼打水 */
let SNK=0;
const SNTUBE=(x,y0,y1)=>`<path d="M${x},${y0} V${y1}" fill="none" stroke="${OL}" stroke-width="4.8" stroke-linecap="round"/><path d="M${x},${y0} V${y1}" fill="none" stroke="#f2c230" stroke-width="2.6" stroke-linecap="round"/>`;
const snorkUp14=(c)=>{const id='snc14_'+(SNK++),k=kid({view:'fq',pose:'up',hat:-1,skin:pk(['#b97a4e','#a8683e','#c98d5e']),hair:pk(['#2b2420','#4a3a32','#6a4a30']),top:'tee',bottom:'shorts',shirt:c,pants:'#2b3a55',mood:2});
 return `<defs><clipPath id="${id}"><rect x="-40" y="-90" width="80" height="84"/></clipPath></defs><g clip-path="url(#${id})"><g transform="translate(0,14) scale(.82)">${k}${MASKR(-40)}<path d="M-12,-36 Q-16,-34 -14,-30 M12,-36 Q16,-34 14,-30" fill="none" stroke="#2b3a55" stroke-width="2"/>${SNTUBE(13,-34,-62)}</g></g>`+
 `<ellipse cx="0" cy="-5" rx="22" ry="4.6" fill="#fff" opacity=".35" stroke="none"/><path d="M-24,-6 q6,-4 12,0 q6,4 12,0 q6,-4 12,0 q6,4 12,0" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>`};
const snorkTop14=(c)=>{const sk=pk(['#b97a4e','#a8683e','#c98d5e']),L=(d)=>`<path d="${d}" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${sk}" stroke-width="3.6" stroke-linecap="round"/>`;
 return `<ellipse cx="2" cy="2" rx="36" ry="13" fill="#a8e0e4" stroke="none" opacity=".8"/>`+L('M-6,-8 L-18,-18 M-6,8 L-18,18')+L('M12,-4 L28,-8 M12,4 L28,8')+
 `<path d="M28,-8 l10,-6 l2,6Z M28,8 l10,6 l2,-6Z" fill="#2f7fa8"/><rect x="-10" y="-9" width="24" height="18" rx="8" fill="${c}"/><circle cx="-16" cy="0" r="8" fill="#2b2a28"/><path d="M-16,-8 V8" fill="none" stroke="#e86a4a" stroke-width="3"/><circle cx="-16" cy="-8" r="3" fill="#f2c230"/>`+
 `<path d="M-32,12 q6,-4 12,0 q6,4 12,0 M8,14 q6,-4 12,0 M30,-2 q4,-3 8,0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`};
let SNALT=0;const snork14=(c)=>(SNALT++%2?snorkTop14:snorkUp14)(c);
const steam14=()=>[[-14,0,6],[2,-6,8],[16,2,6]].map(([x,y,rr])=>`<circle cx="${x}" cy="${y}" r="${rr}" fill="#fff" stroke="none" opacity=".75"/>`).join('')+`<circle cx="-4" cy="-12" r="5" fill="#fff" stroke="none" opacity=".6"/>`;
const floatLine14=()=>`<path d="M-40,2 Q-20,8 0,2 Q20,-4 40,2" fill="none" stroke="#d9c8a0" stroke-width="2.4"/>`+[-40,-20,0,20,40].map((x,i)=>`<circle cx="${x}" cy="${2+(i%2?-2:3)}" r="5.4" fill="${i%2?'#d8413a':'#fbf6ea'}" stroke-width="1.6"/>`).join('');
const benchSea14=()=>sh(30,.12)+`<path d="M-26,0 V-14 M26,0 V-14" fill="none" stroke="#7a4a22" stroke-width="4"/><rect x="-30" y="-20" width="60" height="7" rx="2" fill="#c99a5b"/><path d="M-26,-34 H26" fill="none" stroke="#7a4a22" stroke-width="4"/><path d="M-22,-34 V-20 M22,-34 V-20" fill="none" stroke="#7a4a22" stroke-width="3"/>`;

/* ================= 6b. 2026-11-26e 加寬（東西各 350）新造型：使用者從選項圖選
   西：牛頭山 C（圓丘＋觀景台＋牛頭木牌）、露營區 B（圓頂帳篷＋天幕）、花海 D（花海＋拍照木框）；小組：吃草／躺著＋白鷺鷥／站著的黃牛、牽牛阿伯、白鷺鷥、寫生的人
   東：潮池 D（長海藻的礁岩）、拱門 D（象鼻＋小洞）、半潛艇 D（雙層觀景船＋小碼頭）；小組：提水桶小孩、蹲著看海參、拿網子的人、海龜、拱門下拍照、排隊上船、售票小亭、海膽海星 ================= */
const X14=(()=>{const act=(x,y,d,o={},a)=>H.act(x,y,d,{hat:-1,...o},a);
const ROCK='#948f86',ROCKL='#b0aa9e',ROCKD='#6f6a62';
const GR='#8fb458',GRL='#a6c468',GRD='#6f9a3a';
const W1='#a8703f',W2='#c99a5b';
const post=(x,y,h=22)=>`<path d="M${x},${y} V${y-h}" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><path d="M${x},${y} V${y-h}" fill="none" stroke="${W1}" stroke-width="3.4" stroke-linecap="round"/>`;
const rail=(pts,h=22)=>pts.map(([x,y])=>post(x,y,h)).join('')+`<path d="${pts.map(([x,y],i)=>(i?'L':'M')+x+','+(y-h+4)).join(' ')}" fill="none" stroke="${W2}" stroke-width="3"/><path d="${pts.map(([x,y],i)=>(i?'L':'M')+x+','+(y-h/2)).join(' ')}" fill="none" stroke="${W2}" stroke-width="3"/>`;
const tuft=(x,y,c=GRD)=>`<path d="M${x-5},${y} q2,-8 4,-1 q2,-10 4,0 q2,-7 4,1" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`;

/* ---------- 牛（黃牛：側面、低頭吃草／抬頭、躺著） ---------- */
const cowY=(o={})=>{const c=o.c||'#c08a52',d=o.d||'#8a5a32';let s=sh(26,.12);
 if(o.lie){s+=`<path d="M-24,0 Q-28,-22 -4,-24 Q20,-26 26,-8 Q28,0 22,0Z" fill="${c}"/><path d="M-16,0 q4,-5 10,-2 M8,0 q4,-5 10,-2" fill="none" stroke="${d}" stroke-width="2.4" stroke-linecap="round"/>`+
  `<path d="M-22,-20 Q-30,-26 -34,-18" fill="none" stroke="${OL}" stroke-width="9" stroke-linecap="round"/><path d="M-22,-20 Q-30,-26 -34,-18" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/><ellipse cx="-38" cy="-16" rx="9" ry="7" fill="${c}"/><ellipse cx="-44" cy="-13" rx="4.6" ry="3.6" fill="#e8b890"/><circle cx="-37" cy="-19" r="1.4" fill="${OL}" stroke="none"/><path d="M-36,-23 q-2,-6 2,-8 M-40,-23 q-4,-4 -8,-2" fill="none" stroke="#efe6d0" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="-30" cy="-19" rx="4" ry="2" fill="${c}" transform="rotate(30 -30 -19)"/><path d="M26,-8 q8,2 6,10" fill="none" stroke="${d}" stroke-width="2"/>`;
  if(o.egret)s+=egret(4,-24);return s}
 s+=`<path d="M-15,-14 V0 M-8,-14 V0 M12,-14 V0 M18,-14 V-1" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><path d="M-15,-14 V0 M-8,-14 V0 M12,-14 V0 M18,-14 V-1" fill="none" stroke="${d}" stroke-width="3.4" stroke-linecap="round"/>`;
 s+=`<path d="M24,-30 q8,4 6,16" fill="none" stroke="${d}" stroke-width="2"/><path d="M28,-14 l2,4 l-4,-1Z" fill="${d}" stroke-width="1"/>`;
 s+=`<path d="M-22,-14 Q-24,-34 -6,-35 Q14,-36 24,-30 Q28,-20 22,-12 Q0,-9 -22,-14Z" fill="${c}"/><path d="M-12,-33 q4,4 12,2" fill="none" stroke="${d}" stroke-width="1.6"/><path d="M-6,-35 Q-2,-41 6,-36" fill="${c}"/>`;
 if(o.graze){s+=`<path d="M-18,-26 Q-28,-20 -30,-8" fill="none" stroke="${OL}" stroke-width="11" stroke-linecap="round"/><path d="M-18,-26 Q-28,-20 -30,-8" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/><ellipse cx="-32" cy="-5" rx="7.4" ry="9" fill="${c}" transform="rotate(18 -32 -5)"/><ellipse cx="-34" cy="1" rx="5" ry="3.4" fill="#e8b890"/><circle cx="-30" cy="-8" r="1.3" fill="${OL}" stroke="none"/><path d="M-27,-13 q4,-4 8,-2 M-34,-13 q-2,-5 1,-8" fill="none" stroke="#efe6d0" stroke-width="2.2" stroke-linecap="round"/>`+tuft(-40,2,'#5f8f3a')}
 else{s+=`<path d="M-18,-28 Q-26,-34 -28,-40" fill="none" stroke="${OL}" stroke-width="11" stroke-linecap="round"/><path d="M-18,-28 Q-26,-34 -28,-40" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/><ellipse cx="-32" cy="-40" rx="9" ry="7.4" fill="${c}"/><ellipse cx="-39" cy="-37" rx="4.6" ry="4" fill="#e8b890"/><circle cx="-31" cy="-43" r="1.4" fill="${OL}" stroke="none"/><path d="M-29,-47 q-1,-6 3,-8 M-35,-47 q-4,-4 -8,-2" fill="none" stroke="#efe6d0" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="-23" cy="-43" rx="5" ry="2.4" fill="${c}" transform="rotate(20 -23 -43)"/>`}
 if(o.egret)s+=egret(4,-35);if(o.bell)s+=`<circle cx="-22" cy="-30" r="2.6" fill="#f5c842" stroke-width="1.2"/>`;return s};
const egret=(x,y)=>`<g transform="translate(${x},${y})"><path d="M-2,0 V-4 M2,0 V-4" fill="none" stroke="#3a3a3a" stroke-width="1.4"/><ellipse cx="0" cy="-8" rx="7" ry="4.6" fill="#fbfbf6"/><path d="M4,-10 Q7,-16 5,-20" fill="none" stroke="${OL}" stroke-width="4.6" stroke-linecap="round"/><path d="M4,-10 Q7,-16 5,-20" fill="none" stroke="#fbfbf6" stroke-width="2.6" stroke-linecap="round"/><circle cx="5" cy="-21" r="2.6" fill="#fbfbf6"/><path d="M7,-21 l6,1 l-6,1Z" fill="#f2c230" stroke-width="1"/><circle cx="5.6" cy="-21.6" r=".6" fill="${OL}" stroke="none"/></g>`;

/* ---------- 牛頭山 A～D ---------- */
const hill=(w,h,c=GR)=>`<path d="M${-w},0 Q${-w*.7},${-h*1.05} 0,${-h} Q${w*.7},${-h*1.05} ${w},0Z" fill="${c}"/><path d="M${-w*.55},${-h*.55} Q${-w*.2},${-h*.85} ${w*.2},${-h*.82}" fill="none" stroke="${GRL}" stroke-width="6" stroke-linecap="round" opacity=".8"/>`;
const cowHeadRock=(s=1)=>`<g transform="scale(${s})"><path d="M-30,-38 Q-46,-44 -50,-60 Q-38,-54 -28,-50Z M30,-38 Q46,-44 50,-60 Q38,-54 28,-50Z" fill="#d8ccb4"/><ellipse cx="-34" cy="-34" rx="10" ry="5" fill="${ROCK}" transform="rotate(-20 -34 -34)"/><ellipse cx="34" cy="-34" rx="10" ry="5" fill="${ROCK}" transform="rotate(20 34 -34)"/><path d="M-28,0 Q-32,-26 -26,-42 Q0,-54 26,-42 Q32,-26 28,0Z" fill="${ROCK}"/><ellipse cx="0" cy="-8" rx="20" ry="11" fill="${ROCKL}"/><ellipse cx="-7" cy="-8" rx="3" ry="2.4" fill="${ROCKD}" stroke="none"/><ellipse cx="7" cy="-8" rx="3" ry="2.4" fill="${ROCKD}" stroke="none"/><circle cx="-12" cy="-30" r="3.4" fill="${ROCKD}" stroke="none"/><circle cx="12" cy="-30" r="3.4" fill="${ROCKD}" stroke="none"/><path d="M-16,-44 Q0,-50 16,-44" fill="none" stroke="${ROCKL}" stroke-width="3" stroke-linecap="round"/><path d="M-20,-48 Q-6,-56 4,-48 Q-8,-46 -20,-48Z" fill="#7fa650" stroke="none"/></g>`;
/* B：整座山就是趴著的牛頭（角是兩邊突起的山稜、眼睛是兩叢樹、鼻子是下面的岩壁） */
/* C：圓丘＋木頭觀景台（站著往下看的人）＋牛頭圖示小木牌 */
const hillC=()=>sh(120,.12)+hill(130,66)+[[-90,-18],[90,-20],[-30,-50]].map(([x,y])=>tuft(x,y)).join('')+
 `<g transform="translate(20,-62)"><rect x="-44" y="-10" width="88" height="10" fill="${W2}"/><path d="M-38,0 V18 M38,0 V18 M-14,0 V14 M14,0 V14" fill="none" stroke="${OL}" stroke-width="6"/><path d="M-38,0 V18 M38,0 V18 M-14,0 V14 M14,0 V14" fill="none" stroke="${W1}" stroke-width="3.4"/>`+
 act(-26,-10,1,{view:'bq',pose:'stand',hat:-1,top:'tee',bottom:'shorts',shirt:'#e86a4a'},'nod')+act(24,-10,-1,{view:'bq',pose:'up',hat:-1,top:'tee',bottom:'shorts',shirt:'#2f7fa8'},'nod')+rail([[-44,-10],[-15,-10],[15,-10],[44,-10]],20)+`</g>`+
 `<g transform="translate(-86,-14)">${post(0,0,34)}<rect x="-14" y="-46" width="28" height="20" rx="3" fill="#efe0c0"/><g transform="translate(0,-36) scale(.32)">${cowHeadRock(1).replace(/fill="#948f86"/g,'fill="#c08a52"')}</g></g>`;
/* D：低丘、圍欄一圈，丘頂一棵大樹，牛在樹下乘涼 */
/* ---------- 露營區 A～D（主帳篷那一組） ---------- */
const fire=()=>`<g transform="translate(0,0)"><path d="M-10,0 L9,-5 M-9,-5 L10,0" fill="none" stroke="#7a5235" stroke-width="3.4"/><g class="an a-fire" style="--d:.7s"><path d="M-7,-3 Q-9,-15 -1,-21 Q0,-13 3,-16 Q9,-10 6,-3Z" fill="#e8913a"/><path d="M-2,-4 Q-3,-10 1,-13 Q3,-8 3,-5Z" fill="#f5c842" stroke-width="1"/></g></g>`;
const tri=(c,c2)=>`<path d="M-40,0 L0,-58 L40,0Z" fill="${c}"/><path d="M-40,0 L0,-58" fill="none"/><path d="M0,-58 L-10,0 H10Z" fill="#3a2a22"/><path d="M0,-58 L-14,0 L-6,0 Z" fill="${c2}"/><path d="M0,-58 V-66" fill="none" stroke-width="2.4"/><path d="M-40,0 l-10,4 M40,0 l10,4" fill="none" stroke="#d9c8a0" stroke-width="1.4"/>`;
const dome=(c,c2)=>`<path d="M-46,0 Q-46,-50 0,-52 Q46,-50 46,0Z" fill="${c}"/><path d="M-46,0 Q-20,-60 30,-44 M46,0 Q20,-60 -30,-44" fill="none" stroke="${c2}" stroke-width="2.6"/><path d="M-14,0 Q-14,-30 0,-30 Q14,-30 14,0Z" fill="#3a2a22"/><path d="M-14,0 Q-14,-30 0,-30 L-6,0Z" fill="${c2}"/>`;
const chair=(c)=>`<path d="M-8,0 L6,-12 M8,0 L-6,-12" fill="none" stroke="#5a5a5a" stroke-width="2"/><path d="M-9,-12 H9 L10,-26 H-8Z" fill="${c}"/>`;
const campB=()=>sh(80,.12)+`<path d="M-70,-62 L60,-70 L56,-28 L-74,-24Z" fill="#f2c230"/><path d="M-70,-62 L60,-70" fill="none"/>`+[[-74,-24],[56,-28]].map(([x,y])=>`<path d="M${x},${y} V8" fill="none" stroke="#5a5a5a" stroke-width="2.4"/>`).join('')+`<path d="M60,-70 L78,6 M-70,-62 L-86,6" fill="none" stroke="#d9c8a0" stroke-width="1.2"/>`+
 T(-30,4,1,dome('#3fa89a','#2f7a72'))+T(30,8,1,chair('#2f7fa8'))+act(30,2,-1,{view:'fq',pose:'sit',top:'tee',bottom:'shorts',shirt:'#e86a9a'},'nod')+T(56,8,1,chair('#e86a4a'))+`<rect x="40" y="-14" width="0" height="0"/>`;
/* ---------- 花海 A～D ---------- */
const gaill=(x,y)=>{const c=pk(['#d8413a','#e8603a','#c43a3a']);return `<g transform="translate(${x},${y})"><path d="M0,0 V-14" fill="none" stroke="#4f8a3a" stroke-width="1.6"/><circle cy="-15" r="5.4" fill="${c}" stroke-width="1.2"/><circle cy="-15" r="3.4" fill="#f5c842" stroke="none"/><circle cy="-15" r="1.8" fill="#9a4a2a" stroke="none"/></g>`};
const wild=(x,y)=>{const c=pk(['#f0a8c8','#c58be0','#fbf6ea','#f5c842','#8fc4e8']);return `<g transform="translate(${x},${y})"><path d="M0,0 V-12" fill="none" stroke="#4f8a3a" stroke-width="1.5"/>${[0,1,2,3,4].map(i=>{const a=i*1.2566;return `<circle cx="${(Math.cos(a)*3).toFixed(1)}" cy="${(-12+Math.sin(a)*3).toFixed(1)}" r="2.4" fill="${c}" stroke-width=".9"/>`}).join('')}<circle cy="-12" r="1.5" fill="#f5c842" stroke="none"/></g>`};
const patch=(w,h,c)=>`<ellipse cx="0" cy="-${h/2}" rx="${w}" ry="${h/2}" fill="${c}" stroke="none" opacity=".8"/>`;
const field=(fn,w=110,h=60,n=34)=>{let s='',pts=[];for(let i=0;i<n;i++){const t=i/n;pts.push([-w+((i*37)%100)/100*2*w,-((i*53)%100)/100*h])}pts.sort((a,b)=>a[1]-b[1]);pts.forEach(([x,y])=>{if((x/w)**2+((y+h/2)/(h/2))**2<1.05)s+=fn(x,y)});return s};
const flowerD=()=>patch(120,64,'#b0cc6c')+field((x,y)=>(Math.abs(x)<34&&y>-40)?'':((x*7+y*3)%3<1?gaill(x,y):wild(x,y)),116,60,46)+`<g transform="translate(0,-10)">${post(-30,0,62)}${post(30,0,62)}<rect x="-34" y="-64" width="68" height="44" rx="5" fill="none" stroke="${OL}" stroke-width="9"/><rect x="-34" y="-64" width="68" height="44" rx="5" fill="none" stroke="${W2}" stroke-width="5"/>${[[-34,-64],[34,-64],[-34,-20],[34,-20]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#f0a8c8" stroke-width="1.2"/>`).join('')}</g>`+act(-8,-4,1,{view:'fq',pose:'up2',top:'tee',bottom:'shorts',shirt:'#3fa89a'},'hop')+act(70,12,-1,{view:'side',pose:'hold',top:'tank',bottom:'shorts',shirt:'#2f7fa8',extra:`<rect x="8" y="-34" width="7" height="11" rx="1.6" fill="#2b3a55" stroke-width="1.2"/>`},false);

/* ---------- 西邊可複選的小組 ---------- */
const herder=()=>act(-20,0,1,{view:'side',pose:'reach',hat:1,top:'tee',bottom:'pants',shirt:'#e8d6b0',pants:'#5a86b0',beard:true,hair:'#bdb8b0'},'step')+`<path d="M-6,-16 Q8,-6 22,-34" fill="none" stroke="#a8703f" stroke-width="1.6"/>`+T(34,0,.9,cowY({}));
const sketch=()=>act(0,0,1,{view:'side',pose:'hold',top:'tee',bottom:'pants',shirt:'#7a5fb0',pants:'#2b3a55',hat:1},'nod')+`<g transform="translate(24,0)"><path d="M-8,0 L0,-34 L8,0 M0,-34 V0" fill="none" stroke="${W1}" stroke-width="2.2"/><rect x="-10" y="-36" width="20" height="16" fill="#fbf9f2" stroke-width="1.4"/><path d="M-6,-26 q3,-6 6,0 q3,-4 6,0" fill="none" stroke="#d8413a" stroke-width="1.4"/></g>`;
const egrets=()=>T(-10,0,1,egret(0,0))+T(12,4,1,egret(0,0)+'',true)+T(30,-2,1,egret(0,0));

/* ---------- 東：潮池 A～D ---------- */
const reefFlat=(w,h,c='#8a8278')=>`<path d="M${-w},0 Q${-w-6},${-h*.6} ${-w*.7},${-h} Q0,${-h*1.2} ${w*.7},${-h} Q${w+6},${-h*.6} ${w},0 Q0,${h*.3} ${-w},0Z" fill="${c}"/>`;
const pool=(x,y,rx,ry)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#6fbcc9"/><ellipse cx="${x-rx*.2}" cy="${y-ry*.2}" rx="${rx*.6}" ry="${ry*.5}" fill="#a6dfdc" stroke="none"/>`;
const urchin=(x,y)=>`<g transform="translate(${x},${y})">${[0,1,2,3,4,5,6,7].map(i=>{const a=i*.785;return `<path d="M0,0 L${(Math.cos(a)*7).toFixed(1)},${(Math.sin(a)*5).toFixed(1)}" stroke="#2b2a40" stroke-width="1.3"/>`}).join('')}<circle r="3.4" fill="#3a2a5a" stroke="none"/></g>`;
const star=(x,y,c='#f08a30')=>`<path transform="translate(${x},${y}) scale(.5)" d="M0,-10 L3,-3 L10,-3 L4,2 L7,10 L0,5 L-7,10 L-4,2 L-10,-3 L-3,-3Z" fill="${c}" stroke-width="2"/>`;
const crabS=(x,y)=>`<g transform="translate(${x},${y})"><ellipse cx="0" cy="-3" rx="6" ry="4" fill="#d8413a" stroke-width="1.2"/><path d="M-6,-4 l-4,-4 M6,-4 l4,-4 M-4,0 l-4,2 M4,0 l4,2" stroke="#d8413a" stroke-width="1.6" fill="none"/><circle cx="-2" cy="-7" r="1" fill="${OL}" stroke="none"/><circle cx="2" cy="-7" r="1" fill="${OL}" stroke="none"/></g>`;
const cuc=(x,y)=>`<g transform="translate(${x},${y})"><path d="M-8,0 Q-9,-5 -3,-5 H5 Q9,-5 8,0 Q0,2 -8,0Z" fill="#5a3a2a" stroke-width="1.2"/><circle cx="-3" cy="-3" r=".8" fill="#c9a07a" stroke="none"/><circle cx="2" cy="-3.4" r=".8" fill="#c9a07a" stroke="none"/></g>`;
const tideD=()=>sh(120,.1)+reefFlat(126,42,'#7e8a6c')+`<path d="M-110,-20 q20,-14 40,-6 q14,-14 34,-4 M10,-30 q20,-10 40,0 q14,-8 34,4" fill="none" stroke="#5f9a4a" stroke-width="6" stroke-linecap="round" opacity=".8"/>`+pool(-40,-14,30,9)+pool(40,-20,26,8)+cuc(-44,-14)+star(42,-20)+crabS(86,-10)+
 act(10,4,-1,{view:'fq',pose:'hold',top:'tee',bottom:'shorts',shirt:'#7a5fb0',extra:`<path d="M10,-16 L28,-40" stroke="#a8703f" stroke-width="2" fill="none"/><ellipse cx="30" cy="-44" rx="7" ry="5" fill="none" stroke="#fbf6ea" stroke-width="1.6"/>`},'nod');

/* ---------- 東：海蝕拱門 A～D（下半泡在水裡的畫法：水面線＋浪花） ---------- */
const splash=(w)=>`<path d="M${-w},2 q8,-5 16,0 q8,5 16,0 M${w-32},4 q8,-5 16,0 q8,5 16,0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`;
const archD=()=>sh(120,.12)+`<path d="M-120,0 Q-128,-70 -84,-96 Q-30,-120 20,-108 Q70,-96 96,-60 Q112,-36 104,0 H80 Q78,-30 66,-30 Q56,-30 54,0 H18 Q16,-56 -14,-58 Q-44,-58 -48,0Z" fill="${ROCK}"/><path d="M96,-60 Q118,-52 122,-20 Q124,-4 116,0 H104" fill="${ROCK}"/>`+
 `<path d="M-48,0 Q-44,-58 -14,-58 Q16,-56 18,0Z M54,0 Q56,-30 66,-30 Q78,-30 80,0Z" fill="#6fbcc9" opacity=".85"/><path d="M-100,-70 Q-70,-100 -20,-104" fill="none" stroke="${ROCKL}" stroke-width="4" stroke-linecap="round"/><circle cx="-76" cy="-74" r="4" fill="${ROCKD}" stroke="none"/>`+splash(110);

/* ---------- 東：半潛艇 A～D（停在小碼頭邊） ---------- */
const dock=()=>`<rect x="-120" y="-10" width="70" height="14" fill="${W2}"/><path d="M-120,-3 H-50" fill="none" stroke="#8a5a32" stroke-width="1.2"/>${[-112,-84,-58].map(x=>`<path d="M${x},4 V18" fill="none" stroke="${OL}" stroke-width="6"/><path d="M${x},4 V18" fill="none" stroke="#7a4a22" stroke-width="3.4"/>`).join('')}`;
const wins=(xs,y,r=6)=>xs.map(x=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#9fe0f0"/><circle cx="${x-2}" cy="${y-2}" r="${r*.35}" fill="#fff" stroke="none"/>`).join('');
const subD=()=>dock()+`<g transform="translate(30,0)" class="an a-rock" style="--d:3s"><path d="M-80,-20 H80 L70,6 Q0,14 -70,6Z" fill="#fbf9f2"/><path d="M-78,-12 H78 M-74,-4 H74" fill="none" stroke="#2f7fa8" stroke-width="3"/>${wins([-50,-24,2,28,54],2,5)}<rect x="-60" y="-48" width="110" height="28" rx="4" fill="#3fa8a8"/>${[-48,-26,-4,18,40].map(x=>`<rect x="${x-7}" y="-42" width="14" height="12" rx="2" fill="#9fe0f0"/>`).join('')}<path d="M-64,-48 H54 M-64,-58 H54" fill="none" stroke-width="2"/><path d="M-60,-58 V-48 M-30,-58 V-48 M0,-58 V-48 M30,-58 V-48" fill="none" stroke-width="1.6"/>`+act(-30,-50,1,{view:'fq',pose:'up2',top:'tee',bottom:'shorts',shirt:'#e86a4a',s:.8},'hop')+act(20,-50,-1,{view:'fq',pose:'stand',top:'tee',bottom:'shorts',shirt:'#f2c230',s:.8},'nod')+`</g>`+splash(130);

/* ---------- 東邊可複選 ---------- */
const kidPail=()=>act(0,0,1,{view:'side',pose:'hold',top:'tee',bottom:'shorts',shirt:'#e86a9a',s:.82,extra:`<path d="M12,-16 v8 h10 v-8" fill="#2f7fa8" stroke-width="1.4"/><path d="M12,-16 q5,-6 10,0" fill="none" stroke-width="1.2"/>`},'step')+crabS(30,0);
const crouchLook=()=>act(-12,0,1,{view:'side',pose:'crouch',top:'tee',bottom:'shorts',shirt:'#3fa89a',hat:1},'nod')+act(14,0,-1,{view:'fq',pose:'crouch',top:'tank',bottom:'shorts',shirt:'#f2c230'},'nod')+cuc(2,2);
const queue=()=>[-30,-10,10,30].map((x,i)=>act(x,0,1,{view:'side',pose:'stand',top:'tee',bottom:'shorts',shirt:pk(['#e86a4a','#2f7fa8','#f2c230','#3fa89a','#7a5fb0'])},'nod')).join('');
const kiosk=()=>sh(30,.12)+`<rect x="-24" y="-40" width="48" height="40" fill="#3fa8a8"/><rect x="-16" y="-32" width="32" height="16" fill="#bfe6ef"/><path d="M-30,-40 L-24,-54 H24 L30,-40Z" fill="#fbf6ea"/>${[-20,-6,8].map(x=>`<path d="M${x},-54 L${x+7},-40 H${x-7}Z" fill="#2f7fa8" stroke="none"/>`).join('')}<path d="M-30,-40 L-24,-54 H24 L30,-40Z" fill="none"/><g transform="translate(0,-8) scale(.5)"><path d="M-12,4 Q-14,-10 0,-10 Q14,-10 12,4Z" fill="#f2c230"/>${wins([-5,5],-2,2.4)}</g>`;
const turtleSea=()=>`<ellipse cx="0" cy="0" rx="30" ry="10" fill="#6fbcc9" stroke="none" opacity=".7"/><g transform="translate(0,-4)"><path d="M-10,-4 L-22,-12 L-18,-2Z M10,-4 L22,-12 L18,-2Z M-8,6 L-16,12 L-10,4Z M8,6 L16,12 L10,4Z" fill="#7ac08a"/><ellipse cx="0" cy="0" rx="13" ry="10" fill="#4f9a5f"/><path d="M-6,-5 H6 L9,0 L6,5 H-6 L-9,0Z" fill="none" stroke="#2f6f43" stroke-width="1.2"/><circle cx="0" cy="-12" r="4.6" fill="#7ac08a"/></g><path d="M-28,6 q6,-4 12,0 M16,8 q6,-4 12,0" fill="none" stroke="#fff" stroke-width="1.8"/>`;
const archPhoto=()=>act(-14,0,1,{view:'fq',pose:'up2',top:'tee',bottom:'shorts',shirt:'#e86a9a'},'hop')+act(6,0,1,{view:'fq',pose:'up',top:'tee',bottom:'shorts',shirt:'#2f7fa8'},'hop')+act(46,0,-1,{view:'side',pose:'hold',top:'tank',bottom:'shorts',shirt:'#f2c230',extra:`<rect x="8" y="-34" width="7" height="11" rx="1.6" fill="#2b3a55" stroke-width="1.2"/>`},false);
const netGuy=()=>act(0,0,1,{view:'side',pose:'hold',top:'tee',bottom:'shorts',shirt:'#7a5fb0',hat:1,extra:`<path d="M12,-18 L34,-46" stroke="#a8703f" stroke-width="2" fill="none"/><path d="M30,-48 q8,-4 10,6 q-6,6 -12,0Z" fill="#fbf6ea" stroke-width="1.2" opacity=".9"/>`},'nod');

return {cowY,egret,hillC,campB,flowerD,herder,sketch,egrets,tideD,archD,subD,kidPail,crouchLook,netGuy,turtleSea,archPhoto,queue,kiosk,urchin,star,crabS}})();
/* ---- 人群小故事（每組點了說一句話）---- */
const sh14=(w,o=.12)=>`<ellipse cx="2" cy="2" rx="${w}" ry="6" fill="#000" opacity="${o}" stroke="none"/>`;
const say=(t,inner)=>`<g data-say="${t}">${inner}</g>`;
const phone=`<rect x="8" y="-34" width="7" height="11" rx="1.6" fill="#2b3a55" stroke-width="1.2"/><rect x="9.4" y="-32.6" width="4.2" height="7" fill="#9fe0f0" stroke="none"/>`;
/* 海邊拍照：一個人在礁岩前擺姿勢，另一個人舉手機蹲著拍 */
const photoG=()=>say('📸 拍到了嗎？浪花要再高一點！',sh14(46)+T(-6,0,1,`<path d="M-26,0 Q-28,-14 -14,-18 Q2,-22 12,-12 Q18,-4 16,0Z" fill="#7e766c" stroke="${OL}"/>`)+act(-8,-12,1,{view:'fq',pose:'up2',top:'tee',bottom:'shorts',shirt:'#e86a4a',pants:'#2b3a55',hat:1,mood:2},'hop')+act(32,0,-1,{view:'side',pose:'hold',extra:phone,top:'tank',bottom:'shorts',shirt:'#2f7fa8',pants:'#c9a46a',hat:HAT_M},'nod'));
/* 餵鹿：小孩伸手遞嫩葉，小鹿低頭來吃 */
const feedG=()=>say('🦌 慢慢來～牠會自己走過來的。',sh14(50)+act(-22,0,1,{view:'side',pose:'reach',top:'tee',bottom:'shorts',shirt:'#f2c230',pants:'#5a86b0',hat:-1,mood:2,extra:`<path d="M14,-22 q6,-8 12,-2 q-6,6 -12,2Z" fill="#6fb85a" stroke-width="1.2"/>`},'nod')+T(24,0,1,deerS({graze:false,antler:false}),true));
/* 曬飛魚乾：民宿阿姨把魚一條條夾上架 */
const driedG=()=>say('🐟 今天的太陽剛剛好，魚乾曬得香～',sh14(36)+act(-14,0,1,{view:'side',pose:'reach',top:'tee',bottom:'pants',shirt:'#e86a9a',pants:'#8a6a4a',hat:1,hair:'#4a3a32',mood:2,extra:`<path d="M14,-34 q4,-3 8,0 q-4,3 -8,0Z" fill="#b8c8d0" stroke-width="1"/>`},'nod')+`<g transform="translate(26,4)"><rect x="-8" y="-12" width="16" height="12" rx="2" fill="${WOOD2}"/><path d="M-5,-12 q2,-5 5,-2 q3,-3 5,2" fill="#b8c8d0" stroke-width="1.2"/></g>`);
/* 浮潛課：教練拿面鏡示範，兩位學員跟著比 */
const lessonG=()=>say('🤿 面鏡要貼緊，呼吸慢慢來。',sh14(50)+act(-26,0,1,{view:'fq',pose:'hold',top:'tee',bottom:'shorts',shirt:'#2b3a55',pants:'#2b3a55',hat:-1,hair:'#2b2420',mood:2,extra:`<g transform="translate(14,-26) scale(.7)">${ART.mask14}</g>`},'nod')+act(8,6,-1,{view:'back',pose:'hold',top:'tee',bottom:'shorts',shirt:'#e86a4a',pants:'#d8413a',hat:HAT_M},'nod')+act(32,2,-1,{view:'bq',pose:'up',top:'tank',bottom:'shorts',shirt:'#3fa89a',pants:'#2f4f7a',hat:HAT_M},'nod'));
/* 堆沙燈塔：小孩堆了一座沙燈塔，爸爸在旁邊挖護城河 */
const sandG=()=>say('🏖️ 這是燈塔！旁邊還要挖一條護城河。',sh14(50)+`<path d="M-8,0 L-5,-24 H5 L8,0Z" fill="#efdcae"/><path d="M-6,-12 H6" fill="none" stroke="#c9a868" stroke-width="1.4"/><path d="M-6,-24 H6 L4,-32 H-4Z" fill="#e3cb92"/><path d="M-26,0 Q0,10 26,0" fill="none" stroke="#c9a868" stroke-width="2.4" stroke-dasharray="4 4"/>`+act(-30,0,1,{view:'side',pose:'crouch',top:'bare',bottom:'trunks',pants:'#d8413a',hat:-1,mood:2},'bend')+act(30,2,-1,{view:'side',pose:'crouch',top:'tee',bottom:'shorts',shirt:'#2f7fa8',pants:'#c9a46a',hat:1},'bend'));
/* 泡湯：兩個人泡在池裡看海 */
const onsenG=()=>say('♨️ 泡著湯看海，什麼煩惱都沒了～',`<g transform="translate(-30,0)">${soak14()}</g><g transform="translate(30,6)">${soak14()}</g>`);

/* ---- 佈景圖鑑（KIND）---- */
const dk=(id,w,h,cy=-12)=>({w,h,fn:()=>T(0,cy,1,DECOY[id])});
const INNC=[['#f6e4c4','#2f7fa8'],['#c9e6ee','#e86a4a'],['#f6d9c8','#3fa89a'],['#f1ecd0','#d8413a']];
Object.assign(KIND,{
 palm14:{w:56,h:100,fn:()=>palm14()},hibiscus14:{w:46,h:36,fn:hibiscus14},rock14s:{w:44,h:20,fn:rock14s},reefRock14:{w:80,h:36,fn:reefRock14},
 dogRock14:{w:210,h:116,fn:dogRock14},sleeperRock14:{w:264,h:70,fn:sleeperRock14},
 deer14:{w:60,h:60,fn:()=>deerS({graze:r()<.5,antler:r()<.4})},
 lighthouse14:{w:90,h:250,fn:lighthouse14},inn14:{w:132,h:134,fn:()=>{const c=pk(INNC);return inn14(c[0],c[1])}},scooterRow14:{w:112,h:42,fn:scooterRow14},rentStand14:{w:84,h:60,fn:rentStand14},
 fishRack14:{w:76,h:64,fn:fishRack14},diveHut14:{w:116,h:96,fn:diveHut14},towelRack14:{w:70,h:60,fn:towelRack14},boat14:{w:120,h:34,fn:()=>boat14()},benchSea14:{w:64,h:36,fn:benchSea14},
 snork14:{w:64,h:40,fn:()=>snork14(pk(['#2f7fa8','#e86a4a','#3fa89a','#f2c230','#7a5fb0'])),water:true},steam14:{w:44,h:30,fn:steam14},floatLine14:{w:88,h:16,fn:floatLine14},
 goggles14:dk('goggles14',40,22,0),balloon14:dk('balloon14',30,40,-4),lamb14:dk('lamb14',36,36,-4),mat14:dk('mat14',40,24,0),leaf14:dk('leaf14',38,30,0),mushroom14:dk('mushroom14',40,32,-4),
 keys14:dk('keys14',34,36,-4),slipper14:dk('slipper14',38,26,0),salt14:dk('salt14',22,30,-2),toothpaste14:dk('toothpaste14',46,32,0),
 /* 2026-11-26e 加寬區 */cowG14:{w:70,h:44,fn:()=>X14.cowY({graze:true,c:pk(['#c08a52','#b07a48','#d09a60'])})},cowS14:{w:70,h:56,fn:()=>X14.cowY({bell:r()<.5,c:pk(['#c08a52','#b07a48','#d09a60'])})},cowL14:{w:78,h:40,fn:()=>X14.cowY({lie:true,egret:r()<.6})},egrets14:{w:56,h:30,fn:X14.egrets}});
['inn14','lighthouse14','dogRock14','sleeperRock14','palm14','diveHut14','boat14','reefRock14','fishRack14','cowHill14','camp14','arch14','sub14','tide14','flowerField14'].forEach(k=>H.HEAVYX[N]?H.HEAVYX[N].add(k):(H.HEAVYX[N]=new Set([k])));
['hibiscus14','reefRock14','inn14','diveHut14','rentStand14','towelRack14','benchSea14'].forEach(k=>H.OCCK.add(k));
H.ANIMX[N]={palm14:['sway'],boat14:['rock'],snork14:['bob','rock'],steam14:['bob']};
H.ALWAYSX[N]=new Set(['boat14','snork14','steam14']);

/* ================= 7. 區域、擺放、人數 ================= */
const late=()=>{ /* 第 5 關的 kind（陽傘、沙堡、日光浴…）在畫場景時才確認有沒有載入 */
 const ok=l=>l.filter(([k])=>KIND[k]);
 Object.assign(POOL,{
  cliff14:ok([['hibiscus14',1],['rock14s',1.2],['palm14',.5],['grassClump',1.5],['pebbles',.8],['benchSea14',.2],['balloon14',.25],['salt14',.25],['leaf14',.2]]),
  meadow14:ok([['deer14',1.1],['rock14s',1],['hibiscus14',.5],['grassClump',2],['palm14',.3],['lamb14',.35],['leaf14',.3],['mushroom14',.3],['pebbles',.6]]),
  grove14:ok([['palm14',1.6],['hibiscus14',1.2],['rock14s',.6],['grassClump',1.4],['deer14',.25],['leaf14',.3],['lamb14',.3],['salt14',.2],['mushroom14',.25]]),
  onsen14:ok([['reefRock14',.8],['rock14s',1],['towelRack14',.15],['hibiscus14',.5],['pebbles',.8],['crab',.5],['gull',.4],['mat14',.3],['slipper14',.35],['toothpaste14',.25],['goggles14',.2]]),
  street14:ok([['hibiscus14',1],['palm14',.6],['crate',.5],['barrel',.5],['pot',.5],['cat',.4],['dog',.3],['mat14',.3],['slipper14',.35],['keys14',.35],['salt14',.3],['toothpaste14',.3],['goggles14',.25],['balloon14',.25],['lamb14',.25],['leaf14',.2]]),
  beach14:ok([['parasol',1.4],['sandcastle',.5],['shells',.9],['crab',.7],['gull',.5],['reefRock14',.4],['palm14',.4],['mat14',.3],['slipper14',.4],['toothpaste14',.3],['goggles14',.35],['balloon14',.3],['keys14',.25]]),
  decor14:ok([['hibiscus14',1.4],['rock14s',1],['palm14',.5],['grassClump',1.4],['pebbles',.8]]),
  /* 2026-11-26e 加寬區：兩側也要有干擾物和可以遮住物件的花叢、礁石（干擾物權重：西 ×2.6、東 ×1.8） */
  flowerW14:ok([['hibiscus14',1.4],['grassClump',1],['rock14s',.5],['leaf14',1.17],['mushroom14',0.91],['lamb14',0.91],['balloon14',0.78],['keys14',0.78]]),
  hillW14:ok([['hibiscus14',1.2],['grassClump',1.4],['rock14s',.8],['cowG14',.35],['egrets14',.2],['lamb14',1.3],['leaf14',1.04],['mushroom14',1.04],['salt14',0.78],['slipper14',0.78]]),
  campW14:ok([['hibiscus14',1.3],['palm14',.4],['grassClump',.8],['rock14s',.5],['mat14',1.17],['slipper14',1.04],['toothpaste14',1.04],['goggles14',0.78],['keys14',0.78],['balloon14',0.78],['salt14',0.78]]),
  archE14:ok([['hibiscus14',1],['reefRock14',.8],['rock14s',.8],['grassClump',.8],['goggles14',0.72],['balloon14',0.63],['salt14',0.54],['keys14',0.54],['leaf14',0.54]]),
  tideE14:ok([['reefRock14',1.4],['rock14s',.8],['crab',.5],['gull',.3],['goggles14',0.9],['slipper14',0.72],['mat14',0.63],['toothpaste14',0.63],['keys14',0.54]]),
  subE14:ok([['reefRock14',.9],['hibiscus14',.8],['rock14s',.6],['crate',.3],['barrel',.3],['goggles14',0.9],['toothpaste14',0.63],['keys14',0.54],['balloon14',0.63],['mat14',0.54]])});
 const v=o=>Object.fromEntries(Object.entries(o).filter(([k])=>KIND[k]));
 Object.assign(VPLAN,{cliff14:v({walker:5,chat:5,handInHand:2,reading:2,painting:1,benchPair:1}),meadow14:v({walker:4,chat:3,petDog:1,reading:1,sleeping:1}),
  grove14:v({walker:5,chat:4,reading:2,sleeping:1,benchPair:1,handInHand:1}),onsen14:v({walker:4,chat:3,stretch:1,sunbathe:1}),
  street14:v({walker:7,chat:6,carryBox:2,handInHand:2,benchPair:1,iceBuy:1}),beach14:v({sunbathe:3,sandPlay:1,beachBall:1,shellPick:2,walker:5,chat:3,iceBuy:1,handInHand:2}),
  flowerW14:v({walker:2,chat:1,handInHand:1}),hillW14:v({walker:2,chat:1}),campW14:v({walker:2,chat:2,reading:1}),archE14:v({walker:2,chat:1}),tideE14:v({walker:2,shellPick:1}),subE14:v({walker:2,chat:2})})};

function structures(){
 late();skyBirds(N);
 /* 北：海崖小路上的白色燈塔、崖邊長椅 */
 add(LH.x,LH.y,90,250,'lighthouse14',lighthouse14(),{sh:.9});
 [[1100,598],[1330,590]].forEach(([x,y],i)=>add(x,y,64,36,'benchSea14',benchSea14(),{fl:!!i}));
 /* 西：像狗的大岩石、像睡美人的長岩石，鹿群 */
 add(DOG.x,DOG.y,210,116,'dogRock14',dogRock14(),{sh:.9});
 add(SLEEP.x,SLEEP.y,264,70,'sleeperRock14',sleeperRock14(),{sh:.9});
 [[760,1010,0,1],[1010,1040,1,0],[780,1300,0,0],[1030,1330,1,1],[800,1560,0,0],[1050,1230,1,0]].forEach(([x,y,fl,a])=>add(x,y,60,60,'deer14',deerS({graze:!a&&r()<.6,antler:!!a}),{fl:!!fl}));
 /* 東：礁石間的露天溫泉（池子在 ground 畫，這裡放浴巾架、礁石、蒸氣、泡湯的人） */
 add(1590,1130,70,60,'towelRack14',towelRack14());
 add(POOLC.x,POOLC.y+10,120,50,'onsenG14',onsenG(),{mark:true});
 [[1650,1196],[1720,1192],[1690,1308]].forEach(([x,y])=>add(x,y,44,30,'steam14',steam14(),{mark:false}));
 [[1790,1100,0],[1796,1400,1],[1774,1520,0]].forEach(([x,y,fl])=>add(x,y,80,36,'reefRock14',reefRock14(),{fl:!!fl,sh:.8}));
 add(1780,1560,90,70,'photoG14',photoG());
 /* 南：民宿小街（北側一排民宿，南側機車出租和飛魚乾攤） */
 [[830,1716,0],[1000,1722,1],[1520,1716,2],[1690,1722,3]].forEach(([x,y,i])=>{const c=INNC[i];add(x,y,132,134,'inn14',inn14(c[0],c[1]),{sh:.9})});
 add(1130,1722,76,64,'fishRack14',fishRack14());add(1130,1800,70,56,'driedG14',driedG());
 add(1394,1722,84,60,'rentStand14',rentStand14());add(1420,1812,112,42,'scooterRow14',scooterRow14());
 /* 南：浮潛沙灘、潛水店、堆沙、浮潛課、碼頭小艇、海裡浮潛的人 */
 add(1580,1940,116,96,'diveHut14',diveHut14(),{sh:.9});
 add(980,1960,110,70,'lessonG14',lessonG());add(1420,1992,100,60,'sandG14',sandG());
 add(PIER.x-86,2088,120,34,'boat14',boat14(),{mark:false});add(PIER.x+92,2102,120,34,'boat14',boat14(),{mark:false,fl:true});
 add(800,2090,88,16,'floatLine14',floatLine14(),{mark:false});
 [[760,2066],[860,2112],[960,2090],[1560,2070],[1700,2040],[1640,2108]].forEach(([x,y])=>add(x,y,64,40,'snork14',snork14(pk(['#2f7fa8','#e86a4a','#3fa89a','#f2c230','#7a5fb0'])),{mark:false}));
 /* 2026-11-26e 加寬區（使用者從選項圖選）。西北：花海＋拍照木框、寫生的人 */
 add(560,800,250,80,'flowerField14',X14.flowerD(),{sh:.6});add(440,884,60,64,'sketch14',X14.sketch());
 /* 西：牛頭山草原（圓丘＋觀景台＋牛頭木牌），黃牛、牽牛阿伯、白鷺鷥 */
 add(520,1170,270,140,'cowHill14',X14.hillC(),{sh:.8});
 add(640,1330,96,60,'herder14',X14.herder());
 [[410,1020,0,'g'],[670,1050,1,'g'],[700,1250,0,'l'],[380,1270,1,'s'],[430,1390,0,'g']].forEach(([x,y,fl,t])=>add(x,y,74,50,t==='l'?'cowL14':t==='s'?'cowS14':'cowG14',t==='l'?X14.cowY({lie:true,egret:true}):t==='s'?X14.cowY({bell:true}):X14.cowY({graze:true}),{fl:!!fl,sh:.6}));
 add(560,1400,56,30,'egrets14',X14.egrets());
 /* 西南：露營區（圓頂帳篷＋天幕） */
 add(560,1640,180,90,'camp14',X14.campB(),{sh:.8});
 /* 東北：象鼻岩（一半泡在海裡）、岩前拍照的人 */
 add(2130,830,240,130,'arch14',X14.archD(),{sh:.6});add(1990,880,90,64,'archPhoto14',X14.archPhoto());
 /* 東：潮間帶（長海藻的礁岩）、提水桶小孩、蹲著看海參、拿網子的人、海裡的海龜 */
 add(2040,1170,250,56,'tide14',X14.tideD(),{sh:.5});add(2060,1430,250,56,'tide14',X14.tideD(),{fl:true,sh:.5});
 add(1960,1300,60,50,'kidPail14',X14.kidPail());add(2110,1300,60,50,'crouch14',X14.crouchLook());add(1950,1500,60,60,'net14',X14.netGuy());
 [[2232,1150],[2214,1660]].forEach(([x,y],i)=>add(x,y,60,24,'turtleSea14',X14.turtleSea(),{mark:false,fl:!!i}));
 add(2010,1240,40,20,'urchin14',X14.urchin(-10,0)+X14.star(10,-2)+X14.crabS(26,2),{mark:false});
 /* 東南：半潛艇（雙層觀景船＋小碼頭）、排隊上船、售票小亭 */
 add(2080,1950,240,80,'sub14',X14.subD(),{mark:false});add(1930,1900,80,56,'queue14',X14.queue());add(1860,1860,60,60,'kiosk14',X14.kiosk());
 /* 小故事要放的固定位置先佔好 */
 mark(DOG.x+46,DOG.y-72,60,40,1);mark(960,1788,40,64,1);mark(1330,1806,40,64,1);
 for(let i=0;i<14;i++){const x=sr(1140,1460),y=sr(960,1560);if(canPlace(x,y,56,100,false,.7)&&!inPool(x,y))add(x,y,56,100,'palm14',palm14(),{sh:.8})}
}
function scatterAll(){
 const S=H.dbg.storySp();
 if(S){moveSp(S.giver,[960,1790]);moveSp(S.target,[DOG.x+46,DOG.y-72]);moveSp(S.helper,[1330,1812])}
 scatter('cliff14',POOL.cliff14,3000,50);scatter('meadow14',POOL.meadow14,3600,60);scatter('grove14',POOL.grove14,3600,60);scatter('onsen14',POOL.onsen14,3000,50);
 scatter('street14',POOL.street14,3200,52);scatter('beach14',POOL.beach14,3400,52);
 scatter('flowerW14',POOL.flowerW14,1600,14);scatter('hillW14',POOL.hillW14,1800,16);scatter('campW14',POOL.campW14,1800,15);
 scatter('archE14',POOL.archE14,1600,11);scatter('tideE14',POOL.tideE14,1800,13);scatter('subE14',POOL.subE14,1600,11);
 scatter('all14',POOL.decor14,6000,60); /* 2026-11-26e 加寬：90→60，兩側自己有區域 */
}
function moveSp(sp,p){if(!sp||!p)return;sp.svg=sp.svg.replace(/translate\([^)]*\)/,`translate(${f(p[0])},${f(p[1])})`).replace(/data-x="[^"]*" data-y="[^"]*"/,`data-x="${f(p[0])}" data-y="${f(p[1])}"`);sp.x=p[0];sp.y=p[1]}
SCENE_IMPL[N]={ground,structures,scatter:scatterAll};
Object.assign(HOSTN,{palm14:'椰子樹',hibiscus14:'朱槿花叢',reefRock14:'礁石',dogRock14:'哈巴狗岩',sleeperRock14:'睡美人岩',inn14:'民宿',scooterRow14:'出租機車',fishRack14:'飛魚乾架',diveHut14:'潛水店',boat14:'小艇',towelRack14:'浴巾架',parasol:'陽傘',deer14:'梅花鹿'});
['palm14','hibiscus14','reefRock14','dogRock14','sleeperRock14','inn14','fishRack14','diveHut14','boat14','towelRack14','cowHill14','camp14','flowerField14','arch14','tide14','sub14','kiosk14'].forEach(k=>HOSTK.add(k));
Object.assign(HOSTN,{cowHill14:'牛頭山觀景台',camp14:'露營帳篷',flowerField14:'花海拍照框',arch14:'象鼻岩',tide14:'潮間帶礁岩',sub14:'半潛艇',kiosk14:'售票小亭'});
/* 物件的合理位置 */
H.SPOTS[N]={
 mask14:[['sub14',.3,.5],['kiosk14',.1,.55],['diveHut14',.4,.5],['parasol',.1,.4],['boat14',.5,.3]],
 buoy14:[['sub14',.2,-.4],['kiosk14',.4,.5],['diveHut14',.2,-.55],['boat14',.5,-.3],['rentStand14',.1,.55]],
 deer14:[['cowHill14',.05,.45],['flowerField14',.2,.4],['deer14',.3,.6],['benchSea14',.45,.2],['inn14',.05,.5]],
 towel14:[['camp14',.1,.45],['tide14',.4,.4],['towelRack14',.55,.1],['reefRock14',.5,.3],['benchSea14',.5,.2]],
 turtle14:[['kiosk14',.1,.5],['camp14',.08,.5],['inn14',.05,-.5],['rentStand14',.55,.3],['fishRack14',.4,.5]],
 coral14:[['arch14',.05,.45],['tide14',.3,.4],['diveHut14',.3,-.5],['inn14',.06,.55],['reefRock14',.45,-.3]],
 chime14:[['camp14',.5,.3],['flowerField14',.4,.4],['inn14',.35,.5],['fishRack14',.5,-.4],['lighthouse14',.03,.45]],
 flip14:[['camp14',.05,.5],['tide14',.2,.45],['parasol',.1,.45],['inn14',.04,-.5],['reefRock14',.5,.1]],
 lhmodel14:[['flowerField14',.3,.4],['arch14',.05,-.45],['lighthouse14',.03,-.6],['inn14',.06,.5],['benchSea14',.5,-.2]],
 sun14:[['camp14',.08,-.5],['kiosk14',.05,-.5],['parasol',.12,.4],['benchSea14',.5,.1],['diveHut14',.3,.55]],
 starfish:[['tide14',.3,.3],['reefRock14',.4,.3],['boat14',.3,.5],['sunbathe',.2,.5]],
 pearl:[['tide14',.4,-.3],['reefRock14',.5,-.2],['towelRack14',.4,.4],['inn14',.04,.5]]};
H.BLEND[N]={mask14:['goggles14','reefRock14'],buoy14:['balloon14','parasol'],deer14:['lamb14','deer14'],towel14:['mat14','hibiscus14'],turtle14:['leaf14','hibiscus14'],
 coral14:['mushroom14','reefRock14'],chime14:['keys14','hibiscus14'],flip14:['slipper14','reefRock14'],lhmodel14:['salt14','lighthouse14'],sun14:['toothpaste14','inn14'],
 starfish:['reefRock14','pebbles'],pearl:['shells','pebbles']};

/* ================= 8. 連環小故事：躲在大岩石後面的小梅花鹿 ================= */
const leaves=`<g transform="translate(24,-20) rotate(18)"><path d="M0,0 Q-6,-10 2,-16 Q10,-10 4,0Z" fill="#7fc060" stroke-width="1.3"/><path d="M6,2 Q4,-8 12,-12 Q18,-4 10,4Z" fill="#6fb85a" stroke-width="1.3"/><path d="M2,2 V-12" fill="none" stroke="#3f7a38" stroke-width="1.1"/></g>`;
STORIES[N]={title:'躲在大岩石後面的小梅花鹿',who:'民宿阿姨',
 giver:()=>act(0,0,1,{view:'fq',pose:'reach',hat:-1,hair:'#4a3a32',mood:2,top:'tee',bottom:'pants',shirt:'#e86a9a',pants:'#8a6a4a',skin:'#c98d5e'}),
 target:()=>`<g transform="translate(0,66)">${fawn14()}</g>`,tw:44,th:54, /* 2026-11-18 修：小鹿原本畫在原點上方 70～116，點的範圍（原點往上 50）點不到 → 圖往下移 66，原點改放在岩石背上 */
 helper:()=>act(0,0,1,{view:'side',pose:'hold',hat:1,mood:1,top:'tee',bottom:'shorts',shirt:'#2f7fa8',pants:'#c9a46a',skin:'#a8683e',beard:true,hair:'#bdb8b0',hs:3,extra:leaves}),hw:40,hh:64,
 ask:'民宿阿姨：我家的小梅花鹿不見了！牠戴著我編的花圈，大概又躲起來了。',
 need:'小鹿躲在像哈巴狗的大岩石後面，不敢出來⋯牠最愛吃嫩葉。街上騎機車的阿伯，後座載著一整把！',
 got:'機車阿伯：嫩葉分你一把！小心別嚇到牠。',
 ok:'小鹿吃著嫩葉探出頭來，花圈歪歪的。快帶牠回去給民宿阿姨！'};

/* ================= 9. 冒險地圖（地圖往東加寬，綠島在海島港口東邊更遠、略偏北）與過場 ================= */
HERE[N]=[405,324];
H.mapHook(2,({P,ink,FN,open})=>{if(!open(N))return '';
 const route=H.mapRoute('M276,364 Q330,396 372,352 Q388,340 392,338','sea',ink);
 let m=`<g class="mnode" data-n="${N}"><circle cx="405" cy="336" r="34" fill="transparent"/>`+H.MAPC.waves(405,354,64)+H.MAPC.birds(384,304,.8)+`<g transform="translate(405,336) scale(1.12)">`;   /* 2026-11-21w 繪本風：島保留、放大、浪、小鳥 */
 m+=`<ellipse cx="0" cy="8" rx="34" ry="15" fill="#efe0a8" stroke="${ink}" stroke-width="1.8"/><ellipse cx="0" cy="5" rx="25" ry="9.5" fill="#8fbf6a"/>`;
 m+=P('M-24,6 Q-16,-12 -4,-10 Q4,-18 14,-6 Q20,-8 24,6Z','#7fae5a',1.4);
 m+=`<g transform="translate(14,-2)">`+P('M-3,10 L-2,-12 H2 L3,10Z','#fffdf4',1.4)+`<path d="M-2.4,-2 H2.4 L2.6,-6 H-2.6Z" fill="#2f7a88"/>`+P('M-3,-12 L0,-18 L3,-12Z','#2f7a88',1.2)+`</g>`;
 m+=`<g transform="translate(-14,2)"><path d="M0,8 Q-3,-4 2,-14" fill="none" stroke="${ink}" stroke-width="1.8"/><path d="M2,-14 q-9,-2 -11,4 M2,-14 q8,-5 13,2 M2,-14 q-3,-7 -9,-6" fill="#5f9a3a" stroke="${ink}" stroke-width="1.4"/></g>`;
 m+=`</g><g transform="translate(405,372)"><rect x="-22" y="-10" width="44" height="19" rx="9.5" fill="#fffaf0" stroke="${ink}" stroke-width="1.8"/><text y="4" text-anchor="middle" font-size="11.5" fill="${ink}" font-family="${FN}">綠島</text></g></g>`;
 return route+m});
/* 過場：背後看小艇往外海開，海面有飛魚跳過，綠島越來越大 */
RIDES.boat14={text:'坐小艇出海，往外海的綠島去⋯',every:360,tick:k=>tone(k%2?330:392,.1,'sine',.05),
 svg:()=>{const wave=y0=>[0,1,2,3].map(i=>`<path d="M${10+i*96},${y0+i*28} q20,-8 40,0 q20,8 40,0" fill="none" stroke="#c4eee6" stroke-width="2.4" stroke-linecap="round"/>`).join('');
  /* 2026-11-20 使用者選 C：飛魚重畫（頭朝前進方向、藍背銀肚、大胸鰭會拍、分叉尾、帶水花） */
  const FV='C',FFA=()=>{const sw=`stroke="${OL}" stroke-width="1.3"`;
   if(!FV||FV==='A')return `<path d="M0,0 Q8,-5 16,0 Q8,5 0,0Z M3,-1 L-6,-10 L8,-3Z M3,1 L-6,10 L8,3Z M16,0 L22,-5 V5Z" fill="#dfe8ec" stroke="${OL}" stroke-width="1.4"/>`;
   const body=`<path d="M-13,0 L-24,-8 L-20,0 L-25,8Z" fill="#2f6f9a" ${sw}/><path d="M-14,0 Q-4,-6 10,-4.5 Q18,-3 21,0 Q18,3.5 10,4.5 Q-4,5.5 -14,0Z" fill="#e8eef0" ${sw}/><path d="M-13,-.6 Q-2,-6 10,-4.5 Q18,-3 21,0 Q10,-1.2 -13,-.6Z" fill="#2f6f9a" stroke="none"/><circle cx="15.5" cy="-1" r="1.5" fill="${OL}"/><path d="M12,-3 Q13,0 12,3" fill="none" stroke="${OL}" stroke-width=".9"/>`;
   if(FV==='D')return `<path d="M5,-1 L-4,-19 L-13,-18 L-3,-1Z M5,1 L-4,19 L-13,18 L-3,1Z" fill="#bfe3f0" ${sw}/><path d="M1,-3 L-6,-15 M1,3 L-6,15 M-2,-2 L-9,-16 M-2,2 L-9,16" stroke="#7fb3c8" stroke-width=".8"/><path d="M-10,-1 L-15,-7 L-17,-6 L-13,-1Z M-10,1 L-15,7 L-17,6 L-13,1Z" fill="#bfe3f0" ${sw}/><path d="M-13,0 L-24,-7 L-20,0 L-24,7Z" fill="#2f6f9a" ${sw}/><ellipse cx="3" cy="0" rx="18" ry="3.6" fill="#2f6f9a" ${sw}/><path d="M-12,0 H18" stroke="#8fc3dc" stroke-width="1.1"/><circle cx="16" cy="-1.6" r="1.1" fill="#fff"/><circle cx="16" cy="1.6" r="1.1" fill="#fff"/>`;
   const wing=`<path d="M6,-2 Q-4,-18 -19,-15 Q-9,-9 1,0Z" fill="#bfe3f0" opacity=".95" ${sw}/><path d="M3,-3 Q-6,-12 -15,-13 M1,-2 Q-7,-8 -13,-9" fill="none" stroke="#7fb3c8" stroke-width=".8"/>`;
   const wing2=`<path d="M5,2 Q-4,11 -15,10 Q-7,6 1,2Z" fill="#a9d4e6" ${sw}/>`;
   if(FV==='B')return wing2+body+wing;
   return `<g style="transform-origin:4px 0;animation:fl14 .18s ease-in-out infinite alternate">${wing2}</g>`+body+`<g style="transform-origin:4px 0;animation:fl14 .18s ease-in-out infinite alternate">${wing}</g><g fill="#e6f4fa" stroke="none"><circle cx="-30" cy="4" r="1.6"/><circle cx="-36" cy="1" r="1.2"/><circle cx="-41" cy="5" r="1"/></g>`};
  const fish=(y,d,delay)=>`<g style="animation:fx14 1.5s ease-in-out ${delay}s infinite"><g style="animation:fy14 1.5s ease-out ${delay}s infinite">${FFA()}</g></g>`;
  let s=`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><style>.il14{transform-origin:200px 250px;animation:il14 4.3s ease-in forwards}@keyframes il14{from{transform:scale(.55)}to{transform:scale(1.9)}}.wv14{animation:wv14 .9s linear infinite}@keyframes wv14{to{transform:translateY(112px)}}@keyframes fx14{0%{transform:translateX(-30px)}100%{transform:translateX(70px)}}@keyframes fl14{to{transform:scaleY(.45)}}@keyframes fy14{0%,100%{transform:translateY(0)}50%{transform:translateY(-34px)}}.bt14{animation:bt14 .6s ease-in-out infinite alternate}@keyframes bt14{to{transform:translateY(-3px) rotate(.8deg)}}</style>`;
  s+=`<g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect width="400" height="600" fill="#bfe6ef" stroke="none"/><circle cx="320" cy="80" r="38" fill="#fdf0c0" stroke="none"/><path d="M0,250 H400 V600 H0Z" fill="#6fbcc9" stroke="none"/><path d="M0,250 Q100,238 200,250 T400,248" fill="none" stroke="#a8e0e4" stroke-width="3"/>`;
  s+=`<g class="il14"><ellipse cx="200" cy="252" rx="86" ry="12" fill="#efe0a8"/><path d="M130,250 Q150,196 190,206 Q214,170 250,206 Q276,212 280,250Z" fill="#7fae5a"/><path d="M162,222 q10,-14 24,-6 M236,214 q12,-6 22,6" fill="none" stroke="#5f9a3a" stroke-width="2"/><path d="M262,252 L266,196 H276 L280,252Z" fill="#fffdf4"/><path d="M263,222 H279 L279.4,212 H262.6Z" fill="#2f7a88"/><path d="M262,196 L271,182 L280,196Z" fill="#2f7a88"/><g transform="translate(158,232)"><path d="M0,18 Q-6,-8 4,-28" fill="none" stroke="#a87a4a" stroke-width="6"/><path d="M4,-28 q-22,-4 -26,10 M4,-28 q18,-12 30,6 M4,-28 q-8,-16 -22,-14 M4,-28 q10,-14 24,-8" fill="#5f9a3a"/></g></g>`;
  s+=`<g clip-path="inset(250px 0 0 0)"><g class="wv14">${wave(240)}${wave(350)}${wave(460)}${wave(570)}${wave(680)}</g></g>`;
  s+=`<g transform="translate(70,330)">${fish()}</g><g transform="translate(250,380)">${fish(0,0,.5)}</g><g transform="translate(140,300) scale(.7)">${fish(0,0,1)}</g>`;
  s+=`<g transform="translate(200,505)"><g class="bt14"><path d="M-70,10 Q-30,-20 0,-24 Q30,-20 70,10Z" fill="#fff" opacity=".55" stroke="none"/><path d="M-44,-14 L-36,-52 H36 L44,-14 Z" fill="#fbf9f2"/><path d="M-40,-30 H40" fill="none" stroke="#2f7fa8" stroke-width="5"/><path d="M-44,-14 H44" fill="none" stroke-width="2.4"/><g transform="translate(-14,-44) scale(.9)">${kid({view:'back',pose:'stand',hat:HAT_M,skin:'#b97a4e',shirt:'#e86a4a',top:'tee',bottom:'shorts',pants:'#2b3a55',arm:0})}</g><g transform="translate(20,-44) scale(.9)">${kid({view:'back',pose:'stand',hat:-1,skin:'#a8683e',hair:'#2b2420',shirt:'#2b3a55',top:'tee',bottom:'shorts',pants:'#2b3a55',arm:0})}</g></g></g>`;
  return s+`</g></svg>`}};

/* ================= 10. 場景彩蛋：點像狗的大岩石 →「汪？」；點睡美人岩 → 噓 ================= */
H.TAPHOOKS[N]=(x,y)=>{
 if(x>DOG.x-112&&x<DOG.x-14&&y>DOG.y-114&&y<DOG.y-28){H.burst(DOG.x-60,DOG.y-100);H.toast('🐶 汪？（哈巴狗岩）',1500);tone(520,.1,'square',.05);tone(420,.12,'square',.05,.1);return true}
 if(x>SLEEP.x-134&&x<SLEEP.x-60&&y>SLEEP.y-76&&y<SLEEP.y+6){H.toast('🤫 噓⋯睡美人睡得正香',1700);tone(300,.18,'sine',.04);return true}
 return false};
})();

/* ================= 出口：第 5 關海島港口，水上屋旁的小艇（2026-11-17 引擎 11-17b「找路發現新關卡」） =================
   levels.js 這一關有 find:{after:5,from:5,hint:[…]}：第 5 關拿到 2 顆星之後，水上屋旁邊出現一艘小艇，
   潛水教練（頭上「…」）站在艇上；點教練 → 「要坐小艇去綠島嗎？」→ 出發才算發現。
   RESERVE 只在這個檔案載入時才佔位置，所以還不能發現之前，第 5 關完全不變。 */
(function(){
const H=window.TH;if(!H)return;const N=14;const {T,f,OL,act}=H;
const EX={x:1596,y:1128};
(H.RESERVE[5]||(H.RESERVE[5]=[])).push([EX.x,EX.y+6,150,100]);
const coachMask=H.MASKHAT14?H.MASKHAT14():'';
let coach='';const coachSvg=()=>coach||(coach=act(0,0,1,{view:'fq',pose:'stand',hat:-1,skin:'#a8683e',hair:'#2b2420',shirt:'#2b3a55',pants:'#2b3a55',top:'tee',bottom:'shorts',mood:2})+T(0,0,1,coachMask));
const boat=`<ellipse cx="0" cy="4" rx="64" ry="8" fill="#fff" opacity=".6" stroke="none"/><path d="M-58,-14 Q-54,2 -34,5 H38 Q54,2 62,-16 Z" fill="#fbf9f2"/><path d="M-56,-8 Q-52,-2 -34,-2 H38 Q52,-2 60,-10" fill="none" stroke="#2f7fa8" stroke-width="4"/><path d="M-58,-14 H62" fill="none" stroke-width="2.4"/><path d="M60,-14 L68,-22 V-4 L60,0Z" fill="#4a4f5c"/><path d="M68,-4 V6" fill="none" stroke-width="3"/><rect x="-44" y="-30" width="9" height="16" rx="4.4" fill="#f2c230"/><rect x="-32" y="-28" width="9" height="14" rx="4.4" fill="#4f8fc4"/>`;
/* 2026-11-18 使用者：入口角色頭上從「？」改成「…」（和一般路人一樣，增加探索難度）；圓點半徑 1.75，不會被當成路人提示（DOTSIG） */
const svg=found=>boat+T(10,-8,1,(found?'':`<g class="qbob">${H.bubble(14,-74,'dots').replace(/r="1\.7"/g,'r="1.75"')}</g>`)+coachSvg());
const pv=()=>`<svg viewBox="0 0 220 110" width="220" height="110" style="display:block"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect width="220" height="110" rx="10" fill="#bfe6ef" stroke="none"/><circle cx="184" cy="24" r="13" fill="#fdf0c0" stroke="none"/><path d="M0,60 H220 V110 H0Z" fill="#6fbcc9" stroke="none"/><path d="M110,60 Q124,34 146,42 Q160,24 178,44 Q190,46 192,60Z" fill="#7fae5a"/><path d="M176,60 L178,30 H184 L186,60Z" fill="#fffdf4"/><path d="M176,30 L181,22 L186,30Z" fill="#2f7a88"/><path d="M0,76 q12,-5 24,0 q12,5 24,0 M130,92 q12,-5 24,0 q12,5 24,0" fill="none" stroke="#c4eee6" stroke-width="2.4"/><g transform="translate(60,78) scale(.8)"><path d="M-40,-12 Q-36,2 -20,4 H24 Q38,2 44,-14Z" fill="#fbf9f2"/><path d="M-40,-8 Q-36,-2 -20,-2 H24 Q36,-2 42,-10" fill="none" stroke="#2f7fa8" stroke-width="4"/></g></g></svg>`;
H.EXITS[N]={x:EX.x,y:EX.y,w:150,h:96,svg,ask:{pv,title:'要坐小艇去綠島嗎？',
 text:'潛水教練：外海有一座綠色的小島，有白色燈塔、梅花鹿，還有可以浮潛的沙灘！<br>要不要一起去看看？',again:'潛水教練：又要去綠島嗎？<br>小艇加滿油了，隨時可以出發！',
 go:'🚤 坐小艇去綠島',wait:'之後再說',waitMsg:'潛水教練：好，小艇先停在這裡，準備好再來找我！'}};
})();
