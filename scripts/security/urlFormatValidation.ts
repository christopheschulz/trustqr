import { SecurityViolation } from './lengthValidation';

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