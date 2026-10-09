(() => {
  'use strict'

  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => [...r.querySelectorAll(s)]
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ───────── toast ───────── */
  const toastEl = $('#phToast')
  let toastTimer
  function toast(msg) {
    toastEl.textContent = msg
    toastEl.classList.add('show')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600)
  }

  /* ───────── copy buttons ───────── */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
  }
  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await copyText(btn.dataset.copy)
      const label = $('.cmd-copy', btn)
      btn.classList.add('copied')
      if (label) label.textContent = '已复制'
      setTimeout(() => {
        btn.classList.remove('copied')
        if (label) label.textContent = '复制'
      }, 1600)
    })
  })

  /* ───────── reveal ───────── */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target) }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    $$('[data-reveal]').forEach((el) => io.observe(el))
  } else {
    $$('[data-reveal]').forEach((el) => el.classList.add('in'))
  }

  /* ───────── hero crosshair + stage tilt ───────── */
  const hero = $('.hero')
  const xread = $('.xh-read')
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    hero.style.setProperty('--mx', x + 'px')
    hero.style.setProperty('--my', y + 'px')
    xread.textContent = `x ${String(Math.round(x)).padStart(4, '0')} · y ${String(Math.round(y)).padStart(4, '0')}`
  })

  const stage = $('#stage')
  let ticking = false
  function tilt() {
    ticking = false
    const r = stage.parentElement.getBoundingClientRect()
    const p = clamp((innerHeight - r.top) / (innerHeight * 0.85), 0, 1)
    stage.style.setProperty('--tilt', (16 * (1 - p)).toFixed(2) + 'deg')
    stage.style.setProperty('--sc', (0.94 + 0.06 * p).toFixed(3))
  }
  if (!reduced) {
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(tilt) } }, { passive: true })
    tilt()
  } else {
    stage.style.setProperty('--tilt', '0deg')
    stage.style.setProperty('--sc', '1')
  }

  /* ───────── Live section demo ───────── */
  const ldCanvas = $('#ldCanvas')
  const ldSeg = $('#ldSeg')
  const ldCode = $('#ldCode code')
  const ldCompare = $('#ldCompare')
  const ld = { v: 1, radius: 18, gap: 14, compare: false }
  const ldLabels = ['原版', 'Bold', 'Soft', 'Glass']

  function renderLd() {
    $$('button', ldSeg).forEach((b) => b.classList.toggle('on', !ld.compare && +b.dataset.v === ld.v))
    $$('.ld-card', ldCanvas).forEach((c) => c.classList.toggle('show', +c.dataset.variant === ld.v))
    ldCanvas.classList.toggle('compare', ld.compare)
    ldCompare.classList.toggle('on', ld.compare)
    ldCanvas.style.setProperty('--ph-radius', ld.radius + 'px')
    ldCanvas.style.setProperty('--ph-gap', ld.gap + 'px')

    const tg = (s) => `<span class="tg">${s}</span>`
    const at = (k, v) => `<span class="at">${k}</span>=<span class="st">"${esc(v)}"</span>`
    const lines = [
      `${tg('&lt;div')} ${at('data-ph-live', 'L1a2b3c4')} ${at('style', `display:contents; --ph-radius:${ld.radius}px; --ph-gap:${ld.gap}px`)}${tg('&gt;')}`,
    ]
    ldLabels.forEach((label, i) => {
      const attrs = [at('data-ph-variant', String(i))]
      if (i > 0) attrs.push(at('data-ph-variant-label', label))
      if (i !== ld.v && !ld.compare) attrs.push('<span class="at">hidden</span>')
      if (i === 1) attrs.push(`\n      ${at('data-ph-params', '[{"name":"radius","type":"range","max":32},{"name":"gap",…}]')}`)
      const tone = i ? ` ${at('tone', label.toLowerCase())}` : ''
      const line = `  ${tg('&lt;PricingCard')} ${attrs.join(' ')}${tone} ${tg('/&gt;')}`
      const cls = ld.compare || i === ld.v ? 'ln-on' : 'ln-off'
      lines.push(`<span class="${cls}">${line}</span>`)
    })
    lines.push(tg('&lt;/div&gt;'))
    ldCode.innerHTML = lines.join('\n')
  }
  ldSeg.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-v]')
    if (!b) return
    ld.v = +b.dataset.v
    ld.compare = false
    renderLd()
  })
  ldCompare.addEventListener('click', () => { ld.compare = !ld.compare; renderLd() })
  $$('.ld-params input[type=range]').forEach((inp) => {
    inp.addEventListener('input', () => {
      ld[inp.dataset.param] = +inp.value
      inp.nextElementSibling.textContent = inp.value + 'px'
      renderLd()
    })
  })
  $$('.ld-act').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.act === 'adopt') {
      toast(ld.v === 0 ? '保留原版，Agent 会去掉包裹层' : `已采用「${ldLabels[ld.v]}」：Agent 只保留这个候选，并去掉包裹层`)
    } else {
      ld.v = 0
      ld.compare = false
      renderLd()
      toast('已放弃，源码还原成原版')
    }
  }))
  renderLd()

  /* ═════════ demo harness ═════════ */
  const ph = $('#ph')
  const hl = $('#phHl')
  const hlTag = $('.ph-hl-tag', hl)
  const pop = $('#phPop')
  const banner = $('#phBanner')
  const dock = $('#phDock')
  const chat = $('#phChat')
  const art = $('#phArt')
  const msgs = $('#phMsgs')
  const input = $('#phInput')
  const refsEl = $('#phRefs')
  const liveBar = $('#phLive')
  const heroTitle = $('#heroTitle')

  const st = {
    picking: false,
    locked: null,
    pins: [],
    refs: [],
    live: null,
    busy: false,
    stats: { adopted: 0, discarded: 0 },
    accentIdx: 0,
  }

  function selOf(el) {
    const part = (e) => {
      let s = e.tagName.toLowerCase()
      if (e.id) return s + '#' + e.id
      const c = [...e.classList].find((c) => !c.startsWith('ph-') && c !== 'in')
      if (c) s += '.' + c
      return s
    }
    const p = el.parentElement
    if (el.id || !p || p === document.body || p.tagName === 'MAIN') return part(el)
    return part(p) + ' > ' + part(el)
  }

  const skip = (el) => !el || el === document.body || el === document.documentElement || !!el.closest('[data-ph-skip]') || el.tagName === 'MAIN'

  function drawHl(el) {
    const r = el.getBoundingClientRect()
    hl.hidden = false
    Object.assign(hl.style, { left: r.left - 2 + 'px', top: r.top - 2 + 'px', width: r.width + 4 + 'px', height: r.height + 4 + 'px' })
    hl.classList.toggle('below', r.top < 110)
    hlTag.textContent = `${selOf(el)} · ${Math.round(r.width)}×${Math.round(r.height)}`
  }

  function setDock() {
    $('[data-dock=pick]', dock).classList.toggle('on', st.picking)
    $('[data-dock=chat]', dock).classList.toggle('on', !chat.hidden)
    $('[data-dock=art]', dock).classList.toggle('on', !art.hidden)
  }

  function startPick() {
    closePanels()
    st.picking = true
    document.body.classList.add('ph-picking')
    banner.hidden = false
    setDock()
  }
  function stopPick() {
    st.picking = false
    st.locked = null
    document.body.classList.remove('ph-picking')
    hl.hidden = true
    hl.classList.remove('locked')
    pop.hidden = true
    banner.hidden = true
    setDock()
  }

  document.addEventListener('mousemove', (e) => {
    if (!st.picking || st.locked) return
    const el = e.target
    if (skip(el)) { hl.hidden = true; return }
    drawHl(el)
  }, { passive: true })

  document.addEventListener('click', (e) => {
    if (!st.picking) return
    const el = e.target
    if (ph.contains(el) || skip(el)) return
    e.preventDefault()
    e.stopPropagation()
    if (e.shiftKey) {
      addRef(el)
      stopPick()
      openPanel('chat')
      toast(`已引用 ${selOf(el)}`)
      return
    }
    lock(el)
  }, true)

  function lock(el) {
    st.locked = el
    drawHl(el)
    hl.classList.add('locked')
    pop.innerHTML = `
      <div class="pp-h">${esc(selOf(el))}</div>
      <button class="pp-i" data-pp="ref" type="button"><i>↳</i>引用到对话<small>⇧ 点击</small></button>
      <button class="pp-i" data-pp="note" type="button"><i>✎</i>评论</button>
      <button class="pp-i" data-pp="live" type="button"><i>✦</i>Live 候选</button>
      <button class="pp-i" data-pp="cancel" type="button"><i>✕</i>重新选择<small>Esc</small></button>`
    pop.hidden = false
    placePop()
  }

  function placePop() {
    if (!st.locked) return
    const r = st.locked.getBoundingClientRect()
    const w = pop.offsetWidth
    const h = pop.offsetHeight
    let top = r.bottom + 10
    if (top + h > innerHeight - 90) top = r.top - h - 10
    if (top < 70) top = clamp(r.top + 12, 70, innerHeight - h - 90)
    pop.style.left = clamp(r.left, 10, innerWidth - w - 10) + 'px'
    pop.style.top = top + 'px'
  }

  addEventListener('scroll', () => {
    if (st.locked) { drawHl(st.locked); placePop() }
  }, { passive: true })

  pop.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pp]')
    if (!b || !st.locked) return
    const el = st.locked
    const act = b.dataset.pp
    if (act === 'ref') {
      addRef(el)
      stopPick()
      openPanel('chat')
    } else if (act === 'note') {
      pop.innerHTML = `
        <div class="pp-h">评论 · ${esc(selOf(el))}</div>
        <textarea placeholder="写下你的意见…（⌘/Ctrl + Enter 钉上）"></textarea>
        <div class="pp-row"><button type="button" class="ph-btn" data-pp="cancel">取消</button><button type="button" class="ph-btn primary" data-pp="pin">钉上</button></div>`
      placePop()
      const ta = $('textarea', pop)
      ta.focus()
      ta.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) $('[data-pp=pin]', pop).click()
      })
    } else if (act === 'pin') {
      const text = $('textarea', pop).value.trim()
      if (!text) { $('textarea', pop).focus(); return }
      addPin(el, text, '你')
      stopPick()
      toast(`已钉上第 ${st.pins.length} 条意见`)
    } else if (act === 'live') {
      stopPick()
      startLive(el)
    } else if (act === 'cancel') {
      st.locked = null
      hl.classList.remove('locked')
      pop.hidden = true
    }
  })

  /* pins */
  function placePin(p) {
    const r = p.el.getBoundingClientRect()
    const x = clamp(r.right + scrollX - 12, 8, document.documentElement.clientWidth - 34)
    const y = r.top + scrollY - 14
    p.node.style.left = x + 'px'
    p.node.style.top = y + 'px'
  }
  function addPin(el, text, who) {
    const n = st.pins.length + 1
    const node = document.createElement('button')
    node.type = 'button'
    node.className = 'ph-pin'
    node.setAttribute('data-ph-skip', '')
    node.innerHTML = `${n}<span class="ph-pin-note"><small>#${n} · ${esc(who)} · ${esc(selOf(el))}</small>${esc(text)}</span>`
    node.addEventListener('click', () => node.classList.toggle('open'))
    document.body.appendChild(node)
    const p = { n, el, text, who, sel: selOf(el), node }
    st.pins.push(p)
    placePin(p)
  }
  addEventListener('resize', () => st.pins.forEach(placePin))

  /* live on arbitrary elements */
  const liveLabels = ['原版', 'Light', 'Signal', 'Mono']
  function applyVariant(el, i) {
    el.classList.remove('ph-v1', 'ph-v2', 'ph-v3')
    if (i > 0) el.classList.add('ph-v' + i)
  }
  async function startLive(el) {
    if (st.live) endLive(false, true)
    const session = { el, v: 1, ready: false }
    st.live = session
    el.classList.add('ph-live-target')
    el.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' })
    liveBar.hidden = false
    $('.ph-live-sel', liveBar).textContent = selOf(el)
    $('.ph-live-body', liveBar).innerHTML = '<span class="ph-spin"></span><span class="muted">Agent 正在写候选…</span>'
    await sleep(1200)
    if (st.live !== session) return
    session.ready = true
    renderLive()
  }
  function renderLive() {
    const s = st.live
    if (!s) return
    applyVariant(s.el, s.v)
    $('.ph-live-body', liveBar).innerHTML = `
      <span class="lv-seg">${liveLabels.map((l, i) => `<button type="button" data-lv="${i}" class="${i === s.v ? 'on' : ''}">${l}</button>`).join('')}</span>
      <button type="button" class="ph-btn" data-lv-act="discard">放弃</button>
      <button type="button" class="ph-btn primary" data-lv-act="adopt">采用</button>`
  }
  function endLive(adopt, silent) {
    const s = st.live
    if (!s) return
    st.live = null
    s.el.classList.remove('ph-live-target')
    if (!adopt) applyVariant(s.el, 0)
    liveBar.hidden = true
    if (silent) return
    if (adopt) {
      st.stats.adopted++
      toast(s.v === 0 ? '保留原版' : `已采用「${liveLabels[s.v]}」：真实使用时 Agent 会只保留这个候选并去掉包裹层`)
    } else {
      st.stats.discarded++
      toast('已放弃，还原成原版')
    }
  }
  liveBar.addEventListener('click', (e) => {
    const s = st.live
    if (!s || !s.ready) return
    const v = e.target.closest('[data-lv]')
    if (v) { s.v = +v.dataset.lv; renderLive(); return }
    const a = e.target.closest('[data-lv-act]')
    if (a) endLive(a.dataset.lvAct === 'adopt')
  })

  /* panels */
  function openPanel(which) {
    if (st.picking) stopPick()
    chat.hidden = which !== 'chat'
    art.hidden = which !== 'art'
    if (which === 'chat') setTimeout(() => input.focus(), 50)
    if (which === 'art') { $('#phArtBadge').hidden = true; renderArt() }
    setDock()
  }
  function closePanels() {
    chat.hidden = true
    art.hidden = true
    setDock()
  }
  dock.addEventListener('click', (e) => {
    const b = e.target.closest('[data-dock]')
    if (!b) return
    dock.classList.remove('attn')
    const k = b.dataset.dock
    if (k === 'pick') {
      if (st.picking) stopPick()
      else startPick()
      return
    }
    const panel = k === 'chat' ? chat : art
    if (panel.hidden) openPanel(k)
    else closePanels()
  })
  $$('[data-close]', ph).forEach((b) => b.addEventListener('click', closePanels))

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (st.locked) { st.locked = null; hl.classList.remove('locked'); pop.hidden = true }
      else if (st.picking) stopPick()
      else if (!chat.hidden || !art.hidden) closePanels()
      else if (st.live) endLive(false)
      return
    }
    if (st.live?.ready && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName || '')) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const d = e.key === 'ArrowRight' ? 1 : -1
        st.live.v = (st.live.v + d + liveLabels.length) % liveLabels.length
        renderLive()
      }
    }
  })

  /* chat */
  function addRef(el) {
    if (!st.refs.some((r) => r.el === el)) st.refs.push({ el, sel: selOf(el) })
    renderRefs()
  }
  function renderRefs() {
    refsEl.innerHTML = st.refs.map((r, i) => `<span class="ref">${esc(r.sel)}<button type="button" data-unref="${i}" aria-label="移除">✕</button></span>`).join('')
  }
  refsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-unref]')
    if (!b) return
    st.refs.splice(+b.dataset.unref, 1)
    renderRefs()
  })

  const scrollMsgs = () => { msgs.scrollTop = msgs.scrollHeight }
  function bubble(cls, html) {
    const d = document.createElement('div')
    d.className = cls
    d.innerHTML = html
    msgs.appendChild(d)
    scrollMsgs()
    return d
  }
  async function think(ms) {
    const d = bubble('ph-think', '<span class="ph-spin"></span>思考中…')
    await sleep(ms)
    d.textContent = `▸ 思考了 ${(ms / 1000).toFixed(1)} 秒`
  }
  async function tool(name, args, ms = 700) {
    const d = bubble('ph-tool', `<b>${esc(name)}</b><span>${esc(args)}</span><span class="st"><span class="ph-spin"></span></span>`)
    await sleep(ms)
    $('.st', d).className = 'st done'
    $('.st', d).textContent = '✓'
  }
  async function say(text, extraHtml = '') {
    const d = bubble('ph-m ai streaming', '')
    const step = reduced ? text.length : 2
    for (let i = 0; i < text.length; i += step) {
      d.textContent = text.slice(0, i + step)
      scrollMsgs()
      await sleep(16)
    }
    d.classList.remove('streaming')
    if (extraHtml) d.insertAdjacentHTML('beforeend', extraHtml)
    scrollMsgs()
    return d
  }

  const palette = [
    ['#0ea5c6', '青色'],
    ['#f2552c', '橙色'],
    ['#10a36e', '翡翠绿'],
    ['#e2468f', '粉色'],
    ['#7b61ff', '原来的紫色'],
  ]

  async function run(text, refs) {
    const target = refs[0]?.el
    if (/色|color|accent|主题|配色/i.test(text)) {
      let idx = st.accentIdx % palette.length
      const want = palette.find(([, n]) => text.includes(n.replace('原来的', '')))
      if (want) idx = palette.indexOf(want)
      const [c, name] = palette[idx]
      st.accentIdx = idx + 1
      await think(700)
      await tool('page_state', '{ url: "/", viewport: "' + innerWidth + '×' + innerHeight + '" }', 500)
      await tool('page_patch', `:root { --accent: ${c} }`, 650)
      document.documentElement.style.setProperty('--accent', c)
      document.documentElement.style.setProperty('--accent2', `color-mix(in srgb, ${c} 78%, black)`)
      await say(`强调色已经换成${name}。这是页面上的临时修改，刷新就会恢复；在真实项目里我会直接改你的 CSS 变量，热更新后就能看到。再说一次「换颜色」会换下一种。`)
    } else if (/live|候选|版本|变体|方案/i.test(text)) {
      const el = target || heroTitle
      await think(900)
      await tool('Read', target ? selOf(el) : 'index.html › h1#heroTitle', 500)
      await tool('Edit', 'index.html  +12 −1  (data-ph-live)', 800)
      await tool('live_update', '{ status: "ready", variants: 3 }', 400)
      startLive(el)
      await say('写好了 3 个候选：Light 细字重、Signal 青色发光、Mono 等宽大写。在页面底部的 Live 栏里切换（也可以用 ← →），满意就点「采用」，不满意就「放弃」。')
    } else if (/报告|评审|review|report|产物|总结/i.test(text)) {
      await think(800)
      await tool('list_review', `${st.pins.length} 条意见`, 500)
      await tool('write_artifact', 'page-review.md', 800)
      const v = writeArtifact('page-review.md', reviewMd())
      const b = $('#phArtBadge')
      b.textContent = String(artifacts.length)
      b.hidden = false
      await say(`评审报告写好了（page-review.md v${v}），汇总了页面上的 ${st.pins.length} 条意见和 Live 的采用情况。`, '<br><button type="button" class="ph-btn" data-open-art style="margin-top:8px">打开产物 →</button>')
    } else if (target && /评论|意见|备注|note|钉/i.test(text)) {
      await think(600)
      await tool('page_note', `{ selector: "${refs[0].sel}", kind: "建议" }`, 600)
      const note = text.replace(/^(帮我)?(在这里|这里)?(加|写|留)?(一条|个)?(评论|意见|备注)[:：，, ]*/, '') || text
      addPin(target, note, 'Agent')
      await say(`已在 ${refs[0].sel} 上钉了第 ${st.pins.length} 条意见，悬停图钉可以看到内容。`)
    } else {
      await think(700)
      const refLine = refs.length ? `我看到了你引用的 ${refs.map((r) => r.sel).join('、')}。` : ''
      await say(`${refLine}这是一个静态演示页，我只会几个预设动作：换强调色、给元素出 Live 候选、写评审报告、给引用的元素钉评论。\n\n想让真正的 Agent 改你的项目？在终端里运行：\nnpx page-harness http://localhost:5173 --agent claude`)
    }
  }

  async function send(text) {
    text = text.trim()
    if (!text) return
    if (st.busy) { toast('演示 Agent 一次只跑一轮，等它说完'); return }
    st.busy = true
    $('.ph-send').disabled = true
    const refs = st.refs.splice(0)
    renderRefs()
    bubble('ph-m me', refs.map((r) => `<span class="ref">${esc(r.sel)}</span>`).join('') + esc(text))
    try {
      await run(text, refs)
    } finally {
      st.busy = false
      $('.ph-send').disabled = false
    }
  }

  $('#phForm').addEventListener('submit', (e) => {
    e.preventDefault()
    const t = input.value
    input.value = ''
    send(t)
  })
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault()
      $('#phForm').requestSubmit()
    }
  })
  $('#phSugs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-say]')
    if (b) send(b.dataset.say)
  })
  msgs.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-art]')) openPanel('art')
  })

  /* artifacts */
  const artifacts = []
  let activeArt = null

  function inline(s) {
    return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
  }
  function mdToHtml(md) {
    const out = []
    let list = null
    const flush = () => { if (list) { out.push(`<${list.tag}>${list.items.join('')}</${list.tag}>`); list = null } }
    for (const raw of md.split('\n')) {
      const line = raw.trimEnd()
      let m
      if ((m = line.match(/^(#{1,2})\s+(.*)/))) { flush(); out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`) }
      else if ((m = line.match(/^>\s?(.*)/))) { flush(); out.push(`<blockquote>${inline(m[1])}</blockquote>`) }
      else if ((m = line.match(/^(-|\d+\.)\s+(.*)/))) {
        const tag = m[1] === '-' ? 'ul' : 'ol'
        if (!list || list.tag !== tag) { flush(); list = { tag, items: [] } }
        list.items.push(`<li>${inline(m[2])}</li>`)
      } else if (!line) flush()
      else { flush(); out.push(`<p>${inline(line)}</p>`) }
    }
    flush()
    return out.join('')
  }

  function writeArtifact(name, md) {
    let a = artifacts.find((x) => x.name === name)
    if (!a) { a = { name, versions: [] }; artifacts.push(a) }
    a.versions.push(md)
    activeArt = name
    if (!art.hidden) renderArt()
    return a.versions.length
  }

  function renderArt() {
    const a = artifacts.find((x) => x.name === activeArt) || artifacts[0]
    $('#phTabs').innerHTML = artifacts.map((x) => `<button type="button" data-art="${esc(x.name)}" class="${x === a ? 'on' : ''}">${esc(x.name)}<i>v${x.versions.length}</i></button>`).join('')
    $('#phArtBody').innerHTML = mdToHtml(a.versions.at(-1))
    $('#phArtMeta').textContent = `.page-harness/artifacts/${a.name}/v${a.versions.length}`
  }
  $('#phTabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-art]')
    if (!b) return
    activeArt = b.dataset.art
    renderArt()
  })
  const currentMd = () => (artifacts.find((x) => x.name === activeArt) || artifacts[0]).versions.at(-1)
  $('#phArtCopy').addEventListener('click', async () => { await copyText(currentMd()); toast('已复制 Markdown') })
  $('#phArtDl').addEventListener('click', () => {
    const blob = new Blob([currentMd()], { type: 'text/markdown' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = activeArt || artifacts[0].name
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  })

  function reviewMd() {
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
    const pins = st.pins.length
      ? st.pins.map((p) => `- **#${p.n}** \`${p.sel}\` — ${p.text}（${p.who}）`).join('\n')
      : '- 还没有意见。用「取点」→「评论」在页面上钉一条试试。'
    return `# 页面评审 · page-harness 首页

> 由演示 Agent 生成 · ${stamp}

## 概览

- 意见：**${st.pins.length}** 条
- Live 候选：采用 **${st.stats.adopted}** 次 / 放弃 **${st.stats.discarded}** 次
- 当前强调色：\`${accent}\`

## 意见

${pins}

## 建议

- 首屏命令可以加上 \`--open\`，少一步手动打开浏览器。
- 架构图在窄屏上需要横向滚动，可以考虑改成纵向排列。
- 「安全模型」八条信息密度较高，可以给每条加一个图标帮助扫读。
`
  }

  writeArtifact('welcome.md', `# 欢迎来到产物窗

这里展示 Agent 通过 MCP 写下的文件。真实的 page-harness 里，产物保存在 \`.page-harness/artifacts\`，每次写入都会多一个版本。

## 支持的预览

- **Markdown**：报告、方案、评审结论
- **沙箱 HTML**：原型，可切换桌面 / 手机宽度
- **JSON**：结构化树状浏览
- **代码与图片**：高亮、复制、下载

> 试试在「对话」里说「写一份页面评审报告到产物」，报告会出现在新的标签页里。
`)

  dock.classList.add('attn')
})()
