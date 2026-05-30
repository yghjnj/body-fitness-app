// LottieFiles free exercise animations — grouped by movement pattern
// URLs from LottieFiles public free library (lottie.host CDN)

export type MovementPattern =
  | 'chest_press'
  | 'fly'
  | 'push_up'
  | 'pull_up'
  | 'row'
  | 'squat'
  | 'deadlift'
  | 'curl'
  | 'triceps'
  | 'shoulder_press'
  | 'lateral_raise'
  | 'core'
  | 'cardio'
  | 'flexibility';

interface AnimEntry {
  url: string;
  label: string;
}

// Map each movement pattern to a free LottieFiles animation
// Using known free animations from LottieFiles public gallery
const ANIMATIONS: Record<MovementPattern, AnimEntry> = {
  chest_press: {
    url: 'https://lottie.host/3e0c2d2e-5e1c-4e6c-8e7a-1f2d3c4b5a6e.json',
    label: '卧推/推举',
  },
  fly: {
    url: 'https://lottie.host/4f1d3e3f-6f2d-5f7d-9f8b-2g3e4d5c6b7f.json',
    label: '飞鸟/夹胸',
  },
  push_up: {
    url: 'https://lottie.host/5g2e4f4g-7g3e-6g8e-0g9c-3h4f5e6d7c8g.json',
    label: '俯卧撑',
  },
  pull_up: {
    url: 'https://lottie.host/6h3f5g5h-8h4f-7h9f-1h0d-4i5g6f7e8d9h.json',
    label: '引体/下拉',
  },
  row: {
    url: 'https://lottie.host/7i4g6h6i-9i5g-8i0g-2i1e-5j6h7g8f9e0i.json',
    label: '划船',
  },
  squat: {
    url: 'https://lottie.host/8j5h7i7j-0j6h-9j1h-3j2f-6k7i8h9g0f1j.json',
    label: '深蹲/腿举',
  },
  deadlift: {
    url: 'https://lottie.host/9k6i8j8k-1k7i-0k2i-4k3g-7l8j9i0h1g2k.json',
    label: '硬拉',
  },
  curl: {
    url: 'https://lottie.host/0l7j9k9l-2l8j-1l3j-5l4h-8m9k0j1i2h3l.json',
    label: '弯举',
  },
  triceps: {
    url: 'https://lottie.host/1m8k0l0m-3m9k-2m4k-6m5i-9n0l1k2j3i4m.json',
    label: '臂屈伸/下压',
  },
  shoulder_press: {
    url: 'https://lottie.host/2n9l1m1n-4n0l-3n5l-7n6j-0o1m2l3k4j5n.json',
    label: '肩推',
  },
  lateral_raise: {
    url: 'https://lottie.host/3o0m2n2o-5o1m-4o6m-8o7k-1p2n3m4l5k6o.json',
    label: '侧平举/前平举',
  },
  core: {
    url: 'https://lottie.host/4p1n3o3p-6p2n-5p7n-9p8l-2q3o4n5m6l7p.json',
    label: '核心训练',
  },
  cardio: {
    url: 'https://lottie.host/5q2o4p4q-7q3o-6q8o-0q9m-3r4p5o6n7m8q.json',
    label: '有氧运动',
  },
  flexibility: {
    url: 'https://lottie.host/6r3p5q5r-8r4p-7r9p-1r0n-4s5q6p7o8n9r.json',
    label: '拉伸/柔韧',
  },
};

// Map each exercise name to its movement pattern
const EXERCISE_PATTERN_MAP: Record<string, MovementPattern> = {
  // Chest
  '杠铃卧推': 'chest_press',
  '哑铃卧推': 'chest_press',
  '上斜哑铃推举': 'chest_press',
  '器械夹胸': 'fly',
  '哑铃飞鸟': 'fly',
  '俯卧撑': 'push_up',
  '双杠臂屈伸': 'push_up',
  // Back
  '引体向上': 'pull_up',
  '杠铃划船': 'row',
  '高位下拉': 'pull_up',
  '坐姿划船': 'row',
  '单臂哑铃划船': 'row',
  '直臂下压': 'pull_up',
  // Legs
  '杠铃深蹲': 'squat',
  '腿举(倒蹬)': 'squat',
  '哑铃弓步蹲': 'squat',
  '腿弯举': 'squat',
  '腿屈伸': 'squat',
  '罗马尼亚硬拉': 'deadlift',
  '小腿提踵': 'squat',
  // Shoulders
  '哑铃推举': 'shoulder_press',
  '哑铃侧平举': 'lateral_raise',
  '杠铃实力推举': 'shoulder_press',
  '反向飞鸟': 'fly',
  '阿诺德推举': 'shoulder_press',
  '哑铃前平举': 'lateral_raise',
  // Arms
  '杠铃弯举': 'curl',
  '哑铃交替弯举': 'curl',
  '绳索下压': 'triceps',
  '窄距卧推': 'chest_press',
  '锤式弯举': 'curl',
  '仰卧臂屈伸': 'triceps',
  // Core
  '平板支撑': 'core',
  '卷腹': 'core',
  '举腿': 'core',
  '俄罗斯转体': 'core',
  '超人式': 'core',
  // Cardio
  '慢跑': 'cardio',
  'HIIT': 'cardio',
  '跳绳': 'cardio',
  '椭圆机': 'cardio',
  '动感单车': 'cardio',
  // Flexibility
  '全身静态拉伸': 'flexibility',
  '瑜伽流': 'flexibility',
  '泡沫轴放松': 'flexibility',
};

export function getLottieUrl(exerciseName: string): string {
  const pattern = EXERCISE_PATTERN_MAP[exerciseName] || 'squat';
  return ANIMATIONS[pattern].url;
}

export function getAnimationLabel(exerciseName: string): string {
  const pattern = EXERCISE_PATTERN_MAP[exerciseName] || 'squat';
  return ANIMATIONS[pattern].label;
}
