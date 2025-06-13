import { useColorScheme } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '../constants/Colors';

interface QRCodeDisplayProps {
    value: string;
    size?: number;
}

export function QRCodeDisplay({ value, size = 100 }: QRCodeDisplayProps) {
    const colorScheme = useColorScheme();

    return (
        <QRCode
            value={value}
            size={size}
            backgroundColor={Colors[colorScheme ?? 'light'].background}
            color={Colors[colorScheme ?? 'light'].text}
        />
    );
} 