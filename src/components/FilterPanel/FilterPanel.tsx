import React from 'react';
import { FilterState } from '../../types/passenger';
import {
  SURVIVAL_FILTERS,
  GENDER_FILTERS,
  PCLASS_FILTERS,
  AGE_GROUP_FILTERS,
  FAMILY_SIZE_FILTERS,
  FARE_GROUP_FILTERS,
  EMBARKED_FILTERS,
  FILTER_LABELS
} from '../../utils/filterConstants';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

// 范围滑块组件
const RangeSlider: React.FC<{
  label: string;
  value: [number, number];
  min: number;
  max: number;
  onChange: (value: [number, number]) => void;
}> = ({ label, value, min, max, onChange }) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), value[1]);
    onChange([newMin, value[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), value[0]);
    onChange([value[0], newMax]);
  };

  return (
    <div className="filter-group mb-3">
      <label className="block text-xs text-gray-600 mb-2">{label}</label>
      <div className="flex items-center space-x-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={handleMinChange}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={handleMaxChange}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{value[0]}</span>
        <span>{value[1]}</span>
      </div>
    </div>
  );
};

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange }) => {
  // 筛选选项 - 使用统一常量
  const survivalOptions = [
    { label: FILTER_LABELS.SURVIVAL.SURVIVED, value: SURVIVAL_FILTERS.SURVIVED },
    { label: FILTER_LABELS.SURVIVAL.DIED, value: SURVIVAL_FILTERS.DIED }
  ];

  const genderOptions = [
    { label: FILTER_LABELS.GENDER.MALE, value: GENDER_FILTERS.MALE },
    { label: FILTER_LABELS.GENDER.FEMALE, value: GENDER_FILTERS.FEMALE }
  ];

  const pclassOptions = [
    { label: FILTER_LABELS.PCLASS.FIRST, value: PCLASS_FILTERS.FIRST },
    { label: FILTER_LABELS.PCLASS.SECOND, value: PCLASS_FILTERS.SECOND },
    { label: FILTER_LABELS.PCLASS.THIRD, value: PCLASS_FILTERS.THIRD }
  ];

  const ageGroupOptions = [
    { label: FILTER_LABELS.AGE_GROUP.CHILD, value: AGE_GROUP_FILTERS.CHILD },
    { label: FILTER_LABELS.AGE_GROUP.TEEN, value: AGE_GROUP_FILTERS.TEEN },
    { label: FILTER_LABELS.AGE_GROUP.ADULT, value: AGE_GROUP_FILTERS.ADULT },
    { label: FILTER_LABELS.AGE_GROUP.SENIOR, value: AGE_GROUP_FILTERS.SENIOR }
  ];

  const familySizeOptions = [
    { label: FILTER_LABELS.FAMILY_SIZE.SOLO, value: FAMILY_SIZE_FILTERS.SOLO },
    { label: FILTER_LABELS.FAMILY_SIZE.SMALL, value: FAMILY_SIZE_FILTERS.SMALL },
    { label: FILTER_LABELS.FAMILY_SIZE.LARGE, value: FAMILY_SIZE_FILTERS.LARGE }
  ];

  const fareGroupOptions = [
    { label: FILTER_LABELS.FARE_GROUP.LOW, value: FARE_GROUP_FILTERS.LOW },
    { label: FILTER_LABELS.FARE_GROUP.MEDIUM, value: FARE_GROUP_FILTERS.MEDIUM },
    { label: FILTER_LABELS.FARE_GROUP.HIGH, value: FARE_GROUP_FILTERS.HIGH }
  ];

  const embarkedOptions = [
    { label: FILTER_LABELS.EMBARKED.CHERBOURG, value: EMBARKED_FILTERS.CHERBOURG },
    { label: FILTER_LABELS.EMBARKED.QUEENSTOWN, value: EMBARKED_FILTERS.QUEENSTOWN },
    { label: FILTER_LABELS.EMBARKED.SOUTHAMPTON, value: EMBARKED_FILTERS.SOUTHAMPTON }
  ];

  // 调试：输出当前filter状态
  console.log('当前筛选状态:', {
    survival: filters.survival,
    gender: filters.gender,
    pclass: filters.pclass,
    ageGroup: filters.ageGroup,
    familySize: filters.familySize,
    fareGroup: filters.fareGroup,
    embarked: filters.embarked,
    ageRange: filters.ageRange,
    fareRange: filters.fareRange,
    searchText: filters.searchText
  });

  // 处理多选过滤器变化
  const handleMultiSelectChange = (filterKey: keyof FilterState, value: string) => {
    const currentValues = filters[filterKey] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    // 调试：输出变化信息
    console.log(`筛选器变化: ${filterKey}`, {
      原值: currentValues,
      新值: newValues,
      操作: currentValues.includes(value) ? '移除' : '添加',
      值: value
    });
    
    onFiltersChange({
      ...filters,
      [filterKey]: newValues
    });
  };

  // 处理范围滑块变化
  const handleRangeChange = (filterKey: 'ageRange' | 'fareRange', value: [number, number]) => {
    // 调试：输出范围变化信息
    console.log(`范围滑块变化: ${filterKey}`, {
      原范围: filters[filterKey],
      新范围: value
    });
    
    onFiltersChange({
      ...filters,
      [filterKey]: value
    });
  };

  // 处理搜索文本变化
  const handleSearchChange = (text: string) => {
    // 调试：输出搜索文本变化信息
    console.log('搜索文本变化:', {
      原文本: filters.searchText,
      新文本: text
    });
    
    onFiltersChange({
      ...filters,
      searchText: text
    });
  };

  // 清除所有筛选条件
  const handleClearFilters = () => {
    onFiltersChange({
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
  };

  return (
    <div className="filter-panel bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">筛选条件</h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          清除所有
        </button>
      </div>

      {/* 基础维度筛选 */}
      <div className="filter-section mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">基础维度</h4>
        
        {/* 生存状态 */}
        <div className="filter-group mb-3">
          <label className="block text-xs text-gray-600 mb-1">生存状态</label>
          <div className="flex flex-wrap gap-2">
            {survivalOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleMultiSelectChange('survival', option.value)}
                className={`px-3 py-1 text-xs rounded-full border ${
                  filters.survival.includes(option.value)
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 性别 */}
        <div className="filter-group mb-3">
          <label className="block text-xs text-gray-600 mb-1">性别</label>
          <div className="flex flex-wrap gap-2">
            {genderOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleMultiSelectChange('gender', option.value)}
                className={`px-3 py-1 text-xs rounded-full border ${
                  filters.gender.includes(option.value)
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 舱位等级 */}
        <div className="filter-group mb-3">
          <label className="block text-xs text-gray-600 mb-1">舱位等级</label>
          <div className="flex flex-wrap gap-2">
            {pclassOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleMultiSelectChange('pclass', option.value)}
                className={`px-3 py-1 text-xs rounded-full border ${
                  filters.pclass.includes(option.value)
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 人口统计维度 */}
      <div className="filter-section mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">人口统计</h4>
        
        {/* 年龄分组 */}
        <div className="filter-group mb-3">
          <label className="block text-xs text-gray-600 mb-1">年龄分组</label>
          <div className="flex flex-wrap gap-2">
            {ageGroupOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleMultiSelectChange('ageGroup', option.value)}
                className={`px-3 py-1 text-xs rounded-full border ${
                  filters.ageGroup.includes(option.value)
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 家庭规模 */}
        <div className="filter-group mb-3">
          <label className="block text-xs text-gray-600 mb-1">家庭规模</label>
          <div className="flex flex-wrap gap-2">
            {familySizeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleMultiSelectChange('familySize', option.value)}
                className={`px-3 py-1 text-xs rounded-full border ${
                  filters.familySize.includes(option.value)
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 社会经济维度 */}
      <div className="filter-section mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">社会经济</h4>
        
        {/* 票价分组 */}
        <div className="filter-group mb-3">
          <label className="block text-xs text-gray-600 mb-1">票价分组</label>
          <div className="flex flex-wrap gap-2">
            {fareGroupOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleMultiSelectChange('fareGroup', option.value)}
                className={`px-3 py-1 text-xs rounded-full border ${
                  filters.fareGroup.includes(option.value)
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 登船港口 */}
        <div className="filter-group mb-3">
          <label className="block text-xs text-gray-600 mb-1">登船港口</label>
          <div className="flex flex-wrap gap-2">
            {embarkedOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleMultiSelectChange('embarked', option.value)}
                className={`px-3 py-1 text-xs rounded-full border ${
                  filters.embarked.includes(option.value)
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 高级筛选 */}
      <div className="filter-section mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">高级筛选</h4>
        
        {/* 年龄范围滑块 */}
        <RangeSlider
          label="年龄范围"
          value={filters.ageRange}
          min={0}
          max={100}
          onChange={(value) => handleRangeChange('ageRange', value)}
        />
        
        {/* 票价范围滑块 */}
        <RangeSlider
          label="票价范围"
          value={filters.fareRange}
          min={0}
          max={512}
          onChange={(value) => handleRangeChange('fareRange', value)}
        />
        
        {/* 搜索框 */}
        <div className="filter-group mb-3">
          <label className="block text-xs text-gray-600 mb-1">姓名搜索</label>
          <input
            type="text"
            value={filters.searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="输入乘客姓名..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
export type { FilterState };