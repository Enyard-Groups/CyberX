import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import Home from './pages/Home'
import Lectures from './pages/Lectures'
import CTFArena from './pages/CTFArena'
import Codex from './pages/Codex'
import Labs from './pages/Labs'
import Leaderboard from './pages/Leaderboard'
import Pricing from './pages/Pricing'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Enroll from './pages/Enroll'
import ChatWidget from './components/ChatWidget'

function Layout({ children, activePage = '' }) {
  return (
    <>
      <PageTransition />
      <Navbar activePage={activePage} />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout activePage=""><Home /></Layout>} />
        <Route path="/lectures" element={<Layout activePage="Lectures"><Lectures /></Layout>} />
        <Route path="/ctf" element={<Layout activePage="CTF Arena"><CTFArena /></Layout>} />
        <Route path="/codex" element={<Layout activePage="Codex"><Codex /></Layout>} />
        <Route path="/labs" element={<Layout activePage="Labs"><Labs /></Layout>} />
        <Route path="/leaderboard" element={<Layout activePage="Leaderboard"><Leaderboard /></Layout>} />
        <Route path="/pricing" element={<Layout activePage=""><Pricing /></Layout>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/enroll" element={<Enroll />} />
      </Routes>
    </BrowserRouter>
  )
}
