import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function ResultScreen() {
    const { type, data } = useLocalSearchParams<{ type: string; data: string }>();

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ThemedView style={styles.content}>
                <ThemedView style={styles.resultWrapper}>
                    <ThemedText type="title">Résultat du scan</ThemedText>
                    <ThemedView style={styles.resultContainer}>
                        <ThemedText type="default">Type: {type}</ThemedText>
                        <ThemedText type="default">Données: {data}</ThemedText>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    content: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    resultWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    resultContainer: {
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
        gap: 10,
        backgroundColor: 'transparent',
        width: '100%',
    },
}); 