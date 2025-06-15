import { SecurityViolation } from './lengthValidation';

/**
 * Caractères suspects
 */
const SUSPICIOUS_CHARS = ['%', '@', '#', '&', '?', '=', '+', '~', '^', '|', '<', '>'];

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