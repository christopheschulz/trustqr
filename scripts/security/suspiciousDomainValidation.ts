import { SecurityViolation } from './lengthValidation';

/**
 * Mots-clés suspects dans les domaines
 */
const SUSPICIOUS_KEYWORDS = [
  'login', 'secure', 'verify', 'account', 'suspended', 'urgent', 'confirm',
  'update', 'billing', 'payment', 'security', 'alert', 'warning', 'expired'
];

/**
 * Marques connues pour détecter le typosquatting
 */
const KNOWN_BRANDS = [
  'paypal', 'amazon', 'google', 'apple', 'microsoft', 'facebook', 'instagram',
  'twitter', 'linkedin', 'netflix', 'spotify', 'dropbox', 'github', 'gitlab'
];

/**
 * Vérifie si un domaine ressemble à une marque connue (typosquatting)
 */
function detectTyposquatting(domain: string): boolean {
  const cleanDomain = domain.toLowerCase().replace(/[-._]/g, '');
  
  for (const brand of KNOWN_BRANDS) {
    // Vérifier si le domaine contient la marque avec des caractères supplémentaires
    if (cleanDomain.includes(brand) && cleanDomain !== brand) {
      // Calculer la distance de Levenshtein simplifiée
      const similarity = brand.length / cleanDomain.length;
      if (similarity > 0.6 && similarity < 1) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Vérifie si un domaine contient des éléments suspects
 */
export function checkSuspiciousDomain(hostname: string): SecurityViolation | null {
  const hasSuspiciousKeyword = SUSPICIOUS_KEYWORDS.some(keyword => 
    hostname.toLowerCase().includes(keyword)
  );
  
  if (hasSuspiciousKeyword || detectTyposquatting(hostname)) {
    return {
      type: 'suspicious_domain',
      severity: 'medium',
      message: 'Domaine suspect détecté',
      impact: 30
    };
  }
  
  return null;
} 