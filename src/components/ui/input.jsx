import { cn } from '@/lib/utils'

export const fieldClass =
  'w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/70 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30'

export function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      className={cn(fieldClass, 'h-9', className)}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        fieldClass,
        'min-h-20 resize-y py-2 leading-relaxed',
        className
      )}
      {...props}
    />
  )
}

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(fieldClass, 'h-9 bg-background pe-8', className)}
      {...props}
    >
      {children}
    </select>
  )
}
