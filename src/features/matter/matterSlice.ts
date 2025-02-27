import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Matter, MattersState } from './matterTypes';

const initialMattersState: MattersState = {
  matterss: [],
  totalePages: 0,
  page: 1,
  total: 0,
  per_page: 10,
};

export const matterSlice = createSlice({
  name: 'matter',
  initialState: initialMattersState,
  reducers: {
    setMatters: (state, action: PayloadAction<Matter[]>) => {
      state.matterss = action.payload;
    },
    setTotalMatters: (state, action: PayloadAction<number>) => {
        state.total = action.payload;
      },
      setTotalPages: (state, action: PayloadAction<number>) => {
        state.totalePages = action.payload;
      },
      setCurrentPage: (state, action: PayloadAction<number>) => {
        state.page = action.payload;
      },

addMatters: (state, action: PayloadAction<Matter>) => {
    if (action.payload) {
      state.matterss.push(action.payload); 
    }
  },
  
  updateMatters: (state, action) => {
    const { id, name, credit } = action.payload; // S'assurer que les données sont bien structurées
    const index = state.matterss.findIndex((matter) => matter.id === id);

    if (index !== -1) {
      state.matterss[index] = { ...state.matterss[index], name, credit };
    } else {
      console.error("La matière avec cet ID n'existe pas :", id);
    }
  },


    deleteMatters: (state, action: PayloadAction<number>) => {
      state.matterss = state.matterss.filter((matter) => matter.id !== action.payload);
    },
  },
});

export const { setMatters, addMatters, updateMatters, deleteMatters, setTotalMatters, setTotalPages, setCurrentPage } = matterSlice.actions;

export default matterSlice.reducer;
