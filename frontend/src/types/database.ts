export interface Prospect {
  id_prospect: number;
  nom_organisation: string;
  secteur: string;
  pays: string;
  contact?: string;
  email_contact?: string;
  telephone_contact?: string;
  statut: 'nouveau' | 'en_contact' | 'qualifie' | 'abandonne';
  potentiel_partenariat: 'faible' | 'moyen' | 'eleve';
  notes?: string;
  utilisateur_id: number;
  date_creation: string;
  derniere_mise_a_jour: string;
}

export interface Convention {
  id_convention: number;
  partenariats_id: number;
  titre: string;
  type_convention: string;
  objet: string;
  reference_interne?: string;
  statut: 'brouillon' | 'en_cours' | 'signee' | 'active' | 'suspendue' | 'terminee' | 'annulee';
  date_signature?: string;
  date_debut?: string;
  date_fin?: string;
  montant_engage?: number;
  service_concerne: string;
  responsable_id: number;
  date_creation: string;
  derniere_mise_a_jour: string;
}

export interface Partner {
  id_partenaire: number;
  nom_organisation: string;
  type_organisation: string;
  secteur_activite: string;
  pays: string;
  ville: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  site_web?: string;
  description?: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  date_creation: string;
  derniere_mise_a_jour: string;
}

export interface Partenariat {
  id_partenariat: number;
  partenaire_id: number;
  titre: string;
  description: string;
  type_partenariat: string;
  statut: 'en_cours' | 'actif' | 'suspendu' | 'termine';
  date_debut: string;
  date_fin?: string;
  responsable_2ie: number;
  date_creation: string;
  derniere_mise_a_jour: string;
}
