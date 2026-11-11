/* 奇幻小鎮大搜查．第 2 關「東方農莊」
   由 index.html 在 level1.js 之後載入。地形和第 1 關是同一張地圖（H.W12，寫在 level1.js），這裡放農莊自己的東西。
   場景座標：x 1760～2800。 */
(function(){
const H=window.TH;if(!H)return;
const {KIND,LEVELS,POOL,REG,SCATOK,SCATREG,SCENE_IMPL,SNOW,STORIES,VPLAN:VPLANX,WATERFN,act,add,balloon,barn,bow,cabinSVG,canPlace,house,pig,pk,r,
 roundTree,rowboat,scatter,signpost,skyBirds,sr,stall,swan,tower,well,windmill}=H;
const W12=H.W12;

const TYPES1=LEVELS[1].types;
const TYPES2=(()=>{const base=id=>TYPES1.find(t=>t.id===id);const fx=(id,regions)=>({...base(id),regions});
 return [fx('cat',['farm','farmS','farm','farmS']),fx('key',['farmS','farm','farmS','farm']),fx('letter',['farmS','farm','farmS','farm']),fx('star',['sky2','farm','farmS','farm']),fx('umbrella',['farmS','farm','farmS','farm']),fx('snail',['farm','farmS','farm','farm']),
 {id:'carrot',name:'紅蘿蔔',short:'紅蘿蔔',r:15,rot:40,regions:['farm','farm','farmS','farm']},
 {id:'egg',name:'雞蛋',short:'雞蛋',r:13,rot:20,regions:['farm','farm','farmS','farm']},
 {id:'corn',name:'玉米',short:'玉米',r:15,rot:30,regions:['farm','farm','farmS','farm']},
 {id:'milk',name:'牛奶罐',short:'牛奶罐',r:15,rot:8,regions:['farm','farmS','farm','farmS']},
 {id:'sunflower',name:'向日葵',short:'向日葵',r:16,rot:15,regions:['farm','farm','farmS','farm']},
 {id:'apple',name:'紅蘋果',short:'蘋果',r:14,rot:20,regions:['farm','farmS','farm','farmS']}]})()
/* ---- 農莊道具（穀倉 barn 留在 index.html，乾草車過場也會用到） ---- */
const scarecrow=()=>`<path d="M0,0 V-48 M-20,-36 H20" fill="none" stroke="#7a5235" stroke-width="3.5"/><path d="M-10,-38 L10,-38 L12,-18 L-12,-18Z" fill="#6a7488"/><rect x="-5" y="-30" width="6" height="6" fill="#d4ac52" stroke-width="1"/><path d="M-22,-38 l-5,-3 M-22,-36 l-6,1 M22,-38 l5,-3 M22,-36 l6,1" fill="none" stroke="#d4ac52" stroke-width="1.6"/><circle cx="0" cy="-48" r="9" fill="#e2cfa0"/><path d="M-4,-50 l2,2 M-2,-50 l-2,2 M3,-50 l2,2 M5,-50 l-2,2 M-3,-44 q3,2 6,0" fill="none" stroke-width="1.1"/><ellipse cx="0" cy="-55" rx="15" ry="3.5" fill="#d4ac52"/><path d="M-7,-56 Q-7,-64 0,-64 Q7,-64 7,-56Z" fill="#d4ac52"/>`;
const fruitTree=()=>roundTree()+`<g stroke-width="1">${[[-14,-58],[6,-70],[18,-52],[-4,-46],[-22,-48],[12,-80]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.2" fill="#c4473c"/>`).join('')}</g>`;
function structures2(){skyBirds(2);
 add(2400,250,60,110,'balloon',balloon('#d4ac52','#fbf6ea'),{mark:false,s:.85});
 add(1990,800,170,130,'barn',barn(),{sh:.9});
 add(2090,800,50,150,'tower',tower(40,110,{body:'#c6ccc2',roof:'#8a9a9c',rh:30,flag:false}),{sh:.9});
 [[2400,790,110],[2680,810,100],[1960,1165,95],[2620,1190,105],[2480,1220,90]].forEach(([x,y,w])=>add(x,y,w+16,w*1.2,'house',house(w,sr(55,70),{roof:pk(['#c9a26a','#b85a35','#7f5a40']),wall:pk(['#efe4cc','#eadbb4','#dcb894'])}),{sh:.9}));
 add(2730,600,80,200,'mill',windmill(),{sh:.6});
 add(2180,1190,60,60,'house',house(50,34,{roof:'#b85a35',wall:'#eadbb4'}),{sh:.9});
 [[2190,670],[2660,700],[1990,1060],[2670,1040]].forEach(([x,y])=>add(x,y,40,70,'scarecrow',scarecrow()));
 for(let gx=2120;gx<2480;gx+=sr(60,80))for(let gy=920;gy<1140;gy+=sr(60,75))if(canPlace(gx,gy,64,88,false,.6))add(gx+sr(-8,8),gy,64,88,'fruitTree',fruitTree(),{sh:.6});
 [[2250,1342],[2370,1372],[2190,1362]].forEach(([x,y])=>add(x,y,34,34,'swan',swan(),{mark:false,fl:r()<.5}));
 add(2120,1620,120,90,'stall',stall('veg'));
 add(2360,1640,120,90,'stall',stall('fruit'));
 add(2600,1620,120,90,'stall',stall('bread'));
 [[2100,1642],[2145,1644],[2345,1662],[2585,1642]].forEach(([x,y])=>add(x,y,28,58,'walker',act(0,0,1,{view:'back',pose:pk(['reach','stand'])},'step')));
 add(2050,1460,62,72,'well',well());
 // teasers for future areas
 add(2632,590,50,50,'sign',signpost('纜車'));
 add(2690,540,80,60,'cabin',`<path d="M20,-46 L130,-300 M30,-44 L140,-298" fill="none" stroke-width="1.8"/><rect x="-30" y="-34" width="60" height="34" fill="#ddd5c6"/><path d="M-34,-34 L34,-34 L28,-44 L-28,-44Z" fill="${SNOW}"/><rect x="-12" y="-24" width="24" height="24" fill="#3d3833"/><ellipse cx="22" cy="-46" rx="12" ry="3.5" fill="#c4473c"/><g transform="translate(78,-170)">${cabinSVG('#c4473c',false)}</g>`,{mark:false});
 add(2580,1688,50,50,'sign',signpost('小島'));
 add(2650,1785,80,30,'boat',rowboat(),{mark:false});
}
/* 區域 */
Object.assign(REG,{sky2:{x:1850,y:90,w:900,h:170},farm:{x:1840,y:560,w:900,h:700},farmS:{x:1840,y:1260,w:900,h:430},pond:{x:2130,y:1270,w:340,h:160}});
Object.assign(POOL,{
 pondW:[['lily',3]],
 farm:[['walker',1.5],['cow',1.6],['pig',.8],['chicken',1.1],['sheep',.6],['hay',1.2],['fence',1.4],['grassClump',1.4],['pebbles',.4],['pumpkinPlain',.6],['whiteCarrot',.6],['bucket',.5],['tomato',.4],['flowersY',.6],['cat',.4],['dog',.3],['crate',.5],['barrel',.4],['bush',.6],['peekBush',.3],['round',.3]],
 farmS:[['walker',3.2],['peekBarrel',.4],['peekCrate',.3],['crateStack',.4],['crate',.6],['barrel',.6],['pot',.6],['bucket',.5],['tomato',.5],['whiteCarrot',.4],['cat',.5],['dog',.3],['chicken',.4],['flowersY',.4],['bench',.3],['umbYellow',.3],['note',.3],['keyGrey',.2],['cupcake',.2],['grassClump',.6],['pebbles',.4],['lamp',.3]]});
Object.assign(KIND,{scarecrow:{w:44,h:70,fn:scarecrow},fruitTree:{w:64,h:88,fn:fruitTree}});
SCATREG.pondW='pond';SCATOK.pondW=W12.inPond;
/* 路人安排 */
Object.assign(VPLANX,{
 farm:{petDog:1,feedChickens:3,shepherd:1,carryBox:2,watering:3,sweep:1,dogWalk:1,chat:2,kiteFly:1,reading:1,petCat:1,flowerWatch:1,stretch:1},
 farmS:{chat:4,handInHand:2,carryBox:2,violin:1,benchPair:1,petCat:1,throwCatch:1,dogWalk:1,flute:1,jumpRope:1}});
function scatter2(){
 scatter('farm',POOL.farm,9000,340);
 scatter('farmS',POOL.farmS,7000,240);
 scatter('pondW',POOL.pondW,600,14);
}
/* 小故事 */
STORIES[2]={title:'陷在泥巴裡的小豬',giver:()=>act(0,0,1,{view:'fq',pose:'reach',hat:1,mood:2}),who:'農夫',
    target:()=>`<ellipse cx="0" cy="-2" rx="22" ry="6" fill="#7a5a3a" stroke-width="1.4"/>`+pig()+bow(-15,-13,'#5a86b0')+`<path d="M-18,-2 q4,-4 8,0 M6,-1 q4,-4 8,0" fill="none" stroke="#5a3e28" stroke-width="1.6"/>`,tw:40,th:28,
    helper:()=>act(0,0,1,{view:'fq',pose:'hold',hat:3,extra:`<circle cx="15" cy="-18" r="8" fill="none" stroke="#c99a5b" stroke-width="3"/><circle cx="15" cy="-18" r="4.5" fill="none" stroke="#c99a5b" stroke-width="2.4"/>`}),hw:40,hh:62,
    ask:'農夫：我的小豬跑出圍欄了！牠尾巴上綁著藍色蝴蝶結。',
    need:'小豬陷在泥巴裡出不來⋯要找條繩子！好像有個牧童帶著一捆繩子。',
    got:'牧童：繩子借你，慢慢拉喔！',
    ok:'嘿咻！小豬被拉出來了，乖乖跟著你。快告訴農夫！'};

/* ================= 登記 ================= */
WATERFN[2]=W12.isWater;
SCENE_IMPL[2]={ground:()=>W12.ground(2),structures:structures2,scatter:scatter2};
LEVELS[2].types=TYPES2;

/* ================= 登記：場景範圍、場地邊緣、冒險地圖（2026-11-09 從 index.html 搬來） ================= */
H.SCENES[2]={x0:1760,x1:2800,c:[2250,880]};H.SCREG[2]=['farm','farmS'];H.TARGET[2]=330;
H.SKYC[2]='#f6efe0';H.SKYY[2]=350;H.EDGEM[2]='R';H.EDGED[2]='RB';
H.EDGEDECO[2]=[['round',3],['bush',2],['pine',1],['rock',.6]];
H.FRINGE[2]=[['round',1.8],['bush',2.2],['hay',.7],['grassClump',2.4],['rock',.8],['pebbles',.8],['walker',.4]];
H.HERE[2]=[252,186];
/* 借物件：農莊的東西每局隨機借幾種放進第 1 關 */
H.BORROW[2]=[['egg',{1:['meadow','village','meadow','banks']}],['apple',{1:['village','plaza','village','meadow']}],['corn',{1:['meadow','village','plaza','meadow']}],['sunflower',{1:['meadow','banks','top','meadow']}]];
/* 冒險地圖：小鎮往農莊的路 */
H.mapHook(0,({U,P,ink,FN,f})=>{let g='';const on=U>=2;
 // path town -> farm
 if(on)g+=H.mapRoute('M132,222 Q160,214 172,216 Q200,220 222,222','road',ink)+P('M152,210 h14 v10 h-14Z','#c99a5b',1.4)+`<path d="M155,210 v10 M159,210 v10 M163,210 v10" stroke="${ink}" stroke-width=".9"/>`;
 return g});
/* 冒險地圖：農莊 */
H.mapHook(4,({U,P,ink,FN,f})=>{let g='';const on=U>=2;
 // ---- farm ----
 if(on){let m=`<g class="mnode" data-n="2"><circle cx="262" cy="214" r="50" fill="transparent"/>`;
  const FK=.7; /* 2026-11-11 農莊圖案縮小，以 (264,240) 為中心 */
  m+=`<g transform="translate(264,240) scale(${FK}) translate(-264,-240)">`;
  // fields
  const field=(pts,c,lc)=>P('M'+pts.join(' L')+'Z',c,1.4)+`<g clip-path="none"></g>`;
  m+=field(['230,236','290,230','318,244','262,256'],'#d9c06a')+`<path d="M242,238 l50,-5 M250,243 l52,-5 M256,248 l52,-4" stroke="#b39b45" stroke-width="1.1"/>`;
  m+=field(['262,256','318,244','322,272','272,282'],'#a3b45e')+`<path d="M272,262 l40,-9 M276,270 l42,-9" stroke="#7f9244" stroke-width="1.1" stroke-dasharray="3 3"/>`;
  m+=field(['224,250','262,256','272,282','226,280'],'#c69a66')+`<path d="M232,260 l34,3 M232,268 l36,3 M232,276 l38,2" stroke="#9e7646" stroke-width="1.1"/>`;
  // fence
  let fe='';for(let x=226;x<=300;x+=8)fe+=`M${x},${232-(x-226)*.08} v-6 `;m+=`<path d="${fe} M226,229 L300,223" fill="none" stroke="${ink}" stroke-width="1.2"/>`;
  m+=`<ellipse cx="262" cy="224" rx="44" ry="8" fill="#000" opacity=".08"/>`;
  // barn
  m+=`<g transform="translate(246,224)">`+P('M-20,0 V-18 L-14,-30 L0,-36 L14,-30 L20,-18 V0Z','#b84a2c',1.7)+`<path d="M6,0 V-33 L14,-30 L20,-18 V0Z" fill="#963820"/>`+P('M-23,-17 L-14,-31 L0,-38 L14,-31 L23,-17','none',2)+P('M-8,0 V-16 H8 V0Z','#7a3e2a',1.4)+`<path d="M-8,-16 L8,0 M8,-16 L-8,0" stroke="#fffaf0" stroke-width="1.5"/>`+P('M-4,-27 h8 v6 h-8Z','#fffaf0',1.2)+`</g>`;
  // silo
  m+=`<g transform="translate(272,224)">`+P('M-7,0 V-34 H7 V0Z','#cfd5cb',1.6)+`<path d="M2,0 V-34 H7 V0Z" fill="#aeb6ad"/>`+P('M-8,-34 Q0,-46 8,-34Z','#8f9a9a',1.6)+`<path d="M-7,-24 h14 M-7,-14 h14" stroke="${ink}" stroke-width=".8"/></g>`;
  // windmill
  m+=`<g transform="translate(298,212)">`+P('M-5,0 L-3,-26 H3 L5,0Z','#f3e8cf',1.5)+`<g><animateTransform attributeName="transform" type="rotate" from="0 0 -26" to="360 0 -26" dur="9s" repeatCount="indefinite"/>`+P('M0,-26 L-2,-44 L2,-44Z M0,-26 L18,-28 L18,-24Z M0,-26 L2,-8 L-2,-8Z M0,-26 L-18,-24 L-18,-28Z','#fffaf0',1.3)+`</g><circle cy="-26" r="2" fill="${ink}"/></g>`;
  // hay bales
  [[226,230],[234,233]].forEach(([x,y])=>m+=`<circle cx="${x}" cy="${y-5}" r="5" fill="#e3c35e" stroke="${ink}" stroke-width="1.3"/><path d="M${x-2},${y-7} a2.5,2.5 0 1 1 3,3" fill="none" stroke="#b39b45" stroke-width="1"/>`);
  m+=`</g>`;
  m+=`<g transform="translate(268,${f(240+56*FK-6)})"><rect x="-32" y="-11" width="64" height="20" rx="10" fill="#fffaf0" stroke="${ink}" stroke-width="1.8"/><text y="4.5" text-anchor="middle" font-size="12" fill="${ink}" font-family="${FN}">東方農莊</text></g></g>`;
  g+=m}
 return g});
/* ================= 過場：乾草車（從小鎮往東到農莊） ================= */
{const {T,OL,limb,pk,chibi,kid,swirl,roundTree,barn,pineS,cabinSVG,tone}=H;
function horseCart(){
 const legs=[[52,0],[60,.2],[80,.1],[88,.3]].map(([x,d])=>`<g class="gallop" style="animation-delay:-${d}s">${limb(`M${x},-34 L${x+2},-17 L${x},0`,'#8a4e2e',4.5)}</g>`).join('');
 let g=`<g class="cbob">`;
 g+=`<path d="M-72,-2 Q0,6 110,-2" fill="none" stroke="#000" stroke-width="10" opacity=".12"/>`;
 g+=limb('M8,-30 L48,-38','#7a5235',2.6);
 g+=legs+`<path d="M44,-44 Q30,-40 34,-26 Q38,-34 46,-36" fill="#3a2a22"/><ellipse cx="70" cy="-44" rx="27" ry="13" fill="#a0623a"/>`;
 g+=`<path d="M86,-50 Q94,-74 104,-82 L116,-74 Q104,-62 98,-40Z" fill="#a0623a"/><ellipse cx="114" cy="-76" rx="13" ry="8.5" fill="#a0623a" transform="rotate(28 114 -76)"/><path d="M104,-86 l-2,-9 l7,6Z" fill="#a0623a"/>`;
 g+=`<path d="M100,-86 Q90,-74 86,-52 Q92,-66 98,-72 Q94,-62 92,-50" fill="#3a2a22"/><circle cx="112" cy="-80" r="1.6" fill="${OL}" stroke="none"/><ellipse cx="121" cy="-71" rx="1.4" ry="1" fill="${OL}" stroke="none"/>`;
 g+=`<path d="M60,-56 Q72,-60 84,-55 M92,-58 L104,-74" fill="none" stroke="#c4473c" stroke-width="2.2"/>`;
 g+=`<path d="M-70,-42 Q-62,-74 -32,-70 Q-6,-76 8,-42Z" fill="#e8c46a"/><path d="M-56,-50 l4,-12 M-40,-48 l2,-16 M-22,-50 l3,-14 M-6,-48 l-2,-10" fill="none" stroke-width="1.2"/>`;
 g+=`<g transform="translate(-34,-60) scale(.62)">${chibi({arm:1,sit:true,hat:1,mood:1})}</g>`;
 g+=`<path d="M-72,-42 L12,-42 L8,-22 L-68,-22Z" fill="#a8703f"/><path d="M-70,-34 H10" fill="none" stroke-width="1.2"/>`;
 g+=`<g transform="translate(-2,-42) scale(.62)">${kid({pose:'reach',hat:pk([1,4])})}</g><path d="M6,-55 Q60,-70 104,-74" fill="none" stroke="#7a5235" stroke-width="1.2"/>`;
 [[-52,-16],[-12,-16]].forEach(([x,y])=>g+=`<g transform="translate(${x},${y})"><g class="wheel"><circle r="16" fill="#c99a5b"/><circle r="4" fill="#7a5235"/><path d="M0,-15 V15 M-15,0 H15 M-10.6,-10.6 L10.6,10.6 M10.6,-10.6 L-10.6,10.6" fill="none" stroke-width="1.6"/></g></g>`);
 return g+`</g>`+[0,1,2].map(i=>`<circle class="dust" cx="-78" cy="-8" r="${5+i*2}" fill="#e2d2a8" stroke-width="1.3" style="animation-delay:-${i*.25}s"/>`).join('');
}
function rideSVG(){
 const loop=(inner,dur)=>`<g class="rl" style="--d:${dur}s"><g>${inner}</g><g transform="translate(399,0)">${inner}</g></g>`;
 let s=`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">`;
 s+=`<rect width="400" height="600" fill="#f6efe0" stroke="none"/><circle cx="320" cy="120" r="34" fill="#f5d27a" stroke="none"/>`;
 s+=loop(T(70,150,.9,swirl())+T(270,90,.7,swirl()),40);
 s+=loop(`<path d="M0,300 L0,250 Q50,190 100,240 Q150,170 210,235 Q270,180 320,240 Q360,200 400,250 L400,300Z" fill="#cdd3b4" stroke="none"/><path d="M0,250 Q50,190 100,240 Q150,170 210,235 Q270,180 320,240 Q360,200 400,250" fill="none" stroke="#8f9a7c" stroke-width="1.6"/>`,26);
 s+=loop(`<path d="M0,360 L0,300 Q70,262 140,296 Q210,258 280,294 Q340,266 400,300 L400,360Z" fill="#8f9d58" stroke="none"/><path d="M0,300 Q70,262 140,296 Q210,258 280,294 Q340,266 400,300" fill="none"/>`+[40,130,250,330].map(x=>`<g transform="translate(${x},${300-((x*7)%14)}) scale(.45)">${roundTree()}</g>`).join('')+`<g transform="translate(190,292) scale(.35)">${barn()}</g>`,12);
 s+=loop(`<rect x="0" y="352" width="400" height="80" fill="url(#wheat)" stroke="none"/><path d="M0,352 H400" fill="none" stroke-width="1.6"/>`+[...Array(9)].map((_,i)=>`<rect x="${i*45+6}" y="404" width="6" height="28" rx="2" fill="#f1ead8"/>`).join('')+`<path d="M0,412 H400 M0,422 H400" fill="none" stroke="#f1ead8" stroke-width="3"/>`,5);
 s+=loop(`<rect x="0" y="430" width="400" height="100" fill="#e2c896" stroke="none"/><path d="M0,430 H400" fill="none" stroke-width="2"/><path d="M10,486 h40 M110,486 h40 M210,486 h40 M310,486 h40" fill="none" stroke="#c9b083" stroke-width="4"/>`+[30,140,260,350].map(x=>`<ellipse cx="${x}" cy="${455+(x%30)}" rx="5" ry="3" fill="#b0a996" stroke-width="1.2"/>`).join(''),1.4);
 s+=`<g transform="translate(150,512)">${horseCart()}</g>`;
 s+=loop(`<rect x="0" y="528" width="400" height="80" fill="#a3ad66" stroke="none"/><path d="M0,528 H400" fill="none" stroke-width="2"/>`+[20,70,120,190,240,300,360].map(x=>`<path d="M${x},560 l-4,-12 M${x},560 l0,-15 M${x},560 l4,-12" fill="none" stroke="#56603a" stroke-width="2"/>`).join('')+[95,215,330].map(x=>`<circle cx="${x}" cy="575" r="4" fill="${pk(['#e3a89e','#f1ead8','#d4ac52'])}" stroke-width="1.2"/>`).join(''),.9);
 return s+`</g></svg>`;
}
H.RIDES.cart={text:'乾草車出發，前往東方農莊⋯',every:230,tick:k=>tone(k%2?520:420,.06,'triangle',.06),svg:rideSVG};}
})();
