const { body } = require('express-validator');

// Validation pour l'inscription
const validateRegister = [
  body('nom')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s\-']+$/)
    .withMessage('Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes'),

  body('prenom')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Le prénom ne peut pas dépasser 100 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s\-']*$/)
    .withMessage('Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('L\'email ne peut pas dépasser 255 caractères'),

  body('telephone')
    .optional()
    .trim()
    .matches(/^(\+226)?[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/)
    .withMessage('Format de téléphone invalide (ex: +226 70 00 00 00 ou 70000000)'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Le mot de passe doit contenir au moins: une minuscule, une majuscule, un chiffre et un caractère spécial'),

  body('role')
    .optional()
    .isIn(['lecteur', 'suivi', 'responsable', 'admin'])
    .withMessage('Rôle invalide'),

  body('service')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Le service ne peut pas dépasser 255 caractères')
];

// Validation pour la connexion
const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Mot de passe requis')
];

// Validation pour la mise à jour du profil
const validateUpdateProfile = [
  body('nom')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s\-']+$/)
    .withMessage('Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes'),

  body('prenom')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Le prénom ne peut pas dépasser 100 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s\-']*$/)
    .withMessage('Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes'),

  body('telephone')
    .optional()
    .trim()
    .matches(/^(\+226)?[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/)
    .withMessage('Format de téléphone invalide (ex: +226 70 00 00 00 ou 70000000)'),

  body('service')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Le service ne peut pas dépasser 255 caractères')
];

// Validation pour le changement de mot de passe
const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Mot de passe actuel requis'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Le nouveau mot de passe doit contenir au moins: une minuscule, une majuscule, un chiffre et un caractère spécial'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('La confirmation du mot de passe ne correspond pas');
      }
      return true;
    })
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword
};
