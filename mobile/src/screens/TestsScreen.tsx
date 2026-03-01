import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    Platform, Animated, StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// ─── Tokens ────────────────────────────────────────────────────────
const BG = '#F5F6FA';
const CARD = '#FFFFFF';
const PRIMARY = '#2DC87A';
const DARK = '#1C1C2E';
const GRAY = '#8A8FA8';
const BORDER = '#EBEBF0';
const CORRECT = '#2DC87A';
const WRONG = '#FF6B6B';
const VIOLET = '#7C6EF5';

const shadow = (c = '#B0B7D3', e = 3) => Platform.select({
    ios: { shadowColor: c, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.09, shadowRadius: 10 },
    android: { elevation: e },
}) as any;

const QUESTIONS = [
    {
        id: 1, subject: 'Mathematics', chapter: 'Chapter 2',
        question: 'If the sum of the zeroes of the quadratic polynomial f(x) = kx² + 2x + 3k is equal to their product, find the value of k.',
        options: ['-2/3', '2/3', '-1/3', '1/3'],
        correctIdx: 1,
    },
    {
        id: 2, subject: 'Physics', chapter: 'Chapter 3',
        question: 'A body is thrown vertically upward with velocity u. The ratio of time of ascent to the time of descent is:',
        options: ['1:1', '2:1', '1:2', '3:1'],
        correctIdx: 0,
    },
];

const PAST_EXAMS = [
    { id: 1, name: 'Basic Design', desc: 'Introduction to...', icon: 'color-palette', color: '#7C6EF5', bg: '#EEF0FE' },
    { id: 2, name: 'Typography', desc: 'Introduction to...', icon: 'text', color: '#2DC87A', bg: '#E8FAF2' },
    { id: 3, name: 'Colors', desc: 'Principles of a...', icon: 'eye', color: '#FF8C42', bg: '#FFF1E8' },
    { id: 4, name: 'Typography', desc: 'Introduction to...', icon: 'text', color: '#4A90E2', bg: '#EBF3FD' },
    { id: 5, name: 'Colors', desc: 'Principles of a...', icon: 'eye', color: '#FF6B6B', bg: '#FFF0F0' },
];

const TOTAL_SECONDS = 900; // 15 min

export default function TestsScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const [mode, setMode] = useState<'list' | 'quiz'>('list');
    const [qIdx, setQIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [seconds, setSeconds] = useState(TOTAL_SECONDS);

    useEffect(() => {
        if (mode !== 'quiz') return;
        const t = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000);
        return () => clearInterval(t);
    }, [mode]);

    const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    const q = QUESTIONS[qIdx % QUESTIONS.length];

    const checkAnswer = (idx: number) => {
        if (selectedOption !== null) return;
        setSelectedOption(idx);
    };

    const nextQ = () => {
        setSelectedOption(null);
        setQIdx(i => i + 1);
    };

    if (mode === 'quiz') {
        return (
            <View style={styles.root}>
                <StatusBar barStyle="dark-content" backgroundColor={BG} />

                {/* ── Quiz Header ── */}
                <View style={[styles.quizHeader, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => setMode('list')}>
                        <Ionicons name="close" size={22} color={DARK} />
                    </TouchableOpacity>

                    <View style={styles.timerWrap}>
                        <View style={styles.timerDot} />
                        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
                    </View>

                    <TouchableOpacity style={styles.submitBtn}>
                        <Text style={styles.submitBtnText}>Submit</Text>
                    </TouchableOpacity>
                </View>

                {/* ── Progress ── */}
                <View style={styles.progressArea}>
                    <View style={styles.progressBg}>
                        <View style={[styles.progressFill, { width: `${((qIdx + 1) / QUESTIONS.length) * 100}%` }]} />
                    </View>
                    <Text style={styles.qNum}>Question {qIdx + 1}/{QUESTIONS.length}</Text>
                </View>

                <ScrollView contentContainerStyle={styles.quizScroll} showsVerticalScrollIndicator={false}>
                    {/* Question card */}
                    <View style={[styles.questionCard, shadow()]}>
                        <View style={[styles.qTag, { backgroundColor: '#E8FAF2' }]}>
                            <Ionicons name="book-outline" size={12} color={PRIMARY} />
                            <Text style={[styles.qTagText, { color: PRIMARY }]}>{q.subject} • {q.chapter}</Text>
                        </View>
                        <Text style={styles.questionText}>{q.question}</Text>
                    </View>

                    {/* Options */}
                    <View style={styles.optionsList}>
                        {q.options.map((opt, idx) => {
                            const isSelected = selectedOption === idx;
                            const isCorrect = q.correctIdx === idx;
                            const showResult = selectedOption !== null;

                            let bg = CARD, border = BORDER, iconName: any = 'ellipse-outline', iconColor = GRAY;
                            if (showResult) {
                                if (isCorrect) { bg = '#E8FAF2'; border = CORRECT; iconName = 'checkmark-circle'; iconColor = CORRECT; }
                                else if (isSelected && !isCorrect) { bg = '#FFF0F0'; border = WRONG; iconName = 'close-circle'; iconColor = WRONG; }
                            } else if (isSelected) {
                                bg = '#EEF0FE'; border = VIOLET; iconName = 'radio-button-on'; iconColor = VIOLET;
                            }

                            return (
                                <TouchableOpacity
                                    key={opt}
                                    style={[styles.optionCard, { backgroundColor: bg, borderColor: border }]}
                                    onPress={() => checkAnswer(idx)}
                                    activeOpacity={0.82}
                                >
                                    <View style={styles.optionLetter}>
                                        <Text style={styles.optionLetterText}>{String.fromCharCode(65 + idx)}</Text>
                                    </View>
                                    <Text style={styles.optionText}>{opt}</Text>
                                    <Ionicons name={iconName} size={24} color={iconColor} />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={styles.quizFooter}>
                    <TouchableOpacity
                        style={[styles.nextBtn, !selectedOption && { opacity: 0.5 }]}
                        onPress={nextQ}
                        disabled={selectedOption === null}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.nextBtnText}>Next Question</Text>
                        <Ionicons name="arrow-forward" size={18} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // ── Past Exams List ──
    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor={BG} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
                <View>
                    <Text style={styles.headerSubtitle}>Your Progress</Text>
                    <Text style={styles.headerTitle}>Past Exams</Text>
                </View>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="search-outline" size={20} color={DARK} />
                </TouchableOpacity>
            </View>

            {/* Active Test Banner */}
            <TouchableOpacity
                style={[styles.activeBanner, shadow('#2DC87A', 3)]}
                onPress={() => { setMode('quiz'); setQIdx(0); setSelectedOption(null); setSeconds(TOTAL_SECONDS); }}
                activeOpacity={0.88}
            >
                <View style={styles.activeBannerLeft}>
                    <View style={[styles.activeBannerTag, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
                        <View style={styles.liveDot} />
                        <Text style={styles.activeBannerTagText}>Active Test</Text>
                    </View>
                    <Text style={styles.activeBannerTitle}>Midterm Test</Text>
                    <Text style={styles.activeBannerSub}>Mathematics · 10 Questions</Text>
                </View>
                <View style={styles.activeBannerRight}>
                    <Text style={styles.activeBannerTime}>15:00</Text>
                    <Text style={styles.activeBannerTimeSub}>Remaining</Text>
                    <View style={styles.startBtn}>
                        <Text style={styles.startBtnText}>Start →</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.listScroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Past Exams</Text>

                {PAST_EXAMS.map((exam, i) => (
                    <TouchableOpacity
                        key={exam.id}
                        style={[styles.examCard, shadow()]}
                        activeOpacity={0.86}
                        onPress={() => { setMode('quiz'); setQIdx(0); setSelectedOption(null); }}
                    >
                        <View style={[styles.examIcon, { backgroundColor: exam.bg }]}>
                            <Ionicons name={exam.icon as any} size={20} color={exam.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.examName}>{exam.name}</Text>
                            <Text style={styles.examDesc}>{exam.desc}</Text>
                        </View>
                        <TouchableOpacity style={[styles.examRetryBtn, { backgroundColor: exam.bg }]}>
                            <Ionicons name="refresh" size={14} color={exam.color} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}

                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },

    // List Mode Header
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
        paddingHorizontal: 20, paddingBottom: 16,
    },
    headerSubtitle: { fontSize: 13, color: PRIMARY, fontWeight: '600', marginBottom: 2 },
    headerTitle: { fontSize: 26, fontWeight: '700', color: DARK, letterSpacing: -0.4 },
    iconBtn: {
        width: 42, height: 42, borderRadius: 14, backgroundColor: CARD,
        justifyContent: 'center', alignItems: 'center',
        ...Platform.select({ ios: { shadowColor: '#B0B7D3', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 2 } }),
    },

    // Active Test Banner
    activeBanner: {
        marginHorizontal: 20, borderRadius: 22, backgroundColor: PRIMARY,
        padding: 18, flexDirection: 'row', marginBottom: 20, overflow: 'hidden',
    },
    activeBannerLeft: { flex: 1, gap: 5 },
    activeBannerTag: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50 },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF' },
    activeBannerTagText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
    activeBannerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
    activeBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
    activeBannerRight: { alignItems: 'center', gap: 4 },
    activeBannerTime: { fontSize: 22, fontWeight: '900', color: '#FFF' },
    activeBannerTimeSub: { fontSize: 10, color: 'rgba(255,255,255,0.75)', fontWeight: '600' },
    startBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50,
        paddingHorizontal: 12, paddingVertical: 5, marginTop: 4,
    },
    startBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },

    listScroll: { paddingHorizontal: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: DARK, marginBottom: 12 },
    examCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: CARD,
        borderRadius: 18, padding: 14, marginBottom: 10, gap: 12,
    },
    examIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    examName: { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 2 },
    examDesc: { fontSize: 12, color: GRAY, fontWeight: '400' },
    examRetryBtn: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },

    // ─── Quiz Mode ───────────────
    quizHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingBottom: 14, backgroundColor: BG,
    },
    timerWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    timerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: WRONG },
    timerText: { fontSize: 20, fontWeight: '800', color: DARK },
    submitBtn: {
        backgroundColor: CARD, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8,
        ...Platform.select({ ios: { shadowColor: '#B0B7D3', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 }, android: { elevation: 2 } }),
    },
    submitBtnText: { fontSize: 14, fontWeight: '700', color: PRIMARY },

    progressArea: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 12, marginBottom: 16 },
    progressBg: { flex: 1, height: 8, backgroundColor: BORDER, borderRadius: 4, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: PRIMARY, borderRadius: 4 },
    qNum: { fontSize: 13, fontWeight: '700', color: GRAY, width: 90, textAlign: 'right' },

    quizScroll: { paddingHorizontal: 20, paddingBottom: 140 },
    questionCard: { backgroundColor: CARD, borderRadius: 22, padding: 20, marginBottom: 20, gap: 12 },
    qTag: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50 },
    qTagText: { fontSize: 12, fontWeight: '700' },
    questionText: { fontSize: 17, fontWeight: '600', color: DARK, lineHeight: 26 },

    optionsList: { gap: 12 },
    optionCard: {
        flexDirection: 'row', alignItems: 'center', padding: 16,
        borderRadius: 18, borderWidth: 1.5, gap: 12,
    },
    optionLetter: { width: 36, height: 36, borderRadius: 12, backgroundColor: BG, justifyContent: 'center', alignItems: 'center' },
    optionLetterText: { fontSize: 14, fontWeight: '800', color: GRAY },
    optionText: { flex: 1, fontSize: 16, fontWeight: '600', color: DARK },

    quizFooter: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 36 : 24,
        paddingTop: 16, backgroundColor: CARD,
        borderTopWidth: 1, borderTopColor: '#EFEFF4',
    },
    nextBtn: {
        backgroundColor: PRIMARY, borderRadius: 18, height: 56,
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
        ...Platform.select({ ios: { shadowColor: '#2DC87A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16 }, android: { elevation: 6 } }),
    },
    nextBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
