import React, { useState } from 'react'
import { Building, Menu, X, Phone, Mail } from 'lucide-react'
import RegistrationForm from './components/RegistrationForm'
import MembersList from './components/MembersList'
import LandingPage from './components/LandingPage'
import ContactModal from './components/ContactModal'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'

function AppContent() {
  const location = useLocation()
  const [currentView, setCurrentView] = useState<'home' | 'register' | 'members'>('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  // Update currentView based on current route
  React.useEffect(() => {
    if (location.pathname === '/') {
      setCurrentView('home')
    } else if (location.pathname === '/register') {
      setCurrentView('register')
    } else if (location.pathname === '/members') {
      setCurrentView('members')
    }
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

  const handleNavigation = (path: string) => {
    window.location.href = path
    closeMobileMenu()
  }

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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">ሳሌም ሳኮስ</h1>
                <div className="hidden sm:flex flex-col text-xs sm:text-sm text-gray-600 space-y-0.5">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span>info@salemsaccos.com</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>+251 910 4169 32</span>
                  </div>
                </div>
              </div>
            </div>
            
            <nav className="hidden lg:flex space-x-4 xl:space-x-6">
              <button
                onClick={() => handleNavigation('/')}
                className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  currentView === 'home'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                መቅድም
              </button>

              {currentView === 'home' && (
                <>
                  <button
                    onClick={() => handleScrollToSection('about')}
                    className="px-3 py-2 rounded-lg transition-colors text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    ስለ ሳሌም
                  </button>
                  
                  <button
                    onClick={() => handleScrollToSection('services')}
                    className="px-3 py-2 rounded-lg transition-colors text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    አገልግሎት
                  </button>
                  
                  <button
                    onClick={() => handleScrollToSection('committees')}
                    className="px-3 py-2 rounded-lg transition-colors text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    ኮሚቴዎቹ
                  </button>
                  
                  <button
                    onClick={() => handleScrollToSection('shares')}
                    className="px-3 py-2 rounded-lg transition-colors text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    የአክሲዮን መጠን
                  </button>
                  
                  <button
                    onClick={() => handleScrollToSection('savings')}
                    className="px-3 py-2 rounded-lg transition-colors text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    የቁጠባ አይነት
                  </button>
                  
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="px-3 py-2 rounded-lg transition-colors text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    ያግኙን
                  </button>
                </>
              )}
              
              <button
                onClick={() => handleNavigation('/register')}
                className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  currentView === 'register'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                አዲስ ምዝገባ
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-4 pt-2 pb-4 space-y-1 bg-white border-t border-gray-200">
              {/* Main Navigation */}
              <button
                onClick={() => handleNavigation('/')}
                className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  currentView === 'home'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                መቅድም
              </button>
              
              <button
                onClick={() => handleNavigation('/register')}
                className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  currentView === 'register'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                አዲስ ምዝገባ
              </button>

              {/* Landing Page Sections - Only show when on home page */}
              {currentView === 'home' && (
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <p className="px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    ክፍሎች
                  </p>
                  <button
                    onClick={() => handleScrollToSection('about')}
                    className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    ስለ ሳሌም
                  </button>
                  <button
                    onClick={() => handleScrollToSection('services')}
                    className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    አገልግሎት
                  </button>
                  <button
                    onClick={() => handleScrollToSection('committees')}
                    className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    ኮሚቴዎቹ
                  </button>
                  <button
                    onClick={() => handleScrollToSection('shares')}
                    className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    የአክሲዮን መጠን
                  </button>
                  <button
                    onClick={() => handleScrollToSection('savings')}
                    className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    የቁጠባ አይነት
                  </button>
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    ያግኙን
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Main Content */}
      <main onClick={closeMobileMenu}>
        <Routes>
          <Route path="/" element={<LandingPage onContactClick={() => setIsContactModalOpen(true)} />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/members" element={<MembersList />} />
          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />

      {/* Footer - Only show on non-home pages */}
      {currentView !== 'home' && (
        <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-16" onClick={closeMobileMenu}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">ሳሌም</h3>
                <p className="text-gray-600 text-sm">
                  የወንድሞች እና እህቶች ቁጠባና ብድር ኅብረት ስራ ማኅበር
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">መቅድም</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>ስለ ድርጅታችን</li>
                  <li>የአመራር አባላት</li>
                  <li>ታሪካችን</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">አገልግሎት</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>ቁጠባ አገልግሎት</li>
                  <li>ብድር አገልግሎት</li>
                  <li>የገንዘብ ዝውውር</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">ኮሚቴዎቹ</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>ቦርድ ኮሚቴ</li>
                  <li>ክትትል ኮሚቴ</li>
                  <li>ብድር ኮሚቴ</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 sm:pt-8 mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                <p className="text-gray-600 text-sm text-center sm:text-left">
                  © 2024 ሳሌም ሳኮስ. ሁሉም መብቶች የተጠበቁ ናቸው።
                </p>
                <p className="text-gray-500 text-sm">
                  Designed by NABAW
                </p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
