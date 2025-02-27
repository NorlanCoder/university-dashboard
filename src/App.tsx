import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { rehydrateUser } from './features/auth/authSlice';
import { RootState } from '@/app/store';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';

import DefaultLayout from './layout/DefaultLayout';
import DefaultLayoutAuth from './layout/DefaultLayoutAuth';

import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import ResetPassword from './pages/Authentication/ResetPassword';

import Dashboard from './pages/Dashboards/Dashboard';
import DashboardTeacher from './pages/Dashboards/DashboardTeacher';
import DashboardStudent from './pages/Dashboards/DashboardStudent';
import Admin from './pages/Dashboards/Admin';
import Bilan from './pages/Dashboards/Bilan';
import Etudiant from './pages/Dashboards/Etudiant';
import Professeur from './pages/Dashboards/Professeur';

import UesPage from './pages/Dashboards/Ues';
import Matieres from './pages/Dashboards/Matieres';
import Classes from './pages/Dashboards/Classes/Classes';
import ClassDetails from './pages/Dashboards/Classes/ClassDetails';
import Profile from './pages/Profile';
import ListCoursesS1 from './pages/couses/ListCourseS1';
import ListCoursesS2 from './pages/couses/ListCoursesS2';
import StudentByCourse from './pages/couses/StudentsByCourses/StudentByCourse';
import BilanStudent from './pages/couses/BilanStudent';
import ClassCourses from './pages/student/ClassCourses';
import Notification from './pages/Dashboards/Notifications';
import ClassTeacher from './pages/teacher/ClassTeacher'
import CoursesTeacher from './pages/teacher/CoursesTeacher'
import CoursesStudentTeacher from './pages/teacher/CoursesStudentTeacher';
import NotificationTeacher from './pages/teacher/NotificationTeacher';
import DocumentClass from './pages/student/DocumentClass';
import Notfound from './pages/Dashboards/Notfound';
import BilanStudentInfo from './pages/student/BilanStudentInfo';
import BilanStudentHistory from './pages/student/BilanStudentHistory';
import NotificationStudent from './pages/student/NotificationStudent';


function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const location = useLocation()
  const user = useSelector((state: RootState) => state.auth.user)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (user.role != "admin") {
    // const navigate = useNavigate();
    return <Navigate to="/profile" replace />;
  }
  if (location.pathname.startsWith('/bilan') && !user.school?.moy) {
    return <Navigate to="/profile" replace />;
  }
  return children;
}

function StudentProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user)
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (user.role != "student") {
    const navigate = useNavigate();
    navigate(-1);
  }
  return children;
}

function TeacherProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (user.role != "teacher") {
    const navigate = useNavigate();
    navigate(-1);
  }
  return children;
}

function CommonProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function PublicRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const role = useSelector((state: RootState) => state.auth.user.role);

  if (role === "teacher") {
    return <Navigate to="/dashboard/teacher" replace />;

  } else if (role === "student") {
    return <Navigate to="/dashboard/student" replace />;

  } {
    return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
  }
}

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(rehydrateUser());
    setLoading(false); // Le chargement est terminé après la réhydratation
  }, [dispatch]);

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      {/* Routes accessibles uniquement pour les utilisateurs non authentifiés */}

      <Route
        path="/"
        element={
          <PublicRoute>
            <DefaultLayoutAuth>
              <PageTitle title="Connexion | O' CAMPUS" />
              <SignIn />
            </DefaultLayoutAuth>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <DefaultLayoutAuth>
              <PageTitle title="Inscription | O' CAMPUS" />
              <SignUp />
            </DefaultLayoutAuth>
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <DefaultLayoutAuth>
              <PageTitle title="Reset Password | O' CAMPUS" />
              <ResetPassword />
            </DefaultLayoutAuth>
          </PublicRoute>
        }
      />

      {/* Routes protégées accessibles uniquement pour les utilisateurs authentifiés */}





      <Route
        path="/dashboard"
        element={
          <CommonProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Dashboard | O' CAMPUS" />
              <Dashboard />
            </DefaultLayout>
          </CommonProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Page Administrateur | O' CAMPUS" />
              <Admin />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notification"
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Page Notification| O' CAMPUS" />
              <Notification />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/etudiant"
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Page Etudiant | O' CAMPUS" />
              <Etudiant />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bilan"
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Bilan | O' CAMPUS" />
              <Bilan />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bilan/:promoId/filieres"
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Classes | O' CAMPUS" />
              <Classes />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bilan/filiere/:classId/:cours"
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Classes détails | O' CAMPUS" />
              <ClassDetails />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/classe/:classId/bilan/:bilan"
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Bilan Etudiant | O' CAMPUS" />
              < BilanStudent />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bilan/filiere/:classId/:cours/semestre1"
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Liste des cours semestre 1 | O' CAMPUS" />
              <ListCoursesS1 />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bilan/filiere/:classId/:cours/semestre2"
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Liste des cours semestre 2 | O' CAMPUS" />
              <ListCoursesS2 />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bilan/class/:classId/course/:courseId/students"
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <PageTitle title=" Gestion cours | O' CAMPUS" />
              <StudentByCourse />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/professeur"
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Page Professeur | O' CAMPUS" />
              <Professeur />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/matieres"
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Page des Matières |  O' CAMPUS" />
              <Matieres />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ues"
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Les UEs | O' CAMPUS" />
              <UesPage />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <CommonProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Gestion Profile | O' CAMPUS" />
              <Profile />
            </DefaultLayout>
          </CommonProtectedRoute>
        }
      />


      {/* Student */}
      <Route
        path="/dashboard/student"
        element={
          <TeacherProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Teacher Dashboard | TailAdmin" />
              <DashboardStudent />
            </DefaultLayout>
          </TeacherProtectedRoute>
        }
      />

      <Route
        path="student/bilan"
        element={
          <StudentProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Bilan | TailAdmin" />
              <BilanStudentHistory />
            </DefaultLayout>
          </StudentProtectedRoute>
        }
      />
      <Route
        path="/student/bilan/:classId"
        element={
          <StudentProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Resume Course | O' CAMPUS" />
              <ClassCourses />
            </DefaultLayout>
          </StudentProtectedRoute>
        }
      />
      <Route
        path="/student/bilan/:classId/summary"
        element={
          <StudentProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Récapitumatif | TailAdmin" />
              <BilanStudentInfo />
            </DefaultLayout>
          </StudentProtectedRoute>
        }
      />
      <Route
        path="/student/bilan/:classId/course/:courseId"
        element={
          <StudentProtectedRoute>
            <DefaultLayout>
              <PageTitle title=" Upload Doc| O' CAMPUS" />
              <DocumentClass />
            </DefaultLayout>
          </StudentProtectedRoute>
        }
      />
      <Route
        path="student/notification"
        element={
          <StudentProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Notification | TailAdmin" />
              <NotificationStudent />
            </DefaultLayout>
          </StudentProtectedRoute>
        }
      />


      {/* Teacher */}
      <Route
        path="/dashboard/teacher"
        element={
          <TeacherProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Teacher Dashboard | O' CAMPUS" />
              <DashboardTeacher />
            </DefaultLayout>
          </TeacherProtectedRoute>
        }
      />

      <Route
        path="/teacher/filières"
        element={
          <TeacherProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Teacher Filières | O' CAMPUS" />
              <ClassTeacher />
            </DefaultLayout>
          </TeacherProtectedRoute>
        }
      />

      <Route
        path="/classes/:classeId/filieres"
        element={
          <TeacherProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Teacher Cours | O' CAMPUS" />
              <CoursesTeacher />
            </DefaultLayout>
          </TeacherProtectedRoute>
        }
      />

      <Route
        path="/teacher/:classeId/course/:courseId/students"
        element={
          <TeacherProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Teacher Student Cours | O' CAMPUS" />
              <CoursesStudentTeacher />
            </DefaultLayout>
          </TeacherProtectedRoute>
        }
      />

      <Route
        path="/teacher/notifications"
        element={
          <TeacherProtectedRoute>
            <DefaultLayout>
              <PageTitle title="Teacher Notification | O' CAMPUS" />
              <NotificationTeacher />
            </DefaultLayout>
          </TeacherProtectedRoute>
        }
      />


      {/* 404 NOT FOUND */}
      <Route
        path="*"
        element={
          <DefaultLayout>
            <PageTitle title="Page Non Trouvée | O' CAMPUS" />
            <Notfound />
          </DefaultLayout>
        }
      />

    </Routes>
  );
}

export default App;
