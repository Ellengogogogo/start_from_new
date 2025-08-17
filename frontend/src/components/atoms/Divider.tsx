import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const dividerVariants = cva(
  // 基础样式
  'bg-gray-200',
  {
    variants: {
      orientation: {
        horizontal: 'h-px w-full',
        vertical: 'w-px h-full',
      },
      variant: {
        solid: 'bg-gray-200',
        dashed: 'bg-gradient-to-r from-gray-200 via-gray-200 to-gray-200 bg-[length:8px_1px] bg-repeat-x',
        dotted: 'bg-gradient-to-r from-gray-200 via-gray-200 to-gray-200 bg-[length:4px_1px] bg-repeat-x',
      },
      size: {
        thin: 'h-px',
        normal: 'h-0.5',
        thick: 'h-1',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      variant: 'solid',
      size: 'thin',
    },
  }
);

export interface DividerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dividerVariants> {
  children?: React.ReactNode;
  textAlign?: 'left' | 'center' | 'right';
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation, variant, size, children, textAlign = 'center', ...props }, ref) => {
    if (children) {
      // 带文本的分割线
      return (
        <div
          className={cn('flex items-center', className)}
          ref={ref}
          {...props}
        >
          <div
            className={cn(
              'flex-1',
              dividerVariants({ orientation: 'horizontal', variant, size })
            )}
          />
          <span className="px-3 text-sm text-gray-500 font-medium">
            {children}
          </span>
          <div
            className={cn(
              'flex-1',
              dividerVariants({ orientation: 'horizontal', variant, size })
            )}
          />
        </div>
      );
    }

    // 纯分割线
    return (
      <div
        className={cn(dividerVariants({ orientation, variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

export { Divider, dividerVariants };
