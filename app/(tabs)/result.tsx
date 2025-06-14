import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { QRCodeDisplay } from '../../components/QRCodeDisplay';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { VerificationWarningModal } from '../../components/VerificationWarningModal';
import { Colors } from '../../constants/Colors';
import {
  LinkVerificationResult,
  verifyLinkForSecurity
} from '../../scripts/linkVerification';

export default function ResultScreen() {
  const { data, type } = useLocalSearchParams<{ data: string; type: string }>();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [verificationResult, setVerificationResult] = useState<LinkVerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const linkLength = (data || '').length;

  // Vérification asynchrone du lien
  useEffect(() => {
    const verifyLink = async () => {
      if (data) {
        try {
          const result = await verifyLinkForSecurity(data);
          setVerificationResult(result);
        } catch (error) {
          console.error('Erreur lors de la vérification:', error);
          // Résultat par défaut en cas d'erreur
          setVerificationResult({
            isValid: false,
            isLink: false,
            errorMessage: 'Erreur lors de la vérification',
            canVerify: false,
            displayData: 'Erreur lors de la vérification du lien',
          });
        }
      }
      setIsLoading(false);
    };

    verifyLink();
  }, [data]);

  const handleVerifyLink = () => {
    if (verificationResult?.canVerify) {
      setShowModal(true);
    }
  };

  const proceedToVerification = () => {
    setShowModal(false);
    router.replace(`/(tabs)/verifications?data=${encodeURIComponent(data || '')}&type=${encodeURIComponent(type || '')}`);
  };

  // Composant pour afficher le QR code avec les informations basiques
  const QRCodeWithInfo = () => (
    <View style={styles.qrContainer}>
      <QRCodeDisplay value={data || ''} size={100} />
      <ThemedText style={styles.linkInfo}>
        Longueur: {linkLength} caractères
      </ThemedText>
    </View>
  );

  // Affichage de chargement
  if (isLoading || !verificationResult) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Analyse en cours...
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Résultat du scan
        </ThemedText>

        <Card 
          data={verificationResult.displayData} 
          imageComponent={<QRCodeWithInfo />}
        />

        <ThemedView style={styles.buttonsContainer}>
          <Button 
            title="Vérifier lien"
            onPress={handleVerifyLink}
            variant="secondary"
          />
          
          <Button 
            title="Nouveau scan"
            onPress={() => router.push('/')}
            variant="primary"
          />
        </ThemedView>
      </ThemedView>

      <VerificationWarningModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onContinue={proceedToVerification}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
    opacity: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonsContainer: {
    gap: 15,
    marginTop: 20,
  },
  qrContainer: {
    alignItems: 'center',
    gap: 8,
  },
  linkInfo: {
    fontSize: 12,
    opacity: 0.7,
    fontStyle: 'italic',
  },
}); 