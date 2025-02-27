
const LIST_API_URL = '/api/student';

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
  id: number;
  sem: string;
  moy: Moyenne;
  ues: UE[];
}

export interface BilanResponse {
  data: Semester[];
  status: number;
}

export const fetchListBilan = async (classId: string): Promise<BilanResponse> => {
  const token = localStorage.getItem("session");
  if (!token) throw new Error("Token manquant. Veuillez vous connecter.");

  // Vérification des paramètres
  if (!classId) {
    throw new Error('L\'ID de la classe est invalide ou manquant.');
  }

  try {
    const url = `${LIST_API_URL}/${classId}/bilan`;

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
