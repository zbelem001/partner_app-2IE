const express = require('express');
const { body, validationResult } = require('express-validator');
const PartenariatController = require('../controllers/partenariatController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation des données partenariat
const validatePartenariat = [
  body('partenaire_id')
    .isInt({ min: 1 })
    .withMessage('ID du partenaire requis et doit être un entier positif'),
  
  body('titre')
    .notEmpty()
    .withMessage('Le titre est requis')
    .isLength({ min: 3, max: 255 })
    .withMessage('Le titre doit contenir entre 3 et 255 caractères'),
  
  body('description')
    .notEmpty()
    .withMessage('La description est requise')
    .isLength({ min: 10, max: 1000 })
    .withMessage('La description doit contenir entre 10 et 1000 caractères'),
  
  body('type_partenariat')
    .notEmpty()
    .withMessage('Le type de partenariat est requis')
    .isIn([
      'academique', 
      'recherche', 
      'echange_etudiants', 
      'formation_continue',
      'stage_professionnel',
      'projet_commun',
      'consultation',
      'autre'
    ])
    .withMessage('Type de partenariat invalide'),
  
  body('statut')
    .optional()
    .isIn(['actif', 'inactif', 'suspendu', 'termine'])
    .withMessage('Statut invalide. Utilisez: actif, inactif, suspendu, termine'),
  
  body('date_debut')
    .optional()
    .isISO8601()
    .withMessage('Format de date de début invalide'),
  
  body('date_fin')
    .optional()
    .isISO8601()
    .withMessage('Format de date de fin invalide'),
  
  body('objectifs')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Les objectifs ne peuvent dépasser 1000 caractères'),
  
  body('benefices_attendus')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Les bénéfices attendus ne peuvent dépasser 1000 caractères')
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

// POST /api/partenariats - Créer un nouveau partenariat
router.post('/', authenticateToken, validatePartenariat, checkValidation, PartenariatController.createPartenariat);

// GET /api/partenariats - Récupérer tous les partenariats
router.get('/', authenticateToken, PartenariatController.getAllPartenariats);

// GET /api/partenariats/stats/overview - Obtenir les statistiques des partenariats
router.get('/stats/overview', authenticateToken, PartenariatController.getPartenariatsStats);

// GET /api/partenariats/status/:status - Récupérer les partenariats par statut
router.get('/status/:status', authenticateToken, PartenariatController.getPartenariatsByStatus);

// GET /api/partenariats/:id - Récupérer un partenariat par ID
router.get('/:id', authenticateToken, PartenariatController.getPartenariatById);

// PUT /api/partenariats/:id - Mettre à jour un partenariat
router.put('/:id', authenticateToken, validatePartenariat, checkValidation, PartenariatController.updatePartenariat);

// DELETE /api/partenariats/:id - Supprimer un partenariat
router.delete('/:id', authenticateToken, PartenariatController.deletePartenariat);

module.exports = router;
