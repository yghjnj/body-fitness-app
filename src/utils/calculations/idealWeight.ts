export interface IdealWeightResult {
  devine: { min: number; max: number };
  robinson: { min: number; max: number };
  miller: { min: number; max: number };
  hamwi: { min: number; max: number };
  average: number;
}

export function calculateIdealWeight(gender: 'male' | 'female', heightCm: number): IdealWeightResult {
  const inches = heightCm / 2.54;
  const inchesOver5ft = Math.max(0, inches - 60);

  let devineMin: number, devineMax: number;
  let robinsonMin: number, robinsonMax: number;
  let millerMin: number, millerMax: number;
  let hamwiMin: number, hamwiMax: number;

  if (gender === 'male') {
    devineMin = 50 + 2.3 * inchesOver5ft;
    robinsonMin = 52 + 1.9 * inchesOver5ft;
    millerMin = 56.2 + 1.41 * inchesOver5ft;
    hamwiMin = 48 + 1.1 * inchesOver5ft;
  } else {
    devineMin = 45.5 + 2.3 * inchesOver5ft;
    robinsonMin = 49 + 1.7 * inchesOver5ft;
    millerMin = 53.1 + 1.36 * inchesOver5ft;
    hamwiMin = 45 + 0.9 * inchesOver5ft;
  }

  devineMax = devineMin + 5;
  robinsonMax = robinsonMin + 5;
  millerMax = millerMin + 5;
  hamwiMax = hamwiMin + 5;

  const average = Math.round(
    ((devineMin + devineMax) / 2 + (robinsonMin + robinsonMax) / 2 + (millerMin + millerMax) / 2 + (hamwiMin + hamwiMax) / 2) / 4
  );

  return {
    devine: { min: Math.round(devineMin * 10) / 10, max: Math.round(devineMax * 10) / 10 },
    robinson: { min: Math.round(robinsonMin * 10) / 10, max: Math.round(robinsonMax * 10) / 10 },
    miller: { min: Math.round(millerMin * 10) / 10, max: Math.round(millerMax * 10) / 10 },
    hamwi: { min: Math.round(hamwiMin * 10) / 10, max: Math.round(hamwiMax * 10) / 10 },
    average,
  };
}
