import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getStudents } from '../api/client';

const DARK_TXT = '#1E293B';
const GRAY_TXT = '#64748B';
const PRIMARY = '#4F46E5';

export default function StudentListScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const [search, setSearch] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getStudents();
            setStudents(data || []);
        } catch (error) {
            console.error("Fetch Students Error:", error);
            Alert.alert("Error", "Could not fetch student list.");
        } finally {
            setLoading(false);
        }
    };

    const filtered = students.filter(s =>
        (s.username || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.class || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <LinearGradient colors={['#F8FAFC', '#FFFFFF']} style={styles.container}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={DARK_TXT} />
                </TouchableOpacity>
                <Text style={styles.title}>My Students</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color={GRAY_TXT} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search student name or class..."
                        placeholderTextColor={GRAY_TXT}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.countText}>{filtered.length} Students Enrolled</Text>

                {loading ? (
                    <ActivityIndicator size="large" color={PRIMARY} style={{ marginTop: 40 }} />
                ) : (
                    filtered.map((student) => (
                        <TouchableOpacity key={student.id} style={styles.studentCard} activeOpacity={0.8}>
                            <View style={styles.avatarBox}>
                                <LinearGradient colors={['#EEF2FF', '#E0E7FF']} style={styles.avatarGradient}>
                                    <Text style={styles.avatarText}>{(student.username || 'S').charAt(0).toUpperCase()}</Text>
                                </LinearGradient>
                            </View>
                            <View style={styles.studentInfo}>
                                <Text style={styles.studentName}>{student.username}</Text>
                                <View style={styles.metaRow}>
                                    <Text style={styles.metaText}>{student.class || 'No Class'}</Text>
                                    <View style={styles.dot} />
                                    <Text style={styles.metaText}>{student.city || 'Location N/A'}</Text>
                                </View>
                            </View>
                            <View style={styles.attendanceBox}>
                                <Text style={styles.attendanceVal}>Live</Text>
                                <Text style={styles.attendanceLabel}>Status</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}

                {!loading && filtered.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="people-outline" size={60} color="#E2E8F0" />
                        <Text style={styles.emptyText}>No students found in the database.</Text>
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 20 },
    backBtn: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
    title: { fontSize: 24, fontWeight: '800', color: DARK_TXT, marginLeft: 16 },

    searchContainer: { paddingHorizontal: 24, marginBottom: 20 },
    searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', height: 56, borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: '#F1F5F9' },
    searchInput: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '600', color: DARK_TXT },

    scroll: { paddingHorizontal: 24 },
    countText: { fontSize: 12, fontWeight: '800', color: GRAY_TXT, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 },

    studentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 12, elevation: 1 },
    avatarBox: { width: 50, height: 50, borderRadius: 14, overflow: 'hidden' },
    avatarGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    avatarText: { fontSize: 20, fontWeight: '800', color: PRIMARY },
    studentInfo: { flex: 1, marginLeft: 16 },
    studentName: { fontSize: 17, fontWeight: '800', color: DARK_TXT, marginBottom: 2 },
    metaRow: { flexDirection: 'row', alignItems: 'center' },
    metaText: { fontSize: 13, color: GRAY_TXT, fontWeight: '600' },
    dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', marginHorizontal: 8 },
    attendanceBox: { alignItems: 'center', backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
    attendanceVal: { fontSize: 13, fontWeight: '800', color: '#16a34a' },
    attendanceLabel: { fontSize: 9, fontWeight: '700', color: '#16a34a', textTransform: 'uppercase' },

    emptyState: { alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 16, fontSize: 16, color: GRAY_TXT, fontWeight: '600' }
});
