import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../../config/theme';

// A proportional human stick figure with independently animated joints
// Body proportions roughly based on 8-heads canon

interface JointAngles {
  leftShoulder: number;
  rightShoulder: number;
  leftElbow: number;
  rightElbow: number;
  leftHip: number;
  rightHip: number;
  leftKnee: number;
  rightKnee: number;
  torsoLean: number;
  bodyTranslateY: number;
}

type ExercisePose = 'press' | 'raise' | 'squat' | 'curl' | 'row' | 'fly' | 'run' | 'plank' | 'deadlift' | 'static';

const BODY_COLOR = '#CBD5E1';
const BODY_ACTIVE = Colors.primary;
const JOINT_SIZE = 6;

function buildAnim(poses: Record<ExercisePose, { top: JointAngles; bottom: JointAngles }>) {
  return poses;
}

// Define joint angles (in degrees) for each exercise at top and bottom of movement
const EXERCISE_POSES = buildAnim({
  press: {
    top: { leftShoulder: -90, rightShoulder: -90, leftElbow: 0, rightElbow: 0, leftHip: 10, rightHip: 10, leftKnee: 0, rightKnee: 0, torsoLean: 0, bodyTranslateY: 0 },
    bottom: { leftShoulder: -20, rightShoulder: -20, leftElbow: 60, rightElbow: 60, leftHip: 10, rightHip: 10, leftKnee: 0, rightKnee: 0, torsoLean: 0, bodyTranslateY: 0 },
  },
  raise: {
    top: { leftShoulder: 0, rightShoulder: 0, leftElbow: 20, rightElbow: 20, leftHip: 10, rightHip: 10, leftKnee: 0, rightKnee: 0, torsoLean: 0, bodyTranslateY: 0 },
    bottom: { leftShoulder: 70, rightShoulder: 70, leftElbow: 20, rightElbow: 20, leftHip: 10, rightHip: 10, leftKnee: 0, rightKnee: 0, torsoLean: 0, bodyTranslateY: 0 },
  },
  squat: {
    top: { leftShoulder: -70, rightShoulder: -70, leftElbow: -45, rightElbow: -45, leftHip: 45, rightHip: 45, leftKnee: 70, rightKnee: 70, torsoLean: 15, bodyTranslateY: 0 },
    bottom: { leftShoulder: -70, rightShoulder: -70, leftElbow: -45, rightElbow: -45, leftHip: 0, rightHip: 0, leftKnee: 0, rightKnee: 0, torsoLean: 0, bodyTranslateY: -30 },
  },
  curl: {
    top: { leftShoulder: -20, rightShoulder: -5, leftElbow: 0, rightElbow: -110, leftHip: 10, rightHip: 10, leftKnee: 0, rightKnee: 0, torsoLean: 0, bodyTranslateY: 0 },
    bottom: { leftShoulder: -20, rightShoulder: -5, leftElbow: 0, rightElbow: 0, leftHip: 10, rightHip: 10, leftKnee: 0, rightKnee: 0, torsoLean: 0, bodyTranslateY: 0 },
  },
  row: {
    top: { leftShoulder: -40, rightShoulder: -40, leftElbow: -80, rightElbow: -80, leftHip: 10, rightHip: 10, leftKnee: 0, rightKnee: 0, torsoLean: 25, bodyTranslateY: 0 },
    bottom: { leftShoulder: -40, rightShoulder: -40, leftElbow: 0, rightElbow: 0, leftHip: 10, rightHip: 10, leftKnee: 0, rightKnee: 0, torsoLean: 25, bodyTranslateY: 0 },
  },
  fly: {
    top: { leftShoulder: -80, rightShoulder: -80, leftElbow: 40, rightElbow: 40, leftHip: 10, rightHip: 10, leftKnee: 0, rightKnee: 0, torsoLean: 0, bodyTranslateY: 0 },
    bottom: { leftShoulder: 0, rightShoulder: 0, leftElbow: 40, rightElbow: 40, leftHip: 10, rightHip: 10, leftKnee: 0, rightKnee: 0, torsoLean: 0, bodyTranslateY: 0 },
  },
  run: {
    top: { leftShoulder: 40, rightShoulder: -40, leftElbow: -60, rightElbow: -80, leftHip: -30, rightHip: 30, leftKnee: 60, rightKnee: -60, torsoLean: 5, bodyTranslateY: 0 },
    bottom: { leftShoulder: -40, rightShoulder: 40, leftElbow: -80, rightElbow: -60, leftHip: 30, rightHip: -30, leftKnee: -60, rightKnee: 60, torsoLean: 5, bodyTranslateY: 0 },
  },
  plank: {
    top: { leftShoulder: -90, rightShoulder: -90, leftElbow: 0, rightElbow: 0, leftHip: 0, rightHip: 0, leftKnee: 0, rightKnee: 0, torsoLean: 0, bodyTranslateY: 0 },
    bottom: { leftShoulder: -90, rightShoulder: -90, leftElbow: 50, rightElbow: 50, leftHip: 0, rightHip: 0, leftKnee: 0, rightKnee: 0, torsoLean: 0, bodyTranslateY: -10 },
  },
  deadlift: {
    top: { leftShoulder: -20, rightShoulder: -20, leftElbow: 0, rightElbow: 0, leftHip: 80, rightHip: 80, leftKnee: 10, rightKnee: 10, torsoLean: 55, bodyTranslateY: 0 },
    bottom: { leftShoulder: -20, rightShoulder: -20, leftElbow: 0, rightElbow: 0, leftHip: 0, rightHip: 0, leftKnee: 0, rightKnee: 0, torsoLean: 0, bodyTranslateY: -30 },
  },
  static: {
    top: { leftShoulder: -10, rightShoulder: -10, leftElbow: 30, rightElbow: 30, leftHip: 10, rightHip: 10, leftKnee: 0, rightKnee: 0, torsoLean: 0, bodyTranslateY: 0 },
    bottom: { leftShoulder: -10, rightShoulder: -10, leftElbow: 30, rightElbow: 30, leftHip: 10, rightHip: 10, leftKnee: 0, rightKnee: 0, torsoLean: 0, bodyTranslateY: 0 },
  },
});

function mapDirectionToPose(dir: string): ExercisePose {
  switch (dir) {
    case 'up_down': return 'press';
    case 'forward_back': return 'row';
    case 'rotation': return 'curl';
    case 'static_hold': return 'static';
    case 'alternating': return 'run';
    case 'circular': return 'run';
    default: return 'static';
  }
}

function mapJointToPose(joint: string): ExercisePose {
  switch (joint) {
    case 'shoulder': return 'press';
    case 'elbow': return 'curl';
    case 'hip': return 'deadlift';
    case 'knee': return 'squat';
    case 'spine': return 'row';
    case 'whole_body': return 'squat';
    default: return 'static';
  }
}

interface Props {
  animationDirection: string;
  animationJoint: string;
}

export function AnimatedFigure({ animationDirection, animationJoint }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(progress, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  // Pick the best pose: try direction first, then joint, then default
  const dirPose = mapDirectionToPose(animationDirection);
  const jointPose = mapJointToPose(animationJoint);
  const poseName: ExercisePose = dirPose !== 'static' ? dirPose : jointPose !== 'static' ? jointPose : 'squat';
  const poses = EXERCISE_POSES[poseName];

  // Interpolate each joint angle between top and bottom
  const interp = (topVal: number, bottomVal: number) =>
    progress.interpolate({ inputRange: [0, 1], outputRange: [topVal, bottomVal] });

  const angles = {
    leftShoulder: interp(poses.top.leftShoulder, poses.bottom.leftShoulder),
    rightShoulder: interp(poses.top.rightShoulder, poses.bottom.rightShoulder),
    leftElbow: interp(poses.top.leftElbow, poses.bottom.leftElbow),
    rightElbow: interp(poses.top.rightElbow, poses.bottom.rightElbow),
    leftHip: interp(poses.top.leftHip, poses.bottom.leftHip),
    rightHip: interp(poses.top.rightHip, poses.bottom.rightHip),
    leftKnee: interp(poses.top.leftKnee, poses.bottom.leftKnee),
    rightKnee: interp(poses.top.rightKnee, poses.bottom.rightKnee),
    torsoLean: interp(poses.top.torsoLean, poses.bottom.torsoLean),
    bodyTranslateY: interp(poses.top.bodyTranslateY, poses.bottom.bodyTranslateY),
  };

  const activeColor = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [BODY_COLOR, BODY_ACTIVE, BODY_COLOR],
  });

  return (
    <View style={figStyles.container}>
      <Animated.View style={[figStyles.figure, { transform: [{ translateY: angles.bodyTranslateY }] }]}>
        {/* Head */}
        <Animated.View style={[figStyles.head, { backgroundColor: activeColor }]} />

        {/* Torso */}
        <Animated.View style={[figStyles.torsoWrapper, { transform: [{ rotate: angles.torsoLean.interpolate({ inputRange: [-90, 90], outputRange: ['-90deg', '90deg'] }) }] }]}>
          <View style={[figStyles.torso, { backgroundColor: BODY_COLOR }]} />

          {/* Left Arm */}
          <View style={figStyles.shoulderL}>
            <View style={[figStyles.joint, { backgroundColor: BODY_COLOR }]} />
            <Animated.View style={[figStyles.upperArm, { backgroundColor: activeColor, transform: [{ rotate: angles.leftShoulder.interpolate({ inputRange: [-180, 180], outputRange: ['-180deg', '180deg'] }) }] }]}>
              <Animated.View style={[figStyles.lowerArm, { backgroundColor: activeColor, transform: [{ rotate: angles.leftElbow.interpolate({ inputRange: [-180, 180], outputRange: ['-180deg', '180deg'] }) }] }]} />
            </Animated.View>
          </View>

          {/* Right Arm */}
          <View style={figStyles.shoulderR}>
            <View style={[figStyles.joint, { backgroundColor: BODY_COLOR }]} />
            <Animated.View style={[figStyles.upperArm, { backgroundColor: activeColor, transform: [{ rotate: angles.rightShoulder.interpolate({ inputRange: [-180, 180], outputRange: ['-180deg', '180deg'] }) }] }]}>
              <Animated.View style={[figStyles.lowerArm, { backgroundColor: activeColor, transform: [{ rotate: angles.rightElbow.interpolate({ inputRange: [-180, 180], outputRange: ['-180deg', '180deg'] }) }] }]} />
            </Animated.View>
          </View>
        </Animated.View>

        {/* Left Leg */}
        <View style={figStyles.hipL}>
          <View style={[figStyles.joint, { backgroundColor: BODY_COLOR }]} />
          <Animated.View style={[figStyles.upperLeg, { backgroundColor: activeColor, transform: [{ rotate: angles.leftHip.interpolate({ inputRange: [-180, 180], outputRange: ['-180deg', '180deg'] }) }] }]}>
            <Animated.View style={[figStyles.lowerLeg, { backgroundColor: activeColor, transform: [{ rotate: angles.leftKnee.interpolate({ inputRange: [-180, 180], outputRange: ['-180deg', '180deg'] }) }] }]} />
          </Animated.View>
        </View>

        {/* Right Leg */}
        <View style={figStyles.hipR}>
          <View style={[figStyles.joint, { backgroundColor: BODY_COLOR }]} />
          <Animated.View style={[figStyles.upperLeg, { backgroundColor: activeColor, transform: [{ rotate: angles.rightHip.interpolate({ inputRange: [-180, 180], outputRange: ['-180deg', '180deg'] }) }] }]}>
            <Animated.View style={[figStyles.lowerLeg, { backgroundColor: activeColor, transform: [{ rotate: angles.rightKnee.interpolate({ inputRange: [-180, 180], outputRange: ['-180deg', '180deg'] }) }] }]} />
          </Animated.View>
        </View>

        {/* Feet */}
        <View style={[figStyles.footL, { backgroundColor: BODY_COLOR }]} />
        <View style={[figStyles.footR, { backgroundColor: BODY_COLOR }]} />
      </Animated.View>

      {/* Ground line */}
      <View style={figStyles.ground} />
    </View>
  );
}

const figStyles = StyleSheet.create({
  container: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  figure: {
    width: 120,
    height: 180,
    position: 'relative',
    alignItems: 'center',
  },
  // Head
  head: {
    width: 22,
    height: 22,
    borderRadius: 11,
    position: 'absolute',
    top: 0,
    left: 49,
  },
  // Torso + arms group
  torsoWrapper: {
    position: 'absolute',
    top: 26,
    left: 49,
    width: 22,
    height: 55,
    alignItems: 'center',
  },
  torso: {
    width: 16,
    height: 55,
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    left: 3,
  },
  // Arms: attached at top of torso
  shoulderL: { position: 'absolute', top: 8, left: -30, width: 30, height: 45, alignItems: 'flex-end' },
  shoulderR: { position: 'absolute', top: 8, right: -30, width: 30, height: 45, alignItems: 'flex-start' },
  upperArm: {
    width: 8,
    height: 30,
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    right: 0,
    transformOrigin: 'top center',
  },
  lowerArm: {
    width: 7,
    height: 26,
    borderRadius: 4,
    position: 'absolute',
    top: 26,
    right: 0,
    transformOrigin: 'top center',
  },
  // Legs: attached at bottom of torso
  hipL: { position: 'absolute', top: 80, left: 35, width: 40, height: 55, alignItems: 'flex-end' },
  hipR: { position: 'absolute', top: 80, right: 35, width: 40, height: 55, alignItems: 'flex-start' },
  upperLeg: {
    width: 9,
    height: 38,
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    right: 0,
    transformOrigin: 'top center',
  },
  lowerLeg: {
    width: 8,
    height: 34,
    borderRadius: 4,
    position: 'absolute',
    top: 34,
    right: 0,
    transformOrigin: 'top center',
  },
  // Joints
  joint: {
    width: JOINT_SIZE,
    height: JOINT_SIZE,
    borderRadius: JOINT_SIZE / 2,
    position: 'absolute',
    top: -JOINT_SIZE / 2,
    zIndex: 1,
  },
  // Feet
  footL: { position: 'absolute', bottom: 0, left: 36, width: 14, height: 4, borderRadius: 2 },
  footR: { position: 'absolute', bottom: 0, right: 36, width: 14, height: 4, borderRadius: 2 },
  // Ground
  ground: {
    position: 'absolute',
    bottom: 15,
    width: 100,
    height: 2,
    backgroundColor: Colors.border,
    borderRadius: 1,
  },
});
