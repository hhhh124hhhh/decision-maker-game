import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface GameInstructionsProps {
  isVisible: boolean;
  onClose: () => void;
}

export const GameInstructions: React.FC<GameInstructionsProps> = ({
  isVisible,
  onClose
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-brown-light border-pixel-thick border-gold w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-brown-dark text-white hover:bg-red-600 transition-colors duration-150 rounded"
            >
              <X size={20} />
            </button>

            {/* 标题 */}
            <div className="text-center mb-8">
              <h1 className="font-pixel-display text-3xl text-gold mb-2">
                🎮 游戏说明
              </h1>
              <div className="w-32 h-1 bg-gold mx-auto"></div>
            </div>

            {/* 游戏目标 */}
            <section className="mb-8">
              <h2 className="font-pixel-display text-xl text-gold mb-4 flex items-center">
                🎯 游戏目标
              </h2>
              <div className="bg-brown-dark border-pixel-thin border-gold p-4 rounded">
                <p className="font-pixel-body text-white text-base leading-relaxed">
                  在5个回合中，通过选择不同的策略来提升你的四大属性：
                  <span className="text-gold font-bold">资本</span>、
                  <span className="text-blue font-bold">声誉</span>、
                  <span className="text-green font-bold">创新</span>和
                  <span className="text-orange font-bold">士气</span>。
                  最终综合实力最高的玩家获胜！
                </p>
              </div>
            </section>

            {/* 胜负条件 */}
            <section className="mb-8">
              <h2 className="font-pixel-display text-xl text-gold mb-4 flex items-center">
                🏆 胜负条件
              </h2>
              <div className="bg-brown-dark border-pixel-thin border-gold p-4 rounded space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-gold font-bold">•</span>
                  <p className="font-pixel-body text-white">
                    <span className="text-gold font-bold">胜利条件：</span>5回合结束时，你的综合实力超过AI
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue font-bold">•</span>
                  <p className="font-pixel-body text-white">
                    <span className="text-blue font-bold">失败条件：</span>5回合结束时，AI的综合实力超过你
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-orange font-bold">•</span>
                  <p className="font-pixel-body text-white">
                    <span className="text-orange font-bold">平局条件：</span>5回合结束时，双方综合实力相等
                  </p>
                </div>
              </div>
            </section>

            {/* 策略详情 */}
            <section className="mb-8">
              <h2 className="font-pixel-display text-xl text-gold mb-4 flex items-center">
                📋 策略详情
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: '稳健理财 (A1)',
                    desc: '提升资本，稳健发展',
                    effects: '资本+8~12',
                    color: 'border-gold text-gold'
                  },
                  {
                    name: '市场扩张 (A2)',
                    desc: '提升声誉，快速扩张',
                    effects: '声誉+8~12',
                    color: 'border-blue text-blue'
                  },
                  {
                    name: '技术转化 (A3)',
                    desc: '提升创新，技术驱动',
                    effects: '创新+8~12',
                    color: 'border-green text-green'
                  },
                  {
                    name: '团队激励 (A4)',
                    desc: '提升士气，团队建设',
                    effects: '士气+8~12',
                    color: 'border-orange text-orange'
                  },
                  {
                    name: '品牌营销 (A5)',
                    desc: '综合提升，品牌建设',
                    effects: '全属性+3~5',
                    color: 'border-purple text-purple'
                  }
                ].map((strategy, index) => (
                  <motion.div
                    key={index}
                    className={`bg-brown-dark border-pixel-thin ${strategy.color} p-4 rounded`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="font-pixel-display text-lg font-bold mb-2">
                      {strategy.name}
                    </h3>
                    <p className="font-pixel-body text-white text-sm mb-2">
                      {strategy.desc}
                    </p>
                    <p className={`font-pixel-body text-sm font-bold ${strategy.color}`}>
                      {strategy.effects}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 属性系统 */}
            <section className="mb-8">
              <h2 className="font-pixel-display text-xl text-gold mb-4 flex items-center">
                📊 属性系统
              </h2>
              <div className="bg-brown-dark border-pixel-thin border-gold p-4 rounded">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">💰</div>
                    <div className="font-pixel-display text-gold font-bold">资本</div>
                    <div className="font-pixel-body text-white text-sm">企业资金实力</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏆</div>
                    <div className="font-pixel-display text-blue font-bold">声誉</div>
                    <div className="font-pixel-body text-white text-sm">市场地位影响力</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">💡</div>
                    <div className="font-pixel-display text-green font-bold">创新</div>
                    <div className="font-pixel-body text-white text-sm">技术研发能力</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">😊</div>
                    <div className="font-pixel-display text-orange font-bold">士气</div>
                    <div className="font-pixel-body text-white text-sm">团队凝聚力</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <p className="font-pixel-body text-white text-center">
                    <span className="text-gold font-bold">综合实力</span> = 
                    资本×0.4 + 声誉×0.3 + 创新×0.2 + 士气×0.1
                  </p>
                </div>
              </div>
            </section>

            {/* 操作指南 */}
            <section className="mb-8">
              <h2 className="font-pixel-display text-xl text-gold mb-4 flex items-center">
                🎮 操作指南
              </h2>
              <div className="bg-brown-dark border-pixel-thin border-gold p-4 rounded space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-gold font-bold">1.</span>
                  <p className="font-pixel-body text-white">
                    点击策略按钮或使用键盘快捷键 <span className="bg-gray-700 px-2 py-1 rounded text-xs">1-5</span> 选择策略
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gold font-bold">2.</span>
                  <p className="font-pixel-body text-white">
                    观察AI的决策和双方属性变化
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gold font-bold">3.</span>
                  <p className="font-pixel-body text-white">
                    根据局势调整策略，争取最终胜利
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gold font-bold">4.</span>
                  <p className="font-pixel-body text-white">
                    游戏结束后查看详细的策略分析报告
                  </p>
                </div>
              </div>
            </section>

            {/* AI系统 */}
            <section className="mb-8">
              <h2 className="font-pixel-display text-xl text-gold mb-4 flex items-center">
                🤖 AI系统
              </h2>
              <div className="bg-brown-dark border-pixel-thin border-gold p-4 rounded">
                <p className="font-pixel-body text-white leading-relaxed">
                  AI使用先进的决策算法，会根据你的策略选择做出相应的对策。
                  AI的威胁度会随着你的实力变化而调整，挑战性十足！
                  同时，AI具有一定的随机性，增加了游戏的不可预测性和趣味性。
                </p>
              </div>
            </section>

            {/* 提示 */}
            <section>
              <h2 className="font-pixel-display text-xl text-gold mb-4 flex items-center">
                💡 游戏提示
              </h2>
              <div className="bg-brown-dark border-pixel-thin border-gold p-4 rounded">
                <div className="space-y-2">
                  <p className="font-pixel-body text-white">
                    • 平衡发展比单一属性更有优势
                  </p>
                  <p className="font-pixel-body text-white">
                    • 观察AI的策略模式，适时调整自己的策略
                  </p>
                  <p className="font-pixel-body text-white">
                    • 后期回合的策略选择更加关键
                  </p>
                  <p className="font-pixel-body text-white">
                    • 综合实力不是简单相加，要考虑权重分配
                  </p>
                </div>
              </div>
            </section>

            {/* 关闭按钮 */}
            <div className="text-center mt-8">
              <motion.button
                onClick={onClose}
                className="
                  px-8 py-3 bg-gold text-brown-dark font-pixel-display text-lg
                  border-pixel-thick border-gold-dark hover:bg-gold-light
                  transition-all duration-150 ease-steps(8)
                "
                style={{ boxShadow: '4px 4px 0px #D4A017' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                开始游戏！
              </motion.button>
            </div>

            {/* 3D边框效果 */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-30" />
            <div className="absolute top-0 left-0 w-1 h-full bg-white opacity-30" />
            <div className="absolute bottom-0 right-0 w-full h-1 bg-brown-dark opacity-80" />
            <div className="absolute bottom-0 right-0 w-1 h-full bg-brown-dark opacity-80" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};