import React, { useState, useEffect, useRef } from 'react';

interface ScrollStatusProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
  showIndicator?: boolean;
}

export const ScrollStatus: React.FC<ScrollStatusProps> = ({
  children,
  className = '',
  orientation = 'vertical',
  showIndicator = true
}) => {
  const [scrollInfo, setScrollInfo] = useState({
    isScrollable: false,
    scrollPosition: 0,
    maxScroll: 0,
    scrollPercentage: 0
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScrollInfo = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth } = scrollRef.current;
        
        if (orientation === 'vertical') {
          const maxScroll = scrollHeight - clientHeight;
          const isScrollable = maxScroll > 0;
          const scrollPercentage = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
          
          setScrollInfo({
            isScrollable,
            scrollPosition: scrollTop,
            maxScroll,
            scrollPercentage
          });
        } else {
          const { clientWidth } = scrollRef.current;
          const maxScroll = scrollWidth - clientWidth;
          const isScrollable = maxScroll > 0;
          const scrollPercentage = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
          
          setScrollInfo({
            isScrollable,
            scrollPosition: scrollLeft,
            maxScroll,
            scrollPercentage
          });
        }
      }
    };

    const element = scrollRef.current;
    if (element) {
      updateScrollInfo();
      element.addEventListener('scroll', updateScrollInfo);
      
      // 监听窗口大小变化
      const resizeObserver = new ResizeObserver(updateScrollInfo);
      resizeObserver.observe(element);
      
      return () => {
        element.removeEventListener('scroll', updateScrollInfo);
        resizeObserver.disconnect();
      };
    }
  }, [orientation]);

  return (
    <div className={`relative ${className}`}>
      <div ref={scrollRef} className="h-full w-full">
        {children}
      </div>
      
      {/* 滚动状态指示器 */}
      {showIndicator && (
        <div className="absolute bottom-2 right-2 z-20">
          <div className={`
            flex items-center gap-1 px-2 py-1 rounded-pixel
            font-pixel-body text-xs
            ${scrollInfo.isScrollable 
              ? 'bg-green-dark bg-opacity-80 text-white' 
              : 'bg-gray-dark bg-opacity-60 text-gray-light'
            }
          `}>
            <div className={`
              w-2 h-2 rounded-pixel
              ${scrollInfo.isScrollable ? 'bg-green' : 'bg-gray'}
            `} />
            <span>
              {scrollInfo.isScrollable 
                ? `${Math.round(scrollInfo.scrollPercentage)}%` 
                : '无滚动'
              }
            </span>
          </div>
        </div>
      )}
      
      {/* 滚动进度条 */}
      {scrollInfo.isScrollable && (
        <div className="absolute top-0 right-0 w-1 h-full bg-brown-ultra-dark opacity-50">
          <div 
            className="w-full bg-green transition-all duration-150 ease-out"
            style={{ 
              height: `${scrollInfo.scrollPercentage}%`,
              transform: 'translateY(0)'
            }}
          />
        </div>
      )}
    </div>
  );
};