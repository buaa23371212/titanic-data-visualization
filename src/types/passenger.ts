// 乘客数据类型定义 - 与Python预处理脚本对齐
export interface Passenger {
  PassengerId: number;
  Survived: 0 | 1;
  Pclass: 1 | 2 | 3;
  Name: string;
  Sex: 'male' | 'female';
  Age: number; // 标准化后的数值，无null
  SibSp: number; // 标准化后的数值
  Parch: number; // 标准化后的数值
  Ticket: string;
  Fare: number; // 标准化后的数值
  Cabin: string | null;
  Embarked: 'C' | 'Q' | 'S' | null;
  HasCabin: 0 | 1; // 新增：是否有船舱
  Title: string; // 新增：称谓
  FamilySize: number; // 新增：家庭规模
  IsAlone: 0 | 1; // 新增：是否独自旅行
  FamilySizeGroup: 'Solo' | 'Small' | 'Large'; // 新增：家庭规模分组
  FareGroup: 'Low' | 'Medium' | 'High' | 'Very High'; // 新增：票价分组
  AgeGroup: 'Child' | 'Teen' | 'Young Adult' | 'Adult' | 'Senior'; // 新增：年龄分组
  Sex_encoded: 0 | 1; // 新增：性别编码
  Embarked_encoded: 0 | 1 | 2; // 新增：港口编码
  Title_encoded: 0 | 1 | 2 | 3 | 4; // 新增：称谓编码
  SurvivedLabel: 'No' | 'Yes'; // 新增：生存标签
  PclassLabel: 'First' | 'Second' | 'Third'; // 新增：舱位标签
  EmbarkedLabel: 'Southampton' | 'Cherbourg' | 'Queenstown'; // 新增：港口标签
  SexLabel: 'Male' | 'Female'; // 新增：性别标签
}

// 处理后的乘客数据（与基础接口相同，保持兼容性）
export interface ProcessedPassenger extends Passenger {}

// 年龄分组
export type AgeGroup = 'Child' | 'Teen' | 'Young Adult' | 'Adult' | 'Senior';

// 票价分组
export type FareGroup = 'Low' | 'Medium' | 'High' | 'Very High';

// 数据汇总统计 - 与Python预处理脚本对齐
export interface SummaryStats {
  totalPassengers: number;
  totalSurvived: number;
  survivalRate: number;
  
  byClass: {
    [key in 1 | 2 | 3]: {
      total: number;
      survived: number;
      rate: number;
      label: string;
    }
  };
  
  bySex: {
    male: { total: number; survived: number; rate: number; label: string };
    female: { total: number; survived: number; rate: number; label: string };
  };
  
  byAgeGroup: {
    [key in AgeGroup]: { total: number; survived: number; rate: number }
  };
  
  byFareGroup: {
    [key in FareGroup]: { total: number; survived: number; rate: number }
  };
  
  byEmbarked: {
    [key in 'C' | 'Q' | 'S']: { total: number; survived: number; rate: number; label: string }
  };
  
  byFamilySize: {
    [key in 'Solo' | 'Small' | 'Large']: { total: number; survived: number; rate: number }
  };
  
  averageAge: number;
  averageFare: number;
  averageFamilySize: number;
  
  // 新增统计字段
  hasCabinRate: number;
  aloneRate: number;
  titleDistribution: Record<string, number>;
}

// 图表数据接口
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

// 筛选器状态
export interface FilterState {
  pclass: (1 | 2 | 3)[];
  sex: ('male' | 'female')[];
  ageRange: [number, number];
  survived: boolean | null; // null 表示全部
  embarked: ('C' | 'Q' | 'S')[];
}

// 应用状态
export interface AppState {
  // 数据相关
  passengers: Passenger[];
  processedPassengers: ProcessedPassenger[];
  summaryStats: SummaryStats;
  loading: boolean;
  error: string | null;
  
  // UI状态
  filters: FilterState;
  activeView: 'overview' | 'survival' | 'demographics' | 'socioeconomic';
  theme: 'light' | 'dark';
  
  // 图表状态
  selectedPassenger: Passenger | null;
  hoveredData: any;
}

// 常量定义 - 与Python预处理脚本对齐
export const AGE_GROUPS = {
  Child: [0, 12],
  Teen: [13, 18],
  'Young Adult': [19, 35],
  Adult: [36, 60],
  Senior: [61, 100]
} as const;

export const FARE_GROUPS = {
  Low: [0, 7.91],
  Medium: [7.91, 14.454],
  High: [14.454, 31],
  'Very High': [31, 512.329]
} as const;

export const EMBARKED_PORTS = {
  C: 'Cherbourg',
  Q: 'Queenstown', 
  S: 'Southampton'
} as const;

export const CLASS_LABELS = {
  1: 'First',
  2: 'Second', 
  3: 'Third'
} as const;

export const FAMILY_SIZE_GROUPS = {
  Solo: [1, 1],
  Small: [2, 4],
  Large: [5, 11]
} as const;

// 颜色主题
export const CHART_COLORS = {
  survived: '#059669',    // 绿色 - 生存
  notSurvived: '#dc2626', // 红色 - 未生存
  male: '#1e40af',        // 蓝色 - 男性
  female: '#c026d3',      // 紫色 - 女性
  class1: '#f59e0b',      // 黄色 - 一等舱
  class2: '#10b981',      // 绿色 - 二等舱
  class3: '#3b82f6',      // 蓝色 - 三等舱
  background: '#f8fafc',
  grid: '#e2e8f0'
} as const;