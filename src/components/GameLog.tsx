import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogEntry } from '../types/game';

interface GameLogProps {
  logs: LogEntry[];
  className?: string;
}

export const GameLog: React.FC<GameLogProps> = ({ logs, className = '' }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新日志
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogColor = (type: LogEntry['type'], color?: string) => {
    if (color) return color;
    
    switch (type) {
      case 'system':
        return 'text-green-light';  // 更亮的绿色
      case 'player':
        return 'text-gold-bright';  // 亮金色
      case 'ai':
        return 'text-blue-light';   // 亮蓝色
      case 'result':
        return 'text-green';        // 标准绿色
      case 'comment':
        return 'text-green-light';  // 更亮的绿色
      case 'warning':
        return 'text-red-light';    // 亮红色
      default:
        return 'text-white';
    }
  };

  const getLogPrefix = (type: LogEntry['type']) => {
    switch (type) {
      case 'system':
        return '> ';
      case 'player':
        return '[玩家] ';
      case 'ai':
        return '[AI] ';
      case 'result':
        return '[结果] ';
      case 'comment':
        return '[点评] ';
      case 'warning':
        return '[警告] ';
      default:
        return '> ';
    }
  };

  return (
    <div className={`
      w-full h-full bg-brown-ultra-dark border-pixel-thick border-green
      font-pixel-body text-sm text-green-light
      overflow-y-auto overflow-x-hidden p-4 relative
      scrollbar-thin scrollbar-track-brown-ultra-dark scrollbar-thumb-green
      flex flex-col game-log-container
      ${className}
    `}>
      {/* 游戏日志标题 - 改进定位，防止重叠 */}
      <div className="pb-3 mb-4 relative flex-shrink-0 z-title">
        <span className="text-green font-pixel-display text-sm">
          游戏日志
        </span>
        <div className="absolute top-0 right-4">
          <span className="text-xs text-gray-light">
            回合 {logs.length > 0 ? logs[logs.length - 1].round : 1}
          </span>
        </div>
      </div>
      
      {/* 日志内容 - 添加明显滚动条功能 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 min-h-0 scroll-content custom-scrollbar-visible">
        <AnimatePresence>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex items-start group flex-shrink-0"
            >
              {/* 回合编号 */}
              <span className="text-xs text-gray-light mr-2 flex-shrink-0 font-pixel-body">
                [{log.round}]
              </span>
              
              {/* 日志类型前缀 */}
              <span className="text-green-light mr-2 flex-shrink-0">
                {getLogPrefix(log.type)}
              </span>
              
              {/* 日志内容 */}
              <span className={getLogColor(log.type, log.color)}>
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={logEndRef} />
      </div>
      

      
      {/* 3D边框效果 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-10" />
      <div className="absolute top-0 left-0 w-1 h-full bg-white opacity-10" />
      <div className="absolute bottom-0 right-0 w-full h-1 bg-green opacity-60" />
      <div className="absolute bottom-0 right-0 w-1 h-full bg-green opacity-60" />
    </div>
  );
};
