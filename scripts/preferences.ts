import AsyncStorage from '@react-native-async-storage/async-storage';
import { Limits } from '../constants/Limits';

/**
 * Clés pour le stockage des préférences
 */
const STORAGE_KEYS = {
  MAX_LINK_LENGTH: 'max_link_length',
} as const;

/**
 * Interface pour les préférences utilisateur
 */
export interface UserPreferences {
  maxLinkLength: number;
}

/**
 * Préférences par défaut
 */
const DEFAULT_PREFERENCES: UserPreferences = {
  maxLinkLength: Limits.RECOMMENDED_LINK_LENGTH,
};

/**
 * Récupère les préférences utilisateur
 * @returns Les préférences utilisateur ou les valeurs par défaut
 */
export const getUserPreferences = async (): Promise<UserPreferences> => {
  try {
    const maxLinkLengthStr = await AsyncStorage.getItem(STORAGE_KEYS.MAX_LINK_LENGTH);
    
    return {
      maxLinkLength: maxLinkLengthStr ? parseInt(maxLinkLengthStr, 10) : DEFAULT_PREFERENCES.maxLinkLength,
    };
  } catch (error) {
    console.warn('Erreur lors de la récupération des préférences:', error);
    return DEFAULT_PREFERENCES;
  }
};

/**
 * Sauvegarde la longueur maximale des liens
 * @param maxLength - La nouvelle longueur maximale
 */
export const setMaxLinkLength = async (maxLength: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.MAX_LINK_LENGTH, maxLength.toString());
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la longueur maximale:', error);
    throw error;
  }
};

/**
 * Récupère la longueur maximale des liens
 * @returns La longueur maximale configurée ou la valeur par défaut
 */
export const getMaxLinkLength = async (): Promise<number> => {
  try {
    const preferences = await getUserPreferences();
    return preferences.maxLinkLength;
  } catch (error) {
    console.warn('Erreur lors de la récupération de la longueur maximale:', error);
    return DEFAULT_PREFERENCES.maxLinkLength;
  }
};

/**
 * Remet les préférences aux valeurs par défaut
 */
export const resetPreferences = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Erreur lors de la remise à zéro des préférences:', error);
    throw error;
  }
}; 