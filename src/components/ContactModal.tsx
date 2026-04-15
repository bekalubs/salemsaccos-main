import React from 'react'
import { useTranslation } from 'react-i18next'
import { X, Phone, Mail, MapPin, Clock, ArrowRight, ExternalLink, MessageCircle } from 'lucide-react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/20 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-slideUp border border-white/20">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 p-8 rounded-t-[2.5rem] flex justify-between items-center z-10">
          <div>
            <h2 className="text-3xl font-black text-primary tracking-tight">{t('contact')}</h2>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mt-1">{t('stay_connected')}</p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:text-primary hover:rotate-90 transition-all duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 lg:p-10 space-y-10">
          
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Communication Column */}
            <div className="space-y-8">
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
                  <Phone size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{t('phone_numbers')}</h3>
                  <div className="space-y-1">
                    <p className="text-gray-600 font-medium">0946154444</p>
                    <p className="text-gray-600 font-medium">0946134444</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Mail size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{t('email_address')}</h3>
                  <div className="space-y-1">
                    <p className="text-gray-600 font-medium">info@salemsaccos.com</p>
                    <p className="text-gray-600 font-medium">support@salemsaccos.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Time Column */}
            <div className="space-y-8">
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                  <MapPin size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{t('address')}</h3>
                  <div className="space-y-1">
                    <p className="text-gray-600 font-medium">{t('addis_ababa_ethiopia')}</p>
                    <p className="text-gray-600 font-medium">{t('bole_subcity')}</p>
                    <p className="text-gray-600 font-medium">{t('woreda_03')}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
                  <Clock size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{t('working_hours')}</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500 font-medium">{t('monday_friday')}</span>
                      <span className="text-primary font-bold">8:30 AM - 5:30 PM</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500 font-medium">{t('saturday')}</span>
                      <span className="text-primary font-bold">8:30 AM - 12:30 PM</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400 italic">{t('sunday')}</span>
                      <span className="text-red-400 font-bold uppercase text-[10px] tracking-widest px-2 bg-red-50 rounded-full h-fit py-0.5 mt-1">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions - Primary CTAs */}
          <div className="pt-10 border-t border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent rounded-full"></span>
              {t('quick_actions')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="tel:+251910416932"
                className="flex items-center justify-between bg-primary text-white px-8 py-5 rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/10 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Phone size={20} /></div>
                  <span className="font-bold">{t('call_now')}</span>
                </div>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </a>
              <a
                href="mailto:info@salemsaccos.com"
                className="flex items-center justify-between bg-accent text-white px-8 py-5 rounded-2xl hover:bg-accent-dark transition-all shadow-xl shadow-accent/10 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Mail size={20} /></div>
                  <span className="font-bold">{t('send_email')}</span>
                </div>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </a>
            </div>
          </div>

          {/* Information Portal Section */}
          <div className="bg-gray-50 rounded-[2rem] p-8 lg:p-10 border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <MessageCircle className="text-primary" size={24} />
              {t('more_info')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: t('info_new_member'), icon: ExternalLink },
                { label: t('info_loan'), icon: ExternalLink },
                { label: t('info_savings'), icon: ExternalLink },
                { label: t('info_support'), icon: ExternalLink }
              ].map((info, i) => (
                <button 
                  key={i} 
                  className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all group text-left"
                >
                  <span className="text-gray-700 font-bold group-hover:text-primary">{info.label}</span>
                  <info.icon size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>

        </div>
        
        {/* Footer Area */}
        <div className="p-8 text-center bg-gray-50/50 border-t border-gray-100">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
               Salem Savings and Credit Cooperative Society
            </p>
        </div>
      </div>
    </div>
  )
}

export default ContactModal