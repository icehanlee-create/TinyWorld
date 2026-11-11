# 奇幻小鎮大搜查：做關卡說明書（GUIDE.md）

給**分頭做關卡的 Claude** 看的。你讀不到原本的專案文件和 skill，需要的規則都整理在這裡。
版本：看同一個資料夾的 `VERSION.txt`。

---

## 0. 先看這裡

- **你的工作**：只做分到的那一關（主線第 6、7、8⋯關，或秘境 102、103⋯），**只寫 `level{n}.js` 一個程式檔**。
- **只交回兩個檔案**：`level{n}.js` 和 `notes-{n}.md`（格式見〈10. 交回〉）。其他檔案就算改了也不會被收回去。
- **不要改** `index.html`、`core.js`、`art.js`、`secret.js`、其他關卡的 `level*.js`。需要引擎新功能時，寫在 `notes-{n}.md` 的「需要引擎新增」，先用 level 檔裡自己的程式頂著，或先跟使用者說。
- `levels.js` 可以在**自己的資料夾**加一行來測試，但它不會被收回去：把那一行原封不動抄進 `notes-{n}.md`。
- **使用者**是遊戲的設計者，用**繁體中文（台灣用語）**溝通，習慣**先被問清楚再動手**：用選項題問，每題附推薦選項；大改動先給計畫，確認後再做。
- **省 token**：`core.js`、`art.js`、`level1～5.js`、`level101.js` 都很大，**不要整份讀**。用 grep／sed 照〈11. 工具速查〉的關鍵字找需要的那幾行。主線照 `templates/level-main-skeleton.js`（可以直接跑的骨架），真實例子看 `level5.js`；秘境看 `level101.js`。

---

## 1. 遊戲是什麼

手機**直向**玩的尋找物件遊戲。程式手繪插圖（SVG），大頭娃娃 Q 版角色，約 75% 會動。給一般大人休閒玩：**不要給玩家壓力，不要扼殺探索意願**。

| 編號 | 關卡 | 地理位置 | 怎麼去 |
|---|---|---|---|
| 1 | 奇幻小鎮 | 中間，南邊有港口 | 起點 |
| 2 | 東方農莊 | 小鎮往東 | 乾草車 |
| 3 | 雪山溫泉村 | 農莊往北 | 纜車 |
| 4 | 森林古代遺跡 | 雪山往西：雪地 → 叢林 → 遺跡 | 森林步道 |
| 5 | 海島港口 | 遺跡往東南走到小鎮港口，搭船往東南出海 | 小渡輪 |
| 101 | 復活島（海上秘境） | 第 5 關再往東南外海 | 擱淺帆船（第 5 關過關後才有入口） |

- **主線**每關 **12 種 × 4 個 = 48 個**物件，前面關卡的物件會當「老朋友」混進來，後面關卡的物件也會借幾種回前面關卡（`BORROW`）。過關拿到 2 顆星開放下一關。
- **秘境**不排進主線：從舊場景的入口進去，**8 種 × 3 個 = 24 個**，主角用搖桿走路找東西，過關「回到出發地」。
- 星星：1 全部找到、2 提示用 1 次以內、3 故事幸運草、隱藏第 4 星（綠色）＝隱藏幸運草。沒有時間限制，不要加時間壓力。
- 每關有一個**連環小故事**（5 步）和**兩株幸運草**（引擎自動藏，不用另外寫）。
- **地理方向很重要**：新關卡在冒險地圖上的位置、路線方向、過場裡人物走的方向和地形變化，都要和前一關的位置吻合，先跟使用者確認。
- 構想中的秘境：瀑布後的洞窟（礦山／魔法地底）、大樹裡的精靈世界、神殿下的地下城或古代神族、熱氣球上的雲朵世界。

---

## 2. 檔案說明

| 檔案 | 用途 | 你要做什麼 |
|---|---|---|
| `GUIDE.md` | 這份說明書 | 先讀完 |
| `VERSION.txt` | 引擎版本日期 | 抄進 notes |
| `templates/level-main-skeleton.js` | 主線關卡骨架，可以直接跑 | 主線從這裡開始 |
| `level{n}.js` | **你要寫的檔案** | 只寫這個 |
| `levels.js` | 關卡清單，一關一行 | 測試時自己加一行（不會收回） |
| `test.html` | 單關測試頁：`test.html?level=n` | 用它測 |
| `index.html` | 遊戲外框（版面、CSS、按鈕） | 唯讀 |
| `core.js` | 引擎（縮放、點擊、提示、星星、地圖、過場、載入關卡） | 唯讀，要查才 grep |
| `art.js` | 共用圖庫（人物、穿著、動物、樹、房子、道具、佈景圖鑑 `KIND`） | 唯讀，要查才 grep |
| `secret.js` | 秘境引擎（搖桿、鏡頭、特寫卡、翻開、箭頭） | 唯讀；做秘境才需要查 |
| `level1～8.js`、`sakura_common.js` | 已經做好的主線關卡（6～8 是櫻花山城） | 唯讀；測試頁要載入它們（老朋友物件在裡面），不用讀 |
| `level101.js` | 復活島秘境（含第 5 關的入口） | 唯讀；做秘境時當範本 |

**載入順序**：`index.html` → `core.js` → `art.js` → `levels.js` → `boot()` → 依序載入 `level1.js`～已解鎖的關卡 → 出發地已載入的秘境（`home`）。
所以：主線第 n 關載入時，第 1～n−1 關一定已經載好（可以拿老朋友物件）；秘境載入時，它的出發地一定已經載好。

**所有關卡檔的寫法**：整個檔案包在 `(function(){ … })();` 裡，第一行 `const H=window.TH;if(!H)return;`，工具都從 `H` 拿（`const {kid,act,add}=H;`）。不要宣告全域變數。

---

## 3. 工作流程

1. **讀**：這份 GUIDE、骨架（主線）或 `level101.js` 的結構（秘境），不要整份讀大檔。
2. **先問**（AskUserQuestion，每題附推薦）：
   - 過場方式、從哪個舊場景的入口進去、地圖上的位置（方位要合理）
   - 場景主要元素（可複選）
   - 物件比例（主線：舊＋新，越後面新物件越多；例如第 5 關是 2 種老朋友＋10 種新的）
   - 當地人的穿著與膚色（依氣候、地區風格）
3. **列草案，等使用者說「開始做」**：
   - **物件草案**：每種新物件配一個長得很像但分得出來的干擾物；標出哪幾種會借回前面關卡（`BORROW`，秘境預設不借）。
   - **小故事草案**（5 步：提問的人 → 走失的目標 → 幫手 → 目標 → 提問的人）：誰在找、找什麼（目標要有明顯配件）、目標遇到什麼麻煩、哪個幫手能幫忙（幫手要拿著看得出來的道具）、每一步的對白。
4. **視覺選項先出圖**：造型、配色、版面等主觀問題，用遊戲本身的畫法（`TH.kid`、`TH.T`⋯）在 Playwright 裡畫 **A～D 四個選項**的比較圖，存成 PNG 給使用者看。改既有造型時第一列放「現在的樣子」；每個選項除了放大圖，也放一張實際遊戲大小、旁邊擺熟悉角色（小豬、路人）的小圖。註明推薦哪個、為什麼，讓使用者回「1A、2 混用、3A+D」。
5. **寫程式**（〈5〉主線、〈6〉秘境），**遵守〈7〉〈8〉**。
6. **測試**（〈9〉），自己放大截圖看過各區。使用者常用手機截圖指出畫面問題，收到就直接修並截圖確認。
7. **交回**（〈10〉）。

---

## 4. levels.js 要加的一行

**主線**（`next` 是上一關過關時就要顯示的「下一站」預告，所以寫在這裡，不寫在 level 檔）：
```js
addLevel({n:6,title:'第 6 關．〔名稱〕',file:'level6.js',c:[〔開場鏡頭 x〕,〔y〕],
 map:{x:〔地圖 x〕,y:〔地圖 y〕,ic:'〔一個 emoji〕',name:'〔地圖上的名稱〕'},
 next:{pv:()=>`〔120×84 的 SVG 預覽圖〕`,btn:'〔按鈕：搭⋯出發〕',had:'〔已經去過時的說明〕',fresh:'〔第一次的說明〕',ride:'〔過場名稱，和 RIDES 一樣〕'},
 desc:'〔開始畫面說明：幾種老朋友加上 <b>幾種新東西</b>〕'});
```
- `c` 要和 level 檔 `H.SCENES[n].c` 一樣。`map.x／y` 是冒險地圖上的位置（2026-11-11 起向西加寬：viewBox `-120 0 462 430`，西邊是負的 x；西南角 x -120～0、y 300～430 是陸地，預留給沙漠；小鎮、農莊圖案縮成 70%），地圖上畫的東西寫在 level 檔（`H.mapHook`）。
- 預覽圖範例：`levels.js` 最下面的 `farmPreview`、`islandPreview`。

**秘境**（入口、地圖節點、預告都寫在秘境自己的檔案）：
```js
addLevel({n:102,secret:true,home:〔出發地關卡〕,per:3,title:'〔秘境．名稱〕',pre:'secret.js',file:'level102.js',c:[〔x〕,〔y〕]});
```

---

## 5. 主線關卡怎麼寫

從 `templates/level-main-skeleton.js` 複製成 `level{n}.js`，把 `N` 改掉，一段一段換成自己的內容。骨架用到的東西：

| 要登記的東西 | 寫法 | 說明 |
|---|---|---|
| 場景範圍 | `H.SCENES[N]={x0,x1,y1,c}` | 畫布**不要大於約 2620×3250**（iPhone 會破圖）。第 3～5 關用 x 500～2219 |
| 天空、邊緣 | `H.SKYC[N]`、`H.SKYY[N]`、`H.EDGEM[N]`、`H.EDGED[N]`、`H.EDGEDECO[N]`、`H.FRINGE[N]` | 場地外鏡像接地形、種當地植物；場地內靠邊漸疏 |
| 佈景密度 | `H.DENS[N]=1.33` | 場地大的關卡調高 |
| 穿著 | `OUTFITS[N]=o=>{if(o.top)return o;…;return o}` | 見〈7〉 |
| 物件圖 | `Object.assign(ART,{id:'<svg 內容>'})`、`Object.assign(DECOY,{…})` | 畫在 0,0 附近約 30×30 |
| 物件清單 | `LEVELS[N].types=[…12 種…]` | 每種 `{id,name,short,r,rot,regions:[4 個區域],float?}`；老朋友用 `{...typeOf('compass'),regions:[…]}` |
| 借回前面關卡 | `H.BORROW[N]=[['id',{1:[4 個區域],2:[…]}],…]` | 區域名稱看前面關卡的 `REG`（grep `Object.assign(REG` ） |
| 區域 | `Object.assign(REG,{name:{x,y,w,h}})`、`H.SCREG[N]=[…]` | 名字加上關卡編號，不要撞名 |
| 水 | `WATERFN[N]=(x,y)=>是不是水` | 物件和人不會擺到水裡；`KIND` 有 `water:true` 的才放水裡 |
| 場景 | `SCENE_IMPL[N]={ground,structures,scatter}` | `ground()` 回傳底圖 SVG 字串；`structures()` 用 `add()` 放建築；`scatter()` 用 `scatter(區域,POOL.x,次數,上限)` 撒佈景 |
| 佈景圖鑑 | `Object.assign(KIND,{kind:{w,h,fn:()=>SVG,water?}})`、`Object.assign(POOL,{…})` | 干擾物也要登記成 KIND 放進 POOL（`scatter` 會自動少放 30%） |
| 路人 | `Object.assign(VPLAN,{區域:{kind:數量}})` | 路人 kind：walker chat handInHand benchPair dogWalk petDog petCat feedChickens shepherd violin flute flowerWatch watering sweep carryBox painting reading kiteFly stretch sleeping jumpRope throwCatch chase |
| 幸運草藏身處 | `HOSTK.add('kind');HOSTN.kind='中文名'` | 新的可藏東西（例如珊瑚、漁網）才需要 |
| 小故事 | `STORIES[N]={title,who,giver,target,tw,th,helper,hw,hh,ask,need,got,ok}` | `giver／target／helper` 是回傳 SVG 的函式；`tw,th／hw,hh` 是寬高 |
| 冒險地圖 | `HERE[N]=[x,y]`、`H.mapHook(z,({U,P,ink,FN,f})=>SVG)` | 還沒解鎖（`U<N`）回傳 `''`；節點包 `<g class="mnode" data-n="N">` 才點得到；圖釘不能壓到名牌 **路線一律用 `H.mapRoute(d,'road'|'sea'|'rail',ink)`**（2026-11-11 使用者選「桌遊點點路」，不要自己畫路線樣式） |
| 過場 | `RIDES.名稱={text,every,tick:k=>tone(…),svg:()=>'<svg viewBox="0 0 400 600">…'}` | **每個新場景第一次前往一定要有過場** |
| 彩蛋（選做） | `H.TAPHOOKS[N]=(x,y)=>{…;return true}` | 點了會動的小互動，不算點錯（第 3 關白鼬、第 5 關燈塔光束） |
| 只用在這一關的動畫設定 | `H.ANIMX[N]={kind:['bob']}`、`H.ALWAYSX[N]=new Set([…])`、`H.HEAVYX[N]=new Set([…])` | **不要改共用的 `ANIM`／`ALWAYS`／`HEAVY`**，會影響別關 |

`add(x,y,w,h,kind,svg,{s,fl,sh,mark})`：放一個東西（x,y 是腳底中心），會自動佔位；`canPlace(x,y,w,h,水?,縮)` 先檢查有沒有空位。`T(x,y,縮放,內容,翻轉)` 包一層位移。`r() sr(a,b) ri(a,b) pk(陣列)` 是固定種子的亂數（每次進同一關場景一樣），場景請用這些，不要用 `Math.random`。

**伏筆**：新關卡的入口在前一關要有伏筆（路牌、洞口微光⋯），但你不能改前一關的檔案：在 notes 裡描述要放什麼、放哪裡，由主帳號加。

---

## 6. 秘境怎麼寫

以 `level101.js`（復活島）為範本，結構：常數與地形 → 物件、干擾物、特寫卡 → 可以翻開的東西 → 主角圖 → 小故事 → `const C={…};const E=H.SECRET.make(C);` → 佈景與擺設 → 冒險地圖、預告 → **入口（寫在最後，搜尋「入口：第 5 關」）**。

### 跟主線不一樣的地方（衝突時以這裡為準）
- **不排進主線**：用獨立編號，過關不解鎖下一關，星星另外存，不設 `BORROW`（要借先問）。過關畫面是「回到出發地」（`homeBtn`、`homeNote`）。
- **8 種 × 3 個**。下方清單同一種 3 個都找齊才打勾，不顯示數字。
- **操控**：左手虛擬搖桿走路（電腦可用方向鍵／WASD），鏡頭固定放大跟著主角，玩家不能縮小看全圖（測試模式的「全景」可以）。如果使用者覺得太麻煩，可改成「點物件，主角自己走過去」。
- **主角**：8 個方位用 5 張圖（front、fq、side、bq、back），往左的 3 個方位左右鏡像；斜前方：遠的手先畫（藏在身體後面），近的手畫在身體前面。
- **找東西**：要走近才拿得起來（`REACH`）→ 特寫卡檢查（轉背面 `turn`、翻面 `flip`、轉一圈 `spin`、放大鏡 `mag`、對著光 `light`）→「✓ 就是它／↩ 放回去」。**拿錯不扣分**，只說「好像不是這個」。
- **翻開**：草叢、石堆、木箱可以翻開，翻過留痕跡。物件可以藏在底下（「至少露出一半」的例外）。
- **提示**：燈泡改成主角頭上的方向箭頭，指向最近還沒找到的物件。
- **計時**：特寫卡和對話期間暫停（復活島已定案，照做）。
- **暗的秘境**（洞窟、地底）：主角周圍一圈亮光，畫在螢幕上的一層，用**半透明漸層**，不要用模糊濾鏡。這個引擎還沒有，寫進「需要引擎新增」，或先在自己檔案裡做一層。
- **會移動的生物**：`C.movers`（範圍函式 `ok(x,y)`、隨機轉彎、往左翻轉），不能卡在一小區。

### `H.SECRET.make(C)` 要給的欄位
`n`、`start{x,y}`、`startDir`、`speed`、`terrain(x,y)`（能不能走）、`solids[]`（`{x,y,rx,ry}` 擋路的東西）、`flips[]`、`types[]`（含 `spots:[[區域,藏身kind?],…]`）、`decoys`、`decoyT`、`decoyArt`、`inspect{id:{act,btn,front,after,note,lens?,name?}}`、`inReg`、`anyReg`、`cloverHosts`、`thin`、`tall`（走到後面會擋住主角的東西）、`playerArt(view,frame)`、`story{giver,reset,on{2,3},finish,who0,busy,thanks}`、`clover`、`openArt`、`flipName`、`emptyMsg`、`where`、`tapScene`、`how`、`rule`、`homeBtn`、`homeNote`、`movers`。每個欄位在 `level101.js` 都有實例（grep 欄位名稱）。

### 入口（寫在秘境自己的檔案）
出發地載入時你的檔案也會一起載入，所以入口直接寫在 `level{n}.js` 最後面，包在自己的 `(function(){…})();` 裡。照 `level101.js` 的入口段落：
- `H.NGHOOKS.push(sc=>{…})`：每局開始時呼叫（`sc` 是關卡編號，換場景時是 0），在出發地畫動態圖層（自己的 `<g id>`，插在 `#itemsL` 前後）。
- 包住出發地的點擊：`const old=H.TAPHOOKS[home];H.TAPHOOKS[home]=(x,y)=>{if(點到入口){…;return true}return old?old(x,y):false};`
- 預留位置（出發地的佈景、物件不會擺進去）：`(H.RESERVE[home]||(H.RESERVE[home]=[])).push([x,y,寬,高])`，引擎在出發地的 `structures` 之前就先佔好。
- 自己的進度 localStorage key（例如 `townhunt-cave`），並 `H.RESETKEYS.push('townhunt-cave')`。
- `RIDES.名稱` 過場、`H.NEXTINFO[n]={pv,btn,had,fresh,ride}`、`H.MAPNODES.push({n,x,y,ic,name})`、`HERE[n]`、冒險地圖秘境樣式畫在 `H.MAPTOP.push(…)`（紫色虛線航線、淡黃光圈；要可以點：`pointer-events="visiblePainted"` 和 `<g class="mnode" data-n="n">`）。
- 入口要等出發地過關後才出現（例：`localStorage.getItem('townhunt-best-L5')`）。

---

## 7. 必守規則（使用者累積下來的要求）

**玩法**
- 不顯示點錯次數，點錯不懲罰。開始畫面只用「聽說每一關還藏著別的秘密⋯」暗示隱藏幸運草，不要明講。
- 要找的物件**至少露出一半**。干擾物少而精，不要為了擺而擺。
- 區域之間**不能有大片空白**：除了各區 POOL，再加一個整張場景的裝飾區（`all{n}` + `POOL.decor{n}`），重要建築後方也要補東西。玩家最多只能縮回開場大小，看不到全圖，所以每一區都要經得起近看；水多的關卡把島、沙洲、棧道往中間靠。
- 魚或水邊物件**不要只放水裡**，也要放在攤位、漁船、籃子。漂浮物件（`float:true`）每局最多 3 個、同一種最多 1 個。
- 長對白用 toast（支援 `\n` 換行），確認手機上不會太長。
- 收集冊不分關卡：同一種物件只記一次，物件 id 不要和前面關卡重複（除非就是同一種東西）。

**畫風**
- 大頭娃娃 Q 版，黑色描邊 `OL`（#2b2420），約 75% 會動（`wrapAn`、`act(…,anim)`）。
- **路人用 `pickView()`** 混用 8 方向；雙人互動也要偶爾用 fq／bq。角色朝向要合理（滑雪往山下看、遠處的人縮小）。躺著的人要專門畫，不要把直立人物轉 90 度。
- **人物穿著要符合當地**：`OUTFITS[N]`。第 3 關雪山全員羽絨外套＋圍巾手套靴子；第 5 關膚色偏深、背心短袖短褲、玩沙小孩穿泳褲、不戴毛線帽。探險類角色戴遮陽探險盔（`HATS[6]`）。
- **人物動畫**（2026-11-11d，依活動選）：`act(x,y,方向,o,動作)` 的動作用 `'step'` 走路小碎步、`'nod'` 聊天／聽／吃／看地圖、`'work'` 掃地挖土打鼓等用力做事、`'bend'` 彎腰撿東西摸動物餵魚、`'groove'` 演奏溜冰、`'dance'` 跳舞、`'hop'`／`'cheer'`（較快）玩耍興奮、`'lean'` 站著等待賞花、`false` 坐著休息睡覺畫畫釣魚。**人物不要用 `'bob'`（上下浮動）**，舊的 bob／sway 會自動當成 lean。動物、船、旗子照舊。
- **頭上的驚嘆號徽章**（2026-11-11k，取代想念泡泡）：故事角色頭上由引擎自動畫**金色圓徽章＋白色「！」**（`H.qMark(y)`），全程不畫出要找的動物或幫手（使用者說看圖直接找會讓難度下降），完成後變愛心泡泡。你只要照常給 `STORIES[N]` 的 `target`／`helper`、`tw/th`、`hw/hh`。「有事想問玩家」的角色用同樣式的問號徽章 `H.qMark(y,'?')`（例：第 5 關望遠鏡小孩）。不要在頭上畫出物件或其他東西的圖，玩家會以為要找那個。
- **場景裡的看板不寫字**（2026-11-11 使用者要求）：招牌、路標、名牌一律畫圖示，不要用 `<text>`。共用圖示 `H.signIcon(名稱,縮放,x,y)`（art.js `SIGNICON`：farm、island、ruins、cable、onsen、ski（單板＋殘影）、town、fish、sakura、taiko、geta、foot、soldout、volcano、quarry、anchor），沒有合適的就自己畫。需要讓玩家知道名稱的（路標、地名牌），點了才跳出字：`add(…,{say:'往○○ →'})`，或在 inner 裡放 `<g data-say="…"></g>`（`signpost()` 已經內建）。店家招牌圖案看得懂就不用跳字。漫畫符號（z Z、頭上的 ?、♥）不算字。
- **和服**（2026-11-11 加在 art.js）：`o.top='kimono'`、`o.bottom='kimono'`，`o.kim` 樣式 `'A'` 振袖（長袖垂下、寬腰帶、小櫻花紋）／`'B'` 浴衣（直條紋、細腰帶）／`'C'` 和服＋深色羽織，`o.obi` 腰帶色、`o.pat` 花紋色，`o.shirt` 是和服底色；腳只露出白足袋＋木屐。寫法看 level6.js 的 `OUTFITS[N]`（約 7 成路人穿，羽織 C 佔一半）。
- **懸在空中的東西**（纜車、吊橋、繩索、雲橋）要畫在人物上面：`add()` 之後把它的 `y` 設成很大（`sp.y=1e6`，排序時就排到最後），第 3 關 grep `onTop`。
- 道具要一眼看得懂；房子要站得穩，屋頂不能看起來破洞、不能懸空。不要用「方形中間打 X」的木箱，改用補給箱（橫木條＋鐵護角）、皮箱。
- 區域交界自然融入（不要直直的石牆切開）；海邊或自然場景**不畫有框線的道路**，改用木棧道、沙紋、泥土小徑。水面上的東西少量。
- 動物畫成原創造型，不要做成有商標的角色。
- **不要用 SVG 模糊濾鏡**（手機會卡），光暈用半透明圓形。不要放大整個畫布。

---

## 8. 不要撞名（多個關卡同時開發）

所有關卡共用同一份 `KIND`、`POOL`、`REG`、`VPLAN`、`ART`、`DECOY`、`HOSTN`。撞名會蓋掉別關的東西，**別人的關卡會壞掉**。
- 新的 kind、區域、物件 id、POOL 名稱都**加上關卡編號**：`lantern6`、`town6`、`POOL.decor6`。
- 只想在自己關卡改既有 kind 的動畫：用 `H.ANIMX[N]`／`H.ALWAYSX[N]`／`H.HEAVYX[N]`，不要 `Object.assign(ANIM,…)`。
- DOM id、CSS class、localStorage key 也加上編號或秘境名稱。
- 共用的 kind（`pine`、`house`、`walker`⋯）直接用，不要重新定義。
- **主帳號合併時也會在舊關卡加東西**，所以拿到新工作包後，取名前先 `grep -n "名字" *.js` 查一次（例：第 8 關的鹿威原本叫 `skShishi`，和第 7 關合併時加的舞獅撞名，已改成 `skShishiOdo`）。
- 自己的測試：同一頁先 `?test=前一關`，再 `TH.goLevel(你的關卡)`，比對 `TH.KIND` 等登記表有沒有被改掉。

---

## 9. 測試

### 單關測試頁
- 用本機 http 伺服器開資料夾（`file://` 有些瀏覽器不能載入其他 js）。`test.html` 列出所有關卡；`test.html?level=6` 直接開到第 6 關。
- 進度只存在記憶體（不影響正式進度，重新整理就從頭開始），**測試模式自動打開**：無限提示、✓ 直接過關、選單裡有「🧪 找提問的人／找走失的目標／找幫手／找故事幸運草／找隱藏幸運草」，秘境還有「全景」。
- 測秘境：`test.html?level=102` 會先載出發地，再自動進秘境。測入口：`index.html?test={出發地}`。

### Playwright（手機尺寸 390×844，device_scale_factor 2）
```python
import threading, http.server, functools, socketserver, time
from playwright.sync_api import sync_playwright
def serve(root, port):  # 自己在 Python 裡開伺服器（背景的 http.server 可能會被停掉）
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=root)
    s = socketserver.ThreadingTCPServer(('127.0.0.1', port), h); s.daemon_threads = True
    threading.Thread(target=s.serve_forever, daemon=True).start()
serve('.', 8800)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    # 雲端環境連不到 Google 字型時，先擋掉（不然字型逾時會讓場景每次不一樣）
    pg.route('**/*', lambda r: r.abort() if 'fonts.g' in r.request.url else r.continue_())
    pg.goto('http://127.0.0.1:8800/test.html?level=6')
    pg.wait_for_function('window.TH&&!document.getElementById("loading")', timeout=20000)
    pg.click('#startBtn'); pg.wait_for_function('TH.game().running'); time.sleep(.5)
    print(len(pg.evaluate('TH.items()')), errs)
    pg.evaluate('TH.dbg.center(1200,1000)'); pg.screenshot(path='shot.png')
```
常用：`TH.items()`（物件，`{t,x,y,found}`）、`TH.dbg.storySp()`（giver／target／helper）、`TH.dbg.step()`、`TH.dbg.clover()`（`{story,bonus}`）、`TH.dbg.center(x,y)`（鏡頭移過去並回傳螢幕座標，可以拿來點）、`TH.goLevel(n)`、`TH.scene()`、`TH.level()`。秘境：`TH.dbg.secret[n]`：`set(x,y)`、`joy(vx,vy)`、`tap(x,y)`、`all()`、`real()`、`flips()`、`story()`、`clv()`、`card()`、`walkable(x,y)`、`screen(x,y)`；全景 `TH.SECRETS[n].pano(true)`。

### 至少要測
- 新關卡載入、物件數量對（主線 48、秘境 24）、**沒有 JS 錯誤**。
- 上一關過關 → 「下一站」預告 → 過場 → 進新關（主線：`test.html?level={n−1}` 按 ✓ 過關再按下一站）。
- 冒險地圖：新節點、卡片、可以點、圖釘沒壓到名牌、開關不疊面板。
- `BORROW`：前面關卡有混進你的物件。
- 小故事 5 步走完：完成前點不出故事幸運草；完成後有線索、會閃光、點得出來；隱藏幸運草找得到；過關畫面有綠色第 4 星；收集冊有記錄。
- 截圖檢查：走失的目標配件明顯、幫手的道具看得出來、提問的人頭上有「？」；拖到四個角落和各區放大看，沒有空白和破圖。
- 秘境另外測：搖桿 8 方向換對圖、撞到東西會停、每種物件的特寫卡和檢查動作、干擾物說「好像不是這個」、翻開、方向箭頭、從入口進去 → 過關 → 回到出發地、主線進度不受影響、390×780 下搖桿／清單／特寫卡不互相擋住。
- 第 1～5 關仍然正常（至少用 `test.html` 各開一次，看有沒有錯誤）。

---

## 10. 交回

只交回兩個檔案：
1. **`level{n}.js`**
2. **`notes-{n}.md`**，照這個格式：

```markdown
# 第 {n} 關〔名稱〕notes
- 引擎版本（VERSION.txt）：
- levels.js 要加的一行：（原封不動）
- 使用者定案的事：（玩法、物件、故事、穿著、地圖位置、過場⋯）
- 物件表：| 物件 ↔ 干擾物 | 區域 |
- 小故事：誰在找／目標／幫手／對白
- 需要前一關（或出發地）加的伏筆：
- 需要引擎新增：（沒有就寫「無」）
- 用到的新名字：kind、區域、POOL、localStorage key（檢查撞名用）
- 測過什麼：
- 還沒解決／之後可以做：
- 程式導覽：| 想改的東西 | 搜尋關鍵字 |
```

---

## 11. 工具速查（`window.TH`）

| 類別 | 名字 |
|---|---|
| 亂數、幾何 | `r` `sr` `ri` `pk` `shuffle` `rnd`（`Math.random`，不固定）`f`（四捨五入到 0.1）`chaikin`（平滑折線）`mulberry32` |
| 畫圖小工具 | `T(x,y,縮放,內容,翻轉)` `limb` `shade(色,±量)` `wob` `OL` `DK` `SNOW` `wrapAn(動作,內容,一定動?)` `heart` `bubble` `noteM` `qBubble` `bow` |
| 人物 | `kid(o)` `chibi(o)` `act(x,y,方向,o,動作)` `pickView` `walkPose` `peekHead` `faceHead` `headOnly` `SKIN` `HAIR` `SHIRT` `PANTS` `HATS` `OUTFITS` |
| 動物 | `cat(色)` `dog()` `anyDog()` `pig` `sheep` `chicken` `frog` `owl` `swan` |
| 植物、地形 | `pine` `pineS` `roundTree` `bush` `rock` `reeds` `lily` |
| 建築、道具 | `house(w,h,o)` `tower` `castle` `windmill` `mushHouse` `barn` `well` `fountain` `lighthouse` `stall(種類)` `tent(色)` `campfire` `fence` `bench` `sign` `signpost(字)` `lamp` `barrel` `crate` `pot` `balloon` `kayak` `rowboat` `sailboat` `ferry` `cabinSVG` `steamPuff` `swirl`（雲） |
| 擺放 | `add` `mark` `canPlace` `scatter` `skyBirds(關卡)` `SCATREG` `SCATOK` `sprites` `occ` `CELL` |
| 登記表 | `LEVELS` `SCENES` `SCREG` `REG` `POOL` `KIND` `VPLAN` `ART` `DECOY` `BORROW` `TARGET` `DENS` `SCENE_IMPL` `WATERFN` `STORIES` `HOSTK` `HOSTN` `SKYC` `SKYY` `EDGEM` `EDGED` `EDGEDECO` `EDGEMY` `EDGEFILL` `EDGELAND` `FRINGE` `FRINGEX` `ROADS` `ROADK` `ANIMX` `ALWAYSX` `HEAVYX` |
| 地圖、過場、入口 | `mapHook(z,fn)` `MAPHOOKS` `MAPTOP` `MAPNODES` `HERE` `NEXTINFO` `RIDES` `ride` `TAPHOOKS` `NGHOOKS` `RESERVE` `RESETKEYS` `SECRETS` |
| 遊戲狀態 | `typeOf(id)`（拿前面關卡的物件） `items()` `game()` `level()` `scene()` `view()` `goLevel(n)` `win()` `testOn()` `rodeHas(n)` |
| 畫面回饋 | `toast(字,毫秒)` `burst(x,y)` `floatText(x,y,字)` `sfx` `tone(頻率,秒,波形,音量,延遲)` `curtain` `clockHold` `clockRun` |
| 收集冊 | `colAdd` `colClover` `colBonus` `colStory` |

查原始碼：`grep -n "function kid" art.js`、`grep -n "^function scatter" core.js`。第 5 關的寫法：`grep -n "SCENE_IMPL\|Object.assign(VPLAN\|STORIES" level5.js`。
