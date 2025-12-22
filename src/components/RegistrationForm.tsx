import React, { useState } from 'react'
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
          : 'የትክክለኛ 10 አሃዝ የሞባይል ቁጥር ያስገቡ (09...)'
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
        setErrors(prev => ({ ...prev, idFcn: 'ይህ የፋይዳ መታወቂያ FCN ቀድሞ ተመዝግቧል!' }))
        setIsSubmitting(false)
        return
      }
      if (!isValidEthiopianMobile(formData.phoneNumber)) {
        setErrors(prev => ({ ...prev, phoneNumber: 'የትክክለኛ 10 አሃዝ የሞባይል ቁጥር ያስገቡ (09...)' }))
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ሳሌም ሳኮስ</h1>
          <p className="text-gray-600">የአባልነት ምዝገባ ቅጽ</p>
          <p className="text-sm text-gray-500 mt-2">
            ለሳሌም የምስራታ ሂደት በእጅጉ ይጠቅማልና እባክዎ ሙሉ መረጃዎትን በአግባቡ ይመዝግቡ
          </p>
        </div>

        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">✅ ምዝገባዎ በተሳካ ሁኔታ ተጠናቋል!</p>
            <p className="text-green-700 text-sm mt-1">የአባልነት መረጃዎ በሳሌም ሳኮስ ዳታቤዝ ተመዝግቧል።</p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">❌ ምዝገባዎ ሳይሳካ ቀርቷል</p>
            <p className="text-red-700 text-sm mt-1">እባክዎ ሁሉንም መረጃዎች በትክክል ሞልተው እንደገና ይሞክሩ።</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                ስም *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="የራስዎን ስም ያስገቡ"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                የአባት ስም *
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                placeholder="የአባትዎን ስም ያስገቡ"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                የአያት ስም *
              </label>
              <input
                type="text"
                name="grandfatherName"
                value={formData.grandfatherName}
                onChange={handleInputChange}
                placeholder="የአያትዎን ስም ያስገቡ"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ጾታ *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">ጾታዎን ይምረጡ</option>
                <option value="male">ወንድ</option>
                <option value="female">ሴት</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                ክልል *
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">አንዱን ይምረጡ</option>
                <option value="addis-ababa">አዲስ አበባ</option>
                <option value="oromia">ኦሮሚያ</option>
                <option value="amhara">አማራ</option>
                <option value="tigray">ትግራይ</option>
                <option value="snnpr">ደቡብ ብሔሮች</option>
                <option value="sidama">ሲዳማ</option>
                <option value="afar">አፋር</option>
                <option value="somali">ሶማሊ</option>
                <option value="benishangul">ቤንሻንጉል</option>
                <option value="gambela">ጋምቤላ</option>
                <option value="harari">ሐረሪ</option>
                <option value="dire-dawa">ድሬዳዋ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ወረዳ *
              </label>
              <input
                type="text"
                name="woreda"
                value={formData.woreda}
                onChange={handleInputChange}
                placeholder="የሚኖሩበትን ወረዳ ያስገቡ"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ክፍለ ከተማ/ቀበሌ *
              </label>
              <input
                type="text"
                name="cityKebele"
                value={formData.cityKebele}
                onChange={handleInputChange}
                placeholder="የሚኖሩበትን ክ/ከተማ/ቀበሌ ያስገቡ"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="inline w-4 h-4 mr-1" />
                ስራ/ትምህርት *
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                placeholder="እየሰሩ ያሉት ሥራ/ትምህርት"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                የፋይዳ መታወቂያ FCN *
              </label>
              <input
                type="text"
                name="idFcn"
                value={formData.idFcn}
                onChange={handleInputChange}
                placeholder="16 አሃዝ የፋይዳ መታወቂያ FCN ያስገቡ"
                maxLength={16}
                pattern="[0-9]{16}"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                16 አሃዝ ቁጥር ብቻ ያስገቡ ({formData.idFcn.length}/16)
              </p>
              {errors.idFcn && (
                <p className="text-xs text-red-500 mt-1">{errors.idFcn}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline w-4 h-4 mr-1" />
                የመሳቢያ ስልክ ቁጥር
              </label>
              <input
                type="tel"
                name="referrerPhone"
                value={formData.referrerPhone}
                onChange={handleInputChange}
                placeholder="ወደሳሌም የጋበዘዎ ሰው ስልክ ቁጥር"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                የርስዎ ስልክ ቁጥር *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="የርስዎን ስልክ ቁጥር ያስገቡ"
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
                የጋብቻ ሁኔታ *
              </label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">አንዱን ይምረጡ</option>
                <option value="ያላገባ">ያላገባ</option>
                <option value="ያገባ">ያገባ</option>
              </select>
            </div>
          </div>

          {/* File Uploads */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              ሰነዶች
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload
                label="የፋይዳ መታወቂያ የፊት ገጽ"
                onChange={(file) => handleFileChange('idFront', file)}
              />
              
              <FileUpload
                label="የፋይዳ መታወቂያ ጀርባ"
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
                  እየተመዘገበ...
                </>
              ) : (
                'ይመዝገቡ'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegistrationForm
