export interface BMIResult {
  bmi: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
  categoryLabel: string;
  categoryColor: string;
  healthyWeightMin: number;
  healthyWeightMax: number;
}

export function calculateBMI(weightKg: number, heightCm: number): BMIResult {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const roundedBMI = Math.round(bmi * 10) / 10;

  const healthyWeightMin = Math.round(18.5 * heightM * heightM * 10) / 10;
  const healthyWeightMax = Math.round(24.9 * heightM * heightM * 10) / 10;

  let category: BMIResult['category'];
  let categoryLabel: string;
  let categoryColor: string;

  if (bmi < 18.5) {
    category = 'underweight';
    categoryLabel = '偏瘦';
    categoryColor = '#3B82F6';
  } else if (bmi < 25) {
    category = 'normal';
    categoryLabel = '正常';
    categoryColor = '#10B981';
  } else if (bmi < 30) {
    category = 'overweight';
    categoryLabel = '超重';
    categoryColor = '#F59E0B';
  } else {
    category = 'obese';
    categoryLabel = '肥胖';
    categoryColor = '#EF4444';
  }

  return {
    bmi: roundedBMI,
    category,
    categoryLabel,
    categoryColor,
    healthyWeightMin,
    healthyWeightMax,
  };
}

export function getBMICategoryDescription(category: string): string {
  switch (category) {
    case 'underweight':
      return '体重偏低，建议增加营养摄入并进行力量训练来增加肌肉量。';
    case 'normal':
      return '体重在健康范围内，请继续保持良好的饮食和运动习惯。';
    case 'overweight':
      return '体重偏高，建议控制饮食热量摄入，增加有氧运动。';
    case 'obese':
      return '体重显著偏高，建议咨询医生或营养师制定减重计划。';
    default:
      return '';
  }
}
