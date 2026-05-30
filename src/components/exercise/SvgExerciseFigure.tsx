import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

// Human body proportions with proper joint connections
// Uses a standard Animated.Value to drive interpolated SVG coordinates

const SKIN = '#FBBF24';
const OUTFIT = '#3B82F6';
const HEAD_R = 10;
const NECK = 8;
const TORSO = 42;
const UPPER_ARM = 28;
const LOWER_ARM = 24;
const UPPER_LEG = 34;
const LOWER_LEG = 30;
const CX = 100;
const GROUND_Y = 215;

type PoseDef = {
  bodyY: [number, number];
  lShoulder: [number, number]; lElbow: [number, number];
  rShoulder: [number, number]; rElbow: [number, number];
  lHip: [number, number]; lKnee: [number, number];
  rHip: [number, number]; rKnee: [number, number];
};

// Joint angles in degrees — [top_position, bottom_position]
const deg = (d: number) => d;
const POSES: Record<string, PoseDef> = {
  press: {
    bodyY: [100, 100], lShoulder: [-100, -25], lElbow: [10, 75], rShoulder: [-100, -25], rElbow: [10, 75],
    lHip: [5, 5], lKnee: [0, 0], rHip: [5, 5], rKnee: [0, 0],
  },
  squat: {
    bodyY: [100, 80], lShoulder: [-60, -70], lElbow: [-40, -30], rShoulder: [-60, -70], rElbow: [-40, -30],
    lHip: [0, 55], lKnee: [0, 70], rHip: [0, 55], rKnee: [0, 70],
  },
  curl: {
    bodyY: [100, 100], lShoulder: [-10, -10], lElbow: [0, 0], rShoulder: [-10, -10], rElbow: [-120, -5],
    lHip: [5, 5], lKnee: [0, 0], rHip: [5, 5], rKnee: [0, 0],
  },
  raise: {
    bodyY: [100, 100], lShoulder: [0, 0], lElbow: [15, 15], rShoulder: [75, 0], rElbow: [15, 15],
    lHip: [5, 5], lKnee: [0, 0], rHip: [5, 5], rKnee: [0, 0],
  },
  row: {
    bodyY: [100, 100], lShoulder: [-55, -55], lElbow: [0, -80], rShoulder: [-55, -55], rElbow: [0, -80],
    lHip: [5, 5], lKnee: [0, 0], rHip: [5, 5], rKnee: [0, 0],
  },
  fly: {
    bodyY: [100, 100], lShoulder: [-90, 0], lElbow: [50, 50], rShoulder: [-90, 0], rElbow: [50, 50],
    lHip: [5, 5], lKnee: [0, 0], rHip: [5, 5], rKnee: [0, 0],
  },
  deadlift: {
    bodyY: [100, 85], lShoulder: [-20, -20], lElbow: [0, 0], rShoulder: [-20, -20], rElbow: [0, 0],
    lHip: [0, 70], lKnee: [0, 7], rHip: [0, 70], rKnee: [0, 7],
  },
  plank: {
    bodyY: [100, 95], lShoulder: [-90, -90], lElbow: [0, 45], rShoulder: [-90, -90], rElbow: [0, 45],
    lHip: [0, 0], lKnee: [0, 0], rHip: [0, 0], rKnee: [0, 0],
  },
  run: {
    bodyY: [100, 100], lShoulder: [40, -50], lElbow: [-60, -70], rShoulder: [-50, 40], rElbow: [-70, -60],
    lHip: [-30, 40], lKnee: [60, -50], rHip: [40, -30], rKnee: [-50, 60],
  },
  static: {
    bodyY: [100, 100], lShoulder: [-10, -10], lElbow: [30, 30], rShoulder: [-10, -10], rElbow: [30, 30],
    lHip: [5, 5], lKnee: [0, 0], rHip: [5, 5], rKnee: [0, 0],
  },
};

function rad(d: number) { return (d * Math.PI) / 180; }

function jointPos(x: number, y: number, angleDeg: number, len: number) {
  const a = rad(angleDeg);
  return { x: x + Math.sin(a) * len, y: y + Math.cos(a) * len };
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function computeFigure(poseDef: PoseDef, t: number) {
  const top = poseDef;
  const bodyY = lerp(top.bodyY[0], top.bodyY[1], t);
  // Torso
  const neckBaseY = bodyY;
  const hipCenterX = CX;
  const hipCenterY = bodyY + NECK + TORSO;

  // Shoulders
  const shX = CX;
  const shY = neckBaseY + NECK;
  const lShX = shX - 14;
  const rShX = shX + 14;
  const lShY = shY;
  const rShY = shY;

  // Arms
  const ls = rad(lerp(top.lShoulder[0], top.lShoulder[1], t));
  const le = rad(lerp(top.lElbow[0], top.lElbow[1], t));
  const rs = rad(lerp(top.rShoulder[0], top.rShoulder[1], t));
  const re = rad(lerp(top.rElbow[0], top.rElbow[1], t));
  const lElb = jointPos(lShX, lShY, ls, UPPER_ARM);
  const rElb = jointPos(rShX, rShY, rs, UPPER_ARM);
  const lWrist = jointPos(lElb.x, lElb.y, ls + le, LOWER_ARM);
  const rWrist = jointPos(rElb.x, rElb.y, rs + re, LOWER_ARM);

  // Legs
  const hL = 10; // hip offset
  const lh = rad(lerp(top.lHip[0], top.lHip[1], t));
  const lk = rad(lerp(top.lKnee[0], top.lKnee[1], t));
  const rh = rad(lerp(top.rHip[0], top.rHip[1], t));
  const rk = rad(lerp(top.rKnee[0], top.rKnee[1], t));
  const lHipPt = { x: CX - hL, y: hipCenterY };
  const rHipPt = { x: CX + hL, y: hipCenterY };
  const lKnee = jointPos(lHipPt.x, lHipPt.y, lh, UPPER_LEG);
  const rKnee = jointPos(rHipPt.x, rHipPt.y, rh, UPPER_LEG);
  const lAnkle = jointPos(lKnee.x, lKnee.y, lh + lk, LOWER_LEG);
  const rAnkle = jointPos(rKnee.x, rKnee.y, rh + rk, LOWER_LEG);

  return {
    headX: CX, headY: neckBaseY - 2,
    torsoX1: CX, torsoY1: neckBaseY + NECK, torsoX2: CX, torsoY2: hipCenterY,
    lUpperX1: lShX, lUpperY1: lShY, lUpperX2: lElb.x, lUpperY2: lElb.y,
    lLowerX1: lElb.x, lLowerY1: lElb.y, lLowerX2: lWrist.x, lLowerY2: lWrist.y,
    rUpperX1: rShX, rUpperY1: rShY, rUpperX2: rElb.x, rUpperY2: rElb.y,
    rLowerX1: rElb.x, rLowerY1: rElb.y, rLowerX2: rWrist.x, rLowerY2: rWrist.y,
    lLegX1: lHipPt.x, lLegY1: lHipPt.y, lLegX2: lKnee.x, lLegY2: lKnee.y,
    lShinX1: lKnee.x, lShinY1: lKnee.y, lShinX2: lAnkle.x, lShinY2: lAnkle.y,
    rLegX1: rHipPt.x, rLegY1: rHipPt.y, rLegX2: rKnee.x, rLegY2: rKnee.y,
    rShinX1: rKnee.x, rShinY1: rKnee.y, rShinX2: rAnkle.x, rShinY2: rAnkle.y,
    elbLX: lElb.x, elbLY: lElb.y, elbRX: rElb.x, elbRY: rElb.y,
    kneeLX: lKnee.x, kneeLY: lKnee.y, kneeRX: rKnee.x, kneeRY: rKnee.y,
  };
}

export function SvgExerciseFigure({ pose }: { pose: string }) {
  const [t, setT] = useState(0);
  const direction = useRef(1);
  const startTime = useRef(Date.now());

  useEffect(() => {
    startTime.current = Date.now();
    direction.current = 1;
    let rafId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      // 3600ms per full cycle (1800ms each direction)
      const cycleTime = elapsed % 3600;
      let progress = cycleTime / 1800; // 0→1→0 pattern
      if (progress > 1) progress = 2 - progress; // reverse direction

      // ease in-out
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setT(eased);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [pose]);

  const poseDef = POSES[pose] || POSES.static;
  const f = computeFigure(poseDef, t);

  return (
    <View style={styles.container}>
      <Svg width={200} height={240} viewBox="0 0 200 240">
        {/* Ground */}
        <Line x1={20} y1={GROUND_Y} x2={180} y2={GROUND_Y} stroke="#E2E8F0" strokeWidth={2} strokeLinecap="round" />
        {/* Head */}
        <Circle cx={f.headX} cy={f.headY} r={HEAD_R} fill={SKIN} />
        {/* Torso */}
        <Line x1={f.torsoX1} y1={f.torsoY1} x2={f.torsoX2} y2={f.torsoY2} stroke={OUTFIT} strokeWidth={10} strokeLinecap="round" />
        {/* Left Arm */}
        <Line x1={f.lUpperX1} y1={f.lUpperY1} x2={f.lUpperX2} y2={f.lUpperY2} stroke={SKIN} strokeWidth={6} strokeLinecap="round" />
        <Line x1={f.lLowerX1} y1={f.lLowerY1} x2={f.lLowerX2} y2={f.lLowerY2} stroke={SKIN} strokeWidth={5} strokeLinecap="round" />
        {/* Right Arm */}
        <Line x1={f.rUpperX1} y1={f.rUpperY1} x2={f.rUpperX2} y2={f.rUpperY2} stroke={SKIN} strokeWidth={6} strokeLinecap="round" />
        <Line x1={f.rLowerX1} y1={f.rLowerY1} x2={f.rLowerX2} y2={f.rLowerY2} stroke={SKIN} strokeWidth={5} strokeLinecap="round" />
        {/* Left Leg */}
        <Line x1={f.lLegX1} y1={f.lLegY1} x2={f.lLegX2} y2={f.lLegY2} stroke={OUTFIT} strokeWidth={8} strokeLinecap="round" />
        <Line x1={f.lShinX1} y1={f.lShinY1} x2={f.lShinX2} y2={f.lShinY2} stroke={SKIN} strokeWidth={6} strokeLinecap="round" />
        {/* Right Leg */}
        <Line x1={f.rLegX1} y1={f.rLegY1} x2={f.rLegX2} y2={f.rLegY2} stroke={OUTFIT} strokeWidth={8} strokeLinecap="round" />
        <Line x1={f.rShinX1} y1={f.rShinY1} x2={f.rShinX2} y2={f.rShinY2} stroke={SKIN} strokeWidth={6} strokeLinecap="round" />
        {/* Joints */}
        <Circle cx={f.elbLX} cy={f.elbLY} r={3} fill={OUTFIT} />
        <Circle cx={f.elbRX} cy={f.elbRY} r={3} fill={OUTFIT} />
        <Circle cx={f.kneeLX} cy={f.kneeLY} r={3.5} fill={OUTFIT} />
        <Circle cx={f.kneeRX} cy={f.kneeRY} r={3.5} fill={OUTFIT} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    overflow: 'hidden',
  },
});
