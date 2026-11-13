/* 奇幻小鎮大搜查．第 9 關 天守閣山城（櫻花山城最後一關）
   需要 sakura_common.js、level8.js（老朋友：御守、繪馬）。
   使用者定案：場景 C（雙層石垣：下段大表演廣場、石階上到上段本丸天守閣、兩側看雲海）；光線＝晴朗白天＋遠方雲海；
   彩蛋＝點金鯱閃一道金光；人物＝武士表演區當主角、遊客少；過場＝登城石階（RIDES.castle；原本叫 stairs，撞到第 6→7 關的石階過場，主帳號合併時改名）。
   場景（上北下南）：南＝櫓門；下段白砂表演廣場（陣太鼓舞台、武士們）；中央石階往上穿過石垣；上段本丸（天守閣＋兩側角櫓、茶室、松樹、櫻花）；
   上段左右兩側是懸崖外的雲海。 */
/* 主帳號合併（2026-11-12）：RIDES.stairs→RIDES.castle（撞名）、和服、筆直石階＋石垣影子、白砂不長草、北邊天空遠山雲海、懸崖往內移讓雲海變寬、
   小刺蝟站在石垣頂、武士改髮髻頭巾、人群小故事 8b（festTap9）、干擾物換成原木五角木牌／木頭線軸／灰色小石塔、金鯱改 I、SPOTS／BLEND、地圖 mapRoute。 */
(function(){
const H=window.TH;if(!H)return;
const N=9;
const {T,f,r,sr,pk,ri,OL,kid,act,add,mark,canPlace,scatter,skyBirds,KIND,POOL,VPLAN,REG,SCREG,LEVELS,ART,DECOY,SCENE_IMPL,
 WATERFN,RIDES,HERE,OUTFITS,STORIES,HOSTK,HOSTN,TAPHOOKS,MAPHOOKS,ALWAYSX,HEAVYX,tone,typeOf,sprites,occ,CELL,GC,GR}=H;
const S=H.SAKURA;if(!S)return;
const C=S.C;

/* ================= 1. 場景範圍、天空（晴朗）、場地邊緣 ================= */
H.SCENES[N]={x0:600,x1:1900,y1:2400,c:[1250,2050]};
H.TARGET[N]=330;
H.SKYC[N]='#cfe6f5';H.SKYY[N]=200;
H.EDGEM[N]='';H.EDGED[N]=''; /* 主帳號合併時改：最下面的邊緣樹會被前景白霧蓋住一半（使用者：最下面的樹被擋住）→ 不種 */
H.EDGEDECO[N]=[['pine',2],['bush',.8],['round',.5]];
H.FRINGE[N]=[['grassClump',2.4],['bush',.6]];
H.DENS[N]=1.33;

/* ================= 2. 當地人的穿著（遊客；武士表演者在 structures 裡指定） ================= */
OUTFITS[N]=o=>{if(o.top)return o;
 /* 主帳號合併時補：約 7 成穿和服（登城觀光：和服＋羽織、振袖、浴衣都有） */
 if(r()<.7){const st=pk(['C','C','A','A','B']);o.top='kimono';o.bottom='kimono';o.kim=st;
  o.shirt=pk(st==='B'?['#3e5e8a','#e8eef6','#fbf6ea','#7a9ac8']:['#5f7a6a','#8a6aa8','#c8645a','#3b5a8a','#e8c86a','#f4b6c2']);
  o.obi=pk(['#f0c040','#d8413a','#3b5a8a','#fbf6ea','#e8a0b4']);o.pat=st==='B'?pk(['#3b5a8a','#fbf6ea','#5f8a3a']):pk(['#fde4ec','#fff','#f7c4d3','#e8c86a']);
  if(st!=='C')o.hat=-1;return o}
 o.top=pk(['long','long','coat','tee']);o.bottom=pk(['pants','pants','shorts']);
 o.shirt=o.shirt||pk(['#5f7a6a','#3e5e8a','#fbf6ea','#c8645a','#8a6aa8','#e8c86a','#9a8a6a','#7a9ac8']);return o};

/* ================= 3. 物件與干擾物（畫在 0,0 附近約 30×30） ================= */
const gold='#f0c040';
Object.assign(ART,{
 sk_kabuto:`<path d="M-13,5 Q-14,-9 0,-11 Q14,-9 13,5Z" fill="#3e4a6a"/><path d="M-8,-8 Q0,-4 8,-8" fill="none" stroke="#7a8aaa" stroke-width="1.2"/><path d="M-14,4 H14 L18,13 Q0,18 -18,13Z" fill="#b8402e"/><path d="M-9,5 L-11,15 M-3,6 V16 M3,6 V16 M9,5 L11,15" fill="none" stroke="#e8c070" stroke-width="1.1"/><path d="M-8,-11 Q-15,-25 0,-20 Q15,-25 8,-11 Q0,-17 -8,-11Z" fill="${gold}"/><circle cx="0" cy="-3" r="2.4" fill="${gold}" stroke-width="1"/>`,
 sk_shachi:`<rect x="-12" y="9" width="24" height="5" rx="1.6" fill="#8a5a32"/><rect x="-9" y="5" width="18" height="4.4" rx="1.2" fill="#c8362f"/><g transform="translate(-1,6) scale(.72)"><path d="M-8,-2 Q-17,-13 -11,-26 Q-7,-33 0,-35 L5,-31 Q-2,-27 -2,-19 Q-2,-11 6,-7Z" fill="${gold}" stroke="${OL}" stroke-width="1.3"/><path d="M4,-30 Q-1,-26 -1,-19 Q-1,-12 5,-8 L2,-7 Q-4,-12 -4,-19 Q-4,-26 1,-31Z" fill="#fbe7a0" stroke="none"/><path d="M-1,-33 Q-9,-41 -4,-47 Q1,-41 3,-37 Q8,-45 15,-43 Q11,-35 5,-31Z" fill="${gold}" stroke="${OL}" stroke-width="1.3"/><path d="M-14,-10 Q-22,-14 -19,-22 Q-15,-19 -12,-18Z" fill="${gold}" stroke="${OL}" stroke-width="1.1"/><path d="M-9,-14 q3,2 5,0 M-8,-20 q3,2 5,0 M-5,-26 q3,2 4,0" fill="none" stroke="#c8961a" stroke-width="1.1"/><path d="M-11,2 Q-14,-9 -2,-10 Q9,-11 13,-4 Q15,0 11,2 Q2,6 -6,5Z" fill="${gold}" stroke="${OL}" stroke-width="1.3"/><path d="M-3,-8 Q-6,-3 -3,3" fill="none" stroke="#c8961a" stroke-width="1.2"/><circle cx="5" cy="-5" r="2.6" fill="#fff" stroke="${OL}" stroke-width=".9"/><circle cx="5.6" cy="-5" r="1.3" fill="${OL}"/><path d="M9,0 q2,1 4,-1" fill="none" stroke="${OL}" stroke-width="1"/><path d="M-13,-17 Q-12,-25 -6,-30" fill="none" stroke="#fff3b0" stroke-width="1.6" stroke-linecap="round"/></g>`, /* 主帳號合併時改（使用者：原本像魚骨頭）→ 和屋頂一樣的實心金鯱＋小台座 */
 sk_kakejiku:`<rect x="-10" y="-20" width="20" height="3.6" rx="1.8" fill="#6a4a30"/><circle cx="-11.5" cy="-18.2" r="2" fill="#6a4a30" stroke-width="1.2"/><circle cx="11.5" cy="-18.2" r="2" fill="#6a4a30" stroke-width="1.2"/><rect x="-8.5" y="-16.4" width="17" height="29" fill="#2f4a7a"/><rect x="-6" y="-13" width="12" height="23" fill="#f4ecd8" stroke-width="1"/><path d="M-5,6 L-1,-3 L2,2 L4,-1 L6,6Z" fill="#8a9a8a" stroke-width="1"/><circle cx="3" cy="-8" r="2" fill="#d8413a" stroke="none"/><rect x="-10" y="12.4" width="20" height="3.6" rx="1.8" fill="#6a4a30"/>`,
 sk_shogi:`<path d="M0,-17 L10,-9 L12,12 H-12 L-10,-9Z" fill="#e8c27a"/><path d="M0,-14 L7,-8 M0,-14 L-7,-8" stroke="#c9a060" stroke-width=".9" fill="none"/><g stroke="${OL}" stroke-width="1.7" fill="none" stroke-linecap="round"><path d="M-4,-5 H4 M-4,1 H4 M-5,7 H5 M0,-7 V8"/></g>`,
 sk_kamonflag:`<path d="M-11,16 V-20" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M-11,16 V-20" fill="none" stroke="#8a6a4a" stroke-width="2.2"/><circle cx="-11" cy="-21" r="2.4" fill="${gold}" stroke-width="1.2"/><path d="M-9,-18 H12 V7 H-9Z" fill="#fbf9f3"/><circle cx="1.5" cy="-5.5" r="6" fill="${OL}" stroke="none"/><circle cx="1.5" cy="-5.5" r="2.2" fill="#fbf9f3" stroke="none"/><path d="M1.5,-11 V-8 M-3.5,-3 L-1,-5 M6.5,-3 L4,-5" stroke="#fbf9f3" stroke-width="1.4" fill="none"/>`,
 sk_chagama:`<path d="M-13,3 Q-15,-9 -7,-12 H7 Q15,-9 13,3 Q12,11 0,11 Q-12,11 -13,3Z" fill="#4a5048"/><rect x="-6" y="-15" width="12" height="4" rx="1.6" fill="#3a3f38"/><circle cx="0" cy="-17" r="2" fill="#3a3f38" stroke-width="1.2"/><circle cx="-14.5" cy="-3" r="2.4" fill="none" stroke-width="1.7"/><circle cx="14.5" cy="-3" r="2.4" fill="none" stroke-width="1.7"/><path d="M-9,-6 Q0,-3 9,-6" fill="none" stroke="#7a8478" stroke-width="1.2"/><path d="M-8,13 H8" stroke="#8a6a4a" stroke-width="3" fill="none"/>`,
 sk_tenshumodel:`<rect x="-15" y="10" width="30" height="4.4" rx="1.6" fill="#b98b5a"/><path d="M-11,10 V4 H11 V10Z" fill="#a9a79c"/><rect x="-8.5" y="-3" width="17" height="7" fill="#fbf9f3"/><path d="M-13,-3 Q0,-8 13,-3 Q0,1 -13,-3Z" fill="#454a5a"/><rect x="-5.5" y="-10" width="11" height="6" fill="#fbf9f3"/><path d="M-9.5,-10 Q0,-15 9.5,-10 Q0,-7 -9.5,-10Z" fill="#454a5a"/><path d="M-3.4,-14 L0,-20 L3.4,-14Z" fill="#454a5a" stroke-width="1.2"/><path d="M-4,-19 q-3,-2 -2,-5 M4,-19 q3,-2 2,-5" fill="none" stroke="${gold}" stroke-width="1.6"/>`,
 sk_inkan:`<rect x="-5" y="-19" width="10" height="17" rx="2.4" fill="#8a4a2a"/><ellipse cx="0" cy="-19" rx="5" ry="2" fill="#a8603a" stroke-width="1.2"/><rect x="-8" y="-2" width="16" height="7" rx="1.5" fill="#c9a060"/><rect x="-11" y="7" width="22" height="7" rx="1.5" fill="#d8413a"/><path d="M-6,10 H6 M0,8 V13" stroke="#fbf6ea" stroke-width="1.2" fill="none"/>`,
 sk_taiko:`<path d="M-14,13 L-8,3 M14,13 L8,3" stroke="#6a4a30" stroke-width="3.2" fill="none"/><path d="M-12,-8 Q-14,2 -10,6 H10 Q14,2 12,-8Z" fill="#a8552f"/><ellipse cx="0" cy="-8" rx="12" ry="4.6" fill="#f0d9a8"/><g fill="#e8c070" stroke-width=".8"><circle cx="-9" cy="0" r="1.3"/><circle cx="-3" cy="2.6" r="1.3"/><circle cx="3" cy="2.6" r="1.3"/><circle cx="9" cy="0" r="1.3"/></g><path d="M-7,-17 L1,-7 M7,-17 L-1,-7" stroke="${OL}" stroke-width="4" fill="none"/><path d="M-7,-17 L1,-7 M7,-17 L-1,-7" stroke="#d8c070" stroke-width="2" fill="none"/>`,
 sk_onigawara:`<path d="M-13,12 Q-14,-6 0,-14 Q14,-6 13,12Z" fill="#6a7080"/><path d="M-9,-6 L-12,-15 L-4,-10Z M9,-6 L12,-15 L4,-10Z" fill="#9aa0ac" stroke-width="1.3"/><ellipse cx="-4.6" cy="-1" rx="2.6" ry="2.2" fill="#fbf9f3" stroke-width="1.1"/><ellipse cx="4.6" cy="-1" rx="2.6" ry="2.2" fill="#fbf9f3" stroke-width="1.1"/><circle cx="-4.6" cy="-1" r="1" fill="${OL}" stroke="none"/><circle cx="4.6" cy="-1" r="1" fill="${OL}" stroke="none"/><path d="M-7,-5 L-2,-3 M7,-5 L2,-3" stroke="${OL}" stroke-width="1.6" fill="none"/><path d="M-6,5 Q0,9 6,5 L5,10 H-5Z" fill="#3a2e2a" stroke-width="1.2"/><path d="M-3.4,5.6 v3 M3.4,5.6 v3" stroke="#fbf9f3" stroke-width="1.6" fill="none"/>`});
/* 主帳號合併時改（使用者看選項圖選）：將棋→原木五角木牌 skWoodTile、印章→木頭線軸 skSpool、天守閣模型→灰色小石塔 skStoneTower（原本亮藍積木、藍白橡皮擦、彩色積木房子太現代） */
Object.assign(DECOY,{
 skPot:`<path d="M-14,-3 Q-14,12 0,12 Q14,12 14,-3Z" fill="#4a4a52"/><ellipse cx="0" cy="-3" rx="14" ry="4" fill="#2b2b30"/><rect x="-19.5" y="-5.4" width="6.4" height="4.4" rx="2" fill="#4a4a52" stroke-width="1.4"/><rect x="13.1" y="-5.4" width="6.4" height="4.4" rx="2" fill="#4a4a52" stroke-width="1.4"/><path d="M-8,1 Q-9,6 -6,9" fill="none" stroke="#8a8a96" stroke-width="1.4"/>`,
 skGoldGourd:`<rect x="-12" y="9" width="24" height="5" rx="1.6" fill="#8a5a32"/><rect x="-9" y="5" width="18" height="4.4" rx="1.2" fill="#c8362f"/><path d="M0,-19 Q6,-19 5,-12 Q4,-9 2,-8 Q11,-5 10,1 Q9,6 0,6 Q-9,6 -10,1 Q-11,-5 -2,-8 Q-4,-9 -5,-12 Q-6,-19 0,-19Z" fill="${gold}" stroke-width="1.3"/><path d="M-2,-8 Q0,-7 2,-8" fill="none" stroke="#c8961a" stroke-width="1"/><path d="M-1,-19 L0,-23 L2,-19" fill="none" stroke="#8a5a32" stroke-width="1.6"/><path d="M-6,-1 Q-5,-5 -2,-6" fill="none" stroke="#fff3b0" stroke-width="1.4"/>`, /* 主帳號合併時改：金色鯉魚躺在路上很怪 → 金色葫蘆擺飾（使用者選 A） */
 skBlankScroll:`<g transform="rotate(-18)"><rect x="-16" y="-5.4" width="32" height="10.8" rx="5.4" fill="#f4ecd8"/><rect x="-17" y="-7" width="5" height="14" rx="2.4" fill="#8a6a4a" stroke-width="1.4"/><rect x="12" y="-7" width="5" height="14" rx="2.4" fill="#8a6a4a" stroke-width="1.4"/><path d="M0,-5.4 V5.4" stroke="#d8413a" stroke-width="2.8"/></g>`,
 skWoodTile:`<path d="M0,-15 L10,-8 L12,12 H-12 L-10,-8Z" fill="#d9b98a"/><path d="M-7,-3 Q0,-1 7,-3 M-8,5 Q0,7 8,5" fill="none" stroke="#b8956a" stroke-width="1"/>`,
 skPlainPennant:`<path d="M-11,16 V-20" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M-11,16 V-20" fill="none" stroke="#c99a5b" stroke-width="2.2"/><circle cx="-11" cy="-21" r="2.2" fill="#f5c842" stroke-width="1.2"/><path d="M-9,-18 L14,-8 L-9,2Z" fill="#d8413a"/>`,
 skBlackKettle:`<path d="M-10,12 Q-12,-4 -7,-10 H7 Q12,-4 10,12Z" fill="#2f2f36"/><rect x="-4.4" y="-13.4" width="8.8" height="3.6" rx="1.6" fill="#2f2f36" stroke-width="1.2"/><path d="M-8,-9 Q0,-27 8,-9" fill="none" stroke-width="2.4"/><path d="M10,3 Q18,-1 19,-9 L15,-8 Q13,-2 9,-2Z" fill="#2f2f36" stroke-width="1.4"/><path d="M-5,-3 Q-6,3 -4,8" fill="none" stroke="#6a6a76" stroke-width="1.4"/>`,
 skStoneTower:`<rect x="-12" y="10" width="24" height="4.4" rx="1.4" fill="#9a988e"/><rect x="-7" y="2" width="14" height="8" fill="#b8b6ac"/><path d="M-13,2 Q0,-2 13,2 L11,-1 H-11Z" fill="#a8a69c"/><rect x="-5" y="-7" width="10" height="6" fill="#b8b6ac"/><path d="M-10,-7 Q0,-10 10,-7 L8,-9 H-8Z" fill="#a8a69c"/><path d="M-2.4,-9 H2.4 V-17 H-2.4Z" fill="#b8b6ac" stroke-width="1.2"/><circle cx="0" cy="-19" r="2.4" fill="#a8a69c" stroke-width="1.2"/>`,
 skSpool:`<rect x="-10" y="-18" width="20" height="5" rx="2" fill="#a8703a"/><rect x="-6" y="-13" width="12" height="22" fill="#c8362f"/><path d="M-6,-9 H6 M-6,-4 H6 M-6,1 H6 M-6,6 H6" stroke="#8a2420" stroke-width="1" fill="none"/><rect x="-10" y="9" width="20" height="5" rx="2" fill="#a8703a"/>`,
 skSakeBarrel:`<path d="M-12,-8 Q-14,3 -11,12 H11 Q14,3 12,-8Z" fill="#c99a5b"/><ellipse cx="0" cy="-8" rx="12" ry="4" fill="#d8413a"/><path d="M-13,-1 H13 M-12,7 H12" fill="none" stroke="#6a4a30" stroke-width="1.6"/><rect x="-5.4" y="0" width="10.8" height="9" rx="1" fill="#fbf9f3" stroke-width="1.1"/><path d="M-3,2.4 H3 M0,1.2 V7.6" stroke="${OL}" stroke-width="1.2" fill="none"/><path d="M-6,-12 Q0,-18 6,-12" fill="none" stroke="#b8905a" stroke-width="2.4"/>`,
 skSlate:`<rect x="-13" y="-11" width="26" height="23" rx="3" fill="#8a6a4a"/><rect x="-10.4" y="-8.4" width="20.8" height="17.8" rx="1.6" fill="#34383e" stroke-width="1.2"/><path d="M-6,-1 Q-2,-6 2,-1 T8,-1" fill="none" stroke="#e8e8e8" stroke-width="1.2"/><path d="M-6,5 H4" stroke="#e8e8e8" stroke-width="1.2" fill="none"/>`});
const dec=(id,s=.95)=>({w:28,h:28,fn:()=>T(0,-12,s,DECOY[id])});
Object.assign(KIND,{skPot:dec('skPot'),skGoldGourd:dec('skGoldGourd'),skBlankScroll:dec('skBlankScroll'),skWoodTile:dec('skWoodTile'),skPlainPennant:dec('skPlainPennant'),
 skBlackKettle:dec('skBlackKettle'),skStoneTower:dec('skStoneTower'),skSpool:dec('skSpool'),skSakeBarrel:dec('skSakeBarrel'),skSlate:dec('skSlate')});

/* 12 種 × 4 個。老朋友：御守、繪馬（第 8 關的）。 */
const RS={s:'sk9S',m:'sk9Mid',u:'sk9Up',t:'sk9Tenshu',w:'sk9W',e:'sk9E',st:'sk9Stair'};
const rg=(...a)=>a.map(k=>RS[k]);
const old=(id,regions)=>({...typeOf(id),regions});
const TYPES=[
 old('sk_omamori',rg('u','s','e','m')),old('sk_ema',rg('u','t','w','st')),
 {id:'sk_kabuto',name:'武士頭盔',short:'頭盔',r:14,rot:12,regions:rg('m','u','s','st')},
 {id:'sk_shachi',name:'金鯱',short:'金鯱',r:14,rot:10,regions:rg('t','u','m','e')},
 {id:'sk_kakejiku',name:'掛軸',short:'掛軸',r:14,rot:8,regions:rg('u','w','s','m')},
 {id:'sk_shogi',name:'將棋棋子',short:'將棋',r:14,rot:20,regions:rg('s','m','e','u')},
 {id:'sk_kamonflag',name:'家紋旗',short:'家紋旗',r:14,rot:8,regions:rg('m','e','st','w')},
 {id:'sk_chagama',name:'鐵茶釜',short:'茶釜',r:14,rot:10,regions:rg('u','t','s','w')},
 {id:'sk_tenshumodel',name:'天守閣模型',short:'天守模型',r:14,rot:8,regions:rg('s','st','m','e')},
 {id:'sk_inkan',name:'印章',short:'印章',r:14,rot:15,regions:rg('w','u','m','e')},
 {id:'sk_taiko',name:'陣太鼓',short:'太鼓',r:14,rot:12,regions:rg('m','s','st','t')},
 {id:'sk_onigawara',name:'鬼瓦',short:'鬼瓦',r:14,rot:10,regions:rg('t','u','e','st')}];
LEVELS[N].types=TYPES;

/* ================= 4. 區域 ================= */
Object.assign(REG,{
 sk9S:{x:640,y:1950,w:1220,h:370},sk9Mid:{x:640,y:1520,w:1220,h:440},sk9Up:{x:830,y:360,w:840,h:1000},sk9Tenshu:{x:880,y:1170,w:740,h:140} /* 主帳號合併時改：原本蓋到天守閣本體，物件會浮在城牆上 → 只留天守閣前的廣場 */,
 sk9W:{x:620,y:1520,w:300,h:860},sk9E:{x:1600,y:1520,w:300,h:860},sk9Stair:{x:1000,y:1340,w:500,h:300},sk9All:{x:620,y:1520,w:1260,h:860}});
H.SCREG[N]=['sk9S','sk9Mid','sk9Up','sk9Tenshu','sk9W','sk9E','sk9Stair','sk9All'];
WATERFN[N]=()=>false;
/* ================= 5. 幾何：位置檢查（座標是場景座標，往北＝y 變小） ================= */
const TEN={x:1250,y:1180,s:2.3},TENW=130;           // 天守閣腳底中心與縮放
const CL=820,CR=1680;            // 本丸兩側懸崖（主帳號合併時往內移，讓雲海寬一點）
const YAG=[[930,1260],[1570,1260]],STAGE={x:1250,y:1850,s:1.7},TEAH={x:960,y:760};
const okPos=(x,y)=>{
 if(y<1440&&(x<CL+20||x>CR-20))return false;                         // 懸崖外的雲海
 if(x>1120&&x<1380&&y>1280&&y<1600)return false;                  // 石階
 if(y>1360&&y<1530&&!(x>1120&&x<1380))return false;               // 石垣牆面
 if(x>1030&&x<1470&&y>730&&y<1200)return false;                   // 天守閣
 for(const [yx,yy] of YAG)if(Math.abs(x-yx)<80&&y>yy-120&&y<yy+10)return false;
 if(Math.abs(x-TEAH.x)<90&&y>TEAH.y-110&&y<TEAH.y+10)return false;  // 茶室
 if(x>1120&&x<1380&&y>1700&&y<1880)return false;                  // 舞台
 if(x>1130&&x<1370&&y>2230)return false;                          // 櫓門
 return true};
['sk9S','sk9Mid','sk9Up','sk9Tenshu','sk9W','sk9E','sk9Stair','sk9All'].forEach(k=>H.SCATOK[k]=okPos);

/* ================= 6. 地面：白砂廣場、石垣、本丸、雲海 ================= */
const cloudBlob=(x,y,s)=>`<g transform="translate(${f(x)},${f(y)}) scale(${f(s)})" fill="#fff" stroke="none"><circle cx="0" cy="0" r="22"/><circle cx="26" cy="-8" r="18"/><circle cx="-26" cy="4" r="16"/><circle cx="50" cy="4" r="13"/><circle cx="-48" cy="10" r="11"/><rect x="-50" y="2" width="104" height="14" rx="7"/></g>`;
/* 草地（主帳號合併時加，使用者：地面太空）：上段兩側、下段兩側是有石緣的草地，樹、草叢只長在草地上；白砂留給天守閣前和表演廣場 */
const onLawn=(x,y)=>(y>1540&&y<2390&&(x<905||x>1595))||(y>300&&y<1330&&((x>CL&&x<1020)||(x>1480&&x<CR)));
function lawnG(x0,y0,x1,y1,rx){let t=`<rect x="${x0}" y="${y0}" width="${x1-x0}" height="${y1-y0}" rx="${rx}" fill="#b6cf86" stroke="#9a9488" stroke-width="7"/><rect x="${x0}" y="${y0}" width="${x1-x0}" height="${y1-y0}" rx="${rx}" fill="none" stroke="#d2cdbf" stroke-width="3" stroke-dasharray="10 6"/>`;
 const n=Math.round((x1-x0)*(y1-y0)/9000);for(let i=0;i<n;i++)t+=`<ellipse cx="${f(sr(x0+20,x1-20))}" cy="${f(sr(y0+20,y1-20))}" rx="${f(sr(20,60))}" ry="${f(sr(8,18))}" fill="${pk(['#a8c478','#c2d896','#acc880'])}" stroke="none" opacity=".7"/>`;
 for(let i=0;i<n/3;i++){const x=sr(x0+24,x1-24),y=sr(y0+24,y1-24),c=pk(['#fbf6ea','#f7c4d3','#f5d76e']);for(let k=0;k<ri(3,5);k++)t+=`<circle cx="${f(x+sr(-7,7))}" cy="${f(y+sr(-4,4))}" r="2" fill="${c}" stroke="none"/>`}
 return t}
/* 石階（主帳號合併時改：原本 4 段 skStairs 疊起來像鋸齒 → 照第 6、8 關畫在地面層的筆直一整段，兩側石牆） */
const STB=1600,STT=1300;
function stairG(){const ST_='#cfc9b9',RS='#a9a597',ED='#9a9488',MOSS='#8fae6a',n=16,h=(STB-STT)/n,w=196,xc=1250;let t='';
 const wall=x=>`<path d="M${x-9},${STB} V${STT} H${x+9} V${STB}Z" fill="${ED}" stroke-width="1.6"/>`+Array.from({length:8},(_,i)=>`<path d="M${x-9},${f(STB-(i+.5)*37)} h18" fill="none" stroke-width="1"/>`).join('');
 t+=`<path d="M${xc-w/2-20},${STB+10} H${xc+w/2+20}" stroke="#000" stroke-opacity=".1" stroke-width="16" fill="none"/>`;
 t+=wall(xc-w/2-10)+wall(xc+w/2+10);
 for(let i=0;i<n;i++){const y=STB-i*h;
  t+=`<path d="M${xc-w/2},${f(y)} H${xc+w/2} V${f(y-h*.36)} H${xc-w/2}Z" fill="${RS}" stroke-width="1.3"/><path d="M${xc-w/2},${f(y-h*.36)} H${xc+w/2} V${f(y-h)} H${xc-w/2}Z" fill="${ST_}" stroke-width="1.3"/>`;
  if(r()<.3)t+=`<ellipse cx="${f(xc+(r()<.5?-1:1)*(w/2-8))}" cy="${f(y-h*.7)}" rx="6" ry="2.4" fill="${MOSS}" stroke="none"/>`}
 return t}
function ground(){
 const Sc=H.SCENES[N],X0=Sc.x0-420,WW=Sc.x1-Sc.x0+840,XR=X0+WW;let g='';
 /* 北邊（主帳號合併時加）：晴空 → 遠方山頂 → 一整片雲海，本丸北牆像浮在雲上 */
 g+=`<defs><linearGradient id="sk9Sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8dcf2"/><stop offset="1" stop-color="#e2f1f8"/></linearGradient></defs>`;
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="${640+420}" fill="url(#sk9Sky)" stroke="none"/>`;
 g+=`<path d="M${X0},150 L420,96 L560,128 L700,62 L830,118 L960,84 L1120,132 L1500,140 L1640,70 L1780,120 L1920,58 L2080,112 L${XR},92 V200 H${X0}Z" fill="#c4d6e4" stroke="none"/>`;
 g+=`<path d="M690,66 L700,62 L712,70 L704,74Z M1630,74 L1640,70 L1652,78 L1642,80Z M1910,62 L1920,58 L1932,66 L1922,69Z" fill="#fff" stroke="none"/>`;
 for(let i=0;i<30;i++)g+=`<g opacity="${f(sr(.75,1))}">${cloudBlob(sr(X0,XR),sr(150,215),sr(.6,1.2))}</g>`;
 /* 底色（下段一開始就是白砂，草地只在畫面外） */
 g+=`<rect x="${X0}" y="226" width="${WW}" height="${Sc.y1+200}" fill="#a9c47e" stroke="none"/>`;
 /* 上段兩側：懸崖外的雲海（淡藍底＋一層層白雲） */
 for(const [a,b] of [[X0,CL],[CR,XR]]){
  g+=`<rect x="${a}" y="200" width="${b-a}" height="1240" fill="#d6ecf7" stroke="none"/>`;
  for(let i=0;i<46;i++)g+=`<g opacity="${f(sr(.8,1))}">${cloudBlob(sr(a-30,b+10),sr(240,1430),sr(.6,1.5))}</g>`;
 }
 /* 上段本丸：白砂＋耙痕；北牆（矮矮的石牆＋白土塀） */
 g+=`<rect x="${CL}" y="226" width="${CR-CL}" height="1214" fill="#ece4cf"/><rect x="${CL-11}" y="196" width="${CR-CL+22}" height="34" rx="6" fill="#a9a79c"/><rect x="${CL-11}" y="196" width="${CR-CL+22}" height="12" rx="6" fill="#c9c5b8"/>`;for(let x=CL+20;x<CR;x+=sr(48,70))g+=`<path d="M${f(x)},208 v22" stroke="#7d7a70" stroke-width="1.4" fill="none"/>`;
 for(let k=0;k<33;k++){const y=262+k*36;g+=`<path d="M${CL+10},${y} Q900,${y-7} 1020,${y} T1260,${y} T1500,${y} T${CR-10},${y}" fill="none" stroke="#d6cdb4" stroke-width="1.4"/>`}
 /* 崖邊石垣（直直往下切進雲海） */
 g+=`<path d="M${CL},214 V1440 M${CR},214 V1440" stroke="#a9a79c" stroke-width="22" fill="none"/><path d="M${CL},214 V1440 M${CR},214 V1440" stroke="#d6d2c4" stroke-width="10" fill="none" stroke-dasharray="14 12"/>`;
 /* 幾縷雲飄過崖邊（只蓋到崖外和石垣，不蓋到本丸地面） */
 for(let i=0;i<9;i++){const y=sr(300,1380);g+=`<g opacity=".9">${cloudBlob(CL-sr(40,70),y,sr(.45,.65))}</g><g opacity=".9">${cloudBlob(CR+sr(40,70),sr(300,1380),sr(.45,.65))}</g>`}
 g+=lawnG(CL+12,300,1020,1330,36)+lawnG(1480,300,CR-12,1330,36);
 /* 往茶室的踏腳石 */
 for(const [x,y] of [[1040,868],[1014,846],[992,822],[1006,796]])g+=`<ellipse cx="${x}" cy="${y}" rx="13" ry="7" fill="#c9c5b8" stroke-width="1.4"/>`;
 g+=`<path d="M1250,1440 V1200" stroke="#d6d0bc" stroke-width="150" fill="none"/>`;
 /* 石垣（中段）：整排石塊，中央留石階的缺口；牆下有影子，看得出上段比較高 */
 const wall=(x1,x2)=>{let w=`<rect x="${x1}" y="1380" width="${x2-x1}" height="132" fill="#a9a79c"/><rect x="${x1}" y="1368" width="${x2-x1}" height="16" fill="#c9c5b8"/>`;
  for(let row=0;row<4;row++){const y=1396+row*29;w+=`<path d="M${x1},${y} H${x2}" stroke="#7d7a70" stroke-width="1.6" fill="none"/>`;
   for(let x=x1+((row%2)?40:10);x<x2;x+=sr(56,84))w+=`<path d="M${f(x)},${y} v29" stroke="#7d7a70" stroke-width="1.4" fill="none"/>`}
  for(let i=0;i<4;i++){const x=sr(x1+40,x2-40);w+=`<path d="M${f(x)},1386 q-6,14 -2,26" fill="none" stroke="#6f9a4a" stroke-width="3"/>`}
  return w};
 /* 下段：白砂表演廣場＋圓形表演場 */
 g+=`<rect x="${X0}" y="1512" width="${WW}" height="${Sc.y1-1512+420}" fill="#efe6d0"/>`;
 for(let k=0;k<26;k++){const y=1540+k*34;g+=`<path d="M${X0+20},${y} Q760,${y-8} 900,${y} T1180,${y} T1460,${y} T1740,${y} T${XR-20},${y}" fill="none" stroke="#dccfae" stroke-width="1.4"/>`}
 g+=lawnG(X0,1540,905,2390,40)+lawnG(1595,1540,XR,2390,40);
 /* 石階下到表演場的石板路 */
 g+=`<path d="M1250,1600 V1690" stroke="#c9c5b8" stroke-width="112" fill="none"/>`;for(let y=1606;y<1690;y+=17)g+=`<path d="M1196,${y} H1304" stroke="#a9a79c" stroke-width="1.4" fill="none"/>`;
 g+=wall(X0,1140)+wall(1360,XR);
 g+=`<path d="M${X0},1524 H1140 M1360,1524 H${XR}" stroke="#000" stroke-opacity=".12" stroke-width="22" fill="none"/>`;
 g+=`<ellipse cx="1250" cy="1830" rx="360" ry="150" fill="#f6eed8" stroke="#d6c79c" stroke-width="3"/><ellipse cx="1250" cy="1830" rx="330" ry="132" fill="none" stroke="#d6c79c" stroke-width="1.6" stroke-dasharray="6 10"/>`;
 g+=`<path d="M1250,2400 V2120" stroke="#d6c79c" stroke-width="86" fill="none"/><path d="M1250,2400 V2120" stroke="#e8dcb8" stroke-width="78" fill="none" stroke-dasharray="2 24"/>`;
 g+=stairG();
 return `<g stroke="${OL}" stroke-width="2" stroke-linejoin="round">${g}</g>`}

/* ================= 7. 佈景圖鑑 ================= */
const ST='#a9a79c',WALL='#f6f1e4',ROOF='#454a5a';
const sk=(fill,sw=1.6)=>`fill="${fill}" stroke="${OL}" stroke-width="${sw}" stroke-linejoin="round"`;
const tenshuSvg=(w=TENW,base=34)=>{
 let g=`<ellipse cx="0" cy="3" rx="${w*.62}" ry="8" fill="#000" opacity=".16" stroke="none"/>`;const bw=w+34;
 g+=`<path d="M${-bw/2},0 L${-w/2-4},${-base} H${w/2+4} L${bw/2},0Z" ${sk(ST)}/>`;
 for(let i=1;i<4;i++)g+=`<path d="M${-bw/2+i*3},${-i*base/4} H${bw/2-i*3}" fill="none" stroke="#7d7a70" stroke-width="1"/>`;
 for(let i=-4;i<=4;i++)g+=`<path d="M${i*bw/9},${-base/2} v${-base/2}" fill="none" stroke="#7d7a70" stroke-width=".8"/>`;
 let y=-base;
 [[w,34],[w*.78,30],[w*.56,26]].forEach(([tw,th])=>{
  g+=`<rect x="${-tw/2}" y="${y-th}" width="${tw}" height="${th}" ${sk(WALL)}/>`;
  const n=Math.max(2,Math.round(tw/36));
  for(let i=0;i<n;i++){const x=-tw/2+(i+.5)*tw/n;g+=`<rect x="${x-4.5}" y="${y-th+9}" width="9" height="11" rx="1" ${sk('#5a4636',1.2)}/>`}
  g+=`<path d="M${-tw/2-12},${y-th+4} Q${-tw/2+4},${y-th-12} ${-tw*.3},${y-th-14} H${tw*.3} Q${tw/2-4},${y-th-12} ${tw/2+12},${y-th+4} Q0,${y-th+10} ${-tw/2-12},${y-th+4}Z" ${sk(ROOF)}/>`;
  y=y-th-6});
 const tw=w*.44;
 g+=`<path d="M${-tw/2-6},${y+2} L0,${y-30} L${tw/2+6},${y+2} Q0,${y+8} ${-tw/2-6},${y+2}Z" ${sk(ROOF)}/>`;
 /* 金鯱（主帳號合併時改，使用者看選項圖選 I：粗壯實心魚身、肚子淡黃、頭朝外、尾巴翹起來） */
 const SHFISH=`<path d="M-8,-2 Q-17,-13 -11,-26 Q-7,-33 0,-35 L5,-31 Q-2,-27 -2,-19 Q-2,-11 6,-7Z" fill="${gold}" stroke="${OL}" stroke-width="1.3"/><path d="M4,-30 Q-1,-26 -1,-19 Q-1,-12 5,-8 L2,-7 Q-4,-12 -4,-19 Q-4,-26 1,-31Z" fill="#fbe7a0" stroke="none"/><path d="M-1,-33 Q-9,-41 -4,-47 Q1,-41 3,-37 Q8,-45 15,-43 Q11,-35 5,-31Z" fill="${gold}" stroke="${OL}" stroke-width="1.3"/><path d="M-14,-10 Q-22,-14 -19,-22 Q-15,-19 -12,-18Z" fill="${gold}" stroke="${OL}" stroke-width="1.1"/><path d="M-9,-14 q3,2 5,0 M-8,-20 q3,2 5,0 M-5,-26 q3,2 4,0" fill="none" stroke="#c8961a" stroke-width="1.1"/><path d="M-11,2 Q-14,-9 -2,-10 Q9,-11 13,-4 Q15,0 11,2 Q2,6 -6,5Z" fill="${gold}" stroke="${OL}" stroke-width="1.3"/><path d="M-3,-8 Q-6,-3 -3,3" fill="none" stroke="#c8961a" stroke-width="1.2"/><circle cx="5" cy="-5" r="2.6" fill="#fff" stroke="${OL}" stroke-width=".9"/><circle cx="5.6" cy="-5" r="1.3" fill="${OL}"/><path d="M9,0 q2,1 4,-1" fill="none" stroke="${OL}" stroke-width="1"/><path d="M-13,-17 Q-12,-25 -6,-30" fill="none" stroke="#fff3b0" stroke-width="1.6" stroke-linecap="round"/>`;
 const sh=s=>`<g transform="translate(${s*(tw/2+2)},${y-4}) scale(${s},1)">${SHFISH}</g>`;
 return g+sh(-1)+sh(1)};
const SHACHI=(()=>{const tw=TENW*.44,top=-(34+(34+6)+(30+6)+(26+6))-4;return {dx:(tw/2+1)*TEN.s,dy:(top-20)*TEN.s}})();
const yaguraSvg=(w=62,h=44)=>`<ellipse cx="0" cy="3" rx="${w*.7}" ry="6" fill="#000" opacity=".16" stroke="none"/><path d="M${-w/2-8},0 L${-w/2},-14 H${w/2} L${w/2+8},0Z" ${sk(ST)}/><rect x="${-w/2}" y="${-14-h*.55}" width="${w}" height="${h*.55}" ${sk(WALL)}/><rect x="-5" y="${-14-h*.4}" width="10" height="10" ${sk('#5a4636',1.2)}/><path d="M${-w/2-10},${-14-h*.55+4} Q${-w/4},${-14-h*.55-12} 0,${-14-h*.55-14} Q${w/4},${-14-h*.55-12} ${w/2+10},${-14-h*.55+4} Q0,${-14-h*.55+9} ${-w/2-10},${-14-h*.55+4}Z" ${sk(ROOF)}/>`;
const gateSvg=(w=96)=>`<ellipse cx="0" cy="3" rx="${w*.62}" ry="7" fill="#000" opacity=".16" stroke="none"/><path d="M${-w/2-6},0 L${-w/2},-26 H${w/2} L${w/2+6},0Z" ${sk(ST)}/><path d="M-15,0 V-20 Q0,-34 15,-20 V0Z" ${sk('#5a3a2a')}/><path d="M-5,0 V-26 M5,0 V-26" stroke="#c9a26a" stroke-width="1.4" fill="none"/><rect x="${-w/2+4}" y="-50" width="${w-8}" height="24" ${sk(WALL)}/>`+
 [0,1,2,3].map(i=>`<rect x="${-w/2+14+i*((w-28)/3.2)}" y="-44" width="8" height="9" ${sk('#5a4636',1.2)}/>`).join('')+`<path d="M${-w/2-10},-46 Q${-w/4},-62 0,-64 Q${w/4},-62 ${w/2+10},-46 Q0,-40 ${-w/2-10},-46Z" ${sk(ROOF)}/>`;
const stageSvg=()=>`<ellipse cx="0" cy="3" rx="64" ry="10" fill="#000" opacity=".16" stroke="none"/><rect x="-56" y="-14" width="112" height="14" rx="3" ${sk('#b98b5a')}/><path d="M-56,-8 H56" stroke="#8a6a4a" stroke-width="1.4" fill="none"/><path d="M-46,-14 V-70 M46,-14 V-70" stroke="#8a6a4a" stroke-width="4.4" fill="none"/><path d="M-46,-62 H46" stroke="#8a6a4a" stroke-width="4" fill="none"/><path d="M-36,-14 L-26,-34 M36,-14 L26,-34" stroke="#6a4a30" stroke-width="4" fill="none"/><path d="M-28,-30 Q-32,-8 -24,-4 H24 Q32,-8 28,-30Z" ${sk('#a8552f')}/><ellipse cx="0" cy="-30" rx="28" ry="9" ${sk('#f0d9a8',1.6)}/><g fill="${gold}" stroke-width="1"><circle cx="-24" cy="-14" r="2.2"/><circle cx="-12" cy="-9" r="2.2"/><circle cx="0" cy="-8" r="2.2"/><circle cx="12" cy="-9" r="2.2"/><circle cx="24" cy="-14" r="2.2"/></g><path d="M-3,-60 L-14,-40 M3,-60 L14,-40" stroke="#d8c070" stroke-width="2.4" fill="none"/>`;
const noboriSvg=()=>`<path d="M0,2 V-80" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M0,2 V-80" fill="none" stroke="#8a6a4a" stroke-width="2.2"/><circle cx="0" cy="-82" r="3" fill="${gold}" stroke-width="1.2"/><path d="M2,-76 H26 V-24 H2Z" ${sk('#2f4a7a',1.6)}/><path d="M14,-76 V-24" stroke="#fbf9f3" stroke-width="5" fill="none"/><path d="M2,-76 H26" stroke="#fbf9f3" stroke-width="2" fill="none"/>`;
const teahouseSvg=()=>`<ellipse cx="0" cy="3" rx="52" ry="7" fill="#000" opacity=".16" stroke="none"/><rect x="-40" y="-30" width="80" height="30" ${sk('#d9c6a0')}/><rect x="-28" y="-24" width="30" height="24" ${sk('#fbf6ea',1.2)}/><path d="M-13,-24 V0 M-28,-12 H2" stroke="#b8a070" stroke-width="1.2" fill="none"/><rect x="10" y="-22" width="22" height="22" ${sk('#5a3a2a',1.4)}/><path d="M-50,-28 L-30,-56 H30 L50,-28 Q0,-20 -50,-28Z" ${sk(ROOF)}/><path d="M-44,-14 q4,8 0,14 M44,-14 q-4,8 0,14" stroke="#c8362f" stroke-width="3" fill="none"/>`;
const bokken=`<path d="M9,-6 L25,-46" fill="none" stroke="${OL}" stroke-width="4.6"/><path d="M9,-6 L25,-46" fill="none" stroke="#e0c898" stroke-width="2.4"/>`;
/* 武士的樣子（主帳號合併時改：原本斗笠＋條紋背心像農夫 → 髮髻＋白頭巾＋和服羽織、袴；不戴頭盔，免得玩家以為要找頭盔） */
const knot=`<ellipse cx="0" cy="-60" rx="4" ry="2.6" fill="#2f2622" stroke-width="1.2"/><path d="M-13,-47 Q0,-51 13,-47" fill="none" stroke="#fbf9f3" stroke-width="3.2"/><path d="M12,-47 l5,3 M12,-47 l4,-2" stroke="#fbf9f3" stroke-width="2" fill="none"/>`;
const samO=(c1,c2,o={})=>({top:'kimono',bottom:'kimono',kim:'C',shirt:c2,obi:'#e8c070',pat:c1,hat:-1,hair:'#2f2622',hs:1,...o,extra:knot+(o.extra||'')});
const swordUp=`<path d="M19,-25 L34,-58" fill="none" stroke="${OL}" stroke-width="4.6"/><path d="M19,-25 L34,-58" fill="none" stroke="#e0c898" stroke-width="2.4"/>`;
const samurai=(c1,c2,dir=1)=>`<ellipse cx="0" cy="2" rx="18" ry="5" fill="#000" opacity=".16" stroke="none"/>`+act(0,0,dir,{view:'fq',pose:'hold',mood:1,...samO(c1,c2,{extra:bokken})});
KIND.skSamurai={w:46,h:70,fn:()=>samurai(pk(['#b04a3a','#3e5e8a','#5f7a6a','#8a6aa8']),pk(['#3e4a6a','#7a2f2a','#5a6a4a']))};
Object.assign(KIND,{skTenshu:{w:170,h:190,fn:()=>tenshuSvg()},skYagura:{w:72,h:60,fn:()=>yaguraSvg()},skGate:{w:104,h:70,fn:()=>gateSvg()},skStage:{w:120,h:80,fn:stageSvg},
 skNobori:{w:30,h:84,fn:noboriSvg},skTeahouse:{w:100,h:60,fn:teahouseSvg}});
Object.assign(HOSTN,{pine:'松樹'});
ALWAYSX[N]=new Set([]);
HEAVYX[N]=new Set(['skTenshu','skYagura','skGate','skStage','skTeahouse']);

/* ================= 8. 撒佈景 ================= */
const SC9=[['skSakura',.3],['skSakuraHalf',.15],['skLanternDim',.08],['skNobori',.1]]; /* 主帳號合併時改：白砂廣場不長草，石燈籠少一點，表演廣場留空 */
Object.assign(POOL,{
 sk9S:[...SC9,['skPouch',.12],['skPot',.15],['skGoldGourd',.15],['skBlankScroll',.15],['skWoodTile',.15],['skPlainPennant',.12]],
 sk9Mid:[...SC9,['skBlankPlank',.12],['skBlackKettle',.15],['skStoneTower',.15],['skSpool',.15],['skSakeBarrel',.15],['skSlate',.12]],
 sk9Up:[['pine',.8],['grassClump',.7],['bush',.4],['skLantern',.4],['skSakura',.8],['skSakuraHalf',.4],['skPouch',.1],['skBlankPlank',.1],['skPot',.15],['skBlankScroll',.15],['skSlate',.15],['skSpool',.15],['skStoneTower',.12]],
 sk9Tenshu:[['pine',.5],['skLanternDim',.4],['skWoodTile',.15],['skSakeBarrel',.15],['skPlainPennant',.15],['skBlackKettle',.12]],
 sk9W:[...SC9,['pine',.6],['grassClump',1],['bush',.5],['skStoneTower',.15],['skSlate',.15],['skPot',.12]],
 sk9E:[...SC9,['pine',.6],['grassClump',1],['bush',.5],['skSpool',.15],['skBlackKettle',.15],['skGoldGourd',.12]],
 sk9Stair:[...SC9,['skPlainPennant',.15],['skSakeBarrel',.12]],
 sk9All:[['skSakura',.5]]});
/* 主帳號合併時改（使用者：人數多一倍）：路人約 2.5 倍＋多 6 組人群，總人數約 2 倍 */
Object.assign(VPLAN,{sk9S:{walker:5,chat:2,carryBox:1},sk9Mid:{walker:5,chat:2,flowerWatch:1},sk9Up:{walker:3,chat:2,flowerWatch:1,reading:1},
 sk9Tenshu:{chat:2,walker:2},sk9W:{walker:2,chat:2},sk9E:{walker:2,chat:2},sk9Stair:{walker:2,chat:1}});

/* ================= 8b. 人群小故事（主帳號合併時加，使用者選：殺陣對打＋觀眾、小朋友武士體驗、揮大旗、和武士合照、崖邊看雲海）
   每組點了會說一句話（festTap9，接在 TAPHOOKS[N] 最前面） ================= */
const sh9=(w,o=.14)=>`<ellipse cx="3" cy="2" rx="${w}" ry="6" fill="#000" opacity="${o}" stroke="none"/>`;
const kimo9=(o={})=>({top:'kimono',bottom:'kimono',kim:'C',hat:-1,...o});
/* 殺陣：兩個武士揮木刀對打，木刀在中間交叉，冒出小火花 */
const tateG=()=>{let t=sh9(44,.14);
 t+=act(-24,0,1,{view:'side',pose:'up2',...samO('#3e4a6a','#7a2f2a',{extra:swordUp})},'work');
 t+=act(26,0,-1,{view:'side',pose:'up2',...samO('#5a6a4a','#3e4a6a',{extra:swordUp})},'work');
 t+=`<path d="M2,-62 l2,-6 l2,6 l6,2 l-6,2 l-2,6 l-2,-6 l-6,-2Z" fill="#fff3b0" stroke="${gold}" stroke-width="1"/>`;
 return t};
/* 觀眾：圍成半圈拍手（背影，面向殺陣） */
const fansG=()=>{let t=sh9(70,.1);
 [[-54,0,{...kimo9({kim:'A',shirt:'#c8645a',pat:'#fde4ec'})}],[-18,4,{top:'long',bottom:'pants',shirt:'#7a9ac8',hat:-1}],[18,4,{...kimo9({kim:'B',shirt:'#e8eef6',pat:'#3b5a8a'})}],[54,0,{...kimo9({kim:'C',shirt:'#5f7a6a'})}]]
  .forEach(([x,y,o],i)=>{t+=act(x,y,1,{view:i%2?'back':'bq',pose:i===1?'up2':'reach',...o},i===1?'cheer':'nod')});
 t+=act(-36,10,1,{view:'back',pose:'up2',s:.8,top:'long',bottom:'shorts',shirt:'#e8c86a',hat:-1},'hop');
 return t};
/* 小朋友武士體驗：小孩綁頭巾拿紙刀，武士假裝被打敗往後倒；媽媽在旁邊拍照 */
const paperSword=`<path d="M11,-17 L26,-40" fill="none" stroke="${OL}" stroke-width="3.6"/><path d="M11,-17 L26,-40" fill="none" stroke="#fbf6ea" stroke-width="1.8"/>`;
const kidSamG=()=>{let t=sh9(40,.12);
 t+=act(-20,0,1,{view:'side',pose:'hold',s:.8,top:'kimono',bottom:'kimono',kim:'B',shirt:'#6a8ac8',pat:'#fbf6ea',obi:'#d8413a',hat:-1,extra:`<path d="M-13,-47 Q0,-51 13,-47" fill="none" stroke="#d8413a" stroke-width="3.2"/>`+paperSword},'hop');
 t+=`<g transform="translate(22,0) rotate(14)">${act(0,0,-1,{view:'side',pose:'up2',mood:1,...samO('#7a2f2a','#3e4a6a')},'nod')}</g>`;
 t+=`<path d="M8,-58 q-3,-6 1,-9 M14,-62 q0,-6 4,-7" fill="none" stroke="${OL}" stroke-width="1.4"/>`;
 return t};
const momCamG=()=>sh9(16,.12)+act(0,0,1,{view:'side',pose:'hold',...kimo9({kim:'A',shirt:'#8a6aa8',pat:'#fde4ec'}),extra:`<rect x="10" y="-30" width="9" height="12" rx="2" fill="#2b2420" stroke-width="1"/>`},'nod');
/* 揮大旗的旗手：長旗桿＋大紅白條紋旗，跟著節奏左右擺（不畫家紋，免得像要找的家紋旗） */
const bigFlagG=c=>sh9(18,.12)+act(0,0,1,{view:'fq',pose:'up2',...samO(c,'#3e4a6a',{extra:`<path d="M19,-24 L22,-120" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M19,-24 L22,-120" fill="none" stroke="#8a6a4a" stroke-width="2.2"/><path d="M22,-118 Q44,-124 62,-114 Q60,-96 64,-78 Q44,-86 22,-80Z" fill="#d8413a" stroke-width="1.8"/><path d="M22,-105 Q42,-110 62,-101 M22,-92 Q42,-97 63,-89" fill="none" stroke="#fbf6ea" stroke-width="4"/>`})},'groove');
/* 和武士合照：武士舉刀擺帥氣姿勢，觀光客比耶，朋友蹲著拍 */
const photoG=()=>{let t=sh9(30,.12);
 t+=act(-14,0,1,{view:'fq',pose:'up2',mood:2,...samO('#3e4a6a','#7a2f2a',{extra:swordUp})},'nod');
 t+=act(18,2,1,{view:'fq',pose:'up',...kimo9({kim:'A',shirt:'#f4b6c2',pat:'#fff'}),mood:2},'cheer');
 return t};
const shooterG=()=>sh9(16,.12)+act(0,0,1,{view:'bq',pose:'hold',top:'long',bottom:'pants',shirt:'#3e5e8a',hat:-1,extra:`<rect x="10" y="-30" width="9" height="12" rx="2" fill="#2b2420" stroke-width="1"/>`},'nod');
/* 崖邊看雲海：爸爸指著雲海，小孩踮腳，媽媽在旁邊（側面，面向崖外） */
const cloudViewG=()=>{let t=sh9(36,.12);
 t+=act(-20,0,1,{view:'side',pose:'up',top:'long',bottom:'pants',shirt:'#5f7a6a',hat:-1},'nod');
 t+=act(4,2,1,{view:'side',pose:'up2',s:.78,top:'long',bottom:'shorts',shirt:'#e8c86a',hat:-1},'hop');
 t+=act(26,0,1,{view:'bq',pose:'stand',...kimo9({kim:'B',shirt:'#e8eef6',pat:'#3b5a8a'})},'lean');
 return t};
/* 舞台上的太鼓手（背對觀眾、雙手舉鼓棒） */
const drummerG=()=>act(0,0,1,{view:'back',pose:'up2',...samO('#7a2f2a','#fbf6ea',{extra:`<path d="M19,-27 L28,-44 M-19,-27 L-28,-44" stroke="${OL}" stroke-width="3.4" fill="none"/><path d="M19,-27 L28,-44 M-19,-27 L-28,-44" stroke="#d8c070" stroke-width="1.6" fill="none"/>`})},'groove');
const coupleG=()=>sh9(22,.12)+act(-10,0,1,{view:'bq',pose:'stand',...kimo9({kim:'A',shirt:'#c8645a',pat:'#fde4ec'})},'lean')+act(12,0,1,{view:'side',pose:'up',top:'coat',bottom:'pants',shirt:'#3e4a6a',hat:-1},'nod');
Object.assign(KIND,{skTate9:{w:110,h:90,fn:tateG},skFans9:{w:150,h:70,fn:fansG},skKidSam9:{w:90,h:70,fn:kidSamG},skMomCam9:{w:34,h:62,fn:momCamG},
 skBigFlag9:{w:80,h:130,fn:()=>bigFlagG('#7a2f2a')},skPhoto9:{w:64,h:80,fn:photoG},skShooter9:{w:34,h:62,fn:shooterG},skCloudView9:{w:80,h:62,fn:cloudViewG},skCouple9:{w:50,h:62,fn:coupleG},skDrummer9:{w:40,h:70,fn:drummerG}});
['skTate9','skFans9','skBigFlag9'].forEach(k=>HEAVYX[N].add(k));
const FEST9={};
function groups9(){
 add(1250,1806,40,70,'skDrummer9',drummerG(),{s:1.2,mark:false});FEST9.drum={x:1250,y:1806};
 add(1010,1790,140,100,'skTate9',tateG(),{s:1.15});FEST9.tate={x:1010,y:1790};
 add(1010,1880,170,80,'skFans9',fansG(),{s:1.05});FEST9.fans={x:1010,y:1880};
 add(1480,1800,110,80,'skKidSam9',kidSamG(),{s:1.15});FEST9.kid={x:1480,y:1800};
 add(1560,1870,34,62,'skMomCam9',momCamG(),{s:1.1,fl:true});FEST9.mom={x:1560,y:1870};
 add(860,1990,80,140,'skBigFlag9',bigFlagG('#7a2f2a'),{s:1.1});FEST9.flagW={x:860,y:1990};
 add(1610,1990,80,140,'skBigFlag9',bigFlagG('#3e4a6a'),{s:1.1,fl:true});FEST9.flagE={x:1610,y:1990};
 add(1360,2140,70,90,'skPhoto9',photoG(),{s:1.1});FEST9.photo={x:1360,y:2140};
 add(1440,2190,34,62,'skShooter9',shooterG(),{s:1.1,fl:true});FEST9.shoot={x:1440,y:2190};
 add(890,1100,90,70,'skCloudView9',cloudViewG(),{s:1.1,fl:true});FEST9.cloudW={x:890,y:1100};
 add(1610,500,56,70,'skCouple9',coupleG(),{s:1.1});FEST9.cloudE={x:1610,y:500};
 /* 人數加倍（使用者）：表演場南邊再兩群觀眾、天守閣前一組合照、兩側草地多一組看雲海 */
 add(1250,1990,170,80,'skFans9',fansG(),{s:1.05});FEST9.fans2={x:1250,y:1990};
 add(1500,1915,170,80,'skFans9',fansG(),{s:1.05});FEST9.fans3={x:1500,y:1915};
 add(1190,1150,70,90,'skPhoto9',photoG(),{s:1.1});FEST9.photo2={x:1190,y:1150};
 add(1270,1170,34,62,'skShooter9',shooterG(),{s:1.1,fl:true});FEST9.shoot2={x:1270,y:1170};
 add(1600,1180,90,70,'skCloudView9',cloudViewG(),{s:1.1});FEST9.cloudE2={x:1600,y:1180};
 add(900,480,56,70,'skCouple9',coupleG(),{s:1.1,fl:true});FEST9.cloudW2={x:900,y:480};
}
const near9=(o,x,y,w,h)=>o&&Math.abs(x-o.x)<w&&y<o.y+12&&y>o.y-h;let festT9=0;
const festTap9=(x,y)=>{const t=performance.now(),say=(m,d=2800)=>{if(t-festT9>700){festT9=t;H.toast(m,d)}return true};
 if(near9(FEST9.tate,x,y,80,110)){if(t-festT9>700)try{tone(660,.05,'square',.04);setTimeout(()=>tone(520,.05,'square',.04),140)}catch(_){}return say('喀！喀！殺陣表演：兩位武士你來我往，木刀碰出聲音。')}
 if(near9(FEST9.drum,x,y,40,100)){if(t-festT9>700)try{[0,1,2].forEach(i=>setTimeout(()=>tone(i===2?98:130,.16,'sine',.09),i*170))}catch(_){}return say('咚！咚！咚咚！陣太鼓一響，殺陣表演就開始了！')}
 if(near9(FEST9.fans,x,y,90,80)||near9(FEST9.fans2,x,y,90,80)||near9(FEST9.fans3,x,y,90,80))return say('觀眾：好帥！再來一次～（啪啪啪）');
 if(near9(FEST9.kid,x,y,60,90))return say('小朋友：看招！\n武士：哇～被打敗了⋯（假裝倒下）');
 if(near9(FEST9.mom,x,y,24,70))return say('媽媽：好棒！再擺一次姿勢，媽媽幫你拍！');
 if(near9(FEST9.flagW,x,y,50,150)||near9(FEST9.flagE,x,y,50,150))return say('旗手：嘿咻！嘿咻！大旗跟著太鼓的節奏左右揮。');
 if(near9(FEST9.photo,x,y,44,96)||near9(FEST9.shoot,x,y,24,70)||near9(FEST9.photo2,x,y,44,96)||near9(FEST9.shoot2,x,y,24,70))return say('來，看這邊～武士先生的姿勢好帥，一、二、三！');
 if(near9(FEST9.cloudW,x,y,56,80)||near9(FEST9.cloudE2,x,y,56,80))return say('爸爸：你看！我們站在雲的上面耶！\n小孩：我也要看！');
 if(near9(FEST9.cloudE,x,y,36,80)||near9(FEST9.cloudW2,x,y,36,80))return say('好漂亮的雲海⋯好像整座城浮在天上。');
 return false};

/* ================= 8c. 放東西的地方（主帳號合併時加，使用者看選項圖選：木頭屋台車、三層紅布階梯台、刀架＋小旗架、甲冑（沒有頭盔））
   物件和干擾物大多擺在台子上（SPOTS 用函式算台面位置），白砂上散落的東西變少，不像垃圾 ================= */
const SK9=1.4;
const yatai9=()=>`<g transform="scale(${SK9})"><ellipse cx="0" cy="3" rx="58" ry="7" fill="#000" opacity=".15" stroke="none"/><rect x="-50" y="-34" width="100" height="26" rx="2" fill="#b98b5a"/><path d="M-50,-26 H50 M-50,-18 H50" stroke="#8a6a4a" stroke-width="1.2"/><circle cx="-34" cy="-4" r="9" fill="#6a4a30"/><circle cx="34" cy="-4" r="9" fill="#6a4a30"/><circle cx="-34" cy="-4" r="2.6" fill="#c99a5b"/><circle cx="34" cy="-4" r="2.6" fill="#c99a5b"/><rect x="-52" y="-38" width="104" height="5" fill="#d8413a"/><path d="M-46,-38 V-70 M46,-38 V-70" stroke="#6a4a30" stroke-width="3.4"/><path d="M-62,-66 Q0,-86 62,-66 L58,-60 Q0,-76 -58,-60Z" fill="#454a5a"/>`+
 /* 檯面上的商品（使用者：攤車上要擺東西；避開這關要找的東西）：點心禮盒堆、一籃蜜柑、金平糖罐、疊好的手巾，中間留空位 */
 `<g stroke-width="1.2"><rect x="-48" y="-46" width="14" height="8" fill="#fbf6ea"/><path d="M-41,-46 V-38" stroke="#d8413a" stroke-width="2"/><rect x="-46" y="-53" width="11" height="7" fill="#d8413a"/><path d="M-40.5,-53 V-46" stroke="#fbf6ea" stroke-width="1.6"/>`+
 `<path d="M-30,-38 L-28,-45 H-16 L-14,-38Z" fill="#c99a5b"/><g fill="#f0a030"><circle cx="-26" cy="-47" r="3"/><circle cx="-20" cy="-47" r="3"/><circle cx="-23" cy="-51" r="3"/></g>`+
 `<rect x="22" y="-48" width="9" height="10" rx="2" fill="#e8f4f8"/><g fill="#f7c4d3" stroke="none"><circle cx="25" cy="-42" r="1.4"/><circle cx="28" cy="-44" r="1.4"/></g><g fill="#f5d76e" stroke="none"><circle cx="27" cy="-41" r="1.3"/></g><rect x="21" y="-50" width="11" height="3" rx="1" fill="#c8362f"/>`+
 `<rect x="34" y="-41" width="14" height="3.2" fill="#3e5e8a"/><rect x="34" y="-44.2" width="14" height="3.2" fill="#fbf6ea"/><rect x="34" y="-47.4" width="14" height="3.2" fill="#c8645a"/></g></g>`;
/* 三層紅布階梯台＝五月人形的雛壇（使用者選 A：後面素面金屏風、上層兩側小燈籠、下層菖蒲盆；頭盔、太鼓是要找的東西，不當固定擺設） */
const steps9=()=>{let t='';for(let i=0;i<6;i++){const x=-42+i*14;t+=`<path d="M${x},-36 V-78 H${x+14} V-36Z" fill="${i%2?'#f0c850':'#e6b83c'}" stroke-width="1.4"/>`}
 t+=`<path d="M-42,-78 H42" stroke="#8a5a32" stroke-width="3"/>`;
 const bon=x=>`<g transform="translate(${x},-36)"><path d="M0,0 V-12" stroke="${OL}" stroke-width="1.6"/><path d="M-3,0 H3" stroke-width="2"/><ellipse cx="0" cy="-16" rx="5" ry="6" fill="#fbf3dc" stroke-width="1.2"/><path d="M-5,-16 H5" stroke="#d8413a" stroke-width="1"/><path d="M-3,-22 H3" stroke-width="1.6"/></g>`;
 const iris=`<g transform="translate(36,-12)"><path d="M-5,0 L-6,-7 H6 L5,0Z" fill="#8a6a4a" stroke-width="1.2"/><path d="M-3,-7 Q-4,-16 -2,-22 M1,-7 Q2,-18 0,-24 M3,-7 Q6,-14 6,-19" fill="none" stroke="#5f8f3f" stroke-width="1.6"/><g fill="#7a5ab8" stroke-width=".9"><path d="M-2,-22 l-3,-3 l3,-1 l3,1Z"/><path d="M0,-24 l-3,-3 l3,-1 l3,1Z"/><path d="M6,-19 l-3,-3 l3,-1 l3,1Z"/></g></g>`;
 return `<g transform="scale(${SK9})"><ellipse cx="0" cy="3" rx="50" ry="6" fill="#000" opacity=".15" stroke="none"/>${t}<rect x="-44" y="-12" width="88" height="12" fill="#c8362f"/><rect x="-34" y="-24" width="68" height="12" fill="#c8362f"/><rect x="-24" y="-36" width="48" height="12" fill="#c8362f"/><path d="M-44,-12 H44 M-34,-24 H34" stroke="#8a2420" stroke-width="1.4"/>${bon(-18)}${bon(18)}${iris}</g>`};
const swordRack9=()=>`<g transform="scale(${SK9})"><ellipse cx="0" cy="3" rx="48" ry="6" fill="#000" opacity=".15" stroke="none"/><rect x="-40" y="-8" width="56" height="8" rx="2" fill="#6a4a30"/><path d="M-34,-8 V-44 M10,-8 V-44" stroke="#6a4a30" stroke-width="4"/><path d="M-40,-20 Q-12,-26 16,-20 M-40,-30 Q-12,-36 16,-30 M-40,-40 Q-12,-46 16,-40" fill="none" stroke="${OL}" stroke-width="3.6"/><path d="M-40,-20 Q-12,-26 16,-20 M-40,-30 Q-12,-36 16,-30 M-40,-40 Q-12,-46 16,-40" fill="none" stroke="#e0c898" stroke-width="1.8"/><path d="M28,0 V-56 M38,0 V-56" stroke="#8a6a4a" stroke-width="2.4"/><path d="M28,-54 H38 V-34 H28Z" fill="#2f4a7a" stroke-width="1.2"/><path d="M38,-54 H48 V-34 H38Z" fill="#c8362f" stroke-width="1.2"/></g>`;
const armor9=()=>`<g transform="scale(${SK9})"><ellipse cx="0" cy="3" rx="30" ry="6" fill="#000" opacity=".15" stroke="none"/><rect x="-24" y="-8" width="48" height="8" rx="2" fill="#6a4a30"/><path d="M0,-8 V-70" stroke="#6a4a30" stroke-width="3"/><path d="M-16,-60 H16 L18,-30 H-18Z" fill="#3e4a6a"/><path d="M-17,-52 H17 M-17,-44 H17 M-18,-36 H18" stroke="#c8a040" stroke-width="1.4"/><path d="M-16,-60 L-28,-50 L-26,-38 L-18,-40Z M16,-60 L28,-50 L26,-38 L18,-40Z" fill="#7a2f2a"/><path d="M-18,-30 L-22,-14 H22 L18,-30Z" fill="#7a2f2a"/><path d="M-20,-24 H20 M-21,-18 H21" stroke="#c8a040" stroke-width="1.2"/><circle cx="0" cy="-72" r="4" fill="#6a4a30"/></g>`;
Object.assign(KIND,{skYatai9:{w:150,h:120,fn:yatai9},skSteps9:{w:124,h:115,fn:steps9},skSwordRack9:{w:124,h:80,fn:swordRack9},skArmor9:{w:84,h:104,fn:armor9}});
['skYatai9','skSteps9','skSwordRack9','skArmor9'].forEach(k=>HEAVYX[N].add(k));
/* 台面上的位置（給 SPOTS 用）：屋台車的紅布檯面、階梯台三層 */
const onYatai=sp=>[(Math.random()*2-1)*12*SK9,-38*SK9-10]; /* 檯面兩邊擺了商品，只用中間 */
const onSteps=sp=>{const t=Math.floor(Math.random()*3),a=[-40,-30,-10][t]*SK9,b=[26,30,10][t]*SK9;return [a+Math.random()*(b-a),-(12+12*t)*SK9-9]};
/* 台子上先擺一兩個干擾物（擺在檯面的一邊，物件放上去時不會全部疊在一起） */
const STANDDEC=['skPot','skGoldGourd','skBlankScroll','skWoodTile','skBlackKettle','skStoneTower','skSpool','skSlate','skPouch','skBlankPlank'];
function decoOn(x,y,n){for(let i=0;i<n;i++){const k=pk(STANDDEC),K=KIND[k];if(!K)continue;add(x,y,K.w,K.h,k,K.fn(),{mark:false})}}
function stands9(){
 for(const [x,y,fl] of [[730,1660,0],[1770,1660,1]]) /* 使用者：木攤車拿掉兩台（靠櫓門那兩台） */{add(x,y,150*SK9/1.4,120,'skYatai9',yatai9(),{fl:!!fl});decoOn(x,y-38*SK9-10,1)}
 for(const [x,y] of [[1070,2060],[1430,2040],[1560,860]]){add(x,y,124,115,'skSteps9',steps9());decoOn(x+(r()<.5?-1:1)*22*SK9,y-24*SK9-9,1)}
 for(const [x,y,fl] of [[780,1890,0],[1720,1900,1]])add(x,y,124,80,'skSwordRack9',swordRack9(),{fl:!!fl});
 for(const [x,y] of [[950,1060],[1550,1080],[960,2230]])add(x,y,84,104,'skArmor9',armor9());
}

let HOG=null;
function clearCells(x,y,w,h){const a=Math.floor((x-w*.3)/CELL),c=Math.floor((x+w*.3)/CELL),b=Math.floor((y-h*.5)/CELL),d=Math.floor(y/CELL);for(let j=Math.max(0,b);j<=Math.min(GR-1,d);j++)for(let i=Math.max(0,a);i<=Math.min(GC-1,c);i++)occ[j*GC+i]=0}
function moveSp(sp,p){if(!sp||!p)return;clearCells(sp.x,sp.y,sp.w,sp.h);const[x,y]=p;sp.svg=sp.svg.replace(/translate\([^)]*\)/,`translate(${f(x)},${f(y)})`).replace(/data-x="[^"]*" data-y="[^"]*"/,`data-x="${f(x)}" data-y="${f(y)}"`);sp.x=x;sp.y=y}
function structures(){
 skyBirds(N);
 /* 石垣牆面、懸崖外的雲海不站人（主帳號合併時加：故事角色、路人會用 canPlace 檢查） */
 mark(865,1528,550,150,1);mark(1635,1528,550,150,1);mark((600+CL)/2,1440,CL-600+40,1240,1);mark((CR+1900)/2,1440,1900-CR+40,1240,1);
 /* 上段：天守閣、兩側角櫓、茶室、石燈籠 */
 add(TEN.x,TEN.y,170,190,'skTenshu',tenshuSvg(),{s:TEN.s});
 YAG.forEach(([x,y],i)=>add(x,y,72,60,'skYagura',yaguraSvg(),{s:1.9,fl:i===1}));
 add(TEAH.x,TEAH.y,100,60,'skTeahouse',teahouseSvg(),{s:1.5});
 for(const [x,y] of [[1110,1300],[1390,1300],[1140,1220],[1360,1220]])add(x,y,36,64,'skLantern',S.stoneLantern({glow:false}),{s:1.1});
 /* 石階畫在地面層（stairG），這裡不再疊 skStairs */
 /* 小刺蝟站崗的位置：石垣頂上（主帳號合併時加，故事說牠站在石垣上） */
 HOG=pk([[1010,1376],[1490,1376],[1060,1376],[1440,1376]]);mark(HOG[0],HOG[1],56,76);
 /* 下段：陣太鼓舞台、旗幟、櫓門 */
 add(STAGE.x,STAGE.y,120,80,'skStage',stageSvg(),{s:STAGE.s});
 for(const [x,y] of [[960,1700],[1540,1700],[900,1990],[1600,1990],[1130,2160],[1370,2160]])add(x,y,30,84,'skNobori',noboriSvg(),{s:1.3});
 add(1250,2390,104,70,'skGate',gateSvg(),{s:2.3}); /* 主帳號合併時改：原本 mark:false，路人會站到門後面被擋住 */
 /* 守門、守石階的武士（主帳號合併時改：原本 15 個站著不動的武士 → 4 個守衛＋下面的人群小故事） */
 for(const [x,y,a,b,d] of [[1080,2372,'#3e4a6a','#7a2f2a',1],[1420,2372,'#5a6a4a','#3e4a6a',-1],[1090,1260,'#7a2f2a','#3e4a6a',1],[1410,1260,'#3e4a6a','#5a6a4a',-1]])add(x,y,46,70,'skSamurai',samurai(a,b,d),{s:1.1});
 groups9();stands9();
 /* 懸崖邊的松樹（崖邊內側） */
 for(const [x,y] of [[880,600],[1620,640],[872,960],[1628,1000]])add(x,y,60,90,'pine',H.KIND.pine.fn(),{s:1.4});
}
function scatterAll(){
 /* 故事的小刺蝟搬到石垣頂上（主帳號合併時加） */
 const SS=H.dbg&&H.dbg.storySp&&H.dbg.storySp();if(SS&&HOG)moveSp(SS.target,HOG);
 scatter('sk9S',POOL.sk9S,4200,44);scatter('sk9Mid',POOL.sk9Mid,3600,38);scatter('sk9Up',POOL.sk9Up,4200,90);scatter('sk9Tenshu',POOL.sk9Tenshu,2800,50);
 scatter('sk9W',POOL.sk9W,3200,30);scatter('sk9E',POOL.sk9E,3200,30);scatter('sk9Stair',POOL.sk9Stair,2800,20);scatter('sk9All',POOL.sk9All,5000,10);
 /* 耙過的白砂上不長草叢、灌木（場地邊緣撒進來的也拿掉）；下段廣場中間不種松樹 */
 const sand=(x,y)=>!onLawn(x,y)&&((y>226&&y<1440&&x>CL&&x<CR)||y>1500);
 for(const sp of H.sprites){if(!sp.svg)continue;const k=sp.kind;
  if((k==='grassClump'||k==='bush'||k==='round')&&sand(sp.x,sp.y)||(k==='pine'&&sp.y>1500&&!onLawn(sp.x,sp.y))){sp.svg='';sp.kind='skGone'}}
}
SCENE_IMPL[N]={ground,structures,scatter:scatterAll};

/* ================= 9. 連環小故事「不肯下班的小刺蝟」 ================= */
const captain=()=>act(0,0,1,{view:'fq',pose:'reach',mood:2,...samO('#7a2f2a','#3e4a6a')});
const bugler=()=>act(0,0,1,{view:'fq',pose:'hold',mood:1,...samO('#3e4a6a','#b04a3a',{extra:`<path d="M8,-26 Q22,-38 30,-26 Q26,-16 12,-14Z" fill="#f4ecd8" stroke-width="1.6"/><path d="M12,-20 Q20,-30 27,-26" fill="none" stroke="#c8b898" stroke-width="1"/><path d="M8,-26 L6,-30" stroke="${OL}" stroke-width="1.6"/>`})});
const hedgehog=()=>`<ellipse cx="0" cy="2" rx="18" ry="4" fill="#000" opacity=".16" stroke="none"/><path d="M-16,-2 Q-18,-22 -4,-26 Q10,-28 16,-14 Q18,-2 10,0Z" fill="#8a6a4a"/><path d="M-14,-12 L-20,-14 M-12,-18 L-17,-24 M-6,-23 L-8,-30 M2,-26 L3,-33 M9,-24 L13,-30 M14,-16 L20,-20" stroke="#5a4028" stroke-width="2.6" fill="none"/><path d="M8,-14 Q20,-14 22,-6 Q18,0 8,-2Z" fill="#e8c8a0"/><circle cx="16" cy="-10" r="1.4" fill="${OL}" stroke="none"/><circle cx="22" cy="-6" r="1.8" fill="${OL}" stroke="none"/><path d="M-2,-24 Q6,-34 14,-24 Z" fill="#3e4a6a" stroke-width="1.6"/><path d="M-1,-30 Q6,-38 13,-30 Q6,-28 -1,-30Z" fill="${gold}" stroke-width="1.2"/><path d="M-6,-2 V6 M2,-2 V6" stroke="${OL}" stroke-width="2.4"/><path d="M20,-6 L22,-40" stroke="#8a6a4a" stroke-width="2.4"/><path d="M20,-40 L24,-48 L26,-38Z" fill="#c9c5b8" stroke-width="1.2"/>`;
STORIES[N]={title:'不肯下班的小刺蝟',who:'守城隊長',
 giver:()=>captain(),
 target:()=>`<g transform="scale(1.15)">${hedgehog()}</g>`,tw:56,th:76,
 helper:()=>bugler(),hw:46,hh:70,
 ask:'守城隊長：我們的吉祥物小刺蝟不見了！牠戴著一頂迷你頭盔。',
 need:'有隻小刺蝟一個人站在石垣上當衛兵，一動也不動。吹號角的號手也許有辦法。',
 got:'號手：我來吹收兵號，牠一定聽話！',
 ok:'小刺蝟聽到號角立正敬禮，快帶回守城隊長身邊！'};

/* ================= 10. 場景彩蛋：點天守閣頂的金鯱，閃一道金光（不算點錯） ================= */
let flashing=0;
TAPHOOKS[N]=(x,y)=>{if(festTap9(x,y))return true;
 const cx=TEN.x,cy=TEN.y+SHACHI.dy,hit=[cx-SHACHI.dx,cx+SHACHI.dx].find(px=>Math.hypot(x-px,y-cy)<60);if(hit===undefined)return false;
 const fx=document.getElementById('fx');if(!fx||flashing>1)return true;flashing++;
 try{[1568,1976,2349].forEach((q,i)=>setTimeout(()=>tone(q,.14,'triangle',.05),i*80))}catch(_){}
 const NS='http://www.w3.org/2000/svg',g=document.createElementNS(NS,'g');fx.appendChild(g);
 const rays=Array.from({length:10},(_,i)=>{const e=document.createElementNS(NS,'path');e.setAttribute('stroke','#fff3b0');e.setAttribute('stroke-width','4');e.setAttribute('stroke-linecap','round');g.appendChild(e);return {e,a:i/10*Math.PI*2}});
 const ring=document.createElementNS(NS,'circle');ring.setAttribute('fill','none');ring.setAttribute('stroke','#f0c040');ring.setAttribute('stroke-width','4');g.appendChild(ring);
 const sp=Array.from({length:7},(_,i)=>{const e=document.createElementNS(NS,'path');e.setAttribute('d','M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2Z');e.setAttribute('fill','#fff7c0');e.setAttribute('stroke','#f0c040');e.setAttribute('stroke-width','1.2');g.appendChild(e);return {e,a:sr(0,6.28),v:sr(30,70)}});
 const t0=performance.now(),D=1300;
 const step=now=>{const k=(now-t0)/D;if(k>=1){g.remove();flashing--;return}
  const e=Math.sin(Math.min(1,k*1.4)*Math.PI/2),o=Math.max(0,1-k*1.1);
  rays.forEach(R=>{const r0=14+e*10,r1=20+e*58;R.e.setAttribute('d',`M${(hit+Math.cos(R.a)*r0).toFixed(1)},${(cy+Math.sin(R.a)*r0).toFixed(1)} L${(hit+Math.cos(R.a)*r1).toFixed(1)},${(cy+Math.sin(R.a)*r1).toFixed(1)}`);R.e.setAttribute('opacity',o.toFixed(2))});
  ring.setAttribute('cx',hit);ring.setAttribute('cy',cy);ring.setAttribute('r',(10+e*54).toFixed(1));ring.setAttribute('opacity',o.toFixed(2));
  sp.forEach(P=>{P.e.setAttribute('transform',`translate(${(hit+Math.cos(P.a)*P.v*e).toFixed(1)},${(cy+Math.sin(P.a)*P.v*e-e*12).toFixed(1)}) scale(${(1-k*.6).toFixed(2)})`);P.e.setAttribute('opacity',o.toFixed(2))});
  requestAnimationFrame(step)};
 requestAnimationFrame(step);return true};

/* ================= 11. 過場：走上長長的登城石階，天守閣和金鯱慢慢出現 ================= */
RIDES.castle=(()=>{
 const strip=()=>{
  let w=`<defs><linearGradient id="skStSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe0f2"/><stop offset="1" stop-color="#e6f2f4"/></linearGradient></defs>`;
  w+=`<rect x="-10" y="0" width="420" height="1500" fill="url(#skStSky)" stroke="none"/>`;
  for(let i=0;i<7;i++)w+=cloudBlob(sr(0,400),sr(60,520),sr(.5,.9));
  w+=T(200,300,.9,tenshuSvg(),false);
  w+=`<path d="M-10,320 H410 V1500 H-10Z" fill="#a9c47e" stroke="none"/>`;
  /* 左右石垣＋松 */
  w+=`<path d="M-10,300 H70 L112,1500 H-10Z" fill="${ST}"/><path d="M410,300 H330 L288,1500 H410Z" fill="${ST}"/>`;
  for(let y=330;y<1500;y+=46){w+=`<path d="M${-10},${y} H${70+(y-300)*.035}" stroke="#7d7a70" stroke-width="1.4" fill="none"/><path d="M410,${y} H${330-(y-300)*.035}" stroke="#7d7a70" stroke-width="1.4" fill="none"/>`}
  /* 石階：越往上越窄，一階一階 */
  for(let y=1480;y>330;y-=24){const k=(y-330)/1150,hw=44+k*84;w+=`<path d="M${200-hw},${y} H${200+hw} V${y-24} H${200-hw}Z" fill="${(y/24|0)%2?'#cfc8b6':'#d9d2c0'}" stroke-width="1.4"/>`}
  for(let y=1400;y>380;y-=170){const k=(y-330)/1150,hw=44+k*84;w+=T(200-hw-18,y,.9,S.stoneLantern({glow:false,moss:true}),false)+T(200+hw+18,y,.9,S.stoneLantern({glow:false,moss:true}),false)}
  w+=T(40,900,.9,H.KIND.pine.fn(),false)+T(366,820,.9,H.KIND.pine.fn(),false)+T(36,1250,1,S.sakuraTree('full'),false)+T(368,1180,1,S.sakuraTree('full'),false);
  return w};
 const walker=()=>`<ellipse cx="0" cy="2" rx="22" ry="5" fill="#000" opacity=".18" stroke="none"/>`+act(0,0,1,{view:'bq',pose:'stand',s:1.05,hat:-1,shirt:'#f4b6c2',pants:'#4a4a5a'});
 return {text:'沿著長長的登城石階往上走，天守閣和金鯱慢慢出現⋯',every:420,tick:k=>tone(k%2?330:260,.04,'triangle',.04),
  svg:()=>`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><style>@keyframes skStPan{from{transform:translateY(-900px)}to{transform:translateY(-40px)}}.skWalk9{animation:skStBob .32s ease-in-out infinite alternate}@keyframes skStBob{to{transform:translateY(-4px)}}</style>`+
   `<g style="animation:skStPan 4.4s cubic-bezier(.35,0,.65,1) forwards;transform:translateY(-900px)">${strip()}</g>`+
   `<g class="skWalk9"><g transform="translate(200,500)">${walker()}</g></g></g></svg>`}})();

/* ================= 12. 冒險地圖：第 9 關節點（接在第 8 關上方） ================= */
HERE[N]=[-76,134];
MAPHOOKS.push(({U,P,ink,FN})=>{if(U<N)return '';
 const road='M-82,188 Q-92,180 -84,174 Q-77,169 -76,166';
 let m=H.mapRoute(road,'road',ink);
 m+=`<g class="mnode" data-n="${N}"><circle cx="-76" cy="156" r="24" fill="transparent"/><ellipse cx="-76" cy="165" rx="20" ry="6" fill="#b9d490" stroke="${ink}" stroke-width="1.3"/>`+
  `<g stroke="${ink}" stroke-width="1.2" stroke-linejoin="round"><path d="M-88,165 L-85,158 H-67 L-64,165Z" fill="#a9a79c"/><rect x="-83" y="150" width="14" height="8" fill="#fbf6ea"/><path d="M-87,151 Q-76,146 -65,151 L-67,153 H-85Z" fill="#454a5a"/><rect x="-80" y="143" width="8" height="7" fill="#fbf6ea"/><path d="M-84,144 Q-76,139 -68,144 L-70,146 H-82Z" fill="#454a5a"/><path d="M-79,139 L-76,133 L-73,139Z" fill="#454a5a"/><path d="M-80,134 q-2,-2 -1,-4 M-72,134 q2,-2 1,-4" fill="none" stroke="#f0c040" stroke-width="1.6"/></g>`+
  `<g transform="translate(-30,160)"><rect x="-26" y="-10" width="52" height="19" rx="9.5" fill="#fffaf0" stroke="${ink}" stroke-width="1.6"/><text y="4" text-anchor="middle" font-size="11" fill="${ink}" font-family="${FN}">天守閣</text></g></g>`;
 return m});
})();

/* ===== 物件的合理位置（主帳號合併時加，2026-11-12 規則）：SPOTS 合理的地方（佔 55～65%）、BLEND 顏色相近的東西。說明在 core.js 的 placeItems ===== */
(function(){const H=window.TH;if(!H||!H.SPOTS)return;
const Y=(sp)=>[(Math.random()*2-1)*12*1.4,-38*1.4-10],ST=(sp)=>{const t=Math.floor(Math.random()*3),a=[-40,-30,-10][t]*1.4,b=[26,30,10][t]*1.4;return [a+Math.random()*(b-a),-(12+12*t)*1.4-9]};
/* 主帳號合併時改：原本大多擺在屋台車、階梯台上 → 使用者說集中在台子上太好找、人夠多可以混淆 →
   每種最多一個「台子」選項，其餘分散到人群旁、櫻花樹下、石燈籠、幟旗、茶室、角櫓（這些數量多，自然會散開） */
const PP=[["walker",0.05,0.62],["chat",0.05,0.62]],TR=[["skSakura",0.03,0.5],["pine",0.03,0.5]],LT=[["skLantern",0.05,0.6],["skLanternDim",0.05,0.6]];
H.SPOTS[9]={"sk_omamori":[["skYatai9",Y],...PP,...LT,["skSakura",0.03,0.5]],
 "sk_ema":[["skSteps9",ST],...LT,["skTeahouse",0.05,0.6],...TR],
 "sk_kabuto":[["skArmor9",0.05,0.7],["skTate9",0.03,0.6],["skKidSam9",0.03,0.6],["skSamurai",0.05,0.7],...PP],
 "sk_shachi":[["skYatai9",Y],["skTenshu",0.02,0.4],["skYagura",0.03,0.5],...TR],
 "sk_kakejiku":[["skTeahouse",0.05,0.6],["skTeahouse",0.4,0.3],["skYagura",0.03,0.5],...LT],
 "sk_shogi":[["skYatai9",Y],["skTeahouse",0.05,0.6],...PP,...TR],
 "sk_kamonflag":[["skSwordRack9",0.05,0.62],["skNobori",0.05,0.6],["skBigFlag9",0.03,0.5],["skYagura",0.03,0.5]],
 "sk_chagama":[["skTeahouse",0.05,0.6],["skTeahouse",0.05,0.6],...PP,...LT],
 "sk_tenshumodel":[["skSteps9",ST],["skTenshu",0.02,0.45],["skPhoto9",0.03,0.55],...PP],
 "sk_inkan":[["skYatai9",Y],["skTeahouse",0.05,0.6],...PP,...LT],
 "sk_taiko":[["skStage",0.05,0.6],["skFans9",0.03,0.55],["skDrummer9",0.03,0.6],...TR],
 "sk_onigawara":[["skTenshu",0.02,0.45],["skYagura",0.03,0.5],...LT,...TR]};
H.BLEND[9]={"sk_omamori":["skPouch"],"sk_ema":["skBlankPlank"],"sk_kabuto":["skPot"],"sk_shachi":["skGoldGourd"],"sk_kakejiku":["skBlankScroll"],"sk_shogi":["skWoodTile"],
 "sk_kamonflag":["skPlainPennant","skNobori"],"sk_chagama":["skBlackKettle","skPot"],"sk_tenshumodel":["skStoneTower"],"sk_inkan":["skSpool"],"sk_taiko":["skSakeBarrel"],"sk_onigawara":["skSlate"]};
})();
