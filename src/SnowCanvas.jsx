import { useEffect, useRef } from 'react'

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

export default function SnowCanvas({ enabled = true, density = 140 }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const stateRef = useRef({
    w: 0,
    h: 0,
    dpr: 1,
    t: 0,
    wind: 0,
    windTarget: 0,
    flakes: [],
  })

  useEffect(() => {
    if (!enabled) return
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (reduceMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const S = stateRef.current

    const resize = () => {
      const parent = canvas.parentElement
      const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect()
      const w = Math.max(1, Math.floor(rect.width))
      const h = Math.max(1, Math.floor(rect.height))
      const dpr = clamp(window.devicePixelRatio || 1, 1, 2)

      S.w = w
      S.h = h
      S.dpr = dpr

      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Переинициализируем количество снежинок под новую площадь
      const targetCount = Math.floor((w * h) / 8000) + density
      const next = []
      for (let i = 0; i < targetCount; i += 1) {
        next.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 2.2 + 0.6,
          v: Math.random() * 36 + 22, // px/s
          drift: (Math.random() * 2 - 1) * 14, // px/s
          phase: Math.random() * Math.PI * 2,
          tw: Math.random() * 0.6 + 0.2,
          a: Math.random() * 0.55 + 0.25,
        })
      }
      S.flakes = next
    }

    const onPointerMove = (e) => {
      // ветер по X, очень мягкий
      const x = typeof e.clientX === 'number' ? e.clientX : S.w / 2
      const k = (x / Math.max(1, S.w)) * 2 - 1
      S.windTarget = clamp(k * 32, -32, 32) // px/s
    }

    const onPointerLeave = () => {
      S.windTarget = 0
    }

    const step = (now) => {
      const t = now / 1000
      const dt = S.t ? clamp(t - S.t, 0, 0.033) : 0.016
      S.t = t

      // плавно догоняем ветер
      S.wind += (S.windTarget - S.wind) * clamp(dt * 6, 0, 1)

      ctx.clearRect(0, 0, S.w, S.h)

      // чуть “светящийся” снег на чёрном
      ctx.save()
      // На светлом пастельном фоне лучше читается обычный слой + тонкая обводка
      ctx.globalCompositeOperation = 'source-over'

      for (const f of S.flakes) {
        f.phase += dt * f.tw
        const sway = Math.sin(f.phase) * 8

        f.x += (f.drift + S.wind) * dt + sway * dt
        f.y += f.v * dt

        // wrap
        if (f.y - f.r > S.h) {
          f.y = -f.r
          f.x = Math.random() * S.w
        }
        if (f.x < -20) f.x = S.w + 20
        if (f.x > S.w + 20) f.x = -20

        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${f.a})`
        ctx.strokeStyle = 'rgba(30, 60, 70, 0.14)'
        ctx.lineWidth = 1
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fill()
        if (f.r >= 1.2) ctx.stroke()
      }

      ctx.restore()

      rafRef.current = window.requestAnimationFrame(step)
    }

    resize()
    rafRef.current = window.requestAnimationFrame(step)

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)

    return () => {
      window.cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [enabled, density])

  return <canvas ref={canvasRef} className="snow-canvas" aria-hidden="true" />
}


