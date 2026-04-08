// components/Header.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, UserPlus, ChevronDown, Rocket, ArrowUpRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  handleScrollToSection?: (sectionId: string) => void;
  setIsContactModalOpen?: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  handleScrollToSection
}) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLanguageMenuOpen(false);
  };

  const navItems = [
    { id: 'about', label: t('about') },
    { id: 'services', label: t('services') },
    { id: 'shares', label: t('shares') },
    { id: 'contact', label: t('contact_us') },
  ];


  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 py-3 shadow-md' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Modern Logo */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <img 
              src="/image/logo.jpg" 
              alt="Salem Logo" 
              className="w-11 h-11 rounded-full border-2 border-white shadow-md group-hover:scale-110 transition-transform object-cover" 
            />
            <div className="absolute inset-0 rounded-full border border-primary/10"></div>
          </div>
          <span className={`text-xl font-black tracking-tighter ${isScrolled ? 'text-primary' : (isHomePage ? 'text-gray-400' : 'text-primary')}`}>
            SALEM<span className="text-accent">SACCOS</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {isHomePage && navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleScrollToSection?.(item.id)}
              className={`text-sm font-bold tracking-wide uppercase transition-colors hover:text-accent ${
                isScrolled ? 'text-gray-600' : (isHomePage ? 'text-gray-400' : 'text-gray-600')
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <div className="h-4 w-px bg-gray-300/30 mx-2"></div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className={`flex items-center gap-1 text-sm font-bold uppercase transition-colors hover:text-accent ${
                isScrolled ? 'text-gray-600' : (isHomePage ? 'text-gray-400' : 'text-gray-600')
              }`}
            >
              <Globe size={16} />
              {i18n.language === 'en' ? 'EN' : 'AM'}
              <ChevronDown size={14} className={isLanguageMenuOpen ? 'rotate-180' : ''} />
            </button>
            {isLanguageMenuOpen && (
              <div className="absolute right-0 mt-3 w-40 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-2 animate-fadeIn">
                {['en', 'am'].map((lng) => (
                  <button
                    key={lng}
                    onClick={() => handleLanguageChange(lng)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 text-gray-900 text-sm font-bold active:bg-gray-100 transition-colors"
                  >
                    <span>{lng === 'en' ? 'English' : 'አማርኛ'}</span>
                    {i18n.language === lng && <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/register')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm shadow-lg transition-all active:scale-95 ${
              isScrolled ? 'bg-primary text-white shadow-primary/20' : (isHomePage ? 'bg-white text-primary shadow-white/10' : 'bg-primary text-white shadow-primary/20')
            }`}
          >
            <UserPlus size={16} />
            {t('add_member')}
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
            isScrolled ? 'text-gray-800 bg-gray-100/50' : (isHomePage ? 'text-gray-600 bg-white/50 backdrop-blur-sm' : 'text-primary bg-primary/5')
          }`}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Menu Overlay - Cuter & Functional */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden animate-fadeIn">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-primary/20 backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 p-8 flex flex-col max-h-[90vh] overflow-y-auto animate-slideDown">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <img src="/image/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full border shadow-sm" />
                <span className="text-xl font-black text-primary">SALEM<span className="text-accent">SACCOS</span></span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-800 hover:rotate-90 transition-transform duration-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {isHomePage ? (
                <>
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleScrollToSection?.(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-2xl font-bold text-gray-800 text-left hover:text-primary active:scale-95 transition-all py-3 border-b border-gray-50 flex items-center justify-between group last:border-0"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="text-gray-300 group-hover:text-primary transition-colors" size={24} />
                    </button>
                  ))}
                </>
              ) : (
                <button
                  onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                  className="text-3xl font-black text-gray-800 text-left hover:text-primary transition-all py-2"
                >
                  {t('home')}
                </button>
              )}

              <hr className="border-gray-100 my-4" />

              <button
                onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}
                className="bg-primary text-white p-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 active:scale-95 transition-all"
              >
                <Rocket size={24} />
                {t('add_member')}
              </button>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <button onClick={() => handleLanguageChange('en')} className={`p-4 rounded-xl border-2 font-black tracking-widest transition-all ${i18n.language === 'en' ? 'bg-secondary border-primary text-primary' : 'border-gray-100 text-gray-400'}`}>ENG</button>
                <button onClick={() => handleLanguageChange('am')} className={`p-4 rounded-xl border-2 font-black tracking-widest transition-all ${i18n.language === 'am' ? 'bg-secondary border-primary text-primary' : 'border-gray-100 text-gray-400'}`}>አማር</button>
              </div>

              {/* Cute interaction area */}
              <div className="mt-8 p-6 bg-gray-50 rounded-3xl text-center">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t('stay_connected')}</p>
                <div className="flex justify-center gap-6 text-gray-400">
                   <Globe size={20} />
                   <Rocket size={20} />
                   <Globe size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;