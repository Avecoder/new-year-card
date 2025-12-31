import sparkle from './decors/sparkle.svg'
import snowflake from './decors/snowflake.svg'
import branch from './decors/branch.svg'
import stamp from './decors/stamp.svg'
import bauble from './decors/bauble.svg'

function hashString(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pick(seed, arr) {
  return arr[seed % arr.length]
}

export function getDecorForCard({ templateId, toName, fromName, message }) {
  const base = `${templateId}|${toName}|${fromName}|${message}`
  const seed = hashString(base)

  // Набор “как PNG-наклейки”, но через svg-ассеты (лёгкие, масштабируемые).
  const a = pick(seed, [sparkle, snowflake, bauble])
  const b = pick(seed >>> 3, [sparkle, snowflake, stamp])
  const c = pick(seed >>> 7, [branch, stamp, bauble])

  return [
    { src: c, cls: 'decor decor-branch', alt: '' },
    { src: a, cls: 'decor decor-a', alt: '' },
    { src: b, cls: 'decor decor-b', alt: '' },
  ]
}


