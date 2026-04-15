import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  ArrowRight,
  PiggyBank,
  CreditCard,
  Handshake,
  Compass,
  Target,
  FileDown,
  CheckCircle,
  Star,
  Building,
  Users,
  TrendingUp,
  Briefcase,
  Banknote,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import heroImage from '/image/hero.png';

interface LandingPageProps {
  onContactClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onContactClick }) => {
  const { t } = useTranslation();
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase.from('members').select('*', { count: 'exact', head: true });
      setMemberCount(count || 0);
    };
    fetchCount();
  }, []);

  const BRAND = {
    primary: '#1e3b8b',
    accent: '#f4ac37',
    secondary: '#f8f6f5',
    text: '#1f2937'
  };

  return (
    <div className="bg-white text-gray-900 font-sans selection:bg-accent selection:text-white overflow-x-hidden">
      
      {/* 01 Hero - Balanced & Professional */}
      <section className="relative min-h-[90vh] flex items-center pt-20 px-6 lg:px-24 bg-gray-50/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto py-12">
          <div className="z-10 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <Star className="w-3 h-3 text-accent" />
              {t('trusted')} & {t('secure')}
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6 text-gray-900">
              {t('hero_title')}
            </h1>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl font-medium">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => window.location.href = '/register'}
                className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
              >
                {t('register_now')}
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => window.location.href = '/deposit'}
                className="px-8 py-4 rounded-xl border-2 border-primary/20 bg-white text-primary font-bold hover:bg-primary/5 flex items-center gap-2 transition-all shadow-lg shadow-gray-200/50"
              >
                <CreditCard size={20} className="text-accent" />
                {t('monthly_deposit')}
              </button>
              <button 
                onClick={onContactClick}
                className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:text-primary flex items-center gap-2 transition-all text-sm"
              >
                {t('contact_us')}
              </button>
            </div>
            
            {/* Detailed Quick Stats */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-2 gap-8 border-t border-gray-200 pt-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent"><Users size={24} /></div>
                <div>
                  <div className="text-2xl font-black text-gray-900">{memberCount}+</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('members')}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><Banknote size={24} /></div>
                <div>
                  <div className="text-2xl font-black text-gray-900">10M+</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('initial_savings')}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative order-1 lg:order-2 flex justify-center">
            <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] rotate-2 scale-105" />
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white max-w-full lg:max-w-none">
              <img 
                src={heroImage} 
                alt="Safe & Secure" 
                className="w-full h-auto lg:h-[550px] object-cover" 
              />
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 flex flex-col items-center">
                <Shield className="text-accent mb-1" size={24} />
                <span className="text-[10px] font-black uppercase text-gray-400">{t('secure')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 Strategy - Corporate Vision & Detailed About */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">{t('company_profile')}</h2>
            <p className="text-xl text-gray-500 leading-relaxed font-medium">{t('about_history_1')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 flex gap-6 items-start">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-primary/10"><Compass size={28} /></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t('our_vision_title')}</h3>
                  <p className="text-gray-600 leading-relaxed">{t('our_vision_desc')}</p>
                </div>
              </div>
              <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 flex gap-6 items-start">
                <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-accent/10"><Target size={28} /></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t('our_mission_title')}</h3>
                  <p className="text-gray-600 leading-relaxed">{t('our_mission_desc')}</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-primary rounded-3xl text-white flex flex-col justify-center relative overflow-hidden">
              <Building size={140} className="absolute -right-10 -bottom-10 opacity-5" />
              <h3 className="text-2xl font-bold mb-6">{t('our_values')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[t('integrity_transparency'), t('community_development'), t('financial_inclusion'), t('sustainable_growth'), t('about_value_1'), t('about_value_2')].map((v, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </div>
              <button 
                className="mt-10 inline-flex items-center gap-4 text-white font-bold hover:text-accent transition-colors"
              >
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center"><FileDown size={18} /></div>
                {t('download_profile')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 03 Services - Detailed & Informative */}
      <section id="services" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">{t('services_title')}</h2>
            <p className="text-lg text-gray-500 font-medium">{t('services_desc')}</p>
          </div>
          
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: PiggyBank, title: t('savings_service'), desc: t('savings_service_desc'), color: BRAND.primary, features: [t('savings_type_regular'), t('savings_type_time')] },
              { icon: CreditCard, title: t('loan_service'), desc: t('loan_service_desc'), color: BRAND.accent, features: [t('loan_type_business'), t('loan_type_personal')] },
              { icon: Handshake, title: t('transfer_service'), desc: t('transfer_service_desc'), color: '#8b5cf6', features: [t('transfer_type_domestic'), t('transfer_type_mobile_banking')] }
            ].map((s, i) => (
              <div key={i} className="group p-8 bg-white rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8" style={{ background: `${s.color}10` }}>
                  <s.icon size={32} style={{ color: s.color }} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{s.title}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed h-20 overflow-hidden line-clamp-3">{s.desc}</p>
                <div className="space-y-3 border-t border-gray-50 pt-6">
                  {s.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }}></div>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* 04 Committees & Governance - Added Detail */}
      <section id="committees" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl text-left">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">{t('committees_title')}</h2>
              <p className="text-lg text-gray-500 font-medium">{t('committees_desc')}</p>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Shield size={20} /></div>
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent"><Building size={20} /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 'board', title: t('board_committee'), desc: t('board_committee_desc'), icon: Briefcase, color: BRAND.primary },
              { id: 'audit', title: t('audit_committee'), desc: t('audit_committee_desc'), icon: Shield, color: BRAND.accent },
              { id: 'loan', title: t('loan_committee'), desc: t('loan_committee_desc'), icon: TrendingUp, color: BRAND.primary }
            ].map((c, i) => (
              <div key={i} className="p-8 rounded-3xl border border-gray-100 bg-gray-50/30 hover:bg-white hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: `${c.color}20` }}>
                  <c.icon size={24} style={{ color: c.color }} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{c.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 Shares & Investment - Strategic */}
      <section id="shares" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-primary rounded-[2.5rem] p-10 lg:p-20 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="text-white">
                <h2 className="text-3xl lg:text-5xl font-extrabold mb-8 leading-tight">{t('share_info_title')}</h2>
                <p className="text-lg text-white/70 mb-10 leading-relaxed">{t('share_info_desc')}</p>
                <div className="space-y-4">
                  {[t('annual_profit_share'), t('voting_rights'), t('priority_loan_service')].map((b, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-accent">
                        <CheckCircle size={20} />
                      </div>
                      <span className="font-semibold">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: t('basic_share'), price: '1,000', desc: t('basic_share_desc') },
                  { label: t('regular_share'), price: '5,000', desc: t('regular_share_desc') },
                  { label: t('special_share'), price: '10,000+', desc: t('special_share_desc') }
                ].map((s, i) => (
                  <div key={i} className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex justify-between items-center hover:bg-white/10 transition-all cursor-default group">
                    <div>
                      <h4 className="text-accent font-bold text-xs uppercase tracking-widest mb-1">{s.label}</h4>
                      <p className="text-2xl font-black text-white">{s.price} <span className="text-sm font-medium text-white/40">Birr</span></p>
                    </div>
                    <ArrowRight className="text-accent opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                ))}
                <div className="flex flex-col sm:flex-row gap-6 pt-10 animate-slideUp">
                  <button 
                    onClick={() => window.location.href = '/register'}
                    className="group flex items-center justify-center gap-3 bg-accent text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-accent-dark transition-all transform hover:scale-105 shadow-2xl shadow-accent/20"
                  >
                    <span>{t('register_now')}</span>
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ArrowRight size={20} />
                    </div>
                  </button>

                  <button 
                    onClick={() => window.location.href = '/deposit'}
                    className="group flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all transform hover:scale-105"
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                       <CreditCard size={20} className="text-accent" />
                    </div>
                    <span>{t('monthly_deposit')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06 Final Call - Condensed & Powerful */}
      <section id="contact" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-extrabold text-primary mb-6">{t('contact_us')}</h2>
              <p className="text-lg text-gray-500 mb-10">{t('bank_transfer_instructions')}</p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0"><MapPin size={24} /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t('address')}</h4>
                    <p className="text-gray-600">{t('addis_ababa_ethiopia')}</p>
                    <p className="text-gray-600">{t('bole_subcity')}</p>
                    <p className="text-gray-600">{t('woreda_03')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent flex-shrink-0"><Phone size={24} /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t('phone')}</h4>
                    <p className="text-gray-600">0946154444</p>
                    <p className="text-gray-600">0946134444</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0"><Mail size={24} /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t('email_address')}</h4>
                    <p className="text-gray-600">{t('info_email')}</p>
                    <p className="text-gray-600">{t('support_email')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">{t('stay_connected')}</h3>
              <div className="space-y-4">
                <input type="email" placeholder={t('email_placeholder')} className="w-full px-6 py-4 rounded-xl border border-gray-200 outline-none focus:border-primary transition-all" />
                <button className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-all">{t('view_details')}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;