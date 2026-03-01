import React, { useRef } from 'react';
import { Animated, TouchableWithoutFeedback, ViewStyle, StyleProp } from 'react-native';

interface BounceButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    activeScale?: number;
    disabled?: boolean;
}

export default function BounceButton({ children, onPress, style, activeScale = 0.95, disabled = false }: BounceButtonProps) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        if (disabled) return;
        Animated.spring(scale, { toValue: activeScale, useNativeDriver: true, speed: 20 }).start();
    };
    const handlePressOut = () => {
        if (disabled) return;
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
    };

    return (
        <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={disabled ? undefined : onPress}>
            <Animated.View style={[style, { transform: [{ scale }] }, disabled && { opacity: 0.6 }]}>
                {children}
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}
