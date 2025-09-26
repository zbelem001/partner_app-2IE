// Service pour la gestion des partenaires
const API_BASE_URL = 'http://localhost:5000/api';

class PartnerService {
  
  // Obtenir le token d'authentification
  static getAuthToken() {
    return localStorage.getItem('token');
  }

  // Headers d'authentification
  static getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // Créer un nouveau partenaire
  static async createPartner(partnerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/partners`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(partnerData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création du partenaire');
      }

      return data;
    } catch (error) {
      console.error('Erreur création partenaire:', error);
      throw error;
    }
  }

  // Récupérer tous les partenaires
  static async getAllPartners() {
    try {
      const response = await fetch(`${API_BASE_URL}/partners`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des partenaires');
      }

      return data;
    } catch (error) {
      console.error('Erreur récupération partenaires:', error);
      throw error;
    }
  }

  // Récupérer un partenaire par ID
  static async getPartnerById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/partners/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération du partenaire');
      }

      return data;
    } catch (error) {
      console.error('Erreur récupération partenaire:', error);
      throw error;
    }
  }

  // Mettre à jour un partenaire
  static async updatePartner(id, partnerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/partners/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(partnerData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour du partenaire');
      }

      return data;
    } catch (error) {
      console.error('Erreur mise à jour partenaire:', error);
      throw error;
    }
  }

  // Supprimer un partenaire
  static async deletePartner(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/partners/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la suppression du partenaire');
      }

      return data;
    } catch (error) {
      console.error('Erreur suppression partenaire:', error);
      throw error;
    }
  }

  // Récupérer les statistiques des partenaires
  static async getPartnersStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/partners/stats/overview`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des statistiques');
      }

      return data;
    } catch (error) {
      console.error('Erreur récupération statistiques:', error);
      throw error;
    }
  }

  // Récupérer les partenaires par pays
  static async getPartnersByCountry(country) {
    try {
      const response = await fetch(`${API_BASE_URL}/partners/country/${encodeURIComponent(country)}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des partenaires');
      }

      return data;
    } catch (error) {
      console.error('Erreur récupération partenaires par pays:', error);
      throw error;
    }
  }
}

export default PartnerService;
