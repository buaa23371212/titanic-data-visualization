import React from 'react';
import { SummaryStats } from '../../types/passenger';

interface HeaderProps {
  summaryStats?: SummaryStats;
  activeTab: 'overview' | 'survival' | 'demographics' | 'geographic';
  onTabChange: (tab: 'overview' | 'survival' | 'demographics' | 'geographic') => void;
}

export const Header: React.FC<HeaderProps> = ({ summaryStats, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview' as const, label: '概览', icon: '📊' },
    { id: 'survival' as const, label: '生存分析', icon: '🛟' },
    { id: 'demographics' as const, label: '人口统计', icon: '👥' },
    { id: 'geographic' as const, label: '地理分析', icon: '🌍' }
  ];

  return (
    <>
      {/* 头部 */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                泰坦尼克号数据可视化
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                乘客生存分析与统计可视化
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                总乘客数: {summaryStats?.totalPassengers || 0}
              </span>
              <span className="text-sm text-green-600 dark:text-green-400">
                生存率: {summaryStats ? (summaryStats.survivalRate * 100).toFixed(1) + '%' : '0%'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 导航标签 */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};