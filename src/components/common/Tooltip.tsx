import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900'
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div 
          className={`absolute z-50 ${positionClasses[position]} animate-fade-in`}
          role="tooltip"
        >
          {/* 箭头 */}
          <div 
            className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`}
          />
          {/* 工具提示内容 */}
          <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg max-w-xs">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

// 图表数据提示工具
interface ChartTooltipProps {
  data: {
    label: string;
    value: number;
    percentage?: number;
    color?: string;
  };
  position: { x: number; y: number };
  visible: boolean;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ data, position, visible }) => {
  if (!visible) return null;

  return (
    <div 
      className="fixed z-50 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg pointer-events-none"
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="font-medium">{data.label}</div>
      <div className="flex items-center space-x-2 mt-1">
        {data.color && (
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: data.color }}
          />
        )}
        <span>{data.value.toLocaleString()}</span>
        {data.percentage && (
          <span className="text-gray-300">
            ({data.percentage.toFixed(1)}%)
          </span>
        )}
      </div>
    </div>
  );
};