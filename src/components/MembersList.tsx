"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
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
  LogOut,
  Briefcase,
  Shield,
  Info,
  ExternalLink,
  ChevronDown
} from "lucide-react"
import { clearAuthData, getUserData } from "../utils/jwt"
import { membersAPI } from "../utils/api"
import MemberDetailView from "./MemberDetailView"

// Component outside to avoid re-creation
const MemberDetailModal = ({ member, onClose, t }: { member: any; onClose: () => void; t: any }) => (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
    <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col transform transition-all scale-100 opacity-100">
      <div className="sticky top-0 bg-white border-b px-8 py-6 flex justify-between items-center z-10">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {t('member_detail_info') || 'Member Profile'}
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Viewing record for <span className="text-blue-900 font-bold">{member.firstName} {member.lastName}</span>
          </p>
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
          {t('close') || 'Close'}
        </button>
        <button 
          onClick={() => window.print()}
          className="px-8 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg flex items-center gap-2"
        >
          <Printer size={18} />
          {t('print_record') || 'Print Record'}
        </button>
      </div>
    </div>
  </div>
);

const MembersList: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  // State
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchCategory, setSearchCategory] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [selectedMember, setSelectedMember] = useState<any | null>(null)
  
  const itemsPerPage = 10
  const userData = getUserData()

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true)
      const params: any = {
        page: currentPage,
        size: itemsPerPage,
        sortDirection: 'DESC'
      }

      if (searchTerm.trim()) {
        if (searchCategory === 'name') params.name = searchTerm
        else if (searchCategory === 'surname') params.surname = searchTerm
        else if (searchCategory === 'phone') params.phone = searchTerm
        else if (searchCategory === 'id') params.memberCode = searchTerm
        else if (searchCategory === 'nationalId') params.nationalId = searchTerm
        else params.name = searchTerm
      }

      if (statusFilter !== 'all') params.status = statusFilter
      
      const res = await membersAPI.getAll(params)
      const data = res.data?.data || res.data

      if (data && data.content) {
        setMembers(data.content)
        setTotalPages(data.totalPages || 0)
        setTotalElements(data.totalElements || 0)
      } else if (Array.isArray(data)) {
        setMembers(data)
        setTotalElements(data.length)
        setTotalPages(Math.ceil(data.length / itemsPerPage))
      } else {
        setMembers([])
        setTotalElements(0)
        setTotalPages(0)
      }
    } catch (error) {
      console.error("Fetch members error:", error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, searchCategory, statusFilter, itemsPerPage])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const handleLogout = () => {
    clearAuthData()
    navigate('/login')
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(0)
    fetchMembers()
  }

  const handlePrintList = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>SALEM SACCOS - REPORT</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
            body { font-family: 'Outfit', sans-serif; padding: 40px; color: #1e293b; }
            .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 4px solid #1e3b8b; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 32px; font-weight: 900; color: #1e3b8b; margin: 0; }
            .meta { text-align: right; font-size: 10px; color: #64748b; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
            th { background: #1e3b8b; color: white; padding: 12px; text-align: left; text-transform: uppercase; }
            td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
            .badge { padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 9px; }
            .badge-active { background: #dcfce7; color: #166534; }
            .footer { margin-top: 50px; display: flex; justify-content: space-around; font-size: 11px; border-top: 1px solid #e2e8f0; padding-top: 40px; }
            .sig { border-top: 1px solid #64748b; width: 180px; text-align: center; padding-top: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div><h1 class="logo">SALEM SACCOS</h1><div style="color:#f4ac37; font-weight:900; font-size:12px">STAFF ADMINISTRATIVE REPORT</div></div>
            <div class="meta">DATE: ${new Date().toLocaleDateString()}<br>BY: ${userData?.firstName || 'Admin'}</div>
          </div>
          <table h>
            <thead>
              <tr>
                <th>CODE</th><th>FULL NAME</th><th>PHONE</th><th>REGION</th><th>STATUS</th><th>DATE</th>
              </tr>
            </thead>
            <tbody>
              ${members.map(m => `
                <tr>
                  <td>${m.memberCode}</td>
                  <td>${m.firstName} ${m.lastName}</td>
                  <td>${m.contactInfo?.mobileNumber || 'N/A'}</td>
                  <td>${m.addressInfo?.region || 'N/A'}</td>
                  <td>${m.status}</td>
                  <td>${new Date(m.membershipDate).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <div class="sig">PREPARED BY</div>
            <div class="sig">STORE KEEPER / AUDITOR</div>
            <div class="sig">OFFICE STAMP</div>
          </div>
        </body>
      </html>
    `
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500)
  }

  const getRegions = () => ["Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Dire Dawa", "Gambela", "Harari", "Oromia", "Sidama", "SNNPR", "South West", "Tigray"]

  if (loading && members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-900 border-t-accent rounded-full animate-spin shadow-xl mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Synchronizing Records...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 animate-in fade-in duration-1000">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 min-h-[70vh] flex flex-col">
        {/* Top Header */}
        <div className="relative p-8 lg:p-12 overflow-hidden bg-blue-900">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full -mr-64 -mt-64 blur-[120px] animate-pulse"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <Shield className="w-3 h-3 mr-2 text-accent" />
                Administrative Access - {userData?.role || 'Staff'}
              </div>
              <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tighter mb-4">
                {t('registered_members') || 'Members Registry'}
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-accent flex items-center justify-center text-blue-900 text-2xl font-black shadow-lg">
                  {userData?.firstName?.charAt(0) || 'S'}
                </div>
                <div>
                  <p className="text-white/60 text-xs font-black uppercase tracking-wider mb-0.5">Connected as</p>
                  <p className="text-white font-bold text-lg">{userData?.firstName || 'Administrator'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <form onSubmit={handleSearchSubmit} className="relative group flex-1 sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5 group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  placeholder={t('search_placeholder') || 'Search everything...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-accent outline-none text-white font-bold placeholder:text-white/20 transition-all shadow-inner"
                />
              </form>
              <button 
                onClick={handleLogout}
                className="px-6 py-5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl border-2 border-red-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-8 border-b bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Search By</label>
              <div className="relative">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full appearance-none px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-blue-900 outline-none font-bold text-slate-700 shadow-sm"
                >
                  <option value="all">Everything</option>
                  <option value="name">First Name</option>
                  <option value="surname">Last Name</option>
                  <option value="phone">Phone</option>
                  <option value="id">Member ID</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-blue-900 outline-none font-bold text-slate-700 shadow-sm"
                >
                  <option value="all">All Members</option>
                  <option value="ACTIVE">Active Users</option>
                  <option value="PENDING">Awaiting Approval</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div className="space-y-2 text-center flex flex-col justify-center">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Quick Summary</p>
               <div className="flex items-center justify-center gap-4 mt-2">
                  <span className="text-blue-900 font-black text-2xl">{totalElements} <span className="text-[10px] text-slate-400 ml-1">RECORDS</span></span>
                  <div className="h-4 w-[2px] bg-slate-100"></div>
                  <span className="text-accent font-black text-2xl">{totalPages} <span className="text-[10px] text-slate-400 ml-1">PAGES</span></span>
               </div>
            </div>

            <div className="flex flex-col justify-end">
              <button
                onClick={handlePrintList}
                className="flex items-center justify-center h-[62px] px-8 bg-blue-900 text-white rounded-2xl hover:bg-black transition-all font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-900/20 active:scale-95 group"
              >
                <Printer className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Profile</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Location</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Occupation</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((m) => (
                <tr key={m.id} className="group hover:bg-slate-50 transition-all">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-blue-900 font-black text-xl overflow-hidden shadow-inner ring-4 ring-white group-hover:ring-blue-100 transition-all">
                        {m.profilePhotoUrl ? <img src={`https://api.v1.temp.salemsaccos.com${m.profilePhotoUrl}`} className="w-full h-full object-cover" /> : m.firstName?.charAt(0)}
                      </div>
                      <div className="ml-5">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight mb-0.5">{m.firstName} {m.lastName}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-mono font-bold text-slate-400 p-1 bg-slate-100 rounded leading-none">{m.memberCode}</span>
                           <span className="text-[10px] font-bold text-blue-900/40 uppercase">{m.contactInfo?.mobileNumber}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center text-sm font-bold text-slate-600">
                      <MapPin size={16} className="mr-2 text-slate-300" />
                      <div>
                        <p className="mb-0.5">{m.addressInfo?.city || 'Addis Ababa'}</p>
                        <p className="text-[10px] text-slate-400 uppercase">{m.addressInfo?.region || 'Ethiopia'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-slate-600">
                     <div className="flex items-center">
                        <Briefcase size={16} className="mr-2 text-slate-300" />
                        {m.educationEmploymentInfo?.occupation || 'N/A'}
                     </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${m.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-center">
                    <button 
                      onClick={() => setSelectedMember(m)}
                      className="p-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-blue-900 hover:border-blue-900 transition-all shadow-sm group/btn"
                    >
                      <ExternalLink size={20} className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {members.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-32 opacity-30">
              <FileText size={80} className="text-slate-200 mb-6" />
              <p className="text-xl font-black uppercase tracking-widest text-slate-400">Database Empty</p>
            </div>
          )}
        </div>

        {/* Footer / Pagination */}
        <div className="p-8 border-t bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-xs font-black text-slate-300 uppercase tracking-widest">
               Page {currentPage + 1} of {totalPages || 1}
            </div>
            <div className="flex items-center gap-3">
              <button 
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-3 bg-slate-50 rounded-2xl text-slate-400 disabled:opacity-20 hover:bg-blue-900 hover:text-white transition-all shadow-sm"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`h-12 w-12 rounded-2xl text-xs font-black transition-all ${currentPage === i ? 'bg-blue-900 text-white shadow-xl shadow-blue-900/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {i+1}
                  </button>
                ))}
              </div>
              <button 
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-3 bg-slate-50 rounded-2xl text-slate-400 disabled:opacity-20 hover:bg-blue-900 hover:text-white transition-all shadow-sm"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedMember && <MemberDetailModal member={selectedMember} onClose={() => setSelectedMember(null)} t={t} />}
    </div>
  )
}

export default MembersList
