// Service pour la gestion des prospects
const API_BASE_URL = 'http://localhost:5000/api';

class ProspectService {
  
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

  // Créer un nouveau prospect
  static async createProspect(prospectData) {
    try {
      const response = await fetch(`${API_BASE_URL}/prospects`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(prospectData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création du prospect');
      }

      return data;
    } catch (error) {
      console.error('Erreur création prospect:', error);
      throw error;
    }
  }

  // Récupérer tous les prospects
  static async getAllProspects() {
    try {
      const response = await fetch(`${API_BASE_URL}/prospects`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des prospects');
      }

      return data;
    } catch (error) {
      console.error('Erreur récupération prospects:', error);
      throw error;
    }
  }

  // Récupérer un prospect par ID
  static async getProspectById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/prospects/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération du prospect');
      }

      return data;
    } catch (error) {
      console.error('Erreur récupération prospect:', error);
      throw error;
    }
  }

  // Mettre à jour un prospect
  static async updateProspect(id, prospectData) {
    try {
      const response = await fetch(`${API_BASE_URL}/prospects/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(prospectData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour du prospect');
      }

      return data;
    } catch (error) {
      console.error('Erreur mise à jour prospect:', error);
      throw error;
    }
  }

  // Supprimer un prospect
  static async deleteProspect(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/prospects/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la suppression du prospect');
      }

      return data;
    } catch (error) {
      console.error('Erreur suppression prospect:', error);
      throw error;
    }
  }

  // Récupérer les statistiques des prospects
  static async getProspectsStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/prospects/stats/overview`, {
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
}

export default ProspectService;
