/* 奇幻小鎮大搜查．城堡系列〔城門廣場〕（找路發現的新關卡，編號 17 只是程式用）
   入口：第 1 關奇幻小鎮，城堡大門前（石階頂端）的兩位衛兵——程式在這個檔案最後面（H.RESERVE[1]／H.EXITS[17]）。
   使用者 2026-11-19 決定：城堡系列第一關＝護城河吊橋＋城門廣場；入口是第 1 關城堡大門前的衛兵；第 10 關 2 星後才能發現；
   冒險地圖不另外放節點，「隸屬於奇幻小鎮」：點小鎮裡的城堡就是這一關，放大看得到「城堡」名牌，遠看只顯示大區「奇幻小鎮」。
   場景（由北到南）：內城主堡（大門關著，是下一關的伏筆）→ 城門廣場（市集、水井、鐵匠、馬廄、表演、練武）→ 外城牆＋城門樓 → 護城河＋吊橋 → 外城草地。
   本檔案不依賴第 1 關以外的 kind；新名字都以 17 結尾。 */
(function(){
const H=window.TH;if(!H)return;
const N=17;
const {T,f,r,sr,pk,ri,OL,kid,act,wrapAn,pickView,add,mark,canPlace,scatter,skyBirds,KIND,POOL,VPLAN,REG,SCREG,LEVELS,ART,DECOY,
 SCENE_IMPL,WATERFN,RIDES,HERE,OUTFITS,STORIES,HOSTK,HOSTN,tone,typeOf,HATS,noteM,barrel,crate,swan,roundTree,bush}=H;
const tube=(d,c,w=3.4)=>`<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w+2.6}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;

/* ================= 1. 場景範圍、天空、場地邊緣 ================= */
H.SCENES[N]={x0:250,x1:2250,y1:2150,c:[1250,1820]};   /* 2026-11-26h 難度調整：600～1900 → 250～2250（約 7 個畫面） */
H.TARGET[N]=330;
H.SKYC[N]='#e2eef0';H.SKYY[N]=300;
H.EDGEM[N]='B';H.EDGED[N]='LRB';   /* 左右不鏡像（主堡很寬，鏡像會在場地外多出幾座塔）；地面自己畫到場地外 */
H.EDGEDECO[N]=[['round',2.4],['bush',2],['pine',1],['rock',.6]];
H.FRINGE[N]=[['pebbles',1.4],['barrel',.5],['crate',.4],['pot',.25],['walker',.4]];
H.FRINGEX[N]=[[-600,0,3200,780],[-600,500,700,1700],[1800,500,3200,1700]];   /* 2026-11-26h 加寬區自己有佈景，不要再長靠邊佈景 */   /* 北邊的城牆、主堡、天空不要長佈景 */
H.DENS[N]=1;   /* 2026-11-26h 加寬後 1.1→1 */

/* ================= 2. 當地人：中世紀風（束腰外衣、斗篷帽、羽毛扁帽、頭巾）；衛兵戴鐵盔、穿紅色罩袍 ================= */
const HAT_HOOD=HATS.push(v=>H.HATKIT.hoodV(pk(['#6a7a4a','#8a5a3a','#5a6a8a','#7a4a5a','#a8843f']))(v) /* 2026-11-23c 跟著方向畫 */)-1;
const HAT_BERET=HATS.push(v=>H.HATKIT.beretB(pk(['#b8402e','#3f6f9a','#4a6a3a','#6a3f7a','#2f2f3a']))(v) /* 2026-11-23c 使用者選羽毛帽 B */)-1;
const HAT_KER=HATS.push(v=>H.HATKIT.kerV(pk(['#f1e6cc','#d9a5a0','#e8d49a','#bcd0dc']))(v))-1;
const HAT_HELM=HATS.push(()=>`<ellipse cx="0" cy="-41" rx="19" ry="4.4" fill="#a3aab4"/><path d="M-13,-42 Q-14,-60 0,-60 Q14,-60 13,-42Z" fill="#c4cad2"/><path d="M0,-60 V-42" fill="none" stroke="#8a929c" stroke-width="1.6"/><path d="M-8,-52 Q-6,-57 -2,-58" fill="none" stroke="#fff" stroke-width="1.8"/>`)-1;
H.HATHELM17=HAT_HELM;
const HAT_CHEF=H.HATCHEF17=HATS.push(()=>`<path d="M-11,-42 L-12,-54 Q-18,-60 -11,-64 Q-8,-72 0,-68 Q8,-72 11,-64 Q18,-60 12,-54 L11,-42Z" fill="#fbf9f2"/><path d="M-11,-46 H11" fill="none" stroke="#d9d2c0" stroke-width="1.6"/>`)-1;
const TUNIC=['#8a5a3a','#5f7a4a','#7a4f8a','#3f6f9a','#b8402e','#c99a3a','#6a7488','#a86a4a','#4a6a6a','#d9c08a'];
OUTFITS[N]=o=>{if(o.top)return o;
 o.skin=o.skin||pk(['#f2d2b4','#e8c4a0','#d9a578','#c98d5e','#f0cfae','#8f5a36']);
 o.top=pk(['long','long','tee']);o.bottom='pants';o.shirt=o.shirt||pk(TUNIC);o.pants=o.pants||pk(['#5a4a3a','#6a5a48','#4a4f5c','#7a5a3a','#3f4a3a']);
 if(o.hat==null&&!o.plain){const x=r();o.hat=x<.2?HAT_HOOD:x<.36?HAT_BERET:x<.52?HAT_KER:-1}return o};
/* 衛兵：鐵盔＋紅色罩袍＋長槍 */
const spear=`<path d="M13,4 V-74" fill="none" stroke="${OL}" stroke-width="4.6" stroke-linecap="round"/><path d="M13,4 V-74" fill="none" stroke="#8a6a40" stroke-width="2.4" stroke-linecap="round"/><path d="M13,-73 l-4,-2 l4,-13 l4,13Z" fill="#c9ced6" stroke-width="1.4"/><path d="M9,-74 h8" fill="none" stroke-width="1.6"/>`;
const tabard=`<path d="M-5,-17 H5 L6,-4 H-6Z" fill="#e0b44a" stroke-width="1.1" opacity=".95"/><path d="M-2,-13 l2,-2 l2,2 l-2,2Z" fill="#b8402e" stroke="none"/>`;
const guard=(dir,view='fq',anim=false)=>act(0,0,dir,{view,pose:'hold',hat:HAT_HELM,skin:pk(['#e8c4a0','#d9a578','#c98d5e']),hair:'#4a3424',shirt:'#b8402e',top:'long',bottom:'pants',pants:'#4a4f5c',mood:0,extra:tabard+spear},anim);

/* ================= 3. 物件與干擾物（原圖最長邊約 34，細長的約 40） ================= */
Object.assign(ART,{
 helmet17:`<path d="M-13,11 L-13,-3 Q-13,-17 0,-17 Q13,-17 13,-3 L13,11 Q0,14 -13,11Z" fill="#c4cad2"/><path d="M0,-17 V11" fill="none" stroke="#9aa2ad" stroke-width="1.4"/><path d="M-13,0 H13" fill="none" stroke-width="1.4"/>`+
  `<path d="M-9,3 H-2 M2,3 H9" fill="none" stroke="${OL}" stroke-width="2.6" stroke-linecap="round"/><path d="M-7,7.5 v2 M-3.5,7.5 v2 M3.5,7.5 v2 M7,7.5 v2" fill="none" stroke-width="1.2"/>`+
  `<path d="M0,-17 Q-3,-29 7,-30 Q15,-27 11,-19 Q7,-23 2,-17Z" fill="#c4473a" stroke-width="1.5"/><path d="M-9,-7 Q-8,-12 -3,-13" fill="none" stroke="#fff" stroke-width="2"/>`,
 shield17:`<path d="M-14,-15 H14 V-2 Q14,10 0,17 Q-14,10 -14,-2Z" fill="#e0b44a"/><path d="M-11,-12 H11 V-2 Q11,8 0,13.6 Q-11,8 -11,-2Z" fill="#3f6f9a" stroke="none"/>`+
  `<path d="M-11,4 L0,-5 L11,4 L11,9 L0,0 L-11,9Z" fill="#e0b44a" stroke-width="1.2"/><path d="M0,-11 l1.6,3.4 l3.6,.4 l-2.7,2.4 l.8,3.6 l-3.3,-1.9 l-3.3,1.9 l.8,-3.6 l-2.7,-2.4 l3.6,-.4Z" fill="#fbf1c8" stroke-width="1"/><path d="M-14,-15 H14 V-2 Q14,10 0,17 Q-14,10 -14,-2Z" fill="none"/>`,
 gkey17:`<g transform="rotate(-38)"><circle cx="-14" cy="0" r="8" fill="#4a4f5c"/><circle cx="-14" cy="0" r="4" fill="#fbf6ea"/><rect x="-7" y="-2.6" width="27" height="5.2" rx="1.6" fill="#4a4f5c"/>`+
  `<path d="M13,2.4 V9 H17 V5 H20 V2.4" fill="#4a4f5c"/><path d="M-19,-4 Q-17,-7 -13,-7.6" fill="none" stroke="#8a929c" stroke-width="1.6"/><path d="M-4,-2.6 V2.6" fill="none" stroke="#2b2420" stroke-width="1.2"/></g>`,
 scroll17:`<rect x="-17" y="-8" width="34" height="16" rx="7" fill="#f1e2bc"/><ellipse cx="-17" cy="0" rx="3.6" ry="8" fill="#e2cc98"/><ellipse cx="-17" cy="0" rx="1.4" ry="3.6" fill="none" stroke-width="1.1"/>`+
  `<path d="M-6,-8 V8 M-2,-8 V8" fill="none" stroke="#b8402e" stroke-width="2.4"/><path d="M-4,8 l-4,7 M-4,8 l3,7" fill="none" stroke="#b8402e" stroke-width="2"/><circle cx="-4" cy="2" r="5.4" fill="#c4473a" stroke-width="1.5"/><path d="M-6,1 l2,2 l2.6,-3" fill="none" stroke="#f0a8a0" stroke-width="1.2"/>`,
 horn17:`<path d="M-17,-9 Q-6,10 13,4 L16,-9 Q2,-2 -12,-13Z" fill="#e0b44a"/><path d="M13,4 Q20,4 22,-2 Q20,-11 16,-9Z" fill="#c99a2a"/><ellipse cx="18.6" cy="-3.4" rx="3" ry="6" fill="#7a5a2a" transform="rotate(-20 18.6 -3.4)"/>`+
  `<path d="M-17,-9 L-19,-12 L-14,-14 L-12,-13" fill="#c99a2a" stroke-width="1.4"/><path d="M-6,-2 l2,-6 M4,1 l1,-7" fill="none" stroke="#a8803a" stroke-width="1.6"/><path d="M-10,-6 Q0,10 14,2" fill="none" stroke="#8a5a3a" stroke-width="2" opacity=".7"/>`,
 lute17:`<g transform="rotate(-30)"><path d="M-2,-6 L-3,-28 L3,-28 L2,-6Z" fill="#8a5a30"/><path d="M-3,-28 L-6,-34 L4,-36 L3,-28Z" fill="#6a4228" stroke-width="1.4"/>`+
  `<path d="M0,-8 Q14,-6 13,8 Q12,18 0,18 Q-12,18 -13,8 Q-14,-6 0,-8Z" fill="#c99a5b"/><circle cx="0" cy="4" r="4" fill="#4a3424"/><path d="M-1,-26 V14 M1,-26 V14" fill="none" stroke="#fbf6ea" stroke-width=".7"/><rect x="-4" y="12" width="8" height="2.6" fill="#6a4228" stroke-width="1"/></g>`,
 goblet17:`<path d="M-12,-15 H12 Q12,-1 2,1 V9 H-2 V1 Q-12,-1 -12,-15Z" fill="#e0b44a"/><path d="M-9,14 Q0,9 9,14 Z" fill="#e0b44a"/><path d="M-10,14 H10" fill="none" stroke-width="2"/>`+
  `<path d="M-12,-15 H12" fill="none" stroke-width="2.4"/><circle cx="0" cy="-7" r="3" fill="#c4473a" stroke-width="1.2"/><circle cx="-7" cy="-9" r="1.6" fill="#4f86c4" stroke="none"/><circle cx="7" cy="-9" r="1.6" fill="#4f86c4" stroke="none"/><path d="M-8,-12 Q-8,-5 -4,-2" fill="none" stroke="#fbe08a" stroke-width="1.6"/>`,
 gaunt17:`<path d="M-7,16 V6 L-11,1 V-8 Q-11,-12 -8,-12 L-8,-16 Q-6,-19 -3,-16 V-18 Q0,-21 3,-18 V-17 Q6,-20 8,-16 V-12 Q11,-13 11,-9 V4 L7,8 V16Z" fill="#c4cad2"/>`+
  `<path d="M-8,-12 V-3 M-3,-16 V-4 M3,-17 V-4 M8,-12 V-3" fill="none" stroke="#8a929c" stroke-width="1.2"/><path d="M-11,-4 H11 M-11,1 H11" fill="none" stroke-width="1.3"/><rect x="-9" y="9" width="18" height="7" rx="1.6" fill="#a3aab4" stroke-width="1.4"/><path d="M-6,-10 Q-5,-14 -3,-15" fill="none" stroke="#fff" stroke-width="1.4"/>`});
Object.assign(DECOY,{
 bucket17:`<path d="M-12,-11 L-9,12 H9 L12,-11Z" fill="#a8703f"/><path d="M-11.4,-4 H11.4 M-10.4,6 H10.4" fill="none" stroke="#5a5e6a" stroke-width="2.2"/><ellipse cx="0" cy="-11" rx="12" ry="3.4" fill="#7a5235"/><path d="M-12,-11 Q0,-26 12,-11" fill="none" stroke="#5a5e6a" stroke-width="1.8"/>`,
 potlid17:`<ellipse cx="0" cy="3" rx="16" ry="8" fill="#9aa2ad"/><path d="M-16,3 Q0,-11 16,3" fill="#b9c0c8"/><path d="M-16,3 Q0,13 16,3" fill="none"/><rect x="-4" y="-9" width="8" height="5" rx="2" fill="#6a4228" stroke-width="1.4"/><path d="M-10,-1 Q-5,-5 0,-5.4" fill="none" stroke="#fff" stroke-width="1.6"/>`,
 ring17:`<circle cx="0" cy="2" r="11" fill="none" stroke="${OL}" stroke-width="6.4"/><circle cx="0" cy="2" r="11" fill="none" stroke="#5a5e6a" stroke-width="3.6"/><path d="M-3,-9 V-15 H3 V-9" fill="#5a5e6a" stroke-width="1.4"/>`,
 rpin17:`<g transform="rotate(-20)"><rect x="-11" y="-5.4" width="22" height="10.8" rx="5" fill="#e0b880"/><rect x="-19" y="-2.4" width="8" height="4.8" rx="2.2" fill="#a8703f"/><rect x="11" y="-2.4" width="8" height="4.8" rx="2.2" fill="#a8703f"/><path d="M-7,-3 H5" fill="none" stroke="#f4dcae" stroke-width="1.6"/></g>`,
 croissant17:`<path d="M-17,4 Q-16,-12 0,-13 Q16,-12 17,4 Q12,-1 8,1 Q4,-5 0,-5 Q-4,-5 -8,1 Q-12,-1 -17,4Z" fill="#d9963a"/><path d="M-8,1 Q-6,-6 -2,-10 M8,1 Q6,-6 2,-10" fill="none" stroke="#a8682a" stroke-width="1.4"/><path d="M-12,-5 Q-8,-9 -4,-10" fill="none" stroke="#f4c87a" stroke-width="1.6"/>`,
 gourd17:`<path d="M0,-17 Q5,-17 5,-10 Q5,-6 3,-4 Q12,0 11,9 Q10,17 0,17 Q-10,17 -11,9 Q-12,0 -3,-4 Q-5,-6 -5,-10 Q-5,-17 0,-17Z" fill="#d9b25a"/><path d="M-3,-4 Q0,-2 3,-4" fill="none" stroke="#b8402e" stroke-width="2"/><path d="M0,-17 V-21" fill="none" stroke="#6a4228" stroke-width="2.2"/><path d="M-6,4 Q-6,10 -3,13" fill="none" stroke="#f4dc9a" stroke-width="1.6"/>`,
 hglass17:`<rect x="-11" y="-17" width="22" height="4.4" rx="1.4" fill="#a8703f"/><rect x="-11" y="12.6" width="22" height="4.4" rx="1.4" fill="#a8703f"/><path d="M-8,-12.6 Q-8,-3 0,0 Q8,-3 8,-12.6Z M-8,12.6 Q-8,3 0,0 Q8,3 8,12.6Z" fill="#dfeef2"/>`+
  `<path d="M-5,12.6 Q0,6 5,12.6Z M-3,-8 Q0,-4 3,-8Z" fill="#e4c070" stroke="none"/><path d="M-9.4,-12.6 V12.6 M9.4,-12.6 V12.6" fill="none" stroke="#7a5235" stroke-width="2"/>`,
 glove17:`<path d="M-7,16 V6 L-11,1 V-8 Q-11,-12 -8,-12 L-8,-16 Q-6,-19 -3,-16 V-18 Q0,-21 3,-18 V-17 Q6,-20 8,-16 V-12 Q11,-13 11,-9 V4 L7,8 V16Z" fill="#9a6a3a"/><path d="M-3,-16 V-6 M3,-17 V-6" fill="none" stroke="#6a4228" stroke-width="1.1"/><rect x="-8" y="9" width="16" height="7" rx="2" fill="#7a5235" stroke-width="1.3"/>`});

/* ---- 景物 ---- */
const sh=(rx,ry=6)=>`<ellipse cx="0" cy="3" rx="${rx}" ry="${ry}" fill="#000" opacity=".13" stroke="none"/>`;
const GOODS={
 fruit:()=>[[-34,'#d8413a'],[-24,'#e0b44a'],[-14,'#d8413a'],[18,'#7aa856'],[28,'#e8742a'],[38,'#d8413a']].map(([x,c])=>`<circle cx="${x}" cy="-38" r="5" fill="${c}" stroke-width="1.3"/>`).join('')+`<path d="M-40,-34 h32 M12,-34 h32" fill="none" stroke="#8a6a3a" stroke-width="3"/>`,
 bread:()=>`<ellipse cx="-30" cy="-38" rx="11" ry="5.4" fill="#d9963a" stroke-width="1.4"/><path d="M-36,-40 l3,3 M-30,-41 l3,3 M-24,-40 l3,3" fill="none" stroke="#a8682a" stroke-width="1.2"/><circle cx="-8" cy="-38" r="6" fill="#e0aa5a" stroke-width="1.3"/><ellipse cx="18" cy="-38" rx="13" ry="5" fill="#c9853a" stroke-width="1.4"/><circle cx="38" cy="-38" r="5" fill="#e0aa5a" stroke-width="1.3"/>`,
 cloth:()=>[['#b8402e',-34],['#3f6f9a',-14],['#e0b44a',6],['#5f7a4a',26]].map(([c,x])=>`<rect x="${x}" y="-44" width="18" height="10" rx="2" fill="${c}" stroke-width="1.3"/><path d="M${x+2},-40 h14" fill="none" stroke="#fff" stroke-width="1" opacity=".6"/>`).join(''),
 pots:()=>[[-30,'#c4704a'],[-10,'#8a929c'],[12,'#c99a5b'],[32,'#5f8e9a']].map(([x,c])=>`<path d="M${x-7},-34 Q${x-9},-44 ${x-4},-47 H${x+4} Q${x+9},-44 ${x+7},-34Z" fill="${c}" stroke-width="1.3"/>`).join('')};
const stall=(c1,c2,g,vend=true)=>{let s=sh(62,7);
 if(vend)s+=T(0,-30,1,act(0,0,pk([1,-1]),{view:'front',hat:pk([HAT_KER,HAT_BERET,-1,HAT_HOOD]),plain:false},false));
 s+=`<path d="M-52,0 V-86 M52,0 V-86" fill="none" stroke="${OL}" stroke-width="6.4"/><path d="M-52,0 V-86 M52,0 V-86" fill="none" stroke="#8a6a40" stroke-width="3.8"/>`;
 s+=`<rect x="-56" y="-34" width="112" height="34" rx="2" fill="#b98a56"/><path d="M-56,-24 H56 M-56,-12 H56" fill="none" stroke="#8a6a3a" stroke-width="1.3"/><rect x="-60" y="-38" width="120" height="6" rx="2" fill="#d6a868"/>`;
 s+=GOODS[g]();
 let aw='';for(let i=0;i<6;i++)aw+=`<path d="M${-60+i*20},-104 h20 v20 q-10,8 -20,0Z" fill="${i%2?c2:c1}"/>`;
 s+=aw+`<path d="M-60,-104 H60" fill="none" stroke-width="2.4"/><path d="M-64,-106 H64 L60,-112 H-60Z" fill="${c1}" stroke-width="1.6"/>`;
 return s};
const well=()=>sh(36,7)+`<path d="M-30,0 V-30 H30 V0Z" fill="#c9bfa6"/><path d="M-30,-10 H30 M-30,-20 H30 M-18,0 V-10 M4,0 V-10 M22,0 V-10 M-8,-10 V-20 M14,-10 V-20 M-22,-20 V-30 M2,-20 V-30 M20,-20 V-30" fill="none" stroke="#9e9378" stroke-width="1.3"/>`+
 `<ellipse cx="0" cy="-30" rx="30" ry="7" fill="#d9cfb6"/><ellipse cx="0" cy="-30" rx="22" ry="4.6" fill="#3e5560"/>`+
 `<path d="M-26,-30 V-84 M26,-30 V-84" fill="none" stroke="${OL}" stroke-width="6"/><path d="M-26,-30 V-84 M26,-30 V-84" fill="none" stroke="#8a6a40" stroke-width="3.6"/><path d="M-26,-70 H26" fill="none" stroke="#7a5235" stroke-width="3.4"/>`+
 `<path d="M4,-70 V-50" fill="none" stroke="#c9a46a" stroke-width="1.4"/><path d="M-3,-50 H11 L9,-40 H-1Z" fill="#a8703f" stroke-width="1.4"/>`+
 `<path d="M-38,-80 L0,-106 L38,-80 L32,-76 L0,-98 L-32,-76Z" fill="#a85640"/><path d="M-30,-84 L0,-104 M30,-84 L0,-104" fill="none" stroke="#c4704a" stroke-width="1.4" opacity=".8"/>`;
const forge=()=>{let s=sh(76,8);
 s+=`<rect x="-58" y="-128" width="30" height="80" fill="#a89e88"/><path d="M-58,-108 H-28 M-58,-88 H-28 M-58,-68 H-28 M-44,-128 V-108 M-50,-88 V-68" fill="none" stroke="#857b66" stroke-width="1.3"/>`;
 s+=`<circle cx="-40" cy="-140" r="9" fill="#e8e4dc" stroke="none" opacity=".75"/><circle cx="-30" cy="-152" r="7" fill="#e8e4dc" stroke="none" opacity=".55"/>`;
 s+=`<path d="M-72,0 V-52 H6 V0Z" fill="#b9ad92"/><path d="M-72,-36 H6 M-72,-18 H6 M-52,0 V-18 M-24,0 V-18 M-12,-18 V-36 M-40,-18 V-36 M-60,-36 V-52 M-30,-36 V-52" fill="none" stroke="#968a70" stroke-width="1.2"/>`;
 s+=`<path d="M-50,0 V-24 Q-33,-40 -16,-24 V0Z" fill="#3a2a22"/><path d="M-44,0 Q-42,-16 -33,-20 Q-28,-12 -24,-16 Q-20,-8 -22,0Z" fill="#f08a3a" stroke="none"/><path d="M-38,0 Q-36,-10 -31,-12 Q-28,-4 -28,0Z" fill="#f5d34a" stroke="none"/>`;
 s+=`<rect x="-76" y="-58" width="86" height="8" rx="2" fill="#7a5235"/>`;
 /* 鐵砧 */
 s+=`<g transform="translate(26,0)"><path d="M-8,0 L-6,-10 H6 L8,0Z" fill="#5a5e6a"/><path d="M-16,-10 H14 Q20,-12 22,-16 H-20 Q-20,-12 -16,-10Z" fill="#6a6f7c"/><path d="M-14,-16 H18" fill="none" stroke="#9aa2ad" stroke-width="1.4"/><path d="M-4,-18 H10" fill="none" stroke="#f5a04a" stroke-width="2.4"/></g>`;
 s+=act(56,0,-1,{view:'side',pose:'up',hat:-1,hs:1,skin:'#c98d5e',shirt:'#6a5a48',top:'tank',bottom:'pants',pants:'#4a3f36',
  extra:`<path d="M21,-25 L28,-38" fill="none" stroke="#7a5235" stroke-width="3"/><rect x="23" y="-44" width="12" height="7" rx="1.4" fill="#5a5e6a" stroke-width="1.4" transform="rotate(30 29 -40)"/>`},'work');
 return s};
const horse=(c='#a8703f',m='#4a3424',bl='#3f6f9a')=>sh(36,6)+
 `<path d="M-28,-30 Q-42,-24 -37,-4" fill="none" stroke="${OL}" stroke-width="7.6" stroke-linecap="round"/><path d="M-28,-30 Q-42,-24 -37,-4" fill="none" stroke="${m}" stroke-width="5" stroke-linecap="round"/>`+
 [-22,-13,15,24].map(x=>`<path d="M${x},-16 V-2" fill="none" stroke="${OL}" stroke-width="7.4" stroke-linecap="round"/><path d="M${x},-16 V-2" fill="none" stroke="${c}" stroke-width="4.6" stroke-linecap="round"/><rect x="${x-3.6}" y="-3" width="7.2" height="4" rx="1.2" fill="#3a2a22" stroke-width="1.1"/>`).join('')+
 `<ellipse cx="0" cy="-27" rx="31" ry="14" fill="${c}"/><path d="M18,-34 Q22,-52 29,-60 L41,-52 Q31,-42 29,-22Z" fill="${c}"/>`+
 `<path d="M28,-62 Q35,-68 44,-62 L53,-48 Q53,-41 47,-41 L36,-46Z" fill="${c}"/><path d="M32,-63 l1,-9 l5,7Z" fill="${c}" stroke-width="1.4"/>`+
 `<path d="M30,-62 Q20,-52 17,-36 L22,-34 Q25,-48 33,-57Z" fill="${m}" stroke-width="1.4"/><circle cx="41" cy="-55" r="1.7" fill="${OL}" stroke="none"/><circle cx="50" cy="-45" r="1" fill="${OL}" stroke="none"/>`+
 `<path d="M-12,-40 Q0,-43 12,-40 L14,-20 Q0,-17 -14,-20Z" fill="${bl}"/><path d="M-14,-20 Q0,-17 14,-20" fill="none" stroke="#e0b44a" stroke-width="2"/>`;
const stable=()=>{let s=sh(84,8);
 s+=`<path d="M-76,0 V-82 H76 V0Z" fill="#a8784a"/>`+[-56,-36,-16,4,24,44,64].map(x=>`<path d="M${x},-82 V0" fill="none" stroke="#8a5a30" stroke-width="1.3"/>`).join('');
 s+=`<path d="M-76,-40 H76" fill="none" stroke="#7a5235" stroke-width="3"/><path d="M-20,0 V-40 H20 V0Z" fill="#8a5a30"/><path d="M-20,0 L20,-40 M-20,-40 L20,0" fill="none" stroke="#6a4228" stroke-width="2.4"/>`;
 s+=`<g transform="translate(0,-38) scale(.9)"><path d="M-6,0 Q-8,-14 -2,-22 L10,-16 Q4,-8 6,0Z" fill="#6a4a30"/><path d="M-6,-24 Q0,-30 10,-26 L18,-12 Q18,-6 12,-6 L2,-12Z" fill="#6a4a30"/><path d="M-3,-27 l1,-8 l5,6Z" fill="#6a4a30" stroke-width="1.4"/><path d="M4,-27 L-2,-18 L2,-16 L8,-24" fill="#fbf6ea" stroke="none"/><circle cx="7" cy="-20" r="1.5" fill="${OL}" stroke="none"/></g>`;
 s+=`<path d="M-62,0 Q-60,-16 -46,-18 Q-34,-22 -30,-8 Q-28,0 -30,0Z" fill="#e6c25a"/><path d="M-56,-8 l4,-6 M-48,-12 l2,-6 M-40,-10 l3,-5" fill="none" stroke="#b8902a" stroke-width="1.2"/>`;
 s+=`<path d="M-86,-80 L-72,-102 H72 L86,-80Z" fill="#7a5235"/><path d="M-80,-86 H80 M-76,-94 H76" fill="none" stroke="#5a3a22" stroke-width="1.3"/>`;
 return s};
const cart=()=>sh(44,6)+`<path d="M-34,-12 L-44,-30" fill="none" stroke="#7a5235" stroke-width="3.4"/>`+
 `<g transform="translate(-12,-22)">${barrel()}</g><g transform="translate(14,-22)">${barrel()}</g>`+
 `<path d="M-34,-22 H34 V-10 H-34Z" fill="#a8784a"/><path d="M-34,-16 H34" fill="none" stroke="#7a5235" stroke-width="1.2"/>`+
 `<circle cx="-18" cy="-6" r="10" fill="#d6c4a0"/><circle cx="-18" cy="-6" r="2.6" fill="#7a5235" stroke-width="1.2"/><path d="M-18,-16 V4 M-28,-6 H-8" fill="none" stroke="#7a5235" stroke-width="1.4"/>`+
 `<circle cx="20" cy="-6" r="10" fill="#d6c4a0"/><circle cx="20" cy="-6" r="2.6" fill="#7a5235" stroke-width="1.2"/><path d="M20,-16 V4 M10,-6 H30" fill="none" stroke="#7a5235" stroke-width="1.4"/>`;
const target=()=>sh(24,5)+`<path d="M-14,0 L-4,-44 M14,0 L4,-44 M0,4 L0,-30" fill="none" stroke="#7a5235" stroke-width="3"/>`+
 `<circle cx="0" cy="-42" r="19" fill="#fbf6ea"/><circle cx="0" cy="-42" r="14" fill="#c4473a" stroke-width="1.4"/><circle cx="0" cy="-42" r="9" fill="#fbf6ea" stroke-width="1.4"/><circle cx="0" cy="-42" r="4.4" fill="#e0b44a" stroke-width="1.3"/>`+
 `<path d="M4,-44 L20,-50" fill="none" stroke="#7a5235" stroke-width="2"/><path d="M18,-52 l5,-1 l-2,4 M18,-48 l5,1 l-3,-4" fill="#f4ecd6" stroke-width="1"/>`;
const dummy=()=>sh(20,5)+`<path d="M0,2 V-58" fill="none" stroke="${OL}" stroke-width="6"/><path d="M0,2 V-58" fill="none" stroke="#8a6a40" stroke-width="3.6"/>`+
 `<path d="M-22,-44 H22" fill="none" stroke="${OL}" stroke-width="5.4" stroke-linecap="round"/><path d="M-22,-44 H22" fill="none" stroke="#8a6a40" stroke-width="3" stroke-linecap="round"/>`+
 `<path d="M-11,-16 Q-14,-36 -9,-46 H9 Q14,-36 11,-16 Q0,-12 -11,-16Z" fill="#d9b86a"/><path d="M-10,-30 H10 M-11,-22 H11" fill="none" stroke="#a8843f" stroke-width="1.6"/>`+
 `<circle cx="0" cy="-56" r="9" fill="#d9b86a"/><path d="M-6,-58 l3,3 M-3,-58 l-3,3 M3,-58 l3,3 M6,-58 l-3,3" fill="none" stroke="#7a5235" stroke-width="1.2"/>`+
 `<g transform="translate(22,-38)"><path d="M-8,-10 H8 V0 Q8,8 0,12 Q-8,8 -8,0Z" fill="#a8784a"/><path d="M0,-10 V12 M-8,-2 H8" fill="none" stroke="#7a5235" stroke-width="1.4"/></g>`;
const flagPole=(c=pk(['#b8402e','#3f6f9a','#4a6a3a']))=>sh(12,4)+`<path d="M0,2 V-104" fill="none" stroke="${OL}" stroke-width="5"/><path d="M0,2 V-104" fill="none" stroke="#a8784a" stroke-width="2.8"/><circle cx="0" cy="-107" r="4" fill="#e0b44a" stroke-width="1.4"/>`+
 wavFlag(2,-101,46,24,c,'sw',(FLC++)*1.7+.5)+`<circle cx="13" cy="-89" r="4" fill="#e0b44a" stroke-width="1.2"/>`+
 `<rect x="-7" y="-4" width="14" height="6" rx="1.4" fill="#b9ad92"/>`;
const rack=()=>sh(34,5)+`<path d="M-28,0 V-42 M28,0 V-42 M-30,-40 H30 M-30,-14 H30" fill="none" stroke="${OL}" stroke-width="5.4"/><path d="M-28,0 V-42 M28,0 V-42 M-30,-40 H30 M-30,-14 H30" fill="none" stroke="#8a6a40" stroke-width="3"/>`+
 [-18,-6,6].map(x=>`<path d="M${x},-12 V-58" fill="none" stroke="${OL}" stroke-width="4.4"/><path d="M${x},-12 V-58" fill="none" stroke="#c9a46a" stroke-width="2.4"/><path d="M${x-5},-24 H${x+5}" fill="none" stroke="#7a5235" stroke-width="2.6"/>`).join('')+
 `<path d="M18,-10 V-70" fill="none" stroke="${OL}" stroke-width="4"/><path d="M18,-10 V-70" fill="none" stroke="#8a6a40" stroke-width="2.2"/><path d="M18,-70 l-3,-2 l3,-9 l3,9Z" fill="#c9ced6" stroke-width="1.2"/>`;
const sacks=()=>sh(24,5)+`<path d="M-20,0 Q-23,-16 -14,-22 L-16,-26 H-6 L-8,-22 Q2,-16 -1,0Z" fill="#d9c49a"/><path d="M-16,-26 H-6" fill="none" stroke="#8a6a3a" stroke-width="2"/>`+
 `<path d="M-2,0 Q-5,-18 5,-24 L3,-28 H13 L11,-24 Q21,-18 18,0Z" fill="#e2cfa8"/><path d="M3,-28 H13" fill="none" stroke="#8a6a3a" stroke-width="2"/><path d="M2,-10 q6,-3 12,0" fill="none" stroke="#b8a070" stroke-width="1.2"/>`;
const planter=()=>sh(34,4)+`<rect x="-30" y="-12" width="60" height="12" rx="2" fill="#a8784a"/><path d="M-30,-6 H30" fill="none" stroke="#7a5235" stroke-width="1.2"/>`+
 `<path d="M-28,-12 Q-26,-22 -18,-20 Q-12,-26 -6,-18 Q2,-26 8,-18 Q14,-24 20,-18 Q28,-22 28,-12Z" fill="#6f9a4a"/>`+
 [[-20,-20,'#d8413a'],[-8,-22,'#e0b44a'],[4,-21,'#f0a8a0'],[16,-20,'#d8413a'],[24,-16,'#e0b44a'],[-26,-15,'#f0a8a0']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="3.4" fill="${c}" stroke-width="1.1"/>`).join('');
/* 信鴿（目標）：背上揹著紅色小信筒，躲在木桶堆後面，只露出上半身 */
const pigeon=()=>`<path d="M-10,0 Q-14,-14 -4,-20 Q6,-24 12,-14 Q16,-6 12,0Z" fill="#9aa6b8"/><path d="M-12,-8 Q-20,-12 -18,-4 Q-14,-2 -10,-4Z" fill="#7c889c" stroke-width="1.3"/>`+
 `<path d="M-2,-18 Q4,-22 8,-16 Q6,-11 0,-12Z" fill="#6fae9a" stroke="none"/><path d="M0,-16 Q5,-19 8,-14" fill="none" stroke="#9a6fb0" stroke-width="2"/>`+
 `<circle cx="5" cy="-24" r="7" fill="#9aa6b8"/><circle cx="7" cy="-25" r="1.6" fill="${OL}" stroke="none"/><circle cx="7" cy="-25" r="3" fill="none" stroke="#e8742a" stroke-width="1"/><path d="M11,-24 L16,-22 L11,-21Z" fill="#e0a85a" stroke-width="1.1"/><path d="M11,-25 q2,-1 3,0" fill="none" stroke="#fbf6ea" stroke-width="1.6"/>`+
 `<g transform="translate(-7,-15) rotate(-24)"><rect x="-8" y="-3.4" width="16" height="6.8" rx="3.2" fill="#d8413a" stroke-width="1.5"/><path d="M-4,-3.4 V3.4 M4,-3.4 V3.4" fill="none" stroke="#e0b44a" stroke-width="1.4"/></g><path d="M-2,-12 L-10,-20" fill="none" stroke="#7a5235" stroke-width="1.4"/>`;
const barrelPile=()=>sh(42,6)+`<g transform="translate(-24,0) scale(1.15)">${barrel()}</g><g transform="translate(24,0) scale(1.1)">${crate()}</g>`+T(2,-20,1,pigeon())+
 `<g transform="translate(2,2)">${sacks()}</g>`;

/* ---- 佈景圖鑑（KIND）：場地外、POOL、干擾物都要登記 ---- */
const dk=(id,w,h,cy=-12)=>({w,h,fn:()=>T(0,cy,1,DECOY[id])});
H.L17={sh,horse,guard,stall,cart,target,dummy,flagPole,rack,sacks,HAT_HOOD,HAT_BERET,HAT_KER,HAT_HELM,HAT_CHEF,tube};  /* 2026-11-26h 加寬區、選項圖共用 */
const STALLC=[['#c4473a','#fbf6ea','fruit'],['#3f6f9a','#fbf6ea','cloth'],['#e0b44a','#b8402e','bread'],['#4a6a3a','#f1e6cc','pots'],['#7a4f8a','#f1e6cc','cloth'],['#c4473a','#e0b44a','fruit']];
Object.assign(KIND,{
 stall17:{w:124,h:114,fn:()=>{const c=pk(STALLC);return stall(c[0],c[1],c[2])}},well17:{w:76,h:106,fn:well},forge17:{w:150,h:150,fn:forge},
 horse17:{w:96,h:72,fn:()=>horse(pk(['#a8703f','#6a4a30','#d9c4a0','#4a3a32']),pk(['#4a3424','#2b2420','#f1e6cc']),pk(['#3f6f9a','#b8402e','#4a6a3a']))},
 stable17:{w:172,h:104,fn:stable},cart17:{w:90,h:52,fn:cart},target17:{w:44,h:64,fn:target},dummy17:{w:50,h:68,fn:dummy},
 flag17:{w:34,h:112,fn:()=>flagPole()},rack17:{w:66,h:72,fn:rack},sacks17:{w:44,h:30,fn:sacks},planter17:{w:66,h:26,fn:planter},
 bucket17:dk('bucket17',28,32,-2),potlid17:dk('potlid17',34,24,-4),ring17:dk('ring17',28,32,-4),rpin17:dk('rpin17',40,22,-2),
 croissant17:dk('croissant17',36,22,-2),gourd17:dk('gourd17',26,40,-6),hglass17:dk('hglass17',24,36,-6),glove17:dk('glove17',24,38,-6)});
['stall17','well17','cart17','stable17','forge17','sacks17','horse17','rack17'].forEach(k=>H.OCCK.add(k));

/* ================= 3b. 加寬區（2026-11-26h 難度調整：場景 x 250～2250）＝使用者選：西 菜園 1B、鷹架 2B（老鷹 E）、養蜂 3D、酒窖 4D；東 帳篷 1C、比武場 2B、果園 3B；小組 W1～W5、E1～E5 全留 ================= */
const X17=(()=>{
const ln=(d,c,w=2)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const wood='#a8784a',woodD='#7a5235';
/* ---------- 西 1：城堡菜園 ---------- */
const bed=(w,h,crop)=>{let s=`<path d="M${-w/2},0 Q${-w/2-4},${-h/2} ${-w/2+4},${-h} H${w/2-4} Q${w/2+4},${-h/2} ${w/2},0Z" fill="#8a6440"/>`;
 for(let x=-w/2+12;x<w/2-6;x+=16){const y=-h/2;
  if(crop==='carrot')s+=`<path d="M${x},${y} l-5,-9 M${x},${y} l0,-11 M${x},${y} l5,-9" fill="none" stroke="#5f8a3a" stroke-width="2.6" stroke-linecap="round"/><path d="M${x-3},${y} h6" stroke="#e8742a" stroke-width="3.4" stroke-linecap="round"/>`;
  else if(crop==='cab')s+=`<circle cx="${x}" cy="${y-3}" r="6.4" fill="#9cc46a" stroke-width="1.3"/><path d="M${x-3},${y-4} Q${x},${y-7} ${x+3},${y-4}" fill="none" stroke="#6f9a44" stroke-width="1.2"/>`;
  else s+=`<path d="M${x},${y+2} q-6,-6 -2,-12 q4,6 2,12 q2,-8 8,-10 q-2,8 -8,10Z" fill="#7aa856" stroke-width="1.2"/>`}
 return s};
const fence=(x0,x1,y)=>{let s=ln(`M${x0},${y-10} H${x1} M${x0},${y-20} H${x1}`,OL,4.4)+ln(`M${x0},${y-10} H${x1} M${x0},${y-20} H${x1}`,'#c9a06a',2.4);
 for(let x=x0;x<=x1;x+=22)s+=`<path d="M${x-3},${y} V${y-24} l3,-4 l3,4 V${y}Z" fill="#c9a06a" stroke-width="1.3"/>`;return s};
const scarecrow=()=>sh(16,4)+tube('M0,2 V-58','#8a6a40',3)+tube('M-24,-40 H24','#8a6a40',2.6)+
 `<path d="M-14,-44 H14 L12,-16 H-12Z" fill="#b8402e"/><path d="M-24,-40 l-5,4 M-24,-40 l-5,-2 M24,-40 l5,4 M24,-40 l5,-2" stroke="#e0c060" stroke-width="2" fill="none"/><path d="M-8,-30 l4,3 M4,-24 l5,-2" stroke="#e0b44a" stroke-width="2.2" fill="none"/>`+
 `<circle cx="0" cy="-54" r="10" fill="#e8d49a"/><circle cx="-3.5" cy="-55" r="1.4" fill="${OL}" stroke="none"/><circle cx="3.5" cy="-55" r="1.4" fill="${OL}" stroke="none"/><path d="M-4,-50 Q0,-47 4,-50" fill="none" stroke-width="1.3"/>`+
 `<ellipse cx="0" cy="-62" rx="17" ry="4" fill="#d9b860"/><path d="M-9,-62 Q-9,-76 0,-76 Q9,-76 9,-62Z" fill="#d9b860"/>`;
const shed=()=>sh(34,5)+`<path d="M-30,0 V-46 H30 V0Z" fill="${wood}"/>`+[-18,-6,6,18].map(x=>ln(`M${x},-46 V0`,'#8a5a30',1.2)).join('')+
 `<path d="M-38,-44 L0,-66 L38,-44Z" fill="#8a5a3a"/>`+tube('M-20,-6 L-12,-40','#8a6a40',2)+`<path d="M-15,-42 h10 v6 h-10Z" fill="#8a929c" stroke-width="1.2"/>`+tube('M10,-4 L16,-40','#8a6a40',2)+`<path d="M12,-42 l8,0 l-2,8 l-4,0Z" fill="#8a929c" stroke-width="1.2"/>`;
const can=`<g transform="translate(40,-2)"><path d="M-8,0 V-14 Q0,-18 8,-14 V0Z" fill="#6a9a7a"/><path d="M8,-12 L18,-20" stroke="${OL}" stroke-width="4" fill="none"/><path d="M8,-12 L18,-20" stroke="#6a9a7a" stroke-width="2.2" fill="none"/><path d="M-6,-16 Q0,-26 6,-16" fill="none" stroke-width="2"/></g>`;
const raised=()=>{let s='';[[-34,'carrot'],[34,'cab']].forEach(([x,c])=>{s+=T(x,0,1,`<path d="M-28,0 V-16 H28 V0Z" fill="${wood}"/><path d="M-28,-8 H28" fill="none" stroke="#8a5a30" stroke-width="1.3"/><path d="M-26,-16 H26 V-19 H-26Z" fill="#6a4a30" stroke-width="1.2"/>`+T(0,-12,1,bed(52,10,c).replace(/fill="#8a6440"/,'fill="none" stroke="none"')))});return s};
const garden=[
 ()=>sh(70,6)+T(0,-36,1,bed(130,14,'carrot'))+T(0,-16,1,bed(140,14,'cab'))+T(0,4,1,bed(150,14,'leaf'))+fence(-70,70,-46),
 ()=>sh(70,6)+T(-14,-26,1,bed(120,14,'carrot'))+T(-14,-4,1,bed(130,14,'cab'))+T(62,6,1,scarecrow()),
 ()=>sh(70,6)+raised()+can,
 ()=>sh(70,6)+T(-36,-20,1,bed(90,14,'cab'))+T(-36,2,1,bed(96,14,'carrot'))+T(52,4,1,shed())];
/* ---------- 西 2：鷹匠鷹架 ---------- */
const hawk=(c='#8a5a30',b='#e8d6b0',fl=1)=>`<g transform="scale(${fl},1)"><path d="M-4,0 l-2,4 M4,0 l2,4" stroke="#e0b44a" stroke-width="2" fill="none"/><path d="M-9,-2 Q-11,-18 0,-22 Q10,-18 9,-2 Q0,2 -9,-2Z" fill="${c}"/><path d="M-5,-4 Q-6,-14 0,-16 Q6,-14 5,-4Z" fill="${b}" stroke="none"/>`+
 `<path d="M-3,-10 l2,2 M2,-8 l2,2 M-2,-6 l2,2" stroke="#8a6a40" stroke-width="1" fill="none"/><path d="M-4,-2 L-2,10 L2,10 L4,-2Z" fill="${c}" stroke-width="1.2"/><circle cx="0" cy="-26" r="7" fill="${c}"/><circle cx="2.6" cy="-27" r="1.4" fill="${OL}" stroke="none"/><path d="M6,-26 l4,2 l-4,1Z" fill="#e0b44a" stroke-width="1"/></g>`;
/* 2026-11-26h 使用者選老鷹 E：戴皮頭罩、紅羽飾、腳上皮繩 */
function raptor(o={}){const b=o.body||'#8a5a30',w=o.wing||H.tone?o.wing||'#6a4426':'#6a4426',be=o.belly||'#e8d6b0',hd=o.head||b,bk=o.beak||'#e0b44a';let s='';
 if(o.spread)s+=`<path d="M-6,-26 Q-26,-40 -40,-30 Q-34,-26 -36,-20 Q-28,-22 -28,-14 Q-20,-18 -14,-12 Z" fill="${w}"/><path d="M-30,-28 l-4,6 M-24,-26 l-3,7 M-18,-22 l-2,6" stroke="${o.wl||'#4a2e18'}" stroke-width="1.2" fill="none"/>`+
  `<path d="M6,-26 Q22,-46 38,-40 Q32,-34 36,-28 Q28,-28 30,-20 Q22,-22 14,-14 Z" fill="${w}"/><path d="M28,-36 l2,7 M22,-32 l1,7 M16,-27 l0,6" stroke="${o.wl||'#4a2e18'}" stroke-width="1.2" fill="none"/>`;
 s+=`<path d="M-7,-6 L-13,11 Q-8,13 -3,11 L-1,-4Z" fill="${o.tail||w}"/>`+(o.tailBars?`<path d="M-11,4 H-3 M-12,8 H-3" stroke="${o.wl||'#4a2e18'}" stroke-width="1.2" fill="none"/>`:'');
 s+=`<path d="M-10,-6 Q-12,-24 -1,-30 Q11,-30 11,-16 Q11,-2 2,0 Q-6,0 -10,-6Z" fill="${b}"/>`;
 s+=`<path d="M-1,-4 Q-5,-14 1,-25 Q9,-23 9,-13 Q8,-4 2,-2Z" fill="${be}" stroke="none"/>`;
 if(o.spots)s+=[[2,-20],[5,-15],[1,-12],[6,-9],[3,-7]].map(([x,y])=>`<path d="M${x-1.4},${y} q1.4,2 2.8,0" fill="${o.spots}" stroke="${o.spots}" stroke-width="1.2"/>`).join('');
 if(o.bars)s+=[-20,-16,-12,-8].map(y=>`<path d="M0,${y} q4,1.6 8,0" fill="none" stroke="${o.bars}" stroke-width="1.1"/>`).join('');
 if(!o.spread)s+=`<path d="M-11,-25 Q-3,-29 3,-22 Q3,-10 -5,4 L-12,9 Q-15,-8 -11,-25Z" fill="${w}"/><path d="M-9,-14 Q-5,-12 -2,-16 M-10,-6 Q-6,-4 -3,-8 M-11,2 Q-8,2 -6,-1" stroke="${o.wl||'#4a2e18'}" stroke-width="1.2" fill="none"/>`;
 s+=`<path d="M-3,-2 Q-4,2 -1,3 M5,-2 Q6,2 3,3" stroke="${OL}" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="M-3,-2 Q-4,2 -1,3 M5,-2 Q6,2 3,3" stroke="${be}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
 s+=`<path d="M-4,2 l-3,3 M-1,3 l0,3 M2,2 l2,3 M5,3 l3,2" stroke="#e0b44a" stroke-width="2" fill="none" stroke-linecap="round"/>`;
 if(o.jess)s+=`<path d="M0,3 q-3,8 1,14 M3,3 q2,8 -1,13" stroke="#a8703f" stroke-width="1.6" fill="none"/><circle cx="1" cy="-1" r="1.6" fill="#e0b44a" stroke-width=".8"/>`;
 s+=`<circle cx="4" cy="-33" r="8.4" fill="${hd}"/>`;
 if(o.cheek)s+=`<path d="M3,-27 Q8,-30 11,-27 Q9,-24 5,-24Z" fill="${o.cheek}" stroke="none"/>`;
 if(o.mask)s+=`<path d="M6.6,-31 Q7,-27 4.4,-25" stroke="${o.mask}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
 s+=`<path d="M11,-35.5 Q17,-36 16.4,-30 Q16,-28 14.4,-29.6 L13,-31 L11,-31Z" fill="${bk}" stroke-width="1.4"/>`;
 if(o.hood)s+=`<path d="M-4,-33 Q-4,-43 4,-43 Q12,-43 12.6,-34 L10,-30 H-2Z" fill="${o.hood}"/><path d="M4,-43 Q2,-50 6,-54 Q7,-48 5,-43" fill="#c4473a" stroke-width="1.1"/><path d="M-2,-32 H10" stroke="#e0b44a" stroke-width="1.4" fill="none"/>`;
 else s+=`<circle cx="8" cy="-34" r="2.5" fill="${o.ring||'#f2c94c'}" stroke-width="1"/><circle cx="8.4" cy="-34" r="1.3" fill="${OL}" stroke="none"/><path d="M4.4,-37.6 L11.4,-36.4" stroke="${o.brow||'#3a2414'}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
 return s}
const hawkE=(b='#8a5a30',hd='#7a5235',fl=1)=>`<g transform="scale(${.82*fl},.82)">${raptor({body:b,hood:hd,tailBars:1,spots:'#a8703f',jess:1})}</g>`;
const hood=`<path d="M-6,-30 Q-7,-38 0,-38 Q7,-38 6,-30Z" fill="#7a5235" stroke-width="1.2"/><path d="M0,-38 v-4" stroke="#b8402e" stroke-width="2" fill="none"/>`;
const perchT=(h=58)=>sh(22,4)+tube(`M0,2 V-${h}`,'#8a6a40',3.4)+tube(`M-18,-${h} H18`,'#8a6a40',3)+tube('M-10,0 L0,-14 L10,0','#8a6a40',2.4);
const mews=()=>sh(48,6)+`<path d="M-44,0 V-52 H44 V0Z" fill="#c9bfa6"/><path d="M-44,-18 H44 M-44,-36 H44" fill="none" stroke="#a89e86" stroke-width="1.2"/><path d="M-52,-50 L0,-80 L52,-50Z" fill="#7a5a4a"/>`+
 [-24,0,24].map(x=>`<path d="M${x-8},-14 V-36 Q${x},-44 ${x+8},-36 V-14Z" fill="#3a3040"/>`+ln(`M${x-4},-14 V-38 M${x+4},-14 V-38`,'#8a6a40',1.4)).join('');
const glovePost=()=>sh(14,4)+tube('M0,2 V-44','#8a6a40',3)+`<path d="M-8,-46 Q-10,-56 -4,-60 L-2,-52 L2,-62 L6,-52 Q10,-56 8,-46Z" fill="#a8703f" stroke-width="1.4"/>`;
const falcon=[
 ()=>T(0,0,1,perchT())+T(0,-60,1,hawk()),
 ()=>sh(66,5)+tube('M-56,2 V-46 M56,2 V-46','#8a6a40',3.4)+tube('M-62,-46 H62','#8a6a40',3.4)+T(-38,-48,1,hawkE('#8a5a30','#7a5235'))+T(0,-48,1,hawkE('#a8703f','#5a3a24',-1))+T(38,-48,1,hawkE('#6a4426','#8a5a3a')),
 ()=>T(-26,0,1,mews())+T(58,6,1,perchT(50))+T(58,-46,1,hawk('#5a5048','#d9d2c0',-1)),
 ()=>`<ellipse cx="0" cy="-6" rx="78" ry="26" fill="#bdc77e" stroke="#9aa65a" stroke-width="2" stroke-dasharray="10 6"/>`+T(0,0,1,perchT(64))+T(0,-66,1,hawk())+T(-52,-2,1,glovePost())+T(50,-2,1,`<path d="M-10,0 V-16 H10 V0Z" fill="#c99a5b"/><path d="M-10,-8 H10" stroke="#8a6a40" stroke-width="1.2" fill="none"/>`)];
/* ---------- 西 3：養蜂場 ---------- */
const skep=()=>`<path d="M-15,0 Q-17,-22 0,-28 Q17,-22 15,0Z" fill="#e0b860"/>`+[-6,-12,-18,-23].map(y=>`<path d="M${-15+(y<-18?5:y<-10?2:0)},${y} Q0,${y-3} ${15-(y<-18?5:y<-10?2:0)},${y}" fill="none" stroke="#b8902a" stroke-width="1.3"/>`).join('')+`<path d="M-4,0 Q0,-6 4,0Z" fill="#3a3040" stroke-width="1"/>`;
const box=(c='#f1e6cc')=>`<path d="M-14,0 V-30 H14 V0Z" fill="${c}"/><path d="M-14,-10 H14 M-14,-20 H14" fill="none" stroke="#c9b48a" stroke-width="1.3"/><path d="M-17,-30 H17 V-35 H-17Z" fill="#a8784a" stroke-width="1.4"/><path d="M-5,-2 h10" stroke="#3a3040" stroke-width="2.2" fill="none"/>`;
const bee=(x,y)=>`<g transform="translate(${x},${y})"><ellipse cx="0" cy="0" rx="3.4" ry="2.4" fill="#e8c04a" stroke-width="1"/><path d="M-1,-2.2 V2.2 M1.4,-2 V2" stroke="${OL}" stroke-width="1" fill="none"/><ellipse cx="-1" cy="-3.4" rx="2" ry="1.4" fill="#fff" stroke-width=".8" opacity=".9"/></g>`;
const bees=(pts)=>wrapAn('float',pts.map(([x,y])=>bee(x,y)).join(''),true);
const fl=(x,y,c)=>`<circle cx="${x}" cy="${y}" r="3.2" fill="${c}" stroke-width="1"/><circle cx="${x}" cy="${y}" r="1.2" fill="#e8c04a" stroke="none"/>`;
const bench=(w)=>`<path d="M${-w/2},-14 H${w/2} V-18 H${-w/2}Z" fill="${wood}"/>`+ln(`M${-w/2+6},0 V-14 M${w/2-6},0 V-14`,woodD,3);
const apiary=[
 ()=>sh(54,5)+bench(100)+T(-30,-18,1,skep())+T(0,-18,1,skep())+T(30,-18,1,skep())+bees([[-20,-58],[14,-64],[34,-52]]),
 ()=>sh(60,5)+T(-40,0,1,box())+T(-10,0,1,box('#e8d49a'))+T(20,0,1,box())+T(50,0,1,box('#d9e0c0'))+bees([[-26,-48],[6,-56],[40,-46]]),
 ()=>sh(60,5)+T(-26,0,1,skep())+T(8,0,1,skep())+[[30,-2,'#d8413a'],[40,4,'#7a4f8a'],[50,-4,'#e0b44a'],[44,-10,'#fbf6ea'],[56,6,'#d8413a'],[-54,0,'#7a4f8a'],[-50,6,'#e0b44a'],[-60,-6,'#fbf6ea']].map(([x,y,c])=>fl(x,y,c)).join('')+bees([[-34,-40],[0,-44],[34,-22],[50,-30]]),
 ()=>sh(60,5)+tube('M-50,2 V-60 M50,2 V-60','#8a6a40',3.2)+`<path d="M-60,-58 L0,-78 L60,-58 L56,-52 L0,-70 L-56,-52Z" fill="#c9a06a"/>`+[-46,-32,-18,-4,10,24,38].map(x=>ln(`M${x},-56 L${x+8},-70`,'#a8784a',1)).join('')+bench(96)+T(-28,-18,1,skep())+T(0,-18,1,box())+T(28,-18,1,skep())+bees([[-60,-30],[62,-24]])];
/* ---------- 西 4：酒窖倉庫 ---------- */
const keg=(c='#a8703f')=>`<path d="M-13,0 Q-16,-11 -13,-22 H13 Q16,-11 13,0Z" fill="${c}"/><path d="M-14,-5 H14 M-14,-17 H14" stroke="#5a5e6a" stroke-width="2.2" fill="none"/><path d="M-5,-22 Q-7,-11 -5,0 M5,-22 Q7,-11 5,0" stroke="#8a5a30" stroke-width="1" fill="none"/>`;
const kegS=()=>`<ellipse cx="0" cy="-11" rx="13" ry="11" fill="#a8703f"/><ellipse cx="0" cy="-11" rx="8" ry="7" fill="none" stroke="#5a5e6a" stroke-width="2"/><circle cx="0" cy="-11" r="2" fill="#5a3a24" stroke="none"/>`;
const pyr=()=>{let s='';[[-36,0],[-12,0],[12,0],[36,0],[-24,-22],[0,-22],[24,-22],[-12,-44],[12,-44],[0,-66]].forEach(([x,y])=>s+=T(x,y,1,kegS()));return s};
const crane=()=>sh(30,4)+tube('M-10,2 V-86','#8a6a40',4)+tube('M-10,-82 H50','#8a6a40',3.4)+tube('M-10,-60 L14,-82','#8a6a40',2.4)+ln('M44,-82 V-46','#5a5e6a',1.6)+T(44,-22,1,keg())+ln('M44,-46 L36,-24 M44,-46 L52,-24','#5a5e6a',1.2)+`<circle cx="-10" cy="-30" r="6" fill="#c99a5b" stroke-width="1.4"/>`;
const cellar=()=>sh(50,5)+`<path d="M-44,0 Q-46,-22 -30,-30 H30 Q46,-22 44,0Z" fill="#c9bfa6"/><path d="M-30,0 L-24,-22 H24 L30,0Z" fill="#4a3a30"/><path d="M-30,0 L-24,-22 H0 L0,0Z" fill="#8a5a3a" transform="skewX(-8)"/>`+ln('M-14,-18 V-2 M-4,-18 V-2','#6a4a30',1.3)+`<circle cx="-6" cy="-10" r="2" fill="#5a5e6a" stroke-width="1"/>`+[[-46,-4],[48,-6]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="#b8ad90" stroke-width="1.2"/>`).join('');
const wshed=()=>sh(66,6)+tube('M-60,2 V-64 M60,2 V-64','#8a6a40',3.4)+`<path d="M-70,-62 L0,-84 L70,-62 L66,-56 L0,-76 L-66,-56Z" fill="#8a5a3a"/>`+`<path d="M-60,0 V-56 H60 V0Z" fill="#5a4a3a" opacity=".35" stroke="none"/>`;
const cellarO=[
 ()=>sh(54,5)+pyr(),
 ()=>T(-30,0,1,crane())+T(30,0,1,cart())+T(64,0,1,keg()),
 ()=>T(-6,0,1,cellar())+T(-62,6,1,keg())+T(58,8,1,kegS())+T(70,-6,1,keg('#8a5a30')),
 ()=>wshed()+T(-34,0,1,keg())+T(-8,0,1,keg('#8a5a30'))+T(18,0,1,keg())+T(44,0,1,keg('#8a5a30'))+T(-20,-24,1,keg('#8a5a30'))+T(6,-24,1,keg())];
/* ---------- 東 1：騎士帳篷 ---------- */
const pav=(c1='#c4473a',c2='#fbf6ea',w=46,h=70,flag='#e0b44a')=>{let st='';for(let i=1;i<8;i+=2){const a=-w+i*(2*w)/8,b=a+(2*w)/8;st+=`<path d="M0,-${h} L${a},0 H${b}Z" fill="${c2}" stroke="none"/>`}
 return sh(w+4,5)+`<path d="M${-w},0 L${-w+4},-${h*.45} L0,-${h} L${w-4},-${h*.45} L${w},0Z" fill="${c1}"/>`+st+`<path d="M${-w},0 L${-w+4},-${h*.45} L0,-${h} L${w-4},-${h*.45} L${w},0Z" fill="none"/>`+
 [...Array(7)].map((_,i)=>{const x=-w+4+i*(2*w-8)/6;return `<path d="M${x-6},-${h*.45} q6,8 12,0" fill="${c2}" stroke-width="1.2"/>`}).join('')+
 `<path d="M-9,0 L0,-${h*.4} L9,0Z" fill="#3a3040"/>`+tube(`M0,-${h} V-${h+22}`,'#8a6a40',2)+`<path d="M1,-${h+22} L16,-${h+17} L1,-${h+12}Z" fill="${flag}" stroke-width="1.3"/>`};
const sqTent=(c1='#3f6f9a',c2='#e0b44a')=>sh(54,5)+`<path d="M-48,0 V-40 H48 V0Z" fill="${c1}"/>`+[-36,-12,12,36].map(x=>`<path d="M${x-6},0 V-40 H${x+6} V0Z" fill="${c2}" stroke="none"/>`).join('')+`<path d="M-48,0 V-40 H48 V0Z" fill="none"/><path d="M-54,-38 L0,-70 L54,-38Z" fill="${c1}"/>`+[-30,-10,10,30].map(x=>`<path d="M${x*.1},-68 L${x-5},-40 H${x+5}Z" fill="${c2}" stroke="none"/>`).join('')+`<path d="M-54,-38 L0,-70 L54,-38Z" fill="none"/>`+`<path d="M-12,0 V-34 H12 V0Z" fill="#3a3040"/><path d="M-12,-34 Q-20,-14 -14,0 L-10,0 Q-14,-18 -6,-34Z" fill="${c1}" stroke-width="1.3"/>`+tube('M0,-70 V-90','#8a6a40',2)+`<path d="M1,-90 L18,-85 L1,-80Z" fill="${c1}" stroke-width="1.3"/>`;
const armorStand=()=>sh(16,4)+tube('M0,2 V-40 M-8,2 L0,-10 L8,2','#8a6a40',2.4)+`<path d="M-11,-40 H11 L9,-18 H-9Z" fill="#c4cad2"/><path d="M-4,-36 Q0,-24 4,-36" fill="none" stroke="#8a929c" stroke-width="1.3"/><path d="M-8,-44 Q-9,-58 0,-58 Q9,-58 8,-44Z" fill="#c4cad2"/><path d="M-6,-50 H6" stroke="#3a3040" stroke-width="2"/>`;
const kShield=(c='#3f6f9a',c2='#e0b44a')=>`<path d="M-11,-26 H11 V-12 Q11,-2 0,4 Q-11,-2 -11,-12Z" fill="${c}"/><path d="M-6,-14 L0,-20 L6,-14" fill="none" stroke="${c2}" stroke-width="2.4"/>`;
const tents=[
 ()=>pav(),
 ()=>sqTent(),
 ()=>T(-40,-14,.8,pav('#3f6f9a','#fbf6ea',40,60,'#b8402e'))+T(36,-10,.7,pav('#4a6a3a','#e0b44a',40,60,'#fbf6ea'))+T(0,8,1,pav('#c4473a','#fbf6ea',44,66)),
 ()=>T(-20,0,1,pav('#7a4f8a','#e0b44a'))+T(48,4,1,armorStand())+T(64,6,1,kShield('#b8402e'))];
/* ---------- 東 2：馬上長槍比武場 ---------- */
const rail=(w,c='#c9a06a')=>{let s=tube(`M${-w/2},-14 H${w/2} M${-w/2},-26 H${w/2}`,c,3);for(let x=-w/2;x<=w/2;x+=w/6)s+=tube(`M${x},2 V-28`,c,2.6);return s};
const tilt=(w)=>{let s=`<path d="M${-w/2},-12 H${w/2} V-24 H${-w/2}Z" fill="#fbf6ea"/>`;for(let x=-w/2;x<w/2;x+=24)s+=`<path d="M${x},-12 H${x+12} V-24 H${x}Z" fill="#c4473a" stroke="none"/>`;return s+`<path d="M${-w/2},-12 H${w/2} V-24 H${-w/2}Z" fill="none"/>`+[-w/2+4,0,w/2-4].map(x=>tube(`M${x},2 V-12`,'#8a6a40',2.4)).join('')};
const lance=(c)=>`<path d="M-4,-30 L60,-40" stroke="${OL}" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M-4,-30 L60,-40" stroke="${c}" stroke-width="3.6" stroke-linecap="round" fill="none"/><path d="M-6,-36 L-2,-24 L4,-34Z" fill="#c4cad2" stroke-width="1.2"/>`;
const knight=(c,dir=1)=>`<g transform="scale(${dir},1)">`+horse('#d9c4a0','#f1e6cc',c)+act(-2,-26,1,{view:'side',pose:'sit',s:.82,hat:HAT_HELM,shirt:c,top:'long',bottom:'pants',pants:'#8a929c'},false)+T(2,-24,.82,lance('#e0b44a'))+`</g>`;
const stand=()=>sh(46,5)+tube('M-40,2 V-56 M40,2 V-56','#8a6a40',3)+`<path d="M-48,-54 Q-24,-46 0,-54 Q24,-46 48,-54 L44,-66 H-44Z" fill="#3f6f9a"/>`+[-36,-12,12,36].map(x=>`<path d="M${x-6},-54 q6,8 12,0" fill="#e0b44a" stroke-width="1.2"/>`).join('')+`<path d="M-40,-18 H40 V-24 H-40Z M-36,-30 H36 V-36 H-36Z" fill="${wood}"/>`+[-24,0,24].map(x=>`<circle cx="${x}" cy="-44" r="6" fill="${pk(['#f2d2b4','#c98d5e','#e8c4a0'])}" stroke-width="1.3"/>`).join('');
const quintain=()=>sh(20,4)+tube('M0,2 V-58','#8a6a40',3.4)+tube('M-30,-54 H24','#8a6a40',2.6)+`<path d="M-30,-66 H-18 V-50 Q-18,-42 -24,-40 Q-30,-42 -30,-50Z" fill="#b8402e"/>`+ln('M22,-54 V-40','#5a5e6a',1.4)+`<path d="M18,-40 Q22,-28 26,-40Z" fill="#c99a5b" stroke-width="1.2"/>`;
const joust=[
 ()=>sh(100,6)+T(0,-10,1,rail(200))+T(0,12,1,tilt(180)),
 ()=>T(0,10,1,tilt(170))+T(0,-18,.9,stand()),
 ()=>T(-56,-8,.75,knight('#3f6f9a'))+T(0,4,1,tilt(170))+T(56,22,.75,knight('#b8402e',-1))  /* 2026-11-26h 使用者：後面那位要在中間隔欄後面（先畫後面的騎士，再畫隔欄） */,
 ()=>T(-20,0,1,rail(150))+T(50,6,1,quintain())+T(-70,10,.7,horse('#6a4a30','#2b2420','#4a6a3a'))];
/* ---------- 東 3：蘋果果園 ---------- */
const apple=(x,y)=>`<circle cx="${x}" cy="${y}" r="3.6" fill="#d8413a" stroke-width="1.1"/><path d="M${x+.6},${y-3.4} l1.4,-2" stroke="#5a3a24" stroke-width="1" fill="none"/>`;
const atree=(s=1,n=7)=>{const pts=[[-18,-62],[-6,-74],[10,-66],[20,-52],[-22,-46],[4,-50],[-10,-56],[16,-74],[-2,-40]];
 return `<g transform="scale(${s})">`+sh(24,5)+tube('M0,2 Q-2,-18 0,-34','#7a5235',6)+`<path d="M-32,-40 Q-40,-62 -22,-72 Q-14,-92 6,-88 Q28,-90 30,-68 Q42,-54 30,-38 Q12,-28 0,-34 Q-18,-28 -32,-40Z" fill="#7aa856"/><path d="M-20,-46 Q-24,-62 -12,-68" fill="none" stroke="#9cc46a" stroke-width="3" stroke-linecap="round"/>`+pts.slice(0,n).map(([x,y])=>apple(x,y)).join('')+`</g>`};
const ladder=()=>tube('M-8,2 L4,-60 M8,2 L18,-58','#c9a06a',2.4)+[-10,-22,-34,-46].map(y=>ln(`M${-8+(-y)*.2},${y} L${8+(-y)*.17},${y}`,'#a8784a',2)).join('');
const basket=(n=5)=>`<path d="M-12,0 L-14,-12 H14 L12,0Z" fill="#c99a5b"/><path d="M-13,-6 H13" stroke="#a8784a" stroke-width="1.2" fill="none"/>`+[-8,-3,2,7,-5,4].slice(0,n).map((x,i)=>apple(x,i<4?-14:-18)).join('');
const espalier=()=>{let s=sh(70,5);for(let x=-54;x<=54;x+=36)s+=tube(`M${x},2 V-44`,'#8a6a40',2.4);s+=tube('M-60,-20 H60 M-60,-40 H60','#c9a06a',1.6);
 [-36,0,36].forEach(x=>{s+=tube(`M${x},2 V-38 M${x},-20 Q${x-12},-24 ${x-16},-30 M${x},-30 Q${x+12},-34 ${x+16},-40`,'#7a5235',2.6);s+=[[x-10,-28],[x+10,-36],[x-4,-40],[x+6,-22]].map(([a,b])=>`<ellipse cx="${a}" cy="${b}" rx="6" ry="4" fill="#7aa856" stroke-width="1.1"/>`).join('')+apple(x-8,-24)+apple(x+12,-40)});return s};
const orchard=[
 ()=>T(-30,-6,.85,atree())+T(30,4,1,atree()),
 ()=>T(-10,0,1,atree(1,9))+T(16,2,1,ladder()),
 ()=>T(0,0,1,atree())+T(-30,6,1,basket())+T(26,8,1,basket(3))+apple(40,4)+apple(-46,6),
 ()=>espalier()];
/* ---------- 小組（人群在做事）---------- */
const pea=(o)=>Object.assign({top:'long',bottom:'pants',hat:-1,shirt:pk(['#8a5a3a','#5f7a4a','#3f6f9a','#c99a3a']),pants:'#5a4a3a'},o);
const westX=[
 ['蹲著拔紅蘿蔔的僕人',()=>act(0,0,1,pea({view:'side',pose:'crouch',hat:HAT_KER,extra:`<path d="M14,-12 l4,-12 M14,-12 l8,-8" stroke="#5f8a3a" stroke-width="2.4" fill="none"/><path d="M12,-12 l4,8" stroke="#e8742a" stroke-width="3.4" stroke-linecap="round" fill="none"/>`}),'work')+T(30,2,1,basket(0)+`<path d="M-6,-14 l4,-4 M2,-14 l4,-4" stroke="#e8742a" stroke-width="3" stroke-linecap="round" fill="none"/>`)],
 ['鷹匠舉手讓鷹停在手套上',()=>act(0,0,1,pea({view:'side',pose:'up',hat:HAT_HOOD,shirt:'#4a6a3a'}),false)+T(22,-28,.7,`<path d="M-6,4 Q-8,-4 -2,-8 L0,0 L4,-10 L8,0 Q10,-4 8,4Z" fill="#a8703f" stroke-width="1.2"/>`+T(0,-6,1.15,hawkE()))+act(-36,2,1,pea({view:'side',pose:'up2',s:.8}),'hop')],
 ['穿防蜂衣的養蜂人拿燻煙罐',()=>act(0,0,1,pea({view:'fq',pose:'hold',hat:-1,hs:0,shirt:'#f1e6cc',pants:'#f1e6cc',extra:`<g transform="translate(16,-20)"><path d="M-4,0 V-10 H4 V0Z" fill="#8a929c" stroke-width="1.2"/><path d="M-2,-10 Q2,-18 0,-22" stroke="#d9d2c0" stroke-width="3" fill="none" opacity=".8"/></g>`}),'nod').replace(/(<circle cx="0" cy="-35" r="13"[^>]*\/>)/,'$1')+`<path d="M-15,-38 Q-15,-54 0,-54 Q15,-54 15,-38 L17,-26 Q0,-20 -17,-26Z" fill="#f1e6cc" opacity=".5"/><ellipse cx="0" cy="-48" rx="19" ry="4" fill="#f1e6cc"/><path d="M-11,-48 Q-11,-60 0,-60 Q11,-60 11,-48Z" fill="#f1e6cc"/>`+bees([[22,-50],[-24,-40]])],
 ['兩個人滾酒桶',()=>act(-30,0,1,pea({view:'side',pose:'reach',hat:HAT_HOOD}),'work')+T(0,0,1,kegS())+act(30,0,-1,pea({view:'side',pose:'low'}),'work')],
 ['小孩被蜜蜂追著跑',()=>act(0,0,-1,pea({view:'side',pose:'run',s:.8}),'hop')+bees([[24,-40],[34,-30],[30,-50]])]];
const eastX=[
 ['侍從坐著擦盔甲',()=>act(0,0,1,pea({view:'fq',pose:'sit',shirt:'#7a4f8a'}),'work')+T(26,4,.8,armorStand())],
 ['騎士騎馬緩步走',()=>T(0,0,.85,knight('#4a6a3a'))],
 ['觀眾揮旗加油',()=>act(-22,0,1,pea({view:'front',arm:2,hat:HAT_BERET}),'hop')+act(22,0,-1,pea({view:'fq',pose:'up',extra:`<path d="M20,-26 V-50" stroke="#8a6a40" stroke-width="2" fill="none"/><path d="M20,-50 L34,-46 L20,-42Z" fill="#c4473a" stroke-width="1.2"/>`}),'hop')],
 ['梯子上採蘋果',()=>T(0,0,.8,atree(1,9))+T(14,2,.8,ladder())+act(16,-26,1,pea({view:'back',pose:'up',s:.8}),false)],
 ['小孩撿蘋果放籃子',()=>act(-16,0,1,pea({view:'side',pose:'crouch',s:.8}),'work')+T(14,2,1,basket())+apple(-34,0)]];
return {garden,falcon,apiary,cellarO,tents,joust,orchard,westX,eastX,atree,ladder,basket,scarecrow,hawkE,pav,keg,kegS,bees}})();
/* 加寬區佈景：w 只算實心那段（露一角用；OCCK 的位置在 x±(w/2-r*.42)），真正佔的地方在 structures 另外 mark */
Object.assign(KIND,{garden17:{w:180,h:70,fn:X17.garden[1]},perch17:{w:130,h:90,fn:X17.falcon[1]},beeShed17:{w:100,h:80,fn:X17.apiary[3]},
 wineShed17:{w:110,h:86,fn:X17.cellarO[3]},tents17:{w:180,h:130,fn:()=>T(0,0,1.3,X17.tents[2]())},stand17:{w:140,h:90,fn:()=>T(0,0,1.15,X17.joust[2]())},appleTree17:{w:64,h:92,fn:()=>X17.atree()}});
['beeShed17','wineShed17','tents17','stand17'].forEach(k=>H.OCCK.add(k));
/* ================= 4. 12 種 × 4 個（8 種新東西＋4 種第 1 關的老朋友） ================= */
/* 老朋友：定義寫在自己檔案當後備（find 關卡檔案載入時，第 1 關一般已載入，但還是照規則寫） */
const OLD={hat:{id:'hat',name:'紫色魔法帽',short:'魔法帽',r:16,rot:20},potion:{id:'potion',name:'粉紅藥水',short:'藥水',r:15,rot:15},
 pumpkin:{id:'pumpkin',name:'南瓜燈',short:'南瓜燈',r:15,rot:10},cake:{id:'cake',name:'草莓蛋糕',short:'蛋糕',r:15,rot:12}};
const old=(id,regions)=>({...(typeOf(id)||OLD[id]),regions});
const TYPES=[
 old('hat',['market17','court17','tentE17','gardenW17']),old('potion',['market17','yard17','cellarW17','show17']),
 old('pumpkin',['yard17','gardenW17','bank17','orchardE17']),old('cake',['market17','show17','beeW17','bank17']),
 {id:'helmet17',name:'騎士頭盔',short:'頭盔',r:16,rot:10,regions:['yard17','show17','tentE17','joustE17']},
 {id:'shield17',name:'紋章盾牌',short:'盾牌',r:16,rot:12,regions:['show17','yard17','joustE17','bank17']},
 {id:'gkey17',name:'城門大鑰匙',short:'大鑰匙',r:15,rot:30,regions:['court17','market17','cellarW17','yard17']},
 {id:'scroll17',name:'封蠟捲軸信',short:'捲軸信',r:15,rot:20,regions:['market17','court17','hawkW17','bank17']},
 {id:'horn17',name:'號角',short:'號角',r:16,rot:15,regions:['show17','joustE17','hawkW17','court17']},
 {id:'lute17',name:'魯特琴',short:'魯特琴',r:16,rot:12,regions:['show17','market17','orchardE17','beeW17']},
 {id:'goblet17',name:'高腳金杯',short:'金杯',r:15,rot:8,regions:['market17','court17','cellarW17','tentE17']},
 {id:'gaunt17',name:'鐵手套',short:'鐵手套',r:15,rot:15,regions:['yard17','hawkW17','joustE17','market17']}];
/* 2026-11-26h 加寬：每種 1～2 個區域換成兩側新區（共 19 個） */
LEVELS[N].types=TYPES;
/* BORROW：不借（城堡物件不混進前面的關卡） */

/* ================= 5. 地形、水、區域 ================= */
const MOAT={y0:1806,y1:1904},BR={x0:1198,x1:1302};
const inMoat=(x,y)=>y>MOAT.y0&&y<MOAT.y1+Math.sin(x/70)*4&&!(x>BR.x0&&x<BR.x1);
WATERFN[N]=inMoat;
Object.assign(REG,{court17:{x:700,y:730,w:1100,h:300},market17:{x:680,y:1060,w:1140,h:320},yard17:{x:640,y:1400,w:500,h:260},
 show17:{x:1370,y:1400,w:490,h:260},bank17:{x:280,y:1950,w:1940,h:180},all17:{x:270,y:540,w:1960,h:1600},
 /* 2026-11-26h 加寬區：西（城牆內）菜園、鷹架、養蜂場、酒窖；東 帳篷、比武場、果園 */
 gardenW17:{x:270,y:520,w:380,h:270},hawkW17:{x:270,y:810,w:370,h:270},beeW17:{x:270,y:1100,w:370,h:270},cellarW17:{x:270,y:1390,w:380,h:280},
 tentE17:{x:1850,y:520,w:380,h:330},joustE17:{x:1860,y:870,w:370,h:380},orchardE17:{x:1860,y:1270,w:370,h:400}});
H.SCREG[N]=['court17','market17','yard17','show17','bank17','gardenW17','hawkW17','beeW17','cellarW17','tentE17','joustE17','orchardE17'];  /* 故事和路人只放廣場各區和外城草地 */
const DOOR={x:1250,y:640};      /* 內城主堡大門（腳底中心）：下一關的伏筆 */
const PLY=700;                   /* 廣場石板地的北緣（主堡石階下面） */
const GH={x:1250,y:1800};        /* 外城門樓（腳底中心） */

/* ---- 城堡畫法小工具（第 17 關的主堡；第 1 關的城堡在 level1.js 用同一種畫法） ---- */
const crn=(x0,x1,y,h=14,st=26,mw=15,fill='#e2d7bc')=>{let d='';for(let x=x0;x<=x1-mw;x+=st)d+=`M${f(x)},${f(y)} v-${h} h${mw} v${h} `;return `<path d="${d}" fill="${fill}"/>`};
const stn=(x0,x1,y0,y1,dy=20,len=44,col='#b8ad90')=>{let s='',k=0;for(let y=y0+dy;y<y1-2;y+=dy,k++)for(let x=x0+6+(k%2)*(len*.68);x<x1-len*.5;x+=len*1.36)s+=`M${f(x)},${f(y)} h${f(Math.min(len,x1-x-6))} `;return `<path d="${s}" fill="none" stroke="${col}" stroke-width="1.3"/>`};
/* 2026-11-20 使用者：城堡的旗幟要飄揚才帥 → 旗桿、牆上掛旗選 D（長燕尾旗、大幅飄揚），塔頂小三角旗選 C（波浪飄）。用 SMIL 動畫（地面層沒有 .on，CSS .an 不會動） */
const FLV='D';
const wavFlag=(px,py,W,Hh,col,shape,ph=0,ex='')=>{const N=8,A=Hh*.22,frame=(p)=>{const top=[],bot=[];for(let i=0;i<=N;i++){const u=i/N,x=W*u,dy=A*Math.sin(u*5.2+p)*u;if(shape==='tri'){top.push([x,Hh/2*u+dy]);bot.push([x,Hh-Hh/2*u+dy])}else{top.push([x,dy]);bot.push([x,Hh+dy])}}
  let d=`M${top.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' L')}`;if(shape==='sw'){const t=top[N],b=bot[N],m=bot[N-2];d+=` L${(t[0]-W*.22).toFixed(1)},${((t[1]+b[1])/2).toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)}`}else if(shape==='notch'){const t=top[N],b=bot[N];d+=` L${(t[0]-W*.2).toFixed(1)},${((t[1]+b[1])/2).toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)}`}
  d+=' L'+bot.slice(0,shape==='tri'?N:N).reverse().map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' L')+'Z';return d};
 const v=[0,1.6,3.2,4.8,0].map(k=>frame(k+ph)).join(';');
 return `<g transform="translate(${f(px)},${f(py)})"><path d="${frame(ph)}" fill="${col}" stroke-width="1.5" ${ex}><animate attributeName="d" values="${v}" dur="${(1.3+(ph%1)*.4).toFixed(2)}s" repeatCount="indefinite"/></path></g>`};
let FLC=0;const flg=(x,y)=>`<path d="M${f(x)},${f(y)} v-20" fill="none"/>`+wavFlag(x,y-20,20,10,'#e0b44a','tri',(FLC++)*1.3);
/* 圓柱塔：底部弧線、右側陰影、頂端一圈垛口、圓錐屋頂 */
const rTower=(cx,by,w,h,roof)=>{const x0=cx-w/2,x1=cx+w/2,top=by-h,e=w*.14,C='#e2d7bc',C2='#cfc2a2';let s='';
 s+=`<path d="M${f(x0)},${f(top)} V${f(by)} Q${f(cx)},${f(by+e*2)} ${f(x1)},${f(by)} V${f(top)}Z" fill="${C}"/>`;
 s+=`<path d="M${f(cx+w*.2)},${f(top)} V${f(by+e*.84)} Q${f(cx+w*.36)},${f(by+e*.6)} ${f(x1)},${f(by)} V${f(top)}Z" fill="${C2}" stroke="none"/>`;
 let b='';for(let y=top+26;y<by-8;y+=24)b+=`M${f(x0+2)},${f(y)} Q${f(cx)},${f(y+e*1.8)} ${f(x1-2)},${f(y)} `;s+=`<path d="${b}" fill="none" stroke="#bfb291" stroke-width="1.1" opacity=".75"/>`;
 s+=`<path d="M${f(x0)},${f(top)} V${f(by)} Q${f(cx)},${f(by+e*2)} ${f(x1)},${f(by)} V${f(top)}" fill="none"/>`;
 for(let y=top+34;y<by-40;y+=Math.max(56,h/3.2))s+=`<path d="M${f(cx-5)},${f(y+16)} V${f(y+5)} Q${f(cx)},${f(y-2)} ${f(cx+5)},${f(y+5)} V${f(y+16)}Z" fill="#3a3040"/>`;
 const pt=top-12;s+=`<path d="M${f(x0-5)},${f(top)} V${f(pt)} Q${f(cx)},${f(pt+e*2)} ${f(x1+5)},${f(pt)} V${f(top)} Q${f(cx)},${f(top+e*2)} ${f(x0-5)},${f(top)}Z" fill="${C}"/>`;
 const ap=pt-w*1.12;s+=`<path d="M${f(x0-9)},${f(pt)} Q${f(cx)},${f(pt+e*2.4)} ${f(x1+9)},${f(pt)} L${f(cx)},${f(ap)}Z" fill="${roof}"/><path d="M${f(cx)},${f(ap)} L${f(cx+w*.22)},${f(pt+e*1.5)} Q${f(cx+w*.42)},${f(pt+e*1.1)} ${f(x1+9)},${f(pt)}Z" fill="#000" opacity=".13" stroke="none"/>`+flg(cx,ap);
 return s};
/* 方形高塔（中央主塔） */
const sTower=(cx,by,w,h,roof)=>{const top=by-h;let s=`<path d="M${cx-w/2},${by} V${top} H${cx+w/2} V${by}Z" fill="#e2d7bc"/><path d="M${cx+w/6},${by} V${top} H${cx+w/2} V${by}Z" fill="#cfc2a2" stroke="none"/><path d="M${cx-w/2},${by} V${top} H${cx+w/2} V${by}" fill="none"/>`;
 s+=crn(cx-w/2-4,cx+w/2+4,top,10,20,11,'#e2d7bc');
 s+=`<path d="M${cx-w/2-8},${top-10} L${cx},${f(top-10-w*1.1)} L${cx+w/2+8},${top-10}Z" fill="${roof}"/><path d="M${cx},${f(top-10-w*1.1)} L${cx+w/2+8},${top-10} H${cx+w*.2}Z" fill="#000" opacity=".13" stroke="none"/>`+flg(cx,top-10-w*1.1);
 for(let y=top+30;y<by-40;y+=56)s+=`<path d="M${cx-6},${y+18} V${y+6} Q${cx},${y-2} ${cx+6},${y+6} V${y+18}Z" fill="#3a3040"/>`;
 [[cx-w*.26,top+90],[cx+w*.26,top+90]].forEach(([x,y])=>s+=`<path d="M${x-12},${y} H${x+12} V${y+44} L${x},${y+36} L${x-12},${y+44}Z" fill="#b8402e" stroke-width="1.4"/><circle cx="${x}" cy="${y+16}" r="4.6" fill="#e0b44a" stroke-width="1.1"/>`);
 return s};
/* 立體小房子：正面＋右側面＋屋頂（看得到側面和屋頂斜面） */
const house3=(x,y,w,h,d,wall,roof,o={})=>{const xl=x-w/2,xr=x+w/2,top=y-h,dx=d,dy=d*.55,rh=o.rh||w*.32;let s='';
 s+=`<path d="M${xr},${y} L${xr+dx},${y-dy} V${top-dy} L${xr},${top}Z" fill="${o.side||'#cbbd9c'}"/>`;
 s+=`<rect x="${xl}" y="${top}" width="${w}" height="${h}" fill="${wall}"/>`;
 s+=`<path d="M${xl-5},${top} H${xr+5} L${xr+dx*.5},${top-rh} H${xl+dx*.5}Z" fill="${roof}"/><path d="M${xr+5},${top} L${xr+dx+3},${top-dy} L${xr+dx*.5},${top-rh}Z" fill="${roof}"/><path d="M${xr+5},${top} L${xr+dx+3},${top-dy} L${xr+dx*.5},${top-rh}Z" fill="#000" opacity=".18" stroke="none"/>`;
 return s+(o.extra||'')};
const tree3=(x,y,k=1)=>`<ellipse cx="${x+4*k}" cy="${y+2}" rx="${16*k}" ry="${5*k}" fill="#000" opacity=".15" stroke="none"/><path d="M${x},${y} v-${16*k}" stroke="#6a4a30" stroke-width="${4*k}"/><circle cx="${x}" cy="${y-30*k}" r="${18*k}" fill="#6f8f42"/><circle cx="${x-7*k}" cy="${y-35*k}" r="${10*k}" fill="#8fae56" stroke="none"/><circle cx="${x+8*k}" cy="${y-24*k}" r="${7*k}" fill="#5f7f38" stroke="none"/>`;
/* 主堡：後牆內側 → 後面兩座塔 → 中庭（禮拜堂、宴會大廳、花園噴泉、樹、人）→ 中央主塔 → 兩側城牆（往後縮、走道、巡邏）→ 正面城牆（走道、巡邏、垛口、大門、掛旗）→ 前面兩座圓塔 */
function keep17(){const cx=1250,by=DOOR.y,fw=540,fh=110,dep=250,bw=486,bh=84,ft=by-fh,bb=by-dep,btop=bb-bh;let g='';
 const gd=(x,y,d,sc=.6)=>`<g transform="translate(${f(x)},${f(y)}) scale(${d<0?-sc:sc},${sc})">${kid({view:'side',pose:'walk',hat:H.HATHELM17,skin:'#e8c4a0',hair:'#4a3424',hs:0,shirt:'#b8402e',top:'long',bottom:'pants',pants:'#4a4f5c',extra:`<path d="M13,4 V-70" stroke="#8a6a40" stroke-width="2.4"/>`})}</g>`;
 const pp=(x,y,o,sc=.5)=>`<g transform="translate(${x},${y}) scale(${o.fl?-sc:sc},${sc})">${kid(Object.assign({view:'fq',pose:'stand',hat:-1,hs:1,skin:'#e8c4a0',hair:'#6a4a30',top:'long',bottom:'pants',pants:'#5a4a3a'},o))}</g>`;
 /* 中庭地面（石板＋中間一塊草地） */
 g+=`<path d="M${cx-bw},${bb} H${cx+bw} L${cx+fw},${ft} H${cx-fw}Z" fill="#cfc6aa"/><path d="M${cx-bw+90},${bb+18} H${cx+bw-90} L${cx+fw-120},${ft} H${cx-fw+120}Z" fill="#a9b768" opacity=".8"/>`;
 g+=`<rect x="${cx-bw}" y="${btop}" width="${2*bw}" height="${bh}" fill="#d2c6a8"/>`+stn(cx-bw,cx+bw,btop,bb,18,40,'#bcae8c')+crn(cx-bw,cx+bw,btop,11,24,13,'#d2c6a8');
 g+=rTower(cx-bw,bb+4,76,180,'#c4572f')+rTower(cx+bw,bb+4,76,180,'#c4572f');
 /* 2026-11-21w 使用者：中庭照宮廷院（第 18 關）畫出約略的樣子（選 B）：主殿（兩層、中間方塔、兩側圓塔在後面）＋三層噴水池＋花壇；
    圖書塔靠近主殿右邊、有空中廊道連過去；左邊禮拜堂保留，右邊宴會廳縮小放在圖書塔後面（之後可能往左右延伸別的關卡） */
 const GARD=false;
 g+=tree3(800,430,.75)+tree3(1705,428,.75);
 /* 左：小禮拜堂（原本的） */
 g+=house3(905,452,84,44,22,'#e8ddc2','#7a5a8a',{rh:30,extra:`<path d="M899,${452-44-30} V${452-44-46} M893,${452-44-40} H905" fill="none" stroke-width="2.4"/><circle cx="905" cy="${452-26}" r="8" fill="#9fd0e0"/><path d="M897,452 V438 Q905,430 913,438 V452Z" fill="#5a3a2a"/>`});
 /* 右上：宴會大廳（縮小，躲在圖書塔後面） */
 g+=house3(1650,438,104,36,20,'#e2d7bc','#a85640',{rh:26,extra:`<rect x="1668" y="${438-36-40}" width="12" height="22" fill="#b9ad92"/><circle cx="1676" cy="${438-36-50}" r="7" fill="#e8e4dc" stroke="none" opacity=".8"/>`+[1636,1660,1684].map(x=>`<path d="M${x-6},${438-8} V${438-24} Q${x},${438-31} ${x+6},${438-24} V${438-8}Z" fill="#f5c842"/>`).join('')});
 /* 主殿右邊：紫屋頂圖書塔（第 19 關的伏筆） */
 const LX=1566;g+=rTower(LX,474,64,236,'#7a5a8a')+`<circle cx="${LX}" cy="318" r="10" fill="#e8d9a8"/><path d="M${LX-6},322 h12 M${LX-6},317 h12" stroke="#8a5a3a" stroke-width="1.4"/>`;
 {let iv='';for(let i=0;i<14;i++){const y=466-i*10,x=LX-30+Math.sin(i*.8)*4;iv+=`<circle cx="${f(x)}" cy="${f(y)}" r="${3+(i%3)}" fill="${i%4?'#5f9a48':'#4a7a3a'}" stroke-width="1"/>`}g+=iv}
 /* 北：主殿（兩層樓、中間方塔、兩側圓塔，照宮廷院縮小） */
 {const x0=1060,x1=1440,yb=444,f1=yb-52,f2=f1-46,rt=f2-6;
  g+=rTower(1040,yb-8,56,176,'#5c6f96')+rTower(1460,yb-8,56,176,'#5c6f96');   /* 塔底往後收，圓弧落在主殿牆腳 */
  g+=`<path d="M${x0-6},${f2} L${x0+22},${rt-34} H${x1-22} L${x1+6},${f2}Z" fill="#5c6f96"/><path d="M${x0+22},${rt-34} L${x0+40},${rt-58} H${x1-40} L${x1-22},${rt-34}Z" fill="#4c5d82"/><path d="M${x1-22},${rt-34} L${x1+6},${f2} H${x1-40}Z" fill="#000" opacity=".12" stroke="none"/>`;
  [1120,1170,1330,1380].forEach(x=>g+=`<path d="M${x-8},${rt-24} V${rt-36} L${x},${rt-44} L${x+8},${rt-36} V${rt-24}Z" fill="#e8ddc2"/><rect x="${x-4}" y="${rt-36}" width="8" height="9" fill="#3a3040" stroke="none"/>`);
  g+=`<rect x="${x0}" y="${f2}" width="${x1-x0}" height="${yb-f2}" fill="#e8ddc2"/>`+stn(x0,x1,f2,yb,13,30,'#cfc3a2')+`<path d="M${x0},${f1} H${x1}" stroke="#bfb291" stroke-width="3"/><rect x="${x0}" y="${f2}" width="${x1-x0}" height="${yb-f2}" fill="none"/>`;
  [1090,1130,1170,1330,1370,1410].forEach(x=>g+=`<path d="M${x-7},${yb-8} V${yb-34} Q${x},${yb-44} ${x+7},${yb-34} V${yb-8}Z" fill="#3a5878"/><rect x="${x-9}" y="${yb-9}" width="18" height="5" fill="#c4473a" stroke-width="1"/><path d="M${x-5},${f1-6} V${f1-26} H${x+5} V${f1-6}Z" fill="#3a5878"/><path d="M${x-9},${f1-6} H${x+9}" stroke-width="2"/>`);
  /* 中間方塔 */
  g+=`<rect x="1205" y="${rt-130}" width="90" height="${yb-rt+130}" fill="#e8ddc2"/><rect x="1265" y="${rt-130}" width="30" height="${yb-rt+130}" fill="#cfc2a2" stroke="none"/><rect x="1205" y="${rt-130}" width="90" height="${yb-rt+130}" fill="none"/>`;
  {const pt=rt-142,ap=pt-96;g+=`<path d="M1199,${rt-130} V${pt} Q1250,${pt+12} 1301,${pt} V${rt-130} Q1250,${rt-118} 1199,${rt-130}Z" fill="#e2d7bc"/><path d="M1193,${pt} Q1250,${pt+14} 1307,${pt} L1250,${ap}Z" fill="#5c6f96"/><path d="M1250,${ap} L1270,${pt+9} Q1290,${pt+6} 1307,${pt}Z" fill="#000" opacity=".13" stroke="none"/>`+flg(1250,ap)}
  g+=`<circle cx="1250" cy="${rt-96}" r="13" fill="#f2ead2"/><path d="M1250,${rt-96} V${rt-105} M1250,${rt-96} L1257,${rt-92}" stroke-width="1.8"/>`;
  g+=`<path d="M1235,${yb} V${yb-38} Q1250,${yb-56} 1265,${yb-38} V${yb}Z" fill="#7a4e32"/><path d="M1222,${yb} h56 v6 h-56Z M1228,${yb+6} h44 v5 h-44Z" fill="#d6cbb0" stroke-width="1.2"/>`;
  [[1222,f1+4],[1278,f1+4]].forEach(([x,y])=>g+=`<path d="M${x-8},${y-40} H${x+8} V${y-8} L${x},${y-14} L${x-8},${y-8}Z" fill="#3f5f9a" stroke-width="1.2"/><circle cx="${x}" cy="${y-28}" r="3" fill="#e0b44a" stroke-width="1"/>`)}
 /* 空中廊道：主殿右邊圓塔 → 圖書塔（照宮廷院：斜一點、紅瓦屋頂、小拱窗、下面石拱撐著） */
 {const x0=1486,x1=LX-30,y0=346,y1=362,yy=x=>y0+(y1-y0)*(x-x0)/(x1-x0);
  g+=`<path d="M${x0},${yy(x0)+24} L${x1},${yy(x1)+24} L${x1},${yy(x1)+40} Q${(x0+x1)/2},${(yy(x0)+yy(x1))/2+30} ${x0},${yy(x0)+40}Z" fill="#d6cbb0"/>`;
  g+=`<path d="M${x0},${yy(x0)} L${x1},${yy(x1)} L${x1},${yy(x1)+26} L${x0},${yy(x0)+26}Z" fill="#e8ddc2"/>`;
  [.3,.7].forEach(t=>{const x=x0+(x1-x0)*t,y=yy(x);g+=`<path d="M${x-5},${y+20} V${y+10} Q${x},${y+4} ${x+5},${y+10} V${y+20}Z" fill="#3a5878"/>`});
  g+=`<path d="M${x0-2},${yy(x0)+1} L${x0+4},${yy(x0)-12} L${x1-2},${yy(x1)-12} L${x1+2},${yy(x1)+1}Z" fill="#a85640"/>`}
 /* 中庭：石子步道＋三層噴水池＋兩側幾何花壇 */
 g+=`<path d="M1236,456 H1264 L1280,520 H1220Z" fill="#e6dcc0" stroke="none"/><ellipse cx="1250" cy="488" rx="78" ry="22" fill="#e6dcc0" stroke="none"/>`;
 g+=`<ellipse cx="1250" cy="490" rx="44" ry="13" fill="#9fc8d4"/><ellipse cx="1250" cy="490" rx="44" ry="13" fill="none" stroke-width="2"/><path d="M1246,490 V470 H1254 V490" fill="#d6cbb0"/><ellipse cx="1250" cy="470" rx="22" ry="6" fill="#9fc8d4"/><path d="M1247,470 V456 H1253 V470" fill="#d6cbb0"/><ellipse cx="1250" cy="456" rx="11" ry="3.5" fill="#9fc8d4"/><path d="M1250,452 q-10,-14 -18,2 M1250,452 q10,-14 18,2 M1250,452 v-10" fill="none" stroke="#9fd0e0" stroke-width="2.2"/>`;
 const bed=(x,y,w)=>`<path d="M${x-w/2+10},${y-16} H${x+w/2-10} L${x+w/2},${y} H${x-w/2}Z" fill="#5f8a3e"/><path d="M${x-w/2+16},${y-12} H${x+w/2-16} L${x+w/2-8},${y-3} H${x-w/2+8}Z" fill="#7aa24c" stroke="none"/><path d="M${x},${y-14} V${y-2} M${x-w/2+12},${y-8} H${x+w/2-12}" stroke="#d6cbb0" stroke-width="2.4"/>`+[[-.32,-11,'#d8413a'],[-.18,-6,'#e0b44a'],[.2,-11,'#f0a8a0'],[.32,-6,'#d8413a'],[-.06,-10,'#b07ad8'],[.08,-5,'#e0b44a']].map(([a,b,c])=>`<circle cx="${x+a*w}" cy="${y+b}" r="2.6" fill="${c}" stroke-width=".9"/>`).join('');
 g+=bed(1120,500,100)+bed(1380,500,100);
 if(GARD){/* 西：毛茸茸樹籬雕塑（兔子、圓球）；東：白色圓頂涼亭 */
  const blob=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#5f8f3e"/><circle cx="${x-r*.3}" cy="${y-r*.35}" r="${r*.45}" fill="#7aaa50" stroke="none"/>`;
  const rab=(x,y)=>`<path d="M${x-10},${y} h20 v-6 h-20Z" fill="#8a6a48" stroke-width="1.2"/>`+blob(x,y-16,11)+blob(x+6,y-30,7)+`<path d="M${x+3},${y-36} q-2,-16 2,-16 q4,0 1,16 M${x+8},${y-36} q2,-15 6,-13 q2,3 -4,14" fill="#5f8f3e"/>`;
  g+=rab(985,500)+`<path d="M1010,500 h16 v-5 h-16Z" fill="#8a6a48" stroke-width="1.2"/>`+blob(1018,484,11)+rab(1050,504);
  const gz=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="30" ry="7" fill="#e8e2d4"/>`+[-22,-8,8,22].map(d=>`<path d="M${x+d-2},${y-2} V${y-34} h4 V${y-2}Z" fill="#fbf9f2" stroke-width="1.2"/>`).join('')+`<path d="M${x-30},${y-34} Q${x},${y-74} ${x+30},${y-34}Z" fill="#fbf9f2"/><path d="M${x-30},${y-34} H${x+30}" stroke-width="2"/><circle cx="${x}" cy="${y-58}" r="3" fill="#e0b44a" stroke-width="1"/>`;
  g+=gz(1510,506)}
 g+=tree3(840,488,.65)+tree3(1660,494,.65);
 g+=pp(1170,522,{view:'side',shirt:'#c4473a',hs:4,fl:true})+pp(1330,522,{shirt:'#7a4f8a',hs:2,top:'long'})+pp(1080,518,{view:'side',shirt:'#3f6f9a'})+pp(1425,518,{shirt:'#e0b44a',hs:3,fl:true})+pp(950,520,{view:'bq',shirt:'#5f7a4a'})+pp(1585,522,{view:'fq',shirt:'#fbf9f2',hat:H.HATCHEF17,fl:true});
 /* 兩側城牆：往後縮的外牆面＋牆頂走道＋垛口＋巡邏衛兵 */
 for(const sg of [-1,1]){const xf=cx+sg*fw,xb=cx+sg*bw,inw=-sg;
  g+=`<path d="M${xf},${by} V${ft} L${xb},${btop} V${bb}Z" fill="#c6b994"/>`;
  let ln='';for(const t of [.3,.6])ln+=`M${xf},${f(by-fh*t)} L${xb},${f(bb-bh*t)} `;g+=`<path d="${ln}" fill="none" stroke="#ab9e78" stroke-width="1.2"/>`;
  g+=`<path d="M${xf},${ft} L${xf+inw*26},${ft} L${xb+inw*20},${btop} L${xb},${btop}Z" fill="#e3d9c0"/>`;
  g+=gd((xf+xb)/2+inw*13,(ft+btop)/2+3,inw,.5);
  let m='';const n=9;for(let i=0;i<n;i++){const t=(i+.5)/n,x=xf+(xb-xf)*t,y=ft+(btop-ft)*t;m+=`M${f(x)},${f(y)} v-11 h${inw*8} v11 `}g+=`<path d="${m}" fill="#c6b994"/>`}
 /* 正面城牆：走道、巡邏衛兵、垛口、窗、大門、掛旗 */
 g+=`<rect x="${cx-fw}" y="${ft-24}" width="${2*fw}" height="24" fill="#e3d9c0"/>`+crn(cx-fw,cx+fw,ft-24,7,22,10,'#d6cbb0');
 g+=gd(880,ft-3,1)+gd(1620,ft-3,-1)+gd(1130,ft-3,-1,.56);
 g+=`<rect x="${cx-fw}" y="${ft}" width="${2*fw}" height="${fh}" fill="#e8ddc2"/>`+stn(cx-fw,cx+fw,ft,by,22,50,'#c9bd9c')+crn(cx-fw,cx+fw,ft,16,30,18,'#e8ddc2');
 [800,960,1540,1700].forEach(x=>g+=`<path d="M${x-10},${by-46} V${by-66} Q${x},${by-78} ${x+10},${by-66} V${by-46}Z" fill="#3a3040"/>`);
 g+=`<path d="M${DOOR.x-50},${by} V${by-62} Q${DOOR.x},${by-110} ${DOOR.x+50},${by-62} V${by}Z" fill="#cfc2a2"/>`;
 g+=`<path d="M${DOOR.x-40},${by} V${by-58} Q${DOOR.x},${by-98} ${DOOR.x+40},${by-58} V${by}Z" fill="#7a4e32"/>`+[-26,-13,0,13,26].map(d=>`<path d="M${DOOR.x+d},${by} V${f(by-60-Math.cos(d/40*1.4)*30)}" fill="none" stroke="#5a3a22" stroke-width="1.6"/>`).join('');
 g+=`<path d="M${DOOR.x-40},${by-62} H${DOOR.x+40} M${DOOR.x-40},${by-26} H${DOOR.x+40}" fill="none" stroke="#4a4f5c" stroke-width="4"/><path d="M${DOOR.x},${by-98} V${by}" fill="none" stroke-width="2.4"/>`;
 g+=`<circle cx="${DOOR.x-11}" cy="${by-42}" r="5.4" fill="none" stroke="#e0b44a" stroke-width="2.4"/><circle cx="${DOOR.x+11}" cy="${by-42}" r="5.4" fill="none" stroke="#e0b44a" stroke-width="2.4"/>`;
 [[1140,ft+4],[1360,ft+4]].forEach(([x,y],bi)=>{const crown=`<path d="M${x-12},${y+46} L${x-12},${y+30} L${x-6},${y+38} L${x},${y+26} L${x+6},${y+38} L${x+12},${y+30} L${x+12},${y+46}Z" fill="#e0b44a" stroke-width="1.5"/>`;
  {const A=9,fr=o=>`M${x-22},${y} H${x+22} Q${x+22+o*.3},${y+42} ${x+22+o},${y+84} L${x+o},${y+70} L${x-22+o},${y+84} Q${x-22-o*.4},${y+42} ${x-22},${y}Z`,vals=[0,A,0,-A,0].map(fr).join(';');
   g+=`<path d="${fr(0)}" fill="#b8402e"><animate attributeName="d" values="${vals}" dur="2.4s" begin="-${bi*.9}s" repeatCount="indefinite"/></path><g>${crown}<animateTransform attributeName="transform" type="translate" values="0 0;${A*.45} 0;0 0;${-A*.45} 0;0 0" dur="2.4s" begin="-${bi*.9}s" repeatCount="indefinite"/></g>`}
  g+=`<path d="M${x-22},${y} H${x+22}" fill="none" stroke="#7a5235" stroke-width="4"/>`});
 g+=rTower(cx-fw,by+4,112,280,'#c4572f')+rTower(cx+fw,by+4,112,280,'#c4572f');
 return g}
function ground(){
 const Sc=H.SCENES[N],X0=Sc.x0-420,WW=Sc.x1-Sc.x0+840,X1=X0+WW;let g='';
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="${Sc.y1+840}" fill="#a9b768" stroke="none"/>`;
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="740" fill="#e2eef0" stroke="none"/>`;
 g+=`<ellipse cx="760" cy="150" rx="70" ry="22" fill="#fbfbf6" stroke="none" opacity=".9"/><ellipse cx="1720" cy="120" rx="90" ry="26" fill="#fbfbf6" stroke="none" opacity=".9"/>`;
 g+=`<path d="M${X0},330 Q700,250 980,310 Q1250,240 1520,306 Q1800,250 ${X1},320 V440 H${X0}Z" fill="#9fb6a8" stroke="none"/>`;
 g+=`<path d="M${X0},420 Q760,370 1060,420 Q1400,372 1700,418 Q1900,390 ${X1},420 V500 Q2100,500 1960,560 Q1840,620 1800,700 H700 Q660,620 540,560 Q400,500 ${X0},500Z" fill="#8fa868" stroke="none"/>`;   /* 2026-11-26h 加寬：兩側的深色山坡收在 y 500～560，不要在 700 切一條直線 */
/* ---- 主堡（2026-11-19 使用者選 F：主堡往兩側加寬、牆上有走道和巡邏衛兵、越過正面的牆看得到中庭；整座縮小一點，讓廣場往北多出藏東西的地方） ---- */
 const crenel=(x0,x1,y)=>{let d='';for(let x=x0;x<x1;x+=26)d+=`M${x},${y} v-14 h15 v14 `;return d};
 g+=keep17();
 /* 大門前的石階 */
 for(let i=0;i<4;i++){const y=DOOR.y+i*15,w=120+i*26;g+=`<path d="M${DOOR.x-w/2},${y} H${DOOR.x+w/2} V${y+15} H${DOOR.x-w/2}Z" fill="${i%2?'#cbbf9f':'#d6cbb0'}"/>`}
 /* 城門廣場：石板地，邊緣不規則、草長進石縫、外面零星踏腳石（使用者選 C） */
 let pe=`M700,${PLY} `;for(let y=PLY+10;y<=1720;y+=40)pe+=`L${f(684+Math.sin(y/37)*14+sr(-10,10))},${y} `;pe+='L700,1730 ';for(let x=760;x<=1760;x+=60)pe+=`L${x},${f(1730+sr(-8,10))} `;pe+='L1800,1730 ';for(let y=1720;y>=PLY+10;y-=40)pe+=`L${f(1816+Math.sin(y/41)*14+sr(-10,10))},${y} `;
 pe+=`L1800,${PLY} Q1250,${PLY-14} 700,${PLY}Z`;
 g+=`<path d="${pe}" fill="#d6cbb0" stroke="none"/>`;
 let ss='';for(let i=0;i<120;i++){const side=r()<.5,x=side?sr(630,690):sr(1810,1870),y=sr(PLY+10,1720);ss+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(8,15))}" ry="${f(sr(5,8))}" fill="#d0c5a6" stroke="#b8ad90" stroke-width="1.2"/>`}g+=ss;
 let gtf='';for(let i=0;i<160;i++){const side=r()<.5,x=side?sr(684,730):sr(1770,1818),y=sr(PLY+10,1720);gtf+=`M${f(x)},${f(y)} l-3,-6 M${f(x)},${f(y)} l3,-6 `}g+=`<path d="${gtf}" fill="none" stroke="#7d8a48" stroke-width="1.3"/>`;
 let cob='';for(let i=0;i<680;i++){const x=sr(710,1790),y=sr(PLY+10,1720);cob+=`M${f(x)},${f(y)} h${f(sr(14,26))} `}
 g+=`<path d="${cob}" fill="none" stroke="#bfb393" stroke-width="1.6" stroke-linecap="round"/>`;
 let cob2='';for(let i=0;i<290;i++){const x=sr(710,1790),y=sr(PLY+10,1720);cob2+=`M${f(x)},${f(y)} h${f(sr(10,20))} `}
 g+=`<path d="${cob2}" fill="none" stroke="#e6ddc6" stroke-width="2.2" stroke-linecap="round"/>`;
 /* 水井周圍一圈石頭、往城門的走道 */
 g+=`<ellipse cx="1250" cy="1236" rx="120" ry="44" fill="#cbbf9f"/><ellipse cx="1250" cy="1236" rx="120" ry="44" fill="none" stroke="#b0a484" stroke-width="2" stroke-dasharray="14 8"/>`;
 g+=`<path d="M1190,1280 L1180,1690 H1320 L1310,1280Z" fill="#cbbf9f" stroke="none" opacity=".7"/>`;
 /* 草地邊的小花和草 */
 let tu='';for(let i=0;i<500;i++){const x=sr(X0,X1),y=sr(700,Sc.y1+300);if(x>692&&x<1808&&y>PLY-6&&y<1730)continue;if(inMoat(x,y)||(y>1680&&y<1812))continue;tu+=`M${f(x)},${f(y)} l-3,-6 M${f(x)},${f(y)} l3,-6 `}
 g+=`<path d="${tu}" fill="none" stroke="#6f7d3f" stroke-width="1.3"/>`;
 /* 護城河 */
 g+=`<path d="M${X0},${MOAT.y0} H${X1} V${MOAT.y1+6} ${Array.from({length:40},(_,i)=>{const x=X1-i*(WW/39);return `L${f(x)},${f(MOAT.y1+Math.sin(x/70)*4)}`}).join(' ')} Z" fill="#7cb4bc"/>`;
 g+=`<path d="M${X0},${MOAT.y0+10} H${X1}" fill="none" stroke="#5f97a2" stroke-width="7" opacity=".6"/>`;
 let wv='';for(let i=0;i<60;i++){const x=sr(X0,X1),y=sr(MOAT.y0+22,MOAT.y1-12);if(x>BR.x0-20&&x<BR.x1+20)continue;wv+=`M${f(x)},${f(y)} q8,-4 16,0 q8,4 16,0 `}
 g+=`<path d="${wv}" fill="none" stroke="#e6f3f2" stroke-width="1.8"/>`;
 g+=`<path d="M${X0},${MOAT.y1} ${Array.from({length:40},(_,i)=>{const x=X0+i*(WW/39);return `L${f(x)},${f(MOAT.y1+Math.sin(x/70)*4)}`}).join(' ')}" fill="none" stroke="#c9bf9f" stroke-width="7"/>`;
 /* 外城牆（左右延伸到場地外）＋城門樓 */
 g+=`<path d="M${X0},${GH.y} V1690 H${X1} V${GH.y}Z" fill="#d6cbb0"/><path d="${crenel(X0,X1,1690)}" fill="#d6cbb0"/>`;
 let st3='';for(let y=1708;y<1800;y+=20)for(let x=X0+((y/20)%2)*30;x<X1;x+=60)st3+=`M${x},${y} h44 `;g+=`<path d="${st3}" fill="none" stroke="#b8ad90" stroke-width="1.4"/>`;
 [[400,1730],[560,1730],[760,1730],[1000,1730],[1500,1730],[1740,1730],[1940,1730],[2100,1730]].forEach(([x,y])=>g+=`<path d="M${x-3},${y+30} V${y} H${x+3} V${y+30}Z" fill="#3a3040"/>`);
 const gt=(cx,top,w)=>`<path d="M${cx-w/2},${GH.y} V${top} H${cx+w/2} V${GH.y}Z" fill="#e2d7bc"/><path d="${crenel(cx-w/2,cx+w/2,top)}" fill="#e2d7bc"/><path d="M${cx-4},${top+40} V${top+20} H${cx+4} V${top+40}Z" fill="#3a3040"/>`;
 g+=`<path d="M1170,${GH.y} V1630 H1330 V${GH.y}Z" fill="#e8ddc2"/><path d="${crenel(1170,1330,1630)}" fill="#e8ddc2"/>`;
 g+=gt(1150,1600,64)+gt(1350,1600,64);
 g+=`<path d="M1200,${GH.y} V1726 Q1250,1680 1300,1726 V${GH.y}Z" fill="#3a2e28"/><path d="M1206,1734 Q1250,1694 1294,1734" fill="none" stroke="#4a4f5c" stroke-width="5"/>`;
 g+=`<path d="M1214,1722 v14 M1228,1712 v14 M1242,1706 v14 M1258,1706 v14 M1272,1712 v14 M1286,1722 v14" fill="none" stroke="#4a4f5c" stroke-width="3.4"/>`;
 g+=`<path d="M1200,${GH.y} V1726 Q1250,1680 1300,1726 V${GH.y}" fill="none" stroke-width="2.6"/>`;
 /* 城門樓上的小盾牌圖示（沒有字） */
 g+=`<path d="M1236,1650 H1264 V1662 Q1264,1674 1250,1680 Q1236,1674 1236,1662Z" fill="#3f6f9a" stroke-width="1.8"/><path d="M1240,1664 L1250,1656 L1260,1664" fill="none" stroke="#e0b44a" stroke-width="2.4"/>`;
 /* 吊橋（放下來，木板＋兩條鐵鍊） */
 g+=`<path d="M${BR.x0},1792 H${BR.x1} L${BR.x1+4},1916 H${BR.x0-4}Z" fill="#b98a56"/>`;
 let pl='';for(let y=1802;y<1914;y+=12)pl+=`M${BR.x0},${y} H${BR.x1} `;g+=`<path d="${pl}" fill="none" stroke="#8a6a3a" stroke-width="1.6"/>`;
 g+=`<path d="M${BR.x0+6},1792 L${BR.x0+2},1916 M${BR.x1-6},1792 L${BR.x1-2},1916" fill="none" stroke="#7a5235" stroke-width="5"/>`;
 g+=`<path d="M1184,1664 L${BR.x0+4},1910 M1316,1664 L${BR.x1-4},1910" fill="none" stroke="${OL}" stroke-width="5.4"/><path d="M1184,1664 L${BR.x0+4},1910 M1316,1664 L${BR.x1-4},1910" fill="none" stroke="#8a929c" stroke-width="3" stroke-dasharray="6 4"/>`;
 g+=`<circle cx="1184" cy="1664" r="6" fill="#4a4f5c" stroke-width="1.6"/><circle cx="1316" cy="1664" r="6" fill="#4a4f5c" stroke-width="1.6"/>`;
 /* 外城草地：從南邊來的泥土路 */
 g+=`<path d="M1250,1912 Q1250,2000 1240,2080 Q1232,2160 1250,2300" fill="none" stroke="#d9c49a" stroke-width="96" stroke-linecap="round"/><path d="M1250,1912 Q1250,2000 1240,2080 Q1232,2160 1250,2300" fill="none" stroke="#c9b07a" stroke-width="2.2" stroke-dasharray="3 17" stroke-linecap="round"/>`;
 return `<g stroke="${OL}" stroke-width="2" stroke-linejoin="round">${g}</g>`}

/* ================= 6. 建築與佈景 ================= */
Object.assign(POOL,{
 court17:[['planter17',0.4],['pot',0.25],['flowersY',0.2],['barrel',0.5],['pebbles',0.42],['bucket17',0.475],['ring17',0.475],['hglass17',0.38],['potlid17',0.38],['glove17',0.38],['hatBrown',0.38],['bottleG',0.285]],
 market17:[['crate',1.0],['barrel',1.0],['sacks17',0.35],['pot',0.15],['pebbles',0.35],['croissant17',0.57],['gourd17',0.57],['rpin17',0.475],['cheese17d',0.475],['bottleG',0.38],['hglass17',0.38],['potlid17',0.38]],
 yard17:[['hay',1.0],['barrel',0.8],['crate',0.8],['sacks17',0.4],['rock',0.4],['pebbles',0.42],['bucket17',0.57],['glove17',0.57],['ring17',0.57],['potlid17',0.38],['pumpkinPlain',0.38]],
 show17:[['barrel',0.7],['crate',0.5],['pot',0.2],['flowersY',0.15],['pebbles',0.35],['bucket17',0.475],['gourd17',0.475],['croissant17',0.38],['glove17',0.38],['hatBrown',0.38]],
 bank17:[['round',0.5],['bush',1.2],['flowersY',1.0],['grassClump',1.4],['rock',0.6],['pebbles',0.18],['hatBrown',0.23],['pumpkinPlain',0.23],['bucket17',0.23],['cheese17d',0.172]],
 decor17:[['pebbles',0.98],['pot',0.15],['barrel',0.4],['crate',0.4]],
 /* 2026-11-26h 加寬區（tune17.py：中間四區干擾物 ×1.9、兩側新區 ×1.0、bank ×1.15；兩側和 bank 的 pebbles ×0.3、中間和 decor 的 pebbles ×0.7） */
 gardenW17:[['pumpkinPlain',0.3],['bucket17',0.25],['gourd17',0.25],['hatBrown',0.2],['hay',0.6],['sacks17',0.4],['pebbles',0.15],['grassClump',0.6],['flowersY',0.3],['crate',0.3]],
 hawkW17:[['glove17',0.35],['rpin17',0.25],['croissant17',0.2],['hatBrown',0.2],['barrel',0.4],['crate',0.4],['hay',0.4],['pebbles',0.15],['grassClump',0.5],['rock',0.3]],
 beeW17:[['hglass17',0.25],['cheese17d',0.25],['bottleG',0.2],['gourd17',0.25],['flowersY',0.6],['grassClump',0.5],['pebbles',0.12],['pot',0.2],['crate',0.3]],
 cellarW17:[['bottleG',0.35],['hglass17',0.3],['ring17',0.25],['potlid17',0.2],['barrel',0.8],['crate',0.6],['sacks17',0.4],['pebbles',0.15]],
 tentE17:[['hatBrown',0.25],['potlid17',0.3],['bucket17',0.25],['cheese17d',0.2],['hglass17',0.2],['barrel',0.4],['crate',0.4],['pebbles',0.15],['grassClump',0.5]],
 joustE17:[['bucket17',0.3],['potlid17',0.3],['glove17',0.3],['croissant17',0.25],['hay',0.6],['barrel',0.4],['pebbles',0.15],['grassClump',0.5]],
 orchardE17:[['pumpkinPlain',0.3],['gourd17',0.3],['rpin17',0.2],['hatBrown',0.2],['bucket17',0.2],['grassClump',0.7],['flowersY',0.4],['bush',0.4],['pebbles',0.12]]});
/* 人群小故事：每組在做一件有趣的事，點了說一句話 */
const grp=(x,y,w,h,kind,svg,say,o={})=>add(x,y,w,h,kind,svg,{say,...o});
const kidSword=c=>`<path d="M12,-18 L26,-40" fill="none" stroke="${OL}" stroke-width="4.4" stroke-linecap="round"/><path d="M12,-18 L26,-40" fill="none" stroke="#d9b880" stroke-width="2.4" stroke-linecap="round"/><path d="M11,-24 l7,4" fill="none" stroke="${c}" stroke-width="3"/>`;
const luteHeld=`<g transform="translate(6,-14) rotate(-35) scale(.8)"><path d="M-2,-6 L-3,-28 L3,-28 L2,-6Z" fill="#8a5a30"/><path d="M0,-8 Q14,-6 13,8 Q12,18 0,18 Q-12,18 -13,8 Q-14,-6 0,-8Z" fill="#c99a5b"/><circle cx="0" cy="4" r="4" fill="#4a3424"/></g>`;
const bell=`<g transform="translate(22,-30)"><path d="M-6,0 Q-6,-10 0,-10 Q6,-10 6,0 L8,3 H-8Z" fill="#e0b44a" stroke-width="1.4"/><circle cx="0" cy="4" r="1.8" fill="${OL}" stroke="none"/><path d="M0,-10 V-15" fill="none" stroke="#7a5235" stroke-width="2.4"/></g>`;
const woodShield=`<g transform="translate(-10,-14)"><path d="M-8,-10 H8 V0 Q8,8 0,12 Q-8,8 -8,0Z" fill="#a8784a"/><path d="M0,-10 V12" fill="none" stroke="#7a5235" stroke-width="1.4"/></g>`;
const bow=`<path d="M16,-34 Q30,-20 16,-6" fill="none" stroke="${OL}" stroke-width="4"/><path d="M16,-34 Q30,-20 16,-6" fill="none" stroke="#8a5a30" stroke-width="2.2"/><path d="M16,-34 V-6" fill="none" stroke="#fbf6ea" stroke-width="1"/><path d="M8,-20 H30" fill="none" stroke="#7a5235" stroke-width="1.6"/><path d="M30,-20 l-4,-2 v4Z" fill="#c9ced6" stroke-width="1"/>`;
const balls=`<g><circle cx="-24" cy="-52" r="4.6" fill="#d8413a" stroke-width="1.3"/><circle cx="0" cy="-86" r="4.6" fill="#e0b44a" stroke-width="1.3"/><circle cx="24" cy="-58" r="4.6" fill="#4f86c4" stroke-width="1.3"/><path d="M-22,-60 Q-16,-80 -6,-86 M6,-86 Q16,-80 22,-66" fill="none" stroke="#9a8a6a" stroke-width="1.2" stroke-dasharray="2 3"/></g>`;
function structures(){
 skyBirds(N);
 /* 北邊：主堡大門前的衛兵、旗桿、花台、角落的樹 */
 grp(DOOR.x-80,DOOR.y+66,40,92,'guard17',guard(1,'fq'),'衛兵：國王在裡面忙著準備晚上的宴會，今天大門不開喔。');
 grp(DOOR.x+80,DOOR.y+66,40,92,'guard17',guard(-1,'fq'),'衛兵：大門裡面？嘿嘿，等時候到了你就知道了。');
 [[760,770],[1060,742],[1440,742],[1740,770]].forEach(([x,y],i)=>add(x,y,34,112,'flag17',flagPole(['#b8402e','#3f6f9a','#3f6f9a','#b8402e'][i]),{sh:.4}));
 [[880,800],[1620,800]].forEach(([x,y])=>add(x,y,66,26,'planter17',planter(),{sh:.6}));
 [[650,760],[1850,760],[640,1180],[1860,1200],[650,1540],[1860,1560]].forEach(([x,y])=>add(x,y,64,88,'round',roundTree(),{sh:.7}));
 /* 中央水井、市集攤位 */
 add(1250,1236,76,106,'well17',well(),{sh:.8});
 [[800,1150,0],[1000,1120,2],[1500,1120,1],[1700,1150,5],[880,1350,3],[1620,1350,4]].forEach(([x,y,k])=>{const c=STALLC[k];add(x,y,124,114,'stall17',stall(c[0],c[1],c[2]),{sh:.85})});
 /* 西邊：鐵匠舖、馬廄、馬、乾草、推車、兵器架 */
 const fg=add(760,1520,150,150,'forge17',forge(),{sh:.85});fg.say='鐵匠：叮！叮！新的馬蹄鐵快打好了。';
 add(1000,1470,172,104,'stable17',stable(),{sh:.85});
 grp(1060,1610,120,80,'groom17',horse('#a8703f','#4a3424','#3f6f9a')+act(-46,2,1,{view:'side',pose:'reach',hat:HAT_HOOD,shirt:'#5f7a4a',top:'long',bottom:'pants'},'work'),'馬夫：乖，刷完毛就帶你去護城河邊喝水。');
 add(880,1640,96,72,'horse17',horse('#6a4a30','#2b2420','#b8402e'),{fl:true});
 [[690,1620],[1120,1520]].forEach(([x,y])=>add(x,y,30,26,'hay',H.KIND.hay.fn(),{sh:.6}));
 add(700,1430,90,52,'cart17',cart(),{sh:.7});
 /* 東邊：吟遊詩人、雜耍、射箭、木劍對打 */
 grp(1420,1480,140,96,'bard17',T(0,0,1,barrel())+act(0,-24,1,{view:'front',pose:'sit',hat:HAT_BERET,shirt:'#7a4f8a',top:'long',bottom:'pants',extra:luteHeld},'groove')+noteM(18,-82)+noteM(30,-70)+
  act(-46,2,1,{view:'side',pose:'stand',hat:-1},'nod')+act(48,2,-1,{view:'fq',pose:'stand'},'nod'),'吟遊詩人：♪ 吊橋放下來～旅人進城來～今晚城堡有盛宴～');
 grp(1640,1500,110,100,'juggle17',act(0,0,1,{view:'front',arm:2,hat:HAT_BERET,shirt:'#c4473a',top:'long',bottom:'pants',pants:'#e0b44a',mood:1},'hop')+balls+
  T(-40,2,.8,kid({view:'side',pose:'up2',hat:-1}))+T(40,2,.8,kid({view:'fq',pose:'up',hat:-1}),true),'雜耍藝人：一、二、三⋯球球不要掉下來啊！');
 add(1820,1460,44,64,'target17',target(),{sh:.6});add(1830,1580,44,64,'target17',target(),{sh:.6});
 grp(1700,1630,40,70,'archer17',act(0,0,1,{view:'side',pose:'hold',hat:HAT_HOOD,shirt:'#4a6a3a',top:'long',bottom:'pants',extra:bow},false),'弓箭手：再往右一點點⋯咻！正中紅心！');
 add(1400,1640,50,68,'dummy17',dummy(),{sh:.6});
 grp(1540,1640,110,80,'duel17',act(-24,0,1,{view:'side',pose:'reach',hat:HAT_HELM,shirt:'#3f6f9a',top:'long',bottom:'pants',extra:kidSword('#3f6f9a')+woodShield},'work')+
  act(24,0,-1,{view:'side',pose:'reach',hat:HAT_HELM,shirt:'#b8402e',top:'long',bottom:'pants',extra:kidSword('#b8402e')+woodShield},'work'),'見習騎士：再來一回合！這次我一定會贏！');
 add(1300,1560,66,72,'rack17',rack(),{sh:.7});
 /* 廣場上的傳令官、玩木劍的小孩 */
 grp(1110,920,44,80,'crier17',act(0,0,1,{view:'fq',pose:'up',hat:HAT_BERET,shirt:'#3f6f9a',top:'long',bottom:'pants',mood:1,extra:bell},'nod'),'傳令官：叮噹叮噹！國王陛下今晚要在大餐廳辦宴會！');
 grp(1420,930,90,60,'kids17',T(-22,0,.8,kid({view:'side',pose:'reach',hat:-1,extra:kidSword('#d8413a')}))+T(22,0,.8,kid({view:'side',pose:'reach',hat:-1,extra:kidSword('#4f86c4')}),true),'小朋友：看招！我長大要當最勇敢的騎士！');
 /* 外城草地：吊橋兩邊的衛兵、樹、等進城的馬車、天鵝 */
 grp(BR.x0-34,1958,40,92,'guard17',guard(1,'fq'),'衛兵：歡迎來到城堡！過吊橋的時候小心腳下喔。');
 grp(BR.x1+34,1958,40,92,'guard17',guard(-1,'fq'),'衛兵：今天進城的人特別多，聽說是因為市集和晚上的宴會。');
 [[700,1990],[860,2090],[1640,2000],[1800,2090],[1460,2110],[1010,2000]].forEach(([x,y])=>add(x,y,64,88,'round',roundTree(),{sh:.7}));
 add(1540,2060,90,52,'cart17',cart(),{sh:.7});add(1620,2066,96,72,'horse17',horse('#d9c4a0','#f1e6cc','#4a6a3a'),{});
 [[860,1858],[1520,1850],[1720,1874],[960,1878]].forEach(([x,y],i)=>add(x,y,34,30,'swan',swan(),{mark:false,fl:i%2===0}));
 /* ---- 2026-11-26h 加寬區（西：菜園、鷹架、養蜂場、酒窖；東：帳篷、比武場、果園） ---- */
 const xw=(i)=>X17.westX[i][1](),xe=(i)=>X17.eastX[i][1]();
 add(430,700,180,70,'garden17',T(0,0,1.1,X17.garden[1]()),{sh:.85});mark(430,700,230,90);
 grp(320,780,80,60,'carrotG17',xw(0),'僕人：今晚宴會要用的紅蘿蔔，再拔一籃就夠了！');
 add(440,980,130,90,'perch17',X17.falcon[1](),{sh:.8});mark(440,980,150,100);
 grp(590,1050,90,80,'falconG17',xw(1),'鷹匠：戴上頭罩牠就會安靜下來，等一下飛給你們看。');
 add(430,1280,100,80,'beeShed17',X17.apiary[3](),{sh:.9});mark(430,1280,130,86);
 grp(320,1360,50,70,'beekeepG17',xw(2),'養蜂人：燻一點煙，蜜蜂就不會生氣了。這罐蜂蜜要送去廚房。');
 grp(590,1330,60,60,'beeKidG17',xw(4),'小朋友：哇！我只是想偷看一下蜂窩而已啦～');
 add(430,1590,110,86,'wineShed17',X17.cellarO[3](),{sh:.9});mark(430,1590,150,90);
 grp(570,1650,100,60,'rollG17',xw(3),'搬酒工：一、二、推！這桶葡萄酒是今晚宴會的主角。');
 add(2040,770,180,130,'tents17',T(0,0,1.3,X17.tents[2]()),{sh:.9});mark(2040,770,220,140);
 grp(2200,860,70,60,'squireG17',xe(0),'侍從：盔甲要擦到亮晶晶，明天騎士大人要上場比武。');
 add(2040,1090,140,90,'stand17',T(0,0,1.15,X17.joust[2]()),{sh:.9});mark(2040,1090,230,96);   /* 2026-11-26h 使用者改選比武場 C：兩位騎士隔著分隔欄對衝（kind 名稱沿用 stand17） */
 grp(2150,1200,90,90,'knightG17',xe(1),'騎士：馬兒先熱熱身，下午就輪到我們上場了。');
 grp(1940,1180,80,70,'cheerG17',xe(2),'觀眾：加油！加油！藍色騎士最帥！');
 add(2000,1450,64,92,'appleTree17',X17.orchard[1](),{sh:.8});mark(2010,1450,90,96);
 [[2170,1350],[1930,1640],[2180,1640]].forEach(([x,y])=>{add(x,y,64,92,'appleTree17',X17.atree(),{sh:.8})});
 grp(2120,1520,70,80,'pickG17',xe(3),'採果工：最紅的蘋果在最上面⋯差一點點就摘到了！');
 grp(1950,1540,60,50,'appleKidG17',xe(4),'小朋友：掉下來的蘋果也可以吃喔，我撿了一整籃！');
 /* 主堡兩旁的山坡、外城草地兩端的樹 */
 [[320,500,'pine'],[520,470,'round'],[2000,470,'round'],[2190,500,'pine'],[380,2010,'round'],[560,2100,'round'],[1960,2010,'round'],[2140,2100,'round']].forEach(([x,y,k])=>add(x,y,k==='pine'?50:64,k==='pine'?98:88,k,k==='pine'?H.KIND.pine.fn():roundTree(),{sh:.7}));
 /* 標記不能放東西的地方：北邊城牆和主堡、主堡石階、外城牆＋城門樓、吊橋 */
 mark(1250,706,1700,460);mark(1250,1812,2700,130);mark(1250,1812,220,214);mark(1250,1920,120,130);
}
function scatterAll(){
 scatter('court17',POOL.court17,2600,30);scatter('market17',POOL.market17,3600,48);scatter('yard17',POOL.yard17,3000,40);
 scatter('show17',POOL.show17,3000,36);scatter('bank17',POOL.bank17,3400,54);
 scatter('all17',POOL.decor17,5000,24);   /* 加寬後 cap 50→24（sprite 預算） */
 ['gardenW17','hawkW17','beeW17','cellarW17','tentE17','joustE17','orchardE17'].forEach(k=>scatter(k,POOL[k],1600,14));
}
SCENE_IMPL[N]={ground,structures,scatter:scatterAll};
/* 2026-11-27 修正：玩家回報有物件「用了提示也看不到」（圖書館發現，這關同樣有）。
   有些佈景實際畫的寬度和 add 的 w 不一樣（兩端站著人、馬，或左右不對稱），引擎把「露一角」放在 x±(w/2-…)，
   結果物件整個落在佈景實心的地方，上面又蓋一份佈景的圖，完全看不到。
   做法：佈景照原本的位置畫、佔位也不變，場景排好後只把引擎用來算露一角的中心 x（加 dx）和寬度 w 改掉。
   數值是把物件放在左右露一角位置實測的（兩邊約露出 30～65%）。 */
{const OF={stand17:[0,207],tents17:[-5,180]},sc0=SCENE_IMPL[N].scatter;
 SCENE_IMPL[N].scatter=(...a)=>{const r=sc0(...a);H.sprites.forEach(s=>{const o=OF[s.kind];if(o&&!s.of27){s.x+=o[0];s.w=o[1];s.of27=1}});return r}}
/* 人要多（照綠洲市集加倍後的密度） */
Object.assign(VPLAN,{court17:{chat:5,walker:6,handInHand:2,dogWalk:1,reading:1},market17:{chat:8,walker:8,carryBox:3,handInHand:2,dogWalk:1,petCat:1},
 yard17:{chat:3,walker:4,carryBox:4,sweep:1,stretch:1},show17:{chat:4,walker:4,handInHand:2,flute:1,violin:1},
 bank17:{chat:5,walker:6,dogWalk:2,handInHand:2,throwCatch:1,benchPair:1},
 gardenW17:{chat:1,walker:1},hawkW17:{chat:1,walker:1},beeW17:{walker:1},cellarW17:{chat:1,walker:1},tentE17:{chat:1,walker:2},joustE17:{chat:1,walker:1},orchardE17:{chat:1,walker:1}});
HOSTK.add('stall17');HOSTK.add('well17');HOSTK.add('cart17');HOSTK.add('target17');HOSTK.add('flag17');HOSTK.add('stable17');HOSTK.add('planter17');
['garden17','perch17','beeShed17','wineShed17','tents17','stand17','appleTree17'].forEach(k=>HOSTK.add(k));
Object.assign(HOSTN,{garden17:'菜園',perch17:'鷹架',beeShed17:'蜂窩棚',wineShed17:'酒桶棚',tents17:'騎士帳篷',stand17:'比武場',appleTree17:'蘋果樹'});
HOSTN.stall17='市集攤位';HOSTN.well17='水井';HOSTN.cart17='推車';HOSTN.target17='箭靶';HOSTN.flag17='旗桿';HOSTN.stable17='馬廄';HOSTN.planter17='花台';
/* 物件的合理位置：SPOTS 放在那個東西上或旁邊（每種最多一個台子選項）；BLEND 是顏色相近的東西 */
H.SPOTS[N]={
 helmet17:[['rack17',.05,.6],['dummy17',.05,.6],['forge17',.05,.55],['tents17',.05,.6]],
 shield17:[['rack17',.05,-.6],['dummy17',.05,-.6],['stable17',.05,.55],['stand17',.05,.6]],
 gkey17:[['well17',.05,.6],['guard17',.04,.7],['flag17',.03,.7],['wineShed17',.05,-.6]],
 scroll17:[['stall17',.32,-.2],['well17',.05,-.6],['cart17',.05,.6],['perch17',.05,.6]],
 horn17:[['stable17',.05,-.55],['flag17',.03,-.7],['target17',.05,.6],['stand17',.05,-.6]],
 lute17:[['bard17',.03,.6],['barrel',.95],['round',.03,.6],['appleTree17',.05,-.6]],
 goblet17:[['stall17',.32,.3],['crate',.9],['well17',.05,.6],['tents17',.05,-.6]],
 gaunt17:[['forge17',.05,-.55],['rack17',.05,.6],['duel17',.03,.6],['perch17',.05,-.6]],
 hat:[['juggle17',.03,.6],['crate',.9],['round',.03,.6],['garden17',.05,.6]],
 potion:[['stall17',.32,.25],['barrel',.95],['well17',.05,-.6],['wineShed17',.05,.6]],
 pumpkin:[['cart17',.05,-.6],['hay',.05,.6],['sacks17',.05,.6],['appleTree17',.05,.6]],
 cake:[['stall17',.32,-.1],['crate',.9],['kids17',.03,.6],['beeShed17',.05,.6]]};
/* 2026-11-23c 使用者重選的干擾物（同一個名稱在第 17～20 關都一樣，最後載入的檔案也會設成同一張圖） */
Object.assign(DECOY,{cheese17d:"<path d=\"M-15,8 L15,8 L15,-6 L-15,-12Z\" fill=\"#f2c94c\"/><path d=\"M-15,-12 L15,-6 L12,-14Z\" fill=\"#f8de7a\"/><circle cx=\"-4\" cy=\"0\" r=\"2.4\" fill=\"#e0b040\" stroke-width=\"1\"/><circle cx=\"7\" cy=\"2\" r=\"1.8\" fill=\"#e0b040\" stroke-width=\"1\"/>",bucket17:"<path d=\"M-11,14 V-2 Q-11,-8 -6,-10 V-12 H6 V-10 Q11,-8 11,-2 V14Z\" fill=\"#c4cad2\"/><path d=\"M-9,-12 Q0,-20 9,-12 L11,-6 L6,-8 L0,-5 L-6,-8 L-11,-6Z\" fill=\"#c4473c\"/><path d=\"M-11,4 H11\" fill=\"none\" stroke=\"#8a929c\" stroke-width=\"1.4\"/>",potlid17:"<path d=\"M0,-18 L12,0 L0,18 L-12,0Z\" fill=\"#3f6f9a\"/><path d=\"M0,-18 V18 M-12,0 H12\" fill=\"none\" stroke=\"#e0b44a\" stroke-width=\"1.6\"/><path d=\"M0,18 q4,4 0,8 q-4,4 0,8\" fill=\"none\" stroke-width=\"1.2\"/>",ring17:"<g transform=\"rotate(-40)\"><path d=\"M-2.4,-14 V16 L0,22 L2.4,16 V-14Z\" fill=\"#3d4248\"/><rect x=\"-7\" y=\"-19\" width=\"14\" height=\"5\" rx=\"1.5\" fill=\"#3d4248\"/></g>",rpin17:"<g transform=\"rotate(-15)\"><rect x=\"-17\" y=\"-7\" width=\"34\" height=\"14\" rx=\"3\" fill=\"#efe4cc\"/><ellipse cx=\"-17\" cy=\"0\" rx=\"3.6\" ry=\"7\" fill=\"#e2d4b4\"/><path d=\"M-17,-3 Q-15,0 -17,3\" fill=\"none\" stroke=\"#c9b48a\" stroke-width=\"1.1\"/><path d=\"M-3,-7.6 V7.6\" fill=\"none\" stroke=\"#c4473c\" stroke-width=\"2.2\"/><path d=\"M-3,6 q-5,4 -7,8 M-3,6 q3,5 6,7\" fill=\"none\" stroke=\"#c4473c\" stroke-width=\"1.6\"/></g>",croissant17:"<path d=\"M-15,-11 Q2,-10 17,-17 Q8,-2 -15,3Z\" fill=\"#e8c04a\"/><path d=\"M-12,-6 Q2,-6 12,-13\" fill=\"none\" stroke=\"#fff3c0\" stroke-width=\"1.6\" stroke-linecap=\"round\"/><ellipse cx=\"-15\" cy=\"-4\" rx=\"3.2\" ry=\"7.2\" fill=\"#c9a03a\"/><path d=\"M-10,-10.6 Q-8,-3 -10,2.4\" fill=\"none\" stroke=\"#b8902a\" stroke-width=\"2\"/>",gourd17:"<g transform=\"rotate(30)\"><path d=\"M0,4 V24\" fill=\"none\" stroke=\"#2b2420\" stroke-width=\"6.4\" stroke-linecap=\"round\"/><path d=\"M0,4 V24\" fill=\"none\" stroke=\"#c99a5b\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"0\" cy=\"-8\" r=\"13\" fill=\"#c99a5b\"/><circle cx=\"0\" cy=\"-8\" r=\"9\" fill=\"#a8703f\" stroke=\"none\"/><path d=\"M-6,-12 Q-7,-6 -4,-2\" fill=\"none\" stroke=\"#d8b078\" stroke-width=\"2\" stroke-linecap=\"round\"/></g>",hglass17:"<path d=\"M-11,-14 Q-11,4 0,4 Q11,4 11,-14Z\" fill=\"#e8c04a\"/><path d=\"M-11,-14 H11\" fill=\"none\"/><path d=\"M-6,-10 Q-6,-2 -3,0\" fill=\"none\" stroke=\"#fff3c0\" stroke-width=\"2\"/><path d=\"M-2,4 V12 M2,4 V12\" fill=\"none\" stroke-width=\"2\"/><rect x=\"-2\" y=\"4\" width=\"4\" height=\"8\" fill=\"#e8c04a\" stroke=\"none\"/><ellipse cx=\"0\" cy=\"13\" rx=\"9\" ry=\"3\" fill=\"#e8c04a\"/>"});
KIND.cheese17d=dk('cheese17d',34,26,-10);
H.BLEND[N]={helmet17:['bucket17','rock'],shield17:['potlid17','flag17'],gkey17:['ring17','pebbles'],scroll17:['rpin17','sacks17'],
 horn17:['croissant17','hay'],lute17:['gourd17','barrel'],goblet17:['hglass17','flowersY'],gaunt17:['glove17','rock'],
 hat:['hatBrown','barrel'],potion:['bottleG','crate'],pumpkin:['pumpkinPlain','hay'],cake:['cheese17d','crate']};

/* ================= 7. 連環小故事：信差的信鴿 ================= */
const satchel=`<path d="M-7,-18 L8,-6" fill="none" stroke="#7a5235" stroke-width="2"/><rect x="4" y="-10" width="10" height="9" rx="2" fill="#a8703f" stroke-width="1.3"/>`;
const basket=`<g transform="translate(16,-16)"><path d="M-11,-2 Q-11,10 0,10 Q11,10 11,-2Z" fill="#c99a5b"/><path d="M-11,-2 H11" fill="none" stroke-width="1.6"/><path d="M-8,2 H8 M-6,6 H6" fill="none" stroke="#8a6a3a" stroke-width="1.1"/><ellipse cx="-4" cy="-4" rx="6" ry="3.4" fill="#d9963a" stroke-width="1.3"/><circle cx="5" cy="-4" r="3.6" fill="#e0aa5a" stroke-width="1.2"/><path d="M-10,-2 Q0,-16 10,-2" fill="none" stroke="#8a6a3a" stroke-width="1.8"/></g>`;
STORIES[N]={title:'信差的信鴿',who:'小信差',
 giver:()=>act(0,0,1,{view:'fq',pose:'reach',hat:HAT_BERET,mood:2,skin:'#f0cfae',shirt:'#3f6f9a',top:'long',bottom:'pants',pants:'#5a4a3a',extra:satchel}),
 target:()=>barrelPile(),tw:90,th:58,
 helper:()=>act(0,0,1,{view:'fq',pose:'hold',hat:HAT_CHEF,mood:1,skin:'#d9a578',shirt:'#fbf9f2',top:'long',bottom:'pants',pants:'#6a5a48',extra:basket}),hw:56,hh:70,
 ask:'小信差：我的信鴿飛走了！牠背上揹著紅色小信筒，裡面是要送去給國王的信⋯',
 need:'信鴿躲在木桶堆後面，一伸手牠就往裡面縮⋯聽說市集的麵包師傅，鴿子最喜歡他的麵包屑！',
 got:'麵包師傅：鴿子最愛我的麵包屑了，撒一把給牠！',
 ok:'信鴿咕咕叫著跳出來吃麵包屑，紅色信筒還在背上。快帶回去給小信差！'};

/* ================= 8. 冒險地圖與過場 ================= */
/* 冒險地圖：不另外放節點，「隸屬於奇幻小鎮」——點小鎮裡的城堡就是這一關；放大看得到「城堡」名牌，遠看只顯示大區「奇幻小鎮」（levels.js 的 addRegion） */
HERE[N]=[100,170];
H.mapHook(5,({ink,FN,open})=>{if(!open(N))return '';
 return `<g class="mnode" data-n="${N}"><circle cx="100" cy="198" r="15" fill="transparent"/><g transform="translate(136,180)"><rect x="-19" y="-10" width="38" height="18" rx="9" fill="#fffaf0" stroke="${ink}" stroke-width="1.8"/><text y="4" text-anchor="middle" font-size="11" fill="${ink}" font-family="${FN}">城堡</text></g></g>`});
/* 過場：背後看衛兵帶路，吊橋放下來，走向越來越大的城門；地面紋路往下捲 */
RIDES.bridge17={text:'衛兵放下吊橋，走進城堡⋯',every:420,tick:k=>tone(k%2?196:220,.09,'square',.035),
 /* 2026-11-19 使用者：過場太平面 → 改成和場景一樣的立體方形城郭：兩側城牆往後縮、四角圓柱塔、牆頂走道和巡邏、後面看得到主堡的藍屋頂圓塔；
    護城河、吊橋、泥土路都有遠近（越近越寬），地面紋路往下捲 */
 svg:()=>{const walker=(x,y,sc,o)=>`<g transform="translate(${x},${y}) scale(${sc})"><g class="wk17">${kid(o)}</g></g>`;
  const gdT=(x,y,d)=>`<g transform="translate(${x},${y}) scale(${d<0?-.34:.34},.34)">${kid({view:'side',pose:'walk',hat:HAT_HELM,skin:'#e8c4a0',hair:'#4a3424',hs:0,shirt:'#b8402e',top:'long',bottom:'pants',pants:'#4a4f5c'})}</g>`;
  let s=`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><style>.cs17{transform-origin:200px 330px;animation:cs17 4.3s ease-in forwards}@keyframes cs17{from{transform:scale(.7)}to{transform:scale(1.75)}}`+
   `.db17{transform-origin:0 0;animation:db17 4.3s ease-in-out forwards}@keyframes db17{0%,12%{transform:scaleY(-.8)}48%,100%{transform:scaleY(1)}}`+
   `.rl17{animation:rl17 .9s linear infinite}@keyframes rl17{to{transform:translateY(112px)}}.wk17{animation:wk17 .5s ease-in-out infinite alternate}@keyframes wk17{to{transform:translateY(-3px)}}</style>`;
  s+=`<g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect width="400" height="600" fill="#e2eef0" stroke="none"/><ellipse cx="80" cy="70" rx="50" ry="15" fill="#fbfbf6" stroke="none"/><ellipse cx="330" cy="50" rx="58" ry="16" fill="#fbfbf6" stroke="none"/>`;
  s+=`<path d="M0,250 Q100,215 200,240 Q300,212 400,246 V340 H0Z" fill="#9fb6a8" stroke="none"/><rect y="300" width="400" height="300" fill="#a9b768" stroke="none"/>`;
  s+=`<g class="cs17"><g stroke-width="1.6">`;
  /* 2026-11-20 使用者：城堡下面鏤空 → 圓塔底部是弧線，城牆和護城河之間會透出後面的草地；先鋪一條石砌牆基墊在城堡下面 */
  s+=`<path d="M24,300 H376 V338 H24Z" fill="#b9ad8c" stroke="none"/>`;
  /* 後牆、後面兩座塔、主堡的藍屋頂圓塔 */
  s+=`<rect x="112" y="214" width="176" height="34" fill="#d2c6a8"/>`+crn(112,288,214,7,14,8,'#d2c6a8');
  s+=rTower(112,250,30,78,'#c4572f')+rTower(288,250,30,78,'#c4572f');
  s+=`<path d="M100,268 H300 L330,280 H70Z" fill="#a9b768"/>`;
  s+=rTower(200,262,56,118,'#5c6f96');
  /* 兩側城牆往後縮（外牆面＋牆頂走道） */
  for(const sg of [-1,1]){const xf=200+sg*150,xb=200+sg*88,inw=-sg;
   s+=`<path d="M${xf},330 V276 L${xb},214 V248Z" fill="#c6b994"/><path d="M${xf},296 L${xb},230" fill="none" stroke="#ab9e78" stroke-width="1"/>`;
   s+=`<path d="M${xf},276 L${xf+inw*10},276 L${xb+inw*7},214 L${xb},214Z" fill="#e3d9c0"/>`;
   let m='';for(let i=0;i<6;i++){const t=(i+.5)/6,x=xf+(xb-xf)*t,y=276+(214-276)*t;m+=`M${f(x)},${f(y)} v-5 h${inw*4} v5 `}s+=`<path d="${m}" fill="#c6b994"/>`}
  /* 正面城牆：走道、巡邏、垛口、城門樓 */
  s+=`<rect x="50" y="266" width="300" height="10" fill="#e3d9c0"/>`+gdT(118,272,1)+gdT(292,272,-1);
  s+=`<rect x="50" y="276" width="300" height="54" fill="#e8ddc2"/>`+stn(50,350,276,330,12,26,'#c9bd9c')+crn(50,350,276,8,15,9,'#e8ddc2');
  s+=`<path d="M170,330 V232 H230 V330Z" fill="#e2d7bc"/>`+crn(170,230,232,8,15,9,'#e2d7bc')+`<path d="M174,330 V284 Q200,262 226,284 V330Z" fill="#3a2e28"/><path d="M178,288 Q200,270 222,288" fill="none" stroke="#4a4f5c" stroke-width="3"/>`;
  s+=`<path d="M190,244 H210 V252 Q210,260 200,264 Q190,260 190,252Z" fill="#3f6f9a" stroke-width="1.3"/><path d="M193,252 L200,247 L207,252" fill="none" stroke="#e0b44a" stroke-width="1.6"/>`;
  s+=rTower(166,332,34,110,'#c4572f')+rTower(234,332,34,110,'#c4572f');
  s+=rTower(50,334,52,130,'#c4572f')+rTower(350,334,52,130,'#c4572f');
  s+=`</g>`;
  /* 護城河（越近越寬）、吊橋 */
  s+=`<path d="M-40,334 H440 V384 H-40Z" fill="#7cb4bc"/><path d="M-40,340 H440" fill="none" stroke="#5f97a2" stroke-width="5" opacity=".6"/><path d="M30,362 q8,-4 16,0 q8,4 16,0 M300,368 q8,-4 16,0 q8,4 16,0 M120,374 q6,-3 12,0 q6,3 12,0" fill="none" stroke="#e6f3f2" stroke-width="1.6"/>`;
  s+=`<path d="M-40,384 H440" fill="none" stroke="#c9bf9f" stroke-width="5"/>`;
  /* 2026-11-20 使用者：路面會接到放下的城門上 → 泥土路改放進跟著城堡放大的那一層，從護城河岸邊開始、壓在吊橋下面 */
  s+=`<path d="M-40,386 H440 V900 H-40Z" fill="#a9b768" stroke="none"/><path d="M174,386 L226,386 L360,900 L40,900Z" fill="#d9c49a" stroke="none"/><path d="M174,386 L40,900 M226,386 L360,900" fill="none" stroke="#c9b07a" stroke-width="2"/>`;
  s+=`<g transform="translate(200,330)"><g class="db17"><path d="M-25,0 H25 L33,56 H-33Z" fill="#b98a56"/><path d="M-26,12 H26 M-28,24 H28 M-30,36 H30 M-31,48 H31" fill="none" stroke="#8a6a3a" stroke-width="1.4"/><path d="M-33,56 H33 V62 H-33Z" fill="#7a5235"/></g></g>`;
  s+=`<path d="M166,272 L171,386 M234,272 L229,386" fill="none" stroke="#4a4f5c" stroke-width="3"/><path d="M166,272 L171,386 M234,272 L229,386" fill="none" stroke="#8a929c" stroke-width="1.6" stroke-dasharray="4 3"/></g>`;
  /* 泥土路（越近越寬）＋往下捲的地面紋路 */
  const lines=y0=>[0,1,2,3].map(i=>{const y=y0+i*28,k=(y-380)/220;return `<path d="M${f(30+i*95-k*20)},${y} q${f(12+k*8)},-5 ${f(24+k*16)},0" fill="none" stroke="#7d8a48" stroke-width="2.2"/>`}).join('');
  s+=`<g clip-path="inset(440px 0 0 0)"><g class="rl17">${lines(360)}${lines(472)}${lines(584)}${lines(696)}</g></g>`;
  s+=walker(150,520,1.05,{view:'back',pose:'walk',hat:HAT_HELM,shirt:'#b8402e',top:'long',bottom:'pants',pants:'#4a4f5c',extra:spear})+walker(236,546,1.15,{view:'back',pose:'walk',hat:-1,hs:0,top:'tee',bottom:'pants'});
  return s+`</g></svg>`}};

/* ================= 9. 場景彩蛋：點吊橋的鐵鍊會嘎啦響；敲主堡大門會聞到宴會的香味（下一關的伏筆） ================= */
H.TAPHOOKS[N]=(x,y)=>{
 if(y>1640&&y<1700&&(Math.abs(x-1184)<26||Math.abs(x-1316)<26)||(y>1700&&y<1910&&(Math.abs(x-(1184+(y-1664)*.06))<14||Math.abs(x-(1316-(y-1664)*.06))<14))){
  H.burst(x,y);H.toast('⛓️ 嘎啦嘎啦⋯吊橋的鐵鍊晃了一下！',1600);tone(140,.08,'square',.05);tone(170,.08,'square',.05,.09);tone(150,.1,'square',.05,.18);return true}
 if(Math.abs(x-DOOR.x)<40&&y>DOOR.y-90&&y<DOOR.y+2){H.burst(DOOR.x,DOOR.y-46);H.toast('🚪 叩叩！門裡飄出烤肉和蛋糕的香味⋯好像在準備宴會？',2200);tone(240,.08,'triangle',.06);tone(240,.08,'triangle',.06,.16);return true}
 return false};
})();

/* ================= 入口：第 1 關奇幻小鎮，城堡大門前（石階頂端）的兩位衛兵 =================
   levels.js 這一關有 find:{after:10,from:1,hint:[…]}：第 10 關拿到 2 顆星之後，第 1 關城堡大門前出現兩位衛兵（右邊那位頭上有「…」）；
   點衛兵 → 「要進城堡看看嗎？」→ 出發才算發現。這個檔案在第 1 關載入時會一起載入（ensureFull）。
   衛兵站在石階頂端（第 1 關本來就把石階標成不能擺東西），所以第 1 關的其他東西位置完全不變。 */
(function(){
const H=window.TH;if(!H)return;const N=17;const {T,f,OL,act,HATS}=H;
const EX={x:900,y:596};
(H.RESERVE[1]||(H.RESERVE[1]=[])).push([EX.x,EX.y+4,110,70]);
const helm=()=>H.HATHELM17;
const spear=`<path d="M13,4 V-74" fill="none" stroke="${OL}" stroke-width="4.6" stroke-linecap="round"/><path d="M13,4 V-74" fill="none" stroke="#8a6a40" stroke-width="2.4" stroke-linecap="round"/><path d="M13,-73 l-4,-2 l4,-13 l4,13Z" fill="#c9ced6" stroke-width="1.4"/><path d="M9,-74 h8" fill="none" stroke-width="1.6"/>`;
const tabard=`<path d="M-5,-17 H5 L6,-4 H-6Z" fill="#e0b44a" stroke-width="1.1" opacity=".95"/><path d="M-2,-13 l2,-2 l2,2 l-2,2Z" fill="#b8402e" stroke="none"/>`;
const G=(dir,sk)=>act(0,0,dir,{view:'fq',pose:'hold',hat:helm(),skin:sk,hair:'#4a3424',shirt:'#b8402e',top:'long',bottom:'pants',pants:'#4a4f5c',mood:0,extra:tabard+spear});
let gs=null;const guards=()=>gs||(gs=[G(1,'#e8c4a0'),G(-1,'#c98d5e')]);
/* 入口角色頭上用「…」（和一般路人一樣）；圓點半徑 1.75，不會被當成路人提示（DOTSIG） */
const svg=found=>T(-30,0,.9,guards()[0])+T(30,0,.9,(found?'':`<g class="qbob">${H.bubble(14,-74,'dots').replace(/r="1\.7"/g,'r="1.75"')}</g>`)+guards()[1]);
const pv=()=>`<svg viewBox="0 0 220 110" width="220" height="110" style="display:block"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect x="0" y="0" width="220" height="110" rx="10" fill="#e2eef0" stroke="none"/>`+
 `<path d="M20,78 V38 H200 V78Z" fill="#d6cbb0"/>${Array.from({length:7},(_,i)=>`<rect x="${20+i*26}" y="30" width="15" height="9" fill="#d6cbb0"/>`).join('')}<path d="M80,78 V22 H140 V78Z" fill="#e8ddc2"/><path d="M76,22 L110,2 L144,22Z" fill="#5c6f96"/>`+
 `<path d="M94,78 V54 Q110,40 126,54 V78Z" fill="#3a2e28"/><rect x="0" y="78" width="220" height="16" fill="#7cb4bc" stroke="none"/><path d="M96,78 H124 L128,98 H92Z" fill="#b98a56"/><path d="M84,46 L96,94 M136,46 L124,94" fill="none" stroke="#8a929c" stroke-width="1.6" stroke-dasharray="3 2"/>`+
 `<rect x="0" y="94" width="220" height="16" fill="#a9b768" stroke="none"/><g transform="translate(46,104) scale(.62)">${guards()[0]}</g><g transform="translate(176,104) scale(.62)">${guards()[1]}</g></g></svg>`;
H.EXITS[N]={x:EX.x,y:EX.y,w:120,h:92,svg,ask:{pv,title:'要進城堡看看嗎？',
 text:'城門衛兵：城門廣場今天有市集，國王歡迎遠道而來的旅人！<br>要我帶你走過吊橋進城嗎？',again:'城門衛兵：又要進城嗎？<br>吊橋隨時為你放下來！',
 go:'🏰 跟衛兵進城堡',wait:'之後再說',waitMsg:'城門衛兵：好，我們會一直守在這裡，準備好再來找我！'}};
})();
