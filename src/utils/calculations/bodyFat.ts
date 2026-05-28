export interface BodyFatResult {
  navyMethod?: number;
  bmiMethod: number;
  average: number;
  category: string;
  categoryColor: string;
}

export function calculateBodyFatNavy(
  gender: 'male' | 'female',
  heightCm: number,
  neckCm: number,
  waistCm: number,
  hipCm?: number
): number | null {
  if (gender === 'male') {
    if (neckCm <= 0 || waistCm <= 0 || heightCm <= 0) return null;
    const value =
      495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
    return Math.round(value * 10) / 10;
  } else {
    if (!hipCm || hipCm <= 0 || neckCm <= 0 || waistCm <= 0 || heightCm <= 0) return null;
    const value =
      495 /
        (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.221 * Math.log10(heightCm)) -
      450;
    return Math.round(value * 10) / 10;
  }
}

export function calculateBodyFatBMI(bmi: number, age: number, gender: 'male' | 'female'): number {
  const genderFactor = gender === 'male' ? 1 : 0;
  const value = 1.2 * bmi + 0.23 * age - 10.8 * genderFactor - 5.4;
  return Math.round(Math.max(2, value) * 10) / 10;
}

export function calculateBodyFat(
  gender: 'male' | 'female',
  heightCm: number,
  neckCm: number,
  waistCm: number,
  age: number,
  bmi: number,
  hipCm?: number
): BodyFatResult {
  const navyMethod = calculateBodyFatNavy(gender, heightCm, neckCm, waistCm, hipCm);
  const bmiMethod = calculateBodyFatBMI(bmi, age, gender);

  const validValues = [navyMethod, bmiMethod].filter((v): v is number => v !== null && v !== undefined);
  const average = Math.round((validValues.reduce((a, b) => a + b, 0) / validValues.length) * 10) / 10;

  const categoryObj = getBodyFatCategory(average, gender);
  const categoryColor = getBodyFatColor(categoryObj.label);

  return {
    navyMethod: navyMethod ?? undefined,
    bmiMethod,
    average,
    category: categoryObj.label,
    categoryColor,
  };
}

function getBodyFatCategory(bf: number, gender: 'male' | 'female'): { label: string } {
  if (gender === 'male') {
    if (bf < 6) return { label: '极低（运动员）' };
    if (bf < 14) return { label: '运动员水平' };
    if (bf < 18) return { label: '健康偏瘦' };
    if (bf < 25) return { label: '正常范围' };
    if (bf < 30) return { label: '偏高' };
    return { label: '过高' };
  } else {
    if (bf < 14) return { label: '极低（运动员）' };
    if (bf < 21) return { label: '运动员水平' };
    if (bf < 25) return { label: '健康偏瘦' };
    if (bf < 32) return { label: '正常范围' };
    if (bf < 37) return { label: '偏高' };
    return { label: '过高' };
  }
}

function getBodyFatColor(category: string): string {
  if (category.includes('正常')) return '#10B981';
  if (category.includes('偏高') || category.includes('过高')) return '#EF4444';
  if (category.includes('运动员') || category.includes('健康')) return '#3B82F6';
  return '#F59E0B';
}
