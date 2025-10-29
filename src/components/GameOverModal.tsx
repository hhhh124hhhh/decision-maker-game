import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GameState, calculateUtility } from '../types/game';
import { useGameAnalytics } from '../contexts/GameAnalyticsContext';

interface GameOverModalProps {
  gameState: GameState;
  onRestart: () => void;
  onBackToMenu: () => void;
  onGameOver?: () => void;
  isVisible: boolean;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  gameState,
  onRestart,
  onBackToMenu,
  onGameOver,
  isVisible
}) => {
  const navigate = useNavigate();
  const { gameAnalyses } = useGameAnalytics();
  const utility = calculateUtility(gameState.player);
  
  // 获取最新的游戏分析ID
  const latestAnalysisId = Array.from(gameAnalyses.keys()).pop();
  
  const getResultTitle = () => {
    switch (gameState.winner) {
      case 'player':
        return '胜利！';
      case 'ai':
        return '失败！';
      case 'draw':
        return '平局！';
      default:
        return '游戏结束';
    }
  };

  const getResultColor = () => {
    switch (gameState.winner) {
      case 'player':
        return 'text-gold';
      case 'ai':
        return 'text-red';
      case 'draw':
        return 'text-orange';
      default:
        return 'text-white';
    }
  };

  const getPlayerPattern = () => {
    if (!latestAnalysisId || !gameAnalyses.has(latestAnalysisId)) {
      // 如果没有分析数据，使用简化逻辑
      const gameHistory = gameState?.gameHistory || [];
      if (gameHistory.length === 0) return '未知';
      
      const strategies = gameHistory.map(r => r.playerStrategy) || [];
      const strategyCounts = strategies.reduce((acc, strategy) => {
        acc[strategy] = (acc[strategy] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mostUsed = Object.entries(strategyCounts).sort(([,a], [,b]) => b - a)[0];
      if (!mostUsed) return '未知';
      
      const [strategy, count] = mostUsed;
      const percentage = (count / strategies.length) * 100;
      
      if (percentage > 60) {
        switch (strategy) {
          case 'A1': return '保守稳健型';
          case 'A2': return '激进扩张型';
          case 'A3': return '创新研发型';
          case 'A4': return '团队激励型';
          case 'A5': return '市场公关型';
          default: return '平衡发展型';
        }
      }
      
      return '平衡发展型';
    }
    
    // 使用详细的分析结果
    const analysis = gameAnalyses.get(latestAnalysisId)!;
    if (analysis.strategyPatterns.length === 0) return '平衡发展型';
    
    // 获取使用频率最高的策略模式
    const dominantPattern = analysis.strategyPatterns.sort((a, b) => b.frequency - a.frequency)[0];
    
    // 根据策略模式类型返回对应的中文描述
    const patternDescriptions: Record<string, string> = {
      'conservative': '保守稳健型',
      'aggressive': '激进扩张型', 
      'innovative': '创新研发型',
      'motivational': '团队激励型',
      'public_relations': '市场公关型',
      'adaptive': '灵活适应型',
      'analytical': '理性分析型',
      'opportunistic': '机会主义型'
    };
    
    return patternDescriptions[dominantPattern.type] || '平衡发展型';
  };

  const getRecommendations = () => {
    const recommendations = [
      '《思考，快与慢》',
      '《创新者的窘境》',
      '《增长黑客》',
      '《从0到1》',
      '《精益创业》'
    ];
    
    // 根据玩家模式推荐不同的书籍
    const pattern = getPlayerPattern();
    
    if (pattern.includes('保守') || pattern.includes('稳健')) {
      return [recommendations[0], recommendations[3]];
    } else if (pattern.includes('创新') || pattern.includes('研发')) {
      return [recommendations[1], recommendations[4]];
    } else if (pattern.includes('激进') || pattern.includes('扩张')) {
      return [recommendations[2], recommendations[4]];
    } else if (pattern.includes('适应') || pattern.includes('分析')) {
      return [recommendations[0], recommendations[1], recommendations[4]];
    } else if (pattern.includes('机会')) {
      return [recommendations[2], recommendations[3]];
    } else if (pattern.includes('团队') || pattern.includes('激励')) {
      return [recommendations[0], recommendations[4]];
    } else if (pattern.includes('市场') || pattern.includes('公关')) {
      return [recommendations[2], recommendations[3]];
    } else {
      return recommendations.slice(0, 3);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-2 md:p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-brown-light border-pixel-thick border-gold w-full max-w-lg md:max-w-2xl my-2 md:my-8 p-3 md:p-8 max-h-[95vh] overflow-y-auto"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.4, ease: "steps(16)" }}
          >
            {/* 结果标题 */}
            <div className="text-center mb-6 md:mb-8">
              <motion.h1
                className={`font-pixel-display text-xl sm:text-2xl md:text-4xl ${getResultColor()} mb-3 md:mb-4 leading-tight`}
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {getResultTitle()}
              </motion.h1>
              <motion.div
                className="font-pixel-body text-sm sm:text-base md:text-lg text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                最终得分：{Math.round(utility)}
              </motion.div>
            </div>

            {/* 最终状态 */}
            <motion.div
              className="bg-brown-dark border-pixel-thin border-gold p-4 md:p-6 mb-6"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="font-pixel-display text-base md:text-lg text-gold mb-3 md:mb-4">
                最终状态
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-pixel-body text-white">资本:</span>
                  <span className="font-pixel-body text-gold font-bold">{gameState.player.capital}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-pixel-body text-white">声誉:</span>
                  <span className="font-pixel-body text-blue font-bold">{gameState.player.reputation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-pixel-body text-white">创新:</span>
                  <span className="font-pixel-body text-green font-bold">{gameState.player.innovation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-pixel-body text-white">士气:</span>
                  <span className="font-pixel-body text-orange font-bold">{gameState.player.morale}</span>
                </div>
              </div>
            </motion.div>

            {/* 思维模式分析 */}
            <motion.div
              className="bg-brown-dark border-pixel-thin border-gold p-4 md:p-6 mb-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="font-pixel-display text-base md:text-lg text-gold mb-3 md:mb-4">
                思维模式分析
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                  <span className="font-pixel-body text-white">决策风格:</span>
                  <span className="font-pixel-body text-orange font-bold">{getPlayerPattern()}</span>
                </div>
                
                {/* 显示策略使用详情 */}
                {latestAnalysisId && gameAnalyses.has(latestAnalysisId) && (
                  <div className="bg-brown-light p-3 border-pixel-thin border-brown rounded">
                    <div className="font-pixel-body text-sm text-white mb-2">策略使用详情:</div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {(() => {
                        const analysis = gameAnalyses.get(latestAnalysisId)!;
                        if (analysis.strategyPatterns.length > 0) {
                          return analysis.strategyPatterns.slice(0, 3).map((pattern, index) => (
                            <div key={index} className="flex justify-between text-xs">
                              <span className="text-gray-light">{pattern.description}:</span>
                              <span className="text-blue">{pattern.frequency}次 ({pattern.frequencyPercentage}%)</span>
                            </div>
                          ));
                        } else {
                          // 如果没有详细分析，显示简化统计
                          const gameHistory = gameState?.gameHistory || [];
                          const strategies = gameHistory.map(r => r.playerStrategy) || [];
                          const strategyCounts = strategies.reduce((acc, strategy) => {
                            acc[strategy] = (acc[strategy] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>);
                          
                          return Object.entries(strategyCounts).map(([strategy, count]) => {
                            const strategyNames: Record<string, string> = {
                              'A1': '稳健理财', 'A2': '市场扩张', 'A3': '技术转化', 
                              'A4': '团队激励', 'A5': '品牌营销'
                            };
                            return (
                              <div key={strategy} className="flex justify-between text-xs">
                                <span className="text-gray-light">{strategyNames[strategy]}:</span>
                                <span className="text-blue">{count}次 ({Math.round((count / strategies.length) * 100)}%)</span>
                              </div>
                            );
                          });
                        }
                      })()}
                      
                      {/* 添加说明文字 */}
                      <div className="text-xs text-gray-light mt-2 pt-2 border-t border-gray-600">
                        💡 思维模式分析显示您的决策倾向，这些模式可能重叠出现
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="font-pixel-body text-xs md:text-sm text-gray-light">
                  基于{gameState?.gameHistory?.length || 0}回合的决策记录分析
                </div>
              </div>
            </motion.div>

            {/* 推荐阅读 */}
            <motion.div
              className="bg-brown-dark border-pixel-thin border-gold p-4 md:p-6 mb-6 md:mb-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <h3 className="font-pixel-display text-base md:text-lg text-gold mb-3 md:mb-4">
                推荐阅读
              </h3>
              <div className="space-y-2">
                {getRecommendations().map((book, index) => (
                  <motion.div
                    key={index}
                    className="font-pixel-body text-white text-sm"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    • {book}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 操作按钮 */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <motion.button
                onClick={() => {
                  onGameOver?.();
                  onRestart();
                }}
                className="
                  px-4 md:px-8 py-3 bg-gold text-brown-dark font-pixel-display text-xs md:text-sm
                  border-pixel-thick border-gold-dark hover:bg-gold-light
                  transition-all duration-150 ease-steps(8)
                "
                style={{ boxShadow: '4px 4px 0px #D4A017' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                再来一局
              </motion.button>
              
              {latestAnalysisId && (
                <motion.button
                  onClick={() => {
                    onGameOver?.();
                    navigate(`/analysis/${latestAnalysisId}`);
                  }}
                  className="
                    px-4 md:px-6 py-3 bg-blue text-white font-pixel-display text-xs md:text-sm
                    border-pixel-thick border-blue-dark hover:bg-blue-light
                    transition-all duration-150 ease-steps(8)
                  "
                  style={{ boxShadow: '4px 4px 0px #1E3A8A' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 }}
                >
                  查看策略分析
                </motion.button>
              )}
              
              <motion.button
                onClick={() => {
                  onGameOver?.();
                  onRestart();
                }}
                className="
                  px-4 md:px-6 py-3 bg-orange text-white font-pixel-display text-xs md:text-sm
                  border-pixel-thick border-orange-dark hover:bg-orange-light
                  transition-all duration-150 ease-steps(8)
                "
                style={{ boxShadow: '4px 4px 0px #CC6600' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                重新开始
              </motion.button>
              
              <motion.button
                onClick={() => {
                  onGameOver?.();
                  onBackToMenu();
                }}
                className="
                  px-4 md:px-6 py-3 bg-gray-dark text-white font-pixel-display text-xs md:text-sm
                  border-pixel-thick border-gray hover:bg-gray
                  transition-all duration-150 ease-steps(8)
                "
                style={{ boxShadow: '4px 4px 0px #333333' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                返回主菜单
              </motion.button>
            </motion.div>

            {/* 3D边框效果 - 仅在桌面端显示 */}
            <div className="hidden md:block absolute top-0 left-0 w-full h-1 bg-white opacity-30" />
            <div className="hidden md:block absolute top-0 left-0 w-1 h-full bg-white opacity-30" />
            <div className="hidden md:block absolute bottom-0 right-0 w-full h-1 bg-brown-dark opacity-80" />
            <div className="hidden md:block absolute bottom-0 right-0 w-1 h-full bg-brown-dark opacity-80" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
