import React, { useState } from 'react';
import { SurvivalBarChart } from './components/charts/SurvivalBarChart';
import { usePassengerData } from './hooks/usePassengerData';
import { SummaryStats } from './types/passenger';

// 仪表盘组件
export default function App() {
  const { summaryStats, loading, error } = usePassengerData();
  const [activeTab, setActiveTab] = useState<'overview' | 'survival' | 'demographics' | 'geographic'>('overview');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载泰坦尼克号数据中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">数据加载失败</h1>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            刷新页面
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
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
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: '概览', icon: '📊' },
              { id: 'survival', label: '生存分析', icon: '🛟' },
              { id: 'demographics', label: '人口统计', icon: '👥' },
              { id: 'geographic', label: '地理分析', icon: '🌍' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewDashboard summaryStats={summaryStats} />}
        {activeTab === 'survival' && <SurvivalAnalysis />}
        {activeTab === 'demographics' && <DemographicsAnalysis />}
        {activeTab === 'geographic' && <GeographicAnalysis />}
      </main>
    </div>
  );
}

// 概览仪表盘
function OverviewDashboard({ summaryStats }: { summaryStats?: SummaryStats }) {
  if (!summaryStats) return null;

  return (
    <div className="space-y-6">
      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="总乘客数"
          value={summaryStats.totalPassengers}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="生存人数"
          value={summaryStats.totalSurvived}
          icon="✅"
          color="green"
        />
        <StatCard
          title="总体生存率"
          value={(summaryStats.survivalRate * 100).toFixed(1) + '%'}
          icon="📈"
          color="green"
        />
        <StatCard
          title="平均年龄"
          value={summaryStats.averageAge.toFixed(1)}
          icon="👶"
          color="purple"
        />
      </div>

      {/* 生存分析图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SurvivalBarChart
          category="byClass"
          title="舱位等级 vs 生存率"
          subtitle="不同舱位等级的生存情况对比"
          width={500}
          height={300}
        />
        <SurvivalBarChart
          category="bySex"
          title="性别 vs 生存率"
          subtitle="男女乘客的生存情况对比"
          width={500}
          height={300}
        />
      </div>
    </div>
  );
}

// 生存分析页面
function SurvivalAnalysis() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SurvivalBarChart
          category="byClass"
          title="舱位等级 vs 生存率"
          subtitle="验证社会阶层对生存的影响"
          width={500}
          height={350}
        />
        <SurvivalBarChart
          category="bySex"
          title="性别 vs 生存率"
          subtitle="验证'妇女儿童优先'原则"
          width={500}
          height={350}
        />
        <SurvivalBarChart
          category="byAgeGroup"
          title="年龄分组 vs 生存率"
          subtitle="分析不同年龄段生存概率"
          width={500}
          height={350}
        />
        <SurvivalBarChart
          category="byFareGroup"
          title="票价分组 vs 生存率"
          subtitle="社会经济地位与生存关系"
          width={500}
          height={350}
        />
      </div>
    </div>
  );
}

// 人口统计分析页面
function DemographicsAnalysis() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">人口统计分析</h2>
        <p className="text-gray-600 dark:text-gray-400">年龄分布、家庭结构、票价分布等维度分析</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">年龄分布图表（开发中）</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            年龄分布直方图 - 待实现
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">家庭结构分析（开发中）</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            家庭结构饼图 - 待实现
          </div>
        </div>
      </div>
    </div>
  );
}

// 地理分析页面
function GeographicAnalysis() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">地理维度分析</h2>
        <p className="text-gray-600 dark:text-gray-400">登船港口分布、票价与港口关系分析</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SurvivalBarChart
          category="byEmbarked"
          title="登船港口 vs 生存率"
          subtitle="不同港口乘客的生存情况对比"
          width={500}
          height={350}
        />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">港口分布地图（开发中）</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            地理分布可视化 - 待实现
          </div>
        </div>
      </div>
    </div>
  );
}

// 统计卡片组件
function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}