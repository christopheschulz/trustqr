import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';
import { ThemedText } from './ThemedText';

interface ButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary';
}

export function Button({ onPress, title, variant = 'primary' }: ButtonProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const backgroundColor = variant === 'primary' ? colors.tint : 'transparent';
    const textColor = variant === 'primary' ? colors.background : colors.tint;
    const borderColor = variant === 'secondary' ? colors.tint : 'transparent';

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { 
                    backgroundColor,
                    borderColor,
                    borderWidth: variant === 'secondary' ? 1 : 0,
                }
            ]}
            onPress={onPress}
        >
            <ThemedText style={[styles.text, { color: textColor }]}>
                {title}
            </ThemedText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
}); 