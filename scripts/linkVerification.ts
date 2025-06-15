import {
    SecurityViolation,
    checkBlacklist,
    checkExcessiveParams,
    checkHighEntropy,
    checkLinkLength,
    checkProtocol,
    checkSuspiciousChars,
    checkSuspiciousDomain,
    checkUrlFormat
} from './security/validations';

/**
 * Types pour la vérification des liens
 */
export interface LinkVerificationResult {
  isValid: boolean;
  isLink: boolean;
  errorMessage: string;
  canVerify: boolean;
  displayData: string;
  trustScore?: number;
  securityLevel?: 'safe' | 'suspect' | 'dangerous';
  violations?: SecurityViolation[];
}



/**
 * Analyse la sécurité d'un lien et retourne un score de confiance
 */
export async function getTrustScore(url: string): Promise<{ score: number; violations: SecurityViolation[] }> {
  const violations: SecurityViolation[] = [];
  let score = 100; // Score initial parfait
  
  try {
    // 1. Vérification de la longueur
    const lengthViolation = await checkLinkLength(url);
    if (lengthViolation) {
      violations.push(lengthViolation);
      score -= lengthViolation.impact;
    }
    
    // 2. Vérification du format de l'URL
    const { parsedUrl, violation: formatViolation } = checkUrlFormat(url);
    if (formatViolation) {
      violations.push(formatViolation);
      score -= formatViolation.impact;
      return { score: Math.max(0, score), violations };
    }
    
    if (!parsedUrl) {
      return { score: 0, violations };
    }
    
    // 3. Vérification du protocole HTTPS
    const protocolViolation = checkProtocol(parsedUrl);
    if (protocolViolation) {
      violations.push(protocolViolation);
      score -= protocolViolation.impact;
    }
    
    // 4. Vérification de la blacklist
    const blacklistViolation = checkBlacklist(parsedUrl.hostname);
    if (blacklistViolation) {
      violations.push(blacklistViolation);
      score -= blacklistViolation.impact;
    }
    
    // 5. Vérification des domaines suspects
    const domainViolation = checkSuspiciousDomain(parsedUrl.hostname);
    if (domainViolation) {
      violations.push(domainViolation);
      score -= domainViolation.impact;
    }
    
    // 6. Vérification des paramètres excessifs
    const paramsViolation = checkExcessiveParams(parsedUrl);
    if (paramsViolation) {
      violations.push(paramsViolation);
      score -= paramsViolation.impact;
    }
    
    // 7. Vérification des caractères suspects
    const charsViolation = checkSuspiciousChars(url);
    if (charsViolation) {
      violations.push(charsViolation);
      score -= charsViolation.impact;
    }
    
    // 8. Vérification de l'entropie
    const entropyViolation = checkHighEntropy(parsedUrl);
    if (entropyViolation) {
      violations.push(entropyViolation);
      score -= entropyViolation.impact;
    }
    
  } catch (error) {
    const errorViolation: SecurityViolation = {
      type: 'malformed',
      severity: 'high',
      message: 'Erreur lors de l\'analyse',
      impact: 50
    };
    violations.push(errorViolation);
    score -= errorViolation.impact;
  }
  
  return { score: Math.max(0, score), violations };
}

/**
 * Détermine le niveau de sécurité basé sur le score
 */
export function getSecurityLevel(score: number): 'safe' | 'suspect' | 'dangerous' {
  if (score >= 80) return 'safe';
  if (score >= 50) return 'suspect';
  return 'dangerous';
}

/**
 * Vérifie si un lien est sûr (fonction simple)
 */
export async function isLinkSafe(url: string): Promise<boolean> {
  const { score } = await getTrustScore(url);
  return score >= 80;
}

/**
 * Vérifie si un lien peut être analysé pour la sécurité
 * @param data - Les données scannées
 * @returns Résultat de la vérification avec toutes les informations nécessaires
 */
export const verifyLinkForSecurity = async (data: string): Promise<LinkVerificationResult> => {
  // Vérification de base : est-ce que c'est une chaîne valide ?
  if (!data || typeof data !== 'string') {
    return {
      isValid: false,
      isLink: false,
      errorMessage: 'Aucune donnée détectée dans le QR code',
      canVerify: false,
      displayData: 'Aucune donnée détectée dans le QR code',
    };
  }
  
  // Analyse de sécurité complète
  const { score, violations } = await getTrustScore(data);
  const securityLevel = getSecurityLevel(score);
  
  // Sur la page résultats : on peut toujours vérifier (sauf si pas de données)
  // La vraie logique de sécurité sera sur la page vérifications
  const canVerify = true;
  const isValidLink = violations.length === 0;
  
  // Toujours afficher le lien original
  const displayData = data;
  
  return {
    isValid: isValidLink,
    isLink: true,
    errorMessage: violations.length > 0 ? violations[0].message : '',
    canVerify,
    displayData,
    trustScore: score,
    securityLevel,
    violations,
  };
};

/**
 * Détermine le texte à afficher sur le bouton de vérification
 * @param verificationResult - Résultat de la vérification
 * @returns Le texte approprié pour le bouton
 */
export const getVerificationButtonText = (verificationResult: LinkVerificationResult): string => {
  if (verificationResult.canVerify) {
    return "Vérifier lien";
  }
  
  // Messages simples pour le bouton selon le type d'erreur
  if (verificationResult.errorMessage.includes('caractères')) {
    return "lien trop long";
  }
  
  if (verificationResult.errorMessage.includes('mal formée')) {
    return "format invalide";
  }
  
  return "impossible à vérifier";
};

/**
 * Détermine si le bouton de vérification doit être actif
 * @param verificationResult - Résultat de la vérification
 * @returns true si le bouton doit être actif, false sinon
 */
export const isVerificationButtonEnabled = (verificationResult: LinkVerificationResult): boolean => {
  return verificationResult.canVerify;
}; 