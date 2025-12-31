import { useEffect, useMemo, useRef, useState } from 'react'
import './style.css'
import './card/card.css'

import Gallery from './card/Gallery'
import Editor from './card/Editor'
import Viewer from './card/Viewer'
import FestiveLoader from './card/FestiveLoader'
import { CARD_TEMPLATES, getTemplateById } from './card/templates'
import { goToGallery, getIdFromUrl, getUidFromUrl, goToEditorByUid, isViewOnlyFromUrl, getViewerUrlFromUid } from './card/urlState'
import { createRemoteCard, getRemoteCardById, getRemoteCardByUid, updateRemoteCardById, isMockApiConfigured } from './card/api'
import { loadSavedCards, upsertSavedCard } from './card/localCards'

function App() {
  const defaults = useMemo(
    () => ({
      templateId: CARD_TEMPLATES[0].id,
      toName: '',
      fromName: '',
      message: '',
      snowEnabled: true,
      snowDensity: 140,
      flipped: false,
    }),
    [],
  )

  const [state, setState] = useState(() => ({ ...defaults, uid: '', createdAt: '' }))
  // cardId = внутренний id записи в MockAPI (для PATCH). uid = внешний id для шаринга/URL.
  const [cardId, setCardId] = useState(() => getIdFromUrl())
  const [cardUid, setCardUid] = useState(() => getUidFromUrl())
  const [remoteStatus, setRemoteStatus] = useState({ loading: false, error: '' })
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error
  const [savedCards, setSavedCards] = useState(() => loadSavedCards())
  const validTemplateIds = useMemo(() => new Set(CARD_TEMPLATES.map((t) => t.id)), [])
  const normalizeTemplateId = (candidate, fallback) => {
    const id = String(candidate ?? '')
    return validTemplateIds.has(id) ? id : fallback
  }

  const computeMode = () => {
    const uid = getUidFromUrl()
    const id = getIdFromUrl()
    if (!uid && !id) return 'gallery'
    return isViewOnlyFromUrl() ? 'viewer' : 'editor'
  }

  const [mode, setMode] = useState(() => computeMode())
  const latestStateRef = useRef(state)

  useEffect(() => {
    latestStateRef.current = state
  }, [state])

  // Обновляем список сохранённых открыток, если он изменён в другом табе.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'savedCards') setSavedCards(loadSavedCards())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    const onPopState = () => {
      setCardId(getIdFromUrl())
      setCardUid(getUidFromUrl())
      setMode(computeMode())
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [defaults])

  useEffect(() => {
    // Важно: эта подгрузка должна срабатывать не только при mount, но и при кликах
    // по "Мои открытки" / выборе шаблона (pushState), поэтому завязана на mode/cardUid/cardId.
    if (mode === 'gallery') return

    const uid = getUidFromUrl()
    const idFromUrl = getIdFromUrl()
    const id = cardId || idFromUrl

    // sync локального состояния с URL
    if (uid !== cardUid) setCardUid(uid)
    if (idFromUrl !== cardId && idFromUrl) setCardId(idFromUrl)

    // Draft-режим: открыли шаблон, uid есть, но ещё не сохраняли -> в MockAPI ничего нет.
    // В этом случае не пытаемся тянуть данные.
    if (!id && mode === 'editor') return

    // Viewer без uid/id тоже не имеет смысла
    if (!uid && !id) {
      setMode('gallery')
      goToGallery()
      return
    }

    let cancelled = false
    setRemoteStatus({ loading: true, error: '' })

    const load = async () => {
      try {
        if (id) {
          const data = await getRemoteCardById(id)
          if (cancelled) return
          setState((prev) => ({
            ...defaults,
            ...prev,
            ...data,
            uid: String(data.uid || prev.uid || uid || ''),
            templateId: normalizeTemplateId(data.templateId, prev.templateId || defaults.templateId),
          }))
        } else {
          const data = await getRemoteCardByUid(uid)
          if (cancelled) return
          setCardId(data.remoteId)
          setState((prev) => ({
            ...defaults,
            ...prev,
            ...data,
            templateId: normalizeTemplateId(data.templateId, prev.templateId || defaults.templateId),
          }))
        }

        setRemoteStatus({ loading: false, error: '' })
      } catch (e) {
        if (cancelled) return
        const msg = e?.message || 'Не удалось загрузить открытку'
        if (uid && /not found/i.test(msg)) {
          setRemoteStatus({ loading: false, error: '' })
          setMode('gallery')
          setCardId('')
          setCardUid('')
          goToGallery()
          return
        }
        setRemoteStatus({ loading: false, error: msg })
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [defaults, mode, cardUid, cardId])

  const openTemplate = async (templateId) => {
    const t = getTemplateById(templateId)
    const uid =
      globalThis.crypto?.randomUUID?.()
        ? globalThis.crypto.randomUUID()
        : `uid_${Date.now()}_${Math.random().toString(16).slice(2)}`

    // Важно: НЕ сохраняем на клик по шаблону. Сохранение/обновление — строго по кнопке "Скопировать ссылку".
    setRemoteStatus({ loading: false, error: '' })
    setSaveState('idle')
    setCardId('')
    setCardUid(uid)
    setState({ ...defaults, uid, templateId: t.id, flipped: false })
    setMode('editor')
    goToEditorByUid(uid)
  }

  const openSaved = (uid) => {
    if (!uid) return
    const saved = savedCards.find((c) => c.uid === uid)
    setRemoteStatus({ loading: false, error: '' })
    setSaveState('idle')
    setCardId(saved?.remoteId ? String(saved.remoteId) : '')
    setCardUid(uid)
    setState((prev) => ({
      ...prev,
      ...defaults,
      uid,
      templateId: normalizeTemplateId(saved?.templateId, prev.templateId || defaults.templateId),
      toName: saved?.toName ?? prev.toName ?? '',
      fromName: saved?.fromName ?? prev.fromName ?? '',
      flipped: false,
      createdAt: prev.createdAt ?? '',
    }))
    setMode('editor')
    goToEditorByUid(uid)
  }

  const goBack = () => {
    setMode('gallery')
    setCardId('')
    setCardUid('')
    setSaveState('idle')
    goToGallery()
  }

  const onChange = (patch) => {
    setState((prev) => ({ ...prev, ...patch }))
  }

  const onCopyLink = async () => {
    if (!cardUid) return
    if (!isMockApiConfigured()) {
      setRemoteStatus({
        loading: false,
        error: 'MockAPI не настроен. Создай .env в корне (см. README) и перезапусти npm run dev.',
      })
      return
    }

    setSaveState('saving')
    try {
      let nextRemoteId = cardId
      // 1) Если ещё не сохраняли — создаём запись и запоминаем её mockapi id.
      if (!nextRemoteId) {
        const created = await createRemoteCard({ ...latestStateRef.current, uid: cardUid })
        if (created?.id) {
          nextRemoteId = String(created.id)
          setCardId(nextRemoteId)
        }
      } else {
        // 2) Если уже есть — обновляем.
        await updateRemoteCardById(nextRemoteId, { ...latestStateRef.current, uid: cardUid })
      }

      const url = getViewerUrlFromUid(cardUid)
      try {
        await navigator.clipboard.writeText(url)
      } catch {
        const ta = document.createElement('textarea')
        ta.value = url
        ta.style.position = 'fixed'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        try {
          document.execCommand('copy')
        } finally {
          ta.remove()
        }
      }
      setSavedCards(
        upsertSavedCard({
          uid: cardUid,
          remoteId: nextRemoteId || '',
          templateId: latestStateRef.current.templateId,
          toName: latestStateRef.current.toName,
          fromName: latestStateRef.current.fromName,
        }),
      )
      setSaveState('saved')
      window.setTimeout(() => setSaveState('idle'), 1400)
    } catch (e) {
      setSaveState('error')
      setRemoteStatus({ loading: false, error: e?.message || 'Не удалось сохранить открытку' })
    }
  }

  return (
    <>
      {mode === 'gallery' && remoteStatus.error && (
        <div className="page">
          <div className="view-loading">{remoteStatus.error}</div>
        </div>
      )}
      {mode === 'gallery' ? (
        <Gallery
          onPick={openTemplate}
          activeTemplateId={state.templateId}
          savedCards={savedCards}
          onOpenSaved={openSaved}
        />
      ) : mode === 'viewer' ? (
        remoteStatus.loading ? (
          <div className="page page-view">
            <FestiveLoader />
          </div>
        ) : remoteStatus.error ? (
          <div className="page page-view">
            <div className="view-loading">{remoteStatus.error}</div>
          </div>
        ) : (
          <Viewer
            templateId={state.templateId}
            toName={state.toName}
            fromName={state.fromName}
            message={state.message}
            flipped={state.flipped}
            snowEnabled={state.snowEnabled}
            snowDensity={state.snowDensity}
          />
        )
      ) : (
        remoteStatus.loading ? (
          <div className="page page-view">
            <FestiveLoader />
          </div>
        ) : remoteStatus.error ? (
          <div className="page page-view">
            <div className="view-loading">{remoteStatus.error}</div>
          </div>
        ) : (
          <Editor
            templateId={state.templateId}
            toName={state.toName}
            fromName={state.fromName}
            message={state.message}
            flipped={state.flipped}
            snowEnabled={state.snowEnabled}
            snowDensity={state.snowDensity}
            onChange={onChange}
            onBack={goBack}
            onFlip={() => onChange({ flipped: !state.flipped })}
            onCopyLink={onCopyLink}
            saveState={saveState}
          />
        )
      )}
    </>
  )
}

export default App

