import React, { useRef, useState, useEffect } from 'react'
import { Pen, RotateCcw, Check } from 'lucide-react'

interface DigitalSignatureProps {
  onSignatureChange: (signature: string) => void
  value?: string
}

const DigitalSignature: React.FC<DigitalSignatureProps> = ({ onSignatureChange, value }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  useEffect(() => {
    if (value && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
          setHasSignature(true)
        }
        img.src = value
      }
    }
  }, [value])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      setIsDrawing(true)
    }
  }

  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      setIsDrawing(true)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.strokeStyle = '#1f2937'
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.strokeStyle = '#1f2937'
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    setHasSignature(true)
    saveSignature()
  }

  const stopDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    setIsDrawing(false)
    setHasSignature(true)
    saveSignature()
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
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setHasSignature(false)
        onSignatureChange('')
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Pen className="w-4 h-4 text-gray-600" />
        <label className="text-sm font-medium text-gray-700">
          የዲጂታል ፊርማ (Digital Signature) *
        </label>
      </div>
      
      <div className="border-2 border-dashed border-red-300 rounded-lg p-4 bg-red-50">
        <canvas
          ref={canvasRef}
          width={800}
          height={150}
          className="border border-gray-300 rounded bg-white cursor-crosshair w-full touch-none max-w-full"
          style={{ maxWidth: '100%', height: 'auto' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawingTouch}
          onTouchMove={drawTouch}
          onTouchEnd={stopDrawingTouch}
        />
        
        <div className="flex justify-between items-center mt-3">
{/*           <p className="text-xs text-gray-500">
            * ይህ መስክ ግዴታ ነው። የስልክዎ ስክሪን የማይሰራ ከሆነ ፎቶ አንስተው ማስገባት ይችላሉ።
          </p> */}
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearSignature}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              አጥፋ
            </button>
            
            {hasSignature && (
              <div className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded">
                <Check className="w-3 h-3" />
                ፊርማ ተደርጓል
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DigitalSignature
