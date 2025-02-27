const API_URL = '/api/admin/promos';

export interface Promo {
  id: number;
  name: string;
  slug: string;
  schoolId: number;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPromos {
  promos: Promo[];
  total: number;
  per_page: number;
}

// Récupérer une liste paginée de promotions
export const fetchPromo= async (page: number = 1, search: string = ""): Promise<PaginatedPromos> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(`${API_URL}?page=${page}&search=${search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des promotions.');
    }

    const data = await response.json();
    
    return data.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des promotions:', error.message);
    throw error;
  }
};


// Ajouter une nouvelle promotion
export const addPromo= async (name: string): Promise<Promo> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l\'ajout de la promotion.');
    }

    const data = await response.json();
  
    return data.data;
  } catch (error: any) {
    console.error('Erreur lors de l\'ajout de la promotion:', error.message);
    throw error;
  }
};

// Mettre à jour une promotion existante
export const updatePromo = async (id: number, name: string): Promise<Promo> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la mise à jour de la promotion.');
    }

    const data = await response.json();
    
    return data.data;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la promotion:', error.message);
    throw error;
  }
};

// Récupérer les détails d'une promotion spécifique
export const fetchPromoDetails = async (id: number): Promise<Promo> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des détails de la promotion.');
    }

    const data = await response.json();

    return data.promo;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des détails de la promotion:', error.message);
    throw error;
  }
};
