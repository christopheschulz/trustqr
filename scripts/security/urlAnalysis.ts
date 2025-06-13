import { SecurityViolation } from './basicValidation';

/**
 * Caractères suspects
 */
const SUSPICIOUS_CHARS = ['%', '@', '#', '&', '?', '=', '+', '~', '^', '|', '<', '>'];

/**
 * Calcule l'entropie d'une chaîne (mesure du caractère aléatoire)
 */
function calculateEntropy(str: string): number {
  const charCount = new Map<string, number>();
  
  // Compter les occurrences de chaque caractère
  for (const char of str.toLowerCase()) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }
  
  // Calculer l'entropie de Shannon
  let entropy = 0;
  const length = str.length;
  
  for (const count of charCount.values()) {
    const probability = count / length;
    entropy -= probability * Math.log2(probability);
  }
  
  // Normaliser entre 0 et 1
  const maxEntropy = Math.log2(length);
  return maxEntropy > 0 ? entropy / maxEntropy : 0;
}

/**
 * Vérifie si l'URL a trop de paramètres
 */
export function checkExcessiveParams(parsedUrl: URL): SecurityViolation | null {
  const paramCount = Array.from(parsedUrl.searchParams.keys()).length;
  
  if (paramCount > 5) {
    return {
      type: 'excessive_params',
      severity: 'low',
      message: `Trop de paramètres (${paramCount})`,
      impact: 15
    };
  }
  
  return null;
}

/**
 * Vérifie la présence de caractères suspects
 */
export function checkSuspiciousChars(url: string): SecurityViolation | null {
  const suspiciousCharCount = SUSPICIOUS_CHARS.reduce((count, char) => {
    return count + (url.split(char).length - 1);
  }, 0);
  
  if (suspiciousCharCount > 10) {
    return {
      type: 'suspicious_chars',
      severity: 'medium',
      message: `Caractères suspects nombreux (${suspiciousCharCount})`,
      impact: 25
    };
  }
  
  return null;
}

/**
 * Vérifie l'entropie de l'URL (détection de chaînes aléatoires)
 */
export function checkHighEntropy(parsedUrl: URL): SecurityViolation | null {
  const pathAndQuery = parsedUrl.pathname + parsedUrl.search;
  const pathEntropy = calculateEntropy(pathAndQuery);
  
  if (pathEntropy > 0.7 && pathAndQuery.length > 20) {
    return {
      type: 'high_entropy',
      severity: 'medium',
      message: 'Chaîne aléatoire détectée',
      impact: 20
    };
  }
  
  return null;
} 