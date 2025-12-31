import { useEffect, useMemo, useRef, useState } from 'react'
import Card from './Card'
import { getTemplateById } from './templates'

const WISHES = [
  'Пусть Новый год принесёт спокойствие, тепло и людей, с которыми легко.',
  'Пусть в 2026 будет больше радости, меньше суеты и больше поводов улыбаться.',
  'Пусть мечты становятся планами, планы — делами, а дела — любимыми.',
  'Желаю здоровья, вдохновения и сил на то, что действительно важно.',
  'Пусть будет уютно внутри — и дома тоже. С Новым годом!',
  'Пусть каждый день будет чуть лучше вчерашнего. А праздников — чуть больше, чем надо.',
  'Пусть рядом будут “свои” люди, и будет время на себя.',
]

export default function Editor({
  templateId,
  toName,
  fromName,
  message,
  flipped,
  snowEnabled,
  snowDensity,
  onChange,
  onBack,
  onFlip,
  onCopyLink,
  saveState = 'idle',
}) {
  const template = useMemo(() => getTemplateById(templateId), [templateId])
  const [expanded, setExpanded] = useState(false)
  const animRef = useRef(false)
  const timersRef = useRef([])

  useEffect(() => {
    // если карточка закрыта — сбрасываем expanded
    if (!flipped) setExpanded(false)
  }, [flipped])

  useEffect(() => {
    return () => {
      for (const t of timersRef.current) window.clearTimeout(t)
      timersRef.current = []
    }
  }, [])

  const copy = async () => {
    await onCopyLink()
  }

  const saveLabel =
    saveState === 'saving'
      ? 'Сохраняем…'
      : saveState === 'saved'
        ? 'Скопировано ✓'
        : saveState === 'error'
          ? 'Ошибка — повторить'
          : 'Сохранить и скопировать'

  const generateWish = () => {
    const to = (toName || '').trim()
    const from = (fromName || '').trim()
    const base = WISHES[Math.floor(Math.random() * WISHES.length)]
    const prefix = to ? `${to}, ` : ''
    const suffix = from ? `\n\n— ${from}` : ''
    onChange({ message: `${prefix}${base}${suffix}` })
  }

  const flipMs = 700
  const expandMs = 420
  const toggleCard = () => {
    if (animRef.current) return
    animRef.current = true
    for (const t of timersRef.current) window.clearTimeout(t)
    timersRef.current = []

    if (!flipped) {
      // flip -> expand
      onFlip()
      timersRef.current.push(window.setTimeout(() => setExpanded(true), flipMs))
      timersRef.current.push(window.setTimeout(() => { animRef.current = false }, flipMs + expandMs))
    } else {
      // shrink -> flip back
      setExpanded(false)
      timersRef.current.push(window.setTimeout(() => onFlip(), expandMs))
      timersRef.current.push(window.setTimeout(() => { animRef.current = false }, expandMs + flipMs))
    }
  }

  return (
    <div className="page page-editor">
      <header className="topbar">
        <button type="button" className="btn" onClick={onBack}>
          ← Назад
        </button>
        <div className="topbar-center">
          <div className="topbar-title">{template.name}</div>
          <div className="topbar-sub">{template.tagline}</div>
        </div>
        <button type="button" className="btn btn-primary" onClick={copy} disabled={saveState === 'saving'}>
          {saveLabel}
        </button>
      </header>

      <div className="editor-grid">
        <section className="preview">
          <div className="preview-stage" onClick={toggleCard} role="button" tabIndex={0}>
            <Card
              template={template}
              toName={toName}
              fromName={fromName}
              message={message}
              flipped={flipped}
              expanded={expanded}
              snowEnabled={snowEnabled}
              snowDensity={snowDensity}
            />
          </div>
          <div className="preview-hint">Клик по открытке — перевернуть</div>
        </section>

        <section className="controls" aria-label="Настройки открытки">
          <div className="control-group">
            <label className="label">
              Кому
              <input
                className="input"
                value={toName}
                onChange={(e) => onChange({ toName: e.target.value })}
                placeholder="Например: Диме"
                maxLength={120}
              />
            </label>
            <label className="label">
              От кого
              <input
                className="input"
                value={fromName}
                onChange={(e) => onChange({ fromName: e.target.value })}
                placeholder="Например: от Саши"
                maxLength={120}
              />
            </label>
            <label className="label">
              Пожелание
              <textarea
                className="textarea"
                value={message}
                onChange={(e) => onChange({ message: e.target.value })}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault()
                    copy()
                  }
                }}
                placeholder="Напиши пару тёплых строк…"
                rows={7}
                maxLength={2000}
              />
            </label>
          </div>

          <div className="control-row">
            <button type="button" className="btn" onClick={toggleCard}>
              Перевернуть
            </button>
            <button type="button" className="btn" onClick={generateWish}>
              Сгенерировать
            </button>
            <button
              type="button"
              className={`btn ${snowEnabled ? 'btn-primary' : ''}`}
              onClick={() => onChange({ snowEnabled: !snowEnabled })}
            >
              Снег {snowEnabled ? 'вкл' : 'выкл'}
            </button>
          </div>

          <label className="label">
            Плотность снега
            <input
              className="range"
              type="range"
              min={40}
              max={220}
              step={10}
              value={snowDensity}
              onChange={(e) => onChange({ snowDensity: Number(e.target.value) })}
              disabled={!snowEnabled}
            />
          </label>

          <div className="small">
            Подсказка: Ctrl/⌘ + Enter — быстро сохранить и скопировать ссылку.
          </div>
        </section>
      </div>
    </div>
  )
}


