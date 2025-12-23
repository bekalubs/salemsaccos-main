import React from 'react'
import { useTranslation } from 'react-i18next'
import { X, Phone, Mail, MapPin, Clock } from 'lucide-react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('contact')}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('phone_numbers')}</h3>
                  <p className="text-gray-600">+251 910 4169 32</p>
                  <p className="text-gray-600">+251 911 123 456</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('email_address')}</h3>
                  <p className="text-gray-600">info@salemsaccos.com</p>
                  <p className="text-gray-600">support@salemsaccos.com</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('address')}</h3>
                  <p className="text-gray-600">አዲስ አበባ፣ ኢትዮጵያ</p>
                  <p className="text-gray-600">ቦሌ ክፍለ ከተማ</p>
                  <p className="text-gray-600">ወረዳ 03</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('working_hours')}</h3>
                  <p className="text-gray-600">{t('monday_friday')}</p>
                  <p className="text-gray-600">{t('saturday')}</p>
                  <p className="text-gray-600">{t('sunday')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('quick_actions')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="tel:+251910416932"
                className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>{t('call_now')}</span>
              </a>
              <a
                href="mailto:info@salemsaccos.com"
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>{t('send_email')}</span>
              </a>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('more_info')}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{t('info_new_member')}</p>
              <p>{t('info_loan')}</p>
              <p>{t('info_savings')}</p>
              <p>{t('info_support')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactModal