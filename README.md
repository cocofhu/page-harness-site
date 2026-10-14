# page-harness site

The homepage for [page-harness](https://www.npmjs.com/package/page-harness), published at <https://cocofhu.github.io/page-harness-site/>.

Plain static files, no build step. Preview locally with any static server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## How the page works

The page is one continuous take on a fixed stage (`#fix`), played one scene per gesture: each scroll gesture (wheel, trackpad, arrow keys / Space / PageDown, or a swipe on touch screens) plays a whole scene on a time-based timeline, with short holds after each sub-action so it reads, and further gestures interrupt and skip ahead so you can reach install in a few flicks. Scrolling up rewinds the previous scene. Clicking a nav item jumps to the start of that step, Home / End jump to the start / install. With `prefers-reduced-motion`, scenes jump instantly. A small `02 / 05` counter with one dot per scene shows where you are. The five scenes:

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
- `site/flow.js`: beat timeline, input handling and scene rendering
- `site/logo/`: page-harness logo and favicons (original work for this project)
- `site/icons/`: third-party brand marks, with sources in `site/icons/SOURCES.md`
- `favicon.ico`: fallback favicon
- `assets/f-compare.webp`: a real capture, used only as the social preview image

## Third-party marks

Agent CLI marks come from [lobe-icons](https://github.com/lobehub/lobe-icons) (MIT). The npm and GitHub marks come from [simple-icons](https://simpleicons.org) (CC0). All of them remain trademarks of their respective owners and are used only to identify the tools page-harness works with. Exact sources and versions are listed in [`site/icons/SOURCES.md`](site/icons/SOURCES.md).
