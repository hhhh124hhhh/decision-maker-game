import React from 'react';
import { PlayerStats, calculateUtility } from '../types/game';

interface UtilityComparisonProps {
  playerStats: PlayerStats;
  aiStats: PlayerStats;
  className?: string;
}

export const UtilityComparison: React.FC<UtilityComparisonProps> = ({
  playerStats,
  aiStats,
  className = ''
}) => {
  const playerUtility = calculateUtility(playerStats);
  const aiUtility = calculateUtility(aiStats);
  const utilityDiff = playerUtility - aiUtility;
  
  console.log('UtilityComparison render:', {
    playerStats,
    aiStats,
    playerUtility: Math.round(playerUtility),
    aiUtility: Math.round(aiUtility),
    utilityDiff: Math.round(utilityDiff)
  });

  return (
    <div className={`
      bg-yellow-500 border-4 border-red-500 
      p-3 text-black font-bold text-sm
      h-full max-h-[240px] flex flex-col justify-center items-center overflow-hidden
      ${className}
    `}>
      {/* 标题 */}
      <div className="text-center mb-2">
        <h3 className="text-lg mb-1">
          🔥 综合实力对比 🔥
        </h3>
        <div className="text-sm">
          实时评估双方竞争力
        </div>
      </div>

      {/* 数值对比 */}
      <div className="grid grid-cols-3 gap-4 mb-3 text-center">
        {/* 玩家 */}
        <div>
          <div className="text-2xl text-green-600 font-black mb-1">
            {Math.round(playerUtility)}
          </div>
          <div className="text-sm font-bold">
            👤 玩家
          </div>
        </div>

        {/* 领先/落后指示 */}
        <div className="flex flex-col justify-center">
          <div className={`text-lg font-black mb-2 ${
            utilityDiff > 0 ? 'text-green-600' : 
            utilityDiff < 0 ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {utilityDiff > 0 ? '📈 领先' : 
             utilityDiff < 0 ? '📉 落后' : '⚖️ 平局'}
          </div>
          
          <div className="text-sm font-bold">
            差距: {Math.abs(Math.round(utilityDiff))} 分
          </div>
        </div>

        {/* AI */}
        <div>
          <div className="text-2xl text-red-600 font-black mb-1">
            {Math.round(aiUtility)}
          </div>
          <div className="text-sm font-bold">
            🤖 AI
          </div>
        </div>
      </div>

      {/* 趋势指示 */}
      <div className="text-center">
        <div className="text-sm font-black">
          {utilityDiff > 10 ? '🏆 胜利在望' :
           utilityDiff > 0 ? '💪 保持优势' :
           utilityDiff > -10 ? '⚡ 仍有希望' :
           '😰 形势严峻'}
        </div>
      </div>

      {/* 调试信息 */}
      <div className="mt-2 text-xs bg-gray-200 p-1 rounded">
        <div>玩家: 资本{playerStats.capital} 声誉{playerStats.reputation} 创新{playerStats.innovation} 士气{playerStats.morale}</div>
        <div>AI: 资本{aiStats.capital} 声誉{aiStats.reputation} 创新{aiStats.innovation} 士气{aiStats.morale}</div>
      </div>
    </div>
  );
};
