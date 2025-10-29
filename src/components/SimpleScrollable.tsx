import React, { useRef, useEffect } from 'react';

interface SimpleScrollableProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}

export const SimpleScrollable: React.FC<SimpleScrollableProps> = ({
  children,
  className = '',
  orientation = 'vertical'
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      // 确保元素可以滚动
      element.style.overflow = orientation === 'vertical' ? 'auto' : 'auto';
    }
  }, [orientation]);

  return (
    <div 
      ref={scrollRef} 
      className={`${className} custom-scrollbar overflow-y-auto overflow-x-hidden`}
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'thin',
        scrollbarColor: '#D4AF37 #8B4513'
      }}
    >
      {children}
    </div>
  );
};