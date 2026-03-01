import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ─── Design Tokens ─────────────────────────────────────────────────
const BG = '#F5F6FA';
const CARD = '#FFFFFF';
const PRIMARY = '#2DC87A';
const DARK = '#1C1C2E';
const GRAY = '#8A8FA8';
const BORDER = '#EBEBF0';
const VIOLET = '#7C6EF5';
const SECONDARY = '#FF8C42';
const BLUE = '#4A90E2';
const CORAL = '#FF6B6B';
const AMBER = '#FFB830';

const shadow = (c = '#B0B7D3', elev = 3) => Platform.select({
    ios: { shadowColor: c, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.09, shadowRadius: 10 },
    android: { elevation: elev },
}) as any;

const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAYS_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Time slots for the schedule
const TIME_SLOTS = [
    { hour: '08:00', classes: [{ id: 1, subject: 'Basic UI Design', start: 0, span: 1.2, color: PRIMARY, colorBg: '#E8FAF2' }] },
    { hour: '09:00', classes: [{ id: 2, subject: 'Basic 3D Objects', start: 0, span: 1.0, color: GRAY, colorBg: '#F2F2F7' }] },
    { hour: '10:00', classes: [{ id: 3, subject: 'UI/UX Design', start: 0, span: 1.0, color: VIOLET, colorBg: '#EEF0FE' }] },
    { hour: '11:00', classes: [{ id: 4, subject: 'UI/UX Design', start: 0, span: 1.0, color: SECONDARY, colorBg: '#FFF1E8' }] },
    { hour: '12:00', classes: [{ id: 5, subject: 'Basic UI Design', start: 0, span: 0.8, color: PRIMARY, colorBg: '#E8FAF2' }] },
];

const TODAY_CLASSES = [
    {
        id: 1, subject: 'History of Physics', teacher: 'Aalvina Fatehi',
        role: 'Professor', date: '30 May', time: '12 Pm - 03 Am',
        members: 5, color: BLUE, colorBg: '#EBF3FD',
        featured: true,
    },
    {
        id: 2, subject: 'Geometry', teacher: '', role: '',
        date: '30 May', time: '12 Pm - 03 Am',
        members: 5, color: PRIMARY, colorBg: '#E8FAF2',
        featured: false,
    },
    {
        id: 3, subject: 'History', teacher: '', role: '',
        date: '30 May', time: '12 Pm - 03 Am',
        members: 5, color: VIOLET, colorBg: '#EEF0FE',
        featured: false, highlighted: true,
    },
    {
        id: 4, subject: 'Physics', teacher: '', role: '',
        date: '30 May', time: '12 Pm - 03 Am',
        members: 5, color: CORAL, colorBg: '#FFF0F0',
        featured: false,
    },
    {
        id: 5, subject: 'Graphics', teacher: '', role: '',
        date: '30 May', time: '12 Pm - 03 Am',
        members: 5, color: SECONDARY, colorBg: '#FFF1E8',
        featured: false,
    },
    {
        id: 6, subject: 'Physics', teacher: '', role: '',
        date: '30 May', time: '12 Pm - 03 Am',
        members: 5, color: VIOLET, colorBg: '#EEF0FE',
        featured: false,
    },
];

export default function ScheduleScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const today = new Date();
    const todayIdx = today.getDay();

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - todayIdx + i);
        return {
            short: DAYS_FULL[d.getDay()],
            letter: DAYS_SHORT[d.getDay()],
            date: d.getDate(),
            month: MONTHS[d.getMonth()],
            isToday: d.toDateString() === today.toDateString(),
        };
    });

    const [selDay, setSelDay] = useState(todayIdx);
    const [view, setView] = useState<'timeline' | 'list'>('timeline');

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor={BG} />

            {/* ── Header ── */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
                <View>
                    <Text style={styles.headerTitle}>Today's Classes</Text>
                    <Text style={styles.headerDate}>
                        {today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </Text>
                </View>
                <TouchableOpacity style={styles.searchBtn}>
                    <Ionicons name="search-outline" size={20} color={DARK} />
                </TouchableOpacity>
            </View>

            {/* ── View Toggle ── */}
            <View style={styles.toggleRow}>
                <TouchableOpacity
                    style={[styles.toggleBtn, view === 'timeline' && styles.toggleBtnActive]}
                    onPress={() => setView('timeline')}
                >
                    <Ionicons name="time-outline" size={15} color={view === 'timeline' ? '#FFF' : GRAY} />
                    <Text style={[styles.toggleTxt, view === 'timeline' && styles.toggleTxtActive]}>Timeline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleBtn, view === 'list' && styles.toggleBtnActive]}
                    onPress={() => setView('list')}
                >
                    <Ionicons name="list-outline" size={15} color={view === 'list' ? '#FFF' : GRAY} />
                    <Text style={[styles.toggleTxt, view === 'list' && styles.toggleTxtActive]}>Class List</Text>
                </TouchableOpacity>
            </View>

            {/* ── Week Strip ── */}
            <View style={styles.weekStrip}>
                {weekDays.map((d, i) => (
                    <TouchableOpacity
                        key={i}
                        style={styles.weekDay}
                        onPress={() => setSelDay(i)}
                        activeOpacity={0.75}
                    >
                        <Text style={[styles.weekDayLabel, selDay === i && styles.weekDayLabelActive]}>
                            {d.short.slice(0, 3)}
                        </Text>
                        <View style={[styles.weekDayCircle, selDay === i && styles.weekDayCircleActive]}>
                            <Text style={[styles.weekDayNum, selDay === i && styles.weekDayNumActive]}>{d.date}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                contentContainerStyle={view === 'timeline' ? styles.timelineScroll : styles.listScroll}
                showsVerticalScrollIndicator={false}
            >
                {view === 'timeline' ? (
                    /* ── Timeline View ── */
                    <View style={[styles.timelineCard, shadow()]}>
                        {TIME_SLOTS.map((slot, i) => (
                            <View key={i} style={styles.timeRow}>
                                <Text style={styles.timeLabel}>{slot.hour}</Text>
                                <View style={styles.timeBlocks}>
                                    {slot.classes.map((cls) => (
                                        <TouchableOpacity
                                            key={cls.id}
                                            style={[
                                                styles.timeBlock,
                                                {
                                                    backgroundColor: cls.colorBg,
                                                    width: (width - 110) * 0.7,
                                                }
                                            ]}
                                            activeOpacity={0.8}
                                            onPress={() => { }}
                                        >
                                            <View style={[styles.timeBlockAccent, { backgroundColor: cls.color }]} />
                                            <Text style={[styles.timeBlockText, { color: cls.color }]} numberOfLines={1}>
                                                {cls.subject}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    /* ── List View (Today's Classes Detail) ── */
                    <>
                        {TODAY_CLASSES.map((cls, i) => (
                            <TouchableOpacity
                                key={cls.id}
                                style={[
                                    styles.classCard,
                                    cls.highlighted && styles.classCardHighlighted,
                                    shadow('#B0B7D3', 2),
                                ]}
                                activeOpacity={0.86}
                            >
                                <View style={styles.classCardLeft}>
                                    <View style={[styles.classColorDot, { backgroundColor: cls.colorBg }]}>
                                        <View style={[styles.classColorDotInner, { backgroundColor: cls.color }]} />
                                    </View>
                                    <View style={styles.classTimeBlock}>
                                        {i === 2 && <Text style={[styles.classTimeLabel, { color: VIOLET }]}>09:00 Pm</Text>}
                                        {i === 4 && <Text style={[styles.classTimeLabel, { color: SECONDARY }]}>05:00 Pm</Text>}
                                    </View>
                                </View>
                                <View style={[styles.classCardBody, cls.highlighted && styles.classCardBodyHighlighted]}>
                                    <Text style={[styles.className, cls.highlighted && { color: '#FFF' }]}>{cls.subject}</Text>
                                    <View style={styles.classMeta}>
                                        <Ionicons name="calendar-outline" size={12} color={cls.highlighted ? 'rgba(255,255,255,0.7)' : GRAY} />
                                        <Text style={[styles.classMetaText, cls.highlighted && { color: 'rgba(255,255,255,0.85)' }]}>
                                            {cls.date}
                                        </Text>
                                        <Ionicons name="time-outline" size={12} color={cls.highlighted ? 'rgba(255,255,255,0.7)' : GRAY} />
                                        <Text style={[styles.classMetaText, cls.highlighted && { color: 'rgba(255,255,255,0.85)' }]}>
                                            {cls.time}
                                        </Text>
                                    </View>
                                    <View style={styles.classMembersRow}>
                                        {[0, 1, 2].map((m) => (
                                            <View
                                                key={m}
                                                style={[
                                                    styles.memberAvatar,
                                                    { backgroundColor: [PRIMARY, SECONDARY, VIOLET][m], marginLeft: m > 0 ? -8 : 0 }
                                                ]}
                                            >
                                                <Ionicons name="person" size={9} color="#FFF" />
                                            </View>
                                        ))}
                                        <Text style={[styles.memberCount, cls.highlighted && { color: 'rgba(255,255,255,0.85)' }]}>
                                            +{cls.members} Members
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </>
                )}

                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },

    // Header
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
        paddingHorizontal: 20, paddingBottom: 14, backgroundColor: BG,
    },
    headerTitle: { fontSize: 22, fontWeight: '700', color: DARK, marginBottom: 2, letterSpacing: -0.3 },
    headerDate: { fontSize: 13, color: GRAY, fontWeight: '500' },
    searchBtn: {
        width: 42, height: 42, borderRadius: 14, backgroundColor: CARD,
        justifyContent: 'center', alignItems: 'center',
        ...Platform.select({
            ios: { shadowColor: '#B0B7D3', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
            android: { elevation: 2 },
        }),
    },

    // Toggle
    toggleRow: {
        flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 14,
    },
    toggleBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50,
        backgroundColor: CARD, borderWidth: 1, borderColor: BORDER,
    },
    toggleBtnActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
    toggleTxt: { fontSize: 13, fontWeight: '600', color: GRAY },
    toggleTxtActive: { color: '#FFF' },

    // Week Strip
    weekStrip: {
        flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16,
        justifyContent: 'space-between',
    },
    weekDay: { alignItems: 'center', gap: 6, flex: 1 },
    weekDayLabel: { fontSize: 11, fontWeight: '600', color: GRAY, textTransform: 'uppercase' },
    weekDayLabelActive: { color: PRIMARY },
    weekDayCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    weekDayCircleActive: { backgroundColor: PRIMARY },
    weekDayNum: { fontSize: 13, fontWeight: '700', color: DARK },
    weekDayNumActive: { color: '#FFF' },

    // Timeline
    timelineScroll: { paddingHorizontal: 20, paddingTop: 4 },
    timelineCard: {
        backgroundColor: CARD, borderRadius: 20, padding: 16, gap: 16,
    },
    timeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    timeLabel: { fontSize: 12, fontWeight: '600', color: GRAY, width: 44 },
    timeBlocks: { flex: 1, flexDirection: 'row', gap: 6 },
    timeBlock: {
        height: 38, borderRadius: 10, flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 10, gap: 7,
    },
    timeBlockAccent: { width: 3, height: 20, borderRadius: 2 },
    timeBlockText: { fontSize: 12, fontWeight: '700' },

    // List
    listScroll: { paddingHorizontal: 20, paddingTop: 4, gap: 0 },
    classCard: {
        flexDirection: 'row', backgroundColor: CARD, borderRadius: 18,
        marginBottom: 12, overflow: 'hidden',
    },
    classCardHighlighted: { backgroundColor: VIOLET },
    classCardLeft: { width: 56, alignItems: 'center', paddingVertical: 16 },
    classColorDot: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    classColorDotInner: { width: 10, height: 10, borderRadius: 5 },
    classTimeBlock: { marginTop: 4 },
    classTimeLabel: { fontSize: 10, fontWeight: '700', textAlign: 'center' },
    classCardBody: { flex: 1, padding: 14, borderRadius: 16, gap: 6 },
    classCardBodyHighlighted: { backgroundColor: VIOLET },
    className: { fontSize: 15, fontWeight: '700', color: DARK },
    classMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    classMetaText: { fontSize: 11, color: GRAY, fontWeight: '500' },
    classMembersRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    memberAvatar: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#FFF' },
    memberCount: { fontSize: 11, color: GRAY, fontWeight: '600', marginLeft: 6 },
});
