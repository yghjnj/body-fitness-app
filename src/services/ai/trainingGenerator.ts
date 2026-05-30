import {
  CHEST_EXERCISES, BACK_EXERCISES, LEG_EXERCISES,
  SHOULDER_EXERCISES, ARM_EXERCISES, CORE_EXERCISES,
  CARDIO_EXERCISES, FLEXIBILITY_EXERCISES,
  pickExercises,
  type Exercise,
} from '../../data/exercises';
import type { GoalType } from '../../types/models';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface TrainingDay {
  dayName: string;
  focus: string;
  exercises: Exercise[];
}

export interface TrainingPlan {
  planName: string;
  weeklySchedule: TrainingDay[];
  progressionStrategy: string;
  warmUpAdvice: string;
  coolDownAdvice: string;
  goalNote: string;
}

interface UserParams {
  gender: 'male' | 'female';
  age: number;
  goal?: GoalType;
  experience?: ExperienceLevel;
}

// --- Split definitions ---
type SplitTemplate = {
  name: (goal: string) => string;
  days: { dayName: string; focus: string; pickFn: (level: ExperienceLevel) => Exercise[] }[];
  progression: string;
  warmUp: string;
  coolDown: string;
};

const BEGINNER_FULL_BODY: SplitTemplate = {
  name: (goal) => `${goal} · 新手全身训练`,
  days: [
    {
      dayName: '周一', focus: '全身力量 A',
      pickFn: (lvl) => [
        ...pickExercises(LEG_EXERCISES, lvl, 2),
        ...pickExercises(CHEST_EXERCISES, lvl, 1),
        ...pickExercises(BACK_EXERCISES, lvl, 1),
        ...pickExercises(CORE_EXERCISES, lvl, 1),
      ],
    },
    {
      dayName: '周三', focus: '全身力量 B',
      pickFn: (lvl) => [
        ...pickExercises(LEG_EXERCISES, lvl, 2),
        ...pickExercises(SHOULDER_EXERCISES, lvl, 1),
        ...pickExercises(BACK_EXERCISES, lvl, 1),
        ...pickExercises(ARM_EXERCISES, lvl, 1),
        ...pickExercises(CORE_EXERCISES, lvl, 1),
      ],
    },
    {
      dayName: '周五', focus: '全身力量 C',
      pickFn: (lvl) => [
        ...pickExercises(LEG_EXERCISES, lvl, 2),
        ...pickExercises(CHEST_EXERCISES, lvl, 1),
        ...pickExercises(BACK_EXERCISES, lvl, 1),
        ...pickExercises(SHOULDER_EXERCISES, lvl, 1),
        ...pickExercises(CORE_EXERCISES, lvl, 1),
      ],
    },
    {
      dayName: '周六', focus: '有氧 + 核心',
      pickFn: (lvl) => [
        ...pickExercises(CARDIO_EXERCISES, lvl, 1),
        ...pickExercises(CORE_EXERCISES, lvl, 2),
        ...pickExercises(FLEXIBILITY_EXERCISES, lvl, 1),
      ],
    },
  ],
  progression: '每周增加 1-2 次重复或 2.5kg 负重。每 4 周测试一次 5RM 评估进步。动作熟练后可升级到上下肢分离计划。',
  warmUp: '5 分钟轻度有氧（跳绳/慢跑/椭圆机）+ 动态拉伸（开合跳、腿摆、臂绕环）',
  coolDown: '5-10 分钟静态拉伸主要训练肌群，每个动作保持 20-30 秒',
};

const INTERMEDIATE_UPPER_LOWER: SplitTemplate = {
  name: (goal) => `${goal} · 上下肢分离`,
  days: [
    {
      dayName: '周一', focus: '上肢推（胸+肩+三头）',
      pickFn: (lvl) => [
        ...pickExercises(CHEST_EXERCISES, lvl, 2),
        ...pickExercises(SHOULDER_EXERCISES, lvl, 2),
        ...pickExercises(ARM_EXERCISES, lvl, 1),
      ],
    },
    {
      dayName: '周二', focus: '下肢（腿+核心）',
      pickFn: (lvl) => [
        ...pickExercises(LEG_EXERCISES, lvl, 3),
        ...pickExercises(CORE_EXERCISES, lvl, 2),
      ],
    },
    {
      dayName: '周四', focus: '上肢拉（背+二头+肩后束）',
      pickFn: (lvl) => [
        ...pickExercises(BACK_EXERCISES, lvl, 2),
        ...pickExercises(SHOULDER_EXERCISES, lvl, 1),
        ...pickExercises(ARM_EXERCISES, lvl, 2),
      ],
    },
    {
      dayName: '周五', focus: '下肢 + 全身爆发',
      pickFn: (lvl) => [
        ...pickExercises(LEG_EXERCISES, lvl, 3),
        ...pickExercises(CORE_EXERCISES, lvl, 2),
      ],
    },
    {
      dayName: '周日', focus: '有氧 + 柔韧',
      pickFn: (lvl) => [
        ...pickExercises(CARDIO_EXERCISES, lvl, 1),
        ...pickExercises(FLEXIBILITY_EXERCISES, lvl, 1),
      ],
    },
  ],
  progression: '每周目标重量增加 2.5-5kg 或额外 1-2 次重复。每 4 周测试一次最大重量。每 8 周可切换一次训练重点。',
  warmUp: '5-8 分钟轻度有氧 + 动态拉伸 + 热身组（目标重量的 50%/70% 各 8-10 次）',
  coolDown: '10 分钟静态拉伸 + 泡沫轴放松主要发力肌群',
};

const ADVANCED_PUSH_PULL_LEGS: SplitTemplate = {
  name: (goal) => `${goal} · 推拉腿分离`,
  days: [
    {
      dayName: '周一', focus: '推（胸+肩+三头）',
      pickFn: (lvl) => [
        ...pickExercises(CHEST_EXERCISES, lvl, 3),
        ...pickExercises(SHOULDER_EXERCISES, lvl, 2),
        ...pickExercises(ARM_EXERCISES, lvl, 1),
      ],
    },
    {
      dayName: '周二', focus: '拉（背+二头+后束）',
      pickFn: (lvl) => [
        ...pickExercises(BACK_EXERCISES, lvl, 3),
        ...pickExercises(ARM_EXERCISES, lvl, 2),
      ],
    },
    {
      dayName: '周三', focus: '腿（大腿+小腿+核心）',
      pickFn: (lvl) => [
        ...pickExercises(LEG_EXERCISES, lvl, 4),
        ...pickExercises(CORE_EXERCISES, lvl, 2),
      ],
    },
    {
      dayName: '周四', focus: '推（胸+肩+三头）变式',
      pickFn: (lvl) => [
        ...pickExercises(CHEST_EXERCISES, lvl, 2),
        ...pickExercises(SHOULDER_EXERCISES, lvl, 2),
        ...pickExercises(ARM_EXERCISES, lvl, 2),
      ],
    },
    {
      dayName: '周五', focus: '拉（背+二头）变式 + 硬拉',
      pickFn: (lvl) => [
        ...pickExercises(BACK_EXERCISES, lvl, 3),
        ...pickExercises(ARM_EXERCISES, lvl, 1),
      ],
    },
    {
      dayName: '周六', focus: '腿（下肢+爆发+核心）',
      pickFn: (lvl) => [
        ...pickExercises(LEG_EXERCISES, lvl, 4),
        ...pickExercises(CORE_EXERCISES, lvl, 2),
      ],
    },
    {
      dayName: '周日', focus: '主动恢复',
      pickFn: (lvl) => [
        ...pickExercises(CARDIO_EXERCISES, lvl, 1),
        ...pickExercises(FLEXIBILITY_EXERCISES, lvl, 2),
      ],
    },
  ],
  progression: '使用周期化训练：第 1 周 65-70% 1RM 高次数，第 2 周 75-80%，第 3 周 80-85%，第 4 周减载 50-60%。每周期测试 1RM。',
  warmUp: '10 分钟有氧 + 动态拉伸 + 激活组（弹力带激活目标肌群）+ 递增热身组',
  coolDown: '15 分钟静态拉伸 + 泡沫轴 + 如有条件冷水浴/冷热交替淋浴促进恢复',
};

function selectSplit(experience: ExperienceLevel): SplitTemplate {
  if (experience === 'advanced') return ADVANCED_PUSH_PULL_LEGS;
  if (experience === 'intermediate') return INTERMEDIATE_UPPER_LOWER;
  return BEGINNER_FULL_BODY;
}

function goalLabel(goal?: GoalType): string {
  switch (goal) {
    case 'weight_loss': return '减脂塑形';
    case 'muscle_gain': return '增肌增重';
    case 'maintenance': return '维持健康';
    default: return '全面体能';
  }
}

function goalNote(goal?: GoalType, gender?: string): string {
  const base = gender === 'female' ? '女性' : '男性';
  switch (goal) {
    case 'weight_loss':
      return `${base}减脂方案：以复合动作为主消耗更多热量，组间休息控制在 60 秒以内，可加入超级组提高心率。力量训练后做 20-30 分钟有氧效果更佳。`;
    case 'muscle_gain':
      return `${base}增肌方案：注重大重量复合动作（深蹲、卧推、硬拉、推举），每组做到接近力竭。保证训练后 30 分钟内补充蛋白质和碳水。`;
    default:
      return `${base}健康维持方案：力量+有氧+柔韧均衡搭配，保持运动习惯。`;
  }
}

export function generateTrainingPlan(params: UserParams): TrainingPlan {
  const experience = params.experience || 'beginner';
  const split = selectSplit(experience);
  const goal = goalLabel(params.goal);

  const weeklySchedule: TrainingDay[] = split.days.map((day) => ({
    dayName: day.dayName,
    focus: day.focus,
    exercises: day.pickFn(experience),
  }));

  return {
    planName: split.name(goal),
    weeklySchedule,
    progressionStrategy: split.progression,
    warmUpAdvice: split.warmUp,
    coolDownAdvice: split.coolDown,
    goalNote: goalNote(params.goal, params.gender),
  };
}
