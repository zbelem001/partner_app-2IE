const Partenariat = require('../models/Partenariat');

class PartenariatController {
  
  // Créer un nouveau partenariat
  static async createPartenariat(req, res) {
    try {
      console.log('📝 Création d\'un nouveau partenariat par utilisateur:', req.user.id);
      console.log('Données reçues:', req.body);

      const partenariatData = {
        ...req.body,
        responsable_2ie_id: req.user.id
      };

      const result = await Partenariat.create(partenariatData);

      res.status(201).json({
        success: true,
        message: 'Partenariat créé avec succès',
        data: result
      });

    } catch (error) {
      console.error('❌ Erreur lors de la création du partenariat:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du partenariat',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Récupérer tous les partenariats
  static async getAllPartenariats(req, res) {
    try {
      console.log('📋 Récupération de tous les partenariats pour l\'utilisateur:', req.user.id);

      const partenariats = await Partenariat.findAll();

      res.status(200).json({
        success: true,
        data: partenariats,
        count: partenariats.length
      });

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des partenariats:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des partenariats',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Récupérer un partenariat par ID
  static async getPartenariatById(req, res) {
    try {
      const { id } = req.params;
      console.log('🔍 Récupération du partenariat:', id);

      const partenariat = await Partenariat.findById(id);

      if (!partenariat) {
        return res.status(404).json({
          success: false,
          message: 'Partenariat non trouvé'
        });
      }

      res.status(200).json({
        success: true,
        data: partenariat
      });

    } catch (error) {
      console.error('❌ Erreur lors de la récupération du partenariat:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du partenariat',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Mettre à jour un partenariat
  static async updatePartenariat(req, res) {
    try {
      const { id } = req.params;
      console.log('📝 Mise à jour du partenariat:', id);
      console.log('Nouvelles données:', req.body);

      const updatedPartenariat = await Partenariat.update(id, req.body);

      if (!updatedPartenariat) {
        return res.status(404).json({
          success: false,
          message: 'Partenariat non trouvé'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Partenariat mis à jour avec succès',
        data: updatedPartenariat
      });

    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du partenariat:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du partenariat',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Supprimer un partenariat
  static async deletePartenariat(req, res) {
    try {
      const { id } = req.params;
      console.log('🗑️ Suppression du partenariat:', id);

      // Vérifier d'abord s'il y a des conventions liées
      const hasConventions = await Partenariat.hasConventions(id);
      if (hasConventions) {
        return res.status(400).json({
          success: false,
          message: 'Impossible de supprimer ce partenariat car il a des conventions actives. Veuillez d\'abord supprimer ou transférer les conventions.'
        });
      }

      const deleted = await Partenariat.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Partenariat non trouvé'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Partenariat supprimé avec succès'
      });

    } catch (error) {
      console.error('❌ Erreur lors de la suppression du partenariat:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du partenariat',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Obtenir les statistiques des partenariats
  static async getPartenariatsStats(req, res) {
    try {
      console.log('📊 Récupération des statistiques des partenariats');

      const stats = await Partenariat.getStats();

      res.status(200).json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Obtenir les partenariats par statut
  static async getPartenariatsByStatus(req, res) {
    try {
      const { status } = req.params;
      console.log('📋 Récupération des partenariats par statut:', status);

      const partenariats = await Partenariat.findByStatus(status);

      res.status(200).json({
        success: true,
        data: partenariats,
        count: partenariats.length
      });

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des partenariats par statut:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des partenariats',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }
}

module.exports = PartenariatController;
