const express = require('express');
const { body, validationResult } = require('express-validator');
const ConventionController = require('../controllers/conventionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation des données convention
const validateConvention = [
  body('partenariats_id')
    .isInt({ min: 1 })
    .withMessage('ID du partenariat requis et doit être un entier positif'),
  
  body('titre')
    .notEmpty()
    .withMessage('Le titre est requis')
    .isLength({ min: 3, max: 255 })
    .withMessage('Le titre doit contenir entre 3 et 255 caractères'),
  
  body('type_convention')
    .notEmpty()
    .withMessage('Le type de convention est requis')
    .isIn([
      'accord_cadre', 
      'convention_specifique', 
      'protocole_accord', 
      'memorandum_entente',
      'accord_cooperation',
      'convention_stage',
      'accord_echange'
    ])
    .withMessage('Type de convention invalide'),
  
  body('objet')
    .notEmpty()
    .withMessage('L\'objet est requis')
    .isLength({ min: 10, max: 1000 })
    .withMessage('L\'objet doit contenir entre 10 et 1000 caractères'),
  
  body('reference_interne')
    .optional()
    .isLength({ max: 50 })
    .withMessage('La référence interne ne peut dépasser 50 caractères'),
  
  body('statut')
    .optional()
    .isIn(['brouillon', 'en_cours', 'signee', 'active', 'suspendue', 'terminee', 'annulee'])
    .withMessage('Statut invalide'),
  
  body('date_signature')
    .optional()
    .isISO8601()
    .withMessage('Format de date de signature invalide'),
  
  body('date_debut')
    .optional()
    .isISO8601()
    .withMessage('Format de date de début invalide'),
  
  body('date_fin')
    .optional()
    .isISO8601()
    .withMessage('Format de date de fin invalide'),
  
  body('montant_engage')
    .optional()
    .isNumeric()
    .withMessage('Le montant engagé doit être un nombre'),
  
  body('service_concerne')
    .notEmpty()
    .withMessage('Le service concerné est requis')
    .isLength({ max: 100 })
    .withMessage('Le service concerné ne peut dépasser 100 caractères')
];

// Validation pour la validation d'une convention
const validateConventionValidation = [
  body('statut')
    .notEmpty()
    .withMessage('Le statut est requis')
    .isIn(['validee', 'rejetee'])
    .withMessage('Statut invalide. Utilisez: validee, rejetee'),
  
  body('commentaire')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Le commentaire ne peut dépasser 500 caractères')
];

// Middleware pour vérifier les erreurs de validation
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array()
    });
  }
  next();
};

// POST /api/conventions - Créer une nouvelle convention
router.post('/', authenticateToken, validateConvention, checkValidation, ConventionController.createConvention);

// GET /api/conventions - Récupérer toutes les conventions
router.get('/', authenticateToken, ConventionController.getAllConventions);

// GET /api/conventions/stats/overview - Obtenir les statistiques des conventions
router.get('/stats/overview', authenticateToken, ConventionController.getConventionsStats);

// GET /api/conventions/status/:status - Récupérer les conventions par statut
router.get('/status/:status', authenticateToken, ConventionController.getConventionsByStatus);

// GET /api/conventions/:id - Récupérer une convention par ID
router.get('/:id', authenticateToken, ConventionController.getConventionById);

// GET /api/conventions/:id/validation - Récupérer le circuit de validation
router.get('/:id/validation', authenticateToken, ConventionController.getValidationCircuit);

// PUT /api/conventions/:id - Mettre à jour une convention
router.put('/:id', authenticateToken, validateConvention, checkValidation, ConventionController.updateConvention);

// PUT /api/conventions/:id/validate - Valider une convention
router.put('/:id/validate', authenticateToken, validateConventionValidation, checkValidation, ConventionController.validateConvention);

// DELETE /api/conventions/:id - Supprimer une convention
router.delete('/:id', authenticateToken, ConventionController.deleteConvention);

module.exports = router;
