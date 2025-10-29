import React from 'react';
import { motion } from 'framer-motion';
import { SimpleScrollable } from './SimpleScrollable';
import { PlayerStats, calculateAbility } from '../types/game';

interface AIStatusProps {
  lastStrategy: string | null;
  threatLevel: number;
  thinking: boolean;
  stats?: PlayerStats; // AI的状态数据
  className?: string;
}

export const AIStatus: React.FC<AIStatusProps> = ({
  lastStrategy,
  threatLevel,
  thinking,
  stats,
  className = ''
}) => {
  const aiAbility = stats ? calculateAbility(stats) : 0;
  
  const strategyNames: Record<string, string> = {
    'A1': '稳健理财',
    'A2': '市场扩张',
    'A3': '技术转化',
    'A4': '团队激励',
    'A5': '品牌营销'
  };

  const getThreatDescription = (level: number) => {
    if (level <= 1) return '威胁度：很低';
    if (level <= 2) return '威胁度：较低';
    if (level <= 3) return '威胁度：中等';
    if (level <= 4) return '威胁度：较高';
    return '威胁度：很高';
  };

  const getAIStatusText = () => {
    if (thinking) return 'AI正在思考中...';
    if (lastStrategy) return `AI上回合选择了：${strategyNames[lastStrategy]}`;
    return '等待AI决策...';
  };

  const renderThreatIcon = (level: number) => {
    const icons = ['😴', '😐', '🤔', '😰', '😱'];
    return icons[Math.min(level - 1, 4)] || '😱';
  };

  return (
    <div className={`
      w-120 h-104 bg-brown-medium border-pixel-thick border-blue-dark shadow-pixel-md p-4
      relative overflow-hidden
      ${className}
    `}>
      {/* 面板标题 */}
      <div className="flex items-center gap-2 mb-4">
        <motion.span 
          className="text-xl"
          animate={{
            rotate: thinking ? 360 : 0,
            scale: [1, 0.9, 1, 1.1, 1],  // 眨眼动画
          }}
          transition={{ 
            rotate: { duration: 1, repeat: thinking ? Infinity : 0, ease: "linear" },
            scale: { duration: 0.5, repeat: Infinity, repeatDelay: 3 }
          }}
        >
          🤖
        </motion.span>
        <h2 className="font-pixel-display text-base text-blue">
          AI状态
        </h2>
        {/* AI思考时颜色闪烁 - 改进定位，防止超出容器 */}
        {thinking && (
          <motion.div
            className="absolute inset-0 bg-blue-light opacity-20 pointer-events-none"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
      
      {/* AI综合实力显示 - 重点突出 */}
      <div className="mb-4 p-3 bg-gradient-to-r from-blue-dark to-blue rounded border-pixel-thin border-blue-light">
        <div className="flex items-center justify-between">
          <span className="font-pixel-display text-sm text-white font-bold">
            🎯 AI综合实力
          </span>
          <span className="font-pixel-display text-lg text-white font-bold">
            {Math.round(aiAbility)}
          </span>
        </div>
      </div>
      
      {/* AI策略信息 - 添加滚动条 */}
      <SimpleScrollable orientation="vertical" className="h-88">
        <div className="space-y-3 relative z-10">
          {/* 当前状态 */}
          <motion.div
            className="bg-brown-dark border-pixel-thin border-blue p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="font-pixel-body text-sm text-white mb-2">
              当前状态
            </div>
            <div className="font-pixel-display text-xs text-blue break-words">
              {getAIStatusText()}
              {thinking && (
                <motion.span
                  className="ml-2"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ...
                </motion.span>
              )}
            </div>
          </motion.div>
          
          {/* 威胁度 */}
          <motion.div
            className="bg-brown-dark border-pixel-thin border-blue p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="font-pixel-body text-sm text-white mb-2">
              威胁度
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-light">
                {getThreatDescription(threatLevel)}
              </div>
              <motion.div 
                className="text-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {renderThreatIcon(threatLevel)}
              </motion.div>
            </div>
          </motion.div>
          
          {/* AI人格化信息 */}
          <motion.div
            className="bg-brown-dark border-pixel-thin border-blue p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <div className="font-pixel-body text-sm text-white mb-2">
              AI分析
            </div>
            <motion.div 
              className="font-pixel-display text-sm text-gold-light break-words"
              animate={thinking ? { opacity: [1, 0.7, 1] } : {}}
              transition={{ duration: 1, repeat: thinking ? Infinity : 0 }}
            >
              {thinking 
                ? 'AI正在评估局势...' 
                : lastStrategy 
                  ? 'AI对你的策略很关注' 
                  : 'AI准备开始分析...'
              }
            </motion.div>
          </motion.div>
        </div>
      </SimpleScrollable>
      
      {/* 3D边框效果 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-light opacity-30" />
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-light opacity-30" />
      <div className="absolute bottom-0 right-0 w-full h-1 bg-blue-dark opacity-80" />
      <div className="absolute bottom-0 right-0 w-1 h-full bg-blue-dark opacity-80" />
    </div>
  );
};
