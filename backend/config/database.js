const { Pool } = require('pg');
require('dotenv').config();

// Configuration de la connexion à PostgreSQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'partners',
  port: process.env.DB_PORT || 5432,
  max: 10, // nombre maximum de connexions dans le pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Créer le pool de connexions
const pool = new Pool(dbConfig);

// Fonction pour tester la connexion
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Connexion à PostgreSQL réussie');
    console.log(`📅 Timestamp serveur: ${result.rows[0].now}`);
    client.release();
  } catch (error) {
    console.error('❌ Erreur de connexion à PostgreSQL:', error.message);
    throw error;
  }
};

// Fonction pour initialiser la base de données
const initializeDatabase = async () => {
  try {
    // Créer la base de données si elle n'existe pas
    const tempPool = new Pool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
      database: 'postgres' // Connexion à la DB par défaut pour créer la nôtre
    });

    try {
      await tempPool.query(`CREATE DATABASE ${dbConfig.database}`);
      console.log(`✅ Base de données ${dbConfig.database} créée`);
    } catch (error) {
      if (error.code === '42P04') {
        console.log(`✅ Base de données ${dbConfig.database} déjà existante`);
      } else {
        throw error;
      }
    } finally {
      await tempPool.end();
    }
    
    // Maintenant utiliser le pool principal pour créer les tables
    await createTables();
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error.message);
    throw error;
  }
};

// Fonction pour créer les tables
const createTables = async () => {
  try {
    // ========================
    // TABLE UTILISATEURS
    // ========================
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS utilisateurs (
        id_utilisateur      SERIAL PRIMARY KEY,
        nom                 VARCHAR(150) NOT NULL,
        prenom              VARCHAR(150),
        email               VARCHAR(200) UNIQUE NOT NULL,
        telephone           VARCHAR(50),
        role                VARCHAR(50) NOT NULL DEFAULT 'lecteur',
        service             VARCHAR(150),
        mot_de_passe        VARCHAR(255),
        date_creation       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Ajouter les colonnes manquantes si elles n'existent pas
    const addMissingColumns = [
      `ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS mot_de_passe VARCHAR(255);`,
      `ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`,
      `ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS derniere_connexion TIMESTAMP;`,
      `ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS token_reset VARCHAR(255);`,
      `ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS token_reset_expire TIMESTAMP;`
    ];

    // ========================
    // TABLE PROSPECTS
    // ========================
    const createProspectsTable = `
      CREATE TABLE IF NOT EXISTS prospects (
        id_prospect         SERIAL PRIMARY KEY,
        nom_organisation    VARCHAR(200) NOT NULL,
        secteur             VARCHAR(150),
        pays                VARCHAR(100),
        contact             VARCHAR(150),
        email_contact       VARCHAR(200),
        telephone_contact   VARCHAR(50),
        statut              VARCHAR(50) DEFAULT 'en_contact' CHECK (statut IN ('en_contact', 'qualifie', 'abandonne')),
        date_creation       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        date_modification   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // ========================
    // TABLE PARTENAIRES
    // ========================
    const createPartnersTable = `
      CREATE TABLE IF NOT EXISTS partenaires (
        id_partenaire       SERIAL PRIMARY KEY,
        nom_organisation    VARCHAR(200) NOT NULL,
        secteur             VARCHAR(150),
        pays                VARCHAR(100),
        adresse             TEXT,
        site_web            VARCHAR(200),
        contact             VARCHAR(150),
        email_contact       VARCHAR(200),
        telephone_contact   VARCHAR(50),
        prospect_id         INT REFERENCES prospects(id_prospect) ON DELETE SET NULL,
        date_creation       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        date_modification   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // ========================
    // TABLE PARTENARIATS
    // ========================
    const createPartnershipsTable = `
      CREATE TABLE IF NOT EXISTS partenariats (
        id_partenariat      SERIAL PRIMARY KEY,
        partenaire_id       INT REFERENCES partenaires(id_partenaire) ON DELETE CASCADE,
        titre               VARCHAR(255) NOT NULL,
        description         TEXT,
        statut              VARCHAR(50) DEFAULT 'actif' CHECK (statut IN ('actif', 'suspendu', 'termine')),
        date_debut          DATE,
        date_fin            DATE,
        responsable_id      INT REFERENCES utilisateurs(id_utilisateur) ON DELETE SET NULL,
        date_creation       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // ========================
    // TABLE CONVENTIONS
    // ========================
    const createConventionsTable = `
      CREATE TABLE IF NOT EXISTS conventions (
        id_convention       SERIAL PRIMARY KEY,
        partenariats_id     INT REFERENCES partenariats(id_partenariat) ON DELETE CASCADE,
        titre               VARCHAR(255) NOT NULL,
        type_convention     VARCHAR(100),          -- cadre, spécifique, académique...
        objet               TEXT,
        reference_interne   VARCHAR(100) UNIQUE,
        statut              VARCHAR(50) DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'en_validation', 'signe', 'expire')),
        date_signature      DATE,
        date_debut          DATE,
        date_fin            DATE,
        montant_engage      DECIMAL(15,2),
        service_concerne    VARCHAR(150),
        responsable_id      INT REFERENCES utilisateurs(id_utilisateur) ON DELETE SET NULL,
        date_creation       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        derniere_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // ========================
    // TABLE DOCUMENTS
    // ========================
    const createDocumentsTable = `
      CREATE TABLE IF NOT EXISTS documents (
        id_document         SERIAL PRIMARY KEY,
        convention_id       INT REFERENCES conventions(id_convention) ON DELETE CASCADE,
        type_document       VARCHAR(100), -- projet, version_finale, annexe, avenant
        nom_fichier         VARCHAR(255),
        chemin_fichier      VARCHAR(255),
        taille_fichier      BIGINT,
        date_ajout          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // ========================
    // TABLE SUIVI
    // ========================
    const createSuiviTable = `
      CREATE TABLE IF NOT EXISTS suivi_conventions (
        id_suivi            SERIAL PRIMARY KEY,
        convention_id       INT REFERENCES conventions(id_convention) ON DELETE CASCADE,
        date_action         DATE NOT NULL,
        lieu                VARCHAR(200),
        participants        TEXT,
        objet               TEXT,
        conclusions         TEXT,
        actions_a_entreprendre TEXT,
        prochaine_rencontre DATE,
        cree_par            INT REFERENCES utilisateurs(id_utilisateur),
        date_creation       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // ========================
    // TABLE CIRCUIT VALIDATION
    // ========================
    const createCircuitValidationTable = `
      CREATE TABLE IF NOT EXISTS circuit_validation (
        id_validation       SERIAL PRIMARY KEY,
        convention_id       INT REFERENCES conventions(id_convention) ON DELETE CASCADE,
        etape               VARCHAR(100), -- SRECIP, DFC, CAQ, DG
        statut              VARCHAR(50) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'valide', 'rejete')),
        date_validation     DATE,
        valide_par          INT REFERENCES utilisateurs(id_utilisateur),
        commentaires        TEXT,
        ordre_etape         INTEGER DEFAULT 1
      );
    `;

    // ========================
    // TABLE EVALUATION
    // ========================
    const createEvaluationsTable = `
      CREATE TABLE IF NOT EXISTS evaluations (
        id_evaluation       SERIAL PRIMARY KEY,
        convention_id       INT REFERENCES conventions(id_convention) ON DELETE CASCADE,
        objectifs           TEXT,
        indicateurs_kpi     JSONB,
        taux_realisation    DECIMAL(5,2),
        evaluation_finale   VARCHAR(50) CHECK (evaluation_finale IN ('reussie', 'partielle', 'echouee')),
        commentaires        TEXT,
        date_evaluation     DATE,
        eval_par            INT REFERENCES utilisateurs(id_utilisateur),
        date_creation       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Créer toutes les tables
    console.log('🔄 Création des tables...');
    
    await pool.query(createUsersTable);
    console.log('✅ Table utilisateurs créée');

    // Ajouter les colonnes manquantes si nécessaire
    for (const alterQuery of addMissingColumns) {
      try {
        await pool.query(alterQuery);
      } catch (error) {
        // Ignorer les erreurs si la colonne existe déjà
        if (!error.message.includes('already exists')) {
          console.log(`Info: ${error.message}`);
        }
      }
    }

    await pool.query(createProspectsTable);
    console.log('✅ Table prospects créée');

    await pool.query(createPartnersTable);
    console.log('✅ Table partenaires créée');

    await pool.query(createPartnershipsTable);
    console.log('✅ Table partenariats créée');

    await pool.query(createConventionsTable);
    console.log('✅ Table conventions créée');

    await pool.query(createDocumentsTable);
    console.log('✅ Table documents créée');

    await pool.query(createSuiviTable);
    console.log('✅ Table suivi_conventions créée');

    await pool.query(createCircuitValidationTable);
    console.log('✅ Table circuit_validation créée');

    await pool.query(createEvaluationsTable);
    console.log('✅ Table evaluations créée');

    // Créer les index pour optimiser les performances
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_utilisateurs_email ON utilisateurs(email);',
      'CREATE INDEX IF NOT EXISTS idx_utilisateurs_role ON utilisateurs(role);',
      'CREATE INDEX IF NOT EXISTS idx_prospects_statut ON prospects(statut);',
      'CREATE INDEX IF NOT EXISTS idx_partenaires_secteur ON partenaires(secteur);',
      'CREATE INDEX IF NOT EXISTS idx_partenaires_pays ON partenaires(pays);',
      'CREATE INDEX IF NOT EXISTS idx_partenariats_statut ON partenariats(statut);',
      'CREATE INDEX IF NOT EXISTS idx_conventions_statut ON conventions(statut);',
      'CREATE INDEX IF NOT EXISTS idx_conventions_reference ON conventions(reference_interne);',
      'CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type_document);',
      'CREATE INDEX IF NOT EXISTS idx_suivi_date ON suivi_conventions(date_action);',
      'CREATE INDEX IF NOT EXISTS idx_validation_etape ON circuit_validation(etape);',
      'CREATE INDEX IF NOT EXISTS idx_evaluations_date ON evaluations(date_evaluation);'
    ];

    for (const indexQuery of indexes) {
      await pool.query(indexQuery);
    }
    console.log('✅ Index créés');

    // Créer la fonction pour mettre à jour automatiquement les timestamps
    const createUpdateFunction = `
      CREATE OR REPLACE FUNCTION update_modified_column()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Mettre à jour date_modification si la colonne existe
        IF TG_TABLE_NAME = 'utilisateurs' THEN
          NEW.date_modification = CURRENT_TIMESTAMP;
        ELSIF TG_TABLE_NAME = 'conventions' THEN
          NEW.date_modification = CURRENT_TIMESTAMP;
          NEW.derniere_mise_a_jour = CURRENT_TIMESTAMP;
        ELSE
          -- Pour les autres tables, seulement date_modification
          NEW.date_modification = CURRENT_TIMESTAMP;
        END IF;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;

    await pool.query(createUpdateFunction);

    // Créer les triggers pour les tables qui ont date_modification
    const createTriggers = [
      'DROP TRIGGER IF EXISTS update_utilisateurs_modtime ON utilisateurs;',
      'CREATE TRIGGER update_utilisateurs_modtime BEFORE UPDATE ON utilisateurs FOR EACH ROW EXECUTE FUNCTION update_modified_column();',
      'DROP TRIGGER IF EXISTS update_prospects_modtime ON prospects;',
      'CREATE TRIGGER update_prospects_modtime BEFORE UPDATE ON prospects FOR EACH ROW EXECUTE FUNCTION update_modified_column();',
      'DROP TRIGGER IF EXISTS update_partenaires_modtime ON partenaires;',
      'CREATE TRIGGER update_partenaires_modtime BEFORE UPDATE ON partenaires FOR EACH ROW EXECUTE FUNCTION update_modified_column();',
      'DROP TRIGGER IF EXISTS update_conventions_modtime ON conventions;',
      'CREATE TRIGGER update_conventions_modtime BEFORE UPDATE ON conventions FOR EACH ROW EXECUTE FUNCTION update_modified_column();'
    ];

    for (const triggerQuery of createTriggers) {
      await pool.query(triggerQuery);
    }
    console.log('✅ Triggers créés');

  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error.message);
    throw error;
  }
};

// Exporter le pool et les fonctions utiles
module.exports = {
  pool,
  testConnection,
  initializeDatabase
};
