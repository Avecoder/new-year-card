import './festiveLoader.css'

export default function FestiveLoader() {
  return (
    <div className="festive-loader" role="status" aria-live="polite" aria-label="Загрузка">
      <div className="festive-loader-row" aria-hidden="true">
        <span className="flake flake-1">❄</span>
        <span className="flake flake-2">✦</span>
        <span className="flake flake-3">❄</span>
      </div>
      <div className="festive-loader-tree" aria-hidden="true">
        <span className="tree">🎄</span>
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  )
}


