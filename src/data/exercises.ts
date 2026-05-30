// Exercise database — each exercise includes form cues, safety notes, and animation data
// Based on ACSM/NSCA guidelines for resistance training

export interface Exercise {
  name: string;
  muscleGroup: string;
  secondaryMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'compound' | 'isolation' | 'bodyweight' | 'cardio' | 'flexibility';
  description: string;
  formCues: string[];        // Key technique points
  commonMistakes: string[];  // What to avoid
  safetyWarning?: string;    // When applicable (e.g., back issues)
  defaultSets: [number, number, number];
  defaultReps: [string, string, string];
  restSeconds: number;
  // Animation: movement direction for the animated guide
  animation: {
    direction: 'up_down' | 'forward_back' | 'rotation' | 'static_hold' | 'alternating' | 'circular';
    joint: 'shoulder' | 'elbow' | 'hip' | 'knee' | 'spine' | 'whole_body';
    rangeLabel: string;      // e.g. "向上推 / 向下放"
  };
}

// --- Chest 胸部 ---
export const CHEST_EXERCISES: Exercise[] = [
  {
    name: '杠铃卧推', muscleGroup: '胸部', secondaryMuscles: ['肱三头肌', '前三角肌'],
    difficulty: 'intermediate', type: 'compound',
    description: '经典复合动作，发展胸大肌厚度和上肢推力',
    formCues: ['肩胛骨收紧下沉，挺胸', '双脚踩实地板，臀部不离凳', '杠铃下降至乳头线，触胸轻触即起', '推起时肘部不完全锁死'],
    commonMistakes: ['肩胛骨放松导致肩部前送', '臀部离凳借力', '弹胸借力反弹'],
    safetyWarning: '务必使用保护架或有训练伙伴保护。大重量时使用护腕。',
    defaultSets: [3, 4, 5], defaultReps: ['8-10', '6-8', '4-6'], restSeconds: 90,
    animation: { direction: 'up_down', joint: 'shoulder', rangeLabel: '下降至胸部 / 推起到顶点' },
  },
  {
    name: '哑铃卧推', muscleGroup: '胸部', secondaryMuscles: ['肱三头肌', '前三角肌'],
    difficulty: 'beginner', type: 'compound',
    description: '哑铃版卧推，更大的活动范围和自由角度，改善左右力量不平衡',
    formCues: ['哑铃在肩部正上方', '下放时肘部45度角，不过度外展', '推起时感受胸肌挤压', '全程控制，不要突然发力'],
    commonMistakes: ['肘部过度外展（90度），增加肩关节压力', '哑铃在顶部相碰', '单侧发力不均'],
    defaultSets: [3, 3, 4], defaultReps: ['10-12', '8-10', '6-8'], restSeconds: 75,
    animation: { direction: 'up_down', joint: 'shoulder', rangeLabel: '下放至胸侧 / 推至手臂伸直' },
  },
  {
    name: '上斜哑铃推举', muscleGroup: '上胸部', secondaryMuscles: ['肱三头肌', '前三角肌'],
    difficulty: 'beginner', type: 'compound',
    description: '凳面倾斜30-45度，重点发展上胸，改善锁骨下方线条',
    formCues: ['凳面角度30-45度（过高会变成肩推）', '哑铃放在锁骨上方', '推起时头部不离凳', '顶峰收缩1秒'],
    commonMistakes: ['凳面角度过高，变成肩推', '头部前伸借力', '重量过大导致过度弓背'],
    safetyWarning: '哑铃从地面拿起时屈膝，不要弯腰。',
    defaultSets: [3, 3, 4], defaultReps: ['10-12', '8-10', '6-8'], restSeconds: 75,
    animation: { direction: 'up_down', joint: 'shoulder', rangeLabel: '下降至上胸 / 推起到顶点' },
  },
  {
    name: '器械夹胸', muscleGroup: '胸部', secondaryMuscles: ['前三角肌'],
    difficulty: 'beginner', type: 'isolation',
    description: '蝴蝶机夹胸，孤立刺激胸大肌内侧，塑造胸肌中缝',
    formCues: ['坐姿调整：把手与肩同高', '肘部微屈（约15度），保持固定角度', '夹胸时想象"拥抱大树"', '离心慢放2-3秒'],
    commonMistakes: ['手臂完全伸直（给肘关节压力）', '用惯性猛夹', '肩部前送代偿'],
    defaultSets: [3, 3, 4], defaultReps: ['12-15', '10-12', '8-10'], restSeconds: 60,
    animation: { direction: 'forward_back', joint: 'shoulder', rangeLabel: '打开至胸侧 / 夹紧到胸前' },
  },
  {
    name: '俯卧撑', muscleGroup: '胸部', secondaryMuscles: ['肱三头肌', '核心', '前三角肌'],
    difficulty: 'beginner', type: 'bodyweight',
    description: '最高效的自重上肢训练，随时随地可练',
    formCues: ['双手略宽于肩，手指朝前', '身体呈一条直线，核心收紧', '下降至胸部接近地面', '肘部与身体呈45度角'],
    commonMistakes: ['塌腰（核心放松）', '肘部过度外展', '半程俯卧撑（不降到底）'],
    defaultSets: [3, 4, 5], defaultReps: ['力竭', '力竭', '力竭'], restSeconds: 60,
    animation: { direction: 'up_down', joint: 'whole_body', rangeLabel: '身体下降 / 推起身体' },
  },
  {
    name: '哑铃飞鸟', muscleGroup: '胸部', secondaryMuscles: ['前三角肌'],
    difficulty: 'intermediate', type: 'isolation',
    description: '拉伸+收缩胸肌，增加胸肌宽度和分离度',
    formCues: ['肘部微屈固定（不变角度）', '哑铃在胸上方画弧线', '下降时感受胸肌拉伸', '顶端挤压但不触碰'],
    commonMistakes: ['手臂太直（变成推举）', '重量过大导致肩部代偿', '下放过低拉伸肩关节'],
    safetyWarning: '不要用过重重量，这是拉伸动作。肩部有伤慎做。',
    defaultSets: [3, 3, 3], defaultReps: ['10-12', '8-10', '8-10'], restSeconds: 60,
    animation: { direction: 'forward_back', joint: 'shoulder', rangeLabel: '打开双臂 / 合拢至胸前' },
  },
  {
    name: '双杠臂屈伸', muscleGroup: '下胸部', secondaryMuscles: ['肱三头肌', '前三角肌'],
    difficulty: 'advanced', type: 'compound',
    description: '上身"深蹲"，发展下胸和三头肌的终极自重动作',
    formCues: ['身体前倾30度（更侧重胸）', '下降至上臂与地面平行', '肘部向外微张', '全程控制，不弹震'],
    commonMistakes: ['身体太直（变成纯三头训练）', '下降过低给肩关节压力', '借力摆动'],
    safetyWarning: '肩关节有问题建议避免此动作。初学者可用辅助器械。',
    defaultSets: [3, 3, 4], defaultReps: ['8-10', '8-10', '6-8'], restSeconds: 90,
    animation: { direction: 'up_down', joint: 'whole_body', rangeLabel: '身体下降 / 推起身体' },
  },
];

// --- Back 背部 ---
export const BACK_EXERCISES: Exercise[] = [
  {
    name: '引体向上', muscleGroup: '背部', secondaryMuscles: ['肱二头肌', '前臂'],
    difficulty: 'intermediate', type: 'compound',
    description: '背部宽度之王，发展背阔肌宽度的最佳动作',
    formCues: ['正握略宽于肩', '肩胛骨先下沉，再拉', '拉到下巴超过杠', '全程控制，不摆动'],
    commonMistakes: ['借力摆动（kip）', '只用二头肌发力', '没拉到下巴以上', '脖子前伸'],
    safetyWarning: '体重较大者建议用弹力带辅助或使用引体向上机。',
    defaultSets: [3, 4, 5], defaultReps: ['力竭', '力竭', '力竭'], restSeconds: 90,
    animation: { direction: 'up_down', joint: 'whole_body', rangeLabel: '身体上拉 / 缓慢下放' },
  },
  {
    name: '杠铃划船', muscleGroup: '背部', secondaryMuscles: ['肱二头肌', '下背部', '核心'],
    difficulty: 'intermediate', type: 'compound',
    description: '增加背部厚度的王牌动作，发展整个后链',
    formCues: ['髋关节铰链，躯干与地面呈45度', '背挺直，核心收紧', '拉到腹部（不是胸口）', '顶峰收缩1秒'],
    commonMistakes: ['弓背（腰椎危险！）', '身体太直像耸肩', '靠腿部上下借力', '脖子前伸看镜子'],
    safetyWarning: '下背部有伤者用胸部支撑划船替代。任何背部不适立即停止。',
    defaultSets: [3, 4, 4], defaultReps: ['8-10', '6-8', '6-8'], restSeconds: 90,
    animation: { direction: 'up_down', joint: 'shoulder', rangeLabel: '杠铃下放 / 拉到腹部' },
  },
  {
    name: '高位下拉', muscleGroup: '背部', secondaryMuscles: ['肱二头肌'],
    difficulty: 'beginner', type: 'compound',
    description: '引体向上的"训练版"，可控重量，适合所有水平',
    formCues: ['宽握，手距1.5倍肩宽', '肩胛骨先下沉，用手肘引导下拉', '拉到锁骨高度', '躯干后仰不超过15度'],
    commonMistakes: ['过度后仰借力', '拉到脖子后面（增加颈椎风险）', '只用二头肌发力'],
    defaultSets: [3, 3, 4], defaultReps: ['10-12', '8-10', '6-8'], restSeconds: 75,
    animation: { direction: 'up_down', joint: 'shoulder', rangeLabel: '手臂上伸 / 下拉至锁骨' },
  },
  {
    name: '坐姿划船', muscleGroup: '背部', secondaryMuscles: ['肱二头肌', '后三角肌'],
    difficulty: 'beginner', type: 'compound',
    description: '安全可控的背部厚度训练，重点刺激中背部',
    formCues: ['双脚踩踏板，膝盖微屈', '拉到腹部，夹紧肩胛骨', '离心阶段控制2-3秒', '不后仰借力'],
    commonMistakes: ['用腰部后仰借力', '耸肩(斜方肌代偿)', '手臂发力过多'],
    defaultSets: [3, 3, 3], defaultReps: ['10-12', '8-10', '8-10'], restSeconds: 75,
    animation: { direction: 'forward_back', joint: 'shoulder', rangeLabel: '向前伸展 / 向后拉到腹部' },
  },
  {
    name: '单臂哑铃划船', muscleGroup: '背部', secondaryMuscles: ['肱二头肌', '核心'],
    difficulty: 'beginner', type: 'compound',
    description: '单侧训练，纠正左右不平衡，对背阔肌刺激极佳',
    formCues: ['同侧手膝支撑在凳上', '背保持水平', '哑铃拉到髋部', '肘部贴近身体'],
    commonMistakes: ['旋转躯干借力', '弓背', '哑铃拉得太前面'],
    defaultSets: [3, 3, 3], defaultReps: ['10-12', '8-10', '8-10'], restSeconds: 75,
    animation: { direction: 'up_down', joint: 'shoulder', rangeLabel: '哑铃下放 / 拉到髋部' },
  },
  {
    name: '直臂下压', muscleGroup: '背阔肌', secondaryMuscles: ['肱三头肌长头', '核心'],
    difficulty: 'beginner', type: 'isolation',
    description: '孤立刺激背阔肌，打造V型背部线条',
    formCues: ['手臂微屈保持不变', '肩胛骨先下沉', '用背阔肌发力下压', '到顶点挤压1秒'],
    commonMistakes: ['手臂屈伸过大（变成三头训练）', '身体晃动借力', '耸肩完成动作'],
    defaultSets: [3, 3, 3], defaultReps: ['12-15', '10-12', '10-12'], restSeconds: 60,
    animation: { direction: 'up_down', joint: 'shoulder', rangeLabel: '手臂上抬 / 下压至大腿前方' },
  },
];

// --- Legs 腿部 ---
export const LEG_EXERCISES: Exercise[] = [
  {
    name: '杠铃深蹲', muscleGroup: '腿部', secondaryMuscles: ['核心', '下背部', '臀部'],
    difficulty: 'intermediate', type: 'compound',
    description: '健身三大项之一，下肢力量的基石，促进全身睾酮分泌',
    formCues: ['杠铃放在斜方肌上（非颈椎）', '双脚略宽于肩，脚尖微外八', '下蹲时臀部后坐，膝盖与脚尖同方向', '至少蹲到大腿与地面平行', '全脚掌踩实，重心在脚后跟'],
    commonMistakes: ['膝盖内扣', '脚跟离地', '背部弓起（早安式深蹲）', '半蹲（深度不够）'],
    safetyWarning: '务必使用深蹲架和保护杠。初学者先用空杆或PVC管练习动作模式。腰部有伤请咨询医生。',
    defaultSets: [3, 4, 5], defaultReps: ['8-10', '6-8', '4-6'], restSeconds: 120,
    animation: { direction: 'up_down', joint: 'whole_body', rangeLabel: '下蹲至大腿平行 / 站起至直立' },
  },
  {
    name: '腿举(倒蹬)', muscleGroup: '腿部', secondaryMuscles: ['臀部'],
    difficulty: 'beginner', type: 'compound',
    description: '安全的大重量腿部训练，减少腰椎压力',
    formCues: ['脚放在踏板上部，间距与肩同宽', '下降时膝盖向胸部靠近（不超过90度）', '推起时不完全锁死膝盖', '全程下背部贴合椅背'],
    commonMistakes: ['膝盖锁死', '下降太深使臀部离凳', '双手推膝借力'],
    safetyWarning: '不要把安全锁当"休息"位。下降时不要低于膝盖90度。',
    defaultSets: [3, 3, 4], defaultReps: ['10-12', '8-10', '6-8'], restSeconds: 90,
    animation: { direction: 'forward_back', joint: 'knee', rangeLabel: '膝盖弯曲下降 / 蹬起到接近伸直' },
  },
  {
    name: '哑铃弓步蹲', muscleGroup: '腿部', secondaryMuscles: ['臀部', '核心'],
    difficulty: 'beginner', type: 'compound',
    description: '单侧训练纠正左右不平衡，增强核心稳定性',
    formCues: ['前腿膝盖不超过脚尖', '后腿膝盖接近地面但不触碰', '身体直立，核心收紧', '前腿发力推回起始位置'],
    commonMistakes: ['前膝超过脚尖过多', '身体前倾', '后脚踮起不稳'],
    defaultSets: [3, 3, 3], defaultReps: ['10/边', '10/边', '8/边'], restSeconds: 75,
    animation: { direction: 'up_down', joint: 'whole_body', rangeLabel: '弓步下降 / 推回站立位' },
  },
  {
    name: '腿弯举', muscleGroup: '大腿后侧(腘绳肌)', secondaryMuscles: [],
    difficulty: 'beginner', type: 'isolation',
    description: '孤立训练腘绳肌，膝关节健康和短跑速度的关键',
    formCues: ['髋部紧贴垫子', '勾腿至小腿垂直地面', '离心缓慢下放3秒', '踝关节放松'],
    commonMistakes: ['髋部抬起借力', '用惯性弹起', '勾腿不充分'],
    defaultSets: [3, 3, 3], defaultReps: ['12-15', '10-12', '10-12'], restSeconds: 60,
    animation: { direction: 'up_down', joint: 'knee', rangeLabel: '小腿下放 / 勾起至垂直' },
  },
  {
    name: '罗马尼亚硬拉', muscleGroup: '大腿后侧', secondaryMuscles: ['下背部', '臀部', '前臂'],
    difficulty: 'intermediate', type: 'compound',
    description: '后链经典动作，发展腘绳肌和臀部，改善弯腰姿势',
    formCues: ['膝盖微屈（不变角度）', '髋关节铰链——臀部后推', '杠铃贴着腿部下放', '下降至腘绳肌拉伸感（通常膝盖下方）', '用臀部推回起始位'],
    commonMistakes: ['弓背（最危险！）', '膝盖锁死', '杠铃离开身体太远', '过度下降导致腰椎屈曲'],
    safetyWarning: '这是腘绳肌+臀部动作，不是下背动作。腰痛立即停止。从轻重量开始学习髋关节铰链模式。',
    defaultSets: [3, 3, 4], defaultReps: ['8-10', '8-10', '6-8'], restSeconds: 90,
    animation: { direction: 'forward_back', joint: 'hip', rangeLabel: '臀部后推/杠铃下放 / 臀部前推/站起' },
  },
  {
    name: '腿屈伸', muscleGroup: '大腿前侧(股四头肌)', secondaryMuscles: [],
    difficulty: 'beginner', type: 'isolation',
    description: '股四头肌孤立训练，膝盖康复和腿部塑形的首选',
    formCues: ['调整坐姿，膝盖对齐器械轴心', '从90度蹬到完全伸直', '顶峰收缩1秒', '离心控制2-3秒'],
    commonMistakes: ['用惯性弹起', '不完全伸直', '速度太快'],
    safetyWarning: 'ACL 损伤康复期请在物理治疗师指导下使用。不要太重——这是孤立动作。',
    defaultSets: [3, 3, 3], defaultReps: ['12-15', '10-12', '10-12'], restSeconds: 60,
    animation: { direction: 'up_down', joint: 'knee', rangeLabel: '膝盖弯曲 / 腿蹬直' },
  },
  {
    name: '小腿提踵', muscleGroup: '小腿(腓肠肌/比目鱼肌)', secondaryMuscles: [],
    difficulty: 'beginner', type: 'isolation',
    description: '小腿训练的唯二动作之一，增加踝关节力量和稳定性',
    formCues: ['全幅度：从最低点到最高点', '顶峰停顿1秒', '离心3-4秒（小腿对离心刺激最敏感）', '站姿侧重腓肠肌，坐姿侧重比目鱼肌'],
    commonMistakes: ['只用弹力完成（不做全幅度）', '速度太快', '重量过大导致借力'],
    defaultSets: [4, 4, 5], defaultReps: ['15-20', '12-15', '10-12'], restSeconds: 45,
    animation: { direction: 'up_down', joint: 'knee', rangeLabel: '脚后跟下放 / 踮到最高' },
  },
];

// --- Shoulders ---
export const SHOULDER_EXERCISES: Exercise[] = [
  {
    name: '哑铃推举', muscleGroup: '肩部', secondaryMuscles: ['肱三头肌', '上胸'],
    difficulty: 'beginner', type: 'compound',
    description: '肩部训练基础动作，发展三角肌厚度和上肢推力',
    formCues: ['哑铃放在肩部高度，掌心朝前', '推起至头顶上方（不要完全锁死肘）', '核心收紧保持稳定', '下放至耳朵高度'],
    commonMistakes: ['过度弓背借力', '哑铃在顶部相碰', '下降太低给肩关节压力'],
    safetyWarning: '肩关节有撞击者，下放时不要低于耳朵高度。可用器械推举替代。',
    defaultSets: [3, 3, 4], defaultReps: ['10-12', '8-10', '6-8'], restSeconds: 75,
    animation: { direction: 'up_down', joint: 'shoulder', rangeLabel: '下降至肩部 / 推起到头顶' },
  },
  {
    name: '哑铃侧平举', muscleGroup: '肩部(中束)', secondaryMuscles: ['斜方肌'],
    difficulty: 'beginner', type: 'isolation',
    description: '打造宽阔肩膀的关键动作，增加三角肌中束宽度',
    formCues: ['肘部微屈不变', '从身体两侧抬起，像"倒水"一样', '抬起至肩高（不超过）', '离心控制下降'],
    commonMistakes: ['耸肩（用斜方肌代偿）', '抬起过高（超肩高给肩关节压力）', '用惯性甩起', '手臂完全伸直'],
    defaultSets: [3, 4, 4], defaultReps: ['12-15', '10-12', '10-12'], restSeconds: 60,
    animation: { direction: 'up_down', joint: 'shoulder', rangeLabel: '手臂下垂 / 抬起至肩高' },
  },
  {
    name: '杠铃实力推举', muscleGroup: '肩部', secondaryMuscles: ['肱三头肌', '核心', '上胸'],
    difficulty: 'intermediate', type: 'compound',
    description: '站立推举，全身力量标志，发展肩部和核心稳定性',
    formCues: ['杠铃从前肩开始', '核心和臀肌收紧保持稳定', '头微后仰让杠铃通过面部', '推起后头回到中立位', '杠铃轨迹为直线'],
    commonMistakes: ['过度后仰（腰椎危险）', '杠铃未完全过头', '双脚不稳'],
    safetyWarning: '与卧推一样需要保护。腰部有伤用坐姿代替。',
    defaultSets: [3, 3, 4], defaultReps: ['8-10', '6-8', '4-6'], restSeconds: 90,
    animation: { direction: 'up_down', joint: 'shoulder', rangeLabel: '从锁骨高度 / 推起到头顶上方' },
  },
  {
    name: '反向飞鸟', muscleGroup: '肩部(后束)', secondaryMuscles: ['菱形肌', '斜方肌中下部'],
    difficulty: 'beginner', type: 'isolation',
    description: '后三角肌训练，改善向前圆肩的姿势问题',
    formCues: ['俯身至躯干接近水平', '肘部微屈不变', '向两侧打开，像"展翅"', '顶峰挤压肩胛骨'],
    commonMistakes: ['耸肩', '用腰部摆动借力', '手臂弯曲太多（变成划船）'],
    defaultSets: [3, 3, 3], defaultReps: ['12-15', '10-12', '10-12'], restSeconds: 60,
    animation: { direction: 'forward_back', joint: 'shoulder', rangeLabel: '手臂下垂 / 向两侧打开' },
  },
  {
    name: '阿诺德推举', muscleGroup: '肩部', secondaryMuscles: ['肱三头肌', '肱二头肌'],
    difficulty: 'intermediate', type: 'compound',
    description: '阿诺德施瓦辛格命名的动作，旋转推举同时刺激前/中/后束',
    formCues: ['起始：哑铃在胸前掌心朝自己', '推起同时外旋掌心朝前', '下降到最高点后反方向旋转回来', '全程控制，不要借力'],
    commonMistakes: ['旋转太快失去控制', '重量太重无法完成完整幅度', '肘部下垂过低'],
    defaultSets: [3, 3, 3], defaultReps: ['10-12', '8-10', '8-10'], restSeconds: 75,
    animation: { direction: 'rotation', joint: 'shoulder', rangeLabel: '胸前旋转 / 推起到头顶外旋' },
  },
  {
    name: '哑铃前平举', muscleGroup: '肩部(前束)', secondaryMuscles: ['上胸'],
    difficulty: 'beginner', type: 'isolation',
    description: '前三角肌孤立训练，但卧推/推举已有大量刺激，可做辅助',
    formCues: ['交替或同时抬起', '抬至肩高即可', '控制下放', '不要借力摆动'],
    commonMistakes: ['借力摆动', '抬得太高', '手臂完全伸直'],
    defaultSets: [3, 3, 3], defaultReps: ['12-15', '10-12', '10-12'], restSeconds: 60,
    animation: { direction: 'up_down', joint: 'shoulder', rangeLabel: '手臂下垂 / 前举至肩高' },
  },
];

// --- Arms ---
export const ARM_EXERCISES: Exercise[] = [
  {
    name: '杠铃弯举', muscleGroup: '肱二头肌', secondaryMuscles: ['前臂'],
    difficulty: 'beginner', type: 'isolation',
    description: '二头肌训练的黄金动作',
    formCues: ['肘部固定在身体两侧', '弯举至最高点，顶峰收缩1秒', '离心控制下放3秒', '不摆动不借力'],
    commonMistakes: ['借力摇摆', '肘部前移（前三角肌借力）', '半程弯举', '重量太大无法控制'],
    defaultSets: [3, 3, 4], defaultReps: ['10-12', '8-10', '6-8'], restSeconds: 60,
    animation: { direction: 'up_down', joint: 'elbow', rangeLabel: '手臂下垂 / 弯举至胸前' },
  },
  {
    name: '绳索下压', muscleGroup: '肱三头肌', secondaryMuscles: [],
    difficulty: 'beginner', type: 'isolation',
    description: '三头肌外侧头训练，塑造手臂马蹄形线条',
    formCues: ['肘部紧贴身体两侧', '下压至手臂完全伸直', '顶峰挤压三头肌', '缓慢回到90度'],
    commonMistakes: ['肘部离开身体（变成下拉）', '用体重下压', '缆绳晃动'],
    defaultSets: [3, 3, 3], defaultReps: ['12-15', '10-12', '8-10'], restSeconds: 60,
    animation: { direction: 'up_down', joint: 'elbow', rangeLabel: '前臂抬起 / 下压至手臂伸直' },
  },
  {
    name: '哑铃交替弯举', muscleGroup: '肱二头肌', secondaryMuscles: ['前臂'],
    difficulty: 'beginner', type: 'isolation',
    description: '交替弯举，更好地感受每侧肌肉收缩',
    formCues: ['坐姿交替进行', '弯举时手掌旋转（旋后）增强收缩', '肘部固定在身体两侧', '一侧完成后换另一侧'],
    commonMistakes: ['身体摆动借力', '下放过快', '没有旋后（掌心一直朝自己）'],
    defaultSets: [3, 3, 3], defaultReps: ['10-12', '8-10', '8-10'], restSeconds: 60,
    animation: { direction: 'rotation', joint: 'elbow', rangeLabel: '交替旋转弯举 / 交替下放' },
  },
  {
    name: '窄距卧推', muscleGroup: '肱三头肌', secondaryMuscles: ['胸部', '前三角肌'],
    difficulty: 'intermediate', type: 'compound',
    description: '三头肌的大重量复合动作，同时刺激胸和肩',
    formCues: ['双手间距与肩同宽或略窄', '肘部紧贴身体下降', '杠铃下降到下胸部', '推起至手臂伸直'],
    commonMistakes: ['手握太窄（对手腕不友好）', '肘部外展', '借力弹胸'],
    safetyWarning: '手腕有伤慎用。握距不要窄于肩宽太多。',
    defaultSets: [3, 3, 3], defaultReps: ['8-10', '6-8', '6-8'], restSeconds: 75,
    animation: { direction: 'up_down', joint: 'elbow', rangeLabel: '杠铃下降至胸 / 推到手臂伸直' },
  },
  {
    name: '锤式弯举', muscleGroup: '肱肌+肱二头肌', secondaryMuscles: ['肱桡肌'],
    difficulty: 'beginner', type: 'isolation',
    description: '掌心相对的弯举，发展肱肌（二头肌下方的肌肉，推高二头肌峰值）',
    formCues: ['掌心相对（锤子握法）', '同时弯举（不需要交替）', '肘部固定', '顶峰收缩'],
    commonMistakes: ['身体摆动', '借力', '下降太快'],
    defaultSets: [3, 3, 3], defaultReps: ['10-12', '8-10', '8-10'], restSeconds: 60,
    animation: { direction: 'up_down', joint: 'elbow', rangeLabel: '手臂下垂 / 弯举（锤式）' },
  },
  {
    name: '仰卧臂屈伸', muscleGroup: '肱三头肌', secondaryMuscles: [],
    difficulty: 'intermediate', type: 'isolation',
    description: '三头肌长头训练，EZ杠在头后屈伸',
    formCues: ['上臂保持垂直不动', '屈肘将杠铃放到头后', '伸展回到垂直位置', '只有前臂移动'],
    commonMistakes: ['上臂移动（变成卧推）', '重量过大失去控制', '碰到头部'],
    safetyWarning: '这是"头碎者"——务必控制重量。用EZ杠减少手腕压力。',
    defaultSets: [3, 3, 3], defaultReps: ['10-12', '8-10', '8-10'], restSeconds: 60,
    animation: { direction: 'up_down', joint: 'elbow', rangeLabel: '前臂下放至头后 / 伸展至垂直' },
  },
];

// --- Core ---
export const CORE_EXERCISES: Exercise[] = [
  {
    name: '平板支撑', muscleGroup: '核心', secondaryMuscles: ['肩部', '臀部'],
    difficulty: 'beginner', type: 'bodyweight',
    description: '核心耐力的黄金训练，保护腰椎的基础',
    formCues: ['前臂撑地，肘在肩正下方', '身体从头到脚一条直线', '臀部收紧，核心绷紧', '正常呼吸，不要憋气'],
    commonMistakes: ['塌腰（核心放松）', '臀部过高', '憋气', '头下垂或抬高'],
    defaultSets: [3, 4, 5], defaultReps: ['30秒', '45秒', '60秒+'], restSeconds: 45,
    animation: { direction: 'static_hold', joint: 'whole_body', rangeLabel: '保持姿势不动' },
  },
  {
    name: '卷腹', muscleGroup: '腹直肌', secondaryMuscles: ['腹斜肌'],
    difficulty: 'beginner', type: 'bodyweight',
    description: '科学替代仰卧起坐，减少腰椎压力，更有效刺激腹肌',
    formCues: ['下背始终贴地', '肩胛骨离开地面即可（不要全坐起）', '手放在耳侧（不拉脖子）', '顶峰收缩1秒'],
    commonMistakes: ['手拉脖子', '用惯性弹起', '全坐起（变成髋屈肌训练）', '下背离地'],
    defaultSets: [3, 3, 4], defaultReps: ['15-20', '20-25', '25+'], restSeconds: 45,
    animation: { direction: 'up_down', joint: 'spine', rangeLabel: '躺平 / 卷起肩胛骨离地' },
  },
  {
    name: '举腿', muscleGroup: '下腹部', secondaryMuscles: ['髋屈肌'],
    difficulty: 'intermediate', type: 'bodyweight',
    description: '下腹训练，悬垂或仰卧均可',
    formCues: ['仰卧：下背贴地', '悬垂：控制摆动', '腿举到 90 度或更高', '缓慢下放不碰地'],
    commonMistakes: ['用惯性摆动', '下背离地（仰卧版）', '腿放得太低失去腹肌张力'],
    defaultSets: [3, 3, 3], defaultReps: ['10-12', '12-15', '15+'], restSeconds: 60,
    animation: { direction: 'up_down', joint: 'hip', rangeLabel: '腿下放 / 举起至90度' },
  },
  {
    name: '俄罗斯转体', muscleGroup: '腹斜肌', secondaryMuscles: ['腹直肌'],
    difficulty: 'beginner', type: 'bodyweight',
    description: '核心旋转训练，发展腹斜肌和旋转爆发力',
    formCues: ['坐姿，脚离地（进阶）或着地（基础）', '躯干后倾45度', '左右旋转，控制节奏', '可用药球/哑铃增加负荷'],
    commonMistakes: ['只转手臂不转躯干', '用惯性乱晃', '弓背'],
    defaultSets: [3, 3, 3], defaultReps: ['20次', '30次', '40次'], restSeconds: 45,
    animation: { direction: 'rotation', joint: 'spine', rangeLabel: '左转 / 右转' },
  },
  {
    name: '超人式', muscleGroup: '下背部(竖脊肌)', secondaryMuscles: ['臀部', '肩部'],
    difficulty: 'beginner', type: 'bodyweight',
    description: '下背部康复和预防训练，改善姿势',
    formCues: ['俯卧，手臂伸直向前', '同时抬起手臂和腿（像超人飞行）', '顶峰收缩1-2秒', '缓慢下降'],
    commonMistakes: ['抬得太高（过度伸展腰椎）', '用爆发力弹起', '憋气'],
    safetyWarning: '已有腰椎间盘问题者请先咨询医生。轻度抬起即可。',
    defaultSets: [3, 3, 3], defaultReps: ['12-15', '15-20', '20+'], restSeconds: 45,
    animation: { direction: 'static_hold', joint: 'spine', rangeLabel: '同时抬起 / 缓慢放下' },
  },
];

// --- Cardio ---
export const CARDIO_EXERCISES: Exercise[] = [
  {
    name: '慢跑', muscleGroup: '全身', secondaryMuscles: [],
    difficulty: 'beginner', type: 'cardio',
    description: '最基础的有氧运动，改善心肺功能，燃烧脂肪',
    formCues: ['保持中等强度（可以说话但不能唱歌）', '步伐轻盈，中足着地', '手臂自然摆动', '心率维持最大心率的60-70%'],
    commonMistakes: ['脚后跟着地（刹车效应）', '手臂横摆', '步幅过大'],
    defaultSets: [1, 1, 1], defaultReps: ['20分钟', '30分钟', '45分钟'], restSeconds: 0,
    animation: { direction: 'alternating', joint: 'whole_body', rangeLabel: '交替前进' },
  },
  {
    name: 'HIIT', muscleGroup: '全身', secondaryMuscles: [],
    difficulty: 'advanced', type: 'cardio',
    description: '高强度间歇训练：短时间全力+短暂休息循环，EPOC效应持续燃脂24小时',
    formCues: ['全力阶段：85-95%最大心率', '休息阶段：保持活动不完全停', '典型比例：30秒全力/30秒休息', '总时长15-20分钟即可'],
    commonMistakes: ['全力阶段不够努力', '休息太长变成普通有氧', '一周太多（建议2-3次）', '空腹做HIIT'],
    safetyWarning: '心血管疾病患者避免HIIT。初学者从慢跑开始，不要直接做HIIT。',
    defaultSets: [0, 1, 1], defaultReps: ['', '15分钟', '20分钟'], restSeconds: 0,
    animation: { direction: 'alternating', joint: 'whole_body', rangeLabel: '快慢交替' },
  },
  {
    name: '跳绳', muscleGroup: '全身', secondaryMuscles: ['小腿', '前臂'],
    difficulty: 'intermediate', type: 'cardio',
    description: '燃脂效率极高，10分钟跳绳≈30分钟慢跑，同时训练协调性',
    formCues: ['手腕旋转，不是手臂', '脚尖轻跳（离地2-3cm）', '膝盖微屈缓冲', '身体直立，核心收紧'],
    commonMistakes: ['跳太高（浪费能量+给膝盖压力）', '手臂甩绳（应该是手腕）', '脚后跟着地'],
    defaultSets: [1, 1, 1], defaultReps: ['10分钟', '15分钟', '20分钟'], restSeconds: 0,
    animation: { direction: 'up_down', joint: 'whole_body', rangeLabel: '连续跳跃 / 手腕旋转' },
  },
  {
    name: '椭圆机', muscleGroup: '全身', secondaryMuscles: ['腿部', '臀部'],
    difficulty: 'beginner', type: 'cardio',
    description: '零冲击有氧，关节友好，适合大体重和康复期',
    formCues: ['脚不离踏板', '阻力适中，维持目标心率', '可以正反交替（反向更练腿后侧）', '身体正直，不要趴器械'],
    commonMistakes: ['完全无阻力（白费时间）', '趴在把手上', '速度忽快忽慢'],
    defaultSets: [1, 1, 1], defaultReps: ['20分钟', '30分钟', '40分钟'], restSeconds: 0,
    animation: { direction: 'circular', joint: 'whole_body', rangeLabel: '椭圆轨迹循环' },
  },
  {
    name: '动感单车', muscleGroup: '下肢', secondaryMuscles: ['核心'],
    difficulty: 'beginner', type: 'cardio',
    description: '室内骑行，高效燃脂且关节友好',
    formCues: ['座椅高度：脚踩到最低点膝盖微屈约15度', '核心收紧，上半身稳定', '阻力不能为零', '保持踏频80-100rpm'],
    commonMistakes: ['座椅太低（膝盖压力）', '完全无阻力', '上半身剧烈晃动'],
    defaultSets: [1, 1, 1], defaultReps: ['20分钟', '30分钟', '45分钟'], restSeconds: 0,
    animation: { direction: 'circular', joint: 'knee', rangeLabel: '双腿交替踩踏循环' },
  },
];

// --- Flexibility ---
export const FLEXIBILITY_EXERCISES: Exercise[] = [
  {
    name: '全身静态拉伸', muscleGroup: '全身', secondaryMuscles: [],
    difficulty: 'beginner', type: 'flexibility',
    description: '训练后必做，每个肌群30秒静态拉伸，改善柔韧性',
    formCues: ['拉伸到轻微不适感（不是疼痛）', '保持30秒不动', '正常呼吸，呼气时加深', '不要弹震'],
    commonMistakes: ['弹震式拉伸（容易拉伤）', '拉伸到疼痛范围', '憋气'],
    defaultSets: [1, 1, 1], defaultReps: ['10分钟', '15分钟', '20分钟'], restSeconds: 0,
    animation: { direction: 'static_hold', joint: 'whole_body', rangeLabel: '各肌群各保持30秒' },
  },
  {
    name: '瑜伽流', muscleGroup: '全身', secondaryMuscles: [],
    difficulty: 'intermediate', type: 'flexibility',
    description: '基础瑜伽串联（下犬式→上犬式→战士），提升柔韧+力量+专注',
    formCues: ['呼吸引导动作（吸气伸展/呼气收缩）', '每个体式保持3-5个呼吸', '动作之间流畅过渡', '关注身体感受，不追求形态完美'],
    commonMistakes: ['屏住呼吸', '过度追求柔韧（超过当前能力）', '动作之间不连贯'],
    defaultSets: [1, 1, 1], defaultReps: ['15分钟', '20分钟', '30分钟'], restSeconds: 0,
    animation: { direction: 'forward_back', joint: 'whole_body', rangeLabel: '体式之间流畅过渡' },
  },
  {
    name: '泡沫轴放松', muscleGroup: '全身', secondaryMuscles: [],
    difficulty: 'beginner', type: 'flexibility',
    description: '自我筋膜放松，缓解肌肉酸痛和紧绷',
    formCues: ['在紧张区域缓慢滚动', '找到痛点停顿30秒', '每个部位滚1-2分钟', '不要直接滚关节和骨头'],
    commonMistakes: ['滚太快', '直接滚腰椎（危险！）', '在同一个痛点滚太久'],
    safetyWarning: '不要直接滚腰椎/颈椎。正在发炎或受伤部位避免。',
    defaultSets: [1, 1, 1], defaultReps: ['10分钟', '15分钟', '15分钟'], restSeconds: 0,
    animation: { direction: 'forward_back', joint: 'whole_body', rangeLabel: '各肌群缓慢滚动' },
  },
];

// --- Pick exercises utility ---
export function pickExercises(
  pool: Exercise[],
  level: 'beginner' | 'intermediate' | 'advanced',
  count: number,
): Exercise[] {
  const suitable = pool.filter((e) => {
    if (level === 'beginner') return e.difficulty === 'beginner' || e.difficulty === 'intermediate';
    if (level === 'intermediate') return e.difficulty !== 'advanced';
    return true;
  });
  const shuffled = [...suitable].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
