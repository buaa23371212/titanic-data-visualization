import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  className = '',
  onClick 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30'
  };

  const baseClasses = 'p-6 rounded-lg border-2 transition-colors duration-200';
  const interactiveClasses = onClick ? 'cursor-pointer transform hover:scale-105' : '';

  return (
    <div 
      className={`${baseClasses} ${colorClasses[color]} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
};

// 通用卡片容器组件
interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const CardContainer: React.FC<CardContainerProps> = ({ 
  children, 
  className = '',
  title,
  subtitle 
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

// 图表卡片组件
interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  subtitle, 
  children, 
  width = 500, 
  height = 350,
  className = '' 
}) => {
  return (
    <CardContainer title={title} subtitle={subtitle} className={className}>
      <div style={{ width: `${width}px`, height: `${height}px` }}>
        {children}
      </div>
    </CardContainer>
  );
};