const CLASSES_API_URL = '/api/admin/classes';

export interface Class {
  id: number;
  name: string;
  level: string;
  slug: string;
  schoolId: number;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  Bilan?: {
    total: number;
    pass: number;
    recovery: number;
    redouble: number;
  };
  is_finish: boolean;
}

export interface PaginatedClasses {
   classes: Class[];
  total: number;
  per_page: number;
}

// Récupérer une liste paginée de classes
export const fetchClasses = async (
  page: number = 1,
  search: string = "",
  promo: number
): Promise<PaginatedClasses> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    // Correction de l'URL : utilisation correcte des paramètres de requête
    const response = await fetch(
      `${CLASSES_API_URL}?page=${page}&search=${search}&promo=${promo}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des classes.');
    }

    const data = await response.json();
  
    return data.data; // Assurez-vous que la structure des données correspond à vos besoins
  } catch (error: any) {
    console.error('Erreur lors de la récupération des classes:', error.message);
    throw error;
  }
};

// Ajouter une nouvelle classe
export const addClass = async (name: string, level: string, promo: number): Promise<Class> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(CLASSES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, level, promo }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l\'ajout de la classe.');
    }

    const data = await response.json();
    
    return data.data;
  } catch (error: any) {
    console.error('Erreur lors de l\'ajout de la classe:', error.message);
    throw error;
  }
};

// Mettre à jour une classe existante
export const updateClass = async (id: number, name: string, level: string): Promise<Class> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(`${CLASSES_API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, level}),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la mise à jour de la classe.');
    }

    const data = await response.json();

    return data.data;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la classe:', error.message);
    throw error;
  }
};

