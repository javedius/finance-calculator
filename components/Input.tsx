import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  required?: boolean
  className?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required = false, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className={`label ${required ? 'label-required' : ''}`}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="error-message">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
