import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
// import SidebarLinkGroup from './SidebarLinkGroup';
import { logout } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { useTheme } from "@/components/context/ThemeContext";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {


  const dispatch = useDispatch();
  const navigate = useNavigate();


  const location = useLocation();
  const { pathname } = location;

  const person = useSelector((state: RootState) => state.auth);

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // Fonction de déconnexion
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };




  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);
  const { theme } = useTheme();
  return (
    <aside style={{ backgroundColor: theme.sidebarColor, fontFamily: theme.font, color: theme.textColor }}
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-[250px] flex-col overflow-y-hidden  duration-300 ease-linear  lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-end px-4 pt-5.5 lg:pt-6.5">
        <button ref={trigger} onClick={() => setSidebarOpen(!sidebarOpen)} aria-controls="sidebar" aria-expanded={sidebarOpen} className="block lg:hidden border rounded-md border-black hover:border-bodydark2 p-1 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m11 17l-5-5l5-5m7 10l-5-5l5-5" />
          </svg>
        </button>
      </div>
      <div className="flex items-center justify-start gap-2 px-4 pt-5.5 lg:pt-6.5">
        <NavLink to="/">
          {/* <img src={Logo} alt="Logo" /> */}
          <div style={{ color: theme.textColor }} className="text-2xl  font-bold">O'CAMPUS</div>
        </NavLink>
      </div>
      {/* <!-- SIDEBAR HEADER END --> */}


      {/* <!-- SIDEBAR MAIN --> */}
      <div className="flex flex-col duration-300 ease-linear mt-2">
        <nav className="">
          <div className="py-6 px-5">
            <h3 style={{ color: theme.textColor }}
              className="mb-2 text-xs font-semibold ">MENU</h3>

            {/* Menu Items Based on Role */}
            {/* Admin Menu */}
            {person.user.role === "admin" && (
              <ul className="flex flex-col gap-1.5 overflow-y-auto">
                {/* <!-- Dashboard --> */}
                <li>
                  <NavLink to="/dashboard" className="group relative flex items-center gap-2.5 rounded-lg py-2 px-3 font-medium  duration-300 ease-in-out "
                    style={{
                      backgroundColor: pathname.includes('dashboard') ? theme.primaryColor : '', color: pathname.includes('dashboard') ? theme.textColor : theme.textColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = theme.textColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!pathname.includes('dashboard')) { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = theme.textColor; }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></g></svg>
                    Dashboard
                  </NavLink>
                </li>
                {/* <!-- Bilan --> */}

                <li>
                  <NavLink to="/bilan" className="group relative flex items-center gap-2.5 rounded-lg py-2 px-3 font-medium  duration-300 ease-in-out"
                    style={{
                      backgroundColor: pathname.includes('bilan') ? theme.primaryColor : '', color: pathname.includes('bilan') ? theme.textColor : theme.textColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = theme.textColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!pathname.includes('bilan')) { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = theme.textColor; }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path d="M14 22v-4a2 2 0 1 0-4 0v4" />
                        <path d="m18 10l3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10m12-5v17M4 6l7.106-3.553a2 2 0 0 1 1.788 0L20 6M6 5v17" />
                        <circle cx="12" cy="9" r="2" />
                      </g>
                    </svg>
                    Bilan
                  </NavLink>
                </li>

                {/* <!-- Professeur --> */}
                <li>
                  <NavLink to="/professeur" className="group relative flex items-center gap-2.5 rounded-lg py-2 px-3 font-medium  duration-300 ease-in-out "
                    style={{
                      backgroundColor: pathname.includes('professeur') ? theme.primaryColor : '', color: pathname.includes('professeur') ? theme.textColor : theme.textColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = theme.textColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!pathname.includes('professeur')) { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = theme.textColor; }
                    }} >

                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" /><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" /></g>
                    </svg>
                    Professeur
                  </NavLink>
                </li>
                {/* <!-- Etudiants --> */}
                <li>
                  <NavLink to="/etudiant" className="group relative flex items-center gap-2.5 rounded-lg py-2 px-3 font-medium duration-300 ease-in-out "
                    style={{
                      backgroundColor: pathname.includes('etudiant') ? theme.primaryColor : '', color: pathname.includes('etudiant') ? theme.textColor : theme.textColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = theme.textColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!pathname.includes('etudiant')) { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = theme.textColor; }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0zM22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" /></g>
                    </svg>
                    Etudiants
                  </NavLink>
                </li>
                {/* <!-- Matières --> */}
                <li>
                  <NavLink to="/matieres" className="group relative flex items-center gap-2.5 rounded-lg py-2 px-3 font-mediumduration-300 ease-in-out "
                    style={{
                      backgroundColor: pathname.includes('matieres') ? theme.primaryColor : '', color: pathname.includes('matieres') ? theme.textColor : theme.textColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = theme.textColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!pathname.includes('matieres')) { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = theme.textColor; }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path d="M10 13h4m-2-7v7m4-5V6H8v2" /><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /></g>
                    </svg>
                    Matières
                  </NavLink>
                </li>
                {/* <!-- UEs --> */}
                <li>
                  <NavLink to="/ues" className="group relative flex items-center gap-2.5 rounded-lg py-2 px-3 font-medium  duration-300 ease-in-out "
                    style={{
                      backgroundColor: pathname.includes('ues') ? theme.primaryColor : '', color: pathname.includes('ues') ? theme.textColor : theme.textColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = theme.textColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!pathname.includes('ues')) { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = theme.textColor; }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" /><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" /><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" /></g>
                    </svg>
                    UEs
                  </NavLink>
                </li>
                {/* <!-- Notification --> */}
                <li>
                  <NavLink to="/notification" className="group relative flex items-center gap-2.5 rounded-lg py-2 px-3 font-medium duration-300 ease-in-out "
                    style={{
                      backgroundColor: pathname.includes('notification') ? theme.primaryColor : '', color: pathname.includes('notification') ? theme.textColor : theme.textColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = theme.textColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!pathname.includes('notification')) { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = theme.textColor; }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path d="M10.268 21a2 2 0 0 0 3.464 0m.184-18.686A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.74 7.327A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673a9 9 0 0 1-.585-.665" /><circle cx="18" cy="8" r="3" /></g>
                    </svg>
                    Notification
                  </NavLink>
                </li>
              </ul>
            )}


            {/* Student Menu */}
            {person.user.role === "student" && (
              <ul className="flex flex-col gap-1.5 overflow-y-auto">
                {/* <!-- Dashboard --> */}
                <li>
                  <NavLink to="/dashboard/student" className="group relative flex items-center gap-2.5 rounded-lg py-2 px-3 font-medium  duration-300 ease-in-out "
                    style={{
                      backgroundColor: pathname.includes('dashboard') ? theme.primaryColor : '', color: pathname.includes('dashboard') ? theme.textColor : theme.textColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = theme.textColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!pathname.includes('dashboard')) { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = theme.textColor; }
                    }}
                  />
                  <NavLink to="/dashboard/student" className={`group relative flex items-center gap-2.5 rounded-lg py-2 px-3 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('dashboard') && 'bg-graydark dark:bg-meta-4'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></g></svg>
                    Dashboard
                  </NavLink>
                </li>
                {/* <!-- Bilan --> */}
                <li>
                  <NavLink to="/student/bilan" className="group relative flex items-center gap-2.5 rounded-lg py-2 px-3 font-medium duration-300 ease-in-out "
                    style={{
                      backgroundColor: pathname.includes('bilan') ? theme.primaryColor : '', color: pathname.includes('bilan') ? theme.textColor : theme.textColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = theme.textColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!pathname.includes('bilan')) { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = theme.textColor; }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path d="M14 22v-4a2 2 0 1 0-4 0v4" /><path d="m18 10l3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10m12-5v17M4 6l7.106-3.553a2 2 0 0 1 1.788 0L20 6M6 5v17" /><circle cx="12" cy="9" r="2" /></g>
                    </svg>
                    Bilan
                  </NavLink>
                </li>
                {/* <!-- Notification --> */}
                <li>
                  <NavLink to="/student/notification" className="group relative flex items-center gap-2.5 rounded-lg py-2 px-3 font-medium duration-300 ease-in-out"
                    style={{
                      backgroundColor: pathname.includes('notification') ? theme.primaryColor : '', color: pathname.includes('notification') ? theme.textColor : theme.textColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = theme.textColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!pathname.includes('notification')) { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = theme.textColor; }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path d="M10.268 21a2 2 0 0 0 3.464 0m.184-18.686A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.74 7.327A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673a9 9 0 0 1-.585-.665" /><circle cx="18" cy="8" r="3" /></g>
                    </svg>
                    Notification
                  </NavLink>
                </li>
              </ul>
            )}


            {/* Teacher Menu */}
            {person.user.role === "teacher" && (
              <ul className="flex flex-col gap-1.5 overflow-y-auto">
                {/* <!-- Dashboard --> */}
                <li>
                  <NavLink to="/dashboard/teacher" className="group relative flex items-center gap-2.5 rounded-lg py-2 px-3 font-mediumduration-300 ease-in-out"
                    style={{
                      backgroundColor: pathname.includes('dashboard') ? theme.primaryColor : '', color: pathname.includes('dashboard') ? theme.textColor : theme.textColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = theme.textColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!pathname.includes('dashboard')) { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = theme.textColor; }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></g></svg>
                    Dashboard
                  </NavLink>
                </li>
                {/* <!-- Bilan --> */}
                <li>
                  <NavLink to="/teacher/filières" className="group relative flex items-center gap-2.5 rounded-lg py-2 px-3 font-medium  duration-300 ease-in-out "
                    style={{
                      backgroundColor: pathname.includes('bilan') ? theme.primaryColor : '', color: pathname.includes('bilan') ? theme.textColor : theme.textColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = theme.textColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!pathname.includes('bilan')) { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = theme.textColor; }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path d="M14 22v-4a2 2 0 1 0-4 0v4" /><path d="m18 10l3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10m12-5v17M4 6l7.106-3.553a2 2 0 0 1 1.788 0L20 6M6 5v17" /><circle cx="12" cy="9" r="2" /></g>
                    </svg>
                    Bilan
                  </NavLink>
                </li>
                {/* <!-- Notification --> */}
                <li>
                  <NavLink to="/teacher/notifications" className="group relative flex items-center gap-2.5 rounded-lg py-2 px-3 font-medium  duration-300 ease-in-out "
                    style={{
                      backgroundColor: pathname.includes('notification') ? theme.primaryColor : '', color: pathname.includes('notification') ? theme.textColor : theme.textColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = theme.textColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!pathname.includes('notification')) { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = theme.textColor; }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path d="M10.268 21a2 2 0 0 0 3.464 0m.184-18.686A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.74 7.327A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673a9 9 0 0 1-.585-.665" /><circle cx="18" cy="8" r="3" /></g>
                    </svg>
                    Notification
                  </NavLink>
                </li>
              </ul>
            )}
          </div>
        </nav>
      </div>
      {/* <!-- SIDEBAR MAIN END --> */}


      {/* <!-- SIDEBAR FOOTER --> */}
      <div className="py-6 px-5">
        <h3 style={{ color: theme.textColor }} className="mb-2 text-xs font-semibold  mt-2">GENERAL</h3>
        <nav>
          <ul className="flex flex-col gap-1.5">
            {person.user.role === "admin" && (
              <li>
                <NavLink to="/admin" className="group relative flex items-center gap-2.5 py-2 px-3 rounded-md font-medium transition-all duration-300  ease-in-out "
                  style={{
                    backgroundColor: pathname.includes('admin') ? theme.primaryColor : '', color: pathname.includes('admin') ? theme.textColor : theme.textColor
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = theme.textColor;
                  }}
                  onMouseLeave={(e) => {
                    if (!pathname.includes('admin')) { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = theme.textColor; }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <path d="M2 21a8 8 0 0 1 10.821-7.487m8.557 3.113a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" /><circle cx="10" cy="8" r="5" /></g>
                  </svg>
                  Admin
                </NavLink>
              </li>
            )}
            <li>
              <NavLink to="/profile" className="group relative flex items-center gap-2.5 py-2 px-3 rounded-md font-medium transition-all duration-300  ease-in-out"
                style={{
                  backgroundColor: pathname.includes('profile') ? theme.primaryColor : '', color: pathname.includes('profile') ? theme.textColor : theme.textColor
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = theme.textColor;
                }}
                onMouseLeave={(e) => {
                  if (!pathname.includes('profile')) { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = theme.textColor; }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><circle cx="12" cy="8" r="5" />
                  <path d="M20 21a8 8 0 0 0-16 0" /></g>
                </svg>
                Profil
              </NavLink>
            </li>
            <div>
              <span onClick={handleLogout} className="flex items-center gap-2.5 py-2 px-3 rounded-md transition-all border border-red-600 duration-300 hover:cursor-pointer text-red-500 hover:text-bodydark1 hover:bg-red-600 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                </svg>
                Déconnexion
              </span>
            </div>
          </ul>
        </nav>
      </div>
      {/* <!-- SIDEBAR FOOTER END --> */}

    </aside>
  );
};

export default Sidebar;
