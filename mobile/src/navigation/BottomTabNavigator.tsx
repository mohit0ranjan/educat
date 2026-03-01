import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import TeacherHomeScreen from '../screens/TeacherHomeScreen';
import SubjectsScreen from '../screens/SubjectsScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import TestsScreen from '../screens/TestsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuthStore } from '../services/store';

const Tab = createBottomTabNavigator();

// ─── Design Tokens ─────────────────────────────────────────────────
const PRIMARY = '#2DC87A';
const INACTIVE = '#B0B5CC';
const CARD = '#FFFFFF';
const DARK = '#1C1C2E';
const BG = '#F5F6FA';

type IconName = keyof typeof Ionicons.glyphMap;
const ICONS: Record<string, [IconName, IconName]> = {
    'Home': ['home', 'home-outline'],
    'Subjects': ['book', 'book-outline'],
    'Schedule': ['calendar', 'calendar-outline'],
    'Tests': ['document-text', 'document-text-outline'],
    'Profile': ['person', 'person-outline'],
};

export default function BottomTabNavigator() {
    const { role } = useAuthStore();

    return (
        <View style={styles.root}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => {
                        const [active, inactive] = ICONS[route.name] ?? ['help-circle', 'help-circle-outline'];
                        return (
                            <View style={focused ? styles.activeIconWrap : styles.iconWrap}>
                                <Ionicons
                                    name={focused ? active : inactive}
                                    size={focused ? 22 : 22}
                                    color={focused ? PRIMARY : INACTIVE}
                                />
                            </View>
                        );
                    },
                    tabBarActiveTintColor: PRIMARY,
                    tabBarInactiveTintColor: INACTIVE,
                    tabBarStyle: styles.tabBar,
                    tabBarLabelStyle: styles.tabLabel,
                    tabBarItemStyle: styles.tabItem,
                    tabBarShowLabel: true,
                })}
            >
                {role === 'teacher' ? (
                    <>
                        <Tab.Screen name="Home" component={TeacherHomeScreen} options={{ tabBarLabel: 'Dashboard' }} />
                        <Tab.Screen name="Schedule" component={ScheduleScreen} options={{ tabBarLabel: 'Classes' }} />
                        <Tab.Screen name="Profile" component={ProfileScreen} />
                    </>
                ) : (
                    <>
                        <Tab.Screen name="Home" component={HomeScreen} />
                        <Tab.Screen name="Subjects" component={SubjectsScreen} />
                        <Tab.Screen name="Schedule" component={ScheduleScreen} options={{ tabBarLabel: 'Classes' }} />
                        <Tab.Screen name="Tests" component={TestsScreen} />
                        <Tab.Screen name="Profile" component={ProfileScreen} />
                    </>
                )}
            </Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },
    tabBar: {
        backgroundColor: CARD,
        height: Platform.OS === 'ios' ? 86 : 68,
        paddingBottom: Platform.OS === 'ios' ? 24 : 10,
        paddingTop: 8,
        borderTopColor: '#EFEFF4',
        borderTopWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#9BA3C2',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.08,
                shadowRadius: 16,
            },
            android: { elevation: 12 },
        }),
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    },
    tabItem: {
        borderRadius: 12,
        paddingVertical: 2,
    },
    iconWrap: {
        width: 36, height: 36,
        justifyContent: 'center', alignItems: 'center',
    },
    activeIconWrap: {
        width: 42, height: 32,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#E8FAF2',
        borderRadius: 50,
    },
});
