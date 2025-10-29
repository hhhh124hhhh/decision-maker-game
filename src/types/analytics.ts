// 策略分析数据类型定义

export interface StrategyData {
  round: number;
  playerStrategy: string;
  aiStrategy: string | null;
  playerStatsBefore: {
    capital: number;
    reputation: number;
    innovation: number;
    morale: number;
  };
  playerStatsAfter: {
    capital: number;
    reputation: number;
    innovation: number;
    morale: number;
  };
  aiThreatLevelBefore: number;
  aiThreatLevelAfter: number;
  timestamp: number;
}

export interface StrategyPattern {
  type: 'conservative' | 'aggressive' | 'innovative' | 'motivational' | 'public_relations' | 'adaptive' | 'analytical' | 'opportunistic';
  description: string;
  icon: string;
  frequency: number;        // 使用次数
  frequencyPercentage?: number; // 使用频率百分比
  rounds: number[];         // 使用的回合
  effectiveness: number;    // 0-100
}

export interface GameAnalysis {
  gameId: string;
  totalRounds: number;
  winner: 'player' | 'ai' | 'draw';
  finalPlayerStats: {
    capital: number;
    reputation: number;
    innovation: number;
    morale: number;
  };
  strategyData: StrategyData[];
  strategyPatterns: StrategyPattern[];
  aiDecisionExplanation: string[];
  gameOutcomeAnalysis: {
    keyFactors: string[];
    turningPoint: number | null;
    playerStrengths: string[];
    playerWeaknesses: string[];
    aiStrategy: string;
    outcomeReason: string;
  };
  recommendations: {
    overall: string;
    specific: Array<{
      situation: string;
      suggestion: string;
      reasoning: string;
    }>;
  };
}

export interface GameAnalyticsContextType {
  currentGameData: StrategyData[];
  gameAnalyses: Map<string, GameAnalysis>;
  addStrategyData: (data: StrategyData) => void;
  finalizeGame: (gameState: any) => GameAnalysis;
  getAnalysis: (gameId: string) => GameAnalysis | null;
  clearCurrentGame: () => void;
}