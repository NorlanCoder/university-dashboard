export interface StatsData {
    nbrMatter: number;
    nbrUe: number;
    nbrStudent: number;
    nbrTeacher: number;
    nbrAdmin: number;
  }
  
  const BASE_API_URL_CARD = '/api/admin/dashboard/card';
  
  export const fetchInfosStats = async (): Promise<StatsData> => {
    const token = localStorage.getItem('session');
    if (!token) {
      throw new Error('Token non présent. Veuillez vous connecter.');
    }
  
    try {
      const response = await fetch(BASE_API_URL_CARD, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des statistiques.');
      }
      const responseData = await response.json();
  
      if (!responseData?.data) {
        throw new Error('La réponse de l\'API est invalide.');
      }
  
     
  
      return responseData.data; 
    } catch (error: any) {
      console.error(`Erreur lors de la récupération des statistiques:`, error.message);
      throw new Error(error.message || 'Une erreur inattendue est survenue.');
    }
  };
  