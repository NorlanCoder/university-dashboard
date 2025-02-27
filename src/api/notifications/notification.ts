
// Interfaces TypeScript

const API_URL = "/api/admin/notification";
export interface Member {
  id: number;
  matricule: string;
  name: string;
  email: string | null;
  phone: string | null;
  photo: string | null;
  password?: string;
  role: string;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  schoolId: number;
}

export interface Notifications {
  id: number;
  adminId: number;
  title: string;
  content: string;
  file: string | null;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  User: Member[];
}

export interface lastPromo {
  id: number;
  name: string;
  slug: string;
  schoolId: number;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface AddNotificationData {
  title: string;
  content: string;
  type: string;
  users?: number[];
  class?: [string , number];
  doc?: File | null;
}

export interface PaginatedNotification {
   lastPromo: lastPromo;
    notifications: Notifications[];
    total: number;
    per_page: number;
  };


// Fonction pour ajouter une notification
export const addNotification = async (
  addData: AddNotificationData
): Promise<PaginatedNotification> => {
  const token = localStorage.getItem("session");
  if (!token) {
    throw new Error("Token non présent. Veuillez vous connecter.");
  }

  try {
    const formData = new FormData();
    if (addData.title) formData.append("title", addData.title);
    if (addData.content) formData.append("content", addData.content);
    if (addData.type) formData.append("type", addData.type);

    if (addData.users) { formData.append("users", JSON.stringify(addData.users)); }
    if (addData.class) {formData.append("class", JSON.stringify(addData.class));}
    if (addData.doc) { formData.append("doc", addData.doc);}

    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de l'envoi de la notification.");
    }

    const data = await response.json();
    
    return data.data;
  } catch (error: any) {
    console.error("Erreur lors de l'envoi de la notification:", error.message);
    throw error;
  }
};

// Fonction pour lister les notifications
export const listNotifications = async (
  page: number = 1,
  search: string = "",
): Promise<PaginatedNotification> => {
  const token = localStorage.getItem("session");
  if (!token) {
    throw new Error("Token non présent. Veuillez vous connecter.");
  }

  try {
    const response = await fetch(`${API_URL}?search=${search}&page=${page}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de la récupération des notifications.");
    }

    const data = await response.json();
  
    return data.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des notifications:", error.message);
    throw error;
  }
};
