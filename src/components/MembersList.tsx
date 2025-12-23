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
import { supabase, type Member } from "../lib/supabase"

const MembersList: React.FC = () => {
  const { t } = useTranslation()
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [paginatedMembers, setPaginatedMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchCategory, setSearchCategory] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    fetchMembers()
  }, [])

  useEffect(() => {
    filterMembers()
  }, [searchTerm, searchCategory, regionFilter, members])

  useEffect(() => {
    paginateMembers()
  }, [filteredMembers, currentPage])

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase.from("members").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setMembers(data || [])
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterMembers = () => {
    let filtered = members

    // Filter by region
    if (regionFilter !== "all") {
      filtered = filtered.filter((member) => member.region === regionFilter)
    }

    // Filter by search term and category
    if (searchTerm.trim()) {
      filtered = filtered.filter((member) => {
        const term = searchTerm.toLowerCase()

        switch (searchCategory) {
          case "name":
            return (
              member.full_name.toLowerCase().includes(term) ||
              member.father_name.toLowerCase().includes(term) ||
              member.grandfather_name.toLowerCase().includes(term)
            )
          case "phone":
            return member.phone_number.includes(term) || (member.referrer_phone && member.referrer_phone.includes(term))
          case "address":
            return (
              member.city_kebele.toLowerCase().includes(term) ||
              member.woreda.toLowerCase().includes(term) ||
              member.region.toLowerCase().includes(term)
            )
          case "occupation":
            return member.occupation.toLowerCase().includes(term)
          case "id":
            return member.id_fcn.includes(term)
          default: // 'all'
            return (
              member.full_name.toLowerCase().includes(term) ||
              member.father_name.toLowerCase().includes(term) ||
              member.grandfather_name.toLowerCase().includes(term) ||
              member.phone_number.includes(term) ||
              member.city_kebele.toLowerCase().includes(term) ||
              member.woreda.toLowerCase().includes(term) ||
              member.occupation.toLowerCase().includes(term) ||
              member.id_fcn.includes(term) ||
              (member.referrer_phone && member.referrer_phone.includes(term))
            )
        }
      })
    }

    setFilteredMembers(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const paginateMembers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedMembers(filteredMembers.slice(startIndex, endIndex))
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${t('saccos')} - ${t('members_list_report')}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #16a34a; padding-bottom: 20px; }
            .logo { color: #16a34a; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .subtitle { color: #666; font-size: 14px; }
            .filters { margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px; }
            .filters h3 { margin: 0 0 10px 0; font-size: 16px; }
            .filter-item { margin: 5px 0; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #16a34a; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">${t('saccos')}</div>
            <div class="subtitle">${t('saccos_desc')}</div>
            <div class="subtitle">${t('members_list_report')}</div>
          </div>
          
          <div class="filters">
            <h3>${t('filter_info')}:</h3>
            <div class="filter-item"><strong>${t('region')}:</strong> ${regionFilter === "all" ? t('all') : regionFilter}</div>
            <div class="filter-item"><strong>${t('search_category')}:</strong> ${
              searchCategory === "all"
                ? t('all')
                : searchCategory === "name"
                  ? t('name')
                  : searchCategory === "phone"
                    ? t('phone_number')
                    : searchCategory === "address"
                      ? t('address')
                      : searchCategory === "occupation"
                        ? t('occupation')
                        : searchCategory === "id"
                          ? t('id')
                          : searchCategory
            }</div>
            <div class="filter-item"><strong>${t('search_term')}:</strong> ${searchTerm || t('none')}</div>
            <div class="filter-item"><strong>${t('total_results')}:</strong> ${filteredMembers.length} ${t('members')}</div>
            <div class="filter-item"><strong>${t('print_date')}:</strong> ${new Date().toLocaleDateString("am-ET")}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>${t('serial_number')}</th>
                <th>${t('full_name')}</th>
                <th>${t('father_name')}</th>
                <th>${t('grandfather_name')}</th>
                <th>${t('gender')}</th>
                <th>${t('region')}</th>
                <th>${t('woreda')}</th>
                <th>${t('city_kebele')}</th>
                <th>${t('phone_number')}</th>
                <th>${t('occupation')}</th>
                <th>${t('marital_status')}</th>
                <th>${t('registration_date')}</th>
              </tr>
            </thead>
            <tbody>
              ${filteredMembers
                .map(
                  (member, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${member.full_name}</td>
                  <td>${member.father_name}</td>
                  <td>${member.grandfather_name}</td>
                  <td>${member.gender === "male" ? t('male') : t('female')}</td>
                  <td>${member.region}</td>
                  <td>${member.woreda}</td>
                  <td>${member.city_kebele}</td>
                  <td>${member.phone_number}</td>
                  <td>${member.occupation}</td>
                  <td>${member.marital_status}</td>
                  <td>${formatDate(member.created_at)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="footer">
            <p>${t('footer_saccos')}</p>
            <p>${t('footer_contact')}</p>
            <p>${t('addis_ababa_ethiopia')}</p>
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
    const regions = [...new Set(members.map((member) => member.region))]
    return regions.sort()
  }

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
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

  const MemberDetailModal = ({ member, onClose }: { member: Member; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{t('member_detail_info')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">{t('personal_info')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">{t('full_name')}:</span>
                <span className="ml-2">{member.full_name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">{t('father_name')}:</span>
                <span className="ml-2">{member.father_name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">{t('grandfather_name')}:</span>
                <span className="ml-2">{member.grandfather_name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">{t('gender')}:</span>
                <span className="ml-2">{member.gender === "male" ? t('male') : t('female')}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">{t('marital_status')}:</span>
                <span className="ml-2">{member.marital_status}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">{t('occupation_education')}:</span>
                <span className="ml-2">{member.occupation}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">{t('contact_info')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">{t('region')}:</span>
                <span className="ml-2">{member.region}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">{t('woreda')}:</span>
                <span className="ml-2">{member.woreda}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">{t('city_kebele')}:</span>
                <span className="ml-2">{member.city_kebele}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">{t('phone_number')}:</span>
                <span className="ml-2">{member.phone_number}</span>
              </div>
              {member.referrer_phone && (
                <div>
                  <span className="font-medium text-gray-700">{t('referrer_phone')}:</span>
                  <span className="ml-2">{member.referrer_phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* ID Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">{t('id_info')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">{t('id_fcn')}:</span>
                <span className="ml-2">{member.id_fcn}</span>
              </div>
            </div>
          </div>

          {/* Digital Signature */}
          {member.digital_signature_url && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">{t('digital_signature')}</h3>
              <img
                src={member.digital_signature_url || "/placeholder.svg"}
                alt="Digital Signature"
                className="max-w-xs border border-gray-300 rounded"
              />
            </div>
          )}

          {/* Registration Date */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">{t('registration_date')}</h3>
            <p className="text-sm text-gray-700">{formatDate(member.created_at)}</p>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Users className="w-6 h-6 mr-2" />
                {t('registered_members')}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('total')} {filteredMembers.length} {t('members')} {t('registered')}
                {filteredMembers.length !== members.length && ` (${t('from')} ${members.length} ${t('total')})`}
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full md:w-80"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                {t('region_filter')}
              </label>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('search_category')}</label>
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">{t('all')}</option>
                <option value="name">{t('name')}</option>
                <option value="phone">{t('phone_number')}</option>
                <option value="address">{t('address')}</option>
                <option value="occupation">{t('occupation')}</option>
                <option value="id">{t('id')}</option>
              </select>
            </div>

            {/* Print Button */}
            <div className="flex items-end">
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full justify-center"
              >
                <Printer className="w-4 h-4 mr-2" />
                {t('print')}
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('phone_number')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('address')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('gender')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('occupation')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('registration_date')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{member.full_name}</div>
                    <div className="text-sm text-gray-500">
                      {member.father_name} {member.grandfather_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="w-4 h-4 mr-1" />
                      {member.phone_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-4 h-4 mr-1" />
                      {member.city_kebele}, {member.woreda}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.gender === "male" ? t('male') : t('female')}
                  </td>
                  {/* Occupation Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.occupation}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(member.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {t('view_details')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedMembers.length === 0 && filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{searchTerm ? t('no_results') : t('no_members_yet')}</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredMembers.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {t('from_result', { from: (currentPage - 1) * itemsPerPage + 1, to: Math.min(currentPage * itemsPerPage, filteredMembers.length), total: filteredMembers.length })}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {t('previous')}
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current page
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg ${
                            page === currentPage
                              ? "bg-green-600 text-white"
                              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span key={page} className="px-2 py-2 text-sm text-gray-500">
                          ...
                        </span>
                      )
                    }
                    return null
                  })}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
