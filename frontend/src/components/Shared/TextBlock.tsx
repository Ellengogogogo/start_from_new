import React from 'react';
import { TextBlockData } from '@/types/layout';

interface TextBlockProps extends TextBlockData {
  className?: string;
  variant?: 'default' | 'overlay' | 'card';
}

export const TextBlock: React.FC<TextBlockProps> = ({
  title,
  description,
  className = '',
  variant = 'default'
}) => {
  const baseClasses = 'p-4 rounded-lg transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border border-gray-200',
    overlay: 'bg-black/70 text-white backdrop-blur-sm',
    card: 'bg-white text-gray-800 shadow-lg border border-gray-100'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={classes}>
      {title && (
        <h3 className="text-lg font-semibold mb-2 text-inherit">
          {title}
        </h3>
      )}
      <p className="text-sm leading-relaxed text-inherit">
        {description}
      </p>
    </div>
  );
};
