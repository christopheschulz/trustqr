import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import { Limits } from '../../constants/Limits';
import {
    getUserPreferences,
    setMaxLinkLength,
    UserPreferences
} from '../../scripts/preferences';

export default function Settings() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [maxLinkLengthInput, setMaxLinkLengthInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Charger les préférences au démarrage
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await getUserPreferences();
        setPreferences(prefs);
        setMaxLinkLengthInput(prefs.maxLinkLength.toString());
      } catch (error) {
        console.error('Erreur lors du chargement des préférences:', error);
        Alert.alert('Erreur', 'Impossible de charger les préférences');
      }
      setIsLoading(false);
    };

    loadPreferences();
  }, []);

  // Sauvegarder la nouvelle longueur maximale
  const handleSaveMaxLength = async () => {
    const newLength = parseInt(maxLinkLengthInput, 10);
    
    // Validation
    if (isNaN(newLength) || newLength < 1) {
      Alert.alert('Erreur', 'Veuillez entrer un nombre valide supérieur à 0');
      return;
    }

    if (newLength > Limits.MAX_LINK_LENGTH) {
      Alert.alert('Erreur', `La longueur maximale ne peut pas dépasser ${Limits.MAX_LINK_LENGTH} caractères`);
      return;
    }

    setIsSaving(true);
    try {
      await setMaxLinkLength(newLength);
      setPreferences(prev => prev ? { ...prev, maxLinkLength: newLength } : null);
      Alert.alert('Succès', 'Longueur maximale mise à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les paramètres');
    }
    setIsSaving(false);
  };

  // Remettre à la valeur conseillée
  const handleReset = async () => {
    Alert.alert(
      'Confirmer la remise à la valeur conseillée',
      `Êtes-vous sûr de vouloir remettre la longueur maximale à la valeur conseillée de ${Limits.RECOMMENDED_LINK_LENGTH} caractères ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            try {
              await setMaxLinkLength(Limits.RECOMMENDED_LINK_LENGTH);
              setPreferences(prev => prev ? { ...prev, maxLinkLength: Limits.RECOMMENDED_LINK_LENGTH } : null);
              setMaxLinkLengthInput(Limits.RECOMMENDED_LINK_LENGTH.toString());
              Alert.alert('Succès', 'Longueur maximale remise à la valeur conseillée');
            } catch (error) {
              console.error('Erreur lors de la remise à la valeur conseillée:', error);
              Alert.alert('Erreur', 'Impossible de remettre à la valeur conseillée');
            }
          },
        },
      ]
    );
  };

  if (isLoading || !preferences) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Chargement des paramètres...
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Paramètres
          </ThemedText>

          <Card 
            title="Longueur maximale des liens"
            data={`Actuellement: ${preferences.maxLinkLength} caractères`}
          />

          <ThemedView style={[styles.settingSection, { backgroundColor: colors.tintWithOpacity }]}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Modifier la longueur maximale
            </ThemedText>
            
            <ThemedText style={styles.description}>
              Définissez la longueur maximale autorisée pour les liens (entre 1 et {Limits.MAX_LINK_LENGTH} caractères).
              Valeur conseillée: {Limits.RECOMMENDED_LINK_LENGTH} caractères.
            </ThemedText>

            <TextInput
              style={[styles.input, { 
                borderColor: colors.icon,
                backgroundColor: colors.background,
                color: colors.text
              }]}
              value={maxLinkLengthInput}
              onChangeText={setMaxLinkLengthInput}
              placeholder="Longueur maximale"
              placeholderTextColor={colors.icon}
              keyboardType="numeric"
              maxLength={5}
            />

            <Button
              title={isSaving ? "Sauvegarde..." : "Sauvegarder"}
              onPress={handleSaveMaxLength}
              variant="primary"
              disabled={isSaving}
            />
          </ThemedView>

          <ThemedView style={[styles.settingSection, { backgroundColor: colors.tintWithOpacity }]}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Actions
            </ThemedText>
            
            <Button
              title="Remettre à la valeur conseillée"
              onPress={handleReset}
              variant="danger"
            />
          </ThemedView>

          <ThemedView style={[styles.infoSection, { backgroundColor: colors.tintWithOpacity }]}>
            <ThemedText style={styles.infoText}>
              Les paramètres sont sauvegardés automatiquement sur votre appareil.
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  settingSection: {
    marginVertical: 15,
    padding: 15,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 10,
    fontWeight: '600',
  },
  description: {
    marginBottom: 15,
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  infoSection: {
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
