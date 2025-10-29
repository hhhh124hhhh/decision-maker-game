import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  GameState, 
  LogEntry, 
  INITIAL_GAME_STATE, 
  createInitialGameState,
  STRATEGIES,
  applyStrategyEffects,
  checkRiskTrigger,
  determineWinner,
  calculateAbility
} from '../types/game';
import { useGameAnalytics } from '../contexts/GameAnalyticsContext';
import { useSoundContext } from '../components/SoundProvider';

// AI决策算法 - Minimax
function minimaxAI(
  playerStats: any, 
  aiStats: any, 
  depth: number, 
  isMaximizing: boolean,
  gameHistory: any[] = []
): { strategy: string; score: number } {
  const strategies = STRATEGIES.map(s => s.id);
  
  if (depth === 0) {
    // 评估当前局面
    const playerAbility = calculateAbility(playerStats);
    const aiAbility = calculateAbility(aiStats);
    return { strategy: '', score: aiAbility - playerAbility };
  }
  
  let bestScore = isMaximizing ? -Infinity : Infinity;
  let bestStrategy = strategies[0];
  
  for (const strategy of strategies) {
    const { newStats } = applyStrategyEffects(playerStats, [strategy]);
    const aiResult = minimaxAI(newStats, aiStats, depth - 1, !isMaximizing, gameHistory);
    
    if (isMaximizing) {
      if (aiResult.score > bestScore) {
        bestScore = aiResult.score;
        bestStrategy = strategy;
      }
    } else {
      if (aiResult.score < bestScore) {
        bestScore = aiResult.score;
        bestStrategy = strategy;
      }
    }
  }
  
  return { strategy: bestStrategy, score: bestScore };
}

// AI决策算法 - 增加随机性，降低预测准确率
function predictPlayerStrategy(gameHistory: any[]): string {
  const strategies = ['A1', 'A2', 'A3', 'A4', 'A5'];
  
  // 30%概率完全随机选择
  if (Math.random() < 0.3) {
    return strategies[Math.floor(Math.random() * strategies.length)];
  }
  
  // 确保 gameHistory 是数组且有内容
  if (!gameHistory || gameHistory.length === 0) {
    // 首次游戏，AI偏向保守
    const firstRoundStrategies = ['A1', 'A3', 'A4']; // 保守策略权重更高
    return firstRoundStrategies[Math.floor(Math.random() * firstRoundStrategies.length)];
  }
  
  const recentStrategies = gameHistory.slice(-2).map(r => r.playerStrategy); // 只看最近2轮
  const strategyCounts = recentStrategies.reduce((acc, strategy) => {
    acc[strategy] = (acc[strategy] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // 选择玩家最常用的策略类型
  const mostUsed = Object.entries(strategyCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0];
  if (!mostUsed) {
    // 如果没有明显偏好，随机选择
    return strategies[Math.floor(Math.random() * strategies.length)];
  }
  
  const [playerStrategy] = mostUsed;
  
  // AI选择策略 - 增加随机性
  const counterStrategy: Record<string, string[]> = {
    'A1': ['A2', 'A3', 'A4'], // 克制保守 -> 多种选择
    'A2': ['A4', 'A5', 'A1'], // 克制扩张 -> 多种选择
    'A3': ['A5', 'A1', 'A2'], // 克制创新 -> 多种选择
    'A4': ['A3', 'A5', 'A1'], // 克制团队 -> 多种选择
    'A5': ['A1', 'A2', 'A3']  // 克制公关 -> 多种选择
  };
  
  const aiOptions = counterStrategy[playerStrategy] || ['A1'];
  
  // 50%概率选择克制策略，50%概率随机选择
  if (Math.random() < 0.5) {
    return aiOptions[Math.floor(Math.random() * aiOptions.length)];
  } else {
    return strategies[Math.floor(Math.random() * strategies.length)];
  }
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastStrategySelection, setLastStrategySelection] = useState<number>(0);
  const { addStrategyData, finalizeGame, clearCurrentGame } = useGameAnalytics();
  const { playAIThinking, playRiskTrigger, playAttributeChange, playCombinationBonus, playRoundEnd, playGameWin, playGameLose, playGameDraw, playRoundStart } = useSoundContext();
  const previousRoundRef = useRef<number>(1);

  const addLog = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    
    // 将日志输出到控制台，而不是前端UI
    const logColors: Record<string, string> = {
      'system': '#FFD700', // 金色
      'player': '#00FF00', // 绿色
      'ai': '#0080FF', // 蓝色
      'result': '#FF8000', // 橙色
      'comment': '#8000FF', // 紫色
      'warning': '#FF0000' // 红色
    };
    
    const color = logColors[entry.type] || '#FFFFFF';
    console.log(`%c[回合${entry.round}] ${entry.message}`, `color: ${color}; font-weight: bold;`);
    
    // 仍然保存到状态中，但不再在UI中显示
    setGameState(prev => ({
      ...prev,
      logs: [...prev.logs, newLog].slice(-20) // 保持最近20条日志
    }));
  }, []);

  const selectStrategy = useCallback(async (strategyId: string) => {
    if (gameState.isGameOver || isProcessing) return;
    
    // 防重复点击 - 500ms内不允许重复选择
    const now = Date.now();
    if (now - lastStrategySelection < 500) {
      return;
    }
    setLastStrategySelection(now);
    
    setIsProcessing(true);
    
    try {
      // 1. 玩家选择策略
      // 更严格的防重复日志机制
      const strategyName = STRATEGIES.find(s => s.id === strategyId)?.name || '';
      const playerMessage = `你选择了 [${strategyId}] ${strategyName}`;
      
      // 检查是否已存在相同的玩家选择日志
      const existingPlayerLog = gameState.logs.find(log => 
        log.type === 'player' && 
        log.message === playerMessage &&
        log.round === gameState.round
      );
      
      if (!existingPlayerLog) {
        addLog({
          round: gameState.round,
          type: 'player',
          message: playerMessage
        });
      }
      
      // 2. AI决策
      const aiStrategy = predictPlayerStrategy(gameState?.gameHistory || []);
      
      addLog({
        round: gameState.round,
        type: 'ai',
        message: `AI选择了 [${aiStrategy}] ${STRATEGIES.find(s => s.id === aiStrategy)?.name}`
      });
      
      // 3. 模拟AI思考
      setGameState(prev => ({
        ...prev,
        ai: { ...prev.ai, thinking: true }
      }));
      
      // 播放AI思考音效
      playAIThinking();
      
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // 4. 应用策略效果
      const playerResult = applyStrategyEffects(gameState.player, [strategyId]);
      // AI效果应该基于AI的当前状态
      const aiResult = applyStrategyEffects(gameState.ai.stats, [aiStrategy]);
      
      // 5. 检查风险触发
      const newRiskLevel = gameState.riskLevel + playerResult.riskIncrease;
      const riskTriggered = checkRiskTrigger(newRiskLevel);
      
      let finalStats = playerResult.newStats;
      let riskMessage = '';
      
      if (riskTriggered) {
        // 播放风险触发音效
        playRiskTrigger();
        
        // 随机扣除属性
        const attributes = ['capital', 'reputation', 'innovation', 'morale'] as const;
        const randomAttr = attributes[Math.floor(Math.random() * attributes.length)];
        const penalty = Math.floor(Math.random() * 21) + 10; // 10-30
        
        finalStats[randomAttr] = Math.max(0, finalStats[randomAttr] - penalty);
        
        // 属性名中文映射
        const attrNames: Record<string, string> = {
          capital: '资本',
          reputation: '声誉',
          innovation: '创新',
          morale: '士气'
        };
        const attrName = attrNames[randomAttr] || randomAttr;
        riskMessage = `风险爆发！${attrName}减少了${penalty}点！`;
        
        addLog({
          round: gameState.round,
          type: 'warning',
          message: riskMessage,
          color: 'text-red-400'
        });
      }
      
      // 6. 记录策略数据到分析系统 - 在状态更新之前记录
      const strategyData = {
        round: gameState.round,
        playerStrategy: strategyId,
        aiStrategy,
        playerStatsBefore: { ...gameState.player },
        playerStatsAfter: { ...finalStats },
        aiThreatLevelBefore: gameState.ai.threatLevel,
        aiThreatLevelAfter: Math.min(5, Math.max(1, Math.floor(calculateAbility(finalStats) / 40))),
        timestamp: Date.now()
      };
      
      // 确保数据记录成功后再继续
      addStrategyData(strategyData);

      // 7. 更新游戏状态
      const newGameHistory = [...(gameState?.gameHistory || []), {
        round: gameState.round,
        playerStrategy: strategyId,
        aiStrategy,
        playerEffects: playerResult.effects,
        aiEffects: aiResult.effects,
        riskTriggered,
        timestamp: Date.now()
      }];
      
      // 更新AI状态
      const newAiStats = aiResult.newStats;
      
      setGameState(prev => ({
        ...prev,
        player: finalStats,
        ai: {
          ...prev.ai,
          lastStrategy: aiStrategy,
          thinking: false,
          threatLevel: strategyData.aiThreatLevelAfter,
          stats: newAiStats
        },
        riskLevel: newRiskLevel,
        gameHistory: newGameHistory
      }));
      
      // 7. 记录结果和详细分析
      const effects = Object.entries(playerResult.effects)
        .filter(([, value]) => value !== undefined && (value as number) !== 0)
        .map(([key, value]) => {
          // 属性名中文映射
          const attrNames: Record<string, string> = {
            capital: '资本',
            reputation: '声誉',
            innovation: '创新',
            morale: '士气'
          };
          const attrName = attrNames[key] || key;
          return `${attrName}${(value as number) > 0 ? '+' : ''}${value}`;
        })
        .join(', ');
      
      addLog({
        round: gameState.round,
        type: 'result',
        message: `效果: ${effects}`,
        color: 'text-green-400'
      });
      
      // 播放属性变化音效
      playAttributeChange();
      
      // 决策分析
      const currentStrategyName = STRATEGIES.find(s => s.id === strategyId)?.name || strategyId;
      const aiStrategyName = STRATEGIES.find(s => s.id === aiStrategy)?.name || aiStrategy;
      
      // 成功因素分析
      const positiveEffects = Object.entries(playerResult.effects)
        .filter(([, value]) => (value as number) > 0)
        .map(([key]) => key);
      
      if (positiveEffects.length > 0) {
        const successFactors = positiveEffects.map(attr => {
          const attrNames: Record<string, string> = {
            capital: '资本实力',
            reputation: '品牌声誉',
            innovation: '创新能力',
            morale: '团队士气'
          };
          return attrNames[attr] || attr;
        }).join('、');
        
        // 成功因素提示
        const successMessage = `✅ 成功因素：选择“${currentStrategyName}”提升了${successFactors}`;
        const existingSuccessLog = gameState.logs.find(log => 
          log.type === 'comment' && 
          log.message === successMessage &&
          log.round === gameState.round
        );
        
        if (!existingSuccessLog) {
          addLog({
            round: gameState.round,
            type: 'comment',
            message: successMessage,
            color: 'text-green'
          });
        }
      }
      
      // 风险提示
      if (playerResult.riskIncrease > 20) {
        const riskMessage = `⚠️ 风险提示：此策略风险较高(${playerResult.riskIncrease})，需关注后续发展`;
        const existingRiskLog = gameState.logs.find(log => 
          log.type === 'warning' && 
          log.message === riskMessage &&
          log.round === gameState.round
        );
        
        if (!existingRiskLog) {
          addLog({
            round: gameState.round,
            type: 'warning',
            message: riskMessage,
            color: 'text-orange'
          });
        }
      }
      
      // AI对策分析
      const aiAnalysisMessage = `🎯 AI分析：基于综合能力对比 | 玩家: ${Math.round(calculateAbility(finalStats))} vs AI: ${Math.round(calculateAbility(newAiStats))}`;
      
      // 检查是否已存在相同的AI分析日志
      const existingAiAnalysisLog = gameState.logs.find(log => 
        log.type === 'comment' && 
        log.message === aiAnalysisMessage &&
        log.round === gameState.round
      );
      
      if (!existingAiAnalysisLog) {
        addLog({
          round: gameState.round,
          type: 'comment',
          message: aiAnalysisMessage,
          color: 'text-blue'
        });
      }
      
      // 组合效果提示
      if (playerResult.combinationBonus) {
        addLog({
          round: gameState.round,
          type: 'comment',
          message: playerResult.combinationBonus,
          color: 'text-gold'
        });
        
        // 播放组合奖励音效
        playCombinationBonus();
      }
      
      // 8. 检查胜负
      const winnerResult = determineWinner(finalStats, newAiStats, gameState.round, gameState.maxRounds);
      if (winnerResult.winner) {
        const resultMessage = {
          'player': '🎉 恭喜！你获得了胜利！',
          'ai': '😔 很遗憾，AI获得了胜利！',
          'draw': '🤝 平局！双方势均力敌！'
        }[winnerResult.winner];
        
        addLog({
          round: gameState.round,
          type: 'system',
          message: resultMessage,
          color: 'text-gold'
        });
        
        // 播放游戏结果音效
        if (winnerResult.winner === 'player') {
          playGameWin();
        } else if (winnerResult.winner === 'ai') {
          playGameLose();
        } else if (winnerResult.winner === 'draw') {
          playGameDraw();
        }
        
        // 显示详细胜负原因
        addLog({
          round: gameState.round,
          type: 'system',
          message: winnerResult.reason,
          color: 'text-blue'
        });
        
        // 生成游戏分析
        const finalGameState = {
          ...gameState,
          player: finalStats,
          ai: {
            ...gameState.ai,
            lastStrategy: aiStrategy,
            threatLevel: strategyData.aiThreatLevelAfter,
            stats: newAiStats
          },
          winner: winnerResult.winner,
          isGameOver: true
        };
        
        const analysis = finalizeGame(finalGameState);
        
        setGameState(prev => ({
          ...prev,
          player: finalStats,
          ai: {
            ...prev.ai,
            lastStrategy: aiStrategy,
            threatLevel: strategyData.aiThreatLevelAfter,
            stats: newAiStats
          },
          isGameOver: true,
          winner: winnerResult.winner
        }));
        
        // 游戏结束时立即重置处理状态
        setIsProcessing(false);
      } else if (gameState.round >= gameState.maxRounds) {
        // 5回合结束，平局（这个条件现在不会触发，因为上面已经处理了）
        addLog({
          round: gameState.round,
          type: 'system',
          message: '游戏结束！平局！',
          color: 'text-gold'
        });
        
        // 播放平局音效
        playGameDraw();
        
        // 生成游戏分析
        const finalGameState = {
          ...gameState,
          player: finalStats,
          ai: {
            ...gameState.ai,
            lastStrategy: aiStrategy,
            threatLevel: strategyData.aiThreatLevelAfter
          },
          winner: 'draw' as const,
          isGameOver: true
        };
        
        const analysis = finalizeGame(finalGameState);
        
        setGameState(prev => ({
          ...prev,
          player: finalStats,
          ai: {
            ...prev.ai,
            lastStrategy: aiStrategy,
            threatLevel: strategyData.aiThreatLevelAfter,
            stats: newAiStats
          },
          isGameOver: true,
          winner: 'draw'
        }));
        
        // 游戏结束时立即重置处理状态
        setIsProcessing(false);
      } else {
        // 进入下一回合 - 修复回合推进逻辑
        addLog({
          round: gameState.round,
          type: 'system',
          message: `回合 ${gameState.round} 结束，准备进入回合 ${gameState.round + 1}...`,
          color: 'text-blue'
        });
        
        // 播放回合结束音效
        playRoundEnd();
        
        // 延迟进入下一回合，给玩家时间查看结果
        setTimeout(() => {
          setGameState(prev => {
            const newRound = prev.round + 1;
            
            // 添加新回合开始日志
            const newLog: LogEntry = {
              id: Date.now().toString(),
              round: newRound,
              type: 'system',
              message: `=== 回合 ${newRound} 开始 ===`,
              timestamp: Date.now(),
              color: 'text-gold'
            };
            
            return {
              ...prev,
              round: newRound,
              logs: [...prev.logs, newLog].slice(-20)
            };
          });
          
          // 播放回合开始音效
          playRoundStart();
          
          // 只有在回合推进完成后才重置处理状态
          setIsProcessing(false);
        }, 3000); // 增加延迟时间到3秒
        
        // 不在finally块中重置isProcessing，避免与setTimeout冲突
        return;
      }
      
    } finally {
      // 游戏结束时已经在上面重置了 isProcessing，这里不再处理
    }
  }, [gameState, addLog]);

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
    setIsProcessing(false);
    clearCurrentGame();
  }, [clearCurrentGame]);

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.isGameOver || isProcessing) return;
      
      // 防止重复触发
      if (e.repeat) return;
      
      const key = parseInt(e.key);
      if (key >= 1 && key <= 5) {
        const strategy = STRATEGIES[key - 1];
        if (strategy) {
          selectStrategy(strategy.id);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isGameOver, isProcessing]); // 移除selectStrategy依赖

  return {
    gameState,
    selectStrategy,
    resetGame,
    isProcessing
  };
}
