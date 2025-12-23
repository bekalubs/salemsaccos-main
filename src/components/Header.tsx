// components/Header.tsx
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Building, Mail, Phone, Menu, X, ChevronDown, Globe, UserPlus, Home } from 'lucide-react'
import { useLocation } from 'react-router-dom'

interface HeaderProps {
  handleScrollToSection?: (sectionId: string) => void
  setIsContactModalOpen?: (open: boolean) => void
}

const Header: React.FC<HeaderProps> = ({ 
  handleScrollToSection, 
  setIsContactModalOpen 
}) => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)

  // Determine current view based on route
  const currentView = location.pathname === '/' ? 'home' : 
                     location.pathname === '/register' ? 'register' : 'members'

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsLanguageMenuOpen(false)
  }, [location.pathname])

  const handleNavigation = (path: string) => {
    window.location.href = path
  }

  const handleSectionClick = (sectionId: string) => {
    if (sectionId === 'contact' && setIsContactModalOpen) {
      setIsContactModalOpen(true)
    } else if (handleScrollToSection) {
      handleScrollToSection(sectionId)
    }
    setIsMobileMenuOpen(false)
  }

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng)
    setIsLanguageMenuOpen(false)
  }

  const navigationItems = [
    { id: 'about', label: t('about'), icon: null },
    { id: 'services', label: t('services'), icon: null },
    { id: 'committees', label: t('committees'), icon: null },
    { id: 'shares', label: t('shares'), icon: null },
    { id: 'savings', label: t('savings'), icon: null },
    { 
      id: 'contact', 
      label: t('contact_us'), 
      icon: null,
      action: () => setIsContactModalOpen?.(true)
    },
  ]

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
  ]

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo Section */}
            <button
              className="flex items-center space-x-3 group focus:outline-none"
              onClick={() => handleNavigation('/')}
              aria-label="Go to home"
              style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
              type="button"
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-emerald-800 bg-clip-text text-transparent">
                  {t('saccos')}
                </h1>
                <p className="text-xs text-gray-500">
                  {t('trusted')} • {t('years_in_service')}
                </p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 text-xs">
              {/* Home Button */}
              <button
                onClick={() => handleNavigation('/')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  currentView === 'home'
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-100'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">{t('home')}</span>
              </button>

              {/* Landing Page Sections */}
              {currentView === 'home' && (
                <div className="flex items-center space-x-1 text-xs">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSectionClick(item.id)}
                      className="px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 font-medium"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Register Button */}
              <button
                onClick={() => handleNavigation('/register')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 ml-2 ${
                  currentView === 'register'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-md hover:from-green-600 hover:to-emerald-600'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span className="font-medium">{t('add_member')}</span>
              </button>

              {/* Language Selector */}
              <div className="relative ml-2">
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200"
                >
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">
                    {i18n.language === 'en' ? 'EN' : 'AM'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    isLanguageMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Language Dropdown */}
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          i18n.language === lang.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                        {i18n.language === lang.code && (
                          <div className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Language Switcher - Mobile */}
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Globe className="w-5 h-5" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
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

        {/* Language Menu - Mobile */}
        {isLanguageMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-3">
            <div className="flex space-x-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg border transition-colors ${
                    i18n.language === lang.code
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-out">
            <div className="h-full overflow-y-auto">
              {/* Menu Header with Close Icon */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-xl">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{t('saccos')}</h2>
                    <p className="text-sm text-gray-500">{t('saccos_desc')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="p-4 space-y-1">
                {/* Home */}
                <button
                  onClick={() => handleNavigation('/')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    currentView === 'home'
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">{t('home')}</span>
                </button>

                {/* Landing Page Sections */}
                {currentView === 'home' && navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSectionClick(item.id)}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {item.icon && React.createElement(item.icon, { className: "w-5 h-5" })}
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}

                {/* Register Button */}
                <button
                  onClick={() => handleNavigation('/register')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left mt-4 ${
                    currentView === 'register'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                  }`}
                >
                  <UserPlus className="w-5 h-5" />
                  <span className="font-medium">{t('add_member')}</span>
                </button>
              </div>

              {/* Contact Info */}
              <div className="p-6 border-t border-gray-200 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">+251 910 4169 32</p>
                      <p className="text-xs text-gray-500">{t('phone_numbers')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">info@salemsaccos.com</p>
                      <p className="text-xs text-gray-500">{t('email_address')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Header