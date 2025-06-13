import { getMaxLinkLength } from '../preferences';

/**
 * Types pour les violations de sécurité
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

/**
 * Vérifie si l'URL est bien formée
 */
export function checkUrlFormat(url: string): { parsedUrl: URL | null; violation: SecurityViolation | null } {
  try {
    const parsedUrl = new URL(url);
    return { parsedUrl, violation: null };
  } catch {
    return {
      parsedUrl: null,
      violation: {
        type: 'malformed',
        severity: 'high',
        message: 'URL mal formée',
        impact: 50
      }
    };
  }
}

/**
 * Vérifie le protocole HTTPS
 */
export function checkProtocol(parsedUrl: URL): SecurityViolation | null {
  if (parsedUrl.protocol !== 'https:') {
    return {
      type: 'protocol',
      severity: 'high',
      message: 'Protocole non sécurisé (HTTP)',
      impact: 40
    };
  }
  
  return null;
} 