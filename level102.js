/* 奇幻小鎮大搜查．秘境「樹籬迷宮」（編號 102，不排進主線；2026-11-21 做）
   從第 18 關宮廷院西邊高綠籬牆上的小缺口鑽進來（宮廷院 2 星後，小男孩偶爾從缺口探頭）；玩法由 secret.js（秘境引擎）處理。
   使用者的決定（2026-11-21）：
   - 入口：西邊原本拱門的位置改成綠籬牆上一個小缺口；西北角的迷宮頂視圖、拱門拿掉改成一般綠籬牆（level18.js）。
   - 小朋友每隔 15～25 秒從缺口探頭 3 秒，縮回去時點缺口也叫得出來。
   - 主角 1A 羽毛扁帽小探險家（綠扁帽＋白羽毛、藍短披風、斜背皮包）。
   - 綠籬牆 2C＋D：方正修剪＋白玫瑰點綴＋牆頂小圓球。中央 3D 紫藤木棚架。探頭的小朋友 4A 扁帽小男孩、不戴羽毛（改藍扁帽，和主角分得出來）。
   - 過關 B：24 個找齊後，還要走到迷宮中央的紫藤棚架才算過關（secret.js 的 C.goal）。
   場景（上北下南）：迷宮 9 欄 × 11 列，一格 140；入口在南邊正中間；中央 3×3 格是紫藤棚架空地（只有北邊一個入口）。
   迷宮南邊是一小塊草坪（起點），草坪南邊的綠籬上有剛剛鑽進來的小缺口。 */
(function(){
const H=window.TH;if(!H||!H.SECRET)return;
const {T,f,r,sr,pk,ri,shade,OL,SKIN,HATS,kid,act,add,mark,canPlace,KIND,REG,SCREG,SCENES,LEVELS,ART,DECOY,SCENE_IMPL,WATERFN,HERE,NEXTINFO,TARGET,STORIES,OUTFITS,DENS}=H;
const N=102;

/* ================= 迷宮的格子 ================= */
const CELL=180,WT=64,HH=64,COLS=11,ROWS=13,MX=620,MY=160,MX1=MX+COLS*CELL,MY1=MY+ROWS*CELL;   /* HH＝綠籬牆的高度（畫出來的正面） */
/* E[r][c]＝格子東邊有牆、S[r][c]＝格子南邊有牆（固定的迷宮，用種子 1 產生後寫死）。
   2026-11-21 使用者：要讓「一直摸著同一邊的牆走」的人走不到終點（選 B），而且迷宮往外擴、不要讓原本的空間變小（9×11 → 11×13）：
   中央 3×3 是紫藤棚架空地（門開在北邊），外面整整繞一圈「環狀走道」（5×5 的外圈），環狀走道只有西邊（第 7 列）和東邊（第 5 列）兩個出入口。
   空地的牆是一座「島」，沒有連到外牆，所以摸牆走只會繞著環狀走道轉出去（程式模擬過：左手、右手都會繞回入口）。 */
const E_=["00100000011","10010110111","11101001011","01000001101","10100001001","11110010001","10110011101","11010011101","11100001011","11010000101","01100011001","10001011011","00010100101"].map(s=>[...s].map(Number));
const S_=["00011101000","00000010100","10011111010","01011111010","00001010110","00100000011","00000000010","00001110000","00011111110","01000111001","00111100010","01110100100","11111011111"].map(s=>[...s].map(Number));
const cx=c=>MX+c*CELL+CELL/2,cy=r=>MY+r*CELL+CELL/2;
/* 牆的地面範圍（長方形，不能走） */
const WALLS=[];
const hRun=(y,x0,x1)=>WALLS.push({h:1,x0:x0-WT/2,x1:x1+WT/2,y0:y-WT/2,y1:y+WT/2});
const vRun=(x,y0,y1)=>WALLS.push({h:0,x0:x-WT/2,x1:x+WT/2,y0:y0-WT/2,y1:y1+WT/2});
{/* 北邊外牆 */hRun(MY,MX,MX1);
 /* 每一條橫線（格子南邊）：連續的牆合成一段 */
 for(let rr=0;rr<ROWS;rr++){let st=-1;for(let c=0;c<=COLS;c++){const w=c<COLS&&S_[rr][c];if(w&&st<0)st=c;if(!w&&st>=0){hRun(MY+(rr+1)*CELL,MX+st*CELL,MX+c*CELL);st=-1}}}
 /* 西邊外牆、每一條直線（格子東邊） */
 vRun(MX,MY,MY1);
 for(let c=0;c<COLS;c++){let st=-1;for(let rr=0;rr<=ROWS;rr++){const w=rr<ROWS&&E_[rr][c];if(w&&st<0)st=rr;if(!w&&st>=0){vRun(MX+(c+1)*CELL,MY+st*CELL,MY+rr*CELL);st=-1}}}}
/* 迷宮南邊的草坪（起點）：四周也是綠籬 */
const LAWN={x0:cx(5)-290,x1:cx(5)+290,y0:MY1,y1:MY1+290};
vRun(LAWN.x0,LAWN.y0,LAWN.y1);vRun(LAWN.x1,LAWN.y0,LAWN.y1);hRun(LAWN.y1,LAWN.x0,LAWN.x1);
const BACKGAP={x:cx(5),y:LAWN.y1+WT/2};   /* 草坪南邊綠籬上剛剛鑽進來的小缺口 */
const ENTR={x:cx(5),y:MY1};              /* 迷宮入口 */
const GOAL={x:cx(5),y:cy(6)+40,r:120};   /* 中央紫藤棚架 */

const SC={x0:560,x1:MX1+60,y1:LAWN.y1+70,c:[cx(5),LAWN.y1-100]};
SCENES[N]=SC;SCREG[N]=[];DENS[N]=1;TARGET[N]=300;
H.SKYC[N]='#78b85a';H.SKYY[N]=0;H.EDGEM[N]='';H.EDGED[N]='';
/* 場地外：一大片綠籬頂（不用雲） */
if(H.FOGFN)H.FOGFN[N]=({X0,X1,Y1})=>`${hedgeDefs('hf102')}<path d="M-6000,-4000 H8800 V5800 H-6000Z M${X0-300},-300 V${Y1+300} H${X1+300} V-300Z" fill="${HTOP[0]}" fill-rule="evenodd"/><path d="M-6000,-4000 H8800 V5800 H-6000Z M${X0-300},-300 V${Y1+300} H${X1+300} V-300Z" fill="url(#hf102T)" fill-rule="evenodd"/>`;
const inWall=(x,y,px=15,pn=6,ps=7)=>WALLS.some(w=>x>w.x0-px&&x<w.x1+px&&y>w.y0-pn&&y<w.y1+ps);
const inMaze=(x,y)=>x>MX&&x<MX1&&y>MY&&y<MY1;
const inLawn=(x,y)=>x>LAWN.x0&&x<LAWN.x1&&y>=MY1-14&&y<LAWN.y1;
const terrain=(x,y)=>(inMaze(x,y)||inLawn(x,y))&&!inWall(x,y);
WATERFN[N]=()=>false;
/* 物件、佈景的區域：迷宮切成六塊＋中央空地＋草坪 */
const RX=[MX,MX+Math.round(COLS*CELL/3),MX+Math.round(COLS*CELL*2/3),MX1],RY=[MY,MY+Math.round(ROWS*CELL/3),MY+Math.round(ROWS*CELL*2/3),MY1];
const rg=(i,j)=>({x:RX[i],y:RY[j],w:RX[i+1]-RX[i],h:RY[j+1]-RY[j]});
Object.assign(REG,{
 nw102:rg(0,0),nn102:rg(1,0),ne102:rg(2,0),w102:rg(0,1),e102:rg(2,1),sw102:rg(0,2),s102:rg(1,2),se102:rg(2,2),
 ring102:{x:MX+3*CELL,y:MY+4*CELL,w:5*CELL,h:5*CELL},
 ctr102:{x:MX+4*CELL,y:MY+5*CELL,w:3*CELL,h:3*CELL},lawn102:{x:LAWN.x0,y:LAWN.y0,w:LAWN.x1-LAWN.x0,h:LAWN.y1-LAWN.y0},
 any102:{x:MX,y:MY,w:COLS*CELL,h:ROWS*CELL}});
const inReg=(reg,x,y)=>{if(reg!=='ctr102'&&Math.hypot(x-GOAL.x,y-(GOAL.y-40))<150)return false;return true};

/* ================= 顏色 ================= */
const G='#4f8a3e',GL='#6aa64e',GD='#3c6e30',GT='#78b85a',GTD='#5f9a46',PATH='#e2d6b4',PE='#c9b98e',GRASS='#9cc46a';
const rq=(()=>{let a=102102;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}})(); /* 綠籬上的玫瑰位置用自己的亂數，固定不變 */

/* ================= 綠籬牆（sprite，依 y 排前後；主角走到牆後面會被擋住） ================= */
const rose=(x,y,s=1)=>`<g transform="translate(${f(x)},${f(y)}) scale(${s})"><circle r="3.8" fill="#fbf9f2" stroke-width="1"/><path d="M-1.6,-.6 Q0,-2.4 1.6,-.6" fill="none" stroke="#e6dcc6" stroke-width=".9"/><circle r="1.1" fill="#e8cf6a" stroke="none"/></g>`;
const ball=(x,y)=>`<circle cx="${f(x)}" cy="${f(y)}" r="12" fill="${G}"/><circle cx="${f(x-3.5)}" cy="${f(y-4)}" r="4" fill="${GT}" stroke="none"/><path d="M${f(x-5)},${f(y+5)} l2,-2.4 l2,2.4 M${f(x+2)},${f(y+1)} l2,-2.4 l2,2.4" fill="none" stroke="${GD}" stroke-width="1"/>`;
const leafTex=(x0,y0,w,h,step=11)=>{let lf='';for(let y=y0+8;y<y0+h-2;y+=10)for(let x=x0+5+((y/10|0)%2)*5;x<x0+w-4;x+=step)lf+=`M${f(x)},${f(y)} l2,-2.4 l2,2.4 `;return lf?`<path d="${lf}" fill="none" stroke="#2f5a26" stroke-width="1.1"/>`:''};
/* 2026-11-21 使用者選 1B（大葉茂密，像草叢 A）、2b（牆 64、主角 80%）：綠籬牆改成密密的大葉子。
   葉子畫在 <pattern> 圖樣磚裡（一塊磚重複貼），手機只要畫一塊磚，不會因為幾千片葉子變卡。
   邊緣用一條「葉尖鋸齒」的路徑描出輪廓（每面牆只多一兩個圖形）。第 18 關西邊高牆、過場用同樣的做法（level18.js 有一份一樣的）。 */
const HTOP=['#6aa64e','#4f8a3e','#78b85a','#96cc70'],HFACE=['#3c6e30','#2c5424','#3f7030','#548a3c'];
function leafPat(id,cs,{w=64,h=56,L=10,n=120,seed=7,lc='#2f5a26',k=1}={}){let a=seed;const q=()=>{a=(a*16807)%2147483647;return a/2147483647};
 const P=[];for(let i=0;i<n;i++)P.push([q()*w,q()*h,(q()-.5)*150,L*(.75+q()*.5),cs[1+Math.min(2,Math.floor(q()*3.3))]]);P.sort((u,v)=>u[1]-v[1]);
 const lf=(x,y,an,l,c)=>`<path transform="translate(${f(x)},${f(y)}) rotate(${an|0})" d="M0,${f(l*.45)} Q${f(-l*.42)},${f(-l*.05)} 0,${f(-l*.55)} Q${f(l*.42)},${f(-l*.05)} 0,${f(l*.45)}Z" fill="${c}"/>`;
 let s='';for(const [x,y,an,l,c] of P)for(const dx of [-w,0,w])for(const dy of [-h,0,h]){const X=x+dx,Y=y+dy;if(X>-l&&X<w+l&&Y>-l&&Y<h+l)s+=lf(X,Y,an,l,c)}
 return `<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse"${k!==1?` patternTransform="scale(${k})"`:''}><g stroke="${lc}" stroke-width=".7" stroke-linejoin="round">${s}</g></pattern>`}
const hedgeDefs=(pre,k=1)=>`<defs>${leafPat(pre+'T',HTOP,{seed:11,k})}${leafPat(pre+'F',HFACE,{seed:23,k,lc:'#24461d'})}</defs>`;
/* 葉尖鋸齒：從 (x0,y0) 到 (x1,y1)，往 (nx,ny) 那一側長出一個個葉尖 */
function bumps(x0,y0,x1,y1,nx,ny,st=9,dp=5){const L=Math.hypot(x1-x0,y1-y0),n=Math.max(1,Math.round(L/st));let d='';
 for(let i=0;i<n;i++){const t0=i/n,t1=(i+1)/n,ax=x0+(x1-x0)*t0,ay=y0+(y1-y0)*t0,bx=x0+(x1-x0)*t1,by=y0+(y1-y0)*t1,mx=(ax+bx)/2,my=(ay+by)/2,e=dp*(.75+((i*37)%10)/20);
  d+=` Q${f(ax+nx*e*.9)},${f(ay+ny*e*.9)} ${f(mx+nx*e)},${f(my+ny*e)} Q${f(bx+nx*e*.9)},${f(by+ny*e*.9)} ${f(bx)},${f(by)}`}return d}
/* 一面密葉綠籬：x0～x1、頂面 yT～yB、正面 yB～yG（地面）。pre＝pattern 的 id 開頭 */
function leafWall(x0,x1,yT,yB,yG,pre,{top=1,left=1,right=1}={}){let s='';
 /* 頂面外圍的葉尖（後面、左、右） */
 let d=`M${f(x0)},${f(yB)}`;d+=left?bumps(x0,yB,x0,yT,-1,0):` L${f(x0)},${f(yT)}`;d+=top?bumps(x0,yT,x1,yT,0,-1):` L${f(x1)},${f(yT)}`;d+=right?bumps(x1,yT,x1,yB,1,0):` L${f(x1)},${f(yB)}`;d+='Z';
 s+=`<path d="${d}" fill="${HTOP[0]}" stroke-width="1.6"/>`;
 s+=`<rect x="${f(x0)}" y="${f(yT)}" width="${f(x1-x0)}" height="${f(yB-yT)}" fill="url(#${pre}T)" stroke="none"/>`;   /* 底色已經在上面的鋸齒輪廓裡 */
 /* 正面 */
 s+=`<rect x="${f(x0)}" y="${f(yB)}" width="${f(x1-x0)}" height="${f(yG-yB)}" fill="${HFACE[0]}" stroke="none"/><rect x="${f(x0)}" y="${f(yB)}" width="${f(x1-x0)}" height="${f(yG-yB)}" fill="url(#${pre}F)" stroke="none"/>`;
 s+=`<path d="M${f(x0)},${f(yB)} V${f(yG)} H${f(x1)} V${f(yB)}" fill="none" stroke-width="1.6"/>`;
 /* 頂面的葉子垂到正面上（一排亮綠葉尖） */
 s+=`<path d="M${f(x0)},${f(yB-3)}${bumps(x0,yB-3,x1,yB-3,0,1,9,7)} Z" fill="${HTOP[2]}" stroke="#2f5a26" stroke-width="1"/>`;
 return s}
function hedgeArt(w){/* 回傳以「正面底部中心」為原點的圖 */
 const W=w.x1-w.x0,L=w.y1-w.y0;return leafWall(-W/2,W/2,-HH-L,-HH,0,'hd102')}

/* ================= 要找的東西（8 種 × 3）與干擾物 ================= */
const PARCH='#efe0b4';
const mapArt=`<path d="M-14,-11 L13,-13 L15,11 L-12,13Z" fill="${PARCH}"/><path d="M0,-12 L1.5,12" fill="none" stroke="#c9b282" stroke-width="1.2"/><path d="M-10,-6 H-3 V2 H-8 M5,-8 V-2 H11 M4,4 H10 V9" fill="none" stroke="#5f8a4a" stroke-width="1.5"/><path d="M-7,6 l3,3 M-4,6 l-3,3" fill="none" stroke="#d8413a" stroke-width="1.4"/>`;
const mapBack=`<path d="M-14,-11 L13,-13 L15,11 L-12,13Z" fill="${PARCH}"/><path d="M0,-12 L1.5,12" fill="none" stroke="#c9b282" stroke-width="1.2"/><path d="M-9,-5 q4,-2 8,0 M3,4 q4,-2 8,0" fill="none" stroke="#d6c48e" stroke-width="1.1"/>`;
const mapOpen=`<path d="M-16,-12 L15,-13 L16,12 L-15,13Z" fill="${PARCH}"/><path d="M-12,-9 H-4 V-3 H-12 V4 H-2 V9 M2,-9 V-4 H10 V2 H4 V9 H12 M-8,0 H-6 M8,-6 V-2" fill="none" stroke="#3c6e30" stroke-width="1.6"/><circle cx="7" cy="5" r="2" fill="#a88ad8" stroke-width=".8"/><path d="M-11,7 l3,3 M-8,7 l-3,3" fill="none" stroke="#d8413a" stroke-width="1.5"/>`;
const bagArt=`<path d="M-11,-8 L11,-8 L12,13 L-12,13Z" fill="#c9a46a"/><path d="M-11,-8 L-8,-13 L8,-13 L11,-8" fill="#b8915a"/><path d="M-11,-8 H11" fill="none" stroke="#9a7848" stroke-width="1.2"/><path d="M-6,0 v9 M6,0 v9" fill="none" stroke="#b8915a" stroke-width="1"/>`;
const bagOpen=`<path d="M-12,-6 L12,-6 L12,13 L-12,13Z" fill="#c9a46a"/><path d="M-12,-6 Q0,-1 12,-6 L10,-12 Q0,-8 -10,-12Z" fill="#8a6a3a"/><path d="M-6,2 v9 M6,2 v9" fill="none" stroke="#b8915a" stroke-width="1"/>`;
const compArt=`<circle r="13" fill="#d8b04a"/><circle r="10" fill="#fbf6e2" stroke-width="1.3"/><path d="M0,-8 L2,0 L0,8 L-2,0Z" fill="#d8413a" stroke-width=".9"/><path d="M0,0 L-2,0 L0,8 L2,0Z" fill="#6a7280" stroke="none"/><circle r="1.4" fill="${OL}" stroke="none"/><rect x="-3" y="-17" width="6" height="4" rx="1.5" fill="#d8b04a" stroke-width="1.1"/>`;
const compZoom=`<g transform="scale(2.4)"><circle r="12" fill="#fbf6e2" stroke="#d8b04a" stroke-width="2"/><text y="-6" text-anchor="middle" font-size="5" font-weight="800" fill="#d8413a" stroke="none" font-family="sans-serif">N</text><path d="M0,-9 L2,0 L0,9 L-2,0Z" fill="#d8413a" stroke-width=".5"/><path d="M0,0 L-2,0 L0,9 L2,0Z" fill="#6a7280" stroke="none"/><path d="M-11,0 h2 M9,0 h2 M0,9 v2" fill="none" stroke-width=".6"/><circle r=".9" fill="${OL}" stroke="none"/></g>`;
const btnArt=`<circle r="13" fill="#c99a3a"/><circle r="9.5" fill="#d8b04a" stroke-width="1.2"/>${[[-3,-3],[3,-3],[-3,3],[3,3]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.6" fill="#7a5a20" stroke="none"/>`).join('')}`;
const btnZoom=`<g transform="scale(2.4)"><circle r="12" fill="#d8b04a" stroke-width=".8"/><circle r="8.5" fill="none" stroke="#a8802a" stroke-width=".8"/>${[[-3,-3],[3,-3],[-3,3],[3,3]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.7" fill="#7a5a20" stroke="none"/>`).join('')}<path d="M-3,-3 L3,3 M3,-3 L-3,3" fill="none" stroke="#f4ecd6" stroke-width=".9"/></g>`;
const bowArt=`<path d="M0,0 Q-8,-12 -15,-6 Q-16,2 -8,4 Q-3,3 0,0Z M0,0 Q8,-12 15,-6 Q16,2 8,4 Q3,3 0,0Z" fill="#d8413a"/><path d="M0,0 L-7,13 L-3,12 L0,6 M0,0 L7,13 L3,12 L0,6" fill="#c4302a" stroke-width="1.2"/><circle r="3.2" fill="#b8282a" stroke-width="1.2"/><path d="M-10,-4 Q-7,-6 -4,-3" fill="none" stroke="#f08a80" stroke-width="1.1"/>`;
const petalArt=`${[[-6,-3,-30],[5,-5,20],[0,5,80],[8,6,140]].map(([x,y,a])=>`<path transform="translate(${x},${y}) rotate(${a})" d="M0,-7 Q6,-3 0,7 Q-6,-3 0,-7Z" fill="#d8413a" stroke-width="1.2"/>`).join('')}`;
const hogCurl=`<path d="M-14,8 Q-15,-10 0,-12 Q15,-10 14,8Z" fill="#8a6a4a"/>${[...Array(9)].map((_,i)=>{const a=Math.PI*(1+i/8),x=Math.cos(a)*13,y=Math.sin(a)*11+3;return `<path d="M${f(x*.8)},${f(y*.8)} L${f(x*1.15)},${f(y*1.15)}" fill="none" stroke="#5a4430" stroke-width="1.3"/>`}).join('')}<path d="M8,8 Q14,6 15,9 Q12,11 8,10Z" fill="#e8c8a0" stroke-width="1.1"/><circle cx="15.4" cy="8.6" r="1.2" fill="${OL}" stroke="none"/>`;
const hogFace=`<path d="M-15,6 Q-15,-11 -1,-12 Q10,-12 13,-4 Q16,2 14,7Z" fill="#8a6a4a"/>${[...Array(8)].map((_,i)=>{const a=Math.PI*(1.05+i/9),x=Math.cos(a)*13,y=Math.sin(a)*11+2;return `<path d="M${f(x*.8-1)},${f(y*.8)} L${f(x*1.15-1)},${f(y*1.15)}" fill="none" stroke="#5a4430" stroke-width="1.3"/>`}).join('')}<path d="M5,-3 Q14,-3 19,3 Q14,8 5,8Z" fill="#e8c8a0"/><circle cx="19" cy="3" r="1.6" fill="${OL}" stroke="none"/><circle cx="10" cy="1" r="1.3" fill="${OL}" stroke="none"/><path d="M-6,8 v3 M2,8 v3" fill="none" stroke-width="1.6"/>`;
const nutArt=`<circle r="12" fill="#8a8a3a"/>${[...Array(16)].map((_,i)=>{const a=i/16*Math.PI*2;return `<path d="M${f(Math.cos(a)*11)},${f(Math.sin(a)*11)} L${f(Math.cos(a)*16)},${f(Math.sin(a)*16)}" fill="none" stroke="#6a6a2a" stroke-width="1.2"/>`}).join('')}<circle cx="-3" cy="-3" r="3" fill="#a3a350" stroke="none"/>`;
const nutOpen=`<circle r="12" fill="#8a8a3a"/>${[...Array(16)].map((_,i)=>{const a=i/16*Math.PI*2;return `<path d="M${f(Math.cos(a)*11)},${f(Math.sin(a)*11)} L${f(Math.cos(a)*16)},${f(Math.sin(a)*16)}" fill="none" stroke="#6a6a2a" stroke-width="1.2"/>`}).join('')}<path d="M-8,-2 Q0,-12 8,-2 Q6,8 0,9 Q-6,8 -8,-2Z" fill="#7a4a2a"/><path d="M-5,-5 Q0,-8 5,-5" fill="none" stroke="#c99a6a" stroke-width="1.2"/>`;
const marbArt=`<circle r="11" fill="#9fd3e8" fill-opacity=".9"/><path d="M-6,4 Q-2,-6 6,-4 Q2,2 -6,4Z" fill="#3f6fa8" stroke="none" opacity=".8"/><circle cx="-4" cy="-5" r="2.6" fill="#fff" stroke="none" opacity=".85"/>`;
const marbLit=`<circle r="11" fill="#cfeaf6"/><path d="M-8,5 Q-3,-8 8,-5 Q3,3 -8,5Z" fill="#3f6fa8" stroke="none"/><path d="M-5,6 Q2,-2 7,1" fill="none" stroke="#f5c842" stroke-width="1.6"/><circle cx="-4" cy="-5" r="2.6" fill="#fff" stroke="none"/>`;
const grapeArt=`<ellipse rx="10" ry="11.5" fill="#a8c85a"/><path d="M0,-11 Q2,-15 5,-16" fill="none" stroke="#6a5a3a" stroke-width="1.6"/><circle cx="-4" cy="-5" r="2.6" fill="#e8f2c8" stroke="none" opacity=".8"/>`;
const grapeLit=`<ellipse rx="10" ry="11.5" fill="#c8e080"/><ellipse cx="-2" cy="2" rx="2" ry="3" fill="#8a7a3a" stroke="none"/><ellipse cx="3" cy="0" rx="1.8" ry="2.8" fill="#8a7a3a" stroke="none"/><path d="M0,-11 Q2,-15 5,-16" fill="none" stroke="#6a5a3a" stroke-width="1.6"/>`;
const shutArt=`<path d="M-5,4 L-13,-14 Q0,-19 13,-14 L5,4Z" fill="#fbf9f2"/><path d="M-9,-15 L-3,3 M0,-17 V3 M9,-15 L3,3" fill="none" stroke="#d6d0c0" stroke-width="1"/><path d="M-6,3 H6 L5,11 Q0,14 -5,11Z" fill="#d8413a"/><path d="M-6,6 H6" fill="none" stroke="#f5c842" stroke-width="1.4"/>`;
const flowArt=`<path d="M0,4 V14" fill="none" stroke="#5f8a4a" stroke-width="1.8"/>${[0,60,120,180,240,300].map(a=>`<path transform="rotate(${a})" d="M0,-2 Q-5,-9 0,-13 Q5,-9 0,-2Z" fill="#fbf9f2" stroke-width="1.1"/>`).join('')}<circle r="3.4" fill="#f5c842" stroke-width="1"/>`;
/* 2026-11-21 使用者選 B 跪坐祈禱的小天使（正面看得到一點翅膀和光環；轉過來才看得到整對翅膀） */
const AS='#e8e4da',ASL='#f6f3ec',ASD='#c9c2b2';
const aWingL=(x,y,s=1)=>`<path transform="translate(${x},${y}) scale(${s})" d="M0,0 Q-9,-9 -13,-3 Q-12,1 -8,1 Q-11,4 -6,6 Q-3,5 0,3Z" fill="${ASL}" stroke-width="1.2"/>`;
const aWingR=(x,y,s=1)=>`<g transform="translate(${x},${y}) scale(${-s},${s})">${aWingL(0,0)}</g>`;
const aHalo=`<ellipse cx="0" cy="-17" rx="5" ry="1.6" fill="none" stroke="#d6c48e" stroke-width="1.4"/>`;
const aCurls=y=>`<path d="M-5,${y} q1.5,-3 3,0 q1.5,-3 3,0 q1.5,-3 3,0" fill="none" stroke="${ASD}" stroke-width="1.1"/>`;
const angelArt=`${aWingL(-4,-4,.8)}${aWingR(4,-4,.8)}<path d="M-9,13 Q-10,4 -6,-1 L6,-1 Q10,4 9,13Z" fill="${AS}"/><path d="M-2,-1 L0,6 L2,-1" fill="${ASL}" stroke-width="1"/><circle cx="0" cy="-8" r="6.5" fill="#efece4"/>${aCurls(-12)}<circle cx="-2.2" cy="-8" r=".85" fill="${OL}" stroke="none"/><circle cx="2.2" cy="-8" r=".85" fill="${OL}" stroke="none"/>${aHalo}`;
const angelBack=`<path d="M-9,13 Q-10,4 -6,-1 L6,-1 Q10,4 9,13Z" fill="${AS}"/>${aWingL(-1,-2,1.25)}${aWingR(1,-2,1.25)}<circle cx="0" cy="-8" r="6.5" fill="#efece4"/>${aCurls(-10)}${aHalo}`;
const stoneArt=`<path d="M-8,12 Q-11,0 -7,-8 Q-2,-15 4,-12 Q10,-7 9,3 Q8,12 -8,12Z" fill="#ece8de"/><path d="M-3,-8 Q2,-10 5,-6" fill="none" stroke="#fff" stroke-width="1.4"/><circle cx="2" cy="4" r=".9" fill="#c9c2b2" stroke="none"/>`;
const stoneBack=`<path d="M-8,12 Q-11,0 -7,-8 Q-2,-15 4,-12 Q10,-7 9,3 Q8,12 -8,12Z" fill="#e4e0d4"/><circle cx="-3" cy="-2" r="1" fill="#c9c2b2" stroke="none"/><circle cx="4" cy="6" r=".9" fill="#c9c2b2" stroke="none"/>`;
const dandArt=`<path d="M0,0 Q2,8 0,16" fill="none" stroke="#6a9a4a" stroke-width="1.8"/><circle cy="-4" r="11" fill="#fbf9f2" fill-opacity=".85" stroke="#d6d0c0" stroke-width="1"/>${[...Array(12)].map((_,i)=>{const a=i/12*Math.PI*2;return `<path d="M0,-4 L${f(Math.cos(a)*10)},${f(-4+Math.sin(a)*10)}" fill="none" stroke="#d6d0c0" stroke-width=".7"/><circle cx="${f(Math.cos(a)*10)}" cy="${f(-4+Math.sin(a)*10)}" r="1" fill="#fff" stroke="none"/>`}).join('')}<circle cy="-4" r="1.8" fill="#c9b07a" stroke="none"/>`;
const puffArt=`<path d="M0,0 Q4,8 2,16" fill="none" stroke="#c9b48a" stroke-width="1.2"/><circle cy="-4" r="11" fill="#fbf9f2"/>${[[-5,-8],[4,-9],[6,0],[-6,1],[0,-3]].map(([x,y])=>`<path d="M${x-2},${y} q2,-2 4,0" fill="none" stroke="#e0dbd0" stroke-width="1"/>`).join('')}`;
const TYPES102=[
 {id:'map102',name:'迷宮地圖',short:'迷宮地圖',r:13,rot:15,spots:[['nw102','leafF'],['e102'],['s102']]},
 {id:'comp102',name:'指南針',short:'指南針',r:12,rot:20,spots:[['ne102'],['w102','potF'],['se102']]},
 {id:'bow102',name:'紅緞帶蝴蝶結',short:'蝴蝶結',r:13,rot:20,spots:[['nn102'],['sw102'],['ctr102']]},
 {id:'hog102',name:'小刺蝟',short:'小刺蝟',r:13,rot:8,spots:[['w102','bushF'],['ne102'],['se102','leafF']]},
 {id:'marb102',name:'玻璃彈珠',short:'彈珠',r:10,rot:0,spots:[['nn102'],['sw102','leafF'],['e102']]},
 {id:'shut102',name:'羽毛毽子',short:'毽子',r:12,rot:25,spots:[['nw102'],['se102'],['lawn102']]},
 {id:'angel102',name:'石雕小天使',short:'小天使',r:13,rot:6,spots:[['ne102','bushF'],['w102'],['s102']]},
 {id:'dand102',name:'蒲公英',short:'蒲公英',r:13,rot:15,spots:[['nw102'],['e102','potF'],['sw102']]}];
LEVELS[N].types=TYPES102;
Object.assign(ART,{map102:mapArt,comp102:compArt,bow102:bowArt,hog102:hogCurl,marb102:marbArt,shut102:shutArt,angel102:angelArt,dand102:dandArt});
const DECOYT={bag102:{id:'bag102',name:'對折小卡',r:13,rot:15},btn102:{id:'btn102',name:'金色小圓鏡',r:12,rot:20},petal102:{id:'petal102',name:'紅色蝴蝶',r:12,rot:30},nut102:{id:'nut102',name:'圓毛刷',r:13,rot:20},
 grape102:{id:'grape102',name:'藍色泡泡',r:10,rot:10},flow102:{id:'flow102',name:'奶油擠花點心',r:12,rot:20},stone102:{id:'stone102',name:'石雕小鳥',r:12,rot:10},puff102:{id:'puff102',name:'白色絨毛球',r:13,rot:15}};
const DECOYART={bag102:bagArt,btn102:btnArt,petal102:petalArt,nut102:nutArt,grape102:grapeArt,flow102:flowArt,stone102:stoneArt,puff102:puffArt};
/* 2026-11-23c 使用者重選的干擾物：1E 對折小卡、2B 金色小圓鏡、3B 紅色蝴蝶、4C 圓毛刷、5D 藍色泡泡、6G 奶油擠花點心、7I 跪坐石鳥（光環＋翅膀） */
Object.assign(DECOYART,{stone102:"<rect x=\"-11\" y=\"11\" width=\"22\" height=\"5\" rx=\"1.5\" fill=\"#d8d2c4\"/><g transform=\"translate(-4,-3) scale(0.85,0.85)\"><path d=\"M0,0 Q-9,-9 -13,-3 Q-12,1 -8,1 Q-11,4 -6,6 Q-3,5 0,3Z\" fill=\"#f6f3ec\" stroke-width=\"1.2\"/></g><g transform=\"translate(4,-3) scale(-0.85,0.85)\"><path d=\"M0,0 Q-9,-9 -13,-3 Q-12,1 -8,1 Q-11,4 -6,6 Q-3,5 0,3Z\" fill=\"#f6f3ec\" stroke-width=\"1.2\"/></g><path d=\"M-8,11 Q-10,3 -6,-1 L6,-1 Q10,3 8,11Z\" fill=\"#e8e4da\"/><circle cx=\"0\" cy=\"-7\" r=\"6\" fill=\"#efece4\"/><path d=\"M4,-7 l5,1 l-5,1.6Z\" fill=\"#c9c2b2\" stroke-width=\"1\"/><circle cx=\"1.6\" cy=\"-8\" r=\".9\" fill=\"#2b2420\" stroke=\"none\"/><ellipse cx=\"0\" cy=\"-15\" rx=\"5\" ry=\"1.6\" fill=\"none\" stroke=\"#d6c48e\" stroke-width=\"1.4\"/>",bag102:"<path d=\"M-13,-12 H13 V12 H-13Z\" fill=\"#efe4c4\"/><path d=\"M0,-12 V12\" fill=\"none\" stroke=\"#c9b48a\" stroke-width=\"1.4\"/><path d=\"M-9,-6 q3,-3 6,0 M-9,2 q3,-3 6,0 M4,-6 h6 M4,0 h4\" fill=\"none\" stroke=\"#5f8a4a\" stroke-width=\"1.6\"/><circle cx=\"7\" cy=\"6\" r=\"2\" fill=\"#c4473c\" stroke=\"none\"/>",btn102:"<circle r=\"13\" fill=\"#e8c04a\"/><circle r=\"9\" fill=\"#dff1fa\"/><path d=\"M-4,-5 Q-6,0 -4,4\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2\"/>",petal102:"<path d=\"M0,0 Q-14,-16 -16,-4 Q-14,4 0,0 Q-12,12 -6,14 Q0,10 0,0Z M0,0 Q14,-16 16,-4 Q14,4 0,0 Q12,12 6,14 Q0,10 0,0Z\" fill=\"#d8413a\"/><path d=\"M0,-6 V8 M0,-6 l-3,-5 M0,-6 l3,-5\" fill=\"none\" stroke-width=\"1.6\"/>",nut102:"<path d=\"M-14,4 Q-14,-12 0,-12 Q14,-12 14,4Z\" fill=\"#a8703f\"/><path d=\"M-12,4 v6\" stroke=\"#5a3a20\" stroke-width=\"1.6\"/><path d=\"M-8,4 v6\" stroke=\"#5a3a20\" stroke-width=\"1.6\"/><path d=\"M-4,4 v6\" stroke=\"#5a3a20\" stroke-width=\"1.6\"/><path d=\"M0,4 v6\" stroke=\"#5a3a20\" stroke-width=\"1.6\"/><path d=\"M4,4 v6\" stroke=\"#5a3a20\" stroke-width=\"1.6\"/><path d=\"M8,4 v6\" stroke=\"#5a3a20\" stroke-width=\"1.6\"/><path d=\"M12,4 v6\" stroke=\"#5a3a20\" stroke-width=\"1.6\"/>",grape102:"<circle r=\"11\" fill=\"#cfe6f2\" opacity=\".8\"/><path d=\"M-5,-6 Q-7,-2 -6,2\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"-10\" r=\"3\" fill=\"#cfe6f2\" stroke-width=\"1\"/>",flow102:"<path d=\"M-12,10 Q-14,0 -6,-2 Q-8,-10 0,-12 Q8,-10 6,-2 Q14,0 12,10Z\" fill=\"#fbf9f3\"/><path d=\"M-6,-2 Q0,2 6,-2 M-8,4 Q0,8 8,4\" fill=\"none\" stroke=\"#e2dccc\" stroke-width=\"1.2\"/><circle cx=\"0\" cy=\"-15\" r=\"3.6\" fill=\"#d8413a\" stroke-width=\"1.1\"/>"});
Object.assign(DECOY,DECOYART);
const IN=(act,btn,front,after,note,o={})=>({act,btn,front,after,note,...o});
const INSPECT={
 map102:IN('flip','🔄 打開來看看',mapBack,mapOpen,'裡面畫滿彎彎曲曲的小路，還有一個紅色叉叉——是<b>迷宮地圖</b>！'),
 bag102:IN('flip','🔄 打開來看看',bagArt,bagOpen,'裡面空空的，只是一個<b>牛皮紙袋</b>。',{name:'牛皮紙袋'}),
 comp102:IN('mag','🔍 用放大鏡看',compArt,compZoom,'玻璃底下有一根紅色指針，寫著「N」——是<b>指南針</b>！',{lens:[0,0]}),
 btn102:IN('mag','🔍 用放大鏡看',btnArt,btnZoom,'中間有四個小洞，還穿著線，是<b>大銅鈕扣</b>。',{lens:[0,0],name:'大銅鈕扣'}),
 hog102:IN('turn','🔄 轉過來看看',hogCurl,hogFace,'刺刺的球張開了，露出尖尖的小鼻子——是<b>小刺蝟</b>！'),
 nut102:IN('turn','🔄 轉過來看看',nutArt,nutOpen,'刺刺的殼裂開，裡面是一顆栗子，是<b>栗子殼</b>。',{name:'栗子殼'}),
 marb102:IN('light','💡 對著光看',marbArt,marbLit,'光透過去，裡面有藍色和金色的花紋——是<b>玻璃彈珠</b>！'),
 grape102:IN('light','💡 對著光看',grapeArt,grapeLit,'裡面看得到兩顆小籽，是一顆<b>綠葡萄</b>。',{name:'綠葡萄'}),
 angel102:IN('turn','🔄 轉過來看背面',angelArt,angelBack,'背後有一對小翅膀——是<b>石雕小天使</b>！'),
 stone102:IN('turn','🔄 轉過來看背面',stoneArt,stoneBack,'背面也是光滑的，只是一顆<b>白石頭</b>。',{name:'白石頭'}),
 bow102:IN('spin','🌀 轉一圈',bowArt,bowArt,'是<b>紅緞帶蝴蝶結</b>！'),petal102:IN('spin','🌀 轉一圈',petalArt,petalArt,'是<b>紅色花瓣</b>。',{name:'紅色花瓣'}),
 shut102:IN('spin','🌀 轉一圈',shutArt,shutArt,'是<b>羽毛毽子</b>！'),flow102:IN('spin','🌀 轉一圈',flowArt,flowArt,'是<b>白色小花</b>。',{name:'白色小花'}),
 dand102:IN('spin','🌀 轉一圈',dandArt,dandArt,'是<b>蒲公英</b>！'),puff102:IN('spin','🌀 轉一圈',puffArt,puffArt,'是<b>白色絨毛球</b>。',{name:'白色絨毛球'})};
Object.assign(INSPECT,{bag102:IN('flip','🔄 打開來看看',DECOYART.bag102,"<path d=\"M0,-12 Q-8,-15 -16,-12 V12 Q-8,9 0,12Z M0,-12 Q8,-15 16,-12 V12 Q8,9 0,12Z\" fill=\"#efe4c4\"/><path d=\"M-12,-6 h8 M-12,-2 h9 M-12,2 h6 M4,-6 h8 M4,-2 h7\" fill=\"none\" stroke=\"#9a8a6a\" stroke-width=\"1.2\"/><path d=\"M8,5 c-2,-3 -6,-1 -4,2 l4,4 4,-4 c2,-3 -2,-5 -4,-2z\" fill=\"#d8413a\" stroke-width=\"1\"/>",'裡面寫著祝福的話，只是一張<b>對折小卡</b>。',{name:'對折小卡'}),btn102:IN('mag','🔍 用放大鏡看',DECOYART.btn102,"<g transform=\"scale(2.4)\"><circle r=\"12\" fill=\"#e8c04a\" stroke-width=\".8\"/><circle r=\"8.6\" fill=\"#dff1fa\" stroke-width=\".7\"/><path d=\"M-4,-5 Q-6,0 -4,4\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.6\"/><circle cx=\"2\" cy=\"1\" r=\"3\" fill=\"#f2d0b0\" stroke-width=\".5\"/></g>",'鏡子裡只照出你自己，是一面<b>金色小圓鏡</b>。',{lens:[0,0],name:'金色小圓鏡'}),nut102:IN('turn','🔄 轉過來看看',DECOYART.nut102,"<path d=\"M-14,-6 Q-14,8 0,8 Q14,8 14,-6Z\" fill=\"#a8703f\"/><path d=\"M-12,-6 v-7\" stroke=\"#5a3a20\" stroke-width=\"1.6\"/><path d=\"M-8,-6 v-7\" stroke=\"#5a3a20\" stroke-width=\"1.6\"/><path d=\"M-4,-6 v-7\" stroke=\"#5a3a20\" stroke-width=\"1.6\"/><path d=\"M0,-6 v-7\" stroke=\"#5a3a20\" stroke-width=\"1.6\"/><path d=\"M4,-6 v-7\" stroke=\"#5a3a20\" stroke-width=\"1.6\"/><path d=\"M8,-6 v-7\" stroke=\"#5a3a20\" stroke-width=\"1.6\"/><path d=\"M12,-6 v-7\" stroke=\"#5a3a20\" stroke-width=\"1.6\"/>",'翻過來是一排硬硬的刷毛，是<b>圓毛刷</b>。',{name:'圓毛刷'}),grape102:IN('light','💡 對著光看',DECOYART.grape102,"<circle r=\"11\" fill=\"#e8f6fc\" opacity=\".9\"/><path d=\"M-8,3 Q0,8 8,3\" fill=\"none\" stroke=\"#f2a6d0\" stroke-width=\"1.4\"/><path d=\"M-8,-1 Q0,4 8,-1\" fill=\"none\" stroke=\"#9ad8ff\" stroke-width=\"1.4\"/><path d=\"M-5,-6 Q-7,-2 -6,2\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2\"/>",'光照過去，裡面空空的，只有一圈彩虹——是<b>藍色泡泡</b>。',{name:'藍色泡泡'}),petal102:IN('spin','🌀 轉一圈',DECOYART.petal102,DECOYART.petal102,'是一隻<b>紅色蝴蝶</b>。',{name:'紅色蝴蝶'}),stone102:IN('turn','🔄 轉過來看背面',DECOYART.stone102,"<rect x=\"-11\" y=\"11\" width=\"22\" height=\"5\" rx=\"1.5\" fill=\"#d8d2c4\"/><path d=\"M-8,11 Q-10,3 -6,-1 L6,-1 Q10,3 8,11Z\" fill=\"#e8e4da\"/><g transform=\"translate(-1,-2) scale(1.2,1.2)\"><path d=\"M0,0 Q-9,-9 -13,-3 Q-12,1 -8,1 Q-11,4 -6,6 Q-3,5 0,3Z\" fill=\"#f6f3ec\" stroke-width=\"1.2\"/></g><g transform=\"translate(1,-2) scale(-1.2,1.2)\"><path d=\"M0,0 Q-9,-9 -13,-3 Q-12,1 -8,1 Q-11,4 -6,6 Q-3,5 0,3Z\" fill=\"#f6f3ec\" stroke-width=\"1.2\"/></g><circle cx=\"0\" cy=\"-7\" r=\"6\" fill=\"#efece4\"/><path d=\"M5,-7 l4,1 l-4,1.4Z\" fill=\"#c9c2b2\" stroke-width=\"1\"/><path d=\"M-3,9 l3,4 l3,-4\" fill=\"none\" stroke=\"#c9c2b2\" stroke-width=\"1.2\"/><ellipse cx=\"0\" cy=\"-15\" rx=\"5\" ry=\"1.6\" fill=\"none\" stroke=\"#d6c48e\" stroke-width=\"1.4\"/>",'背後也有小翅膀，可是頭上有一張尖尖的鳥嘴——是<b>石雕小鳥</b>。',{name:'石雕小鳥'}),flow102:IN('spin','🌀 轉一圈',DECOYART.flow102,DECOYART.flow102,'是一個<b>奶油擠花點心</b>。',{name:'奶油擠花點心'})});
const DECOYS=[['bag102','ne102'],['bag102','sw102'],['btn102','nn102'],['btn102','se102','potF'],['petal102','e102'],['petal102','nw102'],['nut102','nw102'],['nut102','e102','leafF'],
 ['grape102','w102'],['grape102','ctr102'],['flow102','ne102'],['flow102','s102'],['stone102','sw102','bushF'],['stone102','nn102'],['puff102','se102'],['puff102','w102']];

/* ================= 人物 ================= */
/* 主角：1A 羽毛扁帽小探險家（綠扁帽＋白羽毛、藍短披風、斜背皮包） */
const HAT_HERO=HATS.push(v=>H.HATKIT.beretB('#3f6a4a')(v) /* 2026-11-23c 迷宮主角也換羽毛帽 B */)-1;
/* 入口的小男孩：扁帽不戴羽毛（藍色，和主角分得出來） */
const HAT_KIDB=HATS.push(v=>H.HATKIT.beretB('#2f5f9a',{noPlume:true})(v)+`<circle cx="${v==='side'||v==='back'||v==='bq'?-2:2}" cy="-55" r="2" fill="#2f5f9a" stroke-width="1"/>`)-1;
const HATS102={hero:HAT_HERO,kid:HAT_KIDB};H.HATS102=HATS102;
const HERO={skin:SKIN[1],hair:'#3a2a22',hs:0,hat:HAT_HERO,shirt:'#f4ecd6',pants:'#7a5a3a',top:'long',bottom:'shorts',mood:0};
const CAPE='#2f5f9a',BAGC='#8a6a44',STRAP='#6a4a2a';
const bagF=(x,y)=>`<rect x="${x}" y="${y}" width="7" height="6" rx="1.4" fill="${BAGC}" stroke-width="1.1"/>`;
const PCACHE={};
function playerArt(v,fr){const key=v+fr;if(PCACHE[key])return PCACHE[key];const pose=fr===0?'walk':'stand';
 let pre='',post='';
 if(v==='front'){pre=`<path d="M-9,-18 Q-14,-6 -12,-1 H12 Q14,-6 9,-18Z" fill="${CAPE}" stroke-width="1.4"/>`;post=`<path d="M-6,-17 L6,-7" fill="none" stroke="${STRAP}" stroke-width="1.8"/>`+bagF(4,-9)}
 else if(v==='fq'){pre=`<path d="M-11,-19 Q-17,-7 -14,-1 H4 Q2,-10 4,-19Z" fill="${CAPE}" stroke-width="1.4"/>`;post=`<path d="M-4,-17 L6,-8" fill="none" stroke="${STRAP}" stroke-width="1.8"/>`+bagF(4,-10)}
 else if(v==='side'){pre=`<path d="M-3,-18 Q-14,-8 -12,-1 L-2,-2Z" fill="${CAPE}" stroke-width="1.4"/>`;post=`<path d="M-2,-17 L3,-7" fill="none" stroke="${STRAP}" stroke-width="1.8"/>`+bagF(1,-9)}
 else if(v==='bq'){post=`<path d="M-9,-19 Q-13,-8 -11,-1 H9 Q11,-8 8,-19 Q0,-21 -9,-19Z" fill="${CAPE}" stroke-width="1.4"/><path d="M-4,-16 Q-5,-9 -4,-3 M3,-16 Q4,-9 3,-3" fill="none" stroke="#24497a" stroke-width="1"/>`}
 else{post=`<path d="M-9,-19 Q-13,-8 -12,-1 H12 Q13,-8 9,-19 Q0,-21 -9,-19Z" fill="${CAPE}" stroke-width="1.4"/><path d="M-4,-16 Q-5,-9 -4,-2 M4,-16 Q5,-9 4,-2" fill="none" stroke="#24497a" stroke-width="1"/><path d="M-7,-18 L7,-7" fill="none" stroke="${STRAP}" stroke-width="1.6" opacity=".7"/>`}
 return PCACHE[key]=`<g transform="scale(.85)">${pre}${kid({...HERO,view:v,pose,plain:true})}${post}</g>`}
/* 迷宮裡的人：宮廷院的貴族風，色彩柔和 */
const RICH=['#8e2630','#2f4f8a','#3f6a4a','#6a3f8a','#c99a3a','#7a3a5a','#1f5f6a','#a8502e','#b8667a','#7aa8c4'];
OUTFITS[N]=o=>{if(o.top)return o;o.top='long';o.bottom=o.bottom||'pants';o.shirt=o.shirt||pk(RICH);o.pants=o.pants||pk(['#3d3833','#4a3a2a','#2f2f3a','#5a4a3a']);o.skin=o.skin||pk([SKIN[0],SKIN[1],SKIN[1],SKIN[2]]);return o};

/* ================= 小故事：迷宮裡的小狗 ================= */
STORIES[N]={title:'迷宮裡的小狗',who:'小男孩',
 ask:'小男孩：我的小狗跑進迷宮了⋯\n牠戴著藍色項圈，上面有一顆小鈴鐺！',
 need:'小狗躲在落葉堆裡，怎麼叫都不肯出來⋯\n聽說迷宮西邊有個園丁爺爺，口袋裡總是放著餅乾。',
 got:'園丁爺爺：牠是餓了吧！拿這塊餅乾去，\n在牠面前搖一搖，牠就會自己跑出來囉。',
 ok:'小狗聞到餅乾的香味，搖著尾巴跑出來了！\n牠乖乖跟著你，快帶回去給入口的小男孩。'};
/* 2026-11-21w 使用者：迷宮裡的角色要和主角一樣縮到 80% */
const NPCS=.8,npc=svg=>`<g transform="scale(${NPCS})">${svg}</g>`;
const KIDC={x:cx(5)-80,y:LAWN.y1-120},DOGC={x:cx(10)-6,y:MY+60},OLDC={x:cx(2)-4,y:cy(5)-14};
const giverArt=()=>npc(act(0,0,1,{view:'fq',pose:'reach',hat:HAT_KIDB,hs:0,hair:'#6a4428',shirt:'#3f6fa8',top:'long',bottom:'shorts',pants:'#5a4a3a',skin:SKIN[1],mood:2,plain:true}));
const leafPile=(w=34)=>{let s='';const C_=['#c9862a','#d8a03a','#a8642a','#e0b44a','#b8762a'];for(let i=0;i<14;i++){const x=-w/2+((i*37)%100)/100*w,y=-((i*53)%100)/100*12;s+=`<path transform="translate(${f(x)},${f(y)}) rotate(${(i*47)%360})" d="M0,-5 Q4,-2 0,5 Q-4,-2 0,-5Z" fill="${C_[i%5]}" stroke-width=".9"/>`}return s};
const dogBody=(peek)=>`<ellipse cx="0" cy="1" rx="12" ry="3" fill="#000" opacity=".14" stroke="none"/>`+
 `<path d="M-12,-2 Q-14,-14 -2,-15 Q10,-15 10,-6 Q10,0 4,0 H-8 Q-12,0 -12,-2Z" fill="#e8d6b0"/><path d="M-12,-10 Q-18,-14 -17,-6" fill="none" stroke-width="1.8"/>`+
 `<path d="M-8,0 v4 M-3,0 v4 M3,0 v4 M7,0 v4" fill="none" stroke-width="2"/>`+
 `<circle cx="9" cy="-17" r="8" fill="#e8d6b0"/><path d="M3,-23 Q0,-26 1,-17 Q3,-16 5,-19Z M14,-24 Q18,-26 17,-17 Q15,-16 13,-19Z" fill="#a8763a" stroke-width="1.2"/>`+
 `<circle cx="7" cy="-18" r="1.2" fill="${OL}" stroke="none"/><circle cx="12" cy="-18" r="1.2" fill="${OL}" stroke="none"/><ellipse cx="10" cy="-14" rx="2" ry="1.4" fill="${OL}" stroke="none"/>`+
 `<path d="M3,-11 Q9,-8 15,-11" fill="none" stroke="#2f6fd0" stroke-width="2.6"/><circle cx="9" cy="-8.4" r="2.2" fill="#f5c842" stroke-width="1"/>`+
 (peek?`<g transform="translate(0,2)">${leafPile(36)}</g>`:'');
const dogArt=()=>npc(dogBody(true)),dogFree=()=>npc(dogBody(false));
const cookie=`<g transform="translate(12,-22)"><circle r="4.4" fill="#d8a05a" stroke-width="1.1"/><circle cx="-1.4" cy="-1" r=".8" fill="#6a4428" stroke="none"/><circle cx="1.6" cy="1" r=".8" fill="#6a4428" stroke="none"/></g>`;
const HAT_STRAW102=HATS.push(()=>`<ellipse cx="0" cy="-43" rx="21" ry="5" fill="#e8cf8a"/><path d="M-12,-44 Q-12,-57 0,-57 Q12,-57 12,-44Z" fill="#e8cf8a"/><path d="M-12,-46 Q0,-49 12,-46" fill="none" stroke="#5f8a4a" stroke-width="2.4"/>`)-1;
const apron=`<path d="M-6,-14 Q0,-12 6,-14 L7,-3 Q0,-1 -7,-3Z" fill="#4f8a3e" stroke-width="1.1"/>`;
const oldArt=()=>npc(act(0,0,1,{view:'fq',pose:'hold',hat:HAT_STRAW102,hs:3,hair:'#e8e4dc',beard:true,shirt:'#e8dcc0',pants:'#5a4a3a',top:'long',bottom:'pants',skin:SKIN[1],mood:1,plain:true,extra:apron+cookie}));
const barrow=()=>`<path d="M-26,-6 L18,-6 L14,-20 L-22,-20Z" fill="#8a6a44"/><path d="M-22,-20 L14,-20" fill="none" stroke="#6a4a2a" stroke-width="2"/>${leafPile(30).replace(/<path/g,'<path')}<circle cx="-18" cy="-3" r="6" fill="#5a4a3a"/><circle cx="-18" cy="-3" r="2" fill="#a8a090" stroke="none"/><path d="M18,-6 L30,-2 M14,-20 L30,-14" fill="none" stroke="#6a4a2a" stroke-width="2.4"/><path d="M8,-6 V0" fill="none" stroke-width="2"/>`;
const lerp=(a,b,k)=>a+(b-a)*k;
function moveEnt(e,tx,ty,ms,done){const x0=e.x,y0=e.y,t0=performance.now();const st=t=>{const k=Math.min(1,(t-t0)/ms),q=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;e.x=lerp(x0,tx,q);e.y=lerp(y0,ty,q);if(k<1)requestAnimationFrame(st);else done&&done()};requestAnimationFrame(st)}
const STORY={giver:KIDC,who0:'落葉堆裡露出一顆小狗的頭，戴著藍色項圈和小鈴鐺⋯好像有人在找牠。',busy:'園丁爺爺正在掃落葉⋯（也許之後會需要他幫忙）',
 thanks:{target:'小狗開心地「汪！」了一聲～',helper:'園丁爺爺：下次迷路了，就跟著牆上的白玫瑰走吧。'},
 reset(E){const ent=E.ent;Object.keys(ent).forEach(k=>delete ent[k]);
  ent.giver={role:'giver',x:KIDC.x,y:KIDC.y,w:24,h:53,block:true,bub:'？',art:giverArt};
  ent.target={role:'target',x:DOGC.x,y:DOGC.y,w:32,h:27,art:dogArt};
  ent.helper={role:'helper',x:OLDC.x,y:OLDC.y,w:27,h:53,block:true,art:oldArt,bub:''}},
 on:{
  /* 第 4 步：點小狗 → 小狗從落葉堆跑出來，跟著主角走 */
  3:(E,done)=>{const c=E.ent.target,P=E.P;H.burst(c.x,c.y-12);c._a=null;c.art=dogFree;c.drawn=null;E.redraw();try{H.tone(880,.1,'triangle',.06);H.tone(1047,.1,'triangle',.05,.1)}catch(_){}
   moveEnt(c,P.x+26,P.y+6,700,()=>{c.tick=(dt,P)=>{const d=Math.hypot(P.x-c.x,P.y-c.y);if(d>34){const k=Math.min(1,dt*4);c.x+=(P.x-c.x)*k*(1-30/d);c.y+=(P.y+4-c.y)*k*(1-30/d);c.fl=P.x<c.x}};done()})}},
 finish(E){const c=E.ent.target;c.tick=null;c.fl=false;moveEnt(c,KIDC.x+30,KIDC.y+4,700)}};

/* ================= 佈景 ================= */
const bench=()=>`<rect x="-26" y="-26" width="52" height="7" rx="2" fill="#fbf9f2"/><rect x="-26" y="-14" width="52" height="6" rx="2" fill="#fbf9f2"/><path d="M-22,-8 V0 M22,-8 V0 M-22,-19 V-14 M22,-19 V-14" fill="none" stroke-width="2.4"/>`;
const sitLegs=(c,x)=>`<rect x="${x-6.5}" y="-10" width="5.5" height="10" rx="2.6" fill="${c}"/><rect x="${x+1}" y="-10" width="5.5" height="10" rx="2.6" fill="${c}"/>`;
const sitter=(x,o)=>`<g transform="translate(${x},-6)">${kid({view:'front',pose:'stand',mood:1,...o})}</g>`;
/* 2026-11-21 使用者：坐著的人腳被長椅橫桿擋住 → 椅背、椅面 → 人 → 最後只畫兩端椅腳（同宮廷院 benchLegs） */
const benchWith=(people)=>`<rect x="-26" y="-26" width="52" height="7" rx="2" fill="#fbf9f2"/><path d="M-22,-19 V-14 M22,-19 V-14" fill="none" stroke-width="2.4"/><rect x="-26" y="-14" width="52" height="6" rx="2" fill="#fbf9f2"/>`+people+`<path d="M-22,-8 V0 M22,-8 V0" fill="none" stroke-width="2.4"/>`;
const urn=()=>`<path d="M-11,0 L-8,-6 H8 L11,0Z" fill="#d6d0c0"/><path d="M-6,-6 V-10 H6 V-6Z" fill="#e8e4da"/><path d="M-14,-10 Q-14,-26 0,-28 Q14,-26 14,-10Z" fill="#e8e4da"/><path d="M-15,-26 H15 V-30 H-15Z" fill="#d6d0c0"/>`+[[-8,-34,'#e86a9a'],[0,-38,'#f5c842'],[8,-34,'#e86a9a'],[-4,-32,'#fbf9f2'],[5,-31,'#a88ad8']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="4.4" fill="${c}" stroke-width="1"/>`).join('')+`<path d="M-12,-30 q-4,6 -2,12 M12,-30 q4,6 2,12" fill="none" stroke="#5f8a4a" stroke-width="1.6"/>`;
const flowerBed=()=>{let s=`<ellipse cx="0" cy="-8" rx="40" ry="16" fill="#8a6a44"/><ellipse cx="0" cy="-10" rx="36" ry="13" fill="#6a8a3a" stroke="none"/>`;
 const C_=['#e86a9a','#fbf9f2','#f5c842','#a88ad8','#d8413a'];for(let i=0;i<18;i++){const a=i*2.4,k=Math.sqrt((i+1)/18),x=Math.cos(a)*30*k,y=-10+Math.sin(a)*10*k;s+=`<circle cx="${f(x)}" cy="${f(y-4)}" r="4" fill="${C_[i%5]}" stroke-width="1"/>`}return s};
const birdBath=()=>`<path d="M-8,0 L-6,-6 H6 L8,0Z" fill="#d6d0c0"/><path d="M-3,-6 V-22 H3 V-6Z" fill="#e8e4da"/><ellipse cx="0" cy="-24" rx="18" ry="6" fill="#e8e4da"/><ellipse cx="0" cy="-25" rx="13" ry="3.6" fill="#9fd3e8" stroke="none"/><g transform="translate(9,-30)"><ellipse rx="5" ry="3.6" fill="#a8763a"/><circle cx="4" cy="-3" r="2.6" fill="#a8763a"/><path d="M6,-3 l3,1 l-3,1Z" fill="#f5c842" stroke-width=".8"/><circle cx="4.6" cy="-3.6" r=".6" fill="${OL}" stroke="none"/></g>`;
const picnic=()=>{let s=`<path d="M-40,-4 L-26,-30 L40,-28 L28,0Z" fill="#fbf2e4"/>`;for(let i=0;i<5;i++)s+=`<path d="M${-37+i*13},${-4+i*0} L${-23+i*13},-30" fill="none" stroke="#d8413a" stroke-width="2.2" opacity=".7"/>`;for(let i=0;i<3;i++)s+=`<path d="M${-33+i*2.5},${-11-i*7} L${34-i*2.5},${-9-i*7}" fill="none" stroke="#d8413a" stroke-width="2.2" opacity=".7"/>`;
 return s+`<g transform="translate(8,-12)"><path d="M-12,0 L-10,-12 H10 L12,0Z" fill="#c9a060"/><path d="M-8,-12 Q0,-24 8,-12" fill="none" stroke="#8a6a44" stroke-width="2"/><path d="M-10,-6 H10" fill="none" stroke="#a8803a" stroke-width="1"/></g><circle cx="-20" cy="-14" r="4" fill="#d8413a" stroke-width="1"/><circle cx="-14" cy="-10" r="4" fill="#e8c84a" stroke-width="1"/>`};
/* 中央：紫藤木棚架（使用者選 3D） */
const pergola=()=>{let s=`<ellipse cx="0" cy="4" rx="96" ry="22" fill="#cbb98e"/>`;
 const posts=[-76,-26,26,76];for(const x of posts)s+=`<rect x="${x-5}" y="-122" width="10" height="122" fill="#a07c52" stroke-width="1.4"/>`;
 s+=`<path d="M-96,-122 H96 V-132 H-96Z M-88,-136 H88 V-142 H-88Z" fill="#8a6a44"/>`;
 for(let x=-88;x<=88;x+=11){const a=(x*7+200)%13,b=(x*3+200)%17;s+=`<path d="M${x},-126 q-3,${22+a} 0,${36+b}" fill="none" stroke="#5f8a4a" stroke-width="1.4"/>`;for(let k=0;k<5;k++)s+=`<circle cx="${x+(k%2?2:-2)}" cy="${-118+k*7+((x*5+300)%9)}" r="3.4" fill="${k%2?'#a88ad8':'#8a6ac0'}" stroke="none"/>`}
 s+=`<path d="M-100,-132 Q-74,-152 -40,-138 Q0,-158 40,-138 Q74,-152 100,-132" fill="${GL}"/>`;
 for(let i=0;i<14;i++){const x=-90+i*14;s+=`<circle cx="${x}" cy="${-136+((i*7)%5)}" r="4" fill="${i%2?'#a88ad8':'#c4aaf0'}" stroke-width=".9"/>`}
 return s};
const mapDad=()=>T(-16,0,1,act(0,0,1,{view:'fq',pose:'hold',hat:-1,hs:1,mood:3,shirt:'#2f4f8a',extra:`<g transform="translate(12,-24) rotate(180)"><rect x="-8" y="-6" width="16" height="12" fill="${PARCH}" stroke-width="1.2"/><path d="M-5,-3 H0 V3 M3,-3 V2" fill="none" stroke="#5f8a4a" stroke-width="1"/></g>`},'nod'))+act(18,0,-1,{view:'fq',pose:'stand',hat:-1,hs:2,mood:0,shirt:'#b8667a',bottom:'pants'},'lean');
const couple=()=>act(-12,0,1,{view:'side',pose:'reach',hat:-1,hs:4,mood:1,shirt:'#7aa8c4'})+act(12,0,-1,{view:'side',pose:'reach',hat:-1,hs:1,mood:2,shirt:'#3f6a4a'});
const racers=()=>T(-12,0,.85,act(0,0,1,{view:'side',pose:'run',hat:-1,hs:3,mood:2,shirt:'#d8413a',bottom:'shorts'},'hop'))+T(16,4,.85,act(0,0,1,{view:'side',pose:'run',hat:-1,hs:0,mood:1,shirt:'#f5c842',bottom:'shorts'},'hop'));
const grandma=()=>benchWith(sitter(-10,{hat:-1,hs:3,hair:'#e8e4dc',shirt:'#6a3f8a',pants:'#6a3f8a',mood:0})+sitLegs('#6a3f8a',-10));
const violin=()=>act(0,0,1,{view:'fq',pose:'up',hat:-1,hs:1,mood:1,shirt:'#8e2630',extra:`<g transform="translate(9,-22) rotate(-30)"><ellipse rx="4" ry="7" fill="#a8502e" stroke-width="1"/><path d="M0,-7 V-14" fill="none" stroke-width="1.4"/></g><path d="M18,-30 L2,-12" fill="none" stroke="#c9b48a" stroke-width="1.4"/>`},'nod')+H.noteM(24,-58);
const dancers=()=>act(-11,0,1,{view:'fq',pose:'up',hat:-1,hs:3,mood:2,shirt:'#c99a3a'},'hop')+act(11,0,-1,{view:'fq',pose:'up',hat:-1,hs:4,mood:1,shirt:'#1f5f6a'},'hop');
const butterfly=()=>`<g transform="translate(0,-38)"><path d="M0,0 Q-8,-8 -9,-2 Q-8,3 0,0Z M0,0 Q8,-8 9,-2 Q8,3 0,0Z" fill="#f5c842" stroke-width="1"/><path d="M0,0 Q-6,5 -4,8 Q-1,7 0,0Z M0,0 Q6,5 4,8 Q1,7 0,0Z" fill="#f0a030" stroke-width="1"/></g>`;
/* 2026-11-21 使用者選 3D：放射狀葉片 */
const tuft=()=>[[-50,9],[-20,11],[20,11],[50,9],[0,8]].map(([a,h],i)=>`<path transform="rotate(${a})" d="M0,0 Q-2.6,${-h*.5} 0,${-h} Q2.6,${-h*.5} 0,0Z" fill="${i%2?'#6aa04a':'#5f9442'}" stroke-width="1"/>`).join('');
const flowers=()=>{const c=pk(['#fbf9f2','#e86a9a','#f5c842','#a88ad8']);return `<path d="M-5,0 l-1,-6 M0,0 v-8 M5,0 l1,-6" fill="none" stroke="#5f8a4a" stroke-width="1.3"/><circle cx="-6" cy="-7" r="2.6" fill="${c}" stroke-width=".9"/><circle cx="0" cy="-9" r="2.6" fill="${c}" stroke-width=".9"/><circle cx="6" cy="-7" r="2.6" fill="${c}" stroke-width=".9"/>`};
const petals=()=>{let s='';for(let i=0;i<4;i++)s+=`<path transform="translate(${ri(-10,10)},${ri(-4,0)}) rotate(${ri(0,180)})" d="M0,-3 Q2.4,0 0,3 Q-2.4,0 0,-3Z" fill="${pk(['#fbf9f2','#c4aaf0','#f4a0b4'])}" stroke="none"/>`;return s};
/* 可以翻開的東西：落葉堆、矮樹叢、花盆 */
const FK={
 leafF:{w:44,h:20,name:'落葉堆',empty:'只有乾乾的落葉，沙沙響⋯',fn:()=>`<ellipse cx="0" cy="-2" rx="22" ry="7" fill="#b8862a" opacity=".5" stroke="none"/><g transform="translate(0,-4)">${leafPile(40)}</g><g transform="translate(-2,-10) scale(.8)">${leafPile(30)}</g>`,open:()=>`<g opacity=".7">${leafPile(46).replace(/translate\(([-\d.]+),([-\d.]+)\)/g,(m,a,b)=>`translate(${f(a*1.4)},${f(b*.5+2)})`)}</g>`},
 bushF:{w:40,h:30,name:'矮樹叢',empty:'樹叢底下只有泥土和幾隻小螞蟻。',fn:()=>`<path d="M-18,0 Q-22,-16 -10,-22 Q-2,-32 8,-24 Q20,-22 18,-8 Q20,0 12,0Z" fill="${G}"/><path d="M-8,-18 q3,-3 6,0 M4,-14 q3,-3 6,0 M-12,-8 q3,-3 6,0" fill="none" stroke="${GD}" stroke-width="1.2"/>`+rose(6,-18,.8),open:()=>`<path d="M-20,0 Q-26,-10 -16,-16 Q-10,-10 -8,0Z M8,0 Q10,-12 20,-16 Q26,-8 20,0Z" fill="${G}"/><ellipse cx="0" cy="-2" rx="10" ry="3" fill="#8a6a44" stroke="none" opacity=".6"/>`},
 potF:{w:30,h:34,name:'花盆',empty:'花盆底下什麼也沒有。',fn:()=>`<path d="M-11,0 L-13,-18 H13 L11,0Z" fill="#c4654a"/><path d="M-14,-18 H14 V-22 H-14Z" fill="#b85a40"/>`+[[-6,-28,'#e86a9a'],[0,-31,'#fbf9f2'],[6,-27,'#f5c842']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="3.6" fill="${c}" stroke-width="1"/>`).join('')+`<path d="M-6,-22 v-4 M0,-22 v-6 M6,-22 v-3" fill="none" stroke="#5f8a4a" stroke-width="1.4"/>`,
  open:()=>`<g transform="translate(14,0) rotate(80)"><path d="M-11,0 L-13,-18 H13 L11,0Z" fill="#c4654a"/><path d="M-14,-18 H14 V-22 H-14Z" fill="#b85a40"/></g><ellipse cx="-4" cy="-2" rx="10" ry="3" fill="#8a6a44" stroke="none" opacity=".6"/>`}};

/* ================= 會竄出來的小動物（2026-11-21 使用者：加兩種，偶爾從迷宮叢裡竄出來讓玩家分心） =================
   小野兔：從主角附近一格的西側綠籬竄出來，跳過小路鑽進東側（或反過來）的綠籬。
   知更鳥：從主角附近一段綠籬頂上撲一下飛起來，斜斜飛出畫面。
   每 7～14 秒一次（兩種輪流），特寫卡、對話、過場時不出來。點到牠們會說一句話，不算點錯。 */
const rabbitArt=fr=>`<ellipse cx="0" cy="1" rx="11" ry="2.6" fill="#000" opacity=".15" stroke="none"/><g transform="translate(0,${fr?-5:0}) rotate(${fr?-8:0})"><path d="M-11,-2 Q-13,-13 -2,-14 Q8,-14 9,-6 Q9,0 3,0 H-8Z" fill="#b8a48a"/><circle cx="-11" cy="-8" r="3" fill="#fbf9f2" stroke-width="1"/>`+
 `<path d="M${fr?'-8,0 L-14,3':'-6,0 L-7,2'} M${fr?'4,0 L10,2':'3,0 L4,2'}" fill="none" stroke-width="2"/>`+
 `<circle cx="8" cy="-14" r="6" fill="#b8a48a"/><path d="M5,-18 Q1,-32 5,-31 Q9,-28 8,-19Z M9,-18 Q10,-31 14,-29 Q15,-24 11,-18Z" fill="#b8a48a" stroke-width="1.2"/><path d="M6,-20 Q4,-28 6,-28" fill="none" stroke="#e8b4a8" stroke-width="1.2"/><circle cx="10" cy="-15" r="1.1" fill="${OL}" stroke="none"/><circle cx="14" cy="-12.6" r=".9" fill="#d8838a" stroke="none"/></g>`;
const robinArt=fr=>`<g><path d="M-10,0 Q-12,-8 -2,-9 Q8,-9 9,-2 Q8,4 -2,4 Q-8,4 -10,0Z" fill="#7a6248"/><path d="M2,-6 Q9,-5 9,0 Q6,4 0,3Z" fill="#e8763a" stroke-width="1"/>`+
 `<path d="M-10,-2 L-17,-5 L-15,1Z" fill="#6a5238" stroke-width="1"/><circle cx="7" cy="-7" r="4.2" fill="#7a6248"/><path d="M11,-7 l4,1 l-4,1.6Z" fill="#e0b44a" stroke-width=".8"/><circle cx="8" cy="-8" r=".9" fill="${OL}" stroke="none"/>`+
 (fr?`<path d="M-4,-6 Q-8,-20 2,-22 Q2,-12 0,-6Z" fill="#8a7258" stroke-width="1.2"/>`:`<path d="M-4,-4 Q-10,6 -2,10 Q0,2 1,-3Z" fill="#8a7258" stroke-width="1.2"/>`)+`</g>`;
const leafBits=k=>[0,1,2,3,4].map(i=>{const a=-Math.PI*(.15+i*.17),d=8+k*34;return `<path transform="translate(${f(Math.cos(a)*d)},${f(Math.sin(a)*d+k*k*20)}) rotate(${i*70+k*200})" d="M0,-3.6 Q2.6,0 0,3.6 Q-2.6,0 0,-3.6Z" fill="${i%2?G:GL}" stroke-width=".8" opacity="${f(1-k)}"/>`}).join('');
const PET={wait:5,turn:0,a:null};
function petLayer(){let g=document.getElementById('pet102');if(!g){const A=document.getElementById('secA');if(!A)return null;g=document.createElementNS('http://www.w3.org/2000/svg','g');g.id='pet102';A.appendChild(g)}return g}
/* 2026-11-21w 使用者：小動物要從圍籬裡面鑽出來、再鑽進另一邊的圍籬（不是憑空出現、淡出）
   做法：用 clipPath 把「躲在綠籬裡」的部分切掉——兔子只在兩面直牆中間的小路上看得到；知更鳥在牆頂葉子線以下看不到 */
const PETS=NPCS;   /* 小動物也跟著縮到 80% */
const IN_=CELL/2-WT/2;   /* 格子中心到直牆內側的距離 */
function petStart(P){const near=[];
 if(PET.turn%2===0){/* 小野兔：主角附近、兩側都有直牆的格子，從一邊的綠籬鑽出來、跑過小路、鑽進另一邊 */
  for(let rr=0;rr<ROWS;rr++)for(let c=0;c<COLS;c++){const x=cx(c),y=MY+rr*CELL+60;if(Math.abs(x-P.x)>150||y<P.y-300||y>P.y+180||Math.hypot(x-P.x,y-P.y)<90)continue;
   if(rr>=4&&rr<=8&&c>=3&&c<=7)continue;const wW=c===0||E_[rr][c-1],wE=E_[rr][c];if(wW&&wE)near.push({x,y,dir:Math.random()<.5?1:-1})}
  if(near.length){const q=near[Math.floor(Math.random()*near.length)],dir=q.dir,o=IN_+18;
  return {kind:'rabbit',cx:q.x,x0:q.x-dir*o,x1:q.x+dir*o,y:q.y,dir,t:0,T:1.5}}}
 /* 知更鳥：從主角附近一段橫牆的葉子裡鑽出來，飛一小段，再鑽進附近另一段橫牆（或同一段的另一頭） */
 const HW=WALLS.filter(w=>w.h),top=w=>w.y0-HH+WT*.45;   /* 牆頂葉子線（頂面中間偏後）：鳥在這條線以下就藏在葉子裡 */
 for(const w of HW){const x=Math.max(w.x0+24,Math.min(w.x1-24,P.x+(Math.random()-.5)*260)),y=top(w);if(Math.abs(x-P.x)>150||y<P.y-320||y>P.y+60||Math.hypot(x-P.x,y-P.y)<90)continue;
  const ends=[];for(const v of HW){for(let t=0;t<6;t++){const xe=v.x0+24+Math.random()*Math.max(1,v.x1-v.x0-48),ye=top(v),d=Math.abs(xe-x);if(d<110||d>300||Math.abs(ye-y)>240)continue;if(Math.abs(xe-P.x)>220||ye<P.y-360||ye>P.y+80)continue;ends.push({w:v,x:xe,y:ye});break}}
  if(ends.length)near.push({w,x,y,e:ends[Math.floor(Math.random()*ends.length)]})}
 if(!near.length)return null;const q=near[Math.floor(Math.random()*near.length)];
 return {kind:'robin',w0:q.w,w1:q.e.w,x0:q.x,y0:q.y,x1:q.e.x,y1:q.e.y,dir:q.e.x>q.x?1:-1,t:0,T:2.2}}
/* 「綠籬以外都看得到」的 clipPath：大方塊挖掉一塊 */
const holeClip=(id,x,y,w,h)=>`<clipPath id="${id}"><path clip-rule="evenodd" d="M${f(x-2000)},${f(y-2000)} h4000 v4000 h-4000Z M${f(x)},${f(y)} h${f(w)} v${f(h)} h${f(-w)}Z"/></clipPath>`;
function petTick(dt,P){if(PET.a){const a=PET.a;a.t+=dt;const g=petLayer();if(!g)return;const k=Math.min(1,a.t/a.T);
  if(a.kind==='rabbit'){a.x=lerp(a.x0,a.x1,k);a.yy=a.y;const fr=Math.floor(a.t*8)%2;
   /* 只在兩面直牆中間的小路看得到 */
   g.innerHTML=`<clipPath id="pc102"><rect x="${f(a.cx-IN_)}" y="${f(a.y-80)}" width="${f(IN_*2)}" height="120"/></clipPath><g clip-path="url(#pc102)"><g transform="translate(${f(a.x)},${f(a.y)}) scale(${f(a.dir*1.2*PETS)},${f(1.2*PETS)})">${rabbitArt(fr)}</g></g>`+
    (k<.3?`<g transform="translate(${f(a.cx-a.dir*IN_)},${f(a.y-12)})">${leafBits(k/.3)}</g>`:'')+(k>.7?`<g transform="translate(${f(a.cx+a.dir*IN_)},${f(a.y-12)})">${leafBits((k-.7)/.3)}</g>`:'')}
  else{a.x=lerp(a.x0,a.x1,k);a.yy=lerp(a.y0,a.y1,k)+18-Math.sin(k*Math.PI)*150;   /* 起點、終點都在葉子線下面 18 → 鑽出來、鑽進去 */
   const fr=Math.floor(a.t*10)%2,w=k<.5?a.w0:a.w1,ly=k<.5?a.y0:a.y1,sc=1.3*PETS;
   g.innerHTML=holeClip('pc102',w.x0-6,ly,w.x1-w.x0+12,w.y1-ly+8)+`<g clip-path="url(#pc102)"><g transform="translate(${f(a.x)},${f(a.yy)}) scale(${f(a.dir*sc)},${f(sc)})">${robinArt(fr)}</g></g>`+
    (k<.25?`<g transform="translate(${f(a.x0)},${f(a.y0)})">${leafBits(k/.25)}</g>`:'')+(k>.75?`<g transform="translate(${f(a.x1)},${f(a.y1)})">${leafBits((k-.75)/.25)}</g>`:'')}
  if(k>=1){PET.a=null;g.innerHTML='';PET.wait=7+Math.random()*7}return}
 PET.wait-=dt;if(PET.wait>0)return;const a=petStart(P);if(!a){PET.wait=1.5;return}PET.turn++;PET.a=a;
 try{a.kind==='rabbit'?H.tone(1200,.05,'triangle',.03):(H.tone(1568,.06,'sine',.04),H.tone(1760,.06,'sine',.035,.08))}catch(_){}}
function petTap(x,y){const a=PET.a;if(!a)return false;const ay=a.kind==='rabbit'?a.yy-12:a.yy-4;if(Math.hypot(x-a.x,y-ay)>34)return false;
 H.toast(a.kind==='rabbit'?'🐇 小野兔一溜煙鑽進樹籬裡了！':'🐦 知更鳥啾啾叫了兩聲，飛走了～',1800);return true}
H.dbg.pet102=PET;
H.NGHOOKS.push(sc=>{PET.a=null;PET.wait=5;const g=document.getElementById('pet102');if(g)g.innerHTML=''});

/* ================= 場景 ================= */
const NAMES=[['ctr102','中央的紫藤棚架'],['ring102','中央外圍的環狀走道'],['nw102','迷宮西北角'],['nn102','迷宮北邊'],['ne102','迷宮東北角'],['w102','迷宮西邊'],['e102','迷宮東邊'],['sw102','迷宮西南角'],['se102','迷宮東南角'],['s102','迷宮南邊'],['lawn102','入口的草坪']];
const C={n:N,movers:[],start:{x:cx(5),y:LAWN.y1-100},startDir:6,speed:190,terrain,solids:[],flips:[],types:TYPES102,decoys:DECOYS,decoyT:DECOYT,decoyArt:DECOYART,inspect:INSPECT,inReg,anyReg:'any102',
 cloverHosts:new Set(['leafF','bushF','potF']),
 quick:new Set(['bow102','petal102','shut102','flow102','dand102','puff102']),
 thin:new Set(['tuft102','flw102','pet102','fly102']),
 tall:new Set(['hedge102','perg102','bench102','urn102','grp102','bath102','barrow102']),
 playerArt,story:STORY,itemSc:NPCS,   /* 2026-11-21w 使用者：圍籬以外的東西都跟主角一樣縮到 80% */
 
 clover:`<g transform="scale(${f(.85*NPCS)})"><path d="M0,2 Q2,10 -2,16" fill="none" stroke="#4f7a3a" stroke-width="2"/>${[0,90,180,270].map(a=>`<g transform="rotate(${a})"><path d="M0,0 C-7,-3 -9,-12 -3,-13 C-1,-13 0,-11 0,-10 C0,-11 1,-13 3,-13 C9,-12 7,-3 0,0Z" fill="#6fae4a"/></g>`).join('')}<circle r="2" fill="#f5c842" stroke-width="1"/></g>`,
 openArt:h=>npc(FK[h.kind].open()),flipName:h=>FK[h.kind].name,emptyMsg:h=>FK[h.kind].empty,
 where:(g,h)=>{const dx=h.x-g.x,dy=h.y-g.y,dirs=['東','東南','南','西南','西','西北','北','東北'],k=((Math.round(Math.atan2(dy,dx)/(Math.PI/4))%8)+8)%8;
  const reg=NAMES.find(([k_])=>{const g_=REG[k_];return h.x>=g_.x&&h.x<=g_.x+g_.w&&h.y>=g_.y&&h.y<=g_.y+g_.h});
  return `${reg?reg[1]:'迷宮裡'}的${FK[h.kind].name}底下（從這裡往${dirs[k]}走）`},
 /* 2026-11-21 使用者：隔著牆不能點選拿東西——主角腳底到東西之間有綠籬就拿不到 */
 canReach:(px,py,x,y)=>{const n=Math.ceil(Math.hypot(x-px,y-py)/8);for(let i=1;i<n;i++){const k=i/n;if(inWall(px+(x-px)*k,py+(y-py)*k,-2,-2,-2))return false}return true},
 blockMsg:'隔著綠籬拿不到⋯要繞過去才行',
 goal:{x:GOAL.x,y:GOAL.y,r:GOAL.r,msg:'東西都找齊了！\n走到迷宮中央的紫藤棚架，就能走出迷宮囉！',arrive:'🌸 走到迷宮中央了！紫藤花在頭上輕輕搖⋯'},
 tick:petTick,
 tapScene:(x,y)=>{if(petTap(x,y))return true;const s=H.view().s,tol=Math.max(0,14/s-10);
  for(const sp of H.sprites){if(!sp.say)continue;if(Math.abs(x-sp.x)<sp.w*.5+tol&&y<=sp.y+8+tol&&y>=sp.y-sp.h-8-tol){H.toast(sp.say,3200);try{H.tone(660,.08,'triangle',.05)}catch(_){}return true}}
  if(Math.abs(x-BACKGAP.x)<30&&y>BACKGAP.y-60&&y<BACKGAP.y+6){H.toast('剛剛就是從這個小缺口鑽進來的。\n（想回宮廷院，可以從選單打開冒險地圖）',3200);return true}
  return false},
 how:`<div><b style="font-size:22px">🕹️</b>左下角搖桿<br>走路</div><div><b style="font-size:22px">👆</b>走近東西<br>點一下拿起來</div><div><b style="font-size:22px">🍂</b>落葉堆、花盆<br>可以翻開</div><div><b style="font-size:22px">🌸</b>找齊後走到<br>中央的紫藤棚架</div>`,
 rule:'迷宮裡的東西要走近才拿得到，拿錯了只要放回去就好。全部找齊後，走到中央的紫藤棚架就過關。<br>幫頭上有「！」的人完成小故事，他會告訴你 🍀 幸運草藏在哪裡。（聽說還藏著別的秘密⋯）',
 homeBtn:'從小缺口鑽回宮廷院',homeNote:'綠籬牆上的小缺口，隨時可以再鑽進來'};
const E=H.SECRET.make(C);

Object.assign(KIND,{tuft102:{w:16,h:10,fn:tuft},flw102:{w:18,h:12,fn:flowers},pet102:{w:22,h:6,fn:petals},fly102:{w:20,h:44,fn:butterfly}});
H.ANIMX[N]={grp102:['lean'],fly102:['bob']};
H.HEAVYX[N]=new Set(['hedge102','perg102']);
const put=(x,y,w,h,kind,svg,o={})=>{const sp=add(x,y,w,h,kind,svg,{sh:.7,...o});if(o.solid)C.solids.push({x:x+(o.solid[2]||0),y:y-(o.solid[3]||0),rx:o.solid[0],ry:o.solid[1]});return sp};
const flipAt=(x,y,kind)=>{const K=FK[kind];if(!terrain(x,y)||inWall(x,y,30,20,14))return null;if(C.flips.some(h=>Math.hypot(h.x-x,h.y-y)<120))return null;if(!canPlace(x,y,K.w,K.h,false,.6))return null;
 const sp=put(x,y,K.w*NPCS,K.h*NPCS,kind,npc(K.fn()),{fl:r()<.5});const h={sp,kind,x,y,w:K.w*NPCS,h:K.h*NPCS};C.flips.push(h);C.solids.push({x,y,rx:K.w*.3*NPCS,ry:6*NPCS,flip:h});return h};   /* 落葉堆、矮樹叢、花盆也縮到 80% */   /* solid 記住是哪個 flip：翻開後可以跨過去 */
/* 格子 (r,c) 裡的位置：fx 0～1（西→東）、fy 0～1（北→南）；牆的正面在格子北邊，人和東西站在格子北半部才不會被南邊的牆擋住 */
const at=(rr,c,fx=.5,fy=.4)=>[MX+c*CELL+WT/2+(CELL-WT)*fx,MY+rr*CELL+WT/2+(CELL-WT)*fy];

function ground(){const NS_='stroke="none"';let s='';
 const X0=SC.x0-420,Y0=-420,W_=SC.x1-SC.x0+840,H_=SC.y1+840;
 /* 迷宮外面：滿滿的綠籬頂（2026-11-21 密葉 pattern；牆的 pattern hd102 也在這裡定義） */
 s+=hedgeDefs('hd102');
 s+=`<rect x="${X0}" y="${Y0}" width="${W_}" height="${H_}" fill="${HTOP[0]}" ${NS_}/><rect x="${X0}" y="${Y0}" width="${W_}" height="${H_}" fill="url(#hd102T)" ${NS_}/>`;
 /* 迷宮裡的碎石小路 */
 s+=`<rect x="${MX}" y="${MY-HH}" width="${MX1-MX}" height="${MY1-MY+HH}" fill="${PATH}" ${NS_}/>`;
 let pb='';for(let i=0;i<1500;i++){const x=sr(MX,MX1),y=sr(MY,MY1);pb+=`M${f(x)},${f(y)} h2 `}s+=`<path d="${pb}" fill="none" stroke="${PE}" stroke-width="2.2" stroke-linecap="round" opacity=".6"/>`;
 /* 牆腳的陰影：每一段牆正面下方淡淡一條 */
 for(const w of WALLS)if(w.h)s+=`<rect x="${f(w.x0)}" y="${f(w.y1)}" width="${f(w.x1-w.x0)}" height="8" fill="#000" opacity=".08" ${NS_}/>`;else s+=`<rect x="${f(w.x1)}" y="${f(w.y0-HH)}" width="7" height="${f(w.y1-w.y0)}" fill="#000" opacity=".07" ${NS_}/>`;
 /* 中央空地：圓形的碎石廣場、紫藤花瓣 */
 s+=`<ellipse cx="${GOAL.x}" cy="${GOAL.y-30}" rx="170" ry="120" fill="#ebe1c4" ${NS_}/><ellipse cx="${GOAL.x}" cy="${GOAL.y-30}" rx="170" ry="120" fill="none" stroke="#d6c89e" stroke-width="3" stroke-dasharray="6 8"/>`;
 /* 入口的草坪 */
 s+=`<rect x="${LAWN.x0}" y="${MY1-HH+WT}" width="${LAWN.x1-LAWN.x0}" height="${LAWN.y1-MY1+HH}" fill="${GRASS}" ${NS_}/>`;
 let tu='';for(let i=0;i<220;i++){const x=sr(LAWN.x0+10,LAWN.x1-10),y=sr(MY1+20,LAWN.y1-6);tu+=`M${f(x)},${f(y)} l-3,-6 M${f(x)},${f(y)} l3,-6 `}s+=`<path d="${tu}" fill="none" stroke="#7a9a45" stroke-width="1.3" opacity=".7"/>`;
 s+=`<path d="M${ENTR.x-60},${MY1+4} Q${ENTR.x},${MY1+60} ${BACKGAP.x},${LAWN.y1-6} L${BACKGAP.x+44},${LAWN.y1-6} Q${ENTR.x+40},${MY1+60} ${ENTR.x+60},${MY1+4}Z" fill="${PATH}" opacity=".85" ${NS_}/>`;
 return s}

function structures(){C.solids.length=0;C.flips.length=0;
 /* 綠籬牆 */
 for(const w of WALLS){const W=w.x1-w.x0,L=w.y1-w.y0,isEntr=w.h&&Math.abs(w.y0+WT/2-MY1)<2&&w.x0<ENTR.x&&w.x1>ENTR.x;
  put((w.x0+w.x1)/2,w.y1,W,(w.h?L:L)+HH+18,'hedge102',hedgeArt(w),{sh:1})}
 /* 迷宮入口兩側的圓球綠籬柱 */
 [ENTR.x-CELL/2,ENTR.x+CELL/2].forEach(x=>put(x,MY1+WT/2+2,WT+8,HH+40,'hedge102',leafWall(-WT/2-4,WT/2+4,-HH-WT-22,-HH-10,0,'hd102'),{mark:false}));   /* 迷宮入口兩側高一點的綠籬柱 */
 /* 草坪南邊：剛剛鑽進來的小缺口 */
 put(BACKGAP.x,BACKGAP.y+1,40,50,'gap102',`<path d="M-15,0 V-30 Q0,-46 15,-30 V0Z" fill="#1f3a18"/><path d="M-15,0 V-30 Q0,-46 15,-30 V0" fill="none" stroke="${GD}" stroke-width="3"/><circle cx="-17" cy="-6" r="6" fill="${G}"/><circle cx="17" cy="-10" r="6" fill="${G}"/>`,{mark:false});
 /* 中央：紫藤木棚架（點了花瓣飄） */
 {const S=NPCS;put(GOAL.x,GOAL.y,200*S,170*S,'perg102',npc(pergola()),{solid:[10*S,8*S,-76*S],mark:true});C.solids.push({x:GOAL.x-26*S,y:GOAL.y,rx:8*S,ry:6*S},{x:GOAL.x+26*S,y:GOAL.y,rx:8*S,ry:6*S},{x:GOAL.x+76*S,y:GOAL.y,rx:8*S,ry:6*S})}
 /* 死路的小空地 */
 const grp=(rr,c,fx,fy,w,h,svg,say,kind='grp102',solid=[16,8])=>{const [x,y]=at(rr,c,fx,fy);const sp=put(x,y,w,h,kind,svg,{solid});sp.say=say;return sp};
 const pgrp=(rr,c,fx,fy,w,h,svg,say,kind,solid=[16,8])=>grp(rr,c,fx,fy,w*NPCS,h*NPCS,npc(svg),say,kind,solid.map(v=>v*NPCS));   /* 人（和人坐的長椅）縮到 80% */
 pgrp(0,3,.5,.38,60,70,grandma(),'老奶奶：腳好痠⋯先坐一下，等一下再繼續找出口。','bench102',[26,8]);
 pgrp(1,6,.5,.42,84,48,flowerBed(),'（圓圓的小花壇，開滿了各種顏色的小花）','bed102',[36,10]);
 pgrp(3,7,.5,.4,34,44,urn(),'（白色的石甕，裡面種滿了花）','urn102',[12,6]);
 pgrp(11,5,.5,.4,34,44,urn(),'（白色的石甕，裡面種滿了花）','urn102',[12,6]);
 pgrp(3,9,.45,.45,40,44,birdBath(),'（小鳥在石盆裡洗澡，水花噴到你的臉上了！）','bath102',[16,6]);
 pgrp(2,0,.5,.42,84,40,picnic(),'（不知道是誰忘了收的野餐墊，籃子裡還有一顆蘋果）','pic102',[34,10]);
 pgrp(6,9,.5,.42,56,72,couple(),'女生：我們剛剛是不是經過這裡了？——男生：沒有吧⋯這面牆長得不一樣啊。');
 pgrp(9,1,.5,.42,56,64,racers(),'小朋友：誰先找到中間誰就贏！——另一個：可是我們好像跑錯方向了！');
 pgrp(12,3,.5,.4,60,72,mapDad(),'媽媽：地圖給我看⋯你拿反了啦！——爸爸：咦？難怪一直走到死路。');
 pgrp(10,7,.5,.4,60,70,benchWith(sitter(-11,{hat:-1,hs:2,mood:2,shirt:'#7aa8c4'})+sitLegs('#3d3833',-11)+sitter(11,{hat:-1,hs:1,mood:1,shirt:'#a8502e'})+sitLegs('#3d3833',11)),'兩個人：走了好久，在這裡休息一下⋯聽說中間有一座開滿紫色花的棚架！','bench102',[26,8]);
 pgrp(12,8,.5,.4,60,40,bench(),'（白色長椅，坐下來歇歇腳吧）','bench102',[26,8]);
 /* 環狀走道上一直繞圈圈的人（「摸牆走」的伏筆） */
 pgrp(8,3,.5,.35,30,66,act(0,0,1,{view:'side',pose:'reach',hat:-1,hs:0,mood:3,shirt:'#4a3a6a'},'nod'),'學者：我一直摸著右手邊的牆走，聽說這樣一定走得出去⋯怎麼又繞回這裡了？');
 /* 中央空地：拉小提琴的樂師、跳舞的人 */
 pgrp(5,4,.55,.5,40,70,violin(),'樂師：在紫藤花下拉琴，聲音特別好聽呢～');
 pgrp(7,6,.4,.25,56,70,dancers(),'跳舞的人：終於走到中間了！一起跳支舞吧！');
 /* 園丁爺爺的推車（故事幫手旁邊） */
 {const [x,y]=at(5,2,.2,.3);put(x-6,y,60*NPCS,36*NPCS,'barrow102',npc(barrow()),{solid:[22*NPCS,8*NPCS]})}
 /* 可以翻開的東西 */
  const try_=(rr,c,kind,fx,fy)=>{const [x,y]=at(rr,c,fx,fy);return flipAt(x,y,kind)};
 try_(0,10,'leafF',.25,.55);try_(10,2,'leafF',.5,.45);
 const plan=[['leafF',.5],['bushF',.3],['potF',.2]];
 let n=0;for(let t=0;t<800&&n<32;t++){const rr=ri(0,ROWS-1),c=ri(0,COLS-1);if(rr>=5&&rr<=7&&c>=4&&c<=6)continue;let q=r(),kind='leafF';for(const [k,w] of plan){q-=w;if(q<=0){kind=k;break}}
  if(try_(rr,c,kind,sr(.15,.85),sr(.25,.5)))n++}
 /* 中央棚架旁的花盆 */
 try_(6,4,'potF',.2,.3);try_(6,6,'potF',.8,.3);
}
function deco(reg,pool,tries,cap){const g=REG[reg],tot=pool.reduce((a,b)=>a+b[1],0);let n=0;
 for(let t=0;t<tries&&n<cap;t++){let q=r()*tot,kind=pool[0][0];for(const [k,w] of pool){q-=w;if(q<=0){kind=k;break}}
  const K=KIND[kind],x=sr(g.x,g.x+g.w),y=sr(g.y,g.y+g.h);if(!terrain(x,y))continue;if(!canPlace(x,y,K.w,K.h,false,.6))continue;
  add(x,y,K.w*NPCS,K.h*NPCS,kind,npc(K.fn()),{fl:r()<.5,sh:.6});n++}}   /* 小草、小花、花瓣、蝴蝶也縮 */
function scatter102(){
 deco('any102',[['tuft102',2],['flw102',1.6],['pet102',1.2]],4000,190);
 deco('ctr102',[['pet102',3],['flw102',1]],500,30);
 deco('lawn102',[['flw102',2],['tuft102',1.4]],400,26);
 deco('any102',[['fly102',1]],300,8)}
SCENE_IMPL[N]={ground,structures,scatter:scatter102};

/* ================= 冒險地圖、過場 ================= */
const mazePreview=()=>`<svg width="120" height="84" viewBox="0 0 120 84" aria-hidden="true"><rect width="120" height="84" fill="${GT}"/><g stroke="#2b2420" stroke-width="1.4" stroke-linejoin="round"><path d="M0,60 L44,40 V30 L0,44Z M120,60 L76,40 V30 L120,44Z" fill="${GD}"/><path d="M0,44 L44,30 H76 L120,44 V36 L76,24 H44 L0,36Z" fill="${GT}"/><path d="M44,40 H76 V30 H44Z" fill="${GD}"/><path d="M0,84 L44,40 H76 L120,84Z" fill="${PATH}"/></g><g fill="#a88ad8" stroke="none"><circle cx="56" cy="22" r="3"/><circle cx="62" cy="20" r="3"/><circle cx="68" cy="23" r="3"/></g><circle cx="20" cy="50" r="2.4" fill="#fbf9f2" stroke="none"/><circle cx="100" cy="52" r="2.4" fill="#fbf9f2" stroke="none"/></svg>`;
HERE[N]=[100,170];
if(NEXTINFO[N]&&!NEXTINFO[N].pv)NEXTINFO[N].pv=mazePreview;
H.mazePreview102=mazePreview;
/* 過場：綠籬牆上的小缺口越來越近、放大，鑽過去之後是兩面高綠籬夾著的小路 */
H.RIDES.maze102={text:'跟著小男孩，從綠籬的小缺口鑽進去⋯',every:520,tick:k=>H.tone(k%2?520:440,.08,'triangle',.04),svg:()=>{
 /* 2026-11-21w 過場卡頓：原本放大／淡出都做在 SVG 裡面的 g 上，滿畫面的葉子 pattern 每一格都要重畫（最大放大 9 倍），
    而且 1.1 秒建迷宮場景時 SVG 裡的動畫會停住。→ 拆成三張疊在一起的 <svg>，放大、淡出做在 <svg> 元素本身（will-change），
    瀏覽器把它當一張圖縮放，建場景時也能繼續動。 */
 const VB='viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"',GS=`stroke="${OL}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
 let s=`<style>
@keyframes gz102{0%{transform:scale(1);opacity:1}25%{transform:scale(1.9);opacity:1}45%{transform:scale(3.2);opacity:1}75%{transform:scale(5.6);opacity:0}100%{transform:scale(9);opacity:0}}
@keyframes cr102{0%{transform:translate(0,0) scale(1)}100%{transform:translate(0,-10%) scale(1.6)}}
@keyframes lf102{0%{transform:translate(0,-40px) rotate(0)}100%{transform:translate(40px,680px) rotate(540deg)}}
#ride svg.gz102{animation:gz102 4.2s ease-in forwards;transform-origin:50% 60%;will-change:transform,opacity}
#ride svg.cr102{animation:cr102 4.2s ease-in-out forwards;transform-origin:50% 50%;will-change:transform}.lf102{animation:lf102 3.4s linear infinite}
</style><svg class="cr102" ${VB}><g ${GS}>`;
 /* 後面：迷宮的小路（一點透視） */
 /* 2026-11-21 綠籬改成密葉（和迷宮裡一樣的 pattern，近的葉子比較大） */
 s+=`<defs>${leafPat('hrT102',HTOP,{seed:11,k:1.6})}${leafPat('hrF102',HFACE,{seed:23,k:1.8,lc:'#24461d'})}</defs>`;
 s+=`<g><rect width="400" height="600" fill="${HTOP[0]}" stroke="none"/><rect width="400" height="600" fill="url(#hrT102)" stroke="none"/><path d="M0,600 L170,300 H230 L400,600Z" fill="${PATH}"/>`;
 const sw=(d)=>`<path d="${d}" fill="${HFACE[0]}"/><path d="${d}" fill="url(#hrF102)" stroke="none"/>`;
 s+=sw('M0,0 L170,250 V300 L0,600Z')+sw('M400,0 L230,250 V300 L400,600Z')+sw('M170,250 H230 V300 H170Z');
 s+=`<path d="M-4,-6${bumps(-4,-6,170,250,.83,-.56,16,9)} L170,250 L-4,-6Z" fill="${HTOP[2]}" stroke="#2f5a26" stroke-width="1.2"/><path d="M404,-6${bumps(404,-6,230,250,-.83,-.56,16,9)} L230,250 L404,-6Z" fill="${HTOP[2]}" stroke="#2f5a26" stroke-width="1.2"/>`;
 s+=`<g fill="#a88ad8" stroke="none"><circle cx="192" cy="242" r="5"/><circle cx="202" cy="238" r="5"/><circle cx="212" cy="244" r="5"/></g></g></g></svg>`;
 /* 前面：綠籬牆上的小缺口，越來越大，最後淡掉 */
 s+=`<svg class="gz102" ${VB}><defs>${leafPat('hrH102',HFACE,{seed:31,k:2.6,lc:'#24461d'})}</defs><g ${GS}><path d="M-400,-400 H800 V1000 H-400Z M180,380 V340 Q200,318 220,340 V380Z" fill="${HFACE[0]}" fill-rule="evenodd"/><path d="M-400,-400 H800 V1000 H-400Z M180,380 V340 Q200,318 220,340 V380Z" fill="url(#hrH102)" fill-rule="evenodd" stroke="none"/><path d="M180,380 V340 Q200,318 220,340 V380" fill="none" stroke="#24461d" stroke-width="2.5"/></g></svg>`;
 /* 小男孩和主角（側面，往前走） */
 s+=`<svg ${VB}><g ${GS}>`;
 s+=`<g transform="translate(150,520)"><g class="an a-hop" style="--d:.6s">${kid({view:'bq',pose:'walk',hat:HAT_KIDB,hs:0,hair:'#6a4428',shirt:'#3f6fa8',pants:'#5a4a3a',top:'long',bottom:'shorts',skin:SKIN[1],mood:2,plain:true})}</g></g>`;
 s+=`<g transform="translate(238,560) scale(1.37)"><g class="an a-hop" style="--d:.66s">${playerArt('bq',0)}</g></g>`;   /* 主角圖縮到 .85 了，過場裡放回原本大小 */
 for(let i=0;i<6;i++)s+=`<g transform="translate(${40+i*60},0)"><g class="lf102" style="animation-delay:-${i*.6}s"><path d="M0,-5 Q4,-2 0,5 Q-4,-2 0,-5Z" fill="${i%2?'#6aa64e':'#a88ad8'}" stroke-width=".8"/></g></g>`;
 return s+`</g></svg>`}};

/* ================= 入口：第 18 關宮廷院（出發地載入時這個檔案會一起載入） =================
   宮廷院拿到 2 顆星後（測試模式下一直有）：西邊高綠籬牆正面（拱門原本的位置）出現一個小缺口，
   小男孩每隔 15～25 秒從缺口探頭 3 秒；點缺口（不管有沒有探頭）→ 小男孩探頭、跳出「要進去看看嗎？」。 */
(function(){
const NSv='http://www.w3.org/2000/svg';
const GAP={x:326,y:758};   /* 2026-11-26j 宮廷院綠籬牆往西移，缺口 610→326 */   /* 2026-11-21u 宮廷院綠籬牆往左上靠，缺口跟著搬 */   /* 宮廷院 MAZE.ax、MAZE.y1（綠籬牆正面的底部） */
const open18=()=>{try{if(H.testOn&&H.testOn())return true;return (+localStorage.getItem('townhunt-stars-L18')||0)>=2}catch(_){return false}};
let peekT=0,upT=0,anim=0,cur=0;
function layer(){let lo=document.getElementById('maze102L');if(!lo){const il=document.getElementById('itemsL');lo=document.createElementNS(NSv,'g');lo.id='maze102L';['stroke','stroke-width','stroke-linejoin','stroke-linecap'].forEach(a=>lo.setAttribute(a,il.getAttribute(a)));il.parentNode.insertBefore(lo,il)}return lo}
const kidPeek=()=>kid({view:'front',pose:'stand',hat:HAT_KIDB,hs:0,hair:'#6a4428',shirt:'#3f6fa8',pants:'#5a4a3a',top:'long',bottom:'shorts',skin:SKIN[1],arm:0,mood:2,plain:true});
/* 2026-11-21 使用者：探頭前看不到洞；小男孩是「從裡面往外」鑽出來（越來越大），不是由下往上；探頭時頭上卡著幾片樹葉 */
const headLeaves=`<g transform="translate(0,-52)">${[[-9,2,-30],[-2,-3,20],[6,1,60],[11,5,-10],[-13,7,40]].map(([x,y,a],i)=>`<path transform="translate(${x},${y}) rotate(${a})" d="M0,-5 Q4,-1 0,5 Q-4,-1 0,-5Z" fill="${i%2?'#6aa64e':'#4f8a3e'}" stroke-width="1"/>`).join('')}</g>`;
const rim=`${[[-24,-5,7],[24,-8,7],[-24,-28,6.5],[24,-31,6.5],[-15,-47,6],[15,-49,6],[-4,-55,5.5],[7,-56,5]].map(([x,y,r_])=>`<circle cx="${x}" cy="${y}" r="${r_}" fill="#4f8a3e"/><path d="M${x-3},${y+1} l2,-2.4 l2,2.4" fill="none" stroke="#2f5a26" stroke-width="1"/>`).join('')}`;
function draw(){const lo=layer();lo.innerHTML=`<g transform="translate(${GAP.x},${GAP.y})"><defs><clipPath id="gapc102"><rect x="-44" y="-96" width="88" height="96"/></clipPath></defs><g id="kid102" opacity="0"><g id="hole102"><path d="M-20,0 V-32 Q0,-58 20,-32 V0Z" fill="#1f3a18" stroke="none"/></g>`+
 `<g clip-path="url(#gapc102)"><g id="kidin102"><g>${kidPeek()}${headLeaves}</g></g></g><g id="rim102">${rim}</g></g></g>`;cur=0;show(0)}
function show(k){const g=document.getElementById('kid102');if(!g)return;const e=k<0?0:k>1?1:k,q=1-(1-e)*(1-e);
 g.setAttribute('opacity',e<.02?'0':'1');
 document.getElementById('hole102').setAttribute('transform',`translate(0,0) scale(${f(.2+.8*q)})`);
 document.getElementById('rim102').setAttribute('transform',`scale(${f(.3+.7*q)})`);
 document.getElementById('kidin102').setAttribute('transform',`translate(0,${f(-16+26*q)}) scale(${f(.45+.55*q)})`)}
function setUp(v,ms){cancelAnimationFrame(anim);const from=cur,to=v?1:0,D=ms||(v?520:420),t0=performance.now();
 const st=t=>{const k=Math.min(1,(t-t0)/D);cur=from+(to-from)*k;show(cur);if(k<1)anim=requestAnimationFrame(st)};anim=requestAnimationFrame(st)}
/* 每次縮回去之後，至少隔一段時間才再探頭（測試模式 6 秒，平常 15～25 秒），探頭 3 秒 */
function peek(){clearTimeout(peekT);if(H.scene()!==18||!document.getElementById('kid102'))return;
 const busy=!H.game().running||document.querySelector('.overlay:not(.hide)');
 if(!busy){setUp(true);clearTimeout(upT);upT=setTimeout(()=>setUp(false),3000)}
 peekT=setTimeout(peek,3000+(H.testOn&&H.testOn()?6000:sr(15000,25000)))}
H.NGHOOKS.push(sc=>{clearTimeout(peekT);clearTimeout(upT);cancelAnimationFrame(anim);const lo=document.getElementById('maze102L');if(lo)lo.innerHTML='';
 if(sc!==18||!open18()||!LEVELS[N])return;draw();peekT=setTimeout(peek,H.testOn&&H.testOn()?4000:sr(8000,14000))});
/* ---- 「要進去看看嗎？」對話框 ---- */
const ov=document.createElement('div');ov.className='overlay hide';ov.id='maze102Ov';document.body.appendChild(ov);
let pausedAt=0;const pause=()=>{if(pausedAt)return;pausedAt=performance.now();H.clockHold()},resume=()=>{const g=H.game();if(pausedAt&&g.running)g.t0+=performance.now()-pausedAt;pausedAt=0;H.clockRun(false)};
const been=()=>{try{return JSON.parse(localStorage.getItem('townhunt-been')||'[]').includes(N)||!!localStorage.getItem('townhunt-best-L'+N)}catch(_){return false}};
function ask(){pause();const can=!H.canDiscover||H.canDiscover(N);
 const pv=`<div style="width:120px;margin:0 auto 8px;border:2px solid #2b2420;border-radius:10px;overflow:hidden">${mazePreview()}</div>`;
 if(!can){ov.innerHTML=`<div class="pcard" style="padding:20px 18px 18px;text-align:center">${pv}<b style="font-size:21px;display:block;margin-bottom:6px">明天再出發吧</b><p style="margin:0 0 14px;font-size:15px;line-height:1.6">今天已經發現兩個新地方了，腳有點痠⋯<br>新的冒險明天再出發吧！走過的地方隨時都能回去玩。</p><button class="pbtn" id="m102ok">好</button></div>`;
  ov.classList.remove('hide');ov.querySelector('#m102ok').onclick=()=>{ov.classList.add('hide');resume()};return}
 const again=been();
 ov.innerHTML=`<div class="pcard" style="padding:20px 18px 18px;text-align:center">${pv}<b style="font-size:21px;display:block;margin-bottom:6px">${again?'要再鑽進去嗎？':'要進去看看嗎？'}</b><p style="margin:0 0 14px;font-size:15px;line-height:1.6">${again?'小男孩：樹籬後面的迷宮，隨時歡迎你再來玩！':'小男孩：我的小狗跑進迷宮了，<br>裡面的路彎來彎去⋯你要不要進去看看？'}</p><button class="pbtn" id="m102go">🌿 鑽進樹籬迷宮</button><div class="row2" style="display:flex;margin-top:10px"><button class="sbtn" id="m102wait">之後再說</button></div></div>`;
 ov.classList.remove('hide');
 ov.querySelector('#m102go').onclick=()=>{ov.classList.add('hide');pausedAt=0;setUp(false);H.goLevel(N,1)};
 ov.querySelector('#m102wait').onclick=()=>{ov.classList.add('hide');resume();setUp(false);H.toast('小男孩：好吧⋯想進來的時候，再來這裡找我！',2600)}}
const prevTap=H.TAPHOOKS[18];
H.TAPHOOKS[18]=(x,y)=>{if(H.scene()===18&&open18()&&document.getElementById('kid102')&&Math.abs(x-GAP.x)<34&&y>GAP.y-70&&y<GAP.y+10){
  clearTimeout(upT);setUp(true);try{H.tone(660,.08,'triangle',.06);H.tone(784,.1,'triangle',.05,.08)}catch(_){}setTimeout(ask,650);return true}
 return prevTap?prevTap(x,y):false};
H.dbg.maze102={GAP,peek,ask,open18,setUp};
})();
})();
