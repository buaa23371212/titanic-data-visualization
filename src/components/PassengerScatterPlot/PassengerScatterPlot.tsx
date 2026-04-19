import React, { useState, useEffect } from 'react';
import { Passenger } from '../../types/passenger';

interface ScatterPoint {
  id: number;
  x: number;
  y: number;
  survived: boolean;
  name: string;
  age: number | null;
  pclass: number;
  fare: number;
}

interface PassengerScatterPlotProps {
  passengers: Passenger[];
  filteredPassengerIds: number[];
  onPointClick: (passengerId: number) => void;
  width?: number;
  height?: number;
}

const PassengerScatterPlot: React.FC<PassengerScatterPlotProps> = ({
  passengers,
  filteredPassengerIds,
  onPointClick,
  width = 800,
  height = 600
}) => {
  const [points, setPoints] = useState<ScatterPoint[]>([]);

  // 检查乘客是否被筛选选中
  const isFiltered = (passengerId: number): boolean => {
    return filteredPassengerIds.includes(passengerId);
  };

  // 均匀分布布局算法
  const generateUniformLayout = (passengers: Passenger[]): ScatterPoint[] => {
    const points: ScatterPoint[] = [];
    const gridSize = Math.ceil(Math.sqrt(passengers.length));
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;
    
    passengers.forEach((passenger, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      
      // 在单元格内随机分布，避免重叠
      const x = col * cellWidth + Math.random() * cellWidth * 0.6 + cellWidth * 0.2;
      const y = row * cellHeight + Math.random() * cellHeight * 0.6 + cellHeight * 0.2;
      
      points.push({
        id: passenger.PassengerId,
        x,
        y,
        survived: passenger.Survived,
        name: passenger.Name,
        age: passenger.Age,
        pclass: passenger.Pclass,
        fare: passenger.Fare
      });
    });
    
    return points;
  };

  // 获取点的样式
  const getPointStyle = (point: ScatterPoint) => {
    const filtered = isFiltered(point.id);
    
    if (!filtered) {
      // 未被筛选选中的乘客：灰色，不可点击
      return {
        fill: '#9ca3af', // 灰色
        cursor: 'default',
        opacity: 0.3,
        stroke: 'none',
        r: 4
      };
    }
    
    // 被筛选选中的乘客：根据生存状态显示颜色
    return {
      fill: point.survived ? '#10b981' : '#ef4444',
      cursor: 'pointer',
      opacity: 1,
      stroke: '#3b82f6',
      strokeWidth: 2,
      r: 6
    };
  };

  // 处理点点击事件
  const handlePointClick = (point: ScatterPoint) => {
    if (!isFiltered(point.id)) return; // 未被筛选选中的乘客不可点击
    onPointClick(point.id);
  };

  // 初始化布局
  useEffect(() => {
    const layoutPoints = generateUniformLayout(passengers);
    setPoints(layoutPoints);
  }, [passengers, width, height]);

  return (
    <svg width={width} height={height} className="passenger-scatter-plot">
      {/* 背景 */}
      <rect width={width} height={height} fill="#f8fafc" />
      
      {/* 绘制乘客点 */}
      {points.map((point) => {
        const style = getPointStyle(point);
        
        return (
          <circle
            key={point.id}
            cx={point.x}
            cy={point.y}
            r={style.r}
            fill={style.fill}
            stroke={style.stroke}
            strokeWidth={style.strokeWidth}
            opacity={style.opacity}
            cursor={style.cursor}
            onClick={() => handlePointClick(point)}
            className="passenger-point"
          />
        );
      })}
    </svg>
  );
};

export default PassengerScatterPlot;