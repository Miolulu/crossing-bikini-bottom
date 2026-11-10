#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
美术资源交付自检。美术 AI 在标 delivered 前运行；集成 AI 在挂载前再跑一次。
    python3 tools/validate-assets.py
输出 PASS / 逐条 FAIL，并写 assets/_review/validation-report.md。
依赖：Pillow（pip3 install pillow）
"""
import json, os, re, sys
from datetime import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "assets")
REVIEW = os.path.join(ASSETS, "_review")
DIRS = {"world", "buildings", "rooms", "characters", "props", "ui", "icons", "fx"}
STATUS = {"pending", "delivered", "accepted", "rejected"}
NAME_RE = re.compile(r"^[A-G]-\d{2}(?:-[a-z0-9_]+)*(?:@2x)?\.png$")

try:
    from PIL import Image
except ImportError:
    print("FAIL: 缺少 Pillow，请先执行  pip3 install pillow")
    sys.exit(2)


def main():
    mf = os.path.join(ASSETS, "manifest.json")
    if not os.path.isfile(mf):
        print("FAIL: 找不到 assets/manifest.json"); return 2
    with open(mf, encoding="utf-8") as f:
        m = json.load(f)

    errors, warns = [], []
    ids = set()
    checked = 0
    for a in m.get("assets", []):
        aid = a.get("id", "?")
        if aid in ids:
            errors.append("[%s] 编号重复" % aid)
        ids.add(aid)

        if a.get("dir") and a["dir"] not in DIRS:
            errors.append("[%s] 目录非法: %s" % (aid, a["dir"]))
        if a.get("status") not in STATUS:
            errors.append("[%s] status 非法: %s" % (aid, a.get("status")))
        if a.get("code_only"):
            if a.get("files"):
                warns.append("[%s] code_only 条目不应有 files" % aid)
            continue

        files = a.get("files") or []
        if not files:
            errors.append("[%s] 未声明 files" % aid)
        for fn in files:
            if not NAME_RE.match(fn):
                errors.append("[%s] 命名不合规: %s" % (aid, fn))
            if "@2x" in fn and fn.replace("@2x", "") not in files:
                warns.append("[%s] 有 @2x 但缺 1x: %s" % (aid, fn))

        if a.get("status") not in ("delivered", "accepted"):
            continue

        d = os.path.join(ASSETS, a.get("dir", ""))
        spec = a.get("spec") or {}
        ratio = spec.get("ratio")
        for fn in files:
            p = os.path.join(d, fn)
            if not os.path.isfile(p):
                errors.append("[%s] 文件缺失: %s/%s" % (aid, a.get("dir"), fn))
                continue
            checked += 1
            try:
                im = Image.open(p)
                im.load()
            except Exception as e:
                errors.append("[%s] PNG 无法解码: %s (%s)" % (aid, fn, e)); continue
            if im.format != "PNG":
                errors.append("[%s] 不是 PNG: %s" % (aid, fn))
            w, h = im.size
            if "A" not in im.getbands() and "transparency" not in im.info:
                errors.append("[%s] 缺少 alpha 通道（非透明底）: %s" % (aid, fn))
            if ratio:
                r = w / h
                if abs(r - ratio) / ratio > 0.12:
                    errors.append("[%s] 宽高比偏差 >12%%: %s 实际 %.3f 期望 %.3f" % (aid, fn, r, ratio))
            # 透明底检查（纯色底的世界/房间图跳过）
            if a.get("dir") in ("world", "rooms") and "solid" in str(spec.get("bg", "")):
                continue
            rgba = im.convert("RGBA")
            alpha = rgba.getchannel("A")
            for xy in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
                if alpha.getpixel(xy) > 16:
                    errors.append("[%s] 四角非透明（疑似白底/灰底）: %s" % (aid, fn)); break
            bbox = alpha.getbbox()
            if bbox:
                pad = min(bbox[0], bbox[1], w - bbox[2], h - bbox[3]) / min(w, h)
                if pad < 0.06:
                    warns.append("[%s] 透明边距偏小(%.1f%%，建议 8-12%%): %s" % (aid, pad * 100, fn))

    os.makedirs(REVIEW, exist_ok=True)
    report = [
        "# 美术资源交付自检报告", "",
        "生成时间：%s" % datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "",
        "- 资产条目：%d" % len(m.get("assets", [])),
        "- 已声明文件：%d" % sum(len(a.get("files", [])) for a in m.get("assets", []) if not a.get("code_only")),
        "- 本次实检文件：%d" % checked,
        "- 错误：%d ／ 提醒：%d" % (len(errors), len(warns)), "",
        "## 错误（必须修复）", "",
    ]
    report += ["- " + e for e in errors] or ["- 无"]
    report += ["", "## 提醒（建议修复）", ""]
    report += ["- " + x for x in warns] or ["- 无"]
    report += ["", "## 结论", "", "**%s**" % ("PASS" if not errors else "FAIL"), ""]
    with open(os.path.join(REVIEW, "validation-report.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(report))

    print("=" * 56)
    print("资产条目 %d ｜ 实检文件 %d ｜ 错误 %d ｜ 提醒 %d" %
          (len(m.get("assets", [])), checked, len(errors), len(warns)))
    for e in errors:
        print("  FAIL  " + e)
    for x in warns[:15]:
        print("  WARN  " + x)
    print("结论：%s" % ("PASS ✅ 可以标 delivered" if not errors else "FAIL ❌ 请先修复"))
    print("报告：assets/_review/validation-report.md")
    print("=" * 56)
    return 0 if not errors else 1


if __name__ == "__main__":
    sys.exit(main())
