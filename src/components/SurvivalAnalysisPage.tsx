import React, { useState, useEffect } from 'react';
import { Passenger } from '../types/passenger';
import PassengerScatterPlot from './PassengerScatterPlot/PassengerScatterPlot';
import FilterPanel, { FilterState } from './FilterPanel/FilterPanel';
import SurvivalStats from './StatisticsPanel/SurvivalStats';
import { usePassengerData } from '../hooks/usePassengerData';
import { filterPassengers } from '../utils/passengerUtils';

const SurvivalAnalysisPage: React.FC = () => {
  // 加载乘客数据
  const { passengers, loading, error } = usePassengerData();
  
  // 筛选状态管理
  const [filters, setFilters] = useState<FilterState>({
    survival: [],
    gender: [],
    pclass: [],
    ageGroup: [],
    familySize: [],
    fareGroup: [],
    embarked: [],
    ageRange: [0, 100],
    fareRange: [0, 512],
    searchText: ''
  });

  // 筛选后的乘客ID列表
  const [filteredPassengerIds, setFilteredPassengerIds] = useState<number[]>([]);

  // 应用筛选条件
  const applyFilters = (passengers: Passenger[], filters: FilterState): number[] => {
    return filterPassengers(passengers, filters).map(passenger => passenger.PassengerId);
  };

  // 计算当前筛选条件下的生存率
  const calculateSurvivalRate = (passengerIds: number[]): number => {
    if (passengerIds.length === 0) return 0;
    const filteredPassengers = passengers.filter(p => passengerIds.includes(p.PassengerId));
    const survivedCount = filteredPassengers.filter(p => p.Survived).length;
    return (survivedCount / filteredPassengers.length) * 100;
  };

  // 计算总体生存率
  const calculateOverallSurvivalRate = (): number => {
    if (passengers.length === 0) return 0;
    const survivedCount = passengers.filter(p => p.Survived).length;
    return (survivedCount / passengers.length) * 100;
  };

  // 当筛选条件或乘客数据变化时，重新应用筛选
  useEffect(() => {
    if (passengers.length > 0) {
      const filteredIds = applyFilters(passengers, filters);
      setFilteredPassengerIds(filteredIds);
    }
  }, [filters, passengers]);

  // 处理点点击事件
  const handlePointClick = (passengerId: number) => {
    const passenger = passengers.find(p => p.PassengerId === passengerId);
    console.log('点击乘客:', passenger);
    // 可以在这里实现选中乘客的详细显示功能
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">数据加载失败: {error}</div>
      </div>
    );
  }

  const currentSurvivalRate = calculateSurvivalRate(filteredPassengerIds);
  const overallSurvivalRate = calculateOverallSurvivalRate();
  const survivedCount = passengers.filter(p => 
    filteredPassengerIds.includes(p.PassengerId) && p.Survived
  ).length;
  const deathCount = filteredPassengerIds.length - survivedCount;

  return (
    <div className="survival-analysis-page p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">生存分析</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧：筛选面板 */}
        <div className="lg:col-span-1">
          <FilterPanel filters={filters} onFiltersChange={setFilters} />
        </div>
        
        {/* 右侧：主要内容区域 */}
        <div className="lg:col-span-3">
          {/* 统计信息 */}
          <SurvivalStats
            totalPassengers={filteredPassengerIds.length}
            survivedCount={survivedCount}
            deathCount={deathCount}
            survivalRate={currentSurvivalRate}
            overallSurvivalRate={overallSurvivalRate}
          />
          
          {/* 点阵可视化 */}
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">乘客分布</h3>
            <PassengerScatterPlot
              passengers={passengers}
              filteredPassengerIds={filteredPassengerIds}
              onPointClick={handlePointClick}
              width={800}
              height={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurvivalAnalysisPage;