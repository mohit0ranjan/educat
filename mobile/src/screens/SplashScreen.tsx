import React, { useEffect, useRef } from 'react';
import {
    View, Text, Animated, StyleSheet, Dimensions,
    Platform, StatusBar, Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../services/store';

const { width, height } = Dimensions.get('window');

const BG = '#F6F7FB';
const PRIMARY = '#2DC87A';
const PRIMARY_D = '#1DA362';
const DARK = '#1A1C2E';
const GRAY = '#9096B2';
const ORANGE = '#FF8C42';
const VIOLET = '#7C6EF5';

export default function CustomSplashScreen({ navigation }: any) {
    const { token } = useAuthStore();

    // ─── Animations ───────────────────────────────────────────────
    const logoScale = useRef(new Animated.Value(0.6)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textSlide = useRef(new Animated.Value(20)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const dotsOpacity = useRef(new Animated.Value(0)).current;
    const dot1Scale = useRef(new Animated.Value(0)).current;
    const dot2Scale = useRef(new Animated.Value(0)).current;
    const dot3Scale = useRef(new Animated.Value(0)).current;
    const orb1Scale = useRef(new Animated.Value(0)).current;
    const orb2Scale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Orbs pop in
        Animated.parallel([
            Animated.spring(orb1Scale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
            Animated.spring(orb2Scale, { toValue: 1, friction: 6, tension: 40, delay: 150, useNativeDriver: true } as any),
        ]).start();

        // Logo scales in with spring
        Animated.sequence([
            Animated.delay(200),
            Animated.parallel([
                Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
                Animated.timing(logoOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
            ]),
        ]).start();

        // Text slides up
        Animated.sequence([
            Animated.delay(550),
            Animated.parallel([
                Animated.timing(textSlide, { toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
        ]).start();

        // Loading dots appear
        Animated.sequence([
            Animated.delay(900),
            Animated.timing(dotsOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start(() => {
            // Sequentially bounce each dot
            const bounce = (d: Animated.Value, delay: number) =>
                Animated.loop(Animated.sequence([
                    Animated.delay(delay),
                    Animated.spring(d, { toValue: 1, friction: 3, tension: 80, useNativeDriver: true }),
                    Animated.spring(d, { toValue: 0, friction: 3, tension: 80, useNativeDriver: true }),
                ]));
            bounce(dot1Scale, 0).start();
            bounce(dot2Scale, 130).start();
            bounce(dot3Scale, 260).start();
        });

        // Navigate after 2.6s
        const t = setTimeout(() => {
            navigation.reset({ index: 0, routes: [{ name: token ? 'MainTabs' : 'Onboarding' }] });
        }, 2600);
        return () => clearTimeout(t);
    }, []);

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor={BG} />

            {/* ── Decorative orbs ── */}
            <Animated.View style={[styles.orb1, { transform: [{ scale: orb1Scale }] }]} />
            <Animated.View style={[styles.orb2, { transform: [{ scale: orb2Scale }] }]} />
            <Animated.View style={[styles.orb3, { transform: [{ scale: orb2Scale }] }]} />

            {/* ── Center ── */}
            <View style={styles.center}>
                {/* App icon */}
                <Animated.View style={[styles.logoWrap, {
                    opacity: logoOpacity,
                    transform: [{ scale: logoScale }],
                }]}>
                    <View style={styles.logoBox}>
                        <Ionicons name="school" size={38} color={PRIMARY} />
                    </View>
                    {/* Accent dot */}
                    <View style={styles.logoDot} />
                    {/* Small decorative floating dots */}
                    <View style={[styles.miniOrb, { top: 0, right: -6, backgroundColor: ORANGE + 'CC', width: 12, height: 12 }]} />
                    <View style={[styles.miniOrb, { bottom: 2, left: -4, backgroundColor: VIOLET + 'AA', width: 9, height: 9 }]} />
                </Animated.View>

                {/* Brand text */}
                <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textSlide }], alignItems: 'center' }}>
                    <Text style={styles.brandName}>EduApp</Text>
                    <Text style={styles.brandSub}>Your smart learning companion</Text>
                </Animated.View>

                {/* Loading dots */}
                <Animated.View style={[styles.dotsRow, { opacity: dotsOpacity }]}>
                    {[dot1Scale, dot2Scale, dot3Scale].map((d, i) => (
                        <Animated.View
                            key={i}
                            style={[styles.dot, {
                                backgroundColor: i === 0 ? PRIMARY : i === 1 ? ORANGE : VIOLET,
                                transform: [{ translateY: d.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) }],
                            }]}
                        />
                    ))}
                </Animated.View>
            </View>

            {/* ── Version tag ── */}
            <Text style={styles.version}>v1.0.4</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1, backgroundColor: BG,
        justifyContent: 'center', alignItems: 'center',
    },

    // Orbs
    orb1: {
        position: 'absolute', top: -80, right: -80,
        width: 280, height: 280, borderRadius: 140,
        backgroundColor: PRIMARY + '18',
    },
    orb2: {
        position: 'absolute', bottom: -60, left: -60,
        width: 220, height: 220, borderRadius: 110,
        backgroundColor: VIOLET + '15',
    },
    orb3: {
        position: 'absolute', bottom: height * 0.25, right: -20,
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: ORANGE + '12',
    },

    center: { alignItems: 'center', gap: 20 },

    // Logo
    logoWrap: { position: 'relative', marginBottom: 8 },
    logoBox: {
        width: 88, height: 88, borderRadius: 26,
        backgroundColor: '#E6F9F1',
        justifyContent: 'center', alignItems: 'center',
        ...Platform.select({
            ios: { shadowColor: '#2DC87A', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.20, shadowRadius: 24 },
            android: { elevation: 10 },
        }),
    },
    logoDot: {
        position: 'absolute', bottom: -4, right: -4,
        width: 22, height: 22, borderRadius: 7,
        backgroundColor: PRIMARY,
        borderWidth: 3, borderColor: BG,
    },
    miniOrb: { position: 'absolute', borderRadius: 999 },

    // Text
    brandName: {
        fontSize: 32, fontWeight: '700', color: DARK,
        letterSpacing: -0.8, marginBottom: 6,
    },
    brandSub: {
        fontSize: 14, color: GRAY, fontWeight: '400', textAlign: 'center',
    },

    // Loading dots
    dotsRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
    dot: { width: 8, height: 8, borderRadius: 4 },

    // Version
    version: {
        position: 'absolute', bottom: 36,
        fontSize: 12, color: GRAY + 'AA', fontWeight: '500',
    },
});
