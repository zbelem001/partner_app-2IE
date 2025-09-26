const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Générer un token JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id_utilisateur, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Inscription d'un nouvel utilisateur
const register = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { nom, prenom, email, telephone, password, role, service } = req.body;

    // Créer l'utilisateur
    const newUser = await User.create({
      nom,
      prenom,
      email,
      telephone,
      mot_de_passe: password,
      role: role || 'lecteur',
      service
    });

    // Générer le token
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        user: {
          id_utilisateur: newUser.id_utilisateur,
          nom: newUser.nom,
          prenom: newUser.prenom,
          email: newUser.email,
          telephone: newUser.telephone,
          role: newUser.role,
          service: newUser.service,
          date_creation: newUser.date_creation
        },
        token
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    
    if (error.message.includes('existe déjà')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Connexion d'un utilisateur
const login = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Trouver l'utilisateur avec le mot de passe
    const userData = await User.findByEmailWithPassword(email);
    
    if (!userData) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isValidPassword = await User.verifyPassword(password, userData.mot_de_passe);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Mettre à jour la dernière connexion
    await User.updateLastLogin(userData.id_utilisateur);

    // Créer l'objet utilisateur sans le mot de passe
    const user = new User(userData);

    // Générer le token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: {
          id: user.id_utilisateur,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          telephone: user.telephone,
          role: user.role,
          service: user.service,
          derniere_connexion: new Date()
        },
        token
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Obtenir le profil de l'utilisateur connecté
const getProfile = async (req, res) => {
  try {
    const user = req.user; // Fourni par le middleware d'authentification

    res.json({
      success: true,
      data: {
        user: {
          id: user.id_utilisateur,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          telephone: user.telephone,
          role: user.role,
          service: user.service,
          date_creation: user.date_creation,
          derniere_connexion: user.derniere_connexion
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Mettre à jour le profil de l'utilisateur connecté
const updateProfile = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const userId = req.user.id_utilisateur;
    const { nom, prenom, telephone, service } = req.body;

    // Mettre à jour l'utilisateur
    const updatedUser = await User.update(userId, {
      nom,
      prenom,
      telephone,
      service
    });

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: {
        user: {
          id_utilisateur: updatedUser.id_utilisateur,
          nom: updatedUser.nom,
          prenom: updatedUser.prenom,
          email: updatedUser.email,
          telephone: updatedUser.telephone,
          role: updatedUser.role,
          service: updatedUser.service,
          date_modification: updatedUser.date_modification
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Vérifier si un token est valide
const verifyToken = async (req, res) => {
  try {
    const user = req.user; // Fourni par le middleware d'authentification

    res.json({
      success: true,
      message: 'Token valide',
      data: {
        user: {
          id_utilisateur: user.id_utilisateur,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role,
          service: user.service
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Déconnexion (optionnel si on utilise les tokens JWT côté client uniquement)
const logout = async (req, res) => {
  try {
    // Pour un système JWT simple, la déconnexion se fait côté client
    // En supprimant le token du localStorage/sessionStorage
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });

  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  verifyToken,
  logout
};
