const express = require('express');
const { body, validationResult } = require('express-validator');
const PartnerController = require('../controllers/partnerController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation des données partenaire
const validatePartner = [
  body('nom_organisation')
    .notEmpty()
    .withMessage('Le nom de l\'organisation est requis')
    .isLength({ min: 2, max: 255 })
    .withMessage('Le nom doit contenir entre 2 et 255 caractères'),
  
  body('type_organisation')
    .notEmpty()
    .withMessage('Le type d\'organisation est requis')
    .isIn(['universite', 'entreprise', 'ong', 'institution_publique', 'centre_recherche', 'autre'])
    .withMessage('Type d\'organisation invalide'),
  
  body('pays')
    .notEmpty()
    .withMessage('Le pays est requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le pays doit contenir entre 2 et 100 caractères'),
  
  body('ville')
    .notEmpty()
    .withMessage('La ville est requise')
    .isLength({ min: 2, max: 100 })
    .withMessage('La ville doit contenir entre 2 et 100 caractères'),
  
  body('adresse')
    .optional()
    .isLength({ max: 500 })
    .withMessage('L\'adresse ne peut dépasser 500 caractères'),
  
  body('email_contact')
    .notEmpty()
    .withMessage('L\'email de contact est requis')
    .isEmail()
    .withMessage('Format d\'email invalide'),
  
  body('telephone_contact')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Le téléphone ne peut dépasser 20 caractères'),
  
  body('site_web')
    .optional()
    .isURL()
    .withMessage('Format d\'URL invalide'),
  
  body('secteur_activite')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Le secteur d\'activité ne peut dépasser 255 caractères'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La description ne peut dépasser 1000 caractères'),
  
  body('statut')
    .optional()
    .isIn(['actif', 'inactif', 'suspendu'])
    .withMessage('Statut invalide. Utilisez: actif, inactif, suspendu')
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

// POST /api/partners - Créer un nouveau partenaire
router.post('/', authenticateToken, validatePartner, checkValidation, PartnerController.createPartner);

// GET /api/partners - Récupérer tous les partenaires
router.get('/', authenticateToken, PartnerController.getAllPartners);

// GET /api/partners/stats/overview - Obtenir les statistiques des partenaires
router.get('/stats/overview', authenticateToken, PartnerController.getPartnersStats);

// GET /api/partners/country/:country - Récupérer les partenaires par pays
router.get('/country/:country', authenticateToken, PartnerController.getPartnersByCountry);

// GET /api/partners/:id - Récupérer un partenaire par ID
router.get('/:id', authenticateToken, PartnerController.getPartnerById);

// PUT /api/partners/:id - Mettre à jour un partenaire
router.put('/:id', authenticateToken, validatePartner, checkValidation, PartnerController.updatePartner);

// DELETE /api/partners/:id - Supprimer un partenaire
router.delete('/:id', authenticateToken, PartnerController.deletePartner);

module.exports = router;
