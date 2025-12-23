import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { User, Phone, Users, FileText, MapPin, Briefcase } from 'lucide-react'
import { supabase } from '../lib/supabase'
import FileUpload from './FileUpload'
import DigitalSignature from './DigitalSignature'

const isValidEthiopianMobile = (number: string) => /^09\d{8}$/.test(number);

const checkFCNUnique = async (idFcn: string) => {
  const { data, error } = await supabase
    .from('members')
    .select('id_fcn')
    .eq('id_fcn', idFcn)
    .single();
  return !data; // true if not found (unique)
}

const RegistrationForm: React.FC = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    grandfatherName: '',
    gender: '',
    region: '',
    woreda: '',
    cityKebele: '',
    occupation: '',
    idFin: '',
    idFcn: '',
    referrerPhone: '',
    phoneNumber: '',
    maritalStatus: '',
  })

  const [files, setFiles] = useState({
    idFront: null as File | null,
    idBack: null as File | null,
  })

  const [signature, setSignature] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<{ idFcn?: string; phoneNumber?: string }>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Special validation for FCN field - only allow 16 digits
    if (name === 'idFcn') {
      const digitsOnly = value.replace(/\D/g, '')
      if (digitsOnly.length <= 16) {
        setFormData(prev => ({
          ...prev,
          [name]: digitsOnly
        }))
        setErrors(prev => ({ ...prev, idFcn: undefined }))
      }
      return
    }
    
    if (name === 'phoneNumber') {
      const digitsOnly = value.replace(/\D/g, '')
      setFormData(prev => ({
        ...prev,
        [name]: digitsOnly
      }))
      setErrors(prev => ({
        ...prev,
        phoneNumber: digitsOnly.length === 10 && isValidEthiopianMobile(digitsOnly)
          ? undefined
          : t('phone_number_error')
      }))
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (field: keyof typeof files, file: File | null) => {
    setFiles(prev => ({
      ...prev,
      [field]: file
    }))
  }

  const uploadFile = async (file: File, path: string) => {
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${path}/${fileName}`

      const { data, error } = await supabase.storage
        .from('member-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        throw error
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('member-documents')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Validate FCN uniqueness and phone number
      const isFCNUnique = await checkFCNUnique(formData.idFcn)
      if (!isFCNUnique) {
        setErrors(prev => ({ ...prev, idFcn: t('id_fcn_exists') }))
        setIsSubmitting(false)
        return
      }
      if (!isValidEthiopianMobile(formData.phoneNumber)) {
        setErrors(prev => ({ ...prev, phoneNumber: t('phone_number_error') }))
        setIsSubmitting(false)
        return
      }

      // Upload files
      const fileUrls: Record<string, string> = {}
      
      if (files.idFront) {
        fileUrls.idFrontUrl = await uploadFile(files.idFront, 'id-front')
      }
      
      if (files.idBack) {
        fileUrls.idBackUrl = await uploadFile(files.idBack, 'id-back')
      }

      // Upload digital signature if present
      let signatureUrl = ''
      if (signature) {
        // Convert base64 to blob
        const response = await fetch(signature)
        const blob = await response.blob()
        const signatureFile = new File([blob], 'signature.png', { type: 'image/png' })
        signatureUrl = await uploadFile(signatureFile, 'signatures')
      }

      // Submit form data
      const { error } = await supabase
        .from('members')
        .insert([
          {
            full_name: formData.fullName,
            father_name: formData.fatherName,
            grandfather_name: formData.grandfatherName,
            gender: formData.gender,
            region: formData.region,
            woreda: formData.woreda,
            city_kebele: formData.cityKebele,
            occupation: formData.occupation,
            id_fcn: formData.idFcn,
            referrer_phone: formData.referrerPhone || null,
            phone_number: formData.phoneNumber,
            marital_status: formData.maritalStatus,
            digital_signature_url: signatureUrl || null,
            id_front_url: fileUrls.idFrontUrl || null,
            id_back_url: fileUrls.idBackUrl || null,
          }
        ])

      if (error) {
        console.error('Database error:', error)
        throw error
      }

      setSubmitStatus('success')
      // Reset form
      setFormData({
        fullName: '',
        fatherName: '',
        grandfatherName: '',
        gender: '',
        region: '',
        woreda: '',
        cityKebele: '',
        occupation: '',
        idFin: '',
        idFcn: '',
        referrerPhone: '',
        phoneNumber: '',
        maritalStatus: '',
      })
      setFiles({
        idFront: null,
        idBack: null,
      })
      setSignature('')
      setErrors({})
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('registration_title')}</h1>
          <p className="text-gray-600">{t('registration_form_title')}</p>
          <p className="text-sm text-gray-500 mt-2">
            {t('registration_form_instruction')}
          </p>
        </div>

        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">✅ {t('registration_success')}</p>
            <p className="text-green-700 text-sm mt-1">{t('registration_success_detail')}</p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">❌ {t('registration_error')}</p>
            <p className="text-red-700 text-sm mt-1">{t('registration_error_detail')}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                {t('full_name_label')}
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder={t('full_name_placeholder')}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('father_name_label')}
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                placeholder={t('father_name_placeholder')}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('grandfather_name_label')}
              </label>
              <input
                type="text"
                name="grandfatherName"
                value={formData.grandfatherName}
                onChange={handleInputChange}
                placeholder={t('grandfather_name_placeholder')}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('gender_label')}
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">{t('gender_placeholder')}</option>
                <option value="male">{t('gender_male')}</option>
                <option value="female">{t('gender_female')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                {t('region_label')}
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">{t('region_placeholder')}</option>
                <option value="addis-ababa">{t('region_addis_ababa')}</option>
                <option value="oromia">{t('region_oromia')}</option>
                <option value="amhara">{t('region_amhara')}</option>
                <option value="tigray">{t('region_tigray')}</option>
                <option value="snnpr">{t('region_snnpr')}</option>
                <option value="sidama">{t('region_sidama')}</option>
                <option value="afar">{t('region_afar')}</option>
                <option value="somali">{t('region_somali')}</option>
                <option value="benishangul">{t('region_benishangul')}</option>
                <option value="gambela">{t('region_gambela')}</option>
                <option value="harari">{t('region_harari')}</option>
                <option value="dire-dawa">{t('region_dire_dawa')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('woreda_label')}
              </label>
              <input
                type="text"
                name="woreda"
                value={formData.woreda}
                onChange={handleInputChange}
                placeholder={t('woreda_placeholder')}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('city_kebele_label')}
              </label>
              <input
                type="text"
                name="cityKebele"
                value={formData.cityKebele}
                onChange={handleInputChange}
                placeholder={t('city_kebele_placeholder')}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="inline w-4 h-4 mr-1" />
                {t('occupation_label')}
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                placeholder={t('occupation_placeholder')}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('id_fcn_label')}
              </label>
              <input
                type="text"
                name="idFcn"
                value={formData.idFcn}
                onChange={handleInputChange}
                placeholder={t('id_fcn_placeholder')}
                maxLength={16}
                pattern="[0-9]{16}"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('id_fcn_hint', { length: formData.idFcn.length })}
              </p>
              {errors.idFcn && (
                <p className="text-xs text-red-500 mt-1">{errors.idFcn}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline w-4 h-4 mr-1" />
                {t('referrer_phone_label')}
              </label>
              <input
                type="tel"
                name="referrerPhone"
                value={formData.referrerPhone}
                onChange={handleInputChange}
                placeholder={t('referrer_phone_placeholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('phone_number_label')}
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder={t('phone_number_placeholder')}
                required
                maxLength={10}
                pattern="09[0-9]{8}"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors.phoneNumber && (
                <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('marital_status_label')}
              </label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">{t('marital_status_placeholder')}</option>
                <option value="ያላገባ">{t('marital_status_single')}</option>
                <option value="ያገባ">{t('marital_status_married')}</option>
              </select>
            </div>
          </div>

          {/* File Uploads */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              {t('documents_title')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload
                label={t('id_front_label')}
                onChange={(file) => handleFileChange('idFront', file)}
              />
              
              <FileUpload
                label={t('id_back_label')}
                onChange={(file) => handleFileChange('idBack', file)}
              />
            </div>
          </div>

          {/* Digital Signature */}
          <div className="border-t pt-6">
            <DigitalSignature
              onSignatureChange={setSignature}
              value={signature}
            />
          </div>

          {/* Submit Button */}
          <div className="border-t pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('submitting')}
                </>
              ) : (
                t('submit')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegistrationForm
