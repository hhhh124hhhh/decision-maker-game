import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScenarioIntroProps {
  onStart: () => void;
  onSkip?: () => void;
}

export const ScenarioIntro: React.FC<ScenarioIntroProps> = ({ onStart, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const scenarios = [
    {
      title: "初创科技公司",
      subtitle: "你是一家新兴科技公司的CEO",
      content: "公司成立2年，团队20人，专注于AI技术研发",
      details: [
        "• 面临激烈的市场竞争",
        "• 需要更多融资支持发展",
        "• 团队扩张和人才引进",
        "• 技术创新和产品优化"
      ]
    },
    {
      title: "四个核心指标",
      subtitle: "你需要平衡管理这些关键指标",
      content: "每个决策都会影响这些指标的数值",
      details: [
        "• 资本：公司现金流和融资能力",
        "• 声誉：品牌知名度和市场地位",
        "• 创新：产品研发和技术优势",
        "• 士气：团队凝聚力和员工满意度"
      ]
    },
    {
      title: "游戏目标",
      subtitle: "通过5轮关键决策实现可持续发展",
      content: "每个回合你选择一个策略，AI会做出对抗性决策",
      details: [
        "• 提前胜利（4回合后）：综合能力差值 ≥ 60 或任意指标 ≥ 180",
        "• 最终胜利（5回合后）：综合能力 > AI 或任意指标 ≥ 180",
        "• 失败条件：任意指标 < 50",
        "• 平局条件：5回合后综合能力差距 ≤ 10分",
        "• 策略组合会产生额外效果和风险"
      ]
    }
  ];

  const handleNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (currentStep < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      setTimeout(() => {
        onStart();
      }, 300);
    }
  };

  const handleSkip = () => {
    if (isAnimating) return;
    onSkip?.();
  };

  const currentScenario = scenarios[currentStep];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
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

          {/* 进度指示器 */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2">
              {scenarios.map((_, index) => (
                <motion.div
                  key={index}
                  className={`
                    w-4 h-4 border-pixel-thin border-gold
                    ${index === currentStep ? 'bg-gold' : 'bg-brown-light'}
                  `}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>
          </div>

          {/* 内容区域 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="text-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* 标题 */}
              <motion.h1
                className="font-pixel-display text-3xl text-gold mb-4"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {currentScenario.title}
              </motion.h1>

              {/* 副标题 */}
              <motion.h2
                className="font-pixel-display text-lg text-orange mb-6"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {currentScenario.subtitle}
              </motion.h2>

              {/* 主要内容 */}
              <motion.p
                className="font-pixel-body text-white text-lg mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentScenario.content}
              </motion.p>

              {/* 详细信息列表 */}
              <motion.div
                className="bg-brown border-pixel-thin border-brown-dark p-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="space-y-3">
                  {currentScenario.details.map((detail, index) => (
                    <motion.div
                      key={index}
                      className="font-pixel-body text-sm text-white text-left leading-relaxed"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      {detail}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* 操作按钮 */}
          <motion.div
            className="flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {/* 跳过按钮 */}
            <button
              onClick={handleSkip}
              disabled={isAnimating}
              className="
                px-6 py-3 bg-gray-dark text-gray-light font-pixel-display text-sm
                border-pixel-thin border-gray border-opacity-50
                hover:bg-gray hover:text-white
                transition-all duration-150 ease-steps(8)
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              跳过介绍
            </button>

            {/* 进度文字 */}
            <span className="font-pixel-body text-sm text-gray-light">
              {currentStep + 1} / {scenarios.length}
            </span>

            {/* 下一步/开始游戏按钮 */}
            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="
                px-8 py-3 bg-gold text-brown-dark font-pixel-display text-sm
                border-pixel-thick border-gold-dark hover:bg-gold-light
                transition-all duration-150 ease-steps(8)
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              style={{ 
                boxShadow: isAnimating ? '2px 2px 0px #D4A017' : '4px 4px 0px #D4A017' 
              }}
            >
              {currentStep === scenarios.length - 1 ? '开始游戏' : '下一步'}
            </button>
          </motion.div>
        </div>

        {/* 装饰元素 */}
        <motion.div
          className="absolute -top-4 -left-4 w-8 h-8 bg-gold"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -top-4 -right-4 w-8 h-8 bg-orange"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-8 h-8 bg-blue"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-4 -right-4 w-8 h-8 bg-green"
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
};
