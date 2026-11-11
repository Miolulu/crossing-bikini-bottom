# 比奇堡 Demo v1.0 · 网页可优化点 / 玩法机制 / 美术落实审查

> 2026-11-11 · 审查对象：仓库 `src/index.html`（180,579 字节，单文件内联 CSS/JS，Demo v1.0）
> 对照：`docs/交付产物清单.md` K-01~K-41、`integration/INTEGRATION.md`、`integration/asset-slots.json`、`assets/manifest.json`
> 方法：完整 clone 后逐段读源码 + 静态数据流核对（非仅看截图）

---

## 〇、总评

| 维度 | 结论 |
|---|---|
| 代码交付物 K-01~K-41 | 清单标 **全部 ✅**（世界引擎 / 6 栋 14 房 / 8 类交互动词 / 27 彩蛋 / 分支对话 / 三处小玩法 / 155 项断言） |
| 玩法闭环 | 完整：进店 → 点餐四步 → 聚焦检视 → 翻找/旋转/开关 → 分支对话 → 坐下 → 换房 → 出门；三处小玩法有横幅/HUD/结算/退出四通道 |
| **美术资源落实** | **❌ 完全没落实**：全文只有 2 处 `url()`（蟹黄堡 `clipPath`、鱼网 SVG data-URI 光标），**没有任何 `assets/` 引用**。世界是 CSS 渐变、六栋是纯色块 div、14 房是 THEME 渐变、物件是 emoji、NPC 是色盘 |
| 契约状态 | `manifest.json` 61 条 `status` 全 `pending`；`INTEGRATION.md` 规定「`status != accepted` 不挂载」，所以严格按契约现在**本就不该挂** |

> 一句话：代码侧早已跑通，卡点是「资产没回写状态 + 插槽没接」。用户第 3 条问「美术资源和交互玩法是否落实到位」——**交互玩法到位，美术资源 0 挂载**。

---

## 一、挂载资产前必须先解决的 5 个阻塞点（否则图会被盖/重影）

| # | 位置 | 问题 | 建议改法 |
|---|---|---|---|
| 1 | L15-16 `#ground` | 不透明沙色渐变 `top:470px;height:900px`，会盖住 A-01 背景图 **y≥470 的 66% 画面** | 挂背景后把 `#ground` 改 `background:transparent;border-top:none`，仅保留定位；或直接移除该 div |
| 2 | L651-659 `#paths` SVG | 代码已画一条 S 形沙路；新 A-01 背景**自带** S 形沙路 → 两条路重影 | 隐藏 `#paths`（`display:none`），沙路完全交给背景图；若日后要视差再单独启用 |
| 3 | L662-672 `.deco` ×12 | 🪸🌿🎐🪨🐚🫧🐠 等 emoji 立体彩色装饰，与背景里手绘海草/珊瑚重复，且画风冲突 | 挂背景后隐藏 `.deco`（或只保留 🫧 气泡），手绘海草由背景图提供 |
| 4 | L20-25 `.building` | `border-radius:12px` + `box-shadow` 会把透明 PNG 裁成圆角并露出矩形阴影；`el.style.background=b.color` 是纯色块 | 改 `background-color:transparent` + `background-image:url(...)` + `contain/center bottom/no-repeat`；去圆角、去 box-shadow；`.door` 改透明只留热点 |
| 5 | L887-897 `buildings.forEach` | **没有 `data-bid` 属性**，而 `asset-slots.json` 的选择器是 `.building[data-bid='xxx']`，插槽无法定位 | 循环里补 `el.dataset.bid=b.id`（1 行） |

**房间挂载**：`INTEGRATION.md` L17 要求在 `#room` 上叠背景图、`background-size:1200px 760px`，`THEME` 渐变保留在底层兜底。注意 `#room .floor`（L129-134）是**不透明**菱格砖 CSS，会盖住新房间 PNG 的地砖 → 需把 `.floor` 改透明或改为 `background-image` 上层，否则两套菱格砖重叠。

---

## 二、景深与交互问题（换上不透明 PNG 后会被放大）

| # | 位置 | 问题 | 影响 |
|---|---|---|---|
| 6 | L891 `zIndex=1000-b.y` | 建筑 z 值 **210~440**；`#player` 固定 `z-index:50`、`.playspot` 30、`#garyWorld` 52、NPC `.actor` 未设 | 玩家/NPC/玩法场地**永远被建筑盖住**，走到建筑前面也不会压过它；挂上不透明 PNG 后变成"人被整栋楼吃掉" |
| 7 | 同上 | `1000-b.y` 是「y 越大 → z 越小」，即**越靠下的建筑层级越低**，与等角景深（越靠下/前越该在上）相反 | `asset-slots.json` 明确要求「z-index 保持 `1000-b.y` 不变」，属**契约层疑点**，不建议单方面改；建议连同玩家一起改成同一套动态公式 `1000 - Math.round(y)` 并同步改契约 |
| 8 | L1703-1707 `blocked()` | 碰撞盒用建筑矩形 `b.x-20 ~ b.x+b.w+20`；而 PNG 主体只占容器 80%（规范 8–12% 透明边距） | 视觉上是空地却走不过去，或贴边可穿模；挂图后需按实际主体包围盒收窄 |
| 9 | L1734-1738 `checkNearby()` | `PLAYSPOTS.forEach` 写在 `if(!nearBuilding)` 块**内部**；玩家从场地走到建筑门附近时，这一轮不执行 `classList.toggle('near',on)` | 场地的金色高亮圈 `.near` **状态残留不清除**；修法：把 `PLAYSPOTS.forEach` 提到 `if` 外，`on` 条件里保留 `!nearBuilding` |
| 10 | L1656 `keydown` | 吹泡泡的空格通道 `k===' '` 分支没有 `e.preventDefault()`（`blowBtn` 的 pointerdown 有） | 空格可能触发页面默认滚动/按钮激活；body 虽 `overflow:hidden`，仍建议补 |

---

## 三、玩法机制问题（非崩溃，属设计缺口）

| # | 位置 | 问题 | 建议 |
|---|---|---|---|
| 11 | L2786-2791 `catchJelly()` blue 分支 | 蓝色电水母只 `jellyScore.blue++` + toast「哎哟」，**不扣分、不扣时、不断连击**；HUD 却写「别碰蓝色电水母」 | 加实际代价：`MG.t=Math.max(0,MG.t-2)`（扣 2 秒）或 `jellyCaught=Math.max(0,jellyCaught-1)`，让提示与规则一致 |
| 12 | L2819 `setInterval(spawnJelly,820)` | 全局常驻定时器，页面生命周期内每 820ms 调一次，靠函数内 `MG.active` 早退 | 改为 `startMini` 时 `setInterval`、`exitMini/endMini` 时 `clearInterval`，省掉常驻空转 |
| 13 | L2695-2708 `endMini()` | 只 `clearInterval(MG.timer)` 与 `cfg.end()`；`cancelAnimationFrame(MG.blowRaf)` / `clearTimeout(KAR._t)` 依赖各 `end*` 自己清（目前 `endBubble`/`endKarate` 有清，但属隐式依赖） | 在 `endMini()` 里加通用兜底清理，避免以后新增玩法漏清导致结算后台继续 rAF |
| 14 | L2631 `checkGoal()` | 达标后只 toast，不结束会话（设计如此「剩下时间刷纪录」） | 没问题，但结算评级阈值（水母金牌 ≥15）高于目标 12，HUD 未说明，玩家易困惑；建议在目标文案里写清「金牌 15」 |

> 其余主流程（点餐四步、8 类动词、27 彩蛋、分支对话、四条出门通道、进屋自动 `exitMini`）从代码看是闭环的，且清单记录 155 项断言 0 报错，**未发现崩溃级问题**。

---

## 四、CSS 资产优化（用户要的「省积分」重点）

`manifest.json` 有 **58 张标 `default=css` + 6 条 `code_only` 严禁生图**，`docs/交付产物清单.md` 的「不进图清单」逐条点名。demo 里对应实现已存在，位置如下：

| 资产 | demo 实现 | 可优化点（0 积分） |
|---|---|---|
| E-01 蟹黄堡五层 + 咬痕 | L312-324 `.layer` 五层 + L643 SVG `clipPath evenodd` | ✅ 已是最优解，**不要生图** |
| G-08 鱼网光标 / 网挥动 | L426 data-URI SVG、L457 `.netSwing` | ✅ 保持 |
| F-15 出口门 | L215-233 `#exitDoor` 纯 CSS 拱门 + 金把手 | ✅ 已是纯几何、不依赖 emoji |
| G-02 portal | L342-355 `.portal` 蓝拱门 / 金阶梯 | 加粗黑描边变量即可，无需 G-02 PNG |
| G-07 三型水母 | L428-456 `.jelly` 伞盖+4 触须+眼睛 | ✅ 已纯 CSS，默认街上不出现 |
| G-10 三处场地 | L475-514 `.playspot .psArea` 渐变 + 虚线围栏 + 木牌 | ✅ 已纯 CSS，图内不写文字 |
| G-11 五段泡泡 | L563-570 `.bubblePreview.sh-*` 径向渐变 | ✅ 已纯 CSS |
| F-24/25/26 横幅 / HUD / 结算卡 | L534-556、L558-620 | ✅ 深蓝玻璃拟态纯 CSS |
| F-16/17/18/19 面板 | L383-421 翻找 / 旋转 / 藏品册 / 导航 | ✅ 纯 CSS，含文字兜底 |
| G-05 27 彩蛋图标 | L413-421 `#colGrid .cIc` 圆底 + 文字 | ✅ 圆底兜底，不生图 |
| D-10 六款 bot 小鱼 | L42-43 `.actor.bot` 虚线圆盘 | 代码换色即可，无需 6 张 |
| 12 个 `.deco` emoji | L662-672 | 挂背景后隐藏，避免与手绘海草重复 |

**统一手绘语言的最小改动（建议，0 积分）**：把全局描边色抽成一个 CSS 变量并替换现有细白/细金边：

```css
:root{ --ink:#12202b; --ink-w:3px; --paper:#f7f1e2; }
.obj, .portal, .seat, .psSign, #exitDoor .dIc, #colGrid .colItem,
#questHud, #dlg .box, .btn{ border:var(--ink-w) solid var(--ink); }
```

再叠加一层极轻的 SVG `feTurbulence` 颗粒滤镜做「水彩做旧」，就能让 CSS 占位与新手绘 2D PNG 在同一画面不串味 —— **全部不花积分**。

---

## 五、建议的整合顺序

1. 资产定稿 → 复制到仓库 `assets/`（21 张 + 三件套）。
2. 回写 `manifest.json`：21 条 `pending→delivered`，填 `generated_by` / `params_ref`；`code_only` 与 `default=css` 条目保持 `pending`（按 `INTEGRATION.md` L8-9 不挂载）。
3. 修 `integration/asset-slots.json` 的 `world.panorama.note`（改为「背景不含建筑」），同步 `docs/交付产物清单.md` A-01 描述。
4. 按 §一 的 5 点改 `src/index.html`：隐藏 `#ground/#paths/.deco`、建筑贴图 + `data-bid`、房间背景叠层。
5. 按 §二 修 #9（`near` 状态残留）、#10（空格 preventDefault），并把 #6/#7 景深疑点记入 `assets/_review/` 交由集成侧决策（涉及契约，不擅改）。
6. 跑 `python3 tools/validate-assets.py` → 浏览器实图验收（对照 `previews/`）→ 通过后 `status` 改 `accepted`。
7. 按 `docs/` 的 5 条规范异议统一修订风格结论，避免后续补图漂移。
