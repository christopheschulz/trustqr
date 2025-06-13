import { StyleSheet } from 'react-native';
import { Modal } from './Modal';
import { ThemedText } from './ThemedText';

interface VerificationWarningModalProps {
    visible: boolean;
    onClose: () => void;
    onContinue: () => void;
}

export function VerificationWarningModal({ 
    visible, 
    onClose, 
    onContinue 
}: VerificationWarningModalProps) {
    return (
        <Modal
            visible={visible}
            onClose={onClose}
            title="Information importante"
            primaryButton={{
                title: "Continuer",
                onPress: onContinue
            }}
            secondaryButton={{
                title: "Annuler",
                onPress: onClose
            }}
        >
            <ThemedText type="default" style={styles.text}>
                TrustQR est un outil d'aide à la décision qui analyse les liens pour détecter d'éventuelles menaces.
            </ThemedText>
            
            <ThemedText type="default" style={styles.text}>
                Cette analyse ne garantit pas à 100% la sécurité d'un lien. Restez vigilant et utilisez votre jugement personnel.
            </ThemedText>
            
            <ThemedText type="default" style={styles.text}>
                TrustQR ne peut être tenu responsable des dommages causés par l'utilisation de liens malveillants.
            </ThemedText>
        </Modal>
    );
}

const styles = StyleSheet.create({
    text: {
        marginBottom: 15,
        lineHeight: 22,
        textAlign: 'justify',
    },
}); 