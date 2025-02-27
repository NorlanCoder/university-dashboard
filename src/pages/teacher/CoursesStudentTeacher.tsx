import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip } from 'react-tooltip';
import { fetchStudentsByCourse, StudentCourse, Course, AddNoteOrExamStudentAllByCourse, AddNoteByStudentSelect, UpdateNoteByStudentSelect, UpdateExamByStudentSelect, DeleteNoteByStudentSelect, AddDocumentStudent, Support, fetchSumControlNote, fetchMoyenneGeneral } from '@/api/teacher/students';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import toast, { Toaster } from 'react-hot-toast';
import { PlusIcon } from 'lucide-react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AddAllControlModal from '@/components/Teacher/AddAllControlModal';
import AddNoteModal from '@/components/Teacher/AddNoteModal';
import AddExamModal from '@/components/Teacher/AddExamModal';
import UpdateNoteModal from '@/components/Teacher/UpdateNoteModal';
import UpdateExamModal from '@/components/Teacher/UpdateExamModal';
import DeleteNoteModal from '@/components/Teacher/DeleteNoteModal';
import DocumentStudentsModal from '@/components/Teacher/DocumentStudentsModal';
import DocumentListModal from '@/components/Teacher/DocumentListModal';

const CoursesStudentTeacher: React.FC = () => {

  const location = useLocation();
  const [filiereName, setFiliereName] = useState("");
  const nameclassData = location.state?.nameclassData;
  const { classeId, courseId } = useParams<{ classeId: string; courseId: string; }>();
  const [totalPages, setTotalPages] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [students, setStudents] = useState<StudentCourse[]>([]);
  const [allNotes, setAllNotes] = useState<{ student: number; control: number }[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | 0>(0);
  const [selectedNote, setSelectedNote] = useState<{
    position: number;
    value: number;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalAddExemOpen, setIsModalAddExemOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [courses, setCourses] = useState<Course | null>(null);
  const [pageStudent, setPageStudent] = useState(1);
  const [isModalUpdateExamOpen, setIsModalUpdateExamOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<{ value: number } | null>(null);
  const [selectedNotePosition, setSelectedNotePosition] = useState<
    number | null
  >(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isUpdateExamModalOpen, setIsUpdateExamModalOpen] = useState(false);
  const [isDeleteNoteModalOpen, setIsDeleteNoteModalOpen] = useState(false);
  const [isDocumentListModalOpen, setIsDocumentListModalOpen] = useState(false);
  const [documents, setDocuments] = useState<Support[]>([]);
  const [documentPage, setDocumentPage] = useState(1);
  const [documentTotalPages, setDocumentTotalPages] = useState(0);

  const [isVisible, setIsVisible] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [doc, setDoc] = useState<File>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 20;



  // Charger les étudiants
  const loadStudents = async () => {

    if (!classeId || !courseId) {
      toast.error('ID de classe et de cours manquants.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetchStudentsByCourse(classeId, courseId, page, search);
      setFiliereName(response.course.matter.name)
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
  }, [classeId, courseId, page, search]);

  // Changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };


  // Ajouter une note à tous les étudiants
  const handleAddNotes = async (type: string, notes: { student: number; control: number }[]) => {
    try {
      const payload = { notes, type };
      await AddNoteOrExamStudentAllByCourse(classeId!, courseId!, payload);
      toast.success(`${type === 'control' ? 'Contrôle continu' : 'Note Exam'} ajoutée avec succès.`);
      loadStudents();
      setIsModalOpen(false);
      setIsModalAddExemOpen(false);
    } catch (error) {
      toast.error('Erreur lors de l\'ajout des notes.');
    }
  };


  // Fonction pour mettre à jour de toutes les notes (contrôle continu)
  const updateNotes = (pageNotes: { student: number; control: number }[]) => {
    setAllNotes((prevNotes) => {
      const updatedNotes = [...prevNotes];
      pageNotes.forEach((note) => {
        const index = updatedNotes.findIndex((n) => n.student === note.student);
        if (index !== -1) {
          updatedNotes[index] = note;
        } else {
          updatedNotes.push(note);
        }
      });
      return updatedNotes;
    });
  };


  // Fonction pour mettre à jour une note
  const handleUpdateNoteUnique = async (studentId: number, position: number, control: number,) => {
    if (position < 0 || isNaN(control)) {
      toast.error('Position ou note invalide.');
      return;
    }

    const studentName = getStudentNameById(studentId);
    try {
      await UpdateNoteByStudentSelect(classeId!, courseId!, String(studentId), position, control,);
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
      toast.error(' Note examen invalide.');
      return;
    }


    const studentName = getStudentNameById(studentId);
    try {
      await UpdateExamByStudentSelect(classeId!, courseId!, String(studentId), Number(exam));
      toast.success(`La note d'exam de ${studentName} mise à jour.`);
      setIsModalUpdateExamOpen(false);
      loadStudents();
      resetModalState();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la note exam.');
    }
  };

  // Fonction pour supprimer une note
  const handleDeleteNoteStudent = async () => {
    if (!selectedStudentId || !classeId || !courseId || selectedNotePosition === null) {
      toast.error('Veuillez sélectionner une note à supprimer.');
      return;
    }

    try {
      await DeleteNoteByStudentSelect(classeId!, courseId!, selectedStudentId.toString(), selectedNotePosition,);
      toast.success('Note supprimée avec succès.');
      setIsConfirmationModalOpen(false);
      setSelectedNotePosition(null);
      loadStudents();
    } catch (error) {
      console.error('Erreur lors de la suppression de la note :', error);
      toast.error('Erreur lors de la suppression de la note.');
    }
  };


  const handleClose = () => {
    if (!loading) {
      setIsDocumentModalOpen(false);
    }
  };


  // Fonction pour gérer l'upload de document 
  const handleDocumentSubmit = async (title: string, content: string, file: File) => {

    setLoading(true);

    try {

      const formData = {
        title: title,
        content: content,
        file: file,
      }

      const response = await AddDocumentStudent(classeId!, courseId!, formData);


      if (response.status) {
        toast.success(`Le document a été envoyé avec succès.`);
        resetModalState();
        setIsDocumentModalOpen(false);
        loadStudents();
      } else {

      }
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement du document.');
      resetModalState();
      setIsDocumentModalOpen(false);
      loadStudents();
    }
  };


  // Fonction pour gérer le calcul de la moyenne des contrôles continus
  const handleCalculMoyenneControle = async () => {
    try {
      await fetchSumControlNote(classeId!, courseId!);
      await loadStudents()
      toast.success(`Calcul de la moyeene des contrôles éffectué avec succès.`);
    } catch (error) {
      toast.error('Erreur lors du calcul de la moyenne des contrôles.');
    }
  };


  // Fonction pour gérer le calcul de la moyenne générale
  const handleCalculMoyenneGeneral = async () => {
    try {
      await fetchMoyenneGeneral(classeId!, courseId!);
      await loadStudents()
      toast.success(`Calcul de la moyeene des contrôles éffectué avec succès.`);
    } catch (error) {
      toast.error('Erreur lors du calcul de la moyenne des contrôles.');
    }
  };


  const handleDownloadDocument = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fonction pour télécharger le document
  const handleViewDocument = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  // Ajouter une note à un étudiant
  const handleAddNoteUnique = async (studentId: number, control: number) => {
    try {
      await AddNoteByStudentSelect(classeId!, courseId!, String(studentId), control,);
      toast.success(`Note ajoutée pour avec succès.`);
      loadStudents();
    } catch (error) {
      toast.error('Erreur lors de l’ajout de la note.');
    }
  };


  //Fonction pour recuperer le nom de l'étudiant sélectionné par user
  const getStudentNameById = (id: number): string => {
    const student = students.find((s) => s.studentId === id);
    return student && student.student ? student.student.name : 'Étudiant inconnu';
  };


  const handleOpenUpdateModal = (studentId: number) => {
    setSelectedStudentId(studentId);
    const student = students.find((s) => s.studentId === studentId);
    if (student && student.note && Array.isArray(student.note)) {
      setSelectedNote({ position: 0, value: student.note[0] });
    } else {
      setSelectedNote(null);
    }
    setIsModalUpdateOpen(true);
  };


  const resetModalState = () => {
    setSelectedNote(null);
    setSelectedStudentId(0);
  };


  const handleNoteSelection = (position: number) => {
    setSelectedNotePosition(position);
  };


  const openDeleteNoteModal = (studentId: number) => {
    setSelectedStudentId(studentId);
    setIsDeleteNoteModalOpen(true);
  };


  const initialValues = {
    notes: students.map((student) => ({
      student: student.studentId,
      control: 0,
    })),
  };

  const initialValuesAddNote = {
    control: 0
  };


  // Validation pour le formik d'ajout de contrôle continu
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

  const validationSchemaAddNote = Yup.object({
    control: Yup.number()
      .min(0, 'Note minimale : 0')
      .max(20, 'Note maximale : 20')
      .required('Note requise.'),
  });


  const validationSchemaUpdateNote = Yup.object({
    notes: Yup.object({
      value: Yup.number()
        .min(0, 'La note ne peut être négative.')
        .max(20, 'La note ne peut excéder 20.')
        .required('Ce champ est requis.'),
    }),
  });


  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink asChild>
            <Link to="/teacher/filières">Classes</Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink asChild>
            <button onClick={() => navigate(-1)}>{nameclassData || "Cours"}</button>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{filiereName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>



      <div className="container mx-auto pt-12">
        <Toaster />
        <div>
          <div className="flex items-center justify-start mb-6">
            <Input
              placeholder="Rechercher par nom ou matricule"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="flex flex-wrap  items-center justify-end gap-y-2 md:gap-y-0 gap-x-2 mb-3">
            <Button
              variant="primary"
              className=""
              onClick={() => setIsModalOpen(!isModalOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 .5H1.5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V8m-11 2.5h11M3.5 3h2m-2 2.5h1" /><path d="m8.994 7.506l-3 .54l.5-3.04l4.23-4.21a1 1 0 0 1 1.42 0l1.06 1.06a1 1 0 0 1 0 1.42z" /></g>
              </svg>
              Contrôle continu
            </Button>
            <Button
              variant="default"
              className="bg-meta-10 hover:bg-meta-10"
              onClick={() => setIsModalAddExemOpen(!isModalAddExemOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 .5H1.5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V8m-11 2.5h11M3.5 3h2m-2 2.5h1" /><path d="m8.994 7.506l-3 .54l.5-3.04l4.23-4.21a1 1 0 0 1 1.42 0l1.06 1.06a1 1 0 0 1 0 1.42z" /></g>
              </svg>
              Note examen
            </Button>
            <Button
              variant="default"
              className="bg-lime-500 hover:bg-lime-600"
              onClick={() => setIsDocumentModalOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 5.5v-4a1 1 0 0 1 1-1h5l5 5v7a1 1 0 0 1-1 1h-5" /><path d="M8.5.5v5h5m-10 2v6m-3-3h6" /></g>
              </svg>
              Document
            </Button>
            <Button
              variant="default"
              className="bg-gray-500 hover:bg-gray-600"
              onClick={() => setIsDocumentListModalOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.5 12.5a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1h5l5 5Z" /><path d="M7.5.5v5h5" /></g>
              </svg>
              Documents
            </Button>
            <Button
              variant="default"
              className=""
              onClick={handleCalculMoyenneControle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m0 2v4h10V4zm0 6v2h2v-2zm4 0v2h2v-2zm4 0v2h2v-2zm-8 4v2h2v-2zm4 0v2h2v-2zm4 0v2h2v-2zm-8 4v2h2v-2zm4 0v2h2v-2zm4 0v2h2v-2z" />
              </svg>
              Moyenne Contrôle
            </Button>
            <Button
              variant="default"
              className=""
              onClick={handleCalculMoyenneGeneral}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m0 2v4h10V4zm0 6v2h2v-2zm4 0v2h2v-2zm4 0v2h2v-2zm-8 4v2h2v-2zm4 0v2h2v-2zm4 0v2h2v-2zm-8 4v2h2v-2zm4 0v2h2v-2zm4 0v2h2v-2z" />
              </svg>
              Moyenne Générale
            </Button>
          </div>

          <div className="w-full overflow-x-auto">
            <Table className="w-full border-collapse  rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900">
              <TableHeader className="bg-slate-800 dark:bg-gray-50">
                <TableRow>
                  <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                    Étudiant
                  </TableCell>
                  <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                    Contrôle continu
                  </TableCell>
                  <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                    Moyenne Contrôle
                  </TableCell>
                  <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                    Note Examen
                  </TableCell>
                  <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                    Moyenne Générale
                  </TableCell>
                  <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                    Statut
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-3 text-center text-gray-500">
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
                    <TableRow key={student.studentId} className="hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm">
                      <TableCell className="p-3 font-semibold text-left dark:text-gray-50">
                        {student.student.matricule} <br /> {student.student.name}
                      </TableCell>
                      <TableCell className="p-3 text-left">
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-[100px] font-semibold text-md">
                            {student.note && student.note.length > 0
                              ? student.note.map((n) => `${n}/20`).join(' , ')
                              : 'Aucune note'}
                          </div>
                          <div>
                            {/* Button ajouter note*/}
                            <a id="clickable" data-tooltip-id="addNote" data-tooltip-content="Ajouter un contôle continu " data-tooltip-place="top">
                              <Button className="mr-2" size="sm" variant="default" data-tooltip-content="Hello to you too!" onClick={() => { setSelectedStudentId(student.studentId); setIsModalAddOpen(true); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6" >
                                  <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                                </svg>
                              </Button>
                            </a>

                            {/* Button modifier note*/}
                            <a id="clickable" data-tooltip-id="modifyNote" data-tooltip-content="Modifier un contrôle continu " data-tooltip-place="top" >
                              <Button className="mr-2" size="sm" variant="primary" data-tooltip-content="Hello to you too!" onClick={() => handleOpenUpdateModal(student.studentId)}>
                                <PencilSquareIcon className="h-5 w-5 mx-auto" />
                              </Button>
                            </a>
                            {/* Button supprimer une note*/}
                            <a id="clickable" data-tooltip-id="deleteNote" data-tooltip-content="Supprimer un contrôle continu " data-tooltip-place="top">
                              <Button className="mr-2" size="sm" variant="destructive" data-tooltip-content="Hello to you too!" onClick={() => openDeleteNoteModal(student.studentId)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                  <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                </svg>
                              </Button>
                            </a>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-3 text-center">
                        {student.control !== null ? student.control : '-'}
                      </TableCell>
                      <TableCell className="p-3 text-left">
                        <div className="flex  items-center justify-between gap-4">
                          <div>{student.exam !== null ? student.exam : '-'}</div>
                          <div>
                            {/* Button modifier note*/}
                            <a
                              id="clickable"
                              data-tooltip-id="modifyExam"
                              data-tooltip-content="Modifier note exam "
                              data-tooltip-place="top"
                            >
                              <Button className="mr-2" size="sm" variant="primary" data-tooltip-content="Hello to you too!"
                                onClick={() => {
                                  setSelectedStudentId(student.studentId);
                                  setSelectedExam({ value: student.exam ?? 0 });
                                  setIsModalUpdateExamOpen(true);
                                }}
                              >
                                <PencilSquareIcon className="h-5 w-5 mx-auto" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-3 text-center">
                        {student.moy !== null ? student.moy.toFixed(2) : '-'}
                      </TableCell>
                      <TableCell className="flex p-3 text-center md:text-left ">
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
                    <TableCell colSpan={6} className="p-3 text-center text-gray-600 dark:text-white">
                      Aucune donnée disponible
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>


          {/* Pagination */}
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
                  <PaginationNext onClick={() => handlePageChange(page + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          <Tooltip id="modifyNote" />
          <Tooltip id="addNote" />
          <Tooltip id="modifyExam" />
          <Tooltip id="deleteNote" />
        </div>
      </div>


      {/* Modal Ajout Contrôle continu à tous les étudiants */}
      <AddAllControlModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={courseId!}
        classeId={classeId!}
        onSubmit={(notes) => handleAddNotes('control', notes)}
        validationSchema={validationSchema}
      />


      {/* Modal Ajout Note Exam  à tous les étudiants */}
      <AddExamModal
        isOpen={isModalAddExemOpen}
        onClose={() => setIsModalAddExemOpen(false)}
        courseId={courseId!}
        classeId={classeId!}
        onSubmit={(notes) => handleAddNotes('exam', notes)}
        validationSchema={validationSchema}
      />


      {/* Modal pour ajouter une note unique */}
      <AddNoteModal
        isOpen={isModalAddOpen}
        onClose={() => setIsModalAddOpen(false)}
        onSubmit={(control) => handleAddNoteUnique(selectedStudentId, control)}
        initialValues={initialValuesAddNote}
        validationSchema={validationSchemaAddNote}
      />

      {/* Modal pour modifier une note */}
      <UpdateNoteModal
        isOpen={isModalUpdateOpen}
        onClose={() => setIsModalUpdateOpen(false)}
        studentId={selectedStudentId}
        initialNote={selectedNote}
        onSubmit={handleUpdateNoteUnique}
        validationSchema={validationSchemaUpdateNote}
        notes={students.find(s => s.studentId === selectedStudentId)?.note || []}
      />


      {/* Modal pour modifier la note d'examen */}
      <UpdateExamModal
        isOpen={isModalUpdateExamOpen}
        onClose={() => setIsModalUpdateExamOpen(false)}
        studentName={getStudentNameById(selectedStudentId)}
        initialValue={selectedExam?.value ?? 0}
        onSubmit={async (value) => {
          await handleUpdateExamUnique(selectedStudentId, value);
        }}
      />

      {/* Modal pour supprimer la note continue */}
      <DeleteNoteModal
        isOpen={isDeleteNoteModalOpen}
        onClose={() => setIsDeleteNoteModalOpen(false)}
        studentNotes={students.find(student => student.studentId === selectedStudentId)?.note || []}
        selectedPosition={selectedNotePosition}
        onPositionSelect={handleNoteSelection}
        isConfirmationOpen={isConfirmationModalOpen}
        setIsConfirmationOpen={setIsConfirmationModalOpen}
        onConfirmationClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleDeleteNoteStudent}
      />


      {/* Modal pour envoyer un document */}
      <DocumentStudentsModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        onSubmit={handleDocumentSubmit}
        loading={loading}
      />

      <DocumentListModal
        isOpen={isDocumentListModalOpen}
        onClose={() => setIsDocumentListModalOpen(false)}
        documents={documents}
        loading={loading}
        onDownload={handleDownloadDocument}
        onView={handleViewDocument}
        // onDelete={handleDeleteDocument}
        page={documentPage}
        totalPages={documentTotalPages}
        onPageChange={setDocumentPage}
        classeId={classeId}
        courseId={courseId}
      />

    </>
  )
}

export default CoursesStudentTeacher