import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    Alert, ActivityIndicator, Animated, KeyboardAvoidingView,
    Platform, ScrollView, Dimensions, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { login as apiLogin, forgotPassword } from '../api/client';
import { useAuthStore } from '../services/store';

const { height } = Dimensions.get('window');

// ─── Tokens — same palette as rest of app ──────────────────────────
const BG = '#F6F7FB';
const CARD = '#FFFFFF';
const PRIMARY = '#2DC87A';
const PRIMARY_D = '#1DA362';
const DARK = '#1A1C2E';
const GRAY = '#9096B2';
const BORDER = '#ECEEF5';
const INPUT_BG = '#F0F2F8';

const shadow = Platform.select({
    ios: { shadowColor: '#9096B2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 16 },
    android: { elevation: 4 },
}) as any;

export default function LoginScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const { setAuth } = useAuthStore();

    const [mode, setMode] = useState<'login' | 'forgot'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Subtle entry animation
    const slideY = useRef(new Animated.Value(30)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const shakeX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideY, { toValue: 0, duration: 500, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();
    }, []);

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeX, { toValue: 8, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeX, { toValue: -8, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeX, { toValue: 5, duration: 40, useNativeDriver: true }),
            Animated.timing(shakeX, { toValue: -5, duration: 40, useNativeDriver: true }),
            Animated.timing(shakeX, { toValue: 0, duration: 30, useNativeDriver: true }),
        ]).start();
    };

    const handleLogin = async () => {
        if (!email.trim()) { Alert.alert('Missing Email', 'Please enter your email.'); return; }
        if (!password.trim()) { Alert.alert('Missing Password', 'Please enter your password.'); return; }
        setLoading(true);
        try {
            const data = await apiLogin(email.trim().toLowerCase(), password);
            const userRole = data.user?.roleType || role;
            setAuth(data.user, data.jwt, userRole);
            navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        } catch (err: any) {
            shake();
            const status: number = err.response?.status || 0;
            const msg: string = err.response?.data?.error?.message || '';
            const lower = msg.toLowerCase();
            let title = 'Login Failed', body = '';
            if (!err.response) {
                title = 'No Connection'; body = 'Cannot reach the server. Check your connection.';
            } else if (status === 400) {
                body = lower.includes('password') || lower.includes('credentials')
                    ? 'Wrong password. Try again or use Forgot Password.'
                    : 'No account found with that email.';
            } else if (status === 403) {
                title = 'Account Blocked'; body = 'This account has been blocked by the administrator.';
            } else {
                body = msg || `Something went wrong (${status}).`;
            }
            Alert.alert(title, body, [{ text: 'OK' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleForgot = async () => {
        if (!email.trim() || !email.includes('@')) {
            Alert.alert('Enter Email', 'Enter your registered email address first.'); return;
        }
        setLoading(true);
        try {
            await forgotPassword(email.trim().toLowerCase());
            Alert.alert('Link Sent', `A reset link was sent to\n${email}`,
                [{ text: 'Back to Login', onPress: () => setMode('login') }]);
        } catch {
            Alert.alert('Error', 'Could not send reset email. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <View style={[styles.root, { paddingTop: Math.max(insets.top, 0) }]}>
            <StatusBar barStyle="dark-content" backgroundColor={BG} />

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom + 24, 40) }]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Branding Top ── */}
                    <Animated.View style={[styles.brandArea, { opacity, transform: [{ translateY: slideY }] }]}>
                        {/* App Icon */}
                        <View style={styles.logoWrap}>
                            <View style={styles.logoBox}>
                                <Ionicons name="school" size={30} color={PRIMARY} />
                            </View>
                            <View style={styles.logoAccent} />
                        </View>

                        <Text style={styles.appName}>EduApp</Text>
                        <Text style={styles.appTagline}>
                            {mode === 'login' ? 'Welcome back 👋' : 'Reset your password'}
                        </Text>
                        <Text style={styles.appSub}>
                            {mode === 'login'
                                ? 'Sign in to continue your learning journey'
                                : 'Enter your email to receive a reset link'}
                        </Text>
                    </Animated.View>

                    {/* ── Card ── */}
                    <Animated.View style={[
                        styles.card, shadow,
                        { transform: [{ translateY: slideY }, { translateX: shakeX }], opacity },
                    ]}>

                        {/* Role Toggle — login only */}
                        {mode === 'login' && (
                            <View style={styles.roleRow}>
                                {(['student', 'teacher'] as const).map((r) => (
                                    <TouchableOpacity
                                        key={r}
                                        style={[styles.roleBtn, role === r && styles.roleBtnActive]}
                                        onPress={() => setRole(r)}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons
                                            name={r === 'student' ? 'person-outline' : 'briefcase-outline'}
                                            size={15} color={role === r ? '#FFF' : GRAY}
                                        />
                                        <Text style={[styles.roleTxt, role === r && styles.roleTxtActive]}>
                                            {r === 'student' ? 'Student' : 'Teacher'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Email Field */}
                        <View style={styles.fieldWrap}>
                            <Text style={styles.fieldLabel}>Email</Text>
                            <View style={[
                                styles.inputRow,
                                focusedField === 'email' && styles.inputRowFocused,
                            ]}>
                                <Ionicons name="mail-outline" size={18}
                                    color={focusedField === 'email' ? PRIMARY : GRAY} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="you@school.com"
                                    placeholderTextColor={GRAY}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </View>
                        </View>

                        {/* Password Field — login only */}
                        {mode === 'login' && (
                            <View style={styles.fieldWrap}>
                                <View style={styles.fieldLabelRow}>
                                    <Text style={styles.fieldLabel}>Password</Text>
                                    <TouchableOpacity onPress={() => setMode('forgot')}>
                                        <Text style={styles.forgotLink}>Forgot?</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[
                                    styles.inputRow,
                                    focusedField === 'pass' && styles.inputRowFocused,
                                ]}>
                                    <Ionicons name="lock-closed-outline" size={18}
                                        color={focusedField === 'pass' ? PRIMARY : GRAY} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your password"
                                        placeholderTextColor={GRAY}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPass}
                                        autoCapitalize="none"
                                        onFocus={() => setFocusedField('pass')}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                    <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                                        <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={GRAY} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* CTA Button */}
                        <TouchableOpacity
                            style={[styles.cta, loading && { opacity: 0.7 }]}
                            onPress={mode === 'login' ? handleLogin : handleForgot}
                            activeOpacity={0.88}
                            disabled={loading}
                        >
                            {loading
                                ? <ActivityIndicator color="#FFF" />
                                : <>
                                    <Text style={styles.ctaText}>
                                        {mode === 'login' ? 'Sign In' : 'Send Reset Link'}
                                    </Text>
                                    <Ionicons
                                        name={mode === 'login' ? 'arrow-forward' : 'paper-plane-outline'}
                                        size={17} color="#FFF"
                                    />
                                </>
                            }
                        </TouchableOpacity>

                        {/* Back to login */}
                        {mode === 'forgot' && (
                            <TouchableOpacity style={styles.backRow} onPress={() => setMode('login')}>
                                <Ionicons name="arrow-back" size={15} color={PRIMARY} />
                                <Text style={styles.backText}> Back to Login</Text>
                            </TouchableOpacity>
                        )}

                        {/* Info note */}
                        {mode === 'login' && (
                            <View style={styles.infoRow}>
                                <Ionicons name="information-circle-outline" size={14} color={GRAY} />
                                <Text style={styles.infoText}>
                                    Your credentials are provided by your school admin.
                                </Text>
                            </View>
                        )}
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },
    scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 48 },

    // ─── Branding ────────────────────────────────────────────────
    brandArea: { alignItems: 'center', marginBottom: 36 },
    logoWrap: { position: 'relative', marginBottom: 20 },
    logoBox: {
        width: 72, height: 72, borderRadius: 22,
        backgroundColor: '#E6F9F1',
        justifyContent: 'center', alignItems: 'center',
    },
    logoAccent: {
        position: 'absolute', bottom: -4, right: -4,
        width: 20, height: 20, borderRadius: 6,
        backgroundColor: PRIMARY,
        borderWidth: 2.5, borderColor: BG,
    },
    appName: { fontSize: 28, fontWeight: '700', color: DARK, letterSpacing: -0.6, marginBottom: 8 },
    appTagline: { fontSize: 17, fontWeight: '600', color: DARK, marginBottom: 6 },
    appSub: { fontSize: 13, color: GRAY, fontWeight: '400', textAlign: 'center', lineHeight: 20 },

    // ─── Card ─────────────────────────────────────────────────────
    card: {
        backgroundColor: CARD,
        borderRadius: 28,
        padding: 24,
        gap: 18,
    },

    // Role toggle
    roleRow: { flexDirection: 'row', backgroundColor: INPUT_BG, borderRadius: 14, padding: 4, gap: 4 },
    roleBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 6, paddingVertical: 10, borderRadius: 11,
    },
    roleBtnActive: { backgroundColor: PRIMARY },
    roleTxt: { fontSize: 14, fontWeight: '600', color: GRAY },
    roleTxtActive: { color: '#FFF', fontWeight: '700' },

    // Fields
    fieldWrap: { gap: 8 },
    fieldLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    fieldLabel: { fontSize: 13, fontWeight: '600', color: DARK },
    forgotLink: { fontSize: 13, fontWeight: '600', color: PRIMARY },
    inputRow: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: INPUT_BG, borderRadius: 14,
        height: 52, paddingHorizontal: 14,
        borderWidth: 1.5, borderColor: 'transparent',
    },
    inputRowFocused: { borderColor: PRIMARY, backgroundColor: '#F0FCF7' },
    input: { flex: 1, fontSize: 15, color: DARK, fontWeight: '500' },

    // CTA
    cta: {
        backgroundColor: PRIMARY, borderRadius: 14, height: 54,
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
        ...Platform.select({
            ios: { shadowColor: '#2DC87A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12 },
            android: { elevation: 5 },
        }),
    },
    ctaText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

    // Back
    backRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    backText: { fontSize: 14, color: PRIMARY, fontWeight: '600' },

    // Info
    infoRow: {
        flexDirection: 'row', alignItems: 'flex-start', gap: 8,
        backgroundColor: '#F6F7FB', borderRadius: 12, padding: 12,
    },
    infoText: { flex: 1, fontSize: 12, color: GRAY, fontWeight: '400', lineHeight: 17 },
});
