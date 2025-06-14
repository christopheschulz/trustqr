import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
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
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Analyse en cours...
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Résultat du scan
          </ThemedText>

          <Card 
            data={verificationResult.displayData} 
            imageComponent={<QRCodeWithInfo />}
          />

          {/* Résultats des tests de sécurité offline */}
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Tests de sécurité (offline)
          </ThemedText>

          {/* Analyse des violations pour chaque test effectué dans getTrustScore */}
          {(() => {
            const violations = verificationResult.violations || [];
            
            // Tests effectués dans l'ordre exact de getTrustScore :
            const tests = [
              {
                name: '1. Vérification de la longueur',
                passed: !violations.some(v => v.type === 'length'),
                description: 'Longueur du lien acceptable'
              },
              {
                name: '2. Vérification du format de l\'URL',
                passed: !violations.some(v => v.type === 'malformed'),
                description: 'Format URL valide'
              },
              {
                name: '3. Vérification du protocole HTTPS',
                passed: !violations.some(v => v.type === 'protocol'),
                description: 'Protocole sécurisé (HTTPS)'
              },
              {
                name: '4. Vérification de la blacklist',
                passed: !violations.some(v => v.type === 'blacklist'),
                description: 'Domaine non blacklisté'
              },
              {
                name: '5. Vérification des domaines suspects',
                passed: !violations.some(v => v.type === 'suspicious_domain'),
                description: 'Domaine de confiance'
              },
              {
                name: '6. Vérification des paramètres excessifs',
                passed: !violations.some(v => v.type === 'excessive_params'),
                description: 'Nombre de paramètres normal'
              },
              {
                name: '7. Vérification des caractères suspects',
                passed: !violations.some(v => v.type === 'suspicious_chars'),
                description: 'Caractères normaux'
              },
              {
                name: '8. Vérification de l\'entropie',
                passed: !violations.some(v => v.type === 'high_entropy'),
                description: 'Structure normale'
              }
            ];

            const passedTests = tests.filter(test => test.passed).length;
            const totalTests = tests.length;

            const getSecurityLevelText = (level: string) => {
              switch (level) {
                case 'safe': return 'Sûr';
                case 'suspect': return 'Suspect';
                case 'dangerous': return 'Dangereux';
                default: return 'Inconnu';
              }
            };

            return (
              <>
                {/* Détail de chaque test */}
                {tests.map((test, index) => (
                  <Card 
                    key={index}
                    title={test.name}
                    data={`${test.passed ? '✅ RÉUSSI' : '❌ ÉCHOUÉ'} - ${test.description}`}
                    variant={test.passed ? 'default' : 'danger'}
                  />
                ))}

                {/* Alertes détaillées si présentes */}
                {violations.length > 0 && (
                  <Card 
                    title="Détails des violations"
                    data={violations.map((v, index) => `${index + 1}. ${v.message} (Impact: -${v.impact} points)`).join('\n')}
                    variant="danger"
                  />
                )}

                {/* Score global */}
                <Card 
                  title="Score de confiance global"
                  data={`${verificationResult.trustScore}/100 - ${getSecurityLevelText(verificationResult.securityLevel || 'unknown')}\n\nTests réussis: ${passedTests}/${totalTests}`}
                  variant={verificationResult.securityLevel === 'dangerous' ? 'danger' : 'default'}
                />
              </>
            );
          })()}

          <ThemedView style={styles.buttonsContainer}>
            <Button 
              title="Vérifier le lien en ligne"
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
      </ScrollView>

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
  sectionTitle: {
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
}); 