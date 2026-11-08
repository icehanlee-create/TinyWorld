/* 奇幻小鎮大搜查．海上秘境「復活島」（編號 101，不排進主線）
   從第 5 關海島港口的擱淺帆船出航進來；玩法由 secret.js（秘境引擎）處理。
   場景座標（上北下南，照真實方位）：x 500～2220、y 0～2560。
   北：白沙灘（起點，帆船停在北邊海灣）、獨木舟、椰子樹、阿胡瑙瑙的摩艾（面向內陸＝南，看得到正面）
   東：東加里奇石台：15 尊大摩艾一字排開，背對東邊的海、面向內陸（往西），前面是廣場
   東加里奇西邊：拉諾拉拉庫採石場（半埋的摩艾頭、一尊躺在岩壁上刻到一半的）
   中間：草原丘陵、野馬、考古隊在立石像、營地、散落的紅色石帽
   中西：阿基維石台：7 尊摩艾面朝西邊的海（全島唯一面海的一組）
   西南：拉諾卡烏火山口湖（蘆葦）＋奧隆戈村（石屋、鳥人岩刻），崖下礁石、外海小島 */
(function(){
const H=window.TH;if(!H||!H.SECRET)return;
const {T,f,r,sr,pk,ri,shade,OL,SKIN,HAIR,HATS,kid,act,wrapAn,add,mark,canPlace,KIND,REG,SCREG,SCENES,LEVELS,ART,DECOY,ANIM,ALWAYS,HEAVY,SCENE_IMPL,WATERFN,MAPNODES,HERE,NEXTINFO,TARGET,STORIES,OUTFITS,pickView,walkPose,DENS}=H;
const N=101;

/* ================= 地形 ================= */
const SC={x0:500,x1:2220,y1:2560,c:[1390,340]};
SCENES[N]=SC;SCREG[N]=[];DENS[N]=1;TARGET[N]=300;
H.SKYC[N]='#4fbfc8';H.SKYY[N]=0;H.EDGEM[N]='';H.EDGED[N]='';
const chaikin=(P,n)=>{for(let k=0;k<n;k++){const Q=[];for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];Q.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75])}P=Q}return P};
const ISL=chaikin([[930,330],[1060,240],[1220,200],[1400,188],[1580,200],[1740,262],[1890,372],[2030,545],[2122,740],[2160,940],[2122,1132],[2004,1322],[1832,1522],[1632,1732],[1432,1932],[1242,2112],[1082,2262],[962,2352],[822,2402],[692,2372],[610,2262],[574,2080],[584,1840],[610,1560],[640,1280],[680,1000],[740,740],[830,500]],3);
const inPoly=(P,x,y)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if(((yi>y)!==(yj>y))&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
const polyD=P=>'M'+P.map(p=>f(p[0])+','+f(p[1])).join(' L')+'Z';
const inIsl=(x,y)=>inPoly(ISL,x,y);
const KAU={x:860,y:2090,rx:262,ry:186},KIN={x:860,y:2090,rx:222,ry:150},LAKE={x:860,y:2120,rx:150,ry:90};   /* 拉諾卡烏：火山口邊緣、內壁上緣、火山口湖 */
const RAR={x:1570,y:1060,rx:200,ry:128},RCR={x:1585,y:998,rx:104,ry:48},RLAKE={x:1585,y:1006,rx:94,ry:40};  /* 拉諾拉拉庫：山、山頂火山口、火山口裡面（不能走） */
/* 拉諾卡烏北邊的內壁是陡峭岩壁，不能走；南邊有一段緩坡可以走到湖邊 */
const kauWall=(x,y)=>((x-KIN.x)/KIN.rx)**2+((y-KIN.y)/KIN.ry)**2<1&&y<LAKE.y-28;
const inE=(E,x,y,p=0)=>((x-E.x)/(E.rx+p))**2+((y-E.y)/(E.ry+p))**2<1;
const water=(x,y)=>!inIsl(x,y)||inE(LAKE,x,y)||inE(RLAKE,x,y);
/* 會移動的海洋生物、海鳥的活動範圍：淺水＝島外一圈（不含外海小島和崖下礁石）；外海＝離島遠一點；天空＝整個場地上空 */
const ISLETS=[[640,2492,70,36],[556,2440,42,24],[2140,560,40,24],[912,2484,56,26]];
const scl=k=>ISL.map(([x,y])=>[1360+(x-1360)*k,1300+(y-1300)*k]),RING1=scl(1.15),RING2=scl(1.12);
const inScene=(x,y,m)=>x>SC.x0-m&&x<SC.x1+m&&y>-m&&y<SC.y1+m;
const shallow=(x,y)=>!inIsl(x,y)&&inPoly(RING1,x,y)&&!ISLETS.some(([a,b,c,d])=>((x-a)/c)**2+((y-b)/d)**2<1)&&inScene(x,y,60);
const deep=(x,y)=>!inPoly(RING2,x,y)&&inScene(x,y,170);
const skyOK=(x,y)=>inScene(x,y,120);
WATERFN[N]=water;
/* 走得到的地方：島上（離海岸留一點距離）、不在湖裡 */
const terrain=(x,y)=>inIsl(x,y)&&inIsl(x+16,y)&&inIsl(x-16,y)&&inIsl(x,y+14)&&inIsl(x,y-12)&&!inE(LAKE,x,y,10)&&!kauWall(x,y)&&!inE(RLAKE,x,y,8);

/* 區域（物件、佈景擺放用） */
Object.assign(REG,{
 beachR:{x:1130,y:240,w:410,h:200},tongR:{x:1700,y:880,w:260,h:360},quarryR:{x:1400,y:1080,w:360,h:180},
 grassR:{x:960,y:520,w:580,h:880},campR:{x:1060,y:1250,w:250,h:160},akiviR:{x:690,y:1110,w:300,h:340},
 craterR:{x:600,y:1900,w:520,h:350},orongoR:{x:700,y:2245,w:340,h:100},anyR:{x:620,y:240,w:1500,h:2100},
 northR:{x:840,y:330,w:1080,h:220},eastR:{x:1700,y:560,w:400,h:900},southR:{x:950,y:1450,w:900,h:620},westR:{x:640,y:600,w:330,h:1350}});
/* 東加里奇石台：從東北往西南一字排開 */
const VAIHU=[[1372,1880],[1214,2034]],TONG=[[2068,902],[1886,1226]],AKIVI=[[902,1168],[880,1392]],NAUNAU=[[1556,388],[1690,388]];
const lineX=(L,y)=>{const [[ax,ay],[bx,by]]=L;return ax+(bx-ax)*(y-ay)/(by-ay)};
const inReg=(reg,x,y)=>{
 if(reg==='tongR')return x<lineX(TONG,y)-46;
 if(reg==='akiviR')return Math.abs(x-lineX(AKIVI,Math.max(1168,Math.min(1392,y))))>40;
 if(reg==='craterR')return inE(KAU,x,y,-4)&&!kauWall(x,y)&&!inE(LAKE,x,y,26)&&y<2250;
 if(reg==='quarryR')return !inE(RLAKE,x,y,40);
 return true};

/* ================= 顏色 ================= */
const GR='#b7bd6f',GR2='#a7ae62',GR3='#c8c98a',SAND='#f3e7c4',ROCK='#6d655c',ROCK2='#857b70',TUFF='#a39a84',TUFF2='#8c846f',RED='#b5553a',WOOD='#9a6b3e',DEEP='#2f9db6',MID='#4fbfc8',LAG='#7fd6cf';

/* ================= 摩艾 ================= */
/* 側面（面向左＝西）。h 是高度 */
function moaiSide(h=100,o={}){const k=h/100,c=o.c||TUFF,d=shade(c,-.18);
 let s=`<g transform="scale(${f(k)})" stroke-width="${f(2.2/k)}">`;
 s+=`<ellipse cx="0" cy="1" rx="22" ry="4" fill="#000" opacity=".15" stroke="none"/>`;
 s+=`<path d="M14,0 L15,-30 Q16,-48 12,-60 L12,-97 Q11,-102 6,-102 L-12,-102 Q-17,-101 -18,-94 L-20,-87 L-16,-82 L-25,-64 Q-25,-60 -21,-60 L-18,-60 L-22,-56 L-18,-54 L-21,-51 L-18,-46 Q-12,-42 -16,-35 L-17,-12 Q-17,-3 -15,0Z" fill="${c}"/>`;
 s+=`<path d="M14,0 L15,-30 Q16,-48 12,-60 L12,-97 Q11,-102 6,-102 L4,-102 L5,-60 Q8,-44 7,-28 L6,0Z" fill="${d}" stroke="none" opacity=".55"/>`;
 s+=`<path d="M2,-91 Q8,-91 8,-82 L8,-62 Q7,-56 2,-58Z" fill="${d}" stroke-width="${f(1.6/k)}"/>`;
 s+=`<ellipse cx="-13" cy="-81" rx="3.4" ry="2.4" fill="${shade(c,-.4)}" stroke="none"/><path d="M-19,-87 L-9,-86" fill="none" stroke-width="${f(1.4/k)}"/>`;
 s+=`<path d="M8,-42 Q6,-22 -6,-17 Q-12,-14 -17,-15" fill="none" stroke-width="${f(1.6/k)}"/><path d="M-8,-17 l-8,1 M-8,-19 l-8,0" fill="none" stroke-width="${f(1.1/k)}"/>`;
 s+=`<path d="M-4,-28 l2,1 M6,-70 l2,2 M-6,-92 l2,0" fill="none" stroke="${shade(c,-.3)}" stroke-width="${f(1/k)}"/>`;
 if(o.pukao)s+=`<path d="M-15,-100 L-15,-112 Q-3,-118 9,-112 L9,-100 Q-3,-95 -15,-100Z" fill="${RED}"/><ellipse cx="-3" cy="-112" rx="12" ry="4" fill="${shade(RED,.15)}"/>`;
 return s+'</g>'}
/* 正面 */
function moaiHeadF(c=TUFF){const d=shade(c,-.2);return `<path d="M-14,-102 L14,-102 Q16,-100 16,-94 L16,-56 Q15,-48 9,-46 L-9,-46 Q-15,-48 -16,-56 L-16,-94 Q-16,-100 -14,-102Z" fill="${c}"/>`+
 `<path d="M-19,-90 h3 v26 h-3 Q-21,-77 -19,-90Z M19,-90 h-3 v26 h3 Q21,-77 19,-90Z" fill="${d}" stroke-width="1.4"/>`+
 `<path d="M-13,-85 Q0,-89 13,-85" fill="none" stroke-width="3"/><ellipse cx="-7" cy="-80" rx="4" ry="2.6" fill="${shade(c,-.42)}" stroke="none"/><ellipse cx="7" cy="-80" rx="4" ry="2.6" fill="${shade(c,-.42)}" stroke="none"/>`+
 `<path d="M-3,-84 L-6,-64 Q0,-60 6,-64 L3,-84Z" fill="${shade(c,.1)}" stroke-width="1.5"/><path d="M-7,-55 Q0,-52 7,-55" fill="none" stroke-width="1.8"/><path d="M-6,-51 Q0,-49 6,-51" fill="none" stroke-width="1.1"/>`}
function moaiFront(h=100,o={}){const k=h/100,c=o.c||TUFF,d=shade(c,-.2);
 let s=`<g transform="scale(${f(k)})" stroke-width="${f(2.2/k)}"><ellipse cx="0" cy="1" rx="20" ry="4" fill="#000" opacity=".15" stroke="none"/>`;
 s+=`<path d="M-16,-46 L-17,-6 Q-17,0 -12,0 L12,0 Q17,0 17,-6 L16,-46Z" fill="${c}"/><path d="M9,-46 L10,0 L12,0 Q17,0 17,-6 L16,-46Z" fill="${d}" stroke="none" opacity=".5"/>`;
 s+=`<path d="M-15,-40 Q-14,-20 -4,-16 M15,-40 Q14,-20 4,-16" fill="none" stroke-width="${f(1.6/k)}"/><path d="M-5,-16 h-6 M5,-16 h6 M-5,-14 h-6 M5,-14 h6" fill="none" stroke-width="${f(1/k)}"/>`;
 s+=moaiHeadF(c);
 if(o.pukao)s+=`<path d="M-13,-100 L-13,-113 Q0,-119 13,-113 L13,-100 Q0,-95 -13,-100Z" fill="${RED}"/><ellipse cx="0" cy="-113" rx="13" ry="4.2" fill="${shade(RED,.15)}"/>`;
 return s+'</g>'}
/* 採石場：半埋在山坡裡的摩艾頭 */
function moaiHead(h=90,tilt=0){const k=h/100;return `<g transform="rotate(${tilt}) scale(${f(k)}) translate(0,48)" stroke-width="${f(2.2/k)}">${moaiHeadF(pk([TUFF,'#a8a088','#9a927c']))}</g>`+
 `<path d="M-28,3 Q-26,-12 -14,-12 Q0,-17 14,-12 Q26,-12 28,3Z" fill="#9c8a62"/><path d="M-20,-4 l4,-3 M10,-6 l5,-2 M-4,-9 l3,-1" fill="none" stroke="#7a6a48" stroke-width="1.2"/>`}
/* 刻到一半、還躺在岩壁上的摩艾（臉朝天） */
function moaiLying(){let s=`<path d="M-90,6 Q-96,-26 -70,-38 Q-20,-52 40,-46 Q92,-40 96,-10 Q98,6 84,10Z" fill="${TUFF2}"/><path d="M-80,-24 q20,-8 40,-6 M50,-36 q20,4 34,16" fill="none" stroke="${shade(TUFF2,-.25)}" stroke-width="1.4"/>`;
 s+=`<g transform="translate(-52,-2) rotate(90) scale(.95)">${moaiSide(100,{c:'#ada48c'})}</g>`;
 s+=`<path d="M-88,4 Q0,14 88,6 L90,14 Q0,22 -90,12Z" fill="${shade(TUFF2,-.12)}"/><path d="M-60,-6 l3,4 M-20,-2 l2,4 M30,0 l2,4" fill="none" stroke="#6a604f" stroke-width="1.2"/>`;
 return s}
/* 倒在地上、臉朝下的摩艾（南岸的石台前很多這樣倒下來的） */
function moaiFallen(){return `<ellipse cx="-50" cy="4" rx="64" ry="7" fill="#000" opacity=".14" stroke="none"/><g transform="translate(0,-14) rotate(-90) scale(.92)">${moaiSide(100,{c:'#a39a84'})}</g><path d="M-100,2 Q-50,8 0,2" fill="none" stroke="#7a7262" stroke-width="1.2"/>`}
/* 石台（平台）：沿著一條線畫石砌的台子 */
function ahu(A,B,wd=30,hh=14){const [ax,ay]=A,[bx,by]=B,L=Math.hypot(bx-ax,by-ay),ux=(bx-ax)/L,uy=(by-ay)/L,nx=-uy,ny=ux;
 const p=(t,o,dy=0)=>[ax+ux*t+nx*o,ay+uy*t+ny*o+dy];const e=24;
 const top=[p(-e,-wd/2,-hh),p(L+e,-wd/2,-hh),p(L+e,wd/2,-hh),p(-e,wd/2,-hh)];
 const fr=[p(-e,wd/2,-hh),p(L+e,wd/2,-hh),p(L+e,wd/2),p(-e,wd/2)];const fr2=[p(L+e,-wd/2,-hh),p(L+e,wd/2,-hh),p(L+e,wd/2),p(L+e,-wd/2)];
 let s=`<path d="${polyD(fr)}" fill="#8f8674"/><path d="${polyD(fr2)}" fill="#7d7564"/><path d="${polyD(top)}" fill="#bdb29a"/>`;
 let ln='';for(let t=-e+18;t<L+e;t+=18){const a=p(t,wd/2,-hh),b=p(t,wd/2);ln+=`M${f(a[0])},${f(a[1])} L${f(b[0])},${f(b[1])} `}
 const m1=p(-e,wd/2,-hh/2),m2=p(L+e,wd/2,-hh/2);ln+=`M${f(m1[0])},${f(m1[1])} L${f(m2[0])},${f(m2[1])}`;
 return s+`<path d="${ln}" fill="none" stroke="#5f5848" stroke-width="1.2"/>`}

/* ================= 道具、建築 ================= */
const palm=(lean)=>{const L=lean??sr(-12,12),c1=pk(['#5f8a3a','#6f9a4a','#4f7a3a']);let s=`<ellipse cx="4" cy="2" rx="24" ry="5" fill="#000" opacity=".12" stroke="none"/><path d="M-4,0 Q${f(L*.3-5)},-60 ${f(L-3)},-112 L${f(L+3)},-112 Q${f(L*.3+5)},-60 5,0Z" fill="#a8845a"/>`;
 let rg='';for(let y=-12;y>-108;y-=12){const x=L*(-y/112)*.8;rg+=`M${f(x-4)},${y} q4,3 8,0 `}s+=`<path d="${rg}" fill="none" stroke="#7a5a3a" stroke-width="1.2"/>`;
 const cx=L,cy=-114;[[-62,30],[-22,34],[20,34],[62,30],[-102,24],[102,24]].forEach(([a,len])=>{const rad=(a-90)*Math.PI/180,ex=cx+Math.cos(rad)*len,ey=cy+Math.sin(rad)*len*.55+len*.35;
  s+=`<path d="M${f(cx)},${f(cy)} Q${f((cx+ex)/2)},${f(Math.min(cy,ey)-10)} ${f(ex)},${f(ey)} Q${f((cx+ex)/2)},${f(Math.min(cy,ey)-2)} ${f(cx)},${f(cy)}Z" fill="${c1}"/>`});
 return s+`<circle cx="${f(cx-3)}" cy="${cy+4}" r="4" fill="#7a5a3a"/><circle cx="${f(cx+4)}" cy="${cy+5}" r="4" fill="#6a4a2a"/>`};
const grassT=()=>`<path d="M-8,0 q2,-8 4,-12 M-3,0 q0,-10 1,-14 M2,0 q1,-8 4,-11 M7,0 q1,-6 3,-8" fill="none" stroke="#6f7a3f" stroke-width="1.6"/>`+(r()<.4?`<circle cx="-2" cy="-14" r="2.2" fill="${pk(['#f5c842','#fbf6ea','#e3a89e'])}" stroke-width="1"/>`:'');
const lava=()=>{const c=pk([ROCK,ROCK2,'#5e5751']);return `<path d="M-12,0 Q-14,-8 -6,-11 Q2,-14 8,-9 Q14,-4 11,0Z" fill="${c}"/><circle cx="-4" cy="-6" r="1" fill="${shade(c,-.3)}" stroke="none"/><circle cx="3" cy="-8" r="1.2" fill="${shade(c,-.3)}" stroke="none"/><circle cx="6" cy="-4" r=".9" fill="${shade(c,-.3)}" stroke="none"/>`};
const flowers=()=>[[-6,-2],[0,-5],[6,-1]].map(([x,y])=>`<path d="M${x},0 L${x},${y+2}" fill="none" stroke="#6f7a3f" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="2.6" fill="${pk(['#f5c842','#f0c040','#fbf6ea'])}" stroke-width="1"/>`).join('');
const bigPukao=()=>`<ellipse cx="3" cy="3" rx="26" ry="6" fill="#000" opacity=".14" stroke="none"/><path d="M-22,-4 L-22,-26 Q0,-36 22,-26 L22,-4 Q0,6 -22,-4Z" fill="${RED}"/><ellipse cx="0" cy="-26" rx="22" ry="8" fill="#c9694a"/><ellipse cx="0" cy="-28" rx="8" ry="3" fill="#a84a30" stroke-width="1.4"/><path d="M-14,-14 l2,1 M8,-10 l2,1 M-4,-20 l2,0" fill="none" stroke="#7a3424" stroke-width="1.4"/>`;
const orongoHouse=()=>{let s=`<ellipse cx="4" cy="2" rx="38" ry="6" fill="#000" opacity=".14" stroke="none"/><path d="M-34,0 Q-34,-26 0,-30 Q34,-26 34,0Z" fill="#8f877a"/>`;
 s+=`<path d="M-30,-8 Q0,-14 30,-8 M-26,-16 Q0,-22 26,-16 M-16,-24 Q0,-28 16,-24" fill="none" stroke="#5f584f" stroke-width="1.3"/>`;
 s+=`<path d="M-20,-27 Q0,-36 20,-27 Q0,-30 -20,-27Z" fill="#9aa25a"/><path d="M-6,0 L-6,-10 Q0,-14 6,-10 L6,0Z" fill="#3d3833"/>`;return s};
const petro=()=>`<ellipse cx="3" cy="2" rx="30" ry="5" fill="#000" opacity=".14" stroke="none"/><path d="M-28,0 Q-32,-24 -12,-32 Q10,-38 24,-26 Q34,-12 28,0Z" fill="#8d8478"/>`+
 `<g fill="none" stroke="#c9bfae" stroke-width="1.6"><path d="M-8,-6 Q-10,-14 -6,-18 Q-2,-24 4,-20 L10,-22 L6,-17 Q8,-12 4,-8 Q0,-4 -8,-6Z M-4,-8 l-3,6 M2,-8 l3,6"/><circle cx="1" cy="-19" r="1"/><path d="M14,-14 a4,4 0 1 0 0.1,0"/></g>`;
const reefRock=()=>`<path d="M-26,0 L-22,-12 L-14,-16 L-10,-24 L0,-20 L8,-27 L16,-18 L24,-12 L26,0Z" fill="#5d5751"/><path d="M-10,-24 L-4,-14 M8,-27 L6,-16" fill="none" stroke="#3d3833" stroke-width="1.2"/><path d="M-30,2 q6,-4 12,0 q6,4 12,0 q6,-4 12,0 q6,4 12,0 q6,-4 12,0" fill="none" stroke="#fff" stroke-width="2.4"/>`;
const tent=()=>`<ellipse cx="4" cy="2" rx="44" ry="6" fill="#000" opacity=".14" stroke="none"/><path d="M-40,0 L-8,-52 L30,-48 L44,0Z" fill="#c9b37a"/><path d="M-8,-52 L4,0 L-40,0Z" fill="#b39c62"/><path d="M-8,-52 L4,0" fill="none"/><path d="M-12,0 L-6,-30 L0,0Z" fill="#5a4a32"/><path d="M-8,-52 L-12,-60 M30,-48 L34,-56" fill="none" stroke="#7a5235" stroke-width="2"/>`;
const camTable=()=>`<ellipse cx="2" cy="2" rx="34" ry="5" fill="#000" opacity=".12" stroke="none"/><path d="M-26,0 L-22,-20 M26,0 L22,-20 M-14,0 L-18,-20 M14,0 L18,-20" fill="none" stroke="#6a5a48" stroke-width="2.2"/><path d="M-30,-20 L30,-20 L26,-26 L-26,-26Z" fill="#c99a5b"/>`+
 `<path d="M-20,-23 l14,-2 l2,4 l-14,2Z" fill="#efe0b4" stroke-width="1.2"/><path d="M-15,-23 l5,-1" fill="none" stroke="#a8461f" stroke-width="1"/><path d="M6,-26 l10,-6 M10,-24 l8,-3" fill="none" stroke="#6f7f8f" stroke-width="2"/><circle cx="20" cy="-28" r="3" fill="#cdbb8a" stroke-width="1.2"/>`;
const sieve=()=>`<path d="M-14,0 L-10,-20 M14,0 L10,-20" fill="none" stroke="#7a5235" stroke-width="2.2"/><path d="M-16,-20 H16 L14,-28 H-14Z" fill="#c99a5b"/><path d="M-12,-24 h24 M-8,-27 v6 M0,-27 v6 M8,-27 v6" fill="none" stroke="#6f7f8f" stroke-width="1"/>`;
const barrow=()=>`<path d="M-22,-10 L14,-10 L10,-22 L-20,-22Z" fill="#6f8a8a"/><path d="M14,-12 L30,-18 M-18,-10 L-22,0" fill="none" stroke="#7a5235" stroke-width="2.4"/><circle cx="-4" cy="-4" r="6" fill="#3d3833"/><path d="M-16,-22 Q-6,-30 6,-22" fill="#9c8a62"/>`;
/* 考古隊在立石像：木架、繩子、斜斜的摩艾、兩個人拉繩子 */
const raising=()=>{let s=`<ellipse cx="0" cy="3" rx="70" ry="9" fill="#000" opacity=".12" stroke="none"/><path d="M-30,2 Q0,-10 30,2Z" fill="#9c8a62"/>`;
 s+=`<g transform="translate(6,0) rotate(18)">${moaiFront(92)}</g>`;
 s+=`<path d="M-44,0 L-6,-104 L28,0 M-34,-30 H16" fill="none" stroke="#7a5235" stroke-width="3.6"/><circle cx="-6" cy="-104" r="3.5" fill="#7a5235"/>`;
 s+=`<path d="M-6,-104 L-58,-36 M-6,-104 L-74,-40" fill="none" stroke="#c9a46a" stroke-width="1.6"/>`;
 s+=act(-58,0,-1,{view:'side',pose:'reach',hat:6,shirt:'#c9a46a',pants:'#6a5a48',plain:true})+act(-78,6,-1,{view:'fq',pose:'reach',hat:6,shirt:'#5f7a8a',pants:'#5a4a3a',plain:true});
 return s};
const stall=()=>`<ellipse cx="4" cy="2" rx="48" ry="6" fill="#000" opacity=".12" stroke="none"/><path d="M-40,0 L-40,-26 M40,0 L40,-26" fill="none" stroke="#7a5235" stroke-width="2.6"/><path d="M-44,-26 H44 L40,-34 H-40Z" fill="#e8d6b0"/><path d="M-44,-26 H44 L44,-12 H-44Z" fill="#c4572f"/><path d="M-44,-19 H44" fill="none" stroke="#f5c842" stroke-width="2"/>`+
 `<g transform="translate(-28,-36) scale(.55)">${moaiMiniArt}</g><g transform="translate(-6,-34) scale(.5)">${neck(false)}</g><g transform="translate(14,-36) scale(.5)">${woodArt(false)}</g><g transform="translate(32,-34) scale(.5)">${neck(true)}</g>`;
const ship=()=>`<path d="M-70,6 L-58,-8 L56,-8 L70,-20 L64,6 Q0,16 -70,6Z" fill="#8a5a32"/><path d="M-58,-8 L56,-8" fill="none" stroke="#5f3e22" stroke-width="2"/><path d="M-52,-2 h96" fill="none" stroke="#c99a5b" stroke-width="2"/>`+
 `<path d="M-10,-8 V-120 M30,-8 V-96" fill="none" stroke="#5f3e22" stroke-width="3"/><path d="M-8,-114 Q24,-80 -8,-30Z" fill="#fbf6ea"/><path d="M32,-90 Q54,-66 32,-34Z" fill="#fbf6ea"/><path d="M-10,-122 l12,4 l-12,4Z" fill="#d8413a" stroke-width="1.2"/>`+
 `<path d="M-90,10 q8,-4 16,0 q8,4 16,0 M50,12 q8,-4 16,0 q8,4 16,0" fill="none" stroke="#e8f6f6" stroke-width="2"/>`;

/* ---- 可以翻開的東西（關著／翻開後留下的痕跡） ---- */
const bushC=()=>`<ellipse cx="2" cy="2" rx="26" ry="5" fill="#000" opacity=".12" stroke="none"/><path d="M-24,0 Q-28,-14 -16,-18 Q-12,-30 0,-26 Q12,-32 18,-20 Q28,-16 24,0Z" fill="#7f9447"/><path d="M-14,-10 q4,-6 8,-2 M4,-16 q4,-6 8,-1 M-4,-4 q3,-4 6,-1" fill="none" stroke="#5f7438" stroke-width="1.4"/>`+(r()<.5?`<circle cx="-8" cy="-18" r="2.4" fill="#f5c842" stroke-width="1"/><circle cx="10" cy="-14" r="2.2" fill="#fbf6ea" stroke-width="1"/>`:'');
const bushO=()=>`<path d="M-30,0 Q-34,-10 -24,-14 Q-18,-16 -14,-6 Q-16,0 -30,0Z M30,0 Q34,-10 24,-14 Q18,-16 14,-6 Q16,0 30,0Z" fill="#7f9447"/><ellipse cx="0" cy="-3" rx="14" ry="5" fill="#9aa65e" stroke-width="1.4"/><path d="M-10,-3 l6,-2 M2,-4 l7,1 M-4,-1 l6,0" fill="none" stroke="#6f7a3f" stroke-width="1.3"/>`;
const stonesC=()=>`<ellipse cx="2" cy="2" rx="24" ry="4" fill="#000" opacity=".12" stroke="none"/>`+[[-12,-2,10,7],[10,-2,11,7],[0,-4,13,8],[-6,-12,9,6],[7,-12,9,6],[0,-19,8,5]].map(([x,y,a,b],i)=>`<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="${[ROCK,ROCK2,'#5e5751'][i%3]}"/>`).join('')+`<circle cx="-2" cy="-6" r="1" fill="#3d3833" stroke="none"/><circle cx="8" cy="-13" r="1" fill="#3d3833" stroke="none"/>`;
const stonesO=()=>`<ellipse cx="0" cy="-3" rx="16" ry="5" fill="#9c8a62" stroke-width="1.3"/>`+[[-26,-2,9,6],[24,-1,10,6],[-18,4,7,5],[20,6,7,4],[30,-8,6,4]].map(([x,y,a,b],i)=>`<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="${[ROCK,ROCK2,'#5e5751'][i%3]}"/>`).join('');
const crateC=()=>`<ellipse cx="3" cy="2" rx="22" ry="4" fill="#000" opacity=".12" stroke="none"/><path d="M-18,0 V-24 L-12,-30 H20 V-6 L14,0Z" fill="#a8703f"/><path d="M-18,-24 H14 L20,-30 M14,-24 V0" fill="none"/><path d="M-18,-16 H14 M-18,-8 H14" fill="none" stroke="#7a5235" stroke-width="1.4"/>`+
 `<path d="M-18,-24 h5 v5 M14,-24 h-5 v5 M-18,0 h5 v-5 M14,0 h-5 v-5" fill="none" stroke="#5a5a5a" stroke-width="2.2"/>`;
const crateO=()=>`<path d="M-18,0 V-18 H14 V0Z" fill="#8a5a32"/><path d="M-15,-15 H11 V-3 H-15Z" fill="#3d3833"/><path d="M-18,0 V-18 M14,-18 V0" fill="none"/><path d="M14,-18 L30,-34 L36,-30 L20,-14Z" fill="#a8703f"/><path d="M-18,-10 H14" fill="none" stroke="#7a5235" stroke-width="1.2"/>`;
const canoeC=()=>`<ellipse cx="0" cy="2" rx="46" ry="6" fill="#000" opacity=".12" stroke="none"/><path d="M-46,-8 Q0,-2 44,-12 L36,-2 Q0,6 -40,0Z" fill="#8a5a32"/><path d="M-42,-7 Q0,-1 40,-11" fill="none" stroke="#c99a5b" stroke-width="2"/><path d="M-14,-6 L-10,-24 M14,-8 L18,-26" fill="none" stroke="#7a5235" stroke-width="2.4"/><path d="M-16,-24 Q2,-30 26,-28" fill="none" stroke="#7a5235" stroke-width="2.4"/><path d="M-18,-26 q-4,-3 -8,0 h36 q4,3 8,0Z" fill="#a8703f" stroke-width="1.4"/>`;
const canoeO=()=>`<ellipse cx="-6" cy="-2" rx="22" ry="5" fill="#e6d6a8" stroke-width="1.2"/><g transform="translate(18,-4) rotate(-14)"><path d="M-40,0 Q0,-14 40,-4 Q0,10 -40,0Z" fill="#6a4430"/><path d="M-30,0 Q0,-8 30,-2" fill="none" stroke="#4a3020" stroke-width="1.4"/></g>`;
const reedsC=()=>`<ellipse cx="0" cy="2" rx="20" ry="4" fill="#5f9a8e" opacity=".5" stroke="none"/>`+[-12,-7,-2,3,8,12].map((x,i)=>`<path d="M${x},0 Q${x+(i%2?3:-3)},-24 ${x+(i%2?5:-4)},-44" fill="none" stroke="#6f8a3a" stroke-width="2.4"/><ellipse cx="${x+(i%2?5:-4)}" cy="-46" rx="2.4" ry="5" fill="#8a6a40" stroke-width="1"/>`).join('');
const reedsO=()=>[-16,-12,12,16].map((x,i)=>`<path d="M${x},0 Q${x+(x<0?-8:8)},-18 ${x+(x<0?-16:16)},-30" fill="none" stroke="#6f8a3a" stroke-width="2.4"/><ellipse cx="${x+(x<0?-16:16)}" cy="-31" rx="2.4" ry="5" fill="#8a6a40" stroke-width="1"/>`).join('')+`<path d="M-8,-2 l6,-8 M2,-2 l7,-6" fill="none" stroke="#6f8a3a" stroke-width="2"/>`;
const FK={bushF:{w:52,h:32,fn:bushC,open:bushO,name:'草叢',empty:'草叢底下什麼也沒有'},stonesF:{w:48,h:26,fn:stonesC,open:stonesO,name:'石堆',empty:'石頭底下什麼也沒有'},
 crateF:{w:40,h:32,fn:crateC,open:crateO,name:'木箱',empty:'木箱是空的'},canoeF:{w:92,h:32,fn:canoeC,open:canoeO,name:'獨木舟',empty:'獨木舟底下只有沙子'},reedsF:{w:36,h:50,fn:reedsC,open:reedsO,name:'蘆葦叢',empty:'蘆葦叢裡什麼也沒有'}};

/* ================= 要找的東西（8 種 × 3）與干擾物 ================= */
const moaiMiniArt=`<path d="M-6,-14 H6 Q8,-14 8,-11 V-1 Q8,2 5,3 L6,13 H-6 L-5,3 Q-8,2 -8,-1 V-11 Q-8,-14 -6,-14Z" fill="#9c9480"/><path d="M-6,-8 Q0,-10 6,-8" fill="none" stroke-width="2"/><path d="M-1,-8 L-2,-1 Q0,1 2,-1 L1,-8" fill="#b1aa96" stroke-width="1.1"/><path d="M-3,2 Q0,3.5 3,2" fill="none" stroke-width="1.1"/><path d="M-8,-9 h-2 v7 h2 M8,-9 h2 v7 h-2" fill="#9c9480" stroke-width="1.1"/><path d="M-5,8 Q0,10 5,8" fill="none" stroke-width="1"/>`;
const stoneManArt=`<path d="M-7,-12 Q-9,-2 -5,2 L-6,13 H6 L5,2 Q9,-2 7,-12 Q0,-17 -7,-12Z" fill="#a39a88"/><circle cx="-3" cy="-6" r="1.3" fill="${OL}" stroke="none"/><circle cx="3" cy="-6" r="1.3" fill="${OL}" stroke="none"/><path d="M0,-5 v3 M-2,0 h4" fill="none" stroke-width="1.1"/><path d="M-4,7 l2,1 M3,9 l1,-1" fill="none" stroke="#7a7262" stroke-width="1"/>`;
const moaiBack=`<path d="M-6,-14 H6 Q8,-14 8,-11 V-1 Q8,2 5,3 L6,13 H-6 L-5,3 Q-8,2 -8,-1 V-11 Q-8,-14 -6,-14Z" fill="#9c9480"/><path d="M-8,-9 h-2 v7 h2 M8,-9 h2 v7 h-2" fill="#9c9480" stroke-width="1.1"/><circle cx="0" cy="-1" r="2.6" fill="none" stroke="#5f584f" stroke-width="1.3"/><path d="M-5,6 Q0,8 5,6 M-5,8.5 Q0,10.5 5,8.5 M-3,3 L0,6 L3,3" fill="none" stroke="#5f584f" stroke-width="1.1"/><path d="M-4,-10 Q0,-6 4,-10" fill="none" stroke="#5f584f" stroke-width="1"/>`;
const stoneBack=`<path d="M-7,-12 Q-9,-2 -5,2 L-6,13 H6 L5,2 Q9,-2 7,-12 Q0,-17 -7,-12Z" fill="#a39a88"/><circle cx="-2" cy="-3" r=".9" fill="#7a7262" stroke="none"/><circle cx="3" cy="5" r=".8" fill="#7a7262" stroke="none"/>`;
const woodArt=bird=>`<path d="M-5,13 L-6,2 Q-7,-4 -3,-6 L4,-6 Q8,-3 6,4 L7,13Z" fill="${bird?WOOD:'#a5753f'}"/>`+(bird?`<path d="M-3,-6 Q-7,-12 -1,-15 Q4,-16 5,-12 L12,-8 Q8,-8 5,-7Z" fill="${WOOD}"/><circle cx="1" cy="-12" r="1" fill="${OL}" stroke="none"/>`:`<circle cx="0" cy="-11" r="5.5" fill="#a5753f"/><circle cx="-2" cy="-12" r=".9" fill="${OL}" stroke="none"/><circle cx="2" cy="-12" r=".9" fill="${OL}" stroke="none"/>`)+`<path d="M-5,0 Q-9,4 -5,7 M6,0 Q9,4 5,7" fill="none" stroke-width="1.3"/><path d="M-1,1 v9 M2,2 v8" fill="none" stroke="#7a5235" stroke-width=".8"/>`;
const birdZoom=`<g transform="scale(2.6) translate(-2,10)"><path d="M-3,-6 Q-7,-12 -1,-15 Q4,-16 5,-12 L12,-8 Q12,-5 9,-6 L5,-7Z" fill="${WOOD}"/><circle cx="1" cy="-12" r="1.3" fill="${OL}" stroke="none"/><path d="M5,-12 Q9,-11 12,-8" fill="none" stroke-width=".8"/><path d="M-4,-9 q2,1 3,-1 M-4,-11 q2,1 3,-1" fill="none" stroke="#6a4430" stroke-width=".7"/><path d="M-5,0 L-6,2 Q-7,-4 -3,-6 L4,-6 Q8,-3 6,4" fill="${WOOD}"/></g>`;
const faceZoom=`<g transform="scale(2.6) translate(0,9)"><circle cx="0" cy="-11" r="6" fill="#a5753f"/><circle cx="-2.2" cy="-12" r="1" fill="${OL}" stroke="none"/><circle cx="2.2" cy="-12" r="1" fill="${OL}" stroke="none"/><path d="M-2,-8.6 Q0,-7 2,-8.6" fill="none" stroke-width=".8"/><path d="M-5,-15 q5,-3 10,0" fill="none" stroke="#6a4430" stroke-width=".8"/><path d="M-5,0 Q-7,-4 -3,-5 L4,-5 Q7,-3 6,0" fill="#a5753f"/></g>`;
const pukaoArt=`<path d="M-11,-6 L-11,6 Q0,11 11,6 L11,-6Z" fill="${RED}"/><ellipse cx="0" cy="-6" rx="11" ry="4.5" fill="#c9694a"/><ellipse cx="0" cy="-7" rx="4" ry="1.8" fill="#a84a30" stroke-width="1.1"/><path d="M-6,1 l1,1 M5,3 l1,0 M0,-1 l1,1" fill="none" stroke="#7a3424" stroke-width="1"/>`;
const brickArt=`<path d="M-12,-3 L4,-9 L14,-4 L-2,2Z" fill="#c4654a"/><path d="M-12,-3 V5 L-2,10 V2Z" fill="#a8503a"/><path d="M-2,2 V10 L14,4 V-4Z" fill="#b85a40"/>`;
const pukaoBottom=`<ellipse cx="0" cy="0" rx="13" ry="13" fill="${RED}"/><ellipse cx="0" cy="0" rx="7" ry="7" fill="#7a3424"/><path d="M-5,-2 Q0,-6 5,-2" fill="none" stroke="#5a2418" stroke-width="1"/><path d="M-11,4 l1,1 M9,-6 l1,1" fill="none" stroke="#7a3424" stroke-width="1"/>`;
const brickBottom=`<rect x="-13" y="-7" width="26" height="14" rx="1.5" fill="#b85a40"/><circle cx="-7" cy="0" r="2.6" fill="#5a2418"/><circle cx="0" cy="0" r="2.6" fill="#5a2418"/><circle cx="7" cy="0" r="2.6" fill="#5a2418"/>`;
const boardArt=c=>`<path d="M-13,-6 Q-13,-9 -10,-9 L11,-8 Q14,-8 13,-5 L12,7 Q12,9 9,9 L-11,8 Q-14,8 -13,5Z" fill="${c}"/><path d="M-10,-4 Q0,-6 10,-4 M-10,2 Q0,0 9,3" fill="none" stroke="${shade(c,-.25)}" stroke-width=".9"/><circle cx="8" cy="-1" r="1" fill="${shade(c,-.3)}" stroke="none"/>`;
const glyphs=()=>{let s='';const G=[(x,y)=>`<path d="M${x},${y+2} v-4 M${x-1.4},${y-1} l1.4,-1 l1.4,1" fill="none"/>`,(x,y)=>`<circle cx="${x}" cy="${y-1}" r="1.2" fill="none"/><path d="M${x},${y} v2.4" fill="none"/>`,(x,y)=>`<path d="M${x-1.5},${y+2} l1.5,-3 l1.5,3 M${x},${y-1} l1.6,-1.4" fill="none"/>`,(x,y)=>`<path d="M${x-1.6},${y} q1.6,-3 3.2,0 q-1.6,3 -3.2,0" fill="none"/>`];
 for(let row=0;row<4;row++)for(let i=0;i<6;i++)s+=G[(row*3+i*5)%4](-9+i*3.6,-4.5+row*4);return `<g stroke="#3d2a18" stroke-width=".7">${s}</g>`};
const obsArt=`<path d="M-10,4 L-6,-8 L2,-11 L10,-4 L8,7 L-2,10Z" fill="#2e2b30"/><path d="M-6,-8 L-1,0 L2,-11 M-1,0 L8,7 M-1,0 L-10,4" fill="none" stroke="#5a5560" stroke-width="1"/><path d="M-4,-5 L0,-8" stroke="#fff" stroke-width="1.6" opacity=".8"/>`;
const coalArt=`<path d="M-10,3 Q-12,-5 -5,-8 Q2,-12 8,-6 Q13,-1 9,6 Q2,10 -6,8Z" fill="#2d2a28"/><g fill="#57524c" stroke="none"><circle cx="-4" cy="-2" r="1.1"/><circle cx="3" cy="2" r="1"/><circle cx="5" cy="-4" r=".9"/><circle cx="-6" cy="4" r=".8"/></g>`;
const obsLit=`<path d="M-10,4 L-6,-8 L2,-11 L10,-4 L8,7 L-2,10Z" fill="#6a5f86" fill-opacity=".75" stroke="#2e2b30"/><path d="M-6,-8 L-1,0 L2,-11 M-1,0 L8,7 M-1,0 L-10,4" fill="none" stroke="#c8bfe6" stroke-width=".9"/><path d="M-9,3 L-5,-7 M7,6 L9,-3" fill="none" stroke="#e8e0ff" stroke-width="1.4" opacity=".9"/><path d="M-4,-5 L0,-8 M2,2 L5,0" stroke="#fff" stroke-width="1.6"/>`;
const coalLit=`<path d="M-10,3 Q-12,-5 -5,-8 Q2,-12 8,-6 Q13,-1 9,6 Q2,10 -6,8Z" fill="#232120"/><g fill="#4a4540" stroke="none"><circle cx="-4" cy="-2" r="1.1"/><circle cx="3" cy="2" r="1"/><circle cx="5" cy="-4" r=".9"/></g>`;
const neck=shell=>{const pts=[[-10,1],[-7,6],[-2,9],[3,9],[8,6],[10,1]];let s=`<ellipse cx="0" cy="-1" rx="11" ry="9" fill="none" stroke="#c9a46a" stroke-width="1.4"/>`;
 pts.forEach(([x,y],i)=>s+=shell?`<path d="M${x-2.4},${y-1} Q${x},${y-4} ${x+2.4},${y-1} Q${x},${y+4} ${x-2.4},${y-1}Z" fill="${i%2?'#f2c6cf':'#fbf3e2'}" stroke-width="1"/>`:`<circle cx="${x}" cy="${y}" r="2.4" fill="${i%2?'#e8d6b0':'#fbf3e2'}" stroke-width="1"/>`);return s};
const shellZoom=`<g transform="scale(2.4) translate(-2,-4)">${[[-6,2],[0,5],[6,2]].map(([x,y],i)=>`<path d="M${x-4},${y} Q${x},${y-6} ${x+4},${y} Q${x},${y+6} ${x-4},${y}Z" fill="${i%2?'#f2c6cf':'#fbf3e2'}" stroke-width=".8"/><path d="M${x-2.5},${y-1.5} q2.5,1.5 5,0 M${x-3},${y+.5} q3,1.5 6,0 M${x-2.4},${y+2.4} q2.4,1 4.8,0" fill="none" stroke="#a8846a" stroke-width=".6"/>`).join('')}<path d="M-12,-2 Q0,-6 12,-2" fill="none" stroke="#c9a46a" stroke-width=".9"/></g>`;
const beadZoom=`<g transform="scale(2.4) translate(-2,-4)">${[[-6,2],[0,5],[6,2]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="4" fill="${i%2?'#e8d6b0':'#fbf3e2'}" stroke-width=".8"/><path d="M${x-1.5},${y-2} q1,-.6 2,0" fill="none" stroke="#fff" stroke-width=".8"/>`).join('')}<path d="M-12,-2 Q0,-6 12,-2" fill="none" stroke="#c9a46a" stroke-width=".9"/></g>`;
const eggArt=sp=>`<path d="M0,-11 Q8,-10 8,1 Q8,10 0,10 Q-8,10 -8,1 Q-8,-10 0,-11Z" fill="${sp?'#efe3c8':'#f6efe2'}"/>`+(sp?`<g fill="#b8a07a" stroke="none" opacity=".55"><circle cx="-3" cy="-4" r="1"/><circle cx="3" cy="-1" r=".9"/><circle cx="-1" cy="4" r="1"/></g>`:'')+`<path d="M-4,-6 Q-3,-9 0,-9" fill="none" stroke="#fff" stroke-width="1.4"/>`;
const eggLit=sp=>`<path d="M0,-11 Q8,-10 8,1 Q8,10 0,10 Q-8,10 -8,1 Q-8,-10 0,-11Z" fill="#fff2c8"/>`+(sp?`<g fill="#7a5a34" stroke="none">${[[-3,-5,1.4],[3,-2,1.2],[-1,4,1.5],[4,5,1],[-5,1,1.1],[1,-8,1],[5,-6,.9],[-4,7,.9],[2,1,1]].map(([x,y,rr])=>`<circle cx="${x}" cy="${y}" r="${rr}"/>`).join('')}</g>`:'')+`<ellipse cx="0" cy="0" rx="5" ry="7" fill="#fff" opacity=".35" stroke="none"/>`;
const feathers=(n,spread,cx=0,cy=0,len=12)=>{let s='';for(let i=0;i<n;i++){const a=(-spread/2+spread*i/(n-1))*Math.PI/180,x=cx+Math.sin(a)*len,y=cy-Math.cos(a)*len;s+=`<path d="M${f(cx)},${f(cy)} Q${f(cx+Math.sin(a)*len*.5-1.6)},${f(cy-Math.cos(a)*len*.5)} ${f(x)},${f(y)} Q${f(cx+Math.sin(a)*len*.5+1.6)},${f(cy-Math.cos(a)*len*.5)} ${f(cx)},${f(cy)}Z" fill="${i%2?'#2b2420':'#fbf6ea'}" stroke-width=".9"/>`}return s};
const crownArt=`<g transform="translate(0,6)">${feathers(7,110,0,0,15)}<path d="M-9,0 Q0,4 9,0 L9,3 Q0,7 -9,3Z" fill="#c4572f" stroke-width="1.1"/></g>`;
const dusterArt=`<g transform="translate(0,2)">${feathers(7,90,0,0,12).replace(/#fbf6ea/g,'#e8a86a').replace(/#2b2420/g,'#c4572f')}<path d="M0,0 L1,11" stroke="#7a5235" stroke-width="2.6"/></g>`;
const crownTop=`<g>${[...Array(12)].map((_,i)=>{const a=i*30;return `<g transform="rotate(${a})"><path d="M0,-8 Q-2,-13 0,-17 Q2,-13 0,-8Z" fill="${i%2?'#2b2420':'#fbf6ea'}" stroke-width=".9"/></g>`}).join('')}<circle r="8" fill="none" stroke="#c4572f" stroke-width="3"/></g>`;
const dusterSide=`<g transform="rotate(-30)">${feathers(7,70,0,-4,10).replace(/#fbf6ea/g,'#e8a86a').replace(/#2b2420/g,'#c4572f')}<path d="M0,-4 L0,16" stroke="#7a5235" stroke-width="2.6"/><circle cx="0" cy="17" r="1.6" fill="#7a5235"/></g>`;

const TYPES101=[
 {id:'moaiMini',name:'小摩艾',short:'小摩艾',r:13,rot:8,spots:[['tongR'],['quarryR','stonesF'],['campR']]},
 {id:'birdman',name:'鳥人雕刻',short:'鳥人雕刻',r:13,rot:12,spots:[['orongoR'],['beachR'],['akiviR','bushF']]},
 {id:'pukao',name:'紅色石帽',short:'紅石帽',r:12,rot:10,spots:[['grassR'],['akiviR'],['campR','crateF']]},
 {id:'rongo',name:'刻紋木板',short:'刻紋木板',r:13,rot:20,spots:[['orongoR'],['campR'],['beachR']]},
 {id:'obsidian',name:'黑曜石',short:'黑曜石',r:11,rot:25,spots:[['quarryR'],['craterR','stonesF'],['grassR','bushF']]},
 {id:'shellNeck',name:'貝殼項鍊',short:'貝殼項鍊',r:12,rot:20,spots:[['beachR'],['tongR'],['orongoR']]},
 {id:'sootyEgg',name:'鳥人蛋',short:'鳥人蛋',r:10,rot:20,spots:[['orongoR'],['craterR','reedsF'],['beachR']]},
 {id:'featherCrown',name:'羽毛頭飾',short:'羽毛頭飾',r:13,rot:15,spots:[['tongR'],['akiviR'],['beachR','bushF']]}];
LEVELS[N].types=TYPES101;
Object.assign(ART,{moaiMini:moaiMiniArt,birdman:woodArt(true),pukao:pukaoArt,rongo:boardArt('#8a5a32'),obsidian:obsArt,shellNeck:neck(true),sootyEgg:eggArt(true),featherCrown:crownArt});
const DECOYT={stoneMan:{id:'stoneMan',name:'石頭人',r:13,rot:8},woodCarve:{id:'woodCarve',name:'普通木雕',r:13,rot:12},brick:{id:'brick',name:'紅磚',r:12,rot:15},plank:{id:'plank',name:'空白木板',r:13,rot:20},
 coal:{id:'coal',name:'煤塊',r:11,rot:25},beadNeck:{id:'beadNeck',name:'木珠項鍊',r:12,rot:20},henEgg:{id:'henEgg',name:'雞蛋',r:10,rot:20},duster:{id:'duster',name:'雞毛撢子',r:13,rot:25}};
const DECOYART={stoneMan:stoneManArt,woodCarve:woodArt(false),brick:brickArt,plank:boardArt('#8f5f36'),coal:coalArt,beadNeck:neck(false),henEgg:eggArt(false),duster:dusterArt};
Object.assign(DECOY,DECOYART);
/* 特寫卡：每種一個檢查小動作（干擾物同一種動作，看了才分得出來） */
const IN=(act,btn,front,after,note,o={})=>({act,btn,front,after,note,...o});
const INSPECT={
 moaiMini:IN('turn','🔄 轉過來看背面',moaiMiniArt,moaiBack,'背後刻著圓環和腰帶的花紋——是<b>小摩艾</b>！'),
 stoneMan:IN('turn','🔄 轉過來看背面',stoneManArt,stoneBack,'背後光禿禿的，只是普通的<b>石頭人</b>。',{name:'石頭人'}),
 birdman:IN('mag','🔍 用放大鏡看',woodArt(true),birdZoom,'鳥頭人身，嘴巴彎彎的像軍艦鳥——是<b>鳥人雕刻</b>！',{lens:[2,-18]}),
 woodCarve:IN('mag','🔍 用放大鏡看',woodArt(false),faceZoom,'是一張笑咪咪的人臉，只是<b>普通木雕</b>。',{lens:[0,-18],name:'普通木雕'}),
 pukao:IN('flip','↕ 翻過來看底部',pukaoArt,pukaoBottom,'底部圓圓的，中間凹下去——是戴在摩艾頭上的<b>紅色石帽</b>！'),
 brick:IN('flip','↕ 翻過來看底部',brickArt,brickBottom,'方方正正，還有三個洞，是一塊<b>紅磚</b>。',{name:'紅磚'}),
 rongo:IN('flip','🔄 翻面看看',boardArt('#8a5a32'),boardArt('#8a5a32')+glyphs(),'背面刻滿一排排小圖案文字——是<b>刻紋木板</b>！'),
 plank:IN('flip','🔄 翻面看看',boardArt('#8f5f36'),boardArt('#8f5f36'),'背面也是空白的，只是<b>普通木板</b>。',{name:'空白木板'}),
 obsidian:IN('light','💡 對著光看',obsArt,obsLit,'邊緣透出玻璃一樣的光澤——是<b>黑曜石</b>！'),
 coal:IN('light','💡 對著光看',coalArt,coalLit,'黑黑的，一點光都不透，是<b>煤塊</b>。',{name:'煤塊'}),
 shellNeck:IN('mag','🔍 用放大鏡看',neck(true),shellZoom,'一顆顆都是有螺紋的小貝殼——是<b>貝殼項鍊</b>！',{lens:[0,8]}),
 beadNeck:IN('mag','🔍 用放大鏡看',neck(false),beadZoom,'只是圓圓的木珠子，是<b>普通項鍊</b>。',{lens:[0,8],name:'木珠項鍊'}),
 sootyEgg:IN('light','💡 對著光看',eggArt(true),eggLit(true),'透光看，上面滿滿的斑點——是<b>鳥人蛋</b>！'),
 henEgg:IN('light','💡 對著光看',eggArt(false),eggLit(false),'光滑，沒有斑點，是<b>普通雞蛋</b>。',{name:'雞蛋'}),
 featherCrown:IN('spin','🌀 轉一圈',crownArt,crownTop,'羽毛排成一圈，可以戴在頭上——是<b>羽毛頭飾</b>！'),
 duster:IN('spin','🌀 轉一圈',dusterArt,dusterSide,'下面有一根木柄，是<b>雞毛撢子</b>。',{name:'雞毛撢子'})};
const DECOYS=[['stoneMan','quarryR'],['stoneMan','grassR'],['woodCarve','orongoR'],['brick','campR'],['brick','grassR'],['plank','beachR'],['coal','craterR','stonesF'],['coal','quarryR'],['beadNeck','tongR'],['henEgg','beachR','bushF'],['henEgg','grassR'],['duster','akiviR']];

/* ================= 人物 ================= */
/* 花圈（當地人戴），加在 HATS 最後，不會被路人隨機抽到 */
const CROWN=HATS.length;HATS.push(()=>`<path d="M-13,-44 Q0,-49 13,-44" fill="none" stroke="#5f8a3a" stroke-width="2.4"/>`+[[-12,-44],[-7,-46.5],[-1,-47.5],[5,-47],[11,-45]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="2.6" fill="${['#f5c842','#e86a9a','#fbf6ea','#f0802a','#d8413a'][i]}" stroke-width="1"/>`).join(''));
/* 當地穿著：短袖或防風外套，膚色偏深，部分戴花圈 */
OUTFITS[N]=o=>{if(o.top)return o;o.skin=o.skin||pk([SKIN[2],SKIN[3],SKIN[3],SKIN[4],SKIN[1]]);o.top=pk(['tee','tee','long','long','tee']);
 if(o.top==='long')o.shirt=o.shirt||pk(['#3f6fa8','#c4572f','#3f8f8a','#5f7a3f','#e0a03a','#7a5a8a']);else o.shirt=o.shirt||pk(['#fbf6ea','#f5c842','#e86a6a','#5a86b0','#3f8f8a','#e8833a']);
 if(o.top==='tee'&&r()<.3)o.aloha=pk(['#fbf6ea','#f5c842','#e86a9a']);o.bottom=r()<.5?'shorts':'pants';o.pants=o.pants||pk(['#c9a46a','#5a86b0','#3d3833','#8a6a4a','#e8d6b0']);
 if(o.hat===undefined)o.hat=pk([CROWN,CROWN,-1,-1,1,4]);return o};
const walker=()=>{const v=pickView(),p=walkPose(v);return act(0,0,r()<.5?1:-1,{view:v,pose:p},true)};
const archaeo=()=>act(0,0,r()<.5?1:-1,{view:pk(['fq','side','bq','front']),pose:pk(['hold','reach','crouch','stand']),hat:6,shirt:pk(['#c9a46a','#7d8b4a','#5f7a8a','#e8d6b0']),pants:pk(['#6a5a48','#5a4a3a','#c9b48a']),top:'tee',bottom:pk(['pants','shorts']),skin:pk(SKIN)},true);
const dancer=d=>act(0,0,d,{view:'fq',pose:'up2',hat:CROWN,top:'bare',bottom:'shorts',pants:'#d8413a',skin:SKIN[3]},'hop');
const seller=()=>act(0,0,1,{view:'front',pose:'stand',hat:CROWN,shirt:'#e86a6a',top:'tee',bottom:'pants',pants:'#3d3833',skin:SKIN[3],mood:1});
/* 主角：A 小探險家（遮陽探險盔、橄欖綠短袖、卡其短褲、棕色帆布背包） */
const EXP={skin:SKIN[1],hair:'#3a2a22',hs:0,hat:6,shirt:'#7d8b4a',pants:'#c9b48a',top:'tee',bottom:'shorts',mood:0};
const PK='#8a6a44',PK2='#6f5234',PK3='#a07c52',STRAP='#5a4430';
const packBack=`<path d="M-9,-20 Q-9,-22.5 -6,-22.5 H6 Q9,-22.5 9,-20 V-5.5 Q9,-3 6,-3 H-6 Q-9,-3 -9,-5.5Z" fill="${PK}" stroke-width="1.6"/><path d="M-9,-16.5 Q0,-12.5 9,-16.5 V-20 Q9,-22.5 6,-22.5 H-6 Q-9,-22.5 -9,-20Z" fill="${PK2}" stroke-width="1.4"/><rect x="-5" y="-11" width="10" height="6" rx="1.5" fill="${PK3}" stroke-width="1.1"/><circle cx="0" cy="-14.5" r="1" fill="#e0b44a" stroke="none"/>`;
const strap=d=>`<path d="${d}" fill="none" stroke="${STRAP}" stroke-width="1.8"/>`;
const PCACHE={};
function playerArt(v,fr){const key=v+fr;if(PCACHE[key])return PCACHE[key];const pose=fr<0?'stand':fr===0?'walk':'stand';
 const o={...EXP,view:v,pose,plain:true};let pre='',post='';
 if(v==='front'){pre=`<path d="M-12,-18 h4 v12 h-4Z M8,-18 h4 v12 h-4Z" fill="${PK}" stroke-width="1.4"/>`;post=strap('M-5.5,-17.5 Q-7.5,-13 -7.5,-9')+strap('M5.5,-17.5 Q7.5,-13 7.5,-9')}
 else if(v==='fq'){pre=`<path d="M-15,-20 Q-15,-22 -12,-22 H-3 V-4 H-12 Q-15,-4 -15,-7Z" fill="${PK}" stroke-width="1.6"/><path d="M-15,-17 Q-9,-14 -3,-16 V-22 H-12 Q-15,-22 -15,-19Z" fill="${PK2}" stroke-width="1.3"/>`;post=strap('M-4,-17.5 Q-6,-13 -6.5,-9.5')+strap('M5.5,-17.5 Q7,-13 6.5,-10')}
 else if(v==='side'){pre=`<path d="M-17,-20 Q-17,-22.5 -14,-22.5 H-5 V-3.5 H-14 Q-17,-3.5 -17,-6Z" fill="${PK}" stroke-width="1.6"/><path d="M-17,-17 Q-11,-14 -5,-16 V-22.5 H-14 Q-17,-22.5 -17,-19.5Z" fill="${PK2}" stroke-width="1.3"/><rect x="-16" y="-11" width="5" height="6" rx="1.2" fill="${PK3}" stroke-width="1"/>`;post=strap('M-5,-18 Q0,-17 3,-11')}
 else if(v==='bq')post=`<g transform="translate(-2.4,.4) scale(.96,1)">${packBack}</g>`;
 else post=packBack;
 const s=`<g transform="scale(1.06)">`+pre+kid(o)+post+`</g>`;return PCACHE[key]=s}

/* ================= 小故事：迷路的小雛鳥 ================= */
STORIES[N]={title:'迷路的小雛鳥',who:'奧隆戈村的孩子',
 ask:'奧隆戈村的孩子：我照顧的烏燕鷗寶寶不見了⋯\n牠灰白毛茸茸的，脖子上綁著一條紅繩子！',
 need:'小雛鳥被風吹到崖下的礁石上，四周都是浪，過不去⋯\n聽說北邊白沙灘有個鳥人祭的游泳選手。',
 got:'游泳選手：交給我！我抱著蘆葦浮板游過去接牠。\n你先到奧隆戈的崖邊等我！',
 ok:'游泳選手把小雛鳥接上岸了！\n牠乖乖跟著你，快帶回去給村裡的孩子。'};
const chick=()=>`<ellipse cx="0" cy="1" rx="9" ry="2.4" fill="#000" opacity=".15" stroke="none"/><path d="M-9,0 Q-11,-12 -2,-14 Q8,-15 9,-6 Q9,0 2,1Z" fill="#c9c6bf"/><path d="M-6,-6 q2,-2 4,0 M0,-9 q2,-2 4,0 M-4,-2 q2,-2 4,0" fill="none" stroke="#a6a29a" stroke-width="1"/>`+
 `<circle cx="4" cy="-15" r="6" fill="#d6d3cc"/><path d="M9,-15 L14,-14 L9,-12Z" fill="#3d3833" stroke-width="1"/><circle cx="6" cy="-16" r="1.1" fill="${OL}" stroke="none"/><path d="M-1,-10.5 Q4,-8 9,-10.5" fill="none" stroke="#d8413a" stroke-width="2.2"/><path d="M3,-9.5 l-1,4" fill="none" stroke="#d8413a" stroke-width="1.6"/>`+
 `<path d="M-2,1 v3 M3,1 v3" fill="none" stroke="#3d3833" stroke-width="1.2"/>`;
const reedFloat=`<g transform="translate(14,-18) rotate(-8)"><path d="M-6,-14 Q-2,-18 4,-14 L6,14 Q0,18 -6,14Z" fill="#c9b06a"/><path d="M-6,-6 Q0,-8 5,-6 M-6,4 Q0,2 6,4" fill="none" stroke="#8a6a3a" stroke-width="1.6"/><path d="M-3,-14 L-2,14 M2,-15 L3,15" fill="none" stroke="#a88a4a" stroke-width=".9"/></g>`;
const swimmerArt=()=>act(0,0,1,{view:'fq',pose:'hold',hat:-1,hs:1,hair:'#2b2420',top:'bare',bottom:'trunks',pants:'#d8413a',skin:SKIN[3],mood:1,plain:true,extra:reedFloat});
const swimArt=()=>`<ellipse cx="0" cy="0" rx="26" ry="7" fill="#e8f6f6" opacity=".7" stroke="none"/><g transform="rotate(-70) translate(4,8) scale(.9)"><path d="M-6,-14 Q-2,-18 4,-14 L6,14 Q0,18 -6,14Z" fill="#c9b06a"/><path d="M-6,-6 Q0,-8 5,-6 M-6,4 Q0,2 6,4" fill="none" stroke="#8a6a3a" stroke-width="1.6"/></g>`+
 `<circle cx="-12" cy="-8" r="8" fill="${SKIN[3]}"/><path d="M-20,-10 Q-19,-17 -12,-17 Q-5,-17 -4,-11 Q-10,-14 -20,-10Z" fill="#2b2420"/><circle cx="-9" cy="-8" r="1" fill="${OL}" stroke="none"/><path d="M-30,2 q6,-4 12,0 M10,4 q6,-4 12,0" fill="none" stroke="#fff" stroke-width="2"/>`;
const giverArt=()=>act(0,0,1,{view:'fq',pose:'reach',hat:CROWN,hs:3,hair:'#2b2420',shirt:'#f5c842',top:'tee',bottom:'shorts',pants:'#3f6fa8',skin:SKIN[3],mood:2,plain:true});
const GIVER={x:905,y:2318},REEF={x:912,y:2482},HELPER={x:1232,y:352};
const lerp=(a,b,k)=>a+(b-a)*k;
function moveEnt(e,tx,ty,ms,done){const x0=e.x,y0=e.y,t0=performance.now();const st=t=>{const k=Math.min(1,(t-t0)/ms),q=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;e.x=lerp(x0,tx,q);e.y=lerp(y0,ty,q);if(k<1)requestAnimationFrame(st);else done&&done()};requestAnimationFrame(st)}
const STORY={giver:GIVER,who0:'是一隻灰白毛茸茸的小雛鳥，脖子綁著紅繩子⋯好像有人在找牠。',busy:'游泳選手正在練習划水⋯（也許之後會需要他幫忙）',
 thanks:{target:'小雛鳥開心地拍拍翅膀～',helper:'游泳選手：下次鳥人祭見！'},
 reset(E){const ent=E.ent;Object.keys(ent).forEach(k=>delete ent[k]);
  ent.giver={role:'giver',x:GIVER.x,y:GIVER.y,w:30,h:66,block:true,bub:'？',art:giverArt};
  ent.target={role:'target',x:REEF.x,y:REEF.y-14,w:26,h:26,art:chick};
  ent.helper={role:'helper',x:HELPER.x,y:HELPER.y,w:40,h:66,block:true,art:swimmerArt,bub:'',fl:true}},
 on:{
  /* 第 3 步：幫手答應 → 跑去下水，出現在崖下礁石旁的海裡 */
  2:(E,done)=>{const h=E.ent.helper;H.burst(h.x,h.y-30);h.gone=true;E.ent.swim={x:1080,y:2470,w:50,h:20,art:swimArt};E.redraw();done()},
  /* 第 4 步：點雛鳥 → 游泳選手游到礁石把牠接回岸邊，然後雛鳥跟著主角走 */
  3:(E,done)=>{const s=E.ent.swim,c=E.ent.target;if(!s){done();return}
   H.toast('游泳選手抱著蘆葦浮板游過去了⋯',2600);
   moveEnt(s,REEF.x+30,REEF.y+4,1300,()=>{c.x=REEF.x+20;c.y=REEF.y-10;
    setTimeout(()=>{const tk=()=>{c.x=s.x-6;c.y=s.y-10};const iv=setInterval(tk,16);
     moveEnt(s,820,2420,1500,()=>{clearInterval(iv);const P=E.P;moveEnt(c,P.x+26,P.y+6,700,()=>{c.follow=true;c.tick=(dt,P)=>{const d=Math.hypot(P.x-c.x,P.y-c.y);if(d>34){const k=Math.min(1,dt*4);c.x+=(P.x-c.x)*k*(1-30/d);c.y+=(P.y+4-c.y)*k*(1-30/d);c.fl=P.x<c.x}};
      s.tick=null;moveEnt(s,1000,2500,2000,()=>{s.gone=true;E.redraw()});done()})})},350)})}},
 finish(E){const c=E.ent.target;c.tick=null;moveEnt(c,GIVER.x+30,GIVER.y+4,700)}};


/* ================= 生物（照真實的復活島：野馬、牛羊、雞、兩種小蜥蜴、海鳥；海裡的綠蠵龜、熱帶魚、龍蝦、螃蟹、座頭鯨） ================= */
/* 馬：A 圓滾 Q 版＋D 的吃草姿勢、白斑紋、白襪（使用者選 A＋D 混用），放大到比主角高一點 */
const HLEG=(xs,c,y0=-18,len=18,w=4.2)=>xs.map(x=>`<path d="M${x},${y0} L${x+1},${y0+len}" fill="none" stroke="${OL}" stroke-width="${w+2}"/><path d="M${x},${y0} L${x+1},${y0+len}" fill="none" stroke="${c}" stroke-width="${w}"/>`).join('');
const heye=(x,y,r=1.9)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${OL}" stroke="none"/><circle cx="${x+.5}" cy="${y-.6}" r=".6" fill="#fff" stroke="none"/>`;
function horse(){const [c,m]=pk([['#a0623a','#4a3020'],['#6a4430','#2b2420'],['#c9a47a','#7a5a3a'],['#e8e0d0','#9a8a7a'],['#4a3a30','#2b2420'],['#8a5a3a','#3a2a22']]),gz=r()<.45,blaze=r()<.5,socks=r()<.5,X=[-13,-6,8,15];
 let s=`<ellipse cx="2" cy="2" rx="27" ry="5" fill="#000" opacity=".14" stroke="none"/>`+HLEG(X,c);
 if(socks)s+=X.map(x=>`<rect x="${x-2.6}" y="-8" width="5.6" height="6" rx="1.5" fill="#fbf6ea" stroke-width="1"/>`).join('');
 s+=X.map(x=>`<rect x="${x-2.4}" y="-3" width="5.2" height="3.4" rx="1" fill="#3d3833" stroke-width="1"/>`).join('');
 s+=`<path d="M-22,-24 Q-30,-20 -28,-7 Q-25,-14 -21,-16Z" fill="${m}"/><ellipse cx="-1" cy="-24" rx="21" ry="12" fill="${c}"/><ellipse cx="-2" cy="-20" rx="13" ry="5" fill="${shade(c,.18)}" stroke="none" opacity=".55"/>`;
 if(gz)s+=`<path d="M11,-30 Q21,-28 25,-14 L31,-6 Q35,-4 33,0 L23,0 Q19,-8 13,-18Z" fill="${c}"/><ellipse cx="29" cy="-3" rx="5.4" ry="3.6" fill="${shade(c,.3)}"/>`+(blaze?`<path d="M23,-14 L29,-5" fill="none" stroke="#fbf6ea" stroke-width="3"/>`:'')+
  `<path d="M11,-31 Q17,-30 21,-20" fill="none" stroke="${m}" stroke-width="3.6"/>`+heye(25,-12,1.5)+`<path d="M19,2 l2,-6 M25,2 l1,-5 M30,2 l-1,-5" fill="none" stroke="#5f7438" stroke-width="1.6"/>`;
 else s+=`<path d="M10,-30 Q14,-42 22,-44 L30,-36 Q24,-30 18,-22Z" fill="${c}"/><ellipse cx="25" cy="-42" rx="11" ry="10" fill="${c}"/><ellipse cx="31" cy="-37" rx="6.5" ry="5" fill="${shade(c,.3)}"/>`+(blaze?`<path d="M23,-51 L27,-36" fill="none" stroke="#fbf6ea" stroke-width="3.4"/>`:'')+
  `<path d="M20,-51 l-1,-7 l6,5Z M25,-51 l1,-7 l5,6Z" fill="${c}" stroke-width="1.4"/><path d="M17,-50 Q10,-46 9,-34 Q14,-40 16,-36 Q13,-30 12,-26" fill="${m}" stroke-width="1.4"/>`+heye(24,-44)+`<circle cx="33" cy="-37" r=".9" fill="${OL}" stroke="none"/><path d="M29,-34 q2,1.4 4,0" fill="none" stroke-width="1"/><ellipse cx="21" cy="-39" rx="2.4" ry="1.4" fill="#f08a80" stroke="none" opacity=".6"/>`;
 return `<g transform="scale(1.4)" stroke-width="1.6">${s}</g>`}
/* 海鳥 */
const booby=()=>`<ellipse cx="1" cy="1" rx="10" ry="2.4" fill="#000" opacity=".14" stroke="none"/><path d="M-4,0 v-5 M3,0 v-5" stroke="#8a8f94" stroke-width="2.2" fill="none"/><path d="M-10,-7 Q-12,-19 -2,-21 Q8,-22 9,-13 Q9,-5 2,-4 Q-6,-3 -10,-7Z" fill="#fbf9f3"/><path d="M-10,-7 Q-15,-7 -17,-3 L-9,-10Z" fill="#2b2420"/><path d="M-9,-13 Q-2,-7 6,-9 Q0,-5 -8,-7Z" fill="#2b2420" stroke="none"/><circle cx="4" cy="-25" r="6" fill="#fbf9f3"/><path d="M8,-26 L18,-23 L8,-22Z" fill="#f0c040" stroke-width="1.2"/><path d="M0,-28 Q5,-30 9,-27 L9,-22 Q4,-23 0,-25Z" fill="#2b2420" stroke="none"/><circle cx="5" cy="-26" r="1.1" fill="#f5c842" stroke="none"/>`;
const tropic=()=>`<ellipse cx="0" cy="1" rx="11" ry="2.4" fill="#000" opacity=".14" stroke="none"/><path d="M-9,-6 Q-30,-10 -44,-4 M-9,-5 Q-28,-5 -42,2" fill="none" stroke="#d8413a" stroke-width="1.6"/><path d="M-10,-4 Q-12,-14 -2,-15 Q8,-16 9,-8 Q8,-1 0,0 Q-7,0 -10,-4Z" fill="#fbf9f3"/><circle cx="5" cy="-17" r="5.4" fill="#fbf9f3"/><path d="M9,-18 L17,-16 L9,-14Z" fill="#d8413a" stroke-width="1.1"/><path d="M1,-18 L9,-17" stroke="#2b2420" stroke-width="1.6" fill="none"/><circle cx="6" cy="-17.6" r=".9" fill="${OL}" stroke="none"/>`;
const noddy=()=>`<path d="M-3,0 v-3 M3,0 v-3" stroke="#3d3833" stroke-width="1.6" fill="none"/><path d="M-11,-6 Q-11,-14 -2,-14 Q7,-14 8,-8 Q6,-2 -2,-2 Q-8,-2 -11,-6Z" fill="#5a4636"/><path d="M-11,-6 L-17,-9 L-14,-4Z" fill="#5a4636"/><circle cx="4" cy="-15" r="4.6" fill="#5a4636"/><path d="M1,-19 Q4,-21 7,-18" fill="none" stroke="#e8e4dc" stroke-width="2"/><path d="M8,-15 L14,-14 L8,-13Z" fill="#2b2420" stroke-width="1"/>`;
const frigate=()=>`<ellipse cx="6" cy="46" rx="16" ry="3" fill="#000" opacity=".1" stroke="none"/><g transform="scale(${f(sr(.8,1.1))})"><path d="M-30,-4 L-14,-12 L-5,-4 L0,-6 L5,-4 L14,-12 L30,-4 L14,-6 L3,1 L-3,1 L-14,-6Z" fill="#2b2420" stroke-width="1.2"/><path d="M-2,1 L-5,10 M2,1 L5,10" fill="none" stroke="#2b2420" stroke-width="1.6"/>${r()<.5?'<ellipse cx="0" cy="3" rx="3" ry="2.6" fill="#d8413a" stroke-width="1"/>':''}</g>`;
const tern=()=>`<ellipse cx="4" cy="40" rx="8" ry="2" fill="#000" opacity=".1" stroke="none"/><path d="M-12,0 Q-6,-6 0,-1 Q6,-6 12,0" fill="none" stroke="${pk(['#5a4636','#fbf9f3','#2b2420'])}" stroke-width="2.6"/>`;
/* 雞（公雞、母雞） */
const rooster=()=>{const c=pk(['#c4572f','#e0a03a','#8a4a2a']);return `<ellipse cx="0" cy="1" rx="10" ry="2.2" fill="#000" opacity=".14" stroke="none"/><path d="M-3,0 v-5 M3,0 v-5" stroke="#e0a03a" stroke-width="1.8" fill="none"/><path d="M-6,-12 Q-14,-22 -16,-10 Q-14,-6 -8,-6Z M-8,-14 Q-16,-26 -10,-24" fill="#2f4a3a"/><path d="M-9,-8 Q-10,-16 -1,-17 Q8,-17 8,-10 Q6,-4 0,-4 Q-6,-4 -9,-8Z" fill="${c}"/><circle cx="5" cy="-20" r="4.6" fill="${c}"/><path d="M2,-24 q1,-4 3,-1 q1,-4 3,0 q1,-2 2,1Z" fill="#d8413a" stroke-width="1"/><path d="M9,-20 L13,-19 L9,-18Z" fill="#f0c040" stroke-width="1"/><path d="M7,-17 q1,3 0,5" fill="#d8413a" stroke-width="1"/><circle cx="6" cy="-21" r=".8" fill="${OL}" stroke="none"/>`};
/* 兩種小蜥蜴：黑色 moko uri uri、白色 moko tea-tea */
const lizard=(w)=>{const c=w?'#e8e0cc':'#3d3833',d=w?'#b8a88a':'#6a625a';return `<g transform="rotate(${ri(-30,30)})"><path d="M-12,0 Q-6,-2 0,-1 Q5,-2 8,0 Q5,2 0,1 Q-6,2 -12,0Z" fill="${c}" stroke-width="1"/><path d="M8,0 Q14,-2 18,2" fill="none" stroke="${c}" stroke-width="1.6"/><path d="M8,0 Q14,-2 18,2" fill="none" stroke="${OL}" stroke-width=".6"/><path d="M-6,-1 l-2,-4 M-6,1 l-2,4 M3,-1 l1,-4 M3,1 l1,4" fill="none" stroke="${c}" stroke-width="1.4"/><circle cx="-11" cy="-.8" r=".7" fill="${w?OL:'#e8e0cc'}" stroke="none"/>`+(w?`<circle cx="-2" cy="0" r=".7" fill="${d}" stroke="none"/><circle cx="3" cy="0" r=".7" fill="${d}" stroke="none"/>`:'')+`</g>`};
/* 海裡：綠蠵龜、熱帶魚群、龍蝦、螃蟹、座頭鯨 */
const turtle=()=>`<ellipse cx="0" cy="2" rx="22" ry="8" fill="#e8f6f6" opacity=".55" stroke="none"/><path d="M-14,-2 l-6,-6 M-14,4 l-6,5 M12,-4 l6,-6 M12,4 l6,5" fill="none" stroke="#6f8a5a" stroke-width="3.2"/><ellipse cx="-1" cy="0" rx="15" ry="9" fill="#7a8a4a"/><path d="M-9,-4 L-3,0 L-9,4 M-3,0 H6 M6,0 L11,-4 M6,0 L11,4 M-3,-7 V-1 M3,-7 V-1 M-3,7 V1 M3,7 V1" fill="none" stroke="#56603a" stroke-width="1.2"/><g class="tHead"><ellipse cx="18" cy="0" rx="5" ry="4" fill="#8f9e64"/><circle cx="20" cy="-1.4" r=".9" fill="${OL}" stroke="none"/></g>`;
const fishOne=(k)=>k===0?`<path d="M-6,0 Q-2,-6 5,-4 L9,0 L5,4 Q-2,6 -6,0Z" fill="#f5c842" stroke-width="1"/><path d="M-1,-5 L-1,5" stroke="${OL}" stroke-width="2" fill="none"/><path d="M-6,0 L-10,-3 L-10,3Z" fill="#f5c842" stroke-width="1"/><circle cx="5" cy="-1" r=".7" fill="${OL}" stroke="none"/>`
 :k===1?`<circle r="4.6" fill="#e8d6a0" stroke-width="1"/><path d="M-4,-4 l-2,-2 M0,-5 v-2.4 M4,-4 l2,-2 M-5,0 h-2.4 M5,1 h2" fill="none" stroke-width=".9"/><path d="M-5,0 L-9,-3 L-9,3Z" fill="#e8d6a0" stroke-width="1"/><circle cx="2" cy="-1" r=".8" fill="${OL}" stroke="none"/>`
 :`<path d="M-6,0 Q0,-4 6,-1 L8,0 L6,1 Q0,4 -6,0Z" fill="${pk(['#5a86b0','#e86a9a','#3f8f8a','#9a6fa8'])}" stroke-width="1"/><path d="M-6,0 L-9,-2.6 L-9,2.6Z" fill="#5a86b0" stroke-width="1"/>`;
const shoal=()=>{const k=ri(0,2),n=ri(3,5);let s='';for(let i=0;i<n;i++)s+=T(sr(-18,18),sr(-8,8),1,fishOne(k));return s};
const lobster=()=>`<g transform="rotate(${ri(-25,25)})"><path d="M-14,-2 Q-6,-8 6,-6 Q12,-4 12,0 Q12,4 6,6 Q-6,8 -14,2Z" fill="#c4572f"/><path d="M-6,-6 V6 M0,-7 V7 M6,-6 V6" fill="none" stroke="#8a3a20" stroke-width="1"/><path d="M12,-3 Q17,-8 20,-6 Q18,-2 13,-1Z M12,3 Q17,8 20,6 Q18,2 13,1Z" fill="#d97a4a" stroke-width="1.2"/><path d="M-14,0 L-19,-3 L-19,3Z" fill="#c4572f" stroke-width="1"/><circle cx="10" cy="-2" r=".8" fill="${OL}" stroke="none"/><circle cx="10" cy="2" r=".8" fill="${OL}" stroke="none"/></g>`;
const crab=()=>`<path d="M-8,-2 l-5,3 M-7,0 l-4,5 M8,-2 l5,3 M7,0 l4,5" fill="none" stroke="#c4473c" stroke-width="1.6"/><ellipse cx="0" cy="-4" rx="8" ry="5.6" fill="#d8413a"/><path d="M-7,-8 l-5,-5 l3,-1 M7,-8 l5,-5 l-3,-1" fill="#d8413a" stroke-width="1.2"/><circle cx="-2.4" cy="-9" r="1.1" fill="${OL}" stroke="none"/><circle cx="2.4" cy="-9" r="1.1" fill="${OL}" stroke="none"/>`;
/* 座頭鯨（頭朝右）：在水下游（淡淡的影子）→ 浮上來露出背、噴水 → 拱背下潛、尾巴舉起來 →（偶爾）整個身體跳出水面 */
const WH='#3d4a5a',WB='#e8eef0';
const ring=(rx,ry=rx*.22)=>`<ellipse cx="0" cy="4" rx="${rx}" ry="${ry}" fill="#e8f6f6" opacity=".6" stroke="none"/>`;
const WHALE={
 under:`<g opacity=".38" stroke="none"><path d="M-48,0 Q-20,-11 22,-10 Q50,-7 56,0 Q50,7 22,9 Q-20,11 -48,0Z" fill="#1d5a72"/><path d="M-48,0 L-64,-9 L-58,0 L-64,9Z" fill="#1d5a72"/><path d="M10,6 Q0,22 -14,26 Q-2,14 4,6Z M10,-6 Q0,-22 -14,-26 Q-2,-14 4,-6Z" fill="#1d5a72"/></g>`,
 surface:ring(54)+`<path d="M-46,4 Q-30,-9 0,-13 Q30,-15 48,-4 Q52,2 48,4Z" fill="${WH}"/><path d="M-22,-10 L-16,-17 L-12,-11Z" fill="${WH}"/><circle cx="34" cy="-8" r="1.2" fill="#2b3440" stroke="none"/><circle cx="40" cy="-6" r="1.2" fill="#2b3440" stroke="none"/><circle cx="30" cy="-5" r="1.1" fill="#2b3440" stroke="none"/>`+
  `<g class="an a-steam" style="--d:2.6s"><path d="M28,-14 Q22,-30 28,-38 M28,-14 Q34,-30 30,-40 M28,-14 Q28,-32 36,-34" fill="none" stroke="#fff" stroke-width="2.6"/></g><path d="M-58,6 q8,-4 16,0 M44,6 q8,-4 16,0" fill="none" stroke="#fff" stroke-width="2"/>`,
 dive:ring(40)+`<path d="M-34,4 Q-14,-30 16,-12 Q28,-4 32,4Z" fill="${WH}"/><path d="M-12,-20 L-6,-28 L-2,-19Z" fill="${WH}"/><path d="M-40,6 q8,-4 16,0 M24,6 q8,-4 16,0" fill="none" stroke="#fff" stroke-width="2"/>`,
 tail:ring(34,7)+`<path d="M-2,4 Q-4,-12 -6,-20 Q-20,-30 -34,-24 Q-20,-22 -12,-14 Q-6,-10 0,-12 Q6,-10 12,-14 Q20,-22 34,-24 Q20,-30 6,-20 Q4,-12 2,4Z" fill="${WH}"/><path d="M-30,-25 Q-18,-26 -8,-18 M30,-25 Q18,-26 8,-18" fill="none" stroke="${WB}" stroke-width="2.4"/>`+
  `<g class="an a-steam" style="--d:1.4s"><path d="M-26,-26 q-2,8 0,14 M24,-26 q2,8 0,14" fill="none" stroke="#bfe9ec" stroke-width="1.8"/></g>`,
 breach:ring(46,10)+`<g transform="translate(14,-14) rotate(-48)"><path d="M-36,0 Q-38,-14 -10,-16 Q30,-17 52,-4 Q56,2 52,6 Q30,16 -10,14 Q-38,14 -36,0Z" fill="${WH}"/><path d="M-6,12 Q24,14 50,5 L50,8 Q24,18 -6,15Z" fill="${WB}"/><path d="M0,13 L4,9 M8,13 L12,10 M16,13 L20,10 M24,12 L28,9 M32,10 L36,7" fill="none" stroke="#9aa8b4" stroke-width="1.2"/><path d="M14,8 Q4,30 -18,40 Q-2,24 6,8Z" fill="${WB}"/><circle cx="40" cy="-4" r="1.6" fill="${OL}" stroke="none"/></g>`+
  `<path d="M-34,10 Q-30,-4 -22,2 Q-18,-14 -8,0 Q-2,-12 6,0 Q12,-8 18,4 Q24,-2 30,8 Q0,16 -34,10Z" fill="#fff" stroke="#bfe9ec" stroke-width="1.6"/><path d="M-30,-20 q-4,-6 -2,-10 M-44,-6 q-6,-2 -8,-6 M-10,-10 q2,-6 6,-8" fill="none" stroke="#bfe9ec" stroke-width="2"/>`};
const PLAN=[['under',5,1],['surface',3.2,.55],['dive',1.4,.35],['tail',1.8,0]];
function whaleTick(m,dt){m.st=m.st??0;m.stT=(m.stT??Math.random()*4)-dt;if(m.stT>0)return;
 m.st=(m.st+1)%PLAN.length;let [name,d,sp]=PLAN[m.st];if(name==='surface'&&Math.random()<.3){name='breach';d=1.8;sp=0}
 m.stT=d+Math.random()*1.5;m.spF=sp;if(m.setArt)m.setArt(WHALE[name]);m.state=name}
const whale=()=>WHALE.under;
/* 木頭名牌 */
const nameSign=t=>{const w=t.length*14+22;return `<ellipse cx="2" cy="2" rx="${w/2}" ry="4" fill="#000" opacity=".12" stroke="none"/><path d="M-${w/2-8},0 V-30 M${w/2-8},0 V-30" fill="none" stroke="#7a5235" stroke-width="3"/><rect x="${-w/2}" y="-52" width="${w}" height="26" rx="4" fill="#c99a5b" stroke-width="2"/><path d="M${-w/2+4},-48 h${w-8}" fill="none" stroke="#e0b884" stroke-width="1.4"/><text y="-34" text-anchor="middle" font-size="14" font-weight="700" fill="${OL}" stroke="none" font-family="Huninn,PingFang TC,Noto Sans TC,sans-serif">${t}</text>`};
/* 點了會有反應、說明這是什麼（不算拿錯） */
const FACTS={turtle:'綠蠵龜（honu）探出頭來換氣～\n在復活島牠是神聖的動物，看看就好，不要摸喔。',booby:'藍臉鰹鳥！當地叫牠 kena，\n聽說北邊的白沙灘「Anakena」就是用牠的名字命名的。',tropic:'紅尾熱帶鳥在摩艾旁邊築巢，\n長長的紅色尾羽好漂亮。',
 lizardB:'黑色的小蜥蜴 moko uri uri，一溜煙躲進石縫了！',lizardW:'白色的小蜥蜴 moko tea-tea，在石頭上曬太陽。',rooster:'咕咕咕——！\n雞是最早划船來到島上的人帶來的。',lobster:'復活島的龍蝦，兩隻前腳像戴著手套。',crab:'小螃蟹橫著走開了～',
 whale:'座頭鯨！牠們會浮上來噴水、舉起尾巴潛下去，偶爾還會整個跳出水面。',shoal:'一群熱帶魚游過去了！復活島附近有很多別的地方看不到的魚。',frigate:'軍艦鳥在天上盤旋，公鳥的喉嚨有一個紅色的大氣囊。',tern:'燕鷗從頭上飛過去了～',horse:'島上的野馬自由自在地吃草，\n數量比住在島上的人還多！',noddy:'玄燕鷗：咖啡色的身體、白白的頭頂。',hen:'咕咕～母雞在找蟲吃。',cowR:'哞～這些牛是很久以前從船上帶來的。',sheepR:'咩～羊在草原上慢慢吃草。'};
let factT=0;
function tapCreature(x,y){const s=H.view().s,tol=Math.max(0,14/s-10);let best=null,bd=1e9;
 for(const m of C.movers){if(!FACTS[m.kind])continue;if(Math.abs(x-m.x)<m.w*.6+tol&&y<=m.y+10+tol&&y>=m.y-m.h-10-tol){if(m.jig)m.jig();const t=performance.now();if(t-factT>600){factT=t;H.toast(FACTS[m.kind],3000)}try{H.tone(660,.08,'triangle',.06)}catch(_){}return true}}
 for(const sp of H.sprites){if(!FACTS[sp.kind])continue;if(Math.abs(x-sp.x)<sp.w*.6+tol&&y<=sp.y+8+tol&&y>=sp.y-sp.h-8-tol){const d=Math.abs(y-(sp.y-sp.h/2));if(d<bd){bd=d;best=sp}}}
 if(!best)return false;const el=document.querySelector(`#bg [data-n="${best.n}"]`);
 if(el&&!el.querySelector(':scope > .jig')){const w=document.createElementNS('http://www.w3.org/2000/svg','g');w.setAttribute('class','jig');while(el.firstChild)w.appendChild(el.firstChild);el.appendChild(w);setTimeout(()=>{while(w.firstChild)el.insertBefore(w.firstChild,w);w.remove()},520)}
 const t=performance.now();if(t-factT>600){factT=t;H.toast(FACTS[best.kind],3000)}try{H.tone(660,.08,'triangle',.06)}catch(_){}return true}

/* ================= 場景 ================= */
const C={n:N,movers:[],start:{x:1390,y:345},startDir:2,speed:185,terrain,solids:[],flips:[],types:TYPES101,decoys:DECOYS,decoyT:DECOYT,decoyArt:DECOYART,inspect:INSPECT,inReg,anyReg:'anyR',
 cloverHosts:new Set(['bushF','stonesF','crateF','canoeF','reedsF']),
 thin:new Set(['grassT','flowers','lavaS','bird','trailM']),
 tall:new Set(['cowR','sheepR','nameSign','moaiS','moaiF','moaiH','palm','tent','house','raising','stall','walker','archaeo','horse','dancer','seller','petro','bigPukao','reedsF','ship','sieve']),
 playerArt,story:STORY,
 clover:`<g transform="scale(.85)"><path d="M0,2 Q2,10 -2,16" fill="none" stroke="#4f7a3a" stroke-width="2"/>${[0,90,180,270].map(a=>`<g transform="rotate(${a})"><path d="M0,0 C-7,-3 -9,-12 -3,-13 C-1,-13 0,-11 0,-10 C0,-11 1,-13 3,-13 C9,-12 7,-3 0,0Z" fill="#6fae4a"/></g>`).join('')}<circle r="2" fill="#f5c842" stroke-width="1"/></g>`,
 openArt:h=>FK[h.kind].open(),flipName:h=>FK[h.kind].name,emptyMsg:h=>FK[h.kind].empty,
 where:(g,h)=>{const dx=h.x-g.x,dy=h.y-g.y,d=Math.hypot(dx,dy),dirs=['東','東南','南','西南','西','西北','北','東北'],k=((Math.round(Math.atan2(dy,dx)/(Math.PI/4))%8)+8)%8;
  const reg=[['beachR','北邊的白沙灘'],['tongR','東加里奇石台前'],['quarryR','採石場'],['campR','考古隊營地'],['akiviR','阿基維石台附近'],['craterR','火山口湖邊'],['orongoR','奧隆戈村'],['grassR','中央草原']].find(([k_])=>{const g_=REG[k_];return h.x>=g_.x&&h.x<=g_.x+g_.w&&h.y>=g_.y&&h.y<=g_.y+g_.h});
  return `${reg?reg[1]:(d<200?'這附近':dirs[k]+'邊')}的${FK[h.kind].name}底下（從這裡往${dirs[k]}走）`},
 tapScene:(x,y)=>{if(Math.abs(x-1300)<80&&y>20&&y<150){H.toast('船長：慢慢找，找齊了再回海島港口！\n（想先回去，可以從選單打開冒險地圖）',3600);return true}return tapCreature(x,y)},
 how:`<div><b style="font-size:22px">🕹️</b>左下角搖桿<br>走路</div><div><b style="font-size:22px">👆</b>走近東西<br>點一下拿起來</div><div><b style="font-size:22px">🔍</b>檢查看看<br>是不是它</div><div><b style="font-size:22px">🌿</b>草叢、石堆<br>可以翻開</div>`,
 rule:'這座島上的東西要走近才拿得到，拿錯了只要放回去就好。<br>幫頭上有「？」的人完成小故事，他會告訴你 🍀 幸運草藏在哪裡。（聽說還藏著別的秘密⋯）',
 homeBtn:'搭帆船回海島港口',homeNote:'船長在北邊海灣等你，隨時可以再來'};
const E=H.SECRET.make(C);

Object.assign(KIND,{grassT:{w:20,h:16,fn:grassT},flowers:{w:22,h:12,fn:flowers},lavaS:{w:26,h:14,fn:lava},horse:{w:84,h:84,fn:horse},rooster:{w:24,h:28,fn:rooster},cowR:{w:76,h:62,fn:()=>`<g transform="scale(1.65)" stroke-width="1.4">${KIND.cow.fn()}</g>`},sheepR:{w:52,h:42,fn:()=>`<g transform="scale(1.5)" stroke-width="1.5">${KIND.sheep.fn()}</g>`},hen:{w:24,h:28,fn:()=>KIND.chicken.fn()},walker:{w:30,h:62,fn:walker},archaeo:{w:30,h:62,fn:archaeo}});
Object.assign(ANIM,{horse:['bob','peck'],dancer:['hop'],palm:['sway'],turtle:['swim'],shoal:['swim'],whale:['rock'],booby:['bob','wig'],tropic:['bob'],noddy:['peck','bob'],rooster:['peck','bob'],hen:['peck'],crab:['wig'],lobster:['wig'],cowR:['bob'],sheepR:['bob','sway']});
['turtle','shoal','whale'].forEach(k=>ALWAYS.add(k));
['moaiS','moaiF','moaiFall','ahu','house','tent','raising','stall','palm','ship','bigPukao','petro','moaiL'].forEach(k=>HEAVY.add(k));
const put=(x,y,w,h,kind,svg,o={})=>{const sp=add(x,y,w,h,kind,svg,{sh:.6,...o});if(o.solid)C.solids.push({x:x+(o.solid[2]||0),y:y-(o.solid[3]||0),rx:o.solid[0],ry:o.solid[1]});return sp};
const flipAt=(x,y,kind,force)=>{const K=FK[kind];if(!terrain(x,y)||(!force&&!canPlace(x,y,K.w,K.h,false,.6)))return null;if(force&&C.flips.some(h=>Math.hypot(h.x-x,h.y-y)<80))return null;const sp=put(x,y,K.w,K.h,kind,K.fn(),{fl:r()<.5,solid:[K.w*.3,6]});const h={sp,kind,x,y,w:K.w,h:K.h};C.flips.push(h);return h};
const flipsIn=(reg,kind,n)=>{const g=REG[reg];let k=0;for(let t=0;t<400&&k<n;t++){const x=sr(g.x,g.x+g.w),y=sr(g.y,g.y+g.h);if(!inReg(reg,x,y))continue;if(C.flips.some(h=>Math.hypot(h.x-x,h.y-y)<110))continue;if(flipAt(x,y,kind))k++}};

function ground(){const NS_='stroke="none"';let s='';
 const X0=SC.x0-260,Y0=-260,W_=SC.x1-SC.x0+520,H_=SC.y1+520;
 s+=`<rect x="${X0}" y="${Y0}" width="${W_}" height="${H_}" fill="${DEEP}" ${NS_}/>`;
 const cx=1360,cy=1300,sc_=(k)=>ISL.map(([x,y])=>[cx+(x-cx)*k,cy+(y-cy)*k]);
 s+=`<path d="${polyD(sc_(1.16))}" fill="${MID}" ${NS_}/><path d="${polyD(sc_(1.07))}" fill="${LAG}" ${NS_}/>`;
 /* 外海小島（鳥人祭搶蛋的小島）、崖下礁石旁的淺灘 */
 [[640,2492,58,26],[556,2440,30,16],[2140,560,26,14]].forEach(([x,y,a,b])=>s+=`<ellipse cx="${x}" cy="${y}" rx="${a+16}" ry="${b+10}" fill="${LAG}" ${NS_}/><ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="${ROCK}"/><path d="M${x-a*.7},${y-b*.3} Q${x},${y-b*1.3} ${x+a*.6},${y-b*.4}" fill="${GR2}" stroke-width="1.4"/>`);
 s+=`<ellipse cx="${REEF.x}" cy="${REEF.y+2}" rx="60" ry="22" fill="${LAG}" ${NS_}/>`;
 let wv='';for(let i=0;i<260;i++){const x=sr(X0,X0+W_),y=sr(Y0,Y0+H_);if(inPoly(sc_(1.1),x,y))continue;const w=sr(10,20);wv+=`M${f(x)},${f(y)} q${f(w/2)},-4 ${f(w)},0 `}
 s+=`<path d="${wv}" fill="none" stroke="#bfe9ec" stroke-width="2" opacity=".75"/>`;
 /* 海岸：黑色火山岩 */
 s+=`<path d="${polyD(ISL)}" fill="${ROCK}" stroke-width="2.4"/><path d="${polyD(sc_(.985))}" fill="${GR}" ${NS_}/>`;
 let rk='';for(let i=0;i<ISL.length;i+=2){const [x,y]=ISL[i];if(y<300&&x>1120&&x<1720)continue;rk+=`<ellipse cx="${f(x+sr(-6,6))}" cy="${f(y+sr(-5,5))}" rx="${f(sr(6,12))}" ry="${f(sr(4,7))}" fill="${pk([ROCK,ROCK2,'#5e5751'])}" stroke-width="1.2"/>`}s+=rk;
 /* 浪花 */
 s+=`<path d="${polyD(sc_(1.02))}" fill="none" stroke="#fff" stroke-width="2.4" stroke-dasharray="14 18" opacity=".8"/>`;
 /* 北邊白沙灘（阿納克納） */
 const beach=chaikin([[1110,232],[1300,196],[1480,192],[1700,250],[1730,330],[1640,430],[1480,470],[1320,460],[1170,420],[1100,330]],3);
 s+=`<path d="${polyD(beach)}" fill="${SAND}" ${NS_}/><path d="M1130,250 Q1400,200 1700,262" fill="none" stroke="#fff" stroke-width="3" opacity=".9"/>`;
 let sd='';for(let i=0;i<60;i++){const x=sr(1140,1700),y=sr(260,440);if(!inPoly(beach,x,y))continue;sd+=`M${f(x)},${f(y)} q4,-2 8,0 `}s+=`<path d="${sd}" fill="none" stroke="#dcc996" stroke-width="1.4"/>`;
 /* 丘陵（西北的特雷瓦卡、草原） */
 [[980,560,170,90],[1150,760,130,60],[1420,640,150,70],[760,900,110,70],[1300,1550,160,70],[1700,1500,130,60],[1000,1680,140,60],[1850,720,120,60]].forEach(([x,y,a,b])=>s+=`<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="${GR2}" ${NS_}/><path d="M${x-a*.8},${y+b*.2} Q${x},${y-b*1.1} ${x+a*.8},${y+b*.1}" fill="none" stroke="#8f9852" stroke-width="1.6"/><ellipse cx="${x-a*.2}" cy="${y-b*.3}" rx="${a*.5}" ry="${b*.4}" fill="${GR3}" opacity=".45" ${NS_}/>`);
 /* 小路（沒有框線的泥土小徑） */
 const trail=['M1360,450 Q1300,700 1250,950 Q1210,1150 1200,1260','M1220,1330 Q1100,1600 980,1760 Q920,1850 880,1900','M1300,960 Q1500,960 1700,1000 Q1800,1030 1840,1060','M1200,1200 Q1000,1260 930,1270','M1520,440 Q1700,600 1820,900'];
 s+=trail.map(d=>`<path d="${d}" fill="none" stroke="#cdbb8a" stroke-width="20" stroke-linecap="round" opacity=".55"/><path d="${d}" fill="none" stroke="#d9c99c" stroke-width="10" stroke-linecap="round" opacity=".6"/>`).join('');
 /* 拉諾拉拉庫（採石場火山）：山的形狀、山坡紋路、山頂的火山口和湖 */
 {const X=RAR.x,Y=RAR.y,P=(dx,dy)=>f(X+dx)+','+f(Y+dy);
  s+=`<path d="M${P(-200,40)} Q${P(-190,-60)} ${P(-110,-100)} Q${P(0,-140)} ${P(110,-104)} Q${P(196,-70)} ${P(204,40)} Q${P(100,90)} ${P(0,94)} Q${P(-110,92)} ${P(-200,40)}Z" fill="#b0a172" stroke-width="2.4"/>`;
  let st='';for(let i=0;i<15;i++){const x=-182+i*26;st+=`M${P(x,30+Math.abs(x)*.06)} Q${P(x+6,-14)} ${P(x+4,-62+Math.abs(x)*.3)} `}s+=`<path d="${st}" fill="none" stroke="#968856" stroke-width="1.3"/>`;
  [[-130,30,60,26],[60,50,70,24],[-60,-20,46,16]].forEach(([dx,dy,a,b])=>{const x=X+dx,y=Y+dy;s+=`<path d="M${x-a},${y} Q${x-a},${y-b} ${x},${y-b} Q${x+a},${y-b} ${x+a},${y}Z" fill="#c8bb93" stroke-width="1.4"/><path d="M${x-a*.6},${y-b*.3} v${b*.3} M${x},${y-b*.6} v${b*.6} M${x+a*.5},${y-b*.4} v${b*.4}" fill="none" stroke="#9a8c62" stroke-width="1.2"/>`});
  s+=`<ellipse cx="${RCR.x}" cy="${RCR.y}" rx="${RCR.rx}" ry="${RCR.ry}" fill="#c6b98c" stroke-width="2.2"/><ellipse cx="${RCR.x}" cy="${RCR.y+4}" rx="${RCR.rx-14}" ry="${RCR.ry-10}" fill="#7f7466" ${NS_}/>`;
  s+=`<path d="M${RCR.x-88},${RCR.y} A88,36 0 0 1 ${RCR.x+88},${RCR.y}" fill="none" stroke="#5f554a" stroke-width="1.3" stroke-dasharray="4 6"/><ellipse cx="${RCR.x}" cy="${RCR.y+12}" rx="70" ry="26" fill="#3f7a72" stroke-width="1.8"/>`;
  s+=[[-40,14],[30,18],[0,8]].map(([dx,dy])=>`<ellipse cx="${RCR.x+dx}" cy="${RCR.y+dy}" rx="12" ry="5" fill="#7a9a48" stroke="#5f7438" stroke-width="1"/>`).join('')}
 /* 拉諾卡烏火山口：外坡、邊緣、北邊高高的內壁、南邊緩坡、湖在底下 */
 {const X=KAU.x,Y=KAU.y;s+=`<ellipse cx="${X}" cy="${Y}" rx="${KAU.rx+44}" ry="${KAU.ry+36}" fill="#a9b068" ${NS_}/>`;
  let rl='';for(let i=0;i<30;i++){const a=i/30*Math.PI*2,x1=X+Math.cos(a)*(KAU.rx+4),y1=Y+Math.sin(a)*(KAU.ry+3),x2=X+Math.cos(a)*(KAU.rx+44),y2=Y+Math.sin(a)*(KAU.ry+36);if(!inIsl(x2,y2))continue;rl+=`M${f(x1)},${f(y1)} L${f(x2)},${f(y2)} `}
  s+=`<path d="${rl}" fill="none" stroke="#8f9852" stroke-width="1.6"/>`;
  s+=`<ellipse cx="${X}" cy="${Y}" rx="${KAU.rx}" ry="${KAU.ry}" fill="#b9bf78" stroke-width="2.4"/><ellipse cx="${X}" cy="${Y}" rx="${KIN.rx}" ry="${KIN.ry}" fill="#7f7466" ${NS_}/>`;
  let st='';for(let i=0;i<44;i++){const a=Math.PI+i/43*Math.PI,x1=X+Math.cos(a)*(KIN.rx-4),y1=Y+Math.sin(a)*(KIN.ry-3),x2=X+Math.cos(a)*(LAKE.rx+10),y2=LAKE.y+Math.sin(a)*(LAKE.ry+8);st+=`M${f(x1)},${f(y1)} Q${f((x1+x2)/2+sr(-6,6))},${f((y1+y2)/2)} ${f(x2)},${f(y2)} `}
  s+=`<path d="${st}" fill="none" stroke="#5f554a" stroke-width="1.3"/>`;
  s+=`<path d="M${X-KIN.rx},${Y} A${KIN.rx},${KIN.ry} 0 0 1 ${X+KIN.rx},${Y} L${X+KIN.rx-24},${Y+6} Q${X},${Y-KIN.ry+40} ${X-KIN.rx+24},${Y+6}Z" fill="#6f8a3a" opacity=".35" ${NS_}/>`;
  s+=`<path d="M${X-KIN.rx},${Y} A${KIN.rx},${KIN.ry} 0 0 0 ${X+KIN.rx},${Y} L${X+LAKE.rx+8},${LAKE.y} A${LAKE.rx+8},${LAKE.ry+8} 0 0 1 ${X-LAKE.rx-8},${LAKE.y}Z" fill="#9aa25a" ${NS_}/>`;
  s+=`<ellipse cx="${LAKE.x}" cy="${LAKE.y}" rx="${LAKE.rx}" ry="${LAKE.ry}" fill="#3f7a72" stroke-width="2.2"/>`;
  let rd='';for(let i=0;i<64;i++){const a=sr(0,Math.PI*2),k=Math.sqrt(sr(0,1))*.86,x=LAKE.x+Math.cos(a)*LAKE.rx*k,y=LAKE.y+Math.sin(a)*LAKE.ry*k;rd+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(10,22))}" ry="${f(sr(6,12))}" fill="${pk(['#7a9a48','#8fa858','#6f8a3a'])}" stroke="#5f7438" stroke-width="1"/>`}
  s+=rd+`<path d="M${X-KAU.rx},${Y} A${KAU.rx},${KAU.ry} 0 0 0 ${X+KAU.rx},${Y}" fill="none" stroke="#d6d89a" stroke-width="3" opacity=".8"/>`}
 /* 奧隆戈南邊的懸崖：岩壁一層層的，底下有浪花 */
 const cl=ISL.filter(([x,y])=>y>2236&&x>630&&x<1120).sort((a,b)=>a[0]-b[0]);if(cl.length>2){const D=54,tp=cl.map(p=>f(p[0])+','+f(p[1])).join(' L'),bt=cl.slice().reverse().map(p=>f(p[0])+','+f(p[1]+D)).join(' L');
  s+=`<path d="M${tp} L${bt}Z" fill="#7d7266"/><path d="M${cl.map(p=>f(p[0])+','+f(p[1]+D*.55)).join(' L')} L${bt}Z" fill="#685e54" stroke="none"/>`;
  s+=`<path d="M${cl.map(p=>f(p[0])+','+f(p[1]+D*.3)).join(' L')}" fill="none" stroke="#5f554a" stroke-width="1.4"/><path d="M${cl.map(p=>f(p[0])+','+f(p[1]+D*.7)).join(' L')}" fill="none" stroke="#51483f" stroke-width="1.4"/>`;
  s+=`<path d="M${cl.map(p=>f(p[0])+','+f(p[1]+D+4)).join(' L')}" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="10 8" opacity=".85"/>`}
 /* 石台：東加里奇、阿基維、阿胡瑙瑙（地面上的平台） */
 s+=ahu(VAIHU[0],VAIHU[1],30,12)+ahu(TONG[0],TONG[1],34,14)+ahu(AKIVI[0],AKIVI[1],30,12)+ahu(NAUNAU[0],NAUNAU[1],30,12);
 /* 東加里奇前面的廣場：踩平的草地 */
 s+=`<ellipse cx="1850" cy="1070" rx="110" ry="150" fill="#c3c27e" ${NS_} opacity=".6"/>`;
 /* 草地紋理 */
 let tf='';for(let i=0;i<700;i++){const x=sr(600,2140),y=sr(220,2380);if(!terrain(x,y)||inE(KAU,x,y,40)||inE(RAR,x,y)||(y<470&&x>1100&&x<1740))continue;tf+=`M${f(x)},${f(y)} l2,-5 l2,5 `}
 s+=`<path d="${tf}" fill="none" stroke="#8f9852" stroke-width="1.3"/>`;
 return s}

function structures(){C.solids.length=0;C.flips.length=0;
 /* 天空的鳥（軍艦鳥、烏燕鷗） */
 /* 軍艦鳥、燕鷗大多在海岸邊的海上找魚吃（地上淡淡的影子表示在天上飛） */
 C.movers.length=0;const mv=(o)=>C.movers.push({x0:o.x,y0:o.y,a:sr(0,Math.PI*2),t:0,...o});
 for(let n=0;n<18;n++){const x=sr(SC.x0,SC.x1),y=sr(60,SC.y1-60),fr=n%3>0;mv({kind:fr?'frigate':'tern',x,y,w:fr?60:24,h:16,sp:sr(45,75),turn:.5,ok:skyOK,sky:true,art:fr?frigate():tern(),anim:'flap'})}
 /* 北邊海灣：帆船（船長在船上等） */
 put(1300,118,150,130,'ship',ship()+T(-14,-12,.8,act(0,0,1,{view:'fq',pose:'stand',hat:-1,hair:'#e8e4dc',hs:3,shirt:'#2f4f7a',pants:'#3d3833',beard:true,mood:0,plain:true})+`<path d="M-15,-56 Q-14,-68 0,-70 Q14,-68 15,-56Z" fill="#fbf9f3"/><path d="M-15,-56 H15 L17,-52 H-17Z" fill="#2f3f5a"/>`),{mark:false});
 /* 東加里奇：15 尊大摩艾背對東邊的海、面向內陸（側面朝左） */
 for(let i=0;i<15;i++){const k=i/14,x=lerp(TONG[0][0],TONG[1][0],k),y=lerp(TONG[0][1],TONG[1][1],k)-14;put(x,y,44,118,'moaiS',moaiSide(sr(100,116),{pukao:i===6}),{mark:true})}
 for(let i=0;i<=16;i++){const k=i/16;C.solids.push({x:lerp(TONG[0][0],TONG[1][0],k),y:lerp(TONG[0][1],TONG[1][1],k)-4,rx:26,ry:18})}
 /* 阿基維：7 尊摩艾面朝西邊的海 */
 for(let i=0;i<7;i++){const k=i/6,x=lerp(AKIVI[0][0],AKIVI[1][0],k),y=lerp(AKIVI[0][1],AKIVI[1][1],k)-12;put(x,y,40,100,'moaiS',moaiSide(sr(88,96)),{mark:true})}
 for(let i=0;i<=8;i++){const k=i/8;C.solids.push({x:lerp(AKIVI[0][0],AKIVI[1][0],k),y:lerp(AKIVI[0][1],AKIVI[1][1],k)-4,rx:24,ry:18})}
 /* 阿胡瑙瑙（白沙灘上）：4 尊戴紅帽的摩艾面向內陸（南），看得到正面 */
 for(let i=0;i<4;i++){const x=lerp(NAUNAU[0][0],NAUNAU[1][0],i/3);put(x,NAUNAU[0][1]-10,40,110,'moaiF',moaiFront(92,{pukao:i!==2}),{mark:true})}
 C.solids.push({x:1623,y:384,rx:96,ry:20});
 /* 南岸：倒下來、臉朝下的摩艾和滾到一旁的紅帽 */
 for(let i=0;i<=8;i++){const k=i/8;C.solids.push({x:lerp(VAIHU[0][0],VAIHU[1][0],k),y:lerp(VAIHU[0][1],VAIHU[1][1],k)-4,rx:22,ry:16})}
 [[1330,1880],[1270,1940],[1210,2000]].forEach(([x,y],i)=>put(x+10,y-30,130,40,'moaiFall',moaiFallen(),{solid:[56,10,-48,4]}));
 put(1150,1990,52,40,'bigPukao',bigPukao(),{solid:[22,10]});
 /* 採石場：山坡上半埋的摩艾頭、一尊躺在岩壁上刻到一半的 */
 [[1440,1110,-6],[1500,1150,4],[1560,1125,-3],[1620,1160,6],[1690,1130,-8],[1745,1100,3],[1470,1060,2],[1660,1080,-4]].forEach(([x,y,t])=>put(x,y,46,62,'moaiH',moaiHead(sr(70,92),t),{solid:[16,8]}));
 put(1430,1000,190,60,'moaiL',moaiLying(),{solid:[90,14,0,6]});
 /* 考古隊：在立石像、營地 */
 put(1300,1050,150,130,'raising',raising(),{solid:[70,16,-30,0]});
 put(1130,1290,90,60,'tent',tent(),{solid:[42,14]});put(1240,1300,64,32,'table',camTable(),{solid:[30,8]});put(1300,1380,34,30,'sieve',sieve(),{solid:[14,6]});put(1080,1380,56,32,'barrow',barrow(),{solid:[20,8]});
 [[1200,1395],[1350,1250]].forEach(([x,y])=>put(x,y,30,62,'archaeo',archaeo(),{solid:[10,6]}));
 /* 散落在草原上的紅色大石帽 */
 [[1010,880],[1080,960],[960,1010],[1120,860],[1050,1080]].forEach(([x,y])=>put(x,y,52,40,'bigPukao',bigPukao(),{solid:[22,10]}));
 /* 奧隆戈村：低矮石屋、鳥人岩刻、提問的孩子在崖邊 */
 [[745,2300],[810,2322],[1000,2296],[1060,2272],[700,2252]].forEach(([x,y])=>{if(terrain(x,y))put(x,y,72,40,'house',orongoHouse(),{solid:[32,10]})});
 [[850,2352],[965,2345]].forEach(([x,y])=>{if(terrain(x,y-6))put(x,y,62,40,'petro',petro(),{solid:[26,8]})});
 put(REEF.x,REEF.y,52,30,'reef',reefRock(),{mark:false});
 /* 東加里奇前廣場：攤位、跳舞的人 */
 put(1780,990,96,60,'stall',stall(),{solid:[44,10]});put(1784,948,30,62,'seller',seller(),{solid:[10,6]});
 put(1820,1180,30,62,'dancer',dancer(1),{solid:[10,6]});put(1868,1200,30,62,'dancer',dancer(-1),{solid:[10,6]});
 /* 白沙灘：椰子樹、獨木舟 */
 [[1150,410],[1200,450],[1480,456],[1720,440],[1110,360],[1650,470],[1760,380]].forEach(([x,y])=>{if(terrain(x,y))put(x,y,70,130,'palm',palm(),{solid:[8,5]})});
 [[1260,270],[1450,262],[1350,300]].forEach(([x,y])=>flipAt(x,y,'canoeF'));
 /* 生物：海鳥、蜥蜴、海裡的動物（點了會有反應） */
 const cx_=1360,cy_=1300,coast=(i,d)=>{const [x,y]=ISL[i%ISL.length],L=Math.hypot(x-cx_,y-cy_);return [x+(x-cx_)/L*d,y+(y-cy_)/L*d]};
 const nearest=(x0,y0)=>{let bi=0,bd=1e9;ISL.forEach(([x,y],i)=>{const d=Math.hypot(x-x0,y-y0);if(d<bd){bd=d;bi=i}});return bi};
 [[1180,262],[1250,238],[1640,262],[1700,290]].forEach(([x,y])=>{if(terrain(x,y))put(x,y,26,30,'booby',booby(),{fl:r()<.5,solid:[8,4]})});
 [[640,2470],[662,2482],[556,2432]].forEach(([x,y],i)=>add(x,y-10,22,26,i<2?'booby':'noddy',i<2?booby():noddy(),{mark:false,s:.8}));
 [[REEF.x-18,REEF.y-18],[REEF.x+14,REEF.y-22]].forEach(([x,y])=>add(x,y,22,22,'noddy',noddy(),{mark:false,s:.8}));
 [[1470,1140,1],[1590,1112,-1],[1720,1088,1]].forEach(([x,y,d])=>{if(terrain(x,y))put(x,y,30,20,'tropic',tropic(),{fl:d<0,solid:[8,4]})});
 [[TONG[0][0]-30,TONG[0][1]+40,0],[lerp(TONG[0][0],TONG[1][0],.6)-26,lerp(TONG[0][1],TONG[1][1],.6)+16,1],[AKIVI[0][0]-28,AKIVI[0][1]+60,0],[VAIHU[0][0]-30,VAIHU[0][1]+30,1],[1420,1180,0],[880,2340,1],[1010,2290,0]].forEach(([x,y,w])=>add(x,y,30,10,w?'lizardW':'lizardB',lizard(!!w),{mark:false}));
 /* 西岸淺水（漢加羅阿海灣一帶）的綠蠵龜，北邊海灣也有一隻 */
 [[600,1700],[612,1820],[622,1560],[1450,150]].forEach(([x,y])=>{const i=nearest(x,y),p=coast(i,42);if(shallow(p[0],p[1]))mv({kind:'turtle',x:p[0],y:p[1],w:44,h:20,sp:sr(14,22),turn:.9,ok:shallow,art:turtle(),anim:'bob'})});
 /* 岸邊淺水的熱帶魚群 */
 for(let i=0,n=0;i<ISL.length&&n<18;i+=Math.floor(ISL.length/18)){const p=coast(i+ri(0,3),sr(30,60));if(shallow(p[0],p[1])){mv({kind:'shoal',x:p[0],y:p[1],w:40,h:18,sp:sr(28,46),turn:1.4,ok:shallow,art:shoal(),anim:'bob'});n++}}
 /* 海岸礁石上的龍蝦、螃蟹 */
 for(let k=0;k<12;k++){const i=ri(0,ISL.length-1),p=coast(i,-4),[x,y]=ISL[i];if(y<300&&x>1100&&x<1720)continue;add(p[0],p[1],k<4?30:24,14,k<4?'lobster':'crab',k<4?lobster():crab(),{mark:false})}
 /* 外海的座頭鯨 */
 [[2190,1720],[560,600],[2180,420]].forEach(([x,y])=>{if(deep(x,y))mv({kind:'whale',x,y,w:110,h:40,sp:sr(12,18),turn:.4,ok:deep,art:whale(),tick:whaleTick,noTilt:true})});
 /* 火山口的木頭名牌 */
 put(1010,1912,140,56,'nameSign',nameSign('拉諾卡烏火山口'),{solid:[50,6]});put(1360,1176,170,56,'nameSign',nameSign('拉諾拉拉庫採石場'),{solid:[60,6]});
 /* 可以翻開的東西 */
 flipsIn('beachR','bushF',3);flipsIn('beachR','crateF',1);
 flipsIn('grassR','bushF',6);flipsIn('grassR','stonesF',2);
 flipsIn('akiviR','bushF',3);flipsIn('tongR','bushF',2);flipsIn('tongR','stonesF',1);
 flipsIn('quarryR','stonesF',4);flipsIn('quarryR','bushF',1);
 flipsIn('campR','crateF',3);
 flipsIn('craterR','stonesF',3);flipsIn('craterR','bushF',1);
 [-.15,.35,.85,1.3,1.8,2.3,2.8,3.25].forEach(a=>{const x=LAKE.x+Math.cos(a)*(LAKE.rx+24),y=LAKE.y+Math.sin(a)*(LAKE.ry+18);flipAt(x,y,'reedsF',true)});
 flipsIn('southR','bushF',3);flipsIn('southR','stonesF',2);flipsIn('eastR','bushF',2);flipsIn('westR','bushF',2);
 flipsIn('orongoR','stonesF',2);flipsIn('orongoR','bushF',1);
}
function deco(reg,pool,tries,cap,solidKinds){const g=REG[reg],tot=pool.reduce((a,b)=>a+b[1],0);let n=0;
 for(let t=0;t<tries&&n<cap;t++){let q=r()*tot,kind=pool[0][0];for(const [k,w] of pool){q-=w;if(q<=0){kind=k;break}}
  const K=KIND[kind],x=sr(g.x,g.x+g.w),y=sr(g.y,g.y+g.h);if(!terrain(x,y)||!inReg(reg,x,y))continue;if(!canPlace(x,y,K.w,K.h,false,.6))continue;
  if(Math.hypot(x-C.start.x,y-C.start.y)<(K.h>40?150:60))continue;
  put(x,y,K.w,K.h,kind,K.fn(),{fl:r()<.5,solid:solidKinds.has(kind)?[kind==='horse'?28:kind==='cowR'?26:kind==='sheepR'?16:10,kind==='horse'||kind==='cowR'?9:6]:null});n++}}
function scatterR(){const S=new Set(['horse','walker','archaeo','cowR','sheepR']);
 deco('beachR',[['walker',1.4],['grassT',.4],['lavaS',.6],['flowers',.2]],600,14,S);
 deco('grassR',[['horse',1.1],['cowR',.5],['sheepR',.6],['walker',.8],['grassT',2.6],['flowers',1.4],['lavaS',1.2]],3000,90,S);
 deco('tongR',[['walker',1.6],['grassT',1],['lavaS',.6],['flowers',.6]],800,16,S);
 deco('quarryR',[['archaeo',.5],['walker',.6],['lavaS',2],['grassT',1]],800,18,S);
 deco('akiviR',[['walker',.8],['horse',.6],['grassT',2],['flowers',1],['lavaS',.8]],900,22,S);
 deco('craterR',[['walker',.5],['grassT',2],['lavaS',1.4],['flowers',1]],1200,28,S);
 deco('orongoR',[['walker',.8],['lavaS',1],['grassT',1]],400,8,S);
 deco('southR',[['horse',1.2],['cowR',.6],['walker',.9],['grassT',2.4],['lavaS',1.4],['flowers',1.2]],2400,70,S);
 ['northR','eastR','westR'].forEach(k=>deco(k,[['grassT',2.4],['lavaS',1.4],['flowers',1.2],['horse',.35],['sheepR',.4],['walker',.25]],1600,46,S));
 deco('tongR',[['rooster',1],['hen',1.4]],300,4,S);deco('orongoR',[['hen',1],['rooster',.6]],300,3,S);deco('campR',[['hen',1]],200,2,S);deco('beachR',[['rooster',1]],200,1,S);
 deco('anyR',[['grassT',2],['lavaS',1],['flowers',1]],2500,80,S)}
SCENE_IMPL[N]={ground,structures,scatter:scatterR};

/* ================= 冒險地圖、過場 ================= */
const rapaPreview=()=>`<svg width="120" height="84" viewBox="0 0 120 84" aria-hidden="true"><rect width="120" height="84" fill="#dcecef"/><rect y="44" width="120" height="40" fill="#7fd6cf"/><g stroke="#2b2420" stroke-width="1.5" stroke-linejoin="round"><path d="M14,58 Q40,30 106,52 Q80,64 14,58Z" fill="#b7bd6f"/>${[40,52,64,76].map((x,i)=>`<g transform="translate(${x},${50-i}) scale(.24)" stroke-width="6">${moaiSide(100)}</g>`).join('')}</g><path d="M6,72 q6,-3 12,0 q6,3 12,0 M70,76 q6,-3 12,0 q6,3 12,0" fill="none" stroke="#e8f6f6" stroke-width="1.8"/></svg>`;
MAPNODES.push({n:N,x:305,y:394,ic:'🗿',name:'復活島'});
HERE[N]=[279,402];
NEXTINFO[N]={pv:rapaPreview,btn:'搭帆船出航',had:'帆船隨時可以出航',fresh:'帆船已經升好帆了',ride:'sail'};
/* 海島港口的過關畫面「回到出發地」預覽用 */
if(NEXTINFO[5]&&!NEXTINFO[5].pv)NEXTINFO[5].pv=()=>'';
})();
