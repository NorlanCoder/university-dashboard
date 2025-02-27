const API_URL_UES = '/api/admin/ues';

export interface Matter {
  id: number;
  name: string;
  slug: string; 
  credit: number;
  schoolId: number;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  isSelected?: boolean;
}

export interface UE {
  id: number;
  name: string;
  slug: string; 
  credit: number;
  semester: number; 
  level: string;
  schoolId: number;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  Matter: Matter[]; // Liste des objets Matter associés
}

export interface PaginatedUEs {
  ues: UE[];
  total: number;
  per_page: number;
}

// Fonction pour récupérer une liste paginée d'UEs
export const fetchUes = async (page: number = 1, search: string = ""): Promise<PaginatedUEs> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(`${API_URL_UES}?page=${page}&search=${search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des UEs.');
    }

    const { data } = await response.json();
   
    return data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des UEs:', error.message);
    throw error;
  }
};

// Fonction pour ajouter une nouvelle UE
export const addUe = async (name: string, semester: number, level: string, matters: number[]): Promise<UE> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(API_URL_UES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, semester, level, matters }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de l'ajout de l'UE.");
    }

    const data = await response.json();
    
    return data.data;
  } catch (error: any) {
    console.error('Erreur lors de l\'ajout de l\'UE:', error.message);
    throw error;
  }
};

// Fonction pour mettre à jour une UE existante
export const updateUe = async (id: number, name: string, semester: number, level: string, matters: number[]): Promise<UE> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(`${API_URL_UES}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, semester, level, matters }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de la mise à jour de l'UE.");
    }

    const data = await response.json();
    
    return data.data;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de l\'UE:', error.message);
    throw error;
  }
};

// Fonction pour récupérer les détails d'une UE
export const fetchUeDetails = async (id: number): Promise<UE> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(`${API_URL_UES}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de la récupération des détails de l'UE.");
    }

    const data = await response.json();

    return data.ue;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des détails de l\'UE:', error.message);
    throw error;
  }
};