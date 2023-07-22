import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EquityDisplay from './Equity'
import Dashboard from './Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (<>
    <Dashboard/> 
  </>)
}

export default App
