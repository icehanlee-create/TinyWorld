/* 奇幻小鎮大搜查．第 4 關「森林古代遺跡」
   由 index.html 在需要時載入（ensureLevel），把物件、場景、過場、地圖節點註冊到 window.TH。
   場景座標：x 500～1875、y 0～2250（和第 3 關同大小）。 */
(function(){
const H=window.TH;if(!H)return;
const {T,f,r,sr,pk,ri,limb,shade,OL,SKIN,SHIRT,kid,act,wrapAn,heart,bubble,peekHead,frog,owl,pine,roundTree,bush,rock,crate,barrel,pot,tent,campfire,swirl,signpost,lily,reeds,
 add,mark,canPlace,scatter,KIND,POOL,VPLAN,REG,SCREG,LEVELS,ART,DECOY,BORROW,OCCK,HEAVY,ANIM,ALWAYS,DUR,SCENE_IMPL,WATERFN,RIDES,MAPHOOKS,TAPHOOKS,HERE,tone,steamPuff,pickView,walkPose}=H;

Object.assign(DUR,{fire:[.5,.8],flag:[1.2,1.8]});
const STONE='#b9ab8c',STONE2='#c6b99a',STONED='#8f8268',VINE='#5f7a3f',LEAF='#6f9a4a',OCHRE='#a8461f',FLOOR='#8a9658';
const vine=(x,y,len,sw=1)=>{let d=`M${x},${y}`,lv='';for(let k=1;k<=len;k++){const yy=y+k*9,xx=x+(k%2?3:-3)*sw;d+=` Q${x+(k%2?-5:5)*sw},${yy-5} ${xx},${yy}`;if(k%2)lv+=`<ellipse cx="${xx+(k%4===1?4:-4)}" cy="${yy-2}" rx="3.4" ry="1.8" fill="${LEAF}" stroke-width="1" transform="rotate(${k%4===1?30:-30} ${xx} ${yy})"/>`}
 return `<path d="${d}" fill="none" stroke="${VINE}" stroke-width="2"/>`+lv};

/* ================= 物件與干擾物 ================= */
const scarabShape=c=>`<path d="M-9,-6 L-15,-10 M-10,0 L-16,0 M-9,6 L-15,10 M9,-6 L15,-10 M10,0 L16,0 M9,6 L15,10" fill="none" stroke-width="1.6"/><ellipse cx="0" cy="3" rx="10" ry="12" fill="${c}"/><path d="M0,-8 V15" fill="none" stroke-width="1.2"/><ellipse cx="0" cy="-11" rx="6" ry="4" fill="${shade(c,-.25)}"/><path d="M-3,-14 l-3,-4 M3,-14 l3,-4" fill="none" stroke-width="1.4"/><ellipse cx="-4" cy="1" rx="2" ry="4" fill="#fff" opacity=".45" stroke="none"/>`;
const maskShape=(c,trim)=>`<path d="M-12,-14 Q0,-18 12,-14 Q14,2 8,12 Q0,18 -8,12 Q-14,2 -12,-14Z" fill="${c}"/><path d="M-9,-5 Q-6,-8 -3,-5 Q-6,-3 -9,-5Z M3,-5 Q6,-8 9,-5 Q6,-3 3,-5Z" fill="${OL}"/><path d="M0,-2 L-2,4 L2,4Z" fill="${shade(c,-.25)}" stroke-width="1"/><path d="M-4,8 h8" fill="none" stroke-width="1.8"/>`+(trim?`<path d="M-12,-10 Q0,-14 12,-10" fill="none" stroke="#e0b44a" stroke-width="2.6"/><circle cy="-12" r="2.6" fill="#d8413a" stroke-width="1"/>`:`<path d="M-11,-9 Q0,-12 11,-9" fill="none" stroke="${shade(c,-.3)}" stroke-width="1.2"/>`);
const scrollShape=map=>`<rect x="-11" y="-12" width="22" height="24" fill="#f1e4c0"/>`+(map?`<path d="M-7,7 q4,-6 0,-10 q4,-5 7,-1" fill="none" stroke="${OCHRE}" stroke-width="1.4" stroke-dasharray="2 2"/><path d="M3,-7 l5,5 M8,-7 l-5,5" fill="none" stroke="#d8413a" stroke-width="2.2"/>`:`<path d="M-7,-6 h14 M-7,-1 h12 M-7,4 h14" fill="none" stroke="#b9a984" stroke-width="1.4"/>`)+`<rect x="-14" y="-16" width="28" height="5" rx="2.5" fill="#c99a5b"/><rect x="-14" y="11" width="28" height="5" rx="2.5" fill="#c99a5b"/>`;
const lensShape=(rim,glass,handle)=>`<path d="M5,5 L15,15" fill="none" stroke="${OL}" stroke-width="7"/><path d="M5,5 L15,15" fill="none" stroke="${handle}" stroke-width="4"/><circle cx="-3" cy="-3" r="11" fill="${rim}"/><circle cx="-3" cy="-3" r="8" fill="${glass}"/><path d="M-8,-6 q2,-4 6,-4" fill="none" stroke="#fff" stroke-width="1.8"/>`;
const caseShape=watch=>`<circle cy="-14" r="2.8" fill="none" stroke-width="1.8"/><circle r="12" fill="#d6ab45"/><circle r="9" fill="#fbf6ea"/>`+(watch?`<path d="M0,-6 V0 L4,2" fill="none" stroke-width="1.6"/><g fill="${OL}" stroke="none"><circle cy="-7" r=".9"/><circle cx="7" r=".9"/><circle cy="7" r=".9"/><circle cx="-7" r=".9"/></g><path d="M2,-16 q8,-4 12,4" fill="none" stroke="#d6ab45" stroke-width="1.4" stroke-dasharray="2 1.5"/>`:`<path d="M0,-7 L2.6,0 L0,7 L-2.6,0Z" fill="#d8413a" stroke-width="1"/><path d="M0,7 L2.6,0 L-2.6,0Z" fill="#fbf6ea" stroke-width="1"/><text y="-3.5" x="0" font-size="4.5" text-anchor="middle" fill="${OL}" stroke="none" font-weight="700">N</text>`);
const jarShape=broken=>(broken?`<path d="M-5,-11 L-2,-7 L1,-12 L4,-8 L6,-11 Q11,-8 11,2 Q10,12 0,15 Q-10,12 -11,2 Q-11,-8 -5,-11Z" fill="#c4703f"/><path d="M5,-2 l-3,5 l2,4" fill="none" stroke-width="1.1"/>`:`<path d="M-5,-14 h10 v3 Q11,-8 11,2 Q10,12 0,15 Q-10,12 -11,2 Q-11,-8 -5,-11Z" fill="#c4703f"/><path d="M-6,-10 Q-13,-10 -10,-2 M6,-10 Q13,-10 10,-2" fill="none" stroke-width="1.8"/>`)+`<path d="M-10.5,0 H10.5" fill="none" stroke-width="1.1"/><path d="M-9,4 l3,-3 l3,3 l3,-3 l3,3 l3,-3" fill="none" stroke="#f1e4c0" stroke-width="1.4"/>`;
const parrotShape=(c,belly)=>`<path d="M-2,-14 Q8,-16 8,-6 Q8,4 2,10 L-1,19 L-5,18 L-4,9 Q-8,2 -7,-6 Q-6,-13 -2,-14Z" fill="${c}"/><path d="M-1,-2 Q5,0 3,9 Q-1,6 -1,-2Z" fill="${belly}" stroke-width="1"/><path d="M-6,-4 Q-1,-2 -1,9 Q-6,6 -6,-4Z" fill="${shade(c,-.28)}"/><path d="M8,-10 Q14,-9 11,-3 Q10,-6 7,-6Z" fill="#e8c46a"/><circle cx="3" cy="-9" r="2.4" fill="#fff" stroke-width="1"/><circle cx="3.6" cy="-9" r="1.1" fill="${OL}" stroke="none"/><path d="M-1,11 l-2,3 M2,10 l1,3" fill="none" stroke-width="1.4"/>`;
const coinShape=(c,glyph)=>`<circle r="12" fill="${c}"/><circle r="9" fill="none" stroke="${shade(c,-.3)}" stroke-width="1.4"/>`+(glyph?`<circle r="3.4" fill="none" stroke="${shade(c,-.35)}" stroke-width="1.4"/>`+[...Array(8)].map((_,i)=>{const a=i*Math.PI/4;return `<path d="M${f(Math.cos(a)*4.6)},${f(Math.sin(a)*4.6)} L${f(Math.cos(a)*7.2)},${f(Math.sin(a)*7.2)}" fill="none" stroke="${shade(c,-.35)}" stroke-width="1.3"/>`}).join('')+`<path d="M-7,-5 q3,-4 7,-5" fill="none" stroke="#fff" stroke-width="1.6" opacity=".7"/>`:`<path d="M-4,-2 h8 M-4,2 h6" fill="none" stroke="${shade(c,-.35)}" stroke-width="1.3"/><circle cx="5" cy="5" r="2.6" fill="#6fae8a" stroke="none" opacity=".8"/><circle cx="-6" cy="4" r="2" fill="#6fae8a" stroke="none" opacity=".8"/>`);
Object.assign(ART,{coin:coinShape('#e0b44a',true),scarab:scarabShape('#e0b44a'),mask:maskShape('#5fae8a',true),scroll:scrollShape(true),magnifier:lensShape('#d6ab45','#cfe8ef','#7a5235'),
 ruby:`<path d="M-10,-4 L-5,-11 L5,-11 L10,-4 L0,12Z" fill="#d8413a"/><path d="M-10,-4 H10 M-5,-11 L-2,-4 L0,12 M5,-11 L2,-4 L0,12" fill="none" stroke-width="1.1"/><path d="M-5,-8 l2,-1.4" fill="none" stroke="#fff" stroke-width="1.8"/>`,
 brush:`<g transform="rotate(-35)"><rect x="-3" y="-16" width="6" height="18" rx="2.5" fill="#c99a5b"/><rect x="-6" y="1" width="12" height="5" fill="#9aa0a4"/><path d="M-6,6 L-7,15 L7,15 L6,6Z" fill="#e8c46a"/><path d="M-4,8 v6 M-1,8 v6 M2,8 v6 M5,8 v6" fill="none" stroke-width=".9"/></g>`,
 compass:caseShape(false),amphora:jarShape(false),parrot:parrotShape('#3f7fc4','#e8c46a')});
Object.assign(DECOY,{coinOld:coinShape('#b8834f',false),scarabG:scarabShape('#6f9a4a'),maskWood:maskShape('#a8703f',false),scrollPlain:scrollShape(false),mirror:lensShape('#e8a0a0','#e6eef0','#e8a0a0'),
 berries:`<path d="M0,-12 Q4,-16 9,-14 Q5,-10 0,-12Z" fill="${LEAF}" stroke-width="1"/><path d="M0,-12 L-2,-4 M0,-12 L4,-2" fill="none" stroke-width="1"/><circle cx="-4" cy="0" r="5" fill="#d8413a"/><circle cx="5" cy="2" r="5" fill="#c4473c"/><circle cx="0" cy="8" r="5" fill="#d8413a"/>`,
 paintbrush:`<g transform="rotate(-35)"><rect x="-2" y="-16" width="4" height="20" rx="2" fill="#c4473c"/><rect x="-3.5" y="3" width="7" height="4" fill="#9aa0a4"/><path d="M-3.5,7 Q0,19 3.5,7Z" fill="#5a86b0"/></g>`,
 watch:caseShape(true),jarBroken:jarShape(true),parrotR:parrotShape('#d8413a','#e8c46a')});

const g=id=>LEVELS.slice(1).flatMap(L=>L.types||[]).find(t=>t.id===id);
const TYPES4=[{...g('key'),regions:['temple','plaza4','camp','back4']},{...g('pinecone'),regions:['grove','trail','back4','falls']},
 {id:'coin',name:'古代金幣',short:'金幣',r:13,rot:30,regions:['temple','plaza4','camp','back4']},
 {id:'scarab',name:'金色聖甲蟲',short:'聖甲蟲',r:14,rot:30,regions:['temple','back4','grove','plaza4']},
 {id:'mask',name:'翡翠古代面具',short:'面具',r:15,rot:15,regions:['temple','plaza4','camp','falls']},
 {id:'scroll',name:'藏寶圖卷軸',short:'藏寶圖',r:15,rot:30,regions:['camp','plaza4','grove','camp']},
 {id:'magnifier',name:'放大鏡',short:'放大鏡',r:15,rot:40,regions:['camp','trail','plaza4','grove']},
 {id:'ruby',name:'紅寶石',short:'紅寶石',r:12,rot:20,regions:['back4','plaza4','falls','camp']},
 {id:'brush',name:'考古毛刷',short:'毛刷',r:15,rot:40,regions:['camp','camp','plaza4','temple']},
 {id:'compass',name:'黃銅羅盤',short:'羅盤',r:14,rot:30,regions:['camp','trail','grove','plaza4']},
 {id:'amphora',name:'古陶罐',short:'陶罐',r:15,rot:10,regions:['plaza4','temple','camp','falls']},
 {id:'parrot',name:'藍色鸚鵡',short:'鸚鵡',r:15,rot:10,regions:['grove','back4','temple','falls']}];
LEVELS[4].types=TYPES4;
BORROW[4]=[['magnifier',{1:['village','plaza','banks','top'],2:['farmS','farm','farmS','farm'],3:['inn','station','lake','slope']}],
 ['scroll',{1:['plaza','village','forest','banks'],2:['farm','farmS','farm','farmS'],3:['station','inn','onsen','station']}],
 ['compass',{1:['top','village','banks','plaza'],2:['farmS','farm','farm','farmS'],3:['slope','station','inn','lake']}],
 ['ruby',{1:['forest','plaza','village','banks'],2:['farm','farmS','farmS','farm'],3:['onsen','inn','station','lake']}]];

/* ================= 地形與水 ================= */
const POOL4={cx:740,cy:945,rx:190,ry:70},FALL={x0:705,x1:775,y0:546,y1:890};
/* 場地再放大 1.25 倍：原本座標 (x,y) 對應到 (MX,MY)，人物道具大小不變 */
const K=1.25,MX=x=>500+(x-500)*K,MY=y=>y*K,IX=x=>500+(x-500)/K,IY=y=>y/K;
const w4=(x,y)=>(((x-POOL4.cx)/POOL4.rx)**2+((y-POOL4.cy)/POOL4.ry)**2<1)||(x>FALL.x0&&x<FALL.x1&&y>FALL.y0&&y<FALL.y1);
WATERFN[4]=(x,y)=>w4(IX(x),IY(y));
/* 點瀑布後面的圖騰：眼睛眨一下、光暈亮一下（不算點錯） */
let blinking=false;
TAPHOOKS[4]=(x,y)=>{const ex=MX(740),ey=MY(886-41*1.16);if(Math.hypot(x-ex,(y-ey)*.9)>34)return false;
 if(blinking)return true;const lid=document.getElementById('totemLid'),lash=document.getElementById('totemLash'),glow=document.getElementById('totemGlow');if(!lid)return false;
 blinking=true;const R=18*.43,t0=performance.now(),D=420;
 try{tone(660,.08,'sine',.04);setTimeout(()=>tone(880,.1,'sine',.035),140)}catch(_){}
 const step=now=>{const k=Math.min(1,(now-t0)/D),c=k<.45?k/.45:k<.6?1:1-(k-.6)/.4;
  lid.setAttribute('ry',(R*c).toFixed(2));if(lash)lash.setAttribute('opacity',c>.85?1:0);if(glow)glow.setAttribute('opacity',(.32+.45*Math.sin(Math.PI*k)).toFixed(2));
  if(k<1)requestAnimationFrame(step);else{lid.setAttribute('ry','0');if(lash)lash.setAttribute('opacity',0);if(glow)glow.setAttribute('opacity','.32');blinking=false}};
 requestAnimationFrame(step);return true};
Object.assign(REG,{falls:{x:520,y:860,w:480,h:200},temple:{x:1000,y:880,w:860,h:260},plaza4:{x:900,y:1140,w:940,h:330},grove:{x:520,y:1080,w:440,h:640},
 camp:{x:1180,y:1520,w:680,h:600},trail:{x:520,y:1740,w:640,h:400},all4:{x:520,y:600,w:1340,h:1540},back4:{x:1000,y:600,w:860,h:300}});
['falls','temple','plaza4','grove','camp','trail','all4','back4'].forEach(k=>{const g=REG[k];REG[k]={x:MX(g.x),y:MY(g.y),w:g.w*K,h:g.h*K}});
SCREG[4]=['falls','temple','plaza4','grove','camp','trail','back4','all4'];
const PLAZA=[[900,1010],[1840,1010],[1850,1470],[1180,1480],[900,1460]];
const inPlaza=(x,y)=>x>900&&x<1840&&y>1010&&y<1470;
const PIT={x0:1560,y0:1800,x1:1810,y1:1950};

function ground4(){const NS_='stroke="none"';let s=`<defs><pattern id="pave4" width="44" height="30" patternUnits="userSpaceOnUse"><rect width="44" height="30" fill="#c9bc9c"/><path d="M1,1 h20 v12 h-20z M23,1 h20 v12 h-20z M-10,16 h20 v13 h-20z M12,16 h20 v13 h-20z M34,16 h20 v13 h-20z" fill="#d3c7a8" stroke="#9d8f70" stroke-width="1.3"/><path d="M6,5 l4,2 M30,20 l3,3" stroke="#7f9d48" stroke-width="1.4"/></pattern></defs>`;
 s+=`<rect x="0" y="-400" width="2600" height="3400" fill="${FLOOR}" ${NS_}/><rect x="0" y="-400" width="2600" height="880" fill="#e3e8d8" ${NS_}/>`;
 [[1150,110,.9],[1600,70,.8],[900,180,.7],[1750,200,.8]].forEach(([x,y,k])=>s+=T(x,y,k,swirl()));
 // 遠山與遠方森林
 s+=`<path d="M200,470 L380,260 L520,380 L700,200 L880,360 L1060,230 L1260,380 L1460,210 L1660,350 L1860,240 L2100,470Z" fill="#c3cdb3" stroke-width="1.6"/>`;
 s+=`<g opacity=".7" stroke-width="1.4"><path d="M1380,300 L1420,230 L1460,300Z M1395,270 h50" fill="#b3bb9c"/></g>`;
 let canopy='M200,480';for(let x=200;x<=2200;x+=46)canopy+=` Q${x+23},${f(400+sr(-26,10))} ${x+46},${f(440+sr(-12,12))}`;canopy+=' L2200,520 L200,520Z';
 s+=`<path d="${canopy}" fill="#6f7d45" stroke-width="2"/>`;
 let cp2='M200,520';for(let x=200;x<=2200;x+=60)cp2+=` Q${x+30},${f(450+sr(-18,10))} ${x+60},${f(480+sr(-10,10))}`;cp2+=' L2200,560 L200,560Z';
 s+=`<path d="${cp2}" fill="#5f6b3a" stroke-width="2"/>`;
 // 林地色塊
 for(let i=0;i<60;i++){const x=sr(400,2100),y=sr(560,2250);s+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(40,110))}" ry="${f(sr(14,30))}" fill="${pk(['#7d8a4e','#96a262','#7f9d48'])}" ${NS_} opacity=".75"/>`}
 // 懸崖、瀑布與後面的洞穴
 s+=`<path d="M480,560 Q600,540 700,560 Q820,538 1000,556 L1010,900 Q900,880 840,890 Q760,900 660,884 Q560,872 480,890Z" fill="#9d9684" stroke-width="2.4"/>`;
 s+=`<path d="M500,640 Q620,628 690,650 M800,640 Q900,630 1000,650 M500,740 Q600,730 690,752 M800,742 Q900,736 1000,756 M520,820 Q600,812 690,830 M800,826 Q900,820 990,836" fill="none" stroke="#7f786a" stroke-width="1.6"/>`;
 // 大拱形洞口（瀑布像簾子蓋在前面），洞裡有發光礦石
 s+=`<path d="M620,892 L620,800 Q622,700 740,694 Q858,700 862,800 L862,892Z" fill="#2f2b28" stroke-width="2.4"/><path d="M646,892 L646,808 Q650,728 740,724 Q830,728 834,808 L834,892Z" fill="#3d3833" stroke="none"/>`;
 [[664,846,'#9fd8ff'],[812,824,'#c58be0'],[682,790,'#c58be0'],[800,868,'#9fd8ff'],[700,870,'#a8f0d0'],[822,770,'#9fd8ff'],[660,812,'#a8f0d0'],[830,850,'#c58be0']].forEach(([x,y,c])=>s+=`<circle cx="${x}" cy="${y}" r="11" fill="${c}" opacity=".25" stroke="none"/><circle cx="${x}" cy="${y}" r="3.6" fill="${c}" stroke="none"/><circle cx="${x-1}" cy="${y-1}" r="1.2" fill="#fff" stroke="none"/>`);
 // 岩塊紋路
 [[540,600,60,26],[930,610,56,24],[560,700,48,22],[960,720,50,22],[540,800,56,24],[950,810,52,22],[880,650,40,18],[600,650,42,18]].forEach(([x,y,w,h])=>s+=`<path d="M${x-w/2},${y} Q${x-w/2},${y-h} ${x},${y-h} Q${x+w/2},${y-h} ${x+w/2},${y} Z" fill="#a89b84" stroke="#7f786a" stroke-width="1.6"/>`);
 // 崖頂：樹冠下長一圈青苔，往下垂，再接藤蔓（取代原本一顆顆的灌木）
 let mossTop='M480,548',mossBot='';for(let x=480;x<=1010;x+=26)mossTop+=` Q${x+13},${f(536+sr(-6,4))} ${x+26},${f(548+sr(-3,3))}`;
 for(let x=1010;x>=480;x-=22)mossBot+=` L${x},${f(572+sr(0,14))} L${x-11},${f(566+sr(0,6))}`;
 s+=`<path d="${mossTop}${mossBot}Z" fill="#7f9d48" stroke-width="2"/>`;
 let drip='';for(let i=0;i<14;i++){const x=sr(492,1000);if(x>FALL.x0-14&&x<FALL.x1+14)continue;drip+=`<path d="M${f(x-5)},570 Q${f(x)},${f(sr(586,600))} ${f(x+5)},570Z" fill="#6f8f42" stroke-width="1.4"/>`}s+=drip;
 [500,528,560,600,640,664,820,846,880,916,948,980].forEach(x=>{if(x>FALL.x0-20&&x<FALL.x1+20)return;s+=vine(x,572,ri(4,11),r()<.5?.8:1)});
 [[520,640],[980,700],[560,760],[940,800]].forEach(([x,y])=>s+=`<path d="M${x},${y} q-9,-6 -15,-2 M${x},${y} q2,-11 -2,-15 M${x},${y} q9,-6 15,-2" fill="none" stroke="#56703f" stroke-width="2.4"/>`);
 // 瀑布：從崖頂的溪流流出，蓋在青苔上（不從樹叢裡冒出來）
 s+=`<path d="M650,546 Q700,526 740,528 Q790,526 830,546 Q790,556 740,556 Q690,556 650,546Z" fill="#9d9684" stroke-width="2"/><path d="M672,546 Q706,534 740,535 Q776,534 808,546 Q776,551 740,551 Q704,551 672,546Z" fill="#8fc4bb" stroke-width="1.6"/>`;
 [[660,540],[820,540],[690,532],[792,532]].forEach(([x,y])=>s+=`<ellipse cx="${x}" cy="${y}" rx="11" ry="7" fill="#b0a996" stroke-width="1.5"/>`);
 s+=T(740,886,1.16,totem4(true)); /* 使用者指定的圖騰：站在瀑布後面，隔著半透明水幕淡淡顯影（A） */s+=`<path d="M${FALL.x0-3},548 Q740,538 ${FALL.x1+3},548 L${FALL.x1},${FALL.y1} L${FALL.x0},${FALL.y1}Z" fill="#cfe6e0" fill-opacity=".68" stroke-width="2"/>`;
 let fl='';for(let x=FALL.x0+8;x<FALL.x1-4;x+=10)fl+=`M${x},${552+sr(2,24)} V${FALL.y1-sr(10,50)} `;s+=`<path d="${fl}" fill="none" stroke="#fbfcfb" stroke-width="3" stroke-dasharray="26 10"/>`;
 s+=`<path d="M${FALL.x0-2},549 Q740,541 ${FALL.x1+2},549" fill="none" stroke="#fbfcfb" stroke-width="4"/>`;
 // 水池
 const P=POOL4;s+=`<ellipse cx="${P.cx}" cy="${P.cy}" rx="${P.rx+16}" ry="${P.ry+12}" fill="#9d9684"/>`;
 for(let k=0;k<22;k++){const a=k/22*Math.PI*2;s+=`<ellipse cx="${f(P.cx+Math.cos(a)*(P.rx+12))}" cy="${f(P.cy+Math.sin(a)*(P.ry+9))}" rx="${f(sr(10,16))}" ry="${f(sr(6,10))}" fill="${pk(['#b0a996','#9d9684','#c6bfae'])}" stroke-width="1.6"/>`}
 s+=`<ellipse cx="${P.cx}" cy="${P.cy}" rx="${P.rx}" ry="${P.ry}" fill="#8fc4bb" stroke-width="2.2"/><ellipse cx="${P.cx-30}" cy="${P.cy-12}" rx="${P.rx*.6}" ry="${P.ry*.45}" fill="#a8d4cc" ${NS_}/>`;
 s+=`<path d="M${P.cx-60},${P.cy+20} q8,-4 16,0 q8,4 16,0 M${P.cx+50},${P.cy+6} q8,-4 16,0 q8,4 16,0 M${P.cx-120},${P.cy-6} q8,-4 16,0 q8,4 16,0" fill="none" stroke="#e6f4f2" stroke-width="1.6"/>`;
 // 瀑布下端蓋過池邊岩石，落進水面的白色水花
 s+=`<rect x="${FALL.x0}" y="852" width="${FALL.x1-FALL.x0}" height="52" fill="#cfe6e0" fill-opacity=".68" ${NS_}/><path d="M${FALL.x0},852 V902 M${FALL.x1},852 V902" fill="none" stroke-width="2"/>`;
 let fl2='';for(let x=FALL.x0+8;x<FALL.x1-4;x+=10)fl2+=`M${x},852 V${f(896-sr(0,10))} `;s+=`<path d="${fl2}" fill="none" stroke="#fbfcfb" stroke-width="3" stroke-dasharray="20 8"/>`;
 s+=`<ellipse cx="740" cy="904" rx="62" ry="15" fill="#fbfcfb" stroke-width="1.6"/>`+[[690,898,7],[788,898,7],[712,890,5],[770,889,6],[740,892,8]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fbfcfb" stroke-width="1.3"/>`).join('');
 // 鋪石廣場（大神殿前）
 s+=`<path d="M${PLAZA.map(p=>p.join(',')).join(' L')}Z" fill="url(#pave4)" stroke-width="2.4"/>`;
 let cr='';for(let i=0;i<26;i++){const x=sr(920,1820),y=sr(1030,1450);cr+=`M${f(x)},${f(y)} l${f(sr(-14,14))},${f(sr(6,14))} l${f(sr(-8,8))},${f(sr(6,12))} `}s+=`<path d="${cr}" fill="none" stroke="#7f786a" stroke-width="1.2"/>`;
 let ms='';for(let i=0;i<40;i++){const x=sr(920,1830),y=sr(1030,1460);ms+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(8,22))}" ry="${f(sr(4,8))}" fill="#7f9d48" opacity=".8" ${NS_}/>`}s+=ms;
 // 土路
 const pth=(d,w,c='#c9a979')=>`<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w+5}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`;
 s+=pth('M480,2260 C640,2120 760,1980 900,1880 S1080,1640 1160,1480',40)+pth('M1100,1560 C1200,1580 1280,1640 1340,1720 S1500,1820 1560,1860',30)+pth('M960,1820 C880,1760 800,1700 760,1600',24)+pth('M900,1220 C860,1140 820,1080 800,1010',24);
 // 挖掘坑
 s+=`<path d="M${PIT.x0-14},${PIT.y1+10} Q${PIT.x0-30},${PIT.y0+40} ${PIT.x0},${PIT.y0-10} L${PIT.x1+10},${PIT.y0-14} Q${PIT.x1+30},${PIT.y0+60} ${PIT.x1+12},${PIT.y1+12}Z" fill="#a8825c" stroke-width="2"/>`;
 s+=`<rect x="${PIT.x0}" y="${PIT.y0}" width="${PIT.x1-PIT.x0}" height="${PIT.y1-PIT.y0}" fill="#7a5a3a" stroke-width="2.4"/><rect x="${PIT.x0+16}" y="${PIT.y0+16}" width="${PIT.x1-PIT.x0-32}" height="${PIT.y1-PIT.y0-28}" fill="#6b4a2b" ${NS_}/>`;
 let gr='';for(let x=PIT.x0+50;x<PIT.x1;x+=50)gr+=`M${x},${PIT.y0} V${PIT.y1} `;for(let y=PIT.y0+50;y<PIT.y1;y+=50)gr+=`M${PIT.x0},${y} H${PIT.x1} `;s+=`<path d="${gr}" fill="none" stroke="#fbf6ea" stroke-width="1.2" opacity=".85"/>`;
 [[PIT.x0+40,PIT.y0+70],[PIT.x0+150,PIT.y0+110],[PIT.x0+200,PIT.y0+50]].forEach(([x,y])=>s+=`<path d="M${x-8},${y} l6,-6 l8,2 l-2,7Z" fill="#c4703f" stroke-width="1.2"/>`);
 s+=`<path d="M${PIT.x0+90},${PIT.y0+70} h22 M${PIT.x0+88},${PIT.y0+66} a3,3 0 1 0 0,8 M${PIT.x0+114},${PIT.y0+66} a3,3 0 1 1 0,8" fill="none" stroke="#fbf6ea" stroke-width="2.4"/>`;
 let st='';for(const [x,y] of [[PIT.x0,PIT.y0],[PIT.x1,PIT.y0],[PIT.x0,PIT.y1],[PIT.x1,PIT.y1]])st+=`<path d="M${x},${y} v-12" fill="none" stroke="#7a5235" stroke-width="3"/>`;s+=st;
 // 草叢與落葉
 let tf='';for(let i=0;i<900;i++){const x=sr(420,2200),y=sr(580,2240);if(w4(x,y)||inPlaza(x,y)||(x>480&&x<1010&&y<895)||(x>PIT.x0-20&&x<PIT.x1+20&&y>PIT.y0-20&&y<PIT.y1+20))continue;tf+=`M${f(x)},${f(y)} l-3,-6 M${f(x)},${f(y)} l3,-6 `}
 s+=`<path d="${tf}" fill="none" stroke="#56603a" stroke-width="1.3"/>`;
 let lv='';for(let i=0;i<160;i++){const x=sr(420,2200),y=sr(580,2240);if(w4(x,y)||(x>480&&x<1010&&y<895))continue;lv+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="3" ry="1.6" fill="${pk(['#c99a5b','#d98c46','#b85a35'])}" ${NS_} transform="rotate(${ri(0,180)} ${f(x)} ${f(y)})"/>`}s+=lv;
 return `<g transform="translate(500,0) scale(${K}) translate(-500,0)">${s}</g>`}

/* 火炬：高石柱＋鐵火盆＋大火焰＋光暈（要明顯） */
const torch=(h=64)=>`<ellipse cx="0" cy="${-h-14}" rx="26" ry="22" fill="#f6c050" opacity=".28" stroke="none"/><ellipse cx="0" cy="${-h-12}" rx="15" ry="13" fill="#f6d27a" opacity=".35" stroke="none"/>`+
 `<path d="M-6,0 L-4,${-h} L4,${-h} L6,0Z" fill="${STONE}"/><rect x="-8" y="-6" width="16" height="6" fill="${STONED}"/><path d="M-12,${-h} L12,${-h} L8,${-h+9} L-8,${-h+9}Z" fill="#5a5f64"/><path d="M-12,${-h} H12" fill="none" stroke-width="2.6"/>`+
 wrapAn('fire',`<path d="M-11,${-h} Q-16,${-h-14} -7,${-h-22} Q-8,${-h-12} -2,${-h-16} Q-2,${-h-30} 4,${-h-38} Q4,${-h-24} 10,${-h-22} Q16,${-h-12} 11,${-h}Z" fill="#f0802a"/><path d="M-6,${-h} Q-8,${-h-10} -2,${-h-14} Q0,${-h-24} 4,${-h-26} Q4,${-h-16} 8,${-h-12} Q9,${-h-5} 6,${-h}Z" fill="#f6c050" stroke="none"/><path d="M-2,${-h} Q-3,${-h-7} 1,${-h-12} Q4,${-h-7} 3,${-h}Z" fill="#fff3c4" stroke="none"/>`,true)+
 wrapAn('float',`<circle cx="-6" cy="${-h-44}" r="1.6" fill="#f6c050" stroke="none"/><circle cx="7" cy="${-h-50}" r="1.3" fill="#f0802a" stroke="none"/>`,true);
/* ================= 道具 ================= */
function temple(){let s=`<ellipse cx="20" cy="4" rx="300" ry="14" fill="#000" opacity=".12" stroke="none"/>`;
 const tier=(w0,w1,y0,h,dx)=>`<path d="M${-w0/2},${y0} L${-w1/2},${y0-h} L${w1/2},${y0-h} L${w0/2},${y0}Z" fill="url(#stone)"/><path d="M${w0/2},${y0} L${w1/2},${y0-h} L${w1/2+dx},${y0-h-dx*.5} L${w0/2+dx},${y0-dx*.5}Z" fill="${STONED}"/><path d="M${-w1/2},${y0-h} L${w1/2},${y0-h} L${w1/2+dx},${y0-h-dx*.5} L${-w1/2+dx},${y0-h-dx*.5}Z" fill="${STONE2}"/>`;
 s+=tier(560,520,0,110,36)+tier(440,400,-110,100,30)+tier(320,290,-210,90,24);
 // 頂部神殿
 s+=`<path d="M80,-300 L100,-310 L100,-382 L80,-372Z" fill="${STONED}"/><rect x="-80" y="-372" width="160" height="72" fill="${STONE}"/>`;
 s+=[-62,-34,34,62].map(x=>`<rect x="${x-6}" y="-366" width="12" height="62" fill="${STONE2}"/><path d="M${x-2},-362 v54 M${x+2},-362 v54" fill="none" stroke="${STONED}" stroke-width="1"/>`).join('');
 s+=`<path d="M-18,-300 V-344 Q0,-362 18,-344 V-300Z" fill="#3d3833"/>`;
 s+=`<path d="M-96,-372 L96,-372 L118,-384 L-74,-384Z" fill="${STONED}"/><path d="M-96,-372 L0,-410 L96,-372Z" fill="${STONE2}"/><path d="M96,-372 L0,-410 L22,-420 L118,-384Z" fill="${STONED}"/><circle cx="0" cy="-386" r="8" fill="${STONE}"/><path d="M-4,-386 a4,4 0 1 0 8,0 a4,4 0 1 0 -8,0" fill="none" stroke="${OCHRE}" stroke-width="1.6"/>`;
 // 中央階梯
 s+=`<path d="M-46,0 L-36,-300 L36,-300 L46,0Z" fill="${STONE2}"/>`;let st='';for(let y=-12;y>-300;y-=12){const w=46-(-y)/300*10;st+=`M${f(-w)},${y} H${f(w)} `}s+=`<path d="${st}" fill="none" stroke="${STONED}" stroke-width="1.4"/><path d="M-46,0 L-36,-300 M46,0 L36,-300" fill="none" stroke-width="2.4"/>`;
 // 刻紋
 [[-200,-55],[200,-55],[-150,-160],[150,-160],[-110,-255],[110,-255]].forEach(([x,y])=>s+=`<circle cx="${x}" cy="${y}" r="13" fill="${STONE2}" stroke-width="1.6"/><path d="M${x-7},${y} a7,7 0 1 1 14,0 a4,4 0 1 1 -8,0" fill="none" stroke="${OCHRE}" stroke-width="1.6"/>`);
 // 藤蔓與青苔
 [[-268,-100,8],[-230,-110,5],[-196,-210,9],[-120,-300,6],[130,-300,7],[210,-210,6],[250,-110,9],[-60,-372,4],[70,-372,5]].forEach(([x,y,n])=>s+=vine(x,y,n));
 // 更多藤蔓：沿著每一層的上緣垂下來
 [[-260,-110,250],[-200,-210,195],[-145,-300,140]].forEach(([x0,y,x1])=>{for(let x=x0+8;x<x1;x+=sr(18,30)){if(Math.abs(x)<44)continue;s+=vine(f(x),y,ri(3,y===-110?11:8),r()<.5?.8:1)}});
 [[-92,-372],[-40,-372],[44,-372],[90,-372]].forEach(([x,y])=>s+=vine(x,y,ri(3,7),.8));
 // 側面也爬滿藤
 [[290,-30],[300,-60],[255,-140],[235,-170],[200,-240]].forEach(([x,y])=>s+=vine(x,y,ri(3,6),.8));
 // 藤蔓團塊與花
 [[-240,-108],[-150,-108],[170,-108],[240,-108],[-170,-208],[120,-208],[-110,-298],[100,-298]].forEach(([x,y])=>s+=`<ellipse cx="${x}" cy="${y+2}" rx="${ri(14,22)}" ry="6" fill="${LEAF}"/><circle cx="${x+ri(-8,8)}" cy="${y}" r="2.4" fill="${pk(['#e86a6a','#f0a8a0','#fbf6ea'])}" stroke-width="1"/>`);
 [[-240,-20,30],[120,-120,26],[-90,-215,22],[180,-20,24],[60,-306,18]].forEach(([x,y,w])=>s+=`<ellipse cx="${x}" cy="${y}" rx="${w}" ry="6" fill="#7f9d48" stroke="none" opacity=".85"/>`);
 // 火炬（大）
 [[-58,-300],[58,-300]].forEach(([x,y])=>s+=T(x,y,.8,torch(46)));
 return s}
const pillar=(broken)=>{const h=broken?ri(30,55):ri(80,96);let s=`<ellipse cx="3" cy="1" rx="18" ry="4" fill="#000" opacity=".12" stroke="none"/><rect x="-15" y="-8" width="30" height="8" fill="${STONED}"/>`;
 s+=broken?`<path d="M-11,-8 L-11,${-h} L-5,${-h-6} L1,${-h+2} L6,${-h-8} L11,${-h} L11,-8Z" fill="${STONE}"/>`:`<rect x="-11" y="${-h}" width="22" height="${h-8}" fill="${STONE}"/><rect x="-16" y="${-h-10}" width="32" height="10" fill="${STONE2}"/>`;
 s+=`<path d="M-4,-10 V${-h+8} M4,-10 V${-h+8}" fill="none" stroke="${STONED}" stroke-width="1.2"/>`+(r()<.7?vine(-9,-h+4,ri(3,7),.7):'');return s};
const archRuin=()=>`<ellipse cx="0" cy="2" rx="70" ry="8" fill="#000" opacity=".12" stroke="none"/>`+T(-44,0,1,pillar(false))+T(44,0,1,pillar(true))+`<path d="M-62,-106 L40,-106 L36,-90 L-62,-92Z" fill="${STONE2}"/><path d="M28,-6 l18,-10 l14,8 l-6,8Z M-10,-4 l12,-8 l10,6 l-8,6Z" fill="${STONE}"/>`+vine(-30,-92,6,.8);
function wallGlyph(){let s=`<ellipse cx="4" cy="2" rx="66" ry="7" fill="#000" opacity=".12" stroke="none"/>`;
 s+=`<path d="M-62,0 L-62,-58 L-48,-64 L-36,-56 L-20,-70 L-4,-62 L14,-74 L30,-60 L46,-66 L62,-54 L62,0Z" fill="url(#stone)"/><path d="M62,0 L72,-6 L72,-58 L62,-54Z" fill="${STONED}"/>`;
 const fig=(x,y)=>`<g fill="none" stroke="${OCHRE}" stroke-width="2.2"><circle cx="${x}" cy="${y-12}" r="3.6"/><path d="M${x},${y-8} V${y+4} M${x-6},${y-4} L${x+6},${y-4} M${x},${y+4} l-5,7 M${x},${y+4} l5,7"/></g>`;
 s+=`<g opacity=".95">`+fig(-40,-30)+fig(-26,-30)+`<path d="M2,-42 a10,10 0 1 1 0.1,0 M2,-42 a5,5 0 1 1 0.1,0" fill="none" stroke="${OCHRE}" stroke-width="2"/><path d="M-8,-52 l-6,-6 M12,-52 l6,-6 M2,-56 v-7" fill="none" stroke="${OCHRE}" stroke-width="2"/>`;
 s+=`<path d="M24,-24 q6,-10 14,-8 l8,-6 l2,6 q4,6 -2,10 l2,8 M30,-16 l-2,8" fill="none" stroke="${OCHRE}" stroke-width="2.2"/><path d="M-50,-14 c-2,-6 4,-8 5,-2 c1,-6 6,-4 4,2 l-4,6Z" fill="${OCHRE}" stroke="none"/></g>`;
 return s+vine(-56,-60,4,.8)+vine(50,-62,5,.8)}
const altar=()=>`<ellipse cx="4" cy="2" rx="60" ry="8" fill="#000" opacity=".12" stroke="none"/><path d="M-56,0 L-52,-12 L52,-12 L56,0Z" fill="${STONED}"/><rect x="-44" y="-46" width="88" height="34" fill="${STONE}"/><path d="M44,-12 L54,-18 L54,-50 L44,-46Z" fill="${STONED}"/><path d="M-50,-46 L50,-46 L60,-52 L-40,-52Z" fill="${STONE2}"/><rect x="-50" y="-52" width="100" height="6" fill="${STONE2}"/>`+
 `<circle cx="0" cy="-29" r="10" fill="none" stroke="${OCHRE}" stroke-width="2"/><path d="M0,-43 v4 M0,-19 v4 M-14,-29 h4 M10,-29 h4 M-10,-39 l3,3 M10,-39 l-3,3" fill="none" stroke="${OCHRE}" stroke-width="2"/>`+
 `<path d="M-12,-52 Q0,-44 12,-52Z" fill="#7f786a"/>`+wrapAn('fire',`<path d="M0,-52 q-9,-10 0,-24 q9,12 0,24Z" fill="#f0a030"/><path d="M0,-54 q-4,-5 0,-12 q4,6 0,12Z" fill="#f6d27a" stroke="none"/>`,true)+`<circle cx="-30" cy="-56" r="5" fill="#d98c46"/><circle cx="-22" cy="-55" r="4" fill="#c4473c"/><circle cx="32" cy="-56" r="5" fill="#e8c46a"/>`;
const stele=()=>`<ellipse cx="3" cy="1" rx="18" ry="4" fill="#000" opacity=".12" stroke="none"/><path d="M-14,0 L-14,-48 Q0,-62 14,-48 L14,0Z" fill="${STONE}"/><path d="M14,0 L19,-3 L19,-48 Q17,-54 14,-48Z" fill="${STONED}"/>`+[-44,-34,-24,-14].map((y,i)=>`<path d="M-8,${y} h4 v4 h-4z M0,${y} ${i%2?'q4,-4 8,0':'h8'} M-2,${y+6} h10" fill="none" stroke="${OCHRE}" stroke-width="1.4"/>`).join('');
const sunDisk=()=>`<ellipse cx="3" cy="1" rx="26" ry="5" fill="#000" opacity=".12" stroke="none"/><circle cx="0" cy="-26" r="25" fill="${STONE}"/><circle cx="0" cy="-26" r="18" fill="none" stroke="${STONED}" stroke-width="1.6"/><circle cx="0" cy="-26" r="7" fill="${STONE2}"/>`+[...Array(12)].map((_,i)=>{const a=i*Math.PI/6;return `<path d="M${f(Math.cos(a)*9)},${f(-26+Math.sin(a)*9)} L${f(Math.cos(a)*16)},${f(-26+Math.sin(a)*16)}" fill="none" stroke="${OCHRE}" stroke-width="1.6"/>`}).join('')+vine(16,-44,3,.7);
/* 瀑布旁的圖騰石像：圓形生物、中間大眼睛、微笑、頭上兩個小尖角（使用者指定造型 C） */
const totem4=(live)=>{const R=18,cy=-38;return `<ellipse cx="3" cy="1" rx="24" ry="5" fill="#000" opacity=".12" stroke="none"/><path d="M-20,0 L-17,-12 H17 L20,0Z" fill="${STONED}"/><rect x="-14" y="-16" width="28" height="5" fill="${STONE2}"/>`+
 `<circle ${live?'id="totemGlow"':''} cx="0" cy="${cy}" r="23" fill="#9fe0d6" opacity=".32" stroke="none"/>`+
 `<path d="M${-R*.88},${cy-R*.45} L${-R*1.02},${cy-R*1.12} L${-R*.5},${cy-R*.87}Z M${R*.88},${cy-R*.45} L${R*1.02},${cy-R*1.12} L${R*.5},${cy-R*.87}Z" fill="${STONED}"/>`+
 `<circle cx="0" cy="${cy}" r="${R}" fill="${STONE}"/>`+
 `<circle cx="0" cy="${cy-R*.16}" r="${R*.42}" fill="${STONE2}"/><circle cx="0" cy="${cy-R*.16}" r="${R*.24}" fill="#4fb8b0" stroke-width="1.4"/><circle cx="0" cy="${cy-R*.16}" r="${R*.1}" fill="${OL}" stroke="none"/><circle cx="${R*.09}" cy="${cy-R*.26}" r="${R*.055}" fill="#fff" stroke="none"/>`+(live?`<ellipse id="totemLid" cx="0" cy="${cy-R*.16}" rx="${R*.43}" ry="0" fill="${STONE2}" stroke-width="1.6"/><path id="totemLash" d="M${-R*.42},${cy-R*.16} Q0,${cy-R*.02} ${R*.42},${cy-R*.16}" fill="none" stroke-width="1.6" opacity="0"/>`:'')+
 `<path d="M${-R*.42},${cy+R*.4} Q0,${cy+R*.8} ${R*.42},${cy+R*.4}" fill="${STONED}"/>`+
 `<path d="M-17,${cy+8} q4,-5 9,-2 q-3,5 -9,2Z M10,${cy+16} q5,-3 8,1 q-4,3 -8,-1Z M-5,${cy-17} q3,-3 7,-1 q-3,3 -7,1Z" fill="${LEAF}" stroke-width="1.2"/>`};
const guardian=()=>`<ellipse cx="3" cy="1" rx="26" ry="5" fill="#000" opacity=".12" stroke="none"/><rect x="-22" y="-14" width="44" height="14" fill="${STONED}"/><path d="M-16,-14 Q-20,-44 -12,-58 Q0,-66 12,-58 Q20,-44 16,-14Z" fill="${STONE}"/><path d="M-10,-46 h7 M3,-46 h7" fill="none" stroke-width="2.6"/><path d="M-6,-32 Q0,-28 6,-32" fill="none" stroke-width="2"/><path d="M-14,-58 L-10,-70 L-4,-60 M14,-58 L10,-70 L4,-60" fill="${STONE2}" stroke-width="1.6"/>`+vine(10,-60,4,.7);
const rubble=()=>`<path d="M-16,0 l4,-10 l10,-2 l4,10Z" fill="${STONE}"/><path d="M2,0 l3,-8 l9,0 l3,8Z" fill="${STONE2}"/><path d="M-6,-8 l3,-7 l8,1 l1,6Z" fill="${STONED}"/>`;
const fern=()=>{let s='';for(let i=0;i<5;i++){const a=-150+i*30,len=sr(16,24),x2=f(Math.cos(a*Math.PI/180)*len),y2=f(Math.sin(a*Math.PI/180)*len);s+=`<path d="M0,0 Q${f(x2*.4)},${f(y2*.9)} ${x2},${y2}" fill="none" stroke="#56703f" stroke-width="2.2"/>`;for(let k=1;k<4;k++){const t=k/4;s+=`<ellipse cx="${f(x2*t)}" cy="${f(y2*t-1)}" rx="3" ry="1.6" fill="#7f9d48" stroke-width=".8"/>`}}return s};
const turtle=()=>`<ellipse cx="0" cy="-2" rx="10" ry="3" fill="#9d9684" stroke-width="1.4"/><path d="M-9,-4 Q-8,-14 0,-14 Q8,-14 9,-4Z" fill="#6f8a48"/><path d="M-4,-12 l2,4 l4,0 l2,-4 M-6,-6 h12" fill="none" stroke="#4f6a3a" stroke-width="1"/><circle cx="12" cy="-6" r="3.6" fill="#8fae5a"/><circle cx="13" cy="-7" r=".9" fill="${OL}" stroke="none"/>`;
const bfly=()=>{const c=pk(['#e0b44a','#5a86b0','#e86a6a','#9a6fa8']);return `<g transform="translate(0,-30)"><path d="M0,0 Q-9,-9 -8,0 Q-9,7 0,2Z M0,0 Q9,-9 8,0 Q9,7 0,2Z" fill="${c}" stroke-width="1.1"/><path d="M0,-3 V3" fill="none" stroke-width="1.4"/></g>`};
const suitcase=()=>{const c=pk(['#a8703f','#8a5a3a','#6f7d45']);return `<rect x="-15" y="-19" width="30" height="19" rx="3.5" fill="${c}"/><path d="M-6,-19 V-23 H6 V-19" fill="none" stroke-width="2"/><path d="M-8,-19 V0 M8,-19 V0" fill="none" stroke="#5a3a26" stroke-width="2.6"/><rect x="-3.5" y="-12" width="7" height="4" rx="1" fill="#d6ab45" stroke-width="1"/><circle cx="-11.5" cy="-5" r="2.6" fill="#e0b44a" stroke-width="1"/><rect x="9.5" y="-16" width="5" height="4" fill="#6fa8d0" stroke-width=".9"/>`};
const lantern4=()=>`<path d="M0,0 V-30 M-8,-30 H8" fill="none" stroke="#7a5235" stroke-width="2.4"/><path d="M5,-30 v4" fill="none" stroke-width="1"/><rect x="0" y="-26" width="10" height="12" rx="2" fill="#f6d27a"/>`;
const mapTable=()=>`<ellipse cx="2" cy="1" rx="34" ry="5" fill="#000" opacity=".12" stroke="none"/><path d="M-26,0 V-22 M26,0 V-22 M-20,0 V-18 M20,0 V-18" fill="none" stroke="#7a5235" stroke-width="2.6"/><path d="M-32,-22 L32,-22 L28,-30 L-28,-30Z" fill="#c99a5b"/><path d="M-20,-29 L14,-29 L18,-24 L-16,-24Z" fill="#f1e4c0" stroke-width="1.2"/><path d="M-10,-26 q4,-2 8,0 q4,2 6,-1" fill="none" stroke="${OCHRE}" stroke-width="1" stroke-dasharray="1.6 1.4"/><circle cx="22" cy="-32" r="3" fill="#d6ab45" stroke-width="1"/>`;
const flag=()=>`<path d="M0,0 V-60" fill="none" stroke="#7a5235" stroke-width="2.6"/>`+wrapAn('flag',`<path d="M1,-60 L26,-54 L1,-46Z" fill="#c4572f"/>`,true);
/* 巨木（可加樹屋） */
function bigTree(house){const c1=pk(['#5f6b3a','#56603a','#6f7d45']);let s=`<ellipse cx="6" cy="2" rx="60" ry="10" fill="#000" opacity=".15" stroke="none"/>`;
 s+=`<path d="M-46,0 Q-30,-6 -22,-30 L-18,-200 L18,-200 L22,-30 Q30,-6 48,0 Q20,-4 12,6 Q0,-2 -14,6 Q-24,-4 -46,0Z" fill="#7a5a3a"/><path d="M-8,-20 Q-4,-90 -10,-180 M8,-40 Q12,-110 6,-190" fill="none" stroke="#5a3e28" stroke-width="1.6"/>`;
 if(house){s+=`<path d="M-62,-150 L62,-150 L62,-142 L-62,-142Z" fill="#a8703f"/><path d="M-58,-142 L-40,-112 M58,-142 L40,-112" fill="none" stroke="#7a5235" stroke-width="3"/>`;
  s+=`<rect x="-34" y="-196" width="58" height="46" fill="#c99a5b"/><path d="M24,-150 L36,-156 L36,-200 L24,-196Z" fill="#a8703f"/><path d="M-42,-194 L-4,-226 L32,-194Z" fill="#b5a05a"/><path d="M32,-194 L-4,-226 L8,-232 L44,-200Z" fill="#9a8a4a"/><path d="M-36,-200 l8,-8 M-24,-208 l8,-8 M-10,-214 l6,-8" fill="none" stroke="#7f6f3a" stroke-width="1.2"/><rect x="-24" y="-182" width="12" height="12" fill="#f6d27a"/><rect x="4" y="-186" width="14" height="36" fill="#5a3a26"/>`;
  s+=`<path d="M-62,-150 V-164 H62 V-150" fill="none" stroke="#7a5235" stroke-width="2"/><path d="M-62,-157 H62" fill="none" stroke="#c99a5b" stroke-width="1.4"/>`;
  let lad='';for(let y=-14;y>-142;y-=12)lad+=`M30,${y} H42 `;s+=`<path d="M30,0 V-142 M42,0 V-142" fill="none" stroke="#7a5235" stroke-width="2.4"/><path d="${lad}" fill="none" stroke="#7a5235" stroke-width="2"/>`}
 const blob=(x,y,rx,ry,c)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}"/>`;
 s+=blob(-60,-230,58,40,shade(c1,-.1))+blob(60,-236,60,42,shade(c1,-.1))+blob(0,-262,74,50,c1)+blob(-30,-292,50,34,shade(c1,.12))+blob(36,-290,48,32,shade(c1,.12));
 s+=vine(-70,-206,6,.8)+vine(70,-210,7,.8)+vine(-20,-220,4,.8);
 return s}
const ropeBridge=(dx,dy)=>{let s=`<path d="M0,-14 Q${dx/2},${dy/2+18} ${dx},${dy-14} M0,0 Q${dx/2},${dy/2+28} ${dx},${dy}" fill="none" stroke="#7a5235" stroke-width="2"/>`;
 const n=Math.max(6,Math.floor(Math.hypot(dx,dy)/14));for(let k=1;k<n;k++){const t=k/n,x=dx*t,y=dy*t+28*4*t*(1-t);s+=`<path d="M${f(x-2)},${f(y-3)} L${f(x+2)},${f(y+3)}" fill="none" stroke="#c99a5b" stroke-width="5"/><path d="M${f(x)},${f(y)} L${f(x)},${f(y-14+18*4*t*(1-t)-28*4*t*(1-t))}" fill="none" stroke="#7a5235" stroke-width="1"/>`}
 return s};
const pack=back=>{const c=pk(['#8a6a3a','#6f7d45','#c4572f','#5a86b0']);return back?`<rect x="-7" y="-27" width="14" height="15" rx="3" fill="${c}"/><path d="M-4,-22 h8" fill="none" stroke-width="1.2"/>`:`<rect x="-15" y="-26" width="9" height="15" rx="2.5" fill="${c}"/>`};
const HELMET=6;
const ex=(o={})=>({hat:pk([HELMET,HELMET,HELMET,HELMET,-1]),...o,extra:(o.extra||'')+(o.pack===false?'':pack(o.view==='back'||o.view==='bq'))});

Object.assign(KIND,{
 pillar:{w:34,h:100,fn:()=>pillar(false)},pillarB:{w:34,h:60,fn:()=>pillar(true)},rubble:{w:34,h:16,fn:rubble},fern:{w:40,h:22,fn:fern},turtle:{w:30,h:16,fn:turtle},
 stele:{w:34,h:62,fn:stele},totem4:{w:46,h:66,fn:totem4},lantern4:{w:20,h:34,fn:lantern4},bfly:{w:20,h:40,fn:bfly},
 scarabG:{w:30,h:30,fn:()=>T(0,-13,.9,DECOY.scarabG)},maskWood:{w:28,h:32,fn:()=>T(0,-15,.95,DECOY.maskWood)},scrollPlain:{w:30,h:32,fn:()=>T(0,-16,.95,DECOY.scrollPlain)},
 mirror:{w:32,h:32,fn:()=>T(0,-16,.9,DECOY.mirror)},berries:{w:22,h:24,fn:()=>T(0,-11,.9,DECOY.berries)},paintbrush:{w:28,h:30,fn:()=>T(0,-14,.95,DECOY.paintbrush)},
 watch:{w:28,h:32,fn:()=>T(0,-15,.95,DECOY.watch)},jarBroken:{w:26,h:30,fn:()=>T(0,-15,1,DECOY.jarBroken)},parrotR:{w:22,h:36,fn:()=>T(0,-18,1,DECOY.parrotR)},
 suitcase:{w:34,h:26,fn:suitcase},
 coinOld:{w:26,h:26,fn:()=>T(0,-12,.95,DECOY.coinOld)},
 walker4:{w:30,h:62,fn:()=>{const v=pickView(),p=walkPose(v);return act(0,0,r()<.5?1:-1,ex({view:v,pose:p,pack:v!=='front'&&v!=='fq'&&r()<.6}),true)}},
 digBrush:{w:60,h:46,fn:()=>act(-8,0,1,ex({pose:'crouch',pack:false,extra:`<g transform="translate(14,-12) rotate(40)"><rect x="-2" y="-8" width="4" height="10" fill="#c99a5b"/><path d="M-3,2 h6 l1,5 h-8Z" fill="#e8c46a"/></g>`}),'bob')+`<path d="M14,0 l8,-6 l10,2 l-3,6Z" fill="#c4703f" stroke-width="1.3"/>`},
 mapRead:{w:84,h:80,fn:()=>act(-16,0,1,ex({pose:'hold',extra:`<path d="M10,-24 L28,-28 L28,-12 L10,-8Z" fill="#f1e4c0" stroke-width="1.2"/><path d="M16,-20 l6,4 M22,-20 l-6,4" fill="none" stroke="#d8413a" stroke-width="1.2"/>`}),'bob')+act(16,0,-1,ex({pose:'reach'}),'bob')+wrapAn('float',bubble(-2,-76,'dots'),true)},
 photo:{w:44,h:66,fn:()=>act(0,0,r()<.5?1:-1,ex({pose:'hold',extra:`<rect x="10" y="-27" width="12" height="9" rx="2" fill="#3d3833"/><circle cx="16" cy="-22.5" r="2.6" fill="#9fb7e8" stroke-width="1"/>`}),'bob')},
 measure:{w:96,h:62,fn:()=>act(-30,0,1,ex({pose:'reach'}),'bob')+`<path d="M-18,-20 L28,-6" fill="none" stroke="#e0b44a" stroke-width="2.2"/>`+act(32,0,-1,ex({pose:'low'}),'bob')},
 hikerPair:{w:66,h:66,fn:()=>act(-12,0,1,ex({view:'back',pose:'walk',pack:true}),'bob')+act(13,0,1,ex({view:'back',pose:'walk',pack:true}),'bob')}
});
['totem4','torch','pillar','pillarB','stele','rubble','temple','arch','wallGlyph','altar','sunDisk','guardian','bigTree','mapTable'].forEach(k=>HEAVY.add(k));
['pillar','pillarB','stele','rubble','fern','wallGlyph','suitcase'].forEach(k=>OCCK.add(k));
Object.assign(ANIM,{turtle:['bob'],bfly:['flap','float']});ALWAYS.add('bfly');
Object.assign(POOL,{
 falls:[['fern',1.4],['rock',1.2],['frog',.8],['reeds',1.2],['bush',.8],['walker4',.5],['turtle',.5],['mushTan',.3],['scarabG',.25],['berries',.3],['jarBroken',.2],['parrotR',.25],['bfly',.3]],
 temple4:[['walker4',1.4],['fern',.8],['rubble',1.2],['pillarB',.5],['rock',.6],['maskWood',.35],['scarabG',.3],['jarBroken',.35],['scrollPlain',.2],['berries',.2],['keyGrey',.25]],
 plaza4:[['suitcase',.3],['coinOld',.35],['walker4',2.4],['rubble',.8],['fern',.5],['jarBroken',.4],['maskWood',.3],['scrollPlain',.3],['mirror',.3],['watch',.25],['paintbrush',.25],['keyGrey',.2],['dog',.2],['cat',.2],['pot',.4]],
 grove:[['fern',2],['bush',1.4],['round',1],['pine',.5],['rock',.6],['mushTan',.6],['mushBrown',.4],['owl',.4],['frog',.3],['walker4',.6],['berries',.4],['parrotR',.35],['scarabG',.25],['acorn',.4],['bfly',.4]],
 camp:[['coinOld',.25],['walker4',2],['suitcase',.9],['crate',1.2],['crateStack',.6],['barrel',.6],['fern',.4],['rock',.4],['paintbrush',.35],['mirror',.3],['watch',.35],['scrollPlain',.35],['jarBroken',.3],['lantern4',.4],['dog',.3],['cat',.2]],
 trail:[['suitcase',.3],['fern',1.4],['bush',1.4],['round',.8],['pine',.6],['rock',.8],['walker4',1],['mushTan',.4],['acorn',.4],['watch',.2],['mirror',.2],['berries',.3],['bfly',.3]],
 back4:[['walker4',1.6],['fern',1.6],['rubble',1.2],['pillarB',.6],['pillar',.3],['stele',.3],['bush',1],['round',.6],['rock',.8],['coinOld',.4],['scarabG',.3],['maskWood',.25],['jarBroken',.3],['berries',.3],['parrotR',.3],['bfly',.4],['owl',.2]],
 decor4:[['fern',2],['bush',1.4],['round',.8],['rock',.9],['rubble',.6],['walker4',1.4],['crate',.3],['bfly',.4]]});
Object.assign(VPLAN,{falls:{chat:1,petDog:1,flowerWatch:1,reading:1,photo:1},temple:{photo:2,chat:2,mapRead:1},back4:{photo:2,mapRead:2,digBrush:2,hikerPair:1,chat:2,measure:1},plaza4:{digBrush:2,mapRead:2,photo:2,chat:3,handInHand:2,measure:1,carryBox:1,petDog:1},
 grove:{hikerPair:2,chat:1,flowerWatch:1,mushroomPick:2},camp:{digBrush:2,mapRead:2,carryBox:3,measure:1,chat:2,photo:1},trail:{hikerPair:3,dogWalk:2,chat:1},all4:{hikerPair:2,chat:2,photo:2}});

function structures4(){
 const add=(x,y,...a)=>H.add(MX(x),MY(y),...a),mark=(x,y,w,h,sh)=>H.mark(MX(x),MY(y),w*K,h*K,sh),canPlace=(x,y,...a)=>H.canPlace(MX(x),MY(y),...a);
 for(let i=0;i<10;i++){const x=sr(600,1800),y=sr(120,320);add(x,y,20,10,'bird',`<path d="M-8,0 q4,-6 8,0 q4,-6 8,0" fill="none" stroke-width="1.8"/>`,{mark:false})}
 const onTop=(sp,y=1e6)=>{sp.y=y;return sp};
 mark(745,880,540,340,1); // 懸崖面不放東西
 // 大神殿與周邊
 add(1400,1000,600,420,'temple',temple(),{sh:.95});
 add(1180,1010,50,72,'guardian',guardian());add(1640,1010,50,72,'guardian',guardian(),{fl:true});
 [[1350,1014],[1456,1014],[1150,1150],[1650,1150],[1090,1300],[1730,1300]].forEach(([x,y])=>add(x,y,30,100,'torch',torch(64)));
 [[950,1150,0],[1060,1150,1],[1740,1150,0],[1830,1150,1],[930,1450,1],[1830,1440,0],[1100,1470,1],[1700,1470,0]].forEach(([x,y,b])=>add(x,y,34,b?60:100,b?'pillarB':'pillar',pillar(!!b)));
 add(1000,1100,140,120,'arch',archRuin());
 add(960,1300,140,80,'wallGlyph',wallGlyph());add(1780,1320,140,80,'wallGlyph',wallGlyph(),{fl:true});add(1520,1520,140,80,'wallGlyph',wallGlyph());
 add(1370,1330,120,80,'altar',altar());
 // 神殿後方：斷柱、岩畫殘壁、刻石、太陽石盤、守護石像、巨木
 [[1060,700,0],[1120,820,1],[1760,690,1],[1820,820,0],[1700,860,1]].forEach(([x,y,b])=>add(x,y,34,b?60:100,b?'pillarB':'pillar',pillar(!!b)));
 add(1200,760,140,80,'wallGlyph',wallGlyph());add(1640,770,140,80,'wallGlyph',wallGlyph(),{fl:true});
 [[1040,860],[1840,760]].forEach(([x,y])=>add(x,y,34,62,'stele',stele()));
 add(1300,690,56,56,'sunDisk',sunDisk());
 add(1560,640,50,72,'guardian',guardian());
 [[1080,640],[1820,630]].forEach(([x,y])=>{add(x,y,200,330,'bigTree',bigTree(false),{mark:false,s:.8});mark(x,y,60,50)});
 [[1210,1250],[1530,1250],[1240,1420],[1560,1420]].forEach(([x,y])=>add(x,y,34,62,'stele',stele()));
 add(1690,1380,56,56,'sunDisk',sunDisk());
 add(1160,1490,50,50,'sign',signpost('遺跡'));
 // 瀑布：薄霧、荷葉、烏龜、青蛙
 // 圖騰石像畫在地形裡（瀑布後面），見 ground4
 for(let k=0;k<5;k++)add(sr(700,790),sr(880,905),40,30,'steam',steamPuff(),{mark:false,s:sr(1,1.5)});
 for(let k=0;k<10;k++)for(let t=0;t<40;t++){const x=POOL4.cx+sr(-POOL4.rx*.85,POOL4.rx*.85),y=POOL4.cy+sr(-POOL4.ry*.6,POOL4.ry*.7);if(canPlace(x,y,30,14,true,.6)){add(x,y,30,14,'lily',lily(),{fl:r()<.5});break}}
 [[575,958],[912,962],[620,1000]].forEach(([x,y])=>add(x,y,30,16,'turtle',turtle(),{fl:x>740}));
 add(860,1010,22,18,'frog',frog());add(600,900,22,18,'frog',frog(),{fl:true});
 // 巨木與樹屋、吊橋
 const trees=[[620,1300,1],[880,1320,1],[750,1520,0],[600,1690,1],[860,1720,1]];
 trees.forEach(([x,y,h])=>{add(x,y,200,330,'bigTree',bigTree(!!h),{mark:false});mark(x,y,70,60)});
 const bridge=(a,b)=>onTop(H.add(MX(a[0])+62,MY(a[1])-150,10,10,'lift',ropeBridge(MX(b[0])-MX(a[0])-124,MY(b[1])-MY(a[1])),{mark:false}));
 bridge([620,1300],[880,1320]);bridge([600,1690],[860,1720]);
 // 探險隊營地
 add(1300,1630,90,70,'tent',tent('#d98c46'));add(1460,1610,90,70,'tent',tent('#8f9d58'));add(1800,1660,90,70,'tent',tent('#c4572f'));
 add(1400,1720,40,30,'fire',campfire());
 [[1340,1650],[1500,1640],[1760,1690],[1250,1860]].forEach(([x,y])=>add(x,y,34,26,'suitcase',suitcase(),{fl:r()<.5}));
 [[1360,1730,1],[1442,1732,-1],[1400,1756,1]].forEach(([x,y,d])=>add(x,y,30,50,'walker4',act(0,0,d,ex({pose:'sit',pack:false}),'bob')));
 add(1300,1840,70,40,'mapTable',mapTable());add(1250,1570,30,62,'flag',flag());add(1700,1570,30,62,'flag',flag());
 [[PIT.x0+30,PIT.y0+40],[PIT.x0+140,PIT.y0+100],[PIT.x1-30,PIT.y0+60]].forEach(([x,y])=>add(x,y,60,46,'digBrush',KIND.digBrush.fn(),{mark:false}));
 mark((PIT.x0+PIT.x1)/2,PIT.y1,PIT.x1-PIT.x0,PIT.y1-PIT.y0,1);
 [[PIT.x1+30,PIT.y0+20],[PIT.x0-30,PIT.y1-10]].forEach(([x,y])=>add(x,y,28,46,'crateStack',KIND.crateStack.fn()));
 // 步道入口
 add(560,2120,50,50,'sign',signpost('小鎮'));
 [[640,2080],[700,2030]].forEach(([x,y])=>add(x,y,66,66,'hikerPair',KIND.hikerPair.fn()));
}
function scatter4(){
 scatter('falls',POOL.falls,3000,60);scatter('temple',POOL.temple4,3000,70);scatter('plaza4',POOL.plaza4,5000,110);
 scatter('grove',POOL.grove,6000,150);scatter('camp',POOL.camp,6000,150);scatter('trail',POOL.trail,4000,110);scatter('back4',POOL.back4,5000,110);scatter('all4',POOL.decor4,12000,240)}
SCENE_IMPL[4]={ground:ground4,structures:structures4,scatter:scatter4};

/* ================= 過場：森林步道 ================= */
RIDES.trail={text:'沿著森林步道，前往森林古代遺跡⋯',every:330,tick:k=>tone(k%2?240:200,.05,'triangle',.05),svg:()=>{
 const loop=(inner,dur)=>`<g class="rl" style="--d:${dur}s"><g>${inner}</g><g transform="translate(399,0)">${inner}</g></g>`;
 let s=`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">`;
 s+=`<rect width="400" height="600" fill="#e3e8d8" stroke="none"/>`;
 s+=loop(T(80,120,.8,swirl())+T(300,70,.6,swirl()),40);
 s+=loop(`<path d="M0,330 L0,250 L70,180 L130,240 L200,160 L270,230 L340,170 L400,250 L400,330Z" fill="#c3cdb3"/>`+`<path d="M180,250 L200,212 L220,250Z" fill="#b3bb9c" stroke-width="1.4"/>`,30);
 s+=loop(`<path d="M0,600 L0,320 Q100,290 200,316 Q300,286 400,320 L400,600Z" fill="#6f7d45"/>`+[[30,360,.55],[120,350,.5],[230,356,.55],[330,350,.5]].map(([x,y,k])=>`<g transform="translate(${x},${y}) scale(${k})">${roundTree()}</g>`).join(''),14);
 s+=loop(`<rect x="0" y="420" width="400" height="180" fill="${FLOOR}" stroke="none"/><path d="M0,420 H400" fill="none"/>`+[[40,470,.8],[180,480,.75],[320,466,.85]].map(([x,y,k])=>`<g transform="translate(${x},${y}) scale(${k})">${pine()}</g>`).join(''),8);
 s+=loop(`<path d="M0,436 Q100,424 200,436 T400,436 L400,510 Q300,500 200,510 T0,510Z" fill="#c9a979"/>`+[40,150,260,350].map(x=>`<ellipse cx="${x}" cy="${470+(x%20)}" rx="5" ry="3" fill="#b0a996" stroke-width="1.2"/>`).join(''),3);
 s+=`<g transform="translate(170,478)">${act(0,0,1,ex({pose:'walk',hat:HELMET,pack:true}),'bob')}</g><g transform="translate(222,484)">${act(0,0,1,ex({pose:'walk',hat:HELMET,pack:true}),'bob')}</g>`;
 s+=loop([[20,600,1.1],[200,612,1.2],[330,598,1]].map(([x,y,k])=>`<g transform="translate(${x},${y}) scale(${k})">${fern()}</g>`).join(''),1.6);
 return s+`</g></svg>`}};

/* ================= 冒險地圖節點 ================= */
HERE[4]=[96,70];
MAPHOOKS.push(({U,P,ink,FN})=>{if(U<4)return '';
 let m=`<path d="M92,198 Q70,170 76,140 Q82,118 66,104" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round"/><path d="M92,198 Q70,170 76,140 Q82,118 66,104" fill="none" stroke="#ead7a6" stroke-width="4.5" stroke-linecap="round"/><path d="M92,198 Q70,170 76,140 Q82,118 66,104" fill="none" stroke="#a8461f" stroke-width="1.6" stroke-dasharray="4 5" stroke-linecap="round"/>`;
 m+=`<g class="mnode" data-n="4"><circle cx="60" cy="96" r="36" fill="transparent"/><ellipse cx="60" cy="104" rx="36" ry="11" fill="#7f8f52" stroke="${ink}" stroke-width="1.3"/>`;
 m+=P('M36,104 L42,92 L78,92 L84,104Z','#b9ab8c',1.3)+P('M44,92 L48,82 L72,82 L76,92Z','#c6b99a',1.3)+P('M51,82 L54,74 L66,74 L69,82Z','#b9ab8c',1.3)+`<rect x="57" y="96" width="6" height="8" fill="${ink}"/><path d="M42,94 q2,6 -1,10 M78,94 q-2,6 1,10" fill="none" stroke="#5f7a3f" stroke-width="1.6"/>`;
 m+=`<g transform="translate(64,126)"><rect x="-44" y="-11" width="88" height="20" rx="10" fill="#fffaf0" stroke="${ink}" stroke-width="1.8"/><text y="4.5" text-anchor="middle" font-size="12" fill="${ink}" font-family="${FN}">森林古代遺跡</text></g></g>`;
 return m});
})();
