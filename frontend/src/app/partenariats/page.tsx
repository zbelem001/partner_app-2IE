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
  Eye,
  Building,
  FileText,
  Calendar,
  Users,
  AlertTriangle,
  Edit,
  Trash2
} from 'lucide-react';


// Interface étendue pour les partenariats avec données additionnelles
interface PartenariatWithExtras {
  id_partenariat: number;
  partenaire_id: number;
  titre: string;
  description?: string;
  statut: 'actif' | 'suspendu' | 'termine';
  date_debut?: string;
  date_fin?: string;
  responsable_id?: number;
  date_creation: string;
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
  conventions_count: number;
  conventions_associees: {
    id_convention: number;
    titre: string;
    statut: string;
    date_signature: string;
    montant_engage: number;
  }[];
  derniere_activite: string;
}

// Interface pour les conventions disponibles
interface ConventionDisponible {
  id_convention: number;
  titre: string;
  partenaire_nom: string;
  statut: 'signe';
  date_signature: string;
  montant_engage: number;
  service_concerne: string;
  deja_utilisee: boolean;
}

export default function PartenariatPage() {
  const router = useRouter();
  const { displayUser } = useAuth();

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    router.push('/');
  };

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

  const [searchQuery, setSearchQuery] = useState('');
  const [conventionSearchQuery, setConventionSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'actif' | 'suspendu' | 'termine'>('all');
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPartenariat, setSelectedPartenariat] = useState<PartenariatWithExtras | null>(null);
  const [selectedConventions, setSelectedConventions] = useState<number[]>([]);
  const [newPartenariat, setNewPartenariat] = useState({
    titre: '',
    description: '',
    date_debut: '',
    date_fin: '',
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

  // Conventions disponibles pour association (signées et non utilisées)
  const [conventionsDisponibles] = useState<ConventionDisponible[]>([
    {
      id_convention: 4,
      titre: "Convention Recherche Agricole Avancée",
      partenaire_nom: "Institut de Recherche Agricole du Sénégal",
      statut: 'signe',
      date_signature: "2024-11-20T00:00:00Z",
      montant_engage: 2500000,
      service_concerne: "Recherche et Innovation",
      deja_utilisee: false
    },
    {
      id_convention: 5,
      titre: "Convention Formation Continue Ingénieurs",
      partenaire_nom: "École Polytechnique de Montréal",
      statut: 'signe',
      date_signature: "2024-11-18T00:00:00Z",
      montant_engage: 1800000,
      service_concerne: "Formation Continue",
      deja_utilisee: false
    },
    {
      id_convention: 6,
      titre: "Convention Financement Projets Étudiants",
      partenaire_nom: "African Development Bank",
      statut: 'signe',
      date_signature: "2024-11-15T00:00:00Z",
      montant_engage: 5000000,
      service_concerne: "Formation",
      deja_utilisee: false
    },
    {
      id_convention: 7,
      titre: "Convention Échange Académique",
      partenaire_nom: "École Polytechnique de Montréal",
      statut: 'signe',
      date_signature: "2024-11-10T00:00:00Z",
      montant_engage: 800000,
      service_concerne: "Relations Internationales",
      deja_utilisee: false
    }
  ]);

  // Données des partenariats
  const [partenariats, setPartenariats] = useState<PartenariatWithExtras[]>([
    {
      id_partenariat: 1,
      partenaire_id: 1,
      titre: "Partenariat Académique et Recherche",
      description: "Collaboration dans les domaines de l'enseignement supérieur et de la recherche en génie",
      statut: 'actif',
      date_debut: "2024-11-25",
      date_fin: "2026-11-25",
      responsable_id: 1,
      date_creation: "2024-11-25T10:00:00Z",
      partenaire: {
        id_partenaire: 1,
        nom_organisation: "École Polytechnique de Montréal",
        secteur: "Enseignement Supérieur",
        pays: "Canada",
        contact: "Dr. Marie Tremblay",
        email_contact: "m.tremblay@polymtl.ca"
      },
      responsable: {
        id_utilisateur: 1,
        nom: "OUEDRAOGO",
        prenom: "Yacouba",
        service: "Relations Internationales"
      },
      conventions_count: 2,
      conventions_associees: [
        {
          id_convention: 1,
          titre: "Convention Échange Étudiants",
          statut: "signe",
          date_signature: "2024-11-25",
          montant_engage: 1500000
        },
        {
          id_convention: 2,
          titre: "Convention Recherche Collaborative",
          statut: "signe", 
          date_signature: "2024-11-25",
          montant_engage: 3000000
        }
      ],
      derniere_activite: "2024-11-25T14:30:00Z"
    },
    {
      id_partenariat: 2,
      partenaire_id: 2,
      titre: "Partenariat Financement et Développement",
      description: "Partenariat stratégique pour le financement de projets d'infrastructure et de développement",
      statut: 'actif',
      date_debut: "2024-11-20",
      date_fin: "2025-11-20",
      responsable_id: 2,
      date_creation: "2024-11-20T14:30:00Z",
      partenaire: {
        id_partenaire: 2,
        nom_organisation: "African Development Bank",
        secteur: "Finance/Développement",
        pays: "Côte d'Ivoire",
        contact: "M. Kwame Asante",
        email_contact: "k.asante@afdb.org"
      },
      responsable: {
        id_utilisateur: 2,
        nom: "TRAORE",
        prenom: "Aminata",
        service: "SRECIP"
      },
      conventions_count: 1,
      conventions_associees: [
        {
          id_convention: 3,
          titre: "Convention Financement Infrastructure",
          statut: "signe",
          date_signature: "2024-11-20",
          montant_engage: 8000000
        }
      ],
      derniere_activite: "2024-11-22T16:45:00Z"
    }
  ]);

  // Filtrage des partenariats
  const filteredPartenariats = partenariats.filter(partenariat => {
    const matchesSearch = partenariat.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         partenariat.partenaire.nom_organisation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (partenariat.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesStatus = selectedStatus === 'all' || partenariat.statut === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Conventions disponibles (non utilisées)
  // Conventions disponibles filtrées et triées
  const availableConventions = conventionsDisponibles
    .filter(conv => !conv.deja_utilisee)
    .filter(conv => 
      conventionSearchQuery === '' || 
      conv.titre.toLowerCase().includes(conventionSearchQuery.toLowerCase()) ||
      conv.partenaire_nom.toLowerCase().includes(conventionSearchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.date_signature).getTime() - new Date(a.date_signature).getTime());

  const showPartenariatDetails = (partenariat: PartenariatWithExtras) => {
    setSelectedPartenariat(partenariat);
    setShowDetailsPopup(true);
  };

  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedPartenariat(null);
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setSelectedConventions([]);
    setNewPartenariat({
      titre: '',
      description: '',
      date_debut: '',
      date_fin: '',
      responsable_nom: '',
      responsable_prenom: '',
      responsable_service: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPartenariat(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConventionSelection = (conventionId: number) => {
    setSelectedConventions(prev => {
      if (prev.includes(conventionId)) {
        return prev.filter(id => id !== conventionId);
      } else {
        return [...prev, conventionId];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedConventions.length === 0) {
      alert('Veuillez sélectionner au moins une convention !');
      return;
    }

    // Récupérer les informations du partenaire depuis les conventions sélectionnées
    const firstConvention = conventionsDisponibles.find(c => c.id_convention === selectedConventions[0]);
    if (!firstConvention) return;

    const nouveauPartenariat: PartenariatWithExtras = {
      id_partenariat: partenariats.length + 1,
      partenaire_id: partenariats.length + 1,
      titre: newPartenariat.titre,
      description: newPartenariat.description,
      statut: 'actif',
      date_debut: newPartenariat.date_debut,
      date_fin: newPartenariat.date_fin,
      responsable_id: 1,
      date_creation: new Date().toISOString(),
      partenaire: {
        id_partenaire: partenariats.length + 1,
        nom_organisation: firstConvention.partenaire_nom,
        secteur: "Secteur générique",
        pays: "Pays générique",
        contact: "Contact générique",
        email_contact: "contact@partenaire.com"
      },
      responsable: newPartenariat.responsable_nom ? {
        id_utilisateur: 1,
        nom: newPartenariat.responsable_nom,
        prenom: newPartenariat.responsable_prenom,
        service: newPartenariat.responsable_service
      } : null,
      conventions_count: selectedConventions.length,
      conventions_associees: selectedConventions.map(id => {
        const conv = conventionsDisponibles.find(c => c.id_convention === id);
        return conv ? {
          id_convention: conv.id_convention,
          titre: conv.titre,
          statut: conv.statut,
          date_signature: conv.date_signature,
          montant_engage: conv.montant_engage
        } : {
          id_convention: id,
          titre: "Convention inconnue",
          statut: "signe",
          date_signature: new Date().toISOString(),
          montant_engage: 0
        };
      }),
      derniere_activite: new Date().toISOString()
    };

    setPartenariats(prev => [...prev, nouveauPartenariat]);
    
    // Marquer les conventions comme utilisées
    selectedConventions.forEach(id => {
      const conv = conventionsDisponibles.find(c => c.id_convention === id);
      if (conv) {
        conv.deja_utilisee = true;
      }
    });
    
    closeAddModal();
    alert('Partenariat créé avec succès !');
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(montant);
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-700';
      case 'suspendu': return 'bg-yellow-100 text-yellow-700';
      case 'termine': return 'bg-gray-100 text-black';
      default: return 'bg-gray-100 text-black';
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'actif': return 'Actif';
      case 'suspendu': return 'Suspendu';
      case 'termine': return 'Terminé';
      default: return statut;
    }
  };

  const deletePartenariat = async (partenariatId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce partenariat ? Cette action est irréversible.')) {
      try {
        // Appel à l'API pour supprimer le partenariat
        // await PartenariatService.deletePartenariat(partenariatId);
        
        // Pour l'instant, on supprime juste de l'état local
        setPartenariats(prev => prev.filter(p => p.id_partenariat !== partenariatId));
        alert('Partenariat supprimé avec succès !');
      } catch (error) {
        alert('Erreur lors de la suppression du partenariat');
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
              <button 
                onClick={() => router.push('/conventions')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-black text-sm font-medium transition-colors"
              >
                Conventions
              </button>
              <button 
                onClick={() => router.push('/partenaires')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-black text-sm font-medium transition-colors"
              >
                Partenaires
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg bg-[#023047] text-white text-sm font-medium">
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
                  placeholder="Rechercher partenariats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                />
              </div>

              {/* Filter Options */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex space-x-2">
                  {['all', 'actif', 'suspendu', 'termine'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status as 'all' | 'actif' | 'suspendu' | 'termine')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedStatus === status
                          ? 'bg-[#023047] text-white'
                          : 'bg-gray-100 text-black hover:bg-gray-200'
                      }`}
                    >
                      {status === 'all' ? 'Tous' : 
                       status === 'actif' ? 'Actifs' :
                       status === 'suspendu' ? 'Suspendus' : 'Terminés'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-green-700">{partenariats.filter(p => p.statut === 'actif').length}</div>
                  <div className="text-base text-green-600 font-medium">Actifs</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-blue-700">{partenariats.reduce((sum, p) => sum + p.conventions_count, 0)}</div>
                  <div className="text-base text-blue-600 font-medium">Conventions associées</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-purple-700">{availableConventions.length}</div>
                  <div className="text-base text-purple-600 font-medium">Conventions disponibles</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-black">{partenariats.length}</div>
                  <div className="text-base text-black font-medium">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partenariats Section */}
        <div className="fixed top-64 right-4 left-[23rem] bottom-4 z-30">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col">
            {/* Header fixe */}
            <div className="p-6 pb-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-black text-xl">
                  Partenariats ({filteredPartenariats.length})
                </h2>
                <button 
                  onClick={openAddModal}
                  className="px-4 py-2 bg-[#023047] text-white rounded-lg hover:bg-[#0f4c5c] transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau partenariat</span>
                </button>
              </div>
            </div>

            {/* Contenu défilable */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {filteredPartenariats.map((partenariat) => (
                  <div key={partenariat.id_partenariat} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#023047] transition-all duration-200 shadow-sm hover:shadow-md">
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-[#023047] rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(partenariat.statut)}`}>
                          {getStatusText(partenariat.statut)}
                        </div>
                      </div>

                      {/* Partenariat Info */}
                      <div className="mb-3">
                        <h3 className="font-semibold text-black text-sm mb-1 line-clamp-2">{partenariat.titre}</h3>
                        <p className="text-xs text-black">{partenariat.partenaire.nom_organisation}</p>
                        <p className="text-xs text-black">{partenariat.partenaire.pays}</p>
                      </div>

                      {/* Description */}
                      {partenariat.description && (
                        <div className="mb-3">
                          <p className="text-xs text-black line-clamp-2">{partenariat.description}</p>
                        </div>
                      )}

                      {/* Dates */}
                      <div className="mb-3 space-y-1">
                        <div className="flex items-center text-xs text-black">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Du {new Date(partenariat.date_debut || '').toLocaleDateString('fr-FR')} au {new Date(partenariat.date_fin || '').toLocaleDateString('fr-FR')}</span>
                        </div>
                        {partenariat.responsable && (
                          <div className="flex items-center text-xs text-black">
                            <User className="w-3 h-3 mr-1" />
                            <span>{partenariat.responsable.prenom} {partenariat.responsable.nom}</span>
                          </div>
                        )}
                      </div>

                      {/* Conventions */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-black">Conventions</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                            {partenariat.conventions_count}
                          </span>
                        </div>
                        <div className="text-xs text-black">
                          Montant total: {formatMontant(partenariat.conventions_associees.reduce((sum, c) => sum + c.montant_engage, 0))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2">
                        <button 
                          onClick={() => showPartenariatDetails(partenariat)}
                          className="w-full text-black text-sm font-medium bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Voir détails</span>
                        </button>
                        <button 
                          onClick={() => deletePartenariat(partenariat.id_partenariat)}
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

              {filteredPartenariats.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-black mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-black mb-2">Aucun partenariat trouvé</h3>
                  <p className="text-black">Créez un nouveau partenariat en associant des conventions signées.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal des détails du partenariat */}
      {showDetailsPopup && selectedPartenariat && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-gray-200 rounded-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
            {/* Header du popup */}
            <div className="p-6 border-b border-gray-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-black">{selectedPartenariat.titre}</h3>
                  <p className="text-sm text-black">{selectedPartenariat.partenaire.nom_organisation}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPartenariat.statut)}`}>
                      {getStatusText(selectedPartenariat.statut)}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {selectedPartenariat.conventions_count} convention(s)
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
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Informations générales
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium text-gray-700">Description:</span> <span className="text-gray-900">{selectedPartenariat.description || 'Aucune description'}</span></div>
                    <div><span className="font-medium text-gray-700">Début:</span> <span className="text-gray-900">{new Date(selectedPartenariat.date_debut || '').toLocaleDateString('fr-FR')}</span></div>
                    <div><span className="font-medium text-gray-700">Fin:</span> <span className="text-gray-900">{new Date(selectedPartenariat.date_fin || '').toLocaleDateString('fr-FR')}</span></div>
                    <div><span className="font-medium text-gray-700">Créé le:</span> <span className="text-gray-900">{new Date(selectedPartenariat.date_creation).toLocaleDateString('fr-FR')}</span></div>
                    <div><span className="font-medium text-gray-700">Dernière activité:</span> <span className="text-gray-900">{new Date(selectedPartenariat.derniere_activite).toLocaleDateString('fr-FR')}</span></div>
                  </div>
                </div>

                {/* Partenaire */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-green-600" />
                    Partenaire
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium text-gray-700">Organisation:</span> <span className="text-gray-900">{selectedPartenariat.partenaire.nom_organisation}</span></div>
                    <div><span className="font-medium text-gray-700">Secteur:</span> <span className="text-gray-900">{selectedPartenariat.partenaire.secteur}</span></div>
                    <div><span className="font-medium text-gray-700">Pays:</span> <span className="text-gray-900">{selectedPartenariat.partenaire.pays}</span></div>
                    <div><span className="font-medium text-gray-700">Contact:</span> <span className="text-gray-900">{selectedPartenariat.partenaire.contact}</span></div>
                    <div><span className="font-medium text-gray-700">Email:</span> <span className="text-blue-600">{selectedPartenariat.partenaire.email_contact}</span></div>
                  </div>
                </div>

                {/* Responsable */}
                {selectedPartenariat.responsable && (
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2 text-purple-600" />
                      Responsable 2iE
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium text-gray-700">Nom:</span> <span className="text-gray-900">{selectedPartenariat.responsable.prenom} {selectedPartenariat.responsable.nom}</span></div>
                      <div><span className="font-medium text-gray-700">Service:</span> <span className="text-gray-900">{selectedPartenariat.responsable.service}</span></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Conventions associées */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-orange-600" />
                  Conventions associées ({selectedPartenariat.conventions_count})
                </h4>
                <div className="space-y-3">
                  {selectedPartenariat.conventions_associees.map((convention) => (
                    <div key={convention.id_convention} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-sm text-gray-900">{convention.titre}</h5>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {convention.statut}
                        </span>
                      </div>
                      <div className="text-xs text-gray-700 space-y-1">
                        <div><span className="font-medium">Signée le:</span> {new Date(convention.date_signature).toLocaleDateString('fr-FR')}</div>
                        <div><span className="font-medium">Montant:</span> {formatMontant(convention.montant_engage)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="font-semibold text-lg text-gray-900">
                    Montant total: <span className="text-green-600">{formatMontant(selectedPartenariat.conventions_associees.reduce((sum, c) => sum + c.montant_engage, 0))}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer du popup */}
            <div className="p-6 border-t border-gray-300 flex justify-between">
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-[#023047] text-white rounded-lg hover:bg-[#0f4c5c] transition-colors flex items-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Suspendre</span>
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

      {/* Modal d'ajout de partenariat */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">Nouveau Partenariat</h3>
                <button 
                  onClick={closeAddModal}
                  className="text-black hover:text-black text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Informations générales */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-black text-lg">Informations générales</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Titre du partenariat <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="titre"
                      value={newPartenariat.titre}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black placeholder-gray-500"
                      placeholder="Titre du partenariat"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={newPartenariat.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black placeholder-gray-500"
                      placeholder="Description du partenariat..."
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
                        value={newPartenariat.date_debut}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Date de fin
                      </label>
                      <input
                        type="date"
                        name="date_fin"
                        value={newPartenariat.date_fin}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Associer conventions */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-black text-lg">Associer conventions <span className="text-red-500">*</span></h4>
                  <p className="text-sm text-black">Sélectionnez les conventions signées à associer à ce partenariat (choix multiple)</p>
                  
                  {conventionsDisponibles.filter(conv => !conv.deja_utilisee).length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800">Aucune convention signée disponible. Créez d&apos;abord des conventions signées pour pouvoir créer des partenariats.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Barre de recherche pour les conventions */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Rechercher une convention..."
                          value={conventionSearchQuery}
                          onChange={(e) => setConventionSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black placeholder-gray-500"
                        />
                      </div>
                      
                      {/* Liste des conventions */}
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {availableConventions.length === 0 ? (
                          <div className="text-center py-4 text-gray-500">
                            Aucune convention trouvée pour &quot;{conventionSearchQuery}&quot;
                          </div>
                        ) : (
                          availableConventions.map((convention) => (
                            <div key={convention.id_convention} className="border border-gray-200 rounded-lg p-4 bg-white">
                              <div className="flex items-start space-x-3">
                                <input
                                  type="checkbox"
                                  id={`convention-${convention.id_convention}`}
                                  checked={selectedConventions.includes(convention.id_convention)}
                                  onChange={() => handleConventionSelection(convention.id_convention)}
                                  className="mt-1 w-4 h-4 text-[#023047] border-gray-300 rounded focus:ring-[#023047]"
                                />
                                <div className="flex-1">
                                  <label htmlFor={`convention-${convention.id_convention}`} className="cursor-pointer">
                                    <div className="font-semibold text-gray-900 text-sm mb-1">{convention.titre}</div>
                                    <div className="text-xs text-gray-600 space-y-1">
                                      <div className="flex items-center space-x-4">
                                        <span><strong>Partenaire:</strong> {convention.partenaire_nom}</span>
                                        <span><strong>Signée le:</strong> {new Date(convention.date_signature).toLocaleDateString('fr-FR')}</span>
                                      </div>
                                      <div className="flex items-center space-x-4">
                                        <span><strong>Montant:</strong> {formatMontant(convention.montant_engage)}</span>
                                        <span><strong>Service:</strong> {convention.service_concerne}</span>
                                      </div>
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      
                      {/* Informations sur le nombre de conventions */}
                      <div className="text-sm text-gray-500 text-center">
                        {availableConventions.length} convention{availableConventions.length > 1 ? 's' : ''} disponible{availableConventions.length > 1 ? 's' : ''} (triée{availableConventions.length > 1 ? 's' : ''} par date décroissante)
                      </div>
                    </div>
                  )}

                  {selectedConventions.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">Conventions sélectionnées ({selectedConventions.length})</h5>
                      <div className="text-sm text-blue-700">
                        <div>Montant total: {formatMontant(
                          selectedConventions.reduce((sum, id) => {
                            const conv = availableConventions.find(c => c.id_convention === id);
                            return sum + (conv?.montant_engage || 0);
                          }, 0)
                        )}</div>
                      </div>
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
                        value={newPartenariat.responsable_nom}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black placeholder-gray-500"
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
                        value={newPartenariat.responsable_prenom}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black placeholder-gray-500"
                        placeholder="Prénom du responsable"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Service
                    </label>
                    <select
                      name="responsable_service"
                      value={newPartenariat.responsable_service}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                    >
                      <option value="">Sélectionner un service</option>
                      <option value="SRECIP">SRECIP</option>
                      <option value="Relations Internationales">Relations Internationales</option>
                      <option value="Recherche et Innovation">Recherche et Innovation</option>
                      <option value="Formation">Formation</option>
                      <option value="Formation Continue">Formation Continue</option>
                      <option value="Innovation">Innovation</option>
                    </select>
                  </div>
                </div>
              </div>

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
                  disabled={selectedConventions.length === 0}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedConventions.length === 0
                      ? 'bg-gray-300 text-black cursor-not-allowed'
                      : 'bg-[#023047] text-white hover:bg-[#0f4c5c]'
                  }`}
                >
                  Créer le partenariat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
