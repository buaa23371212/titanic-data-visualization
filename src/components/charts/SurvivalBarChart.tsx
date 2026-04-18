import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { BaseChart, ChartTitle, ChartContainer, ChartLoading, ChartError } from './BaseChart';
import { DataChartProps, SurvivalChartData, chartUtils } from './ChartTypes';
import { usePassengerData } from '../../hooks/usePassengerData';
import { SurvivalChartCategory, CHART_CATEGORY_LABELS, CATEGORY_DETAIL_LABELS, CHART_TITLES, CHART_DEFAULTS, CHART_COLORS } from './constants';

interface SurvivalBarChartProps extends DataChartProps {
  category: SurvivalChartCategory;
  title?: string;
  subtitle?: string;
}

export const SurvivalBarChart: React.FC<SurvivalBarChartProps> = ({
  category,
  title,
  subtitle,
  width = CHART_DEFAULTS.width,
  height = CHART_DEFAULTS.height,
  margin = CHART_DEFAULTS.margin,
  theme = CHART_DEFAULTS.theme,
  onDataPointClick,
  onDataPointHover
}) => {
  const { summaryStats, loading, error } = usePassengerData();

  // 动态生成标题和副标题
  const chartTitle = title || CHART_TITLES[category].title;
  const chartSubtitle = subtitle || CHART_TITLES[category].subtitle;

  // 生成生存分析数据
  const chartData = useMemo(() => {
    if (!summaryStats || summaryStats.totalPassengers === 0) return [];
    
    return chartUtils.generateSurvivalData(summaryStats, category);
  }, [summaryStats, category]);

  if (loading) {
    return (
      <ChartContainer>
        <ChartTitle title={chartTitle} subtitle={chartSubtitle} theme={theme} />
        <ChartLoading />
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer>
        <ChartTitle title={chartTitle} subtitle={chartSubtitle} theme={theme} />
        <ChartError message={error} />
      </ChartContainer>
    );
  }

  if (chartData.length === 0) {
    return (
      <ChartContainer>
        <ChartTitle title={chartTitle} subtitle={chartSubtitle} theme={theme} />
        <ChartError message="暂无数据" />
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartTitle title={chartTitle} subtitle={chartSubtitle} theme={theme} />
      <SurvivalBarChartContent
        data={chartData}
        width={width}
        height={height}
        margin={margin}
        theme={theme}
        category={category}
        onDataPointClick={onDataPointClick}
        onDataPointHover={onDataPointHover}
      />
    </ChartContainer>
  );
};

// 图表内容组件
const SurvivalBarChartContent: React.FC<DataChartProps<SurvivalChartData> & { category: SurvivalChartCategory }> = ({
  data,
  width,
  height,
  margin,
  theme,
  category,
  onDataPointClick,
  onDataPointHover
}) => {
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // 颜色配置
  const colors = CHART_COLORS[theme];

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
        {/* 在每个柱子下面显示具体的类别名称 */}
        {data.map((d, i) => {
          const x = (xScale(d.category) || 0) + xScale.bandwidth() / 2;
          const y = margin.bottom - 20;
          const detailLabels = CATEGORY_DETAIL_LABELS[category];
          const label = detailLabels[d.category] || d.category;
          
          return (
            <text
              key={`label-${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="12"
              fill={colors.text}
              fontWeight="500"
            >
              {label}
            </text>
          );
        })}
      </g>
    );
  };

  // 生成Y轴
  const generateYAxis = () => {
    const axis = d3.axisLeft(yScale);
    return (
      <g>
        {axis.tickSize(0).tickPadding(10)(d3.select(document.createElement('g')))}
        {/* Y轴标签 */}
        <text
          x={-margin.left / 2}
          y={chartHeight / 2}
          textAnchor="middle"
          fontSize="12"
          fill={colors.text}
          fontWeight="500"
          transform={`rotate(-90, ${-margin.left / 2}, ${chartHeight / 2})`}
        >
          人数/人
        </text>
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