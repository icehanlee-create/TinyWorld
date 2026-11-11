/* 奇幻小鎮大搜查．櫻花山城（第 6～9 關）共用素材．風格 A「柔和圓潤」
   由 levels.js 第 6～9 關的 pre:'sakura_common.js' 先載入，只載入一次。
   對外只放 H.SAKURA（畫法函式），並登記共用佈景 kind（sk 開頭）到 KIND。
   線條沿用場景預設（stroke=OL、寬 2、圓角），只有「圓團聯集外框」需要自己指定描邊。
   座標：腳底在 (0,0)，往上是負 y，和 art.js 的 roundTree／pine 一致。 */
(function(){
const H=window.TH;if(!H)return;
const {T,f,r,pk,ri,shade,OL,KIND}=H;

/* ---- 顏色（春天：淡粉櫻色、朱紅、竹綠、白牆黑瓦） ---- */
const C={
 pink:['#f7c4d3','#f9cdd9','#f4bccd'],pink2:'#eea6bb',hi:'#fde4ec',leaf:'#a8c47a',leaf2:'#7e9c52',
 trunk:'#7a5235',red:'#d8413a',black:'#3a2e2a',gold:'#f3c542',
 stone:'#b9b4a8',stone2:'#9b968a',moss:'#7ea05a',glow:'#f8dd8a',
 bam:['#7fae5a','#86b562','#78a653'],bam2:'#5f8a3a',bamHi:'#cfe6a8',
 wall:['#f4ecd8','#f1e8d2','#f6efdd'],wood:'#7a5235',roof:'#4a4f5c',roofHi:'#6a7080',
 noren:['#2f4a7a','#a8322e','#3f6a5a','#6a4a8a'],lamp:'#d8413a'
};
const shadow=w=>`<ellipse cx="4" cy="1" rx="${w}" ry="6" fill="#000" opacity=".18" stroke="none"/>`;

/* 圓團聯集：先畫一圈粗描邊，再用同色填滿，只剩外輪廓（內部重疊的線被蓋掉） */
const blobs=L=>`<g stroke="${OL}" stroke-width="4" stroke-linejoin="round">${L.map(([x,y,rr,c])=>`<circle cx="${f(x)}" cy="${f(y)}" r="${rr}" fill="${c}"/>`).join('')}</g>`+
 L.map(([x,y,rr,c])=>`<circle cx="${f(x)}" cy="${f(y)}" r="${rr}" fill="${c}" stroke="none"/>`).join('');
const dots=(n,box,cols,rad)=>{let s='';for(let i=0;i<n;i++)s+=`<circle cx="${f(box[0]+r()*box[2])}" cy="${f(box[1]+r()*box[3])}" r="${rad}" fill="${cols[i%cols.length]}" stroke="none"/>`;return s};
const petals=(n,box,col)=>{let s='';for(let i=0;i<n;i++){const x=box[0]+r()*box[2],y=box[1]+r()*box[3];s+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="3.2" ry="1.8" transform="rotate(${ri(0,180)} ${f(x)} ${f(y)})" fill="${col}" stroke="none"/>`}return s};

/* ---- 櫻花樹：full 盛開／half 半開／fall 落花 ---- */
function sakuraTree(kind){
 const p=pk(C.pink),p2=C.pink2;let t=shadow(30);
 if(kind==='fall'){
  t+=`<path d="M-7,0 Q-9,-16 -4,-36 L5,-36 Q2,-16 8,0Z" fill="${C.trunk}"/>`;
  t+=`<path d="M0,-36 Q-14,-48 -26,-56 M0,-36 Q12,-52 26,-58 M0,-40 Q2,-58 -2,-72" fill="none" stroke="${C.trunk}" stroke-width="3.4"/>`;
  t+=blobs([[-26,-58,12,p],[26,-60,13,p],[0,-72,14,p],[-8,-50,10,p]]);
  t+=`<ellipse cx="0" cy="-1" rx="30" ry="5" fill="${p}" stroke="none" opacity=".9"/>`+petals(14,[-34,-44,68,44],p)+petals(8,[-30,-6,60,8],C.hi);
  return t;
 }
 t+=`<path d="M-7,0 Q-9,-16 -4,-36 L5,-36 Q2,-16 8,0Z" fill="${C.trunk}"/><path d="M-2,-8 q2,-6 0,-12" fill="none" stroke-width="1"/>`;
 const half=kind==='half',g=C.leaf;
 const L=[[-24,-56,20,p],[0,-70,24,half?g:p],[24,-56,20,p],[-12,-42,20,half?g:p],[14,-42,20,p],[0,-54,22,p]];
 t+=blobs(L);
 if(half)t+=dots(10,[-30,-80,60,50],[C.hi,p2],2.2)+`<g stroke="none" fill="${C.leaf2}"><circle cx="-4" cy="-74" r="6"/><circle cx="-14" cy="-40" r="5"/></g>`;
 else t+=`<g stroke="none"><circle cx="-18" cy="-66" r="8" fill="${C.hi}"/><circle cx="8" cy="-82" r="7" fill="${C.hi}"/><circle cx="26" cy="-62" r="5" fill="${C.hi}"/><circle cx="12" cy="-36" r="9" fill="${p2}"/><circle cx="-14" cy="-34" r="7" fill="${p2}"/></g>`+dots(10,[-34,-84,68,52],[C.hi,p2],2);
 return t;
}
const sakuraFull=()=>sakuraTree('full'),sakuraHalf=()=>sakuraTree('half'),sakuraFall=()=>sakuraTree('fall');

/* ---- 花瓣：飄落在空中（靜態）與地上花瓣堆 ---- */
const petalDrift=()=>petals(9,[-30,-34,60,34],pk(C.pink))+petals(4,[-26,-30,52,28],C.hi);
const petalPile=()=>`<ellipse cx="0" cy="-3" rx="22" ry="5" fill="${pk(C.pink)}" stroke="none" opacity=".92"/>`+petals(8,[-22,-8,44,8],C.hi)+petals(5,[-20,-6,40,6],C.pink2);

/* ---- 朱紅鳥居（寬約 104、高約 92） ---- */
function torii(o={}){
 const red=o.red||C.red;let t=shadow(40);
 for(const sx of [-1,1]){const x=sx*26,P=4.5;
  t+=`<path d="M${x-P},0 L${x-P+1},-72 L${x+P-1},-72 L${x+P},0Z" fill="${red}"/><rect x="${x-P-2}" y="-6" width="${P*2+4}" height="6" rx="1.5" fill="${C.stone2}"/>`;}
 t+=`<rect x="-36" y="-56" width="72" height="7" fill="${red}"/><rect x="-5" y="-68" width="10" height="13" fill="${red}"/>`;
 t+=`<path d="M-42,-78 Q0,-68 42,-78 L42,-70 L-42,-70Z" fill="${red}"/><path d="M-52,-92 Q0,-74 52,-92 L47,-82 Q0,-67 -47,-82Z" fill="${C.black}"/>`;
 if(o.lamps)t+=`<path d="M-34,-49 v6 M34,-49 v6" stroke-width="1.2" fill="none"/><ellipse cx="-34" cy="-38" rx="4.5" ry="6" fill="${C.lamp}" stroke-width="1.3"/><ellipse cx="34" cy="-38" rx="4.5" ry="6" fill="${C.lamp}" stroke-width="1.3"/>`;
 return t;
}

/* ---- 石燈籠（春日型，高約 62）：glow=true 點亮，moss=true 長青苔 ---- */
function stoneLantern(o={}){
 const g=20,fw=8,fh=18,rw=18,fy=-9-g,ry=fy-fh;let t=shadow(18);
 t+=`<path d="M-12,0 H12 L10,-5 H-10Z" fill="${C.stone}"/><rect x="-4" y="${-5-g}" width="8" height="${g}" fill="${C.stone}"/><path d="M-12,${-5-g} H12 L9,${-9-g} H-9Z" fill="${C.stone2}"/>`;
 t+=`<rect x="${-fw}" y="${ry}" width="${fw*2}" height="${fh}" rx="1" fill="${C.stone}"/><rect x="${-fw+3}" y="${ry+4}" width="${fw*2-6}" height="${fh-8}" fill="${o.glow===false?'#8a8578':C.glow}" stroke-width="1.1"/>`;
 t+=`<path d="M${-rw},${ry} L${-rw*.5},${ry-11} H${rw*.5} L${rw},${ry}Z" fill="${C.stone2}"/><circle cx="0" cy="${ry-14}" r="3.4" fill="${C.stone}"/><path d="M-3,${ry-11} h6" stroke-width="1" fill="none"/>`;
 if(o.moss)t+=`<g fill="${C.moss}" stroke="none"><ellipse cx="-6" cy="-2" rx="6" ry="2.6"/><ellipse cx="${rw*.4}" cy="${ry-6}" rx="5" ry="2.2"/><ellipse cx="3" cy="${-9-g}" rx="5" ry="2"/></g>`;
 return t;
}

/* ---- 竹子（2～4 根一叢，高約 104） ---- */
function bamboo(n){
 n=n||ri(2,4);const col=pk(C.bam);let t=shadow(22);
 const leaf=(cx,cy,a)=>`<path d="M${cx},${cy} q7,-6 19,-3 q-9,5 -19,3Z" transform="rotate(${a} ${cx} ${cy})" fill="${C.bam2}" stroke-width="1.1"/>`;
 const xs=[-11,12,0,-20,20].slice(0,n),hs=[86,96,104,78,88];
 xs.forEach((x,i)=>{const h=hs[i],w=7;
  t+=`<rect x="${x-w/2}" y="${-h}" width="${w}" height="${h}" rx="2.3" fill="${col}"/><rect x="${x-w/2+1}" y="${-h+2}" width="2" height="${h-4}" fill="${C.bamHi}" stroke="none" opacity=".7"/>`;
  for(let y=-14;y>-h+6;y-=17)t+=`<path d="M${x-w/2-.8},${y} h${w+1.6}" stroke="${C.bam2}" stroke-width="2" fill="none"/>`;
  t+=leaf(x,-h+4,-70)+leaf(x,-h+4,-20)+leaf(x,-h+4,25)+leaf(x,-h+4,205)+leaf(x,-h+16,-40)+leaf(x,-h+22,190)});
 return t;
}

/* ---- 黑瓦屋頂（單層，w 為屋簷寬；腳底在簷下緣） ---- */
const tileRoof=(w=112,h=20)=>{const a=w/2;let t=`<path d="M${-a},0 L${-a*.62},${-h} H${a*.62} L${a},0 Q0,6 ${-a},0Z" fill="${C.roof}"/>`;
 for(let i=-2;i<=2;i++)t+=`<path d="M${i*a*.28},${-h+2} L${i*a*.4},-1" stroke="${C.roofHi}" stroke-width="1.1" fill="none"/>`;
 return t+`<rect x="${-a*.62-2}" y="${-h-4}" width="${a*1.24+4}" height="5" rx="2" fill="${C.black}" stroke-width="1.2"/>`};

/* ---- 木格窗商店（兩層、白牆黑瓦、暖簾；寬約 112、高約 104） ---- */
function shop(o={}){
 const wall=o.wall||pk(C.wall),nor=o.noren||pk(C.noren);let t=shadow(56);
 t+=`<rect x="-48" y="-36" width="96" height="36" fill="${wall}"/><rect x="-48" y="-36" width="6" height="36" fill="${C.wood}" stroke-width="1.2"/><rect x="42" y="-36" width="6" height="36" fill="${C.wood}" stroke-width="1.2"/>`;
 t+=`<rect x="-30" y="-30" width="60" height="22" fill="#3d322c" stroke-width="1.2"/><rect x="-30" y="-12" width="60" height="6" fill="${C.wood}" stroke-width="1.2"/>`;
 t+=`<path d="M-24,-30 v12 M-8,-30 v12 M8,-30 v12 M24,-30 v12" stroke="${nor}" stroke-width="10" fill="none" stroke-linecap="butt"/>`;
 t+=`<path d="M-58,-36 L-46,-48 H46 L58,-36 Q0,-32 -58,-36Z" fill="${C.roof}"/><path d="M-20,-44 v-3 M0,-44 v-3 M20,-44 v-3" stroke="${C.roofHi}" stroke-width="1" fill="none"/>`;
 t+=`<rect x="-40" y="-76" width="80" height="28" fill="${wall}"/><rect x="-40" y="-76" width="80" height="4" fill="${C.wood}" stroke-width="1"/>`;
 for(const x of [-30,-6,18])t+=`<rect x="${x}" y="-70" width="18" height="16" fill="#8a6a4a" stroke-width="1.2"/><path d="M${x+6},-70 v16 M${x+12},-70 v16 M${x},-62 h18 M${x},-57 h18" stroke="#e8d9b0" stroke-width="1" fill="none"/>`;
 t+=`<path d="M-56,-76 L-34,-96 H34 L56,-76 Q0,-70 -56,-76Z" fill="${C.roof}"/><path d="M-44,-80 l9,-14 M-24,-79 l5,-15 M0,-78 v-16 M24,-79 l-5,-15 M44,-80 l-9,-14" stroke="${C.roofHi}" stroke-width="1.1" fill="none"/><rect x="-36" y="-100" width="72" height="5" rx="2" fill="${C.black}" stroke-width="1.2"/>`;
 if(o.lantern!==false)t+=`<g transform="translate(-52,-40)"><path d="M0,0 v5" stroke-width="1.2"/><ellipse cx="0" cy="12" rx="6.5" ry="8.5" fill="${C.lamp}" stroke-width="1.3"/><path d="M-5,7 h10 M-5,17 h10" stroke-width="1.3"/></g>`;
 return t;
}

/* ---- 石階（n 級，往上變窄；寬約 96、每級高 10） ---- */
function stairs(n=6,o={}){
 let t=shadow(44);
 for(let i=0;i<n;i++){const w=96-i*7,y=-i*10;
  t+=`<path d="M${-w/2},${y} H${w/2} V${y-5} H${-w/2}Z" fill="${C.stone2}"/><path d="M${-w/2+1},${y-5} H${w/2-1} L${w/2-4},${y-11} H${-w/2+4}Z" fill="${C.stone}"/>`}
 if(o.petals!==false)t+=petals(5,[-30,-n*10+8,60,n*6],pk(C.pink));
 return t;
}

/* ---- 蒸籠與蒸氣（蒸氣用半透明圓，不用模糊濾鏡） ---- */
const steam=(s=1)=>`<g fill="#ffffff" opacity=".78" stroke="none" transform="scale(${s})"><circle cx="-6" cy="-8" r="8"/><circle cx="4" cy="-16" r="10"/><circle cx="12" cy="-7" r="6"/><circle cx="-2" cy="-26" r="6" opacity=".7"/></g>`;
function steamer(n=2){
 let t=shadow(16);
 for(let i=0;i<n;i++){const y=-i*11;t+=`<path d="M-15,${y} L-14,${y-11} H14 L15,${y} Z" fill="#e8c98a"/><path d="M-14,${y-4} H14" stroke="#b8935a" stroke-width="1.2" fill="none"/>`}
 const y=-n*11;t+=`<path d="M-17,${y} Q0,${y-12} 17,${y}Z" fill="#d9b36a"/><circle cx="0" cy="${y-8}" r="2.4" fill="#b8935a" stroke-width="1.1"/>`;
 return t+`<g transform="translate(0,${y-8})">${steam()}</g>`;
}

H.SAKURA={C,blobs,petals,sakuraTree,sakuraFull,sakuraHalf,sakuraFall,petalDrift,petalPile,torii,stoneLantern,bamboo,tileRoof,shop,stairs,steam,steamer};

/* ---- 共用佈景 kind（四關都能用；w、h 是占地） ---- */
Object.assign(KIND,{
 skSakura:{w:72,h:92,fn:sakuraFull},skSakuraHalf:{w:72,h:92,fn:sakuraHalf},skSakuraFall:{w:70,h:92,fn:sakuraFall},
 skPetalDrift:{w:60,h:34,fn:petalDrift},skPetalPile:{w:46,h:12,fn:petalPile},
 skTorii:{w:108,h:96,fn:()=>torii()},skToriiLamp:{w:108,h:96,fn:()=>torii({lamps:true})},
 skLantern:{w:36,h:64,fn:()=>stoneLantern({moss:r()<.4})},skLanternDim:{w:36,h:64,fn:()=>stoneLantern({glow:false,moss:true})},
 skBamboo:{w:48,h:108,fn:()=>bamboo()},skRoof:{w:116,h:30,fn:()=>tileRoof()},
 skShop:{w:120,h:104,fn:()=>shop()},skStairs:{w:100,h:66,fn:()=>stairs(6)},skStairsLow:{w:100,h:36,fn:()=>stairs(3)},
 skSteamer:{w:36,h:60,fn:()=>steamer(ri(1,3))}
});
})();
