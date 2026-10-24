#!/usr/bin/env python3
"""
Somnus UI Ripper

Rip inline CSS, JS, color tokens, and a component manifest from a given HTML file.

Outputs to an extract directory, preserving 1:1 content for design handoff
or consumption by Figma (via tokens JSON) and other tooling.

Usage:
  python tools/rip_somnus_ui.py path/to/file.html --out-dir extracted/somnus_main_ui 

What it produces in the output directory:
  - styles/<name>.css            : concatenated inline <style> blocks
  - scripts/<name>.js            : concatenated inline <script> blocks (no external src)
  - tokens/<name>.tokens.json    : Tokens Studio compatible JSON (best-effort from :root vars)
  - components.manifest.json     : Heuristic mapping of class names → first HTML snippet + matched CSS rules

Notes:
  - This is a best-effort ripper; it does not resolve external CSS/JS URLs.
  - Token extraction looks for a :root block and parses CSS custom properties (--var: value;).
  - Component manifest helps manual import into design tools; it is not a Figma file.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Dict, List, Tuple


ROOT_BLOCK_RE = re.compile(r":root\s*\{(?P<body>.*?)\}", re.DOTALL | re.IGNORECASE)
CSS_VAR_RE = re.compile(r"--(?P<name>[a-zA-Z0-9_-]+)\s*:\s*(?P<value>[^;]+);")

STYLE_BLOCK_RE = re.compile(r"<style[^>]*>(?P<body>.*?)</style>", re.DOTALL | re.IGNORECASE)
SCRIPT_BLOCK_RE = re.compile(r"<script(?P<attrs>[^>]*)>(?P<body>.*?)</script>", re.DOTALL | re.IGNORECASE)
SCRIPT_SRC_RE = re.compile(r"src\s*=\s*['\"]", re.IGNORECASE)

CLASS_RE = re.compile(r"class=\"(?P<classes>[^\"]+)\"|class='(?P<classes_s>[^']+)'", re.IGNORECASE)


def read_file(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def extract_inline_css(html: str) -> str:
    parts = [m.group("body") for m in STYLE_BLOCK_RE.finditer(html)]
    return "\n\n/* ---- */\n\n".join(parts).strip()


def extract_inline_js(html: str) -> str:
    parts = []
    for m in SCRIPT_BLOCK_RE.finditer(html):
        attrs = m.group("attrs") or ""
        if SCRIPT_SRC_RE.search(attrs):
            # Skip external scripts
            continue
        parts.append(m.group("body"))
    return "\n\n/* ---- */\n\n".join(parts).strip()


def extract_root_vars(css: str) -> Dict[str, str]:
    vars_map: Dict[str, str] = {}
    for root in ROOT_BLOCK_RE.finditer(css):
        body = root.group("body")
        for var_m in CSS_VAR_RE.finditer(body):
            name = var_m.group("name").strip()
            value = var_m.group("value").strip()
            vars_map[name] = value
    return vars_map


def tokens_studio_from_vars(vars_map: Dict[str, str]) -> Dict:
    # Flatten to a single token set named "colors"; classify by heuristic
    colors = {}
    others = {}
    for k, v in vars_map.items():
        entry = {"value": v}
        # naive color detection
        if any(x in v.lower() for x in ["#", "rgb", "hsl", "oklab", "oklch"]):
            entry["type"] = "color"
            colors[k] = entry
        else:
            others[k] = entry

    token_set = {
        "$schema": "https://schemas.tokens.studio/schemas/brands.json",
        "colors": colors,
    }
    if others:
        token_set["other"] = others
    return token_set


def collect_class_names(html: str) -> List[str]:
    classes: List[str] = []
    for m in CLASS_RE.finditer(html):
        cls_str = m.group("classes") or m.group("classes_s") or ""
        for c in cls_str.split():
            if c not in classes:
                classes.append(c)
    return classes


def find_first_outer_html_for_class(html: str, cls: str) -> str:
    # Very simple heuristic: find first tag with class="... cls ..." and capture a small outer HTML
    pattern = re.compile(rf"<([a-zA-Z0-9-]+)([^>]*?)class=([\'\"])([^\"\']*\b{re.escape(cls)}\b[^\"\']*)\3([^>]*)>(.*?)</\1>", re.DOTALL)
    m = pattern.search(html)
    if not m:
        # fallback to self-closing or tag without closing captured
        pattern2 = re.compile(rf"<([a-zA-Z0-9-]+)([^>]*?)class=([\'\"])([^\"\']*\b{re.escape(cls)}\b[^\"\']*)\3([^>]*)>", re.DOTALL)
        m2 = pattern2.search(html)
        if not m2:
            return ""
        snippet = html[m2.start(): m2.end()]
        return snippet.strip()
    snippet = html[m.start(): m.end()]
    # Trim if extremely long
    return snippet.strip()[:4000]


def collect_css_rules_for_class(css: str, cls: str) -> str:
    # naive: match rules starting with ".cls" possibly with combinators until closing brace
    # also match selectors that include ".cls" preceded by comma
    pattern = re.compile(rf"(^|\n)\s*[^{{}}]*\.{re.escape(cls)}[^{{}}]*\{{[^}}]*\}}", re.DOTALL)
    matches = pattern.findall(css)
    # pattern.findall returns tuples due to (^|\n); adjust to use finditer
    buf: List[str] = []
    for m in pattern.finditer(css):
        buf.append(css[m.start(): m.end()])
    return "\n\n".join(buf)


def build_component_manifest(html: str, css: str, limit: int = 150) -> Dict[str, Dict[str, str]]:
    classes = collect_class_names(html)
    manifest: Dict[str, Dict[str, str]] = {}
    for cls in classes[:limit]:
        snippet = find_first_outer_html_for_class(html, cls)
        rules = collect_css_rules_for_class(css, cls)
        if snippet or rules:
            manifest[cls] = {
                "html": snippet,
                "css": rules,
            }
    return manifest


def build_inline_tokens_css(vars_map: Dict[str, str]) -> str:
    if not vars_map:
        return ""
    lines = [":root{" ]
    for k, v in vars_map.items():
        lines.append(f"  --{k}: {v};")
    lines.append("}")
    return "\n".join(lines)


def first_match_by_selector(html: str, selector: str) -> str:
    selector = selector.strip()
    if selector.startswith('.'):
        return find_first_outer_html_for_class(html, selector[1:])
    if selector.startswith('#'):
        # capture element by id
        sid = re.escape(selector[1:])
        pattern = re.compile(rf"<([a-zA-Z0-9-]+)([^>]*?)id=([\'\"]){sid}\3([^>]*)>(.*?)</\1>", re.DOTALL)
        m = pattern.search(html)
        if not m:
            pattern2 = re.compile(rf"<([a-zA-Z0-9-]+)([^>]*?)id=([\'\"]){sid}\3([^>]*)>", re.DOTALL)
            m2 = pattern2.search(html)
            if not m2:
                return ""
            return html[m2.start(): m2.end()].strip()
        return html[m.start(): m.end()].strip()[:4000]
    # tag.class (simple)
    m = re.match(r"^(?P<tag>[a-zA-Z0-9-]+)\.(?P<class>[a-zA-Z0-9_-]+)$", selector)
    if m:
        tag = re.escape(m.group('tag'))
        cls = re.escape(m.group('class'))
        pattern = re.compile(rf"<({tag})([^>]*?)class=([\'\"])([^\"\']*\b{cls}\b[^\"\']*)\3([^>]*)>(.*?)</\1>", re.DOTALL)
        m1 = pattern.search(html)
        if not m1:
            return ""
        return html[m1.start(): m1.end()].strip()[:4000]
    # fallback: try class
    return find_first_outer_html_for_class(html, selector)


def main():
    p = argparse.ArgumentParser(description="Rip inline CSS/JS/tokens/components from an HTML file")
    p.add_argument("html", type=Path, help="Path to HTML file")
    p.add_argument("--out-dir", type=Path, default=None, help="Output directory (default: extracted/<name>)")
    p.add_argument("--name", type=str, default=None, help="Base name (default: stem of HTML file)")
    p.add_argument("--map", type=Path, default=None, help="JSON map of component name → selector (e.g., { 'ChatHeader': '.chat-header' })")
    p.add_argument("--catalog", action="store_true", help="Emit a components catalog HTML file for preview/import")
    p.add_argument("--no-components", action="store_true", help="Skip component manifest generation")
    args = p.parse_args()

    html_path: Path = args.html
    if not html_path.exists():
        raise SystemExit(f"HTML not found: {html_path}")

    name = args.name or html_path.stem
    out_dir = args.out_dir or Path("extracted") / name

    html = read_file(html_path)
    css = extract_inline_css(html)
    js = extract_inline_js(html)

    (out_dir / "styles").mkdir(parents=True, exist_ok=True)
    (out_dir / "scripts").mkdir(parents=True, exist_ok=True)
    (out_dir / "tokens").mkdir(parents=True, exist_ok=True)

    css_path = out_dir / "styles" / f"{name}.css"
    js_path = out_dir / "scripts" / f"{name}.js"
    css_path.write_text(css, encoding="utf-8")
    js_path.write_text(js, encoding="utf-8")

    # Tokens Studio JSON from :root vars
    vars_map = extract_root_vars(css)
    if vars_map:
        tokens_json = tokens_studio_from_vars(vars_map)
        tokens_path = out_dir / "tokens" / f"{name}.tokens.json"
        tokens_path.write_text(json.dumps(tokens_json, indent=2), encoding="utf-8")

    # Component manifest
    if not args.no_components:
        manifest = build_component_manifest(html, css)
        (out_dir / "components.manifest.json").write_text(
            json.dumps(manifest, indent=2), encoding="utf-8"
        )

    components_index: Dict[str, Dict[str, str]] = {}
    # Component map → individual component files
    if args.map and args.map.exists():
        decl: Dict[str, str] = json.loads(args.map.read_text(encoding='utf-8'))
        comp_dir = out_dir / "components"
        comp_dir.mkdir(parents=True, exist_ok=True)
        for comp_name, selector in decl.items():
            snippet = first_match_by_selector(html, selector)
            if not snippet:
                continue
            # collect rules for all classes used within the snippet
            snippet_classes = collect_class_names(snippet)
            rules_buf: List[str] = []
            for cls in snippet_classes:
                r = collect_css_rules_for_class(css, cls)
                if r:
                    rules_buf.append(r)
            comp_css = ("\n\n".join(rules_buf)).strip()
            (comp_dir / f"{comp_name}.html").write_text(snippet, encoding='utf-8')
            if comp_css:
                (comp_dir / f"{comp_name}.css").write_text(comp_css, encoding='utf-8')
            components_index[comp_name] = {
                "selector": selector,
                "html": str((comp_dir / f"{comp_name}.html").as_posix()),
                "css": str((comp_dir / f"{comp_name}.css").as_posix()) if comp_css else None,
            }

    # Optional catalog for easy Figma import via HTML→Figma plugins
    if args.catalog:
        catalog_path = out_dir / "catalog" / "components.html"
        catalog_path.parent.mkdir(parents=True, exist_ok=True)
        # inline minimal tokens from vars_map for standalone viewing
        tokens_inline = build_inline_tokens_css(vars_map)
        items_html = []
        for comp_name, meta in components_index.items():
            comp_html = Path(meta["html"]).read_text(encoding='utf-8') if meta.get("html") else ""
            items_html.append(f"<section class=\"comp\"><h2>{comp_name}</h2><div class=\"preview\">{comp_html}</div></section>")
        catalog_html = f"""
<!DOCTYPE html>
<html>
  <head>
    <meta charset=\"utf-8\" />
    <title>Somnus Components Catalog</title>
    <style>
      {tokens_inline}
      body{{font-family:Inter,system-ui,sans-serif;background:var(--surface-0);color:var(--text-primary);}}
      .grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:16px;padding:24px;}}
      .comp{{background:var(--surface-1);border:1px solid var(--border-subtle);border-radius:12px;padding:16px;}}
      .comp h2{{font-size:14px;margin:0 0 12px;color:var(--text-secondary);}}
      .preview{{background:var(--surface-0);border:1px dashed var(--border-subtle);border-radius:8px;padding:12px;}}
    </style>
  </head>
  <body>
    <div class=\"grid\">{''.join(items_html)}</div>
  </body>
</html>
"""
        catalog_path.write_text(catalog_html, encoding='utf-8')

    # Index file with pointers
    index = {
        "name": name,
        "styles": str(css_path),
        "scripts": str(js_path),
        "tokens": str((out_dir / "tokens" / f"{name}.tokens.json")) if vars_map else None,
        "components_manifest": str(out_dir / "components.manifest.json") if not args.no_components else None,
        "components": components_index or None,
    }
    (out_dir / "index.json").write_text(json.dumps(index, indent=2), encoding="utf-8")

    print(json.dumps(index, indent=2))


if __name__ == "__main__":
    main()
