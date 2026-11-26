/* 奇幻小鎮大搜查．引擎 core.js
   縮放拖曳、點擊、提示、計時、星星、過關畫面、收集冊、冒險地圖底圖、過場、測試模式、載入關卡檔。
   index.html 依序載入 core.js → art.js → levels.js，最後呼叫 boot()。三個檔案共用同一層（全域）變數。
   每一關的東西都寫在自己的 level{n}.js，載入時登記到這裡的表（從 window.TH 取用）：
     SCENES、SCREG、REG、POOL、KIND、SCENE_IMPL、WATERFN、STORIES、OUTFITS、TARGET、DENS、
     SKYC／SKYY／EDGE*／FRINGE*、BORROW、RIDES、HERE、MAPHOOKS（mapHook）、MAPTOP、TAPHOOKS、NGHOOKS、RESERVE、ROADK、RESETKEYS。
   關卡清單（標題、檔名、地圖名稱、下一站預告）在 levels.js。
   這個檔案由主帳號維護；分頭做關卡的對話不要改它，需要新功能請寫在 notes-{n}.md 的「需要引擎新增」。 */
const W=2800,H=1800,EX=140,NS='http://www.w3.org/2000/svg',OL='#2b2420',CELL=16;
const $=s=>document.querySelector(s);
const f=n=>Math.round(n*10)/10;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let rng=mulberry32(77),SCN=0;const ROADS=[];/* 這一關畫過的路（d、寬度），佈景不要種在路上 */
/* 拆檔關卡的掛勾：level4.js 等檔案載入後會把自己的內容註冊到這裡 */
const VPLANX={},SCENE_IMPL={},WATERFN={},RIDES={},MAPHOOKS=[],NEXTINFO={},HERE={},TAPHOOKS={},NGHOOKS=[],MAPTOP=[];
/* RESERVE[關卡]＝[[x,y,寬,高],…]：別的檔案（例如秘境入口）要在這一關預留、不讓佈景擺進去的位置（buildScene 在 structures 之前先佔好）
   ROADK[關卡]＝{k,x0}：這一關的路是用原本座標畫、再放大 k 倍（第 4 關）
   RESETKEYS：「重置進度」時要一起清掉的 localStorage（各檔案自己 push） */
const RESERVE={},ROADK={},RESETKEYS=[];let WINGO=0;/* 剛過關的下一站（從地圖點也播過場） */
/* 冒險地圖上的一層：z 越小越先畫（越下面）。沒設 z 的當作 2。第 1～3 關：小鎮→農莊的路 0、纜車與雪山 1、第 4、5 關 2、小鎮 3、農莊 4 */

/* 冒險地圖路線（2026-11-11 使用者選 D「桌遊點點路」）：一顆顆圓點。t＝'road' 陸路／'sea' 海路／'rail' 鐵路。
   關卡的 mapHook／MAPHOOKS 畫路線一律用 H.mapRoute(d,t,ink)，全部關卡的路線就會一樣。 */
function mapRoute(d,t,ink){ink=ink||'#2b2420';
 const P=(w,c,gap)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray=".1 ${gap}"/>`;
 if(t==='sea')return P(3.6,'#fffaf0',8)+P(2,'#4f86b0',8);
 if(t==='rail')return P(4.6,ink,7)+P(2.6,'#f0c040',7);
 /* 2026-11-21w 使用者選 a 羊皮紙藏寶圖精修：陸路改成紅色虛線 */
 const Q=(w,c)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="5 5"/>`;
 return Q(4.6,'#fbf1d6')+Q(2.4,'#b0412a')}
function mapHook(z,fn){fn.z=z;MAPHOOKS.push(fn);return fn}
/* ===== 2026-11-21w 冒險地圖「繪本插畫」風（使用者選 C）共用小工具：各關的 mapHook 用 H.MAPC.xxx =====
   地標不放底座、畫大一點、右側一塊陰影；旁邊點綴小樹、波浪草線、小鳥 */
const MAPC=(()=>{const ink='#2b2420',F=n=>(+n).toFixed(1),Pp=(d,c,w=1.3)=>`<path d="${d}" fill="${c}" stroke="${ink}" stroke-width="${w}" stroke-linejoin="round"/>`;
 const pine=(x,y,s=1,c='#5f8a3e')=>`<path d="M${F(x)},${F(y)} v${F(-5*s)}" stroke="#6a4a30" stroke-width="${F(1.8*s)}"/>`+Pp(`M${F(x-7*s)},${F(y-4*s)} L${F(x)},${F(y-15*s)} L${F(x+7*s)},${F(y-4*s)}Z`,c)+Pp(`M${F(x-5.4*s)},${F(y-10*s)} L${F(x)},${F(y-21*s)} L${F(x+5.4*s)},${F(y-10*s)}Z`,c)+`<path d="M${F(x)},${F(y-21*s)} L${F(x+5.4*s)},${F(y-10*s)} L${F(x+1.4*s)},${F(y-10*s)}Z M${F(x)},${F(y-15*s)} L${F(x+7*s)},${F(y-4*s)} L${F(x+2*s)},${F(y-4*s)}Z" fill="#000" opacity=".14"/>`;
 const round=(x,y,s=1,c='#6f9a4a')=>`<path d="M${F(x)},${F(y)} v${F(-6*s)}" stroke="#6a4a30" stroke-width="${F(2*s)}"/>`+`<circle cx="${F(x)}" cy="${F(y-11*s)}" r="${F(7*s)}" fill="${c}" stroke="${ink}" stroke-width="1.2"/><path d="M${F(x+2*s)},${F(y-17.4*s)} A${F(7*s)},${F(7*s)} 0 0 1 ${F(x+2*s)},${F(y-4.6*s)} A${F(5*s)},${F(7*s)} 0 0 0 ${F(x+2*s)},${F(y-17.4*s)}Z" fill="#000" opacity=".13"/><circle cx="${F(x-2.4*s)}" cy="${F(y-13.6*s)}" r="${F(2.2*s)}" fill="#fff" opacity=".22"/>`;
 const palm=(x,y,s=1)=>`<path d="M${F(x)},${F(y)} Q${F(x-2*s)},${F(y-10*s)} ${F(x+2*s)},${F(y-18*s)}" fill="none" stroke="#6a4a30" stroke-width="${F(1.8*s)}"/>`+[[-9,-3],[9,-3],[-6,-8],[7,-8]].map(([a,b])=>`<path d="M${F(x+2*s)},${F(y-18*s)} q${F(a*.6*s)},${F(b*s-2*s)} ${F(a*s)},${F(-b*.3*s+3*s)}" fill="none" stroke="#4f8a3a" stroke-width="${F(2.4*s)}" stroke-linecap="round"/>`).join('');
 /* 2026-11-22 使用者：關卡標示底下的波浪紋都刪除 → tufts、waves 不畫（函式留著） */
 const tufts=()=>'',tufts0=(x,y,w=40,c='#8a9a52')=>`<path d="M${F(x-w/2)},${F(y)} q${F(w/8)},-3 ${F(w/4)},0 q${F(w/8)},3 ${F(w/4)},0 M${F(x+2)},${F(y+3)} q${F(w/8)},-3 ${F(w/4)},0 q${F(w/8)},3 ${F(w/4)},0" fill="none" stroke="${c}" stroke-width="1.3" stroke-linecap="round"/>`;
 const birds=(x,y,s=1)=>`<path d="M${F(x)},${F(y)} q${F(3*s)},${F(-3*s)} ${F(6*s)},0 q${F(3*s)},${F(-3*s)} ${F(6*s)},0 M${F(x+14*s)},${F(y-6*s)} q${F(2.4*s)},${F(-2.4*s)} ${F(4.8*s)},0 q${F(2.4*s)},${F(-2.4*s)} ${F(4.8*s)},0" fill="none" stroke="${ink}" stroke-width="1.1" stroke-linecap="round"/>`;
 const waves=()=>'',waves0=(x,y,w=40)=>`<path d="M${F(x-w/2)},${F(y)} q${F(w/8)},-3 ${F(w/4)},0 t${F(w/4)},0 M${F(x)},${F(y+5)} q${F(w/8)},-3 ${F(w/4)},0 t${F(w/4)},0" fill="none" stroke="#fffaf0" stroke-width="1.6" stroke-linecap="round"/>`;
 /* 地標兩側的小景：樹／棕櫚／沒有樹，下面一條波浪草線（海邊就畫浪） */
 const deco=(x,y,w,o={})=>{let g='';const k=o.tree||'pine',s=o.s||.8;
  if(k==='pine')g+=pine(x-w/2-6,y,s)+pine(x+w/2+8,y+2,s*1.1)+(o.more?pine(x-w/2+4,y+4,s*.8):'');
  else if(k==='round')g+=round(x-w/2-6,y,s)+round(x+w/2+8,y+2,s*1.1);
  else if(k==='palm')g+=palm(x-w/2-4,y,s);
  g+=o.sea?waves(x,y+8,w*.9):tufts(x,y+6,w*.9,o.c);if(o.birds!==false)g+=birds(x-w*.3,y-(o.h||40),.8);return g};
 return {pine,round,palm,tufts,birds,waves,deco}})();
const r=()=>rng(),sr=(a,b)=>a+r()*(b-a),ri=(a,b)=>Math.floor(sr(a,b+1)),pk=a=>a[Math.floor(r()*a.length)];
const rnd=(a,b)=>a+Math.random()*(b-a);
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const T=(x,y,s,inner,fl)=>`<g transform="translate(${f(x)},${f(y)})${(s!==1||fl)?` scale(${f(fl?-s:s)},${f(s)})`:''}">${inner}</g>`;
const limb=(d,c,w=3.2)=>`<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w+2.8}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`;

let TYPES=[];
const chaikin=(P,n=2)=>{for(let k=0;k<n;k++){const Q=[P[0]];for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1];Q.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75])}Q.push(P[P.length-1]);P=Q}return P};
function isWater(x,y){return WATERFN[SCN]?WATERFN[SCN](x,y):false} /* 每關自己登記 WATERFN[關卡] */
/* 天空的小鳥：每關都有 */
function skyBirds(sc){const SC=SCENES[sc];for(let i=0;i<14;i++){const x=sr(SC.x0+150,SC.x1-100),y=sr(90,300);add(x,y,20,10,'bird',`<path d="M-8,0 q4,-6 8,0 q4,-6 8,0" fill="none" stroke-width="1.8"/>`,{mark:false})}}
const REG={}; /* 區域：各關檔案自己 Object.assign(REG,{…}) */



/* ================= occupancy ================= */
const GC=Math.ceil(W/CELL),GR=Math.ceil(3200/CELL),occ=new Uint8Array(GC*GR),wat=new Uint8Array(GC*GR);
for(let j=0;j<GR;j++)for(let i=0;i<GC;i++)wat[j*GC+i]=isWater(i*CELL+CELL/2,j*CELL+CELL/2)?1:0;
function cellsOf(x,y,w,h,sh=.8){const cx=x,cy=y-h/2,ww=w*sh,hh=h*sh;return[Math.floor((cx-ww/2)/CELL),Math.floor((cy-hh/2)/CELL),Math.floor((cx+ww/2)/CELL),Math.floor((cy+hh/2)/CELL)]}
function canPlace(x,y,w,h,water,sh){const[a,b,c,d]=cellsOf(x,y,w,h,sh);if(a<0||b<0||c>=GC||d>=GR)return false;
 for(let j=b;j<=d;j++)for(let i=a;i<=c;i++){const k=j*GC+i;if(occ[k]||wat[k]!==(water?1:0))return false}return true}
function mark(x,y,w,h,sh=.8){const[a,b,c,d]=cellsOf(x,y,w,h,sh);for(let j=Math.max(0,b);j<=Math.min(GR-1,d);j++)for(let i=Math.max(0,a);i<=Math.min(GC-1,c);i++)occ[j*GC+i]=1}

const sprites=[];
/* 第 3、4 關場地再放大 1.25 倍：面積 ×1.56，密度降 15% → 數量 ×1.33 */
const DENS={};const DECOYSKIP={};/* 2026-11-26：各關可設干擾物略過比例（預設 .3） *//* 佈景密度倍數：各關檔案自己設 DENS[關卡] */
const NOT_DECOY=new Set(['flowersY','koi','fishGrey','note']);const isDecoy=k=>DECOY[k]!==undefined&&!NOT_DECOY.has(k);
const ANIM={storyHelper:['nod'],storyGiver:['nod'],storyTarget:['wig','bob'],capyW:['bob'],capyR:['bob','wig'],monkeyFam:['bob'],monkeyFamW:['bob'],steam:['steam'],monkeyR:['bob','wig'],monkeyW:['bob'],bather:['lean'],cow:['bob','wig'],pig:['bob','wig'],scarecrow:['sway'],cat:['bob','wig','sway'],dog:['hop','bob','wig'],chicken:['peck','peck','bob'],sheep:['bob','sway'],frog:['hop'],owl:['wig','bob'],
 swan:['rock'],boat:['rock'],sail:['rock'],balloon:['float'],bird:['flap'],koi:['swim'],seaFish:['swim']};
const ALWAYS=new Set(['storyGiver','steam','bather','swan','boat','sail','balloon','bird']);
const DUR={lean:[2.4,3.6],step:[.55,.75],nod:[2.2,3.2],work:[.9,1.3],bend:[2,3],groove:[1.2,1.8],dance:[1.1,1.5],cheer:[.9,1.4],steam:[3,5],swing:[1.8,2.8],bob:[1.6,2.6],sway:[2.2,3.4],hop:[2.4,4],wig:[3,5],peck:[1.8,3],rock:[2.6,4],float:[4,6],flap:[.5,.8],swim:[2.5,4]};
/* 只用在某一關、不影響別關的設定（秘境或分頭做的關卡用）：ANIMX[關卡]={kind:[動作]}、ALWAYSX[關卡]=Set、HEAVYX[關卡]=Set */
const ANIMX={},ALWAYSX={},HEAVYX={};
const animOf=k=>(ANIMX[SCN]&&ANIMX[SCN][k])||ANIM[k],alwaysOf=k=>ALWAYS.has(k)||!!(ALWAYSX[SCN]&&ALWAYSX[SCN].has(k)),heavyOf=k=>HEAVY.has(k)||!!(HEAVYX[SCN]&&HEAVYX[SCN].has(k));
const HEAVY=new Set(['pineS','woodpile','toro','tubStack','snowmanBig','cabin','bfence','lift','rockS','barn','fruitTree','house','tower','castle','mill','mush','stall','fountain','light','tent','well','pine','round','bush','rock','barrel','crate','crateStack','sail','boat']);
function add(x,y,w,h,kind,inner,o={}){
 const A=animOf(kind);
 if(A&&(alwaysOf(kind)||r()<.75)){const a=pk(A),[d0,d1]=DUR[a];inner=`<g class="an a-${a}" style="--d:${f(sr(d0,d1))}s;animation-delay:-${f(sr(0,4))}s">${inner}</g>`}
 if(heavyOf(kind))inner=`<g stroke-width="2.7">${inner}</g>`;
 let svg=T(x,y,(o.s||1)*(isDecoy(kind)?.85:1),inner,o.fl); /* 2026-11-18：物件縮小 15%，干擾物也跟著縮小 15% */
 svg=svg.replace('<g ',`<g data-n="${sprites.length}"${inner.includes('class="an ')?` class="sp" data-x="${f(x)}" data-y="${f(y)}"`:''} `);
 const sp={x,y,w,h,kind,svg,n:sprites.length};{const m=o.say||(/data-say="([^"]*)"/.exec(inner)||[])[1];if(m)sp.say=m}sprites.push(sp);if(o.mark!==false)mark(x,y,w*(o.s||1),h*(o.s||1),o.sh||1);return sp}

/* ================= scene assembly ================= */
let groundSvg='';
const POOL={}; /* 佈景清單：各關檔案自己 Object.assign(POOL,{…}) */
const SCATREG={},SCATOK={}; /* scatter 的區域別名與位置檢查（各關檔案設定） */
function scatter(regKey,pool,tries,cap,water){
 const g=REG[SCATREG[regKey]||regKey];
 const D=DENS[SCN]||1;tries=Math.round(tries*D);cap=Math.round(cap*D);
 const tot=pool.reduce((a,b)=>a+b[1],0);let n=0;
 for(let t=0;t<tries&&n<cap;t++){
  let k=r()*tot,kind;for(const [nm,wt] of pool){k-=wt;if(k<=0){kind=nm;break}}if(!kind)kind=pool[0][0];
  if(isDecoy(kind)&&r()<(DECOYSKIP[SCN]??.3)){n++;continue} /* 干擾物減少 30%，空出來不補 */
  const K=KIND[kind],x=sr(g.x,g.x+g.w),y=sr(g.y,g.y+g.h);
  if(SCATOK[regKey]&&!SCATOK[regKey](x,y))continue; /* 例如河裡的東西要真的在河裡：各關檔案設定 SCATOK */
  if(!canPlace(x,y,K.w,K.h,!!K.water,.6))continue;
  add(x,y,K.w,K.h,kind,K.fn(),{fl:r()<.5,sh:.6});n++;
 }
}

function roadTester(){if(!ROADS.length)return{test:()=>false,done:()=>{}};const sv=document.createElementNS(NS,'svg');sv.setAttribute('style','position:absolute;left:0;top:0;width:1px;height:1px;visibility:hidden;pointer-events:none');document.body.appendChild(sv);
 const RK=ROADK[SCN],k=RK?RK.k:1,ps=ROADS.map(([d,w])=>{const p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('fill','none');p.setAttribute('stroke','#000');p.setAttribute('stroke-width',w+40);sv.appendChild(p);return p}),pt=sv.createSVGPoint();
 return{test:(x,y)=>{pt.x=RK?RK.x0+(x-RK.x0)/k:x;pt.y=y/k;try{return ps.some(p=>p.isPointInStroke(pt))}catch(_){return false}},done:()=>sv.remove()}}
/* 場地內靠邊界的一圈：佈景越靠邊越稀疏，避免「很密 → 突然全空」 */
/* 場地內靠邊的佈景：FRINGE[關卡]＝[[kind,權重],…]；FRINGEX[關卡]＝[[x0,y0,x1,y1],…] 不放的區塊。各關檔案自己設。 */
const FRINGE={},FRINGEX={};
function fringe(sc){const pool=(FRINGE[sc]||[]).filter(([k])=>KIND[k]);if(!pool.length)return;const {X0,X1,Y1,dL,dR,dB}=edgeInfo(sc),D=300,tot=pool.reduce((a,b)=>a+b[1],0),RT=roadTester(),EX_=FRINGEX[sc]||[];
 const pick=()=>{let q=r()*tot;for(const[k,w]of pool)if((q-=w)<0)return k;return pool[0][0]},dist=(x,y)=>Math.min(dL?x-X0:1e9,dR?X1-x:1e9,dB?Y1-y:1e9);
 for(let y=(SKYY[sc]||0)+40;y<Y1-6;y+=38)for(let x=X0+8;x<X1-8;x+=42){const jx=x+sr(-14,14),jy=y+sr(-12,12),d=dist(jx,jy);if(d>D||d<6)continue;if(r()>.22+.42*(d/D))continue;
  if(EX_.some(([a,b,c,e])=>jx>a&&jx<c&&jy>b&&jy<e))continue;const k=pick(),K_=KIND[k];if(!canPlace(jx,jy,K_.w*.8,K_.h*.5,false,.7))continue;if(RT.test(jx,jy))continue;
  add(jx,jy,K_.w,K_.h,k,K_.fn(),{sh:.6,fl:r()<.5})}
 RT.done()}
/* ===== 場地外的佈景：地形鏡像接出去＋當地樹木（不能點、沒有人物物件） ===== */
/* 場地外的佈景：SKYC 天空顏色、SKYY 天空到哪裡、EDGEDECO 場地外種什麼、EDGEM 哪幾邊把地形鏡像接出去、EDGED 哪幾邊種佈景
   EDGEMY／EDGEFILL／EDGELAND：瀑布山崖那種特別的邊。全部由各關檔案自己設 SKYC[關卡]=…。 */
const SKYC={},SKYY={},EDGEDECO={},EDGEM={},EDGED={},EDGEMY={},EDGEFILL={},EDGELAND={};
function edgeInfo(sc){const SC=SCENES[sc],X0=SC.x0,X1=SC.x1,Y1=SC.y1||H,m=SC.y1?220:300,e=EDGEM[sc]??'LRB',d=EDGED[sc]??'LRB';return{X0,X1,Y1,m,mL:e.includes('L'),mR:e.includes('R'),mB:e.includes('B'),dL:d.includes('L'),dR:d.includes('R'),dB:d.includes('B')}}
function edgeBack(sc){const {X0,X1,Y1,m,mL,mR,mB}=edgeInfo(sc),id=n=>`ec${sc}${n}`;let d='<defs>',g='';
 const clip=(n,x,y,w,h)=>{const ys=(EDGEMY[sc]||{})[n];d+=`<clipPath id="${id(n)}">`+(ys?ys.map(([a,b])=>`<rect x="${x}" y="${Math.max(a,y)}" width="${w}" height="${Math.min(b,y+h)-Math.max(a,y)}"/>`).join(''):`<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`)+`</clipPath>`},
  mir=(n,mx)=>{g+=`<g clip-path="url(#${id(n)})"><g transform="matrix(${mx})"><use href="#gnd"/></g></g>`};
 const sh=mB?Y1:Y1+m;
 if(mL){clip('L',X0-m,0,m+1,sh);mir('L',`-1,0,0,1,${2*X0},0`)}
 if(mR){clip('R',X1-1,0,m+1,sh);mir('R',`-1,0,0,1,${2*X1},0`)}
 if(mB){const bx0=mL?X0:X0-m,bx1=mR?X1:X1+m;clip('B',bx0,Y1-1,bx1-bx0,m+1);mir('B',`1,0,0,-1,0,${2*Y1}`)}
 if(mB&&mL){clip('BL',X0-m,Y1-1,m+1,m+1);mir('BL',`-1,0,0,-1,${2*X0},${2*Y1}`)}
 if(mB&&mR){clip('BR',X1-1,Y1-1,m+1,m+1);mir('BR',`-1,0,0,-1,${2*X1},${2*Y1}`)}
 const EF=(EDGEFILL[sc]||{}).L;
 if(EF==='wall'&&mL){/* 第 4 關：瀑布山壁和洞穴的岩壁直接往左延伸，不種樹 */
  const xa=X0-m,xb=X0+2,R=mulberry32(41);let top=`M${xa},700`,bot='';
  g+=`<path d="M${xa},674 H${xb} V704 H${xa}Z" fill="#5f6b3a" stroke="none"/>`;
  let wb=`M${xa},700 H${xb} V1112`;for(let x=xb;x>=xa;x-=24)wb+=` Q${f(x-12)},${f(1100+R()*10)} ${x-24},${f(1106+R()*6)}`;
  g+=`<path d="${wb}Z" fill="#9d9684" stroke="none"/><path d="${wb.slice(wb.indexOf('V1112')+5).replace(/^ Q/,'M'+xb+',1112 Q')}" fill="none" stroke="${OL}" stroke-width="2.4"/>`;
  g+=`<path d="M${xa},800 Q${X0-120},786 ${xb},798 M${xa},925 Q${X0-110},912 ${xb},922 M${xa},1028 Q${X0-130},1016 ${xb},1026" fill="none" stroke="#7f786a" stroke-width="1.6"/>`;
  [[X0-60,872,56,24],[X0-170,760,50,22],[X0-150,990,54,24],[X0-40,1060,44,18]].forEach(([x,y,w,h])=>g+=`<path d="M${x-w/2},${y} Q${x-w/2},${y-h} ${x},${y-h} Q${x+w/2},${y-h} ${x+w/2},${y} Z" fill="#a89b84" stroke="#7f786a" stroke-width="1.6"/>`);
  for(let x=xa;x<xb;x+=30)top+=` Q${x+15},${f(684+R()*8)} ${x+30},${f(690+R()*6)}`;
  for(let x=xb;x>=xa;x-=26)bot+=` L${x},${f(712+R()*16)} L${x-13},${f(706+R()*8)}`;
  g+=`<path d="${top} L${xb},700${bot}Z" fill="#7f9d48" stroke-width="2"/>`;
  for(let x=xa+14;x<xb-6;x+=R()*40+26){const n=3+Math.floor(R()*6);let v=`M${f(x)},714`;for(let k=0;k<n;k++)v+=` q${k%2?5:-5},8 0,16`;g+=`<path d="${v}" fill="none" stroke="#56703f" stroke-width="2"/>`}
 }
 if(EF&&EF!=='wall'&&mL){const[a,b,c,[c0,c1,cc,cl]]=EF,mid=(c0+c1)/2,hh=(c1-c0)/2;
  g+=`<path d="M${X0-m},${a} H${X0+1} V${b} H${X0-m}Z" fill="${c}" stroke="none"/>`;
  g+=`<path d="M${X0+1},${c0} C${X0-46},${c0+6} ${X0-74},${mid-hh*.48} ${X0-70},${mid} C${X0-66},${mid+hh*.55} ${X0-40},${c1-6} ${X0+1},${c1}Z" fill="${cc}" stroke="${OL}" stroke-width="2.2"/><path d="M${X0-20},${mid-hh*.45} q-14,30 -8,70 M${X0-38},${mid} q-6,40 6,80" fill="none" stroke="${cl}" stroke-width="2"/>`}
 return d+'</defs>'+`<rect x="${X0-m}" y="${-m}" width="${X1-X0+2*m}" height="${m}" fill="${SKYC[sc]||'#f6efe0'}" stroke="none"/>`+g}
function edgeDeco(sc){const {X0,X1,Y1,mL,mR,mB,dL,dR,dB}=edgeInfo(sc),R=mulberry32(900+sc),pool=(EDGEDECO[sc]||EDGEDECO[1]).filter(([k])=>KIND[k]),tot=pool.reduce((a,b)=>a+b[1],0);if(!tot)return'';
 const pick=()=>{let q=R()*tot;for(const[k,w]of pool)if((q-=w)<0)return k;return pool[0][0]},src=(x,y)=>[x<X0&&mL?2*X0-x:x>X1&&mR?2*X1-x:x,y>Y1&&mB?2*Y1-y:y],pts=[],LH_=EDGELAND[sc];
 const RT=roadTester(),dOut=(x,y)=>Math.max(x<X0?X0-x:0,x>X1?x-X1:0,y>Y1?y-Y1:0),tryP=(x,y)=>{const o_=dOut(x,y);if(o_<6||R()>.46*(1-o_/200))return;const lh=LH_&&LH_(x,y);if(lh===false)return;if(lh===true){pts.push([x,y]);return}const[sx,sy]=src(x,y);if(sy<(SKYY[sc]||0)+30)return;for(const[dx,dy]of[[0,0],[-18,0],[18,0],[0,-10]])if(isWater(sx+dx,sy+dy))return;if(RT.test(sx,sy))return;pts.push([x,y])};
 if(dL)for(let y=0;y<Y1+(dB?160:-20);y+=44)for(let x=X0-170;x<X0-8;x+=52)tryP(x+R()*30,y+R()*30);
 if(dR)for(let y=0;y<Y1+(dB?160:-20);y+=44)for(let x=X1+8;x<X1+170;x+=52)tryP(x+R()*30,y+R()*30);
 if(dB)for(let y=Y1+14;y<Y1+170;y+=44)for(let x=dL?X0:X0-150;x<(dR?X1:X1+150);x+=52)tryP(x+R()*30,y+R()*30);
 pts.sort((a,b)=>a[1]-b[1]);RT.done();
 return `<g class="edgeDeco" stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">`+pts.map(([x,y])=>{const k=pick();let inner=KIND[k].fn();if(heavyOf(k))inner=`<g stroke-width="2.7">${inner}</g>`;return T(x,y,.9+R()*.25,inner,R()<.5)}).join('')+'</g>'}
function buildScene(sc){
 const IMP=SCENE_IMPL[sc];
 groundSvg=IMP.ground(); /* 每關在自己的檔案登記 SCENE_IMPL[關卡]：{ground,structures,scatter} */
 (RESERVE[sc]||[]).forEach(([x,y,w,h])=>mark(x,y,w,h)); /* 別的檔案（例如秘境入口）在這一關預留的位置 */
 IMP.structures();
 fringe(sc);
 placeStory(sc);
 const VPLAN=Object.assign({},VPLANX); /* 路人安排：各關檔案自己 Object.assign(VPLANX,{…}) */
 for(const [reg,plan] of Object.entries(VPLAN)){if(!SCREG[sc].includes(reg))continue;const g=REG[reg];
  const list=[];for(const [k,n] of Object.entries(plan))for(let i=0;i<Math.round(n*(DENS[sc]||1));i++)list.push(k);
  list.sort(()=>r()-.5);
  for(const kind of list){const K=KIND[kind];for(let t=0;t<500;t++){const x=sr(g.x+K.w/2,g.x+g.w-K.w/2),y=sr(g.y+K.h*.5,g.y+g.h);
   if(!canPlace(x,y,K.w,K.h,false,.75))continue;add(x,y,K.w,K.h,kind,K.fn(),{fl:r()<.5,sh:.75});break}}}
 IMP.scatter();
 sprites.sort((a,b)=>a.y-b.y);
 return `<g id="gnd" stroke="${OL}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">${groundSvg}</g>`+edgeBack(sc)+edgeDeco(sc)+`<g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${sprites.map(s=>s.svg).join('')}</g>`;
}

/* ================= items ================= */
let items=[];
const OCCK=new Set(['pineS','woodpile','tubStack','snowmanBig','toro','rockS','fruitTree','cow','bush','barrel','crate','rock','walker','gnome','hay','pine','round','pot']);
function regionOf(x,y){for(const [k,g] of Object.entries(REG))if(x>=g.x&&x<=g.x+g.w&&y>=g.y&&y<=g.y+g.h)return k;return null}
function sampleIn(reg,t){const g=REG[reg];
 for(let i=0;i<60;i++){const x=rnd(g.x+10,g.x+g.w-10),y=rnd(g.y+10,g.y+g.h-10);
  const water=isWater(x,y);
  if(t.id==='fish'){if(reg==='fishstall')return{x,y};if(water&&isWater(x-16,y)&&isWater(x+16,y))return{x,y}}
  else if(!water)return{x,y};
  else if(t.float&&canFloat(x,y,t))return{x,y,float:true};}
 return null}
/* 少量物件可以漂在岸邊淺水：每局最多 3 個、同一種最多 1 個 */
function canFloat(x,y,t){if(Math.random()>.12)return false;if(items.filter(o=>o.float).length>=3||items.some(o=>o.float&&o.t.id===t.id))return false;
 for(let k=0;k<8;k++){const a=k*Math.PI/4;if(!isWater(x+Math.cos(a)*55,y+Math.sin(a)*55))return isWater(x-14,y)&&isWater(x+14,y)&&isWater(x,y+10)}return false}
function frontBlocked(sp){return sprites.some(o=>o!==sp&&o.y>sp.y&&o.y-o.h*.9<sp.y&&Math.abs(o.x-sp.x)<(o.w+sp.w)/2.2)}
/* ===== 物件擺放（2026-11-12 使用者定案）=====
   每種 4 個：合理的位置佔 55～65%（每種 2 或 3 個各半，平均 2.5 個），放在 SPOTS[關卡][物件id] 列的東西上或旁邊；
   其餘的至少一半「顏色相近混在一起」（BLEND[關卡][物件id] 列的干擾物、同色佈景旁）或隨機；剩下的照舊（42% 藏在東西後面露出一半，否則隨機）。
   SPOTS 一筆：[kind, fy, fx]：位置＝東西腳底 + (±fx×寬, −fy×高)；fx>0.5 表示放在旁邊（左右其中一邊）；或 [kind, sp=>[dx,dy]] 自己算。
   沒有設定的關卡或物件（例如秘境、借來的物件）就照舊。 */
const SPOTS={},BLEND={};
const spotOK=(c,minD)=>c.x>(SCENES[scene].x0||0)+12&&c.x<(SCENES[scene].x1||1e9)-12&&!isWater(c.x,c.y)&&!items.some(o=>Math.hypot(o.x-c.x,o.y-c.y)<minD);
function spotPos(t,used,regs){const cap=s=>Math.max(1,Math.round(s.w/30)),full=s=>(used.get(s)||0)>=cap(s); /* 大的東西（神社、山屋）可以放好幾個 */const L=(SPOTS[scene]||{})[t.id];if(!L||!L.length)return null;
 const inReg=s=>regs.some(k=>{const g=REG[k];return g&&s.x>g.x-60&&s.x<g.x+g.w+60&&s.y>g.y-60&&s.y<g.y+g.h+60});
 let cands=sprites.filter(s=>!full(s)&&L.some(e=>e[0]===s.kind));if(!cands.length)return null;
 const near=cands.filter(inReg);if(near.length&&Math.random()<.7)cands=near;
 for(let k=0;k<40;k++){const s=cands[Math.floor(Math.random()*cands.length)],es=L.filter(e=>e[0]===s.kind),e=es[Math.floor(Math.random()*es.length)];let dx,dy;
  if(typeof e[1]==='function'){const q=e[1](s);if(!q)continue;[dx,dy]=q}else{const fy=e[1]??.5,fx=e[2]??.3;dx=fx>.5?(Math.random()<.5?-1:1)*fx*s.w:rnd(-fx,fx)*s.w;dy=-fy*s.h}
  const c={x:s.x+dx,y:s.y+dy};if(!spotOK(c,k<25?60:40))continue;used.set(s,(used.get(s)||0)+1);return c}
 return null}
function blendPos(t,used,regs){const L=(BLEND[scene]||{})[t.id];if(!L||!L.length)return null;
 const inReg=s=>regs.some(k=>{const g=REG[k];return g&&s.x>g.x&&s.x<g.x+g.w&&s.y>g.y&&s.y<g.y+g.h});
 let cands=sprites.filter(s=>!used.has(s)&&L.includes(s.kind));const near=cands.filter(inReg);if(near.length)cands=near;if(!cands.length)return null;
 for(let k=0;k<30;k++){const s=cands[Math.floor(Math.random()*cands.length)],side=Math.random()<.5?-1:1,c={x:s.x+side*rnd(.35,.6)*Math.max(s.w,26),y:s.y-rnd(0,.25)*s.h};if(!spotOK(c,55))continue;used.add(s);return c}
 return null}
function placeItems(){
 items=[];
 const usedOcc=new Set(),spotUse=new Map();
 for(const t of TYPES){
  const regs=shuffle(t.regions.slice()),hasSpot=!!((SPOTS[scene]||{})[t.id]);
  /* 這一種的 4 個各用哪種方式：合理 2～3 個；其餘至少一半混色／隨機 */
  const nS=hasSpot&&t.id!=='fish'?(Math.random()<.5?3:2):0,rest=4-nS,nB=hasSpot?Math.ceil(rest/2):0;
  const how=[...Array(nS).fill('spot'),...Array(nB).fill('blend')];while(how.length<4)how.push('old');
  /* 2026-11-18：每一種有 1 個只露出一小角（藏在樹叢、岩石、房子等後面，大約只露出四分之一） */
  const cornerI=t.id==='fish'?-1:Math.floor(Math.random()*4);
  for(let i=0;i<4;i++){
   let p=null,mode='old';
   if(i===cornerI){const rr=t.r*.84;
    const cands=sprites.filter(s=>OCCK.has(s.kind)&&!usedOcc.has(s)&&s.h>=rr*2.2&&s.w>=rr*2.6&&t.regions.some(k=>{const g=REG[k];return g&&s.x>g.x&&s.x<g.x+g.w&&s.y>g.y&&s.y<g.y+g.h})&&!frontBlocked(s));
    for(let k=0;k<30&&!p&&cands.length;k++){const sp=cands[Math.floor(Math.random()*cands.length)],side=Math.random()<.5?-1:1;
     const c={x:sp.x+side*(sp.w*.5-t.r*.42),y:sp.y-Math.max(rr+4,Math.min(sp.h*.45,40))};
     if(!isWater(c.x,c.y)&&!items.some(o=>Math.hypot(o.x-c.x,o.y-c.y)<60)){usedOcc.add(sp);p={...c,occ:sp};mode='corner'}}}
   if(p){}
   /* 2026-11-26e：第 i 個先找「自己那個區域」附近的佈景，找不到才放寬到 4 個區域（不然合理位置都擠在佈景最多的中間，加寬的兩側幾乎沒有物件） */
   else if(how[i]==='spot'){p=spotPos(t,spotUse,[regs[i%regs.length]])||spotPos(t,spotUse,regs);if(p)mode='spot'}
   else if(how[i]==='blend'){p=blendPos(t,usedOcc,[regs[i%regs.length]])||blendPos(t,usedOcc,regs);if(p)mode='blend';else{mode='rand';for(let k=0;k<60&&!p;k++){const c=sampleIn(regs[(i+k)%regs.length],t);if(c&&!items.some(o=>Math.hypot(o.x-c.x,o.y-c.y)<60))p=c}}}
   for(let tries=0;tries<400&&!p;tries++){
    const reg=regs[(i+Math.floor(tries/80))%regs.length],minD=tries<250?75:45;
    const wantPeek=t.id!=='fish'&&reg!=='sky'&&Math.random()<.42;
    if(wantPeek){
     const g=REG[reg];
     const cands=sprites.filter(s=>OCCK.has(s.kind)&&!usedOcc.has(s)&&s.x>g.x&&s.x<g.x+g.w&&s.y>g.y&&s.y<g.y+g.h);
     if(cands.length){const sp=cands[Math.floor(Math.random()*cands.length)];
      const side=Math.random()<.5?-1:1;const c={x:sp.x+side*sp.w*.56,y:sp.y-Math.min(sp.h*.5,22)}; /* 至少露出一半 */
      if(!isWater(c.x,c.y)&&!frontBlocked(sp)&&!items.some(o=>Math.hypot(o.x-c.x,o.y-c.y)<minD)){usedOcc.add(sp);p={...c,occ:sp};continue}}
    }
    const c=sampleIn(reg,t);if(!c)continue;
    if(items.some(o=>Math.hypot(o.x-c.x,o.y-c.y)<minD))continue;
    p=c;
   }
   if(!p)p=sampleIn(regs[0],t)||{x:500,y:1500};
   items.push({t,x:p.x,y:p.y,float:!!p.float,occ:p.occ||null,r:t.r,rot:rnd(-t.rot,t.rot),sc:rnd(.72,.87),fl:Math.random()<.5,found:false,how:mode});
  }
 }
}
const itemsL=$('#itemsL'),marks=$('#marks'),fx=$('#fx');
/* ---- 小故事：每關一位頭上有「？」的角色，幫他找到東西就送幸運草 ---- */
const qBubble=(x,y,t)=>`<g class="sq" transform="translate(${x},${y})"><path d="M-11,-10 h22 q4,0 4,4 v9 q0,4 -4,4 h-9 l-5,5 v-5 h-8 q-4,0 -4,-4 v-9 q0,-4 4,-4z" fill="#fff7d6" stroke-width="1.6"/><text x="0" y="1.5" text-anchor="middle" font-size="12" font-weight="800" fill="${t==='♥'?'#d8413a':OL}" stroke="none" font-family="PingFang TC,Noto Sans TC,sans-serif">${t}</text></g>`;

/* 想念泡泡（2026-11-11 使用者選 B）：頭上的雲朵泡泡裡畫出他想要的東西，取代原本的「？」對話框。
   qThink(圖, 寬, 高, y)：y 是泡泡底部小圓點的位置（相對角色腳底）。秘境、望遠鏡少年也用它。 */
const QHEART=`<path d="M0,6 C-9,0 -8,-7 -3.6,-7 C-1.6,-7 0,-5.4 0,-4 C0,-5.4 1.6,-7 3.6,-7 C8,-7 9,0 0,6Z" fill="#e8574a" stroke-width="1.4"/>`;
const qThink=(art,w,h,y=-80)=>{const k=24/Math.max(w||26,h||26);return `<g class="sq"><g class="qbob"><path d="M-17,${y-14} q-6,-10 4,-14 q2,-9 12,-7 q6,-7 14,-1 q10,-2 11,8 q8,4 2,12 q2,9 -9,8 q-6,6 -14,1 q-9,4 -13,-2 q-9,0 -7,-5z" fill="#fffdf4" stroke-width="1.6"/><circle cx="-4" cy="${y+3}" r="2.6" fill="#fffdf4" stroke-width="1.2"/><circle cx="-1" cy="${y+9}" r="1.6" fill="#fffdf4" stroke-width="1"/><g transform="translate(2,${f(y-13+(h||26)*k/2)}) scale(${f(k)})">${art}</g></g></g>`};
/* 驚嘆號徽章（2026-11-11 使用者看 A～F 選 C）：金色圓徽章＋白色「！」，下方小尖角。
   使用者說泡泡裡畫出要找的動物會讓難度下降，所以故事角色全程只顯示驚嘆號，完成後才變成愛心泡泡。
   qMark(y)：y 是尖角的位置（相對角色腳底），和 qThink 的 y 一樣。 */
const QGLYPH={'!':`<path d="M-3,-11 Q0,-13 3,-11 L1.6,2 Q0,3.2 -1.6,2Z" fill="#fffdf4" stroke-width="1.5"/><circle cy="7" r="2.6" fill="#fffdf4" stroke-width="1.4"/>`,
 '?':`<path d="M-5,-5 Q-5,-11 0,-11 Q5.5,-11 5.5,-6 Q5.5,-2.4 1.4,-.6 Q0,0 0,3" fill="none" stroke-width="6.4" stroke-linecap="round"/><path d="M-5,-5 Q-5,-11 0,-11 Q5.5,-11 5.5,-6 Q5.5,-2.4 1.4,-.6 Q0,0 0,3" fill="none" stroke="#fffdf4" stroke-width="3.4" stroke-linecap="round"/><circle cy="7.6" r="2.6" fill="#fffdf4" stroke-width="1.4"/>`};
/* qMark(y, ch)：ch 是 '!'（故事角色，預設）或 '?'（第 5 關望遠鏡小孩等「有事想問」的角色，2026-11-11 使用者要求同樣式） */
const qMark=(y=-80,ch='!')=>`<g class="sq"><g class="qbob"><circle cy="${y-12}" r="12.5" fill="#f5c842" stroke-width="1.8"/><circle cy="${y-12}" r="9.6" fill="none" stroke="#fff3b0" stroke-width="1.2"/><g transform="translate(0,${y-12}) scale(.9)">${QGLYPH[ch]||QGLYPH['!']}</g><path d="M-3,${y+1} L0,${y+6} L3,${y+1}" fill="#f5c842" stroke-width="1.4"/></g></g>`;
/* 故事角色頭上：還沒完成時是驚嘆號徽章（不畫出要找的東西），完成後是愛心泡泡 */
/* 2026-11-21 使用者：完成後的愛心跑出雲朵外面 → 愛心移到雲朵正中間（雲朵中心約在 (4, y-21.5)） */
const storyThink=S=>{if(!S)return '';if(story&&story.done)return qThink(`<g transform="translate(1.3,-13.7)">${QHEART}</g>`,16,16);return qMark()};
const bow=(x,y,c)=>`<path d="M${x},${y} l-5,-3 v6Z M${x},${y} l5,-3 v6Z" fill="${c}" stroke-width="1.1"/><circle cx="${x}" cy="${y}" r="1.6" fill="${c}" stroke-width="1"/>`;
const STORIES={};/* 連環小故事：各關檔案自己設 STORIES[關卡] */
const SEQ=['giver','target','helper','target','giver'];
let story=null,storySp={giver:null,target:null,helper:null};
function placeStory(sc){storySp={giver:null,target:null,helper:null};const S=STORIES[sc];if(!S)return;
 const regs=(SCREG[sc]||[]).filter(k=>REG[k]&&!/^(sky|sky2|fishstall|water|harbor|pond)/.test(k));if(!regs.length)return;
 const c=SCENES[sc].c,pt=(ok)=>{for(let t=0;t<1500;t++){const g=REG[pk(regs)],x=sr(g.x,g.x+g.w),y=sr(g.y,g.y+g.h);if(!ok(x,y))continue;if(canPlace(x,y,40,64,false,.7))return[x,y]}return null};
 const a=pt((x,y)=>Math.hypot(x-c[0],y-c[1])<700);if(!a)return;
 const b=pt((x,y)=>Math.hypot(x-c[0],y-c[1])>600&&Math.hypot(x-a[0],y-a[1])>500);if(!b)return;
 const h=pt((x,y)=>Math.hypot(x-a[0],y-a[1])>450&&Math.hypot(x-b[0],y-b[1])>450)||pt(()=>true);
 storySp.giver=add(a[0],a[1],30,62,'storyGiver',S.giver()+storyThink(S),{sh:.7});
 storySp.target=add(b[0],b[1],S.tw,S.th,'storyTarget',S.target(),{sh:.7,fl:r()<.5});
 if(h)storySp.helper=add(h[0],h[1],S.hw,S.hh,'storyHelper',S.helper(),{sh:.7,fl:r()<.5})}
function storyBubble(){const sp=storySp.giver;if(!sp)return;const el=document.querySelector(`#bg [data-n="${sp.n}"] .sq`);if(el)el.outerHTML=storyThink(STORIES[scene])}
function onSpriteTap(sp){const S=STORIES[scene];
 const role=sp===storySp.giver?'giver':sp===storySp.target?'target':sp===storySp.helper?'helper':null;
 if(S&&story&&role){
  if(story.busy)return true;
  if(story.done){toast(role==='giver'?`${S.who}：謝謝你幫忙！`:'牠現在很開心～',1600);return true}
  const want=SEQ[story.step];
  if(role===want){const msg=[S.ask,S.need,S.got,S.ok][story.step];story.step++;
   if(story.step>=SEQ.length){finishStory();return true}
   toast(msg,4200);storyBubble();if(story.step===3)sfx.found();if(story.step===4&&S.reunion)reunion(S);return true}
  // 順序不對：給提示，不扣分
  const hint=role==='giver'?(story.step===0?S.ask:`${S.who}：拜託你了，${story.step>=4?'快帶回來給我！':'找到了嗎？'}`)
   :role==='target'?(story.step===0?'這是誰家的寶貝？好像有人在找牠⋯':story.step===2?S.need:(story.step>=4&&S.reunion)?`牠已經回到${S.who}身邊了，去跟${S.who}說說話吧！`:'牠乖乖跟著你，快帶回去吧！')
   :(story.step<2?'（看起來正在忙⋯也許之後會需要幫忙）':'已經幫過你囉！');
  toast(hint,3200);if(story.step===0&&role==='giver')story.step=1;return true}
 for(const c of [clovers.story,clovers.bonus]){if(c&&!c.revealed&&!c.found&&sp===c.host){if(c.kind==='story'&&!(story&&story.done))return false;revealClover(c);return true}}
 if(sp.say){toast(sp.say,1800);return true} /* 看板不寫字，點了才跳出名稱（2026-11-11） */
 return false}
/* ---- 小故事團聚（2026-11-24，使用者選 A＋D；先在極光山頂試）：STORIES[n].reunion={fly?:true,prints?:'paw'|'shoe',dur?:秒,card?:()=>SVG,say?:'…'}
   第 4 步（點目標第二次）之後：目標從原地沿路走／飛回提問的人身邊（畫面跟著，走路會留腳印）→ 到了冒愛心 → 跳出「團聚小卡」特寫（約 2.6 秒，可點掉）
   → 目標留在提問的人旁邊，再點提問的人說謝謝（第 5 步）。沒設 reunion 的關卡維持原樣。 */
function reunion(S){const R=S.reunion||{},g=storySp.giver,tg=storySp.target;if(!g||!tg)return;
 const el=document.querySelector(`#bg [data-n="${tg.n}"]`);story.busy=true;const my=story;
 if(el&&!tg._home)tg._home={x:tg.x,y:tg.y,tr:el.getAttribute('transform'),html:el.innerHTML,dx:el.dataset.x,dy:el.dataset.y,next:el.nextSibling,par:el.parentNode};
 const side=tg.x<g.x?-1:1,ex=g.x+side*34,ey=g.y+4,sx=tg.x,sy=tg.y,D=Math.hypot(ex-sx,ey-sy);
 const dur=(R.dur||Math.max(2.6,Math.min(6,D/260))*(R.fly?1.25:1))*1000; /* 11-24：飛行速度調降為 80%（使用者） */
 const art=R.after||S.target,w=svgEl('g',{},fx);w.innerHTML=art();if(el)el.style.visibility='hidden';
 const prints=svgEl('g',{opacity:.7},fx);let lastP=0;
 const t0=performance.now()+700;let lastCam=0;
 setTimeout(()=>{try{tweenTo(Math.max(view.s,base*1.15),sx,sy-30,600)}catch(_){}},0);
 const step=t=>{if(story!==my){w.remove();prints.remove();return} /* 中途按「重新開始」：停下來（位置由 reunionReset 還原） */
  const k=Math.max(0,Math.min(1,(t-t0)/dur)),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
  let x=sx+(ex-sx)*e,y=sy+(ey-sy)*e;
  if(R.fly)y-=Math.sin(Math.PI*k)*Math.min(160,40+D*.15);else y-=Math.abs(Math.sin(k*D/14))*3;
  const fl=ex<sx;w.setAttribute('transform',`translate(${f(x)},${f(y)})${fl&&!R.fly?' scale(-1,1)':''}`);
  if(!R.fly&&k>0&&k<1&&t-lastP>220){lastP=t;const px=sx+(ex-sx)*e,py=sy+(ey-sy)*e;
   prints.insertAdjacentHTML('beforeend',R.prints==='shoe'?`<ellipse cx="${f(px)}" cy="${f(py+2)}" rx="3" ry="5" fill="#8a96b0" opacity=".6" stroke="none"/>`:
    `<g transform="translate(${f(px)},${f(py+2)})" fill="#8a96b0" opacity=".6" stroke="none"><ellipse rx="2.6" ry="2"/><circle cx="-2.2" cy="-3" r="1"/><circle cx="2.2" cy="-3" r="1"/></g>`)}
  if(t-lastCam>650&&k<1){lastCam=t;const kk=Math.min(1,k+.18),ee=kk<.5?2*kk*kk:1-Math.pow(-2*kk+2,2)/2;try{tweenTo(view.s,sx+(ex-sx)*ee,sy+(ey-sy)*ee-40,700)}catch(_){}}
  if(k<1){requestAnimationFrame(step);return}
  /* 到了：把目標搬到提問的人旁邊（照 y 重新排前後） */
  tg.x=ex;tg.y=ey;
  if(el){el.setAttribute('transform',(el.getAttribute('transform')||'').replace(/translate\([^)]*\)/,`translate(${f(ex)},${f(ey)})`));
   if(el.dataset.x){el.dataset.x=f(ex);el.dataset.y=f(ey)}
   const par=el.parentNode,sib=[...par.children].find(c=>c!==el&&c.dataset&&c.dataset.n!=null&&sprites[+c.dataset.n]&&sprites[+c.dataset.n].y>ey);if(sib)par.insertBefore(el,sib);else par.appendChild(el);
   if(R.after)el.innerHTML=R.after();el.style.visibility=''}
  w.remove();setTimeout(()=>prints.remove(),2500);
  for(let i=0;i<3;i++)setTimeout(()=>floatText(g.x+(i-1)*18,g.y-70-i*6,'💗'),i*180);
  try{[784,988,1175,1568].forEach((q,i)=>tone(q,.18,'triangle',.12,i*.09))}catch(_){}
  setTimeout(()=>{if(story===my)reunionCard(S,()=>{if(story!==my)return;story.busy=false;toast(R.say||`${S.who}：（張開雙手）你回來了！⋯⋯快過來讓我說聲謝謝！`,3200)})},700)};
 requestAnimationFrame(step)}
/* 重新開始時：團聚搬走的目標回到原本的位置和樣子（使用者 11-24 回報） */
function reunionReset(){const ov=document.getElementById('reuOv');if(ov)ov.remove();const tg=storySp&&storySp.target,h=tg&&tg._home;if(!h)return;
 const el=document.querySelector(`#bg [data-n="${tg.n}"]`);tg.x=h.x;tg.y=h.y;
 if(el){el.setAttribute('transform',h.tr);el.innerHTML=h.html;if(h.dx!=null){el.dataset.x=h.dx;el.dataset.y=h.dy}el.style.visibility='';
  try{if(h.next&&h.next.parentNode===h.par)h.par.insertBefore(el,h.next);else h.par.appendChild(el)}catch(_){}}
 delete tg._home}
function reunionCard(S,done){let ov=document.getElementById('reuOv');if(ov)ov.remove();
 if(!document.getElementById('reuCss')){const st=document.createElement('style');st.id='reuCss';st.textContent=`#reuOv{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;background:rgba(24,28,46,.55);animation:reuF .3s ease-out}#reuOv .rc{background:#fff8e8;border:3px solid #2b2420;border-radius:18px;padding:10px;box-shadow:0 8px 0 rgba(0,0,0,.18);animation:reuP .45s cubic-bezier(.3,1.6,.5,1)}#reuOv .ht{animation:reuH 1.2s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}@keyframes reuF{from{opacity:0}}@keyframes reuP{from{transform:scale(.4);opacity:0}}@keyframes reuH{from{transform:translateY(0)}to{transform:translateY(-6px)}}`;document.head.appendChild(st)}
 const art=S.reunion&&S.reunion.card?S.reunion.card():`<g transform="translate(108,196) scale(2.6)">${S.giver()}</g><g transform="translate(172,198) scale(2.4)">${(S.reunion&&S.reunion.after||S.target)()}</g>`;
 ov=document.createElement('div');ov.id='reuOv';
 ov.innerHTML=`<div class="rc"><svg viewBox="0 0 280 230" width="280" height="230"><circle cx="140" cy="130" r="96" fill="#ffe7a8"/><circle cx="140" cy="130" r="70" fill="#fff2c8"/><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${art}<g class="ht"><g transform="translate(140,30) scale(2.6)">${heart(0,0)}</g><g transform="translate(106,44) scale(1.8)">${heart(0,0)}</g><g transform="translate(176,40) scale(2)">${heart(0,0)}</g></g></g></svg></div>`;
 document.body.appendChild(ov);let closed=false;const close=()=>{if(closed)return;closed=true;ov.remove();done&&done()};
 ov.addEventListener('pointerdown',close);setTimeout(close,2800)}
function finishStory(){if(!story||story.done)return;story.done=true;story.step=SEQ.length;const S=STORIES[scene];storyBubble();colStory(level);sfx.typeDone();
 const c=clovers.story,g=storySp.giver;if(g){burst(g.x,g.y-40);floatText(g.x,g.y-70,'📖 故事完成！')}
 if(c&&!c.found){addSpark(c,'fast');toast(`📖 ${S.title}：完成！\n${S.who}：謝謝你！我剛剛看到 🍀 幸運草藏在${dirFrom(g||{x:c.x,y:c.y},c)}的${HOSTN[c.host.kind]||'東西'}後面，去點點看！`,6000)}
 else if(!c){st.clover=true;colClover(level);toast(`📖 故事完成：${S.title}！送你一株幸運草 🍀`,3200)}
 else toast(`📖 故事完成：${S.title}！`,3200)}
function dirFrom(a,b){const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d<160)return '這附近';
 const ang=Math.atan2(dy,dx)*180/Math.PI,dirs=['右邊','右下方','下面','左下方','左邊','左上方','上面','右上方'];const k=Math.round(((ang+360)%360)/45)%8;
 return dirs[k]+(d>900?'很遠處':d>450?'':'不遠處')}
/* ---- 幸運草（每關一株，不在清單裡；找到可拿第三顆星） ---- */
const CLOVER=`<g transform="scale(.85)"><path d="M0,2 Q2,10 -2,16" fill="none" stroke="#4f7a3a" stroke-width="2"/>`+[0,90,180,270].map(a=>`<g transform="rotate(${a})"><path d="M0,0 C-7,-3 -9,-12 -3,-13 C-1,-13 0,-11 0,-10 C0,-11 1,-13 3,-13 C9,-12 7,-3 0,0Z" fill="#6fae4a"/></g>`).join('')+`<circle r="2" fill="#f5c842" stroke-width="1"/></g>`;
let clovers={story:null,bonus:null};
const HOSTK=new Set(['bush','round','pine','pineS','barrel','crate','crateStack','hay','rock','rockS','woodpile','tubStack','fern','rubble','snowMound','fruitTree','pillarB','stele','suitcase','well','pot']);
const HOSTN={bush:'草叢',round:'大樹',pine:'松樹',pineS:'小松樹',barrel:'木桶',crate:'箱子',crateStack:'一疊箱子',hay:'乾草堆',rock:'大石頭',rockS:'小石頭',woodpile:'柴堆',tubStack:'一疊木盆',fern:'蕨類',rubble:'碎石堆',snowMound:'雪堆',fruitTree:'果樹',pillarB:'斷掉的石柱',stele:'刻字石碑',suitcase:'皮箱',well:'水井',pot:'花盆'};
/* 每關兩株：story＝完成小故事後才點得出來（第三顆星）；bonus＝自己找的隱藏幸運草（隱藏第四顆星） */
function placeClover(){clovers={story:null,bonus:null};const SC=SCENES[scene],used=new Set(items.map(it=>it.occ).filter(Boolean));
 const hosts=sprites.filter(sp=>HOSTK.has(sp.kind)&&!used.has(sp)&&sp.x>SC.x0+60&&sp.x<SC.x1-60&&sp.y>420&&sp.y<(SC.y1||H)-60);
 const pick=(kind,ok)=>{for(let t=0;t<80&&hosts.length;t++){const h=hosts[Math.floor(Math.random()*hosts.length)];if(used.has(h)||!ok(h))continue;const side=Math.random()<.5?-1:1,x=h.x+side*h.w*.45,y=h.y-Math.min(h.h*.3,14);
  if(isWater(x,y)||items.some(o=>Math.hypot(o.x-x,o.y-y)<50))continue;used.add(h);return {kind,x,y,host:h,found:false,revealed:false,rot:rnd(-30,30)}}return null};
 const g=storySp.giver;
 if(STORIES[scene]&&g)clovers.story=pick('story',h=>Math.hypot(h.x-g.x,h.y-g.y)>350)||pick('story',()=>true);
 const cs=clovers.story;clovers.bonus=pick('bonus',h=>!cs||Math.hypot(h.x-cs.x,h.y-cs.y)>450)||pick('bonus',()=>true)}
function addSpark(c,cls){const h=c.host;const old=document.getElementById('cloverSpark-'+c.kind);if(old)old.remove();
 itemsL.insertAdjacentHTML('beforeend',`<g id="cloverSpark-${c.kind}" transform="translate(${f(h.x+sr(-h.w*.25,h.w*.25))},${f(h.y-h.h*.7)})"><path class="spark ${cls}" style="animation-delay:-${f(Math.random()*5)}s" d="M0,-7 L1.6,-1.6 L7,0 L1.6,1.6 L0,7 L-1.6,1.6 L-7,0 L-1.6,-1.6Z" fill="#fff6b0" stroke="#e0b44a" stroke-width="1"/></g>`)}
function revealClover(c){c.revealed=true;const el=document.getElementById('cloverEl-'+c.kind);if(el){el.style.display='';el.classList.add('cpop')}const sp=document.getElementById('cloverSpark-'+c.kind);if(sp)sp.remove();
 burst(c.x,c.y);toast(c.kind==='bonus'?'咦？這裡竟然也藏著一株！':'找到了！幸運草跳出來了！',1800);sfx.found()}
function foundClover(c){c.found=true;if(c.kind==='story'){st.clover=true;colClover(level)}else{st.bonus=true;colBonus(level)}
 const spk=document.getElementById('cloverSpark-'+c.kind);if(spk)spk.remove();const el=document.getElementById('cloverEl-'+c.kind);if(el){el.classList.add('got');setTimeout(()=>el.style.display='none',600)}
 burst(c.x,c.y);floatText(c.x,c.y-20,c.kind==='bonus'?'隱藏幸運草！':'幸運草！');toast(c.kind==='bonus'?'✨ 找到隱藏的幸運草！過關時會多一顆隱藏星星':'🍀 拿到這一關的幸運草了！',2600);sfx.typeDone()}
function renderItems(){
 itemsL.innerHTML=items.map((it,i)=>{
  const sx=it.fl&&it.t.id!=='letter'&&!it.t.nofl?-it.sc:it.sc; /* 2026-11-21 使用者：有字的物件（例：字母積木）不要左右顛倒 → 物件類型加 nofl:true 就不會隨機翻面 */
  let s=`<g class="item" data-i="${i}" transform="translate(${f(it.x)},${f(it.y)}) rotate(${f(it.rot)}) scale(${f(sx)},${f(it.sc)})"><g class="inner">${it.t.id==='fish'?'':it.float?`<ellipse cx="0" cy="${f(it.r*.55)}" rx="${f(it.r*1.25)}" ry="4" fill="#e6faf6" opacity=".85" stroke="#fff" stroke-width="1.2"/><path d="M${f(-it.r*1.6)},${f(it.r*.7)} q4,-3 8,0 M${f(it.r*1.0)},${f(it.r*.8)} q4,-3 8,0" fill="none" stroke="#fff" stroke-width="1.4"/>`:`<ellipse cx="2" cy="${f(it.r*.75)}" rx="${f(it.r*.9)}" ry="3" fill="#000" opacity=".18" stroke="none"/>`}${ART[it.t.id]}</g></g>`;
  if(it.occ)s+=`<g class="still">${it.occ.svg}</g>`;
  return s}).join('');
 [clovers.story,clovers.bonus].forEach(c=>{if(!c)return;itemsL.insertAdjacentHTML('afterbegin',`<g id="cloverEl-${c.kind}" class="item" style="display:none" transform="translate(${f(c.x)},${f(c.y)}) rotate(${f(c.rot)})"><g class="inner">${CLOVER}</g></g>`);
  if(c.kind==='bonus')addSpark(c,'slow')});
 itemsL.querySelectorAll('.item[data-i]').forEach(el=>items[+el.dataset.i].el=el);
 marks.innerHTML='';fx.innerHTML='';
 document.querySelectorAll('#bg .still').forEach(e=>e.classList.remove('still'));
 items.forEach(it=>{if(it.occ){const e=document.querySelector(`#bg [data-n="${it.occ.n}"]`);if(e)e.classList.add('still')}});
}

/* ================= view ================= */
const stage=$('#stage'),world=$('#world');
let PANO=false;let SW=1,SH=1,base=.6,minS=.3,maxS=2,view={s:.6,tx:0,ty:0};
function measure(){const r_=stage.getBoundingClientRect();SW=r_.width;SH=r_.height;base=Math.min(SW,SH*.8)/640*1.2;minS=base;maxS=base*2.8;{const S=SEC();if(S&&(S.pano()||(S.cine&&S.cine())))minS=base*.28;if(S&&S.room&&!PANO){const SC=SCENES[scene]||SCENES[1],P=pads(),fit=Math.min(SW/(SC.x1-SC.x0),(SH-P.t-P.b)/(SC.y1||H)),zk=(S.zoomK&&S.zoomK())||1;minS=fit*zk;maxS=fit*2.2*zk}} /* 2026-11-26m：開場撒完東西後鎖定放大 zoomK 倍（不能看全圖） */ /* 室內小關卡：整間房間剛好塞滿、最多放大約 2 倍 */if(PANO){const SC=SCENES[scene]||SCENES[1],fit=Math.min(SW/(SC.x1-SC.x0+2*EX),SH/((SC.y1||H)+2*EX))*.96;minS=Math.min(minS,fit)}} /* 開場比原本大 1.2 倍；最多只能縮回開場大小，不能拉遠看全圖 */
function clampV(){view.s=Math.max(minS,Math.min(maxS,view.s));const s_=view.s,SC=SCENES[scene]||SCENES[1];
 {const S=SEC();if(S&&S.room&&!PANO){const P=pads(),X0=SC.x0*s_,X1=SC.x1*s_,Y1=(SC.y1||H)*s_,av=SH-P.t-P.b,cl=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
  view.tx=X1-X0<=SW+.5?(SW-(X1-X0))/2-X0:cl(view.tx,SW-X1,-X0);view.ty=Y1<=av+.5?P.t+(av-Y1)/2:cl(view.ty,P.t+av-Y1,P.t);return}} /* 室內小關卡：比畫面小就置中，放大後不能拖出房間 */
 if(PANO){const X0=(SC.x0-EX)*s_,X1=(SC.x1+EX)*s_,Y0=-EX*s_,Y1=((SC.y1||H)+EX)*s_,cl=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
  view.tx=X1-X0<SW?(SW-(X1-X0))/2-X0:cl(view.tx,SW-X1,-X0);view.ty=Y1-Y0<SH?(SH-(Y1-Y0))/2-Y0:cl(view.ty,SH-Y1,-Y0);return}
 view.tx=Math.min(-(SC.x0-EX)*s_,Math.max(SW-(SC.x1+EX)*s_,view.tx));const P=pads();view.ty=Math.min(EX*s_+P.t,Math.max(SH-((SC.y1||H)+EX)*s_-P.b,view.ty))}
function pads(){const hd=document.getElementById('hud'),tr=document.getElementById('tray');return{t:hd?hd.offsetTop+hd.offsetHeight+6:0,b:tr?tr.offsetHeight:0}}
let crispT;
let spEls=[],animT;
function updateAnim(){const m=80,x0=-view.tx/view.s-m,y0=-view.ty/view.s-m,x1=(SW-view.tx)/view.s+m,y1=(SH-view.ty)/view.s+m;
 for(const o of spEls){const v=o.x>x0&&o.x<x1&&o.y>y0&&o.y<y1+60;if(v!==o.on){o.on=v;o.el.classList.toggle('on',v)}}}
const fogW=document.getElementById('fogWorld');
function apply(){world.style.transform=fogW.style.transform=`translate(${view.tx}px,${view.ty}px) scale(${view.s})`;if(PANO)panoSize();reveal();clearTimeout(crispT);crispT=setTimeout(crisp,260);clearTimeout(animT);animT=setTimeout(updateAnim,120)}
let lastCrispS=0;function crisp(){if(Math.abs(view.s-lastCrispS)<.02)return;lastCrispS=view.s;world.style.willChange='auto';requestAnimationFrame(()=>requestAnimationFrame(()=>world.style.willChange='transform'))}
function anim(dur,fn,done){const t0=performance.now();function step(t){const k=Math.min(1,(t-t0)/dur);fn(k);if(k<1)requestAnimationFrame(step);else if(done)done()}requestAnimationFrame(step)}
function tweenTo(ns,cx,cy,dur=450,done){
 const from={...view};ns=Math.max(minS,Math.min(maxS,ns));view={s:ns,tx:SW/2-cx*ns,ty:SH/2-cy*ns};clampV();const to={...view};view={...from};
 anim(dur,k=>{const e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;view.s=from.s+(to.s-from.s)*e;view.tx=from.tx+(to.tx-from.tx)*e;view.ty=from.ty+(to.ty-from.ty)*e;apply()},done)}
function zoomAt(px,py,fac){const wx=(px-view.tx)/view.s,wy=(py-view.ty)/view.s;view.s=Math.max(minS,Math.min(maxS,view.s*fac));view.tx=px-wx*view.s;view.ty=py-wy*view.s;clampV();apply()}
const centerW=()=>({x:(SW/2-view.tx)/view.s,y:(SH/2-view.ty)/view.s});
const pts=new Map();let tap=null,pinch=null,rect=null;
const loc=e=>({x:e.clientX-rect.left,y:e.clientY-rect.top});
/* 幽靈手指（2026-11-12 修）：iPhone 有時不送手指抬起（pointerup／pointercancel），那根手指會一直留在 pts，
   之後一根手指滑動會被當成兩指縮放（畫面忽大忽小）、也點不到東西。三道保險：
   1. 新的一次觸碰是「第一根手指」（isPrimary）時，清掉舊的；2. lostpointercapture 也算抬起；
   3. 觸控事件 touchend／touchcancel 時，螢幕上已經沒有手指就全部清掉；切到背景也清掉。 */
const clearPts=()=>{if(GRAB){const S=SEC();if(S&&S.dragEnd)S.dragEnd(null);GRAB=null}pts.clear();pinch=null;tap=null};
/* 2026-11-24k 室內小關卡：按住物件可以拖（控制器 grab／dragMove／dragEnd，座標是 stage 裡的位置）；拖的時候不移動畫面 */
let GRAB=null;
stage.addEventListener('pointerdown',e=>{if(e.target.closest('.zpill,#panoBar'))return;rect=stage.getBoundingClientRect();try{stage.setPointerCapture(e.pointerId)}catch(_){}
 if(e.isPrimary&&pts.size)clearPts();
 pts.set(e.pointerId,loc(e));if(pts.size===1){const p=loc(e);tap={id:e.pointerId,x:p.x,y:p.y,t:performance.now(),moved:false};
  {const S=SEC();if(S&&S.grab&&st.running&&!PANO&&S.grab((p.x-view.tx)/view.s,(p.y-view.ty)/view.s,p.x,p.y)){GRAB={id:e.pointerId};tap=null}}}else{if(GRAB)return;tap=null;startPinch()}});
function startPinch(){const[a,b]=[...pts.values()];const m={x:(a.x+b.x)/2,y:(a.y+b.y)/2};pinch={d0:Math.hypot(a.x-b.x,a.y-b.y)||1,s0:view.s,wx:(m.x-view.tx)/view.s,wy:(m.y-view.ty)/view.s}}
stage.addEventListener('pointermove',e=>{const p=pts.get(e.pointerId);if(!p)return;const n=loc(e),dx=n.x-p.x,dy=n.y-p.y;p.x=n.x;p.y=n.y;
 if(GRAB){if(GRAB.id===e.pointerId){const S=SEC();if(S&&S.dragMove)S.dragMove(n.x,n.y)}return}
 if(pts.size===1){if(tap&&!tap.moved&&Math.hypot(n.x-tap.x,n.y-tap.y)>8)tap.moved=true;if(!tap||tap.moved){if(CAMLOCK())return;view.tx+=dx;view.ty+=dy;clampV();apply()}}
 else if(pts.size>=2&&pinch&&!CAMLOCK()){const[a,b]=[...pts.values()];const d=Math.hypot(a.x-b.x,a.y-b.y),m={x:(a.x+b.x)/2,y:(a.y+b.y)/2};
  view.s=Math.max(minS,Math.min(maxS,pinch.s0*d/pinch.d0));view.tx=m.x-pinch.wx*view.s;view.ty=m.y-pinch.wy*view.s;clampV();apply()}});
function endPtr(e){if(!pts.has(e.pointerId))return;const n_=pts.get(e.pointerId);pts.delete(e.pointerId);
 if(GRAB&&GRAB.id===e.pointerId){GRAB=null;const S=SEC();if(S&&S.dragEnd)S.dragEnd(e.type==='pointerup'?n_:null);if(pts.size<2)pinch=null;tap=null;return}
 if(e.type==='pointerup'&&tap&&tap.id===e.pointerId&&!tap.moved&&performance.now()-tap.t<700)onTap(tap.x,tap.y);
 if(pts.size<2)pinch=null;tap=null}
stage.addEventListener('pointerup',endPtr);stage.addEventListener('pointercancel',endPtr);stage.addEventListener('lostpointercapture',endPtr);
const touchGone=e=>{if(!e.touches||e.touches.length===0){if(pts.size)clearPts()}};
document.addEventListener('touchend',touchGone,{passive:true});document.addEventListener('touchcancel',touchGone,{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearPts()});window.addEventListener('blur',clearPts);
stage.addEventListener('wheel',e=>{e.preventDefault();if(CAMLOCK())return;rect=stage.getBoundingClientRect();const p=loc(e);zoomAt(p.x,p.y,Math.exp(-e.deltaY*.0015))},{passive:false});
$('#zin').onclick=()=>{const c=centerW();tweenTo(view.s*1.6,c.x,c.y,300)};
$('#zout').onclick=()=>{const c=centerW();tweenTo(view.s/1.6,c.x,c.y,300)};
$('#zfit').onclick=()=>{const c=LEVELS[level].c;tweenTo(base,c[0],c[1],500)};
const _oldFit=()=>{const c=centerW();tweenTo(view.s>minS*1.05?minS:base,view.s>minS*1.05?W/2:c.x,view.s>minS*1.05?H/2:c.y,400)};
window.addEventListener('resize',()=>{measure();clampV();apply()});

/* ================= sound ================= */
let actx=null,muted=false;try{muted=localStorage.getItem('townhunt-muted')==='1'}catch(_){}
function ac(){if(!actx){try{actx=new(window.AudioContext||window.webkitAudioContext)()}catch(_){}}if(actx&&actx.state==='suspended')actx.resume().catch(()=>{});return actx}
function tone(fr,dur,type='sine',vol=.18,when=0,slide){if(muted)return;const a=ac();if(!a)return;const t=a.currentTime+when,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(fr,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.03)}
const sfx={found(){tone(880,.12,'triangle',.2);tone(1320,.2,'triangle',.17,.08)},typeDone(){[660,880,1100,1320].forEach((q,i)=>tone(q,.16,'triangle',.15,i*.07))},miss(){tone(190,.16,'square',.05,0,110)},hint(){tone(520,.3,'sine',.15,0,820)},win(){[523,659,784,1047,784,1047,1319].forEach((q,i)=>tone(q,.24,'triangle',.17,i*.12))}};
const ICO={"bulb": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M9 18h6\"/><path d=\"M10 21h4\"/><path d=\"M12 3a6 6 0 0 0-4 10.5c.8.8 1.3 1.7 1.5 2.5h5c.2-.8.7-1.7 1.5-2.5A6 6 0 0 0 12 3z\"/></svg>", "menu": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 7h16\"/><path d=\"M4 12h16\"/><path d=\"M4 17h16\"/></svg>", "clock": "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M12 7.5V12l3 2\"/></svg>", "plus": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 5v14\"/><path d=\"M5 12h14\"/></svg>", "minus": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 12h14\"/></svg>", "home": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 11l8-7 8 7\"/><path d=\"M6 10v9h12v-9\"/></svg>", "x": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 6l12 12\"/><path d=\"M18 6L6 18\"/></svg>", "arrow": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 12h14\"/><path d=\"M13 6l6 6-6 6\"/></svg>", "map": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z\"/><path d=\"M9 4v14\"/><path d=\"M15 6v14\"/></svg>", "replay": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 12a8 8 0 1 0 2.5-5.8\"/><path d=\"M4 4v4h4\"/></svg>", "sound": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 9v6h4l5 4V5L8 9z\"/><path d=\"M16 9a4 4 0 0 1 0 6\"/><path d=\"M18.5 6.5a7.5 7.5 0 0 1 0 11\"/></svg>", "mute": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 9v6h4l5 4V5L8 9z\"/><path d=\"M17 9l5 6\"/><path d=\"M22 9l-5 6\"/></svg>", "down": "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 9l6 6 6-6\"/></svg>", "up": "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 15l6-6 6 6\"/></svg>", "hand": "<svg width=\"26\" height=\"26\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M8 13V5.5a1.5 1.5 0 0 1 3 0V11\"/><path d=\"M11 10.5V4a1.5 1.5 0 0 1 3 0v6.5\"/><path d=\"M14 10.5V5.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-.5a6 6 0 0 1-4.6-2.2L4 15.5a1.6 1.6 0 0 1 2.4-2.1L8 15\"/></svg>", "pinch": "<svg width=\"26\" height=\"26\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M7 7l-3-3\"/><path d=\"M4 8V4h4\"/><path d=\"M17 17l3 3\"/><path d=\"M20 16v4h-4\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>", "tap": "<svg width=\"26\" height=\"26\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"9\" r=\"3\"/><path d=\"M12 3v1.5\"/><path d=\"M6.5 5.5l1 1\"/><path d=\"M17.5 5.5l-1 1\"/><path d=\"M12 12v8\"/></svg>"};
const muteBtn=$('#muteBtn'),setMuteUI=()=>muteBtn.innerHTML=(muted?ICO.mute:ICO.sound)+`<span>音效：${muted?'關':'開'}</span>`;setMuteUI();
muteBtn.onclick=()=>{muted=!muted;setMuteUI();try{localStorage.setItem('townhunt-muted',muted?'1':'0')}catch(_){}if(!muted)tone(880,.1,'triangle',.15)};

/* ================= UI ================= */
const toastEl=$('#toast');let toastT;function toast(m,ms=1500){toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>toastEl.classList.remove('show'),ms)}
/* 2026-11-21 使用者：很多關卡的物件圖示上下左右被切到 → 圖示框自動配合每個物件的實際範圍（量一次記起來）。
   沒超出 ±19（留 2 給外框線）的照舊用 -21 -21 42 42；超出的以物件中心為準、框放大到剛好裝得下（圖示等於縮小一點），場景裡的物件大小不變。 */
const ICONVB={};
function iconVB(id){if(ICONVB[id])return ICONVB[id];let vb='-21 -21 42 42';
 try{const ns='http://www.w3.org/2000/svg',sv=document.createElementNS(ns,'svg');sv.setAttribute('width','200');sv.setAttribute('height','200');
  sv.style.cssText='position:fixed;left:-9999px;top:0;visibility:hidden;pointer-events:none';
  const g=document.createElementNS(ns,'g');g.setAttribute('stroke-width','2');g.innerHTML=ART[id]||'';sv.appendChild(g);document.body.appendChild(sv);
  const b=g.getBBox();sv.remove();
  if(b.width>0&&b.height>0){const P=2.6,x0=b.x-P,y0=b.y-P,x1=b.x+b.width+P,y1=b.y+b.height+P;
   if(x0<-21||y0<-21||x1>21||y1>21){const cx=(x0+x1)/2,cy=(y0+y1)/2,h=Math.max(21,(x1-x0)/2,(y1-y0)/2);
    const r=v=>Math.round(v*10)/10;vb=`${r(cx-h)} ${r(cy-h)} ${r(h*2)} ${r(h*2)}`}
   ICONVB[id]=vb}}catch(e){}
 return vb}
const icon=id=>`<svg viewBox="${iconVB(id)}"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${ART[id]}</g></svg>`;
const leftOf=id=>items.filter(it=>!it.found&&(!id||it.t.id===id)).length;
function renderTray(){{const R=ROOMC();if(R&&R.tray){R.tray($('#chips'));return}} /* 室內小關卡：下方換成點單圖卡 */
 $('#chips').innerHTML=TYPES.map(t=>`<button class="chip" data-t="${t.id}" aria-label="${t.name}"><span class="ic">${icon(t.id)}<span class="ok">✓</span></span><span class="dots">${'<i></i>'.repeat(PER())}</span></button>`).join('');
 $('#chips').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{const t=TYPES.find(x=>x.id===b.dataset.t),n=leftOf(t.id);trayTip(b,SEC()?(n?`${t.name}：找到 ${PER()-n} / ${PER()}`:`${t.name}：找齊了 ✓`):n?`${t.name}：還有 ${n} 個`:`${t.name}：全部找到了 ✓`)})}
/* 點下方列的物件：說明直接顯示在那個物件正上方，不跑到畫面最上面 */
let trayTipT;function trayTip(chip,msg){const tray=$('#tray');let el=document.getElementById('trayTip');if(!el){el=document.createElement('div');el.id='trayTip';tray.appendChild(el)}
 el.textContent=msg;const tr=tray.getBoundingClientRect(),cr=chip.getBoundingClientRect(),cx=cr.left+cr.width/2-tr.left;el.style.left='0px';el.classList.add('show');
 const w=el.offsetWidth,L=Math.max(w/2+8,Math.min(tr.width-w/2-8,cx));el.style.left=L+'px';el.style.setProperty('--ax',(cx-L+w/2)+'px');
 clearTimeout(trayTipT);trayTipT=setTimeout(()=>el.classList.remove('show'),1800)}
function updateCounts(bump){{const R=ROOMC();if(R&&R.counts){R.counts(bump);return}} /* 室內小關卡：表頭顯示第幾杯 */
 const tot=TYPES.length*PER(),got=tot-leftOf();$('#foundN').textContent=got;$('#foundTxt').textContent=`${got} / ${tot}`;$('#trayProg').textContent=`${got}/${tot}`;
 const C=2*Math.PI*18;$('#ringArc').setAttribute('stroke-dasharray',`${f(C*got/tot)} ${f(C)}`);
 TYPES.forEach(t=>{const n=leftOf(t.id),c=$(`.chip[data-t="${t.id}"]`);if(!c)return;if(n===0&&!c.classList.contains('done'))$('#chips').appendChild(c);c.classList.toggle('done',n===0);c.querySelectorAll('.dots i').forEach((d,k)=>d.classList.toggle('on',k<PER()-n))});
 if(bump){const c=$(`.chip[data-t="${bump}"]`);if(c){c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump');if(!c.classList.contains('done'))c.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'})}}}

/* ================= game ================= */
let prog={unlocked:1,found:[]};try{const pp=JSON.parse(localStorage.getItem('townhunt-prog')||'{}');if(pp.unlocked)prog.unlocked=pp.unlocked;if(Array.isArray(pp.found))prog.found=pp.found.filter(n=>typeof n==='number')}catch(_){}
const saveProg=()=>{try{localStorage.setItem('townhunt-prog',JSON.stringify(prog))}catch(_){}};
const unlockedW=()=>prog.unlocked>=2?W:1800;
const NEED_STARS=2;
/* 關卡清單：levels.js 用 addLevel({…}) 一關一行登記（LEVELS、冒險地圖名稱 MAPNODES、下一站預告 NEXTINFO） */
const LEVELS=[null],MAPNODES=[];
const SECRET_IDS=[],SECRETS={};
/* 2026-11-17 引擎 11-17b「找路發現新關卡」（使用者定案）：第 10 關之後的新關卡不再接在主線後面自動解鎖，
   而是在 addLevel 加 find:{after:10,from:1,hint:['路人：聽說⋯']}：
   - after：這一關拿到 NEED_STARS 顆星之後，這個新關卡就「可以被發現」（canFind）。
   - from：出口在哪一關（例：沙漠的駱駝商隊在第 1 關西南沙灘路口）。出口的圖、位置、對話寫在新關卡自己的檔案（H.EXITS[n]），
     出發地載入時，可以被發現或已經發現的新關卡檔案會一起載入（ensureFull）。
   - hint：和秘境提示放在同一個籤筒，每局在過關過的關卡挑一位頭上「…」的路人說一句（方位提示，不指定是哪一關說）。
   - 玩家點出口 → 問「要⋯出發嗎？」→ 出發才記進 prog.found，然後第一次播過場（next.ride）。
   - 發現之後才出現在冒險地圖（地圖小圖用 open(n) 判斷）、地圖卡片、收集冊；畫面上只寫名字，不寫第幾關（每個人發現的順序不同）。 */
const FIND_IDS=[],EXITS={};
function addLevel(L){const {map,next,...o}=L;LEVELS[o.n]={types:null,...o};if(map)MAPNODES.push({n:o.n,...map});if(next)NEXTINFO[o.n]=next;if(o.secret)SECRET_IDS.push(o.n);if(o.find)FIND_IDS.push(o.n)}
const isFound=n=>prog.found.includes(n);
/* 2026-11-21 每日新發現上限：非測試模式下，一天最多新發現 DAYMAX 個地方（第 11 關之後的 find 關卡＋秘境）。
   townhunt-day={d:'本地日期',n:[今天新發現的編號]}；秘境「去過了」記在 townhunt-been（各秘境也可以用 BEENF[n]() 告訴引擎，例如復活島 RP.went） */
const DAYMAX=2,BEENF={};
const dayKey=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
function dayLog(){try{const o=JSON.parse(localStorage.getItem('townhunt-day')||'null');if(o&&o.d===dayKey()&&Array.isArray(o.n))return o}catch(_){}return {d:dayKey(),n:[]}}
function beenList(){try{return JSON.parse(localStorage.getItem('townhunt-been')||'[]')}catch(_){return []}}
function isNewPlace(n){const L_=LEVELS[n];if(!L_)return false;if(L_.find)return !isFound(n);if(L_.secret)return !(beenList().includes(n)||(BEENF[n]&&BEENF[n]())||(L_.seen&&L_.seen()));return false}
function canDiscover(n){if(testMode||!isNewPlace(n))return true;const o=dayLog();return o.n.includes(n)||o.n.length<DAYMAX}
function noteDiscover(n){if(!isNewPlace(n))return;try{const o=dayLog();if(!o.n.includes(n))o.n.push(n);localStorage.setItem('townhunt-day',JSON.stringify(o));if(LEVELS[n].secret){const b=beenList();if(!b.includes(n)){b.push(n);localStorage.setItem('townhunt-been',JSON.stringify(b))}}}catch(_){}}
const DAYMSG='今天已經發現兩個新地方了，腳有點痠⋯<br>新的冒險明天再出發吧！走過的地方隨時都能回去玩。';
const findAfter=n=>(LEVELS[n]&&LEVELS[n].find&&LEVELS[n].find.after)||10;
const canFind=n=>{const L=LEVELS[n];if(!L||!L.find||isFound(n))return false;const a=findAfter(n);return (LEVELS[a]&&LEVELS[a].find?isFound(a):prog.unlocked>=a)&&starsOf(a)>=NEED_STARS}; /* after 可以是另一個 find 關卡（例如滑沙場：綠洲市集拿 2 星後） */
const isOpen=n=>{const L=LEVELS[n];if(!L||L.secret)return false;return L.find?isFound(n):n<=prog.unlocked};
/* 玩家能去的主線關卡：先照順序的第 1～unlocked 關，再接發現的順序 */
const openMain=()=>{const a=[];for(let n=1;n<=prog.unlocked;n++)if(LEVELS[n]&&!LEVELS[n].find)a.push(n);prog.found.forEach(n=>{if(LEVELS[n]&&!a.includes(n))a.push(n)});return a};
const linNext=n=>{const L=LEVELS[n+1];return L&&!L.find&&!L.secret?n+1:0};
const SEC=()=>LEVELS[level]&&LEVELS[level].secret&&scene===level&&SECRETS[level]?SECRETS[level]:null;
/* 2026-11-24 室內小關卡（沉船酒館 201 起，room.js）：levels.js 加 room:true，控制器跟秘境一樣登記在 SECRETS[n]。
   ROOMC() 不管 scene 是不是已經換好（renderTray／renderStart 在換場景前就會被叫到）。控制器可以給：tray(el)、counts()、startInfo()。 */
const ROOMC=()=>LEVELS[level]&&LEVELS[level].room&&SECRETS[level]?SECRETS[level]:null;
const CAMLOCK=()=>{const S=SEC();return !!(S&&!S.room&&!S.pano()&&!PANO)}; /* 室內小關卡：放大後可以拖 */
const PER=()=>(LEVELS[level]&&LEVELS[level].per)||4;
/* 過場只在第一次前往時播放；記錄已看過的過場（第一次更新時，先把原本已解鎖的關卡記成看過） */
let RODE=[];try{const v=localStorage.getItem('townhunt-rode');RODE=v?JSON.parse(v):[...Array(prog.unlocked)].map((_,i)=>i+1);if(!v)localStorage.setItem('townhunt-rode',JSON.stringify(RODE))}catch(_){}
/* 秘境的卡片（冒險地圖下方、收集冊）：要「確實去過」才出現——秘境檔自己給 LEVELS[n].seen()（例：復活島＝完成海圖任務並真的上島），
   沒給就看有沒有玩過的紀錄（best／stars）。2026-11-10 使用者要求，不再只看 RODE（RODE 在出發前就記了） */
const secretSeen=n=>{const L=LEVELS[n];if(!L)return false;if(L.seen)return !!L.seen();try{return !!(localStorage.getItem('townhunt-best-L'+n)||localStorage.getItem('townhunt-stars-L'+n))}catch(_){return false}};
const rodeHas=n=>n<=1||RODE.includes(n),rodeAdd=n=>{if(!RODE.includes(n)){RODE.push(n);try{localStorage.setItem('townhunt-rode',JSON.stringify(RODE))}catch(_){}}};
let level=1;
function setLevel(n){level=n;document.body.classList.toggle('secret',!!(LEVELS[n]&&LEVELS[n].secret));document.body.classList.toggle('room',!!(LEVELS[n]&&LEVELS[n].room));TYPES=typesFor(n);renderStart();renderTray()}
let howOrig=null,ruleOrig=null;
function renderStart(){const L=LEVELS[level];{const hd=document.querySelector('#startOv .shead');if(hd){hd.querySelector('b').textContent=`這一關要找的 ${TYPES.length} 樣東西`;hd.querySelector('span').textContent=`每樣 ${L.per||4} 個`}
  const how=document.querySelector('#startOv .how'),rule=document.querySelector('#startOv .rule');if(howOrig===null){howOrig=how.innerHTML;ruleOrig=rule.innerHTML}
  const SX=L.secret&&SECRETS[level];how.innerHTML=SX&&SX.how?SX.how:howOrig;rule.innerHTML=SX&&SX.rule?SX.rule:ruleOrig;$('#startBtn').textContent=SX?'開始探險':'開始尋找'}$('#startTitle').textContent=L.title;$('#startDesc').innerHTML=borrowed.length?`這次<b>${borrowed.map(t=>t.short).join('、')}</b>也跑來這裡了！`:'';
 $('#startGrid').innerHTML=TYPES.map(t=>`<div><span class="t">${icon(t.id)}</span>${t.short}</div>`).join('');
 {const R=ROOMC();if(R&&R.startInfo){const I=R.startInfo(),hd=document.querySelector('#startOv .shead');if(hd){hd.querySelector('b').textContent=I.b;hd.querySelector('span').textContent=I.span}$('#startGrid').innerHTML=I.grid}} /* 室內小關卡：開始畫面列這一局的材料 */
 let best=null;try{best=parseFloat(localStorage.getItem('townhunt-best-L'+level))}catch(_){}$('#startBest').textContent=best?`這一關最佳紀錄 ${Math.floor(best/60)}:${String(Math.floor(best%60)).padStart(2,'0')}`:''}
/* ---- exploration fog ---- */
const FC=150,FCOLS=Math.ceil(W/FC),FROWS=Math.ceil(H/FC);
let revealed=new Uint8Array(FCOLS*FROWS);
try{const sv=localStorage.getItem('townhunt-fog3');if(sv&&sv.length===revealed.length)revealed=Uint8Array.from(sv,c=>c==='1'?1:0)}catch(_){}
const saveFog=()=>{try{localStorage.setItem('townhunt-fog3',Array.from(revealed).join(''))}catch(_){}};
const cellIdx=(x,y)=>{const i=Math.floor(x/FC),j=Math.floor(y/FC);return(i<0||j<0||i>=FCOLS||j>=FROWS)?-1:j*FCOLS+i};
const isRevealed=()=>true;
function drawCells(){document.getElementById('fogCells').innerHTML='';return;const R=mulberry32(9);let g='';for(let j=0;j<FROWS;j++)for(let i=0;i<FCOLS;i++){const k=j*FCOLS+i,cx=i*FC+FC/2,cy=j*FC+FC/2;const c=[0,1,2,3].map(()=>`<circle cx="${f(cx+(R()-.5)*90)}" cy="${f(cy+(R()-.5)*90)}" r="${f(78+R()*42)}"/>`).join('');if(!revealed[k])g+=`<g class="fc" data-c="${k}">${c}</g>`}
 document.getElementById('fogCells').innerHTML=g}
function clearCell(k){if(revealed[k])return false;revealed[k]=1;const el=document.querySelector(`#fogCells [data-c="${k}"]`);if(el){el.classList.add('gone');setTimeout(()=>el.remove(),950)}return true}
let lastRev=0;
function reveal(force){return;const now=performance.now();if(!force&&now-lastRev<160)return;lastRev=now;
 const x0=-view.tx/view.s,y0=-view.ty/view.s,x1=(SW-view.tx)/view.s,y1=(SH-view.ty)/view.s,lim=unlockedW();let ch=false;
 for(let j=0;j<FROWS;j++)for(let i=0;i<FCOLS;i++){const cx=i*FC+FC/2,cy=j*FC+FC/2;if(cx>lim)continue;if(cx>x0+30&&cx<x1-30&&cy>y0+30&&cy<y1-30)ch=clearCell(j*FCOLS+i)||ch}
 if(ch)saveFog()}
function revealAround(x,y,rad=1){const i0=Math.floor(x/FC),j0=Math.floor(y/FC);let ch=false;for(let j=j0-rad;j<=j0+rad;j++)for(let i=i0-rad;i<=i0+rad;i++)if(i>=0&&j>=0&&i<FCOLS&&j<FROWS&&i*FC<unlockedW())ch=clearCell(j*FCOLS+i)||ch;if(ch)saveFog()}
const HINTS=3;let st={running:false,t0:0,hintsLeft:HINTS,misses:0},timer=null,hintLock=false,restartArm=false;
const fmt=s=>{s=Math.floor(s);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`};
const elapsed=()=>(performance.now()-st.t0)/1000;
function tick(){$('#time').textContent=fmt(elapsed())}
/* 過場期間先停住計時，過場結束才從 0:00 開始（reset=false 時接著原本的時間繼續） */
function clockHold(){clearInterval(timer);if(st.running)$('#time').textContent=fmt(elapsed())}
function clockRun(reset){if(!st.running)return;if(reset)st.t0=performance.now();clearInterval(timer);timer=setInterval(tick,250);tick()}
let testMode=false;try{testMode=localStorage.getItem('townhunt-test')==='1'}catch(_){}if(location.hash==='#test')testMode=true;
function setHintUI(){const b=$('#hintBtn');$('#hintN').textContent=testMode?'∞':st.hintsLeft;b.disabled=(!testMode&&st.hintsLeft<=0)||hintLock}
function applyTestUI(){document.querySelectorAll('.tbtn').forEach(b=>b.style.display=testMode?'':'none');$('#testBadge').style.display=testMode?'':'none';$('#winBtn').style.display=testMode?'':'none';{const pb=$('#panoBtn');if(pb)pb.style.display=testMode?'':'none';if(!testMode&&PANO)panoSet(false)}$('#resetBtn').style.display=testMode?'':'none';setHintUI()}
function newGame(keepView){if(PANO)panoSet(false);WINGO=0;const S=SEC();
 if(S){items=S.items();clovers={story:null,bonus:null};itemsL.innerHTML='';marks.innerHTML='';fx.innerHTML=''}else{placeItems();placeClover();renderItems()}
 reunionReset();story={step:0,done:false};storyBubble();renderTray();updateCounts();
 st={running:true,t0:performance.now(),hintsLeft:HINTS,misses:0,clover:false,bonus:false};setHintUI();
 measure();if(S)S.start();else if(!keepView){const c=LEVELS[level].c;view={s:base,tx:SW/2-c[0]*base,ty:SH/2-c[1]*base}}clampV();apply();reveal(true);clearInterval(timer);timer=setInterval(tick,250);tick();
 NGHOOKS.forEach(h=>{try{h(scene)}catch(e){console.error(e)}});drawExits();pickSecretHint()}
/* 秘境提示（2026-11-11 使用者要求）：玩家過關過的關卡裡，如果還有沒完成的秘境，每局隨機挑「一位」頭上是「…」的路人，
   點他會說一句那個秘境的提示（一局只有一位，免得太雜）。秘境在 levels.js 的 addLevel 加 hint:['…','…'] 就會自動加入。
   條件：這一關過關過（有 best）、秘境的出發地過關過、秘境還沒過關。挑人在 newGame 最後做，不影響物件和場景的亂數。 */
const DOTSIG='cx="-6" cy="-1" r="1.7"';let hintSp=null,hintMsg='';
function pickSecretHint(){hintSp=null;hintMsg='';if(SEC())return;if(!(bestOf(level)>0))return;
 const cand=SECRET_IDS.filter(n=>{const L=LEVELS[n];return L&&L.hint&&L.hint.length&&!(bestOf(n)>0)&&(!L.cond||L.cond())&& /* 2026-11-24m cond：秘境自己的額外條件（沉船酒館＝去過綠島或海底世界） */(L.needStars?starsOf(L.home)>=L.needStars:bestOf(L.home)>0)}) /* 2026-11-21 needStars：出發地要幾顆星才開始有路人提這個秘境（樹籬迷宮＝宮廷院 2 星） */
  .concat(FIND_IDS.filter(n=>canFind(n)&&LEVELS[n].find.hint&&LEVELS[n].find.hint.length));if(!cand.length)return; /* 新關卡（find）和秘境的提示放在同一個籤筒輪流 */
 const ppl=sprites.filter(s=>s.svg&&s.svg.includes(DOTSIG)&&s!==storySp.giver&&s!==storySp.helper);if(!ppl.length)return;
 const R=Math.random;hintSp=ppl[Math.floor(R()*ppl.length)];const L=LEVELS[cand[Math.floor(R()*cand.length)]],hs=L.find?L.find.hint:L.hint;hintMsg=hs[Math.floor(R()*hs.length)]}
function tapSecretHint(wx,wy){const sp=hintSp;if(!sp||!(Math.abs(wx-sp.x)<sp.w*.5&&wy<=sp.y+4&&wy>=sp.y-sp.h))return false;
 toast('💬 '+hintMsg,5200);try{tone(660,.08,'triangle',.05);setTimeout(()=>tone(880,.1,'triangle',.05),90)}catch(_){}
 const el=document.querySelector(`#bg [data-n="${sp.n}"]`);if(el&&!el.querySelector(':scope > .jig')){const w=document.createElementNS(NS,'g');w.setAttribute('class','jig');while(el.firstChild)w.appendChild(el.firstChild);el.appendChild(w);setTimeout(()=>{while(w.firstChild)el.insertBefore(w.firstChild,w);w.remove()},520)}
 return true}
/* ---- 新關卡的出口（find）：畫在物件下面一層；點了問要不要出發 ---- */
const exitOn=n=>{const L=LEVELS[n],E=EXITS[n];return !!(L&&L.find&&E&&L.find.from===scene&&!SEC()&&(canFind(n)||isFound(n)))};
function drawExits(){let lo=document.getElementById('exitL');if(!lo){lo=document.createElementNS(NS,'g');lo.id='exitL';['stroke','stroke-width','stroke-linejoin','stroke-linecap'].forEach(a=>lo.setAttribute(a,itemsL.getAttribute(a)));itemsL.parentNode.insertBefore(lo,itemsL)}
 let h='';for(const n of FIND_IDS){if(!exitOn(n))continue;const E=EXITS[n];try{h+=`<g class="exitG" data-exit="${n}" transform="translate(${E.x},${E.y})">${E.svg(isFound(n))}</g>`}catch(e){console.error(e)}}lo.innerHTML=h}
function tapExit(wx,wy){const pad=Math.max(0,10/view.s-8);for(const n of FIND_IDS){if(!exitOn(n))continue;const E=EXITS[n];
 if(Math.abs(wx-E.x)<E.w/2+pad&&wy<=E.y+10&&wy>=E.y-E.h){askExit(n);return true}}return false}
let exitPaused=0;
function askExit(n){const E=EXITS[n],A=E.ask||{},ov=$('#exitOv')||(()=>{const d=document.createElement('div');d.className='overlay hide';d.id='exitOv';document.body.appendChild(d);return d})();
 if(!exitPaused&&st.running){exitPaused=performance.now();clockHold()}
 const resume=()=>{if(exitPaused&&st.running){st.t0+=performance.now()-exitPaused;clockRun(false)}exitPaused=0};
 if(!canDiscover(n)){ov.innerHTML=`<div class="pcard" style="padding:20px 18px 18px;text-align:center">${A.pv?`<div style="margin:0 auto 6px;width:220px">${A.pv()}</div>`:''}<b style="font-size:21px;display:block;margin-bottom:6px">明天再出發吧</b><p style="margin:0 0 14px;font-size:15px;line-height:1.6">${DAYMSG}</p><button class="pbtn" id="exitWait">好</button></div>`;ov.classList.remove('hide');ov.querySelector('#exitWait').onclick=()=>{ov.classList.add('hide');resume()};return}
 ov.innerHTML=`<div class="pcard" style="padding:20px 18px 18px;text-align:center">${A.pv?`<div style="margin:0 auto 6px;width:220px">${A.pv()}</div>`:''}<b style="font-size:21px;display:block;margin-bottom:6px">${A.title||'要出發嗎？'}</b><p style="margin:0 0 14px;font-size:15px;line-height:1.6">${(isFound(n)&&A.again)||A.text||''}</p><button class="pbtn" id="exitGo">${A.go||'出發'}</button><div style="display:flex;margin-top:10px"><button class="sbtn" id="exitWait">${A.wait||'之後再說'}</button></div></div>`;
 ov.classList.remove('hide');
 ov.querySelector('#exitGo').onclick=()=>{ov.classList.add('hide');exitPaused=0;if(!isFound(n)){noteDiscover(n);prog.found.push(n);saveProg()}ensureFull(n,()=>goLevel(n,1))};
 ov.querySelector('#exitWait').onclick=()=>{ov.classList.add('hide');resume();if(A.waitMsg)toast(A.waitMsg,3600)}}
function onTap(sx,sy){if(!st.running||PANO)return;const wx=(sx-view.tx)/view.s,wy=(sy-view.ty)/view.s;{const S=SEC();if(S){S.tap(wx,wy);return}}if(!isRevealed(wx,wy))return;let best=null,bd=1e9,near=false;
 for(const c of [clovers.story,clovers.bonus])if(c&&c.revealed&&!c.found&&Math.hypot(c.x-wx,c.y-wy)<Math.max(14,13/view.s)){foundClover(c);return}
 for(const it of items){if(!isRevealed(it.x,it.y))continue;const d=Math.hypot(it.x-wx,it.y-wy),lim=Math.max(it.r*it.sc+3,13/view.s);if(d<lim){if(it.found)near=true;else if(d<bd){best=it;bd=d}}}
 if(best)found(best);else if(!near)miss(wx,wy)}
function svgEl(tag,a,p){const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function found(it){it.found=true;colAdd(it.t.id);it.el.classList.add('got');const rr=it.r*it.sc+8;
 if(it.occ){it.el.parentNode.appendChild(it.el)}
 const el=it.el;setTimeout(()=>{el.style.display='none'},600);
 burst(it.x,it.y);const n=leftOf(it.t.id);floatText(it.x,it.y-rr-4,n?`${it.t.short} 還有 ${n}`:`${it.t.short} 全部找到！`);updateCounts(it.t.id);
 if(n===0)sfx.typeDone();else sfx.found();if(leftOf()===0)win()}
function miss(wx,wy){if(tapSecretHint(wx,wy))return;if(tapExit(wx,wy))return;
 const onStory=[storySp.target,storySp.giver,storySp.helper].some(sp=>sp&&Math.abs(wx-sp.x)<Math.max(sp.w*.6,14)&&wy<=sp.y+6&&wy>=sp.y-sp.h-4); /* 2026-11-18 修：故事角色站在彩蛋範圍裡（例如滑沙場的斜坡）時，先算點到故事角色 */
 if(!onStory&&TAPHOOKS[scene]&&TAPHOOKS[scene](wx,wy))return; /* 場景裡的小互動（例如第 4 關圖騰眨眼），不算點錯 */
 st.misses++;sfx.miss();
 let hit=null;for(let i=sprites.length-1;i>=0;i--){const sp=sprites[i],sc=(sp.s||1);if(['bird','balloon'].includes(sp.kind))continue;if(Math.abs(wx-sp.x)<sp.w*.5&&wy<=sp.y+4&&wy>=sp.y-sp.h){hit=i;break}}
 /* 故事角色、走失的動物、藏幸運草的東西優先判定（就算前面有別人擋著） */
 for(const sp of [storySp.target,storySp.giver,storySp.helper,clovers.story&&!clovers.story.revealed&&story&&story.done?clovers.story.host:null,clovers.bonus&&!clovers.bonus.revealed?clovers.bonus.host:null]){if(sp&&Math.abs(wx-sp.x)<Math.max(sp.w*.6,14)&&wy<=sp.y+6&&wy>=sp.y-sp.h-4){hit=sprites.indexOf(sp);break}}
 if(hit!==null&&onSpriteTap(sprites[hit]))st.misses--;
 if(hit!==null){const el=document.querySelector(`#bg [data-n="${sprites[hit].n}"]`);if(el&&!el.querySelector(':scope > .jig')){const w=document.createElementNS(NS,'g');w.setAttribute('class','jig');while(el.firstChild)w.appendChild(el.firstChild);el.appendChild(w);setTimeout(()=>{while(w.firstChild)el.insertBefore(w.firstChild,w);w.remove()},520)}return}
 const g=svgEl('g',{transform:`translate(${f(wx)},${f(wy)}) scale(${f(1/view.s)})`},fx);const c=svgEl('circle',{r:4,fill:'none',stroke:'#7a6e60','stroke-width':2},g);anim(400,k=>{c.setAttribute('r',4+12*k);g.setAttribute('opacity',1-k)},()=>g.remove())}
function burst(x,y){const g=svgEl('g',{},fx),ps=[];for(let i=0;i<12;i++)ps.push({c:svgEl('circle',{r:3,fill:['#f5c842','#c4572f','#4f8a3a','#6fa8a0'][i%4]},g),a:i/12*Math.PI*2+Math.random()*.4,d:26+Math.random()*16});
 const ring=svgEl('circle',{cx:x,cy:y,fill:'none',stroke:'#f5c842','stroke-width':4},g);
 anim(650,k=>{const e=1-Math.pow(1-k,3);ps.forEach(p=>{p.c.setAttribute('cx',x+Math.cos(p.a)*p.d*e);p.c.setAttribute('cy',y+Math.sin(p.a)*p.d*e);p.c.setAttribute('opacity',1-k)});ring.setAttribute('r',10+32*e);ring.setAttribute('opacity',1-k)},()=>g.remove())}
function floatText(x,y,txt){const fs=Math.min(36,15/view.s);const t=svgEl('text',{x,y,'text-anchor':'middle','font-size':fs,'font-weight':800,fill:OL,stroke:'#fff','stroke-width':fs*.28,'paint-order':'stroke','font-family':'PingFang TC, Noto Sans TC, sans-serif'},fx);t.textContent=txt;
 anim(1200,k=>{t.setAttribute('y',y-k*fs*1.4);t.setAttribute('opacity',k<.6?1:1-(k-.6)/.4)},()=>t.remove())}
$('#hintBtn').onclick=()=>{if(!st.running||hintLock||(!testMode&&st.hintsLeft<=0))return;const rest=items.filter(it=>!it.found);if(!rest.length&&!(SEC()&&SEC().goalOn&&SEC().goalOn()))return; /* 2026-11-21 秘境找齊後還要走到終點（C.goal）時，提示箭頭指向終點 */
 {const S=SEC();if(S){if(!S.hint())return;st.hintsUsed=(st.hintsUsed||0)+1;if(!testMode)st.hintsLeft--;hintLock=true;setHintUI();sfx.hint();
  toast(S.hintMsg?S.hintMsg(testMode?-1:st.hintsLeft):testMode?'提示：跟著頭上的箭頭走':st.hintsLeft?`提示：跟著頭上的箭頭走（剩 ${st.hintsLeft} 次）`:'提示：跟著頭上的箭頭走（提示用完了）',2600); /* 室內小關卡自己給提示的話 hintMsg */setTimeout(()=>{hintLock=false;setHintUI()},testMode?900:2600);return}}
 const it=rest[Math.floor(Math.random()*rest.length)];revealAround(it.x,it.y,1);st.hintsUsed=(st.hintsUsed||0)+1;if(!testMode)st.hintsLeft--;hintLock=true;setHintUI();sfx.hint();
 toast(testMode?`提示：「${it.t.name}」就在這個畫面裡`:st.hintsLeft?`提示：「${it.t.name}」就在這個畫面裡（剩 ${st.hintsLeft} 次）`:`提示：「${it.t.name}」就在這個畫面裡（提示用完了）`,2600);
 const P=pads(),av=SH-P.t-P.b,s2=Math.max(view.s,base*1.3),sx=SW*(1/6+Math.random()*2/3),sy=P.t+av*(1/6+Math.random()*2/3);
 tweenTo(s2,it.x+(SW/2-sx)/s2,it.y+(SH/2-sy)/s2,650);
 setTimeout(()=>{hintLock=false;setHintUI()},testMode?900:2600)};
function curtain(fn,msg){const c=$('#curtain');c.querySelector('span').textContent=msg||'把東西重新藏好⋯';c.classList.add('on');setTimeout(()=>{fn();setTimeout(()=>c.classList.remove('on'),380)},520)}
$('#restartBtn').onclick=()=>{const sp=$('#restartBtn span');if(st.running&&!restartArm){restartArm=true;sp.textContent='確定重新開始？';setTimeout(()=>{restartArm=false;sp.textContent='重新開始'},2500);return}
 restartArm=false;sp.textContent='重新開始';closeMenu();$('#winOv').classList.add('hide');curtain(()=>{setLevel(level);newGame();setTimeout(()=>toast('新的一局，東西都換位置了！'),400)})};
/* 過關時間目標：各關檔案自己設 TARGET[關卡]（目前沒有用到，保留） */
const TARGET={};
const starSvg=(on,sz,col)=>`<svg width="${sz}" height="${sz}" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4l6 12.6 13.8 1.8-10.1 9.6 2.6 13.7L24 35.2l-12.3 6.5 2.6-13.7L4.2 18.4 18 16.6z" fill="${on?(col||'#f5c842'):'#efe6d2'}" stroke="#2b2420" stroke-width="3" stroke-linejoin="round"/></svg>`;
/* 還沒有下一站、或秘境出發地沒有預覽圖時用的霧景 */
const mistPreview=()=>`<svg width="120" height="84" viewBox="0 0 120 84" aria-hidden="true"><rect width="120" height="84" fill="#f1e2bf"/><path d="M0,60 L22,34 L38,50 L58,22 L80,46 L98,30 L120,52 V84 H0Z" fill="#b3b8b2" stroke="#2b2420" stroke-width="1.5"/><path d="M52,30 L58,22 L64,30 L61,28 L58,32 L55,28Z" fill="#fbf7ef"/><path d="M0,66 Q30,58 60,66 T120,62 V84 H0Z" fill="#c6cb8c"/><path d="M14,80 Q40,70 62,72 Q84,74 100,62" fill="none" stroke="#a8461f" stroke-width="2.2" stroke-dasharray="4 4" stroke-linecap="round"/><path d="M100,62 l3,-2" stroke="#a8461f" stroke-width="2.2" opacity=".4" stroke-linecap="round"/></svg>`;
/* 2026-11-18e 使用者：第 10 關之後玩家要自己問路找新關卡 → 晉升「進階搜查家」。使用者選 C 勳章緞帶：
   紅底放射光、金色圓章（裡面是放大鏡）＋月桂葉＋藍紅緞帶。過關畫面「到處問問看」的圖都用這張；第一次晉升時跳慶祝畫面（#advOv）。 */
function advBadge(w=120,h=84,anim){const OL='#2b2420',st=(cx,cy,R,r,fill,sw)=>{let d='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r:R;d+=(i?'L':'M')+f(cx+q*Math.cos(a))+','+f(cy+q*Math.sin(a))}return `<path d="${d}Z" fill="${fill}" stroke="${OL}" stroke-width="${sw}" stroke-linejoin="round"/>`};
 const rays=[...Array(12)].map((_,i)=>{const a=i*Math.PI/6;return `<path d="M60,34 L${f(60+95*Math.cos(a-.12))},${f(34+95*Math.sin(a-.12))} L${f(60+95*Math.cos(a+.12))},${f(34+95*Math.sin(a+.12))}Z" fill="#8c3a33"/>`}).join('');
 const leaf=(a,sg)=>{const x=f(60+sg*30*Math.cos(a)),y=f(36+30*Math.sin(a)),r=sg>0?a*180/Math.PI+90:-a*180/Math.PI-90;return `<ellipse cx="${x}" cy="${y}" rx="6" ry="3" transform="rotate(${r.toFixed(0)} ${x} ${y})" fill="#7fae4e" stroke="${OL}" stroke-width="1"/>`};
 const leaves=[...Array(5)].map((_,i)=>{const a=Math.PI*(.62+i*.13);return leaf(a,1)+leaf(a,-1)}).join('');
 const mag=`<g transform="translate(57,32) rotate(-40)"><rect x="-4" y="8" width="8" height="13.5" rx="3" fill="#7a4a2a" stroke="${OL}" stroke-width="1.6"/><rect x="-5" y="6" width="10" height="6" rx="2" fill="#d9a93a" stroke="${OL}" stroke-width="1.4"/><circle r="9" fill="#cfe6ee" stroke="${OL}" stroke-width="1.8"/><circle r="6" fill="none" stroke="#e8b84a" stroke-width="3"/><circle r="9" fill="none" stroke="${OL}" stroke-width="1.6"/><path d="M-4,-3.2 q2.2,-2.7 5.4,-2.2" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".9"/></g>`;
 const A=anim?{r:' class="advR"',m:' class="advM"',s:' class="advS"'}:{r:'',m:'',s:''};
 return `<svg width="${w}" height="${h}" viewBox="0 0 120 84" aria-hidden="true">${anim?'<style>.advR{animation:advR 24s linear infinite;transform-origin:60px 34px}@keyframes advR{to{transform:rotate(360deg)}}.advM{animation:advM .9s cubic-bezier(.3,1.6,.5,1) both;transform-origin:60px 40px}@keyframes advM{from{transform:scale(.2) rotate(-25deg);opacity:0}to{transform:none;opacity:1}}.advS{animation:advS 1.6s ease-in-out infinite alternate}@keyframes advS{from{opacity:.25}to{opacity:1}}</style>':''}<rect width="120" height="84" fill="#7a2f2a"/><g${A.r}>${rays}</g>
 <g${A.m}><path d="M46,44 L36,80 L46,74 L52,82 L58,50Z" fill="#3d5d86" stroke="${OL}" stroke-width="1.6" stroke-linejoin="round"/><path d="M74,44 L84,80 L74,74 L68,82 L62,50Z" fill="#c4473a" stroke="${OL}" stroke-width="1.6" stroke-linejoin="round"/>${leaves}
 <circle cx="60" cy="36" r="24" fill="#e8b84a" stroke="${OL}" stroke-width="2"/><circle cx="60" cy="36" r="19" fill="#f6d77a" stroke="#b07f1e" stroke-width="1.4"/>${mag}${st(60,9,5,2.2,'#fff3c4',1.2)}</g>
 ${anim?`<g${A.s} fill="#fff3c4">${st(18,16,4,1.6,'#fff3c4',0)}${st(104,22,3.4,1.4,'#fff3c4',0)}${st(98,66,3,1.2,'#fff3c4',0)}${st(20,64,3,1.2,'#fff3c4',0)}</g>`:''}</svg>`}
const ADVK='townhunt-adv';RESETKEYS.push(ADVK);
const advSeen=()=>{try{return localStorage.getItem(ADVK)==='1'}catch(_){return true}};
/* 晉升慶祝：關掉後才顯示一般的過關畫面 */
function advCeremony(then){try{localStorage.setItem(ADVK,'1')}catch(_){}const ov=$('#advOv')||(()=>{const d=document.createElement('div');d.className='overlay hide';d.id='advOv';document.body.appendChild(d);return d})();
 ov.innerHTML=`<div class="pcard" style="padding:22px 18px 18px;text-align:center"><small style="display:block;color:var(--muted);font-size:13px;letter-spacing:.2em">晉升</small><b style="font-size:25px;display:block;margin:2px 0 10px">🎖️ 進階搜查家</b>
 <div style="margin:0 auto 12px;width:240px;height:168px;border:3px solid var(--ink);border-radius:14px;overflow:hidden">${advBadge(240,168,1)}</div>
 <p style="margin:0 0 8px;font-size:15px;line-height:1.65">恭喜你走完了前面的旅程，正式成為<b style="display:inline;white-space:nowrap">進階搜查家！</b></p>
 <p style="margin:0 0 14px;font-size:15px;line-height:1.65;text-align:left">從現在開始，新的地方不會自己出現在「下一站」了⋯要靠你自己去探索：回到走過的地方，找找頭上有「…」的人問問看，他們會告訴你新地方在哪個方向。找到了，就能跟著出發！</p>
 <button class="pbtn" id="advGo">🔍 接下任務</button></div>`;
 ov.classList.remove('hide');[523,659,784,1047,1319,1568].forEach((q,i)=>tone(q,.22,'triangle',.12,.5+i*.1));
 ov.querySelector('#advGo').onclick=()=>{ov.classList.add('hide');then&&then()}}
function win(){if(PANO)panoSet(false);st.running=false;clearInterval(timer);const total=elapsed();$('#time').textContent=fmt(total);
 const BK='townhunt-best-L'+level;let best=null;try{best=parseFloat(localStorage.getItem(BK))}catch(_){}
 const isBest=!best||total<best;if(isBest){best=total;try{localStorage.setItem(BK,String(total))}catch(_){}}
 const crit=[['全部找到',true],['提示 1 次內',(st.hintsUsed||0)<=1],['故事幸運草',!!st.clover]],ns=crit.filter(c=>c[1]).length;
 if(st.bonus)crit.push(['隱藏幸運草',true]);
 try{const SK='townhunt-stars-L'+level,old=+localStorage.getItem(SK)||0;if(ns>old)localStorage.setItem(SK,String(ns))}catch(_){}
 $('#winTitle').textContent=LEVELS[level].secret||LEVELS[level].find?`${(MAPNODES.find(m=>m.n===level)||{}).name||'秘境'}完成！`:`第 ${level} 關完成！`;
 $('#winStars').classList.toggle('four',crit.length>3);$('#winStars').innerHTML=crit.map(([c,ok],k)=>`<div class="${k===1?'mid':''}" style="animation-delay:${.9+k*.28}s">${starSvg(ok,k===1?58:46,k===3?'#7fc45a':0)}<span style="color:${ok?'var(--ink)':'var(--muted)'}">${c}</span></div>`).join('');
 $('#rTime').textContent=fmt(total);$('#rHint').textContent=st.hintsUsed||0;
 $('#winTag').textContent=isBest?'這一關的新紀錄':`最佳紀錄 ${fmt(best)}`;
 const nx=$('#winNext'),nb=$('#nextBtn');
 if(LEVELS[level].secret){const hm=LEVELS[level].home,I=NEXTINFO[hm];nx.innerHTML=`<div class="pv">${I&&I.pv?I.pv():mistPreview()}</div><div><small>回到出發地</small><b>${MAPNODES.find(m=>m.n===hm).name}</b><small>${(SECRETS[level]&&SECRETS[level].homeNote)||'隨時可以再回來'}</small></div>`;
  nb.innerHTML=((SECRETS[level]&&SECRETS[level].homeBtn)||'回到出發地')+ICO.arrow;nb.dataset.act='home';$('#winMap').style.display='';$('#againBtn').style.display='';setTimeout(()=>{sfx.win();$('#winOv').classList.remove('hide')},900);return}
 const nl=level+1,hasNext=!!linNext(level),had=prog.unlocked>=nl,gotS=starsOf(level);
 if(hasNext&&!had&&gotS>=NEED_STARS){prog.unlocked=nl;saveProg()}
 if(hasNext&&prog.unlocked>=nl){const I=NEXTINFO[nl];nx.innerHTML=`<div class="pv">${I.pv()}</div><div><small>下一站</small><b>${MAPNODES.find(m=>m.n===nl).name}</b><small>${had?I.had:I.fresh}</small></div>`;nb.innerHTML=I.btn+ICO.arrow;nb.dataset.act='ride';if(LEVELS[nl].file)ensureFull(nl,()=>{})}
 else if(hasNext){nx.innerHTML=`<div class="pv">${mistPreview()}</div><div><small>下一站</small><b>還差一點點</b><small>這一關拿到 ${NEED_STARS} 顆星以上，新的路才會出現（這次 ${ns} 顆）</small></div>`;nb.innerHTML='再挑戰一次'+ICO.arrow;nb.dataset.act='again'}
 else{/* 沒有照順序的下一關：看看有沒有「可以被發現」的新關卡（find） */
  const pend=FIND_IDS.filter(canFind);pend.forEach(m=>{const fr=LEVELS[m].find.from;if(fr)ensureFull(fr,()=>{})});
  const almost=FIND_IDS.some(m=>!isFound(m)&&!canFind(m)&&findAfter(m)===level&&isOpen(level));
  if(pend.length){nx.innerHTML=`<div class="pv">${advBadge()}</div><div><small>進階搜查家的任務</small><b>到處問問看</b><small>聽說有些地方來了新的旅人⋯回到走過的地方，問問頭上有「…」的人吧</small></div>`;nb.innerHTML=ICO.map+'打開冒險地圖';nb.dataset.act='map'}
  else if(almost){nx.innerHTML=`<div class="pv">${mistPreview()}</div><div><small>下一站</small><b>還差一點點</b><small>這一關拿到 ${NEED_STARS} 顆星以上，才會聽到新地方的消息（這次 ${ns} 顆）</small></div>`;nb.innerHTML='再挑戰一次'+ICO.arrow;nb.dataset.act='again'}
  else{nx.innerHTML=`<div class="pv">${mistPreview()}</div><div><small>下一站</small><b>前面的路還沒畫好⋯</b><small>新的地方正在製作中，敬請期待</small></div>`;nb.innerHTML=ICO.map+'打開冒險地圖';nb.dataset.act='map'}}
 $('#winMap').style.display=nb.dataset.act==='map'?'none':'';$('#againBtn').style.display=nb.dataset.act==='again'?'none':'';
 /* 剛過關的「下一站」：從冒險地圖點它也要播過場（2026-11-18e 使用者） */WINGO=hasNext&&prog.unlocked>=nl?nl:0;
 /* 第一次可以自己找新關卡（第 10 關之後）：先跳「晉升進階搜查家」慶祝，再顯示過關畫面 */
 const adv=!LEVELS[level].secret&&!hasNext&&FIND_IDS.some(canFind)&&!advSeen();
 setTimeout(()=>{sfx.win();if(adv)advCeremony(()=>$('#winOv').classList.remove('hide'));else $('#winOv').classList.remove('hide')},900)}
$('#againBtn').onclick=()=>{$('#winOv').classList.add('hide');curtain(()=>{setLevel(level);newGame()})};
$('#startBtn').onclick=()=>{ac();curtain(()=>{loadScene(level);$('#startOv').classList.add('hide');newGame()},'把東西藏好⋯')};
let tCount=0,tTimer;
$('#gameTitle').onclick=()=>{tCount++;clearTimeout(tTimer);tTimer=setTimeout(()=>tCount=0,2500);if(tCount>=5){tCount=0;testMode=!testMode;try{localStorage.setItem('townhunt-test',testMode?'1':'0')}catch(_){}applyTestUI();toast(testMode?'🧪 測試模式：開啟':'測試模式：關閉')}};
/* 測試用直接過關：只算星星，不寫進收集冊（收集冊只記真的找到的東西） */
$('#winBtn').onclick=()=>{if(!st.running)return;items.forEach(it=>{it.found=true});st.clover=true;st.bonus=true;if(story)story.done=true;updateCounts();win()};
$('#resetBtn').onclick=()=>{prog={unlocked:1,found:[]};saveProg();try{LEVELS.forEach((L_,n)=>{if(!L_)return;localStorage.removeItem('townhunt-best-L'+n);localStorage.removeItem('townhunt-stars-L'+n)});RESETKEYS.forEach(k=>localStorage.removeItem(k));localStorage.removeItem('townhunt-col');/* 2026-11-20：秘境、找路關卡的記錄（例如復活島海圖 townhunt-rapa）在那一關的檔案還沒載入時不在 RESETKEYS 裡 → 一律清掉 townhunt- 開頭的記錄（音效開關、測試模式開關保留），再重新整理，記憶體裡的舊狀態也一起清掉 */Object.keys(localStorage).filter(k=>k.startsWith('townhunt-')&&k!=='townhunt-muted'&&k!=='townhunt-test').forEach(k=>localStorage.removeItem(k))}catch(_){}COL={i:{},c:{},s:{},b:{}};st.running=false;clearInterval(timer);setLevel(1);toast('進度已重置：只開放第 1 關，收集冊也清空了',2600);setTimeout(()=>location.reload(),1800);return;
 items=[];itemsL.innerHTML='';const lw=document.getElementById('lockWall');lw.classList.remove('gone2');buildFog();setLevel(1);measure();const c=LEVELS[1].c;view={s:base,tx:SW/2-c[0]*base,ty:SH/2-c[1]*base};clampV();apply();toast('進度已重置，只開放第 1 關')};
const closeMenu=()=>$('#menu').classList.add('hide');
$('#menuBtn').onclick=e=>{e.stopPropagation();$('#menu').classList.toggle('hide')};
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#menu')&&!e.target.closest('#menuBtn'))closeMenu()},true);
$('#mapBtn').onclick=()=>{closeMenu();openMap()};
$('#startMap').onclick=()=>{ac();openMap()};
$('#winMap').onclick=()=>{$('#winOv').classList.add('hide');openMap()};
$('#mapClose').onclick=()=>{$('#mapOv').classList.add('hide');mapUnder.forEach(id=>$('#'+id).classList.remove('hide'));mapUnder=[]};
$('#trayToggle').onclick=()=>{const t=$('#tray'),c=t.classList.toggle('collapsed');$('#trayToggle').innerHTML=(c?'展開'+ICO.up:'收合'+ICO.down);$('#trayToggle').setAttribute('aria-label',c?'展開清單':'收合清單');clampV();apply()};
$('#nextBtn').onclick=()=>{WINGO=0;$('#winOv').classList.add('hide');const a=$('#nextBtn').dataset.act;if(a==='map'){openMap();return}
 if(a==='home'){goLevel(LEVELS[level].home);return}
 if(a==='again'){curtain(()=>{setLevel(level);newGame()});return}
 const n=level+1;if(!linNext(level)||prog.unlocked<n)return;
 rodeAdd(n);ensureFull(n,()=>ride(()=>{loadScene(n);setLevel(n);newGame();clockHold();$('#time').textContent='0:00'},()=>{clockRun(true);toast(`${LEVELS[n].title}，開始！`,2200)},NEXTINFO[n]&&NEXTINFO[n].ride))};

let FOGV=1;/* 雲：0 舊版、1 變薄（使用者選 B）、2 中間 */
const FOGFN={};/* 2026-11-18：場地外不想用雲的關卡（例如地底洞窟）自己設 FOGFN[關卡]=({X0,X1,Y1,R})=>SVG */
function buildFog(sc){const SC=SCENES[sc],X0=SC.x0,X1=SC.x1,Y1=SC.y1||H;
 if(FOGFN[sc]){let g='';try{g=FOGFN[sc]({X0,X1,Y1,R:mulberry32(5+sc)})}catch(e){console.error(e)}document.getElementById('fogG').innerHTML=g;document.getElementById('lockWall').innerHTML='';return}
 const LT=(window.FOGV??FOGV)===1;
 const puff=(x,y,k,d)=>`<g class="drift" style="--d:${d}s;animation-delay:-${f(Math.random()*d)}s"><g transform="translate(${f(x)},${f(y)}) scale(${f(k)})" fill="#fbf7ef" opacity="${LT?.82:.92}"><circle cx="-60" cy="0" r="40"/><circle cx="-10" cy="-26" r="54"/><circle cx="50" cy="-8" r="44"/><circle cx="96" cy="8" r="30"/><rect x="-100" y="0" width="226" height="38" rx="19"/></g></g>`;
 const FV=[[[0,1],[.38,.93],[1,0]],[[0,.92],[.36,.5],[.6,.12],[.7,0]],[[0,1],[.36,.78],[.55,.35],[.72,0]]][window.FOGV??FOGV],
  gd=(n,x1,x2,y1,y2)=>`<linearGradient id="${n}" x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}">${FV.map(([o,a])=>`<stop offset="${o}" stop-color="#f4ede0" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
 let g=`<defs>${gd('fL',0,1,0,0)+gd('fR',1,0,0,0)+gd('fT',0,0,0,1)+gd('fB',0,0,1,0)}</defs><path d="M-6000,-4000 H8800 V5800 H-6000Z M${X0-295},-295 V${Y1+295} H${X1+295} V-295Z" fill="#f4ede0" fill-rule="evenodd"/><rect x="${X0-300}" y="-300" width="440" height="${Y1+600}" fill="url(#fL)"/><rect x="${X1-140}" y="-300" width="440" height="${Y1+600}" fill="url(#fR)"/><rect x="${X0-300}" y="-300" width="${X1-X0+600}" height="440" fill="url(#fT)"/><rect x="${X0-300}" y="${Y1-140}" width="${X1-X0+600}" height="440" fill="url(#fB)"/>`;
 const R=mulberry32(5+sc),rr=(a,b)=>a+R()*(b-a);
 for(let x=X0-200;x<X1+200;x+=rr(160,240))g+=puff(x,LT?rr(-190,-80):rr(-120,40),rr(.9,1.4),rr(18,30));
 for(let x=X0-200;x<X1+200;x+=rr(170,260))g+=puff(x,LT?rr(Y1+90,Y1+170):rr(Y1,Y1+100),rr(.9,1.4),rr(18,30));
 for(let y=100;y<Y1-100;y+=rr(170,250))g+=puff(X0+(LT?rr(-230,-130):rr(-180,-40)),y,rr(.9,1.3),rr(18,30))+puff(X1+(LT?rr(130,230):rr(40,180)),y,rr(.9,1.3),rr(18,30));
 [[X0-80,-60],[X1+80,-60],[X0-80,Y1+80],[X1+80,Y1+80]].forEach(([x,y])=>g+=puff(x,y,1.8,26));
 document.getElementById('fogG').innerHTML=g;document.getElementById('lockWall').innerHTML='';
}
/* ================= scenes, world map, hay-cart ride ================= */
/* 每一關的場景範圍 SCENES[關卡]={x0,x1,y1?,c} 和 scatter 區域清單 SCREG[關卡]：各關檔案自己設 */
const SCENES={};
const SCREG={};
let scene=0;
/* 每關只畫自己用到的範圍，避免手機繪圖記憶體不夠而破圖、閃爍 */
function sizeCanvas(n){const SC=SCENES[n],m=SC.y1?220:300,x=SC.x0-m,y=-m,w=SC.x1-SC.x0+2*m,h=(SC.y1||H)+2*m;
 ['bgSvg','fgSvg','fogSvg'].forEach(id=>{const e=document.getElementById(id);e.setAttribute('viewBox',`${x} ${y} ${w} ${h}`);Object.assign(e.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'})})}
/* 音符（art.js noteM，class nt）如果被上層的左右翻轉鏡像了，就在原地再翻一次，讓符桿永遠在右邊（2026-11-18g 使用者：對話框的音符畫反了） */
function fixNotes(root){if(!root)return;root.querySelectorAll('.nt').forEach(g=>{const P=g.parentNode,m=P&&P.getCTM&&P.getCTM();if(!m)return;const [x,y]=(g.dataset.p||'0,0').split(',').map(Number);
 g.setAttribute('transform',m.a*m.d-m.b*m.c<0?`translate(${x+9},${y}) scale(-1,1)`:`translate(${x},${y})`)})}
function loadScene(n){if(scene===n)return;scene=n;SCN=n;NGHOOKS.forEach(h=>{try{h(0)}catch(e){console.error(e)}}); /* 換場景時先清掉上一個場景的動態圖層 */ROADS.length=0;sizeCanvas(n);sprites.length=0;occ.fill(0);
 for(let j=0;j<GR;j++)for(let i=0;i<GC;i++)wat[j*GC+i]=isWater(i*CELL+CELL/2,j*CELL+CELL/2)?1:0;rng=mulberry32(77+n*101);
 items=[];itemsL.innerHTML='';
 $('#bg').innerHTML=buildScene(n);
 fixNotes($('#bg'));
 spEls=[...document.querySelectorAll('#bg .sp')].map(el=>({el,x:+el.dataset.x,y:+el.dataset.y,on:false}));
 buildFog(n)}
/* 後面關卡的主題物件，每局隨機借幾種放進前面已玩過的關卡 */
/* 後面關卡的主題物件，每局隨機借幾種放進前面已玩過的關卡：BORROW[後面的關卡]，各關檔案自己設 */
const BORROW={};
let borrowed=[];
function typesFor(n){const own=LEVELS[n].types||[],all=LEVELS.slice(1).flatMap(L=>L.types||[]);borrowed=[];
 const cands=[];for(let m=n+1;m<=prog.unlocked;m++)(BORROW[m]||[]).forEach(([id,map])=>{if(map[n])cands.push({...all.find(t=>t.id===id),regions:map[n]})});
 if(!cands.length)return own;
 borrowed=shuffle(cands).slice(0,Math.min(cands.length,prog.unlocked-n>=2?3:2));
 const slots=shuffle(own.map((t,i)=>i).filter(i=>own[i].id!=='fish')).slice(0,borrowed.length),out=own.slice();
 slots.forEach((i,k)=>out[i]=borrowed[k]);return out}
function bestOf(n){let b=null;try{b=parseFloat(localStorage.getItem('townhunt-best-L'+n))}catch(_){}return b}
function starsOf(n){try{return +localStorage.getItem('townhunt-stars-L'+n)||0}catch(_){return 0}}
const MAPSW='#cfc98a'; /* 冒險地圖西南角（之後做沙漠）的底色 */
/* 冒險地圖：北方雪國（2026-11-17，使用者看 A～C 選 A「往西北斜上」；U>=11 才畫）。
   預留位置：第 11 關雪橇犬驛站 (196,-14)、第 12 關冰湖雪祭 (96,-66)（冰湖 NLAKE）、第 13 關極光山頂 (10,-128)（最高的山 NPEAK）。各關的節點、路線畫在自己的 mapHook。 */
const NSPOT=[[196,-14],[96,-66],[10,-128]],NLAKE=[110,-58,46,20],NPEAK=[10,-128,40,62];
let NWO=0,NEO=0; /* 2026-11-24k 使用者：地圖往東加寬（綠島）之後，右上角也要是雪地 */
function northMap(P,ink){const R=mulberry32(5151);let g='';
 g+=`<path d="M${-120-NWO},-170 H${342+NEO} V${NEO?100:104} Q${NEO?380:300},94 ${NEO?340:260},100 Q300,94 260,100 Q200,90 140,100 Q80,90 20,100 Q-40,92 ${-120-NWO},100Z" fill="#eaf0ee"/>`;
 g+=`<path d="M-120,-138 Q-40,-158 40,-138 T200,-140 T342,-138${NEO?` T${342+NEO},-138`:''}" fill="none" stroke="#9fe3bf" stroke-width="10" opacity=".45"/><path d="M-120,-126 Q-20,-144 80,-126 T260,-128 T342,-122${NEO?` T${342+NEO},-124`:''}" fill="none" stroke="#c7a6ea" stroke-width="6" opacity=".35"/>`;
 const mt=(x,y,w,h)=>P(`M${x-w},${y} L${x},${y-h} L${x+w},${y}Z`,'#d7dfe2',1.6)+`<path d="M${x},${y-h} L${x+w},${y} L${x+w*.25},${y}Z" fill="#b9c6cc" opacity=".9"/>`+P(`M${f(x-w*.4)},${f(y-h*.6)} L${x},${f(y-h)} L${f(x+w*.4)},${f(y-h*.6)} L${f(x+w*.16)},${f(y-h*.5)} L${x},${f(y-h*.64)} L${f(x-w*.16)},${f(y-h*.5)}Z`,'#fbf9f3',1.2);
 [[-90,-104],[-40,-110],[70,-112],[130,-106],[190,-112],[250,-104],[310,-110]].forEach(([x,y])=>g+=mt(x,y,30,f(40+R()*14)));
 if(NEO){const R3=mulberry32(5252);[[370,-106],[420,-112]].forEach(([x,y])=>g+=mt(x,y,30,f(40+R3()*14)));[[360,-40],[372,-30],[350,-24],[400,-60],[412,-50],[392,-46],[430,10],[418,22],[440,30],[380,40],[366,52]].forEach(([x,y])=>g+=P(`M${x-6},${y} L${x},${y-15} L${x+6},${y}Z`,'#3f5d48',1.2)+`<path d="M${x-3},${y-8} L${x},${y-15} L${x+3},${y-8}" fill="#fbf9f3" stroke="${ink}" stroke-width="1"/>`)} /* 東邊多出來的雪地：兩座雪山＋幾棵雪松（另外的亂數，原本的樹位置不變） */
 {const[x,y,w,h]=NPEAK;g+=mt(x,y+34,w+12,h+44)}
 {const[x,y,rx,ry]=NLAKE;g+=`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#bfe0ea" stroke="${ink}" stroke-width="1.6"/><path d="M${x-rx*.5},${y-3} l10,4 l8,-5 M${x+rx*.1},${y+5} l9,-3 l7,4" fill="none" stroke="#fff" stroke-width="1.4"/>`}
 /* 2026-11-23 繪本風：雪地不畫波浪線（R() 照樣跑完，後面的樹位置不變） */for(let i=0;i<40;i++){R();R()}
 const away=(x,y)=>NSPOT.every(([a,b])=>Math.hypot(a-x,b-y)>30)&&Math.hypot((x-NLAKE[0])/(NLAKE[2]+10),(y-NLAKE[1])/(NLAKE[3]+10))>1&&!(x>200&&x<275&&y>15);
 let tr=[];for(let c=0;c<40&&tr.length<70;c++){const cx=-100+R()*420,cy=-96+R()*120;if(!away(cx,cy))continue;for(let k=0;k<9;k++){const x=cx+(R()-.5)*44,y=cy+(R()-.5)*26;if(away(x,y))tr.push([x,y,.75+R()*.35])}}
 tr.sort((a,b)=>a[1]-b[1]).forEach(([x,y,s])=>g+=P(`M${f(x-6*s)},${f(y)} L${f(x)},${f(y-15*s)} L${f(x+6*s)},${f(y)}Z`,'#3f5d48',1.2)+`<path d="M${f(x-3*s)},${f(y-8*s)} L${f(x)},${f(y-15*s)} L${f(x+3*s)},${f(y-8*s)}" fill="#fbf9f3" stroke="${ink}" stroke-width="1"/>`);
 return g}
function renderMap(){const U=prog.unlocked,ink='#2b2420',FN='Huninn,PingFang TC,Noto Sans TC,sans-serif',R=mulberry32(4242);
 const NO=MAPNODES.some(m=>m.north&&isOpen(m.n))?170:0,WO=MAPNODES.some(m=>m.west&&isOpen(m.n))?80:0,EO=MAPNODES.some(m=>m.east&&isOpen(m.n))?110:0;NWO=WO;NEO=EO;/* 2026-11-20 使用者：一開始地圖約略正方形——西邊只到森林（櫻花山城或西邊的關卡去得了才往西長出空地），南邊只露一點海（第 5 關去得了才多出海、放海島）；沙漠去得了之前西南角是海 */const W6=isOpen(6)||WO>0,DS=isOpen(11),SWL=DS||W6,/* 2026-11-25k 使用者：西南角那塊地在櫻花山城出現時就長出來（不要等沙漠才從海變陸地） */CS=(prog.unlocked>=5||EO>0||DS)?0:62;const WOx=W6?WO:WO-76;/* 2026-11-18 map 有 east:true 的關卡（綠島）去得了，地圖往東加寬 110 *//* 2026-11-18 地圖可以拖曳縮放之後：map 有 west:true 的關卡（櫻花參道、滑沙場、金字塔）去得了，地圖往西加寬 80（櫻花山城左邊的名牌、沙漠一區）。11-17d 原本是 200 */ /* 2026-11-17 北方雪國：addLevel 的 map 加 north:true 的關卡「去得了」之後，地圖往北長高 170；之前維持原本大小（11-17b 起不再寫死第 11 關） */
 const P=(d,fill,sw=1.6,extra='')=>`<path d="${d}" fill="${fill}" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
 let g=`<svg viewBox="${-120-WOx} ${-NO} ${462+WOx+EO} ${430-CS+NO}" role="img" aria-label="冒險地圖"><defs><clipPath id="mapClip"><path d="${NO?`M${-102-WOx},-144 Q110,-154 ${324+EO},-142 Q${334+EO},130 ${322+EO},${406-CS} Q110,${416-CS} ${-100-WOx},${406-CS} Q${-110-WOx},130 ${-102-WOx},-144Z`:`M${-102-WOx},26 Q110,16 ${324+EO},28 Q${332+EO},220 ${322+EO},${406-CS} Q110,${416-CS} ${-100-WOx},${406-CS} Q${-108-WOx},220 ${-102-WOx},26Z`}"/></clipPath>
 <radialGradient id="mapVig" cx="50%" cy="50%" r="${WO?76:62}%"><stop offset="70%" stop-color="#f1e2bf" stop-opacity="0"/><stop offset="100%" stop-color="#e8d3a5" stop-opacity=".85"/></radialGradient></defs>`;
 // parchment
 g+=`<path id="mapParch" d="${NO?`M${-110-WOx},-156 Q-40,-166 40,-158 Q140,-168 262,-160 Q${320+EO},-164 ${334+EO},-150 Q${342+EO},-40 ${332+EO},80 Q${340+EO},200 ${332+EO},300 Q${342+EO},360 ${330+EO},${416-CS} Q250,${426-CS} 140,${418-CS} Q20,${428-CS} ${-106-WOx},${418-CS} Q${-118-WOx},320 ${-110-WOx},220 Q${-116-WOx},30 ${-112-WOx},-60 Q${-114-WOx},-120 ${-110-WOx},-156Z`:`M${-110-WOx},14 Q-40,4 40,12 Q140,2 262,10 Q${320+EO},6 ${334+EO},20 Q${340+EO},120 ${332+EO},220 Q${342+EO},330 ${330+EO},${416-CS} Q250,${426-CS} 140,${418-CS} Q20,${428-CS} ${-106-WOx},${418-CS} Q${-118-WOx},320 ${-110-WOx},220 Q${-116-WOx},110 ${-110-WOx},14Z`}" fill="#f1e2bf" stroke="${ink}" stroke-width="2.5"/>`;
 g+=`<g clip-path="url(#mapClip)">`;
 /* (撕邊在最後畫，見 tornEdge) */
 // land
 g+=`<rect x="${-120-WOx}" y="${-NO}" width="${462+WOx+EO}" height="${430+NO}" fill="#c6cb8c"/>`;
 /* 2026-11-11 地圖向西加寬 120（櫻花山城在西邊）；西南角留陸地（之後做沙漠）。西邊的亂數用 R2，東邊原本的圖案不變 */
 const R2=mulberry32(4343);
 if(SWL)g+=`<path d="M${-120-WOx},300 H-4 Q-20,360 -14,430 H${-120-WOx}Z" fill="${MAPSW}"/>`;
 // grass texture
 let tf='';for(let i=0;i<70;i++){const x=20+R()*300,y=130+R()*160;tf+=`M${f(x)},${f(y)} q2,-2.6 4,0 q2,2.6 4,0 `}g+=`<path d="${tf}" fill="none" stroke="#9aa361" stroke-width="1.1" stroke-linecap="round"/>`;   /* 2026-11-21w 繪本風：草地的 ^ 改成小波浪草線 */
 // foothills
 g+=P((WO?`M${-120-WOx},118 Q${-120-WOx*.6},100 ${-120-WOx*.3},116 Q-150,104 -120,122`:'M-120,122')+' Q-92,102 -62,116 Q-30,100 0,128 Q30,104 64,120 Q96,98 132,118 Q170,96 206,116 Q242,96 276,114 Q310,100 '+(342+EO)+',118 V0 H'+(-120-WOx)+'Z','#93a35e',1.6);
 if(NO)g+=northMap(P,ink);
 // mountains back row
 const mt=(x,y,w,h,c1,c2,snow)=>{let s=P(`M${x-w},${y} L${x},${y-h} L${x+w},${y}Z`,c1,1.7)+`<path d="M${x},${y-h} L${x+w},${y} L${x+w*.25},${y}Z" fill="${c2}" opacity=".9"/>`;
  if(snow)s+=P(`M${x-w*.32},${y-h*.68} L${x},${y-h} L${x+w*.32},${y-h*.68} L${x+w*.14},${y-h*.6} L${x},${y-h*.72} L${x-w*.14},${y-h*.6}Z`,'#fbf7ef',1.3);return s};
 if(WO){for(let x=-150;x>-120-WOx+20;x-=58)g+=mt(x,95,30,50+(Math.abs(x)%7),'#b3b8b2','#959c98',1);for(let x=-176;x>-120-WOx+20;x-=62)g+=mt(x,112,28,42,'#8e9a72','#76835c',0)}
 [[-76,94,32,56],[-16,96,30,52],[44,96,30,50],[104,94,34,62],[170,90,36,66],[236,94,32,58],[296,96,32,52]].forEach(([x,y,w,h])=>g+=mt(x,y,w,h,'#b3b8b2','#959c98',1));
 [[-104,112,26,40],[-46,112,28,44],[16,112,26,40],[74,112,30,46],[138,110,30,44],[204,112,32,48],[268,112,28,42],[328,112,26,40]].forEach(([x,y,w,h])=>g+=mt(x,y,w,h,'#8e9a72','#76835c',0));
 // west forest
 const tree0=(x,y,s)=>`<path d="M${f(x)},${f(y)} v5" stroke="${ink}" stroke-width="1.6"/>`+P(`M${f(x-7*s)},${f(y)} L${f(x)},${f(y-16*s)} L${f(x+7*s)},${f(y)}Z`,'#5f7a3f',1.3)+P(`M${f(x-5*s)},${f(y-7*s)} L${f(x)},${f(y-20*s)} L${f(x+5*s)},${f(y-7*s)}`,'#6f8a48',1.2);
 /* 2026-11-21w 繪本風：針葉樹（右側陰影）和圓葉樹混著（每 4 棵 1 棵圓葉） */let TRN=0;const tree=(x,y,s)=>(TRN++%4===3?MAPC.round(x,y+1,s*.82):MAPC.pine(x,y+1,s*.82));
 let tr=[];for(let i=0;i<26;i++)tr.push([22+R()*44,138+R()*150,.8+R()*.4]);[[300,140],[316,170],[308,262],[90,270],[196,282]].forEach(([x,y])=>tr.push([x,y,.9]));
 for(let i=0;i<9;i++)tr.push([-114+R2()*108,126+R2()*24,.75+R2()*.35]);for(let i=0;i<4;i++)tr.push([-14+R2()*26,222+R2()*40,.8+R2()*.3]);
 let tw='';for(let i=0;i<26;i++){const x=-110+R2()*104,y=220+R2()*70;tw+=`M${f(x)},${f(y)} q2,-2.6 4,0 q2,2.6 4,0 `}g+=`<path d="${tw}" fill="none" stroke="#9aa361" stroke-width="1.1" stroke-linecap="round"/>`;
 if(!W6){const R5=mulberry32(6161);for(let i=0;i<22;i++)tr.push([-44+R5()*66,132+R5()*150,.8+R5()*.4])}/* 西邊還沒開：左邊緣是森林 */tr.sort((a,b)=>a[1]-b[1]).forEach(([x,y,s])=>g+=tree(x,y,s));
 // coast + sea
 if(!SWL){const L=-130-WOx;/* 沙漠還沒去之前：海一路延伸到西邊 */g+=`<path d="M${L},430 V290 Q-60,282 0,288 Q20,290 40,294 Q100,284 170,298 Q250,312 ${342+EO},290 V430Z" fill="#e8d6a4"/>`;g+=P(`M${L},440 V300 Q-60,292 0,298 Q20,300 40,304 Q100,294 170,306 Q250,320 ${342+EO},298 V440Z`,'#9cc6bd',2);g+=`<path d="M${L},310 Q-60,302 0,308 Q22,312 46,314 Q100,304 170,316 Q250,330 ${342+EO},308" fill="none" stroke="#fffaf0" stroke-width="1.6" stroke-dasharray="10 8" opacity=".8"/>`;g+=`<path d="M-80,356 q7,-4 14,0 q7,4 14,0 M-20,392 q7,-4 14,0 q7,4 14,0" fill="none" stroke="#fffaf0" stroke-width="1.8" stroke-linecap="round"/>`}else{g+=`<path d="M-26,430 Q-30,366 -12,326 Q2,298 40,294 Q100,284 170,298 Q250,312 ${342+EO},290 V430Z" fill="#e8d6a4"/>`;
 g+=P('M-12,440 Q-16,370 0,334 Q12,310 40,304 Q100,294 170,306 Q250,320 '+(342+EO)+',298 V440Z','#9cc6bd',2);
 g+=`<path d="M4,430 Q2,372 12,344 Q22,320 46,314 Q100,304 170,316 Q250,330 ${342+EO},308" fill="none" stroke="#fffaf0" stroke-width="1.6" stroke-dasharray="10 8" opacity=".8"/>`;
 }
 g+=`<path d="M60,350 q7,-4 14,0 q7,4 14,0 M150,366 q7,-4 14,0 q7,4 14,0 M110,394 q7,-4 14,0 q7,4 14,0 M220,388 q7,-4 14,0 q7,4 14,0 M270,350 q7,-4 14,0 q7,4 14,0" fill="none" stroke="#fffaf0" stroke-width="1.8" stroke-linecap="round"/>`;
 if(EO){const R3=mulberry32(5151);[[356,94,34,60],[412,92,34,56]].forEach(([x,y,w,h])=>g+=mt(x,y,w,h,'#b3b8b2','#959c98',1));[[362,112,28,44],[420,112,28,44]].forEach(([x,y,w,h])=>g+=mt(x,y,w,h,'#8e9a72','#76835c',0));let te=[];for(let i=0;i<14;i++)te.push([346+R3()*104,134+R3()*150,.8+R3()*.4]);te.sort((a,b)=>a[1]-b[1]).forEach(([x,y,s])=>g+=tree(x,y,s));let tw3='';for(let i=0;i<16;i++){const x=346+R3()*100,y=150+R3()*130;tw3+=`M${f(x)},${f(y)} q2,-2.6 4,0 q2,2.6 4,0 `}g+=`<path d="${tw3}" fill="none" stroke="#9aa361" stroke-width="1.1" stroke-linecap="round"/>`;g+=`<path d="M344,372 q7,-4 14,0 q7,4 14,0 M400,350 q7,-4 14,0 q7,4 14,0 M380,396 q7,-4 14,0 q7,4 14,0 M436,380 q7,-4 14,0 q7,4 14,0" fill="none" stroke="#fffaf0" stroke-width="1.8" stroke-linecap="round"/>`}
 // river
 /* 2026-11-20 使用者：河流跟山、跟海的交接不要有邊界感 → 拿掉黑框，用淡一點的河岸色；河口那段只畫水色、伸進海裡蓋住海岸線 */g+=`<path d="M150,108 Q136,150 150,196 Q166,246 176,296" fill="none" stroke="#7aa89b" stroke-width="8" stroke-linecap="round"/><path d="M150,108 Q136,150 150,196 Q166,246 179,314" fill="none" stroke="#9cc6bd" stroke-width="5.6" stroke-linecap="round"/>`;
 // birds
 g+=`<path d="M200,150 q4,-4 8,0 q4,-4 8,0 M222,140 q3,-3 6,0 q3,-3 6,0 M86,150 q3,-3 6,0 q3,-3 6,0" fill="none" stroke="${ink}" stroke-width="1.3"/>`+MAPC.birds(30,40,.9)+MAPC.birds(250,26,.8)+MAPC.birds(140,330,.9);   /* 繪本風：天空和海上多幾隻小鳥 */
 [...MAPHOOKS].sort((a,b)=>(a.z??2)-(b.z??2)).forEach(h=>{g+=h({U,P,ink,FN,f,open:isOpen})});
 // vignette
 g+=`<rect x="${-120-WOx}" y="${-NO}" width="${462+WOx+EO}" height="${430-CS+NO}" fill="url(#mapVig)" pointer-events="none"/></g>`; /* 暈影不能擋住地點的點擊 */
 g+=`<path d="${NO?`M${-96-WOx},-140 Q110,-150 ${318+EO},-138 Q${328+EO},130 ${316+EO},${400-CS} Q110,${410-CS} ${-94-WOx},${400-CS} Q${-104-WOx},130 ${-96-WOx},-140Z`:`M${-96-WOx},30 Q110,20 ${318+EO},32 Q${326+EO},220 ${316+EO},${400-CS} Q110,${410-CS} ${-94-WOx},${400-CS} Q${-102-WOx},220 ${-96-WOx},30Z`}" fill="none" stroke="#a8916a" stroke-width="1.2" stroke-dasharray="4 5"/>`;
 g+='<g pointer-events="none">';MAPTOP.forEach(h=>{g+=h({U,P,ink,FN,f,open:isOpen})});g+='</g>'; /* 畫在暈影上面的東西（例如秘境的光圈） */
 /* 2026-11-18 大區名牌（遠看才顯示，放大後換成各關名字）：levels.js 用 addRegion 登記 */
 g+='<g pointer-events="none">';MAPREGIONS.forEach(r=>{if(!r.ids.some(isOpen))return;g+=`<g class="rlab" data-t="translate(${r.x},${r.y})" transform="translate(${r.x},${r.y})"><text y="5" text-anchor="middle" font-size="14" letter-spacing="3" fill="#5a3d22" stroke="#f8eed6" stroke-width="5" stroke-linejoin="round" paint-order="stroke" font-family="${FN}">${r.name}</text></g>`});g+='</g>';
 // compass
 g+=`<g transform="translate(58,${368-CS*.45})"><circle r="20" fill="#f1e2bf" stroke="${ink}" stroke-width="2"/><circle r="15" fill="none" stroke="#c9b48a" stroke-width="1"/><path d="M0,-17 L5,0 L0,17 L-5,0Z" fill="#a8461f" stroke="${ink}" stroke-width="1.4"/><path d="M-17,0 L0,-4 L17,0 L0,4Z" fill="#e8dcc0" stroke="${ink}" stroke-width="1.1"/><text x="0" y="-24" text-anchor="middle" font-size="11" fill="${ink}" font-family="${FN}">北</text></g>`;
 // here pin
 const here=HERE[level]||[100,150];
 /* 2026-11-21w 你在這裡＝紅色封蠟章（邊緣不規則、中間壓一顆星），輕輕上下浮 */
 {let wd='';for(let i=0;i<18;i++){const t=i/18*Math.PI*2,rr=12+(i%3?1.2:-.6)+(i%5?0:1.4);wd+=(i?'L':'M')+f(Math.cos(t)*rr)+','+f(-10+Math.sin(t)*rr)}
 g+=`<g class="mpin" data-t="translate(${here[0]},${here[1]})" transform="translate(${here[0]},${here[1]})" pointer-events="none"><g><animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="1.8s" repeatCount="indefinite"/><ellipse cx="1.5" cy="4" rx="10" ry="3" fill="#000" opacity=".18"/>`+P(wd+'Z','#b3342a',1.8)+`<circle cy="-10" r="8" fill="#c94a3c" stroke="#8e2a20" stroke-width="1.4"/><path d="M0,-15.5 L1.7,-11.8 L5.6,-11.4 L2.6,-8.8 L3.5,-5 L0,-7 L-3.5,-5 L-2.6,-8.8 L-5.6,-11.4 L-1.7,-11.8Z" fill="#f2b8a8" stroke="#8e2a20" stroke-width=".9"/><path d="M-6,-16 Q-3,-19 2,-18.5" fill="none" stroke="#f6d0c4" stroke-width="1.4" stroke-linecap="round"/></g></g>`}
 g+='</svg>';
 $('#mapSvg').innerHTML=g;tornEdge();MAPVB={x:-120-WOx,y:-NO,w:462+WOx+EO,h:430-CS+NO};
 /* 各關名牌加上 mlab（縮放時保持看得清楚）；屬於大區的關卡，遠看時名牌藏起來 */
 document.querySelectorAll('#mapSvg .mnode').forEach(m=>{const n=+m.dataset.n;if(MAPREGIONS.some(r=>r.ids.includes(n)))m.classList.add('inreg');
  m.querySelectorAll('g').forEach(e=>{if(e.querySelector(':scope>rect')&&e.querySelector(':scope>text')){e.classList.add('mlab');e.dataset.t=e.getAttribute('transform')||''}})});
 $('#mapSvg').style.aspectRatio=`${MAPVB.w}/${MAPVB.h}`;   /* 框的比例＝地圖範圍的比例 */
 if($('#mapSvg').clientWidth)mapSetup();
 const OM=openMain();$('#mapSub').textContent=U<=1?`這一關拿到 ${NEED_STARS} 顆星，地圖上就會出現新的路`:linNext(U)?`已走過 ${OM.length} 個地方，下一段路要拿到 ${NEED_STARS} 顆星才會出現`:FIND_IDS.some(canFind)?`已走過 ${OM.length} 個地方。聽說還有沒去過的地方⋯問問頭上有「…」的人吧`:`已走過 ${OM.length} 個地方`;
 /* 2026-11-21w 使用者選明信片（B）＋地點索引（C）的「地圖飛過去、圖釘閃一下」：
    每個大區一排明信片，左右滑；點一張 → 地圖飛到那裡、圖釘閃一下、明信片翻出「出發」；再點一次（或點出發）才出發 */
 const list=OM.filter(n=>SCENES[n]).concat(SECRET_IDS.filter(n=>secretSeen(n)&&MAPNODES.find(x=>x.n===n)));
 const GL=[],GM=new Map();list.sort((a,b)=>a-b).forEach(n=>{const g=groupOf(n);if(!GM.has(g)){GM.set(g,[]);GL.push(g)}GM.get(g).push(n)});
 GL.sort((a,b)=>(a===SECGRP)-(b===SECGRP)||(a===OTHGRP)-(b===OTHGRP));
 /* 現在這一關的那一組排最前面 */
 {const hg=groupOf(level),k=GL.indexOf(hg);if(k>0){GL.splice(k,1);GL.unshift(hg)}}
 const PCOL=['#f3e3c3','#e3eedb','#dbe7f0','#f5dde0','#efe6cf','#f5e6c0','#e6dff4','#e2ecef'];
 let cards='';GL.forEach((g,gi)=>{const ns=GM.get(g),sum=ns.reduce((a,n)=>a+Math.min(3,starsOf(n)),0),sec=g===SECGRP;
  cards+=`<div class="pgrp${sec?' secret':''}"><div class="pgh"><b>${g.ic||''} ${g.name}</b><small>${ns.length} 個地方 · ${starSvg(true,13)} ${sum}/${ns.length*3}${ns.length>2?' · 滑動看更多 ›':''}</small></div><div class="prow">`;
  ns.forEach((n,i)=>{const m=MAPNODES.find(x=>x.n===n),b=bestOf(n),st_=starsOf(n),here=n===level;
   cards+=`<button class="pcd${here?' here':''}${sec?' secret':''}" data-n="${n}" style="--rt:${(i%2?1.4:-1.4)}deg;--pc:${sec?'#e6dff4':PCOL[gi%PCOL.length]}" aria-label="${m.name}${here?'（你在這裡）':''}">${here?'<span class="here-tag">你在這裡</span>':''}<span class="pic">${CARDPV[n]?CARDPV[n]():NEXTINFO[n]&&NEXTINFO[n].pv?NEXTINFO[n].pv():`<span class="pe">${m.ic||g.ic||'📍'}</span>`}<span class="pst">${[0,1,2].map(k=>starSvg(k<st_,13)).join('')}${COL.b&&COL.b[n]?starSvg(true,13,'#7fc45a'):''}</span></span><span class="nm">${m.name}</span><small>${b?'最佳 '+fmt(b):(sec?'秘境':'還沒完成')}</small><span class="go">出發 ›</span></button>`});
  cards+=`</div></div>`});
 $('#mapCards').innerHTML=cards;
 /* 2026-11-21w 使用者：明信片的圖不要自己重畫，用關卡原本的圖——有「下一站預告圖」（NEXTINFO.pv，每關自己的場景）就用它；
    沒有的（第 1 關）從冒險地圖上剪那一關的地標小圖（拿掉名牌） */
 document.querySelectorAll('#mapCards .pcd').forEach(el=>{const pic=el.querySelector('.pic');if(!pic||!pic.querySelector('.pe'))return;const art=nodeArt(+el.dataset.n);if(art){pic.querySelector('.pe').remove();pic.insertAdjacentHTML('afterbegin',art)}});
 document.querySelectorAll('#mapSvg .mnode').forEach(el=>el.onclick=()=>goLevel(+el.dataset.n));
 document.querySelectorAll('#mapCards .pcd').forEach(el=>el.onclick=e=>{const n=+el.dataset.n;
  if(el.classList.contains('sel')||e.target.classList.contains('go')){goLevel(n);return}
  document.querySelectorAll('#mapCards .pcd.sel').forEach(x=>x.classList.remove('sel'));el.classList.add('sel');cardToTop(el);mapFly(n)});
 /* 2026-11-21w 使用者：電腦上明信片左右滑不動 → 滑鼠可以按住拖曳（移動超過 5px 才算拖，不會誤點）；Shift＋滾輪或觸控板左右滑也能捲（一般上下滾輪不攔，才不會卡住整頁捲動） */
 document.querySelectorAll('#mapCards .prow').forEach(row=>{let d=null;
  row.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;d={x:e.clientX,sl:row.scrollLeft,id:e.pointerId,on:false}});
  row.addEventListener('pointermove',e=>{if(!d||e.pointerId!==d.id)return;const dx=e.clientX-d.x;if(!d.on&&Math.abs(dx)>5){d.on=true;row.classList.add('drag');try{row.setPointerCapture(d.id)}catch(_){}}if(d.on){row.scrollLeft=d.sl-dx;e.preventDefault()}});
  const end=()=>{if(!d)return;const was=d.on;d=null;if(was)setTimeout(()=>row.classList.remove('drag'),0)};row.addEventListener('pointerup',end);row.addEventListener('pointercancel',end);row.addEventListener('lostpointercapture',end);
  row.addEventListener('wheel',e=>{if(row.scrollWidth<=row.clientWidth+2)return;const v=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:(e.shiftKey?e.deltaY:0);if(!v)return;const before=row.scrollLeft;row.scrollLeft+=v;if(row.scrollLeft!==before)e.preventDefault()},{passive:false})});
}
/* 2026-11-21w 羊皮紙撕邊：沿著羊皮紙外框取點，挖出一個個小三角缺口（缺口填地圖框的底色，兩邊描墨線） */
function tornEdge(){const svg=document.querySelector('#mapSvg svg'),pa=svg&&svg.querySelector('#mapParch');if(!pa||!pa.getTotalLength)return;
 let L;try{L=pa.getTotalLength()}catch(_){return}if(!L)return;const bb=pa.getBBox(),cx=bb.x+bb.width/2,cy=bb.y+bb.height/2,R=mulberry32(777);let d='',e='';
 for(let s_=6;s_<L-6;s_+=10+R()*22){if(R()<.35)continue;const p=pa.getPointAtLength(s_),q=pa.getPointAtLength(Math.min(L,s_+1));let tx=q.x-p.x,ty=q.y-p.y;const tl=Math.hypot(tx,ty)||1;tx/=tl;ty/=tl;
  let nx=-ty,ny=tx;if((cx-p.x)*nx+(cy-p.y)*ny<0){nx=-nx;ny=-ny}const w=2.2+R()*3.4,dp=2.4+R()*4.2,o=(R()-.5)*3;
  const a=[p.x-tx*w,p.y-ty*w],b=[p.x+tx*w,p.y+ty*w],c=[p.x+nx*dp+tx*o,p.y+ny*dp+ty*o];
  d+=`M${f(a[0]-nx)},${f(a[1]-ny)} L${f(c[0])},${f(c[1])} L${f(b[0]-nx)},${f(b[1]-ny)}Z `;e+=`M${f(a[0])},${f(a[1])} L${f(c[0])},${f(c[1])} L${f(b[0])},${f(b[1])} `}
 const NS='http://www.w3.org/2000/svg',g=document.createElementNS(NS,'g');g.setAttribute('pointer-events','none');
 g.innerHTML=`<path d="${d}" fill="#fbf3e2" stroke="none"/><path d="${e}" fill="none" stroke="#2b2420" stroke-width="1.3" stroke-linejoin="round"/>`;svg.appendChild(g)}
/* 2026-11-21w 使用者：點了明信片不要跳回最上面 → 那張明信片所屬大區的標題捲到剛好在凍結窗格（表頭＋地圖）下緣；
   已經是最下面幾張、捲不上去時就停在最下面（整張卡片一定看得到）；同一排裡也左右捲到看得到 */
function cardToTop(el){const pc=el.closest('.mapc'),top=pc&&pc.querySelector('.mtop'),row=el.closest('.prow');if(!pc||!top)return;
 try{if(row){const rl=el.offsetLeft-row.offsetLeft-10;if(rl<row.scrollLeft||rl+el.offsetWidth+20>row.scrollLeft+row.clientWidth)row.scrollTo({left:Math.max(0,rl),behavior:'smooth'})}
  const hd=(el.closest('.pgrp')&&el.closest('.pgrp').querySelector('.pgh'))||el;   /* 使用者更正：對齊的是這張卡片所屬大區的標題（例如「❄️ 雪山」），不是卡片本身 */
  const want=pc.scrollTop+(hd.getBoundingClientRect().top-top.getBoundingClientRect().bottom)-6;
  pc.scrollTo({top:Math.max(0,Math.min(want,pc.scrollHeight-pc.clientHeight)),behavior:'smooth'})}catch(_){}}
/* 地圖飛到第 n 關的位置、圖釘閃一下（明信片點一下時） */
function nodeArt(n){const svg=document.querySelector('#mapSvg svg'),node=svg&&svg.querySelector(`.mnode[data-n="${n}"]`);if(!node)return '';
 const hid=[...node.querySelectorAll('.mlab,text')];hid.forEach(e=>e.style.display='none');let bb;try{bb=node.getBBox()}catch(_){}hid.forEach(e=>e.style.display='');if(!bb||!bb.width)return '';
 const c=node.cloneNode(true);c.querySelectorAll('.mlab,text,animate,animateTransform').forEach(e=>e.remove());c.removeAttribute('class');c.removeAttribute('data-n');
 const pad=4,w=bb.width+pad*2,h=bb.height+pad*2,W=Math.max(w,h*120/84),H_=W*84/120;
 return `<svg viewBox="${f(bb.x+bb.width/2-W/2)} ${f(bb.y+bb.height/2-H_/2)} ${f(W)} ${f(H_)}" aria-hidden="true"><rect x="-999" y="-999" width="3000" height="3000" fill="#cfe0a8"/>${c.outerHTML}</svg>`}
function nodeXY(n){/* 地標的真正中心：那一關地圖小圖（.mnode）裡第一個透明點擊圓的圓心，換算成地圖座標；沒有的話用 HERE */
 const m=MAPNODES.find(x=>x.n===n),svg=MV&&MV.svg;let node=svg&&svg.querySelector(`.mnode[data-n="${n}"]`);
 if(!node&&LEVELS[n]){const L=LEVELS[n],via=L.secret?L.home:(L.find&&!HERE[n]?L.find.from:0);if(HERE[n]&&HERE[n][0]===100&&HERE[n][1]===170)node=svg&&svg.querySelector('.mnode[data-n="17"]')||null;else if(via)node=svg&&svg.querySelector(`.mnode[data-n="${via}"]`)}
 const c=node&&(node.querySelector('circle[fill="transparent"]')||node);
 if(c&&c.getBBox){try{const bb=c.getBBox(),pt=svg.createSVGPoint();pt.x=bb.x+bb.width/2;pt.y=bb.y+bb.height/2;const M=svg.getScreenCTM().inverse().multiply(c.getScreenCTM()),q=pt.matrixTransform(M);if(isFinite(q.x)&&isFinite(q.y))return [q.x,q.y]}catch(_){}}
 return HERE[n]||(m?[m.x,m.y]:null)}
function mapFly(n){const m=MAPNODES.find(x=>x.n===n);if(!m||!MV)return;if(MV.svg.style.transform)mapApply();const p=nodeXY(n),box=$('#mapSvg');if(!p)return;
 
 const k0=MV.k,cx0=MV.cx,cy0=MV.cy,k1=Math.max(MV.kMin*2.2,Math.min(MV.kMax,k0)),t0=performance.now(),D=650;
 const step=t=>{const u=Math.min(1,(t-t0)/D),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;MV.k=k0+(k1-k0)*e;MV.cx=cx0+(p[0]-cx0)*e;MV.cy=cy0+(p[1]-cy0)*e;
  if(u<1){mapMove();requestAnimationFrame(step)}else{mapApply();flash()}};requestAnimationFrame(step);
 function flash(){const NS='http://www.w3.org/2000/svg',old=MV.svg.querySelector('.mflash');if(old)old.remove();const g=document.createElementNS(NS,'g');g.setAttribute('class','mflash');g.setAttribute('transform',`translate(${p[0]},${p[1]})`);g.setAttribute('pointer-events','none');
  g.innerHTML=`<g class="mfp"><path d="M0,0 C-7,-9 -8,-13 -8,-16 A8,8 0 1 1 8,-16 C8,-13 7,-9 0,0Z" fill="#c4473a" stroke="#2b2420" stroke-width="1.6"/><circle cy="-16" r="3" fill="#fffaf0"/></g>`;
  MV.svg.appendChild(g);setTimeout(()=>g.remove(),2600)}}
/* 2026-11-18 使用者：從場景出口出發（找路關卡），就算已經去過也要播過場；在冒險地圖上點地點直接前往，維持第一次才播。
   2026-11-18e：剛過關打開地圖、點的是「下一站」（WINGO），也跟按下一站按鈕一樣播過場 */
function goLevel(n,viaExit){if(BGBUSY){whenReady(()=>goLevel(n,viaExit));return}if(PANO)panoSet(false);if(LEVELS[n]&&LEVELS[n].secret&&isNewPlace(n)){if(!canDiscover(n)){toast(DAYMSG.replace('<br>',''),4200);return}noteDiscover(n)}if(WINGO&&WINGO===n)viaExit=true;WINGO=0;if(LEVELS[n]&&LEVELS[n].file&&!LEVELS[n].types){ensureFull(n,()=>goLevel(n,viaExit));return}
 if((viaExit||!rodeHas(n))&&NEXTINFO[n]){$('#mapOv').classList.add('hide');mapUnder=[];st.running=false;clearInterval(timer);['winOv','startOv'].forEach(id=>$('#'+id).classList.add('hide'));rodeAdd(n);
  ride(()=>{loadScene(n);setLevel(n);newGame();clockHold();$('#time').textContent='0:00'},()=>{clockRun(true);toast(`${LEVELS[n].title}，開始！`,2200)},NEXTINFO[n].ride);return}
 $('#mapOv').classList.add('hide');const under=mapUnder;mapUnder=[];if(n===level&&scene===n&&!st.running&&under.includes('startOv')){$('#startOv').classList.remove('hide');return}if(n===level&&scene===n&&st.running)return;st.running=false;clearInterval(timer);$('#winOv').classList.add('hide');
 if(scene!==n){curtain(()=>{loadScene(n);setLevel(n);measure();const c=LEVELS[n].c;view={s:base,tx:SW/2-c[0]*base,ty:SH/2-c[1]*base};clampV();apply();$('#startOv').classList.remove('hide')},'前往'+MAPNODES.find(m=>m.n===n).name+'⋯')}
 else{setLevel(n);$('#startOv').classList.remove('hide')}}
/* 地圖打開時先把底下的開始／過關面板收起來，關地圖再放回去（避免 iPhone 疊圖錯亂） */
let mapUnder=[];
/* ===== 冒險地圖拖曳、縮放（2026-11-18，使用者選 B＋C）=====
   地圖區固定高度，用改 viewBox 的方式拖曳／兩指縮放（向量不會糊）；打開時放大對準「你在這裡」。
   遠看（縮到接近全圖）：屬於大區的關卡藏名牌、顯示大區名（rlab）；放大後顯示各關名字。名牌、圖釘會反向放大，手機上至少約 12px。 */
const MAPREGIONS=[];function addRegion(r){MAPREGIONS.push(r)}
/* 2026-11-21w 卡片分組（地圖下方的關卡卡片、收集冊的分頁）：levels.js 用 addCardGroup({name,ic,ids}) 登記；
   秘境自動放「秘境」組，沒登記的放「其他」。新關卡記得把編號加進某一組。 */
const CARDGROUPS=[];function addCardGroup(g){CARDGROUPS.push(g)}
const CARDPV={};   /* 2026-11-21w 只給明信片用的圖（沒有「下一站預告圖」的關卡，例如第 1 關）：levels.js 設 CARDPV[n]=()=>svg */
const SECGRP={name:'秘境',ic:'🗝️',ids:[]},OTHGRP={name:'其他',ic:'📍',ids:[]};
function groupOf(n){if(LEVELS[n]&&LEVELS[n].secret&&!LEVELS[n].room)return SECGRP; /* 室內小關卡照 addCardGroup 分組（沉船酒館＝海島），不進秘境組 */return CARDGROUPS.find(g=>g.ids.includes(n))||OTHGRP}
let CGOPEN=null;   /* 地圖卡片：打開的組（名字）；一開始打開「現在這一關」那一組 */
let COLTAB=null;   /* 收集冊：選中的分頁 */
const COLOPEN=new Set();   /* 收集冊：展開的關卡 */
let MAPVB=null,MV=null;
function mapSetup(){const box=$('#mapSvg'),svg=box.querySelector('svg');if(!svg||!MAPVB||!box.clientWidth)return;
 const W=box.clientWidth,H_=box.clientHeight,vb=MAPVB,kMin=Math.min(W/vb.w,H_/vb.h),here=HERE[level]||[100,150];
 MV={vb,W,H:H_,kMin,kMax:Math.max(kMin*4,2.6),k:kMin,cx:here[0],cy:here[1]+20,svg,labs:[...svg.querySelectorAll('.mlab,.rlab,.mpin')],ls:0};
 mapApply()}
/* 2026-11-18e：地圖縮放卡卡 → 手指移動時只用 CSS transform 移動「已經畫好的圖」（iPhone 交給 GPU，很順），
   手指放開、停住 0.16 秒、或快露出沒畫到的邊時，才改 viewBox 重畫一次（名牌大小、遠看大區名也只在這時候換）。
   svg 本身比地圖框大 MAPPAD 倍（四邊各多 30%），拖一點點不會露出空白。 */
const MAPPAD=1.6;
function mapClamp(){const m=MV,vb=m.vb;m.k=Math.max(m.kMin,Math.min(m.kMax,m.k));const vw=m.W/m.k,vh=m.H/m.k;
 m.cx=vw>=vb.w?vb.x+vb.w/2:Math.max(vb.x+vw/2,Math.min(vb.x+vb.w-vw/2,m.cx));m.cy=vh>=vb.h?vb.y+vb.h/2:Math.max(vb.y+vh/2,Math.min(vb.y+vb.h-vh/2,m.cy))}
function mapApply(){const m=MV;mapClamp();const vw=m.W*MAPPAD/m.k,vh=m.H*MAPPAD/m.k;
 m.svg.style.transform='';m.C={k:m.k,cx:m.cx,cy:m.cy};
 m.svg.setAttribute('viewBox',`${f(m.cx-vw/2)} ${f(m.cy-vh/2)} ${f(vw)} ${f(vh)}`);
 m.svg.classList.toggle('far',m.k<m.kMin*1.45);
 const ls=Math.max(1,Math.min(1.45,12.5/(11*m.k)));if(Math.abs(ls-m.ls)>.01){m.ls=ls;m.labs.forEach(e=>e.setAttribute('transform',e.dataset.t+` scale(${ls.toFixed(3)})`))}}
/* 手指移動中：只換 transform；快要露出沒畫到的地方（或放太大會糊）才重畫 */
function mapMove(){const m=MV;if(!m.C)return mapApply();mapClamp();const C=m.C,r=m.k/C.k,tx=(C.cx-m.cx)*m.k,ty=(C.cy-m.cy)*m.k,
  half=(MAPPAD/2)*r;/* 已畫好的圖，在螢幕上從中心往外的半寬（以地圖框寬度為 1） */
 if(r>2.2||half<.5+Math.abs(tx)/m.W+.02||half<.5+Math.abs(ty)/m.H+.02)return mapApply();
 m.svg.style.transform=`translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${r.toFixed(4)})`}
function mapZoomAt(x,y,k){const r=$('#mapSvg').getBoundingClientRect(),m=MV,ux=m.cx+(x-r.left-m.W/2)/m.k,uy=m.cy+(y-r.top-m.H/2)/m.k;
 m.k=Math.max(m.kMin,Math.min(m.kMax,k));m.cx=ux-(x-r.left-m.W/2)/m.k;m.cy=uy-(y-r.top-m.H/2)/m.k;mapApply()}
(()=>{const box=document.getElementById('mapSvg');if(!box)return;const pts=new Map();let moved=0,start=null,pinch=null,raf=0;
 let idle=0;const commit=()=>{clearTimeout(idle);if(raf){cancelAnimationFrame(raf);raf=0}MV&&mapApply()};
 const sched=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;MV&&mapMove()});clearTimeout(idle);idle=setTimeout(commit,160)};
 const clear=()=>{const had=pts.size;pts.clear();pinch=null;start=null;if(had&&MV&&MV.svg.style.transform)commit()};
 const reStart=()=>{const p=[...pts.values()][0];start=p?{x:p.x,y:p.y,cx:MV.cx,cy:MV.cy}:null};
 box.addEventListener('pointerdown',e=>{if(!MV)return;if(e.isPrimary){clear();moved=0}pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pts.size===1)reStart();else if(pts.size===2){const[a,b]=[...pts.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y)||1,k:MV.k,mx:(a.x+b.x)/2,my:(a.y+b.y)/2,cx:MV.cx,cy:MV.cy};moved=2}});
 window.addEventListener('pointermove',e=>{if(!MV||!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pinch&&pts.size>=2){const[a,b]=[...pts.values()],r=box.getBoundingClientRect(),P0=pinch,ux=P0.cx+(P0.mx-r.left-MV.W/2)/P0.k,uy=P0.cy+(P0.my-r.top-MV.H/2)/P0.k;
   MV.k=Math.max(MV.kMin,Math.min(MV.kMax,P0.k*Math.hypot(a.x-b.x,a.y-b.y)/P0.d));MV.cx=ux-((a.x+b.x)/2-r.left-MV.W/2)/MV.k;MV.cy=uy-((a.y+b.y)/2-r.top-MV.H/2)/MV.k;sched()}
  else if(start){const dx=e.clientX-start.x,dy=e.clientY-start.y;if(!moved&&Math.hypot(dx,dy)>7)moved=1;if(moved){MV.cx=start.cx-dx/MV.k;MV.cy=start.cy-dy/MV.k;sched()}}
  if(moved)box.classList.add('used')});
 const up=e=>{if(!pts.has(e.pointerId))return;pts.delete(e.pointerId);if(pts.size<2)pinch=null;if(MV){reStart();if(!pts.size)commit()}};
 window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
 box.addEventListener('touchend',e=>{if(!e.touches.length)clear()},{passive:true});box.addEventListener('touchcancel',clear,{passive:true});
 document.addEventListener('visibilitychange',clear);
 box.addEventListener('click',e=>{if(moved){e.stopPropagation();e.preventDefault();moved=0}},true);
 box.addEventListener('wheel',e=>{if(!MV)return;e.preventDefault();mapZoomAt(e.clientX,e.clientY,MV.k*Math.exp(-e.deltaY*.0015))},{passive:false});
 box.addEventListener('dblclick',e=>{if(!MV)return;e.preventDefault();mapZoomAt(e.clientX,e.clientY,MV.k<MV.kMin*1.45?MV.kMin*2:MV.kMin)});
})();
let MAPINVITE=0;
function openMap(){if(BGBUSY){whenReady(openMap);return}renderMap();if(MAPINVITE){MAPINVITE=0;$('#mapSub').textContent='今天要去哪裡探險呢？點地圖上的地方，或下面的卡片出發吧！'}mapUnder=['startOv','winOv'].filter(id=>!$('#'+id).classList.contains('hide'));mapUnder.forEach(id=>$('#'+id).classList.add('hide'));$('#mapOv').classList.remove('hide');mapSetup()}
function ride(mid,done,kind){const RX=RIDES[kind]||{svg:()=>'',text:'出發⋯',every:1000,tick:()=>{}},el=$('#ride');el.innerHTML=RX.svg()+`<span>${RX.text}</span>`;el.classList.add('on');document.body.classList.add('riding');/* 過場時上方 HUD、下方清單先藏起來，畫面比較完整（2026-11-10） */
 let clop=0;const ci=setInterval(()=>{RX.tick(clop++)},RX.every);
 setTimeout(()=>{try{mid()}catch(e){console.error(e)}},1100);
 setTimeout(()=>{clearInterval(ci);el.classList.remove('on');document.body.classList.remove('riding');setTimeout(()=>{el.innerHTML='';done&&done()},520)},4300)}

/* ================= 收集冊 ================= */
let COL={i:{},c:{},s:{},b:{}};try{const v=JSON.parse(localStorage.getItem('townhunt-col')||'null');if(v&&v.i)COL={s:{},b:{},...v}}catch(_){}
const saveCol=()=>{try{localStorage.setItem('townhunt-col',JSON.stringify(COL))}catch(_){}};
/* 收集冊不分關卡：同一種物件只記一次（舊的「關卡:id」記錄自動轉回 id） */
Object.keys(COL.i).forEach(k=>{if(k.includes(':')){COL.i[k.split(':')[1]]=1;delete COL.i[k]}});
function colAdd(id){if(!COL.i[id]){COL.i[id]=1;saveCol()}}
function colClover(n){if(!COL.c[n]){COL.c[n]=1;saveCol()}}
function colBonus(n){if(!COL.b[n]){COL.b[n]=1;saveCol()}}
function colStory(n){if(!COL.s[n]){COL.s[n]=1;saveCol()}}
(()=>{const ov=document.createElement('div');ov.className='overlay hide';ov.id='colOv';
 ov.innerHTML=`<div class="pcard colc"><div class="mhead"><div><b>收集冊</b><span id="colSub"></span></div><button class="hb" id="colClose" aria-label="關閉收集冊"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg></button></div><div id="colBody"></div></div>`;
 document.body.appendChild(ov);
 const mb=document.createElement('button');mb.id='colBtn';mb.innerHTML=`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M9 8h6"/></svg><span>收集冊</span>`;
 const mapB=document.getElementById('mapBtn');mapB.parentNode.insertBefore(mb,mapB.nextSibling);
 /* 測試模式專用：快速找到提問的人、目標物、幸運草 */
 [['tPano','🧪 全景（看整張、檢查破圖）'],['tBonus','🧪 找隱藏幸運草'],['tClover','🧪 找故事幸運草'],['tHelper','🧪 找幫手'],['tTarget','🧪 找走失的目標'],['tGiver','🧪 找提問的人']].forEach(([id,t])=>{const b=document.createElement('button');b.id=id;b.className='tbtn';b.style.display='none';b.innerHTML=`<span>${t}</span>`;mb.parentNode.insertBefore(b,mb.nextSibling.nextSibling)})})();
function testGo(p,label){closeMenu();if(!p){toast('這一關沒有'+label,1600);return}const s2=Math.max(view.s,base*1.5);tweenTo(s2,p[0],p[1],600);
 setTimeout(()=>{const g=svgEl('g',{},fx),c=svgEl('circle',{cx:p[0],cy:p[1],r:10,fill:'none',stroke:'#d8413a','stroke-width':4},g);anim(1600,k=>{c.setAttribute('r',10+30*(k*3%1));g.setAttribute('opacity',1-k*.7)},()=>g.remove())},620);toast('🧪 '+label,1400)}
document.getElementById('tGiver').onclick=()=>{const g=storySp.giver;testGo(g&&[g.x,g.y-30],'提問的人')};
document.getElementById('tHelper').onclick=()=>{const t=storySp.helper;testGo(t&&[t.x,t.y-30],'幫手')};
document.getElementById('tTarget').onclick=()=>{const t=storySp.target;testGo(t&&[t.x,t.y-t.h*.4],'走失的目標')};
const cloverGo=(c,nm)=>{if(!c){testGo(null,nm);return}if(c.found){toast(nm+'已經找到了',1400);return}const h=c.host;
 testGo(c.revealed?[c.x,c.y]:[h.x,h.y-h.h*.4],c.revealed?nm:nm+'藏在這個東西後面'+(c.kind==='story'&&!(story&&story.done)?'（要先完成小故事才點得出來）':'（點它）'))};
document.getElementById('tPano').onclick=()=>{closeMenu();panoSet(!PANO)};
/* ---- 測試模式：全景（2026-11-18 使用者要求，主線、找路關卡、秘境都能用） ----
   上方 ✓ 旁的按鈕（#panoBtn）或選單「🧪 全景」開關。全景時：
   - 解開「不能縮小超過開場」的限制，一開始縮到整張剛好放進畫面，可以拖曳、兩指縮放；點畫面不算找東西、計時暫停。
   - 藏起上方列和下方清單，只留上方小工具列（#panoBar）：標記開關、存成圖片、結束。
   - 標記（#panoL，畫在 fgSvg 最上層，大小跟著縮放換算成固定的螢幕大小）：
     橘圈＝還沒找到的物件（拉近才顯示名字）、藍＝提問的人、紅＝走失的目標、綠＝幫手、
     深綠＝幸運草（還沒冒出來時圈它躲的東西）、紫＝新關卡出口；秘境的故事角色也是紫。
   - 存成圖片：把 bgSvg＋fgSvg＋fogSvg 合成一張 SVG 畫到 canvas，跳出圖片（iPhone 長按存到照片）＋下載按鈕。 */
let panoMk=true,panoT=null;
const PANOCSS=document.createElement('style');PANOCSS.textContent=`body.panoOn #hud,body.panoOn #tray,body.panoOn #trayTip,body.panoOn #joy,body.panoOn .zpill{display:none!important}
#panoBar{position:absolute;left:50%;top:calc(env(safe-area-inset-top) + 10px);transform:translateX(-50%);z-index:8;display:none;gap:6px;align-items:center;background:var(--paper,#fffaf0);border:2.5px solid #2b2420;border-radius:16px;padding:6px 8px;box-shadow:0 3px 0 rgba(0,0,0,.18);font-size:14px;white-space:nowrap}
body.panoOn #panoBar{display:flex}#panoBar button{height:36px;border:2px solid #2b2420;border-radius:11px;background:#fffaf0;color:#2b2420;font-size:14px;padding:0 10px}#panoBar button.on{background:#f5c842}
#panoLg{position:absolute;left:50%;top:calc(env(safe-area-inset-top) + 62px);transform:translateX(-50%);z-index:8;display:none;background:rgba(255,250,240,.92);border:2px solid #2b2420;border-radius:12px;padding:3px 10px;font-size:12px;white-space:nowrap}
body.panoOn.panoMk #panoLg{display:block}#panoLg i{display:inline-block;width:10px;height:10px;border-radius:50%;border:2.5px solid;margin:0 3px 0 8px;vertical-align:-1px}
#panoImgOv .pcard{max-width:min(92vw,560px);max-height:88dvh;overflow:auto;text-align:center}#panoImgOv img{width:100%;border:2px solid #2b2420;border-radius:10px;-webkit-touch-callout:default;user-select:auto}`;
document.head.appendChild(PANOCSS);
(()=>{const b=document.createElement('button');b.id='panoBtn';b.className='hb';b.style.display='none';b.style.background='#d6e6f2';b.setAttribute('aria-label','全景（測試）');
 b.innerHTML=`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5"/><path d="M20 9V4h-5"/><path d="M4 15v5h5"/><path d="M20 15v5h-5"/><path d="M9 9l-5-5M15 9l5-5M9 15l-5 5M15 15l5 5"/></svg>`;
 b.onclick=()=>panoSet(!PANO);const w=$('#winBtn');w.parentNode.insertBefore(b,w);
 const bar=document.createElement('div');bar.id='panoBar';bar.innerHTML=`<b style="margin:0 2px">🧪 全景</b><button id="panoMkB" class="on">標記</button><button id="panoSaveB">📷 存圖</button><button id="panoExitB">✕ 結束</button>`;
 const lg=document.createElement('div');lg.id='panoLg';lg.innerHTML=`<i style="border-color:#f08a2a"></i>物件<i style="border-color:#2f6fd0"></i>提問<i style="border-color:#d8413a"></i>目標<i style="border-color:#3f9a3a"></i>幫手<i style="border-color:#1f6a3a;background:#bfe6a8"></i>幸運草<i style="border-color:#8a4fc0"></i>出口`;
 stage.appendChild(bar);stage.appendChild(lg);
 $('#panoMkB').onclick=()=>{panoMk=!panoMk;$('#panoMkB').classList.toggle('on',panoMk);document.body.classList.toggle('panoMk',panoMk);panoDraw()};
 $('#panoSaveB').onclick=()=>panoSave();$('#panoExitB').onclick=()=>panoSet(false)})();
function panoSet(on){if(on===PANO)return;const S=SEC();
 if(on&&!st.running){toast('開始這一關之後才能用全景',1600);return}
 PANO=on;document.body.classList.toggle('panoOn',on);document.body.classList.toggle('panoMk',on&&panoMk);
 if(S){S.pano(on)}else if(on)clockHold();else clockRun(false);
 measure();
 if(on){const SC=SCENES[scene]||SCENES[1];if(!S){view.s=minS;view.tx=0;view.ty=0;clampV();apply()}panoDraw();toast('🧪 全景：可以拖曳、縮放看整張\n點畫面不會找東西，計時暫停',2600)}
 else{const g=document.getElementById('panoL');if(g)g.remove();if(!S){clampV();apply()}}}
function panoPts(){const S=SEC(),P=[];
 const its=S?(S.all?S.all():items).filter(o=>!o.decoy):items;
 its.forEach(o=>{if(!o.found&&o.x!=null)P.push({x:o.x,y:o.y-10,c:'#f08a2a',t:o.t&&o.t.name,item:1})});
 if(S){const E=S.ent||{};const NM={giver:['#2f6fd0','提問的人'],target:['#d8413a','走失的目標'],helper:['#3f9a3a','幫手']};Object.keys(E).forEach(k=>{const e=E[k],m=NM[k]||['#8a4fc0',k];if(e&&e.x!=null)P.push({x:e.x,y:e.y-30,c:m[0],t:m[1],big:1})});
  const cl=S.clovers?S.clovers():{};['story','bonus'].forEach(k=>{const c=cl[k];if(c&&!c.found&&c.x!=null)P.push({x:c.x,y:c.y,c:'#1f6a3a',fill:'#bfe6a8',t:k==='story'?'故事幸運草':'隱藏幸運草',big:1})})}
 else{[['giver','#2f6fd0','提問的人'],['target','#d8413a','走失的目標'],['helper','#3f9a3a','幫手']].forEach(([k,c,t])=>{const sp=storySp[k];if(sp)P.push({x:sp.x,y:sp.y-(sp.h||50)*.45,c,t,big:1})});
  ['story','bonus'].forEach(k=>{const c=clovers[k];if(!c||c.found)return;const h=c.host,p=c.revealed||!h?[c.x,c.y]:[h.x,h.y-h.h*.4];P.push({x:p[0],y:p[1],c:'#1f6a3a',fill:'#bfe6a8',t:(k==='story'?'故事幸運草':'隱藏幸運草')+(c.revealed?'':'（躲在這裡）'),big:1})});
  for(const n of FIND_IDS){if(!exitOn(n))continue;const E=EXITS[n];P.push({x:E.x,y:E.y-30,c:'#8a4fc0',t:'出口：'+((LEVELS[n]&&LEVELS[n].title)||n),big:1})}}
 return P}
function panoDraw(){let g=document.getElementById('panoL');if(g)g.remove();if(!PANO||!panoMk)return;
 g=svgEl('g',{id:'panoL'},document.getElementById('fgSvg'));g.style.pointerEvents='none';
 let h='';for(const p of panoPts())h+=`<g class="pm" data-x="${p.x}" data-y="${p.y}"${p.item?' data-i="1"':''}><circle fill="${p.fill||'none'}" fill-opacity=".55" stroke="${p.c}"/>${p.t?`<text fill="${p.c}" stroke="#fffaf0" paint-order="stroke" font-weight="700">${String(p.t).replace(/</g,'&lt;')}</text>`:''}</g>`;
 g.innerHTML=h;panoSize()}
function panoSize(){const g=document.getElementById('panoL');if(!g)return;const k=1/view.s,show=view.s>=base*.75;
 g.querySelectorAll('.pm').forEach(m=>{const x=+m.dataset.x,y=+m.dataset.y,it=m.dataset.i,c=m.firstChild,t=m.children[1];
  c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',(it?11:16)*k);c.setAttribute('stroke-width',(it?3:4)*k);
  if(t){t.setAttribute('x',x+(it?13:19)*k);t.setAttribute('y',y+5*k);t.setAttribute('font-size',(it?12:14)*k);t.setAttribute('stroke-width',3*k);t.style.display=it&&!show?'none':''}})}
function panoSave(){const SC=SCENES[scene]||SCENES[1],x0=SC.x0-EX,y0=-EX,w=SC.x1-SC.x0+2*EX,h=(SC.y1||H)+2*EX;
 const k=Math.min(1.5,Math.sqrt(14e6/(w*h)));
 const part=id=>{const el=document.getElementById(id);if(!el)return '';const c=el.cloneNode(true);c.querySelectorAll('#lockWall.gone2,#fogCells,.fc.gone').forEach(e=>e.remove());
  let a='';for(const at of el.attributes)if(!/^(id|viewBox|width|height|class|style|xmlns)$/.test(at.name))a+=` ${at.name}="${at.value}"`;return `<g${a}>${c.innerHTML}</g>`};
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${x0} ${y0} ${w} ${h}" width="${Math.round(w*k)}" height="${Math.round(h*k)}"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#f4ede0"/>${part('bgSvg')}${part('fgSvg')}${part('fogSvg')}</svg>`;
 toast('🧪 正在合成圖片⋯',1500);
 const img=new Image();img.onload=()=>{try{const cv=document.createElement('canvas');cv.width=Math.round(w*k);cv.height=Math.round(h*k);cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
   cv.toBlob(bl=>{if(!bl){toast('圖片太大，存不了',2000);return}const url=URL.createObjectURL(bl);panoShow(url)},'image/png')}catch(e){console.error(e);toast('存圖失敗：'+e.message,2600)}};
 img.onerror=()=>toast('存圖失敗（圖片合成錯誤）',2600);
 img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}
function panoShow(url){let ov=document.getElementById('panoImgOv');if(!ov){ov=document.createElement('div');ov.className='overlay hide';ov.id='panoImgOv';document.body.appendChild(ov)}
 const nm=`全景-${(LEVELS[level]&&LEVELS[level].title)||level}.png`;
 ov.innerHTML=`<div class="pcard"><p style="margin:4px 0 8px">iPhone：長按圖片 →「加入照片」<br>電腦：按下面的「下載」</p><img src="${url}" alt="全景圖"><div style="display:flex;gap:8px;justify-content:center;margin-top:10px"><a class="pbtn" style="text-decoration:none;display:inline-block;padding:10px 18px" href="${url}" download="${nm}">下載</a><button class="sbtn" id="panoImgClose">關閉</button></div></div>`;
 ov.classList.remove('hide');document.getElementById('panoImgClose').onclick=()=>{ov.classList.add('hide');URL.revokeObjectURL(url)}}

document.getElementById('tClover').onclick=()=>cloverGo(clovers.story,'故事幸運草');
document.getElementById('tBonus').onclick=()=>cloverGo(clovers.bonus,'隱藏幸運草');
let colUnder=[];
function openCol(){if(BGBUSY){whenReady(openCol);return}let got=0,tot=0;const seen=new Set(),SEC=[];
 /* 2026-11-21w 使用者選 b：上面一排區域分頁，下面每關一列（進度條），點了才展開 12 格 */
 const row=(n,types,secret)=>{const L=LEVELS[n],m=MAPNODES.find(x=>x.n===n);let g_=0;
  const cells=types.map(t=>{const ok=!!COL.i[t.id];tot++;if(ok){got++;g_++}return `<div class="${ok?'':'no'}"><span class="ic">${icon(t.id)}</span>${ok?`<span>${t.short}</span>`:''}</div>`}).join('');   /* 2026-11-21w 收集冊 B 冒險手帳：拍立得卡片；使用者：沒找到的不寫字，改放灰色虛線輪廓（貼紙書 D 的剪影） */
  const op=COLOPEN.has(n),pc=types.length?Math.round(100*g_/types.length):0;
  return {n,g:groupOf(n),html:`<section class="colsec${secret?' secret':''}${op?' open':''}" data-n="${n}"><h4 role="button" aria-expanded="${op}"><span class="cnm">${secret?'🗝️ 秘境．':''}${m?m.name:'第 '+n+' 關'}</span><span class="cpb"><i style="width:${pc}%"></i></span><span class="cpn">${g_}/${types.length}</span><span class="cfl">${COL.c[n]?'🍀':''}${COL.b[n]?'✨':''}${STORIES[n]&&COL.s[n]?'📖':''}</span><span class="cgc">▾</span></h4>
  <div class="colin"><div class="clvrow"><span class="clv4 ${COL.c[n]?'':'no'}">🍀 ${COL.c[n]?'已找到':'還沒找到'}</span>${COL.b[n]?'<span class="clv4">✨ 隱藏幸運草</span>':''}</div><div class="colgrid">${cells}</div>${STORIES[n]?`<div class="storyrow ${COL.s[n]?'':'no'}">✏️ ${COL.s[n]?'寫下了：'+STORIES[n].title+' ✓':'小故事：還沒寫下來'}</div>`:''}</div></section>`}};
 if(COLTAB===null){COLTAB=groupOf(level).name;COLOPEN.add(level)}
 const rows=[];
 for(const n of openMain()){const L=LEVELS[n];if(!L||!L.types)continue;const fresh=L.types.filter(t=>!seen.has(t.id));fresh.forEach(t=>seen.add(t.id));rows.push(row(n,fresh,false))}
 for(const n of SECRET_IDS){if(!secretSeen(n))continue;const L=LEVELS[n];if(!L.types){ensureLevel(n,openCol);return}rows.push(row(n,L.types,true))}
 const GL=[];rows.forEach(r=>{if(!GL.includes(r.g))GL.push(r.g)});GL.sort((a,b)=>(a===SECGRP)-(b===SECGRP)||(a===OTHGRP)-(b===OTHGRP));
const RT=(window.TH&&TH.ROOM)?(TH.ROOM.tabs?TH.ROOM.tabs(n=>secretSeen(n)):[{name:'調酒',html:TH.ROOM.book?TH.ROOM.book(n=>secretSeen(n)):''}].filter(t=>t.html)):[],RB=RT.length,RN=RT.map(t=>t.name);   /* 2026-11-25j 調酒圖鑑：去過的酒吧才有「調酒」分頁；11-25 晚宴後廚加「料理」分頁（room.js 的 tabs） */
if(COLTAB!=='全部'&&!RN.includes(COLTAB)&&!GL.some(g=>g.name===COLTAB))COLTAB='全部';
 const tabs=['全部',...GL.map(g=>g.name),...RN].map(t=>`<button class="ctab${t===COLTAB?' on':''}" data-t="${t}">${t}</button>`).join('');
 $('#colBody').innerHTML=`<div class="ctabs">${tabs}</div><div class="colscroll">`+rows.map(r=>r.html.replace('<section ',`<section data-g="${r.g.name}"${COLTAB==='全部'||r.g.name===COLTAB?'':' hidden'} `)).join('')+RT.map(t=>`<section class="colsec dbsec" data-g="${t.name}"${COLTAB===t.name?'':' hidden'}>${t.html}</section>`).join('')+`</div>`;   /* 2026-11-22b 使用者：收集冊大小固定、表頭＋標籤列凍結，只有 .colscroll 捲動 */
 $('#colSub').textContent=`已收集 ${got} / ${tot} 種東西（每種只記一次）`;
 document.querySelectorAll('#colBody .ctab').forEach(b=>b.onclick=()=>{COLTAB=b.dataset.t;document.querySelectorAll('#colBody .ctab').forEach(x=>x.classList.toggle('on',x===b));document.querySelectorAll('#colBody .colsec').forEach(x=>x.hidden=!(x.dataset.g===COLTAB||(COLTAB==='全部'&&!RN.includes(x.dataset.g))));const sc=$('#colBody .colscroll');if(sc)sc.scrollTop=0});
 if(RB&&TH.ROOM.bind)TH.ROOM.bind($('#colBody'));
 document.querySelectorAll('#colBody .colsec h4').forEach(h=>h.onclick=()=>{const sec=h.parentNode,n=+sec.dataset.n,on=sec.classList.toggle('open');h.setAttribute('aria-expanded',on);on?COLOPEN.add(n):COLOPEN.delete(n)});
 if(!$('#colOv').classList.contains('hide'))return;
 colUnder=['startOv','winOv'].filter(id=>!$('#'+id).classList.contains('hide'));colUnder.forEach(id=>$('#'+id).classList.add('hide'));$('#colOv').classList.remove('hide')}
document.getElementById('colBtn').onclick=()=>{closeMenu&&closeMenu();openCol()};
/* 2026-11-21w 使用者：冒險地圖要有地方切換到收集冊 → 地圖表頭加「📖 收集冊」、收集冊表頭加「🗺️ 地圖」，互相切換（底下原本的開始／過關畫面跟著交接，關掉後照樣回來） */
(()=>{const mk=(id,txt,lab)=>{const b=document.createElement('button');b.id=id;b.className='mswap';b.type='button';b.innerHTML=txt;b.setAttribute('aria-label',lab);return b};
 const toCol=mk('mapToCol','📖 收集冊','切換到收集冊'),toMap=mk('colToMap','🗺️ 地圖','切換到冒險地圖');
 const mc=document.getElementById('mapClose');if(mc)mc.parentNode.insertBefore(toCol,mc);const cc=document.getElementById('colClose');if(cc)cc.parentNode.insertBefore(toMap,cc);
 toCol.onclick=()=>whenReady(()=>{const u=mapUnder;mapUnder=[];$('#mapOv').classList.add('hide');openCol();colUnder=u.concat(colUnder.filter(x=>!u.includes(x)))});
 toMap.onclick=()=>whenReady(()=>{const u=colUnder;colUnder=[];$('#colOv').classList.add('hide');openMap();mapUnder=u.concat(mapUnder.filter(x=>!u.includes(x)))})})();
document.getElementById('colClose').onclick=()=>{$('#colOv').classList.add('hide');colUnder.forEach(id=>$('#'+id).classList.remove('hide'));colUnder=[]};
/* ================= 拆檔關卡載入 ================= */
const loadedLv={};
/* ===== 2026-11-21w 遊戲讀取 =====
   使用者：關卡越來越多，開機要一個一個載入很久；載入中不能讓玩家按到按鈕（可能出 bug）。
   ①開機先只載「現在這一關要用的」：主線 1～已解鎖（物件互借、老朋友要用）＋這一關的出口／秘境；其他（找路關卡、秘境）進遊戲後在背景載。
   ②所有檔案先用 <link rel=preload> 同時下載，再照原本的順序執行（比一個等一個快很多）。
   ③載入中蓋一層「遊戲讀取中」：開機時一定蓋；背景還沒載完時按地圖、收集冊、換關卡，也先蓋著等載完再繼續。 */
const PRELOADED=new Set();
function preload(ns){ns.forEach(n=>{const L=LEVELS[n];if(!L||!L.file||L.types||loadedLv[n]==='ok')return;[L.pre,L.file].forEach(src=>{if(!src||PRELOADED.has(src))return;PRELOADED.add(src);const l=document.createElement('link');l.rel='preload';l.as='script';l.href=src;document.head.appendChild(l)})})}
let BGBUSY=false,BGWAIT=[],LOADP=[0,1];
function loadOv(on){let o=document.getElementById('loadOv');
 if(!o){o=document.createElement('div');o.id='loadOv';   /* 2026-11-22c 使用者選 D 點亮提燈：夜晚提燈＋5 盞小燈（進度），主標題「故事即將開始⋯」 */
  o.innerHTML='<div class="lcardL"><svg class="lamp" viewBox="0 0 200 230" aria-hidden="true"><circle cx="100" cy="120" r="96" fill="url(#lgl)"/><defs><radialGradient id="lgl"><stop offset="0" stop-color="#ffd36a" stop-opacity=".9"/><stop offset=".55" stop-color="#ff9a3c" stop-opacity=".3"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient></defs><path d="M76 40 q24 -32 48 0" fill="none" stroke="#e8c49a" stroke-width="5" stroke-linecap="round"/><path d="M68 62 L132 62 L142 82 L58 82 Z" fill="#7a4a2c" stroke="#2b2420" stroke-width="2.5" stroke-linejoin="round"/><path d="M62 82 L138 82 L150 186 L50 186 Z" fill="#ffe9a8" stroke="#2b2420" stroke-width="2.5" stroke-linejoin="round"/><path d="M100 82 L100 186 M76 82 L74 186 M124 82 L126 186" stroke="#2b2420" stroke-width="2" opacity=".5"/><g class="fl"><path d="M100 112 Q78 146 100 170 Q122 146 100 112Z" fill="#f5a03a" stroke="#2b2420" stroke-width="2"/><path d="M100 136 Q90 154 100 166 Q110 154 100 136Z" fill="#ffe27a"/></g><path d="M44 186 L156 186 L148 208 L52 208 Z" fill="#7a4a2c" stroke="#2b2420" stroke-width="2.5" stroke-linejoin="round"/><g fill="#ffe27a"><circle cx="24" cy="170" r="3.5" class="ff"/><circle cx="178" cy="110" r="3" class="ff f2"/><circle cx="20" cy="96" r="2.6" class="ff f3"/><circle cx="184" cy="190" r="3.5" class="ff f4"/></g></svg><div class="lamps"><i></i><i></i><i></i><i></i><i></i></div><div class="lt">故事即將開始⋯</div><small>燈火正一盞盞點起來，請稍等</small></div>';document.body.appendChild(o)}
 o.classList.toggle('on',!!on);loadBar()}
function loadBar(){const r=Math.min(1,LOADP[0]/Math.max(1,LOADP[1])),n=Math.max(1,Math.round(5*r));document.querySelectorAll('#loadOv .lamps i').forEach((e,k)=>e.classList.toggle('on',k<n))}
function whenReady(fn){if(!BGBUSY){fn();return true}if(!BGWAIT.length)loadOv(true);BGWAIT.push(fn);return false}
/* 照順序一個一個執行 steps（每一步是 cb=>…），每做完一步更新讀取條 */
function runSteps(steps,done){LOADP=[0,steps.length];loadBar();const next=()=>{if(!steps.length){done();return}const f=steps.shift();f(()=>{LOADP[0]++;loadBar();next()})};next()}
function ensureLevel(n,cb,fail){const L=LEVELS[n];if(!L||!L.file||L.types||loadedLv[n]==='ok'){cb();return}
 if(L.pre&&loadedLv['pre:'+L.pre]!=='ok'){const k='pre:'+L.pre;if(loadedLv[k]&&loadedLv[k].push){loadedLv[k].push(()=>ensureLevel(n,cb,fail));return}
  loadedLv[k]=[()=>ensureLevel(n,cb,fail)];const ps=document.createElement('script');ps.src=L.pre;ps.onload=()=>{const q=loadedLv[k];loadedLv[k]='ok';q.forEach(c=>c())};
  ps.onerror=()=>{loadedLv[k]=null;ps.remove();setTimeout(()=>toast(`找不到 ${L.pre}，請確認它和 index.html 放在同一個資料夾`,4200),1500);fail&&fail()};document.head.appendChild(ps);return}
 if(loadedLv[n]&&loadedLv[n].push){loadedLv[n].push([cb,fail]);return}
 loadedLv[n]=[[cb,fail]];const sc=document.createElement('script');sc.src=L.file;
 sc.onload=()=>{const q=loadedLv[n];loadedLv[n]='ok';q.forEach(([c])=>c())};
 sc.onerror=()=>{const q=loadedLv[n];loadedLv[n]=null;sc.remove();setTimeout(()=>toast(`找不到 ${L.file}，請確認它和 index.html 放在同一個資料夾`,4200),1500);q.forEach(([,fl])=>fl&&fl())};
 document.head.appendChild(sc)}
/* 主線關卡 n 載好之後，把出發地是 n 的秘境也載進來（秘境入口寫在秘境自己的檔案） */
function ensureFull(n,cb){ensureLevel(n,()=>{const S=SECRET_IDS.filter(s=>LEVELS[s].home===n).concat(FIND_IDS.filter(m=>LEVELS[m].find.from===n&&(canFind(m)||isFound(m)))),next=()=>S.length?ensureLevel(S.shift(),next,next):cb();next()},cb)} /* 出口在這一關的新關卡（find）也一起載入 */
function ensureUpTo(m,cb){const need=[];for(let n=1;n<=m;n++)if(LEVELS[n]&&LEVELS[n].file)need.push(n);
 const next=()=>need.length?ensureFull(need.shift(),next):cb();next()}
/* ================= boot（index.html 載入 core.js、art.js、levels.js 之後呼叫） ================= */
function boot(){
/* 單關測試頁（index.html?test=關卡編號；test.html 會轉過來）：進度只存在記憶體，直接開到那一關，測試模式自動打開 */
const TL=window.TEST_LEVEL;
if(TL){const L=LEVELS[TL];if(!L){$('#loading').textContent=`levels.js 裡沒有第 ${TL} 關：請先在 levels.js 加一行 addLevel({n:${TL},…})`;return}
 const chain=[];if(L.find){let a_=TL;while(LEVELS[a_]&&LEVELS[a_].find){chain.unshift(a_);a_=findAfter(a_)}}const top=L.secret?L.home:L.find?findAfter(chain[0]):TL;prog={unlocked:top,found:chain.slice()};RODE=LEVELS.map((L_,n)=>L_&&n).filter(n=>n&&(n<=top||chain.includes(n)));testMode=true;
 try{localStorage.setItem('townhunt-test','1');localStorage.setItem('townhunt-secret-tip','1');for(let n=1;n<(L.find?top+1:top);n++)localStorage.setItem('townhunt-stars-L'+n,'2');chain.slice(0,-1).forEach(n=>localStorage.setItem('townhunt-stars-L'+n,'2'));if(L.secret)localStorage.setItem('townhunt-best-L'+L.home,'600')}catch(_){}
 const bn=document.createElement('div');bn.id='testBanner';bn.textContent='🧪 單關測試：'+L.title+'（進度不會保存）';
 Object.assign(bn.style,{position:'fixed',left:'50%',bottom:'calc(env(safe-area-inset-bottom) + 2px)',transform:'translateX(-50%)',zIndex:60,background:'#6a5aa8',color:'#fff',font:'12px/1.6 sans-serif',padding:'0 10px',borderRadius:'9px',pointerEvents:'none',whiteSpace:'nowrap'});document.body.appendChild(bn)}
/* 舊玩家補解鎖：已解鎖的最後一關若曾拿到 2 顆星以上，開遊戲時直接開放下一關 */
if(!TL){const before=prog.unlocked;while(linNext(prog.unlocked)&&starsOf(prog.unlocked)>=NEED_STARS)prog.unlocked++;
 if(prog.unlocked>before){saveProg();setTimeout(()=>{const m=MAPNODES.find(m=>m.n===prog.unlocked);toast(`新地點開放：${m?m.name:'新地點'}，打開冒險地圖出發吧！`,3600)},1200)}}
level=Math.min(prog.unlocked,LEVELS.length-1);
/* 給 level{n}.js、secret.js 使用的工具與資料 */
window.TH={MAPC,NSPOT,NLAKE,NPEAK,EDGELAND,ROADS,T,f,r,sr,pk,ri,rnd,shuffle,limb,shade,wob,OL,SNOW,SKIN,HAIR,SHIRT,PANTS,HATS,kid,chibi,act,wrapAn,heart,bubble,noteM,peekHead,faceHead,headOnly,
 cat,frog,owl,sheep,chicken,anyDog,dog,swan,pine,roundTree,bush,rock,barrel,crate,pot,lamp,bench,sign,fence,reeds,lily,well,tent,campfire,swirl,signpost,signIcon,stall,
 add,mark,canPlace,scatter,SCATREG,SCATOK,skyBirds,chaikin,bow,qBubble,qThink,qMark,QHEART,GC,GR,CELL,occ,mulberry32,DK,balloon,castle,fountain,house,kayak,lighthouse,mushHouse,rowboat,sailboat,tower,windmill,pig,barn,KIND,POOL,VPLAN:VPLANX,REG,SCREG,SCENES,LEVELS,ART,DECOY,BORROW,TARGET,MAPNODES,OCCK,DECOYSKIP,HEAVY,ANIM,ALWAYS,DUR,
 ANIMX,ALWAYSX,HEAVYX,SPOTS,BLEND,SCENE_IMPL,WATERFN,RIDES,MAPHOOKS,mapHook,mapRoute,TAPHOOKS,NGHOOKS,MAPTOP,NEXTINFO,HERE,HOSTK,HOSTN,ferry,OUTFITS,SECRETS,STORIES,SEQ,SKYC,SKYY,FOGFN,EDGEM,EDGED,EDGEDECO,EDGEMY,EDGEFILL,FRINGE,FRINGEX,RESERVE,ROADK,RESETKEYS,BEENF,canDiscover,dayLog,icon,starSvg,HATKIT,EXITS,FIND_IDS,isOpen,isFound,canFind,askExit:n=>askExit(n),drawExits:()=>drawExits(),prog:()=>prog,
 typeOf:id=>LEVELS.slice(1).flatMap(L_=>L_.types||[]).find(t=>t.id===id),colAdd,colClover,colBonus,colStory,reunionCard:(S,cb)=>reunionCard(S,cb),updateCounts,win:()=>win(),goLevel:(n,viaExit)=>goLevel(n,viaExit),level:()=>level,rodeHas,pads:()=>pads(),scr:()=>({w:SW,h:SH,base}),apply:()=>apply(),clampV:()=>clampV(),rezoom:()=>{measure();clampV();apply()},updAnim:()=>updateAnim(),tweenTo:(s,x,y,d,cb)=>tweenTo(s,x,y,d,cb),curtain,pickView,walkPose,DENS,sprites,ride,toast,clockHold,clockRun,burst,floatText,sfx,items:()=>items,game:()=>st,scene:()=>scene,view:()=>view,testOn:()=>testMode,dbg:{clover:()=>clovers,hint:()=>({sp:hintSp,msg:hintMsg}),step:()=>story&&story.step,storySp:()=>storySp,story:()=>story,center:(x,y)=>{view.s=base*1.4;view.tx=SW/2-x*view.s;view.ty=SH/2-y*view.s;clampV();apply();const r=stage.getBoundingClientRect();return [r.left+x*view.s+view.tx,r.top+y*view.s+view.ty]}},isWater:(x,y)=>isWater(x,y),tone,steamPuff,pineS,cabinSVG};
/* 測試模式：選單列出測試中的關卡（編號 900 以上、還沒接上主線的主線關卡），在 Claude 作品裡也能直接玩（2026-11-12） */
LEVELS.forEach((L_,n)=>{if(!L_||((n<900||L_.secret)&&!L_.room)||document.getElementById('tLv'+n))return; /* 2026-11-24h 室內小關卡（還沒有入口）也列在測試選單 */const b=document.createElement('button');b.id='tLv'+n;b.className='tbtn';b.style.display='none';b.innerHTML=`<span>🧪 測試中的關卡：${L_.title}</span>`;
 b.onclick=()=>{closeMenu();toast('🧪 載入測試中的關卡⋯',1400);ensureUpTo(899,()=>goLevel(n))};const a=document.getElementById('tGiver');a.parentNode.insertBefore(b,a);
 const sb=document.createElement('button');sb.id='tLvS'+n;sb.className='sbtn tbtn';sb.style.cssText='display:none;flex:none;margin-top:6px';sb.textContent='🧪 玩測試中的關卡：'+L_.title;sb.onclick=b.onclick;const row=document.querySelector('#startOv .testrow');if(row)row.appendChild(sb)});
applyTestUI();
/* 2026-11-21w 開機讀取（見上面「遊戲讀取」）：第一段只載主線 1～已解鎖＋現在這一關的出口與秘境，第二段在背景載其他 */
loadOv(true);
const MAIN=[];for(let n=1;n<=prog.unlocked;n++)if(LEVELS[n]&&LEVELS[n].file)MAIN.push(n);
const FOUND=prog.found.filter(n=>LEVELS[n]&&LEVELS[n].file);
const extras=m=>SECRET_IDS.filter(s=>LEVELS[s].home===m).concat(FIND_IDS.filter(x=>LEVELS[x].find.from===m&&(canFind(x)||isFound(x))));
while(level>1&&!rodeHas(level))level--;
preload(MAIN.concat(extras(level)));
/* 測試模式（?test=n）照原本一次全部載完 */
const phase1=TL?MAIN.map(n=>cb=>ensureFull(n,cb)).concat(FOUND.map(n=>cb=>ensureFull(n,cb))):MAIN.map(n=>cb=>ensureLevel(n,cb,cb)).concat([cb=>ensureFull(level,cb)]);
runSteps(phase1,go);
function go(){while(level>1&&!rodeHas(level))level--;while(level>1&&!LEVELS[level].types)level--;if(!LEVELS[1].types){loadOv(false);$('#loading').textContent='找不到 level1.js，請確認它和 index.html 放在同一個資料夾';return}setLevel(level);
setTimeout(()=>{
 loadScene(level);$('#loading').remove();
 drawCells();measure();placeItems();updateCounts();{const c=LEVELS[level].c;view={s:base,tx:SW/2-c[0]*base,ty:SH/2-c[1]*base}}clampV();apply();reveal(true);
 loadOv(false);
 if(TL){if(TL!==level)setTimeout(()=>goLevel(TL),300);return} /* 測秘境：先進出發地，再進秘境 */
 /* 第二段：背景載其他關卡（已經載過的會直接跳過）。載完之前按地圖、收集冊、換關卡會先蓋「遊戲讀取中」 */
 const rest=MAIN.concat(FOUND);preload(rest.concat(...rest.map(extras)));BGBUSY=true;
 /* 2026-11-21w 使用者：第 10 關之後（第 10 關過關過），打開遊戲先顯示冒險地圖，邀請玩家選一個地方探險（背景載完才打開，期間蓋讀取畫面） */
 if(starsOf(10)>=1){MAPINVITE=1;openMap()}
 setTimeout(()=>runSteps(rest.map(n=>cb=>ensureFull(n,cb)),()=>{BGBUSY=false;const w=BGWAIT;BGWAIT=[];loadOv(false);w.forEach(f=>{try{f()}catch(e){console.error(e)}})}),400);
},30)}}
