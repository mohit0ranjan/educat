import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Video from 'react-native-video'; // Requires installation and native linking

export default function LectureScreen({ route }: any) {
    const { videoUrl, title } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.videoContainer}>
                {/* Mock for Video Player or external URL opener if it's youtube */}
                {videoUrl.includes('youtube') ? (
                    <Text style={styles.notice}>Opening YouTube: {videoUrl}</Text>
                ) : (
                    <Video
                        source={{ uri: videoUrl }}
                        style={styles.video}
                        controls={true}
                        resizeMode="contain"
                    />
                )}
            </View>
            <View style={styles.notesContainer}>
                <Text style={styles.subtitle}>Resources</Text>
                <Text style={styles.link}>Download PDF Notes</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    title: { color: 'white', fontSize: 20, padding: 16 },
    videoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' },
    video: { width: '100%', height: 250 },
    notice: { color: '#ccc', padding: 20, textAlign: 'center' },
    notesContainer: { padding: 16, backgroundColor: '#111' },
    subtitle: { color: 'white', fontSize: 18, marginBottom: 8 },
    link: { color: '#3b82f6', textDecorationLine: 'underline' }
});
