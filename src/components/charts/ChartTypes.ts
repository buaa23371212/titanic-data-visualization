import { Passenger, SummaryStats } from '@/types/passenger';

// 基础图表属性
export interface BaseChartProps {
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  theme?: 'light' | 'dark';
}

// 数据驱动的图表属性
export interface DataChartProps<T = any> extends BaseChartProps {
  data: T[];
  summary?: SummaryStats;
  onDataPointClick?: (data: T, event: React.MouseEvent) => void;
  onDataPointHover?: (data: T | null, event: React.MouseEvent) => void;
}

// 生存分析图表数据
export interface SurvivalChartData {
  category: string;
  total: number;
  survived: number;
  rate: number;
  color?: string;
}

// 分布图表数据
export interface DistributionChartData {
  label: string;
  value: number;
  percentage: number;
  color?: string;
}

// 散点图数据
export interface ScatterChartData {
  x: number;
  y: number;
  category: string;
  size?: number;
  color?: string;
  passenger?: Passenger;
}

// 热力图数据
export interface HeatmapChartData {
  x: string;
  y: string;
  value: number;
  color?: string;
}

// 桑基图数据
export interface SankeyChartData {
  source: string;
  target: string;
  value: number;
  color?: string;
}

// 图表配置接口
export interface ChartConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    grid: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      small: number;
      medium: number;
      large: number;
      xlarge: number;
    };
  };
  animation: {
    duration: number;
    easing: string;
  };
}

// 图表工具函数
export const chartUtils = {
  // 生成颜色比例尺
  generateColorScale: (categories: string[], colors: string[]) => {
    const scale: Record<string, string> = {};
    categories.forEach((category, index) => {
      scale[category] = colors[index % colors.length];
    });
    return scale;
  },

  // 格式化百分比
  formatPercentage: (value: number, decimals: number = 1): string => {
    return `${(value * 100).toFixed(decimals)}%`;
  },

  // 格式化数字
  formatNumber: (value: number): string => {
    return value.toLocaleString();
  },

  // 计算图表尺寸
  calculateChartSize: (
    containerWidth: number,
    containerHeight: number,
    margin: { top: number; right: number; bottom: number; left: number }
  ) => {
    return {
      width: containerWidth - margin.left - margin.right,
      height: containerHeight - margin.top - margin.bottom
    };
  },

  // 生成生存分析数据
  generateSurvivalData: (summary: SummaryStats, category: keyof SummaryStats): SurvivalChartData[] => {
    const dataMap = summary[category] as any;
    return Object.entries(dataMap).map(([key, value]: [string, any]) => ({
      category: key,
      total: value.total,
      survived: value.survived,
      rate: value.rate
    }));
  },

  // 生成分布数据
  generateDistributionData: (data: Record<string, number>): DistributionChartData[] => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    return Object.entries(data).map(([label, value]) => ({
      label,
      value,
      percentage: total > 0 ? value / total : 0
    }));
  }
};