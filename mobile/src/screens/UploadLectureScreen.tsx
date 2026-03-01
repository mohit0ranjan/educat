import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, Alert, Platform, KeyboardAvoidingView,
    ActivityIndicator, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../services/store';
import { getTeacherCourses, getModulesForCourse, createLecture } from '../api/client';

// ─── Tokens ────────────────────────────────────────────────────────
const BG = '#F6F7FB';
const CARD = '#FFFFFF';
const PRIMARY = '#2DC87A';
const DARK = '#1A1C2E';
const GRAY = '#9096B2';
const BORDER = '#ECEEF5';

const sd = Platform.select({
    ios: { shadowColor: '#9096B2', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.09, shadowRadius: 10 },
    android: { elevation: 3 },
}) as any;

export default function UploadLectureScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const { user } = useAuthStore();

    const [pageLoading, setPageLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [courses, setCourses] = useState<any[]>([]);
    const [modules, setModules] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [selectedModule, setSelectedModule] = useState<any>(null);
    const [modulesLoading, setModulesLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [notesUrl, setNotesUrl] = useState('');
    const [duration, setDuration] = useState('');

    useEffect(() => {
        (async () => {
            try {
                if (!user?.id) return;
                const res = await getTeacherCourses(user.id);
                setCourses(res.data || []);
            } catch (e) {
                console.error('Error fetching courses:', e);
            } finally {
                setPageLoading(false);
            }
        })();
    }, []);

    const handleCourseSelect = async (course: any) => {
        setSelectedCourse(course);
        setSelectedModule(null);
        setModules([]);
        setModulesLoading(true);
        try {
            const res = await getModulesForCourse(course.id);
            setModules(res.data || []);
        } catch {
            Alert.alert('Error', 'Could not load chapters for this subject.');
        } finally {
            setModulesLoading(false);
        }
    };

    const handleUpload = async () => {
        if (!title.trim()) { Alert.alert('Missing Title', 'Please enter the lecture title.'); return; }
        if (!videoUrl.trim()) { Alert.alert('Missing Video', 'Please paste the YouTube video URL.'); return; }
        if (!selectedCourse) { Alert.alert('Missing Subject', 'Please select a subject/course.'); return; }

        setSubmitting(true);
        try {
            await createLecture({
                title: title.trim(),
                videoUrl: videoUrl.trim(),
                notesUrl: notesUrl.trim(),
                duration: duration ? parseInt(duration) : undefined,
                course: selectedCourse.id,    // ← direct subject link (NEW)
                module: selectedModule?.id,   // ← chapter (optional)
                teacher: user?.id,
            });
            Alert.alert('✅ Published!', `"${title}" is now visible to students under ${selectedCourse.attributes?.title}.`, [
                { text: 'Done', onPress: () => navigation.goBack() },
            ]);
        } catch (err) {
            Alert.alert('Upload Failed', 'Could not publish lecture. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const courseTitle = selectedCourse?.attributes?.title;

    return (
        <View style={[styles.root, { paddingTop: Math.max(insets.top, 0) }]}>
            <StatusBar barStyle="dark-content" backgroundColor={BG} />

            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={22} color={DARK} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Upload Lecture</Text>
                    {courseTitle && (
                        <Text style={styles.headerSub}>→ {courseTitle}</Text>
                    )}
                </View>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {pageLoading ? (
                        <ActivityIndicator size="large" color={PRIMARY} style={{ marginTop: 60 }} />
                    ) : (
                        <View style={styles.form}>

                            {/* ─── STEP 1: Subject / Course ─── */}
                            <View style={styles.stepCard}>
                                <View style={styles.stepHeader}>
                                    <View style={styles.stepBadge}><Text style={styles.stepNum}>1</Text></View>
                                    <Text style={styles.stepTitle}>Select Subject</Text>
                                </View>

                                {courses.length === 0 ? (
                                    <View style={styles.emptyBox}>
                                        <Ionicons name="book-outline" size={28} color={GRAY} />
                                        <Text style={styles.emptyText}>No subjects assigned to you yet.{'\n'}Contact admin to get assigned.</Text>
                                    </View>
                                ) : (
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                                        {courses.map((course) => {
                                            const active = selectedCourse?.id === course.id;
                                            return (
                                                <TouchableOpacity
                                                    key={course.id}
                                                    onPress={() => handleCourseSelect(course)}
                                                    style={[styles.chip, active && styles.chipActive]}
                                                    activeOpacity={0.8}
                                                >
                                                    <Ionicons
                                                        name="book-outline"
                                                        size={14}
                                                        color={active ? '#FFF' : GRAY}
                                                    />
                                                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                                                        {course.attributes?.title}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </ScrollView>
                                )}
                            </View>

                            {/* ─── STEP 2: Chapter / Module (optional) ─── */}
                            {selectedCourse && (
                                <View style={styles.stepCard}>
                                    <View style={styles.stepHeader}>
                                        <View style={styles.stepBadge}><Text style={styles.stepNum}>2</Text></View>
                                        <Text style={styles.stepTitle}>Select Chapter <Text style={styles.optional}>(optional)</Text></Text>
                                    </View>

                                    {modulesLoading ? (
                                        <ActivityIndicator size="small" color={PRIMARY} style={{ marginTop: 8 }} />
                                    ) : modules.length === 0 ? (
                                        <Text style={styles.noModText}>No chapters found for this subject.</Text>
                                    ) : (
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                                            {modules.map((mod) => {
                                                const active = selectedModule?.id === mod.id;
                                                return (
                                                    <TouchableOpacity
                                                        key={mod.id}
                                                        onPress={() => setSelectedModule(active ? null : mod)}
                                                        style={[styles.chip, styles.chipOutline, active && styles.chipActive]}
                                                        activeOpacity={0.8}
                                                    >
                                                        <Text style={[styles.chipText, active && styles.chipTextActive]}>
                                                            {mod.attributes?.title || mod.attributes?.name}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </ScrollView>
                                    )}
                                </View>
                            )}

                            {/* ─── STEP 3: Lecture Details ─── */}
                            <View style={styles.stepCard}>
                                <View style={styles.stepHeader}>
                                    <View style={styles.stepBadge}>
                                        <Text style={styles.stepNum}>{selectedCourse ? '3' : '2'}</Text>
                                    </View>
                                    <Text style={styles.stepTitle}>Lecture Details</Text>
                                </View>

                                {/* Title */}
                                <View style={styles.fieldWrap}>
                                    <Text style={styles.fieldLabel}>Title *</Text>
                                    <View style={styles.inputRow}>
                                        <Ionicons name="create-outline" size={17} color={GRAY} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="e.g. Introduction to Thermodynamics"
                                            placeholderTextColor={GRAY}
                                            value={title}
                                            onChangeText={setTitle}
                                        />
                                    </View>
                                </View>

                                {/* Video URL */}
                                <View style={styles.fieldWrap}>
                                    <Text style={styles.fieldLabel}>YouTube Video URL *</Text>
                                    <View style={styles.inputRow}>
                                        <Ionicons name="logo-youtube" size={17} color="#FF0000" />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="https://youtube.com/watch?v=..."
                                            placeholderTextColor={GRAY}
                                            value={videoUrl}
                                            onChangeText={setVideoUrl}
                                            autoCapitalize="none"
                                            keyboardType="url"
                                        />
                                    </View>
                                </View>

                                {/* Duration + Notes side by side */}
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <View style={[styles.fieldWrap, { flex: 1 }]}>
                                        <Text style={styles.fieldLabel}>Duration (min)</Text>
                                        <View style={styles.inputRow}>
                                            <Ionicons name="time-outline" size={17} color={GRAY} />
                                            <TextInput
                                                style={styles.input}
                                                placeholder="45"
                                                placeholderTextColor={GRAY}
                                                value={duration}
                                                onChangeText={setDuration}
                                                keyboardType="number-pad"
                                            />
                                        </View>
                                    </View>
                                </View>

                                {/* Notes URL */}
                                <View style={styles.fieldWrap}>
                                    <Text style={styles.fieldLabel}>Notes PDF URL <Text style={styles.optional}>(optional)</Text></Text>
                                    <View style={styles.inputRow}>
                                        <Ionicons name="document-text-outline" size={17} color={GRAY} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Google Drive or PDF link..."
                                            placeholderTextColor={GRAY}
                                            value={notesUrl}
                                            onChangeText={setNotesUrl}
                                            autoCapitalize="none"
                                            keyboardType="url"
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* ─── Summary strip ─── */}
                            {selectedCourse && title && (
                                <View style={styles.summaryCard}>
                                    <Ionicons name="checkmark-circle" size={20} color={PRIMARY} />
                                    <Text style={styles.summaryText} numberOfLines={2}>
                                        <Text style={{ fontWeight: '700', color: DARK }}>{title}</Text>
                                        {' '}will be added to{' '}
                                        <Text style={{ fontWeight: '700', color: PRIMARY }}>{courseTitle}</Text>
                                        {selectedModule ? `, Chapter: ${selectedModule.attributes?.title || selectedModule.attributes?.name}` : ''}
                                    </Text>
                                </View>
                            )}

                            {/* ─── Submit ─── */}
                            <TouchableOpacity
                                style={[styles.submitBtn, (!title || !videoUrl || !selectedCourse) && { opacity: 0.5 }]}
                                onPress={handleUpload}
                                disabled={submitting || !title || !videoUrl || !selectedCourse}
                                activeOpacity={0.88}
                            >
                                {submitting
                                    ? <ActivityIndicator color="#FFF" />
                                    : <>
                                        <Ionicons name="cloud-upload-outline" size={20} color="#FFF" />
                                        <Text style={styles.submitText}>Publish to Students</Text>
                                    </>
                                }
                            </TouchableOpacity>

                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        paddingHorizontal: 20, paddingBottom: 14, paddingTop: 14,
        backgroundColor: BG,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 13, backgroundColor: CARD,
        justifyContent: 'center', alignItems: 'center', ...sd,
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: DARK },
    headerSub: { fontSize: 12, color: PRIMARY, fontWeight: '600', marginTop: 1 },

    scroll: { paddingHorizontal: 20, paddingBottom: 60 },
    form: { gap: 16 },

    // Step card
    stepCard: {
        backgroundColor: CARD, borderRadius: 20, padding: 18, gap: 14, ...sd,
    },
    stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    stepBadge: {
        width: 26, height: 26, borderRadius: 8,
        backgroundColor: '#E6F9F1', justifyContent: 'center', alignItems: 'center',
    },
    stepNum: { fontSize: 13, fontWeight: '800', color: PRIMARY },
    stepTitle: { fontSize: 15, fontWeight: '700', color: DARK },
    optional: { fontSize: 12, fontWeight: '400', color: GRAY },

    // Chips
    chipRow: { gap: 8, paddingVertical: 2 },
    chip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#F0F2F8', borderRadius: 50,
        paddingHorizontal: 14, paddingVertical: 9,
    },
    chipOutline: { backgroundColor: BG, borderWidth: 1, borderColor: BORDER },
    chipActive: { backgroundColor: PRIMARY },
    chipText: { fontSize: 13, fontWeight: '600', color: GRAY },
    chipTextActive: { color: '#FFF' },

    emptyBox: { alignItems: 'center', gap: 8, paddingVertical: 12 },
    emptyText: { fontSize: 13, color: GRAY, textAlign: 'center', lineHeight: 20 },
    noModText: { fontSize: 13, color: GRAY, fontStyle: 'italic' },

    // Fields
    fieldWrap: { gap: 7 },
    fieldLabel: { fontSize: 12, fontWeight: '600', color: DARK },
    inputRow: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: '#F0F2F8', borderRadius: 13,
        height: 50, paddingHorizontal: 14,
        borderWidth: 1.5, borderColor: 'transparent',
    },
    input: { flex: 1, fontSize: 14, color: DARK, fontWeight: '500' },

    // Summary
    summaryCard: {
        flexDirection: 'row', alignItems: 'flex-start', gap: 10,
        backgroundColor: '#E6F9F1', borderRadius: 14, padding: 14,
    },
    summaryText: { flex: 1, fontSize: 13, color: DARK, lineHeight: 19 },

    // Submit
    submitBtn: {
        backgroundColor: PRIMARY, borderRadius: 16, height: 54,
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
        marginTop: 4,
        ...Platform.select({
            ios: { shadowColor: PRIMARY, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12 },
            android: { elevation: 5 },
        }),
    },
    submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
