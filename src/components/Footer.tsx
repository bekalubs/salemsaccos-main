// components/Footer.tsx
import React from 'react'
import { useTranslation } from 'react-i18next'

interface FooterProps {
  currentView: 'home' | 'register' | 'members'
}

const Footer: React.FC<FooterProps> = ({ currentView }) => {
  const { t } = useTranslation()

  // Only show footer on non-home pages
  if (currentView === 'home') {
    return null
  }

  return (
    <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t('saccos')}</h3>
            <p className="text-gray-600 text-sm">
              {t('saccos_desc')}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t('home')}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>{t('organization')}</li>
              <li>{t('leadership')}</li>
              <li>{t('history')}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t('services')}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>{t('service_savings')}</li>
              <li>{t('service_loan')}</li>
              <li>{t('service_transfer')}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t('committees')}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>{t('board_committee')}</li>
              <li>{t('audit_committee')}</li>
              <li>{t('loan_committee')}</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 sm:pt-8 mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-gray-600 text-sm text-center sm:text-left">
              {t('copyright')}
            </p>
            <p className="text-gray-500 text-sm">
              {t('designed_by')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer