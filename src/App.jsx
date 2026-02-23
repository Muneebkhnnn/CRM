import { useState } from 'react'
import Header from './components/Header'
import Leadlist from './pages/Leadlist'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className=''>
        <Header />
        <Leadlist />
      </div>
    </>
  )
}

export default App
