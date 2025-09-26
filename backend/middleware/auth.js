const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour vérifier l'authentification JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'accès requis'
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer les informations de l'utilisateur
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide - utilisateur non trouvé'
      });
    }

    if (user.statut !== 'actif') {
      return res.status(401).json({
        success: false,
        message: 'Compte utilisateur inactif'
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();

  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Middleware pour vérifier les rôles
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Permissions insuffisantes'
      });
    }

    next();
  };
};

// Middleware pour vérifier si l'utilisateur est admin
const requireAdmin = requireRole(['admin']);

// Middleware pour vérifier si l'utilisateur est au moins responsable
const requireResponsable = requireRole(['responsable', 'admin']);

// Middleware pour vérifier si l'utilisateur a au moins un rôle de suivi
const requireSuivi = requireRole(['suivi', 'responsable', 'admin']);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireResponsable,
  requireSuivi
};
