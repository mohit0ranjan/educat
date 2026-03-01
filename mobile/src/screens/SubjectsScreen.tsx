import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BounceButton from '../components/BounceButton';
import SkeletonLoader from '../components/SkeletonLoader';

const { width } = Dimensions.get('window');
const CARD_W = (width - 52) / 2;

// ─── Tokens ────────────────────────────────────────────────────────
const BG = '#F5F6FA';
const CARD = '#FFFFFF';
const PRIMARY = '#2DC87A';
const DARK = '#1C1C2E';
const GRAY = '#8A8FA8';
const BORDER = '#EBEBF0';

const shadow = (c = '#B0B7D3', e = 3) => Platform.select({
    ios: { shadowColor: c, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.09, shadowRadius: 10 },
    android: { elevation: e },
}) as any;

const SUBJECTS = [
    {
        id: '1', name: 'Mathematics', desc: 'Algebra, Geometry, Trigonometry',
        icon: 'calculator', color: '#4A90E2', colorLight: '#EBF3FD',
        progress: 65, chapters: 14, students: 32,
    },
    {
        id: '2', name: 'Science', desc: 'Physics, Chemistry, Biology',
        icon: 'flask', color: '#2DC87A', colorLight: '#E8FAF2',
        progress: 42, chapters: 16, students: 28,
    },
    {
        id: '3', name: 'Physics', desc: 'Mechanics & Thermodynamics',
        icon: 'magnet', color: '#7C6EF5', colorLight: '#EEF0FE',
        progress: 80, chapters: 10, students: 24,
    },
    {
        id: '4', name: 'Chemistry', desc: 'Organic & Inorganic',
        icon: 'beaker', color: '#FF8C42', colorLight: '#FFF1E8',
        progress: 20, chapters: 12, students: 30,
    },
    {
        id: '5', name: 'English', desc: 'Grammar & Literature',
        icon: 'book', color: '#FF6B6B', colorLight: '#FFF0F0',
        progress: 50, chapters: 8, students: 35,
    },
    {
        id: '6', name: 'History', desc: 'World & Indian History',
        icon: 'globe', color: '#FFB830', colorLight: '#FFF8E7',
        progress: 35, chapters: 10, students: 29,
    },
];

export default function SubjectsScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 1400);
        return () => clearTimeout(t);
    }, []);

    const filtered = SUBJECTS.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={[styles.root]}>
            <StatusBar barStyle="dark-content" backgroundColor={BG} />

            {/* ── Header ── */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
                <View>
                    <Text style={styles.headerSubtitle}>Explore</Text>
                    <Text style={styles.headerTitle}>All Subjects</Text>
                </View>
                <BounceButton>
                    <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
                        <Ionicons name="options-outline" size={20} color={DARK} />
                    </TouchableOpacity>
                </BounceButton>
            </View>

            {/* ── Stats Row ── */}
            <View style={styles.statsRow}>
                {[
                    { label: 'Subjects', value: `${SUBJECTS.length}`, color: PRIMARY, bg: '#E8FAF2', icon: 'book-outline' },
                    { label: 'In Progress', value: '3', color: '#4A90E2', bg: '#EBF3FD', icon: 'time-outline' },
                    { label: 'Completed', value: '2', color: '#FF8C42', bg: '#FFF1E8', icon: 'checkmark-circle-outline' },
                ].map((s, i) => (
                    <View key={i} style={[styles.statCard, shadow()]}>
                        <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
                            <Ionicons name={s.icon as any} size={18} color={s.color} />
                        </View>
                        <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                        <Text style={styles.statLabel}>{s.label}</Text>
                    </View>
                ))}
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Grid of Subject Cards ── */}
                <View style={styles.grid}>
                    {loading
                        ? [1, 2, 3, 4].map(i => (
                            <SkeletonLoader key={i} width={CARD_W} height={180} borderRadius={20} style={{ marginBottom: 14 }} />
                        ))
                        : filtered.map((sub) => (
                            <BounceButton
                                key={sub.id}
                                activeScale={0.96}
                                onPress={() => navigation.navigate('CourseDetail')}
                                style={styles.cardWrap}
                            >
                                <View style={[styles.subjectCard, shadow()]}>
                                    {/* Color Header */}
                                    <View style={[styles.cardHeader, { backgroundColor: sub.colorLight }]}>
                                        <View style={[styles.iconBox, { backgroundColor: sub.color + '25' }]}>
                                            <Ionicons name={sub.icon as any} size={28} color={sub.color} />
                                        </View>
                                        <View style={[styles.progressCircle]}>
                                            <Text style={[styles.progressText, { color: sub.color }]}>{sub.progress}%</Text>
                                        </View>
                                    </View>
                                    {/* Info */}
                                    <View style={styles.cardBody}>
                                        <Text style={styles.subjectName}>{sub.name}</Text>
                                        <Text style={styles.subjectDesc} numberOfLines={1}>{sub.desc}</Text>
                                        {/* Progress Bar */}
                                        <View style={styles.progressBar}>
                                            <View style={[
                                                styles.progressFill,
                                                { width: `${sub.progress}%`, backgroundColor: sub.color }
                                            ]} />
                                        </View>
                                        <View style={styles.cardFooter}>
                                            <View style={styles.chipsRow}>
                                                <View style={[styles.chip, { backgroundColor: sub.colorLight }]}>
                                                    <Ionicons name="document-text-outline" size={11} color={sub.color} />
                                                    <Text style={[styles.chipText, { color: sub.color }]}>{sub.chapters} ch</Text>
                                                </View>
                                                <View style={[styles.chip, { backgroundColor: sub.colorLight }]}>
                                                    <Ionicons name="people-outline" size={11} color={sub.color} />
                                                    <Text style={[styles.chipText, { color: sub.color }]}>{sub.students}</Text>
                                                </View>
                                            </View>
                                            <Ionicons name="chevron-forward" size={16} color={GRAY} />
                                        </View>
                                    </View>
                                </View>
                            </BounceButton>
                        ))}
                </View>
                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },

    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
        paddingHorizontal: 20, paddingBottom: 16,
    },
    headerSubtitle: { fontSize: 13, color: PRIMARY, fontWeight: '600', marginBottom: 2 },
    headerTitle: { fontSize: 26, fontWeight: '700', color: DARK, letterSpacing: -0.5 },
    filterBtn: {
        width: 44, height: 44, borderRadius: 14, backgroundColor: CARD,
        justifyContent: 'center', alignItems: 'center',
        ...Platform.select({
            ios: { shadowColor: '#B0B7D3', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
            android: { elevation: 2 },
        }),
    },

    // Stats
    statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 18 },
    statCard: { flex: 1, backgroundColor: CARD, borderRadius: 16, padding: 12, alignItems: 'center', gap: 4 },
    statIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
    statValue: { fontSize: 18, fontWeight: '800' },
    statLabel: { fontSize: 10, color: GRAY, fontWeight: '600', textAlign: 'center' },

    scroll: { paddingHorizontal: 16 },

    // Grid
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
    cardWrap: { width: CARD_W },
    subjectCard: { width: '100%', backgroundColor: CARD, borderRadius: 20, overflow: 'hidden' },
    cardHeader: { height: 110, padding: 14, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-start' },
    iconBox: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    progressCircle: {
        backgroundColor: CARD, borderRadius: 50,
        paddingHorizontal: 8, paddingVertical: 4,
        ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 }, android: { elevation: 2 } }),
    },
    progressText: { fontSize: 11, fontWeight: '800' },
    cardBody: { padding: 14, gap: 4 },
    subjectName: { fontSize: 15, fontWeight: '700', color: DARK },
    subjectDesc: { fontSize: 11, color: GRAY, fontWeight: '500', marginBottom: 6 },
    progressBar: { height: 5, backgroundColor: BORDER, borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
    progressFill: { height: '100%', borderRadius: 3 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    chipsRow: { flexDirection: 'row', gap: 6 },
    chip: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 50 },
    chipText: { fontSize: 10, fontWeight: '700' },
});
