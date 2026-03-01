import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function QuizScreen({ navigation }: any) {
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

    const options = [
        "A) Refraction of Light",
        "B) Reflection of Light",
        "C) Dispersion",
        "D) Interference"
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color={theme.colors.textSubtle} />
                </TouchableOpacity>
                <View style={styles.progressTracker}>
                    <View style={styles.progressLine}>
                        <View style={[styles.progressFill, { width: '30%' }]} />
                    </View>
                    <Text style={styles.progressText}>Q3 of 10</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.question}>
                    Which phenomenon is responsible for the formation of a rainbow in the sky?
                </Text>

                <View style={styles.options}>
                    {options.map((opt, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={[styles.optBtn, selectedOpt === idx && styles.optSelected]}
                            onPress={() => setSelectedOpt(idx)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.radio, selectedOpt === idx && styles.radioActive]}>
                                {selectedOpt === idx && <View style={styles.radioInner} />}
                            </View>
                            <Text style={[styles.optText, selectedOpt === idx && styles.optTextSelected]}>{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={[styles.nextBtn, selectedOpt === null && styles.btnDisabled]} disabled={selectedOpt === null} activeOpacity={0.8}>
                    <LinearGradient colors={selectedOpt !== null ? theme.colors.gradients.primary as any : ['#E2E8F0', '#E2E8F0']} style={styles.nextGradient}>
                        <Text style={[styles.nextText, selectedOpt === null && { color: '#94A3B8' }]}>Next Question</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.lg, marginBottom: theme.spacing.xl },
    closeBtn: { padding: 8, backgroundColor: theme.colors.surface, borderRadius: 20 },
    progressTracker: { flex: 1, marginLeft: 20 },
    progressLine: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, marginBottom: 8 },
    progressFill: { height: '100%', backgroundColor: theme.colors.primary, borderRadius: 4 },
    progressText: { fontSize: 13, fontWeight: '700', color: theme.colors.textSubtle, textAlign: 'right' },
    content: { flex: 1, paddingHorizontal: theme.spacing.lg },
    question: { fontSize: 24, fontWeight: '800', color: theme.colors.text, lineHeight: 34, marginBottom: 40 },
    options: { gap: 16 },
    optBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, padding: 20, borderRadius: theme.radius.lg, borderWidth: 2, borderColor: theme.colors.border },
    optSelected: { borderColor: theme.colors.primary, backgroundColor: '#EEF2FF', ...theme.shadows.soft },
    radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: theme.colors.border, marginRight: 16, justifyContent: 'center', alignItems: 'center' },
    radioActive: { borderColor: theme.colors.primary },
    radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: theme.colors.primary },
    optText: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
    optTextSelected: { color: theme.colors.primary, fontWeight: '800' },
    footer: { padding: theme.spacing.lg },
    nextBtn: { width: '100%' },
    btnDisabled: { elevation: 0 },
    nextGradient: { paddingVertical: 18, borderRadius: theme.radius.pill, alignItems: 'center' },
    nextText: { color: '#FFF', fontSize: 18, fontWeight: '700' }
});
