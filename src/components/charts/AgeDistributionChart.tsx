import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { BaseChart, ChartTitle, ChartContainer, ChartLoading, ChartError } from './BaseChart';
import { DataChartProps, DistributionChartData, chartUtils } from './ChartTypes';
import { usePassengerData } from '../../hooks/usePassengerData';
import { CHART_DEFAULTS, CHART_COLORS } from './constants';

interface AgeDistributionChartProps extends DataChartProps {
  title?: string;
  subtitle?: string;
}

export const AgeDistributionChart: React.FC<AgeDistributionChartProps> = ({
  title = '年龄分布直方图',
  subtitle = '乘客年龄分布情况',
  width = CHART_DEFAULTS.width,
  height = CHART_DEFAULTS.height,
  margin = CHART_DEFAULTS.margin,
  theme = CHART_DEFAULTS.theme,
  onDataPointClick,
  onDataPointHover
}) => {
  const { passengers, loading, error } = usePassengerData();

  // 生成年龄分布数据
  const chartData = useMemo(() => {
    if (!passengers || passengers.length === 0) return [];
    
    // 过滤掉年龄缺失的数据
    const validAges = passengers
      .filter(p => p.Age_original !== null && p.Age_original !== undefined)
      .map(p => p.Age_original as number);
    
    if (validAges.length === 0) return [];
    
    // 创建直方图分组
    const ageBins = d3.bin()
      .domain([0, 80]) // 年龄范围：0-80岁
      .thresholds(16) // 16个分组
      (validAges);
    
    return ageBins.map((bin, index, array) => {
      // 计算每个柱子的横轴标签：显示区间的起始值
      const axisLabel = index === 0 ? '0' : `${bin.x0}`;
      
      return {
        label: `${bin.x0}-${bin.x1}岁`,
        value: bin.length,
        percentage: bin.length / validAges.length,
        binStart: bin.x0 || 0,
        binEnd: bin.x1 || 0,
        axisLabel: axisLabel
      };
    });
  }, [passengers]);

  if (loading) {
    return (
      <ChartContainer>
        <ChartTitle title={title} subtitle={subtitle} theme={theme} />
        <ChartLoading />
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer>
        <ChartTitle title={title} subtitle={subtitle} theme={theme} />
        <ChartError message={error} />
      </ChartContainer>
    );
  }

  if (chartData.length === 0) {
    return (
      <ChartContainer>
        <ChartTitle title={title} subtitle={subtitle} theme={theme} />
        <ChartError message="暂无年龄数据" />
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartTitle title={title} subtitle={subtitle} theme={theme} />
      <AgeDistributionChartContent
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
const AgeDistributionChartContent: React.FC<DataChartProps<DistributionChartData>> = ({
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
  const colors = CHART_COLORS[theme];

  // 创建比例尺 - 使用线性比例尺来显示具体的年龄值
  const xScale = d3.scaleLinear()
    .domain([0, 80]) // 年龄范围：0-80岁
    .range([0, chartWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value) || 100])
    .range([chartHeight, 0])
    .nice();

  // 生成柱状图
  const generateBars = () => {
    return data.map((d, i) => {
      // 计算柱子的位置和宽度
      const barWidth = chartWidth / data.length;
      const x = xScale(d.binStart);
      const barHeight = chartHeight - yScale(d.value);
      
      return (
        <g key={d.label} transform={`translate(${x}, 0)`}>
          <rect
            width={barWidth}
            height={barHeight}
            y={yScale(d.value)}
            fill={colors.survived}
            opacity={0.8}
            cursor="pointer"
            onMouseEnter={(e) => onDataPointHover?.(d, e)}
            onMouseLeave={(e) => onDataPointHover?.(null, e)}
            onClick={(e) => onDataPointClick?.(d, e)}
          />
          
          {/* 数值标签 */}
          {d.value > 0 && (
            <text
              x={barWidth / 2}
              y={yScale(d.value) - 5}
              textAnchor="middle"
              fontSize="10"
              fill={colors.text}
              fontWeight="500"
            >
              {d.value}
            </text>
          )}
        </g>
      );
    });
  };

  // 生成X轴 - 在每个柱子之间显示具体的年龄值
  const generateXAxis = () => {
    // 生成年龄刻度，包括每个区间的起始值
    const ageTicks = data.map(d => d.binStart);
    // 添加最后一个区间的结束值
    if (data.length > 0) {
      ageTicks.push(data[data.length - 1].binEnd);
    }
    
    return (
      <g transform={`translate(0, ${chartHeight})`}>
        {/* 横轴线 */}
        <line
          x1={0}
          x2={chartWidth}
          y1={0}
          y2={0}
          stroke={colors.text}
          strokeWidth={1}
        />
        
        {/* 年龄刻度标签 */}
        {ageTicks.map((age, index) => {
          const x = xScale(age);
          return (
            <g key={index}>
              {/* 刻度线 */}
              <line
                x1={x}
                x2={x}
                y1={0}
                y2={5}
                stroke={colors.text}
                strokeWidth={1}
              />
              {/* 年龄标签 */}
              <text
                x={x}
                y={20}
                textAnchor="middle"
                fontSize="10"
                fill={colors.text}
                fontWeight="500"
              >
                {age}
              </text>
            </g>
          );
        })}
        
        {/* X轴标题 */}
        <text
          x={chartWidth / 2}
          y={margin.bottom - 10}
          textAnchor="middle"
          fontSize="12"
          fill={colors.text}
          fontWeight="500"
        >
          年龄/岁
        </text>
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
      
      {/* 坐标轴 */}
      {generateXAxis()}
      {generateYAxis()}
      
      {/* 统计信息 */}
      <g transform={`translate(${chartWidth - 150}, -20)`}>
        <text
          x={0}
          y={15}
          fontSize="12"
          fill={colors.text}
          fontWeight="500"
        >
          总人数: {data.reduce((sum, d) => sum + d.value, 0)}
        </text>
        <text
          x={0}
          y={30}
          fontSize="12"
          fill={colors.text}
          fontWeight="500"
        >
          分组数: {data.length}
        </text>
      </g>
    </BaseChart>
  );
};