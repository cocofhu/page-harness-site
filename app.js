(() => {
  const $ = (s) => document.querySelector(s)
  const film = $('#film'), stage = $('#stage'), world = $('#world'), win = $('#win'), vp = $('#vp'), app = $('#app')
  const opening = $('#opening'), opWord = $('#opWord')
  const h1 = $('#h1'), cands = [...document.querySelectorAll('.cand')], below = $('#below')
  const pop = $('#pop'), popLive = $('#popLive'), design = $('#design'), designGo = $('#designGo'), typed = $('#typed'), work = $('#work')
  const ctrl = $('#ctrl'), ctrlIdx = $('#ctrlIdx'), ctrlLabel = $('#ctrlLabel'), ctrlNext = $('#ctrlNext'), ctrlCompare = $('#ctrlCompare'), ctrlAccept = $('#ctrlAccept')
  const pro = $('#pro'), proPrice = $('#proPrice'), proBtn = $('#proBtn'), pin1 = $('#pin1'), pin2 = $('#pin2')
  const thread = $('#thread'), reply = $('#reply'), tDone = $('#tDone'), tAgent = document.querySelector('.t-agent')
  const code = $('#code'), codeAt = [...code.querySelectorAll('[data-at]')]
  const wires = [...document.querySelectorAll('.wires path')], packets = $('.wires .pk')
  const nodes = ['#nA1', '#nA2', '#nA3', '#nDev'].map($), tags = [$('#tagMcp'), $('#tagProxy')], portChip = $('#portChip')
  const finale = $('#finale'), sel = $('#sel'), selTag = $('#selTag'), cursor = $('#cursor')
  const dockPick = $('#dockPick'), noteCount = $('#noteCount'), vtoast = $('#vtoast')
  const bubble = $('#bubble'), bubbleText = $('#bubbleText')
  const caption = $('#caption'), capN = $('#capN'), capT = $('#capT'), capL = $('#capL'), rail = $('#rail'), barFill = $('#barFill')

  const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x)
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  const r = (p, a, b) => clamp((p - a) / (b - a))
  const er = (p, a, b) => ease(r(p, a, b))
  const lerp = (a, b, t) => a + (b - a) * t
  const within = (p, a, b) => p >= a && p < b

  // camera keyframes: [progress, centerX, centerY, zoom] in world units
  const CAM = [
    [0, 800, 470, 1], [0.085, 800, 905, 1.18], [0.13, 780, 790, 1.55], [0.2, 800, 790, 1.5],
    [0.215, 900, 800, 1.32], [0.31, 900, 800, 1.32], [0.36, 800, 800, 1.45], [0.445, 800, 800, 1.45],
    [0.49, 800, 880, 1.12], [0.535, 800, 880, 1.12], [0.575, 1130, 880, 0.98], [0.635, 1130, 880, 0.98],
    [0.675, 800, 930, 1.3], [0.775, 820, 930, 1.3], [0.825, 790, 900, 0.6], [0.89, 790, 900, 0.6],
    [0.94, 800, 975, 0.98], [1, 800, 975, 0.98],
  ]
  const SCENES = [
    { a: 0, b: 0.1, t: '开场', go: 0 },
    { a: 0.1, b: 0.205, n: '01', t: '取点', l: '点一下，它就知道你说的是哪个元素', go: 0.17 },
    { a: 0.205, b: 0.37, n: '02', t: '描述', l: '说一句想要什么，Agent 开始写', go: 0.29 },
    { a: 0.37, b: 0.545, n: '03', t: 'Live 候选', l: '几个版本直接写进源码，原位切换或并排对比', go: 0.5 },
    { a: 0.545, b: 0.645, n: '04', t: '采用', l: '留下选中的，其余自动清理', go: 0.625 },
    { a: 0.645, b: 0.795, n: '05', t: '评审', l: '意见钉在页面上，Agent 回复并修好', go: 0.775 },
    { a: 0.795, b: 0.9, n: '06', t: '驱动', l: '你本机已登录的 Claude Code、Codex、Cursor Agent', go: 0.87 },
    { a: 0.9, b: 1.01, n: '07', t: '轮到你', l: '点右下角「取点」，选中页面上任何东西', go: 1 },
  ]
  const H1_NAMES = ['原版', '渐变强调', '大小对比', '荧光标记']
  const PROMPT = '更有冲击力一点，出 3 个风格差异明显的版本'
  const REPLY = '已把价格放大到 46px，加上「最受欢迎」角标，卡片也更突出了。'
  const CLICKS = [0.155, 0.195, 0.305, 0.395, 0.425, 0.45, 0.535]

  let vw = 0, vh = 0, fit = 1, S = 1, tx = 0, ty = 0, stageBox

  const measure = () => {
    vw = stage.clientWidth
    vh = stage.clientHeight
    fit = vw < vh ? Math.min(vw / 1320, vh / 900) : Math.min(vw / 1440, vh / 900)
  }

  const camAt = (p) => {
    for (let i = 0; i < CAM.length - 1; i++) {
      const [a, ...A] = CAM[i], [b, ...B] = CAM[i + 1]
      if (p <= b) {
        const t = ease(r(p, a, b))
        return A.map((v, k) => lerp(v, B[k], t))
      }
    }
    return CAM[CAM.length - 1].slice(1)
  }

  const wr = (el) => {
    const b = el.getBoundingClientRect()
    return { x: (b.left - stageBox.left - tx) / S, y: (b.top - stageBox.top - ty) / S, w: b.width / S, h: b.height / S }
  }
  const vr = (el) => {
    const b = el.getBoundingClientRect(), v = vp.getBoundingClientRect(), k = v.width / 1120
    return { x: (b.left - v.left) / k, y: (b.top - v.top) / k, w: b.width / k, h: b.height / k }
  }
  const place = (el, x, y) => { el.style.left = `${x}px`; el.style.top = `${y}px` }
  const setSel = (rc, pad = 8) => {
    sel.style.transform = `translate(${rc.x - pad}px, ${rc.y - pad}px)`
    sel.style.width = `${rc.w + pad * 2}px`
    sel.style.height = `${rc.h + pad * 2}px`
  }

  // cursor path: [progress, target, fx, fy]
  const CK = [
    [0.125, () => h1, 1.05, 1.9], [0.15, () => h1, 0.62, 0.55], [0.165, () => h1, 0.62, 0.55],
    [0.19, () => popLive, 0.5, 0.55], [0.2, () => popLive, 0.5, 0.55],
    [0.225, () => designGo, 0.2, -3], [0.295, () => designGo, 0.45, 0.5], [0.315, () => designGo, 0.45, 0.5],
    [0.345, () => h1, 0.9, 1.8], [0.385, () => ctrlNext, 0.5, 0.5], [0.43, () => ctrlNext, 0.5, 0.5],
    [0.443, () => ctrlCompare, 0.5, 0.55], [0.46, () => ctrlCompare, 0.5, 0.55],
    [0.52, () => ctrlAccept, 0.5, 0.55], [0.545, () => ctrlAccept, 0.5, 0.55], [0.565, () => ctrlAccept, 1.5, 3],
  ]
  const cursorAt = (p) => {
    if (p <= CK[0][0]) return CK[0]
    for (let i = 0; i < CK.length - 1; i++) {
      if (p <= CK[i + 1][0]) return [CK[i], CK[i + 1], ease(r(p, CK[i][0], CK[i + 1][0]))]
    }
    return CK[CK.length - 1]
  }
  const pt = (k) => { const rc = wr(k[1]()); return [rc.x + rc.w * k[2], rc.y + rc.h * k[3]] }

  let live = false

  function render(p) {
    stageBox = stage.getBoundingClientRect()
    const [cx, cy, z] = camAt(p)
    const portrait = vw < vh
    S = fit * z * (portrait ? 1 + 0.45 * clamp((z - 0.6) / 0.4) : 1)
    tx = vw / 2 - cx * S
    ty = vh * (portrait ? 0.44 : 0.5) - cy * S
    world.style.transform = `translate(${tx}px, ${ty}px) scale(${S})`

    const o = er(p, 0.03, 0.08)
    opening.style.opacity = 1 - o
    opening.style.transform = `translateY(${-70 * o}px)`
    opWord.classList.toggle('off', p >= 0.06)
    const tilt = er(p, 0, 0.085)
    win.style.transform = `rotateX(${lerp(24, 0, tilt)}deg) scale(${lerp(0.92, 1, tilt)})`

    // the demo app
    const scroll = -300 * er(p, 0.645, 0.685) * (1 - er(p, 0.8, 0.84))
    app.style.transform = `translateY(${scroll}px)`
    const v = p < 0.37 ? 0 : p < 0.395 ? 1 : p < 0.425 ? 2 : 3
    if (!live) h1.dataset.v = v
    h1.classList.toggle('shimmer', within(p, 0.32, 0.37))
    const showCands = within(p, 0.45, 0.575)
    const fan = er(p, 0.45, 0.5) * (1 - er(p, 0.545, 0.575))
    $('#cands').style.opacity = showCands ? 1 : 0
    h1.style.opacity = showCands ? 0 : 1
    const fade = 1 - er(p, 0.545, 0.565)
    cands.forEach((c, i) => {
      c.style.transform = `translateY(${i * 108 * fan}px)`
      c.style.opacity = i === 3 ? 1 : fade
    })
    below.style.transform = `translateY(${324 * fan}px)`
    pro.classList.toggle('fixed', p >= 0.75)

    // caption, rail, progress
    const si = SCENES.findIndex((s) => p >= s.a && p < s.b)
    setScene(si)
    barFill.style.transform = `scaleX(${p})`

    // code diff
    code.style.opacity = er(p, 0.565, 0.59) * (1 - er(p, 0.635, 0.655))
    code.style.transform = `translateX(${lerp(80, 0, er(p, 0.565, 0.6))}px)`
    codeAt.forEach((el) => el.classList.toggle('on', p >= +el.dataset.at))

    // architecture
    nodes.forEach((n, i) => {
      const t = er(p, 0.8 + i * 0.012, 0.83 + i * 0.012) * (1 - er(p, 0.885, 0.905))
      n.style.opacity = t
      n.style.transform = `translateX(${(1 - t) * (i < 3 ? -50 : 50)}px) scale(${lerp(0.9, 1, t)})`
    })
    const draw = er(p, 0.815, 0.86) * (1 - er(p, 0.885, 0.905))
    wires.forEach((w) => { w.style.strokeDashoffset = 1 - draw })
    packets.classList.toggle('on', draw > 0.97)
    const tagT = er(p, 0.84, 0.86) * (1 - er(p, 0.885, 0.9))
    tags.forEach((t) => { t.style.opacity = tagT })
    portChip.style.opacity = er(p, 0.82, 0.85) * (1 - er(p, 0.885, 0.905))

    const f = er(p, 0.91, 0.95)
    finale.style.opacity = f
    finale.style.transform = `translateY(${lerp(24, 0, f)}px)`

    if (p >= 0.935 && !live) enterLive()
    else if (p < 0.93 && live) exitLive()
    if (live) return

    // scripted overlay
    dockPick.classList.toggle('on', within(p, 0.1, 0.205))
    const notes = p >= 0.7 ? 2 : p >= 0.68 ? 1 : 0
    noteCount.textContent = notes
    noteCount.classList.toggle('zero', !notes)

    const hb = vr(h1)
    pop.classList.toggle('on', within(p, 0.16, 0.205))
    place(pop, hb.x, hb.y + hb.h + 12)
    popLive.classList.toggle('hover', within(p, 0.185, 0.205))

    design.classList.toggle('on', within(p, 0.205, 0.32))
    typed.textContent = PROMPT.slice(0, Math.round(PROMPT.length * r(p, 0.22, 0.29)))
    designGo.classList.toggle('hover', within(p, 0.295, 0.32))
    designGo.classList.toggle('down', Math.abs(p - 0.305) < 0.004)
    work.classList.toggle('on', within(p, 0.32, 0.37))

    ctrl.classList.toggle('on', within(p, 0.37, 0.545))
    const cv = showCands ? 3 : v
    ctrlIdx.textContent = `${Math.max(cv, 1)}/3`
    ctrlLabel.textContent = H1_NAMES[Math.max(cv, 1)]
    ctrlCompare.textContent = p >= 0.45 ? '原位切换' : '并排对比'
    ctrlCompare.style.display = ''
    place(ctrl, hb.x + hb.w / 2 - ctrl.offsetWidth / 2, hb.y - 56)
    ctrlNext.classList.toggle('hover', within(p, 0.385, 0.432))
    ctrlCompare.classList.toggle('hover', within(p, 0.443, 0.46))
    ctrlAccept.classList.toggle('hover', within(p, 0.525, 0.545))

    // review
    const pr = vr(proPrice), pb = vr(proBtn), pc = vr(pro)
    place(pin1, pr.x + pr.w + 8, pr.y - 8)
    place(pin2, pb.x + pb.w - 14, pb.y - 14)
    pin1.classList.toggle('on', within(p, 0.68, 0.8))
    pin2.classList.toggle('on', within(p, 0.7, 0.8))
    pin1.classList.toggle('done', p >= 0.77)
    pin1.textContent = p >= 0.77 ? '✓' : '1'
    thread.classList.toggle('on', within(p, 0.69, 0.795))
    place(thread, pc.x - 306, pc.y - 10)
    tAgent.classList.toggle('on', p >= 0.71)
    reply.textContent = REPLY.slice(0, Math.round(REPLY.length * r(p, 0.71, 0.75)))
    tDone.classList.toggle('on', p >= 0.77)

    // selection frame: flies from the opening headline into the app
    const selOn = within(p, 0.06, 0.37)
    sel.style.opacity = selOn ? 1 : 0
    if (selOn) {
      const a = wr(opWord), b = wr(h1), t = er(p, 0.06, 0.13), pad = lerp(0, 8, t)
      setSel({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) }, pad)
      selTag.textContent = t < 0.5 ? 'h1 · picked' : 'h1.hero-title'
    }

    // scripted cursor
    const cOn = within(p, 0.12, 0.565)
    cursor.style.opacity = cOn ? r(p, 0.12, 0.13) * (1 - r(p, 0.555, 0.565)) : 0
    if (cOn) {
      const c = cursorAt(p)
      let x, y
      if (Array.isArray(c[0])) {
        const [ax, ay] = pt(c[0]), [bx, by] = pt(c[1])
        x = lerp(ax, bx, c[2]); y = lerp(ay, by, c[2])
      } else [x, y] = pt(c)
      cursor.style.transform = `translate(${x - 4}px, ${y - 3}px)`
      cursor.classList.toggle('down', CLICKS.some((k) => Math.abs(p - k) < 0.005))
    }
  }

  // caption + rail
  let sceneIdx = -1, swapTimer
  SCENES.forEach((s, i) => {
    const b = document.createElement('button')
    b.type = 'button'
    b.innerHTML = `<span>${s.t}</span><i></i>`
    b.addEventListener('click', () => goto(i))
    rail.appendChild(b)
  })
  const railBtns = [...rail.children]
  function setScene(i) {
    if (i === sceneIdx) return
    sceneIdx = i
    railBtns.forEach((b, k) => b.classList.toggle('on', k === i))
    const s = SCENES[i]
    clearTimeout(swapTimer)
    if (!s || !s.n) { caption.classList.remove('on'); return }
    caption.classList.add('swap')
    swapTimer = setTimeout(() => {
      capN.textContent = s.n
      capT.textContent = s.t
      capL.textContent = s.l
      caption.classList.remove('swap')
      caption.classList.add('on')
    }, caption.classList.contains('on') ? 150 : 0)
  }
  function goto(i) {
    const max = film.offsetHeight - innerHeight
    scrollTo({ top: film.offsetTop + SCENES[i].go * max, behavior: 'smooth' })
  }
  document.querySelectorAll('[data-goto]').forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); goto(+el.dataset.goto) }))

  // smoothed scroll → progress
  let target = 0, cur = -1, dirty = true
  const readScroll = () => {
    const max = film.offsetHeight - innerHeight
    target = clamp((scrollY - film.offsetTop) / max)
  }
  function loop() {
    readScroll()
    if (cur < 0) cur = target
    cur += (target - cur) * 0.14
    if (Math.abs(target - cur) < 0.00015) cur = target
    if (dirty || cur !== loop.last) {
      render(cur)
      loop.last = cur
      dirty = false
    }
    requestAnimationFrame(loop)
  }
  addEventListener('resize', () => { measure(); dirty = true })

  // ───────── hands-on mode ─────────
  const VARIANTS = {
    h1: ['朴素', '渐变强调', '大小对比', '荧光标记'],
    sub: ['原版', '一句话', '加重'],
    cta: ['原版', '紫色胶囊', '渐变大号'],
    pro: ['原版', '深色反转', '橙色角标'],
    pill: ['原版', '描边', '渐变'],
  }
  let picking = false, locked = null, session = null, userPins = 0, toastTimer
  const vt = (text) => {
    vtoast.textContent = text
    vtoast.classList.add('on')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => vtoast.classList.remove('on'), 2200)
  }
  function enterLive() {
    live = true
    stage.classList.add('live')
    cursor.style.opacity = 0
    sel.style.opacity = 0
    ;[pop, design, work, ctrl, thread].forEach((el) => el.classList.remove('on'))
    pin1.classList.remove('on'); pin2.classList.remove('on')
    dockPick.classList.remove('on')
    noteCount.textContent = userPins || ''
    vt('轮到你了：点「取点」，再点页面上的任何元素')
  }
  function exitLive() {
    live = false
    stage.classList.remove('live', 'picking')
    picking = false
    locked = null
    if (session) endSession(false)
    bubble.classList.remove('on')
    app.querySelectorAll('[data-pick]').forEach((el) => { if (el !== h1) el.dataset.v = 0 })
    ov.querySelectorAll('.pin.user').forEach((el) => el.remove())
    userPins = 0
    dirty = true
  }
  const ov = $('#ov')
  const setPicking = (on) => {
    picking = on
    stage.classList.toggle('picking', on)
    dockPick.classList.toggle('on', on)
    if (!on) { locked = null; sel.style.opacity = 0; pop.classList.remove('on') }
  }
  const showSel = (el) => {
    setSel(wr(el), 6)
    selTag.textContent = el.dataset.tag
    sel.style.opacity = 1
  }
  dockPick.addEventListener('click', () => {
    if (!live) return
    if (session) endSession(false)
    setPicking(!picking)
    if (picking) vt('移到元素上看高亮，点击选中')
  })
  document.querySelectorAll('.dock button:not(#dockPick)').forEach((b) => b.addEventListener('click', () => {
    if (live) vt('这里只开放「取点」，其余功能在 npx page-harness 里')
  }))
  app.addEventListener('mousemove', (e) => {
    if (!live || !picking || locked) return
    const el = e.target.closest('[data-pick]')
    if (el) showSel(el)
    else sel.style.opacity = 0
  })
  app.addEventListener('mouseleave', () => { if (live && picking && !locked) sel.style.opacity = 0 })
  app.addEventListener('click', (e) => {
    if (!live || !picking) return
    const el = e.target.closest('[data-pick]')
    if (!el) { locked = null; pop.classList.remove('on'); sel.style.opacity = 0; return }
    locked = el
    showSel(el)
    const b = vr(el)
    const y = b.y + b.h + 12 + 44 > 640 ? b.y - 52 : b.y + b.h + 12
    place(pop, clamp(b.x, 12, 1120 - 300), y)
    pop.classList.add('on')
  })
  pop.addEventListener('click', (e) => {
    const act = e.target.closest('button')?.dataset.act
    if (!act || !locked) return
    pop.classList.remove('on')
    if (act === 'quote') { vt('已引用到对话：选择器、文字和 HTML 一起发给 Agent'); return }
    if (act === 'comment') {
      const b = vr(locked)
      place(bubble, clamp(b.x, 12, 1120 - 280), clamp(b.y + b.h + 12, 12, 656 - 130))
      bubbleText.value = ''
      bubble.classList.add('on')
      setTimeout(() => bubbleText.focus(), 50)
      return
    }
    startSession(locked)
  })
  $('#bubbleCancel').addEventListener('click', () => bubble.classList.remove('on'))
  $('#bubbleSave').addEventListener('click', () => {
    if (!locked) return
    const b = vr(locked)
    const pin = document.createElement('span')
    pin.className = 'pin user'
    pin.textContent = ++userPins
    place(pin, b.x + b.w - 10, b.y - 14)
    ov.appendChild(pin)
    requestAnimationFrame(() => pin.classList.add('on'))
    noteCount.textContent = userPins
    noteCount.classList.remove('zero')
    bubble.classList.remove('on')
    vt(bubbleText.value.trim() ? '意见已钉在页面上，Agent 和队友都能看到' : '空白意见也钉上了')
    setPicking(false)
  })

  function startSession(el) {
    const kind = el.dataset.pick
    const orig = +el.dataset.v || 0
    const order = [orig, ...VARIANTS[kind].map((_, i) => i).filter((i) => i !== orig)]
    session = { el, kind, orig, order, i: 1 }
    setPicking(false)
    showSel(el)
    if (el === h1) h1.classList.add('shimmer')
    work.classList.add('on')
    setTimeout(() => {
      if (!session || session.el !== el) return
      h1.classList.remove('shimmer')
      work.classList.remove('on')
      sel.style.opacity = 0
      ctrlCompare.style.display = 'none'
      applySession()
      ctrl.classList.add('on')
    }, 1100)
  }
  function applySession() {
    const s = session
    const n = s.order.length - 1
    s.el.dataset.v = s.order[s.i]
    ctrlIdx.textContent = s.i === 0 ? `原版` : `${s.i}/${n}`
    ctrlLabel.textContent = s.i === 0 ? '当前' : VARIANTS[s.kind][s.order[s.i]]
    requestAnimationFrame(() => {
      const b = vr(s.el)
      place(ctrl, clamp(b.x + b.w / 2 - ctrl.offsetWidth / 2, 10, 1110 - ctrl.offsetWidth), b.y - 56 < 8 ? b.y + b.h + 12 : b.y - 56)
    })
  }
  function endSession(accept) {
    if (!session) return
    if (!accept) session.el.dataset.v = session.orig
    h1.classList.remove('shimmer')
    work.classList.remove('on')
    ctrl.classList.remove('on')
    ctrlCompare.style.display = ''
    session = null
  }
  ctrl.addEventListener('click', (e) => {
    const c = e.target.closest('button')?.dataset.c
    if (!c || !session) return
    const len = session.order.length
    if (c === 'next') { session.i = (session.i + 1) % len; applySession() }
    if (c === 'prev') { session.i = (session.i - 1 + len) % len; applySession() }
    if (c === 'discard') { endSession(false); vt('已放弃，页面恢复原样') }
    if (c === 'accept') { endSession(true); vt('已采用：真实环境里会写回源码并清理标记') }
  })
  addEventListener('keydown', (e) => {
    if (!live || e.key !== 'Escape') return
    if (session) endSession(false)
    bubble.classList.remove('on')
    setPicking(false)
  })

  // copy
  const toast = $('#toast')
  document.querySelectorAll('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(btn.dataset.copy) } catch { return }
    const label = btn.querySelector('.cmd-copy')
    btn.classList.add('copied')
    label.textContent = '已复制'
    toast.textContent = '命令已复制'
    toast.classList.add('show')
    setTimeout(() => { btn.classList.remove('copied'); label.textContent = '复制'; toast.classList.remove('show') }, 1600)
  }))

  measure()
  requestAnimationFrame(loop)
})()
