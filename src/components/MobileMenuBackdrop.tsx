// components/MobileMenuBackdrop.tsx
import React from 'react'

interface MobileMenuBackdropProps {
  isOpen: boolean
  onClick: () => void
}

const MobileMenuBackdrop: React.FC<MobileMenuBackdropProps> = ({ isOpen, onClick }) => {
  if (!isOpen) return null
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
      onClick={onClick}
      aria-hidden="true"
    />
  )
}

export default MobileMenuBackdrop