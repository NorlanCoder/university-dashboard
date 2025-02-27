
const LIST_COURSES_API_URL = '/api/admin/classes';

//Déclarations interface export
export interface Matter {
    id: number;
    name: string;
    slug: string;
    credit: number;
    schoolId: number;
    is_delete: boolean;
    createdAt: string;
    updatedAt: string;
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

  
  export interface Member {
    id: number;
    matricule: string;
    name: string;
    email: string;
    phone: string;
    photo: string | null;
    role: string;
    is_delete: boolean;
    createdAt: string;
    updatedAt: string;
    schoolId: number;
  }
  
  export interface Course {
    id: number;
    classId: number;
    teacherId: number;
    matterId: number;
    ueId: number;
    is_delete: boolean;
    createdAt: string;
    updatedAt: string;
    matter: Matter;
    teacher: Member;
    ue: UE;
  }
  
  export interface Classroom {
    id: number;
    name: string;
    slug: string;
    level: string;
    schoolId: number;
    promoId: number;
    is_delete: boolean;
    createdAt: string;
    updatedAt: string;
    Course: Course[];
  }

  export interface PaginatedCourses {
    courses: Course[];
    total: number;
    per_page: number;
  };
  
//Fonction fetch fetchListCourse
export const fetchListCourse = async (classId: string): Promise<any> => {
    const token = localStorage.getItem("session");
    if (!token) throw new Error("Token manquant. Veuillez vous connecter.");
  
  // Vérification des paramètres
  if (!classId || typeof classId !== 'string') {
    throw new Error('L\'ID de la classe est invalide ou manquant.');
  }

    try {
      const url = `${LIST_COURSES_API_URL}/${classId}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la récupération des cours.");
      }
  
      const responseData = await response.json();

      if (!responseData ) {
        throw new Error('La structure de la réponse est incorrecte.');
      }
   
      return responseData.classroom;
    } catch (error: any) {
      console.error("Erreur lors de la récupération des cours:", error.message);
      throw error;
    }
  };
  
  // Fonction api delete
  export const deleteCourse = async (classId: string, course: number): Promise<void> => {
    const token = localStorage.getItem('session');
    if (!token) {
      throw new Error('Token manquant. Veuillez vous connecter.');
    }
  
    // Vérification des paramètres
    if (!classId || typeof classId !== 'string' || !course) {
      throw new Error('L\'ID de la classe ou de l\'étudiant est invalide ou manquant.');
    }
  
    try {
      // Construction de l'URL
      const url = `${LIST_COURSES_API_URL}/${classId}/teacher`;
  
      // Appel à l'API
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course: course }),
      });
  
      // Vérification de la réponse
      if (!response.ok) {
        const errorData = await response.json();
  
        // Vérification d'un message spécifique lié aux notes
        if (errorData.message === 'Impossible') {
          throw new Error('Impossible de supprimer ce cours car il contient déjà des notes.');
        }
  
        // Gestion générique pour les autres erreurs
        throw new Error(errorData.message || 'Erreur lors de la suppression de ce cours.');
      }
  
    } catch (error: any) {
      console.error('Erreur lors de la suppression de ce cours:', error.message);
      throw error;
    }
  };
  

//Add course in class
export const addCourseToClass = async (classId: string , teacher: number, ue: number, matter: number ): Promise<void> => {
    const token = localStorage.getItem('session');
    if (!token) {
      throw new Error('Token manquant. Veuillez vous connecter.');
    }
  
  
    try {
 
      // URL de l'API
      const url = `${LIST_COURSES_API_URL}/${classId}/teacher`;
  
      // Appel à l'API avec la méthode PUT
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ teacher, ue,matter}), // Corps de la requête
      });
 
      // Vérification de la réponse
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l’ajout des cours.');
      }
  
    } catch (error: any) {
      console.error('Erreur lors de l’ajout de cours :', error.message);
      throw error;
    }
  };

//Update course in class
export const UpdateCourseToClass = async (id:number, classId: string , teacher: number, ue: number, matter: number ): Promise<void> => {
  
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token manquant. Veuillez vous connecter.');
  }


  try {

    // URL de l'API
    const url = `${LIST_COURSES_API_URL}/${classId}/teacher/${id}`;

    // Appel à l'API avec la méthode PUT
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ teacher, ue,matter}), // Corps de la requête
    });

    // Vérification de la réponse
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors des mise à jour des cours.');
    }


  } catch (error: any) {
    console.error('Erreur lors de mise à jour  de cours :', error.message);
    throw error;
  }
};
  
// Récupérer la liste paginée des membres par rôle
export const fetchCoursesBySemestre = async (
  classId: string, 
  semester: 1 | 2 , 
  page: number = 1,
  search: string = ''
): Promise<PaginatedCourses> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(
      `${LIST_COURSES_API_URL}/${classId}/course?page=${page}&search=${search}&semester=${semester}`,
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
      throw new Error(errorData.message || 'Erreur lors de la récupération des cours par semestre.');
    }

    const data = await response.json();

    return {
      courses: data.data.courses,
      total: data.data.total,
      per_page: data.data.per_page,
    };
  } catch (error: any) {
    console.error(`Erreur lors de la récupération des cours par semestre ${semester}:`, error.message);
    throw error;
  }
};


