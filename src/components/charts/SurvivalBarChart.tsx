import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { BaseChart, ChartTitle, ChartContainer, ChartLoading, ChartError } from './BaseChart';
import { DataChartProps, SurvivalChartData, chartUtils } from '../../types/ChartTypes';
import { usePassengerData } from '../../hooks/usePassengerData';
import { SurvivalChartCategory, CHART_CATEGORY_LABELS, CATEGORY_DETAIL_LABELS, CHART_TITLES, CHART_DEFAULTS, CHART_COLORS } from '../../utils/constants';

interface SurvivalBarChartProps extends DataChartProps {
  category: SurvivalChartCategory;
  title?: string;
  subtitle?: string;
  selectedCategory?: string | null;
  onCategorySelect?: (category: string | null) => void;
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
  onDataPointHover,
  selectedCategory,
  onCategorySelect
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
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
      />
    </ChartContainer>
  );
};

// 图表内容组件
const SurvivalBarChartContent: React.FC<DataChartProps<SurvivalChartData> & { 
  category: SurvivalChartCategory;
  selectedCategory?: string | null;
  onCategorySelect?: (category: string | null) => void;
}> = ({
  data,
  width,
  height,
  margin,
  theme,
  category,
  onDataPointClick,
  onDataPointHover,
  selectedCategory,
  onCategorySelect
}) => {
  const chartWidth = width - margin.left - margin.right - 40; // 为右侧生存率轴预留空间
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
    const isSelected = (category: string) => {
      return selectedCategory === category;
    };

    const selectedStyle = {
      stroke: '#ffffff',
      strokeWidth: 3,
      opacity: 1
    };

    const handleClick = (category: string, event: React.MouseEvent) => {
      event.stopPropagation();
      
      // 如果点击的是已选中的类别，则取消选择
      if (selectedCategory === category) {
        onCategorySelect?.(null);
      } else {
        onCategorySelect?.(category);
      }
      
      // 调用原有的数据点点击回调
      onDataPointClick?.(category, event);
    };

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
            {...(isSelected(d.category) ? selectedStyle : {})}
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
            {...(isSelected(d.category) ? selectedStyle : {})}
          />
          
          {/* 总数标签 - 显示在柱子顶部 */}
          <text
            x={barWidth / 2}
            y={yScale(d.total) - 8}
            textAnchor="middle"
            fontSize="10"
            fill={colors.text}
            fontWeight="bold"
            opacity={0.9}
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
    
    const handleLabelClick = (category: string, event: React.MouseEvent) => {
      event.stopPropagation();
      
      // 如果点击的是已选中的类别，则取消选择
      if (selectedCategory === category) {
        onCategorySelect?.(null);
      } else {
        onCategorySelect?.(category);
      }
    };
    
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
              style={{ cursor: 'pointer' }}
              onClick={(e) => handleLabelClick(d.category, e)}
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

  // 生成右侧生存率Y轴
  const generateRateAxis = () => {
    const ticks = [0, 0.25, 0.5, 0.75, 1];
    
    return (
      <g transform={`translate(${chartWidth}, 0)`}>
        {/* 生存率轴刻度线 */}
        {ticks.map((tick, i) => (
          <g key={i}>
            
            <text
              x={10}
              y={rateScale(tick)}
              textAnchor="start"
              dominantBaseline="middle"
              fontSize="10"
              fill={colors.text}
              opacity={0.8}
            >
              {Math.round(tick * 100)}%
            </text>
          </g>
        ))}
        
        {/* 生存率轴标签 */}
        <text
          x={margin.right / 2 + 20}
          y={chartHeight / 2 - 10}
          textAnchor="middle"
          fontSize="12"
          fill={colors.text}
          fontWeight="500"
          transform={`rotate(90, ${margin.right / 2 + 20}, ${chartHeight / 2})`}
        >
          生存率
        </text>
      </g>
    );
  };

  // 生成生存率折线
  const generateRateLine = () => {
    const lineGenerator = d3.line<SurvivalChartData>()
      .x(d => (xScale(d.category) || 0) + xScale.bandwidth() / 2)
      .y(d => rateScale(d.rate))
      .curve(d3.curveMonotoneX);
    
    const linePath = lineGenerator(data);
    
    if (!linePath) return null;
    
    return (
      <g>
        {/* 折线 */}
        <path
          d={linePath}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth={2}
          strokeDasharray="5,5"
        />
        
        {/* 数据点 */}
        {data.map((d, i) => {
          const x = (xScale(d.category) || 0) + xScale.bandwidth() / 2;
          const y = rateScale(d.rate);
          
          return (
            <g key={`point-${i}`}>
              {/* 数据点圆圈 */}
              <circle
                cx={x}
                cy={y}
                r={4}
                fill="#8b5cf6"
                stroke="white"
                strokeWidth={2}
              />
              
              {/* 数据点标签 */}
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                fontSize="10"
                fill="#8b5cf6"
                fontWeight="bold"
              >
                {chartUtils.formatPercentage(d.rate)}
              </text>
            </g>
          );
        })}
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
      
      {/* 生存率折线 */}
      {generateRateLine()}
      
      {/* 坐标轴 */}
      {generateXAxis()}
      {generateYAxis()}
      {generateRateAxis()}
      
      {/* 图例 - 更新位置并添加折线图例 */}
      <g transform={`translate(${chartWidth - 120}, -40)`}>
        <rect x={10} y={0} width={12} height={12} fill={colors.survived} />
        <text x={28} y={10} fontSize="12" fill={colors.text}>生存</text>
        
        <rect x={60} y={0} width={12} height={12} fill={colors.notSurvived} />
        <text x={78} y={10} fontSize="12" fill={colors.text}>未生存</text>
        
        {/* 折线图例 */}
        <line x1={-60} x2={-40} y1={6} y2={6} stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5,5" />
        <circle cx={-50} cy={6} r={3} fill="#8b5cf6" stroke="white" strokeWidth={1} />
        <text x={-42} y={10} fontSize="12" fill="#8b5cf6">生存率</text>
      </g>
    </BaseChart>
  );
};