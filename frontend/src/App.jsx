import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'



import Navbar from './components/NavBar'
import Routing from './components/Routing'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Navbar />
        <Routing />
    </>
  )
}

export default App
