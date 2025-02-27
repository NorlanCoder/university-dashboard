
const LIST_API_URL = '/api/admin/classes';

export interface Stat {
  note: number[];
  control: number | null;
  exam: number | null;
  moy: number | null;
  is_validate: boolean | null;
}

export interface Matter {
  code: string;
  matter: string;
  credit: number;
  stat: Stat;
}

export interface UE {
  id: number;
  name: string;
  credit: number;
  is_validate: boolean | null;
  matters: Matter[];
}

export interface Moyenne {
  moy: number;
  totals: number;
  credits: number;
}

export interface Semester {
  sem: string;
  moy: Moyenne;
  ues: UE[];
}

export interface Student {
  id: number;
  matricule: string;
  name: string;
  email: string;
  phone: string | null;
  photo: string | null;
  password: string;
  role: string;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  schoolId: number;
}

export interface BilanData {
  general: Semester[];
  student: Student;
}

export interface BilanResponse {
  data: BilanData;
  status: number;
}



export const fetchListBilan = async (classId: string, bilan: string): Promise<BilanResponse> => {
  const token = localStorage.getItem("session");
  if (!token) throw new Error("Token manquant. Veuillez vous connecter.");

  // Vérification des paramètres
  if (!classId || typeof classId !== 'string') {
    throw new Error('L\'ID de la classe est invalide ou manquant.');
  }

  try {
    const url = `${LIST_API_URL}/${classId}/bilan/${bilan}`;

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
      throw new Error(errorData.message || "Erreur lors du chargement du relevé.");
    }

    const responseData: BilanResponse = await response.json();

    if (!responseData || !responseData.data) {
      throw new Error('La structure de la réponse est incorrecte.');
    }

    return responseData;
  } catch (error: any) {
    console.error("Erreur lors du chargement du relevé:", error.message);
    throw error;
  }
};
