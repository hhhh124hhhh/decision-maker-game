import React from 'react';
import { motion } from 'framer-motion';
import { Strategy, STRATEGIES } from '../types/game';
import { StrategyButton } from './StrategyButton';
import { useSoundContext } from './SoundProvider';

interface StrategyZoneProps {
  strategies: Strategy[];
  onStrategySelect: (strategyId: string) => void;
  disabled?: boolean;
  className?: string;
}

export const StrategyZone: React.FC<StrategyZoneProps> = ({
  strategies,
  onStrategySelect,
  disabled = false,
  className = ''
}) => {
  const { playStrategySelect } = useSoundContext();

  const handleStrategySelect = (strategyId: string) => {
    playStrategySelect();
    onStrategySelect(strategyId);
  };

  return (
    <div className={`
      w-full h-32 bg-brown-dark border-pixel-thick border-brown
      flex flex-col items-center justify-center p-4 relative
      overflow-hidden strategy-zone-container
      ${className}
    `}>
      {/* 区域标题 - 改进定位，避免重叠 */}
      <div className="absolute top-2 left-4 z-title">
        <span className="font-pixel-display text-sm text-white">
          选择你的策略
        </span>
      </div>
      
      {/* 策略按钮网格 */}
      <div className="flex gap-3 items-center strategy-buttons z-content">
        {strategies.map((strategy, index) => (
          <motion.div
            key={strategy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <StrategyButton
              strategy={strategy}
              onClick={handleStrategySelect}
              disabled={disabled}
            />
          </motion.div>
        ))}
      </div>
      
      {/* 快捷键提示 - 调整位置适应更小容器 */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 z-title">
        <motion.span 
          className="font-pixel-body text-xs text-gold-light bg-brown-ultra-dark px-2 py-1 border-pixel-thin border-gold-dark whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          数字键 1-5 快速选择
        </motion.span>
      </div>
      
      {/* 3D边框效果 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-20" />
      <div className="absolute top-0 left-0 w-1 h-full bg-white opacity-20" />
      <div className="absolute bottom-0 right-0 w-full h-1 bg-brown-dark opacity-80" />
      <div className="absolute bottom-0 right-0 w-1 h-full bg-brown-dark opacity-80" />
    </div>
  );
};
