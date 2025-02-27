const BILAN_STU_API_URL = '/api/admin/classes';

type Student = {
  id: number;
  matricule: string;
  name: string;
  email: string;
  phone: string | null;
  photo: string | null;
  role: string;
  is_delete: boolean;
  schoolId: number;
};

export type ClassInfo = {
  id: number;
  name: string;
  slug: string;
  level: string;
  schoolId: number;
  promoId: number;
  is_delete: boolean;
};

type Semester = {
  moy: number | null;
  totals: number;
  credits: number;
};

export interface Bilan {
  id: number;
  studentId: number;
  classId: number;
  sem1: Semester;
  sem2: Semester;
  total: {
    moy: number | null;
    totals: number;
    credits: number;
  };
  is_pass: boolean;
  is_delete: boolean;
  student: Student;
  class: ClassInfo;
}


export interface PaginatedBilanStudent {
  bilans: Bilan[]; 
  total: number;
  per_page: number;
}

// Fonction pour récupérer une liste paginée de bilans d'étudiants
export const fetchListEtudiant = async (
  classId: string, 
  page: number = 1,
  search: string = ""
): Promise<PaginatedBilanStudent> => {
  // Vérification du token
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token manquant. Veuillez vous connecter.');
  }

  // Vérification des paramètres
  if (!classId || typeof classId !== 'string') {
    throw new Error('L\'ID de la classe est invalide ou manquant.');
  }

  try {
    // Construction de l'URL
    const url = `${BILAN_STU_API_URL}/${classId}/bilan?page=${page}&search=${search}`;

    // Appel à l'API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    // Vérification de la réponse
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des bilans des étudiants.');
    }

    // Traitement des données
    const responseData = await response.json();

    if (!responseData || !responseData.data) {
      throw new Error('La structure de la réponse est incorrecte.');
    }


    return responseData.data; 
  } catch (error: any) {
    console.error('Erreur lors de la récupération des bilans des étudiants:', error.message);
    throw error;
  }
};

// Fonction api delete
export const deleteStudent = async (classId: string, student: number): Promise<void> => {
    const token = localStorage.getItem('session');
    if (!token) {
      throw new Error('Token manquant. Veuillez vous connecter.');
    }
  
    // Vérification des paramètres
    if (!classId || typeof classId !== 'string' || !student) {
      throw new Error('L\'ID de la classe ou de l\'étudiant est invalide ou manquant.');
    }
  
    try {
      // Construction de l'URL
      const url = `${BILAN_STU_API_URL}/${classId}/student`;
  
      // Appel à l'API
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ student: student }),
      });
  
      // Vérification de la réponse
      if (!response.ok) {
        const errorData = await response.json();
  
        // Gestion des cas spécifiques comme le statut 403
        if (response.status === 403 && errorData.message === 'Impossible') {
          throw new Error('La suppression est impossible car l\'étudiant a déjà des notes associées.');
        } 
  
        // Gestion générique pour les autres erreurs
        throw new Error(errorData.message || 'Erreur lors de la suppression de l\'étudiant.');
      }
  
      
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'étudiant:', error.message);
      throw error;
    }
  };

//Add Student in class
export const addStudentsToClass = async (classId: string , studentIds: number[]): Promise<void> => {
    const token = localStorage.getItem('session');
    if (!token) {
      throw new Error('Token manquant. Veuillez vous connecter.');
    }
  
  
    try {
    
      // URL de l'API
      const url = `${BILAN_STU_API_URL}/${classId}/student`;
  
      // Appel à l'API avec la méthode PUT
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ students: studentIds }), // Corps de la requête
      });
  
      // Vérification de la réponse
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l’ajout des étudiants.');
      }
  
   
    } catch (error: any) {
      console.error('Erreur lors de l’ajout des étudiants :', error.message);
      throw error;
    }
  };
  
