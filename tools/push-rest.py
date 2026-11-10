#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
push-rest.py —— 无 git 协议 / 无连接器授权 时的 GitHub 推送兜底脚本

背景：本沙箱只放通 api.github.com（REST API 可达），github.com 网页/设备码端点
与 git smart-HTTP 端点超时；连接器授权网关若返回「connector github is not
authorized」，则 git push 也拿不到凭证。此时用一个 Personal Access Token 走
GitHub Git Data API，把整个仓库以「单个 commit」推上去，不依赖连接器、不依赖
github.com 网页、不把 token 写入任何仓库文件。

用法：
    GITHUB_PAT=ghp_xxx python3 tools/push-rest.py               # 推到 <你的用户名>/bikini-bottom
    GITHUB_PAT=ghp_xxx python3 tools/push-rest.py owner/repo    # 推到指定仓库
    GITHUB_PAT=ghp_xxx PRIVATE=1 python3 tools/push-rest.py     # 建私有仓库
    python3 tools/push-rest.py --check                          # 离线 dry-run，只枚举文件，不联网

安全约定：
  - token 只从环境变量 GITHUB_PAT 读取，仅在单次进程内通过 Authorization 头传递；
    不写入 .git/config、不打印、不落盘、不进任何交付文件。
  - 建议使用 fine-grained PAT，仅授权目标仓库的 Contents(read/write) 与
    Metadata(read)；仓库不存在需新建时再临时开 Administration(write)，用完撤销。

兼容性补丁（桌面端迁移时加入）：
  - 仓库名支持非 ASCII（如中文），所有 API 路径中的 owner/name 均做 URL 编码。
  - 允许目标仓库为空仓库（无默认分支/无基线 commit）：将以「无父 commit」方式
    创建首个 commit，并通过 POST 新建 refs/heads/<branch>。
"""
import os
import sys
import json
import base64
import urllib.request
import urllib.error
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = "https://api.github.com"
DEFAULT_REPO = "bikini-bottom"
EXCLUDE_DIRS = {".git"}
EXCLUDE_NAMES = {".DS_Store"}
EXCLUDE_RELS = {"assets/_review/validation-report.md"}


def collect():
    items = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for fn in filenames:
            if fn in EXCLUDE_NAMES:
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, ROOT).replace(os.sep, "/")
            if rel in EXCLUDE_RELS:
                continue
            with open(full, "rb") as f:
                data = f.read()
            items.append((rel, data))
    return sorted(items)


def req(method, path, token, body=None):
    url = API + path
    data = json.dumps(body).encode("utf-8") if body is not None else None
    r = urllib.request.Request(url, data=data, method=method)
    r.add_header("Authorization", "Bearer " + token)
    r.add_header("Accept", "application/vnd.github+json")
    r.add_header("X-GitHub-Api-Version", "2022-11-28")
    r.add_header("User-Agent", "bikini-bottom-push-rest/1.0")
    r.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(r, timeout=90) as resp:
            raw = resp.read().decode("utf-8", "replace")
            return resp.status, (json.loads(raw) if raw else {})
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", "replace")
        try:
            payload = json.loads(raw)
        except Exception:
            payload = {"raw": raw[:300]}
        return e.code, payload
    except Exception as e:
        return 0, {"raw": str(e)[:300]}


def die(msg, payload=None):
    print("FAIL:", msg)
    if payload:
        print("     ", json.dumps(payload, ensure_ascii=False)[:400])
    sys.exit(1)


def main():
    items = collect()
    total = sum(len(d) for _, d in items)
    pngs = sum(1 for p, _ in items if p.lower().endswith(".png"))

    token = os.environ.get("GITHUB_PAT", "").strip()
    if "--check" in sys.argv or not token:
        print("DRY-RUN（未联网）")
        print("  仓库根目录 :", ROOT)
        print("  待上传文件 :", len(items), "个")
        print("  二进制 PNG :", pngs, "个")
        print("  合计字节   :", total, "(%.2f MB)" % (total / 1048576.0))
        print("  包含 manifest / 插槽表 / 规范网页 :",
              all(any(p == x for p, _ in items) for x in
                  ["assets/manifest.json", "integration/asset-slots.json", "docs/index.html"]))
        print("  已排除     : .git/、本地自检报告")
        if not token:
            print("  提示       : 设置 GITHUB_PAT 后即为真实推送")
        return

    arg = next((a for a in sys.argv[1:] if not a.startswith("--")), None)
    print("== 1/7 校验凭证 ==")
    code, me = req("GET", "/user", token)
    if code != 200 or "login" not in me:
        die("PAT 无效或无 read:user 权限", me)
    login = me["login"]
    print("   已认证为:", login)

    if arg and "/" in arg:
        owner, name = arg.split("/", 1)
    else:
        owner, name = login, (arg or DEFAULT_REPO)
    full = "%s/%s" % (owner, name)
    full_api = "%s/%s" % (urllib.parse.quote(owner), urllib.parse.quote(name))
    print("   目标仓库 :", full)

    print("== 2/7 检查 / 新建仓库 ==")
    code, repo = req("GET", "/repos/" + full_api, token)
    if code == 404:
        payload = {
            "name": name,
            "description": "比奇堡沉浸 Demo · 美术资源协作仓库（规范 / manifest / 代码插槽）",
            "private": os.environ.get("PRIVATE", "") == "1",
            "auto_init": True,  # 建一个带 README 的初始 commit，便于后续 ref 更新
        }
        ep = "/user/repos" if owner == login else "/orgs/%s/repos" % urllib.parse.quote(owner)
        code, repo = req("POST", ep, token, payload)
        if code not in (200, 201):
            die("创建仓库失败（fine-grained PAT 需临时开 Administration:write）", repo)
        print("   已新建:", full)
    elif code != 200:
        die("读取仓库失败", repo)
    else:
        print("   已存在:", full)

    branch = repo.get("default_branch") or "main"
    print("== 3/7 取基线 commit (branch=%s) ==" % branch)
    code, ref = req("GET", "/repos/%s/git/ref/heads/%s" % (full_api, branch), token)
    if code == 200:
        base_sha = ref["object"]["sha"]
        print("   已有基线:", base_sha[:12])
    elif code == 404:
        base_sha = None
        print("   空仓库(无基线)，将创建首个 commit")
    else:
        die("读取 ref 失败", ref)

    print("== 4/7 上传 %d 个 blob ==" % len(items))
    tree = []
    for i, (path, data) in enumerate(items, 1):
        code, blob = req("POST", "/repos/%s/git/blobs" % full_api, token, {
            "content": base64.b64encode(data).decode("ascii"),
            "encoding": "base64",
        })
        if code not in (200, 201) or "sha" not in blob:
            die("blob 失败: " + path, blob)
        tree.append({
            "path": path,
            "mode": "100755" if path.endswith(".sh") else "100644",
            "type": "blob",
            "sha": blob["sha"],
        })
        if i % 10 == 0 or i == len(items):
            print("   %d/%d" % (i, len(items)))

    print("== 5/7 建 tree（全量替换，不含 base_tree）==")
    code, tr = req("POST", "/repos/%s/git/trees" % full_api, token, {"tree": tree})
    if code not in (200, 201):
        die("建 tree 失败", tr)

    print("== 6/7 建 commit ==")
    code, cm = req("POST", "/repos/%s/git/commits" % full_api, token, {
        "message": "chore(repo): import bikini-bottom collab skeleton via REST API\n\n"
                   "%d files, %d PNGs. Art handoff spec + manifest + code slots.\n"
                   "assets/ owned by art AI; src/+integration/+docs/+tools/ owned by integration AI."
                   % (len(items), pngs),
        "tree": tr["sha"],
        "parents": [base_sha] if base_sha else [],
    })
    if code not in (200, 201):
        die("建 commit 失败", cm)

    print("== 7/7 更新/创建 ref ==")
    if base_sha:
        code, up = req("PATCH", "/repos/%s/git/refs/heads/%s" % (full_api, branch), token,
                       {"sha": cm["sha"], "force": False})
    else:
        code, up = req("POST", "/repos/%s/git/refs" % full_api, token,
                       {"ref": "refs/heads/%s" % branch, "sha": cm["sha"]})
    if code not in (200, 201):
        die("更新/创建 ref 失败", up)

    print()
    print("OK 推送完成:", "https://github.com/" + full)
    print("   commit :", cm["sha"][:12])
    print("   files  :", len(items), "(PNG %d)" % pngs)
    print("   bytes  : %.2f MB" % (total / 1048576.0))
    print("   提示   : 后续协作请改用 git clone/push；本脚本仅用于首次导入。")


if __name__ == "__main__":
    main()
