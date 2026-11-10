#!/usr/bin/env bash
# 推送 bikini-bottom 协作仓库到 GitHub。
#
# 用法：
#   ./tools/push-to-github.sh <owner/repo>            # 预检 + 推送
#   ./tools/push-to-github.sh <owner/repo> --check   # 只预检，不联网、不改 remote
#
# 凭证说明（重要）：
#   - 本脚本不存储、不打印、不把 Token 写进 .git/config 或命令历史里的持久位置。
#   - 若环境变量 GITHUB_TOKEN 存在（由已授权的 GitHub 连接器注入），
#     通过 git -c http.extraheader 仅在该次 push 进程内传递。
#   - 否则使用调用者本机已配置的 git credential helper。
#   - 严禁把 Token 明文写进仓库任何文件。
set -euo pipefail

REPO="${1:-}"
CHECK=0
[[ "${2:-}" == "--check" ]] && CHECK=1

if [[ -z "$REPO" ]]; then
  echo "用法: $0 <owner/repo> [--check]"
  echo "示例: $0 octocat/bikini-bottom"
  exit 1
fi
if [[ ! "$REPO" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]]; then
  echo "FAIL: 仓库地址格式应为 owner/repo，例如 octocat/bikini-bottom"
  exit 1
fi

cd "$(dirname "$0")/.."

echo "=== 1/4 仓库预检 ==="
git rev-parse --is-inside-work-tree >/dev/null || { echo "FAIL: 不是 Git 仓库"; exit 1; }
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
[[ "$BRANCH" == "main" ]] || { echo "FAIL: 当前分支为 $BRANCH，请在 main 上推送"; exit 1; }
if [[ -n "$(git status --porcelain)" ]]; then
  echo "FAIL: 工作区有未提交改动，请先 git add + git commit"
  git status --short
  exit 1
fi
echo "分支 main ｜ 提交 $(git rev-parse --short HEAD) ｜ 工作区干净"

echo "=== 2/4 资产契约校验 ==="
python3 tools/validate-assets.py >/tmp/bb-validate.log 2>&1 || { cat /tmp/bb-validate.log; exit 1; }
tail -3 /tmp/bb-validate.log

echo "=== 3/4 关键文件检查 ==="
for f in docs/美术资源需求与交付规范.md docs/index.html assets/manifest.json \
         integration/asset-slots.json src/index.html README.md; do
  [[ -f "$f" ]] || { echo "FAIL: 缺少 $f"; exit 1; }
done
echo "7 项关键文件齐全 ｜ tracked $(git ls-files | wc -l) 个文件"

URL="https://github.com/${REPO}.git"
if [[ "$CHECK" == "1" ]]; then
  echo "=== 4/4 --check 模式：跳过推送 ==="
  echo "目标: $URL"
  echo "预检全部通过。去掉 --check 即执行推送。"
  exit 0
fi

echo "=== 4/4 推送 ==="
git remote remove origin >/dev/null 2>&1 || true
git remote add origin "$URL"
echo "remote origin -> $URL（不含凭证）"

if [[ -n "${GITHUB_TOKEN:-}" ]]; then
  echo "使用已授权连接器注入的 Token（仅本次进程内传递）"
  AUTH="$(printf 'x-access-token:%s' "$GITHUB_TOKEN" | base64 | tr -d '\n')"
  git -c "http.extraheader=AUTHORIZATION: basic ${AUTH}" push -u origin main
  unset AUTH
else
  echo "GITHUB_TOKEN 未设置，改用本机 git credential helper"
  git push -u origin main
fi

echo "完成：$URL"
