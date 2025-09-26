const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { 
  validateRegister, 
  validateLogin, 
  validateUpdateProfile 
} = require('../validators/authValidators');

// Routes publiques
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Routes protégées (nécessitent une authentification)
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, validateUpdateProfile, authController.updateProfile);
router.post('/verify', authenticateToken, authController.verifyToken);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
