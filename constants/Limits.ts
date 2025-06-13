/**
 * Constantes définissant les limites de l'application
 */

export const Limits = {
  /**
   * Longueur maximale autorisée pour un lien (en caractères)
   */
  MAX_LINK_LENGTH: 200,

  /**
   * Longueur recommandée pour un lien (en caractères)
   */
  RECOMMENDED_LINK_LENGTH: 150,

  /**
   * Longueur maximale pour l'affichage des données dans les cards
   */
  MAX_DISPLAY_LENGTH: 500,

  /**
   * Nombre maximum de scans récents à conserver
   */
  MAX_RECENT_SCANS: 50,
} as const; 