'use client';

import React, { useState } from 'react';
import {
  Search,
  User,
  Bell,
  MapPin,
  Plus
} from 'lucide-react';

interface Convention {
  id_convention: number;
  titre: string;
  type_convention: string;
  objet: string;
  reference_interne: string;
  statut: 'brouillon' | 'en_validation' | 'signe' | 'expire';
  date_signature: string | null;
  date_debut: string | null;
  date_fin: string | null;
  montant_engage: number;
  service_concerne: string;
  date_creation: string;
  derniere_mise_a_jour: string;
  // Relations PostgreSQL
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
}

export default function ConventionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'brouillon' | 'en_validation' | 'signe' | 'expire'>('all');
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedConvention, setSelectedConvention] = useState<Convention | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newConvention, setNewConvention] = useState({
    titre: '',
    type_convention: '',
    objet: '',
    reference_interne: '',
    date_debut: '',
    date_fin: '',
    montant_engage: '',
    service_concerne: '',
    partenaire_nom: '',
    partenaire_secteur: '',
    partenaire_pays: '',
    partenaire_contact: '',
    partenaire_email: '',
    responsable_nom: '',
    responsable_prenom: '',
    responsable_service: ''
  });

  const user = {
    name: "Admin 2iE",
    avatar: "👨‍💼",
    location: "Burkina Faso"
  };

  const notifications = 3;

  // Données des conventions (PostgreSQL format)
  const [conventions, setConventions] = useState<Convention[]>([
    {
      id_convention: 1,
      titre: "Convention de Coopération Académique",
      type_convention: "Académique",
      objet: "Échange d'étudiants et de professeurs, recherches conjointes",
      reference_interne: "CONV-2024-001",
      statut: "signe",
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
      }
    },
    {
      id_convention: 2,
      titre: "Partenariat Recherche Hydraulique",
      type_convention: "Recherche",
      objet: "Recherche sur l'irrigation intelligente en zone sahélienne",
      reference_interne: "CONV-2023-012",
      statut: "signe",
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
      }
    },
    {
      id_convention: 3,
      titre: "Convention Stage Étudiants",
      type_convention: "Formation",
      objet: "Programme de stages en ingénierie civile",
      reference_interne: "CONV-2024-025",
      statut: "en_validation",
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
      }
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
      }
    },
    {
      id_convention: 5,
      titre: "Convention Formation Continue",
      type_convention: "Formation",
      objet: "Formation continue en énergies renouvelables",
      reference_interne: "CONV-2023-055",
      statut: "signe",
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
      }
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
        evaluation_finale: "reussie"      }
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

  const showConventionDetails = (convention: Convention) => {
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
    setNewConvention({
      titre: '',
      type_convention: '',
      objet: '',
      reference_interne: '',
      date_debut: '',
      date_fin: '',
      montant_engage: '',
      service_concerne: '',
      partenaire_nom: '',
      partenaire_secteur: '',
      partenaire_pays: '',
      partenaire_contact: '',
      partenaire_email: '',
      responsable_nom: '',
      responsable_prenom: '',
      responsable_service: ''
    });
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
    
    const nouvelleConvention: Convention = {
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
      partenaire: {
        id_partenaire: conventions.length + 1,
        nom_organisation: newConvention.partenaire_nom,
        secteur: newConvention.partenaire_secteur,
        pays: newConvention.partenaire_pays,
        contact: newConvention.partenaire_contact,
        email_contact: newConvention.partenaire_email
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
      }
    };

    // Dans une vraie application, ceci serait un appel API
    setConventions(prev => [...prev, nouvelleConvention]);
    
    closeAddModal();
    
    // Notification de succès (optionnel)
    alert('Convention ajoutée avec succès !');
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'signe': return 'bg-green-100 text-green-700';
      case 'en_validation': return 'bg-yellow-100 text-yellow-700';
      case 'brouillon': return 'bg-blue-100 text-blue-700';
      case 'expire': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'signe': return 'Signée';
      case 'en_validation': return 'En validation';
      case 'brouillon': return 'Brouillon';
      case 'expire': return 'Expirée';
      default: return statut;
    }
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
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
                onClick={() => window.location.href = '/'}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm font-medium transition-colors"
              >
                Tableau de bord
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg bg-[#023047] text-white text-sm font-medium">
                Conventions
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm font-medium transition-colors">
                Partenaires
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm font-medium transition-colors">
                Rapports
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center space-x-2 mb-3">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{notifications}</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <a 
              href="/login"
              className="block w-full text-center px-3 py-2 bg-gray-400 text-white text-sm rounded-lg hover:bg-gray-500 transition-all duration-200"
            >
              Déconnexion
            </a>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher conventions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter Options */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex space-x-2">
                  {['all', 'signe', 'en_validation', 'brouillon', 'expire'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status as 'all' | 'brouillon' | 'en_validation' | 'signe' | 'expire')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedStatus === status
                          ? 'bg-[#023047] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status === 'all' ? 'Toutes' : 
                       status === 'signe' ? 'Signées' :
                       status === 'en_validation' ? 'En validation' :
                       status === 'brouillon' ? 'Brouillons' : 'Expirées'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-green-700">{conventions.filter(c => c.statut === 'signe').length}</div>
                  <div className="text-base text-green-600 font-medium">Signées</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-yellow-700">{conventions.filter(c => c.statut === 'en_validation').length}</div>
                  <div className="text-base text-yellow-600 font-medium">En validation</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-blue-700">{conventions.filter(c => c.statut === 'brouillon').length}</div>
                  <div className="text-base text-blue-600 font-medium">Brouillons</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-gray-700">{conventions.length}</div>
                  <div className="text-base text-gray-600 font-medium">Total</div>
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
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{convention.titre}</h3>
                        <p className="text-xs text-gray-600">
                          {convention.partenaire.nom_organisation}
                        </p>
                      </div>

                      {/* Type and Value */}
                      <div className="mb-3">
                        <div className="text-xs text-gray-700 font-medium mb-1 bg-gray-100 px-2 py-1 rounded text-center">
                          {convention.type_convention}
                        </div>
                        <div className="text-sm font-bold text-[#023047]">{formatMontant(convention.montant_engage)}</div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">Progression</span>
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
                      <div className="mb-4 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Début: {convention.date_debut ? new Date(convention.date_debut).toLocaleDateString('fr-FR') : 'N/A'}</span>
                          <span>Fin: {convention.date_fin ? new Date(convention.date_fin).toLocaleDateString('fr-FR') : 'N/A'}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2 -mb-2">
                        <button 
                          onClick={() => showConventionDetails(convention)}
                          className="text-black text-sm font-medium bg-gray-100 px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-300 hover:text-gray-800 transition-all duration-200 transform hover:scale-105"
                        >
                          Voir détails
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
                  <h3 className="text-lg font-bold text-gray-800">{selectedConvention.titre}</h3>
                  <p className="text-sm text-gray-600">{selectedConvention.partenaire.nom_organisation}</p>
                  <p className="text-xs text-gray-500">Réf: {selectedConvention.reference_interne}</p>
                </div>
                <button 
                  onClick={closeDetailsPopup}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Contenu du popup */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Informations générales</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Type:</span> {selectedConvention.type_convention}</div>
                    <div><span className="font-medium">Montant:</span> {formatMontant(selectedConvention.montant_engage)}</div>
                    <div><span className="font-medium">Statut:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedConvention.statut)}`}>
                        {getStatusText(selectedConvention.statut)}
                      </span>
                    </div>
                    <div><span className="font-medium">Service:</span> {selectedConvention.service_concerne}</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Dates et progression</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Signature:</span> {selectedConvention.date_signature ? new Date(selectedConvention.date_signature).toLocaleDateString('fr-FR') : 'Non signée'}</div>
                    <div><span className="font-medium">Début:</span> {selectedConvention.date_debut ? new Date(selectedConvention.date_debut).toLocaleDateString('fr-FR') : 'N/A'}</div>
                    <div><span className="font-medium">Fin:</span> {selectedConvention.date_fin ? new Date(selectedConvention.date_fin).toLocaleDateString('fr-FR') : 'N/A'}</div>
                    <div><span className="font-medium">Documents:</span> {selectedConvention.documents_count}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Objet</h4>
                <p className="text-sm text-gray-700">{selectedConvention.objet}</p>
              </div>

              <div className="bg-white rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Partenaire</h4>
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
                  <h4 className="font-semibold text-gray-800 mb-2">Responsable</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Nom:</span> {selectedConvention.responsable.nom} {selectedConvention.responsable.prenom}</div>
                    <div><span className="font-medium">Service:</span> {selectedConvention.responsable.service}</div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Évaluation</h4>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-[#023047] h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${selectedConvention.evaluation?.taux_realisation || 0}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
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
                <h3 className="text-xl font-bold text-gray-800">Nouvelle Convention</h3>
                <button 
                  onClick={closeAddModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
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
                  <h4 className="font-semibold text-gray-800 text-lg">Informations générales</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="titre"
                      value={newConvention.titre}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047]"
                      placeholder="Titre de la convention"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de convention <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type_convention"
                      value={newConvention.type_convention}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047]"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Référence interne
                    </label>
                    <input
                      type="text"
                      name="reference_interne"
                      value={newConvention.reference_interne}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047]"
                      placeholder="Auto-générée si vide"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service concerné <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="service_concerne"
                      value={newConvention.service_concerne}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047]"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Montant engagé (FCFA)
                    </label>
                    <input
                      type="number"
                      name="montant_engage"
                      value={newConvention.montant_engage}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047]"
                      placeholder="0"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de début
                      </label>
                      <input
                        type="date"
                        name="date_debut"
                        value={newConvention.date_debut}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de fin
                      </label>
                      <input
                        type="date"
                        name="date_fin"
                        value={newConvention.date_fin}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047]"
                      />
                    </div>
                  </div>
                </div>

                {/* Informations partenaire */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 text-lg">Informations partenaire</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de l&apos;organisation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="partenaire_nom"
                      value={newConvention.partenaire_nom}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047]"
                      placeholder="Nom du partenaire"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secteur
                    </label>
                    <input
                      type="text"
                      name="partenaire_secteur"
                      value={newConvention.partenaire_secteur}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047]"
                      placeholder="Secteur d'activité"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pays
                    </label>
                    <input
                      type="text"
                      name="partenaire_pays"
                      value={newConvention.partenaire_pays}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047]"
                      placeholder="Pays du partenaire"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact
                    </label>
                    <input
                      type="text"
                      name="partenaire_contact"
                      value={newConvention.partenaire_contact}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047]"
                      placeholder="Nom du contact"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email du contact
                    </label>
                    <input
                      type="email"
                      name="partenaire_email"
                      value={newConvention.partenaire_email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047]"
                      placeholder="email@partenaire.com"
                    />
                  </div>

                  <h4 className="font-semibold text-gray-800 text-lg mt-6">Responsable 2iE</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="responsable_nom"
                        value={newConvention.responsable_nom}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047]"
                        placeholder="Nom du responsable"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom
                      </label>
                      <input
                        type="text"
                        name="responsable_prenom"
                        value={newConvention.responsable_prenom}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047]"
                        placeholder="Prénom du responsable"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service du responsable
                    </label>
                    <input
                      type="text"
                      name="responsable_service"
                      value={newConvention.responsable_service}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047]"
                      placeholder="Service du responsable"
                    />
                  </div>
                </div>
              </div>

              {/* Objet de la convention */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objet de la convention <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="objet"
                  value={newConvention.objet}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047]"
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
    </div>
  );
}
