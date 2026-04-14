import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { membersAPI } from '../utils/api';
import { 
  CheckCircle, 
  User, 
  Smartphone, 
  Home, 
  Briefcase, 
  CreditCard, 
  FileText, 
  ArrowLeft, 
  Printer,
  LayoutDashboard,
  Clock
} from 'lucide-react';

const RegistrationSummary: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const BRAND = {
    primary: '#1e3b8b',
    secondary: '#f8f6f5',
    accent: '#f4ac37',
    primaryDark: '#162d6b',
    accentDark: '#d4962a'
  };

  const API_BASE_URL = 'http://142.132.180.209:4583';

  useEffect(() => {
    const fetchMember = async () => {
      try {
        if (!id) return;
        const res = await membersAPI.getById(id);
        setMember(res);
      } catch (err) {
        console.error('Error fetching member summary:', err);
        setError('Failed to load registration details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const getFullImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <ArrowLeft className="text-red-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
          <p className="text-slate-600 mb-8">{error || 'Member not found'}</p>
          <button 
            onClick={() => navigate('/members')}
            className="w-full py-3 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <Icon size={20} className="text-blue-900" />
        </div>
        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ label, value }: { label: string, value: any }) => (
    <div className="mb-4">
      <p className="text-xs text-slate-400 font-medium uppercase mb-1">{label}</p>
      <p className="text-slate-700 font-semibold">{value || '-'}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-5xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">{t('registration_confirmation_title')}</h1>
          <div className="bg-blue-900 text-white inline-block px-8 py-4 rounded-2xl shadow-lg mb-6">
             <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">{t('member_id_label')}</p>
             <p className="text-3xl font-mono font-black tracking-tighter">{member.memberCode}</p>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            {t('awaiting_approval_msg')}
          </p>
        </div>

        {/* Pending Approval Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-12 flex items-center gap-6">
          <div className="bg-amber-100 p-4 rounded-full">
            <Clock className="text-amber-600" size={32} />
          </div>
          <div>
            <h4 className="text-amber-900 font-bold text-xl">Awaiting Teller Approval</h4>
            <p className="text-amber-700">A teller will review your documents and payment receipt within 24-48 hours. Once approved, you will receive a confirmation email.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Personal & Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-slate-100">
              <div className="aspect-square bg-slate-100 relative">
                {member.profilePhotoUrl ? (
                  <img src={getFullImageUrl(member.profilePhotoUrl)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User size={120} />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                  <h2 className="text-2xl font-bold uppercase tracking-tight">
                    {member.firstName} {member.lastName}
                  </h2>
                  <p className="text-white/80 font-mono text-sm">{member.memberCode}</p>
                </div>
              </div>
              <div className="p-8">
                <InfoItem label={t('gender_label')} value={member.gender} />
                <InfoItem label={t('date_of_birth_label')} value={member.dateOfBirth} />
                <InfoItem label={t('mother_name_label')} value={member.motherName} />
                <InfoItem label={t('nationality_label')} value={member.nationality} />
                <InfoItem label={t('marital_status_label')} value={member.maritalStatus} />
              </div>
            </div>

            <Section title={t('emergency_contact_title')} icon={Users}>
              <InfoItem label={t('emergency_contact_full_name')} value={member.emergencyContact?.fullName} />
              <InfoItem label={t('mobile_number_label')} value={member.emergencyContact?.phone} />
              <InfoItem label={t('relationship_label')} value={member.emergencyContact?.relationship} />
            </Section>
          </div>

          {/* Right Columns: Detailed Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Section title={t('contact_address')} icon={Smartphone}>
                <InfoItem label={t('mobile_number_label')} value={member.contactInfo?.mobileNumber} />
                <InfoItem label={t('email_address_label')} value={member.contactInfo?.email} />
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-medium uppercase mb-2">Location</p>
                  <p className="text-slate-700 font-semibold leading-relaxed">
                    {member.addressInfo?.houseNumber}, {member.addressInfo?.woreda}, {member.addressInfo?.subCity}<br />
                    {member.addressInfo?.city}, {member.addressInfo?.region}<br />
                    {member.addressInfo?.country}
                  </p>
                </div>
              </Section>

              <Section title={t('employment_details')} icon={Briefcase}>
                <InfoItem label={t('employment_status_label')} value={member.educationEmploymentInfo?.employmentStatus} />
                <InfoItem label={t('employer_name_label')} value={member.educationEmploymentInfo?.employerName} />
                <InfoItem label={t('education_level_label')} value={member.educationEmploymentInfo?.educationLevel} />
                <InfoItem label={t('current_position_label')} value={member.educationEmploymentInfo?.currentPosition} />
              </Section>
            </div>

            <Section title={t('payment_summary')} icon={CreditCard}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Registration</p>
                  <p className="text-xl font-bold text-slate-800">{member.payment?.registrationFee?.toLocaleString()} Birr</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Share Capital</p>
                  <p className="text-xl font-bold text-slate-800">{member.payment?.shareAmount?.toLocaleString()} Birr</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-blue-900 border border-blue-100">
                  <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Initial Saving</p>
                  <p className="text-xl font-bold">{member.payment?.initialMonthlySaving?.toLocaleString()} Birr</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold ring-1 ring-blue-100">
                  {t('origin_bank')}: {member.payment?.originBankSentFrom}
                </div>
                <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold ring-1 ring-green-100">
                  {t('destination_bank')}: {member.payment?.destinationBankOurAccount}
                </div>
              </div>
            </Section>

            <Section title={t('documents_preview')} icon={FileText}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'ID Front', url: member.documents?.nationalIdFrontUrl },
                  { label: 'ID Back', url: member.documents?.nationalIdBackUrl },
                  { label: 'Signature', url: member.documents?.digitalSignatureUrl },
                  { label: 'Receipt', url: member.documents?.registrationFeeReceiptUrl }
                ].map((doc, i) => (
                  doc.url ? (
                    <div key={i} className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img src={getFullImageUrl(doc.url)} alt={doc.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                        <p className="text-white text-[10px] font-bold uppercase">{doc.label}</p>
                        <a href={getFullImageUrl(doc.url)} target="_blank" rel="noreferrer" className="mt-2 px-3 py-1 bg-white text-black rounded text-[10px] font-bold">VIEW</a>
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="aspect-[3/4] rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
                      <FileText size={24} />
                      <p className="text-[10px] mt-2 font-bold">{doc.label} MISSING</p>
                    </div>
                  )
                ))}
              </div>
            </Section>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-3 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all hover:border-slate-300"
              >
                <Printer size={20} />
                {t('print_summary')}
              </button>
              <button 
                onClick={() => navigate('/members')}
                className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue-900 text-white rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20"
              >
                <LayoutDashboard size={20} />
                {t('go_to_dashboard')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          .mt-20 { margin-top: 0 !important; }
          button { display: none !important; }
          .bg-slate-50 { background: white !important; }
          .shadow-xl, .shadow-lg, .shadow-sm { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

// Mock Users icon since it might be needed for the Section component if not imported
const Users = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M11 8.83a4 4 0 0 0 3.2-9.17" />
  </svg>
);

export default RegistrationSummary;
