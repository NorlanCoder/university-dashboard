const API_URL = '/api/teacher';


export interface Student {
  id: number;
  matricule: string;
  name: string;
  email: string;
  phone: string;
  photo: string | null;
  password: string;
  role: string;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  schoolId: number;
}

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
  
export interface Teacher {
  id: number;
  matricule: string;
  name: string;
  email: string;
  phone: string;
  photo: string | null;
  password: string;
  role: string;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  schoolId: number;
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
}

export interface Courses {
  id: number;
  classId: number;
  teacherId: number;
  matterId: number;
  ueId: number;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  matter: Matter;
  teacher: Teacher;
  ue: UE;
}

export interface Class {
  id: number;
  name: string;
  slug: string;
  level: string;
  promo: number;
  schoolId: number;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  Student: Student[];
}


export interface PaginatedCourses {
  courses: Courses[];
  total: number;
  per_page: number;
}

export interface PaginatedClasses {
  classrooms: Class[];
  total: number;
  per_page: number;
}



// Récupérer la liste des classes
export const fetchClasses = async (page: number = 1, search: string = ''): Promise<PaginatedClasses> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }


  try {
    const response = await fetch(`${API_URL}?search=${search}&page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des classes.');
    }

    const data = await response.json();
    return data.data;

  } catch (error: any) {
    console.error('Erreur lors de la récupération des classes:', error.message);
    throw error;
  }
};

// Récupérer une liste paginée des Cours
export const fetchCourses= async (id: number, page: number = 1, search: string = ''): Promise<PaginatedCourses> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }


  try {
    const response = await fetch(`${API_URL}/${id}/course?search=${search}&page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des cours.');
    }

    const data = await response.json();
    return data.data;

  } catch (error: any) {
    console.error('Erreur lors de la récupération des cours:', error.message);
    throw error;
  }
};

