'use client';

import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  Building,
  GraduationCap,
  ArrowRight,
  Check,
  AlertCircle
} from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  nationality: string;
  city: string;
  address: string;
  postalCode: string;
  institution: string;
  studentId: string;
  program: string;
  academicLevel: string;
  yearOfStudy: string;
  emergencyContact: string;
  emergencyPhone: string;
  agreeToTerms: boolean;
  agreeToNewsletter: boolean;
}

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    nationality: '',
    city: '',
    address: '',
    postalCode: '',
    institution: '',
    studentId: '',
    program: '',
    academicLevel: '',
    yearOfStudy: '',
    emergencyContact: '',
    emergencyPhone: '',
    agreeToTerms: false,
    agreeToNewsletter: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
        if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
        if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
        if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
        if (!formData.password.trim()) newErrors.password = 'Le mot de passe est requis';
        else if (formData.password.length < 8) newErrors.password = 'Minimum 8 caractères';
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }
        break;
      
      case 2:
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'La date de naissance est requise';
        if (!formData.nationality.trim()) newErrors.nationality = 'La nationalité est requise';
        if (!formData.city.trim()) newErrors.city = 'La ville est requise';
        if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
        break;
      
      case 3:
        if (!formData.institution.trim()) newErrors.institution = 'L\'établissement est requis';
        if (!formData.program.trim()) newErrors.program = 'La filière est requise';
        if (!formData.academicLevel) newErrors.academicLevel = 'Le niveau académique est requis';
        if (!formData.yearOfStudy) newErrors.yearOfStudy = 'L\'année d\'étude est requise';
        break;
      
      case 4:
        if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Le contact d\'urgence est requis';
        if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Le téléphone d\'urgence est requis';
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'Vous devez accepter les conditions';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(4)) {
      console.log('Form submitted:', formData);
      // Logique d'inscription à implémenter
    }
  };

  const steps = [
    { number: 1, title: 'Informations personnelles', icon: User },
    { number: 2, title: 'Adresse & Contact', icon: MapPin },
    { number: 3, title: 'Informations académiques', icon: GraduationCap },
    { number: 4, title: 'Contact d\'urgence & Finalisation', icon: Check },
  ];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
            currentStep >= step.number 
              ? 'bg-primary-dark text-white shadow-lg' 
              : 'bg-neutral-light text-primary-medium'
          }`}>
            {currentStep > step.number ? (
              <Check className="w-5 h-5" />
            ) : (
              <step.icon className="w-5 h-5" />
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
              currentStep > step.number ? 'bg-primary-dark' : 'bg-neutral-light'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-black mb-2">
            Prénom *
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium transition-all duration-200 ${
              errors.firstName ? 'border-red-500' : 'border-neutral-light'
            }`}
            placeholder="Votre prénom"
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-black mb-2">
            Nom *
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium transition-all duration-200 ${
              errors.lastName ? 'border-red-500' : 'border-neutral-light'
            }`}
            placeholder="Votre nom"
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
          Email *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-primary-medium" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium transition-all duration-200 ${
              errors.email ? 'border-red-500' : 'border-neutral-light'
            }`}
            placeholder="votre@email.com"
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Téléphone *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+226 XX XX XX XX"
          />
        </div>
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Mot de passe *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirmer le mot de passe *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
            Date de naissance *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
        </div>

        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
            Nationalité *
          </label>
          <input
            id="nationality"
            name="nationality"
            type="text"
            value={formData.nationality}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.nationality ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Burkinabè"
          />
          {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Adresse complète *
        </label>
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleInputChange}
          className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Rue, quartier, secteur..."
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            Ville *
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ouagadougou"
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>

        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
            Code postal
          </label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            value={formData.postalCode}
            onChange={handleInputChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Code postal"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
          Établissement d&apos;enseignement *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="institution"
            name="institution"
            type="text"
            value={formData.institution}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.institution ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Institut International d'Ingénierie de l'Eau et de l'Environnement"
          />
        </div>
        {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution}</p>}
      </div>

      <div>
        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
          Numéro étudiant
        </label>
        <input
          id="studentId"
          name="studentId"
          type="text"
          value={formData.studentId}
          onChange={handleInputChange}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Votre numéro étudiant"
        />
      </div>

      <div>
        <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">
          Filière/Programme d&apos;études *
        </label>
        <input
          id="program"
          name="program"
          type="text"
          value={formData.program}
          onChange={handleInputChange}
          className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.program ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Génie Civil, Informatique, Environnement..."
        />
        {errors.program && <p className="text-red-500 text-xs mt-1">{errors.program}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="academicLevel" className="block text-sm font-medium text-gray-700 mb-2">
            Niveau académique *
          </label>
          <select
            id="academicLevel"
            name="academicLevel"
            value={formData.academicLevel}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.academicLevel ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionnez un niveau</option>
            <option value="licence">Licence</option>
            <option value="master">Master</option>
            <option value="doctorat">Doctorat</option>
            <option value="ingenieur">Ingénieur</option>
          </select>
          {errors.academicLevel && <p className="text-red-500 text-xs mt-1">{errors.academicLevel}</p>}
        </div>

        <div>
          <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
            Année d&apos;étude *
          </label>
          <select
            id="yearOfStudy"
            name="yearOfStudy"
            value={formData.yearOfStudy}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.yearOfStudy ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionnez une année</option>
            <option value="1">1ère année</option>
            <option value="2">2ème année</option>
            <option value="3">3ème année</option>
            <option value="4">4ème année</option>
            <option value="5">5ème année</option>
          </select>
          {errors.yearOfStudy && <p className="text-red-500 text-xs mt-1">{errors.yearOfStudy}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Contact d&apos;urgence</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Ces informations seront utilisées uniquement en cas d&apos;urgence.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
          Contact d&apos;urgence (nom complet) *
        </label>
        <input
          id="emergencyContact"
          name="emergencyContact"
          type="text"
          value={formData.emergencyContact}
          onChange={handleInputChange}
          className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.emergencyContact ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Nom de votre contact d'urgence"
        />
        {errors.emergencyContact && <p className="text-red-500 text-xs mt-1">{errors.emergencyContact}</p>}
      </div>

      <div>
        <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-2">
          Téléphone du contact d&apos;urgence *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="emergencyPhone"
            name="emergencyPhone"
            type="tel"
            value={formData.emergencyPhone}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+226 XX XX XX XX"
          />
        </div>
        {errors.emergencyPhone && <p className="text-red-500 text-xs mt-1">{errors.emergencyPhone}</p>}
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <input
            id="agreeToTerms"
            name="agreeToTerms"
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-700">
            J&apos;accepte les{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500 underline">
              conditions d&apos;utilisation
            </a>{' '}
            et la{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500 underline">
              politique de confidentialité
            </a>{' '}
            *
          </label>
        </div>
        {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>}

        <div className="flex items-start">
          <input
            id="agreeToNewsletter"
            name="agreeToNewsletter"
            type="checkbox"
            checked={formData.agreeToNewsletter}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="agreeToNewsletter" className="ml-3 text-sm text-gray-700">
            Je souhaite recevoir des informations sur les opportunités de partenariat et les actualités de l&apos;établissement
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4" style={{background: 'linear-gradient(135deg, #e5e5e5 0%, #ffffff 100%)'}}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-primary-dark rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Inscription</h1>
          <p className="text-black">
            Créez votre compte pour accéder aux opportunités de partenariat
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl border border-neutral-light">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-black mb-2">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-sm text-black">
                Étape {currentStep} sur 4
              </p>
            </div>

            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          {/* Navigation Buttons */}
          <div className="bg-neutral-light px-8 py-4 rounded-b-xl flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 text-black border border-neutral-light rounded-lg hover:bg-white hover:border-primary-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Précédent
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-medium flex items-center transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Suivant
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-accent-orange text-white rounded-lg hover:bg-primary-dark flex items-center transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Créer mon compte
                <Check className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-black">
            Vous avez déjà un compte ?{' '}
            <a href="/login" className="text-accent-orange hover:text-black font-medium transition-colors duration-200">
              Connectez-vous
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
