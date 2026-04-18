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

// 港口相关常量
export interface Port {
  code: 'C' | 'Q' | 'S';
  name: string;
  fullName: string;
  coordinates: [number, number]; // [纬度, 经度]
  description: string;
}

export const PORTS: Port[] = [
  {
    code: 'S',
    name: 'Southampton',
    fullName: '南安普顿',
    coordinates: [50.9097, -1.4044],
    description: '英国主要港口，泰坦尼克号启航地'
  },
  {
    code: 'C',
    name: 'Cherbourg',
    fullName: '瑟堡',
    coordinates: [49.6398, -1.6214],
    description: '法国港口，泰坦尼克号中途停靠'
  },
  {
    code: 'Q',
    name: 'Queenstown',
    fullName: '皇后镇',
    coordinates: [51.8503, -8.2943],
    description: '爱尔兰港口，泰坦尼克号最后停靠点'
  }
];

// 地图配置常量
export const MAP_CONFIG = {
  center: [52.0, -3.0] as [number, number],
  defaultZoom: 5,
  minZoom: 3,
  maxZoom: 10,
  tileLayerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  tileLayerAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

// 泰坦尼克号航线配置
interface RoutePoint {
  name: string;
  coordinates: [number, number];
  description: string;
  date: string;
}

export const TITANIC_ROUTE: RoutePoint[] = [
  {
    name: '南安普顿',
    coordinates: [50.9097, -1.4044],
    description: '启航地 - 1912年4月10日中午12:00',
    date: '1912-04-10'
  },
  {
    name: '瑟堡',
    coordinates: [49.6398, -1.6214],
    description: '中途停靠 - 1912年4月10日18:30',
    date: '1912-04-10'
  },
  {
    name: '皇后镇',
    coordinates: [51.8503, -8.2943],
    description: '最后停靠 - 1912年4月11日11:30',
    date: '1912-04-11'
  },
  {
    name: '沉船地点',
    coordinates: [41.7325, -49.9469],
    description: '泰坦尼克号沉没地点 - 1912年4月15日02:20',
    date: '1912-04-15'
  }
];

// 航线样式配置
export const ROUTE_STYLES = {
  lineColor: '#dc2626',
  lineWeight: 3,
  lineOpacity: 0.8,
  lineDashArray: '5, 10',
  routePointColor: '#3b82f6',
  routePointRadius: 6,
  shipwreckColor: '#ef4444',
  shipwreckRadius: 10,
  shipwreckIcon: '🚢'
};