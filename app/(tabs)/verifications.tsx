import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import {
    LinkVerificationResult,
    verifyLinkForSecurity
} from '../../scripts/linkVerification';

export default function VerificationsScreen() {
  const { data, type } = useLocalSearchParams<{ data: string; type: string }>();
  const router = useRouter();
  const [verificationResult, setVerificationResult] = useState<LinkVerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const performVerification = async () => {
      if (data) {
        try {
          const result = await verifyLinkForSecurity(data);
          setVerificationResult(result);
        } catch (error) {
          console.error('Erreur lors de la vérification:', error);
        }
      }
      setIsLoading(false);
    };

    performVerification();
  }, [data]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.loadingText}>
            Analyse en cours...
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (!verificationResult) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.errorText}>
            Erreur lors de l'analyse
          </ThemedText>
          <Button 
            title="Retour"
            onPress={() => router.back()}
            variant="primary"
          />
        </ThemedView>
      </SafeAreaView>
    );
  }

  const getSecurityLevelText = (level: string) => {
    switch (level) {
      case 'safe': return 'Sûr';
      case 'suspect': return 'Suspect';
      case 'dangerous': return 'Dangereux';
      default: return 'Inconnu';
    }
  };

  // Analyse des violations pour chaque test effectué dans getTrustScore
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Tests de sécurité
          </ThemedText>

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

          {/* Score global en bas */}
          <Card 
            title="Score de confiance global"
            data={`${verificationResult.trustScore}/100 - ${getSecurityLevelText(verificationResult.securityLevel || 'unknown')}\n\nTests réussis: ${passedTests}/${totalTests}`}
            variant={verificationResult.securityLevel === 'dangerous' ? 'danger' : 'default'}
          />

          {/* Boutons de navigation */}
          <ThemedView style={styles.buttonContainer}>
            <Button 
              title="Retour aux résultats"
              onPress={() => router.push(`/(tabs)/result?data=${encodeURIComponent(data || '')}&type=${encodeURIComponent(type || '')}`)}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 15,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingText: {
    textAlign: 'center',
    color: Colors.light.text,
  },
  errorText: {
    textAlign: 'center',
    color: Colors.light.error,
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 15,
    marginTop: 10,
  },
}); 