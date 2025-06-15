import { SecurityViolation } from './lengthValidation';

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