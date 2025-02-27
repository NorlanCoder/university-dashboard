import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import DynamicBreadcrumb from '@/components/DynamicBreadcrumb';
import { motion } from "framer-motion";
import { 
  fetchClasses,
  updateClass,
  addClass,
  Class,
} from '@/api/Classroom/gestionClasses';
import { fetchPromo } from '@/api/promos';
import toast, { Toaster } from 'react-hot-toast';
import { PlusIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '@/css/Loader.css';
import { useTheme } from "@/components/context/ThemeContext";
// Types des classes
export interface Promo {
  id: number;
  name: string;
  slug: string;
  schoolId: number;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
}

const Classes: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { promoId } = useParams<{ promoId: string }>(); // Récupère promoId de l'URL
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);
  const [loading, setLoading] = useState(false);
  const perPage = 10;
  const navigate = useNavigate();
  const [isBilanDialogOpen, setIsBilanDialogOpen] = useState(false);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [currentPromo, setCurrentPromo] = useState<Promo | null>(null);
  const [selectedFiliereId, setSelectedFiliereId] = useState<number | null>(null);

  const {theme} =  useTheme() ;
  /*Animation Cards */
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, 
      },
    },
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

  // Charger les promotions
  const loadPromos = async () => {
    setLoading(true);
    try {
      const response = await fetchPromo();
      if (response) {
        const validPromos = response.promos.filter(
          (prom: Promo) => !prom.is_delete,
        );
        setPromos(validPromos);
      } else {
        setPromos([]);
        console.warn('Données non valides :', response);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des promotions.');
      setPromos([]);
    } finally {
      setLoading(false);
    }
  };

  const findCurrentPromo = () => {
    if (promoId && promos.length > 0) {
      const promo = promos.find((p) => p.id === parseInt(promoId));
      setCurrentPromo(promo || null);
    }
  };

  //
  const toggleBilanDialog = (filiereId: number | null) => {
    setSelectedFiliereId(filiereId);
    setIsBilanDialogOpen(!isBilanDialogOpen);
  };

  // Charger les classes en fonction de promoId

  const loadClasses = async () => {
    setLoading(true);
    try {
      const response = await fetchClasses(page, search, parseInt(promoId!));
      if (response && response.classes) {
        const validClasses = response.classes.filter(
          (cls: Class) => !cls.is_delete,
        );
        setClasses(validClasses);
        setTotalClasses(response.total);
        setTotalPages(Math.ceil(response.total / perPage));
      } else {
        setClasses([]);
        setTotalClasses(0);
        setTotalPages(0);
        console.warn('Données non valides :', response);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des classes.');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (promoId) {
      loadClasses();
      loadPromos();
    }
  }, [page, search, promoId]);

  useEffect(() => {
    findCurrentPromo();
  }, [promos, promoId]);

  // Gestion de la soumission du formulaire via Formik
  const handleSubmit = async (values: { name: string; level: string }) => {
    setLoading(true);
    try {
      if (selectedClass) {
        // Modification
        await updateClass(selectedClass.id, values.name, values.level);
        toast.success('Classe mise à jour avec succès.');
      } else {
        // Ajout
        await addClass(values.name, values.level, parseInt(promoId!));
        toast.success('Classe ajoutée avec succès.');
      }
      setIsAddEditDialogOpen(false);
      loadClasses();
    } catch (error) {
      toast.error('Erreur lors de la soumission du formulaire.');
    } finally {
      setLoading(false);
    }
  };

  // Validation avec Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Le nom de la classe est requis'),
    level: Yup.string().required('Le niveau est requis'),
  });

  // Gestion de l'ouverture/fermeture du modal
  const toggleAddEditDialog = (cls: Class | null = null) => {
    setSelectedClass(cls);
    setIsAddEditDialogOpen(!isAddEditDialogOpen);
  };

  const closeBilanDialog = () => {
    setSelectedFiliereId(null);
    setIsBilanDialogOpen(false);
  };


  // Changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  // Gestion de la navigation
  const handleNavigate = (cls: Class) => {
    navigate(`/bilan/filiere/${cls.id}/cours`);
  };

  return (
    <>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <DynamicBreadcrumb
          items={[
            { label: 'Promotion', href: '/bilan' },
            { label: currentPromo ? currentPromo.name : 'Chargement...' },
            { label: 'Filières' },
          ]}
        />
      )} 
      
      <motion.div className="py-6 space-y-6"
         variants={containerVariants}
         initial="hidden"
         animate="show"
      >
        <Toaster />
        <motion.div  variants={cardVariants} className="flex items-center justify-between mb-6">
        <div className="flex items-center relative w-full max-w-sm">
        <span style={{color:theme.primaryColor}}  className="absolute left-3 ">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>
         </span>
          <Input
            placeholder="Rechercher par nom"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          </div>

          <Button
            variant="primary"
            className="ml-4"
            onClick={() => toggleAddEditDialog()}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter une Filière
          </Button>
        </motion.div>

        <Dialog
          open={isAddEditDialogOpen}
          onOpenChange={setIsAddEditDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {selectedClass
                  ? 'Modifier la filière'
                  : 'Ajouter une nouvelle filière'}
              </DialogTitle>
            </DialogHeader>
            <Formik
              initialValues={{
                name: selectedClass ? selectedClass.name : '',
                level: selectedClass ? selectedClass.level : '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <Field
                        as={Input}
                        name="name"
                        placeholder="Nom de la classe"
                        required
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                    <div>
                      <Field
                        as="select"
                        name="level"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:border-slate-900 dark:bg-slate-900 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                      >
                        <option value="" disabled>
                          Sélectionnez un niveau
                        </option>
                        <option value="Licence 1">Licence 1</option>
                        <option value="Licence 2">Licence 2</option>
                        <option value="Licence 3">Licence 3</option>
                        <option value="Master 1">Master 1</option>
                        <option value="Master 2">Master 2</option>
                      </Field>
                      <ErrorMessage
                        name="level"
                        component="div"
                        className="text-red-500 dark:text-red-300"
                      />
                    </div>
                  </div>

                  <DialogFooter className="flex mt-6 justify-end">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting || loading}
                    >
                      {loading ? 'En cours...' : 'Confirmer'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setIsAddEditDialogOpen(false)}
                      disabled={loading}
                    >
                      Annuler
                    </Button>
                  </DialogFooter>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="spinner">
              <span className="dark:text-white">Chargement...</span>
              <div className="half-spinner"></div>
            </div>
          </div>
        ) : classes.length === 0 ? (
          search ? (
            <p className="text-center text-gray-600 dark:text-white pt-12">
            Aucune classe trouvée pour "<strong>{search}</strong>".
          </p>
          ) : (
          <p className="text-center text-gray-600 dark:text-white pt-12">
            Aucune donnée pour les classes.
          </p>
           )
        ) : (

          <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {classes.map((cls) => (
            <motion.div
              key={cls.id}
              variants={cardVariants} // Applique l'animation à chaque carte
              className="hover:shadow-lg transition-shadow"
            >
              <Card>
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => handleNavigate(cls)}
                >
                  <div className="flex justify-end mb-6">
                    <p
                      className="flex font-bold hover:scale-x-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBilanDialog(cls.id);
                      }}
                    >
                      Voir Bilan
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"
                        />
                      </svg>
                    </p>
                  </div>
    
                  <div className="flex flex-wrap items-center justify-between gap-2 px-2">
                    <CardTitle className="text-lg font-semibold">
                      <div className="text-md lg:text-lg xl:text-xl uppercase">
                        {cls.name}
                        <br />
                        {cls.level}
                      </div>
                    </CardTitle>
    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAddEditDialog(cls);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                      <span>Modifier</span>
                    </button>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
          
        )}

        {classes.length > 0 && (
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
      </motion.div>

      {/* Dialog pour afficher les cartes */}
      {isBilanDialogOpen && selectedFiliereId !== null && (
        <Dialog open={isBilanDialogOpen} onOpenChange={setIsBilanDialogOpen}>
          <DialogContent>
            <DialogHeader>

              <DialogTitle className='mt-4'>
                {classes
                  .filter((cls) => cls.id === selectedFiliereId)
                  .map((cls) =>
                    currentPromo ? `Bilan Annuel de la Filière ${cls.name} . Promo : ${currentPromo.name}` : 'Chargement...'
                  )}
              </DialogTitle>
            </DialogHeader>
            {classes
              .filter((cls) => cls.id === selectedFiliereId)
              .map((cls) => (
                <div key={cls.id} className="flex flex-wrap gap-4 justify-center p-3">
                  {cls.is_finish ? (
                    cls.Bilan && (
                      <>
                        <div className="bg-slate-800 shadow-md rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-xl p-2">
                          <div className="flex items-center gap-2 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="currentColor" fillRule="evenodd" d="M288 117.333c0-41.237-33.429-74.666-74.667-74.666l-4.096.11c-39.332 2.127-70.57 34.694-70.57 74.556c0 41.238 33.429 74.667 74.666 74.667l4.097-.111c39.332-2.126 70.57-34.693 70.57-74.556m-32 256c0 19.205 4.614 37.332 12.794 53.334H64v-76.8c0-62.033 47.668-112.614 107.383-115.104l4.617-.096h74.667c29.474 0 56.29 11.711 76.288 30.855C285.219 283.501 256 325.005 256 373.333m117.333-96c-53.019 0-96 42.981-96 96s42.981 96 96 96c53.02 0 96-42.981 96-96s-42.98-96-96-96m62.763 62.763l-84.095 84.094l-41.428-41.428l18.856-18.856l22.572 22.572l65.239-65.238z" clipRule="evenodd" /></svg>
                            <h3 className="text-lg font-semibold ">Admins</h3>
                          </div>
                          <div className="mt-1 text-center">
                            <p className="text-gray-100 font-semibold">{cls.Bilan.pass} / {cls.Bilan.total}</p>
                          </div>
                        </div>

                        <div className="bg-slate-800 shadow-md rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-xl p-2">
                          <div className="flex items-center gap-2 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0-20zm0 3a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 12 5zm1 5h-2v6h2v-6zm-2 8h2v2h-2v-2z" />
                            </svg>

                            <h3 className="text-lg font-semibold">Ajournés</h3>
                          </div>
                          <div className="mt-1 text-center">
                            <p className="text-gray-100 font-semibold">{cls.Bilan.pass} / {cls.Bilan.total}</p>
                          </div>
                        </div>

                        <div className="bg-slate-800 shadow-md rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-xl p-2">
                          <div className="flex items-center gap-2 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3.5 7a5 5 0 1 1 10 0a5 5 0 0 1-10 0m13.879-.536L19.5 8.586l2.121-2.122l1.415 1.415L20.914 10l2.121 2.121l-1.414 1.415l-2.121-2.122l-2.121 2.122l-1.415-1.415L18.087 10l-2.121-2.121zM0 19a5 5 0 0 1 5-5h7a5 5 0 0 1 5 5v2H0z" /></svg>
                            <h3 className="text-lg font-semibold">Redoublants</h3>
                          </div>
                          <div className="mt-1 text-center">
                            <p className="text-gray-100 font-semibold">{cls.Bilan.redouble}</p>
                          </div>
                        </div>


                      </>

                    )

                  )

                    : (
                      <>
                        <div className="bg-slate-800 shadow-md rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-xl p-2">
                          <div className="flex items-center gap-2 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="currentColor" fillRule="evenodd" d="M288 117.333c0-41.237-33.429-74.666-74.667-74.666l-4.096.11c-39.332 2.127-70.57 34.694-70.57 74.556c0 41.238 33.429 74.667 74.666 74.667l4.097-.111c39.332-2.126 70.57-34.693 70.57-74.556m-32 256c0 19.205 4.614 37.332 12.794 53.334H64v-76.8c0-62.033 47.668-112.614 107.383-115.104l4.617-.096h74.667c29.474 0 56.29 11.711 76.288 30.855C285.219 283.501 256 325.005 256 373.333m117.333-96c-53.019 0-96 42.981-96 96s42.981 96 96 96c53.02 0 96-42.981 96-96s-42.98-96-96-96m62.763 62.763l-84.095 84.094l-41.428-41.428l18.856-18.856l22.572 22.572l65.239-65.238z" clipRule="evenodd" /></svg>
                            <h3 className="text-lg font-semibold ">Admins</h3>
                          </div>
                          <div className="mt-1 text-center">
                            <p className="text-gray-100 italic  ">En cours</p>
                          </div>
                        </div>

                        <div className="bg-slate-800 shadow-md rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-xl p-2">
                          <div className="flex items-center gap-2 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0-20zm0 3a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 12 5zm1 5h-2v6h2v-6zm-2 8h2v2h-2v-2z" />
                            </svg>

                            <h3 className="text-lg font-semibold">Ajournés</h3>
                          </div>
                          <div className="mt-1 text-center">
                            <p className="text-gray-100 italic">En cours</p>
                          </div>
                        </div>

                        <div className="bg-slate-800 shadow-md rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-xl p-2">
                          <div className="flex items-center gap-2 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3.5 7a5 5 0 1 1 10 0a5 5 0 0 1-10 0m13.879-.536L19.5 8.586l2.121-2.122l1.415 1.415L20.914 10l2.121 2.121l-1.414 1.415l-2.121-2.122l-2.121 2.122l-1.415-1.415L18.087 10l-2.121-2.121zM0 19a5 5 0 0 1 5-5h7a5 5 0 0 1 5 5v2H0z" /></svg>
                            <h3 className="text-lg font-semibold">Redoublants</h3>
                          </div>
                          <div className="mt-1 text-center">
                            <p className="text-gray-100 italic">En cours</p>
                          </div>
                        </div>
                      </>
                    )}
                </div>
              ))}
            <DialogFooter>
              <Button variant="secondary" onClick={() => closeBilanDialog()}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Classes;
