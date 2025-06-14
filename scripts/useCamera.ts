import { Camera } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export function useCamera() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [hasScanned, setHasScanned] = useState(false);
    const router = useRouter();

    const startScanning = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        if (status === 'granted') {
            setIsScanning(true);
            setScanned(false);
        }
    };

    const handleBarCodeScanned = (scanningResult: any) => {
        if (!scanned && !hasScanned) {
            setScanned(true);
            setHasScanned(true);
            setIsScanning(false);
            router.push({
                pathname: '/(tabs)/result',
                params: {
                    type: scanningResult.type,
                    data: scanningResult.data
                }
            });
        }
    };

    const stopScanning = () => {
        setIsScanning(false);
    };

    const resetScanning = () => {
        setHasScanned(false);
        setScanned(false);
    };

    return {
        hasPermission,
        isScanning,
        scanned,
        hasScanned,
        startScanning,
        handleBarCodeScanned,
        stopScanning,
        resetScanning
    };
} 