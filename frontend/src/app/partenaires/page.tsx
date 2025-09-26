'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import {
  Search,
  User,
  Bell,
  MapPin,
  Eye,
  Building,
  Mail,
  Phone,
  Globe,
  FileText,
  Calendar,
  ArrowRight,
  Trash2
} from 'lucide-react';

// Interface pour les partenaires
interface Partenaire {
  id_partenaire: number;
  nom_organisation: string;
  secteur: string;
  pays: string;
  adresse?: string;
  site_web?: string;
  contact: string;
  email_contact: string;
  telephone_contact?: string;
  prospect_id?: number;
}

// Interface étendue pour les partenaires avec données additionnelles
interface PartenaireWithExtras extends Partenaire {
  date_creation: string;
  derniere_mise_a_jour: string;
  conventions_signees: number;
  partenariats_actifs: number;
  prospect_origine?: {
    nom_organisation: string;
    date_conversion: string;
  };
}

export default function PartenairesPage() {
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
  const [selectedSecteur, setSelectedSecteur] = useState<'all' | string>('all');
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedPartenaire, setSelectedPartenaire] = useState<PartenaireWithExtras | null>(null);

  // Utiliser les informations utilisateur du hook d'authentification
  const user = {
    name: displayUser.name,
    avatar: displayUser.avatar,
    location: "Burkina Faso"
  };

  const notifications = 3;

  // Données des partenaires (créés automatiquement lors de convention signée)
  const [partenaires, setPartenaires] = useState<PartenaireWithExtras[]>([
    {
      id_partenaire: 1,
      nom_organisation: "École Polytechnique de Montréal",
      secteur: "Enseignement Supérieur",
      pays: "Canada",
      adresse: "2900 Boulevard Édouard-Montpetit, Montréal, QC H3T 1J4, Canada",
      site_web: "https://www.polymtl.ca",
      contact: "Dr. Marie Tremblay",
      email_contact: "m.tremblay@polymtl.ca",
      telephone_contact: "+1-514-340-4711",
      prospect_id: 1,
      date_creation: "2024-11-25T10:00:00Z",
      derniere_mise_a_jour: "2024-11-25T10:00:00Z",
      conventions_signees: 2,
      partenariats_actifs: 1,
      prospect_origine: {
        nom_organisation: "École Polytechnique de Montréal",
        date_conversion: "2024-11-25T10:00:00Z"
      }
    },
    {
      id_partenaire: 2,
      nom_organisation: "African Development Bank",
      secteur: "Finance/Développement",
      pays: "Côte d'Ivoire",
      adresse: "Rue Joseph Anoma, 01 BP 1387 Abidjan 01, Côte d'Ivoire",
      site_web: "https://www.afdb.org",
      contact: "M. Kwame Asante",
      email_contact: "k.asante@afdb.org",
      telephone_contact: "+225-20-26-39-00",
      prospect_id: 2,
      date_creation: "2024-11-20T14:30:00Z",
      derniere_mise_a_jour: "2024-11-25T16:45:00Z",
      conventions_signees: 1,
      partenariats_actifs: 1,
      prospect_origine: {
        nom_organisation: "African Development Bank",
        date_conversion: "2024-11-20T14:30:00Z"
      }
    },
    {
      id_partenaire: 3,
      nom_organisation: "Institut de Recherche Agricole du Sénégal",
      secteur: "Recherche Agricole", 
      pays: "Sénégal",
      adresse: "Route des Hydrocarbures, Bel-Air, Dakar, Sénégal",
      site_web: "https://www.isra.sn",
      contact: "Dr. Mamadou Ba",
      email_contact: "m.ba@isra.sn",
      telephone_contact: "+221-33-834-73-73",
      prospect_id: 4,
      date_creation: "2024-11-15T09:15:00Z",
      derniere_mise_a_jour: "2024-11-25T11:20:00Z",
      conventions_signees: 3,
      partenariats_actifs: 2,
      prospect_origine: {
        nom_organisation: "Institut de Recherche Agricole du Sénégal",
        date_conversion: "2024-11-15T09:15:00Z"
      }
    }
  ]);

  // Secteurs disponibles
  const secteurs = [
    'Enseignement Supérieur',
    'Finance/Développement',
    'Recherche Agricole',
    'Technologies Vertes',
    'Industrie',
    'Santé'
  ];

  // Filtrage des partenaires
  const filteredPartenaires = partenaires.filter(partenaire => {
    const matchesSearch = partenaire.nom_organisation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (partenaire.secteur?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                         (partenaire.pays?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                         (partenaire.contact?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesSecteur = selectedSecteur === 'all' || partenaire.secteur === selectedSecteur;
    return matchesSearch && matchesSecteur;
  });

  const showPartenaireDetails = (partenaire: PartenaireWithExtras) => {
    setSelectedPartenaire(partenaire);
    setShowDetailsPopup(true);
  };

  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedPartenaire(null);
  };

  const deletePartenaire = async (partenaireId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ? Cette action est irréversible et supprimera aussi tous les partenariats associés.')) {
      try {
        // Appel à l'API pour supprimer le partenaire
        // await PartenaireService.deletePartenaire(partenaireId);
        
        // Pour l'instant, on supprime juste de l'état local
        setPartenaires(prev => prev.filter(p => p.id_partenaire !== partenaireId));
        alert('Partenaire supprimé avec succès !');
      } catch (error) {
        alert('Erreur lors de la suppression du partenaire');
        console.error('Erreur:', error);
      }
    }
  };

  const handleCreatePartenariat = () => {
    if (selectedPartenaire) {
      // Rediriger vers la page partenariats avec le partenaire pré-sélectionné
      router.push(`/partenariats?create=true&partenaire_id=${selectedPartenaire.id_partenaire}&partenaire_nom=${encodeURIComponent(selectedPartenaire.nom_organisation)}`);
    }
  };

  const handleViewConventions = () => {
    if (selectedPartenaire) {
      // Rediriger vers la page conventions filtrée par partenaire
      router.push(`/conventions?partenaire_id=${selectedPartenaire.id_partenaire}&partenaire_nom=${encodeURIComponent(selectedPartenaire.nom_organisation)}`);
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
              <button 
                onClick={() => router.push('/conventions')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-black text-sm font-medium transition-colors"
              >
                Conventions
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg bg-[#023047] text-white text-sm font-medium">
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

      {/* Main Content */}
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
                  placeholder="Rechercher partenaires..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                />
              </div>

              {/* Filter Options */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedSecteur('all')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedSecteur === 'all'
                        ? 'bg-[#023047] text-white'
                        : 'bg-gray-100 text-black hover:bg-gray-200'
                    }`}
                  >
                    Tous secteurs
                  </button>
                  {secteurs.slice(0, 4).map((secteur) => (
                    <button
                      key={secteur}
                      onClick={() => setSelectedSecteur(secteur)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedSecteur === secteur
                          ? 'bg-[#023047] text-white'
                          : 'bg-gray-100 text-black hover:bg-gray-200'
                      }`}
                    >
                      {secteur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-blue-700">{partenaires.length}</div>
                  <div className="text-base text-blue-600 font-medium">Partenaires</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-green-700">{partenaires.reduce((sum, p) => sum + p.conventions_signees, 0)}</div>
                  <div className="text-base text-green-600 font-medium">Conventions signées</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-purple-700">{partenaires.reduce((sum, p) => sum + p.partenariats_actifs, 0)}</div>
                  <div className="text-base text-purple-600 font-medium">Partenariats actifs</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-orange-700">{new Set(partenaires.map(p => p.pays)).size}</div>
                  <div className="text-base text-orange-600 font-medium">Pays</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partenaires Section */}
        <div className="fixed top-64 right-4 left-[23rem] bottom-4 z-30">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col">
            {/* Header fixe */}
            <div className="p-6 pb-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-black text-xl">
                  Partenaires ({filteredPartenaires.length})
                </h2>
                <div className="text-sm text-black">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Générés automatiquement depuis les conventions signées
                  </span>
                </div>
              </div>
            </div>

            {/* Contenu défilable */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {filteredPartenaires.map((partenaire) => (
                  <div key={partenaire.id_partenaire} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#023047] transition-all duration-200 shadow-sm hover:shadow-md">
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-[#023047] rounded-full flex items-center justify-center">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-600">Créé depuis prospect</div>
                          <div className="text-xs font-medium text-green-600">
                            {new Date(partenaire.prospect_origine?.date_conversion || '').toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>

                      {/* Organization Info */}
                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{partenaire.nom_organisation}</h3>
                        <p className="text-xs text-gray-700">{partenaire.contact}</p>
                        <p className="text-xs text-gray-600">{partenaire.secteur} • {partenaire.pays}</p>
                      </div>

                      {/* Contact Info */}
                      <div className="mb-3 space-y-1">
                        <div className="flex items-center text-xs text-gray-700">
                          <Mail className="w-3 h-3 mr-1 text-blue-500" />
                          <span className="truncate">{partenaire.email_contact}</span>
                        </div>
                        {partenaire.telephone_contact && (
                          <div className="flex items-center text-xs text-gray-700">
                            <Phone className="w-3 h-3 mr-1 text-green-500" />
                            <span>{partenaire.telephone_contact}</span>
                          </div>
                        )}
                        {partenaire.site_web && (
                          <div className="flex items-center text-xs text-gray-700">
                            <Globe className="w-3 h-3 mr-1 text-purple-500" />
                            <span className="truncate">{partenaire.site_web}</span>
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="mb-4 grid grid-cols-2 gap-2">
                        <div className="bg-green-50 p-2 rounded-lg text-center">
                          <div className="text-lg font-bold text-green-700">{partenaire.conventions_signees}</div>
                          <div className="text-xs text-green-600">Conventions</div>
                        </div>
                        <div className="bg-purple-50 p-2 rounded-lg text-center">
                          <div className="text-lg font-bold text-purple-700">{partenaire.partenariats_actifs}</div>
                          <div className="text-xs text-purple-600">Partenariats</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2">
                        <button 
                          onClick={() => showPartenaireDetails(partenaire)}
                          className="w-full text-black text-sm font-medium bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Voir détails</span>
                        </button>
                        <button 
                          onClick={() => deletePartenaire(partenaire.id_partenaire)}
                          className="w-full text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPartenaires.length === 0 && (
                <div className="text-center py-12">
                  <Building className="w-16 h-16 text-black mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-black mb-2">Aucun partenaire trouvé</h3>
                  <p className="text-black">Les partenaires sont créés automatiquement lorsqu&apos;une convention est signée avec un prospect.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal des détails du partenaire */}
      {showDetailsPopup && selectedPartenaire && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-gray-200 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header du popup */}
            <div className="p-6 border-b border-gray-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-black">{selectedPartenaire.nom_organisation}</h3>
                  <p className="text-sm text-black">{selectedPartenaire.contact}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Partenaire actif
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Créé depuis prospect
                    </span>
                  </div>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Informations générales */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-blue-600" />
                    Informations générales
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium text-gray-700">Secteur:</span> <span className="text-gray-900">{selectedPartenaire.secteur}</span></div>
                    <div><span className="font-medium text-gray-700">Pays:</span> <span className="text-gray-900">{selectedPartenaire.pays}</span></div>
                    {selectedPartenaire.adresse && (
                      <div><span className="font-medium text-gray-700">Adresse:</span> <span className="text-gray-900">{selectedPartenaire.adresse}</span></div>
                    )}
                    {selectedPartenaire.site_web && (
                      <div>
                        <span className="font-medium text-gray-700">Site web:</span> 
                        <a href={selectedPartenaire.site_web} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                          {selectedPartenaire.site_web}
                        </a>
                      </div>
                    )}
                    <div><span className="font-medium text-gray-700">Créé le:</span> <span className="text-gray-900">{new Date(selectedPartenaire.date_creation).toLocaleDateString('fr-FR')}</span></div>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-green-600" />
                    Contact
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium text-gray-700">Nom:</span> <span className="text-gray-900">{selectedPartenaire.contact}</span></div>
                    <div><span className="font-medium text-gray-700">Email:</span> <span className="text-blue-600">{selectedPartenaire.email_contact}</span></div>
                    {selectedPartenaire.telephone_contact && (
                      <div><span className="font-medium text-gray-700">Téléphone:</span> <span className="text-gray-900">{selectedPartenaire.telephone_contact}</span></div>
                    )}
                  </div>
                </div>

                {/* Statistiques */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Statistiques
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Conventions signées</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        {selectedPartenaire.conventions_signees}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Partenariats actifs</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                        {selectedPartenaire.partenariats_actifs}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Origine prospect */}
                {selectedPartenaire.prospect_origine && (
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                      Origine prospect
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium text-gray-700">Prospect initial:</span> <span className="text-gray-900">{selectedPartenaire.prospect_origine.nom_organisation}</span></div>
                      <div><span className="font-medium text-gray-700">Date de conversion:</span> <span className="text-gray-900">{new Date(selectedPartenaire.prospect_origine.date_conversion).toLocaleDateString('fr-FR')}</span></div>
                      <div className="text-green-600 font-medium flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Converti automatiquement lors de la signature d&apos;une convention
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer du popup */}
            <div className="p-6 border-t border-gray-300 flex justify-between">
              <div className="flex space-x-2">
                <button 
                  onClick={handleCreatePartenariat}
                  className="px-4 py-2 bg-[#023047] text-white rounded-lg hover:bg-[#0f4c5c] transition-colors flex items-center space-x-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Créer partenariat</span>
                </button>
                <button 
                  onClick={handleViewConventions}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Voir conventions</span>
                </button>
              </div>
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
    </div>
  );
}
