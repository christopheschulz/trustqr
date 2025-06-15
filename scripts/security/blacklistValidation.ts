import { SecurityViolation } from './lengthValidation';

/**
 * Blacklist de domaines suspects
 */
const BLACKLISTED_DOMAINS = new Set([
  // Raccourcisseurs d'URL
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly',
  'short.link', 'tiny.cc', 'rb.gy', 'cutt.ly', 'linktr.ee',
  
  // Domaines de phishing connus
  'paypa1.com', 'paypal-secure.com', 'paypal-verification.com',
  'amazon-security.com', 'apple-id-verification.com', 'microsoft-account.com',
  'google-security.com', 'facebook-security.com', 'instagram-verify.com',
  
  // Domaines suspects génériques
  'secure-login.com', 'account-verify.com', 'login-secure.com',
  'verification-required.com', 'account-suspended.com'
]);

/**
 * Vérifie si un domaine est en liste noire
 */
export function checkBlacklist(hostname: string): SecurityViolation | null {
  if (BLACKLISTED_DOMAINS.has(hostname.toLowerCase())) {
    return {
      type: 'blacklist',
      severity: 'high',
      message: `Domaine en liste noire: ${hostname}`,
      impact: 60
    };
  }
  
  return null;
} 