"""
泰坦尼克号数据集预处理脚本

此脚本负责数据清洗、特征工程和数据转换，生成适合可视化的处理数据。
"""

import pandas as pd
import numpy as np
import json
from pathlib import Path
from typing import Dict, Any, List


class TitanicDataPreprocessor:
    """泰坦尼克号数据预处理类"""
    
    def __init__(self, data_path: str):
        """
        初始化预处理器
        
        Args:
            data_path: 原始数据文件路径
        """
        self.data_path = data_path
        self.df = None
        self.processed_df = None
        
    def load_data(self) -> pd.DataFrame:
        """
        加载原始数据
        
        Returns:
            原始数据DataFrame
        """
        print("📥 加载原始数据...")
        self.df = pd.read_csv(self.data_path)
        print(f"✅ 数据加载完成，共 {len(self.df)} 行，{len(self.df.columns)} 列")
        return self.df
    
    def handle_missing_values(self) -> pd.DataFrame:
        """
        处理缺失值
        
        Returns:
            处理缺失值后的DataFrame
        """
        print("🔍 处理缺失值...")
        df = self.df.copy()
        
        # 1. Age缺失值处理 - 使用中位数填充
        age_median = df['Age'].median()
        df['Age'] = df['Age'].fillna(age_median)
        print(f"   ✅ Age缺失值填充完成（中位数: {age_median}）")
        
        # 2. Embarked缺失值处理 - 使用众数填充
        embarked_mode = df['Embarked'].mode()[0]
        df['Embarked'] = df['Embarked'].fillna(embarked_mode)
        print(f"   ✅ Embarked缺失值填充完成（众数: {embarked_mode}）")
        
        # 3. Cabin缺失值处理 - 创建二元特征
        df['HasCabin'] = df['Cabin'].notna().astype(int)
        print(f"   ✅ Cabin缺失值处理完成，创建HasCabin特征")
        
        # 4. Fare缺失值处理 - 使用中位数填充
        fare_median = df['Fare'].median()
        df['Fare'] = df['Fare'].fillna(fare_median)
        print(f"   ✅ Fare缺失值填充完成（中位数: {fare_median}）")
        
        return df
    
    def extract_title_from_name(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        从姓名中提取称谓
        
        Args:
            df: 输入DataFrame
            
        Returns:
            包含Title特征的DataFrame
        """
        print("👤 提取姓名称谓...")
        
        # 使用正则表达式提取称谓
        df['Title'] = df['Name'].str.extract(r' ([A-Za-z]+)\.', expand=False)
        
        # 合并稀有称谓
        rare_titles = ['Lady', 'Countess', 'Capt', 'Col', 'Don', 'Dr', 'Major', 'Rev', 'Sir', 'Jonkheer', 'Dona']
        df['Title'] = df['Title'].replace(['Mlle', 'Ms'], 'Miss')
        df['Title'] = df['Title'].replace('Mme', 'Mrs')
        df['Title'] = df['Title'].apply(lambda x: 'Rare' if x in rare_titles else x)
        
        title_counts = df['Title'].value_counts()
        print(f"   ✅ 称谓提取完成，共 {len(title_counts)} 种称谓: {dict(title_counts)}")
        
        return df
    
    def create_family_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        创建家庭相关特征
        
        Args:
            df: 输入DataFrame
            
        Returns:
            包含家庭特征的DataFrame
        """
        print("👨‍👩‍👧‍👦 创建家庭特征...")
        
        # 1. 家庭规模
        df['FamilySize'] = df['SibSp'] + df['Parch'] + 1
        
        # 2. 是否独自旅行
        df['IsAlone'] = (df['FamilySize'] == 1).astype(int)
        
        # 3. 家庭规模分组
        df['FamilySizeGroup'] = pd.cut(df['FamilySize'], 
                                      bins=[0, 1, 4, 11], 
                                      labels=['Solo', 'Small', 'Large'])
        
        print(f"   ✅ 家庭特征创建完成")
        print(f"      - 家庭规模范围: {df['FamilySize'].min()} ~ {df['FamilySize'].max()}")
        print(f"      - 独自旅行人数: {df['IsAlone'].sum()}")
        
        return df
    
    def create_fare_groups(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        创建票价分组
        
        Args:
            df: 输入DataFrame
            
        Returns:
            包含票价分组的DataFrame
        """
        print("💰 创建票价分组...")
        
        # 使用四分位数进行票价分组
        fare_quantiles = df['Fare'].quantile([0.25, 0.5, 0.75])
        df['FareGroup'] = pd.cut(df['Fare'], 
                               bins=[0, fare_quantiles[0.25], fare_quantiles[0.5], 
                                     fare_quantiles[0.75], df['Fare'].max()], 
                               labels=['Low', 'Medium', 'High', 'Very High'])
        
        fare_group_counts = df['FareGroup'].value_counts()
        print(f"   ✅ 票价分组完成: {dict(fare_group_counts)}")
        
        return df
    
    def create_age_groups(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        创建年龄分组
        
        Args:
            df: 输入DataFrame
            
        Returns:
            包含年龄分组的DataFrame
        """
        print("👶 创建年龄分组...")
        
        # 定义年龄分组
        age_bins = [0, 12, 18, 35, 60, 100]
        age_labels = ['Child', 'Teen', 'Young Adult', 'Adult', 'Senior']
        
        df['AgeGroup'] = pd.cut(df['Age'], bins=age_bins, labels=age_labels)
        
        age_group_counts = df['AgeGroup'].value_counts()
        print(f"   ✅ 年龄分组完成: {dict(age_group_counts)}")
        
        return df
    
    def encode_categorical_variables(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        编码分类变量
        
        Args:
            df: 输入DataFrame
            
        Returns:
            编码后的DataFrame
        """
        print("🔢 编码分类变量...")
        
        # 1. Sex编码
        df['Sex_encoded'] = df['Sex'].map({'male': 0, 'female': 1})
        
        # 2. Embarked编码
        embarked_mapping = {'S': 0, 'C': 1, 'Q': 2}
        df['Embarked_encoded'] = df['Embarked'].map(embarked_mapping)
        
        # 3. Title编码
        title_mapping = {'Mr': 0, 'Miss': 1, 'Mrs': 2, 'Master': 3, 'Rare': 4}
        df['Title_encoded'] = df['Title'].map(title_mapping)
        
        # 4. 舱位等级已经是数值，无需编码
        
        print(f"   ✅ 分类变量编码完成")
        print(f"      - Sex编码: {dict(df['Sex'].value_counts())}")
        print(f"      - Embarked编码: {dict(df['Embarked'].value_counts())}")
        
        return df
    
    def normalize_numerical_variables(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        标准化数值变量
        
        Args:
            df: 输入DataFrame
            
        Returns:
            标准化后的DataFrame
        """
        print("📊 标准化数值变量...")
        
        from sklearn.preprocessing import StandardScaler
        
        # 需要标准化的数值列
        numerical_cols = ['Age', 'Fare', 'SibSp', 'Parch']
        
        # 创建原始值副本，用于前端显示
        df['Age_original'] = df['Age']
        df['Fare_original'] = df['Fare']
        df['SibSp_original'] = df['SibSp']
        df['Parch_original'] = df['Parch']
        
        # 创建标准化器
        scaler = StandardScaler()
        
        # 标准化数值列
        df[numerical_cols] = scaler.fit_transform(df[numerical_cols])
        
        print(f"   ✅ 数值变量标准化完成: {numerical_cols}")
        
        return df
    
    def create_visualization_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        创建可视化专用特征
        
        Args:
            df: 输入DataFrame
            
        Returns:
            包含可视化特征的DataFrame
        """
        print("📈 创建可视化特征...")
        
        # 1. 生存状态标签
        df['SurvivedLabel'] = df['Survived'].map({0: 'No', 1: 'Yes'})
        
        # 2. 舱位等级标签
        df['PclassLabel'] = df['Pclass'].map({1: 'First', 2: 'Second', 3: 'Third'})
        
        # 3. 登船港口标签
        df['EmbarkedLabel'] = df['Embarked'].map({'S': 'Southampton', 'C': 'Cherbourg', 'Q': 'Queenstown'})
        
        # 4. 性别标签
        df['SexLabel'] = df['Sex'].map({'male': 'Male', 'female': 'Female'})
        
        print(f"   ✅ 可视化特征创建完成")
        
        return df
    
    def preprocess_data(self) -> pd.DataFrame:
        """
        执行完整的数据预处理流程
        
        Returns:
            处理后的DataFrame
        """
        print("🚀 开始数据预处理流程...")
        
        # 1. 加载数据
        df = self.load_data()
        
        # 2. 处理缺失值
        df = self.handle_missing_values()
        
        # 3. 特征工程
        df = self.extract_title_from_name(df)
        df = self.create_family_features(df)
        df = self.create_fare_groups(df)
        df = self.create_age_groups(df)
        
        # 4. 数据类型转换
        df = self.encode_categorical_variables(df)
        df = self.normalize_numerical_variables(df)
        
        # 5. 可视化专用特征
        df = self.create_visualization_features(df)
        
        self.processed_df = df
        print(f"🎉 数据预处理完成！最终数据形状: {df.shape}")
        
        return df
    
    def save_processed_data(self, output_path: str) -> None:
        """
        保存处理后的数据
        
        Args:
            output_path: 输出文件路径
        """
        if self.processed_df is None:
            raise ValueError("请先执行preprocess_data()方法")
        
        # 确保输出目录存在
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        
        # 处理NaN值，将其转换为null或其他合适的值
        df_cleaned = self.processed_df.copy()
        
        # 将分类变量转换为字符串类型，然后处理NaN值
        categorical_columns = ['FareGroup', 'AgeGroup', 'FamilySizeGroup', 'Title', 'Embarked', 'Cabin']
        for col in categorical_columns:
            if col in df_cleaned.columns:
                # 先将分类变量转换为字符串类型
                df_cleaned[col] = df_cleaned[col].astype(str)
                # 然后将NaN值替换为"Unknown"
                df_cleaned[col] = df_cleaned[col].replace('nan', 'Unknown')
        
        # 将数值变量中的NaN值转换为None（JSON中的null）
        df_cleaned = df_cleaned.where(pd.notnull(df_cleaned), None)
        
        # 保存为JSON格式，便于前端使用
        processed_data = df_cleaned.to_dict('records')
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(processed_data, f, ensure_ascii=False, indent=2)
        
        print(f"💾 处理后的数据已保存到: {output_path}")
    
    def generate_data_summary(self) -> Dict[str, Any]:
        """
        生成数据摘要统计
        
        Returns:
            数据摘要字典
        """
        if self.processed_df is None:
            raise ValueError("请先执行preprocess_data()方法")
        
        df = self.processed_df
        
        summary = {
            'total_passengers': len(df),
            'survival_rate': df['Survived'].mean(),
            'gender_distribution': df['Sex'].value_counts().to_dict(),
            'class_distribution': df['Pclass'].value_counts().to_dict(),
            'age_statistics': {
                'mean': df['Age'].mean(),
                'median': df['Age'].median(),
                'min': df['Age'].min(),
                'max': df['Age'].max()
            },
            'fare_statistics': {
                'mean': df['Fare'].mean(),
                'median': df['Fare'].median(),
                'min': df['Fare'].min(),
                'max': df['Fare'].max()
            }
        }
        
        return summary


def main():
    """主函数"""
    # 文件路径（相对于项目根目录）
    raw_data_path = "docs/data/raw/Titanic-Dataset.csv"
    processed_data_path = "src/data/processed/titanic_processed.json"
    
    # 创建预处理器
    preprocessor = TitanicDataPreprocessor(raw_data_path)
    
    try:
        # 执行预处理
        processed_data = preprocessor.preprocess_data()
        
        # 生成数据摘要
        summary = preprocessor.generate_data_summary()
        
        # 保存处理后的数据
        preprocessor.save_processed_data(processed_data_path)
        
        # 保存摘要信息到JSON文件
        summary_path = "src/data/processed/titanic_summary.json"
        Path(summary_path).parent.mkdir(parents=True, exist_ok=True)
        
        with open(summary_path, 'w', encoding='utf-8') as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
        
        print(f"💾 数据摘要已保存到: {summary_path}")
        
        # 打印摘要信息
        print("\n📊 数据摘要:")
        print(f"   总乘客数: {summary['total_passengers']}")
        print(f"   总体生存率: {summary['survival_rate']:.2%}")
        print(f"   性别分布: {summary['gender_distribution']}")
        print(f"   舱位分布: {summary['class_distribution']}")
        
        print(f"\n✅ 数据预处理流程完成！")
        
    except Exception as e:
        print(f"❌ 预处理过程中出现错误: {e}")
        raise


if __name__ == "__main__":
    main()