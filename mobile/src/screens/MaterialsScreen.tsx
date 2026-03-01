import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function MaterialsScreen() {
    const materials = [
        { title: 'Chapter 1: Reflection Notes', subject: 'Physics', type: 'PDF', size: '2.4 MB' },
        { title: 'Organic Chemistry Reactions', subject: 'Chemistry', type: 'PDF', size: '5.1 MB' },
        { title: 'Calculus Formulas Sheet', subject: 'Maths', type: 'PDF', size: '1.2 MB' },
        { title: 'Biology Diagram Booklet', subject: 'Biology', type: 'PDF', size: '8.4 MB' }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Study Materials</Text>
            </View>
            <FlatList
                data={materials}
                contentContainerStyle={styles.list}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.iconBox}>
                            <Ionicons name="document-text" size={28} color={theme.colors.secondary} />
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.cardSub}>{item.subject} • {item.size}</Text>
                        </View>
                        <TouchableOpacity style={styles.downloadBtn}>
                            <Ionicons name="download-outline" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: theme.spacing.lg, paddingBottom: 10 },
    title: { fontSize: 32, fontWeight: '800', color: theme.colors.text },
    list: { padding: theme.spacing.lg },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, padding: 16, borderRadius: theme.radius.lg, marginBottom: 16, ...theme.shadows.soft, borderWidth: 1, borderColor: theme.colors.border },
    iconBox: { width: 56, height: 56, backgroundColor: '#FDF2F8', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    info: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
    cardSub: { fontSize: 13, color: theme.colors.textSubtle, fontWeight: '500' },
    downloadBtn: { padding: 10 }
});
