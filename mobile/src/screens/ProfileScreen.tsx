import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Switch, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SkeletonLoader from '../components/SkeletonLoader';
import { useAuthStore } from '../services/store';

// ─── Tokens ────────────────────────────────────────────────────────
const BG = '#F5F6FA';
const CARD = '#FFFFFF';
const PRIMARY = '#2DC87A';
const PRIMARY_D = '#1DA362';
const DARK = '#1C1C2E';
const GRAY = '#8A8FA8';
const BORDER = '#EBEBF0';
const VIOLET = '#7C6EF5';
const SECONDARY = '#FF8C42';
const CORAL = '#FF6B6B';
const DANGER = '#FF6B6B';

const shadow = (c = '#B0B7D3', e = 3) => Platform.select({
    ios: { shadowColor: c, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.09, shadowRadius: 10 },
    android: { elevation: e },
}) as any;

type MenuItem = {
    icon: string; label: string; desc: string;
    color: string; bg: string; action?: () => void; right?: React.ReactNode;
};

export default function ProfileScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const { user, role, darkMode, toggleDarkMode, logout } = useAuthStore();

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(t);
    }, []);

    const handleLogout = () => {
        logout();
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    };

    const statItems = role === 'teacher'
        ? [
            { label: 'Lectures', value: '42', color: PRIMARY },
            { label: 'Students', value: '180', color: VIOLET },
            { label: 'Classes', value: '3', color: SECONDARY },
        ]
        : [
            { label: 'Courses', value: '8', color: PRIMARY },
            { label: 'Hours', value: '12', color: VIOLET },
            { label: 'Tests', value: '5', color: SECONDARY },
        ];

    const sections: { title: string; items: MenuItem[] }[] = [
        {
            title: 'Preferences',
            items: [
                {
                    icon: 'moon-outline',
                    label: 'Dark Mode',
                    desc: 'Switch to dark theme',
                    color: VIOLET,
                    bg: '#EEF0FE',
                    right: (
                        <Switch
                            value={darkMode}
                            onValueChange={toggleDarkMode}
                            trackColor={{ false: BORDER, true: PRIMARY }}
                            thumbColor="#FFF"
                        />
                    ),
                },
                {
                    icon: 'notifications-outline',
                    label: 'Notifications',
                    desc: 'Manage push alerts',
                    color: SECONDARY,
                    bg: '#FFF1E8',
                    action: () => { },
                },
            ],
        },
        {
            title: 'Account',
            items: [
                {
                    icon: 'lock-closed-outline',
                    label: 'Privacy & Security',
                    desc: 'Manage account security',
                    color: PRIMARY,
                    bg: '#E8FAF2',
                    action: () => navigation.navigate('Settings'),
                },
                {
                    icon: 'help-circle-outline',
                    label: 'Help & Support',
                    desc: 'FAQs and contact us',
                    color: '#FFB830',
                    bg: '#FFF8E7',
                    action: () => { },
                },
                {
                    icon: 'log-out-outline',
                    label: 'Sign Out',
                    desc: 'Log out of your account',
                    color: DANGER,
                    bg: '#FFF0F0',
                    action: handleLogout,
                },
            ],
        },
    ];

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor={BG} />

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* ── Hero ── */}
                <View style={[styles.heroArea, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
                    <Text style={styles.pageLabel}>Profile</Text>

                    {loading ? (
                        <View style={styles.avatarArea}>
                            <SkeletonLoader width={88} height={88} borderRadius={44} />
                        </View>
                    ) : (
                        <View style={styles.avatarArea}>
                            <View style={styles.avatarRing}>
                                <LinearGradient colors={[PRIMARY, PRIMARY_D]} style={styles.avatarGrad}>
                                    <Text style={styles.avatarLetter}>
                                        {(user?.username || 'U')[0].toUpperCase()}
                                    </Text>
                                </LinearGradient>
                            </View>
                            <View style={styles.editBadge}>
                                <Ionicons name="camera" size={12} color="#FFF" />
                            </View>
                        </View>
                    )}

                    {loading ? (
                        <View style={{ alignItems: 'center', gap: 6 }}>
                            <SkeletonLoader width={150} height={22} borderRadius={8} />
                            <SkeletonLoader width={100} height={16} borderRadius={8} />
                        </View>
                    ) : (
                        <>
                            <Text style={styles.userName}>{user?.username || 'User'}</Text>
                            <View style={styles.roleBadge}>
                                <Ionicons
                                    name={role === 'teacher' ? 'briefcase-outline' : 'school-outline'}
                                    size={12} color={PRIMARY}
                                />
                                <Text style={styles.roleText}>
                                    {role === 'teacher' ? 'Faculty Member' : `${(user as any)?.class || 'Student'}`}
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                {/* ── Stats Bar ── */}
                <View style={[styles.statsBar, shadow()]}>
                    {statItems.map((s, i) => (
                        <View key={i} style={[styles.statItem, i < statItems.length - 1 && styles.statDivider]}>
                            <Text style={[styles.statVal, { color: s.color }]}>{s.value}</Text>
                            <Text style={styles.statLbl}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                {/* ── Achievement Chips ── */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achieveRow}>
                    {[
                        { icon: 'star', label: 'Top Learner', color: '#FFB830', bg: '#FFF8E7' },
                        { icon: 'flame', label: '7 Day Streak', color: CORAL, bg: '#FFF0F0' },
                        { icon: 'trophy', label: 'Quiz Master', color: VIOLET, bg: '#EEF0FE' },
                        { icon: 'ribbon', label: 'Completed 8 Courses', color: PRIMARY, bg: '#E8FAF2' },
                    ].map((a, i) => (
                        <View key={i} style={[styles.achieveChip, { backgroundColor: a.bg }]}>
                            <Ionicons name={a.icon as any} size={14} color={a.color} />
                            <Text style={[styles.achieveText, { color: a.color }]}>{a.label}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* ── Menu Sections ── */}
                {sections.map((sec) => (
                    <View key={sec.title} style={styles.section}>
                        <Text style={styles.sectionLabel}>{sec.title}</Text>
                        <View style={[styles.menuCard, shadow()]}>
                            {sec.items.map((item, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.menuRow, i < sec.items.length - 1 && styles.menuDivider]}
                                    onPress={item.action}
                                    activeOpacity={0.75}
                                    disabled={!item.action && !item.right}
                                >
                                    <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                                        <Ionicons name={item.icon as any} size={20} color={item.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.menuLabel, item.label === 'Sign Out' && { color: DANGER }]}>
                                            {item.label}
                                        </Text>
                                        <Text style={styles.menuDesc}>{item.desc}</Text>
                                    </View>
                                    {item.right
                                        ? item.right
                                        : <Ionicons name="chevron-forward" size={16} color={GRAY} />
                                    }
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                <Text style={styles.version}>EduApp v1.0.4 • All rights reserved</Text>
                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },
    scroll: {},

    // Hero
    heroArea: {
        alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10,
        backgroundColor: BG, gap: 10,
    },
    pageLabel: { fontSize: 13, color: GRAY, fontWeight: '600', alignSelf: 'flex-start', marginBottom: 6 },
    avatarArea: { position: 'relative', marginBottom: 4 },
    avatarRing: {
        width: 90, height: 90, borderRadius: 45, overflow: 'hidden',
        borderWidth: 3, borderColor: '#E8FAF2',
    },
    avatarGrad: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    avatarLetter: { color: '#FFF', fontSize: 32, fontWeight: '700' },
    editBadge: {
        position: 'absolute', bottom: 0, right: 0,
        width: 26, height: 26, borderRadius: 13,
        backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center',
        borderWidth: 2.5, borderColor: BG,
    },
    userName: { fontSize: 24, fontWeight: '700', color: DARK, letterSpacing: -0.3 },
    roleBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: '#E8FAF2', paddingHorizontal: 14, paddingVertical: 6,
        borderRadius: 50, borderWidth: 1, borderColor: '#C8F0DC',
    },
    roleText: { color: PRIMARY, fontSize: 13, fontWeight: '600' },

    // Stats Bar
    statsBar: {
        flexDirection: 'row', backgroundColor: CARD, borderRadius: 22,
        marginHorizontal: 20, marginTop: 14, marginBottom: 20, padding: 18,
    },
    statItem: { flex: 1, alignItems: 'center', gap: 3 },
    statDivider: { borderRightWidth: 1, borderRightColor: BORDER },
    statVal: { fontSize: 22, fontWeight: '800' },
    statLbl: { fontSize: 11, color: GRAY, fontWeight: '600' },

    // Achievement Chips
    achieveRow: { paddingHorizontal: 20, gap: 8, marginBottom: 24, paddingRight: 28 },
    achieveChip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 12, paddingVertical: 7, borderRadius: 50,
    },
    achieveText: { fontSize: 12, fontWeight: '700' },

    // Sections
    section: { paddingHorizontal: 20, marginBottom: 18 },
    sectionLabel: { fontSize: 12, fontWeight: '700', color: GRAY, letterSpacing: 0.5, marginBottom: 10 },
    menuCard: { backgroundColor: CARD, borderRadius: 20, overflow: 'hidden' },
    menuRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 14 },
    menuDivider: { borderBottomWidth: 1, borderBottomColor: '#F5F5FA' },
    menuIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    menuLabel: { fontSize: 15, fontWeight: '700', color: DARK, marginBottom: 1 },
    menuDesc: { fontSize: 12, color: GRAY, fontWeight: '400' },

    version: { textAlign: 'center', fontSize: 12, color: GRAY, fontWeight: '500', marginVertical: 4 },
});
