/* 奇幻小鎮大搜查．地熱洞窟（找路發現的新關卡，編號 15 只是程式用）
   入口：第 3 關雪山溫泉村，溫泉平台東邊的「溫泉邊洞口」，洞口旁的地質學家頭上「…」——程式在這個檔案最後面（H.RESERVE[3]／H.EXITS[15]）。
   使用者 2026-11-18 定案：地底世界先各自獨立，從各自關卡進去（未來再考慮互通）；地熱洞窟做成主線找物件關卡（不做秘境）；
   自己找的關卡一律第 10 關完成（2 星）後才開放；冒險地圖用 A：找到之後，雪山溫泉村旁邊才出現洞口小圖；
   第 10 關後，第 3 關的洞口冒出來、會閃光（新發現）；過場＝順著石階往下走（RIDES.stairs15）；穿著＝洞裡暖和，冬裝外套半脫（綁在腰上）。
   場景（由南往北）：石階入口＋探險營地 → 中央足湯 → 西邊彩色溫泉梯田、東邊泥漿池＋間歇泉 → 北邊地底湖、水晶洞、礦坑口和小鐵軌。
   小故事「頭燈沒電的小鼴鼠」。彩蛋：點間歇泉會噴水。BORROW 不借。物件 id 和 kind 都以 15 結尾。 */
(function(){
const H=window.TH;if(!H)return;
const N=15;
const {T,f,r,sr,pk,ri,OL,SKIN,kid,act,wrapAn,add,mark,canPlace,scatter,KIND,POOL,VPLAN,REG,SCREG,LEVELS,ART,DECOY,
 SCENE_IMPL,WATERFN,RIDES,HERE,OUTFITS,STORIES,HOSTK,HOSTN,tone,typeOf,HATS}=H;

/* ================= 1. 場景範圍、洞頂、場地邊緣 ================= */
H.SCENES[N]={x0:600,x1:1900,y1:2150,c:[1250,1820]};
H.TARGET[N]=330;
H.SKYC[N]='#5a4a42';H.SKYY[N]=0;
H.EDGEM[N]='';H.EDGED[N]='';
H.EDGEDECO[N]=[['stalag15',1]];
H.FRINGE[N]=[['fungus15',1.1],['rock15s',1]];
H.DENS[N]=1.1;
/* 場地外不用雲：改成暗暗的岩壁＋垂下來的鐘乳石、地上的石筍剪影（core.js FOGFN） */
if(H.FOGFN)H.FOGFN[N]=({X0,X1,Y1,R})=>{const rr=(a,b)=>a+R()*(b-a),C='#2e2522';
 const gd=(n,x1,x2,y1,y2)=>`<linearGradient id="${n}" x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}"><stop offset="0" stop-color="${C}" stop-opacity="1"/><stop offset=".45" stroke="none" stop-color="${C}" stop-opacity=".85"/><stop offset="1" stop-color="${C}" stop-opacity="0"/></linearGradient>`;
 let g=`<defs>${gd('cL15',0,1,0,0)+gd('cR15',1,0,0,0)+gd('cT15',0,0,0,1)+gd('cB15',0,0,1,0)}</defs><path d="M-6000,-4000 H8800 V5800 H-6000Z M${X0-295},-295 V${Y1+295} H${X1+295} V-295Z" fill="${C}" fill-rule="evenodd"/>`;
 g+=`<rect x="${X0-300}" y="-300" width="300" height="${Y1+600}" fill="url(#cL15)"/><rect x="${X1}" y="-300" width="300" height="${Y1+600}" fill="url(#cR15)"/><rect x="${X0-300}" y="-300" width="${X1-X0+600}" height="300" fill="url(#cT15)"/><rect x="${X0-300}" y="${Y1}" width="${X1-X0+600}" height="300" fill="url(#cB15)"/>`;
 g+=`<g stroke="#1e1816" stroke-width="2" stroke-linejoin="round">`;
 for(let x=X0-260;x<X1+260;x+=rr(40,80)){const h=rr(50,140),w=rr(12,26),y=-rr(120,220);g+=`<path d="M${f(x-w)},${f(y)} Q${f(x-w*.4)},${f(y+h*.6)} ${f(x)},${f(y+h)} Q${f(x+w*.4)},${f(y+h*.6)} ${f(x+w)},${f(y)}Z" fill="${pk(['#3e322d','#463830','#3a2e2a'])}"/>`}
 for(let x=X0-260;x<X1+260;x+=rr(50,100)){const h=rr(50,130),w=rr(14,30),y=Y1+rr(160,240);g+=`<path d="M${f(x-w)},${f(y)} Q${f(x-w*.4)},${f(y-h*.6)} ${f(x)},${f(y-h)} Q${f(x+w*.4)},${f(y-h*.6)} ${f(x+w)},${f(y)}Z" fill="${pk(['#3e322d','#463830','#3a2e2a'])}"/>`}
 for(let y=0;y<Y1;y+=rr(90,160))[[X0-rr(170,260),1],[X1+rr(170,260),-1]].forEach(([x])=>{const w=rr(50,110),h=rr(30,60);g+=`<path d="M${f(x-w)},${f(y)} Q${f(x-w)},${f(y-h)} ${f(x)},${f(y-h)} Q${f(x+w)},${f(y-h)} ${f(x+w)},${f(y)}Z" fill="${pk(['#3e322d','#463830'])}"/>`});
 [[X0-200,600],[X1+200,900],[X0-210,1500],[X1+210,1700]].forEach(([x,y])=>{g+=`<path d="M${x},${y} l8,-22 l8,22Z M${x+14},${y} l6,-14 l6,14Z" fill="#9a7ac8" opacity=".7"/>`});
 return g+`</g>`};

/* ================= 2. 當地人：洞裡暖和，冬裝外套脫下來綁在腰上（約一半），毛衣、長褲 ================= */
const WOOD='#a8703f',WOOD2='#c99a5b';
/* 綁在腰上的外套：腰帶一圈＋前面打結＋兩條袖子垂下 */
const TIE=c=>`<path d="M-8.8,-8.6 Q0,-5.4 8.8,-8.6 L9,-4.6 Q0,-1.6 -9,-4.6Z" fill="${c}" stroke-width="1.3"/><path d="M-1.4,-4 L-4.6,4.6 L-1,4.8Z M1.4,-4 L4.6,4.6 L1,4.8Z" fill="${c}" stroke-width="1.2"/><circle cx="0" cy="-4.4" r="2.6" fill="${c}" stroke-width="1.2"/>`;
/* 礦工安全帽：白色或橘色，前面一顆頭燈（和要找的「黃色礦工頭燈」顏色不一樣） */
const minerHat=()=>{const c=pk(['#f4f1e8','#e8823a']);return `<path d="M-13,-41 Q-13,-59 0,-59 Q13,-59 13,-41Z" fill="${c}"/><rect x="-16.5" y="-44" width="33" height="4.4" rx="2.2" fill="${c}"/><path d="M0,-59 V-44" fill="none" stroke-width="1.4"/><circle cx="0" cy="-50" r="4.2" fill="#fff4b8" stroke-width="1.6"/>`};
const HAT_MINER=HATS.push(minerHat)-1;
H.MINERHAT15=HAT_MINER;
const COATC=['#c4473c','#2f5f8a','#3f7a4a','#e0a030','#6a4a8a','#8a5a3a'];
OUTFITS[N]=o=>{if(o.top)return o;const S=SKIN;
 o.skin=o.skin||pk([S[0],S[1],S[1],S[2],S[3],S[4]]);
 o.top=pk(['long','long','long','tee']);o.bottom='pants';
 o.shirt=o.shirt||pk(['#e8dcc4','#c9a46a','#8a9ab0','#d88a6a','#6f9a8a','#b08ac0','#f2e6c8']);
 o.pants=o.pants||pk(['#3b4a6a','#5a4a3e','#2b3a55','#6a5a4a','#4a5a3a']);
 if(r()<.5)o.extra=(o.extra||'')+TIE(pk(COATC));
 if(o.hat==null&&!o.plain){const k=r();o.hat=k<.22?0:k<.36?6:k<.46?HAT_MINER:-1}
 return o};

/* ================= 3. 物件與干擾物（12 種 × 4 個） ================= */
Object.assign(ART,{
 /* 礦工頭燈：黃色安全帽，前面一顆會亮的頭燈 */
 headlamp15:`<circle cx="0" cy="-3" r="13" fill="#fff3a0" opacity=".45" stroke="none"/><path d="M-17,6 Q-18,-17 0,-19 Q18,-17 17,6Z" fill="#f2c230"/><path d="M-21,5 H21 Q21,10 16,10 H-16 Q-21,10 -21,5Z" fill="#e0a820"/><path d="M0,-19 V-11" fill="none" stroke="#c8901a" stroke-width="2.4"/><circle cx="0" cy="-3" r="7.6" fill="#4a4f5c"/><circle cx="0" cy="-3" r="5" fill="#fffbe0"/><path d="M-11,-11 Q-13,-6 -13,0" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>`,
 /* 硫磺結晶：灰色石頭上長出一簇黃色尖尖的結晶 */
 sulfur15:`<path d="M-17,13 Q-19,4 -10,2 H10 Q19,4 17,13Z" fill="#9a928a"/>`+
  [[-9,-14,-12],[-2,-22,-4],[6,-16,8],[12,-8,16],[-14,-6,-22]].map(([x,h,a])=>`<g transform="rotate(${a} ${x} 4)"><path d="M${x-4},5 L${x-4},${h+4} L${x},${h-2} L${x+4},${h+4} L${x+4},5Z" fill="#f2d43a"/><path d="M${x},${h-2} V4" fill="none" stroke="#d8b020" stroke-width="1.2"/><path d="M${x-2.4},${h+5} V0" fill="none" stroke="#fff6a8" stroke-width="1.6" stroke-linecap="round"/></g>`).join(''),
 /* 紫水晶晶洞：切開的圓石頭，裡面一圈紫色尖晶 */
 geode15:`<ellipse cx="0" cy="0" rx="18" ry="16" fill="#8a7e74"/><path d="M-14,-9 Q-10,-14 -4,-15" fill="none" stroke="#a89c90" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="0" cy="1" rx="14" ry="12.4" fill="#f4f0f8"/><ellipse cx="0" cy="1" rx="11.4" ry="10" fill="#8f5fc0"/>`+
  [0,30,60,90,120,150,180,210,240,270,300,330].map(a=>{const t=a*Math.PI/180,c=Math.cos(t),s=Math.sin(t);return `<path d="M${f(c*11-s*3)},${f(1+s*10+c*2.6)} L${f(c*4.6)},${f(1+s*4)} L${f(c*11+s*3)},${f(1+s*10-c*2.6)}Z" fill="#c9a6f0" stroke-width="1"/>`}).join('')+`<ellipse cx="0" cy="1" rx="3.6" ry="3" fill="#5a3a8a" stroke="none"/>`,
 /* 溫度計：玻璃管、紅色液柱、刻度、底部紅色圓球 */
 thermo15:`<g transform="rotate(-24)"><rect x="-5.4" y="-24" width="10.8" height="38" rx="5.4" fill="#fbfbf6"/><rect x="-2" y="-12" width="4" height="24" fill="#e04a3a" stroke="none"/><path d="M2.6,-18 h3.6 M2.6,-12 h2.4 M2.6,-6 h3.6 M2.6,0 h2.4 M2.6,6 h3.6" fill="none" stroke-width="1.2"/><circle cx="0" cy="16" r="7.6" fill="#e04a3a"/><circle cx="-2.4" cy="13.6" r="1.8" fill="#fff" stroke="none" opacity=".8"/><path d="M-2.6,-21 V-6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".9"/></g>`,
 /* 倒掛小蝙蝠玩偶：腳抓著木條，翅膀包著身體，耳朵朝下 */
 bat15:`<path d="M-15,-21 H15" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><path d="M-15,-21 H15" fill="none" stroke="${WOOD2}" stroke-width="3.4" stroke-linecap="round"/><path d="M-3,-20 V-14 M3,-20 V-14" fill="none" stroke-width="2"/>`+
  `<path d="M-6,-14 Q-19,-12 -17,4 Q-13,1 -11,5 Q-9,1 -6,4Z" fill="#6a5a80"/><path d="M6,-14 Q19,-12 17,4 Q13,1 11,5 Q9,1 6,4Z" fill="#6a5a80"/><ellipse cx="0" cy="-3" rx="8" ry="12" fill="#5a4a6e"/>`+
  `<path d="M-8,13 L-6,22 L-2,15Z M8,13 L6,22 L2,15Z" fill="#6a5a80"/><circle cx="0" cy="11" r="7.6" fill="#6a5a80"/><ellipse cx="-2.8" cy="10" rx="1.8" ry="2.2" fill="#fff" stroke="none"/><ellipse cx="2.8" cy="10" rx="1.8" ry="2.2" fill="#fff" stroke="none"/><circle cx="-2.8" cy="10.4" r="1" fill="${OL}" stroke="none"/><circle cx="2.8" cy="10.4" r="1" fill="${OL}" stroke="none"/><path d="M-2,14.4 Q0,16 2,14.4" fill="none" stroke-width="1.1"/><circle cx="-5" cy="13.4" r="1.4" fill="#f0a0b0" stroke="none"/><circle cx="5" cy="13.4" r="1.4" fill="#f0a0b0" stroke="none"/>`,
 /* 小礦車模型：鐵灰色車斗裝滿彩色礦石，兩個輪子 */
 cart15:`<path d="M-19,-6 L-15,10 H15 L19,-6Z" fill="#7a7f88"/><path d="M-17,0 H17" fill="none" stroke="#5a5f68" stroke-width="1.4"/><circle cx="-13" cy="-2" r="1.2" fill="${OL}" stroke="none"/><circle cx="13" cy="-2" r="1.2" fill="${OL}" stroke="none"/><circle cx="-13" cy="5" r="1.2" fill="${OL}" stroke="none"/><circle cx="13" cy="5" r="1.2" fill="${OL}" stroke="none"/>`+
  `<circle cx="-10" cy="-9" r="5" fill="#a77ad8"/><circle cx="-1" cy="-11" r="5.6" fill="#f2d43a"/><circle cx="9" cy="-9" r="5" fill="#5fc8c8"/><circle cx="4" cy="-6" r="3.4" fill="#d88a6a"/><path d="M-19,-6 H19" fill="none" stroke-width="2.2"/><circle cx="-10" cy="13" r="4.6" fill="#3a3a3a"/><circle cx="10" cy="13" r="4.6" fill="#3a3a3a"/><circle cx="-10" cy="13" r="1.6" fill="#c9ccd0" stroke="none"/><circle cx="10" cy="13" r="1.6" fill="#c9ccd0" stroke="none"/>`,
 /* 十字鎬：木柄＋兩頭尖的彎鐵頭 */
 pick15:`<g transform="rotate(-30)"><path d="M0,-12 V24" fill="none" stroke="${OL}" stroke-width="7.4" stroke-linecap="round"/><path d="M0,-12 V24" fill="none" stroke="${WOOD2}" stroke-width="4.6" stroke-linecap="round"/><path d="M-22,-8 Q-12,-19 0,-19 Q12,-19 22,-8 Q12,-14 0,-13 Q-12,-14 -22,-8Z" fill="#9aa2ac"/><rect x="-4" y="-21" width="8" height="10" rx="1.6" fill="#7a828c"/><path d="M-14,-15 Q-6,-18 0,-17.6" fill="none" stroke="#d4dae0" stroke-width="1.6" stroke-linecap="round"/></g>`,
 /* 發光藍蘑菇：三朵藍色小蘑菇，周圍有一圈淡淡的光 */
 shroom15:`<circle cx="0" cy="-2" r="20" fill="#bff2ff" opacity=".45" stroke="none"/>`+
  [[-8,6,.8],[7,4,.9],[0,-4,1.1]].map(([x,y,s])=>`<g transform="translate(${x},${y}) scale(${s})"><path d="M-3,10 Q-3.6,2 -2.6,-1 H2.6 Q3.6,2 3,10Z" fill="#e8f8fc"/><path d="M-11,0 Q-11,-12 0,-12 Q11,-12 11,0 Q0,3 -11,0Z" fill="#4fc0e0"/><circle cx="-4" cy="-6" r="1.6" fill="#e8fcff" stroke="none"/><circle cx="4" cy="-7" r="1.4" fill="#e8fcff" stroke="none"/><circle cx="0" cy="-3" r="1.1" fill="#e8fcff" stroke="none"/></g>`).join(''),
 /* 白色小蠑螈玩偶：粉白色、捲著尾巴，頭兩邊有粉紅色鰓 */
 salamander15:`<path d="M-4,8 Q-18,10 -18,0 Q-18,-8 -10,-6 Q-14,-2 -12,2 Q-10,5 -2,3Z" fill="#f6e2e4"/><ellipse cx="2" cy="3" rx="11" ry="7" fill="#f8e6e8"/><path d="M-4,9 l-2,5 M4,9 l2,5 M-6,-2 l-4,-3 M8,-2 l3,-4" fill="none" stroke-width="2.4" stroke-linecap="round"/>`+
  `<path d="M9,-12 l-5,-5 M9,-9 l-7,-1 M17,-12 l3,-6 M18,-9 l6,-2" fill="none" stroke="#e86a8a" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="13" cy="-7" rx="8.6" ry="7.4" fill="#f8e6e8"/><circle cx="10" cy="-8" r="1.3" fill="${OL}" stroke="none"/><circle cx="16" cy="-8" r="1.3" fill="${OL}" stroke="none"/><path d="M11,-4 Q13,-2.4 15,-4" fill="none" stroke-width="1.1"/><ellipse cx="6" cy="1" rx="2" ry="1.4" fill="#f0b0c0" stroke="none"/>`,
 /* 洞窟探險地圖：兩頭捲起來的牛皮紙，虛線小路通到紅色叉叉 */
 map15:`<path d="M-15,-13 H15 V13 H-15Z" fill="#f1e2b8"/><path d="M-10,8 Q-6,0 -2,4 Q4,8 6,-2" fill="none" stroke="#8a6a3a" stroke-width="1.6" stroke-dasharray="2.4 2.4"/><path d="M6,-7 L11,-2 M11,-7 L6,-2" fill="none" stroke="#d8413a" stroke-width="2.4" stroke-linecap="round"/><path d="M-12,-6 Q-9,-11 -6,-6Z" fill="#9a8a7a" stroke-width="1"/>`+
  `<rect x="-21" y="-15" width="7" height="30" rx="3.5" fill="#e3cf9a"/><rect x="14" y="-15" width="7" height="30" rx="3.5" fill="#e3cf9a"/><path d="M-17.5,-15 V15 M17.5,-15 V15" fill="none" stroke="#c9b078" stroke-width="1.2"/>`});
Object.assign(DECOY,{
 hardhat15:`<path d="M-17,6 Q-18,-17 0,-19 Q18,-17 17,6Z" fill="#e8823a"/><path d="M-21,5 H21 Q21,10 16,10 H-16 Q-21,10 -21,5Z" fill="#d06a2a"/><path d="M-4,-19 V4 M4,-19 V4" fill="none" stroke="#c4602a" stroke-width="1.6"/><rect x="-9" y="-6" width="18" height="5" rx="1.6" fill="#fbf6ea" stroke-width="1.2"/>`,
 cheese15:`<path d="M-18,10 V-2 L14,-14 L18,-4 V10Z" fill="#f5cf4a"/><path d="M-18,-2 L14,-14 L18,-4 L-14,6Z" fill="#fadf7a" stroke-width="1.4"/><circle cx="-8" cy="2" r="2.8" fill="#e0b030" stroke="none"/><circle cx="4" cy="-3" r="2" fill="#e0b030" stroke="none"/><circle cx="-4" cy="7" r="1.8" fill="#e0b030" stroke="none"/><circle cx="10" cy="5" r="2.6" fill="#e0b030" stroke="none"/>`,
 onion15:`<path d="M0,-17 Q-3,-22 -1,-25 M0,-17 Q3,-22 5,-24" fill="none" stroke="#6f9a4a" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="17" ry="16" fill="#9a4a8a"/><ellipse cx="0" cy="1" rx="13.4" ry="12.4" fill="#f4e6f0"/><ellipse cx="0" cy="1.4" rx="10" ry="9.2" fill="#c47ab8" stroke="none"/><ellipse cx="0" cy="1.8" rx="7" ry="6.4" fill="#f4e6f0" stroke="none"/><ellipse cx="0" cy="2.2" rx="4" ry="3.6" fill="#c47ab8" stroke="none"/><path d="M-3,16 l-2,5 M0,16 V22 M3,16 l2,5" fill="none" stroke="#b8a888" stroke-width="1.4"/>`,
 pencil15:`<g transform="rotate(-24)"><rect x="-4.6" y="-20" width="9.2" height="30" fill="#d8413a"/><path d="M-1.5,-20 V10 M1.5,-20 V10" fill="none" stroke="#b02a22" stroke-width="1"/><path d="M-4.6,10 L0,22 L4.6,10Z" fill="#f0d0a0"/><path d="M-1.6,18 L0,22 L1.6,18Z" fill="#3a3a3a" stroke="none"/><rect x="-4.6" y="-26" width="9.2" height="6" fill="#c9ccd0"/><rect x="-4.6" y="-31" width="9.2" height="5" rx="2" fill="#f0a0b0"/></g>`,
 umbrella15:`<g transform="rotate(-18)"><path d="M0,-24 V22 Q0,28 -6,26" fill="none" stroke="${OL}" stroke-width="4.6" stroke-linecap="round"/><path d="M0,-24 V22 Q0,28 -6,26" fill="none" stroke="#8a5a32" stroke-width="2.4" stroke-linecap="round"/><path d="M-1,-20 Q-8,-6 -5,10 L5,10 Q8,-6 1,-20Z" fill="#3a3a44"/><path d="M-1,-16 Q-3,-4 -2,8" fill="none" stroke="#5a5a66" stroke-width="1.4"/><rect x="-6" y="-2" width="12" height="4" rx="1.4" fill="#2a2a32"/></g>`,
 barrow15:`<path d="M-18,-2 L14,-8 L20,4 L-12,8Z" fill="#5f9a5a"/><path d="M-18,-2 L-12,8" fill="none"/><path d="M-12,8 L-20,14 M2,6 L-8,16" fill="none" stroke="${OL}" stroke-width="3.4" stroke-linecap="round"/><path d="M14,-4 L28,-12 M10,2 L26,-4" fill="none" stroke="${OL}" stroke-width="4.4" stroke-linecap="round"/><path d="M14,-4 L28,-12 M10,2 L26,-4" fill="none" stroke="${WOOD2}" stroke-width="2.2" stroke-linecap="round"/><circle cx="-18" cy="14" r="6" fill="#3a3a3a"/><circle cx="-18" cy="14" r="2" fill="#c9ccd0" stroke="none"/>`,
 hoe15:`<g transform="rotate(-30)"><path d="M0,-14 V24" fill="none" stroke="${OL}" stroke-width="7.4" stroke-linecap="round"/><path d="M0,-14 V24" fill="none" stroke="${WOOD2}" stroke-width="4.6" stroke-linecap="round"/><path d="M-2,-18 H-18 V-6 H-2Z" fill="#9aa2ac"/><path d="M-2,-14 H3" fill="none" stroke-width="3"/></g>`,
 bluebell15:`<path d="M-12,16 Q-14,-4 4,-14 Q14,-18 16,-10" fill="none" stroke="#5f9a4a" stroke-width="2.4" stroke-linecap="round"/><path d="M-12,12 Q-20,4 -16,-4 Q-10,4 -12,12Z" fill="#6fae5a" stroke-width="1.2"/>`+
  [[-8,0],[2,-10],[14,-7]].map(([x,y])=>`<path d="M${x},${y} V${y+3}" fill="none" stroke="#5f9a4a" stroke-width="1.6"/><path d="M${x-6},${y+12} Q${x-6},${y+3} ${x},${y+3} Q${x+6},${y+3} ${x+6},${y+12} L${x+4},${y+10} L${x+2},${y+12} L${x},${y+10} L${x-2},${y+12} L${x-4},${y+10}Z" fill="#5a7ad8"/>`).join(''),
 sock15:`<path d="M-8,-18 H6 V2 Q6,6 10,8 L16,10 Q20,12 18,17 Q16,20 10,19 L-4,15 Q-9,13 -8,8Z" fill="#f2a0b8"/><path d="M-8,-18 H6 V-11 H-8Z" fill="#f8d0dc"/><path d="M-5,-18 V-11 M-2,-18 V-11 M1,-18 V-11 M4,-18 V-11" fill="none" stroke="#e080a0" stroke-width="1"/><path d="M12,9 Q20,12 18,17 Q16,20 10,19Z" fill="#e06a90" stroke-width="1.2"/>`,
 paper15:`<g transform="rotate(-20)"><rect x="-20" y="-7" width="40" height="14" rx="6" fill="#ecebe4"/><ellipse cx="20" cy="0" rx="4" ry="7" fill="#d8d6cc"/><path d="M-16,-3 H8 M-16,1 H10 M-16,4 H4" fill="none" stroke="#9a9a9a" stroke-width="1"/><path d="M-4,-7.4 V7.4" fill="none" stroke="#d8413a" stroke-width="2.4"/></g>`});

/* 2026-11-18 使用者：物件看起來太大 → 畫的原圖本身比前面關卡大，這裡把原圖縮到和前面關卡差不多（最長邊約 34，細長的約 40），引擎再縮 15% */
const SCL=(o,t)=>Object.entries(t).forEach(([k,v])=>{if(o[k])o[k]=`<g transform="scale(${v})">${o[k]}</g>`});
SCL(ART,{headlamp15:.81,sulfur15:.81,geode15:.94,thermo15:.8,bat15:.82,cart15:.89,pick15:.68,shroom15:.85,salamander15:.81,map15:.81});
SCL(DECOY,{hardhat15:.81,cheese15:.94,onion15:.82,pencil15:.77,umbrella15:.77,barrow15:.75,hoe15:.82,bluebell15:.92,sock15:.92,paper15:.8});

/* ================= 4. 12 種 × 4 個 ================= */
const OLD={tub:{id:'tub',name:'溫泉木桶',short:'木桶',r:14,rot:8},egg:{id:'egg',name:'溫泉蛋',short:'溫泉蛋',r:13,rot:20}};
const old=(id,regions)=>({...(typeOf(id)||OLD[id]),...(id==='egg'?{name:'溫泉蛋',short:'溫泉蛋'}:{}),regions});
const TYPES=[
 old('tub',['center15','terrace15','camp15','geyser15']),old('egg',['terrace15','center15','camp15','geyser15']),
 {id:'headlamp15',name:'礦工頭燈',short:'頭燈',r:16,rot:12,regions:['mine15','camp15','crystal15','lake15']},
 {id:'sulfur15',name:'硫磺結晶',short:'硫磺',r:15,rot:10,regions:['geyser15','crystal15','geyser15','terrace15']},
 {id:'geode15',name:'紫水晶晶洞',short:'晶洞',r:15,rot:15,regions:['crystal15','lake15','camp15','mine15']},
 {id:'thermo15',name:'溫度計',short:'溫度計',r:15,rot:20,regions:['geyser15','terrace15','camp15','center15']},
 {id:'bat15',name:'倒掛小蝙蝠玩偶',short:'小蝙蝠',r:15,rot:8,regions:['lake15','mine15','crystal15','center15']},
 {id:'cart15',name:'小礦車模型',short:'小礦車',r:16,rot:10,regions:['mine15','camp15','lake15','mine15']},
 {id:'pick15',name:'十字鎬',short:'十字鎬',r:16,rot:20,regions:['mine15','crystal15','camp15','geyser15']},
 {id:'shroom15',name:'發光藍蘑菇',short:'藍蘑菇',r:15,rot:8,regions:['lake15','terrace15','crystal15','center15']},
 {id:'salamander15',name:'白色小蠑螈玩偶',short:'小蠑螈',r:15,rot:20,regions:['lake15','terrace15','center15','geyser15']},
 {id:'map15',name:'洞窟探險地圖',short:'探險地圖',r:16,rot:12,regions:['camp15','center15','mine15','lake15']}];
LEVELS[N].types=TYPES;
/* BORROW：不借（地熱洞窟物件不混進前面的關卡） */

/* ================= 5. 地形：洞窟輪廓、水域 ================= */
const CAVE=[[700,560],[860,478],[1060,452],[1250,446],[1450,452],[1650,476],[1800,546],[1862,700],[1874,950],[1884,1250],[1874,1550],[1852,1800],[1800,1990],[1650,2066],[1450,2092],[1250,2100],[1050,2092],[850,2066],[700,1990],[648,1800],[626,1550],[618,1250],[628,950],[648,700]];
const smoothD=P=>{const n=P.length,mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2],m0=mid(P[n-1],P[0]);let d=`M${f(m0[0])},${f(m0[1])}`;for(let i=0;i<n;i++){const c=P[i],m=mid(P[i],P[(i+1)%n]);d+=` Q${c[0]},${c[1]} ${f(m[0])},${f(m[1])}`}return d+'Z'};
const CAVED=smoothD(CAVE);
const CPTS=(()=>{const n=CAVE.length,mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2],out=[];for(let i=0;i<n;i++){const a=mid(CAVE[(i+n-1)%n],CAVE[i]),c=CAVE[i],b=mid(CAVE[i],CAVE[(i+1)%n]);for(let t=0;t<1;t+=.125){const u=1-t;out.push([u*u*a[0]+2*u*t*c[0]+t*t*b[0],u*u*a[1]+2*u*t*c[1]+t*t*b[1]])}}return out})();
const inPoly=(P,x,y)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if(((yi>y)!==(yj>y))&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
const inCave=(x,y)=>inPoly(CPTS,x,y);
const inE=(e,x,y,k=1)=>((x-e[0])/(e[2]*k))**2+((y-e[1])/(e[3]*k))**2<1;
const LAKE=[1250,610,290,100];
const TERR=[[910,1000,140,38,'#6fcfc4'],[860,1110,160,42,'#8fd3e6'],[930,1222,170,44,'#5fbf9e'],[866,1334,160,42,'#7fcad6'],[946,1444,140,38,'#9adfcc']];
const MUD=[[1560,1040,78,32],[1734,1084,66,28],[1626,1170,58,24]];
const GEY={x:1690,y:1350},GPOOL=[1690,1360,124,40];
const FOOT={x:1250,y:1520},MINE={x:780,y:670},STAIR={x:1250};
WATERFN[N]=(x,y)=>!inCave(x,y)||inE(LAKE,x,y)||TERR.some(t=>inE(t,x,y,1.08))||MUD.some(m=>inE(m,x,y,1.1))||inE(GPOOL,x,y);
Object.assign(REG,{lake15:{x:900,y:500,w:700,h:250},mine15:{x:660,y:560,w:320,h:380},crystal15:{x:1500,y:540,w:340,h:420},
 terrace15:{x:660,y:940,w:500,h:580},center15:{x:1160,y:820,w:240,h:820},geyser15:{x:1410,y:960,w:430,h:560},
 camp15:{x:680,y:1640,w:1150,h:400},all15:{x:640,y:480,w:1220,h:1600}});
H.SCREG[N]=['lake15','mine15','crystal15','terrace15','center15','geyser15','camp15'];

function ground(){
 const Sc=H.SCENES[N],X0=Sc.x0-420,WW=Sc.x1-Sc.x0+840;let g='';
 /* 洞壁：深褐色岩壁、岩層紋路 */
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="${Sc.y1+840}" fill="#5a4a42" stroke="none"/>`;
 for(let i=0;i<110;i++){const x=sr(X0,X0+WW),y=sr(-300,Sc.y1+300);g+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(30,90))}" ry="${f(sr(12,30))}" fill="${pk(['#64544a','#6e5d52','#54453e','#5e4e46'])}" stroke="none" opacity=".8"/>`}
 for(let i=0;i<60;i++){const x=sr(X0,X0+WW),y=sr(-300,Sc.y1+300),w=sr(40,110);g+=`<path d="M${f(x)},${f(y)} q${f(w/2)},${f(sr(-8,8))} ${f(w)},0" fill="none" stroke="#483a34" stroke-width="2.2" stroke-linecap="round"/>`}
 /* 洞壁上的小水晶點點 */
 for(let i=0;i<40;i++){const x=sr(X0,X0+WW),y=sr(-200,Sc.y1+200);if(inCave(x,y))continue;const c=pk(['#c9a6f0','#a6ecea','#f2d43a']);g+=`<path d="M${f(x)},${f(y)} l3,-8 l3,8Z" fill="${c}" stroke-width="1.2"/>`}
 /* 地面邊緣：岩壁的台階邊 */
 g+=`<path d="${CAVED}" fill="none" stroke="#7a675a" stroke-width="58" stroke-linejoin="round"/><path d="${CAVED}" fill="none" stroke="#8e7a6a" stroke-width="30" stroke-linejoin="round"/>`;
 g+=`<path d="${CAVED}" fill="#dccab0" stroke-width="2.6"/>`;
 g+=`<defs><clipPath id="cave15"><path d="${CAVED}"/></clipPath></defs><g clip-path="url(#cave15)">`;
 for(let i=0;i<70;i++){const x=sr(640,1880),y=sr(460,2100);g+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(40,120))}" ry="${f(sr(16,44))}" fill="${pk(['#d2bf9f','#e4d5bb','#cfba98','#d8c4a4'])}" stroke="none" opacity=".6"/>`}
 for(let i=0;i<90;i++){const x=sr(640,1880),y=sr(460,2100);g+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(3,7))}" ry="${f(sr(2,4))}" fill="${pk(['#b8a486','#c4b092','#a8967a'])}" stroke="none"/>`}
 /* 暖暖的燈光：營地、足湯、湖邊 */
 [[1250,1880,420,150],[1250,1520,220,90],[1250,700,360,120]].forEach(([x,y,a,b])=>g+=`<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="#fff1c8" stroke="none" opacity=".28"/>`);
 /* 地底湖：深藍綠、會發光的倒影 */
 const L=LAKE;g+=`<ellipse cx="${L[0]}" cy="${L[1]+6}" rx="${L[2]+22}" ry="${L[3]+16}" fill="#b8a68a" stroke="none"/><ellipse cx="${L[0]}" cy="${L[1]}" rx="${L[2]}" ry="${L[3]}" fill="#3f8e98" stroke-width="2.4"/><ellipse cx="${L[0]-20}" cy="${L[1]-10}" rx="${L[2]*.72}" ry="${L[3]*.6}" fill="#56a6ae" stroke="none"/>`;
 for(let i=0;i<14;i++){const x=L[0]+sr(-230,230),y=L[1]+sr(-60,60);if(!inE(L,x,y,.9))continue;g+=`<path d="M${f(x)},${f(y)} q8,-4 16,0 q8,4 16,0" fill="none" stroke="#a8efe6" stroke-width="2" stroke-linecap="round" opacity=".8"/>`}
 for(let i=0;i<10;i++){const x=L[0]+sr(-220,220),y=L[1]+sr(-50,50);if(!inE(L,x,y,.85))continue;g+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(6,14))}" ry="3" fill="${pk(['#c9a6f0','#bff2ff','#f6e8a0'])}" stroke="none" opacity=".55"/>`}
 /* 西邊：彩色溫泉梯田（乳白的石灰華邊、橘色水痕、一層一層往下） */
 TERR.forEach(([x,y,a,b,c])=>{
  g+=`<ellipse cx="${x}" cy="${y+18}" rx="${a+16}" ry="${b+14}" fill="#e6d0a2"/>`;
  for(let k=0;k<9;k++){const xx=x-a+k*(a*2/8),yy=y+18+Math.sqrt(Math.max(0,1-((xx-x)/(a+16))**2))*(b+14);g+=`<path d="M${f(xx)},${f(yy-14)} q2,8 0,14" fill="none" stroke="${k%2?'#d99a5a':'#e8b878'}" stroke-width="3" stroke-linecap="round" opacity=".85"/>`}
  g+=`<ellipse cx="${x}" cy="${y}" rx="${a+16}" ry="${b+12}" fill="#f6eedb" stroke-width="2"/><ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="${c}" stroke-width="1.8"/><ellipse cx="${f(x-a*.18)}" cy="${f(y-b*.2)}" rx="${f(a*.6)}" ry="${f(b*.45)}" fill="#fff" stroke="none" opacity=".3"/><path d="M${x-40},${y+6} q8,-4 16,0 q8,4 16,0 M${x+12},${y-10} q8,-4 16,0 q8,4 16,0" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".85"/>`});
 /* 東邊：泥漿池（灰褐色、冒泡泡） */
 MUD.forEach(([x,y,a,b])=>{g+=`<ellipse cx="${x}" cy="${y+3}" rx="${a+12}" ry="${b+9}" fill="#a89a8a"/><ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="#8a7a6c" stroke-width="1.8"/><ellipse cx="${x-a*.2}" cy="${y-b*.2}" rx="${a*.55}" ry="${b*.45}" fill="#9a8a7c" stroke="none"/>`;
  for(let k=0;k<5;k++){const bx=x+sr(-a*.6,a*.6),by=y+sr(-b*.5,b*.5);g+=`<circle cx="${f(bx)}" cy="${f(by)}" r="${f(sr(2.6,6))}" fill="#a89888" stroke-width="1.3"/>`}
  g+=`<ellipse cx="${x+a*.3}" cy="${y+b*.1}" rx="12" ry="4.4" fill="none" stroke="#b8aa9a" stroke-width="1.6"/>`});
 /* 間歇泉下方的淺水池 */
 g+=`<ellipse cx="${GPOOL[0]}" cy="${GPOOL[1]+4}" rx="${GPOOL[2]+16}" ry="${GPOOL[3]+10}" fill="#ece2cc"/><ellipse cx="${GPOOL[0]}" cy="${GPOOL[1]}" rx="${GPOOL[2]}" ry="${GPOOL[3]}" fill="#bfe4e0" stroke-width="1.8"/><path d="M${GPOOL[0]-90},${GPOOL[1]+10} q10,-5 20,0 q10,5 20,0 M${GPOOL[0]+40},${GPOOL[1]+14} q10,-5 20,0 q10,5 20,0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`;
 /* 小鐵軌：從西北邊的礦坑口彎到中間 */
 const rail=`M${MINE.x+10},${MINE.y+10} Q${MINE.x+60},${MINE.y+120} ${MINE.x+190},${MINE.y+180} Q${MINE.x+290},${MINE.y+226} ${MINE.x+330},${MINE.y+232}`;
 g+=`<path d="${rail}" fill="none" stroke="#7a5a3a" stroke-width="34" stroke-dasharray="6 9"/><path d="${rail}" fill="none" stroke="#5e636c" stroke-width="22"/><path d="${rail}" fill="none" stroke="#dccab0" stroke-width="16"/><path d="${rail}" fill="none" stroke="#8a6a48" stroke-width="16" stroke-dasharray="6 9"/>`;
 /* 木棧道（不畫框線的路）：主棧道從石階一路通到地底湖，往西到梯田、往東到間歇泉、往東北到水晶洞 */
 const bws=[[`M${STAIR.x},2060 L${STAIR.x},1560`,46],[`M${STAIR.x},1470 Q${STAIR.x},1100 ${STAIR.x},740`,42],[`M${STAIR.x},1190 Q1170,1180 1100,1200`,34],[`M${STAIR.x},1300 Q1380,1300 1500,1360`,34],[`M${STAIR.x},900 Q1400,860 1530,780`,34],[`M${STAIR.x},1800 Q1050,1790 860,1820`,36],[`M${STAIR.x},1800 Q1450,1790 1640,1820`,36]];
 /* 2026-11-18 使用者：路的邊界太明顯、像蚯蚓 → 不畫框線，只用淡淡的、被走亮的地面 */
 bws.forEach(([d,w])=>{g+=`<path d="${d}" fill="none" stroke="#e9dcc2" stroke-width="${w+26}" stroke-linecap="round" opacity=".45"/><path d="${d}" fill="none" stroke="#efe4cc" stroke-width="${w*.7}" stroke-linecap="round" opacity=".5"/>`});
 g+=`</g>`;
 /* 南邊入口：從上面走下來的石階（越近越寬） */
 for(let k=0;k<6;k++){const y=2150-k*20,w=80+k*0;g+=`<path d="M${STAIR.x-w},${y} H${STAIR.x+w} V${y-20} H${STAIR.x-w}Z" fill="${k%2?'#b8ab9a':'#c6baa8'}" stroke-width="1.8"/><path d="M${STAIR.x-w},${y-20} H${STAIR.x+w}" fill="none" stroke="#e0d6c6" stroke-width="2.4"/>`}
 g+=`<path d="M${STAIR.x-96},2160 V2030 Q${STAIR.x-96},2010 ${STAIR.x-80},2020 V2160Z M${STAIR.x+96},2160 V2030 Q${STAIR.x+96},2010 ${STAIR.x+80},2020 V2160Z" fill="#8e7a6a"/>`;
 /* 洞頂垂下來的鐘乳石（沿著北邊的洞壁） */
 for(let i=0;i<34;i++){const x=700+i*34+sr(-8,8);const top=CPTS.filter(p=>p[1]<800&&Math.abs(p[0]-x)<30).reduce((m,p)=>Math.min(m,p[1]),9999);if(top>900)continue;const y=top-20,h=sr(20,56),w=sr(7,13);
  g+=`<path d="M${f(x-w)},${f(y)} Q${f(x-w*.4)},${f(y+h*.6)} ${f(x)},${f(y+h)} Q${f(x+w*.4)},${f(y+h*.6)} ${f(x+w)},${f(y)}Z" fill="${pk(['#9a8676','#8e7a6a','#a6927e'])}" stroke-width="1.8"/><path d="M${f(x-w*.4)},${f(y+4)} Q${f(x-w*.2)},${f(y+h*.5)} ${f(x-1)},${f(y+h*.8)}" fill="none" stroke="#c4b09a" stroke-width="1.6" stroke-linecap="round"/>`}
 return `<g stroke="${OL}" stroke-width="2" stroke-linejoin="round">${g}</g>`}

/* ================= 6. 佈景美術 ================= */
const sh=(w,o=.14)=>`<ellipse cx="2" cy="2" rx="${w}" ry="${f(w*.16)}" fill="#000" opacity="${o}" stroke="none"/>`;
/* 石筍：從地上長出來的圓錐、一圈圈的紋 */
const stalag15=(s=1)=>{const h=sr(50,90)*s,w=sr(14,22)*s,c=pk(['#b8a48a','#a8947c','#c4b096']);let g=sh(w+6);
 g+=`<path d="M${f(-w)},0 Q${f(-w*.7)},${f(-h*.6)} ${f(-w*.15)},${f(-h)} Q0,${f(-h-4)} ${f(w*.15)},${f(-h)} Q${f(w*.7)},${f(-h*.6)} ${f(w)},0Z" fill="${c}"/>`;
 for(let k=1;k<4;k++){const y=-h*k/4.4,ww=w*(1-k/4.6);g+=`<path d="M${f(-ww)},${f(y)} Q0,${f(y+4)} ${f(ww)},${f(y)}" fill="none" stroke="#8e7a66" stroke-width="1.4"/>`}
 return g+`<path d="M${f(-w*.5)},-6 Q${f(-w*.4)},${f(-h*.5)} ${f(-w*.1)},${f(-h*.85)}" fill="none" stroke="#e0d0b8" stroke-width="2.4" stroke-linecap="round"/>`};
const rock15s=()=>`<ellipse cx="0" cy="3" rx="22" ry="5" fill="#000" opacity=".12" stroke="none"/><path d="M-20,2 Q-22,-10 -8,-14 Q8,-18 16,-8 Q22,-2 20,2Z" fill="#9a8a7a"/><path d="M-12,-6 Q-4,-14 6,-12" fill="none" stroke="#b8a898" stroke-width="2" stroke-linecap="round"/>`;
/* 洞窟菇：淡褐色的一叢小菇（不會發光，和要找的發光藍蘑菇不一樣） */
const fungus15=()=>sh(18,.1)+[[-9,0,.8],[8,0,.9],[0,-4,1.1]].map(([x,y,s])=>`<g transform="translate(${x},${y}) scale(${s})"><path d="M-2.4,0 Q-3,-6 -2,-9 H2 Q3,-6 2.4,0Z" fill="#f2e8d6"/><path d="M-9,-8 Q-9,-17 0,-17 Q9,-17 9,-8 Q0,-5 -9,-8Z" fill="${pk(['#c9a072','#b88a5a','#d8b488'])}"/></g>`).join('');
/* 水晶簇：紫色／水藍／透明，後面一圈淡淡的光（不用模糊濾鏡） */
const CRYC=[['#a77ad8','#d4b8f4','#7f56b0'],['#5fc8c8','#b8f0ee','#3f9a9e'],['#dceaf4','#ffffff','#9ab4c4'],['#e8b84a','#fbe39a','#b88a20']];
const crystal15=(ci,s=1)=>{const C=CRYC[ci??ri(0,2)];let g=`<ellipse cx="0" cy="${f(-34*s)}" rx="${f(46*s)}" ry="${f(44*s)}" fill="${C[1]}" opacity=".35" stroke="none"/>`+sh(34*s);
 g+=`<path d="M${f(-34*s)},2 Q${f(-36*s)},${f(-12*s)} ${f(-20*s)},${f(-14*s)} H${f(20*s)} Q${f(36*s)},${f(-12*s)} ${f(34*s)},2Z" fill="#8a7a6c"/>`;
 [[-18,40,-24,.7],[18,46,22,.75],[-6,74,-8,1],[8,60,10,.9],[-24,26,-40,.6],[26,30,40,.6]].forEach(([x,h,a,ww])=>{const W=9*ww*s,Hh=h*s,X=x*s;g+=`<g transform="rotate(${a} ${f(X)} ${f(-8*s)})"><path d="M${f(X-W)},${f(-8*s)} V${f(-8*s-Hh)} L${f(X)},${f(-8*s-Hh-W*1.3)} L${f(X+W)},${f(-8*s-Hh)} V${f(-8*s)}Z" fill="${C[0]}"/><path d="M${f(X)},${f(-8*s-Hh-W*1.3)} V${f(-8*s)}" fill="none" stroke="${C[2]}" stroke-width="1.4"/><path d="M${f(X-W*.5)},${f(-10*s)} V${f(-8*s-Hh+2)}" fill="none" stroke="${C[1]}" stroke-width="2.4" stroke-linecap="round"/></g>`});
 return g};
/* 掛燈柱：木柱掛一盞油燈，旁邊一圈暖光 */
const lamp15=()=>sh(10,.12)+`<circle cx="10" cy="-60" r="24" fill="#ffe9a0" opacity=".35" stroke="none"/><path d="M0,0 V-76 M0,-74 H14 V-70" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><path d="M0,0 V-76 M0,-74 H14 V-70" fill="none" stroke="${WOOD}" stroke-width="3.4" stroke-linecap="round"/><path d="M7,-68 H21 L19,-50 H9Z" fill="#ffd970"/><path d="M8,-68 L14,-73 L20,-68Z M9,-50 H19 V-47 H9Z" fill="#3a3a44"/><path d="M14,-66 V-52" fill="none" stroke="#e8a830" stroke-width="1.4"/>`;
/* 帳篷：A 字形帆布帳篷，門簾捲起來 */
const tent15=(c)=>{c=c||pk([['#e8823a','#c4602a'],['#5f9a5a','#3f7a3a'],['#4f86b0','#2f5f8a']]);return sh(52)+`<path d="M-50,0 L0,-66 L50,0Z" fill="${c[0]}"/><path d="M0,-66 L50,0 H34Z" fill="${c[1]}" stroke="none"/><path d="M-50,0 L0,-66 L50,0Z" fill="none"/><path d="M-14,0 L0,-46 L14,0Z" fill="#4a3a32"/><path d="M0,-46 L-14,0 M0,-46 Q-10,-30 -18,-30 Q-10,-24 -4,-28" fill="${c[1]}"/><path d="M0,-66 V-74" fill="none" stroke-width="2.4"/><path d="M-50,0 L-62,4 M50,0 L62,4" fill="none" stroke="#9a8a70" stroke-width="1.6"/>`};
/* 補給箱：橫木條＋鐵護角（不用打叉的木箱） */
const box15=()=>sh(22,.12)+`<rect x="-20" y="-26" width="40" height="26" fill="#c99a5b"/><path d="M-20,-17 H20 M-20,-8 H20" fill="none" stroke="#8a5a32" stroke-width="1.6"/><path d="M-20,-26 h7 v7 M20,-26 h-7 v7 M-20,0 h7 v-7 M20,0 h-7 v-7" fill="none" stroke="#5a5f68" stroke-width="3"/><rect x="-5" y="-15" width="10" height="5" rx="1.4" fill="#7a7f88" stroke-width="1.2"/>`;
const boxes15=()=>T(-14,0,1,box15())+T(16,2,.9,box15())+T(0,-24,.85,box15());
/* 營地桌：折疊桌上攤著地圖、放著水壺和放大鏡 */
const table15=()=>sh(40,.12)+`<path d="M-32,0 L-26,-26 M32,0 L26,-26 M-26,0 L-30,-26 M26,0 L30,-26" fill="none" stroke="#5a5f68" stroke-width="2.4"/><rect x="-38" y="-32" width="76" height="7" rx="2" fill="#d9b878"/><path d="M-30,-32 L-26,-38 H8 L4,-32Z" fill="#f1e2b8" stroke-width="1.4"/><path d="M-24,-35 q6,-2 10,0 q4,2 8,-1" fill="none" stroke="#8a6a3a" stroke-width="1.2" stroke-dasharray="2 2"/><path d="M14,-32 Q12,-46 22,-46 Q32,-46 30,-32Z" fill="#7a7f88"/><path d="M30,-40 q6,-2 6,4" fill="none" stroke-width="2"/><circle cx="22" cy="-50" r="5" fill="#fff" opacity=".7" stroke="none"/>`;
/* 告示牌：木牌上畫著洞窟和溫泉的圖示 */
const sign15=()=>sh(12,.12)+`<path d="M0,0 V-56" fill="none" stroke="${OL}" stroke-width="6.4" stroke-linecap="round"/><path d="M0,0 V-56" fill="none" stroke="${WOOD}" stroke-width="3.6" stroke-linecap="round"/><rect x="-28" y="-66" width="56" height="28" rx="4" fill="#d9b878"/><path d="M-20,-42 Q-20,-58 -10,-58 Q0,-58 0,-42Z" fill="#5a4a42"/><path d="M8,-46 q-3,-4 0,-8 q3,-4 0,-8 M14,-46 q-3,-4 0,-8 q3,-4 0,-8" fill="none" stroke="#d8413a" stroke-width="1.8" stroke-linecap="round"/><path d="M5,-44 H18" fill="none" stroke="#4f86b0" stroke-width="2.4"/>`;
/* 礦坑口：嵌在洞壁上的木框隧道，裡面黑黑的 */
const mineGate15=()=>`<path d="M-62,4 Q-70,-70 -30,-96 Q0,-110 30,-96 Q70,-70 62,4Z" fill="#7a675a"/><path d="M-40,2 V-62 Q0,-84 40,-62 V2Z" fill="#2b2420"/><path d="M-30,2 V-56 Q0,-72 30,-56 V2Z" fill="#1e1814" stroke="none"/>`+
 `<path d="M-42,4 V-64 M42,4 V-64" fill="none" stroke="${OL}" stroke-width="11" stroke-linecap="butt"/><path d="M-42,4 V-64 M42,4 V-64" fill="none" stroke="#8a5a32" stroke-width="7.6" stroke-linecap="butt"/><path d="M-50,-66 H50" fill="none" stroke="${OL}" stroke-width="12"/><path d="M-50,-66 H50" fill="none" stroke="#a8703f" stroke-width="8.6"/><path d="M-36,-66 V-60 M36,-66 V-60" fill="none" stroke="#5a5f68" stroke-width="2.4"/>`+
 `<path d="M-14,2 L-10,-30 M14,2 L10,-30" fill="none" stroke="#5e636c" stroke-width="3"/><path d="M-13,-6 H13 M-12,-16 H12" fill="none" stroke="#7a5a3a" stroke-width="3"/>`;
/* 大礦車（停在鐵軌上） */
const bigCart15=()=>sh(30,.14)+`<path d="M-30,-34 L-24,-8 H24 L30,-34Z" fill="#7a7f88"/><path d="M-28,-24 H28" fill="none" stroke="#5a5f68" stroke-width="1.6"/><circle cx="-16" cy="-6" r="7" fill="#3a3a3a"/><circle cx="16" cy="-6" r="7" fill="#3a3a3a"/><circle cx="-16" cy="-6" r="2.4" fill="#c9ccd0" stroke="none"/><circle cx="16" cy="-6" r="2.4" fill="#c9ccd0" stroke="none"/>`+
 `<circle cx="-14" cy="-38" r="7" fill="#9a8a7a"/><circle cx="2" cy="-40" r="8" fill="#a6927e"/><circle cx="16" cy="-37" r="6.4" fill="#8e7a6a"/><path d="M-30,-34 H30" fill="none" stroke-width="2.4"/>`;
/* 蒸氣：半透明白色雲團（只往上飄，不用濾鏡） */
const steam15=()=>[[-14,0,7],[2,-8,9],[16,2,7]].map(([x,y,rr])=>`<circle cx="${x}" cy="${y}" r="${rr}" fill="#fff" stroke="none" opacity=".7"/>`).join('')+`<circle cx="-2" cy="-18" r="6" fill="#fff" stroke="none" opacity=".55"/><circle cx="8" cy="-26" r="4.4" fill="#fff" stroke="none" opacity=".4"/>`;
/* 間歇泉：灰白色的泉華小丘、中間的噴口；點了才會噴出水柱（#gyJet15） */
const geyser15=()=>`<path d="M-62,4 Q-50,-14 -26,-26 Q-12,-34 0,-34 Q12,-34 26,-26 Q50,-14 62,4Z" fill="#e8dfcc"/><path d="M-44,-2 Q-30,-14 -14,-20 M44,-2 Q30,-14 14,-20 M-30,4 Q-20,-6 -8,-10 M30,4 Q20,-6 8,-10" fill="none" stroke="#c9bca0" stroke-width="2" stroke-linecap="round"/><path d="M-50,0 Q-36,-6 -24,-4" fill="none" stroke="#e0a868" stroke-width="2.6" stroke-linecap="round" opacity=".8"/><ellipse cx="0" cy="-30" rx="12" ry="5" fill="#5a6a70"/><ellipse cx="0" cy="-31" rx="7" ry="2.6" fill="#3a4a50" stroke="none"/>`+
 `<g id="gyJet15" style="opacity:0"><path d="M-9,-32 Q-14,-110 -6,-190 Q0,-206 6,-190 Q14,-110 9,-32Z" fill="#dff4f6" stroke="#9ac8d0" stroke-width="2"/><path d="M-3,-40 Q-5,-110 -1,-180" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="-20" cy="-176" r="14" fill="#fff" stroke="none" opacity=".85"/><circle cx="18" cy="-184" r="16" fill="#fff" stroke="none" opacity=".85"/><circle cx="0" cy="-204" r="16" fill="#fff" stroke="none" opacity=".9"/><circle cx="-30" cy="-150" r="5" fill="#bfe4ea" stroke-width="1.2"/><circle cx="30" cy="-140" r="4" fill="#bfe4ea" stroke-width="1.2"/><circle cx="26" cy="-160" r="3" fill="#bfe4ea" stroke-width="1.2"/></g>`+
 `<g class="gyIdle15">${T(0,-40,1,steam15())}</g>`;
/* 繩子圍欄（間歇泉周圍）：木樁＋垂下來的繩子 */
const rope15=(w=90)=>{let g='';const n=4;for(let i=0;i<=n;i++){const x=-w/2+i*w/n;g+=`<path d="M${f(x)},0 V-20" fill="none" stroke="${OL}" stroke-width="5.6" stroke-linecap="round"/><path d="M${f(x)},0 V-20" fill="none" stroke="${WOOD}" stroke-width="3.2" stroke-linecap="round"/>`;if(i<n)g+=`<path d="M${f(x)},-17 Q${f(x+w/n/2)},-9 ${f(x+w/n)},-17" fill="none" stroke="#e8d8b0" stroke-width="2"/>`}return g};
/* 溫泉裡泡湯的木桶小攤（煮溫泉蛋用）：竹簍吊在小溫泉池上 */
const eggPot15=()=>sh(26,.12)+`<ellipse cx="0" cy="-4" rx="26" ry="10" fill="#c9bfa6"/><ellipse cx="0" cy="-6" rx="20" ry="7" fill="#9fe0d6"/><path d="M-18,-6 L-14,-40 H14 L18,-6" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><path d="M-18,-6 L-14,-40 H14 L18,-6" fill="none" stroke="${WOOD}" stroke-width="2.6" stroke-linecap="round"/><path d="M0,-40 V-24" fill="none" stroke="#d9c8a0" stroke-width="1.6"/><path d="M-8,-24 H8 L6,-12 H-6Z" fill="#d6b06a"/><path d="M-7,-20 H7 M-6,-16 H6" fill="none" stroke="#a8803a" stroke-width="1"/>`;

/* ---- 人群小故事（每組點了說一句話）---- */
const shg=(w,o=.12)=>`<ellipse cx="2" cy="2" rx="${w}" ry="6" fill="#000" opacity="${o}" stroke="none"/>`;
const say=(t,inner)=>`<g data-say="${t}">${inner}</g>`;
const tie=c=>TIE(c);
/* 足湯：三個人坐在長木槽邊泡腳，外套脫下來放旁邊 */
const footG=()=>{let s=shg(70);
 s+=`<path d="M-76,-30 H76 V-22 H-76Z" fill="#a8703f"/>`;
 [[-44,'#c4473c','#e8dcc4'],[0,'#2f5f8a','#d88a6a'],[44,'#3f7a4a','#b08ac0']].forEach(([x,cc,sc],i)=>{s+=act(x,-16,i===1?-1:1,{view:'front',pose:'sit',top:'long',bottom:'pants',shirt:sc,pants:'#3b4a6a',hat:i===2?0:-1,mood:3,plain:true},'nod')});
 s+=`<rect x="-80" y="-14" width="160" height="22" rx="4" fill="#c99a5b"/><path d="M-80,-6 H80" fill="none" stroke="#8a5a32" stroke-width="1.6"/><path d="M-74,-14 H74" fill="none" stroke="#9fe0d6" stroke-width="5"/>`;
 s+=`<g transform="translate(-92,-8)"><path d="M-8,0 Q-10,-14 0,-16 Q10,-14 8,0Z" fill="#c4473c"/><path d="M-8,0 H8" fill="none"/></g>`;
 s+=`<g opacity=".6">${T(-30,-46,.7,steam15())}${T(36,-50,.6,steam15())}</g>`;
 return say('♨️ 外面在下大雪，這裡熱到要脫外套！',s)};
/* 煮溫泉蛋：一個人提著竹簍、一個小孩蹲著等 */
const eggG=()=>say('🥚 再等五分鐘，溫泉蛋就熟了！',shg(46)+T(0,0,1,eggPot15())+act(-36,4,1,{view:'side',pose:'reach',top:'long',bottom:'pants',shirt:'#e8dcc4',pants:'#5a4a3e',hat:0,mood:2,extra:tie('#c4473c'),plain:true},'nod')+act(36,6,-1,{view:'fq',pose:'crouch',top:'long',bottom:'pants',shirt:'#f2c230',pants:'#3b4a6a',hat:-1,mood:1,plain:true},'bend'));
/* 拍水晶：舉相機拍大水晶 */
const cam=`<rect x="8" y="-38" width="13" height="9" rx="2" fill="#3a3a44" stroke-width="1.2"/><circle cx="14.5" cy="-33.5" r="3" fill="#8fc4e8" stroke-width="1"/>`;
const photoG=()=>say('📸 這顆水晶比我的頭還大！',shg(40)+act(-14,0,1,{view:'side',pose:'hold',extra:cam+tie('#2f5f8a'),top:'long',bottom:'pants',shirt:'#d88a6a',pants:'#2b3a55',hat:-1,mood:2,plain:true},'nod')+act(20,4,-1,{view:'fq',pose:'up2',top:'long',bottom:'pants',shirt:'#6f9a8a',pants:'#5a4a3e',hat:0,mood:2,plain:true},'hop'));
/* 等間歇泉：小孩舉手數數，大人在旁邊 */
const waitG=()=>say('⏳ 數到十⋯它就會噴出來喔！',shg(40)+act(-16,0,1,{view:'bq',pose:'up',top:'long',bottom:'pants',shirt:'#f2c230',pants:'#3b4a6a',hat:0,plain:true},'hop')+act(18,2,-1,{view:'back',pose:'stand',top:'long',bottom:'pants',shirt:'#8a9ab0',pants:'#5a4a3e',hat:-1,extra:tie('#6a4a8a'),plain:true},'nod'));
/* 測泥漿溫度：地質學家把長溫度計伸進泥漿池 */
const longThermo=`<path d="M14,-22 L40,4" fill="none" stroke="${OL}" stroke-width="4.6" stroke-linecap="round"/><path d="M14,-22 L40,4" fill="none" stroke="#fbfbf6" stroke-width="2.6" stroke-linecap="round"/><circle cx="40" cy="4" r="3.4" fill="#e04a3a" stroke-width="1.2"/>`;
const measureG=()=>say('🌡️ 九十二度！不要靠太近喔。',shg(30)+act(0,0,1,{view:'side',pose:'reach',top:'long',bottom:'pants',shirt:'#c9a46a',pants:'#5a4a3e',hat:6,mood:1,extra:longThermo,plain:true},'nod'));
/* 坐礦車：小孩坐在礦車裡，大人在後面推 */
const cartG=()=>say('🛤️ 抓緊囉，礦車要出發了！',shg(50)+act(-4,-14,1,{view:'fq',pose:'up2',top:'long',bottom:'pants',shirt:'#e8823a',pants:'#3b4a6a',hat:HAT_MINER,mood:2,plain:true},'hop')+T(-4,0,1,`<path d="M-30,-34 L-24,-8 H24 L30,-34Z" fill="#7a7f88"/><path d="M-28,-24 H28" fill="none" stroke="#5a5f68" stroke-width="1.6"/><circle cx="-16" cy="-6" r="7" fill="#3a3a3a"/><circle cx="16" cy="-6" r="7" fill="#3a3a3a"/>`)+act(-46,2,1,{view:'side',pose:'reach',top:'long',bottom:'pants',shirt:'#6f9a8a',pants:'#2b3a55',hat:HAT_MINER,mood:2,extra:tie('#e0a030'),plain:true},'nod'));

/* ---- 佈景圖鑑（KIND）---- */
const dk=(id,w,h,cy=-12)=>({w,h,fn:()=>T(0,cy,1,DECOY[id])});
Object.assign(KIND,{
 stalag15:{w:44,h:80,fn:()=>stalag15()},rock15s:{w:44,h:20,fn:rock15s},fungus15:{w:40,h:24,fn:fungus15},
 crystal15:{w:90,h:96,fn:()=>crystal15()},lamp15:{w:44,h:80,fn:lamp15},tent15:{w:110,h:72,fn:()=>tent15()},
 boxes15:{w:70,h:50,fn:boxes15},box15:{w:44,h:28,fn:box15},table15:{w:80,h:56,fn:table15},sign15:{w:58,h:68,fn:sign15},
 mineGate15:{w:130,h:110,fn:mineGate15},bigCart15:{w:64,h:50,fn:bigCart15},steam15:{w:44,h:36,fn:steam15},
 geyser15:{w:126,h:44,fn:geyser15},rope15:{w:96,h:24,fn:()=>rope15()},eggPot15:{w:56,h:44,fn:eggPot15},
 hardhat15:dk('hardhat15',44,30,0),cheese15:dk('cheese15',40,28,0),onion15:dk('onion15',36,40,-4),pencil15:dk('pencil15',26,46,-4),
 umbrella15:dk('umbrella15',30,50,-6),barrow15:dk('barrow15',50,32,0),hoe15:dk('hoe15',36,40,-4),bluebell15:dk('bluebell15',36,36,-4),
 sock15:dk('sock15',30,40,-4),paper15:dk('paper15',44,26,0)});
['stalag15','crystal15','tent15','mineGate15','geyser15','lamp15','boxes15','table15','bigCart15'].forEach(k=>H.HEAVYX[N]?H.HEAVYX[N].add(k):(H.HEAVYX[N]=new Set([k])));
['stalag15','crystal15','tent15','boxes15','box15','table15','bigCart15','rock15s'].forEach(k=>H.OCCK.add(k));
H.ANIMX[N]={steam15:['bob']};
H.ALWAYSX[N]=new Set(['steam15']);

/* ================= 7. 區域、擺放、人數 ================= */
const late=()=>{
 const ok=l=>l.filter(([k])=>KIND[k]);
 Object.assign(POOL,{
  lake15:ok([['crystal15',.5],['stalag15',.8],['fungus15',1.2],['rock15s',1],['pebbles',.8],['bluebell15',0.15],['sock15',0.15],['umbrella15',0.15],['onion15',0.12],['paper15',0.1]]),
  mine15:ok([['stalag15',1],['box15',.6],['rock15s',1.2],['fungus15',.8],['lamp15',.25],['pebbles',1],['hardhat15',0.2],['hoe15',0.17],['barrow15',0.15],['umbrella15',0.15],['paper15',0.12]]),
  crystal15:ok([['crystal15',1.4],['stalag15',.8],['rock15s',.8],['fungus15',.6],['onion15',0.17],['cheese15',0.17],['hoe15',0.12],['bluebell15',0.12],['hardhat15',0.1]]),
  terrace15:ok([['stalag15',.7],['rock15s',1],['fungus15',1],['steam15',.4],['pebbles',.8],['bluebell15',0.15],['sock15',0.17],['cheese15',0.12],['pencil15',0.15],['umbrella15',0.1]]),
  center15:ok([['lamp15',.4],['rock15s',.8],['fungus15',1],['box15',.3],['pebbles',.6],['pencil15',0.15],['sock15',0.15],['paper15',0.15],['bluebell15',0.12],['hardhat15',0.12]]),
  geyser15:ok([['stalag15',.8],['rock15s',1.2],['steam15',.5],['crystal15',.25],['pebbles',.8],['cheese15',0.2],['pencil15',0.17],['onion15',0.12],['hoe15',0.1]]),
  camp15:ok([['box15',.8],['lamp15',.3],['rock15s',.8],['fungus15',.6],['barrel',.4],['pebbles',.6],['hardhat15',0.2],['paper15',0.2],['barrow15',0.17],['pencil15',0.15],['cheese15',0.12],['sock15',0.12]]),
  decor15:ok([['fungus15',1.4],['rock15s',1.2],['stalag15',.6],['pebbles',1]])});
 const v=o=>Object.fromEntries(Object.entries(o).filter(([k])=>KIND[k]));
 Object.assign(VPLAN,{lake15:v({walker:4,chat:3,handInHand:2,reading:1}),mine15:v({walker:3,chat:2,carryBox:2}),crystal15:v({walker:4,chat:3,handInHand:1}),
  terrace15:v({walker:4,chat:3,handInHand:1}),center15:v({walker:5,chat:4,handInHand:2,benchPair:1}),geyser15:v({walker:3,chat:3,handInHand:1}),
  camp15:v({walker:7,chat:5,carryBox:3,handInHand:2,reading:1})})};

function structures(){
 late();
 /* 北：地底湖邊的水晶，西北礦坑口、鐵軌上的大礦車、坐礦車的小孩 */
 add(MINE.x,MINE.y,130,110,'mineGate15',mineGate15(),{sh:.9});
 add(MINE.x+250,MINE.y+218,64,50,'bigCart15',bigCart15());
 add(MINE.x+150,MINE.y+176,110,70,'cartG15',cartG());
 [[1010,650,1,.8],[1490,660,0,.9],[1560,560,2,1],[1660,640,0,1.15],[1760,760,1,1],[1600,860,2,.9],[1740,900,0,.8],[1050,560,0,.7]].forEach(([x,y,c,s])=>add(x,y,90*s,96*s,'crystal15',crystal15(c,s),{sh:.9}));
 add(1660,780,90,70,'photoG15',photoG());
 /* 西：彩色溫泉梯田，旁邊煮溫泉蛋 */
 TERR.forEach(([x,y,a],i)=>add(x+(i%2?40:-30),y-4,44,36,'steam15',steam15(),{mark:false}));
 add(1080,1560,80,60,'eggG15',eggG());
 /* 東：泥漿池、間歇泉（繩子圍欄）、等間歇泉的人、測溫度的地質學家 */
 add(GEY.x,GEY.y,126,44,'geyser15',geyser15(),{sh:.8});
 [[GEY.x-120,GEY.y+40],[GEY.x+122,GEY.y+36]].forEach(([x,y])=>add(x,y,96,24,'rope15',rope15()));
 add(1540,1440,70,70,'waitG15',waitG());
 add(1480,1080,60,70,'measureG15',measureG());
 MUD.forEach(([x,y])=>add(x+10,y-6,44,36,'steam15',steam15(),{mark:false}));
 /* 中：足湯 */
 add(FOOT.x,FOOT.y,180,70,'footG15',footG(),{mark:true});
 /* 南：探險營地（帳篷、補給箱、營地桌、告示牌、掛燈） */
 [[800,1760,0],[960,1720,1],[1560,1730,2],[1720,1770,0]].forEach(([x,y,i])=>add(x,y,110,72,'tent15',tent15([['#e8823a','#c4602a'],['#5f9a5a','#3f7a3a'],['#4f86b0','#2f5f8a']][i])));
 add(1100,1900,70,50,'boxes15',boxes15());add(1420,1920,70,50,'boxes15',boxes15());
 add(1400,1700,80,56,'table15',table15());
 add(STAIR.x-130,2010,58,68,'sign15',sign15());
 [[STAIR.x-110,2060],[STAIR.x+110,2060],[STAIR.x-40,1640],[STAIR.x+40,1400],[STAIR.x-40,1160],[STAIR.x+40,920],[1000,1810],[1500,1810]].forEach(([x,y])=>add(x,y,44,80,'lamp15',lamp15()));
 /* 小故事要放的固定位置先佔好 */
 mark(STAIR.x,2160,220,150,1);mark(MINE.x+78,MINE.y+24,44,50,1);mark(1150,1720,40,64,1);mark(1560,1880,40,64,1);
 /* 石筍：沿著洞壁、空地補幾根 */
 for(let i=0;i<26;i++){const x=sr(660,1860),y=sr(560,2020);if(canPlace(x,y,44,80,false,.7)&&!H.WATERFN[N](x,y))add(x,y,44,80,'stalag15',stalag15(sr(.8,1.2)),{sh:.8})}
}
function scatterAll(){
 const S=H.dbg.storySp();
 if(S){moveSp(S.giver,[1150,1724]);moveSp(S.target,[MINE.x+78,MINE.y+26]);moveSp(S.helper,[1560,1884])}
 scatter('lake15',POOL.lake15,2400,48);scatter('mine15',POOL.mine15,2600,52);scatter('crystal15',POOL.crystal15,2800,52);
 scatter('terrace15',POOL.terrace15,3000,52);scatter('center15',POOL.center15,2400,48);scatter('geyser15',POOL.geyser15,3000,52);
 scatter('camp15',POOL.camp15,3400,52);
 scatter('all15',POOL.decor15,6000,90);
}
function moveSp(sp,p){if(!sp||!p)return;sp.svg=sp.svg.replace(/translate\([^)]*\)/,`translate(${f(p[0])},${f(p[1])})`).replace(/data-x="[^"]*" data-y="[^"]*"/,`data-x="${f(p[0])}" data-y="${f(p[1])}"`);sp.x=p[0];sp.y=p[1]}
SCENE_IMPL[N]={ground,structures,scatter:scatterAll};
Object.assign(HOSTN,{stalag15:'石筍',crystal15:'水晶',tent15:'帳篷',boxes15:'補給箱',table15:'營地桌',lamp15:'掛燈',mineGate15:'礦坑口',bigCart15:'大礦車',fungus15:'洞窟菇',sign15:'告示牌'});
['stalag15','crystal15','tent15','boxes15','table15','lamp15','mineGate15','bigCart15','fungus15','sign15'].forEach(k=>HOSTK.add(k));
/* 物件的合理位置 */
H.SPOTS[N]={
 headlamp15:[['tent15',.3,.4],['mineGate15',.5,.2],['boxes15',.5,-.4]],
 sulfur15:[['geyser15',.5,.2],['stalag15',.5,.3],['crystal15',.5,.4]],
 geode15:[['crystal15',.45,.4],['table15',.3,-.6],['boxes15',.55,.3]],
 thermo15:[['geyser15',.45,-.3],['table15',.2,-.6],['lamp15',.6,.2]],
 bat15:[['stalag15',.4,-.5],['mineGate15',.3,-.4],['lamp15',.5,-.6]],
 cart15:[['bigCart15',.6,.3],['mineGate15',.5,.3],['boxes15',.6,.2]],
 pick15:[['mineGate15',.55,.2],['boxes15',.6,.1],['crystal15',.5,.3]],
 shroom15:[['fungus15',.5,.2],['stalag15',.5,.3],['crystal15',.5,.5]],
 salamander15:[['rock15s',.5,.3],['stalag15',.45,.4],['fungus15',.6,.2]],
 map15:[['table15',.2,-.6],['tent15',.4,.4],['sign15',.4,.3]],
 tub:[['tent15',.4,.4],['boxes15',.5,.2],['lamp15',.5,.3]],
 egg:[['eggG15',.4,.3],['table15',.3,-.5],['rock15s',.5,.3]]};
H.BLEND[N]={headlamp15:['hardhat15','lamp15'],sulfur15:['cheese15','crystal15'],geode15:['onion15','crystal15'],thermo15:['pencil15','lamp15'],bat15:['umbrella15','stalag15'],
 cart15:['barrow15','bigCart15'],pick15:['hoe15','boxes15'],shroom15:['bluebell15','fungus15'],salamander15:['sock15','rock15s'],map15:['paper15','table15'],
 tub:['box15','boxes15'],egg:['rock15s','pebbles']};

/* ================= 8. 連環小故事：頭燈沒電的小鼴鼠 ================= */
/* 小鼴鼠（故事目標）：灰褐色圓圓的、粉紅鼻子和大爪子，戴一頂黃色小頭燈（沒電，燈是灰的） */
const mole15=()=>`<ellipse cx="0" cy="2" rx="18" ry="4" fill="#000" opacity=".15" stroke="none"/><ellipse cx="0" cy="-14" rx="16" ry="15" fill="#7a6a62"/><ellipse cx="0" cy="-8" rx="9" ry="7" fill="#9a8a80" stroke="none"/>`+
 `<path d="M-15,-6 q-7,2 -6,7 q4,1 8,-2Z M15,-6 q7,2 6,7 q-4,1 -8,-2Z" fill="#f0b0b0" stroke-width="1.4"/><path d="M-19,0 l-2,3 M-17,1 l-1,3 M19,0 l2,3 M17,1 l1,3" fill="none" stroke-width="1.1"/>`+
 `<circle cx="-5.6" cy="-18" r="1.7" fill="${OL}" stroke="none"/><circle cx="5.6" cy="-18" r="1.7" fill="${OL}" stroke="none"/><ellipse cx="0" cy="-13" rx="4" ry="3" fill="#f08a9a"/><path d="M-3,-9 Q0,-7 3,-9" fill="none" stroke-width="1.1"/>`+
 `<path d="M-13,-24 Q-13,-38 0,-38 Q13,-38 13,-24Z" fill="#f2c230"/><rect x="-15.4" y="-26" width="30.8" height="4" rx="2" fill="#e0a820" stroke-width="1.4"/><circle cx="0" cy="-31" r="4" fill="#9a9a9a" stroke-width="1.4"/><path d="M-2,-33 l4,4" fill="none" stroke="#6a6a6a" stroke-width="1"/>`;
const lantern=`<path d="M12,-26 V-20" fill="none" stroke-width="1.4"/><circle cx="12" cy="-12" r="11" fill="#ffe9a0" opacity=".45" stroke="none"/><path d="M6,-20 H18 L17,-4 H7Z" fill="#ffd970"/><path d="M7,-20 L12,-25 L17,-20Z M7,-4 H17 V-1 H7Z" fill="#3a3a44"/>`;
const hammer=`<path d="M12,-22 L20,-6" fill="none" stroke="${OL}" stroke-width="4.4" stroke-linecap="round"/><path d="M12,-22 L20,-6" fill="none" stroke="${WOOD2}" stroke-width="2.4" stroke-linecap="round"/><path d="M6,-20 L16,-26 L18,-22 L8,-17Z" fill="#9aa2ac" stroke-width="1.3"/>`;
STORIES[N]={title:'頭燈沒電的小鼴鼠',who:'地質學家姊姊',
 giver:()=>act(0,0,1,{view:'fq',pose:'hold',hat:6,hair:'#6a4a30',mood:2,top:'long',bottom:'pants',shirt:'#c9a46a',pants:'#5a4a3e',skin:'#f0c8a0',extra:hammer+TIE('#2f5f8a'),plain:true}),
 target:()=>mole15(),tw:40,th:44,
 helper:()=>act(0,0,1,{view:'side',pose:'hold',hat:HAT_MINER,mood:1,top:'long',bottom:'pants',shirt:'#6f9a8a',pants:'#3b4a6a',skin:'#c98d5e',beard:true,hair:'#bdb8b0',hs:3,extra:lantern,plain:true}),hw:40,hh:64,
 ask:'地質學家姊姊：我的小鼴鼠助手不見了！牠戴著黃色小頭燈，最會找礦石了。',
 need:'小鼴鼠：嗚⋯頭燈沒電了，礦坑口好黑，我不敢走。營地那邊有個提著大燈的礦工伯伯⋯',
 got:'礦工伯伯：這盞提燈先借牠！有光就不怕了。',
 ok:'小鼴鼠提著小提燈，搖搖晃晃走出來了。快帶牠回去找地質學家姊姊！'};

/* ================= 9. 冒險地圖（雪山溫泉村旁邊的洞口，找到之後才出現）與過場 ================= */
/* 2026-11-18 使用者：洞窟在地底，不畫在地面的冒險地圖上（之後再討論放哪裡）。HERE、mapHook 都不設。 */
/* 過場：從背後看，順著石階往下走，兩邊掛燈往後退，前面越來越暖、越來越亮 */
RIDES.stairs15={text:'順著石階往下走，越走越暖和⋯',every:400,tick:k=>tone(k%2?262:220,.05,'triangle',.04),
 svg:()=>{const VX=200,VY=236,ds=[];for(let k=0;k<26;k++)ds.push(1400/Math.pow(1.25,k));
  const fy=d=>VY+.40*d,hw=d=>.50*d,cy=d=>VY-.62*d,kh=d=>.07*d; /* 地面高度、半寬、洞頂、側邊石框（階梯側面）高度 */
  let st='',wl='',lm='';
  for(let k=0;k<ds.length-1;k++){const a=ds[k],b=ds[k+1],ya=fy(a),yb=fy(b),m=yb+(ya-yb)*.32;
   /* 一階：後段比較暗（上一階的影子）、前緣亮亮的石頭邊 */
   st+=`<path d="M${f(VX-hw(a))},${f(ya)} H${f(VX+hw(a))} L${f(VX+hw(b))},${f(yb)} H${f(VX-hw(b))}Z" fill="#cfc2ac" stroke="none"/>`;
   st+=`<path d="M${f(VX-hw(b))},${f(yb)} H${f(VX+hw(b))} L${f(VX+hw(a)-(hw(a)-hw(b))*.68)},${f(m)} H${f(VX-hw(a)+(hw(a)-hw(b))*.68)}Z" fill="#8e7f6c" stroke="none"/>`;
   st+=`<path d="M${f(VX-hw(a))},${f(ya)} H${f(VX+hw(a))}" fill="none" stroke="#efe6d4" stroke-width="${f(Math.max(.6,a/90))}"/><path d="M${f(VX-hw(a))},${f(ya+a/160)} H${f(VX+hw(a))}" fill="none" stroke="#5a4a3e" stroke-width="${f(Math.max(.4,a/220))}"/>`;
   /* 兩邊的石框：上緣一階一階往下（看得出階梯的側面） */
   [-1,1].forEach(sd=>{const xa=VX+sd*hw(a),xb=VX+sd*hw(b),xi=VX+sd*(hw(a)-.06*a),xj=VX+sd*(hw(b)-.06*b);
    st+=`<path d="M${f(xa)},${f(ya)} L${f(xa)},${f(ya-kh(a))} L${f(xb)},${f(yb-kh(a)*.8)} L${f(xb)},${f(yb-kh(b))} L${f(xj)},${f(yb-kh(b))} L${f(xj)},${f(yb)} L${f(xi)},${f(ya)}Z" fill="${sd<0?'#a8987f':'#968670'}" stroke="#4a3c34" stroke-width="${f(Math.max(.4,a/260))}"/>`;
    /* 牆上的石塊縫（直的接縫） */
    wl+=`<path d="M${f(xa)},${f(ya-kh(a))} V${f(cy(a))}" fill="none" stroke="#3e322c" stroke-width="${f(Math.max(.4,a/200))}"/>`;
    if(k%2===0){const x=VX+sd*hw(a)*.97,y=VY-.12*a,rr=a*.04;lm+=`<path d="M${f(VX+sd*hw(a))},${f(y-rr*2.2)} H${f(x)}" fill="none" stroke="#2b2420" stroke-width="${f(Math.max(.6,rr/2.4))}"/><circle cx="${f(x-sd*rr*.4)}" cy="${f(y)}" r="${f(rr*3.2)}" fill="#ffe9a0" opacity=".3" stroke="none"/><path d="M${f(x-sd*rr*.4-rr)},${f(y-rr*1.3)} H${f(x-sd*rr*.4+rr)} L${f(x-sd*rr*.4+rr*.8)},${f(y+rr*1.4)} H${f(x-sd*rr*.4-rr*.8)}Z" fill="#ffd970" stroke="#2b2420" stroke-width="${f(Math.max(.5,rr/5))}"/>`}})}
  /* 牆上的橫向石塊縫：從消失點放射出去 */
  let rays='';[-1,1].forEach(sd=>[-.5,-.3,-.1,.1,.24].forEach(t=>{const d=1400;rays+=`<path d="M${VX},${VY} L${f(VX+sd*hw(d))},${f(VY+t*d)}" fill="none" stroke="#3e322c" stroke-width="1.4" opacity=".7"/>`}));
  let s=`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><style>.zm15{transform-origin:${VX}px ${VY}px;animation:zm15 .9s linear infinite}@keyframes zm15{from{transform:scale(1)}to{transform:scale(1.25)}}.wk15{animation:wk15 .45s ease-in-out infinite alternate}@keyframes wk15{from{transform:translateY(0)}to{transform:translateY(7px)}}.st15{animation:st15 2.6s ease-out infinite}@keyframes st15{from{transform:translateY(0);opacity:.8}to{transform:translateY(-120px);opacity:0}}.gl15{transform-origin:${VX}px ${VY}px;animation:gl15 4.4s ease-in forwards}@keyframes gl15{from{transform:scale(.6)}to{transform:scale(2.2)}}</style>`;
  s+=`<g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect width="400" height="600" fill="#4a3c36" stroke="none"/>`;
  /* 洞頂（最暗）、左牆（亮一點）、右牆（暗一點） */
  s+=`<path d="M-400,-400 L${VX},${VY} L800,-400Z" fill="#33292a" stroke="none"/><path d="M-400,-400 L${VX},${VY} L-400,1200Z" fill="#6a584c" stroke="none"/><path d="M800,-400 L${VX},${VY} L800,1200Z" fill="#584a40" stroke="none"/><path d="M-400,1200 L${VX},${VY} L800,1200Z" fill="#5a4a40" stroke="none"/>`;
  s+=`<g class="gl15"><circle cx="${VX}" cy="${VY}" r="60" fill="#ffcf7a" opacity=".3" stroke="none"/><circle cx="${VX}" cy="${VY}" r="26" fill="#ffd98a" opacity=".7" stroke="none"/><circle cx="${VX}" cy="${VY}" r="10" fill="#fff4d0" stroke="none"/></g>`;
  s+=rays+`<g class="zm15">${wl}${st}${lm}</g>`;
  s+=[[50,0],[120,8],[280,4],[350,0],[200,0]].map(([x,y],i)=>`<path d="M${x-12},${y} Q${x-5},${y+30+i*6} ${x},${y+46+i*8} Q${x+5},${y+30+i*6} ${x+12},${y}Z" fill="#6e5d52"/>`).join('');
  s+=[[150,360,0],[250,390,.8],[200,320,1.6]].map(([x,y,d])=>`<g class="st15" style="animation-delay:${d}s">${T(x,y,1.4,steam15())}</g>`).join('');
  /* 主角：從背後看，一階一階往下走（影子落在下一階） */
  s+=`<g transform="translate(200,500)"><ellipse cx="0" cy="40" rx="34" ry="8" fill="#000" opacity=".25" stroke="none"/><g class="wk15"><g transform="scale(2.1)">${kid({view:'back',pose:'stand',hat:6,skin:'#f0c8a0',hair:'#4a3a32',shirt:'#e8dcc4',top:'long',bottom:'pants',pants:'#3b4a6a',arm:0,extra:TIE('#c4473c'),plain:true})}</g></g></g>`;
  return s+`</g></svg>`}};

/* ================= 10. 場景彩蛋：點間歇泉 → 噴出一道水柱 ================= */
let gyBusy=0;
H.TAPHOOKS[N]=(x,y)=>{
 if(Math.abs(x-GEY.x)>64||y>GEY.y+10||y<GEY.y-60)return false;if(gyBusy)return true;
 const el=document.getElementById('gyJet15');if(!el)return false;gyBusy=1;
 try{tone(180,.25,'sawtooth',.03);setTimeout(()=>tone(520,.3,'sine',.035),180)}catch(_){}
 H.toast('💦 噗嘶——！間歇泉噴發了！',1600);
 const t0=performance.now(),D=1900,bx=0,by=-32;
 const step=t=>{const k=Math.min(1,(t-t0)/D),up=k<.25?k/.25:k>.7?1-(k-.7)/.3:1,sy=.15+.85*up;
  el.setAttribute('transform',`translate(${bx},${f(by-by*sy)}) scale(1,${f(sy)})`);el.style.opacity=f(Math.min(1,up*1.4));
  if(k<1)requestAnimationFrame(step);else{el.style.opacity=0;gyBusy=0}};
 requestAnimationFrame(step);return true};
})();

/* ================= 出口：第 3 關雪山溫泉村，溫泉平台東邊的「溫泉邊洞口」（引擎 11-17b「找路發現新關卡」） =================
   levels.js 這一關有 find:{after:10,from:3,hint:[…]}：第 10 關拿到 2 顆星之後，第 3 關溫泉平台東邊冒出一個冒蒸氣、會閃光的洞口，
   地質學家（頭上「…」）站在洞口旁；點她 → 「要順著石階走下去嗎？」→ 出發才算發現。
   RESERVE 只在這個檔案載入時才佔位置，所以還不能發現之前，第 3 關完全不變。 */
(function(){
const H=window.TH;if(!H)return;const N=15;const {T,f,OL,act}=H;
const EX={x:2104,y:1650};
(H.RESERVE[3]||(H.RESERVE[3]=[])).push([EX.x,EX.y+6,170,130]);
let geo='';const geoSvg=()=>geo||(geo=act(0,0,-1,{view:'fq',pose:'stand',hat:6,skin:'#f0c8a0',hair:'#6a4a30',shirt:'#c9a46a',pants:'#5a4a3e',top:'coat',bottom:'pants',scarf:'#c4473c',mood:2,plain:true}));
const puff=(x,y,r,d)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="none" opacity=".8"><animate attributeName="cy" values="${y};${y-30}" dur="2.4s" begin="${d}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".85;0" dur="2.4s" begin="${d}s" repeatCount="indefinite"/></circle>`;
const cave=found=>`<ellipse cx="0" cy="4" rx="74" ry="12" fill="#000" opacity=".15" stroke="none"/>`+
 (found?'':`<ellipse cx="0" cy="-40" rx="62" ry="54" fill="#ffd98a" stroke="none" opacity=".2"><animate attributeName="opacity" values=".08;.45;.08" dur="1.6s" repeatCount="indefinite"/></ellipse>`)+
 `<path d="M-70,4 Q-76,-46 -46,-80 Q-10,-104 30,-90 Q66,-74 72,-30 Q76,-8 70,4Z" fill="#8e7a6a"/><path d="M-60,-30 Q-50,-60 -24,-76 M40,-74 Q60,-56 62,-30" fill="none" stroke="#a8947e" stroke-width="3" stroke-linecap="round"/>`+
 `<path d="M-52,-58 Q-30,-96 10,-96 Q44,-92 60,-66 Q40,-78 10,-80 Q-24,-80 -52,-58Z" fill="#fbfaf6"/>`+
 `<path d="M-34,4 V-40 Q-30,-66 0,-68 Q30,-66 34,-40 V4Z" fill="#2b2420"/><path d="M-30,4 V-36 Q0,-60 30,-36 V4Z" fill="${found?'#3a2a20':'#6a4020'}" stroke="none">${found?'':'<animate attributeName="fill" values="#3a2a20;#a8642a;#3a2a20" dur="1.6s" repeatCount="indefinite"/>'}</path>`+
 `<path d="M-26,4 H26 V-4 H-26Z M-22,-4 H22 V-11 H-22Z M-18,-11 H18 V-17 H-18Z" fill="#b8ab9a" stroke-width="1.4"/>`+
 `<g transform="translate(-48,2)"><path d="M0,0 V-46 M0,-44 H10 V-40" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><path d="M0,0 V-46 M0,-44 H10 V-40" fill="none" stroke="#a8703f" stroke-width="2.6" stroke-linecap="round"/><circle cx="10" cy="-32" r="12" fill="#ffe9a0" opacity=".45" stroke="none"/><path d="M5,-39 H15 L14,-26 H6Z" fill="#ffd970"/></g>`+
 puff(-6,-74,9,0)+puff(8,-80,11,.8)+puff(-14,-84,7,1.6);
/* 2026-11-18 使用者：入口角色頭上從「？」改成「…」（和一般路人一樣，增加探索難度）；圓點半徑 1.75，不會被當成路人提示（DOTSIG） */
const svg=found=>cave(found)+T(48,6,1,(found?'':`<g class="qbob">${H.bubble(14,-74,'dots').replace(/r="1\.7"/g,'r="1.75"')}</g>`)+geoSvg());
const pv=()=>`<svg viewBox="0 0 220 110" width="220" height="110" style="display:block"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect width="220" height="110" rx="10" fill="#4a3c36" stroke="none"/><path d="M0,0 L110,40 L220,0Z" fill="#3e322d" stroke="none"/><circle cx="110" cy="40" r="30" fill="#ffcf7a" opacity=".4" stroke="none"/><circle cx="110" cy="40" r="12" fill="#fff4d0" stroke="none"/>`+
 [0,1,2,3,4].map(k=>{const a=110/Math.pow(1.35,k),b=110/Math.pow(1.35,k+1);return `<path d="M${f(110-.9*a)},${f(40+.64*a)} H${f(110+.9*a)} L${f(110+.9*b)},${f(40+.64*b)} H${f(110-.9*b)}Z" fill="${k%2?'#b8ab9a':'#cfc3b0'}" stroke-width="1.2"/>`}).join('')+
 `<circle cx="40" cy="44" r="16" fill="#ffe9a0" opacity=".35" stroke="none"/><path d="M34,38 H46 L45,54 H35Z" fill="#ffd970"/><circle cx="180" cy="44" r="16" fill="#ffe9a0" opacity=".35" stroke="none"/><path d="M174,38 H186 L185,54 H175Z" fill="#ffd970"/><circle cx="96" cy="70" r="8" fill="#fff" opacity=".6" stroke="none"/><circle cx="124" cy="64" r="10" fill="#fff" opacity=".5" stroke="none"/></g></svg>`;
H.EXITS[N]={x:EX.x,y:EX.y,w:170,h:110,svg,ask:{pv,title:'要順著石階走下去嗎？',
 text:'地質學家姊姊：溫泉底下有一個好大的地熱洞窟！有彩色的溫泉梯田、會噴水的間歇泉，還有閃閃發亮的水晶。<br>要不要一起下去看看？',again:'地質學家姊姊：又要下去洞窟嗎？<br>掛燈都點好了，跟我來！',
 go:'🕯️ 順著石階走下去',wait:'之後再說',waitMsg:'地質學家姊姊：好，我在洞口等你，準備好再來找我！'}};
})();
