const Partner = require('../models/Partner');

class PartnerController {
  
  // Créer un nouveau partenaire
  static async createPartner(req, res) {
    try {
      console.log('📝 Création d\'un nouveau partenaire par utilisateur:', req.user.id);
      console.log('Données reçues:', req.body);

      const partnerData = {
        ...req.body
      };

      const result = await Partner.create(partnerData);

      res.status(201).json({
        success: true,
        message: 'Partenaire créé avec succès',
        data: result
      });

    } catch (error) {
      console.error('❌ Erreur lors de la création du partenaire:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du partenaire',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Récupérer tous les partenaires
  static async getAllPartners(req, res) {
    try {
      console.log('📋 Récupération de tous les partenaires pour l\'utilisateur:', req.user.id);

      const partners = await Partner.findAll();

      res.status(200).json({
        success: true,
        data: partners,
        count: partners.length
      });

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des partenaires:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des partenaires',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Récupérer un partenaire par ID
  static async getPartnerById(req, res) {
    try {
      const { id } = req.params;
      console.log('🔍 Récupération du partenaire:', id);

      const partner = await Partner.findById(id);

      if (!partner) {
        return res.status(404).json({
          success: false,
          message: 'Partenaire non trouvé'
        });
      }

      res.status(200).json({
        success: true,
        data: partner
      });

    } catch (error) {
      console.error('❌ Erreur lors de la récupération du partenaire:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du partenaire',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Mettre à jour un partenaire
  static async updatePartner(req, res) {
    try {
      const { id } = req.params;
      console.log('📝 Mise à jour du partenaire:', id);
      console.log('Nouvelles données:', req.body);

      const updatedPartner = await Partner.update(id, req.body);

      if (!updatedPartner) {
        return res.status(404).json({
          success: false,
          message: 'Partenaire non trouvé'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Partenaire mis à jour avec succès',
        data: updatedPartner
      });

    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du partenaire:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du partenaire',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Supprimer un partenaire
  static async deletePartner(req, res) {
    try {
      const { id } = req.params;
      console.log('🗑️ Suppression du partenaire:', id);

      // Vérifier d'abord s'il y a des partenariats liés
      const hasPartenariats = await Partner.hasPartenariats(id);
      if (hasPartenariats) {
        return res.status(400).json({
          success: false,
          message: 'Impossible de supprimer ce partenaire car il a des partenariats actifs. Veuillez d\'abord supprimer ou transférer les partenariats.'
        });
      }

      const deleted = await Partner.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Partenaire non trouvé'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Partenaire supprimé avec succès'
      });

    } catch (error) {
      console.error('❌ Erreur lors de la suppression du partenaire:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du partenaire',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  // Obtenir les statistiques des partenaires
  static async getPartnersStats(req, res) {
    try {
      console.log('📊 Récupération des statistiques des partenaires');

      const stats = await Partner.getStats();

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

  // Obtenir les partenaires par pays
  static async getPartnersByCountry(req, res) {
    try {
      const { country } = req.params;
      console.log('🌍 Récupération des partenaires par pays:', country);

      const partners = await Partner.findByCountry(country);

      res.status(200).json({
        success: true,
        data: partners,
        count: partners.length
      });

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des partenaires par pays:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des partenaires',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }
}

module.exports = PartnerController;
