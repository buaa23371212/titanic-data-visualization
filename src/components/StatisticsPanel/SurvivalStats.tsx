import React from 'react';

interface SurvivalStatsProps {
  totalPassengers: number;
  survivedCount: number;
  deathCount: number;
  survivalRate: number;
  overallSurvivalRate: number;
}

const SurvivalStats: React.FC<SurvivalStatsProps> = ({
  totalPassengers,
  survivedCount,
  deathCount,
  survivalRate,
  overallSurvivalRate
}) => {
  const difference = survivalRate - overallSurvivalRate;
  
  return (
    <div className="survival-stats bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">统计信息</h3>
      
      {/* 统计指标网格 */}
      <div className="stats-grid grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <div className="stat-item text-center">
          <div className="stat-label text-xs text-gray-600 mb-1">筛选后总数</div>
          <div className="stat-value text-lg font-semibold text-gray-800">{totalPassengers}</div>
        </div>
        
        <div className="stat-item text-center">
          <div className="stat-label text-xs text-gray-600 mb-1">生存人数</div>
          <div className="stat-value text-lg font-semibold text-green-600">{survivedCount}</div>
        </div>
        
        <div className="stat-item text-center">
          <div className="stat-label text-xs text-gray-600 mb-1">死亡人数</div>
          <div className="stat-value text-lg font-semibold text-red-600">{deathCount}</div>
        </div>
        
        <div className="stat-item text-center">
          <div className="stat-label text-xs text-gray-600 mb-1">当前生存率</div>
          <div className="stat-value text-lg font-semibold text-blue-600">
            {survivalRate.toFixed(1)}%
          </div>
        </div>
        
        <div className="stat-item text-center">
          <div className="stat-label text-xs text-gray-600 mb-1">与总体对比</div>
          <div className={`stat-value text-lg font-semibold ${
            difference >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {difference >= 0 ? '+' : ''}{difference.toFixed(1)}%
          </div>
        </div>
      </div>
      
      {/* 生存率可视化进度条 */}
      <div className="survival-rate-bar">
        <div className="rate-labels flex justify-between text-xs text-gray-600 mb-2">
          <span>0%</span>
          <span>当前生存率: {survivalRate.toFixed(1)}%</span>
          <span>总体生存率: {overallSurvivalRate.toFixed(1)}%</span>
          <span>100%</span>
        </div>
        
        <div className="bar-container relative h-3 bg-gray-200 rounded-full overflow-hidden">
          {/* 总体生存率标记 */}
          <div 
            className="overall-rate-marker absolute top-0 w-0.5 h-3 bg-gray-800"
            style={{ left: `${overallSurvivalRate}%` }}
            title={`总体生存率: ${overallSurvivalRate.toFixed(1)}%`}
          />
          
          {/* 当前生存率填充 */}
          <div 
            className="current-rate-fill h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-300"
            style={{ width: `${survivalRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SurvivalStats;