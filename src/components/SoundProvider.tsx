import React, { createContext, useContext } from 'react';
import { useSound, SoundType } from '../hooks/useSound';

interface SoundContextType {
  playSound: (soundType: SoundType) => void;
  playSoundSequence: (soundTypes: SoundType[], delay?: number) => void;
  playButtonClick: () => void;
  playStrategySelect: () => void;
  playAIThinking: () => void;
  playRoundStart: () => void;
  playRoundEnd: () => void;
  playGameWin: () => void;
  playGameLose: () => void;
  playGameDraw: () => void;
  playRiskTrigger: () => void;
  playAttributeChange: () => void;
  playCombinationBonus: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const soundMethods = useSound();

  return (
    <SoundContext.Provider value={soundMethods}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSoundContext must be used within a SoundProvider');
  }
  return context;
}