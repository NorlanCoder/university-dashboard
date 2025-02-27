
export interface Matter {
    id: number;
    name: string;
    slug: string;
    credit: number;
    schoolId: number;
    is_delete: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface MattersState {
    matterss: Matter[];
    total: number;
    per_page: number;
    totalePages: number,
    page: number,
  }


  