export interface PromoStat {
    promoName: string;
    classCount: number;
    studentCount: number;
  }
  
  export interface Classroom {
    nameClass: string;
    passed: number;
    failed: number;
    total: number;
  }
  
  export interface BilanPromo {
    promoName: string;
    classrooms: Classroom[];
  }
  
  export interface DashboardGraphData {
    promoStat: PromoStat[];
    bilanPromo: BilanPromo[];
  }
  const BASE_API_URL_GRAPH = '/api/admin/dashboard/graph';

  export const fetchDashboardData = async (): Promise<DashboardGraphData> => {
  
    const token = localStorage.getItem('session');
    if (!token) {
      throw new Error('Token non présent. Veuillez vous connecter.');
    }
    try {  
        const response = await fetch(BASE_API_URL_GRAPH, { 
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
});
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data.data;
  } catch (error: any) {
    console.error(`Erreur lors de la récupération des statistiques:`, error.message);
    throw new Error(error.message || 'Une erreur inattendue est survenue.');
  }
};