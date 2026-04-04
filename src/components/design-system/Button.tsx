import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation',
  {
    variants: {
      variant: {
        theme: 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 text-white',
        themeOutline: 'border border-amber-500 bg-transparent hover:bg-amber-600 active:bg-amber-700 text-white',
        themeGhost: 'hover:bg-amber-600 active:bg-amber-700 text-white',
        accent: 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700 text-white',
        accentOutline: 'border border-green-500 bg-transparent hover:bg-green-600 active:bg-green-700 text-white',
        accentGhost: 'hover:bg-green-600 active:bg-green-700 text-white',
        default: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 text-white',
        secondary: 'bg-gray-700 text-white hover:bg-gray-800 active:bg-gray-900 text-white',
        outline: 'border border-gray-600 bg-transparent hover:bg-gray-800 active:bg-gray-900 text-white',
        ghost: 'hover:bg-gray-800 active:bg-gray-900 text-white',
        destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 text-white',
      },
      size: {
        default: 'h-10 sm:h-10 px-4 py-2 min-h-[44px] sm:min-h-[40px]',
        sm: 'h-9 px-3 text-xs min-h-[36px]',
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
