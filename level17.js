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
H.SCENES[N]={x0:600,x1:1900,y1:2150,c:[1250,1820]};
H.TARGET[N]=330;
H.SKYC[N]='#e2eef0';H.SKYY[N]=300;
H.EDGEM[N]='B';H.EDGED[N]='LRB';   /* 左右不鏡像（主堡很寬，鏡像會在場地外多出幾座塔）；地面自己畫到場地外 */
H.EDGEDECO[N]=[['round',2.4],['bush',2],['pine',1],['rock',.6]];
H.FRINGE[N]=[['pebbles',1.4],['barrel',.5],['crate',.4],['pot',.25],['walker',.4]];
H.FRINGEX[N]=[[0,0,2600,780]];   /* 北邊的城牆、主堡、天空不要長佈景 */
H.DENS[N]=1.1;

/* ================= 2. 當地人：中世紀風（束腰外衣、斗篷帽、羽毛扁帽、頭巾）；衛兵戴鐵盔、穿紅色罩袍 ================= */
const HAT_HOOD=HATS.push(()=>{const c=pk(['#6a7a4a','#8a5a3a','#5a6a8a','#7a4a5a','#a8843f']);
 return `<path d="M-15,-29 Q-18,-58 0,-60 Q18,-58 15,-29 Q13,-45 0,-47 Q-13,-45 -15,-29Z" fill="${c}"/><path d="M-6,-58 Q-2,-66 4,-64" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`})-1;
const HAT_BERET=HATS.push(()=>{const c=pk(['#b8402e','#3f6f9a','#4a6a3a','#6a3f7a','#2f2f3a']),fe=pk(['#f4ecd6','#e0b44a','#e8e0f0']);
 return `<path d="M-14,-42 Q-12,-55 2,-55 Q16,-54 17,-45 Q8,-44 -14,-42Z" fill="${c}"/><path d="M-14,-42 Q2,-46 17,-45" fill="none" stroke-width="1.6"/><path d="M6,-52 Q18,-68 25,-62 Q18,-58 9,-50Z" fill="${fe}" stroke-width="1.4"/>`})-1;
const HAT_KER=HATS.push(()=>{const c=pk(['#f1e6cc','#d9a5a0','#e8d49a','#bcd0dc']);
 return `<path d="M-14,-38 Q-15,-54 0,-55 Q15,-54 14,-38 Q0,-44 -14,-38Z" fill="${c}"/><path d="M12,-41 l8,6 l-7,3Z" fill="${c}" stroke-width="1.4"/>`})-1;
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
const STALLC=[['#c4473a','#fbf6ea','fruit'],['#3f6f9a','#fbf6ea','cloth'],['#e0b44a','#b8402e','bread'],['#4a6a3a','#f1e6cc','pots'],['#7a4f8a','#f1e6cc','cloth'],['#c4473a','#e0b44a','fruit']];
Object.assign(KIND,{
 stall17:{w:124,h:114,fn:()=>{const c=pk(STALLC);return stall(c[0],c[1],c[2])}},well17:{w:76,h:106,fn:well},forge17:{w:150,h:150,fn:forge},
 horse17:{w:96,h:72,fn:()=>horse(pk(['#a8703f','#6a4a30','#d9c4a0','#4a3a32']),pk(['#4a3424','#2b2420','#f1e6cc']),pk(['#3f6f9a','#b8402e','#4a6a3a']))},
 stable17:{w:172,h:104,fn:stable},cart17:{w:90,h:52,fn:cart},target17:{w:44,h:64,fn:target},dummy17:{w:50,h:68,fn:dummy},
 flag17:{w:34,h:112,fn:()=>flagPole()},rack17:{w:66,h:72,fn:rack},sacks17:{w:44,h:30,fn:sacks},planter17:{w:66,h:26,fn:planter},
 bucket17:dk('bucket17',28,32,-2),potlid17:dk('potlid17',34,24,-4),ring17:dk('ring17',28,32,-4),rpin17:dk('rpin17',40,22,-2),
 croissant17:dk('croissant17',36,22,-2),gourd17:dk('gourd17',26,40,-6),hglass17:dk('hglass17',24,36,-6),glove17:dk('glove17',24,38,-6)});
['stall17','well17','cart17','stable17','forge17','sacks17','horse17','rack17'].forEach(k=>H.OCCK.add(k));

/* ================= 4. 12 種 × 4 個（8 種新東西＋4 種第 1 關的老朋友） ================= */
/* 老朋友：定義寫在自己檔案當後備（find 關卡檔案載入時，第 1 關一般已載入，但還是照規則寫） */
const OLD={hat:{id:'hat',name:'紫色魔法帽',short:'魔法帽',r:16,rot:20},potion:{id:'potion',name:'粉紅藥水',short:'藥水',r:15,rot:15},
 pumpkin:{id:'pumpkin',name:'南瓜燈',short:'南瓜燈',r:15,rot:10},cake:{id:'cake',name:'草莓蛋糕',short:'蛋糕',r:15,rot:12}};
const old=(id,regions)=>({...(typeOf(id)||OLD[id]),regions});
const TYPES=[
 old('hat',['market17','court17','show17','bank17']),old('potion',['market17','yard17','court17','show17']),
 old('pumpkin',['yard17','market17','bank17','court17']),old('cake',['market17','show17','court17','bank17']),
 {id:'helmet17',name:'騎士頭盔',short:'頭盔',r:16,rot:10,regions:['yard17','show17','court17','market17']},
 {id:'shield17',name:'紋章盾牌',short:'盾牌',r:16,rot:12,regions:['show17','yard17','court17','bank17']},
 {id:'gkey17',name:'城門大鑰匙',short:'大鑰匙',r:15,rot:30,regions:['court17','market17','bank17','yard17']},
 {id:'scroll17',name:'封蠟捲軸信',short:'捲軸信',r:15,rot:20,regions:['market17','court17','bank17','show17']},
 {id:'horn17',name:'號角',short:'號角',r:16,rot:15,regions:['show17','bank17','yard17','court17']},
 {id:'lute17',name:'魯特琴',short:'魯特琴',r:16,rot:12,regions:['show17','market17','court17','bank17']},
 {id:'goblet17',name:'高腳金杯',short:'金杯',r:15,rot:8,regions:['market17','court17','show17','yard17']},
 {id:'gaunt17',name:'鐵手套',short:'鐵手套',r:15,rot:15,regions:['yard17','show17','market17','bank17']}];
LEVELS[N].types=TYPES;
/* BORROW：不借（城堡物件不混進前面的關卡） */

/* ================= 5. 地形、水、區域 ================= */
const MOAT={y0:1806,y1:1904},BR={x0:1198,x1:1302};
const inMoat=(x,y)=>y>MOAT.y0&&y<MOAT.y1+Math.sin(x/70)*4&&!(x>BR.x0&&x<BR.x1);
WATERFN[N]=inMoat;
Object.assign(REG,{court17:{x:700,y:730,w:1100,h:300},market17:{x:680,y:1060,w:1140,h:320},yard17:{x:640,y:1400,w:500,h:260},
 show17:{x:1370,y:1400,w:490,h:260},bank17:{x:640,y:1950,w:1220,h:180},all17:{x:620,y:720,w:1260,h:1420}});
H.SCREG[N]=['court17','market17','yard17','show17','bank17'];  /* 故事和路人只放廣場各區和外城草地 */
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
 /* 中庭：左邊小禮拜堂、右邊宴會大廳（煙囪冒煙、亮著的窗：下一關的伏筆）、樹、花園噴泉、人 */
 g+=tree3(820,430,.8)+tree3(1690,428,.8);
 g+=house3(940,452,84,44,22,'#e8ddc2','#7a5a8a',{rh:30,extra:`<path d="M934,${452-44-30} V${452-44-46} M928,${452-44-40} H940" fill="none" stroke-width="2.4"/><circle cx="940" cy="${452-26}" r="8" fill="#9fd0e0"/><path d="M932,452 V438 Q940,430 948,438 V452Z" fill="#5a3a2a"/>`});
 g+=house3(1500,462,210,54,26,'#e2d7bc','#a85640',{rh:40,extra:`<rect x="1570" y="${462-54-58}" width="14" height="30" fill="#b9ad92"/><circle cx="1580" cy="${462-54-70}" r="8" fill="#e8e4dc" stroke="none" opacity=".8"/><circle cx="1588" cy="${462-54-84}" r="6" fill="#e8e4dc" stroke="none" opacity=".6"/>`+[1420,1460,1540,1580].map(x=>`<path d="M${x-8},${462-12} V${462-34} Q${x},${462-44} ${x+8},${462-34} V${462-12}Z" fill="#f5c842"/>`).join('')+`<path d="M1490,462 V434 Q1500,424 1510,434 V462Z" fill="#5a3a2a"/>`});
 g+=`<ellipse cx="1110" cy="490" rx="34" ry="12" fill="#9fc8d4"/><ellipse cx="1110" cy="490" rx="34" ry="12" fill="none" stroke-width="2"/><path d="M1104,490 V474 H1116 V490" fill="#d6cbb0"/><path d="M1110,474 q-8,-10 -14,0 M1110,474 q8,-10 14,0" fill="none" stroke="#9fd0e0" stroke-width="2.2"/>`;
 [[1030,500],[1190,500],[1330,506]].forEach(([x,y])=>g+=`<path d="M${x-26},${y} h52 v-12 q-26,-8 -52,0Z" fill="#6f9a4a"/>`+[[-16,-12,'#d8413a'],[-4,-14,'#e0b44a'],[10,-12,'#f0a8a0'],[20,-10,'#d8413a']].map(([a,b,c])=>`<circle cx="${x+a}" cy="${y+b}" r="3" fill="${c}" stroke-width="1"/>`).join(''));
 g+=tree3(870,478,.7)+tree3(1640,488,.7);
 g+=rTower(cx,470,150,240,'#5c6f96')+[[cx-40,290],[cx+40,290]].map(([x,y])=>`<path d="M${x-12},${y} H${x+12} V${y+44} L${x},${y+36} L${x-12},${y+44}Z" fill="#b8402e" stroke-width="1.4"/><circle cx="${x}" cy="${y+16}" r="4.6" fill="#e0b44a" stroke-width="1.1"/>`).join('');
 g+=pp(1060,520,{shirt:'#3f6f9a',hs:2})+pp(1170,516,{view:'side',shirt:'#c4473a',hs:4,fl:true})+pp(1360,520,{view:'side',shirt:'#5f7a4a'})+pp(1420,516,{shirt:'#e0b44a',hs:3,fl:true})+pp(960,516,{view:'bq',shirt:'#7a4f8a'})+pp(1560,520,{view:'fq',shirt:'#fbf9f2',hat:H.HATCHEF17,fl:true});
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
 g+=`<path d="M${X0},330 Q700,250 980,310 Q1250,240 1520,306 Q1800,250 ${X1},320 V600 H${X0}Z" fill="#9fb6a8" stroke="none"/>`;
 g+=`<path d="M${X0},420 Q760,370 1060,420 Q1400,372 1700,418 Q1900,390 ${X1},420 V700 H${X0}Z" fill="#8fa868" stroke="none"/>`;
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
 [[760,1730],[1000,1730],[1500,1730],[1740,1730]].forEach(([x,y])=>g+=`<path d="M${x-3},${y+30} V${y} H${x+3} V${y+30}Z" fill="#3a3040"/>`);
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
 court17:[['planter17',.4],['pot',.25],['flowersY',.2],['barrel',.5],['pebbles',.6],['bucket17',.25],['ring17',.25],['hglass17',.2],['potlid17',.2],['glove17',.2],['hatBrown',.2],['bottleG',.15]],
 market17:[['crate',1],['barrel',1],['sacks17',.35],['pot',.15],['pebbles',.5],['croissant17',.3],['gourd17',.3],['rpin17',.25],['cupcake',.25],['bottleG',.2],['hglass17',.2],['potlid17',.2]],
 yard17:[['hay',1],['barrel',.8],['crate',.8],['sacks17',.4],['rock',.4],['pebbles',.6],['bucket17',.3],['glove17',.3],['ring17',.3],['potlid17',.2],['pumpkinPlain',.2]],
 show17:[['barrel',.7],['crate',.5],['pot',.2],['flowersY',.15],['pebbles',.5],['bucket17',.25],['gourd17',.25],['croissant17',.2],['glove17',.2],['hatBrown',.2]],
 bank17:[['round',.5],['bush',1.2],['flowersY',1],['grassClump',1.4],['rock',.6],['pebbles',.6],['hatBrown',.2],['pumpkinPlain',.2],['bucket17',.2],['cupcake',.15]],
 decor17:[['pebbles',1.4],['pot',.15],['barrel',.4],['crate',.4]]});
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
 /* 標記不能放東西的地方：北邊城牆和主堡、主堡石階、外城牆＋城門樓、吊橋 */
 mark(1250,706,1700,460);mark(1250,1812,1600,130);mark(1250,1812,220,214);mark(1250,1920,120,130);
}
function scatterAll(){
 scatter('court17',POOL.court17,2600,30);scatter('market17',POOL.market17,3600,48);scatter('yard17',POOL.yard17,3000,40);
 scatter('show17',POOL.show17,3000,36);scatter('bank17',POOL.bank17,3400,54);
 scatter('all17',POOL.decor17,5000,50);
}
SCENE_IMPL[N]={ground,structures,scatter:scatterAll};
/* 人要多（照綠洲市集加倍後的密度） */
Object.assign(VPLAN,{court17:{chat:5,walker:6,handInHand:2,dogWalk:1,reading:1},market17:{chat:8,walker:8,carryBox:3,handInHand:2,dogWalk:1,petCat:1},
 yard17:{chat:3,walker:4,carryBox:4,sweep:1,stretch:1},show17:{chat:4,walker:4,handInHand:2,flute:1,violin:1},
 bank17:{chat:5,walker:6,dogWalk:2,handInHand:2,throwCatch:1,benchPair:1}});
HOSTK.add('stall17');HOSTK.add('well17');HOSTK.add('cart17');HOSTK.add('target17');HOSTK.add('flag17');HOSTK.add('stable17');HOSTK.add('planter17');
HOSTN.stall17='市集攤位';HOSTN.well17='水井';HOSTN.cart17='推車';HOSTN.target17='箭靶';HOSTN.flag17='旗桿';HOSTN.stable17='馬廄';HOSTN.planter17='花台';
/* 物件的合理位置：SPOTS 放在那個東西上或旁邊（每種最多一個台子選項）；BLEND 是顏色相近的東西 */
H.SPOTS[N]={
 helmet17:[['rack17',.05,.6],['dummy17',.05,.6],['forge17',.05,.55]],
 shield17:[['rack17',.05,-.6],['dummy17',.05,-.6],['stable17',.05,.55]],
 gkey17:[['well17',.05,.6],['guard17',.04,.7],['flag17',.03,.7]],
 scroll17:[['stall17',.32,-.2],['well17',.05,-.6],['cart17',.05,.6]],
 horn17:[['stable17',.05,-.55],['flag17',.03,-.7],['target17',.05,.6]],
 lute17:[['bard17',.03,.6],['barrel',.95],['round',.03,.6]],
 goblet17:[['stall17',.32,.3],['crate',.9],['well17',.05,.6]],
 gaunt17:[['forge17',.05,-.55],['rack17',.05,.6],['duel17',.03,.6]],
 hat:[['juggle17',.03,.6],['crate',.9],['round',.03,.6]],
 potion:[['stall17',.32,.25],['barrel',.95],['well17',.05,-.6]],
 pumpkin:[['cart17',.05,-.6],['hay',.05,.6],['sacks17',.05,.6]],
 cake:[['stall17',.32,-.1],['crate',.9],['kids17',.03,.6]]};
H.BLEND[N]={helmet17:['bucket17','rock'],shield17:['potlid17','flag17'],gkey17:['ring17','pebbles'],scroll17:['rpin17','sacks17'],
 horn17:['croissant17','hay'],lute17:['gourd17','barrel'],goblet17:['hglass17','flowersY'],gaunt17:['glove17','rock'],
 hat:['hatBrown','barrel'],potion:['bottleG','crate'],pumpkin:['pumpkinPlain','hay'],cake:['cupcake','crate']};

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
