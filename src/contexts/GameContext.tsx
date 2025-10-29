import React, { createContext, useContext, useState, useEffect } from 'react';

export interface GameSettings {
  // 音效设置
  soundEnabled: boolean;
  soundVolume: number;
  
  // 动画设置
  animationSpeed: 'slow' | 'normal' | 'fast';
  reducedMotion: boolean;
  
  // 难度设置
  difficulty: 'easy' | 'normal' | 'hard';
  
  // AI设置
  aiProvider: 'minimax' | 'qwen' | 'wenxin' | 'glm' | 'spark' | 'deepseek';
  aiApiKey: string;
  aiBaseUrl: string;
  aiModel: string;
  
  // 主题设置
  theme: 'pixel' | 'modern';
  
  // 游戏统计
  gamesPlayed: number;
  bestScore: number;
  winRate: number;
}

export interface GameContextType {
  settings: GameSettings;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  resetSettings: () => void;
  saveSettings: () => void;
  loadSettings: () => void;
}

const defaultSettings: GameSettings = {
  soundEnabled: true,
  soundVolume: 0.7,
  animationSpeed: 'normal',
  reducedMotion: false,
  difficulty: 'normal',
  aiProvider: 'minimax',
  aiApiKey: '',
  aiBaseUrl: '',
  aiModel: '',
  theme: 'pixel',
  gamesPlayed: 0,
  bestScore: 0,
  winRate: 0
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);

  // 加载设置
  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('decision-maker-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  // 保存设置
  const saveSettings = () => {
    try {
      localStorage.setItem('decision-maker-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // 更新设置
  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // 重置设置
  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('decision-maker-settings');
  };

  // 自动保存设置
  useEffect(() => {
    saveSettings();
  }, [settings]);

  // 初始化加载设置
  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <GameContext.Provider value={{
      settings,
      updateSettings,
      resetSettings,
      saveSettings,
      loadSettings
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameSettings() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameSettings must be used within a GameProvider');
  }
  return context;
}
