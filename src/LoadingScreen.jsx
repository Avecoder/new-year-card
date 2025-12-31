import { useState, useEffect } from 'react'
import './LoadingScreen.css'

const treeFrames = [
  `
        *
       ***
      *****
     *******
    *********
   ***********
  *************
       |||
       |||
`,
  `
        *
       ***
      *****
     *******
    *********
   ***********
  *************
      *|||*
      |||||
`,
  `
       ***
      *****
     *******
    *********
   ***********
  *************
 ***************
      *|||*
      |||||
`,
]

const snowflakes = ['*', '·', '+', '.', '✱', '✲', '✳']

function LoadingScreen() {
  const [frameIndex, setFrameIndex] = useState(0)
  const [snow, setSnow] = useState([])
  const [dots, setDots] = useState('')

  useEffect(() => {
    const treeInterval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % treeFrames.length)
    }, 600)

    const snowInterval = setInterval(() => {
      setSnow((prev) => {
        const newSnow = [...prev]
        newSnow.push({
          id: Date.now(),
          x: Math.random() * 100,
          symbol: snowflakes[Math.floor(Math.random() * snowflakes.length)],
        })
        if (newSnow.length > 30) {
          newSnow.shift()
        }
        return newSnow
      })
    }, 150)

    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return ''
        return prev + '.'
      })
    }, 500)

    return () => {
      clearInterval(treeInterval)
      clearInterval(snowInterval)
      clearInterval(dotsInterval)
    }
  }, [])

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <pre className="ascii-tree">{treeFrames[frameIndex]}</pre>
        <div className="snow-container">
          {snow.map((flake) => (
            <span
              key={flake.id}
              className="ascii-snow"
              style={{
                left: `${flake.x}%`,
              }}
            >
              {flake.symbol}
            </span>
          ))}
        </div>
        <div className="loading-text">
          Загрузка{dots}
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
