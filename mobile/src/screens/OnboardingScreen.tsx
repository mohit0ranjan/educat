import React, { useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, Dimensions, TouchableOpacity,
    Animated, Easing, Platform, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// ─── Tokens — same as rest of app ───────────────────────────────────
const BG = '#F6F7FB';
const CARD = '#FFFFFF';
const PRIMARY = '#2DC87A';
const DARK = '#1A1C2E';
const GRAY = '#9096B2';
const ORANGE = '#FF8C42';
const VIOLET = '#7C6EF5';
const BLUE = '#4A90E2';

export default function OnboardingScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();

    // ─── Animations ──────────────────────────────────────────────
    const card1Y = useRef(new Animated.Value(0)).current;
    const card2Y = useRef(new Animated.Value(0)).current;
    const logoAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
    const btnAnim = useRef(new Animated.Value(0)).current;
    const orb1Anim = useRef(new Animated.Value(0)).current;
    const orb2Anim = useRef(new Animated.Value(0)).current;

    const float = (v: Animated.Value, delay: number, range: number, dur: number) =>
        Animated.loop(Animated.sequence([
            Animated.delay(delay),
            Animated.timing(v, { toValue: 1, duration: dur, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(v, { toValue: 0, duration: dur, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]));

    useEffect(() => {
        // Floating cards
        float(card1Y, 0, 18, 2800).start();
        float(card2Y, 1000, 14, 3300).start();
        float(orb1Anim, 0, 1, 3600).start();
        float(orb2Anim, 600, 1, 4000).start();

        // Entrance sequence
        Animated.stagger(120, [
            Animated.spring(logoAnim, { toValue: 1, friction: 6, tension: 55, useNativeDriver: true }),
            Animated.timing(textAnim, { toValue: 1, duration: 480, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(btnAnim, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start();
    }, []);

    const ty1 = card1Y.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
    const ty2 = card2Y.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });

    return (
        <View style={[styles.root, { paddingTop: Math.max(insets.top, 0) }]}>
            <StatusBar barStyle="dark-content" backgroundColor={BG} />

            {/* ── Decorative orbs ── */}
            <Animated.View style={[styles.orb1, {
                transform: [{ scale: orb1Anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }) }],
            }]} />
            <Animated.View style={[styles.orb2, {
                transform: [{ scale: orb2Anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.10] }) }],
            }]} />
            <View style={styles.orb3} />

            {/* ══════════════════════════════════════════
                ILLUSTRATION AREA  — top 55%
            ══════════════════════════════════════════ */}
            <View style={styles.illustrationArea}>

                {/* Floating feature card — left */}
                <Animated.View style={[styles.floatCard, styles.floatCardLeft, { transform: [{ translateY: ty1 }] }]}>
                    <View style={[styles.floatIconBox, { backgroundColor: '#E6F9F1' }]}>
                        <Ionicons name="book-outline" size={22} color={PRIMARY} />
                    </View>
                    <Text style={styles.floatTitle}>Daily Classes</Text>
                    <Text style={styles.floatSub}>Live & recorded</Text>
                </Animated.View>

                {/* Floating feature card — right */}
                <Animated.View style={[styles.floatCard, styles.floatCardRight, { transform: [{ translateY: ty2 }] }]}>
                    <View style={[styles.floatIconBox, { backgroundColor: '#EEEDFD' }]}>
                        <Ionicons name="trophy-outline" size={22} color={VIOLET} />
                    </View>
                    <Text style={styles.floatTitle}>Mock Tests</Text>
                    <Text style={styles.floatSub}>Track progress</Text>
                </Animated.View>

                {/* Central logo */}
                <Animated.View style={[styles.logoBubble, {
                    opacity: logoAnim,
                    transform: [{ scale: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
                }]}>
                    <View style={styles.logoBox}>
                        <Ionicons name="school" size={44} color={PRIMARY} />
                    </View>
                    {/* Accent dot */}
                    <View style={styles.logoDot} />
                    {/* Small orbiting dots */}
                    <View style={[styles.miniDot, { top: 8, left: -6, backgroundColor: ORANGE }]} />
                    <View style={[styles.miniDot, { bottom: 8, right: -6, backgroundColor: BLUE + 'CC', width: 10, height: 10 }]} />
                </Animated.View>

            </View>

            {/* ══════════════════════════════════════════
                TEXT + CTA  — bottom area
            ══════════════════════════════════════════ */}
            <View style={[styles.bottomArea, { paddingBottom: Math.max(insets.bottom + 24, 40) }]}>

                {/* Badge chip */}
                <View style={styles.chip}>
                    <View style={styles.chipDot} />
                    <Text style={styles.chipText}>CLASS 6 TO 12 COACHING</Text>
                </View>

                {/* Headline */}
                <Animated.Text style={[styles.headline, {
                    opacity: textAnim,
                    transform: [{ translateY: textAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                }]}>
                    Learn smarter{'\n'}with your coaching.
                </Animated.Text>

                <Animated.Text style={[styles.subtext, {
                    opacity: textAnim,
                    transform: [{ translateY: textAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
                }]}>
                    Track daily classes, attempt mock tests, and monitor your progress — all in one place.
                </Animated.Text>

                {/* Stats row */}
                <View style={styles.statsRow}>
                    {[
                        { val: '500+', lbl: 'Students' },
                        { val: '50+', lbl: 'Subjects' },
                        { val: '100+', lbl: 'Tests' },
                    ].map((s, i) => (
                        <View key={i} style={[styles.statItem, i > 0 && styles.statBorder]}>
                            <Text style={styles.statVal}>{s.val}</Text>
                            <Text style={styles.statLbl}>{s.lbl}</Text>
                        </View>
                    ))}
                </View>

                {/* CTA */}
                <Animated.View style={{
                    opacity: btnAnim,
                    transform: [{ translateY: btnAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
                    width: '100%',
                }}>
                    <TouchableOpacity
                        style={styles.cta}
                        onPress={() => navigation.replace('Login')}
                        activeOpacity={0.88}
                    >
                        <Text style={styles.ctaText}>Get Started</Text>
                        <View style={styles.ctaArrow}>
                            <Ionicons name="arrow-forward" size={18} color={PRIMARY} />
                        </View>
                    </TouchableOpacity>
                </Animated.View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },

    // Orbs
    orb1: {
        position: 'absolute', top: -100, right: -80,
        width: 300, height: 300, borderRadius: 150,
        backgroundColor: PRIMARY + '16',
    },
    orb2: {
        position: 'absolute', top: height * 0.3, left: -80,
        width: 220, height: 220, borderRadius: 110,
        backgroundColor: VIOLET + '12',
    },
    orb3: {
        position: 'absolute', bottom: height * 0.25, right: 20,
        width: 90, height: 90, borderRadius: 45,
        backgroundColor: ORANGE + '11',
    },

    // ── Illustration ─────────────────────────────────────────────
    illustrationArea: {
        flex: 1.1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },

    // Floating cards
    floatCard: {
        position: 'absolute', backgroundColor: CARD,
        borderRadius: 20, padding: 14, alignItems: 'center', gap: 6,
        ...Platform.select({
            ios: { shadowColor: '#9096B2', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.10, shadowRadius: 16 },
            android: { elevation: 6 },
        }),
    },
    floatCardLeft: { left: '6%', top: '25%' },
    floatCardRight: { right: '6%', bottom: '20%' },
    floatIconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    floatTitle: { fontSize: 13, fontWeight: '700', color: DARK },
    floatSub: { fontSize: 10, color: GRAY, fontWeight: '400' },

    // Center logo
    logoBubble: { position: 'relative' },
    logoBox: {
        width: 110, height: 110, borderRadius: 34,
        backgroundColor: '#E6F9F1',
        justifyContent: 'center', alignItems: 'center',
        ...Platform.select({
            ios: { shadowColor: PRIMARY, shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.18, shadowRadius: 26 },
            android: { elevation: 12 },
        }),
    },
    logoDot: {
        position: 'absolute', bottom: -5, right: -5,
        width: 26, height: 26, borderRadius: 8,
        backgroundColor: PRIMARY, borderWidth: 3, borderColor: BG,
    },
    miniDot: {
        position: 'absolute', width: 13, height: 13, borderRadius: 999,
    },

    // ── Bottom Content ────────────────────────────────────────────
    bottomArea: {
        paddingHorizontal: 28,
        paddingTop: 8,
        alignItems: 'center',
        gap: 16,
    },

    // Badge chip
    chip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#E6F9F1', borderRadius: 50,
        paddingHorizontal: 14, paddingVertical: 6,
    },
    chipDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: PRIMARY },
    chipText: { fontSize: 11, fontWeight: '700', color: PRIMARY, letterSpacing: 0.6 },

    // Text
    headline: {
        fontSize: 30, fontWeight: '700', color: DARK,
        textAlign: 'center', lineHeight: 40, letterSpacing: -0.5,
    },
    subtext: {
        fontSize: 14, color: GRAY, textAlign: 'center',
        lineHeight: 22, fontWeight: '400',
    },

    // Stats
    statsRow: { flexDirection: 'row', width: '100%' },
    statItem: { flex: 1, alignItems: 'center', gap: 2 },
    statBorder: { borderLeftWidth: 1, borderLeftColor: '#DDE0EC' },
    statVal: { fontSize: 20, fontWeight: '700', color: DARK },
    statLbl: { fontSize: 11, color: GRAY, fontWeight: '400' },

    // CTA
    cta: {
        width: '100%', height: 56, backgroundColor: DARK,
        borderRadius: 18, flexDirection: 'row',
        justifyContent: 'center', alignItems: 'center', gap: 10,
        ...Platform.select({
            ios: { shadowColor: DARK, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.16, shadowRadius: 16 },
            android: { elevation: 6 },
        }),
    },
    ctaText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    ctaArrow: {
        width: 30, height: 30, borderRadius: 9,
        backgroundColor: PRIMARY,
        justifyContent: 'center', alignItems: 'center',
    },
});
