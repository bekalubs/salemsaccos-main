import React, { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Pen, RotateCcw, Check, MousePointer2 } from 'lucide-react'

interface DigitalSignatureProps {
  onSignatureChange: (signature: string) => void
  value?: string
}

const DigitalSignature: React.FC<DigitalSignatureProps> = ({ onSignatureChange, value }) => {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const lastX = useRef(0)
  const lastY = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Initialize high DPI canvas
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      
      // Re-draw background
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, rect.width, rect.height)
      
      if (value) {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0, rect.width, rect.height)
          setHasSignature(true)
        }
        img.src = value
      }
    }

    setupCanvas()
    window.addEventListener('resize', setupCanvas)
    return () => window.removeEventListener('resize', setupCanvas)
  }, [value])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    let x, y
    if ('touches' in e) {
      if (e.touches.length > 1) return
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    lastX.current = x
    lastY.current = y
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    let x, y
    if ('touches' in e) {
      if (e.touches.length > 1) return
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    ctx.lineWidth = 2.5
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#1e3b8b'

    ctx.beginPath()
    ctx.moveTo(lastX.current, lastY.current)
    ctx.lineTo(x, y)
    ctx.stroke()

    lastX.current = x
    lastY.current = y
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      setHasSignature(true)
      saveSignature()
    }
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png')
      onSignatureChange(dataURL)
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const rect = canvas.getBoundingClientRect()
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, rect.width, rect.height)
        setHasSignature(false)
        onSignatureChange('')
      }
    }
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Pen className="w-4 h-4 text-primary" />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-900 leading-none">
            {t('digital_signature_label')}
          </label>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">
            Official E-Signature
          </p>
        </div>
      </div>
      
      <div className="group relative border-2 border-dashed border-primary/20 rounded-[1.5rem] p-5 bg-gray-50/50 hover:bg-white hover:border-primary/40 transition-all">
        <div className="relative bg-white rounded-xl shadow-inner overflow-hidden border border-gray-100">
           <canvas
            ref={canvasRef}
            className="cursor-crosshair w-full touch-none block"
            style={{ height: '200px' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={(e) => { e.preventDefault(); startDrawing(e); }}
            onTouchMove={(e) => { e.preventDefault(); draw(e); }}
            onTouchEnd={(e) => { e.preventDefault(); stopDrawing(); }}
          />
          {!hasSignature && !isDrawing && (
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
                <MousePointer2 size={40} className="text-primary mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest">{t('sign_here')}</span>
             </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
             <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
               {t('digital_signature_hint')}
             </p>
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearSignature}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-100 rounded-xl transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t('clear')}
            </button>
            
            {hasSignature && (
              <div className="flex items-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-green-50 text-green-600 rounded-xl border border-green-100 animate-fadeIn">
                <Check className="w-3.5 h-3.5" />
                {t('signature_saved')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DigitalSignature
