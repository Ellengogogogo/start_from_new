import React from 'react';
import { TextBlockData } from '@/types/layout';

interface TextBlockProps extends TextBlockData {
  className?: string;
  variant?: 'default' | 'overlay' | 'minimal';
}

export const TextBlock: React.FC<TextBlockProps> = ({
  title,
  description,
  className = '',
  variant = 'minimal'
}) => {
  const baseClasses = 'transition-all duration-200';
  
  const variantClasses = {
    default: 'text-stone-800',
    overlay: 'text-white',
    minimal: 'text-stone-700'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={classes}>
      {title && (
        <h3 className="text-lg font-semibold mb-3 text-inherit">
          {title}
        </h3>
      )}
      <p className="text-base leading-relaxed text-inherit">
        {description}
      </p>
    </div>
  );
};
