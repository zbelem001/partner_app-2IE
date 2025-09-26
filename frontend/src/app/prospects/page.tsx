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
  CheckCircle,
  XCircle,
  Building,
  Mail,
  Phone,
  Trash2
} from 'lucide-react';
import { Prospect as ProspectType } from '../../types/database';

// Interface étendue pour les prospects avec champs additionnels
interface ProspectWithExtra extends ProspectType {
  date_creation: string;
  derniere_mise_a_jour: string;
  notes?: string;
  potentiel_partenariat: 'faible' | 'moyen' | 'eleve';
}

export default function ProspectsPage() {
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
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'en_contact' | 'qualifie' | 'abandonne'>('all');
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<ProspectWithExtra | null>(null);
  const [newProspect, setNewProspect] = useState({
    nom_organisation: '',
    secteur: '',
    pays: '',
    contact: '',
    email_contact: '',
    telephone_contact: '',
    notes: '',
    potentiel_partenariat: 'moyen' as 'faible' | 'moyen' | 'eleve'
  });

  // Utiliser les informations utilisateur du hook d'authentification
  const user = {
    name: displayUser.name,
    avatar: displayUser.avatar,
    location: "Burkina Faso"
  };

  const notifications = 3;

  // Données des prospects
  const [prospects, setProspects] = useState<ProspectWithExtra[]>([
    {
      id_prospect: 1,
      nom_organisation: "École Polytechnique de Montréal",
      secteur: "Enseignement Supérieur",
      pays: "Canada",
      contact: "Dr. Marie Tremblay",
      email_contact: "m.tremblay@polymtl.ca",
      telephone_contact: "+1-514-340-4711",
      statut: "qualifie",
      date_creation: "2024-10-15T10:00:00Z",
      derniere_mise_a_jour: "2024-11-20T14:30:00Z",
      notes: "Intéressé par un programme d'échange d'étudiants en génie civil",
      potentiel_partenariat: "eleve"
    },
    {
      id_prospect: 2,
      nom_organisation: "African Development Bank",
      secteur: "Finance/Développement",
      pays: "Côte d'Ivoire",
      contact: "M. Kwame Asante",
      email_contact: "k.asante@afdb.org",
      telephone_contact: "+225-20-26-39-00",
      statut: "en_contact",
      date_creation: "2024-11-01T09:00:00Z",
      derniere_mise_a_jour: "2024-11-22T16:45:00Z",
      notes: "Recherche de partenaires pour projets d'infrastructure en Afrique de l'Ouest",
      potentiel_partenariat: "eleve"
    },
    {
      id_prospect: 3,
      nom_organisation: "Green Tech Solutions",
      secteur: "Technologies Vertes",
      pays: "Ghana",
      contact: "Mme. Akosua Mensah",
      email_contact: "a.mensah@greentech.gh",
      telephone_contact: "+233-30-276-8000",
      statut: "en_contact",
      date_creation: "2024-09-20T14:00:00Z",
      derniere_mise_a_jour: "2024-11-18T11:20:00Z",
      notes: "Startup spécialisée dans les solutions d'énergie solaire",
      potentiel_partenariat: "moyen"
    },
    {
      id_prospect: 4,
      nom_organisation: "Institut de Recherche Agricole du Sénégal",
      secteur: "Recherche Agricole",
      pays: "Sénégal",
      contact: "Dr. Mamadou Ba",
      email_contact: "m.ba@isra.sn",
      telephone_contact: "+221-33-834-73-73",
      statut: "qualifie",
      date_creation: "2024-08-10T08:30:00Z",
      derniere_mise_a_jour: "2024-11-15T09:15:00Z",
      notes: "Collaboration potentielle sur l'agriculture durable",
      potentiel_partenariat: "eleve"
    },
    {
      id_prospect: 5,
      nom_organisation: "TechCorp Industries",
      secteur: "Industrie",
      pays: "Nigeria",
      contact: "M. Chidi Okafor",
      email_contact: "c.okafor@techcorp.ng",
      telephone_contact: "+234-1-461-0000",
      statut: "abandonne",
      date_creation: "2024-07-05T13:00:00Z",
      derniere_mise_a_jour: "2024-09-30T17:00:00Z",
      notes: "Pas de réponse après plusieurs relances",
      potentiel_partenariat: "faible"
    },
    {
      id_prospect: 6,
      nom_organisation: "Université Cheikh Anta Diop - Extension",
      secteur: "Enseignement Supérieur",
      pays: "Sénégal",
      contact: "Prof. Fatou Sow",
      email_contact: "f.sow@ucad.edu.sn",
      telephone_contact: "+221-33-824-69-81",
      statut: "en_contact",
      date_creation: "2024-11-10T15:30:00Z",
      derniere_mise_a_jour: "2024-11-21T10:45:00Z",
      notes: "Extension des programmes de mobilité étudiante existants",
      potentiel_partenariat: "eleve"
    }
  ]);

  // Filtrage des prospects
  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = prospect.nom_organisation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (prospect.secteur?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                         (prospect.pays?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                         (prospect.contact?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesStatus = selectedStatus === 'all' || prospect.statut === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const showProspectDetails = (prospect: ProspectWithExtra) => {
    setSelectedProspect(prospect);
    setShowDetailsPopup(true);
  };

  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedProspect(null);
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewProspect({
      nom_organisation: '',
      secteur: '',
      pays: '',
      contact: '',
      email_contact: '',
      telephone_contact: '',
      notes: '',
      potentiel_partenariat: 'moyen'
    });
  };

  const handleProspectInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProspect(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProspectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nouveauProspect: ProspectWithExtra = {
      id_prospect: prospects.length + 1,
      nom_organisation: newProspect.nom_organisation,
      secteur: newProspect.secteur,
      pays: newProspect.pays,
      contact: newProspect.contact,
      email_contact: newProspect.email_contact,
      telephone_contact: newProspect.telephone_contact,
      statut: 'en_contact',
      date_creation: new Date().toISOString(),
      derniere_mise_a_jour: new Date().toISOString(),
      notes: newProspect.notes,
      potentiel_partenariat: newProspect.potentiel_partenariat
    };

    setProspects(prev => [...prev, nouveauProspect]);
    closeAddModal();
    alert('Prospect ajouté avec succès !');
  };

  const updateProspectStatus = (prospectId: number, newStatus: 'en_contact' | 'qualifie' | 'abandonne') => {
    setProspects(prev => prev.map(p => 
      p.id_prospect === prospectId 
        ? { ...p, statut: newStatus, derniere_mise_a_jour: new Date().toISOString() }
        : p
    ));
  };

  const deleteProspect = async (prospectId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce prospect ? Cette action est irréversible.')) {
      try {
        // Appel à l'API pour supprimer le prospect
        // await ProspectService.deleteProspect(prospectId);
        
        // Pour l'instant, on supprime juste de l'état local
        setProspects(prev => prev.filter(p => p.id_prospect !== prospectId));
        alert('Prospect supprimé avec succès !');
      } catch (error) {
        alert('Erreur lors de la suppression du prospect');
        console.error('Erreur:', error);
      }
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'qualifie': return 'bg-green-100 text-green-700';
      case 'en_contact': return 'bg-blue-100 text-blue-700';
      case 'abandonne': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-black';
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'qualifie': return 'Qualifié';
      case 'en_contact': return 'En contact';
      case 'abandonne': return 'Abandonné';
      default: return statut;
    }
  };

  const getPotentielColor = (potentiel: string) => {
    switch (potentiel) {
      case 'eleve': return 'text-green-600';
      case 'moyen': return 'text-yellow-600';
      case 'faible': return 'text-red-600';
      default: return 'text-black';
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
              <button className="w-full text-left px-3 py-2 rounded-lg bg-[#023047] text-white text-sm font-medium">
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
                  placeholder="Rechercher prospects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                />
              </div>

              {/* Filter Options */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex space-x-2">
                  {['all', 'en_contact', 'qualifie', 'abandonne'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status as 'all' | 'en_contact' | 'qualifie' | 'abandonne')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedStatus === status
                          ? 'bg-[#023047] text-white'
                          : 'bg-gray-100 text-black hover:bg-gray-200'
                      }`}
                    >
                      {status === 'all' ? 'Tous' : 
                       status === 'en_contact' ? 'En contact' :
                       status === 'qualifie' ? 'Qualifiés' : 'Abandonnés'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-blue-700">{prospects.filter(p => p.statut === 'en_contact').length}</div>
                  <div className="text-base text-blue-600 font-medium">En contact</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-green-700">{prospects.filter(p => p.statut === 'qualifie').length}</div>
                  <div className="text-base text-green-600 font-medium">Qualifiés</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-red-700">{prospects.filter(p => p.statut === 'abandonne').length}</div>
                  <div className="text-base text-red-600 font-medium">Abandonnés</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-black">{prospects.length}</div>
                  <div className="text-base text-black font-medium">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prospects Section */}
        <div className="fixed top-64 right-4 left-[23rem] bottom-4 z-30">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col">
            {/* Header fixe */}
            <div className="p-6 pb-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-black text-xl">
                  Prospects ({filteredProspects.length})
                </h2>
                <button 
                  onClick={openAddModal}
                  className="px-4 py-2 bg-[#023047] text-white rounded-lg hover:bg-[#0f4c5c] transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau prospect</span>
                </button>
              </div>
            </div>

            {/* Contenu défilable */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {filteredProspects.map((prospect) => (
                  <div key={prospect.id_prospect} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#023047] transition-all duration-200 shadow-sm hover:shadow-md">
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-[#023047] rounded-full flex items-center justify-center">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prospect.statut)}`}>
                          {getStatusText(prospect.statut)}
                        </div>
                      </div>

                      {/* Organization and Contact */}
                      <div className="mb-3">
                        <h3 className="font-semibold text-black text-sm mb-1 line-clamp-2">{prospect.nom_organisation}</h3>
                        <p className="text-xs text-black">{prospect.contact}</p>
                        <p className="text-xs text-black">{prospect.secteur} • {prospect.pays}</p>
                      </div>

                      {/* Contact Info */}
                      <div className="mb-3 space-y-1">
                        <div className="flex items-center text-xs text-black">
                          <Mail className="w-3 h-3 mr-1" />
                          <span className="truncate">{prospect.email_contact}</span>
                        </div>
                        <div className="flex items-center text-xs text-black">
                          <Phone className="w-3 h-3 mr-1" />
                          <span>{prospect.telephone_contact}</span>
                        </div>
                      </div>

                      {/* Potentiel */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-black">Potentiel</span>
                          <span className={`text-xs font-medium ${getPotentielColor(prospect.potentiel_partenariat)}`}>
                            {prospect.potentiel_partenariat === 'eleve' ? 'Élevé' : 
                             prospect.potentiel_partenariat === 'moyen' ? 'Moyen' : 'Faible'}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2">
                        <button 
                          onClick={() => showProspectDetails(prospect)}
                          className="text-black text-sm font-medium bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Voir détails</span>
                        </button>

                        {/* Delete Button */}
                        <button 
                          onClick={() => deleteProspect(prospect.id_prospect)}
                          className="text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Supprimer</span>
                        </button>

                        {/* Quick Status Update */}
                        {prospect.statut === 'en_contact' && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => updateProspectStatus(prospect.id_prospect, 'qualifie')}
                              className="flex-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors flex items-center justify-center space-x-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Qualifier</span>
                            </button>
                            <button
                              onClick={() => updateProspectStatus(prospect.id_prospect, 'abandonne')}
                              className="flex-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors flex items-center justify-center space-x-1"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Abandonner</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal des détails du prospect */}
      {showDetailsPopup && selectedProspect && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-gray-200 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header du popup */}
            <div className="p-6 border-b border-gray-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-black">{selectedProspect.nom_organisation}</h3>
                  <p className="text-sm text-black">{selectedProspect.contact}</p>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(selectedProspect.statut)}`}>
                    {getStatusText(selectedProspect.statut)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-semibold text-black mb-2">Informations générales</h4>
                  <div className="space-y-2 text-sm text-black">
                    <div><span className="font-medium">Secteur:</span> {selectedProspect.secteur}</div>
                    <div><span className="font-medium">Pays:</span> {selectedProspect.pays}</div>
                    <div><span className="font-medium">Potentiel:</span> 
                      <span className={`ml-2 font-semibold ${getPotentielColor(selectedProspect.potentiel_partenariat)}`}>
                        {selectedProspect.potentiel_partenariat === 'eleve' ? 'Élevé' : 
                         selectedProspect.potentiel_partenariat === 'moyen' ? 'Moyen' : 'Faible'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-semibold text-black mb-2">Contact</h4>
                  <div className="space-y-2 text-sm text-black">
                    <div><span className="font-medium">Email:</span> {selectedProspect.email_contact}</div>
                    <div><span className="font-medium">Téléphone:</span> {selectedProspect.telephone_contact}</div>
                    <div><span className="font-medium">Créé le:</span> {new Date(selectedProspect.date_creation).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
              </div>

              {selectedProspect.notes && (
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-semibold text-black mb-2">Notes</h4>
                  <p className="text-sm text-black">{selectedProspect.notes}</p>
                </div>
              )}
            </div>

            {/* Footer du popup */}
            <div className="p-6 border-t border-gray-300 flex justify-between">
              <div className="flex space-x-2">
                {selectedProspect.statut === 'en_contact' && (
                  <>
                    <button
                      onClick={() => {
                        updateProspectStatus(selectedProspect.id_prospect, 'qualifie');
                        closeDetailsPopup();
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Qualifier</span>
                    </button>
                    <button
                      onClick={() => {
                        updateProspectStatus(selectedProspect.id_prospect, 'abandonne');
                        closeDetailsPopup();
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Abandonner</span>
                    </button>
                  </>
                )}
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

      {/* Modal d'ajout de prospect */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">Nouveau Prospect</h3>
                <button 
                  onClick={closeAddModal}
                  className="text-black hover:text-black text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleProspectSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Nom de l&apos;organisation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nom_organisation"
                    value={newProspect.nom_organisation}
                    onChange={handleProspectInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                    placeholder="Nom de l'organisation"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Secteur <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="secteur"
                      value={newProspect.secteur}
                      onChange={handleProspectInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                      placeholder="Secteur d'activité"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Pays <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pays"
                      value={newProspect.pays}
                      onChange={handleProspectInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                      placeholder="Pays"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={newProspect.contact}
                    onChange={handleProspectInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                    placeholder="Nom du contact (optionnel)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email_contact"
                      value={newProspect.email_contact}
                      onChange={handleProspectInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                      placeholder="email@exemple.com (optionnel)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="telephone_contact"
                      value={newProspect.telephone_contact}
                      onChange={handleProspectInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                      placeholder="+xxx-xx-xx-xx-xx"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Potentiel de partenariat
                  </label>
                  <select
                    name="potentiel_partenariat"
                    value={newProspect.potentiel_partenariat}
                    onChange={handleProspectInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                  >
                    <option value="faible">Faible</option>
                    <option value="moyen">Moyen</option>
                    <option value="eleve">Élevé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={newProspect.notes}
                    onChange={handleProspectInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#023047] text-black"
                    placeholder="Notes et observations..."
                  />
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
                  className="px-4 py-2 bg-[#023047] text-white rounded-lg hover:bg-[#0f4c5c] transition-colors"
                >
                  Créer le prospect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
