import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Smartphone, 
  Home, 
  Briefcase, 
  CreditCard, 
  FileText, 
  Users,
  MapPin,
  Calendar,
  Shield,
  Info
} from 'lucide-react';

interface MemberDetailViewProps {
  member: any;
}

const MemberDetailView: React.FC<MemberDetailViewProps> = ({ member }) => {
  const { t } = useTranslation();

  const BRAND = {
    primary: '#1e3b8b',
    secondary: '#f8f6f5',
    accent: '#f4ac37',
    primaryDark: '#162d6b',
    accentDark: '#d4962a'
  };

  const API_BASE_URL = 'http://142.132.180.209:4583';

  const getFullImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Handle relative paths from the API
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <Icon size={18} className="text-blue-900" />
        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ label, value }: { label: string, value: any }) => (
    <div className="mb-3">
      <p className="text-[10px] text-slate-400 font-medium uppercase mb-0.5">{label}</p>
      <p className="text-slate-700 font-semibold text-sm">{value || '-'}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Profile Info */}
      <div className="flex flex-col md:flex-row gap-6 items-start bg-blue-900 p-6 rounded-2xl text-white shadow-lg">
        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/10 flex-shrink-0 border-2 border-white/20">
          {member.profilePhotoUrl ? (
            <img 
              src={getFullImageUrl(member.profilePhotoUrl)} 
              alt="Profile" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + member.firstName + '+' + member.lastName + '&background=f4ac37&color=fff';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/30">
              <User size={64} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold">{member.title || ''} {member.firstName} {member.middleName || ''} {member.lastName}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              member.status === 'ACTIVE' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {member.status}
            </span>
          </div>
          <p className="text-blue-200 font-mono text-sm mb-4">{member.memberCode || member.id_fcn}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <Smartphone size={16} className="text-blue-300" />
              {member.contactInfo?.mobileNumber || member.phone_number}
            </div>
            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <Calendar size={16} className="text-blue-300" />
              {new Date(member.membershipDate || member.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details */}
        <Section title={t('personal_info')} icon={User}>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label={t('fullNameAmharic')} value={member.fullNameAmharic} />
            <InfoItem label={t('gender')} value={member.gender} />
            <InfoItem label={t('dateOfBirth')} value={member.dateOfBirth} />
            <InfoItem label={t('maritalStatus')} value={member.maritalStatus} />
            <InfoItem label={t('motherName')} value={member.motherName} />
            <InfoItem label={t('nationality')} value={member.nationality} />
            <InfoItem label={t('nationalId')} value={member.nationalId} />
            <InfoItem label={t('familySize')} value={member.familySize} />
          </div>
        </Section>

        {/* Contact & Address */}
        <Section title={t('contact_details')} icon={MapPin}>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label={t('secondary_phone')} value={member.contactInfo?.mobileNumber2} />
            <InfoItem label={t('email')} value={member.contactInfo?.email} />
            <div className="col-span-2">
              <p className="text-[10px] text-slate-400 font-medium uppercase mb-1">Address</p>
              <p className="text-slate-700 font-semibold text-sm">
                {member.addressInfo?.houseNumber ? `${member.addressInfo.houseNumber}, ` : ''}
                {member.addressInfo?.woreda ? `${member.addressInfo.woreda}, ` : ''}
                {member.addressInfo?.subCity ? `${member.addressInfo.subCity}, ` : ''}
                {member.addressInfo?.city ? `${member.addressInfo.city}, ` : ''}
                {member.addressInfo?.region || member.region}<br />
                {member.addressInfo?.country || 'Ethiopia'}
              </p>
            </div>
          </div>
        </Section>

        {/* Education & Employment */}
        <Section title={t('employment_details')} icon={Briefcase}>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label={t('employmentStatus')} value={member.educationEmploymentInfo?.employmentStatus} />
            <InfoItem label={t('employerName')} value={member.educationEmploymentInfo?.employerName} />
            <InfoItem label={t('educationLevel')} value={member.educationEmploymentInfo?.educationLevel} />
            <InfoItem label={t('currentPosition')} value={member.educationEmploymentInfo?.currentPosition} />
            <div className="col-span-2">
              <InfoItem label={t('otherQualifications')} value={member.educationEmploymentInfo?.otherQualifications} />
            </div>
          </div>
        </Section>

        {/* Emergency Contact */}
        <Section title={t('emergency_contact')} icon={Users}>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label={t('fullName')} value={member.emergencyContact?.fullName} />
            <InfoItem label={t('phone')} value={member.emergencyContact?.phone} />
            <InfoItem label={t('relationship')} value={member.emergencyContact?.relationship} />
          </div>
        </Section>

        {/* Payment & Financial Info */}
        <Section title={t('payment_info')} icon={CreditCard}>
          <div className="grid grid-cols-2 gap-4">
             <InfoItem label={t('accountNumber')} value={member.accountNumber} />
             <InfoItem label={t('registrationFee')} value={`${member.payment?.registrationFee?.toLocaleString() || 0} Birr`} />
             <InfoItem label={t('initialShares')} value={member.payment?.initialShares} />
             <InfoItem label={t('shareAmount')} value={`${member.payment?.shareAmount?.toLocaleString() || 0} Birr`} />
             <InfoItem label={t('initialMonthlySaving')} value={`${member.payment?.initialMonthlySaving?.toLocaleString() || 0} Birr`} />
             <InfoItem label={t('destinationBank')} value={member.payment?.destinationBankOurAccount} />
          </div>
        </Section>

        {/* Referral Info */}
        <Section title={t('referral_info')} icon={Info}>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label={t('referralSource')} value={member.referralSource} />
            <InfoItem label={t('referredByName')} value={member.referredByName} />
            <div className="col-span-2">
              <InfoItem label={t('referredByPhone')} value={member.referredByPhone} />
            </div>
          </div>
        </Section>
      </div>

      {/* Documents Preview */}
      <Section title={t('documents')} icon={FileText}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'ID Front', url: member.documents?.nationalIdFrontUrl },
            { label: 'ID Back', url: member.documents?.nationalIdBackUrl },
            { label: 'Signature', url: member.documents?.digitalSignatureUrl || member.digital_signature_url },
            { label: 'Receipt', url: member.documents?.registrationFeeReceiptUrl }
          ].map((doc, i) => (
            doc.url ? (
              <div key={i} className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <img 
                  src={getFullImageUrl(doc.url)} 
                  alt={doc.label} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center');
                    (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-[8px] text-slate-400 font-bold uppercase">${doc.label} ERROR</span>`;
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                  <p className="text-white text-[10px] font-bold uppercase mb-2">{doc.label}</p>
                  <a 
                    href={getFullImageUrl(doc.url)} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="px-3 py-1 bg-white text-blue-900 rounded-lg text-[10px] font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform"
                  >
                    VIEW FULL
                  </a>
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

      {/* Admin/Approval Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-6 items-center">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Approval Status:</span>
          {member.approvalInfo?.approved ? (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Approved</span>
          ) : (
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Pending</span>
          )}
        </div>
        {member.approvalInfo?.approvedBy && (
          <div className="text-sm text-slate-600">
            Approved by <span className="font-bold">{member.approvalInfo.approvedBy}</span> on {new Date(member.approvalInfo.approvedDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDetailView;
