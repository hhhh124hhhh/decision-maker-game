import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameSettings } from '../contexts/GameContext';
import { useSoundContext } from '../components/SoundProvider';

interface MenuButtonProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  disabled = false 
}) => {
  const { playButtonClick } = useSoundContext();

  const handleClick = () => {
    if (!disabled) {
      playButtonClick();
      onClick();
    }
  };

  return (
    <motion.button
      className={`
        w-full max-w-md p-6 bg-brown-light border-pixel-thick border-brown-dark
        font-pixel-display text-white text-center
        transition-all duration-150 ease-steps(8)
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-orange hover:border-gold hover:shadow-pixel-lg'}
        active:translate-x-1 active:translate-y-1 active:shadow-pixel-sm
      `}
      style={{
        boxShadow: !disabled ? '4px 4px 0px #5C2E0A' : '2px 2px 0px #5C2E0A'
      }}
      onClick={handleClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {/* 3D边框效果 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-40" />
      <div className="absolute top-0 left-0 w-1 h-full bg-white opacity-40" />
      <div className="absolute bottom-0 right-0 w-full h-1 bg-brown-dark opacity-80" />
      <div className="absolute bottom-0 right-0 w-1 h-full bg-brown-dark opacity-80" />
      
      {/* 内容 */}
      <div className="relative z-10">
        {/* 图标 */}
        <div className="text-4xl mb-4">{icon}</div>
        
        {/* 标题 */}
        <h3 className="font-pixel-display text-lg mb-2">{title}</h3>
        
        {/* 描述 */}
        <p className="font-pixel-body text-sm text-gray-light">{description}</p>
      </div>
    </motion.button>
  );
};

export const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useGameSettings();

  const menuItems = [
    {
      title: '开始游戏',
      description: '进入商业决策博弈',
      icon: '🎮',
      onClick: () => navigate('/game')
    },
    {
      title: '游戏说明',
      description: '了解游戏规则和策略',
      icon: '📖',
      onClick: () => navigate('/instructions')
    },
    {
      title: '游戏设置',
      description: '自定义游戏体验',
      icon: '⚙️',
      onClick: () => navigate('/settings')
    },
    {
      title: '关于游戏',
      description: '项目信息和开发者',
      icon: 'ℹ️',
      onClick: () => navigate('/about')
    }
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        className="relative w-full max-w-4xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* 主容器 */}
        <div className="bg-brown-dark border-pixel-thick border-gold p-6 relative">
          {/* 3D边框效果 */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-20" />
          <div className="absolute top-0 left-0 w-1 h-full bg-white opacity-20" />
          <div className="absolute bottom-0 right-0 w-full h-1 bg-brown-dark opacity-80" />
          <div className="absolute bottom-0 right-0 w-1 h-full bg-brown-dark opacity-80" />

          {/* 游戏标题 - 确保不被遮挡 */}
          <motion.div
            className="text-center mb-8 relative z-10"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="font-pixel-display text-3xl md:text-4xl text-gold mb-3">
              决策者：思维的博弈
            </h1>
            <p className="font-pixel-body text-base text-orange">
              现代像素艺术风格的商业思维决策游戏
            </p>
          </motion.div>

          {/* 操作按钮区域 - 添加统一背景面板 */}
          <div className="bg-brown-light border-pixel-thin border-brown-dark p-4 mb-6">
            <h3 className="font-pixel-display text-lg text-white mb-4 text-center">
              游戏操作
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <MenuButton
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    onClick={item.onClick}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* 游戏统计 - 优化视觉呈现 */}
          <motion.div
            className="bg-black border-pixel-thin border-green p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="font-pixel-display text-lg text-green mb-3 text-center">
              游戏统计
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="font-pixel-display text-xl text-white">
                  {settings.gamesPlayed}
                </div>
                <div className="font-pixel-body text-xs text-gray-light">
                  已玩局数
                </div>
              </div>
              <div>
                <div className="font-pixel-display text-xl text-gold">
                  {Math.round(settings.bestScore)}
                </div>
                <div className="font-pixel-body text-xs text-gray-light">
                  最高得分
                </div>
              </div>
              <div>
                <div className="font-pixel-display text-xl text-green">
                  {Math.round(settings.winRate * 100)}%
                </div>
                <div className="font-pixel-body text-xs text-gray-light">
                  胜率
                </div>
              </div>
            </div>
          </motion.div>

          {/* 版本信息 */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <p className="font-pixel-body text-xs text-gray-light">
              版本 1.0.0 | 像素艺术风格 | hhhh124hhhh 制作
            </p>
          </motion.div>
        </div>

        {/* 装饰元素 */}
        <motion.div
          className="absolute -top-6 -left-6 w-12 h-12 bg-gold"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -top-6 -right-6 w-12 h-12 bg-orange"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-6 -left-6 w-12 h-12 bg-blue"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-6 -right-6 w-12 h-12 bg-green"
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
};
