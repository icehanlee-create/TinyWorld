/* 奇幻小鎮大搜查．共用圖庫 art.js
   人物（大頭娃娃、穿著 OUTFITS）、動物、樹木、房子、道具、第 1 關物件圖 ART／DECOY，以及佈景圖鑑 KIND。
   index.html 依序載入 core.js → art.js → levels.js，再呼叫 boot()；這三個檔案共用同一層（全域）變數，
   所以這裡可以直接用 core.js 的小工具（T、f、r、sr、pk、limb、OL⋯）。
   關卡檔（level{n}.js）不要直接用這裡的名字，一律從 window.TH 取（const {kid,act,house}=TH）。
   改這個檔案會影響所有關卡：改完要把全部關卡重測一次。 */
/* ================= palette ================= */
const SKIN=['#f6d2b0','#eebf98','#e2ae86','#c98d64','#a8724f'];
const HAIR=['#3a2a22','#7a4a2a','#c9884a','#e8c46a','#2b2420','#b0503a','#9a9a9a','#e8a0a0'];
const SHIRT=['#b85a38','#6f9a92','#d4ac52','#86925a','#e3a89e','#6b7790','#d98c46','#f1ead8','#aab27a','#c97c6a','#8c6a52','#5f6b4a'];
const PANTS=['#5a4a3a','#4a5a78','#7a6a50','#3a3a3a','#8a5a3a'];
const WALL=['#eadbb4','#e6c4b2','#d9d0b0','#dcb894','#ced3b4','#efe4cc','#c6ccc2'];
const ROOF=['#76804a','#b85a35','#6a7488','#7f5a40','#d98a42','#5d6640','#a85640','#6a9c94'];

/* ================= characters ================= */
const HAIRS=[
 c=>`<path d="M-13,-35 Q-13,-49 0,-49 Q13,-49 13,-35 Q7,-41 0,-40 Q-7,-41 -13,-35Z" fill="${c}"/>`,
 c=>`<path d="M-13,-35 Q-14,-42 -11,-46 L-7,-45 L-5,-52 L-1,-47 L3,-53 L6,-46 L10,-48 L11,-45 Q14,-41 13,-35 Q7,-41 0,-40 Q-7,-41 -13,-35Z" fill="${c}"/>`, /* 2026-11-11 刺刺頭改成左右對稱、瀏海接回臉的弧線 */
 c=>`<path d="M-13,-34 Q-12,-49 0,-49 Q12,-49 13,-34 Q10,-40 6,-41 Q0,-37 -6,-41 Q-10,-39 -13,-34Z" fill="${c}"/>`,
 c=>`<circle cx="0" cy="-50" r="6" fill="${c}"/><path d="M-13,-35 Q-13,-48 0,-48 Q13,-48 13,-35 Q6,-41 -13,-35Z" fill="${c}"/>`,
 c=>`<circle cx="-8" cy="-44" r="6" fill="${c}"/><circle cx="8" cy="-44" r="6" fill="${c}"/><circle cx="0" cy="-48" r="6.5" fill="${c}"/>`
];
const HATS=[
 ()=>{const c=pk(['#c4572f','#6fa8a0','#e0b44a','#8f9d58']);return `<path d="M-13,-40 Q-12,-55 0,-55 Q12,-55 13,-40Z" fill="${c}"/><rect x="-14" y="-43" width="28" height="6" rx="3" fill="#fbf6ea"/><circle cx="0" cy="-57" r="3.5" fill="#fbf6ea"/>`},
 ()=>`<ellipse cx="0" cy="-43" rx="21" ry="4.5" fill="#e8c46a"/><path d="M-9,-43 Q-9,-53 0,-53 Q9,-53 9,-43Z" fill="#e8c46a"/><path d="M-9,-45 L9,-45" stroke="#c4572f" stroke-width="2.5"/>`,
 ()=>{const c=pk(['#c4572f','#6f7f9a','#8f9d58']);return `<path d="M-13,-41 Q0,-45 13,-41 L4,-67 Q2,-71 -1,-67Z" fill="${c}"/>`},
 ()=>{const c=pk(['#5f6b3a','#7a5235']);return `<ellipse cx="0" cy="-43" rx="19" ry="4" fill="${c}"/><path d="M-9,-44 L-2,-66 Q2,-70 6,-64 L3,-62 L9,-44Z" fill="${c}"/>`},
 ()=>{const c=pk(['#6fa8a0','#c4572f','#e0b44a']);return `<path d="M-12,-42 Q-12,-53 0,-53 Q12,-53 12,-42Z" fill="${c}"/><path d="M4,-43 L19,-42 Q19,-39 4,-40" fill="${c}"/>`},
 ()=>`<path d="M0,-47 L-8,-52 L-8,-42Z M0,-47 L8,-52 L8,-42Z" fill="#f0a8a0"/><circle cx="0" cy="-47" r="2.5" fill="#f0a8a0"/>`,
 /* 6：遮陽探險盔（探險隊用，不會被隨機抽到） */
 ()=>`<ellipse cx="0" cy="-42" rx="18" ry="4" fill="#cdbb8a"/><path d="M-12,-42 Q-13,-59 0,-59 Q13,-59 12,-42Z" fill="#ddcc9c"/><path d="M-12,-45.5 H12" fill="none" stroke="#8a6a3a" stroke-width="2.6"/><circle cx="0" cy="-59" r="1.8" fill="#cdbb8a"/><path d="M-6,-55 Q0,-57 6,-55" fill="none" stroke="#bca870" stroke-width="1"/>`
];
function face(m){
 const eyes=m===3?`<path d="M-7,-33 Q-4.5,-36 -2,-33 M2,-33 Q4.5,-36 7,-33" fill="none" stroke-width="1.5"/>`:`<g stroke="none"><ellipse cx="-4.5" cy="-33" rx="1.8" ry="2.3" fill="${OL}"/><ellipse cx="4.5" cy="-33" rx="1.8" ry="2.3" fill="${OL}"/><circle cx="-3.9" cy="-33.9" r=".7" fill="#fff"/><circle cx="5.1" cy="-33.9" r=".7" fill="#fff"/></g>`;
 const mouth=m===1?`<ellipse cx="0" cy="-27" rx="2" ry="1.6" fill="#b5403a" stroke-width="1.2"/>`:m===2?`<path d="M-2.5,-28 L2.5,-28" fill="none" stroke-width="1.4"/>`:`<path d="M-2.2,-28.5 Q0,-26 2.2,-28.5" fill="none" stroke-width="1.4"/>`;
 return eyes+`<g stroke="none" opacity=".7"><ellipse cx="-8.5" cy="-28.5" rx="2.6" ry="1.5" fill="#f08a80"/><ellipse cx="8.5" cy="-28.5" rx="2.6" ry="1.5" fill="#f08a80"/></g>`+mouth;
}
const HSC=18/13,headG=inner=>`<g transform="translate(0,-34) scale(${f(HSC)}) translate(0,35)" stroke-width="${f(2/HSC)}">${inner}</g>`;
const BODY=c=>`<path d="M-8,-5 Q-9,-17 0,-18 Q9,-17 8,-5 Q0,-2 -8,-5Z" fill="${c}"/>`;
/* ---------- 服裝：依場景換穿著（OUTFITS[關卡]，例如海島清涼、雪山保暖） ---------- */
const OUTFITS={};let DR=null; /* 依場景換穿著：各關檔案自己設定 OUTFITS[關卡] */
function outfitOf(o){if(o._of)return o;const F=OUTFITS[SCN];o={...o,_of:1};return F&&!o.plain?F(o):o}
function dressStart(o,sk,sh,pa){DR={top:o.top,bottom:o.bottom,sk,sh,pa,aloha:o.aloha,scarf:o.scarf,mitts:o.mitts,boots:o.boots,kim:o.kim,obi:o.obi,pat:o.pat}}
/* 和服（top:'kimono'；kim＝樣式 'A' 振袖／'B' 浴衣／'C' 羽織、obi＝腰帶色、pat＝花紋色；腳只露出白足袋＋木屐） */
const KIMSLV={A:[4.2,7.5],B:[3.4,4.6],C:[3.6,5]};
function kimPat(c,st,pat){if(!pat)return '';if(st==='B')return [-5,-1,3,7].map(x=>`<path d="M${x},-17 V-2" fill="none" stroke="${pat}" stroke-width="1.3" opacity=".75"/>`).join('');
 return [[-5,-15],[4,-14.5],[-6,-5],[5,-4],[0,-3]].map(([x,y])=>`<g transform="translate(${x},${y})" stroke="none" fill="${pat}"><circle cx="0" cy="-1.2" r="1"/><circle cx="1.1" cy="-.4" r="1"/><circle cx=".7" cy="1" r="1"/><circle cx="-.7" cy="1" r="1"/><circle cx="-1.1" cy="-.4" r="1"/></g>`).join('')}
const ptsOf=d=>{const n=d.match(/-?[\d.]+/g).map(Number),p=[];for(let i=0;i+1<n.length;i+=2)p.push([n[i],n[i+1]]);return p};
const segA=(d,t)=>{const [a,b]=ptsOf(d);return `M${a[0]},${a[1]} L${f(a[0]+(b[0]-a[0])*t)},${f(a[1]+(b[1]-a[1])*t)}`};
const segZ=(d,t)=>{const p=ptsOf(d),a=p[p.length-2],b=p[p.length-1];return `M${f(b[0]+(a[0]-b[0])*t)},${f(b[1]+(a[1]-b[1])*t)} L${b[0]},${b[1]}`};
function armLimb(d,c,w=3.2){const T=DR&&DR.top;
 if(T==='tank'||T==='bare')return limb(d,DR.sk,w);
 if(T==='tee')return limb(d,DR.sk,w)+limb(segA(d,.42),c,w+.7);
 if(T==='kimono'){const p=ptsOf(d),a=p[0],e=p[p.length-1],t=.62,m=[a[0]+(e[0]-a[0])*t,a[1]+(e[1]-a[1])*t],[rx,ry]=KIMSLV[DR.kim]||KIMSLV.A,cc=DR.kim==='C'?'#4a4f5c':c;
  return limb(d,DR.sk,w)+`<path d="M${f(m[0]-rx)},${f(m[1]-1)} Q${f(m[0]-rx)},${f(m[1]+ry)} ${f(m[0])},${f(m[1]+ry)} Q${f(m[0]+rx)},${f(m[1]+ry)} ${f(m[0]+rx)},${f(m[1]-1)}Z" fill="${cc}" stroke-width="1.3"/>`+limb(segA(d,t),cc,w+2.4)}
 if(T==='coat'){const p=ptsOf(d),e=p[p.length-1];return limb(d,c,w+1.2)+`<circle cx="${e[0]}" cy="${e[1]}" r="2.6" fill="${DR.mitts||'#d8413a'}" stroke-width="1.2"/>`}
 return limb(d,c,w)}
function legLimb(d,c,w=3.2){const B=DR&&DR.bottom;
 if(B==='kimono')return limb(segZ(d,.32),'#fbf6ea',w)+limb(segZ(d,.08),'#6b4a32',w+.8);
 if(B==='shorts'||B==='trunks'){const p=ptsOf(d);return limb(d,DR.sk,w)+limb(p.length>2?`M${p[0][0]},${p[0][1]} L${p[1][0]},${p[1][1]}`:segA(d,.5),c,w+.5)}
 if(DR&&DR.boots)return limb(d,c,w)+limb(segZ(d,.45),DR.boots,w+.6);
 return limb(d,c,w)}
function legRect(x,c){const B=DR&&DR.bottom;
 if(B==='kimono')return `<rect x="${x+.3}" y="-3.2" width="4.9" height="3" rx="1.3" fill="#fbf6ea"/><rect x="${x-.2}" y="-.6" width="5.9" height="1.8" rx=".6" fill="#6b4a32" stroke-width="1"/>`;
 if(B==='shorts'||B==='trunks')return `<rect x="${x}" y="-7" width="5.5" height="7" rx="2.7" fill="${DR.sk}"/><rect x="${x}" y="-7" width="5.5" height="3.9" rx="1.6" fill="${c}"/>`;
 let s=`<rect x="${x}" y="-7" width="5.5" height="7" rx="2.7" fill="${c}"/>`;if(DR&&DR.boots)s+=`<rect x="${x-.3}" y="-3.4" width="6.1" height="3.6" rx="1.6" fill="${DR.boots}"/>`;return s}
function bodyD(c){const T=DR&&DR.top;
 if(T==='bare')return BODY(DR.sk)+`<path d="M-8,-5 Q0,-2 8,-5 L8.3,-8.5 Q0,-6 -8.3,-8.5Z" fill="${DR.pa}"/>`;
 if(T==='tank')return BODY(DR.sk)+`<path d="M-6.5,-5 Q-7.5,-15 -3.5,-17.3 L3.5,-17.3 Q7.5,-15 6.5,-5 Q0,-2.5 -6.5,-5Z" fill="${c}"/>`;
 if(T==='kimono'){const st=DR.kim||'A',ob=DR.obi||'#f0c040',hem=st==='A'?-.2:-1.4;
  let g=`<path d="M-8.6,-16.8 Q0,-19.2 8.6,-16.8 L9.8,${hem} Q0,${hem+2.2} -9.8,${hem}Z" fill="${c}"/>`+kimPat(c,st,DR.pat)+
   `<path d="M-4.6,-18.2 L.6,-10.6 L4.6,-18.2" fill="none" stroke="#fbf6ea" stroke-width="2.2"/><path d="M-4.6,-18.2 L.6,-10.6 L4.6,-18.2 M.6,-10.6 L-2.4,${f(hem+.6)}" fill="none" stroke-width="1.1"/>`;
  g+=st==='B'?`<rect x="-9.2" y="-11.4" width="18.4" height="2.8" rx=".8" fill="${ob}" stroke-width="1.2"/>`:`<rect x="-9.3" y="-12.6" width="18.6" height="4.4" rx="1" fill="${ob}" stroke-width="1.3"/><path d="M-9,-10.4 H9" fill="none" stroke="#d8413a" stroke-width="1"/>`;
  if(st==='C')g+=`<path d="M-9,-17 Q-10.4,-9 -10,-6.5 L-4.8,-6.5 L-3.6,-17.6Z M9,-17 Q10.4,-9 10,-6.5 L4.8,-6.5 L3.6,-17.6Z" fill="#4a4f5c" stroke-width="1.2"/><circle cx="-3.5" cy="-12" r="1" fill="#fbf6ea" stroke="none"/><circle cx="3.5" cy="-12" r="1" fill="#fbf6ea" stroke="none"/>`;
  return g}
 if(T==='coat')return `<path d="M-10,-4 Q-11.5,-18 0,-19.5 Q11.5,-18 10,-4 Q0,-1 -10,-4Z" fill="${c}"/><path d="M-9,-10 Q0,-8 9,-10 M0,-18 V-3" fill="none" stroke="${shade(c,-.25)}" stroke-width="1.1"/>`+(DR.scarf?`<path d="M-7.5,-19.5 Q0,-15.5 7.5,-19.5 L7.5,-16.5 Q0,-12.5 -7.5,-16.5Z" fill="${DR.scarf}" stroke-width="1.3"/><path d="M3,-15.5 l1.5,8 h3.5 l-2,-8.5" fill="${DR.scarf}" stroke-width="1.2"/>`:'');
 let s=BODY(c);if(T==='tee'&&DR.aloha)s+=[[-4,-12],[3,-14],[1,-8],[-3,-7],[5,-9]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.3" fill="${DR.aloha}" stroke="none"/>`).join('');return s}
function chibi(o={}){o=outfitOf(o);
 const sk=o.skin||pk(SKIN),hr=o.hair||pk(HAIR),sh=o.shirt||pk(SHIRT),pa=o.pants||pk(PANTS);dressStart(o,sk,sh,pa);
 const hs=o.hs??ri(0,4),hat=o.hat??(r()<.4?ri(0,5):-1),arm=o.arm??ri(0,3);
 let g='',after='';
 if(hs===2)g+=headG(`<path d="M-13,-38 Q-15,-16 -8,-19 L8,-19 Q15,-16 13,-38Z" fill="${hr}"/>`);
 if(!o.sit)g+=legRect(-6.5,pa)+legRect(1,pa);
 else g+=legLimb('M-3,-5 L7,-4 L8,0',pa,4);
 if(arm===1){g+=armLimb('M-6,-14 L-10,-8',sh);after=armLimb('M6,-14 L21,-26',sh)}
 else if(arm===2)after=armLimb('M-6,-14 L-21,-26',sh)+armLimb('M6,-14 L21,-26',sh);
 else if(arm===3&&o.rod)g+=armLimb('M6,-14 L12,-11',sh);
 else g+=armLimb('M-6,-14 L-10,-8',sh)+armLimb('M6,-14 L10,-8',sh);
 g+=bodyD(sh);
 let h=`<circle cy="-35" r="13" fill="${sk}"/>`+HAIRS[hs](hr)+face(o.mood??ri(0,3));
 if(o.beard)h+=`<path d="M-9,-29 Q0,-12 9,-29 Q4,-26 0,-28 Q-4,-26 -9,-29Z" fill="#fbf6ea"/>`;
 if(hat>=0)h+=HATS[hat]();
 return g+headG(h)+after;
}
/* ---------- side / back view characters ---------- */
const SH_SIDE0=c=>`<path d="M-13,-31 Q-15,-49 0,-49 Q13,-49 13,-39 Q7,-43 2,-40 Q-1,-33 -5,-29 Q-11,-27 -13,-31Z" fill="${c}"/>`;
const SH_SIDE=[SH_SIDE0,
 c=>`<path d="M-13,-32 L-15,-42 L-9,-44 L-8,-51 L-1,-47 L4,-52 L7,-45 L13,-41 Q6,-42 2,-39 Q-2,-31 -6,-28 Q-12,-27 -13,-32Z" fill="${c}"/>`,
 c=>`<path d="M-13,-34 Q-15,-49 0,-49 Q13,-49 13,-38 Q7,-42 3,-39 Q0,-30 -2,-18 L-11,-18 Q-15,-24 -13,-34Z" fill="${c}"/>`,
 c=>`<circle cx="-9" cy="-47" r="6" fill="${c}"/>`+SH_SIDE0(c),
 c=>`<circle cx="-11" cy="-33" r="5" fill="${c}"/><circle cx="-9" cy="-42" r="6" fill="${c}"/><circle cx="-2" cy="-47" r="6.5" fill="${c}"/><circle cx="6" cy="-46" r="5.5" fill="${c}"/>`];
const SH_BACK0=c=>`<path d="M-13,-31 Q-14,-49 0,-49 Q14,-49 13,-31 Q0,-26 -13,-31Z" fill="${c}"/>`;
const SH_BACK=[SH_BACK0,
 c=>`<path d="M-13,-31 L-13,-42 L-7,-45 L-4,-51 L1,-46 L6,-51 L8,-44 L13,-41 L13,-31 Q0,-26 -13,-31Z" fill="${c}"/>`,
 c=>`<path d="M-13,-34 Q-14,-49 0,-49 Q14,-49 13,-34 L12,-17 L-12,-17Z" fill="${c}"/>`,
 c=>`<circle cx="0" cy="-50" r="6" fill="${c}"/>`+SH_BACK0(c),
 c=>`<circle cx="-8" cy="-34" r="6" fill="${c}"/><circle cx="8" cy="-34" r="6" fill="${c}"/><circle cx="-7" cy="-44" r="6.5" fill="${c}"/><circle cx="7" cy="-44" r="6.5" fill="${c}"/><circle cx="0" cy="-39" r="7" fill="${c}"/>`];
const ARMS={side:{stand:[[-3,-8],[3,-8]],walk:[[-6,-9],[6,-9]],run:[[-8,-11],[12,-20]],reach:[[10,-16],[14,-18]],up:[[-3,-8],[21,-25]],up2:[[19,-27],[21,-25]],hold:[[11,-17],[13,-18]],low:[[10,-8],[13,-8]],sit:[[7,-10],[10,-11]],crouch:[[9,-10],[13,-11]]},
 back:{stand:[[-10,-8],[10,-8]],walk:[[-10,-9],[10,-9]],up2:[[-21,-26],[21,-26]],reach:[[-9,-12],[9,-12]],sit:[[-9,-9],[9,-9]],up:[[-10,-8],[21,-26]]}};
const faceSide=closed=>(closed?`<path d="M4.5,-34 Q6.5,-36.5 8.5,-34" fill="none" stroke-width="1.5"/>`:`<ellipse cx="6.5" cy="-34" rx="1.7" ry="2.2" fill="${OL}" stroke="none"/><circle cx="7.1" cy="-34.9" r=".7" fill="#fff" stroke="none"/>`)+`<ellipse cx="8" cy="-29" rx="2.4" ry="1.4" fill="#f08a80" stroke="none" opacity=".7"/><path d="M10.5,-28.5 Q12,-27.5 12.8,-29.2" fill="none" stroke-width="1.3"/>`;
function kid(o={}){o=outfitOf(o);
 const L={sk:o.skin||pk(SKIN),hr:o.hair||pk(HAIR),sh:o.shirt||pk(SHIRT),pa:o.pants||pk(PANTS),hs:o.hs??ri(0,4),hat:o.hat??(r()<.33?ri(0,5):-1)};
 const v=o.view||'side',p=o.pose||'stand';
 if(v==='fq'||v==='bq')return kidQ(o,L,v,p);
 if(v==='front')return chibi({skin:L.sk,hair:L.hr,shirt:L.sh,pants:L.pa,hs:L.hs,hat:L.hat,arm:o.arm??0,sit:p==='sit',beard:o.beard,mood:o.mood,top:o.top,bottom:o.bottom,aloha:o.aloha,scarf:o.scarf,mitts:o.mitts,boots:o.boots,kim:o.kim,obi:o.obi,pat:o.pat,_of:1})+(o.extra||'');
 dressStart(o,L.sk,L.sh,L.pa);
 const legs=o.legs||p,cy=p==='crouch'?5:0,A=ARMS[v][p]||ARMS[v].stand;
 const s0=v==='side'?[-1,-14]:[-6,-14],s1=v==='side'?[1,-14]:[6,-14];
 const arm=(a,b)=>armLimb(`M${a[0]},${a[1]+cy} L${b[0]},${b[1]+cy}`,L.sh);
 let g='';
 g+=arm(s0,A[0]);if(v!=='side')g+=arm(s1,A[1]);
 if(legs==='sit'){if(v==='side')g+=legLimb('M-2,-5 L8,-4 L9,0',L.pa,4)}
 else if(legs==='walk'||legs==='run')g+=legLimb('M-1,-6 L-5,0',L.pa,4.2)+legLimb('M1,-6 L5,0',L.pa,4.2);
 else if(legs==='crouch')g+=legLimb('M-3,-1 L6,-4 L5,0',L.pa,4.2);
 else g+=legRect(v==='side'?-5:-6.5,L.pa)+legRect(v==='side'?0:1,L.pa);
 let u=bodyD(L.sh);
 if(v==='side')u+=armLimb(`M${s1[0]},${s1[1]} L${A[1][0]},${A[1][1]}`,L.sh);
 let h=`<circle cy="-35" r="13" fill="${L.sk}"/>`;
 if(v==='side'){h+=SH_SIDE[L.hs](L.hr)+`<ellipse cx="-2" cy="-33" rx="2.4" ry="3" fill="${L.sk}"/>`+faceSide(o.eyes==='closed');
  if(o.beard)h+=`<path d="M1,-31 Q8,-12 14,-29 Q9,-25 1,-31Z" fill="#fbf6ea"/>`;}
 else h+=`<ellipse cx="-13" cy="-33" rx="2.2" ry="3" fill="${L.sk}"/><ellipse cx="13" cy="-33" rx="2.2" ry="3" fill="${L.sk}"/>`+SH_BACK[L.hs](L.hr);
 if(L.hat>=0)h+=HATS[L.hat]();
 u+=headG(h);
 g+=cy?`<g transform="translate(0,${cy})">${u}</g>`:u;
 return g+(o.extra||'');
}
/* 斜向四方向：fq＝正面偏右（翻轉就是正面偏左），bq＝背面偏右（翻轉就是背面偏左） */
function kidQ(o,L,v,p){dressStart(o,L.sk,L.sh,L.pa);const front=v==='fq',legs=o.legs||p,cy=p==='crouch'?5:0;
 const A=front?(ARMS.side[p]||ARMS.side.stand):(ARMS.back[p]||ARMS.back.stand);
 const s0=front?[-5,-14]:[-6,-14],s1=front?[5,-14]:[6,-14];
 const arm=(a,b)=>armLimb(`M${a[0]},${a[1]+cy} L${b[0]},${b[1]+cy}`,L.sh);
 let g='';
 if(front)g+=arm(s1,A[1]);else g+=arm(s0,A[0])+arm(s1,A[1]); /* 斜前方：遠的手（畫面右邊）先畫，藏在身體後面 */
 if(legs==='sit')g+=legLimb('M-2,-5 L7,-4 L8,0',L.pa,4);
 else if(legs==='walk'||legs==='run')g+=legLimb('M-1,-6 L-5,0',L.pa,4.2)+legLimb('M2,-6 L5,0',L.pa,4.2);
 else if(legs==='crouch')g+=legLimb('M-3,-1 L6,-4 L5,0',L.pa,4.2);
 else g+=legRect(-6,L.pa)+legRect(0.8,L.pa);
 let u=bodyD(L.sh);
 if(front)u+=armLimb(`M${s0[0]},${s0[1]} L${A[0][0]-4},${A[0][1]}`,L.sh); /* 近的手（畫面左邊）畫在身體前面 */
 let h=`<circle cy="-35" r="13" fill="${L.sk}"/>`;
 if(front){h+=`<ellipse cx="-12.5" cy="-33" rx="2.2" ry="3" fill="${L.sk}"/>`+`<g transform="translate(-.8,-35) scale(1.07,1.04) translate(0,35)">${HAIRS[L.hs](L.hr)}</g>`+`<g transform="translate(3.2,0) scale(.84,1)">${face(o.eyes==='closed'?3:(o.mood??ri(0,3)))}</g>`;
  if(o.beard)h+=`<path d="M-5,-29 Q3,-12 12,-29 Q7,-26 3,-28 Q-1,-26 -5,-29Z" fill="#fbf6ea"/>`}
 else h+=`<ellipse cx="9.5" cy="-30" rx="4" ry="5" fill="${L.sk}"/><ellipse cx="12.6" cy="-33" rx="2.2" ry="3" fill="${L.sk}"/>`+`<g transform="translate(-.9,-35) scale(1.07,1.04) translate(0,35)">${SH_BACK[L.hs](L.hr)}</g>`;
 if(L.hat>=0)h+=`<g transform="translate(-1,0)">${HATS[L.hat]()}</g>`;
 u+=headG(h);
 g+=cy?`<g transform="translate(0,${cy})">${u}</g>`:u;
 return g+(o.extra||'')}
/* 路人方向：正面、正面偏、側面、背面偏、背面混著用 */
const pickView=()=>{const x=r();return x<.1?'front':x<.32?'fq':x<.62?'side':x<.8?'bq':'back'};
const walkPose=v=>v==='front'?'stand':pk(['walk','stand','walk','reach','stand']);
const wrapAn=(a,inner,force)=>{if(!force&&r()>=.75)return inner;const[d0,d1]=DUR[a];return `<g class="an a-${a}" style="--d:${f(sr(d0,d1))}s;animation-delay:-${f(sr(0,4))}s">${inner}</g>`};
/* 2026-11-11 人物動作依活動：step 小碎步、nod 點頭、work 用力做事、bend 彎腰、groove 大搖擺、dance 跳舞、hop／cheer 跳、lean 輕晃、false 不動。沒指定（true）時隨機輕晃或點頭；舊的 bob／sway 當成輕晃 */
const PERSON_AN={bob:'lean',sway:'lean',float:'lean'};
function act(x,y,dir,o={},anim){let a=anim===true?pk(['lean','nod','lean','nod','lean','lean']):anim;if(a&&PERSON_AN[a])a=PERSON_AN[a];let inner=kid(o);if(a)inner=wrapAn(a,inner,o.force);return T(x,y,o.s||1,inner,dir<0)}
const heart=(x,y,c='#d8413a')=>`<path transform="translate(${x},${y})" d="M0,4 C-8,-2 -5,-9 0,-5 C5,-9 8,-2 0,4Z" fill="${c}" stroke-width="1.3"/>`;
const noteM=(x,y)=>`<g transform="translate(${x},${y})"><path d="M2,0 V-11 L9,-13 V-2" fill="none" stroke-width="1.6"/><ellipse cx="0" cy="0" rx="2.8" ry="2.1" fill="${OL}" stroke="none"/><ellipse cx="7" cy="-2" rx="2.8" ry="2.1" fill="${OL}" stroke="none"/></g>`;
function bubble(x,y,c){let g=`<g transform="translate(${x},${y})"><path d="M-14,-10 h28 q4,0 4,4 v10 q0,4 -4,4 h-14 l-6,6 v-6 h-8 q-4,0 -4,-4 v-10 q0,-4 4,-4z" fill="#fbf6ea" stroke-width="1.6"/>`;
 if(c==='heart')g+=heart(0,-2);else if(c==='note')g+=noteM(-3,4);else g+=`<g fill="${OL}" stroke="none"><circle cx="-6" cy="-1" r="1.7"/><circle cx="0" cy="-1" r="1.7"/><circle cx="6" cy="-1" r="1.7"/></g>`;
 return g+'</g>'}
const pinkFlowers=(x,y)=>[[0,0],[9,-5],[15,2]].map(([dx,dy])=>{const c=pk(['#f0a8a0','#c58be0','#fbf6ea','#e86a6a']);return `<g transform="translate(${x+dx},${y+dy})"><path d="M0,0 V-12" fill="none" stroke="#5f8f3f" stroke-width="1.6"/>${[0,1,2,3,4].map(i=>{const a=i*1.2566;return `<circle cx="${f(Math.cos(a)*3.3)}" cy="${f(-12+Math.sin(a)*3.3)}" r="2.6" fill="${c}" stroke-width="1"/>`}).join('')}<circle cy="-12" r="1.8" fill="#f5c842" stroke-width=".8"/></g>`}).join('');
const VIG={
 throwCatch:{w:120,h:84,fn:()=>{const b=pk(['#d8413a','#6fa8d0','#e8913a']);return act(-42,0,1,{pose:'up'},'hop')+act(42,0,-1,{pose:'reach'},'hop')+`<path d="M-21,-28 Q2,-90 28,-22" fill="none" stroke-dasharray="3 4" stroke-width="1.2"/>`+wrapAn('float',`<circle cx="4" cy="-68" r="5" fill="${b}"/>`,true)}},
 chase:{w:110,h:64,fn:()=>`<path d="M-58,-32 h-10 M-56,-22 h-13 M-58,-12 h-9" fill="none" stroke-width="1.4"/>`+act(-30,0,1,{pose:'run',mood:1},'hop')+act(28,0,1,{pose:'run'},'hop')},
 jumpRope:{w:130,h:74,fn:()=>act(-52,0,1,{pose:'reach'},'hop')+act(52,0,-1,{pose:'reach'},'hop')+`<path d="M-38,-18 Q0,12 38,-18" fill="none" stroke="#c4572f" stroke-width="2.2"/>`+act(0,-6,1,{view:pk(['back','side']),pose:'up2',force:true},'hop')},
 seesaw:{w:130,h:60,fn:()=>`<path d="M-9,0 L0,-12 L9,0Z" fill="#8a5a3a"/>`+wrapAn('rock',`<rect x="-58" y="-17" width="116" height="7" rx="3" fill="#c4572f"/>`+act(-44,-16,1,{pose:'sit',s:.85})+act(44,-16,-1,{pose:'sit',s:.85}),'hop')},
 chat:{w:84,h:86,fn:()=>act(-16,0,1,{view:pk(['side','side','fq'])},'nod')+act(16,0,-1,{view:pk(['side','fq','fq']),pose:pk(['stand','reach'])},'nod')+wrapAn('bob',bubble(r()<.5?-24:20,-74,pk(['dots','heart','note','dots'])),true)},
 handInHand:{w:66,h:62,fn:()=>{const v=pk(['back','bq','bq']);return act(-11,0,1,{view:v,pose:'stand'},'step')+act(11,0,1,{view:v,pose:'stand'},'step')+`<circle cx="0" cy="-8" r="3.2" fill="${pk(SKIN)}" stroke-width="1.4"/>`}},
 benchPair:{w:72,h:56,fn:()=>act(-13,-6,1,{view:'back',pose:'stand'},'nod')+act(13,-6,1,{view:'back',pose:pk(['stand','up'])},'nod')+`<rect x="-31" y="-24" width="62" height="6" rx="2" fill="#a0663f"/><rect x="-31" y="-14" width="62" height="6" rx="2" fill="#a0663f"/><path d="M-26,-8 V0 M26,-8 V0" fill="none" stroke-width="3"/>`},
 dogWalk:{w:110,h:62,fn:()=>{const d=anyDog();return `<path d="M-18,-9 Q${f(4+d.cx/2)},-2 ${f(22+d.cx)},${f(d.cy)}" fill="none" stroke="#c4572f" stroke-width="1.6"/>`+act(-24,0,1,{pose:'walk'},'step')+T(22,0,1,wrapAn('hop',d.svg))}},
 petDog:{w:76,h:58,fn:()=>act(-22,0,1,{pose:'crouch',mood:0},'bend')+T(22,0,1,wrapAn(pk(['wig','hop']),anyDog().svg,true),true)+wrapAn('float',heart(2,-46),true)},
 feedChickens:{w:112,h:60,fn:()=>act(-36,0,1,{pose:'low'},'bend')+`<g fill="#e8c46a" stroke="none">${[...Array(8)].map(()=>`<circle cx="${f(sr(-20,44))}" cy="${f(sr(-5,3))}" r="1.6"/>`).join('')}</g>`+[[6,-3],[28,2],[44,-6]].map(([x,y])=>T(x,y,1,wrapAn('peck',chicken(),true),true)).join('')},
 petCat:{w:62,h:56,fn:()=>act(-14,0,1,{pose:'crouch',mood:0},'bend')+T(14,0,1,wrapAn('wig',cat(pk(['#e8913a','#fbf6ea','#c9c2b6']))))+wrapAn('float',heart(2,-42),true)},
 shepherd:{w:140,h:74,fn:()=>act(-52,0,1,{pose:'walk',hat:1},'lean')+`<path d="M-46,-9 L-41,-62 Q-39,-70 -32,-65" fill="none" stroke="#7a5235" stroke-width="2.6"/>`+[[-14,0],[14,-8],[40,2]].map(([x,y])=>T(x,y,1,wrapAn('bob',sheep()))).join('')},
 violin:{w:132,h:80,fn:()=>act(0,0,1,{pose:'hold',extra:`<ellipse cx="14" cy="-19" rx="6.5" ry="4.2" fill="#a8703f" transform="rotate(-25 14 -19)"/><path d="M6,-30 L24,-10" fill="none" stroke-width="1.4"/>`},'groove')+wrapAn('float',noteM(18,-58)+noteM(-6,-66),true)+act(-46,0,1,{pose:'sit',s:.85},'groove')+act(46,0,-1,{s:.85,mood:1},'groove')},
 flute:{w:100,h:80,fn:()=>act(-14,0,1,{pose:'hold',extra:`<path d="M14,-23 L33,-27" fill="none" stroke="${OL}" stroke-width="4.5"/><path d="M14,-23 L33,-27" fill="none" stroke="#e0b44a" stroke-width="2.4"/>`},'groove')+wrapAn('float',noteM(26,-56),true)+act(34,0,-1,{pose:'sit',s:.85},'groove')},
 flowerWatch:{w:60,h:48,fn:()=>act(-12,0,1,{pose:'crouch'},'lean')+pinkFlowers(10,0)},
 watering:{w:76,h:62,fn:()=>act(-20,0,1,{pose:'reach',extra:`<path d="M11,-22 h11 v10 h-11z" fill="#6fa8a0"/><path d="M22,-19 L30,-26" fill="none" stroke-width="2.6"/><path d="M13,-22 Q16,-30 20,-22" fill="none" stroke-width="1.6"/>`},'work')+wrapAn('bob',`<path d="M10,-25 q6,8 12,14 M12,-24 q5,8 14,12" fill="none" stroke="#7fb8c8" stroke-dasharray="2 3" stroke-width="1.6"/>`,true)+T(26,0,1,pot())},
 mushroomPick:{w:80,h:50,fn:()=>`<g transform="translate(-34,0)"><path d="M-10,-12 Q0,-24 10,-12" fill="none" stroke-width="2"/><path d="M-11,-12 L11,-12 L8,0 L-8,0Z" fill="#c99a5b"/></g>`+act(-12,0,1,{pose:'crouch'},'bend')+T(18,-11,.75,DECOY.mushTan)+T(30,-9,.6,DECOY.mushTan)},
 sweep:{w:64,h:62,fn:()=>act(-10,0,1,{pose:'low',extra:`<path d="M11,-9 L22,-1" fill="none" stroke="#7a5235" stroke-width="2.6"/><path d="M19,-3 L30,0 L26,5 L16,3Z" fill="#e8c46a"/>`},'work')+wrapAn('float',`<circle cx="32" cy="-4" r="3" fill="#ecd9ae" stroke-width="1"/><circle cx="37" cy="-8" r="2" fill="#ecd9ae" stroke-width="1"/>`,true)},
 carryBox:{w:44,h:72,fn:()=>act(0,0,r()<.5?1:-1,{pose:'hold',legs:'walk',extra:`<rect x="8" y="-28" width="18" height="16" fill="#c99a5b"/><path d="M8,-22.5 H26 M8,-17 H26" fill="none" stroke="#8a6a3a" stroke-width="1.1"/><path d="M8,-28 h3 v3 M26,-28 h-3 v3 M8,-12 h3 v-3 M26,-12 h-3 v-3" fill="none" stroke="#5a5f64" stroke-width="1.6"/>`},'step')},
 laundry:{w:130,h:80,fn:()=>{let g=`<path d="M-60,0 V-66 M60,0 V-66" fill="none" stroke="#7a5235" stroke-width="3"/><path d="M-60,-62 Q0,-50 60,-62" fill="none" stroke-width="1.2"/>`;
  [[-38,-58],[-14,-55],[12,-55],[36,-58]].forEach(([x,y],i)=>{const c=pk(SHIRT);g+=wrapAn('swing',i%2?`<path d="M${x-8},${y} h16 l2,16 h-20z" fill="${c}"/>`:`<path d="M${x-9},${y} h18 l4,6 -4,2 v10 h-14 v-10 l-4,-2z" fill="${c}"/>`,true)});
  return g+act(-24,0,1,{view:'back',pose:'up2'},'work')}},
 painting:{w:80,h:72,fn:()=>act(-20,0,1,{pose:'reach',hat:pk([-1,4,5]),extra:`<path d="M14,-18 L22,-31" fill="none" stroke-width="1.6"/>`},false)+`<path d="M8,0 L16,-58 L24,0 M16,-58 L16,0" fill="none" stroke="#7a5235" stroke-width="2.4"/><rect x="2" y="-62" width="28" height="24" fill="#fbf6ea"/><g stroke="none"><circle cx="10" cy="-52" r="4" fill="#6fa8a0"/><circle cx="21" cy="-48" r="5" fill="#f0a8a0"/><path d="M4,-40 Q16,-48 28,-40Z" fill="#8f9d58"/></g>`},
 reading:{w:44,h:52,fn:()=>`<path d="M-11,-8 L-10,0 L10,0 L11,-8 Q0,-12 -11,-8Z" fill="#a8703f"/>`+act(-2,-7,1,{pose:'sit',extra:`<path d="M6,-14 Q9,-18 13,-16 Q16,-18 19,-14 L19,-8 Q16,-11 13,-9 Q9,-11 6,-8Z" fill="#fbf6ea" stroke-width="1.3"/>`},false)},
 kiteFly:{w:80,h:150,fn:()=>{const c=pk(['#c4572f','#6fa8a0','#9a6fa8']);return act(-24,0,1,{pose:'up'},'lean')+`<path d="M-3,-25 Q12,-90 26,-118" fill="none" stroke-width=".9"/>`+wrapAn('sway',`<g transform="translate(26,-120)"><path d="M0,14 q-6,8 0,14 q6,8 0,14" fill="none" stroke-width="1.1"/><path d="M0,-14 L10,0 L0,16 L-10,0Z" fill="${c}"/><path d="M0,-14 V16 M-10,0 H10" fill="none" stroke-width="1"/></g>`,true)}},
 stretch:{w:34,h:74,fn:()=>act(0,0,1,{view:'back',pose:'up2'},'lean')},
 sleeping:{w:76,h:36,fn:()=>`<rect x="-36" y="-7" width="72" height="9" rx="3" fill="${pk(['#f0a8a0','#6fa8a0','#e0b44a'])}"/>`+T(24,-3,1,`<g transform="rotate(-90)">${kid({pose:'stand',eyes:'closed',hat:-1})}</g>`)+wrapAn('float',`<text x="-14" y="-22" font-size="12" font-weight="800" fill="${OL}" stroke="none" font-family="sans-serif">z Z</text>`,true)},
 walker:{w:30,h:62,fn:()=>{const v=pickView(),p=walkPose(v);return act(0,0,r()<.5?1:-1,{view:v,pose:p},'step')}},
 gnome:{w:30,h:76,fn:()=>act(0,0,r()<.5?1:-1,{view:pk(['side','side','fq','bq','back','front']),pose:pk(['walk','stand','crouch']),hat:2,beard:r()<.6,hair:'#9a9a9a'},'lean')}
};

const headOnly=()=>{const hr=pk(HAIR);return `<circle cy="0" r="9" fill="${pk(SKIN)}"/>`+`<g transform="translate(0,25) scale(.7)">${HAIRS[ri(0,4)](hr)}${face(ri(0,3))}</g>`};

/* ================= animals ================= */
function cat(c,eye,big){const e=eye||OL;return limb('M7,-3 Q17,-5 13,-16',c,3)+`<path d="M-8,0 Q-10,-13 -5,-15 L5,-15 Q10,-13 8,0Z" fill="${c}"/><path d="M-7,-18 L-7,-28 L-2,-23Z M7,-18 L7,-28 L2,-23Z" fill="${c}"/><circle cx="0" cy="-19" r="7.5" fill="${c}"/><g stroke="none"><ellipse cx="-3" cy="-19.5" rx="${big?1.9:1.4}" ry="${big?2.4:1.9}" fill="${e}"/><ellipse cx="3" cy="-19.5" rx="${big?1.9:1.4}" ry="${big?2.4:1.9}" fill="${e}"/><path d="M-1.2,-16.5 L1.2,-16.5 L0,-15Z" fill="#f08a80"/></g>`}
const pig=()=>`<rect x="-10" y="-8" width="4" height="8" fill="#f2b0a8"/><rect x="5" y="-8" width="4" height="8" fill="#f2b0a8"/><ellipse cx="-2" cy="-12" rx="13" ry="9" fill="#f2b0a8"/><circle cx="10" cy="-17" r="7.5" fill="#f2b0a8"/><path d="M6,-24 L5,-29 L10,-25Z" fill="#f2b0a8"/><ellipse cx="15" cy="-16" rx="3" ry="2.6" fill="#e88f88"/><circle cx="9" cy="-19" r="1.2" fill="${OL}" stroke="none"/>`;
const chicken=()=>`<path d="M-3,0 L-3,-5 M3,0 L3,-5" fill="none" stroke-width="1.6"/><path d="M-11,-9 Q-12,-19 -4,-17 Q-1,-27 6,-24 Q10,-21 8,-14 Q9,-5 0,-5 Q-9,-4 -11,-9Z" fill="#fbf6ea"/><path d="M3,-25 Q4,-30 6,-26 Q8,-30 8,-24Z" fill="#d8413a"/><path d="M9,-20 L13,-19 L9,-17Z" fill="#e8b93a"/><circle cx="5" cy="-21" r="1.1" fill="${OL}" stroke="none"/>`;
const sheep=()=>`<path d="M-8,0 L-8,-7 M6,0 L6,-7" fill="none" stroke-width="2.5"/><path d="M-14,-10 Q-18,-18 -10,-20 Q-8,-27 0,-24 Q8,-28 11,-20 Q18,-17 13,-9 Q10,-3 0,-5 Q-10,-2 -14,-10Z" fill="#fbf6ea"/><ellipse cx="13" cy="-17" rx="5" ry="6" fill="#4a4040"/><circle cx="15" cy="-18" r="1" fill="#fff" stroke="none"/>`;
const frog=()=>`<ellipse cx="0" cy="-6" rx="10" ry="7" fill="#8fbf5a"/><circle cx="-5" cy="-12" r="4" fill="#8fbf5a"/><circle cx="5" cy="-12" r="4" fill="#8fbf5a"/><circle cx="-5" cy="-12" r="1.5" fill="${OL}" stroke="none"/><circle cx="5" cy="-12" r="1.5" fill="${OL}" stroke="none"/><path d="M-4,-5 Q0,-2 4,-5" fill="none" stroke-width="1.3"/>`;
const owl=()=>`<path d="M-9,0 Q-12,-14 -8,-24 L-4,-20 L4,-20 L8,-24 Q12,-14 9,0Z" fill="#a8703f"/><circle cx="-4" cy="-15" r="4" fill="#fbf6ea"/><circle cx="4" cy="-15" r="4" fill="#fbf6ea"/><circle cx="-4" cy="-15" r="1.6" fill="${OL}" stroke="none"/><circle cx="4" cy="-15" r="1.6" fill="${OL}" stroke="none"/><path d="M-1.5,-11 L1.5,-11 L0,-8Z" fill="#e8b93a"/>`;
/* ---------- dog breeds (all face right, feet at y=0); each returns {svg, cx, cy} with the collar point ---------- */
const dLegs=(xs,h,c,w=3)=>xs.map(x=>limb(`M${x},${-h} L${x},0`,c,w)).join('');
const dEye=(x,y)=>`<circle cx="${x}" cy="${y}" r="1.35" fill="${OL}" stroke="none"/><circle cx="${x+.45}" cy="${y-.5}" r=".45" fill="#fff" stroke="none"/>`;
const dNose=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="1.9" ry="1.5" fill="${OL}" stroke="none"/>`;
const dCollar=(x,y,c='#c4473c')=>`<path d="M${x-1},${y-2.2} Q${x+1.2},${y} ${x+.6},${y+2.4}" fill="none" stroke="${c}" stroke-width="1.8"/>`;
function dachshund(){const c=pk(['#a0623a','#8a4e2e','#3a3433']),tan=c==='#3a3433'?'#c98a52':shade(c,-.2);
 return{cx:13,cy:-11,svg:dLegs([-13,-8,9,14],5,c,2.8)+limb('M-18,-10 Q-24,-13 -25,-17',c,2.2)+`<ellipse cx="0" cy="-8.5" rx="19" ry="5.8" fill="${c}"/>`+
 `<ellipse cx="26" cy="-11.5" rx="6" ry="3.8" fill="${c==='#3a3433'?tan:c}"/><ellipse cx="18.5" cy="-14.5" rx="7.6" ry="6.8" fill="${c}"/>`+dCollar(13,-11)+
 `<ellipse cx="15.5" cy="-11.5" rx="3" ry="6" fill="${shade(c,-.3)}" transform="rotate(18 15.5 -11.5)"/>`+dEye(20.5,-16)+dNose(30.6,-11.6)+(c==='#3a3433'?`<circle cx="18" cy="-18.5" r="1.1" fill="${tan}" stroke="none"/>`:'')}}
function corgi(){const c='#d98c46',w='#fbf6ea';
 return{cx:11,cy:-16,svg:dLegs([-10,-5,7,11],6,c,3.2)+`<ellipse cx="0" cy="-11" rx="15.5" ry="7.5" fill="${c}"/><path d="M-9,-6 Q2,-2 12,-6 Q8,-4.5 -9,-5Z" fill="${w}" stroke="none"/><circle cx="-14.5" cy="-12" r="4.6" fill="${w}"/>`+
 `<path d="M10,-24 L8,-35 L15,-27Z" fill="${c}"/><path d="M15,-27 L20,-36 L21,-24Z" fill="${c}"/><path d="M10,-26 L9.5,-32 L13,-27Z M16.5,-27 L19.5,-33 L19.8,-26Z" fill="#f0b4a8" stroke="none"/>`+
 `<circle cx="15" cy="-19" r="7.2" fill="${c}"/><path d="M13.5,-16.5 Q15.5,-13.8 19,-13.5 Q23,-13.6 23.8,-17 Q21,-20.2 18,-18.8 Q15.4,-19.4 13.5,-16.5Z" fill="${w}" stroke-width="1.2"/><path d="M15.6,-25.6 Q16.4,-22 17.4,-19.5" fill="none" stroke="${w}" stroke-width="2"/><ellipse cx="11" cy="-12" rx="4.5" ry="4" fill="${w}" stroke="none"/>`+dCollar(10,-15,'#5a86b0')+dEye(18.5,-21)+dNose(23.6,-17.8)}}
function labrador(){const c=pk(['#e6c27a','#e6c27a','#7a4e32','#3a3433']);
 return{cx:9,cy:-20,svg:dLegs([-11,-5,7,12],10,c,3.4)+limb('M-14,-16 Q-23,-17 -24,-10',c,3)+`<ellipse cx="0" cy="-14.5" rx="15.5" ry="7.5" fill="${c}"/>`+
 `<ellipse cx="22.5" cy="-20.5" rx="6" ry="4.4" fill="${c}"/><circle cx="15" cy="-24" r="8" fill="${c}"/>`+dCollar(9,-19,'#c4473c')+
 `<ellipse cx="11" cy="-21.5" rx="3.4" ry="6.6" fill="${shade(c,-.25)}" transform="rotate(14 11 -21.5)"/>`+dEye(18,-26)+dNose(28,-21.5)+`<path d="M22,-17 q2,1.5 4,0" fill="none" stroke-width="1"/>`}}
function shiba(){const red=r()<.75,c=red?'#d9884a':'#3a3433',w='#fbf6ea';
 return{cx:10,cy:-17,svg:dLegs([-10,-5,6,10],8,c,3)+`<ellipse cx="0" cy="-12.5" rx="13.5" ry="6.6" fill="${c}"/><ellipse cx="9" cy="-10" rx="4.5" ry="4.5" fill="${w}" stroke="none"/>`+
 `<path d="M-11,-15 Q-20,-23 -12,-27 Q-6,-28 -6,-21" fill="none" stroke="${OL}" stroke-width="6.4" stroke-linecap="round"/><path d="M-11,-15 Q-20,-23 -12,-27 Q-6,-28 -6,-21" fill="none" stroke="${c}" stroke-width="3.6" stroke-linecap="round"/><path d="M-13,-24 Q-10,-26 -8,-23" fill="none" stroke="${w}" stroke-width="1.6"/>`+
 `<path d="M9,-24 L9.5,-33 L14.5,-26Z" fill="${c}"/><path d="M15,-26 L19.5,-33 L19.5,-23Z" fill="${c}"/><path d="M10.5,-26 L10.8,-30.5 L13.2,-26.5Z M16.5,-26 L18.8,-30 L18.8,-25Z" fill="${w}" stroke="none"/>`+
 `<circle cx="14" cy="-20" r="7" fill="${c}"/><path d="M12,-17 Q14,-14.5 18,-14 Q22,-14 22.6,-17.5 Q20,-20.5 17,-19 Q14,-19.5 12,-17Z" fill="${w}" stroke-width="1.2"/>`+(red?'':`<circle cx="15.8" cy="-24" r="1.2" fill="#c98a52" stroke="none"/>`)+dCollar(9,-15,'#d4ac52')+dEye(16.3,-21.5)+dNose(22.4,-17.8)+`<path d="M18,-15.2 q1.6,1.2 3.2,0" fill="none" stroke-width="1"/>`}}
const BREEDS=[dachshund,corgi,labrador,shiba];
const anyDog=()=>pk(BREEDS)();
const dog=()=>anyDog().svg;
const swan=()=>`<path d="M-14,-2 Q-16,-12 -6,-12 L6,-12 Q4,-24 8,-30 Q14,-34 15,-28 L19,-26 L14,-25 Q10,-20 12,-10 Q14,-2 4,0Z" fill="#fbf6ea"/><circle cx="12" cy="-29" r="1" fill="${OL}" stroke="none"/><path d="M-8,-6 Q0,-9 6,-5" fill="none" stroke-width="1.3"/>`;

/* ================= items (findables) & decoys ================= */
const potionShape='M-3,-14 L3,-14 L3,-6 Q12,-2 11,6 Q9,14 0,14 Q-9,14 -11,6 Q-12,-2 -3,-6Z';
const potion=liq=>`<path d="${potionShape}" fill="#fbf6ea"/><path d="M-10.5,3 Q0,0 10.8,3 Q9.5,13 0,13 Q-9.5,13 -10.5,3Z" fill="${liq}" stroke="none"/><path d="${potionShape}" fill="none"/><rect x="-4.5" y="-19" width="9" height="6" rx="2" fill="#a8703f"/><path d="M-6,-2 Q-8,2 -7,5" fill="none" stroke="#fff" stroke-width="1.6"/>`;
const hatShape=(c,b,star)=>`<ellipse cx="0" cy="9" rx="17" ry="4.5" fill="${c}"/><path d="M-9,8 L-2,-14 Q2,-19 6,-12 L3,-11 L9,8Z" fill="${c}"/><path d="M-8,3.5 L8,3.5 L9,8 L-9,8Z" fill="${b}"/>`+(star?`<path d="M1,-7 l1.4,2.8 3,.4 -2.2,2 .5,3 -2.7,-1.4 -2.7,1.4 .5,-3 -2.2,-2 3,-.4Z" fill="#f5c842" stroke-width="1"/>`:'');
const keyShape=c=>`<circle cx="-9" cy="0" r="7" fill="${c}"/><circle cx="-9" cy="0" r="2.6" fill="#f3e7cb"/><path d="M-2,-2.5 L15,-2.5 L15,2.5 L12.5,2.5 L12.5,7 L9.5,7 L9.5,2.5 L6.5,2.5 L6.5,6 L3.5,6 L3.5,2.5 L-2,2.5Z" fill="${c}"/>`;
const fishShape=(c,spots)=>`<path d="M9,-1 L17,-8 L16,6Z" fill="${c}"/><path d="M-14,0 Q-2,-11 10,-1 Q-2,10 -14,0Z" fill="${c}"/>`+(spots?`<g fill="#fbf6ea" stroke="none"><circle cx="-1" cy="-3" r="2"/><circle cx="4" cy="1" r="1.5"/></g>`:'')+`<circle cx="-8" cy="-1.5" r="1.6" fill="${OL}" stroke="none"/><path d="M-3,-5 Q0,0 -3,5" fill="none" stroke-width="1.3"/>`;
const mushShape=(c,dot)=>`<path d="M-5,0 L-6,12 Q0,15 6,12 L5,0Z" fill="#fbf6ea"/><path d="M-15,2 Q-15,-15 0,-15 Q15,-15 15,2Z" fill="${c}"/><g fill="${dot}" stroke="none"><circle cx="-7" cy="-7" r="2.6"/><circle cx="3" cy="-10" r="2.2"/><circle cx="8" cy="-3" r="2"/><circle cx="-1" cy="-3" r="1.6"/></g>`;
const pumpkinShape=face=>`<path d="M0,-13 Q1,-18 5,-19" fill="none" stroke="#5f6b3a" stroke-width="3"/><ellipse cx="-6" cy="-1" rx="8" ry="10" fill="#e8913a"/><ellipse cx="6" cy="-1" rx="8" ry="10" fill="#e8913a"/><ellipse cx="0" cy="-1" rx="6.5" ry="10.5" fill="#f0a24a"/>`+(face?`<g fill="#3a2a1a" stroke="none"><path d="M-8,-4 L-5,-9 L-2,-4Z M2,-4 L5,-9 L8,-4Z M-8,2 L-5,5 L-2,2.5 L1,5 L4,2.5 L8,2 Q2,10 -8,2Z"/></g>`:'');
const umbShape=c=>limb('M0,-1 L0,12 Q0,17 -5,15',OL,1.6)+`<path d="M-16,0 Q-16,-16 0,-16 Q16,-16 16,0 Q12,-3 8,0 Q4,-3 0,0 Q-4,-3 -8,0 Q-12,-3 -16,0Z" fill="${c}"/><path d="M0,-16 L0,0 M0,-16 Q-8,-10 -8,0 M0,-16 Q8,-10 8,0" fill="none" stroke-width="1.3"/><path d="M0,-16 L0,-20" fill="none"/>`;
const starPath=(R,r)=>{let d='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r:R;d+=(i?'L':'M')+f(Math.cos(a)*rr)+','+f(Math.sin(a)*rr)}return d+'Z'};
const ART={
 hat:hatShape('#5f4a86','#e3bb4a',true),
 key:keyShape('#d6ab45'),
 potion:potion('#cf6a96'),
 fish:fishShape('#5a86b0'),
 mushroom:mushShape('#c4473c','#f6efe0'),
 cat:`<g transform="translate(0,13)">${cat(OL,'#f5c842',true)}</g>`,
 pumpkin:pumpkinShape(true),
 star:`<path d="${starPath(16,7.5)}" fill="#e3bb4a"/><g stroke="none" fill="${OL}"><circle cx="-3" cy="-1" r="1.3"/><circle cx="3" cy="-1" r="1.3"/></g><path d="M-1.5,2.5 Q0,4 1.5,2.5" fill="none" stroke-width="1.1"/>`,
 letter:`<rect x="-14" y="-9" width="28" height="18" rx="2" fill="#fbf7ec"/><path d="M-14,-9 L0,2 L14,-9" fill="none"/><path d="M0,1 c-2,-3 -6,-1 -4,2 l4,4 4,-4 c2,-3 -2,-5 -4,-2z" fill="#d8413a" stroke-width="1"/>`,
 snail:`<path d="M-16,9 Q-17,3 -10,3 L9,3 Q12,-6 14,-6 M12,3 Q16,-5 18,-4" fill="none" stroke-width="1.6"/><path d="M-16,9 Q-17,3 -10,3 L10,3 Q16,3 15,9Z" fill="#d8d07a"/><circle cx="14" cy="-6" r="1.8" fill="${OL}" stroke="none"/><circle cx="18" cy="-4.5" r="1.8" fill="${OL}" stroke="none"/><circle cx="-2" cy="-4" r="9" fill="#c9884a"/><path d="M-2,-4 a2,2 0 1 1 2,2 a4,4 0 1 1 -5,-5 a6.5,6.5 0 1 1 8,7" fill="none" stroke-width="1.5"/>`,
 cake:`<path d="M-14,10 L14,10 L14,-3 L-14,-8Z" fill="#f3d9a0"/><path d="M-14,1 L14,4" fill="none" stroke="#f0a8a0" stroke-width="2.4"/><path d="M-14,-8 L14,-3 L14,-6 Q0,-14 -14,-12Z" fill="#f2a0b8"/><circle cx="7" cy="-12" r="3.6" fill="#d8413a"/><path d="M7,-15 Q8,-19 11,-20" fill="none" stroke-width="1.3"/>`,
 umbrella:umbShape('#5f978f'),
 carrot:`<path d="M-2,-11 Q-9,-21 -6,-23 Q-1,-17 0,-12 Q1,-20 6,-22 Q7,-15 2,-11Z" fill="#6f9a4a"/><path d="M-5,-10 Q0,-13 5,-10 L1,13 Q0,15 -1,13Z" fill="#e07a32"/><path d="M-3,-4 h3 M-2,2 h3 M-1,8 h2" fill="none" stroke-width="1"/>`,
 egg:`<ellipse cx="0" cy="1" rx="10" ry="13" fill="#f3e2c4"/><ellipse cx="-4" cy="-4" rx="2.4" ry="4" fill="#fffaf0" stroke="none"/><g fill="#b89a6a" stroke="none"><circle cx="3" cy="4" r="1"/><circle cx="5" cy="-3" r=".8"/><circle cx="-2" cy="8" r=".9"/></g>`,
 corn:`<ellipse cx="0" cy="-3" rx="6.5" ry="14" fill="#e8c24a"/><path d="M-5,-11 H5 M-6,-6 H6 M-6.5,-1 H6.5 M-6,4 H6 M-2,-16 V10 M2,-16 V10" fill="none" stroke-width=".8" opacity=".6"/><path d="M-1,14 Q-14,6 -9,-6 Q-6,4 1,9Z" fill="#8fae5a"/><path d="M1,14 Q14,6 9,-6 Q6,4 -1,9Z" fill="#8fae5a"/>`,
 milk:`<path d="M-8,14 L-8,-2 Q-8,-6 -5,-8 L-5,-12 L5,-12 L5,-8 Q8,-6 8,-2 L8,14Z" fill="#c9d3d6"/><rect x="-6.5" y="-16" width="13" height="4" rx="1.5" fill="#aab8bc"/><path d="M-8,4 H8" fill="none" stroke="#5a86b0" stroke-width="3.2"/><path d="M-5,-7 Q-12,-7 -11,0" fill="none" stroke-width="1.6"/><path d="M5,-7 Q12,-7 11,0" fill="none" stroke-width="1.6"/>`,
 sunflower:`<path d="M0,4 V18 M0,12 q6,-6 9,-3 q-4,4 -9,3" fill="none" stroke="#5f8f3f" stroke-width="2.2"/>${[...Array(10)].map((_,i)=>`<ellipse cx="${f(Math.cos(i*.628)*9)}" cy="${f(-4+Math.sin(i*.628)*9)}" rx="4.6" ry="2.4" fill="#f0c03a" stroke-width="1" transform="rotate(${f(i*36)} ${f(Math.cos(i*.628)*9)} ${f(-4+Math.sin(i*.628)*9)})"/>`).join('')}<circle cx="0" cy="-4" r="6" fill="#7a4e32"/><g fill="#4a2e1a" stroke="none"><circle cx="-2" cy="-6" r=".9"/><circle cx="2" cy="-3" r=".9"/><circle cx="1" cy="-7" r=".8"/></g>`,
 apple:`<path d="M0,-6 C-6,-11 -14,-6 -13,2 C-12,10 -6,14 0,11 C6,14 12,10 13,2 C14,-6 6,-11 0,-6Z" fill="#c4473c"/><path d="M0,-6 Q1,-11 3,-14" stroke="#6b4a2b" stroke-width="2" fill="none"/><path d="M2,-10 Q8,-15 12,-11 Q7,-7 2,-10Z" fill="#6f9a4a"/><ellipse cx="-6" cy="-1" rx="2.2" ry="3.5" fill="#fff" opacity=".45" stroke="none"/>`
};
const DECOY={
 hatBrown:hatShape('#7a5235','#e0b44a',false),
 hatGreen:hatShape('#5f6b3a','#c4572f',false),
 keyGrey:keyShape('#b9b6ae'),
 bottleG:potion('#8fbf6a'),bottleB:potion('#6fa8d0'),
 koi:fishShape('#e8913a',true),fishGrey:fishShape('#a9b0b4'),
 mushTan:mushShape('#c9a26a','#ecd9ae'),mushBrown:mushShape('#8a5a3a','#c9a26a'),
 pumpkinPlain:pumpkinShape(false),
 flowersY:[[-9,0],[0,-6],[9,1]].map(([x,y])=>`<g transform="translate(${x},${y})"><path d="M0,0 L0,9" stroke="#5f8f3f" fill="none"/>${[0,1,2,3,4].map(i=>{const a=i*1.2566-1.57;return `<circle cx="${f(Math.cos(a)*3.6)}" cy="${f(Math.sin(a)*3.6)}" r="2.8" fill="#f5c842" stroke-width="1"/>`}).join('')}<circle r="2" fill="#e8913a" stroke-width="1"/></g>`).join(''),
 note:`<g transform="rotate(-8)"><rect x="-9" y="-12" width="18" height="22" rx="1" fill="#fbf7ec"/><path d="M-6,-7 H6 M-6,-3 H6 M-6,1 H4 M-6,5 H5" fill="none" stroke-width="1"/></g>`,
 cupcake:`<path d="M-8,0 L-6,10 L6,10 L8,0Z" fill="#c99a5b"/><path d="M-9,1 Q-11,-8 0,-11 Q11,-8 9,1Z" fill="#fbf6ea"/><circle cx="0" cy="-12" r="2.6" fill="#d8413a"/>`,
 umbYellow:umbShape('#e0b44a'),umbRed:umbShape('#c4572f'),
 whiteCarrot:`<path d="M-2,-11 Q-9,-21 -6,-23 Q-1,-17 0,-12 Q1,-20 6,-22 Q7,-15 2,-11Z" fill="#6f9a4a"/><path d="M-5,-10 Q0,-13 5,-10 L1,13 Q0,15 -1,13Z" fill="#efe6d2"/>`,
 tomato:`<circle cy="0" r="8" fill="#d65a3c"/><path d="M-4,-7 L0,-4 L4,-7 L1,-8 L0,-11 L-1,-8Z" fill="#6f9a4a" stroke-width="1"/>`,
 bucket:`<path d="M-8,-12 Q0,-22 8,-12" fill="none" stroke-width="1.4"/><path d="M-9,-12 L9,-12 L7,4 L-7,4Z" fill="#a9b0b4"/><path d="M-8,-6 H8" fill="none" stroke-width="1"/>`
};


/* ================= terrain ================= */

/* ---- farm props ---- */
function barn(){const w=120,h=66,sd=30,sy=15,c='#a85640';let g=`<path d="M${-w/2-4},1 L${w/2+sd+4},${-sy+1} L${w/2+sd+16},6 L${-w/2+8},10Z" fill="#000" opacity=".16" stroke="none"/>`;
 g+=`<path d="M${w/2},0 L${w/2+sd},${-sy} L${w/2+sd},${-h-sy} L${w/2},${-h}Z" fill="${shade(c,-.25)}"/>`;
 g+=`<path d="M${w/2+6},${-h} L${w/2-10},${-h-34} L0,${-h-50} L${sd},${-h-50-sy} L${w/2-10+sd},${-h-34-sy} L${w/2+6+sd},${-h-sy}Z" fill="${shade('#6a7488',-.28)}"/>`;
 g+=`<rect x="${-w/2}" y="${-h}" width="${w}" height="${h}" fill="${c}"/><path d="M${-w/2+8},${-h} V0 M${w/2-8},${-h} V0" fill="none" stroke="#f1ead8" stroke-width="3"/>`;
 g+=`<path d="M${-w/2-6},${-h} L${-w/2+10},${-h-34} L0,${-h-50} L${w/2-10},${-h-34} L${w/2+6},${-h}Z" fill="#6a7488"/><path d="M${-w/2+10},${-h-34} H${w/2-10}" fill="none" stroke-width="1.2"/>`;
 g+=`<rect x="-20" y="-46" width="40" height="46" fill="#7a3e2a"/><path d="M-20,-46 L20,0 M20,-46 L-20,0 M0,-46 V0" fill="none" stroke="#f1ead8" stroke-width="2.6"/><rect x="-20" y="-46" width="40" height="46" fill="none"/>`;
 g+=`<rect x="-9" y="${-h-28}" width="18" height="16" fill="#3d3833"/>`+`<g transform="translate(0,${-h-14}) scale(.5)">${headOnly()}</g>`;
 return g}
const cow=()=>`<path d="M-17,-17 Q-23,-12 -21,-5" fill="none" stroke-width="1.6"/><circle cx="-21" cy="-4" r="2.2" fill="${OL}" stroke="none"/><path d="M-11,0 V-8 M-5,0 V-8 M5,0 V-8 M10,0 V-8" fill="none" stroke-width="3.4"/><ellipse cx="-2" cy="-15" rx="16" ry="10" fill="#fbf6ea"/><path d="M-14,-21 q4,-4 9,-1 q2,5 -3,7 q-6,1 -6,-6Z M2,-12 q3,-3 7,0 q0,4 -4,4 q-4,0 -3,-4Z" fill="${OL}" stroke="none"/><ellipse cx="0" cy="-5.5" rx="3.4" ry="2" fill="#f0b4a8" stroke-width="1.4"/><path d="M8,-31 q-3,-3 -1,-7 M19,-31 q3,-3 1,-7" fill="none" stroke="#5c4a3d" stroke-width="2.6"/><ellipse cx="6" cy="-27" rx="4.5" ry="2.2" fill="#fbf6ea" transform="rotate(-25 6 -27)"/><ellipse cx="22" cy="-27" rx="4.5" ry="2.2" fill="#fbf6ea" transform="rotate(25 22 -27)"/><ellipse cx="14" cy="-24" rx="9" ry="8.5" fill="#fbf6ea"/><path d="M9,-31 q3,4 7,1 q-1,-3 -5,-3Z" fill="${OL}" stroke="none"/><ellipse cx="14" cy="-18" rx="7.5" ry="4.8" fill="#f0b4a8"/><circle cx="11.5" cy="-18" r=".9" fill="${OL}" stroke="none"/><circle cx="16.5" cy="-18" r=".9" fill="${OL}" stroke="none"/><circle cx="10.5" cy="-25" r="1.4" fill="${OL}" stroke="none"/><circle cx="17.5" cy="-25" r="1.4" fill="${OL}" stroke="none"/><path d="M7,-13.5 Q14,-11 21,-13.5" fill="none" stroke="#c4473c" stroke-width="2"/><circle cx="14" cy="-10.5" r="2.4" fill="#f5c842" stroke-width="1.3"/>`;
/* ---- 看板圖示（2026-11-11：場景裡的看板不寫字，改畫圖示；中心在 (0,0)、大約 ±8 的範圍） ---- */
const SIGNICON={
 farm:`<path d="M-7,6 V-1 L0,-7 L7,-1 V6Z" fill="#c4473c" stroke-width="1.2"/><path d="M-3,6 V1 H3 V6 M-3,1 L3,6 M3,1 L-3,6" fill="none" stroke="#fbf6ea" stroke-width="1"/>`,
 island:`<path d="M-8,5 Q0,-1 8,5Z" fill="#e8d49a" stroke-width="1"/><path d="M1,3 Q0,-2 2,-5" fill="none" stroke="#7a5235" stroke-width="1.4"/><path d="M2,-5 q-5,-1 -7,2 M2,-5 q5,-1 7,2 M2,-5 q-2,-3 -5,-3 M2,-5 q3,-3 6,-2" fill="none" stroke="#4f8a3a" stroke-width="1.5"/><path d="M-9,7 q2,-1.6 4,0 q2,1.6 4,0 q2,-1.6 4,0 q2,1.6 4,0" fill="none" stroke="#3f8fb8" stroke-width="1.1"/>`,
 ruins:`<rect x="-9" y="-7" width="18" height="3" fill="#a89a7a" stroke-width="1"/><rect x="-7" y="-4" width="4" height="10" fill="#c6b99a" stroke-width="1"/><rect x="3" y="-4" width="4" height="10" fill="#c6b99a" stroke-width="1"/><path d="M-6,0 h2 M4,2 h2" stroke-width=".8" fill="none"/>`,
 cable:`<path d="M-9,-6 L9,-9" fill="none" stroke-width="1"/><path d="M0,-7.5 V-4" fill="none" stroke-width="1"/><rect x="-5" y="-4" width="10" height="9" rx="2" fill="#c4473c" stroke-width="1.1"/><rect x="-3.4" y="-2.4" width="6.8" height="3" fill="#d6ecf0" stroke="none"/>`,
 onsen:`<path d="M-7,2 Q-7,7 0,7 Q7,7 7,2" fill="none" stroke="#c8362f" stroke-width="1.8"/><path d="M-3.5,3 q-2,-2 0,-4 q2,-2 0,-4 M0,3 q-2,-2 0,-4 q2,-2 0,-4.5 M3.5,3 q-2,-2 0,-4 q2,-2 0,-4" fill="none" stroke="#c8362f" stroke-width="1.5"/>`,
 ski:`<g transform="translate(.6,.4) scale(.8)"><g fill="#3d3833" stroke="none"><g transform="rotate(-18)"><rect x="-9" y="5" width="18" height="3.2" rx="1.6"/><circle cx="1.6" cy="-8.4" r="2.6"/><path d="M-0.6,-5.6 Q-3.6,-2 -4.4,1.4 L-5.6,5.4 H-3.2 L-1.4,1.8 L1.6,0 L3.4,5.4 H5.8 L4.6,-0.6 Q4.6,-3.4 2.8,-5.6Z"/><path d="M-0.4,-5 L-6.8,-6.6 L-7.2,-5.2 L-0.6,-3.2Z M2.8,-4.8 L8.4,-2.4 L7.8,-1 L2.4,-2.8Z"/></g></g><g fill="#fbf6ea" stroke-width=".7"><circle cx="-9.6" cy="7.4" r="1.6"/><circle cx="-11.6" cy="5" r="1.2"/><circle cx="-12" cy="8.4" r="1"/></g></g>`,
 town:`<path d="M-7,-1 L0,-7 L7,-1Z" fill="#c4572f" stroke-width="1.1"/><rect x="-5" y="-1" width="10" height="7" fill="#f2dfb0" stroke-width="1.1"/><rect x="-1.5" y="2" width="3" height="4" fill="#7a5235" stroke="none"/>`,
 fish:`<path d="M-8,0 Q-2,-6 5,0 Q-2,6 -8,0Z M5,0 L9,-4 V4Z" fill="#fbf6ea" stroke="none"/><circle cx="-4.6" cy="-.6" r="1" fill="#3b5a8a" stroke="none"/>`,
 sakura:[0,72,144,216,288].map(a=>`<ellipse transform="rotate(${a})" cx="0" cy="-3.6" rx="2.7" ry="3.6" fill="#f6b6c8" stroke-width=".8"/>`).join('')+`<circle r="1.6" fill="#e0b44a" stroke="none"/>`,
 taiko:`<path d="M-6,-6 L-8,-10 M6,-6 L8,-10" fill="none" stroke="#7a5235" stroke-width="1.4"/><rect x="-6" y="-4" width="12" height="10" rx="3" fill="#b5532f" stroke-width="1.1"/><ellipse cx="0" cy="-4" rx="6" ry="2" fill="#f2e6c4" stroke-width="1.1"/><circle cx="0" cy="1.5" r="1.8" fill="none" stroke="#e0b44a" stroke-width="1"/>`,
 geta:[-4.5,4.5].map(x=>`<rect x="${x-3.4}" y="-7" width="6.8" height="14" rx="3" fill="#d9b070" stroke-width="1.1"/><path d="M${x-2.4},-1 L${x},-4.5 L${x+2.4},-1" fill="none" stroke="#c8362f" stroke-width="1.4"/>`).join(''),
 foot:`<path d="M-9,6 q2,-1.6 4,0 q2,1.6 4,0 q2,-1.6 4,0 q2,1.6 4,0 q2,-1.6 4,0" fill="none" stroke="#3f8fb8" stroke-width="1.4"/>`+[[-3.6,1],[3.6,-1]].map(([x,y])=>`<g transform="translate(${x},${y})" fill="#f2c9a0" stroke-width=".8"><ellipse cx="0" cy="0" rx="2.4" ry="3.6"/><circle cx="-1.8" cy="-5" r=".9"/><circle cx="0" cy="-5.6" r=".95"/><circle cx="1.8" cy="-5" r=".9"/></g>`).join(''),
 soldout:`<ellipse cx="0" cy="3" rx="8" ry="3.2" fill="#d9b070" stroke-width="1"/><path d="M-8,3 V-1 Q0,-4 8,-1 V3" fill="#e8c88a" stroke-width="1"/><path d="M-6,-6 L6,6 M6,-6 L-6,6" fill="none" stroke="#c8362f" stroke-width="2.4"/>`,
 volcano:`<path d="M-11,6 L-4,-5 H4 L11,6Z" fill="#9a7a5a" stroke-width="1.1"/><ellipse cx="0" cy="-5" rx="4" ry="1.5" fill="#6fb5c8" stroke-width=".9"/><path d="M-6,1 l2,-2 M5,2 l-2,-3" fill="none" stroke="#6f5a42" stroke-width="1"/>`,
 quarry:`<path d="M-7,7 V-4 Q-7,-8 -2,-8 Q3,-8 3,-4 V7Z" fill="#8f8a80" stroke-width="1.1"/><path d="M-6,-3 H2 M-2,-3 V2 L-3.5,2" fill="none" stroke-width="1"/><path d="M5,-2 L10,-7" fill="none" stroke="#7a5235" stroke-width="1.6"/><rect x="8" y="-9" width="4" height="3" rx=".8" transform="rotate(45 10 -7.5)" fill="#9aa0a4" stroke-width=".9"/>`,
 anchor:`<circle cy="-5.5" r="1.8" fill="none" stroke-width="1.3"/><path d="M0,-3.7 V6 M-3.5,-1.5 H3.5 M-6,2 Q-5,6 0,6 Q5,6 6,2" fill="none" stroke-width="1.4"/>`
};
const signIcon=(k,s=1,x=0,y=0)=>`<g transform="translate(${x},${y}) scale(${s})" stroke="${OL}">${SIGNICON[k]||''}</g>`;
const SIGNSAY={'海島':'往海島港口 →','小島':'往小島 →','農莊':'往東方農莊 →','遺跡':'往森林古代遺跡 →','纜車':'往纜車站 →','溫泉':'往溫泉 →','滑雪場':'往滑雪場 →','小鎮':'往奇幻小鎮 →','往小鎮':'往奇幻小鎮 →'};
const SIGNKEY={'海島':'island','小島':'island','農莊':'farm','遺跡':'ruins','纜車':'cable','溫泉':'onsen','滑雪場':'ski','小鎮':'town','往小鎮':'town'};
const signpost=t=>`<g data-say="${SIGNSAY[t]||t}"></g><path d="M0,0 V-40" fill="none" stroke="#7a5235" stroke-width="3"/><path d="M-22,-48 L16,-48 L24,-39 L16,-30 L-22,-30Z" fill="#d4ac52"/>${signIcon(SIGNKEY[t]||'town',1.12,-1,-39)}`;
/* ================= buildings & props ================= */
function shade(hex,a){const n=parseInt(hex.slice(1),16);let R=n>>16,G=n>>8&255,B=n&255;const t=a<0?0:255,q=Math.abs(a);R=Math.round(R+(t-R)*q);G=Math.round(G+(t-G)*q);B=Math.round(B+(t-B)*q);return '#'+((1<<24)+(R<<16)+(G<<8)+B).toString(16).slice(1)}
function wob(pts,amt=1.1){return pts.map((p,i)=>(i?'L':'M')+f(p[0]+sr(-amt,amt))+','+f(p[1]+sr(-amt,amt))).join('')+'Z'}
const DK='#2b2420';
const faceHead=(o={})=>{const hs=ri(0,4);return headG(`<circle cy="-35" r="13" fill="${pk(SKIN)}"/>`+HAIRS[hs](pk(HAIR))+face(o.mood??ri(0,3))+(r()<.3?HATS[ri(0,5)]():''))};
const peekHead=(x,y,s,hands)=>`<g transform="translate(${f(x)},${f(y)}) scale(${s})"><g transform="translate(0,34)">${faceHead()}</g>${hands?`<circle cx="-11" cy="13" r="4" fill="${pk(SKIN)}"/><circle cx="11" cy="13" r="4" fill="${pk(SKIN)}"/>`:''}</g>`;

function windowEl(x,y,w,h,lit,peek){
 let g=`<rect x="${f(x-w/2)}" y="${f(y-h/2)}" width="${f(w)}" height="${f(h)}" rx="2" fill="${lit?'#f0cd78':'#3d3833'}"/>`;
 if(peek)g+=`<g transform="translate(${f(x)},${f(y+h/2-3)}) scale(.55)">${headOnly()}</g>`;
 else g+=`<path d="M${f(x)},${f(y-h/2)} V${f(y+h/2)} M${f(x-w/2)},${f(y)} H${f(x+w/2)}" fill="none" stroke-width="1.4"/>`;
 g+=`<path d="M${f(x-w/2-2)},${f(y+h/2+1.5)} H${f(x+w/2+2)}" fill="none" stroke-width="2.6"/>`;
 return g;
}
function scallops(x0,x1,y,step=9){let d=`M${f(x0)},${f(y)}`;for(let x=x0;x<x1-1;x+=step)d+=` q${step/2},5 ${step},0`;return `<path d="${d}" fill="none" stroke-width="1.3"/>`}
function house(w,h,o={}){
 const rh=o.rh||w*sr(.5,.75),wall=o.wall||pk(WALL),roof=o.roof||pk(ROOF),sd=Math.round(w*.26),sy=sd*.5,ov=8;
 const wallD=shade(wall,-.24),roofD=shade(roof,-.3);let g='';
 g+=`<path d="M${-w/2-4},1 L${w/2+sd+4},${f(-sy+1)} L${w/2+sd+16},6 L${-w/2+8},10Z" fill="#000" opacity=".16" stroke="none"/>`;
 if(r()<.6){const cx=w*.14;g+=`<path d="${wob([[cx,-h-rh*.45],[cx,-h-rh*1.02],[cx+12,-h-rh*1.02],[cx+12,-h-rh*.35]],.8)}" fill="#946a4c"/><path d="M${f(cx)},${f(-h-rh*1.02+6)} h12" fill="none" stroke-width="1"/>`;
  if(r()<.5)g+=`<path d="M${f(cx+6)},${f(-h-rh*1.08)} q-6,-8 0,-14 q6,-6 0,-14" fill="none" stroke="#9a9488" stroke-width="2.4" opacity=".7"/>`}
 g+=`<path d="${wob([[w/2,0],[w/2+sd,-sy],[w/2+sd,-h-sy],[w/2,-h]])}" fill="${wallD}"/>`;
 let hd='';for(let i=0;i<5;i++){const y=-h*.15-i*h*.17;hd+=`M${f(w/2+3)},${f(y)} l${f(sd-6)},${f(-(sd-6)*.5)} `}
 g+=`<path d="${hd}" fill="none" stroke-width=".9" opacity=".55"/>`;
 if(r()<.5)g+=`<path d="M${f(w/2+sd*.3)},${f(-h*.45)} l${f(sd*.4)},${f(-sd*.2)} v12 l${f(-sd*.4)},${f(sd*.2)}Z" fill="${r()<.5?'#f0cd78':'#3d3833'}"/>`;
 g+=`<path d="${wob([[0,-h-rh],[sd,-h-rh-sy],[w/2+ov+sd,-h+2-sy],[w/2+ov,-h+2]])}" fill="${roofD}"/>`;
 for(let k=1;k<4;k++){const t=k/4;g+=`<path d="M${f(sd*(1-t)+(w/2+ov+sd)*t-sd)},${f((-h-rh)*(1-t)+(-h+2)*t)} l${f(sd)},${f(-sy)}" fill="none" stroke-width="1" opacity=".6"/>`}
 g+=`<path d="${wob([[-w/2,0],[-w/2,-h],[w/2,-h],[w/2,0]])}" fill="${wall}"/>`;
 g+=`<path d="M${-w/2+1},${-h+1} L${w/2-1},${-h+1} L${w/2-1},${-h+10} Q0,${-h+5} ${-w/2+1},${-h+8}Z" fill="${shade(wall,-.55)}" stroke="none"/>`;
 let bd='';for(let i=0;i<Math.floor(w*h/700);i++){const x=sr(-w/2+5,w/2-12),y=sr(-h+16,-5);bd+=`M${f(x)},${f(y)} h${f(sr(4,9))} `}
 g+=`<path d="${bd}" fill="none" stroke-width=".9" opacity=".6"/>`;
 if(r()<.4)g+=`<path d="M${f(-w/2)},${f(-h*.55)} H${f(w/2)} M${f(-w/2+12)},${f(-h)} V0 M${f(w/2-12)},${f(-h)} V0" fill="none" stroke="#7a5235" stroke-width="2.5"/>`;
 g+=`<path d="${wob([[-w/2-ov,-h+2],[0,-h-rh],[w/2+ov,-h+2]])}" fill="${roof}"/>`;
 for(let k=1;k<4;k++){const yy=-h-rh*k/4+2,half=(w/2+ov)*(1-k/4);g+=scallops(-half+2,half-2,yy)}
 g+=`<path d="M${f(-w/2-ov+3)},${f(-h+3)} H${f(w/2+ov-3)}" fill="none" stroke-width="3.2"/>`;
 const cols=Math.max(1,Math.floor(w/38)),rows=Math.max(1,Math.floor((h-30)/34));
 const doorX=f(sr(-w/2+18,w/2-18));
 for(let rr=0;rr<rows;rr++)for(let cc=0;cc<cols;cc++){const wx=-w/2+w*(cc+.5)/cols,wy=-h+22+rr*34;if(rr===rows-1&&Math.abs(wx-doorX)<20&&wy>-40)continue;g+=windowEl(wx,wy,14,17,r()<.45,r()<.3)}
 if(r()<.35){g+=`<path d="M${doorX-9},0 L${doorX-9},-20 Q${doorX},-30 ${doorX+9},-20 L${doorX+9},0Z" fill="${DK}"/>`+(r()<.6?peekHead(doorX,-12,.42,false):'')+`<path d="M${doorX-9},0 L${doorX-16},-3 L${doorX-16},-22 L${doorX-9},-20Z" fill="#7a4e32"/>`}
 else g+=`<path d="M${doorX-9},0 L${doorX-9},-20 Q${doorX},-30 ${doorX+9},-20 L${doorX+9},0Z" fill="#7a4e32"/><path d="M${doorX-3},-25 V0 M${doorX+3},-25 V0" fill="none" stroke-width=".9"/><circle cx="${doorX+5}" cy="-10" r="1.4" fill="#e8b93a"/>`;
 g+=`<path d="M${doorX-12},1 h24" fill="none" stroke-width="3"/>`;
 if(r()<.4)g+=`<rect x="${f(-w/2+6)}" y="${f(-h+32)}" width="20" height="6" fill="#a8703f"/><g stroke="none">${[0,1,2].map(i=>`<circle cx="${f(-w/2+10+i*6)}" cy="${f(-h+30)}" r="3" fill="${pk(['#c4473c','#e3a89e','#d4ac52','#f1ead8'])}"/>`).join('')}</g>`;
 if(o.sign)g+=`<path d="M${f(-w/2)},${f(-h+18)} H${f(-w/2-14)}" fill="none" stroke-width="2.4"/><rect x="${f(-w/2-24)}" y="${f(-h+20)}" width="20" height="14" rx="2" fill="#d4ac52"/>`;
 return `<g transform="skewX(${f(sr(-3.5,3.5))})">${g}</g>`;
}
function tower(w,h,o={}){
 const rh=o.rh||w*1.6,body=o.body||'#ead9b8',roof=o.roof||'#e8913a';let g='';
 g+=`<path d="M${-w/2},0 L${-w/2},${-h} L${w/2},${-h} L${w/2},0 Q0,6 ${-w/2},0Z" fill="${body}"/>`;
 g+=`<path d="M${f(w*.12)},${-h} L${w/2},${-h} L${w/2},0 Q${f(w*.3)},4 ${f(w*.12)},4Z" fill="${shade(body,-.25)}" stroke="none"/>`;
 let th='';for(let i=0;i<Math.floor(h/14);i++)th+=`M${f(w*.2)},${f(-8-i*14)} l${f(w*.25)},-7 `;g+=`<path d="${th}" fill="none" stroke-width=".9" opacity=".5"/>`;
 g+=`<path d="M${-w/2},0 L${-w/2},${-h} L${w/2},${-h} L${w/2},0 Q0,6 ${-w/2},0Z" fill="none"/>`;
 for(let i=0;i<Math.floor(h/26);i++){const y=-14-i*26,x=sr(-w/2+6,w/2-16);g+=`<rect x="${f(x)}" y="${f(y)}" width="10" height="5" rx="1" fill="none" stroke-width="1.2"/>`}
 for(let i=0;i<Math.floor((h-20)/55);i++){const y=-h+28+i*55;g+=`<path d="M-6,${y+10} L-6,${y} Q0,${y-8} 6,${y} L6,${y+10}Z" fill="${r()<.5?'#f0cd78':'#3d3833'}"/>`}
 if(o.door)g+=`<path d="M-9,0 L-9,-22 Q0,-32 9,-22 L9,0Z" fill="#8a5a3a"/>`;
 g+=`<path d="M${-w/2-7},${-h+3} Q${-w/4},${-h-rh*.5} 0,${-h-rh} Q${w/4},${-h-rh*.5} ${w/2+7},${-h+3} Q0,${-h+9} ${-w/2-7},${-h+3}Z" fill="${roof}"/>`;
 g+=`<path d="M0,${-h-rh} Q${w/4},${-h-rh*.5} ${w/2+7},${-h+3} Q${f(w*.25)},${-h+7} ${f(w*.08)},${-h+8}Z" fill="${shade(roof,-.28)}" stroke="none"/><path d="M${-w/2-7},${-h+3} Q0,${-h+9} ${w/2+7},${-h+3}" fill="none" stroke-width="3"/>`;
 for(let k=1;k<4;k++){const yy=-h-rh*k/4.6,half=(w/2+5)*(1-k/4.2);g+=scallops(-half,half,yy,7)}
 if(o.flag!==false)g+=`<path d="M0,${-h-rh} L0,${-h-rh-22}" fill="none" stroke-width="2"/><g class="an a-flag" style="--d:${f(sr(1.2,2))}s;animation-delay:-${f(sr(0,2))}s"><path d="M0,${-h-rh-22} L16,${-h-rh-17} L0,${-h-rh-12}Z" fill="${o.flagC||'#c4572f'}"/></g>`;
 return g;
}
function castle(){
 let g='';
 g+=`<g transform="translate(0,-80)">${tower(80,150,{roof:'#6f7f9a',flagC:'#e0b44a'})}</g>`;
 let cren='';for(let x=-125;x<125;x+=18)cren+=`<rect x="${x}" y="-100" width="11" height="12" fill="#e2d2b0"/>`;
 g+=cren+`<rect x="-125" y="-90" width="250" height="90" fill="#e2d2b0"/>`;
 for(let i=0;i<14;i++)g+=`<rect x="${f(sr(-118,100))}" y="${f(sr(-82,-12))}" width="14" height="6" rx="1" fill="none" stroke-width="1.2"/>`;
 g+=`<path d="M-24,0 L-24,-44 Q0,-68 24,-44 L24,0Z" fill="#5a3a2a"/><path d="M-16,0 V-50 M-8,0 V-56 M0,0 V-58 M8,0 V-56 M16,0 V-50 M-24,-14 H24 M-24,-30 H24" fill="none" stroke="#c9a26a" stroke-width="1.6"/>`;
 g+=`<g transform="translate(-135,0)">${tower(58,160,{roof:'#c4572f'})}</g><g transform="translate(135,0)">${tower(58,160,{roof:'#c4572f',flagC:'#6fa8a0'})}</g>`;
 return g;
}
function windmill(){
 let g=`<path d="M-24,0 L-16,-90 L16,-90 L24,0Z" fill="#ead9b8"/><path d="M-20,-92 Q0,-120 20,-92Z" fill="#8a5a3a"/><path d="M-7,0 L-7,-18 Q0,-26 7,-18 L7,0Z" fill="#8a5a3a"/>`+windowEl(0,-55,12,14,true,false);
 g+=`<g transform="translate(0,-96) rotate(20)"><g class="an a-spin" style="--d:9s">`;
 for(let i=0;i<4;i++)g+=`<g transform="rotate(${i*90})"><path d="M0,0 L0,-62" fill="none" stroke-width="3"/><rect x="2" y="-60" width="14" height="44" fill="#fbf6ea"/><path d="M2,-49 H16 M2,-38 H16 M2,-27 H16" fill="none" stroke-width="1"/></g>`;
 return g+`</g><circle r="5" fill="#c4572f"/></g>`;
}
function mushHouse(){
 let g=`<path d="M-24,0 Q-28,-40 -18,-62 L18,-62 Q28,-40 24,0Z" fill="#f3e2c0"/><path d="M-8,0 L-8,-18 Q0,-28 8,-18 L8,0Z" fill="#8a5a3a"/>`+`<circle cx="12" cy="-40" r="6" fill="#f6d27a"/><path d="M12,-46 V-34 M6,-40 H18" fill="none" stroke-width="1.2"/>`;
 g+=`<path d="M-58,-55 Q-56,-108 0,-110 Q56,-108 58,-55 Q30,-46 0,-50 Q-30,-46 -58,-55Z" fill="#6a9c94"/><path d="M-56,-58 Q-30,-50 0,-53 Q30,-50 56,-58 Q50,-48 30,-46 Q0,-50 -30,-46 Q-50,-48 -56,-58Z" fill="${shade('#6a9c94',-.35)}" stroke="none"/><path d="M-16,-62 Q0,-56 16,-62 L18,-50 Q0,-46 -18,-50Z" fill="#00000033" stroke="none"/><g fill="#fbf6ea" stroke-width="1.4">${[[-34,-78,9],[-6,-96,7],[22,-82,10],[44,-64,5],[-46,-62,5],[2,-66,6]].map(([x,y,s])=>`<circle cx="${x}" cy="${y}" r="${s}"/>`).join('')}</g>`;
 return g;
}
function pine(){const c=pk(['#56603a','#646f40','#727e46']),d=shade(c,-.32);let g=`<ellipse cx="4" cy="1" rx="24" ry="5" fill="#000" opacity=".2" stroke="none"/><rect x="-4" y="-16" width="8" height="16" fill="#7a5235"/>`;
 [[-24,-14,-50],[-20,-38,-74],[-15,-62,-96]].forEach(([b,y,a])=>{const P=`M${b},${y} L0,${a} L${-b},${y}Q0,${y+6} ${b},${y}Z`;g+=`<path d="${P}" fill="${c}" stroke="none"/><path d="M0,${a} L${-b},${y} Q${-b/2},${y+4} 0,${y+5}Z" fill="${d}" stroke="none"/><path d="M${b*.4},${y-4} l4,-6 M${b*.1},${y-9} l3,-5" fill="none" stroke-width=".9"/><path d="${P}" fill="none"/>`});
 return g}
function roundTree(){const c=pk(['#86925a','#76824e','#98a266']),d=shade(c,-.32);const C='M-30,-40 Q-38,-58 -24,-66 Q-22,-88 0,-86 Q22,-90 26,-68 Q40,-58 30,-40 Q14,-30 0,-34 Q-16,-30 -30,-40Z';
 return `<ellipse cx="6" cy="1" rx="28" ry="6" fill="#000" opacity=".2" stroke="none"/><path d="M-6,0 Q-9,-18 -3,-36 L4,-36 Q1,-18 7,0Z" fill="#7a5235"/><path d="M-2,-8 q2,-6 0,-12 M2,-20 q2,-5 0,-10" fill="none" stroke-width=".9"/><path d="${C}" fill="${c}" stroke="none"/><path d="M-30,-40 Q-14,-30 0,-34 Q14,-30 30,-40 Q36,-50 26,-56 Q10,-46 -4,-48 Q-20,-46 -30,-40Z" fill="${d}" stroke="none"/><path d="M10,-80 Q24,-82 26,-68 Q34,-62 32,-54 Q24,-64 14,-66Z" fill="${d}" stroke="none" opacity=".6"/><path d="${C}" fill="none"/><path d="M-14,-62 q4,-6 10,-2 M6,-74 q5,-4 9,1 M-20,-50 q3,-4 8,-1" fill="none" stroke-width="1.2"/>`}
const bush=()=>{const c=pk(['#76824e','#86925a','#646f40']),B='M-24,0 Q-30,-14 -18,-20 Q-14,-34 0,-30 Q14,-36 18,-20 Q30,-14 24,0Z';return `<path d="${B}" fill="${c}" stroke="none"/><path d="M-26,-6 Q-12,0 0,-4 Q14,0 26,-6 L24,0 L-24,0Z" fill="${shade(c,-.35)}" stroke="none"/><path d="${B}" fill="none"/><path d="M-8,-18 q3,-4 7,-1 M6,-12 q3,-4 7,0 M-16,-10 q3,-3 6,0" fill="none" stroke-width="1.1"/>`};
const barrel=()=>`<path d="M-11,0 Q-14,-13 -11,-26 L11,-26 Q14,-13 11,0Z" fill="#a8703f"/><path d="M-13,-8 H13 M-13,-18 H13" fill="none"/><ellipse cx="0" cy="-26" rx="11" ry="3" fill="#c99a5b"/>`;
/* 木板補給箱：橫木條＋鐵護角（不再畫 X） */
const crate=()=>`<path d="M-12,0 V-20 H12 V0Z" fill="#c99a5b"/><path d="M12,0 L16,-3 V-23 L12,-20Z" fill="#a8703f"/><path d="M-12,-20 L-8,-23 H16 L12,-20Z" fill="#d6a868"/><path d="M-12,-7 H12 M-12,-13.5 H12" fill="none" stroke="#8a6a3a" stroke-width="1.2"/><path d="M-12,-20 h4 v4 M12,-20 h-4 v4 M-12,0 h4 v-4 M12,0 h-4 v-4" fill="none" stroke="#5a5f64" stroke-width="2"/>`;
const pot=()=>{const c=pk(['#d8413a','#f0a8a0','#e0b44a','#9a6fa8','#fbf6ea']);return `<path d="M-9,-12 L-7,0 L7,0 L9,-12Z" fill="#c4704a"/><path d="M-11,-12 Q-14,-26 -4,-24 Q0,-32 6,-24 Q14,-26 11,-12Z" fill="#7f8d48"/><circle cx="-4" cy="-22" r="3" fill="${c}"/><circle cx="5" cy="-20" r="3" fill="${c}"/>`};
const lamp=()=>`<path d="M0,0 V-62" fill="none" stroke-width="3"/><path d="M-7,-62 L7,-62 L5,-76 L-5,-76Z" fill="#f6d27a"/><path d="M-9,-76 L0,-82 L9,-76Z" fill="#3a4250"/>`;
const rock=()=>`<path d="M-16,0 Q-18,-10 -8,-15 Q4,-20 12,-12 Q18,-6 16,0Z" fill="#b0a996"/><path d="M4,-16 Q14,-12 16,0 L6,0 Q8,-8 4,-16Z" fill="#7d776a" stroke="none"/><path d="M-16,0 Q-18,-10 -8,-15 Q4,-20 12,-12 Q18,-6 16,0Z" fill="none"/><path d="M-4,-10 q4,-2 7,1 M-10,-4 l3,-4" fill="none" stroke-width="1.1"/>`;
const reeds=()=>{let g='';for(let i=0;i<5;i++){const x=i*5-10,h=sr(24,38);g+=`<path d="M${x},0 q${f(sr(-4,4))},${f(-h/2)} ${f(sr(-5,5))},${f(-h)}" fill="none" stroke="#5f8f3f" stroke-width="2"/>`;if(i%2)g+=`<rect x="${x-2}" y="${f(-h-6)}" width="4.5" height="11" rx="2" fill="#7a5235" stroke-width="1.2"/>`}return g};
const lily=()=>`<ellipse cx="0" cy="0" rx="13" ry="6.5" fill="#7f9d48"/><path d="M0,0 L12,-2.5 M0,0 L-8,-4 M0,0 L-9,3 M0,0 L4,5" fill="none" stroke="#56603a" stroke-width="1"/>`+(r()<.3?`<g stroke-width="1.1"><ellipse cx="-2" cy="-3" rx="2.6" ry="4.5" fill="#f1ead8"/><ellipse cx="-5" cy="-1" rx="2.4" ry="4" fill="#f1ead8" transform="rotate(-35 -5 -1)"/><ellipse cx="1" cy="-1" rx="2.4" ry="4" fill="#f1ead8" transform="rotate(35 1 -1)"/><circle cx="-2" cy="-1" r="1.4" fill="#e3bb4a"/></g>`:'');
const bench=()=>`<rect x="-24" y="-22" width="48" height="6" rx="2" fill="#a0663f"/><rect x="-26" y="-11" width="52" height="6" rx="2" fill="#8a5434"/><path d="M-20,-5 V0 M20,-5 V0" fill="none" stroke-width="3"/>`;
const sign=()=>`<path d="M0,0 V-34" fill="none" stroke-width="3"/><path d="M-14,-40 L12,-40 L18,-34 L12,-28 L-14,-28Z" fill="#e0b44a"/><path d="M-12,-30 L10,-30 L4,-24 L-12,-24" fill="none" stroke-width="0"/>`;
const hay=()=>`<path d="M-22,0 Q-24,-28 0,-30 Q24,-28 22,0Z" fill="#e8c46a"/><path d="M-12,-6 l3,-10 M2,-4 l2,-14 M12,-8 l-2,-10" fill="none" stroke-width="1.2"/>`;
const fence=()=>`<path d="M-30,-10 H30 M-30,-18 H30" fill="none" stroke="#fbf6ea" stroke-width="3"/>`+[-26,-9,9,26].map(x=>`<rect x="${x-3}" y="-24" width="6" height="24" rx="1.5" fill="#fbf6ea"/>`).join('');
const well=()=>`<path d="M-24,0 L-24,-22 L24,-22 L24,0Z" fill="#b9b2a0"/><path d="M-24,-11 H24 M-8,-22 V-11 M10,-11 V0" fill="none" stroke-width="1.3"/><path d="M-20,-22 V-56 M20,-22 V-56" fill="none" stroke-width="3"/><path d="M-30,-52 L0,-72 L30,-52Z" fill="#c4572f"/>`;
const tent=c=>`<path d="M-34,0 L0,-52 L34,0Z" fill="${c}"/><path d="M0,-52 L-8,0 L8,0Z" fill="#3a2a22"/><path d="M0,-52 L0,-60" fill="none"/>`;
const campfire=()=>`<path d="M-14,0 L12,-6 M-12,-6 L14,0" fill="none" stroke="#7a5235" stroke-width="4"/><g class="an a-fire" style="--d:.7s"><path d="M-9,-4 Q-12,-18 -2,-26 Q0,-16 4,-20 Q12,-12 8,-4Z" fill="#e8913a"/><path d="M-3,-5 Q-4,-12 1,-16 Q3,-10 4,-6Z" fill="#f5c842" stroke-width="1"/></g>`;
const swirl=s=>`<path d="M-50,10 Q-62,-8 -42,-18 Q-40,-38 -14,-34 Q0,-52 22,-36 Q46,-42 48,-16 Q68,-8 54,10Z" fill="#fbf6ea"/><path d="M-22,-6 q-3,-14 11,-13 q10,3 4,12 q-6,4 -8,-2" fill="none" stroke-width="1.8"/><path d="M16,2 q0,-12 12,-10 q8,4 2,10" fill="none" stroke-width="1.8"/>`;
function balloon(c1,c2){return `<path d="M-10,22 L-6,40 M10,22 L6,40" fill="none" stroke-width="1.4"/><path d="M-30,-10 Q-30,-46 0,-46 Q30,-46 30,-10 Q28,10 10,24 L-10,24 Q-28,10 -30,-10Z" fill="${c1}"/><path d="M0,-46 Q-14,-20 -6,24 M0,-46 Q14,-20 6,24" fill="none" stroke-width="1.4"/><path d="M-12,-46 Q-24,-20 -14,18 M12,-46 Q24,-20 14,18" fill="${c2}" opacity="0" />`+`<g transform="translate(0,62) scale(.7)">${chibi({arm:2,hat:-1})}</g><rect x="-11" y="38" width="22" height="16" rx="2" fill="#a8703f"/>`}
function kayak(c){return `<path d="M-40,0 Q0,12 40,0 Q0,-8 -40,0Z" fill="${c}"/>`+`<g transform="translate(0,2) scale(.75)">${kid({pose:'hold'})}</g>`+limb('M-22,-30 L22,6','#c99a5b',2.6)+`<path d="M-26,-34 L-18,-26 M18,2 L26,10" fill="none" stroke="#c4572f" stroke-width="6"/>`}
function rowboat(){return `<path d="M-38,-6 Q0,20 38,-6 Z" fill="#a8703f"/><path d="M-32,-2 Q0,10 32,-2" fill="none" stroke-width="1.4"/>`+`<g transform="translate(-14,-4) scale(.75)">${kid({pose:'sit'})}</g><g transform="translate(14,-4) scale(-.75,.75)">${kid({pose:'sit'})}</g>${wrapAn('bob',bubble(0,-58,pk(['heart','note'])),true)}<path d="M-38,-6 Q0,20 38,-6 Q0,2 -38,-6Z" fill="#c99a5b"/>`}
/* 小渡輪（第 1 關港口伏筆、第 5 關碼頭、過場共用） */
function ferry(ride){let s=`<path d="M-104,-20 L96,-20 Q112,-20 104,-6 L92,8 Q0,16 -92,8 Z" fill="#fbf9f3"/><path d="M-100,-8 L102,-8 L92,8 Q0,16 -92,8Z" fill="#3b5a8a"/><path d="M-98,-14 H100" fill="none" stroke="#d8413a" stroke-width="3"/>`;
 s+=`<rect x="-70" y="-58" width="130" height="38" fill="#fbf9f3"/><path d="M60,-58 L76,-20 H60Z" fill="#e6e0d0"/>`+[-58,-40,-22,-4,14,32].map(x=>`<rect x="${x}" y="-50" width="12" height="11" rx="2" fill="#9fd3e0" stroke-width="1.3"/>`).join('');
 s+=`<rect x="-40" y="-84" width="74" height="26" fill="#fbf9f3"/>`+[-32,-14,4,20].map(x=>`<rect x="${x}" y="-78" width="10" height="9" rx="2" fill="#9fd3e0" stroke-width="1.2"/>`).join('')+`<path d="M-46,-84 H40" fill="none" stroke-width="2.6"/>`;
 s+=`<path d="M-24,-84 L-20,-112 H-4 L0,-84Z" fill="#d8413a"/><path d="M-21,-104 H-3" fill="none" stroke="#3d3833" stroke-width="3"/>`+`<path d="M-70,-58 V-62 H60 V-58" fill="none" stroke-width="1.4"/><path d="M-70,-66 H60" fill="none" stroke-width="1.2"/>`;
 s+=`<circle cx="-82" cy="-30" r="6" fill="none" stroke="#d8413a" stroke-width="3"/>${signIcon('anchor',.9,0,-27)}`;
 if(ride)s+=`<g class="an a-float" style="--d:3s"><path d="M-10,-130 q6,-4 10,0 q6,-4 10,0" fill="none" stroke-width="1.6"/></g>`;
 return s+`<path d="M-118,12 q10,-5 20,0 q10,5 20,0 M80,12 q10,-5 20,0 q10,5 20,0" fill="none" stroke="#e8f6f6" stroke-width="2"/>`}
function sailboat(){return `<path d="M0,-6 V-70" fill="none" stroke-width="3"/><path d="M3,-66 L36,-14 L3,-14Z" fill="#fbf6ea"/><path d="M-3,-60 L-30,-18 L-3,-18Z" fill="#c4572f"/><path d="M-44,-8 L44,-8 L32,8 L-32,8Z" fill="#6f7f9a"/><path d="M-36,0 H36" fill="none" stroke="#fbf6ea" stroke-width="2"/>`}
function stall(kind){
 const aw={fish:'aw2',potion:'aw4',bread:'aw3',pumpkin:'aw1',veg:'aw2',fruit:'aw1',cocoa:'aw1',knit:'aw4'}[kind];
 let g=`<path d="M-48,0 V-62 M48,0 V-62" fill="none" stroke-width="4"/><rect x="-52" y="-34" width="104" height="34" fill="#c99a5b"/><path d="M-52,-24 H52 M-52,-12 H52" fill="none" stroke-width="1.2"/>`;
 g+=`<path d="M-58,-62 L58,-62 L52,-82 L-52,-82Z" fill="url(#${aw})"/><path d="M-58,-62 ${[...Array(8)].map((_,i)=>`q7.25,8 14.5,0`).join(' ')}" fill="url(#${aw})"/>`;
 g+=`<g transform="translate(0,-34) scale(.8)">${chibi({arm:1})}</g>`;
 const goods=[];
 for(let i=0;i<5;i++){const x=-40+i*20,y=-34;
  if(kind==='fish')goods.push(T(x,y-4,.7,DECOY.fishGrey));
  if(kind==='potion')goods.push(T(x,y-11,.6,i%2?DECOY.bottleG:DECOY.bottleB));
  if(kind==='bread')goods.push(T(x,y-6,.75,i%2?DECOY.cupcake:`<ellipse cx="0" cy="0" rx="10" ry="6" fill="#d9a05a"/><path d="M-4,-4 l2,4 M1,-5 l2,4" fill="none" stroke-width="1.2"/>`));
  if(kind==='pumpkin')goods.push(T(x,y-6,.75,DECOY.pumpkinPlain));
  if(kind==='veg')goods.push(T(x,y-8,.7,i%2?DECOY.whiteCarrot:`<circle r="8" fill="#9db86a"/><path d="M-4,-2 q4,-5 8,0" fill="none" stroke-width="1"/>`));
  if(kind==='fruit')goods.push(T(x,y-6,.75,DECOY.tomato));
  if(kind==='cocoa')goods.push(T(x,y-8,.7,DECOY.coffee));
  if(kind==='knit')goods.push(T(x,y-8,.7,[DECOY.beanieTeal,DECOY.scarfBlue,DECOY.mittenGreen,DECOY.beanieRed,DECOY.mittenPlain][i]));}
 return g+goods.join('');
}
function fountain(){
 return `<ellipse cx="0" cy="-10" rx="80" ry="30" fill="#b9b2a0"/><ellipse cx="0" cy="-14" rx="68" ry="22" fill="#93c2bb"/><path d="M-40,-14 q6,-3 12,0 M14,-8 q6,-3 12,0" fill="none" stroke="#fbf6ea" stroke-width="1.6"/><path d="M-10,-14 L-8,-70 L8,-70 L10,-14Z" fill="#d6cdb8"/><ellipse cx="0" cy="-70" rx="26" ry="8" fill="#d6cdb8"/><path d="M0,-76 Q-30,-110 -46,-30 M0,-76 Q30,-110 46,-30 M0,-76 Q-4,-104 -18,-40 M0,-76 Q4,-104 18,-40" fill="none" stroke="#7fb8c8" stroke-width="3"/><circle cx="0" cy="-80" r="6" fill="#d6cdb8"/>`;
}
function lighthouse(){return `<path d="M-26,0 Q-34,-14 -18,-22 Q0,-30 22,-22 Q36,-12 26,0Z" fill="#9a9a8a"/>`+`<g transform="translate(0,-18)"><path d="M-16,0 L-11,-110 L11,-110 L16,0Z" fill="#fbf6ea"/><path d="M-15,-22 L15,-22 L14,-42 L-14,-42Z M-13,-64 L13,-64 L12,-86 L-12,-86Z" fill="#c4572f"/><rect x="-14" y="-128" width="28" height="18" fill="#f6d27a"/><path d="M-18,-128 L0,-146 L18,-128Z" fill="#c4572f"/><path d="M-20,-110 H20" fill="none" stroke-width="3"/></g>`}


/* ================= L3 雪山溫泉村 props ================= */
const SNOW='#fbf9f3';
function pineS(){const c=pk(['#4f6a4a','#56703f','#5f7a4a']),d=shade(c,-.3);let g=`<ellipse cx="3" cy="1" rx="22" ry="5" fill="#c9d6dc" opacity=".6" stroke="none"/><rect x="-4" y="-14" width="8" height="15" fill="#7a5235"/>`;
 [[24,-12,38],[19,-36,34],[14,-58,30]].forEach(([w,y,h])=>{g+=`<path d="M${-w},${y} L0,${y-h} L${w},${y}Z" fill="${c}"/><path d="M0,${y-h} L${w},${y} L${f(w*.3)},${y}Z" fill="${d}" stroke="none"/><path d="M${f(-w*.55)},${f(y-h*.45)} Q${f(-w*.25)},${f(y-h*.33)} 0,${f(y-h*.48)} Q${f(w*.25)},${f(y-h*.33)} ${f(w*.55)},${f(y-h*.45)} L0,${y-h}Z" fill="${SNOW}"/>`});
 return g}
function cabinSVG(c,ppl){let g=`<g><animateTransform attributeName="transform" type="rotate" values="-4;4;-4" dur="3.2s" repeatCount="indefinite"/>`;
 g+=`<path d="M0,0 V13" fill="none" stroke-width="2.2"/><rect x="-7" y="-3" width="14" height="5" rx="2" fill="#8a8f94"/>`;
 g+=`<path d="M-18,12 H18 Q22,12 22,16 L20,40 Q0,46 -20,40 L-22,16 Q-22,12 -18,12Z" fill="${c}"/><path d="M-21,33 Q0,37 21,33" fill="none" stroke="#fbf6ea" stroke-width="2"/>`;
 g+=`<rect x="-16" y="16" width="14" height="12" rx="2" fill="#d6ecf0"/><rect x="2" y="16" width="14" height="12" rx="2" fill="#d6ecf0"/>`;
 if(ppl)[[-9,'#d98c46'],[9,'#6fa8a0']].forEach(([x,hc])=>g+=`<circle cx="${x}" cy="26" r="4.6" fill="${pk(SKIN)}" stroke-width="1.1"/><path d="M${x-4.8},24.5 Q${x},16 ${x+4.8},24.5Z" fill="${hc}" stroke-width="1"/><circle cx="${x}" cy="18.5" r="1.6" fill="#fbf6ea" stroke-width=".8"/>`);
 return g+'</g>'}
const steamPuff=()=>`<g fill="#ffffff" opacity=".8" stroke="none"><circle cx="-8" cy="-10" r="9"/><circle cx="4" cy="-17" r="11"/><circle cx="13" cy="-8" r="7"/></g>`;
const KIND={
 cat:{w:24,h:30,fn:()=>cat(pk(['#e8913a','#fbf6ea','#c9c2b6','#d9a05a']))},dog:{w:44,h:36,fn:()=>dog()},
 chicken:{w:24,h:28,fn:chicken},sheep:{w:34,h:28,fn:sheep},frog:{w:22,h:18,fn:frog},owl:{w:22,h:26,fn:owl},
 pine:{w:50,h:98,fn:pine},round:{w:64,h:88,fn:roundTree},bush:{w:52,h:32,fn:bush},rock:{w:34,h:20,fn:rock},
 barrel:{w:26,h:28,fn:barrel},crate:{w:26,h:24,fn:crate},pot:{w:24,h:30,fn:pot},lamp:{w:18,h:82,fn:lamp},
 bench:{w:52,h:24,fn:bench},sign:{w:34,h:42,fn:sign},hay:{w:46,h:30,fn:hay},fence:{w:62,h:24,fn:fence},reeds:{w:28,h:40,fn:reeds},
 lily:{w:30,h:14,fn:lily,water:true},seaFish:{w:32,h:16,fn:()=>T(0,-6,1,DECOY.fishGrey,r()<.5),water:true},koi:{w:32,h:16,fn:()=>T(0,-6,1,DECOY.koi,r()<.5),water:true},
 flowersY:{w:30,h:18,fn:()=>T(0,-8,.9,DECOY.flowersY)},note:{w:20,h:22,fn:()=>T(0,-11,.9,DECOY.note)},
 keyGrey:{w:32,h:14,fn:()=>`<g transform="translate(0,-7) rotate(${ri(-40,40)})">${DECOY.keyGrey}</g>`},
 hatBrown:{w:34,h:26,fn:()=>T(0,-13,1,DECOY.hatBrown)},hatGreen:{w:34,h:26,fn:()=>T(0,-13,1,DECOY.hatGreen)},
 bottleG:{w:22,h:32,fn:()=>T(0,-15,1,DECOY.bottleG)},bottleB:{w:22,h:32,fn:()=>T(0,-15,1,DECOY.bottleB)},
 mushTan:{w:30,h:28,fn:()=>T(0,-13,.9,DECOY.mushTan)},mushBrown:{w:30,h:28,fn:()=>T(0,-13,.9,DECOY.mushBrown)},
 pumpkinPlain:{w:30,h:24,fn:()=>T(0,-11,1,DECOY.pumpkinPlain)},cupcake:{w:20,h:22,fn:()=>T(0,-10,1,DECOY.cupcake)},
 umbYellow:{w:34,h:34,fn:()=>T(0,-17,1,DECOY.umbYellow)},umbRed:{w:34,h:34,fn:()=>T(0,-17,1,DECOY.umbRed)}
};
Object.assign(KIND,VIG);
Object.assign(KIND,{cow:{w:46,h:38,fn:cow},pig:{w:34,h:26,fn:pig},
 whiteCarrot:{w:20,h:30,fn:()=>T(0,-12,.9,DECOY.whiteCarrot)},tomato:{w:18,h:18,fn:()=>T(0,-8,.8,DECOY.tomato)},bucket:{w:22,h:24,fn:()=>T(0,-4,1,DECOY.bucket)}});
Object.assign(KIND,{
 grassClump:{w:20,h:16,fn:()=>`<path d="M-8,0 q2,-8 4,-12 M-3,0 q0,-10 1,-14 M2,0 q1,-8 4,-11 M7,0 q1,-6 3,-8" fill="none" stroke="#56603a" stroke-width="1.6"/>`+(r()<.5?`<circle cx="-2" cy="-14" r="2.4" fill="${pk(['#e3a89e','#f1ead8','#c58be0'])}" stroke-width="1"/>`:'')},
 pebbles:{w:20,h:8,fn:()=>`<ellipse cx="-6" cy="-2" rx="4" ry="2.6" fill="#b0a996" stroke-width="1.3"/><ellipse cx="3" cy="-3" rx="3" ry="2" fill="#9d9684" stroke-width="1.3"/><ellipse cx="8" cy="-1" rx="2.4" ry="1.6" fill="#b0a996" stroke-width="1.3"/>`},
 crateStack:{w:28,h:46,fn:()=>crate()+`<g transform="translate(2,-22) scale(.85)">${crate()}</g>`},
 peekBush:{w:52,h:44,fn:()=>wrapAn('bob',peekHead(sr(-8,8),-26,.62,true),true)+bush()},
 peekBarrel:{w:28,h:40,fn:()=>wrapAn('hop',peekHead(0,-24,.58,true))+`<path d="M-11,0 Q-14,-13 -11,-26 L11,-26 Q14,-13 11,0Z" fill="#a8703f"/><path d="M-13,-8 H13 M-13,-18 H13" fill="none"/><path d="M4,-25 Q10,-13 6,-1" fill="none" stroke-width=".9"/>`},
 peekCrate:{w:28,h:38,fn:()=>wrapAn('bob',peekHead(sr(-4,4),-20,.55,false))+crate()}
});
