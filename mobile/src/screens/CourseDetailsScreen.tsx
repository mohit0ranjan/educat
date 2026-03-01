import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getCourseById } from '../api/client';

export default function CourseDetailsScreen({ route, navigation }: any) {
    const { courseId } = route.params;
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            const data = await getCourseById(courseId);
            setCourse(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" style={styles.loader} />;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{course.attributes.title}</Text>
            <Text style={styles.instructor}>By {course.attributes.instructor}</Text>

            <View style={styles.moduleSection}>
                <Text style={styles.sectionTitle}>Curriculum</Text>
                {course.attributes.modules?.data.map((module: any) => (
                    <View key={module.id} style={styles.moduleCard}>
                        <Text style={styles.moduleTitle}>{module.attributes.title}</Text>
                        {module.attributes.lectures?.data.map((lecture: any) => (
                            <TouchableOpacity
                                key={lecture.id}
                                style={styles.lectureRow}
                                onPress={() => navigation.navigate('Lecture', { videoUrl: lecture.attributes.videoUrl, title: lecture.attributes.title })}
                            >
                                <Text style={styles.lectureTitle}>▶ {lecture.attributes.title}</Text>
                                <Text style={styles.duration}>{lecture.attributes.duration} min</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    loader: { flex: 1, justifyContent: 'center' },
    title: { fontSize: 26, fontWeight: 'bold' },
    instructor: { fontSize: 16, color: '#555', marginBottom: 20 },
    moduleSection: { marginTop: 10 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    moduleCard: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, marginBottom: 12 },
    moduleTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
    lectureRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#ddd' },
    lectureTitle: { fontSize: 14, color: '#333' },
    duration: { fontSize: 12, color: '#888' }
});
