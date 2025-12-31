import { CARD_TEMPLATES, getTemplateById } from './templates'

export default function Gallery({ onPick, activeTemplateId, savedCards = [], onOpenSaved }) {
  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-dot" aria-hidden="true" />
          <div className="brand-title">Открытки</div>
        </div>
      </header>

      <section className="hero-copy">
        <h1 className="h1">Выбери открытку</h1>
        <p className="p">
          Листай, кликай, пиши пожелания — и делись ссылкой. Без попапов: всё прямо на странице.
        </p>
      </section>

      {savedCards.length > 0 && (
        <section className="rail" aria-label="Мои открытки">
          <div className="section-title">Мои открытки</div>
          <div className="rail-track">
            {savedCards.map((c) => {
              const tpl = getTemplateById(c.templateId)
              return (
              <button
                key={c.uid}
                type="button"
                className={`tile ${tpl.className} tile-saved`}
                onClick={() => onOpenSaved?.(c.uid)}
              >
                <div className="tile-card" aria-hidden="true">
                  <div className="tile-kicker">Сохранено</div>
                  <div className="tile-title">{tpl.name}</div>
                  <div className="tile-sub">Кому: {c.toName || '…'}</div>
                </div>
                <div className="tile-meta">
                  <div className="tile-name">Кому: {c.toName || '…'}</div>
                  <div className="tile-tag">{tpl.tagline}</div>
                </div>
              </button>
              )
            })}
          </div>
        </section>
      )}

      <section className="rail" aria-label="Список открыток">
        <div className="section-title">Шаблоны</div>
        <div className="rail-track">
          {CARD_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`tile ${t.className} ${activeTemplateId === t.id ? 'is-active' : ''}`}
              onClick={() => onPick(t.id)}
            >
              <div className="tile-card" aria-hidden="true">
                <div className="tile-kicker">С Новым годом</div>
                <div className="tile-title">{t.name}</div>
                <div className="tile-sub">{t.tagline}</div>
              </div>
              <div className="tile-meta">
                <div className="tile-name">{t.name}</div>
                <div className="tile-tag">{t.tagline}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <footer className="foot">
        <div className="foot-note">Совет: на странице открытки можно перевернуть её как настоящую.</div>
      </footer>
    </div>
  )
}


