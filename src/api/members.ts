const API_URL_MEMBERS = '/api/admin/members';

// Interface pour un membre
export interface Member {
  id: number;
  matricule: string;
  name: string;
  email: string | null;
  phone: string | null;
  photo: string | null;
  password?: string;
  role: string;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  schoolId: number;
}

// Interface pour les données paginées
export interface PaginatedMembers {
  persons: Member[];
  total: number;
  per_page: number;
}

// Récupérer la liste paginée des membres par rôle
export const fetchMembersByRole = async (
  role: 'admin' | 'teacher' | 'student' | '',
  page: number = 1,
  search: string = ''
): Promise<PaginatedMembers> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(
      `${API_URL_MEMBERS}?page=${page}&search=${search}&role=${role}`,
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
      throw new Error(errorData.message || 'Erreur lors de la récupération des membres.');
    }

    const data = await response.json();
  
    return {
      persons: data.data.persons,
      total: data.data.total,
      per_page: data.data.per_page,
    };
  } catch (error: any) {
    console.error(`Erreur lors de la récupération des membres ${role}:`, error.message);
    throw error;
  }
};

// Ajouter un nouveau membre
export const addMember = async (
  name: string,
  role: 'admin' | 'teacher' | 'student',
  phone?: string,
  email?: string
): Promise<Member> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(API_URL_MEMBERS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, phone, email, role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l\'ajout du membre.');
    }

    const data = await response.json();

    return data.data;
  } catch (error: any) {
    console.error('Erreur lors de l\'ajout du membre:', error.message);
    throw error;
  }
};

// Modifier un membre existant
export const updateMember = async (
  id: number,
  name: string,
  role: 'admin' | 'teacher' | 'student',
  phone?: string,
  email?: string
): Promise<Member> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(`${API_URL_MEMBERS}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, phone, email, role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la modification du membre.');
    }

    const data = await response.json();
   
    return data.data;
  } catch (error: any) {
    console.error('Erreur lors de la modification du membre:', error.message);
    throw error;
  }
};

// Récupérer les détails d'un membre spécifique
export const fetchMemberDetails = async (id: number): Promise<Member> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(`${API_URL_MEMBERS}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération du membre.');
    }

    const data = await response.json();
  
    return data.person;
  } catch (error: any) {
    console.error('Erreur lors de la récupération du membre:', error.message);
    throw error;
  }
};
