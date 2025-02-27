const API_URL = '/api';

// Fonction de connexion
export const login = async (matricule: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ matricule, password }),
      });
  
      // On vérifie si la réponse est OK
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || 'Erreur lors de la connexion';
  
        // Si l'erreur est liée à l'email ou mot de passe incorrect, on personnalise le message
        if (errorMessage.includes('Bad email or password')) {
          throw new Error('Matricule ou mot de passe incorrect');
        }
  
        // Si ce n'est pas une erreur liée à l'email ou mot de passe, on renvoie l'erreur générique
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      
      return data; // Retourne les données de l'utilisateur après une connexion réussie
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      throw error; // Laisse l'erreur propagée
    }
  };
  

 // Fonction d'inscription
export const register = async (schoolName: string, name: string, email: string, phone: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ schoolName, name, email, phone, password }),
      });
  
      // On vérifie si la réponse est OK
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || 'Erreur lors de l\'inscription';
  
        // Si l'école existe déjà, on gère cette erreur spécifiquement
        if (errorMessage === "This School already exists") {
          throw new Error("Cette école existe déjà. Veuillez vérifier les informations.");
        }
  
        // Si l'erreur n'est pas liée à l'existence de l'école, on laisse l'erreur générique
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      return data; // Retourne les données de l'utilisateur après une inscription réussie
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      throw error; // Propagation de l'erreur pour gestion en frontend
    }
  };

  // Fonction pour oublier le mot de passe (Forget Password)
export const forgetPassword = async (matricule: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/forget`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ matricule }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.message || 'Erreur lors de la demande de réinitialisation';

      if (response.status=== 422) {
        throw new Error("Ce matricule n'existe pas.");
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
 
    return data;
  } catch (error) {
    console.error("Erreur Forget Password :", error);
    throw error;
  }
};

// Fonction pour confirmer le code (Confirm Code)
export const confirmCode = async (matricule: string, code: number) => {
  try {
    const response = await fetch(`${API_URL}/auth/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ matricule, code }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.message || 'Erreur lors de la confirmation du code';

      if (response.status===422) {
        throw new Error("Le code est invalide ou a expiré.");
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
 
    return data;
  } catch (error) {
    console.error("Erreur Confirm Code :", error);
    throw error;
  }
};

// Fonction pour réinitialiser le mot de passe (Reset Password)
export const resetPassword = async (matricule: string, password: string, confirm: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ matricule, password, confirm }),  // Ajouter confirm ici
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.message || 'Erreur lors de la réinitialisation du mot de passe';

      throw new Error(errorMessage);
    }

    const data = await response.json();
 
    return data;
  } catch (error) {
    console.error("Erreur Reset Password :", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  const token = localStorage.getItem('session');
  if (!token) {
    console.error('Token absent');
    throw new Error('Token absent');
  }

  try {
    
    const response = await fetch(`${API_URL}/logout`, {
      
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur API:', errorData);
      throw new Error(errorData.message || "Erreur lors de la déconnexion.");
    }

    
    localStorage.removeItem('token');
  } catch (error: any) {
    console.error('Erreur lors de la déconnexion:', error.message);
    throw new Error(error.message || "Erreur inconnue lors de la déconnexion.");
  }
};
