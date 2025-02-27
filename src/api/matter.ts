const API_URL = '/api/admin/matters';

export interface Matter {
  id: number;
  name: string;
  slug: string;
  code:string;
  credit: number;
  schoolId: number;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedMatters {
  matters: Matter[];
  total: number;
  per_page: number;
}

// Récupérer une liste paginée de matières
export const fetchMatters = async (page: number = 1, search: string = ""): Promise<PaginatedMatters> => {
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
      throw new Error(errorData.message || 'Erreur lors de la récupération des matières.');
    }

    const data = await response.json();
   
    return data.data; 
  } catch (error: any) {
    console.error('Erreur lors de la récupération des matières:', error.message);
    throw error;
  }
};

// Ajouter une nouvelle matière
export const addMatter = async (name: string, credit: number, code: string): Promise<Matter> => {
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
      body: JSON.stringify({ name, credit, code }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l\'ajout de la matière.');
    }

    const data = await response.json();
    
    return data.data;
  } catch (error: any) {
    console.error('Erreur lors de l\'ajout de la matière:', error.message);
    throw error;
  } 
};

// Mettre à jour une matière existante
export const updateMatter = async (id: number, name: string, credit: number, code:string): Promise<Matter> => {
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
      body: JSON.stringify({ name, credit, code }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la mise à jour de la matière.');
    }

    const data = await response.json();
   
    return data.data;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la matière:', error.message);
    throw error;
  } 
};

// Récupérer les détails d'une matière spécifique
export const fetchMatterDetails = async (id: number): Promise<Matter> => {
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
      throw new Error(errorData.message || 'Erreur lors de la récupération des détails de la matière.');
    }

    const data = await response.json();
  
    return data.matter;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des détails de la matière:', error.message);
    throw error;
  }
};
