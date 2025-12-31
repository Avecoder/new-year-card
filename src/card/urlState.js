export function isViewOnlyFromUrl() {
  const url = new URL(window.location.href)
  return (url.searchParams.get('view') ?? '0') === '1'
}

export function getIdFromUrl() {
  const url = new URL(window.location.href)
  return url.searchParams.get('id') || ''
}

export function getUidFromUrl() {
  const url = new URL(window.location.href)
  return url.searchParams.get('uid') || ''
}

export function getViewerUrlFromId(id) {
  const url = new URL(window.location.href)
  const p = new URLSearchParams()
  p.set('id', String(id))
  p.set('view', '1')
  return `${url.origin}${url.pathname}?${p.toString()}`
}

export function getViewerUrlFromUid(uid) {
  const url = new URL(window.location.href)
  const p = new URLSearchParams()
  p.set('uid', String(uid))
  p.set('view', '1')
  return `${url.origin}${url.pathname}?${p.toString()}`
}

export function goToGallery() {
  window.history.pushState(null, '', window.location.pathname)
}

export function goToEditor(id) {
  const url = new URL(window.location.href)
  const p = new URLSearchParams()
  p.set('id', String(id))
  const next = `${url.pathname}?${p.toString()}`
  window.history.pushState(null, '', next)
}

export function goToEditorByUid(uid) {
  const url = new URL(window.location.href)
  const p = new URLSearchParams()
  p.set('uid', String(uid))
  const next = `${url.pathname}?${p.toString()}`
  window.history.pushState(null, '', next)
}


