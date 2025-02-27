import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { logout as logoutAPI } from '@/api/auth';
import { logout } from '@/features/auth/authSlice';
import { useTheme } from "@/components/context/ThemeContext";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Récupérer l'état utilisateur via Redux
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { theme } = useTheme();

  const handleLogout = async () => {
    try {
      await logoutAPI();
      dispatch(logout());
      navigate('/');
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error.message);
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4 focus:outline-none"
      >
        {/* {isAuthenticated && (
          <div className="hidden text-right lg:block">
            <p className="text-sm font-medium text-black dark:text-white">
              {user?.name || 'Utilisateur'}
            </p>
            <p className="text-xs text-gray-500">{user?.role || 'Role inconnu'}</p>
          </div>
        )} */}
        {isAuthenticated && (
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-gray-300">
            <img
              src={user?.photo || '/src/images/brand/administrator_3551.webp'}
              alt="Avatar"
              className="h-full w-full object-cover dark:bg-white"
            />
          </div>
        )}
        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.41 0.91a.75.75 0 011.18 0L6 5.32 10.41.91a.75.75 0 011.18 1.18L6.59 7.09a.75.75 0 01-1.18 0L0.41 2.09a.75.75 0 010-1.18z"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <div
          className="absolute right-0 mt-1 w-64 rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {/* Section Header avec image et informations utilisateur */}
          <div style={{ backgroundColor: theme.primaryColor, color: theme.textColor }}
            className="flex items-center gap-4 rounded-t-lg  px-4 py-3 ">
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white">
              <img
                src={user?.photo || '/src/images/brand/administrator_3551.webp'}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name || 'Utilisateur'}</p>
              <p className="text-xs">{user?.role || 'Role inconnu'}</p>
            </div>
          </div>

          {/* Liste des liens */}
          <ul className="flex flex-col py-2">
            <li className='flex items-center gap-3  px-2 mx-4 hover:rounded-lg py-1 text-sm font-medium text-gray-700 hover:bg-gray-100'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" /></g>
              </svg>
              <Link
                to="/profile"
                className="text-sm font-medium text-gray-700 "
              >
                <i className="ri-user-line text-lg"></i>
                Profile
              </Link>
            </li>
            {/* <li className='flex items-center gap-3  px-2 mx-4 hover:rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-100'>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5l-5-5m5 5H9"/>
                </svg>
        <Link
          to="/settings"
          className=" text-sm font-medium text-gray-700 "
        >
          <i className="ri-settings-line text-lg"></i>
          Settings
        </Link>
      </li> */}
          </ul>

          {/* Bouton de déconnexion */}
          <button
            onClick={handleLogout}
            className="flex  border-t  border-t-slate-200 w-full items-center gap-3 hover:rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <i className="ri-logout-circle-line text-lg"></i>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
            </svg>
            Déconnexion
          </button>
        </div>

      )}
    </ClickOutside>
  );
};

export default DropdownUser;
