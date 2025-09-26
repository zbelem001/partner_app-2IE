'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Prospect } from '../types/database';

// Interface pour une convention avec données prospect
interface ConventionWithProspect {
  id_convention: number;
  titre: string;
  type_convention: string;
  objet: string;
  statut: 'brouillon' | 'en_signature' | 'validee' | 'rejetee' | 'expire';
  date_signature?: string;
  prospect_origine?: Prospect;
  partenaire_id?: number;
  partenariat_id?: number;
}

// Interface pour un partenaire créé depuis un prospect
interface PartenaireFromProspect {
  id_partenaire: number;
  nom_organisation: string;
  secteur: string;
  pays: string;
  contact: string;
  email_contact: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  prospect_origine_id?: number;
  convention_signature_id?: number;
  date_creation: string;
}

// Interface pour un partenariat actif
interface PartenariatActif {
  id_partenariat: number;
  titre: string;
  description: string;
  type: string;
  statut: 'actif' | 'en_pause' | 'termine';
  date_debut: string;
  date_fin?: string;
  partenaire_id: number;
  convention_origine_id: number;
}

interface WorkflowContextType {
  // Conversion prospect → convention
  createConventionFromProspect: (prospect: Prospect) => ConventionWithProspect;
  
  // Création partenaire lors signature convention
  createPartenaireFromConvention: (convention: ConventionWithProspect) => PartenaireFromProspect;
  
  // Création partenariat lors signature convention
  createPartenariatFromConvention: (convention: ConventionWithProspect, partenaire: PartenaireFromProspect) => PartenariatActif;
  
  // Données partagées
  conventions: ConventionWithProspect[];
  partenaires: PartenaireFromProspect[];
  partenariats: PartenariatActif[];
  
  // Actions de mise à jour
  setConventions: React.Dispatch<React.SetStateAction<ConventionWithProspect[]>>;
  setPartenaires: React.Dispatch<React.SetStateAction<PartenaireFromProspect[]>>;
  setPartenariats: React.Dispatch<React.SetStateAction<PartenariatActif[]>>;
  
  // Liens entre entités
  getConventionsByProspectId: (prospectId: number) => ConventionWithProspect[];
  getPartenaireByConventionId: (conventionId: number) => PartenaireFromProspect | null;
  getPartenariatsByPartenaire: (partenaireId: number) => PartenariatActif[];
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conventions, setConventions] = useState<ConventionWithProspect[]>([]);
  const [partenaires, setPartenaires] = useState<PartenaireFromProspect[]>([]);
  const [partenariats, setPartenariats] = useState<PartenariatActif[]>([]);

  // Fonction de conversion prospect → convention
  const createConventionFromProspect = useCallback((prospect: Prospect): ConventionWithProspect => {
    const nouveauId = conventions.length + 1;
    
    const nouvelleConvention: ConventionWithProspect = {
      id_convention: nouveauId,
      titre: `Convention ${prospect.nom_organisation}`,
      type_convention: getTypeConventionByProspect(prospect),
      objet: `Collaboration avec ${prospect.nom_organisation} - ${prospect.secteur}`,
      statut: 'brouillon',
      prospect_origine: prospect
    };

    setConventions(prev => [...prev, nouvelleConvention]);
    return nouvelleConvention;
  }, [conventions.length]);

  // Fonction de création partenaire depuis convention signée
  const createPartenaireFromConvention = useCallback((convention: ConventionWithProspect): PartenaireFromProspect => {
    const nouveauId = partenaires.length + 1;
    const prospect = convention.prospect_origine;

    if (!prospect) {
      throw new Error('Convention sans prospect d\'origine');
    }

    const nouveauPartenaire: PartenaireFromProspect = {
      id_partenaire: nouveauId,
      nom_organisation: prospect.nom_organisation,
      secteur: prospect.secteur,
      pays: prospect.pays,
      contact: prospect.contact || '',
      email_contact: prospect.email_contact || '',
      statut: 'actif',
      prospect_origine_id: prospect.id_prospect,
      convention_signature_id: convention.id_convention,
      date_creation: new Date().toISOString()
    };

    setPartenaires(prev => [...prev, nouveauPartenaire]);
    
    // Marquer la convention comme ayant un partenaire
    setConventions(prev => prev.map(c => 
      c.id_convention === convention.id_convention
        ? { ...c, partenaire_id: nouveauPartenaire.id_partenaire }
        : c
    ));

    return nouveauPartenaire;
  }, [partenaires.length]);

  // Fonction de création partenariat depuis convention signée
  const createPartenariatFromConvention = useCallback((convention: ConventionWithProspect, partenaire: PartenaireFromProspect): PartenariatActif => {
    const nouveauId = partenariats.length + 1;

    const nouveauPartenariat: PartenariatActif = {
      id_partenariat: nouveauId,
      titre: convention.titre,
      description: convention.objet,
      type: convention.type_convention,
      statut: 'actif',
      date_debut: convention.date_signature || new Date().toISOString(),
      partenaire_id: partenaire.id_partenaire,
      convention_origine_id: convention.id_convention
    };

    setPartenariats(prev => [...prev, nouveauPartenariat]);
    
    // Marquer la convention comme ayant un partenariat
    setConventions(prev => prev.map(c => 
      c.id_convention === convention.id_convention
        ? { ...c, partenariat_id: nouveauPartenariat.id_partenariat }
        : c
    ));

    return nouveauPartenariat;
  }, [partenariats.length]);

  // Fonctions de recherche
  const getConventionsByProspectId = (prospectId: number): ConventionWithProspect[] => {
    return conventions.filter(c => c.prospect_origine?.id_prospect === prospectId);
  };

  const getPartenaireByConventionId = (conventionId: number): PartenaireFromProspect | null => {
    return partenaires.find(p => p.convention_signature_id === conventionId) || null;
  };

  const getPartenariatsByPartenaire = (partenaireId: number): PartenariatActif[] => {
    return partenariats.filter(p => p.partenaire_id === partenaireId);
  };

  // Logique automatique : quand une convention est signée
  useEffect(() => {
    conventions.forEach(convention => {
      if (convention.statut === 'validee' && convention.date_signature && !convention.partenaire_id) {
        // Créer automatiquement le partenaire
        const nouveauPartenaire = createPartenaireFromConvention(convention);
        
        // Créer automatiquement le partenariat
        createPartenariatFromConvention(convention, nouveauPartenaire);
      }
    });
  }, [conventions]);

  const contextValue: WorkflowContextType = {
    createConventionFromProspect,
    createPartenaireFromConvention,
    createPartenariatFromConvention,
    conventions,
    partenaires,
    partenariats,
    setConventions,
    setPartenaires,
    setPartenariats,
    getConventionsByProspectId,
    getPartenaireByConventionId,
    getPartenariatsByPartenaire
  };

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};

// Fonction utilitaire pour déterminer le type de convention selon le prospect
function getTypeConventionByProspect(prospect: Prospect): string {
  switch (prospect.secteur.toLowerCase()) {
    case 'enseignement supérieur':
      return 'Convention académique';
    case 'recherche':
    case 'recherche agricole':
      return 'Convention de recherche';
    case 'industrie':
      return 'Convention industrielle';
    case 'technologies vertes':
    case 'technologie':
      return 'Convention innovation';
    case 'finance/développement':
      return 'Convention financement';
    default:
      return 'Convention générale';
  }
}
