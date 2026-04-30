# 泰坦尼克号乘客数据可视化分析
# Titanic Data Visualization

基于 Kaggle 泰坦尼克号数据集的交互式数据可视化分析项目，通过多维度图表展示乘客生存规律与数据特征。

## 📝 项目简介
本项目基于 **Kaggle 泰坦尼克号乘客数据集** 构建，包含 891 名乘客的完整信息（生存状态、舱位等级、性别、年龄、票价、登船港口等）。
通过现代化前端技术栈实现**交互式数据可视化**，深度挖掘沉船事件中的生存模式与人口统计学规律，支持图表联动、筛选、地图可视化等丰富交互。

**在线访问地址**：https://buaa23371212.github.io/titanic-data-visualization/

**数据集来源**：https://www.kaggle.com/datasets/yasserh/titanic-dataset

## 🛠️ 技术栈
- **核心框架**：React 18 + TypeScript
- **构建工具**：Vite
- **可视化库**：D3.js、ObservableHQ Framework
- **地图可视化**：Leaflet + React-Leaflet
- **样式方案**：Tailwind CSS
- **代码规范**：ESLint + Prettier
- **测试工具**：Vitest + Testing Library
- **部署平台**：GitHub Pages

## 📊 可视化模块
本项目共包含 **4 大核心分析模块**：

### 1. 概览仪表盘（Overview Dashboard）
- 关键指标：总乘客数、生存人数、总体生存率、平均年龄
- 核心图表：舱位等级 vs 生存率、性别 vs 生存率
- 数据维度：乘客基本信息、生存状态、舱位等级、性别

### 2. 生存分析（Survival Analysis）
- 多维度对比：舱位等级 / 性别 / 登船港口 生存率
- 交互式筛选：点击图表元素实现数据动态筛选
- 数据维度：生存状态、舱位等级、性别、登船港口

### 3. 人口统计分析（Demographics Analysis）
- 年龄分布直方图：全船乘客年龄分布趋势
- 家庭结构分析：乘客家庭规模分布统计
- 图表联动：家庭结构筛选 → 年龄分布自动联动
- 数据维度：年龄、家庭规模、亲属关系

### 4. 地理维度分析（Geographic Analysis）
- 登船港口地图：港口地理位置可视化展示
- 港口生存率对比：不同登船港口乘客生存情况
- 双向交互：地图选择 → 图表自动筛选联动
- 数据维度：登船港口、地理位置、票价

## 📁 项目结构
```
titanic-data-visualization/
├── README.md              # 项目说明文档
├── package.json           # 项目依赖配置
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 构建配置
├── tailwind.config.js     # Tailwind CSS 配置
├── index.html             # 入口 HTML
├── docs/                  # 文档与原始数据
│   └── data/raw/Titanic-Dataset.csv
├── src/                   # 前端源代码
│   ├── main.tsx           # 应用入口
│   ├── App.tsx            # 主组件
│   ├── types/             # TS 类型定义
│   ├── components/        # 可视化组件
│   │   ├── layout/        # 布局
│   │   ├── charts/        # 图表
│   │   └── filters/       # 筛选器
│   ├── hooks/             # 自定义 Hooks
│   └── utils/             # 工具函数
├── scripts/               # Python 数据处理脚本
│   ├── data_preprocessing.py
│   └── data_analysis.py
└── tests/                 # 单元测试 / 集成测试
```

## 🚀 快速启动
### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```
