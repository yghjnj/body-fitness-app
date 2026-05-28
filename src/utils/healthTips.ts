interface UserProfile {
  gender: 'male' | 'female';
  age: number;
  heightCm: number;
  bmi?: number;
  goalType?: string;
  calorieTarget: number;
}

export interface HealthTip {
  category: 'nutrition' | 'exercise' | 'lifestyle' | 'science';
  icon: string;
  title: string;
  content: string;
}

const TIPS_BY_BMI: Record<string, HealthTip[]> = {
  underweight: [
    { category: 'nutrition', icon: 'restaurant', title: '增重饮食策略', content: '每日增加300-500kcal热量盈余，优先选择坚果、牛油果、全脂奶等高营养密度食物。每餐保证20-30g蛋白质。' },
    { category: 'exercise', icon: 'barbell', title: '增肌训练原则', content: '以复合动作为主（深蹲、硬拉、卧推），每组8-12次，每周训练4-5次。避免过多有氧消耗热量。' },
    { category: 'lifestyle', icon: 'bed', title: '充足睡眠助增重', content: '每天保证7-8小时睡眠。睡眠不足会升高皮质醇，加速肌肉分解。睡前可喝一杯温牛奶。' },
  ],
  normal: [
    { category: 'nutrition', icon: 'nutrition', title: '均衡饮食法则', content: '蛋白质占25%、碳水45%、脂肪30%。每天吃5种颜色蔬果，确保维生素和矿物质摄入充足。' },
    { category: 'exercise', icon: 'fitness', title: '维持体态训练', content: '每周150分钟中等强度运动+2次力量训练。有氧和力量结合，保持体脂率在健康范围。' },
    { category: 'science', icon: 'flask', title: '代谢健康指标', content: '除了BMI，关注腰臀比和体脂率更准确反映健康状态。正常BMI不代表内脏脂肪不超标。' },
  ],
  overweight: [
    { category: 'nutrition', icon: 'flame', title: '制造热量缺口', content: '每日减少300-500kcal摄入，优先减少精制碳水和油炸食品。饭前喝一杯水可减少进食量15%。' },
    { category: 'exercise', icon: 'walk', title: '燃脂运动方案', content: '每周4-5次有氧运动（快走、游泳、骑行），每次40分钟。空腹有氧可增加脂肪供能比例。' },
    { category: 'science', icon: 'trending-down', title: '减脂平台期突破', content: '体重下降遇到平台期时，尝试碳水循环（高碳日/低碳日交替），打破代谢适应。' },
  ],
  obese: [
    { category: 'nutrition', icon: 'medical', title: '科学减重饮食', content: '建议每日热量控制在1500-1800kcal，三餐定时定量。优先选择低GI食物，避免血糖剧烈波动。' },
    { category: 'exercise', icon: 'water', title: '低冲击运动', content: '从游泳、椭圆机、水中步行开始，保护关节。每天累计步行8000-10000步，循序渐进增加强度。' },
    { category: 'lifestyle', icon: 'time', title: '生活习惯调整', content: '记录饮食日记3天可帮你发现自己20%的无意识进食。用小餐盘可以使食量减少22%。' },
  ],
};

const GENERAL_TIPS: HealthTip[] = [
  { category: 'science', icon: 'water', title: '饮水与代谢', content: '充足饮水可使基础代谢率提升10-30%。建议每公斤体重饮水30-35ml，运动前后额外补充。' },
  { category: 'nutrition', icon: 'egg', title: '蛋白质摄入节奏', content: '将每日蛋白质均匀分配到3-4餐，每餐20-30g，蛋白质合成效率最高。训练后30分钟内补充最佳。' },
  { category: 'exercise', icon: 'body', title: 'NEAT消耗法', content: '非运动消耗（NEAT）占每日总消耗的15-50%。多站立、走楼梯、做家务都是有效的热量消耗方式。' },
  { category: 'lifestyle', icon: 'sunny', title: '维生素D与体重', content: '维生素D缺乏与肥胖相关。每天日晒15-20分钟，或补充维生素D3 1000-2000IU。' },
  { category: 'science', icon: 'pulse', title: '压力与体重', content: '长期压力使皮质醇升高，促进腹部脂肪堆积。每天冥想10分钟可显著降低皮质醇水平。' },
  { category: 'nutrition', icon: 'leaf', title: '膳食纤维益处', content: '每天摄入25-30g膳食纤维可增加饱腹感，减少总热量摄入。燕麦、豆类、蔬菜是优质纤维来源。' },
  { category: 'exercise', icon: 'timer', title: 'HIIT高效燃脂', content: '20分钟HIIT的燃脂效果相当于40分钟匀速有氧。运动后24小时内基础代谢持续升高（后燃效应）。' },
  { category: 'science', icon: 'moon', title: '睡眠与食欲', content: '睡眠不足6小时会让饥饿素升高28%，瘦素降低18%。保证7-8小时睡眠是控制食欲的关键。' },
];

const GENDER_TIPS: Record<string, HealthTip[]> = {
  male: [
    { category: 'nutrition', icon: 'man', title: '男性营养重点', content: '男性每日需铁8mg，锌11mg。红肉、牡蛎、南瓜籽是优质锌来源，对睾酮水平有积极影响。' },
    { category: 'exercise', icon: 'barbell', title: '睾酮优化训练', content: '大重量复合动作（深蹲、硬拉）可促进睾酮分泌。训练组间休息90-120秒，总时长控制在60分钟内。' },
  ],
  female: [
    { category: 'nutrition', icon: 'woman', title: '女性营养重点', content: '女性每日需铁18mg（生理期前后更重要）。搭配维生素C可提升铁吸收率3倍。菠菜+柠檬汁是黄金搭配。' },
    { category: 'exercise', icon: 'fitness', title: '女性训练建议', content: '女性不必担心练壮，因睾酮水平仅为男性1/10。力量训练可增加骨密度，预防骨质疏松。' },
  ],
};

const AGE_TIPS: { maxAge: number; tips: HealthTip[] }[] = [
  { maxAge: 25, tips: [{ category: 'exercise', icon: 'trending-up', title: '青年运动黄金期', content: '20-25岁是肌肉增长黄金期。每周3-4次力量训练+1-2次高强度间歇训练，打造终身代谢基础。' }] },
  { maxAge: 35, tips: [{ category: 'lifestyle', icon: 'briefcase', title: '办公族健康策略', content: '每坐45分钟起身活动5分钟。使用站立办公桌每天站立2小时，可多消耗200kcal。每小时做30秒靠墙静蹲。' }] },
  { maxAge: 50, tips: [{ category: 'nutrition', icon: 'bone', title: '骨骼健康守护', content: '35岁后骨量开始流失。每天补充钙800-1000mg+维生素D3，配合力量训练维持骨密度。乳制品、豆制品是优质钙源。' }] },
  { maxAge: 999, tips: [{ category: 'science', icon: 'heart', title: '心血管保护', content: '每周2-3次中等强度有氧运动可降低心血管疾病风险30%。饮食减少饱和脂肪，增加Omega-3（深海鱼、亚麻籽）。' }] },
];

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

export function getPersonalizedTips(profile: UserProfile): HealthTip[] {
  const bmi = profile.bmi || 22;
  const category = getBMICategory(bmi);

  const tips: HealthTip[] = [];

  // BMI-specific tips (3 tips)
  const bmiTips = TIPS_BY_BMI[category] || TIPS_BY_BMI.normal;
  tips.push(...bmiTips);

  // Gender-specific tips (1 tip)
  const genderTips = GENDER_TIPS[profile.gender] || [];
  tips.push(genderTips[Math.floor(Math.random() * genderTips.length)]);

  // Age-specific tips (1 tip)
  for (const ageGroup of AGE_TIPS) {
    if (profile.age <= ageGroup.maxAge) {
      tips.push(ageGroup.tips[Math.floor(Math.random() * ageGroup.tips.length)]);
      break;
    }
  }

  // Shuffle general tips and add some
  const shuffled = [...GENERAL_TIPS].sort(() => Math.random() - 0.5);
  tips.push(...shuffled.slice(0, 3));

  return tips;
}
