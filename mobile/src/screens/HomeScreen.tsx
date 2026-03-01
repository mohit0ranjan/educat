import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Dimensions, Platform, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SkeletonLoader from '../components/SkeletonLoader';
import { useAuthStore } from '../services/store';

const { width } = Dimensions.get('window');

// ─── Design Tokens ─────────────────────────────────────────────────
const BG = '#F6F7FB';
const CARD = '#FFFFFF';
const PRIMARY = '#2DC87A';   // Mint green
const PRIMARY_D = '#1DA362';
const ORANGE = '#FF8C42';   // Warm orange
const VIOLET = '#7C6EF5';
const BLUE = '#4A90E2';
const CORAL = '#FF6B6B';
const DARK = '#1A1C2E';
const GRAY = '#9096B2';
const LIGHT_GRAY = '#C4C9DC';
const BORDER = '#ECEEF5';

const s = (color = '#9096B2', elev = 3) => Platform.select({
    ios: { shadowColor: color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 12 },
    android: { elevation: elev },
}) as any;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HomeScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const today = new Date();

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(t);
    }, []);

    const hour = today.getHours();
    const greet = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    const classes = [
        { id: '1', subject: 'Drawing Method', batch: 'GDM (2/2)', isLive: true, color: PRIMARY },
        { id: '2', subject: 'Drawing Method', batch: 'GDM (2/2)', isLive: false, liveIn: '2 hour', color: VIOLET },
        { id: '3', subject: 'UI/UX Basics', batch: 'GDM (2/2)', isLive: false, liveIn: null, color: ORANGE },
    ];


    // Display name - shorten long emails
    const displayName = (() => {
        const name = user?.username || 'Student';
        if (name.includes('@')) return name.split('@')[0];
        return name;
    })();

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor={BG} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 110 }}
            >
                {/* ═══════════════════════════════════
                    HEADER  — minimal, like sample
                ═══════════════════════════════════ */}
                <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
                    {/* App grid icon — left */}
                    <View style={styles.appIconGrid}>
                        {[0, 1, 2, 3].map(i => (
                            <View key={i} style={[
                                styles.gridDot,
                                { backgroundColor: i === 0 ? PRIMARY : i === 3 ? PRIMARY + 'AA' : '#D0D4E8' }
                            ]} />
                        ))}
                    </View>

                    {/* Right: bell + avatar */}
                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={styles.headerBtn}
                            onPress={() => navigation.navigate('Announcements')}
                        >
                            <Ionicons name="notifications-outline" size={20} color={DARK} />
                            <View style={styles.notifDot} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.avatarBtn}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <LinearGradient colors={[PRIMARY, PRIMARY_D]} style={styles.avatarGrad}>
                                <Text style={styles.avatarLetter}>{displayName[0].toUpperCase()}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Greeting line — compact, below header */}
                <View style={styles.greetRow}>
                    <Text style={styles.greetLine}>{greet}, <Text style={styles.greetName}>{displayName}</Text> 👋</Text>
                </View>

                {/* ═══════════════════════════════════
                    NOTICE BOARD CARD
                ═══════════════════════════════════ */}
                <View style={styles.section}>
                    {loading ? (
                        <SkeletonLoader width="100%" height={90} borderRadius={20} />
                    ) : (
                        <TouchableOpacity
                            style={[styles.noticeCard, s('#2DC87A', 3)]}
                            onPress={() => navigation.navigate('Announcements')}
                            activeOpacity={0.88}
                        >
                            <View style={styles.noticeBadgeRow}>
                                <View style={styles.noticeBadge}>
                                    <Ionicons name="megaphone" size={10} color="#FFF" />
                                    <Text style={styles.noticeBadgeText}>Notice board</Text>
                                </View>
                            </View>
                            <Text style={styles.noticeTitle}>Virtual STEM Clubs for Gr 4–9 with...</Text>
                            <Text style={styles.noticeLink}>Read more</Text>
                            <View style={[styles.bubble, { width: 64, height: 64, right: 16, top: -14, backgroundColor: PRIMARY + '1A' }]} />
                            <View style={[styles.bubble, { width: 40, height: 40, right: 48, bottom: -10, backgroundColor: ORANGE + '1C' }]} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* ═══════════════════════════════════
                    TODAY'S CLASS
                ═══════════════════════════════════ */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Today's Class</Text>
                </View>

                {loading ? (
                    <View style={styles.section}>
                        <SkeletonLoader width="100%" height={130} borderRadius={22} />
                    </View>
                ) : (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.classScrollContent}
                        decelerationRate="fast"
                        snapToInterval={width * 0.55 + 14}
                    >
                        {classes.map((cls) => {
                            const isScheduled = !cls.isLive && !cls.liveIn;
                            return (
                                <TouchableOpacity
                                    key={cls.id}
                                    style={[styles.classCard, s(cls.color, 3)]}
                                    onPress={() => cls.isLive && navigation.navigate('VideoPlayer', { videoId: 'dQw4w9WgXcQ', title: cls.subject, chapter: 'Live' })}
                                    activeOpacity={0.88}
                                >
                                    {/* Thumbnail */}
                                    <View style={[styles.classThumbnail, { backgroundColor: cls.color + '15' }]}>
                                        <View style={[styles.classThumbIcon, { backgroundColor: cls.color + '25' }]}>
                                            <Ionicons name="desktop-outline" size={26} color={cls.color} />
                                        </View>

                                        {/* Status badge */}
                                        <View style={[
                                            styles.statusBadge,
                                            { backgroundColor: cls.isLive ? PRIMARY : cls.liveIn ? ORANGE : '#9096B2' }
                                        ]}>
                                            {cls.isLive && <View style={styles.livePulse} />}
                                            <Text style={styles.statusText}>
                                                {cls.isLive ? 'Live' : cls.liveIn ? `Live on after ${cls.liveIn}` : 'Upcoming'}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Info */}
                                    <View style={styles.classInfo}>
                                        <Text style={styles.classSubject} numberOfLines={1}>
                                            Class: {cls.subject}
                                        </Text>
                                        <Text style={styles.classBatch}>Batch: {cls.batch}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                )}

                {/* ═══════════════════════════════════
                    CONTINUE LEARNING
                ═══════════════════════════════════ */}
                <View style={[styles.sectionHeader, { marginTop: 8 }]}>
                    <Text style={styles.sectionTitle}>Continue Learning</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Subjects')}>
                        <Text style={styles.seeAll}>See all</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    {loading ? (
                        <SkeletonLoader width="100%" height={170} borderRadius={22} />
                    ) : (
                        /* ── Featured Course Card ── */
                        <TouchableOpacity
                            style={[styles.featuredCard, s(VIOLET, 5)]}
                            onPress={() => navigation.navigate('CourseDetail')}
                            activeOpacity={0.88}
                        >
                            <LinearGradient
                                colors={['#7C6EF5', '#5A4FD4']}
                                style={styles.featuredGrad}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                {/* Top row */}
                                <View style={styles.featuredTop}>
                                    <View style={styles.featuredIconBox}>
                                        <Ionicons name="calculator" size={26} color="#FFF" />
                                    </View>
                                    <View style={styles.featuredMeta}>
                                        <View style={styles.featuredBadge}>
                                            <Text style={styles.featuredBadgeText}>In Progress</Text>
                                        </View>
                                        <Text style={styles.featuredPct}>68%</Text>
                                    </View>
                                </View>

                                {/* Title */}
                                <Text style={styles.featuredName}>Mathematics</Text>
                                <Text style={styles.featuredDesc}>Chapter 5: Quadratic Equations</Text>

                                {/* Progress bar */}
                                <View style={styles.featuredProgressBg}>
                                    <View style={[styles.featuredProgressFill, { width: '68%' }]} />
                                </View>

                                {/* Footer */}
                                <View style={styles.featuredFooter}>
                                    <View style={styles.featuredStat}>
                                        <Ionicons name="play-circle-outline" size={14} color="rgba(255,255,255,0.8)" />
                                        <Text style={styles.featuredStatText}>14 lessons</Text>
                                    </View>
                                    <TouchableOpacity style={styles.resumeBtn} onPress={() => navigation.navigate('CourseDetail')}>
                                        <Text style={styles.resumeBtnText}>Resume  →</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Decorative circles */}
                                <View style={[styles.deco, { width: 130, height: 130, right: -40, top: -40 }]} />
                                <View style={[styles.deco, { width: 80, height: 80, right: 30, bottom: -30 }]} />
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>

                {/* ── My Courses horizontal row ── */}
                {!loading && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.coursesRow}
                    >
                        {[
                            { name: 'Physics', icon: 'magnet', color: BLUE, bg: '#EBF3FD', pct: 45 },
                            { name: 'Chemistry', icon: 'beaker', color: ORANGE, bg: '#FFF0E6', pct: 30 },
                            { name: 'English', icon: 'book', color: PRIMARY, bg: '#E6F9F1', pct: 60 },
                            { name: 'Biology', icon: 'leaf', color: '#3BAA6F', bg: '#E8F8EE', pct: 20 },
                        ].map((c, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.courseChip, s()]}
                                onPress={() => navigation.navigate('CourseDetail')}
                                activeOpacity={0.85}
                            >
                                <View style={[styles.courseChipIcon, { backgroundColor: c.bg }]}>
                                    <Ionicons name={c.icon as any} size={20} color={c.color} />
                                </View>
                                <Text style={styles.courseChipName}>{c.name}</Text>
                                {/* Mini progress bar */}
                                <View style={styles.chipProgressBg}>
                                    <View style={[styles.chipProgressFill, { width: `${c.pct}%`, backgroundColor: c.color }]} />
                                </View>
                                <Text style={[styles.chipPct, { color: c.color }]}>{c.pct}%</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {/* ═══════════════════════════════════
                    QUICK ACCESS
                ═══════════════════════════════════ */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Quick Access</Text>
                </View>

                <View style={[styles.quickGrid, styles.section]}>
                    {[
                        { label: 'Schedule', icon: 'calendar-outline', color: PRIMARY, bg: '#E6F9F1', route: 'Schedule' },
                        { label: 'Subjects', icon: 'book-outline', color: VIOLET, bg: '#EEEDFD', route: 'Subjects' },
                        { label: 'Tests', icon: 'document-text-outline', color: ORANGE, bg: '#FFF0E6', route: 'Tests' },
                        { label: 'Updates', icon: 'megaphone-outline', color: CORAL, bg: '#FFEDED', route: 'Announcements' },
                    ].map((q, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[styles.quickCard, s()]}
                            onPress={() => navigation.navigate(q.route)}
                            activeOpacity={0.84}
                        >
                            <View style={[styles.quickIconBox, { backgroundColor: q.bg }]}>
                                <Ionicons name={q.icon as any} size={22} color={q.color} />
                            </View>
                            <Text style={styles.quickLabel}>{q.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },

    // ─── Header (minimal like sample) ────────────────────────────────
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 22,
        paddingBottom: 10,
        backgroundColor: BG,
    },
    // 2×2 dot grid app icon
    appIconGrid: { flexDirection: 'row', flexWrap: 'wrap', width: 26, height: 26, gap: 4 },
    gridDot: { width: 10, height: 10, borderRadius: 3 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    headerBtn: {
        width: 40, height: 40, borderRadius: 13, backgroundColor: CARD,
        justifyContent: 'center', alignItems: 'center',
        ...s(),
    },
    notifDot: {
        width: 7, height: 7, borderRadius: 3.5, backgroundColor: CORAL,
        position: 'absolute', top: 9, right: 9, borderWidth: 1.5, borderColor: CARD,
    },
    avatarBtn: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
    avatarGrad: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    avatarLetter: { color: '#FFF', fontSize: 15, fontWeight: '700' },

    // Greeting line — small one-liner below the top bar
    greetRow: { paddingHorizontal: 22, marginBottom: 14 },
    greetLine: { fontSize: 13, color: GRAY, fontWeight: '400' },
    greetName: { fontWeight: '600', color: DARK },

    // ─── Section layout ───────────────────────────────────────────────
    section: { paddingHorizontal: 22, marginBottom: 8 },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 22,
        marginTop: 24,
        marginBottom: 14,
    },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: DARK, letterSpacing: -0.3 },
    seeAll: { fontSize: 13, fontWeight: '600', color: PRIMARY },

    // ─── Notice Card ──────────────────────────────────────────────────
    noticeCard: {
        backgroundColor: CARD,
        borderRadius: 22,
        padding: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E4F9EF',
    },
    noticeBadgeRow: { marginBottom: 10 },
    noticeBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: PRIMARY, borderRadius: 50,
        paddingHorizontal: 10, paddingVertical: 5,
        alignSelf: 'flex-start',
    },
    noticeBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
    noticeTitle: {
        fontSize: 15, fontWeight: '600', color: DARK,
        lineHeight: 22, maxWidth: '70%', marginBottom: 8,
    },
    noticeLink: { fontSize: 14, fontWeight: '700', color: PRIMARY },
    bubble: { position: 'absolute', borderRadius: 999 },

    // ─── Today's Class ────────────────────────────────────────────────
    classScrollContent: {
        paddingLeft: 22,
        paddingRight: 8,
        paddingBottom: 4,
        gap: 14,
    },
    classCard: {
        width: width * 0.52,
        backgroundColor: CARD,
        borderRadius: 20,
        overflow: 'hidden',
    },
    classThumbnail: {
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    classThumbIcon: {
        width: 54, height: 54, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center',
    },
    statusBadge: {
        position: 'absolute', bottom: 10, left: 10,
        flexDirection: 'row', alignItems: 'center', gap: 5,
        paddingHorizontal: 9, paddingVertical: 4, borderRadius: 50,
    },
    livePulse: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF' },
    statusText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
    classInfo: { paddingHorizontal: 12, paddingVertical: 10, gap: 3 },
    classSubject: { fontSize: 13, fontWeight: '700', color: DARK },
    classBatch: { fontSize: 11, color: GRAY, fontWeight: '500' },

    // ─── Featured Course Card ──────────────────────────────────────────
    featuredCard: { borderRadius: 24, overflow: 'hidden' },
    featuredGrad: { padding: 22, overflow: 'hidden' },
    featuredTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 18,
    },
    featuredIconBox: {
        width: 52, height: 52, borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center', alignItems: 'center',
    },
    featuredMeta: { alignItems: 'flex-end', gap: 6 },
    featuredBadge: {
        backgroundColor: 'rgba(255,255,255,0.22)',
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50,
    },
    featuredBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
    featuredPct: { fontSize: 22, fontWeight: '800', color: '#FFF' },
    featuredName: { fontSize: 22, fontWeight: '700', color: '#FFF', marginBottom: 4, letterSpacing: -0.4 },
    featuredDesc: { fontSize: 13, color: 'rgba(255,255,255,0.78)', fontWeight: '500', marginBottom: 18 },
    featuredProgressBg: { height: 5, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 4, marginBottom: 18, overflow: 'hidden' },
    featuredProgressFill: { height: '100%', backgroundColor: '#FFF', borderRadius: 4 },
    featuredFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    featuredStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    featuredStatText: { fontSize: 13, color: 'rgba(255,255,255,0.82)', fontWeight: '600' },
    resumeBtn: {
        backgroundColor: 'rgba(255,255,255,0.22)',
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50,
    },
    resumeBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
    deco: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.09)' },

    // ─── Courses Row ──────────────────────────────────────────────────
    coursesRow: {
        paddingLeft: 22, paddingRight: 8, paddingTop: 14,
        paddingBottom: 4, gap: 12,
    },
    courseChip: {
        backgroundColor: CARD,
        borderRadius: 18,
        padding: 14,
        width: 120,
        gap: 8,
        alignItems: 'flex-start',
    },
    courseChipIcon: { width: 40, height: 40, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
    courseChipName: { fontSize: 13, fontWeight: '700', color: DARK },
    chipProgressBg: { height: 4, backgroundColor: BORDER, borderRadius: 3, width: '100%', overflow: 'hidden' },
    chipProgressFill: { height: '100%', borderRadius: 3 },
    chipPct: { fontSize: 11, fontWeight: '700' },

    // ─── Quick Access ─────────────────────────────────────────────────
    quickGrid: { flexDirection: 'row', gap: 12 },
    quickCard: {
        flex: 1, backgroundColor: CARD, borderRadius: 18,
        paddingVertical: 18, alignItems: 'center', gap: 10,
    },
    quickIconBox: { width: 48, height: 48, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    quickLabel: { fontSize: 11, fontWeight: '700', color: DARK, textAlign: 'center' },
});
