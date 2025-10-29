import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 font-pixel-display text-sm border-pixel-thin
      ${isActive 
        ? 'bg-gold text-brown-dark border-gold-dark' 
        : 'bg-brown-light text-white border-brown-dark hover:bg-orange'
      }
      transition-all duration-150 ease-steps(8)
    `}
  >
    {label}
  </button>
);

export const Instructions: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: '游戏目标', id: 'goals' },
    { label: '策略详解', id: 'strategies' },
    { label: '属性系统', id: 'attributes' },
    { label: '操作指南', id: 'controls' },
    { label: '胜负条件', id: 'winconditions' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // 游戏目标
        return (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-brown-light border-pixel-thin border-brown-dark p-6">
              <h3 className="font-pixel-display text-lg text-gold mb-4">游戏背景</h3>
              <p className="font-pixel-body text-white text-sm leading-relaxed mb-4">
                你是一家初创科技公司的CEO，公司成立2年，团队20人，专注于AI技术研发。
                面临市场竞争加剧、融资压力、团队扩张等挑战。
              </p>
              <p className="font-pixel-body text-white text-sm leading-relaxed">
                你的目标是通过5轮关键决策，实现公司的可持续发展，在激烈的市场竞争中脱颖而出。
              </p>
            </div>

            <div className="bg-brown-light border-pixel-thin border-brown-dark p-6">
              <h3 className="font-pixel-display text-lg text-gold mb-4">游戏目标</h3>
              <ul className="space-y-2 font-pixel-body text-white text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>通过明智的商业决策提升公司各项指标</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>在AI的对抗性策略中保持竞争优势</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>平衡短期收益与长期发展</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>在5回合内达到胜利条件</span>
                </li>
              </ul>
            </div>
          </motion.div>
        );

      case 1: // 策略详解
        return (
          <motion.div
            key="strategies"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {[
              {
                name: 'A1 稳健理财',
                icon: '💰',
                description: '投资稳健理财产品，获得稳定回报',
                effects: '资本 +12，声誉 +5，成本 5',
                risk: '低风险',
                strategy: '稳健的资金管理策略，适合资金充裕时使用'
              },
              {
                name: 'A2 市场扩张',
                icon: '📈',
                description: '开拓新市场，高投入高回报',
                effects: '资本 -30，创新 +25，声誉 +15',
                risk: '高风险',
                strategy: '高投入高回报，适合有充足资金时快速占领市场'
              },
              {
                name: 'A3 技术转化',
                icon: '💡',
                description: '将研发成果商业化，获得收益',
                effects: '资本 +15，创新 +20',
                risk: '中风险',
                strategy: '技术研发投入策略，提升技术竞争力，适合长期发展规划'
              },
              {
                name: 'A4 团队激励',
                icon: '👥',
                description: '投资员工福利，提升士气',
                effects: '资本 -15，士气 +30',
                risk: '低风险',
                strategy: '稳定团队士气，为长期发展打下基础'
              },
              {
                name: 'A5 品牌营销',
                icon: '📢',
                description: '品牌推广促进销售增长',
                effects: '资本 -20，声誉 +20',
                risk: '中风险',
                strategy: '快速提升品牌知名度，适合竞争激烈时期'
              }
            ].map((strategy, index) => (
              <motion.div
                key={strategy.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-brown-light border-pixel-thin border-brown-dark p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{strategy.icon}</span>
                  <div>
                    <h4 className="font-pixel-display text-sm text-gold">{strategy.name}</h4>
                    <p className="font-pixel-body text-xs text-gray-light">{strategy.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="font-pixel-display text-orange">效果：</span>
                    <span className="font-pixel-body text-white ml-1">{strategy.effects}</span>
                  </div>
                  <div>
                    <span className="font-pixel-display text-orange">风险：</span>
                    <span className="font-pixel-body text-white ml-1">{strategy.risk}</span>
                  </div>
                  <div className="md:col-span-1">
                    <span className="font-pixel-display text-orange">策略：</span>
                    <span className="font-pixel-body text-white ml-1">{strategy.strategy}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        );

      case 2: // 属性系统
        return (
          <motion.div
            key="attributes"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {[
              {
                name: '资本',
                icon: '💰',
                color: '#FFD700',
                maxValue: 200,
                description: '公司的现金流和融资能力',
                importance: '维持公司运营和投资的基础',
                tips: '过低会导致资金链断裂，过高可能浪费资源'
              },
              {
                name: '声誉',
                icon: '🏆',
                color: '#4169E1',
                maxValue: 200,  // 统一为200
                description: '品牌知名度和市场地位',
                importance: '影响客户信任和合作伙伴关系',
                tips: '高声誉能带来更多商业机会和投资'
              },
              {
                name: '创新',
                icon: '💡',
                color: '#32CD32',
                maxValue: 200,  // 统一为200
                description: '产品研发和技术优势',
                importance: '保持市场竞争力的核心要素',
                tips: '持续创新是长期发展的关键'
              },
              {
                name: '士气',
                icon: '😊',
                color: '#FF8C00',
                maxValue: 200,  // 统一为200
                description: '团队凝聚力和员工满意度',
                importance: '影响团队执行力和创造力',
                tips: '高士气能提升工作效率和员工留存率'
              }
            ].map((attr, index) => (
              <motion.div
                key={attr.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-brown-light border-pixel-thin border-brown-dark p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{attr.icon}</span>
                  <div>
                    <h3 className="font-pixel-display text-lg" style={{ color: attr.color }}>
                      {attr.name}
                    </h3>
                    <p className="font-pixel-body text-sm text-gray-light">
                      最大值: {attr.maxValue}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-pixel-display text-orange">描述：</span>
                    <span className="font-pixel-body text-white ml-2">{attr.description}</span>
                  </div>
                  <div>
                    <span className="font-pixel-display text-orange">重要性：</span>
                    <span className="font-pixel-body text-white ml-2">{attr.importance}</span>
                  </div>
                  <div>
                    <span className="font-pixel-display text-orange">提示：</span>
                    <span className="font-pixel-body text-white ml-2">{attr.tips}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        );

      case 3: // 操作指南
        return (
          <motion.div
            key="controls"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-brown-light border-pixel-thin border-brown-dark p-6">
              <h3 className="font-pixel-display text-lg text-gold mb-4">基本操作</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-pixel-display text-orange w-20">鼠标：</span>
                  <span className="font-pixel-body text-white text-sm">
                    点击策略按钮选择决策
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-pixel-display text-orange w-20">键盘：</span>
                  <span className="font-pixel-body text-white text-sm">
                    使用数字键 1-5 快速选择策略
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-brown-light border-pixel-thin border-brown-dark p-6">
              <h3 className="font-pixel-display text-lg text-gold mb-4">游戏流程</h3>
              <div className="space-y-3">
                {[
                  '1. 阅读当前回合的商业情景',
                  '2. 分析各种策略的利弊',
                  '3. 选择你认为最合适的策略',
                  '4. 观察AI的对抗性决策',
                  '5. 查看决策结果和效果分析',
                  '6. 为下一回合做准备'
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="font-pixel-body text-gold text-sm mt-1">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brown-light border-pixel-thin border-brown-dark p-6">
              <h3 className="font-pixel-display text-lg text-gold mb-4">策略组合</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-pixel-display text-orange">技术投资 (A1+A3)：</span>
                  <span className="font-pixel-body text-white ml-2">
                    资本 +40，创新 +35，声誉 +10
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-pixel-display text-orange">扩张营销 (A2+A5)：</span>
                  <span className="font-pixel-body text-white ml-2">
                    资本 -40，创新 +20，声誉 +35
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-pixel-display text-orange">研发团队 (A3+A4)：</span>
                  <span className="font-pixel-body text-white ml-2">
                    资本 +10，创新 +35，士气 +35
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4: // 胜负条件
        return (
          <motion.div
            key="winconditions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-brown-light border-pixel-thin border-brown-dark p-6">
              <h3 className="font-pixel-display text-lg text-gold mb-4">胜利条件</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="font-pixel-display text-orange">提前胜利（4回合后）：</span>
                  <span className="font-pixel-body text-white text-sm">
                    综合能力差值 ≥ 60 或任意属性值 ≥ 180
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-pixel-display text-orange">最终胜利（5回合后）：</span>
                  <span className="font-pixel-body text-white text-sm">
                    综合能力值 {'>'} AI（差距 {'>'} 10分）或任意属性值 ≥ 180
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-pixel-display text-orange">优秀水平：</span>
                  <span className="font-pixel-body text-white text-sm">
                    任意属性值 ≥ 180（单项指标达到卓越水平）
                  </span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-brown-dark bg-opacity-50 rounded-pixel">
                <p className="font-pixel-body text-xs text-white">
                  <span className="font-pixel-display text-orange">计算公式：</span>
                  综合能力 = 0.4×资本 + 0.3×声誉 + 0.2×创新 + 0.1×士气
                </p>
              </div>
            </div>

            <div className="bg-brown-light border-pixel-thin border-brown-dark p-6">
              <h3 className="font-pixel-display text-lg text-red mb-4">失败条件</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="font-pixel-display text-red">失败：</span>
                  <span className="font-pixel-body text-white text-sm">
                    任意属性值 {'<'} 50（资源不足或表现不佳）
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-pixel-display text-red">失败：</span>
                  <span className="font-pixel-body text-white text-sm">
                    综合能力值 {'<'} 80（综合表现较差）
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-brown-light border-pixel-thin border-brown-dark p-6">
              <h3 className="font-pixel-display text-lg text-gold mb-4">平局条件</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="font-pixel-display text-gold">平局：</span>
                  <span className="font-pixel-body text-white text-sm">
                    5回合结束后，综合能力值在 80-160 之间
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-pixel-display text-gold">平局：</span>
                  <span className="font-pixel-body text-white text-sm">
                    没有达到胜利或失败条件
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-brown-light border-pixel-thin border-brown-dark p-6">
              <h3 className="font-pixel-display text-lg text-gold mb-4">风险系统</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-pixel-display text-orange">累积风险：</span>
                  <span className="font-pixel-body text-white ml-2">
                    每次策略选择都会增加风险值
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-pixel-display text-orange">风险爆发：</span>
                  <span className="font-pixel-body text-white ml-2">
                    风险值 {'>'} 70 时，30%概率触发随机惩罚
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-pixel-display text-orange">惩罚效果：</span>
                  <span className="font-pixel-body text-white ml-2">
                    随机扣除 10-30 点任意属性值
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black overflow-y-auto">
      <div className="flex items-start justify-center p-4 pt-8">
        <motion.div
          className="relative w-full max-w-6xl"
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
              游戏说明
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

          {/* 标签导航 */}
          <motion.div
            className="flex flex-wrap gap-2 mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {tabs.map((tab, index) => (
              <TabButton
                key={tab.id}
                label={tab.label}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
              />
            ))}
          </motion.div>

          {/* 内容区域 */}
          <motion.div
            className="min-h-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </motion.div>
      </div>
    </div>
  );
};
