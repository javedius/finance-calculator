import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  required?: boolean
  className?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required = false, className = '', options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className={`label ${required ? 'label-required' : ''}`}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`select-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="error-message">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
