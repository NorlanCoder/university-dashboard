const API_URL1 = '/api/teacher';
const API_URL2 = '/api/student';


export interface Promo {
  id: number;
  name: string;
  slug: string;
  schoolId: number;
  is_delete: boolean;
  createdAt: string; 
  updatedAt: string; 
}

export interface History {
  course: string;       
  ue: string;           
  class: string;        
  studentCourse: number; 
  studentValid: number;
  level: string;  
}



// Interface pour les matières
export interface Matter {
  courseId: number;
  code: string;
  matter: string;
  credit: number;
  stat: {
      note: number[];
      control: number | null;
      exam: number | null;
      moy: number | null;
      is_validate: boolean | null;
  };
}

export interface UE {
  id: number;
  name: string;
  credit: number;
  is_validate: boolean | null;
  matters: Matter[];
}

export interface Bilan {
  id: number;
  sem: string;
  moy: {
      moy: number;
      totals: number;
      credits: number;
  };
  ues: UE[];
}

export interface Stat {
  name: string;
  course: number;
  credit: number;
}



export interface LastClass {
  id: number;
  name: string;
  slug: string;
  level: string;
  schoolId: number;
  promoId: number;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  promo: Promo;
}


export interface ProcessedUE {
  name: string;
  moyenne: number;
  credits: number;
  validated: boolean | null;
}


export interface SkillData {
  subject: string;
  value: number;
}


export interface MetricData {
  name: string;
  value: number;
}

export interface GradeData {
  subject: string;
  control: number | null;
  exam: number | null;
  moyenne: number | null;
}

export interface TeacherData {
  promo: Promo;
  totalClass: number;
  totalcourse: number;
  totalstudent: number;
  histories: History[];
}

export interface StudentData {
  lastClass: LastClass;
  stat: Stat[];
  bilan: Bilan[];
}

// Récupérer la liste des classes
export const fetchTeacher = async (): Promise<TeacherData> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }


  try {
    const response = await fetch(`${API_URL1}/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des informations dashboard.');
    }

    const data = await response.json();
    return data.data;

  } catch (error: any) {
    console.error('Erreur lors de la récupération des informations dashboard', error.message);
    throw error;
  }
};


// Récupérer les informations liées à l'étudiant
export const fetchStudent = async (): Promise<StudentData> => {
  const token = localStorage.getItem('session');
  if (!token) {
    throw new Error('Token non présent. Veuillez vous connecter.');
  }


  try {
    const response = await fetch(`${API_URL2}/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });


    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des informations dashboard.');
    }

    const data = await response.json();
    return data.data;

  } catch (error: any) {
    console.error('Erreur lors de la récupération des informations dashboard', error.message);
    throw error;
  }
};