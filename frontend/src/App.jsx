import { Suspense } from 'react'
import './App.css'
import { Route, Routes } from "react-router-dom"
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Feed from './components/Feed';
import Chat from './components/Chat';
function App() {
  
  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Signup />}/>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
