import { Course, Member, Matter } from "../Classroom/ListCourses";
import { UE } from "../ues";

const API_URL = '/api/student';

export interface Class {
  id: number;
  name: string;
  slug: string;
  level: string;
  schoolId: number;
  promoId: number;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  promo: {
    id: number;
    name: string;
    slug: string;
    schoolId: number;
    is_delete: boolean;
    createdAt: string;
    updatedAt: string;
  }
}

export interface Bilan {
  id: number;
  studentId: number;
  classId: number;
  sem1: {
    moy: number;
    totals: number;
    credits: number;
  };
  sem2: {
    moy: number;
    totals: number;
    credits: number;
  };
  total: {
    moy: number;
    totals: number;
    credits: number;
  };
  is_pass: boolean;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  class: Class;
}

export interface Note {
  id: number;
  studentId: number;
  courseId: number;
  note: [number];
  control: number;
  exam: number;
  moy: number;
  is_validate: boolean;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  course: {
    teacher: Member;
    matter: Matter;
    ue: UE;
  };
}

export interface NotePerson {
  id: number;
  studentId: number;
  courseId: number;
  note: [number];
  control: number;
  exam: number;
  moy: number;
  is_validate: boolean;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  course: {
    teacher: Member;
    matter: Matter;
    ue: UE;
    class: Class;
  };
}

export interface Summary {
  id: number,
  sem: string,
  moy: {
    moy: number,
    totals: number,
    credits: number,
  },
  ues: [
    {
      id: number;
      name: string;
      credit: number;
      matters: [
        {
          courseId: number,
          code: string,
          matter: string,
          credit: number,
          stat: {
            note: [number],
            control: number,
            exam: number,
            moy: number,
            is_validate: true
          }
        },
      ]
    }
  ],
}

export interface PaginatedBilans {
  bilans: Bilan[];
  total: number;
  per_page: number;
}

export interface Recap {
  bilan: Bilan;
  notes: Note[];
  total: number;
  per_page: number;
}

export interface Document {
  id: number,
  teacherId: number,
  courseId: number,
  title: string,
  content: string,
  file: null,
  is_delete: boolean,
  createdAt: string,
  updatedAt: string,
}

export interface Support {
  note: NotePerson;
  supports: Document[];
  total: number;
  per_page: number;
}

// Récupérer une liste paginée de promotions
export const fetchBilan = async (page: number = 1, search: string = ""): Promise<PaginatedBilans> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(`${API_URL}?page=${page}&search=${search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des promotions.');
    }

    const data = await response.json();
    return data.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des promotions:', error.message);
    throw error;
  }
};

// Récupérer les détails d'une promotion spécifique
export const listCourse = async (id: number, page: number = 1, search: string = ""): Promise<Recap> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(`${API_URL}/${id}/course?page=${page}&search=${search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des détails de la promotion.');
    }
    const data = await response.json();
    return data.data;

  } catch (error: any) {
    console.error('Erreur lors de la récupération des détails de la promotion:', error.message);
    throw error;
  }
};

// Récaptitulatif
export const listsummary = async (id: number): Promise<[Summary]> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(`${API_URL}/${id}/bilan`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des détails de la promotion.');
    }
    const data = await response.json();
    return data.data;

  } catch (error: any) {
    console.error('Erreur lors de la récupération des détails de la promotion:', error.message);
    throw error;
  }
};

// Récaptitulatif
export const supportCourse = async (id: number, page: number = 1, search: string = "", courseId: number,): Promise<Support> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }

  try {
    const response = await fetch(`${API_URL}/${id}/course/${courseId}/support?page=${page}&search=${search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des détails de la promotion.');
    }
    const data = await response.json();
    return data.data;

  } catch (error: any) {
    console.error('Erreur lors de la récupération des détails de la promotion:', error.message);
    throw error;
  }
};
