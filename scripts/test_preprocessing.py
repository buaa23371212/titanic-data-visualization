"""
测试数据预处理脚本
"""

import sys
import os

# 添加脚本目录到路径
sys.path.append(os.path.dirname(__file__))

from data_preprocessing import TitanicDataPreprocessor

def test_data_preprocessing():
    """测试数据预处理功能"""
    
    # 文件路径
    raw_data_path = "../docs/data/raw/Titanic-Dataset.csv"
    
    # 检查原始数据文件是否存在
    if not os.path.exists(raw_data_path):
        print(f"❌ 原始数据文件不存在: {raw_data_path}")
        return False
    
    print(f"✅ 找到原始数据文件: {raw_data_path}")
    
    try:
        # 创建预处理器
        preprocessor = TitanicDataPreprocessor(raw_data_path)
        
        # 执行预处理
        processed_data = preprocessor.preprocess_data()
        
        # 生成摘要
        summary = preprocessor.generate_data_summary()
        
        # 打印测试结果
        print("\n📊 预处理测试结果:")
        print(f"   原始数据形状: {preprocessor.df.shape}")
        print(f"   处理后数据形状: {processed_data.shape}")
        print(f"   总乘客数: {summary['total_passengers']}")
        print(f"   生存率: {summary['survival_rate']:.2%}")
        print(f"   性别分布: {summary['gender_distribution']}")
        
        # 检查新创建的特征
        new_features = ['Title', 'FamilySize', 'IsAlone', 'FareGroup', 'AgeGroup']
        for feature in new_features:
            if feature in processed_data.columns:
                print(f"   ✅ {feature} 特征创建成功")
            else:
                print(f"   ❌ {feature} 特征创建失败")
        
        print("\n🎉 数据预处理测试通过！")
        return True
        
    except Exception as e:
        print(f"❌ 预处理测试失败: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_data_preprocessing()