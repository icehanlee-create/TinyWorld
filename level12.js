/* 奇幻小鎮大搜查．沙漠系列〔沙丘滑沙場〕（找路發現的新關卡，編號 12 只是程式用）
   入口：綠洲市集（第 11 關）西北邊大沙丘頂（約 836,462；2026-11-18 從北邊搬過來）——程式在這個檔案最後面（H.RESERVE[11]／H.EXITS[12]）。
   出口（通往金字塔）：之後金字塔做好時，放在最北邊（遠處商隊往金字塔走的地方，約 1250,560）——使用者 2026-11-17 選 A。
   ground() 最北邊已經畫了大金字塔和一小隊商隊剪影當伏筆。 */
(function(){
const H=window.TH;if(!H)return;
const N=12;
const {T,f,r,sr,pk,ri,OL,kid,act,wrapAn,add,mark,canPlace,scatter,skyBirds,KIND,POOL,VPLAN,REG,SCREG,LEVELS,ART,DECOY,
 SCENE_IMPL,WATERFN,RIDES,HERE,OUTFITS,STORIES,HOSTK,HOSTN,SCATREG,SCATOK,tone,typeOf,HATS,limb,chibi}=H;
const tube=(d,c,w=3.4)=>`<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w+2.6}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;

/* ================= 1. 場景範圍、天空、場地邊緣 ================= */
H.SCENES[N]={x0:350,x1:2150,y1:2150,c:[1250,1650]}; /* 2026-11-26 難度調整：東西各加寬 250（原本 x0:600,x1:1900）；西邊沙雕比賽、東邊沙地踢球＋涼飲小攤 */
H.TARGET[N]=330;
H.SKYC[N]='#f8e6bd';H.SKYY[N]=300;
H.EDGEM[N]='B';/* 2026-11-26 加寬後左右不鏡像（不然沙雕地面、踢球場會在場地外再出現一次；地面層本身就有沙地） */H.EDGED[N]='LRB';
H.EDGEDECO[N]=[['palm12',1.6],['cactus12',1],['duneRock12',1.4],['dryBush12',2.4]];
H.FRINGE[N]=[['dryBush12',2.4],['duneRock12',1.2],['cactus12',.8],['palm12',.5],['pebbles',1.2],['walker',.3]];
H.DENS[N]=1;/* 2026-11-26 加寬後從 1.15 降到 1（sprite 不要太多） */

/* ================= 2. 當地人：長袍＋頭巾（和綠洲市集一樣） ================= */
const turbanHat=v=>H.HATKIT.turbanV(pk(['#f4ecd6','#f4ecd6','#e8d8b0','#3f6f9a','#a4442f','#f4ecd6']))(v); /* 2026-11-25k 頭巾跟著方向轉（art.js HATKIT.turbanV） */
const HAT_T=HATS.push(turbanHat)-1;
const ROBES=['#e8d9b4','#c4573a','#2f6f73','#d89a3a','#7a4fa0','#f1e6cc','#4a6f9a','#8a5a3a'];
OUTFITS[N]=o=>{if(o.top)return o;
 o.skin=o.skin||pk(['#c98d5e','#b97a4e','#a8683e','#d9a578','#8f5a36']);
 o.top='long';o.bottom='pants';o.shirt=o.shirt||pk(ROBES);o.pants=o.pants||'#e8d9b4';
 if(o.hat==null&&!o.plain)o.hat=r()<.7?HAT_T:-1;if(o.hat===HAT_T&&o.hs==null)o.hs=r()<.5?0:2; /* 2026-11-25k 戴頭巾的只用短髮／披肩長髮，頭髮不會從頭巾冒出來 */return o};

/* ================= 3. 物件與干擾物 ================= */
Object.assign(ART,{
 sandboard12:`<path d="M-19,3 Q-19,-4 -11,-4 L12,-4 Q20,-4 23,-12 L25,-9 Q23,3 14,6 L-11,6 Q-19,6 -19,3Z" fill="#c98a4a"/><path d="M-14,1 H17" fill="none" stroke="#c4473a" stroke-width="2.6"/><path d="M-5,-4 V6 M3,-4 V6" fill="none" stroke="#a8641f" stroke-width="1.2"/>`+
  `<rect x="-12" y="-6" width="7" height="4" rx="1.6" fill="#5a3a22" stroke-width="1.2"/><rect x="1" y="-6" width="7" height="4" rx="1.6" fill="#5a3a22" stroke-width="1.2"/><path d="M22,-10 Q14,-19 6,-8" fill="none" stroke="#c4473a" stroke-width="2"/>`,
 goggles12:`<path d="M-23,1 Q0,-13 23,1" fill="none" stroke="${OL}" stroke-width="6.4" stroke-linecap="round"/><path d="M-23,1 Q0,-13 23,1" fill="none" stroke="#7a4a28" stroke-width="3.8" stroke-linecap="round"/>`+
  `<circle cx="-9" cy="2" r="8.6" fill="#8a5a2a"/><circle cx="9" cy="2" r="8.6" fill="#8a5a2a"/><circle cx="-9" cy="2" r="6" fill="#e2b45a"/><circle cx="9" cy="2" r="6" fill="#e2b45a"/><path d="M-12,-1 q2,-3 5,-2 M6,-1 q2,-3 5,-2" fill="none" stroke="#fdf0c0" stroke-width="1.6"/>`,
 saddleblanket12:`<rect x="-17" y="-10" width="34" height="20" rx="2" fill="#b8402e"/><path d="M-17,-5 H17" stroke="#f0c040" stroke-width="3.4" fill="none"/><path d="M-17,3 H17" stroke="#2f6f73" stroke-width="3.4" fill="none"/><path d="M-17,8 H17" stroke="#f4ecd8" stroke-width="1.6" stroke-dasharray="4 3" fill="none"/><path d="M-6,-10 V10 M6,-10 V10" stroke="#7a2a1f" stroke-width="1.2" fill="none"/>`+
  [-14,-8,-2,4,10,15].map(x=>`<path d="M${x},10 v6" stroke="#e8c88a" stroke-width="2.2" fill="none"/>`).join('')+[-14,-8,-2,4,10,15].map(x=>`<path d="M${x},-10 v-5" stroke="#e8c88a" stroke-width="2.2" fill="none"/>`).join(''),
 waterskin12:`<path d="M-3,-17 H3 V-12 H-3Z" fill="#c8a86a" stroke-width="1.4"/><path d="M-9,10 Q-15,-2 -6,-11 H6 Q15,-2 9,10 Q0,14 -9,10Z" fill="#b8763a"/><path d="M-5,-9 Q-9,0 -6,8" fill="none" stroke="#e0a468" stroke-width="2"/><path d="M0,-11 V11" fill="none" stroke="#7a4a22" stroke-width="1.2" stroke-dasharray="2 2.4"/><path d="M-8,-8 Q-17,-16 -4,-18 M8,-8 Q17,-16 4,-18" fill="none" stroke="#5a3a22" stroke-width="2.2"/>`,
 bell12:`<path d="M-3,-18 Q0,-23 3,-18" fill="none" stroke="#c4473a" stroke-width="3"/><path d="M-11,9 Q-12,-4 -6,-11 H6 Q12,-4 11,9Z" fill="#d6a23a"/><path d="M-11,9 H11" fill="none" stroke-width="2.4"/><path d="M-6,-6 Q-8,0 -7,5" fill="none" stroke="#fbe08a" stroke-width="2"/><path d="M0,-10 V9" fill="none" stroke="#9a6a1a" stroke-width="1.3"/><circle cx="0" cy="12" r="2.8" fill="#9a6a1a" stroke-width="1.2"/><path d="M-5,-12 H5" stroke="#c4473a" stroke-width="3" fill="none"/>`,
 flags12:`<path d="M-24,-10 Q0,6 24,-10" fill="none" stroke-width="2"/>`+[[-18,'#c4473a'],[-9,'#e8a030'],[0,'#2f6f73'],[9,'#7a4fa0'],[18,'#c4473a']].map(([x,c],i)=>{const y=-10+ (1-Math.abs(x)/24)*(i%1)+ (Math.sqrt(1-(x/24)**2)*8)-0;return `<path d="M${x-5},${y-2} L${x+5},${y-2} L${x},${y+11}Z" fill="${c}" stroke-width="1.4"/>`}).join(''),
 hourglass12:`<rect x="-10" y="-17" width="20" height="4" rx="1.6" fill="#8a5a2a"/><rect x="-10" y="13" width="20" height="4" rx="1.6" fill="#8a5a2a"/><path d="M-8,-13 Q-8,-4 -1.4,0 Q-8,4 -8,13 H8 Q8,4 1.4,0 Q8,-4 8,-13Z" fill="#e8f2f0" opacity=".95"/><path d="M-6,13 Q0,4 6,13Z" fill="#e8a44a" stroke="none"/><path d="M-5,-12 H5 Q3,-6 0,-3 Q-3,-6 -5,-12Z" fill="#e8a44a" stroke="none"/><path d="M0,-3 V6" stroke="#e8a44a" stroke-width="1.4" fill="none"/><path d="M-12,-13 V13 M12,-13 V13" fill="none" stroke="#8a5a2a" stroke-width="2.2"/>`,
 scarab12:`<path d="M-7,-9 L-15,-12 M-8,0 L-17,0 M-7,8 L-15,13 M7,-9 L15,-12 M8,0 L17,0 M7,8 L15,13" fill="none" stroke-width="2.4"/>`+
  `<ellipse cx="0" cy="3" rx="9.4" ry="12" fill="#e4b53e"/><path d="M0,-8 V15" fill="none" stroke="#9a6a1a" stroke-width="1.4"/><path d="M-6,-1 Q-8,5 -4,11 M6,-1 Q8,5 4,11" fill="none" stroke="#fbe08a" stroke-width="1.6"/><ellipse cx="0" cy="-10" rx="6.4" ry="4.6" fill="#d6a23a"/><circle cx="0" cy="3" r="2.6" fill="#2f6f9a" stroke-width="1.2"/><path d="M-4,-14 l-2,-3 M4,-14 l2,-3" fill="none" stroke-width="1.6"/>`,
 palmfan12:`<path d="M0,12 V0" fill="none" stroke="${OL}" stroke-width="5.4" stroke-linecap="round"/><path d="M0,12 V0" fill="none" stroke="#8a5a2a" stroke-width="3" stroke-linecap="round"/><path d="M0,2 Q-18,-4 -16,-16 Q-8,-22 0,-20 Q8,-22 16,-16 Q18,-4 0,2Z" fill="#dcc068"/>`+
  `<path d="M0,1 L-13,-14 M0,1 L-7,-19 M0,1 V-19 M0,1 L7,-19 M0,1 L13,-14" fill="none" stroke="#a8883a" stroke-width="1.3"/><path d="M-16,-12 Q0,-4 16,-12" fill="none" stroke="#a8883a" stroke-width="1.3"/>`,
 telescope12:`<g transform="rotate(-24)"><rect x="-22" y="-5" width="14" height="10" rx="2" fill="#d6a23a"/><rect x="-10" y="-6.6" width="16" height="13.2" rx="2" fill="#c8913a"/><rect x="4" y="-8.4" width="20" height="16.8" rx="2.4" fill="#d6a23a"/>`+
  `<path d="M-10,-6.6 V6.6 M4,-8.4 V8.4" fill="none" stroke-width="1.6"/><ellipse cx="24" cy="0" rx="3" ry="8.4" fill="#8fc2d8"/><path d="M-22,-3 H-10 M8,-6 H22" fill="none" stroke="#fbe08a" stroke-width="1.6"/><rect x="-26" y="-3.6" width="5" height="7.2" rx="1.6" fill="#7a4a22" stroke-width="1.2"/></g>`});
Object.assign(DECOY,{
 cutboard12:`<rect x="-18" y="-9" width="36" height="18" rx="7" fill="#d9a766"/><circle cx="12" cy="0" r="3.2" fill="#ecd29c"/><path d="M-12,-4 Q-4,-6 4,-3 M-13,2 Q-5,0 3,3" fill="none" stroke="#a8703f" stroke-width="1.2"/>`,
 glasses12:`<path d="M-22,-2 L-14,0 M22,-2 L14,0" fill="none" stroke-width="2"/><circle cx="-9" cy="2" r="8" fill="#f4efe0" opacity=".85"/><circle cx="9" cy="2" r="8" fill="#f4efe0" opacity=".85"/><path d="M-1,1 Q0,-1 1,1" fill="none" stroke-width="1.6"/><path d="M-13,-1 q2,-3 5,-2 M5,-1 q2,-3 5,-2" fill="none" stroke="#ffffff" stroke-width="1.6"/>`,
 tablecloth12:`<rect x="-17" y="-10" width="34" height="20" rx="2" fill="#efe2c0"/><path d="M-17,-4 H17 M-17,3 H17" stroke="#c8b27a" stroke-width="1.4" fill="none"/><path d="M-8,-10 V10 M0,-10 V10 M8,-10 V10" stroke="#e0cf9c" stroke-width="1.2" fill="none"/><path d="M-17,10 q3,5 6,0 q3,5 6,0 q3,5 6,0 q3,5 6,0 q3,5 6,0 q3,5 5,0" fill="#efe2c0"/>`,
 satchel12:`<path d="M-11,-12 Q0,-24 11,-12" fill="none" stroke-width="2.4"/><rect x="-13" y="-10" width="26" height="20" rx="4" fill="#a8703f"/><path d="M-13,-10 H13 V0 Q0,6 -13,0Z" fill="#b98250"/><rect x="-3" y="-1" width="6" height="6" rx="1.4" fill="#e0b050" stroke-width="1.2"/>`,
 pot12:`<path d="M-11,9 Q-12,-3 -9,-7 H9 Q12,-3 11,9Z" fill="#b8683a"/><ellipse cx="0" cy="-7" rx="9" ry="2.6" fill="#8f4a22"/><path d="M11,-3 Q21,-3 18,6" fill="none" stroke-width="2.6"/><path d="M-11,-3 Q-18,-4 -16,2" fill="none" stroke-width="2.2"/><path d="M-6,-3 Q-7,2 -5,6" fill="none" stroke="#e8a468" stroke-width="2"/>`,
 ribbon12:`<ellipse cx="0" cy="8" rx="11" ry="4.4" fill="#e8d8b0"/><rect x="-11" y="-6" width="22" height="14" fill="#e8d8b0" stroke="none"/><path d="M-11,-6 V8 M11,-6 V8" fill="none"/><ellipse cx="0" cy="-6" rx="11" ry="4.4" fill="#c4473a"/><ellipse cx="0" cy="-6" rx="4" ry="1.6" fill="#e8d8b0" stroke-width="1.2"/><path d="M-8,-1 H8 M-9,3 H9" fill="none" stroke="#c4473a" stroke-width="3"/><path d="M8,5 Q18,6 18,14 Q14,12 12,16" fill="none" stroke="#c4473a" stroke-width="3"/>`,
 vase12:`<path d="M-7,-16 H7 V-10 Q12,-6 11,2 Q10,10 8,14 H-8 Q-10,10 -11,2 Q-12,-6 -7,-10Z" fill="#e3f0ee" opacity=".95"/><path d="M-9,6 Q0,2 9,6 L8,14 H-8Z" fill="#cfe6e2" stroke="none"/><path d="M-5,-8 Q-8,-1 -6,6" fill="none" stroke="#ffffff" stroke-width="2"/><path d="M0,-16 Q2,-24 -2,-26 M2,-16 Q8,-22 5,-26" fill="none" stroke="#b8a766" stroke-width="1.6"/>`,
 stone12:`<ellipse cx="0" cy="3" rx="12" ry="9.4" fill="#8a7a5a"/><path d="M-8,-3 Q-4,-7 2,-6" fill="none" stroke="#b8a888" stroke-width="2"/><circle cx="4" cy="4" r="1.4" fill="#5f5238" stroke="none"/><circle cx="-4" cy="6" r="1.2" fill="#5f5238" stroke="none"/><path d="M-1,-5 Q3,0 1,8" fill="none" stroke="#5f5238" stroke-width="1.2"/>`,
 leaf12:`<path d="M-17,8 Q-12,-18 14,-14 Q16,10 -12,12Z" fill="#7aa856"/><path d="M-17,10 Q0,0 14,-14" fill="none" stroke="#4f7a36" stroke-width="1.8"/><path d="M-8,5 l-4,-7 M-1,0 l-3,-8 M5,-5 l4,3 M-5,2 l7,3" fill="none" stroke="#4f7a36" stroke-width="1.1"/>`,
 paperroll12:`<g transform="rotate(-24)"><rect x="-22" y="-7" width="40" height="14" rx="2" fill="#d5bf8a"/><ellipse cx="18" cy="0" rx="3.4" ry="7" fill="#efe2bc"/><ellipse cx="18" cy="0" rx="1.4" ry="3.4" fill="none" stroke-width="1.1"/><path d="M-12,-7 V7 M-2,-7 V7" fill="none" stroke="#a8884a" stroke-width="1.3"/><path d="M-22,-3 H-12" stroke="#c4473a" stroke-width="2" fill="none"/></g>`});

/* ---- 景物 ---- */
const palm=(lean=1,k=1)=>{const tx=3*lean,ty=-86;let g=tube(`M0,0 Q${5*lean},-40 ${tx},${ty}`,'#a8794a',7);
 for(let y=-12;y>-80;y-=11)g+=`<path d="M${f(-3+Math.abs(y)*.02*lean)},${y} h7" fill="none" stroke="#7a5235" stroke-width="1.2" transform="rotate(${lean*6} 0 ${y})"/>`;
 const leaf=(a,l,c)=>`<path d="M0,0 Q${f(l*.5)},${f(-l*.42)} ${f(l)},${f(l*.12)} Q${f(l*.52)},${f(-l*.12)} 0,0Z" fill="${c}" transform="translate(${tx},${ty}) rotate(${a})"/>`;
 [[-172,40,'#5f8e3e'],[-146,46,'#6f9a4a'],[-118,44,'#7aa856'],[-62,44,'#7aa856'],[-34,46,'#6f9a4a'],[-8,40,'#5f8e3e'],[-90,30,'#8cb862']].forEach(([a,l,c])=>g+=leaf(a,l*k,c));
 return g+`<g fill="#8f4a22">${[[-5,5],[3,7],[-1,10]].map(([x,y])=>`<ellipse cx="${tx+x}" cy="${ty+y}" rx="3" ry="4.2"/>`).join('')}</g>`};
const duneRock=()=>`<path d="M-16,0 Q-18,-10 -8,-13 Q2,-17 10,-10 Q18,-8 16,0Z" fill="#c9a868"/><path d="M-4,-12 Q2,-15 8,-9" fill="none" stroke="#e4cb92" stroke-width="2"/><path d="M-16,0 Q0,3 16,0" fill="none" stroke="#a88848" stroke-width="1.4"/>`;
const dryBush=()=>`<path d="M-12,0 Q-14,-10 -6,-14 Q-2,-20 4,-14 Q14,-12 12,0Z" fill="#b8a766"/><path d="M-8,0 L-6,-9 M-2,0 L-2,-13 M4,0 L5,-10 M9,0 L8,-6" fill="none" stroke="#8a7a44" stroke-width="1.4"/><path d="M-10,-8 q-5,-3 -7,-1 M10,-8 q5,-2 7,1" fill="none" stroke="#8a7a44" stroke-width="1.4"/>`;
const cactusBig=()=>tube('M-9,-14 Q-22,-14 -22,-30','#6f9a4a',7)+tube('M9,-22 Q23,-22 23,-38','#6f9a4a',7)+`<rect x="-8" y="-56" width="16" height="56" rx="8" fill="#7aa856"/><path d="M0,-52 V-2 M-4,-50 V-4 M4,-50 V-4" fill="none" stroke="#4f7a36" stroke-width="1.2"/>`;
const jar=(c='#c4642f',s=1)=>`<g transform="scale(${s})"><path d="M-10,0 Q-16,-14 -8,-24 L-5,-30 H5 L8,-24 Q16,-14 10,0Z" fill="${c}"/><ellipse cx="0" cy="-30" rx="6" ry="2.4" fill="#6a3a1c"/><path d="M-12,-14 Q0,-10 12,-14" fill="none" stroke="#f4d8a0" stroke-width="1.8"/><path d="M-6,-24 q-3,8 0,15" fill="none" stroke="#ffffff" stroke-width="1.6" opacity=".5"/></g>`;
const tent=(c='#c4573a')=>`<ellipse cx="0" cy="3" rx="76" ry="8" fill="#000" opacity=".14" stroke="none"/>`+
 `<path d="M-68,0 L-60,-44 Q0,-66 60,-44 L68,0Z" fill="#eedcae"/>`+[-52,-34,-16,2,20,38].map((x,i)=>i%2?'':`<path d="M${x},-1 L${x+3},-52 L${x+13},-54 L${x+13},-1Z" fill="${c}" stroke="none" opacity=".9"/>`).join('')+
 `<path d="M-60,-44 Q0,-66 60,-44" fill="none" stroke-width="2.2"/><path d="M-62,-40 Q0,-60 62,-40" fill="none" stroke="#fffaf0" stroke-width="1.6" opacity=".7"/>`+
 `<path d="M-24,0 L-21,-33 Q0,-41 21,-33 L24,0Z" fill="#3a2a22"/><path d="M-22,0 L-20,-6 H20 L22,0Z" fill="${c}" stroke-width="1.4"/><ellipse cx="-6" cy="-12" rx="9" ry="5.4" fill="#e0a030" stroke-width="1.5"/>`+
 `<path d="M-24,0 L-21,-33 L-34,-28 L-40,0Z" fill="#d9c48e"/><path d="M24,0 L21,-33 L34,-28 L40,0Z" fill="#d9c48e"/>`+
 `<path d="M-68,0 l-8,6 M68,0 l8,6 M0,-64 V-70" fill="none" stroke-width="1.8"/><path d="M0,-70 l9,3 l-9,3Z" fill="${c}" stroke-width="1.3"/>`;
/* 2026-11-18 駱駝改用 art.js 的 CAMELART（使用者選 B 雙峰＋G 修長盛裝，兩種輪流） */
const CAMEL=CAMELART;
/* 騎駱駝體驗：駱駝背上鋪織鞍毯、坐著小孩 */
const camelRide=(c='#d6aa66',c2='#b98a4a',o={})=>{const K=CAMELART.next(),isG=K===CAMELART.G;
 return K.stand(c,c2,isG)+(isG?'':`<path d="M-6,-50 Q2,-54 10,-50 L12,-40 L-8,-40Z" fill="#b8402e"/><path d="M-7,-45 H11" stroke="#f0c040" stroke-width="1.8" fill="none"/>`)+
 `<g transform="translate(${isG?-1:2},${isG?-57:-46}) scale(.58)">${chibi({view:'fq',skin:o.skin||'#c98d5e',top:'long',shirt:o.shirt||'#2f6f73',bottom:'pants',pants:'#e8d9b4',hat:HAT_T,arm:o.arm??1,mood:2})}</g>`};
/* 滑沙的人：站著或坐著一塊沙板（正面） */
const boarder=(o={})=>{const sh=o.shirt||pk(ROBES),sk=o.skin||pk(['#c98d5e','#b97a4e','#a8683e','#d9a578']),bd=o.board||pk(['#c98a4a','#b8402e','#2f6f73','#e0a030']);
 const ch=chibi({top:'long',shirt:sh,bottom:'pants',pants:'#e8d9b4',skin:sk,hat:o.hat??HAT_T,arm:o.arm??2,mood:1});
 const sit=o.sit;
 return `<g transform="rotate(${o.tilt||0})"><ellipse cx="0" cy="4" rx="28" ry="4.6" fill="#b8903e" opacity=".4" stroke="none"/>`+
  (sit?`<g transform="translate(0,-6)">${ch}</g><rect x="-12" y="-14" width="24" height="9" rx="4.5" fill="#e8d9b4"/>`+limb('M-8,-14 L-10,-3','#e8d9b4',6)+limb('M8,-14 L10,-3','#e8d9b4',6):
   limb('M-5,-16 L-8,-6','#e8d9b4',6)+limb('M5,-16 L8,-6','#e8d9b4',6)+`<g transform="translate(0,-13)">${ch}</g>`)+
  `<rect x="-26" y="-3" width="52" height="7" rx="3.5" fill="${bd}"/><path d="M-21,.5 H21" fill="none" stroke="#fbf6ea" stroke-width="1.4" opacity=".8"/><path d="M23,0 Q31,-6 34,-12" fill="none" stroke="${bd}" stroke-width="3" stroke-linecap="round"/>`+
  (o.spray?`<g stroke="none" fill="#f2dbaa" opacity=".9"><circle cx="-34" cy="-2" r="5"/><circle cx="-42" cy="-7" r="3.6"/><circle cx="-47" cy="0" r="2.6"/></g>`:'')+`</g>`};
/* 滑沙板租借小屋：木板牆、棕櫚葉屋頂、窗口櫃檯、旁邊靠著幾塊板子（招牌用圖示，不寫字） */
const boardsLean=()=>[[-1,'#c98a4a'],[1,'#b8402e'],[3,'#2f6f73'],[5,'#e0a030']].map(([i,c])=>`<g transform="translate(${34+i*6},0) rotate(${-8+i*2})"><rect x="-4" y="-54" width="8" height="54" rx="4" fill="${c}"/><path d="M0,-50 V-6" stroke="#fbf6ea" stroke-width="1.4" fill="none" opacity=".8"/></g>`).join('');
const hut=()=>`<ellipse cx="0" cy="3" rx="66" ry="7" fill="#000" opacity=".14" stroke="none"/>`+
 `<rect x="-50" y="-52" width="100" height="52" fill="#c99a5b"/><path d="M-50,-34 H50 M-50,-18 H50" fill="none" stroke="#a8703f" stroke-width="1.4"/><path d="M-30,-52 V0 M0,-52 V0 M30,-52 V0" fill="none" stroke="#a8703f" stroke-width="1"/>`+
 `<rect x="-34" y="-42" width="54" height="22" fill="#3a2a22"/><path d="M-38,-20 H24 V-14 H-38Z" fill="#a8703f" stroke-width="1.6"/><g transform="translate(-8,-20) scale(.62)">${chibi({view:'fq',skin:'#b97a4e',top:'long',shirt:'#c4573a',hat:HAT_T,arm:1,mood:2})}</g><path d="M-38,-20 H24 V-14 H-38Z" fill="#a8703f" stroke-width="1.6"/>`+
 `<path d="M-60,-52 Q-30,-74 0,-76 Q30,-74 60,-52 Q30,-60 0,-61 Q-30,-60 -60,-52Z" fill="#b89a52"/><path d="M-52,-54 q4,8 8,0 M-36,-58 q4,8 8,0 M-18,-61 q4,8 8,0 M0,-62 q4,8 8,0 M18,-61 q4,8 8,0 M36,-58 q4,8 8,0" fill="#a8883a" stroke-width="1.3"/>`+
 `<circle cx="33" cy="-38" r="9" fill="#f3e2b8"/><g transform="translate(33,-38) rotate(-30)"><rect x="-6" y="-2.2" width="12" height="4.4" rx="2.2" fill="#c98a4a" stroke-width="1.2"/><path d="M-4,0 H4" stroke="#c4473a" stroke-width="1.4"/></g>`+
 `<path d="M-46,-14 Q-40,-8 -34,-14" fill="none" stroke="#7a4a28" stroke-width="2"/><circle cx="-43" cy="-10" r="4" fill="#e2b45a" stroke-width="1.2"/><circle cx="-36" cy="-10" r="4" fill="#e2b45a" stroke-width="1.2"/>`+boardsLean();
const rack=()=>`<ellipse cx="0" cy="3" rx="36" ry="5" fill="#000" opacity=".13" stroke="none"/><path d="M-30,0 L-24,-46 M30,0 L24,-46 M-26,-30 H26" fill="none" stroke="#7a5235" stroke-width="4.4"/>`+
 [[-18,'#c98a4a'],[-9,'#b8402e'],[0,'#2f6f73'],[9,'#e0a030'],[18,'#7a4fa0']].map(([x,c],i)=>`<g transform="translate(${x},0) rotate(${(i-2)*3})"><rect x="-4.2" y="-58" width="8.4" height="58" rx="4.2" fill="${c}"/><path d="M0,-54 V-6" stroke="#fbf6ea" stroke-width="1.4" fill="none" opacity=".75"/></g>`).join('');
const boardStuck=()=>`<ellipse cx="0" cy="2" rx="14" ry="3.4" fill="#000" opacity=".13" stroke="none"/><g transform="rotate(${r()<.5?-14:12})"><rect x="-5" y="-50" width="10" height="52" rx="5" fill="${pk(['#c98a4a','#b8402e','#2f6f73','#e0a030'])}"/><path d="M0,-46 V-4" stroke="#fbf6ea" stroke-width="1.6" fill="none" opacity=".8"/><path d="M-5,-30 H5" stroke="#5a3a22" stroke-width="3" fill="none"/></g>`;
/* 彩旗：一整串三角旗（掛在兩根竿子之間） */
const FLC=['#c4473a','#e8a030','#2f6f73','#7a4fa0','#f4ecd8','#4f8a5a'];
const buntingLine=(w=120,drop=10)=>{let g=`<path d="M${-w/2},-64 V0 M${w/2},-64 V0" fill="none" stroke="#7a5235" stroke-width="4"/><path d="M${-w/2},-62 Q0,${-62+drop*2} ${w/2},-62" fill="none" stroke-width="1.6"/>`;
 const n=Math.round(w/14);for(let i=1;i<n;i++){const t=i/n,x=-w/2+w*t,y=-62+drop*2*(1-(2*t-1)**2)/1;g+=`<path d="M${f(x-6)},${f(y-1)} L${f(x+6)},${f(y-1)} L${f(x)},${f(y+14)}Z" fill="${FLC[i%FLC.length]}" stroke-width="1.3"/>`}return g};
const flagPile=()=>`<ellipse cx="0" cy="2" rx="34" ry="6" fill="#000" opacity=".14" stroke="none"/>`+
 [[-22,-2,'#c4473a',-20],[-8,-6,'#e8a030',8],[8,-4,'#2f6f73',-6],[22,-1,'#7a4fa0',16],[-14,-14,'#4f8a5a',-30],[4,-16,'#f4ecd8',14],[16,-12,'#c4473a',-10]].map(([x,y,c,a])=>`<path d="M-14,0 L14,0 L0,-24Z" fill="${c}" transform="translate(${x},${y}) rotate(${a})" stroke-width="1.5"/>`).join('')+
 `<path d="M-30,-6 q10,-12 22,-4 q10,-9 22,-1 q10,-8 18,2" fill="none" stroke="#7a5235" stroke-width="2"/>`;
/* 賽駱駝的終點門 */
const arch=()=>`<ellipse cx="0" cy="3" rx="96" ry="6" fill="#000" opacity=".12" stroke="none"/><path d="M-84,0 V-96 M84,0 V-96" fill="none" stroke="#7a5235" stroke-width="6"/><path d="M-90,-96 H90 V-80 H-90Z" fill="#f4ecd8"/>`+
 Array.from({length:12},(_,i)=>`<rect x="${-90+i*15}" y="${-96+(i%2?8:0)}" width="15" height="8" fill="#3a2a22" stroke="none"/>`).join('')+`<path d="M-90,-96 H90 V-80 H-90Z" fill="none"/><path d="M-84,-80 Q0,-60 84,-80" fill="none" stroke-width="1.6"/>`+
 Array.from({length:11},(_,i)=>{const t=(i+1)/12,x=-84+168*t,y=-80+20*(1-(2*t-1)**2);return `<path d="M${f(x-6)},${f(y)} L${f(x+6)},${f(y)} L${f(x)},${f(y+13)}Z" fill="${FLC[i%FLC.length]}" stroke-width="1.3"/>`}).join('');
/* 觀眾台：兩層木頭長椅、條紋遮陽篷、後排有人站著看 */
const stand=()=>{const c1=pk(['#c4473a','#2f6f73','#d89a3a','#7a4fa0']);
 let g=`<ellipse cx="0" cy="3" rx="64" ry="6" fill="#000" opacity=".14" stroke="none"/>`;
 g+=`<path d="M-56,0 V-70 M56,0 V-70" fill="none" stroke="#7a5235" stroke-width="4"/>`;
 g+=[[-34,'#c4473a','#e8c88a'],[-2,'#2f6f73','#f4ecd8'],[30,'#e8a030','#f4ecd8']].map(([x,c,sk],i)=>`<g transform="translate(${x},-30) scale(.6)">${chibi({view:'fq',skin:pk(['#c98d5e','#b97a4e','#a8683e']),top:'long',shirt:c,hat:HAT_T,arm:i===1?2:1,mood:2})}</g>`).join('');
 g+=`<rect x="-58" y="-26" width="116" height="7" fill="#c99a5b"/><rect x="-58" y="-12" width="116" height="7" fill="#b98a4a"/><path d="M-56,-19 V-12 M56,-19 V-12 M0,-19 V-12" fill="none" stroke-width="2.2"/><path d="M-56,-5 V0 M56,-5 V0 M0,-5 V0" fill="none" stroke-width="2.2"/>`;
 g+=[[-34,'#c98d5e','#c4473a'],[-10,'#b97a4e','#e0a030'],[18,'#a8683e','#2f6f73'],[42,'#d9a578','#7a4fa0']].map(([x,sk,c],i)=>`<g transform="translate(${x},-10) scale(.54)">${chibi({view:i%2?'front':'fq',skin:sk,top:'long',shirt:c,hat:i%3===0?HAT_T:-1,arm:i===2?2:0,mood:2})}</g>`).join('');
 g+=`<rect x="-58" y="-12" width="116" height="7" fill="#b98a4a"/><path d="M-58,-12 H58" fill="none" stroke-width="1.4"/>`;
 g+=`<path d="M-64,-70 L64,-70 L58,-90 L-58,-90Z" fill="#f3e2b8"/>`+[-52,-32,-12,8,28,48].map((x,i)=>i%2?'':`<path d="M${x},-90 L${x+12},-90 L${x+14},-70 L${x+2},-70Z" fill="${c1}" stroke="none"/>`).join('')+`<path d="M-64,-70 L64,-70 L58,-90 L-58,-90Z" fill="none"/>`+
  `<path d="M-64,-70 q8,7 16,0 q8,7 16,0 q8,7 16,0 q8,7 16,0 q8,7 16,0 q8,7 16,0 q8,7 16,0 q8,7 16,0" fill="#f3e2b8"/>`;
 return g};
/* 賽道邊的木柵欄（一段） */
const fence=()=>`<path d="M-28,0 V-22 M0,0 V-22 M28,0 V-22" fill="none" stroke="#7a5235" stroke-width="4"/><path d="M-32,-17 H32 M-32,-8 H32" fill="none" stroke="#a8703f" stroke-width="3.6"/>`;
/* 小跳鼠（目標）：沙色、長耳朵、大後腿、長尾巴尾端掛小銅鈴、額頭上戴著紅色迷你護目鏡 */
const jerboa=()=>`<path d="M9,-6 Q26,-4 24,-24 Q22,-18 14,-14" fill="none" stroke="${OL}" stroke-width="3.6"/><path d="M9,-6 Q26,-4 24,-24" fill="none" stroke="#d9b078" stroke-width="1.8"/><ellipse cx="24" cy="-26" rx="3.6" ry="2.6" fill="#f4ecd8" stroke-width="1.2"/><circle cx="25.4" cy="-21" r="2.6" fill="#e4b53e" stroke-width="1.2"/>`+
 `<path d="M3,0 L4,-9 L10,0Z M-4,0 L-3,-8 L-10,0Z" fill="#c99a5b" stroke-width="1.4"/><path d="M-9,0 H-3 M4,0 H11" fill="none" stroke-width="2"/>`+
 `<ellipse cx="0" cy="-11" rx="10" ry="9" fill="#e0b87a"/><ellipse cx="-4" cy="-20" rx="3.4" ry="9" fill="#e0b87a" transform="rotate(-12 -4 -20)"/><ellipse cx="4" cy="-20" rx="3.4" ry="9" fill="#e0b87a" transform="rotate(12 4 -20)"/><ellipse cx="-4" cy="-20" rx="1.6" ry="6" fill="#f0a8a0" stroke="none" transform="rotate(-12 -4 -20)"/><ellipse cx="4" cy="-20" rx="1.6" ry="6" fill="#f0a8a0" stroke="none" transform="rotate(12 4 -20)"/>`+
 `<ellipse cx="0" cy="-8" rx="6.4" ry="5" fill="#fbf1d8" stroke="none"/><path d="M-7,-15 Q0,-19 7,-15" fill="none" stroke="#7a4a28" stroke-width="2.4"/><circle cx="-3.4" cy="-14.4" r="3" fill="#c4473a" stroke-width="1.3"/><circle cx="3.4" cy="-14.4" r="3" fill="#c4473a" stroke-width="1.3"/><circle cx="-3.4" cy="-10.4" r="1.2" fill="${OL}" stroke="none"/><circle cx="3.4" cy="-10.4" r="1.2" fill="${OL}" stroke="none"/><ellipse cx="0" cy="-7.4" rx="1.4" ry="1" fill="#c47a7a" stroke="none"/>`;

/* ---- 佈景圖鑑（KIND）：場地外、POOL、干擾物都要登記 ---- */
const dk=(id,w,h,cy=-12)=>({w,h,fn:()=>T(0,cy,1,DECOY[id])});
Object.assign(KIND,{
 palm12:{w:56,h:96,fn:()=>palm(pk([1,-1]),1)},cactus12:{w:44,h:60,fn:cactusBig},duneRock12:{w:34,h:18,fn:duneRock},dryBush12:{w:30,h:20,fn:dryBush},
 jar12:{w:30,h:34,fn:()=>jar(pk(['#c4642f','#a8501f','#d27a3a','#8a4a22']),pk([.8,1,1.15]))},tent12:{w:150,h:70,fn:()=>tent(pk(['#c4573a','#2f6f73','#d89a3a']))},
 camelS12:{w:70,h:80,fn:()=>CAMEL.stand(pk(['#d6aa66','#c99a58','#dcb878']),'#b98a4a',r()<.5)},camelR12:{w:76,h:40,fn:()=>CAMEL.rest()},camelRide12:{w:72,h:100,fn:()=>camelRide(pk(['#d6aa66','#c99a58','#dcb878']))},
 hut12:{w:130,h:90,fn:hut},rack12:{w:70,h:64,fn:rack},boardStuck12:{w:28,h:56,fn:boardStuck},boarder12:{w:60,h:70,fn:()=>boarder({tilt:pk([-6,0,6]),spray:1})},
 stand12:{w:130,h:94,fn:stand},arch12:{w:190,h:100,fn:arch},bunting12:{w:130,h:70,fn:()=>buntingLine(120,10)},flagPile12:{w:70,h:36,fn:flagPile},fence12:{w:64,h:26,fn:fence},
 pail12:{w:20,h:22,fn:()=>pail12(pk(['#2f6f73','#c4473a','#e0a030']))},
 cutboard12:dk('cutboard12',36,20,0),glasses12:dk('glasses12',34,22,0),tablecloth12:dk('tablecloth12',34,26,0),satchel12:dk('satchel12',28,30,-2),pot12:dk('pot12',30,24,-4),
 ribbon12:dk('ribbon12',32,26,-4),vase12:dk('vase12',24,40,-4),stone12:dk('stone12',26,22,-2),leaf12:dk('leaf12',32,26,-2),paperroll12:dk('paperroll12',44,34,0)});

/* ================= 4. 12 種 × 4 個 ================= */
/* 老朋友：定義寫在自己檔案（和綠洲市集一樣，載入時第 4 關可能還沒載入） */
const OLD={compass:{id:'compass',name:'黃銅羅盤',short:'羅盤',r:14,rot:30},amphora:{id:'amphora',name:'古陶罐',short:'陶罐',r:15,rot:10}};
const old=(id,regions)=>({...(typeOf(id)||OLD[id]),regions});
/* 2026-11-26e 使用者發現兩側很少物件：每種 4 個區域裡放 1～2 個兩側（加寬區），合理位置也加兩側的佈景 */
const TYPES=[
 old('compass',['ride12','sportE12','slopeU12','sculptW12']),old('amphora',['ride12','sculptW12','slopeL12','sculptW12']),
 {id:'sandboard12',name:'滑沙板',short:'滑沙板',r:17,rot:12,regions:['slopeU12','slopeL12','ride12','westD12']},
 {id:'goggles12',name:'防沙護目鏡',short:'護目鏡',r:15,rot:8,regions:['slopeU12','westD12','ride12','eastD12']},
 {id:'saddleblanket12',name:'駱駝織鞍毯',short:'鞍毯',r:16,rot:6,regions:['ride12','sportE12','slopeU12','sculptW12']},
 {id:'waterskin12',name:'皮水袋',short:'水袋',r:14,rot:14,regions:['ride12','slopeU12','track12','sportE12']},
 {id:'bell12',name:'駱駝銅鈴',short:'銅鈴',r:14,rot:8,regions:['ride12','eastD12','slopeL12','westD12']},
 {id:'flags12',name:'賽跑彩旗串',short:'彩旗串',r:16,rot:6,regions:['track12','westD12','ride12','eastD12']},
 {id:'hourglass12',name:'沙漏',short:'沙漏',r:14,rot:10,regions:['slopeU12','track12','sportE12','sculptW12']},
 {id:'scarab12',name:'金色聖甲蟲',short:'聖甲蟲',r:14,rot:20,regions:['pyr12','sculptW12','sculptW12','sportE12']},
 {id:'palmfan12',name:'棕櫚葉扇',short:'葉扇',r:16,rot:14,regions:['track12','sportE12','slopeU12','westD12']},
 {id:'telescope12',name:'黃銅望遠鏡',short:'望遠鏡',r:17,rot:8,regions:['slopeU12','pyr12','track12','sculptW12']}];
LEVELS[N].types=TYPES;
/* BORROW：不借（沙漠物件不混進前面的關卡） */

/* ================= 5. 地形、區域 ================= */
const SLOPE={y0:716,y1:1330};   /* 大沙丘：脊線在北、坡腳在南 */
const inSlope=(x,y)=>y>760&&y<1310&&Math.abs(x-1250)<300+(y-760)*.72;
Object.assign(REG,{pyr12:{x:660,y:470,w:1200,h:220},slopeU12:{x:760,y:740,w:980,h:300},slopeL12:{x:700,y:1040,w:1100,h:290},
 track12:{x:640,y:1370,w:1230,h:340},ride12:{x:640,y:1730,w:1230,h:330},all12:{x:370,y:430,w:1760,h:1680},
 /* 2026-11-26 加寬：西邊沙雕比賽、東邊沙地踢球＋涼飲小攤、兩邊的沙地 */
 sculptW12:{x:375,y:1280,w:250,h:620},sportE12:{x:1880,y:1180,w:255,h:800},westD12:{x:370,y:440,w:240,h:1690},eastD12:{x:1895,y:440,w:240,h:1690}});
H.SCREG[N]=['slopeU12','slopeL12','track12','ride12','sculptW12','sportE12'];  /* 故事和路人只放坡上、坡腳、賽道、騎駱駝區 */

function ground(){
 const Sc=H.SCENES[N],X0=Sc.x0-420,WW=Sc.x1-Sc.x0+840;let g='';
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="${Sc.y1+840}" fill="#ecd29c" stroke="none"/>`;
 for(let i=0;i<60;i++){const x=sr(X0,X0+WW),y=sr(300,Sc.y1+300);g+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(60,170))}" ry="${f(sr(16,40))}" fill="${pk(['#e4c58a','#f2dbaa','#e8cc94','#dfbf84'])}" stroke="none" opacity=".6"/>`}
 /* 北邊天空：太陽、遠方沙丘、大金字塔（金字塔關卡的伏筆）和走向金字塔的一小隊商隊剪影 */
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="760" fill="#f8e6bd" stroke="none"/><circle cx="1000" cy="130" r="64" fill="#fbeab0" stroke="none" opacity=".55"/><circle cx="1000" cy="130" r="40" fill="#fdf0c0" stroke="none"/>`;
 g+=`<path d="M${X0},262 Q700,206 960,248 Q1200,200 1480,246 Q1760,206 ${X0+WW},254 V340 H${X0}Z" fill="#efd7a0" stroke="none"/>`;
 g+=`<g stroke="none"><path d="M1150,300 L1360,96 L1570,300Z" fill="#e6cb92"/><path d="M1360,96 L1570,300 H1440Z" fill="#d3b274"/><path d="M1580,300 L1690,196 L1800,300Z" fill="#e8cf98"/><path d="M1690,196 L1800,300 H1730Z" fill="#d6b77a"/><path d="M1060,300 L1112,246 L1164,300Z" fill="#e8cf98"/><path d="M1112,246 L1164,300 H1132Z" fill="#d6b77a"/></g>`;
 g+=`<g stroke="#b99a58" stroke-width="1.2" opacity=".6" fill="none"><path d="M1190,270 H1530 M1230,236 H1490 M1280,200 H1440 M1320,160 H1400"/></g>`;
 g+=`<path d="M${X0},300 Q640,252 880,292 Q1120,250 1360,294 Q1600,256 1800,296 Q2000,262 ${X0+WW},292 V370 H${X0}Z" fill="#e8cb92" stroke="none"/>`;
 g+=`<path d="M${X0},338 Q760,300 1020,338 Q1280,304 1560,340 Q1800,312 ${X0+WW},338 V400 H${X0}Z" fill="#ecd29c" stroke="none"/>`;
 g+=`<path d="M920,452 Q1100,418 1260,436 Q1380,420 1520,440" fill="none" stroke="#d9b678" stroke-width="30" stroke-linecap="round" opacity=".7"/>`;
 [[1000,446,.3,false],[1060,440,.3,true],[1130,432,.28,false],[1200,434,.3,true],[1270,436,.3,false]].forEach(([x,y,s,fl])=>{g+=`<g transform="translate(${x},${y}) scale(${fl?-s:s},${s})" fill="#8a7040" stroke="none" opacity=".75"><path d="M-24,-34 Q-28,-48 -14,-50 Q-6,-70 6,-54 Q20,-58 27,-42 Q29,-30 18,-29 L-18,-29 Q-25,-29 -24,-34Z"/><path d="M-20,-44 Q-30,-50 -33,-66 L-27,-70 Q-24,-56 -12,-48Z"/><path d="M-17,-30 L-19,0 M-9,-30 L-8,0 M11,-30 L13,0 M19,-30 L21,0" stroke="#8a7040" stroke-width="4" fill="none"/></g>`});
 /* 遠處的沙丘稜線 */
 g+=`<path d="M${X0},560 Q700,510 960,556 Q1200,512 1480,558 Q1760,520 ${X0+WW},560 V700 H${X0}Z" fill="#efd7a0"/>`;
 /* 大沙丘：亮面＋背光面＋沙紋＋四條滑沙道（兩邊的溝、中間被壓平的沙） */
 g+=`<path d="M600,1340 Q760,1000 960,840 Q1100,740 1250,716 Q1420,724 1560,840 Q1760,1000 1900,1340Z" fill="#f4dfa8"/>`;
 g+=`<path d="M1250,716 Q1420,724 1560,840 Q1760,1000 1900,1340 H1640 Q1520,1020 1250,716Z" fill="#dcbc7e" stroke="none"/>`;
 for(let i=0;i<8;i++){const y=770+i*62;g+=`<path d="M${f(640+i*40)},${y+80} Q${f(900+i*30)},${y} ${f(1240)},${f(y-44+i*5)}" fill="none" stroke="#e6c88c" stroke-width="1.6" opacity=".8"/>`}
 [[1040,790,900,1322],[1170,742,1120,1332],[1330,744,1380,1332],[1470,800,1620,1322]].forEach(([x0,y0,x1,y1])=>{const m=`M${x0},${y0} Q${f((x0+x1)/2+30)},${f((y0+y1)/2)} ${x1},${y1}`;
  g+=`<path d="${m}" fill="none" stroke="#cfa860" stroke-width="30" stroke-linecap="round"/><path d="${m}" fill="none" stroke="#f9ebc6" stroke-width="22" stroke-linecap="round"/><path d="${m}" fill="none" stroke="#e8cc94" stroke-width="2" stroke-dasharray="3 12" stroke-linecap="round"/>`;
  g+=`<ellipse cx="${x1}" cy="${y1+6}" rx="34" ry="10" fill="#f2dbaa" opacity=".9" stroke="none"/>`});
 /* 小路：坡腳往賽道和騎駱駝區 */
 ['M1250,1330 Q1250,1400 1300,1460 Q1380,1520 1470,1560','M1130,1330 Q1000,1500 900,1700 Q860,1800 900,1860','M900,1860 Q1300,1930 1700,1860'].forEach(d=>{g+=`<path d="${d}" fill="none" stroke="#d9b678" stroke-width="74" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#c9a460" stroke-width="2.2" stroke-dasharray="3 17" stroke-linecap="round" opacity=".9"/>`});
 /* 賽駱駝跑道（南北向，終點在南邊）：壓平的沙、白線、起跑線、終點格子 */
 g+=`<path d="M1470,1380 H1710 V1712 H1470Z" fill="#e4c58a"/><path d="M1482,1380 V1712 M1698,1380 V1712" fill="none" stroke="#f6ecd0" stroke-width="3" stroke-dasharray="16 10"/>`;
 for(let i=0;i<8;i++)for(let j=0;j<2;j++)g+=`<rect x="${1470+i*30}" y="${1696+j*8}" width="30" height="8" fill="${(i+j)%2?'#3a2a22':'#f4ecd8'}" stroke="none"/>`;
 g+=`<path d="M1470,1696 H1710 M1470,1712 H1710" fill="none" stroke-width="1.6"/><path d="M1470,1398 H1710" fill="none" stroke="#f6ecd0" stroke-width="4"/>`;
 for(let i=0;i<14;i++){const y=1420+i*22;g+=`<path d="M${f(1500+(i%3)*30)},${y} q14,-5 28,0" fill="none" stroke="#cfa860" stroke-width="1.6" opacity=".8"/>`}
 /* 騎駱駝體驗的小圈（駱駝繞著走的壓平的沙） */
 g+=`<ellipse cx="1110" cy="1930" rx="190" ry="62" fill="#e4c58a"/><ellipse cx="1110" cy="1930" rx="190" ry="62" fill="none" stroke="#c9a460" stroke-width="2.2" stroke-dasharray="3 14"/>`;
 /* 2026-11-26 西邊沙雕比賽的地面（潑濕的深色沙）＋往騎駱駝區的小路；東邊踢球場（壓平的沙＋白線）＋小路 */
 ['M760,1810 Q640,1700 560,1600','M1700,1860 Q1840,1820 1960,1760'].forEach(d=>{g+=`<path d="${d}" fill="none" stroke="#d9b678" stroke-width="60" stroke-linecap="round" opacity=".85"/>`});
 g+=`<ellipse cx="500" cy="1580" rx="132" ry="270" fill="#e0c286" stroke="none" opacity=".85"/>`;
 for(let i=0;i<9;i++)g+=`<ellipse cx="${f(sr(420,580))}" cy="${f(sr(1360,1820))}" rx="${f(sr(16,30))}" ry="${f(sr(6,10))}" fill="#cfae6c" stroke="none" opacity=".55"/>`;
 g+=`<rect x="1905" y="1230" width="225" height="420" rx="10" fill="#e4c58a" stroke="#cfa860"/><path d="M1920,1440 H2115 M1920,1250 H2115 V1630 H1920Z" fill="none" stroke="#f6ecd0" stroke-width="3"/><ellipse cx="2017" cy="1440" rx="40" ry="26" fill="none" stroke="#f6ecd0" stroke-width="3"/>`;
 for(let i=0;i<46;i++){const x=sr(X0,X0+WW),y=sr(1340,Sc.y1+300);g+=`<path d="M${f(x)},${f(y)} q14,-5 28,0 q14,5 28,0" fill="none" stroke="#d9bb7e" stroke-width="1.6" opacity=".9"/>`}
 return `<g stroke="${OL}" stroke-width="2" stroke-linejoin="round">${g}</g>`}

/* ================= 6. 建築與佈景 ================= */
Object.assign(POOL,{
 pyr12:[['dryBush12',2],['duneRock12',1.6],['cactus12',.6],['palm12',.5],['pebbles',1],['stone12',.2],['leaf12',.15]],
 slopeU12:[['boardStuck12',1.1],['dryBush12',.8],['duneRock12',.8],['rack12',.3],['pebbles',.8],['cutboard12',.35],['glasses12',.25],['vase12',.2],['paperroll12',.3]],
 slopeL12:[['dryBush12',.9],['duneRock12',.9],['boardStuck12',.6],['pebbles',.8],['stone12',.3],['cutboard12',.25],['jar12',.5],['leaf12',.2]],
 track12:[['jar12',1],['fence12',.6],['flagPile12',.3],['dryBush12',.8],['duneRock12',.8],['pebbles',.7],['ribbon12',.3],['satchel12',.3],['tablecloth12',.3],['leaf12',.25],['stone12',.25],['pot12',.3],['paperroll12',.2]],
 ride12:[['camelS12',.8],['camelR12',.9],['jar12',1],['dryBush12',.7],['duneRock12',.7],['crate',.5],['barrel',.6],['tablecloth12',.3],['satchel12',.3],['pot12',.3],['leaf12',.25],['vase12',.2],['stone12',.25]],
 decor12:[['dryBush12',1.6],['duneRock12',1],['pebbles',1],['cactus12',.4],['jar12',.3]],
 /* 2026-11-26 新區域（11-26e：兩側干擾物權重再 ×1.6） */
 sculptW12:[['pail12',1],['duneRock12',.5],['pebbles',.6],['dryBush12',.4],['jar12',.4],['stone12',0.48],['satchel12',0.4],['pot12',0.4],['cutboard12',0.32],['vase12',0.32]],
 sportE12:[['jar12',.8],['dryBush12',.5],['pebbles',.6],['crate',.4],['tablecloth12',0.48],['ribbon12',0.48],['leaf12',0.4],['satchel12',0.32],['glasses12',0.32],['paperroll12',0.24]],
 sideD12:[['dryBush12',2],['duneRock12',1.3],['pebbles',1],['cactus12',.4],['jar12',.4],['stone12',0.72],['leaf12',0.576],['pot12',0.576],['paperroll12',0.576],['vase12',0.48]]});
/* ===== 2026-11-26 新區域的造型（使用者選：沙雕 A 三座沙雕＋雕刻師、運動 B 沙地踢球＋D 涼飲小攤、位置 A 沙雕西運動東） ===== */
const SA12='#ead09a',SD12='#cfae6c',SL12='#f6e4b8';
const shd12=rx=>`<ellipse cx="0" cy="3" rx="${rx}" ry="${f(rx*.16)}" fill="#000" opacity=".13" stroke="none"/>`;
const sCastle12=()=>shd12(56)+`<g transform="scale(1.2)"><path d="M-44,0 Q-46,-14 -30,-16 H30 Q46,-14 44,0Z" fill="${SD12}"/>`+
 [[-26,-48,16],[26,-48,16],[0,-66,22]].map(([x,y,w])=>`<rect x="${x-w/2}" y="${y}" width="${w}" height="${-y-14}" fill="${SA12}"/>`+[0,1,2].map(i=>`<rect x="${f(x-w/2+i*(w/2.5))}" y="${y-6}" width="${f(w/5)}" height="6" fill="${SA12}"/>`).join('')).join('')+
 `<rect x="-36" y="-32" width="72" height="18" fill="${SA12}"/>`+[-30,-18,-6,6,18,30].map(x=>`<rect x="${x-3}" y="-37" width="6" height="5" fill="${SA12}"/>`).join('')+
 `<path d="M-6,-14 V-24 Q0,-30 6,-24 V-14Z" fill="#8a6a3a"/><path d="M-22,-34 H-18 M18,-34 H22 M-2,-52 H2" stroke="#8a6a3a" stroke-width="3"/><path d="M-36,-20 H36" stroke="${SL12}" stroke-width="1.4" fill="none"/></g>`;
const sCamel12=()=>shd12(54)+`<g transform="scale(1.15)"><path d="M-40,0 Q-42,-12 -30,-14 H34 Q44,-12 42,0Z" fill="${SD12}"/><path d="M-30,-14 Q-28,-30 -14,-30 Q-8,-46 2,-32 Q10,-46 20,-30 Q30,-28 30,-14Z" fill="${SA12}"/>`+
 `<path d="M28,-20 Q40,-26 40,-44 Q42,-52 50,-50 Q56,-46 50,-42 L46,-40 Q46,-24 34,-14Z" fill="${SA12}"/><circle cx="48" cy="-47" r="1.6" fill="${OL}" stroke="none"/><path d="M-10,-22 Q2,-26 14,-22" fill="none" stroke="${SL12}" stroke-width="1.6"/></g>`;
const sSphinx12=()=>shd12(60)+`<g transform="scale(1.2)"><path d="M-48,0 Q-50,-10 -38,-12 H40 Q50,-10 48,0Z" fill="${SD12}"/><path d="M-40,-12 Q-42,-30 -20,-32 H14 L14,-12Z" fill="${SA12}"/><path d="M14,-12 H46 Q50,-16 44,-18 H14Z" fill="${SA12}"/>`+
 `<path d="M6,-30 Q2,-58 18,-62 Q34,-58 30,-30 L36,-16 H0Z" fill="${SA12}"/><path d="M10,-36 Q18,-56 26,-36 Q26,-26 18,-24 Q10,-26 10,-36Z" fill="${SL12}"/><path d="M4,-30 L1,-20 M8,-40 L4,-32 M28,-40 L32,-32 M32,-30 L35,-20" stroke="${SD12}" stroke-width="2"/><circle cx="15" cy="-40" r="1.4" fill="${OL}" stroke="none"/><circle cx="21" cy="-40" r="1.4" fill="${OL}" stroke="none"/></g>`;
const pail12=(c='#2f6f73')=>`<ellipse cx="0" cy="1" rx="9" ry="2.4" fill="#000" opacity=".12" stroke="none"/><path d="M-7,0 L-8,-12 H8 L7,0Z" fill="${c}"/><ellipse cx="0" cy="-12" rx="8" ry="2.2" fill="#e0c286" stroke-width="1.2"/><path d="M-8,-12 Q0,-21 8,-12" fill="none" stroke-width="1.4"/>`;
/* 雕刻師：側面彎腰、手拿小鏟子（work 動畫）；旁邊一個小水桶 */
const sculptor12=(c)=>act(0,0,1,{pose:'reach',shirt:c,hat:HAT_T,hs:0,force:1,extra:''},'work')+`<path d="M13,-17 L22,-8" stroke="#7a5235" stroke-width="2.4"/><path d="M19,-11 L26,-6 L22,-2Z" fill="#a8a8a0" stroke-width="1"/>`+T(-16,0,1,pail12(pk(['#2f6f73','#c4473a','#e0a030'])));
/* 踢球：球門（正面看）、跑來跑去的人、滾來滾去的球（自己的 keyframes，一直會跑） */
const STY12=`<style>@keyframes kk12a{0%,100%{transform:translateX(-26px)}50%{transform:translateX(26px)}}@keyframes kk12b{0%,100%{transform:translate(20px,0)}50%{transform:translate(-24px,8px)}}@keyframes ball12{0%,100%{transform:translate(-40px,0)}25%{transform:translate(0,-14px)}50%{transform:translate(40px,0)}75%{transform:translate(0,-10px)}}</style>`;
const goal12=()=>`<ellipse cx="0" cy="2" rx="30" ry="4" fill="#000" opacity=".1" stroke="none"/><path d="M-24,0 V-34 H24 V0" fill="none" stroke="${OL}" stroke-width="6"/><path d="M-24,0 V-34 H24 V0" fill="none" stroke="#f4ecd8" stroke-width="3.4"/><path d="M-20,-30 L-12,-4 M-8,-30 L0,-4 M4,-30 L12,-4 M-22,-18 H22" stroke="#d8cfb8" stroke-width="1" fill="none"/>`;
const kicker12=(c,k)=>`<g style="animation:${k} ${f(sr(2.4,3.4))}s ease-in-out infinite;animation-delay:-${f(sr(0,3))}s">${act(0,0,pk([1,-1]),{pose:'run',shirt:c,hat:r()<.5?HAT_T:-1,hs:0,force:1},'step')}</g>`;
const ball12=()=>STY12+`<g style="animation:ball12 3.2s ease-in-out infinite"><circle cy="-6" r="6" fill="#f4ecd8"/><path d="M-2,-9 L2,-9 L3,-5 L0,-3 L-3,-5Z" fill="#3a2a22" stroke="none"/></g>`;
/* 涼飲小攤：條紋遮陽篷、陶罐、攤販 */
const stall12=()=>`<ellipse cx="0" cy="3" rx="48" ry="6" fill="#000" opacity=".13" stroke="none"/><path d="M-40,0 V-48 M40,0 V-48" stroke="#7a5235" stroke-width="4"/>`+
 T(0,-14,.66,chibi({view:'front',skin:'#b97a4e',top:'long',shirt:'#c4573a',bottom:'pants',pants:'#e8d9b4',hat:HAT_T,hs:0,arm:1,mood:2}))+
 `<rect x="-42" y="-28" width="84" height="28" fill="#c99a5b"/><path d="M-42,-18 H42" stroke="#a8703f" stroke-width="1.2"/>`+
 [-32,-21,21,32].map((x,i)=>`<g transform="translate(${x},-28)"><path d="M-5,0 Q-8,-7 -3.4,-11 H3.4 Q8,-7 5,0Z" fill="${['#c4642f','#e3f0ee','#d6a23a','#c4642f'][i]}"/></g>`).join('')+
 `<path d="M-50,-48 H50 L44,-64 H-44Z" fill="#f3e2b8"/>`+[-38,-14,10,34].map(x=>`<path d="M${x},-64 H${x+10} L${x+12},-48 H${x+2}Z" fill="#2f6f73" stroke="none"/>`).join('')+`<path d="M-50,-48 H50 L44,-64 H-44Z" fill="none"/><path d="M-50,-48 q6,6 12.5,0 q6,6 12.5,0 q6,6 12.5,0 q6,6 12.5,0 q6,6 12.5,0 q6,6 12.5,0 q6,6 12.5,0 q6,6 12.5,0" fill="#f3e2b8"/>`;
const CHEER12=['射門！射門啊！','這球踢得真漂亮！','沙地上跑好累，等一下要喝涼的。','守門員快撲！','我們這隊領先一球！'];
function structures(){
 skyBirds(N);
 /* 北邊：棕櫚、仙人掌、岩石 */
 [[700,560,1],[790,640,-1],[1810,570,-1],[1740,650,1]].forEach(([x,y,l])=>add(x,y,50,92,'palm12',palm(l,1),{sh:.8}));
 [[1010,620],[1500,630]].forEach(([x,y])=>add(x,y,44,60,'cactus12',cactusBig(),{sh:.6}));
 /* 大沙丘頂：滑沙板租借小屋、板子架、插在沙裡的板子 */
 add(1250,790,134,92,'hut12',hut(),{sh:.9});add(1130,820,70,64,'rack12',rack(),{sh:.7});add(1390,822,70,64,'rack12',rack(),{sh:.7});
 [[1020,830],[1540,860],[900,950],[1620,950]].forEach(([x,y])=>add(x,y,28,56,'boardStuck12',boardStuck(),{sh:.4}));
 /* 滑沙道上的小孩：站著、坐著 */
 [[1075,905,0,1,-6],[1130,1040,1,1,4],[1000,1150,0,0,-4],[1280,830,0,1,0],[1345,960,1,1,6],[1388,1100,0,0,-6],[1500,935,0,1,4],[1560,1090,1,1,-4],[1010,1020,1,0,0]].forEach(([x,y,sit,spr,t])=>add(x,y,58,70,'boarder12',boarder({sit,spray:spr,tilt:t,arm:sit?0:2}),{}));
 /* 坡腳的水罐和棕櫚 */
 [[760,1300],[1870,1290]].forEach(([x,y])=>add(x,y,50,92,'palm12',palm(x<1000?1:-1,1),{sh:.8}));
 /* 賽道：兩側木柵欄、終點門、彩旗、兩邊觀眾台 */
 for(let y=1420;y<=1690;y+=52){add(1462,y,60,26,'fence12',fence(),{sh:.3});add(1718,y,60,26,'fence12',fence(),{sh:.3})}
 add(1590,1722,190,100,'arch12',arch(),{sh:.6});
 add(1360,1480,130,70,'bunting12',buntingLine(120,10),{sh:.2});add(1830,1480,130,70,'bunting12',buntingLine(120,10),{sh:.2});
 add(1370,1690,134,94,'stand12',stand(),{sh:.9});add(1820,1690,134,94,'stand12',stand(),{sh:.9});
 add(1560,1560,72,100,'camelRide12',camelRide('#d6aa66','#b98a4a',{shirt:'#c4573a'}),{});add(1625,1470,72,100,'camelRide12',camelRide('#c99a58','#a8783a',{shirt:'#7a4fa0',skin:'#a8683e'}),{});
 /* 騎駱駝體驗區：帳篷、駱駝、水罐、板子架 */
 add(740,1830,150,70,'tent12',tent('#c4573a'),{sh:.9});add(760,1990,150,70,'tent12',tent('#2f6f73'),{sh:.9});
 add(900,1790,76,40,'camelR12',CAMEL.rest(),{});add(960,1990,76,40,'camelR12',CAMEL.rest('#d6b072','#b88a4c'),{});
 add(1020,1900,72,100,'camelRide12',camelRide('#dcb878','#b98a4a',{shirt:'#2f6f73'}),{});add(1200,1930,72,100,'camelRide12',camelRide('#d6aa66','#b98a4a',{shirt:'#d89a3a',skin:'#b97a4e'}),{fl:true});
 add(1370,1840,70,80,'camelS12',CAMEL.stand('#c99a58','#a8783a',true),{});add(1730,1960,70,80,'camelS12',CAMEL.stand('#dcb878','#b98a4a',false),{fl:true});
 add(1560,1990,70,64,'rack12',rack(),{sh:.7});
 [[1250,1850],[1700,1830],[800,1700]].forEach(([x,y])=>add(x,y,30,34,'jar12',jar('#c4642f',1),{sh:.4}));
 [[700,2050],[1860,2060]].forEach(([x,y])=>add(x,y,44,60,'cactus12',cactusBig(),{sh:.6}));
 /* ===== 2026-11-26 西邊：沙雕比賽（三座沙雕＋雕刻師、圍觀的人） ===== */
 add(480,1420,130,90,'sculpt12',sCastle12(),{sh:.8,say:'雕刻師：塔頂要拍緊一點，不然一陣風就沒了！'});
 add(520,1610,130,70,'sculpt12',sCamel12(),{sh:.8,say:'雕刻師：駱駝的脖子最難，一不小心就斷掉。'});
 add(470,1800,140,90,'sculpt12',sSphinx12(),{sh:.8,say:'雕刻師：再給我一桶水，鼻子還要修一修。'});
 [[400,1440,'#c4573a'],[600,1630,'#2f6f73'],[570,1820,'#d89a3a']].forEach(([x,y,c],i)=>add(x,y,46,62,'sculptor12',x>500?T(0,0,1,sculptor12(c),true):sculptor12(c),{say:['我的沙堡一定拿第一！','水不能潑太多，沙會塌⋯⋯','加油，太陽下山前要完成！'][i]}));
 [[590,1350,-1],[400,1560,1],[600,1720,-1],[400,1900,1]].forEach(([x,y,d],i)=>add(x,y,30,62,'watch12',act(0,0,d,{arm:i%2},'nod'),{say:['那座人面獅身好像真的！','我覺得駱駝最可愛。','明年我也要報名！','評審什麼時候來呀？'][i]}));
 /* ===== 2026-11-26 東邊：沙地踢球＋涼飲小攤 ===== */
 add(2017,1262,60,40,'goal12',goal12(),{sh:.4,say:'守門員：今天一球都別想進！'});add(2017,1640,60,40,'goal12',goal12(),{sh:.4});
 add(2017,1450,40,24,'ball12',ball12(),{mark:false});
 [[1960,1330,'#c4573a','kk12a'],[2080,1380,'#2f6f73','kk12b'],[1990,1500,'#2f6f73','kk12a'],[2070,1560,'#c4573a','kk12b'],[1950,1420,'#c4573a','kk12b'],[2090,1470,'#2f6f73','kk12a']].forEach(([x,y,c,k],i)=>add(x,y,36,62,'kick12',kicker12(c,k),{say:['傳給我！傳給我！','沙子好燙，跑快一點！','差一點點就進了！','換我守門吧～','這球是我的！','呼⋯⋯先喘口氣。'][i]}));
 mark(2017,1652,232,430,1);/* 球場上不要長草叢、石頭 */
 [[1895,1300,1],[1895,1560,1],[2140,1350,-1]].forEach(([x,y,d],i)=>add(x,y,30,62,'watch12',act(0,0,d,{arm:2},'nod'),{say:CHEER12[i]}));
 add(2030,1780,100,70,'stall12',stall12(),{sh:.9,say:'攤販：薄荷涼水、椰棗汁，踢完球來一杯！'});
 [[1950,1820,1],[2110,1830,-1]].forEach(([x,y,d],i)=>add(x,y,30,62,'watch12',act(0,0,d,{arm:1},'nod'),{say:CHEER12[i+3]}));
 /* 兩邊加寬的地方：棕櫚、仙人掌、岩石 */
 [[440,640,1],[2060,620,-1],[420,1100,1],[2090,1060,-1]].forEach(([x,y,l])=>add(x,y,50,92,'palm12',palm(l,1),{sh:.8}));
 [[540,900],[1960,880],[430,2040],[2080,2040]].forEach(([x,y])=>add(x,y,44,60,'cactus12',cactusBig(),{sh:.6}));
 add(560,1150,150,70,'tent12',tent('#d89a3a'),{sh:.9});
}
function scatterAll(){
 scatter('pyr12',POOL.pyr12,2600,40);scatter('slopeU12',POOL.slopeU12,3400,50);scatter('slopeL12',POOL.slopeL12,3400,50);
 scatter('track12',POOL.track12,3400,50);scatter('ride12',POOL.ride12,3400,50);
 scatter('sculptW12',POOL.sculptW12,1800,14);scatter('sportE12',POOL.sportE12,1800,12);scatter('westD12',POOL.sideD12,3000,26);scatter('eastD12',POOL.sideD12,3000,26);
 scatter('all12',POOL.decor12,6000,55);
}
SCENE_IMPL[N]={ground,structures,scatter:scatterAll};
Object.assign(VPLAN,{slopeU12:{chat:4,walker:4,stretch:2,carryBox:2},slopeL12:{walker:6,chat:4,handInHand:2,flute:1},
 track12:{chat:6,walker:6,benchPair:2,flute:2,carryBox:2,handInHand:2},sculptW12:{walker:2,chat:2},sportE12:{walker:2,chat:2,carryBox:1},ride12:{chat:4,walker:4,sleeping:2,stretch:2,carryBox:2,benchPair:1}});
HOSTK.add('palm12');HOSTK.add('hut12');HOSTK.add('stand12');HOSTK.add('jar12');HOSTK.add('tent12');
HOSTK.add('sculpt12');HOSTK.add('stall12');HOSTN.sculpt12='沙雕';HOSTN.stall12='涼飲小攤';HOSTN.palm12='棕櫚樹';HOSTN.hut12='滑沙板租借小屋';HOSTN.stand12='觀眾台';HOSTN.jar12='水罐';HOSTN.tent12='帳篷';
/* 物件的合理位置：SPOTS 放在那個東西上或旁邊；BLEND 是顏色相近的東西 */
H.SPOTS[N]={
 sandboard12:[['rack12',.3,.1],['hut12',.55,.2],['boardStuck12',.15,.55],['sculpt12',0.1,0.6],['stall12',0.06,0.6]],
 goggles12:[['hut12',.42,.3],['rack12',.3,-.3],['stand12',.45,.4],['sculpt12',0.1,0.6],['stall12',0.06,0.6]],
 saddleblanket12:[['camelS12',.55,.2],['tent12',.06,.5],['camelR12',.2,.62],['sculpt12',0.1,0.6],['stall12',0.06,0.6]],
 waterskin12:[['camelS12',.5,.5],['jar12',.12,.7],['tent12',.06,-.55],['sculpt12',0.1,0.6],['stall12',0.06,0.6]],
 bell12:[['camelS12',.55,.45],['arch12',.45,.3],['stand12',.45,.4],['sculpt12',0.1,0.6],['stall12',0.06,0.6]],
 flags12:[['arch12',.4,.3],['stand12',.45,.2],['flagPile12',.3,.2],['sculpt12',0.1,0.6],['stall12',0.06,0.6]],
 hourglass12:[['hut12',.42,-.3],['stand12',.45,.4],['tent12',.06,.5],['sculpt12',0.1,0.6],['stall12',0.06,0.6]],
 scarab12:[['sculpt12',.1,.6],['duneRock12',.1,.55],['tent12',.06,-.55],['stand12',.45,-.3],['stall12',0.06,0.6]],
 palmfan12:[['stall12',.06,.6],['stand12',.45,.3],['palm12',.04,.3],['tent12',.08,.62],['sculpt12',0.1,0.6]],
 telescope12:[['stand12',.45,-.4],['hut12',.42,.1],['arch12',.5,.3],['sculpt12',0.1,0.6],['stall12',0.06,0.6]],
 compass:[['camelS12',.55,.45],['hut12',.42,.4],['jar12',.12,.7],['sculpt12',0.1,0.6],['stall12',0.06,0.6]],
 amphora:[['jar12',.1,.7],['tent12',.06,.58],['hut12',.42,-.4],['sculpt12',0.1,0.6],['stall12',0.06,0.6]]};
/* 2026-11-26 難度調整：遮擋物（每種 1 個露一角藏在這些東西後面） */
['rack12','stand12','tent12','hut12','camelS12','camelR12','camelRide12','flagPile12','sculpt12','stall12'].forEach(k=>H.OCCK.add(k));
H.BLEND[N]={sandboard12:['cutboard12','boardStuck12'],goggles12:['glasses12','dryBush12'],saddleblanket12:['tablecloth12','camelR12'],waterskin12:['satchel12','jar12'],
 bell12:['pot12','jar12'],flags12:['ribbon12','flagPile12'],hourglass12:['vase12','jar12'],scarab12:['stone12','duneRock12'],palmfan12:['leaf12','dryBush12'],
 telescope12:['paperroll12','fence12'],compass:['pot12','duneRock12'],amphora:['jar12','jar12']};

/* ================= 7. 連環小故事：鑽進彩旗堆的小跳鼠 ================= */
const boardHold=`<g transform="translate(24,-26) rotate(8)"><rect x="-6" y="-34" width="12" height="62" rx="6" fill="#c98a4a"/><path d="M0,-30 V22" stroke="#c4473a" stroke-width="2.4" fill="none"/><path d="M-6,-8 H6" stroke="#5a3a22" stroke-width="3" fill="none"/></g>`;
STORIES[N]={title:'鑽進彩旗堆的小跳鼠',who:'滑沙小孩',
 giver:()=>act(0,0,1,{view:'fq',pose:'reach',hat:HAT_T,mood:2,skin:'#b97a4e',shirt:'#c4573a',top:'long',bottom:'pants',pants:'#e8d9b4',extra:boardHold}),
 target:()=>flagPile()+T(2,-12,.72,jerboa())+`<path d="M-26,2 L-4,2 L-15,-18Z" fill="#c4473a" stroke-width="1.5"/><path d="M2,2 L24,2 L13,-16Z" fill="#2f6f73" stroke-width="1.5"/><path d="M-12,3 L12,3 L0,-12Z" fill="#e8a030" stroke-width="1.5"/>`,tw:60,th:54,
 helper:()=>act(0,0,1,{view:'fq',pose:'hold',hat:HAT_T,mood:1,skin:'#8f5a36',shirt:'#2f6f73',top:'long',bottom:'pants',pants:'#d9c8a0',extra:`<path d="M-30,-58 L26,-24" fill="none" stroke="${OL}" stroke-width="6.4"/><path d="M-30,-58 L26,-24" fill="none" stroke="#b8a050" stroke-width="3.4"/><path d="M-16,-50 l-1,5 M0,-41 l-1,5 M14,-32 l-1,5" stroke="#7a6a30" stroke-width="1.4" fill="none"/><path d="M-30,-58 l-3,-12 l10,3Z" fill="#c4473a" stroke-width="1.3"/>`}),hw:56,hh:64,
 ask:'滑沙小孩：我的小跳鼠不見了！牠戴著紅色的小護目鏡，尾巴上掛著小鈴鐺。',
 need:'小跳鼠好像鑽進賽跑用的彩旗堆裡了，旗子太多我找不到⋯賽道旁有位拿長竹竿的賽駱駝騎手，他可以把旗子挑開！',
 got:'賽駱駝騎手：交給我！竹竿一挑就開。',
 ok:'小跳鼠蹦蹦跳跳出來了，尾巴的鈴鐺叮叮響。快去告訴滑沙小孩！'};

/* ================= 8. 冒險地圖（西南角沙漠）與過場 ================= */
HERE[N]=[-118,330];
H.mapHook(2,({P,ink,FN,open})=>{if(!open(N))return '';
 let g=H.mapRoute('M-54,358 Q-78,354 -98,350','road',ink);
 let m=`<g class="mnode" data-n="${N}"><g transform="translate(-118,346) scale(.9) translate(150,-354)"><g transform="translate(0,-10)"><circle cx="-150" cy="362" r="36" fill="transparent"/>`;
 /* 2026-11-22 使用者選 A：高高的大沙丘，兩條滑沙痕，頂上插一面小紅旗 */
 const ART=P('M-147,358 Q-133,326 -121,326 Q-108,326 -101,358Z','#f4dfa8',1.5)+`<path d="M-121,326 Q-108,326 -101,358 H-115 Q-114,340 -121,326Z" fill="#000" opacity=".12"/><path d="M-129,356 Q-125,342 -122,330 M-120,356 Q-116,342 -114,331" fill="none" stroke="#f9ebc6" stroke-width="3.6" stroke-linecap="round"/><path d="M-129,356 Q-125,342 -122,330 M-120,356 Q-116,342 -114,331" fill="none" stroke="#cfa860" stroke-width=".9" stroke-linecap="round"/><path d="M-121,327 v-13" stroke="${ink}" stroke-width="1.2"/>`+P('M-121,314 l9,3 l-9,3Z','#c4473a',1)+`<g transform="translate(-112,350) rotate(18)"><rect x="-2.4" y="-11" width="4.8" height="13" rx="2.4" fill="#c4573a" stroke="${ink}" stroke-width="1.1"/></g>`;
 m+=`</g></g>`+ART+`<g transform="translate(-118,374)"><rect x="-38" y="-10" width="76" height="18" rx="9" fill="#fffaf0" stroke="${ink}" stroke-width="1.8"/><text y="4" text-anchor="middle" font-size="11" fill="${ink}" font-family="${FN}">沙丘滑沙場</text></g></g>`;
 return g+m});
/* 過場：抱著滑沙板從大沙丘頂衝下去（背後看）。2026-11-18e 使用者說沙子方向反了：往前衝時地上的沙紋要往下（往鏡頭）流，沙花往後、往兩旁飛向鏡頭 */
RIDES.slide12={text:'抱緊板子，衝下去！',every:260,tick:k=>tone(300+(k%4)*40,.07,'triangle',.04),
 svg:()=>{const ripples=y0=>[0,1,2,3].map(i=>`<path d="M${20+i*90},${y0+i*38} q22,-8 44,0 q22,8 44,0" fill="none" stroke="#d9bb7e" stroke-width="2.4"/>`).join('');
  let s=`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><style>.sr12{animation:sr12 .9s linear infinite}@keyframes sr12{from{transform:translateY(-152px)}to{transform:translateY(0)}}.sw12{animation:sw12 .7s ease-in-out infinite alternate;transform-origin:200px 470px}@keyframes sw12{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}.sp12{animation:sp12 .5s linear infinite;transform-box:fill-box;transform-origin:50% 50%}@keyframes sp12{from{opacity:.95;transform:translate(0,0) scale(.7)}to{opacity:0;transform:translate(var(--dx),70px) scale(1.5)}}</style>`;
  s+=`<g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect width="400" height="600" fill="#f8e6bd" stroke="none"/><circle cx="90" cy="100" r="40" fill="#fdf0c0" stroke="none"/>`;
  s+=`<g stroke="none"><path d="M200,150 L278,70 L356,150Z" fill="#e6cb92"/><path d="M278,70 L356,150 H306Z" fill="#d3b274"/><path d="M80,150 L116,112 L152,150Z" fill="#e8cf98"/></g>`;
  s+=`<path d="M0,150 Q100,126 200,146 T400,144 V600 H0Z" fill="#f4dfa8"/>`;
  s+=`<path d="M200,146 Q250,126 400,144 V600 H300 Q260,300 200,146Z" fill="#dcbc7e" stroke="none"/>`;
  s+=`<g stroke="none"><ellipse cx="60" cy="140" rx="30" ry="9" fill="#9ab85a"/><path d="M52,140 q-2,-12 0,-16 M68,140 q2,-10 0,-14" fill="none" stroke="#5f8e3e" stroke-width="3"/></g>`;
  s+=`<path d="M170,150 Q120,360 60,600 M230,150 Q280,360 340,600" fill="none" stroke="#cfa860" stroke-width="4"/>`;
  s+=`<g clip-path="inset(150px 0 0 0)"><g class="sr12">${ripples(150)}${ripples(302)}${ripples(454)}${ripples(606)}</g></g>`;
  s+=`<g class="sw12"><ellipse cx="200" cy="484" rx="56" ry="9" fill="#b8903e" opacity=".4" stroke="none"/>`+
   `<rect x="164" y="470" width="72" height="14" rx="7" fill="#c98a4a"/><path d="M172,477 H228" stroke="#c4473a" stroke-width="2.4" fill="none"/>`+
   `<g transform="translate(200,472) scale(1.0)">${kid({view:'back',pose:'stand',hat:HAT_T,skin:'#c98d5e',shirt:'#c4573a',top:'long',bottom:'pants',pants:'#e8d9b4',arm:2})}</g></g>`;
  s+=[[150,500,0],[120,520,.2],[250,505,.1],[282,525,.3],[200,545,.15]].map(([x,y,d])=>`<g class="sp12" style="animation-delay:-${d}s;--dx:${x<200?-34:x>200?34:0}px" fill="#f2dbaa" stroke="none"><circle cx="${x}" cy="${y}" r="9"/><circle cx="${x-12}" cy="${y+8}" r="6"/></g>`).join('');
  return s+`</g></svg>`}};

/* ================= 9. 場景彩蛋：點大沙丘的斜坡，沙花飛起來 ================= */
H.TAPHOOKS[N]=(x,y)=>{if(!inSlope(x,y))return false;
 H.burst(x,y);H.toast('🏂 咻～沙子飛起來了！',1400);tone(520,.1,'triangle',.05);tone(700,.08,'triangle',.04,.08);return true};
})();

/* ================= 入口：綠洲市集西北邊大沙丘頂的滑沙小孩（2026-11-17 引擎 11-17b「找路發現新關卡」） =================
   levels.js 這一關有 find:{after:11,from:11,hint:[…]}：綠洲市集拿到 2 顆星之後，大沙丘頂出現抱著滑沙板、頭上有問號的小孩；
   點他 → 「要滑沙嗎？」→ 出發才算發現。這個檔案在綠洲市集載入時會一起載入（ensureFull）。
   RESERVE 只在這個檔案載入時才佔位置，所以還不能發現之前，綠洲市集完全不變。 */
(function(){
const H=window.TH;if(!H)return;const N=12;const {T,OL,act,chibi,HATS}=H;
const EX={x:836,y:472}; /* 2026-11-18 地圖上滑沙場改到綠洲西北邊，大沙丘和入口一起往西搬 404 */
(H.RESERVE[11]||(H.RESERVE[11]=[])).push([EX.x,EX.y+6,150,112]);
const turbanC='#f1e6cc';
const turban=`<g transform="translate(-1,0)">${H.HATKIT.turbanV(turbanC,{jewel:'#c4473a'})('fq')}</g>`; /* 2026-11-25k 帶路的人站斜前方，頭巾也畫斜前方 */
const board=(c,a)=>`<g transform="rotate(${a})"><rect x="-6" y="-62" width="12" height="62" rx="6" fill="${c}"/><path d="M0,-58 V-6" stroke="#fbf6ea" stroke-width="1.6" fill="none" opacity=".8"/><path d="M-6,-34 H6" stroke="#5a3a22" stroke-width="3" fill="none"/></g>`;
let kidSvg='';const boy=()=>kidSvg||(kidSvg=act(0,0,1,{view:'fq',pose:'hold',hat:-1,hs:3,skin:'#b97a4e',hair:'#2b2420',shirt:'#c4573a',pants:'#e8d9b4',mood:2,top:'long',bottom:'pants'})+T(0,0,1,turban));
/* 2026-11-18 使用者：入口角色頭上從「？」改成「…」（和一般路人一樣，增加探索難度）；圓點半徑 1.75，不會被當成路人提示（DOTSIG） */
const svg=found=>T(34,2,1,board('#2f6f73',10))+T(52,4,1,board('#e0a030',16))+T(-8,6,1,(found?'':`<g class="qbob">${H.bubble(14,-74,'dots').replace(/r="1\.7"/g,'r="1.75"')}</g>`)+boy()+T(26,-20,1,board('#c98a4a',-6)));
const pv=()=>`<svg viewBox="0 0 220 110" width="220" height="110" style="display:block"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect x="0" y="0" width="220" height="110" rx="10" fill="#f6dfa8" stroke="none"/><circle cx="176" cy="26" r="13" fill="#f5c842" stroke="none"/><path d="M0,80 Q60,30 120,26 Q170,30 220,80 V110 H0Z" fill="#f4dfa8"/><path d="M120,26 Q170,30 220,80 V110 H170 Q150,60 120,26Z" fill="#dcbc7e" stroke="none"/><path d="M96,40 Q80,76 64,104 M128,34 Q132,70 148,104" fill="none" stroke="#cfa860" stroke-width="9"/><path d="M96,40 Q80,76 64,104 M128,34 Q132,70 148,104" fill="none" stroke="#f9ebc6" stroke-width="5"/><g transform="translate(110,34) rotate(8)"><rect x="-4" y="-22" width="8" height="26" rx="4" fill="#c98a4a"/></g></g></svg>`;
H.EXITS[N]={x:EX.x,y:EX.y,w:130,h:96,svg,ask:{pv,title:'要去滑沙嗎？',
 text:'滑沙小孩：沙丘的另一邊就是滑沙場！<br>我借你一塊板子，一起衝下去吧！',again:'滑沙小孩：又要去滑沙場嗎？<br>板子都打過蠟了！',
 go:'🏂 抱著板子衝下去',wait:'之後再說',waitMsg:'滑沙小孩：好，我在這裡等你，想滑的時候再來找我！'}};
})();
