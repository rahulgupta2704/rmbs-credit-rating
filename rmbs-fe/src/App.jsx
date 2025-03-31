import { useState } from 'react'
import { Route, Routes } from "react-router-dom"
import './App.css'
import { routes } from './routes/Routes.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1>Hello World</h1>
      <Routes>
        {
          routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))
        }
      </Routes>
    </>
  )
}

export default App
