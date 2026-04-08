// components/Footer.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Facebook, 
  Send, 
  Linkedin, 
  Twitter, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const footerLinks = [
    {
      title: t('quick_links'),
      links: [
        { label: t('home'), href: '/' },
        { label: t('about'), href: '#about' },
        { label: t('services'), href: '#services' },
        { label: t('committees'), href: '#committees' },
        { label: t('add_member'), href: '/register' },
      ]
    },
    {
      title: t('services'),
      links: [
        { label: t('savings_service'), href: '#services' },
        { label: t('loan_service'), href: '#services' },
        { label: t('transfer_service'), href: '#services' },
      ]
    },
    {
      title: t('support'),
      links: [
        { label: t('contact_us'), href: '#contact' },
        { label: t('company_profile'), href: '#' },
        { label: t('download_profile'), href: '#' },
      ]
    }
  ];

  return (
    <footer className="bg-primary text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          
          {/* Brand Identity */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src="/image/logo.jpg" 
                  alt="Salem Saccos Logo" 
                  className="w-14 h-14 rounded-full border-2 border-white/20 shadow-xl object-cover" 
                />
                <div className="absolute -bottom-1 -right-1 bg-accent rounded-full p-1 border-2 border-primary">
                  <CheckCircle size={12} className="text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-black tracking-tighter">SALEM<span className="text-accent">SACCOS</span></h2>
            </div>
            <p className="text-white/70 leading-relaxed text-lg max-w-sm">
              {t('saccos_desc')}
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: '#', label: t('facebook') },
                { icon: Send, href: '#', label: t('telegram') },
                { icon: Linkedin, href: '#', label: t('linkedin') },
                { icon: Twitter, href: '#', label: t('twitter') }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-all transform hover:-translate-y-1"
                  title={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Navigation Groups */}
          {footerLinks.map((group, i) => (
            <div key={i} className="space-y-8">
              <h3 className="text-accent font-black uppercase tracking-widest text-xs">{group.title}</h3>
              <ul className="space-y-4">
                {group.links.map((link, j) => (
                  <li key={j}>
                    <a 
                      href={link.href} 
                      className="text-white/60 hover:text-accent transition-all flex items-center gap-2 group text-sm font-medium"
                    >
                      <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Global Contact Summary Section at bottom of footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-white/10 mb-12">
           <div className="flex gap-4 items-start">
              <MapPin className="text-accent flex-shrink-0" size={24} />
              <div>
                 <h4 className="font-bold text-white mb-2">{t('address')}</h4>
                 <p className="text-sm text-white/60">{t('addis_ababa_ethiopia')}</p>
                 <p className="text-sm text-white/60">{t('bole_subcity')}</p>
                 <p className="text-sm text-white/60">{t('woreda_03')}</p>
              </div>
           </div>
           <div className="flex gap-4 items-start">
              <Phone className="text-accent flex-shrink-0" size={24} />
              <div>
                 <h4 className="font-bold text-white mb-2">{t('phone')}</h4>
                 <p className="text-sm text-white/60">+251 910 4169 32</p>
                 <p className="text-sm text-white/60">+251 911 123 456</p>
              </div>
           </div>
           <div className="flex gap-4 items-start">
              <Mail className="text-accent flex-shrink-0" size={24} />
              <div>
                 <h4 className="font-bold text-white mb-2">{t('email_address')}</h4>
                 <p className="text-sm text-white/60">{t('info_email')}</p>
                 <p className="text-sm text-white/60">{t('support_email')}</p>
              </div>
           </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-8 border-t border-white/5">
          <div className="flex items-center gap-2 text-white/40 text-xs font-medium">
            <ShieldCheck size={16} className="text-accent" />
            <span>{t('copyright')}</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-white/40 hover:text-white transition-colors text-xs font-medium">Privacy Policy</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors text-xs font-medium">Terms of Service</a>
            <span className="text-white/20 text-xs font-medium border-l border-white/10 pl-8 ml-8 hidden md:inline">{t('designed_by')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;