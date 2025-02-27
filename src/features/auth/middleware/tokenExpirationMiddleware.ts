import { Middleware } from '@reduxjs/toolkit';
import { logout } from '../authSlice';

const tokenExpirationMiddleware: Middleware = ({ dispatch }) => (next) => (action) => {
  const tokenExpiration = String(localStorage.getItem('tokenExpiration'));
  const currentTime = Date.now();
  // console.warn('current', currentTime);
  // console.warn('expires', new Date(String(tokenExpiration)).getTime());

  // Vérifier le type de l'action pour éviter l'erreur  
  if (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    tokenExpiration &&
    currentTime >= new Date(String(tokenExpiration)).getTime() &&
    action.type !== logout.type
  ) {
    dispatch(logout());
    localStorage.removeItem('tokenExpiration'); // Supprime l'élément du localStorage
    console.warn('Token expiré, utilisateur déconnecté automatiquement.');
    return; // Arrête ici pour éviter de continuer le flux d'actions
  }

  return next(action); // Passe l'action au middleware suivant
};

export default tokenExpirationMiddleware;