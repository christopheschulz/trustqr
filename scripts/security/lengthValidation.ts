import { getMaxLinkLength } from '../preferences';

/**
 * Types pour les violations de sécurité - Module: Validation de longueur
 */
export interface SecurityViolation {
  type: 'length' | 'protocol' | 'malformed' | 'blacklist' | 'suspicious_domain' | 'excessive_params' | 'suspicious_chars' | 'high_entropy';
  severity: 'low' | 'medium' | 'high';
  message: string;
  impact: number; // Impact sur le score (0-100)
}

/**
 * Vérifie la longueur du lien selon les préférences utilisateur
 */
export async function checkLinkLength(url: string): Promise<SecurityViolation | null> {
  const maxLinkLength = await getMaxLinkLength();
  
  if (url.length > maxLinkLength) {
    return {
      type: 'length',
      severity: 'medium',
      message: `Lien trop long (${url.length} caractères, limite: ${maxLinkLength})`,
      impact: 20
    };
  }
  
  return null;
} 