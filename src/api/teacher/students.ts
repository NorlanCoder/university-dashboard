const API_URL = '/api/teacher';

type Matter = {
  id: number;
  name: string;
  slug: string;
  credit: number;
  schoolId: number;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
}

type UE = {
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
}

type  Teacher = {
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
  ue: UE;
  teacher: Teacher;
}


type StudentDetails = {
 studentId: number;
  matricule: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
};

export interface StudentCourse {
  id: number;
  studentId: number;
  courseId: number; 
  note: any[];
  control: number | null;
  exam: number | null;
  moy: number | null;
  is_validate: boolean;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  student: StudentDetails;
 
} 

export interface Support {
  id: number;
  teacherId: number;
  courseId: number;
  title: string;
  content: string;
  file: string;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  course: {
    id: number;
    classId: number;
    teacherId: number;
    matterId: number;
    ueId: number;
    is_delete: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface PaginatedStudents {
  students: StudentCourse[];
  course: Course;
  total: number;
  per_page: number;
}

export interface PaginatedDocuments {
  supports: Support[];
  total: number;
  per_page: number;
}

export interface Document {
  message: string;
  status: number;
}


type NotePayload = {
  notes: {
    student: number;
    control: number;
  }[];
  type: string; 
};


// Fonction pour récupérer une liste paginée des étudiants par cours
export const fetchStudentsByCourse = async ( classId: string,  courseId: string, page: number = 1, search: string = ""): Promise<PaginatedStudents> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token manquant. Veuillez vous connecter.');
  }

  if (!classId || !courseId || typeof classId !== 'string' || typeof courseId !== 'string') {
    throw new Error('Les IDs de la classe ou du cours sont invalides ou manquants.');
  }

  try {
    const url = `${API_URL}/${classId}/course/${courseId}?page=${page}&search=${search}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des étudiants par cous.');
    }

    const responseData = await response.json();

    if (!responseData || !responseData.data) {
      throw new Error('La structure de la réponse est incorrecte.');
    }

   

    return responseData.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des étudiants par cours:', error.message);
    throw error;
  }
};


// Fonction pour récupérer une liste paginée des étudiants par cours
export const fetchDocuments = async ( classId: string,  courseId: string, page: number = 1, search: string = ""): Promise<PaginatedDocuments> => {
  console.log(classId, courseId)
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token manquant. Veuillez vous connecter.');
  }

  if (!classId || !courseId || typeof classId !== 'string' || typeof courseId !== 'string') {
    throw new Error('Les IDs de la classe ou du cours sont invalides ou manquants.');
  }

  try {
    const url = `${API_URL}/${classId}/course/${courseId}/support?search=${search}&page=${page}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });


    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des étudiants par cous.');
    }

    const responseData = await response.json();

    console.log(responseData.data)

    if (!responseData || !responseData.data) {
      throw new Error('La structure de la réponse est incorrecte.');
    }

   

    return responseData.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des étudiants par cours:', error.message);
    throw error;
  }
};



export const AddNoteOrExamStudentAllByCourse = async ( classeId: string, courseId: string, payload: NotePayload ): Promise<void> => {
    const token = localStorage.getItem('session');
    if (!token) {
      throw new Error('Token manquant. Veuillez vous connecter.');
    }
  
    if (!classeId || !courseId) {
      throw new Error('Les IDs de la classe ou du cours sont invalides ou manquants.');
    }
  
    // Validation des données
    if (!['control', 'exam'].includes(payload.type)) {
      throw new Error('Type de note invalide. Utilisez "control" ou "exam".');
    }
  
    const invalidNotes = payload.notes.filter(
      (note) => typeof note.student !== 'number' || typeof note.control !== 'number'
    );
  
    if (invalidNotes.length > 0) {
      throw new Error('Certains étudiants ou notes sont invalides.');
    }
  
    // Suppression des doublons
    const uniqueNotes = Array.from(new Map(payload.notes.map((note) => [note.student, note])).values());
  
    try {
      const url = `${API_URL}/${classeId}/course/${courseId}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...payload, notes: uniqueNotes }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l’ajout des notes.');
      }
 
    } catch (error: any) {
      console.error('Erreur lors de l’ajout des notes :', {
        message: error.message,
        payloadSent: payload,
      });
      throw error;
    }
  };
  
// Fonction pour ajouter une note à un étudiant spécifique
export const AddNoteByStudentSelect = async ( classId: string, courseId: string, studentId: string, control: number ): Promise<void> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token manquant. Veuillez vous connecter.');
  }

  try {
    const url = `${API_URL}/${classId}/course/${courseId}/${studentId}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ control }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l’ajout de la note.');
    }

  } catch (error: any) {
    console.error('Erreur lors de l’ajout de la note :', error.message);
    throw error;
  }
};
  
  // Fonction pour modifier une note d'un étudiant spécifique
  export const UpdateNoteByStudentSelect = async (
    classId: string,
    courseId: string,
    studentId: string,
    position: number,
    control: number
  ): Promise<void> => {
    const token = localStorage.getItem('session');
    if (!token) {
      throw new Error('Token manquant. Veuillez vous connecter.');
    }
  
    try {
      const url = `${API_URL}/${classId}/course/${courseId}/${studentId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ position, control }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification de la note.');
      }

    } catch (error: any) {
      console.error('Erreur lors de la modification de la note :', error.message);
      throw error;
    }
  }; 

//Fonction api pour supprimer une note d'un étudiant spécifique
export const DeleteNoteByStudentSelect = async (
  classId: string,
  courseId: string,
  studentId: string,
  position: number
): Promise<void> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token manquant. Veuillez vous connecter.');
  }

  try {
    const url = `${API_URL}/${classId}/course/${courseId}/${studentId}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ position}),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la suppression de la note.');
    }
 
  } catch (error: any) {
    console.error('Erreur lors de la suppression de la note :', error.message);
    throw error;
  }
}; 

// Fonction pour ajouter un exam à un étudiant spécifique
export const UpdateExamByStudentSelect = async (
  classId: string,
  courseId: string,
  studentId: string,
  exam: number
): Promise<void> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token manquant. Veuillez vous connecter.');
  }

  try {
    const url = `${API_URL}/${classId}/course/${courseId}/${studentId}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ exam }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la modification exam.');
    }

  } catch (error: any) {
    console.error('Erreur lors de la modification exam :', error.message);
    throw error;
  }
};


export const AddDocumentStudent = async (classId: string, courseId: string, formData1: { title: string; content: string; file: File} ): Promise<Document> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token manquant. Veuillez vous connecter.');
  }

  if (!classId || !courseId || typeof classId !== 'string' || typeof courseId !== 'string') {
    throw new Error('Les IDs de la classe ou du cours sont invalides ou manquants.');
  }   

  try {

    const formData = new FormData();
    if (formData1.title) formData.append('title', formData1.title);
    if (formData1.content) formData.append('content', formData1.content);
    if (formData1.title) formData.append('doc', formData1.file);

    const url = `${API_URL}/${classId}/course/${courseId}/support`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

  

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l\'enregistrement du document.');
    }

    const responseData = await response.json();
 
    return responseData;
    
  } catch (error: any) {
    console.error('Erreur lors de l\'enregistrement du document :', error.message);
    throw error;
  }

}


export const fetchSumControlNote = async (classId: string, courseId: string): Promise<void> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token manquant. Veuillez vous connecter.');
  }

  if (!classId || !courseId) {
    throw new Error('Les IDs de la classe ou du cours sont invalides ou manquants.');
  }


  try {
    const url = `${API_URL}/${classId}/course/${courseId}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors du calcul moyenne contrôle continu.');
    }
 
  } catch (error: any) {
    console.error('Erreur lors du calcul moyenne contrôl continu :', error.message);
    throw error;
  }
}


export const fetchMoyenneGeneral = async (classId: string, courseId: string): Promise<void> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token manquant. Veuillez vous connecter.');
  }

  if (!classId || !courseId) {
    throw new Error('Les IDs de la classe ou du cours sont invalides ou manquants.');
  }


  try {
    const url = `${API_URL}/${classId}/course/${courseId}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors du calcul moyenne générale.');
    }

  } catch (error: any) {
    console.error('Erreur lors du calcul moyenne générale :', error.message);
    throw error;
  }
}