import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast, { Toaster } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  addNotification,
  listNotifications,
  Notifications,
  lastPromo,
  AddNotificationData,
} from '@/api/notifications/notification';
import { fetchClasses, Class } from '@/api/Classroom/gestionClasses';
import { fetchMembersByRole, Member } from '@/api/members';
import { useCallback } from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { PlusIcon } from '@heroicons/react/24/solid';
import { color, motion } from 'framer-motion';
import { useTheme } from "@/components/context/ThemeContext";

interface NotificationFormValues {
  title: string;
  content: string;
  type: string;
  class: [string, number];
  User: Member[];
  doc: File | null;
}

const Notification: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState('');
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [pageNotif, setPageNotif] = useState(1);
  const [searchNotif, setSearchNotif] = useState('');
  const [totalNotif, setTotalNotif] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedRole, setSelectedRole] = useState('student');

  const [lastPromo, setLastPromo] = useState<lastPromo | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  {
    /* State Teacher */
  }
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [classSearch, setclassSearch] = useState('');
  const [currentClassPage, setcurrentClassPage] = useState(1);
  const [availableClass, setavailableClass] = useState<Class[]>([]); // classe disponibles
  const [hasMoreClass, sethasMoreClass] = useState(true);
  const [isFetchingClass, setIsFetchingClass] = useState(false); //Eviter des requêtes multipliées
  {
    /* Fin */
  }
  {
    /* State Members */
  }

  const [membersSearch, setmembersSearch] = useState('');
  const [currentMembersPage, setcurrentMembersPage] = useState(1);
  const [availableMembers, setavailableMembers] = useState<Member[]>([]); // classe disponibles
  const [hasMoreMembers, sethasMoreMembers] = useState(true);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false); //Eviter des requêtes multipliées
  {
    /* Fin */
  }
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 10,
        staggerChildren: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 60 },
    },
  };

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
  const perPage = 10;

  const toggleDialogOpen = (content: any) => {
    setSelectedContent(content);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedContent('');
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await listNotifications(pageNotif, searchNotif);
      if (response && response.notifications) {
        const validNotifi = response.notifications.filter(
          (notif: Notifications) => !notif.is_delete,
        );
        setNotifications(validNotifi);
        setTotalNotif(response.total);
        setTotalPages(Math.ceil(response.total / perPage));

        if (response.lastPromo) {
          setLastPromo(response.lastPromo);
        }
      } else {
        setNotifications([]);
        setTotalNotif(0);
        setTotalPages(0);
        console.warn('Données non valides :', response);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des notifications.');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadNotifications();
  }, [pageNotif, searchNotif]);

  // Pagination
  const handlePageChange = (page: number) => {
    setPageNotif(page);
  };

  /*Classes */
  // Rechercher les classes associées au promo
  const SearchClass = async (reset = false) => {
    if (isFetchingClass || (!hasMoreClass && !reset)) return;
    setIsFetchingClass(true);
    try {
      const page = reset ? 1 : currentClassPage;
      if (!lastPromo) {
        console.warn('Aucune promotion trouvée dans `lastPromo`.');
        return;
      }
      // Récupérez l'ID de la promo.
      const promoId = lastPromo.id;
      const response = await fetchClasses(page, classSearch, promoId);
      if (reset) {
        setavailableClass(response.classes);
        setcurrentClassPage(1);
      } else {
        setavailableClass((prev) => [
          ...new Map(
            [...prev, ...response.classes].map((m) => [m.id, m]),
          ).values(),
        ]);
        setcurrentClassPage((prev) => prev + 1);
      }
      sethasMoreClass(response.classes.length > 0);
    } catch (error) {
      console.error('Erreur lors du chargement des classes :', error);
    } finally {
      setIsFetchingClass(false);
    }
  };
  // Scroll infini pour les professeurs
  const handleScrollClass = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      SearchClass();
    }
  };
  // Fonction handleSearchTeachers avec useCallback
  const handleSearchTeachers = useCallback(
    debounce(async () => {
      sethasMoreClass(true);
      setcurrentClassPage(1);
      await SearchClass(true);
    }, 300),
    [SearchClass],
  );

  useEffect(() => {
    if (classSearch.trim() !== '') {
      handleSearchTeachers();
    }
  }, [classSearch]);

  // Gestion de la sélection d'un enseignant
  const handleSelectClass = (classe: Class) => {
    setSelectedClass(classe);
  };

  /*Members */
  // Fonction pour chercher les étudiants
  const SearchMembers = async (reset = false) => {
    if (isFetchingMembers || (!hasMoreMembers && !reset)) return;
    setIsFetchingMembers(true);
    try {
      const page = reset ? 1 : currentMembersPage;
      const response = await fetchMembersByRole('', page, membersSearch);
      if (reset) {
        setavailableMembers(response.persons);
        setcurrentMembersPage(1);
      } else {
        setavailableMembers((prev) => [
          ...new Map(
            [...prev, ...response.persons].map((m) => [m.id, m]),
          ).values(),
        ]);
        setcurrentMembersPage((prev) => prev + 1);
      }
      sethasMoreMembers(response.persons.length > 0);
    } catch (error) {
      console.error('Erreur lors du chargement des membres :', error);
    } finally {
      setIsFetchingMembers(false);
    }
  };

  // Réinitialiser et recharger les étudiants
  const handleSearchMembers = useCallback(
    debounce(async () => {
      sethasMoreMembers(true);
      setcurrentMembersPage(1);
      await SearchMembers(true);
    }, 300),
    [SearchMembers],
  );

  useEffect(() => {
    if (membersSearch.trim() !== '') {
      handleSearchMembers();
    }
  }, [membersSearch]);

  // Scroll infini pour les matières
  const handleScrollMembers = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      SearchMembers();
    }
  };
  /*Fin Members */

  const handleSubmit = async (
    values: NotificationFormValues,
    { resetForm }: { resetForm: () => void },
  ) => {
    setLoading(true);

    try {
      // Construire les données de la classe si le type est "class"
      let classData: [string, number] | undefined = undefined;
      if (values.type === 'class') {
        if (selectedClass && selectedRole) {
          classData = [selectedRole, selectedClass.id];
        } else {
          toast.error('Veuillez sélectionner une classe et un rôle.');
          setLoading(false);
          return;
        }
      }

      // Préparer les données pour le backend
      const formData: AddNotificationData = {
        title: values.title,
        content: values.content,
        type: values.type,
        class: classData,
        users:
          values.type === 'users'
            ? values.User.map((user) => user.id)
            : undefined,
        doc: values.doc instanceof File ? values.doc : undefined,
      };

      // Envoyer la requête
      await addNotification(formData);

      toast.success('Notification ajoutée avec succès');
      setIsDialogOpen(false);
      loadNotifications();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'ajout de la notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Notifications" />
      <motion.div
        className="py-6 space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Toaster />
 
        <motion.div  variants={itemVariants}
        className="flex items-center justify-between mb-6">
          <div className="flex items-center relative w-full max-w-sm">
          <span style={{color:theme.primaryColor}}  className="absolute left-3 ">
              {/* Icône SVG */}
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
              placeholder="Rechercher une notification par titre ou contenu"
              value={searchNotif}
              onChange={(e) => setSearchNotif(e.target.value)}
              className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <Button
              variant="primary"
              className="ml-4"
              onClick={() => setIsDialogOpen(true)}
            >
              <PlusIcon className="  h-5 w-5 mr-2" />
              Ajouter une notification
            </Button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Table className="w-full mt-4 border-collapse rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900">
            <TableHeader style={{backgroundColor:theme.primaryColor, color:theme.textColor }}
            className="">
              <TableRow className="divide-x divide-gray-300 dark:divide-gray-700">
                <TableCell className="p-3 text-left font-semibold  ">
                  Titre
                </TableCell>
                <TableCell className="p-3 text-left font-semibold">
                  Contenu
                </TableCell>
                <TableCell className="p-3 text-center font-semibold">
                  Fichier
                </TableCell>
                <TableCell className="p-3 text-left font-semibold ">
                  Date d'envoi
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
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
              ) : notifications.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="p-3 text-center text-gray-600 dark:text-white"
                  >
                    Aucune notification disponible
                  </TableCell>
                </TableRow>
              ) : (
                notifications.map((notification) => (
                  <TableRow
                    key={notification.id}
                    className="text-black-2 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm divide-x divide-gray-300 dark:divide-gray-700"
                  >
                    <TableCell className="p-3 text-left text-md  font-semibold dark:text-gray-300">
                      {notification.title}
                    </TableCell>
                    <TableCell className="p-3 text-left text-md  font-medium dark:text-gray-300">
                      {notification.content.length > 20 ? (
                        <>
                          {notification.content.slice(0, 20)}...
                          <span
                            onClick={() => toggleDialogOpen(notification.content)}
                            className="text-blue-600 hover:underline cursor-pointer ml-2"
                          >
                            voir plus
                          </span>
                        </>
                      ) : (
                        notification.content
                      )}
                    </TableCell>
                    <TableCell className="p-3 text-center dark:text-gray-300">
                      {notification.file ? (
                        <a
                          href={notification.file}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{backgroundColor:theme.primaryColor , color:theme.textColor}}

                          className="px-3 py-1  text-md  font-semibold rounded-md"
                        >
                          Télécharger
                        </a>
                      ) : (
                        'Aucun'
                      )}
                    </TableCell>
                    <TableCell className="p-3 text-left text-md  font-semibold dark:text-gray-300">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>

        {/* Pagination */}
        {notifications.length > 0 && (
          <Pagination>
            <PaginationContent className="mt-4">
              <PaginationPrevious
                onClick={() => handlePageChange(pageNotif - 1)}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={i + 1 === pageNotif}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext onClick={() => handlePageChange(pageNotif + 1)} />
            </PaginationContent>
          </Pagination>
        )}

        {/* Modal */}
        <Dialog open={dialogOpen} onOpenChange={closeDialog}>
          <DialogContent className="max-w-lg max-h-[70vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contenu complet</DialogTitle>
            </DialogHeader>
            <p className="text-gray-800 dark:text-gray-300">
              {selectedContent}
            </p>
            <DialogFooter>
              <Button onClick={closeDialog} className="">
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Ajout notification */}

        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une notification</DialogTitle>
              </DialogHeader>

              <Formik<NotificationFormValues>
                initialValues={{
                  title: '',
                  content: '',
                  type: 'all',
                  class: ['', 0],
                  doc: null,
                  User: [],
                }}
                validationSchema={Yup.object({
                  title: Yup.string().required('Le titre est obligatoire'),
                  content: Yup.string().required('Le contenu est obligatoire'),
                  type: Yup.string()
                    .oneOf(['all', 'class', 'users'], 'Type invalide')
                    .required(),
                  doc: Yup.mixed()
                    .test(
                      'fileType',
                      'Le fichier doit être un document ou une image valide',
                      (value) => {
                        if (!value) return true;
                        return (
                          value instanceof File &&
                          [
                            'application/pdf',
                            'image/jpeg',
                            'image/png',
                          ].includes(value.type)
                        );
                      },
                    )
                    .notRequired(),

                  class: Yup.array().required('La classe est obligatoire'),
                  User: Yup.array().required(
                    'Veuillez sélectionner au moins un utilisateur',
                  ),
                })}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <div className="overflow-y-auto max-h-115 p-4">
                    <Form>
                      <div className="mb-4">
                        <Field name="title" as={Input} placeholder="Titre" />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="text-sm text-red-500 mt-1"
                        />
                      </div>
                      <div className="mb-4">
                        <Field
                          name="content"
                          as={Input}
                          placeholder="Contenu"
                        />
                        <ErrorMessage
                          name="content"
                          component="div"
                          className="text-sm text-red-500 mt-1"
                        />
                      </div>
                      <div className="my-2">
                        <div className="flex items-center justify-between mt-2">
                          <label
                            htmlFor="type"
                            className="block text-md font-semibold  text-gray-700"
                          >
                            À qui ?
                          </label>
                          {/* Label de description
                      <span className="text-md text-gray-500">Choisissez le destinataire</span> */}

                          {/* Champ Select */}
                          <Field
                            as="select"
                            id="type"
                            name="type"
                            className="block w-full md:w-64 px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            onChange={(e: any) =>
                              setFieldValue('type', e.target.value)
                            }
                          >
                            <option value="all">Tous le monde</option>
                            <option value="class">Classes</option>
                            <option value="users">Utilisateurs</option>
                          </Field>
                        </div>
                      </div>

                      {values.type === 'class' && (
                        <>
                          <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium">
                              Classes
                            </label>
                            <div className="relative">
                              <Input
                                placeholder="Rechercher une classe"
                                value={classSearch}
                                onChange={(e) => {
                                  setclassSearch(e.target.value);
                                }}
                              />
                            </div>
                            <div
                              className="mt-2 max-h-48 overflow-y-auto border p-2"
                              onScroll={handleScrollClass}
                            >
                              {availableClass.map((classe) => (
                                <div
                                  key={classe.id}
                                  className={`cursor-pointer p-2 ${
                                    selectedClass?.id === classe.id
                                      ? 'bg-blue-500 text-white'
                                      : ''
                                  }`}
                                  onClick={() => handleSelectClass(classe)}
                                >
                                  {classe.name}
                                </div>
                              ))}

                              {!hasMoreClass &&
                                classSearch &&
                                availableClass.length === 0 && (
                                  <div className="text-center text-gray-500">
                                    Aucun enseignant trouvé pour "{classSearch}
                                    ".
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <label className="block text-md font-semibold  text-gray-700">
                              Aux
                            </label>
                            <Field
                              as="select"
                              id="role"
                              name="role"
                              className="block w-full  md:w-64 px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              onChange={(e: any) =>
                                setSelectedRole(e.target.value)
                              }
                            >
                              <option disabled>Choisir un rôle</option>

                              <option value="student" className="">
                                Étudiants
                              </option>
                              <option value="teacher">Enseignants</option>
                            </Field>
                          </div>
                        </>
                      )}
                      {values.type === 'users' && (
                        <div>
                          {/* Select multiple */}
                          <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium">
                              Utilisateurs
                            </label>
                            <div className="relative">
                              <div className="flex items-center relative w-full ">
                                <span className="absolute left-3 text-gray-500 dark:text-gray-100">
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
                                  placeholder="Rechercher un membre"
                                  value={membersSearch}
                                  onChange={(e) => {
                                    setmembersSearch(e.target.value);
                                  }}
                                  className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                              </div>

                              <div
                                className="mt-2 max-h-48 overflow-y-auto border p-2"
                                onScroll={handleScrollMembers}
                              >
                                {availableMembers.map((members) => {
                                  const isSelected = values.User.some(
                                    (m) => m.id === members.id,
                                  );
                                  return (
                                    <div
                                      key={members.id}
                                      className={`flex justify-between items-center p-2 border-b ${
                                        isSelected ? ' text-red-600' : ''
                                      }`}
                                    >
                                      <span>
                                        {members.name} ({members.matricule})
                                      </span>

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
                                              ...values.User,
                                              members,
                                            ];
                                            setFieldValue(
                                              'User',
                                              updatedMembers,
                                            );
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

                                {!hasMoreMembers &&
                                  membersSearch &&
                                  availableMembers.length === 0 && (
                                    <div className="text-center text-gray-500">
                                      Aucun étudiant trouvé pour "
                                      {membersSearch}".
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                          {/* Membres sélectionnés */}
                          <div>
                            <h4 className="font-semibold mt-4 dark:text-gray-100 text-gray-600">
                              Utilisateurs Sélectionnés :
                            </h4>
                            <div
                              className="flex flex-wrap gap-2 overflow-x-auto max-w-full"
                              style={{ maxHeight: '3rem' }}
                            >
                              {values.User.map((members) => (
                                <Button
                                  key={members.id}
                                  size="sm"
                                  variant="primary"
                                  onClick={() => {
                                    const updatedStudents = values.User.filter(
                                      (m) => m.id !== members.id,
                                    );
                                    setFieldValue('User', updatedStudents);
                                  }}
                                >
                                  {members.name} &times;
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="my-4">
                        <div className="mb-4">
                          <label className="block mb-2 text-sm font-medium">
                            Document (facultatif)
                          </label>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setFieldValue('doc', file);
                            }}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <div className="flex justify-start gap-4">
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Chargement...' : 'Soumettre'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Annuler
                          </Button>
                        </div>
                      </DialogFooter>
                    </Form>
                  </div>
                )}
              </Formik>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
    </>
  );
};

export default Notification;
