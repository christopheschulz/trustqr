import { ReactNode } from 'react';
import { Modal as RNModal, StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';
import { Button } from './Button';
import { ThemedText } from './ThemedText';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    children?: ReactNode;
    primaryButton?: {
        title: string;
        onPress: () => void;
        variant?: 'primary' | 'secondary' | 'danger';
    };
    secondaryButton?: {
        title: string;
        onPress: () => void;
        variant?: 'primary' | 'secondary' | 'danger';
    };
}

export function Modal({ 
    visible, 
    onClose, 
    title, 
    children, 
    primaryButton, 
    secondaryButton 
}: ModalProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <RNModal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity 
                    style={styles.overlayTouch} 
                    activeOpacity={1} 
                    onPress={onClose}
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
                            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                                <ThemedText type="subtitle" style={styles.modalTitle}>
                                    {title}
                                </ThemedText>
                                
                                {children && (
                                    <View style={styles.body}>
                                        {children}
                                    </View>
                                )}

                                {(primaryButton || secondaryButton) && (
                                    <View style={styles.buttons}>
                                        {secondaryButton && (
                                            <Button 
                                                title={secondaryButton.title}
                                                onPress={secondaryButton.onPress}
                                                variant={secondaryButton.variant || 'secondary'}
                                            />
                                        )}
                                        {primaryButton && (
                                            <Button 
                                                title={primaryButton.title}
                                                onPress={primaryButton.onPress}
                                                variant={primaryButton.variant || 'primary'}
                                            />
                                        )}
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>
        </RNModal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayTouch: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxWidth: 400,
    },
    modalContent: {
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        marginBottom: 20,
        textAlign: 'center',
    },
    body: {
        marginBottom: 20,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
}); 