// 乘客数据处理工具函数

import { Passenger } from '../types/passenger';

// 年龄分组函数
export const getAgeGroup = (age: number | null): string => {
  if (age === null) return 'Unknown';
  if (age <= 12) return 'Child';
  if (age <= 18) return 'Teen';
  if (age <= 35) return 'Young Adult';
  if (age <= 60) return 'Adult';
  return 'Senior';
};

// 家庭规模分组函数
export const getFamilySizeGroup = (sibSp: number, parch: number): string => {
  const familySize = sibSp + parch + 1; // 包括乘客自己
  if (familySize === 1) return 'Alone';
  if (familySize <= 4) return 'Small';
  if (familySize <= 6) return 'Medium';
  return 'Large';
};

// 票价分组函数
export const getFareGroup = (fare: number): string => {
  if (fare <= 10) return 'Low';
  if (fare <= 30) return 'Medium';
  if (fare <= 100) return 'High';
  return 'Luxury';
};

import {
  SURVIVAL_FILTERS,
  GENDER_FILTERS,
  PCLASS_FILTERS,
  AGE_GROUP_FILTERS,
  FAMILY_SIZE_FILTERS,
  FARE_GROUP_FILTERS,
  EMBARKED_FILTERS,
  FILTER_VALUE_MAPPINGS
} from './filterConstants';

// 筛选乘客数据
export const filterPassengers = (
  passengers: Passenger[],
  filters: {
    survival: string[];
    gender: string[];
    pclass: string[];
    ageGroup: string[];
    familySize: string[];
    fareGroup: string[];
    embarked: string[];
    ageRange: [number, number];
    fareRange: [number, number];
    searchText: string;
  }
): Passenger[] => {
  return passengers.filter(passenger => {
    // 生存状态筛选
    if (filters.survival.length > 0) {
      const passengerSurvived = passenger.Survived === 1;
      const shouldIncludeSurvived = filters.survival.includes(SURVIVAL_FILTERS.SURVIVED);
      const shouldIncludeDied = filters.survival.includes(SURVIVAL_FILTERS.DIED);
      
      if (passengerSurvived && !shouldIncludeSurvived) return false;
      if (!passengerSurvived && !shouldIncludeDied) return false;
    }

    // 性别筛选
    if (filters.gender.length > 0) {
      const shouldIncludeMale = filters.gender.includes(GENDER_FILTERS.MALE);
      const shouldIncludeFemale = filters.gender.includes(GENDER_FILTERS.FEMALE);
      
      if (passenger.Sex === 'male' && !shouldIncludeMale) return false;
      if (passenger.Sex === 'female' && !shouldIncludeFemale) return false;
    }

    // 舱位等级筛选
    if (filters.pclass.length > 0) {
      const shouldIncludeFirst = filters.pclass.includes(PCLASS_FILTERS.FIRST);
      const shouldIncludeSecond = filters.pclass.includes(PCLASS_FILTERS.SECOND);
      const shouldIncludeThird = filters.pclass.includes(PCLASS_FILTERS.THIRD);
      
      if (passenger.Pclass === 1 && !shouldIncludeFirst) return false;
      if (passenger.Pclass === 2 && !shouldIncludeSecond) return false;
      if (passenger.Pclass === 3 && !shouldIncludeThird) return false;
    }

    // 年龄分组筛选
    if (filters.ageGroup.length > 0) {
      const passengerAgeGroup = passenger.AgeGroup;
      const shouldIncludeChild = filters.ageGroup.includes(AGE_GROUP_FILTERS.CHILD);
      const shouldIncludeTeen = filters.ageGroup.includes(AGE_GROUP_FILTERS.TEEN);
      const shouldIncludeAdult = filters.ageGroup.includes(AGE_GROUP_FILTERS.ADULT);
      const shouldIncludeSenior = filters.ageGroup.includes(AGE_GROUP_FILTERS.SENIOR);
      
      if (passengerAgeGroup === 'Child' && !shouldIncludeChild) return false;
      if (passengerAgeGroup === 'Teen' && !shouldIncludeTeen) return false;
      if (passengerAgeGroup === 'Adult' && !shouldIncludeAdult) return false;
      if (passengerAgeGroup === 'Senior' && !shouldIncludeSenior) return false;
      if (passengerAgeGroup === 'Young Adult' && !shouldIncludeAdult) return false; // Young Adult 属于 Adult
    }

    // 家庭规模筛选
    if (filters.familySize.length > 0) {
      const passengerFamilySizeGroup = passenger.FamilySizeGroup;
      const shouldIncludeSolo = filters.familySize.includes(FAMILY_SIZE_FILTERS.SOLO);
      const shouldIncludeSmall = filters.familySize.includes(FAMILY_SIZE_FILTERS.SMALL);
      const shouldIncludeLarge = filters.familySize.includes(FAMILY_SIZE_FILTERS.LARGE);
      
      if (passengerFamilySizeGroup === 'Solo' && !shouldIncludeSolo) return false;
      if (passengerFamilySizeGroup === 'Small' && !shouldIncludeSmall) return false;
      if (passengerFamilySizeGroup === 'Large' && !shouldIncludeLarge) return false;
    }

    // 票价分组筛选
    if (filters.fareGroup.length > 0) {
      const passengerFareGroup = passenger.FareGroup;
      const shouldIncludeLow = filters.fareGroup.includes(FARE_GROUP_FILTERS.LOW);
      const shouldIncludeMedium = filters.fareGroup.includes(FARE_GROUP_FILTERS.MEDIUM);
      const shouldIncludeHigh = filters.fareGroup.includes(FARE_GROUP_FILTERS.HIGH);
      
      if (passengerFareGroup === 'Low' && !shouldIncludeLow) return false;
      if (passengerFareGroup === 'Medium' && !shouldIncludeMedium) return false;
      if (passengerFareGroup === 'High' && !shouldIncludeHigh) return false;
      if (passengerFareGroup === 'Very High' && !shouldIncludeHigh) return false; // Very High 属于 High
    }

    // 登船港口筛选
    if (filters.embarked.length > 0) {
      const passengerEmbarked = passenger.Embarked;
      const shouldIncludeCherbourg = filters.embarked.includes(EMBARKED_FILTERS.CHERBOURG);
      const shouldIncludeQueenstown = filters.embarked.includes(EMBARKED_FILTERS.QUEENSTOWN);
      const shouldIncludeSouthampton = filters.embarked.includes(EMBARKED_FILTERS.SOUTHAMPTON);
      
      if (passengerEmbarked === 'C' && !shouldIncludeCherbourg) return false;
      if (passengerEmbarked === 'Q' && !shouldIncludeQueenstown) return false;
      if (passengerEmbarked === 'S' && !shouldIncludeSouthampton) return false;
      if (passengerEmbarked === null) return false; // 没有登船港口信息的乘客被排除
    }

    // 年龄范围筛选 - 使用原始值进行筛选
    const ageToFilter = passenger.Age_original !== undefined ? passenger.Age_original : passenger.Age;
    if (ageToFilter !== null) {
      if (ageToFilter < filters.ageRange[0] || ageToFilter > filters.ageRange[1]) {
        return false;
      }
    }

    // 票价范围筛选 - 使用原始值进行筛选
    const fareToFilter = passenger.Fare_original !== undefined ? passenger.Fare_original : passenger.Fare;
    if (fareToFilter < filters.fareRange[0] || fareToFilter > filters.fareRange[1]) {
      return false;
    }

    // 姓名搜索筛选
    if (filters.searchText.trim() !== '') {
      const searchLower = filters.searchText.toLowerCase();
      const nameLower = passenger.Name.toLowerCase();
      if (!nameLower.includes(searchLower)) return false;
    }

    return true;
  });
};

// 计算生存率统计
export const calculateSurvivalStats = (passengers: Passenger[]) => {
  const total = passengers.length;
  const survived = passengers.filter(p => p.Survived).length;
  const survivalRate = total > 0 ? (survived / total) * 100 : 0;
  
  return {
    total,
    survived,
    died: total - survived,
    survivalRate
  };
};