const KEY = 'savedCards'

function safeJsonParse(s) {
  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}

export function loadSavedCards() {
  const raw = window.localStorage?.getItem(KEY)
  const parsed = raw ? safeJsonParse(raw) : null
  const list = Array.isArray(parsed) ? parsed : []
  return list
    .filter((x) => x && typeof x.uid === 'string')
    .map((x) => ({
      uid: String(x.uid),
      remoteId: x.remoteId ? String(x.remoteId) : '',
      templateId: String(x.templateId ?? ''),
      toName: String(x.toName ?? ''),
      fromName: String(x.fromName ?? ''),
      updatedAt: Number(x.updatedAt ?? 0) || 0,
    }))
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
}

export function saveCards(list) {
  window.localStorage?.setItem(KEY, JSON.stringify(list))
}

export function upsertSavedCard(next) {
  const list = loadSavedCards()
  const idx = list.findIndex((c) => c.uid === next.uid)
  const item = {
    uid: next.uid,
    remoteId: next.remoteId ? String(next.remoteId) : '',
    templateId: String(next.templateId ?? ''),
    toName: String(next.toName ?? ''),
    fromName: String(next.fromName ?? ''),
    updatedAt: Date.now(),
  }
  if (idx >= 0) list[idx] = { ...list[idx], ...item }
  else list.unshift(item)
  // не раздуваем хранилище
  const trimmed = list.slice(0, 30)
  saveCards(trimmed)
  return trimmed
}


