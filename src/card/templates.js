export const CARD_TEMPLATES = [
  {
    id: 'aurora',
    name: 'Аура',
    tagline: 'Северное сияние',
    className: 'tpl-aurora',
  },
  {
    id: 'paper',
    name: 'Бумага',
    tagline: 'Тёплая пастель',
    className: 'tpl-paper',
  },
  {
    id: 'retro',
    name: 'Ретро',
    tagline: 'Почтовая открытка',
    className: 'tpl-retro',
  },
  {
    id: 'midnight',
    name: 'Ночь',
    tagline: 'Глубокий тёмный',
    className: 'tpl-midnight',
  },
  {
    id: 'gingerbread',
    name: 'Пряник',
    tagline: 'Уют и огоньки',
    className: 'tpl-gingerbread',
  },
]

export function getTemplateById(id) {
  return CARD_TEMPLATES.find((t) => t.id === id) ?? CARD_TEMPLATES[0]
}


