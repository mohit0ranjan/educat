import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Navigators
import BottomTabNavigator from './src/navigation/BottomTabNavigator';

// Screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import CourseDetailScreen from './src/screens/CourseDetailScreen';
import QuizScreen from './src/screens/QuizScreen';
import CustomSplashScreen from './src/screens/SplashScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import VideoPlayerScreen from './src/screens/VideoPlayerScreen';
import PdfViewerScreen from './src/screens/PdfViewerScreen';
import AnnouncementsScreen from './src/screens/AnnouncementsScreen';

// Teacher Screens
import UploadLectureScreen from './src/screens/UploadLectureScreen';
import AddAnnouncementScreen from './src/screens/AddAnnouncementScreen';
import ScheduleClassScreen from './src/screens/ScheduleClassScreen';
import StudentListScreen from './src/screens/StudentListScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Splash"
                    screenOptions={{
                        headerShown: false,
                        animation: 'fade',
                    }}
                >
                    {/* Auth & Setup Flow */}
                    <Stack.Screen name="Splash" component={CustomSplashScreen} />
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />

                    {/* Main App via Tabs */}
                    <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

                    {/* Deep Screens */}
                    <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name="Quiz" component={QuizScreen} options={{ animation: 'slide_from_bottom' }} />
                    <Stack.Screen name="Settings" component={SettingsScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} options={{ animation: 'fade' }} />
                    <Stack.Screen name="PdfViewer" component={PdfViewerScreen} options={{ animation: 'slide_from_bottom' }} />

                    {/* Teacher Specific Screens */}
                    <Stack.Screen name="UploadLecture" component={UploadLectureScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name="AddAnnouncement" component={AddAnnouncementScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name="ScheduleClass" component={ScheduleClassScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name="StudentList" component={StudentListScreen} options={{ animation: 'slide_from_right' }} />

                    {/* Shared Screens */}
                    <Stack.Screen name="Announcements" component={AnnouncementsScreen} options={{ animation: 'slide_from_right' }} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
