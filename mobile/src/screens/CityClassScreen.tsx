import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';

const CITIES = ['Delhi', 'Patna', 'Mumbai', 'Kota', 'Pune'];
const CLASSES = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

export default function CityClassScreen({ navigation }: any) {
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedClass, setSelectedClass] = useState('');

    const handleContinue = () => {
        if (selectedCity && selectedClass) {
            navigation.replace('MainTabs');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Personalize</Text>
                    <Text style={styles.subtitle}>Help us match you with the best local batches and study material.</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="location-outline" size={24} color={theme.colors.primary} />
                        <Text style={styles.sectionTitle}>Select Your City</Text>
                    </View>
                    <View style={styles.pillContainer}>
                        {CITIES.map((city) => (
                            <TouchableOpacity
                                key={city}
                                style={[styles.pill, selectedCity === city && styles.pillSelected]}
                                onPress={() => setSelectedCity(city)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.pillText, selectedCity === city && styles.pillTextSelected]}>
                                    {city}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="school-outline" size={24} color={theme.colors.accent} />
                        <Text style={styles.sectionTitle}>Select Your Class</Text>
                    </View>
                    <View style={styles.gridContainer}>
                        {CLASSES.map((cls) => (
                            <TouchableOpacity
                                key={cls}
                                style={[styles.gridCard, selectedClass === cls && styles.gridCardSelected]}
                                onPress={() => setSelectedClass(cls)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.gridText, selectedClass === cls && styles.gridTextSelected]}>
                                    {cls}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, (!selectedCity || !selectedClass) && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={!selectedCity || !selectedClass}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={selectedCity && selectedClass ? theme.colors.gradients.primary as any : ['#CBD5E1', '#94A3B8']}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Continue to Dashboard</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        padding: theme.spacing.xl,
        paddingTop: theme.spacing.xxl,
    },
    header: {
        marginBottom: theme.spacing.xxl,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: theme.colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSubtle,
        lineHeight: 24,
    },
    section: {
        marginBottom: theme.spacing.xxl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        gap: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text,
    },
    pillContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    pill: {
        backgroundColor: theme.colors.surface,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: theme.radius.pill,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.soft,
    },
    pillSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    pillText: {
        fontSize: 16,
        color: theme.colors.text,
        fontWeight: '600',
    },
    pillTextSelected: {
        color: '#FFF',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    gridCard: {
        width: '31%',
        backgroundColor: theme.colors.surface,
        paddingVertical: 18,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.soft,
    },
    gridCardSelected: {
        backgroundColor: theme.colors.accent,
        borderColor: theme.colors.accent,
    },
    gridText: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
    },
    gridTextSelected: {
        color: '#FFF',
    },
    footer: {
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.background,
    },
    button: {
        width: '100%',
        ...theme.shadows.medium,
    },
    buttonDisabled: {
        opacity: 0.8,
        elevation: 0,
        shadowOpacity: 0,
    },
    buttonGradient: {
        paddingVertical: 18,
        borderRadius: theme.radius.pill,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
