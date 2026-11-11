# 比奇堡 · 美术生成参数存档（当前有效批次 v5 · 手绘 2D + 轻等角）

> 美术 AI 维护 · 2026-11-11 · **复现与补图的唯一依据，未填不得批量**。
> 原文件为全「待填」空模板，无历史记录可保留，现由 v4 完整存档替代。
> **v5 相对 v4 的四处变更**（用户 2026-11-11 决议）：
> 1. **建筑 sprite 由 512 方画布改为按主体紧裁画布**（高统一 526px、主体占约 89%），修复 contain 缩放导致的「建筑偏小」；契约同步修订见 `docs/资产契约修订-v5.md`。
> 2. **角色立绘/头像 token 落地**：1 张六角色群像 → 程序化切分为 6×(512×768 立绘 + 256×256 圆形 token)，见 §八。
> 3. **表现层皮肤系统**：`skin.css` / `icons.js` / `skin.js` / `room-skins.js` 四文件承接 UI 重设计、emoji 清零、房间差异化与动效（见 §九）。
> 4. 资产校验脚本新增按文件名种类后缀的画幅覆盖（portrait 2:3 / token 1:1）。
> **v4 相对 v3 的三处变更**（同日早前决议）：
> 1. **A-01 改为「不含任何建筑」的纯背景大图**；六栋建筑由代码按 `buildings[]` 坐标贴图叠加。整景生成的形体永远对不齐独立 sprite，整景方案已废弃。
> 2. **房间 14 张用 v3 锁定锚点重出 1 张基础图 + 程序化换色派生**，替换旧 2.5D 画风。
> 3. 生图工具传空 `footnote` **仍会加水印**；水印一律后处理清除（不得改写锚点）。
> 历史：v1 绿底（废弃）→ v2 2.5D 微缩 → v3 手绘 2D 首批 → **v4 当前有效**。

---

## 一、风格锚点（逐字复用，一个字都不改）

```
hand-drawn 2D cartoon illustration shown in a loose light isometric 3/4 view, thick wobbly black ink outlines with visibly uneven line weight, flat opaque cel-vinyl paint with subtle watercolor grain and a slightly weathered hand-painted look, deliberately irregular lopsided bulbous shapes with no ruler-straight edges, quirky found-object architecture with hand-painted wood grain, rope and rivet details, mid-century tiki pattern accents, tropical undersea palette of turquoise, banana yellow, coral orange and earthy brown, plain solid background, subject facing right, aligned baseline, no text, no logo, no watermark, no shadow.
```

> **与 v2 的本质差异**：v2 锚点是 `light isometric 2.5D miniature diorama illustration, thick soft navy outlines...`，产出「精致 3D 微缩手办」；v4 是手绘语言。二者不是参数微调，**禁止混用**。
> **锚点保持不变**：`plain solid background` 逐字保留。工具 `background:transparent` 不生效，**不要为迁就工具改写锚点**；透明底一律后处理。
> **合规边界**：非官方同人、非商用、神似非形似、不 1:1 复刻；提示词不出现作品名 / 角色名 / 商标 / 招牌文字。

---

## 二、负面词（逐字复用，封死「3D 手办感」）

```
3D render, 3D lighting, glossy highlight, glass specular, gradient shading, bevel, ambient occlusion, plastic sheen, polished game icon, miniature diorama, smooth vector lines, perfectly symmetrical proportions, metallic reflection, photorealistic material, depth of field blur, shadow, cast shadow, contact shadow, glow effect, golden highlight, breathing halo, sparkle particles, text, letters, numbers, signage lettering, logo, trademark, watermark, signature, date, overlapping subjects, foreground occlusion, perspective distortion, noise, dirty edges, gray fringe, exact character replica, known cartoon character, ground plane, background clutter
```

---

## 三、主体句（每批只替换这一段；锚点与负面词不动）

**建筑统一尾部**
```
, deliberately asymmetrical and slightly wonky, no ruler-straight edges; only the building itself, no ground, no furniture, no characters, centered with 10% margin, clean uniform backdrop for cutout.
```

| 编号 | 主体句（v3/v4 共用，逐字） |
|---|---|
| B-01 | `A single squat yellow pineapple-shaped house with a rough diamond cross-hatch rind, a small green leaf crown, two round porthole windows with thick rings and a low arched door; banana yellow with earthy brown shading` + 统一尾部 |
| B-02 | `A single carved stone head house shaped like a weathered monolithic statue with a long nose, heavy brow ridge, two dark window eyes and a small door at the base; cool dusty blue-gray stone with chipped rough texture` + 统一尾部 |
| B-03 | `A single low half-dome brown rock house with a lumpy uneven surface, a small bent antenna on top, one round hatch opening and a few pebbles; warm reddish sand brown` + 统一尾部 |
| B-04 | `A single large clear glass hemispherical dome over one big leafy oak tree and a patch of grass, with a round metal airlock hatch and a few visible seam lines; pale green-blue glass and earthy green tree` + 统一尾部 |
| B-05（基准） | `A single short squat wooden crab-trap shaped seaside diner built from rough uneven planks, with a lopsided slanted roof, rope and fishing net details, two round porthole windows with thick rings, a crooked tall flag pole and a blank anchor-shaped sign frame with no lettering on it; weathered coral red and warm wood brown, deliberately asymmetrical and slightly wonky, no ruler-straight edges; only the building itself, no ground, no furniture, no characters, centered with 10% margin, clean uniform backdrop for cutout.` |
| B-06 | `A single tall dented metal bucket-shaped diner, wider at the top, with horizontal rivet bands, a bent chimney, one round porthole and a fist-like handle on top; cold gray and metallic blue` + 统一尾部 |

**v4 新增 · A-01 纯背景主体句（逐字）**
```
A complete wide EMPTY underwater town BACKDROP containing absolutely NO buildings and NO houses and NO characters and NO signs: upper area is open turquoise sea-water with a few soft abstract flower-shaped clouds and faint clusters of small bubbles, a few distant pale gray cylinder towers low on the horizon; lower two thirds is a gently rolling pale sand seabed with ONE wavy S-shaped sand path curving from the lower right across to the left, scattered simple bulbous kelp, small coral clumps and tiny pebbles along the edges; keep broad clear open sand areas across the middle band from left to right for separately placed building cutouts, no objects blocking the center; hand-painted weathered watercolor grain, flat even lighting, wide panoramic composition, clean uniform backdrop, no architecture, no furniture, no lettering.
```

**v4 新增 · 房间基础图主体句（逐字）**
```
A single hand-drawn isometric interior room of a seaside wooden diner: one uneven plank back wall with a carved anchor-shaped wood motif at its center and a partial lopsided archway on the right, a floor of loose wobbly 45-degree diamond tiles, a large completely empty floor area in the foreground for code-placed interactive props; cool sea blue and foam white with warm wood brown accents, deliberately asymmetrical and slightly wonky, no ruler-straight edges; no furniture, no characters, no lettering, no props; flat even lighting, plain solid muted sea-blue backdrop, wide 3/2 composition, clean uniform backdrop for cropping.
```

> **形体口径按原作纠正**（与主规范 §4.2 不一致，见 `_review/规范异议.md` 异议 5）：B-05 矮胖捕蟹笼木屋、B-06 冷灰金属桶、B-02 深蓝摩艾、B-04 玻璃罩 + 大橡树 + 草地。

---

## 四、生成参数与已验证的工具行为

| 项 | 值 |
|---|---|
| 平台 / 模型 | WorkBuddy ImageGen（高画质） |
| 尺寸 | 建筑 `1024x1024`；全景 / 房间 `1536x1024` |
| 画质 | `high` |
| 背景参数 | `background:opaque`；`background:transparent` **不生效**，实际出纯色底 |
| `footnote` | 传 `""` **仍会加右下角白色「AI生成 / WORKBUDDY」水印**，颜色随底色变化（白底→浅青灰 `(168,201,209)`，米白底→近白）。**不要靠改参数消水印，一律后处理** |
| 底色（实测） | 各张不统一：纯白 / 淡青 / 米白 / 青绿。抠底必须按四角自适应 |
| seed / 步数 | 工具未回传 / 托管不可见；补图须逐张人工验收 |
| 源图 | `generated-images/hand_drawn_2D_cartoon_illustra_2026-11-11T04-{21-19,27-38,28-03,28-26,28-53,29-18}.png`；v4 新增 `04-46-00`（房间）、`04-54-06`（纯背景） |

---

## 五、后处理流程（v4 · `l2_process.py` + `l3_process.py`）

1. **去水印**：右下角区域。白底 sprite 用局部中值（随后抠底整体变透明）；纯色底用「按水印色值的掩膜 `MaxFilter(9)` 膨胀 → 取上方 80px 真实背景像素覆盖」。**纯背景图的水印落在底部白毛边区，裁到 1.898:1 时会被自然切掉**。
2. **自适应底色连通域 flood fill**（关键）：从 `(0,0)` 起 `ImageDraw.floodfill(..., (255,0,255), thresh=30)`，只把**与边缘连通**的底色变透明。主体内部被黑色描边包住的浅色高光不与边缘连通 → 完整保留。**禁止按颜色直接抠底**。
3. **主连通块保留**：膨胀版主块保住叶冠 / 弯天线 / 旗杆；仅剔除通过膨胀桥接进来的 <200px 碎点。6 张建筑最终均为单连通块。
4. `GaussianBlur(0.5)` 轻微羽化。
5. 裁紧 → 按最长边 **80% 占比等比居中**（不拉伸）→ 导出三件套：`<ID>-<name>-right.png`（1×512 透明）/ `@2x`（2×1024）/ `-solid`（泡沫白底，仅供边缘复核）。
6. **A-01 纯背景不抠透明**：内缩 2% 去掉水彩纸毛边 → 裁到 `1.898:1`（上 25% 偏移）→ `2600×1370` 与 `5200×2740`。
7. **房间 14 张**：去水印 → 裁 `1200×760` → 按 6 主题换色 + 同栋局部明度小改 → 14 张。
   - **换色铁律**：背景用「四角连通域」定位后替换成主题底色（**不能按颜色距离**，否则蓝白地砖会被误判成背景，产生黄斑）；主体只在 `±0.06`（±22°）内微调 hue；`v<0.36` 的粗黑描边与 `v>0.80` 的白地砖保持原样。早期版本对全图做 ±0.5 hue 旋转，出现紫色墙 / 橙色地砖，已废弃。
8. **仓库校验**：`world/`/`rooms/` 的 PNG 需存成 **RGBA**（契约 `formats: PNG with alpha`），否则 `tools/validate-assets.py` 的 alpha 检查会报错；`spec.bg` 含 `solid` 的条目会跳过四角透明检查。

---

## 六、本批验收

| 项 | 结果 |
|---|---|
| `tools/validate-assets.py` | **61 条 / 实检 21 文件 / 0 错误 / 0 提醒 / PASS** |
| 本地六维自检 | 28/28 PASS：四角全透明、边距最小 10.0%、羽化 0.60–1.01%、角落水印 0 px、每张单连通块 |
| A-01 纯背景 | 2600×1370，无建筑、无文字水印、无白毛边；S 形沙路 / 花形云 / 海草珊瑚 / 远景塔 / 中部留白齐全 |
| 6 栋建筑 | 1×512 / 2×1024 / solid 三件套，叠中青底无白框 / 脏边 / 挖洞 |
| 房间 14 张 | 1200×760，6 主题底色区分明确，粗黑描边与白地砖保住，无水印 |

---

## 七、批量一致性约束

- 锚点（§一）与负面词（§二）**逐字复用**，每批只替换 §三 主体句；**不得改写锚点迁就工具**。
- **每张只抽 1 次、零重抽**；任何瑕疵只靠后处理修。
- **A-01 永远不含建筑**：背景只提供地形与装饰，六栋建筑是独立 sprite，由 `buildings[]` 坐标贴上去。
- 每张源图统一走 §五 流水线；旧稿一律归档不删除。
- `default=css` 的 58 张与 `code_only` 的 6 条**不排产生图**，见 `docs/交付产物清单.md`「不进图清单」。

---

## 八、v5 角色（1 次生图 → 程序化切分，零追加积分）

**源图（v5b，2026-11-11 二次重出）**：
- 群像 `hand_drawn_2D_cartoon_illustra_2026-11-11T06-19-03.png`（1536×1024，六角色横排）。v5 首版群像（05-24-17）被用户否决：海绵/章鱼无手、派大星无花裤衩 → 重出提示词在主体句中强制「EVERY character must have BOTH ARMS CLEARLY VISIBLE…four fingers」并给海星写明花裤衩。
- 派大星单人 `hand_drawn_2D_cartoon_illustra_2026-11-11T06-23-39.png`（1024×1536）。群像版派大星被用户否决「变成 7 角 + 脚上有脚趾」→ 教训：**给海星写「外伸手臂 + 四指手」必然撑出多余的角**，正确写法是「EXACTLY A FIVE POINTED STAR…NO hands NO fingers NO toes」，单人重出一次即过。

**切分脚本**：工作区 `recut_chars.py`（numpy + Pillow），要点：

1. 分列：以列墨量谷点为分界（`SPLITS=[325,555,845,1095,1360]`，谷点 ±6px 内取最小列作精确分界）。**蟹钳与珊迪尾巴在 x≈1090 处投影重叠，纯分列切不干净** → 每段只保留最大连通块（4 连通洪泛，种子取实心像素最底行的中位 x；种子不能取「掩膜最底像素」，会落在孤立半透明碎点上导致整图被清空）。
2. 派大星走 `SINGLE` 表单独从 1024×1536 单人图切分，不参与群像分列。
2. 白底转 alpha：不做整体阈值——`min(RGB)>232 且 max-min<22` 判白（alpha=0）；`min>205` 的过渡带给 alpha=130 软化锯齿；再清 alpha<26 碎边。
3. **立绘**：裁紧后等比缩到主体高 600，落位 `(512-nw)/2, 700-nh` → 512×768（2:3），透明边距 8.7%。
4. **token**：取全身顶部 52% 作头肩，等比缩到圆内可视直径 `0.74×画布`，**圆内垂直居中**；奶油底圆 `pad=21`（内缩 8.2%，满足边距告警线）+ 墨线描边 `width=10` → 256×256（规范 128 的 2×，供 92px 头像与高分屏）。

**接线**：`icons.js` 的 `CH` 表把 🧽⭐🐙🦀🐿️🦠 六 emoji 映射到 `D-0x-*-portrait.png`；HUD 徽章用 `D-02-sponge-token.png`。其余海洋邻居走 `BB_CHAR_SVG` 手绘 SVG 兜底。

---

## 九、v5 表现层皮肤系统（省积分的代码侧美术）

| 文件 | 职责 | 关键实现 |
|---|---|---|
| `src/skin.css` | 设计 token / UI 重设计 / 动效 | 调研 §7.1 色板落成 CSS 变量（`--ink #162C36`、`--water-mid #1FA5B8`、`--sand-base #EAC684`、`--banana #FBE34B`、`--ui-gold #F2C34E`…）；HUD 头像徽章+折叠说明、portal 手绘门牌、物件标签胶囊、10 组 keyframes（bbBob/bbSway/bbJellyFloat/bbCloudPulse/bbBubbleUp/bbRoomIn 等）+ `prefers-reduced-motion` 降级 |
| `src/icons.js` | 141 种 emoji → 手绘 SVG | 30 个 shape 函数 × 14 色槽 + 字符串哈希兜底；`BB_ICON/BB_CHAR/BB_CHAR_SVG` 三个导出；`skin.js` 用 TreeWalker 扫文本节点运行时替换 |
| `src/skin.js` | 运行时注入器 | `fixRoad()` 横向缓 S 弯、`buildWorldDeco()` 花云/水母/海草/石头/气泡 63 件程序化装饰、`applyRoom()` 房间变体（哈希缩放偏移 + multiply 色调）、`syncDepth()` 140ms 统一景深（替代旧 `1000-y`）、点击金色✦粒子、同人免责声明 |
| `src/room-skins.js` | 六套房间家具叠加层 | 每 theme 一张 `viewBox 0 0 1200 760` 内联 SVG；构图签名：蟹堡王木梁渔网旗串 / 凤梨屋舷窗锚饰菠萝床 / 摩艾画框蛤壳吊灯电梯门 / 石头屋半球岩石+CRT / 树屋气闸门+穹顶肋+橡树头盔 / 海之霸铆钉桶壁+齿轮电脑屏；中间交互区 `x∈[300,900]&y∈[260,560]` 强制留空 |

**契约红线**：四文件只做表现层，不改玩法数据结构与坐标契约（`asset-slots.json`、`window.__BB` 不动）；可整体回滚。

---

## 十、v7 房间物件精灵表（6 次生图 → 程序化切分，2026-11-11）

**源图**（`generated-images/`，均为 1536×1024、4×4 网格、quality high、背景 opaque）：

| 组 | 源图时间戳 | 内容 |
|---|---|---|
| P1 | 07-46-56 | 蟹堡王：取号机/叫号屏/收银机双态/菜单牌/小费罐/煎炉双态/锅铲正反/酱料瓶/饮料机/垃圾桶双态/冰箱/唱片机 |
| P2 | 07-47-21 | 办公室+章鱼哥家：保险柜双态/账本正反/船长画像/竖笛正反/小蜗/闹钟/台灯/沙发/坐垫/画架/画笔/黑胶/画具盘 |
| P3 | 07-47-47 | 菠萝屋+石头屋：菠萝床/舷窗/玻璃罐/糖罐/石头电视双态/水母网/菠萝摆件/牙刷/海螺/沙堡/铲子/报纸/曲奇/海星 |
| P4 | 07-48-15 | 树屋+环境：头盔/显微镜/杠铃/凯伦暗屏/船锚/救生圈/盐/咖啡杯/薯条/木桶/拖把/盆花/树桩/橡果/德州旗/气压表 |
| P5 | 07-48-46 | 海之霸+杂项：海霸糊桶/扫描仪/计划图/试管/传单/吧台凳/白板/终端/日历/杂志/床头柜/摩艾自画像/相框/木柜/圆石/芝麻 |
| P6 | 07-49-14 | 状态变体：点唱机/传菜窗/取餐台/迷你摩艾/机械臂/留声机/窗帘双态/台灯亮态/饮料机亮态/凯伦亮屏/金币/石电话/橡果罐 |

**主体句模板**（锚点 §一 / 负面词 §二 逐字复用，只替换主体句）：
```
A tidy 4x4 grid of exactly 16 separate hand-drawn cartoon props on one sheet, 4 rows by 4 columns,
every item centered inside its own roomy square cell with wide empty white gaps, items never touch
and never overlap, listed in reading order from left to right and top to bottom: 1) …; 2) …; … 16) ….
```
双态对（-off/-on、-closed/-open、-front/-back）在主体句中写成「the same X …（状态）」，除状态槽外描述逐字一致。

**切分脚本**：工作区 `cut_props.py`（run-labeling 连通域 + 行带 `cy//256` 排序 + 紧裁 + 256 方形画布 8.5% 边距）；
右下角 190×54 水印先涂白再转 alpha；连通域面积阈值 >3000px。
**落盘**：`deploy_props.py` 按映射表复制为 `assets/props/E-xx-*.png`（93 张，弃用 3 格：P3#7 纸帽误画、P6#13 鱼罐冗余、P6#15 橡果罐重复）。
**命名注意**：文件名不得含 `-portrait` 后缀（触发 2:3 立绘检查），画像命名用 `-captain_frame`。

**接线**：`skin.js` 的 `OBJ_SPR` 表按 `roomId|objId` 映射常态/`on`（开关亮态）/`open`（容器翻找后）三形态，
`syncObjState()` 挂在 140ms 心跳上，读取 `.on` class、`getRummageState()`、`quest.step`（收银机结账后开抽屉）自动换图；
无独立亮态的开关（点唱机/留声机/唱片机/机械臂/旗帜）用 `.bbFx` 浮动徽标（♪/⚙/≈）。
未命中映射的物件（蟹堡王帽）保持 icons.js SVG 兜底。`E-04-portrait` 已改名 `E-04-captain_frame`。

---

## 十一、蟹黄堡检视立绘（E-11）

**来源**：一次 3×2 图集出图 `A_tidy_3x2_grid_of_exactly_6_s_2026-11-11T09-09-00.png`（1536×1024，纯白底、无相框）。
第一张同构图（`…T09-07-47.png`）作废：AI 给每个汉堡套了**木质相框 + 米白底**，米白底不与画布边缘连通，
边缘洪泛清不掉，只能弃用。负面词补：`NO frame, NO border, NO wooden panel, NO plaque, NO backdrop board, NO vignette`。

**主体句**：
```
A tidy 3x2 grid of exactly 6 separate hand-drawn cartoon items on one sheet, 3 columns by 2 rows,
every item completely isolated in the middle of its own square cell with very wide empty plain white
space around it, nothing touching, nothing overlapping, each item floating alone with NO frame,
NO border, NO wooden panel, NO plaque, NO backdrop board, NO vignette, listed in reading order:
1) a whole krabby-patty style burger; 2) the same burger with two bites missing from the right side;
3) the same burger with a big bite gone from the right; 4) the same burger cut in half, left half only;
5) the same burger cut in half again, mostly eaten; 6) a small puddle of glossy pink sauce with a few
drips, no plate, no dish.
```

**切分**：工作区 `cut_burger.py`（3×2 直接按格裁 → 格内边缘洪泛 `near=225` → 紧裁 → 320 方形画布 7% 边距）。
**换色**：`recolor_burger.py` 把淡海藻绿面包 HLS 色相搬到 34°（烤面包金），
条件 `62°≤H≤170° 且 S<0.50 且 L>0.42`，保住生菜的饱和绿；输出覆盖 `assets/props/E-11-burger-0..3.png`。
**落盘**：`E-11-burger-0..3`（完整 → 两口 → 剩半个）+ `E-11-sauce`，统一 320×320 透明底。

**接线**：`#focus` 里原来的 5 个 CSS `div.layer` 已删除，换成 `<img id="bbBurgerImg">`；
`BURGER_STAGES` 数组 + `setBurgerStage(n)` 按 `biteCount` 换图，第 4 口吃光隐藏汉堡、显示 `E-11-sauce`
（`#secretSauce .pool img` 带呼吸光晕）。原来的 SVG `#biteClip` 圆形减法遮罩与 `BITE_SPOTS` 一并移除。

---

## 十二、v9 房间底图逐间重绘（G-01，14 张）

**为什么重出**：v8 的 14 间房是「一张底图换色 + 随机缩放/偏移/镜像 + room-skins.js 叠 SVG 家具」伪造出来的差异化，
实际像素平均差最小只有 5.7（chum_lab vs chum_counter），且前厅画成「普通木屋 + 铁锚」——没有柜台、没有船形桌椅、没有菜单牌。
用户拍板：**14 间全部重出**，每间一张独立手绘室内图。

**出图口径**：沿用 v5 美术锚点句（hand-drawn 2D cartoon illustration、厚描边、纸纹、暖色海盐质感），
每间主体句只换「房间功能 + 必须出现的家具」两槽，负面词封死 3D 手办感。
三间与标题不符的返工重出：`moai_f2`（首版画成卧室 → 改画架+画布堆）、`moai_f3`（首版画成储物阁楼 → 改斜顶床+天窗）、
`treedome_main`（首版没有实验台 → 改白色工作台+空白白板+橡树）。

**14 张时间戳（都是 1200×760 RGBA）**：
krusty_hall `09-31-49`／krusty_kitchen `09-32-26`／krusty_office `09-33-00`／moai_f1 `09-33-55`／
moai_f2 `09-48-32`／moai_f3 `09-49-07`／pineapple_main `09-35-25`／pineapple_kitchen `09-35-56`／
rock_main `09-36-30`／rock_under `09-36-55`／treedome_main `09-49-40`／treedome_airlock `09-38-03`／
chum_counter `09-38-28`／chum_lab `09-38-51`。

**后处理**（工作区 `process_rooms.py`）：
- `paper_mask = (min(RGB)>215) & (max-min<26)` 找出插画自带的纸白底/花边；
- `fill_paper()` 用 `np.roll` 四方向**最近邻扩散**逐圈填真实像素（早前用「邻域平均」会留斜向条纹）；
- `CROP` 内收比例（krusty_kitchen 0.11、pineapple_* 0.05）先切掉插图自带的边框；
- `TRIM` 在覆盖后二次裁切（krusty_kitchen `(0.015,0,0.012,0.12)`）——**镜像补边已弃用**，会留下对称复制的桌腿/地砖接缝。

**表现层同步改口径**（`skin.js` / `skin.css`）：
- `applyRoom()` 不再做随机 `backgroundSize`（1.00–1.25）/ `backgroundPosition` / 奇偶镜像，
  固定 `1200px 760px` + `0px 0px`，并移掉 `bbRoomTint` 主题色蒙版与 `bbRoomSkin` 的 SVG 家具层；
- `renderDecor()` 首行 `return`，代码家具（`counterBar`/`table`/`zoneTag`）全部停用——新底图里已经有柜台桌椅，再画就是双层家具。

**坐标系约定（重要）**：`#room` 固定 `1200×760`，`fitInterior()` 在 1440×900 下 `scale=1`，
所以**物件 CSS 坐标 = 底图像素坐标**。所有摆放集中在 `index.html` 的 `ROOM_POS` 覆盖表
（89 件物件 / 30 个座位 / 8 个 NPC / 17 个门梯），在 `ROOMS` 之后、`OBJECTS` 之前用 IIFE 覆写，避免手改长列表。
读坐标的方法：`qa_drive.py` 的 `#grid:<room>` 模式在 `#room` 内注入 100px 红网格 + 黄色坐标标签层（`z-index:999`），
1440×900 截图后按 `(120,88,1320,848)` 裁剪，得到的就是精确 1200×760。

**落地对齐**：物件用 `object-fit:contain` + `object-position:50% 100%`、`transform:scale(1.7)`、`transform-origin:50% 100%`，
底边不动往上长；`ground_props.py` 在每件物件底座下方 95px 内找最强的水平亮度阶跃（台面线），
给出 `dy`，加 22px 经验偏置写回 `ROOM_POS`（89 件里 53 件被修正），再对 13 处个别悬空/裁切/压住 UI 的做人工微调。

---

## 十三、G-14 居民立绘：文件名与画面校正

12 格居民群像一次出图后由 `cut_residents.py` 按位置切分，文件名是按「行带顺序」起的，
但实际画面与名字并非一一对应，导致出现「叫神仙鱼的其实是鲶鱼」。按实际画面对照后做了两件事：

1. **09↔10 内容互换**（两张图本身没画错，只是顺序错位）：交换后
   `G-14-09-seahorse_postal` 是戴水手帽、背邮包的海马；`G-14-10-catfish_farmer` 是留胡子、穿背带裤、戴草帽的鲶鱼。
2. **11/12 改名**（内容不动，只把文件名换成画面对应的名字）：
   `G-14-11-blowfish_grandma` 是圆鼓鼓的斑点河豚（卷发、粉裙、木勺）；
   `G-14-12-skay_mustache` 是贴地而卧、留着两撇胡子的魟鱼。

**代码侧**：`skin.js` 新增 `RES_BY_NAME`（名字 → 立绘）并按 `.nm` 文本查表，不再是 `Math.random()` 随机分配；
对话面板 `#dlgPortrait` 也走同一张表（`window.BB_RES_SPRITE`），并给六位主角接上 `D-0x-*-portrait`，
所以「画面上这只」和「对话框里这只」永远是同一个角色。居民名字同步改了两个：
`小丑鱼 → 神仙鱼`（对应 angelfish）、`海胆先生 → 海鲶先生`（对应 catfish，台词里的「刺」改成「胡子」）。

**顺带修的头像**：`D-05-krabs-token.png` 原来只露出眼柄和一截头，重做方式是从全身立绘条里
重裁蟹老板上半身（眼柄+头+蓝衬衫+钳子）再合成回原圆环内（`fix_krabs_token.py`），圆环与外描边保持不动。
