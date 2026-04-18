// 图表相关常量定义

// 生存分析图表类别类型
export type SurvivalChartCategory = 
  | 'byClass' 
  | 'bySex' 
  | 'byAgeGroup' 
  | 'byFareGroup' 
  | 'byEmbarked' 
  | 'byFamilySize';

// 图表类别标签映射
export const CHART_CATEGORY_LABELS: Record<SurvivalChartCategory, string> = {
  byClass: '舱位等级',
  bySex: '性别',
  byAgeGroup: '年龄分组',
  byFareGroup: '票价分组',
  byEmbarked: '登船港口',
  byFamilySize: '家庭规模'
};

// 具体类别名称映射
export const CATEGORY_DETAIL_LABELS: Record<SurvivalChartCategory, Record<string, string>> = {
  byClass: {
    '1': '一等舱',
    '2': '二等舱',
    '3': '三等舱'
  },
  bySex: {
    'male': '男性',
    'female': '女性'
  },
  byAgeGroup: {
    'child': '儿童',
    'young': '青年',
    'adult': '成人',
    'senior': '老年'
  },
  byFareGroup: {
    'low': '低价',
    'medium': '中等',
    'high': '高价',
    'luxury': '豪华'
  },
  byEmbarked: {
    'C': '瑟堡',
    'Q': '皇后镇',
    'S': '南安普顿'
  },
  byFamilySize: {
    'single': '单独',
    'small': '小型',
    'medium': '中型',
    'large': '大型'
  }
};

// 图表默认配置
export const CHART_DEFAULTS = {
  width: 600,
  height: 400,
  margin: { top: 40, right: 30, bottom: 60, left: 80 },
  theme: 'light' as const,
  barPadding: 0.3
};

// 颜色配置
export const CHART_COLORS = {
  light: {
    survived: '#10b981',
    notSurvived: '#ef4444',
    background: '#ffffff',
    grid: '#e5e7eb',
    text: '#1f2937'
  },
  dark: {
    survived: '#34d399',
    notSurvived: '#f87171',
    background: '#1f2937',
    grid: '#374151',
    text: '#f9fafb'
  }
};

// 图表标题配置
export const CHART_TITLES: Record<SurvivalChartCategory, { title: string; subtitle: string }> = {
  byClass: {
    title: '舱位等级与生存率分析',
    subtitle: '不同舱位等级的乘客生存情况对比'
  },
  bySex: {
    title: '性别与生存率分析',
    subtitle: '不同性别乘客的生存情况对比'
  },
  byAgeGroup: {
    title: '年龄分组与生存率分析',
    subtitle: '不同年龄段乘客的生存情况对比'
  },
  byFareGroup: {
    title: '票价分组与生存率分析',
    subtitle: '不同票价区间乘客的生存情况对比'
  },
  byEmbarked: {
    title: '登船港口与生存率分析',
    subtitle: '不同登船港口乘客的生存情况对比'
  },
  byFamilySize: {
    title: '家庭规模与生存率分析',
    subtitle: '不同家庭规模乘客的生存情况对比'
  }
};