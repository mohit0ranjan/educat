import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BounceButton from '../components/BounceButton';

const DARK_TXT = '#1E293B';
const GRAY_TXT = '#64748B';
const PRIMARY = '#4F46E5';
const ACCENT = '#8B5CF6';

export default function SettingsScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    return (
        <LinearGradient colors={['#EEF2FF', '#FFFFFF']} style={styles.container}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={DARK_TXT} />
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.card}>
                    <BounceButton activeScale={0.96}>
                        <View style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
                                <Ionicons name="person" size={20} color={PRIMARY} />
                            </View>
                            <Text style={styles.rowText}>Edit Profile</Text>
                            <Ionicons name="chevron-forward" size={20} color={GRAY_TXT} />
                        </View>
                    </BounceButton>
                    <View style={styles.divider} />
                    <BounceButton activeScale={0.96}>
                        <View style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: '#F5F3FF' }]}>
                                <Ionicons name="school" size={20} color={ACCENT} />
                            </View>
                            <Text style={styles.rowText}>Change Class / City</Text>
                            <Ionicons name="chevron-forward" size={20} color={GRAY_TXT} />
                        </View>
                    </BounceButton>
                    <View style={styles.divider} />
                    <BounceButton activeScale={0.96}>
                        <View style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
                                <Ionicons name="lock-closed" size={20} color="#EF4444" />
                            </View>
                            <Text style={styles.rowText}>Change Password</Text>
                            <Ionicons name="chevron-forward" size={20} color={GRAY_TXT} />
                        </View>
                    </BounceButton>
                </View>

                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                            <Ionicons name="notifications" size={20} color="#10B981" />
                        </View>
                        <Text style={styles.rowText}>Push Notifications</Text>
                        <Switch
                            trackColor={{ false: '#CBD5E1', true: PRIMARY }}
                            thumbColor="#FFF"
                            onValueChange={setNotificationsEnabled}
                            value={notificationsEnabled}
                        />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <View style={[styles.iconBox, { backgroundColor: '#F8FAFC' }]}>
                            <Ionicons name="moon" size={20} color={DARK_TXT} />
                        </View>
                        <Text style={styles.rowText}>Dark Mode (Coming Soon)</Text>
                        <Switch
                            trackColor={{ false: '#CBD5E1', true: PRIMARY }}
                            thumbColor="#FFF"
                            onValueChange={setDarkModeEnabled}
                            value={darkModeEnabled}
                            disabled
                        />
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Support</Text>
                <View style={styles.card}>
                    <BounceButton activeScale={0.96}>
                        <View style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: '#FFFBEB' }]}>
                                <Ionicons name="help-buoy" size={20} color="#F59E0B" />
                            </View>
                            <Text style={styles.rowText}>Help Center</Text>
                            <Ionicons name="chevron-forward" size={20} color={GRAY_TXT} />
                        </View>
                    </BounceButton>
                    <View style={styles.divider} />
                    <BounceButton activeScale={0.96}>
                        <View style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
                                <Ionicons name="information-circle" size={20} color={PRIMARY} />
                            </View>
                            <Text style={styles.rowText}>About Us</Text>
                            <Ionicons name="chevron-forward" size={20} color={GRAY_TXT} />
                        </View>
                    </BounceButton>
                </View>

                <View style={{ height: 60 }} />
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 28, paddingBottom: 20 },
    backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 }, android: { elevation: 2 } }) },
    title: { fontSize: 24, fontWeight: '800', color: DARK_TXT },

    scroll: { paddingHorizontal: 28, paddingTop: 10 },
    sectionTitle: { fontSize: 14, fontWeight: '800', color: GRAY_TXT, marginLeft: 16, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },

    card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 8, marginBottom: 32, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.04, shadowRadius: 15 }, android: { elevation: 3 } }) },
    row: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    iconBox: { width: 44, height: 44, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    rowText: { flex: 1, fontSize: 16, fontWeight: '700', color: DARK_TXT },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 16 }
});
