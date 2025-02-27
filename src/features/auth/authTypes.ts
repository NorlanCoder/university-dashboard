
import { InitialUserState } from "./authSlice";

export interface payloadAuthenticated {
    session: string;
    mySchool:boolean;
    user: UserAttribute;
    expires: string,
  }

  export interface School {
    adress: string;
    createdAt: string;
    email: string;
    id: number;
    image?: string | null;
    is_delete: boolean;
    moy: string;
    name: string;
    percent: number | null;
    phone: string;
    slug: string;
    subscribe: boolean;
    updatedAt: string;
  }
  
  export interface UserAttribute {
    id: number;
    matricule: string;
    name: string;
    email: string;
    phone: string;
    photo?: string | null;
    password: string;
    role: "admin" | "teacher" | "student";
    is_delete: boolean;
    createdAt: string;
    updatedAt: string;
    schoolId: number;
    school?: School | null; 
  } 
  
  export const initialUserState: InitialUserState = {
    isAuthenticated: false,
    mySchool: false,
    expires: "",
    // mySchool:false, 
    session: "",
    user: {
      id: 0,
      matricule: "",
      name: "",
      email: "",
      phone: "",
      photo: "",
      password: "",
      role: "admin",
      is_delete: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      schoolId: 0,
      school: {
        adress: "",
        createdAt: new Date().toISOString(),
        email: "",
        id: 0,
        image: "",
        is_delete: false,
        moy: "",
        name: "",
        percent: null,
        phone: "",
        slug: "",
        subscribe: false,
        updatedAt: new Date().toISOString(),
      },
    },
  };
  