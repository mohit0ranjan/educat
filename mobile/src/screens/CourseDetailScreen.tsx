import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Dimensions, Platform, StatusBar, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SkeletonLoader from '../components/SkeletonLoader';
import { getLecturesByCourse, getCourseById } from '../api/client';

const { width } = Dimensions.get('window');

// ─── Tokens ────────────────────────────────────────────────────────
const BG = '#F6F7FB';
const CARD = '#FFFFFF';
const PRIMARY = '#2DC87A';
const PRIMARY_D = '#1DA362';
const DARK = '#1A1C2E';
const GRAY = '#9096B2';
const VIOLET = '#7C6EF5';
const ORANGE = '#FF8C42';
const BORDER = '#ECEEF5';

const sd = (c = '#9096B2', e = 3) => Platform.select({
    ios: { shadowColor: c, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.09, shadowRadius: 10 },
    android: { elevation: e },
}) as any;

// Extract YouTube video ID from various URL formats
function extractYTId(url: string): string {
    const match = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : 'dQw4w9WgXcQ';
}

const TABS = ['Lectures', 'Chapters', 'Mock Tests'] as const;
type Tab = typeof TABS[number];

export default function CourseDetailScreen({ route, navigation }: any) {
    const insets = useSafeAreaInsets();

    // Params from SubjectsScreen or HomeScreen continue-learning card
    const {
        courseId,
        title: subjectTitle = 'Mathematics',
        desc: subjectDesc = '',
        color: accentColor = PRIMARY,
        icon: subjectIcon = 'book-outline',
    } = route.params || {};

    const [activeTab, setActiveTab] = useState<Tab>('Lectures');
    const [lectures, setLectures] = useState<any[]>([]);
    const [modules, setModules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lectCount, setLectCount] = useState(0);

    useEffect(() => {
        if (!courseId) { setLoading(false); return; }
        Promise.all([
            getLecturesByCourse(courseId).then(d => {
                const list = Array.isArray(d) ? d : [];
                setLectures(list);
                setLectCount(list.length);
            }),
            getCourseById(courseId).then((d: any) => {
                setModules(d?.attributes?.modules?.data || []);
            }),
        ]).catch(console.error)
            .finally(() => setLoading(false));
    }, [courseId]);

    // Group lectures by module for chapter view
    const lecturesByModule = lectures.reduce((acc: any, lec: any) => {
        const modTitle = lec.attributes?.module?.data?.attributes?.title || 'General';
        if (!acc[modTitle]) acc[modTitle] = [];
        acc[modTitle].push(lec);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" />

            {/* ── Banner ── */}
            <LinearGradient
                colors={[accentColor, accentColor + 'CC']}
                style={[styles.banner, { paddingTop: Math.max(insets.top, 20) + 8 }]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
                {/* Decorative orbs */}
                <View style={[styles.bannerOrb, { width: 160, height: 160, right: -50, top: -60 }]} />
                <View style={[styles.bannerOrb, { width: 90, height: 90, left: -20, bottom: -30 }]} />

                {/* Header row */}
                <View style={styles.bannerRow}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={22} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.iconChip}>
                        <Ionicons name={subjectIcon as any} size={14} color={accentColor} />
                    </View>
                    <TouchableOpacity style={styles.backBtn}>
                        <Ionicons name="bookmark-outline" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.bannerTitle}>{subjectTitle}</Text>
                {subjectDesc ? <Text style={styles.bannerDesc}>{subjectDesc}</Text> : null}

                {/* Stats */}
                <View style={styles.statsRow}>
                    {[
                        { val: String(lectCount), lbl: 'Lectures' },
                        { val: String(modules.length), lbl: 'Chapters' },
                        { val: '—', lbl: 'Tests' },
                    ].map((s, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <View style={styles.statDiv} />}
                            <View style={styles.statBox}>
                                <Text style={styles.statVal}>{s.val}</Text>
                                <Text style={styles.statLbl}>{s.lbl}</Text>
                            </View>
                        </React.Fragment>
                    ))}
                </View>
            </LinearGradient>

            {/* ── Tab Row ── */}
            <View style={[styles.tabRow, sd()]}>
                {TABS.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && { borderBottomColor: PRIMARY, borderBottomWidth: 2.5 }]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabTxt, activeTab === tab && { color: PRIMARY, fontWeight: '700' }]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* ── Content ── */}
            <ScrollView
                contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* ─────────── LECTURES TAB ─────────── */}
                {activeTab === 'Lectures' && (
                    loading ? (
                        <>
                            <SkeletonLoader width="100%" height={78} borderRadius={16} style={{ marginBottom: 10 }} />
                            <SkeletonLoader width="100%" height={78} borderRadius={16} style={{ marginBottom: 10 }} />
                            <SkeletonLoader width="100%" height={78} borderRadius={16} />
                        </>
                    ) : lectures.length === 0 ? (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIcon}>
                                <Ionicons name="videocam-outline" size={32} color={GRAY} />
                            </View>
                            <Text style={styles.emptyTitle}>No lectures yet</Text>
                            <Text style={styles.emptyDesc}>Your teacher hasn't uploaded any lectures for this subject yet. Check back soon!</Text>
                        </View>
                    ) : (
                        lectures.map((lec: any, i: number) => {
                            const attr = lec.attributes || {};
                            const videoId = extractYTId(attr.videoUrl || '');
                            const modName = attr.module?.data?.attributes?.title;
                            const teacher = attr.teacher?.data?.attributes?.username || attr.teacher?.data?.attributes?.email || '';

                            return (
                                <TouchableOpacity
                                    key={lec.id}
                                    style={[styles.lectureCard, sd()]}
                                    onPress={() => navigation.navigate('VideoPlayer', {
                                        videoId,
                                        title: attr.title,
                                        chapter: subjectTitle,
                                    })}
                                    activeOpacity={0.86}
                                >
                                    {/* Index */}
                                    <View style={styles.lectIndex}>
                                        <Text style={styles.lectIndexNum}>{String(i + 1).padStart(2, '0')}</Text>
                                        <Ionicons name="play-circle" size={22} color={PRIMARY} />
                                    </View>

                                    <View style={styles.lectInfo}>
                                        <Text style={styles.lectTitle} numberOfLines={2}>{attr.title}</Text>
                                        <View style={styles.lectMeta}>
                                            {modName && (
                                                <>
                                                    <Ionicons name="layers-outline" size={11} color={GRAY} />
                                                    <Text style={styles.lectMetaTxt}>{modName}</Text>
                                                    <View style={styles.metaDivider} />
                                                </>
                                            )}
                                            {attr.duration > 0 && (
                                                <>
                                                    <Ionicons name="time-outline" size={11} color={GRAY} />
                                                    <Text style={styles.lectMetaTxt}>{attr.duration} min</Text>
                                                </>
                                            )}
                                        </View>
                                        {teacher ? (
                                            <Text style={styles.lectTeacher}>👤 {teacher.split('@')[0]}</Text>
                                        ) : null}
                                    </View>

                                    {attr.notesUrl ? (
                                        <TouchableOpacity
                                            style={styles.notesBtn}
                                            onPress={() => navigation.navigate('PdfViewer', { pdfUrl: attr.notesUrl, title: attr.title })}
                                        >
                                            <Ionicons name="document-text-outline" size={16} color={ORANGE} />
                                        </TouchableOpacity>
                                    ) : (
                                        <Ionicons name="chevron-forward" size={16} color={GRAY} style={{ paddingRight: 4 }} />
                                    )}
                                </TouchableOpacity>
                            );
                        })
                    )
                )}

                {/* ─────────── CHAPTERS TAB ─────────── */}
                {activeTab === 'Chapters' && (
                    loading ? (
                        <SkeletonLoader width="100%" height={200} borderRadius={16} />
                    ) : Object.keys(lecturesByModule).length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyTitle}>No chapters yet</Text>
                            <Text style={styles.emptyDesc}>Chapters will appear here once your teacher organises lectures into modules.</Text>
                        </View>
                    ) : (
                        Object.entries(lecturesByModule).map(([modTitle, lecs]: [string, any[]]) => (
                            <View key={modTitle} style={[styles.moduleSection, sd()]}>
                                <View style={styles.moduleHeader}>
                                    <View style={[styles.moduleIcon, { backgroundColor: accentColor + '20' }]}>
                                        <Ionicons name="layers" size={16} color={accentColor} />
                                    </View>
                                    <Text style={styles.moduleTitle}>{modTitle}</Text>
                                    <View style={styles.moduleBadge}>
                                        <Text style={styles.moduleBadgeTxt}>{lecs.length}</Text>
                                    </View>
                                </View>
                                {lecs.map((lec: any, j: number) => (
                                    <TouchableOpacity
                                        key={lec.id}
                                        style={styles.modLecRow}
                                        onPress={() => navigation.navigate('VideoPlayer', {
                                            videoId: extractYTId(lec.attributes?.videoUrl || ''),
                                            title: lec.attributes?.title,
                                            chapter: subjectTitle,
                                        })}
                                        activeOpacity={0.82}
                                    >
                                        <View style={styles.modLecDot}>
                                            <Ionicons name="play" size={10} color={PRIMARY} />
                                        </View>
                                        <Text style={styles.modLecTitle} numberOfLines={1}>{lec.attributes?.title}</Text>
                                        {lec.attributes?.duration > 0 && (
                                            <Text style={styles.modLecDur}>{lec.attributes.duration}m</Text>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))
                    )
                )}

                {/* ─────────── TESTS TAB ─────────── */}
                {activeTab === 'Mock Tests' && (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="document-text-outline" size={32} color={GRAY} />
                        </View>
                        <Text style={styles.emptyTitle}>Tests coming soon</Text>
                        <Text style={styles.emptyDesc}>Mock tests for this subject will appear here once your teacher publishes them.</Text>
                        <TouchableOpacity
                            style={[styles.testCTA, { backgroundColor: accentColor }]}
                            onPress={() => navigation.navigate('Tests')}
                        >
                            <Text style={styles.testCTATxt}>Browse All Tests</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },

    // Banner
    banner: { paddingHorizontal: 20, paddingBottom: 28, overflow: 'hidden' },
    bannerOrb: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)' },
    bannerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
    backBtn: {
        width: 38, height: 38, borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.18)',
        justifyContent: 'center', alignItems: 'center',
    },
    iconChip: {
        backgroundColor: CARD, borderRadius: 50,
        paddingHorizontal: 14, paddingVertical: 6,
    },
    bannerTitle: { fontSize: 26, fontWeight: '700', color: '#FFF', marginBottom: 4, letterSpacing: -0.3 },
    bannerDesc: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 18 },

    statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 18, paddingVertical: 14 },
    statBox: { flex: 1, alignItems: 'center', gap: 2 },
    statVal: { fontSize: 20, fontWeight: '700', color: '#FFF' },
    statLbl: { fontSize: 10, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
    statDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },

    // Tabs
    tabRow: {
        flexDirection: 'row', backgroundColor: CARD,
        paddingHorizontal: 20,
    },
    tab: {
        flex: 1, paddingVertical: 14, alignItems: 'center',
        borderBottomWidth: 2.5, borderBottomColor: 'transparent',
    },
    tabTxt: { fontSize: 13, fontWeight: '600', color: GRAY },

    // Content
    content: { padding: 18, gap: 10 },

    // Lecture card
    lectureCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: CARD, borderRadius: 16, padding: 14, gap: 12,
    },
    lectIndex: {
        width: 60, height: 50, borderRadius: 12,
        backgroundColor: '#E6F9F1',
        justifyContent: 'center', alignItems: 'center', gap: 2,
    },
    lectIndexNum: { fontSize: 10, fontWeight: '800', color: PRIMARY },
    lectInfo: { flex: 1 },
    lectTitle: { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 5, lineHeight: 19 },
    lectMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    lectMetaTxt: { fontSize: 10, color: GRAY, fontWeight: '500' },
    metaDivider: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: BORDER },
    lectTeacher: { fontSize: 10, color: GRAY, marginTop: 3 },
    notesBtn: {
        width: 32, height: 32, borderRadius: 10, backgroundColor: '#FFF0E6',
        justifyContent: 'center', alignItems: 'center',
    },

    // Module section
    moduleSection: {
        backgroundColor: CARD, borderRadius: 18, overflow: 'hidden',
    },
    moduleHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        padding: 14, borderBottomWidth: 1, borderBottomColor: BORDER,
    },
    moduleIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    moduleTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: DARK },
    moduleBadge: { backgroundColor: '#E6F9F1', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
    moduleBadgeTxt: { fontSize: 11, fontWeight: '700', color: PRIMARY },

    modLecRow: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        paddingHorizontal: 14, paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: BORDER,
    },
    modLecDot: { width: 22, height: 22, borderRadius: 7, backgroundColor: '#E6F9F1', justifyContent: 'center', alignItems: 'center' },
    modLecTitle: { flex: 1, fontSize: 13, color: DARK, fontWeight: '500' },
    modLecDur: { fontSize: 11, color: GRAY, fontWeight: '500' },

    // Empty state
    emptyState: { alignItems: 'center', paddingVertical: 50, gap: 12, paddingHorizontal: 20 },
    emptyIcon: { width: 72, height: 72, borderRadius: 22, backgroundColor: '#F0F2F8', justifyContent: 'center', alignItems: 'center' },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: DARK },
    emptyDesc: { fontSize: 13, color: GRAY, textAlign: 'center', lineHeight: 20 },
    testCTA: { borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
    testCTATxt: { color: '#FFF', fontWeight: '700', fontSize: 14 },
});
