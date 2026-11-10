# 协作与提交约定（精简版）

完整版见 [`docs/美术资源需求与交付规范.md`](docs/美术资源需求与交付规范.md) §6 / §7。

## 写入边界

| 角色 | 可写 |
|---|---|
| 美术 AI | `assets/**`（含 `manifest.json` 的 `files` / `status` / `generated_by` / `params_ref` 四个字段、`art-params.md`） |
| 集成 AI | `src/**`、`integration/**`、`tools/**`、`docs/**`、`previews/**`；`manifest.json` 的 `status→accepted/rejected` |

**不要改对方的目录。** 对规范有异议：写 `assets/_review/规范异议.md`，由集成 AI 统一改 `docs/`。

## 交付三件套

1. PNG 放进 `assets/<子目录>/`，命名 `<编号>-<内部代号>[-<状态>][@2x].png`
2. 更新 `assets/manifest.json`：本批条目 `status: pending → delivered`，填 `files` / `generated_by` / `params_ref`
3. 填 `assets/art-params.md`：平台 / 模型 / 种子 / 步数 / 尺寸 / 完整提示词 / 负面词版本 / 抽检记录

跑 `python3 tools/validate-assets.py` 输出 PASS 才能标 `delivered`。

## 状态机

```
pending ──放文件 + 自检 PASS──▶ delivered ──集成验收──▶ accepted
                                    │                    └─▶ rejected（附原因，退回重做）
                                    └─（美术 AI 只改这 4 个字段）
```

## commit 约定

```
assets: deliver B-01..B-06 building exteriors (batch 1)
assets: params lock B-05 seed/model/steps
feat(integration): bind B-* building sprites
chore(manifest): accept batch 1 / reject E-03-grill (glow painted into PNG)
```

- 小批次直接推 `main`；>20 张开 `art/batch-N` 再合并
- 提交前 `git pull --rebase`；不 force push、不重写已 pushed 历史、不删废弃稿（`assets/_review/` 保留）

## 硬约束速记

透明底 PNG / sRGB · 8–12% 透明边距 · 基线齐平 · 统一朝右（左向由代码镜像）· 单图 ≤6 色 · 描边 `#062338` · **图内零文字 / 零数字 / 零 logo / 零发光 / 零投影** · 双态成对 · 风格锚点逐字复用。
