/* 奇幻小鎮大搜查．第 5 關「海島港口」
   由 index.html 在需要時載入（ensureLevel），把物件、場景、過場、地圖節點註冊到 window.TH。
   場景座標：x 500～2219、y 0～2812（和第 3、4 關同大小，直接用原始座標，不另外縮放）。
   四個區域互相融入：漁港魚市場（左邊海灣）、白沙灘與椰林（北岸、南岸）、潮間帶礁岩（東岸、南岸右側）、燈塔海岬（右上）。 */
(function(){
const H=window.TH;if(!H)return;
const {T,f,r,sr,pk,ri,shade,OL,SKIN,SHIRT,kid,act,wrapAn,heart,bubble,rock,crate,barrel,pot,signpost,
 add,mark,canPlace,scatter,KIND,POOL,VPLAN,REG,SCREG,LEVELS,ART,DECOY,BORROW,OCCK,HEAVY,ANIM,ALWAYS,DUR,SCENE_IMPL,WATERFN,RIDES,MAPHOOKS,TAPHOOKS,HERE,tone,pickView,walkPose,HOSTK,HOSTN,ferry,OUTFITS}=H;
/* 南洋風穿著：膚色偏黝黑，背心、短袖（部分花襯衫）、短褲；玩沙的小朋友穿泳褲 */
if(OUTFITS)OUTFITS[5]=o=>{if(o.top)return o;const S=H.SKIN;o.skin=o.skin||pk([S[2],S[3],S[3],S[4],S[4],S[1]]);
 o.top=pk(['tank','tee','tee','tank','tee','bare']);o.bottom=o.top==='bare'?'trunks':'shorts';
 if(o.top==='tee'&&r()<.35)o.aloha=pk(['#fbf6ea','#f5c842','#e86a9a']);
 if(o.top==='bare')o.pants=pk(['#d8413a','#3f8f8a','#f5c842','#5a86b0','#e86a9a']);
 else o.pants=o.pants||pk(['#c9a46a','#5a86b0','#3f8f8a','#e8d6b0','#8a6a4a']);return o};

const SAND='#ecd9a8',SAND2='#e3cb92',GRASS='#a9b768',SEA='#7cc0cc',SEA2='#94cfd8',ROCK='#8d8a80',ROCK2='#a6a294',WOOD='#a8703f',WOOD2='#c99a5b',NAVY='#3b5a8a';

/* ================= 物件與干擾物 ================= */
const starP=(ro,ri_)=>{let d='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?ri_:ro;d+=(i?' L':'M')+f(Math.cos(a)*rr)+','+f(Math.sin(a)*rr)}return d+'Z'};
const armDots=(ro,c)=>[0,1,2,3,4].map(i=>{const a=-Math.PI/2+i*Math.PI*2/5;return `<circle cx="${f(Math.cos(a)*ro*.62)}" cy="${f(Math.sin(a)*ro*.62)}" r="1.5" fill="${c}" stroke="none"/>`}).join('');
const shellS=`<path d="M-10,8 Q-14,-6 0,-12 Q13,-13 13,0 Q13,10 4,11 L-6,11Z" fill="#f2c39a"/><path d="M0,-7 Q7,-7 7,-1 Q7,5 1,5 Q-3,5 -3,1 Q-3,-2 0,-2" fill="none" stroke-width="1.4"/><path d="M5,-11 q4,3 5,8" fill="none" stroke="#fff" stroke-width="1.4" opacity=".7"/>`;
const bottleS=paper=>`<g transform="rotate(-35)"><rect x="-6.5" y="-12" width="13" height="24" rx="5" fill="#bfe3d6" fill-opacity=".9"/><rect x="-3" y="-19" width="6" height="8" fill="#bfe3d6"/><rect x="-3.6" y="-23" width="7.2" height="5" rx="1.5" fill="${WOOD2}"/>`+
 (paper?`<rect x="-3.2" y="-7" width="6.4" height="14" rx="2.4" fill="#fbf6ea" stroke-width="1.2"/><path d="M-3.2,0 h6.4" fill="none" stroke="#d8413a" stroke-width="1.8"/>`:'')+`<path d="M-3.6,-9 v12" fill="none" stroke="#fff" stroke-width="1.6" opacity=".85"/></g>`;
const ringS=(c,seg,dots)=>`<path d="M-12.5,0 a12.5,12.5 0 1 0 25,0 a12.5,12.5 0 1 0 -25,0Z M-6,0 a6,6 0 1 1 12,0 a6,6 0 1 1 -12,0Z" fill="${c}" fill-rule="evenodd"/>`+
 (seg?`<circle r="9.25" fill="none" stroke="${seg}" stroke-width="6" stroke-dasharray="7.26 7.26"/>`:'')+(dots?[[-8,-6],[7,-7],[9,5],[-7,7],[0,-10],[0,10]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.4" fill="#fff" stroke="none"/>`).join(''):'')+
 `<circle r="12.5" fill="none"/><circle r="6" fill="none"/>`;
const clamS=open=>open?`<path d="M-12,1 Q-13,-12 0,-14 Q13,-12 12,1Z" fill="#f2c6cf"/><path d="M0,-13 V0 M-6,-12 L-3,0 M6,-12 L3,0 M-10,-7 L-6,0 M10,-7 L6,0" fill="none" stroke="#d9909f" stroke-width="1.1"/><path d="M-13,2 Q-12,12 0,13 Q12,12 13,2Z" fill="#e9b3c0"/><path d="M-6,4 Q0,7 6,4" fill="none" stroke="#d9909f" stroke-width="1"/><circle cx="0" cy="2" r="4.4" fill="#fbf9f3"/><circle cx="-1.3" cy=".6" r="1.3" fill="#fff" stroke="none"/>`
 :`<path d="M-13,4 Q-12,-11 0,-13 Q12,-11 13,4 Q0,10 -13,4Z" fill="#e9b3c0"/><path d="M0,-12 V6 M-6,-11 L-4,6 M6,-11 L4,6 M-10,-6 L-8,5 M10,-6 L8,5" fill="none" stroke="#d9909f" stroke-width="1.1"/><rect x="-3" y="6" width="6" height="4" rx="1" fill="#e9b3c0" stroke-width="1.2"/>`;
const tubeS=(brass)=>`<g transform="rotate(-30)">`+(brass?`<rect x="-15" y="-4" width="10" height="8" rx="1.5" fill="#b8862f"/><rect x="-6" y="-5" width="10" height="10" rx="1.5" fill="#d6ab45"/><rect x="3" y="-6.5" width="12" height="13" rx="2" fill="#d6ab45"/><path d="M-6,-5 v10 M3,-6.5 v13" fill="none" stroke="#7a5235" stroke-width="1.8"/><ellipse cx="15" cy="0" rx="2.2" ry="6.4" fill="#cfe8ef"/><path d="M-1,-3 h4" fill="none" stroke="#fff" stroke-width="1.4"/>`
 :`<rect x="-15" y="-6" width="30" height="12" rx="2" fill="#f1e4c0"/><ellipse cx="15" cy="0" rx="2.6" ry="6" fill="#e2d3a8"/><path d="M15,-3 q-2,3 0,4" fill="none" stroke-width="1"/><path d="M-4,-6 v12" fill="none" stroke="#d8413a" stroke-width="2"/>`)+`</g>`;
Object.assign(ART,{
 starfish:`<path d="${starP(14,6)}" fill="#e8833a"/>`+armDots(14,'#f6c08a')+`<circle r="2.2" fill="#f6c08a" stroke="none"/>`,
 hermit:`<path d="M-8,10 l-6,5 M-4,11 l-3,6 M1,11 l1,6" fill="none" stroke="#d8413a" stroke-width="2"/>`+shellS+`<path d="M-9,5 Q-20,4 -19,-3 Q-17,-7 -13,-4 Q-15,0 -11,1" fill="#d8413a" stroke-width="1.4"/><path d="M-11,3 l-4,-9 M-8,2 l-1,-9" fill="none" stroke-width="1.3"/><circle cx="-15" cy="-7" r="1.9" fill="${OL}" stroke="none"/><circle cx="-9" cy="-8" r="1.9" fill="${OL}" stroke="none"/>`,
 bottle:bottleS(true),ring:ringS('#fbf6ea','#d8413a'),
 anchor:`<path d="M0,-9 V12 M-8,-4 H8 M-12,3 Q-10,13 0,13 Q10,13 12,3" fill="none" stroke="${OL}" stroke-width="5.6"/><path d="M0,-9 V12 M-8,-4 H8 M-12,3 Q-10,13 0,13 Q10,13 12,3" fill="none" stroke="#6f7f8f" stroke-width="2.8"/><circle cy="-12" r="3.4" fill="none" stroke="${OL}" stroke-width="5"/><circle cy="-12" r="3.4" fill="none" stroke="#6f7f8f" stroke-width="2.2"/><path d="M-15,5 l3,-5 l3,5Z M15,5 l-3,-5 l-3,5Z" fill="#6f7f8f" stroke-width="1.2"/><path d="M3,-14 q7,4 2,10 q-4,6 3,11" fill="none" stroke="${WOOD2}" stroke-width="1.8"/>`,
 pearl:clamS(true),
 coconut:`<circle r="12" fill="#8a5a3a"/><path d="M-9,-3 l3,1 M-6,6 l3,-1 M6,7 l2,-3 M9,-2 l-2,2 M2,-9 l1,3 M-3,9 l1,-2" fill="none" stroke="#5f3c25" stroke-width="1.3"/><circle cx="-3" cy="-4" r="1.7" fill="#3d2a1c" stroke="none"/><circle cx="3" cy="-4" r="1.7" fill="#3d2a1c" stroke="none"/><circle cx="0" cy="1" r="1.7" fill="#3d2a1c" stroke="none"/><path d="M-7,-8 q3,-3 7,-3" fill="none" stroke="#c99a5b" stroke-width="1.5" opacity=".8"/>`,
 sailorhat:`<path d="M-14,3 Q-15,-4 -10,-6 L-8,-12 Q0,-16 8,-12 L10,-6 Q15,-4 14,3 Q0,7 -14,3Z" fill="#fbf9f3"/><path d="M-14,3 Q0,7 14,3 Q15,-1 14,-2 Q0,3 -14,-2 Q-15,-1 -14,3Z" fill="${NAVY}" stroke-width="1.4"/><circle cx="0" cy="-8" r="3.6" fill="${NAVY}" stroke-width="1"/><path d="M0,-10 v4 M-1.6,-8.6 h3.2 M-1.6,-6.6 q1.6,1.4 3.2,0" fill="none" stroke="#fbf9f3" stroke-width="1"/>`,
 duck:`<path d="M-12,2 Q-13,11 -2,11 Q12,11 12,2 Q12,-3 7,-2 Q-1,0 -5,-3 Q-11,-3 -12,2Z" fill="#f5c842"/><circle cx="-5" cy="-7" r="6.5" fill="#f5c842"/><path d="M-11,-7 Q-17,-6 -15,-3 Q-12,-2 -10,-5Z" fill="#f0802a" stroke-width="1.3"/><circle cx="-6" cy="-8.5" r="1.4" fill="${OL}" stroke="none"/><path d="M1,3 Q6,1 8,6" fill="none" stroke-width="1.4"/><path d="M-3,-11 q2,-1 4,0" fill="none" stroke="#fff" stroke-width="1.4"/>`,
 spyglass:tubeS(true)});
Object.assign(DECOY,{
 starCookie:`<path d="${starP(13,6.6)}" fill="#d9a85b"/>`+[[-2,-6],[4,1],[-5,3],[1,7],[6,-5]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.4" fill="#5a3a26" stroke="none"/>`).join(''),
 shellEmpty:shellS,bottleEmpty:bottleS(false),floatPink:ringS('#f0a8c8',0,true),
 harpoon:`<g transform="rotate(25)"><path d="M0,15 V-3" fill="none" stroke="${OL}" stroke-width="5"/><path d="M0,15 V-3" fill="none" stroke="${WOOD2}" stroke-width="2.6"/><path d="M-6,-14 V-6 Q-6,-2 0,-2 Q6,-2 6,-6 V-14 M0,-2 V-16" fill="none" stroke="${OL}" stroke-width="4.6"/><path d="M-6,-14 V-6 Q-6,-2 0,-2 Q6,-2 6,-6 V-14 M0,-2 V-16" fill="none" stroke="#6f7f8f" stroke-width="2.2"/></g>`,
 clamShut:clamS(false),
 yarnBall:`<circle r="11.5" fill="#9a6a45"/><path d="M-10,-4 Q0,-12 10,-4 M-11,2 Q0,-6 11,2 M-8,8 Q0,2 8,8 M-4,-10 Q4,0 -2,11" fill="none" stroke="#6f4a2e" stroke-width="1.3"/><path d="M8,8 q6,4 4,9" fill="none" stroke="#9a6a45" stroke-width="2"/>`,
 chefHat:`<rect x="-8" y="-3" width="16" height="10" rx="1" fill="#fbf9f3"/><path d="M-8,-3 Q-15,-7 -11,-13 Q-8,-19 -2,-15 Q2,-20 7,-15 Q14,-15 11,-7 Q10,-4 8,-3Z" fill="#fbf9f3"/><path d="M-4,-3 v10 M0,-3 v10 M4,-3 v10" fill="none" stroke="#d6d0c4" stroke-width="1"/>`,
 lemon:`<path d="M-14,0 Q-12,-10 0,-10 Q12,-10 14,0 Q12,10 0,10 Q-12,10 -14,0Z" fill="#f5e04a"/><path d="M12,-6 q4,-5 8,-4 q-2,5 -8,4Z" fill="#6f9a4a" stroke-width="1.2"/><circle cx="-5" cy="-3" r="1.2" fill="#fff" stroke="none"/>`,
 paperRoll:tubeS(false)});

const g=id=>LEVELS.slice(1).flatMap(L=>L.types||[]).find(t=>t.id===id);
const TYPES5=[{...g('compass'),regions:['quay','dock5','town5','bung']},{...g('key'),regions:['town5','plaza5','dock5','quay']},
 {id:'starfish',name:'橘色海星',short:'海星',r:14,rot:35,regions:['beach5','south5','reef','beach5']},
 {id:'hermit',name:'寄居蟹',short:'寄居蟹',r:14,rot:15,regions:['south5','reef','beach5','south5']},
 {id:'bottle',float:true,name:'瓶中信',short:'瓶中信',r:14,rot:25,regions:['beach5','south5','bung','reef']},
 {id:'ring',float:true,name:'紅白救生圈',short:'救生圈',r:13,rot:20,regions:['quay','bung','dock5','plaza5']},
 {id:'anchor',name:'船錨',short:'船錨',r:15,rot:20,regions:['quay','dock5','bung','reef']},
 {id:'pearl',name:'珍珠貝',short:'珍珠貝',r:14,rot:15,regions:['reef','south5','beach5','bung']},
 {id:'coconut',float:true,name:'椰子',short:'椰子',r:12,rot:20,regions:['palms','beach5','plaza5','south5']},
 {id:'sailorhat',name:'水手帽',short:'水手帽',r:14,rot:20,regions:['quay','town5','bung','dock5']},
 {id:'duck',float:true,name:'黃色小鴨',short:'小鴨',r:13,rot:15,regions:['bung','south5','plaza5','beach5']},
 {id:'spyglass',name:'單筒望遠鏡',short:'望遠鏡',r:15,rot:30,regions:['reef','bung','quay','palms']}];
LEVELS[5].types=TYPES5;
BORROW[5]=[['bottle',{1:['banks','plaza','village','banks'],2:['farmS','farm','farmS','farm'],3:['lake','station','inn','lake'],4:['falls','camp','plaza4','falls']}],
 ['duck',{1:['banks','plaza','banks','village'],2:['farm','farmS','farm','farmS'],3:['onsen','lake','inn','onsen'],4:['falls','plaza4','camp','falls']}],
 ['spyglass',{1:['top','village','plaza','banks'],2:['farmS','farm','farmS','farm'],3:['station','slope','inn','station'],4:['camp','back4','plaza4','camp']}],
 ['sailorhat',{1:['plaza','village','banks','plaza'],2:['farmS','farm','farm','farmS'],3:['inn','station','inn','lake'],4:['camp','plaza4','temple','camp']}]];

/* ================= 地形與水：淺灘礁湖＋幾座小島＋木棧道 ================= */
/* 島（p 是邊緣起伏的相位）。島與沙洲、木棧道、市場平台以外都是水 */
const ISL=[{cx:800,cy:1120,rx:310,ry:250,p:.4},{cx:1900,cy:480,rx:220,ry:150,p:1.7},{cx:1620,cy:1700,rx:450,ry:330,p:2.6},{cx:1060,cy:2230,rx:330,ry:160,p:3.9},{cx:1960,cy:2240,rx:150,ry:90,p:5.1},
 {cx:760,cy:1800,rx:180,ry:110,p:.8},{cx:1320,cy:560,rx:150,ry:90,p:2.1}];
const BARS=[{cx:1080,cy:760,rx:140,ry:38,p:.9},{cx:2090,cy:1000,rx:90,ry:30,p:1.1},{cx:1500,cy:2400,rx:140,ry:36,p:4.4},{cx:560,cy:1560,rx:80,ry:28,p:3.3}];
/* 場地外雲下面的小島（只是佈景：不算陸地、不放人物物件，椰子樹由 index.html 的 edgeDeco 種） */
const EXTRA5=[{cx:385,cy:560,rx:120,ry:70,p:1.2},{cx:375,cy:2110,rx:140,ry:78,p:2.2},{cx:2335,cy:760,rx:105,ry:62,p:.3},{cx:2345,cy:1560,rx:125,ry:72,p:3.1},{cx:820,cy:2665,rx:160,ry:70,p:4.2},{cx:1860,cy:2655,rx:130,ry:60,p:.7}];
const wob=(I,a)=>1+.07*Math.sin(3*a+I.p)+.04*Math.sin(5*a+I.p*2);
const inBlob=(I,x,y,pad=0)=>{const dx=(x-I.cx)/(I.rx+pad),dy=(y-I.cy)/(I.ry+pad*.75),a=Math.atan2(dy,dx),w=wob(I,a);return dx*dx+dy*dy<w*w};
const blobD=(I,pad=0,n=72)=>{let d='';for(let i=0;i<n;i++){const a=i/n*Math.PI*2,w=wob(I,a);d+=(i?' L':'M')+f(I.cx+Math.cos(a)*(I.rx+pad)*w)+','+f(I.cy+Math.sin(a)*(I.ry+pad*.75)*w)}return d+'Z'};
/* 木棧道（可以走，人和東西可以放上去） */
const WALKS=[[[1300,1060],[1450,1010],[1600,930],[1740,830],[1830,660]],
 [[1180,1240],[1270,1340],[1360,1450]],
 [[2000,1580],[2090,1440],[2130,1290],[2070,1150]],
 [[1380,1950],[1280,2060],[1170,2100]],
 [[780,1360],[770,1700]],
 [[1200,925],[1280,700],[1300,640]]];
const MAINW=WALKS.length;
const BUNG=[[1430,950],[1560,870],[1650,1030],[1720,740],[1800,930],[2170,1400],[2010,1340],[2170,1210],[880,1560],[1170,690]];
const nearOnWalk=(x,y)=>{let best=null,bd=1e9;for(const w of WALKS.slice(0,MAINW))for(let i=0;i<w.length-1;i++){const [ax,ay]=w[i],[bx,by]=w[i+1],t=Math.max(0,Math.min(1,((x-ax)*(bx-ax)+(y-ay)*(by-ay))/((bx-ax)**2+(by-ay)**2))),px=ax+t*(bx-ax),py=ay+t*(by-ay),d=Math.hypot(x-px,y-py);if(d<bd){bd=d;best=[px,py]}}return best};
BUNG.forEach(([x,y])=>WALKS.push([[x,y-16],nearOnWalk(x,y-16)]));
const segD=(x,y,[ax,ay],[bx,by])=>{const t=Math.max(0,Math.min(1,((x-ax)*(bx-ax)+(y-ay)*(by-ay))/((bx-ax)**2+(by-ay)**2)));return Math.hypot(x-(ax+t*(bx-ax)),y-(ay+t*(by-ay)))};
const onWalk=(x,y)=>WALKS.some(w=>{for(let i=0;i<w.length-1;i++)if(segD(x,y,w[i],w[i+1])<23)return true;return false});
/* 魚市場：蓋在水上的木平台，和漁港島東岸接在一起 */
const DECK=[[1010,930],[1120,895],[1240,910],[1320,980],[1335,1100],[1280,1220],[1150,1265],[1030,1210],[985,1080]];
const inPoly=(P,x,y)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if(((yi>y)!==(yj>y))&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
const land=(x,y)=>ISL.some(I=>inBlob(I,x,y))||BARS.some(I=>inBlob(I,x,y))||inPoly(DECK,x,y)||onWalk(x,y);
const sea=(x,y)=>!land(x,y);
WATERFN[5]=sea;
H.EDGELAND[5]=(x,y)=>EXTRA5.some(I=>inBlob(I,x,y,-48));
const LH={x:1900,y:540};

Object.assign(REG,{beach5:{x:560,y:880,w:600,h:150},quay:{x:990,y:900,w:340,h:360},dock5:{x:560,y:1100,w:520,h:260},palms:{x:590,y:1700,w:350,h:220},
 reef:{x:1690,y:340,w:430,h:300},bung:{x:1150,y:600,w:1050,h:1000},town5:{x:1200,y:1400,w:820,h:290},plaza5:{x:1240,y:1690,w:800,h:300},
 south5:{x:740,y:2090,w:1380,h:290},all5:{x:540,y:340,w:1640,h:2060}});
SCREG[5]=['beach5','quay','dock5','palms','reef','bung','town5','plaza5','south5','all5'];
const PLZ={cx:1720,cy:1830,rx:180,ry:96};

/* 點燈塔：燈亮起來，光束轉一圈（不算點錯） */
let beaming=false;
TAPHOOKS[5]=(x,y)=>{if(Math.abs(x-LH.x)>34||y>LH.y+6||y<LH.y-250)return false;if(beaming)return true;
 const bm=document.getElementById('lhBeam'),gl=document.getElementById('lhGlow');if(!bm)return false;beaming=true;
 try{tone(520,.12,'sine',.04);setTimeout(()=>tone(780,.16,'sine',.035),160)}catch(_){}
 const t0=performance.now(),D=1500;
 const step=now=>{const k=Math.min(1,(now-t0)/D),a=-90+360*k,o=Math.sin(Math.PI*Math.min(1,k*1.15));
  bm.setAttribute('transform',`rotate(${a.toFixed(1)})`);bm.setAttribute('opacity',(o*.85).toFixed(2));if(gl)gl.setAttribute('opacity',(.25+.6*o).toFixed(2));
  if(k<1)requestAnimationFrame(step);else{bm.setAttribute('opacity','0');if(gl)gl.setAttribute('opacity','.25');beaming=false}};
 requestAnimationFrame(step);return true};

const DEEP='#2f9db6',MID='#4fbfc8',LAG='#7fd6cf',SHAL='#a8e6dc',VSHAL='#cdefe3',SANDL='#f3e5bb';
function ground5(){const NS_='stroke="none"';
 let s=`<defs><pattern id="plank5" width="12" height="40" patternUnits="userSpaceOnUse"><rect width="12" height="40" fill="${WOOD2}"/><path d="M0,0 V40" stroke="${WOOD}" stroke-width="1.2"/></pattern></defs>`;
 // 天空、遠方小島、深海
 s+=`<rect x="0" y="-400" width="2700" height="560" fill="#dcecef" ${NS_}/>`;
 s+=`<path d="M560,150 Q620,96 700,120 Q760,90 820,150Z M1240,150 Q1290,112 1350,128 Q1390,118 1420,150Z M1600,150 Q1640,128 1690,150Z" fill="#a9c6c0" stroke-width="1.6"/>`;
 s+=`<rect x="0" y="148" width="2700" height="3100" fill="${DEEP}" ${NS_}/><path d="M0,150 H2700" fill="none" stroke-width="1.6"/>`;
 // 礁湖：一圈一圈越來越淺（深藍 → 湛藍 → 淺綠藍）
 const LAGOON=[{cx:1380,cy:1450,rx:900,ry:1200,p:.3}];
 s+=`<path d="${blobD(LAGOON[0],60)}" fill="${MID}" ${NS_}/><path d="${blobD(LAGOON[0],-40)}" fill="${LAG}" ${NS_}/>`;
 [...ISL,...BARS,...EXTRA5].forEach(I=>{s+=`<path d="${blobD(I,170)}" fill="${LAG}" ${NS_}/>`});
 [...ISL,...BARS,...EXTRA5].forEach(I=>{s+=`<path d="${blobD(I,95)}" fill="${SHAL}" ${NS_}/>`});
 [...ISL,...BARS,...EXTRA5].forEach(I=>{s+=`<path d="${blobD(I,38)}" fill="${VSHAL}" ${NS_}/>`});
 // 水光紋、深海浪
 let wv='';for(let i=0;i<320;i++){const x=sr(300,2440),y=sr(170,3000);if(land(x,y))continue;const w=sr(10,20);wv+=`M${f(x)},${f(y)} q${f(w/2)},-4 ${f(w)},0 q${f(w/2)},4 ${f(w)},0 `}
 s+=`<path d="${wv}" fill="none" stroke="#e6faf6" stroke-width="1.5" opacity=".8"/>`;
 // 淺水裡的珊瑚、海草、魚影
 let co='';for(let i=0;i<120;i++){const x=sr(540,2200),y=sr(400,2620);if(land(x,y))continue;if(![...ISL,...BARS].some(I=>inBlob(I,x,y,120)))continue;const c=pk(['#f08a8a','#f5b46a','#e86a9a','#f6d27a']);
  co+=r()<.6?`<g transform="translate(${f(x)},${f(y)})" opacity=".85"><path d="M0,0 Q-6,-8 -4,-14 M0,0 Q2,-10 6,-14 M0,0 Q-1,-6 1,-10" fill="none" stroke="${c}" stroke-width="3"/></g>`:`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(6,11))}" ry="${f(sr(3,5))}" fill="${c}" opacity=".7" ${NS_}/>`}
 for(let i=0;i<26;i++){const x=sr(560,2200),y=sr(500,2600);if(land(x,y))continue;co+=`<path d="M${f(x)},${f(y)} q6,-5 14,0 l5,-4 v8 l-5,-4 q-8,5 -14,0Z" fill="#2f8fa6" opacity=".35" ${NS_}/>`}
 s+=co;
 // 島：浪花白邊 → 沙灘 → 草地
 [...ISL,...BARS,...EXTRA5].forEach(I=>{s+=`<path d="${blobD(I,10)}" fill="none" stroke="#f4fffc" stroke-width="7" opacity=".9"/>`});
 [...ISL,...EXTRA5].forEach(I=>{s+=`<path d="${blobD(I)}" fill="${SANDL}" stroke-width="2.2"/>`});
 BARS.forEach(I=>{s+=`<path d="${blobD(I)}" fill="${SANDL}" stroke-width="1.8"/>`});
 [...ISL,...EXTRA5].forEach(I=>{s+=`<path d="${blobD(I,I.rx<200?-40:-62)}" fill="${GRASS}" stroke-width="1.8"/>`});
 // 沙灘紋路、腳印
 let rp='';for(let i=0;i<260;i++){const x=sr(540,2200),y=sr(380,2560);const I=ISL.find(I=>inBlob(I,x,y))||BARS.find(I=>inBlob(I,x,y));if(!I||inBlob(I,x,y,I.rx<200?-44:-66))continue;
  rp+=r()<.75?`M${f(x)},${f(y)} q6,-3 12,0 `:`M${f(x)},${f(y)} l1,0 M${f(x+5)},${f(y-4)} l1,0 `}
 s+=`<path d="${rp}" fill="none" stroke="#d8c18a" stroke-width="1.6"/>`;
 // 燈塔島邊的礁岩
 let rk='';for(let i=0;i<60;i++){const a=sr(0,Math.PI*2),I=ISL[1],x=I.cx+Math.cos(a)*I.rx*sr(.8,1.05),y=I.cy+Math.sin(a)*I.ry*sr(.8,1.05);if(Math.cos(a)<-.3&&Math.sin(a)>0)continue;
  rk+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(10,24))}" ry="${f(sr(6,12))}" fill="${pk([ROCK,ROCK2,'#7d7a71'])}" stroke-width="1.6"/>`}
 s+=rk;
 // 木棧道與水上平台的倒影
 const walkD=w=>'M'+w.map(p=>f(p[0])+','+f(p[1])).join(' L');
 WALKS.forEach(w=>s+=`<path d="${walkD(w)}" fill="none" stroke="#3a8ea0" stroke-width="44" opacity=".25" transform="translate(5,9)"/>`);
 s+=`<path d="M${DECK.map(p=>p.join(',')).join(' L')}Z" fill="#3a8ea0" opacity=".25" ${NS_} transform="translate(6,12)"/>`;
 // 木樁
 let po='';WALKS.forEach(w=>{for(let i=0;i<w.length-1;i++){const [ax,ay]=w[i],[bx,by]=w[i+1],L=Math.hypot(bx-ax,by-ay);for(let t=0;t<=L;t+=46){const x=ax+(bx-ax)*t/L,y=ay+(by-ay)*t/L;if(land(x,y+26)&&!onWalk(x,y+26))continue;po+=`<rect x="${f(x-17)}" y="${f(y+10)}" width="5" height="14" fill="${WOOD}" stroke-width="1.2"/><rect x="${f(x+12)}" y="${f(y+10)}" width="5" height="14" fill="${WOOD}" stroke-width="1.2"/>`}}});
 DECK.forEach(([x,y])=>po+=`<rect x="${x-3}" y="${y}" width="6" height="18" fill="${WOOD}" stroke-width="1.2"/>`);
 s+=po;
 // 木棧道
 WALKS.forEach(w=>{for(let i=0;i<w.length-1;i++){const [ax,ay]=w[i],[bx,by]=w[i+1],Ln=Math.hypot(bx-ax,by-ay);if(Ln<1)continue;const ux=(bx-ax)/Ln,uy=(by-ay)/Ln,nx=-uy,ny=ux;
  s+=`<path d="M${f(ax+nx*13)},${f(ay+ny*13)} L${f(bx+nx*13)},${f(by+ny*13)} M${f(ax-nx*13)},${f(ay-ny*13)} L${f(bx-nx*13)},${f(by-ny*13)}" fill="none" stroke="${WOOD}" stroke-width="3.4"/>`;
  let pk_='';for(let t=4;t<=Ln-3;t+=11){const x=ax+ux*t,y=ay+uy*t,h=16+((t*7)%3)*.6,w2=4.6;pk_+=`<path d="M${f(x+nx*h-ux*w2)},${f(y+ny*h-uy*w2)} L${f(x+nx*h+ux*w2)},${f(y+ny*h+uy*w2)} L${f(x-nx*h+ux*w2)},${f(y-ny*h+uy*w2)} L${f(x-nx*h-ux*w2)},${f(y-ny*h-uy*w2)}Z" fill="${['#c99a5b','#b98a4f','#d4a868'][Math.floor(t/11)%3]}" stroke-width="1.3"/>`}
  s+=pk_}});
 // 市場水上木平台
 s+=`<path d="M${DECK.map(p=>p.join(',')).join(' L')}Z" fill="url(#plank5)" stroke-width="2.6"/>`;
 // 小廣場（小鎮島中間的圓形石板地，不畫道路）
 s+=`<ellipse cx="${PLZ.cx}" cy="${PLZ.cy}" rx="${PLZ.rx}" ry="${PLZ.ry}" fill="#e4dbc6" stroke-width="2"/><ellipse cx="${PLZ.cx}" cy="${PLZ.cy}" rx="${PLZ.rx-34}" ry="${PLZ.ry-20}" fill="none" stroke="#b3a68a" stroke-width="2" stroke-dasharray="10 8"/>`;
 // 草叢與小花
 let tf='',fl='';for(let i=0;i<520;i++){const x=sr(540,2200),y=sr(380,2560);const I=ISL.find(I=>inBlob(I,x,y,I.rx<200?-44:-70));if(!I)continue;if(((x-PLZ.cx)/PLZ.rx)**2+((y-PLZ.cy)/PLZ.ry)**2<1.15)continue;
  if(i%8===0)fl+=`<circle cx="${f(x)}" cy="${f(y)}" r="2.6" fill="${pk(['#f5c842','#fbf6ea','#e86a6a','#f0a8c8'])}" stroke-width="1"/>`;else tf+=`M${f(x)},${f(y)} l-3,-6 M${f(x)},${f(y)} l3,-6 `}
 s+=`<path d="${tf}" fill="none" stroke="#7f8f48" stroke-width="1.3"/>`+fl;
 return s}

/* ================= 道具 ================= */
const palm=(lean)=>{const L=lean??sr(-14,14),c1=pk(['#5f8a3a','#6f9a4a','#4f7a3a']);let s=`<ellipse cx="4" cy="2" rx="24" ry="5" fill="#000" opacity=".12" stroke="none"/>`;
 s+=`<path d="M-6,0 Q${f(L*.3-5)},-60 ${f(L-3)},-112 L${f(L+4)},-112 Q${f(L*.3+5)},-60 6,0Z" fill="#a8825c"/>`;
 let rg='';for(let y=-12;y>-108;y-=12){const x=L*(-y/112)*.8;rg+=`M${f(x-5)},${y} q5,3 10,0 `}s+=`<path d="${rg}" fill="none" stroke="#7a5a3a" stroke-width="1.2"/>`;
 const cx=L,cy=-114;[[-60,30],[-20,34],[20,34],[60,30],[-100,24],[100,24],[180,22]].forEach(([a,len])=>{const rad=(a-90)*Math.PI/180,ex=cx+Math.sin(a*Math.PI/180)*len,ey=cy+(Math.abs(a)>70?10:-6)-Math.cos(a*Math.PI/180)*len*.35;
  s+=`<path d="M${f(cx)},${f(cy)} Q${f((cx+ex)/2)},${f(Math.min(cy,ey)-14)} ${f(ex)},${f(ey+6)} Q${f((cx+ex)/2)},${f(Math.min(cy,ey)-2)} ${f(cx)},${f(cy)}Z" fill="${shade(c1,a%40?0:.1)}" stroke-width="1.7"/>`});
 s+=`<circle cx="${f(cx-4)}" cy="${f(cy+6)}" r="5" fill="#8a5a3a" stroke-width="1.5"/><circle cx="${f(cx+4)}" cy="${f(cy+7)}" r="5" fill="#7a4e30" stroke-width="1.5"/>`;return s};
/* 漁網堆：一團鬆鬆堆著的漁網（菱形網目、邊緣垂下來），上緣串著一排浮球，旁邊一捲麻繩 */
const netPile=()=>{let s=`<path d="M-24,0 Q-26,-8 -19,-11 Q-18,-19 -9,-19 Q-4,-26 4,-22 Q12,-25 16,-17 Q24,-15 23,-6 Q26,-2 24,0Z" fill="#8fb3a8"/>`;
 let m='';for(let k=-30;k<=30;k+=6)m+=`M${k},0 L${k+16},-26 M${k},0 L${k-16},-26 `;
 s+=`<clipPath id="npc"><path d="M-24,0 Q-26,-8 -19,-11 Q-18,-19 -9,-19 Q-4,-26 4,-22 Q12,-25 16,-17 Q24,-15 23,-6 Q26,-2 24,0Z"/></clipPath><path d="${m}" fill="none" stroke="#5f857b" stroke-width="1.1" clip-path="url(#npc)"/>`;
 s+=`<path d="M-24,0 Q-26,-8 -19,-11 Q-18,-19 -9,-19 Q-4,-26 4,-22 Q12,-25 16,-17 Q24,-15 23,-6 Q26,-2 24,0Z" fill="none"/>`;
 s+=`<path d="M-17,-12 Q-6,-20 4,-17 Q12,-15 19,-9" fill="none" stroke="#e8d6b0" stroke-width="1.6"/>`+[[-14,-14,'#f0802a'],[-4,-18,'#fbf6ea'],[6,-16.5,'#f0802a'],[15,-11,'#fbf6ea']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="3.2" fill="${c}" stroke-width="1.2"/>`).join('');
 s+=`<path d="M-22,0 l-2,4 M-14,0 l-1,4 M12,0 l1,4 M20,0 l2,4" fill="none" stroke="#5f857b" stroke-width="1.2"/>`;
 return s+`<ellipse cx="30" cy="-3" rx="7" ry="4" fill="#c99a5b" stroke-width="1.4"/><ellipse cx="30" cy="-3.5" rx="3.6" ry="1.8" fill="none" stroke="#8a5a3a" stroke-width="1.1"/>`};
const floatPile=()=>[[-10,-7,'#f0802a'],[9,-7,'#fbf6ea'],[0,-19,'#f0802a'],[-3,-6,'#fbf6ea']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="7.5" fill="${c}"/><path d="M${x-5},${y-2} q5,-4 10,0" fill="none" stroke="${shade(c,-.2)}" stroke-width="1"/>`).join('')+`<path d="M-14,-2 Q0,4 14,-2" fill="none" stroke="${WOOD2}" stroke-width="1.6"/>`;
const sandcastle=()=>`<ellipse cx="2" cy="1" rx="24" ry="4" fill="#000" opacity=".1" stroke="none"/><path d="M-22,0 Q-24,-8 -20,-12 H20 Q24,-8 22,0Z" fill="#ead39a"/>`+[[-12,14],[12,14],[0,24]].map(([x,h])=>`<path d="M${x-7},-12 L${x-6},${-12-h} Q${x},${-14-h} ${x+6},${-12-h} L${x+7},-12Z" fill="#e8cf94"/><path d="M${x-6},${-12-h*.5} H${x+6}" fill="none" stroke="#c9ab6a" stroke-width="1.1"/>`).join('')+`<path d="M-3,-38 v-8" fill="none" stroke-width="1.4"/><path d="M-3,-46 l9,3 l-9,3Z" fill="${pk(['#3f8f8a','#d8413a','#5a86b0'])}" stroke-width="1.1"/><path d="M-16,-4 q3,-5 6,0Z" fill="#f2c6cf" stroke-width="1"/><path d="M8,-4 q3,-5 6,0Z" fill="#fbf6ea" stroke-width="1"/><circle cx="0" cy="-20" r="2.4" fill="#f5c842" stroke-width="1"/>`;
const reefRock=()=>`<path d="M-26,0 L-22,-12 L-14,-16 L-10,-26 L0,-22 L8,-30 L16,-20 L24,-14 L26,0Z" fill="#6b6e70"/><path d="M-10,-26 L-4,-14 M8,-30 L6,-16 M16,-20 L12,-8" fill="none" stroke="#55585a" stroke-width="1.6"/>`+[[-14,-6],[-10,-10],[4,-8],[14,-6],[18,-10]].map(([x,y])=>`<path d="M${x-2.5},${y} l1.2,-3 h2.6 l1.2,3Z" fill="#e6e0d0" stroke-width=".9"/>`).join('')+`<path d="M-22,0 q-2,-10 3,-14 M-18,0 q3,-8 0,-12 M20,0 q4,-9 0,-13" fill="none" stroke="#4f8a3a" stroke-width="2.4"/>`;
const parasol=()=>{const c=pk(['#d8413a','#3f8f8a','#e8833a','#5a86b0']);return `<rect x="-20" y="-6" width="34" height="10" rx="2" fill="${pk(['#f5c842','#fbf6ea','#f0a8c8'])}" stroke-width="1.6" transform="rotate(-6)"/><path d="M2,0 L-2,-54" fill="none" stroke-width="2.2"/><path d="M-30,-48 Q-2,-74 26,-56 Q-2,-60 -30,-48Z" fill="${c}"/><path d="M-30,-48 Q-16,-58 -2,-56 Q12,-56 26,-56 M-2,-64 L-2,-56 M-16,-59 L-16,-52 M12,-62 L12,-56" fill="none" stroke="#fbf6ea" stroke-width="2.6" opacity=".9"/>`};
const beachHut=()=>{const roof=pk(['#c9a05a','#b88f4c','#d4ad66']),wall=pk(['#e8cfa0','#e2c494','#ecd6aa']);let s=`<ellipse cx="4" cy="2" rx="46" ry="6" fill="#000" opacity=".12" stroke="none"/><rect x="-32" y="-54" width="64" height="54" fill="${wall}"/>`+[-22,-12,-2,8,18,28].map(x=>`<path d="M${x},-54 V0" fill="none" stroke="#c9a978" stroke-width="1.1"/>`).join('')+`<rect x="-32" y="-54" width="64" height="54" fill="none"/>`;
 s+=`<rect x="-9" y="-32" width="18" height="32" fill="#8a5a3a"/><rect x="14" y="-44" width="12" height="11" rx="1.5" fill="#9fd3e0" stroke-width="1.3"/>`;
 s+=`<path d="M-44,-50 Q-20,-98 4,-100 Q28,-98 46,-50 Q2,-58 -44,-50Z" fill="${roof}"/>`;let th='';for(let x=-36;x<44;x+=7)th+=`M${x},${f(-52-Math.max(0,34-Math.abs(x-2))*.9)} L${x+2},-52 `;
 s+=`<path d="${th}" fill="none" stroke="${shade(roof,-.25)}" stroke-width="1.2"/><path d="M-44,-50 Q2,-58 46,-50" fill="none" stroke-width="2"/>`;
 if(r()<.7)s+=`<path d="M-24,-8 q4,-10 8,0Z" fill="${pk(['#e86a9a','#f5c842','#e86a6a'])}" stroke-width="1.1"/>`;return s};
const house5=(w,h)=>{const c=pk(['#3f6fa8','#3f8f8a','#c4572f','#5a86b0']),dome=r()<.35;let s=`<ellipse cx="6" cy="3" rx="${w/2+12}" ry="7" fill="#000" opacity=".12" stroke="none"/><rect x="${-w/2}" y="${-h}" width="${w}" height="${h}" fill="#fbf9f3"/><path d="M${w/2},0 L${w/2+12},-6 L${w/2+12},${-h-6} L${w/2},${-h}Z" fill="#e6e0d0"/>`;
 s+=dome?`<path d="M${-w*.32},${-h} Q${-w*.32},${-h-w*.5} 0,${-h-w*.5} Q${w*.32},${-h-w*.5} ${w*.32},${-h}Z" fill="${c}"/><path d="M0,${-h-w*.5} v-8" fill="none" stroke-width="1.6"/><path d="M-4,${-h-w*.5-6} h8" fill="none" stroke-width="1.6"/><rect x="${-w/2-3}" y="${-h-5}" width="${w+3+12}" height="6" fill="#fbf9f3"/>`
  :(()=>{/* 斜屋頂：正面斜坡＋右邊山牆三角形，完整蓋住整個屋頂（不會看起來破洞） */const L=-w/2-7,R=w/2+7,Y=-h+3,RL=-w/2+6,RR=w/2+14,YR=-h-24,BR=w/2+20;
   let t=`<path d="M${R},${Y} L${BR},${-h-5} L${RR},${YR}Z" fill="${shade(c,-.22)}"/><path d="M${L},${Y} L${R},${Y} L${RR},${YR} L${RL},${YR}Z" fill="${c}"/>`;
   let ln='';for(let k=1;k<4;k++){const yy=Y+(YR-Y)*k/4,xl=L+(RL-L)*k/4,xr=R+(RR-R)*k/4;ln+=`M${f(xl)},${f(yy)} L${f(xr)},${f(yy)} `}
   return t+`<path d="${ln}" fill="none" stroke="${shade(c,-.25)}" stroke-width="1.3"/><path d="M${L},${Y} L${R},${Y} L${BR},${-h-5}" fill="none" stroke-width="2.4"/>`})();
 s+=`<path d="M-8,0 V-26 Q0,-34 8,-26 V0Z" fill="${c}"/>`;
 [[-w/2+16,-h+16],[w/2-16,-h+16]].forEach(([x,y])=>s+=`<rect x="${x-7}" y="${y-8}" width="14" height="14" rx="1" fill="${c}"/><path d="M${x},${y-8} v14 M${x-7},${y-1} h14" fill="none" stroke="#fbf9f3" stroke-width="1.4"/><path d="M${x-9},${y+7} h18" fill="none" stroke-width="2.2"/>`);
 if(r()<.6)s+=`<path d="M${-w/2+6},-4 q4,-12 10,-6 q6,-10 10,0" fill="#e86a9a" stroke-width="1.4"/>`;
 return s};
const warehouse=()=>{let s=`<ellipse cx="8" cy="3" rx="84" ry="8" fill="#000" opacity=".12" stroke="none"/><rect x="-74" y="-76" width="148" height="76" fill="#b9a382"/><path d="M74,0 L90,-8 L90,-84 L74,-76Z" fill="#9c8766"/><path d="M-82,-74 L0,-108 L82,-74Z" fill="#7f6a54"/><path d="M82,-74 L0,-108 L14,-114 L98,-82Z" fill="#6b5846"/>`;
 let pl='';for(let x=-66;x<74;x+=12)pl+=`M${x},-74 V0 `;s+=`<path d="${pl}" fill="none" stroke="#9c8766" stroke-width="1.2"/>`;
 s+=`<rect x="-24" y="-50" width="48" height="50" fill="#6b4a2b"/><path d="M-24,-50 L24,0 M24,-50 L-24,0" fill="none" stroke="#8a6a45" stroke-width="2"/>`;
 s+=`<path d="M-72,-70 Q-58,-40 -44,-70 Q-36,-44 -30,-70" fill="#6f8f8a" fill-opacity=".85" stroke-width="1.6"/><path d="M-68,-62 L-50,-62 M-62,-52 L-46,-54" fill="none" stroke="#a9c6c0" stroke-width="1"/>`+[[-60,-56],[-40,-60]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.4" fill="#f0802a" stroke-width="1.2"/>`).join('');
 s+=`<rect x="34" y="-60" width="30" height="16" fill="#3b5a8a"/><text x="49" y="-48" text-anchor="middle" font-size="10" fill="#fbf6ea" stroke="none" font-weight="700">漁會</text>`;return s};
const fishOnIce=(x,y,c)=>`<g transform="translate(${x},${y})"><path d="M-8,0 Q-2,-5 6,-1 L10,-4 L10,4 L6,1 Q-2,5 -8,0Z" fill="${c}" stroke-width="1.2"/><circle cx="-5" cy="-.6" r=".9" fill="${OL}" stroke="none"/></g>`;
const stall5=(kind)=>{const c=pk(['#3f8f8a','#5a86b0','#d8413a']);let s=`<ellipse cx="4" cy="2" rx="58" ry="6" fill="#000" opacity=".12" stroke="none"/><path d="M-48,0 V-64 M48,0 V-64" fill="none" stroke="${WOOD}" stroke-width="3"/>`;
 s+=`<rect x="-50" y="-34" width="100" height="34" fill="${WOOD2}"/><path d="M-50,-34 H50" fill="none" stroke-width="2.4"/><rect x="-46" y="-42" width="92" height="10" fill="#e6f4f6"/>`;
 if(kind==='fish')s+=fishOnIce(-30,-41,'#7aa0c0')+fishOnIce(-10,-42,'#e8833a')+fishOnIce(10,-41,'#9aa8b4')+fishOnIce(30,-42,'#7aa0c0')+`<path d="M-20,-46 q4,-4 8,0 q4,-4 8,0" fill="none" stroke="#e86a6a" stroke-width="1.6"/>`;
 else if(kind==='shell')s+=[[-30,-44,'#f2c6cf'],[-12,-45,'#fbf6ea'],[8,-44,'#f2c39a'],[28,-45,'#f2c6cf']].map(([x,y,cc])=>`<path d="M${x-7},${y+4} Q${x-6},${y-6} ${x},${y-7} Q${x+6},${y-6} ${x+7},${y+4}Z" fill="${cc}" stroke-width="1.2"/>`).join('');
 else s+=[[-30,-46],[-10,-46],[10,-46],[30,-46]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="7" fill="#8a5a3a" stroke-width="1.3"/><path d="M${x-3},${y-12} q3,4 6,0" fill="#6f9a4a" stroke-width="1"/>`).join('');
 s+=`<path d="M-56,-62 L56,-62 L50,-80 L-50,-80Z" fill="${c}"/>`+[-40,-20,0,20,40].map(x=>`<path d="M${x},-62 q5,8 10,0" fill="${c}" stroke-width="1.4"/>`).join('')+`<path d="M-44,-80 L-30,-62 M-12,-80 L-4,-62 M12,-80 L4,-62 M44,-80 L30,-62" fill="none" stroke="#fbf6ea" stroke-width="3" opacity=".8"/>`;
 return s};
const dryRack=()=>`<path d="M-30,0 V-40 M30,0 V-40 M-34,-38 H34" fill="none" stroke="${WOOD}" stroke-width="2.6"/>`+[-22,-8,6,20].map(x=>`<path d="M${x},-38 v6" fill="none" stroke-width="1"/><path d="M${x-4},-32 Q${x},-34 ${x+4},-32 L${x+3},-16 Q${x},-12 ${x-3},-16Z" fill="${pk(['#e8d6b0','#d9b98a','#c99a6a'])}" stroke-width="1.3"/>`).join('');
const crab=()=>`<path d="M-8,-2 l-5,3 M-7,0 l-4,5 M8,-2 l5,3 M7,0 l4,5" fill="none" stroke="#c4473c" stroke-width="1.6"/><ellipse cx="0" cy="-4" rx="8" ry="5.5" fill="#d8413a"/><path d="M-7,-7 Q-13,-12 -11,-15 Q-8,-13 -9,-10 M7,-7 Q13,-12 11,-15 Q8,-13 9,-10" fill="#d8413a" stroke-width="1.4"/><path d="M-3,-9 v-3 M3,-9 v-3" fill="none" stroke-width="1.2"/><circle cx="-3" cy="-12.5" r="1.4" fill="${OL}" stroke="none"/><circle cx="3" cy="-12.5" r="1.4" fill="${OL}" stroke="none"/>`;
const gull=()=>`<path d="M-2,0 V-4 M3,0 V-4" fill="none" stroke="#e8a03a" stroke-width="1.6"/><path d="M-10,-10 Q-8,-18 2,-17 Q10,-16 10,-9 Q4,-3 -6,-5Z" fill="#fbf9f3"/><path d="M-10,-11 Q-2,-14 6,-9 Q-2,-8 -10,-11Z" fill="#9aa8b4" stroke-width="1.2"/><circle cx="5" cy="-19" r="5" fill="#fbf9f3"/><path d="M9,-19 l6,1 l-6,2Z" fill="#f5c842" stroke-width="1.1"/><circle cx="6" cy="-20" r="1" fill="${OL}" stroke="none"/>`;
const seal=(o={})=>`<path d="M-22,0 Q-24,-10 -14,-14 Q-2,-20 8,-16 Q14,-22 20,-18 Q24,-12 18,-8 Q12,-2 2,0Z" fill="#8f9aa6"/><path d="M-22,0 l-6,-5 l2,7Z" fill="#8f9aa6" stroke-width="1.4"/><path d="M-4,-1 l-4,4 h6Z" fill="#7a8692" stroke-width="1.2"/><circle cx="16" cy="-18" r="1.4" fill="${OL}" stroke="none"/><ellipse cx="22" cy="-14" rx="2" ry="1.4" fill="${OL}" stroke="none"/><path d="M20,-12 l6,-1 M20,-11 l6,1" fill="none" stroke-width=".8"/>`;
const buoy=()=>`<path d="M-7,0 L-5,-14 L5,-14 L7,0Z" fill="#d8413a"/><path d="M-6,-6 H6" fill="none" stroke="#fbf6ea" stroke-width="3"/><path d="M0,-14 V-22" fill="none" stroke-width="1.6"/><circle cy="-23" r="2.4" fill="#f5c842" stroke-width="1.2"/><path d="M-12,1 q6,-3 12,0 q6,3 12,0" fill="none" stroke="#e8f6f6" stroke-width="1.6"/>`;
const swimmer=()=>{const c=pk(['#d8413a','#f5c842','#f0a8c8','#3f8f8a']);return `<g transform="scale(.8)">${kid({view:pk(['front','fq']),hat:-1,pose:'stand'})}</g>`.replace(/<rect x="-?\d+(\.\d+)?" y="-7"[^>]*>/g,'')+`<ellipse cx="0" cy="-8" rx="17" ry="6" fill="#86d8d0" stroke="none"/><path d="M-16,-12 a16,6 0 1 0 32,0 a16,6 0 1 0 -32,0Z M-9,-12 a9,3 0 1 1 18,0 a9,3 0 1 1 -18,0Z" fill="${c}" fill-rule="evenodd"/><path d="M-20,-6 q5,-3 10,0 q5,3 10,0 q5,-3 10,0 q5,3 10,0" fill="none" stroke="#e8f6f6" stroke-width="1.6"/>`};
const boat5=(c)=>{c=c||pk(['#3f6fa8','#d8413a','#3f8f8a','#e8a03a']);return `<path d="M-52,-14 L52,-14 L42,4 Q0,10 -46,4Z" fill="${c}"/><path d="M-50,-10 H50" fill="none" stroke="#fbf6ea" stroke-width="2.6"/><rect x="-6" y="-42" width="34" height="28" fill="#fbf6ea"/><rect x="0" y="-36" width="10" height="9" fill="#9fd3e0" stroke-width="1.3"/><rect x="14" y="-36" width="10" height="9" fill="#9fd3e0" stroke-width="1.3"/><path d="M-10,-46 H32" fill="none" stroke-width="2.4"/><path d="M-30,-14 V-60 M-30,-58 L-6,-46" fill="none" stroke-width="2"/><path d="M-30,-56 l-10,10" fill="none" stroke-width="1.2"/>`+[-44,-36].map(x=>`<circle cx="${x}" cy="-18" r="3" fill="#f0802a" stroke-width="1.1"/>`).join('')+`<path d="M-62,6 q8,-4 16,0 q8,4 16,0 M30,7 q8,-4 16,0 q8,4 16,0" fill="none" stroke="#e8f6f6" stroke-width="1.8"/>`};
const sail5=()=>{const c=pk(['#d8413a','#3f8f8a','#f5c842']);return `<path d="M0,-6 V-70" fill="none" stroke-width="2.6"/><path d="M3,-66 L34,-14 L3,-14Z" fill="#fbf9f3"/><path d="M-3,-58 L-26,-16 L-3,-16Z" fill="${c}"/><path d="M-38,-8 L38,-8 L30,4 L-30,4Z" fill="${WOOD}"/><path d="M-44,8 q8,-4 16,0 q8,4 16,0 M14,8 q8,-4 16,0 q8,4 16,0" fill="none" stroke="#e8f6f6" stroke-width="1.8"/>`};
/* 燈塔：紅白條紋，燈室有光暈；光束 #lhBeam 平常看不見，點燈塔才轉一圈 */
const lighthouse5=()=>{let s=`<ellipse cx="8" cy="3" rx="54" ry="8" fill="#000" opacity=".14" stroke="none"/><path d="M-36,0 L-30,-22 H30 L36,0Z" fill="${ROCK2}"/>`;
 s+=`<path d="M-24,-22 L-15,-196 L15,-196 L24,-22Z" fill="#fbf9f3"/>`;
 [[-22,-58],[-19,-110],[-17,-160]].forEach(([w,y],i)=>{const w2=w+2.6;s+=`<path d="M${w},${y} L${-w},${y} L${-w2+5},${y-26} L${w2-5},${y-26}Z" fill="#d8413a" stroke="none"/>`});
 s+=`<path d="M-24,-22 L-15,-196 L15,-196 L24,-22Z" fill="none"/><rect x="-7" y="-46" width="14" height="24" rx="6" fill="#3b5a8a"/><rect x="-4" y="-120" width="8" height="12" rx="3" fill="#9fd3e0" stroke-width="1.3"/>`;
 s+=`<rect x="-22" y="-202" width="44" height="8" fill="#3d3833"/><path d="M-20,-202 V-212 H20 V-202" fill="none" stroke-width="1.6"/>`;
 s+=`<g transform="translate(0,-226)"><circle id="lhGlow" r="34" fill="#fff3b0" opacity=".25" stroke="none"/><g id="lhBeam" opacity="0" transform="rotate(-90)"><path d="M0,0 L220,-34 L220,34Z" fill="#fff6c4" opacity=".75" stroke="none"/><path d="M0,0 L-220,-34 L-220,34Z" fill="#fff6c4" opacity=".75" stroke="none"/></g></g>`;
 s+=`<rect x="-14" y="-240" width="28" height="28" fill="#f6e08a"/><path d="M-14,-226 H14 M0,-240 V-212" fill="none" stroke-width="1.4"/><path d="M-18,-240 L0,-262 L18,-240Z" fill="#d8413a"/><circle cx="0" cy="-264" r="3" fill="#3d3833"/>`;
 return s};
/* 水上屋（使用者選 A、B 混合）：A 斜角屋＋平行四邊形甲板；B 圓形甲板＋圓錐茅草頂。木棧道接到甲板中間 */
const ROOFC=()=>pk(['#c9a05a','#b88f4c','#d4ad66']);
const stilts5=(xs,y0,y1)=>xs.map(x=>`<rect x="${x-2.5}" y="${y0}" width="5" height="${y1-y0}" fill="${WOOD}" stroke-width="1.3"/>`).join('');
const thatch5=(x0,x1,ytop,ybot,peak,c)=>{let d='';for(let x=x0+6;x<x1-4;x+=7)d+=`M${x},${f(ytop+Math.abs(x-peak)*.7)} L${x+2},${ybot} `;return `<path d="${d}" fill="none" stroke="${shade(c,-.25)}" stroke-width="1.2"/>`};
const bungA=()=>{const rc=ROOFC();let s=`<ellipse cx="6" cy="10" rx="62" ry="8" fill="#3a8ea0" opacity=".3" stroke="none"/>`+stilts5([-40,-10,20,38],-6,12);
 s+=`<path d="M-48,-6 L36,-6 L36,0 L-48,0Z" fill="${WOOD}"/><path d="M36,-6 L56,-30 L56,-24 L36,0Z" fill="#8a5a33"/><path d="M-48,-6 L36,-6 L56,-30 L-28,-30Z" fill="${WOOD2}"/>`+[1,2,3,4,5,6,7,8].map(i=>`<path d="M${-44+i*9},-6 L${-24+i*9},-30" fill="none" stroke="${WOOD}" stroke-width="1"/>`).join('');
 s+=`<path d="M-16,-14 L24,-14 L36,-28 L-4,-28Z" fill="#000" opacity=".12" stroke="none"/><path d="M-18,-14 L22,-14 L22,-54 L-18,-54Z" fill="#e8cfa0"/><path d="M22,-14 L36,-29 L36,-69 L22,-54Z" fill="#cdb07e"/><rect x="-5" y="-40" width="13" height="26" fill="#8a5a3a"/><rect x="11" y="-46" width="8" height="9" rx="1.5" fill="#9fd3e0" stroke-width="1.2"/><path d="M26,-42 l6,-6 v10 l-6,6Z" fill="#9fd3e0" stroke-width="1.2"/>`;
 s+=`<path d="M-28,-50 L2,-94 L30,-50Z" fill="${rc}"/><path d="M30,-50 L2,-94 L26,-104 L46,-66Z" fill="${shade(rc,-.12)}"/>`+thatch5(-26,28,-92,-51,2,rc)+`<path d="M-28,-50 L30,-50 L46,-66" fill="none" stroke-width="2"/>`;
 if(r()<.7)s+=`<rect x="-44" y="-22" width="18" height="6" rx="2" fill="${pk(['#f5c842','#e86a6a','#3f8f8a'])}" stroke-width="1.2"/>`;
 return s+`<path d="M-62,12 q8,-4 16,0 q8,4 16,0 M40,12 q8,-4 16,0" fill="none" stroke="#f4fffc" stroke-width="1.8"/>`};
const bungB=()=>{const rc=ROOFC();let s=`<ellipse cx="4" cy="8" rx="64" ry="12" fill="#3a8ea0" opacity=".3" stroke="none"/>`+stilts5([-44,-20,8,34,50],-10,12);
 s+=`<ellipse cx="0" cy="-10" rx="58" ry="20" fill="${WOOD}"/><ellipse cx="0" cy="-14" rx="58" ry="20" fill="${WOOD2}"/>`+[...Array(16)].map((_,i)=>{const a=i*Math.PI/8;return `<path d="M0,-14 L${f(58*Math.cos(a))},${f(-14+20*Math.sin(a))}" fill="none" stroke="${WOOD}" stroke-width="1"/>`}).join('');
 s+=`<path d="M-28,-18 V-58 Q0,-66 28,-58 V-18 Q0,-10 -28,-18Z" fill="#e8cfa0"/><path d="M12,-15 V-58 Q22,-60 28,-58 V-18 Q20,-15 12,-15Z" fill="#cdb07e" stroke="none"/><path d="M-28,-18 V-58 Q0,-66 28,-58 V-18 Q0,-10 -28,-18Z" fill="none"/>`;
 s+=`<rect x="-8" y="-46" width="16" height="31" rx="7" fill="#8a5a3a"/><rect x="14" y="-50" width="8" height="10" rx="2" fill="#9fd3e0" stroke-width="1.2"/>`;
 s+=`<path d="M-44,-54 Q-20,-62 0,-104 Q20,-62 44,-54 Q0,-44 -44,-54Z" fill="${rc}"/>`+thatch5(-40,44,-100,-52,0,rc)+`<path d="M-44,-54 Q0,-44 44,-54" fill="none" stroke-width="2"/><path d="M0,-104 v-8" fill="none" stroke-width="1.6"/>`;
 if(r()<.7)s+=`<path d="M38,-20 h14 v-6 h-14Z" fill="${pk(['#e86a6a','#f5c842','#5a86b0'])}" stroke-width="1.2"/>`;
 return s+`<path d="M-66,12 q8,-4 16,0 q8,4 16,0 M44,12 q8,-4 16,0" fill="none" stroke="#f4fffc" stroke-width="1.8"/>`};
const kayak5=()=>{const c=pk(['#f5c842','#e86a6a','#3f8f8a']);return `<path d="M-30,-4 Q0,-12 30,-4 Q0,6 -30,-4Z" fill="${c}"/><ellipse cx="2" cy="-6" rx="8" ry="3" fill="#3d3833"/>`+`<g transform="translate(2,-6) scale(.7)">${kid({view:'side',pose:'sit',hat:pk([1,-1])})}</g><path d="M-22,-24 L26,4" fill="none" stroke="${WOOD}" stroke-width="2"/><path d="M-40,2 q8,-4 16,0 q8,4 16,0" fill="none" stroke="#f4fffc" stroke-width="1.6"/>`};
const iceCart=()=>`<ellipse cx="4" cy="2" rx="36" ry="5" fill="#000" opacity=".12" stroke="none"/><rect x="-28" y="-34" width="52" height="28" rx="4" fill="#f0a8c8"/><path d="M-28,-24 H24" fill="none" stroke="#fbf6ea" stroke-width="3"/><circle cx="-16" cy="-4" r="6" fill="#6f7f8f"/><circle cx="12" cy="-4" r="6" fill="#6f7f8f"/><path d="M-2,-34 V-70" fill="none" stroke-width="2"/><path d="M-32,-62 Q-2,-84 28,-62Z" fill="#9fd3e0"/><path d="M-20,-66 L-14,-76 M10,-66 L4,-76" fill="none" stroke="#fbf6ea" stroke-width="2.4"/>`+[[-18,-38,'#f5c842'],[-6,-38,'#f0a8c8'],[6,-38,'#fbf6ea']].map(([x,y,c])=>`<path d="M${x-3},${y} L${x},${y+6} L${x+3},${y}Z" fill="#d9a85b" stroke-width="1"/><circle cx="${x}" cy="${y-2}" r="3.4" fill="${c}" stroke-width="1.1"/>`).join('');
const anchorStatue=()=>`<ellipse cx="4" cy="2" rx="44" ry="7" fill="#000" opacity=".12" stroke="none"/><path d="M-36,0 L-30,-16 H30 L36,0Z" fill="#d9cfb8"/><g transform="translate(0,-58) scale(2.6)">${ART.anchor}</g>`;
const lifeguard=()=>`<ellipse cx="4" cy="2" rx="30" ry="5" fill="#000" opacity=".12" stroke="none"/><path d="M-20,0 L-14,-56 M20,0 L14,-56 M-18,-24 L18,-24 M-16,-24 L16,-44" fill="none" stroke="${WOOD}" stroke-width="3"/><rect x="-18" y="-64" width="36" height="10" fill="#fbf6ea"/><path d="M-22,-64 L0,-84 L22,-64Z" fill="#d8413a"/><path d="M18,-56 V-96" fill="none" stroke-width="1.8"/><path d="M18,-96 L32,-91 L18,-86Z" fill="#f5c842" stroke-width="1.2"/>`;
const shells=()=>[[-8,0,'#f2c6cf'],[4,-2,'#fbf6ea'],[10,2,'#f2c39a']].map(([x,y,c])=>`<path d="M${x-4},${y} Q${x-3},${y-6} ${x},${y-6} Q${x+3},${y-6} ${x+4},${y}Z" fill="${c}" stroke-width="1.1"/>`).join('');
const fishCrate=()=>`<rect x="-16" y="-14" width="32" height="14" fill="#6f9fc4"/><path d="M-16,-7 H16" fill="none" stroke="#5a86b0" stroke-width="1.2"/>`+fishOnIce(-6,-16,'#9aa8b4')+fishOnIce(6,-17,'#e8833a');

/* ---- 人物 ---- */
const BEACHSHIRT=['#f5c842','#e86a6a','#5a86b0','#3f8f8a','#fbf6ea','#f0a8c8','#e8833a'];
const bp=(o={})=>({hat:pk([1,1,1,4,-1,-1,-1]),shirt:pk(BEACHSHIRT),...o});
const fisher=(o={})=>({hat:pk([0,1,-1]),shirt:pk(['#3b5a8a','#6f7f8f','#c4572f','#5a86b0']),pants:pk(['#3d3833','#5a4a3a','#3b5a8a']),...o});
const rod=`<path d="M12,-18 L44,-46" fill="none" stroke="${WOOD}" stroke-width="2"/><path d="M44,-46 Q52,-20 50,8" fill="none" stroke-width=".8" opacity=".7"/>`;
const scissors=`<g transform="translate(16,-20) rotate(-30)"><path d="M0,0 L14,-3 M0,0 L14,3" fill="none" stroke="#6f7f8f" stroke-width="2.8"/><circle cx="-3" cy="-3" r="3" fill="none" stroke="#d8413a" stroke-width="2"/><circle cx="-3" cy="3" r="3" fill="none" stroke="#d8413a" stroke-width="2"/></g>`;
const surf=c=>`<path d="M-14,-4 Q-18,-40 -10,-60 Q-6,-40 -8,-4Z" fill="${c}" stroke-width="1.6"/><path d="M-12,-50 L-9,-10" fill="none" stroke="#fbf6ea" stroke-width="1.6"/>`;
Object.assign(KIND,{
 palm:{w:70,h:130,fn:()=>palm()},netPile:{w:60,h:28,fn:netPile},floatPile:{w:36,h:28,fn:floatPile},sandcastle:{w:40,h:34,fn:sandcastle},reefRock:{w:52,h:30,fn:reefRock},
 parasol:{w:62,h:70,fn:parasol},beachHut:{w:90,h:90,fn:beachHut},dryRack:{w:70,h:46,fn:dryRack},crab:{w:24,h:16,fn:crab},gull:{w:24,h:26,fn:gull},
 seal:{w:50,h:26,fn:seal},buoy:{w:22,h:26,fn:buoy,water:true},swimmer:{w:34,h:30,fn:swimmer,water:true},shells:{w:28,h:10,fn:shells},fishCrate:{w:34,h:20,fn:fishCrate},
 iceCart:{w:64,h:80,fn:iceCart},lifeguard:{w:44,h:96,fn:lifeguard},
 starCookie:{w:28,h:28,fn:()=>T(0,-13,.9,DECOY.starCookie)},shellEmpty:{w:26,h:24,fn:()=>T(0,-12,.9,DECOY.shellEmpty)},bottleEmpty:{w:24,h:28,fn:()=>T(0,-13,.95,DECOY.bottleEmpty)},
 floatPink:{w:28,h:28,fn:()=>T(0,-13,.95,DECOY.floatPink)},harpoon:{w:24,h:36,fn:()=>T(0,-17,1,DECOY.harpoon)},clamShut:{w:28,h:24,fn:()=>T(0,-11,.9,DECOY.clamShut)},
 yarnBall:{w:26,h:26,fn:()=>T(0,-12,.9,DECOY.yarnBall)},chefHat:{w:28,h:28,fn:()=>T(0,-12,.95,DECOY.chefHat)},lemon:{w:28,h:22,fn:()=>T(0,-10,.9,DECOY.lemon)},paperRoll:{w:32,h:24,fn:()=>T(0,-12,.95,DECOY.paperRoll)},
 walker5:{w:30,h:62,fn:()=>{const v=pickView(),p=walkPose(v);return act(0,0,r()<.5?1:-1,bp({view:v,pose:p}),true)}},
 surfer:{w:34,h:66,fn:()=>act(0,0,r()<.5?1:-1,bp({view:pk(['side','fq','bq']),pose:'walk',extra:surf(pk(['#f5c842','#3f8f8a','#e86a6a']))}),true)},
 sunbathe:{w:70,h:26,fn:()=>{const t=pk(['#f5c842','#3f8f8a','#f0a8c8','#e86a6a','#5a86b0']),sk=pk(H.SKIN),hr=pk(H.HAIR),sw=pk(['#d8413a','#3b5a8a','#f5c842','#3f8f8a','#e86a9a']);
  /* 躺在毛巾上做日光浴：從斜上方看，平躺的人（頭、泳衣、手腳、太陽眼鏡），不用直立人物旋轉 */
  return `<path d="M-34,-2 L28,-2 L34,-16 L-28,-16Z" fill="${t}"/><path d="M-30,-6 L30,-6 M-29,-11 L32,-11" fill="none" stroke="#fbf6ea" stroke-width="2" opacity=".85"/><path d="M-34,-2 L28,-2 L34,-16 L-28,-16Z" fill="none" stroke-width="1.6"/>`+
  `<path d="M-26,-10 L-12,-9 M-26,-6 L-12,-7" fill="none" stroke="${OL}" stroke-width="5.4"/><path d="M-26,-10 L-12,-9 M-26,-6 L-12,-7" fill="none" stroke="${sk}" stroke-width="3.4"/>`+
  `<ellipse cx="-2" cy="-8.5" rx="12" ry="5.2" fill="${sk}"/><path d="M-8,-12.8 Q-2,-14 3,-13 L3,-4 Q-2,-3 -8,-4.2Z" fill="${sw}" stroke-width="1.4"/>`+
  `<path d="M2,-12 Q8,-15 12,-12 M2,-5 Q8,-2 12,-5" fill="none" stroke="${OL}" stroke-width="4.6"/><path d="M2,-12 Q8,-15 12,-12 M2,-5 Q8,-2 12,-5" fill="none" stroke="${sk}" stroke-width="2.8"/>`+
  `<circle cx="17" cy="-8.5" r="7" fill="${sk}"/><path d="M19,-15.2 Q26,-13 24,-5 Q22,-3 19,-2 Q23,-8.5 19,-15.2Z" fill="${hr}" stroke-width="1.3"/><path d="M13,-11 h3 M13,-6 h3 M16,-11 v5" fill="none" stroke="${OL}" stroke-width="2.4"/><path d="M11,-8.5 q-1,1.5 0,2" fill="none" stroke-width="1"/>`+
  (r()<.5?`<ellipse cx="-34" cy="-21" rx="9" ry="3" fill="#e8c46a" stroke-width="1.3"/><path d="M-39,-21 Q-39,-27 -34,-27 Q-29,-27 -29,-21Z" fill="#e8c46a" stroke-width="1.3"/><path d="M-39,-22.5 h10" fill="none" stroke="#c4572f" stroke-width="1.6"/>`:'')+
  (r()<.4?`<rect x="30" y="-20" width="7" height="10" rx="1.5" fill="${pk(['#e86a6a','#f5c842'])}" stroke-width="1.2"/>`:'')}},
 sandPlay:{w:60,h:50,fn:()=>act(-14,0,1,bp({pose:'crouch',hat:-1,top:'bare',bottom:'trunks',skin:pk([H.SKIN[2],H.SKIN[3],H.SKIN[4]]),pants:pk(['#d8413a','#3f8f8a','#f5c842','#5a86b0'])}),'bob')+T(16,0,.8,sandcastle())+`<path d="M-2,-4 h8 l-1,6 h-6Z" fill="${pk(['#d8413a','#5a86b0','#f5c842'])}" stroke-width="1.2"/>`},
 shellPick:{w:40,h:46,fn:()=>act(0,0,r()<.5?1:-1,bp({pose:'crouch'}),'bob')+`<path d="M12,-4 Q14,-10 18,-10 Q22,-10 22,-4Z" fill="#f2c6cf" stroke-width="1.1"/>`},
 netMend:{w:76,h:56,fn:()=>act(-18,0,1,fisher({pose:'sit'}),'bob')+T(20,0,.9,netPile())},
 fishing:{w:56,h:66,fn:()=>act(-8,0,1,fisher({pose:'hold',extra:rod}),'bob')},
 fishBuy:{w:70,h:62,fn:()=>act(-14,0,1,bp({pose:'reach'}),'bob')+act(16,0,-1,fisher({pose:'hold',extra:`<path d="M12,-18 q6,-4 12,0 q-6,4 -12,0Z" fill="#7aa0c0" stroke-width="1.1"/>`}),'bob')},
 iceBuy:{w:60,h:62,fn:()=>act(0,0,r()<.5?1:-1,bp({pose:'hold',extra:`<path d="M10,-20 l3,8 l3,-8Z" fill="#d9a85b" stroke-width="1"/><circle cx="13" cy="-22" r="3.4" fill="${pk(['#f0a8c8','#f5c842','#fbf6ea'])}" stroke-width="1.1"/>`}),'bob')},
 gullFeed:{w:60,h:62,fn:()=>act(-10,0,1,bp({pose:'reach'}),'bob')+T(18,0,1,gull())},
 beachBall:{w:96,h:62,fn:()=>act(-30,0,1,bp({pose:'up2',hat:-1}),'hop')+wrapAn('float',`<circle cx="0" cy="-58" r="8" fill="#fbf6ea"/><path d="M-8,-58 Q0,-62 8,-58 M0,-66 Q-4,-58 0,-50" fill="none" stroke="#d8413a" stroke-width="2.4"/>`,true)+act(30,0,-1,bp({pose:'up2',hat:-1}),'hop')}
});
['bungalow','palm','beachHut','warehouse','stall5','lighthouse5','house5','iceCart','lifeguard','anchorStatue','ferry5','boat5','sail5','dryRack','reefRock'].forEach(k=>HEAVY.add(k));
['palm','netPile','floatPile','sandcastle','reefRock','beachHut','parasol','fishCrate'].forEach(k=>OCCK.add(k));
['palm','netPile','floatPile','sandcastle','reefRock'].forEach(k=>HOSTK.add(k));
Object.assign(HOSTN,{palm:'椰子樹',netPile:'漁網堆',floatPile:'浮球堆',sandcastle:'沙堡',reefRock:'礁岩'});
Object.assign(ANIM,{kayak:['rock'],crab:['wig','hop'],gull:['peck','bob'],seal:['bob'],buoy:['rock'],swimmer:['bob','rock'],boat5:['rock'],sail5:['rock'],ferry5:['rock'],palm:['sway']});
['buoy','swimmer','boat5','sail5','ferry5','kayak'].forEach(k=>ALWAYS.add(k));
Object.assign(POOL,{
 beach5:[['parasol',1.6],['sandcastle',.8],['walker5',1.6],['surfer',.5],['palm',.8],['shells',.8],['crab',.6],['gull',.6],['floatPile',.3],['netPile',.2],['starCookie',.3],['shellEmpty',.3],['bottleEmpty',.25],['floatPink',.3],['lemon',.2],['clamShut',.2]],
 quay:[['walker5',1.4],['fishCrate',1.2],['crate',.8],['barrel',.8],['netPile',.8],['floatPile',.6],['gull',.8],['cat',.4],['harpoon',.3],['chefHat',.25],['paperRoll',.2],['floatPink',.2],['palm',.2]],
 reef:[['reefRock',2],['crab',1],['gull',.8],['seal',.4],['walker5',.6],['shells',.5],['shellEmpty',.35],['clamShut',.35],['starCookie',.2],['bottleEmpty',.2],['harpoon',.15]],
 town5:[['walker5',1.5],['palm',.9],['pot',.6],['crate',.4],['barrel',.4],['floatPile',.3],['cat',.5],['dog',.3],['gull',.4],['chefHat',.25],['lemon',.25],['yarnBall',.25],['paperRoll',.2],['floatPink',.15]],
 dock5:[['walker5',1.3],['palm',.8],['crate',.8],['barrel',.6],['netPile',.7],['floatPile',.5],['fishCrate',.5],['gull',.6],['dog',.3],['harpoon',.25],['paperRoll',.2],['bottleEmpty',.2],['yarnBall',.15]],
 palms:[['palm',2.4],['walker5',1.2],['bush',.6],['rock',.4],['crab',.3],['gull',.3],['dog',.2],['lemon',.3],['yarnBall',.3],['floatPink',.15],['sandcastle',.2]],
 plaza5:[['walker5',1.6],['palm',.6],['pot',.5],['cat',.4],['dog',.4],['gull',.5],['lemon',.3],['chefHat',.25],['floatPink',.2],['yarnBall',.2]],
 south5:[['parasol',1.4],['sandcastle',.9],['walker5',1],['shells',1],['crab',.8],['gull',.5],['reefRock',.5],['palm',.4],['starCookie',.35],['shellEmpty',.35],['clamShut',.3],['bottleEmpty',.25],['lemon',.2]],
 bung:[['walker5',1.6],['floatPile',.4],['parasol',.3],['gull',.8],['crate',.3],['floatPink',.25],['bottleEmpty',.2],['lemon',.2],['chefHat',.15],['paperRoll',.15]],
 decor5:[['palm',1.4],['walker5',1.6],['bush',.5],['gull',.5],['crab',.3],['floatPile',.3],['netPile',.3],['crate',.3],['shells',.3]],
 sea5:[['buoy',1],['swimmer',.6]]});
Object.assign(VPLAN,{bung:{sunbathe:2,fishing:3,chat:2},beach5:{sunbathe:3,sandPlay:2,beachBall:1,iceBuy:1,chat:1,handInHand:1,shellPick:1},quay:{fishBuy:3,netMend:2,carryBox:2,chat:2,petCat:1},reef:{shellPick:2},
 town5:{chat:3,handInHand:2,dogWalk:2,carryBox:2,petCat:2,iceBuy:1},dock5:{netMend:2,carryBox:2,chat:2,gullFeed:1},palms:{sleeping:1,reading:1,chat:2,handInHand:1,kiteFly:1},
 plaza5:{chat:3,iceBuy:2,gullFeed:1,throwCatch:1,handInHand:2,dogWalk:1},south5:{sunbathe:3,sandPlay:2,shellPick:2,beachBall:1},all5:{chat:3,handInHand:2,dogWalk:1}});

function structures5(){
 const onLand=(x,y)=>!sea(x,y);
 for(let i=0;i<12;i++){const x=sr(560,2160),y=sr(20,140);add(x,y,20,10,'bird',`<path d="M-8,0 q4,-6 8,0 q4,-6 8,0" fill="none" stroke-width="1.8"/>`,{mark:false})}
 // 外海：帆船、漁船
 [[700,280,1],[1150,230,0],[1520,300,1],[560,2060,0],[880,2440,0]].forEach(([x,y,k])=>add(x,y,110,70,k?'sail5':'boat5',k?sail5():boat5(),{mark:false,s:.8}));
 // 復活島入口（擱淺帆船、摩艾剪影）預留的位置寫在 level101.js 的 H.RESERVE[5]，引擎在 structures 之前就先佔好
 // 燈塔島
 add(LH.x,LH.y,90,270,'lighthouse5',lighthouse5());mark(LH.x,LH.y,70,40);
 add(1790,520,90,90,'beachHut',house5(64,50),{s:.85});
 [[2040,540],[1980,590],[1750,450]].forEach(([x,y])=>add(x,y,52,30,'reefRock',reefRock()));
 add(2050,450,50,26,'seal',seal());add(1760,580,50,26,'seal',seal(),{fl:true});
 // 水上屋（高腳屋蓋在淺水裡，用木棧道接起來）
 BUNG.forEach(([x,y],i)=>{const n=nearOnWalk(x,y-16);if(i%2===0)add(x,y,110,130,'bungalow',bungA(),{fl:n[0]>x});else add(x,y,120,120,'bungalow',bungB())});
 // 漁港島：渡輪、漁船、漁會倉庫
 add(640,1570,230,140,'ferry5',ferry(),{mark:false,s:.85});add(786,1520,50,50,'sign',signpost('往小鎮'));
 [[1080,880,0],[1230,885,1],[1365,1160,0],[600,930,1]].forEach(([x,y,fl])=>add(x,y,120,80,'boat5',boat5(),{mark:false,fl:!!fl,s:.7}));
 add(700,1060,180,120,'warehouse',warehouse(),{s:.85});
 [[880,1260],[620,1220]].forEach(([x,y])=>add(x,y,70,46,'dryRack',dryRack()));
 // 魚市場（水上木平台）
 [[1080,990,'fish'],[1230,990,'shell'],[1100,1150,'coconut'],[1250,1140,'fish']].forEach(([x,y,k])=>add(x,y,110,86,'stall5',stall5(k)));
 // 釣魚的人坐在木棧道和平台邊
 [[1500,990,1],[1660,895,-1],[2096,1425,1],[1010,1220,-1]].forEach(([x,y,d])=>add(x,y,30,50,'fishing',act(0,0,d,fisher({pose:'sit',extra:d<0?rod.replace('M12,-18 L44,-46','M8,-14 L-30,-46').replace('M44,-46 Q52,-20 50,8','M-30,-46 Q-38,-20 -36,8'):rod}),'bob'),{mark:false}));
 // 礁湖裡：獨木舟、游泳和浮潛的人、浮標
 [[1180,1480],[1900,1160],[1330,2260],[2000,2100],[940,1880],[560,1300]].forEach(([x,y])=>{if(sea(x,y))add(x,y,60,30,'kayak',kayak5(),{mark:false,fl:r()<.5})});
 [[1150,1940],[1260,1980],[2120,1990],[900,2000],[1600,2300],[1780,2400]].forEach(([x,y])=>{if(sea(x,y))add(x,y,34,30,'swimmer',swimmer(),{mark:false})});
 [[2200,700],[2210,1600],[560,1960],[1700,2440]].forEach(([x,y])=>add(x,y,22,26,'buoy',buoy(),{mark:false}));
 // 小鎮島
 [[1400,1580],[1540,1520],[1690,1500],[1840,1530],[1980,1640],[1460,1800],[1950,1840],[1560,1960],[1820,1980]].forEach(([x,y])=>{if(onLand(x,y))add(x,y,110,110,'house5',house5(sr(66,90),sr(52,66)))});
 add(PLZ.cx,PLZ.cy+10,80,96,'anchorStatue',anchorStatue());add(1600,1870,64,80,'iceCart',iceCart());
 // 南邊沙洲島
 [[940,2250],[1100,2220]].forEach(([x,y])=>add(x,y,90,90,'beachHut',beachHut()));
 add(700,1830,90,90,'beachHut',beachHut());add(1320,600,90,90,'beachHut',house5(60,48),{s:.8});
 add(1250,2270,44,96,'lifeguard',lifeguard());
 add(1960,2270,70,130,'palm',palm(-10));add(1900,2290,40,34,'sandcastle',sandcastle());
 // 椰子樹：每座島的沙灘邊
 for(const I of ISL)for(let k=0,n=0;k<60&&n<(I.rx>350?9:I.rx>250?6:I.rx>160?3:2);k++){const a=sr(0,Math.PI*2),x=I.cx+Math.cos(a)*I.rx*sr(.62,.86),y=I.cy+Math.sin(a)*I.ry*sr(.62,.86);
  if(!onLand(x,y)||!canPlace(x,y,40,40,false,.6))continue;add(x,y,70,130,'palm',palm(Math.cos(a)*14));n++}
}
function scatter5(){
 scatter('beach5',POOL.beach5,3000,50);scatter('quay',POOL.quay,3000,40);scatter('dock5',POOL.dock5,3000,45);scatter('palms',POOL.palms,3000,40);
 scatter('reef',POOL.reef,3000,40);scatter('bung',POOL.bung,5000,45);scatter('town5',POOL.town5,4000,70);scatter('plaza5',POOL.plaza5,4000,55);
 scatter('south5',POOL.south5,4000,70);scatter('all5',POOL.decor5,9000,90)}
SCENE_IMPL[5]={ground:ground5,structures:structures5,scatter:scatter5};

/* ================= 過場：從小鎮港口搭小渡輪 ================= */
RIDES.ferry={text:'往東南走到小鎮港口，搭小渡輪往東南方的海島⋯',every:520,tick:k=>tone(k%2?180:150,.12,'sine',.05),svg:()=>{
 const loop=(inner,dur)=>`<g class="rl" style="--d:${dur}s"><g>${inner}</g><g transform="translate(399,0)">${inner}</g></g>`;
 let s=`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">`;
 s+=`<rect width="400" height="600" fill="#dcecef" stroke="none"/>`;
 s+=loop(`<path d="M40,300 Q80,262 130,280 Q170,262 200,300Z" fill="#a9c6c0" stroke-width="1.6"/><g transform="translate(300,300)"><path d="M-30,0 Q0,-40 30,0Z" fill="#b3c48a" stroke-width="1.6"/><path d="M-4,-22 L-2,-62 L4,-62 L6,-22Z" fill="#fbf9f3" stroke-width="1.4"/><path d="M-4,-36 h9 M-3,-50 h7" stroke="#d8413a" stroke-width="3"/><circle cx="1" cy="-66" r="4" fill="#f6e08a" stroke-width="1.2"/></g>`,40);
 s+=`<rect x="0" y="300" width="400" height="300" fill="${SEA}" stroke="none"/><path d="M0,300 H400" fill="none" stroke-width="1.6"/>`;
 s+=loop([[30,340],[150,330],[260,350],[360,336]].map(([x,y])=>`<path d="M${x},${y} q8,-5 16,0 q8,5 16,0" fill="none" stroke="#d8f0f2" stroke-width="2"/>`).join(''),12);
 s+=loop([[20,420],[120,460],[230,430],[330,470],[60,520],[280,540]].map(([x,y])=>`<path d="M${x},${y} q10,-6 20,0 q10,6 20,0" fill="none" stroke="#e8f6f6" stroke-width="2.4"/>`).join(''),4);
 s+=`<g class="an a-rock" style="--d:2.4s"><g transform="translate(200,438) scale(1.25)">${ferry(true)}</g></g>`;
 s+=loop(`<g transform="translate(80,200)"><path d="M-10,0 q5,-7 10,0 q5,-7 10,0" fill="none" stroke-width="2"/></g><g transform="translate(260,170)"><path d="M-8,0 q4,-6 8,0 q4,-6 8,0" fill="none" stroke-width="1.8"/></g>`,9);
 s+=loop([[40,590],[220,598],[340,585]].map(([x,y])=>`<path d="M${x},${y} q12,-8 24,0 q12,8 24,0" fill="none" stroke="#e8f6f6" stroke-width="3"/>`).join(''),1.8);
 return s+`</g></svg>`}};

/* 復活島（海上秘境）的入口寫在 level101.js（2026-11-09 搬過去）：擱淺帆船、船長、摩艾剪影、海圖碎片、出航過場、地圖航線。 */

/* ================= 冒險地圖節點 ================= */
HERE[5]=[293,340];
MAPHOOKS.push(({U,P,ink,FN})=>{if(U<5)return '';
 const land='M40,138 C30,196 42,256 70,288 Q86,302 104,306',sea_='M108,312 Q166,336 222,360';
 let m=`<path d="${land}" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round"/><path d="${land}" fill="none" stroke="#ead7a6" stroke-width="4.5" stroke-linecap="round"/><path d="${land}" fill="none" stroke="#a8461f" stroke-width="1.6" stroke-dasharray="4 5" stroke-linecap="round"/>`;
 m+=`<path d="M98,300 h16 v4 h-16Z" fill="#c99a5b" stroke="${ink}" stroke-width="1.1"/><path d="${sea_}" fill="none" stroke="#fffaf0" stroke-width="3.4" stroke-linecap="round"/><path d="${sea_}" fill="none" stroke="#3b5a8a" stroke-width="1.8" stroke-dasharray="5 5" stroke-linecap="round"/>`;
 m+=`<g transform="translate(160,334) scale(.16)" stroke="${ink}" stroke-width="7">${ferry()}</g>`;
 m+=`<g class="mnode" data-n="5"><circle cx="250" cy="364" r="38" fill="transparent"/><ellipse cx="250" cy="372" rx="40" ry="13" fill="#ecd9a8" stroke="${ink}" stroke-width="1.4"/><ellipse cx="250" cy="370" rx="28" ry="8" fill="#a9b768" stroke="none"/>`;
 m+=P('M264,370 L266,340 L272,340 L274,370Z','#fbf9f3',1.3)+`<path d="M265,352 h9 M266,362 h8" stroke="#d8413a" stroke-width="3"/>`+P('M264,340 L269,332 L274,340Z','#d8413a',1.2);
 m+=`<path d="M236,370 Q234,356 240,346" fill="none" stroke="${ink}" stroke-width="2"/>`+P('M240,346 q-10,-2 -14,4 q8,0 14,-4Z M240,346 q10,-2 14,4 q-8,0 -14,-4Z M240,346 q-4,-8 -12,-8 q4,6 12,8Z M240,346 q4,-8 12,-8 q-4,6 -12,8Z','#5f8a3a',1.1);
 m+=`<g transform="translate(250,398)"><rect x="-32" y="-11" width="64" height="20" rx="10" fill="#fffaf0" stroke="${ink}" stroke-width="1.8"/><text y="4.5" text-anchor="middle" font-size="12" fill="${ink}" font-family="${FN}">海島港口</text></g></g>`;
 return m});

/* ================= 登記：場景範圍、場地邊緣、冒險地圖（2026-11-09 從 index.html 搬來） ================= */
H.SCENES[5]={x0:500,x1:2219,y1:2520,c:[1300,1460]};H.TARGET[5]=330;
H.SKYC[5]='#dcecef';H.SKYY[5]=150;H.EDGEM[5]='';H.EDGED[5]='LRB';
H.EDGEDECO[5]=[['palm',2],['bush',.6]];
H.DENS[5]=1;
/* 小故事「纏住的小海豹」 */
{const {act,T,cat,limb,f,OL,pk,r,sr,shade,kid,heart,bubble,HATS}=H;
H.STORIES[5]={title:'纏住的小海豹',giver:()=>act(0,0,1,{view:'fq',pose:'reach',hat:-1,hair:'#e8e4dc',hs:3,shirt:'#3b5a8a',pants:'#5a4a3a',mood:2}),who:'燈塔奶奶',
    target:()=>`<g transform="scale(1.35)">`+`<path d="M-20,0 Q-22,-12 -10,-16 Q4,-20 14,-12 Q20,-6 16,0Z" fill="#8f9aa6"/><path d="M-20,0 Q-22,-12 -10,-16" fill="none"/>`+`<circle cx="8" cy="-20" r="9" fill="#a3adb8"/><circle cx="5" cy="-22" r="1.6" fill="${OL}" stroke="none"/><circle cx="11" cy="-22" r="1.6" fill="${OL}" stroke="none"/><ellipse cx="8" cy="-17.5" rx="2" ry="1.4" fill="${OL}" stroke="none"/><path d="M-1,-26 Q-2,-35 8,-38 Q18,-35 17,-26 Q8,-23 -1,-26Z" fill="#f5c842"/><path d="M0,-29 Q8,-26.5 16,-29" fill="none" stroke="#fbf6ea" stroke-width="2"/><path d="M5,-36 l2,-2" fill="none" stroke="#fff" stroke-width="1.4"/>`+`<path d="M-22,-4 L14,-16 M-18,2 L18,-10 M-12,-14 L-4,4 M-2,-18 L6,2 M8,-14 L14,4 M-20,-10 L18,0" fill="none" stroke="#6f8f8a" stroke-width="1.6"/><circle cx="-14" cy="-14" r="3" fill="#f0802a" stroke-width="1.2"/>`+`</g>`,tw:60,th:52,
    helper:()=>act(0,0,1,{view:'side',pose:'hold',hat:1,shirt:'#3b5a8a',pants:'#3d3833',beard:true,extra:`<g transform="translate(16,-20) rotate(-30)"><path d="M0,0 L16,-3 M0,0 L16,3" fill="none" stroke="#6f7f8f" stroke-width="3"/><circle cx="-3" cy="-3" r="3.2" fill="none" stroke="#d8413a" stroke-width="2.2"/><circle cx="-3" cy="3" r="3.2" fill="none" stroke="#d8413a" stroke-width="2.2"/></g>`}),hw:48,hh:64,
    ask:'燈塔奶奶：我的小海豹不見了！牠戴著一頂黃色小水手帽。',
    need:'小海豹被舊漁網纏住了，動不了⋯碼頭有人在補漁網，也許有剪刀。',
    got:'漁夫：拿去，這把大剪刀小心用！',
    ok:'剪開了！小海豹開心地拍拍手，跟著你走。快帶回奶奶身邊！'};}
})();
