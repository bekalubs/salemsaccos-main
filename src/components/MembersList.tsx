"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  Users,
  Search,
  Calendar,
  Phone,
  MapPin,
  FileText,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Printer,
} from "lucide-react"
import { membersAPI } from "../utils/api"
import MemberDetailView from "./MemberDetailView"

export type Member = {
  id: string
  memberCode: string
  title: string
  firstName: string
  middleName?: string
  lastName: string
  fullNameAmharic?: string
  gender: string
  dateOfBirth: string
  maritalStatus: string
  nationality: string
  nationalId: string
  contactInfo: {
    mobileNumber: string
    mobileNumber2?: string
    officePhone?: string
    email?: string
  }
  addressInfo: {
    region: string
    city: string
    subCity?: string
    woreda: string
    houseNumber?: string
  }
  educationEmploymentInfo?: any
  documents?: any
  payment?: any
  status: string
  membershipDate: string
  createdAt: string
  profilePhotoUrl?: string
}

const MembersList: React.FC = () => {
  const { t } = useTranslation()
  const [members, setMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchCategory, setSearchCategory] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [selectedMember, setSelectedMember] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0) // 0-based for API
  const [itemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  useEffect(() => {
    fetchMembers()
  }, [currentPage, searchTerm, searchCategory, regionFilter])

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        size: itemsPerPage,
        sortDirection: 'DESC'
      };

      if (searchTerm.trim()) {
        if (searchCategory === 'name') params.name = searchTerm;
        else if (searchCategory === 'phone') params.phone = searchTerm; 
        else if (searchCategory === 'id') params.memberCode = searchTerm;
        else params.name = searchTerm; // Default to name search
      }

      if (regionFilter !== 'all') {
        // Backend doesn't have direct region filter in searchMembers params in spec, 
        // but we can try if it supports it or just filter locally if not too many.
        // For now, let's stick to name/surname/memberCode/nationalId/status
      }

      const res = await membersAPI.getAll(params);
      
      // Handle Spring Data Page object
      const pageData = res.data?.data || res.data;
      
      if (pageData && pageData.content) {
        setMembers(pageData.content);
        setTotalPages(pageData.totalPages || 0);
        setTotalElements(pageData.totalElements || 0);
      } else if (Array.isArray(pageData)) {
        setMembers(pageData);
        setTotalElements(pageData.length);
        setTotalPages(Math.ceil(pageData.length / itemsPerPage));
      } else {
        setMembers([]);
        setTotalElements(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchMembers();
  };

  // Local filtering is removed in favor of API search
  const filterMembers = () => {}
  const paginateMembers = () => {}

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${t('saccos')} - ${t('members_list_report')}</title>
          <style>
            body { font-family: 'Inter', sans-serif; margin: 40px; color: #1e293b; line-height: 1.5; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1e3b8b; padding-bottom: 20px; }
            .logo { color: #1e3b8b; font-size: 28px; font-weight: 800; margin-bottom: 8px; text-transform: uppercase; letter-spacing: -0.025em; }
            .subtitle { color: #64748b; font-size: 14px; font-weight: 500; }
            .report-title { font-size: 20px; font-weight: 700; color: #1e3b8b; margin-top: 10px; }
            .filters { margin-bottom: 30px; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .filter-item { font-size: 13px; color: #475569; }
            .filter-item strong { color: #1e293b; }
            table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 20px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
            th, td { padding: 12px 15px; text-align: left; font-size: 11px; border-bottom: 1px solid #e2e8f0; }
            th { background-color: #f1f5f9; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
            tr:last-child td { border-bottom: none; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            @media print { .no-print { display: none; } body { margin: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">SALEM SACCOS</div>
            <div class="subtitle">Empowering Through Cooperation</div>
            <div class="report-title">${t('members_list_report')}</div>
          </div>
          
          <div class="filters">
            <div class="filter-item"><strong>Generated On:</strong> ${new Date().toLocaleString()}</div>
            <div class="filter-item"><strong>Total Records:</strong> ${totalElements}</div>
            <div class="filter-item"><strong>Search Content:</strong> ${searchTerm || 'None'}</div>
            <div class="filter-item"><strong>Filter:</strong> ${regionFilter === 'all' ? 'All Regions' : regionFilter}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Full Name</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Region</th>
                <th>Status</th>
                <th>Reg. Date</th>
              </tr>
            </thead>
            <tbody>
              ${members
                .map(
                  (member) => `
                <tr>
                  <td>${member.memberCode}</td>
                  <td>${member.firstName} ${member.lastName}</td>
                  <td>${member.gender}</td>
                  <td>${member.contactInfo?.mobileNumber || 'N/A'}</td>
                  <td>${member.addressInfo?.region || 'N/A'}</td>
                  <td>${member.status}</td>
                  <td>${new Date(member.membershipDate).toLocaleDateString()}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Salem Saccos. All Rights Reserved.</p>
            <p>Addis Ababa, Ethiopia</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const getUniqueRegions = () => {
    return [
      "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Dire Dawa", 
      "Gambela", "Harari", "Oromia", "Sidama", "SNNPR", "South West", "Tigray"
    ]
  }

  const goToPage = (page: number) => {
    setCurrentPage(page - 1)
  }

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("am-ET", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const MemberDetailModal = ({ member, onClose }: { member: any; onClose: () => void }) => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col transform transition-all scale-100 opacity-100">
        <div className="sticky top-0 bg-white border-b px-8 py-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t('member_detail_info')}</h2>
            <p className="text-slate-500 text-sm font-medium">Viewing complete record for {member.firstName} {member.lastName}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto bg-slate-50/50">
          <MemberDetailView member={member} />
        </div>
        
        <div className="bg-white border-t p-6 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
          >
            {t('close')}
          </button>
          <button 
            onClick={() => window.print()}
            className="px-8 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg flex items-center gap-2"
          >
            <Printer size={18} />
            {t('print_record')}
          </button>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-8 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-800 flex items-center tracking-tight">
                <Users className="w-10 h-10 mr-4 text-blue-900" />
                {t('registered_members')}
              </h1>
              <p className="text-slate-500 mt-2 font-medium">
                {t('total')} <span className="text-blue-900 font-bold">{totalElements}</span> {t('members')} {t('registered')}
              </p>
            </div>

            <form onSubmit={handleSearch} className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-900 w-full outline-none transition-all font-medium text-slate-700 shadow-sm hover:bg-white"
              />
            </form>
          </div>
        </div>

        <div className="p-8 border-b bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Region Filter */}
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                <Filter className="inline w-3 h-3 mr-1" />
                {t('region_filter')}
              </label>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-900 outline-none transition-all font-bold text-slate-700"
              >
                <option value="all">{t('all_regions')}</option>
                {getUniqueRegions().map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Category */}
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t('search_category')}</label>
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-900 outline-none transition-all font-bold text-slate-700"
              >
                <option value="all">{t('all')}</option>
                <option value="name">{t('name')}</option>
                <option value="phone">{t('phone_number')}</option>
                <option value="id">{t('member_code')}</option>
              </select>
            </div>

            {/* Stats Summary (Hidden on mobile) */}
            <div className="hidden md:flex flex-col justify-end">
               <p className="text-[10px] text-slate-400 font-bold uppercase mb-3">QUICK STATS</p>
               <div className="flex gap-4">
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-black uppercase tracking-tighter">
                    {totalElements} Active
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-black uppercase tracking-tighter">
                    {totalPages} Pages
                  </div>
               </div>
            </div>

            {/* Print Button */}
            <div className="flex items-end">
              <button
                onClick={handlePrint}
                className="flex items-center px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-all w-full justify-center font-bold shadow-lg shadow-blue-900/20 active:scale-95"
              >
                <Printer className="w-5 h-5 mr-2" />
                {t('print_report')}
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{t('member')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{t('contact')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{t('location')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{t('status')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{t('registration')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {members.map((member) => (
                <tr key={member.id} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-xl bg-blue-900/5 flex items-center justify-center text-blue-900 font-black text-lg overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                        {member.profilePhotoUrl ? (
                          <img 
                            src={`http://142.132.180.209:4583${member.profilePhotoUrl.startsWith('/') ? '' : '/'}${member.profilePhotoUrl}`} 
                            alt="" 
                            className="h-full w-full object-cover" 
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          member.firstName?.charAt(0)
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-black text-slate-800 uppercase tracking-tight">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">
                          {member.memberCode}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Phone size={12} className="text-slate-400" />
                        {member.contactInfo?.mobileNumber || 'N/A'}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 font-medium">{member.contactInfo?.email || 'No email provided'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center text-sm font-bold text-slate-600">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      {member.addressInfo?.city || 'N/A'}, {member.addressInfo?.region || 'N/A'}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      member.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center text-sm font-bold text-slate-600">
                      <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                      {formatDate(member.membershipDate || member.createdAt)}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all shadow-sm active:scale-95"
                    >
                      <Eye className="w-3 h-3 mr-2" />
                      {t('view_full_profile')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {members.length === 0 && (
            <div className="text-center py-20 bg-slate-50/30">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
                 <FileText className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">{t('no_members_found')}</h3>
              <p className="text-slate-400 mt-2 font-medium">{searchTerm ? t('try_adjusting_search') : t('start_by_registering')}</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalElements > 0 && totalPages > 1 && (
          <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {t('showing')} <span className="text-slate-800">{currentPage * itemsPerPage + 1}</span> {t('to')} <span className="text-slate-800">{Math.min((currentPage + 1) * itemsPerPage, totalElements)}</span> {t('of')} <span className="text-slate-800">{totalElements}</span> {t('entries')}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 0}
                  className="flex items-center px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {t('prev')}
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current page
                    if (page === 1 || page === totalPages || (page >= currentPage && page <= currentPage + 2)) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 flex items-center justify-center text-[11px] font-black rounded-xl transition-all ${
                            page === currentPage + 1
                              ? "bg-blue-900 text-white shadow-xl shadow-blue-900/20"
                              : "text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (
                      (page === currentPage - 1 && currentPage > 2) ||
                      (page === currentPage + 3 && currentPage < totalPages - 3)
                    ) {
                      return (
                        <span key={page} className="w-10 h-10 flex items-end justify-center text-slate-400 font-bold">
                          ...
                        </span>
                      )
                    }
                    return null
                  })}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="flex items-center px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                >
                  {t('next')}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedMember && <MemberDetailModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
    </div>
  )
}

export default MembersList
