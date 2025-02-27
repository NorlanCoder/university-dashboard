import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip } from 'react-tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { PlusIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import {
  fetchStudentsByCourse,
  AddNoteOrExamStudentAllByCourse,
  StudentCourse,
  Course,
  AddNoteByStudentSelect,
  UpdateNoteByStudentSelect,
  DeleteNoteByStudentSelect,
  UpdateExamByStudentSelect,
} from '@/api/Classroom/StudentsByCourse';
import {MoyControle} from '@/api/Classroom/CalculMoy/MoyControle';
import {MoyGeneral} from '@/api/Classroom/CalculMoy/MoyGeneral';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from "framer-motion";
import CalculatorDropdownEnd from '@/components/calculatorDropdown/CalculatorDropdownEnd';
import AddAllControlModal from './AddAllControlModal';
import AddAllExamenModal from './AddAllExamenModal';
import { useTheme } from "@/components/context/ThemeContext";
import DropdownActions from '@/components/DropdownActionsStudentByCourse';

const StudentByCourse: React.FC = () => {
  const { classId, courseId } = useParams<{ classId: string; courseId: string;}>();
  const [students, setStudents] = useState<StudentCourse[]>([]);
  const [courses, setCourses] = useState<Course | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | 0>(0);
  const [selectedNote, setSelectedNote] = useState<{position: number; value: number;} | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0); 
  const [loading, setLoading] = useState<boolean>(true);  
  const perPage = 20; 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalAddExemOpen, setIsModalAddExemOpen] = useState(false);

  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

  const [isDeleteNoteModalOpen, setIsDeleteNoteModalOpen] = useState(false);
  const [selectedNotePosition, setSelectedNotePosition] = useState< number | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  {
    /* State pour update exam*/
  }
  const [isModalUpdateExamOpen, setIsModalUpdateExamOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<{ value: number } | null>(
    null,
  );
  const navigate = useNavigate();

 const { theme } = useTheme();
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

const validationSchema = Yup.object({
  notes: Yup.array().of(
    Yup.object().shape({
      student: Yup.number().required('ID étudiant requis.'),
      control: Yup.number()
        .min(0, 'Note minimale : 0')
        .max(20, 'Note maximale : 20')
        .required('Note requise.'),
    }),
  ).required(),
})

  const handleCalculMoyControle = async () => {
    if (!classId || !courseId) {
      toast.error('ID de classe manquant.');
      return;
    }
    setLoading(true);
    try {
      await MoyControle(classId, courseId);
      toast.success('Moyenne Contrôle calculée avec succès !');
      await loadStudents ();
    } catch (error) {
      console.error(error);
      toast.error(
        'Une erreur est survenue lors du calcul de la moyenne des Contrôles.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCalculMoyGeneral = async () => {
    if (!classId || !courseId) {
      toast.error('ID de classe manquant.');
      return;
    }

    setLoading(true);
    try {
      await MoyGeneral(classId, courseId);
      toast.success('Moyenne Générale calculée avec succès !');
      await loadStudents ();
    } catch (error) {
      console.error(error);
      toast.error(
        'Une erreur est survenue lors du calcul de la moyenne générale.', 
      );
    } finally {
      setLoading(false);
    }
  };

  // Charger les étudiants
  const loadStudents = async () => {
    if (!classId || !courseId) {
      toast.error('ID de classe et de cours manquants.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetchStudentsByCourse(
        classId, 
        courseId,
        page,
        search,
      );
      if (response && response.students) {
        const validStudents = response.students.filter(
          (student) => !student.is_delete,
        );
        setStudents(validStudents);
        setCourses(response.course);

        setTotalStudents(response.total);
        setTotalPages(Math.ceil(response.total / perPage));
      } else {
        setStudents([]);
        setTotalStudents(0);
        setTotalPages(0);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des étudiants au cours.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();

  }, [classId, courseId, page, search]);

  // Changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  //Ajouter notes à tout les étudiant et ajouter/modifierles notes d'examen.
  const handleAddNotes = async (type: string, notes: { student: number; control: number }[]) => { 
    try {
      const payload = { notes, type };
      await AddNoteOrExamStudentAllByCourse(classId!, courseId!, payload);
      toast.success(
        type === 'control'
          ? 'Contrôle continu ajouté avec succès.'
          : 'Note d’examen ajoutée avec succès.',
      );
      loadStudents();
      setIsModalOpen(false);
      setIsModalAddExemOpen(false);
    } catch (error) {
      toast.error('Erreur lors de l’ajout des notes.');
    }
  };
  
  {
    /* handleOpenUpdateModal est déclaré  */
  }
  const handleOpenUpdateModal = (studentId: number) => {
    setSelectedStudentId(studentId);
    const student = students.find((s) => s.studentId === studentId);
    if (student && student.note && Array.isArray(student.note)) {
      setSelectedNote({ position: 0, value: student.note[0] }); // Par défaut, utilisez la première note
    } else {
      setSelectedNote(null); // Pas de note ou données incorrectes
    }
    setIsModalUpdateOpen(true);
  };

  const resetModalState = () => {
    setSelectedNote(null);
    setSelectedStudentId(0);
  };

  // Fonction pour mettre à jour une note
  const handleUpdateNoteUnique = async (
    studentId: number,
    position: number,
    control: number,
  ) => {
    if (position < 0 || isNaN(control)) {
      toast.error('Position ou note invalide.');
      return;
    }

    const studentName = getStudentNameById(studentId);
    try {
      await UpdateNoteByStudentSelect(
        classId!,
        courseId!,
        String(studentId),
        position,
        control,
      );
      toast.success(`La note de ${studentName} mise à jour.`);
      setIsModalUpdateOpen(false); // Ferme la modale
      loadStudents(); // Recharge les données
      resetModalState(); // Réinitialise l'état
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la note.');
    }
  };

  // Fonction pour mettre à jour une note exam
  const handleUpdateExamUnique = async (studentId: number, exam: number) => {
    if (exam < 0 || isNaN(exam)) {
      toast.error(' Note eaxm invalide.');
      return;
    }

    const studentName = getStudentNameById(studentId);
    try {
      await UpdateExamByStudentSelect(
        classId!,
        courseId!,
        String(studentId),
        exam,
      );
      toast.success(`La note d'exam de ${studentName} mise à jour.`);
      setIsModalUpdateExamOpen(false); // Ferme la modale
      loadStudents(); // Recharge les données
      resetModalState(); // Réinitialise l'état
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la note exam.');
    }
  };

  //Fonction pour recuperer le nom de l'étudiant sélectionné par user
  const getStudentNameById = (id: number): string => {
    const student = students.find((s) => s.studentId === id);
    return student && student.student
      ? student.student.name
      : 'Étudiant inconnu';
  };

  const handleAddNoteUnique = async (studentId: number, control: number) => {
    // const studentName = getStudentNameById(studentId);
    try {
      await AddNoteByStudentSelect(
        classId!,
        courseId!,
        String(studentId),
        control,
      );
      toast.success(`Note ajoutée pour avec succès.`);
      loadStudents();
    } catch (error) {
      toast.error('Erreur lors de l’ajout de la note.');
    }
  };

  {
    /* Debut*/
  }
  const openDeleteNoteModal = (studentId: number) => {
    setSelectedStudentId(studentId);
    setIsDeleteNoteModalOpen(true);
  };

  const handleNoteSelection = (position: number) => {
    setSelectedNotePosition(position);
  };

  const handleDeleteNoteStudent = async () => {
    if (
      !selectedStudentId ||
      !classId ||
      !courseId ||
      selectedNotePosition === null
    ) {
      toast.error('Veuillez sélectionner une note à supprimer.');
      return;
    }

    try {
      await DeleteNoteByStudentSelect(
        classId,
        courseId,
        selectedStudentId.toString(),
        selectedNotePosition,
      );
      toast.success('Note supprimée avec succès.');
      setIsConfirmationModalOpen(false);
      setSelectedNotePosition(null);
      loadStudents();
    } catch (error) {
      console.error('Erreur lors de la suppression de la note :', error);
      toast.error('Erreur lors de la suppression de la note.');
    }
  };

  {
    /* Fin */
  }

  const teacher = courses?.teacher;
  const matter = courses?.matter;
  const ue = courses?.ue;


  return (
    <>
      <div>
        <button
          onClick={() => navigate(-1)}
          className=" rounded-md px-2 py-1  bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="p-6">
      
        <motion.div 
           variants={containerCardsVariants}
           initial="hidden"
           animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Carte du professeur */}
          <motion.div variants={cardVariants} style={{backgroundColor:theme.sidebarColor, color:theme.textColor}}
          className="p-4 bg-slate-800 shadow-lg rounded-lg">
            <h3 className="text-lg  font-semibold mb-2">
              Enseignant
            </h3>
            {teacher ? (
              <>
                <p className="">{teacher.name}</p>
                <p className="text-sm ">
                  {teacher.email} {' / '} {teacher.phone}
                </p>
              </>
            ) : (
              <p className="">Aucun professeur assigné</p>
            )}
          </motion.div>

          {/* Carte de la matière */}
          <motion.div variants={cardVariants} style={{backgroundColor:theme.sidebarColor, color:theme.textColor}} className="p-4  shadow-lg rounded-lg">
            <h3 className="text-lg  font-semibold mb-2">Matière</h3>
            {matter ? (
              <>
                <p className="">{matter.name}</p>
                <p className="text-sm ">
                  Crédits : {matter.credit}
                </p>
              </>
            ) : (
              <p className="">Aucune matière assignée</p>
            )}
          </motion.div>

          {/* Carte de l'UE */}
          <motion.div variants={cardVariants} style={{backgroundColor:theme.sidebarColor, color:theme.textColor}}  className="p-4  shadow-lg rounded-lg">
            <h3 className="text-lg  font-semibold mb-2">UE</h3>
            {ue ? (
              <>
                <p className="">{ue.name}</p>
                <p className="text-sm ">Crédits : {ue.credit}</p>
                {/* <p className="text-sm text-gray-500">Niveau : {ue.level}</p> */}
                {/* <p className="text-sm text-gray-500">Semestre : {ue.semester}</p> */}
              </>
            ) : (
              <p className="">Aucune UE assignée</p>
            )}
          </motion.div>
        </motion.div>
   
      <div className=" pt-8">
        <Toaster />
        <div  className="flex items-center justify-start gap-4 mb-6">
        <CalculatorDropdownEnd
            onCalculMoyControle={handleCalculMoyControle}
            onCalculMoyGeneral={handleCalculMoyGeneral}
          />
      </div>
        <div>
          
          <motion.div 
           initial="hidden"
           animate="visible"
           variants={containerVariants}
          >
         <motion.div
  variants={itemVariants}
  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
>
  {/* Input avec icône */}
  <div className="flex items-center relative w-full max-w-sm">
  <span style={{color:theme.primaryColor}}  className="absolute left-3 ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"
        />
      </svg>
    </span>
 
    <Input
      placeholder="Rechercher par nom ou matricule"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </div>

  {/* Boutons */}
  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
    <Button variant="primary" onClick={() => setIsModalOpen(true)}>
      <PlusIcon className="h-5 w-5 mr-2" />
      Ajouter contrôle
    </Button>

    <Button variant="default" onClick={() => setIsModalAddExemOpen(true)}>
      <PlusIcon className="h-5 w-5 mr-2" />
      Gestion examen
    </Button>
  </div>
</motion.div>

        

          <motion.div  variants={itemVariants} >
            <Table className="w-full border-collapse  rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900">
              <TableHeader  style={{backgroundColor:theme.primaryColor, color:theme.textColor }}  className="">
                <TableRow>
                  <TableCell className="p-3 text-left  font-semibold  ">
                    Étudiant
                  </TableCell>
                  <TableCell className="p-3 text-left  font-semibold ">
                    Contrôle continu
                  </TableCell>
                  <TableCell className="p-3 text-left  font-semibold ">
                    Moyenne Contrôle
                  </TableCell>
                  <TableCell className="p-3 text-left  font-semibold  ">
                    Note Examen
                  </TableCell>
                  <TableCell className="p-3 text-left  font-semibold">
                    Moyenne Générale
                  </TableCell>
                  <TableCell className="p-3 text-left font-semibold  ">
                    Statut
                  </TableCell>
            
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
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
                ) : students.length > 0 ? (
                  students.map((student) => (
                    <TableRow
                      key={student.studentId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm"
                    >
                      <TableCell className="p-3 font-semibold text-left dark:text-gray-50">
                        {student.student.matricule} <br /> {student.student.name}
                      </TableCell>
                      <TableCell className="p-3 text-left">
                        <div className="flex items-center justify-between gap-4">
                          <div className="font-semibold text-md">
                            {student.note && student.note.length > 0
                              ? student.note.map((n) => `${n}/20`).join(' , ')
                              : 'Aucune note'}
                          </div>

                          <DropdownActions
                  studentId={student.studentId}
                  onAdd={(studentId) => {
                    setSelectedStudentId(studentId);
                    setIsModalAddOpen(true);
                  }}
                  onUpdate={handleOpenUpdateModal}
                  onDelete={openDeleteNoteModal}
                />

                        </div>
                      </TableCell>
                      <TableCell className="p-3 text-center font-semibold text-blue-600 dark:text-white">
                        {student.control !== null ? student.control : '-'}
                      </TableCell>
                      <TableCell className="p-3 text-center font-semibold  ">
                        <div className="flex  items-center justify-between gap-4">
                          <div>{student.exam !== null ? student.exam : 'En cours'}</div>
                          <div>
                            {/* Button modifier note*/}
                            <a
                              id="clickable"
                              data-tooltip-id="modifyExam"
                              data-tooltip-content="Modifier note exam "
                              data-tooltip-place="top"
                            >
                              <Button  className="mr-2"  size="sm"  variant="primary"  data-tooltip-content="Hello to you too!"
                                onClick={() => {
                                  setSelectedStudentId(student.studentId); // Définir l'étudiant sélectionné
                                  setSelectedExam({ value: student.exam ?? 0 }); // Charger la note actuelle
                                  setIsModalUpdateExamOpen(true); // Ouvrir le modal
                                }}
                              >
                                <PencilSquareIcon className="h-5 w-5 mx-auto" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-3 text-center font-semibold text-blue-600 dark:text-white">
                        {student.moy !== null ? student.moy.toFixed(2) : '-'}
                      </TableCell>
                      <TableCell className="p-3 text-left ">
                      {student.is_validate === null ? (
                        <span className="bg-yellow-600 py-1 px-2 rounded-lg text-gray-50">En attente</span>
                      ) : !student.is_validate ? (
                        <span className="bg-red-600 py-1 px-2 rounded-lg text-gray-50">Non validé</span>
                      ) : (
                        <span className="bg-green-600 py-1 px-2 rounded-lg text-white">Validé</span>
                      )}
                    </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
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

          <Tooltip id="modifyNote" />
          <Tooltip id="addNote" />
          <Tooltip id="deleteNote" />
          <Tooltip id="modifyExam" />
     {/* Pagination */}
     {students.length > 0  && totalPages > 1 && (
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
                <PaginationNext onClick={() => handlePageChange(page + 1)} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
)}
        </div>
      </div>
      </div>

  {/* Modal Ajout Contrôle continu à tous les étudiants */}
      <AddAllControlModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={courseId!}
        classeId={classId!}
        onSubmit={(notes) => handleAddNotes('control', notes)}
        validationSchema={validationSchema}
      />

    <AddAllExamenModal
        isOpen={isModalAddExemOpen}
        onClose={() => setIsModalAddExemOpen(false)}
        courseId={courseId!}
        classeId={classId!}
        onSubmit={(notes) => handleAddNotes('exam', notes)}
        validationSchema={validationSchema}
      />


      {/* Modal pour ajouter une note unique */}
      <Dialog open={isModalAddOpen} onOpenChange={setIsModalAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter  un contrôle continu à  {' '}
            {getStudentNameById(selectedStudentId)} </DialogTitle>
          </DialogHeader>
          <Formik 
            initialValues={{ control: 0 }}
            validationSchema={Yup.object({
              control: Yup.number()
                .required('Requis')
                .min(0, ' La note ne peut pas être négative')
                .max(20, 'La note ne peut excéder 20.')
            })}
            onSubmit={(values, { resetForm }) => {
              handleAddNoteUnique(selectedStudentId, values.control);
              resetForm();
              setIsModalAddOpen(false);
            }}
          >
            <Form>
              <div className="mb-4 flex justify-center items-center">
                <Field
                  name="control"
                  type="number"
                  placeholder="contrôle continu"
                  className=" w-1/2 h-12 px-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-blue-300 focus:outline-none"
                />
                <ErrorMessage
                  name="control"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <DialogFooter>
                <Button type="submit">Ajouter</Button>
              </DialogFooter>
            </Form>
          </Formik>
        </DialogContent>
      </Dialog>

        {/* Modal pour modifier une note */}
        <Dialog open={isModalUpdateOpen} onOpenChange={setIsModalUpdateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Modifier les contrôles continus de {' '}
                {getStudentNameById(selectedStudentId)}
              </DialogTitle>
            </DialogHeader>
            <Formik
              initialValues={{ notes: selectedNote }}
              onSubmit={(values, { resetForm }) => {
                if (selectedNote) {
                  handleUpdateNoteUnique(
                    selectedStudentId,
                    selectedNote.position,
                    parseFloat(values.notes?.value.toString() || '0'),
                  );
                }
                resetForm();
              }}
              validationSchema={Yup.object({
                notes: Yup.object({
                  value: Yup.number()
                    .min(0, 'La note ne peut être négative.')
                    .max(20, 'La note ne peut excéder 20.')
                    .required('Ce champ est requis.'),
                }),
              })}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="py-4 max-h-48 overflow-y-auto border p-2">
                    {students
                      .find((student) => student.studentId === selectedStudentId)
                      ?.note?.map((note, index) => (
                        <div key={index} className="flex items-center gap-4 py-1">
                          <Field
                            type="checkbox"
                            name="selectedNote"
                            value={String(index)}
                            checked={selectedNote?.position === index}
                            onChange={() => {
                              setSelectedNote({ position: index, value: note });
                              setFieldValue('notes.value', note);
                            }}
                            className="w-5 h-5"
                          />
                          <label
                            htmlFor={`note-${index}`}
                            className="font-medium"
                          >
                            Contrôle continu {index + 1}: {note}
                          </label>
                          {selectedNote?.position === index && (
                            <Input
                              id={`note-${index}`}
                              name="notes.value"
                              type="number"
                              value={values.notes?.value}
                              onChange={(e) =>
                                setFieldValue('notes.value', e.target.value)
                              }
                              className="w-20"
                            />
                          )}
                        </div>
                      ))}
                  </div>
                  <DialogFooter className="mt-4">
                    <Button type="submit">Enregistrer</Button>
                  </DialogFooter>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>

      {/* Pour modifier la note d'exam */}
      {isModalUpdateExamOpen && (
        <Dialog
          open={isModalUpdateExamOpen}
          onOpenChange={setIsModalUpdateExamOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Modifier la note d'exam pour{' '}
                {getStudentNameById(selectedStudentId!)}
              </DialogTitle>
            </DialogHeader>
            {/* Utilisation de Formik */}
            <Formik
              enableReinitialize
              initialValues={{ note: selectedExam?.value ?? 0 }} // Dynamique à l'ouverture
              validationSchema={Yup.object({
                note: Yup.number()
                  .min(0, 'La note ne peut être négative.')
                  .max(20, 'La note ne peut excéder 20.')
                  .required('Ce champ est requis.'),
              })}
              onSubmit={async (values, { resetForm }) => {
                await handleUpdateExamUnique(selectedStudentId!, values.note);
                resetForm(); // Réinitialiser le formulaire après soumission
              }}
            >
              {({ values, handleChange }) => (
                <Form>
                  <div className="space-y-4">
                    {/* Champ pour la nouvelle note */}
                    <label htmlFor="note" className="block text-sm font-medium">
                      Note actuelle
                    </label>
                    <Field
                      id="note"
                      name="note"
                      type="number"
                      value={values.note} // Note actuelle dans le champ
                      onChange={handleChange}
                      className="input w-full border border-gray-300 rounded-md p-2"
                    />
                    <ErrorMessage
                      name="note"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <DialogFooter className="mt-4">
                    <Button type="submit" variant="default">
                      Enregistrer
                    </Button>
                  </DialogFooter>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de sélection */}
      <Dialog
        open={isDeleteNoteModalOpen}
        onOpenChange={setIsDeleteNoteModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer un contrôle continu de {' '}
            {getStudentNameById(selectedStudentId)}</DialogTitle>
          </DialogHeader>
          <p>Sélectionnez une note à supprimer :</p>
          <ul>
            {students
              .find((student) => student.studentId === selectedStudentId)
              ?.note?.map((note, index) => (
                <li key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedNotePosition === index}
                    onChange={() => handleNoteSelection(index)}
                    className="mr-2"
                  />
                  <span className='text-md font-medium'>
                  contrôle continu  {index + 1}: {note}
                  </span>
                </li>
              ))}
          </ul>
          <DialogFooter className="mt-4">
            
            <Button
              variant="destructive"
              className="btn btn-primary"
              onClick={() => {
                if (selectedNotePosition !== null) {
                  setIsConfirmationModalOpen(true);
                  setIsDeleteNoteModalOpen(false);
                } else {
                  toast.error('Veuillez sélectionner une note.');
                }
              }}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation */}
      <Dialog
        open={isConfirmationModalOpen}
        onOpenChange={setIsConfirmationModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
          </DialogHeader>
          <p>Êtes-vous sûr de vouloir supprimer cette note ?</p>
          <DialogFooter>
            <Button onClick={() => setIsConfirmationModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteNoteStudent}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudentByCourse;
