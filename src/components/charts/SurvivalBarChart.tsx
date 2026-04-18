import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { BaseChart, ChartTitle, ChartContainer, ChartLoading, ChartError } from './BaseChart';
import { DataChartProps, SurvivalChartData, chartUtils } from './ChartTypes';
import { usePassengerData } from '../../hooks/usePassengerData';

interface SurvivalBarChartProps extends DataChartProps {
  category: 'byClass' | 'bySex' | 'byAgeGroup' | 'byFareGroup' | 'byEmbarked' | 'byFamilySize';
  title?: string;
  subtitle?: string;
}

export const SurvivalBarChart: React.FC<SurvivalBarChartProps> = ({
  category,
  title,
  subtitle,
  width = 600,
  height = 400,
  margin = { top: 40, right: 30, bottom: 60, left: 80 },
  theme = 'light',
  onDataPointClick,
  onDataPointHover
}) => {
  const { summaryStats, loading, error } = usePassengerData();

  // 生成生存分析数据
  const chartData = useMemo(() => {
    if (!summaryStats || summaryStats.totalPassengers === 0) return [];
    
    return chartUtils.generateSurvivalData(summaryStats, category);
  }, [summaryStats, category]);

  if (loading) {
    return (
      <ChartContainer>
        {title && <ChartTitle title={title} subtitle={subtitle} theme={theme} />}
        <ChartLoading />
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer>
        {title && <ChartTitle title={title} subtitle={subtitle} theme={theme} />}
        <ChartError message={error} />
      </ChartContainer>
    );
  }

  if (chartData.length === 0) {
    return (
      <ChartContainer>
        {title && <ChartTitle title={title} subtitle={subtitle} theme={theme} />}
        <ChartError message="暂无数据" />
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      {title && <ChartTitle title={title} subtitle={subtitle} theme={theme} />}
      <SurvivalBarChartContent
        data={chartData}
        width={width}
        height={height}
        margin={margin}
        theme={theme}
        onDataPointClick={onDataPointClick}
        onDataPointHover={onDataPointHover}
      />
    </ChartContainer>
  );
};

// 图表内容组件
const SurvivalBarChartContent: React.FC<DataChartProps<SurvivalChartData>> = ({
  data,
  width,
  height,
  margin,
  theme,
  onDataPointClick,
  onDataPointHover
}) => {
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // 颜色配置
  const colors = {
    survived: theme === 'light' ? '#10b981' : '#34d399',
    notSurvived: theme === 'light' ? '#ef4444' : '#f87171',
    background: theme === 'light' ? '#ffffff' : '#1f2937',
    grid: theme === 'light' ? '#e5e7eb' : '#374151',
    text: theme === 'light' ? '#1f2937' : '#f9fafb'
  };

  // 创建比例尺
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.category))
    .range([0, chartWidth])
    .padding(0.3);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.total) || 100])
    .range([chartHeight, 0])
    .nice();

  const rateScale = d3.scaleLinear()
    .domain([0, 1])
    .range([chartHeight, 0]);

  // 生成生存率标签
  const generateRateLabels = () => {
    return data.map((d, i) => {
      const x = (xScale(d.category) || 0) + xScale.bandwidth() / 2;
      const y = rateScale(d.rate) - 5;
      
      return (
        <text
          key={`rate-${i}`}
          x={x}
          y={y}
          textAnchor="middle"
          fontSize="12"
          fill={colors.text}
          fontWeight="bold"
        >
          {chartUtils.formatPercentage(d.rate)}
        </text>
      );
    });
  };

  // 生成柱状图
  const generateBars = () => {
    return data.map((d, i) => {
      const x = xScale(d.category);
      const barWidth = xScale.bandwidth();
      const survivedHeight = chartHeight - yScale(d.survived);
      const notSurvivedHeight = chartHeight - yScale(d.total - d.survived);
      const notSurvivedY = yScale(d.total);

      return (
        <g key={d.category} transform={`translate(${x}, 0)`}>
          {/* 未生存部分 */}
          <rect
            width={barWidth}
            height={notSurvivedHeight}
            y={notSurvivedY}
            fill={colors.notSurvived}
            opacity={0.7}
            cursor="pointer"
            onMouseEnter={(e) => onDataPointHover?.(d, e)}
            onMouseLeave={(e) => onDataPointHover?.(null, e)}
            onClick={(e) => onDataPointClick?.(d, e)}
          />
          
          {/* 生存部分 */}
          <rect
            width={barWidth}
            height={survivedHeight}
            y={yScale(d.survived)}
            fill={colors.survived}
            opacity={0.9}
            cursor="pointer"
            onMouseEnter={(e) => onDataPointHover?.(d, e)}
            onMouseLeave={(e) => onDataPointHover?.(null, e)}
            onClick={(e) => onDataPointClick?.(d, e)}
          />
          
          {/* 总数标签 */}
          <text
            x={barWidth / 2}
            y={-5}
            textAnchor="middle"
            fontSize="10"
            fill={colors.text}
            opacity={0.7}
          >
            {d.total}
          </text>
        </g>
      );
    });
  };

  // 生成X轴
  const generateXAxis = () => {
    const axis = d3.axisBottom(xScale);
    return (
      <g transform={`translate(0, ${chartHeight})`}>
        {axis.tickSize(0).tickPadding(10)(d3.select(document.createElement('g')))}
      </g>
    );
  };

  // 生成Y轴
  const generateYAxis = () => {
    const axis = d3.axisLeft(yScale);
    return (
      <g>
        {axis.tickSize(0).tickPadding(10)(d3.select(document.createElement('g')))}
      </g>
    );
  };

  // 生成网格线
  const generateGridLines = () => {
    const ticks = yScale.ticks(5);
    return ticks.map((tick, i) => (
      <g key={i}>
        <line
          x1={0}
          x2={chartWidth}
          y1={yScale(tick)}
          y2={yScale(tick)}
          stroke={colors.grid}
          strokeWidth={1}
          opacity={0.3}
        />
        <text
          x={-5}
          y={yScale(tick)}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize="10"
          fill={colors.text}
          opacity={0.6}
        >
          {tick}
        </text>
      </g>
    ));
  };

  return (
    <BaseChart width={width} height={height} margin={margin} theme={theme}>
      {/* 网格线 */}
      {generateGridLines()}
      
      {/* 柱状图 */}
      {generateBars()}
      
      {/* 生存率标签 */}
      {generateRateLabels()}
      
      {/* 坐标轴 */}
      {generateXAxis()}
      {generateYAxis()}
      
      {/* 图例 */}
      <g transform={`translate(${chartWidth - 120}, -20)`}>
        <rect x={0} y={0} width={12} height={12} fill={colors.survived} />
        <text x={18} y={10} fontSize="12" fill={colors.text}>生存</text>
        
        <rect x={60} y={0} width={12} height={12} fill={colors.notSurvived} />
        <text x={78} y={10} fontSize="12" fill={colors.text}>未生存</text>
      </g>
    </BaseChart>
  );
};