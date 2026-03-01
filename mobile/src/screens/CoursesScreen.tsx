import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function CoursesScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Learning</Text>
            </View>
            <View style={styles.emptyWrap}>
                <Ionicons name="school-outline" size={64} color="#E5E7EB" />
                <Text style={styles.emptyText}>You haven't enrolled in any courses yet. Explore the dashboard to get started!</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { padding: 24 },
    title: { fontSize: 24, fontWeight: '800', color: '#1C1F3A' },
    emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
    emptyText: { textAlign: 'center', marginTop: 16, fontSize: 16, color: '#9CA3AF', fontWeight: '500', lineHeight: 24 }
});
