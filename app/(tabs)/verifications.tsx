import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';

export default function VerificationsScreen() {
  const { data, type } = useLocalSearchParams<{ data: string; type: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Vérification en ligne
        </ThemedText>
        
        <ThemedView style={styles.messageContainer}>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Fonctionnalité en développement
          </ThemedText>
          
          <ThemedText style={styles.description}>
            La vérification en ligne via API sera disponible dans une prochaine version.
          </ThemedText>
          
          <ThemedText style={styles.description}>
            En attendant, vous pouvez consulter tous les résultats de sécurité offline sur la page précédente.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          <Button 
            title="Retour aux résultats"
            onPress={() => router.push(`/(tabs)/result?data=${encodeURIComponent(data || '')}&type=${encodeURIComponent(type || '')}`)}
            variant="primary"
          />
          
          <Button 
            title="Nouveau scan"
            onPress={() => router.push('/')}
            variant="secondary"
          />
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 15,
    width: '100%',
    paddingHorizontal: 20,
  },
}); 