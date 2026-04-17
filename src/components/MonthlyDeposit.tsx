import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  CreditCard, 
  Phone, 
  Hash, 
  Banknote, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Building2,
  Check,
  Construction,
  Send,
  Calendar
} from 'lucide-react';
import FileUpload from './FileUpload';

const MonthlyDeposit: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Maintenance Mode is currently ACTIVE
  const isMaintenance = true;

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    nationalId: '',
    phoneNumber: '',
    amount: '',
    originBank: '',
    destinationBank: '',
    receipt: null as any
  });

  const ethiopianBanks = [
    'Commercial Bank of Ethiopia (CBE)',
    'Bank of Abyssinia',
    'Awash Bank',
    'Dashen Bank',
    'Wegagen Bank',
    'United Bank (Hibret)',
    'Nib International Bank',
    'Cooperative Bank of Oromia',
    'Zemen Bank',
    'Oromia International Bank',
    'Berhan International Bank',
    'Bunna International Bank',
    'Lion International Bank',
    'Addis International Bank',
    'Enat Bank',
    'Amhara Bank',
    'Gadaa Bank',
    'Global Bank',
    'Telebirr',
    'CBE Birr',
    'Other'
  ];

  const destinationBanks = [
    { name: t('cbe_bank'), number: '1000753677503', logo: 'https://psssa.gov.et/sites/default/files/partner/cbe-logo.png' },
    { name: t('abyssinia_bank'), number: '253126493', logo: 'https://upload.wikimedia.org/wikipedia/en/e/ed/Bank_of_Abyssinia.png' },
    { name: t('awash_bank'), number: '013221745348900', logo: 'https://www.exchangebirr.com/bank4.png' },
    { name: t('non_interest_option'), number: '1000731916814', logo: 'https://psssa.gov.et/sites/default/files/partner/cbe-logo.png', isMuslim: true }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMaintenance) return; // double safety

    if (!formData.destinationBank) {
      setError('Please select a destination bank account');
      return;
    }
    if (!formData.receipt) {
      setError('Please upload your payment receipt');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError('Failed to process deposit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    input: "w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-gray-900 font-medium",
    label: "block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest",
    card: "bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100"
  };

  if (isMaintenance) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 bg-[#f8f6f5] flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#1e3b8b] font-bold mb-12 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            {t('back_to_home')}
          </button>

          <div className="bg-white rounded-[3rem] p-10 lg:p-20 shadow-2xl border border-gray-100 text-center relative overflow-hidden">
             {/* Background Decorative Elements */}
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#f4ac37]/5 rounded-full blur-3xl" />
             <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#1e3b8b]/5 rounded-full blur-3xl" />
             
             <div className="relative z-10">
                <div className="w-24 h-24 bg-[#f4ac37]/10 text-[#f4ac37] rounded-3xl flex items-center justify-center mx-auto mb-10 transform hover:rotate-12 transition-transform duration-500">
                  <Construction size={48} />
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-black text-[#1e3b8b] mb-6 tracking-tight">
                  {t('coming_soon', 'Monthly Deposit Coming Soon')}
                </h1>
                
                <p className="text-xl text-gray-500 font-medium mb-10 leading-relaxed max-w-xl mx-auto">
                  {t('maintenance_msg', 'We are currently upgrading our automated deposit systems to serve you better. This portal will be fully operational on:')}
                </p>

                <div className="inline-flex items-center gap-4 px-8 py-5 bg-[#1e3b8b] text-white rounded-3xl mb-12 shadow-xl shadow-[#1e3b8b]/20">
                   <Calendar size={28} className="text-[#f4ac37]" />
                   <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status: Maintenance</p>
                      <p className="text-lg font-bold">Monday, April 20</p>
                   </div>
                </div>

                <div className="border-t border-gray-100 pt-12">
                   <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-8">Manual Submission</p>
                   
                   <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                     Until then, please send your deposit details and payment receipt directly to our support staff via Telegram for manual integration:
                   </p>

                   <a 
                     href="https://t.me/BBS1221" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="inline-flex items-center gap-4 bg-[#0088cc] text-white px-10 py-5 rounded-3xl font-black hover:bg-[#0077b5] transition-all transform hover:scale-105 shadow-xl shadow-[#0088cc]/20 group"
                   >
                     <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                     {t('contact_staff', 'Contact Staff (@gutudanii)')}
                   </a>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center p-12 bg-white rounded-[3rem] shadow-2xl animate-fadeIn">
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={64} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">{t('deposit_success_title')}</h2>
          <p className="text-gray-500 font-medium mb-8">
            {t('deposit_success_msg')}
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all"
          >
            {t('back_to_home')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-primary font-bold mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          {t('back_to_home')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Form */}
          <div className="lg:col-span-8">
            <div className={styles.card}>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <CreditCard size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t('monthly_deposit')}</h1>
                  <p className="text-gray-400 font-medium">{t('deposit_subtitle')}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 animate-shake">
                    <AlertCircle size={20} />
                    <span className="text-sm font-bold">{error}</span>
                  </div>
                )}

                {/* Personal Information */}
                <div className="space-y-6">
                   <h3 className="text-lg font-black text-primary border-b border-gray-100 pb-2">{t('personal_info_tab')}</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className={styles.label}>{t('first_name_label')}</label>
                      <input 
                        required
                        className={styles.input}
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        placeholder={t('first_name_placeholder')}
                      />
                    </div>
                    <div>
                      <label className={styles.label}>{t('middle_name_label')}</label>
                      <input 
                        required
                        className={styles.input}
                        value={formData.middleName}
                        onChange={e => setFormData({...formData, middleName: e.target.value})}
                        placeholder={t('middle_name_placeholder')}
                      />
                    </div>
                    <div>
                      <label className={styles.label}>{t('last_name_label')}</label>
                      <input 
                        required
                        className={styles.input}
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        placeholder={t('last_name_placeholder')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={styles.label}>{t('national_id_label')}</label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          required
                          className={`${styles.input} pl-12 text-sm`}
                          value={formData.nationalId}
                          onChange={e => setFormData({...formData, nationalId: e.target.value})}
                          placeholder={t('national_id_placeholder')}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={styles.label}>{t('mobile_number_label')}</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          required
                          type="tel"
                          className={`${styles.input} pl-12 text-sm`}
                          value={formData.phoneNumber}
                          onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                          placeholder={t('mobile_number_placeholder')}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deposit Details */}
                <div className="space-y-6">
                   <h3 className="text-lg font-black text-primary border-b border-gray-100 pb-2">{t('payment_tab')}</h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className={styles.label}>{t('amount', 'Amount (Birr)')}</label>
                        <div className="relative">
                          <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            required
                            type="number"
                            min="1"
                            className={`${styles.input} pl-12 font-black text-primary text-xl`}
                            value={formData.amount}
                            onChange={e => setFormData({...formData, amount: e.target.value})}
                            placeholder="e.g. 500"
                          />
                        </div>
                     </div>
                     <div>
                        <label className={styles.label}>{t('origin_bank')}</label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <select 
                            required
                            className={`${styles.input} pl-12 appearance-none`}
                            value={formData.originBank}
                            onChange={e => setFormData({...formData, originBank: e.target.value})}
                          >
                            <option value="">{t('placeholder_origin_bank')}</option>
                            {ethiopianBanks.map((bank, i) => (
                              <option key={i} value={bank}>{bank}</option>
                            ))}
                          </select>
                        </div>
                     </div>
                   </div>

                   <div>
                      <label className={`${styles.label} mb-4`}>{t('destination_bank')}</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {destinationBanks.map((bank, i) => (
                          <div 
                            key={i} 
                            onClick={() => setFormData({ ...formData, destinationBank: `${bank.name} (${bank.number})` })}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                              formData.destinationBank.includes(bank.number) 
                              ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' 
                              : 'border-gray-100 hover:border-primary/20'
                            }`}
                          >
                            <div className="relative">
                               <img src={bank.logo} alt={bank.name} className="w-12 h-12 object-contain bg-white rounded-lg p-2 border border-gray-100 shadow-sm" />
                               {formData.destinationBank.includes(bank.number) && (
                                  <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full border-2 border-white">
                                     <Check size={8} strokeWidth={4} />
                                  </div>
                               )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[10px] font-black uppercase truncate ${bank.isMuslim ? 'text-accent' : 'text-gray-400'}`}>{bank.name}</p>
                              <p className="text-sm font-bold text-gray-900 font-mono">{bank.number}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="pt-4">
                      <label className={styles.label}>{t('upload_receipt')}</label>
                      <FileUpload 
                        label={t('upload_receipt')}
                        onChange={(file) => setFormData({...formData, receipt: file})}
                      />
                   </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-xl hover:bg-primary-dark transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={28} />
                  ) : (
                    <CheckCircle size={28} className="group-hover:scale-110 transition-transform" />
                  )}
                  {loading ? t('processing') : t('submit_deposit', 'Submit Deposit')}
                </button>
              </form>
            </div>
          </div>

          {/* Side Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/10 border border-white/5 relative overflow-hidden">
               <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12">
                  <Building2 size={180} />
               </div>
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center"><CreditCard size={18} /></div>
                 {t('secure')}
               </h3>
               <div className="space-y-6 relative z-10">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Salem Saccos</p>
                   <p className="text-sm leading-relaxed opacity-80">
                     {t('deposit_security_note')}
                   </p>
                 </div>
                 
                 <div className="space-y-4">
                    <p className="text-xs font-black uppercase text-white/40 tracking-widest">{t('working_hours')}</p>
                    <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                          <span className="opacity-60">{t('monday_friday')}</span>
                          <span className="font-bold">8:30 - 5:30</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="opacity-60">{t('saturday')}</span>
                          <span className="font-bold">8:30 - 12:30</span>
                       </div>
                    </div>
                 </div>
               </div>
            </div>

            <div className="bg-accent p-8 rounded-[2.5rem] text-white shadow-xl shadow-accent/10 border border-white/5">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Phone size={24} /></div>
                   <h3 className="text-xl font-bold">{t('info_support')}</h3>
                </div>
                <p className="text-sm font-medium leading-relaxed opacity-90 mb-6">
                  {t('info_new_member')}
                </p>
                <div className="p-4 bg-white/20 rounded-xl border border-white/10 text-center">
                   <p className="text-2xl font-black font-mono tracking-tighter cursor-copy">0946154444</p>
                                      <p className="text-2xl font-black font-mono tracking-tighter cursor-copy">0946134444</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyDeposit;
