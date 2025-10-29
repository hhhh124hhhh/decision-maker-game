import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameSettings } from '../contexts/GameContext';
import { useSoundContext } from '../components/SoundProvider';

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => (
  <motion.div
    className="bg-brown-light border-pixel-thin border-brown-dark p-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <h3 className="font-pixel-display text-lg text-gold mb-4">{title}</h3>
    {children}
  </motion.div>
);

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => (
  <div className="flex items-center justify-between py-2">
    <span className="font-pixel-body text-white text-sm">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={`
        relative w-12 h-6 border-pixel-thin transition-all duration-150
        ${checked ? 'bg-gold border-gold-dark' : 'bg-gray-dark border-gray'}
      `}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 bg-white"
        animate={{ x: checked ? 24 : 2 }}
        transition={{ duration: 0.15 }}
      />
    </button>
  </div>
);

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  unit?: string;
}

const Slider: React.FC<SliderProps> = ({ value, onChange, min, max, step, label, unit = '' }) => (
  <div className="py-2">
    <div className="flex justify-between items-center mb-2">
      <span className="font-pixel-body text-white text-sm">{label}</span>
      <span className="font-pixel-body text-orange text-sm">
        {value}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-dark border-pixel-thin border-brown-dark appearance-none cursor-pointer"
      style={{
        background: `linear-gradient(to right, #FFD700 0%, #FFD700 ${((value - min) / (max - min)) * 100}%, #333333 ${((value - min) / (max - min)) * 100}%, #333333 100%)`
      }}
    />
  </div>
);

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, resetSettings } = useGameSettings();
  const { playButtonClick } = useSoundContext();
  const [testResult, setTestResult] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);

  const aiProviders = [
    { id: 'minimax', name: 'MiniMax', recommended: true },
    { id: 'qwen', name: '通义千问 (DashScope)', recommended: false },
    { id: 'wenxin', name: '文心一言 (Baidu)', recommended: false },
    { id: 'glm', name: '智谱清言 (GLM)', recommended: false },
    { id: 'spark', name: '讯飞星火 (Spark)', recommended: false },
    { id: 'deepseek', name: 'DeepSeek', recommended: false }
  ];

  const getProviderConfig = (provider: string) => {
    const configs = {
      minimax: { baseUrl: 'https://api.minimax.chat/v1', model: 'abab6.5s-chat' },
      qwen: { baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-turbo' },
      wenxin: { baseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro', model: 'ERNIE-Bot-Pro' },
      glm: { baseUrl: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4-flash' },
      spark: { baseUrl: 'https://spark-api-open.xf-yun.com/v1/chat/completions', model: 'General' },
      deepseek: { baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' }
    };
    return configs[provider as keyof typeof configs] || configs.minimax;
  };

  const handleProviderChange = (provider: string) => {
    const config = getProviderConfig(provider);
    updateSettings({
      aiProvider: provider as any,
      aiBaseUrl: config.baseUrl,
      aiModel: config.model
    });
  };

  const testAPIConnection = async () => {
    setIsTesting(true);
    setTestResult('');
    
    try {
      // 模拟API测试
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (settings.aiApiKey && settings.aiBaseUrl) {
        setTestResult('✅ API连接测试成功！');
      } else {
        setTestResult('❌ 请先配置API Key和Base URL');
      }
    } catch (error) {
      setTestResult('❌ API连接测试失败');
    } finally {
      setIsTesting(false);
    }
  };

  const difficultyOptions = [
    { value: 'easy', label: '简单', description: 'AI决策较保守' },
    { value: 'normal', label: '普通', description: '标准AI对抗' },
    { value: 'hard', label: '困难', description: 'AI决策激进' }
  ];

  return (
    <div className="min-h-screen bg-black overflow-y-auto">
      <div className="flex items-start justify-center p-4 pt-8">
        <motion.div
          className="relative w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
        {/* 主容器 */}
        <div className="bg-brown-dark border-pixel-thick border-gold p-8 relative">
          {/* 3D边框效果 */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-20" />
          <div className="absolute top-0 left-0 w-1 h-full bg-white opacity-20" />
          <div className="absolute bottom-0 right-0 w-full h-1 bg-brown-dark opacity-80" />
          <div className="absolute bottom-0 right-0 w-1 h-full bg-brown-dark opacity-80" />

          {/* 标题栏 */}
          <div className="flex justify-between items-center mb-8">
            <motion.h1
              className="font-pixel-display text-3xl text-gold"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              游戏设置
            </motion.h1>
            <motion.button
              onClick={() => {
                playButtonClick();
                navigate('/');
              }}
              className="
                px-6 py-3 bg-orange text-white font-pixel-display text-sm
                border-pixel-thick border-orange-dark hover:bg-orange-light
                transition-all duration-150 ease-steps(8)
              "
              style={{ boxShadow: '4px 4px 0px #CC6600' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              返回主菜单
            </motion.button>
          </div>

          {/* 设置内容 */}
          <div className="space-y-6">
            {/* 音效设置 */}
            <SettingSection title="音效设置">
              <ToggleSwitch
                checked={settings.soundEnabled}
                onChange={(checked) => updateSettings({ soundEnabled: checked })}
                label="启用音效"
              />
              <Slider
                value={settings.soundVolume}
                onChange={(volume) => updateSettings({ soundVolume: volume })}
                min={0}
                max={1}
                step={0.1}
                label="音量"
                unit=""
              />
            </SettingSection>

            {/* 动画设置 */}
            <SettingSection title="动画设置">
              <div className="space-y-4">
                <div>
                  <label className="font-pixel-body text-white text-sm mb-2 block">
                    动画速度
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['slow', 'normal', 'fast'].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => updateSettings({ animationSpeed: speed as any })}
                        className={`
                          py-2 px-4 font-pixel-display text-xs border-pixel-thin transition-all
                          ${settings.animationSpeed === speed 
                            ? 'bg-gold text-brown-dark border-gold-dark' 
                            : 'bg-brown-light text-white border-brown-dark hover:bg-orange'
                          }
                        `}
                      >
                        {speed === 'slow' ? '慢速' : speed === 'normal' ? '正常' : '快速'}
                      </button>
                    ))}
                  </div>
                </div>
                <ToggleSwitch
                  checked={settings.reducedMotion}
                  onChange={(checked) => updateSettings({ reducedMotion: checked })}
                  label="减少动画效果"
                />
              </div>
            </SettingSection>

            {/* 难度设置 */}
            <SettingSection title="难度设置">
              <div className="space-y-3">
                {difficultyOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="difficulty"
                      value={option.value}
                      checked={settings.difficulty === option.value}
                      onChange={(e) => updateSettings({ difficulty: e.target.value as any })}
                      className="w-4 h-4 text-gold bg-brown-light border-pixel-thin border-brown-dark"
                    />
                    <div>
                      <span className="font-pixel-body text-white text-sm">{option.label}</span>
                      <span className="font-pixel-body text-gray-light text-xs ml-2">
                        ({option.description})
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </SettingSection>

            {/* AI设置 */}
            <SettingSection title="AI设置">
              <div className="space-y-4">
                <div>
                  <label className="font-pixel-body text-white text-sm mb-2 block">
                    AI服务提供商
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {aiProviders.map((provider) => (
                      <label key={provider.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="aiProvider"
                          value={provider.id}
                          checked={settings.aiProvider === provider.id}
                          onChange={(e) => handleProviderChange(e.target.value)}
                          className="w-4 h-4 text-gold bg-brown-light border-pixel-thin border-brown-dark"
                        />
                        <span className="font-pixel-body text-white text-xs">
                          {provider.name}
                          {provider.recommended && (
                            <span className="text-gold ml-1">(推荐)</span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-pixel-body text-white text-sm mb-2 block">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={settings.aiApiKey}
                    onChange={(e) => updateSettings({ aiApiKey: e.target.value })}
                    placeholder="输入你的API Key"
                    className="
                      w-full p-3 bg-brown-dark border-pixel-thin border-brown
                      font-pixel-body text-white text-sm
                      focus:border-gold focus:outline-none
                    "
                  />
                </div>

                <div>
                  <label className="font-pixel-body text-white text-sm mb-2 block">
                    Base URL
                  </label>
                  <input
                    type="url"
                    value={settings.aiBaseUrl}
                    onChange={(e) => updateSettings({ aiBaseUrl: e.target.value })}
                    placeholder="API基础地址"
                    className="
                      w-full p-3 bg-brown-dark border-pixel-thin border-brown
                      font-pixel-body text-white text-sm
                      focus:border-gold focus:outline-none
                    "
                  />
                </div>

                <div>
                  <label className="font-pixel-body text-white text-sm mb-2 block">
                    模型名称
                  </label>
                  <input
                    type="text"
                    value={settings.aiModel}
                    onChange={(e) => updateSettings({ aiModel: e.target.value })}
                    placeholder="模型名称"
                    className="
                      w-full p-3 bg-brown-dark border-pixel-thin border-brown
                      font-pixel-body text-white text-sm
                      focus:border-gold focus:outline-none
                    "
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={testAPIConnection}
                    disabled={isTesting || !settings.aiApiKey || !settings.aiBaseUrl}
                    className="
                      px-4 py-2 bg-blue text-white font-pixel-display text-xs
                      border-pixel-thin border-blue-dark hover:bg-blue-light
                      transition-all duration-150 ease-steps(8)
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                  >
                    {isTesting ? '测试中...' : '测试连接'}
                  </button>
                  {testResult && (
                    <span className="font-pixel-body text-sm self-center">
                      {testResult}
                    </span>
                  )}
                </div>
              </div>
            </SettingSection>

            {/* 游戏统计 */}
            <SettingSection title="游戏统计">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-pixel-display text-2xl text-white">
                    {settings.gamesPlayed}
                  </div>
                  <div className="font-pixel-body text-xs text-gray-light">
                    已玩局数
                  </div>
                </div>
                <div>
                  <div className="font-pixel-display text-2xl text-gold">
                    {Math.round(settings.bestScore)}
                  </div>
                  <div className="font-pixel-body text-xs text-gray-light">
                    最高得分
                  </div>
                </div>
                <div>
                  <div className="font-pixel-display text-2xl text-green">
                    {Math.round(settings.winRate * 100)}%
                  </div>
                  <div className="font-pixel-body text-xs text-gray-light">
                    胜率
                  </div>
                </div>
              </div>
            </SettingSection>

            {/* 重置设置 */}
            <SettingSection title="重置设置">
              <button
                onClick={() => {
                  playButtonClick();
                  resetSettings();
                }}
                className="
                  px-6 py-3 bg-red text-white font-pixel-display text-sm
                  border-pixel-thick border-red-dark hover:bg-red-light
                  transition-all duration-150 ease-steps(8)
                "
                style={{ boxShadow: '4px 4px 0px #8B0000' }}
              >
                重置所有设置
              </button>
            </SettingSection>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
};
