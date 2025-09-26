const express = require('express');
const { body, validationResult } = require('express-validator');
const ProspectController = require('../controllers/prospectController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation des données prospect
const validateProspect = [
  body('nom_organisation')
    .notEmpty()
    .withMessage('Le nom de l\'organisation est requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  
  body('secteur')
    .notEmpty()
    .withMessage('Le secteur d\'activité est requis')
    .isLength({ max: 50 })
    .withMessage('Le secteur ne peut pas dépasser 50 caractères'),
  
  body('pays')
    .notEmpty()
    .withMessage('Le pays est requis')
    .isLength({ max: 50 })
    .withMessage('Le pays ne peut pas dépasser 50 caractères'),
  
  body('contact')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Le nom du contact ne peut pas dépasser 100 caractères'),
  
  body('email_contact')
    .optional()
    .isEmail()
    .withMessage('Format d\'email invalide')
    .isLength({ max: 100 })
    .withMessage('L\'email ne peut pas dépasser 100 caractères'),
  
  body('telephone_contact')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Le téléphone ne peut pas dépasser 20 caractères'),
  
  body('statut')
    .optional()
    .isIn(['nouveau', 'en_contact', 'qualifie', 'abandonne'])
    .withMessage('Statut invalide. Utilisez: nouveau, en_contact, qualifie, abandonne')
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

// POST /api/prospects - Créer un nouveau prospect
router.post('/', authenticateToken, validateProspect, checkValidation, ProspectController.createProspect);

// GET /api/prospects - Récupérer tous les prospects
router.get('/', authenticateToken, ProspectController.getAllProspects);

// GET /api/prospects/stats/overview - Obtenir les statistiques des prospects
router.get('/stats/overview', authenticateToken, ProspectController.getProspectsStats);

// GET /api/prospects/:id - Récupérer un prospect par ID
router.get('/:id', authenticateToken, ProspectController.getProspectById);

// PUT /api/prospects/:id - Mettre à jour un prospect
router.put('/:id', authenticateToken, validateProspect, checkValidation, ProspectController.updateProspect);

// DELETE /api/prospects/:id - Supprimer un prospect
router.delete('/:id', authenticateToken, ProspectController.deleteProspect);

module.exports = router;
