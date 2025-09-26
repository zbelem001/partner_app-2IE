const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.id_utilisateur = data.id_utilisateur;
    this.nom = data.nom;
    this.prenom = data.prenom;
    this.email = data.email;
    this.telephone = data.telephone;
    this.role = data.role;
    this.service = data.service;
    this.statut = data.statut || 'actif';
    this.date_creation = data.date_creation;
    this.date_modification = data.date_modification;
    this.derniere_connexion = data.derniere_connexion;
  }

  // Créer un nouvel utilisateur
  static async create(userData) {
    try {
      const { nom, prenom, email, telephone, mot_de_passe, role, service } = userData;
      
      // Vérifier si l'email existe déjà
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }

      // Hasher le mot de passe
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(mot_de_passe, saltRounds);

      const query = `
        INSERT INTO utilisateurs (nom, prenom, email, telephone, mot_de_passe, role, service)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id_utilisateur
      `;

      const result = await pool.query(query, [
        nom, prenom, email, telephone, hashedPassword, role, service
      ]);

      // Récupérer l'utilisateur créé (sans le mot de passe)
      return await this.findById(result.rows[0].id_utilisateur);
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'utilisateur: ${error.message}`);
    }
  }

  // Trouver un utilisateur par ID
  static async findById(id) {
    try {
      const query = `
        SELECT id_utilisateur, nom, prenom, email, telephone, role, service, 
               date_creation, date_modification, derniere_connexion
        FROM utilisateurs 
        WHERE id_utilisateur = $1
      `;
      
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return new User(result.rows[0]);
    } catch (error) {
      throw new Error(`Erreur lors de la recherche de l'utilisateur: ${error.message}`);
    }
  }

  // Trouver un utilisateur par email
  static async findByEmail(email) {
    try {
      const query = `
        SELECT id_utilisateur, nom, prenom, email, telephone, role, service, 
               date_creation, date_modification, derniere_connexion
        FROM utilisateurs 
        WHERE email = $1
      `;
      
      const result = await pool.query(query, [email]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return new User(result.rows[0]);
    } catch (error) {
      throw new Error(`Erreur lors de la recherche de l'utilisateur: ${error.message}`);
    }
  }

  // Trouver un utilisateur par email avec mot de passe (pour l'authentification)
  static async findByEmailWithPassword(email) {
    try {
      const query = `
        SELECT id_utilisateur, nom, prenom, email, telephone, mot_de_passe, role, service, 
               date_creation, date_modification, derniere_connexion
        FROM utilisateurs 
        WHERE email = $1
      `;
      
      const result = await pool.query(query, [email]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Erreur lors de la recherche de l'utilisateur: ${error.message}`);
    }
  }

  // Vérifier le mot de passe
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error(`Erreur lors de la vérification du mot de passe: ${error.message}`);
    }
  }

  // Mettre à jour la dernière connexion
  static async updateLastLogin(id) {
    try {
      const query = `
        UPDATE utilisateurs 
        SET derniere_connexion = CURRENT_TIMESTAMP 
        WHERE id_utilisateur = $1
      `;
      
      await pool.query(query, [id]);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la dernière connexion: ${error.message}`);
    }
  }

  // Obtenir tous les utilisateurs (pour l'admin)
  static async findAll(limit = 50, offset = 0) {
    try {
      const query = `
        SELECT id_utilisateur, nom, prenom, email, telephone, role, service, 
               date_creation, date_modification, derniere_connexion
        FROM utilisateurs 
        ORDER BY date_creation DESC
        LIMIT $1 OFFSET $2
      `;
      
      const result = await pool.query(query, [limit, offset]);
      
      return result.rows.map(row => new User(row));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
    }
  }

  // Compter le nombre total d'utilisateurs
  static async count() {
    try {
      const query = `
        SELECT COUNT(*) as total 
        FROM utilisateurs
      `;
      
      const result = await pool.query(query);
      return result.rows[0].total;
    } catch (error) {
      throw new Error(`Erreur lors du comptage des utilisateurs: ${error.message}`);
    }
  }

  // Mettre à jour un utilisateur
  static async update(id, userData) {
    try {
      const allowedFields = ['nom', 'prenom', 'telephone', 'role', 'service'];
      const fields = [];
      const values = [];
      let parameterIndex = 1;

      // Construire la requête dynamiquement avec les paramètres PostgreSQL
      for (const [key, value] of Object.entries(userData)) {
        if (allowedFields.includes(key) && value !== undefined) {
          fields.push(`${key} = $${parameterIndex}`);
          values.push(value);
          parameterIndex++;
        }
      }

      if (fields.length === 0) {
        throw new Error('Aucun champ valide à mettre à jour');
      }

      values.push(id); // Ajouter l'ID à la fin pour la clause WHERE

      const query = `
        UPDATE utilisateurs 
        SET ${fields.join(', ')}, date_modification = CURRENT_TIMESTAMP
        WHERE id_utilisateur = $${parameterIndex}
      `;

      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        throw new Error('Utilisateur non trouvé');
      }

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${error.message}`);
    }
  }

  // Supprimer un utilisateur (suppression physique car pas de colonne statut)
  static async delete(id) {
    try {
      const query = `
        DELETE FROM utilisateurs 
        WHERE id_utilisateur = $1
      `;

      const result = await pool.query(query, [id]);

      if (result.rowCount === 0) {
        throw new Error('Utilisateur non trouvé');
      }

      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de l'utilisateur: ${error.message}`);
    }
  }
}

module.exports = User;
