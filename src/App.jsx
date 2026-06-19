import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import Background from './components/Background'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import KonamiMatrix from './components/KonamiMatrix'
import ScrollToTop from './components/ScrollToTop'

import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Skills from './pages/Skills'
import Wallet from './pages/Wallet'
import Contact from './pages/Contact'

const pageVariants = {
  initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -16, filter: 'blur(8px)' },
}

function PageWrap({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2600)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <CustomCursor />
      <Background />
      <KonamiMatrix />
      <ScrollToTop />

      <AnimatePresence>{loading && <LoadingScreen key="loader" />}</AnimatePresence>

      {!loading && (
        <>
          <Navbar />
          <main style={{ position: 'relative', zIndex: 1 }}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrap><Home /></PageWrap>} />
                <Route path="/about" element={<PageWrap><About /></PageWrap>} />
                <Route path="/projects" element={<PageWrap><Projects /></PageWrap>} />
                <Route path="/skills" element={<PageWrap><Skills /></PageWrap>} />
                <Route path="/wallet" element={<PageWrap><Wallet /></PageWrap>} />
                <Route path="/contact" element={<PageWrap><Contact /></PageWrap>} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </>
      )}
    </>
  )
}
