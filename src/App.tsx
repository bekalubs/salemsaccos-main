// App.tsx
import React, { useState } from 'react'
import './i18n'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import RegistrationForm from './components/RegistrationForm'
import MembersList from './components/MembersList'
import LandingPage from './components/LandingPage'
import ContactModal from './components/ContactModal'
import MonthlyDeposit from './components/MonthlyDeposit'
import Header from './components/Header'
import Footer from './components/Footer'
import MobileMenuBackdrop from './components/MobileMenuBackdrop'
import RegistrationSummary from './components/RegistrationSummary'
import Login from './components/Login'
import { getUserRole, isAuthenticated } from './utils/jwt'
import i18n from './i18n'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const auth = isAuthenticated()
  const role = getUserRole()

  if (!auth) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function AppContent() {
  // const { t, i18n: i18nInstance } = useTranslation()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  // Update current route
  React.useEffect(() => {
    // Logic for route-specific side effects if needed
  }, [location.pathname])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // handleNavigation removed: no longer needed

  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'contact') {
      setIsContactModalOpen(true)
    } else {
      scrollToSection(sectionId)
    }
    closeMobileMenu()
  }

  return (
    <>
      {/* Header Component */}
      <Header
        handleScrollToSection={handleScrollToSection}
        setIsContactModalOpen={setIsContactModalOpen}
      />

      {/* Mobile Menu Backdrop */}
      <MobileMenuBackdrop 
        isOpen={isMobileMenuOpen} 
        onClick={closeMobileMenu}
      />

      {/* Main Content */}
      <main onClick={closeMobileMenu}>
        <Routes>
          <Route path="/" element={<LandingPage onContactClick={() => setIsContactModalOpen(true)} />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/deposit" element={<MonthlyDeposit />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/members" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TELLER']}>
                <MembersList />
              </ProtectedRoute>
            } 
          />
          <Route path="/registration-success/:id" element={<RegistrationSummary />} />
          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />

      {/* Footer Component */}
      <Footer />
    </>
  )
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <AppContent />
      </Router>
    </I18nextProvider>
  )
}

export default App