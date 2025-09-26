const { pool } = require('../config/database');

class Prospect {
  constructor(data) {
    this.id_prospect = data.id_prospect;
    this.nom_organisation = data.nom_organisation;
    this.secteur = data.secteur;
    this.pays = data.pays;
    this.contact = data.contact;
    this.email_contact = data.email_contact;
    this.telephone_contact = data.telephone_contact;
    this.statut = data.statut;
    this.date_creation = data.date_creation;
    this.date_modification = data.date_modification;
  }

  // Créer un nouveau prospect
  static async create(prospectData) {
    try {
      const {
        nom_organisation,
        secteur,
        pays,
        contact,
        email_contact,
        telephone_contact,
        statut
      } = prospectData;

      const query = `
        INSERT INTO prospects (nom_organisation, secteur, pays, contact, email_contact, telephone_contact, statut)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id_prospect
      `;

      const result = await pool.query(query, [
        nom_organisation, secteur, pays, contact, email_contact, telephone_contact, statut || 'en_contact'
      ]);

      return await this.findById(result.rows[0].id_prospect);
    } catch (error) {
      throw new Error(`Erreur lors de la création du prospect: ${error.message}`);
    }
  }

  // Trouver un prospect par ID
  static async findById(id) {
    try {
      const query = `
        SELECT * FROM prospects 
        WHERE id_prospect = $1
      `;
      
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return new Prospect(result.rows[0]);
    } catch (error) {
      throw new Error(`Erreur lors de la recherche du prospect: ${error.message}`);
    }
  }

  // Obtenir tous les prospects avec pagination
  static async findAll(limit = 50, offset = 0, filters = {}) {
    try {
      let query = 'SELECT * FROM prospects WHERE 1=1';
      const values = [];
      let paramIndex = 1;

      // Filtres dynamiques
      if (filters.statut) {
        query += ` AND statut = $${paramIndex}`;
        values.push(filters.statut);
        paramIndex++;
      }

      if (filters.secteur) {
        query += ` AND secteur ILIKE $${paramIndex}`;
        values.push(`%${filters.secteur}%`);
        paramIndex++;
      }

      if (filters.pays) {
        query += ` AND pays ILIKE $${paramIndex}`;
        values.push(`%${filters.pays}%`);
        paramIndex++;
      }

      if (filters.search) {
        query += ` AND (nom_organisation ILIKE $${paramIndex} OR contact ILIKE $${paramIndex + 1})`;
        values.push(`%${filters.search}%`, `%${filters.search}%`);
        paramIndex += 2;
      }

      query += ` ORDER BY date_creation DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      values.push(limit, offset);
      
      const result = await pool.query(query, values);
      
      return result.rows.map(row => new Prospect(row));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des prospects: ${error.message}`);
    }
  }

  // Compter le nombre total de prospects
  static async count(filters = {}) {
    try {
      let query = 'SELECT COUNT(*) as total FROM prospects WHERE 1=1';
      const values = [];
      let paramIndex = 1;

      // Appliquer les mêmes filtres que findAll
      if (filters.statut) {
        query += ` AND statut = $${paramIndex}`;
        values.push(filters.statut);
        paramIndex++;
      }

      if (filters.secteur) {
        query += ` AND secteur ILIKE $${paramIndex}`;
        values.push(`%${filters.secteur}%`);
        paramIndex++;
      }

      if (filters.pays) {
        query += ` AND pays ILIKE $${paramIndex}`;
        values.push(`%${filters.pays}%`);
        paramIndex++;
      }

      if (filters.search) {
        query += ` AND (nom_organisation ILIKE $${paramIndex} OR contact ILIKE $${paramIndex + 1})`;
        values.push(`%${filters.search}%`, `%${filters.search}%`);
      }

      const result = await pool.query(query, values);
      return parseInt(result.rows[0].total);
    } catch (error) {
      throw new Error(`Erreur lors du comptage des prospects: ${error.message}`);
    }
  }

  // Mettre à jour un prospect
  static async update(id, prospectData) {
    try {
      const allowedFields = [
        'nom_organisation', 'secteur', 'pays', 'contact', 
        'email_contact', 'telephone_contact', 'statut'
      ];
      const fields = [];
      const values = [];
      let parameterIndex = 1;

      for (const [key, value] of Object.entries(prospectData)) {
        if (allowedFields.includes(key) && value !== undefined) {
          fields.push(`${key} = $${parameterIndex}`);
          values.push(value);
          parameterIndex++;
        }
      }

      if (fields.length === 0) {
        throw new Error('Aucun champ valide à mettre à jour');
      }

      values.push(id);

      const query = `
        UPDATE prospects 
        SET ${fields.join(', ')}, date_modification = CURRENT_TIMESTAMP
        WHERE id_prospect = $${parameterIndex}
      `;

      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        throw new Error('Prospect non trouvé');
      }

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du prospect: ${error.message}`);
    }
  }

  // Supprimer un prospect
  static async delete(id) {
    try {
      const query = 'DELETE FROM prospects WHERE id_prospect = $1';
      const result = await pool.query(query, [id]);

      if (result.rowCount === 0) {
        throw new Error('Prospect non trouvé');
      }

      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du prospect: ${error.message}`);
    }
  }

  // Obtenir les statistiques des prospects
  static async getStatistics() {
    try {
      const query = `
        SELECT 
          statut,
          COUNT(*) as count
        FROM prospects 
        GROUP BY statut
      `;
      
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
    }
  }
}

module.exports = Prospect;
