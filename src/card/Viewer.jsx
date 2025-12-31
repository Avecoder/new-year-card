import { useMemo, useState } from 'react'
import Card from './Card'
import { getTemplateById } from './templates'

export default function Viewer({ templateId, toName, fromName, message, snowEnabled, snowDensity, flipped: flippedFromUrl }) {
  const template = useMemo(() => getTemplateById(templateId), [templateId])
  const [flipped, setFlipped] = useState(!!flippedFromUrl)

  return (
    <div className="page page-view">
      <div className="view-stage">
        <div
          className="view-card"
          onClick={() => setFlipped((v) => !v)}
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
            snowEnabled={snowEnabled}
            snowDensity={snowDensity}
          />
        </div>
        <div className="view-hint">Клик по открытке — перевернуть</div>
      </div>
    </div>
  )
}


