# 贡献指南

感谢您对《决策者：思维的博弈》项目的关注！我们欢迎任何形式的贡献，包括但不限于代码、文档、翻译、设计和测试。

## 开发设置

### 环境要求
- Node.js >= 16
- pnpm 包管理器

### 克隆和安装
```bash
# 克隆项目
git clone https://github.com/hhhh124hhhh/decision-maker-game.git

# 进入项目目录
cd decision-maker-game

# 安装依赖
pnpm install
```

### 开发流程
```bash
# 启动开发服务器
pnpm dev

# 构建项目
pnpm build

# 运行代码检查
pnpm lint
```

## 代码规范

### TypeScript/JavaScript
- 使用 TypeScript 进行开发
- 遵循项目现有的代码风格
- 添加适当的类型注解
- 保持函数和组件的小型化和单一职责

### React 组件
- 使用函数组件和 Hooks
- 组件文件使用 `.tsx` 扩展名
- 为组件添加适当的 JSDoc 注释
- 合理使用 React Context 进行状态管理

### CSS/Tailwind
- 优先使用 Tailwind CSS 类
- 避免使用内联样式
- 在 `tailwind.config.js` 中定义自定义主题
- 保持响应式设计的一致性

## 提交 Pull Request

1. Fork 项目并创建您的功能分支
   ```bash
   git checkout -b feature/AmazingFeature
   ```

2. 提交您的更改
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

3. 推送到分支
   ```bash
   git push origin feature/AmazingFeature
   ```

4. 开启 Pull Request

### Pull Request 指南
- 保持 PR 的小而专注
- 提供清晰的描述，说明更改的内容和原因
- 确保所有测试通过
- 添加适当的测试用例（如果适用）
- 更新相关文档

## 报告问题

### 问题报告指南
在 GitHub Issues 中报告问题时，请包含以下信息：
- 清晰的问题描述
- 重现步骤
- 预期行为和实际行为
- 环境信息（操作系统、浏览器、版本等）
- 相关截图（如果适用）

### 功能请求
我们欢迎功能请求！请在提交功能请求时：
- 描述您想要的功能
- 解释该功能的价值和用途
- 提供可能的实现方案（如果有的话）

## 代码审查流程

所有 Pull Request 都需要通过代码审查。审查者会关注：
- 代码质量和可维护性
- 功能正确性
- 性能影响
- 安全性
- 与项目目标的一致性

## 测试

### 单元测试
- 为新功能添加单元测试
- 确保测试覆盖率
- 使用项目现有的测试框架

### 手动测试
- 在多个浏览器中测试更改
- 在不同设备上测试响应式设计
- 确保无障碍访问功能正常

## 文档

- 更新相关文档以反映代码更改
- 为新功能添加使用说明
- 保持文档的准确性和时效性

## 行为准则

请阅读并遵守我们的[行为准则](CODE_OF_CONDUCT.md)，确保所有参与者都能在一个开放和友好的环境中进行交流。

## 疑问和帮助

如果您有任何疑问或需要帮助，请：
1. 查看现有文档和代码
2. 在 GitHub Issues 中提问
3. 在相关讨论中寻求帮助

感谢您的贡献！