import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const About: React.FC = () => {
  const navigate = useNavigate();

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
              关于游戏
            </motion.h1>
            <motion.button
              onClick={() => navigate('/')}
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

          {/* 内容区域 */}
          <div className="space-y-6">
            {/* 游戏介绍 */}
            <motion.div
              className="bg-brown-light border-pixel-thin border-brown-dark p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="font-pixel-display text-xl text-gold mb-4">游戏介绍</h2>
              <p className="font-pixel-body text-white text-sm leading-relaxed mb-4">
                《决策者：思维的博弈》是一款现代像素艺术风格的商业思维决策游戏。
                玩家扮演一家初创科技公司的CEO，需要在5轮关键决策中平衡资本、声誉、创新、士气四个核心指标，
                与AI进行策略博弈，目标是实现公司的可持续发展。
              </p>
              <p className="font-pixel-body text-white text-sm leading-relaxed">
                游戏融合了经典像素艺术美学与现代商业策略思维，为玩家提供了一个既怀旧又具有深度的决策体验。
              </p>
            </motion.div>

            {/* 特色功能 */}
            <motion.div
              className="bg-brown-light border-pixel-thin border-brown-dark p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="font-pixel-display text-xl text-gold mb-4">特色功能</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: '🎨',
                    title: '像素艺术风格',
                    description: '现代8-bit像素艺术美学，暖色调配色方案'
                  },
                  {
                    icon: '🤖',
                    title: 'AI智能对抗',
                    description: '基于minimax算法的智能AI决策系统'
                  },
                  {
                    icon: '📊',
                    title: '策略组合系统',
                    description: '5种基础策略，3种组合效果，丰富的策略深度'
                  },
                  {
                    icon: '⚡',
                    title: '风险管理系统',
                    description: '累积风险值和随机风险爆发机制'
                  },
                  {
                    icon: '📈',
                    title: '智能分析',
                    description: '决策风格识别和个性化推荐'
                  },
                  {
                    icon: '⌨️',
                    title: '流畅交互',
                    description: '键盘快捷键支持，流畅动画效果'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="flex items-start gap-3 p-3 bg-brown-dark border-pixel-thin border-brown"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h3 className="font-pixel-display text-sm text-orange mb-1">
                        {feature.title}
                      </h3>
                      <p className="font-pixel-body text-xs text-gray-light">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 技术信息 */}
            <motion.div
              className="bg-brown-light border-pixel-thin border-brown-dark p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="font-pixel-display text-xl text-gold mb-4">技术信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-pixel-display text-sm text-orange mb-3">前端技术</h3>
                  <ul className="space-y-1 font-pixel-body text-xs text-white">
                    <li>• React 18 + TypeScript</li>
                    <li>• Framer Motion 动画</li>
                    <li>• Tailwind CSS 样式</li>
                    <li>• Vite 构建工具</li>
                    <li>• React Router 路由</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-pixel-display text-sm text-orange mb-3">设计规范</h3>
                  <ul className="space-y-1 font-pixel-body text-xs text-white">
                    <li>• 8px网格对齐系统</li>
                    <li>• 像素艺术字体 (Press Start 2P)</li>
                    <li>• 暖色调配色方案</li>
                    <li>• 响应式设计</li>
                    <li>• 无障碍访问支持</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* 开发信息 */}
            <motion.div
              className="bg-brown-light border-pixel-thin border-brown-dark p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="font-pixel-display text-xl text-gold mb-4">开发信息</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-pixel-body text-white text-sm">开发者：</span>
                  <span className="font-pixel-body text-orange text-sm">MiniMax Agent</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-pixel-body text-white text-sm">版本：</span>
                  <span className="font-pixel-body text-orange text-sm">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-pixel-body text-white text-sm">开发时间：</span>
                  <span className="font-pixel-body text-orange text-sm">2025年10月</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-pixel-body text-white text-sm">许可证：</span>
                  <span className="font-pixel-body text-orange text-sm">MIT License</span>
                </div>
              </div>
            </motion.div>

            {/* 致谢 */}
            <motion.div
              className="bg-brown-light border-pixel-thin border-brown-dark p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="font-pixel-display text-xl text-gold mb-4">致谢</h2>
              <div className="space-y-2 font-pixel-body text-sm text-white">
                <p>感谢以下开源项目和资源：</p>
                <ul className="space-y-1 ml-4">
                  <li>• React - 用户界面库</li>
                  <li>• Framer Motion - 动画库</li>
                  <li>• Tailwind CSS - CSS框架</li>
                  <li>• Google Fonts - Press Start 2P 字体</li>
                  <li>• Vite - 构建工具</li>
                </ul>
                <p className="mt-4 text-gray-light">
                  特别感谢像素艺术社区提供的设计灵感和资源支持。
                </p>
              </div>
            </motion.div>
          </div>
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
    </div>
  );
};
