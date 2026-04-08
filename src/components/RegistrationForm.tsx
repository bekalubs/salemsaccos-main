import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { membersAPI } from '../utils/api';
import { getCurrentUserId } from '../utils/jwt';
import { 
  ArrowLeft, 
  UserPlus, 
  Briefcase, 
  Phone, 
  Mail, 
  Calendar, 
  CreditCard,
  User,
  Users,
  GraduationCap,
  Home,
  Smartphone,
  FileText,
  CheckCircle,
  XCircle,
  PenTool,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import FileUpload from './FileUpload';
import DigitalSignature from './DigitalSignature';

const RegisterMember: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [success, setSuccess] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    fullNameAmharic: '',
    gender: 'MALE',
    dateOfBirth: '',
    maritalStatus: 'SINGLE',
    nationality: 'Ethiopian',
    nationalId: '',
    accountNumber: '',
    membershipDate: new Date().toISOString(),
    status: 'ACTIVE',
    isOrganizational: false,
    orgManagerName: '',
    tinNumber: '',
  });

  const [shareInfo, setShareInfo] = useState({
    shareType: 'basic',
    shareAmount: 1000,
    registrationFee: 1500,
    monthlySaving: 500,
    originBank: '',
    destinationBank: ''
  });
  
  const [contactInfo, setContactInfo] = useState({
    mobileNumber: '',
    mobileNumber2: '',
    officePhone: '',
    email: ''
  });
  
  const [addressInfo, setAddressInfo] = useState({
    branchCode: 1,
    country: 'Ethiopia',
    region: '',
    city: '',
    subCity: '',
    woreda: '',
    houseNumber: ''
  });
  
  const [educationEmploymentInfo, setEducationEmploymentInfo] = useState({
    educationLevel: '',
    areaOfStudy: '',
    otherQualifications: '',
    currentPosition: '',
    previousPosition: '',
    directorshipInfo: ''
  });

  const tabs = [
    { id: 'personal', label: t('personal_info_tab'), icon: User },
    { id: 'contact', label: t('contact_details_tab'), icon: Smartphone },
    { id: 'address', label: t('address_tab'), icon: Home },
    { id: 'education', label: t('education_work_tab'), icon: GraduationCap },
    { id: 'documents', label: t('documents_signature_tab'), icon: FileText },
    { id: 'payment', label: t('payment_tab'), icon: CreditCard },
  ];

  const BRAND = {
    primary: '#1e3b8b',
    secondary: '#f8f6f5',
    accent: '#f4ac37',
    primaryDark: '#162d6b',
    accentDark: '#d4962a'
  };

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;
    let val: any = value;
    if (type === 'checkbox') {
      val = (e.target as HTMLInputElement).checked;
    }
    setPersonalInfo(prev => ({ ...prev, [name]: val }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddressInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEducationEmploymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Tab-specific validation before moving to next or submitting
    if (activeTab === 'personal') {
      if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.gender || !personalInfo.dateOfBirth) {
        setError(t('registration_error_detail'));
        return;
      }
    } else if (activeTab === 'contact') {
      if (!contactInfo.mobileNumber) {
        setError(t('phone_number_error'));
        return;
      }
    } else if (activeTab === 'payment') {
      if (!shareInfo.shareType) {
        setError(t('registration_error_detail'));
        return;
      }
    }

    // Navigation logic
    if (activeTab !== 'payment') {
      const currentIndex = tabs.findIndex(t => t.id === activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1].id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // Final Submission Logic (Reached only on 'payment' tab)
    setLoading(true);

    try {
      const createdBy = getCurrentUserId();
      
      // Generate account number if empty
      let finalAccountNumber = personalInfo.accountNumber;
      if (!finalAccountNumber) {
        const randomPart = Math.floor(10000000 + Math.random() * 90000000).toString();
        finalAccountNumber = `SAL-${randomPart}`;
      }

      const payload = {
        ...personalInfo,
        accountNumber: finalAccountNumber,
        registrationFee: shareInfo.registrationFee,
        shareAmount: shareInfo.shareAmount,
        initialMonthlySaving: shareInfo.monthlySaving,
        totalInitialPayment: shareInfo.registrationFee + shareInfo.shareAmount + shareInfo.monthlySaving,
        originBank: shareInfo.originBank,
        destinationBank: shareInfo.destinationBank,
        membershipDate: new Date().toISOString(),
        contactInfo,
        addressInfo,
        educationEmploymentInfo,
        createdBy
      };
      
      const res = await membersAPI.create(payload, addressInfo.branchCode);
      if (res.data) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate('/'); // In this project, '/' is the home view
        }, 1800);
      }
    } catch (err) {
      console.error(err);
      setError(t('registration_error'));
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 16px',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    header: {
      marginBottom: '32px'
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: BRAND.primary,
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 500,
      marginBottom: '20px',
      padding: '10px 20px',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    headerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap' as const,
      gap: '16px'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    iconBox: {
      background: BRAND.primary,
      padding: '16px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 6px rgba(30, 59, 139, 0.2)'
    },
    headerTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: BRAND.primary,
      margin: 0
    },
    headerSubtitle: {
      color: '#4b5563',
      marginTop: '4px',
      fontSize: '14px'
    },
    badge: {
      background: BRAND.secondary,
      padding: '8px 16px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '12px',
      color: BRAND.primary,
      border: `1px solid ${BRAND.primary}20`
    },
    errorAlert: {
      background: '#fef2f2',
      borderLeft: '4px solid #ef4444',
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      animation: 'shake 0.5s ease-in-out'
    },
    errorText: {
      color: '#b91c1c',
      margin: 0,
      fontWeight: 500
    },
    tabsContainer: {
      background: 'white',
      borderRadius: '12px 12px 0 0',
      overflowX: 'auto' as const,
      display: 'flex',
      borderBottom: '1px solid #e5e7eb',
      scrollbarWidth: 'none' as const
    },
    tabButton: (isActive: boolean) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '16px 24px',
      background: isActive ? 'white' : 'transparent',
      border: 'none',
      borderBottom: isActive ? `3px solid ${BRAND.accent}` : '3px solid transparent',
      color: isActive ? BRAND.primary : '#6b7280',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: isActive ? 700 : 500,
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap' as const
    }),
    formContainer: {
      background: 'white',
      borderRadius: '0 0 12px 12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      borderTop: 'none',
      overflow: 'hidden'
    },
    formContent: {
      padding: '40px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px'
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: 600,
      color: '#374151'
    },
    requiredStar: {
      color: '#ef4444'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      outline: 'none',
      background: '#fff'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      background: 'white',
      cursor: 'pointer',
      outline: 'none'
    },
    checkboxContainer: {
      marginTop: '24px',
      paddingTop: '24px',
      borderTop: '1px solid #f3f4f6'
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      fontSize: '15px',
      color: '#374151',
      fontWeight: 500
    },
    checkbox: {
      width: '20px',
      height: '20px',
      cursor: 'pointer',
      accentColor: BRAND.primary
    },
    organizationalSection: {
      marginTop: '16px',
      marginLeft: '32px',
      padding: '24px',
      background: BRAND.secondary,
      borderRadius: '12px',
      border: `1px solid ${BRAND.primary}10`
    },
    actionsContainer: {
      borderTop: '1px solid #e5e7eb',
      padding: '24px 40px',
      background: '#fafafa',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '16px'
    },
    cancelButton: {
      padding: '12px 28px',
      background: 'white',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 600,
      color: '#374151',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    submitButton: {
      padding: '12px 32px',
      background: BRAND.primary,
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 600,
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 6px -1px rgba(30, 59, 139, 0.3)'
    },
    submitButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    spinner: {
      width: '18px',
      height: '18px',
      border: '2px solid white',
      borderTop: '2px solid transparent',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }
  };

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', marginTop: '100px' }}>
      <div style={styles.container}>
        {success && (
          <div style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: BRAND.primary,
            color: 'white',
            padding: '20px 32px',
            borderRadius: 16,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <CheckCircle size={28} color={BRAND.accent} />
            <div style={{ fontWeight: 600, fontSize: 18 }}>{t('registration_success')}</div>
          </div>
        )}

        {/* Header */}
        <div style={styles.header}>
          <button
            onClick={() => navigate(-1)}
            style={styles.backButton}
            onMouseEnter={(e) => e.currentTarget.style.background = BRAND.primaryDark}
            onMouseLeave={(e) => e.currentTarget.style.background = BRAND.primary}
          >
            <ArrowLeft size={18} />
            {t('back_to_home')}
          </button>
          
          <div style={styles.headerContent}>
            <div style={styles.headerLeft}>
              <div style={styles.iconBox}>
                <UserPlus size={32} color="white" />
              </div>
              <div>
                <h1 style={styles.headerTitle}>{t('register_new_member')}</h1>
                <p style={styles.headerSubtitle}>{t('register_subtitle')}</p>
              </div>
            </div>
            <div style={styles.badge}>
              <div style={{ width: '8px', height: '8px', background: BRAND.accent, borderRadius: '50%' }}></div>
              {t('required_all_hint')}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={styles.errorAlert}>
            <XCircle size={20} color="#dc2626" />
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={styles.tabButton(activeTab === tab.id)}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.formContainer}>
          <div style={styles.formContent}>
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="animate-fadeIn">
                <div style={styles.grid}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>
                      <User size={14} color={BRAND.primary} />
                      {t('title_label')}
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={personalInfo.title}
                      onChange={handlePersonalChange}
                      placeholder={t('title_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>
                      <span style={styles.requiredStar}>*</span>
                      {t('first_name_label')}
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={personalInfo.firstName}
                      onChange={handlePersonalChange}
                      required
                      placeholder={t('first_name_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('middle_name_label')}</label>
                    <input
                      type="text"
                      name="middleName"
                      value={personalInfo.middleName}
                      onChange={handlePersonalChange}
                      placeholder={t('middle_name_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>
                      <span style={styles.requiredStar}>*</span>
                      {t('last_name_label')}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={personalInfo.lastName}
                      onChange={handlePersonalChange}
                      required
                      placeholder={t('last_name_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('full_name_amharic_label')}</label>
                    <input
                      type="text"
                      name="fullNameAmharic"
                      value={personalInfo.fullNameAmharic}
                      onChange={handlePersonalChange}
                      placeholder={t('full_name_amharic_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>
                      <span style={styles.requiredStar}>*</span>
                      {t('gender_label')}
                    </label>
                    <select
                      name="gender"
                      value={personalInfo.gender}
                      onChange={handlePersonalChange}
                      style={styles.select}
                    >
                      <option value="MALE">{t('gender_male')}</option>
                      <option value="FEMALE">{t('gender_female')}</option>
                    </select>
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>
                      <Calendar size={14} color={BRAND.primary} />
                      {t('date_of_birth_label')}
                      <span style={styles.requiredStar}>*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={personalInfo.dateOfBirth}
                      onChange={handlePersonalChange}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('marital_status_label')}</label>
                    <select
                      name="maritalStatus"
                      value={personalInfo.maritalStatus}
                      onChange={handlePersonalChange}
                      style={styles.select}
                    >
                      <option value="SINGLE">{t('marital_status_single')}</option>
                      <option value="MARRIED">{t('marital_status_married')}</option>
                      <option value="DIVORCED">{t('marital_status_divorced')}</option>
                      <option value="WIDOWED">{t('marital_status_widowed')}</option>
                    </select>
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('national_id_label')}</label>
                    <input
                      type="text"
                      name="nationalId"
                      value={personalInfo.nationalId}
                      onChange={handlePersonalChange}
                      placeholder={t('national_id_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('nationality_label')}</label>
                    <input
                      type="text"
                      name="nationality"
                      value={personalInfo.nationality}
                      onChange={handlePersonalChange}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('account_number_label')}</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={personalInfo.accountNumber}
                      onChange={handlePersonalChange}
                      placeholder={t('account_number_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                </div>

                <div style={styles.checkboxContainer}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="isOrganizational"
                      checked={personalInfo.isOrganizational}
                      onChange={handlePersonalChange}
                      style={styles.checkbox}
                    />
                    <Users size={20} color={BRAND.primary} />
                    <span>{t('is_organizational_label')}</span>
                  </label>
                  
                  {personalInfo.isOrganizational && (
                    <div style={styles.organizationalSection}>
                      <label style={styles.label}>{t('org_manager_name_label')}</label>
                      <input
                        type="text"
                        name="orgManagerName"
                        value={personalInfo.orgManagerName}
                        onChange={handlePersonalChange}
                        placeholder={t('org_manager_name_placeholder')}
                        style={{...styles.input, marginTop: '8px'}}
                        onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Information Tab */}
            {activeTab === 'contact' && (
              <div className="animate-fadeIn">
                <div style={styles.grid}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>
                      <Smartphone size={14} color={BRAND.primary} />
                      {t('mobile_number_label')}
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={contactInfo.mobileNumber}
                      onChange={handleContactChange}
                      required
                      placeholder={t('mobile_number_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>
                      <Smartphone size={14} color={BRAND.primary} />
                      {t('secondary_mobile_label')}
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber2"
                      value={contactInfo.mobileNumber2}
                      onChange={handleContactChange}
                      placeholder={t('mobile_number_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>
                      <Mail size={14} color={BRAND.primary} />
                      {t('email_address_label')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contactInfo.email}
                      onChange={handleContactChange}
                      placeholder={t('email_address_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>
                      <Phone size={14} color={BRAND.primary} />
                      {t('office_phone_label')}
                    </label>
                    <input
                      type="tel"
                      name="officePhone"
                      value={contactInfo.officePhone}
                      onChange={handleContactChange}
                      placeholder={t('office_phone_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Address Information Tab */}
            {activeTab === 'address' && (
              <div className="animate-fadeIn">
                <div style={styles.grid}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('country_label')}</label>
                    <input
                      type="text"
                      name="country"
                      value={addressInfo.country}
                      onChange={handleAddressChange}
                      style={{...styles.input, background: '#f5f5f5'}}
                      readOnly
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('region_label')}</label>
                    <input
                      type="text"
                      name="region"
                      value={addressInfo.region}
                      onChange={handleAddressChange}
                      placeholder="e.g., Addis Ababa, Oromia"
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('city_label')}</label>
                    <input
                      type="text"
                      name="city"
                      value={addressInfo.city}
                      onChange={handleAddressChange}
                      placeholder={t('city_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('sub_city_label')}</label>
                    <input
                      type="text"
                      name="subCity"
                      value={addressInfo.subCity}
                      onChange={handleAddressChange}
                      placeholder={t('sub_city_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('woreda_label')}</label>
                    <input
                      type="text"
                      name="woreda"
                      value={addressInfo.woreda}
                      onChange={handleAddressChange}
                      placeholder={t('woreda_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('house_number_label')}</label>
                    <input
                      type="text"
                      name="houseNumber"
                      value={addressInfo.houseNumber}
                      onChange={handleAddressChange}
                      placeholder={t('house_number_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Education & Employment Tab */}
            {activeTab === 'education' && (
              <div className="animate-fadeIn">
                <div style={styles.grid}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>
                      <GraduationCap size={14} color={BRAND.primary} />
                      {t('education_level_label')}
                    </label>
                    <input
                      type="text"
                      name="educationLevel"
                      value={educationEmploymentInfo.educationLevel}
                      onChange={handleEducationChange}
                      placeholder={t('education_level_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('area_of_study_label')}</label>
                    <input
                      type="text"
                      name="areaOfStudy"
                      value={educationEmploymentInfo.areaOfStudy}
                      onChange={handleEducationChange}
                      placeholder={t('area_of_study_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>
                      <Briefcase size={14} color={BRAND.primary} />
                      {t('current_position_label')}
                    </label>
                    <input
                      type="text"
                      name="currentPosition"
                      value={educationEmploymentInfo.currentPosition}
                      onChange={handleEducationChange}
                      placeholder={t('current_position_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('previous_position_label')}</label>
                    <input
                      type="text"
                      name="previousPosition"
                      value={educationEmploymentInfo.previousPosition}
                      onChange={handleEducationChange}
                      placeholder={t('previous_position_placeholder')}
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = BRAND.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Documents & Signature Tab */}
            {activeTab === 'documents' && (
              <div className="animate-fadeIn space-y-8">
                <div style={styles.fieldGroup}>
                  <h3 style={{ ...styles.label, fontSize: '16px', borderBottom: `2px solid ${BRAND.secondary}`, paddingBottom: '8px' }}>
                    <FileText size={18} color={BRAND.primary} />
                    {t('documents_title')}
                  </h3>
                  <div style={{ ...styles.grid, marginTop: '16px' }}>
                    <FileUpload
                      label={t('id_front_label')}
                      onChange={() => {}} // "Just nothing happens okay for now"
                    />
                    <FileUpload
                      label={t('id_back_label')}
                      onChange={() => {}} // "Just nothing happens okay for now"
                    />
                  </div>
                </div>

                <div style={styles.fieldGroup}>
                  <h3 style={{ ...styles.label, fontSize: '16px', borderBottom: `2px solid ${BRAND.secondary}`, paddingBottom: '8px' }}>
                    <PenTool size={18} color={BRAND.primary} />
                    {t('digital_signature')}
                  </h3>
                  <div style={{ marginTop: '16px' }}>
                    <DigitalSignature
                      onSignatureChange={() => {}} // "Just nothing happens okay for now"
                      value=""
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment & Shares Tab */}
            {activeTab === 'payment' && (
              <div className="animate-fadeIn space-y-8">
                <div>
                  <h3 style={{ ...styles.label, fontSize: '18px', marginBottom: '20px', color: BRAND.primary }}>
                    <Users size={20} style={{ marginRight: '8px' }} />
                    {t('select_share_type')}
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {[
                      { id: 'basic', label: t('basic_share'), amount: 1000, desc: t('basic_share_desc'), color: '#3b82f6' },
                      { id: 'regular', label: t('regular_share'), amount: 5000, desc: t('regular_share_desc'), color: '#10b981' },
                      { id: 'special', label: t('special_share'), amount: 10000, desc: t('special_share_desc'), color: BRAND.accent }
                    ].map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => setShareInfo({ ...shareInfo, shareType: plan.id, shareAmount: Math.max(plan.amount, shareInfo.shareAmount) })}
                        style={{
                          padding: '24px',
                          borderRadius: '16px',
                          border: `2px solid ${shareInfo.shareType === plan.id ? BRAND.primary : '#e5e7eb'}`,
                          background: shareInfo.shareType === plan.id ? `${BRAND.primary}05` : 'white',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          boxShadow: shareInfo.shareType === plan.id ? '0 10px 15px -3px rgba(30, 59, 139, 0.1)' : 'none'
                        }}
                      >
                        {shareInfo.shareType === plan.id && (
                          <div style={{ position: 'absolute', top: '12px', right: '12px', background: BRAND.primary, borderRadius: '50%', padding: '4px' }}>
                            <Check size={16} color="white" />
                          </div>
                        )}
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#111827' }}>{plan.label}</h4>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: plan.color, margin: '8px 0' }}>
                          {plan.amount.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 500 }}>Birr</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>{plan.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Payment Inputs */}
                <div style={{ ...styles.grid, background: '#f8fafc', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('registration_fee')}</label>
                    <input
                      type="text"
                      value="1,500 Birr"
                      disabled
                      style={{ ...styles.input, background: '#e5e7eb', cursor: 'not-allowed', fontWeight: 'bold' }}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('share_amount')} (Min 1,000)</label>
                    <input
                      type="number"
                      min="1000"
                      value={shareInfo.shareAmount}
                      onChange={(e) => setShareInfo({ ...shareInfo, shareAmount: parseInt(e.target.value) || 0 })}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('initial_savings')} (Min 500)</label>
                    <input
                      type="number"
                      min="500"
                      value={shareInfo.monthlySaving}
                      onChange={(e) => setShareInfo({ ...shareInfo, monthlySaving: parseInt(e.target.value) || 0 })}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={{ background: BRAND.primary, padding: '32px', borderRadius: '16px', color: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>{t('total_payment_amount')}</h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{t('bank_transfer_instructions')}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '42px', fontWeight: 900, color: BRAND.accent }}>
                        {(1500 + shareInfo.shareAmount + shareInfo.monthlySaving).toLocaleString()} <span style={{ fontSize: '20px' }}>Birr</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                    {[
                      { name: t('cbe_bank'), number: '1000753677503', logo: 'https://psssa.gov.et/sites/default/files/partner/cbe-logo.png' },
                      { name: t('abyssinia_bank'), number: '253126493', logo: 'https://upload.wikimedia.org/wikipedia/en/e/ed/Bank_of_Abyssinia.png' }, // Abyssinia logo
                      { name: t('awash_bank'), number: '013221745348900', logo: 'https://www.exchangebirr.com/bank4.png' },
                      { name: t('non_interest_option'), number: '1000731916814', logo: 'https://psssa.gov.et/sites/default/files/partner/cbe-logo.png', isMuslim: true }
                    ].map((bank, i) => (
                      <div 
                        key={i} 
                        onClick={() => setShareInfo({ ...shareInfo, destinationBank: `${bank.name} (${bank.number})` })}
                        style={{ 
                          background: shareInfo.destinationBank.includes(bank.number) ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)', 
                          padding: '16px', 
                          borderRadius: '12px', 
                          border: `2px solid ${shareInfo.destinationBank.includes(bank.number) ? BRAND.accent : 'rgba(255,255,255,0.1)'}`, 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <img src={bank.logo} alt={bank.name} style={{ width: '40px', height: '40px', objectFit: 'contain', background: 'white', borderRadius: '4px', padding: '2px' }} />
                        <div>
                          <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: bank.isMuslim ? BRAND.accent : 'rgba(255,255,255,0.8)' }}>{bank.name}</p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: 700, color: 'white' }}>{bank.number}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.grid}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('origin_bank')}</label>
                    <select 
                      style={styles.select}
                      value={shareInfo.originBank}
                      onChange={(e) => setShareInfo({ ...shareInfo, originBank: e.target.value })}
                    >
                      <option value="">{t('placeholder_origin_bank')}</option>
                      <option value="CBE">Commercial Bank of Ethiopia (CBE)</option>
                      <option value="Abyssinia">Bank of Abyssinia</option>
                      <option value="Awash">Awash Bank</option>
                      <option value="Dashen">Dashen Bank</option>
                      <option value="Wegagen">Wegagen Bank</option>
                      <option value="Telebirr">Telebirr</option>
                      <option value="CBE Birr">CBE Birr</option>
                      <option value="M-Pesa">M-Pesa</option>
                      <option value="Other">Other Bank</option>
                    </select>
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t('destination_bank')}</label>
                    <input
                      type="text"
                      value={shareInfo.destinationBank}
                      placeholder={t('placeholder_destination_bank')}
                      style={{ ...styles.input, background: '#f1f5f9' }}
                      readOnly
                    />
                  </div>
                </div>

                <div style={styles.fieldGroup}>
                  <h3 style={{ ...styles.label, fontSize: '16px', borderBottom: `2px solid ${BRAND.secondary}`, paddingBottom: '8px' }}>
                    <ImageIcon size={18} color={BRAND.primary} />
                    {t('upload_receipt')}
                  </h3>
                  <div style={{ marginTop: '16px' }}>
                    <FileUpload
                      label={t('upload_receipt')}
                      onChange={() => {}} // Still on backup nothing but UI exists
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div style={styles.actionsContainer}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={styles.cancelButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              {t('cancel')}
            </button>

            {activeTab !== 'payment' && (
              <button
                key="next-btn"
                type="button"
                onClick={() => {
                  const currentIndex = tabs.findIndex(t => t.id === activeTab);
                  if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
                }}
                style={styles.submitButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = BRAND.primaryDark;
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(30, 59, 139, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = BRAND.primary;
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(30, 59, 139, 0.3)';
                }}
              >
                <span>{t('next')}</span>
              </button>
            )}
            
            {activeTab === 'payment' && (
              <button
                key="submit-btn"
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  ...(loading ? styles.submitButtonDisabled : {})
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.background = BRAND.primaryDark;
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(30, 59, 139, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = BRAND.primary;
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(30, 59, 139, 0.3)';
                }}
              >
                {loading ? (
                  <>
                    <div style={styles.spinner}></div>
                    <span>{t('processing')}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>{t('complete_registration')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        input, select, button {
          font-family: inherit;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

export default RegisterMember;
