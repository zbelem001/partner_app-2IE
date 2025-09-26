const Prospect = require('../models/Prospect');

class ProspectController {
  
  // Créer un nouveau prospect
  static async createProspect(req, res) {
    try {
      console.log('📝 Création d\'un nouveau prospect par utilisateur:', req.user.id);
      console.log('Données reçues:', req.body);

      const prospectData = {
        ...req.body,
        utilisateur_id: req.user.id
      };

      const result = await Prospect.create(prospectData);

      res.status(201).json({
        success: true,
        message: 'Prospect créé avec succès',
        data: result
      });

      console.log('✅ Prospect créé avec l\'ID:', result.id_prospect);

    } catch (error) {
      console.error('❌ Erreur lors de la création du prospect:', error);
      
      if (error.message.includes('existe déjà')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du prospect',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Récupérer tous les prospects
  static async getAllProspects(req, res) {
    try {
      console.log('📋 Récupération des prospects par utilisateur:', req.user.id);

      // Paramètres de filtrage optionnels
      const filters = {
        utilisateur_id: req.user.id, // Toujours filtrer par utilisateur connecté
        statut: req.query.statut,
        secteur: req.query.secteur,
        pays: req.query.pays,
        search: req.query.search,
        limit: req.query.limit ? parseInt(req.query.limit) : undefined
      };

      // Supprimer les filtres vides (sauf utilisateur_id qui est obligatoire)
      Object.keys(filters).forEach(key => {
        if (key !== 'utilisateur_id' && !filters[key]) delete filters[key];
      });

      const result = await Prospect.findAll(filters);

      res.json({
        success: true,
        message: 'Prospects récupérés avec succès',
        data: result,
        count: result.length,
        filters: filters
      });

      console.log('✅ Nombre de prospects récupérés:', result.length);

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des prospects:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des prospects',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Récupérer un prospect par ID
  static async getProspectById(req, res) {
    try {
      const { id } = req.params;
      console.log('🔍 Recherche du prospect ID:', id);

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'ID du prospect invalide'
        });
      }

      const prospect = await Prospect.findById(parseInt(id));

      if (!prospect) {
        return res.status(404).json({
          success: false,
          message: 'Prospect non trouvé'
        });
      }

      // Vérifier que le prospect appartient à l'utilisateur connecté
      if (prospect.utilisateur_id && prospect.utilisateur_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé à ce prospect'
        });
      }

      res.json({
        success: true,
        message: 'Prospect récupéré avec succès',
        data: prospect
      });

      console.log('✅ Prospect trouvé:', prospect.nom_organisation);

    } catch (error) {
      console.error('❌ Erreur lors de la recherche du prospect:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du prospect',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Mettre à jour un prospect
  static async updateProspect(req, res) {
    try {
      const { id } = req.params;
      console.log('✏️ Mise à jour du prospect ID:', id, 'par utilisateur:', req.user.id);

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'ID du prospect invalide'
        });
      }

      // Vérifier si le prospect existe
      const existingProspect = await Prospect.findById(parseInt(id));
      if (!existingProspect) {
        return res.status(404).json({
          success: false,
          message: 'Prospect non trouvé'
        });
      }

      // Vérifier que le prospect appartient à l'utilisateur connecté
      if (existingProspect.utilisateur_id && existingProspect.utilisateur_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé à ce prospect'
        });
      }

      const updatedProspect = await Prospect.update(parseInt(id), req.body);

      res.json({
        success: true,
        message: 'Prospect mis à jour avec succès',
        data: updatedProspect
      });

      console.log('✅ Prospect mis à jour:', updatedProspect.nom_organisation);

    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du prospect:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du prospect',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Supprimer un prospect
  static async deleteProspect(req, res) {
    try {
      const { id } = req.params;
      console.log('🗑️ Suppression du prospect ID:', id, 'par utilisateur:', req.user.id);

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'ID du prospect invalide'
        });
      }

      // Vérifier si le prospect existe
      const existingProspect = await Prospect.findById(parseInt(id));
      if (!existingProspect) {
        return res.status(404).json({
          success: false,
          message: 'Prospect non trouvé'
        });
      }

      // Vérifier que le prospect appartient à l'utilisateur connecté
      if (existingProspect.utilisateur_id && existingProspect.utilisateur_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé à ce prospect'
        });
      }

      await Prospect.delete(parseInt(id));

      res.json({
        success: true,
        message: 'Prospect supprimé avec succès'
      });

      console.log('✅ Prospect supprimé:', existingProspect.nom_organisation);

    } catch (error) {
      console.error('❌ Erreur lors de la suppression du prospect:', error);
      
      if (error.message.includes('lié à d\'autres données')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du prospect',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Obtenir les statistiques des prospects
  static async getProspectsStats(req, res) {
    try {
      console.log('📊 Récupération des statistiques des prospects pour utilisateur:', req.user.id);

      const stats = await Prospect.getStatistics(req.user.id);

      res.json({
        success: true,
        message: 'Statistiques récupérées avec succès',
        data: stats
      });

      console.log('✅ Statistiques récupérées');

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }
}

module.exports = ProspectController;
