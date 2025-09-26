const { pool } = require('../config/database');

class Convention {
  constructor(data) {
    this.id_convention = data.id_convention;
    this.partenariats_id = data.partenariats_id;
    this.titre = data.titre;
    this.type_convention = data.type_convention;
    this.objet = data.objet;
    this.reference_interne = data.reference_interne;
    this.statut = data.statut;
    this.date_signature = data.date_signature;
    this.date_debut = data.date_debut;
    this.date_fin = data.date_fin;
    this.montant_engage = data.montant_engage;
    this.service_concerne = data.service_concerne;
    this.responsable_id = data.responsable_id;
    this.date_creation = data.date_creation;
    this.derniere_mise_a_jour = data.derniere_mise_a_jour;
    
    // Champs additionnels depuis les jointures
    this.partenariat_titre = data.partenariat_titre;
    this.partenaire_nom = data.partenaire_nom;
    this.responsable_nom = data.responsable_nom;
    this.responsable_prenom = data.responsable_prenom;
  }

  // Créer une nouvelle convention
  static async create(conventionData) {
    try {
      const {
        partenariats_id,
        titre,
        type_convention,
        objet,
        reference_interne,
        statut,
        date_signature,
        date_debut,
        date_fin,
        montant_engage,
        service_concerne,
        responsable_id
      } = conventionData;

      const query = `
        INSERT INTO conventions (
          partenariats_id, titre, type_convention, objet, reference_interne,
          statut, date_signature, date_debut, date_fin, montant_engage,
          service_concerne, responsable_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id_convention
      `;

      const result = await pool.query(query, [
        partenariats_id, titre, type_convention, objet, reference_interne,
        statut || 'brouillon', date_signature, date_debut, date_fin,
        montant_engage, service_concerne, responsable_id
      ]);

      return await this.findById(result.rows[0].id_convention);
    } catch (error) {
      throw new Error(`Erreur lors de la création de la convention: ${error.message}`);
    }
  }

  // Trouver une convention par ID avec toutes les informations liées
  static async findById(id) {
    try {
      const query = `
        SELECT 
          c.*,
          pt.titre as partenariat_titre,
          p.nom_organisation as partenaire_nom,
          u.nom as responsable_nom,
          u.prenom as responsable_prenom
        FROM conventions c
        LEFT JOIN partenariats pt ON c.partenariats_id = pt.id_partenariat
        LEFT JOIN partenaires p ON pt.partenaire_id = p.id_partenaire
        LEFT JOIN utilisateurs u ON c.responsable_id = u.id_utilisateur
        WHERE c.id_convention = $1
      `;
      
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return new Convention(result.rows[0]);
    } catch (error) {
      throw new Error(`Erreur lors de la recherche de la convention: ${error.message}`);
    }
  }

  // Obtenir toutes les conventions avec pagination et filtres
  static async findAll(limit = 50, offset = 0, filters = {}) {
    try {
      let query = `
        SELECT 
          c.*,
          pt.titre as partenariat_titre,
          p.nom_organisation as partenaire_nom,
          u.nom as responsable_nom,
          u.prenom as responsable_prenom
        FROM conventions c
        LEFT JOIN partenariats pt ON c.partenariats_id = pt.id_partenariat
        LEFT JOIN partenaires p ON pt.partenaire_id = p.id_partenaire
        LEFT JOIN utilisateurs u ON c.responsable_id = u.id_utilisateur
        WHERE 1=1
      `;
      const values = [];
      let paramIndex = 1;

      // Filtres dynamiques
      if (filters.statut) {
        query += ` AND c.statut = $${paramIndex}`;
        values.push(filters.statut);
        paramIndex++;
      }

      if (filters.type_convention) {
        query += ` AND c.type_convention = $${paramIndex}`;
        values.push(filters.type_convention);
        paramIndex++;
      }

      if (filters.service_concerne) {
        query += ` AND c.service_concerne ILIKE $${paramIndex}`;
        values.push(`%${filters.service_concerne}%`);
        paramIndex++;
      }

      if (filters.responsable_id) {
        query += ` AND c.responsable_id = $${paramIndex}`;
        values.push(filters.responsable_id);
        paramIndex++;
      }

      if (filters.date_debut) {
        query += ` AND c.date_debut >= $${paramIndex}`;
        values.push(filters.date_debut);
        paramIndex++;
      }

      if (filters.date_fin) {
        query += ` AND c.date_fin <= $${paramIndex}`;
        values.push(filters.date_fin);
        paramIndex++;
      }

      if (filters.search) {
        query += ` AND (c.titre ILIKE $${paramIndex} OR c.reference_interne ILIKE $${paramIndex + 1} OR p.nom_organisation ILIKE $${paramIndex + 2})`;
        values.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
        paramIndex += 3;
      }

      query += ` ORDER BY c.derniere_mise_a_jour DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      values.push(limit, offset);
      
      const result = await pool.query(query, values);
      
      return result.rows.map(row => new Convention(row));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des conventions: ${error.message}`);
    }
  }

  // Compter le nombre total de conventions
  static async count(filters = {}) {
    try {
      let query = `
        SELECT COUNT(*) as total 
        FROM conventions c
        LEFT JOIN partenariats pt ON c.partenariats_id = pt.id_partenariat
        LEFT JOIN partenaires p ON pt.partenaire_id = p.id_partenaire
        WHERE 1=1
      `;
      const values = [];
      let paramIndex = 1;

      // Appliquer les mêmes filtres que findAll
      if (filters.statut) {
        query += ` AND c.statut = $${paramIndex}`;
        values.push(filters.statut);
        paramIndex++;
      }

      if (filters.type_convention) {
        query += ` AND c.type_convention = $${paramIndex}`;
        values.push(filters.type_convention);
        paramIndex++;
      }

      if (filters.service_concerne) {
        query += ` AND c.service_concerne ILIKE $${paramIndex}`;
        values.push(`%${filters.service_concerne}%`);
        paramIndex++;
      }

      if (filters.responsable_id) {
        query += ` AND c.responsable_id = $${paramIndex}`;
        values.push(filters.responsable_id);
        paramIndex++;
      }

      if (filters.search) {
        query += ` AND (c.titre ILIKE $${paramIndex} OR c.reference_interne ILIKE $${paramIndex + 1} OR p.nom_organisation ILIKE $${paramIndex + 2})`;
        values.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
      }

      const result = await pool.query(query, values);
      return parseInt(result.rows[0].total);
    } catch (error) {
      throw new Error(`Erreur lors du comptage des conventions: ${error.message}`);
    }
  }

  // Mettre à jour une convention
  static async update(id, conventionData) {
    try {
      const allowedFields = [
        'partenariats_id', 'titre', 'type_convention', 'objet', 'reference_interne',
        'statut', 'date_signature', 'date_debut', 'date_fin', 'montant_engage',
        'service_concerne', 'responsable_id'
      ];
      const fields = [];
      const values = [];
      let parameterIndex = 1;

      for (const [key, value] of Object.entries(conventionData)) {
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
        UPDATE conventions 
        SET ${fields.join(', ')}, derniere_mise_a_jour = CURRENT_TIMESTAMP
        WHERE id_convention = $${parameterIndex}
      `;

      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        throw new Error('Convention non trouvée');
      }

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la convention: ${error.message}`);
    }
  }

  // Supprimer une convention
  static async delete(id) {
    try {
      const query = 'DELETE FROM conventions WHERE id_convention = $1';
      const result = await pool.query(query, [id]);

      if (result.rowCount === 0) {
        throw new Error('Convention non trouvée');
      }

      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la convention: ${error.message}`);
    }
  }

  // Obtenir les documents d'une convention
  static async getDocuments(conventionId) {
    try {
      const query = `
        SELECT * FROM documents 
        WHERE convention_id = $1 
        ORDER BY date_ajout DESC
      `;
      
      const result = await pool.query(query, [conventionId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des documents: ${error.message}`);
    }
  }

  // Obtenir le circuit de validation d'une convention
  static async getValidationCircuit(conventionId) {
    try {
      const query = `
        SELECT 
          cv.*,
          u.nom as validateur_nom,
          u.prenom as validateur_prenom
        FROM circuit_validation cv
        LEFT JOIN utilisateurs u ON cv.valide_par = u.id_utilisateur
        WHERE cv.convention_id = $1 
        ORDER BY cv.ordre_etape ASC
      `;
      
      const result = await pool.query(query, [conventionId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du circuit de validation: ${error.message}`);
    }
  }

  // Obtenir le suivi d'une convention
  static async getSuivi(conventionId) {
    try {
      const query = `
        SELECT 
          sc.*,
          u.nom as createur_nom,
          u.prenom as createur_prenom
        FROM suivi_conventions sc
        LEFT JOIN utilisateurs u ON sc.cree_par = u.id_utilisateur
        WHERE sc.convention_id = $1 
        ORDER BY sc.date_action DESC
      `;
      
      const result = await pool.query(query, [conventionId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du suivi: ${error.message}`);
    }
  }

  // Obtenir les évaluations d'une convention
  static async getEvaluations(conventionId) {
    try {
      const query = `
        SELECT 
          e.*,
          u.nom as evaluateur_nom,
          u.prenom as evaluateur_prenom
        FROM evaluations e
        LEFT JOIN utilisateurs u ON e.eval_par = u.id_utilisateur
        WHERE e.convention_id = $1 
        ORDER BY e.date_evaluation DESC
      `;
      
      const result = await pool.query(query, [conventionId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des évaluations: ${error.message}`);
    }
  }

  // Obtenir les statistiques des conventions
  static async getStatistics() {
    try {
      const queries = [
        // Par statut
        `SELECT statut, COUNT(*) as count FROM conventions GROUP BY statut`,
        // Par type
        `SELECT type_convention, COUNT(*) as count FROM conventions WHERE type_convention IS NOT NULL GROUP BY type_convention`,
        // Conventions qui expirent bientôt (dans les 30 jours)
        `SELECT COUNT(*) as count FROM conventions WHERE date_fin BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days' AND statut = 'signe'`,
        // Total des montants engagés
        `SELECT SUM(montant_engage) as total_montant FROM conventions WHERE montant_engage IS NOT NULL`,
        // Total
        `SELECT COUNT(*) as total FROM conventions`
      ];

      const results = await Promise.all(queries.map(query => pool.query(query)));

      return {
        par_statut: results[0].rows,
        par_type: results[1].rows,
        expire_bientot: parseInt(results[2].rows[0].count),
        total_montant: parseFloat(results[3].rows[0].total_montant || 0),
        total: parseInt(results[4].rows[0].total)
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
    }
  }
}

module.exports = Convention;
