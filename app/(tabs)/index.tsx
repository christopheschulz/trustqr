import { CameraView } from 'expo-camera';
import { Dimensions, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useCamera } from '../../scripts/useCamera';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCAN_AREA_SIZE = SCREEN_WIDTH * 0.7;
const FRAME_SIZE = SCAN_AREA_SIZE - 40;

export default function Home() {
    const {
        hasPermission,
        isScanning,
        startScanning,
        handleBarCodeScanned,
        stopScanning
    } = useCamera();

    if (hasPermission === false) {
        return (
            <SafeAreaView style={styles.container}>
                <ThemedText type="default">L'accès à la caméra est nécessaire pour scanner les QR codes</ThemedText>
                <Button onPress={startScanning} title="Réessayer" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            {isScanning ? (
                <View style={styles.cameraContainer}>
                    <View style={styles.cameraWrapper}>
                        <CameraView
                            style={StyleSheet.absoluteFill}
                            onBarcodeScanned={handleBarCodeScanned}
                            barcodeScannerSettings={{
                                barcodeTypes: ['qr'],
                            }}
                        />
                        <View style={styles.overlay}>
                            <View style={styles.scanArea}>
                                <View style={styles.scanFrame} />
                            </View>
                        </View>
                    </View>
                    <ThemedText type="default" style={styles.scanText}>Placez le QR code dans le cadre</ThemedText>
                    <Button onPress={stopScanning} title="Annuler" variant="secondary" />
                </View>
            ) : (
                <ThemedView style={styles.buttonContainer}>
                    <Button onPress={startScanning} title="Scanner un QR Code" />
                </ThemedView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraWrapper: {
        width: SCAN_AREA_SIZE,
        height: SCAN_AREA_SIZE,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        width: SCAN_AREA_SIZE,
        height: SCAN_AREA_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: FRAME_SIZE,
        height: FRAME_SIZE,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 10,
        position: 'absolute',
        top: (SCAN_AREA_SIZE - FRAME_SIZE) / 2,
        left: (SCAN_AREA_SIZE - FRAME_SIZE) / 2,
    },
    scanText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
