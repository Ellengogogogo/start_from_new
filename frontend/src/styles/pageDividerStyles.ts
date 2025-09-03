// 页面分割线样式
export const pageDividerStyles = {
  // 渐变分割线样式
  gradient: {
    thin: 'h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent opacity-60',
    medium: 'h-0.5 bg-gradient-to-r from-transparent via-stone-300 to-transparent opacity-70',
    thick: 'h-1 bg-gradient-to-r from-transparent via-stone-300 to-transparent opacity-80'
  },
  
  // 阴影分割线样式
  shadow: {
    subtle: 'shadow-[0_-1px_3px_rgba(0,0,0,0.05)]',
    medium: 'shadow-[0_-2px_6px_rgba(0,0,0,0.1)]',
    strong: 'shadow-[0_-3px_9px_rgba(0,0,0,0.15)]'
  },
  
  // 边框分割线样式
  border: {
    light: 'border-b border-stone-200/40',
    medium: 'border-b border-stone-300/60',
    dark: 'border-b border-stone-400/80'
  },
  
  // 装饰性分割线样式
  decorative: {
    dots: 'flex items-center space-x-2',
    dotsContent: 'w-1.5 h-1.5 bg-stone-300 rounded-full',
    line: 'h-px w-16 bg-stone-300 rounded-full',
    accent: 'w-2 h-2 bg-stone-400 rounded-full'
  }
};

// 页面分割线组件样式
export const pageDividerComponentStyles = `
  /* 页面分割线基础样式 */
  .page-divider {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: none;
  }
  
  /* 渐变分割线 */
  .page-divider-gradient {
    background: linear-gradient(to right, transparent, rgb(212 212 212), transparent);
    opacity: 0.6;
  }
  
  /* 阴影分割线 */
  .page-divider-shadow {
    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
  }
  
  /* 边框分割线 */
  .page-divider-border {
    border-bottom: 1px solid rgba(212, 212, 212, 0.6);
  }
  
  /* 装饰性分割线 */
  .page-divider-decorative {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 0;
  }
  
  .page-divider-decorative::before,
  .page-divider-decorative::after {
    content: '';
    height: 1px;
    background: linear-gradient(to right, transparent, rgb(212, 212, 212), transparent);
    flex: 1;
    max-width: 60px;
  }
  
  .page-divider-decorative .divider-dot {
    width: 4px;
    height: 4px;
    background-color: rgb(212, 212, 212);
    border-radius: 50%;
  }
`;
