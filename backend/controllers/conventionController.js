const Convention = require('../models/Convention');

class ConventionController {
  
  // Créer une nouvelle convention
  static async createConvention(req, res) {
    try {
      console.log('📝 Création d\'une nouvelle convention par utilisateur:', req.user.id);
      console.log('Données reçues:', req.body);

      const conventionData = {
        ...req.body,
        responsable_id: req.user.id
      };

      const result = await Convention.create(conventionData);

      res.status(201).json({
        success: true,
        message: 'Convention créée avec succès',
        data: result
      });

    } catch (error) {
      console.error('❌ Erreur lors de la création de la convention:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la convention',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Récupérer toutes les conventions
  static async getAllConventions(req, res) {
    try {
      console.log('📋 Récupération de toutes les conventions pour l\'utilisateur:', req.user.id);

      const conventions = await Convention.findAll();

      res.status(200).json({
        success: true,
        data: conventions,
        count: conventions.length
      });

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des conventions:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des conventions',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Récupérer une convention par ID
  static async getConventionById(req, res) {
    try {
      const { id } = req.params;
      console.log('🔍 Récupération de la convention:', id);

      const convention = await Convention.findById(id);

      if (!convention) {
        return res.status(404).json({
          success: false,
          message: 'Convention non trouvée'
        });
      }

      res.status(200).json({
        success: true,
        data: convention
      });

    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la convention:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la convention',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Mettre à jour une convention
  static async updateConvention(req, res) {
    try {
      const { id } = req.params;
      console.log('📝 Mise à jour de la convention:', id);
      console.log('Nouvelles données:', req.body);

      const updatedConvention = await Convention.update(id, req.body);

      if (!updatedConvention) {
        return res.status(404).json({
          success: false,
          message: 'Convention non trouvée'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Convention mise à jour avec succès',
        data: updatedConvention
      });

    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la convention:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la convention',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Supprimer une convention
  static async deleteConvention(req, res) {
    try {
      const { id } = req.params;
      console.log('🗑️ Suppression de la convention:', id);

      const deleted = await Convention.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Convention non trouvée'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Convention supprimée avec succès'
      });

    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la convention:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de la convention',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Obtenir les statistiques des conventions
  static async getConventionsStats(req, res) {
    try {
      console.log('📊 Récupération des statistiques des conventions');

      const stats = await Convention.getStats();

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

  // Obtenir les conventions par statut
  static async getConventionsByStatus(req, res) {
    try {
      const { status } = req.params;
      console.log('📋 Récupération des conventions par statut:', status);

      const conventions = await Convention.findByStatus(status);

      res.status(200).json({
        success: true,
        data: conventions,
        count: conventions.length
      });

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des conventions par statut:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des conventions',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Valider une convention
  static async validateConvention(req, res) {
    try {
      const { id } = req.params;
      const { statut, commentaire } = req.body;
      console.log('✅ Validation de la convention:', id, 'Statut:', statut);

      const validation = await Convention.validate(id, req.user.id, statut, commentaire);

      res.status(200).json({
        success: true,
        message: 'Convention validée avec succès',
        data: validation
      });

    } catch (error) {
      console.error('❌ Erreur lors de la validation de la convention:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la validation de la convention',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Obtenir le circuit de validation d'une convention
  static async getValidationCircuit(req, res) {
    try {
      const { id } = req.params;
      console.log('🔄 Récupération du circuit de validation pour la convention:', id);

      const circuit = await Convention.getValidationCircuit(id);

      res.status(200).json({
        success: true,
        data: circuit
      });

    } catch (error) {
      console.error('❌ Erreur lors de la récupération du circuit de validation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du circuit de validation',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }
}

module.exports = ConventionController;
