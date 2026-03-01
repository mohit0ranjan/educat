import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BounceButton from '../components/BounceButton';
import { useAuthStore } from '../services/store';
import { getTeacherCourses, createLiveClass } from '../api/client';

const DARK_TXT = '#1E293B';
const GRAY_TXT = '#64748B';
const PRIMARY = '#4F46E5';

export default function ScheduleClassScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const { user } = useAuthStore();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);

    const [title, setTitle] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [meetingLink, setMeetingLink] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                if (!user?.id) return;
                const res = await getTeacherCourses(user.id);
                setCourses(res.data || []);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleSchedule = async () => {
        if (!title || !dateTime || !meetingLink || !selectedCourse) {
            Alert.alert("Missing Fields", "Please select a class and fill in all fields.");
            return;
        }

        setSubmitting(true);
        try {
            await createLiveClass({
                title,
                meetingLink,
                scheduledAt: new Date().toISOString(), // In real app, use a DateTime picker
                course: selectedCourse.id,
                teacher: user?.id
            });
            Alert.alert("Success", "Live class scheduled and synced!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Scheduling failed. Please check your connection.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <LinearGradient colors={['#EEF2FF', '#FFFFFF']} style={styles.container}>
                <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color={DARK_TXT} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Schedule Live Class</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    {loading ? (
                        <ActivityIndicator size="large" color={PRIMARY} style={{ marginTop: 40 }} />
                    ) : (
                        <View style={styles.form}>
                            <Text style={styles.label}>Select Assigned Class</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
                                {courses.map((course) => (
                                    <TouchableOpacity
                                        key={course.id}
                                        onPress={() => setSelectedCourse(course)}
                                        style={[styles.pill, selectedCourse?.id === course.id && styles.pillActive]}
                                    >
                                        <Text style={[styles.pillText, selectedCourse?.id === course.id && styles.pillTextActive]}>
                                            {course.attributes.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <Text style={styles.label}>Topic / Title</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Organic Chemistry Live Session"
                                value={title}
                                onChangeText={setTitle}
                            />

                            <Text style={styles.label}>Date & Duration</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 20th Oct, 5:00 PM (1 Hour)"
                                value={dateTime}
                                onChangeText={setDateTime}
                            />

                            <Text style={styles.label}>Meeting Link</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Zoom or Google Meet link..."
                                value={meetingLink}
                                onChangeText={setMeetingLink}
                                autoCapitalize="none"
                            />

                            <BounceButton style={styles.submitBtnWrapper} onPress={handleSchedule} disabled={submitting}>
                                <LinearGradient colors={['#10B981', '#059669']} style={styles.submitBtn}>
                                    {submitting ? (
                                        <ActivityIndicator color="#FFF" />
                                    ) : (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.submitText}>Confirm Schedule</Text>
                                            <Ionicons name="checkmark-circle" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                                        </View>
                                    )}
                                </LinearGradient>
                            </BounceButton>
                        </View>
                    )}
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 28, paddingBottom: 20 },
    backBtn: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
    title: { fontSize: 24, fontWeight: '800', color: DARK_TXT, marginLeft: 16 },
    scroll: { paddingHorizontal: 28, paddingTop: 20 },
    form: { gap: 24 },
    label: { fontSize: 13, fontWeight: '800', color: GRAY_TXT, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: { backgroundColor: '#FFF', borderRadius: 16, height: 56, paddingHorizontal: 16, fontSize: 16, fontWeight: '600', color: DARK_TXT, borderWidth: 1, borderColor: '#F1F5F9' },
    pillRow: { flexDirection: 'row' },
    pill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F1F5F9', marginRight: 8, height: 44 },
    pillActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
    pillText: { fontSize: 14, fontWeight: '700', color: GRAY_TXT },
    pillTextActive: { color: '#FFF' },
    submitBtnWrapper: { marginTop: 20, marginBottom: 40 },
    submitBtn: { height: 60, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    submitText: { color: '#FFF', fontSize: 18, fontWeight: '700' }
});
