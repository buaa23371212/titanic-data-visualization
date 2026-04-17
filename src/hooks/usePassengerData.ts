import { useState, useEffect, useMemo } from 'react';
import { Passenger, ProcessedPassenger, SummaryStats, FilterState } from '@/types/passenger';

// 导入JSON数据文件
import processedData from '../data/processed/titanic_processed.json';

// 数据加载Hook
export const usePassengerData = () => {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    pclass: [],
    sex: [],
    ageRange: [0, 100],
    survived: null,
    embarked: []
  });

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 直接使用导入的JSON数据
        // 转换数据格式，确保类型安全
        const processedPassengers: Passenger[] = processedData.map((item: any) => ({
          ...item,
          // 确保数值字段正确转换
          Age: Number(item.Age),
          SibSp: Number(item.SibSp),
          Parch: Number(item.Parch),
          Fare: Number(item.Fare),
          // 处理可能的NaN值
          Cabin: item.Cabin === null || isNaN(item.Cabin) ? null : String(item.Cabin),
          // 确保枚举类型正确
          Embarked: item.Embarked as 'C' | 'Q' | 'S' | null,
          Sex: item.Sex as 'male' | 'female',
          Pclass: item.Pclass as 1 | 2 | 3,
          Survived: item.Survived as 0 | 1
        }));
        
        setPassengers(processedPassengers);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误');
        console.error('数据加载错误:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 计算筛选后的数据
  const filteredData = useMemo(() => {
    if (loading || error) return [];

    return passengers.filter(passenger => {
      // 舱位筛选
      if (filters.pclass.length > 0 && !filters.pclass.includes(passenger.Pclass)) {
        return false;
      }
      
      // 性别筛选
      if (filters.sex.length > 0 && !filters.sex.includes(passenger.Sex)) {
        return false;
      }
      
      // 年龄范围筛选
      if (passenger.Age < filters.ageRange[0] || passenger.Age > filters.ageRange[1]) {
        return false;
      }
      
      // 生存状态筛选
      if (filters.survived !== null && passenger.Survived !== (filters.survived ? 1 : 0)) {
        return false;
      }
      
      // 登船港口筛选
      if (filters.embarked.length > 0 && passenger.Embarked && !filters.embarked.includes(passenger.Embarked)) {
        return false;
      }
      
      return true;
    });
  }, [passengers, filters, loading, error]);

  // 计算数据摘要统计
  const summaryStats = useMemo((): SummaryStats => {
    if (loading || error || passengers.length === 0) {
      return {
        totalPassengers: 0,
        totalSurvived: 0,
        survivalRate: 0,
        byClass: { 1: { total: 0, survived: 0, rate: 0, label: 'First' }, 2: { total: 0, survived: 0, rate: 0, label: 'Second' }, 3: { total: 0, survived: 0, rate: 0, label: 'Third' } },
        bySex: { male: { total: 0, survived: 0, rate: 0, label: 'Male' }, female: { total: 0, survived: 0, rate: 0, label: 'Female' } },
        byAgeGroup: { Child: { total: 0, survived: 0, rate: 0 }, Teen: { total: 0, survived: 0, rate: 0 }, 'Young Adult': { total: 0, survived: 0, rate: 0 }, Adult: { total: 0, survived: 0, rate: 0 }, Senior: { total: 0, survived: 0, rate: 0 } },
        byFareGroup: { Low: { total: 0, survived: 0, rate: 0 }, Medium: { total: 0, survived: 0, rate: 0 }, High: { total: 0, survived: 0, rate: 0 }, 'Very High': { total: 0, survived: 0, rate: 0 } },
        byEmbarked: { C: { total: 0, survived: 0, rate: 0, label: 'Cherbourg' }, Q: { total: 0, survived: 0, rate: 0, label: 'Queenstown' }, S: { total: 0, survived: 0, rate: 0, label: 'Southampton' } },
        byFamilySize: { Solo: { total: 0, survived: 0, rate: 0 }, Small: { total: 0, survived: 0, rate: 0 }, Large: { total: 0, survived: 0, rate: 0 } },
        averageAge: 0,
        averageFare: 0,
        averageFamilySize: 0,
        hasCabinRate: 0,
        aloneRate: 0,
        titleDistribution: {}
      };
    }

    const data = filteredData.length > 0 ? filteredData : passengers;
    
    // 基础统计
    const totalPassengers = data.length;
    const totalSurvived = data.filter(p => p.Survived === 1).length;
    const survivalRate = totalPassengers > 0 ? totalSurvived / totalPassengers : 0;

    // 按舱位统计
    const byClass = {
      1: { total: 0, survived: 0, rate: 0, label: 'First' },
      2: { total: 0, survived: 0, rate: 0, label: 'Second' },
      3: { total: 0, survived: 0, rate: 0, label: 'Third' }
    };

    // 按性别统计
    const bySex = {
      male: { total: 0, survived: 0, rate: 0, label: 'Male' },
      female: { total: 0, survived: 0, rate: 0, label: 'Female' }
    };

    // 按年龄分组统计
    const byAgeGroup = {
      Child: { total: 0, survived: 0, rate: 0 },
      Teen: { total: 0, survived: 0, rate: 0 },
      'Young Adult': { total: 0, survived: 0, rate: 0 },
      Adult: { total: 0, survived: 0, rate: 0 },
      Senior: { total: 0, survived: 0, rate: 0 }
    };

    // 按票价分组统计
    const byFareGroup = {
      Low: { total: 0, survived: 0, rate: 0 },
      Medium: { total: 0, survived: 0, rate: 0 },
      High: { total: 0, survived: 0, rate: 0 },
      'Very High': { total: 0, survived: 0, rate: 0 },
      Unknown: { total: 0, survived: 0, rate: 0 }
    };

    // 按港口统计
    const byEmbarked = {
      C: { total: 0, survived: 0, rate: 0, label: 'Cherbourg' },
      Q: { total: 0, survived: 0, rate: 0, label: 'Queenstown' },
      S: { total: 0, survived: 0, rate: 0, label: 'Southampton' }
    };

    // 按家庭规模统计
    const byFamilySize = {
      Solo: { total: 0, survived: 0, rate: 0 },
      Small: { total: 0, survived: 0, rate: 0 },
      Large: { total: 0, survived: 0, rate: 0 }
    };

    // 计算各项统计
    data.forEach(passenger => {
      // 舱位统计
      byClass[passenger.Pclass].total++;
      if (passenger.Survived === 1) byClass[passenger.Pclass].survived++;

      // 性别统计
      bySex[passenger.Sex].total++;
      if (passenger.Survived === 1) bySex[passenger.Sex].survived++;

      // 年龄分组统计
      const ageGroup = passenger.AgeGroup;
      if (byAgeGroup[ageGroup]) {
        byAgeGroup[ageGroup].total++;
        if (passenger.Survived === 1) byAgeGroup[ageGroup].survived++;
      }

      // 票价分组统计
      const fareGroup = passenger.FareGroup;
      if (byFareGroup[fareGroup]) {
        byFareGroup[fareGroup].total++;
        if (passenger.Survived === 1) byFareGroup[fareGroup].survived++;
      }

      // 港口统计
      if (passenger.Embarked) {
        byEmbarked[passenger.Embarked].total++;
        if (passenger.Survived === 1) byEmbarked[passenger.Embarked].survived++;
      }

      // 家庭规模统计
      const familySizeGroup = passenger.FamilySizeGroup;
      if (byFamilySize[familySizeGroup]) {
        byFamilySize[familySizeGroup].total++;
        if (passenger.Survived === 1) byFamilySize[familySizeGroup].survived++;
      }
    });

    // 计算比率
    Object.values(byClass).forEach(group => {
      group.rate = group.total > 0 ? group.survived / group.total : 0;
    });
    Object.values(bySex).forEach(group => {
      group.rate = group.total > 0 ? group.survived / group.total : 0;
    });
    Object.values(byAgeGroup).forEach(group => {
      group.rate = group.total > 0 ? group.survived / group.total : 0;
    });
    Object.values(byFareGroup).forEach(group => {
      group.rate = group.total > 0 ? group.survived / group.total : 0;
    });
    Object.values(byEmbarked).forEach(group => {
      group.rate = group.total > 0 ? group.survived / group.total : 0;
    });
    Object.values(byFamilySize).forEach(group => {
      group.rate = group.total > 0 ? group.survived / group.total : 0;
    });

    // 计算平均值
    const averageAge = data.reduce((sum, p) => sum + p.Age, 0) / totalPassengers;
    const averageFare = data.reduce((sum, p) => sum + p.Fare, 0) / totalPassengers;
    const averageFamilySize = data.reduce((sum, p) => sum + p.FamilySize, 0) / totalPassengers;

    // 其他统计
    const hasCabinRate = data.filter(p => p.HasCabin === 1).length / totalPassengers;
    const aloneRate = data.filter(p => p.IsAlone === 1).length / totalPassengers;
    
    // 称谓分布
    const titleDistribution = data.reduce((acc, p) => {
      acc[p.Title] = (acc[p.Title] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPassengers,
      totalSurvived,
      survivalRate,
      byClass,
      bySex,
      byAgeGroup,
      byFareGroup,
      byEmbarked,
      byFamilySize,
      averageAge,
      averageFare,
      averageFamilySize,
      hasCabinRate,
      aloneRate,
      titleDistribution
    };
  }, [passengers, filteredData, loading, error]);

  return {
    passengers,
    processedPassengers: passengers as ProcessedPassenger[],
    loading,
    error,
    filters,
    setFilters,
    filteredData,
    summaryStats
  };
};