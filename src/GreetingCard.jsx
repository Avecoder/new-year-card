import { useEffect } from 'react'
import './GreetingCard.css'

const greetingArt = `
╔═══════════════════════════════════════╗
║                                       ║
║        С  Н О В Ы М  Г О Д О М !     ║
║                                       ║
╚═══════════════════════════════════════╝
`

function GreetingCard({ open, onClose, onShare, onCopyLink }) {
  if (!open) return null

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="greeting-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Новогодняя открытка"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      <div className="greeting-card">
        <button className="greeting-close" type="button" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>

        <pre className="greeting-art" aria-hidden="true">{greetingArt}</pre>

        <div className="greeting-text">
          <p>
            Пусть в новом году будет больше тёплых встреч, спокойных дней и поводов гордиться собой.
            Пусть планы сбываются, а рядом будут люди, с которыми легко.
          </p>
          <p>
            Желаю здоровья, вдохновения и сил на то, что действительно важно. С Новым годом!
          </p>
        </div>

        <div className="greeting-year" aria-hidden="true">
          <pre>{`
    ██╗  ██╗ ██████╗ ██████╗ ██████╗ 
    ╚██╗██╔╝██╔═══██╗██╔══██╗██╔══██╗
     ╚███╔╝ ██║   ██║██║  ██║██████╔╝
     ██╔██╗ ██║   ██║██║  ██║██╔══██╗
    ██╔╝ ██╗╚██████╔╝██████╔╝██████╔╝
    ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═════╝ 
        `}</pre>
        </div>

        <div className="greeting-signature">
          <pre>{`
С наилучшими пожеланиями
          `}</pre>
        </div>

        <div className="greeting-actions">
          <button className="btn btn-primary" type="button" onClick={onShare}>
            Поделиться
          </button>
          <button className="btn btn-ghost" type="button" onClick={onCopyLink}>
            Скопировать ссылку
          </button>
        </div>
      </div>
    </div>
  )
}

export default GreetingCard
