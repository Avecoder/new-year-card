# new-year-card

## MockAPI (режим хранения по uid)

Сейчас проект работает в режиме **строго по `uid`**:
- Редактор: `?uid=...`
- Просмотр: `?uid=...&view=1`

Конфиг MockAPI захардкожен в `src/config.js` (без `.env`).

### Поля в MockAPI
`uid` (string), `templateId` (string), `toName` (string), `fromName` (string), `message` (string), `snowEnabled` (boolean), `snowDensity` (number), `flipped` (boolean), `createdAt` (string/date), `updatedAt` (string/date)
