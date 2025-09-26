// Service pour la gestion des conventions
const API_BASE_URL = 'http://localhost:5000/api';

class ConventionService {
  
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

  // Créer une nouvelle convention
  static async createConvention(conventionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/conventions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(conventionData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création de la convention');
      }

      return data;
    } catch (error) {
      console.error('Erreur création convention:', error);
      throw error;
    }
  }

  // Récupérer toutes les conventions
  static async getAllConventions() {
    try {
      const response = await fetch(`${API_BASE_URL}/conventions`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des conventions');
      }

      return data;
    } catch (error) {
      console.error('Erreur récupération conventions:', error);
      throw error;
    }
  }

  // Récupérer une convention par ID
  static async getConventionById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/conventions/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération de la convention');
      }

      return data;
    } catch (error) {
      console.error('Erreur récupération convention:', error);
      throw error;
    }
  }

  // Mettre à jour une convention
  static async updateConvention(id, conventionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/conventions/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(conventionData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour de la convention');
      }

      return data;
    } catch (error) {
      console.error('Erreur mise à jour convention:', error);
      throw error;
    }
  }

  // Supprimer une convention
  static async deleteConvention(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/conventions/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la suppression de la convention');
      }

      return data;
    } catch (error) {
      console.error('Erreur suppression convention:', error);
      throw error;
    }
  }

  // Récupérer les statistiques des conventions
  static async getConventionsStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/conventions/stats/overview`, {
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

  // Récupérer les conventions par statut
  static async getConventionsByStatus(status) {
    try {
      const response = await fetch(`${API_BASE_URL}/conventions/status/${status}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des conventions');
      }

      return data;
    } catch (error) {
      console.error('Erreur récupération conventions par statut:', error);
      throw error;
    }
  }

  // Valider une convention
  static async validateConvention(id, statut, commentaire = '') {
    try {
      const response = await fetch(`${API_BASE_URL}/conventions/${id}/validate`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ statut, commentaire })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la validation de la convention');
      }

      return data;
    } catch (error) {
      console.error('Erreur validation convention:', error);
      throw error;
    }
  }

  // Récupérer le circuit de validation d'une convention
  static async getValidationCircuit(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/conventions/${id}/validation`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération du circuit de validation');
      }

      return data;
    } catch (error) {
      console.error('Erreur récupération circuit validation:', error);
      throw error;
    }
  }
}

export default ConventionService;
