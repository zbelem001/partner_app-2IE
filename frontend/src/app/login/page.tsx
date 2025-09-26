'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Building2, Phone, Briefcase, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Champs de connexion
    email: '',
    password: '',
    // Champs d'inscription (correspondent à la table utilisateurs)
    nom: '',
    prenom: '',
    telephone: '',
    role: 'lecteur', // Valeur par défaut
    service: '',
    confirmPassword: ''
  });
  
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulation de la connexion
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isLogin) {
        // Marquer l'utilisateur comme connecté dans localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userInfo', JSON.stringify({
          email: formData.email,
          nom: formData.nom || 'Utilisateur',
          prenom: formData.prenom || ''
        }));
        
        // Redirection vers le dashboard après connexion
        router.push('/dashboard');
      } else {
        // Après inscription, basculer vers connexion
        setIsLogin(true);
        setFormData({
          email: formData.email,
          password: '',
          confirmPassword: '',
          nom: '',
          prenom: '',
          telephone: '',
          role: 'lecteur',
          service: ''
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      nom: '',
      prenom: '',
      telephone: '',
      role: 'lecteur',
      service: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#023047] via-[#0f4c5c] to-[#1a5f72] relative overflow-hidden">
      {/* Éléments décoratifs de fond */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-white/3 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative flex min-h-screen">
        {/* Panneau gauche - Informations sur 2iE */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 text-white">
          <div className="max-w-lg">
            <div className="flex items-center mb-8">
              <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Institut 2iE</h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Plateforme de Gestion des 
              <span className="text-orange-400"> Partenariats</span>
            </h2>
            
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Gérez efficacement vos prospects, conventions et partenariats internationaux. 
              Rejoignez l&apos;écosystème 2iE pour développer votre réseau professionnel.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-orange-400 rounded-full mr-3"></div>
                <span className="text-white/80">Suivi des prospects en temps réel</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-orange-400 rounded-full mr-3"></div>
                <span className="text-white/80">Gestion des conventions simplifiée</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-orange-400 rounded-full mr-3"></div>
                <span className="text-white/80">Réseau de partenaires internationaux</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panneau droit - Formulaire de connexion */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full space-y-8">
            
            {/* Logo 2iE */}
            <div className="flex justify-start mb-6">
              <Image 
                src="/logo-2ie.png" 
                alt="Logo 2iE" 
                width={120}
                height={40}
                className="h-12 w-auto"
              />
            </div>

            {/* Formulaire */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6">
            
                {/* Champs d'inscription organisés en colonnes */}
                {!isLogin && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Colonne gauche */}
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="nom" className="block text-sm font-medium text-white mb-3">
                          Nom *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-white/60" />
                          </div>
                          <input
                            id="nom"
                            name="nom"
                            type="text"
                            required={!isLogin}
                            value={formData.nom}
                            onChange={handleInputChange}
                            className="block w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                            placeholder="Nom de famille"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="telephone" className="block text-sm font-medium text-white mb-3">
                          Téléphone
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-white/60" />
                          </div>
                          <input
                            id="telephone"
                            name="telephone"
                            type="tel"
                            value={formData.telephone}
                            onChange={handleInputChange}
                            className="block w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                            placeholder="+226 70 00 00 00"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="service" className="block text-sm font-medium text-white mb-3">
                          Service
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Briefcase className="h-5 w-5 text-white/60" />
                          </div>
                          <select
                            id="service"
                            name="service"
                            value={formData.service}
                            onChange={handleInputChange}
                            className="block w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 appearance-none"
                          >
                            <option value="" className="bg-[#023047] text-white">-- Sélectionner une direction --</option>
                            <option value="Direction Générale" className="bg-[#023047] text-white">Direction Générale</option>
                            <option value="Direction de la Recherche" className="bg-[#023047] text-white">Direction de la Recherche</option>
                            <option value="Direction des Enseignements et des Affaires Académiques (DEAA)" className="bg-[#023047] text-white">Direction des Enseignements et des Affaires Académiques (DEAA)</option>
                            <option value="Direction des Finances et de la Comptabilité" className="bg-[#023047] text-white">Direction des Finances et de la Comptabilité</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Colonne droite */}
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="prenom" className="block text-sm font-medium text-white mb-3">
                          Prénom
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-white/60" />
                          </div>
                          <input
                            id="prenom"
                            name="prenom"
                            type="text"
                            value={formData.prenom}
                            onChange={handleInputChange}
                            className="block w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                            placeholder="Prénom (optionnel)"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-white mb-3">
                          Rôle *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <UserCheck className="h-5 w-5 text-white/60" />
                          </div>
                          <select
                            id="role"
                            name="role"
                            required={!isLogin}
                            value={formData.role}
                            onChange={handleInputChange}
                            className="block w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 appearance-none"
                          >
                            <option value="lecteur" className="bg-[#023047] text-white">Lecteur (Consultation)</option>
                            <option value="suivi" className="bg-[#023047] text-white">Suivi (Gestion projets)</option>
                            <option value="responsable" className="bg-[#023047] text-white">Responsable (Gestion complète)</option>
                            <option value="admin" className="bg-[#023047] text-white">Administrateur</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-3">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-white/60" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-3">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-white/60" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-12 pr-12 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-white/60 hover:text-white focus:outline-none transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Confirmation mot de passe (seulement pour l'inscription) */}
                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-3">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-white/60" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required={!isLogin}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="block w-full pl-12 pr-12 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                        placeholder="••••••••"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-white/60 hover:text-white focus:outline-none transition-colors duration-200"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mot de passe oublié (seulement pour la connexion) */}
                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-orange-400 bg-white/20 border-white/30 rounded focus:ring-orange-400 focus:ring-2"
                      />
                      <label htmlFor="remember-me" className="ml-3 block text-sm text-white/80">
                        Se souvenir de moi
                      </label>
                    </div>
                    <a href="#" className="text-sm text-orange-400 hover:text-orange-300 transition-colors duration-200 font-medium">
                      Mot de passe oublié ?
                    </a>
                  </div>
                )}

                {/* Bouton de soumission */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        Connexion...
                      </div>
                    ) : (
                      <>
                        <span className="absolute left-0 inset-y-0 flex items-center pl-6">
                          <ArrowRight className="h-5 w-5 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                        </span>
                        {isLogin ? 'Se connecter' : 'Créer mon compte'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Bascule entre connexion et inscription */}
            <div className="text-center mt-8">
              <p className="text-white/80">
                {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
                {isLogin ? (
                  <button
                    onClick={toggleMode}
                    className="ml-2 font-semibold text-orange-400 hover:text-orange-300 focus:outline-none transition-colors duration-200"
                  >
                    Inscrivez-vous
                  </button>
                ) : (
                  <button
                    onClick={toggleMode}
                    className="ml-2 font-semibold text-orange-400 hover:text-orange-300 focus:outline-none transition-colors duration-200"
                  >
                    Connectez-vous
                  </button>
                )}
              </p>
            </div>

            {/* Séparateur */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-r from-transparent via-[#0f4c5c] to-transparent text-white/60 font-medium">
                    Ou continuer avec
                  </span>
                </div>
              </div>
            </div>

            {/* Options de connexion sociale */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center py-3 px-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200 group">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>

              <button className="flex items-center justify-center py-3 px-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200 group">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
