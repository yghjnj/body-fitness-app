export interface BMRResult {
  mifflinStJeor: number;
  harrisBenedict: number;
  average: number;
}

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female'
): BMRResult {
  let mifflin: number;
  let harris: number;

  if (gender === 'male') {
    mifflin = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    harris = 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age;
  } else {
    mifflin = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    harris = 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
  }

  const average = (mifflin + harris) / 2;

  return {
    mifflinStJeor: Math.round(mifflin),
    harrisBenedict: Math.round(harris),
    average: Math.round(average),
  };
}
