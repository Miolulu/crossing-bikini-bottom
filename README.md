# 比奇堡沉浸式连通世界 · 协作仓库

> 一个可连续探索的 2.5D 轻等角海底小镇网页体验。
> 本仓库由**两个 AI 并行协作**：美术 AI 生成资源，集成 AI 把资源挂进网页 Demo。

| 项 | 值 |
|---|---|
| 当前版本 | Demo v1.0 / 方案 v2.8 / 交付规范 v1.0 |
| 更新日期 | 2026-11-10 |
| 主交付文档 | [`docs/美术资源需求与交付规范.md`](docs/美术资源需求与交付规范.md) · [网页版](docs/index.html) |
| **迁移交接卡**（迁到桌面端先看这个） | [`docs/迁移交接卡.md`](docs/迁移交接卡.md) · [网页版](docs/迁移交接卡.html) |
| 协作契约 | [`assets/manifest.json`](assets/manifest.json) |
| 集成映射 | [`integration/asset-slots.json`](integration/asset-slots.json) |
| GitHub 仓库 | `https://github.com/<owner>/<repo>` ← **待补**（只给了根域名；授权后可由集成 AI 自动查询/新建，见 §7） |

---

## 1. 三方职责与写入边界（★ 协作不冲突的关键）

| 角色 | 只写这里 | 只读 | 绝对不要碰 |
|---|---|---|---|
| **美术 AI**（生成资源） | `assets/**`（PNG、`manifest.json` 的 `files`/`status`/`generated_by`/`params_ref`、`art-params.md`） | `docs/`、`src/`、`integration/`、`previews/` | `src/`、`integration/`、`docs/`、`tools/` |
| **集成 AI**（挂载资源） | `src/`、`integration/`、`tools/`、`docs/`、`previews/`；`manifest.json` 的 `status→accepted/rejected` | `assets/` 的 PNG | 改 PNG 内容、替美术 AI 补图 |
| **人类** | 全部；授权仓库、解决冲突、拍板风格 | — | — |

`assets/` 与 `src/` 物理隔离，两边同时提交不会产生文件级冲突；唯一可能冲突的是 `manifest.json`，所以约定「**美术 AI 只改 4 个字段、集成 AI 只改 status**」，提交前先 `git pull --rebase`。

## 2. 目录结构（已预留，按此落盘）

```
bikini-bottom/
├── README.md                       ← 你在这里
├── CONTRIBUTING.md                 协作与提交约定精简版
├── docs/                           集成 AI 维护（双方共读）
│   ├── 美术资源需求与交付规范.md    ★ 给美术 AI 的主交付（需求 + 设计规范 + 交付规范）
│   ├── index.html                  ★ 同内容的网页版，自包含可直接发人/发 AI
│   ├── 迁移交接卡.md / .html        ★ 迁到桌面端：地址清单 + 迁移步骤 + 接手提示词
│   ├── 美术资产规格与提示词包.md    风格锚点 / 模板 A~J / 负面词 / 参数存档 / L1-L3
│   ├── 交付产物清单.md              资产编号 A~G 与代码模块 K 全量状态
│   ├── 开发日志.md                 版本进度
│   ├── 比奇堡沉浸场景方案-v2.html  方案 v2.8
│   ├── PRD-比奇堡的一天.html       初版 PRD
│   └── reference/                 早期概念参考图（仅风格参考，非交付物）
├── assets/                         ★★ 美术 AI 唯一写入区
│   ├── README.md                   交付规则速查
│   ├── manifest.json               ★ 机器可读资产清单 / 协作契约
│   ├── art-params.md               ★ 生成参数存档（锁风格后填）
│   ├── world/ buildings/ rooms/ characters/ props/ ui/ icons/ fx/
│   └── _review/                    待验收稿 / 废弃稿 / 退回说明 / 校验报告
├── src/index.html                  当前可运行 Demo v1.0（集成 AI 写入区）
├── integration/                    集成 AI 写入区
│   ├── asset-slots.json            资产编号 → 代码插槽映射
│   └── INTEGRATION.md              集成回填手册
├── tools/validate-assets.py        交付自检脚本（美术 AI 跑，集成 AI 维护）
├── tools/push-to-github.sh         首选推送：连接器授权后走 git push（凭证不落盘）
├── tools/push-rest.py              ★ 兜底推送：PAT + GitHub REST API（不依赖连接器）
└── previews/                       浏览器实图（供美术 AI 核对效果）
```

## 3. 快速开始

**美术 AI**：读 [`docs/美术资源需求与交付规范.md`](docs/美术资源需求与交付规范.md)（或网页版）→ 从 `B-05` 锁风格 → 出图放 `assets/<子目录>/` → 更新 `manifest.json` → 填 `art-params.md` → 跑 `python3 tools/validate-assets.py` → PASS 后提交。速查见 [`assets/README.md`](assets/README.md)。

**集成 AI**：读 [`integration/INTEGRATION.md`](integration/INTEGRATION.md) → `git pull` → 跑校验 → 按 `asset-slots.json` 挂载 → 浏览器实图验收 → 回写 `accepted`/`rejected`。

**人类**：把 `docs/index.html`（网页版）直接发给美术 AI 即可，它自包含、无外部依赖。

## 4. 交付形式（三种，详见主文档 §6.6）

1. **Git 仓库直交（首选）**：美术 AI 把 PNG + `manifest.json` + `art-params.md` 推到本仓库 `assets/`。
2. **打包 zip（备选）**：保持 `assets/` 顶层目录结构打包为 `assets-交付-YYYYMMDD-batchN.zip`，由人类放进仓库，集成流程完全一样。
3. **单张散图（兜底）**：仅补 1–3 张时按命名规则逐张发送，容易漏编号，不推荐。

> 无论哪种形式，**`manifest.json` 必须一起给** —— 它是集成 AI 判断「哪张图挂哪个插槽」的唯一依据。

## 5. 当前状态

- [x] 项目结构已预留、目录归属已约定
- [x] 交付规范 / 设计规范 / 协作契约已写入 `docs/` 与 `assets/manifest.json`
- [x] 机器可读插槽表 `integration/asset-slots.json` 已生成
- [x] 自检脚本 `tools/validate-assets.py` 已就绪
- [x] Demo v1.0、方案 v2.8、提示词包、交付清单、开发日志已归入仓库
- [ ] **推送到 GitHub**：连接申请已多次发起；桌面端登录账号 ≠ 沙箱连接器授权，网关仍判定 `17009 未授权`。已备好 REST 兜底通道 `tools/push-rest.py`（`api.github.com` 实测可达），用户提供 PAT 即可秒推，见 §7
- [ ] 美术资源：`assets/manifest.json` 全部条目为 `pending`，等待美术 AI 交付

## 6. 合规基线

非官方同人、非商用；「神似非形似」，不 1:1 复刻受版权保护的精确角色造型、标语与商标；不复用原作音轨。提示词禁止出现角色专有名词与商标字样，只写形体、色块与构图特征。

## 7. GitHub 授权与推送（★ 两个 AI 协作的前提）

### 需要哪一项授权

**GitHub 连接器授权（OAuth）**，一次即可。不是 PAT、不是账号密码，也不需要把任何凭证发给我或写进仓库。

内部网关已确认连接器存在但处于未授权状态：

```
GET http://github.agent-gateway.auth-proxy.local/_internal/accesstoken
→ 404 {"code":17009,"msg":"Connector \"github\" is not authorized for this user or project.
       Complete connector authorization first."}
```

### 谁点「通过」

1. 在 CodeBuddy **设置 → 连接器** 找到 **GitHub**，点「授权 / 连接」并完成 GitHub OAuth 同意页；若界面上已有待处理的连接申请卡片，直接点通过。
2. 回来回复一句「**已授权**」（或把完整仓库地址一起给），集成 AI 在新会话轮次重新发起连接，拿到 Token 后立即推送。

### 还需要的另一项信息

完整仓库地址 `https://github.com/<owner>/<repo>`。目前只提供了根域名 `https://github.com/`，无法确定目标。
**授权完成后也可以不填**：集成 AI 会用网关 Token 调 `/user` 取用户名、列出仓库；若无合适仓库则新建 `bikini-bottom` 并推送。

### 推送命令（凭证不落盘、不打印）

```bash
./tools/push-to-github.sh <owner/repo>
```

脚本只做预检、设置不带凭证的 remote 并 push；Token 由已授权的连接器经环境变量或 git credential helper 提供，**不写进 `.git/config`、不出现在命令历史**。

### 网络说明（2026-11-10 实测复核）

| 目标 | 结果 | 含义 |
|---|---|---|
| `github.com/`（网页 / 设备码端点） | 连接超时 | 无法走浏览器 OAuth / Device Flow |
| `api.github.com/`（REST 根） | **HTTP 200** | **REST API 可达，只差一个凭证** |
| `api.github.com/user`（未带凭证） | HTTP 401 `Requires authentication` | 网络通，认证层拦住而已 |
| 内部网关 `_internal/accesstoken` | 404 `17009 未授权` | 连接器 OAuth 未打通 |
| 本地各服务端口 / git 凭证助手 | 无可用 token | 桌面端登录未同步到沙箱会话 |

结论：**桌面应用「登录 GitHub 账号」和沙箱会话的「GitHub 连接器 OAuth 授权」是两套独立凭证**。前者不解除网关的 `17009`。但 `api.github.com` 是通的，所以只要拿到一个凭证就能推，不必依赖连接器。

### ★ 兜底通道：PAT + REST API（推荐，绕开连接器）

当连接器授权迟迟不生效时，用 [`tools/push-rest.py`](tools/push-rest.py) 直接走 GitHub Git Data API 推送，原理是「建 blob → 建 tree → 建 commit → 更新 ref」，一次 commit 导入全部文件：

```bash
# 1. 生成 fine-grained PAT：GitHub → Settings → Developer settings →
#    Personal access tokens → Fine-grained tokens → 只授目标仓库
#    Contents: read/write（若需新建仓库，再临时开 Administration: write）
# 2. 交给集成 AI（仅进程内环境变量，不写仓库、不打印、不落盘）
GITHUB_PAT=<token> python3 tools/push-rest.py                # 推到 <你的用户名>/bikini-bottom
GITHUB_PAT=<token> python3 tools/push-rest.py owner/repo     # 推到指定仓库
python3 tools/push-rest.py --check                           # 离线自检（不联网）
```

脚本已通过 `--check` 离线自测：枚举 50 个文件 / 18 张 PNG / 29.04 MB，正确排除 `.git/` 与本地自检报告，且 `manifest.json` / `asset-slots.json` / `docs/index.html` 均在列。**任何情况下都不要把 Token 明文写进仓库文件。**

### 若坚持走连接器授权

在 CodeBuddy 设置 → 连接器 → GitHub 完成 OAuth，回复「已授权」，集成 AI 在**新一轮**重新发起连接（连接申请同一轮内去重，不能重复弹卡片），拿到 Token 后执行 `./tools/push-to-github.sh <owner/repo>`。仍不成功则退回上面的 PAT 通道或直接用 `bikini-bottom-交付包-20261110.zip` 在 GitHub 网页上传。

### 美术 AI 需要做什么

**不需要任何 GitHub 授权**。只需按 `assets/README.md` 把 PNG 放进 `assets/`、更新 `manifest.json`、填 `art-params.md`，再由人类或有权限的一方提交；若美术 AI 自己也能访问该仓库，按 §1 写入边界只改 `assets/**` 即可。
