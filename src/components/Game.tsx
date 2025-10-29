import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { useSoundContext } from './SoundProvider';
import { STRATEGIES } from '../types/game';
import { GameHeader } from './GameHeader';
import { PlayerStatus } from './PlayerStatus';
import { AIStatus } from './AIStatus';
import { UtilityComparison } from './UtilityComparison';
import { StrategyZone } from './StrategyZone';
import { GameLog } from './GameLog';
import { GameOverModal } from './GameOverModal';

export const Game: React.FC = () => {
  const { gameState, selectStrategy, resetGame, isProcessing } = useGameState();
  const { playButtonClick } = useSoundContext();

  const handleBackToMenu = () => {
    playButtonClick();
    // 简单的返回处理，可以根据需要扩展
    console.log('返回主菜单');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* 游戏主容器 */}
      <motion.div
        className="relative w-[1200px] h-[800px] bg-brown-dark border-pixel-thick border-gold overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* 游戏标题栏 */}
        <GameHeader
          round={gameState.round}
          maxRounds={gameState.maxRounds}
          className="absolute top-0 left-0 right-0"
        />

        {/* 主游戏区域 */}
        <div className="absolute top-20 left-0 right-0 bottom-0 flex flex-col">
          {/* 状态面板区域 */}
          <div className="h-64 flex p-4 gap-4">
            {/* 玩家状态面板 */}
            <PlayerStatus
              stats={gameState.player}
              className="flex-shrink-0"
            />

            {/* 综合实力对比 */}
            <div className="flex-1 flex items-center justify-center">
              <UtilityComparison
                playerStats={gameState.player}
                aiStats={gameState.ai.stats}
                className="w-full max-w-lg"
              />
            </div>

            {/* AI状态面板 */}
            <AIStatus
              lastStrategy={gameState.ai.lastStrategy}
              threatLevel={gameState.ai.threatLevel}
              thinking={gameState.ai.thinking}
              className="flex-shrink-0"
            />
          </div>

          {/* 策略选择区 */}
          <StrategyZone
            strategies={STRATEGIES}
            onStrategySelect={selectStrategy}
            disabled={gameState.isGameOver || isProcessing}
            className="mx-4 mb-2"
          />

          {/* 游戏日志区 */}
          <div className="mx-4 mb-4 flex-1">
            <GameLog
              logs={gameState.logs}
              className="h-full"
            />
          </div>
        </div>

        {/* 回合切换覆盖层 */}
        <AnimatePresence>
          {!gameState.isGameOver && gameState.round > 1 && (
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
                transition={{ duration: 0.5, ease: "easeInOut" }}
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
          onRestart={resetGame}
          onBackToMenu={handleBackToMenu}
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
