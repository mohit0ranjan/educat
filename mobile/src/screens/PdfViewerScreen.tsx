import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const DARK_TXT = '#1E293B';
const PRIMARY = '#4F46E5';

export default function PdfViewerScreen({ route, navigation }: any) {
    const insets = useSafeAreaInsets();
    const { pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', title = 'Chapter Notes' } = route.params || {};
    const [loading, setLoading] = useState(true);

    // For Android to view PDFs without native extensions, using Google Docs Viewer wrapper
    const sourceUri = Platform.OS === 'android'
        ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`
        : pdfUrl;

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={DARK_TXT} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
                <TouchableOpacity onPress={() => { }} style={styles.backBtn}>
                    <Ionicons name="download-outline" size={24} color={DARK_TXT} />
                </TouchableOpacity>
            </View>

            <View style={styles.viewerContainer}>
                {loading && (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color={PRIMARY} />
                        <Text style={styles.loaderText}>Loading Document...</Text>
                    </View>
                )}
                <WebView
                    source={{ uri: sourceUri }}
                    style={styles.webview}
                    onLoadEnd={() => setLoading(false)}
                    scrollEnabled={true}
                    bounces={false}
                    showsVerticalScrollIndicator={true}
                    scalesPageToFit={true}
                    androidHardwareAccelerationDisabled={true}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, backgroundColor: '#FFFFFF', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 }, android: { elevation: 3 } }) },
    backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '800', color: DARK_TXT, flex: 1, textAlign: 'center', marginHorizontal: 12 },

    viewerContainer: { flex: 1, backgroundColor: '#E2E8F0' },
    webview: { flex: 1, backgroundColor: 'transparent' },

    loader: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', zIndex: 10 },
    loaderText: { marginTop: 12, fontSize: 14, fontWeight: '600', color: PRIMARY }
});
