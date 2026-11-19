/* 奇幻小鎮大搜查．沙漠系列〔綠洲市集〕（找路發現的新關卡，編號 11 只是程式用）
   出口（通往滑沙場）：西北邊大沙丘頂（約 836,462；2026-11-18 從北邊搬過來）——由第 12 關（滑沙場）的檔案自己用 H.RESERVE[11]／H.EXITS[12] 放。
   日夜共用地形：之後做夜晚版時，把 ground／建築抽到共用檔案。 */
(function(){
const H=window.TH;if(!H)return;
const N=11;
const {T,f,r,sr,pk,ri,OL,kid,act,wrapAn,add,mark,canPlace,scatter,skyBirds,KIND,POOL,VPLAN,REG,SCREG,LEVELS,ART,DECOY,
 SCENE_IMPL,WATERFN,RIDES,HERE,OUTFITS,STORIES,HOSTK,HOSTN,SCATREG,SCATOK,tone,typeOf,HATS,limb,chibi}=H;
const tube=(d,c,w=3.4)=>`<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w+2.6}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;

/* ================= 1. 場景範圍、天空、場地邊緣 ================= */
H.SCENES[N]={x0:600,x1:1900,y1:2000,c:[1250,1240]};
H.TARGET[N]=330;
H.SKYC[N]='#f8e6bd';H.SKYY[N]=300;
H.EDGEM[N]='LRB';H.EDGED[N]='LRB';
H.EDGEDECO[N]=[['palm11',1.6],['cactus11',1],['duneRock11',1.4],['dryBush11',2.4]];
H.FRINGE[N]=[['dryBush11',2.4],['duneRock11',1.2],['cactus11',.8],['palm11',.5],['pebbles',1.2],['walker',.3]];
H.DENS[N]=1.15;

/* ================= 2. 當地人：長袍＋頭巾 ================= */
const turbanHat=()=>{const c=pk(['#f4ecd6','#f4ecd6','#e8d8b0','#3f6f9a','#a4442f','#f4ecd6']);
 return `<path d="M-14,-41 Q-16,-60 0,-61 Q16,-60 14,-41 Q0,-47 -14,-41Z" fill="${c}"/><path d="M-13,-52 Q0,-59 13,-51 M-13,-47 Q0,-54 13,-46" fill="none" stroke="#00000033" stroke-width="1.3"/><path d="M11,-48 q7,6 5,16 q-5,-4 -7,-12Z" fill="${c}"/>`};
const HAT_T=HATS.push(turbanHat)-1;
const ROBES=['#e8d9b4','#c4573a','#2f6f73','#d89a3a','#7a4fa0','#f1e6cc','#4a6f9a','#8a5a3a'];
OUTFITS[N]=o=>{if(o.top)return o;
 o.skin=o.skin||pk(['#c98d5e','#b97a4e','#a8683e','#d9a578','#8f5a36']);
 o.top='long';o.bottom='pants';o.shirt=o.shirt||pk(ROBES);o.pants=o.pants||'#e8d9b4';
 if(o.hat==null&&!o.plain)o.hat=r()<.7?HAT_T:-1;return o};

/* ================= 3. 物件與干擾物 ================= */
Object.assign(ART,{
 teapot11:tube('M10,-2 Q19,-6 20,-19','#c8843c',3.6)+tube('M-10,-6 Q-21,-8 -17,4 Q-14,8 -10,3','#c8843c',2.6)+
  `<path d="M-11,7 Q-15,-5 -8,-11 L8,-11 Q15,-5 11,7Z" fill="#cf8a3e"/><path d="M-8,-11 Q-5,-9 -3,-3" fill="none" stroke="#f2c470" stroke-width="2" opacity=".8"/>`+
  `<path d="M-5,-12 Q0,-20 5,-12Z" fill="#e0a84e"/><circle cx="0" cy="-20" r="2.2" fill="#f2cf6a"/><rect x="-9" y="6" width="18" height="3.4" rx="1.5" fill="#a8641f"/>`,
 lamp11:tube('M-11,-1 Q-22,-3 -20,-13','#e4b53e',3.2)+tube('M11,-2 Q23,-9 14,-14','#e4b53e',2.6)+
  `<path d="M-12,2 Q-12,-6 0,-6 Q12,-6 12,2 Q8,9 0,9 Q-8,9 -12,2Z" fill="#e8bb40"/><path d="M-8,0 Q-3,-3 2,-2" fill="none" stroke="#fbe9a0" stroke-width="1.8"/>`+
  `<path d="M-5,-6 Q0,-14 5,-6Z" fill="#d6a42c"/><circle cx="0" cy="-14" r="1.8" fill="#f6d460"/><rect x="-5" y="9" width="10" height="3" rx="1.4" fill="#b8861e"/>`+
  `<path d="M-20,-14 q-4,-5 0,-10 q4,5 0,10Z" fill="#f08a2a"/>`,
 dates11:`<path d="M0,-16 Q-3,-10 0,-5" fill="none" stroke-width="2.4"/><path d="M-1,-16 Q-12,-24 -16,-14 M1,-16 Q12,-24 17,-13" fill="none" stroke="#5f8e3e" stroke-width="3.4"/>`+
  [[-6,-6],[2,-8],[8,-4],[-9,2],[-1,0],[6,4],[-4,9],[3,11]].map(([x,y],i)=>`<ellipse cx="${x}" cy="${y}" rx="3.8" ry="5.4" fill="${i%2?'#7a3e1e':'#8f4a22'}" transform="rotate(${i*8-20} ${x} ${y})"/>`).join(''),
 pomegranate11:`<circle cx="0" cy="1" r="11.5" fill="#c9352f"/><path d="M-7,-9 L-5,-15 L-1,-11 L1,-16 L3,-11 L7,-14 L6,-8Z" fill="#a8261f"/><path d="M-6,-3 Q-3,-8 2,-7" fill="none" stroke="#f08a80" stroke-width="2" opacity=".8"/><path d="M4,9 Q9,5 10,-1" fill="none" stroke="#8f1f1a" stroke-width="1.4"/>`,
 fennec11:`<path d="M-9,8 Q-11,-2 0,-3 Q11,-2 9,8Z" fill="#e0b87a"/><path d="M8,6 q9,-2 9,-9 q-5,2 -8,0" fill="#e0b87a"/><path d="M-4,8 v3 M4,8 v3" fill="none" stroke-width="2.4"/>`+
  `<path d="M-11,-8 L-17,-26 L-4,-14Z M11,-8 L17,-26 L4,-14Z" fill="#e8c78c"/><path d="M-11,-12 L-14,-21 L-7,-14Z M11,-12 L14,-21 L7,-14Z" fill="#f0a8a0" stroke="none"/>`+
  `<ellipse cx="0" cy="-8" rx="12" ry="10" fill="#ecc98c"/><ellipse cx="0" cy="-4" rx="6" ry="4.4" fill="#fbf1d8" stroke="none"/><circle cx="-4.6" cy="-9" r="1.5" fill="${OL}" stroke="none"/><circle cx="4.6" cy="-9" r="1.5" fill="${OL}" stroke="none"/><ellipse cx="0" cy="-5.6" rx="1.8" ry="1.3" fill="${OL}" stroke="none"/>`,
 drum11:`<ellipse cx="0" cy="4" rx="15" ry="9" fill="#8a5a32"/><ellipse cx="0" cy="0" rx="15" ry="9" fill="#9a6a3a"/><ellipse cx="0" cy="-1" rx="12.5" ry="7" fill="#f2e2b8"/>`+
  `<path d="M-8,-1 L0,-6 L8,-1 L0,4Z" fill="none" stroke="#c4473a" stroke-width="2"/><circle cx="0" cy="-1" r="1.8" fill="#2f6f73" stroke="none"/>`+
  [-11,-4,4,11].map(x=>`<circle cx="${x}" cy="${x%2?-8.6:-8.6}" r="1.8" fill="#f5c842" stroke-width="1"/>`).join('')+`<path d="M-15,2 v6 M15,2 v6" fill="none" stroke-width="1.2"/>`,
 nazar11:`<path d="M0,-17 Q-5,-17 -5,-13 Q-5,-10 0,-10 Q5,-10 5,-13 Q5,-17 0,-17Z" fill="none" stroke-width="1.8"/><circle cx="0" cy="3" r="13" fill="#2a5aa8"/><circle cx="0" cy="3" r="9.4" fill="#f4f0e4"/><circle cx="0" cy="3" r="6.2" fill="#5fa6dc"/><circle cx="0" cy="3" r="3" fill="#1b2438"/>`,
 sandbottle11:`<rect x="-3" y="-17" width="6" height="5" rx="1" fill="#b98a4a"/><path d="M-3,-12 L-3,-8 Q-10,-6 -10,0 V9 Q-10,13 -6,13 H6 Q10,13 10,9 V0 Q10,-6 3,-8 V-12Z" fill="#e8f2f2" opacity=".95"/>`+
  `<path d="M-10,9 V1 H10 V9 Q10,13 6,13 H-6 Q-10,13 -10,9Z" fill="#e8a44a" stroke="none"/><path d="M-10,1 Q0,-3 10,1 V-2 Q0,-6 -10,-2Z" fill="#c4473a" stroke="none"/><path d="M-10,-2 Q0,-6 10,-2 V-5 Q5,-7 3,-8 H-3 Q-8,-6 -10,-3Z" fill="#4a7ab0" stroke="none"/><path d="M-10,5 H10" fill="none" stroke="#f4ecd0" stroke-width="2.2"/>`+
  `<path d="M-3,-12 L-3,-8 Q-10,-6 -10,0 V9 Q-10,13 -6,13 H6 Q10,13 10,9 V0 Q10,-6 3,-8 V-12" fill="none"/>`,
 cactus11:`<path d="M-9,3 L-7,13 H7 L9,3Z" fill="#c4642f"/><rect x="-10" y="1" width="20" height="4.6" rx="2" fill="#d5763a"/>`+
  tube('M-6,-2 Q-13,-2 -13,-9','#6f9a4a',4)+tube('M6,0 Q14,0 14,-7','#6f9a4a',4)+`<rect x="-5" y="-17" width="10" height="20" rx="5" fill="#7aa856"/><path d="M0,-15 V1 M-2.4,-13 V0 M2.4,-13 V0" fill="none" stroke="#4f7a36" stroke-width="1"/><circle cx="0" cy="-18" r="3" fill="#f08aa8" stroke-width="1.2"/>`,
 carpet11:`<rect x="-16" y="-8" width="32" height="16" rx="3" fill="#b8402e"/><path d="M-9,-8 V8 M-2,-8 V8 M5,-8 V8" fill="none" stroke="#f0c040" stroke-width="2.6"/><path d="M-6,-8 V8 M1,-8 V8" fill="none" stroke="#2f6f9a" stroke-width="1.6"/>`+
  `<ellipse cx="-16" cy="0" rx="4.6" ry="8" fill="#e8c88a"/><ellipse cx="-16" cy="0" rx="2.4" ry="4.6" fill="none" stroke-width="1.4"/><path d="M16,-6 v-4 M16,-2 v-4 M16,2 v-4 M16,6 v-4" fill="none" stroke="#e8d8a8" stroke-width="2" transform="translate(2,4)"/>`});
Object.assign(DECOY,{
 kettle11:`<path d="M-12,8 Q-13,-4 -9,-9 L9,-9 Q13,-4 12,8Z" fill="#aeb4b8"/><path d="M12,-2 L21,-7" fill="none" stroke="#7d8488" stroke-width="3"/><path d="M-9,-9 Q0,-18 9,-9Z" fill="#9aa0a4"/><path d="M-12,-3 Q-22,-8 -16,4" fill="none" stroke-width="2.6"/><rect x="-1.4" y="-21" width="2.8" height="5" fill="#8a9094"/>`,
 oilpot11:`<path d="M-14,-2 Q-14,9 0,9 Q14,9 14,-2Z" fill="#b8763a"/><path d="M-14,-2 L-21,-9 L-14,-7Z" fill="#b8763a"/><ellipse cx="0" cy="-2" rx="14" ry="3.6" fill="#8f5a28"/><path d="M14,-1 Q23,-3 20,6 Q18,8 13,5" fill="none" stroke-width="2.6"/>`,
 grapes11:`<path d="M0,-16 Q-2,-11 0,-8" fill="none" stroke-width="2.4"/><path d="M0,-15 q9,-8 14,0 q-8,3 -14,0Z" fill="#6f9a4a" stroke-width="1.6"/>`+
  [[-6,-6],[0,-6],[6,-6],[-8,0],[-2,0],[4,0],[10,0],[-5,6],[1,6],[7,6],[-1,12]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="4.6" fill="${i%3?'#4a2a62':'#5a3578'}"/>`).join(''),
 applePlain11:`<path d="M0,-9 Q-12,-13 -12,0 Q-12,12 0,10 Q12,12 12,0 Q12,-13 0,-9Z" fill="#c9352f"/><path d="M0,-9 Q1,-14 4,-16" fill="none" stroke="#7a5235" stroke-width="2"/><path d="M3,-13 q7,-5 10,0 q-6,3 -10,0Z" fill="#6f9a4a" stroke-width="1.4"/><path d="M-7,-4 Q-5,-8 -1,-7" fill="none" stroke="#f08a80" stroke-width="1.8" opacity=".8"/>`,
 rabbitToy11:`<path d="M-9,8 Q-11,-2 0,-3 Q11,-2 9,8Z" fill="#f2ecdc"/><path d="M-4,8 v3 M4,8 v3" fill="none" stroke-width="2.4"/><path d="M-6,-12 Q-10,-30 -4,-28 Q-1,-22 -2,-12Z M6,-12 Q10,-30 4,-28 Q1,-22 2,-12Z" fill="#f2ecdc"/><path d="M-5,-14 Q-7,-24 -4.6,-24 Q-3,-20 -3.4,-14Z M5,-14 Q7,-24 4.6,-24 Q3,-20 3.4,-14Z" fill="#f0a8a0" stroke="none"/>`+
  `<ellipse cx="0" cy="-7" rx="10" ry="9" fill="#f6f0e2"/><circle cx="-4" cy="-8" r="1.4" fill="${OL}" stroke="none"/><circle cx="4" cy="-8" r="1.4" fill="${OL}" stroke="none"/><ellipse cx="0" cy="-4.6" rx="1.8" ry="1.3" fill="#e8808a" stroke="none"/>`,
 tin11:`<ellipse cx="0" cy="7" rx="14" ry="5.6" fill="#b83a34"/><rect x="-14" y="-6" width="28" height="13" fill="#b83a34" stroke="none"/><path d="M-14,-6 V7 M14,-6 V7" fill="none"/><ellipse cx="0" cy="-6" rx="14" ry="5.6" fill="#d8504a"/><ellipse cx="0" cy="-6" rx="9" ry="3.4" fill="none" stroke="#f4d8a0" stroke-width="1.6"/><circle cx="0" cy="-8" r="2" fill="#f4d8a0" stroke-width="1"/><path d="M-12,1 H12" fill="none" stroke="#f4d8a0" stroke-width="2"/>`,
 button11:`<circle cx="0" cy="0" r="13" fill="#3f6fb8"/><circle cx="0" cy="0" r="9.4" fill="#4f84cc" stroke-width="1.4"/><circle cx="-3.2" cy="-3.2" r="1.7" fill="${OL}" stroke="none"/><circle cx="3.2" cy="-3.2" r="1.7" fill="${OL}" stroke="none"/><circle cx="-3.2" cy="3.2" r="1.7" fill="${OL}" stroke="none"/><circle cx="3.2" cy="3.2" r="1.7" fill="${OL}" stroke="none"/>`,
 emptyBottle11:`<rect x="-3" y="-17" width="6" height="5" rx="1" fill="#b98a4a"/><path d="M-3,-12 L-3,-8 Q-10,-6 -10,0 V9 Q-10,13 -6,13 H6 Q10,13 10,9 V0 Q10,-6 3,-8 V-12Z" fill="#dff0ee" opacity=".92"/><path d="M-6,-1 Q-6,-4 -3,-5" fill="none" stroke="#ffffff" stroke-width="2"/><path d="M-9,10 Q0,6 9,10" fill="none" stroke="#e8c88a" stroke-width="2.4"/>`,
 aloe11:`<path d="M-9,3 L-7,13 H7 L9,3Z" fill="#c4642f"/><rect x="-10" y="1" width="20" height="4.6" rx="2" fill="#d5763a"/><path d="M0,2 Q-3,-10 -1,-19 Q3,-9 3,2Z" fill="#7aa856"/><path d="M-2,2 Q-12,-5 -14,-14 Q-6,-8 0,2Z" fill="#6f9a4a"/><path d="M2,2 Q12,-5 14,-14 Q6,-8 0,2Z" fill="#6f9a4a"/><path d="M-3,2 Q-14,2 -17,-5 Q-8,-3 -1,2Z" fill="#7aa856"/><path d="M3,2 Q14,2 17,-5 Q8,-3 1,2Z" fill="#7aa856"/>`,
 tarp11:`<rect x="-16" y="-8" width="32" height="16" rx="3" fill="#d5c08a"/><ellipse cx="-16" cy="0" rx="4.6" ry="8" fill="#e8d8a8"/><ellipse cx="-16" cy="0" rx="2.4" ry="4.6" fill="none" stroke-width="1.4"/><path d="M-6,-8 V8 M7,-8 V8" fill="none" stroke="#8a6a3a" stroke-width="2.2"/><path d="M-6,8 q-2,5 -5,5 M7,8 q2,5 5,4" fill="none" stroke="#8a6a3a" stroke-width="1.4"/>`});

/* ---- 景物 ---- */
const palm=(lean=1,k=1)=>{const tx=3*lean,ty=-86;let g=tube(`M0,0 Q${5*lean},-40 ${tx},${ty}`,'#a8794a',7);
 for(let y=-12;y>-80;y-=11)g+=`<path d="M${f(-3+Math.abs(y)*.02*lean)},${y} h7" fill="none" stroke="#7a5235" stroke-width="1.2" transform="rotate(${lean*6} 0 ${y})"/>`;
 const leaf=(a,l,c)=>`<path d="M0,0 Q${f(l*.5)},${f(-l*.42)} ${f(l)},${f(l*.12)} Q${f(l*.52)},${f(-l*.12)} 0,0Z" fill="${c}" transform="translate(${tx},${ty}) rotate(${a})"/>`;
 [[-172,40,'#5f8e3e'],[-146,46,'#6f9a4a'],[-118,44,'#7aa856'],[-62,44,'#7aa856'],[-34,46,'#6f9a4a'],[-8,40,'#5f8e3e'],[-90,30,'#8cb862']].forEach(([a,l,c])=>g+=leaf(a,l*k,c));
 return g+`<g fill="#8f4a22">${[[-5,5],[3,7],[-1,10]].map(([x,y])=>`<ellipse cx="${tx+x}" cy="${ty+y}" rx="3" ry="4.2"/>`).join('')}</g>`};
const duneRock=()=>`<path d="M-16,0 Q-18,-10 -8,-13 Q2,-17 10,-10 Q18,-8 16,0Z" fill="#c9a868"/><path d="M-4,-12 Q2,-15 8,-9" fill="none" stroke="#e4cb92" stroke-width="2"/><path d="M-16,0 Q0,3 16,0" fill="none" stroke="#a88848" stroke-width="1.4"/>`;
const dryBush=()=>`<path d="M-12,0 Q-14,-10 -6,-14 Q-2,-20 4,-14 Q14,-12 12,0Z" fill="#b8a766"/><path d="M-8,0 L-6,-9 M-2,0 L-2,-13 M4,0 L5,-10 M9,0 L8,-6" fill="none" stroke="#8a7a44" stroke-width="1.4"/><path d="M-10,-8 q-5,-3 -7,-1 M10,-8 q5,-2 7,1" fill="none" stroke="#8a7a44" stroke-width="1.4"/>`;
const cactusBig=()=>tube('M-9,-14 Q-22,-14 -22,-30','#6f9a4a',7)+tube('M9,-22 Q23,-22 23,-38','#6f9a4a',7)+`<rect x="-8" y="-56" width="16" height="56" rx="8" fill="#7aa856"/><path d="M0,-52 V-2 M-4,-50 V-4 M4,-50 V-4" fill="none" stroke="#4f7a36" stroke-width="1.2"/>`;
const adobe=(w=84,h=62,o={})=>{const wall=o.wall||pk(['#e2be8e','#dcb482','#e8c89c','#d9a876']);
 return `<ellipse cx="0" cy="2" rx="${w*.62}" ry="6" fill="#000" opacity=".14" stroke="none"/>`+
 `<rect x="${-w/2}" y="${-h}" width="${w}" height="${h}" rx="3" fill="${wall}"/><path d="M${w/2-16},${-h} H${w/2} V0 H${w/2-16}Z" fill="#00000018" stroke="none"/>`+
 `<path d="M${-w/2-3},${-h} H${w/2+3} V${-h-7} H${-w/2-3}Z" fill="${shadeC(wall)}"/>`+
 [0,1,2,3].map(i=>`<rect x="${-w/2+8+i*((w-16)/3.4)}" y="${-h-5}" width="5" height="5" fill="#7a5235" stroke-width="1"/>`).join('')+
 `<path d="M${-w*.16},0 V${-h*.5} Q${-w*.16},${-h*.72} 0,${-h*.72} Q${w*.16},${-h*.72} ${w*.16},${-h*.5} V0Z" fill="#4a3a2e"/>`+
 `<path d="M${-w*.38},${-h*.58} q0,-9 6,-9 q6,0 6,9Z" fill="#4a3a2e"/><path d="M${w*.28},${-h*.58} q0,-9 6,-9 q6,0 6,9Z" fill="#4a3a2e"/>`+
 (o.awn?`<path d="M${-w*.28},${-h*.5} L${w*.28},${-h*.5} L${w*.24},${-h*.74} L${-w*.24},${-h*.74}Z" fill="${o.awn}" opacity="0"/>`:'')};
const shadeC=c=>{const m=/#(..)(..)(..)/.exec(c);if(!m)return c;return '#'+[1,2,3].map(i=>Math.max(0,parseInt(m[i],16)-26).toString(16).padStart(2,'0')).join('')};
const jar=(c='#c4642f',s=1)=>`<g transform="scale(${s})"><path d="M-10,0 Q-16,-14 -8,-24 L-5,-30 H5 L8,-24 Q16,-14 10,0Z" fill="${c}"/><ellipse cx="0" cy="-30" rx="6" ry="2.4" fill="#6a3a1c"/><path d="M-12,-14 Q0,-10 12,-14" fill="none" stroke="#f4d8a0" stroke-width="1.8"/><path d="M-6,-24 q-3,8 0,15" fill="none" stroke="#ffffff55" stroke-width="2"/></g>`;
const sacks=()=>[[-16,0,'#d9c08a','#c4473a'],[2,0,'#cdb67a','#e0a030'],[18,2,'#d9c08a','#5f8e3e']].map(([x,y,c,s])=>`<path d="M${x-9},${y} Q${x-11},${y-14} ${x-5},${y-17} H${x+5} Q${x+11},${y-14} ${x+9},${y}Z" fill="${c}"/><path d="M${x-7},${y-17} Q${x},${y-30} ${x+7},${y-17}Z" fill="${s}"/>`).join('');
const carpetStack=(n=5)=>{const cs=[['#b8402e','#f0c040'],['#2f6f9a','#f4ecd8'],['#7a4fa0','#e8a030'],['#c4573a','#f4ecd8'],['#4f8a5a','#f0c040']];let g=`<ellipse cx="0" cy="2" rx="34" ry="6" fill="#000" opacity=".14" stroke="none"/>`;
 cs.slice(0,n).forEach(([a,b],i)=>{const y=-i*8,w=28-(i%2)*3;g+=`<rect x="${-w}" y="${y-8}" width="${w*2}" height="8" rx="2" fill="${a}"/><path d="M${-w+4},${y-4} H${w-4}" stroke="${b}" stroke-width="2" stroke-dasharray="5 3" fill="none"/><path d="M${w},${y-7} v6 M${w+2},${y-7} v6" stroke="${b}" stroke-width="1.2"/>`});return g};
const lampPole=()=>`<path d="M0,0 V-70 M0,-70 H18" fill="none" stroke-width="4"/><path d="M18,-70 V-62" fill="none" stroke-width="1.4"/><path d="M12,-62 H24 L26,-50 H10Z" fill="#e0a030"/><rect x="11" y="-50" width="14" height="4" fill="#8a5a32"/><path d="M13,-60 V-52 M18,-60 V-52 M23,-60 V-52" stroke="#fbe9a0" stroke-width="1.4"/>`+
 `<path d="M0,-66 L-14,-60 L0,-56Z" fill="#c4473a" stroke-width="1.4"/>`;
const stripe=(c1,c2,w=58,y0=-62,y1=-82,n=8)=>{let g=`<path d="M${-w},${y0} L${w},${y0} L${w-6},${y1} L${-w+6},${y1}Z" fill="${c2}"/>`;
 const sw=2*w/n;for(let i=0;i<n;i+=2)g+=`<path d="M${-w+i*sw},${y0} L${-w+(i+1)*sw},${y0} L${-w+(i+1)*sw*.9+ (w*.1)-3},${y1} L${-w+i*sw*.9+(w*.1)-3},${y1}Z" fill="${c1}" stroke="none"/>`;
 g+=`<path d="M${-w},${y0} L${w},${y0} L${w-6},${y1} L${-w+6},${y1}Z" fill="none"/>`;
 g+=`<path d="M${-w},${y0} ${Array.from({length:n},()=>`q${f(sw/2)},8 ${f(sw)},0`).join(' ')}" fill="${c2}"/>`;return g};
const STALLC=[['#c4473a','#f3e2b8'],['#2f6f73','#f3e2b8'],['#d89a3a','#f3e2b8'],['#7a4fa0','#f3e2b8'],['#4a7ab0','#f3e2b8']];
const stall11=kind=>{const [c1,c2]=pk(STALLC);const sk=pk(['#c98d5e','#b97a4e','#a8683e','#d9a578']);
 let g=`<ellipse cx="0" cy="2" rx="62" ry="6" fill="#000" opacity=".14" stroke="none"/><path d="M-50,0 V-62 M50,0 V-62" fill="none" stroke-width="4"/><path d="M-50,-62 H50" fill="none" stroke="#7a5235" stroke-width="2"/>`;
 g+=`<rect x="-54" y="-34" width="108" height="34" fill="#c99a5b"/><path d="M-54,-34 H54 V-28 H-54Z" fill="#a8703f" stroke-width="1.4"/><path d="M-54,-18 H54" fill="none" stroke-width="1.2"/>`;
 g+=`<g transform="translate(0,-34) scale(.78)">${chibi({skin:sk,top:'long',shirt:pk(ROBES),hat:HAT_T,arm:1,mood:1})}</g>`;
 g+=stripe(c1,c2,58,-62,-84,8);
 const gd=[];
 if(kind==='spice')for(let i=0;i<5;i++)gd.push(T(-40+i*20,-34,.8,`<path d="M-9,0 Q-10,-6 -7,-8 H7 Q10,-6 9,0Z" fill="#c8a060" stroke-width="1.4"/><path d="M-8,-8 Q0,-22 8,-8Z" fill="${['#c4473a','#e0a030','#8a4a22','#5f8e3e','#d86a2a'][i]}" stroke-width="1.4"/>`));
 if(kind==='carpet'){gd.push(`<path d="M-44,-58 V-34 M-20,-58 V-34 M4,-58 V-34 M28,-58 V-34" fill="none" stroke="none"/>`);[-36,-12,12,34].forEach((x,i)=>gd.push(`<path d="M${x-10},-58 H${x+10} V-36 H${x-10}Z" fill="${['#b8402e','#2f6f9a','#7a4fa0','#c4573a'][i]}" stroke-width="1.4"/><path d="M${x-6},-54 H${x+6} M${x-6},-48 H${x+6} M${x-6},-42 H${x+6}" stroke="#f0c040" stroke-width="1.6" fill="none"/>`))}
 if(kind==='pots')for(let i=0;i<4;i++)gd.push(T(-36+i*24,-34,.6,jar(pk(['#c4642f','#a8501f','#d27a3a','#8a4a22']))));
 if(kind==='lamp'){[-34,-12,10,32].forEach((x,i)=>{gd.push(`<path d="M${x},-62 V-52" stroke-width="1.2" fill="none"/><path d="M${x-6},-52 H${x+6} L${x+7},-42 H${x-7}Z" fill="${i%2?'#e0a030':'#c8843c'}" stroke-width="1.4"/><path d="M${x},-50 V-44" stroke="#fbe9a0" stroke-width="1.4" fill="none"/>`)})}
 if(kind==='fruit')for(let i=0;i<5;i++)gd.push(T(-40+i*20,-34,.8,`<path d="M-10,0 Q-11,-7 -8,-9 H8 Q11,-7 10,0Z" fill="#b8884a" stroke-width="1.4"/>`+[-5,0,5].map((x,j)=>`<circle cx="${x}" cy="${-11-(j%2)*2}" r="4.4" fill="${['#c9352f','#e8a030','#8f4a22','#6f9a4a','#c9352f'][(i+j)%5]}" stroke-width="1.2"/>`).join('')));
 if(kind==='tea'){gd.push(T(-24,-34,.8,`<path d="M-9,0 Q-10,-8 -6,-11 H6 Q10,-8 9,0Z" fill="#cf8a3e"/><path d="M9,-3 Q16,-6 16,-14" fill="none" stroke-width="2.4"/>`));for(let i=0;i<4;i++)gd.push(T(-2+i*14,-34,.7,`<path d="M-5,0 L-6,-9 H6 L5,0Z" fill="#fbf1d8" opacity=".95"/><path d="M-5.5,-4 H5.5" stroke="#5f8e3e" stroke-width="2.4" fill="none"/>`))}
 return g+gd.join('')};
const tent11=(c='#c4573a')=>`<ellipse cx="0" cy="3" rx="76" ry="8" fill="#000" opacity=".14" stroke="none"/>`+
 `<path d="M-68,0 L-60,-44 Q0,-66 60,-44 L68,0Z" fill="#eedcae"/>`+[-52,-34,-16,2,20,38].map((x,i)=>i%2?'':`<path d="M${x},-1 L${x+3},-52 L${x+13},-54 L${x+13},-1Z" fill="${c}" stroke="none" opacity=".9"/>`).join('')+
 `<path d="M-60,-44 Q0,-66 60,-44" fill="none" stroke-width="2.2"/><path d="M-62,-40 Q0,-60 62,-40" fill="none" stroke="#fffaf0" stroke-width="1.6" opacity=".7"/>`+
 `<path d="M-24,0 L-21,-33 Q0,-41 21,-33 L24,0Z" fill="#3a2a22"/><path d="M-22,0 L-20,-6 H20 L22,0Z" fill="${c}" stroke-width="1.4"/><ellipse cx="-6" cy="-12" rx="9" ry="5.4" fill="#e0a030" stroke-width="1.5"/>`+
 `<path d="M-24,0 L-21,-33 L-34,-28 L-40,0Z" fill="#d9c48e"/><path d="M24,0 L21,-33 L34,-28 L40,0Z" fill="#d9c48e"/>`+
 `<path d="M-68,0 l-8,6 M68,0 l8,6 M0,-64 V-70" fill="none" stroke-width="1.8"/><path d="M0,-70 l9,3 l-9,3Z" fill="${c}" stroke-width="1.3"/>`;
const camelStand=(c,c2,bag)=>CAMEL.stand(c,c2,bag);
/* 2026-11-18 駱駝改用 art.js 的 CAMELART（使用者選 B 雙峰＋G 修長盛裝，兩種輪流） */
const CAMEL=CAMELART;

/* ---- 佈景圖鑑（KIND）：場地外、POOL、干擾物都要登記 ---- */
const dk=(id,w,h,cy=-12)=>({w,h,fn:()=>T(0,cy,1,DECOY[id])});
Object.assign(KIND,{
 palm11:{w:56,h:96,fn:()=>palm(pk([1,-1]),1)},cactus11:{w:44,h:60,fn:cactusBig},duneRock11:{w:34,h:18,fn:duneRock},dryBush11:{w:30,h:20,fn:dryBush},
 jar11:{w:30,h:34,fn:()=>jar(pk(['#c4642f','#a8501f','#d27a3a','#8a4a22']),pk([.8,1,1.15]))},sacks11:{w:56,h:36,fn:sacks},carpetStack11:{w:66,h:46,fn:()=>carpetStack(pk([3,4,5]))},
 lampPole11:{w:40,h:76,fn:lampPole},adobe11:{w:90,h:76,fn:()=>adobe(84,62)},stall11:{w:122,h:92,fn:()=>stall11(pk(['spice','carpet','pots','lamp','fruit','tea']))},
 tent11:{w:150,h:70,fn:()=>tent11(pk(['#c4573a','#2f6f73','#d89a3a']))},camelS11:{w:70,h:80,fn:()=>CAMEL.stand(pk(['#d6aa66','#c99a58','#dcb878']),'#b98a4a',r()<.5),},camelR11:{w:76,h:40,fn:()=>CAMEL.rest()},
 kettle11:dk('kettle11',26,30),oilpot11:dk('oilpot11',30,22,-6),grapes11:dk('grapes11',24,32),applePlain11:dk('applePlain11',26,28),rabbitToy11:dk('rabbitToy11',24,34),
 tin11:dk('tin11',28,24,-4),button11:dk('button11',26,26,0),emptyBottle11:dk('emptyBottle11',22,32),aloe11:dk('aloe11',30,34),tarp11:dk('tarp11',32,18,0)});
KIND.camelS11.fn=()=>CAMEL.stand(pk(['#d6aa66','#c99a58','#dcb878']),'#b98a4a',r()<.5);

/* ================= 4. 12 種 × 4 個 ================= */
/* 老朋友的定義直接寫在這裡：沙漠檔案會在第 4 關載入之前就跟著第 1 關載入（ensureFull），這時 typeOf 還找不到；圖（ART）等玩的時候第 4 關早就載入了 */
const OLD={compass:{id:'compass',name:'黃銅羅盤',short:'羅盤',r:14,rot:30},amphora:{id:'amphora',name:'古陶罐',short:'陶罐',r:15,rot:10}};
const old=(id,regions)=>({...(typeOf(id)||OLD[id]),regions});
const TYPES=[
 old('compass',['roadE11','bazaarN11','camp11','shore11']),old('amphora',['bazaarS11','camp11','bazaarN11','southD11']),
 {id:'teapot11',name:'銅茶壺',short:'茶壺',r:15,rot:14,regions:['bazaarN11','bazaarS11','camp11','shore11']},
 {id:'lamp11',name:'魔法神燈',short:'神燈',r:15,rot:16,regions:['bazaarN11','bazaarS11','bazaarN11','southD11']},
 {id:'dates11',name:'椰棗串',short:'椰棗',r:15,rot:30,regions:['shore11','bazaarS11','roadE11','shore11']},
 {id:'pomegranate11',name:'石榴',short:'石榴',r:14,rot:20,regions:['bazaarS11','shore11','bazaarN11','roadE11']},
 {id:'fennec11',name:'耳廓狐玩偶',short:'耳廓狐',r:15,rot:10,regions:['camp11','bazaarS11','duneN11','camp11']},
 {id:'drum11',name:'手鼓',short:'手鼓',r:15,rot:14,regions:['camp11','bazaarN11','shore11','bazaarS11']},
 {id:'nazar11',name:'藍眼護符',short:'護符',r:14,rot:20,regions:['bazaarN11','bazaarS11','bazaarN11','roadE11']},
 {id:'sandbottle11',name:'彩沙瓶',short:'彩沙瓶',r:14,rot:8,regions:['bazaarS11','duneN11','bazaarN11','southD11']},
 {id:'cactus11',name:'小仙人掌盆栽',short:'仙人掌',r:15,rot:6,regions:['southD11','camp11','roadE11','duneN11']},
 {id:'carpet11',name:'條紋地毯捲',short:'地毯捲',r:16,rot:18,regions:['bazaarN11','bazaarS11','camp11','southD11']}];
LEVELS[N].types=TYPES;
/* BORROW：使用者決定不借（沙漠物件不混進前面的關卡） */

/* ================= 5. 地形、水、區域 ================= */
const POND={cx:1250,cy:1070,rx:240,ry:128};
const inPond=(x,y)=>((x-POND.cx)/POND.rx)**2+((y-POND.cy)/POND.ry)**2<1;
WATERFN[N]=inPond;
Object.assign(REG,{duneN11:{x:900,y:440,w:960,h:280},bazaarN11:{x:700,y:730,w:1150,h:180},shore11:{x:930,y:930,w:640,h:320},camp11:{x:640,y:930,w:280,h:480},
 roadE11:{x:1580,y:560,w:290,h:700},bazaarS11:{x:700,y:1290,w:1150,h:300},southD11:{x:640,y:1570,w:1230,h:400},all11:{x:620,y:430,w:1260,h:1550}});
H.SCREG[N]=['bazaarN11','shore11','camp11','roadE11','bazaarS11'];  /* 故事和路人只放市集、綠洲邊、帳篷區、商隊路（沙丘和南邊沙地只放佈景） */

function ground(){
 const Sc=H.SCENES[N],X0=Sc.x0-420,WW=Sc.x1-Sc.x0+840;let g='';
 /* 沙地底色＋深淺斑塊 */
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="${Sc.y1+840}" fill="#ecd29c" stroke="none"/>`;
 for(let i=0;i<60;i++){const x=sr(X0,X0+WW),y=sr(300,Sc.y1+300);g+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(60,170))}" ry="${f(sr(16,40))}" fill="${pk(['#e4c58a','#f2dbaa','#e8cc94','#dfbf84'])}" stroke="none" opacity=".6"/>`}
 /* 北邊天空：暖黃天色、太陽、遠方沙丘、遠方金字塔剪影（給之後的金字塔關卡當伏筆） */
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="760" fill="#f8e6bd" stroke="none"/><circle cx="980" cy="120" r="64" fill="#fbeab0" stroke="none" opacity=".55"/><circle cx="980" cy="120" r="40" fill="#fdf0c0" stroke="none"/>`;
 g+=`<path d="M${X0},250 Q700,196 960,238 Q1200,190 1480,236 Q1760,196 ${X0+WW},244 V340 H${X0}Z" fill="#efd7a0" stroke="none"/>`;
 g+=`<g stroke="none" transform="translate(-520,0)"><path d="M1586,262 L1650,176 L1714,262Z" fill="#e3c68a"/><path d="M1650,176 L1714,262 H1668Z" fill="#d3b274"/><path d="M1706,266 L1748,212 L1790,266Z" fill="#e6cb92"/><path d="M1748,212 L1790,266 H1762Z" fill="#d6b77a"/></g>`;
 g+=`<path d="M${X0},282 Q640,236 880,276 Q1120,234 1360,278 Q1600,240 1800,280 Q2000,246 ${X0+WW},276 V360 H${X0}Z" fill="#e8cb92" stroke="none"/>`;
 g+=`<path d="M${X0},320 Q760,284 1020,322 Q1280,288 1560,324 Q1800,296 ${X0+WW},322 V380 H${X0}Z" fill="#ecd29c" stroke="none"/>`;
 /* 西北邊大沙丘（滑沙場入口在丘頂）：2026-11-18 地圖上滑沙場在綠洲西北邊，整座沙丘從北邊往西搬 404（原本頂點 1290,438） */
 g+='<g transform="translate(-404,0)">';
 g+=`<path d="M780,730 Q960,640 1110,536 Q1210,440 1290,438 Q1390,446 1480,550 Q1600,650 1740,730Z" fill="#f4dfa8"/>`;
 g+=`<path d="M1290,438 Q1390,446 1480,550 Q1600,650 1740,730 H1530 Q1450,600 1290,438Z" fill="#dcbc7e" stroke="none"/>`;
 for(let i=0;i<7;i++){const y=500+i*34;g+=`<path d="M${f(930+i*18)},${y+52} Q${f(1100+i*6)},${y} ${f(1280)},${f(y-40+i*4)}" fill="none" stroke="#e6c88c" stroke-width="1.6" opacity=".8"/>`}
 g+=`<path d="M1226,470 Q1180,560 1206,640 Q1218,690 1190,732 M1252,462 Q1236,560 1260,636 Q1272,690 1250,732" fill="none" stroke="#cfa860" stroke-width="3" stroke-linecap="round"/>`;
 g+=`<g transform="translate(1284,452) rotate(-18)"><rect x="-4" y="-26" width="8" height="30" rx="3" fill="#c4573a" stroke-width="1.6"/><path d="M0,-24 V0" stroke="#f3e2b8" stroke-width="2" fill="none"/></g>`;
 g+='</g>';
 /* 小路：商隊從東北來，繞過市集和綠洲，一條往西邊帳篷區 */
 const lanes=['M1960,500 Q1720,560 1570,740 Q1440,840 1250,822 Q1000,810 880,860 Q760,900 640,940','M1250,1070 m-352,0 a352,222 0 1,0 704,0 a352,222 0 1,0 -704,0','M640,1420 Q940,1380 1250,1404 Q1560,1426 1900,1400','M1570,740 Q1700,900 1720,1100 Q1730,1300 1660,1420','M1230,1290 V1410'];
 lanes.forEach((d,i)=>{g+=`<path d="${d}" fill="none" stroke="#d9b678" stroke-width="${i===1?62:80}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#c9a460" stroke-width="2.2" stroke-dasharray="3 17" stroke-linecap="round" opacity=".9"/>`});
 /* 綠洲：沙岸、草地、池水、蘆葦 */
 g+=`<ellipse cx="${POND.cx}" cy="${POND.cy+6}" rx="${POND.rx+70}" ry="${POND.ry+44}" fill="#d9bb7e" stroke="none"/><ellipse cx="${POND.cx}" cy="${POND.cy}" rx="${POND.rx+52}" ry="${POND.ry+32}" fill="#9ab85a"/>`;
 for(let i=0;i<30;i++){const a=r()*6.283,rr=1.05+r()*.18;g+=`<path d="M${f(POND.cx+Math.cos(a)*(POND.rx+30)*rr)},${f(POND.cy+Math.sin(a)*(POND.ry+22)*rr)} l1,-7 M0,0" fill="none" stroke="#6f9a3e" stroke-width="1.6"/>`}
 g+=`<ellipse cx="${POND.cx}" cy="${POND.cy}" rx="${POND.rx}" ry="${POND.ry}" fill="#4fa7a8"/><ellipse cx="${POND.cx}" cy="${POND.cy+4}" rx="${POND.rx-14}" ry="${POND.ry-12}" fill="#79cdc6" stroke="none"/>`;
 g+=`<path d="M1130,1040 q18,-6 36,0 M1290,1100 q22,-7 44,0 M1180,1110 q12,-4 24,0 M1380,1040 q14,-5 28,0" fill="none" stroke="#e8fbf8" stroke-width="2"/>`;
 g+=`<g fill="none" stroke="#5f8e3e" stroke-width="2.4">${[[1040,1100],[1056,1114],[1450,1120],[1466,1104],[1300,1190]].map(([x,y])=>`<path d="M${x},${y} V${y-18} M${x+5},${y} V${y-14}"/>`).join('')}</g>`;
 /* 市集地上的地毯（顏色亮一點，讓市集有熱鬧的感覺） */
 [[1000,1350,70,30,'#b8402e','#f0c040'],[1360,1332,64,26,'#2f6f9a','#f4ecd8'],[1540,1350,60,26,'#7a4fa0','#e8a030'],[880,1345,54,24,'#4f8a5a','#f0c040'],[1100,830,60,24,'#c4573a','#f4ecd8'],[1400,830,58,24,'#2f6f73','#f0c040']].forEach(([x,y,w,h,c,b])=>{
  g+=`<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="3" fill="${c}"/><rect x="${x-w/2+5}" y="${y-h/2+4}" width="${w-10}" height="${h-8}" fill="none" stroke="${b}" stroke-width="1.8" stroke-dasharray="6 4"/><path d="M${x-w/2},${y-h/2+3} h-4 M${x-w/2},${y} h-4 M${x-w/2},${y+h/2-3} h-4 M${x+w/2},${y-h/2+3} h4 M${x+w/2},${y} h4 M${x+w/2},${y+h/2-3} h4" stroke="${b}" stroke-width="1.4" fill="none"/>`});
 /* 沙紋 */
 for(let i=0;i<46;i++){const x=sr(X0,X0+WW),y=sr(760,Sc.y1+300);g+=`<path d="M${f(x)},${f(y)} q14,-5 28,0 q14,5 28,0" fill="none" stroke="#d9bb7e" stroke-width="1.6" opacity=".9"/>`}
 return `<g stroke="${OL}" stroke-width="2" stroke-linejoin="round">${g}</g>`}

/* ================= 6. 建築與佈景 ================= */
Object.assign(POOL,{
 duneN11:[['dryBush11',2],['duneRock11',1.4],['cactus11',.5],['walker',.6],['pebbles',1],['tarp11',.18],['grapes11',.15]],
 bazaarN11:[['jar11',1.8],['sacks11',1.3],['carpetStack11',1.1],['crate',.6],['barrel',.7],['lampPole11',.5],['kettle11',.4],['oilpot11',.4],['applePlain11',.3],['tin11',.3],['pebbles',.6]],
 shore11:[['jar11',1.2],['dryBush11',.6],['duneRock11',.7],['sacks11',.6],['pebbles',.8],['grapes11',.3],['applePlain11',.3],['button11',.2],['kettle11',.3]],
 camp11:[['camelS11',.7],['camelR11',.9],['jar11',1],['sacks11',.7],['crate',.5],['dryBush11',.7],['duneRock11',.6],['rabbitToy11',.3],['tin11',.3],['aloe11',.3],['emptyBottle11',.2],['tarp11',.25]],
 roadE11:[['camelS11',.6],['jar11',.9],['sacks11',.9],['dryBush11',1],['duneRock11',.8],['crate',.5],['button11',.25],['grapes11',.25],['tarp11',.2],['oilpot11',.25]],
 bazaarS11:[['jar11',1.8],['sacks11',1.3],['carpetStack11',1.1],['crate',.6],['barrel',.7],['lampPole11',.5],['emptyBottle11',.4],['aloe11',.4],['rabbitToy11',.3],['tin11',.3],['button11',.3],['applePlain11',.3],['tarp11',.2]],
 southD11:[['dryBush11',2.2],['duneRock11',1.4],['cactus11',.8],['pebbles',1],['aloe11',.3],['emptyBottle11',.25],['tarp11',.2],['oilpot11',.25],['walker',.5]],
 decor11:[['dryBush11',1.6],['duneRock11',1],['pebbles',1],['cactus11',.4],['jar11',.4]]});
function structures(){
 skyBirds(N);
 /* 綠洲的棕櫚 */
 [[960,1020,1],[985,1160,1],[1110,1234,-1],[1380,1238,1],[1520,1140,1],[1545,1010,-1],[1460,930,1],[1120,925,-1],[1260,918,1],[1360,925,-1],[1190,1244,1]].forEach(([x,y,l])=>add(x,y,50,92,'palm11',palm(l,1),{sh:.8}));
 /* 北邊兩側的土磚屋 */
 [[1180,640,84,66],[1320,620,76,60],[700,780,88,64],[1700,640,80,62],[1780,700,76,58]].forEach(([x,y,w,h])=>add(x,y,w+10,h+14,'adobe11',adobe(w,h),{sh:.9}));
 /* 北邊市集（面對綠洲的一排攤位）：香料、燈、地毯、茶 */
 [[980,800,'spice'],[1120,800,'lamp'],[1390,800,'carpet'],[1530,800,'tea']].forEach(([x,y,k])=>add(x,y,124,90,'stall11',stall11(k),{sh:.9}));
 /* 南邊市集 */
 [[900,1330,'pots'],[1040,1330,'fruit'],[1210,1340,'spice'],[1380,1330,'carpet'],[1520,1330,'tea'],[1660,1340,'lamp']].forEach(([x,y,k])=>add(x,y,124,90,'stall11',stall11(k),{sh:.9}));
 /* 南邊土磚屋 */
 [[690,1560,88,66],[810,1590,78,60],[1740,1590,86,64],[1620,1570,76,58]].forEach(([x,y,w,h])=>add(x,y,w+10,h+14,'adobe11',adobe(w,h),{sh:.9}));
 /* 西邊的帳篷區：帳篷＋趴著的駱駝 */
 add(770,1060,150,70,'tent11',tent11('#c4573a'),{sh:.9});add(790,1210,150,70,'tent11',tent11('#2f6f73'),{sh:.9});add(720,1340,150,70,'tent11',tent11('#d89a3a'),{sh:.9});
 add(900,1130,76,40,'camelR11',CAMEL.rest(),{});add(930,1250,76,40,'camelR11',CAMEL.rest('#d6b072','#b88a4c'),{});
 /* 東邊的小路：商隊的駱駝 */
 add(1780,960,70,80,'camelS11',CAMEL.stand('#d6aa66','#b98a4a',true),{});add(1830,1010,70,80,'camelS11',CAMEL.stand('#c99a58','#a8783a',true),{fl:true});add(1740,1130,70,80,'camelS11',CAMEL.stand('#dcb878','#b98a4a',false),{});
 /* 路邊的燈柱 */
 [[1020,880],[1480,880],[1010,1260],[1500,1266],[1640,940]].forEach(([x,y])=>add(x,y,30,76,'lampPole11',lampPole(),{sh:.6}));
 /* 小土堆上的仙人掌 */
 [[760,1740],[1180,1830],[1620,1760],[900,1900]].forEach(([x,y])=>add(x,y,44,60,'cactus11',cactusBig(),{sh:.6}));
}
function scatterAll(){
 scatter('duneN11',POOL.duneN11,2600,40);scatter('bazaarN11',POOL.bazaarN11,3400,50);scatter('shore11',POOL.shore11,2600,40);
 scatter('camp11',POOL.camp11,2600,44);scatter('roadE11',POOL.roadE11,3000,46);scatter('bazaarS11',POOL.bazaarS11,3400,50);scatter('southD11',POOL.southD11,3400,50);
 scatter('all11',POOL.decor11,6000,90);
}
SCENE_IMPL[N]={ground,structures,scatter:scatterAll};
Object.assign(VPLAN,{duneN11:{walker:2,chat:2},bazaarN11:{chat:6,walker:6,carryBox:4,handInHand:2},shore11:{chat:4,reading:2,stretch:2,handInHand:2,flute:2},
 camp11:{chat:4,sleeping:2,stretch:2,carryBox:2},roadE11:{walker:6,chat:4},bazaarS11:{chat:6,walker:6,carryBox:4,flute:2,benchPair:2},southD11:{walker:4,chat:2}});
HOSTK.add('palm11');HOSTK.add('stall11');HOSTK.add('carpetStack11');HOSTK.add('jar11');
HOSTN.palm11='棕櫚樹';HOSTN.stall11='市集攤位';HOSTN.carpetStack11='地毯堆';HOSTN.jar11='水罐';
/* 物件的合理位置：SPOTS 放在那個東西上或旁邊；BLEND 是顏色相近的東西 */
H.SPOTS[N]={
 teapot11:[['stall11',.42,.3],['tent11',.08,.62],['camelR11',.2,.62]],
 lamp11:[['stall11',.42,-.3],['lampPole11',.12,.5],['adobe11',.05,.62]],
 dates11:[['palm11',.04,.3],['stall11',.42,.05],['jar11',.12,.7]],
 pomegranate11:[['stall11',.42,.15],['palm11',.04,.34],['jar11',.12,-.7]],
 fennec11:[['tent11',.06,.55],['carpetStack11',1,.05],['camelR11',.2,-.6]],
 drum11:[['tent11',.06,-.55],['stall11',.42,-.1],['camelR11',.2,.6]],
 nazar11:[['stall11',.72,.3],['lampPole11',.55,.05],['tent11',.5,.3]],
 sandbottle11:[['stall11',.42,.28],['jar11',.12,.7],['duneRock11',.1,.55]],
 cactus11:[['adobe11',.05,.6],['duneRock11',.1,.55],['stall11',.42,-.35]],
 carpet11:[['carpetStack11',1,.1],['stall11',.46,-.2],['tent11',.06,.4]],
 compass:[['camelS11',.55,.45],['stall11',.42,.4],['jar11',.12,.7]],
 amphora:[['jar11',.1,.7],['stall11',.42,-.4],['adobe11',.04,.58]]};
H.BLEND[N]={teapot11:['kettle11','jar11'],lamp11:['oilpot11','jar11'],dates11:['grapes11','dryBush11'],pomegranate11:['applePlain11','jar11'],
 fennec11:['rabbitToy11','duneRock11'],drum11:['tin11','jar11'],nazar11:['button11','jar11'],sandbottle11:['emptyBottle11','jar11'],cactus11:['aloe11','dryBush11'],
 carpet11:['tarp11','carpetStack11'],compass:['oilpot11','duneRock11'],amphora:['jar11','jar11']};

/* ================= 7. 連環小故事：躲進地毯堆的小駱駝 ================= */
const babyCamel=()=>T(0,0,.66,CAMELART.B.stand('#e0bd80','#c29a58',false)+`<path d="M-26,-60 Q-19,-55 -14,-62" fill="none" stroke="#c4473a" stroke-width="4.4"/><path d="M-26,-60 Q-19,-55 -14,-62" fill="none" stroke="#f0c040" stroke-width="1.4" stroke-dasharray="3 3"/><circle cx="-20" cy="-53" r="3" fill="#f5c842" stroke-width="1.3"/><path d="M-20,-50 v5 M-23,-50 v4 M-17,-50 v4" stroke="#c4473a" stroke-width="2" fill="none"/>`);
STORIES[N]={title:'躲進地毯堆的小駱駝',who:'商隊少年',
 giver:()=>act(0,0,1,{view:'fq',pose:'reach',hat:HAT_T,mood:2,skin:'#c98d5e',shirt:'#2f6f73',top:'long',bottom:'pants',pants:'#e8d9b4'}),
 target:()=>babyCamel()+carpetStack(3),tw:62,th:58,
 helper:()=>act(0,0,1,{view:'fq',pose:'hold',hat:HAT_T,mood:1,skin:'#a8683e',shirt:'#8a5a3a',top:'long',bottom:'pants',pants:'#d9c8a0',extra:`<path d="M-26,-50 L26,-36" fill="none" stroke="${OL}" stroke-width="6"/><path d="M-26,-50 L26,-36" fill="none" stroke="#a8703f" stroke-width="3.2"/><path d="M-24,-48 V-30 M26,-34 V-16" stroke="${OL}" stroke-width="1.4" fill="none"/><path d="M-32,-30 H-16 L-18,-16 H-30Z" fill="#c99a5b"/><path d="M18,-16 H34 L32,-2 H20Z" fill="#c99a5b"/>`}),hw:56,hh:64,
 ask:'商隊少年：我的小駱駝不見了！牠脖子上掛著紅流蘇和小銅鈴。',
 need:'小駱駝好像鑽進地毯堆裡睡著了，我搬不動上面的地毯⋯市集裡有個扛著扁擔的搬運工，力氣很大！',
 got:'搬運工：包在我身上，一下就搬開！',
 ok:'小駱駝出來了，叮叮噹噹跟著你走。快去告訴少年！'};

/* ================= 8. 冒險地圖（西南角沙漠）與過場 ================= */
HERE[N]=[-38,346];
/* 2026-11-18 沙漠收成一區（使用者畫綠圈）：上滑沙場、右下綠洲市集、左下金字塔；外圈畫沙地邊界，不加名牌（大區名「沙漠」只在遠看時出現，levels.js addRegion） */
H.mapHook(1.5,({P,ink,open})=>{if(!open(N))return '';
 let g=`<path d="M-168,338 Q-172,300 -130,290 Q-98,268 -56,284 Q-18,288 -14,320 Q-10,350 -16,378 Q-20,404 -60,406 Q-120,410 -156,398 Q-174,372 -168,338Z" fill="#ecd49a" stroke="#b38a4a" stroke-width="1.6" stroke-dasharray="5 4"/>`;
 g+=`<path d="M-160,330 q8,-5 16,0 q8,5 16,0 M-60,300 q8,-5 16,0 q8,5 16,0 M-150,392 q8,-5 16,0 q8,5 16,0 M-96,346 q8,-5 16,0 q8,5 16,0 M-30,394 q7,-4 14,0" fill="none" stroke="#c4a35c" stroke-width="1.2" stroke-linecap="round"/>`;
 return g});
H.mapHook(2,({P,ink,FN,open})=>{if(!open(N))return '';
 let g=H.mapRoute('M110,206 Q72,250 34,290 Q0,322 -30,344','road',ink);
 let m=`<g class="mnode" data-n="${N}"><g transform="translate(-38,362) scale(.75) translate(62,-354)"><g transform="translate(0,-18)"><circle cx="-62" cy="360" r="42" fill="transparent"/>`;
 m+=`<ellipse cx="-62" cy="372" rx="46" ry="26" fill="#ecd29c" stroke="${ink}" stroke-width="1.5"/>`;
 m+=P('M-104,376 Q-84,350 -62,364 Q-44,350 -22,372 Z','#f4dfa8',1.5)+`<path d="M-62,364 Q-44,350 -22,372 H-40Z" fill="#dcbc7e"/>`;
 m+=`<ellipse cx="-62" cy="378" rx="15" ry="7" fill="#79cdc6" stroke="${ink}" stroke-width="1.4"/>`;
 [[-82,370],[-44,372],[-62,392]].forEach(([x,y],i)=>m+=`<g transform="translate(${x},${y})"><path d="M0,0 Q${i%2?4:-4},-9 ${i%2?2:-2},-16" fill="none" stroke="#a8794a" stroke-width="2.6"/><path d="M${i%2?2:-2},-16 q-8,-4 -11,2 M${i%2?2:-2},-16 q8,-4 11,2 M${i%2?2:-2},-16 q-3,-8 1,-10" fill="none" stroke="#5f8e3e" stroke-width="2.4" stroke-linecap="round"/></g>`);
 m+=P('M-30,386 L-22,376 L-14,386Z','#c4573a',1.3)+P('M-98,386 L-90,378 L-82,386Z','#2f6f73',1.3);
 m+=`</g></g><g transform="translate(-38,388)"><rect x="-40" y="-10" width="80" height="18" rx="9" fill="#fffaf0" stroke="${ink}" stroke-width="1.8"/><text y="4" text-anchor="middle" font-size="11" fill="${ink}" font-family="${FN}">沙漠綠洲市集</text></g></g>`;
 return g+m});
RIDES.caravan11={text:'跟著商隊走進沙漠⋯',every:420,tick:k=>tone(k%2?262:233,.1,'triangle',.05),
 svg:()=>{const loop=(inner,dur)=>`<g class="rr11" style="--d:${dur}s"><g>${inner}</g><g transform="translate(-399,0)">${inner}</g></g>`;
  const dune=(y,c,h)=>`<path d="M0,${y} Q60,${y-h} 130,${y-h*.3} Q210,${y-h*1.1} 290,${y-h*.4} Q350,${y-h*.9} 399,${y} V600 H0Z" fill="${c}"/>`;
  let s=`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><style>.rr11{animation:rr11 var(--d) linear infinite}@keyframes rr11{to{transform:translateX(399px)}}.cw11{animation:cw11 .5s ease-in-out infinite alternate}@keyframes cw11{to{transform:translateY(-3px)}}</style>`;
  s+=`<g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect width="400" height="600" fill="#f8e6bd" stroke="none"/><circle cx="300" cy="120" r="46" fill="#fdf0c0" stroke="none"/><circle cx="300" cy="120" r="70" fill="#fbeab0" stroke="none" opacity=".4"/>`;
  s+=loop(`<g stroke="none"><path d="M60,300 L112,232 L164,300Z" fill="#e3c68a"/><path d="M112,232 L164,300 H128Z" fill="#d3b274"/></g>`+dune(318,'#efd7a0',22),60);
  s+=loop(dune(372,'#e8cb92',30)+`<path d="M0,372 Q60,342 130,364 Q210,336 290,360 Q350,342 399,372" fill="none" stroke="#cfa860" stroke-width="1.4"/>`,34);
  s+=loop(dune(430,'#e4c78a',38)+[40,200,330].map(x=>`<g transform="translate(${x},424)">${dryBush()}</g>`).join(''),20);
  s+=`<rect y="470" width="400" height="130" fill="#ecd29c" stroke="none"/><path d="M0,470 Q100,454 200,468 T400,468" fill="none" stroke="#cfa860" stroke-width="2"/>`;
  s+=loop(`<path d="M10,520 q14,-5 28,0 q14,5 28,0 M150,540 q14,-5 28,0 M270,516 q14,-5 28,0 q14,5 28,0 M90,566 q14,-5 28,0" fill="none" stroke="#d9bb7e" stroke-width="2"/>`,8);
  [[70,498,1,'#d6aa66'],[196,486,.92,'#c99a58'],[316,496,1,'#dcb878']].forEach(([x,y,sc,c],i)=>{s+=`<g transform="translate(${x},${y}) scale(${sc},${sc})"><g class="cw11" style="animation-delay:-${i*.17}s">${CAMEL.stand(c,'#b98a4a',true)}</g></g>`});
  s+=`<g transform="translate(250,536) scale(-1.1,1.1)" class="cw11">${kid({view:'side',pose:'walk',hat:HAT_T,skin:'#c98d5e',shirt:'#2f6f73',top:'long',bottom:'pants',pants:'#e8d9b4'})}</g>`;
  return s+`</g></svg>`}};

/* ================= 9. 場景彩蛋：點綠洲的水 ================= */
H.TAPHOOKS[N]=(x,y)=>{if(!inPond(x,y))return false;
 H.burst(x,y);H.toast('💧 綠洲的水，涼涼的！',1400);tone(660,.12,'sine',.05);tone(880,.1,'sine',.04,.1);return true};
})();

/* ================= 出口：第 1 關西南沙灘路口的駱駝商隊（2026-11-17 引擎 11-17b「找路發現新關卡」） =================
   levels.js 這一關有 find:{after:10,from:1,hint:[…]}：第 10 關拿到 2 顆星之後，第 1 關西南沙灘路口出現商隊；
   點領隊 → 「要跟商隊出發嗎？」→ 出發才算發現（core.js askExit）。這個檔案在第 1 關載入時會一起載入（ensureFull）。
   RESERVE 只在這個檔案載入時才佔位置，所以還不能發現之前，第 1 關完全不變。 */
(function(){
const H=window.TH;if(!H)return;const N=11;const {T,f,OL,act}=H;
const CAR={x:215,y:1650};
(H.RESERVE[1]||(H.RESERVE[1]=[])).push([CAR.x-10,CAR.y+6,250,126]);
/* 站著的駱駝（面朝左，腳在 y=0） */
const camel=(c,c2,bag=true)=>CAMELART.G.stand(undefined,undefined,bag); /* 2026-11-18 換成 G 修長盛裝 */
/* 趴著休息的駱駝 */
const camelRest=(c,c2)=>CAMELART.B.rest(c,c2);
/* 條紋遮陽篷＋地毯＋香料罐 */
const awning=()=>`<path d="M-40,0 V-44 M40,0 V-44" fill="none" stroke-width="2.6"/><path d="M-46,-44 L46,-44 L40,-60 L-40,-60Z" fill="#f3e2b8"/>`+
 [-34,-14,6,26].map(x=>`<path d="M${x},-60 L${x+10},-60 L${x+12},-44 L${x+2},-44Z" fill="#c4473a" stroke="none"/>`).join('')+`<path d="M-46,-44 L46,-44 L40,-60 L-40,-60Z" fill="none"/>`+
 `<path d="M-46,-44 q7,6 14,0 q7,6 14,0 q7,6 14,0 q7,6 14,0 q7,6 14,0 q7,6 14,0 q6,5 12,0" fill="#f3e2b8"/>`+
 `<path d="M-38,4 L38,4 L44,14 L-44,14Z" fill="#a8461f"/><path d="M-34,9 H34" fill="none" stroke="#f5c842" stroke-width="1.6" stroke-dasharray="4 3"/>`+
 `<path d="M-24,4 q-6,-12 2,-16 h6 q8,4 2,16Z" fill="#2f6f73"/><path d="M-6,4 q-4,-9 2,-12 h6 q6,3 2,12Z" fill="#d89a3a"/><path d="M12,4 q-5,-10 2,-13 h5 q7,3 2,13Z" fill="#7a4fa0"/><ellipse cx="28" cy="2" rx="8" ry="3" fill="#e0a030"/><path d="M22,1 q6,-6 12,0" fill="#c4473a"/>`;
const turban=`<path d="M-15,-45 Q-17,-60 0,-62 Q17,-60 15,-45 Q0,-50 -15,-45Z" fill="#f1e6cc"/><path d="M-13,-53 Q0,-60 13,-52 M-14,-48 Q0,-55 14,-47" fill="none" stroke="#c9b48a" stroke-width="1.2"/><circle cx="0" cy="-56" r="2.4" fill="#c4473a" stroke-width="1"/>`;
let lead='';const leader=()=>lead||(lead=act(0,0,1,{view:'fq',pose:'stand',hat:-1,hs:3,skin:'#c98d5e',hair:'#2b2420',shirt:'#2f6f73',pants:'#8a5a3a',beard:true,mood:2,top:'long',bottom:'pants'})+T(0,0,1,turban));
const svg=found=>T(-56,-20,1,awning())+T(-104,2,1,camelRest())+T(74,6,1,camel())+
/* 2026-11-18 使用者：入口角色頭上從「？」改成「…」（和一般路人一樣，增加探索難度）；圓點半徑 1.75，不會被當成路人提示（DOTSIG） */
 T(10,10,1,(found?'':`<g class="qbob">${H.bubble(14,-74,'dots').replace(/r="1\.7"/g,'r="1.75"')}</g>`)+leader()); /* 領隊頭上「…」（「有事想問玩家」，和第 5 關望遠鏡小孩一樣；故事角色才用驚嘆號） */
const pv=()=>`<svg viewBox="0 0 220 110" width="220" height="110" style="display:block"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect x="0" y="0" width="220" height="110" rx="10" fill="#f6dfa8" stroke="none"/><circle cx="176" cy="30" r="14" fill="#f5c842" stroke="none"/><path d="M0,76 Q50,56 100,74 T220,70 V110 H0Z" fill="#e8c47a"/><path d="M0,92 Q60,80 120,92 T220,90 V110 H0Z" fill="#d9ad5f"/><g transform="translate(110,92) scale(.75)">${camel()}</g><g transform="translate(60,92) scale(.55)">${camel('#c99a5b','#a87a3c',false)}</g></g></svg>`;
H.EXITS[N]={x:CAR.x-10,y:CAR.y,w:240,h:96,svg,ask:{pv,title:'要跟商隊出發嗎？',
 text:'商隊領隊：我們要回西南邊的沙漠綠洲了。<br>綠洲市集可熱鬧了，要一起來嗎？',again:'商隊領隊：又要去綠洲市集嗎？<br>駱駝都準備好了！',
 go:'🐪 跟商隊出發',wait:'之後再說',waitMsg:'商隊領隊：好，我們會在這裡休息一陣子，準備好再來找我！'}};
})();
