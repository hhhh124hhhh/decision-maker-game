import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Strategy } from '../types/game';
import { useSoundContext } from './SoundProvider';

interface StrategyButtonProps {
  strategy: Strategy;
  onClick: (strategyId: string) => void;
  disabled?: boolean;
  isSelected?: boolean;
}

export const StrategyButton: React.FC<StrategyButtonProps> = ({
  strategy,
  onClick,
  disabled = false,
  isSelected = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { playButtonClick } = useSoundContext();

  const handleClick = () => {
    if (!disabled) {
      playButtonClick();
      onClick(strategy.id);
    }
  };

  return (
    <motion.button
      className={`
        relative w-40 h-24 bg-brown-light border-pixel-thick border-brown-dark
        font-pixel-display text-xs text-white text-center
        transition-all duration-150 ease-steps(8)
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isSelected ? 'border-gold-bright bg-orange-light shadow-pixel-lg' : ''}
        ${!disabled && !isSelected ? 'hover:bg-orange hover:border-gold-bright hover:shadow-pixel-lg' : ''}
        active:translate-x-1 active:translate-y-1 active:shadow-pixel-sm
      `}
      style={{
        boxShadow: isSelected 
          ? '6px 6px 0px #D4A017' 
          : !disabled 
            ? '4px 4px 0px #5C2E0A' 
            : '2px 2px 0px #5C2E0A'
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {/* 3D边框效果 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-40" />
      <div className="absolute top-0 left-0 w-1 h-full bg-white opacity-40" />
      <div className="absolute bottom-0 right-0 w-full h-1 bg-brown-dark opacity-80" />
      <div className="absolute bottom-0 right-0 w-1 h-full bg-brown-dark opacity-80" />
      
      {/* 内容 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-2">
        {/* 图标 */}
        <motion.div
          className="text-2xl mb-1"
          animate={isHovered ? { y: -2 } : { y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {strategy.icon}
        </motion.div>
        
        {/* 策略名称 */}
        <div className="font-pixel-display text-xs leading-tight">
          {strategy.name}
        </div>
        
        {/* 快捷键提示 */}
        <div className="font-pixel-body text-xs text-gray-light mt-1">
          (快捷键: {strategy.hotkey})
        </div>
      </div>
      
      {/* 选中状态指示器 */}
      {isSelected && (
        <motion.div
          className="absolute top-1 right-1 w-4 h-4 bg-gold-bright rounded-pixel border border-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="w-full h-full bg-gold-dark rounded-pixel"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
      )}
    </motion.button>
  );
};
