// Script temporaire pour ajouter les propriétés manquantes aux conventions
const fs = require('fs');

// Propriétés à ajouter pour chaque convention
const addValidationProps = (conventionId, statut) => {
  let validations, etape_courante, progression_validation;
  
  if (statut === 'brouillon') {
    validations = [];
    etape_courante = 1;
    progression_validation = 0;
  } else if (statut === 'en_signature') {
    validations = [
      `{ id_validation: ${conventionId}1, convention_id: ${conventionId}, etape: { id_etape: 1, nom_etape: "Direction concernée", description: "Validation par la direction du service concerné", ordre: 1, service_responsable: "Direction concernée", statut: 'validee', date_validation: "2024-11-01T09:00:00Z", valideur: { nom: "KONE", prenom: "Ibrahim", service: "Direction" }, commentaire: "Approuvé" }, statut: 'validee', date_validation: "2024-11-01T09:00:00Z", valideur: { id_utilisateur: 2, nom: "KONE", prenom: "Ibrahim", service: "Direction" }, commentaire: "Approuvé" }`,
      `{ id_validation: ${conventionId}2, convention_id: ${conventionId}, etape: { id_etape: 2, nom_etape: "SRECIP", description: "Service Relations Extérieures & Coopération Internationale Partenariats", ordre: 2, service_responsable: "SRECIP", statut: 'en_attente', date_validation: null, valideur: null, commentaire: null }, statut: 'en_attente', date_validation: null, valideur: null, commentaire: null }`
    ];
    etape_courante = 2;
    progression_validation = 14;
  } else if (statut === 'validee') {
    validations = [];
    etape_courante = 8;
    progression_validation = 100;
  } else if (statut === 'rejetee') {
    validations = [
      `{ id_validation: ${conventionId}1, convention_id: ${conventionId}, etape: { id_etape: 1, nom_etape: "Direction concernée", description: "Validation par la direction du service concerné", ordre: 1, service_responsable: "Direction concernée", statut: 'rejetee', date_validation: "2024-11-01T09:00:00Z", valideur: { nom: "KONE", prenom: "Ibrahim", service: "Direction" }, commentaire: "Rejeté" }, statut: 'rejetee', date_validation: "2024-11-01T09:00:00Z", valideur: { id_utilisateur: 2, nom: "KONE", prenom: "Ibrahim", service: "Direction" }, commentaire: "Rejeté" }`
    ];
    etape_courante = 1;
    progression_validation = 0;
  } else {
    validations = [];
    etape_courante = 8;
    progression_validation = 100;
  }
  
  return `
      validations: [${Array.isArray(validations) ? validations.join(',') : ''}],
      etape_courante: ${etape_courante},
      progression_validation: ${progression_validation}`;
};

console.log("Script prêt - utilisez addValidationProps(id, statut) pour chaque convention");
