import { MOCKAPI_BASE_URL, MOCKAPI_RESOURCE } from '../config'

const BASE_URL = String(MOCKAPI_BASE_URL || '').replace(/\/+$/, '')
const RESOURCE = String(MOCKAPI_RESOURCE || 'cards').replace(/^\/+/, '')

export function isMockApiConfigured() {
  return Boolean(BASE_URL)
}

function assertConfigured() {
  if (!BASE_URL) {
    throw new Error('MockAPI base URL is not configured. Set VITE_MOCKAPI_BASE_URL')
  }
}

function endpoint(path = '') {
  assertConfigured()
  const suffix = path ? `/${path.replace(/^\/+/, '')}` : ''
  return `${BASE_URL}/${RESOURCE}${suffix}`
}

async function jsonFetch(url, options) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`)
  }
  return await res.json()
}

export async function createRemoteCard(state) {
  const payload = {
    uid: String(state.uid ?? ''),
    templateId: String(state.templateId ?? ''),
    toName: state.toName,
    fromName: state.fromName,
    message: state.message,
    snowEnabled: Boolean(state.snowEnabled),
    snowDensity: Number(state.snowDensity ?? 140),
    flipped: Boolean(state.flipped),
    createdAt: new Date().toISOString(),
  }
  return await jsonFetch(endpoint(), { method: 'POST', body: JSON.stringify(payload) })
}

export async function updateRemoteCardById(id, state) {
  if (!id) throw new Error('Missing id')
  const payload = {
    uid: String(state.uid ?? ''),
    templateId: String(state.templateId ?? ''),
    toName: state.toName,
    fromName: state.fromName,
    message: state.message,
    snowEnabled: Boolean(state.snowEnabled),
    snowDensity: Number(state.snowDensity ?? 140),
    flipped: Boolean(state.flipped),
    createdAt: state.createdAt ?? undefined,
    updatedAt: new Date().toISOString(),
  }
  // MockAPI часто не разрешает PATCH по CORS, но разрешает PUT.
  // PUT здесь ок, потому что мы отправляем полный объект открытки.
  return await jsonFetch(endpoint(String(id)), { method: 'PUT', body: JSON.stringify(payload) })
}

export async function getRemoteCardById(id) {
  if (!id) throw new Error('Missing id')
  const data = await jsonFetch(endpoint(String(id)), { method: 'GET' })
  return {
    uid: String(data.uid ?? ''),
    templateId: String(data.templateId ?? ''),
    toName: data.toName ?? '',
    fromName: data.fromName ?? '',
    message: data.message ?? '',
    snowEnabled: data.snowEnabled !== false,
    snowDensity: Number.isFinite(Number(data.snowDensity)) ? Number(data.snowDensity) : 140,
    flipped: data.flipped === true,
    createdAt: data.createdAt ?? '',
  }
}

export async function getRemoteCardByUid(uid) {
  if (!uid) throw new Error('Missing uid')
  // Берём самую свежую запись по uid (если по ошибке появились дубликаты).
  const url = `${endpoint()}?uid=${encodeURIComponent(String(uid))}&sortBy=updatedAt&order=desc`
  const list = await jsonFetch(url, { method: 'GET' })
  const item = Array.isArray(list) ? list[0] : null
  if (!item?.id) throw new Error('Card not found by uid')
  return {
    remoteId: String(item.id),
    uid: String(item.uid ?? uid),
    templateId: String(item.templateId ?? ''),
    toName: item.toName ?? '',
    fromName: item.fromName ?? '',
    message: item.message ?? '',
    snowEnabled: item.snowEnabled !== false,
    snowDensity: Number.isFinite(Number(item.snowDensity)) ? Number(item.snowDensity) : 140,
    flipped: item.flipped === true,
    createdAt: item.createdAt ?? '',
  }
}


