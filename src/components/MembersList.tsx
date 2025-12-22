"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
          <title>ሳሌም ሳኮስ - የአባላት ዝርዝር</title>
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
            <div class="logo">ሳሌም ሳኮስ</div>
            <div class="subtitle">የወንድሞች እና እህቶች ቁጠባና ብድር ኅብረት ስራ ማኅበር</div>
            <div class="subtitle">የአባላት ዝርዝር ዘገባ</div>
          </div>
          
          <div class="filters">
            <h3>የማጣሪያ መረጃ:</h3>
            <div class="filter-item"><strong>ክልል:</strong> ${regionFilter === "all" ? "ሁሉም" : regionFilter}</div>
            <div class="filter-item"><strong>የፍለጋ ምድብ:</strong> ${
              searchCategory === "all"
                ? "ሁሉም"
                : searchCategory === "name"
                  ? "ስም"
                  : searchCategory === "phone"
                    ? "ስልክ ቁጥር"
                    : searchCategory === "address"
                      ? "አድራሻ"
                      : searchCategory === "occupation"
                        ? "ስራ"
                        : searchCategory === "id"
                          ? "መታወቂያ"
                          : searchCategory
            }</div>
            <div class="filter-item"><strong>የፍለጋ ቃል:</strong> ${searchTerm || "ምንም"}</div>
            <div class="filter-item"><strong>ጠቅላላ ውጤቶች:</strong> ${filteredMembers.length} አባላት</div>
            <div class="filter-item"><strong>የህትመት ቀን:</strong> ${new Date().toLocaleDateString("am-ET")}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>ተ.ቁ</th>
                <th>ሙሉ ስም</th>
                <th>የአባት ስም</th>
                <th>የአያት ስም</th>
                <th>ጾታ</th>
                <th>ክልል</th>
                <th>ወረዳ</th>
                <th>ከተማ/ቀበሌ</th>
                <th>ስልክ ቁጥር</th>
                <th>ስራ</th>
                <th>የጋብቻ ሁኔታ</th>
                <th>የምዝገባ ቀን</th>
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
                  <td>${member.gender === "male" ? "ወንድ" : "ሴት"}</td>
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
            <p>ሳሌም ሳኮስ - የወንድሞች እና እህቶች ቁጠባና ብድር ኅብረት ስራ ማኅበር</p>
            <p>ስልክ: +251 910 4169 32 | ኢሜይል: info@salemsaccos.com</p>
            <p>አዲስ አበባ፣ ኢትዮጵያ</p>
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
          <h2 className="text-xl font-bold text-gray-900">የአባል ዝርዝር መረጃ</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">የግል መረጃ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">ሙሉ ስም:</span>
                <span className="ml-2">{member.full_name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">የአባት ስም:</span>
                <span className="ml-2">{member.father_name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">የአያት ስም:</span>
                <span className="ml-2">{member.grandfather_name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">ጾታ:</span>
                <span className="ml-2">{member.gender === "male" ? "ወንድ" : "ሴት"}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">የጋብቻ ሁኔታ:</span>
                <span className="ml-2">{member.marital_status}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">ስራ/ትምህርት:</span>
                <span className="ml-2">{member.occupation}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">የግ Hannah መረጃ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">ክልል:</span>
                <span className="ml-2">{member.region}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">ወረዳ:</span>
                <span className="ml-2">{member.woreda}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">ከተማ/ቀበሌ:</span>
                <span className="ml-2">{member.city_kebele}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">ስልክ ቁጥር:</span>
                <span className="ml-2">{member.phone_number}</span>
              </div>
              {member.referrer_phone && (
                <div>
                  <span className="font-medium text-gray-700">የመሳቢያ ስልክ:</span>
                  <span className="ml-2">{member.referrer_phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* ID Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">የመታወቂያ መረጃ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">የፋይዳ መታወቂያ FCN:</span>
                <span className="ml-2">{member.id_fcn}</span>
              </div>
            </div>
          </div>

          {/* Digital Signature */}
          {member.digital_signature_url && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">ዲጂታል ፊርማ</h3>
              <img
                src={member.digital_signature_url || "/placeholder.svg"}
                alt="Digital Signature"
                className="max-w-xs border border-gray-300 rounded"
              />
            </div>
          )}

          {/* Registration Date */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">የምዝገባ ቀን</h3>
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
                የተመዘገቡ አባላት
              </h1>
              <p className="text-gray-600 mt-1">
                ጠቅላላ {filteredMembers.length} አባላት ተመዝግበዋል
                {filteredMembers.length !== members.length && ` (ከ ${members.length} ውስጥ)`}
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="ስም፣ ስልክ ቁጥር ወይም አድራሻ ይፈልጉ..."
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
                በክልል ማጣሪያ
              </label>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">ሁሉም ክልሎች</option>
                {getUniqueRegions().map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">የፍለጋ ምድብ</label>
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">ሁሉም</option>
                <option value="name">ስም</option>
                <option value="phone">ስልክ ቁጥር</option>
                <option value="address">አድራሻ</option>
                <option value="occupation">ስራ</option>
                <option value="id">መታወቂያ</option>
              </select>
            </div>

            {/* Print Button */}
            <div className="flex items-end">
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full justify-center"
              >
                <Printer className="w-4 h-4 mr-2" />
                ህትመት
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ስም</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ስልክ ቁጥር
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">አድራሻ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ጾታ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ስራ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  የምዝገባ ቀን
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ተግባር</th>
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
                    {member.gender === "male" ? "ወንድ" : "ሴት"}
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
                      ዝርዝር ይመልከቱ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedMembers.length === 0 && filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{searchTerm ? "ምንም ውጤት አልተገኘም" : "ምንም አባላት እስካሁን አልተመዘገቡም"}</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredMembers.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                የ {(currentPage - 1) * itemsPerPage + 1} እስከ{" "}
                {Math.min(currentPage * itemsPerPage, filteredMembers.length)} ከ {filteredMembers.length} ውጤቶች
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  ቀዳሚ
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
                  ቀጣይ
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
