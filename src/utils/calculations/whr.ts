export interface WHRResult {
  ratio: number;
  category: string;
  riskLevel: 'low' | 'moderate' | 'high';
  categoryColor: string;
}

export function calculateWHR(waistCm: number, hipCm: number, gender: 'male' | 'female'): WHRResult {
  const ratio = Math.round((waistCm / hipCm) * 100) / 100;

  let riskLevel: 'low' | 'moderate' | 'high';
  let category: string;
  let categoryColor: string;

  if (gender === 'male') {
    if (ratio < 0.85) {
      riskLevel = 'low';
      category = '低风险';
      categoryColor = '#10B981';
    } else if (ratio <= 0.9) {
      riskLevel = 'moderate';
      category = '中等风险';
      categoryColor = '#F59E0B';
    } else {
      riskLevel = 'high';
      category = '高风险';
      categoryColor = '#EF4444';
    }
  } else {
    if (ratio < 0.8) {
      riskLevel = 'low';
      category = '低风险';
      categoryColor = '#10B981';
    } else if (ratio <= 0.85) {
      riskLevel = 'moderate';
      category = '中等风险';
      categoryColor = '#F59E0B';
    } else {
      riskLevel = 'high';
      category = '高风险';
      categoryColor = '#EF4444';
    }
  }

  return { ratio, category, riskLevel, categoryColor };
}

export function getWHRDescription(riskLevel: string, gender: 'male' | 'female'): string {
  const threshold = gender === 'male' ? '0.90' : '0.85';
  switch (riskLevel) {
    case 'low':
      return `腰臀比在健康范围内，心血管疾病风险较低。`;
    case 'moderate':
      return `腰臀比偏高，建议增加运动量和注意饮食，控制腹部脂肪。`;
    case 'high':
      return `腰臀比显著偏高（${gender === 'male' ? '≥0.90' : '≥0.85'}），心血管疾病和代谢综合征风险增加，建议咨询医生。`;
    default:
      return '';
  }
}
