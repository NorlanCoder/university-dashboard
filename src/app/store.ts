import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/auth/authSlice';
import matterReducer from '../features/matter/matterSlice'; // Importation de appSlice
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import tokenExpirationMiddleware from '../features/auth/middleware/tokenExpirationMiddleware'; // Importe le middleware

// Configuration de Redux Persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Auth est persisté, mais matter ne le sera pas pour l'instant 
};

// Reducer persisté avec le persistor
const persistedReducer = persistReducer(persistConfig, authReducer);

// Création du store avec middleware personnalisé
const store = configureStore({
  reducer: {
    auth: persistedReducer,
    matter: matterReducer, // Ajout de appSlice ici
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(tokenExpirationMiddleware), // Ajoute le middleware ici
});
 
export const persistor = persistStore(store);
export default store;

// Types pour TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
