# FitBody - 身材管理 App

## 技术栈
- React Native (Expo SDK 56) + TypeScript
- expo-router (file-based routing)
- SQLite (expo-sqlite) → Web 上自动降级 localStorage
- Zustand 状态管理 (settingsStore, subscriptionStore, authStore)
- Firebase Auth (邮箱/手机/微信)
- react-native-svg + react-native-reanimated (锻炼动画)

## 启动方式
```bash
npx expo start --web          # 本地开发
npx expo export --platform web # 导出静态文件到 dist/
node server/index.js           # 支付后端 (Stripe)
```

## 线上地址
- **生产**: `https://yghjnj.github.io/`
- **Vercel**: `https://body-fitness-app.vercel.app` (国内被墙)
- 部署: `npx gh-pages -d dist --dotfiles --repo https://github.com/yghjnj/yghjnj.github.io --branch master`

## 项目结构
```
app/
  (tabs)/          → 5个Tab: 首页/追踪/营养/锻炼/个人中心
  (modals)/        → 录入弹窗: 饮水/饮食/体重/锻炼/目标/照片/付费墙
  (vip)/           → VIP专区: AI饮食/AI饮食方案/AI训练/高级分析
  (auth)/          → 登录/注册/引导
src/
  components/      → UI组件 + exercise/ (动画+动作详情弹窗)
  services/        → database/ (SQLite+webFallback), ai/ (计算引擎), firebase/
  stores/          → Zustand: settingsStore, subscriptionStore, authStore
  data/            → foods.ts, exercises.ts, foodEquivalents.ts
  utils/           → calculations/ (BMI/BMR/TDEE等), healthTips.ts
```

## 开发者入口
- 登录页底部「🔑 开发者」→ 输入密码 → 永久VIP
- 个人中心 → 开发者模式开关 → 同样弹密码框
- 密码存在 `.env` (EXPO_PUBLIC_DEV_MASTER_KEY), `.env` 已 gitignore
- 公开部署版本密码为 `not-set`（不从 .env 构建）

## 当前状态 (v1.0+)
- ✅ 7个计算器 (BMI/体脂率/理想体重/WHR/BMR/TDEE/宏量营养素)
- ✅ 5个Tab页面，数据录入存 SQLite/localStorage
- ✅ 首页/追踪页/个人中心身体数据统一到 settingsStore (weightKg/heightCm/age/gender)
- ✅ AI饮食/训练改为本地计算引擎（公式+数据库，不调API）
- ✅ 食物等价参考 + 健康科普推荐（可展开+刷新）
- ✅ 锻炼动画：SVG人形 + requestAnimationFrame驱动 (SvgExerciseFigure.tsx)
- ✅ 动作库含 ACSM/NSCA 标准动作要领+常见错误 (exercises.ts)
- ✅ 付费墙+VIP体系
- ✅ 开发者验证（密码：.env中的DEV_MASTER_KEY）
- ✅ 饮水/饮食/体重/锻炼保存有Toast错误提示
- ⚠️ Vercel 国内被墙，用 GitHub Pages

## 图片识别规则（永久生效）
用户上传图片时：
1. 立即调用 `mcp__vision__describe_image` 工具，不传参数
2. 工具自动从剪贴板读取
3. 如果失败，提示用户 Win+Shift+S 截图后粘贴
4. 绝对禁止说"我看不到图片"
