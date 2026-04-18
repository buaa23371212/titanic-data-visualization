import React from 'react';
import { BaseChartProps } from '../../types/ChartTypes';

interface BaseChartComponentProps extends BaseChartProps {
  children: React.ReactNode;
  className?: string;
}

export const BaseChart: React.FC<BaseChartComponentProps> = ({
  width = 800,
  height = 400,
  margin = { top: 20, right: 20, bottom: 40, left: 60 },
  theme = 'light',
  children,
  className = ''
}) => {
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const themeColors = {
    light: {
      background: '#ffffff',
      text: '#1f2937',
      grid: '#e5e7eb'
    },
    dark: {
      background: '#1f2937',
      text: '#f9fafb',
      grid: '#374151'
    }
  };

  const colors = themeColors[theme];

  return (
    <div 
      className={`relative ${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        backgroundColor: colors.background,
        color: colors.text
      }}
    >
      <svg width={width} height={height}>
        {/* 图表背景 */}
        <rect 
          width={width} 
          height={height} 
          fill={colors.background}
        />
        
        {/* 图表区域 */}
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {children}
        </g>
      </svg>
    </div>
  );
};

// 图表标题组件
export const ChartTitle: React.FC<{
  title: string;
  subtitle?: string;
  theme?: 'light' | 'dark';
}> = ({ title, subtitle, theme = 'light' }) => {
  const textColor = theme === 'light' ? '#1f2937' : '#f9fafb';
  
  return (
    <div className="mb-4">
      <h2 
        className="text-xl font-semibold mb-1"
        style={{ color: textColor }}
      >
        {title}
      </h2>
      {subtitle && (
        <p 
          className="text-sm opacity-75"
          style={{ color: textColor }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

// 图表容器组件
export const ChartContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {children}
    </div>
  );
};

// 加载状态组件
export const ChartLoading: React.FC<{
  message?: string;
}> = ({ message = '加载数据中...' }) => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};

// 错误状态组件
export const ChartError: React.FC<{
  message: string;
  onRetry?: () => void;
}> = ({ message, onRetry }) => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-red-500 text-4xl mb-2">⚠️</div>
        <p className="text-red-600 dark:text-red-400 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            重试
          </button>
        )}
      </div>
    </div>
  );
};