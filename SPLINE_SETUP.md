# Инструкция по подключению 3D модели из Spline

## Как добавить свою 3D модель:

1. **Создайте или откройте сцену в Spline** (https://spline.design)

2. **Экспортируйте сцену:**
   - Нажмите на кнопку "Export" в Spline
   - Выберите формат "Code" или "URL"
   - Скопируйте URL вашей сцены

3. **Подключите модель в код:**
   
   Откройте файл `src/main.js` и найдите функцию `initSpline()`.
   
   Раскомментируйте и замените URL:
   
   ```javascript
   await spline.load('https://prod.spline.design/YOUR_SCENE_URL.splinecode')
   ```
   
   Или если экспортировали локально:
   
   ```javascript
   await spline.load('/models/your-scene.splinecode')
   ```
   
   (Поместите файл `.splinecode` в папку `public/models/`)

4. **Альтернативный способ - через iframe:**
   
   Если хотите использовать iframe вместо runtime, можно заменить canvas на:
   
   ```html
   <iframe src="https://my.spline.design/YOUR_SCENE" 
           frameborder="0" 
           width="100%" 
           height="100%">
   </iframe>
   ```

## Примеры готовых новогодних сцен:

Можете использовать готовые сцены из Spline Community или создать свою:
- Новогодняя елка
- Снеговик
- Подарки
- Снежинки
- И т.д.

## Настройка интерактивности:

После загрузки модели вы можете:
- Настроить камеру
- Добавить анимации
- Настроить освещение
- И многое другое прямо в Spline редакторе

