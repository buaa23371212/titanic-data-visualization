import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { BaseChart, ChartTitle, ChartContainer, ChartLoading, ChartError } from './BaseChart';
import { DataChartProps, DistributionChartData, chartUtils } from '../../types/ChartTypes';
import { usePassengerData } from '../../hooks/usePassengerData';
import { CHART_DEFAULTS, CHART_COLORS } from '../../utils/constants';

interface FamilyStructureChartProps extends DataChartProps {
  title?: string;
  subtitle?: string;
}

export const FamilyStructureChart: React.FC<FamilyStructureChartProps> = ({
  title = '家庭结构分析',
  subtitle = '乘客家庭规模分布情况',
  width = CHART_DEFAULTS.width,
  height = CHART_DEFAULTS.height,
  margin = CHART_DEFAULTS.margin,
  theme = CHART_DEFAULTS.theme,
  onDataPointClick,
  onDataPointHover
}) => {
  const { passengers, loading, error } = usePassengerData();

  // 生成家庭结构数据
  const chartData = useMemo(() => {
    if (!passengers || passengers.length === 0) return [];
    
    // 统计不同家庭规模的人数
    const familySizeData = {
      '独自旅行': 0,
      '小型家庭': 0,
      '大型家庭': 0
    };
    
    passengers.forEach(passenger => {
      switch (passenger.FamilySizeGroup) {
        case 'Solo':
          familySizeData['独自旅行']++;
          break;
        case 'Small':
          familySizeData['小型家庭']++;
          break;
        case 'Large':
          familySizeData['大型家庭']++;
          break;
      }
    });
    
    return Object.entries(familySizeData).map(([label, value]) => ({
      label,
      value,
      percentage: value / passengers.length
    }));
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
        <ChartError message="暂无家庭结构数据" />
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartTitle title={title} subtitle={subtitle} theme={theme} />
      <FamilyStructureChartContent
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

// 饼图内容组件
const FamilyStructureChartContent: React.FC<DataChartProps<DistributionChartData>> = ({
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
  const radius = Math.min(chartWidth, chartHeight) / 2;

  // 颜色配置
  const colors = CHART_COLORS[theme];
  
  // 饼图颜色
  const pieColors = [
    '#3b82f6', // 蓝色 - 独自旅行
    '#10b981', // 绿色 - 小型家庭
    '#f59e0b'  // 橙色 - 大型家庭
  ];

  // 创建饼图生成器
  const pie = d3.pie<DistributionChartData>()
    .value(d => d.value)
    .sort(null);

  // 创建弧生成器
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  // 创建标签弧生成器（用于显示标签）
  const labelArc = d3.arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius * 0.6);

  // 生成饼图
  const generatePie = () => {
    const pieData = pie(data);
    
    return pieData.map((slice, index) => {
      const arcPath = arc(slice);
      const labelPosition = labelArc.centroid(slice);
      const percentage = ((slice.endAngle - slice.startAngle) / (2 * Math.PI) * 100).toFixed(1);
      
      return (
        <g key={slice.data.label} transform={`translate(${chartWidth / 2}, ${chartHeight / 2})`}>
          {/* 饼图扇形 */}
          <path
            d={arcPath || ''}
            fill={pieColors[index % pieColors.length]}
            opacity={0.8}
            stroke={colors.background}
            strokeWidth={2}
            cursor="pointer"
            onMouseEnter={(e) => onDataPointHover?.(slice.data, e)}
            onMouseLeave={(e) => onDataPointHover?.(null, e)}
            onClick={(e) => onDataPointClick?.(slice.data, e)}
          />
          
          {/* 百分比标签 */}
          {slice.data.value > 0 && (
            <text
              x={labelPosition[0]}
              y={labelPosition[1]}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fill={colors.text}
              fontWeight="600"
            >
              {percentage}%
            </text>
          )}
        </g>
      );
    });
  };

  // 生成图例
  const generateLegend = () => {
    return data.map((item, index) => (
      <g key={item.label} transform={`translate(${chartWidth - 120}, ${index * 25})`}>
        {/* 图例颜色方块 */}
        <rect
          x={0}
          y={0}
          width={15}
          height={15}
          fill={pieColors[index % pieColors.length]}
          rx={2}
        />
        {/* 图例文本 */}
        <text
          x={25}
          y={12}
          fontSize="11"
          fill={colors.text}
          fontWeight="500"
        >
          {item.label} ({item.value}人)
        </text>
      </g>
    ));
  };

  return (
    <BaseChart width={width} height={height} margin={margin} theme={theme}>
      {/* 饼图 */}
      {generatePie()}
      
      {/* 图例 */}
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {generateLegend()}
      </g>
      
      {/* 中心标题 */}
      <g transform={`translate(${chartWidth / 2}, ${chartHeight / 2})`}>
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fill={colors.text}
          fontWeight="600"
          opacity={0.8}
        >
          家庭规模
        </text>
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fill={colors.text}
          fontWeight="400"
          opacity={0.6}
          dy={20}
        >
          分布情况
        </text>
      </g>
    </BaseChart>
  );
};