/**
 * Modules de sécurité - Point d'entrée centralisé
 * Exporte toutes les fonctions de validation de sécurité
 */

// Types et validation de longueur
export { SecurityViolation, checkLinkLength } from './lengthValidation';

// Validation du format d'URL
export { checkUrlFormat } from './urlFormatValidation';

// Validation du protocole HTTPS
export { checkProtocol } from './protocolValidation';

// Validation contre la blacklist
export { checkBlacklist } from './blacklistValidation';

// Validation des domaines suspects
export { checkSuspiciousDomain } from './suspiciousDomainValidation';

// Validation des paramètres excessifs
export { checkExcessiveParams } from './parametersValidation';

// Validation des caractères suspects
export { checkSuspiciousChars } from './charactersValidation';

// Validation de l'entropie
export { checkHighEntropy } from './entropyValidation';
