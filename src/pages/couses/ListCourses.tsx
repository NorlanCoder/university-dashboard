import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Input } from '@/components/ui/input';
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { PlusIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { fetchListCourse, addCourseToClass, UpdateCourseToClass, deleteCourse, Classroom, Course } from '@/api/Classroom/ListCourses';
import { fetchMembersByRole, Member } from '@/api/members';
import { fetchUes, UE, Matter } from '@/api/ues';
import toast, { Toaster } from 'react-hot-toast';
import { useCallback } from 'react';
import { useTheme } from "@/components/context/ThemeContext";

interface CourseFormValues {
  Member: Member[];
  UE: UE[];
  Matter: Matter[];

}

const ListCourses: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const [classrooms, setClassrooms] = useState<Classroom>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setcourseToDelete] = useState<Course | null>(null);
  // const [isOpen, setIsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  {
    /* State Teacher */
  }
  const [selectedTeacher, setSelectedTeacher] = useState<Member | null>(null);
  const [teacherSearch, setteacherSearch] = useState('');
  const [currentTeacherPage, setcurrentTeacherPage] = useState(1);
  const [availableTeachers, setavailableTeachers] = useState<Member[]>([]); // professeurs disponibles
  const [hasMoreTeachers, sethasMoreTeachers] = useState(true);
  const [isFetchingTeachers, setIsFetchingTeachers] = useState(false); //Eviter des requêtes multipliées
  {
    /* Fin */
  }

  {
    /* State UE */
  }
  const [UeSearch, setUeSearch] = useState('');
  const [currentUePage, setcurrentUePage] = useState(1);
  const [availableUe, setAvailableUe] = useState<UE[]>([]); // UEs disponibles
  const [hasMoreUe, sethasMoreUe] = useState(true);
  const [isFetchingUe, setIsFetchingUe] = useState(false); //Eviter des requêtes multipliées
  const [selectedUe, setSelectedUe] = useState<UE | null>(null);

  {
    /* Fin */
  }
  const { theme } = useTheme();
  {
    /* Matter de l'UE*/
  }
  const [selectedMatters, setSelectedMatters] = useState<Matter[]>([]);
  {
    /*Fin */
  }
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

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


  // Typage générique pour la fonction debounce
  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timer: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };


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
      toast.error('Erreur lors du chargement des cours.');
      // setClassrooms([]);
    } finally {
      setLoading(false);
    }
  };
  
  const openDeleteModal = (course: Course) => {
    setcourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  //Suppresion etudiant in class
  const handleDeleteCourse = async () => {
    if (!classId || !courseToDelete) return;
    if (courseToDelete) {
      try {
        await deleteCourse(classId, courseToDelete.id);

        setIsDeleteModalOpen(false);
        setcourseToDelete(null);
        loadCourses();
        toast.success('Cours supprimé avec succès.');
      } catch (error: any) {
        toast.error(
          error.message || 'Erreur lors de la suppression de ce cours.',
        );
      }
    }
  };

  useEffect(() => {
    if (classId) {
      loadCourses();
    }
  }, [classId]);

  // Fonction pour chercher les ues
  const SearchUEs = async (reset = false) => {
    if (isFetchingUe || (!hasMoreUe && !reset)) return;
    setIsFetchingUe(true);
    try {
      const page = reset ? 1 : currentUePage;
      const response = await fetchUes(page, UeSearch);
      if (reset) {
        setAvailableUe(response.ues);
        setcurrentUePage(1);
      } else {
        setAvailableUe((prev) => [
          ...new Map([...prev, ...response.ues].map((m) => [m.id, m])).values(),
        ]);
        setcurrentUePage((prev) => prev + 1);
      }
      sethasMoreUe(response.ues.length > 0);
    } catch (error) {
      console.error('Erreur lors du chargement des ues :', error);
    } finally {
      setIsFetchingUe(false);
    }
  };

  // Réinitialiser et recharger les ues
  const handleSearchUe = useCallback(
    debounce(async () => {
      sethasMoreUe(true);
      setcurrentUePage(1);
      await SearchUEs(true);
    }, 300),
    [UeSearch]
  );

  // Scroll infini pour les matières
  const handleScrollUe = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      SearchUEs();
    }
  };

  // Fonction pour chercher les professeurs
  const SearchTeachers = async (reset = false) => {
    if (isFetchingTeachers || (!hasMoreTeachers && !reset)) return;
    setIsFetchingTeachers(true);
    try {
      const page = reset ? 1 : currentTeacherPage;
      const response = await fetchMembersByRole('teacher', page, teacherSearch);
      if (reset) {
        setavailableTeachers(response.persons);
        setcurrentTeacherPage(1);
      } else {
        setavailableTeachers((prev) => [
          ...new Map(
            [...prev, ...response.persons].map((m) => [m.id, m]),
          ).values(),
        ]);
        setcurrentTeacherPage((prev) => prev + 1);
      }
      sethasMoreTeachers(response.persons.length > 0);
    } catch (error) {
      console.error('Erreur lors du chargement des cours :', error);
    } finally {
      setIsFetchingTeachers(false);
    }

  };

  // Fonction handleSearchTeachers avec useCallback
  const handleSearchTeachers = useCallback(
    debounce(async () => {
      sethasMoreTeachers(true);
      setcurrentTeacherPage(1);
      await SearchTeachers(true);
    }, 300),
    [SearchTeachers]
  );

  useEffect(() => {
    if (teacherSearch.trim() !== "") {
      handleSearchTeachers();
    }
  }, [teacherSearch]);

  useEffect(() => {
    if (UeSearch.trim() !== "") {
      handleSearchUe();
    }
  }, [UeSearch]);

  // Scroll infini pour les professeurs
  const handleScrollTeachers = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      SearchTeachers();
    }
  };

  // Gérer l'ouverture/fermeture du dialog pour ajouter ou modifier une Ue
  const toggleAddEditDialog = (course: Course | null = null) => {
    if (!isAddEditDialogOpen) {
      // Réinitialiser les états avant d'ouvrir le modal
      setSelectedTeacher(null);
      setSelectedUe(null);
      setSelectedMatters([]);
      setteacherSearch('');
      setUeSearch('');
      setavailableTeachers([]);
      setAvailableUe([]);
      setCurrentStep(1);
    }
    setSelectedCourse(course);
    setIsAddEditDialogOpen(!isAddEditDialogOpen);
  };

  const resetTeacherSelection = () => {
    setSelectedTeacher(null);
    setteacherSearch('');
    setavailableTeachers([]);
  };

  const resetUeSelection = () => {
    setSelectedUe(null);
    setUeSearch('');
    setAvailableUe([]);
  };

  // Mise à jour de la fonction handleAddCourses
  const handleAddEditCourses = async (
    values: CourseFormValues,
    { resetForm }: { resetForm: () => void },
  ) => {
    setLoading(true);

    if (!classId) {
      toast.error('ID de classe manquant.');
      return;
    }

    if (!selectedTeacher || !selectedUe || selectedMatters.length === 0) {
      toast.error(
        'Veuillez sélectionner un enseignant, une UE et au moins une matière.',
      );
      setLoading(false);
      return;
    }

    try {
      if (selectedCourse) {
        // Modification
        for (const matter of selectedMatters) {

          await UpdateCourseToClass(
            selectedCourse.id,
            classId,
            selectedTeacher.id,
            selectedUe.id,
            matter.id,
          );
        }
        toast.success('Cours mis à jour avec succès.');
      } else {
        // Ajout
        for (const matter of selectedMatters) {
          await addCourseToClass(
            classId,
            selectedTeacher.id,
            selectedUe.id,
            matter.id,
          );
        }
        toast.success('Cours ajouté avec succès.');
      }
      // Réinitialiser les données et fermer le modal
      resetForm();
      setSelectedTeacher(null);
      setSelectedUe(null);
      setSelectedMatters([]);
      setSelectedCourse(null);
      setIsAddEditDialogOpen(false);

      loadCourses();
    } catch (error) {
      toast.error('Erreur lors de la soumission du formulaire');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      setSelectedTeacher(selectedCourse.teacher); // Remplir le champ enseignant
      setSelectedUe(selectedCourse.ue); // Remplir le champ UE
      setSelectedMatters(selectedCourse.matter ? [selectedCourse.matter] : []);// Remplir les matières
    }
  }, [selectedCourse]);


  // Chargement des matières associées à une UE sélectionnée
  useEffect(() => {
    if (selectedUe) {
      setSelectedMatters(selectedUe.Matter || []);
    } else {
      setSelectedMatters([]);
    }
  }, [selectedUe]);

  // Gestion de la sélection d'une UE
  const handleSelectUe = (ue: UE) => {
    setSelectedUe(ue);
    setSelectedMatters(ue.Matter || []); // Mise à jour des matières associées
  };

  // Gestion de la sélection d'une matière asscociée
  const handleSelectMatter = (selectedMatter: Matter) => {
    setSelectedMatters((prevMatters) =>
      prevMatters.map((matter) =>
        matter.id === selectedMatter.id
          ? { ...matter, isSelected: true }
          : { ...matter, isSelected: false },
      ),
    );
  };

  // Gestion de la sélection d'un enseignant
  const handleSelectTeacher = (teacher: Member) => {
    setSelectedTeacher(teacher);
  };

  return (
    <>
      <motion.div className=""
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Toaster />
       
      
            <motion.div variants={itemVariants}  className="flex items-center justify-end mb-6">
              <Button
                variant="primary"
                className="flex items-center gap-2"
                onClick={() => toggleAddEditDialog()}
              >
                <PlusIcon className="w-4 h-4" />
                Ajouter Cours
              </Button>
            </motion.div>
        

          <motion.div variants={itemVariants}>
            <Table className="w-full border-collapse  rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900  ">
              <TableHeader className="">
                <TableRow style={{backgroundColor:theme.primaryColor, color:theme.textColor }}  className="">
                  <TableCell className="p-3 text-left font-semibold">
                    Enseignant
                  </TableCell> 
                  <TableCell className="p-3 text-left font-semibold ">
                    Matières
                  </TableCell>
                  <TableCell className="p-3 text-left font-semibold ">
                    UE
                  </TableCell>
                  <TableCell className="p-3 text-left font-semibold flex justify-center items-center">
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
                ) : classrooms ? (
                  classrooms?.Course.map((course: Course) => (
                    <TableRow
                      key={course.id}
                      className="text-black-2 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm  "
                    >
                      <TableCell className="p-3 font-semibold text-left dark:text-gray-50">
                        {' '}
                        {course.teacher?.matricule || 'Inconnu'} <br />{' '}
                        {course.teacher?.name || 'Inconnu'}
                      </TableCell>
                      <TableCell className="p-3 text-md font-medium text-left dark:text-gray-300">
                        <span className="font-semibold">
                          {' '}
                          {course.matter.name || 'Néant'}{' '}
                        </span>{' '}
                        <br />{' '}
                        <span className="text-sm text-gray-500 dark:text-gray-400 ">
                          {course.matter.slug || 'Néant'}
                        </span>
                      </TableCell>
                      <TableCell className="p-3 text-md font-medium text-left dark:text-gray-300">
                        {' '}
                        {course.ue.name || 'Néant'}{' '}
                      </TableCell>
                      <TableCell className="p-3 text-center flex items-center justify-center">
                        <Button
                          className="mr-2"
                          size="sm"
                          variant="primary"
                          data-tooltip-content="Hello to you too!"
                          onClick={() => {
                            toggleAddEditDialog(course);
                          }}
                        >
                          <PencilSquareIcon className="h-5 w-5 mx-auto" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteModal(course)}
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
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="p-3 text-center text-gray-600 dark:text-white"
                    >
                      Aucune donnée disponible
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </motion.div>
        
      </motion.div>

      {/* Formulaire d'ajout */}

      {/* Modal pour ajout / Modification d'un cours */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="dark:text-gray-50 text-gray-700">
              {selectedCourse ? 'Modifier le cours' : 'Ajouter un cours'}
            </DialogTitle>
          </DialogHeader>
          <Formik<CourseFormValues>
            initialValues={{
              Member: selectedCourse?.teacher ? [selectedCourse.teacher] : [],
              UE: selectedCourse?.ue ? [selectedCourse.ue] : [],
              Matter: selectedCourse?.matter ? [selectedCourse?.matter] : [],
            }}
            validationSchema={Yup.object({
              Member: Yup.array().required(
                'Un enseignant doit être sélectionné.',
              ),
              UE: Yup.array().required('Une UE doit être sélectionnée.'),
              Matter: Yup.array().required('Au moins une matière doit être sélectionnée.'),
            })}
            onSubmit={handleAddEditCourses}
          >
            {({ isSubmitting }) => (
              <Form>
                {/* Recherche et sélection de l'enseignant */}
                {/* Step 1: Sélection de l'enseignant */}
                {currentStep === 1 && (
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">
                      Enseignant
                    </label>

                    <div className="relative">
                    <div className="flex items-center relative w-full ">
                  <span style={{color:theme.primaryColor}}  className="absolute left-3 ">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>
         </span>
                      <Input
                        placeholder="Rechercher un enseignant"
                        value={selectedTeacher?.name || teacherSearch}
                        onChange={(e) => {
                          setteacherSearch(e.target.value);
                        }}
                        className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                      {selectedTeacher && (
                        <button
                          className="absolute right-16 top-3"
                          onClick={resetTeacherSelection}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeDasharray="24" strokeDashoffset="24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M5 5l14 14"><animate fill="freeze" attributeName="strokeDashoffset" dur="0.4s" values="24;0" /></path><path d="M19 5l-14 14"><animate fill="freeze" attributeName="strokeDashoffset" begin="0.4s" dur="0.4s" values="24;0" /></path></g></svg>
                        </button>
                      )}
                    </div>

                    <div
                      className="mt-2 max-h-48 overflow-y-auto border p-2"
                      onScroll={handleScrollTeachers}
                    >
                      {availableTeachers.map((teacher) => (
                        <div
                          key={teacher.id}
                          className={`cursor-pointer p-2 ${selectedTeacher?.id === teacher.id
                              ? 'bg-blue-500 text-white'
                              : ''
                            }`}
                          onClick={() => handleSelectTeacher(teacher)}
                        >
                          {teacher.name} ({teacher.matricule})
                        </div>
                      ))}

                      {!hasMoreTeachers && teacherSearch && availableTeachers.length === 0 && (
                        <div className="text-center text-gray-500">Aucun enseignant trouvé pour "{teacherSearch}".</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Recherche et sélection de l'UE */}
                {/* Step 2: Sélection de l'UE */}
                {currentStep === 2 && (
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">UE</label>
                    <div className="relative">
                    <div className="flex items-center relative w-full ">
                  <span style={{color:theme.primaryColor}}  className="absolute left-3 ">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>
         </span>
                      <Input
                        placeholder="Rechercher une UE"
                        value={selectedUe?.name || UeSearch}
                        onChange={(e) => {
                          setUeSearch(e.target.value);
                        }}
                        className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                      {selectedUe && (
                        <button
                          className="absolute right-16 top-3"
                          onClick={resetUeSelection}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeDasharray="24" strokeDashoffset="24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M5 5l14 14"><animate fill="freeze" attributeName="strokeDashoffset" dur="0.4s" values="24;0" /></path><path d="M19 5l-14 14"><animate fill="freeze" attributeName="strokeDashoffset" begin="0.4s" dur="0.4s" values="24;0" /></path></g></svg>
                        </button>
                      )}
                    </div>
                    <div
                      className="mt-2 max-h-48 overflow-y-auto border p-2"
                      onScroll={handleScrollUe}
                    >
                      {availableUe.map((ue) => (
                        <div
                          key={ue.id}
                          className={`cursor-pointer p-2 ${selectedUe?.id === ue.id
                              ? 'bg-blue-500 text-white'
                              : ''
                            }`}
                          onClick={() => handleSelectUe(ue)}
                        >
                          {ue.name}
                        </div>
                      ))}
                      {!hasMoreTeachers && UeSearch && availableTeachers.length === 0 && (
                        <div className="text-center text-gray-500">Aucune UE trouvé pour "{UeSearch}".</div>
                      )}
                    </div>
                  </div>
                )}
                {/* Liste des matières associées */}
                {/* Step 3: Sélection des matières */}
                {currentStep === 3 && (
                  <div className="mt-2 max-h-48 overflow-y-auto border p-2 ">
                    {selectedMatters.map((matter) => (
                      <div
                        key={matter.id}
                        className={`cursor-pointer p-2 ${matter.isSelected ? 'bg-blue-500 text-white' : ''
                          } hover:bg-blue-400 hover:text-white`}
                        onClick={() => handleSelectMatter(matter)}
                      >
                        {matter.name}
                      </div>
                    ))}
                  </div>
                )}
                <DialogFooter>
                  <div className="flex flex-col mt-4">
                    {/* Boutons de navigation (Précédent et Suivant) */}
                    <div className="flex justify-center gap-4 mb-4">
                      <Button
                        type="button"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-arrow-left"
                        >
                          <path d="m12 19-7-7 7-7" />
                          <path d="M19 12H5" />
                        </svg>
                      </Button>
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={currentStep === 3}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-arrow-right"
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </Button>
                    </div>

                    {/* Boutons "Soumettre" et "Annuler", visibles uniquement à l'étape 3 */}
                    {currentStep === 3 && (
                      <div className="flex justify-start gap-4">
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Chargement...' : 'Soumettre'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddEditDialogOpen(false)}
                        >
                          Annuler
                        </Button>
                      </div>
                    )}
                  </div>
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
            <DialogTitle className="dark:text-gray-50 text-gray-700">
              Confirmation de suppression
            </DialogTitle>
          </DialogHeader>
          <p>Êtes-vous sûr de vouloir supprimer cet Enseignant ?</p>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteCourse}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ListCourses;
