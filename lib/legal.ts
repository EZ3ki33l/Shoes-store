/**
 * Informations légales centralisées pour les pages mentions / CGV / RGPD / cookies.
 * Remplacer les placeholders `[À COMPLÉTER]` avant mise en production.
 */

export const legal = {
  siteName: 'AT Chaussures',
  siteUrl: 'https://[À COMPLÉTER]',

  company: {
    name: '[À COMPLÉTER — raison sociale]',
    legalForm: '[À COMPLÉTER — forme juridique, ex. SAS, SARL]',
    shareCapital: '[À COMPLÉTER — capital social]',
    address: '[À COMPLÉTER — adresse du siège social]',
    siret: '[À COMPLÉTER — n° SIRET]',
    rcs: '[À COMPLÉTER — RCS Ville + n°]',
    vatNumber: '[À COMPLÉTER — n° TVA intracommunautaire]',
  },

  publicationDirector: '[À COMPLÉTER — nom du directeur de la publication]',

  contact: {
    email: '[À COMPLÉTER — email]',
    phone: '[À COMPLÉTER — téléphone]',
  },

  host: {
    name: '[À COMPLÉTER — nom de l’hébergeur]',
    address: '[À COMPLÉTER — adresse de l’hébergeur]',
    phone: '[À COMPLÉTER — téléphone de l’hébergeur]',
  },

  mediator: {
    name: '[À COMPLÉTER — nom du médiateur de la consommation]',
    website: '[À COMPLÉTER — URL du médiateur]',
    address: '[À COMPLÉTER — adresse du médiateur]',
  },

  lastUpdated: '5 août 2026',
} as const
