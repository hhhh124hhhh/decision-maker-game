// 游戏核心类型定义

export interface PlayerStats {
  capital: number;      // 资本 (0-200)
  reputation: number;   // 声誉 (0-200)
  innovation: number;   // 创新 (0-200)
  morale: number;       // 士气 (0-200)
}

export interface GameState {
  round: number;
  maxRounds: number;
  player: PlayerStats;
  ai: {
    lastStrategy: string | null;
    threatLevel: number; // 1-5
    thinking: boolean;
    stats: PlayerStats; // AI的状态数据
  };
  logs: LogEntry[];
  isGameOver: boolean;
  winner: 'player' | 'ai' | 'draw' | null;
  riskLevel: number; // 累积风险值
  gameHistory: GameRound[];
}

export interface LogEntry {
  id: string;
  round: number;
  type: 'system' | 'player' | 'ai' | 'result' | 'comment' | 'warning';
  message: string;
  timestamp: number;
  color?: string;
}

export interface GameRound {
  round: number;
  playerStrategy: string;
  aiStrategy: string;
  playerEffects: Record<string, number>;
  aiEffects: Record<string, number>;
  riskTriggered: boolean;
  timestamp: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  effects: Partial<PlayerStats>;
  risk: number;
  cost: number;
  icon: string;
  hotkey: string;
}

export interface StrategyCombination {
  strategies: string[];
  effects: Partial<PlayerStats>;
  bonus: string;
}

// 策略定义 - 重新设计符合商业逻辑的策略
export const STRATEGIES: Strategy[] = [
  {
    id: 'A1',
    name: '稳健理财',
    description: '投资稳健理财产品，获得稳定回报',
    effects: { capital: +12, reputation: +5 },
    risk: 5,
    cost: 5,
    icon: '💰',
    hotkey: '1'
  },
  {
    id: 'A2',
    name: '市场扩张',
    description: '开拓新市场，高投入高回报',
    effects: { capital: -30, innovation: +25, reputation: +15 },
    risk: 25,
    cost: 30,
    icon: '📈',
    hotkey: '2'
  },
  {
    id: 'A3',
    name: '技术转化',
    description: '将研发成果商业化，获得收益',
    effects: { capital: +15, innovation: +20 },
    risk: 10,
    cost: 0,
    icon: '💡',
    hotkey: '3'
  },
  {
    id: 'A4',
    name: '团队激励',
    description: '投资员工福利，提升士气',
    effects: { capital: -15, morale: +30 },
    risk: 5,
    cost: 15,
    icon: '👥',
    hotkey: '4'
  },
  {
    id: 'A5',
    name: '品牌营销',
    description: '品牌推广促进销售增长',
    effects: { capital: -20, reputation: +20 },
    risk: 15,
    cost: 20,
    icon: '📢',
    hotkey: '5'
  }
];

// 策略组合效果 - 重新设计符合商业逻辑的组合
export const STRATEGY_COMBINATIONS: StrategyCombination[] = [
  {
    strategies: ['A1', 'A3'],
    effects: { capital: +40, innovation: +35, reputation: +10 },
    bonus: '技术投资组合：稳健收益与技术转化双重回报'
  },
  {
    strategies: ['A2', 'A5'],
    effects: { capital: -40, innovation: +20, reputation: +35 },
    bonus: '扩张营销：市场开拓与品牌推广协同效应'
  },
  {
    strategies: ['A3', 'A4'],
    effects: { capital: +10, innovation: +35, morale: +35 },
    bonus: '研发团队：技术创新与团队士气双重提升'
  }
];

// 生成随机初始状态的函数
function generateRandomInitialStats(): PlayerStats {
  // 扩大初始差异范围，增加策略选择的重要性
  // 资本: 80-140 (平均110，差异60)
  // 声誉: 60-100 (平均80，差异40) 
  // 创新: 60-100 (平均80，差异40)
  // 士气: 60-100 (平均80，差异40)
  
  const capital = Math.floor(80 + Math.random() * 60); // 80-140
  const reputation = Math.floor(60 + Math.random() * 40); // 60-100
  const innovation = Math.floor(60 + Math.random() * 40); // 60-100
  const morale = Math.floor(60 + Math.random() * 40); // 60-100
  
  return {
    capital,
    reputation,
    innovation,
    morale
  };
}

// 初始游戏状态生成器
export function createInitialGameState(): GameState {
  // 生成统一的随机初始状态，确保玩家和AI使用相同的基础数值
  const playerStats = generateRandomInitialStats();
  
  // AI使用与玩家完全相同的初始状态，确保游戏公平性
  const aiStats = { ...playerStats };

  return {
    round: 1,
    maxRounds: 5,
    player: playerStats,
    ai: {
      lastStrategy: null,
      threatLevel: 1,
      thinking: false,
      stats: aiStats
    },
    logs: [],
    isGameOver: false,
    winner: null,
    riskLevel: 0,
    gameHistory: []
  };
}

// 保持向后兼容的默认初始状态（用于类型定义）
export const INITIAL_GAME_STATE: GameState = createInitialGameState();

// 综合能力计算函数
export function calculateAbility(stats: PlayerStats): number {
  return (
    0.4 * stats.capital +
    0.3 * stats.reputation +
    0.2 * stats.innovation +
    0.1 * stats.morale
  );
}

// 保持向后兼容的别名
export const calculateUtility = calculateAbility;

// 胜负判定 - 基于玩家vs AI综合能力对比
export function determineWinner(
  playerStats: PlayerStats, 
  aiStats: PlayerStats, 
  currentRound: number, 
  maxRounds: number
): { winner: 'player' | 'ai' | 'draw' | null, reason: string } {
  const playerAbility = calculateAbility(playerStats);
  const aiAbility = calculateAbility(aiStats);
  
  // 提前胜利条件（4回合后）：极大优势
  if (currentRound >= 4) {
    const abilityDiff = playerAbility - aiAbility;
    
    // 新增：任意属性达到优秀水平(180分)
    const playerHasExcellent = Object.values(playerStats).some(stat => stat >= 180);
    const aiHasExcellent = Object.values(aiStats).some(stat => stat >= 180);
    
    if (playerHasExcellent && !aiHasExcellent) {
      return { 
        winner: 'player', 
        reason: `你的某项属性达到优秀水平(≥180)，提前获得胜利！` 
      };
    } else if (aiHasExcellent && !playerHasExcellent) {
      return { 
        winner: 'ai', 
        reason: `AI的某项属性达到优秀水平(≥180)，你失败了。` 
      };
    }
    
    // 提高的综合能力差异条件
    if (abilityDiff >= 60) {
      return { 
        winner: 'player', 
        reason: `你的综合能力(${Math.round(playerAbility)})极大领先AI(${Math.round(aiAbility)})，提前获得胜利！` 
      };
    } else if (abilityDiff <= -60) {
      return { 
        winner: 'ai', 
        reason: `AI的综合能力(${Math.round(aiAbility)})极大领先你(${Math.round(playerAbility)})，你失败了。` 
      };
    }
  }
  
  // 5回合结束，比较综合能力
  if (currentRound >= maxRounds) {
    const abilityDiff = playerAbility - aiAbility;
    
    // 新增：任意属性达到优秀水平(180分)
    const playerHasExcellent = Object.values(playerStats).some(stat => stat >= 180);
    const aiHasExcellent = Object.values(aiStats).some(stat => stat >= 180);
    
    if (playerHasExcellent && !aiHasExcellent) {
      return { 
        winner: 'player', 
        reason: `5回合结束！你的某项属性达到优秀水平(≥180)，你获胜！` 
      };
    } else if (aiHasExcellent && !playerHasExcellent) {
      return { 
        winner: 'ai', 
        reason: `5回合结束！AI的某项属性达到优秀水平(≥180)，你失败了。` 
      };
    }
    
    // 标准综合能力比较
    if (abilityDiff > 10) {
      return { 
        winner: 'player', 
        reason: `5回合结束！你的综合能力(${Math.round(playerAbility)}) > AI(${Math.round(aiAbility)})，你获胜！` 
      };
    } else if (abilityDiff < -10) {
      return { 
        winner: 'ai', 
        reason: `5回合结束！AI的综合能力(${Math.round(aiAbility)}) > 你(${Math.round(playerAbility)})，你失败了。` 
      };
    } else {
      return { 
        winner: 'draw', 
        reason: `5回合结束！双方实力相当(${Math.round(playerAbility)} vs ${Math.round(aiAbility)})，平局！` 
      };
    }
  }
  
  // 游戏继续
  return { winner: null, reason: '' };
}

// 风险检查
export function checkRiskTrigger(riskLevel: number): boolean {
  return riskLevel > 70 && Math.random() < 0.3;
}

// 应用策略效果
export function applyStrategyEffects(
  stats: PlayerStats, 
  strategyIds: string[]
): { newStats: PlayerStats; riskIncrease: number; combinationBonus?: string; effects: Partial<PlayerStats> } {
  let newStats = { ...stats };
  let riskIncrease = 0;
  let combinationBonus: string | undefined;
  const effects: Partial<PlayerStats> = {};
  
  // 应用单个策略效果
  strategyIds.forEach(strategyId => {
    const strategy = STRATEGIES.find(s => s.id === strategyId);
    if (strategy) {
      Object.entries(strategy.effects).forEach(([key, value]) => {
        if (value !== undefined) {
          const attrKey = key as keyof PlayerStats;
          const oldValue = newStats[attrKey];
          const newValue = Math.max(0, oldValue + value);
          newStats[attrKey] = newValue;
          effects[attrKey] = (effects[attrKey] || 0) + value;
        }
      });
      riskIncrease += strategy.risk;
    }
  });
  
  // 检查策略组合效果
  const combination = STRATEGY_COMBINATIONS.find(combo => 
    combo.strategies.every(s => strategyIds.includes(s))
  );
  
  if (combination) {
    Object.entries(combination.effects).forEach(([key, value]) => {
      if (value !== undefined) {
        const attrKey = key as keyof PlayerStats;
        const oldValue = newStats[attrKey];
        const newValue = Math.max(0, oldValue + value);
        newStats[attrKey] = newValue;
        effects[attrKey] = (effects[attrKey] || 0) + value;
      }
    });
    combinationBonus = combination.bonus;
    riskIncrease += 5; // 组合策略额外风险
  }
  
  return { newStats, riskIncrease, combinationBonus, effects };
}
