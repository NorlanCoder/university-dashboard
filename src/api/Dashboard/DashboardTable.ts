export interface Stat {
    promoName: string;
    classCount: number;
    studentCount: number;
    studentPass: number;
    studentFail: number;
}

export interface Admin {
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

export interface DashboardTableData {
    Stats: Stat[];
    admins: Admin[];
}

const BASE_API_URL_TABLE = '/api/admin/dashboard/table';

export const fetchDashboardTableData = async (): Promise<DashboardTableData> => {
    const token = localStorage.getItem('session');
    if (!token) {
        throw new Error('Token non présent. Veuillez vous connecter.');
    }
    try {
        const response = await fetch(BASE_API_URL_TABLE, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Échec de la récupération des données');
        }
        const data = await response.json();
       

        return data.data;
    } catch (error: any) {
        console.error('Erreur lors de la récupération des données du tableau:', error.message);
        throw new Error(error.message || 'Une erreur inattendue est survenue.');
    }
};
