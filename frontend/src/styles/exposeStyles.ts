// Expose 通用样式
export const exposeStyles = `
  /* 打印样式 */
  @media print {
    .slide { 
      page-break-after: always; 
      margin: 0; 
      padding: 24px; 
    }
    .slide:last-child { 
      page-break-after: auto; 
    }
    .no-print { display: none !important; }
  }
  
  /* 幻灯片边界样式 */
  .slide {
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 2rem;
    position: relative;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    font-family: "Garamond", "Times New Roman", serif;
  }
  
  /* 全局字体设置 */
  .expose-ppt-container {
    font-family: "Garamond", "Times New Roman", serif;
  }
  
  .expose-ppt-container * {
    font-family: "Garamond", "Times New Roman", serif;
  }
  
  /* Footer 样式 */
  .slide-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    font-size: 14px;
    color: #6b7280;
    font-family: "Garamond", "Times New Roman", serif;
  }
  
  .footer-left {
    font-weight: 500;
    color: #374151;
    font-family: "Garamond", "Times New Roman", serif;
  }
  
  .footer-right {
    font-weight: 600;
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    padding: 4px 12px;
    border-radius: 12px;
    font-family: "Garamond", "Times New Roman", serif;
  }
  
  /* 页面容器样式 */
  .page-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  
  /* 页面内容样式 */
  .page-content {
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  /* 导航栏样式 */
  .expose-navigation {
    position: sticky;
    top: 0;
    z-index: 40;
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 1rem 1.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  
  /* 按钮样式 */
  .expose-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }
  
  .expose-button:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }
  
  .expose-button-primary {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
  
  .expose-button-primary:hover {
    background-color: #2563eb;
    border-color: #2563eb;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .expose-navigation {
      padding: 0.75rem 1rem;
    }
    
    .expose-button {
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
    }
  }
`;
