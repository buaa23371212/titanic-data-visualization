import React, { useState } from 'react';
import { SurvivalBarChart } from './components/charts/SurvivalBarChart';
import { usePassengerData } from './hooks/usePassengerData';
import { SummaryStats } from './types/passenger';
import { AgeDistributionChart } from './components/charts/AgeDistributionChart';
import { FamilyStructureChart } from './components/charts/FamilyStructureChart';
import { Header } from './components/layout/Header';
import { Loading } from './components/common/Loading';
import { Card, CardContainer } from './components/common/Card';
import { PortDistributionMap } from './components/charts/PortDistributionMap';

// 仪表盘组件
export default function App() {
  const { summaryStats, loading, error } = usePassengerData();
  const [activeTab, setActiveTab] = useState<'overview' | 'survival' | 'demographics' | 'geographic'>('overview');

  if (loading) {
    return <Loading message="加载泰坦尼克号数据中..." />;
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
    <div className="main-content-backdrop">
      <Header 
        summaryStats={summaryStats} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
          {activeTab === 'overview' && <OverviewDashboard summaryStats={summaryStats} />}
          {activeTab === 'survival' && <SurvivalAnalysis />}
          {activeTab === 'demographics' && <DemographicsAnalysis />}
          {activeTab === 'geographic' && <GeographicAnalysis />}
        </div>
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
        <Card
          title="总乘客数"
          value={summaryStats.totalPassengers}
          icon="👥"
          color="blue"
        />
        <Card
          title="生存人数"
          value={summaryStats.totalSurvived}
          icon="✅"
          color="green"
        />
        <Card
          title="总体生存率"
          value={(summaryStats.survivalRate * 100).toFixed(1) + '%'}
          icon="📈"
          color="green"
        />
        <Card
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
        <CardContainer>
          <AgeDistributionChart
            title="年龄分布直方图"
            subtitle="乘客年龄分布情况"
            width={500}
            height={350}
          />
        </CardContainer>
        <CardContainer>
          <FamilyStructureChart
            title="家庭结构分析"
            subtitle="乘客家庭结构分布"
            width={500}
            height={350}
          />
        </CardContainer>
      </div>
    </div>
  );
}

// 地理分析页面
function GeographicAnalysis() {
  const { passengers, summaryStats } = usePassengerData();
  
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
        <CardContainer title="港口分布地图">
          <PortDistributionMap 
            passengers={passengers}
            portStats={summaryStats?.byEmbarked}
          />
        </CardContainer>
      </div>
    </div>
  );
}