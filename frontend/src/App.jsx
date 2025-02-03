import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {UserProvider} from './context/AuthContext'




import Navbar from './components/NavBar'
import Routing from './components/Routing'

function App() {


  return (
    <>
      <UserProvider>
        <Navbar />
        <Routing />
      </UserProvider>
    </>
  )
}

export default App
