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
            title="Vérification en ligne"
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
                La vérification en ligne va analyser le lien en temps réel pour détecter les dernières menaces.
            </ThemedText>
            
            <ThemedText type="default" style={styles.text}>
                Cette vérification complète les tests offline déjà effectués et peut prendre quelques secondes.
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