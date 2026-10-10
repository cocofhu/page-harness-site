# page-harness site

The homepage for [page-harness](https://www.npmjs.com/package/page-harness), published at <https://cocofhu.github.io/page-harness-site/>.

Plain static files, no build step. Preview locally with any static server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## How the page works

The page is one continuous, scroll-driven take: a fixed stage (`#fix`) is redrawn from scroll progress, so there are no separate sections or cuts, and scrolling back up plays everything in reverse. It walks through five steps:

1. `npx page-harness` starts the harness in front of a running dev server
2. Pick an element on the page and chat with the agent about what to change
3. `--share` a link so teammates can review and comment on the same page
4. Switch the agent CLI per chat (Claude Code, Codex, Cursor Agent, CodeBuddy, OpenCode)
5. Install

Copy is available in Chinese and English. Use the 中 / EN toggle in the nav, or open the page with `?lang=zh` or `?lang=en`. Without either, it follows the browser language, and the last choice is remembered.

## Files

- `index.html`: page shell and meta tags
- `site/site.css`: styles
- `site/content.js`: all copy (zh / en)
- `site/flow.js`: scroll timeline and scene rendering
- `site/logo/`: page-harness logo and favicons (original work for this project)
- `site/icons/`: third-party brand marks, with sources in `site/icons/SOURCES.md`
- `favicon.ico`: fallback favicon
- `assets/f-compare.webp`: a real capture, used only as the social preview image

## Third-party marks

Agent CLI marks come from [lobe-icons](https://github.com/lobehub/lobe-icons) (MIT). The npm and GitHub marks come from [simple-icons](https://simpleicons.org) (CC0). All of them remain trademarks of their respective owners and are used only to identify the tools page-harness works with. Exact sources and versions are listed in [`site/icons/SOURCES.md`](site/icons/SOURCES.md).
