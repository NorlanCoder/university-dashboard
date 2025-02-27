const BASE_URL = '/api/admin/classes'; 

export const MoyBySemestre = async (classId?: string, semester?: number): Promise<void> => {
    const token = localStorage.getItem('session');
    if (!token) {
      throw new Error('Token non présent. Veuillez vous connecter.');
    }
        try {
            const response = await fetch(`${BASE_URL}/${classId}/course?semester=${semester}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json' ,
                Authorization: `Bearer ${token}`,
              },
            });
        
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Une erreur lors du calcul des moyennes par semestre.');
            }
        
            const data = await response.json();
            
            return data;
          } catch (error: any) {
            console.error(' Une erreur lors du calcul des moyennes par semestre :', error.message);
            throw error;
          }
        };
        
