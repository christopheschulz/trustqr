import { SecurityViolation } from './lengthValidation';

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