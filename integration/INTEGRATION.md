# 集成回填手册（集成 AI）

> 配套：[`asset-slots.json`](asset-slots.json)（机器可读插槽表）、[`../docs/美术资源需求与交付规范.md`](../docs/美术资源需求与交付规范.md) §7.5。

## 前置

- `src/index.html` = Demo v1.0，单文件，内联 CSS/JS。世界 `WORLD_W=2600, WORLD_H=1370`；房间画布 `#room` = 1200×760。
- 当前所有视觉为 CSS 几何 + 色块 + 文字占位。资源按编号替换占位，**未交付的插槽必须保持占位，不得破图**。
- 权威契约是 `assets/manifest.json`；`status != accepted` 的条目不挂载。

## 流程

1. `git pull --rebase`，读 `assets/manifest.json`，筛出 `status=delivered && code_only=false` 的条目。
2. `python3 tools/validate-assets.py`：检查文件齐全、命名、PNG alpha、宽高比、透明边距。
3. 按 `asset-slots.json` 的 `slot` 挂载：
   - `building.<id>` → `buildings[]` 生成的 `.building`：把纯色 `background` 换成 `background-image`（`contain`、`center bottom`），并给元素补 `data-bid` 属性便于定位。**`z-index = 1000 - b.y` 必须保持**，否则景深错乱。
   - `room.<roomKey>` → 在 `#room` 上叠一层背景图，`background-size: 1200px 760px`；`THEME` 渐变作为兜底保留在底层。
   - `npc.*` / `obj.*` / `portal.*` → 把 `.ic` 里的文字/emoji 占位换成 `<img>`，`object-fit: contain`。双态物件按 `toggleState` 切换 `src`；`rummage` 容器按开合态切换。
   - `ui.egg_icons` → 藏品册 27 格圆底图标；不交则保持 CSS 圆底 + 文字兜底。
   - 朝右素材原样；左向用 `transform: scaleX(-1)`，**不要求美术侧另出左向图**。
   - 有 `@2x` 文件时优先使用。
4. 浏览器实图验收：与 `previews/` 对照，确认
   - 无错位 / 无拉伸变形、宽高比正确
   - 透明底无灰黑脏边、无白框
   - 同房间内描边粗细 / 饱和度 / 等角角度一致，无风格串味
   - 交互热点、门、NPC、点餐动线未被新图层遮挡（必要时提升 `.obj` z-index 或给装饰层 `pointer-events:none`）
   - 交互高亮 / 呼吸发光 / 号码翻滚 / 引导气泡仍由 CSS 叠加，未写进 PNG
5. 通过 → `manifest.json` 该条目 `status=accepted`，截图存 `previews/`；不通过 → `status=rejected`，在 `assets/_review/退回说明.md` 写明原因与期望改法，通知美术 AI 重做。

## 状态回写规则

只把 `delivered` 改成 `accepted` 或 `rejected`，**不要改 `files` / `generated_by` / `params_ref` / `id` / `slot`**。每批提交前 `git pull --rebase`。

## 常见退回原因

| 现象 | 原因 | 期望改法 |
|---|---|---|
| 白框 / 灰边 | 非透明底或负面词漏了投影 / 接触阴影 | 重出透明底，逐字复用负面词 |
| 摆进房间高低乱跳 | 基线未齐平 | 同批主体底边对齐同一水平线 |
| 「亮」态有光晕 | 把发光画进了图 | 只改色块明度，光晕交给 CSS |
| 门牌 / 号码重影 | 把文字画进了图 | 图里零文字，HTML 渲染 |
| 同栋房间割裂 | 子房间换了色板或提示词 | 只改【主题】与【主题纹样】两个槽位 |

## 不要做

- 不要修改 `assets/` 里的 PNG 内容（重试请走 `rejected` 让美术 AI 重出）
- 不要替美术 AI 补图
- 不要把 `code_only: true` 的条目排产生图
- 不要在未验收前把 `status` 标成 `accepted`
