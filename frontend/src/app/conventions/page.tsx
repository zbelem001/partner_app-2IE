'use client';

import React, { useState } from 'react';
import {
  Search,
  User,
  Bell,
  MapPin,
  Building2,
  FileText,
  Plus,
  Grid3X3,
  Home,
  BarChart3,
  Settings,
  Globe,
  Handshake,
  Target,
  Award,
  Briefcase,
  Clock,
  Calendar,
  Download,
  Eye,
  Edit,
  Archive,
  Filter,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  XCircle
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
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeNavItem, setActiveNavItem] = useState('conventions');
  const [notifications] = useState(5);

  // Données utilisateur
  const user = {
    name: "Dr. Amadou Traoré",
    position: "Directeur des Partenariats",
    location: "2iE, Ouagadougou",
    avatar: "👨🏾‍💼"
  };

  const conventions: Convention[] = [
    {
      id: 1,
      title: "Convention Stage Télécoms",
      partner: "SONATEL Group",
      partnerLogo: "📱",
      type: "Stage Professionnel",
      status: "active",
      startDate: "2023-03-15",
      endDate: "2025-03-15",
      value: "2,500,000 FCFA",
      description: "Convention pour l'accueil des étudiants en stage dans le domaine des télécommunications",
      progress: 75,
      category: "corporate",
      priority: "high",
      documents: 8,
      lastUpdate: "2024-09-15"
    },
    {
      id: 2,
      title: "Accord Innovation Mobile",
      partner: "SONATEL Group",
      partnerLogo: "📱",
      type: "Recherche & Innovation",
      status: "active",
      startDate: "2023-08-22",
      endDate: "2024-12-31",
      value: "5,000,000 FCFA",
      description: "Partenariat pour le développement d'applications mobiles innovantes",
      progress: 90,
      category: "corporate",
      priority: "high",
      documents: 12,
      lastUpdate: "2024-09-20"
    },
    {
      id: 3,
      title: "Partenariat Recherche 5G",
      partner: "SONATEL Group",
      partnerLogo: "📱",
      type: "Recherche Technologique",
      status: "pending",
      startDate: "2024-01-10",
      endDate: "2026-01-10",
      value: "10,000,000 FCFA",
      description: "Recherche collaborative sur les technologies 5G et IoT",
      progress: 25,
      category: "corporate",
      priority: "high",
      documents: 5,
      lastUpdate: "2024-09-18"
    },
    {
      id: 4,
      title: "Accord Financement Études",
      partner: "ECOBANK Burkina",
      partnerLogo: "🏦",
      type: "Financement",
      status: "pending",
      startDate: "2024-03-20",
      endDate: "2025-03-20",
      value: "15,000,000 FCFA",
      description: "Programme de financement des études pour les étudiants méritants",
      progress: 10,
      category: "corporate",
      priority: "medium",
      documents: 3,
      lastUpdate: "2024-09-10"
    },
    {
      id: 5,
      title: "Convention Échange Étudiants",
      partner: "Université Laval",
      partnerLogo: "🎓",
      type: "Échange Académique",
      status: "active",
      startDate: "2023-09-15",
      endDate: "2025-09-15",
      value: "3,000,000 FCFA",
      description: "Programme d'échange d'étudiants entre 2iE et l'Université Laval",
      progress: 80,
      category: "academic",
      priority: "high",
      documents: 15,
      lastUpdate: "2024-09-12"
    },
    {
      id: 6,
      title: "Accord Recherche Conjointe",
      partner: "Université Laval",
      partnerLogo: "🎓",
      type: "Recherche Collaborative",
      status: "active",
      startDate: "2023-11-01",
      endDate: "2024-11-01",
      value: "8,000,000 FCFA",
      description: "Projets de recherche conjoints en ingénierie environnementale",
      progress: 95,
      category: "academic",
      priority: "high",
      documents: 20,
      lastUpdate: "2024-09-22"
    },
    {
      id: 7,
      title: "Convention Recherche Hydraulique",
      partner: "Ministère de l'Eau BF",
      partnerLogo: "💧",
      type: "Recherche Publique",
      status: "active",
      startDate: "2024-01-30",
      endDate: "2025-01-30",
      value: "6,000,000 FCFA",
      description: "Recherche sur la gestion durable des ressources en eau",
      progress: 45,
      category: "government",
      priority: "medium",
      documents: 10,
      lastUpdate: "2024-09-08"
    },
    {
      id: 8,
      title: "Accord Développement Durable",
      partner: "World Bank Group",
      partnerLogo: "🌍",
      type: "Développement",
      status: "active",
      startDate: "2023-11-20",
      endDate: "2025-11-20",
      value: "25,000,000 FCFA",
      description: "Programme de développement durable et énergies renouvelables",
      progress: 60,
      category: "international",
      priority: "high",
      documents: 25,
      lastUpdate: "2024-09-16"
    },
    {
      id: 9,
      title: "Convention Financement Projet",
      partner: "World Bank Group",
      partnerLogo: "🌍",
      type: "Financement de Projet",
      status: "draft",
      startDate: "2024-12-01",
      endDate: "2027-12-01",
      value: "50,000,000 FCFA",
      description: "Financement pour la construction du nouveau campus technologique",
      progress: 5,
      category: "international",
      priority: "high",
      documents: 2,
      lastUpdate: "2024-09-21"
    }
  ];

  const categories = [
    { id: 'all', name: 'Toutes', icon: Grid3X3 },
    { id: 'academic', name: 'Académique', icon: Award },
    { id: 'corporate', name: 'Entreprises', icon: Building2 },
    { id: 'government', name: 'Gouvernement', icon: Globe },
    { id: 'international', name: 'International', icon: Target }
  ];

  const statusOptions = [
    { id: 'all', name: 'Tous les statuts', color: 'text-gray-600' },
    { id: 'active', name: 'Actives', color: 'text-green-600' },
    { id: 'pending', name: 'En attente', color: 'text-yellow-600' },
    { id: 'draft', name: 'Brouillons', color: 'text-blue-600' },
    { id: 'expired', name: 'Expirées', color: 'text-red-600' }
  ];

  const filteredConventions = conventions.filter(convention => {
    const matchesSearch = convention.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         convention.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         convention.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || convention.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || convention.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'draft': return <Edit className="w-4 h-4 text-blue-600" />;
      case 'expired': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending': return 'En attente';
      case 'draft': return 'Brouillon';
      case 'expired': return 'Expirée';
      default: return 'Inconnu';
    }
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{user.avatar}</div>
              <div>
                <h1 className="font-semibold text-black">Conventions - {user.name}</h1>
                <div className="flex items-center text-xs text-black">
                  <MapPin className="w-3 h-3 mr-1" />
                  {user.location}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{notifications}</span>
              </button>
              <button className="p-2">
                <User className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex space-x-2">
                <a 
                  href="/login"
                  className="px-3 py-1.5 bg-gray-400 text-white text-sm rounded-lg hover:bg-gray-500 transition-all duration-200"
                >
                  Déconnexion
                </a>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher conventions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-3 overflow-x-auto pb-2 mb-3">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              {statusOptions.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-green-50 p-3 rounded-xl">
              <div className="text-lg font-bold text-green-700">{conventions.filter(c => c.status === 'active').length}</div>
              <div className="text-xs text-green-600 font-medium">Actives</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-xl">
              <div className="text-lg font-bold text-yellow-700">{conventions.filter(c => c.status === 'pending').length}</div>
              <div className="text-xs text-yellow-600 font-medium">En attente</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <div className="text-lg font-bold text-blue-700">{conventions.filter(c => c.status === 'draft').length}</div>
              <div className="text-xs text-blue-600 font-medium">Brouillons</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <div className="text-lg font-bold text-gray-700">{conventions.length}</div>
              <div className="text-xs text-gray-600 font-medium">Total</div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-4 pb-32">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-black">
            Conventions ({filteredConventions.length})
          </h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nouvelle</span>
          </button>
        </div>

        {/* Conventions List */}
        <div className="space-y-4">
          {filteredConventions.map((convention) => (
            <div key={convention.id} className="bg-white rounded-xl p-4 border border-gray-200">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{convention.partnerLogo}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{convention.title}</h3>
                    <p className="text-sm text-gray-600">{convention.partner}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(convention.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(convention.status)}`}>
                    {getStatusText(convention.status)}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-sm font-medium text-gray-900">{convention.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Valeur</p>
                  <p className="text-sm font-medium text-gray-900">{convention.value}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Début</p>
                  <p className="text-sm font-medium text-gray-900">{new Date(convention.startDate).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fin</p>
                  <p className="text-sm font-medium text-gray-900">{new Date(convention.endDate).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Progression</span>
                  <span className="text-xs font-medium text-gray-900">{convention.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${convention.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3">{convention.description}</p>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{convention.documents} documents</span>
                  <span>Modifié le {new Date(convention.lastUpdate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Archive className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredConventions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune convention trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4">
        <button className="w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2 px-2">
          <a
            href="/"
            onClick={() => setActiveNavItem('accueil')}
            className={`flex flex-col items-center px-6 py-3 rounded-full transition-all duration-200 cursor-pointer hover:bg-gray-100 transform hover:scale-105 ${
              activeNavItem === 'accueil' ? 'bg-gray-300' : ''
            }`}
          >
            <Home className={`w-5 h-5 ${activeNavItem === 'accueil' ? 'text-gray-800' : 'text-gray-600'}`} />
            <span className={`text-xs mt-1 font-medium ${activeNavItem === 'accueil' ? 'text-gray-800' : 'text-gray-600'}`}>Accueil</span>
          </a>
          <button 
            onClick={() => setActiveNavItem('partenaires')}
            className={`flex flex-col items-center px-6 py-3 rounded-full transition-all duration-200 cursor-pointer hover:bg-gray-100 transform hover:scale-105 ${
              activeNavItem === 'partenaires' ? 'bg-gray-300' : ''
            }`}
          >
            <Building2 className={`w-5 h-5 ${activeNavItem === 'partenaires' ? 'text-gray-800' : 'text-gray-600'}`} />
            <span className={`text-xs mt-1 font-medium ${activeNavItem === 'partenaires' ? 'text-gray-800' : 'text-gray-600'}`}>Partenaires</span>
          </button>
          <button 
            onClick={() => setActiveNavItem('conventions')}
            className={`flex flex-col items-center px-6 py-3 rounded-full transition-all duration-200 cursor-pointer hover:bg-gray-100 transform hover:scale-105 ${
              activeNavItem === 'conventions' ? 'bg-gray-300' : ''
            }`}
          >
            <FileText className={`w-5 h-5 ${activeNavItem === 'conventions' ? 'text-gray-800' : 'text-gray-600'}`} />
            <span className={`text-xs mt-1 font-medium ${activeNavItem === 'conventions' ? 'text-gray-800' : 'text-gray-600'}`}>Conventions</span>
          </button>
          <button 
            onClick={() => setActiveNavItem('rapports')}
            className={`flex flex-col items-center px-6 py-3 rounded-full transition-all duration-200 cursor-pointer hover:bg-gray-100 transform hover:scale-105 ${
              activeNavItem === 'rapports' ? 'bg-gray-300' : ''
            }`}
          >
            <BarChart3 className={`w-5 h-5 ${activeNavItem === 'rapports' ? 'text-gray-800' : 'text-gray-600'}`} />
            <span className={`text-xs mt-1 font-medium ${activeNavItem === 'rapports' ? 'text-gray-800' : 'text-gray-600'}`}>Rapports</span>
          </button>
          <button 
            onClick={() => setActiveNavItem('parametres')}
            className={`flex flex-col items-center px-6 py-3 rounded-full transition-all duration-200 cursor-pointer hover:bg-gray-100 transform hover:scale-105 ${
              activeNavItem === 'parametres' ? 'bg-gray-300' : ''
            }`}
          >
            <Settings className={`w-5 h-5 ${activeNavItem === 'parametres' ? 'text-gray-800' : 'text-gray-600'}`} />
            <span className={`text-xs mt-1 font-medium ${activeNavItem === 'parametres' ? 'text-gray-800' : 'text-gray-600'}`}>Paramètres</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
