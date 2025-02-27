const API_URL = '/api/student';

export interface Admin {
  id: number;
  matricule: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  password: string;
  role: string;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  schoolId: number;
}

export interface Notification {
  id: number;
  adminId: number;
  title: string;
  content: string;
  file: string | null;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  admin: Admin;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  per_page: number;
}



export const fetchNotification = async (page: number = 1, search: string = ''): Promise<NotificationsResponse> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }


  try {
    const response = await fetch(`${API_URL}/notifications?search=${search}&page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des notifications.');
    }

    const data = await response.json();
    return data.data;

  } catch (error: any) {
    console.error('Erreur lors de la récupération des notifications:', error.message);
    throw error;
  }
};