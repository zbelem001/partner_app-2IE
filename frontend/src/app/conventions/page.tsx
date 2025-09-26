'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import {
  Search,
  User,
  Bell,
  MapPin,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  FileText,
  Users,
  Trash2
} from 'lucide-react';

// Interface pour les étapes de validation
interface EtapeValidation {
  id_etape: number;
  nom_etape: string;
  description: string;
  ordre: number;
  service_responsable: string;
  statut: 'en_attente' | 'validee' | 'rejetee';
  date_validation: string | null;
  valideur: {
    nom: string;
    prenom: string;
    service: string;
  } | null;
  commentaire: string | null;
}

// Interface pour les validations d'une convention spécifique
interface ValidationConvention {
  id_validation: number;
  convention_id: number;
  etape: EtapeValidation;
  statut: 'en_attente' | 'validee' | 'rejetee';
  date_validation: string | null;
  valideur: {
    id_utilisateur: number;
    nom: string;
    prenom: string;
    service: string;
  } | null;
  commentaire: string | null;
}

// Interface mise à jour pour les conventions avec circuit de validation
interface ConventionWithRelations {
  id_convention: number;
  titre: string;
  type_convention: string;
  objet: string;
  reference_interne: string;
  statut: 'brouillon' | 'en_signature' | 'validee' | 'rejetee' | 'expire';
  date_signature: string | null;
  date_debut: string | null;
  date_fin: string | null;
  montant_engage: number;
  service_concerne: string;
  date_creation: string;
  derniere_mise_a_jour: string;
  // Relations existantes
  partenaire: {
    id_partenaire: number;
    nom_organisation: string;
    secteur: string;
    pays: string;
    contact: string;
    email_contact: string;
  };
  responsable: {
    id_utilisateur: number;
    nom: string;
    prenom: string;
    service: string;
  } | null;
  documents_count: number;
  evaluation?: {
    taux_realisation: number;
    evaluation_finale: string;
  };
  // Nouveau : Circuit de validation
  validations: ValidationConvention[];
  etape_courante: number; // Numéro de l'étape en cours
  progression_validation: number; // Pourcentage de progression (0-100)
}

export default function ConventionsPage() {
  const router = useRouter();
  const { displayUser } = useAuth();

  // Vérification de l'authentification
  useEffect(() => {
    // Vérifier que nous sommes côté client
    if (typeof window !== 'undefined') {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (!isAuthenticated) {
        router.push('/');
      }
    }
  }, [router]);

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    router.push('/');
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'brouillon' | 'en_signature' | 'validee' | 'rejetee' | 'expire'>('all');
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedConvention, setSelectedConvention] = useState<ConventionWithRelations | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationAction, setValidationAction] = useState<'valider' | 'rejeter' | null>(null);
  const [validationComment, setValidationComment] = useState('');
  const [selectedProspectId, setSelectedProspectId] = useState<number | null>(null);
  const [newConvention, setNewConvention] = useState({
    titre: '',
    type_convention: '',
    objet: '',
    reference_interne: '',
    date_debut: '',
    date_fin: '',
    montant_engage: '',
    service_concerne: '',
    prospect_id: null as number | null,
    responsable_nom: '',
    responsable_prenom: '',
    responsable_service: ''
  });

  // Utiliser les informations utilisateur du hook d'authentification
  const user = {
    name: displayUser.name,
    avatar: displayUser.avatar,
    location: "Burkina Faso"
  };

  const notifications = 3;

  // Circuit de validation standard - Étapes prédéfinies
  const etapesValidationStandard: EtapeValidation[] = [
    {
      id_etape: 1,
      nom_etape: "Direction concernée",
      description: "Validation par la direction du service concerné",
      ordre: 1,
      service_responsable: "Direction concernée",
      statut: 'en_attente',
      date_validation: null,
      valideur: null,
      commentaire: null
    },
    {
      id_etape: 2,
      nom_etape: "SRECIP",
      description: "Service Relations Extérieures & Coopération Internationale Partenariats",
      ordre: 2,
      service_responsable: "SRECIP",
      statut: 'en_attente',
      date_validation: null,
      valideur: null,
      commentaire: null
    },
    {
      id_etape: 3,
      nom_etape: "DFC",
      description: "Direction Financière & Comptable",
      ordre: 3,
      service_responsable: "DFC",
      statut: 'en_attente',
      date_validation: null,
      valideur: null,
      commentaire: null
    },
    {
      id_etape: 4,
      nom_etape: "CAQ",
      description: "Contrôle Assurance Qualité",
      ordre: 4,
      service_responsable: "CAQ",
      statut: 'en_attente',
      date_validation: null,
      valideur: null,
      commentaire: null
    },
    {
      id_etape: 5,
      nom_etape: "DG",
      description: "Directeur Général",
      ordre: 5,
      service_responsable: "Direction Générale",
      statut: 'en_attente',
      date_validation: null,
      valideur: null,
      commentaire: null
    },
    {
      id_etape: 6,
      nom_etape: "Transmission partenaire",
      description: "Transmission au partenaire pour signature",
      ordre: 6,
      service_responsable: "SRECIP",
      statut: 'en_attente',
      date_validation: null,
      valideur: null,
      commentaire: null
    },
    {
      id_etape: 7,
      nom_etape: "Archivage",
      description: "Archivage de la convention signée",
      ordre: 7,
      service_responsable: "Archives",
      statut: 'en_attente',
      date_validation: null,
      valideur: null,
      commentaire: null
    }
  ];

  // Liste des prospects disponibles (du plus récent au plus ancien)
  const availableProspects = [
    {
      id_prospect: 6,
      nom_organisation: "Université Cheikh Anta Diop - Extension",
      secteur: "Enseignement Supérieur",
      pays: "Sénégal",
      contact: "Prof. Fatou Sow",
      email_contact: "f.sow@ucad.edu.sn",
      date_creation: "2024-11-10T15:30:00Z"
    },
    {
      id_prospect: 2,
      nom_organisation: "African Development Bank",
      secteur: "Finance/Développement", 
      pays: "Côte d'Ivoire",
      contact: "M. Kwame Asante",
      email_contact: "k.asante@afdb.org",
      date_creation: "2024-11-01T09:00:00Z"
    },
    {
      id_prospect: 1,
      nom_organisation: "École Polytechnique de Montréal",
      secteur: "Enseignement Supérieur",
      pays: "Canada", 
      contact: "Dr. Marie Tremblay",
      email_contact: "m.tremblay@polymtl.ca",
      date_creation: "2024-10-15T10:00:00Z"
    },
    {
      id_prospect: 4,
      nom_organisation: "Institut de Recherche Agricole du Sénégal",
      secteur: "Recherche Agricole",
      pays: "Sénégal",
      contact: "Dr. Mamadou Ba", 
      email_contact: "m.ba@isra.sn",
      date_creation: "2024-08-10T08:30:00Z"
    }
  ];

  // Fonctions utilitaires pour le circuit de validation
  const creerValidationsInitiales = (conventionId: number): ValidationConvention[] => {
    return etapesValidationStandard.map(etape => ({
      id_validation: conventionId * 10 + etape.ordre,
      convention_id: conventionId,
      etape: { ...etape },
      statut: 'en_attente' as const,
      date_validation: null,
      valideur: null,
      commentaire: null
    }));
  };

  // Fonction pour générer des validations simplifiées selon le statut
  const genererValidationsParStatut = (conventionId: number, statut: string): ValidationConvention[] => {
    if (statut === 'brouillon') return [];
    
    if (statut === 'en_signature') {
      return [
        {
          id_validation: conventionId * 10 + 1,
          convention_id: conventionId,
          etape: { id_etape: 1, nom_etape: "Direction concernée", description: "Validation par la direction du service concerné", ordre: 1, service_responsable: "Direction concernée", statut: 'validee', date_validation: "2024-11-01T09:00:00Z", valideur: { nom: "KONE", prenom: "Ibrahim", service: "Direction" }, commentaire: "Approuvé" },
          statut: 'validee',
          date_validation: "2024-11-01T09:00:00Z",
          valideur: { id_utilisateur: 2, nom: "KONE", prenom: "Ibrahim", service: "Direction" },
          commentaire: "Approuvé"
        },
        {
          id_validation: conventionId * 10 + 2,
          convention_id: conventionId,
          etape: { id_etape: 2, nom_etape: "SRECIP", description: "Service Relations Extérieures & Coopération Internationale Partenariats", ordre: 2, service_responsable: "SRECIP", statut: 'en_attente', date_validation: null, valideur: null, commentaire: null },
          statut: 'en_attente',
          date_validation: null,
          valideur: null,
          commentaire: null
        }
      ];
    }
    
    return []; // Pour les conventions validées, rejetées ou expirées
  };

  const calculerProgressionValidation = (validations: ValidationConvention[]): number => {
    const validees = validations.filter(v => v.statut === 'validee').length;
    return Math.round((validees / validations.length) * 100);
  };

  const obtenirEtapeCourante = (validations: ValidationConvention[]): number => {
    const premierEtapeEnAttente = validations.find(v => v.statut === 'en_attente');
    return premierEtapeEnAttente ? premierEtapeEnAttente.etape.ordre : validations.length + 1;
  };

  const lancerCircuitValidation = (conventionId: number) => {
    setConventions(prev => prev.map(conv => 
      conv.id_convention === conventionId 
        ? { 
            ...conv, 
            statut: 'en_signature' as const,
            derniere_mise_a_jour: new Date().toISOString()
          }
        : conv
    ));
  };

  // Données des conventions (PostgreSQL format)
  const [conventions, setConventions] = useState<ConventionWithRelations[]>([
    {
      id_convention: 1,
      titre: "Convention de Coopération Académique",
      type_convention: "Académique",
      objet: "Échange d'étudiants et de professeurs, recherches conjointes",
      reference_interne: "CONV-2024-001",
      statut: "validee",
      date_signature: "2024-01-15",
      date_debut: "2024-01-15",
      date_fin: "2026-01-15",
      montant_engage: 98400000,
      service_concerne: "Relations Internationales",
      date_creation: "2024-01-10T10:00:00Z",
      derniere_mise_a_jour: "2024-11-20T14:30:00Z",
      partenaire: {
        id_partenaire: 1,
        nom_organisation: "Université de Paris",
        secteur: "Enseignement Supérieur",
        pays: "France",
        contact: "Dr. Marie Dupont",
        email_contact: "marie.dupont@univ-paris.fr"
      },
      responsable: {
        id_utilisateur: 1,
        nom: "OUEDRAOGO",
        prenom: "Amadou",
        service: "SRECIP"
      },
      documents_count: 12,
      evaluation: {
        taux_realisation: 75,
        evaluation_finale: "en_cours"
      },
      // Circuit de validation - Toutes les étapes validées
      validations: [
        {
          id_validation: 11,
          convention_id: 1,
          etape: { id_etape: 1, nom_etape: "Direction concernée", description: "Validation par la direction du service concerné", ordre: 1, service_responsable: "Direction concernée", statut: 'validee', date_validation: "2024-01-11T09:00:00Z", valideur: { nom: "KONE", prenom: "Ibrahim", service: "Relations Internationales" }, commentaire: "Convention approuvée" },
          statut: 'validee',
          date_validation: "2024-01-11T09:00:00Z",
          valideur: { id_utilisateur: 2, nom: "KONE", prenom: "Ibrahim", service: "Relations Internationales" },
          commentaire: "Convention approuvée"
        },
        {
          id_validation: 12,
          convention_id: 1,
          etape: { id_etape: 2, nom_etape: "SRECIP", description: "Service Relations Extérieures & Coopération Internationale Partenariats", ordre: 2, service_responsable: "SRECIP", statut: 'validee', date_validation: "2024-01-12T10:30:00Z", valideur: { nom: "OUEDRAOGO", prenom: "Amadou", service: "SRECIP" }, commentaire: "Validé pour signature" },
          statut: 'validee',
          date_validation: "2024-01-12T10:30:00Z",
          valideur: { id_utilisateur: 1, nom: "OUEDRAOGO", prenom: "Amadou", service: "SRECIP" },
          commentaire: "Validé pour signature"
        },
        {
          id_validation: 13,
          convention_id: 1,
          etape: { id_etape: 3, nom_etape: "DFC", description: "Direction Financière & Comptable", ordre: 3, service_responsable: "DFC", statut: 'validee', date_validation: "2024-01-13T14:00:00Z", valideur: { nom: "SAVADOGO", prenom: "Marie", service: "DFC" }, commentaire: "Budget validé" },
          statut: 'validee',
          date_validation: "2024-01-13T14:00:00Z",
          valideur: { id_utilisateur: 3, nom: "SAVADOGO", prenom: "Marie", service: "DFC" },
          commentaire: "Budget validé"
        },
        {
          id_validation: 14,
          convention_id: 1,
          etape: { id_etape: 4, nom_etape: "CAQ", description: "Contrôle Assurance Qualité", ordre: 4, service_responsable: "CAQ", statut: 'validee', date_validation: "2024-01-14T11:15:00Z", valideur: { nom: "TRAORE", prenom: "Salia", service: "CAQ" }, commentaire: "Conforme aux standards" },
          statut: 'validee',
          date_validation: "2024-01-14T11:15:00Z",
          valideur: { id_utilisateur: 4, nom: "TRAORE", prenom: "Salia", service: "CAQ" },
          commentaire: "Conforme aux standards"
        },
        {
          id_validation: 15,
          convention_id: 1,
          etape: { id_etape: 5, nom_etape: "DG", description: "Directeur Général", ordre: 5, service_responsable: "Direction Générale", statut: 'validee', date_validation: "2024-01-15T08:30:00Z", valideur: { nom: "ZERBO", prenom: "Boukary", service: "Direction Générale" }, commentaire: "Approuvé par la DG" },
          statut: 'validee',
          date_validation: "2024-01-15T08:30:00Z",
          valideur: { id_utilisateur: 5, nom: "ZERBO", prenom: "Boukary", service: "Direction Générale" },
          commentaire: "Approuvé par la DG"
        },
        {
          id_validation: 16,
          convention_id: 1,
          etape: { id_etape: 6, nom_etape: "Transmission partenaire", description: "Transmission au partenaire pour signature", ordre: 6, service_responsable: "SRECIP", statut: 'validee', date_validation: "2024-01-15T15:00:00Z", valideur: { nom: "OUEDRAOGO", prenom: "Amadou", service: "SRECIP" }, commentaire: "Transmis et signé" },
          statut: 'validee',
          date_validation: "2024-01-15T15:00:00Z",
          valideur: { id_utilisateur: 1, nom: "OUEDRAOGO", prenom: "Amadou", service: "SRECIP" },
          commentaire: "Transmis et signé"
        },
        {
          id_validation: 17,
          convention_id: 1,
          etape: { id_etape: 7, nom_etape: "Archivage", description: "Archivage de la convention signée", ordre: 7, service_responsable: "Archives", statut: 'validee', date_validation: "2024-01-16T09:00:00Z", valideur: { nom: "DIABATE", prenom: "Fatou", service: "Archives" }, commentaire: "Archivé" },
          statut: 'validee',
          date_validation: "2024-01-16T09:00:00Z",
          valideur: { id_utilisateur: 6, nom: "DIABATE", prenom: "Fatou", service: "Archives" },
          commentaire: "Archivé"
        }
      ],
      etape_courante: 8, // Toutes les étapes terminées
      progression_validation: 100
    },
    {
      id_convention: 2,
      titre: "Partenariat Recherche Hydraulique",
      type_convention: "Recherche",
      objet: "Recherche sur l'irrigation intelligente en zone sahélienne",
      reference_interne: "CONV-2023-012",
      statut: "validee",
      date_signature: "2023-09-01",
      date_debut: "2023-09-01",
      date_fin: "2025-09-01",
      montant_engage: 55760000,
      service_concerne: "Recherche et Innovation",
      date_creation: "2023-08-15T09:00:00Z",
      derniere_mise_a_jour: "2024-11-18T16:45:00Z",
      partenaire: {
        id_partenaire: 2,
        nom_organisation: "CIRAD",
        secteur: "Recherche Agricole",
        pays: "France",
        contact: "Dr. Jean Martin",
        email_contact: "j.martin@cirad.fr"
      },
      responsable: {
        id_utilisateur: 2,
        nom: "KONE",
        prenom: "Salimata",
        service: "Recherche"
      },
      documents_count: 8,
      evaluation: {
        taux_realisation: 60,
        evaluation_finale: "en_cours"
      },
      validations: [], // Circuit déjà terminé
      etape_courante: 8,
      progression_validation: 100
    },
    {
      id_convention: 3,
      titre: "Convention Stage Étudiants",
      type_convention: "Formation",
      objet: "Programme de stages en ingénierie civile",
      reference_interne: "CONV-2024-025",
      statut: "en_signature",
      date_signature: null,
      date_debut: "2024-03-01",
      date_fin: "2025-03-01",
      montant_engage: 29520000,
      service_concerne: "Formation",
      date_creation: "2024-02-20T11:00:00Z",
      derniere_mise_a_jour: "2024-11-15T10:20:00Z",
      partenaire: {
        id_partenaire: 3,
        nom_organisation: "EIFFAGE",
        secteur: "BTP",
        pays: "France",
        contact: "M. Pierre Dubois",
        email_contact: "p.dubois@eiffage.com"
      },
      responsable: {
        id_utilisateur: 3,
        nom: "TRAORE",
        prenom: "Moussa",
        service: "Formation"
      },
      documents_count: 5,
      evaluation: {
        taux_realisation: 25,
        evaluation_finale: "en_cours"
      },
      validations: [
        { id_validation: 31, convention_id: 3, etape: { id_etape: 1, nom_etape: "Direction concernée", description: "Validation par la direction du service concerné", ordre: 1, service_responsable: "Direction concernée", statut: 'validee', date_validation: "2024-02-25T09:00:00Z", valideur: { nom: "TRAORE", prenom: "Moussa", service: "Formation" }, commentaire: "Approuvé" }, statut: 'validee', date_validation: "2024-02-25T09:00:00Z", valideur: { id_utilisateur: 3, nom: "TRAORE", prenom: "Moussa", service: "Formation" }, commentaire: "Approuvé" },
        { id_validation: 32, convention_id: 3, etape: { id_etape: 2, nom_etape: "SRECIP", description: "Service Relations Extérieures & Coopération Internationale Partenariats", ordre: 2, service_responsable: "SRECIP", statut: 'en_attente', date_validation: null, valideur: null, commentaire: null }, statut: 'en_attente', date_validation: null, valideur: null, commentaire: null }
      ],
      etape_courante: 2,
      progression_validation: 14
    },
    {
      id_convention: 4,
      titre: "Accord Échange Technologique",
      type_convention: "Technologie",
      objet: "Transfert de technologies énergétiques durables",
      reference_interne: "CONV-2024-040",
      statut: "brouillon",
      date_signature: null,
      date_debut: "2024-06-01",
      date_fin: "2027-06-01",
      montant_engage: 131200000,
      service_concerne: "Innovation",
      date_creation: "2024-05-10T14:00:00Z",
      derniere_mise_a_jour: "2024-11-10T09:15:00Z",
      partenaire: {
        id_partenaire: 4,
        nom_organisation: "Mines ParisTech",
        secteur: "Enseignement Supérieur",
        pays: "France",
        contact: "Prof. Claire Leroy",
        email_contact: "c.leroy@mines-paristech.fr"
      },
      responsable: {
        id_utilisateur: 4,
        nom: "SAWADOGO",
        prenom: "Fatimata",
        service: "Innovation"
      },
      documents_count: 3,
      evaluation: {
        taux_realisation: 10,
        evaluation_finale: "en_cours"
      },
      validations: [],
      etape_courante: 1,
      progression_validation: 0
    },
    {
      id_convention: 5,
      titre: "Convention Formation Continue",
      type_convention: "Formation",
      objet: "Formation continue en énergies renouvelables",
      reference_interne: "CONV-2023-055",
      statut: "validee",
      date_signature: "2023-11-01",
      date_debut: "2023-11-01",
      date_fin: "2024-11-01",
      montant_engage: 49200000,
      service_concerne: "Formation Continue",
      date_creation: "2023-10-15T13:30:00Z",
      derniere_mise_a_jour: "2024-11-22T08:45:00Z",
      partenaire: {
        id_partenaire: 5,
        nom_organisation: "TOTAL ENERGIES",
        secteur: "Énergie",
        pays: "France",
        contact: "Mme. Sophie Bernard",
        email_contact: "s.bernard@totalenergies.com"
      },
      responsable: {
        id_utilisateur: 5,
        nom: "ZONGO",
        prenom: "Ibrahim",
        service: "Formation Continue"
      },
      documents_count: 15,
      evaluation: {
        taux_realisation: 90,
        evaluation_finale: "reussie"
      },
      validations: [],
      etape_courante: 8,
      progression_validation: 100
    },
    {
      id_convention: 6,
      titre: "Partenariat Innovation Agricole",
      type_convention: "Recherche",
      objet: "Développement de solutions agricoles innovantes",
      reference_interne: "CONV-2022-080",
      statut: "expire",
      date_signature: "2022-01-01",
      date_debut: "2022-01-01",
      date_fin: "2024-01-01",
      montant_engage: 78720000,
      service_concerne: "Recherche Agricole",
      date_creation: "2021-12-01T10:00:00Z",
      derniere_mise_a_jour: "2024-01-01T23:59:00Z",
      partenaire: {
        id_partenaire: 6,
        nom_organisation: "CGIAR",
        secteur: "Recherche Agricole",
        pays: "International",
        contact: "Dr. Ahmed Hassan",
        email_contact: "a.hassan@cgiar.org"
      },
      responsable: {
        id_utilisateur: 6,
        nom: "OUATTARA",
        prenom: "Adama",
        service: "Recherche"
      },
      documents_count: 20,
      evaluation: {
        taux_realisation: 100,
        evaluation_finale: "reussie"
      },
      validations: [],
      etape_courante: 8,
      progression_validation: 100
    }
  ]);

  // Filtrage des conventions
  const filteredConventions = conventions.filter(convention => {
    const matchesSearch = convention.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         convention.partenaire.nom_organisation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         convention.type_convention.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || convention.statut === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const showConventionDetails = (convention: ConventionWithRelations) => {
    setSelectedConvention(convention);
    setShowDetailsPopup(true);
  };

  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedConvention(null);
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setSelectedProspectId(null);
    setNewConvention({
      titre: '',
      type_convention: '',
      objet: '',
      reference_interne: '',
      date_debut: '',
      date_fin: '',
      montant_engage: '',
      service_concerne: '',
      prospect_id: null,
      responsable_nom: '',
      responsable_prenom: '',
      responsable_service: ''
    });
  };

  const handleProspectSelection = (prospectId: number) => {
    setSelectedProspectId(prospectId);
    const selectedProspect = availableProspects.find(p => p.id_prospect === prospectId);
    if (selectedProspect) {
      setNewConvention(prev => ({
        ...prev,
        prospect_id: prospectId,
        titre: `Convention avec ${selectedProspect.nom_organisation}`
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewConvention(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateReference = () => {
    const year = new Date().getFullYear();
    const count = conventions.length + 1;
    return `CONV-${year}-${count.toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Générer automatiquement la référence si elle n'est pas fournie
    const reference = newConvention.reference_interne || generateReference();
    
    const nouvelleConvention: ConventionWithRelations = {
      id_convention: conventions.length + 1,
      titre: newConvention.titre,
      type_convention: newConvention.type_convention,
      objet: newConvention.objet,
      reference_interne: reference,
      statut: 'brouillon',
      date_signature: null,
      date_debut: newConvention.date_debut || null,
      date_fin: newConvention.date_fin || null,
      montant_engage: parseFloat(newConvention.montant_engage) || 0,
      service_concerne: newConvention.service_concerne,
      date_creation: new Date().toISOString(),
      derniere_mise_a_jour: new Date().toISOString(),
      partenaire: selectedProspectId ? (() => {
        const selectedProspect = availableProspects.find(p => p.id_prospect === selectedProspectId);
        return selectedProspect ? {
          id_partenaire: selectedProspectId,
          nom_organisation: selectedProspect.nom_organisation,
          secteur: selectedProspect.secteur,
          pays: selectedProspect.pays,
          contact: selectedProspect.contact,
          email_contact: selectedProspect.email_contact
        } : {
          id_partenaire: conventions.length + 1,
          nom_organisation: "Organisation inconnue",
          secteur: "",
          pays: "",
          contact: "",
          email_contact: ""
        }
      })() : {
        id_partenaire: conventions.length + 1,
        nom_organisation: "Organisation inconnue",
        secteur: "",
        pays: "",
        contact: "",
        email_contact: ""
      },
      responsable: newConvention.responsable_nom ? {
        id_utilisateur: 1,
        nom: newConvention.responsable_nom,
        prenom: newConvention.responsable_prenom,
        service: newConvention.responsable_service
      } : null,
      documents_count: 0,
      evaluation: {
        taux_realisation: 0,
        evaluation_finale: "en_cours"
      },
      validations: [],
      etape_courante: 1,
      progression_validation: 0
    };

    // Dans une vraie application, ceci serait un appel API
    setConventions(prev => [...prev, nouvelleConvention]);
    
    closeAddModal();
    
    // Notification de succès (optionnel)
    alert('Convention ajoutée avec succès !');
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'validee': return 'bg-green-100 text-green-700';
      case 'en_signature': return 'bg-yellow-100 text-yellow-700';
      case 'brouillon': return 'bg-blue-100 text-blue-700';
      case 'rejetee': return 'bg-red-100 text-red-700';
      case 'expire': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-black';
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'validee': return 'Validée';
      case 'en_signature': return 'En signature';
      case 'brouillon': return 'Brouillon';
      case 'rejetee': return 'Rejetée';
      case 'expire': return 'Expirée';
      default: return statut;
    }
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  const deleteConvention = async (conventionId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette convention ? Cette action est irréversible.')) {
      try {
        // Appel à l'API pour supprimer la convention
        // await ConventionService.deleteConvention(conventionId);
        
        // Pour l'instant, on supprime juste de l'état local
        setConventions(prev => prev.filter(c => c.id_convention !== conventionId));
        alert('Convention supprimée avec succès !');
      } catch (error) {
        alert('Erreur lors de la suppression de la convention');
        console.error('Erreur:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Sidebar Navigation */}
      <div className="w-80 bg-white shadow-lg fixed left-4 top-4 h-[calc(100vh-2rem)] z-50 overflow-y-auto rounded-2xl">
        {/* User Info */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-2xl">{user.avatar}</div>
            <div>
              <h1 className="font-semibold text-black">Bonjour {user.name}</h1>
              <div className="flex items-center text-xs text-black">
                <MapPin className="w-3 h-3 mr-1" />
                {user.location}
              </div>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <div className="mb-4">
            <h2 className="font-semibold text-black mb-3">Navigation</h2>
            <div className="space-y-2">
              <button 
                onClick={() => router.push('/dashboard')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-black text-sm font-medium transition-colors"
              >
                Tableau de bord
              </button>
              <button 
                onClick={() => router.push('/prospects')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-black text-sm font-medium transition-colors"
              >
                Prospects
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg bg-[#023047] text-white text-sm font-medium">
                Conventions
              </button>
              <button 
                onClick={() => router.push('/partenaires')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-black text-sm font-medium transition-colors"
              >
                Partenaires
              </button>
              <button 
                onClick={() => router.push('/partenariats')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-black text-sm font-medium transition-colors"
              >
                Partenariats
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center space-x-2 mb-3">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-black" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{notifications}</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <User className="w-5 h-5 text-black" />
              </button>
            </div>
            <button 
              onClick={handleLogout}
              className="block w-full text-center px-3 py-2 bg-gray-400 text-white text-sm rounded-lg hover:bg-gray-500 transition-all duration-200"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - with proper margin to avoid overlap */}
      <div className="ml-[22rem]">
        {/* Top Header */}
        <div className="fixed top-4 right-4 left-[23rem] z-40">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="px-6 py-4">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" />
                <input
                  type="text"
                  placeholder="Rechercher conventions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                />
              </div>

              {/* Filter Options */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex space-x-2">
                  {['all', 'validee', 'en_signature', 'brouillon', 'rejetee', 'expire'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status as 'all' | 'brouillon' | 'en_signature' | 'validee' | 'rejetee' | 'expire')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedStatus === status
                          ? 'bg-[#023047] text-white'
                          : 'bg-gray-100 text-black hover:bg-gray-200'
                      }`}
                    >
                      {status === 'all' ? 'Toutes' : 
                       status === 'validee' ? 'Validées' :
                       status === 'en_signature' ? 'En signature' :
                       status === 'brouillon' ? 'Brouillons' : 
                       status === 'rejetee' ? 'Rejetées' : 'Expirées'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-green-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-green-700">{conventions.filter(c => c.statut === 'validee').length}</div>
                  <div className="text-base text-green-600 font-medium">Validées</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-yellow-700">{conventions.filter(c => c.statut === 'en_signature').length}</div>
                  <div className="text-base text-yellow-600 font-medium">En signature</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-blue-700">{conventions.filter(c => c.statut === 'brouillon').length}</div>
                  <div className="text-base text-blue-600 font-medium">Brouillons</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-red-700">{conventions.filter(c => c.statut === 'rejetee').length}</div>
                  <div className="text-base text-red-600 font-medium">Rejetées</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-black">{conventions.length}</div>
                  <div className="text-base text-black font-medium">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conventions Section - Fixed with scrollable content */}
        <div className="fixed top-64 right-4 left-[23rem] bottom-4 z-30">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col">
            {/* Header fixe */}
            <div className="p-6 pb-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-black text-xl">
                  Conventions ({filteredConventions.length})
                </h2>
                <button 
                  onClick={openAddModal}
                  className="px-4 py-2 bg-[#023047] text-white rounded-lg hover:bg-[#0f4c5c] transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle</span>
                </button>
              </div>
            </div>

            {/* Contenu défilable */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {filteredConventions.map((convention) => (
                  <div key={convention.id_convention} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#023047] transition-all duration-200 shadow-sm hover:shadow-md">
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-[#023047] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{convention.documents_count}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(convention.statut)}`}>
                          {getStatusText(convention.statut)}
                        </div>
                      </div>

                      {/* Title and Partner */}
                      <div className="mb-3">
                        <h3 className="font-semibold text-black text-sm mb-1 line-clamp-2">{convention.titre}</h3>
                        <p className="text-xs text-black">
                          {convention.partenaire.nom_organisation}
                        </p>
                      </div>

                      {/* Type and Value */}
                      <div className="mb-3">
                        <div className="text-xs text-black font-medium mb-1 bg-gray-100 px-2 py-1 rounded text-center">
                          {convention.type_convention}
                        </div>
                        <div className="text-sm font-bold text-[#023047]">{formatMontant(convention.montant_engage)}</div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-black">Progression</span>
                          <span className="text-xs font-medium">{convention.evaluation?.taux_realisation || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#023047] h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${convention.evaluation?.taux_realisation || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="mb-4 text-xs text-black">
                        <div className="flex justify-between">
                          <span>Début: {convention.date_debut ? new Date(convention.date_debut).toLocaleDateString('fr-FR') : 'N/A'}</span>
                          <span>Fin: {convention.date_fin ? new Date(convention.date_fin).toLocaleDateString('fr-FR') : 'N/A'}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2 -mb-2">
                        <button 
                          onClick={() => showConventionDetails(convention)}
                          className="text-black text-sm font-medium bg-gray-100 px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-300 hover:text-black transition-all duration-200 transform hover:scale-105"
                        >
                          Voir détails
                        </button>
                        <button 
                          onClick={() => deleteConvention(convention.id_convention)}
                          className="text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded-xl cursor-pointer hover:bg-red-100 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup des détails de la convention */}
      {showDetailsPopup && selectedConvention && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-gray-200 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header du popup */}
            <div className="p-6 border-b border-gray-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-black">{selectedConvention.titre}</h3>
                  <p className="text-sm text-black">{selectedConvention.partenaire.nom_organisation}</p>
                  <p className="text-xs text-black">Réf: {selectedConvention.reference_interne}</p>
                </div>
                <button 
                  onClick={closeDetailsPopup}
                  className="text-black hover:text-black text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Contenu du popup */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Informations générales</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium text-gray-700">Type:</span> <span className="text-gray-900">{selectedConvention.type_convention}</span></div>
                    <div><span className="font-medium text-gray-700">Montant:</span> <span className="text-gray-900">{formatMontant(selectedConvention.montant_engage)}</span></div>
                    <div><span className="font-medium text-gray-700">Statut:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedConvention.statut)}`}>
                        {getStatusText(selectedConvention.statut)}
                      </span>
                    </div>
                    <div><span className="font-medium text-gray-700">Service:</span> <span className="text-gray-900">{selectedConvention.service_concerne}</span></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Dates et progression</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium text-gray-700">Signature:</span> <span className="text-gray-900">{selectedConvention.date_signature ? new Date(selectedConvention.date_signature).toLocaleDateString('fr-FR') : 'Non signée'}</span></div>
                    <div><span className="font-medium text-gray-700">Début:</span> <span className="text-gray-900">{selectedConvention.date_debut ? new Date(selectedConvention.date_debut).toLocaleDateString('fr-FR') : 'N/A'}</span></div>
                    <div><span className="font-medium text-gray-700">Fin:</span> <span className="text-gray-900">{selectedConvention.date_fin ? new Date(selectedConvention.date_fin).toLocaleDateString('fr-FR') : 'N/A'}</span></div>
                    <div><span className="font-medium text-gray-700">Documents:</span> <span className="text-gray-900">{selectedConvention.documents_count}</span></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Objet</h4>
                <p className="text-sm text-gray-800">{selectedConvention.objet}</p>
              </div>

              {/* Circuit de validation */}
              <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Circuit de validation</h4>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-800">
                      Progression: {selectedConvention.progression_validation}%
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#023047] h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${selectedConvention.progression_validation}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {selectedConvention.statut === 'brouillon' ? (
                  <div className="text-center py-6">
                    <Clock className="mx-auto mb-2 text-gray-400" size={32} />
                    <p className="text-gray-600 mb-4">Circuit de validation non démarré</p>
                    <button 
                      onClick={() => lancerCircuitValidation(selectedConvention.id_convention)}
                      className="bg-[#023047] text-white px-4 py-2 rounded-lg hover:bg-[#0f4c5c] transition-colors"
                    >
                      <PlayCircle className="inline mr-2" size={16} />
                      Lancer le circuit
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {etapesValidationStandard.map((etape) => {
                      const validation = selectedConvention.validations.find(v => v.etape.ordre === etape.ordre);
                      const isActive = selectedConvention.etape_courante === etape.ordre;
                      const isCompleted = validation && validation.statut === 'validee';
                      const isRejected = validation && validation.statut === 'rejetee';
                      
                      return (
                        <div key={etape.id_etape} className={`flex items-center p-3 rounded-lg border-2 transition-all ${
                          isActive ? 'border-blue-300 bg-blue-50' :
                          isCompleted ? 'border-green-300 bg-green-50' :
                          isRejected ? 'border-red-300 bg-red-50' :
                          'border-gray-200 bg-gray-50'
                        }`}>
                          
                          {/* Icône de statut */}
                          <div className="mr-3">
                            {isCompleted ? (
                              <CheckCircle className="text-green-600" size={20} />
                            ) : isRejected ? (
                              <XCircle className="text-red-600" size={20} />
                            ) : isActive ? (
                              <Clock className="text-blue-600" size={20} />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                            )}
                          </div>

                          {/* Contenu de l'étape */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-gray-900">{etape.nom_etape}</h5>
                                <p className="text-xs text-gray-600">{etape.description}</p>
                                {validation && validation.valideur && (
                                  <p className="text-xs text-gray-800 mt-1">
                                    {validation.statut === 'validee' ? 'Validé' : 'Rejeté'} par {validation.valideur.prenom} {validation.valideur.nom} 
                                    {validation.date_validation && ` le ${new Date(validation.date_validation).toLocaleDateString('fr-FR')}`}
                                  </p>
                                )}
                                {validation && validation.commentaire && (
                                  <p className="text-xs text-gray-700 italic mt-1">&ldquo;{validation.commentaire}&rdquo;</p>
                                )}
                              </div>
                              
                              {/* Actions pour étape active */}
                              {isActive && selectedConvention.statut === 'en_signature' && (
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => {
                                      setValidationAction('valider');
                                      setShowValidationModal(true);
                                    }}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                                  >
                                    Valider
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setValidationAction('rejeter');
                                      setShowValidationModal(true);
                                    }}
                                    className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                                  >
                                    Rejeter
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-black mb-2">Partenaire</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Organisation:</span> {selectedConvention.partenaire.nom_organisation}</div>
                  <div><span className="font-medium">Secteur:</span> {selectedConvention.partenaire.secteur}</div>
                  <div><span className="font-medium">Pays:</span> {selectedConvention.partenaire.pays}</div>
                  <div><span className="font-medium">Contact:</span> {selectedConvention.partenaire.contact}</div>
                  <div><span className="font-medium">Email:</span> {selectedConvention.partenaire.email_contact}</div>
                </div>
              </div>

              {selectedConvention.responsable && (
                <div className="bg-white rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-black mb-2">Responsable</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Nom:</span> {selectedConvention.responsable.nom} {selectedConvention.responsable.prenom}</div>
                    <div><span className="font-medium">Service:</span> {selectedConvention.responsable.service}</div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl p-4">
                <h4 className="font-semibold text-black mb-2">Évaluation</h4>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-[#023047] h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${selectedConvention.evaluation?.taux_realisation || 0}%` }}
                  ></div>
                </div>
                <p className="text-sm text-black mt-2">
                  Taux de réalisation: {selectedConvention.evaluation?.taux_realisation || 0}%
                  {selectedConvention.evaluation?.evaluation_finale && (
                    <span className="ml-2">({selectedConvention.evaluation.evaluation_finale})</span>
                  )}
                </p>
              </div>
            </div>

            {/* Footer du popup */}
            <div className="p-6 border-t border-gray-300 flex justify-end space-x-3">
              <button
                onClick={closeDetailsPopup}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout de convention */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">Nouvelle Convention</h3>
                <button 
                  onClick={closeAddModal}
                  className="text-black hover:text-black text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Informations générales */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-black text-lg">Informations générales</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Titre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="titre"
                      value={newConvention.titre}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                      placeholder="Titre de la convention"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Type de convention <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type_convention"
                      value={newConvention.type_convention}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="Académique">Académique</option>
                      <option value="Recherche">Recherche</option>
                      <option value="Formation">Formation</option>
                      <option value="Technologie">Technologie</option>
                      <option value="Innovation">Innovation</option>
                      <option value="Partenariat">Partenariat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Référence interne
                    </label>
                    <input
                      type="text"
                      name="reference_interne"
                      value={newConvention.reference_interne}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                      placeholder="Auto-générée si vide"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Service concerné <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="service_concerne"
                      value={newConvention.service_concerne}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                    >
                      <option value="">Sélectionner un service</option>
                      <option value="SRECIP">SRECIP</option>
                      <option value="Relations Internationales">Relations Internationales</option>
                      <option value="Recherche et Innovation">Recherche et Innovation</option>
                      <option value="Formation">Formation</option>
                      <option value="Formation Continue">Formation Continue</option>
                      <option value="Innovation">Innovation</option>
                      <option value="Recherche Agricole">Recherche Agricole</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Montant engagé (FCFA)
                    </label>
                    <input
                      type="number"
                      name="montant_engage"
                      value={newConvention.montant_engage}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                      placeholder="0"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Date de début
                      </label>
                      <input
                        type="date"
                        name="date_debut"
                        value={newConvention.date_debut}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Date de fin
                      </label>
                      <input
                        type="date"
                        name="date_fin"
                        value={newConvention.date_fin}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Associer prospect */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-black text-lg">Associer prospect</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Sélectionner un prospect (optionnel)
                    </label>
                    <select
                      value={selectedProspectId || ''}
                      onChange={(e) => handleProspectSelection(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                    >
                      <option value="">Choisir un prospect... (optionnel)</option>
                      {availableProspects.map((prospect) => (
                        <option key={prospect.id_prospect} value={prospect.id_prospect}>
                          {prospect.nom_organisation} - {prospect.pays} ({prospect.contact})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedProspectId && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">Informations du prospect sélectionné</h5>
                      {(() => {
                        const selectedProspect = availableProspects.find(p => p.id_prospect === selectedProspectId);
                        return selectedProspect ? (
                          <div className="text-sm text-blue-700 space-y-1">
                            <p><strong>Organisation:</strong> {selectedProspect.nom_organisation}</p>
                            <p><strong>Secteur:</strong> {selectedProspect.secteur}</p>
                            <p><strong>Pays:</strong> {selectedProspect.pays}</p>
                            <p><strong>Contact:</strong> {selectedProspect.contact}</p>
                            <p><strong>Email:</strong> {selectedProspect.email_contact}</p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>

                {/* Responsable 2iE */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-black text-lg">Responsable 2iE</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="responsable_nom"
                        value={newConvention.responsable_nom}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                        placeholder="Nom du responsable"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Prénom
                      </label>
                      <input
                        type="text"
                        name="responsable_prenom"
                        value={newConvention.responsable_prenom}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                        placeholder="Prénom du responsable"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Service du responsable
                    </label>
                    <input
                      type="text"
                      name="responsable_service"
                      value={newConvention.responsable_service}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                      placeholder="Service du responsable"
                    />
                  </div>
                </div>
              </div>

              {/* Objet de la convention */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-black mb-1">
                  Objet de la convention <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="objet"
                  value={newConvention.objet}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                  placeholder="Décrivez l'objet et les objectifs de la convention..."
                />
              </div>

              {/* Boutons */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#023047] text-white rounded-lg hover:bg-[#0f4c5c] transition-colors"
                >
                  Créer la convention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de validation/rejet */}
      {showValidationModal && validationAction && selectedConvention && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-black mb-4">
              {validationAction === 'valider' ? 'Valider' : 'Rejeter'} l&apos;étape
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Étape courante: {etapesValidationStandard.find(e => e.ordre === selectedConvention.etape_courante)?.nom_etape}
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-2">
                Commentaire {validationAction === 'rejeter' ? '(obligatoire)' : '(optionnel)'}
              </label>
              <textarea
                value={validationComment}
                onChange={(e) => setValidationComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                placeholder={validationAction === 'valider' ? 
                  "Commentaire sur la validation..." : 
                  "Motif du rejet (obligatoire)..."
                }
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowValidationModal(false);
                  setValidationAction(null);
                  setValidationComment('');
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (validationAction === 'rejeter' && !validationComment.trim()) {
                    alert('Un commentaire est obligatoire pour rejeter une étape');
                    return;
                  }
                  // Ici on traiterait la validation/rejet
                  console.log(`${validationAction} avec commentaire: ${validationComment}`);
                  setShowValidationModal(false);
                  setValidationAction(null);
                  setValidationComment('');
                }}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  validationAction === 'valider' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {validationAction === 'valider' ? 'Valider' : 'Rejeter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
