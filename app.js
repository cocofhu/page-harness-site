(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

  const nav = document.querySelector('.nav')
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8)
  addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      e.target.classList.add('in')
      io.unobserve(e.target)
    }
  }, { rootMargin: '0px 0px -8% 0px' })
  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`
    io.observe(el)
  })

  const toast = document.getElementById('toast')
  let toastTimer
  const showToast = (text) => {
    toast.textContent = text
    toast.classList.add('show')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800)
  }
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy)
      } catch {
        showToast('复制失败，请手动选择')
        return
      }
      const label = btn.querySelector('.cmd-copy')
      btn.classList.add('copied')
      label.textContent = '已复制'
      showToast('命令已复制到剪贴板')
      setTimeout(() => { btn.classList.remove('copied'); label.textContent = '复制' }, 1600)
    })
  })

  // product tour: real screenshots, auto-advancing with a progress bar
  const imgs = [...document.querySelectorAll('#tour img')]
  const tabs = [...document.querySelectorAll('#tourTabs li')]
  const DURATION = 4800
  let cur = 0
  let elapsed = 0
  let last = 0
  let paused = false
  let visible = false

  const show = (i) => {
    cur = (i + imgs.length) % imgs.length
    elapsed = 0
    imgs.forEach((im, k) => im.classList.toggle('on', k === cur))
    tabs.forEach((t, k) => {
      t.classList.toggle('on', k === cur)
      t.classList.toggle('done', k < cur)
      t.style.setProperty('--p', '0%')
    })
    const next = imgs[(cur + 1) % imgs.length]
    if (next.loading === 'lazy') next.loading = 'eager'
  }

  const tick = (t) => {
    const dt = last ? t - last : 0
    last = t
    if (!paused && visible && !reduced) {
      elapsed += dt
      tabs[cur].style.setProperty('--p', `${Math.min(100, (elapsed / DURATION) * 100)}%`)
      if (elapsed >= DURATION) show(cur + 1)
    }
    requestAnimationFrame(tick)
  }

  tabs.forEach((t, k) => t.querySelector('button').addEventListener('click', () => show(k)))
  const flow = document.getElementById('flow')
  flow.addEventListener('mouseenter', () => { paused = true })
  flow.addEventListener('mouseleave', () => { paused = false })
  new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0.35 }).observe(flow)
  show(0)
  requestAnimationFrame(tick)
})()
