/* 奇幻小鎮大搜查．第 3 關「雪山溫泉村」
   由 index.html 在 level2.js 之後載入。版面用原本座標設計，再用 zx/zy 放大 1.25 倍（Z3＝1.5625 是面積倍數）。
   場景座標：x 500～2219、y 0～2812。 */
(function(){
const H=window.TH;if(!H)return;
const {ART,DECOY,KIND,LEVELS,OL,OUTFITS,POOL,REG,ROADS,SCENE_IMPL,SKIN,SNOW,STORIES,T,TAPHOOKS,VPLAN:VPLANX,WATERFN,act,add,cabinSVG,canPlace,f,heart,
 isWater,kid,limb,mark,peekHead,pickView,pineS,pk,r,rock,scatter,shade,signpost,skyBirds,sprites,sr,stall,steamPuff,swirl,tent,tone,walkPose,wrapAn}=H;

/* 第 3 關穿著：羽絨外套、圍巾、手套、靴子 */
OUTFITS[3]=o=>{if(o.top)return o;o.top='coat';o.shirt=o.shirt||pk(['#c4473c','#3f6fa8','#e0a03a','#5f7a3f','#7a5a8a','#3b5a8a','#e86a6a']);
  o.scarf=r()<.65?pk(['#d8413a','#f5c842','#fbf6ea','#3f8f8a','#e86a9a']):0;o.mitts=pk(['#d8413a','#f5c842','#fbf6ea','#3f6fa8']);o.boots=pk(['#4a3a30','#5a4a3a','#3d3833']);
  o.pants=o.pants||pk(['#3d3833','#4a5a78','#5a4a3a','#6b7790']);if(o.hat===undefined)o.hat=pk([0,0,4,3,-1]);return o};
/* ---- L3 (雪山溫泉村) item art ---- */
const scarfShape=(c,st)=>{const band=(d,w)=>`<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w+3.4}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`;return band('M-12,-9 Q0,3 12,-9 Q14,-14 8,-14 Q0,-6 -8,-14 Q-14,-14 -12,-9',4.5)+band('M-8,-6 Q-11,3 -12,12',6)+band('M-3,-3 Q-1,5 1,13',6)+`<path d="M-11.5,4 h-1 M-11,8 h-1 M-1,6 h1.5 M0,10 h1.5" fill="none" stroke="${st}" stroke-width="2.4"/><path d="M-14,13 l-1,4 M-12,14 v4 M-10,13 l1,4 M-1,14 v4 M1,14 l1,4 M3,13 l1,4" fill="none" stroke-width="1.2"/>`};
const mittenShape=(c,heart)=>`<path d="M-7,12 L-8,-2 Q-9,-14 0,-14 Q8,-14 7,-3 L9,-6 Q13,-9 14,-5 Q15,-1 9,4 L8,12Z" fill="${c}"/><rect x="-9" y="8" width="19" height="7" rx="2" fill="#fbf6ea"/>`+(heart?`<path d="M0,-1 c-2,-3 -6,-1 -4,2 l4,4 4,-4 c2,-3 -2,-5 -4,-2z" fill="#fbf6ea" stroke-width="1"/>`:'');
const mugShape=cream=>`<path d="M10,-2 Q18,-2 17,5 Q16,11 9,9" fill="none" stroke-width="2.4"/><path d="M-10,-6 L-9,12 Q0,15 9,12 L10,-6Z" fill="#f1ead8"/><path d="M-9.6,2 L9.6,2" fill="none" stroke="#c4473c" stroke-width="3"/>`+(cream?`<path d="M-11,-5 Q-13,-12 -5,-12 Q-2,-19 4,-15 Q11,-15 11,-5Z" fill="#fffaf0"/><circle cx="2" cy="-15" r="2" fill="#a0623a" stroke-width="1"/>`:`<ellipse cx="0" cy="-6" rx="10" ry="3" fill="#6b4a2b"/>`);
const tubShape=towel=>`<path d="M-12,-6 L-10,12 L10,12 L12,-6Z" fill="#d6a868"/><path d="M-4,-6 L-3.5,12 M4,-6 L3.5,12" fill="none" stroke="#a8703f" stroke-width="1"/><path d="M-11.5,-1 H11.5 M-10.5,8 H10.5" fill="none" stroke="#6b4a2b" stroke-width="2.2"/><ellipse cx="0" cy="-6" rx="12" ry="3.2" fill="#a8703f"/>`+(towel?`<path d="M-9,-8 Q-4,-11 3,-9 L6,6 L-1,7 L-3,-5 Q-7,-5 -9,-8Z" fill="#fbf6ea"/><path d="M1,1 L5.5,0.5" fill="none" stroke="#6fa8d0" stroke-width="1.8"/>`:'');
const skisShape=(c,st)=>[-5,5].map(dx=>`<g transform="translate(${dx},0) rotate(${dx*2.4})"><path d="M-3,16 L-3,-11 Q-3,-17 0,-18 Q3,-17 3,-11 L3,16Z" fill="${c}"/><path d="M0,-12 V14" fill="none" stroke="${st}" stroke-width="1.6"/><rect x="-3.6" y="0" width="7.2" height="4" fill="#3d3833" stroke-width="1"/></g>`).join('');
const beanieShape=c=>`<path d="M-13,6 Q-14,-12 0,-12 Q14,-12 13,6Z" fill="${c}"/><path d="M-6,-9 V5 M0,-11 V5 M6,-9 V5" fill="none" stroke-width="1" opacity=".4"/><rect x="-14.5" y="3" width="29" height="8" rx="3.5" fill="#fbf6ea"/><circle cx="0" cy="-14" r="5" fill="#fbf6ea"/>`;
const snowmanShape=hat=>`<circle cy="7" r="9" fill="#fbf7ef"/><circle cy="-6" r="6.5" fill="#fbf7ef"/>`+(hat?`<rect x="-5" y="-20" width="10" height="9" fill="${OL}"/><rect x="-8" y="-12.5" width="16" height="2.6" rx="1" fill="${OL}"/><path d="M-5,-14.5 H5" fill="none" stroke="#c4473c" stroke-width="1.6"/>`:'')+`<path d="M0,-5.5 l6.5,1.6 l-6.5,1.2Z" fill="#e07a32" stroke-width="1"/><g fill="${OL}" stroke="none"><circle cx="-2.6" cy="-8" r="1"/><circle cx="1.8" cy="-8" r="1"/><circle cy="4" r="1.1"/><circle cy="8.5" r="1.1"/></g><path d="M-8,4 L-15,-2 M8,4 L15,-1" fill="none" stroke="#7a5235" stroke-width="1.6"/>`;
Object.assign(ART,{scarf:scarfShape('#c4473c','#fbf6ea'),mitten:mittenShape('#9a6fa8',true),cocoa:mugShape(true),tub:tubShape(true),skis:skisShape('#c4473c','#e0b44a'),
 pinecone:(()=>{let g=`<path d="M0,-15 q1,-4 3,-5" fill="none" stroke-width="1.6"/>`;
  [[-11,4],[-6,7.5],[-1,9.5],[4,9.5],[9,7.5],[13,4.5]].forEach(([y,w],i)=>{const c=i%2?'#8f5f34':'#a8784a';g+=`<path d="M${-w-3.5},${y+1.5} L${-w+.5},${y-4} L${-w*.35},${y-1.5} L0,${y-4.5} L${w*.35},${y-1.5} L${w-.5},${y-4} L${w+3.5},${y+1.5} Q0,${y+5.5} ${-w-3.5},${y+1.5}Z" fill="${c}" stroke-width="1.3"/>`});
  return g+`<path d="M-2,16 L0,19 L2,16Z" fill="#8f5f34" stroke-width="1.2"/>`})(),
 beanie:beanieShape('#d98c46'),snowman:snowmanShape(true)});
Object.assign(DECOY,{scarfBlue:scarfShape('#5a86b0','#fbf6ea'),mittenPlain:mittenShape('#9a6fa8',false),mittenGreen:mittenShape('#6f9a4a',true),coffee:mugShape(false),tubPlain:tubShape(false),
 skisBlue:skisShape('#5a86b0','#fbf6ea'),beanieTeal:beanieShape('#6fa8a0'),beanieRed:beanieShape('#c4473c'),snowmanPlain:snowmanShape(false),
 sled:`<path d="M-17,5 L14,5 Q20,5 19,-1" fill="none" stroke="#c4473c" stroke-width="2.4"/><rect x="-15" y="-5" width="27" height="6" rx="2" fill="#c99a5b"/><path d="M-10,1 V5 M7,1 V5" fill="none" stroke-width="1.6"/>`,
 acorn:`<ellipse cx="0" cy="3" rx="8" ry="10" fill="#c99a5b"/><path d="M-10,-1 Q-10,-11 0,-11 Q10,-11 10,-1 Q0,2 -10,-1Z" fill="#7a5235"/><path d="M0,-11 q1,-4 3,-5" fill="none" stroke-width="1.8"/>`});
const TYPES1=LEVELS[1].types,TYPES2=LEVELS[2].types;
const TYPES3=(()=>{const g=id=>[...TYPES1,...TYPES2].find(t=>t.id===id);
 return [{...g('letter'),regions:['inn','station','lake','slope']},{...g('egg'),name:'溫泉蛋',short:'溫泉蛋',regions:['onsen','onsen','inn','station']},{...g('cat'),regions:['inn','station','slope','onsen']},{...g('key'),regions:['inn','station','lake','slope']},
 {id:'scarf',name:'紅圍巾',short:'圍巾',r:15,rot:25,regions:['station','inn','slope','lake']},
 {id:'mitten',name:'愛心毛線手套',short:'手套',r:14,rot:30,regions:['slope','lake','station','inn']},
 {id:'cocoa',name:'熱可可',short:'熱可可',r:14,rot:8,regions:['station','inn','onsen','station']},
 {id:'tub',name:'溫泉木桶',short:'木桶',r:14,rot:8,regions:['onsen','onsen','inn','station']},
 {id:'skis',name:'紅色滑雪板',short:'滑雪板',r:16,rot:40,regions:['slope','slope','station','lake']},
 {id:'pinecone',name:'松果',short:'松果',r:13,rot:30,regions:['slope','slope','inn','lake']},
 {id:'beanie',name:'橘色毛線帽',short:'毛線帽',r:15,rot:20,regions:['slope','station','lake','inn']},
 {id:'snowman',name:'戴帽小雪人',short:'小雪人',r:15,rot:6,regions:['slope','lake','station','slope']}]})();
/* 第 3 關版面：以原本座標設計，再用 zx/zy 放大 1.25 倍（人物、房子等大小不變） */
const Z3=1.5625,zx=x=>Math.round((500+(x-500)*Z3)*10)/10,zy=y=>Math.round(y*Z3*10)/10,zp=d=>d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g,(m,a,b)=>zx(+a)+','+zy(+b));
const POOLS3=[[1180,975,105,46],[1430,945,115,50],[1310,1150,125,48]].map(([x,y,a,b])=>[zx(x),zy(y),a*Z3,b*Z3]);
const LAKE3={cx:zx(790),cy:zy(1490),rx:250*Z3,ry:140*Z3};
const HOLES=[[640,1420],[760,1390],[880,1410],[980,1470],[600,1530],[720,1520],[840,1560],[950,1580],[700,1600],[800,1460],[660,1470],[900,1520]].map(([x,y])=>[zx(x),zy(y)]);
function isWater3(x,y){for(const[cx,cy,rx,ry] of POOLS3)if(((x-cx)/rx)**2+((y-cy)/ry)**2<1)return true;for(const[cx,cy] of HOLES)if(((x-cx)/26)**2+((y-cy)/11)**2<1)return true;return false}
/* 區域 */
Object.assign(REG,{slope:{x:562.5,y:735.0,w:1625.0,h:475.0},inn:{x:547.5,y:1297.5,w:775.0,h:775.0},onsen:{x:1360.0,y:1297.5,w:843.8,h:650.0},lake:{x:550.0,y:2050.0,w:862.5,h:600.0},station:{x:1393.8,y:1987.5,w:793.8,h:668.8},all3:{x:537.5,y:750.0,w:1662.5,h:1900.0}});
function lodge(w,h,o={}){const wall=o.wall||pk(['#b98a5a','#c99a6a','#efe4cc','#e6d3b0']),roof=o.roof||pk(['#7f5a40','#a85640','#6a7488','#5d6640']),sd=f(w*.28),sy=f(w*.14),rh=f(w*.42),hw=w/2;
 let g=`<path d="M${-hw-4},1 L${hw+sd+6},${-sy+1} L${hw+sd+16},6 L${-hw+8},10Z" fill="#9fb1b8" opacity=".35" stroke="none"/>`;
 g+=`<path d="M${hw},0 L${hw+sd},${-sy} L${hw+sd},${-h-sy} L${hw},${-h}Z" fill="${shade(wall,-.22)}"/>`;
 g+=`<path d="M0,${-h-rh} L${sd},${-h-rh-sy} L${hw+sd+8},${-h-sy} L${hw+8},${-h}Z" fill="${shade(roof,-.15)}"/><path d="M0,${-h-rh} L${sd},${-h-rh-sy} L${hw+sd+8},${-h-sy-6} L${hw+8},${-h-6}Z" fill="${SNOW}"/>`;
 g+=`<rect x="${-hw}" y="${-h}" width="${w}" height="${h}" fill="${wall}"/><path d="M${-hw},${-h} L0,${-h-rh} L${hw},${-h}Z" fill="${wall}"/>`;
 if(wall==='#efe4cc'||wall==='#e6d3b0')g+=`<path d="M${-hw},${f(-h*.55)} H${hw} M${-hw+4},${-h} V0 M${hw-4},${-h} V0 M${-hw/2},${-h} L0,${-h-rh+8} L${hw/2},${-h}" fill="none" stroke="#6b4a2b" stroke-width="3"/>`;
 else g+=`<path d="${[...Array(Math.floor(h/9))].map((_,i)=>`M${-hw},${-h+9+i*9} H${hw}`).join(' ')}" fill="none" stroke="${shade(wall,-.3)}" stroke-width="1"/>`;
 g+=`<path d="M${-hw-9},${-h+1} L0,${-h-rh-1} L${hw+9},${-h+1}" fill="none" stroke="${OL}" stroke-width="8"/><path d="M${-hw-9},${-h+1} L0,${-h-rh-1} L${hw+9},${-h+1}" fill="none" stroke="${roof}" stroke-width="4.6"/>`;
 g+=`<path d="M${-hw-8},${-h-3} L0,${-h-rh-5} L${hw+8},${-h-3}" fill="none" stroke="${OL}" stroke-width="7"/><path d="M${-hw-8},${-h-3} L0,${-h-rh-5} L${hw+8},${-h-3}" fill="none" stroke="${SNOW}" stroke-width="4"/>`;
 let ic='';for(let k=0;k<6;k++){const t=(k+.5)/6,x=hw+8+t*sd,y=-h-t*sy;ic+=`M${f(x-2)},${f(y)} L${f(x)},${f(y+5+(k%2)*4)} L${f(x+2)},${f(y)}Z `}g+=`<path d="${ic}" fill="#e6f2f5" stroke-width="1"/>`;
 g+=`<circle cx="0" cy="${f(-h-rh*.42)}" r="5" fill="#f6d27a"/>`;
 const dw=Math.min(22,w*.2);
 g+=`<rect x="${-dw/2}" y="${-30}" width="${dw}" height="30" fill="#5a3a26"/>`;
 if(o.noren!==false&&(o.noren||r()<.55)){const nc=pk(['#4a5a78','#6a7488','#a85640']);g+=`<path d="M${-dw/2-3},-31 H${dw/2+3} V-16 H${dw/2-4} V-21 H${-dw/2+4} V-16 H${-dw/2-3}Z" fill="${nc}"/><path d="M0,-31 V-21" fill="none" stroke="#fbf6ea" stroke-width="1.2"/><g transform="translate(0,-25) scale(.62)" stroke="#fbf6ea"><path d="M-7,2 Q-7,7 0,7 Q7,7 7,2" fill="none" stroke-width="2"/><path d="M-3.5,3 q-2,-2 0,-4 q2,-2 0,-4 M0,3 q-2,-2 0,-4 q2,-2 0,-4.5 M3.5,3 q-2,-2 0,-4 q2,-2 0,-4" fill="none" stroke-width="1.7"/></g>`}
 [[-hw+10],[hw-10-16]].forEach(([x])=>{if(w>90)g+=`<rect x="${f(x)}" y="${f(-h+10)}" width="16" height="14" fill="#f6d27a"/><path d="M${f(x+8)},${f(-h+10)} v14 M${f(x)},${f(-h+17)} h16" fill="none" stroke-width="1.2"/>`});
 g+=`<path d="M${f(-hw+8)},${f(-h+4)} v6" fill="none" stroke-width="1"/><ellipse cx="${f(-hw+8)}" cy="${f(-h+16)}" rx="5" ry="6.5" fill="#d8413a"/><path d="M${f(-hw+3)},${f(-h+16)} h10" fill="none" stroke-width="1"/>`;
 g+=`<path d="M${-hw-6},2 Q${f(-hw/2)},-7 0,0 Q${f(hw/2)},-6 ${hw+sd},${-sy+2} L${hw+sd+4},2Z" fill="${SNOW}"/>`;
 return g}
function cableStation(){let g=`<path d="M-104,2 L124,-20 L134,10 L-90,14Z" fill="#9fb1b8" opacity=".3" stroke="none"/>`;
 g+=`<path d="M90,0 L118,-16 L118,-92 L90,-76Z" fill="#a9a196"/><rect x="-90" y="-76" width="180" height="76" fill="#ddd5c6"/>`;
 g+=`<path d="M-42,0 V-50 H42 V0Z" fill="#3d3833"/><g transform="translate(0,-48)"><path d="M0,0 V10" fill="none" stroke="#9aa0a4" stroke-width="2"/><path d="M-14,10 H14 L16,30 Q0,34 -16,30Z" fill="#c4473c"/><rect x="-11" y="13" width="9" height="8" fill="#d6ecf0"/><rect x="2" y="13" width="9" height="8" fill="#d6ecf0"/></g>`;
 g+=[-78,-62,54,70].map(x=>`<rect x="${x}" y="-60" width="12" height="16" fill="#cfe4ea"/>`).join('');
 g+=`<path d="M-98,-76 L98,-76 L126,-92 L-70,-92Z" fill="#6a7488"/><path d="M-98,-80 L96,-80 L124,-96 L-70,-96Z" fill="${SNOW}"/>`;
 g+=`<path d="M12,-90 L18,-128 L42,-128 L48,-90" fill="#8a8f94"/><ellipse cx="30" cy="-132" rx="24" ry="7" fill="#c4473c"/><ellipse cx="30" cy="-132" rx="8" ry="2.4" fill="#3d3833"/>`;
 g+=`<rect x="-34" y="-72" width="68" height="17" rx="3" fill="#fbf6ea"/>${H.signIcon('cable',1.2,0,-63.5)}`;
 return g}
/* 岸上的雪猴有尾巴（泡在水裡的看不到尾巴） */
const monkey=()=>limb('M-6,-4 Q-17,-3 -18,-11 Q-18,-16 -14,-17','#a8937a',2.8)+`<ellipse cx="0" cy="-9" rx="10" ry="9" fill="#b9a48a"/><circle cx="0" cy="-22" r="8" fill="#b9a48a"/><ellipse cx="0" cy="-21" rx="5.5" ry="5" fill="#e8a0a0"/><g fill="${OL}" stroke="none"><circle cx="-2" cy="-22.5" r="1"/><circle cx="2" cy="-22.5" r="1"/></g><path d="M-1.5,-18.5 q1.5,1 3,0" fill="none" stroke-width="1"/>`;
const monkeyW=()=>`<circle cx="0" cy="-8" r="8" fill="#b9a48a"/><ellipse cx="0" cy="-7" rx="5.5" ry="5" fill="#e8a0a0"/><g fill="${OL}" stroke="none"><circle cx="-2" cy="-8.5" r="1"/><circle cx="2" cy="-8.5" r="1"/></g><path d="M-12,-1 Q0,4 12,-1 L12,3 L-12,3Z" fill="#9fd3cf" stroke="none"/><ellipse cx="0" cy="0" rx="13" ry="3.5" fill="none" stroke="#e6f4f2" stroke-width="1.6"/>`;
const waterLine=(w=13)=>`<path d="M-${w},-1 Q0,4 ${w},-1 L${w},3 L-${w},3Z" fill="#9fd3cf" stroke="none"/><ellipse cx="0" cy="0" rx="${w+1}" ry="3.5" fill="none" stroke="#e6f4f2" stroke-width="1.6"/>`;
const capyHead=()=>`<path d="M-14,2 Q-17,-11 -9,-16 Q3,-21 13,-15 Q19,-11 18,-3 Q17,2 10,2Z" fill="#a9784f"/><ellipse cx="-8" cy="-16" rx="3.2" ry="2.4" fill="#7f5638"/><path d="M0,-11 q2.4,-2 4.8,0" fill="none" stroke-width="1.5"/><ellipse cx="15.5" cy="-9" rx="1.2" ry=".9" fill="${OL}" stroke="none"/><path d="M12,-3 q2.5,1.2 5,0" fill="none" stroke-width="1.1"/><ellipse cx="-2" cy="-6" rx="3" ry="1.8" fill="#e8a0a0" opacity=".5" stroke="none"/>`;
const yuzu=(x,y)=>`<circle cx="${x}" cy="${y}" r="4.6" fill="#f2b632" stroke-width="1.4"/><path d="M${x},${y-4.6} l1.6,-2.4" fill="none" stroke="#6f9a4a" stroke-width="1.6"/>`;
/* 原創水豚（泡湯／在池邊），不是任何角色 */
const capyW=()=>T(0,0,1.25,capyHead()+(r()<.6?yuzu(-1,-21):`<path d="M-7,-20 h12 l-1,3 h-10Z" fill="#fbf6ea" stroke-width="1"/>`))+waterLine(19);
const capyR=()=>`<ellipse cx="2" cy="1" rx="24" ry="4" fill="#9fb1b8" opacity=".35" stroke="none"/><path d="M-14,0 v-5 M-6,0 v-5 M8,0 v-5 M15,0 v-5" fill="none" stroke-width="2.8"/><path d="M-24,-4 Q-26,-24 -6,-26 Q6,-27 12,-22 L12,-8 Q12,-4 8,-4Z" fill="#a9784f"/>`+T(12,-10,1.05,capyHead())+(r()<.4?yuzu(10,-32):'');
const monkeyFam=()=>T(-11,0,1,monkey())+T(11,0,1,monkey(),true)+T(0,2,.58,monkey())+wrapAn('float',heart(0,-38,'#e8a0a0'),true);
const monkeyFamW=()=>T(-12,0,1,monkeyW())+T(12,0,1,monkeyW(),true)+T(0,1,.6,monkeyW());
const bather=()=>`<g transform="translate(0,4)">${peekHead(0,-6,.55,false)}</g><path d="M-6,-21 h12 l-1,4 h-10Z" fill="#fbf6ea" stroke-width="1"/><path d="M-14,0 Q0,5 14,0 L14,5 L-14,5Z" fill="#9fd3cf" stroke="none"/><ellipse cx="0" cy="0" rx="15" ry="4" fill="none" stroke="#e6f4f2" stroke-width="1.6"/>`;
const woodpile=()=>`<rect x="-22" y="-20" width="44" height="20" fill="#a8703f"/>`+[[-15,-5],[-5,-5],[5,-5],[15,-5],[-10,-14],[0,-14],[10,-14]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#d6a868" stroke-width="1.4"/><circle cx="${x}" cy="${y}" r="1.6" fill="none" stroke-width="1"/>`).join('')+`<path d="M-24,-18 Q-10,-28 2,-21 Q14,-28 24,-18 Q10,-16 -24,-18Z" fill="${SNOW}"/>`;
const toro=()=>`<rect x="-9" y="-8" width="18" height="8" fill="#b0a996"/><rect x="-3" y="-24" width="6" height="16" fill="#b0a996"/><rect x="-10" y="-36" width="20" height="12" fill="#c6bfae"/><rect x="-5" y="-33" width="10" height="7" fill="#f6d27a"/><path d="M-15,-36 L0,-46 L15,-36Z" fill="#9d9684"/><path d="M-13,-38 Q0,-50 13,-38 Q0,-41 -13,-38Z" fill="${SNOW}"/><circle cy="-48" r="2.4" fill="#9d9684"/>`;
const tubStack=()=>T(-11,-11,.9,tubShape(false))+T(11,-11,.9,tubShape(false))+T(0,-26,.9,tubShape(false));
const bfence=()=>`<path d="M-27,-28 H27 M-27,-14 H27" fill="none" stroke="#7a8a46" stroke-width="3"/>`+[-24,-12,0,12,24].map(x=>`<rect x="${x-3}" y="-40" width="6" height="40" rx="2" fill="#b5bd7a"/><path d="M${x-3},-26 h6" fill="none" stroke-width="1"/><ellipse cx="${x}" cy="-40" rx="4" ry="2.4" fill="${SNOW}" stroke-width="1.2"/>`).join('');
const rockS=()=>rock()+`<path d="M-13,-11 Q-2,-21 11,-13 Q2,-11 -13,-11Z" fill="${SNOW}"/>`;
const snowMound=()=>`<path d="M-18,0 Q-14,-10 -4,-9 Q2,-15 10,-9 Q18,-8 18,0Z" fill="${SNOW}" stroke-width="1.6"/>`;
function snowmanBig(){const sc=pk(['#c4473c','#5a86b0','#e0b44a','#6f9a4a']);return `<ellipse cx="0" cy="0" rx="20" ry="5" fill="#c9d6dc" stroke="none" opacity=".6"/><circle cy="-15" r="16" fill="#fbf7ef"/><circle cy="-40" r="11" fill="#fbf7ef"/><path d="M-10,-31 Q0,-26 10,-31 L10,-27 Q0,-22 -10,-27Z" fill="${sc}"/><path d="M4,-28 L8,-14 L3,-14Z" fill="${sc}"/>`+(r()<.5?`<path d="M-10,-47 Q0,-62 10,-47Z" fill="${sc}"/><circle cy="-58" r="3" fill="#fbf6ea"/>`:`<path d="M-14,-24 l-14,-12 M14,-24 l13,-10" fill="none" stroke="#7a5235" stroke-width="2.2"/>`)+`<path d="M0,-40 l9,2 l-9,2Z" fill="#e07a32" stroke-width="1.2"/><g fill="${OL}" stroke="none"><circle cx="-4" cy="-43" r="1.4"/><circle cx="3" cy="-43" r="1.4"/><circle cy="-18" r="1.6"/><circle cy="-10" r="1.6"/></g>`}
const skiBoard=c=>`<path d="M-18,1 L16,1 Q22,1 22,-4" fill="none" stroke="${OL}" stroke-width="5"/><path d="M-18,1 L16,1 Q22,1 22,-4" fill="none" stroke="${c}" stroke-width="2.6"/>`;
const sledBig=()=>T(0,-6,1.6,DECOY.sled);
const BOARDC=['#c4473c','#2b2420','#5a86b0','#e0b44a','#6f9a4a','#9a6fa8','#d98c46'];
const snowboard=(c,st)=>`<rect x="-23" y="-2" width="46" height="7" rx="3.5" fill="${c}"/><path d="M-19,1.5 H19" fill="none" stroke="${st}" stroke-width="1.6"/><rect x="-14" y="-4" width="7" height="5" rx="1.5" fill="#3d3833" stroke-width="1"/><rect x="6" y="-4" width="7" height="5" rx="1.5" fill="#3d3833" stroke-width="1"/>`;
/* 單板：一般是壓雪轉彎濺起雪花，約三成在跳台騰空 */
function boarder(down){const c=pk(BOARDC),st=pk(['#fbf6ea','#f5c842','#6fd0c0']),air=r()<.3,dir=r()<.5?1:-1;
 const gog=r()<.65?`<path d="M-15,-35 Q-6,-38 3,-34" fill="none" stroke="${OL}" stroke-width="2.4"/><rect x="2" y="-37" width="14" height="8" rx="4" fill="${pk(['#f5c842','#6fd0c0','#e86a6a','#9fb7e8'])}" stroke-width="1.5"/><path d="M5,-35 h4" fill="none" stroke="#fff" stroke-width="1.2"/>`:'';
 const rider=act(1,-2,1,{pose:pk(['reach','up','run','up2']),legs:'walk',hat:pk([0,0,4,-1,0]),extra:gog});
 if(air){const body=`<g transform="translate(0,-26) rotate(${down?pk([14,20]):pk([-22,-14,16])})">`+snowboard(c,st)+rider+`</g>`;
  return `<ellipse cx="0" cy="0" rx="20" ry="4" fill="#c9d6dc" stroke="none" opacity=".7"/><path d="M-30,-6 q-6,-8 -2,-16 M-36,-2 q-8,-10 -4,-20" fill="none" stroke="#b7c5cc" stroke-width="1.8"/>`+wrapAn('float',body,true)}
 const spray=`<g fill="${SNOW}" stroke-width="1.3"><circle cx="-27" cy="-3" r="5.5"/><circle cx="-35" cy="-9" r="4.5"/><circle cx="-40" cy="-1" r="3.6"/><circle cx="-31" cy="-15" r="3"/></g><path d="M-48,4 q14,-4 26,0" fill="none" stroke="#b7c5cc" stroke-width="2"/>`;
 return spray+wrapAn('bob',`<g transform="rotate(${down?pk([12,16,20]):pk([-12,-8,8])})">`+snowboard(c,st)+rider+`</g>`,true)}
function iceFisher(){return act(0,-4,1,{pose:'sit',hat:0,extra:`<path d="M6,-20 L30,-38" fill="none" stroke="#7a5235" stroke-width="2"/><path d="M30,-38 L36,4" fill="none" stroke-width=".9"/>`},'bob')+`<rect x="-9" y="-5" width="16" height="5" rx="1.5" fill="#a8703f"/><path d="M-6,0 v4 M4,0 v4" fill="none" stroke-width="1.6"/>`}
function liftSVG(dx,dy){let g=`<path d="M0,-58 L${dx},${dy-58}" fill="none" stroke-width="1.6"/>`;
 [0,.5,1].forEach(t=>{const x=f(dx*t),y=f(dy*t);g+=`<path d="M${x},${y} V${f(y-58)} M${f(x-8)},${f(y-58)} H${f(+x+8)}" fill="none" stroke="#6a7488" stroke-width="4"/>`});
 [.18,.36,.66,.84].forEach(t=>{const x=dx*t,y=dy*t-58;g+=`<g transform="translate(${f(x)},${f(y)})"><path d="M0,0 V16" fill="none" stroke-width="1.4"/><path d="M-9,26 H9 M-9,16 V26" fill="none" stroke="#5a5f64" stroke-width="2.4"/>`+(r()<.7?`<g transform="translate(0,26) scale(.55)">${kid({pose:'sit',hat:0})}</g>`:'')+`</g>`});
 return g}
 // 山腳到山頂的纜車（遠景，所以畫得小；車廂沿纜繩上下移動）
function liftUp(x0,y0,x1,y1){const dx=x1-x0,dy=y1-y0;let g=`<g stroke-width="1.6">`;
  g+=`<path d="M${x0},${y0-22} L${x1},${y1-22} M${x0+9},${y0-20} L${x1+9},${y1-20}" fill="none" stroke-width="1.3"/>`;
  [.3,.62].forEach(t=>{const x=f(x0+dx*t),y=f(y0+dy*t);g+=`<path d="M${x},${f(+y-21)} V${f(+y+6)} M${f(x-6)},${f(+y-21)} H${f(+x+15)}" fill="none" stroke="#6a7488" stroke-width="3"/>`});
  const hut=(x,y,c)=>`<g transform="translate(${x},${y})"><rect x="-16" y="-20" width="32" height="20" fill="#ddd5c6"/><path d="M-19,-20 L19,-20 L14,-29 L-14,-29Z" fill="${c}"/><path d="M-19,-21 L19,-21 L15,-28 L-15,-28Z" fill="${SNOW}"/><rect x="-6" y="-13" width="12" height="13" fill="#3d3833"/><ellipse cx="4" cy="-31" rx="8" ry="2.4" fill="#c4473c"/></g>`;
  g+=hut(x0,y0,'#6a7488')+hut(x1,y1+4,'#6a7488');
  const cab=c=>`<g transform="scale(.48)">${cabinSVG(c,r()<.6)}</g>`;
  [0,1,2].forEach(k=>{g+=`<g><animateMotion dur="30s" begin="-${k*10}s" repeatCount="indefinite" path="M0,0 L${f(dx)},${f(dy)}"/><g transform="translate(${x0},${y0-22})">${cab(pk(['#c4473c','#e0b44a','#5a86b0']))}</g></g>`;
   g+=`<g><animateMotion dur="30s" begin="-${k*10+5}s" repeatCount="indefinite" path="M0,0 L${f(-dx)},${f(-dy)}"/><g transform="translate(${x1+9},${y1-20})">${cab(pk(['#c4473c','#e0b44a','#5a86b0']))}</g></g>`});
  return g+`</g>`}
function buildGround3(){const NS_=`stroke="none"`;let s='';
 s+=`<rect x="0" y="-400" width="3000" height="4000" fill="#f7f5ef" ${NS_}/><rect x="0" y="-400" width="3000" height="${zy(480)+410}" fill="#e6eef0" ${NS_}/>`;
 const peak=(x,y,w,h,c)=>`<path d="M${x-w},${y} L${f(x-w*.35)},${f(y-h*.7)} L${x},${y-h} L${f(x+w*.4)},${f(y-h*.62)} L${x+w},${y}Z" fill="${c}"/><path d="M${x},${y-h} L${f(x+w*.4)},${f(y-h*.62)} L${x+w},${y} L${f(x+w*.15)},${y}Z" fill="#b8c7ce" ${NS_} opacity=".75"/><path d="M${f(x-w*.35)},${f(y-h*.7)} L${x},${y-h} L${f(x+w*.4)},${f(y-h*.62)} L${f(x+w*.22)},${f(y-h*.52)} L${f(x+w*.06)},${f(y-h*.64)} L${f(x-w*.12)},${f(y-h*.5)} L${f(x-w*.24)},${f(y-h*.6)}Z" fill="${SNOW}"/>`;
 [[300,440,260,300],[1000,440,300,370],[1700,440,280,320]].forEach(([x,y,w,h])=>s+=`<g opacity=".55">${peak(zx(x),zy(y),w*Z3,h*Z3,'#d3dde1')}</g>`);
 [[620,450,300,390],[1330,450,320,430],[1950,450,260,330],[60,450,240,300]].forEach(([x,y,w,h])=>s+=peak(zx(x),zy(y),w*Z3,h*Z3,'#dfe7ea'));
 [[700,120,1],[1200,70,.8],[1550,160,1],[900,240,.7],[420,190,.8],[1750,90,.8]].forEach(([x,y,k])=>s+=T(zx(x),zy(y),k,swirl()));
 s+=`<path d="${zp('M0,480 Q300,438 600,462 Q900,432 1200,458 Q1500,436 1800,460 Q2000,448 2200,462')} V3600 H0Z" fill="#f7f5ef"/>`;
 // groomed slope + ski tracks
 s+=`<path d="${zp('M520,476 Q800,452 1100,470 Q1400,452 1590,474 L1600,770 Q1100,790 520,770Z')}" fill="#fbfaf6" ${NS_}/>`;
 let tr='';for(let i=0;i<12;i++){const x=sr(zx(560),zx(1540));tr+=`M${f(x)},${zy(480)} C${f(x+sr(-100,100))},${zy(560)} ${f(x+sr(-110,110))},${zy(650)} ${f(x+sr(-75,75))},${zy(760)} `}s+=`<path d="${tr}" fill="none" stroke="#d3dde2" stroke-width="2.2" stroke-dasharray="14 6"/>`;
 let dr='';for(let i=0;i<170;i++){const x=sr(380,zx(1600)+40),y=sr(zy(500),zy(1770));dr+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sr(30,80))}" ry="${f(sr(8,16))}" fill="#e8eef0" ${NS_}/>`}s+=dr;
 const pth0=(d,w,c='#e6dcc8')=>`<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w+5}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`;;const pth=(d,w,c)=>{ROADS.push([d,w]);return pth0(d,w,c)};
 s+=pth(zp('M300,800 C600,780 900,812 1020,800 S1400,788 1800,806'),44)+pth(zp('M1020,800 C1032,950 1004,1100 1026,1270 S1062,1500 1040,1820'),40)+pth(zp('M770,800 C750,700 790,620 770,470'),20,'#efe8da')+pth(zp('M520,1185 C700,1175 860,1192 1010,1182'),26)+pth(zp('M1026,1300 C1100,1320 1200,1380 1300,1420'),26);
 // station plaza
 s+=`<ellipse cx="${zx(1350)}" cy="${zy(1520)}" rx="${240*Z3}" ry="${160*Z3}" fill="url(#cob)" stroke-width="1.8"/>`;
 // onsen deck + pools
 s+=`<rect x="${zx(1062)}" y="${zy(866)}" width="${516*Z3}" height="${358*Z3}" rx="22" fill="url(#plank)" stroke-width="2.2"/>`;
 POOLS3.forEach(([cx,cy,rx,ry])=>{let rk='';for(let k=0;k<18;k++){const a=k/18*Math.PI*2;rk+=`<ellipse cx="${f(cx+Math.cos(a)*(rx+10))}" cy="${f(cy+Math.sin(a)*(ry+7))}" rx="${f(sr(9,14))}" ry="${f(sr(6,9))}" fill="${pk(['#b0a996','#9d9684','#c6bfae'])}" stroke-width="1.6"/>`}
  s+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx+12}" ry="${ry+9}" fill="#9d9684"/>`+rk+`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#9fd3cf" stroke-width="2.2"/><ellipse cx="${f(cx-rx*.2)}" cy="${f(cy-ry*.2)}" rx="${f(rx*.6)}" ry="${f(ry*.45)}" fill="#bfe3df" ${NS_}/><path d="M${cx-40},${cy+8} q8,-4 16,0 q8,4 16,0 M${cx+10},${cy-10} q8,-4 16,0 q8,4 16,0" fill="none" stroke="#e6f4f2" stroke-width="1.6"/>`;
  for(let k=0;k<6;k++){const a=sr(0,Math.PI*2);s+=`<path d="M${f(cx+Math.cos(a)*(rx+12)-8)},${f(cy+Math.sin(a)*(ry+9)-6)} q8,-6 16,0" fill="none" stroke="${SNOW}" stroke-width="4"/>`}});
 // frozen lake
 const L=LAKE3;s+=`<ellipse cx="${L.cx}" cy="${L.cy}" rx="${L.rx+20}" ry="${L.ry+14}" fill="#eef3f3" stroke-width="1.6"/><ellipse cx="${L.cx}" cy="${L.cy}" rx="${L.rx}" ry="${L.ry}" fill="#cfe3e8" stroke-width="2.4"/><ellipse cx="${L.cx-50}" cy="${L.cy-38}" rx="${f(L.rx*.65)}" ry="${f(L.ry*.5)}" fill="#e0eef1" ${NS_}/>`;
 s+=`<path d="M${zx(620)},${zy(1450)} l40,20 l20,-14 l34,22 M${zx(860)},${zy(1500)} l30,-20 l26,16 M${zx(700)},${zy(1560)} l26,10 l14,-18 M${zx(940)},${zy(1430)} l-24,16 l18,12" fill="none" stroke="#9fbcc6" stroke-width="1.4"/>`;
 let sk='';for(let i=0;i<8;i++){const cx=L.cx+sr(-150,150),cy=L.cy+sr(-60,60),rx=sr(50,120),ry=sr(18,44);sk+=`M${f(cx-rx)},${f(cy)} a${f(rx)},${f(ry)} 0 1 1 ${f(rx*1.6)},${f(ry*.8)} `}s+=`<path d="${sk}" fill="none" stroke="#f6fbfc" stroke-width="1.6"/>`;
 HOLES.forEach(([x,y])=>s+=`<ellipse cx="${x}" cy="${y}" rx="30" ry="13" fill="#f4f8f8" stroke-width="1.4"/><ellipse cx="${x}" cy="${y}" rx="26" ry="11" fill="#4f7f90" stroke-width="2"/><ellipse cx="${x-4}" cy="${y+2}" rx="16" ry="5" fill="#6f9fae" ${NS_}/>`);
 // cable (station wheel -> down the mountain)
 // little tufts / snow bumps
 const DX0=zx(1062),DY0=zy(866),DX1=DX0+516*Z3,DY1=DY0+358*Z3;
 let tf='';for(let i=0;i<1200;i++){const x=sr(400,zx(1600)+30),y=sr(zy(500),zy(1770));if(isWater3(x,y)||((x-L.cx)/L.rx)**2+((y-L.cy)/L.ry)**2<1.05||(x>DX0&&x<DX1&&y>DY0&&y<DY1))continue;tf+=r()<.3?`M${f(x)},${f(y)} l-3,-6 M${f(x)},${f(y)} l3,-6 `:`M${f(x-6)},${f(y)} q6,-5 12,0 `}
 s+=`<path d="${tf}" fill="none" stroke="#a9b8bd" stroke-width="1.3"/>`;
 return s}
function buildStructures3(){const A=(x,y,...o)=>add(zx(x),zy(y),...o);
 const sx=zx(1440),sy=zy(1400),cx0=sx+30,cy0=sy-132,onCable=dx=>[cx0+dx,cy0+dx*1.838];
 add(sx,sy,240,150,'house',cableStation(),{sh:.85});
 /* 纜車類（繩索、車廂、支柱）一律畫在人物上面：用排序值把它們放到最後 */
 const onTop=(sp,y=1e6)=>{sp.y=y;return sp};
 onTop(add(cx0,cy0,10,10,'lift',`<path d="M0,0 L520,956 M12,-2 L532,954" fill="none" stroke-width="2"/>`,{mark:false}));
 [[750.0,722.5,702.5,140.0],[1712.5,707.5,1790.0,80.0]].forEach(([a,b,c,d])=>onTop(add(a,b,30,30,'lift',`<g transform="translate(${-a},${-b})">${liftUp(a,b,c,d)}</g>`,{mark:false})));

 // lodges: same size, the longer street fits more of them
 for(const [yy,x0] of [[zy(935),zx(545)],[zy(1125),zx(560)]]){let x=x0;while(x<zx(990)){const w=sr(95,125);if(x+w>zx(1000))break;add(x+w/2,yy,w+16,w*1.3,'house',lodge(w,sr(48,60)),{sh:.9});x+=w+sr(26,48)}}
 [[600,950],[880,948],[720,1140],[950,1140]].forEach(([x,y])=>add(zx(x),zy(y)-110,30,30,'steam',steamPuff(),{mark:false}));
 // onsen
 for(let x=zx(1092);x<zx(1560);x+=54)add(x,zy(862),54,42,'bfence',bfence());
 A(1508,1222,110,110,'house',lodge(84,46,{noren:true,wall:'#efe4cc',roof:'#6a7488'}),{sh:.9});
 A(1080,880,30,50,'toro',toro());A(1568,1060,30,50,'toro',toro());
 POOLS3.forEach(([cx,cy,rx,ry],i)=>{const n=i===2?3:2;for(let k=0;k<n;k++){for(let t=0;t<40;t++){const x=cx+sr(-rx*.6,rx*.6),y=cy+sr(-ry*.3,ry*.5);if(canPlace(x,y,30,24,true,.6)){add(x,y,30,24,'bather',bather(),{fl:r()<.5});break}}}
  for(let k=0;k<4;k++)add(cx+sr(-rx*.7,rx*.7),cy+sr(-ry*.6,0),40,30,'steam',steamPuff(),{mark:false,s:sr(1,1.6)});});
 add(POOLS3[1][0]+20,POOLS3[1][1]+13,28,20,'monkeyW',monkeyW(),{mark:false});
 // 溫泉的猴子、猴子家庭、水豚
 const inPool=(kind,fn,w,h,n)=>{for(let k=0;k<n;k++)for(let t=0;t<80;t++){const P=pk(POOLS3),x=P[0]+sr(-P[2]*.65,P[2]*.65),y=P[1]+sr(-P[3]*.35,P[3]*.55);if(canPlace(x,y,w,h,true,.6)){add(x,y,w,h,kind,fn(),{fl:r()<.5});break}}};
 const onDeck=(kind,fn,w,h,n)=>{for(let k=0;k<n;k++)for(let t=0;t<300;t++){const x=sr(zx(1070),zx(1570)),y=sr(zy(880),zy(1222));if(canPlace(x,y,w,h,false,.6)){add(x,y,w,h,kind,fn(),{fl:r()<.5});break}}};
 inPool('capyW',capyW,40,26,4);inPool('monkeyW',monkeyW,28,20,3);inPool('monkeyFamW',monkeyFamW,46,22,2);
 onDeck('monkeyFam',monkeyFam,50,40,3);onDeck('capyR',capyR,46,30,3);onDeck('monkeyR',monkey,24,30,3);
 A(1250,1100,24,30,'monkeyR',monkey());A(1092,1190,24,30,'monkeyR',monkey(),{fl:true});
 A(1046,842,50,50,'sign',signpost('溫泉'));
 // slope: chairlift, pines, snowmen
 onTop(A(600,770,40,70,'lift',liftSVG(360*Z3,-300*Z3),{mark:false}));
 {const[a,b]=onCable(110);onTop(add(a,b,50,50,'cabin',cabinSVG('#c4473c',true),{mark:false}),1e6+1)}
 {const[a,b]=onCable(230);onTop(add(a,b,50,50,'cabin',cabinSVG('#e0b44a',false),{mark:false,s:.9}),1e6+1)}
 [[600,770],[780,620],[960,470]].forEach(([x,y])=>mark(zx(x),zy(y),20,60));
 [[530,520],[555,640],[1570,520],[1560,660],[1500,740],[545,740],[1210,500],[1260,560]].forEach(([x,y])=>A(x,y,50,98,'pineS',pineS()));
 A(1100,640,40,62,'snowmanBig',snowmanBig());A(1380,700,40,62,'snowmanBig',snowmanBig());
 A(800,780,50,50,'sign',signpost('滑雪場'));
 // 雪山山坡上往下滑的單板（帶 S 形滑行雪痕）
 [[620,450,300,390,4],[1330,450,320,430,5]].forEach(([x,y,w,h,n])=>{const px=zx(x),py=zy(y),W=w*Z3,Hh=h*Z3;
  for(let k=0;k<n;k++){const t=.3+.6*(k+r()*.8)/n,yy=py-Hh+Hh*t,half=W*t*.6,xx=px+sr(-half,half);
   add(xx,yy,62,72,'boarder',`<path d="M${f(sr(-20,20))},-92 q36,16 6,36 q-32,16 -6,34" fill="none" stroke="#c9d6dc" stroke-width="3.2"/>`+boarder(true),{mark:false,fl:xx<px,s:.72})}}); /* 在山峰左側就面向左、右側面向右，眼睛朝山下 */
 // lake: ice fishers + tent + skaters
 HOLES.forEach(([x,y],i)=>{if(i%2===0)add(x-36,y+8,30,50,'fisher',iceFisher())});
 A(1010,1385,70,56,'tent',tent('#d98c46'));
 for(let k=0;k<16;k++){const L=LAKE3,a=sr(0,Math.PI*2),q=Math.sqrt(r())*.82,x=L.cx+Math.cos(a)*L.rx*q,y=L.cy+Math.sin(a)*L.ry*q+20,kind=r()<.25?'skatePair':'skate',K=KIND[kind];
  if(canPlace(x,y,K.w,K.h,false,.6))add(x,y,K.w,K.h,kind,K.fn(),{fl:r()<.5,sh:.6})}
 // station
 A(1180,1450,120,90,'stall',stall('cocoa'));A(1250,1640,120,90,'stall',stall('knit'));A(1470,1660,120,90,'stall',stall('cocoa'));
 [[1160,1472],[1205,1474],[1232,1662],[1455,1682]].forEach(([x,y])=>add(zx(x)+(x===1205?-12:0),zy(y)-4,28,58,'walker3',act(0,0,1,{view:'back',pose:pk(['reach','stand']),hat:pk([0,4,-1])},true)));
 A(1110,1320,50,50,'sign',signpost('纜車'));
 A(1560,1500,40,62,'snowmanBig',snowmanBig());
 [[1585,1300],[1590,1430],[520,880],[515,1060],[530,1280],[1060,1660],[520,1680]].forEach(([x,y])=>A(x,y,50,98,'pineS',pineS()));
}
Object.assign(KIND,{
 pineS:{w:50,h:98,fn:pineS},rockS:{w:34,h:22,fn:rockS},snowMound:{w:36,h:14,fn:snowMound},woodpile:{w:46,h:28,fn:woodpile},toro:{w:30,h:50,fn:toro},
 tubStack:{w:44,h:40,fn:tubStack},bfence:{w:58,h:42,fn:bfence},snowmanBig:{w:40,h:62,fn:snowmanBig},
 monkeyR:{w:24,h:30,fn:monkey},monkeyW:{w:28,h:20,fn:monkeyW,water:true},bather:{w:30,h:24,fn:bather,water:true},
 scarfBlue:{w:28,h:30,fn:()=>T(0,-14,.95,DECOY.scarfBlue)},mittenPlain:{w:26,h:28,fn:()=>T(0,-13,.95,DECOY.mittenPlain)},mittenGreen:{w:26,h:28,fn:()=>T(0,-13,.95,DECOY.mittenGreen)},
 coffee:{w:28,h:24,fn:()=>T(0,-12,.95,DECOY.coffee)},tubPlain:{w:26,h:22,fn:()=>T(0,-11,.95,DECOY.tubPlain)},skisBlue:{w:22,h:34,fn:()=>T(0,-16,.95,DECOY.skisBlue)},
 beanieTeal:{w:30,h:26,fn:()=>T(0,-11,.95,DECOY.beanieTeal)},beanieRed:{w:30,h:26,fn:()=>T(0,-11,.95,DECOY.beanieRed)},snowmanPlain:{w:30,h:32,fn:()=>T(0,-15,.95,DECOY.snowmanPlain)},
 sled:{w:38,h:14,fn:()=>T(0,-5,1,DECOY.sled)},acorn:{w:20,h:24,fn:()=>T(0,-11,.9,DECOY.acorn)},
 walker3:{w:30,h:62,fn:()=>{const v=pickView(),p=walkPose(v);return act(0,0,r()<.5?1:-1,{view:v,pose:p,hat:pk([0,0,0,3,4,-1])},'step')}},
 boarder:{w:62,h:72,fn:boarder},
 skier:{w:50,h:62,fn:()=>`<path d="M-32,-4 h-12 M-30,-14 h-9" fill="none" stroke="#b7c5cc" stroke-width="2"/>`+act(0,0,1,{pose:'run',hat:0,extra:skiBoard(pk(['#5a86b0','#e0b44a','#6f9a4a','#9a6fa8']))},false)},
 sledKid:{w:56,h:52,fn:()=>`<path d="M-36,-4 h-12 M-34,-12 h-8" fill="none" stroke="#b7c5cc" stroke-width="2"/>`+sledBig()+act(-2,-10,1,{pose:'sit',hat:0,mood:1,s:.9},false)},
 buildSnowman:{w:96,h:62,fn:()=>act(-30,0,1,{pose:'low',hat:0},'work')+`<circle cx="-6" cy="-9" r="10" fill="#fbf7ef"/>`+act(32,0,-1,{pose:'reach',hat:pk([0,4])},'work')+`<circle cx="14" cy="-7" r="7" fill="#fbf7ef"/>`},
 snowballFight:{w:130,h:70,fn:()=>`<path d="M-62,0 Q-62,-14 -48,-14 Q-34,-14 -34,0Z" fill="${SNOW}"/>`+act(-40,0,1,{pose:'up',hat:0},'hop')+act(44,0,-1,{pose:'reach',hat:0,mood:1},'hop')+`<path d="M-30,-42 Q4,-80 30,-34" fill="none" stroke-dasharray="3 4" stroke-width="1.2"/>`+wrapAn('float',`<circle cx="6" cy="-62" r="5" fill="#fbf7ef"/>`,true)},
 skate:{w:44,h:60,fn:()=>`<path d="M-30,2 q10,-6 22,0 M-34,8 q12,-5 26,0" fill="none" stroke="#fbf9f3" stroke-width="2"/>`+act(0,0,1,{pose:'run',hat:pk([0,0,4])},'groove')},
 skatePair:{w:66,h:62,fn:()=>`<path d="M-40,4 q16,-8 34,0" fill="none" stroke="#fbf9f3" stroke-width="2"/>`+act(-11,0,1,{view:'back',pose:'walk',hat:0},'groove')+act(11,0,1,{view:'back',pose:'walk',hat:0},'groove')+`<circle cx="0" cy="-8" r="3.2" fill="${pk(SKIN)}" stroke-width="1.4"/>`},
 cocoaChat:{w:84,h:86,fn:()=>act(-16,0,1,{pose:'hold',hat:pk([0,-1]),extra:`<g transform="translate(15,-20) scale(.55)">${mugShape(false)}</g>`},'nod')+act(16,0,-1,{pose:'hold',hat:pk([0,4]),extra:`<g transform="translate(15,-20) scale(.55)">${mugShape(false)}</g>`},'nod')+wrapAn('float',steamPuff().replace('opacity=".8"','opacity=".5" transform="translate(0,-50) scale(.5)"'),true)},
 shovel:{w:70,h:62,fn:()=>act(-10,0,1,{pose:'low',hat:0,extra:`<path d="M11,-12 L24,-2" fill="none" stroke="#7a5235" stroke-width="2.6"/><path d="M21,-5 L31,-1 L27,5 L18,1Z" fill="#9aa0a4"/>`},'work')+`<path d="M22,0 Q30,-12 42,-8 Q50,-6 50,0Z" fill="${SNOW}"/>`}
});
POOL.slope=[['pineS',3.2],['rockS',.8],['snowMound',1.6],['walker3',.9],['snowmanBig',.6],['skisBlue',.15],['sled',.25],['acorn',.3],['beanieTeal',.3],['beanieRed',.2],['snowmanPlain',.5],['mittenGreen',.25],['scarfBlue',.25],['dog',.2]];
POOL.inn=[['walker3',2.6],['snowMound',1],['pineS',.5],['barrel',.8],['crate',.6],['woodpile',.8],['toro',.6],['lamp',.4],['tubPlain',.4],['bucket',.3],['coffee',.35],['scarfBlue',.3],['mittenPlain',.3],['mittenGreen',.2],['beanieRed',.3],['beanieTeal',.2],['acorn',.3],['cat',.5],['dog',.3],['peekBarrel',.3],['peekCrate',.25],['crateStack',.3],['keyGrey',.25],['snowmanPlain',.3]];
POOL.onsen=[['tubStack',.8],['tubPlain',1.2],['toro',.5],['rockS',1],['walker3',.8],['monkeyR',.7],['bucket',.3],['coffee',.4],['scarfBlue',.2],['keyGrey',.2]];
POOL.lake=[['snowMound',.6],['walker3',.5],['acorn',.3],['mittenGreen',.3],['mittenPlain',.25],['beanieTeal',.3],['snowmanPlain',.4],['skisBlue',.3],['sled',.4],['rockS',.4],['pineS',.5],['scarfBlue',.25]];
POOL.decor3=[['walker3',3],['pineS',2.2],['snowMound',1.6],['rockS',.9],['woodpile',.5],['toro',.4],['barrel',.5],['crate',.5],['crateStack',.25],['lamp',.3],['bench',.25],['snowmanBig',.35],['dog',.35],['peekBarrel',.25],['peekCrate',.2]];
POOL.station=[['walker3',3],['crate',.6],['barrel',.6],['crateStack',.3],['lamp',.4],['bench',.3],['peekBarrel',.3],['snowMound',.6],['coffee',.45],['tubPlain',.2],['scarfBlue',.3],['mittenPlain',.3],['beanieRed',.3],['beanieTeal',.2],['skisBlue',.3],['sled',.3],['cat',.4],['dog',.3],['keyGrey',.2],['snowmanPlain',.3],['pineS',.3]];
/* ---- 第 3 關彩蛋：雪堆裡的白鼬（平常只露出頭和黑尾巴尖，點雪堆牠會站起來張望一下） ---- */
let ERM=null;
const ermW='#fbf9f3',ermP='#f0b4a8';
const ermineSVG=()=>{const mound=`<path d="M-28,0 Q-30,-16 -13,-21 Q0,-27 13,-21 Q30,-16 28,0Z" fill="${ermW}"/><path d="M-21,-10 q6,-4 12,-2 M8,-15 q6,-2 10,2" fill="none" stroke="#dfe7ea" stroke-width="2"/>`;
 const down=`<g id="ermDown"><g transform="translate(2,-8)"><ellipse cx="0" cy="-20" rx="9" ry="7.5" fill="${ermW}"/><circle cx="-6" cy="-26" r="3" fill="${ermW}"/><circle cx="6" cy="-26" r="3" fill="${ermW}"/><circle cx="-6" cy="-26" r="1.4" fill="${ermP}" stroke="none"/><circle cx="6" cy="-26" r="1.4" fill="${ermP}" stroke="none"/><circle cx="-3.5" cy="-21" r="1.8" fill="${OL}" stroke="none"/><circle cx="3.5" cy="-21" r="1.8" fill="${OL}" stroke="none"/><ellipse cx="0" cy="-17" rx="1.6" ry="1.2" fill="${OL}" stroke="none"/></g>`+
  `<path d="M-26,-1 Q-14,-8 0,-6 Q14,-8 26,-1" fill="${ermW}" stroke-width="2"/><path d="M14,-10 Q22,-16 26,-24" fill="none" stroke="${OL}" stroke-width="6"/><path d="M14,-10 Q22,-16 24,-20" fill="none" stroke="${ermW}" stroke-width="3.6"/></g>`;
 const up=`<g id="ermUp" style="display:none"><g transform="translate(0,-14)"><path d="M6,-2 Q20,0 24,-10 Q26,-18 22,-22" fill="none" stroke="${OL}" stroke-width="7"/><path d="M6,-2 Q20,0 24,-10 Q26,-18 22,-22" fill="none" stroke="${ermW}" stroke-width="4.4"/><path d="M24,-14 Q26,-18 22,-22" fill="none" stroke="${OL}" stroke-width="5"/>`+
  `<path d="M-8,0 Q-12,-20 -6,-38 Q0,-46 6,-38 Q10,-20 8,0Z" fill="${ermW}"/><path d="M-6,-30 L-10,-22 M6,-30 L10,-22" fill="none" stroke-width="2.4"/>`+
  `<ellipse cx="0" cy="-46" rx="10" ry="8" fill="${ermW}"/><circle cx="-7" cy="-53" r="3.4" fill="${ermW}"/><circle cx="7" cy="-53" r="3.4" fill="${ermW}"/><circle cx="-7" cy="-53" r="1.6" fill="${ermP}" stroke="none"/><circle cx="7" cy="-53" r="1.6" fill="${ermP}" stroke="none"/>`+
  `<circle cx="-4" cy="-47" r="1.9" fill="${OL}" stroke="none"/><circle cx="4" cy="-47" r="1.9" fill="${OL}" stroke="none"/><ellipse cx="0" cy="-42.5" rx="1.8" ry="1.3" fill="${OL}" stroke="none"/><path d="M-6,-42 l-6,-1 M-6,-41 l-6,2 M6,-42 l6,-1 M6,-41 l6,2" fill="none" stroke-width=".8"/></g>`+
  `<path d="M-26,-1 Q-14,-8 0,-6 Q14,-8 26,-1" fill="${ermW}" stroke-width="2"/></g>`;
 return `<ellipse cx="3" cy="2" rx="30" ry="5" fill="#000" opacity=".08" stroke="none"/>`+mound+down+up};
function placeErmine(){ERM=null;/* 只放在雪山腳下樹林旁的雪堆，縮小到 0.68 倍，比較難找 */
 const g=REG.slope,pines=sprites.filter(o=>o.kind==='pineS'&&o.y>g.y-40&&o.y<g.y+g.h+80&&o.x>g.x+110&&o.x<g.x+g.w-110),R_=Math.random;
 for(let t=0;t<600&&!ERM;t++){let x,y;if(pines.length&&t<500){const p=pines[Math.floor(R_()*pines.length)],sd=R_()<.5?-1:1;x=p.x+sd*(26+R_()*22);y=p.y+4+R_()*22}else{x=sr(g.x+60,g.x+g.w-60);y=sr(g.y+60,g.y+g.h-20)}
  if(isWater(x,y)||!canPlace(x,y,44,30,false,.8))continue;add(x,y,64,44,'ermine',ermineSVG(),{sh:.8,s:.68});ERM={x,y}}}
let ermBusy=false;
TAPHOOKS[3]=(x,y)=>{if(!ERM||Math.abs(x-ERM.x)>26||y>ERM.y+8||y<ERM.y-50)return false;if(ermBusy)return true;
 const up=document.getElementById('ermUp'),dn=document.getElementById('ermDown');if(!up||!dn)return false;ermBusy=true;
 dn.style.display='none';up.style.display='';up.classList.remove('cpop');void up.getBBox();up.classList.add('cpop');
 try{tone(880,.06,'triangle',.04);setTimeout(()=>tone(1170,.08,'triangle',.035),90)}catch(_){}
 setTimeout(()=>{up.style.display='none';dn.style.display='';ermBusy=false},1700);return true};
/* 路人安排 */
Object.assign(VPLANX,{
 slope:{boarder:5,skier:2,sledKid:3,buildSnowman:2,snowballFight:2,dogWalk:1},
 inn:{chat:3,cocoaChat:2,shovel:3,dogWalk:2,handInHand:2,carryBox:2,petCat:2},
 onsen:{cocoaChat:1},
 lake:{snowballFight:1,skatePair:1},
 all3:{chat:5,shovel:4,dogWalk:3,buildSnowman:3,snowballFight:2,cocoaChat:3,handInHand:3,carryBox:3,petDog:2,petCat:1,throwCatch:2,sledKid:1},
 station:{chat:3,cocoaChat:3,handInHand:2,carryBox:2,dogWalk:2,petDog:1,shovel:1,throwCatch:1}});
function scatter3(){
 scatter('slope',POOL.slope,6000,170);
 scatter('inn',POOL.inn,6000,170);
 scatter('onsen',POOL.onsen,2500,45);
 scatter('lake',POOL.lake,2500,60);
 scatter('station',POOL.station,5000,150);
 scatter('all3',POOL.decor3,12000,260);
}
/* 小故事 */
STORIES[3]={title:'找媽媽的小猴子',giver:()=>T(0,0,1.15,monkey()),who:'猴子媽媽',
    target:()=>T(0,0,.75,monkey()+`<path d="M-7,-15 Q0,-11 7,-15 L7,-12 Q0,-8 -7,-12Z M3,-12 l3,7 l-4,0Z" fill="#d8413a" stroke-width="1"/>`)+`<path d="M-12,-20 l-3,-2 M-13,-15 l-4,0 M12,-20 l3,-2 M13,-15 l4,0" fill="none" stroke-width="1.2"/>`,tw:24,th:26,
    helper:()=>`<rect x="-9" y="-9" width="18" height="9" rx="2" fill="#a8703f"/>`+act(0,-6,1,{view:'fq',pose:'sit',hair:'#d6d6d6',hs:3,extra:`<path d="M6,-18 L18,-26 M8,-16 L19,-21" fill="none" stroke="#c99a5b" stroke-width="1.6"/><path d="M8,-16 Q14,-6 22,-10" fill="none" stroke="#d98c46" stroke-width="2.4"/>`})+`<circle cx="18" cy="-3" r="5" fill="#d98c46" stroke-width="1.2"/>`,hw:44,hh:60,
    ask:'猴子媽媽：我的寶寶不見了⋯牠圍著一條紅圍巾！',
    need:'小猴子冷得直發抖，不敢走⋯織毛線的奶奶也許有辦法。',
    got:'奶奶：這條小毯子剛織好，給小猴子披上吧！',
    ok:'小猴子披上毯子，暖呼呼地跟著你了！快帶回媽媽身邊。'};

/* ================= 登記 ================= */
WATERFN[3]=isWater3;
SCENE_IMPL[3]={ground:buildGround3,structures:()=>{skyBirds(3);buildStructures3();placeErmine()},scatter:scatter3};
LEVELS[3].types=TYPES3;

/* ================= 登記：場景範圍、場地邊緣、冒險地圖（2026-11-09 從 index.html 搬來） ================= */
H.SCENES[3]={x0:500,x1:2219,y1:2812,c:[1360,1562]};H.SCREG[3]=['slope','inn','onsen','lake','station','all3'];H.TARGET[3]=330;
H.SKYC[3]='#e6eef0';H.SKYY[3]=710;H.EDGEM[3]='LRB';H.EDGED[3]='LRB';
H.EDGEDECO[3]=[['pineS',4],['snowMound',2],['rockS',.8]];
H.FRINGE[3]=[['pineS',2.6],['snowMound',2.4],['rockS',1],['woodpile',.3],['walker3',.5]];
H.DENS[3]=1.33;
H.HERE[3]=[276,66];
/* 借物件：雪山的東西每局隨機借幾種放進第 1、2 關 */
H.BORROW[3]=[['scarf',{1:['village','plaza','top','banks'],2:['farmS','farm','farmS','farm']}],['mitten',{1:['plaza','village','banks','top'],2:['farm','farmS','farm','farmS']}],['cocoa',{1:['plaza','village','plaza','banks'],2:['farmS','farmS','farm','farmS']}],
  ['pinecone',{1:['forest','forest','banks','top'],2:['farm','farm','farmS','farm']}],['beanie',{1:['village','plaza','top','meadow'],2:['farmS','farm','farmS','farm']}]];
/* 冒險地圖：農莊往雪山的纜車、雪山溫泉村 */
H.mapHook(1,({U,P,ink,FN,f})=>{let g='';const on=U>=2;
 // cable car farm -> snow village
 if(U>=3){g+=`<path d="M288,206 L246,84" fill="none" stroke="${ink}" stroke-width="1.6"/><path d="M293,204 L251,82" fill="none" stroke="${ink}" stroke-width="1.1" opacity=".6"/>`;
  [[279,180],[262,130]].forEach(([x,y])=>g+=`<path d="M${x},${y} v14 M${x-4},${y} h8" stroke="#6a7488" stroke-width="2.4" fill="none"/>`);
  g+=`<g transform="translate(271,153)"><path d="M0,0 v4" stroke="${ink}" stroke-width="1"/>`+P('M-6,4 H6 L7,13 Q0,15 -7,13Z','#c4473c',1.3)+`<rect x="-4" y="6" width="3" height="3" fill="#d6ecf0"/><rect x="1" y="6" width="3" height="3" fill="#d6ecf0"/></g>`;
  let sv=`<g class="mnode" data-n="3"><circle cx="236" cy="78" r="38" fill="transparent"/><ellipse cx="236" cy="84" rx="38" ry="12" fill="#f7f5ef" stroke="${ink}" stroke-width="1.4"/>`;
  sv+=`<ellipse cx="252" cy="86" rx="9" ry="3.5" fill="#9fd3cf" stroke="${ink}" stroke-width="1.1"/><g fill="#fff" opacity=".9"><circle cx="249" cy="79" r="3.5"/><circle cx="255" cy="76" r="4"/></g>`;
  [[218,84,'#7f5a40'],[230,80,'#a85640'],[240,88,'#6a7488']].forEach(([x,y,c])=>sv+=P(`M${x-6},${y} V${y-7} H${x+6} V${y}Z`,'#e6d3b0',1.2)+P(`M${x-8},${y-7} L${x},${y-14} L${x+8},${y-7}Z`,c,1.2)+`<path d="M${x-6},${y-9} L${x},${y-13} L${x+6},${y-9}" fill="none" stroke="#fbf9f3" stroke-width="2"/>`);
  sv+=`<g transform="translate(236,108)"><rect x="-38" y="-11" width="76" height="20" rx="10" fill="#fffaf0" stroke="${ink}" stroke-width="1.8"/><text y="4.5" text-anchor="middle" font-size="12" fill="${ink}" font-family="${FN}">雪山溫泉村</text></g></g>`;
  g+=sv}
 return g});
/* ================= 過場：纜車（從農莊往北上山） ================= */
{const {T,OL,limb,pk,chibi,kid,swirl,roundTree,barn,pineS,cabinSVG,tone}=H;
function cableRideSVG(){
 const loop=(inner,dur)=>`<g class="rl" style="--d:${dur}s"><g>${inner}</g><g transform="translate(399,0)">${inner}</g></g>`;
 const tree=(x,y,k)=>`<g transform="translate(${x},${y}) scale(${k})">${pineS()}</g>`;
 let s=`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><g stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">`;
 s+=`<rect width="400" height="600" fill="#e6eef0" stroke="none"/><circle cx="70" cy="100" r="30" fill="#f5d27a" stroke="none"/>`;
 s+=loop(T(90,150,.9,swirl())+T(300,80,.7,swirl()),40);
 s+=loop(`<path d="M0,330 L0,250 L60,160 L110,220 L170,110 L240,210 L300,140 L360,230 L400,250 L400,330Z" fill="#dfe7ea"/><path d="M48,178 L60,160 L72,178 L66,174 L60,180 L54,174Z M156,134 L170,110 L184,134 L176,128 L170,138 L164,128Z M288,160 L300,140 L312,160 L306,156 L300,164 L294,156Z" fill="#fbf9f3" stroke-width="1.4"/>`,30);
 s+=loop(`<path d="M0,600 L0,380 Q100,340 200,372 Q300,334 400,380 L400,600Z" fill="#f7f5ef"/>`+[[30,400,.5],[120,382,.45],[230,392,.5],[330,388,.45],[80,470,.6],[190,500,.65],[300,470,.6]].map(([x,y,k])=>tree(x,y,k)).join(''),14);
 s+=loop([[20,600,1],[150,610,1.1],[270,596,.95],[370,612,1.05]].map(([x,y,k])=>tree(x,y,k)).join(''),5);
 s+=`<path d="M-20,470 L420,170" fill="none" stroke-width="2.4"/><path d="M-20,484 L420,184" fill="none" stroke-width="1.4" opacity=".6"/>`;
 s+=`<g transform="translate(200,320) scale(2.3)" stroke-width="1">${cabinSVG('#c4473c',true)}</g>`;
 return s+`</g></svg>`}
H.RIDES.cable={text:'搭纜車上山，前往雪山溫泉村⋯',every:420,tick:k=>tone(k%3?300:360,.09,'sine',.05),svg:cableRideSVG};}
})();
