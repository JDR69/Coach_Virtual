import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex justify-center space-x-8 mb-8">
          <a href="https://vite.dev" target="_blank" className="transition-transform hover:scale-110">
            <img src={viteLogo} className="h-24 w-24 animate-spin" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" className="transition-transform hover:scale-110">
            <img src={reactLogo} className="h-24 w-24 animate-pulse" alt="React logo" />
          </a>
        </div>
        
        <h1 className="text-6xl font-bold text-white text-center mb-8 bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
          Vite + React  Tailwind
        </h1>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-6"
          >
            <span className="text-2xl">count is {count}</span>
          </button>
          
          <p className="text-white/80 text-center text-lg mb-4">
            Edit <code className="bg-black/30 px-2 py-1 rounded text-yellow-300">src/App.jsx</code> and save to test HMR
          </p>
          
          <div className="text-center">
            <p className="text-white/60">
              🎨 Tailwind CSS is now working! 
            </p>
            <div className="flex justify-center space-x-2 mt-4">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
        
        <p className="text-white/50 text-center mt-8 text-sm">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App
