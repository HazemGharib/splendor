import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-[background-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] touch-manipulation',
  {
    variants: {
      variant: {
        theme:
          'bg-gradient-to-b from-amber-500 to-amber-600 text-white shadow-md shadow-amber-900/40 hover:from-amber-400 hover:to-amber-600 active:from-amber-600 active:to-amber-700',
        themeOutline:
          'border border-amber-500/60 bg-transparent text-white hover:bg-amber-500/15 active:bg-amber-500/25',
        themeGhost: 'text-white hover:bg-amber-500/15 active:bg-amber-500/25',
        accent:
          'bg-gradient-to-b from-green-500 to-green-600 text-white shadow-md shadow-green-900/40 hover:from-green-400 hover:to-green-600 active:from-green-600 active:to-green-700',
        accentOutline:
          'border border-green-500/60 bg-transparent text-white hover:bg-green-500/15 active:bg-green-500/25',
        accentGhost: 'text-white hover:bg-green-500/15 active:bg-green-500/25',
        default:
          'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-md shadow-blue-900/40 hover:from-blue-400 hover:to-blue-600 active:from-blue-600 active:to-blue-700',
        secondary:
          'border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.12] active:bg-white/[0.16]',
        outline:
          'border border-white/15 bg-transparent text-white hover:bg-white/[0.08] active:bg-white/[0.12]',
        ghost: 'text-gray-300 hover:bg-white/[0.08] hover:text-white active:bg-white/[0.12]',
        destructive:
          'bg-gradient-to-b from-red-500 to-red-600 text-white shadow-md shadow-red-900/40 hover:from-red-400 hover:to-red-600 active:from-red-600 active:to-red-700',
      },
      size: {
        default: 'h-10 sm:h-10 px-4 py-2 min-h-[44px] sm:min-h-[40px]',
        sm: 'h-11 px-3 text-xs min-h-[44px] sm:h-9 sm:min-h-[36px]',
        lg: 'h-12 px-6 text-base min-h-[48px]',
        icon: 'h-10 w-10 min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
