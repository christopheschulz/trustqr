import { Camera } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export function useCamera() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
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
        if (!scanned) {
            setScanned(true);
            setIsScanning(false);
            router.push({
                pathname: '/result',
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

    return {
        hasPermission,
        isScanning,
        scanned,
        startScanning,
        handleBarCodeScanned,
        stopScanning
    };
} 