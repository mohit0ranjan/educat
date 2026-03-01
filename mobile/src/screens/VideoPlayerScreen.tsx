import React, { useState, useCallback, useRef } from 'react';
import {
    View, Text, StyleSheet, Dimensions, ScrollView,
    TouchableOpacity, ActivityIndicator, Platform, StatusBar, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width } = Dimensions.get('window');
const VIDEO_H = width * 0.5625; // 16:9

// ─── Tokens ────────────────────────────────────────────────────────
const BG = '#F6F7FB';
const CARD = '#FFFFFF';
const DARK = '#1A1C2E';
const GRAY = '#9096B2';
const PRIMARY = '#2DC87A';
const VIOLET = '#7C6EF5';
const ORANGE = '#FF8C42';
const BORDER = '#ECEEF5';

const sd = (c = '#9096B2', e = 3) => Platform.select({
    ios: { shadowColor: c, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.09, shadowRadius: 10 },
    android: { elevation: e },
}) as any;

const NEXT_LESSONS = [
    { id: 1, title: 'Polynomials – Part 2', duration: '18 min', color: VIOLET, bg: '#EEEDFD' },
    { id: 2, title: 'Factoring Quadratics', duration: '22 min', color: PRIMARY, bg: '#E6F9F1' },
    { id: 3, title: 'Graph of y = ax² + c', duration: '15 min', color: ORANGE, bg: '#FFF0E6' },
];

export default function VideoPlayerScreen({ route, navigation }: any) {
    const insets = useSafeAreaInsets();
    const {
        videoId = 'dQw4w9WgXcQ',
        title = 'Quadratic Equations — Part 1',
        chapter = 'Mathematics',
    } = route.params || {};

    const [playing, setPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [activeTab, setActiveTab] = useState<'notes' | 'next'>('next');

    const onStateChange = useCallback((state: string) => {
        if (state === 'ended') setPlaying(false);
    }, []);

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor={DARK} />

            {/* ── Top Chrome (on top of player) ── */}
            <View style={[styles.playerShell, { paddingTop: Math.max(insets.top, 0) }]}>
                {/* Header row over black player bar */}
                <View style={styles.playerHeader}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={22} color="#FFF" />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.playerChapter}>{chapter}</Text>
                        <Text style={styles.playerVideoTitle} numberOfLines={1}>{title}</Text>
                    </View>
                    <TouchableOpacity style={styles.miniBtn}>
                        <Ionicons name="ellipsis-horizontal" size={18} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* ── YouTube Player ── */}
                <View style={styles.playerBox}>
                    {!isReady && (
                        <View style={styles.loaderOverlay}>
                            <ActivityIndicator size="large" color={PRIMARY} />
                        </View>
                    )}
                    <YoutubePlayer
                        height={VIDEO_H}
                        play={playing}
                        videoId={videoId}
                        onChangeState={onStateChange}
                        onReady={() => setIsReady(true)}
                        webViewStyle={{ opacity: 0.99 }}
                    />
                </View>
            </View>

            {/* ── Scrollable content below player ── */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Title & Actions ── */}
                <View style={styles.titleRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.videoTitle}>{title}</Text>
                        <View style={styles.metaRow}>
                            <View style={styles.metaTag}>
                                <Ionicons name="time-outline" size={12} color={GRAY} />
                                <Text style={styles.metaText}>25 mins</Text>
                            </View>
                            <View style={styles.metaDot} />
                            <View style={styles.metaTag}>
                                <Ionicons name="videocam-outline" size={12} color={GRAY} />
                                <Text style={styles.metaText}>HD Video</Text>
                            </View>
                            <View style={styles.metaDot} />
                            <View style={styles.metaTag}>
                                <Ionicons name="document-text-outline" size={12} color={GRAY} />
                                <Text style={styles.metaText}>Notes</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.actionBtn, isLiked && { backgroundColor: '#FFE8E8' }]}
                        onPress={() => setIsLiked(!isLiked)}
                    >
                        <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={20}
                            color={isLiked ? '#FF6B6B' : GRAY} />
                    </TouchableOpacity>
                </View>

                {/* ── Progress Bar ── */}
                <View style={styles.progressWrap}>
                    <View style={styles.progressBg}>
                        <View style={[styles.progressFill, { width: '40%' }]} />
                    </View>
                    <Text style={styles.progressLabel}>40% Complete</Text>
                </View>

                {/* ── Tab Switch ── */}
                <View style={styles.tabRow}>
                    {([['next', 'Up Next'], ['notes', 'Notes']] as const).map(([k, label]) => (
                        <TouchableOpacity
                            key={k}
                            style={[styles.tabBtn, activeTab === k && styles.tabBtnActive]}
                            onPress={() => setActiveTab(k)}
                        >
                            <Text style={[styles.tabTxt, activeTab === k && styles.tabTxtActive]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ── Tab Content ── */}
                {activeTab === 'next' ? (
                    <View style={styles.listWrap}>
                        {NEXT_LESSONS.map((lesson, i) => (
                            <TouchableOpacity
                                key={lesson.id}
                                style={[styles.nextCard, sd()]}
                                activeOpacity={0.85}
                            >
                                {/* Numbered thumb */}
                                <View style={[styles.nextThumb, { backgroundColor: lesson.bg }]}>
                                    <Text style={[styles.nextNum, { color: lesson.color }]}>
                                        {String(i + 2).padStart(2, '0')}
                                    </Text>
                                    <Ionicons name="play-circle" size={22} color={lesson.color} />
                                </View>
                                <View style={styles.nextInfo}>
                                    <Text style={styles.nextTitle}>{lesson.title}</Text>
                                    <View style={styles.nextMeta}>
                                        <Ionicons name="time-outline" size={12} color={GRAY} />
                                        <Text style={styles.nextMetaText}>{lesson.duration}</Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color={GRAY} />
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View style={[styles.notesCard, sd()]}>
                        <View style={styles.notesHeader}>
                            <Ionicons name="document-text" size={18} color={PRIMARY} />
                            <Text style={styles.notesTitle}>Chapter Notes</Text>
                        </View>
                        <Text style={styles.notesBody}>
                            A quadratic equation is of the form ax² + bx + c = 0, where a ≠ 0.{'\n\n'}
                            <Text style={styles.notesHighlight}>Key Formulas:{'\n'}</Text>
                            • Discriminant: D = b² − 4ac{'\n'}
                            • Roots: x = (−b ± √D) / 2a{'\n\n'}
                            If D {'>'} 0 → two real roots{'\n'}
                            If D = 0 → one real root (equal){'\n'}
                            If D {'<'} 0 → no real roots
                        </Text>
                        <TouchableOpacity style={styles.downloadBtn}>
                            <Ionicons name="download-outline" size={16} color={PRIMARY} />
                            <Text style={styles.downloadText}>Download PDF</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },

    // ── Player Shell ──────────────────────────────────────────────
    playerShell: { backgroundColor: DARK },
    playerHeader: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12, gap: 12,
    },
    backBtn: {
        width: 36, height: 36, borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center', alignItems: 'center',
    },
    miniBtn: {
        width: 36, height: 36, borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center', alignItems: 'center',
    },
    playerChapter: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '500', marginBottom: 2 },
    playerVideoTitle: { fontSize: 14, color: '#FFF', fontWeight: '600' },
    playerBox: { width: '100%', backgroundColor: '#000' },
    loaderOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: DARK, zIndex: 1,
    },

    // ── Content ───────────────────────────────────────────────────
    content: { flex: 1 },

    // Title & actions
    titleRow: {
        flexDirection: 'row', alignItems: 'flex-start', gap: 12,
        paddingHorizontal: 20, paddingTop: 18, paddingBottom: 12,
    },
    videoTitle: { fontSize: 17, fontWeight: '700', color: DARK, lineHeight: 24, marginBottom: 8 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 11, color: GRAY, fontWeight: '500' },
    metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: BORDER },
    actionBtn: {
        width: 40, height: 40, borderRadius: 13,
        backgroundColor: '#F0F1F8',
        justifyContent: 'center', alignItems: 'center',
    },

    // Progress
    progressWrap: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        paddingHorizontal: 20, marginBottom: 18,
    },
    progressBg: { flex: 1, height: 5, backgroundColor: BORDER, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: PRIMARY, borderRadius: 3 },
    progressLabel: { fontSize: 11, color: PRIMARY, fontWeight: '700', width: 90, textAlign: 'right' },

    // Tabs
    tabRow: {
        flexDirection: 'row', marginHorizontal: 20,
        backgroundColor: '#ECEEF5', borderRadius: 12, padding: 4,
        marginBottom: 16,
    },
    tabBtn: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },
    tabBtnActive: { backgroundColor: CARD, ...Platform.select({ ios: { shadowColor: '#9096B2', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 }, android: { elevation: 2 } }) },
    tabTxt: { fontSize: 13, fontWeight: '600', color: GRAY },
    tabTxtActive: { color: DARK, fontWeight: '700' },

    // Next list
    listWrap: { paddingHorizontal: 20, gap: 10 },
    nextCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: CARD, borderRadius: 16, padding: 12, gap: 12,
    },
    nextThumb: {
        width: 68, height: 50, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center', gap: 2,
    },
    nextNum: { fontSize: 11, fontWeight: '800' },
    nextInfo: { flex: 1 },
    nextTitle: { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 4 },
    nextMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    nextMetaText: { fontSize: 11, color: GRAY, fontWeight: '500' },

    // Notes
    notesCard: {
        marginHorizontal: 20, backgroundColor: CARD,
        borderRadius: 18, padding: 18, gap: 14,
    },
    notesHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    notesTitle: { fontSize: 15, fontWeight: '700', color: DARK },
    notesBody: {
        fontSize: 13, color: GRAY, lineHeight: 22, fontWeight: '400',
    },
    notesHighlight: { fontWeight: '700', color: DARK },
    downloadBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: '#E6F9F1', borderRadius: 10,
        paddingHorizontal: 14, paddingVertical: 10, alignSelf: 'flex-start',
    },
    downloadText: { fontSize: 13, fontWeight: '700', color: PRIMARY },
});
