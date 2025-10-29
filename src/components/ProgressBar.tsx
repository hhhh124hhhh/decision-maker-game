import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  maxValue,
  color,
  className = ''
}) => {
  const percentage = Math.min(100, (value / maxValue) * 100);
  
  const getStatusColor = () => {
    if (percentage > 70) return 'text-green-400';
    if (percentage > 30) return 'text-orange-400';
    return 'text-red-400';
  };

  const getBarColor = () => {
    if (percentage > 70) return 'bg-green-400';
    if (percentage > 30) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* 标签行 */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="font-pixel-body text-xs text-white font-bold">
            {label}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-pixel-body text-xs text-white">
            {value}/{maxValue}
          </span>
          <span className={`font-pixel-body text-xs ${getStatusColor()}`}>
            [{Math.round(percentage)}%]
          </span>
        </div>
      </div>
      
      {/* 进度条容器 */}
      <div className="relative w-full h-5 bg-gray-dark border-pixel-thin border-brown-dark">
        {/* 进度条填充 */}
        <motion.div
          className={`h-full ${getBarColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 0.8, 
            ease: "steps(16)",
            type: "spring",
            stiffness: 100
          }}
          style={{ backgroundColor: color }}
        />
        
        {/* 3D边框效果 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-30" />
        <div className="absolute top-0 left-0 w-1 h-full bg-white opacity-30" />
        <div className="absolute bottom-0 right-0 w-full h-1 bg-brown-dark opacity-80" />
        <div className="absolute bottom-0 right-0 w-1 h-full bg-brown-dark opacity-80" />
      </div>
    </div>
  );
};
