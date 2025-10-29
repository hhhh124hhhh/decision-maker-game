import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import { GameAnalyticsProvider } from './contexts/GameAnalyticsContext';
import { SoundProvider } from './components/SoundProvider';
import { MainMenu } from './pages/MainMenu';
import { GamePage } from './pages/GamePage';
import { AnalysisPage } from './pages/AnalysisPage';
import { Instructions } from './pages/Instructions';
import { Settings } from './pages/Settings';
import { About } from './pages/About';
import './App.css';
import './layout-fixes.css';

function App() {
  return (
    <GameProvider>
      <GameAnalyticsProvider>
        <SoundProvider>
          <Router>
            <div className="App h-screen w-screen overflow-hidden">
              <Routes>
                <Route path="/" element={<MainMenu />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/analysis/:gameId" element={<AnalysisPage />} />
                <Route path="/instructions" element={<Instructions />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
          </Router>
        </SoundProvider>
      </GameAnalyticsProvider>
    </GameProvider>
  );
}

export default App;
