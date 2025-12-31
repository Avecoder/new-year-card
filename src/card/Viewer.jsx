import { useEffect, useMemo, useRef, useState } from 'react'
import Card from './Card'
import { getTemplateById } from './templates'

export default function Viewer({ templateId, toName, fromName, message, snowEnabled, snowDensity, flipped: flippedFromUrl }) {
  const template = useMemo(() => getTemplateById(templateId), [templateId])
  const [flipped, setFlipped] = useState(!!flippedFromUrl)
  const [expanded, setExpanded] = useState(false)
  const [canExpand, setCanExpand] = useState(false)
  const animRef = useRef(false)
  const timersRef = useRef([])

  useEffect(() => {
    if (!flipped) setExpanded(false)
  }, [flipped])

  useEffect(() => {
    return () => {
      for (const t of timersRef.current) window.clearTimeout(t)
      timersRef.current = []
    }
  }, [])

  const flipMs = 700
  const expandMs = 420
  const toggle = () => {
    if (animRef.current) return
    animRef.current = true
    for (const t of timersRef.current) window.clearTimeout(t)
    timersRef.current = []

    if (!flipped) {
      setFlipped(true)
      if (canExpand) {
        timersRef.current.push(window.setTimeout(() => setExpanded(true), flipMs))
        timersRef.current.push(window.setTimeout(() => { animRef.current = false }, flipMs + expandMs))
      } else {
        timersRef.current.push(window.setTimeout(() => { animRef.current = false }, flipMs))
      }
    } else {
      if (expanded) {
        setExpanded(false)
        timersRef.current.push(window.setTimeout(() => setFlipped(false), expandMs))
        timersRef.current.push(window.setTimeout(() => { animRef.current = false }, expandMs + flipMs))
      } else {
        setFlipped(false)
        timersRef.current.push(window.setTimeout(() => { animRef.current = false }, flipMs))
      }
    }
  }

  return (
    <div className="page page-view">
      <div className="view-stage">
        <div
          className="view-card"
          onClick={toggle}
          role="button"
          tabIndex={0}
          aria-label="Открытка. Клик — перевернуть."
        >
          <Card
            template={template}
            toName={toName}
            fromName={fromName}
            message={message}
            flipped={flipped}
            expanded={expanded}
            onSizeInfo={({ base, desired }) => {
              if (!base || !desired) return
              setCanExpand(desired > base + 4)
            }}
            snowEnabled={snowEnabled}
            snowDensity={snowDensity}
          />
        </div>
        <div className="view-hint">Клик по открытке — перевернуть</div>
      </div>
    </div>
  )
}


