// 港口统计工具函数
import { Passenger } from '../types/passenger';
import { Port } from './constants';

export interface PortStats {
  totalPassengers: number;
  survived: number;
  survivalRate: number;
  averageFare: number;
  classDistribution: {
    1: number;
    2: number;
    3: number;
  };
  sexDistribution: {
    male: number;
    female: number;
  };
  averageAge: number;
}

/**
 * 计算指定港口的统计信息
 */
export const calculatePortStats = (passengers: Passenger[], portCode: string): PortStats => {
  const portPassengers = passengers.filter(p => p.Embarked === portCode);
  
  if (portPassengers.length === 0) {
    return {
      totalPassengers: 0,
      survived: 0,
      survivalRate: 0,
      averageFare: 0,
      classDistribution: { 1: 0, 2: 0, 3: 0 },
      sexDistribution: { male: 0, female: 0 },
      averageAge: 0
    };
  }

  const survived = portPassengers.filter(p => p.Survived === 1).length;
  const totalFare = portPassengers.reduce((sum, p) => sum + p.Fare_original, 0);
  const totalAge = portPassengers.reduce((sum, p) => sum + p.Age_original, 0);

  return {
    totalPassengers: portPassengers.length,
    survived,
    survivalRate: survived / portPassengers.length,
    averageFare: totalFare / portPassengers.length,
    classDistribution: {
      1: portPassengers.filter(p => p.Pclass === 1).length,
      2: portPassengers.filter(p => p.Pclass === 2).length,
      3: portPassengers.filter(p => p.Pclass === 3).length
    },
    sexDistribution: {
      male: portPassengers.filter(p => p.Sex === 'male').length,
      female: portPassengers.filter(p => p.Sex === 'female').length
    },
    averageAge: totalAge / portPassengers.length
  };
};

/**
 * 计算所有港口的统计信息
 */
export const calculateAllPortsStats = (passengers: Passenger[]): Record<string, PortStats> => {
  const ports = ['C', 'Q', 'S'] as const;
  const stats: Record<string, PortStats> = {};

  ports.forEach(portCode => {
    stats[portCode] = calculatePortStats(passengers, portCode);
  });

  return stats;
};

/**
 * 根据生存率获取标记颜色
 */
export const getMarkerColorBySurvivalRate = (survivalRate: number): string => {
  // 使用渐变色彩：红色（低生存率）到绿色（高生存率）
  if (survivalRate === 0) return '#ff0000'; // 纯红
  if (survivalRate <= 0.25) return '#ff4444'; // 浅红
  if (survivalRate <= 0.5) return '#ffaa00'; // 橙色
  if (survivalRate <= 0.75) return '#aaff00'; // 黄绿
  return '#00ff00'; // 纯绿
};

/**
 * 根据乘客数量获取标记大小
 */
export const getMarkerSizeByPassengerCount = (passengerCount: number): number => {
  // 基础大小 + 根据乘客数量按比例缩放
  const baseSize = 20;
  const scaleFactor = 0.5;
  return baseSize + (passengerCount * scaleFactor);
};

/**
 * 格式化港口统计信息用于显示
 */
export const formatPortStatsForDisplay = (port: Port, stats: PortStats) => {
  return {
    portName: port.fullName,
    totalPassengers: stats.totalPassengers,
    survived: stats.survived,
    survivalRate: (stats.survivalRate * 100).toFixed(1) + '%',
    averageFare: '£' + stats.averageFare.toFixed(2),
    averageAge: stats.averageAge.toFixed(1) + '岁',
    classDistribution: {
      first: stats.classDistribution[1],
      second: stats.classDistribution[2],
      third: stats.classDistribution[3]
    },
    sexDistribution: {
      male: stats.sexDistribution.male,
      female: stats.sexDistribution.female
    }
  };
};

/**
 * 获取港口统计数据的摘要信息
 */
export const getPortStatsSummary = (stats: Record<string, PortStats>) => {
  const totalPassengers = Object.values(stats).reduce((sum, stat) => sum + stat.totalPassengers, 0);
  const totalSurvived = Object.values(stats).reduce((sum, stat) => sum + stat.survived, 0);
  const overallSurvivalRate = totalPassengers > 0 ? totalSurvived / totalPassengers : 0;

  return {
    totalPassengers,
    totalSurvived,
    overallSurvivalRate: (overallSurvivalRate * 100).toFixed(1) + '%',
    portsCount: Object.keys(stats).length
  };
};