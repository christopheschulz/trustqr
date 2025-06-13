import { ReactNode } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface CardProps {
    data: string;
    title?: string;
    imageComponent?: ReactNode;
    variant?: 'default' | 'danger';
}

export function Card({ data, title = "", imageComponent, variant = 'default' }: CardProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    // Utiliser une variation de la couleur selon la variante
    const dataBackgroundColor = variant === 'danger'
        ? colors.danger  // Fond rouge pour danger
        : (colorScheme === 'light' 
            ? colors.tint + '10'  // Couleur principale avec 10% d'opacité
            : colors.tint + '20'); // Couleur principale avec 20% d'opacité en mode sombre

    const borderColor = variant === 'danger'
        ? colors.danger  // Bordure rouge pour danger
        : colors.tint + '30';   // Bordure normale

    const textColor = variant === 'danger'
        ? Colors.light.white         // Texte blanc pour danger
        : Colors.light.text;   // Texte normal

    return (
        <ThemedView style={[styles.card, { 
            backgroundColor: colors.background,
            borderColor: colors.icon,
            shadowColor: colors.text,
        }]}>
            {title && (
                <ThemedText type="subtitle" style={[styles.title, { color: colors.text }]}>
                    {title}
                </ThemedText>
            )}
            
            {imageComponent && (
                <View style={styles.imageContainer}>
                    {imageComponent}
                </View>
            )}
            
            <ThemedView style={[styles.dataContainer, { 
                backgroundColor: dataBackgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
            }]}>
                <ThemedText 
                    type="default" 
                    style={[styles.dataText, { color: textColor }]}
                    selectable={variant !== 'danger'} // Pas de sélection pour les erreurs
                >
                    {data}
                </ThemedText>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    title: {
        marginBottom: 12,
        fontWeight: '600',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    dataContainer: {
        borderRadius: 8,
        padding: 12,
        minHeight: 50,
        justifyContent: 'center',
    },
    dataText: {
        fontSize: 14,
        lineHeight: 20,
        flexWrap: 'wrap',
    },
}); 