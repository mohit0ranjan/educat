import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Platform, StatusBar, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SkeletonLoader from '../components/SkeletonLoader';
import { useAuthStore } from '../services/store';
import { getAnnouncements } from '../api/client';

const { width } = Dimensions.get('window');

// ─── Tokens ─────────────────────────────────────────────────────────
const BG = '#F6F7FB';
const CARD = '#FFFFFF';
const PRIMARY = '#2DC87A';
const PRIMARY_D = '#1DA362';
const DARK = '#1A1C2E';
const GRAY = '#9096B2';
const BORDER = '#ECEEF5';
const VIOLET = '#7C6EF5';
const ORANGE = '#FF8C42';
const CORAL = '#FF6B6B';
const BLUE = '#4A90E2';

const sd = (c = '#9096B2', e = 3) => Platform.select({
    ios: { shadowColor: c, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.09, shadowRadius: 10 },
    android: { elevation: e },
}) as any;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TODAY_CLASSES = [
    { time: '08:00 AM', subject: 'Basic UI Design', batch: 'Batch A', color: PRIMARY, bg: '#E6F9F1', students: 28 },
    { time: '10:00 AM', subject: 'UI/UX Research', batch: 'Batch B', color: VIOLET, bg: '#EEEDFD', students: 22 },
    { time: '12:00 PM', subject: 'Typography Basics', batch: 'Batch C', color: ORANGE, bg: '#FFF0E6', students: 31 },
];

const ACTIONS = [
    { id: 'upload', icon: 'cloud-upload-outline', label: 'Upload\nLecture', color: PRIMARY, bg: '#E6F9F1', route: 'UploadLecture' },
    { id: 'announce', icon: 'megaphone-outline', label: 'Add\nAnnouncement', color: CORAL, bg: '#FFE9E9', route: 'AddAnnouncement' },
    { id: 'schedule', icon: 'videocam-outline', label: 'Schedule\nClass', color: BLUE, bg: '#EBF3FD', route: 'ScheduleClass' },
    { id: 'students', icon: 'people-outline', label: 'My\nStudents', color: VIOLET, bg: '#EEEDFD', route: 'StudentList' },
];

export default function TeacherHomeScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [notice, setNotice] = useState<string | null>(null);

    const today = new Date();
    const todayIdx = today.getDay();
    const hour = today.getHours();
    const greet = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    const [selDay, setSelDay] = useState(todayIdx);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - todayIdx + i);
        return { short: DAYS[d.getDay()], date: d.getDate() };
    });

    // Shorten email for display
    const displayName = (() => {
        const n = user?.username || 'Teacher';
        return n.includes('@') ? n.split('@')[0] : n;
    })();

    useEffect(() => {
        getAnnouncements()
            .then((d: any) => {
                const first = Array.isArray(d) && d[0];
                if (first) setNotice((first.attributes || first).title || null);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor={BG} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

                {/* ═══════════════════════════════════════════════
                    HEADER — minimal icon ← same pattern as HomeScreen
                ══════════════════════════════════════════════ */}
                <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
                    {/* 2×2 App grid icon */}
                    <View style={styles.appIconGrid}>
                        {[0, 1, 2, 3].map(i => (
                            <View key={i} style={[
                                styles.gridDot,
                                { backgroundColor: i === 0 ? PRIMARY : i === 3 ? PRIMARY + 'AA' : '#D0D4E8' },
                            ]} />
                        ))}
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Announcements')}>
                            <Ionicons name="notifications-outline" size={20} color={DARK} />
                            <View style={styles.notifDot} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.avatarBtn} onPress={() => navigation.navigate('Profile')}>
                            <LinearGradient colors={[PRIMARY, PRIMARY_D]} style={styles.avatarGrad}>
                                <Text style={styles.avatarLetter}>{displayName[0].toUpperCase()}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Greeting */}
                <View style={styles.greetRow}>
                    <Text style={styles.greetLine}>
                        {greet}, <Text style={styles.greetName}>{displayName}</Text> 👋
                    </Text>
                </View>

                {/* ═══════════════════════════════════════════════
                    HERO STATS CARD — vibrant, single card
                ══════════════════════════════════════════════ */}
                <View style={styles.section}>
                    {loading ? <SkeletonLoader width="100%" height={110} borderRadius={22} /> : (
                        <LinearGradient
                            colors={[PRIMARY, PRIMARY_D]}
                            style={styles.heroCard}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        >
                            {/* Decorative orbs */}
                            <View style={[styles.heroOrb, { width: 130, height: 130, right: -40, top: -50 }]} />
                            <View style={[styles.heroOrb, { width: 80, height: 80, left: -20, bottom: -30 }]} />

                            <View style={styles.heroContent}>
                                <View>
                                    <Text style={styles.heroLabel}>This Month</Text>
                                    <Text style={styles.heroTitle}>Your Dashboard</Text>
                                </View>
                                <View style={styles.heroStats}>
                                    {[
                                        { val: '42', lbl: 'Lectures' },
                                        { val: '180', lbl: 'Students' },
                                        { val: '3', lbl: 'Batches' },
                                    ].map((s, i) => (
                                        <View key={i} style={[styles.heroStat, i > 0 && styles.heroStatBorder]}>
                                            <Text style={styles.heroStatVal}>{s.val}</Text>
                                            <Text style={styles.heroStatLbl}>{s.lbl}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </LinearGradient>
                    )}
                </View>

                {/* ═══════════════════════════════════════════════
                    NOTICE BOARD (if any)
                ══════════════════════════════════════════════ */}
                {!loading && notice && (
                    <View style={styles.section}>
                        <TouchableOpacity
                            style={[styles.noticeCard, sd('#2DC87A', 2)]}
                            onPress={() => navigation.navigate('Announcements')}
                            activeOpacity={0.88}
                        >
                            <View style={styles.noticeBadge}>
                                <Ionicons name="megaphone" size={10} color="#FFF" />
                                <Text style={styles.noticeBadgeText}>Notice board</Text>
                            </View>
                            <Text style={styles.noticeTitle} numberOfLines={2}>{notice}</Text>
                            <Text style={styles.noticeLink}>Read more</Text>
                            <View style={[styles.noticeBubble, { width: 60, height: 60, right: 16, top: -14 }]} />
                            <View style={[styles.noticeBubble, { width: 36, height: 36, right: 52, bottom: -8 }]} />
                        </TouchableOpacity>
                    </View>
                )}

                {/* ═══════════════════════════════════════════════
                    QUICK ACTIONS — 2×2 grid, large & touchable
                ══════════════════════════════════════════════ */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                </View>
                <View style={styles.section}>
                    <View style={styles.actionsGrid}>
                        {ACTIONS.map((a) => (
                            <TouchableOpacity
                                key={a.id}
                                style={[styles.actionCard, sd()]}
                                onPress={() => navigation.navigate(a.route)}
                                activeOpacity={0.84}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: a.bg }]}>
                                    <Ionicons name={a.icon as any} size={24} color={a.color} />
                                </View>
                                <Text style={styles.actionLabel}>{a.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* ═══════════════════════════════════════════════
                    TODAY'S CLASSES — timeline style
                ══════════════════════════════════════════════ */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Today's Classes</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
                        <Text style={styles.seeAll}>Schedule →</Text>
                    </TouchableOpacity>
                </View>

                {/* Day strip */}
                <View style={[styles.dayStrip, { marginHorizontal: 20 }, sd()]}>
                    {weekDays.map((d, i) => (
                        <TouchableOpacity key={i} style={styles.dayItem} onPress={() => setSelDay(i)} activeOpacity={0.75}>
                            <Text style={[styles.dayLabel, selDay === i && { color: PRIMARY }]}>
                                {d.short.slice(0, 3).toUpperCase()}
                            </Text>
                            <View style={[styles.dayCircle, selDay === i && styles.dayCircleActive]}>
                                <Text style={[styles.dayNum, selDay === i && styles.dayNumActive]}>{d.date}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Class cards */}
                <View style={styles.section}>
                    {loading ? (
                        <>
                            <SkeletonLoader width="100%" height={80} borderRadius={18} style={{ marginBottom: 10 }} />
                            <SkeletonLoader width="100%" height={80} borderRadius={18} />
                        </>
                    ) : TODAY_CLASSES.map((cls, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[styles.classCard, sd()]}
                            activeOpacity={0.86}
                            onPress={() => navigation.navigate('ScheduleClass')}
                        >
                            {/* Colored left bar */}
                            <View style={[styles.classAccent, { backgroundColor: cls.color }]} />
                            <View style={[styles.classIconBox, { backgroundColor: cls.bg }]}>
                                <Ionicons name="videocam" size={20} color={cls.color} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.className}>{cls.subject}</Text>
                                <Text style={styles.classBatch}>{cls.batch} • {cls.students} students</Text>
                            </View>
                            <View style={styles.classTimeBox}>
                                <Text style={[styles.classTime, { color: cls.color }]}>{cls.time}</Text>
                                <View style={[styles.classDot, { backgroundColor: cls.color }]} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },

    // ── Header ──────────────────────────────────────────────────────
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 22, paddingBottom: 10,
    },
    appIconGrid: { flexDirection: 'row', flexWrap: 'wrap', width: 26, height: 26, gap: 4 },
    gridDot: { width: 10, height: 10, borderRadius: 3 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    headerBtn: {
        width: 40, height: 40, borderRadius: 13, backgroundColor: CARD,
        justifyContent: 'center', alignItems: 'center', ...sd(),
    },
    notifDot: {
        width: 7, height: 7, borderRadius: 3.5, backgroundColor: CORAL,
        position: 'absolute', top: 9, right: 9, borderWidth: 1.5, borderColor: BG,
    },
    avatarBtn: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
    avatarGrad: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    avatarLetter: { color: '#FFF', fontSize: 15, fontWeight: '700' },

    // Greeting
    greetRow: { paddingHorizontal: 22, marginBottom: 16 },
    greetLine: { fontSize: 13, color: GRAY, fontWeight: '400' },
    greetName: { fontWeight: '600', color: DARK },

    // Layout helpers
    section: { paddingHorizontal: 20, marginBottom: 8 },
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 22, marginTop: 22, marginBottom: 12,
    },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: DARK },
    seeAll: { fontSize: 13, fontWeight: '600', color: PRIMARY },

    // ── Hero Stats Card ──────────────────────────────────────────────
    heroCard: { borderRadius: 24, overflow: 'hidden' },
    heroOrb: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.10)' },
    heroContent: { padding: 20, gap: 18 },
    heroLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: 2, letterSpacing: 0.5 },
    heroTitle: { fontSize: 20, fontWeight: '700', color: '#FFF', letterSpacing: -0.3 },
    heroStats: { flexDirection: 'row' },
    heroStat: { flex: 1, alignItems: 'center', gap: 3 },
    heroStatBorder: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.2)' },
    heroStatVal: { fontSize: 24, fontWeight: '800', color: '#FFF' },
    heroStatLbl: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: '600' },

    // ── Notice Card ────────────────────────────────────────────────
    noticeCard: {
        backgroundColor: CARD, borderRadius: 20, padding: 16,
        overflow: 'hidden', borderWidth: 1, borderColor: '#E4F9EF',
        gap: 6,
    },
    noticeBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: PRIMARY, borderRadius: 50,
        paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start',
    },
    noticeBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
    noticeTitle: { fontSize: 14, fontWeight: '600', color: DARK, maxWidth: '72%' },
    noticeLink: { fontSize: 13, fontWeight: '700', color: PRIMARY },
    noticeBubble: { position: 'absolute', borderRadius: 999, backgroundColor: PRIMARY + '18' },

    // ── Actions Grid ───────────────────────────────────────────────
    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    actionCard: {
        width: (width - 52) / 2,
        backgroundColor: CARD, borderRadius: 20,
        padding: 18, gap: 12,
    },
    actionIcon: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    actionLabel: { fontSize: 13, fontWeight: '700', color: DARK, lineHeight: 18 },

    // ── Day Strip ─────────────────────────────────────────────────
    dayStrip: {
        flexDirection: 'row', backgroundColor: CARD, borderRadius: 18,
        paddingVertical: 12, paddingHorizontal: 6,
        marginBottom: 12, justifyContent: 'space-between',
    },
    dayItem: { alignItems: 'center', gap: 7, flex: 1 },
    dayLabel: { fontSize: 9, fontWeight: '600', color: GRAY, letterSpacing: 0.4 },
    dayCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    dayCircleActive: { backgroundColor: PRIMARY },
    dayNum: { fontSize: 13, fontWeight: '700', color: DARK },
    dayNumActive: { color: '#FFF' },

    // ── Class Cards ──────────────────────────────────────────────
    classCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: CARD, borderRadius: 18,
        marginBottom: 10, overflow: 'hidden', gap: 12,
    },
    classAccent: { width: 4, height: '100%', alignSelf: 'stretch' },
    classIconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    className: { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 3 },
    classBatch: { fontSize: 11, color: GRAY, fontWeight: '500' },
    classTimeBox: { alignItems: 'flex-end', paddingRight: 14, gap: 6 },
    classTime: { fontSize: 12, fontWeight: '700' },
    classDot: { width: 6, height: 6, borderRadius: 3 },
});
