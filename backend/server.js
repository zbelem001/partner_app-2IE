const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importer la configuration de la base de données
const { testConnection, initializeDatabase } = require('./config/database');

// Importer les routes
const authRoutes = require('./routes/auth');
const prospectRoutes = require('./routes/prospects');
const conventionRoutes = require('./routes/conventions');
const partnerRoutes = require('./routes/partners');
const partenariatRoutes = require('./routes/partenariats');

// Créer l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de sécurité
app.use(helmet({
  contentSecurityPolicy: false, // Désactiver pour le développement
}));

// Configuration CORS
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3001',
    'http://localhost:3000', // Backup pour Next.js par défaut
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Middleware de limitation du taux de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 100 requêtes par IP en production, 1000 en dev
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// Limitation spéciale pour les routes d'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 tentatives de connexion par IP
  message: {
    success: false,
    message: 'Trop de tentatives de connexion, veuillez réessayer plus tard.'
  },
  skipSuccessfulRequests: true
});

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging des requêtes
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Gestion des Partenariats - Institut 2iE',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Routes d'authentification avec limitation
app.use('/api/auth', authLimiter, authRoutes);

// Routes prospects
app.use('/api/prospects', prospectRoutes);

// Routes conventions
app.use('/api/conventions', conventionRoutes);

// Routes partenaires
app.use('/api/partners', partnerRoutes);

// Routes partenariats
app.use('/api/partenariats', partenariatRoutes);

// Route de santé pour vérifier le statut de l'API
app.get('/api/health', async (req, res) => {
  try {
    await testConnection();
    res.json({
      success: true,
      message: 'API opérationnelle',
      database: 'Connectée',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Problème de santé de l\'API',
      database: 'Déconnectée',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Middleware de gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    requestedUrl: req.originalUrl
  });
});

// Middleware de gestion des erreurs globales
app.use((error, req, res, next) => {
  console.error('Erreur globale:', error);
  
  // Erreur de parsing JSON
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'Format JSON invalide'
    });
  }

  // Erreur générique
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

// Fonction pour démarrer le serveur
const startServer = async () => {
  try {
    // Initialiser la base de données
    console.log('🔄 Initialisation de la base de données...');
    await initializeDatabase();
    
    // Tester la connexion
    await testConnection();
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`\n🚀 Serveur démarré avec succès !`);
      console.log(`📍 Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Port: ${PORT}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log(`💾 Base de données: ${process.env.DB_NAME || 'partners_2ie'}`);
      console.log(`\n📋 Routes disponibles:`);
      console.log(`   GET  /                     - Page d'accueil`);
      console.log(`   GET  /api/health           - Santé de l'API`);
      console.log(`   POST /api/auth/register    - Inscription`);
      console.log(`   POST /api/auth/login       - Connexion`);
      console.log(`   GET  /api/auth/profile     - Profil utilisateur`);
      console.log(`   PUT  /api/auth/profile     - Mise à jour profil`);
      console.log(`   POST /api/auth/verify      - Vérification token`);
      console.log(`   POST /api/auth/logout      - Déconnexion`);
      console.log(`   GET  /api/prospects        - Liste des prospects`);
      console.log(`   POST /api/prospects        - Créer un prospect`);
      console.log(`   GET  /api/prospects/:id    - Détail d'un prospect`);
      console.log(`   PUT  /api/prospects/:id    - Modifier un prospect`);
      console.log(`   DELETE /api/prospects/:id  - Supprimer un prospect`);
      console.log(`   GET  /api/prospects/stats/overview - Statistiques prospects`);
      console.log(`   GET  /api/conventions      - Liste des conventions`);
      console.log(`   POST /api/conventions      - Créer une convention`);
      console.log(`   GET  /api/conventions/:id  - Détail d'une convention`);
      console.log(`   PUT  /api/conventions/:id  - Modifier une convention`);
      console.log(`   DELETE /api/conventions/:id - Supprimer une convention`);
      console.log(`   GET  /api/conventions/stats/overview - Statistiques conventions`);
      console.log(`   PUT  /api/conventions/:id/validate - Valider une convention`);
      console.log(`   GET  /api/partners         - Liste des partenaires`);
      console.log(`   POST /api/partners         - Créer un partenaire`);
      console.log(`   GET  /api/partners/:id     - Détail d'un partenaire`);
      console.log(`   PUT  /api/partners/:id     - Modifier un partenaire`);
      console.log(`   DELETE /api/partners/:id   - Supprimer un partenaire`);
      console.log(`   GET  /api/partenariats     - Liste des partenariats`);
      console.log(`   POST /api/partenariats     - Créer un partenariat`);
      console.log(`   GET  /api/partenariats/:id - Détail d'un partenariat`);
      console.log(`   PUT  /api/partenariats/:id - Modifier un partenariat`);
      console.log(`   DELETE /api/partenariats/:id - Supprimer un partenariat`);
      console.log(`\n✅ API prête à recevoir des requêtes !`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error.message);
    process.exit(1);
  }
};

// Gestion gracieuse de l'arrêt du serveur
process.on('SIGINT', () => {
  console.log('\n🔄 Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🔄 Arrêt du serveur...');
  process.exit(0);
});

// Démarrer le serveur
startServer();
