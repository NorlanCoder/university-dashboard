import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import DynamicBreadcrumb from '@/components/DynamicBreadcrumb';
import CalculatorDropdown from "@/components/calculatorDropdown/CalculatorDropdown";
import { useTheme } from "@/components/context/ThemeContext";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EyeIcon, PlusIcon } from '@heroicons/react/24/solid';
import {
  fetchListEtudiant,
  addStudentsToClass,
  deleteStudent,
  Bilan,
} from '@/api/Classroom/ListStuduents';
import { fetchMembersByRole, Member } from '@/api/members';
import { fetchListCourse, Classroom } from '@/api/Classroom/ListCourses';
import { fetchPromoDetails } from '@/api/promos';
import { MoyBySemestre } from '@/api/Classroom/CalculMoy/MoyBySemester';
import { MoyGlobal } from '@/api/Classroom/CalculMoy/MoyGlobalTotal';
import toast, { Toaster } from 'react-hot-toast';
import ListCourses from '@/pages/couses/ListCourses';
import { useCallback } from 'react';
import { motion } from "framer-motion";

export interface Promo {
  id: number;
  name: string;
  slug: string;
  schoolId: number;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
}

// Types des étudiants
export interface Student {
  id: number;
  matricule: string;
  name: string;
}

interface StudentFormValues {
  Member: Member[];
}

const ClassDetails: React.FC = () => {
  const [studentSearch, setStudentSearch] = useState('');
  const [currentStudentPage, setCurrentStudentPage] = useState(1);
  const [availableStudents, setAvailableStudents] = useState<Member[]>([]); // Etudiants disponibles
  const [hasMoreStudents, setHasMoreStudents] = useState(true);
  const [isFetchingStudents, setIsFetchingStudents] = useState(false); //Eviter des requêtes multipliées
  {
    /*Pour avoir Infos sur la classe */
  }
  const [classrooms, setClassrooms] = useState<Classroom>();

  const [activeTab, setActiveTab] = useState<
    'courses' | 'students' | 'semestre1' | 'semestre2'
  >('courses'); // Onglet actif
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  {
    /* Utils*/
  }
  const [students, setStudents] = useState<Bilan[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(false);
  const { classId } = useParams<{ classId: string }>();

  const [promoName, setPromoName] = useState<string | null>(null);

 const handleViewBilanStudent = (bilan: Bilan) => {

    navigate(`/classe/${classId}/bilan/${bilan.id}`);
  };

    const { theme } = useTheme();
  const perPage = 20;

  { /* Fin Utils */}

// Animation table matière et input et buttons
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 10,  staggerChildren: 0.8 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring", 
      stiffness: 50,  
      damping: 10,    
    },
  },
};

const containerCardsVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, 
    },
  },
};


  const navigate = useNavigate();

  // Typage générique pour la fonction debounce
  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number,
  ): ((...args: Parameters<T>) => void) => {
    let timer: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Récupération du nom de la promotion
  useEffect(() => {
    const loadPromoName = async () => {
      if (classrooms?.promoId) {
        try {
          const promoDetails = await fetchPromoDetails(classrooms.promoId);
          setPromoName(promoDetails.name);
        } catch (error) {
          console.error(
            'Erreur lors du chargement du nom de la promotion:',
            error,
          );
        }
      }
    };

    loadPromoName();

  
  }, [classrooms]);

  const loadCourses = async () => {
    if (!classId) {
      toast.error('ID de classe manquant.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetchListCourse(classId);
      if (response) {
        setClassrooms(response);
      } else {
        // setClassrooms(null);

        console.warn('Données non valides :', response);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des professeur.');
      // setClassrooms([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (classId) {
      loadCourses();
    }
  }, [classId]);

  const handleCalculMoyS1 = async () => {
    if (!classId) {
      toast.error('ID de classe manquant.');
      return;
    }

    setLoading(true);
    try {
      await MoyBySemestre(classId, 1);
      toast.success('Moyenne semestre 1 calculée avec succès !');
      await  loadStudents();
    } catch (error) {
      console.error(error);
      toast.error(
        'Une erreur est survenue lors du calcul de la moyenne semestre 1.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCalculMoyS2 = async () => {
    if (!classId) {
      toast.error('ID de classe manquant.');
      return;
    }

    setLoading(true);
    try {
      await MoyBySemestre(classId, 2);
      toast.success('Moyenne semestre 2 calculée avec succès !');
      await  loadStudents();
    } catch (error) {
      console.error(error);
      toast.error(
        'Une erreur est survenue lors du calcul de la moyenne semestre 1.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCalculMoyTotal = async () => {
    if (!classId) {
      toast.error('ID de classe manquant.');
      return;
    }
    setLoading(true);
    try {
      await MoyGlobal(classId);
      toast.success('Moyenne totale calculée avec succès !');
      await  loadStudents();
    } catch (error) {
      console.error(error);
      toast.error(
        'Une erreur est survenue lors du calcul de la moyenne totale.',
      );
    } finally {
      setLoading(false);
    }
  };

  // Récupère la liste des étudiants
  const loadStudents = async () => {
    if (!classId) {
      toast.error('ID de classe manquant.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetchListEtudiant(classId, page, search);
      if (response && response.bilans) {
        setStudents(response.bilans);
        setTotalStudents(response.total);
        setTotalPages(Math.ceil(response.total / perPage));
      } else {
        setStudents([]);
        setTotalStudents(0);
        setTotalPages(0);
        console.warn('Données non valides :', response);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des étudiants.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (classId) {
      loadStudents();
    }
  }, [page, search, classId]);

  // Changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const openDeleteModal = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  //Suppresion etudiant in class
  const handleDeleteStudent = async () => {
    if (!classId || !studentToDelete) return;
    if (studentToDelete) {
      try {
    
        await deleteStudent(classId, studentToDelete.id);

        setIsDeleteModalOpen(false);
        setStudentToDelete(null);
        loadStudents();
        toast.success('Étudiant supprimé avec succès.');
      } catch (error: any) {
        // Affichage d'un message d'erreur spécifique
        if (error.message.includes('impossible')) {
          toast.error(
            'Impossible de supprimer cet étudiant car il a des notes associées.',
          );
        } else {
          toast.error(
            error.message || "Erreur lors de la suppression de l'étudiant.",
          );
        }
      }
    }
  };

  // Fonction pour chercher les étudiants
  const SearchStudents = async (reset = false) => {
    if (isFetchingStudents || (!hasMoreStudents && !reset)) return;
    setIsFetchingStudents(true);
    try {
      const page = reset ? 1 : currentStudentPage;
      const response = await fetchMembersByRole('student', page, studentSearch);
      if (reset) {
        setAvailableStudents(response.persons);
        setCurrentStudentPage(1);
      } else {
        setAvailableStudents((prev) => [
          ...new Map(
            [...prev, ...response.persons].map((m) => [m.id, m]),
          ).values(),
        ]);
        setCurrentStudentPage((prev) => prev + 1);
      }
      setHasMoreStudents(response.persons.length > 0);
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants :', error);
    } finally {
      setIsFetchingStudents(false);
    }
  };

  // Réinitialiser et recharger les étudiants
  const handleSearchStudents = useCallback(
    debounce(async () => {
      setHasMoreStudents(true);
      setCurrentStudentPage(1);
      await SearchStudents(true);
    }, 300),
    [SearchStudents],
  );

  useEffect(() => {
    if (studentSearch.trim() !== '') {
      handleSearchStudents();
    }
  }, [studentSearch]);

  // Scroll infini pour les matières
  const handleScrollStudents = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      SearchStudents();
    }
  };

  // Gérer l'ouverture/fermeture du dialog pour ajouter student
  const toggleAddDialog = (student: Student | null = null) => {
    if (!isAddDialogOpen) {
      // Réinitialiser les champs lorsque le modal s'ouvre
      setStudentSearch('');
      setSelectedStudent(null);
    }
    setSelectedStudent(student);
    setIsAddDialogOpen(!isAddDialogOpen);
  };

  // Add Student in class
  const handleAddStudents = async (
    values: StudentFormValues,
    { resetForm }: { resetForm: () => void },
  ) => {
    setLoading(true);

    if (!classId) {
      toast.error('ID de classe manquant.');
      return;
    }

    try {
      const studentIds = values.Member.map((m) => m.id);
      await addStudentsToClass(classId, studentIds);
      toast.success('Étudiants ajoutés avec succès !');
      resetForm();
      setSelectedStudent(null);
      setIsAddDialogOpen(false);
      loadStudents();
    } catch (error) {
      toast.error("Erreur lors de l'ajout des étudiants.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClickS1 = (classId: any) => {
    navigate(`/bilan/filiere/${classId}/cours/semestre1`);
  };
  const handleCardClickS2 = (classId: any) => {
    navigate(`/bilan/filiere/${classId}/cours/semestre2`);
  };

  return (
    <>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <DynamicBreadcrumb
          items={[
            { label: 'Promotion', href: '/bilan' },
            { label: promoName ? promoName : 'Chargement...' },
            {
              label: 'Filieres',
              href: `/bilan/${classrooms?.promoId}/filieres`,
            },
            { label: classrooms?.name ? classrooms.name : 'Chargement...' },
            { label: classrooms?.level ? classrooms.level : 'Chargement...' },
          ]}
        />
      )}

      <div className=" p-4"> 
        <Toaster />

        {/* Boutons Semestre */}
        <motion.div 
         variants={containerCardsVariants}
         initial="hidden"
         animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-8">
         
          <motion.div   variants={cardVariants}>
            <Card className="hover:shadow-lg transition-shadow relative  "
              style={{  backgroundColor: "", color:""
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = theme.textColor;
              }}
              onMouseLeave={(e) => {
           { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = ""; }
              }} 
            >
              <CardHeader
                className="cursor-pointer"
                onClick={() => handleCardClickS1(classrooms?.id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 px-2">
                  {/* Titre */}
                  <CardTitle className="text-lg font-semibold">
                    <div className="flex  items-center gap-4 text-md lg:text-lg xl:text-xl uppercase">
                      Voir Cours Semestre 1
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16.15 13H5q-.425 0-.712-.288T4 12t.288-.712T5 11h11.15L13.3 8.15q-.3-.3-.288-.7t.288-.7q.3-.3.713-.312t.712.287L19.3 11.3q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.575 4.575q-.3.3-.712.288t-.713-.313q-.275-.3-.288-.7t.288-.7z"/></svg>
                    </div>
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Card pour le Semestre 2 */}
          <motion.div   variants={cardVariants}>
            <Card 
              style={{  backgroundColor: "", color:""
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = theme.textColor;
              }}
              onMouseLeave={(e) => {
           { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = ""; }
              }} 
            className="hover:shadow-lg transition-shadow relative  ">
              <CardHeader
                className="cursor-pointer"
                onClick={() => handleCardClickS2(classrooms?.id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 px-2">
                  <CardTitle className="text-lg font-semibold">
                  <div className="flex  items-center gap-4 text-md lg:text-lg xl:text-xl uppercase">
                      Voir Cours Semestre 2
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16.15 13H5q-.425 0-.712-.288T4 12t.288-.712T5 11h11.15L13.3 8.15q-.3-.3-.288-.7t.288-.7q.3-.3.713-.312t.712.287L19.3 11.3q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.575 4.575q-.3.3-.712.288t-.713-.313q-.275-.3-.288-.7t.288-.7z"/></svg>
                    </div>
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

        </motion.div>

        {/* Boutons principaux */}
        <div className=" mt-8 flex gap-4 mb-6 justify-start">
 
          <CalculatorDropdown
            onCalculMoyS1={handleCalculMoyS1}
            onCalculMoyS2={handleCalculMoyS2}
            onCalculMoyTotal={handleCalculMoyTotal}
          />
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mb-6 border-b ">
          <Button
            variant={activeTab === 'courses' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('courses')}
            className="font-semibold text-lg"
          >
            Liste des cours
          </Button>
          <Button
            variant={activeTab === 'students' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('students')}
            className="font-semibold text-lg"
          >
            Liste Étudiants
          </Button>
        </div>

        {/* Tableaux dynamiques */}
        {activeTab === 'courses' && (
          <>
            <ListCourses />
          </>
        )}

        {/* Tableaux dynamiques */}
        {activeTab === 'students' && (
          <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          >
            <motion.div  variants={itemVariants}  className="flex items-center justify-between mb-6">
            <div className="flex items-center relative w-full max-w-sm">
            <span style={{color:theme.primaryColor}}  className="absolute left-3 ">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>
         </span>
              <Input
                placeholder="Rechercher par nom ou matricule"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              </div>
              <Button
                variant="primary"
                className="flex items-center gap-2"
                onClick={() => toggleAddDialog()}
              >
                <PlusIcon className="w-4 h-4" />
                Ajouter Étudiant à la Filière
              </Button>
            </motion.div>

            <motion.div  variants={itemVariants}>
              <Table className="w-full border-collapse  rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900">
                <TableHeader style={{backgroundColor:theme.primaryColor, color:theme.textColor }} className="">
                  <TableRow className="">
                    <TableCell className="p-3 text-left font-semibold  ">
                      Étudiants
                    </TableCell>
                    <TableCell className="p-3 text-left  font-semibold ">
                      MoySemestre1
                    </TableCell>
                    <TableCell className="p-3 text-left  font-semibold  ">
                      MoySemestre2
                    </TableCell>
                    <TableCell className="p-3 text-left  font-semibold  ">
                      MoyTotal
                    </TableCell>
                    <TableCell className="p-3 text-left  font-semibold ">
                      Statut
                    </TableCell>
                    <TableCell className="p-3 text-left  font-semibold ">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="p-3 text-center text-gray-500"
                      >
                        <div className="flex justify-center items-center">
                          <div className="spinner">
                            <span className="dark:text-white">Chargement...</span>
                            <div className="half-spinner"></div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : students.length === 0 ? (
                    search ? (
                      <TableRow>
                      <TableCell
                        colSpan={5}
                        className="p-3 text-center text-gray-600 dark:text-white"
                      >
                        Aucun étudiant trouvé pour "<strong>{search}</strong>".
                      </TableCell>
                    </TableRow>
                       ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="p-3 text-center text-gray-600 dark:text-white"
                      >
                        Aucune donnée disponible
                      </TableCell>
                    </TableRow>
                       )
                  ) : (
                    students.map((bilan) => (
                      <TableRow
                        key={bilan.student?.id}
                        className=" text-gray-800 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm "
                      >
                        <TableCell className="p-3 font-semibold text-left dark:text-gray-50 ">
                          {' '}
                          {bilan.student?.matricule || 'Inconnu'} <br />{' '}
                          {bilan.student?.name || 'Inconnu'}
                        </TableCell>
                        <TableCell className="p-3 text-[16px] font-medium text-left dark:text-gray-200">
                      <span className="text-[16px] text-gray-700 dark:text-gray-50">moy :</span>{' '}
                      <span className="text-blue-600 font-bold">
                        {typeof bilan.sem1?.moy === 'number' ? bilan.sem1.moy : 'N/A'}
                      </span>
                      <br />
                      <span className="text-gray-700 dark:text-gray-50">credit :</span>{' '}
                      <span className="text-slate-800 dark:text-gray-50 font-bold">
                        {typeof bilan.sem1?.credits === 'number' ? bilan.sem1.credits : 'N/A'}
                      </span>{' '}
                      / {' '}
                      <span className="text-slate-800 dark:text-gray-50 font-bold">
                        {typeof bilan.sem1?.totals === 'number' ? bilan.sem1.totals : 'N/A'}
                      </span>
                    </TableCell>
                        <TableCell className="p-3 text-[16px] font-medium text-left dark:text-gray-200">
                        <span className="text-[16px] text-gray-700 dark:text-gray-50"> moy :</span>{' '}
                        <span className="text-blue-600 font-bold">
                          {typeof bilan.sem2?.moy === 'number'
                            ? bilan.sem2.moy
                            : 'N/A'}{' '}
                        </span>
                          <br />
                          <span className="text-gray-700 dark:text-gray-50">credit :</span>{' '}
                          <span className="text-slate-800 dark:text-gray-50 font-bold">
                          {typeof bilan.sem2?.credits === 'number'  ? bilan.sem2.credits : 'N/A'}
                            </span>
                            {' '}
                          / {' '}
                          <span className="text-slate-800 dark:text-gray-50 font-bold">
                          {typeof bilan.sem2?.totals === 'number'
                            ? bilan.sem2.totals
                            : 'N/A'}{' '}
                            </span>
                        </TableCell>
                        <TableCell className="p-3 text-lg font-medium text-left dark:text-gray-100">
                        <span className="text-blue-600 font-bold">
                          {typeof bilan?.total?.moy === 'number'
                            ? bilan?.total.moy.toFixed(2)
                            : 'N/A'}
                            </span>
                        </TableCell>
              
                        <TableCell className="p-3 text-left">
                        {(() => {
                          if (bilan.total === null) {
                            return (
                              <span className="bg-yellow-600 py-1 px-2 rounded-lg text-gray-50">
                                En cours
                              </span>
                            ) ;
                          } else if (bilan.total.credits === bilan.total.totals) {
                            return (
                              <span className="bg-green-600 py-1 px-2 rounded-lg text-white">
                                Validé
                              </span>
                            );
                          } else if (bilan.total.credits / bilan.total.totals >= 0.8) {
                            return (
                              <span className="bg-red-500 py-1 px-2 rounded-lg text-white">
                                Enjambement
                              </span>
                            );
                          } else {
                            return (
                              <span className="bg-red-600 py-1 px-2 rounded-lg text-gray-50">
                                Redouble
                              </span>
                            );
                          }
                        })()}
                      </TableCell>
                        <TableCell className="p-3 text-center flex items-center">
                          <Button size="sm" className="mr-2" variant="default"
                          onClick={()=>handleViewBilanStudent(bilan)}>
                            <EyeIcon className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteModal(bilan.student)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-6"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </motion.div>

            {/*Pagination liste Etu */}
            {students.length > 0 && (
              <Pagination>
                <PaginationContent className="mt-4">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(page - 1)}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => handlePageChange(index + 1)}
                        isActive={page === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(page + 1)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </motion.div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="dark:text-gray-50 text-gray-700">
              {selectedStudent ? '' : 'Ajouter des étudiants à la Filière'}
            </DialogTitle>
          </DialogHeader>
          <Formik<StudentFormValues>
            initialValues={{
              Member: [],
            }}
            enableReinitialize
            validationSchema={Yup.object({
              Member: Yup.array().required('Au moins une matière est requise'),
            })}
            onSubmit={handleAddStudents}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form>
                {/* Select multiple */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    Etudiants
                  </label>
                  <div className="relative">
                  <div className="flex items-center relative w-full ">
                  <span style={{color:theme.primaryColor}}  className="absolute left-3 ">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>
         </span>
                    <Input
                      placeholder="Rechercher étudiant"
                      value={studentSearch}
                      onChange={(e) => {
                        setStudentSearch(e.target.value);
                      }}
                      className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    </div>

                    <div
                      className="mt-2 max-h-48 overflow-y-auto border p-2"
                      onScroll={handleScrollStudents}
                    >
                      {availableStudents.map((student) => {
                        const isSelected = values.Member.some(
                          (m) => m.id === student.id,
                        );
                        return (
                          <div
                            key={student.id}
                            className={`flex justify-between items-center p-2 border-b ${
                              isSelected ? ' text-red-600' : ''
                            }`}
                          >
                            <span>{student.name} {' '} ({student.matricule})</span> 
                          

                            <button
                              type="button"
                              className={`p-1 rounded ${
                                isSelected
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'bg-blue-500 text-white'
                              }`}
                              onClick={() => {
                                if (!isSelected) {
                                  const updatedMembers = [
                                    ...values.Member,
                                    student,
                                  ];
                                  setFieldValue('Member', updatedMembers);
                                }
                              }}
                              disabled={isSelected}
                            >
                              {isSelected ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 16 16"
                                  fill="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 16 16"
                                  fill="currentColor"
                                  className="size-4"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        );
                      })}

                      {!hasMoreStudents &&
                        studentSearch &&
                        availableStudents.length === 0 && (
                          <div className="text-center text-gray-500">
                            Aucun étudiant trouvé pour "{studentSearch}".
                          </div>
                        )}
                    </div>
                  </div>
                </div>
                {/* Etudiants sélectionnés */}
                <div>
                  <h4 className="font-semibold mt-4 dark:text-gray-100 text-gray-600">
                    Etudiants Sélectionnés :
                  </h4>
                  <div
                    className="flex flex-wrap gap-2 overflow-x-auto max-w-full"
                    style={{ maxHeight: '3rem' }}
                  >
                    {values.Member.map((student) => (
                      <Button
                        key={student.id}
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          const updatedStudents = values.Member.filter(
                            (m) => m.id !== student.id,
                          );
                          setFieldValue('Member', updatedStudents);
                        }}
                      >
                        {student.name} &times;
                      </Button>
                    ))}
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || values.Member.length === 0}
                  >
                    {isSubmitting ? 'Chargement...' : 'Soumettre'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setFieldValue('Member', []);
                    }}
                  >
                    Annuler
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
          </DialogHeader>
          <p>Êtes-vous sûr de vouloir supprimer l'étudiant ?</p>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteStudent}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClassDetails;
