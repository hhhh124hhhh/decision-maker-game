import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StrategyData, GameAnalysis, GameAnalyticsContextType } from '../types/analytics';

const GameAnalyticsContext = createContext<GameAnalyticsContextType | undefined>(undefined);

export const useGameAnalytics = () => {
  const context = useContext(GameAnalyticsContext);
  if (!context) {
    throw new Error('useGameAnalytics must be used within a GameAnalyticsProvider');
  }
  return context;
};

interface GameAnalyticsProviderProps {
  children: ReactNode;
}

export const GameAnalyticsProvider: React.FC<GameAnalyticsProviderProps> = ({ children }) => {
  const [currentGameData, setCurrentGameData] = useState<StrategyData[]>([]);
  const [gameAnalyses, setGameAnalyses] = useState<Map<string, GameAnalysis>>(new Map());

  const addStrategyData = (data: StrategyData) => {
    setCurrentGameData(prev => [...prev, data]);
  };

  const analyzeStrategyPatterns = (strategyData: StrategyData[], gameState: any) => {
    if (strategyData.length === 0) return [];

    // 分析玩家的决策行为模式
    const decisionPatterns = analyzeDecisionPatterns(strategyData, gameState);
    
    // 基于决策模式生成策略分析
    return decisionPatterns.map(pattern => {
      // 计算实际回合数（来自游戏历史）
      const actualTotalRounds = gameState?.gameHistory?.length || 0;
      
      // 计算该思维模式的实际使用次数（避免重复计算同一回合）
      const uniqueRounds = new Set(pattern.rounds);
      const actualFrequency = uniqueRounds.size;
      
      // 计算百分比（基于实际回合数）
      const frequencyPercentage = Math.round((actualFrequency / actualTotalRounds) * 100);
      
      return {
        type: pattern.type,
        description: pattern.description,
        icon: pattern.icon,
        frequency: actualFrequency, // 使用去重后的次数
        rounds: pattern.rounds,
        effectiveness: pattern.effectiveness,
        frequencyPercentage,
        totalRounds: actualTotalRounds
      };
    });
  };

  const analyzeDecisionPatterns = (strategyData: StrategyData[], gameState: any) => {
    const patterns: Array<{
      type: 'conservative' | 'aggressive' | 'innovative' | 'motivational' | 'public_relations' | 'adaptive' | 'analytical' | 'opportunistic';
      description: string;
      icon: string;
      frequency: number;
      rounds: number[];
      effectiveness: number;
      usageCount: number; // 添加实际使用次数
    }> = [];

    // 1. 分析策略多样性
    const uniqueStrategies = new Set(strategyData.map(d => d.playerStrategy));
    const strategyDiversity = uniqueStrategies.size / Math.max(1, strategyData.length);
    
    // 2. 分析风险偏好
    const riskAnalysis = analyzeRiskPreference(strategyData);
    
    // 3. 分析时机把握
    const timingAnalysis = analyzeTimingStrategy(strategyData, gameState);
    
    // 4. 分析适应性
    const adaptabilityAnalysis = analyzeAdaptability(strategyData);
    
    // 5. 分析效果导向
    const effectivenessAnalysis = analyzeEffectiveness(strategyData);

    // 根据分析结果确定主要思维模式
    const dominantPatterns = determineDominantPatterns({
      strategyDiversity,
      riskAnalysis,
      timingAnalysis,
      adaptabilityAnalysis,
      effectivenessAnalysis
    }, strategyData, gameState);

    // 为每个模式计算详细数据
    return dominantPatterns.map(pattern => {
      const relatedData = strategyData.filter(d => pattern.strategies.includes(d.playerStrategy));
      const relatedRounds = relatedData.map(d => d.round);
      
      const effectiveness = calculateStrategyEffectiveness(relatedData);

      // 使用实际的使用次数
      const actualFrequency = pattern.usageCount || relatedRounds.length;
      
      // 计算使用频率百分比（基于实际回合数）
      const frequencyPercentage = Math.round((actualFrequency / (gameState?.gameHistory?.length || 1)) * 100);

      return {
        type: pattern.type,
        description: pattern.description,
        icon: pattern.icon,
        frequency: actualFrequency,
        rounds: relatedRounds,
        effectiveness,
        frequencyPercentage
      };
    });
  };

  const analyzeRiskPreference = (strategyData: StrategyData[]) => {
    let conservativeCount = 0;
    let aggressiveCount = 0;
    let balancedCount = 0;

    strategyData.forEach(data => {
      const strategy = data.playerStrategy;
      const threatLevel = data.aiThreatLevelBefore;
      const statChange = (
        (data.playerStatsAfter.capital - data.playerStatsBefore.capital) +
        (data.playerStatsAfter.reputation - data.playerStatsBefore.reputation) +
        (data.playerStatsAfter.innovation - data.playerStatsBefore.innovation) +
        (data.playerStatsAfter.morale - data.playerStatsBefore.morale)
      );

      // 基于策略选择和威胁度判断风险偏好
      if (strategy === 'A1' || (strategy === 'A4' && threatLevel > 3)) {
        conservativeCount++;
      } else if (strategy === 'A2' || (strategy === 'A5' && threatLevel < 2)) {
        aggressiveCount++;
      } else {
        balancedCount++;
      }
    });

    const total = strategyData.length;
    return {
      conservative: conservativeCount / total,
      aggressive: aggressiveCount / total,
      balanced: balancedCount / total
    };
  };

  const analyzeTimingStrategy = (strategyData: StrategyData[], gameState: any) => {
    let earlyGameConservative = 0;
    let midGameAdaptive = 0;
    let lateGameAggressive = 0;

    strategyData.forEach(data => {
      const round = data.round;
      const strategy = data.playerStrategy;
      const totalRounds = gameState?.gameHistory?.length || 1; // 使用游戏历史的实际回合数
      const gamePhase = round / totalRounds;

      if (gamePhase <= 0.3) {
        if (strategy === 'A1' || strategy === 'A4') earlyGameConservative++;
      } else if (gamePhase <= 0.7) {
        if (strategy === 'A3' || strategy === 'A5') midGameAdaptive++;
      } else {
        if (strategy === 'A2') lateGameAggressive++;
      }
    });

    return {
      earlyConservative: earlyGameConservative / strategyData.length,
      midAdaptive: midGameAdaptive / strategyData.length,
      lateAggressive: lateGameAggressive / strategyData.length
    };
  };

  const analyzeAdaptability = (strategyData: StrategyData[]) => {
    let strategySwitches = 0;
    let effectiveSwitches = 0;

    for (let i = 1; i < strategyData.length; i++) {
      const current = strategyData[i];
      const previous = strategyData[i - 1];
      
      if (current.playerStrategy !== previous.playerStrategy) {
        strategySwitches++;
        
        // 检查切换是否有效（基于威胁度变化和属性提升）
        const threatChange = current.aiThreatLevelAfter - current.aiThreatLevelBefore;
        const statImprovement = (
          (current.playerStatsAfter.capital - current.playerStatsBefore.capital) +
          (current.playerStatsAfter.reputation - current.playerStatsBefore.reputation) +
          (current.playerStatsAfter.innovation - current.playerStatsBefore.innovation) +
          (current.playerStatsAfter.morale - current.playerStatsBefore.morale)
        );
        
        if (threatChange < 0 || statImprovement > 0) {
          effectiveSwitches++;
        }
      }
    }

    const totalSwitches = Math.max(1, strategyData.length - 1);
    return {
      switchRate: strategySwitches / totalSwitches,
      effectiveSwitchRate: effectiveSwitches / totalSwitches
    };
  };

  const analyzeEffectiveness = (strategyData: StrategyData[]) => {
    let highImpactMoves = 0;
    let consistentPerformers = 0;

    strategyData.forEach(data => {
      const statImprovement = (
        (data.playerStatsAfter.capital - data.playerStatsBefore.capital) +
        (data.playerStatsAfter.reputation - data.playerStatsBefore.reputation) +
        (data.playerStatsAfter.innovation - data.playerStatsBefore.innovation) +
        (data.playerStatsAfter.morale - data.playerStatsBefore.morale)
      );

      if (statImprovement > 10) {
        highImpactMoves++;
      }
      if (statImprovement > 0) {
        consistentPerformers++;
      }
    });

    return {
      highImpactRate: highImpactMoves / strategyData.length,
      consistencyRate: consistentPerformers / strategyData.length
    };
  };

  const determineDominantPatterns = (analysis: any, strategyData: StrategyData[], gameState: any) => {
    const patterns: Array<{
      type: 'conservative' | 'aggressive' | 'innovative' | 'motivational' | 'public_relations' | 'adaptive' | 'analytical' | 'opportunistic';
      description: string;
      icon: string;
      strategies: string[];
      score: number;
      usageCount: number; // 添加实际使用次数
    }> = [];

    // 计算每个策略的实际使用频率
    const strategyUsage = strategyData.reduce((acc, data) => {
      acc[data.playerStrategy] = (acc[data.playerStrategy] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalRounds = gameState?.gameHistory?.length || 0; // 使用游戏历史的实际回合数

    // 保守稳健型 - 偏好A1策略，风险偏好低
    const conservativeUsage = (strategyUsage['A1'] || 0) + (strategyUsage['A4'] || 0);
    if (analysis.riskAnalysis.conservative > 0.3 || conservativeUsage / totalRounds > 0.3) {
      patterns.push({
        type: 'conservative',
        description: '保守稳健型思维',
        icon: '🛡️',
        strategies: ['A1', 'A4'],
        score: analysis.riskAnalysis.conservative + analysis.timingAnalysis.earlyConservative * 0.5 + (conservativeUsage / totalRounds) * 0.4,
        usageCount: conservativeUsage
      });
    }

    // 激进扩张型 - 偏好A2策略，风险偏好高
    const aggressiveUsage = strategyUsage['A2'] || 0;
    if (analysis.riskAnalysis.aggressive > 0.2 || aggressiveUsage / totalRounds > 0.2) {
      patterns.push({
        type: 'aggressive',
        description: '激进扩张型思维',
        icon: '⚔️',
        strategies: ['A2'],
        score: analysis.riskAnalysis.aggressive + analysis.timingAnalysis.lateAggressive * 0.3 + (aggressiveUsage / totalRounds) * 0.5,
        usageCount: aggressiveUsage
      });
    }

    // 创新研发型 - 偏好A3策略，注重创新
    const innovationUsage = strategyUsage['A3'] || 0;
    const innovationFocus = innovationUsage / totalRounds;
    if (innovationFocus > 0.15) {
      patterns.push({
        type: 'innovative',
        description: '创新研发型思维',
        icon: '💡',
        strategies: ['A3'],
        score: innovationFocus + analysis.effectivenessAnalysis.highImpactRate * 0.3 + (innovationUsage / totalRounds) * 0.4,
        usageCount: innovationUsage
      });
    }

    // 团队激励型 - 偏好A4策略
    const motivationalUsage = strategyUsage['A4'] || 0;
    const motivationalFocus = motivationalUsage / totalRounds;
    if (motivationalFocus > 0.15) {
      patterns.push({
        type: 'motivational',
        description: '团队激励型思维',
        icon: '👥',
        strategies: ['A4'],
        score: motivationalFocus + (motivationalUsage / totalRounds) * 0.4,
        usageCount: motivationalUsage
      });
    }

    // 市场公关型 - 偏好A5策略
    const prUsage = strategyUsage['A5'] || 0;
    const prFocus = prUsage / totalRounds;
    if (prFocus > 0.15) {
      patterns.push({
        type: 'public_relations',
        description: '市场公关型思维',
        icon: '📢',
        strategies: ['A5'],
        score: prFocus + (prUsage / totalRounds) * 0.4,
        usageCount: prUsage
      });
    }

    // 适应型 - 策略切换频繁且有效
    const uniqueStrategiesUsed = Object.keys(strategyUsage).length;
    if (analysis.adaptabilityAnalysis.switchRate > 0.3 && analysis.adaptabilityAnalysis.effectiveSwitchRate > 0.5 && uniqueStrategiesUsed >= 3) {
      patterns.push({
        type: 'adaptive',
        description: '灵活适应型思维',
        icon: '🔄',
        strategies: ['A1', 'A2', 'A3', 'A4', 'A5'],
        score: analysis.adaptabilityAnalysis.switchRate * 0.7 + analysis.adaptabilityAnalysis.effectiveSwitchRate * 0.3 + (uniqueStrategiesUsed / 5) * 0.3,
        usageCount: totalRounds // 适应型使用所有策略
      });
    }

    // 分析型 - 注重效果和时机
    if (analysis.effectivenessAnalysis.consistencyRate > 0.6) {
      const analyticalStrategies = ['A1', 'A3', 'A5'];
      const analyticalUsage = analyticalStrategies.reduce((sum, strategy) => sum + (strategyUsage[strategy] || 0), 0);
      patterns.push({
        type: 'analytical',
        description: '理性分析型思维',
        icon: '📊',
        strategies: analyticalStrategies,
        score: analysis.effectivenessAnalysis.consistencyRate + analysis.timingAnalysis.midAdaptive * 0.4 + (analyticalUsage / totalRounds) * 0.3,
        usageCount: analyticalUsage
      });
    }

    // 机会主义型 - 追求高影响行动
    if (analysis.effectivenessAnalysis.highImpactRate > 0.2) {
      const opportunisticStrategies = ['A2', 'A5'];
      const opportunisticUsage = opportunisticStrategies.reduce((sum, strategy) => sum + (strategyUsage[strategy] || 0), 0);
      patterns.push({
        type: 'opportunistic',
        description: '机会主义型思维',
        icon: '🎯',
        strategies: opportunisticStrategies,
        score: analysis.effectivenessAnalysis.highImpactRate + analysis.riskAnalysis.aggressive * 0.5 + (opportunisticUsage / totalRounds) * 0.3,
        usageCount: opportunisticUsage
      });
    }

    // 按分数排序，返回前3个主要模式，确保至少有一个模式
    const sortedPatterns = patterns
      .sort((a, b) => b.score - a.score)
      .filter(pattern => pattern.score > 0.1); // 过滤掉分数过低的模式
    
    // 如果没有模式符合条件，至少返回使用最多的策略类型
    if (sortedPatterns.length === 0) {
      const mostUsedStrategy = Object.entries(strategyUsage).sort(([,a], [,b]) => b - a)[0];
      if (mostUsedStrategy) {
        const [strategy, count] = mostUsedStrategy;
        const strategyNames: Record<string, { type: any; description: string; icon: string; strategies: string[] }> = {
          'A1': { type: 'conservative', description: '保守稳健型思维', icon: '🛡️', strategies: ['A1'] },
          'A2': { type: 'aggressive', description: '激进扩张型思维', icon: '⚔️', strategies: ['A2'] },
          'A3': { type: 'innovative', description: '创新研发型思维', icon: '💡', strategies: ['A3'] },
          'A4': { type: 'motivational', description: '团队激励型思维', icon: '👥', strategies: ['A4'] },
          'A5': { type: 'public_relations', description: '市场公关型思维', icon: '📢', strategies: ['A5'] }
        };
        
        const strategyInfo = strategyNames[strategy];
        if (strategyInfo) {
          sortedPatterns.push({
            ...strategyInfo,
            score: count / totalRounds,
            usageCount: count
          });
        }
      }
    }
    
    return sortedPatterns.slice(0, 3);
  };

  const calculateStrategyEffectiveness = (strategyData: StrategyData[]) => {
    if (strategyData.length === 0) return 0;
    
    let totalScore = 0;
    strategyData.forEach(data => {
      // 基于属性提升和威胁度变化计算效果
      const statImprovement = 
        (data.playerStatsAfter.capital - data.playerStatsBefore.capital) +
        (data.playerStatsAfter.reputation - data.playerStatsBefore.reputation) +
        (data.playerStatsAfter.innovation - data.playerStatsBefore.innovation) +
        (data.playerStatsAfter.morale - data.playerStatsBefore.morale);
      
      const threatManagement = data.aiThreatLevelAfter - data.aiThreatLevelBefore;
      
      // 综合评分：属性提升权重70%，威胁度控制权重30%
      const roundScore = Math.max(0, (statImprovement * 0.7) + (threatManagement * 0.3));
      totalScore += roundScore;
    });
    
    return Math.min(100, Math.max(0, (totalScore / strategyData.length) * 0.5 + 50));
  };

  const generateAIExplanation = (strategyData: StrategyData[], gameState: any) => {
    const explanations: string[] = [];
    
    // 分析AI的决策模式
    const aiStrategies = strategyData.filter(d => d.aiStrategy).map(d => d.aiStrategy);
    const strategyCounts = aiStrategies.reduce((acc, strategy) => {
      acc[strategy!] = (acc[strategy!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const totalRounds = strategyData.length;
    const mostUsedAI = Object.entries(strategyCounts).sort(([,a], [,b]) => b - a)[0];
    
    if (mostUsedAI) {
      const [strategy, count] = mostUsedAI;
      const strategyNames: Record<string, string> = {
        'A1': '稳健理财', 'A2': '市场扩张', 'A3': '技术转化', 
        'A4': '团队激励', 'A5': '品牌营销'
      };
      const usagePercentage = Math.round((count / totalRounds) * 100);
      
      // 根据使用频率给出更具体的解释
      if (usagePercentage >= 60) {
        explanations.push(`AI主要采用${strategyNames[strategy]}策略应对你的行动，显示出明显的策略倾向`);
      } else if (usagePercentage >= 40) {
        explanations.push(`AI偏好使用${strategyNames[strategy]}策略应对你的行动`);
      } else {
        explanations.push(`AI在${strategyNames[strategy]}策略上有所侧重，但策略选择较为均衡`);
      }
    }
    
    // 分析威胁度变化趋势
    const threatChanges = strategyData.map(d => d.aiThreatLevelAfter - d.aiThreatLevelBefore);
    const avgThreatChange = threatChanges.reduce((a, b) => a + b, 0) / threatChanges.length;
    const threatVariance = threatChanges.reduce((acc, change) => acc + Math.pow(change - avgThreatChange, 2), 0) / threatChanges.length;
    
    // 根据威胁度变化给出更详细的分析
    if (avgThreatChange > 0.8) {
      explanations.push('你的策略让AI感受到强烈威胁，AI防御性增强');
    } else if (avgThreatChange > 0.3) {
      explanations.push('你的策略让AI感受到明显威胁，AI调整了应对策略');
    } else if (avgThreatChange > -0.3) {
      // 分析威胁度波动情况
      if (threatVariance > 1.0) {
        explanations.push('你的策略让AI保持警惕，威胁评估波动较大');
      } else {
        explanations.push('你的策略让AI保持稳定的威胁评估');
      }
    } else if (avgThreatChange > -0.8) {
      explanations.push('你的策略让AI放松了警惕，认为威胁可控');
    } else {
      explanations.push('你的策略让AI大幅降低威胁感，AI变得相对放松');
    }
    
    // 分析AI的适应性
    const strategySwitches = strategyData.length > 1 ? 
      strategyData.slice(1).filter((data, i) => data.aiStrategy !== strategyData[i].aiStrategy).length : 0;
    const switchRate = strategySwitches / (totalRounds - 1);
    
    if (switchRate > 0.4) {
      explanations.push('AI展现出高度适应性，频繁调整策略应对你的变化');
    } else if (switchRate > 0.2) {
      explanations.push('AI具有一定适应性，会根据情况调整策略');
    } else {
      explanations.push('AI策略相对稳定，保持了一致的应对风格');
    }
    
    return explanations;
  };

  const analyzeGameOutcome = (strategyData: StrategyData[], gameState: any) => {
    const finalStats = gameState?.player || {};
    const totalRounds = gameState?.gameHistory?.length || 0; // 使用游戏历史的实际回合数
    
    // 找出转折点（威胁度变化最大的回合）
    let turningPoint: number | null = null;
    let maxThreatChange = 0;
    
    strategyData.forEach(data => {
      const threatChange = Math.abs(data.aiThreatLevelAfter - data.aiThreatLevelBefore);
      if (threatChange > maxThreatChange) {
        maxThreatChange = threatChange;
        turningPoint = data.round;
      }
    });
    
    // 分析玩家优势和劣势
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    // 基于具体数值分析优势
    if (finalStats.capital >= 180) strengths.push('资本积累能力强');
    else if (finalStats.capital >= 150) strengths.push('资本积累表现良好');
    
    if (finalStats.reputation >= 120) strengths.push('声誉建设出色');
    else if (finalStats.reputation >= 100) strengths.push('声誉建设表现良好');
    
    if (finalStats.innovation >= 120) strengths.push('创新能力突出');
    else if (finalStats.innovation >= 100) strengths.push('创新能力表现良好');
    
    if (finalStats.morale >= 120) strengths.push('团队士气高昂');
    else if (finalStats.morale >= 100) strengths.push('团队士气良好');
    
    // 分析劣势
    if (finalStats.capital < 100) weaknesses.push('资本积累不足');
    else if (finalStats.capital < 120) weaknesses.push('资本积累有待提升');
    
    if (finalStats.reputation < 80) weaknesses.push('声誉建设有待加强');
    else if (finalStats.reputation < 100) weaknesses.push('声誉建设可以进一步改善');
    
    if (finalStats.innovation < 80) weaknesses.push('创新能力不足');
    else if (finalStats.innovation < 100) weaknesses.push('创新能力有提升空间');
    
    if (finalStats.morale < 80) weaknesses.push('团队士气偏低');
    else if (finalStats.morale < 100) weaknesses.push('团队士气可以进一步提升');
    
    // 分析关键因素（基于实际游戏表现）
    const keyFactors: string[] = [];
    
    // 分析策略多样性
    const uniqueStrategies = new Set(strategyData.map(d => d.playerStrategy));
    if (uniqueStrategies.size >= 4) {
      keyFactors.push('策略多样性');
    } else if (uniqueStrategies.size <= 2) {
      keyFactors.push('策略集中性');
    }
    
    // 分析时机把握
    const effectiveMoves = strategyData.filter(data => {
      const statImprovement = (
        (data.playerStatsAfter.capital - data.playerStatsBefore.capital) +
        (data.playerStatsAfter.reputation - data.playerStatsBefore.reputation) +
        (data.playerStatsAfter.innovation - data.playerStatsBefore.innovation) +
        (data.playerStatsAfter.morale - data.playerStatsBefore.morale)
      );
      return statImprovement > 5;
    }).length;
    
    if (effectiveMoves / totalRounds > 0.6) {
      keyFactors.push('时机把握精准');
    } else if (effectiveMoves / totalRounds < 0.3) {
      keyFactors.push('时机选择待优化');
    }
    
    // 分析资源分配
    const statBalance = [
      finalStats.capital / 200,
      finalStats.reputation / 150,
      finalStats.innovation / 150,
      finalStats.morale / 150
    ];
    const balanceScore = Math.min(...statBalance);
    
    if (balanceScore > 0.8) {
      keyFactors.push('资源分配均衡');
    } else if (balanceScore < 0.5) {
      keyFactors.push('资源分配失衡');
    }
    
    // 分析风险控制
    const highThreatRounds = strategyData.filter(data => data.aiThreatLevelBefore > 3).length;
    const conservativeInThreat = strategyData.filter(data => 
      data.aiThreatLevelBefore > 3 && (data.playerStrategy === 'A1' || data.playerStrategy === 'A4')
    ).length;
    
    if (highThreatRounds > 0 && conservativeInThreat / highThreatRounds > 0.7) {
      keyFactors.push('风险控制出色');
    } else if (highThreatRounds > 0 && conservativeInThreat / highThreatRounds < 0.3) {
      keyFactors.push('风险控制不足');
    }
    
    // 确保至少有一些关键因素
    if (keyFactors.length === 0) {
      keyFactors.push('策略选择', '时机把握', '资源分配', '风险控制');
    }
    
    // 生成个性化的胜负原因
    let outcomeReason = '';
    if (gameState?.winner === 'player') {
      // 分析胜利的关键原因
      const winningFactors = [];
      
      // 分析优势属性
      const topStats = [
        { name: '资本', value: finalStats.capital, threshold: 180 },
        { name: '声誉', value: finalStats.reputation, threshold: 120 },
        { name: '创新', value: finalStats.innovation, threshold: 120 },
        { name: '士气', value: finalStats.morale, threshold: 120 }
      ].filter(stat => stat.value >= stat.threshold);
      
      if (topStats.length >= 2) {
        winningFactors.push(`在${topStats.map(s => s.name).join('、')}方面建立了显著优势`);
      }
      
      // 分析策略效果
      const avgEffectiveness = strategyData.reduce((sum, data) => {
        const improvement = (
          (data.playerStatsAfter.capital - data.playerStatsBefore.capital) +
          (data.playerStatsAfter.reputation - data.playerStatsBefore.reputation) +
          (data.playerStatsAfter.innovation - data.playerStatsBefore.innovation) +
          (data.playerStatsAfter.morale - data.playerStatsBefore.morale)
        );
        return sum + improvement;
      }, 0) / totalRounds;
      
      if (avgEffectiveness > 8) {
        winningFactors.push('策略执行效果显著');
      } else if (avgEffectiveness > 4) {
        winningFactors.push('策略执行效果良好');
      }
      
      if (winningFactors.length > 0) {
        outcomeReason = `你在综合实力上超越了AI，主要通过${winningFactors.join('，')}取得了胜利`;
      } else {
        outcomeReason = '你在综合实力上超越了AI，通过合理的策略组合取得了胜利';
      }
      
    } else if (gameState?.winner === 'ai') {
      // 分析失败的原因
      const losingFactors = [];
      
      // 分析劣势属性
      const weakStats = [
        { name: '资本', value: finalStats.capital, threshold: 100 },
        { name: '声誉', value: finalStats.reputation, threshold: 80 },
        { name: '创新', value: finalStats.innovation, threshold: 80 },
        { name: '士气', value: finalStats.morale, threshold: 80 }
      ].filter(stat => stat.value < stat.threshold);
      
      if (weakStats.length >= 2) {
        losingFactors.push(`${weakStats.map(s => s.name).join('、')}发展不足`);
      }
      
      // 分析策略效果
      const avgEffectiveness = strategyData.reduce((sum, data) => {
        const improvement = (
          (data.playerStatsAfter.capital - data.playerStatsBefore.capital) +
          (data.playerStatsAfter.reputation - data.playerStatsBefore.reputation) +
          (data.playerStatsAfter.innovation - data.playerStatsBefore.innovation) +
          (data.playerStatsAfter.morale - data.playerStatsBefore.morale)
        );
        return sum + improvement;
      }, 0) / totalRounds;
      
      if (avgEffectiveness < 2) {
        losingFactors.push('策略执行效果不佳');
      }
      
      if (losingFactors.length > 0) {
        outcomeReason = `AI在策略执行上更胜一筹，主要因为你在${losingFactors.join('，')}方面存在不足`;
      } else {
        outcomeReason = 'AI在策略执行上更胜一筹，在某些关键指标上超越了玩家';
      }
      
    } else {
      outcomeReason = '双方实力相当，最终达成平衡状态';
    }
    
    // 分析AI策略特点
    const aiStrategyCounts = strategyData.reduce((acc, data) => {
      if (data.aiStrategy) {
        acc[data.aiStrategy] = (acc[data.aiStrategy] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const mostUsedAIStrategy = Object.entries(aiStrategyCounts).sort(([,a], [,b]) => b - a)[0];
    let aiStrategyDescription = 'AI采用了适应性策略，根据你的行动调整应对方案';
    
    if (mostUsedAIStrategy) {
      const [strategy, count] = mostUsedAIStrategy;
      const strategyNames: Record<string, string> = {
        'A1': '稳健理财', 'A2': '市场扩张', 'A3': '技术转化', 
        'A4': '团队激励', 'A5': '品牌营销'
      };
      const usagePercentage = Math.round((count / totalRounds) * 100);
      
      if (usagePercentage >= 60) {
        aiStrategyDescription = `AI主要采用${strategyNames[strategy]}策略，显示出明确的策略倾向`;
      } else if (usagePercentage >= 40) {
        aiStrategyDescription = `AI偏好使用${strategyNames[strategy]}策略应对你的行动`;
      } else {
        aiStrategyDescription = 'AI策略选择相对均衡，没有明显的策略偏好';
      }
    }
    
    return {
      keyFactors,
      turningPoint,
      playerStrengths: strengths,
      playerWeaknesses: weaknesses,
      aiStrategy: aiStrategyDescription,
      outcomeReason
    };
  };

  const generateRecommendations = (strategyData: StrategyData[], analysis: any, gameState: any) => {
    const recommendations = {
      overall: '',
      specific: [] as Array<{
        situation: string;
        suggestion: string;
        reasoning: string;
      }>
    };
    
    // 基于策略模式生成建议
    const patterns = analyzeStrategyPatterns(strategyData, gameState);
    const dominantPattern = patterns.sort((a, b) => b.frequency - a.frequency)[0];
    
    if (dominantPattern) {
      recommendations.overall = `你在游戏中主要采用${dominantPattern.description}，建议在某些情况下尝试其他策略类型以获得更好的平衡。`;
      
      // 具体建议
      if (dominantPattern.type === 'conservative') {
        recommendations.specific.push({
          situation: '当威胁度较低时',
          suggestion: '可以尝试更激进的策略来快速扩大优势',
          reasoning: '保守策略虽然稳定，但在优势明显时应该把握机会加速发展'
        });
      } else if (dominantPattern.type === 'aggressive') {
        recommendations.specific.push({
          situation: '当威胁度较高时',
          suggestion: '适当采用保守策略降低风险',
          reasoning: '激进策略容易引起AI强烈反应，需要在适当时机收手'
        });
      }
    }
    
    return recommendations;
  };

  const finalizeGame = (gameState: any): GameAnalysis => {
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 确保gameHistory不为null
    const safeGameState = {
      ...gameState,
      gameHistory: gameState?.gameHistory || [],
      player: gameState?.player || {},
      winner: gameState?.winner || null
    };
    
    // 确保策略数据完整性 - 验证是否有遗漏的回合数据
    const validatedStrategyData = validateStrategyData(currentGameData || [], safeGameState);
    
    const strategyPatterns = analyzeStrategyPatterns(validatedStrategyData, safeGameState);
    const aiDecisionExplanation = generateAIExplanation(validatedStrategyData, safeGameState);
    const gameOutcomeAnalysis = analyzeGameOutcome(validatedStrategyData, safeGameState);
    const recommendations = generateRecommendations(validatedStrategyData, gameOutcomeAnalysis, safeGameState);
    
    const analysis: GameAnalysis = {
      gameId,
      totalRounds: safeGameState.gameHistory?.length || 0, // 使用游戏历史的长度，更准确地反映实际进行的回合数
      winner: safeGameState.winner,
      finalPlayerStats: safeGameState.player,
      strategyData: [...validatedStrategyData],
      strategyPatterns,
      aiDecisionExplanation,
      gameOutcomeAnalysis,
      recommendations
    };
    
    // 保存分析结果
    setGameAnalyses(prev => new Map(prev.set(gameId, analysis)));
    
    return analysis;
  };

  // 验证策略数据完整性
  const validateStrategyData = (strategyData: StrategyData[], gameState: any): StrategyData[] => {
    if (strategyData.length === 0) return strategyData;
    
    // 简单的数据验证，确保每个回合只有一条记录
    const uniqueRounds = new Set();
    const validatedData: StrategyData[] = [];
    
    strategyData.forEach(data => {
      // 使用回合数作为唯一键，如果已有相同回合的数据，跳过
      if (!uniqueRounds.has(data.round)) {
        uniqueRounds.add(data.round);
        validatedData.push(data);
      }
    });
    
    // 按回合排序确保数据顺序正确
    return validatedData.sort((a, b) => a.round - b.round);
  };

  const getAnalysis = (gameId: string): GameAnalysis | null => {
    return gameAnalyses.get(gameId) || null;
  };

  const clearCurrentGame = () => {
    setCurrentGameData([]);
  };

  const value: GameAnalyticsContextType = {
    currentGameData,
    gameAnalyses,
    addStrategyData,
    finalizeGame,
    getAnalysis,
    clearCurrentGame
  };

  return (
    <GameAnalyticsContext.Provider value={value}>
      {children}
    </GameAnalyticsContext.Provider>
  );
};