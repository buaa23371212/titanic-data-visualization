// 筛选器常量定义 - 统一管理所有筛选相关的硬编码值

// 生存状态筛选选项
export const SURVIVAL_FILTERS = {
  SURVIVED: '生存',
  DIED: '死亡'
} as const;

// 性别筛选选项
export const GENDER_FILTERS = {
  MALE: '男性',
  FEMALE: '女性'
} as const;

// 舱位等级筛选选项
export const PCLASS_FILTERS = {
  FIRST: '一等舱',
  SECOND: '二等舱',
  THIRD: '三等舱'
} as const;

// 年龄分组筛选选项
export const AGE_GROUP_FILTERS = {
  CHILD: '儿童(0-12岁)',
  TEEN: '青少年(13-17岁)',
  ADULT: '成人(18-59岁)',
  SENIOR: '老人(60+岁)'
} as const;

// 家庭规模筛选选项
export const FAMILY_SIZE_FILTERS = {
  SOLO: '独自旅行',
  SMALL: '小型家庭(2-3人)',
  LARGE: '大型家庭(4+人)'
} as const;

// 票价分组筛选选项
export const FARE_GROUP_FILTERS = {
  LOW: '低价票(0-10)',
  MEDIUM: '中等票价(10-30)',
  HIGH: '高价票(30+)'
} as const;

// 登船港口筛选选项
export const EMBARKED_FILTERS = {
  CHERBOURG: '瑟堡',
  QUEENSTOWN: '皇后镇',
  SOUTHAMPTON: '南安普顿'
} as const;

// 筛选器标签到数据值的映射
export const FILTER_VALUE_MAPPINGS = {
  // 生存状态映射
  [SURVIVAL_FILTERS.SURVIVED]: { survived: true },
  [SURVIVAL_FILTERS.DIED]: { survived: false },
  [SURVIVAL_FILTERS.ALL]: { survived: null },
  
  // 性别映射
  [GENDER_FILTERS.MALE]: { sex: 'male' },
  [GENDER_FILTERS.FEMALE]: { sex: 'female' },
  [GENDER_FILTERS.ALL]: { sex: null },
  
  // 舱位等级映射
  [PCLASS_FILTERS.FIRST]: { pclass: 1 },
  [PCLASS_FILTERS.SECOND]: { pclass: 2 },
  [PCLASS_FILTERS.THIRD]: { pclass: 3 },
  [PCLASS_FILTERS.ALL]: { pclass: null },
  
  // 年龄分组映射
  [AGE_GROUP_FILTERS.CHILD]: { ageGroup: 'Child' },
  [AGE_GROUP_FILTERS.TEEN]: { ageGroup: 'Teen' },
  [AGE_GROUP_FILTERS.ADULT]: { ageGroup: 'Adult' },
  [AGE_GROUP_FILTERS.SENIOR]: { ageGroup: 'Senior' },
  [AGE_GROUP_FILTERS.ALL]: { ageGroup: null },
  
  // 家庭规模映射
  [FAMILY_SIZE_FILTERS.SOLO]: { familySizeGroup: 'Solo' },
  [FAMILY_SIZE_FILTERS.SMALL]: { familySizeGroup: 'Small' },
  [FAMILY_SIZE_FILTERS.LARGE]: { familySizeGroup: 'Large' },
  [FAMILY_SIZE_FILTERS.ALL]: { familySizeGroup: null },
  
  // 票价分组映射
  [FARE_GROUP_FILTERS.LOW]: { fareGroup: 'Low' },
  [FARE_GROUP_FILTERS.MEDIUM]: { fareGroup: 'Medium' },
  [FARE_GROUP_FILTERS.HIGH]: { fareGroup: 'High' },
  [FARE_GROUP_FILTERS.ALL]: { fareGroup: null },
  
  // 登船港口映射
  [EMBARKED_FILTERS.CHERBOURG]: { embarked: 'C' },
  [EMBARKED_FILTERS.QUEENSTOWN]: { embarked: 'Q' },
  [EMBARKED_FILTERS.SOUTHAMPTON]: { embarked: 'S' },
  [EMBARKED_FILTERS.ALL]: { embarked: null }
} as const;

// 默认筛选器状态
export const DEFAULT_FILTERS = {
  survival: [],
  gender: [],
  pclass: [],
  ageGroup: [],
  familySize: [],
  fareGroup: [],
  embarked: [],
  ageRange: [0, 100] as [number, number],
  fareRange: [0, 512] as [number, number],
  searchText: ''
} as const;

// 筛选器标签定义（用于UI显示）
export const FILTER_LABELS = {
  SURVIVAL: {
    SURVIVED: '生存',
    DIED: '死亡'
  },
  GENDER: {
    MALE: '男性',
    FEMALE: '女性'
  },
  PCLASS: {
    FIRST: '一等舱',
    SECOND: '二等舱',
    THIRD: '三等舱'
  },
  AGE_GROUP: {
    CHILD: '儿童(0-12岁)',
    TEEN: '青少年(13-17岁)',
    ADULT: '成人(18-59岁)',
    SENIOR: '老人(60+岁)'
  },
  FAMILY_SIZE: {
    SOLO: '独自旅行',
    SMALL: '小型家庭(2-3人)',
    LARGE: '大型家庭(4+人)'
  },
  FARE_GROUP: {
    LOW: '低价票(0-10)',
    MEDIUM: '中等票价(10-30)',
    HIGH: '高价票(30+)'
  },
  EMBARKED: {
    CHERBOURG: '瑟堡',
    QUEENSTOWN: '皇后镇',
    SOUTHAMPTON: '南安普顿'
  }
} as const;

// 获取所有筛选选项的数组
export const FILTER_OPTIONS = {
  survival: Object.values(SURVIVAL_FILTERS),
  gender: Object.values(GENDER_FILTERS),
  pclass: Object.values(PCLASS_FILTERS),
  ageGroup: Object.values(AGE_GROUP_FILTERS),
  familySize: Object.values(FAMILY_SIZE_FILTERS),
  fareGroup: Object.values(FARE_GROUP_FILTERS),
  embarked: Object.values(EMBARKED_FILTERS)
} as const;

// 类型定义
export type FilterLabel = 
  | typeof SURVIVAL_FILTERS[keyof typeof SURVIVAL_FILTERS]
  | typeof GENDER_FILTERS[keyof typeof GENDER_FILTERS]
  | typeof PCLASS_FILTERS[keyof typeof PCLASS_FILTERS]
  | typeof AGE_GROUP_FILTERS[keyof typeof AGE_GROUP_FILTERS]
  | typeof FAMILY_SIZE_FILTERS[keyof typeof FAMILY_SIZE_FILTERS]
  | typeof FARE_GROUP_FILTERS[keyof typeof FARE_GROUP_FILTERS]
  | typeof EMBARKED_FILTERS[keyof typeof EMBARKED_FILTERS];

export interface FilterMapping {
  survived?: boolean | null;
  sex?: 'male' | 'female' | null;
  pclass?: 1 | 2 | 3 | null;
  ageGroup?: 'Child' | 'Teen' | 'Young Adult' | 'Adult' | 'Senior' | null;
  familySizeGroup?: 'Solo' | 'Small' | 'Large' | null;
  fareGroup?: 'Low' | 'Medium' | 'High' | 'Very High' | null;
  embarked?: 'C' | 'Q' | 'S' | null;
}