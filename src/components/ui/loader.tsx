import type React from 'react'
import { cn } from '@/lib/utils'

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'dots' | 'spinner'
}

export function Loader({ size = 'md', variant = 'default', className, ...props }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  }

  if (variant === 'dots') {
    return (
      <div
        role="status"
        aria-label="Cargando"
        className={cn('flex items-center justify-center space-x-2', className)}
        {...props}
      >
        <div
          className={cn(
            'animate-pulse rounded-full bg-primary',
            size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4'
          )}
        />
        <div
          className={cn(
            'animate-pulse rounded-full bg-primary animation-delay-200',
            size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4'
          )}
        />
        <div
          className={cn(
            'animate-pulse rounded-full bg-primary animation-delay-500',
            size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4'
          )}
        />
        <span className="sr-only">Cargando...</span>
      </div>
    )
  }

  if (variant === 'spinner') {
    return (
      <div
        role="status"
        aria-label="Cargando"
        className={cn('flex items-center justify-center', className)}
        {...props}
      >
        <svg
          className={cn(
            'animate-spin',
            size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-8 w-8' : 'h-12 w-12'
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="sr-only">Cargando...</span>
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-label="Cargando"
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-t-transparent border-primary',
          sizeClasses[size]
        )}
      />
      <span className="sr-only">Cargando...</span>
    </div>
  )
}
