'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import {
  User,
  Bell,
  Users,
  Briefcase,
  Building2,
  Handshake,
  Globe
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { displayUser } = useAuth();

  // Vérification de l'authentification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (!isAuthenticated) {
        router.push('/');
      }
    }
  }, [router]);

  // États
  const notifications = 5;

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    router.push('/');
  };

  // Données utilisateur
  const user = {
    name: displayUser.name,
    position: displayUser.role,
    location: "2iE, Ouagadougou",
    avatar: displayUser.avatar
  };

  // Statistiques globales
  const globalStats = {
    prospects: {
      total: 127,
      en_contact: 45,
      qualifies: 32,
      abandonnes: 18,
      nouveaux_ce_mois: 12
    },
    conventions: {
      total: 84,
      en_cours: 34,
      signees: 41,
      expirees: 9,
      nouvelles_ce_mois: 8
    },
    partenaires: {
      total: 65,
      actifs: 48,
      inactifs: 17,
      nouveaux_ce_mois: 6
    },
    partenariats: {
      total: 92,
      actifs: 67,
      suspendus: 15,
      termines: 10,
      nouveaux_ce_mois: 5
    }
  };

  // Statistiques de workflow (conversions entre entités)
  const workflowStats = {
    conversions_ce_mois: {
      prospect_vers_convention: 8,
      convention_signee_vers_partenaire: 6,
      partenaire_vers_partenariat: 5
    },
    taux_conversion: {
      prospects_qualifies: Math.round((globalStats.prospects.qualifies / globalStats.prospects.total) * 100),
      conventions_signees: Math.round((globalStats.conventions.signees / globalStats.conventions.total) * 100),
      partenariats_actifs: Math.round((globalStats.partenariats.actifs / globalStats.partenariats.total) * 100)
    },
    pipeline: {
      prospects_en_attente: globalStats.prospects.en_contact,
      conventions_en_validation: globalStats.conventions.en_cours,
      partenariats_en_negociation: 12
    }
  };

  // Données pour les graphiques
  const chartData = {
    prospectsByMonth: [
      { mois: 'Jan', prospects: 8, conventions: 5 },
      { mois: 'Fév', prospects: 12, conventions: 7 },
      { mois: 'Mar', prospects: 15, conventions: 9 },
      { mois: 'Avr', prospects: 18, conventions: 11 },
      { mois: 'Mai', prospects: 22, conventions: 14 },
      { mois: 'Jun', prospects: 16, conventions: 12 }
    ],
    partnersByCountry: [
      { pays: 'Burkina Faso', nombre: 25 },
      { pays: 'France', nombre: 18 },
      { pays: 'Côte d\'Ivoire', nombre: 12 },
      { pays: 'Sénégal', nombre: 8 },
      { pays: 'Mali', nombre: 6 }
    ],
    conventionsByStatus: [
      { statut: 'Signées', nombre: 41, couleur: '#10B981' },
      { statut: 'En cours', nombre: 34, couleur: '#F59E0B' },
      { statut: 'Expirées', nombre: 9, couleur: '#EF4444' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-4 top-4 bottom-4 w-80 bg-white rounded-2xl shadow-sm border border-gray-200 z-30 overflow-y-auto">
        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="text-2xl">{user.avatar}</div>
            <div>
              <h1 className="font-semibold text-black">Bonjour {user.name}</h1>
              <p className="text-xs text-gray-500">{user.location}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-2 mb-6">
            <h2 className="font-semibold text-black mb-3">Navigation</h2>
            <button className="w-full text-left px-3 py-2 rounded-lg bg-[#023047] text-white text-sm font-medium">
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
            <button 
              onClick={() => router.push('/partenariats')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-black text-sm font-medium transition-colors"
            >
              Partenariats
            </button>
          </div>

          {/* Actions */}
          <div className="border-t pt-4">
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
      <div className="ml-[22rem] p-6">

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Prospects */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Prospects</h3>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{globalStats.prospects.total}</div>
              <div className="text-sm text-gray-600">Total prospects</div>
              <div className="flex justify-between text-xs">
                <span className="text-blue-600">{globalStats.prospects.en_contact} En contact</span>
                <span className="text-green-600">{globalStats.prospects.qualifies} Qualifiés</span>
                <span className="text-red-600">{globalStats.prospects.abandonnes} Abandonnés</span>
              </div>
              <div className="text-xs text-green-600 font-medium">+{globalStats.prospects.nouveaux_ce_mois} ce mois</div>
            </div>
          </div>

          {/* Conventions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Conventions</h3>
              <Briefcase className="w-5 h-5 text-amber-600" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{globalStats.conventions.total}</div>
              <div className="text-sm text-gray-600">Total conventions</div>
              <div className="flex justify-between text-xs">
                <span className="text-amber-600">{globalStats.conventions.en_cours} En cours</span>
                <span className="text-green-600">{globalStats.conventions.signees} Signées</span>
                <span className="text-red-600">{globalStats.conventions.expirees} Expirées</span>
              </div>
              <div className="text-xs text-green-600 font-medium">+{globalStats.conventions.nouvelles_ce_mois} ce mois</div>
            </div>
          </div>

          {/* Partenaires */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Partenaires</h3>
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{globalStats.partenaires.total}</div>
              <div className="text-sm text-gray-600">Total partenaires</div>
              <div className="flex justify-between text-xs">
                <span className="text-green-600">{globalStats.partenaires.actifs} Actifs</span>
                <span className="text-gray-600">{globalStats.partenaires.inactifs} Inactifs</span>
              </div>
              <div className="text-xs text-green-600 font-medium">+{globalStats.partenaires.nouveaux_ce_mois} ce mois</div>
            </div>
          </div>

          {/* Partenariats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Partenariats</h3>
              <Handshake className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{globalStats.partenariats.total}</div>
              <div className="text-sm text-gray-600">Total partenariats</div>
              <div className="flex justify-between text-xs">
                <span className="text-green-600">{globalStats.partenariats.actifs} Actifs</span>
                <span className="text-amber-600">{globalStats.partenariats.suspendus} Suspendus</span>
                <span className="text-gray-600">{globalStats.partenariats.termines} Terminés</span>
              </div>
              <div className="text-xs text-green-600 font-medium">+{globalStats.partenariats.nouveaux_ce_mois} ce mois</div>
            </div>
          </div>
        </div>

        {/* Section workflow - Visualisation du pipeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-6">Pipeline de conversion</h3>
          
          {/* Diagramme de flux */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col items-center space-y-2 flex-1">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{globalStats.prospects.total}</div>
                <div className="text-sm text-gray-600">Prospects</div>
                <div className="text-xs text-green-600 mt-1">
                  +{globalStats.prospects.nouveaux_ce_mois} ce mois
                </div>
              </div>
            </div>
            
            {/* Flèche 1 */}
            <div className="flex flex-col items-center mx-4">
              <div className="text-center bg-gray-50 px-3 py-1 rounded-lg">
                <div className="text-lg font-bold text-amber-600">{workflowStats.conversions_ce_mois.prospect_vers_convention}</div>
                <div className="text-xs text-gray-500">conversions</div>
              </div>
              <div className="w-8 h-0.5 bg-gray-400 mt-2"></div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-400"></div>
            </div>

            <div className="flex flex-col items-center space-y-2 flex-1">
              <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{globalStats.conventions.total}</div>
                <div className="text-sm text-gray-600">Conventions</div>
                <div className="text-xs text-green-600 mt-1">
                  +{globalStats.conventions.nouvelles_ce_mois} ce mois
                </div>
              </div>
            </div>

            {/* Flèche 2 */}
            <div className="flex flex-col items-center mx-4">
              <div className="text-center bg-gray-50 px-3 py-1 rounded-lg">
                <div className="text-lg font-bold text-green-600">{workflowStats.conversions_ce_mois.convention_signee_vers_partenaire}</div>
                <div className="text-xs text-gray-500">signatures</div>
              </div>
              <div className="w-8 h-0.5 bg-gray-400 mt-2"></div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-400"></div>
            </div>

            <div className="flex flex-col items-center space-y-2 flex-1">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{globalStats.partenaires.total}</div>
                <div className="text-sm text-gray-600">Partenaires</div>
                <div className="text-xs text-green-600 mt-1">
                  +{globalStats.partenaires.nouveaux_ce_mois} ce mois
                </div>
              </div>
            </div>

            {/* Flèche 3 */}
            <div className="flex flex-col items-center mx-4">
              <div className="text-center bg-gray-50 px-3 py-1 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{workflowStats.conversions_ce_mois.partenaire_vers_partenariat}</div>
                <div className="text-xs text-gray-500">nouveaux</div>
              </div>
              <div className="w-8 h-0.5 bg-gray-400 mt-2"></div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-400"></div>
            </div>

            <div className="flex flex-col items-center space-y-2 flex-1">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center">
                <Handshake className="w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{globalStats.partenariats.total}</div>
                <div className="text-sm text-gray-600">Partenariats</div>
                <div className="text-xs text-green-600 mt-1">
                  +{globalStats.partenariats.nouveaux_ce_mois} ce mois
                </div>
              </div>
            </div>
          </div>

          {/* Taux de conversion */}
          <div className="grid grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{workflowStats.taux_conversion.prospects_qualifies}%</div>
              <div className="text-sm text-gray-600">Prospects qualifiés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{workflowStats.taux_conversion.conventions_signees}%</div>
              <div className="text-sm text-gray-600">Conventions signées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{workflowStats.taux_conversion.partenariats_actifs}%</div>
              <div className="text-sm text-gray-600">Partenariats actifs</div>
            </div>
          </div>
        </div>

        {/* Graphiques et analyses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Graphique évolution prospects/conventions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Évolution Prospects & Conventions</h3>
            <div className="space-y-4">
              {chartData.prospectsByMonth.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="w-12 text-sm text-gray-600">{data.mois}</div>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{width: `${(data.prospects / 25) * 100}%`}}
                        ></div>
                      </div>
                      <span className="text-xs text-blue-600 w-8">{data.prospects}P</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full" 
                          style={{width: `${(data.conventions / 15) * 100}%`}}
                        ></div>
                      </div>
                      <span className="text-xs text-amber-600 w-8">{data.conventions}C</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center space-x-4 text-xs mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Prospects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span>Conventions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Répartition par pays */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Répartition géographique</h3>
            <div className="space-y-3">
              {chartData.partnersByCountry.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{data.pays}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                        style={{width: `${(data.nombre / 25) * 100}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{data.nombre}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statut des conventions - Graphique en barres */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Statut des conventions</h3>
          <div className="grid grid-cols-3 gap-4">
            {chartData.conventionsByStatus.map((data, index) => (
              <div key={index} className="text-center">
                <div className="relative w-full h-32 bg-gray-100 rounded-lg mb-2 overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full rounded-lg transition-all duration-500"
                    style={{
                      height: `${(data.nombre / 50) * 100}%`,
                      backgroundColor: data.couleur
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{data.nombre}</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-700">{data.statut}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
