# new-year-card

## MockAPI (обязательно, режим хранения по uid)

Сейчас проект работает в режиме **строго по `uid`**:
- Редактор: `?uid=...`
- Просмотр: `?uid=...&view=1`

1) Создай проект в MockAPI и ресурс (у нас по умолчанию это `postcard`)

2) Создай файл `.env` в корне проекта, скопировав значения из `env.example`:

```bash
VITE_MOCKAPI_BASE_URL="https://695492241cd5294d2c7ce7b0.mockapi.io"
VITE_MOCKAPI_RESOURCE="postcard"
```

3) Запусти:

```bash
npm run dev
```

Теперь:
- В галерее при выборе шаблона создаётся запись в MockAPI и открывается `?uid=...`
- В редакторе изменения автосохраняются
- Кнопка **«Скопировать ссылку»** копирует `?uid=...&view=1`

### Поля в MockAPI
`uid` (string), `templateId` (string), `toName` (string), `fromName` (string), `message` (string), `snowEnabled` (boolean), `snowDensity` (number), `flipped` (boolean), `createdAt` (string/date), `updatedAt` (string/date)
