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
const RESERVE={},ROADK={},RESETKEYS=[];
/* 冒險地圖上的一層：z 越小越先畫（越下面）。沒設 z 的當作 2。第 1～3 關：小鎮→農莊的路 0、纜車與雪山 1、第 4、5 關 2、小鎮 3、農莊 4 */

/* 冒險地圖路線（2026-11-11 使用者選 D「桌遊點點路」）：一顆顆圓點。t＝'road' 陸路／'sea' 海路／'rail' 鐵路。
   關卡的 mapHook／MAPHOOKS 畫路線一律用 H.mapRoute(d,t,ink)，全部關卡的路線就會一樣。 */
function mapRoute(d,t,ink){ink=ink||'#2b2420';
 const P=(w,c,gap)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray=".1 ${gap}"/>`;
 if(t==='sea')return P(3.6,'#fffaf0',8)+P(2,'#4f86b0',8);
 if(t==='rail')return P(4.6,ink,7)+P(2.6,'#f0c040',7);
 return P(5,ink,8)+P(3,'#f3e2b0',8)}
function mapHook(z,fn){fn.z=z;MAPHOOKS.push(fn);return fn}
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
const DENS={};/* 佈景密度倍數：各關檔案自己設 DENS[關卡] */
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
 let svg=T(x,y,o.s||1,inner,o.fl);
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
  if(isDecoy(kind)&&r()<.3){n++;continue} /* 干擾物減少 30%，空出來不補 */
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
  for(let i=0;i<4;i++){
   let p=null,mode='old';
   if(how[i]==='spot'){p=spotPos(t,spotUse,regs);if(p)mode='spot'}
   else if(how[i]==='blend'){p=blendPos(t,usedOcc,regs);if(p)mode='blend';else{mode='rand';for(let k=0;k<60&&!p;k++){const c=sampleIn(regs[(i+k)%regs.length],t);if(c&&!items.some(o=>Math.hypot(o.x-c.x,o.y-c.y)<60))p=c}}}
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
   items.push({t,x:p.x,y:p.y,float:!!p.float,occ:p.occ||null,r:t.r,rot:rnd(-t.rot,t.rot),sc:rnd(.85,1.02),fl:Math.random()<.5,found:false,how:mode});
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
const storyThink=S=>{if(!S)return '';if(story&&story.done)return qThink(QHEART,16,16);return qMark()};
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
  if(story.done){toast(role==='giver'?`${S.who}：謝謝你幫忙！`:'牠現在很開心～',1600);return true}
  const want=SEQ[story.step];
  if(role===want){const msg=[S.ask,S.need,S.got,S.ok][story.step];story.step++;
   if(story.step>=SEQ.length){finishStory();return true}
   toast(msg,4200);storyBubble();if(story.step===3)sfx.found();return true}
  // 順序不對：給提示，不扣分
  const hint=role==='giver'?(story.step===0?S.ask:`${S.who}：拜託你了，${story.step>=4?'快帶回來給我！':'找到了嗎？'}`)
   :role==='target'?(story.step===0?'這是誰家的寶貝？好像有人在找牠⋯':story.step===2?S.need:'牠乖乖跟著你，快帶回去吧！')
   :(story.step<2?'（看起來正在忙⋯也許之後會需要幫忙）':'已經幫過你囉！');
  toast(hint,3200);if(story.step===0&&role==='giver')story.step=1;return true}
 for(const c of [clovers.story,clovers.bonus]){if(c&&!c.revealed&&!c.found&&sp===c.host){if(c.kind==='story'&&!(story&&story.done))return false;revealClover(c);return true}}
 if(sp.say){toast(sp.say,1800);return true} /* 看板不寫字，點了才跳出名稱（2026-11-11） */
 return false}
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
  const sx=it.fl&&it.t.id!=='letter'?-it.sc:it.sc;
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
let SW=1,SH=1,base=.6,minS=.3,maxS=2,view={s:.6,tx:0,ty:0};
function measure(){const r_=stage.getBoundingClientRect();SW=r_.width;SH=r_.height;base=Math.min(SW,SH*.8)/640*1.2;minS=base;maxS=base*2.8;{const S=SEC();if(S&&(S.pano()||(S.cine&&S.cine())))minS=base*.28}} /* 開場比原本大 1.2 倍；最多只能縮回開場大小，不能拉遠看全圖 */
function clampV(){view.s=Math.max(minS,Math.min(maxS,view.s));const s_=view.s,SC=SCENES[scene]||SCENES[1];
 view.tx=Math.min(-(SC.x0-EX)*s_,Math.max(SW-(SC.x1+EX)*s_,view.tx));const P=pads();view.ty=Math.min(EX*s_+P.t,Math.max(SH-((SC.y1||H)+EX)*s_-P.b,view.ty))}
function pads(){const hd=document.getElementById('hud'),tr=document.getElementById('tray');return{t:hd?hd.offsetTop+hd.offsetHeight+6:0,b:tr?tr.offsetHeight:0}}
let crispT;
let spEls=[],animT;
function updateAnim(){const m=80,x0=-view.tx/view.s-m,y0=-view.ty/view.s-m,x1=(SW-view.tx)/view.s+m,y1=(SH-view.ty)/view.s+m;
 for(const o of spEls){const v=o.x>x0&&o.x<x1&&o.y>y0&&o.y<y1+60;if(v!==o.on){o.on=v;o.el.classList.toggle('on',v)}}}
const fogW=document.getElementById('fogWorld');
function apply(){world.style.transform=fogW.style.transform=`translate(${view.tx}px,${view.ty}px) scale(${view.s})`;reveal();clearTimeout(crispT);crispT=setTimeout(crisp,260);clearTimeout(animT);animT=setTimeout(updateAnim,120)}
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
const clearPts=()=>{pts.clear();pinch=null;tap=null};
stage.addEventListener('pointerdown',e=>{if(e.target.closest('.zpill'))return;rect=stage.getBoundingClientRect();try{stage.setPointerCapture(e.pointerId)}catch(_){}
 if(e.isPrimary&&pts.size)clearPts();
 pts.set(e.pointerId,loc(e));if(pts.size===1){const p=loc(e);tap={id:e.pointerId,x:p.x,y:p.y,t:performance.now(),moved:false}}else{tap=null;startPinch()}});
function startPinch(){const[a,b]=[...pts.values()];const m={x:(a.x+b.x)/2,y:(a.y+b.y)/2};pinch={d0:Math.hypot(a.x-b.x,a.y-b.y)||1,s0:view.s,wx:(m.x-view.tx)/view.s,wy:(m.y-view.ty)/view.s}}
stage.addEventListener('pointermove',e=>{const p=pts.get(e.pointerId);if(!p)return;const n=loc(e),dx=n.x-p.x,dy=n.y-p.y;p.x=n.x;p.y=n.y;
 if(pts.size===1){if(tap&&!tap.moved&&Math.hypot(n.x-tap.x,n.y-tap.y)>8)tap.moved=true;if(!tap||tap.moved){if(CAMLOCK())return;view.tx+=dx;view.ty+=dy;clampV();apply()}}
 else if(pts.size>=2&&pinch&&!CAMLOCK()){const[a,b]=[...pts.values()];const d=Math.hypot(a.x-b.x,a.y-b.y),m={x:(a.x+b.x)/2,y:(a.y+b.y)/2};
  view.s=Math.max(minS,Math.min(maxS,pinch.s0*d/pinch.d0));view.tx=m.x-pinch.wx*view.s;view.ty=m.y-pinch.wy*view.s;clampV();apply()}});
function endPtr(e){if(!pts.has(e.pointerId))return;pts.delete(e.pointerId);
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
const icon=id=>`<svg viewBox="-21 -21 42 42"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${ART[id]}</g></svg>`;
const leftOf=id=>items.filter(it=>!it.found&&(!id||it.t.id===id)).length;
function renderTray(){$('#chips').innerHTML=TYPES.map(t=>`<button class="chip" data-t="${t.id}" aria-label="${t.name}"><span class="ic">${icon(t.id)}<span class="ok">✓</span></span><span class="dots">${'<i></i>'.repeat(PER())}</span></button>`).join('');
 $('#chips').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{const t=TYPES.find(x=>x.id===b.dataset.t),n=leftOf(t.id);trayTip(b,SEC()?(n?`${t.name}：找到 ${PER()-n} / ${PER()}`:`${t.name}：找齊了 ✓`):n?`${t.name}：還有 ${n} 個`:`${t.name}：全部找到了 ✓`)})}
/* 點下方列的物件：說明直接顯示在那個物件正上方，不跑到畫面最上面 */
let trayTipT;function trayTip(chip,msg){const tray=$('#tray');let el=document.getElementById('trayTip');if(!el){el=document.createElement('div');el.id='trayTip';tray.appendChild(el)}
 el.textContent=msg;const tr=tray.getBoundingClientRect(),cr=chip.getBoundingClientRect(),cx=cr.left+cr.width/2-tr.left;el.style.left='0px';el.classList.add('show');
 const w=el.offsetWidth,L=Math.max(w/2+8,Math.min(tr.width-w/2-8,cx));el.style.left=L+'px';el.style.setProperty('--ax',(cx-L+w/2)+'px');
 clearTimeout(trayTipT);trayTipT=setTimeout(()=>el.classList.remove('show'),1800)}
function updateCounts(bump){const tot=TYPES.length*PER(),got=tot-leftOf();$('#foundN').textContent=got;$('#foundTxt').textContent=`${got} / ${tot}`;$('#trayProg').textContent=`${got}/${tot}`;
 const C=2*Math.PI*18;$('#ringArc').setAttribute('stroke-dasharray',`${f(C*got/tot)} ${f(C)}`);
 TYPES.forEach(t=>{const n=leftOf(t.id),c=$(`.chip[data-t="${t.id}"]`);if(!c)return;if(n===0&&!c.classList.contains('done'))$('#chips').appendChild(c);c.classList.toggle('done',n===0);c.querySelectorAll('.dots i').forEach((d,k)=>d.classList.toggle('on',k<PER()-n))});
 if(bump){const c=$(`.chip[data-t="${bump}"]`);if(c){c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump');if(!c.classList.contains('done'))c.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'})}}}

/* ================= game ================= */
let prog={unlocked:1};try{const pp=JSON.parse(localStorage.getItem('townhunt-prog')||'{}');if(pp.unlocked)prog.unlocked=pp.unlocked}catch(_){}
const saveProg=()=>{try{localStorage.setItem('townhunt-prog',JSON.stringify(prog))}catch(_){}};
const unlockedW=()=>prog.unlocked>=2?W:1800;
const NEED_STARS=2;
/* 關卡清單：levels.js 用 addLevel({…}) 一關一行登記（LEVELS、冒險地圖名稱 MAPNODES、下一站預告 NEXTINFO） */
const LEVELS=[null],MAPNODES=[];
const SECRET_IDS=[],SECRETS={};
function addLevel(L){const {map,next,...o}=L;LEVELS[o.n]={types:null,...o};if(map)MAPNODES.push({n:o.n,...map});if(next)NEXTINFO[o.n]=next;if(o.secret)SECRET_IDS.push(o.n)}
const SEC=()=>LEVELS[level]&&LEVELS[level].secret&&scene===level&&SECRETS[level]?SECRETS[level]:null;
const CAMLOCK=()=>{const S=SEC();return !!(S&&!S.pano())};
const PER=()=>(LEVELS[level]&&LEVELS[level].per)||4;
/* 過場只在第一次前往時播放；記錄已看過的過場（第一次更新時，先把原本已解鎖的關卡記成看過） */
let RODE=[];try{const v=localStorage.getItem('townhunt-rode');RODE=v?JSON.parse(v):[...Array(prog.unlocked)].map((_,i)=>i+1);if(!v)localStorage.setItem('townhunt-rode',JSON.stringify(RODE))}catch(_){}
/* 秘境的卡片（冒險地圖下方、收集冊）：要「確實去過」才出現——秘境檔自己給 LEVELS[n].seen()（例：復活島＝完成海圖任務並真的上島），
   沒給就看有沒有玩過的紀錄（best／stars）。2026-11-10 使用者要求，不再只看 RODE（RODE 在出發前就記了） */
const secretSeen=n=>{const L=LEVELS[n];if(!L)return false;if(L.seen)return !!L.seen();try{return !!(localStorage.getItem('townhunt-best-L'+n)||localStorage.getItem('townhunt-stars-L'+n))}catch(_){return false}};
const rodeHas=n=>n<=1||RODE.includes(n),rodeAdd=n=>{if(!RODE.includes(n)){RODE.push(n);try{localStorage.setItem('townhunt-rode',JSON.stringify(RODE))}catch(_){}}};
let level=1;
function setLevel(n){level=n;document.body.classList.toggle('secret',!!(LEVELS[n]&&LEVELS[n].secret));TYPES=typesFor(n);renderStart();renderTray()}
let howOrig=null,ruleOrig=null;
function renderStart(){const L=LEVELS[level];{const hd=document.querySelector('#startOv .shead');if(hd){hd.querySelector('b').textContent=`這一關要找的 ${TYPES.length} 樣東西`;hd.querySelector('span').textContent=`每樣 ${L.per||4} 個`}
  const how=document.querySelector('#startOv .how'),rule=document.querySelector('#startOv .rule');if(howOrig===null){howOrig=how.innerHTML;ruleOrig=rule.innerHTML}
  const SX=L.secret&&SECRETS[level];how.innerHTML=SX&&SX.how?SX.how:howOrig;rule.innerHTML=SX&&SX.rule?SX.rule:ruleOrig;$('#startBtn').textContent=SX?'開始探險':'開始尋找'}$('#startTitle').textContent=L.title;$('#startDesc').innerHTML=borrowed.length?`這次<b>${borrowed.map(t=>t.short).join('、')}</b>也跑來這裡了！`:'';
 $('#startGrid').innerHTML=TYPES.map(t=>`<div><span class="t">${icon(t.id)}</span>${t.short}</div>`).join('');
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
function applyTestUI(){document.querySelectorAll('.tbtn').forEach(b=>b.style.display=testMode?'':'none');$('#testBadge').style.display=testMode?'':'none';$('#winBtn').style.display=testMode?'':'none';$('#resetBtn').style.display=testMode?'':'none';setHintUI()}
function newGame(keepView){const S=SEC();
 if(S){items=S.items();clovers={story:null,bonus:null};itemsL.innerHTML='';marks.innerHTML='';fx.innerHTML=''}else{placeItems();placeClover();renderItems()}
 story={step:0,done:false};storyBubble();renderTray();updateCounts();
 st={running:true,t0:performance.now(),hintsLeft:HINTS,misses:0,clover:false,bonus:false};setHintUI();
 measure();if(S)S.start();else if(!keepView){const c=LEVELS[level].c;view={s:base,tx:SW/2-c[0]*base,ty:SH/2-c[1]*base}}clampV();apply();reveal(true);clearInterval(timer);timer=setInterval(tick,250);tick();
 NGHOOKS.forEach(h=>{try{h(scene)}catch(e){console.error(e)}});pickSecretHint()}
/* 秘境提示（2026-11-11 使用者要求）：玩家過關過的關卡裡，如果還有沒完成的秘境，每局隨機挑「一位」頭上是「…」的路人，
   點他會說一句那個秘境的提示（一局只有一位，免得太雜）。秘境在 levels.js 的 addLevel 加 hint:['…','…'] 就會自動加入。
   條件：這一關過關過（有 best）、秘境的出發地過關過、秘境還沒過關。挑人在 newGame 最後做，不影響物件和場景的亂數。 */
const DOTSIG='cx="-6" cy="-1" r="1.7"';let hintSp=null,hintMsg='';
function pickSecretHint(){hintSp=null;hintMsg='';if(SEC())return;if(!(bestOf(level)>0))return;
 const cand=SECRET_IDS.filter(n=>{const L=LEVELS[n];return L&&L.hint&&L.hint.length&&!(bestOf(n)>0)&&bestOf(L.home)>0});if(!cand.length)return;
 const ppl=sprites.filter(s=>s.svg&&s.svg.includes(DOTSIG)&&s!==storySp.giver&&s!==storySp.helper);if(!ppl.length)return;
 const R=Math.random;hintSp=ppl[Math.floor(R()*ppl.length)];const L=LEVELS[cand[Math.floor(R()*cand.length)]];hintMsg=L.hint[Math.floor(R()*L.hint.length)]}
function tapSecretHint(wx,wy){const sp=hintSp;if(!sp||!(Math.abs(wx-sp.x)<sp.w*.5&&wy<=sp.y+4&&wy>=sp.y-sp.h))return false;
 toast('💬 '+hintMsg,5200);try{tone(660,.08,'triangle',.05);setTimeout(()=>tone(880,.1,'triangle',.05),90)}catch(_){}
 const el=document.querySelector(`#bg [data-n="${sp.n}"]`);if(el&&!el.querySelector(':scope > .jig')){const w=document.createElementNS(NS,'g');w.setAttribute('class','jig');while(el.firstChild)w.appendChild(el.firstChild);el.appendChild(w);setTimeout(()=>{while(w.firstChild)el.insertBefore(w.firstChild,w);w.remove()},520)}
 return true}
function onTap(sx,sy){if(!st.running)return;const wx=(sx-view.tx)/view.s,wy=(sy-view.ty)/view.s;{const S=SEC();if(S){S.tap(wx,wy);return}}if(!isRevealed(wx,wy))return;let best=null,bd=1e9,near=false;
 for(const c of [clovers.story,clovers.bonus])if(c&&c.revealed&&!c.found&&Math.hypot(c.x-wx,c.y-wy)<Math.max(14,13/view.s)){foundClover(c);return}
 for(const it of items){if(!isRevealed(it.x,it.y))continue;const d=Math.hypot(it.x-wx,it.y-wy),lim=Math.max(it.r*it.sc+3,13/view.s);if(d<lim){if(it.found)near=true;else if(d<bd){best=it;bd=d}}}
 if(best)found(best);else if(!near)miss(wx,wy)}
function svgEl(tag,a,p){const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function found(it){it.found=true;colAdd(it.t.id);it.el.classList.add('got');const rr=it.r*it.sc+8;
 if(it.occ){it.el.parentNode.appendChild(it.el)}
 const el=it.el;setTimeout(()=>{el.style.display='none'},600);
 burst(it.x,it.y);const n=leftOf(it.t.id);floatText(it.x,it.y-rr-4,n?`${it.t.short} 還有 ${n}`:`${it.t.short} 全部找到！`);updateCounts(it.t.id);
 if(n===0)sfx.typeDone();else sfx.found();if(leftOf()===0)win()}
function miss(wx,wy){if(tapSecretHint(wx,wy))return;if(TAPHOOKS[scene]&&TAPHOOKS[scene](wx,wy))return; /* 場景裡的小互動（例如第 4 關圖騰眨眼），不算點錯 */
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
$('#hintBtn').onclick=()=>{if(!st.running||hintLock||(!testMode&&st.hintsLeft<=0))return;const rest=items.filter(it=>!it.found);if(!rest.length)return;
 {const S=SEC();if(S){if(!S.hint())return;st.hintsUsed=(st.hintsUsed||0)+1;if(!testMode)st.hintsLeft--;hintLock=true;setHintUI();sfx.hint();
  toast(testMode?'提示：跟著頭上的箭頭走':st.hintsLeft?`提示：跟著頭上的箭頭走（剩 ${st.hintsLeft} 次）`:'提示：跟著頭上的箭頭走（提示用完了）',2600);setTimeout(()=>{hintLock=false;setHintUI()},testMode?900:2600);return}}
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
function win(){st.running=false;clearInterval(timer);const total=elapsed();$('#time').textContent=fmt(total);
 const BK='townhunt-best-L'+level;let best=null;try{best=parseFloat(localStorage.getItem(BK))}catch(_){}
 const isBest=!best||total<best;if(isBest){best=total;try{localStorage.setItem(BK,String(total))}catch(_){}}
 const crit=[['全部找到',true],['提示 1 次內',(st.hintsUsed||0)<=1],['故事幸運草',!!st.clover]],ns=crit.filter(c=>c[1]).length;
 if(st.bonus)crit.push(['隱藏幸運草',true]);
 try{const SK='townhunt-stars-L'+level,old=+localStorage.getItem(SK)||0;if(ns>old)localStorage.setItem(SK,String(ns))}catch(_){}
 $('#winTitle').textContent=LEVELS[level].secret?`${(MAPNODES.find(m=>m.n===level)||{}).name||'秘境'}完成！`:`第 ${level} 關完成！`;
 $('#winStars').classList.toggle('four',crit.length>3);$('#winStars').innerHTML=crit.map(([c,ok],k)=>`<div class="${k===1?'mid':''}" style="animation-delay:${.9+k*.28}s">${starSvg(ok,k===1?58:46,k===3?'#7fc45a':0)}<span style="color:${ok?'var(--ink)':'var(--muted)'}">${c}</span></div>`).join('');
 $('#rTime').textContent=fmt(total);$('#rHint').textContent=st.hintsUsed||0;
 $('#winTag').textContent=isBest?'這一關的新紀錄':`最佳紀錄 ${fmt(best)}`;
 const nx=$('#winNext'),nb=$('#nextBtn');
 if(LEVELS[level].secret){const hm=LEVELS[level].home,I=NEXTINFO[hm];nx.innerHTML=`<div class="pv">${I&&I.pv?I.pv():mistPreview()}</div><div><small>回到出發地</small><b>${MAPNODES.find(m=>m.n===hm).name}</b><small>${(SECRETS[level]&&SECRETS[level].homeNote)||'隨時可以再回來'}</small></div>`;
  nb.innerHTML=((SECRETS[level]&&SECRETS[level].homeBtn)||'回到出發地')+ICO.arrow;nb.dataset.act='home';$('#winMap').style.display='';$('#againBtn').style.display='';setTimeout(()=>{sfx.win();$('#winOv').classList.remove('hide')},900);return}
 const nl=level+1,hasNext=!!LEVELS[nl],had=prog.unlocked>=nl,gotS=starsOf(level);
 if(hasNext&&!had&&gotS>=NEED_STARS){prog.unlocked=nl;saveProg()}
 if(hasNext&&prog.unlocked>=nl){const I=NEXTINFO[nl];nx.innerHTML=`<div class="pv">${I.pv()}</div><div><small>下一站</small><b>${MAPNODES.find(m=>m.n===nl).name}</b><small>${had?I.had:I.fresh}</small></div>`;nb.innerHTML=I.btn+ICO.arrow;nb.dataset.act='ride';if(LEVELS[nl].file)ensureFull(nl,()=>{})}
 else if(hasNext){nx.innerHTML=`<div class="pv">${mistPreview()}</div><div><small>下一站</small><b>還差一點點</b><small>這一關拿到 ${NEED_STARS} 顆星以上，新的路才會出現（這次 ${ns} 顆）</small></div>`;nb.innerHTML='再挑戰一次'+ICO.arrow;nb.dataset.act='again'}
 else{nx.innerHTML=`<div class="pv">${mistPreview()}</div><div><small>下一站</small><b>前面的路還沒畫好⋯</b><small>新的地方正在製作中，敬請期待</small></div>`;nb.innerHTML=ICO.map+'打開冒險地圖';nb.dataset.act='map'}
 $('#winMap').style.display=nb.dataset.act==='map'?'none':'';$('#againBtn').style.display=nb.dataset.act==='again'?'none':'';
 setTimeout(()=>{sfx.win();$('#winOv').classList.remove('hide')},900)}
$('#againBtn').onclick=()=>{$('#winOv').classList.add('hide');curtain(()=>{setLevel(level);newGame()})};
$('#startBtn').onclick=()=>{ac();curtain(()=>{loadScene(level);$('#startOv').classList.add('hide');newGame()},'把東西藏好⋯')};
let tCount=0,tTimer;
$('#gameTitle').onclick=()=>{tCount++;clearTimeout(tTimer);tTimer=setTimeout(()=>tCount=0,2500);if(tCount>=5){tCount=0;testMode=!testMode;try{localStorage.setItem('townhunt-test',testMode?'1':'0')}catch(_){}applyTestUI();toast(testMode?'🧪 測試模式：開啟':'測試模式：關閉')}};
/* 測試用直接過關：只算星星，不寫進收集冊（收集冊只記真的找到的東西） */
$('#winBtn').onclick=()=>{if(!st.running)return;items.forEach(it=>{it.found=true});st.clover=true;st.bonus=true;if(story)story.done=true;updateCounts();win()};
$('#resetBtn').onclick=()=>{prog={unlocked:1};saveProg();try{LEVELS.forEach((L_,n)=>{if(!L_)return;localStorage.removeItem('townhunt-best-L'+n);localStorage.removeItem('townhunt-stars-L'+n)});RESETKEYS.forEach(k=>localStorage.removeItem(k));localStorage.removeItem('townhunt-col')}catch(_){}COL={i:{},c:{},s:{},b:{}};st.running=false;clearInterval(timer);setLevel(1);toast('進度已重置：只開放第 1 關，收集冊也清空了',2600);return;
 items=[];itemsL.innerHTML='';const lw=document.getElementById('lockWall');lw.classList.remove('gone2');buildFog();setLevel(1);measure();const c=LEVELS[1].c;view={s:base,tx:SW/2-c[0]*base,ty:SH/2-c[1]*base};clampV();apply();toast('進度已重置，只開放第 1 關')};
const closeMenu=()=>$('#menu').classList.add('hide');
$('#menuBtn').onclick=e=>{e.stopPropagation();$('#menu').classList.toggle('hide')};
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#menu')&&!e.target.closest('#menuBtn'))closeMenu()},true);
$('#mapBtn').onclick=()=>{closeMenu();openMap()};
$('#startMap').onclick=()=>{ac();openMap()};
$('#winMap').onclick=()=>{$('#winOv').classList.add('hide');openMap()};
$('#mapClose').onclick=()=>{$('#mapOv').classList.add('hide');mapUnder.forEach(id=>$('#'+id).classList.remove('hide'));mapUnder=[]};
$('#trayToggle').onclick=()=>{const t=$('#tray'),c=t.classList.toggle('collapsed');$('#trayToggle').innerHTML=(c?'展開'+ICO.up:'收合'+ICO.down);$('#trayToggle').setAttribute('aria-label',c?'展開清單':'收合清單');clampV();apply()};
$('#nextBtn').onclick=()=>{$('#winOv').classList.add('hide');const a=$('#nextBtn').dataset.act;if(a==='map'){openMap();return}
 if(a==='home'){goLevel(LEVELS[level].home);return}
 if(a==='again'){curtain(()=>{setLevel(level);newGame()});return}
 const n=level+1;if(!LEVELS[n]||prog.unlocked<n)return;
 rodeAdd(n);ensureFull(n,()=>ride(()=>{loadScene(n);setLevel(n);newGame();clockHold();$('#time').textContent='0:00'},()=>{clockRun(true);toast(`${LEVELS[n].title}，開始！`,2200)},NEXTINFO[n]&&NEXTINFO[n].ride))};

let FOGV=1;/* 雲：0 舊版、1 變薄（使用者選 B）、2 中間 */
function buildFog(sc){const SC=SCENES[sc],X0=SC.x0,X1=SC.x1,Y1=SC.y1||H;
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
function loadScene(n){if(scene===n)return;scene=n;SCN=n;NGHOOKS.forEach(h=>{try{h(0)}catch(e){console.error(e)}}); /* 換場景時先清掉上一個場景的動態圖層 */ROADS.length=0;sizeCanvas(n);sprites.length=0;occ.fill(0);
 for(let j=0;j<GR;j++)for(let i=0;i<GC;i++)wat[j*GC+i]=isWater(i*CELL+CELL/2,j*CELL+CELL/2)?1:0;rng=mulberry32(77+n*101);
 items=[];itemsL.innerHTML='';
 $('#bg').innerHTML=buildScene(n);
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
function renderMap(){const U=prog.unlocked,ink='#2b2420',FN='Huninn,PingFang TC,Noto Sans TC,sans-serif',R=mulberry32(4242);
 const P=(d,fill,sw=1.6,extra='')=>`<path d="${d}" fill="${fill}" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
 let g=`<svg viewBox="-120 0 462 430" role="img" aria-label="冒險地圖"><defs><clipPath id="mapClip"><path d="M-102,26 Q110,16 324,28 Q332,220 322,406 Q110,416 -100,406 Q-108,220 -102,26Z"/></clipPath>
 <radialGradient id="mapVig" cx="50%" cy="50%" r="62%"><stop offset="70%" stop-color="#f1e2bf" stop-opacity="0"/><stop offset="100%" stop-color="#e8d3a5" stop-opacity=".85"/></radialGradient></defs>`;
 // parchment
 g+=`<path d="M-110,14 Q-40,4 40,12 Q140,2 262,10 Q320,6 334,20 Q340,120 332,220 Q342,330 330,416 Q250,426 140,418 Q20,428 -106,418 Q-118,320 -110,220 Q-116,110 -110,14Z" fill="#f1e2bf" stroke="${ink}" stroke-width="2.5"/>`;
 g+=`<g clip-path="url(#mapClip)">`;
 // land
 g+=`<rect x="-120" y="0" width="462" height="430" fill="#c6cb8c"/>`;
 /* 2026-11-11 地圖向西加寬 120（櫻花山城在西邊）；西南角留陸地（之後做沙漠）。西邊的亂數用 R2，東邊原本的圖案不變 */
 const R2=mulberry32(4343);
 g+=`<path d="M-120,300 H-4 Q-20,360 -14,430 H-120Z" fill="${MAPSW}"/>`;
 // grass texture
 let tf='';for(let i=0;i<70;i++){const x=20+R()*300,y=130+R()*160;tf+=`M${f(x)},${f(y)} l2,-4 l2,4 `}g+=`<path d="${tf}" fill="none" stroke="#9aa361" stroke-width="1.1" stroke-linecap="round"/>`;
 // foothills
 g+=P('M-120,122 Q-92,102 -62,116 Q-30,100 0,128 Q30,104 64,120 Q96,98 132,118 Q170,96 206,116 Q242,96 276,114 Q310,100 342,118 V0 H-120Z','#93a35e',1.6);
 // mountains back row
 const mt=(x,y,w,h,c1,c2,snow)=>{let s=P(`M${x-w},${y} L${x},${y-h} L${x+w},${y}Z`,c1,1.7)+`<path d="M${x},${y-h} L${x+w},${y} L${x+w*.25},${y}Z" fill="${c2}" opacity=".9"/>`;
  if(snow)s+=P(`M${x-w*.32},${y-h*.68} L${x},${y-h} L${x+w*.32},${y-h*.68} L${x+w*.14},${y-h*.6} L${x},${y-h*.72} L${x-w*.14},${y-h*.6}Z`,'#fbf7ef',1.3);return s};
 [[-76,94,32,56],[-16,96,30,52],[44,96,30,50],[104,94,34,62],[170,90,36,66],[236,94,32,58],[296,96,32,52]].forEach(([x,y,w,h])=>g+=mt(x,y,w,h,'#b3b8b2','#959c98',1));
 [[-104,112,26,40],[-46,112,28,44],[16,112,26,40],[74,112,30,46],[138,110,30,44],[204,112,32,48],[268,112,28,42],[328,112,26,40]].forEach(([x,y,w,h])=>g+=mt(x,y,w,h,'#8e9a72','#76835c',0));
 // west forest
 const tree=(x,y,s)=>`<path d="M${f(x)},${f(y)} v5" stroke="${ink}" stroke-width="1.6"/>`+P(`M${f(x-7*s)},${f(y)} L${f(x)},${f(y-16*s)} L${f(x+7*s)},${f(y)}Z`,'#5f7a3f',1.3)+P(`M${f(x-5*s)},${f(y-7*s)} L${f(x)},${f(y-20*s)} L${f(x+5*s)},${f(y-7*s)}`,'#6f8a48',1.2);
 let tr=[];for(let i=0;i<26;i++)tr.push([22+R()*44,138+R()*150,.8+R()*.4]);[[300,140],[316,170],[308,262],[90,270],[196,282]].forEach(([x,y])=>tr.push([x,y,.9]));
 for(let i=0;i<9;i++)tr.push([-114+R2()*108,126+R2()*24,.75+R2()*.35]);for(let i=0;i<4;i++)tr.push([-14+R2()*26,222+R2()*40,.8+R2()*.3]);
 let tw='';for(let i=0;i<26;i++){const x=-110+R2()*104,y=220+R2()*70;tw+=`M${f(x)},${f(y)} l2,-4 l2,4 `}g+=`<path d="${tw}" fill="none" stroke="#9aa361" stroke-width="1.1" stroke-linecap="round"/>`;
 tr.sort((a,b)=>a[1]-b[1]).forEach(([x,y,s])=>g+=tree(x,y,s));
 // coast + sea
 g+=`<path d="M-26,430 Q-30,366 -12,326 Q2,298 40,294 Q100,284 170,298 Q250,312 342,290 V430Z" fill="#e8d6a4"/>`;
 g+=P('M-12,440 Q-16,370 0,334 Q12,310 40,304 Q100,294 170,306 Q250,320 342,298 V440Z','#9cc6bd',2);
 g+=`<path d="M4,430 Q2,372 12,344 Q22,320 46,314 Q100,304 170,316 Q250,330 342,308" fill="none" stroke="#fffaf0" stroke-width="1.6" stroke-dasharray="10 8" opacity=".8"/>`;
 g+=`<path d="M60,350 q7,-4 14,0 q7,4 14,0 M150,366 q7,-4 14,0 q7,4 14,0 M110,394 q7,-4 14,0 q7,4 14,0 M220,388 q7,-4 14,0 q7,4 14,0 M270,350 q7,-4 14,0 q7,4 14,0" fill="none" stroke="#fffaf0" stroke-width="1.8" stroke-linecap="round"/>`;
 // river
 g+=`<path d="M150,108 Q136,150 150,196 Q166,246 178,306" fill="none" stroke="${ink}" stroke-width="9" stroke-linecap="round"/><path d="M150,108 Q136,150 150,196 Q166,246 178,306" fill="none" stroke="#9cc6bd" stroke-width="6" stroke-linecap="round"/>`;
 // birds
 g+=`<path d="M200,150 q4,-4 8,0 q4,-4 8,0 M222,140 q3,-3 6,0 q3,-3 6,0 M86,150 q3,-3 6,0 q3,-3 6,0" fill="none" stroke="${ink}" stroke-width="1.3"/>`;
 [...MAPHOOKS].sort((a,b)=>(a.z??2)-(b.z??2)).forEach(h=>{g+=h({U,P,ink,FN,f})});
 // vignette
 g+=`<rect x="-120" y="0" width="462" height="430" fill="url(#mapVig)" pointer-events="none"/></g>`; /* 暈影不能擋住地點的點擊 */
 g+=`<path d="M-96,30 Q110,20 318,32 Q326,220 316,400 Q110,410 -94,400 Q-102,220 -96,30Z" fill="none" stroke="#a8916a" stroke-width="1.2" stroke-dasharray="4 5"/>`;
 g+='<g pointer-events="none">';MAPTOP.forEach(h=>{g+=h({U,P,ink,FN,f})});g+='</g>'; /* 畫在暈影上面的東西（例如秘境的光圈） */
 // compass
 g+=`<g transform="translate(58,368)"><circle r="20" fill="#f1e2bf" stroke="${ink}" stroke-width="2"/><circle r="15" fill="none" stroke="#c9b48a" stroke-width="1"/><path d="M0,-17 L5,0 L0,17 L-5,0Z" fill="#a8461f" stroke="${ink}" stroke-width="1.4"/><path d="M-17,0 L0,-4 L17,0 L0,4Z" fill="#e8dcc0" stroke="${ink}" stroke-width="1.1"/><text x="0" y="-24" text-anchor="middle" font-size="11" fill="${ink}" font-family="${FN}">北</text></g>`;
 // here pin
 const here=HERE[level]||[100,150];
 g+=`<g transform="translate(${here[0]},${here[1]})" pointer-events="none"><g><animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="1.6s" repeatCount="indefinite"/>`+P('M0,14 C-10,2 -11,-4 -11,-8 A11,11 0 1 1 11,-8 C11,-4 10,2 0,14Z','#f5c842',2)+`<circle cy="-8" r="4" fill="${ink}"/></g></g>`;
 g+='</svg>';
 $('#mapSvg').innerHTML=g;
 $('#mapSub').textContent=U>1?`已走過 ${U} 個地方，下一段路要拿到 ${NEED_STARS} 顆星才會出現`:`這一關拿到 ${NEED_STARS} 顆星，地圖上就會出現新的路`;
 let cards='';for(let n=1;n<=U;n++){if(!SCENES[n])continue;const m=MAPNODES.find(x=>x.n===n),b=bestOf(n),st_=starsOf(n);
  cards+=`<button class="lcard${n===level?' here':''}" data-n="${n}" aria-label="${m.name}${n===level?'（你在這裡）':''}">${n===level?'<span class="here-tag">你在這裡</span>':''}<span class="nm">${m.name}</span><span class="stars">${[0,1,2].map(k=>starSvg(k<st_,16)).join('')}${COL.b&&COL.b[n]?starSvg(true,16,'#7fc45a'):''}</span><small>${b?'最佳 '+fmt(b):'還沒完成'}</small></button>`}
 for(const n of SECRET_IDS){if(!secretSeen(n))continue;const m=MAPNODES.find(x=>x.n===n);if(!m)continue;const b=bestOf(n),st_=starsOf(n);
  cards+=`<button class="lcard secret${n===level?' here':''}" data-n="${n}" aria-label="${m.name}${n===level?'（你在這裡）':''}">${n===level?'<span class="here-tag">你在這裡</span>':''}<span class="nm">${m.ic||''} ${m.name}</span><span class="stars">${[0,1,2].map(k=>starSvg(k<st_,16)).join('')}${COL.b&&COL.b[n]?starSvg(true,16,'#7fc45a'):''}</span><small>${b?'最佳 '+fmt(b):'秘境'}</small></button>`}
 $('#mapCards').innerHTML=cards;
 document.querySelectorAll('#mapSvg .mnode,#mapCards .lcard').forEach(el=>el.onclick=()=>goLevel(+el.dataset.n));
}
function goLevel(n){if(LEVELS[n]&&LEVELS[n].file&&!LEVELS[n].types){ensureFull(n,()=>goLevel(n));return}
 if(!rodeHas(n)&&NEXTINFO[n]){$('#mapOv').classList.add('hide');mapUnder=[];st.running=false;clearInterval(timer);['winOv','startOv'].forEach(id=>$('#'+id).classList.add('hide'));rodeAdd(n);
  ride(()=>{loadScene(n);setLevel(n);newGame();clockHold();$('#time').textContent='0:00'},()=>{clockRun(true);toast(`${LEVELS[n].title}，開始！`,2200)},NEXTINFO[n].ride);return}
 $('#mapOv').classList.add('hide');const under=mapUnder;mapUnder=[];if(n===level&&scene===n&&!st.running&&under.includes('startOv')){$('#startOv').classList.remove('hide');return}if(n===level&&scene===n&&st.running)return;st.running=false;clearInterval(timer);$('#winOv').classList.add('hide');
 if(scene!==n){curtain(()=>{loadScene(n);setLevel(n);measure();const c=LEVELS[n].c;view={s:base,tx:SW/2-c[0]*base,ty:SH/2-c[1]*base};clampV();apply();$('#startOv').classList.remove('hide')},'前往'+MAPNODES.find(m=>m.n===n).name+'⋯')}
 else{setLevel(n);$('#startOv').classList.remove('hide')}}
/* 地圖打開時先把底下的開始／過關面板收起來，關地圖再放回去（避免 iPhone 疊圖錯亂） */
let mapUnder=[];
function openMap(){renderMap();mapUnder=['startOv','winOv'].filter(id=>!$('#'+id).classList.contains('hide'));mapUnder.forEach(id=>$('#'+id).classList.add('hide'));$('#mapOv').classList.remove('hide')}
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
 [['tPano','🧪 全景（秘境：看整張、檢查破圖）'],['tBonus','🧪 找隱藏幸運草'],['tClover','🧪 找故事幸運草'],['tHelper','🧪 找幫手'],['tTarget','🧪 找走失的目標'],['tGiver','🧪 找提問的人']].forEach(([id,t])=>{const b=document.createElement('button');b.id=id;b.className='tbtn';b.style.display='none';b.innerHTML=`<span>${t}</span>`;mb.parentNode.insertBefore(b,mb.nextSibling.nextSibling)})})();
function testGo(p,label){closeMenu();if(!p){toast('這一關沒有'+label,1600);return}const s2=Math.max(view.s,base*1.5);tweenTo(s2,p[0],p[1],600);
 setTimeout(()=>{const g=svgEl('g',{},fx),c=svgEl('circle',{cx:p[0],cy:p[1],r:10,fill:'none',stroke:'#d8413a','stroke-width':4},g);anim(1600,k=>{c.setAttribute('r',10+30*(k*3%1));g.setAttribute('opacity',1-k*.7)},()=>g.remove())},620);toast('🧪 '+label,1400)}
document.getElementById('tGiver').onclick=()=>{const g=storySp.giver;testGo(g&&[g.x,g.y-30],'提問的人')};
document.getElementById('tHelper').onclick=()=>{const t=storySp.helper;testGo(t&&[t.x,t.y-30],'幫手')};
document.getElementById('tTarget').onclick=()=>{const t=storySp.target;testGo(t&&[t.x,t.y-t.h*.4],'走失的目標')};
const cloverGo=(c,nm)=>{if(!c){testGo(null,nm);return}if(c.found){toast(nm+'已經找到了',1400);return}const h=c.host;
 testGo(c.revealed?[c.x,c.y]:[h.x,h.y-h.h*.4],c.revealed?nm:nm+'藏在這個東西後面'+(c.kind==='story'&&!(story&&story.done)?'（要先完成小故事才點得出來）':'（點它）'))};
document.getElementById('tPano').onclick=()=>{closeMenu();const S=SEC();if(!S){toast('全景只在秘境裡使用',1600);return}S.pano(!S.pano())};
document.getElementById('tClover').onclick=()=>cloverGo(clovers.story,'故事幸運草');
document.getElementById('tBonus').onclick=()=>cloverGo(clovers.bonus,'隱藏幸運草');
let colUnder=[];
function openCol(){const U=prog.unlocked;let html='',got=0,tot=0;const seen=new Set();
 for(let n=1;n<=U;n++){const L=LEVELS[n];if(!L||!L.types)continue;const m=MAPNODES.find(x=>x.n===n);
  const fresh=L.types.filter(t=>!seen.has(t.id));fresh.forEach(t=>seen.add(t.id));
  const cells=fresh.map(t=>{const ok=!!COL.i[t.id];tot++;if(ok)got++;return `<div class="${ok?'':'no'}"><span class="ic">${icon(t.id)}</span><span>${ok?t.short:'？'}</span></div>`}).join('');
  html+=`<section class="colsec"><h4><span>${m?m.name:'第 '+n+' 關'}</span><span class="clv4 ${COL.c[n]?'':'no'}">🍀 ${COL.c[n]?'已找到':'還沒找到'}</span>${COL.b[n]?'<span class="clv4">✨ 隱藏幸運草</span>':''}</h4><div class="colgrid">${cells}</div>${STORIES[n]?`<div class="storyrow ${COL.s[n]?'':'no'}">📖 小故事：${COL.s[n]?STORIES[n].title+' ✓':'還沒完成'}</div>`:''}</section>`}
 for(const n of SECRET_IDS){if(!secretSeen(n))continue;const L=LEVELS[n];if(!L.types){ensureLevel(n,openCol);return}const m=MAPNODES.find(x=>x.n===n);
  const cells=L.types.map(t=>{const ok=!!COL.i[t.id];tot++;if(ok)got++;return `<div class="${ok?'':'no'}"><span class="ic">${icon(t.id)}</span><span>${ok?t.short:'？'}</span></div>`}).join('');
  html+=`<section class="colsec secret"><h4><span>🗝️ 秘境．${m?m.name:n}</span><span class="clv4 ${COL.c[n]?'':'no'}">🍀 ${COL.c[n]?'已找到':'還沒找到'}</span>${COL.b[n]?'<span class="clv4">✨ 隱藏幸運草</span>':''}</h4><div class="colgrid">${cells}</div>${STORIES[n]?`<div class="storyrow ${COL.s[n]?'':'no'}">📖 小故事：${COL.s[n]?STORIES[n].title+' ✓':'還沒完成'}</div>`:''}</section>`}
 $('#colBody').innerHTML=html;$('#colSub').textContent=`已收集 ${got} / ${tot} 種東西（每種只記一次）`;
 colUnder=['startOv','winOv'].filter(id=>!$('#'+id).classList.contains('hide'));colUnder.forEach(id=>$('#'+id).classList.add('hide'));$('#colOv').classList.remove('hide')}
document.getElementById('colBtn').onclick=()=>{closeMenu&&closeMenu();openCol()};
document.getElementById('colClose').onclick=()=>{$('#colOv').classList.add('hide');colUnder.forEach(id=>$('#'+id).classList.remove('hide'));colUnder=[]};
/* ================= 拆檔關卡載入 ================= */
const loadedLv={};
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
function ensureFull(n,cb){ensureLevel(n,()=>{const S=SECRET_IDS.filter(s=>LEVELS[s].home===n),next=()=>S.length?ensureLevel(S.shift(),next,next):cb();next()},cb)}
function ensureUpTo(m,cb){const need=[];for(let n=1;n<=m;n++)if(LEVELS[n]&&LEVELS[n].file)need.push(n);
 const next=()=>need.length?ensureFull(need.shift(),next):cb();next()}
/* ================= boot（index.html 載入 core.js、art.js、levels.js 之後呼叫） ================= */
function boot(){
/* 單關測試頁（index.html?test=關卡編號；test.html 會轉過來）：進度只存在記憶體，直接開到那一關，測試模式自動打開 */
const TL=window.TEST_LEVEL;
if(TL){const L=LEVELS[TL];if(!L){$('#loading').textContent=`levels.js 裡沒有第 ${TL} 關：請先在 levels.js 加一行 addLevel({n:${TL},…})`;return}
 const top=L.secret?L.home:TL;prog={unlocked:top};RODE=LEVELS.map((L_,n)=>L_&&n).filter(n=>n&&(n<=top||n===TL));testMode=true;
 try{localStorage.setItem('townhunt-test','1');localStorage.setItem('townhunt-secret-tip','1');for(let n=1;n<top;n++)localStorage.setItem('townhunt-stars-L'+n,'2');if(L.secret)localStorage.setItem('townhunt-best-L'+L.home,'600')}catch(_){}
 const bn=document.createElement('div');bn.id='testBanner';bn.textContent='🧪 單關測試：'+L.title+'（進度不會保存）';
 Object.assign(bn.style,{position:'fixed',left:'50%',bottom:'calc(env(safe-area-inset-bottom) + 2px)',transform:'translateX(-50%)',zIndex:60,background:'#6a5aa8',color:'#fff',font:'12px/1.6 sans-serif',padding:'0 10px',borderRadius:'9px',pointerEvents:'none',whiteSpace:'nowrap'});document.body.appendChild(bn)}
/* 舊玩家補解鎖：已解鎖的最後一關若曾拿到 2 顆星以上，開遊戲時直接開放下一關 */
if(!TL){const before=prog.unlocked;while(LEVELS[prog.unlocked+1]&&starsOf(prog.unlocked)>=NEED_STARS)prog.unlocked++;
 if(prog.unlocked>before){saveProg();setTimeout(()=>{const m=MAPNODES.find(m=>m.n===prog.unlocked);toast(`新地點開放：${m?m.name:'新地點'}，打開冒險地圖出發吧！`,3600)},1200)}}
level=Math.min(prog.unlocked,LEVELS.length-1);
/* 給 level{n}.js、secret.js 使用的工具與資料 */
window.TH={EDGELAND,ROADS,T,f,r,sr,pk,ri,rnd,shuffle,limb,shade,wob,OL,SNOW,SKIN,HAIR,SHIRT,PANTS,HATS,kid,chibi,act,wrapAn,heart,bubble,noteM,peekHead,faceHead,headOnly,
 cat,frog,owl,sheep,chicken,anyDog,dog,swan,pine,roundTree,bush,rock,barrel,crate,pot,lamp,bench,sign,fence,reeds,lily,well,tent,campfire,swirl,signpost,signIcon,stall,
 add,mark,canPlace,scatter,SCATREG,SCATOK,skyBirds,chaikin,bow,qBubble,qThink,qMark,QHEART,GC,GR,CELL,occ,mulberry32,DK,balloon,castle,fountain,house,kayak,lighthouse,mushHouse,rowboat,sailboat,tower,windmill,pig,barn,KIND,POOL,VPLAN:VPLANX,REG,SCREG,SCENES,LEVELS,ART,DECOY,BORROW,TARGET,MAPNODES,OCCK,HEAVY,ANIM,ALWAYS,DUR,
 ANIMX,ALWAYSX,HEAVYX,SPOTS,BLEND,SCENE_IMPL,WATERFN,RIDES,MAPHOOKS,mapHook,mapRoute,TAPHOOKS,NGHOOKS,MAPTOP,NEXTINFO,HERE,HOSTK,HOSTN,ferry,OUTFITS,SECRETS,STORIES,SEQ,SKYC,SKYY,EDGEM,EDGED,EDGEDECO,EDGEMY,EDGEFILL,FRINGE,FRINGEX,RESERVE,ROADK,RESETKEYS,icon,starSvg,
 typeOf:id=>LEVELS.slice(1).flatMap(L_=>L_.types||[]).find(t=>t.id===id),colAdd,colClover,colBonus,colStory,updateCounts,win:()=>win(),goLevel:n=>goLevel(n),level:()=>level,rodeHas,pads:()=>pads(),scr:()=>({w:SW,h:SH,base}),apply:()=>apply(),clampV:()=>clampV(),rezoom:()=>{measure();clampV();apply()},updAnim:()=>updateAnim(),tweenTo:(s,x,y,d,cb)=>tweenTo(s,x,y,d,cb),curtain,pickView,walkPose,DENS,sprites,ride,toast,clockHold,clockRun,burst,floatText,sfx,items:()=>items,game:()=>st,scene:()=>scene,view:()=>view,testOn:()=>testMode,dbg:{clover:()=>clovers,hint:()=>({sp:hintSp,msg:hintMsg}),step:()=>story&&story.step,storySp:()=>storySp,story:()=>story,center:(x,y)=>{view.s=base*1.4;view.tx=SW/2-x*view.s;view.ty=SH/2-y*view.s;clampV();apply();const r=stage.getBoundingClientRect();return [r.left+x*view.s+view.tx,r.top+y*view.s+view.ty]}},isWater:(x,y)=>isWater(x,y),tone,steamPuff,pineS,cabinSVG};
/* 測試模式：選單列出測試中的關卡（編號 900 以上、還沒接上主線的主線關卡），在 Claude 作品裡也能直接玩（2026-11-12） */
LEVELS.forEach((L_,n)=>{if(!L_||n<900||L_.secret||document.getElementById('tLv'+n))return;const b=document.createElement('button');b.id='tLv'+n;b.className='tbtn';b.style.display='none';b.innerHTML=`<span>🧪 測試中的關卡：${L_.title}</span>`;
 b.onclick=()=>{closeMenu();toast('🧪 載入測試中的關卡⋯',1400);ensureUpTo(899,()=>goLevel(n))};const a=document.getElementById('tGiver');a.parentNode.insertBefore(b,a);
 const sb=document.createElement('button');sb.id='tLvS'+n;sb.className='sbtn tbtn';sb.style.cssText='display:none;flex:none;margin-top:6px';sb.textContent='🧪 玩測試中的關卡：'+L_.title;sb.onclick=b.onclick;const row=document.querySelector('#startOv .testrow');if(row)row.appendChild(sb)});
applyTestUI();
ensureUpTo(prog.unlocked,()=>{while(level>1&&!rodeHas(level))level--;while(level>1&&!LEVELS[level].types)level--;if(!LEVELS[1].types){$('#loading').textContent='找不到 level1.js，請確認它和 index.html 放在同一個資料夾';return}setLevel(level);
setTimeout(()=>{
 loadScene(level);$('#loading').remove();
 drawCells();measure();placeItems();updateCounts();{const c=LEVELS[level].c;view={s:base,tx:SW/2-c[0]*base,ty:SH/2-c[1]*base}}clampV();apply();reveal(true);
 if(TL&&TL!==level)setTimeout(()=>goLevel(TL),300); /* 測秘境：先進出發地，再進秘境 */
},30)})}
