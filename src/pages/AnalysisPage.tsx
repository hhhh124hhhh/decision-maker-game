import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameAnalytics } from '../contexts/GameAnalyticsContext';
import { GameAnalysis } from '../types/analytics';

export const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();
  const { getAnalysis } = useGameAnalytics();
  
  const analysis = gameId ? getAnalysis(gameId) : null;

  if (!analysis) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-pixel-display text-3xl text-red-400 mb-4">
            分析数据不存在
          </h1>
          <p className="font-pixel-body text-white mb-6">
            无法找到游戏分析数据，请返回游戏页面重新开始。
          </p>
          <motion.button
            onClick={() => navigate('/')}
            className="
              px-6 py-3 bg-brown-light text-white 
              font-pixel-display text-sm border-pixel-thin border-brown-dark
              hover:bg-orange transition-all duration-150
            "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            返回主菜单
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const getWinnerText = (winner: string) => {
    switch (winner) {
      case 'player': return { text: '玩家胜利', color: 'text-green-400' };
      case 'ai': return { text: 'AI胜利', color: 'text-red-400' };
      default: return { text: '平局', color: 'text-gold' };
    }
  };

  const winnerInfo = getWinnerText(analysis.winner);

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-pixel-display text-4xl text-gold mb-2">
            游戏策略分析报告
          </h1>
          <p className="font-pixel-body text-gray-light">
            游戏ID: {analysis.gameId}
          </p>
        </motion.div>

        {/* 返回按钮 */}
        <motion.button
          onClick={() => navigate('/')}
          className="
            mb-6 px-4 py-2 bg-brown-light text-white 
            font-pixel-display text-sm border-pixel-thin border-brown-dark
            hover:bg-orange transition-all duration-150
          "
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← 返回主菜单
        </motion.button>

        {/* 游戏概览 */}
        <motion.div
          className="bg-brown-dark border-pixel-thick border-gold p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="font-pixel-display text-2xl text-gold mb-4">游戏概览</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-brown-light p-4 border-pixel-thin border-brown">
              <h3 className="font-pixel-body text-white mb-2">游戏结果</h3>
              <p className={`font-pixel-display text-xl ${winnerInfo.color}`}>
                {winnerInfo.text}
              </p>
            </div>
            <div className="bg-brown-light p-4 border-pixel-thin border-brown">
              <h3 className="font-pixel-body text-white mb-2">实际回合数</h3>
              <p className="font-pixel-display text-xl text-white">
                {analysis.totalRounds} 回合
              </p>
              <p className="font-pixel-body text-xs text-gray-light mt-1">
                (游戏设计最多5回合，可能提前结束)
              </p>
            </div>
            <div className="bg-brown-light p-4 border-pixel-thin border-brown">
              <h3 className="font-pixel-body text-white mb-2">最终评分</h3>
              <p className="font-pixel-display text-xl text-gold">
                {Math.round(0.4 * analysis.finalPlayerStats.capital + 
                           0.3 * analysis.finalPlayerStats.reputation + 
                           0.2 * analysis.finalPlayerStats.innovation + 
                           0.1 * analysis.finalPlayerStats.morale)}
              </p>
            </div>
          </div>
          
          {/* 游戏结束原因说明 */}
          {analysis.totalRounds < 5 && (
            <motion.div
              className="mt-4 p-3 bg-blue-dark border-pixel-thin border-blue rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="font-pixel-body text-blue text-sm mb-1">游戏提前结束说明</h4>
              <p className="font-pixel-body text-xs text-blue-light">
                本局游戏在第{analysis.totalRounds}回合提前结束，可能原因：
                <br />• 某项属性达到优秀水平(≥180分)
                <br />• 综合能力与AI差距过大(≥60分)
                <br />• 这是正常现象，说明你的策略非常有效！
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* 策略模式分析 */}
        <motion.div
          className="bg-brown-dark border-pixel-thick border-blue p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-pixel-display text-2xl text-blue mb-4">策略模式分析</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.strategyPatterns.map((pattern, index) => (
              <motion.div
                key={pattern.type}
                className="bg-brown-light p-4 border-pixel-thin border-blue"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{pattern.icon}</span>
                  <h3 className="font-pixel-body text-white">{pattern.description}</h3>
                </div>
                <p className="font-pixel-display text-sm text-gray-light mb-2">
                  使用频率: {pattern.frequency} 次
                </p>
                <div className="w-full bg-gray-dark h-2 rounded">
                  <motion.div
                    className="h-2 bg-blue rounded"
                    initial={{ width: 0 }}
                    animate={{ width: `${pattern.effectiveness}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  />
                </div>
                <p className="font-pixel-display text-xs text-blue mt-1">
                  效果评分: {Math.round(pattern.effectiveness)}/100
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI决策解释 */}
        <motion.div
          className="bg-brown-dark border-pixel-thick border-green p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="font-pixel-display text-2xl text-green mb-4">AI决策解释</h2>
          <div className="space-y-3">
            {analysis.aiDecisionExplanation.map((explanation, index) => (
              <motion.div
                key={index}
                className="bg-brown-light p-3 border-pixel-thin border-green"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <p className="font-pixel-body text-white">{explanation}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 胜负原因分析 */}
        <motion.div
          className="bg-brown-dark border-pixel-thick border-purple p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="font-pixel-display text-2xl text-purple mb-4">胜负原因分析</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-pixel-body text-white mb-3">关键因素</h3>
              <div className="space-y-2">
                {analysis.gameOutcomeAnalysis.keyFactors.map((factor, index) => (
                  <motion.div
                    key={index}
                    className="bg-brown-light p-2 border-pixel-thin border-purple"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <span className="font-pixel-body text-white">• {factor}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-pixel-body text-white mb-3">结果原因</h3>
              <motion.div
                className="bg-brown-light p-3 border-pixel-thin border-purple"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className="font-pixel-body text-white">
                  {analysis.gameOutcomeAnalysis.outcomeReason}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 玩家表现分析 */}
        <motion.div
          className="bg-brown-dark border-pixel-thick border-orange p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="font-pixel-display text-2xl text-orange mb-4">玩家表现分析</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-pixel-body text-green mb-3">优势方面</h3>
              <div className="space-y-2">
                {analysis.gameOutcomeAnalysis.playerStrengths.length > 0 ? 
                  analysis.gameOutcomeAnalysis.playerStrengths.map((strength, index) => (
                    <motion.div
                      key={index}
                      className="bg-brown-light p-2 border-pixel-thin border-green"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <span className="font-pixel-body text-white">✓ {strength}</span>
                    </motion.div>
                  )) :
                  <p className="font-pixel-body text-gray-light">暂无明显优势</p>
                }
              </div>
            </div>
            <div>
              <h3 className="font-pixel-body text-red-400 mb-3">待改进方面</h3>
              <div className="space-y-2">
                {analysis.gameOutcomeAnalysis.playerWeaknesses.length > 0 ? 
                  analysis.gameOutcomeAnalysis.playerWeaknesses.map((weakness, index) => (
                    <motion.div
                      key={index}
                      className="bg-brown-light p-2 border-pixel-thin border-red-400"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <span className="font-pixel-body text-white">⚠ {weakness}</span>
                    </motion.div>
                  )) :
                  <p className="font-pixel-body text-gray-light">表现均衡，无明显短板</p>
                }
              </div>
            </div>
          </div>
        </motion.div>

        {/* 策略建议 */}
        <motion.div
          className="bg-brown-dark border-pixel-thick border-gold p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="font-pixel-display text-2xl text-gold mb-4">策略建议</h2>
          <motion.div
            className="bg-brown-light p-4 border-pixel-thin border-gold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="font-pixel-body text-white mb-2">总体建议</h3>
            <p className="font-pixel-body text-white">{analysis.recommendations.overall}</p>
          </motion.div>
          
          <div className="space-y-3">
            {analysis.recommendations.specific.map((rec, index) => (
              <motion.div
                key={index}
                className="bg-brown-light p-4 border-pixel-thin border-gold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <h4 className="font-pixel-body text-gold mb-2">{rec.situation}</h4>
                <p className="font-pixel-body text-white mb-2">{rec.suggestion}</p>
                <p className="font-pixel-display text-sm text-gray-light">{rec.reasoning}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 重新开始按钮 */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            onClick={() => navigate('/game')}
            className="
              px-8 py-4 bg-gold text-black 
              font-pixel-display text-lg border-pixel-thick border-yellow-600
              hover:bg-yellow-400 transition-all duration-150
            "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            开始新游戏
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};