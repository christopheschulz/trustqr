import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';
import { ThemedText } from './ThemedText';

interface ButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
}

export function Button({ onPress, title, variant = 'primary', disabled = false }: ButtonProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const buttonColors = colors.button[variant];

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { 
                    backgroundColor: buttonColors.background,
                    borderColor: buttonColors.border,
                    borderWidth: variant === 'secondary' ? 1 : 0,
                },
                disabled && styles.disabled
            ]}
            onPress={disabled ? undefined : onPress}
            disabled={disabled}
            activeOpacity={disabled ? 1 : 0.7}
        >
            <ThemedText style={[
                styles.text, 
                { color: buttonColors.text },
                disabled && styles.disabledText
            ]}> 
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
        shadowColor: Colors.light.shadow,
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
    disabled: {
        opacity: 0.5,
        elevation: 0,
        shadowOpacity: 0,
    },
    disabledText: {
        opacity: 0.7,
    },
}); 