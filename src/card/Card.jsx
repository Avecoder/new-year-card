import SnowCanvas from '../SnowCanvas'
import { PUBLIC_PNGS } from './publicPngs'
import { IQ_ENABLED } from '../config'

function safeText(s) {
  if (typeof s !== 'string') return ''
  return s
}

function hashString(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const STICKERS = ['🎄', '⭐️', '🎁', '🕯️', '❄️', '🍪', '🥂', '🧣', '🧤', '🍊', '✨']

export default function Card({
  template,
  toName,
  fromName,
  message,
  flipped,
  snowEnabled,
  snowDensity,
}) {
  const to = safeText(toName).trim()
  const from = safeText(fromName).trim()
  const msg = safeText(message).trim()
  const sticker = STICKERS[hashString(`${template.id}|${to}|${from}|${msg}`) % STICKERS.length]
  const pngSrc = PUBLIC_PNGS.length
    ? PUBLIC_PNGS[hashString(`png|${template.id}|${to}|${from}|${msg}`) % PUBLIC_PNGS.length]
    : ''
  const showIq = Boolean(IQ_ENABLED)

  return (
    <div className={`card-wrap ${template.className}`}>
      <div className={`card-3d ${flipped ? 'is-flipped' : ''}`}>
        <div className="card-face card-front" aria-label="Обложка открытки">
          {snowEnabled && <SnowCanvas density={snowDensity} />}
          {showIq && <img className="card-iq" src="/iq.svg" alt="" aria-hidden="true" draggable="false" />}
          {pngSrc && (
            <img
              className="card-right-png"
              src={encodeURI(pngSrc)}
              alt=""
              aria-hidden="true"
              draggable="false"
            />
          )}
          <div className="card-sticker" aria-hidden="true">
            {sticker}
          </div>
          <div className="card-front-content">
            <div className="card-kicker">2026</div>
            <div className="card-title">С Новым годом</div>
            <div className="card-subtitle">и пусть будет тепло внутри</div>
          </div>
          <div className="card-decoration" aria-hidden="true" />
        </div>

        <div className="card-face card-inside" aria-label="Текст открытки">
          <div className="inside-header">
            <div className="inside-to">
              <div className="inside-label">Кому</div>
              <div className="inside-value">{to || '…'}</div>
            </div>
            <div className="inside-to">
              <div className="inside-label">От кого</div>
              <div className="inside-value">{from || '…'}</div>
            </div>
          </div>

          <div className="inside-message">
            {msg || 'Напиши пару тёплых строк — они появятся здесь.'}
          </div>

          <div className="inside-footer" aria-hidden="true">
            <div className="inside-mark" />
            <div className="inside-mark" />
            <div className="inside-mark" />
          </div>
        </div>
      </div>
    </div>
  )
}


