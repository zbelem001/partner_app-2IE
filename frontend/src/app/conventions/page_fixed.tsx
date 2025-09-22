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
  id: number;
  title: string;
  partner: string;
  partnerLogo: string;
  type: string;
  status: 'active' | 'pending' | 'expired' | 'draft';
  startDate: string;
  endDate: string;
  value: string;
  description: string;
  progress: number;
  category: string;
  priority: 'high' | 'medium' | 'low';
  documents: number;
  lastUpdate: string;
}

export default function ConventionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'pending' | 'draft' | 'expired'>('all');
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedConvention, setSelectedConvention] = useState<Convention | null>(null);

  const user = {
    name: "Admin 2iE",
    avatar: "👨‍💼",
    location: "Burkina Faso"
  };

  const notifications = 3;

  // Données des conventions
  const conventions: Convention[] = [
    {
      id: 1,
      title: "Convention de Coopération Académique",
      partner: "Université de Paris",
      partnerLogo: "🏛️",
      type: "Académique",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2026-01-15",
      value: "150,000 €",
      description: "Échange d'étudiants et de professeurs, recherches conjointes",
      progress: 75,
      category: "education",
      priority: "high",
      documents: 12,
      lastUpdate: "2024-11-20"
    },
    {
      id: 2,
      title: "Partenariat Recherche Hydraulique",
      partner: "CIRAD",
      partnerLogo: "🔬",
      type: "Recherche",
      status: "active",
      startDate: "2023-09-01",
      endDate: "2025-09-01",
      value: "85,000 €",
      description: "Recherche sur l'irrigation intelligente en zone sahélienne",
      progress: 60,
      category: "research",
      priority: "high",
      documents: 8,
      lastUpdate: "2024-11-18"
    },
    {
      id: 3,
      title: "Convention Stage Étudiants",
      partner: "EIFFAGE",
      partnerLogo: "🏗️",
      type: "Professionnel",
      status: "pending",
      startDate: "2024-03-01",
      endDate: "2025-03-01",
      value: "45,000 €",
      description: "Programme de stages en ingénierie civile",
      progress: 25,
      category: "industry",
      priority: "medium",
      documents: 5,
      lastUpdate: "2024-11-15"
    },
    {
      id: 4,
      title: "Accord Échange Technologique",
      partner: "Mines ParisTech",
      partnerLogo: "⚡",
      type: "Technologie",
      status: "draft",
      startDate: "2024-06-01",
      endDate: "2027-06-01",
      value: "200,000 €",
      description: "Transfert de technologies énergétiques durables",
      progress: 10,
      category: "technology",
      priority: "high",
      documents: 3,
      lastUpdate: "2024-11-10"
    },
    {
      id: 5,
      title: "Convention Formation Continue",
      partner: "TOTAL ENERGIES",
      partnerLogo: "⛽",
      type: "Formation",
      status: "active",
      startDate: "2023-11-01",
      endDate: "2024-11-01",
      value: "75,000 €",
      description: "Formation continue en énergies renouvelables",
      progress: 90,
      category: "training",
      priority: "medium",
      documents: 15,
      lastUpdate: "2024-11-22"
    },
    {
      id: 6,
      title: "Partenariat Innovation Agricole",
      partner: "CGIAR",
      partnerLogo: "🌾",
      type: "Innovation",
      status: "expired",
      startDate: "2022-01-01",
      endDate: "2024-01-01",
      value: "120,000 €",
      description: "Développement de solutions agricoles innovantes",
      progress: 100,
      category: "agriculture",
      priority: "low",
      documents: 20,
      lastUpdate: "2024-01-01"
    },
    {
      id: 7,
      title: "Convention Mobilité Étudiante",
      partner: "Université Cheikh Anta Diop",
      partnerLogo: "🎓",
      type: "Mobilité",
      status: "active",
      startDate: "2024-02-01",
      endDate: "2026-02-01",
      value: "60,000 €",
      description: "Programme d'échange d'étudiants ouest-africains",
      progress: 45,
      category: "education",
      priority: "medium",
      documents: 7,
      lastUpdate: "2024-11-20"
    },
    {
      id: 8,
      title: "Accord Recherche Environnementale",
      partner: "IRD",
      partnerLogo: "🌍",
      type: "Environnement",
      status: "pending",
      startDate: "2024-04-01",
      endDate: "2026-04-01",
      value: "95,000 €",
      description: "Étude de l'impact climatique en Afrique de l'Ouest",
      progress: 15,
      category: "environment",
      priority: "high",
      documents: 4,
      lastUpdate: "2024-11-12"
    },
    {
      id: 9,
      title: "Convention Entrepreneuriat",
      partner: "Groupe COFINA",
      partnerLogo: "💼",
      type: "Entrepreneuriat",
      status: "draft",
      startDate: "2024-07-01",
      endDate: "2025-07-01",
      value: "40,000 €",
      description: "Incubation de startups technologiques",
      progress: 5,
      category: "business",
      priority: "medium",
      documents: 2,
      lastUpdate: "2024-11-08"
    }
  ];

  // Filtrage des conventions
  const filteredConventions = conventions.filter(convention => {
    const matchesSearch = convention.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         convention.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         convention.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || convention.status === selectedStatus;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'draft': return 'bg-blue-100 text-blue-700';
      case 'expired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending': return 'En attente';
      case 'draft': return 'Brouillon';
      case 'expired': return 'Expirée';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
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

      {/* Main Content */}
      <div className="ml-[22rem]">
        {/* Top Header */}
        <div className="mx-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-0 z-40">
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
                  {['all', 'active', 'pending', 'draft', 'expired'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status as 'all' | 'active' | 'pending' | 'draft' | 'expired')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedStatus === status
                          ? 'bg-[#023047] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status === 'all' ? 'Tous' : 
                       status === 'active' ? 'Actives' :
                       status === 'pending' ? 'En attente' :
                       status === 'draft' ? 'Brouillons' : 'Expirées'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-green-700">{conventions.filter(c => c.status === 'active').length}</div>
                  <div className="text-base text-green-600 font-medium">Actives</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-yellow-700">{conventions.filter(c => c.status === 'pending').length}</div>
                  <div className="text-base text-yellow-600 font-medium">En attente</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-blue-700">{conventions.filter(c => c.status === 'draft').length}</div>
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

        {/* Conventions Section - Fixed with scrollable content and aligned margins */}
        <div className="mx-6 mt-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-[calc(100vh-280px)] flex flex-col">
            {/* Header fixe */}
            <div className="p-6 pb-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-black text-xl">
                  Conventions ({filteredConventions.length})
                </h2>
                <button className="px-4 py-2 bg-[#023047] text-white rounded-lg hover:bg-[#0f4c5c] transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle</span>
                </button>
              </div>
            </div>

            {/* Contenu défilable */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {filteredConventions.map((convention) => (
                  <div key={convention.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#023047] transition-all duration-200 shadow-sm hover:shadow-md">
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-[#023047] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{convention.documents}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(convention.status)}`}>
                          {getStatusText(convention.status)}
                        </div>
                      </div>

                      {/* Title and Partner */}
                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{convention.title}</h3>
                        <p className="text-xs text-gray-600 flex items-center">
                          <span className="mr-1">{convention.partnerLogo}</span>
                          {convention.partner}
                        </p>
                      </div>

                      {/* Type and Value */}
                      <div className="mb-3">
                        <div className="text-xs text-gray-700 font-medium mb-1 bg-gray-100 px-2 py-1 rounded text-center">
                          {convention.type}
                        </div>
                        <div className="text-sm font-bold text-[#023047]">{convention.value}</div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">Progression</span>
                          <span className="text-xs font-medium">{convention.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#023047] h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${convention.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="mb-4 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Début: {new Date(convention.startDate).toLocaleDateString('fr-FR')}</span>
                          <span>Fin: {new Date(convention.endDate).toLocaleDateString('fr-FR')}</span>
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
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedConvention.partnerLogo}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{selectedConvention.title}</h3>
                    <p className="text-sm text-gray-600">{selectedConvention.partner}</p>
                  </div>
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
                    <div><span className="font-medium">Type:</span> {selectedConvention.type}</div>
                    <div><span className="font-medium">Valeur:</span> {selectedConvention.value}</div>
                    <div><span className="font-medium">Statut:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedConvention.status)}`}>
                        {getStatusText(selectedConvention.status)}
                      </span>
                    </div>
                    <div><span className="font-medium">Priorité:</span> 
                      <span className={`ml-2 font-semibold ${getPriorityColor(selectedConvention.priority)}`}>
                        {selectedConvention.priority === 'high' ? 'Élevée' : 
                         selectedConvention.priority === 'medium' ? 'Moyenne' : 'Faible'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Dates et progression</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Début:</span> {new Date(selectedConvention.startDate).toLocaleDateString('fr-FR')}</div>
                    <div><span className="font-medium">Fin:</span> {new Date(selectedConvention.endDate).toLocaleDateString('fr-FR')}</div>
                    <div><span className="font-medium">Progression:</span> {selectedConvention.progress}%</div>
                    <div><span className="font-medium">Documents:</span> {selectedConvention.documents}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                <p className="text-sm text-gray-700">{selectedConvention.description}</p>
              </div>

              <div className="bg-white rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Barre de progression</h4>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-[#023047] h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${selectedConvention.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Progression: {selectedConvention.progress}%</p>
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
    </div>
  );
}
