const { pool } = require('../config/database');

class Partner {
  constructor(data) {
    this.id_partenaire = data.id_partenaire;
    this.nom_organisation = data.nom_organisation;
    this.secteur = data.secteur;
    this.pays = data.pays;
    this.adresse = data.adresse;
    this.site_web = data.site_web;
    this.contact = data.contact;
    this.email_contact = data.email_contact;
    this.telephone_contact = data.telephone_contact;
    this.prospect_id = data.prospect_id;
    this.date_creation = data.date_creation;
    this.date_modification = data.date_modification;
  }

  // Créer un nouveau partenaire
  static async create(partnerData) {
    try {
      const {
        nom_organisation,
        secteur,
        pays,
        adresse,
        site_web,
        contact,
        email_contact,
        telephone_contact,
        prospect_id
      } = partnerData;

      const query = `
        INSERT INTO partenaires (
          nom_organisation, secteur, pays, adresse, site_web, 
          contact, email_contact, telephone_contact, prospect_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id_partenaire
      `;

      const result = await pool.query(query, [
        nom_organisation, secteur, pays, adresse, site_web,
        contact, email_contact, telephone_contact, prospect_id
      ]);

      return await this.findById(result.rows[0].id_partenaire);
    } catch (error) {
      throw new Error(`Erreur lors de la création du partenaire: ${error.message}`);
    }
  }

  // Créer un partenaire à partir d'un prospect
  static async createFromProspect(prospectId, additionalData = {}) {
    try {
      // Récupérer les données du prospect
      const prospectQuery = 'SELECT * FROM prospects WHERE id_prospect = $1';
      const prospectResult = await pool.query(prospectQuery, [prospectId]);
      
      if (prospectResult.rows.length === 0) {
        throw new Error('Prospect non trouvé');
      }

      const prospect = prospectResult.rows[0];

      const partnerData = {
        nom_organisation: prospect.nom_organisation,
        secteur: prospect.secteur,
        pays: prospect.pays,
        contact: prospect.contact,
        email_contact: prospect.email_contact,
        telephone_contact: prospect.telephone_contact,
        prospect_id: prospectId,
        ...additionalData // Permet d'ajouter/écraser des données
      };

      return await this.create(partnerData);
    } catch (error) {
      throw new Error(`Erreur lors de la création du partenaire depuis le prospect: ${error.message}`);
    }
  }

  // Trouver un partenaire par ID
  static async findById(id) {
    try {
      const query = `
        SELECT p.*, pr.nom_organisation as prospect_nom 
        FROM partenaires p
        LEFT JOIN prospects pr ON p.prospect_id = pr.id_prospect
        WHERE p.id_partenaire = $1
      `;
      
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return new Partner(result.rows[0]);
    } catch (error) {
      throw new Error(`Erreur lors de la recherche du partenaire: ${error.message}`);
    }
  }

  // Obtenir tous les partenaires avec pagination
  static async findAll(limit = 50, offset = 0, filters = {}) {
    try {
      let query = `
        SELECT p.*, pr.nom_organisation as prospect_nom 
        FROM partenaires p
        LEFT JOIN prospects pr ON p.prospect_id = pr.id_prospect
        WHERE 1=1
      `;
      const values = [];
      let paramIndex = 1;

      // Filtres dynamiques
      if (filters.secteur) {
        query += ` AND p.secteur ILIKE $${paramIndex}`;
        values.push(`%${filters.secteur}%`);
        paramIndex++;
      }

      if (filters.pays) {
        query += ` AND p.pays ILIKE $${paramIndex}`;
        values.push(`%${filters.pays}%`);
        paramIndex++;
      }

      if (filters.search) {
        query += ` AND (p.nom_organisation ILIKE $${paramIndex} OR p.contact ILIKE $${paramIndex + 1})`;
        values.push(`%${filters.search}%`, `%${filters.search}%`);
        paramIndex += 2;
      }

      query += ` ORDER BY p.date_creation DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      values.push(limit, offset);
      
      const result = await pool.query(query, values);
      
      return result.rows.map(row => new Partner(row));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des partenaires: ${error.message}`);
    }
  }

  // Compter le nombre total de partenaires
  static async count(filters = {}) {
    try {
      let query = 'SELECT COUNT(*) as total FROM partenaires p WHERE 1=1';
      const values = [];
      let paramIndex = 1;

      if (filters.secteur) {
        query += ` AND p.secteur ILIKE $${paramIndex}`;
        values.push(`%${filters.secteur}%`);
        paramIndex++;
      }

      if (filters.pays) {
        query += ` AND p.pays ILIKE $${paramIndex}`;
        values.push(`%${filters.pays}%`);
        paramIndex++;
      }

      if (filters.search) {
        query += ` AND (p.nom_organisation ILIKE $${paramIndex} OR p.contact ILIKE $${paramIndex + 1})`;
        values.push(`%${filters.search}%`, `%${filters.search}%`);
      }

      const result = await pool.query(query, values);
      return parseInt(result.rows[0].total);
    } catch (error) {
      throw new Error(`Erreur lors du comptage des partenaires: ${error.message}`);
    }
  }

  // Mettre à jour un partenaire
  static async update(id, partnerData) {
    try {
      const allowedFields = [
        'nom_organisation', 'secteur', 'pays', 'adresse', 'site_web',
        'contact', 'email_contact', 'telephone_contact', 'prospect_id'
      ];
      const fields = [];
      const values = [];
      let parameterIndex = 1;

      for (const [key, value] of Object.entries(partnerData)) {
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
        UPDATE partenaires 
        SET ${fields.join(', ')}, date_modification = CURRENT_TIMESTAMP
        WHERE id_partenaire = $${parameterIndex}
      `;

      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        throw new Error('Partenaire non trouvé');
      }

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du partenaire: ${error.message}`);
    }
  }

  // Supprimer un partenaire
  static async delete(id) {
    try {
      const query = 'DELETE FROM partenaires WHERE id_partenaire = $1';
      const result = await pool.query(query, [id]);

      if (result.rowCount === 0) {
        throw new Error('Partenaire non trouvé');
      }

      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du partenaire: ${error.message}`);
    }
  }

  // Obtenir les partenariats d'un partenaire
  static async getPartnerships(id) {
    try {
      const query = `
        SELECT pt.*, u.nom as responsable_nom, u.prenom as responsable_prenom
        FROM partenariats pt
        LEFT JOIN utilisateurs u ON pt.responsable_id = u.id_utilisateur
        WHERE pt.partenaire_id = $1
        ORDER BY pt.date_creation DESC
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des partenariats: ${error.message}`);
    }
  }

  // Obtenir les statistiques des partenaires
  static async getStatistics() {
    try {
      const queries = [
        // Par secteur
        `SELECT secteur, COUNT(*) as count FROM partenaires WHERE secteur IS NOT NULL GROUP BY secteur ORDER BY count DESC`,
        // Par pays
        `SELECT pays, COUNT(*) as count FROM partenaires WHERE pays IS NOT NULL GROUP BY pays ORDER BY count DESC LIMIT 10`,
        // Total
        `SELECT COUNT(*) as total FROM partenaires`
      ];

      const results = await Promise.all(queries.map(query => pool.query(query)));

      return {
        par_secteur: results[0].rows,
        par_pays: results[1].rows,
        total: parseInt(results[2].rows[0].total)
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
    }
  }
}

module.exports = Partner;
