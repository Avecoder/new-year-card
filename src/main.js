import './style.css'

// Создаем снежинки с разными символами
const snowflakeSymbols = ['❄', '❅', '❆', '*', '✱', '✲', '✳']

function createSnowflake() {
  const snowflake = document.createElement('div')
  snowflake.className = 'snowflake'
  snowflake.textContent = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)]
  snowflake.style.left = Math.random() * 100 + '%'
  snowflake.style.animationDuration = (Math.random() * 4 + 3) + 's'
  snowflake.style.opacity = Math.random() * 0.7 + 0.3
  snowflake.style.fontSize = (Math.random() * 12 + 8) + 'px'
  snowflake.style.animationDelay = Math.random() * 2 + 's'
  document.body.appendChild(snowflake)
  
  setTimeout(() => {
    snowflake.remove()
  }, 7000)
}

// Создаем снежинки каждые 150мс
setInterval(createSnowflake, 150)

document.querySelector('#app').innerHTML = `
  <div class="simple-page">
    <div class="message">
      <h1>🎄 Подождите немного,<br>скоро всё будет готово 🎄</h1>
    </div>
  </div>
`
