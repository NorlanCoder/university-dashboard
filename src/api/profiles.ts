const API_URL = '/api';

// Afficher user
export const fetchUserInfo = async (): Promise<any> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(`${API_URL}/profil`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des informations utilisateur.');
    }

    const data = await response.json();
   
    return data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error.message);
    throw error;
  }
};

// Fonction Update profile user
export const updateProfile = async (updatedData: { email?: string; phone?: string; photo?: File }): Promise<any> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const formData = new FormData();
    if (updatedData.email) formData.append('email', updatedData.email);
    if (updatedData.phone) formData.append('phone', updatedData.phone);
    if (updatedData.photo) formData.append('photo', updatedData.photo);

    const response = await fetch(`${API_URL}/profil`, {
      method: 'PUT',
      headers: {

        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la mise à jour du profil.');
    }

    const data = await response.json();
 
    return data;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du profil:', error.message);
    throw error;
  }
};

// Fonction Update profile school
export const updateProfileSchool = async (updatedData: { name?: string; email?: string; phone?: string; adress: string; moy: string; image?: File }): Promise<any> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const formData = new FormData();
    if (updatedData.email) formData.append('email', updatedData.email);
    if (updatedData.phone) formData.append('phone', updatedData.phone);
    if (updatedData.name) formData.append('name', updatedData.name);
    if (updatedData.adress) formData.append('adress', updatedData.adress);
    if (updatedData.moy) formData.append('moy', updatedData.moy);
    if (updatedData.image) formData.append('image', updatedData.image);
   

    const response = await fetch(`${API_URL}/profil`, {
      method: 'PATCH',
      headers: {

        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la mise à jour du profil Université.');
    }

    const data = await response.json();
 
    return data;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du profil Université:', error.message);
    throw error;
  }
};

// Reset pass
export const updatePassword = async (old: string, password: string, confirm: string): Promise<any> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  // Vérifiez si l'une des valeurs est undefined ou vide
  if (!old || !password || !confirm) {
    throw new Error('Tous les champs doivent être remplis.');
  }


  try {
    const response = await fetch(`${API_URL}/reset_password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        old,
        password,
        confirm,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la réinitialisation du mot de passe.');
    }

    const data = await response.json();
 
    return data;
  } catch (error: any) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error.message);
    throw error;
  }
};
 
