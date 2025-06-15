import { SecurityViolation } from './lengthValidation';

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