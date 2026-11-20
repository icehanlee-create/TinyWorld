/* 奇幻小鎮大搜查．海底世界（找路發現的新關卡，編號 16 只是程式用）
   入口：第 5 關海島港口。第 10 關 2 星後，點燈塔 → 光束轉到南邊外海、停在紅色打撈船上，船長頭上出現「…」；
   點船長 →「要坐潛水鐘下海嗎？」——程式在這個檔案最後面（H.EXITS[16]、TAPHOOKS[5] 包一層）。打撈船本身畫在 level5.js 的地面（一直都在，當佈景）。
   使用者 2026-11-18 定案：主線找物件關卡（秘境的搖桿游泳留給綠島之後的「海底 B」）；潛水鐘用 B 大頭盔款；
   穿著：大頭盔潛水員工作裝——一般人 C 多色連身工作服＋紅銅頭盔（側面小圓窗），修船／打撈的人 B 黃色工作服＋工具腰帶，研究員 D 黃銅頭盔＋頭燈＋背後氣管；
   場景：北＝斜插在沙裡的大沉船＋散落寶箱，後方深海很大的鯨魚；東＝彩色珊瑚礁、小丑魚、海葵；西＝海草森林、海龜、大岩拱上的大章魚；
   南＝潛水鐘降落點＋海底探險營地；上方透下來的光線＋水母群。先不畫在冒險地圖上（HERE、mapHook 都不設）。
   小故事「卡在沉船裡的小海豚」。彩蛋：點鯨魚噴水柱＋哼歌、點章魚噴墨臉紅。BORROW 不借。物件 id 和 kind 都以 16 結尾。 */
(function(){
const H=window.TH;if(!H)return;
const N=16;
const {T,f,r,sr,pk,ri,OL,SKIN,kid,act,add,mark,canPlace,scatter,KIND,POOL,VPLAN,REG,SCREG,LEVELS,ART,DECOY,
 SCENE_IMPL,WATERFN,RIDES,OUTFITS,STORIES,HOSTK,HOSTN,tone,typeOf,HATS}=H;

/* ================= 1. 場景範圍、深海、場地邊緣 ================= */
H.SCENES[N]={x0:600,x1:1900,y1:2150,c:[1250,1820]};
H.TARGET[N]=330;
H.SKYC[N]='#2a6d8e';H.SKYY[N]=0;
H.EDGEM[N]='';H.EDGED[N]='';
H.EDGEDECO[N]=[['kelp16',1],['rock16',1]];
H.FRINGE[N]=[['seagrass16',1.4],['rock16',.4]];
H.DENS[N]=1.1;
/* 場地外不用雲：改成深藍色的海水，兩邊是海草和岩石的剪影（core.js FOGFN） */
if(H.FOGFN)H.FOGFN[N]=({X0,X1,Y1,R})=>{const rr=(a,b)=>a+R()*(b-a),C='#14405e';
 const gd=(n,x1,x2,y1,y2)=>`<linearGradient id="${n}" x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}"><stop offset="0" stop-color="${C}" stop-opacity="1"/><stop offset=".45" stop-color="${C}" stop-opacity=".85"/><stop offset="1" stop-color="${C}" stop-opacity="0"/></linearGradient>`;
 let g=`<defs>${gd('wL16',0,1,0,0)+gd('wR16',1,0,0,0)+gd('wT16',0,0,0,1)+gd('wB16',0,0,1,0)}</defs><path d="M-6000,-4000 H8800 V5800 H-6000Z M${X0-295},-295 V${Y1+295} H${X1+295} V-295Z" fill="${C}" fill-rule="evenodd"/>`;
 g+=`<rect x="${X0-300}" y="-300" width="300" height="${Y1+600}" fill="url(#wL16)"/><rect x="${X1}" y="-300" width="300" height="${Y1+600}" fill="url(#wR16)"/><rect x="${X0-300}" y="-300" width="${X1-X0+600}" height="300" fill="url(#wT16)"/><rect x="${X0-300}" y="${Y1}" width="${X1-X0+600}" height="300" fill="url(#wB16)"/>`;
 g+=`<g stroke="#0c2c44" stroke-width="2" stroke-linejoin="round">`;
 /* 兩邊：搖擺的海草剪影 */
 for(let y=100;y<Y1+200;y+=rr(70,130))[X0-rr(120,260),X1+rr(120,260)].forEach(x=>{const h=rr(120,260);let d=`M${f(x)},${f(y)}`;for(let k=1;k<=5;k++)d+=` Q${f(x+(k%2?16:-16))},${f(y-h*(k-.5)/5)} ${f(x)},${f(y-h*k/5)}`;g+=`<path d="${d}" fill="none" stroke="${pk(['#1e5a5a','#245e4e','#1a504e'])}" stroke-width="${f(rr(6,10))}" stroke-linecap="round"/>`});
 /* 下面：岩石剪影 */
 for(let x=X0-260;x<X1+260;x+=rr(60,120)){const w=rr(40,90),h=rr(30,70),y=Y1+rr(180,240);g+=`<path d="M${f(x-w)},${f(y)} Q${f(x-w)},${f(y-h)} ${f(x)},${f(y-h)} Q${f(x+w)},${f(y-h)} ${f(x+w)},${f(y)}Z" fill="${pk(['#1e4660','#234c66','#1a3e58'])}"/>`}
 /* 上面：透下來的光 */
 for(let x=X0-200;x<X1+200;x+=rr(140,240))g+=`<path d="M${f(x)},-300 L${f(x+40)},-300 L${f(x+140)},-60 L${f(x+70)},-60Z" fill="#cfefff" opacity=".08" stroke="none"/>`;
 /* 小魚影 */
 [[X0-180,500],[X1+170,820],[X0-200,1400],[X1+190,1700]].forEach(([x,y])=>{g+=`<g opacity=".5" fill="#3a7a9a" stroke="none">${[0,1,2].map(i=>`<path d="M${x+i*16},${y+(i%2)*10} q8,-5 14,0 q-6,5 -14,0Z M${x+i*16+14},${y+(i%2)*10} l5,-4 v8Z"/>`).join('')}</g>`});
 return g+`</g>`};

/* ================= 2. 潛水員：大頭盔工作裝 =================
   頭盔畫在頭的座標裡（頭是 cy=-35 r=13 的圓），外圈 r16.5、窗 r10 往面向偏一點；窗是空心的，看得到臉。
   C＝紅銅頭盔＋多色連身工作服（一般潛水員）；B＝黃色工作服＋工具腰帶（修船／打撈）；D＝黃銅頭盔＋頭燈＋背後氣管（研究員）。頭盔裡一律短髮（hs:0）。 */
const GOLD='#e8c050';
const HCOL={c:{c:'#c8743a',d:'#a85a2a',hi:'#eea878'},b:{c:'#d8a840',d:'#b08428',hi:'#f6dc8a'}};
const VWX={front:0,fq:3.4,side:4.6,bq:0,back:0};
const helm=(v,k)=>{const C=HCOL[k],R=16.5,cy=-36,win=v==='front'||v==='fq'||v==='side',wx=VWX[v]||0,wr=v==='side'?9.6:10.2,wy=-34;
 let s=`<path d="M0,${cy+R+1} q-${R},0 -${R},-${R} a${R},${R} 0 1,1 ${R*2},0 q0,${R} -${R},${R}Z`+(win?` M${f(wx-wr)},${wy} a${wr},${wr} 0 1,1 ${f(wr*2)},0 a${wr},${wr} 0 1,1 ${f(-wr*2)},0Z`:'')+`" fill="${C.c}" fill-rule="evenodd"/>`;
 s+=`<path d="M-11.5,-46 Q-7,-51.4 0,-52" fill="none" stroke="${C.hi}" stroke-width="2.2" stroke-linecap="round"/>`;
 if(win){s+=`<circle cx="${wx}" cy="${wy}" r="${wr}" fill="#d8f4fa" fill-opacity=".22" stroke="${GOLD}" stroke-width="2.8"/><circle cx="${wx}" cy="${wy}" r="${f(wr+1.6)}" fill="none" stroke-width="1"/>`;
  if(v!=='side')s+=`<path d="M${wx},${wy-wr} V${f(wy-wr+3.4)} M${wx},${f(wy+wr)} V${f(wy+wr-3.4)} M${f(wx-wr)},${wy} H${f(wx-wr+3.4)} M${f(wx+wr)},${wy} H${f(wx+wr-3.4)}" fill="none" stroke="${GOLD}" stroke-width="1.8"/>`;
  s+=`<path d="M${f(wx-5)},${wy-6} Q${f(wx-2)},${wy-8.4} ${f(wx+1.6)},${wy-8.4}" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>`}
 /* 側面的小圓窗 */
 const side=v==='front'?[-15,15]:v==='fq'?[-13.4]:v==='side'?[-11.6]:v==='bq'?[12.6]:[-13,13];
 side.forEach(x=>s+=`<circle cx="${x}" cy="-37" r="3.1" fill="#9fd8e6" stroke="${GOLD}" stroke-width="1.6"/><circle cx="${x}" cy="-37" r="4.2" fill="none" stroke-width=".9"/>`);
 /* 底部深色鉚釘圈、頂端金色吊環 */
 s+=`<path d="M-15.4,-24 Q0,-19 15.4,-24 L14.6,-19.6 Q0,-14.6 -14.6,-19.6Z" fill="#5a4a42"/>`+[-10,-5,0,5,10].map(x=>`<circle cx="${x}" cy="${f(-19.6+Math.abs(x)*.12)}" r="1" fill="#d8b060" stroke="none"/>`).join('');
 s+=`<rect x="-3.4" y="-55.4" width="6.8" height="3.6" rx="1.2" fill="${GOLD}" stroke-width="1"/><circle cx="0" cy="-58.4" r="2.8" fill="none" stroke="${GOLD}" stroke-width="1.8"/><circle cx="0" cy="-58.4" r="2.8" fill="none" stroke-width=".7"/>`;
 /* 研究員：頭燈 */
 if(k==='b'&&v!=='back'&&v!=='bq'){const lx=v==='front'?0:v==='fq'?4:8;s+=`<circle cx="${lx}" cy="-50.5" r="5.6" fill="#fff6c0" opacity=".45" stroke="none"/><rect x="${lx-3.6}" y="-53.4" width="7.2" height="5.4" rx="1.6" fill="#4a4f5c" stroke-width="1"/><circle cx="${lx}" cy="-50.7" r="2" fill="#fffbe0" stroke="none"/>`}
 /* 往上飄的小氣泡 */
 s+=`<circle cx="9" cy="-60" r="1.8" fill="#e8fbff" stroke-width=".8"/><circle cx="12" cy="-66" r="1.3" fill="#e8fbff" stroke-width=".7"/>`;
 return s};
const HAT16={};['c','b'].forEach(k=>{HAT16[k]={};['front','fq','side','bq','back'].forEach(v=>{HAT16[k][v]=HATS.push(()=>helm(v,k))-1})});
const hatOf=(v,k='c')=>HAT16[k][v||'side']??HAT16[k].side;
/* 背後的氧氣瓶（正面看不到）、研究員的氣管、修船工的工具腰帶 */
const tank=(v,c='#e0b040')=>v==='side'?`<rect x="-15" y="-22" width="7" height="17" rx="3.4" fill="${c}"/><path d="M-14,-18 H-8.6" fill="none" stroke-width="1"/>`:
 v==='back'?`<rect x="-5" y="-22" width="10" height="16" rx="4" fill="${c}"/><path d="M-5,-17 H5" fill="none" stroke-width="1"/>`:v==='bq'?`<rect x="-7" y="-22" width="9" height="16" rx="4" fill="${c}"/>`:'';
const hose=v=>v==='side'?`<path d="M-12,-26 Q-17,-22 -13,-19" fill="none" stroke="#3a3a44" stroke-width="2.2"/>`:v==='back'||v==='bq'?`<path d="M-2,-26 Q-6,-24 -2,-21" fill="none" stroke="#3a3a44" stroke-width="2.2"/>`:'';
const BELT=`<rect x="-9" y="-9" width="18" height="3.4" rx="1" fill="#6a4a30" stroke-width="1.1"/><rect x="2.4" y="-7.6" width="5.4" height="5.2" rx="1" fill="#8a6a40" stroke-width="1"/><path d="M-6,-6 V0" fill="none" stroke="#9aa2ac" stroke-width="1.8"/><circle cx="-6" cy="0.6" r="1.6" fill="none" stroke="#9aa2ac" stroke-width="1.2"/>`;
const SUITC=['#e8823a','#3f7ab0','#4f9a5a','#2f9a9a','#c4473c','#7a5aa8'];
/* 一般穿著：v 是面向，job 是 'C'／'B'／'D' */
const diver=(v,job,suit)=>{const k=job==='D'?'b':'c',c=suit||(job==='B'?'#f2c230':job==='D'?'#e8e4da':pk(SUITC));
 return {hs:0,hat:hatOf(v,k),top:'long',bottom:'pants',shirt:c,pants:c,boots:'#3a3a44',extra:tank(v,job==='D'?'#9aa2ac':'#e0b040')+(job==='D'?hose(v):'')+(job==='B'?BELT:'')}};
OUTFITS[N]=o=>{if(o.top)return o;const v=o.view||'side',x=r(),job=x<.62?'C':x<.82?'B':'D',d=diver(v,job);
 o.skin=o.skin||pk(SKIN);o.hs=0;o.hat=d.hat;o.top='long';o.bottom='pants';o.shirt=d.shirt;o.pants=d.pants;o.boots=d.boots;o.extra=(o.extra||'')+d.extra;o.beard=false;
 return o};
/* 故事角色、人群用：指定面向、工作、顏色 */
const dv=(v,pose,job,suit,more={})=>({view:v,pose,...diver(v,job,suit),skin:more.skin||'#e8b890',mood:2,plain:true,...more,extra:diver(v,job,suit).extra+(more.extra||'')});

/* ================= 3. 物件與干擾物（12 種 × 4 個）：原圖最長邊約 34（細長的約 40），引擎會再縮 ================= */
const WOOD='#a8703f',WOOD2='#c99a5b';
Object.assign(ART,{
 /* 海盜金幣：兩枚疊在一起的金幣，前面那枚有骷髏頭 */
 coin16:`<circle cx="-5" cy="5" r="10.5" fill="#d8a020"/><circle cx="3" cy="-2" r="12" fill="#f2c230"/><circle cx="3" cy="-2" r="9" fill="none" stroke="#d8a020" stroke-width="1.6"/>`+
  `<g fill="#c8901a" stroke="none"><circle cx="3" cy="-4" r="4.2"/><rect x="0.4" y="-1.6" width="5.2" height="3" rx="1"/></g><circle cx="1.4" cy="-4.4" r="1.2" fill="#f2c230" stroke="none"/><circle cx="4.6" cy="-4.4" r="1.2" fill="#f2c230" stroke="none"/><path d="M-2,3 L8,7 M8,3 L-2,7" fill="none" stroke="#c8901a" stroke-width="1.6"/><path d="M-4,-8 Q-1,-12 4,-12" fill="none" stroke="#fff6c0" stroke-width="1.8" stroke-linecap="round"/>`,
 /* 小寶箱：拱形蓋子、金色鐵條、鎖頭，縫裡閃一點金光 */
 chest16:`<rect x="-15" y="-3" width="30" height="15" rx="2" fill="#8a5a32"/><path d="M-15,-3 V-8 Q-15,-17 0,-17 Q15,-17 15,-8 V-3Z" fill="#a8703f"/><path d="M-15,-3 H15" fill="none" stroke-width="2"/>`+
  `<path d="M-10,-15.4 V12 M10,-15.4 V12" fill="none" stroke="${OL}" stroke-width="5"/><path d="M-10,-15.4 V12 M10,-15.4 V12" fill="none" stroke="#f2c230" stroke-width="3"/><rect x="-3.6" y="-7" width="7.2" height="8" rx="1.4" fill="#f2c230" stroke-width="1.4"/><circle cx="0" cy="-3.6" r="1.2" fill="${OL}" stroke="none"/>`+
  `<path d="M-14,-4.4 h3 M5,-4.4 h3" fill="none" stroke="#fff3a0" stroke-width="1.6" stroke-linecap="round"/><path d="M14,-14 l1.4,-3 l1.4,3 l3,1.4 l-3,1.4 l-1.4,3 l-1.4,-3 l-3,-1.4Z" fill="#fff6c0" stroke-width=".9"/>`,
 /* 船舵：木頭圓圈、八根輪輻，外面有把手 */
 helm16:[0,45,90,135,180,225,270,315].map(a=>{const t=a*Math.PI/180,c=Math.cos(t),s=Math.sin(t);return `<path d="M${f(c*4)},${f(s*4)} L${f(c*15.5)},${f(s*15.5)}" fill="none" stroke="${OL}" stroke-width="4.6" stroke-linecap="round"/><path d="M${f(c*4)},${f(s*4)} L${f(c*15.5)},${f(s*15.5)}" fill="none" stroke="${WOOD2}" stroke-width="2.6" stroke-linecap="round"/><circle cx="${f(c*16)}" cy="${f(s*16)}" r="2.6" fill="${WOOD}" stroke-width="1.3"/>`}).join('')+
  `<circle r="10" fill="none" stroke="${OL}" stroke-width="6.4"/><circle r="10" fill="none" stroke="${WOOD}" stroke-width="4"/><circle r="4.4" fill="#d8a840" stroke-width="1.6"/><circle r="1.4" fill="${OL}" stroke="none"/>`,
 /* 藏寶圖：泛黃的羊皮紙，小島、虛線小路、紅色叉叉 */
 tmap16:`<g transform="rotate(-8)"><path d="M-16,-12 L-10,-13 L-4,-11 L4,-13 L10,-11 L16,-12 L15,-4 L16,4 L15,12 L8,11 L0,13 L-8,11 L-16,12 L-15,4 L-16,-4Z" fill="#efd9a0"/><path d="M-10,2 Q-12,-6 -4,-7 Q4,-9 8,-3 Q12,4 4,7 Q-6,9 -10,2Z" fill="#9ac07a" stroke-width="1.2"/>`+
  `<path d="M-14,9 Q-8,4 -3,2 Q2,0 3,-3" fill="none" stroke="#8a5a32" stroke-width="1.4" stroke-dasharray="2 2"/><path d="M1,-6 L6,-1 M6,-6 L1,-1" fill="none" stroke="#d8413a" stroke-width="2.4" stroke-linecap="round"/><path d="M10,-9 v5 M7.6,-6.4 h5" fill="none" stroke="#8a5a32" stroke-width="1.1"/></g>`,
 /* 船用油燈：黃銅底座、玻璃燈罩裡有火、頂上提環 */
 oillamp16:`<circle cx="0" cy="-1" r="14" fill="#fff3b0" opacity=".45" stroke="none"/><circle cx="0" cy="-19" r="4" fill="none" stroke="${OL}" stroke-width="3.6"/><circle cx="0" cy="-19" r="4" fill="none" stroke="#d8a840" stroke-width="1.8"/>`+
  `<path d="M-7,-10 Q-12,-1 -7,9 H7 Q12,-1 7,-10Z" fill="#fff6d0"/><path d="M-3.4,-9 V8 M3.4,-9 V8" fill="none" stroke="#b08428" stroke-width="1.2"/><ellipse cx="0" cy="0" rx="2.8" ry="5" fill="#f5a030" stroke-width="1"/><ellipse cx="0" cy="1" rx="1.2" ry="2.4" fill="#fff3a0" stroke="none"/>`+
  `<path d="M-8,-10 H8 L5.6,-15 H-5.6Z" fill="#d8a840"/><path d="M-10,9 H10 L8,15 H-8Z" fill="#d8a840"/><path d="M-9,12 H9" fill="none" stroke="#b08428" stroke-width="1.2"/>`,
 /* 海螺號角：粉白色的大海螺，尖端套著黃銅吹口 */
 conch16:`<path d="M-18,6 Q-12,-2 0,-10 Q10,-15 16,-8 Q20,0 14,9 Q6,15 -6,12 Z" fill="#f4dcc4"/><path d="M14,-8 Q20,0 14,9 Q8,6 8,0 Q8,-6 14,-8Z" fill="#f0a0a8"/>`+
  `<path d="M-10,2 Q-6,10 2,10 M-4,-4 Q0,6 6,7 M2,-9 Q4,0 9,2" fill="none" stroke="#d8a888" stroke-width="1.4"/><path d="M-6,-7 l-2,-4 M2,-12 l0,-4 M8,-14 l2,-3" fill="none" stroke-width="1.6" stroke-linecap="round"/>`+
  `<path d="M-18,6 L-24,9 L-22,3Z" fill="#d8a840" stroke-width="1.4"/><path d="M-6,-9 Q0,-12 6,-12" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>`,
 /* 鸚鵡螺殼：捲成一圈的白殼，外圈有橘褐色虎斑 */
 nautilus16:`<path d="M2,-14 Q16,-14 16,0 Q16,14 0,14 Q-14,14 -15,2 Q-15,-8 -6,-9 Q-12,-2 -8,4 Q-2,10 4,4 Q9,-2 2,-6 Z" fill="#f6ead6"/>`+
  `<path d="M6,-13 Q4,-6 9,-4 M12,-9 Q8,-2 13,2 M14,4 Q8,4 9,10 M6,12 Q4,6 0,10 M-6,12 Q-4,6 -10,6" fill="none" stroke="#c8703a" stroke-width="2.6" stroke-linecap="round"/>`+
  `<path d="M2,-14 Q16,-14 16,0 Q16,14 0,14 Q-14,14 -15,2 Q-15,-8 -6,-9" fill="none"/><ellipse cx="-2" cy="-1" rx="5" ry="4.4" fill="#e8c8b0" stroke-width="1.4"/><path d="M-4,-2 Q-2,-4 0,-2" fill="none" stroke-width="1"/>`,
 /* 河豚玩偶：黃色圓滾滾、身上一圈小刺、大眼睛、橘色小鰭 */
 puffer16:[0,30,60,90,120,150,180,210,240,270,300,330].map(a=>{const t=a*Math.PI/180;return `<path d="M${f(Math.cos(t-.12)*11.4)},${f(Math.sin(t-.12)*11.4)} L${f(Math.cos(t)*15.6)},${f(Math.sin(t)*15.6)} L${f(Math.cos(t+.12)*11.4)},${f(Math.sin(t+.12)*11.4)}" fill="#f2d040" stroke-width="1.2"/>`}).join('')+
  `<circle r="12" fill="#f5d84a"/><path d="M-10,4 Q0,13 10,4 Q4,9 0,9 Q-4,9 -10,4Z" fill="#fbf3d0" stroke="none"/><path d="M12,-2 l6,-4 l-1,6 l1,6 l-6,-4Z" fill="#f0902a" stroke-width="1.2"/>`+
  `<circle cx="-5" cy="-3" r="3.4" fill="#fff" stroke-width="1"/><circle cx="2" cy="-3" r="3.4" fill="#fff" stroke-width="1"/><circle cx="-4.4" cy="-2.6" r="1.6" fill="${OL}" stroke="none"/><circle cx="2.6" cy="-2.6" r="1.6" fill="${OL}" stroke="none"/><ellipse cx="-1.6" cy="4" rx="2.4" ry="1.8" fill="#f08a6a" stroke-width="1"/><circle cx="-9" cy="2" r="1.6" fill="#f0a0a0" stroke="none"/>`,
 /* 海馬吊飾：橘色小海馬、捲捲的尾巴，頭上一個小金環 */
 seahorse16:`<circle cx="2" cy="-18" r="3" fill="none" stroke="${OL}" stroke-width="3.4"/><circle cx="2" cy="-18" r="3" fill="none" stroke="${GOLD}" stroke-width="1.6"/>`+
  `<path d="M2,-15 Q9,-15 10,-10 L16,-9 Q16,-6 10,-6 Q8,-3 6,-1 Q10,4 6,10 Q3,15 -2,15 Q-7,14 -5,10 Q-3,7 -1,9 Q1,10 1,7 Q-6,4 -5,-4 Q-4,-12 2,-15Z" fill="#f08a3a"/>`+
  `<path d="M-5,-4 q-4,2 -5,-2 q2,-3 5,-1 M-4.6,2 q-4,1 -4,-3" fill="#f6b070" stroke-width="1.1"/><circle cx="5" cy="-10" r="1.4" fill="${OL}" stroke="none"/><path d="M-1,-5 h4 M-1,-1 h4 M0,3 h3" fill="none" stroke="#c8602a" stroke-width="1.1"/><path d="M0,-13 l-1,-3 M3,-14 l0,-3" fill="none" stroke-width="1.2"/>`,
 /* 小金皇冠：金色尖頂（頂端小圓珠）、紅藍寶石 */
 crown16:`<path d="M-14,4 L-15,-9 L-7,-2 L0,-13 L7,-2 L15,-9 L14,4Z" fill="#f2c230"/><rect x="-14.6" y="3" width="29.2" height="8" rx="1.6" fill="#e0a820"/>`+
  `<circle cx="-15" cy="-10.4" r="2.4" fill="#f6d860" stroke-width="1.2"/><circle cx="0" cy="-14.4" r="2.6" fill="#f6d860" stroke-width="1.2"/><circle cx="15" cy="-10.4" r="2.4" fill="#f6d860" stroke-width="1.2"/>`+
  `<circle cx="-7.6" cy="7" r="2.2" fill="#d8413a" stroke-width="1"/><circle cx="0" cy="7" r="2.4" fill="#3f7ab0" stroke-width="1"/><circle cx="7.6" cy="7" r="2.2" fill="#d8413a" stroke-width="1"/><path d="M-10,-3 L-10,1" fill="none" stroke="#fff6c0" stroke-width="1.6" stroke-linecap="round"/>`});
Object.assign(DECOY,{
 bottleE16:`<g transform="rotate(-35)"><rect x="-6.5" y="-12" width="13" height="24" rx="5" fill="#bfe3d6" fill-opacity=".9"/><rect x="-3" y="-19" width="6" height="8" fill="#bfe3d6"/><rect x="-3.6" y="-23" width="7.2" height="5" rx="1.5" fill="${WOOD2}"/><path d="M-3.6,-9 v12" fill="none" stroke="#fff" stroke-width="1.6" opacity=".85"/></g>`,
 harpoon16:`<g transform="rotate(25)"><path d="M0,15 V-3" fill="none" stroke="${OL}" stroke-width="5"/><path d="M0,15 V-3" fill="none" stroke="${WOOD2}" stroke-width="2.6"/><path d="M-6,-14 V-6 Q-6,-2 0,-2 Q6,-2 6,-6 V-14 M0,-2 V-16" fill="none" stroke="${OL}" stroke-width="4.6"/><path d="M-6,-14 V-6 Q-6,-2 0,-2 Q6,-2 6,-6 V-14 M0,-2 V-16" fill="none" stroke="#6f7f8f" stroke-width="2.2"/></g>`,
 button16:`<circle r="12" fill="#b8763a"/><circle r="9" fill="none" stroke="#8a5428" stroke-width="1.6"/><g fill="#5a3a20" stroke="none"><circle cx="-3" cy="-3" r="1.8"/><circle cx="3" cy="-3" r="1.8"/><circle cx="-3" cy="3" r="1.8"/><circle cx="3" cy="3" r="1.8"/></g><path d="M-7,-6 Q-4,-9 0,-9.4" fill="none" stroke="#e0a870" stroke-width="1.6" stroke-linecap="round"/>`,
 toolbox16:`<path d="M-8,-5 V-13 H8 V-5" fill="none" stroke="${OL}" stroke-width="4"/><path d="M-8,-5 V-13 H8 V-5" fill="none" stroke="${WOOD}" stroke-width="2"/><path d="M-12,-5 L-14,-14 L-10,-15 L-8,-5Z" fill="#9aa2ac" stroke-width="1.2"/>`+
  `<rect x="-16" y="-5" width="32" height="17" rx="1.4" fill="${WOOD2}"/><path d="M-16,1 H16 M-16,6.6 H16" fill="none" stroke="#8a5a32" stroke-width="1.3"/><path d="M-16,-5 H16" fill="none" stroke-width="2"/>`,
 wheel16:`<circle r="14" fill="none" stroke="${OL}" stroke-width="5.6"/><circle r="14" fill="none" stroke="#5a5f68" stroke-width="3.4"/><circle r="11" fill="none" stroke="${WOOD}" stroke-width="2.6"/>`+[0,36,72,108,144,180,216,252,288,324].map(a=>{const t=a*Math.PI/180;return `<path d="M${f(Math.cos(t)*3.6)},${f(Math.sin(t)*3.6)} L${f(Math.cos(t)*10)},${f(Math.sin(t)*10)}" fill="none" stroke="${WOOD2}" stroke-width="1.8"/>`}).join('')+`<circle r="4" fill="${WOOD}" stroke-width="1.4"/>`,
 envelope16:`<g transform="rotate(-8)"><rect x="-16" y="-10" width="32" height="21" rx="1.6" fill="#d9b878"/><path d="M-16,-10 L0,3 L16,-10" fill="none" stroke="#a8864a" stroke-width="1.6"/><path d="M-16,11 L-4,1 M16,11 L4,1" fill="none" stroke="#c4a060" stroke-width="1.2"/><path d="M-3,-10 V11" fill="none" stroke="#8a6a3a" stroke-width="1.6"/></g>`,
 birdcage16:`<circle cx="0" cy="-19" r="3.4" fill="none" stroke="${OL}" stroke-width="3.2"/><circle cx="0" cy="-19" r="3.4" fill="none" stroke="#e0e4e8" stroke-width="1.6"/><path d="M-10,12 V-4 Q-10,-15 0,-15 Q10,-15 10,-4 V12" fill="none" stroke-width="1.8"/>`+
  `<path d="M-5,12 V-12 M0,12 V-15 M5,12 V-12" fill="none" stroke="#c9ced4" stroke-width="1.4"/><path d="M-8,4 H8" fill="none" stroke="${WOOD}" stroke-width="2"/><rect x="-12" y="11" width="24" height="5" rx="1.6" fill="#c9ced4"/><path d="M-10,-5 H10" fill="none" stroke="#c9ced4" stroke-width="1.4"/>`,
 top16:`<rect x="-2" y="-18" width="4" height="8" rx="1.4" fill="#d8d0c0"/><path d="M-14,-6 Q0,-14 14,-6 Q12,4 0,16 Q-12,4 -14,-6Z" fill="#f4f1e8"/><path d="M-13.4,-3 Q0,-9 13.4,-3 L12,1 Q0,-4 -12,1Z" fill="#6a9ac8" stroke-width="1.1"/><path d="M-7,-9 Q-2,-11.4 3,-11.6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`,
 snail16:`<path d="M-11,9 Q-14,-6 -2,-11 Q11,-14 13,0 Q14,10 2,11 Q-6,11 -6,3 Q-6,-4 1,-4 Q6,-4 6,1 Q6,5 2,5" fill="#b8844a"/><path d="M-11,9 Q-14,-6 -2,-11 Q11,-14 13,0 Q14,10 2,11 Q-6,11 -6,3 Q-6,-4 1,-4 Q6,-4 6,1 Q6,5 2,5" fill="none" stroke="#7a5228" stroke-width="2"/><path d="M-14,10 H14" fill="none" stroke="#9a6a38" stroke-width="2.6" stroke-linecap="round"/>`,
 chestnut16:[0,24,48,72,96,120,144,168,192,216,240,264,288,312,336].map(a=>{const t=a*Math.PI/180;return `<path d="M${f(Math.cos(t)*10)},${f(Math.sin(t)*10)} L${f(Math.cos(t)*15.4)},${f(Math.sin(t)*15.4)}" fill="none" stroke="#7a8a3a" stroke-width="1.6"/>`}).join('')+
  `<circle r="11.4" fill="#9aa64a"/><path d="M-6,-1 Q-6,-9 0,-10 Q6,-9 6,-1 Q3,2 0,2 Q-3,2 -6,-1Z" fill="#8a5428" stroke-width="1.3"/><path d="M-3,-6 Q-1,-8 1,-8" fill="none" stroke="#c48a58" stroke-width="1.2" stroke-linecap="round"/>`,
 knight16:`<path d="M-12,14 H12 L10,8 H-10Z" fill="#f2ead8"/><path d="M-8,8 Q-10,-2 -4,-8 Q-6,-12 -2,-16 Q4,-16 8,-10 Q12,-4 10,0 Q8,2 4,0 Q4,4 8,8Z" fill="#f2ead8"/><circle cx="2" cy="-9" r="1.3" fill="${OL}" stroke="none"/><path d="M-4,-8 Q-6,0 -4,6" fill="none" stroke="#d8ccb0" stroke-width="1.6"/><path d="M-9,11 H9" fill="none" stroke="#d8ccb0" stroke-width="1.2"/>`,
 partyhat16:`<path d="M-14,4 L-14,-8 L-9,-1 L-4.6,-10 L0,-1 L4.6,-10 L9,-1 L14,-8 L14,4Z" fill="#f6c4d8"/><rect x="-14.6" y="3" width="29.2" height="7" rx="1.4" fill="#9ad0f0"/>`+
  `<g fill="#fff" stroke="none"><circle cx="-10" cy="-2" r="1.3"/><circle cx="-4" cy="-4" r="1.2"/><circle cx="4" cy="-4" r="1.2"/><circle cx="10" cy="-2" r="1.3"/><circle cx="-8" cy="6.4" r="1.2"/><circle cx="0" cy="6.4" r="1.2"/><circle cx="8" cy="6.4" r="1.2"/></g>`});

/* ================= 4. 12 種 × 4 個 ================= */
/* 老朋友（第 5 關）：瓶中信、船錨。定義寫在這裡當後備（這個檔案可能比第 5 關早載入） */
const OLD={bottle:{id:'bottle',name:'瓶中信',short:'瓶中信',r:14,rot:25},anchor:{id:'anchor',name:'船錨',short:'船錨',r:15,rot:20}};
if(!ART.bottle)ART.bottle=`<g transform="rotate(-35)"><rect x="-6.5" y="-12" width="13" height="24" rx="5" fill="#bfe3d6" fill-opacity=".9"/><rect x="-3" y="-19" width="6" height="8" fill="#bfe3d6"/><rect x="-3.6" y="-23" width="7.2" height="5" rx="1.5" fill="${WOOD2}"/><rect x="-3.2" y="-7" width="6.4" height="14" rx="2.4" fill="#fbf6ea" stroke-width="1.2"/><path d="M-3.2,0 h6.4" fill="none" stroke="#d8413a" stroke-width="1.8"/><path d="M-3.6,-9 v12" fill="none" stroke="#fff" stroke-width="1.6" opacity=".85"/></g>`;
if(!ART.anchor)ART.anchor=`<path d="M0,-9 V12 M-8,-4 H8 M-12,3 Q-10,13 0,13 Q10,13 12,3" fill="none" stroke="${OL}" stroke-width="5.6"/><path d="M0,-9 V12 M-8,-4 H8 M-12,3 Q-10,13 0,13 Q10,13 12,3" fill="none" stroke="#6f7f8f" stroke-width="2.8"/><circle cy="-12" r="3.4" fill="none" stroke="${OL}" stroke-width="5"/><circle cy="-12" r="3.4" fill="none" stroke="#6f7f8f" stroke-width="2.2"/>`;
const old=(id,regions)=>({...(typeOf(id)||OLD[id]),float:false,regions}); /* 海底沒有水面，不用漂浮 */
const TYPES=[
 old('bottle',['wreck16','mid16','kelp16','camp16']),old('anchor',['wreck16','camp16','reef16','kelp16']),
 {id:'coin16',name:'海盜金幣',short:'金幣',r:15,rot:15,regions:['wreck16','wreck16','reef16','mid16']},
 {id:'chest16',name:'小寶箱',short:'寶箱',r:16,rot:8,regions:['wreck16','kelp16','camp16','mid16']},
 {id:'helm16',name:'船舵',short:'船舵',r:16,rot:20,regions:['wreck16','mid16','camp16','kelp16']},
 {id:'tmap16',name:'藏寶圖',short:'藏寶圖',r:16,rot:12,regions:['camp16','wreck16','mid16','reef16']},
 {id:'oillamp16',name:'船用油燈',short:'油燈',r:15,rot:10,regions:['wreck16','camp16','kelp16','wreck16']},
 {id:'conch16',name:'海螺號角',short:'海螺',r:16,rot:20,regions:['reef16','kelp16','mid16','camp16']},
 {id:'nautilus16',name:'鸚鵡螺殼',short:'鸚鵡螺',r:15,rot:20,regions:['reef16','kelp16','mid16','reef16']},
 {id:'puffer16',name:'河豚玩偶',short:'河豚',r:15,rot:12,regions:['reef16','mid16','camp16','kelp16']},
 {id:'seahorse16',name:'海馬吊飾',short:'海馬',r:15,rot:15,regions:['kelp16','reef16','mid16','camp16']},
 {id:'crown16',name:'小金皇冠',short:'皇冠',r:15,rot:12,regions:['wreck16','reef16','kelp16','wreck16']}];
LEVELS[N].types=TYPES;
/* BORROW：不借（使用者確認） */

/* ================= 5. 地形：深海邊緣、沉船、大岩拱 ================= */
const SHIP={x:1240,y:520,a:10};
const rotP=(lx,ly)=>{const t=SHIP.a*Math.PI/180;return [SHIP.x+lx*Math.cos(t)-ly*Math.sin(t),SHIP.y+lx*Math.sin(t)+ly*Math.cos(t)]};
const PORTS=[-200,-120,-40,40,120],DPORT=1; /* 第 2 個圓窗是小海豚卡住的那個（故事目標自己畫） */
const DOLPH=(()=>{const p=rotP(PORTS[DPORT],-46);return [Math.round(p[0]),Math.round(p[1]+22)]})();
const ARCH={x:800,y:1080};
const WHALE={x:1300,y:150};
const BELL={x:1250,y:1930};
const EDGE=y=>250+18*Math.sin(y); /* 深海和沙地的交界（大約 y 250） */
WATERFN[N]=(x,y)=>y<262;
Object.assign(REG,{wreck16:{x:640,y:270,w:1220,h:520},kelp16:{x:640,y:800,w:420,h:700},mid16:{x:1080,y:800,w:340,h:700},
 reef16:{x:1440,y:800,w:420,h:700},camp16:{x:660,y:1520,w:1180,h:560},all16:{x:640,y:270,w:1220,h:1830}});
H.SCREG[N]=['wreck16','kelp16','mid16','reef16','camp16'];

/* 鯨魚：藍鯨（2026-11-18 使用者：先選過 A 座頭鯨，後來改「藍鯨，重畫更像的，身體扭動悠遊感」）
   2026-11-18u 使用者給兩張參考圖：「藍鯨游動曲線類似這樣」→ 選「週期起伏、斜側面、第二張插畫風」：
   尾巴慢慢往上甩到高高翹起（身體彎成弧形），再往下壓回來，一直循環（約 4.5 秒一次）；
   斜側面：肚子白色褶紋露比較多，兩片胸鰭都看得到（遠的那片在身體後面）；插畫風：藍色漸層、背上小白點、身體側面波紋。
   身體用一條「脊椎」算：每一節的角度 = 靜止的微微上彎 + 越往尾巴越大的波浪；厚度沿脊椎的垂直方向長出來（彎很大也不會變形）。
   每 50 毫秒重畫身體一次；整隻來回游（第 11 段的魚迴圈裡 whaleTick）。 */
const WSC=.6,WY0=WHALE.y+5,WTILT=15,WL=-380,WR=330,WLEN=WR-WL,WNS=56;
let WX=1500,WT=0;
const wBeta=(u,a,b)=>Math.pow(Math.max(u,0),a)*Math.pow(Math.max(1-u,0),b),wBM=(a,b)=>wBeta(a/(a+b),a,b);
const wHtU=u=>(1+.35*(1-u)*(1-u))*(18-10*u+54*wBeta(u,.42,1.35)/wBM(.42,1.35)); /* 11-18w：前半身加高 35%（往尾巴漸少） */ /* 背部半高：頭扁、前三分之一最厚、往尾巴慢慢變細 */
const wHbU=u=>16-9*u+60*wBeta(u,.5,1.6)/wBM(.5,1.6);   /* 肚子半高（斜側面，肚子多露一點） */
const wAng=(u,t)=>-.34*u*u+(.04+.78*u*u)*Math.sin(t*1.4-2.1*u); /* 每一節的角度（弧度）：負的＝往上翹；往上翹多、往下壓少（像參考圖）。整隻往下移 32、縮成 .6，尾巴翹到最高也不會超出場景上緣 */
/* 算脊椎：從頭積分到尾，再把身體中間（50%）對齊原點（整隻繞著身體中段擺，頭只輕輕點） */
function wSpine(t){const ds=WLEN/WNS,P=[[0,0,wAng(0,t)]];for(let k=1;k<=WNS;k++){const u=k/WNS,a=wAng(u-.5/WNS,t);P.push([P[k-1][0]+Math.cos(a)*ds,P[k-1][1]+Math.sin(a)*ds,wAng(u,t)])}
 const r=P[Math.round(WNS*.5)],ox=WL+.5*WLEN-r[0],oy=-r[1];return P.map(([x,y,a],k)=>({x:x+ox,y:y+oy,a,u:k/WNS,nx:-Math.sin(a),ny:Math.cos(a)}))}
/* 身體上某一點：u（0 頭～1 尾）、q（-1 背、0 脊椎、1 肚子） */
const wAt=(S,u,q)=>{const i=Math.max(0,Math.min(WNS,u*WNS)),k=Math.min(WNS-1,Math.floor(i)),w=i-k,A=S[k],B=S[k+1],L=(p,r)=>p+(r-p)*w;
 const x=L(A.x,B.x),y=L(A.y,B.y),nx=L(A.nx,B.nx),ny=L(A.ny,B.ny),h=q<0?wHtU(u)*q:wHbU(u)*q;return [x+nx*h,y+ny*h,L(A.a,B.a)]};
const WT0=.35; /* 身體固定的姿勢（尾巴微微翹起的弧形）；11-18w 使用者選 D：前半身加高＋整隻頭抬高 WTILT=15°，噴水柱轉回直的 */
let wSL=null; /* 最近一次的脊椎（噴氣孔位置要用） */
function whaleBody(t){const S=wSpine(t);wSL=S;const pt=a=>`${f(a[0])},${f(a[1])}`;
 const top=S.map(p=>wAt(S,p.u,-1)),bot=S.map(p=>wAt(S,p.u,1)),h=S[0],nose=[h.x-Math.cos(h.a)*28,h.y-Math.sin(h.a)*28+4];
 const d=`M${pt(top[0])} `+top.slice(1).map(a=>'L'+pt(a)).join(' ')+` L${pt(bot[WNS])} `+bot.slice(0,-1).reverse().map(a=>'L'+pt(a)).join(' ')+` Q${pt(nose)} ${pt(top[0])}Z`;
 const sst=(e0,e1,x)=>{const k=Math.max(0,Math.min(1,(x-e0)/(e1-e0)));return k*k*(3-2*k)};
 /* 白色肚子＋褶紋（下巴到身體中段，往後慢慢收細） */
 const bw=u=>.92*(1-sst(.3,.66,u)),bu=S.filter(p=>p.u<=.66);
 const bd=`M${pt(bot[0])} `+bu.map(p=>'L'+pt(wAt(S,p.u,1))).join(' ')+' '+bu.slice().reverse().map(p=>'L'+pt(wAt(S,p.u,1-2*bw(p.u)*.62))).join(' ')+` Q${pt(nose)} ${pt(bot[0])}Z`;
 let gr='';[.02,.22,.4,.56,.7,.84].forEach(q=>{const e=.32+q*.22;gr+=`M${pt(wAt(S,.025,1-1.24*.92*(1-q)))} `+S.filter(p=>p.u>.03&&p.u<e).map(p=>'L'+pt(wAt(S,p.u,1-1.24*bw(p.u)*(1-q)))).join(' ')+' '});
 /* 插畫風：背上小白點、身體側面三條波紋 */
 const dots=[[.12,-.55,3],[.16,-.3,2.2],[.2,-.7,2.6],[.25,-.45,3.2],[.3,-.75,2],[.34,-.25,2.4],[.38,-.6,3],[.43,-.4,2],[.47,-.72,2.6],[.52,-.2,2.2],[.55,-.55,3],[.6,-.35,2],[.64,-.65,2.4],[.69,-.3,2],[.74,-.5,2.2],[.8,-.25,1.8],[.85,-.45,1.8],[.28,.05,2],[.4,.12,1.8],[.58,.0,2]];
 const sp=dots.map(([u,q,r])=>{const p=wAt(S,u,q);return `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="#e6f4ff" stroke="none" opacity=".75"/>`}).join('');
 let wv='';[[.3,.5,-.18],[.4,.62,.1],[.5,.74,-.05]].forEach(([u0,u1,q])=>{const n=14;let s='';for(let k=0;k<=n;k++){const u=u0+(u1-u0)*k/n,p=wAt(S,u,q+.14*Math.sin(k/n*Math.PI*3));s+=(k?'L':'M')+pt(p)+' '}wv+=s});
 /* 鰭：遠的胸鰭（畫在身體後面）、近的胸鰭、背鰭（很小、靠近尾巴）、尾鰭（跟著尾巴角度轉） */
 const pa=10*Math.sin(t*1.4+1.2),fin=(p,rot,len,col,cls)=>`<g transform="translate(${f(p[0])},${f(p[1])}) rotate(${f(rot)})"><g class="${cls}"><g transform="scale(${len/100})"><path d="M-14,-12 Q40,-15 88,0 Q108,9 100,17 Q92,22 74,16 Q38,9 -14,11Z" fill="${col}" stroke="none"/><path d="M2,-12.6 Q40,-15 88,0 Q108,9 100,17 Q92,22 74,16 Q38,9 2,10.6" fill="none"/><path d="M10,-3 Q48,-4 88,8" fill="none" stroke="#a8d0f0" stroke-width="2.6" opacity=".7"/></g></g></g>`;
 const fp=wAt(S,.3,.66),np=wAt(S,.24,.4),fa=S[Math.round(WNS*.26)].a*57.3;
 const far=fin(fp,fa+52,82,'#2c5a8e','whFf16');
 const near=fin(np,fa+26,118,'#3d73ad','whFn16');
 const dp=wAt(S,.76,-1),da=S[Math.round(WNS*.76)].a*57.3;
 const dorsal=`<g transform="translate(${f(dp[0])},${f(dp[1]+2)}) rotate(${f(da)})"><path d="M-16,5 Q-2,-2 10,-15 Q6,-4 14,5Z" fill="#2f5f93"/></g>`;
 const T=S[WNS],ta=T.a*57.3;
 const fl=`M-18,-9 Q30,-16 58,-62 Q72,-70 74,-56 Q62,-22 50,0 Q62,22 74,56 Q72,70 58,62 Q30,16 -18,9Z`,flo=`M-6,-8.6 Q30,-16 58,-62 Q72,-70 74,-56 Q62,-22 50,0 Q62,22 74,56 Q72,70 58,62 Q30,16 -6,8.6`;
 const fluke=`<g transform="translate(${f(T.x-6*Math.cos(T.a))},${f(T.y-6*Math.sin(T.a))}) rotate(${f(ta)})"><g class="whFk16"><g transform="scale(1,.9)"><path d="${fl}" fill="url(#whFl16)" stroke="none"/><path d="${flo}" fill="none"/><path d="M50,0 Q60,-26 70,-52 M50,0 Q60,26 70,52" fill="none" stroke="#a8d0f0" stroke-width="2.2"/></g></g></g>`;
 let g=far;
 g+=`<path d="${d}" fill="url(#whG16)"/>`+`<path d="${wv}" fill="none" stroke="#86b8e2" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>`+sp+
   `<path d="${bd}" fill="#eef4f9" stroke="none"/><path d="${gr}" fill="none" stroke="#b8cede" stroke-width="2" stroke-linecap="round"/><path d="${d}" fill="none"/>`+fluke+dorsal+near;
 /* 頭：噴氣孔前面的隆起、眼睛、長長的嘴線 */
 const b0=wAt(S,.13,-1),b1=wAt(S,.155,-1),ha=S[Math.round(WNS*.14)].a*57.3;
 g+=`<g transform="translate(${f(b0[0])},${f(b0[1])}) rotate(${f(ha)})"><path d="M0,3 q8,-9 20,0" fill="#4f86bc"/></g><g transform="translate(${f(b1[0])},${f(b1[1])}) rotate(${f(ha)})"><path d="M4,2 q4,-4 8,0" fill="none" stroke-width="2"/></g>`;
 const m0=wAt(S,.005,.3),m1=wAt(S,.06,.5),m2=wAt(S,.13,.48),e=wAt(S,.125,.12);
 g+=`<path d="M${pt(m0)} Q${pt(m1)} ${pt(m2)}" fill="none" stroke-width="2.6"/><circle cx="${f(e[0])}" cy="${f(e[1])}" r="6" fill="#fff" stroke="none"/><circle cx="${f(e[0]-.6)}" cy="${f(e[1]+.4)}" r="4.4" fill="${OL}" stroke="none"/><circle cx="${f(e[0]-2)}" cy="${f(e[1]-1)}" r="1.6" fill="#fff" stroke="none"/><path d="M${f(e[0]-7)},${f(e[1]-6)} q7,-5 14,0" fill="none" stroke-width="1.8"/>`;
 return g}
const WSP=[.15,-1]; /* 噴氣孔：脊椎 u=.15 的背上（位置每次跟著脊椎算） */
const wSpout=t=>{const S=wSL||wSpine(t);return wAt(S,WSP[0],WSP[1])};
function whaleSvg(){const b=whaleBody(WT0),s=wSpout(WT0);
 return `<style>#wh16 .whFk16,#wh16 .whFn16,#wh16 .whFf16{transform-origin:0 0;animation:whFk16 2.6s ease-in-out infinite alternate}#wh16 .whFn16{animation-name:whFn16}#wh16 .whFf16{animation-name:whFn16;animation-delay:-1.3s}`+
  `@keyframes whFk16{from{transform:rotate(-13deg)}to{transform:rotate(13deg)}}@keyframes whFn16{from{transform:rotate(-7deg)}to{transform:rotate(9deg)}}</style><defs><linearGradient id="whG16" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c5c92"/><stop offset=".55" stop-color="#4a82ba"/><stop offset="1" stop-color="#6aa2d2"/></linearGradient>`+
  `<linearGradient id="whFl16" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a6ea6"/><stop offset="1" stop-color="#7fb4e0"/></linearGradient></defs>`+
  `<g id="wh16" transform="translate(${WX},${WY0}) scale(${WSC}) rotate(${WTILT})" opacity=".95"><g id="whB16">${b}</g>`+
  `<g id="whSpP16" transform="translate(${f(s[0])},${f(s[1])}) rotate(${-WTILT})"><g id="whSp16" data-sp="0,0" style="opacity:0"><path d="M0,0 q-14,-54 -38,-90 M0,0 q8,-60 26,-100 M0,0 q-2,-64 -4,-110" fill="none" stroke="#e8fbff" stroke-width="10" stroke-linecap="round"/>`+
  [[-40,-96,14],[28,-104,14],[-4,-118,16],[-24,-64,8],[20,-70,8]].map(([x,y,rr])=>`<circle cx="${x}" cy="${y}" r="${rr}" fill="#f4fdff" stroke="none"/>`).join('')+`</g>`+
  `<g id="whNote16" style="opacity:0">${H.noteM(-98,-24)}${H.noteM(-140,-54)}</g></g></g>`}
/* 2026-11-18v 使用者：動作太複雜會一直閃 → 身體固定成弧形（WT0 那一刻的姿勢）不再重畫；
   整隻慢慢上下浮、微微點頭（每一格只改 #wh16 的 transform），尾鰭上下拍、胸鰭划水用 CSS 動畫（.whFk16、.whFn16）。 */
let WD=-1; /* WD：-1 往左（西）、1 往右（東） */
/* 2026-11-18 使用者：從西邊消失就再游回來，游到東邊也再游回來 → 游出場地（在海水邊緣看不到的地方）才轉身，來回游 */
function whaleTick(t,dt){WT+=dt;WX+=WD*14*dt;
 if(WD<0&&WX<300){WD=1;whaleFace()}else if(WD>0&&WX>2200){WD=-1;whaleFace()}
 const g=document.getElementById('wh16');if(!g)return;const k=WT*2*Math.PI/5.2;
 g.setAttribute('transform',`translate(${f(WX)},${f(WY0+6*Math.sin(k))}) scale(${f(-WD*WSC)},${WSC}) rotate(${f(WTILT+2.5*Math.sin(k+1.2))})`)}
/* 轉身時，哼歌的音符也翻回正面（不然整隻翻過來，音符的符桿會跑到左邊） */
function whaleFace(){document.querySelectorAll('#whNote16 .nt').forEach(n=>{const [x,y]=(n.dataset.p||'0,0').split(',').map(Number);n.setAttribute('transform',WD>0?`translate(${x+9},${y}) scale(-1,1)`:`translate(${x},${y})`)})}
H.WHALE16={x:()=>WX,dir:()=>WD,set:(x,d)=>{WX=x;WD=d;whaleFace()}}; /* 測試用 */

function shipSvg(){const L=-290,Rr=290;let s='';
 /* 船身：側面、船頭（左）翹起、船尾（右）插進沙裡 */
 const hull=`M${L},-120 Q${L-6},-50 -240,12 Q-120,46 120,46 Q240,40 ${Rr},10 Q${Rr+8},-60 ${Rr-4},-122 Z`;
 s+=`<defs><clipPath id="hull16"><path d="${hull}"/></clipPath></defs>`;
 /* 斷掉的桅杆（畫在船身後面） */
 s+=`<g transform="rotate(-18 -40 -118)"><path d="M-40,-118 V-330" fill="none" stroke="${OL}" stroke-width="16" stroke-linecap="round"/><path d="M-40,-118 V-330" fill="none" stroke="#7a5a3a" stroke-width="11" stroke-linecap="round"/><path d="M-90,-280 H10" fill="none" stroke="${OL}" stroke-width="9"/><path d="M-90,-280 H10" fill="none" stroke="#7a5a3a" stroke-width="5"/>`+
  `<path d="M-84,-276 L-80,-200 Q-60,-212 -50,-196 Q-40,-214 -20,-200 Q-10,-212 4,-206 L6,-276Z" fill="#d8cdb0" opacity=".85"/><path d="M-60,-250 l10,30 M-30,-260 l-6,40" fill="none" stroke="#b8ac90" stroke-width="2"/><path d="M-44,-330 l-6,-14 l10,4Z" fill="#7a5a3a"/></g>`;
 s+=`<path d="${hull}" fill="#8a6a4a"/>`;
 s+=`<g clip-path="url(#hull16)">`+[-96,-70,-44,-18,8,32].map(y=>`<path d="M${L-20},${y} Q0,${y+6} ${Rr+20},${y}" fill="none" stroke="#6a4e36" stroke-width="2.4"/>`).join('')+
  `<path d="M${L},-120 H${Rr} V-104 H${L}Z" fill="#a8835a" stroke="none"/>`+
  [[-230,-10,46,18],[-20,20,70,20],[180,-60,40,22],[100,0,30,14]].map(([x,y,a,b])=>`<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="#6a9a5a" opacity=".55" stroke="none"/>`).join('')+
  /* 破洞：船身中間一個大洞，裡面黑黑的 */
  `<path d="M150,-20 Q160,-50 190,-46 Q214,-40 210,-12 Q200,10 176,6 Q154,4 150,-20Z" fill="#1e2a30"/><path d="M150,-20 l8,-4 l-2,10 M200,-44 l-2,8 l10,-2 M208,-14 l-10,0 l6,8" fill="#8a6a4a" stroke-width="1.6"/></g>`;
 s+=`<path d="${hull}" fill="none" stroke-width="2.6"/>`;
 /* 船尾樓（右邊，有窗） */
 s+=`<path d="M170,-122 V-196 H270 L290,-188 V-122Z" fill="#7a5a3e"/><path d="M164,-196 H296" fill="none" stroke="${OL}" stroke-width="7"/><path d="M164,-196 H296" fill="none" stroke="#a8835a" stroke-width="4"/>`+
  [196,232,264].map(x=>`<path d="M${x-10},-140 V-170 Q${x},-182 ${x+10},-170 V-140Z" fill="#1e2a30"/>`).join('')+
  `<path d="M180,-196 V-210 M210,-196 V-210 M240,-196 V-210 M270,-196 V-210 M176,-208 H282" fill="none" stroke-width="3"/>`;
 /* 欄杆（有幾根斷了） */
 s+=[-270,-240,-210,-180,-120,-90,-60,0,30,60,90,120].map(x=>`<path d="M${x},-120 V-${x%60?136:132}" fill="none" stroke-width="3"/>`).join('')+`<path d="M-276,-134 H-170 M-130,-136 H130" fill="none" stroke-width="3"/>`;
 /* 圓窗（黃銅框），第 2 個留給小海豚 */
 PORTS.forEach((x,i)=>{if(i===DPORT)return;s+=`<circle cx="${x}" cy="-46" r="15" fill="#1e3a48"/><circle cx="${x}" cy="-46" r="15" fill="none" stroke="${OL}" stroke-width="7"/><circle cx="${x}" cy="-46" r="15" fill="none" stroke="#c8a040" stroke-width="4.4"/><path d="M${x-6},-52 Q${x-2},-56 ${x+3},-55" fill="none" stroke="#5a8aa0" stroke-width="2.2" stroke-linecap="round"/>`});
 /* 藤壺、垂下來的海草 */
 for(let i=0;i<26;i++){const x=L+20+i*21+((i*37)%13),y=-100+((i*53)%120);s+=`<circle cx="${x}" cy="${y}" r="${2+(i%3)}" fill="#e8e0d0" stroke-width="1.1"/>`}
 [-250,-160,-60,60,150,250].forEach((x,i)=>{s+=`<path d="M${x},-120 q${i%2?8:-8},20 0,36 q${i%2?-8:8},16 0,30" fill="none" stroke="#4f8a5a" stroke-width="5" stroke-linecap="round"/>`});
 /* 船頭的木雕（半個美人魚造型換成簡單的捲紋） */
 s+=`<path d="M${L},-118 Q${L-40},-130 ${L-46},-150 Q${L-30},-140 ${L-14},-142" fill="#a8835a" stroke-width="2.4"/>`;
 return `<g transform="translate(${SHIP.x},${SHIP.y}) rotate(${SHIP.a})">${s}</g>`}

function archSvg(){const {x:X,y:Y}=ARCH;let s='';
 /* 大岩拱：兩根石柱＋上面一道拱 */
 s+=`<path d="M-120,0 Q-130,-80 -110,-140 Q-90,-190 0,-196 Q90,-190 110,-140 Q130,-80 120,0 H60 Q64,-70 40,-100 Q0,-124 -40,-100 Q-64,-70 -60,0Z" fill="#7a8a96"/>`+
  `<path d="M-100,-150 Q-70,-182 -10,-186 M40,-180 Q90,-168 104,-130 M-108,-60 Q-104,-100 -96,-120 M104,-40 Q110,-80 104,-110" fill="none" stroke="#a0b0bc" stroke-width="4" stroke-linecap="round"/>`+
  `<path d="M-86,-20 q10,-12 22,-4 M70,-60 q12,-8 20,4 M-30,-150 q14,-8 26,0" fill="none" stroke="#5a6a76" stroke-width="2.4"/>`+
  [[-114,-30],[-96,-110],[100,-120],[112,-20],[-20,-180],[60,-170]].map(([x,y],i)=>`<path d="M${x},${y} q${i%2?-6:6},-12 0,-22" fill="none" stroke="#e86a9a" stroke-width="5" stroke-linecap="round"/>`).join('');
 /* 大章魚：趴在拱頂，八隻腳纏著石柱（點了會噴墨、臉紅） */
 const OC='#c8507a',OC2='#e88aa8';
 const arm=(d,w)=>`<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w+4}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${OC}" stroke-width="${w}" stroke-linecap="round" class="oc16"/>`;
 s+=arm('M-50,-210 Q-120,-200 -118,-150 Q-116,-110 -134,-80 Q-150,-50 -124,-30',14)+arm('M-30,-206 Q-90,-170 -84,-120 Q-80,-90 -104,-70',11)+
  arm('M50,-210 Q120,-200 118,-150 Q116,-110 134,-80 Q150,-50 124,-30',14)+arm('M30,-206 Q90,-170 84,-120 Q80,-90 104,-70',11)+
  arm('M-60,-214 Q-150,-230 -170,-196 Q-180,-176 -160,-170',10)+arm('M60,-214 Q150,-230 172,-200 Q182,-180 164,-172',10)+
  arm('M-10,-200 Q-24,-160 -40,-150 Q-56,-140 -48,-128',8)+arm('M10,-200 Q24,-160 40,-150 Q56,-140 48,-128',8);
 [[-118,-150],[-130,-86],[118,-150],[130,-86],[-160,-190],[162,-194],[-86,-124],[86,-124]].forEach(([x,y])=>s+=`<circle cx="${x}" cy="${y}" r="3" fill="${OC2}" stroke-width="1"/><circle cx="${x+5}" cy="${y+10}" r="2.4" fill="${OC2}" stroke-width="1"/>`);
 s+=`<path id="oct16body" d="M-62,-206 Q-70,-290 0,-300 Q70,-290 62,-206 Q30,-190 0,-192 Q-30,-190 -62,-206Z" fill="${OC}"/><path d="M-40,-268 Q-30,-286 -6,-290" fill="none" stroke="${OC2}" stroke-width="6" stroke-linecap="round"/>`+
  `<circle cx="-26" cy="-226" r="12" fill="#fff"/><circle cx="26" cy="-226" r="12" fill="#fff"/><circle cx="-24" cy="-224" r="6" fill="${OL}" stroke="none"/><circle cx="24" cy="-224" r="6" fill="${OL}" stroke="none"/><circle cx="-22" cy="-227" r="2" fill="#fff" stroke="none"/><circle cx="26" cy="-227" r="2" fill="#fff" stroke="none"/>`+
  `<g id="oct16cheek" style="opacity:0"><ellipse cx="-44" cy="-210" rx="12" ry="7" fill="#e8303a" stroke="none" opacity=".7"/><ellipse cx="44" cy="-210" rx="12" ry="7" fill="#e8303a" stroke="none" opacity=".7"/><path d="M-6,-206 Q0,-200 6,-206" fill="none" stroke-width="2.4"/></g>`+
  `<ellipse cx="0" cy="-206" rx="6" ry="4" fill="#a83a60" stroke-width="1.8"/>`+
  `<g id="oct16ink" style="opacity:0">`+[[-10,-180,26],[24,-166,30],[-30,-150,24],[10,-130,34],[50,-140,22],[-50,-120,20]].map(([x,y,rr])=>`<circle cx="${x}" cy="${y}" r="${rr}" fill="#2a2430" stroke="none" opacity=".85"/>`).join('')+`</g>`;
 return `<g transform="translate(${X},${Y})">${s}</g>`}

function ground(){
 const Sc=H.SCENES[N],X0=Sc.x0-420,WW=Sc.x1-Sc.x0+840;let g='';
 /* 深海（上面）→ 交界的岩棚 → 沙地 */
 g+=`<rect x="${X0}" y="-420" width="${WW}" height="${Sc.y1+840}" fill="#d6cba0" stroke="none"/>`;
 g+=`<defs><linearGradient id="deep16" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#174a6a"/><stop offset="1" stop-color="#2f7a9a"/></linearGradient>`+
  `<linearGradient id="haze16" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2f7a9a" stop-opacity=".7"/><stop offset="1" stop-color="#2f7a9a" stop-opacity="0"/></linearGradient></defs>`;
 let ed=`M${X0},-420 H${X0+WW} V${f(EDGE(X0+WW))}`;for(let x=X0+WW;x>=X0;x-=40)ed+=` L${x},${f(EDGE(x/90)+((x*7)%23))}`;ed+='Z';
 g+=`<path d="${ed}" fill="url(#deep16)" stroke="none"/>`;
 /* 交界處的岩石剪影 */
 for(let x=X0;x<X0+WW;x+=sr(40,90)){const w=sr(30,70),h=sr(20,54),y=EDGE(x/90)+12;g+=`<path d="M${f(x-w)},${f(y)} Q${f(x-w*.8)},${f(y-h)} ${f(x)},${f(y-h)} Q${f(x+w*.8)},${f(y-h)} ${f(x+w)},${f(y)}Z" fill="${pk(['#5a7a8a','#4e6e80','#628290'])}" stroke-width="2"/>`}
 /* 沙地：越往北越藍（深度感） */
 g+=`<rect x="${X0}" y="250" width="${WW}" height="700" fill="url(#haze16)" stroke="none"/>`;
 /* 遠方鯨魚（在深海裡，比沙地暗一點、淡一點） */
 g+=whaleSvg();
 /* 各區地面：西邊海草林（偏綠）、東邊珊瑚礁（偏粉）、南邊營地（亮一點） */
 for(let i=0;i<26;i++)g+=`<ellipse cx="${f(sr(640,1060))}" cy="${f(sr(800,1500))}" rx="${f(sr(60,130))}" ry="${f(sr(26,50))}" fill="${pk(['#b8be8a','#aab47e','#c2c494'])}" stroke="none" opacity=".7"/>`;
 for(let i=0;i<26;i++)g+=`<ellipse cx="${f(sr(1440,1860))}" cy="${f(sr(800,1500))}" rx="${f(sr(50,120))}" ry="${f(sr(22,44))}" fill="${pk(['#e2c0aa','#dcb8a8','#e8ccb4'])}" stroke="none" opacity=".75"/>`;
 g+=`<ellipse cx="${BELL.x}" cy="${BELL.y-40}" rx="520" ry="220" fill="#e6dcb6" stroke="none" opacity=".7"/>`;
 /* 被走亮的沙地（不畫框線）：潛水鐘 → 沉船、→ 海草林、→ 珊瑚礁 */
 [[`M${BELL.x},2080 L${BELL.x},1500 Q1250,1100 1240,700`,70],[`M${BELL.x},1600 Q1050,1500 900,1300`,54],[`M${BELL.x},1600 Q1450,1500 1600,1300`,54],[`M${BELL.x},1760 Q1000,1780 800,1820`,50],[`M${BELL.x},1760 Q1500,1780 1700,1820`,50]]
  .forEach(([d,w])=>{g+=`<path d="${d}" fill="none" stroke="#e8dfbe" stroke-width="${w+26}" stroke-linecap="round" opacity=".5"/><path d="${d}" fill="none" stroke="#efe8cc" stroke-width="${w*.6}" stroke-linecap="round" opacity=".5"/>`});
 /* 沙紋 */
 let rp='';for(let i=0;i<220;i++){const x=sr(640,1880),y=sr(290,2120),w=sr(26,60);rp+=`M${f(x)},${f(y)} q${f(w/2)},${f(sr(-6,-2))} ${f(w)},0 `}
 g+=`<path d="${rp}" fill="none" stroke="#bfb184" stroke-width="2" stroke-linecap="round" opacity=".7"/>`;
 /* 海底的光紋（水面的光照下來） */
 let cs='';for(let i=0;i<260;i++){const x=sr(640,1880),y=sr(290,2120),w=sr(14,30);cs+=`M${f(x)},${f(y)} q${f(w*.3)},${f(-w*.3)} ${f(w*.6)},0 q${f(w*.2)},${f(w*.25)} ${f(w*.4)},${f(-w*.1)} `}
 g+=`<path d="${cs}" fill="none" stroke="#fffbe0" stroke-width="2.4" stroke-linecap="round" opacity=".45"/>`;
 /* 小石子 */
 for(let i=0;i<120;i++)g+=`<ellipse cx="${f(sr(640,1880))}" cy="${f(sr(290,2120))}" rx="${f(sr(3,7))}" ry="${f(sr(2,4))}" fill="${pk(['#b8a880','#c4b48c','#a8987a'])}" stroke="none"/>`;
 /* 沉船（北）：前面堆一圈沙，船尾埋進沙裡 */
 g+=shipSvg();
 g+=`<path d="M1300,640 Q1420,560 1560,580 Q1640,600 1600,660 Q1460,690 1300,670Z" fill="#d6cba0" stroke-width="2"/><path d="M1340,650 Q1440,610 1560,620" fill="none" stroke="#bfb184" stroke-width="2"/>`;
 g+=`<path d="M940,600 Q1100,640 1300,650 Q1200,690 1000,668 Q930,650 940,600Z" fill="#d6cba0" stroke="none" opacity=".9"/>`;
 /* 掉在沙上的斷桅杆 */
 g+=`<g transform="rotate(14 760 700)"><path d="M680,700 H860" fill="none" stroke="${OL}" stroke-width="16" stroke-linecap="round"/><path d="M680,700 H860" fill="none" stroke="#7a5a3a" stroke-width="11" stroke-linecap="round"/><path d="M860,692 l10,6 l-8,6" fill="#7a5a3a" stroke-width="2"/><path d="M700,697 q30,-3 60,0" fill="none" stroke="#9a7a52" stroke-width="2"/></g>`;
 /* 西：大岩拱＋大章魚 */
 g+=archSvg();
 /* 上方透下來的光線 */
 for(let k=0;k<7;k++){const x=700+k*190+sr(-40,40);g+=`<path d="M${f(x)},-60 L${f(x+50)},-60 L${f(x+220)},${f(1500+k*60)} L${f(x+110)},${f(1500+k*60)}Z" fill="#fffbe6" opacity=".09" stroke="none"/>`}
 return `<g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${g}</g>`}

/* ================= 6. 佈景美術 ================= */
const sh=(w,o=.12)=>`<ellipse cx="2" cy="2" rx="${w}" ry="${f(w*.18)}" fill="#1e3a48" opacity="${o}" stroke="none"/>`;
/* 海草（會搖） */
const kelp16=(s=1)=>{let g=sh(16);const n=ri(3,5);for(let i=0;i<n;i++){const x=(i-(n-1)/2)*7,h=sr(90,150)*s;let d=`M${f(x)},0`;for(let k=1;k<=6;k++)d+=` Q${f(x+(k%2?10:-10))},${f(-h*(k-.5)/6)} ${f(x+(k%2?3:-3))},${f(-h*k/6)}`;
 const c=pk(['#4f8a4a','#5f9a52','#3f7a48','#6aa058']);g+=`<path d="${d}" fill="none" stroke="${OL}" stroke-width="9" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="5.6" stroke-linecap="round"/>`;
 for(let k=1;k<6;k+=2){const y=-h*k/6;g+=`<ellipse cx="${f(x+(k%2?8:-8))}" cy="${f(y)}" rx="6" ry="3" fill="${c}" stroke-width="1.2"/>`}}return g};
const seagrass16=()=>sh(14,.08)+[-8,-3,2,7].map((x,i)=>`<path d="M${x},0 Q${x+(i%2?5:-5)},-10 ${x+(i%2?2:-2)},${-14-i*2}" fill="none" stroke="${pk(['#6a9a52','#7aaa5a','#5a8a4a'])}" stroke-width="2.6" stroke-linecap="round"/>`).join('');
const rock16=()=>{const k=ri(0,2),c=pk(['#8a9aa4','#7a8a96','#96a4ac','#a49a8a','#8e8a80']),w=sr(.7,1.15);
 let g=`<ellipse cx="0" cy="3" rx="${f(24*w)}" ry="5" fill="#1e3a48" opacity=".14" stroke="none"/>`;
 g+=k===0?`<path d="M${f(-22*w)},2 Q${f(-24*w)},-12 ${f(-8*w)},-16 Q${f(8*w)},-20 ${f(18*w)},-10 Q${f(24*w)},-2 ${f(22*w)},2Z" fill="${c}"/>`:
  k===1?`<path d="M${f(-20*w)},2 L${f(-16*w)},-14 L${f(-2*w)},-22 L${f(12*w)},-16 L${f(20*w)},2Z" fill="${c}"/><path d="M${f(-2*w)},-22 L${f(-4*w)},2" fill="none" stroke-width="1.4"/>`:
  `<path d="M${f(-24*w)},2 Q${f(-22*w)},-8 ${f(-10*w)},-9 Q${f(-6*w)},-14 ${f(4*w)},-12 Q${f(20*w)},-12 ${f(24*w)},2Z" fill="${c}"/>`;
 g+=`<path d="M${f(-12*w)},-7 Q${f(-4*w)},-12 ${f(4*w)},-11" fill="none" stroke="#c4ccd0" stroke-width="1.8" stroke-linecap="round" opacity=".8"/>`;
 const d=r();if(d<.25)g+=`<path d="M${f(8*w)},-4 q4,-6 0,-10" fill="none" stroke="#e86a9a" stroke-width="3" stroke-linecap="round"/>`;else if(d<.5)g+=`<path d="M${f(-10*w)},-6 q-2,-8 2,-12 M${f(-6*w)},-8 q2,-6 -1,-10" fill="none" stroke="#6a9a52" stroke-width="2.2" stroke-linecap="round"/>`;
 return g};
/* 珊瑚：分枝珊瑚、腦珊瑚、扇形珊瑚、管狀海綿 */
const CORC=['#f08a6a','#e86a9a','#f5b84a','#b07ad8','#f0a0b8'];
const branch16=(c)=>{c=c||pk(CORC);let g=sh(30);const br=(x,y,a,l,d)=>{if(d>3||l<8)return '';const x2=x+Math.sin(a)*l,y2=y-Math.cos(a)*l;return `<path d="M${f(x)},${f(y)} L${f(x2)},${f(y2)}" fill="none" stroke="${OL}" stroke-width="${f(12-d*2.4)}" stroke-linecap="round"/><path d="M${f(x)},${f(y)} L${f(x2)},${f(y2)}" fill="none" stroke="${c}" stroke-width="${f(8-d*1.8)}" stroke-linecap="round"/>`+br(x2,y2,a-sr(.3,.6),l*.75,d+1)+br(x2,y2,a+sr(.3,.6),l*.75,d+1)};
 return g+br(0,0,sr(-.15,.15),sr(26,36),0)};
const brain16=()=>{const c=pk(['#e8b06a','#d8c070','#e89a7a']);return sh(30)+`<path d="M-30,0 Q-32,-30 0,-34 Q32,-30 30,0Z" fill="${c}"/>`+[-22,-12,-2,8,18].map((x,i)=>`<path d="M${x},-2 Q${x+(i%2?6:-6)},-14 ${x+2},-24" fill="none" stroke="#a8784a" stroke-width="2"/>`).join('')+`<path d="M-24,-14 Q0,-22 24,-14" fill="none" stroke="#a8784a" stroke-width="2"/>`};
const fan16=()=>{const c=pk(['#b07ad8','#e86a6a','#f08a3a']);let g=sh(22)+`<path d="M0,0 V-10" fill="none" stroke="${OL}" stroke-width="5"/><path d="M-34,-40 Q-38,-74 0,-80 Q38,-74 34,-40 Q20,-14 0,-10 Q-20,-14 -34,-40Z" fill="${c}" opacity=".9"/>`;
 for(let a=-60;a<=60;a+=15){const t=a*Math.PI/180;g+=`<path d="M0,-10 L${f(Math.sin(t)*38)},${f(-10-Math.cos(t)*66)}" fill="none" stroke="#fff" stroke-width="1.4" opacity=".55"/>`}
 for(let k=1;k<4;k++)g+=`<path d="M${-34+k*4},${-40-k*8} Q0,${-62-k*4} ${34-k*4},${-40-k*8}" fill="none" stroke="#fff" stroke-width="1.2" opacity=".45"/>`;return g};
const sponge16=()=>{const c=pk(['#f5c040','#e88a4a','#c8a0e0']);return sh(20)+[[-10,40,8],[2,54,9],[13,34,7]].map(([x,h,w])=>`<path d="M${x-w},0 V${-h} Q${x},${-h-6} ${x+w},${-h} V0Z" fill="${c}"/><ellipse cx="${x}" cy="${-h}" rx="${w-2}" ry="3" fill="#7a4a2a" stroke-width="1.2"/>`).join('')};
/* 海葵＋小丑魚 */
const clown=(x,y,fl)=>`<g transform="translate(${x},${y}) scale(${fl?-1:1},1)"><path d="M-10,0 Q-10,-7 0,-7 Q10,-7 12,0 Q10,7 0,7 Q-10,7 -10,0Z" fill="#f08a2a"/><path d="M-4,-6.6 Q-6,0 -4,6.6 M4,-7 Q2,0 4,7" fill="none" stroke="#fff" stroke-width="3"/><path d="M-10,0 l-6,-5 v10Z" fill="#f08a2a" stroke-width="1.4"/><circle cx="7" cy="-2" r="1.4" fill="${OL}" stroke="none"/></g>`;
const anemone16=()=>{const c=pk(['#f0a0c0','#c8e070','#f5c87a']);let g=sh(26)+`<path d="M-20,0 Q-22,-12 0,-14 Q22,-12 20,0Z" fill="#a85a7a"/>`;
 for(let i=0;i<13;i++){const x=-20+i*3.4,h=sr(16,28);g+=`<path d="M${f(x)},-10 Q${f(x+(i%2?4:-4))},${f(-10-h*.5)} ${f(x+(i%2?1:-1))},${f(-10-h)}" fill="none" stroke="${OL}" stroke-width="5.6" stroke-linecap="round"/><path d="M${f(x)},-10 Q${f(x+(i%2?4:-4))},${f(-10-h*.5)} ${f(x+(i%2?1:-1))},${f(-10-h)}" fill="none" stroke="${c}" stroke-width="3.4" stroke-linecap="round"/>`}
 return g+clown(-14,-32,0)+clown(14,-42,1)};
/* 海龜（游過去） */
const turtle16=()=>`<ellipse cx="0" cy="40" rx="26" ry="5" fill="#1e3a48" opacity=".1" stroke="none"/><g transform="translate(0,-10)"><path d="M-30,-8 Q-44,-18 -40,-2Z M-26,10 Q-40,18 -34,4Z M20,-12 Q36,-24 30,-4Z M22,10 Q38,20 30,4Z" fill="#8ab86a"/><ellipse cx="34" cy="0" rx="10" ry="7" fill="#8ab86a"/><circle cx="38" cy="-2" r="1.6" fill="${OL}" stroke="none"/>`+
 `<ellipse cx="-2" cy="0" rx="28" ry="18" fill="#6a8a4a"/><path d="M-14,-12 L-6,0 L-14,12 M10,-14 L4,0 L10,14 M-6,0 H4" fill="none" stroke="#4a6a32" stroke-width="2"/><path d="M-20,-10 Q-10,-16 2,-15" fill="none" stroke="#9aba7a" stroke-width="2.4" stroke-linecap="round"/></g>`;
/* 水母（輕輕飄） */
const jelly16=()=>{const c=pk(['#f0c0e0','#c0d8f8','#f8d0b0']);return `<circle cx="0" cy="-60" r="22" fill="#fff" opacity=".18" stroke="none"/><path d="M-16,-56 Q-16,-76 0,-76 Q16,-76 16,-56 Q8,-52 0,-54 Q-8,-52 -16,-56Z" fill="${c}" opacity=".88"/>`+
 [-10,-4,2,8].map((x,i)=>`<path d="M${x},-54 q${i%2?4:-4},10 0,20 q${i%2?-4:4},10 0,18" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`).join('')+`<path d="M-10,-66 Q-6,-72 0,-72" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/>`};
/* 小魚群 */
const school16=()=>{const c=pk(['#5aa0d0','#f5c040','#8ad0c8','#f08a6a']);let g='';for(let i=0;i<6;i++){const x=(i%3)*18-18+(i>2?9:0),y=-40-(i>2?14:0);g+=`<path d="M${x-7},${y} Q${x},${y-5} ${x+7},${y} Q${x},${y+5} ${x-7},${y}Z" fill="${c}" stroke-width="1.2"/><path d="M${x-7},${y} l-5,-4 v8Z" fill="${c}" stroke-width="1"/><circle cx="${x+3.6}" cy="${y-1}" r=".9" fill="${OL}" stroke="none"/>`}return g};
/* 大寶箱（打開、裝滿金子；比要找的小寶箱大很多） */
const chestBig16=()=>sh(44,.14)+`<path d="M-40,-48 Q-40,-80 0,-82 Q40,-80 40,-48Z" fill="#8a5a32" transform="rotate(-24 -40 -48)"/><rect x="-42" y="-48" width="84" height="48" rx="3" fill="#7a4e2a"/>`+
 `<path d="M-42,-30 H42" fill="none" stroke="#5a3a20" stroke-width="2"/><path d="M-26,-48 V0 M26,-48 V0" fill="none" stroke="#8a8f98" stroke-width="5"/>`+
 `<path d="M-38,-48 Q-30,-64 -14,-58 Q0,-70 14,-58 Q30,-64 38,-48Z" fill="#f2c230"/>`+[[-24,-56],[-8,-62],[8,-60],[24,-55],[0,-52]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#f6d860" stroke-width="1.2"/>`).join('')+`<path d="M-6,-70 l2,-5 l2,5 l5,2 l-5,2 l-2,5 l-2,-5 l-5,-2Z" fill="#fff6c0" stroke-width="1"/>`;
const barrel16=()=>sh(22,.12)+`<g transform="rotate(${pk([0,0,80])} 0 -20)"><path d="M-18,0 Q-22,-20 -18,-40 H18 Q22,-20 18,0Z" fill="#8a6a4a"/><path d="M-20,-8 H20 M-21,-32 H21" fill="none" stroke="#5a5f68" stroke-width="3"/><path d="M-8,-40 V0 M6,-40 V0" fill="none" stroke="#6a4e36" stroke-width="1.6"/><ellipse cx="-6" cy="-20" rx="10" ry="6" fill="#6a9a5a" opacity=".5" stroke="none"/></g>`;
const cannon16=()=>sh(34,.14)+`<path d="M-30,-14 L26,-24 Q34,-24 34,-16 Q34,-8 26,-8 L-30,-4Z" fill="#5a5f68"/><circle cx="34" cy="-16" r="6" fill="#2a2e34"/><path d="M-10,-12 L-8,-21" fill="none" stroke="#7a8088" stroke-width="2"/><circle cx="-16" cy="-4" r="10" fill="#7a5a3a"/><circle cx="-16" cy="-4" r="3" fill="#5a5f68" stroke="none"/><ellipse cx="0" cy="-16" rx="8" ry="4" fill="#c8703a" opacity=".5" stroke="none"/>`;
/* 潛水鐘（B 大頭盔款）：營地中間的降落點，鋼索往上伸 */
const bellArt=()=>`<path d="M-44,0 V-50 Q-44,-96 0,-96 Q44,-96 44,-50 V0Z" fill="#c8743a"/><path d="M22,-90 Q44,-80 44,-50 V0 H30 V-50 Q30,-76 14,-90Z" fill="#a85a2a" stroke="none"/><path d="M-36,-60 Q-34,-84 -14,-90" fill="none" stroke="#e8a070" stroke-width="4" stroke-linecap="round"/>`+
 `<rect x="-49" y="-12" width="98" height="13" rx="3" fill="#5a4a42"/>`+[-40,-26,-13,0,13,26,40].map(x=>`<circle cx="${x}" cy="-5.5" r="2" fill="#d8b060" stroke="none"/>`).join('')+
 [-1,1].map(d=>`<circle cx="${d*35}" cy="-56" r="7" fill="#9fd8e6" stroke="${GOLD}" stroke-width="3.4"/><circle cx="${d*35}" cy="-56" r="7" fill="none" stroke-width="1.2"/>`).join('')+
 `<circle cx="0" cy="-52" r="23" fill="#9fd8e6"/><circle cx="0" cy="-52" r="23" fill="none" stroke="${GOLD}" stroke-width="6"/><circle cx="0" cy="-52" r="26" fill="none" stroke-width="1.4"/><circle cx="0" cy="-52" r="20" fill="none" stroke-width="1.2"/><path d="M0,-72 V-32 M-20,-52 H20" fill="none" stroke="${GOLD}" stroke-width="3"/><path d="M-12,-64 Q-6,-69 2,-69" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".8"/>`+
 `<circle cx="0" cy="-106" r="8" fill="none" stroke="${OL}" stroke-width="6"/><circle cx="0" cy="-106" r="8" fill="none" stroke="${GOLD}" stroke-width="3.4"/><rect x="-7" y="-100" width="14" height="6" rx="2" fill="${GOLD}"/>`;
const bell16=()=>sh(56,.16)+`<path d="M0,-114 V-420" fill="none" stroke="#3d3833" stroke-width="3"/>`+T(0,0,1.15,bellArt())+[[30,-150,4],[22,-178,3],[34,-200,2.4]].map(([x,y,rr])=>`<circle cx="${x}" cy="${y}" r="${rr}" fill="#e8fbff" stroke-width="1"/>`).join('');
/* 營地：海底小屋（玻璃圓頂）、氧氣瓶架、補給箱、氣泡管、燈柱、告示牌、研究桌 */
const habitat16=()=>sh(64,.14)+`<path d="M-62,0 V-30 Q-62,-90 0,-92 Q62,-90 62,-30 V0Z" fill="#cfe8f0" fill-opacity=".85"/><path d="M-62,-30 Q-62,-90 0,-92 Q62,-90 62,-30" fill="none" stroke="#8a9aa4" stroke-width="5"/><path d="M-30,-82 V0 M30,-82 V0 M-62,-40 H62" fill="none" stroke="#8a9aa4" stroke-width="3"/>`+
 `<rect x="-66" y="-12" width="132" height="14" rx="3" fill="#7a8088"/><path d="M-16,0 V-40 Q0,-50 16,-40 V0Z" fill="#e0a040"/><circle cx="8" cy="-20" r="2" fill="${OL}" stroke="none"/><path d="M-44,-74 Q-30,-84 -14,-86" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/><path d="M0,-92 V-104 M-6,-104 H6" fill="none" stroke-width="2.4"/>`;
const tanks16=()=>sh(34,.12)+`<path d="M-34,0 V-46 M34,0 V-46 M-36,-36 H36 M-36,-14 H36" fill="none" stroke="#5a5f68" stroke-width="3.4"/>`+[-24,-8,8,24].map((x,i)=>`<rect x="${x-6}" y="-50" width="12" height="44" rx="6" fill="${['#e0b040','#d8413a','#e0b040','#3f7ab0'][i]}"/><rect x="${x-2.4}" y="-56" width="4.8" height="7" fill="#9aa2ac" stroke-width="1.2"/>`).join('');
const box16=()=>sh(22,.12)+`<rect x="-20" y="-26" width="40" height="26" fill="${WOOD2}"/><path d="M-20,-17 H20 M-20,-8 H20" fill="none" stroke="#8a5a32" stroke-width="1.6"/><path d="M-20,-26 h7 v7 M20,-26 h-7 v7 M-20,0 h7 v-7 M20,0 h-7 v-7" fill="none" stroke="#5a5f68" stroke-width="3"/><rect x="-5" y="-15" width="10" height="5" rx="1.4" fill="#7a7f88" stroke-width="1.2"/>`;
const boxes16=()=>T(-14,0,1,box16())+T(16,2,.9,box16())+T(0,-24,.85,box16());
const pipe16=()=>sh(16,.12)+`<path d="M0,0 V-60 Q0,-70 10,-70 H18" fill="none" stroke="${OL}" stroke-width="9"/><path d="M0,0 V-60 Q0,-70 10,-70 H18" fill="none" stroke="#9aa2ac" stroke-width="5.6"/><rect x="-8" y="-6" width="16" height="8" rx="2" fill="#5a5f68"/><circle cx="0" cy="-30" r="4" fill="#d8413a" stroke-width="1.4"/>`+
 `<g class="bub16">${[[22,-80,4],[18,-96,3],[24,-110,2.4],[20,-124,2]].map(([x,y,rr])=>`<circle cx="${x}" cy="${y}" r="${rr}" fill="#e8fbff" stroke-width="1"/>`).join('')}</g>`;
const lamp16=()=>sh(10,.12)+`<circle cx="0" cy="-74" r="24" fill="#fff3b0" opacity=".3" stroke="none"/><path d="M0,0 V-64" fill="none" stroke="${OL}" stroke-width="6"/><path d="M0,0 V-64" fill="none" stroke="#7a8088" stroke-width="3.4"/><rect x="-8" y="-82" width="16" height="18" rx="3" fill="#fff3b0"/><path d="M-10,-82 H10 L6,-88 H-6Z M-9,-64 H9" fill="#5a5f68" stroke-width="1.6"/>`;
const sign16=()=>sh(12,.12)+`<path d="M0,0 V-50" fill="none" stroke="${OL}" stroke-width="6"/><path d="M0,0 V-50" fill="none" stroke="#7a8088" stroke-width="3.4"/><rect x="-26" y="-74" width="52" height="30" rx="4" fill="#f5c842"/>`+T(0,-37,.62,helm('front','c'))+`<path d="M14,-66 v14 l-4,-4 M14,-52 l4,-4" fill="none" stroke-width="2"/>`;
const table16=()=>sh(40,.12)+`<path d="M-32,0 L-26,-26 M32,0 L26,-26" fill="none" stroke="#5a5f68" stroke-width="2.6"/><rect x="-38" y="-32" width="76" height="7" rx="2" fill="#9aa2ac"/><rect x="-30" y="-44" width="22" height="12" rx="2" fill="#e8e4da"/><path d="M-27,-40 h16 M-27,-36 h12" fill="none" stroke="#9a9a9a" stroke-width="1.2"/><circle cx="16" cy="-40" r="8" fill="#cfe8f0" stroke-width="1.6"/><path d="M12,-40 q4,-6 8,0" fill="none" stroke="#e86a9a" stroke-width="2"/>`;

/* ---- 人群小故事（每組點了說一句話）---- */
const shg=(w,o=.1)=>`<ellipse cx="2" cy="2" rx="${w}" ry="6" fill="#1e3a48" opacity="${o}" stroke="none"/>`;
const say=(t,inner)=>`<g data-say="${t}">${inner}</g>`;
const wrench=`<path d="M12,-18 L22,-4" fill="none" stroke="${OL}" stroke-width="5.4" stroke-linecap="round"/><path d="M12,-18 L22,-4" fill="none" stroke="#9aa2ac" stroke-width="3.2" stroke-linecap="round"/><path d="M20,-6 l6,-2 l-1,5 l4,2 l-5,4 l-4,-3Z" fill="#9aa2ac" stroke-width="1.2"/><path d="M9,-23 l6,-1 l-1,5 l-5,1Z" fill="#9aa2ac" stroke-width="1.2"/>`;
const hammer=`<path d="M12,-22 L20,-6" fill="none" stroke="${OL}" stroke-width="4.4" stroke-linecap="round"/><path d="M12,-22 L20,-6" fill="none" stroke="${WOOD2}" stroke-width="2.4" stroke-linecap="round"/><path d="M6,-20 L16,-26 L18,-22 L8,-17Z" fill="#9aa2ac" stroke-width="1.3"/>`;
const board=`<rect x="10" y="-26" width="12" height="15" rx="1.4" fill="#e8e4da" stroke-width="1.3"/><path d="M12,-22 h8 M12,-18 h6 M12,-14 h7" fill="none" stroke="#9a9a9a" stroke-width="1"/>`;
const camera=`<rect x="10" y="-30" width="15" height="11" rx="2.4" fill="#3a3a44" stroke-width="1.2"/><circle cx="17.5" cy="-24.5" r="3.4" fill="#8fc4e8" stroke-width="1"/><circle cx="12" cy="-33" r="2" fill="#fff6c0" stroke-width=".8"/>`;
/* 打撈寶箱：兩個黃色工作服的潛水員拉繩子 */
const salvageG=()=>{const rope=`<path d="M-38,-14 Q-6,-4 24,-26" fill="none" stroke="#d9c8a0" stroke-width="2.6"/>`;
 return say('⚓ 一、二、三，拉！這箱寶藏好重喔！',shg(60)+rope+act(-46,0,1,dv('side','reach','B'),'work')+act(-22,4,1,dv('side','reach','B',null,{skin:'#c98d5e'}),'work')+T(40,4,.7,chestBig16().replace(sh(44,.14),'')))};
/* 修船：拿鐵鎚補船底的洞 */
const repairG=()=>say('🔨 船底破了一個大洞，先補起來再說。',shg(40)+T(18,0,1,`<rect x="-4" y="-40" width="34" height="12" rx="2" fill="${WOOD2}" transform="rotate(-8)"/>`)+act(-10,0,1,dv('side','up','B',null,{extra:hammer}),'work'));
/* 研究員：記錄珊瑚 */
const researchG=()=>say('📋 這片珊瑚今年又長大了兩公分！',shg(46)+T(-26,0,.8,branch16('#e86a9a'))+act(16,2,-1,dv('fq','hold','D',null,{extra:board}),'nod'));
/* 看海龜：指著頭上游過去的海龜 */
const turtleG=()=>say('🐢 噓⋯海龜游過去了，不要嚇到牠。',shg(40)+act(-14,0,1,dv('bq','up','C','#3f7ab0'),'nod')+act(18,2,-1,dv('fq','stand','C','#e8823a',{skin:'#c98d5e'}),'lean'));
/* 拍小丑魚 */
const photoG=()=>say('📸 小丑魚又躲進海葵裡了！',shg(46)+T(-28,4,.8,anemone16())+act(18,2,-1,dv('side','hold','C','#4f9a5a',{extra:camera}),'nod'));
/* 檢查氧氣瓶 */
const gauge=`<circle cx="16" cy="-18" r="5" fill="#fbf6ea" stroke-width="1.4"/><path d="M16,-18 l3,-2" fill="none" stroke="#d8413a" stroke-width="1.4"/>`;
const tankG=()=>say('🫧 氧氣還很多，可以再待一下下！',shg(44)+act(-18,0,1,dv('side','hold','C','#c4473c',{extra:gauge}),'nod')+act(18,2,-1,dv('fq','reach','C','#2f9a9a',{skin:'#a86a40'}),'nod'));
/* 看水母 */
const jellyG=()=>say('🎐 水母一閃一閃的，好像小燈籠。',shg(40)+act(-14,0,1,dv('back','up2','C','#7a5aa8'),'hop')+act(16,2,-1,dv('bq','stand','D'),'lean')+T(0,-60,.8,jelly16()));
/* 聽鯨魚唱歌（研究員戴耳機） */
const phones=`<path d="M-2,-60 Q0,-74 8,-74 Q16,-74 16,-62" fill="none" stroke="#3a3a44" stroke-width="2.6"/>`;
const whaleG=()=>say('🐋 聽到了嗎？北邊的大鯨魚在唱歌！',shg(40)+act(-14,0,1,dv('fq','hold','D',null,{extra:phones+board}),'nod')+act(18,2,-1,dv('bq','up','C','#e8823a'),'nod'));

/* ---- 佈景圖鑑（KIND）---- */
const dk=(id,w,h,cy=-12)=>({w,h,fn:()=>T(0,cy,1,DECOY[id])});
Object.assign(KIND,{
 kelp16:{w:40,h:140,fn:()=>kelp16()},seagrass16:{w:30,h:20,fn:seagrass16},rock16:{w:48,h:22,fn:()=>rock16()},
 branch16:{w:70,h:80,fn:()=>branch16()},brain16:{w:64,h:36,fn:brain16},fan16:{w:76,h:84,fn:fan16},sponge16:{w:44,h:60,fn:sponge16},
 anemone16:{w:56,h:50,fn:anemone16},turtle16:{w:80,h:60,fn:turtle16},jelly16:{w:40,h:80,fn:jelly16},school16:{w:60,h:60,fn:school16},
 chestBig16:{w:90,h:84,fn:chestBig16},barrel16:{w:44,h:44,fn:barrel16},cannon16:{w:76,h:34,fn:cannon16},
 bell16:{w:120,h:140,fn:bell16},habitat16:{w:130,h:100,fn:habitat16},tanks16:{w:76,h:58,fn:tanks16},box16:{w:44,h:28,fn:box16},boxes16:{w:70,h:50,fn:boxes16},
 pipe16:{w:40,h:80,fn:pipe16},lamp16:{w:40,h:90,fn:lamp16},sign16:{w:56,h:76,fn:sign16},table16:{w:80,h:50,fn:table16},
 bottleE16:dk('bottleE16',30,34,-6),harpoon16:dk('harpoon16',30,40,-8),button16:dk('button16',28,28,-6),toolbox16:dk('toolbox16',36,32,-6),
 wheel16:dk('wheel16',34,34,-6),envelope16:dk('envelope16',36,26,-4),birdcage16:dk('birdcage16',28,40,-8),top16:dk('top16',30,36,-8),
 snail16:dk('snail16',30,26,-6),chestnut16:dk('chestnut16',32,32,-6),knight16:dk('knight16',28,34,-8),partyhat16:dk('partyhat16',32,26,-4)});
['kelp16','branch16','fan16','brain16','sponge16','anemone16','chestBig16','bell16','habitat16','tanks16','boxes16','cannon16','pipe16','lamp16','table16','turtle16'].forEach(k=>H.HEAVYX[N]?H.HEAVYX[N].add(k):(H.HEAVYX[N]=new Set([k])));
['kelp16','branch16','fan16','brain16','sponge16','chestBig16','habitat16','tanks16','boxes16','box16','barrel16','rock16','cannon16'].forEach(k=>H.OCCK.add(k));
H.ANIMX[N]={kelp16:['sway'],seagrass16:['sway'],turtle16:['float'],jelly16:['float'],school16:['swim'],anemone16:['sway'],fan16:['sway'],pipe16:['bob']};
H.ALWAYSX[N]=new Set(['kelp16','turtle16','jelly16','school16','pipe16']);

/* ================= 7. 區域、擺放、人數 ================= */
const late=()=>{
 const ok=l=>l.filter(([k])=>KIND[k]).map(([k,w])=>[k,k==='rock16'?w*.55:w]);
 Object.assign(POOL,{
  wreck16:ok([['chestBig16',.35],['barrel16',.8],['cannon16',.4],['rock16',1],['seagrass16',1],['harpoon16',.17],['toolbox16',.17],['wheel16',.17],['birdcage16',.15],['partyhat16',.12],['button16',.12]]),
  kelp16:ok([['kelp16',2],['rock16',1],['seagrass16',1.4],['turtle16',.3],['bottleE16',.15],['snail16',.17],['knight16',.15],['chestnut16',.12],['envelope16',.1]]),
  mid16:ok([['rock16',1],['seagrass16',1.6],['brain16',.3],['jelly16',.2],['bottleE16',.15],['top16',.15],['button16',.15],['envelope16',.12],['snail16',.12]]),
  reef16:ok([['branch16',1.4],['brain16',.9],['fan16',.8],['sponge16',.8],['anemone16',.6],['rock16',.5],['top16',.17],['chestnut16',.17],['knight16',.15],['partyhat16',.12],['snail16',.12]]),
  camp16:ok([['box16',.8],['lamp16',.3],['rock16',.8],['seagrass16',1],['pipe16',.2],['toolbox16',.2],['envelope16',.17],['harpoon16',.15],['wheel16',.12],['birdcage16',.12],['bottleE16',.12]]),
  decor16:ok([['seagrass16',1.6],['rock16',1],['kelp16',.3],['branch16',.2]])});
 const v=o=>Object.fromEntries(Object.entries(o).filter(([k])=>KIND[k]));
 Object.assign(VPLAN,{wreck16:v({walker:6,chat:4,carryBox:3,handInHand:1}),kelp16:v({walker:5,chat:3,handInHand:1}),mid16:v({walker:5,chat:4,handInHand:2}),
  reef16:v({walker:5,chat:3,handInHand:1}),camp16:v({walker:7,chat:5,carryBox:3,handInHand:2})})};

const STORYP={giver:[1080,1700],helper:[1580,1240]};
function structures(){
 late();
 /* 沉船、岩拱、深海交界：先佔好位置（地面畫的東西） */
 mark(1250,660,640,380,1);mark(1150,330,420,120,1);mark(ARCH.x,ARCH.y+6,330,330,1);
 /* 北：沉船周圍的大寶箱、木桶、大砲 */
 [[880,560],[1600,690],[1090,700]].forEach(([x,y])=>add(x,y,90,84,'chestBig16',chestBig16()));
 [[960,620],[1520,700],[1700,520]].forEach(([x,y])=>add(x,y,44,44,'barrel16',barrel16()));
 add(800,470,76,34,'cannon16',cannon16());add(1700,620,76,34,'cannon16',cannon16());
 add(1400,760,110,70,'salvageG16',salvageG());add(1000,760,80,70,'repairG16',repairG());add(1720,410,80,74,'whaleG16',whaleG());
 /* 水母群（北邊、中間） */
 [[740,330],[1600,330],[1820,360],[1180,860],[1330,900],[1420,1180]].forEach(([x,y])=>{const sp=add(x,y,40,80,'jelly16',jelly16(),{mark:false});sp.y+=600});
 add(1260,980,80,80,'jellyG16',jellyG());
 /* 西：海草森林、海龜 */
 for(let i=0;i<16;i++){const x=sr(650,1050),y=sr(820,1500);if(canPlace(x,y,40,140,false,.5))add(x,y,40,140,'kelp16',kelp16(sr(.9,1.25)),{sh:.5})}
 [[760,1240],[980,900]].forEach(([x,y])=>{const sp=add(x,y,80,60,'turtle16',turtle16(),{mark:false});sp.y+=400});
 add(900,1360,70,70,'turtleG16',turtleG());
 /* 東：珊瑚礁花園 */
 [[1520,880,'fan16'],[1780,900,'branch16'],[1660,1060,'brain16'],[1840,1180,'fan16'],[1500,1300,'sponge16'],[1760,1420,'branch16'],[1560,1060,'anemone16'],[1820,1300,'anemone16']].forEach(([x,y,k])=>add(x,y,KIND[k].w,KIND[k].h,k,KIND[k].fn()));
 add(1640,1000,80,70,'researchG16',researchG());add(1700,1330,80,70,'photoG16',photoG());
 /* 南：潛水鐘降落點＋探險營地 */
 add(BELL.x,BELL.y,120,140,'bell16',bell16());
 add(900,1760,130,100,'habitat16',habitat16());add(1600,1760,130,100,'habitat16',habitat16());
 add(1080,1990,76,58,'tanks16',tanks16());add(1430,2000,76,58,'tanks16',tanks16());
 add(760,1960,70,50,'boxes16',boxes16());add(1740,1960,70,50,'boxes16',boxes16());
 add(1400,1700,80,50,'table16',table16());add(BELL.x-130,2070,56,76,'sign16',sign16());
 [[1130,1860],[1380,1880],[820,1640]].forEach(([x,y])=>add(x,y,40,80,'pipe16',pipe16()));
 [[BELL.x-150,1800],[BELL.x+150,1800],[1000,1580],[1500,1580],[BELL.x-40,1480],[BELL.x+40,1160]].forEach(([x,y])=>add(x,y,40,90,'lamp16',lamp16()));
 add(1250,1640,80,70,'tankG16',tankG());
 /* 小故事要放的固定位置先佔好 */
 mark(STORYP.giver[0],STORYP.giver[1],40,64,1);mark(STORYP.helper[0],STORYP.helper[1],40,64,1);
 /* 補幾塊石頭和海草 */
 for(let i=0;i<8;i++){const x=sr(660,1860),y=sr(800,2060);if(canPlace(x,y,48,22,false,.8))add(x,y,48,22,'rock16',rock16())}
}
function scatterAll(){
 const S=H.dbg.storySp();
 if(S){moveSp(S.giver,STORYP.giver);moveSp(S.target,DOLPH);moveSp(S.helper,STORYP.helper)}
 scatter('wreck16',POOL.wreck16,2800,52);scatter('kelp16',POOL.kelp16,2600,52);scatter('mid16',POOL.mid16,2400,48);
 scatter('reef16',POOL.reef16,2800,56);scatter('camp16',POOL.camp16,3400,56);
 scatter('all16',POOL.decor16,6000,90);
}
function moveSp(sp,p){if(!sp||!p)return;sp.svg=sp.svg.replace(/translate\([^)]*\)/,`translate(${f(p[0])},${f(p[1])})`).replace(/data-x="[^"]*" data-y="[^"]*"/,`data-x="${f(p[0])}" data-y="${f(p[1])}"`);sp.x=p[0];sp.y=p[1]}
SCENE_IMPL[N]={ground,structures,scatter:scatterAll};
Object.assign(HOSTN,{kelp16:'海草',branch16:'珊瑚',brain16:'腦珊瑚',fan16:'扇形珊瑚',sponge16:'海綿',chestBig16:'大寶箱',barrel16:'木桶',cannon16:'大砲',bell16:'潛水鐘',habitat16:'海底小屋',tanks16:'氧氣瓶架',boxes16:'補給箱',lamp16:'燈柱',rock16:'石頭'});
['kelp16','branch16','brain16','fan16','sponge16','chestBig16','barrel16','cannon16','bell16','habitat16','tanks16','boxes16','lamp16','rock16'].forEach(k=>HOSTK.add(k));
/* 物件的合理位置 */
H.SPOTS[N]={
 coin16:[['chestBig16',.5,.3],['cannon16',.5,.3],['barrel16',.5,.4]],
 chest16:[['cannon16',.5,.4],['barrel16',.5,.5],['kelp16',.1,.4]],
 helm16:[['cannon16',.5,.3],['barrel16',.5,.4],['boxes16',.5,.3]],
 tmap16:[['table16',.2,-.6],['habitat16',.4,.3],['boxes16',.55,.3]],
 oillamp16:[['barrel16',.5,.5],['chestBig16',.5,.4],['habitat16',.3,.5]],
 conch16:[['branch16',.5,.3],['brain16',.5,.4],['rock16',.5,.3]],
 nautilus16:[['fan16',.5,.3],['sponge16',.5,.4],['rock16',.5,.3]],
 puffer16:[['anemone16',.4,.5],['branch16',.5,.4],['sponge16',.5,.4]],
 seahorse16:[['kelp16',.15,.3],['fan16',.4,.4],['seagrass16',.5,.4]],
 crown16:[['chestBig16',.45,.35],['cannon16',.5,.3],['brain16',.5,.4]],
 bottle:[['rock16',.5,.3],['kelp16',.1,.4],['boxes16',.55,.3]],
 anchor:[['cannon16',.5,.4],['barrel16',.5,.5],['tanks16',.5,.4]]};
H.BLEND[N]={coin16:['button16','chestBig16'],chest16:['toolbox16','barrel16'],helm16:['wheel16','barrel16'],tmap16:['envelope16','table16'],oillamp16:['birdcage16','lamp16'],
 conch16:['top16','branch16'],nautilus16:['snail16','rock16'],puffer16:['chestnut16','sponge16'],seahorse16:['knight16','branch16'],crown16:['partyhat16','chestBig16'],
 bottle:['bottleE16','rock16'],anchor:['harpoon16','cannon16']};

/* ================= 8. 連環小故事：卡在沉船裡的小海豚 ================= */
/* 小海豚（故事目標）：從沉船的黃銅圓窗探出頭，身上的黃色小泳圈卡在窗框上（圓窗本身也畫在這裡，蓋在沉船的那個圓窗位置上） */
const dolphin16=()=>`<g transform="translate(6,-24) rotate(${SHIP.a})">`+
 /* 圓窗（深色、黃銅框） */
 `<circle cx="0" cy="0" r="15" fill="#1e3a48"/><circle cx="0" cy="0" r="15" fill="none" stroke="${OL}" stroke-width="7.4"/><circle cx="0" cy="0" r="15" fill="none" stroke="#c8a040" stroke-width="4.6"/>`+
 /* 泳圈後半圈（卡在窗框上） */
 `<path d="M-8,-13 Q2,0 -8,13" fill="none" stroke="${OL}" stroke-width="9"/><path d="M-8,-13 Q2,0 -8,13" fill="none" stroke="#f5d040" stroke-width="6.2"/>`+
 /* 頭往左探出來：圓圓的額頭、長嘴巴、大眼睛快哭了 */
 `<path d="M-4,-9 Q-10,-15 -22,-12 Q-30,-9 -31,-2 L-44,2 Q-47,5 -44,7 L-30,8 Q-24,12 -12,11 Q-2,9 -2,0Z" fill="#7aa6c8"/>`+
 `<path d="M-30,8 Q-20,12 -10,10 Q-14,5 -28,4Z" fill="#dcecf4" stroke="none"/><path d="M-44,5 Q-38,6 -31,5" fill="none" stroke-width="1.4"/>`+
 `<circle cx="-21" cy="-4" r="3.2" fill="${OL}" stroke="none"/><circle cx="-20" cy="-5.2" r="1.1" fill="#fff" stroke="none"/><path d="M-26,-9 Q-22,-11 -17,-9" fill="none" stroke-width="1.5"/><path d="M-23,0 q-1.4,4 .6,6.4 q2,-2 -.6,-6.4Z" fill="#a8e0f8" stroke="#5a8ac0" stroke-width="1"/>`+
 /* 泳圈前半圈（紅條紋） */
 `<path d="M-8,-13 Q-18,0 -8,13" fill="none" stroke="${OL}" stroke-width="9.4"/><path d="M-8,-13 Q-18,0 -8,13" fill="none" stroke="#f5d040" stroke-width="6.6"/><path d="M-11,-9 l-3,2 M-14,2 l-3,0 M-11,9 l-3,-2" fill="none" stroke="#d8413a" stroke-width="3" stroke-linecap="butt"/>`+
 `<circle cx="-30" cy="-20" r="2.6" fill="#e8fbff" stroke-width="1"/><circle cx="-26" cy="-29" r="1.9" fill="#e8fbff" stroke-width=".9"/></g>`;
const bigWrench=`<path d="M10,-20 L24,2" fill="none" stroke="${OL}" stroke-width="6.4" stroke-linecap="round"/><path d="M10,-20 L24,2" fill="none" stroke="#c9ced4" stroke-width="4.2" stroke-linecap="round"/><path d="M22,0 l8,-2 l-2,6 l5,3 l-7,5 l-5,-4Z" fill="#c9ced4" stroke-width="1.4"/><path d="M6,-26 l8,-1 l-1,7 l-7,1Z" fill="#c9ced4" stroke-width="1.4"/>`;
const badge=`<circle cx="-3" cy="-13" r="2.6" fill="${GOLD}" stroke-width="1"/>`;
STORIES[N]={title:'卡在沉船裡的小海豚',who:'潛水隊長阿姨',
 giver:()=>act(0,0,1,dv('fq','reach','C','#d8413a',{skin:'#f0c8a0',extra:badge})),
 target:()=>dolphin16(),tw:56,th:48,
 helper:()=>act(0,0,1,dv('side','hold','B',null,{skin:'#c98d5e',extra:bigWrench})),hw:44,hh:66,
 ask:'潛水隊長阿姨：我的小海豚不見了！牠戴著一個黃色小泳圈。',
 need:'小海豚：（嗚嗚～游進去看寶藏，泳圈卡住出不來了！）',
 got:'修船潛水員：卡在窗框？我的扳手可以把窗框轉鬆，帶我過去！',
 ok:'窗框鬆開了！小海豚咻地游出來轉了一圈。快帶牠回去找潛水隊長阿姨！'};

/* ================= 9. 冒險地圖與過場 ================= */
/* 2026-11-18 使用者：海底先不顯示在冒險地圖上。HERE、mapHook 都不設。 */
/* 過場：潛水鐘慢慢沉下去——海水越來越藍、氣泡往上冒、魚群和水母往上滑過，最後看到海底的沙地和珊瑚 */
RIDES.bell16={text:'潛水鐘慢慢沉下去⋯',every:500,tick:k=>tone(k%2?196:247,.12,'sine',.035),
 svg:()=>{const G=2100;let w='';
  w+=`<defs><linearGradient id="sea16r" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="${G}"><stop offset="0" stop-color="#8fd8e2"/><stop offset=".35" stop-color="#4fa8c4"/><stop offset=".75" stop-color="#2a6d8e"/><stop offset="1" stop-color="#1e5676"/></linearGradient></defs>`;
  /* 底色改由遠景那層畫（2026-11-20） */
  /* 水面、打撈船的船底 */
  w+=`<path d="M-20,90 Q20,82 60,90 T140,90 T220,90 T300,90 T380,90 T460,90 V-40 H-20Z" fill="#dff4f8" stroke="none" opacity=".6"/><path d="M60,92 Q200,140 340,92Z" fill="#c8372d"/><path d="M80,98 Q200,126 320,98" fill="none" stroke="#3b5a8a" stroke-width="4"/>`;
  /* 透下來的光 */
  for(let k=0;k<5;k++)w+=`<path d="M${40+k*80},90 L${70+k*80},90 L${130+k*80},700 L${70+k*80},700Z" fill="#fff" opacity=".12" stroke="none"/>`;
  /* 魚群、水母 */
  const fish=(x,y,c,s)=>`<g transform="translate(${x},${y}) scale(${s})">`+[0,1,2,3,4].map(i=>{const a=(i%3)*20,b=(i>2?14:0);return `<path d="M${a-8},${b} Q${a},${b-6} ${a+8},${b} Q${a},${b+6} ${a-8},${b}Z M${a+8},${b} l6,-5 v10Z" fill="${c}" stroke-width="1.2"/>`}).join('')+`</g>`;
  w+=fish(250,420,'#f5c040',1.4)+fish(40,820,'#5aa0d0',1.6)+fish(260,1180,'#8ad0c8',1.5)+fish(60,1520,'#f08a6a',1.4);
  [[90,600],[320,960],[120,1340]].forEach(([x,y])=>{w+=`<g transform="translate(${x},${y}) scale(1.6)" opacity=".85">${jelly16().replace(/<circle cx="0" cy="-60" r="22"[^>]*\/>/,'')}</g>`});
  /* 海底：沙地、珊瑚、海草 */
  w+=`<path d="M-20,1960 Q100,1930 200,1950 Q300,1970 420,1940 V${G+60} H-20Z" fill="#d6cba0"/>`+T(60,1960,1.3,branch16('#e86a9a'))+T(340,1950,1.2,fan16())+T(120,1975,1.3,kelp16(1))+T(290,1970,1.1,anemone16());
  let s=`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><style>.dn16{animation:dn16 3.6s cubic-bezier(.3,0,.6,1) forwards}@keyframes dn16{from{transform:translateY(0)}to{transform:translateY(-1500px)}}`+
   `.sw16{transform-origin:200px 160px;animation:sw16 1.1s ease-in-out infinite alternate}@keyframes sw16{from{transform:rotate(-2.5deg)}to{transform:rotate(2.5deg)}}`+
   `@keyframes fr16{from{transform:translateY(0)}to{transform:translateY(-480px)}}@keyframes nr16{from{transform:translateY(0)}to{transform:translateY(-2500px)}}.bb16{animation:bb16 1.4s ease-in infinite}@keyframes bb16{from{transform:translateY(0);opacity:.9}to{transform:translateY(-240px);opacity:0}}</style>`;
  s+=`<g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect width="400" height="600" fill="#2a6d8e" stroke="none"/>`;
  /* 2026-11-20 加深度：遠景（淡、慢）、原本的中景、近景（大、快）分三層往上捲＝越沉越深；遠的東西被海水吃掉變淡 */
  let fw=`<rect x="-20" y="-40" width="440" height="1100" fill="url(#sea16f)" stroke="none"/>`;
  [[40,300,90],[330,520,120],[80,760,140],[300,900,110]].forEach(([x,y,h])=>fw+=`<path d="M${x-26},${y+h} Q${x-30},${y+h*.4} ${x-12},${y} Q${x+4},${y-14} ${x+14},${y+6} Q${x+30},${y+h*.5} ${x+26},${y+h}Z" fill="#3f86a6" stroke="none" opacity=".55"/>`);
  for(let k=0;k<14;k++){const x=(k*67)%380+10,y=180+k*60;fw+=`<path d="M${x},${y} q4,-3 8,0 q-4,3 -8,0Z M${x+8},${y} l3,-2 v4Z" fill="#9fd0dc" stroke="none" opacity=".55"/>`}
  s+=`<g style="animation:fr16 3.6s cubic-bezier(.3,0,.6,1) forwards">${fw}</g><g class="dn16">${w}</g>`;
  let nw='';for(let k=0;k<46;k++){const x=(k*89)%400,y=(k*131)%2600+300,r=1.6+(k%4);nw+=`<circle cx="${x}" cy="${y}" r="${r}" fill="#e8fbff" opacity="${(.35+(k%3)*.15).toFixed(2)}" stroke="none"/>`}
  nw+=`<g transform="translate(330,1500) scale(3.2)" opacity=".9"><path d="M-20,0 Q0,-12 22,0 Q0,12 -20,0Z M-18,0 l-12,-9 v18Z" fill="#245a78" stroke-width=".7"/><circle cx="12" cy="-2" r="1.6" fill="#fff" stroke="none"/></g>`;
  nw+=`<g transform="translate(40,2300) scale(2.6)" opacity=".9"><path d="M-20,0 Q0,-12 22,0 Q0,12 -20,0Z M-18,0 l-12,-9 v18Z" fill="#1e4e6a" stroke-width=".7"/></g>`;
  const near=`<g style="animation:nr16 3.6s cubic-bezier(.3,0,.6,1) forwards">${nw}</g>`;
  /* 潛水鐘（窗裡看得到主角）、鋼索、氣泡 */
  const face=kid({view:'front',pose:'stand',hat:-1,hs:0,skin:'#f0c8a0',hair:'#4a3a32',shirt:'#e8823a',pants:'#3b4a6a',top:'long',bottom:'pants',mood:2,plain:true});
  s+=`<defs><linearGradient id="sea16f" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7cc8d8"/><stop offset=".5" stop-color="#3f8fb0"/><stop offset="1" stop-color="#1e5676"/></linearGradient><clipPath id="bw16"><circle cx="0" cy="-52" r="21"/></clipPath></defs>`;
  s+=`<g class="sw16"><path d="M200,-20 V200" fill="none" stroke="#3d3833" stroke-width="3"/><g transform="translate(200,360) scale(1.5)">${bellArt()}<g clip-path="url(#bw16)"><rect x="-24" y="-76" width="48" height="48" fill="#f4e8c8" stroke="none"/>${T(0,-26,.78,face)}</g><circle cx="0" cy="-52" r="21" fill="#cfeef4" fill-opacity=".25" stroke="none"/><path d="M0,-72 V-32 M-20,-52 H20" fill="none" stroke="${GOLD}" stroke-width="2.4" opacity=".7"/></g></g>`;
  s+=[[150,300,0],[250,280,.5],[180,240,.9],[230,330,1.2],[140,200,.3]].map(([x,y,d])=>`<circle class="bb16" style="animation-delay:${d}s" cx="${x}" cy="${y}" r="${5+(x%3)}" fill="#e8fbff" fill-opacity=".8" stroke-width="1.4"/>`).join('');
  s+=near;
  return s+`</g></svg>`}};
H.BELL16=bellArt; /* 入口（打撈船）和預告圖也用同一個潛水鐘 */

/* ================= 11. 會游的魚（2026-11-18 使用者：魚不能往後游；有些魚到處游、會像真的魚一樣快速轉彎；有魚群；被點到會快速散開或游走） =================
   不是 sprite：場景蓋好之後另外放一層 #fish16（在佈景和人物上面、要找的物件下面），用 requestAnimationFrame 移動。
   每條魚永遠朝著自己前進的方向（頭朝前），轉彎就整條轉過去；往左游時上下翻回來，肚子保持朝下。尾巴用 CSS 動畫擺動。
   單獨的魚：隨機慢慢漫遊，偶爾「快速轉彎＋衝一下」；魚群：跟著一個看不見的領頭，各自游向自己的位置，領頭急轉時大家跟著轉。
   點到：單獨的魚往反方向衝走；魚群被點到附近的魚往四面八方散開，過一下再慢慢游回來集合。不算點錯。 */
const FB={x0:660,x1:1840,y0:300,y1:2080};
const tail=(d,c)=>`<g class="ft16"><path d="${d}" fill="${c}" stroke-width="1.2"/></g>`;
const FISHART={
 small:c=>tail('M-7,0 L-13,-4.4 L-11.6,0 L-13,4.4Z',c)+`<path d="M-8,0 Q-2,-4.8 8,0 Q-2,4.8 -8,0Z" fill="${c}" stroke-width="1.2"/><path d="M-5,1 Q1,2.6 7,.6" fill="none" stroke="#fff" stroke-width="1" opacity=".8"/><circle cx="4.4" cy="-1" r=".9" fill="${OL}" stroke="none"/>`,
 tang:()=>tail('M-12,0 L-20,-7 L-18,0 L-20,7Z','#f5d040')+`<path d="M-8,-8 Q0,-17 8,-9Z M-8,8 Q0,16 6,9Z" fill="#f2c430" stroke-width="1.2"/><path d="M-13,0 Q-10,-12 4,-10 Q14,-5 15,0 Q14,5 4,10 Q-10,12 -13,0Z" fill="#f5d84a" stroke-width="1.5"/><circle cx="8" cy="-2.6" r="1.6" fill="${OL}" stroke="none"/><path d="M14,0 l3,-1" fill="none" stroke-width="1.2"/>`,
 blue:()=>tail('M-12,0 L-20,-7 L-18,0 L-20,7Z','#f5d040')+`<path d="M-13,0 Q-10,-11 4,-10 Q14,-5 15,0 Q14,5 4,10 Q-10,11 -13,0Z" fill="#3f7ad0" stroke-width="1.5"/><path d="M-9,-4 Q0,-9 8,-4 Q2,-2 -2,3 Q-6,0 -9,-4Z" fill="#1e2a48" stroke="none"/><circle cx="8" cy="-2" r="1.6" fill="#fff" stroke="none"/><circle cx="8.4" cy="-2" r=".9" fill="${OL}" stroke="none"/>`,
 angel:()=>tail('M-9,0 L-16,-6 L-15,0 L-16,6Z','#e8e4da')+`<path d="M-4,-8 Q-8,-24 -14,-28 Q2,-22 6,-8Z M-4,8 Q-8,24 -14,28 Q2,22 6,8Z" fill="#e8e4da" stroke-width="1.2"/><path d="M-10,0 Q-6,-12 4,-9 Q12,-4 13,0 Q12,4 4,9 Q-6,12 -10,0Z" fill="#f2efe6" stroke-width="1.5"/><path d="M-4,-10 V10 M3,-9 V9" fill="none" stroke="#2b2420" stroke-width="2.4"/><circle cx="8" cy="-2" r="1.5" fill="${OL}" stroke="none"/>`,
 red:()=>tail('M-14,0 L-22,-7 L-20,0 L-22,7Z','#e86a5a')+`<path d="M-6,-8 Q2,-13 10,-7Z" fill="#d85a4a" stroke-width="1.2"/><path d="M-15,0 Q-10,-9 6,-8 Q16,-4 17,0 Q16,4 6,8 Q-10,9 -15,0Z" fill="#f08070" stroke-width="1.5"/><path d="M-12,2 Q0,6 14,2" fill="none" stroke="#fbd8c8" stroke-width="2" opacity=".9"/><circle cx="10" cy="-2" r="1.6" fill="${OL}" stroke="none"/>`};
let FT=0;const FS=[];
const rnd=(a,b)=>a+Math.random()*(b-a),angD=(a,b)=>{let d=a-b;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return d};
const flat=a=>{const c=Math.cos(a),s=Math.sin(a);return Math.atan2(Math.max(-.5,Math.min(.5,s)),c)}; /* 魚大多橫著游，不要直直上下 */
function freeStep(f,dt){f.t-=dt;
 if(f.t<=0){if(Math.random()<.32){f.tA=flat(f.a+(Math.random()<.5?-1:1)*rnd(1.8,3));f.turn=rnd(6,9);f.burst=rnd(.3,.6)}else{f.tA=flat(f.a+rnd(-.9,.9));f.turn=rnd(1,1.8)}f.t=rnd(1.2,3.6)}
 const m=90;if(f.x<FB.x0+m||f.x>FB.x1-m||f.y<FB.y0+m||f.y>FB.y1-m){const ta=flat(Math.atan2((FB.y0+FB.y1)/2+rnd(-300,300)-f.y,(FB.x0+FB.x1)/2-f.x));if(Math.abs(angD(ta,f.tA))>.6){f.tA=ta;f.turn=Math.max(f.turn,2.6)}}
 const d=angD(f.tA,f.a),mx=f.turn*dt;f.a+=Math.max(-mx,Math.min(mx,d));
 f.burst=Math.max(0,f.burst-dt);const sp=f.v*(f.burst>0?3.4:1);f.x+=Math.cos(f.a)*sp*dt;f.y+=Math.sin(f.a)*sp*dt}
function memberStep(m,L,dt){let tA,sp;
 if(m.scat>0){m.scat-=dt;tA=m.fa;sp=Math.max(L.v,300*m.scat/1.4);m.turn=10}
 else{const c=Math.cos(L.a),s=Math.sin(L.a),tx=L.x+m.ox*c-m.oy*s,ty=L.y+m.ox*s+m.oy*c,dx=tx-m.x,dy=ty-m.y,dd=Math.hypot(dx,dy);
  if(dd<5){tA=L.a;sp=L.v*(L.burst>0?3.4:1)}else{tA=Math.atan2(dy,dx);sp=Math.min(L.v*4.2,Math.max(L.v*.7,dd*2.4))}m.turn=dd>60?7:5}
 const d=angD(tA,m.a),mx=m.turn*dt;m.a+=Math.max(-mx,Math.min(mx,d));
 m.x+=Math.cos(m.a)*sp*dt;m.y+=Math.sin(m.a)*sp*dt}
function fishStop(){FT++;FS.length=0;const o=document.getElementById('fish16');if(o)o.remove()}
function fishStart(){fishStop();const my=FT;WX=1500;WT=0;WD=-1;
 const go=()=>{if(my!==FT||H.scene()!==N)return;const ex=document.getElementById('exitL');if(!ex){requestAnimationFrame(go);return}
  const NSV='http://www.w3.org/2000/svg',lay=document.createElementNS(NSV,'g');lay.id='fish16';lay.setAttribute('stroke',OL);lay.setAttribute('stroke-linejoin','round');lay.setAttribute('stroke-linecap','round');
  ex.parentNode.insertBefore(lay,ex.nextSibling);
  let h=`<style>#fish16 .ft16{transform-box:fill-box;transform-origin:100% 50%;animation:ft16 .34s ease-in-out infinite alternate}@keyframes ft16{from{transform:rotate(-18deg)}to{transform:rotate(18deg)}}</style>`;
  const mk=(f,art)=>{f.i=FS.length;FS.push(f);h+=`<g id="fi16_${f.i}">${art}</g>`};
  /* 單獨的魚 */
  const K=['tang','blue','angel','red','tang','blue','angel','red','tang','blue','red','angel'];
  K.forEach(k=>{const a=rnd(-3.1,3.1);mk({kind:'solo',x:rnd(FB.x0+100,FB.x1-100),y:rnd(FB.y0+100,FB.y1-100),a:flat(a),tA:flat(a),v:rnd(26,48),turn:1.4,t:rnd(0,2),burst:0,sc:rnd(.9,1.3)},`<g transform="scale(${f(rnd(.9,1.25))})">${FISHART[k]()}</g>`)});
  /* 魚群：看不見的領頭＋7～10 條小魚 */
  [['#9ad0e8',FB.x0+260,520],['#f5c040',1600,1000],['#8ad0c8',900,1250],['#f0a0b8',1500,1650],['#b8c8f0',1100,800]].forEach(([c,x,y])=>{
   const L={kind:'lead',x,y,a:flat(rnd(-3,3)),v:rnd(30,42),turn:1.2,t:rnd(0,2),burst:0,mem:[]};L.tA=L.a;FS.push(L);
   const n=Math.floor(rnd(7,11));for(let i=0;i<n;i++){const row=Math.floor(i/3),m={kind:'mem',L,ox:-row*24+rnd(-4,4),oy:((i%3)-1)*20+rnd(-4,4)+(row%2?10:0),x:x+rnd(-20,20),y:y+rnd(-20,20),a:L.a,scat:0,fa:0,turn:5};
    L.mem.push(m);mk(m,`<g transform="scale(1.6)">${FISHART.small(c)}</g>`)}});
  lay.innerHTML=h;FS.forEach(f=>{if(f.i!=null)f.el=document.getElementById('fi16_'+f.i)});
  let last=performance.now();
  const loop=t=>{if(my!==FT)return;const dt=Math.min(.05,(t-last)/1000);last=t;
   if(H.scene()===N&&!document.hidden&&H.game().running){
    whaleTick(t,dt);
    FS.forEach(f=>{if(f.kind==='mem')memberStep(f,f.L,dt);else freeStep(f,dt)});
    const v=H.view(),sc=H.scr(),X0=-v.tx/v.s-40,X1=(sc.w-v.tx)/v.s+40,Y0=-v.ty/v.s-40,Y1=(sc.h-v.ty)/v.s+40;
    FS.forEach(f=>{if(!f.el)return;const vis=f.x>X0&&f.x<X1&&f.y>Y0&&f.y<Y1;if(!vis&&f.off)return;f.off=!vis;
     f.el.setAttribute('transform',`translate(${f.x.toFixed(1)},${f.y.toFixed(1)}) rotate(${(f.a*57.2958).toFixed(1)}) scale(1,${Math.cos(f.a)<0?-1:1})`)})}
   requestAnimationFrame(loop)};
  requestAnimationFrame(loop)};
 requestAnimationFrame(go)}
/* 點到魚：單獨的魚往反方向衝走；魚群散開。回傳有沒有魚被嚇到 */
function fishTap(x,y){let hit=false;const r=Math.max(34,26/H.view().s);
 FS.forEach(f=>{if(f.kind==='lead')return;const d=Math.hypot(f.x-x,f.y-y);
  if(f.kind==='solo'&&d<r){hit=true;f.tA=flat(Math.atan2(f.y-y,f.x-x));f.turn=11;f.burst=1.1;f.t=2}
  if(f.kind==='mem'&&d<r*2.6){hit=true;f.scat=rnd(1.1,1.7);f.fa=Math.atan2(f.y-y,f.x-x)+rnd(-.5,.5)}});
 if(hit){FS.forEach(L=>{if(L.kind==='lead'&&L.mem.some(m=>m.scat>0)){L.tA=flat(Math.atan2(L.y-y,L.x-x));L.turn=4;L.burst=.8;L.t=2.5}});
  try{tone(880,.06,'triangle',.03);setTimeout(()=>tone(1170,.06,'triangle',.025),60)}catch(_){}}
 return hit}
H.NGHOOKS.push(sc=>{if(sc===N)fishStart();else fishStop()});
H.FISH16={all:()=>FS,tap:fishTap}; /* 測試用 */

/* ================= 10. 場景彩蛋：點鯨魚 → 噴水柱＋哼歌；點章魚 → 噴墨、臉紅 ================= */
let whBusy=0,ocBusy=0;
H.TAPHOOKS[N]=(x,y)=>{
 if(fishTap(x,y))return true;
 if(y<262&&x>WX-250&&x<WX+250){if(whBusy)return true;const sp=document.getElementById('whSp16'),nt=document.getElementById('whNote16');if(!sp)return false;whBusy=1;
  H.toast('噗——！大鯨魚噴了一道水柱，還輕輕哼起歌來⋯',2600);
  try{[[196,0],[247,420],[294,840],[247,1260],[330,1700]].forEach(([fq,d])=>setTimeout(()=>tone(fq,.5,'sine',.04),d))}catch(_){}
  const t0=performance.now(),D=2600;const step=t=>{const k=Math.min(1,(t-t0)/D),up=k<.2?k/.2:k>.6?1-(k-.6)/.4:1;
   sp.style.opacity=f(up);{const [px,py]=(sp.dataset.sp||'0,0').split(',').map(Number);sp.setAttribute('transform',`translate(${px},${py}) scale(1,${f(.3+.7*up)}) translate(${-px},${-py})`)}if(nt){nt.style.opacity=f(Math.min(1,k*3)*(1-Math.max(0,k-.7)/.3));nt.setAttribute('transform',`translate(0,${f(-30*k)})`)}
   if(k<1)requestAnimationFrame(step);else{sp.style.opacity=0;if(nt)nt.style.opacity=0;whBusy=0}};requestAnimationFrame(step);return true}
 if(Math.abs(x-ARCH.x)<140&&y<ARCH.y+10&&y>ARCH.y-310){if(ocBusy)return true;const ink=document.getElementById('oct16ink'),ck=document.getElementById('oct16cheek'),bd=document.getElementById('oct16body');if(!ink)return false;ocBusy=1;
  H.toast('🐙 噗！大章魚害羞得噴了一團墨，臉都紅了！',2400);
  try{tone(140,.2,'sawtooth',.03);setTimeout(()=>tone(220,.3,'sine',.04),200)}catch(_){}
  const arms=[...document.querySelectorAll('#bg .oc16')];
  if(bd)bd.setAttribute('fill','#e0405a');arms.forEach(a=>a.setAttribute('stroke','#e0405a'));
  const t0=performance.now(),D=2600;const step=t=>{const k=Math.min(1,(t-t0)/D);
   ink.style.opacity=f(k<.15?k/.15:Math.max(0,1-(k-.15)/.85));ink.setAttribute('transform',`translate(0,-150) scale(${f(.6+k*1.2)}) translate(0,150)`);ck.style.opacity=f(k<.85?1:(1-k)/.15);
   if(k<1)requestAnimationFrame(step);else{ink.style.opacity=0;ck.style.opacity=0;if(bd)bd.setAttribute('fill','#c8507a');arms.forEach(a=>a.setAttribute('stroke','#c8507a'));ocBusy=0}};requestAnimationFrame(step);return true}
 return false};
})();

/* ================= 出口：第 5 關海島港口，南邊外海的紅色打撈船（引擎 11-17b「找路發現新關卡」） =================
   levels.js 這一關有 find:{after:10,from:5,hint:[…]}。打撈船本身畫在 level5.js 的地面（SAL5，一直都在）。
   第 10 關 2 星之後：點燈塔 → 光束轉到南邊、停在打撈船上（鏡頭跟過去），船一閃一閃，船長頭上出現「…」；
   點船長 →「要坐潛水鐘下海嗎？」→ 出發才算發現。燈塔還沒照到之前，點打撈船沒有反應（EXITS[16].w=0）。發現之後每局都可以直接點。 */
(function(){
const H=window.TH;if(!H)return;const N=16;const {T,f,OL}=H;
const EX={x:1335,y:2512},LAMP={x:1900,y:314},LH={x:1900,y:540},CAP={x:1365,y:2479};
const W=250;
const lx=LAMP.x-EX.x,ly=LAMP.y-EX.y,tx=0,ty=-50,dx=tx-lx,dy=ty-ly,dl=Math.hypot(dx,dy),px=-dy/dl,py=dx/dl;
const beam=`<g id="beam16" style="opacity:0"><path d="M${f(lx+px*7)},${f(ly+py*7)} L${f(tx+px*90)},${f(ty+py*90)} L${f(tx-px*90)},${f(ty-py*90)} L${f(lx-px*7)},${f(ly-py*7)}Z" fill="#fff6c4" opacity=".55" stroke="none"/><path d="M${f(lx+px*3)},${f(ly+py*3)} L${f(tx+px*40)},${f(ty+py*40)} L${f(tx-px*40)},${f(ty-py*40)} L${f(lx-px*3)},${f(ly-py*3)}Z" fill="#fffbe6" opacity=".5" stroke="none"/></g>`;
const dots=`<g class="qbob">${H.bubble(CAP.x-EX.x+8,CAP.y-EX.y-60,'dots').replace(/r="1\.7"/g,'r="1.75"')}</g>`;
const glow=`<ellipse cx="-20" cy="-40" rx="150" ry="62" fill="#fff6c4" stroke="none" opacity=".1"><animate attributeName="opacity" values=".05;.4;.05" dur="1.2s" repeatCount="indefinite"/></ellipse>`;
let lit=false,busy=false;
const svg=found=>beam+(found?'':`<g id="lit16" style="opacity:${lit?1:0}">${glow}${dots}</g>`);
const bellPv=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s})">${H.BELL16?H.BELL16():''}</g>`;
const pv=()=>`<svg viewBox="0 0 220 110" width="220" height="110" style="display:block"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><defs><linearGradient id="pv16" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#6fc4d8"/><stop offset="1" stop-color="#1e5676"/></linearGradient></defs><rect width="220" height="110" rx="10" fill="url(#pv16)" stroke="none"/>`+
 [30,90,150].map(x=>`<path d="M${x},0 L${x+18},0 L${x+48},110 L${x+20},110Z" fill="#fff" opacity=".12" stroke="none"/>`).join('')+
 `<path d="M0,96 Q60,88 110,94 Q170,100 220,90 V110 H0Z" fill="#d6cba0"/><path d="M110,0 V40" fill="none" stroke="#3d3833" stroke-width="1.6"/>`+bellPv(110,92,.5)+
 `<g fill="#f5c040" stroke-width="1">${[[30,40],[44,48],[36,56]].map(([x,y])=>`<path d="M${x-6},${y} Q${x},${y-4} ${x+6},${y} Q${x},${y+4} ${x-6},${y}Z M${x-6},${y} l-4,-3 v6Z"/>`).join('')}</g>`+
 `<circle cx="150" cy="40" r="4" fill="#e8fbff" stroke-width="1"/><circle cx="160" cy="26" r="3" fill="#e8fbff" stroke-width="1"/><circle cx="146" cy="14" r="2.4" fill="#e8fbff" stroke-width="1"/></g></svg>`;
H.EXITS[N]={x:EX.x,y:EX.y,w:0,h:130,svg,ask:{pv,title:'要坐潛水鐘下海嗎？',
 text:'打撈船船長：哈！燈塔的光照到我了，表示有人想下海！<br>底下有一艘大沉船，潛水隊正在打撈寶藏。要不要坐潛水鐘下去看看？',again:'打撈船船長：又要下去啦？<br>潛水鐘準備好了，坐穩囉！',
 go:'🤿 坐進潛水鐘',wait:'之後再說',waitMsg:'打撈船船長：好，潛水鐘先幫你吊著，想下去再來找我！'}};
const E=H.EXITS[N];
/* 點燈塔：光束從燈室轉到打撈船，鏡頭跟過去；照到之後船長頭上出現「…」 */
function shine(){const bm=document.getElementById('beam16'),gl=document.getElementById('lhGlow');if(!bm)return false;busy=true;
 try{H.tone(520,.12,'sine',.04);setTimeout(()=>H.tone(660,.14,'sine',.04),160);setTimeout(()=>H.tone(880,.3,'sine',.04),1700)}catch(_){}
 H.toast('💡 燈塔的光慢慢轉向南邊外海⋯',2200);
 const t0=performance.now(),D=3600,L0=`${f(lx)} ${f(ly)}`;let moved=false,shown=false;
 const step=t=>{const k=Math.min(1,(t-t0)/D),a=k<.3?-50*(1-k/.3):0,o=k<.15?k/.15:k<.75?1:Math.max(0,1-(k-.75)/.25);
  bm.style.opacity=f(o);bm.setAttribute('transform',`rotate(${f(a)} ${L0})`);if(gl)gl.setAttribute('opacity',f(.25+.6*o));
  if(!moved&&k>.22){moved=true;try{H.tweenTo(H.view().s,EX.x,EX.y-90,1500)}catch(_){}}
  if(!shown&&k>.55){shown=true;lit=true;E.w=W;const el=document.getElementById('lit16');if(el)el.style.opacity=1;H.toast('✨ 光停在一艘紅色的打撈船上⋯船長好像有話想說！',3200)}
  if(k<1)requestAnimationFrame(step);else{bm.style.opacity=0;if(gl)gl.setAttribute('opacity','.25');busy=false}};
 requestAnimationFrame(step);return true}
/* 第 5 關的燈塔彩蛋包一層（每局開始時確認一次，不管哪個檔案先載入） */
let wrapped=null;
function wrap(){const cur=H.TAPHOOKS[5];if(cur&&cur===wrapped)return;const prev=cur;
 wrapped=(x,y)=>{if(Math.abs(x-LH.x)<=34&&y<=LH.y+6&&y>=LH.y-250&&H.canFind(N)&&!H.isFound(N)&&!lit){if(!busy)shine();return true}return prev?prev(x,y):false};
 H.TAPHOOKS[5]=wrapped}
H.NGHOOKS.push(sc=>{lit=false;busy=false;E.w=H.isFound(N)?W:0;if(sc===5)wrap()});
wrap();
})();
