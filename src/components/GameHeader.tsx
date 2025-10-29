import React from 'react';
import { motion } from 'framer-motion';

interface GameHeaderProps {
  round: number;
  maxRounds: number;
  className?: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  round,
  maxRounds,
  className = ''
}) => {
  const renderRoundDots = () => {
    return Array.from({ length: maxRounds }, (_, i) => {
      const isCompleted = i < round - 1;
      const isCurrent = i === round - 1;
      const isFuture = i >= round;
      
      return (
        <motion.span
          key={i}
          className={`
            inline-block w-3 h-3 mx-1
            ${isCompleted ? 'bg-gold' : ''}
            ${isCurrent ? 'bg-orange animate-pulse-pixel' : ''}
            ${isFuture ? 'bg-gray-light border border-gray' : ''}
          `}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
        />
      );
    });
  };

  return (
    <div className={`
      w-full h-20 bg-gradient-to-r from-brown-dark to-brown
      border-pixel-thick border-gold flex items-center justify-between px-6
      ${className}
    `}>
      {/* 游戏标题 */}
      <motion.h1
        className="font-pixel-display text-lg text-gold flex-shrink-0 mr-4"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        《决策者：思维的博弈》
      </motion.h1>
      
      {/* 回合指示器 */}
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className="font-pixel-display text-sm text-white">
          回合: {round}/{maxRounds}
        </span>
        <div className="flex items-center">
          {renderRoundDots()}
        </div>
      </motion.div>
      
      {/* 顶部装饰线 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gold-light opacity-60" />
    </div>
  );
};
