'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Calendar,
  Users,
  Download,
  Upload,
  Eye,
  Edit,
  Send,
  Archive,
  RefreshCw
} from 'lucide-react';

interface PartnershipItem {
  id: number;
  name: string;
  type: string;
  status: string;
  category: string;
  priority: string;
  daysLeft: number;
  progress: number;
  country: string;
  contact: string;
}

interface Partner {
  id: number;
  name: string;
  category: string;
  country: string;
  type: string;
  status: string;
  logo: string;
  conventions: number;
  lastContact: string;
  priority: string;
  rating: number;
  isActive: boolean;
  nextAction: string;
  dateAdded: string;
  conventionsList: Array<{
    id: number;
    title: string;
    date: string;
    status: string;
  }>;
}

export default function PartnershipManagementPage() {
  const [partnershipItems, setPartnershipItems] = useState<PartnershipItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(5);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('accueil');

  // Données utilisateur
  const user = {
    name: "Dr. Amadou Traoré",
    position: "Directeur des Partenariats",
    location: "2iE, Ouagadougou",
    avatar: "👨🏾‍💼"
  };

  const categories = [
    { id: 'all', name: 'Tout', icon: Grid3X3, color: 'bg-gray-100' },
    { id: 'academic', name: 'Académique', icon: Award, color: 'bg-blue-100' },
    { id: 'corporate', name: 'Entreprises', icon: Building2, color: 'bg-green-100' },
    { id: 'government', name: 'Gouvernement', icon: Globe, color: 'bg-purple-100' },
    { id: 'ngo', name: 'ONG', icon: Handshake, color: 'bg-orange-100' },
    { id: 'international', name: 'International', icon: Target, color: 'bg-red-100' },
    { id: 'research', name: 'Recherche', icon: Briefcase, color: 'bg-yellow-100' }
  ];

  const partners = [
    {
      id: 1,
      name: "SONATEL Group",
      category: 'corporate',
      country: "Sénégal",
      type: "Partenariat Technologique",
      status: "active",
      logo: "📱",
      conventions: 3,
      lastContact: "Il y a 2 jours",
      priority: "high",
      rating: 4.8,
      isActive: true,
      nextAction: "Renouvellement dans 45 jours",
      dateAdded: "2024-01-15",
      conventionsList: [
        { id: 1, title: "Convention Stage Télécoms", date: "2023-03-15", status: "Actif" },
        { id: 2, title: "Accord Innovation Mobile", date: "2023-08-22", status: "Actif" },
        { id: 3, title: "Partenariat Recherche 5G", date: "2024-01-10", status: "En cours" }
      ]
    },
    {
      id: 2,
      name: "ECOBANK Burkina",
      category: 'corporate',
      country: "Burkina Faso",
      type: "Financement Étudiant",
      status: "pending",
      logo: "🏦",
      conventions: 1,
      lastContact: "Il y a 1 semaine",
      priority: "medium",
      rating: 4.5,
      isActive: false,
      nextAction: "Signature en attente",
      dateAdded: "2024-03-22",
      conventionsList: [
        { id: 4, title: "Accord Financement Études", date: "2024-03-20", status: "En attente" }
      ]
    },
    {
      id: 3,
      name: "Université Laval",
      category: 'academic',
      country: "Canada",
      type: "Échange Académique",
      status: "active",
      logo: "🎓",
      conventions: 2,
      lastContact: "Il y a 3 jours",
      priority: "high",
      rating: 4.9,
      isActive: true,
      nextAction: "Évaluation programme",
      dateAdded: "2023-11-08",
      conventionsList: [
        { id: 5, title: "Convention Échange Étudiants", date: "2023-09-15", status: "Actif" },
        { id: 6, title: "Accord Recherche Conjointe", date: "2023-11-01", status: "Actif" }
      ]
    },
    {
      id: 4,
      name: "Orange Côte d'Ivoire",
      category: 'corporate',
      country: "Côte d'Ivoire",
      type: "Innovation Digitale",
      status: "negotiation",
      logo: "🍊",
      conventions: 0,
      lastContact: "Hier",
      priority: "high",
      rating: 0,
      isActive: false,
      nextAction: "Négociation en cours",
      dateAdded: "2024-09-10",
      conventionsList: []
    },
    {
      id: 5,
      name: "Ministère de l'Eau BF",
      category: 'government',
      country: "Burkina Faso",
      type: "Recherche Hydraulique",
      status: "active",
      logo: "💧",
      conventions: 1,
      lastContact: "Il y a 5 jours",
      priority: "medium",
      rating: 4.3,
      isActive: true,
      nextAction: "Rapport annuel",
      dateAdded: "2024-02-14",
      conventionsList: [
        { id: 7, title: "Convention Recherche Hydraulique", date: "2024-01-30", status: "Actif" }
      ]
    },
    {
      id: 6,
      name: "World Bank Group",
      category: 'international',
      country: "International",
      type: "Développement Durable",
      status: "active",
      logo: "🌍",
      conventions: 2,
      lastContact: "Il y a 1 semaine",
      priority: "high",
      rating: 4.7,
      isActive: true,
      nextAction: "Suivi projet",
      dateAdded: "2023-12-05",
      conventionsList: [
        { id: 8, title: "Accord Développement Durable", date: "2023-11-20", status: "Actif" },
        { id: 9, title: "Convention Financement Projet", date: "2023-12-01", status: "Actif" }
      ]
    }
  ];

  const stats = [
    {
      title: 'Partenaires Actifs',
      value: '24',
      change: '+12%',
      icon: Building2,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      trend: 'up'
    },
    {
      title: 'Conventions Signées',
      value: '18',
      change: '+8%',
      icon: FileText,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      trend: 'up'
    },
    {
      title: 'En Négociation',
      value: '5',
      change: '+15%',
      icon: Handshake,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
      trend: 'up'
    },
    {
      title: 'Renouvellements',
      value: '3',
      change: '-1',
      icon: Clock,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      trend: 'down'
    }
  ];

  const filteredPartners = partners.filter(partner => {
    const matchesCategory = selectedCategory === 'all' || partner.category === selectedCategory;
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         partner.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToPortfolio = (partner: Partner) => {
    console.log('Adding partner to portfolio:', partner.name);
    // Logique d'ajout au portfolio
  };

  const showPartnerDetails = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowDetailsPopup(true);
  };

  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedPartner(null);
  };

  const goToConvention = (conventionId: number, partnerName: string) => {
    // Redirection vers la page des conventions avec l'ID de la convention
    console.log(`Redirection vers convention ${conventionId} du partenaire ${partnerName}`);
    // Ici vous pouvez utiliser Next.js router pour naviguer
    // router.push(`/conventions/${conventionId}`);
    window.location.href = `/conventions?id=${conventionId}&partner=${encodeURIComponent(partnerName)}`;
  };

  const updateProgress = useCallback(() => {
    // Logique de mise à jour du progrès
  }, []);

  useEffect(() => {
    updateProgress();
  }, [updateProgress]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-lg fixed left-0 top-0 h-full z-50 overflow-y-auto">
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
              <button className="w-full text-left px-3 py-2 rounded-lg bg-[#023047] text-white text-sm font-medium">
                Tableau de bord
              </button>
              <button 
                onClick={() => window.location.href = '/conventions'}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm font-medium transition-colors"
              >
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

          {/* Categories Section */}
          <div className="border-t pt-4">
            <div className="mb-3">
              <h2 className="font-semibold text-black">Catégories</h2>
            </div>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? 'bg-gray-500 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${selectedCategory === category.id ? 'text-white' : 'text-black'}`} />
                    <span className={`text-sm font-medium ${selectedCategory === category.id ? 'text-white' : 'text-black'}`}>
                      {category.name}
                    </span>
                  </button>
                );
              })}
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
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-6 py-4">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher partenaires, conventions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className={`${stat.bgColor} p-4 rounded-xl border border-gray-200`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-700 font-medium">{stat.title}</div>
                      <div className={`text-xs mt-1 font-semibold ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {stat.change}
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                      <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto pb-32">
          {/* Partners */}
          <div className="px-6 py-6 flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-black text-xl">
                {selectedCategory === 'all' ? 'Tous les partenaires' : categories.find(c => c.id === selectedCategory)?.name}
                <span className="text-sm text-black ml-2">({filteredPartners.length})</span>
              </h2>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredPartners.map((partner) => (
              <div key={partner.id} className="bg-white rounded-lg border border-neutral-light overflow-hidden transition-all duration-200 hover:border-primary-medium">
                <div className="p-3 pt-6">
                  {/* Header avec logo et statut */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-lg mb-1">{partner.logo}</div>
                    <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                      partner.status === 'active' ? 'bg-green-100 text-green-600' :
                      partner.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      partner.status === 'negotiation' ? 'bg-primary-dark text-white' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {partner.status === 'active' ? 'Actif' :
                       partner.status === 'pending' ? 'En attente' :
                       partner.status === 'negotiation' ? 'Négociation' : 'Inactif'}
                    </div>
                  </div>

                  {/* Nom et pays avec priorité */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-black text-sm leading-tight">{partner.name}</h3>
                      <div className="flex items-center space-x-1">
                        {partner.priority === 'high' && (
                          <>
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          </>
                        )}
                        {partner.priority === 'medium' && (
                          <>
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                          </>
                        )}
                        {partner.priority === 'low' && (
                          <>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{partner.country}</div>
                  </div>

                  {/* Type de partenariat - Bande amincie gris ciel */}
                  <div className="text-xs text-gray-700 font-medium mb-2 bg-gray-200 px-2 py-0.5 rounded text-center">
                    {partner.type}
                  </div>
                  
                  {/* Rating et conventions */}
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <div className="flex items-center">
                      {partner.rating > 0 && (
                        <span className="text-black">{partner.rating}/5</span>
                      )}
                    </div>
                    <span className="text-black">{partner.conventions} conv.</span>
                  </div>

                  {/* Date d'ajout */}
                  <div className="text-xs text-gray-600 mb-2 flex items-center">
                    <span className="font-medium">Ajouté le:</span>
                    <span className="ml-1">{new Date(partner.dateAdded).toLocaleDateString('fr-FR')}</span>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex flex-col space-y-2 mt-6 mb-3">
                    <button 
                      onClick={() => showPartnerDetails(partner)}
                      className="text-black text-xs font-medium bg-gray-100 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-300 hover:text-gray-800 transition-all duration-200 transform hover:scale-105"
                    >
                      Voir détails
                    </button>
                    
                    <button
                      onClick={() => addToPortfolio(partner)}
                      className="px-2 py-1.5 bg-primary-dark text-white text-xs rounded hover:bg-primary-medium transition-all duration-200"
                    >
                      Gérer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Floating Button */}
      <div className="fixed bottom-20 right-4">
        <button className="w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2 px-2">
          <button 
            onClick={() => setActiveNavItem('accueil')}
            className={`flex flex-col items-center px-6 py-3 rounded-full transition-all duration-200 cursor-pointer hover:bg-gray-100 transform hover:scale-105 ${
              activeNavItem === 'accueil' ? 'bg-gray-300' : ''
            }`}
          >
            <Home className={`w-5 h-5 ${activeNavItem === 'accueil' ? 'text-gray-800' : 'text-gray-600'}`} />
            <span className={`text-xs mt-1 font-medium ${activeNavItem === 'accueil' ? 'text-gray-800' : 'text-gray-600'}`}>Accueil</span>
          </button>
          <button 
            onClick={() => setActiveNavItem('partenaires')}
            className={`flex flex-col items-center px-6 py-3 rounded-full transition-all duration-200 cursor-pointer hover:bg-gray-100 transform hover:scale-105 ${
              activeNavItem === 'partenaires' ? 'bg-gray-300' : ''
            }`}
          >
            <Building2 className={`w-5 h-5 ${activeNavItem === 'partenaires' ? 'text-gray-800' : 'text-gray-600'}`} />
            <span className={`text-xs mt-1 font-medium ${activeNavItem === 'partenaires' ? 'text-gray-800' : 'text-gray-600'}`}>Partenaires</span>
          </button>
          <a
            href="/conventions"
            className={`flex flex-col items-center px-6 py-3 rounded-full transition-all duration-200 cursor-pointer hover:bg-gray-100 transform hover:scale-105 ${
              activeNavItem === 'conventions' ? 'bg-gray-300' : ''
            }`}
          >
            <FileText className={`w-5 h-5 ${activeNavItem === 'conventions' ? 'text-gray-800' : 'text-gray-600'}`} />
            <span className={`text-xs mt-1 font-medium ${activeNavItem === 'conventions' ? 'text-gray-800' : 'text-gray-600'}`}>Conventions</span>
          </a>
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

      {/* Popup des détails du partenaire */}
      {showDetailsPopup && selectedPartner && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-gray-200 rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            {/* Header du popup */}
            <div className="p-6 border-b border-gray-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedPartner.logo}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{selectedPartner.name}</h3>
                    <p className="text-sm text-gray-600">{selectedPartner.country}</p>
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

            {/* Corps du popup */}
            <div className="p-6">
              <h4 className="text-md font-semibold text-gray-800 mb-4">
                Conventions ({selectedPartner.conventions})
              </h4>
              
              {selectedPartner.conventionsList.length > 0 ? (
                <div className="space-y-3">
                  {selectedPartner.conventionsList.map((convention) => (
                    <div 
                      key={convention.id} 
                      onClick={() => goToConvention(convention.id, selectedPartner.name)}
                      className="bg-white rounded-2xl p-4 border border-gray-300 cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-800 hover:text-blue-600 transition-colors">{convention.title}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          convention.status === 'Actif' ? 'bg-green-100 text-green-700' :
                          convention.status === 'En cours' ? 'bg-blue-100 text-blue-700' :
                          convention.status === 'En attente' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {convention.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(convention.date).toLocaleDateString('fr-FR')}
                      </p>
                      <div className="mt-2 text-xs text-blue-500 font-medium">
                        Cliquer pour voir les détails →
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Aucune convention signée pour le moment.</p>
                </div>
              )}
            </div>

            {/* Footer du popup */}
            <div className="p-6 border-t border-gray-300">
              <button 
                onClick={closeDetailsPopup}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}



