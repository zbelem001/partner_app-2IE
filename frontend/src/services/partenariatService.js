// Service pour la gestion des partenariats
const API_BASE_URL = 'http://localhost:5000/api';

class PartenariatService {
  
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

  // Créer un nouveau partenariat
  static async createPartenariat(partenariatData) {
    try {
      const response = await fetch(`${API_BASE_URL}/partenariats`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(partenariatData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création du partenariat');
      }

      return data;
    } catch (error) {
      console.error('Erreur création partenariat:', error);
      throw error;
    }
  }

  // Récupérer tous les partenariats
  static async getAllPartenariats() {
    try {
      const response = await fetch(`${API_BASE_URL}/partenariats`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des partenariats');
      }

      return data;
    } catch (error) {
      console.error('Erreur récupération partenariats:', error);
      throw error;
    }
  }

  // Récupérer un partenariat par ID
  static async getPartenariatById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/partenariats/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération du partenariat');
      }

      return data;
    } catch (error) {
      console.error('Erreur récupération partenariat:', error);
      throw error;
    }
  }

  // Mettre à jour un partenariat
  static async updatePartenariat(id, partenariatData) {
    try {
      const response = await fetch(`${API_BASE_URL}/partenariats/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(partenariatData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour du partenariat');
      }

      return data;
    } catch (error) {
      console.error('Erreur mise à jour partenariat:', error);
      throw error;
    }
  }

  // Supprimer un partenariat
  static async deletePartenariat(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/partenariats/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la suppression du partenariat');
      }

      return data;
    } catch (error) {
      console.error('Erreur suppression partenariat:', error);
      throw error;
    }
  }

  // Récupérer les statistiques des partenariats
  static async getPartenariatsStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/partenariats/stats/overview`, {
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

  // Récupérer les partenariats par statut
  static async getPartenariatsByStatus(status) {
    try {
      const response = await fetch(`${API_BASE_URL}/partenariats/status/${status}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des partenariats');
      }

      return data;
    } catch (error) {
      console.error('Erreur récupération partenariats par statut:', error);
      throw error;
    }
  }
}

export default PartenariatService;
