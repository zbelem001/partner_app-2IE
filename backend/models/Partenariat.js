const { pool } = require('../config/database');

class Partenariat {
  constructor(data) {
    this.id_partenariat = data.id_partenariat;
    this.partenaire_id = data.partenaire_id;
    this.titre = data.titre;
    this.description = data.description;
    this.type_partenariat = data.type_partenariat;
    this.statut = data.statut;
    this.date_debut = data.date_debut;
    this.date_fin = data.date_fin;
    this.objectifs = data.objectifs;
    this.benefices_attendus = data.benefices_attendus;
    this.responsable_2ie_id = data.responsable_2ie_id;
    this.date_creation = data.date_creation;
    this.derniere_mise_a_jour = data.derniere_mise_a_jour;
    
    // Champs additionnels depuis les jointures
    this.partenaire_nom = data.partenaire_nom;
    this.partenaire_pays = data.partenaire_pays;
    this.responsable_nom = data.responsable_nom;
    this.responsable_prenom = data.responsable_prenom;
    this.conventions_count = data.conventions_count || 0;
  }

  // Créer un nouveau partenariat
  static async create(partenariatData) {
    try {
      const query = `
        INSERT INTO partenariats (
          partenaire_id, titre, description, type_partenariat, statut,
          date_debut, date_fin, objectifs, benefices_attendus, responsable_2ie_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const values = [
        partenariatData.partenaire_id,
        partenariatData.titre,
        partenariatData.description,
        partenariatData.type_partenariat,
        partenariatData.statut || 'actif',
        partenariatData.date_debut || null,
        partenariatData.date_fin || null,
        partenariatData.objectifs || null,
        partenariatData.benefices_attendus || null,
        partenariatData.responsable_2ie_id
      ];

      const result = await pool.query(query, values);
      return new Partenariat(result.rows[0]);

    } catch (error) {
      throw new Error(`Erreur lors de la création du partenariat: ${error.message}`);
    }
  }

  // Trouver un partenariat par ID
  static async findById(id) {
    try {
      const query = `
        SELECT 
          pt.*,
          p.nom_organisation as partenaire_nom,
          p.pays as partenaire_pays,
          u.nom as responsable_nom,
          u.prenom as responsable_prenom,
          COUNT(c.id_convention) as conventions_count
        FROM partenariats pt
        LEFT JOIN partenaires p ON pt.partenaire_id = p.id_partenaire
        LEFT JOIN utilisateurs u ON pt.responsable_2ie_id = u.id_utilisateur
        LEFT JOIN conventions c ON pt.id_partenariat = c.partenariats_id
        WHERE pt.id_partenariat = $1
        GROUP BY pt.id_partenariat, p.nom_organisation, p.pays, u.nom, u.prenom
      `;

      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return new Partenariat(result.rows[0]);

    } catch (error) {
      throw new Error(`Erreur lors de la récupération du partenariat: ${error.message}`);
    }
  }

  // Récupérer tous les partenariats
  static async findAll(limit = 50, offset = 0, filters = {}) {
    try {
      let query = `
        SELECT 
          pt.*,
          p.nom_organisation as partenaire_nom,
          p.pays as partenaire_pays,
          u.nom as responsable_nom,
          u.prenom as responsable_prenom,
          COUNT(c.id_convention) as conventions_count
        FROM partenariats pt
        LEFT JOIN partenaires p ON pt.partenaire_id = p.id_partenaire
        LEFT JOIN utilisateurs u ON pt.responsable_2ie_id = u.id_utilisateur
        LEFT JOIN conventions c ON pt.id_partenariat = c.partenariats_id
      `;

      const conditions = [];
      const values = [];
      let valueIndex = 1;

      // Filtres
      if (filters.statut) {
        conditions.push(`pt.statut = $${valueIndex}`);
        values.push(filters.statut);
        valueIndex++;
      }

      if (filters.type_partenariat) {
        conditions.push(`pt.type_partenariat = $${valueIndex}`);
        values.push(filters.type_partenariat);
        valueIndex++;
      }

      if (filters.partenaire_id) {
        conditions.push(`pt.partenaire_id = $${valueIndex}`);
        values.push(filters.partenaire_id);
        valueIndex++;
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += `
        GROUP BY pt.id_partenariat, p.nom_organisation, p.pays, u.nom, u.prenom
        ORDER BY pt.date_creation DESC
        LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
      `;

      values.push(limit, offset);

      const result = await pool.query(query, values);
      return result.rows.map(row => new Partenariat(row));

    } catch (error) {
      throw new Error(`Erreur lors de la récupération des partenariats: ${error.message}`);
    }
  }

  // Mettre à jour un partenariat
  static async update(id, partenariatData) {
    try {
      const setClause = [];
      const values = [];
      let valueIndex = 1;

      // Construire dynamiquement la clause SET
      Object.keys(partenariatData).forEach(key => {
        if (partenariatData[key] !== undefined && key !== 'id_partenariat') {
          setClause.push(`${key} = $${valueIndex}`);
          values.push(partenariatData[key]);
          valueIndex++;
        }
      });

      if (setClause.length === 0) {
        throw new Error('Aucune donnée à mettre à jour');
      }

      // Ajouter la mise à jour automatique du timestamp
      setClause.push(`derniere_mise_a_jour = CURRENT_TIMESTAMP`);
      values.push(id);

      const query = `
        UPDATE partenariats 
        SET ${setClause.join(', ')}
        WHERE id_partenariat = $${valueIndex}
        RETURNING *
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return null;
      }

      return new Partenariat(result.rows[0]);

    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du partenariat: ${error.message}`);
    }
  }

  // Supprimer un partenariat
  static async delete(id) {
    try {
      const query = `DELETE FROM partenariats WHERE id_partenariat = $1 RETURNING *`;
      const result = await pool.query(query, [id]);

      return result.rows.length > 0;

    } catch (error) {
      throw new Error(`Erreur lors de la suppression du partenariat: ${error.message}`);
    }
  }

  // Vérifier si un partenariat a des conventions
  static async hasConventions(partenariatId) {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM conventions 
        WHERE partenariats_id = $1
      `;

      const result = await pool.query(query, [partenariatId]);
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      throw new Error(`Erreur lors de la vérification des conventions: ${error.message}`);
    }
  }

  // Obtenir les statistiques des partenariats
  static async getStats() {
    try {
      const queries = [
        // Par statut
        `SELECT statut, COUNT(*) as count FROM partenariats GROUP BY statut`,
        // Par type
        `SELECT type_partenariat, COUNT(*) as count FROM partenariats GROUP BY type_partenariat`,
        // Total
        `SELECT COUNT(*) as total FROM partenariats`,
        // Partenariats actifs
        `SELECT COUNT(*) as actifs FROM partenariats WHERE statut = 'actif'`
      ];

      const results = await Promise.all(queries.map(query => pool.query(query)));

      return {
        par_statut: results[0].rows,
        par_type: results[1].rows,
        total: parseInt(results[2].rows[0].total),
        actifs: parseInt(results[3].rows[0].actifs)
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
    }
  }

  // Trouver les partenariats par statut
  static async findByStatus(status) {
    try {
      const query = `
        SELECT 
          pt.*,
          p.nom_organisation as partenaire_nom,
          p.pays as partenaire_pays,
          u.nom as responsable_nom,
          u.prenom as responsable_prenom,
          COUNT(c.id_convention) as conventions_count
        FROM partenariats pt
        LEFT JOIN partenaires p ON pt.partenaire_id = p.id_partenaire
        LEFT JOIN utilisateurs u ON pt.responsable_2ie_id = u.id_utilisateur
        LEFT JOIN conventions c ON pt.id_partenariat = c.partenariats_id
        WHERE pt.statut = $1
        GROUP BY pt.id_partenariat, p.nom_organisation, p.pays, u.nom, u.prenom
        ORDER BY pt.date_creation DESC
      `;

      const result = await pool.query(query, [status]);
      return result.rows.map(row => new Partenariat(row));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des partenariats par statut: ${error.message}`);
    }
  }

  // Obtenir les conventions d'un partenariat
  static async getConventions(partenariatId) {
    try {
      const query = `
        SELECT c.*, COUNT(cv.id_validation) as validations_count
        FROM conventions c
        LEFT JOIN circuit_validation cv ON c.id_convention = cv.convention_id
        WHERE c.partenariats_id = $1
        GROUP BY c.id_convention
        ORDER BY c.date_creation DESC
      `;

      const result = await pool.query(query, [partenariatId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des conventions: ${error.message}`);
    }
  }
}

module.exports = Partenariat;
