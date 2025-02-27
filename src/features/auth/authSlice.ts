
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialUserState, payloadAuthenticated, UserAttribute } from './authTypes';

export interface InitialUserState {
  user: UserAttribute;
  isAuthenticated: boolean;
  session: string;
  expires: string;
  mySchool: boolean;
}

// Création du slice
export const authSlice = createSlice({
  name: 'auth',
  initialState: initialUserState,
  reducers: {
    authenticated: (state, action: PayloadAction<payloadAuthenticated>) => {
      state.isAuthenticated = true;
      state.session = action.payload.session;
      state.mySchool = action.payload.mySchool;
      state.user = action.payload.user;
      state.expires = action.payload.expires;
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('mySchool', JSON.stringify(action.payload.mySchool));

      localStorage.setItem('session', action.payload.session);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('tokenExpiration', action.payload.expires.toString()); // Ajout expiration
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.mySchool = false;
      state.session = '';
      state.expires = '';
      state.user = initialUserState.user;

      // Supprimez les informations de l'utilisateur du localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('session');
      localStorage.removeItem('user');
    },
    rehydrateUser: (state) => {
      const storedUser = localStorage.getItem('user');
      const storedSession = localStorage.getItem('session');
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const mySchool = JSON.parse(localStorage.getItem('mySchool') || 'false');
      const tokenExpiration = localStorage.getItem('tokenExpiration');

      const currentTime = Date.now();

      if (storedUser && storedSession && isAuthenticated && tokenExpiration && currentTime < new Date(String(tokenExpiration)).getTime()) {
        state.user = JSON.parse(storedUser);
        state.session = storedSession;
        state.isAuthenticated = true;
        state.mySchool = mySchool;
      } else {
        state.isAuthenticated = false;
        state.mySchool = false;
        state.session = '';
        state.expires = '';
        state.user = initialUserState.user;
        localStorage.clear();
      }
    },

    updateUserInfo: (state, action: PayloadAction<Partial<UserAttribute>>) => {
      state.user = { ...state.user, ...action.payload };
      // Mettez également à jour le localStorage pour persister les modifications
      const updatedUser = { ...state.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    },
  },
});

export const { authenticated, logout, rehydrateUser, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;
