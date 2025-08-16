'use client'

import { useState } from 'react'

interface InputFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  type?: 'currency' | 'percentage' | 'number' | 'years'
  min?: number
  max?: number
  step?: number
  placeholder?: string
  description?: string
}

export default function InputField({
  label,
  value,
  onChange,
  type = 'number',
  min = 0,
  max,
  step = 1,
  placeholder,
  description
}: InputFieldProps) {
  const [displayValue, setDisplayValue] = useState(value.toString())

  const formatValue = (val: number): string => {
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('ko-KR').format(val)
      case 'percentage':
        return val.toString()
      case 'years':
        return val.toString()
      default:
        return val.toString()
    }
  }

  const parseValue = (str: string): number => {
    // 콤마 제거 후 숫자 변환
    const cleaned = str.replace(/,/g, '')
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setDisplayValue(newValue)
    
    const parsedValue = parseValue(newValue)
    if (!isNaN(parsedValue)) {
      onChange(parsedValue)
    }
  }

  const handleBlur = () => {
    // 포커스가 벗어나면 포맷된 값으로 표시
    setDisplayValue(formatValue(value))
  }

  const handleFocus = () => {
    // 포커스 시 순수 숫자만 표시
    setDisplayValue(value.toString())
  }

  const getSuffix = () => {
    switch (type) {
      case 'currency':
        return '원'
      case 'percentage':
        return '%'
      case 'years':
        return '년'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors text-right pr-12"
        />
        {getSuffix() && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {getSuffix()}
            </span>
          </div>
        )}
      </div>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
          {description}
        </p>
      )}
    </div>
  )
}
