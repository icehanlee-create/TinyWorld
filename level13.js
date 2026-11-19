/* 奇幻小鎮大搜查．沙漠系列〔金字塔（白天）〕（找路發現的新關卡，編號 13 只是程式用）
   入口：沙丘滑沙場（第 12 關）最北邊，遠處商隊往金字塔走的地方（約 1250,560）——程式在這個檔案最後面（H.RESERVE[12]／H.EXITS[13]）。
   使用者 2026-11-17 決定：場景＝金字塔外面的考古營地＋最北邊金字塔底下的入口門洞（門洞只當伏筆，內部留給之後）；
   神燈故事這關先不放；過場＝背後看商隊走向越來越大的金字塔；冒險地圖沙漠往西（west:true）。
   本檔案不依賴滑沙場／綠洲市集的 kind，全部自己定義（id 都以 13 結尾）。 */
(function(){
const H=window.TH;if(!H)return;
const N=13;
const {T,f,r,sr,pk,ri,OL,kid,act,wrapAn,add,mark,canPlace,scatter,skyBirds,KIND,POOL,VPLAN,REG,SCREG,LEVELS,ART,DECOY,
 SCENE_IMPL,WATERFN,RIDES,HERE,OUTFITS,STORIES,HOSTK,HOSTN,SCATREG,SCATOK,tone,typeOf,HATS,limb,chibi}=H;
const tube=(d,c,w=3.4)=>`<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w+2.6}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;

/* ================= 1. 場景範圍、天空、場地邊緣 ================= */
H.SCENES[N]={x0:600,x1:1900,y1:2150,c:[1250,1650]};
H.TARGET[N]=330;
H.SKYC[N]='#f8e6bd';H.SKYY[N]=300;
H.EDGEM[N]='LRB';H.EDGED[N]='LRB';
H.EDGEDECO[N]=[['palm13',1.4],['cactus13',1],['rock13',1.4],['bush13',2.4]];
H.FRINGE[N]=[['bush13',2.4],['rock13',1.2],['cactus13',.8],['palm13',.5],['pebbles',1.2],['walker',.3]];
H.DENS[N]=1.15;

/* ================= 2. 當地人（長袍＋頭巾）和考古隊員（卡其襯衫＋探險盔） ================= */
const turbanHat=()=>{const c=pk(['#f4ecd6','#f4ecd6','#e8d8b0','#3f6f9a','#a4442f','#f4ecd6']);
 return `<path d="M-14,-41 Q-16,-60 0,-61 Q16,-60 14,-41 Q0,-47 -14,-41Z" fill="${c}"/><path d="M-13,-52 Q0,-59 13,-51 M-13,-47 Q0,-54 13,-46" fill="none" stroke="#00000033" stroke-width="1.3"/><path d="M11,-48 q7,6 5,16 q-5,-4 -7,-12Z" fill="${c}"/>`};
const HAT_T=HATS.push(turbanHat)-1;
const ROBES=['#e8d9b4','#c4573a','#2f6f73','#d89a3a','#7a4fa0','#f1e6cc','#4a6f9a','#8a5a3a'];
OUTFITS[N]=o=>{if(o.top)return o;
 if(r()<.4){ /* 考古隊員 */
  o.skin=o.skin||pk(['#e8c8a0','#d9a578','#c98d5e','#b97a4e','#8f5a36']);
  o.top='tee';o.bottom='pants';o.shirt=o.shirt||pk(['#d8c28a','#c9b27a','#e8dcc0','#b8c8a0','#d9b08a']);o.pants=o.pants||pk(['#7a5a3a','#8a6a40','#6a5a48']);
  if(o.hat==null&&!o.plain)o.hat=r()<.8?6:-1;return o}
 o.skin=o.skin||pk(['#c98d5e','#b97a4e','#a8683e','#d9a578','#8f5a36']);
 o.top='long';o.bottom='pants';o.shirt=o.shirt||pk(ROBES);o.pants=o.pants||'#e8d9b4';
 if(o.hat==null&&!o.plain)o.hat=r()<.7?HAT_T:-1;return o};

/* ================= 3. 物件與干擾物 ================= */
Object.assign(ART,{
 brush13:`<g transform="rotate(-35)"><rect x="-22" y="-3.6" width="28" height="7.2" rx="3.6" fill="#a8703f"/><path d="M-14,-3 V3" stroke="#7a4a22" stroke-width="1.2" fill="none"/><path d="M6,-4.6 L13,-5.4 L13,5.4 L6,4.6Z" fill="#c9ccd0"/><path d="M13,-7 Q25,-8 28,0 Q25,8 13,7Z" fill="#e8d4a0"/><path d="M15,-4 L26,-1.4 M15,0 H27 M15,4 L26,1.4" fill="none" stroke="#b8a070" stroke-width="1"/></g>`,
 lens13:`<path d="M6,6 L18,18" fill="none" stroke="${OL}" stroke-width="8.4" stroke-linecap="round"/><path d="M6,6 L18,18" fill="none" stroke="#7a4a22" stroke-width="5.4" stroke-linecap="round"/><circle cx="-4" cy="-4" r="13" fill="#bfe4ee" opacity=".95"/><circle cx="-4" cy="-4" r="13" fill="none" stroke="#c8913a" stroke-width="3.4"/><path d="M-12,-8 Q-10,-14 -4,-15" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/><path d="M0,-9 l4,3" fill="none" stroke="#e8f6fa" stroke-width="1.6"/>`,
 papyrus13:`<rect x="-19" y="-9" width="38" height="18" rx="2" fill="#ead69c"/><ellipse cx="-19" cy="0" rx="4" ry="9" fill="#d9bf7c"/><ellipse cx="-19" cy="0" rx="1.6" ry="4.6" fill="none" stroke-width="1.1"/><ellipse cx="19" cy="0" rx="4" ry="9" fill="#d9bf7c"/><ellipse cx="19" cy="0" rx="1.6" ry="4.6" fill="none" stroke-width="1.1"/>`+
  `<g fill="none" stroke="#5a4a32" stroke-width="1.5" stroke-linecap="round"><path d="M-12,-4 h5 M-12,0 q3,-3 6,0 M-12,4 h4 M-2,-5 l3,4 l3,-4 M-2,3 h6 M8,-4 q3,-2 4,2 M8,4 h6"/></g><path d="M-6,-9 V9 M6,-9 V9" fill="none" stroke="#c4473a" stroke-width="2.6" opacity=".9"/>`,
 mask13:`<path d="M-13,-16 Q0,-26 13,-16 L19,12 Q13,18 9,13 L9,2 H-9 V13 Q-13,18 -19,12Z" fill="#e4b53e"/><path d="M-13,-16 L-19,12 M-9,-12 L-13,12 M13,-16 L19,12 M9,-12 L13,12" fill="none" stroke="#2f6f9a" stroke-width="2.4"/>`+
  `<path d="M-8,-14 Q0,-19 8,-14 L8,2 Q0,6 -8,2Z" fill="#f0cf72"/><path d="M-6,-6 Q-4,-8 -2,-6 M2,-6 Q4,-8 6,-6" fill="none" stroke-width="1.5"/><path d="M-5,-5 H-1 M3,-5 H7" fill="none" stroke="#2f6f9a" stroke-width="1.4"/><path d="M-2,-2 L0,0 L2,-2" fill="none" stroke-width="1.2"/><path d="M-2,3 Q0,5 2,3" fill="none" stroke-width="1.2"/><path d="M-3,7 L0,14 L3,7Z" fill="#2f6f9a" stroke-width="1.2"/>`,
 eye13:`<rect x="-14" y="-17" width="28" height="34" rx="4" fill="#c9b78e"/><path d="M-14,-17 L-8,-11 L-12,-4 L-14,-9" fill="#b3a176" stroke="none" opacity=".7"/>`+
  `<path d="M-10,-2 Q0,-10 10,-2 Q0,5 -10,-2Z" fill="#f4ecd8"/><circle cx="0" cy="-2.4" r="3.2" fill="#2f6f9a"/><circle cx="0" cy="-2.4" r="1.2" fill="${OL}" stroke="none"/><path d="M-11,-8 Q0,-15 11,-8" fill="none" stroke="#2f6f9a" stroke-width="2.2"/><path d="M-2,2 Q-3,8 -8,10 M-2,3 V10 M5,3 Q9,6 8,11 q-3,0 -3,-3" fill="none" stroke="#2f6f9a" stroke-width="2"/>`,
 catstat13:`<path d="M-9,14 Q-12,2 -7,-6 Q-12,-12 -9,-20 L-6,-30 L-2,-23 Q0,-24 2,-23 L6,-30 L9,-20 Q12,-12 7,-6 Q12,2 9,14Z" fill="#2c2a34"/><path d="M-9,14 H9" fill="none" stroke-width="2.6"/>`+
  `<path d="M-7,-13 Q0,-9 7,-13 L8,-9 Q0,-4 -8,-9Z" fill="#e4b53e"/><path d="M-3,-6 L0,2 L3,-6" fill="none" stroke="#e4b53e" stroke-width="1.4"/><circle cx="-3.4" cy="-19" r="1.5" fill="#f0cf72" stroke="none"/><circle cx="3.4" cy="-19" r="1.5" fill="#f0cf72" stroke="none"/><path d="M-4,-26 L-3,-22 M4,-26 L3,-22" fill="none" stroke="#e4b53e" stroke-width="1.3"/><path d="M9,12 Q20,12 17,2" fill="none" stroke="${OL}" stroke-width="3.6" stroke-linecap="round"/><path d="M9,12 Q20,12 17,2" fill="none" stroke="#2c2a34" stroke-width="1.8" stroke-linecap="round"/>`,
 ankh13:`<ellipse cx="0" cy="-10" rx="8.6" ry="10.4" fill="none" stroke="${OL}" stroke-width="7"/><ellipse cx="0" cy="-10" rx="8.6" ry="10.4" fill="none" stroke="#e4b53e" stroke-width="4"/><path d="M0,0 V18 M-11,5 H11" fill="none" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><path d="M0,0 V18 M-11,5 H11" fill="none" stroke="#e4b53e" stroke-width="4" stroke-linecap="round"/><path d="M-5,-14 Q-6,-9 -4,-5" fill="none" stroke="#fbe08a" stroke-width="1.4"/>`,
 collar13:`<path d="M-21,-4 Q0,24 21,-4 L15,-8 Q0,10 -15,-8Z" fill="#e4b53e"/><path d="M-19,-3 Q0,20 19,-3 L17,-5 Q0,15 -17,-5Z" fill="#2f6f9a"/><path d="M-15,-8 Q0,10 15,-8 L12,-10 Q0,4 -12,-10Z" fill="#c4473a"/>`+
  [-16,-10,-4,2,8,14].map((x,i)=>`<circle cx="${x}" cy="${f(2+Math.abs(x)*.14+ (1-Math.abs(x)/21)*5)}" r="1.5" fill="#fbe08a" stroke="none"/>`).join('')+`<path d="M-21,-4 L-15,-8 M21,-4 L15,-8" fill="none" stroke-width="1.6"/><path d="M-21,-4 q-4,-8 -2,-12 M21,-4 q4,-8 2,-12" fill="none" stroke="#e4b53e" stroke-width="2.4" stroke-linecap="round"/>`,
 mummy13:`<ellipse cx="0" cy="-17" rx="9" ry="9.6" fill="#efe4c4"/><path d="M-9,-20 L9,-14 M-9,-15 L8,-10 M-8,-24 L8,-19" fill="none" stroke="#b8a678" stroke-width="1.4"/><rect x="-6" y="-12" width="12" height="3" fill="#efe4c4" stroke="none"/>`+
  `<path d="M-9,-9 Q-12,6 -8,16 H8 Q12,6 9,-9Z" fill="#efe4c4"/><path d="M-11,-4 L11,0 M-11,2 L11,6 M-10,8 L10,12 M-8,14 L8,16" fill="none" stroke="#b8a678" stroke-width="1.4"/><path d="M-9,-6 Q-18,0 -14,8 M9,-6 Q18,0 14,8" fill="none" stroke="#efe4c4" stroke-width="4" stroke-linecap="round"/>`+
  `<circle cx="-3.4" cy="-17" r="1.6" fill="${OL}" stroke="none"/><circle cx="3.4" cy="-17" r="1.6" fill="${OL}" stroke="none"/><path d="M-1.6,-12.6 Q0,-11.4 1.6,-12.6" fill="none" stroke-width="1.1"/>`,
 shard13:`<path d="M-17,-6 L-8,-16 L6,-13 L16,-17 L19,-4 L12,4 L14,13 L-2,16 L-10,10 L-18,6Z" fill="#c9764a"/><path d="M-17,-6 L-8,-16 L6,-13 L2,-6 L-8,-8Z" fill="#d98f5e" stroke="none" opacity=".8"/>`+
  `<g fill="none" stroke="#3a2a22" stroke-width="1.5" stroke-linecap="round"><path d="M-8,-4 q3,-3 6,0 M-9,2 h6 M2,-4 l3,5 l3,-5 M0,6 q4,2 8,-1 M-10,9 h4 M8,3 l4,2"/></g>`});
Object.assign(DECOY,{
 paintbrush13:`<g transform="rotate(-35)"><rect x="-24" y="-2.6" width="30" height="5.2" rx="2.6" fill="#d9d1b4"/><path d="M6,-3.6 L12,-4.4 L12,4.4 L6,3.6Z" fill="#c9ccd0"/><path d="M12,-4 Q20,-4 28,0 Q20,4 12,4Z" fill="#3a6fa0"/><path d="M-22,0 H-14" stroke="#c4473a" stroke-width="2" fill="none"/></g>`,
 handmirror13:`<path d="M6,6 L16,17" fill="none" stroke="${OL}" stroke-width="7.4" stroke-linecap="round"/><path d="M6,6 L16,17" fill="none" stroke="#c9a05a" stroke-width="4.6" stroke-linecap="round"/><circle cx="17" cy="19" r="3.4" fill="#c4786a" stroke-width="1.3"/><circle cx="-4" cy="-4" r="13" fill="#dfe8ee"/><circle cx="-4" cy="-4" r="13" fill="none" stroke="#c4786a" stroke-width="3.4"/><path d="M-11,-9 L-4,-14 M-12,-4 L-2,-13" fill="none" stroke="#ffffff" stroke-width="2"/>`,
 paperscroll13:`<rect x="-19" y="-9" width="38" height="18" rx="2" fill="#f6f1e2"/><ellipse cx="-19" cy="0" rx="4" ry="9" fill="#e8e0c8"/><ellipse cx="-19" cy="0" rx="1.6" ry="4.6" fill="none" stroke-width="1.1"/><ellipse cx="19" cy="0" rx="4" ry="9" fill="#e8e0c8"/><ellipse cx="19" cy="0" rx="1.6" ry="4.6" fill="none" stroke-width="1.1"/><path d="M-3,-9 V9" fill="none" stroke="#5a8ac4" stroke-width="3"/><path d="M-3,0 q-5,5 -9,3 M-3,0 q5,5 9,3" fill="none" stroke="#5a8ac4" stroke-width="2.2"/>`,
 goldplate13:`<circle cx="0" cy="0" r="16" fill="#e4b53e"/><circle cx="0" cy="0" r="11" fill="#f0cf72"/><circle cx="0" cy="0" r="16" fill="none"/><path d="M-6,-5 Q0,-9 6,-5 M-6,2 Q0,6 6,2" fill="none" stroke="#c8913a" stroke-width="1.6"/><path d="M-12,-9 Q-9,-13 -4,-14" fill="none" stroke="#fbe08a" stroke-width="2"/>`,
 stonebrick13:`<rect x="-16" y="-10" width="32" height="20" rx="2.4" fill="#b9ad92"/><path d="M-16,-3 H16" stroke="#a09578" stroke-width="1.2" fill="none"/><path d="M-6,-10 L-2,-3 L-7,3 L-4,10" fill="none" stroke="#8f8468" stroke-width="1.3"/><path d="M-14,-8 H0" stroke="#d6ccb0" stroke-width="1.6" fill="none"/>`,
 catbank13:`<path d="M-12,15 Q-15,2 -10,-5 Q-14,-12 -10,-19 L-7,-27 L-2,-21 Q0,-22 2,-21 L7,-27 L10,-19 Q14,-12 10,-5 Q15,2 12,15Z" fill="#8a9aaa"/><path d="M-12,15 H12" fill="none" stroke-width="2.6"/><path d="M-4,-24 H4" stroke="${OL}" stroke-width="2.4" fill="none"/><circle cx="-4" cy="-13" r="1.5" fill="${OL}" stroke="none"/><circle cx="4" cy="-13" r="1.5" fill="${OL}" stroke="none"/><path d="M-3,-8 Q0,-5 3,-8" fill="none" stroke-width="1.3"/><path d="M-6,-1 Q0,3 6,-1 L4,4 L0,1 L-4,4Z" fill="#e87a9a" stroke-width="1.3"/>`,
 keyring13:`<circle cx="0" cy="-6" r="10" fill="none" stroke="${OL}" stroke-width="5.6"/><circle cx="0" cy="-6" r="10" fill="none" stroke="#c9a05a" stroke-width="3.2"/><g transform="translate(-4,3) rotate(-14)"><circle cx="0" cy="3" r="3.6" fill="#c9a05a" stroke-width="1.4"/><rect x="-1.6" y="6" width="3.2" height="11" rx="1.4" fill="#c9a05a" stroke-width="1.3"/><path d="M1.6,12 h3.4 M1.6,15 h2.6" fill="none" stroke-width="1.4"/></g><g transform="translate(6,2) rotate(18)"><circle cx="0" cy="3" r="3.2" fill="#d6b26a" stroke-width="1.4"/><rect x="-1.4" y="5" width="2.8" height="10" rx="1.4" fill="#d6b26a" stroke-width="1.3"/></g>`,
 beads13:`<g>`+Array.from({length:14},(_,i)=>{const a=i/14*Math.PI*2;return `<circle cx="${f(Math.cos(a)*14)}" cy="${f(Math.sin(a)*12)}" r="3.4" fill="${i%3===2?'#9ec6e8':'#4f86c4'}" stroke-width="1.2"/>`}).join('')+`</g><path d="M-3,-14 q-4,-6 -8,-4 M3,-14 q4,-6 8,-4" fill="none" stroke="#7a5a3a" stroke-width="1.8"/>`,
 ragdoll13:`<circle cx="0" cy="-16" r="8.6" fill="#f6f1e2"/><path d="M-8,-20 Q-6,-26 -1,-24 Q4,-27 8,-20 Q8,-24 0,-26 Q-8,-25 -8,-20Z" fill="#c4573a" stroke-width="1.2"/><circle cx="-3" cy="-16" r="1.5" fill="${OL}" stroke="none"/><circle cx="3" cy="-16" r="1.5" fill="${OL}" stroke="none"/><path d="M-3,-11 Q0,-9 3,-11" fill="none" stroke-width="1.2"/><path d="M-8,-8 Q-11,6 -7,16 H7 Q11,6 8,-8Z" fill="#f6f1e2"/><path d="M-8,-5 Q-17,0 -13,8 M8,-5 Q17,0 13,8" fill="none" stroke="#f6f1e2" stroke-width="4" stroke-linecap="round"/><path d="M-5,-2 l2,2 M-5,0 l2,-2" fill="none" stroke="#c4573a" stroke-width="1.2"/>`,
 cookie13:`<circle cx="0" cy="0" r="15" fill="#d8a85a"/><circle cx="-3" cy="-3" r="14" fill="#e4bb70" stroke="none"/><g fill="#6a4228" stroke="none"><circle cx="-6" cy="-6" r="2"/><circle cx="5" cy="-5" r="1.8"/><circle cx="-3" cy="4" r="2.1"/><circle cx="7" cy="5" r="1.7"/><circle cx="-9" cy="2" r="1.4"/></g><path d="M-10,-10 Q-6,-13 -2,-13" fill="none" stroke="#f4d896" stroke-width="2"/>`});

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
const tent=(c='#b8a060',trim='#7a5a3a')=>`<ellipse cx="0" cy="3" rx="76" ry="8" fill="#000" opacity=".14" stroke="none"/>`+
 `<path d="M-68,0 L-60,-44 Q0,-66 60,-44 L68,0Z" fill="#e8d8aa"/><path d="M-60,-44 Q0,-66 60,-44 L52,-46 Q0,-62 -52,-46Z" fill="${c}" stroke="none"/>`+
 `<path d="M-60,-44 Q0,-66 60,-44" fill="none" stroke-width="2.2"/><path d="M-62,-40 Q0,-60 62,-40" fill="none" stroke="#fffaf0" stroke-width="1.6" opacity=".7"/>`+
 `<path d="M-24,0 L-21,-33 Q0,-41 21,-33 L24,0Z" fill="#3a2a22"/><path d="M-24,0 L-21,-33 L-36,-26 L-42,0Z" fill="${c}"/><path d="M24,0 L21,-33 L36,-26 L42,0Z" fill="${c}"/><path d="M-22,0 L-20,-6 H20 L22,0Z" fill="${trim}" stroke-width="1.4"/>`+
 `<path d="M-68,0 l-8,6 M68,0 l8,6 M0,-64 V-72" fill="none" stroke-width="1.8"/><path d="M0,-72 l10,3 l-10,3Z" fill="#c4473a" stroke-width="1.3"/>`;
/* 2026-11-18 駱駝改用 art.js 的 CAMELART（使用者選 B 雙峰＋G 修長盛裝，兩種輪流） */
const CAMEL=CAMELART;
/* 獅身像（2026-11-18f 重畫，使用者最後選 A 側面加強：原創畫法，面朝左；伸長的前爪、後腿肌肉、尾巴繞到背上；金藍條紋頭巾、假鬍子、額頭小眼鏡蛇） */
let SXC=0;
const sxStripes=(d,base,line,step,x0,x1,y0,y1,w=2.4)=>{const id='sx13c'+(SXC++);let s=`<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${base}"/><g clip-path="url(#${id})" stroke="${line}" stroke-width="${w}" fill="none">`;for(let y=y0;y<=y1;y+=step)s+=`<path d="M${x0},${y} H${x1}"/>`;return s+`</g><path d="${d}" fill="none"/>`};
const sphinx=(o={})=>{const S=o.stone||'#dcbf7e',S2=o.stone2||'#c9a964',S3=o.stone3||'#e6cd93',HB=o.hb||'#3f7a9a',HG=o.hg||'#e4b53e',SK=o.skin||'#e2c486';
 let s=`<ellipse cx="0" cy="3" rx="124" ry="9" fill="#000" opacity=".14" stroke="none"/>`;
 // 遠側前爪（比較暗、略高）
 s+=`<path d="M-58,-6 L-112,-8 Q-122,-8 -122,-14 Q-122,-20 -112,-20 L-60,-22Z" fill="${S2}"/>`;
 // 身體
 s+=`<path d="M-66,-4 Q-74,-36 -54,-50 Q-16,-62 38,-56 Q82,-52 98,-24 Q104,-8 96,0 L-60,0Z" fill="${S}"/>`;
 s+=`<path d="M10,-58 Q60,-58 88,-40" fill="none" stroke="${S3}" stroke-width="3" opacity=".9"/>`;
 // 石塊接縫、風化
 s+=`<g fill="none" stroke="${S2}" stroke-width="1.4"><path d="M-30,-56 V-34 M8,-58 V-40 M-40,-28 H20 M-12,-28 V-6 M30,-20 V-4"/><path d="M-20,-46 l6,4 l-3,5" stroke-width="1.2"/></g>`;
 // 後腿（大腿肌肉＋趴著的後腳）
 s+=`<path d="M48,-6 Q44,-40 74,-44 Q100,-42 100,-16 Q100,0 86,0 L52,0Z" fill="${S}"/><path d="M60,-34 Q74,-42 88,-34" fill="none" stroke="${S2}" stroke-width="1.6"/>`;
 s+=`<path d="M30,0 Q30,-10 46,-10 L66,-10 Q74,-8 74,0Z" fill="${S3}"/><path d="M38,0 V-6 M46,0 V-6 M54,0 V-6" fill="none" stroke="${S2}" stroke-width="1.3"/>`;
 // 尾巴：從屁股繞上來趴在背上
 s+=`<path d="M100,-12 Q118,-14 112,-34 Q104,-50 82,-52 Q66,-52 62,-58" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><path d="M100,-12 Q118,-14 112,-34 Q104,-50 82,-52 Q66,-52 62,-58" fill="none" stroke="${S}" stroke-width="3.4" stroke-linecap="round"/><path d="M62,-58 q-8,-2 -10,4 q6,2 10,-4Z" fill="${S2}" stroke-width="1.4"/>`;
 // 近側前爪
 s+=`<path d="M-54,0 L-118,0 Q-130,0 -130,-8 Q-130,-16 -118,-16 L-56,-18Z" fill="${S3}"/><path d="M-124,-4 h7 M-124,-10 h7 M-112,-16 V-6" fill="none" stroke="${S2}" stroke-width="1.3"/>`;
 // 胸口＋前胸
 s+=`<path d="M-74,0 Q-82,-28 -78,-58 Q-64,-68 -46,-62 Q-36,-40 -34,-18 Q-36,-4 -26,0Z" fill="${S}"/><path d="M-70,-10 Q-76,-30 -72,-52" fill="none" stroke="${S3}" stroke-width="3" opacity=".9"/><path d="M-66,-30 Q-58,-24 -50,-30 M-68,-16 Q-58,-10 -48,-16" fill="none" stroke="${S2}" stroke-width="1.3"/>`;
 // 頭巾後面（大塊垂到背）
 s+=sxStripes(`M-90,-104 Q-82,-128 -56,-126 Q-34,-122 -32,-96 L-28,-58 Q-38,-52 -48,-56 L-54,-88Z`,HB,HG,6,-100,-20,-130,-50,2.6);
 // 臉（側臉朝左）
 s+=`<path d="M-86,-112 Q-94,-108 -94,-98 L-99,-90 L-94,-87 Q-97,-82 -93,-78 Q-91,-72 -84,-72 L-70,-74 L-64,-108Z" fill="${SK}"/>`;
 s+=`<path d="M-89,-98 Q-84,-101 -79,-99" fill="none" stroke-width="1.6"/><path d="M-88,-95 q4,-2 7,0 q-3,3 -7,0Z" fill="#fffaf0" stroke-width="1.2"/><circle cx="-84.5" cy="-95.5" r="1.4" fill="${OL}" stroke="none"/><path d="M-88,-95 l-5,1" fill="none" stroke-width="1.2"/>`;
 s+=`<path d="M-92,-80 q4,1 7,-1" fill="none" stroke-width="1.3"/>`;
 // 假鬍子
 s+=`<path d="M-88,-73 L-87,-58 Q-84,-55 -81,-58 L-81,-73Z" fill="${S2}" stroke-width="1.5"/><path d="M-87,-68 h6 M-87,-63 h6" fill="none" stroke="${S}" stroke-width="1"/>`;
 // 頭巾前緣（額頭的帶子＋垂到肩膀的一片）
 s+=`<path d="M-92,-108 Q-80,-120 -62,-114 L-64,-106 Q-80,-112 -90,-102Z" fill="${HG}" stroke-width="1.6"/>`;
 s+=sxStripes(`M-72,-104 L-64,-106 L-58,-60 L-70,-58Z`,HB,HG,6,-80,-50,-110,-56,2.4);
 // 額頭的小眼鏡蛇
 s+=`<path d="M-92,-112 q-2,-8 3,-10 q4,0 3,6 l-2,5Z" fill="${HG}" stroke-width="1.4"/>`;
 return s};
const obelisk=()=>`<ellipse cx="0" cy="3" rx="22" ry="5" fill="#000" opacity=".14" stroke="none"/><path d="M-10,0 L-7,-94 L0,-112 L7,-94 L10,0Z" fill="#d9c498"/><path d="M0,-112 L7,-94 L10,0 H3Z" fill="#c2ab7a" stroke="none" opacity=".85"/><path d="M-7,-94 L0,-112 L7,-94Z" fill="#e4b53e" stroke-width="1.6"/>`+
 `<g fill="none" stroke="#8f7a4a" stroke-width="1.4" stroke-linecap="round"><path d="M-3,-80 h5 M-4,-68 q3,-3 6,0 M-3,-56 l2,4 l2,-4 M-4,-42 h6 M-3,-30 q3,-2 5,2 M-4,-16 h5"/></g><rect x="-14" y="-5" width="28" height="7" rx="1.6" fill="#c9b27a"/>`;
const column=()=>`<ellipse cx="0" cy="3" rx="30" ry="5" fill="#000" opacity=".13" stroke="none"/><rect x="-13" y="-62" width="26" height="62" fill="#dcc89c"/><path d="M-6,-62 V0 M0,-62 V0 M6,-62 V0" fill="none" stroke="#bfa876" stroke-width="1.2"/><path d="M-13,-62 L-8,-70 L-3,-64 L2,-74 L7,-66 L13,-72 V-62Z" fill="#dcc89c"/>`+
 `<rect x="-17" y="-6" width="34" height="8" rx="1.6" fill="#c9b27a"/><g transform="translate(34,0)"><path d="M-14,0 Q-16,-14 0,-16 Q16,-14 14,0Z" fill="#d6c190"/><path d="M-12,-8 H12 M-13,-3 H13" fill="none" stroke="#bfa876" stroke-width="1.2"/></g>`;
/* 胡狼守護像（2026-11-18f 使用者選「C 胡狼頭守門人＋D 的高石座」：原創畫法；黑色胡狼頭、金藍項圈、金裙、拿金色長杖，站在刻象形紋的高石座上；面朝左） */
const K='#2c2a34',K2='#1c1a22',KH='#4a4858',G='#e4b53e',G2='#c99a2a',ST='#d9c498',ST2='#c2ab7a';
const jkHead=(x,y,OL,sc=1)=>`<g transform="translate(${x},${y}) scale(${sc})">`+
 `<path d="M6,-2 L2,-30 L10,-16Z" fill="${K}"/><path d="M5,-6 L3,-24 L8,-14Z" fill="${G}" stroke="none"/>`+
 `<path d="M-2,-2 L-6,-28 L2,-16Z" fill="${K}"/><path d="M-3,-6 L-5,-22 L0,-14Z" fill="${G}" stroke="none"/>`+
 `<path d="M10,6 Q12,-10 0,-12 Q-8,-12 -12,-6 L-26,-2 Q-29,0 -26,3 L-12,6 Q-4,10 10,6Z" fill="${K}"/>`+
 `<path d="M-26,-2 Q-29,0 -26,3" fill="${K2}" stroke-width="1.4"/>`+
 `<path d="M-8,-6 q4,-2 7,0" fill="none" stroke="${G}" stroke-width="1.6"/><path d="M-1,-6 l5,2" fill="none" stroke="${G}" stroke-width="1.4"/><circle cx="-4" cy="-5.6" r="1.2" fill="#fffaf0" stroke="none"/>`+
 `<path d="M2,-10 Q6,-6 4,2" fill="none" stroke="${KH}" stroke-width="1.6" opacity=".9"/></g>`;
const jkCollar=(x,y,w,h=6)=>`<path d="M${x-w/2},${y} Q${x},${y+h*1.6} ${x+w/2},${y} L${x+w/2-2},${y-h*.3} Q${x},${y+h} ${x-w/2+2},${y-h*.3}Z" fill="${G}" stroke-width="1.4"/><path d="M${x-w/2+3},${y+1} Q${x},${y+h*1.1} ${x+w/2-3},${y+1}" fill="none" stroke="#3f7a9a" stroke-width="1.6"/>`;

const jkGuard=OL=>{let s='';
 s+=`<path d="M10,-6 V-78" fill="none" stroke="${OL}" stroke-width="4.4" stroke-linecap="round"/><path d="M10,-6 V-78" fill="none" stroke="${G}" stroke-width="2.2" stroke-linecap="round"/><path d="M10,-78 q-6,-2 -6,-7" fill="none" stroke="${G}" stroke-width="2.4"/><path d="M8,-6 l2,-4 l2,4" fill="none" stroke="${G}" stroke-width="1.8"/>`;
 s+=`<path d="M-8,-6 L-6,-28 H6 L7,-6Z" fill="${K}"/><path d="M-3,-6 V-26 M3,-6 V-26" fill="none" stroke="${KH}" stroke-width="1.2"/>`;
 s+=`<path d="M-10,-28 L-8,-38 H8 L10,-28Z" fill="${G}" stroke-width="1.6"/><path d="M-6,-36 V-29 M-2,-36 V-29 M2,-36 V-29 M6,-36 V-29" fill="none" stroke="${G2}" stroke-width="1.2"/>`;
 s+=`<path d="M-9,-38 Q-11,-54 0,-58 Q11,-54 9,-38Z" fill="${K}"/><path d="M8,-50 Q14,-48 12,-40" fill="none" stroke="${OL}" stroke-width="4.4" stroke-linecap="round"/><path d="M8,-50 Q14,-48 12,-40" fill="none" stroke="${K}" stroke-width="2.4" stroke-linecap="round"/>`;
 s+=jkCollar(0,-56,16,5);
 s+=jkHead(0,-60,OL,.72);
 return s};

const statue=()=>`<ellipse cx="0" cy="3" rx="22" ry="5" fill="#000" opacity=".14" stroke="none"/>`+
 `<rect x="-16" y="-24" width="32" height="24" rx="1.6" fill="${ST}"/><rect x="-18" y="-28" width="36" height="5" rx="1.4" fill="${ST2}"/><rect x="-18" y="-3" width="36" height="4" rx="1" fill="${ST2}"/>`+
 `<g fill="none" stroke="#8f7a4a" stroke-width="1.3" stroke-linecap="round"><path d="M-10,-18 v8 M-10,-14 h4 M-1,-18 q3,-3 6,0 q-3,3 -6,0 M2,-15 v6 M9,-18 l2,4 l2,-4 M9,-10 h4"/></g>`+
 `<g transform="translate(0,-22)">${jkGuard(OL)}</g>`;
const pit=()=>`<ellipse cx="0" cy="4" rx="92" ry="9" fill="#000" opacity=".12" stroke="none"/><path d="M-84,0 L-72,-46 L72,-46 L84,0Z" fill="#a47f4e"/><path d="M-70,-42 L70,-42 L60,-8 L-60,-8Z" fill="#5a4026"/><path d="M-60,-8 L60,-8 L56,-14 L-56,-14Z" fill="#74543a" stroke="none"/>`+
 `<path d="M-84,0 H84" fill="none" stroke="#7a5a30" stroke-width="3"/><path d="M-72,-46 H72" fill="none" stroke="#c9a468" stroke-width="3"/>`+
 `<g stroke="#7a5235" stroke-width="3.4" fill="none" stroke-linecap="round"><path d="M-34,-4 L-24,-40 M-18,-4 L-8,-40"/></g><g stroke="#7a5235" stroke-width="2.2" fill="none"><path d="M-30,-14 L-14,-14 M-27,-24 L-11,-24 M-24,-33 L-9,-33"/></g>`+
 `<path d="M44,-8 L52,-26 L66,-14 L60,-6Z" fill="#8a6a40" stroke-width="1.4"/><circle cx="52" cy="-16" r="3.6" fill="#c9764a" stroke-width="1.2"/>`+
 `<path d="M-100,2 Q-96,-14 -80,-8 Q-72,-20 -62,-4 Z" fill="#c9a468"/><path d="M82,2 Q86,-16 102,-10 Q110,-6 104,2Z" fill="#c9a468"/>`;
const sieve=()=>`<ellipse cx="0" cy="3" rx="42" ry="6" fill="#000" opacity=".13" stroke="none"/><path d="M-30,0 L-18,-52 M30,0 L18,-52 M-24,-26 H24" fill="none" stroke="#7a5235" stroke-width="4"/>`+
 `<path d="M-20,-50 L20,-50 L24,-26 L-24,-26Z" fill="#cdbb86" opacity=".9"/><path d="M-16,-50 V-26 M-8,-50 V-26 M0,-50 V-26 M8,-50 V-26 M16,-50 V-26 M-22,-42 H22 M-23,-34 H23" fill="none" stroke="#8a7a50" stroke-width="1"/>`+
 `<path d="M-26,0 Q-18,-14 0,-14 Q18,-14 26,0Z" fill="#e4c58a"/><circle cx="-6" cy="-6" r="2.6" fill="#c9764a" stroke-width="1.1"/><circle cx="8" cy="-4" r="2.2" fill="#d6b26a" stroke-width="1.1"/>`;
const ftable=()=>`<ellipse cx="0" cy="3" rx="44" ry="6" fill="#000" opacity=".13" stroke="none"/><path d="M-34,0 L-30,-24 M34,0 L30,-24 M-26,-1 L26,-1" fill="none" stroke="#7a5235" stroke-width="3.4"/>`+
 `<rect x="-42" y="-30" width="84" height="8" rx="2" fill="#c99a5b"/><path d="M-42,-26 H42" stroke="#a8703f" stroke-width="1.2" fill="none"/>`+
 `<g transform="translate(-26,-30)"><path d="M-6,0 q-2,-10 3,-12 h6 q5,2 3,12Z" fill="#c4642f" stroke-width="1.4"/></g><g transform="translate(-6,-31) rotate(-20)"><rect x="-10" y="-2" width="16" height="4" rx="2" fill="#a8703f" stroke-width="1.2"/><path d="M6,-3 Q14,-3 15,0 Q14,3 6,3Z" fill="#e8d4a0" stroke-width="1.2"/></g>`+
 `<path d="M10,-30 l10,-4 l8,4Z" fill="#c9764a" stroke-width="1.3"/><circle cx="32" cy="-35" r="5" fill="#bfe4ee" opacity=".9" stroke-width="1.4"/><path d="M36,-31 L40,-27" stroke="#7a4a22" stroke-width="2.4" fill="none"/>`;
const cart=()=>`<ellipse cx="0" cy="3" rx="34" ry="5" fill="#000" opacity=".13" stroke="none"/><path d="M-22,-16 L22,-20 L18,-4 L-18,-2Z" fill="#8a6a40"/><path d="M-20,-16 Q0,-28 20,-20 Q8,-17 -20,-16Z" fill="#a47f4e" stroke="none"/><path d="M22,-20 L40,-30 M-22,-16 L-38,-26" fill="none" stroke="#7a5235" stroke-width="3.2"/>`+
 `<circle cx="8" cy="-4" r="9" fill="#d9ccae"/><circle cx="8" cy="-4" r="9" fill="none"/><circle cx="8" cy="-4" r="2.4" fill="#7a5235" stroke-width="1.2"/><path d="M-18,-2 L-22,2 M18,-4 L22,2" fill="none" stroke="#7a5235" stroke-width="3"/>`;
const campfire=()=>`<ellipse cx="0" cy="3" rx="26" ry="5" fill="#000" opacity=".13" stroke="none"/><path d="M-22,0 L22,-6 M-22,-6 L22,0" fill="none" stroke="${OL}" stroke-width="8" stroke-linecap="round"/><path d="M-22,0 L22,-6 M-22,-6 L22,0" fill="none" stroke="#7a5235" stroke-width="5" stroke-linecap="round"/>`+
 `<path d="M-10,-6 Q-14,-22 -2,-32 Q0,-22 8,-26 Q16,-16 10,-6Z" fill="#e8742a"/><path d="M-5,-6 Q-8,-16 0,-22 Q4,-14 6,-6Z" fill="#f5c842" stroke-width="1.3"/>`+
 `<path d="M-28,2 L-6,-46 M28,2 L6,-46 M0,2 L0,-46" fill="none" stroke="#7a5235" stroke-width="2.6"/><path d="M0,-44 V-34" stroke="${OL}" stroke-width="1.4" fill="none"/><path d="M-9,-34 Q-10,-22 0,-20 Q10,-22 9,-34Z" fill="#4a4f5c" stroke-width="1.6"/>`;
const rubble=()=>`<ellipse cx="0" cy="2" rx="30" ry="5" fill="#000" opacity=".12" stroke="none"/><path d="M-26,0 L-22,-14 L-8,-16 L-4,0Z" fill="#c9b78e"/><path d="M-8,-16 L-4,0 H-12Z" fill="#b3a176" stroke="none" opacity=".6"/><path d="M-2,0 L2,-12 L16,-13 L18,0Z" fill="#d6c59e"/><path d="M-12,-14 L-8,-26 L6,-27 L10,-13Z" fill="#cdbb92"/><path d="M14,0 L18,-8 L28,-8 L28,0Z" fill="#bfae86"/>`;
const stakeLine=()=>`<path d="M-30,0 V-12 M30,0 V-12" fill="none" stroke="#7a5235" stroke-width="3"/><path d="M-30,-10 H30" fill="none" stroke="#f4ecd8" stroke-width="1.6"/><path d="M-30,-10 H30" fill="none" stroke="#c4473a" stroke-width="1.6" stroke-dasharray="5 5"/>`;
/* 小貓（目標）：金色項圈、躲在陶罐堆後面，只露出頭、耳朵和項圈 */
const cat13=()=>`<path d="M-9,-14 L-12,-30 L-3,-22Z M9,-14 L12,-30 L3,-22Z" fill="#e8a45a" stroke-width="1.6"/><path d="M-9,-17 L-10.4,-25 L-5,-21Z M9,-17 L10.4,-25 L5,-21Z" fill="#f0a8a0" stroke="none"/>`+
 `<ellipse cx="0" cy="-10" rx="12.6" ry="11" fill="#e8a45a"/><path d="M-6,-20 V-15 M0,-21 V-15 M6,-20 V-15" fill="none" stroke="#b8702f" stroke-width="1.8"/><ellipse cx="0" cy="-5" rx="6.4" ry="4.6" fill="#fbf1d8" stroke="none"/>`+
 `<circle cx="-4.6" cy="-11" r="2.1" fill="${OL}" stroke="none"/><circle cx="4.6" cy="-11" r="2.1" fill="${OL}" stroke="none"/><circle cx="-4" cy="-11.8" r=".7" fill="#fff" stroke="none"/><circle cx="5.2" cy="-11.8" r=".7" fill="#fff" stroke="none"/><path d="M-1.6,-6.6 L0,-5 L1.6,-6.6Z" fill="#c47a7a" stroke-width="1"/><path d="M-6,-5 H-14 M6,-5 H14 M-6,-3.4 L-13,-1 M6,-3.4 L13,-1" fill="none" stroke-width="1"/>`+
 `<path d="M-10,2 Q0,7 10,2 L9,6 Q0,11 -9,6Z" fill="#e4b53e" stroke-width="1.6"/><circle cx="0" cy="8" r="2.4" fill="#fbe08a" stroke-width="1.2"/>`;
const jarPile=()=>`<ellipse cx="0" cy="2" rx="38" ry="6" fill="#000" opacity=".14" stroke="none"/>`+
 `<g transform="translate(23,0)">${jar('#a8501f',1.1)}</g><g transform="translate(-25,1)">${jar('#d27a3a',1)}</g>`+T(0,-29,1,cat13())+`<g transform="translate(1,3)">${jar('#c4642f',.86)}</g>`;
/* 金字塔入口門洞前的守護像（用在 structures） */

/* ---- 佈景圖鑑（KIND）：場地外、POOL、干擾物都要登記 ---- */
const dk=(id,w,h,cy=-12)=>({w,h,fn:()=>T(0,cy,1,DECOY[id])});
Object.assign(KIND,{
 palm13:{w:56,h:96,fn:()=>palm(pk([1,-1]),1)},cactus13:{w:44,h:60,fn:cactusBig},rock13:{w:34,h:18,fn:duneRock},bush13:{w:30,h:20,fn:dryBush},
 jar13:{w:30,h:34,fn:()=>jar(pk(['#c4642f','#a8501f','#d27a3a','#8a4a22']),pk([.8,1,1.15]))},tent13:{w:150,h:70,fn:()=>tent(pk(['#b8a060','#c4a050','#a89868']),pk(['#7a5a3a','#c4573a']))},
 camelS13:{w:70,h:80,fn:()=>CAMEL.stand(pk(['#d6aa66','#c99a58','#dcb878']),'#b98a4a',r()<.5)},camelR13:{w:76,h:40,fn:()=>CAMEL.rest()},
 sphinx13:{w:250,h:120,fn:sphinx},obelisk13:{w:30,h:114,fn:obelisk},column13:{w:70,h:76,fn:column},statue13:{w:36,h:100,fn:statue},
 pit13:{w:170,h:50,fn:pit},sieve13:{w:60,h:56,fn:sieve},table13:{w:90,h:44,fn:ftable},cart13:{w:60,h:34,fn:cart},campfire13:{w:60,h:50,fn:campfire},rubble13:{w:60,h:28,fn:rubble},stakes13:{w:64,h:14,fn:stakeLine},
 paintbrush13:dk('paintbrush13',38,24,0),handmirror13:dk('handmirror13',34,34,0),paperscroll13:dk('paperscroll13',44,22,0),goldplate13:dk('goldplate13',34,34,0),stonebrick13:dk('stonebrick13',34,22,0),
 catbank13:dk('catbank13',28,44,-4),keyring13:dk('keyring13',28,32,-2),beads13:dk('beads13',34,32,-4),ragdoll13:dk('ragdoll13',30,40,-2),cookie13:dk('cookie13',32,32,0)});

/* ================= 4. 12 種 × 4 個 ================= */
/* 老朋友：定義寫在自己檔案（find 關卡檔案載入時，第 4 關可能還沒載入） */
const OLD={compass:{id:'compass',name:'黃銅羅盤',short:'羅盤',r:14,rot:30},amphora:{id:'amphora',name:'古陶罐',short:'陶罐',r:15,rot:10}};
const old=(id,regions)=>({...(typeOf(id)||OLD[id]),regions});
const TYPES=[
 old('compass',['camp13','dig13','avenue13','rest13']),old('amphora',['dig13','camp13','rest13','avenue13']),
 {id:'brush13',name:'考古小刷子',short:'小刷子',r:16,rot:12,regions:['dig13','camp13','dig13','avenue13']},
 {id:'lens13',name:'放大鏡',short:'放大鏡',r:15,rot:10,regions:['camp13','dig13','avenue13','rest13']},
 {id:'papyrus13',name:'莎草紙卷',short:'紙卷',r:16,rot:8,regions:['camp13','avenue13','dig13','camp13']},
 {id:'mask13',name:'法老黃金面具',short:'金面具',r:16,rot:10,regions:['avenue13','dig13','camp13','rest13']},
 {id:'eye13',name:'荷魯斯之眼石板',short:'石板',r:15,rot:6,regions:['dig13','avenue13','camp13','dig13']},
 {id:'catstat13',name:'貓神小雕像',short:'貓神像',r:15,rot:6,regions:['avenue13','camp13','rest13','dig13']},
 {id:'ankh13',name:'安卡符號',short:'安卡',r:15,rot:8,regions:['avenue13','camp13','dig13','rest13']},
 {id:'collar13',name:'青金石項圈',short:'項圈',r:17,rot:8,regions:['camp13','dig13','rest13','avenue13']},
 {id:'mummy13',name:'小木乃伊玩偶',short:'木乃伊',r:16,rot:12,regions:['rest13','camp13','avenue13','dig13']},
 {id:'shard13',name:'象形文字陶片',short:'陶片',r:15,rot:20,regions:['dig13','dig13','camp13','avenue13']}];
LEVELS[N].types=TYPES;
/* BORROW：不借（沙漠物件不混進前面的關卡） */

/* ================= 5. 地形、區域 ================= */
Object.assign(REG,{pyr13:{x:660,y:440,w:1200,h:300},avenue13:{x:760,y:760,w:980,h:310},dig13:{x:700,y:1090,w:1100,h:390},camp13:{x:680,y:1490,w:1140,h:310},
 rest13:{x:640,y:1810,w:1230,h:320},all13:{x:620,y:430,w:1260,h:1700}});
H.SCREG[N]=['avenue13','dig13','camp13','rest13'];  /* 故事和路人只放參道、挖掘場、營地、商隊休息處 */
const GATE={x:1250,y:662};   /* 金字塔入口門洞（腳底中心） */

function ground(){
 const Sc=H.SCENES[N],X0=Sc.x0-420,WW=Sc.x1-Sc.x0+840;let g='';
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="${Sc.y1+840}" fill="#ecd29c" stroke="none"/>`;
 for(let i=0;i<60;i++){const x=sr(X0,X0+WW),y=sr(300,Sc.y1+300);g+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(60,170))}" ry="${f(sr(16,40))}" fill="${pk(['#e4c58a','#f2dbaa','#e8cc94','#dfbf84'])}" stroke="none" opacity=".6"/>`}
 /* 北邊天空、太陽、遠方沙丘 */
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="760" fill="#f8e6bd" stroke="none"/><circle cx="780" cy="120" r="64" fill="#fbeab0" stroke="none" opacity=".55"/><circle cx="780" cy="120" r="40" fill="#fdf0c0" stroke="none"/>`;
 g+=`<path d="M${X0},300 Q640,252 880,292 Q1120,250 1360,294 Q1600,256 1800,296 Q2000,262 ${X0+WW},292 V420 H${X0}Z" fill="#e8cb92" stroke="none"/>`;
 g+=`<path d="M${X0},350 Q760,312 1020,350 Q1280,316 1560,352 Q1800,324 ${X0+WW},350 V440 H${X0}Z" fill="#ecd29c" stroke="none"/>`;
 /* 金字塔群：每座有亮面、背光面、石塊層線；中間最大的底下有入口門洞 */
 const pyr=(cx,by,bw,h,c1,c2)=>{let s=`<path d="M${cx-bw/2},${by} L${cx},${by-h} L${cx+bw/2},${by}Z" fill="${c1}"/><path d="M${cx},${by-h} L${cx+bw/2},${by} H${cx+bw*.12}Z" fill="${c2}" stroke="none"/>`;
  const rows=Math.round(h/22);for(let i=1;i<rows;i++){const y=by-h*i/rows,hw=bw/2*(1-i/rows);s+=`<path d="M${f(cx-hw)},${f(y)} H${f(cx+hw)}" fill="none" stroke="#b99a58" stroke-width="1.2" opacity=".55"/>`}
  return s};
 g+=pyr(790,700,320,190,'#e8cf98','#d6b77a');g+=pyr(1720,700,300,180,'#e8cf98','#d6b77a');
 g+=pyr(1250,700,580,400,'#ecd49e','#d3b274');
 g+=`<path d="M1250,300 L1275,336 H1225Z" fill="#e4b53e" stroke-width="1.6"/>`;
 /* 入口門洞：石框、黑洞、石階 */
 g+=`<path d="M${GATE.x-62},${GATE.y+8} H${GATE.x+62} V${GATE.y+16} H${GATE.x-62}Z M${GATE.x-52},${GATE.y+16} H${GATE.x+52} V${GATE.y+24} H${GATE.x-52}Z" fill="#d6c59e"/>`;
 g+=`<path d="M${GATE.x-34},${GATE.y+8} V${GATE.y-48} Q${GATE.x},${GATE.y-66} ${GATE.x+34},${GATE.y-48} V${GATE.y+8}Z" fill="#2a1e16"/>`;
 g+=`<path d="M${GATE.x-42},${GATE.y+8} V${GATE.y-52} L${GATE.x},${GATE.y-76} L${GATE.x+42},${GATE.y-52} V${GATE.y+8} H${GATE.x+34} V${GATE.y-48} Q${GATE.x},${GATE.y-66} ${GATE.x-34},${GATE.y-48} V${GATE.y+8}Z" fill="#d9c498"/>`;
 g+=`<path d="M${GATE.x-24},${GATE.y+4} V${GATE.y-40} Q${GATE.x},${GATE.y-52} ${GATE.x+24},${GATE.y-40} V${GATE.y+4}Z" fill="#4a3424" stroke="none" opacity=".7"/>`;
 g+=`<circle cx="${GATE.x}" cy="${GATE.y-62}" r="4.6" fill="#e4b53e" stroke-width="1.4"/>`;
 /* 遠處往金字塔走的小商隊剪影（和滑沙場北邊的伏筆呼應） */
 g+=`<path d="M930,742 Q1090,716 1250,732 Q1370,720 1560,738" fill="none" stroke="#d9b678" stroke-width="26" stroke-linecap="round" opacity=".6"/>`;
 /* 參道：中間一條石板路從門洞往南，兩邊鋪沙 */
 g+=`<path d="M1160,${GATE.y+26} H1340 L1370,1070 H1130Z" fill="#dcc89c"/>`;
 for(let i=0;i<9;i++){const y=GATE.y+26+i*47,w=180+i*3.4;g+=`<path d="M${f(1250-w/2)},${y} H${f(1250+w/2)}" fill="none" stroke="#b9a474" stroke-width="1.6"/>`;for(let j=0;j<4;j++)g+=`<path d="M${f(1250-w/2+(j+1)*w/5+((i%2)*10-5))},${y} v47" fill="none" stroke="#b9a474" stroke-width="1.2"/>`}
 g+=`<path d="M1160,${GATE.y+26} L1130,1070 M1340,${GATE.y+26} L1370,1070" fill="none" stroke-width="2.2"/>`;
 /* 小路：參道下面分到挖掘場、營地、商隊休息處 */
 ['M1250,1070 Q1250,1200 1250,1360 Q1250,1500 1250,1650','M1250,1650 Q1250,1760 1250,1870 Q1100,1930 960,1990','M1250,1870 Q1400,1930 1560,1990','M1250,1250 Q1100,1230 960,1250','M1250,1260 Q1400,1240 1580,1230'].forEach(d=>{g+=`<path d="${d}" fill="none" stroke="#d9b678" stroke-width="70" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#c9a460" stroke-width="2.2" stroke-dasharray="3 17" stroke-linecap="round" opacity=".9"/>`});
 /* 挖掘場：拉繩子的格子（木樁＋繩子） */
 [[780,1160,360,200],[1380,1120,360,240]].forEach(([x,y,w,h])=>{g+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#f4ecd8" stroke-width="1.8"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#c4473a" stroke-width="1.8" stroke-dasharray="6 6"/>`;
  [[x,y],[x+w,y],[x,y+h],[x+w,y+h],[x+w/2,y],[x+w/2,y+h]].forEach(([a,b])=>g+=`<path d="M${a},${b} v-10" stroke="#7a5235" stroke-width="3.4"/>`)});
 for(let i=0;i<46;i++){const x=sr(X0,X0+WW),y=sr(1090,Sc.y1+300);g+=`<path d="M${f(x)},${f(y)} q14,-5 28,0 q14,5 28,0" fill="none" stroke="#d9bb7e" stroke-width="1.6" opacity=".9"/>`}
 return `<g stroke="${OL}" stroke-width="2" stroke-linejoin="round">${g}</g>`}

/* ================= 6. 建築與佈景 ================= */
Object.assign(POOL,{
 avenue13:[['bush13',1.2],['rock13',1.2],['rubble13',.8],['column13',.3],['pebbles',1],['statue13',.1],['stonebrick13',.3],['cookie13',.25],['paperscroll13',.25],['goldplate13',.2]],
 dig13:[['rubble13',1],['rock13',1],['bush13',.7],['stakes13',.5],['sieve13',.2],['pebbles',.8],['jar13',.5],['stonebrick13',.3],['paintbrush13',.3],['handmirror13',.2],['cookie13',.2],['keyring13',.2]],
 camp13:[['jar13',.8],['crate',.9],['barrel',.8],['rock13',.6],['bush13',.5],['pebbles',.7],['table13',.12],['cart13',.1],['paintbrush13',.3],['handmirror13',.25],['paperscroll13',.3],['keyring13',.3],['beads13',.3],['ragdoll13',.2],['catbank13',.2],['cookie13',.25]],
 rest13:[['camelS13',.7],['camelR13',.8],['jar13',1],['bush13',.7],['rock13',.7],['crate',.5],['barrel',.5],['pebbles',.7],['beads13',.3],['ragdoll13',.3],['catbank13',.2],['goldplate13',.2],['keyring13',.2]],
 decor13:[['bush13',1.6],['rock13',1],['pebbles',1],['cactus13',.4],['jar13',.3]]});
function structures(){
 skyBirds(N);
 /* 門洞兩側的守護像、參道兩邊的方尖碑 */
 add(GATE.x-96,GATE.y+30,36,100,'statue13',statue(),{sh:.9,s:1.4,fl:true});add(GATE.x+96,GATE.y+30,36,100,'statue13',statue(),{sh:.9,s:1.4});/* 2026-11-18f 放大 1.4 倍、兩隻面對門口 */
 [[1096,820],[1404,820],[1096,970],[1404,970]].forEach(([x,y])=>add(x,y,30,114,'obelisk13',obelisk(),{sh:.8}));
 /* 獅身像、斷柱和碎石 */
 add(1500,1040,250,120,'sphinx13',sphinx(),{sh:.9});
 [[880,860],[780,960],[940,1010]].forEach(([x,y])=>add(x,y,70,76,'column13',column(),{sh:.8}));
 [[1580,820],[760,790],[1690,930]].forEach(([x,y])=>add(x,y,60,28,'rubble13',rubble(),{sh:.6}));
 /* 北邊兩側：棕櫚、仙人掌 */
 [[700,560,1],[800,640,-1],[1800,570,-1],[1740,650,1]].forEach(([x,y,l])=>add(x,y,50,92,'palm13',palm(l,1),{sh:.8}));
 [[1010,630],[1500,640]].forEach(([x,y])=>add(x,y,44,60,'cactus13',cactusBig(),{sh:.6}));
 /* 挖掘場：兩個坑、篩沙架、木樁繩子、手推車、碎石堆 */
 add(960,1260,170,50,'pit13',pit(),{sh:.8});add(1560,1250,170,50,'pit13',pit(),{sh:.8});add(1380,1390,170,50,'pit13',pit(),{sh:.8});
 add(840,1380,60,56,'sieve13',sieve(),{sh:.7});add(1130,1160,60,56,'sieve13',sieve(),{sh:.7});add(1720,1130,60,56,'sieve13',sieve(),{sh:.7});
 add(1100,1420,60,34,'cart13',cart(),{sh:.7});
 [[760,1130],[1010,1380],[1700,1400],[1170,1300]].forEach(([x,y])=>add(x,y,60,28,'rubble13',rubble(),{sh:.6}));
 /* 營地：考古隊帳篷、野外桌子、營火、箱子 */
 add(780,1590,150,70,'tent13',tent('#b8a060','#7a5a3a'),{sh:.9});add(1000,1700,150,70,'tent13',tent('#c4a050','#c4573a'),{sh:.9});add(1700,1610,150,70,'tent13',tent('#a89868','#7a5a3a'),{sh:.9});
 add(1100,1560,90,44,'table13',ftable(),{sh:.8});add(1440,1700,90,44,'table13',ftable(),{sh:.8});
 add(1250,1600,60,50,'campfire13',campfire(),{sh:.8});
 add(1570,1560,26,24,'crate',H.KIND.crate?H.KIND.crate.fn():'',{sh:.5});add(1610,1566,26,28,'barrel',H.KIND.barrel?H.KIND.barrel.fn():'',{sh:.5});
 /* 商隊休息處：商隊帳篷、駱駝、水罐 */
 add(760,1920,150,70,'tent13',tent('#c4573a','#7a5a3a'),{sh:.9});add(1750,2000,150,70,'tent13',tent('#2f6f73','#7a5a3a'),{sh:.9});
 add(900,1850,76,40,'camelR13',CAMEL.rest(),{});add(1000,2040,76,40,'camelR13',CAMEL.rest('#d6b072','#b88a4c'),{fl:true});
 add(1380,1900,70,80,'camelS13',CAMEL.stand('#c99a58','#a8783a',true),{});add(1620,1860,70,80,'camelS13',CAMEL.stand('#dcb878','#b98a4a',false),{fl:true});
 [[1250,1990],[1500,2060],[820,1800]].forEach(([x,y])=>add(x,y,30,34,'jar13',jar('#c4642f',1),{sh:.4}));
 [[700,2060],[1860,2070]].forEach(([x,y])=>add(x,y,44,60,'cactus13',cactusBig(),{sh:.6}));
 [[740,1480],[1860,1500]].forEach(([x,y])=>add(x,y,50,92,'palm13',palm(x<1000?1:-1,1),{sh:.8}));
}
function scatterAll(){
 scatter('pyr13',POOL.avenue13,900,14);
 scatter('avenue13',POOL.avenue13,3000,44);scatter('dig13',POOL.dig13,3600,56);scatter('camp13',POOL.camp13,3400,50);scatter('rest13',POOL.rest13,3400,50);
 scatter('all13',POOL.decor13,6000,90);
}
SCENE_IMPL[N]={ground,structures,scatter:scatterAll};
Object.assign(VPLAN,{avenue13:{chat:4,walker:4,reading:2,carryBox:2,stretch:1},dig13:{chat:6,walker:4,carryBox:4,reading:2,stretch:2},
 camp13:{chat:6,walker:6,reading:2,benchPair:2,carryBox:2,sleeping:1,handInHand:1},rest13:{chat:4,walker:4,sleeping:2,stretch:2,carryBox:2,benchPair:1}});
HOSTK.add('palm13');HOSTK.add('tent13');HOSTK.add('table13');HOSTK.add('jar13');HOSTK.add('sieve13');HOSTK.add('column13');
HOSTN.palm13='棕櫚樹';HOSTN.tent13='帳篷';HOSTN.table13='野外桌子';HOSTN.jar13='水罐';HOSTN.sieve13='篩沙架';HOSTN.column13='斷柱';
/* 物件的合理位置：SPOTS 放在那個東西上或旁邊；BLEND 是顏色相近的東西 */
H.SPOTS[N]={
 brush13:[['table13',.5,.15],['sieve13',.1,.55],['pit13',.2,.58]],
 lens13:[['table13',.5,-.3],['tent13',.06,.5],['cart13',.35,.2]],
 papyrus13:[['table13',.5,.35],['tent13',.06,-.55],['crate',.4,.1]],
 mask13:[['statue13',.05,.65],['rubble13',.3,.1],['table13',.5,.05]],
 eye13:[['rubble13',.3,.3],['pit13',.2,-.58],['column13',.05,.6]],
 catstat13:[['statue13',.05,-.65],['table13',.5,-.05],['obelisk13',.04,.55]],
 ankh13:[['obelisk13',.04,-.55],['rubble13',.3,-.2],['table13',.5,.3]],
 collar13:[['tent13',.06,.5],['table13',.5,-.4],['camelS13',.55,.45]],
 mummy13:[['tent13',.06,-.55],['crate',.4,.1],['camelR13',.2,.6]],
 shard13:[['pit13',.2,.55],['sieve13',.1,-.55],['rubble13',.3,-.25]],
 compass:[['table13',.5,.4],['camelS13',.55,.45],['tent13',.06,.58]],
 amphora:[['jar13',.1,.7],['tent13',.06,-.58],['column13',.05,-.6]]};
H.BLEND[N]={brush13:['paintbrush13','rubble13'],lens13:['handmirror13','jar13'],papyrus13:['paperscroll13','rubble13'],mask13:['goldplate13','jar13'],
 eye13:['stonebrick13','rubble13'],catstat13:['catbank13','statue13'],ankh13:['keyring13','rock13'],collar13:['beads13','jar13'],
 mummy13:['ragdoll13','rubble13'],shard13:['cookie13','rock13'],compass:['goldplate13','rock13'],amphora:['jar13','jar13']};

/* ================= 7. 連環小故事：躲在陶罐堆後面的小埃及貓 ================= */
const dustpan=`<g transform="translate(22,-24) rotate(6)"><path d="M-14,0 Q-16,-16 -6,-20 L8,-20 Q18,-16 16,0 Q0,4 -14,0Z" fill="#c9a05a"/><path d="M-12,-6 H14 M-10,-12 H12" fill="none" stroke="#8a6a30" stroke-width="1.2"/><path d="M-6,-20 Q0,-30 6,-20" fill="none" stroke="#7a5a30" stroke-width="2.4"/></g>`;
STORIES[N]={title:'躲在陶罐堆後面的小埃及貓',who:'考古隊員',
 giver:()=>act(0,0,1,{view:'fq',pose:'reach',hat:6,mood:2,skin:'#d9a578',shirt:'#d8c28a',top:'tee',bottom:'pants',pants:'#7a5a3a'}),
 target:()=>jarPile(),tw:64,th:56,
 helper:()=>act(0,0,1,{view:'fq',pose:'hold',hat:HAT_T,mood:1,skin:'#8f5a36',shirt:'#c4573a',top:'long',bottom:'pants',pants:'#d9c8a0',extra:dustpan}),hw:56,hh:64,
 ask:'考古隊員：我的小貓不見了！牠戴著金色的小項圈，一路跟著我們來挖寶。',
 need:'小貓好像躲進陶罐堆後面了，我一伸手牠就縮進去⋯營地邊有位挖土工人，他的畚箕可以把罐子一個個搬開！',
 got:'挖土工人：交給我！畚箕一端，罐子就都挪開了。',
 ok:'小貓喵的一聲跳出來，金項圈亮晶晶的。快去告訴考古隊員！'};

/* ================= 8. 冒險地圖（沙漠往西）與過場 ================= */
HERE[N]=[-95,288];
H.mapHook(2,({P,ink,FN,open})=>{if(!open(N))return '';
 let g=H.mapRoute('M-112,330 Q-110,316 -104,310','road',ink);
 let m=`<g class="mnode" data-n="${N}"><g transform="translate(-95,306) scale(.8) translate(252,-344)"><g transform="translate(-20,-12)"><circle cx="-232" cy="352" r="38" fill="transparent"/>`;
 m+=`<ellipse cx="-232" cy="356" rx="36" ry="18" fill="#ecd29c" stroke="${ink}" stroke-width="1.5"/>`;
 m+=P('M-256,358 L-236,326 L-214,358Z','#e6cb92',1.6)+`<path d="M-236,326 L-214,358 H-226Z" fill="#d3b274"/>`;
 m+=P('M-224,358 L-210,336 L-196,358Z','#e8cf98',1.5);
 m+=`<path d="M-246,350 H-224 M-242,343 H-230" fill="none" stroke="#b99a58" stroke-width="1" opacity=".8"/><rect x="-241" y="350" width="7" height="8" rx="1" fill="#3a2a22" stroke="${ink}" stroke-width="1"/>`;
 m+=`</g></g><g transform="translate(-95,266)"><rect x="-26" y="-10" width="52" height="18" rx="9" fill="#fffaf0" stroke="${ink}" stroke-width="1.8"/><text y="4" text-anchor="middle" font-size="11" fill="${ink}" font-family="${FN}">金字塔</text></g></g>`;
 return g+m});
/* 過場：背後看商隊（駱駝＋小孩）走向越來越大的金字塔，沙紋往下捲 */
RIDES.pyramid13={text:'跟著商隊，走向金字塔⋯',every:380,tick:k=>tone(k%2?262:233,.1,'triangle',.05),
 svg:()=>{const ripples=y0=>[0,1,2,3].map(i=>`<path d="M${20+i*90},${y0+i*30} q22,-8 44,0 q22,8 44,0" fill="none" stroke="#d9bb7e" stroke-width="2.2"/>`).join('');
  /* 2026-11-18 背面的駱駝也分 B 雙峰（深棕、兩個駝峰、毛）和 G 盛裝（細腳、彩色鞍毯＋流蘇） */
  const camelBack=(x,y,s,c,rider,k='B')=>`<g transform="translate(${x},${y}) scale(${s})"><g class="cb13"><ellipse cx="0" cy="6" rx="36" ry="7" fill="#000" opacity=".16" stroke="none"/>`+
   (k==='B'?`<path d="M-14,4 L-13,-22 M14,4 L13,-22" fill="none" stroke="#7a5230" stroke-width="8"/><path d="M-26,-26 Q-30,-50 -16,-54 Q-14,-76 -4,-58 Q0,-54 4,-58 Q14,-76 16,-54 Q30,-50 26,-26 Q0,-14 -26,-26Z" fill="#a87a4a"/><path d="M-14,-66 q2,-4 5,-1 M8,-67 q2,-4 5,0" fill="none" stroke="#7a5230" stroke-width="2.2"/>`+
     `<path d="M-8,-50 Q0,-46 8,-50 L10,-36 Q0,-32 -10,-36Z" fill="#2f6f73"/><rect x="-32" y="-36" width="12" height="18" rx="3" fill="#8a5a3a"/><rect x="20" y="-36" width="12" height="18" rx="3" fill="#c4473a"/>`
    :`<path d="M-12,4 L-11,-22 M12,4 L11,-22" fill="none" stroke="#b38a52" stroke-width="5"/><circle cx="-11.5" cy="-10" r="3" fill="#b38a52" stroke-width="1.2"/><circle cx="11.5" cy="-10" r="3" fill="#b38a52" stroke-width="1.2"/><path d="M-24,-26 Q-28,-50 -12,-56 Q0,-82 12,-56 Q28,-50 24,-26 Q0,-16 -24,-26Z" fill="${c}"/>`+
     `<path d="M-22,-46 Q0,-40 22,-46 L24,-26 Q0,-20 -24,-26Z" fill="#b8402e"/><path d="M-23,-40 Q0,-34 23,-40" fill="none" stroke="#2f6f9a" stroke-width="2"/><path d="M-23,-33 Q0,-27 23,-33" fill="none" stroke="#f0c040" stroke-width="2.4"/><path d="M-24,-26 l3,6 l3,-6 l3,6 l3,-6 l3,6 l3,-6 l3,6 l3,-6 l3,6 l3,-6 l3,6 l3,-6 l3,6 l3,-6 l3,6 l3,-6" fill="none" stroke="#f0c040" stroke-width="1.6"/><g stroke-width="1.1"><circle cx="-16" cy="-18" r="2.4" fill="#e85d8a"/><circle cx="0" cy="-16" r="2.4" fill="#4fa7a8"/><circle cx="16" cy="-18" r="2.4" fill="#f0c040"/></g>`)+
   `<path d="M0,-22 Q-2,-12 2,-4" fill="none" stroke="#a8783a" stroke-width="3"/>`+(rider?`<g transform="translate(0,-48) scale(.9)">${kid({view:'back',pose:'stand',hat:HAT_T,skin:'#c98d5e',shirt:'#c4573a',top:'long',bottom:'pants',pants:'#e8d9b4',arm:0})}</g>`:'')+`</g></g>`; /* 2026-11-18 動畫的 transform 會蓋掉 transform 屬性，所以位置放外層、動畫放內層 */
  let s=`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><style>.py13{transform-origin:200px 300px;animation:py13 4.3s ease-in forwards}@keyframes py13{from{transform:scale(.62)}to{transform:scale(1.7)}}.rp13{animation:rp13 .9s linear infinite}@keyframes rp13{to{transform:translateY(120px)}}.cb13{animation:cb13 .6s ease-in-out infinite alternate}@keyframes cb13{to{transform:translateY(-3px)}}</style>`;
  s+=`<g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect width="400" height="600" fill="#f8e6bd" stroke="none"/><circle cx="320" cy="90" r="40" fill="#fdf0c0" stroke="none"/><circle cx="320" cy="90" r="64" fill="#fbeab0" stroke="none" opacity=".4"/>`;
  s+=`<path d="M0,300 Q100,276 200,296 T400,292 V600 H0Z" fill="#f2dbaa" stroke="none"/>`;
  s+=`<g class="py13"><g stroke="none"><path d="M60,300 L96,262 L132,300Z" fill="#e8cf98"/><path d="M270,300 L304,266 L338,300Z" fill="#e8cf98"/></g><path d="M200,300 L116,300 L200,150 L284,300Z" fill="#ecd49e"/><path d="M200,150 L284,300 H232Z" fill="#d3b274" stroke="none"/><path d="M200,150 L214,172 H186Z" fill="#e4b53e" stroke-width="1.4"/>${[1,2,3,4,5,6].map(i=>`<path d="M${f(200-84*(1-i/7))},${f(300-150*i/7)} H${f(200+84*(1-i/7))}" fill="none" stroke="#b99a58" stroke-width="1.1" opacity=".55"/>`).join('')}<path d="M188,300 V280 Q200,272 212,280 V300Z" fill="#2a1e16" stroke-width="1.6"/></g>`;
  s+=`<path d="M0,300 Q100,276 200,296 T400,292" fill="none" stroke-width="2"/>`;
  s+=`<g clip-path="inset(300px 0 0 0)"><g class="rp13">${ripples(280)}${ripples(400)}${ripples(520)}${ripples(640)}${ripples(760)}</g></g>`;
  s+=camelBack(124,430,.7,'#d9b57a',false,'G')+camelBack(280,452,.8,'#d6aa66',true,'B')+camelBack(200,520,1.05,'#d9b57a',true,'G');
  return s+`</g></svg>`}};

/* ================= 9. 場景彩蛋：點金字塔入口門洞，裡面閃出金光 ================= */
H.TAPHOOKS[N]=(x,y)=>{if(Math.abs(x-GATE.x)>62||y>GATE.y+26||y<GATE.y-80)return false;
 H.burst(GATE.x,GATE.y-26);H.toast('✨ 門洞裡面好像有什麼在發光⋯',1800);tone(660,.12,'triangle',.05);tone(880,.1,'triangle',.04,.1);return true};
})();

/* ================= 出口：沙丘滑沙場最北邊，往金字塔走的商隊（2026-11-17 引擎 11-17b／c「找路發現新關卡」） =================
   levels.js 這一關有 find:{after:12,from:12,hint:[…]}：滑沙場拿到 2 顆星之後，最北邊（約 1250,560）出現商隊；
   點領隊 → 「要跟商隊去金字塔嗎？」→ 出發才算發現。這個檔案在滑沙場載入時會一起載入（ensureFull）。
   RESERVE 只在這個檔案載入時才佔位置，所以還不能發現之前，滑沙場完全不變。 */
(function(){
const H=window.TH;if(!H)return;const N=13;const {T,f,OL,act}=H;
const EX={x:1250,y:560};
(H.RESERVE[12]||(H.RESERVE[12]=[])).push([EX.x-4,EX.y+6,250,126]);
const camel=(c,c2,bag=true)=>CAMELART.next().stand(c,c2,bag); /* 2026-11-18 換成 B／G 輪流 */
const turban=`<path d="M-15,-45 Q-17,-60 0,-62 Q17,-60 15,-45 Q0,-50 -15,-45Z" fill="#f1e6cc"/><path d="M-13,-53 Q0,-60 13,-52 M-14,-48 Q0,-55 14,-47" fill="none" stroke="#c9b48a" stroke-width="1.2"/><circle cx="0" cy="-56" r="2.4" fill="#c4473a" stroke-width="1"/>`;
let lead='';const leader=()=>lead||(lead=act(0,0,1,{view:'fq',pose:'stand',hat:-1,hs:3,skin:'#b97a4e',hair:'#2b2420',shirt:'#7a4fa0',pants:'#8a5a3a',beard:true,mood:2,top:'long',bottom:'pants'})+T(0,0,1,turban));
/* 2026-11-18 使用者：入口角色頭上從「？」改成「…」（和一般路人一樣，增加探索難度）；圓點半徑 1.75，不會被當成路人提示（DOTSIG） */
const svg=found=>T(-72,4,1,camel('#c99a5b','#a87a3c',true))+T(74,6,1,camel())+T(4,10,1,(found?'':`<g class="qbob">${H.bubble(14,-74,'dots').replace(/r="1\.7"/g,'r="1.75"')}</g>`)+leader());
const pv=()=>`<svg viewBox="0 0 220 110" width="220" height="110" style="display:block"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect x="0" y="0" width="220" height="110" rx="10" fill="#f6dfa8" stroke="none"/><circle cx="184" cy="26" r="13" fill="#f5c842" stroke="none"/><path d="M70,66 L116,16 L162,66Z" fill="#ecd49e"/><path d="M116,16 L162,66 H134Z" fill="#d3b274" stroke="none"/><path d="M0,74 Q50,60 100,72 T220,70 V110 H0Z" fill="#e8c47a"/><path d="M0,92 Q60,82 120,92 T220,90 V110 H0Z" fill="#d9ad5f"/><g transform="translate(120,96) scale(.72)">${camel()}</g><g transform="translate(62,96) scale(.56)">${camel('#c99a5b','#a87a3c',false)}</g></g></svg>`;
H.EXITS[N]={x:EX.x-4,y:EX.y,w:250,h:96,svg,ask:{pv,title:'要跟商隊去金字塔嗎？',
 text:'商隊領隊：我們要往北邊的金字塔去，那裡有考古隊在挖寶！<br>要不要跟我們一起走？',again:'商隊領隊：又要去金字塔嗎？<br>駱駝都吃飽了，隨時可以出發！',
 go:'🐪 跟商隊去金字塔',wait:'之後再說',waitMsg:'商隊領隊：好，我們在這裡休息一下，準備好再來找我！'}};
})();
