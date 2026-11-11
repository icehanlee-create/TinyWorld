/* 奇幻小鎮大搜查．第 1 關「奇幻小鎮」＋第 1、2 關共用的世界地形
   由 index.html 開遊戲時載入（ensureUpTo 依序載入 level1.js、level2.js⋯），把物件、場景、小故事註冊到 window.TH。
   第 1、2 關是同一張大地圖：小鎮在西邊（x 0～1800），農莊在東邊（x 1760～2800）。
   地形（河、池塘、海岸、山）畫在這裡的 buildGround(sc)，第 2 關透過 H.W12 借用。 */
(function(){
const H=window.TH;if(!H)return;
const {CELL,DECOY,DK,GC,GR,LEVELS,OL,POOL,REG,ROADS,SCATOK,SCATREG,SCENES,SCENE_IMPL,STORIES,T,VPLAN:VPLANX,WATERFN,act,add,balloon,bow,campfire,
 castle,cat,chaikin,chibi,f,ferry,fountain,house,isWater,kayak,kid,lighthouse,mulberry32,mushHouse,occ,peekHead,pine,pk,r,rowboat,sailboat,scatter,
 shade,signpost,skyBirds,sr,stall,swan,swirl,tent,tower,well,windmill,wrapAn}=H;

const TYPES1=[
 {id:'hat',name:'紫色魔法帽',short:'魔法帽',r:16,rot:20,regions:['top','village','forest','plaza']},
 {id:'key',name:'金鑰匙',short:'金鑰匙',r:15,rot:180,regions:['village','plaza','top','banks']},
 {id:'potion',name:'粉紅藥水',short:'藥水',r:15,rot:15,regions:['top','village','forest','plaza']},
 {id:'fish',name:'藍色小魚',short:'小魚',r:15,rot:25,regions:['river','fishstall','harbor','river']},
 {id:'mushroom',name:'紅點蘑菇',short:'紅蘑菇',r:15,rot:12,regions:['forest','banks','forest','village']},
 {id:'cat',name:'黑貓',short:'黑貓',r:15,rot:8,regions:['village','meadow','plaza','forest']},
 {id:'pumpkin',name:'南瓜燈',short:'南瓜燈',r:15,rot:10,regions:['village','forest','plaza','meadow']},
 {id:'star',name:'笑臉星星',short:'星星',r:16,rot:30,regions:['sky','meadow','village','forest']},
 {id:'letter',name:'愛心信封',short:'信封',r:15,rot:30,regions:['village','plaza','top','banks']},
 {id:'snail',name:'蝸牛',short:'蝸牛',r:16,rot:10,regions:['forest','banks','village','forest']},
 {id:'cake',name:'草莓蛋糕',short:'蛋糕',r:15,rot:12,regions:['plaza','village','forest','plaza']},
 {id:'umbrella',name:'綠雨傘',short:'雨傘',r:16,rot:35,regions:['plaza','banks','village','top']}
];
/* ================= 第 1、2 關共用的世界地形（北、西是山，南邊是海，東邊是農莊） ================= */
const RIVER=chaikin([[150,790],[300,900],[520,1040],[760,1170],[1000,1240],[1230,1290],[1400,1380],[1500,1500],[1560,1640],[1610,1830]],3);
const RLEN=[0];for(let i=1;i<RIVER.length;i++)RLEN.push(RLEN[i-1]+Math.hypot(RIVER[i][0]-RIVER[i-1][0],RIVER[i][1]-RIVER[i-1][1]));
const RTOT=RLEN[RLEN.length-1],rhw=d=>44+24*(d/RTOT);
function riverDist(x,y){let best=1e9,bd=0;for(let i=0;i<RIVER.length-1;i++){const[a0,a1]=RIVER[i],[b0,b1]=RIVER[i+1],dx=b0-a0,dy=b1-a1,L=dx*dx+dy*dy;let t=((x-a0)*dx+(y-a1)*dy)/L;t=Math.max(0,Math.min(1,t));const px=a0+dx*t,py=a1+dy*t,d=Math.hypot(x-px,y-py);if(d<best){best=d;bd=RLEN[i]+Math.sqrt(L)*t}}return[best,bd]}
const inRiver=(x,y)=>{const[d,a]=riverDist(x,y);return d<rhw(a)};
const POND={cx:2300,cy:1350,rx:170,ry:80};
const inPond=(x,y)=>((x-POND.cx)/POND.rx)**2+((y-POND.cy)/POND.ry)**2<1;
const coastB=x=>1705+18*Math.sin(x/90)+10*Math.sin(x/233);
const LAND=(()=>{const P=[[-450,330],[3250,330]];for(let x=3250;x>=-450;x-=20)P.push([x,coastB(x)]);return P})();
const LANDPATH='M'+LAND.map(p=>f(p[0])+','+f(p[1])).join(' L')+'Z';
function isLand(x,y){if(y<330)return true;let c=false;for(let i=0,j=LAND.length-1;i<LAND.length;j=i++){const[xi,yi]=LAND[i],[xj,yj]=LAND[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c}return c}
const BRIDGE={x0:975,x1:1025,y0:1165,y1:1320};
const DOCKS=[[930,1690,1060,1795],[1180,1690,1310,1795],[2600,1690,2700,1795]];
function isWaterW(x,y){
 if(x>=BRIDGE.x0&&x<=BRIDGE.x1&&y>BRIDGE.y0&&y<BRIDGE.y1)return false;
 for(const[a,b,c,d] of DOCKS)if(x>=a&&x<=c&&y>=b&&y<=d)return false;
 if(x>108&&x<192&&y>600&&y<800)return true;
 if(((x-172)/90)**2+((y-816)/34)**2<1)return true;
 if(inPond(x,y))return true;
 if(y>1600&&!isLand(x,y))return true;
 return inRiver(x,y);
}
const westEdge=y=>150+38*Math.sin(y/95)+22*Math.sin(y/37);
function ridge(y0,amp,step,seed,x0=-450,x1=3250){const R=mulberry32(seed);let d=`M${x0},${y0}`;for(let x=x0;x<x1;x+=step){d+=` Q${f(x+step/2)},${f(y0-amp*(.6+R()*.7))} ${f(x+step)},${f(y0-amp*R()*.35)}`}return d}
function farStuff(sc){
 let s='';const P='#b9cbc1',PS='#86a09a';
 [[-170,1960,150,52],[400,2050,130,46],[900,2000,200,52],[1500,2060,140,44],[2050,1990,180,56],[2600,2070,130,42],[3050,1960,160,50]].forEach(([x,y,a,b],i)=>{
  s+=`<path d="M${x-a},${y} Q${x-a*.6},${y-b} ${x-a*.1},${y-b*.9} Q${x+a*.3},${y-b*1.3} ${x+a*.7},${y-b*.5} Q${x+a},${y-b*.2} ${x+a},${y}Z" fill="${P}" stroke="${PS}" stroke-width="1.6"/>`;
  if(i%2===0)for(let k=0;k<3;k++){const hx=x-a*.3+k*a*.25,hy=y-b*.7+k*4;s+=`<path d="M${f(hx-8)},${f(hy+8)} V${f(hy)} L${f(hx)},${f(hy-8)} L${f(hx+8)},${f(hy)} V${f(hy+8)}Z" fill="#a8bdb2" stroke="${PS}" stroke-width="1.2"/>`}
  if(i===4)s+=`<path d="M${x+a*.4-5},${y-b*.5} L${x+a*.4-3},${y-b*.5-46} L${x+a*.4+3},${y-b*.5-46} L${x+a*.4+5},${y-b*.5}Z" fill="#c7d3cc" stroke="${PS}" stroke-width="1.2"/>`;
 });
 [[2900,1880,.8],[260,1930,.7],[1350,1990,.6],[2300,1950,.6]].forEach(([x,y,k])=>s+=`<g transform="translate(${x},${y}) scale(${k})" opacity=".5"><path d="M0,-6 V-60" fill="none" stroke="${PS}" stroke-width="2"/><path d="M3,-56 L30,-14 L3,-14Z" fill="#e8eee9" stroke="${PS}" stroke-width="1.6"/><path d="M-36,-8 L36,-8 L26,6 L-26,6Z" fill="${P}" stroke="${PS}" stroke-width="1.6"/></g>`);
 [[2980,760,1],[3080,1120,.8],[2960,1420,.9]].forEach(([x,y,k],i)=>s+=`<g transform="translate(${x},${y}) scale(${k})" opacity=".45" stroke="#8a8068" stroke-width="1.6">`+(i===1?`<path d="M-18,0 L-12,-80 L12,-80 L18,0Z" fill="#e2dccb"/><path d="M0,-84 l-40,-30 M0,-84 l40,-30 M0,-84 l-30,40 M0,-84 l30,40" fill="none" stroke-width="5"/>`:`<path d="M-50,0 V-40 L0,-70 L50,-40 V0Z" fill="#d9c3b4"/><path d="M-50,-40 L0,-70 L50,-40" fill="none"/>`)+`</g>`);
 s+=`<g transform="translate(-140,120)" opacity=".75"><path d="M-90,0 Q-40,-14 0,-10 Q50,-16 90,0 Q40,40 10,110 Q-20,40 -90,0Z" fill="#b4a88c" stroke="#8a8068" stroke-width="1.6"/><path d="M-90,0 Q-40,-14 0,-10 Q50,-16 90,0 Q40,8 0,6 Q-40,8 -90,0Z" fill="#a9b98a" stroke="#8a8068" stroke-width="1.6"/><path d="M-10,-6 L-10,-60 L10,-60 L10,-6Z" fill="#e2dccb" stroke="#8a8068" stroke-width="1.4"/><path d="M-15,-60 L0,-90 L15,-60Z" fill="#c9a08a" stroke="#8a8068" stroke-width="1.4"/></g>`;
 s+=`<g transform="translate(3050,40)" opacity=".7"><path d="M-14,0 L-10,-110 L10,-110 L14,0Z" fill="#dcd6c6" stroke="#8a8068" stroke-width="1.4"/><path d="M-16,-110 L0,-170 L16,-110Z" fill="#c9b08a" stroke="#8a8068" stroke-width="1.4"/></g>`;
 const ghost=(x,y,k,inner)=>`<g transform="translate(${x},${y}) scale(${k})" opacity=".5" stroke="#8a8068" stroke-width="1.8">${inner}</g>`;
 if(sc===1){s+=ghost(1900,820,1,`<path d="M-50,0 V-50 L-30,-80 L0,-92 L30,-80 L50,-50 V0Z" fill="#d9b8a8"/><path d="M-14,0 V-34 H14 V0" fill="#c9a898"/>`)+ghost(1990,820,1,`<path d="M-16,0 V-110 Q0,-126 16,-110 V0Z" fill="#dcd6c6"/>`)+ghost(2060,700,.9,`<path d="M-18,0 L-12,-80 L12,-80 L18,0Z" fill="#e2dccb"/><path d="M0,-84 l-40,-30 M0,-84 l40,-30 M0,-84 l-30,40 M0,-84 l30,40" fill="none" stroke-width="5"/>`)}
 if(sc===2){s+=ghost(1600,560,1,`<path d="M-80,0 V-70 H80 V0Z" fill="#e2dccb"/><path d="M-20,-70 V-150 H20 V-70Z" fill="#e2dccb"/><path d="M-26,-150 L0,-200 L26,-150Z" fill="#b8b0c8"/><path d="M-90,-70 V-130 H-60 V-70 M60,-70 V-130 H90 V-70" fill="#e2dccb"/>`)+ghost(1650,760,.9,`<path d="M-40,0 V-40 L0,-70 L40,-40 V0Z" fill="#dcd0b8"/>`)}
 return s;
}
function buildGround(sc){const SC=SCENES[sc];
 const NS_=`stroke="none"`;
 let s=`<defs><clipPath id="landClip"><path d="${LANDPATH}"/></clipPath></defs>`;
 s+=`<rect x="-400" y="-400" width="3700" height="2600" fill="#8fbcb5" ${NS_}/>`;
 let wv='';for(let i=0;i<200;i++){const x=sr(SC.x0-300,SC.x1+300),y=sr(1650,2100);if(isLand(x,y)||isLand(x,y-40))continue;wv+=`M${f(x)},${f(y)} q8,-4 16,0 q8,4 16,0 `}
 s+=`<path d="${wv}" fill="none" stroke="#e6f0ec" stroke-width="1.6"/>`;
 s+=farStuff(sc);
 s+=`<rect x="-400" y="-400" width="3700" height="740" fill="#f6efe0" ${NS_}/>`;
 const FM=ridge(170,130,300,11);
 s+=`<path d="${FM} L3250,340 L-450,340Z" fill="#cdd3b4" ${NS_}/><path d="${FM}" fill="none" stroke="#8f9a7c" stroke-width="1.6"/>`;
 [[200,190,1],[620,150,1.2],[1120,175,1],[1540,160,1.1],[860,80,.8],[1350,70,.8],[380,60,.7],[1780,230,.8],[20,240,.8],[2050,170,1],[2400,120,1.1],[2700,200,.9],[2250,60,.7],[2950,150,1]].forEach(([x,y,k])=>s+=T(x,y,k,swirl()));
 s+=`<path d="${LANDPATH}" fill="none" stroke="#d9ebe5" stroke-width="64" stroke-linejoin="round"/><path d="${LANDPATH}" fill="none" stroke="#eef6f2" stroke-width="30" stroke-linejoin="round"/>`;
 s+=`<path d="${LANDPATH}" fill="#a3ad66" ${NS_}/>`;
 s+=`<g clip-path="url(#landClip)">`;
 // north ridge
 const RT=ridge(300,120,240,23);
 s+=`<path d="${RT} L3250,760 Q2600,690 2200,720 Q1800,690 1600,720 Q1300,640 900,660 Q500,640 200,720 Q-100,690 -450,760Z" fill="#8f9d58" ${NS_}/>`;
 s+=`<path d="M-450,760 L-450,440 Q-200,410 0,450 Q200,400 400,440 Q600,400 800,450 Q1000,400 1200,450 Q1400,410 1600,450 Q1800,410 2000,450 Q2200,405 2400,445 Q2600,410 2800,450 Q3000,415 3250,440 L3250,760 Q2600,690 2200,720 Q1800,690 1600,720 Q1300,640 900,660 Q500,640 200,720 Q-100,690 -450,760Z" fill="${shade('#8f9d58',-.28)}" opacity=".85" ${NS_}/>`;
 s+=`<path d="${RT}" fill="none" stroke-width="2.4"/>`;
 let mh='';for(let i=0;i<160;i++){const x=sr(SC.x0-300,SC.x1+300),y=sr(300,560);mh+=`M${f(x)},${f(y)} l${f(sr(6,12))},${f(sr(4,8))} `}
 s+=`<path d="${mh}" fill="none" stroke-width="1" opacity=".5"/>`;
 [[380,500,22],[1450,490,22],[700,450,15],[1190,440,14],[1700,470,18],[2200,470,18],[2470,450,14]].forEach(([x,y,R])=>{s+=`<path d="M${x-R},${y} Q${x-R},${y-R*1.3} ${x},${y-R*1.4} Q${x+R},${y-R*1.3} ${x+R},${y}Z" fill="${DK}"/><path d="M${x-R-6},${y+1} Q${x},${y+6} ${x+R+6},${y+1}" fill="none" stroke-width="2.4"/>`});
 // village plateau
 s+=`<path d="M300,610 Q600,550 900,568 Q1200,550 1510,610 Q1550,800 1530,1110 Q1250,1190 1000,1160 Q700,1095 500,1015 Q330,955 290,880 Q270,740 300,610Z" fill="#e3d2a4" ${NS_} opacity=".9"/>`;
 s+=`<path d="M330,640 Q600,585 900,600 Q1200,585 1480,640 Q1505,800 1495,1080 Q1250,1150 1000,1125 Q700,1060 520,985 Q360,930 325,860 Q305,740 330,640Z" fill="#ead6a8" ${NS_}/>`;
 [[480,700,110,36],[1250,720,120,38],[700,870,130,36],[1350,880,110,34],[1150,1020,120,32],[560,960,90,28]].forEach(([x,y,a,b])=>s+=`<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="#b5bd7a" ${NS_}/>`);
 // fields: L1 meadow + L2 farm
 const fld=(x,y,w,h,pat,rot)=>`<g transform="rotate(${rot} ${x+w/2} ${y+h/2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="url(#${pat})" ${NS_}/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="none" stroke="#7a8a46" stroke-width="5" opacity=".45"/></g>`;
 s+=fld(1560,640,150,90,'wheat',-3)+fld(1590,860,140,100,'cabbage',2)+fld(1555,1060,160,90,'soil',-2);
 s+=fld(1850,600,220,140,'wheat',-4)+fld(2110,580,180,120,'cabbage',3)+fld(2330,600,200,130,'soil',-2)+fld(2570,620,190,140,'wheat',4)+fld(1880,980,200,140,'cabbage',2)+fld(2580,960,190,150,'soil',-3)+fld(1850,1150,170,100,'wheat',3);
 // forest floor (west, below river)
 s+=`<path d="M20,1120 Q300,1070 560,1150 Q760,1220 810,1340 Q840,1520 800,1760 L-20,1760Z" fill="#8a9658" ${NS_}/>`;
 for(let i=0;i<22;i++){const x=sr(170,740),y=sr(1150,1680);if(inRiver(x,y))continue;s+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(40,85))}" ry="${f(sr(14,24))}" fill="#6f7a46" ${NS_}/>`}
 // plaza
 s+=`<path d="M780,1345 Q1050,1305 1380,1360 Q1420,1550 1400,1760 L770,1760 Q750,1550 780,1345Z" fill="#ead6a8" ${NS_}/>`;
 s+=`<ellipse cx="1080" cy="1560" rx="230" ry="130" fill="url(#cob)" stroke-width="1.8"/><path d="M975,1320 L1080,1320 L1090,1440 L985,1440Z" fill="url(#cob)" ${NS_}/>`;
 // farm market by the coast + pond
 s+=`<ellipse cx="2360" cy="1610" rx="300" ry="100" fill="#ead6a8" ${NS_}/>`;
 s+=`<ellipse cx="${POND.cx}" cy="${POND.cy}" rx="${POND.rx+12}" ry="${POND.ry+9}" fill="#c9b98a" ${NS_}/><ellipse cx="${POND.cx}" cy="${POND.cy}" rx="${POND.rx}" ry="${POND.ry}" fill="#8fbcb5" stroke-width="2.2"/><path d="M2190,1350 q8,-4 16,0 q8,4 16,0 M2320,1380 q8,-4 16,0 q8,4 16,0 M2380,1320 q8,-4 16,0 q8,4 16,0" fill="none" stroke="#e6f0ec" stroke-width="1.6"/>`;
 // west mountains
 let wp='M-450,300';for(let y=300;y<=1780;y+=30)wp+=` L${f(westEdge(y))},${y}`;wp+=' L-450,1780Z';
 let we='M'+[...Array(50)].map((_,i)=>{const y=300+i*30;return `${f(westEdge(y))},${y}`}).join(' L');
 s+=`<path d="${wp}" fill="#76824e" ${NS_}/>`;
 let wi='M-450,300';for(let y=300;y<=1780;y+=30)wi+=` L${f(westEdge(y)-46+14*Math.sin(y/50))},${y}`;wi+=' L-450,1780Z';
 s+=`<path d="${wi}" fill="${shade('#76824e',-.3)}" ${NS_}/><path d="${we}" fill="none" stroke-width="2.4"/>`;
 let wh='';for(let i=0;i<90;i++){const y=sr(320,1740),x=westEdge(y)-sr(10,90);wh+=`M${f(x)},${f(y)} l${f(sr(-10,-4))},${f(sr(6,10))} `}
 s+=`<path d="${wh}" fill="none" stroke-width="1" opacity=".5"/>`;
 // cliff + waterfall
 s+=`<path d="M-400,565 Q-200,545 0,568 Q150,548 280,560 Q300,690 262,825 Q120,860 -400,850Z" fill="#7d6044" ${NS_}/><path d="M240,570 L280,560 Q300,690 262,825 L236,830 Q262,700 240,570Z" fill="#4a3a2a" ${NS_}/><path d="M-400,565 Q-200,545 0,568 Q150,548 280,560 Q300,690 262,825" fill="none" stroke-width="2.4"/><path d="M40,600 q10,40 0,80 M230,600 q10,50 -4,110 M20,720 q10,40 -5,90" fill="none" stroke-width="1.6"/>`;
 [[250,690,13],[60,650,14],[30,790,12]].forEach(([x,y,R])=>s+=`<path d="M${x-R},${y} Q${x-R},${y-R*1.6} ${x},${y-R*1.7} Q${x+R},${y-R*1.6} ${x+R},${y}Z" fill="${DK}"/>`);
 s+=`<rect x="108" y="590" width="84" height="215" fill="#cfe6e0" ${NS_}/><path d="M120,598 V800 M138,594 V805 M158,598 V802 M178,594 V800" fill="none" stroke="#fbf6ea" stroke-width="3"/><path d="M108,590 V805 M192,590 V805" fill="none" stroke-width="2.4"/>`;
 // paths
 const pth0=(d,w,c='#e2c896')=>`<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w+5}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`;;const pth=(d,w,c)=>{ROADS.push([d,w]);return pth0(d,w,c)};
 s+=pth('M900,1000 C910,1080 1000,1090 1000,1170',44)+pth('M1000,1300 C1000,1360 1040,1380 1035,1440',44)+pth('M985,1330 C820,1370 640,1330 470,1450 S240,1640 180,1760',40)+pth('M600,860 C500,840 420,900 330,880',30);
 s+=pth('M1500,790 C1600,770 1700,820 1850,830 S2100,820 2250,850 S2550,830 3250,860',36)+pth('M2250,850 C2260,1000 2200,1150 2230,1250 S2320,1500 2360,1660',32)+pth('M2050,830 C2040,780 2000,760 1990,740',24)+pth('M2650,850 C2660,700 2620,640 2650,560 C2680,470 2620,420 2660,340',22,'#d9c9a6');
 s+=`<path d="M860,540 L940,540 L950,1005 L850,1005Z" fill="url(#stp)" ${NS_}/><path d="M860,540 L850,1005 M940,540 L950,1005" fill="none" stroke-width="2.4"/>`;
 // beach band
 s+=`<path d="${LANDPATH}" fill="none" stroke="#e6d3a4" stroke-width="46" stroke-linejoin="round"/><path d="${LANDPATH}" fill="none" stroke="#d9c38f" stroke-width="10" stroke-dasharray="2 9" stroke-linecap="round" opacity=".7"/>`;
 s+=`</g>`;
 // river
 const Lp=[],Rp=[];for(let i=0;i<RIVER.length;i++){const a=RIVER[Math.max(0,i-1)],b=RIVER[Math.min(RIVER.length-1,i+1)];let nx=-(b[1]-a[1]),ny=b[0]-a[0];const n=Math.hypot(nx,ny)||1;nx/=n;ny/=n;const hw=rhw(RLEN[i]);Lp.push([RIVER[i][0]+nx*hw,RIVER[i][1]+ny*hw]);Rp.push([RIVER[i][0]-nx*hw,RIVER[i][1]-ny*hw])}
 const pl=a=>'M'+a.map(p=>f(p[0])+','+f(p[1])).join(' L');
 s+=`<path d="${pl(Lp.slice(6))} L${Rp.slice(6).reverse().map(p=>f(p[0])+','+f(p[1])).join(' L')}Z" fill="#8fbcb5" ${NS_}/>`;
 s+=`<g clip-path="url(#landClip)"><path d="${pl(Lp.slice(7))} M${Rp.slice(7).map(p=>f(p[0])+','+f(p[1])).join(' L')}" fill="none" stroke="#6f9a90" stroke-width="7" opacity=".55"/><path d="${pl(Lp.slice(7))} M${Rp.slice(7).map(p=>f(p[0])+','+f(p[1])).join(' L')}" fill="none" stroke-width="2.2"/></g>`;
 let rp='';for(let i=0;i<50;i++){const k=Math.floor(sr(8,RIVER.length-3)),[x,y]=RIVER[k];rp+=`M${f(x+sr(-30,20))},${f(y+sr(-20,20))} q8,-4 16,0 q8,4 16,0 `}
 s+=`<path d="${rp}" fill="none" stroke="#e6f0ec" stroke-width="1.6"/>`;
 s+=`<ellipse cx="172" cy="816" rx="90" ry="34" fill="#8fbcb5" ${NS_}/><path d="M82,816 Q84,782 172,782 Q260,782 262,816" fill="none" stroke-width="2.2"/><path d="M94,824 Q150,850 200,846" fill="none" stroke="#6f9a90" stroke-width="5" opacity=".5"/><ellipse cx="152" cy="804" rx="58" ry="14" fill="#fbf6ea" ${NS_}/>`;
 s+=`<rect x="${BRIDGE.x0}" y="${BRIDGE.y0}" width="${BRIDGE.x1-BRIDGE.x0}" height="${BRIDGE.y1-BRIDGE.y0}" fill="url(#plank)"/><path d="M${BRIDGE.x0},${BRIDGE.y0} V${BRIDGE.y1} M${BRIDGE.x1},${BRIDGE.y0} V${BRIDGE.y1}" fill="none" stroke="#7a5235" stroke-width="5"/>`;
 DOCKS.forEach(([a,b,c,d])=>s+=`<rect x="${a}" y="${b}" width="${c-a}" height="${d-b}" fill="url(#plank)"/><path d="M${a+6},${d} v10 M${c-6},${d} v10" fill="none" stroke-width="4"/>`);
 TERR.forEach(([yy,x0,x1])=>{let d='',run=null;for(let x=x0;x<=x1;x+=10){const ok=!(x>846&&x<954)&&!isWater(x,yy+14)&&!isWater(x,yy-10);if(ok&&run===null)run=x;if((!ok||x+10>x1)&&run!==null){const e=ok?x+10:x;if(e-run>30)d+=`M${run},${yy+3} L${e},${yy+3} L${e},${yy+24} L${run},${yy+24}Z `;run=null}}
  if(d)s+=`<path d="${d}" fill="url(#stone)"/>`});
 let tufts='';for(let i=0;i<1700;i++){const x=sr(Math.max(140,SC.x0-60),SC.x1+60),y=sr(560,1720);if(isWater(x,y)||isWater(x,y+24))continue;tufts+=`M${f(x)},${f(y)} l-3,-6 M${f(x)},${f(y)} l3,-6 `}
 s+=`<path d="${tufts}" fill="none" stroke="#6f7d3f" stroke-width="1.3"/>`;
 return s;
}
const TERR=[[660,300,1515],[800,300,1515],[940,300,1515],[1080,1060,1515]];
function mark0(x0,y0,x1,y1){for(let j=Math.floor(y0/CELL);j<=Math.floor(y1/CELL);j++)for(let i=Math.floor(x0/CELL);i<=Math.floor(x1/CELL);i++)if(i>=0&&j>=0&&i<GC&&j<GR)occ[j*GC+i]=1}
function structures1(){skyBirds(1);
 add(300,230,60,110,'balloon',balloon('#c4572f','#e0b44a'),{mark:false});
 add(1500,290,60,110,'balloon',balloon('#6fa8a0','#fbf6ea'),{mark:false,s:.75});
 add(900,545,330,300,'castle',castle(),{sh:.95});
 add(1330,575,60,330,'tower',tower(58,230,{roof:'#d98a42',rh:120,door:true}),{sh:.9});
 add(560,580,80,200,'mill',windmill(),{sh:.6});
 [[380,500,.7],[1450,490,.7],[700,450,.5],[1700,470,.6],[250,690,.45],[60,650,.5],[2200,470,.6],[2470,450,.5]].forEach(([x,y,k])=>add(x,y-2,30,30,'peek',wrapAn('bob',peekHead(0,-14*k/.7,k,true),true),{mark:false}));
 add(1340,605,40,40,'peek',`<g transform="scale(.9)">${chibi({arm:2,hat:3})}</g>`,{mark:false});
 // west mountain pines
 for(let y=880;y<1700;y+=sr(40,70)){const x=westEdge(y)-sr(5,40);add(x,y,50,98,'pine',pine(),{sh:.6})}
 mark0(846,540,954,1005);
 TERR.forEach(([yy,x0,x1])=>{mark0(x0,yy+2,x1,yy+24);let x=x0;while(x<x1){const w=sr(78,125);if(x+w>x1)break;if(x+w>846&&x<954){x=956;continue}
  const cx=x+w/2;if(isWater(cx,yy+14)||isWater(cx-w/2,yy+14)||isWater(cx+w/2,yy+14)||isWater(cx,yy-60)){x+=40;continue}
  add(cx,yy,w+16,sr(58,90)+w*.7,'house',house(w,sr(58,90),{sign:r()<.25}),{sh:.92});x+=w+sr(30,70)}});
 add(1640,760,120,120,'house',house(110,70,{roof:'#a85640',wall:'#dcb894'}),{sh:.9});
 // river life
 add(520,1062,80,40,'boat',kayak('#c4572f'),{mark:false});
 add(1330,1345,80,40,'boat',kayak('#e0b44a'),{mark:false});
 add(770,1185,80,40,'boat',rowboat(),{mark:false});
 add(1470,1475,40,30,'rock',`<path d="M-26,0 Q-30,-14 -14,-20 Q4,-26 20,-16 Q30,-8 26,0Z" fill="#9a9a8a"/><g transform="translate(0,-14) scale(.8)">${kid({shirt:'#6fa8a0',hair:'#c4572f',hs:2,pose:'up'})}<path d="M-9,-8 Q-14,8 -24,10 Q-18,0 -10,-2" fill="#6fa8a0"/></g>`,{mark:false});
 for(const [x,y] of [[380,958],[1150,1268],[880,1212]])add(x,y,34,34,'swan',swan(),{mark:false,fl:r()<.5});
 [[680,1215],[1270,1400]].forEach(([x,y])=>add(x,y,30,56,'fisher',`<path d="M9,-9 L26,-66" fill="none" stroke="#7a5235" stroke-width="2.4"/><path d="M26,-66 Q34,-50 32,-40" fill="none" stroke-width=".9"/><circle cx="32" cy="-40" r="2.5" fill="#d8413a" stroke-width="1"/>`+act(0,0,1,{view:'back',pose:'sit',hat:1},'bob')));
 add(1150,1185,30,56,'fisher',act(0,0,-1,{pose:'sit',hat:1,extra:`<path d="M10,-11 L40,-44" fill="none" stroke="#7a5235" stroke-width="2.4"/><path d="M40,-44 Q46,-10 44,30" fill="none" stroke-width=".9"/>`},false));
 // forest
 add(260,1320,120,115,'mush',mushHouse(),{sh:.85});
 add(600,1380,120,115,'mush',mushHouse(),{s:.85,sh:.85});
 add(360,1620,120,115,'mush',mushHouse(),{s:.9,sh:.85});
 add(660,1640,120,115,'mush',mushHouse(),{s:.85,sh:.85});
 add(430,1500,70,55,'tent',tent('#e0b44a'));
 add(520,1520,70,55,'tent',tent('#c4572f'));
 add(475,1550,30,26,'fire',campfire());
 add(250,1490,62,72,'well',well());
 add(240,1240,70,90,'tower',tower(40,80,{roof:'#9a6fa8',rh:60,flag:false,door:true}),{sh:.9});
 // plaza + harbor
 add(1080,1600,170,120,'fountain',fountain());
 let x=790;while(x<1370){const w=sr(85,120);if(x+w>1380)break;if(x+w>975&&x<1085){x=1088;continue}add(x+w/2,1440,w+16,130,'house',house(w,sr(55,70),{sign:r()<.5,rh:w*.5}),{sh:.92});x+=w+sr(15,40)}
 add(880,1530,120,90,'stall',stall('fish'));
 add(1280,1530,120,90,'stall',stall('potion'));
 add(870,1680,120,90,'stall',stall('bread'));
 add(1290,1680,120,90,'stall',stall('pumpkin'));
 [[860,1552],[905,1554],[1270,1552],[885,1702],[1305,1702]].forEach(([x,y])=>add(x,y,28,58,'walker',act(0,0,1,{view:'back',pose:pk(['reach','stand'])},'step')));
 add(1120,1775,90,80,'sail',sailboat(),{mark:false});
 add(1690,1770,70,170,'light',lighthouse(),{mark:false});
 add(860,1765,80,30,'boat',rowboat(),{mark:false});
 add(1420,1790,200,120,'boat',ferry(),{mark:false,s:.62});add(1500,1700,50,50,'sign',signpost('海島'));
 add(520,1770,90,80,'sail',sailboat(),{mark:false,s:.8});
 add(1785,840,50,50,'sign',signpost('農莊'));
 add(330,1130,50,50,'sign',signpost('遺跡'));
}
/* 區域 */
Object.assign(REG,{sky:{x:150,y:90,w:1500,h:170},top:{x:300,y:430,w:1200,h:110},village:{x:300,y:560,w:1220,h:520},meadow:{x:1520,y:520,w:220,h:700},river:{x:100,y:780,w:1600,h:1000},banks:{x:180,y:1000,w:1480,h:420},forest:{x:170,y:1150,w:610,h:550},plaza:{x:780,y:1360,w:600,h:340},harbor:{x:560,y:1712,w:1180,h:80},fishstall:{x:832,y:1478,w:96,h:22}});
Object.assign(POOL,{
 top:[['walker',1.6],['grassClump',1.2],['pebbles',.6],['peekBush',.3],['shepherd',.7],['kiteFly',.7],['stretch',.4],['flowerWatch',.5],['painting',.4],['reading',.3],['chat',.3],['sheep',2],['pine',1.4],['rock',1],['bush',1],['flowersY',.6],['hatBrown',.4],['bottleG',.3],['keyGrey',.2],['cat',.4]],
 village:[['walker',3],['grassClump',1],['pebbles',.6],['crateStack',.4],['peekBush',.4],['peekBarrel',.35],['peekCrate',.3],['dogWalk',.6],['chat',.8],['handInHand',.5],['carryBox',.5],['sweep',.5],['watering',.5],['laundry',.3],['petCat',.45],['feedChickens',.35],['throwCatch',.4],['chase',.4],['jumpRope',.3],['violin',.2],['reading',.3],['cat',.8],['dog',.4],['chicken',.4],['barrel',1.2],['crate',1.1],['pot',1.4],['lamp',.5],['bush',.9],['round',.5],['pumpkinPlain',.7],['bottleB',.35],['bottleG',.25],['note',.5],['keyGrey',.3],['hatBrown',.3],['hatGreen',.2],['cupcake',.25],['umbYellow',.25],['flowersY',.6],['mushTan',.3],['bench',.3],['sign',.25]],
 banks:[['walker',1.2],['grassClump',1.6],['pebbles',.8],['peekBush',.5],['flowerWatch',.6],['kiteFly',.5],['sleeping',.45],['reading',.4],['throwCatch',.4],['painting',.3],['chat',.3],['reeds',2.4],['rock',1.2],['bush',1.4],['frog',.8],['mushTan',.7],['mushBrown',.4],['flowersY',.7],['umbYellow',.35],['note',.25],['hay',.4],['pine',.6],['round',.5],['fence',.4],['pumpkinPlain',.3]],
 forest:[['gnome',2.2],['grassClump',1.6],['peekBush',.8],['pebbles',.5],['walker',.6],['mushroomPick',.9],['flowerWatch',.5],['chase',.3],['flute',.4],['sleeping',.3],['painting',.2],['chat',.3],['pine',5],['round',2.4],['bush',2.4],['mushTan',1.6],['mushBrown',1],['owl',.4],['frog',.4],['rock',.8],['pumpkinPlain',.5],['flowersY',.6],['bottleG',.25],['cat',.4],['hatGreen',.3],['hay',.3]],
 plaza:[['walker',4],['peekBarrel',.5],['peekCrate',.4],['crateStack',.5],['pebbles',.4],['chat',1.1],['handInHand',.6],['benchPair',.5],['violin',.4],['flute',.3],['jumpRope',.35],['seesaw',.3],['throwCatch',.35],['dogWalk',.5],['sweep',.35],['carryBox',.45],['petCat',.3],['feedChickens',.3],['chase',.3],['cat',.8],['dog',.4],['chicken',.3],['barrel',.8],['crate',.8],['pot',.7],['lamp',.4],['cupcake',.5],['umbYellow',.4],['umbRed',.3],['note',.5],['keyGrey',.25],['hatBrown',.25],['bottleB',.3],['pumpkinPlain',.4],['bench',.3],['flowersY',.3]],
 water:[['lily',3],['koi',1.3]],
 meadow:[['walker',1],['sheep',2.6],['hay',1],['fence',1.2],['grassClump',1.4],['pebbles',.5],['flowersY',.6],['chicken',.7],['round',.4],['bush',.6],['hatBrown',.3],['cat',.3],['pumpkinPlain',.4]],
 harborW:[['seaFish',1]]});
Object.assign(SCATREG,{harborW:'harbor',water:'river'});SCATOK.water=inRiver;
/* 路人安排 */
Object.assign(VPLANX,{
 top:{kiteFly:1,flowerWatch:1,painting:1,stretch:1},
 meadow:{shepherd:2,kiteFly:2,feedChickens:1,stretch:1,flowerWatch:1,sleeping:1,reading:1},
 village:{petDog:2,dogWalk:4,chat:5,handInHand:3,carryBox:3,sweep:3,watering:3,laundry:2,petCat:3,feedChickens:2,throwCatch:3,chase:2,jumpRope:2,violin:1,reading:2,stretch:1},
 banks:{flowerWatch:3,kiteFly:2,sleeping:2,reading:2,throwCatch:2,painting:1,chat:2,dogWalk:1},
 forest:{mushroomPick:4,flowerWatch:3,chase:2,flute:2,sleeping:2,painting:1,chat:2,petCat:1,feedChickens:1},
 plaza:{petDog:2,chat:6,handInHand:3,benchPair:3,violin:2,flute:2,jumpRope:2,seesaw:2,throwCatch:2,dogWalk:3,sweep:2,carryBox:3,petCat:2,feedChickens:2,chase:2,stretch:1}});
function scatter1(){
 scatter('top',POOL.top,1600,60);
 scatter('meadow',POOL.meadow,3000,130);
 scatter('village',POOL.village,14000,520);
 scatter('banks',POOL.banks,4000,200);
 scatter('water',POOL.water,2500,70);
 scatter('forest',POOL.forest,10000,420);
 scatter('plaza',POOL.plaza,10000,360);
 scatter('harborW',POOL.harborW,500,16);
}
/* 小故事 */
STORIES[1]={title:'走失的小白貓',giver:()=>act(0,0,1,{view:'fq',pose:'stand',mood:2}),who:'小女孩',
    target:()=>`<g>${cat('#fbf6ea')}${bow(-5,-27,'#d8413a')}</g>`,tw:26,th:32,
    helper:()=>act(0,0,1,{view:'side',pose:'hold',beard:true,hair:'#9a9a9a',hat:1,extra:`<path d="M10,-20 L34,-48" fill="none" stroke="#7a5235" stroke-width="2"/><path d="M34,-48 Q40,-30 38,-8" fill="none" stroke-width=".8"/>`})+`<g transform="translate(-18,0)"><path d="M-7,0 L-8,-12 L8,-12 L7,0Z" fill="#9aa0a4"/>${T(0,-14,.45,DECOY.fishGrey)}</g>`,hw:52,hh:62,
    ask:'小女孩：我的小白貓不見了⋯牠頭上綁著紅色蝴蝶結！',
    need:'小白貓肚子餓了，不肯走⋯聽說拿著釣竿的老爺爺有小魚乾。',
    got:'釣魚老爺爺：拿去吧，一條小魚乾！快去餵小白貓。',
    ok:'小白貓吃得好開心，願意跟你走了！快帶回去給小女孩。'};

/* ================= 登記 ================= */
H.W12={ground:buildGround,isWater:isWaterW,inRiver,inPond,isLand}; /* 給 level2.js 用 */
WATERFN[1]=isWaterW;
SCENE_IMPL[1]={ground:()=>buildGround(1),structures:structures1,scatter:scatter1};
LEVELS[1].types=TYPES1;

/* ================= 登記：場景範圍、場地邊緣、冒險地圖（2026-11-09 從 index.html 搬來） ================= */
H.SCENES[1]={x0:0,x1:1800,c:[900,760]};H.SCREG[1]=['top','meadow','village','banks','forest','plaza'];H.TARGET[1]=360;
H.SKYC[1]='#f6efe0';H.SKYY[1]=350;H.EDGEM[1]='L';H.EDGED[1]='LB';
H.EDGEDECO[1]=[['pine',3],['round',2],['bush',2],['rock',.6]];
H.FRINGE[1]=[['pine',1.4],['round',1.4],['bush',2.2],['rock',1],['grassClump',2.4],['pebbles',1],['walker',.5]];
H.FRINGEX[1]=[[0,540,460,880]];
H.EDGEMY[1]={L:[[-400,352],[1684,2400]]};H.EDGEFILL[1]={L:[352,1684,'#535b37',[566,844,'#7d6044','#6a5038']]};
H.EDGELAND[1]=(x,y)=>x<0?(y>352&&y<1684):undefined;
H.HERE[1]=[122,160];
/* 冒險地圖：小鎮（城堡和房子） */
H.mapHook(3,({U,P,ink,FN,f})=>{let g='';const on=U>=2;
 // ---- town ----
 const house=(x,y,c)=>P(`M${x-7},${y} V${y-8} H${x+7} V${y}Z`,'#f3e8cf',1.3)+P(`M${x-9},${y-8} L${x},${y-16} L${x+9},${y-8}Z`,c,1.3)+`<rect x="${x-2}" y="${y-5}" width="4" height="5" fill="${ink}"/>`;
 let t=`<g class="mnode" data-n="1"><circle cx="100" cy="206" r="46" fill="transparent"/>`;
 const TK=.7; /* 2026-11-11 小鎮圖案縮小（使用者：範圍太大），以 (100,222) 為中心 */
 t+=`<g transform="translate(100,222) scale(${TK}) translate(-100,-222)">`;
 t+=`<ellipse cx="100" cy="228" rx="50" ry="20" fill="#000" opacity=".1"/><ellipse cx="100" cy="222" rx="48" ry="20" fill="#e6d6ad" stroke="${ink}" stroke-width="1.4"/>`;
 [[64,224,'#b14d27'],[78,236,'#6a7488'],[126,236,'#c98a3a'],[138,222,'#b14d27'],[60,208,'#c98a3a'],[142,206,'#6a7488'],[100,242,'#b14d27']].sort((a,b)=>a[1]-b[1]).forEach(([x,y,c])=>{if(y<215)t+=house(x,y,c)});
 // castle
 t+=`<g transform="translate(100,222)">`;
 const tw=(x,w,h,roof)=>P(`M${x-w/2},0 V${-h} H${x+w/2} V0Z`,'#ece2cb',1.6)+`<path d="M${x+w/6},0 V${-h} H${x+w/2} V0Z" fill="#d3c6a8"/>`+P(`M${x-w/2-3},${-h} L${x},${-h-w*1.4} L${x+w/2+3},${-h}Z`,roof,1.6)+`<path d="M${x},${-h-w*1.4} v-8" stroke="${ink}" stroke-width="1.2"/>`+P(`M${x},${-h-w*1.4-8} l7,2.5 l-7,2.5Z`,'#f5c842',1)+`<rect x="${x-1.6}" y="${-h+7}" width="3.2" height="5" rx="1.6" fill="${ink}"/>`;
 t+=P('M-26,0 V-22 H26 V0Z','#ece2cb',1.6)+`<path d="M8,0 V-22 H26 V0Z" fill="#d3c6a8"/>`;
 let cr='';for(let x=-26;x<26;x+=6.5)cr+=`M${x},-22 v-4 h3.2 v4 `;t+=`<path d="${cr}" fill="#ece2cb" stroke="${ink}" stroke-width="1.2"/>`;
 t+=tw(-24,11,34,'#b14d27')+tw(24,11,34,'#b14d27')+tw(0,14,46,'#5c6f96');
 t+=P('M-6,0 V-10 Q0,-17 6,-10 V0Z','#7a4e32',1.5)+`<path d="M-3,-11 V0 M0,-13 V0 M3,-11 V0" stroke="${ink}" stroke-width=".8"/>`+`<path d="M-26,-12 h46" stroke="${ink}" stroke-width=".7" opacity=".35"/>`;
 t+=`</g>`;
 [[64,224,'#b14d27'],[78,236,'#6a7488'],[126,236,'#c98a3a'],[138,222,'#b14d27'],[100,242,'#b14d27']].sort((a,b)=>a[1]-b[1]).forEach(([x,y,c])=>{if(y>=215&&!(x===100))t+=house(x,y,c)});
 t+=`</g>`;
 t+=`<g transform="translate(100,${f(222+40*TK-6)})"><rect x="-32" y="-11" width="64" height="20" rx="10" fill="#fffaf0" stroke="${ink}" stroke-width="1.8"/><text y="4.5" text-anchor="middle" font-size="12" fill="${ink}" font-family="${FN}">奇幻小鎮</text></g></g>`;
 g+=t;
 return g});
})();
