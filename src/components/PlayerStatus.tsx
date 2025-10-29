import React from 'react';
import { motion } from 'framer-motion';
import { PlayerStats, calculateAbility } from '../types/game';
import { ProgressBar } from './ProgressBar';
import { SimpleScrollable } from './SimpleScrollable';

interface PlayerStatusProps {
  stats: PlayerStats;
  className?: string;
}

export const PlayerStatus: React.FC<PlayerStatusProps> = ({ stats, className = '' }) => {
  const ability = calculateAbility(stats);
  
  const statItems = [
    {
      label: '资本',
      key: 'capital' as const,
      value: stats.capital,
      maxValue: 200,  // 统一为200
      color: '#B8860B',  // 更饱和的暗金色
      icon: '💰'
    },
    {
      label: '声誉',
      key: 'reputation' as const,
      value: stats.reputation,
      maxValue: 200,  // 统一为200
      color: '#1E3A8A',  // 更饱和的深蓝色
      icon: '🏆'
    },
    {
      label: '创新',
      key: 'innovation' as const,
      value: stats.innovation,
      maxValue: 200,  // 统一为200
      color: '#228B22',  // 更饱和的深绿色
      icon: '💡'
    },
    {
      label: '士气',
      key: 'morale' as const,
      value: stats.morale,
      maxValue: 200,  // 统一为200
      color: '#CC6600',  // 更饱和的深橙色
      icon: '😊'
    }
  ];

  return (
    <div className={`
      w-120 h-104 bg-brown-medium border-pixel-thick border-gold-dark shadow-pixel-md p-4
      relative overflow-hidden
      ${className}
    `}>
      {/* 面板标题 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">👤</span>
        <h2 className="font-pixel-display text-base text-white">
          玩家状态
        </h2>
      </div>
      
      {/* 综合实力显示 - 重点突出 */}
      <div className="mb-4 p-3 bg-gradient-to-r from-gold-dark to-gold rounded border-pixel-thin border-gold-bright">
        <div className="flex items-center justify-between">
          <span className="font-pixel-display text-sm text-black font-bold">
            🎯 综合实力
          </span>
          <span className="font-pixel-display text-lg text-black font-bold">
            {Math.round(ability)}
          </span>
        </div>
      </div>
      
      {/* 状态进度条 - 添加滚动条 */}
      <SimpleScrollable orientation="vertical" className="h-88">
        <div className="space-y-3">
          {statItems.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <ProgressBar
                label={`${item.icon} ${item.label}`}
                value={item.value}
                maxValue={item.maxValue}
                color={item.color}
              />
            </motion.div>
          ))}
        </div>
      </SimpleScrollable>
      
      {/* 3D边框效果 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-20" />
      <div className="absolute top-0 left-0 w-1 h-full bg-white opacity-20" />
      <div className="absolute bottom-0 right-0 w-full h-1 bg-brown-dark opacity-80" />
      <div className="absolute bottom-0 right-0 w-1 h-full bg-brown-dark opacity-80" />
    </div>
  );
};
