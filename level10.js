/* 奇幻小鎮大搜查．第 10 關 高山滑雪場（雪山系列第 1 關；從第 3 關雪山溫泉村搭包廂纜車往上）
   原本暫時編號 902，2026-11-12 接成第 10 關（只改 const N；名字後綴的 902 不用改）。
   主帳號合併時加：冒險地圖（溫泉村正北）、過場 RIDES.gondola（跟著車廂往上，松林→穿過雲海→藍天樹冰）。BORROW 不借（使用者決定）。
   場景座標：x 500～2200、y 0～2700。上北下南：
   山頂纜車站＋樹冰林（北）→ 雪道中段（S 型雪痕、吊椅、壓雪車、造雪機、橘色安全網）→ 山屋露台（中南）
   → 兩側掛雪松林（西南／東南）→ 新手坡底（最南，彩蛋「下一個！」）。
   借用第 3 關的佈景與路人（pineS、rockS、snowMound、woodpile、sled、acorn、coffee、walker3、boarder、skier⋯），
   主線開機時第 1～8 關都會先載入，所以拿得到。 */
(function(){
const H=window.TH;if(!H)return;
const N=10;
const {T,f,r,sr,pk,ri,OL,SNOW,SKIN,kid,chibi,act,wrapAn,pickView,walkPose,add,mark,canPlace,scatter,skyBirds,limb,shade,chaikin,
 KIND,POOL,VPLAN,REG,SCREG,LEVELS,ART,DECOY,SCENE_IMPL,WATERFN,HERE,OUTFITS,STORIES,HOSTK,HOSTN,OCCK,SCATOK,SCATREG,ROADS,
 TAPHOOKS,NGHOOKS,sprites,occ,CELL,GC,GR,tone,toast,typeOf,steamPuff,cabinSVG,pineS,swirl,campfire,bench,lamp,stall,crate,barrel,heart,peekHead}=H;

/* ================= 1. 場景範圍、天空、場地邊緣 ================= */
const X0=500,X1=2200,Y1=2700;
H.SCENES[N]={x0:X0,x1:X1,y1:Y1,c:[1350,1560]};
H.TARGET[N]=330;
H.SKYC[N]='#cfdeeb';H.SKYY[N]=440;
H.EDGEM[N]='LRB';H.EDGED[N]='LRB';
H.EDGEDECO[N]=[['pineS',3],['snowMound',1.6],['rockS',.5]];
H.FRINGE[N]=[['edgeTree902',2.2],['snowMound',2.4],['rockS',.8]];
H.DENS[N]=1.33;
H.FRINGEX[N]=[[600,1460,1130,2000],[700,540,1060,800],[1150,2180,1570,2640],[1700,880,2210,2710]]; /* 東邊樹林留給人滑雪：邊緣不另外種 */ /* 山屋＋露台、纜車站、新手坡不種邊緣的樹 */
HERE[N]=[278,52];

/* ================= 2. 穿著：沿用第 3 關的羽絨外套、圍巾、手套、靴子，再加護目鏡、安全帽 ================= */
const HELMC=['#3fa8a0','#e86a3a','#2b2420','#5a86b0','#f5f5f0','#c4473c'],LENSC=[['#f5b040','#e8708a'],['#9fe0f0','#5a86d0'],['#f0d040','#e88a30'],['#c8b0f0','#8a6ad0']];
/* 頭在 (0,-34)、半徑約 18（kid 的頭放大 1.385 倍） */
function gogG(view,lc,down){if(down)return `<g transform="translate(0,${view==='side'||!view?13:15})">${gogG(view,lc)}</g>`;const[a,b]=lc||pk(LENSC);
 if(view==='back'||view==='bq')return `<path d="M-19,-43 Q0,-38 19,-43" fill="none" stroke="${OL}" stroke-width="4.6"/><path d="M-19,-43 Q0,-38 19,-43" fill="none" stroke="#3d3833" stroke-width="2.6"/>`;
 if(view==='side'||!view)return `<path d="M-18,-42 Q-6,-48 6,-46" fill="none" stroke="${OL}" stroke-width="4.6"/><path d="M-18,-42 Q-6,-48 6,-46" fill="none" stroke="#3d3833" stroke-width="2.6"/><rect x="4" y="-50" width="13" height="9" rx="4" fill="${b}" stroke-width="1.6"/><path d="M5,-46 Q10,-50 16,-47 L16,-49 Q10,-51 5,-48Z" fill="${a}" stroke="none"/>`;
 const dx=view==='fq'?2:0;
 return `<g transform="translate(${dx},0)"><path d="M-19,-43 Q0,-48 19,-43" fill="none" stroke="${OL}" stroke-width="4.6"/><path d="M-19,-43 Q0,-48 19,-43" fill="none" stroke="#3d3833" stroke-width="2.6"/><rect x="-11" y="-51" width="22" height="10" rx="5" fill="${b}" stroke-width="1.6"/><path d="M-10,-46 Q0,-52 10,-46 L10,-49 Q0,-53 -10,-49Z" fill="${a}" stroke="none"/><path d="M-6,-43 l4,-5" fill="none" stroke="#fff" stroke-width="1.3"/></g>`}
function helmetG(view,c){const d=shade(c,-.25);
 let g=`<path d="M-19.5,-37 Q-21,-59 0,-59 Q21,-59 19.5,-37 Q0,-44 -19.5,-37Z" fill="${c}"/><path d="M-6,-56 v5 M0,-57.5 v5 M6,-56 v5" fill="none" stroke="${d}" stroke-width="2"/><path d="M-14,-50 Q-10,-56 -3,-57" fill="none" stroke="#fff" stroke-width="1.6" opacity=".6"/>`;
 if(!(view==='side'||!view))g+=`<ellipse cx="-18" cy="-32" rx="3" ry="5.5" fill="${d}" stroke-width="1.4"/><ellipse cx="18" cy="-32" rx="3" ry="5.5" fill="${d}" stroke-width="1.4"/>`;
 return g}
const L3O=OUTFITS[3];
/* 滑雪的人（GEAR=1 在滑、2 拿著雪板沒在滑）：一律戴安全帽＋護目鏡；戴魔法帽（HATS 2、3）的保留帽子，但護目鏡一樣要戴（2026-11-12 使用者） */
let GEAR=0;const withGear=(m,fn)=>{const g0=GEAR;GEAR=m;try{return fn()}finally{GEAR=g0}};
const HASGOG='M-15,-35 Q-6,-38 3,-34'; /* 第 3 關 boarder 自己畫的護目鏡 */
OUTFITS[N]=o=>{if(o.top)return o;const free=o.hat===undefined&&!o.nogear;if(L3O)o=L3O(o);else{o.top='coat'}
 if(GEAR&&!o.nogear){const magic=o.hat===2||o.hat===3;let ex=o.extra||'';if(!magic){o.hat=-1;ex+=helmetG(o.view,pk(HELMC))}if(!ex.includes(HASGOG))ex+=gogG(o.view,null,GEAR===1||magic);o.extra=ex;return o}
 if(free){const q=r();if(q<.26){o.hat=-1;o.extra=(o.extra||'')+helmetG(o.view,pk(HELMC))+(r()<.65?gogG(o.view):'')}else if(q<.52)o.extra=(o.extra||'')+gogG(o.view)}
 return o};

/* ================= 3. 物件與干擾物 ================= */
const BLUE='#3d5a78';
const flakeArm=`<path d="M0,-2 L12.5,-1.3 L15,0 L12.5,1.3 L0,2Z" fill="#e9eef2" stroke="${BLUE}" stroke-width="1.2"/><path d="M8,0 L11,-3.6 M8,0 L11,3.6" fill="none" stroke="${BLUE}" stroke-width="1.2"/><path d="M8,0 L11,-3.6 M8,0 L11,3.6" fill="none" stroke="#bcdcef" stroke-width=".7"/>`;
Object.assign(ART,{
 /* 單板：兩個綁腳固定器 */
 board902:`<g transform="rotate(-32)"><rect x="-21" y="-7" width="42" height="14" rx="7" fill="#2f7fc0"/><path d="M-15,3 Q0,-5 15,3" fill="none" stroke="#f5c842" stroke-width="2.4"/>`+[-9,9].map(x=>`<rect x="${x-4}" y="-8" width="8" height="16" rx="2.5" fill="#3d3833" stroke-width="1.4"/><path d="M${x-4.6},-3 h9.2 M${x-4.6},3 h9.2" fill="none" stroke="#e86a3a" stroke-width="2.4"/>`).join('')+`</g>`,
 /* 雪花胸針：銀白＋淡藍，深灰藍細描邊，中間水晶，背後露出別針 */
 brooch902:`<path d="M6,8 L17,13" fill="none" stroke="${BLUE}" stroke-width="2.6"/><path d="M6,8 L17,13" fill="none" stroke="#c9d1d8" stroke-width="1.2"/><circle cx="17" cy="13" r="1.8" fill="#c9d1d8" stroke="${BLUE}" stroke-width="1"/>`+
  [0,60,120,180,240,300].map(a=>`<g transform="rotate(${a})">${flakeArm}</g>`).join('')+
  `<path d="M0,-5 L4.3,-2.5 L4.3,2.5 L0,5 L-4.3,2.5 L-4.3,-2.5Z" fill="#8fc6ea" stroke="${BLUE}" stroke-width="1.2"/><path d="M0,-5 L0,0 L4.3,-2.5 M0,0 L-4.3,2.5" fill="none" stroke="#e6f4fb" stroke-width=".9"/><circle cx="-1.6" cy="-2" r="1" fill="#fff" stroke="none"/>`,
 /* 滑雪護目鏡：寬鏡框、彩色反光鏡片 */
 goggles902:`<path d="M-18,0 H18" fill="none" stroke="${OL}" stroke-width="8"/><path d="M-18,0 H18" fill="none" stroke="#5a86b0" stroke-width="5"/><rect x="-14" y="-9" width="28" height="18" rx="8" fill="#3d3833"/><path d="M-12,-1 Q-12,-7 -6,-7 H6 Q12,-7 12,-1 Q12,7 5,6 Q2,3 0,3 Q-2,3 -5,6 Q-12,7 -12,-1Z" fill="#e8708a" stroke-width="1.2"/><path d="M-11.6,-2 Q-11.6,-6.6 -6,-6.6 H6 Q11.6,-6.6 11.6,-2Z" fill="#f5b040" stroke="none"/><path d="M-7,4 L2,-5 M2,3 L6,-1" fill="none" stroke="#fff" stroke-width="1.6" opacity=".9"/><path d="M-6,-8.2 h2 M-1,-8.2 h2 M4,-8.2 h2" fill="none" stroke="#9aa3aa" stroke-width="1.2"/>`,
 /* 滑雪安全帽：硬殼＋耳罩＋通風孔 */
 helmet902:`<path d="M-15,6 Q-16,-14 0,-14 Q16,-14 15,6 Q0,2 -15,6Z" fill="#3fa8a0"/><path d="M-7,-11 v5 M0,-12.5 v5 M7,-11 v5" fill="none" stroke="#24706a" stroke-width="2.2"/><path d="M-11,-6 Q-8,-11 -2,-12" fill="none" stroke="#fff" stroke-width="1.6" opacity=".7"/><rect x="-17" y="1" width="6" height="11" rx="3" fill="#3d3833"/><rect x="11" y="1" width="6" height="11" rx="3" fill="#3d3833"/><path d="M-13,12 Q0,17 13,12" fill="none" stroke-width="1.6"/>`,
 /* 滑雪票：山的圖案＋拉鍊夾 */
 pass902:`<path d="M0,-8 V-13" fill="none" stroke-width="1.4"/><circle cx="0" cy="-15" r="3.6" fill="#3d3833"/><rect x="-1.4" y="-21" width="2.8" height="4" fill="#9aa3aa" stroke-width="1"/><rect x="-11" y="-8" width="22" height="17" rx="2" fill="#fbf6ea"/><rect x="-11" y="-8" width="22" height="4" fill="#e86a3a" stroke="none"/><path d="M-9,7 L-3,-1 L1,4 L4,0 L9,7Z" fill="#5a86b0" stroke-width="1.2"/><path d="M-4.6,1 L-3,-1 L-1.4,1Z" fill="#fff" stroke="none"/><rect x="-11" y="-8" width="22" height="17" rx="2" fill="none"/>`,
 /* 暖暖包：長方形包裝、橘色標示 */
 warmer902:`<rect x="-10" y="-13" width="20" height="26" rx="2" fill="#fbf6ea"/><path d="M-10,-11 l2,-2 l2,2 l2,-2 l2,2 l2,-2 l2,2 l2,-2 l2,2 l2,-2 M-10,11 l2,2 l2,-2 l2,2 l2,-2 l2,2 l2,-2 l2,2 l2,-2 l2,2" fill="none" stroke-width="1"/><rect x="-10" y="-5" width="20" height="10" fill="#f08a30" stroke-width="1.4"/><circle cx="0" cy="0" r="3" fill="#fde2a0" stroke="none"/><path d="M0,-4.6 v1.4 M0,3.2 v1.4 M-4.6,0 h1.4 M3.2,0 h1.4" fill="none" stroke="#fde2a0" stroke-width="1.2"/>`,
 /* 起司火鍋：鍋＋融化起司＋細長叉子插著麵包丁 */
 fondue902:`<path d="M-4,-3 L-12,-17" fill="none" stroke="#7d8890" stroke-width="1.8"/><path d="M4,-3 L9,-18" fill="none" stroke="#7d8890" stroke-width="1.8"/><rect x="-16" y="-22" width="6" height="6" rx="1" fill="#e0b070" stroke-width="1.3" transform="rotate(-20 -13 -19)"/><rect x="6.5" y="-23" width="6" height="6" rx="1" fill="#e0b070" stroke-width="1.3" transform="rotate(15 9.5 -20)"/>`+
  `<path d="M-13,13 L-9,6 M13,13 L9,6 M-11,13 H11" fill="none" stroke="#5a5f64" stroke-width="2"/><path d="M-3,9 Q0,3 3,9Z" fill="#f5a030" stroke-width="1"/><path d="M12,-1 h6" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M12,-1 h6" fill="none" stroke="#b8483a" stroke-width="2.4"/><path d="M-12,-2 Q-12,8 0,8 Q12,8 12,-2Z" fill="#b8483a"/><ellipse cx="0" cy="-2" rx="12" ry="3.6" fill="#f5d050"/><path d="M-9,-1 q2,3 4,0" fill="none" stroke="#f5d050" stroke-width="2.4"/>`,
 /* 鹿角裝飾：手掌狀分岔、掛在木板上 */
 antler902:(()=>{const side=s=>{const d=`M${s*3},1 Q${s*10},-4 ${s*12},-15 M${s*8},-4 L${s*15},-6 M${s*11},-10 L${s*17},-13 M${s*11.5},-12 L${s*8},-18`;return `<path d="${d}" fill="none" stroke="${OL}" stroke-width="5.4"/><path d="${d}" fill="none" stroke="#efe4cc" stroke-width="3"/>`};
  return side(-1)+side(1)+`<path d="M-7,0 Q-7,11 0,14 Q7,11 7,0 Q0,-3 -7,0Z" fill="#8a5a34"/><path d="M-4,4 Q0,2 4,4" fill="none" stroke="#5f3c22" stroke-width="1"/><circle cx="0" cy="3" r="1.4" fill="#d6a868" stroke="none"/>`})(),
 /* 冰柱：尖尖往下、半透明淡藍 */
 icicle902:`<path d="M-9,-9 L-6,13 L-3,-9Z M-2,-9 L1,18 L4,-9Z M5,-9 L7.5,8 L10,-9Z" fill="#cfe8f4" stroke="#5f8fb0" stroke-width="1.4" opacity=".95"/><path d="M-6,-6 L-5.6,5 M1,-6 L1.2,10" fill="none" stroke="#fff" stroke-width="1.2"/><path d="M-14,-11 Q-10,-17 0,-15 Q10,-17 14,-11 Q14,-7 0,-8 Q-14,-7 -14,-11Z" fill="${SNOW}"/>`,
 /* 烤棉花糖：竹籤上兩顆、上面烤成金黃 */
 marsh902:`<g transform="rotate(-38)"><path d="M-19,0 H18" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M-19,0 H18" fill="none" stroke="#a8784a" stroke-width="2.2"/>`+[1,10].map(x=>`<rect x="${x}" y="-5.5" width="8" height="11" rx="3" fill="#fbf6ea"/><path d="M${x+4},-5.5 h1 q3,0 3,3 v5 q0,3 -3,3 h-1Z" fill="#d99a4a" stroke="none"/><rect x="${x}" y="-5.5" width="8" height="11" rx="3" fill="none"/>`).join('')+`</g>`});
Object.assign(DECOY,{
 paperflake902:`<path d="${[...Array(12)].map((_,i)=>{const a=i*Math.PI/6-Math.PI/2,q=i%2?7:14;return (i?'L':'M')+f(Math.cos(a)*q)+','+f(Math.sin(a)*q)}).join(' ')}Z" fill="#fbfbf8" stroke-width="1.6"/><path d="M-2,-8 L0,-11 L2,-8Z M5,-4 L8,-6 L7,-2Z M5,4 L8,6 L7,2Z M-2,8 L0,11 L2,8Z M-5,4 L-8,6 L-7,2Z M-5,-4 L-8,-6 L-7,-2Z" fill="#dfe4e8" stroke-width=".8"/><circle r="2.4" fill="#e7ebee" stroke-width=".8"/>`,
 swimgog902:`<path d="M-17,0 H17" fill="none" stroke="#3a8ab0" stroke-width="2"/><ellipse cx="-7" cy="0" rx="6.5" ry="5.5" fill="#bfe6f4"/><ellipse cx="7" cy="0" rx="6.5" ry="5.5" fill="#bfe6f4"/><path d="M-1,0 h2" fill="none" stroke-width="2.4"/><path d="M-9,-2 l3,-1.5 M5,-2 l3,-1.5" fill="none" stroke="#fff" stroke-width="1.4"/>`,
 buckethat902:`<path d="M-16,2 Q0,-5 16,2 Q12,8 0,7 Q-12,8 -16,2Z" fill="#c9ad74"/><path d="M-9,-1 Q-9,-12 0,-12 Q9,-12 9,-1Z" fill="#d8c08a"/><path d="M-9,-3 Q0,-1 9,-3" fill="none" stroke="#a88a52" stroke-width="1.2" stroke-dasharray="2 2"/>`,
 tag902:`<path d="M0,-12 Q-6,-17 -4,-21" fill="none" stroke-width="1.2"/><path d="M-9,-6 L0,-12 L9,-6 V11 H-9Z" fill="#e8d4a8"/><circle cx="0" cy="-6" r="1.8" fill="#fbf6ea" stroke-width="1.1"/>`,
 cookie902:`<rect x="-11" y="-10" width="22" height="20" rx="4" fill="#d9b06a"/><path d="M-11,-6 h22" fill="none" stroke="#b88a48" stroke-width="1" opacity=".6"/><g fill="#a8783a" stroke="none">${[[-5,-3],[0,-3],[5,-3],[-5,3],[0,3],[5,3]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.2"/>`).join('')}</g>`,
 soupbowl902:`<path d="M-4,-8 q-2,-4 0,-7 M3,-8 q-2,-4 0,-7" fill="none" stroke="#c9d6dc" stroke-width="1.6"/><path d="M-13,-3 Q-12,10 0,10 Q12,10 13,-3Z" fill="#f1ead8"/><path d="M-12.6,1 Q0,4 12.6,1" fill="none" stroke="#5a86b0" stroke-width="2.4"/><ellipse cx="0" cy="-3" rx="13" ry="3.6" fill="#e0a050"/>`,
 pot902:`<path d="M-16,-3 h4 M12,-3 h4" fill="none" stroke-width="3"/><path d="M-12,-5 V8 Q0,12 12,8 V-5Z" fill="#a8b0b6"/><ellipse cx="0" cy="-5" rx="12" ry="3.4" fill="#c4cad0"/><path d="M-3,-8 h6" fill="none" stroke-width="2.4"/><path d="M-9,1 Q0,4 9,1" fill="none" stroke="#8a9298" stroke-width="1"/>`,
 branch902:`<path d="M-15,10 Q-4,2 2,-4 Q6,-9 13,-14 M2,-4 L10,-2 M-6,4 L-9,-6" fill="none" stroke="${OL}" stroke-width="5"/><path d="M-15,10 Q-4,2 2,-4 Q6,-9 13,-14 M2,-4 L10,-2 M-6,4 L-9,-6" fill="none" stroke="#7a5235" stroke-width="2.8"/>`,
 chestnut902:`<path d="M-11,4 Q-12,-8 0,-12 Q12,-8 11,4 Q0,9 -11,4Z" fill="#7a3f22"/><path d="M-11,4 Q0,9 11,4 Q10,9 0,11 Q-10,9 -11,4Z" fill="#d9b98a"/><path d="M0,-12 l.8,-4" fill="none" stroke-width="1.6"/><path d="M-6,-5 Q-4,-9 0,-10" fill="none" stroke="#c48a5a" stroke-width="1.6"/>`,
 radish902:`<path d="M-2,-8 Q-9,-16 -7,-20 Q-3,-16 -1,-10 Q0,-21 3,-22 Q4,-15 1,-9 Q7,-16 10,-15 Q8,-10 2,-7Z" fill="#6f9a4a" stroke-width="1.3"/><path d="M-5,-7 Q-6,7 0,17 Q6,7 5,-7 Q0,-9 -5,-7Z" fill="#f6f3ea"/><path d="M-3,0 h2 M1,5 h2 M-2,9 h2" fill="none" stroke="#c9c2b0" stroke-width="1"/>`,
 pebble902:`<ellipse cx="-5" cy="2" rx="7" ry="5.5" fill="#e8e6e0"/><ellipse cx="6" cy="0" rx="6" ry="5" fill="#dcdad2"/><circle cx="-7" cy="1" r=".9" fill="#9a968c" stroke="none"/><circle cx="7" cy="-1" r=".9" fill="#9a968c" stroke="none"/><circle cx="-2" cy="4" r=".8" fill="#9a968c" stroke="none"/>`});
const DK_=(id,w,h,s=.95)=>({w,h,fn:()=>T(0,-h/2,s,DECOY[id])});
Object.assign(KIND,{paperflake902:DK_('paperflake902',30,30),swimgog902:DK_('swimgog902',34,16),buckethat902:DK_('buckethat902',32,22),tag902:DK_('tag902',22,30),
 cookie902:DK_('cookie902',24,22),soupbowl902:DK_('soupbowl902',28,24),pot902:DK_('pot902',32,22),branch902:DK_('branch902',32,26),chestnut902:DK_('chestnut902',24,24),
 radish902:DK_('radish902',22,38),pebble902:DK_('pebble902',26,14)});

/* 12 種：老朋友 松果、熱可可（第 3 關）＋ 10 種新東西 */
const old=(id,regions)=>({...typeOf(id),regions});
const TYPES=[
 {id:'board902',name:'單板滑雪板',short:'單板',r:16,rot:25,regions:['lower902','base902','lodge902','run902']},
 {id:'brooch902',name:'雪花胸針',short:'胸針',r:14,rot:30,regions:['lodge902','summit902','pinesW902','base902']},
 {id:'goggles902',name:'滑雪護目鏡',short:'護目鏡',r:15,rot:20,regions:['summit902','run902','base902','lower902']},
 {id:'helmet902',name:'滑雪安全帽',short:'安全帽',r:15,rot:18,regions:['summit902','east902','base902','lodge902']},
 {id:'pass902',name:'滑雪票',short:'滑雪票',r:14,rot:16,regions:['summit902','lodge902','lower902','east902']},
 {id:'warmer902',name:'暖暖包',short:'暖暖包',r:13,rot:24,regions:['lodge902','wood902','base902','summit902']},
 old('cocoa',['lodge902','summit902','lodge902','base902']),
 {id:'fondue902',name:'起司火鍋',short:'起司鍋',r:15,rot:8,regions:['lodge902','lodge902','summit902','lower902']},
 {id:'antler902',name:'鹿角裝飾',short:'鹿角',r:15,rot:12,regions:['lodge902','wood902','pinesE902','pinesW902']},
 old('pinecone',['pinesW902','pinesE902','wood902','pinesE902']),
 {id:'icicle902',name:'冰柱',short:'冰柱',r:14,rot:6,regions:['summit902','wood902','east902','summit902']},
 {id:'marsh902',name:'烤棉花糖',short:'棉花糖',r:15,rot:20,regions:['lodge902','base902','pinesW902','lower902']}];
LEVELS[N].types=TYPES;
/* BORROW（混進第 3 關）等決定位置時再加：H.BORROW[N]=[['board902',{3:[…]}],…] */

/* ================= 4. 地形與區域 ================= */
WATERFN[N]=()=>false;
Object.assign(REG,{summit902:{x:560,y:500,w:1600,h:380},run902:{x:990,y:880,w:700,h:620},wood902:{x:560,y:900,w:420,h:640},east902:{x:1700,y:900,w:460,h:800},
 lower902:{x:1070,y:1500,w:610,h:640},lodge902:{x:620,y:1580,w:500,h:420},pinesW902:{x:540,y:2000,w:520,h:620},pinesE902:{x:1720,y:1700,w:440,h:920},
 base902:{x:1070,y:2150,w:640,h:470},all902:{x:540,y:500,w:1620,h:2120}});
H.SCREG[N]=['summit902','run902','wood902','east902','lower902','lodge902','pinesW902','pinesE902','base902','all902'];

/* 雪道（S 型）：左右兩條邊，用平滑內插 */
const RUNL=[[1060,790],[985,1050],[1075,1350],[1110,1650],[1060,2140]],RUNR=[[1560,790],[1530,1050],[1630,1350],[1600,1650],[1650,2140]];
function edgeAt(P,y){if(y<=P[0][1])return P[0][0];for(let i=1;i<P.length;i++)if(y<=P[i][1]){const[a,b]=P[i-1],[c,d]=P[i];let t=(y-b)/(d-b);t=t*t*(3-2*t);return a+(c-a)*t}return P[P.length-1][0]}
const onRun=(x,y,m=0)=>y>780&&y<2150&&x>edgeAt(RUNL,y)-m&&x<edgeAt(RUNR,y)+m;
/* 新手坡（彩蛋區） */
const BEG={x0:1190,x1:1530,y0:2220,y1:2610};
const onBeg=(x,y,m=0)=>x>BEG.x0-m&&x<BEG.x1+m&&y>BEG.y0-m&&y<BEG.y1+m;
/* 吊椅：坡底站 LB → 山頂站 LT；纜繩離地 CH */
const LB=[1890,2080],LT=[1720,830],CH=104;
const LP=t=>[LB[0]+(LT[0]-LB[0])*t,LB[1]+(LT[1]-LB[1])*t];
function segD(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1];let t=((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy);t=Math.max(0,Math.min(1,t));return Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t)}
const inLift=(x,y,m=46)=>segD(x,y,LB,LT)<m;
/* 山屋露台、山屋、纜車站 */
const DECK={x:640,y:1690,w:450,h:270},LODGE=[800,1690],STN=[880,720];
const onDeck=(x,y,m=0)=>x>DECK.x-m&&x<DECK.x+DECK.w+m&&y>DECK.y-m&&y<DECK.y+DECK.h+m;
/* 步道（壓實的雪路）：點列，畫的時候用 chaikin 平滑 */
const PATHS=[[[880,760],[860,930],[770,1120],[800,1320],[840,1480],[830,1640]],[[1080,1900],[1110,2010],[1070,2120],[1090,2230],[1100,2420],[1150,2620]],[[1880,2120],[1800,2240],[1690,2330],[1590,2440]],[[640,980],[700,960],[780,1000]]];
const PATHW=[30,26,22,14];
const nearPath=(x,y,m=26)=>PATHS.some((P,k)=>{for(let i=1;i<P.length;i++)if(segD(x,y,P[i-1],P[i])<PATHW[k]/2+m)return true;return false});
/* 樹不能種的地方 */
const noTree=(x,y)=>onRun(x,y,30)||onBeg(x,y,40)||inLift(x,y,52)||onDeck(x,y,40)||nearPath(x,y)||(Math.abs(x-LODGE[0])<200&&y>LODGE[1]-150&&y<LODGE[1]+20)||(Math.abs(x-STN[0])<170&&y>STN[1]-150&&y<STN[1]+60)||(Math.hypot(x-LB[0],y-LB[1])<80)||(Math.hypot(x-LT[0],y-LT[1])<80);

const NS_='stroke="none"';
function ground(){let s='';
 s+=`<defs><pattern id="plank902" width="40" height="12" patternUnits="userSpaceOnUse"><rect width="40" height="12" fill="#c99a6a"/><path d="M0,0 H40" stroke="#9a6d42" stroke-width="1.4"/><path d="M${20},0 V12" stroke="#b08452" stroke-width="1"/></pattern></defs>`;
 s+=`<rect x="0" y="-400" width="3000" height="3800" fill="#f7f5ef" ${NS_}/>`;
 /* 天空：上面比較深的藍，讓白色的樹冰看得出輪廓 */
 s+=`<rect x="0" y="-400" width="3000" height="660" fill="#b9d0e4" ${NS_}/><rect x="0" y="200" width="3000" height="300" fill="#cfdeeb" ${NS_}/>`;
 [[620,90,1],[1150,40,.8],[1600,120,1],[900,200,.7],[1950,60,.8]].forEach(([x,y,k])=>s+=`<g opacity=".75">${T(x,y,k,swirl())}</g>`);
 /* 遠山（淡）＋近的深色山影 */
 const peak=(x,y,w,h,c,cap)=>`<path d="M${x-w},${y} L${f(x-w*.35)},${f(y-h*.7)} L${x},${y-h} L${f(x+w*.4)},${f(y-h*.62)} L${x+w},${y}Z" fill="${c}"/><path d="M${x},${y-h} L${f(x+w*.4)},${f(y-h*.62)} L${x+w},${y} L${f(x+w*.15)},${y}Z" fill="#8fa3b6" ${NS_} opacity=".45"/><path d="M${f(x-w*.35)},${f(y-h*.7)} L${x},${y-h} L${f(x+w*.4)},${f(y-h*.62)} L${f(x+w*.22)},${f(y-h*.52)} L${f(x+w*.06)},${f(y-h*.64)} L${f(x-w*.12)},${f(y-h*.5)} L${f(x-w*.24)},${f(y-h*.6)}Z" fill="${cap}"/>`;
 [[420,470,330,330],[1100,470,380,400],[1800,470,360,350],[2350,470,300,300]].forEach(([x,y,w,h])=>s+=`<g opacity=".6">${peak(x,y,w,h,'#c4d3e0','#eef3f6')}</g>`);
 [[700,500,300,250],[1350,500,330,300],[2000,500,320,240],[160,500,260,220]].forEach(([x,y,w,h])=>s+=peak(x,y,w,h,'#9fb2c4','#f4f7f9'));
 /* 山頂的雪原（上緣起伏） */
 s+=`<path d="M0,520 Q300,486 600,506 Q900,478 1200,500 Q1500,474 1800,498 Q2100,484 2400,500 Q2700,490 3000,500 V3600 H0Z" fill="#f7f5ef"/>`;
 /* 山頂（2026-11-12 使用者選）：主峰 B 半埋雪中的避難小屋；東峰 B 稜線上的登山隊＋D 山頂被風吹起的雪煙 */
 {const hx=1374,hy=252;s+=`<g transform="translate(${hx},${hy})"><path d="M-17,0 L0,-26 L17,0Z" fill="#7a5235"/><path d="M-17,0 L0,-26 L17,0" fill="none" stroke="${SNOW}" stroke-width="4"/><path d="M-5,0 V-9 Q0,-13 5,-9 V0Z" fill="#3d3833"/><circle cx="0" cy="-17" r="2.4" fill="#f6d27a" stroke-width="1"/><path d="M8,-14 v-9 h4 v5" fill="#9a8a7a" stroke-width="1.4"/><g ${NS_} fill="#fff"><circle cx="12" cy="-28" r="3" opacity=".8"><animate attributeName="cy" values="-27;-33;-27" dur="3s" repeatCount="indefinite"/></circle><circle cx="15" cy="-34" r="2.2" opacity=".6"><animate attributeName="cy" values="-33;-40;-33" dur="3s" repeatCount="indefinite"/></circle></g><path d="M-26,3 Q0,-6 26,3 Q0,7 -26,3Z" fill="#f4f7f9" stroke="none"/></g>`;}
 {const ex=2000,ey=260;
  [[-70,52],[-50,37],[-30,22]].forEach(([x,y])=>{s+=`<g transform="translate(${ex+x},${ey+y}) rotate(-8) scale(.3)">${act(0,0,1,{view:'side',pose:'walk',hat:0,nogear:1,extra:'<rect x="-12" y="-22" width="8" height="14" rx="2" fill="#c4473c"/>'})}</g>`});
  s+=`<path d="M${ex-66},${ey+40} Q${ex-58},${ey+36} ${ex-50},${ey+25} Q${ex-42},${ey+20} ${ex-32},${ey+10}" fill="none" stroke="#e0b44a" stroke-width="1.2"/>`;
  s+=`<g fill="#ffffff" stroke="none" opacity=".85"><path d="M${ex},${ey} Q${ex+20},${ey-12} ${ex+46},${ey-6} Q${ex+70},${ey-2} ${ex+94},${ey-14} Q${ex+78},${ey+4} ${ex+54},${ey+6} Q${ex+26},${ey+10} ${ex},${ey+4}Z"><animate attributeName="opacity" values=".5;.9;.5" dur="3s" repeatCount="indefinite"/></path><circle cx="${ex+60}" cy="${ey-8}" r="5" opacity=".6"/><circle cx="${ex+80}" cy="${ey-12}" r="3.5" opacity=".5"/></g>`;}
 /* 秘境伏筆：西邊山腰的冰洞口，透出淡淡的藍光（之後的「冰雪洞窟」秘境入口；x 要在 720 以東，不然會被左邊緣的鏡像複製一份） */
 {const cx=830,cy=468;s+=`<path d="M${cx-46},${cy} Q${cx-48},${cy-40} ${cx},${cy-46} Q${cx+48},${cy-40} ${cx+46},${cy}Z" fill="#c3d2de"/><path d="M${cx-30},${cy} Q${cx-30},${cy-30} ${cx},${cy-32} Q${cx+30},${cy-30} ${cx+30},${cy}Z" fill="#2c4a66"/>`+
  `<g ${NS_}><ellipse cx="${cx}" cy="${cy-10}" rx="22" ry="16" fill="#7fd0f0" opacity=".35"><animate attributeName="opacity" values=".2;.55;.2" dur="3.2s" repeatCount="indefinite"/></ellipse><ellipse cx="${cx}" cy="${cy-8}" rx="11" ry="8" fill="#c8f0ff" opacity=".5"><animate attributeName="opacity" values=".3;.8;.3" dur="3.2s" repeatCount="indefinite"/></ellipse></g>`+
  `<path d="M${cx-24},${cy-26} l3,10 l3,-11 M${cx-10},${cy-31} l2,12 l2,-12 M${cx+6},${cy-31} l2,9 l2,-9 M${cx+18},${cy-28} l3,11 l2,-10" fill="#dff4fb" stroke="#5f8fb0" stroke-width="1.2"/><path d="M${cx-52},${cy+2} Q${cx},${cy-6} ${cx+52},${cy+2} Q${cx},${cy+10} ${cx-52},${cy+2}Z" fill="${SNOW}" stroke-width="1.6"/>`;}
 /* 白雪岩壁（東北） */
 s+=`<path d="M1520,560 Q1560,520 1640,526 Q1700,512 1760,540 L1770,600 Q1700,612 1640,604 Q1570,612 1520,596Z" fill="#9aa3a8"/><path d="M1520,560 Q1560,520 1640,526 Q1700,512 1760,540 Q1700,548 1640,544 Q1570,552 1520,560Z" fill="${SNOW}"/><path d="M1580,560 l10,30 M1660,550 l-6,40 M1720,556 l8,30" fill="none" stroke="#7d868c" stroke-width="1.6"/>`;
 /* 山頂到坡底的雪影（深淺） */
 let dr='';for(let i=0;i<190;i++){const x=sr(380,2300),y=sr(560,2650);dr+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(30,90))}" ry="${f(sr(8,18))}" fill="#e8eef2" ${NS_}/>`}s+=dr;
 /* 雪道：壓過的雪面＋細的壓雪紋＋S 型雪痕 */
 const L_=[],R_=[];for(let y=790;y<=2140;y+=30){L_.push([f(edgeAt(RUNL,y)),y]);R_.push([f(edgeAt(RUNR,y)),y])}
 /* 雪道往下接到新手坡，畫成同一片（新手坡兩邊收窄、底部圓角） */
 const bl=(y,a,b)=>{const t=Math.min(1,Math.max(0,(y-2140)/110));const e=t*t*(3-2*t);return a+(b-a)*e};
 for(let y=2170;y<=BEG.y1;y+=30){L_.push([f(bl(y,edgeAt(RUNL,2140),BEG.x0-30)),y]);R_.push([f(bl(y,edgeAt(RUNR,2140),BEG.x1+30)),y])}
 L_.push([BEG.x0+10,BEG.y1+24]);R_.push([BEG.x1-10,BEG.y1+24]);
 s+=`<path d="M${L_.map(p=>p.join(',')).join(' L')} L${R_.slice().reverse().map(p=>p.join(',')).join(' L')}Z" fill="#fcfbf8" stroke="none"/>`;
 /* 只畫左右兩側的淡邊（上緣不畫線，跟山頂雪原接在一起；2026-11-12 使用者） */
 s+=`<path d="M${L_.slice(2).map(p=>p.join(',')).join(' L')} M${R_.slice(2).map(p=>p.join(',')).join(' L')}" fill="none" stroke="#dbe3e8" stroke-width="3"/>`;
 let cord='';for(let y=820;y<BEG.y1;y+=14){const a=(y<2140?edgeAt(RUNL,y):bl(y,edgeAt(RUNL,2140),BEG.x0-30))+14,b=(y<2140?edgeAt(RUNR,y):bl(y,edgeAt(RUNR,2140),BEG.x1+30))-14;cord+=`M${f(a)},${y} H${f(b)} `}s+=`<path d="${cord}" fill="none" stroke="#eef2f4" stroke-width="2"/>`;
 let tr='';for(let i=0;i<9;i++){let p=[];const ph=sr(0,6.28),amp=sr(40,75),k=sr(.010,.016);for(let y=800;y<=2130;y+=20){const c=(edgeAt(RUNL,y)+edgeAt(RUNR,y))/2,w=(edgeAt(RUNR,y)-edgeAt(RUNL,y))/2-30;p.push([f(c+Math.max(-w,Math.min(w,amp*Math.sin(y*k+ph)+sr(-6,6)+(i-4)*12))),y])}tr+='M'+p.map(q=>q.join(',')).join(' L')+' '}
 s+=`<path d="${tr}" fill="none" stroke="#cfd9df" stroke-width="2.4" stroke-dasharray="18 6"/>`;
 /* 新手坡：只留坡頂一道淡淡的坡緣 */
 s+=`<path d="M${BEG.x0+20},${BEG.y0+70} Q${(BEG.x0+BEG.x1)/2},${BEG.y0+52} ${BEG.x1-20},${BEG.y0+70}" fill="none" stroke="#d5dee4" stroke-width="3"/><path d="M${BEG.x0+20},${BEG.y0+76} Q${(BEG.x0+BEG.x1)/2},${BEG.y0+58} ${BEG.x1-20},${BEG.y0+76}" fill="none" stroke="#eef2f4" stroke-width="4"/>`;
 /* 東邊林間的滑雪痕（樹變少，留給人在樹林間穿梭） */
 let gl='';for(let i=0;i<7;i++){let x=sr(1760,2150),y=sr(900,1300),p=[];const ph=sr(0,6.28);for(let k=0;k<26;k++){p.push([f(x+Math.sin(k*.55+ph)*sr(18,30)),f(y)]);y+=sr(42,58)}gl+='M'+p.map(q=>q.join(',')).join(' L')+' '}
 s+=`<path d="${gl}" fill="none" stroke="#d5dee4" stroke-width="2.2" stroke-dasharray="14 6"/>`;
 /* 新手坡西側的魔毯（輸送帶） */
 s+=`<rect x="${BEG.x0+8}" y="${BEG.y0+40}" width="22" height="${BEG.y1-BEG.y0-70}" rx="4" fill="#5a5f64" stroke-width="2"/><path d="${[...Array(Math.floor((BEG.y1-BEG.y0-80)/12))].map((_,i)=>`M${BEG.x0+11},${BEG.y0+48+i*12} h16`).join(' ')}" fill="none" stroke="#7d868c" stroke-width="1.4"/>`;
 /* 吊椅底下清出來的雪帶 */
 s+=`<path d="M${LB[0]},${LB[1]} L${LT[0]},${LT[1]}" fill="none" stroke="#eef2f4" stroke-width="64" stroke-linecap="round"/>`;
 /* 步道 */
 PATHS.forEach((P,k)=>{const Q=chaikin(P,3),d='M'+Q.map(([x,y])=>f(x)+','+f(y)).join(' L');ROADS.push([d,PATHW[k]]);
  s+=`<path d="${d}" fill="none" stroke="#c9d3d8" stroke-width="${PATHW[k]+4}"/><path d="${d}" fill="none" stroke="#ece4d4" stroke-width="${PATHW[k]}"/><path d="${d}" fill="none" stroke="#f6f1e6" stroke-width="${f(PATHW[k]*.4)}" stroke-dasharray="6 10"/>`});
 /* 山屋露台（木棧板） */
 s+=`<rect x="${DECK.x}" y="${DECK.y}" width="${DECK.w}" height="${DECK.h}" rx="10" fill="url(#plank902)" stroke-width="2.4"/><path d="M${DECK.x+6},${DECK.y+DECK.h-4} H${DECK.x+DECK.w-6}" fill="none" stroke="#8a5a34" stroke-width="3"/>`;
 s+=`<path d="M${DECK.x+DECK.w-80},${DECK.y+DECK.h} v22 h60 v-22" fill="#b08452" stroke-width="2"/><path d="M${DECK.x+DECK.w-80},${DECK.y+DECK.h+8} h60 M${DECK.x+DECK.w-80},${DECK.y+DECK.h+16} h60" fill="none" stroke="#8a5a34" stroke-width="1.4"/>`;
 /* 腳印、雪球痕、草叢般的雪紋 */
 let fp='';for(let k=0;k<26;k++){let x=sr(560,2150),y=sr(900,2600),a=sr(0,6.28);if(onRun(x,y,10)||onBeg(x,y,10)||onDeck(x,y,10))continue;for(let i=0;i<9;i++){x+=Math.cos(a)*16;y+=Math.sin(a)*10;a+=sr(-.3,.3);fp+=`<ellipse cx="${f(x+(i%2?4:-4))}" cy="${f(y)}" rx="2.6" ry="1.8" fill="#d6dfe4" ${NS_}/>`}}s+=fp;
 let tf='';for(let i=0;i<900;i++){const x=sr(520,2180),y=sr(560,2650);if(onRun(x,y,6)||onBeg(x,y,6)||onDeck(x,y,6)||nearPath(x,y,4))continue;tf+=r()<.3?`M${f(x)},${f(y)} l-3,-6 M${f(x)},${f(y)} l3,-6 `:`M${f(x-6)},${f(y)} q6,-5 12,0 `}
 s+=`<path d="${tf}" fill="none" stroke="#adbcc4" stroke-width="1.3"/>`;
 return s}

/* ================= 5. 佈景圖 ================= */
/* 樹冰（雪怪）：一團團不規則的白，看不到枝條；淡藍灰陰影、樹幹隱約透出 */
function rimeShape(k=1){const lumps=[],Hh=sr(86,112)*k,W=sr(24,30)*k,n=ri(5,6);
 for(let i=0;i<n;i++){const t=i/(n-1),y=-12*k-t*(Hh-26*k),rr=W*(1-.58*t)*sr(.86,1.08),cx=sr(-4,4)*(1-t)*k;lumps.push([cx,y,rr]);
  if(t<.85&&r()<.75){const sd=r()<.5?-1:1;lumps.push([cx+sd*rr*sr(.55,.8),y+sr(-2,7)*k,rr*sr(.5,.68)])}}
 lumps.push([sr(-2,2)*k,-Hh+6*k,5.5*k]);
 lumps.sort((a,b)=>b[1]-a[1]);
 let g=`<ellipse cx="4" cy="1" rx="${f(W*1.1)}" ry="${f(5.5*k)}" fill="#b4c4d2" opacity=".65" ${NS_}/><rect x="${f(-3*k)}" y="${f(-13*k)}" width="${f(6*k)}" height="${f(13*k)}" fill="#6a5040"/>`;
 g+=lumps.map(([x,y,q])=>`<circle cx="${f(x)}" cy="${f(y)}" r="${f(q+2.2)}" fill="${OL}" ${NS_}/>`).join('');
 g+=lumps.map(([x,y,q])=>`<circle cx="${f(x)}" cy="${f(y)}" r="${f(q)}" fill="#f6f9fb" ${NS_}/><ellipse cx="${f(x+q*.32)}" cy="${f(y+q*.28)}" rx="${f(q*.62)}" ry="${f(q*.58)}" fill="#cad7e2" ${NS_} opacity=".9"/><ellipse cx="${f(x-q*.3)}" cy="${f(y-q*.32)}" rx="${f(q*.38)}" ry="${f(q*.28)}" fill="#ffffff" ${NS_}/>`).join('');
 for(let j=0;j<3;j++){const L=pk(lumps.slice(0,Math.max(1,lumps.length-2)));g+=`<ellipse cx="${f(L[0]-L[2]*.25)}" cy="${f(L[1]+L[2]*.45)}" rx="${f(2.6*k)}" ry="${f(1.7*k)}" fill="#55655e" opacity=".55" ${NS_}/>`}
 return g}
const rime=()=>rimeShape(1),rimeS=()=>rimeShape(.66);
/* 場地內靠邊的樹：先放一棵松樹，scatter 之後依高度換成樹冰或松樹 */
function zoneTree(y){const p=y<950?.95:y<1450?.95-(y-950)/500*.95:0;return r()<p?(r()<.3?['rimeS902',rimeS()]:['rime902',rime()]):['pineS',pineS()]}

function gondolaTop(){let g=`<path d="M-120,4 L130,-14 L140,12 L-110,16Z" fill="#9fb1b8" opacity=".3" ${NS_}/>`;
 g+=`<path d="M96,0 L122,-14 L122,-96 L96,-82Z" fill="#a9a196"/><rect x="-96" y="-82" width="192" height="82" fill="#e3ddd0"/>`;
 g+=`<rect x="-82" y="-70" width="104" height="42" fill="#bcd8e4"/><path d="M-56,-70 V-28 M-30,-70 V-28 M-4,-70 V-28 M-82,-48 H22" fill="none" stroke="#7d8f99" stroke-width="1.6"/>`;
 g+=`<path d="M34,0 V-58 H86 V0Z" fill="#3d3833"/><g transform="translate(60,-56)"><path d="M0,0 V8" fill="none" stroke="#9aa0a4" stroke-width="2"/><path d="M-13,8 H13 L15,28 Q0,32 -15,28Z" fill="#e0b44a"/><rect x="-10" y="11" width="8" height="8" fill="#d6ecf0"/><rect x="2" y="11" width="8" height="8" fill="#d6ecf0"/></g>`;
 g+=`<path d="M-104,-82 L104,-82 L130,-98 L-78,-98Z" fill="#6a7488"/><path d="M-104,-86 L102,-86 L128,-102 L-78,-102Z" fill="${SNOW}"/>`;
 g+=`<path d="M-50,-96 L-44,-130 L-16,-130 L-10,-96" fill="#8a8f94"/><ellipse cx="-30" cy="-134" rx="28" ry="8" fill="#c4473c"/><ellipse cx="-30" cy="-134" rx="9" ry="2.6" fill="#3d3833"/>`;
 g+=`<rect x="-36" y="-24" width="50" height="16" rx="3" fill="#fbf6ea"/>${H.signIcon('cable',1.05,-11,-16)}`;
 let ic='';for(let k=0;k<13;k++){const x=-96+k*15;ic+=`M${x-2},-82 L${x},${-75+(k%3)*2} L${x+2},-82Z `}g+=`<path d="${ic}" fill="#e6f2f5" stroke-width="1"/>`;
 return g}
function liftHut(){let g=`<path d="M-50,2 L58,-8 L62,8 L-44,10Z" fill="#9fb1b8" opacity=".3" ${NS_}/>`;
 g+=`<path d="M40,0 L54,-8 L54,-54 L40,-46Z" fill="#8a7a66"/><rect x="-40" y="-46" width="80" height="46" fill="#c9a77a"/><path d="M-40,-34 H40 M-40,-22 H40 M-40,-10 H40" fill="none" stroke="#9a7a52" stroke-width="1.2"/>`;
 g+=`<rect x="-28" y="-36" width="22" height="16" fill="#f6d27a"/><path d="M-17,-36 V-20" fill="none" stroke-width="1.4"/><rect x="6" y="-30" width="18" height="30" fill="#5a4030"/>`;
 g+=`<path d="M-46,-46 L46,-46 L58,-56 L-34,-56Z" fill="#6a7488"/><path d="M-46,-50 L46,-50 L58,-60 L-34,-60Z" fill="${SNOW}"/>`;
 g+=`<path d="M-8,-58 L-14,-${CH-8} M8,-58 L14,-${CH-8}" fill="none" stroke="#6a7488" stroke-width="4"/><ellipse cx="0" cy="-${CH}" rx="22" ry="6.5" fill="#e0b44a"/><ellipse cx="0" cy="-${CH}" rx="7" ry="2" fill="#3d3833"/>`;
 return g}
function lodgeBig(){const W=300,Hw=112,hw=W/2,rh=98,sd=64,sy=26;
 let g=`<path d="M${-hw-6},2 L${hw+sd+12},${-sy+2} L${hw+sd+26},10 L${-hw+10},14Z" fill="#9fb1b8" opacity=".35" ${NS_}/>`;
 g+=`<path d="M${hw},0 L${hw+sd},${-sy} L${hw+sd},${-Hw-sy} L${hw},${-Hw}Z" fill="#8a5a34"/><path d="M${hw+8},${-Hw/2} L${hw+sd-8},${-Hw/2-sy+4}" fill="none" stroke="#6a4428" stroke-width="1.2"/>`;
 g+=`<path d="M${hw+30},${-Hw-sy-40} v-46 h22 v46" fill="#9a8a7a"/><path d="M${hw+27},${-Hw-sy-86} h28 v-8 h-28Z" fill="${SNOW}"/>`;
 g+=`<path d="M0,${-Hw-rh} L${sd},${-Hw-rh-sy} L${hw+sd+12},${-Hw-sy+4} L${hw+12},${-Hw+4}Z" fill="${shade('#7a4a30',-.1)}"/><path d="M0,${-Hw-rh} L${sd},${-Hw-rh-sy} L${hw+sd+12},${-Hw-sy-2} L${hw+12},${-Hw-2}Z" fill="${SNOW}"/>`;
 g+=`<rect x="${-hw}" y="${-Hw}" width="${W}" height="${Hw}" fill="#a8703f"/><path d="M${-hw},${-Hw} L0,${-Hw-rh} L${hw},${-Hw}Z" fill="#b98a5a"/>`;
 g+=`<path d="${[...Array(10)].map((_,i)=>`M${-hw},${-Hw+11+i*11} H${hw}`).join(' ')}" fill="none" stroke="#7a5235" stroke-width="1.3"/>`;
 g+=`<path d="${[...Array(11)].map((_,i)=>{const x=-hw+25+i*25,yt=-Hw-rh*(1-Math.abs(x)/hw);return x<hw?`M${x},${-Hw} V${f(yt+4)}`:''}).join(' ')}" fill="none" stroke="#9a6d42" stroke-width="1.2"/>`;
 /* 一樓大窗戶、門 */
 const win=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f6d27a"/><path d="M${x+w/2},${y} V${y+h} M${x},${y+h/2} H${x+w}" fill="none" stroke="#7a5235" stroke-width="2"/><path d="M${x-3},${y+h} h${w+6}" fill="none" stroke="#5f3c22" stroke-width="3.4"/><path d="M${x-2},${y+h-1} h${w+4}" fill="none" stroke="${SNOW}" stroke-width="2"/>`;
 g+=win(-130,-84,52,40)+win(-66,-84,40,40)+win(26,-84,40,40)+win(78,-84,52,40);
 g+=`<rect x="-16" y="-62" width="32" height="62" fill="#6a4428"/><path d="M-16,-62 Q0,-72 16,-62" fill="#6a4428"/><circle cx="9" cy="-30" r="2" fill="#e0b44a" stroke-width="1"/>`;
 /* 二樓陽台、山牆窗、花圈 */
 g+=`<rect x="-92" y="${-Hw-8}" width="184" height="10" fill="#7a5235"/>`+[...Array(12)].map((_,i)=>`<path d="M${-86+i*15.6},${-Hw-26} V${-Hw-8}" fill="none" stroke="#5f3c22" stroke-width="2.4"/>`).join('')+`<path d="M-92,${-Hw-26} H92" fill="none" stroke="#5f3c22" stroke-width="3.6"/><path d="M-92,${-Hw-28} H92" fill="none" stroke="${SNOW}" stroke-width="2.4"/>`;
 g+=`<path d="M-30,${-Hw-34} V${-Hw-62} L0,${-Hw-80} L30,${-Hw-62} V${-Hw-34}Z" fill="#f6d27a"/><path d="M0,${-Hw-80} V${-Hw-34} M-30,${-Hw-52} H30" fill="none" stroke="#7a5235" stroke-width="2"/>`;
 g+=`<circle cx="0" cy="${-Hw-12}" r="0" fill="none"/>`;
 /* 屋簷：粗邊＋雪 */
 g+=`<path d="M${-hw-16},${-Hw+2} L0,${-Hw-rh-3} L${hw+16},${-Hw+2}" fill="none" stroke="${OL}" stroke-width="13"/><path d="M${-hw-16},${-Hw+2} L0,${-Hw-rh-3} L${hw+16},${-Hw+2}" fill="none" stroke="#6a4428" stroke-width="9"/>`;
 g+=`<path d="M${-hw-15},${-Hw-3} L0,${-Hw-rh-8} L${hw+15},${-Hw-3}" fill="none" stroke="${OL}" stroke-width="9"/><path d="M${-hw-15},${-Hw-3} L0,${-Hw-rh-8} L${hw+15},${-Hw-3}" fill="none" stroke="${SNOW}" stroke-width="6"/>`;
 let ic='';for(let k=0;k<16;k++){const t=(k+.5)/16,x=-hw-12+t*(W+24),y=-Hw+3-(1-Math.abs(x)/(hw+16))*rh;ic+=`M${f(x-2.2)},${f(y+3)} L${f(x)},${f(y+9+(k%3)*3)} L${f(x+2.2)},${f(y+3)}Z `}g+=`<path d="${ic}" fill="#e6f2f5" stroke-width="1"/>`;
 g+=`<rect x="-50" y="-24" width="100" height="0" fill="none"/>`;
 return g}
const tableArt=()=>`<ellipse cx="0" cy="2" rx="34" ry="6" fill="#000" opacity=".1" ${NS_}/><rect x="-30" y="-6" width="12" height="8" fill="#8a5a34"/><rect x="18" y="-6" width="12" height="8" fill="#8a5a34"/><rect x="-26" y="-20" width="52" height="14" rx="2" fill="#b98a5a"/><path d="M-26,-13 H26" fill="none" stroke="#8a5a34" stroke-width="1.2"/><path d="M-22,-6 V3 M22,-6 V3" fill="none" stroke-width="2.4"/>`+
 (r()<.6?`<ellipse cx="-10" cy="-17" rx="7" ry="2.4" fill="#fbf6ea" stroke-width="1.2"/><path d="M6,-19 h10 l-1,5 h-8Z" fill="#c99a5b" stroke-width="1.2"/><circle cx="9" cy="-20" r="2" fill="#e0b070" stroke-width="1"/><circle cx="13" cy="-20" r="2" fill="#e0b070" stroke-width="1"/>`:`<rect x="-3" y="-26" width="6" height="8" rx="1.5" fill="#f1ead8" stroke-width="1.2"/><path d="M0,-26 q2,-3 0,-6 q-2,3 0,6" fill="#f5a030" stroke-width=".8"/><ellipse cx="-14" cy="-17" rx="6" ry="2.2" fill="#fbf6ea" stroke-width="1.2"/>`);
const rail=()=>`<path d="M-32,0 V-26 M0,0 V-26 M32,0 V-26" fill="none" stroke="#7a5235" stroke-width="4"/><path d="M-34,-24 H34 M-34,-12 H34" fill="none" stroke="#8a5a34" stroke-width="3.4"/><path d="M-34,-27 H34" fill="none" stroke="${SNOW}" stroke-width="3"/>`;
/* 露台的木頭躺椅：人坐著靠在椅背上（側面），腿上蓋格紋毛毯（2026-11-12 改：原本只露出頭，看起來很怪） */
const lounger=()=>{const bl=pk(['#c4473c','#3f6fa8','#6f9a4a']),st='#fbf6ea';
 let g=`<ellipse cx="2" cy="2" rx="26" ry="5" fill="#000" opacity=".1" ${NS_}/><path d="M-16,0 L-12,-10 M14,0 L14,-10 M-20,-10 H18" fill="none" stroke="#7a5235" stroke-width="3"/><path d="M-12,-10 L-24,-40" fill="none" stroke="${OL}" stroke-width="7"/><path d="M-12,-10 L-24,-40" fill="none" stroke="#a8784a" stroke-width="4.4"/>`;
 g+=act(-2,-10,1,{view:'side',pose:'sit',nogear:1,hat:pk([0,0,-1])},false);
 g+=`<path d="M-6,-24 Q4,-27 16,-20 L18,-9 Q6,-6 -4,-8Z" fill="${bl}"/><path d="M-2,-24 L1,-8 M6,-24 L8,-7 M13,-21 L14,-8 M-5,-18 L17,-15 M-4,-12 L18,-11" fill="none" stroke="${st}" stroke-width="1.4" opacity=".75"/><path d="M18,-9 l2,4 M15,-8 l1,4 M12,-8 l0,4" fill="none" stroke="${bl}" stroke-width="1.4"/>`;
 return g};
const firePit=()=>`<ellipse cx="0" cy="0" rx="30" ry="9" fill="#9d9684"/>`+[...Array(9)].map((_,i)=>{const a=i/9*Math.PI*2;return `<ellipse cx="${f(Math.cos(a)*28)}" cy="${f(Math.sin(a)*8)}" rx="6" ry="4" fill="${pk(['#b0a996','#9d9684','#c6bfae'])}" stroke-width="1.4"/>`}).join('')+T(0,-2,.8,campfire());
const skiRack=()=>{let g=`<path d="M-30,0 L-26,-34 M30,0 L26,-34 M-30,-30 H30" fill="none" stroke="#7a5235" stroke-width="3"/>`;
 [-22,-15,-8,1,8,15,22].forEach((x,i)=>{const c=pk(['#c4473c','#5a86b0','#e0b44a','#2b2420','#6f9a4a']);g+=i%3===2?`<path d="M${x},2 L${x+2},-44" fill="none" stroke="#9aa0a4" stroke-width="1.6"/><circle cx="${x+2}" cy="-44" r="2" fill="#3d3833" stroke="none"/>`:`<path d="M${x-2},2 L${x-2},-40 Q${x},-48 ${x+2},-40 L${x+2},2Z" fill="${c}" stroke-width="1.4"/>`});
 return g+`<path d="M-32,-31 H32" fill="none" stroke="${SNOW}" stroke-width="2.4"/>`};
const groomer=()=>{let g=`<ellipse cx="0" cy="3" rx="62" ry="8" fill="#9fb1b8" opacity=".35" ${NS_}/>`;
 g+=`<path d="M44,0 V-12 M52,0 V-12 M60,0 V-12 M68,0 V-12" fill="none" stroke="#dfe7ea" stroke-width="2"/><rect x="32" y="-16" width="40" height="14" rx="3" fill="#8a9298"/><path d="M36,-2 v4 M42,-2 v4 M48,-2 v4 M54,-2 v4 M60,-2 v4 M66,-2 v4" fill="none" stroke-width="1.4"/>`;
 g+=`<rect x="-46" y="-18" width="80" height="18" rx="9" fill="#3d3833"/>`+[-36,-22,-8,6,20].map(x=>`<circle cx="${x}" cy="-9" r="5.5" fill="#6a6f74" stroke-width="1.4"/>`).join('');
 g+=`<path d="M-40,-18 L-34,-34 H28 L32,-18Z" fill="#c8323a"/><path d="M-18,-34 L-14,-58 H18 L22,-34Z" fill="#c8323a"/><path d="M-12,-54 H14 L17,-38 H-15Z" fill="#bcd8e4"/><path d="M1,-54 V-38" fill="none" stroke-width="1.4"/><rect x="-6" y="-64" width="10" height="6" rx="2" fill="#f5a030"/>`;
 g+=`<path d="M-48,-10 L-62,-4 Q-66,-18 -60,-32 L-46,-26" fill="#e0b44a"/><path d="M-62,-4 Q-66,-18 -60,-32" fill="none" stroke="#a8842a" stroke-width="1.4"/><path d="M-60,-32 Q-70,-14 -64,0" fill="none" stroke="${SNOW}" stroke-width="4"/>`;
 return g};
const cannon=()=>{let g=`<ellipse cx="0" cy="2" rx="26" ry="5" fill="#9fb1b8" opacity=".35" ${NS_}/><path d="M-18,0 L-6,-24 M18,0 L6,-24 M0,0 V-24" fill="none" stroke="#6a6f74" stroke-width="3.4"/><circle cx="-18" cy="0" r="3.4" fill="#3d3833"/><circle cx="18" cy="0" r="3.4" fill="#3d3833"/>`;
 g+=`<g transform="translate(0,-30) rotate(-28)"><rect x="-16" y="-14" width="30" height="28" rx="5" fill="#e8b830"/><ellipse cx="-16" cy="0" rx="6" ry="14" fill="#c99a20"/><ellipse cx="14" cy="0" rx="5" ry="13" fill="#3d3833"/><path d="M14,-9 L14,9 M8,0 L20,0" fill="none" stroke="#9aa0a4" stroke-width="1.4"/><path d="M-10,-14 V14 M0,-14 V14" fill="none" stroke="#c99a20" stroke-width="1.2"/></g>`;
 g+=wrapAn('float',`<g fill="#ffffff" stroke="#c9d6dc" stroke-width="1">${[[24,-52,4],[34,-60,3.4],[30,-44,3],[44,-66,2.8],[42,-52,2.4],[54,-70,2.2],[50,-58,2]].map(([x,y,q])=>`<circle cx="${x}" cy="${y}" r="${q}"/>`).join('')}</g>`,true);
 return g};
const netArt=()=>{let g=`<path d="M-44,2 Q0,-4 44,2 Q0,8 -44,2Z" fill="${SNOW}" stroke-width="1.4"/><path d="M-42,-2 Q0,-6 42,-2 L42,-26 Q0,-30 -42,-26Z" fill="#f08a2a" opacity=".85"/>`;
 let m='';for(let x=-36;x<=36;x+=8)m+=`M${x},-28 L${x+6},-3 M${x+6},-28 L${x},-3 `;g+=`<path d="${m}" fill="none" stroke="#c85a10" stroke-width="1"/>`;
 g+=`<path d="M-42,-2 Q0,-6 42,-2 L42,-26 Q0,-30 -42,-26Z" fill="none" stroke-width="1.8"/><path d="M-42,2 V-32 M0,0 V-32 M42,2 V-32" fill="none" stroke="#6a6f74" stroke-width="3"/>`;
 return g+`<g fill="#f08a2a" stroke-width="1.2"><circle cx="-42" cy="-33" r="2.6"/><circle cx="0" cy="-33" r="2.6"/><circle cx="42" cy="-33" r="2.6"/></g>`};
/* 沿著坡邊的安全網（往北延伸 L；d＝竿子往哪邊斜，讓網子看得到一條細帶） */
function sideNet(L,d){const dx=6*d,hh=20;let g=`<path d="M0,6 Q${-6*d},${-L/2} 0,${-L-4} L${dx},${-L-4} Q${dx+4*d},${-L/2} ${dx},6Z" fill="${SNOW}" stroke="none" opacity=".8"/>`;
 g+=`<path d="M0,0 L0,${-L} L${dx},${-L-hh} L${dx},${-hh}Z" fill="#f08a2a" opacity=".5" stroke="none"/>`;
 let m='';for(let y=0;y>-L;y-=8)m+=`M0,${y} L${dx},${y-hh-8} `;g+=`<path d="${m}" fill="none" stroke="#e0701a" stroke-width=".9" opacity=".8"/>`;
 g+=`<path d="M${dx},${-hh} L${dx},${-L-hh}" fill="none" stroke="#e0701a" stroke-width="1.6"/>`;
 for(let y=0;y>=-L;y-=40)g+=`<path d="M0,${y} L${dx},${y-hh}" fill="none" stroke="#6a6f74" stroke-width="2.2"/><circle cx="${dx}" cy="${y-hh}" r="1.8" fill="#f08a2a" stroke-width="1"/>`;
 return g}
const trailSign=()=>`<path d="M0,0 V-70" fill="none" stroke="${OL}" stroke-width="6.4"/><path d="M0,0 V-70" fill="none" stroke="#8a5a34" stroke-width="3.6"/>`+
 [[-64,'g'],[-46,'b'],[-28,'k']].map(([y,k],i)=>{const d=i%2?-1:1;return `<path d="M${d>0?-6:6},${y-8} H${d*30} L${d*38},${y} L${d*30},${y+8} H${d>0?-6:6}Z" fill="#fbf6ea"/>`+
  (k==='g'?`<circle cx="${d*16}" cy="${y}" r="5" fill="#4f9a4a" stroke-width="1.2"/>`:k==='b'?`<rect x="${d*16-4.6}" y="${y-4.6}" width="9.2" height="9.2" fill="#3f6fb0" stroke-width="1.2"/>`:`<path d="M${d*16},${y-6} L${d*16+6},${y} L${d*16},${y+6} L${d*16-6},${y}Z" fill="#2b2420" stroke-width="1.2"/>`)}).join('')+`<path d="M-8,-74 Q0,-80 8,-74Z" fill="${SNOW}"/>`;
/* 動物（原創造型） */
const hare=()=>`<ellipse cx="2" cy="1" rx="14" ry="3" fill="#b4c4d2" opacity=".6" ${NS_}/><ellipse cx="2" cy="-8" rx="12" ry="9" fill="#fbf9f3"/><circle cx="-8" cy="-15" r="7" fill="#fbf9f3"/><path d="M-11,-20 Q-14,-34 -9,-34 Q-6,-30 -7,-20Z M-6,-20 Q-4,-34 0,-32 Q0,-26 -3,-19Z" fill="#fbf9f3"/><path d="M-12,-30 Q-11,-34 -9,-34 Q-8,-32 -8,-30Z M-2,-29 Q-1,-32 0,-32 Q0,-30 -1,-28Z" fill="#3d3833" stroke="none"/><circle cx="-10" cy="-16" r="1.4" fill="${OL}" ${NS_}/><circle cx="-14.4" cy="-13.5" r="1" fill="#e8a0a0" ${NS_}/><circle cx="14" cy="-9" r="3" fill="#fbf9f3"/>`;
const ptarm=()=>`<ellipse cx="0" cy="1" rx="11" ry="2.6" fill="#b4c4d2" opacity=".6" ${NS_}/><path d="M-10,-6 Q-10,-15 0,-14 Q10,-14 12,-6 Q8,0 0,0 Q-8,0 -10,-6Z" fill="#fbf9f3"/><circle cx="-8" cy="-15" r="5.5" fill="#fbf9f3"/><path d="M-11,-20 q3,-2 5,0" fill="none" stroke="#d8413a" stroke-width="2"/><circle cx="-9" cy="-16" r="1.1" fill="${OL}" ${NS_}/><path d="M-13.4,-15 l-3,1 l3,1Z" fill="#3d3833" stroke-width=".8"/><path d="M10,-8 l5,-3 l-1,5Z" fill="#3d3833" stroke-width="1"/>`;
const squirrelBody=(c='#b0683a')=>`<path d="M4,-8 Q16,-10 16,-22 Q16,-32 8,-30 Q12,-24 8,-18 Q4,-14 2,-12Z" fill="${shade(c,.12)}"/><ellipse cx="-1" cy="-7" rx="6.5" ry="7.5" fill="${c}"/><circle cx="-4" cy="-17" r="5.2" fill="${c}"/><path d="M-7,-21 l-1,-4 l3,2Z M-2,-21 l0,-4 l2,3Z" fill="${c}" stroke-width="1"/><ellipse cx="-2" cy="-5" rx="3" ry="4" fill="#efd9b8" ${NS_}/><circle cx="-6" cy="-17.5" r="1.1" fill="${OL}" ${NS_}/><circle cx="-9" cy="-15.6" r=".9" fill="${OL}" ${NS_}/>`;
const squirrelD=()=>`<ellipse cx="2" cy="1" rx="10" ry="2.4" fill="#b4c4d2" opacity=".6" ${NS_}/>`+squirrelBody()+(r()<.5?`<ellipse cx="-8" cy="-9" rx="2.8" ry="3.4" fill="#8a5a34" stroke-width="1"/>`:'');
const snowballs=()=>`<g fill="#fbf9f3" stroke-width="1.4"><circle cx="-7" cy="-4" r="4.6"/><circle cx="3" cy="-4" r="4.6"/><circle cx="-2" cy="-10" r="4.4"/><circle cx="10" cy="-3" r="3.6"/></g>`;
const stump=()=>`<ellipse cx="0" cy="0" rx="13" ry="4" fill="#8a5a34"/><rect x="-11" y="-14" width="22" height="14" fill="#8a5a34"/><ellipse cx="0" cy="-14" rx="11" ry="4" fill="${SNOW}"/>`;

/* 坐在雪地上的單板新手（正面，腳綁單板、膝蓋立起來；專門畫，不是把站姿轉 90 度） */
function sitBoarder(o){const ch=chibi({top:'coat',shirt:o.shirt,pants:o.pants,skin:o.skin,hair:o.hair,hs:o.hs,hat:o.hat??-1,arm:0,mood:o.mood??0,mitts:o.mitts||'#3d3833',boots:'#3d3833',scarf:0});
 const pa=o.pants,leg=(x0,y0,x1,y1)=>limb(`M${x0},${y0} L${x1},${y1}`,pa,6);
 return `<ellipse cx="0" cy="2" rx="26" ry="4.5" fill="#b4c4d2" opacity=".55" ${NS_}/><g transform="translate(0,-5)">${ch}${o.pat||''}${o.gear||''}</g>`+
  `<rect x="-12" y="-14" width="24" height="9" rx="4.5" fill="${pa}"/>`+leg(-8,-15,-10,-3)+leg(8,-15,10,-3)+`<circle cx="-8.5" cy="-15.5" r="4" fill="${pa}" stroke-width="1.4"/><circle cx="8.5" cy="-15.5" r="4" fill="${pa}" stroke-width="1.4"/>`+
  `<rect x="-25" y="-3" width="50" height="7" rx="3.5" fill="${o.board}"/><path d="M-20,.5 H20" fill="none" stroke="#fbf6ea" stroke-width="1.4" opacity=".8"/>`+
  `<rect x="-15" y="-6" width="9" height="6" rx="2" fill="#3d3833" stroke-width="1.2"/><rect x="6" y="-6" width="9" height="6" rx="2" fill="#3d3833" stroke-width="1.2"/>`}
/* 站在單板上滑行（正面）：arm 1 一手抬、arm 2 兩手張開保持平衡 */
function rideBoarder(o,arm){const ch=chibi({top:'coat',shirt:o.shirt,pants:o.pants,skin:o.skin,hair:o.hair,hs:o.hs,hat:o.hat??-1,arm,mood:1,mitts:o.mitts||'#3d3833',boots:'#3d3833',scarf:0});
 const pa=o.pants;return `<ellipse cx="0" cy="3" rx="27" ry="4.5" fill="#b4c4d2" opacity=".55" ${NS_}/>`+limb('M-5,-16 L-8,-6',pa,6)+limb('M5,-16 L8,-6',pa,6)+`<g transform="translate(0,-13)">${ch}${o.pat||''}${o.gear||''}</g><rect x="-26" y="-4" width="52" height="7" rx="3.5" fill="${o.board}"/><path d="M-21,-.5 H21" fill="none" stroke="#fbf6ea" stroke-width="1.4" opacity=".8"/><rect x="-12" y="-8" width="9" height="6" rx="2" fill="#3d3833" stroke-width="1.1"/><rect x="3" y="-8" width="9" height="6" rx="2" fill="#3d3833" stroke-width="1.1"/>`}
/* 迷彩、格紋：畫在外套上（身體 x ±10、y -19～-4，頭在上面所以只畫到 -14） */
const camo=`<g ${NS_}><ellipse cx="-5" cy="-11" rx="3.4" ry="2.2" fill="#3e4a2a"/><ellipse cx="4" cy="-7" rx="3.6" ry="2" fill="#8a7a4a"/><ellipse cx="5" cy="-13" rx="2.6" ry="1.8" fill="#4e5a32"/><ellipse cx="-3" cy="-6" rx="2.6" ry="1.6" fill="#8a7a4a"/><ellipse cx="-7" cy="-7" rx="1.8" ry="1.4" fill="#4e5a32"/><ellipse cx="1" cy="-10" rx="1.8" ry="1.2" fill="#3e4a2a"/></g>`;
const plaid=`<g ${NS_}><path d="M-5,-15.5 V-6 M0,-16.5 V-5 M5,-15.5 V-6" stroke="#8fc2e8" stroke-width="1.1"/><path d="M-8,-13.5 H8 M-8.5,-10 H8.5 M-8.5,-6.6 H8.5" stroke="#8fc2e8" stroke-width="1.1"/><path d="M-2.5,-16 V-5.5 M2.5,-16 V-5.5 M-8.3,-11.8 H8.3 M-8.5,-8.3 H8.5" stroke="#e584a8" stroke-width=".7"/></g>`;
/* 彩蛋的四個人：使用者記得的那一對（迷彩上衣＋黑褲／粉紅粉藍格紋＋黃褲），另一對是兩位女生（中性短髮、長髮） */
/* 四個人都戴安全帽、護目鏡（外框桃紅色），護目鏡推在安全帽上，看得到臉 */
const gogPink=`<path d="M-19.5,-43 Q0,-48 19.5,-43" fill="none" stroke="${OL}" stroke-width="4.6"/><path d="M-19.5,-43 Q0,-48 19.5,-43" fill="none" stroke="#3d3833" stroke-width="2.6"/><rect x="-12.5" y="-52" width="25" height="12" rx="6" fill="#e0307a" stroke-width="1.6"/><rect x="-9.5" y="-49.5" width="19" height="7" rx="3.5" fill="#f5b040" stroke-width="1.1"/><path d="M-9,-46 Q0,-50.5 9,-46 L9,-48 Q0,-51.5 -9,-48Z" fill="#9b8be0" stroke="none"/><path d="M-5,-43.6 l3,-4" fill="none" stroke="#fff" stroke-width="1.2"/>`;
const NXG=c=>helmetG('front',c)+gogPink;
const NX={M:{shirt:'#7d8a52',pants:'#2b2420',skin:'#eebf98',hair:'#3a2a22',hs:0,board:'#2b2420',pat:camo,gear:NXG('#2b2420')},
 F:{shirt:'#f2b6c8',pants:'#e8c440',skin:'#f6d2b0',hair:'#3a2a22',hs:2,board:'#e86a9a',pat:plaid,gear:NXG('#f5f5f0')},
 W:{shirt:'#e0603a',pants:'#2f4470',skin:'#e2ae86',hair:'#2b2420',hs:0,board:'#3f6fb0',gear:NXG('#5a86b0')},
 L:{shirt:'#8fd3bf',pants:'#f4f1ea',skin:'#f6d2b0',hair:'#7a4a2a',hs:2,board:'#f5c842',gear:NXG('#3fa8a0')}};

Object.assign(KIND,{
 rime902:{w:60,h:104,fn:rime},rimeS902:{w:42,h:70,fn:rimeS},edgeTree902:{w:50,h:98,fn:pineS},
 gondolaTop902:{w:240,h:150,fn:gondolaTop},liftHut902:{w:100,h:70,fn:liftHut},lodgeBig902:{w:320,h:150,fn:lodgeBig},
 table902:{w:64,h:30,fn:tableArt},rail902:{w:70,h:28,fn:rail},lounger902:{w:52,h:34,fn:lounger},firePit902:{w:70,h:30,fn:firePit},skiRack902:{w:66,h:50,fn:skiRack},
 groomer902:{w:130,h:70,fn:groomer},cannon902:{w:52,h:60,fn:cannon},net902:{w:92,h:36,fn:netArt},trailSign902:{w:76,h:76,fn:trailSign},
 hare902:{w:30,h:26,fn:hare},ptarm902:{w:26,h:22,fn:ptarm},squirrel902:{w:24,h:28,fn:squirrelD},snowballs902:{w:28,h:16,fn:snowballs},stump902:{w:26,h:20,fn:stump},
 /* 路人 */
 skiCarry902:{w:56,h:64,fn:()=>withGear(2,()=>{const c=pk(['#c4473c','#5a86b0','#e0b44a','#6f9a4a']);/* 雙板扛在肩上：畫在人的後面（頭擋住中間），高度在肩膀，不會壓在耳朵上 */
  const d='M-30,-11 L32,-28 M-30,-7.5 L32,-24.5',sk=`<path d="${d}" fill="none" stroke="${OL}" stroke-width="5.6"/><path d="${d}" fill="none" stroke="${c}" stroke-width="3"/><path d="M28,-27 l6,-3 M28,-23.5 l6,-3" fill="none" stroke="${c}" stroke-width="3"/>`;
  return wrapAn('step',sk+kid({view:'side',pose:'hold',legs:'walk'}))})},
 boardCarry902:{w:44,h:64,fn:()=>withGear(2,()=>{const c=pk(['#c4473c','#3f6fb0','#2b2420','#e86a9a','#6f9a4a']),v=pk(['side','fq']);return act(0,0,1,{view:v,pose:'hold',legs:'walk'},'step')+`<rect x="${v==='side'?14:12}" y="-50" width="8" height="48" rx="4" fill="${c}"/><path d="M${v==='side'?18:16},-44 V-8" fill="none" stroke="#fbf6ea" stroke-width="1.2" opacity=".8"/>`})},
 boarderSit902:{w:54,h:52,fn:()=>{const o={shirt:pk(['#c4473c','#3f6fa8','#e0a03a','#5f7a3f','#7a5a8a','#e86a6a']),pants:pk(['#3d3833','#4a5a78','#5a4a3a','#6b7790']),skin:pk(SKIN),hair:pk(H.HAIR),hs:ri(0,4),hat:pk([-1,-1,-1,-1,2,3]),board:pk(['#c4473c','#2b2420','#5a86b0','#e0b44a','#6f9a4a'])};
  if(o.hat===0||o.hat<0){o.hat=-1;o.gear=helmetG('front',pk(HELMC))+gogG('front')}else o.gear=gogG('front',null,true);return wrapAn('lean',sitBoarder(o))}},
 glade902:{w:62,h:72,fn:()=>{const k=r()<.5?'boarder':'skier';return withGear(1,KIND[k].fn)}},
 boarder902:{w:62,h:72,fn:()=>withGear(1,KIND.boarder.fn)},skier902:{w:50,h:62,fn:()=>withGear(1,KIND.skier.fn)},
 terracePair902:{w:96,h:62,fn:()=>act(-24,0,1,{view:'side',pose:'sit',nogear:1},'nod')+act(24,0,-1,{view:'side',pose:'sit',nogear:1},'nod')+T(0,4,.82,tableArt())},
 photo902:{w:90,h:64,fn:()=>act(-24,0,1,{view:'side',pose:'hold',extra:`<rect x="11" y="-24" width="10" height="8" rx="1.5" fill="#3d3833" stroke-width="1.2"/><circle cx="21" cy="-20" r="2" fill="#9fd3ea" stroke-width="1"/>`},false)+act(18,0,-1,{view:'fq',pose:'up'},'cheer')+act(32,2,-1,{view:'fq',pose:'stand'},'hop')}
});
['rime902','rimeS902','cannon902','skiRack902','stump902'].forEach(k=>OCCK.add(k));
HOSTK.add('cannon902');HOSTN.cannon902='造雪機';HOSTK.add('snowmanBig');HOSTN.snowmanBig=HOSTN.snowmanBig||'雪人';HOSTK.add('skiRack902');HOSTN.skiRack902='雪板架';HOSTK.add('rime902');HOSTN.rime902='樹冰';
/* 動畫只在這一關生效 */
H.ANIMX[N]={hare902:['bob'],ptarm902:['bob'],squirrel902:['bob']};

/* ================= 6. 建築與佈景 ================= */
const onTop=(sp,y=1e6)=>{sp.y=y;return sp};
let TT=.7; /* 走失的小松鼠卡住的吊椅位置（0＝坡底站，1＝山頂站） */
/* 吊椅：鋼柱、上行／下行纜繩、一張張吊椅（上行的坐著人，看到背面） */
function chair(people){let g=`<path d="M0,0 V26" fill="none" stroke="#5a5f64" stroke-width="1.8"/><path d="M-12,26 H12 M-12,26 V38 M12,26 V38" fill="none" stroke="#5a5f64" stroke-width="2.4"/>`;
 if(people)for(const dx of people)g+=`<g transform="translate(${dx},40) scale(.5)">${withGear(1,()=>kid({view:'back',pose:'sit'}))}</g>`;
 return g+`<path d="M-13,38 H13 M-10,46 H10 M-12,38 L-10,46 M12,38 L10,46" fill="none" stroke="#3d4448" stroke-width="2.6"/>`}
function liftLine(){let g=`<g>`;const up=t=>{const[x,y]=LP(t);return[x-11,y-CH]},dn=t=>{const[x,y]=LP(t);return[x+11,y-CH]};
 g+=`<path d="M${f(up(0)[0])},${f(up(0)[1])} L${f(up(1)[0])},${f(up(1)[1])} M${f(dn(0)[0])},${f(dn(0)[1])} L${f(dn(1)[0])},${f(dn(1)[1])}" fill="none" stroke-width="1.8"/>`;
 [.16,.34,.52,.86].forEach(t=>{const[x,y]=LP(t);g+=`<path d="M${f(x)},${f(y)} V${f(y-CH-6)}" fill="none" stroke="${OL}" stroke-width="7"/><path d="M${f(x)},${f(y)} V${f(y-CH-6)}" fill="none" stroke="#7d868c" stroke-width="4.4"/><path d="M${f(x-16)},${f(y-CH-4)} H${f(x+16)}" fill="none" stroke="#5a5f64" stroke-width="4"/><path d="M${f(x-4)},${f(y-CH+40)} H${f(x+4)} M${f(x-4)},${f(y-CH+60)} H${f(x+4)} M${f(x-4)},${f(y-CH+80)} H${f(x+4)}" fill="none" stroke="#5a5f64" stroke-width="1.6"/>`});
 for(let t=.07;t<.97;t+=.07){if(Math.abs(t-TT)<.05||[.16,.34,.52,.86].some(q=>Math.abs(q-t)<.02))continue;const[x,y]=up(t);g+=`<g transform="translate(${f(x)},${f(y)})">${chair(r()<.7?(r()<.5?[-5,5]:[pk([-5,5])]):null)}</g>`}
 for(let t=.035;t<.97;t+=.07){if([.16,.34,.52,.86].some(q=>Math.abs(q-t)<.02))continue;const[x,y]=dn(t);g+=`<g transform="translate(${f(x)},${f(y)})">${chair(r()<.15?[pk([-5,5])]:null)}</g>`}
 return g+`</g>`}
function gondolaLine(){const a=[STN[0]-30,STN[1]-134],b=[180,1120];let g=`<path d="M${a[0]},${a[1]} L${b[0]},${b[1]} M${a[0]+10},${a[1]+6} L${b[0]+10},${b[1]+6}" fill="none" stroke-width="1.8"/>`;
 [[.25,'#c4473c',1],[.62,'#5a86b0',0],[.45,'#e0b44a',1]].forEach(([t,c,u])=>{const x=a[0]+(b[0]-a[0])*t+(u?0:10),y=a[1]+(b[1]-a[1])*t+(u?0:6);g+=`<g transform="translate(${f(x)},${f(y)}) scale(.8)">${cabinSVG(c,r()<.6)}</g>`});
 return g}
/* 上段樹冰、下段松樹，中間漸層 */
function plantTrees(){const dens=(x,y)=>{if(noTree(x,y))return 0;
  if(y<880)return x<780||x>1800?.72:x>1500&&x<1800&&y<620?0:.24;
  if(x<990&&y<1580)return .5;if(x<1070&&y>1980)return .38;if(x>1720&&y>880)return y>1700?.11:.14;
  if(onBeg(x,y,90))return .08;if(x>1060&&x<1700&&y>1500)return .14;return .3};
 for(let y=520;y<2640;y+=44)for(let x=530;x<2180;x+=48){const jx=x+sr(-16,16),jy=y+sr(-14,14),d=dens(jx,jy);if(!d||r()>d)continue;
  const[k,svg]=zoneTree(jy),K=KIND[k];if(!canPlace(jx,jy,K.w*.8,K.h*.5,false,.7))continue;add(jx,jy,K.w,K.h,k,svg,{sh:.6,fl:r()<.5})}}
let SPOT={};
function structures(){
 skyBirds(N);
 /* 先保留：吊椅底下、新手坡、露台的位置 */
 for(let t=0;t<=1;t+=.02){const[x,y]=LP(t);mark(x,y,60,40,1)}
 mark((BEG.x0+BEG.x1)/2,BEG.y1-10,BEG.x1-BEG.x0-20,BEG.y1-BEG.y0-20,1);
 /* 山頂纜車站＋包廂纜車（纜線往西南下山，畫在人物上面） */
 add(STN[0],STN[1],240,150,'house',gondolaTop(),{sh:.85});
 onTop(add(STN[0],STN[1],10,10,'lift',`<g transform="translate(${-STN[0]},${-STN[1]})">${gondolaLine()}</g>`,{mark:false}));
 add(1180,800,76,76,'trailSign902',trailSign());
 add(1390,700,120,90,'stall',stall('cocoa'));
 [[1290,760],[1470,770]].forEach(([x,y])=>add(x,y,30,50,'skiRack902',skiRack()));
 /* 吊椅 */
 TT=pk([.62,.7,.78]);
 add(LT[0],LT[1],100,70,'liftHut902',liftHut(),{sh:.9});add(LB[0],LB[1],100,70,'liftHut902',liftHut(),{sh:.9});
 onTop(add(LB[0],LB[1],10,10,'lift',`<g transform="translate(${-LB[0]},${-LB[1]})">${liftLine()}</g>`,{mark:false}));
 /* 雪道中段：壓雪車、造雪機、橘色安全網 */
 add(1240,1180,130,60,'groomer902',groomer(),{sh:.8});
 [[1000,1010],[1600,1420],[1110,1760],[1660,1900]].forEach(([x,y])=>add(x,y,52,60,'cannon902',cannon(),{sh:.8,fl:x>1300}));
 /* 山屋＋露台 */
 add(LODGE[0],LODGE[1],320,150,'lodgeBig902',lodgeBig(),{sh:.9});
 add(LODGE[0]+214,LODGE[1]-190,30,30,'steam',steamPuff(),{mark:false,s:1.3});
 add(LODGE[0]-178,LODGE[1]-6,46,28,'woodpile',KIND.woodpile.fn());add(LODGE[0]-180,LODGE[1]+40,46,28,'woodpile',KIND.woodpile.fn());
 [[700,1790],[790,1800],[880,1790],[730,1880],[830,1890]].forEach(([x,y])=>add(x,y,64,30,'table902',tableArt()));
 add(1010,1800,70,30,'firePit902',firePit());
 [[970,1890],[1040,1880]].forEach(([x,y])=>add(x,y,52,34,'lounger902',lounger(),{fl:true}));
 for(let x=DECK.x+40;x<DECK.x+DECK.w-80;x+=70)add(x,DECK.y+DECK.h+2,70,28,'rail902',rail(),{sh:.6});
 add(1030,1690,30,50,'skiRack902',skiRack());
 /* 樹 */
 plantTrees();
 /* 新手坡旁邊 */
 /* 新手坡兩側的橘色安全網：細竿子＋薄網，沿著坡邊南北排開（2026-11-12 使用者：雪道中段的拿掉，只留這裡） */
 {const L=BEG.y1-BEG.y0-110;add(BEG.x0-24,BEG.y1-50,16,L,'sideNet902',sideNet(L,1),{sh:.8});add(BEG.x1+22,BEG.y1-50,16,L,'sideNet902',sideNet(L,-1),{sh:.8})}
 add(1600,2270,40,62,'snowmanBig',KIND.snowmanBig.fn());add(1660,2530,40,62,'snowmanBig',KIND.snowmanBig.fn());add(980,1150,40,62,'snowmanBig',KIND.snowmanBig.fn());add(1440,860,40,62,'snowmanBig',KIND.snowmanBig.fn());
 /* 魔毯上往上坡的人（看到背面）、坡邊的小三角錐 */
 [BEG.y0+150,BEG.y0+270].forEach(y=>add(BEG.x0+19,y,24,40,'carpet902',withGear(2,()=>act(0,0,1,{view:'back',pose:'stand',s:.85},false))+`<rect x="-14" y="-3" width="9" height="4" rx="2" fill="${pk(['#3f6fb0','#e86a9a','#e0b44a'])}" stroke-width="1"/>`,{mark:false}));
 for(let y=BEG.y0+120;y<BEG.y1-60;y+=90)add(BEG.x1-10,y,14,16,'cone902',`<path d="M-6,0 L0,-15 L6,0Z" fill="#f08a2a"/><path d="M-3.6,-6 H3.6" fill="none" stroke="#fbf6ea" stroke-width="2"/>`,{mark:false});
 /* 彩蛋「下一個！」 */
 EGG=add(1340,BEG.y1-28,10,10,'egg902',eggSVG(),{mark:false});
 /* 故事角色的位置（scatter 時搬過去）：先佔好 */
 const tp=LP(TT);SPOT.target=[tp[0]-11,tp[1]];
 const hp=LP(pk([.34,.16])),hx=hp[0]+38;SPOT.helper=[hx,hp[1]+6];mark(hx,hp[1]+6,40,64);
 SPOT.giver=pk([[990,1735],[1000,1650]]);mark(SPOT.giver[0],SPOT.giver[1],36,64);
}
/* 整張場景的 scatter */
Object.assign(POOL,{
 summit902:[['snowMound',1.2],['rockS',.6],['snowballs902',.4],['ptarm902',.5],['hare902',.3],['bench',.15],['skiRack902',.3],['paperflake902',.3],['swimgog902',.25],['buckethat902',.25],['tag902',.3],['radish902',.25],['cookie902',.2],['sled',.3]],
 run902:[['snowMound',.6],['snowballs902',.3],['swimgog902',.2],['sled',.35],['buckethat902',.15]],
 wood902:[['snowMound',1],['rockS',.8],['stump902',.5],['hare902',.4],['ptarm902',.4],['radish902',.3],['branch902',.35],['cookie902',.2],['chestnut902',.2]],
 east902:[['snowMound',1],['rockS',.6],['stump902',.4],['ptarm902',.4],['hare902',.3],['buckethat902',.25],['tag902',.25],['radish902',.25]],
 lower902:[['snowMound',.8],['snowballs902',.5],['sled',.4],['swimgog902',.25],['tag902',.25],['pebble902',.35],['bench',.12]],
 lodge902:[['barrel',.5],['crate',.4],['lamp',.4],['bench',.3],['snowMound',.4],['coffee',.4],['soupbowl902',.5],['pot902',.4],['cookie902',.4],['branch902',.3],['paperflake902',.35],['tag902',.3],['pebble902',.3],['buckethat902',.2]],
 pinesW902:[['snowMound',1],['rockS',.7],['stump902',.6],['squirrel902',.7],['hare902',.5],['chestnut902',.5],['acorn',.3],['branch902',.4],['pebble902',.3],['paperflake902',.2]],
 pinesE902:[['snowMound',1],['rockS',.7],['stump902',.6],['squirrel902',.7],['hare902',.5],['chestnut902',.5],['acorn',.3],['branch902',.4]],
 base902:[['snowMound',.6],['snowballs902',.6],['sled',.5],['bench',.12],['pebble902',.35],['soupbowl902',.25],['swimgog902',.2],['cookie902',.25],['buckethat902',.2]],
 decor902:[['snowMound',2],['rockS',.8],['snowballs902',.5],['stump902',.4],['lamp',.15],['bench',.1],['hare902',.12],['ptarm902',.12]]});
SCATREG.allD902='all902';
SCATOK.run902=(x,y)=>onRun(x,y,-10);
SCATOK.base902=(x,y)=>!onBeg(x,y,20);
SCATOK.lower902=(x,y)=>!onBeg(x,y,20);
SCATOK.allD902=(x,y)=>!onBeg(x,y,20)&&!onDeck(x,y,-10)&&!inLift(x,y,40)&&!onRun(x,y,10)&&!(x>1700&&y>880&&r()<.65);
SCATOK.lodge902=(x,y)=>!(Math.abs(x-LODGE[0])<170&&y<LODGE[1]+8);
function clearCells(x,y,w,h){const a=Math.floor((x-w*.3)/CELL),c=Math.floor((x+w*.3)/CELL),b=Math.floor((y-h*.5)/CELL),d=Math.floor(y/CELL);for(let j=Math.max(0,b);j<=Math.min(GR-1,d);j++)for(let i=Math.max(0,a);i<=Math.min(GC-1,c);i++)occ[j*GC+i]=0}
function moveSp(sp,p){if(!sp||!p)return;clearCells(sp.x,sp.y,sp.w,sp.h);const[x,y]=p;sp.svg=sp.svg.replace(/translate\([^)]*\)/,`translate(${f(x)},${f(y)})`).replace(/data-x="[^"]*" data-y="[^"]*"/,`data-x="${f(x)}" data-y="${f(y)}"`);sp.x=x;sp.y=y}
function scatterAll(){
 /* 故事角色搬到固定的地方：老闆娘在山屋露台、小松鼠在半空的吊椅、維修員在纜車柱下 */
 const S=H.dbg.storySp();if(S){moveSp(S.giver,SPOT.giver);moveSp(S.target,SPOT.target);moveSp(S.helper,SPOT.helper)}
 /* 場地邊緣的樹依高度換成樹冰或松樹 */
 sprites.forEach(sp=>{if(sp.kind!=='edgeTree902')return;const[k,svg]=zoneTree(sp.y);sp.kind=k;sp.svg=T(sp.x,sp.y,1,svg,r()<.5).replace('<g ',`<g data-n="${sp.n}" `)});
 scatter('summit902',POOL.summit902,3000,90);scatter('run902',POOL.run902,1600,24);scatter('wood902',POOL.wood902,2200,60);scatter('east902',POOL.east902,1400,22);
 scatter('lower902',POOL.lower902,2200,50);scatter('lodge902',POOL.lodge902,2600,70);scatter('pinesW902',POOL.pinesW902,2400,70);scatter('pinesE902',POOL.pinesE902,1600,30);
 scatter('base902',POOL.base902,2200,50);scatter('allD902',POOL.decor902,8000,200);
 /* 中間雪道上只留滑雪的人：散步、聊天、椅子、路燈都拿走，再補滑雪的人 */
 for(let i=sprites.length-1;i>=0;i--){const sp=sprites[i];if(!OFFRUN.has(sp.kind)||!onRun(sp.x,sp.y,8))continue;clearCells(sp.x,sp.y,sp.w,sp.h);sprites.splice(i,1)}
 let k=0;for(let t=0;t<900&&k<10;t++){const y=sr(860,2100),x=sr(edgeAt(RUNL,y)+30,edgeAt(RUNR,y)-30),kind=r()<.55?'boarder902':'skier902',K=KIND[kind];if(!canPlace(x,y,K.w,K.h,false,.75))continue;add(x,y,K.w,K.h,kind,K.fn(),{fl:r()<.5,sh:.75});k++}
}
const OFFRUN=new Set(['walker3','chat','handInHand','dogWalk','petDog','petCat','cocoaChat','skiCarry902','boardCarry902','photo902','boarderSit902','terracePair902','sledKid','buildSnowman','snowballFight','shovel','carryBox','throwCatch','bench','lamp','stump902','hare902','ptarm902','squirrel902','skiRack902']);
SCENE_IMPL[N]={ground,structures,scatter:scatterAll};
Object.assign(VPLAN,{
 summit902:{skiCarry902:3,boardCarry902:2,chat:2,cocoaChat:2,photo902:1,walker3:2},
 run902:{boarder902:7,skier902:6},
 lower902:{boarder902:5,skier902:4},
 lodge902:{cocoaChat:3,terracePair902:2,chat:2,shovel:1,walker3:2},
 base902:{sledKid:2,buildSnowman:1,boarderSit902:2,skier902:1,walker3:1},
 pinesW902:{snowballFight:1,buildSnowman:1,dogWalk:1},
 pinesE902:{glade902:5,skier902:1},
 east902:{glade902:5,skier902:2},
 all902:{chat:3,handInHand:2,skiCarry902:2,boardCarry902:2,dogWalk:1,walker3:3,photo902:1}});

/* ================= 7. 連環小故事：搭上吊椅的小松鼠 ================= */
const miniGog=`<path d="M-9.5,-19.5 Q-4,-22 1.5,-19.5" fill="none" stroke="${OL}" stroke-width="3"/><path d="M-9.5,-19.5 Q-4,-22 1.5,-19.5" fill="none" stroke="#3d3833" stroke-width="1.4"/><rect x="-8.6" y="-22.4" width="7.6" height="5" rx="2.4" fill="#f5b040" stroke-width="1.2"/><path d="M-7.6,-19.4 l2,-2" fill="none" stroke="#fff" stroke-width=".9"/>`;
const pineconeMini=`<g transform="translate(-9,-8) scale(.32)">${ART.pinecone||''}</g>`;
STORIES[N]={title:'搭上吊椅的小松鼠',who:'山屋老闆娘',
 giver:()=>act(0,0,1,{view:'fq',pose:'reach',hat:-1,top:'long',shirt:'#8a3a3a',pants:'#5a4a3a',hair:'#9a9a9a',hs:3,mood:2,
  extra:`<path d="M-7,-13 H7 L8,-2 Q0,0 -8,-2Z" fill="#fbf6ea" stroke-width="1.4"/><path d="M-4,-8 H4" fill="none" stroke="#c4473c" stroke-width="1.2"/>`}),
 /* 目標：吊椅掛在纜繩下（離地 CH），小松鼠戴迷你護目鏡、抱著松果坐在椅子上 */
 target:()=>`<ellipse cx="0" cy="2" rx="16" ry="4" fill="#b4c4d2" opacity=".6" ${NS_}/><g transform="translate(0,${-CH}) scale(1.3)">`+
  `<path d="M0,0 V26" fill="none" stroke="#5a5f64" stroke-width="1.8"/><path d="M-13,26 H13 M-13,26 V38 M13,26 V38" fill="none" stroke="#5a5f64" stroke-width="2.4"/>`+
  `<g transform="translate(2,38) scale(1.45)">${squirrelBody('#b0683a')}${miniGog}${pineconeMini}</g>`+
  `<path d="M-14,38 H14 M-11,47 H11 M-13,38 L-11,47 M13,38 L11,47" fill="none" stroke="#3d4448" stroke-width="2.6"/>`+
  `<path d="M-22,8 q-4,-4 0,-8 M22,8 q4,-4 0,-8" fill="none" stroke-width="1.3"/></g>`,tw:50,th:CH+12,
 /* 幫手：纜車維修員（黃色工程帽、橘色背心），拿長柄勾桿 */
 helper:()=>act(0,0,1,{view:'side',pose:'hold',hat:-1,top:'coat',shirt:'#e86a2a',pants:'#3d4a5a',mitts:'#3d3833',boots:'#3d3833',nogear:1,
  extra:`<path d="M-16,-50 Q-17,-63 0,-64 Q17,-63 16,-50Z" fill="#f5c842"/><path d="M-18,-50 H20" fill="none" stroke="#e0a020" stroke-width="3"/><path d="M-7,-12 H9 M-7,-7 H9" fill="none" stroke="#f0f0d0" stroke-width="1.6"/>`+
  `<path d="M11,-14 L34,-108" fill="none" stroke="${OL}" stroke-width="5"/><path d="M11,-14 L34,-108" fill="none" stroke="#9aa3aa" stroke-width="2.8"/><path d="M34,-108 Q40,-116 34,-120 Q28,-121 28,-114" fill="none" stroke="${OL}" stroke-width="4.6"/><path d="M34,-108 Q40,-116 34,-120 Q28,-121 28,-114" fill="none" stroke="#c4473c" stroke-width="2.6"/>`}),hw:56,hh:124,
 ask:'山屋老闆娘：我養的小松鼠不見了！牠戴著迷你護目鏡，一定又跑去偷松果了。',
 need:'小松鼠抱著松果，坐在半空的吊椅上下不來⋯「吱！」\n找纜車的維修員幫忙吧。',
 got:'纜車維修員：我把吊椅停下來，用勾桿拉低，你在下面接住牠！',
 ok:'接到了！小松鼠鬆了一口氣，把松果塞進口袋。\n快帶回老闆娘身邊！'};

/* ================= 8. 彩蛋「下一個！」（使用者的真實經驗）：新手坡 =================
   平常：坡底坐著 2 個先滑下來的人（腳綁單板、面朝山下），教練站旁邊轉頭往山上比，坡頂還有 2 人等著。
   點坡頂的人（或點教練）：男生 S 型連續轉彎、女生落葉飄，滑到坡底坐下，教練再喊一次「下一個！」。
   四人到齊後教練豎大拇指，之後回到原位。不算點錯、不計分。 */
let EGG=null;
const TOPY=BEG.y0+64,SEATY=BEG.y1-34;
const EP={M:{top:[1300,TOPY+4],seat:[1372,SEATY]},F:{top:[1370,TOPY],seat:[1418,SEATY+5]},W:{seat:[1280,SEATY]},L:{seat:[1326,SEATY+5]}},COACH=[1490,SEATY-4];
function coachArt(ok){const o={top:'coat',shirt:'#c8323a',pants:'#2b2420',mitts:'#2b2420',boots:'#2b2420',hat:-1,hair:'#3a2a22',hs:0,nogear:1};
 if(ok)return `<g transform="scale(-1,1)">`+kid({...o,view:'fq',pose:'up',mood:1})+helmetG('fq','#f5f5f0')+`<g transform="translate(18,-29)"><rect x="-3" y="-2" width="7" height="7" rx="2" fill="#2b2420" stroke-width="1.2"/><rect x="-1" y="-8" width="3" height="7" rx="1.5" fill="#2b2420" stroke-width="1.2"/></g></g>`;
 return kid({...o,view:'bq',pose:'up'})+helmetG('bq','#f5f5f0')+`<path d="M-26,-62 l-6,-5 M-28,-55 l-8,-1 M-24,-69 l-3,-7" fill="none" stroke-width="1.8"/>`}
function eggSVG(){const P=(x,y)=>`translate(${x-1340},${y-(BEG.y1-28)})`;
 let g=`<path id="nxTrM902" d="" fill="none" stroke="#c9d6dc" stroke-width="3.2" stroke-linecap="round"/><path id="nxTrF902" d="" fill="none" stroke="#c9d6dc" stroke-width="3" stroke-linecap="round"/>`;
 g+=`<g transform="${P(...EP.W.seat)}">${sitBoarder(NX.W)}</g><g transform="${P(...EP.L.seat)}">${sitBoarder(NX.L)}</g>`;
 for(const k of ['M','F'])g+=`<g id="nx${k}902" transform="${P(...EP[k].top)}"><g class="nxR">${rideBoarder(NX[k],k==='M'?1:2)}</g><g class="nxS" style="display:none">${sitBoarder(NX[k])}</g></g>`;
 g+=`<g transform="${P(...COACH)}"><g id="nxC902">${coachArt(false)}</g><g id="nxK902" style="display:none">${coachArt(true)}</g></g>`;
 return g}
/* 滑行路線：男生 S 型、女生落葉飄（先往左、再往右，左右輪流） */
function rideAt(k,t){const[a,b]=EP[k].top,[c,d]=EP[k].seat;
 if(k==='M'){const e=t*t*(3-2*t),x=a+(c-a)*e+40*Math.sin(t*Math.PI*4)*(1-t*.4),y=b+(d-b)*t;return[x,y,-Math.cos(t*Math.PI*4)*12]}
 const n=6,u=t*n,i=Math.floor(Math.min(u,n-1e-6)),fr=u-i,s=fr*fr*(3-2*fr),A=58,base=a+(c-a)*t,dir=i%2?1:-1,from=i===0?0:(i%2?-A:A)*(i===1?.75:1),to=dir*A*(i===n-1?0:1);
 const x=base+from+(to-from)*s,y=b+(d-b)*(i+s*.85+.15*fr)/n;return[x,y,Math.sin(t*60)*4+dir*-3]}
/* 女生的雪痕：只畫到她目前滑到的地方（每一段只留中間一小片） */
function trailF(tNow){let d='';for(let s=0;s<6;s++){let seg='';for(let i=0;i<=16;i++){const t=(s+.2+.6*i/16)/6;if(t>tNow)break;const[x,y]=rideAt('F',t);seg+=(seg?' L':'M')+f(x-1340)+','+f(y+2-(BEG.y1-28))}if(seg.includes('L'))d+=(d?' ':'')+seg}return d}
function trailD(k){let d='';
 if(k==='M'){for(let i=0;i<=60;i++){const[x,y]=rideAt('M',i/60);d+=(i?' L':'M')+f(x-1340)+','+f(y+2-(BEG.y1-28))}return d}
 for(let s=0;s<6;s++)for(let i=0;i<=8;i++){const t=(s+.2+.6*i/8)/6,[x,y]=rideAt('F',t);d+=(i?' L':' M')+f(x-1340)+','+f(y+2-(BEG.y1-28))}return d.trim()}
const NXS={M:'top',F:'top',busy:false,raf:0,tm:0};
function nxEl(id){return document.getElementById(id)}
function nxReset(){cancelAnimationFrame(NXS.raf);clearTimeout(NXS.tm);NXS.M='top';NXS.F='top';NXS.busy=false;
 for(const k of ['M','F']){const g=nxEl('nx'+k+'902');if(!g)continue;g.setAttribute('transform',`translate(${EP[k].top[0]-1340},${EP[k].top[1]-(BEG.y1-28)})`);g.querySelector('.nxR').style.display='';g.querySelector('.nxS').style.display='none';
  const tr=nxEl('nxTr'+k+'902');if(tr){tr.setAttribute('d','');tr.style.strokeDasharray='';tr.style.strokeDashoffset='';tr.style.opacity=1}}
 const c=nxEl('nxC902'),ok=nxEl('nxK902');if(c&&ok){c.style.display='';ok.style.display='none'}}
function nxGo(k){const g=nxEl('nx'+k+'902'),tr=nxEl('nxTr'+k+'902');if(!g||NXS.busy||NXS[k]!=='top')return;NXS.busy=true;NXS[k]='go';
 const D=k==='M'?3400:5600,t0=performance.now(),L=tr&&tr.getTotalLength?tr.getTotalLength():600;
 try{tone(k==='M'?520:440,.08,'sine',.04)}catch(_){}
 const step=now=>{const t=Math.min(1,(now-t0)/D),[x,y,rot]=rideAt(k,t);g.setAttribute('transform',`translate(${f(x-1340)},${f(y-(BEG.y1-28))}) rotate(${f(rot)})`);
  if(tr){if(k==='M'){tr.style.strokeDasharray='';tr.style.strokeDashoffset='';let d='';for(let i=0;i<=60&&i/60<=t;i++){const[x,y]=rideAt('M',i/60);d+=(i?' L':'M')+f(x-1340)+','+f(y+2-(BEG.y1-28))}tr.setAttribute('d',d)}else{tr.style.opacity=1;tr.setAttribute('d',trailF(t))}}
  if(t<1){NXS.raf=requestAnimationFrame(step);return}
  g.setAttribute('transform',`translate(${EP[k].seat[0]-1340},${EP[k].seat[1]-(BEG.y1-28)})`);g.querySelector('.nxR').style.display='none';g.querySelector('.nxS').style.display='';NXS[k]='down';NXS.busy=false;
  if(NXS.M==='down'&&NXS.F==='down'){const c=nxEl('nxC902'),ok=nxEl('nxK902');if(c&&ok){c.style.display='none';ok.style.display=''}toast('教練：全員到齊！做得好 👍',2600);try{tone(660,.1,'triangle',.05);setTimeout(()=>tone(880,.14,'triangle',.05),120)}catch(_){}
   NXS.tm=setTimeout(nxReset,4200)}
  else toast('教練：下一個！',1800)};
 NXS.raf=requestAnimationFrame(step)}
const near=(x,y,p,w=20,h=62)=>Math.abs(x-p[0])<w&&y<=p[1]+8&&y>=p[1]-h;
const CAVE=[830,468];
TAPHOOKS[N]=(x,y)=>{if(Math.abs(x-CAVE[0])<46&&y<CAVE[1]+8&&y>CAVE[1]-50){toast('（冰洞口透出淡淡的藍光⋯裡面好像很深，還傳來滴水的回音。）',3200);try{tone(990,.12,'sine',.03);setTimeout(()=>tone(1320,.18,'sine',.025),180)}catch(_){}return true}
 if(!EGG)return false;
 for(const k of ['M','F'])if(NXS[k]==='top'&&near(x,y,EP[k].top)){if(NXS.busy){toast('（等前一個人滑完⋯）',1200);return true}nxGo(k);return true}
 if(near(x,y,COACH,22,70)){if(NXS.busy)return true;if(NXS.M==='top')nxGo('M');else if(NXS.F==='top')nxGo('F');else toast('教練：大家都很棒！',1600);return true}
 for(const k of ['W','L','M','F'])if(EP[k].seat&&near(x,y,EP[k].seat,24,40)&&(k==='W'||k==='L'||NXS[k]==='down')){toast('（腳綁著單板，坐在雪地上等同伴滑下來）',1800);return true}
 return false};
NGHOOKS.push(sc=>{if(sc===N)setTimeout(nxReset,0);else{cancelAnimationFrame(NXS.raf);clearTimeout(NXS.tm);if(sc===0)EGG=null}});
/* 新的一局重建場景時也要重新記 EGG：structures 會再設一次 */
})();

/* ===== 主帳號合併時加（2026-11-12）：第 10 關接在第 9 關後面。冒險地圖、過場。BORROW 不借（使用者決定） ===== */
(function(){const H=window.TH;if(!H)return;const N=10;const {T,f,OL,SNOW,RIDES,tone}=H;
/* ---- 冒險地圖：雪山溫泉村正北的山頂滑雪場＋往上的包廂纜車 ---- */
H.mapHook(1,({U,P,ink,FN})=>{if(U<N)return'';let g='';
 g+=`<path d="M258,74 L249,50" fill="none" stroke="${ink}" stroke-width="1.4"/><path d="M262,73 L253,49" fill="none" stroke="${ink}" stroke-width="1" opacity=".6"/>`;
 let sv=`<g class="mnode" data-n="${N}"><circle cx="240" cy="42" r="22" fill="transparent"/>`;
 sv+=H.MAPC.birds(204,24,.8)+P('M214,58 L228,36 L240,24 L252,34 L266,58Z','#fbf9f3',1.4)+`<path d="M240,24 L252,34 L266,58 L254,58 L246,40Z" fill="#c9d6dc" stroke="none"/>`;
 sv+=`<path d="M239,27 Q231,35 237,41 Q244,47 234,53 Q229,56 232,58" fill="none" stroke="#9fb1b8" stroke-width="1.6" stroke-dasharray="3 2"/><path d="M226,40 Q220,48 226,57" fill="none" stroke="#9fb1b8" stroke-width="1.4" stroke-dasharray="3 2"/>`;
 [[216,57],[222,54],[262,57]].forEach(([x,y])=>sv+=P(`M${x-3},${y} L${x},${y-7} L${x+3},${y}Z`,'#5f7a4a',1));
 sv+=`<g transform="translate(255,60)"><path d="M0,-3 v3" stroke="${ink}" stroke-width="1"/>`+P('M-5,0 H5 Q6,0 6,2 V8 Q0,10 -6,8 V2 Q-6,0 -5,0Z','#c4473c',1.1)+`<rect x="-4" y="2" width="8" height="3" rx="1" fill="#d6ecf0"/></g>`;
 sv+=`<g transform="translate(176,44)"><rect x="-36" y="-11" width="72" height="20" rx="10" fill="#fffaf0" stroke="${ink}" stroke-width="1.8"/><text y="4.5" text-anchor="middle" font-size="12" fill="${ink}" font-family="${FN}">高山滑雪場</text></g></g>`;
 return g+sv});
/* ---- 過場：回到溫泉村搭包廂纜車，跟著車廂往上：松林 → 穿過雲海 → 藍天樹冰（使用者看 A～D 選 C） ---- */
let s0=11;const R=()=>{s0=(s0*16807)%2147483647;return s0/2147483647},SR=(a,b)=>a+(b-a)*R();
const gond=(c,ppl)=>{let g=`<rect x="-9" y="-4" width="18" height="8" rx="2" fill="#7d868c"/><path d="M0,4 V16 Q0,20 -14,20 H-18" fill="none" stroke="#5a5f64" stroke-width="3.2"/>`;
 g+=`<rect x="-22" y="18" width="44" height="6" rx="3" fill="#5a5f64"/><rect x="-26" y="22" width="52" height="50" rx="11" fill="${c}"/><rect x="-21" y="28" width="42" height="22" rx="5" fill="#d6ecf0"/>`;
 if(ppl)[[-12,'#d98c46','#f2c9a0'],[1,'#6a4a3a','#e8b98f'],[13,'#e0b44a','#f2c9a0']].forEach(([x,hc,sk])=>g+=`<circle cx="${x}" cy="45" r="5.4" fill="${sk}" stroke-width="1.1"/><path d="M${x-5.6},43.5 Q${x},35 ${x+5.6},43.5Z" fill="${hc}" stroke-width="1"/>`);
 g+=`<path d="M-7,28 V50 M7,28 V50" fill="none" stroke="#8a969c" stroke-width="2"/><rect x="-21" y="28" width="42" height="22" rx="5" fill="none"/><path d="M-25,60 H25" fill="none" stroke="#fbf6ea" stroke-width="2.4"/><path d="M0,52 V71" fill="none" stroke-width="1.2" opacity=".5"/>`;
 return g};
const rimeR=k=>{let g=`<g transform="scale(${f(k)})"><ellipse cx="3" cy="1" rx="20" ry="5" fill="#c9d6dc" opacity=".6" stroke="none"/><rect x="-3" y="-10" width="6" height="11" fill="#5a4a3e"/><path d="M0,-74 C14,-62 22,-34 20,-12 Q0,-4 -20,-12 C-22,-34 -14,-62 0,-74Z" fill="#55655e"/>`;
 [[0,-62,8],[-7,-50,9],[7,-50,9],[-11,-36,10],[11,-36,10],[0,-40,10],[-13,-20,10],[13,-20,10],[0,-22,11]].forEach(([x,y,r])=>g+=`<circle cx="${x}" cy="${y}" r="${r}" fill="#f4f7f8" stroke-width="1.2"/>`);
 [[-4,-58],[6,-44],[-8,-30],[5,-26]].forEach(([x,y])=>g+=`<circle cx="${x}" cy="${y}" r="1.4" fill="#55655e" stroke="none"/>`);return g+`</g>`};
const pineR=(k,c)=>`<g transform="scale(${f(k)})"><ellipse cx="3" cy="1" rx="22" ry="5" fill="#c9d6dc" opacity=".6" stroke="none"/><rect x="-4" y="-14" width="8" height="15" fill="#7a5235"/><path d="M0,-78 L16,-50 L8,-50 L22,-28 L12,-28 L26,-12 L-26,-12 L-12,-28 L-22,-28 L-8,-50 L-16,-50Z" fill="${c}"/><path d="M0,-78 L7,-66 L2,-64 L-3,-60 L-7,-66Z M-8,-50 L-2,-46 L6,-48 L8,-50 Z M-12,-28 L-4,-24 L6,-26 L12,-28Z" fill="${SNOW}" stroke-width="1.2"/></g>`;
const cloudR=(x,y,k)=>{const C=[[-30,0,18],[-8,-12,24],[20,-6,20],[40,4,14],[6,6,20]];
 return `<g transform="translate(${f(x)},${f(y)}) scale(${f(k)})">`+C.map(([a,b,r])=>`<circle cx="${a}" cy="${b}" r="${r}" fill="#fff" stroke="#b9c8d0" stroke-width="2"/>`).join('')+C.map(([a,b,r])=>`<circle cx="${a}" cy="${b}" r="${r-2}" fill="#fff" stroke="none"/>`).join('')+`</g>`};
const houseR=(x,y,k,w,r)=>T(x,y,k,`<rect x="-22" y="-26" width="44" height="26" fill="${w}"/><rect x="-6" y="-16" width="12" height="16" fill="#5a4030"/><rect x="-18" y="-20" width="8" height="7" fill="#f6d27a"/><path d="M-28,-24 L0,-44 L28,-24Z" fill="${r}"/><path d="M-28,-26 L0,-46 L28,-26 L22,-26 L0,-40 L-22,-26Z" fill="${SNOW}"/>`);
const puffR=(x,y,k)=>T(x,y,k,`<g fill="#fff" opacity=".85" stroke="none"><circle cx="-8" cy="-10" r="9"/><circle cx="4" cy="-17" r="11"/><circle cx="13" cy="-8" r="7"/></g>`);
/* 2026-11-20 改成「直直往上」：包廂纜車往上升，腳下的溫泉村越縮越小往下沉，穿過一層層遠近不同的雲，最後山頂的樹冰從上面降下來 */
function gondolaRideSVG(){
 const cl=(k,o)=>`<g opacity="${o}">${cloudR(0,0,k)}</g>`;
 let s=`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><style>`+
  `@keyframes gs10{from{transform:translateY(0)}to{transform:translateY(900px)}}`+
  `@keyframes gd10{from{transform:translate(200px,820px) scale(1)}to{transform:translate(200px,820px) scale(.22)}}`+
  `@keyframes gc10{from{transform:translateY(-260px)}to{transform:translateY(760px)}}`+
  `@keyframes gt10{0%,55%{transform:translate(200px,-200px) scale(.7)}100%{transform:translate(200px,120px) scale(1)}}`+
  `@keyframes go10{from{transform:translate(318px,-60px) scale(.75)}to{transform:translate(318px,700px) scale(.75)}}`+
  `.gw10s{transform-box:fill-box;transform-origin:50% 0;animation:gw10sway 2.4s ease-in-out infinite}@keyframes gw10sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}`+
  `.cl10{animation:gc10 var(--d) linear infinite}</style>`;
 s+=`<defs><linearGradient id="gs10g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fa8d8"/><stop offset=".5" stop-color="#b4d6ec"/><stop offset="1" stop-color="#dcebf2"/></linearGradient></defs>`;
 s+=`<g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect y="-900" width="400" height="1500" fill="url(#gs10g)" stroke="none" style="animation:gs10 4.3s ease-in-out forwards"/>`;
 /* 腳下的溫泉村和松林：以畫面下方外面為中心縮小，看起來越來越遠 */
 let g=`<path d="M-500,-360 Q-200,-460 0,-430 Q200,-470 500,-360 V200 H-500Z" fill="${SNOW}"/>`;
 [[-150,-300,'#c9a77a','#7a4a3a'],[-60,-270,'#e3ddd0','#5a6a80'],[60,-290,'#c9a77a','#8a3a32'],[150,-260,'#e3ddd0','#7a4a3a'],[0,-220,'#c9a77a','#5a6a80'],[-130,-190,'#e3ddd0','#8a3a32'],[120,-180,'#c9a77a','#7a4a3a']].forEach(([x,y,w,r])=>g+=houseR(x,y,1.2,w,r)+puffR(x+20,y-62,1));
 g+=`<ellipse cx="20" cy="-360" rx="60" ry="20" fill="#a9d4dc"/>`+puffR(10,-380,1.3);
 for(let i=0;i<22;i++){const x=-380+i*36,y=-410-((i*37)%40);g+=T(x,y,.9,pineR(1,['#4f6a4a','#56703f','#5f7a4a'][i%3]))}
 s+=`<g style="animation:gd10 4.3s ease-out forwards">${g}</g>`;
 /* 遠的雲（小、慢、淡）→ 近的雲（大、快，蓋過車廂） */
 const layer=(n,k,o,d,xs)=>{let t='';for(let i=0;i<n;i++)t+=`<g class="cl10" style="--d:${d}s;animation-delay:-${(d*i/n).toFixed(2)}s"><g transform="translate(${xs[i%xs.length]},0)">${cl(k,o)}</g></g>`;return t};
 s+=layer(8,.55,.75,3.6,[40,300,170,360,90,240,20,330]);
 s+=`<g style="animation:go10 3.2s linear infinite">${gond('#5a86b0',0)}</g><path d="M${318},0 V600 M${330},0 V600" fill="none" stroke-width="1.2" opacity=".5"/>`;
 s+=layer(6,1,.9,2.4,[60,330,190,0,260,120]);
 /* 山頂：最後從上面降下來 */
 let top=`<path d="M-260,40 L-120,-90 L-40,-20 L40,-120 L140,-30 L260,40 V900 H-260Z" fill="#dfe7ea"/><path d="M26,-104 L40,-120 L54,-104 L46,-108 L40,-100 L34,-108Z" fill="${SNOW}" stroke-width="1.4"/><path d="M-260,60 Q0,10 260,60 V900 H-260Z" fill="${SNOW}"/>`;
 [[-150,70],[-90,60],[90,62],[160,74],[-40,90],[60,96]].forEach(([x,y])=>top+=T(x,y,.6,rimeR(1)));
 s+=`<g style="animation:gt10 4.3s ease-out forwards">${top}</g>`;
 /* 自己的車廂：纜線直直往上 */
 s+=`<path d="M196,-10 V610 M206,-10 V610" fill="none" stroke-width="2"/>`;
 s+=`<g transform="translate(201,250) scale(2.2)" stroke-width="1"><g class="gw10s">${gond('#c4473c',1)}</g></g>`;
 s+=layer(3,2.4,.82,1.5,[-40,380,330]);
 return s+`</g></svg>`}
RIDES.gondola={text:'回到溫泉村，搭包廂纜車穿過雲⋯',every:520,tick:k=>tone(k%2?340:400,.08,'sine',.045),svg:gondolaRideSVG};
})();

/* ===== 物件的合理位置（2026-11-12）：SPOTS 合理的地方（佔 55～65%）、BLEND 顏色相近的東西（其餘的至少一半）。說明在 core.js 的 placeItems ===== */
(function(){const H=window.TH;if(!H||!H.SPOTS)return;const R_=(a,b)=>a+Math.random()*(b-a);
/* 屋簷下的冰柱：山屋前面兩道斜屋簷、纜車站和吊椅站的平屋簷 */
const lodgeEave=()=>{const x=R_(-138,138);return [x,-112+3-(1-Math.abs(x)/166)*98+13]};
const flatEave=(hw,y)=>()=>[R_(-hw,hw),y];
const lodgeWall=()=>[(Math.random()<.5?-1:1)*R_(40,120),-99];
H.SPOTS[10]={
 icicle902:[['lodgeBig902',lodgeEave],['lodgeBig902',lodgeEave],['house',flatEave(88,-70)],['liftHut902',flatEave(36,-35)],['rime902',.55,.3],['pineS',.5,.2]],
 antler902:[['lodgeBig902',lodgeWall],['lodgeBig902',lodgeWall],['liftHut902',.6,.25],['woodpile',.9,.3]],
 fondue902:[['table902',.6,.25],['firePit902',.05,.6],['stall',.4,.3]],
 cocoa:[['table902',.6,.25],['stall',.4,.3],['lounger902',.05,.6],['bench',.4,.25],['firePit902',.05,.6]],
 marsh902:[['firePit902',.15,.5],['firePit902',.05,.6],['table902',.6,.25]],
 board902:[['skiRack902',.05,.6],['liftHut902',.03,.6],['lodgeBig902',.03,.45],['house',.03,.55]],
 helmet902:[['bench',.4,.25],['skiRack902',.05,.6],['table902',.6,.25],['liftHut902',.03,.6]],
 goggles902:[['bench',.4,.25],['skiRack902',.05,.6],['table902',.6,.25],['liftHut902',.03,.6]],
 pass902:[['liftHut902',.03,.5],['house',.03,.4],['trailSign902',.05,.6],['bench',.4,.25]],
 warmer902:[['bench',.4,.25],['table902',.6,.25],['lounger902',.05,.6],['woodpile',.05,.6]],
 brooch902:[['table902',.6,.25],['bench',.4,.25],['snowmanBig',.5,.15],['lounger902',.05,.6]],
 pinecone:[['pineS',.03,.6],['pineS',.45,.2],['stump902',.8,.2]]};
H.BLEND[10]={board902:['sled'],brooch902:['paperflake902','snowMound'],goggles902:['swimgog902'],helmet902:['buckethat902'],pass902:['tag902'],warmer902:['cookie902','snowMound'],
 cocoa:['soupbowl902','coffee'],fondue902:['pot902'],antler902:['branch902'],pinecone:['chestnut902','acorn'],icicle902:['radish902','snowMound','rime902'],marsh902:['pebble902','snowMound']};
})();
