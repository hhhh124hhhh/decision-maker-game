import { useCallback, useRef, useEffect } from 'react';
import { useGameSettings } from '../contexts/GameContext';

// 音效类型定义
export type SoundType = 
  | 'buttonClick'
  | 'strategySelect'
  | 'aiThinking'
  | 'roundStart'
  | 'roundEnd'
  | 'gameWin'
  | 'gameLose'
  | 'gameDraw'
  | 'riskTrigger'
  | 'attributeChange'
  | 'combinationBonus';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume?: number;
}

const SOUND_CONFIGS: Record<SoundType, SoundConfig> = {
  buttonClick: { frequency: 800, duration: 100, type: 'sine', volume: 0.3 },
  strategySelect: { frequency: 600, duration: 200, type: 'triangle', volume: 0.4 },
  aiThinking: { frequency: 400, duration: 500, type: 'sawtooth', volume: 0.2 },
  roundStart: { frequency: 1000, duration: 300, type: 'square', volume: 0.5 },
  roundEnd: { frequency: 700, duration: 250, type: 'triangle', volume: 0.4 },
  gameWin: { frequency: 1200, duration: 1000, type: 'sine', volume: 0.6 },
  gameLose: { frequency: 300, duration: 800, type: 'sawtooth', volume: 0.5 },
  gameDraw: { frequency: 500, duration: 600, type: 'triangle', volume: 0.4 },
  riskTrigger: { frequency: 200, duration: 400, type: 'sawtooth', volume: 0.7 },
  attributeChange: { frequency: 900, duration: 150, type: 'sine', volume: 0.3 },
  combinationBonus: { frequency: 1100, duration: 300, type: 'triangle', volume: 0.5 }
};

export function useSound() {
  const { settings } = useGameSettings();
  const audioContextRef = useRef<AudioContext | null>(null);

  // 初始化音频上下文
  useEffect(() => {
    const initAudioContext = () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
      } catch (error) {
        console.warn('音频上下文初始化失败:', error);
      }
    };

    // 用户首次交互时初始化音频上下文（浏览器策略要求）
    const handleFirstInteraction = () => {
      initAudioContext();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // 播放单个音效
  const playSound = useCallback((soundType: SoundType, customVolume?: number) => {
    if (!settings.soundEnabled || !audioContextRef.current) return;

    const config = SOUND_CONFIGS[soundType];
    if (!config) return;

    try {
      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // 连接音频节点
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // 设置音效参数
      oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
      oscillator.type = config.type;

      // 应用音量设置
      const volume = (customVolume ?? config.volume ?? 0.5) * settings.soundVolume;
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + config.duration / 1000);

      // 播放音效
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + config.duration / 1000);
    } catch (error) {
      console.warn(`播放音效 ${soundType} 失败:`, error);
    }
  }, [settings.soundEnabled, settings.soundVolume]);

  // 播放组合音效（多个音效叠加）
  const playSoundSequence = useCallback((soundTypes: SoundType[], delay: number = 100) => {
    if (!settings.soundEnabled) return;

    soundTypes.forEach((soundType, index) => {
      setTimeout(() => {
        playSound(soundType);
      }, index * delay);
    });
  }, [settings.soundEnabled, playSound]);

  // 播放按钮点击音效
  const playButtonClick = useCallback(() => {
    playSound('buttonClick');
  }, [playSound]);

  // 播放策略选择音效
  const playStrategySelect = useCallback(() => {
    playSound('strategySelect');
  }, [playSound]);

  // 播放AI思考音效
  const playAIThinking = useCallback(() => {
    playSound('aiThinking');
  }, [playSound]);

  // 播放回合开始音效
  const playRoundStart = useCallback(() => {
    playSound('roundStart');
  }, [playSound]);

  // 播放回合结束音效
  const playRoundEnd = useCallback(() => {
    playSound('roundEnd');
  }, [playSound]);

  // 播放游戏胜利音效
  const playGameWin = useCallback(() => {
    playSoundSequence(['gameWin', 'gameWin'], 200);
  }, [playSoundSequence]);

  // 播放游戏失败音效
  const playGameLose = useCallback(() => {
    playSound('gameLose');
  }, [playSound]);

  // 播放游戏平局音效
  const playGameDraw = useCallback(() => {
    playSound('gameDraw');
  }, [playSound]);

  // 播放风险触发音效
  const playRiskTrigger = useCallback(() => {
    playSoundSequence(['riskTrigger', 'riskTrigger'], 150);
  }, [playSoundSequence]);

  // 播放属性变化音效
  const playAttributeChange = useCallback(() => {
    playSound('attributeChange');
  }, [playSound]);

  // 播放组合奖励音效
  const playCombinationBonus = useCallback(() => {
    playSoundSequence(['combinationBonus', 'buttonClick'], 100);
  }, [playSoundSequence]);

  return {
    playSound,
    playSoundSequence,
    playButtonClick,
    playStrategySelect,
    playAIThinking,
    playRoundStart,
    playRoundEnd,
    playGameWin,
    playGameLose,
    playGameDraw,
    playRiskTrigger,
    playAttributeChange,
    playCombinationBonus
  };
}