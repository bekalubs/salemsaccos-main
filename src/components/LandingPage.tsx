import React from 'react'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { 
  Building, 
  Users, 
  Banknote, 
  Shield, 
  TrendingUp, 
  Heart, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  Star,
  ArrowRight,
  PiggyBank,
  CreditCard,
  Handshake
} from 'lucide-react'
import { supabase } from '../lib/supabase'

interface LandingPageProps {
  onContactClick: () => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onContactClick }) => {
  const { t } = useTranslation()
  const [memberCount, setMemberCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMemberCount()
  }, [])

  const fetchMemberCount = async () => {
    try {
      const { count, error } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })

      if (error) throw error
      setMemberCount(count || 0)
    } catch (error) {
      console.error('Error fetching member count:', error)
      setMemberCount(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-blue-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                {t('hero_title')}
                <span className="block text-3xl text-green-200 mt-2">
                  {t('saccos_desc')}
                </span>
              </h1>
              <p className="text-xl mb-8 text-green-100 leading-relaxed">
                {t('hero_subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => window.location.href = '/register'}
                  className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center"
                >
                  <Users className="w-5 h-5 mr-2" />
                  {t('add_member')}
                </button>
                <button 
                  onClick={onContactClick}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-colors flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {t('contact_us')}
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      {loading ? '...' : `${memberCount}+`}
                    </h3>
                    <p className="text-green-200">{t('members')}</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Banknote className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">10M+</h3>
                    <p className="text-green-200">{t('initial_savings')}</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">100%</h3>
                    <p className="text-green-200">{t('trusted')}</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">2+</h3>
                    <p className="text-green-200">{t('years_in_service')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* About Salem Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('about_title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('our_history_vision')}</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  {t('about_history_1')}
                </p>
                <p>
                  {t('about_history_2')}
                </p>
                <p>
                  {t('about_history_3')}
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <Heart className="w-8 h-8 text-red-500 mb-2" />
                  <h4 className="font-semibold text-gray-900">{t('about_heart_title')}</h4>
                  <p className="text-sm text-gray-600">{t('about_heart_desc')}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <Shield className="w-8 h-8 text-blue-500 mb-2" />
                  <h4 className="font-semibold text-gray-900">{t('about_shield_title')}</h4>
                  <p className="text-sm text-gray-600">{t('about_shield_desc')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-6">{t('our_values')}</h4>
              <div className="space-y-4">
                {[
                  t('about_value_1'),
                  t('about_value_2'),
                  t('about_value_3'),
                  t('about_value_4'),
                  t('about_value_5')
                ].map((value, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('services_title')}</h2>
            <p className="text-xl text-gray-600">{t('services_desc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <PiggyBank className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('savings_service')}</h3>
              <p className="text-gray-700 mb-6">
                {t('savings_service_desc')}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {t('savings_type_regular')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {t('savings_type_time')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {t('savings_type_children')}
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('loan_service')}</h3>
              <p className="text-gray-700 mb-6">
                {t('loan_service_desc')}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                  {t('loan_type_business')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                  {t('loan_type_personal')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                  {t('loan_type_home')}
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Handshake className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('transfer_service')}</h3>
              <p className="text-gray-700 mb-6">
                {t('transfer_service_desc')}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                  {t('transfer_type_domestic')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                  {t('transfer_type_mobile_banking')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                  {t('transfer_type_bill_payment')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Committees Section */}
      <section id="committees" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('committees_title')}</h2>
            <p className="text-xl text-gray-600">{t('committees_desc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{t('board_committee')}</h3>
              <p className="text-gray-700 text-center mb-6">
                {t('board_committee_desc')}
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>{t('policy_making')}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>{t('strategic_planning')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{t('audit_committee')}</h3>
              <p className="text-gray-700 text-center mb-6">
                {t('audit_committee_desc')}
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>{t('performance_monitoring')}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>{t('quality_control')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Banknote className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{t('loan_committee')}</h3>
              <p className="text-gray-700 text-center mb-6">
                {t('loan_committee_desc')}
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>{t('loan_assessment')}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>{t('risk_analysis')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Information Section */}
      <section id="shares" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('share_info_title')}</h2>
              <p className="text-xl text-gray-600 mb-8">
                {t('share_info_desc')}
              </p>
              
              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">መሰረታዊ አክሲዮን</h3>
                  <p className="text-3xl font-bold text-green-600 mb-2">1,000 {t('birr')}</p>
                  <p className="text-gray-700">{t('minimum_amount_for_membership')}</p>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">መደበኛ አክሲዮን</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-2">5,000 {t('birr')}</p>
                  <p className="text-gray-700">{t('full_membership_benefits')}</p>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">ልዩ አክሲዮን</h3>
                  <p className="text-3xl font-bold text-purple-600 mb-2">10,000+ {t('birr')}</p>
                  <p className="text-gray-700">{t('additional_benefits')}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-blue-600 text-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">{t('share_benefits_title')}</h3>
              <div className="space-y-4">
                {[
                  t('annual_profit_share'),
                  t('voting_rights'),
                  t('priority_loan_service'),
                  t('reduced_service_fee'),
                  t('insurance_coverage'),
                  t('family_member_benefits')
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => window.location.href = '/register'}
                className="w-full bg-white text-green-700 py-3 px-6 rounded-lg font-semibold hover:bg-green-50 transition-colors mt-8 flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                {t('buy_shares')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Types Section */}
      <section id="savings" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('savings_types_title')}</h2>
            <p className="text-xl text-gray-600">{t('savings_types_desc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <PiggyBank className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('savings_type_regular')}</h3>
              <p className="text-gray-600 text-sm mb-4">{t('savings_type_regular_desc')}</p>
              <div className="text-2xl font-bold text-green-600 mb-2">8%</div>
              <p className="text-xs text-gray-500">{t('annual_interest')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('savings_type_time')}</h3>
              <p className="text-gray-600 text-sm mb-4">{t('savings_type_time_desc')}</p>
              <div className="text-2xl font-bold text-blue-600 mb-2">12%</div>
              <p className="text-xs text-gray-500">{t('annual_interest')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('savings_type_children')}</h3>
              <p className="text-gray-600 text-sm mb-4">{t('savings_type_children_desc')}</p>
              <div className="text-2xl font-bold text-purple-600 mb-2">10%</div>
              <p className="text-xs text-gray-500">{t('annual_interest')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('savings_type_special')}</h3>
              <p className="text-gray-600 text-sm mb-4">{t('savings_type_special_desc')}</p>
              <div className="text-2xl font-bold text-yellow-600 mb-2">15%</div>
              <p className="text-xs text-gray-500">{t('annual_interest')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('contact_section_title')}</h2>
            <p className="text-xl text-green-100">{t('contact_section_desc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('phone')}</h3>
              <p className="text-green-100">+251 910 4169 32</p>
              <p className="text-green-100">+251 911 123 456</p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('email_address')}</h3>
              <p className="text-green-100">info@salemsaccos.com</p>
              <p className="text-green-100">support@salemsaccos.com</p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('address')}</h3>
              <p className="text-green-100">{t('addis_ababa_ethiopia')}</p>
              <p className="text-green-100">{t('bole_subcity')}</p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">{t('working_hours')}</h3>
              <button
                onClick={onContactClick}
                className="mb-6 bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                {t('view_details')}
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-100">
                <div>
                  <p className="font-semibold">{t('monday_friday_short')}</p>
                  <p>8:00 {t('am')} - 5:00 {t('pm')}</p>
                </div>
                
                <div>
                  <p className="font-semibold">{t('saturday')}</p>
                  <p>8:00 {t('am')} - 12:00 {t('noon')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage