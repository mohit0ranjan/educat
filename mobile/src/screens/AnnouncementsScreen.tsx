import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, Platform, RefreshControl, StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAnnouncements } from '../api/client';

// ─── Tokens ────────────────────────────────────────────────────────
const BG = '#F5F6FA';
const CARD = '#FFFFFF';
const PRIMARY = '#2DC87A';
const DARK = '#1C1C2E';
const GRAY = '#8A8FA8';
const BORDER = '#EBEBF0';
const VIOLET = '#7C6EF5';
const SECONDARY = '#FF8C42';
const CORAL = '#FF6B6B';
const BLUE = '#4A90E2';
const AMBER = '#FFB830';

const shadow = (c = '#B0B7D3', e = 2) => Platform.select({
    ios: { shadowColor: c, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
    android: { elevation: e },
}) as any;

const PALETTE = [
    { icon: 'megaphone', color: PRIMARY, bg: '#E8FAF2' },
    { icon: 'star', color: VIOLET, bg: '#EEF0FE' },
    { icon: 'flash', color: SECONDARY, bg: '#FFF1E8' },
    { icon: 'ribbon', color: BLUE, bg: '#EBF3FD' },
    { icon: 'notifications', color: CORAL, bg: '#FFF0F0' },
    { icon: 'bulb', color: AMBER, bg: '#FFF8E7' },
];

const FALLBACK = [
    { id: 1, title: 'Welcome to EduApp!', content: 'Classes start from Monday. Check your schedule for more details.', publishedAt: new Date().toISOString() },
    { id: 2, title: 'Holiday on 15th March', content: 'No classes on account of Holi. Enjoy the festival!', publishedAt: new Date().toISOString() },
    { id: 3, title: 'Mock Test Series Begins', content: 'The monthly mock test will start from next week. Prepare well!', publishedAt: new Date().toISOString() },
    { id: 4, title: 'Parent-Teacher Meeting', content: 'PTM scheduled for Saturday from 10 AM to 1 PM in school auditorium.', publishedAt: new Date().toISOString() },
];

export default function AnnouncementsScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await getAnnouncements();
            setData(Array.isArray(res) && res.length > 0 ? res : FALLBACK);
        } catch {
            setData(FALLBACK);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { load(); }, []);

    const formatDate = (s: string) => {
        if (!s) return '';
        return new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor={BG} />

            {/* ── Header ── */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={22} color={DARK} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Announcements</Text>
                    <Text style={styles.headerSub}>{data.length} notices</Text>
                </View>
                <TouchableOpacity style={styles.refreshBtn} onPress={() => load()}>
                    <Ionicons name="refresh-outline" size={20} color={DARK} />
                </TouchableOpacity>
            </View>

            {/* ── Featured Notice Banner ── */}
            {!loading && data.length > 0 && (
                <View style={[styles.featuredBanner, shadow('#2DC87A', 3)]}>
                    <View style={[styles.featuredIcon, { backgroundColor: '#E8FAF2' }]}>
                        <Ionicons name="megaphone" size={22} color={PRIMARY} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={styles.featuredBadge}>
                            <View style={styles.liveIndicator} />
                            <Text style={styles.featuredBadgeText}>Latest</Text>
                        </View>
                        <Text style={styles.featuredTitle} numberOfLines={1}>
                            {(data[0].attributes || data[0]).title}
                        </Text>
                        <Text style={styles.featuredDate}>
                            {formatDate((data[0].attributes || data[0]).publishedAt || (data[0].attributes || data[0]).createdAt)}
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={GRAY} />
                </View>
            )}

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={PRIMARY} />
                    <Text style={styles.loadTxt}>Fetching notices…</Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => { setRefreshing(true); load(true); }}
                            tintColor={PRIMARY}
                        />
                    }
                >
                    {data.map((item, idx) => {
                        const attr = item.attributes || item;
                        const pal = PALETTE[idx % PALETTE.length];
                        return (
                            <TouchableOpacity
                                key={item.id || idx}
                                style={[styles.card, shadow()]}
                                activeOpacity={0.88}
                            >
                                {/* Left color accent bar */}
                                <View style={[styles.cardAccent, { backgroundColor: pal.color }]} />

                                <View style={styles.cardContent}>
                                    {/* Icon + Date */}
                                    <View style={styles.cardTop}>
                                        <View style={[styles.iconBox, { backgroundColor: pal.bg }]}>
                                            <Ionicons name={pal.icon as any} size={18} color={pal.color} />
                                        </View>
                                        <View style={styles.cardTopRight}>
                                            <Text style={styles.dateText}>{formatDate(attr.publishedAt || attr.createdAt)}</Text>
                                            <View style={[styles.typeBadge, { backgroundColor: pal.bg }]}>
                                                <Text style={[styles.typeText, { color: pal.color }]}>Notice</Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Title + Body */}
                                    <Text style={styles.cardTitle}>{attr.title || 'Untitled'}</Text>
                                    <Text style={styles.cardBody} numberOfLines={2}>
                                        {attr.content || attr.description || attr.message || ''}
                                    </Text>

                                    {/* Footer */}
                                    <View style={styles.cardFooter}>
                                        <TouchableOpacity style={styles.readMoreBtn}>
                                            <Text style={[styles.readMoreText, { color: pal.color }]}>Read more</Text>
                                            <Ionicons name="arrow-forward" size={13} color={pal.color} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                    <View style={{ height: 100 }} />
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        paddingHorizontal: 18, paddingBottom: 16, backgroundColor: BG,
    },
    backBtn: {
        width: 42, height: 42, borderRadius: 14, backgroundColor: CARD,
        justifyContent: 'center', alignItems: 'center',
        ...Platform.select({ ios: { shadowColor: '#B0B7D3', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 2 } }),
    },
    headerCenter: { flex: 1 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: DARK, letterSpacing: -0.3 },
    headerSub: { fontSize: 12, color: GRAY, fontWeight: '500' },
    refreshBtn: {
        width: 42, height: 42, borderRadius: 14, backgroundColor: CARD,
        justifyContent: 'center', alignItems: 'center',
        ...Platform.select({ ios: { shadowColor: '#B0B7D3', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 2 } }),
    },

    // Featured Banner
    featuredBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: CARD, borderRadius: 20, marginHorizontal: 18,
        padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#E8FAF2',
    },
    featuredIcon: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    featuredBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
    liveIndicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: PRIMARY },
    featuredBadgeText: { fontSize: 11, fontWeight: '700', color: PRIMARY },
    featuredTitle: { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 2 },
    featuredDate: { fontSize: 11, color: GRAY, fontWeight: '500' },

    center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadTxt: { fontSize: 14, color: GRAY, fontWeight: '500' },

    list: { paddingHorizontal: 18, gap: 12 },

    // Cards
    card: {
        backgroundColor: CARD, borderRadius: 20, flexDirection: 'row',
        overflow: 'hidden',
    },
    cardAccent: { width: 4 },
    cardContent: { flex: 1, padding: 16, gap: 6 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    cardTopRight: { alignItems: 'flex-end', gap: 4 },
    iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    dateText: { fontSize: 11, color: GRAY, fontWeight: '600' },
    typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50 },
    typeText: { fontSize: 10, fontWeight: '700' },
    cardTitle: { fontSize: 15, fontWeight: '700', color: DARK },
    cardBody: { fontSize: 13, color: GRAY, fontWeight: '400', lineHeight: 19 },
    cardFooter: { flexDirection: 'row', justifyContent: 'flex-start' },
    readMoreBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    readMoreText: { fontSize: 13, fontWeight: '700' },
});
