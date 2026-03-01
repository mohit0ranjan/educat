import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

interface SkeletonProps {
    width?: any;
    height?: any;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
}

export default function SkeletonLoader({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) {
    const fadeAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 0.8, duration: 800, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 0.3, duration: 800, useNativeDriver: true })
            ])
        ).start();
    }, [fadeAnim]);

    return (
        <Animated.View style={[{ width, height, borderRadius, backgroundColor: '#CBD5E1', opacity: fadeAnim }, style]} />
    );
}
