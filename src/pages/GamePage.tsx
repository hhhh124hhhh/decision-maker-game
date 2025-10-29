import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { useGameSettings } from '../contexts/GameContext';
import { STRATEGIES } from '../types/game';
import { GameHeader } from '../components/GameHeader';
import { PlayerStatus } from '../components/PlayerStatus';
import { AIStatus } from '../components/AIStatus';
import { StrategyZone } from '../components/StrategyZone';
// import { GameLog } from '../components/GameLog'; // 已移除，游戏日志移到控制台
import { GameOverModal } from '../components/GameOverModal';
import { ScenarioIntro } from '../components/ScenarioIntro';
// import { GameInstructions } from '../components/GameInstructions'; // 已移除，使用主菜单的游戏说明

export const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useGameSettings();
  const { gameState, selectStrategy, resetGame, isProcessing } = useGameState();
  const [showScenario, setShowScenario] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [showRoundTransition, setShowRoundTransition] = useState(false);
  // const [showInstructions, setShowInstructions] = useState(false); // 已移除，使用主菜单的游戏说明

  // 监听回合变化，显示过渡动画
  useEffect(() => {
    if (gameState.round > 1 && !gameState.isGameOver) {
      setShowRoundTransition(true);
      const timer = setTimeout(() => {
        setShowRoundTransition(false);
      }, 2500); // 2.5秒后自动隐藏
      return () => clearTimeout(timer);
    }
  }, [gameState.round, gameState.isGameOver]);

  const handleStartGame = () => {
    setShowScenario(false);
    setGameStarted(true);
  };

  const handleSkipScenario = () => {
    setShowScenario(false);
    setGameStarted(true);
  };

  const handleGameOver = () => {
    // 更新游戏统计
    const newGamesPlayed = settings.gamesPlayed + 1;
    const currentUtility = 0.4 * gameState.player.capital + 
                          0.3 * gameState.player.reputation + 
                          0.2 * gameState.player.innovation + 
                          0.1 * gameState.player.morale;
    
    const newBestScore = Math.max(settings.bestScore, currentUtility);
    
    // 修正胜率计算逻辑
    const currentWins = settings.winRate * settings.gamesPlayed;
    const totalWins = gameState.winner === 'player' ? currentWins + 1 : currentWins;
    const newWinRate = totalWins / newGamesPlayed;

    const newSettings = {
      gamesPlayed: newGamesPlayed,
      bestScore: newBestScore,
      winRate: newWinRate
    };

    updateSettings(newSettings);
    
    // 立即保存到localStorage，确保数据不丢失
    try {
      const savedSettings = localStorage.getItem('decision-maker-settings');
      const currentSettings = savedSettings ? JSON.parse(savedSettings) : {};
      const updatedSettings = { ...currentSettings, ...newSettings };
      localStorage.setItem('decision-maker-settings', JSON.stringify(updatedSettings));
      console.log('游戏统计已更新:', newSettings);
    } catch (error) {
      console.error('保存游戏统计失败:', error);
    }
  };

  const handleRestart = () => {
    resetGame();
    setGameStarted(false);
    setShowScenario(true);
  };

  const handleBackToMenu = () => {
    navigate('/');
  };

  // 显示情景导入
  if (showScenario) {
    return (
      <ScenarioIntro 
        onStart={handleStartGame}
        onSkip={handleSkipScenario}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* 游戏主容器 */}
      <motion.div
        className="relative w-[1200px] h-[800px] bg-brown-ultra-dark border-pixel-thick border-gold-bright overflow-hidden game-container gpu-accelerated"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: gameState.ai.thinking ? [0, -1, 1, -1, 1, 0] : 0,  // AI思考时轻微晃动
        }}
        transition={{ 
          opacity: { duration: 0.5 },
          scale: { duration: 0.5 },
          x: { duration: 0.3, repeat: gameState.ai.thinking ? Infinity : 0 }
        }}
      >
        {/* 左侧按钮组 */}
        <div className="absolute top-4 left-4 z-50 flex gap-2">
          {/* 返回按钮 */}
          <motion.button
            onClick={handleBackToMenu}
            className="
              px-4 py-2 bg-brown-light text-white 
              font-pixel-display text-xs border-pixel-thin border-brown-dark
              hover:bg-orange transition-all duration-150 ease-steps(8)
            "
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← 主菜单
          </motion.button>

          {/* 游戏说明按钮 */}
          <motion.button
            onClick={() => navigate('/instructions')}
            className="
              px-4 py-2 bg-blue text-white 
              font-pixel-display text-xs border-pixel-thin border-blue-dark
              hover:bg-blue-light transition-all duration-150 ease-steps(8)
            "
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📖 说明
          </motion.button>
        </div>

        {/* 游戏标题栏 - 居中显示 */}
        <div className="absolute top-6 left-0 right-0 z-10 px-4">  {/* 从top-4改为top-6，下移8px */}
          <motion.h1
            className="font-pixel-display text-lg text-gold-bright text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            《决策者：思维的博弈》
          </motion.h1>
          
          {/* 进度分割线 */}
          <motion.div 
            className="w-32 h-1 bg-gold-bright mx-auto mt-3 mb-2"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          
          <motion.div
            className="flex items-center justify-center gap-4 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="font-pixel-display text-sm text-white">
              回合: {gameState.round}/{gameState.maxRounds}
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: gameState.maxRounds }, (_, i) => {
                const isCompleted = i < gameState.round - 1;
                const isCurrent = i === gameState.round - 1;
                const isFuture = i >= gameState.round;
                return (
                  <motion.span
                    key={i}
                    className={`
                      inline-block w-3 h-3
                      ${isCompleted ? 'bg-gold' : ''}
                      ${isCurrent ? 'bg-orange animate-pulse-pixel' : ''}
                      ${isFuture ? 'bg-gray-light border border-gray' : ''}
                    `}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* 主游戏区域 - 重新设计布局：状态面板在中间，策略选择在底部 */}
        <div className="absolute top-24 left-0 right-0 bottom-0 flex flex-col overflow-hidden">
          {/* 顶部留白区域 */}
          <div className="flex-1 flex flex-col justify-center items-center p-4">
            {/* 状态面板区域 - 占据中间主要空间 */}
            <div className="flex justify-center items-center relative z-content">
              <div className="flex gap-8 items-center relative z-10">
                {/* 玩家状态面板 */}
                <PlayerStatus
                  stats={gameState.player}
                  className="flex-shrink-0 status-panel"
                />

                {/* 中央分割线 */}
                <div className="w-px h-88 bg-gold-dark opacity-50 shadow-pixel-sm"></div>

                {/* AI状态面板 - 略宽 */}
                <AIStatus
                  lastStrategy={gameState.ai.lastStrategy}
                  threatLevel={gameState.ai.threatLevel}
                  thinking={gameState.ai.thinking}
                  stats={gameState.ai.stats}
                  className="flex-shrink-0 w-140 status-panel"  /* 560px宽度 vs 玩家480px */
                />
              </div>
            </div>
          </div>

          {/* 底部策略选择区 - 固定在底部 */}
          <div className="p-4 relative z-buttons bg-brown-ultra-dark border-t-pixel-thin border-gold-dark">
            <StrategyZone
              strategies={STRATEGIES}
              onStrategySelect={selectStrategy}
              disabled={gameState.isGameOver || isProcessing}
              className="strategy-zone-container"
            />
          </div>
        </div>

        {/* 回合切换覆盖层 */}
        <AnimatePresence>
          {showRoundTransition && (
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="text-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.5, ease: "steps(16)" }}
              >
                <h2 className="font-pixel-display text-6xl text-gold mb-4">
                  回合 {gameState.round}
                </h2>
                <motion.div
                  className="w-32 h-1 bg-gold mx-auto"
                  initial={{ width: 0 }}
                  animate={{ width: 128 }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
                <motion.p
                  className="font-pixel-body text-white mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  准备开始新的决策...
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 处理中覆盖层 */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <motion.div
                  className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="font-pixel-display text-gold">
                  AI正在思考中...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 游戏结束弹窗 */}
        <GameOverModal
          gameState={gameState}
          onRestart={handleRestart}
          onBackToMenu={handleBackToMenu}
          onGameOver={handleGameOver}
          isVisible={gameState.isGameOver}
        />

        {/* 3D边框效果 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-20" />
        <div className="absolute top-0 left-0 w-1 h-full bg-white opacity-20" />
        <div className="absolute bottom-0 right-0 w-full h-1 bg-brown-dark opacity-80" />
        <div className="absolute bottom-0 right-0 w-1 h-full bg-brown-dark opacity-80" />
      </motion.div>
    </div>
  );
};
