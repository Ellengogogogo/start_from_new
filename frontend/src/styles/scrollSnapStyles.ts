// 滚动捕捉相关样式
export const scrollSnapStyles = `
  /* 全屏滚动样式 */
  .slides-container {
    scroll-behavior: smooth;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  
  .slides-container::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  /* 滚动捕捉样式 */
  .snap-start {
    scroll-snap-align: start;
  }
  
  .snap-y {
    scroll-snap-type: y mandatory;
  }
  
  /* 滚动容器基础样式 */
  .slides-container {
    overflow-y: auto;
    height: 100vh;
  }
  
  /* 平滑滚动动画 */
  .slides-container {
    scroll-behavior: smooth;
  }
  
  /* 滚动指示器样式 */
  .scroll-indicator {
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 50;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .scroll-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba(156, 163, 175, 0.4);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .scroll-dot.active {
    background-color: rgb(156, 163, 175);
    transform: scale(1.2);
  }
  
  .scroll-dot:hover {
    background-color: rgba(156, 163, 175, 0.7);
  }
`;
