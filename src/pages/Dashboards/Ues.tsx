import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { EyeIcon, PlusIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { fetchUes, addUe, updateUe, fetchUeDetails } from "@/api/ues"; // API calls
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import { fetchMatters } from "@/api/matter";
import { useCallback } from 'react';
import { motion } from "framer-motion";
import { useTheme } from "@/components/context/ThemeContext";
interface Ue { 
  id: number;
  name: string;
  credit: number;
  semester: number;
  level: string;
  Matter: Matter[];
}

interface Matter {
  id: number;
  name: string;
  credit: number;
}
interface UeFormValues {
  name: string;
  semester: number;
  level: string;
  Matter: Matter[];
}

const UesPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [searchMatter, setSearchMatter] = useState(""); // Recherche des matières
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMattersPage, setCurrentMattersPage] = useState(1);

  const [totalPages, setTotalPages] = useState(0);
  const [ues, setUes] = useState<Ue[]>([]);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);

  const [uesDetails, setUesDetails] = useState<Ue | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [availableMatters, setAvailableMatters] = useState<Matter[]>([]); // Matières disponibles
  const [loading, setLoading] = useState(false);
  const [selectedUe, setSelectedUe] = useState<Ue | null>(null);
  const [hasMoreMatters, setHasMoreMatters] = useState(true);
  const [isFetchingMatters, setIsFetchingMatters] = useState(false); //Eviter des requêtes multipliées
  
  const { theme } = useTheme();
 
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

  // Charger les UEs
  const fetchAllUes = async () => {
    setLoading(true);
    try {
      const response = await fetchUes(currentPage, search);
      if (response && response.ues) {
        const validUes = response.ues.filter((ue) => !ue.is_delete);
        setUes(validUes);

        setTotalPages(Math.ceil(response.total / 10)); // Calcul du total des pages
      } else {
        setUes([]);
        setTotalPages(0);
        console.warn("Les données reçues ne sont pas valides :", response);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des administrateurs.");
      setUes([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllUes();
  }, [currentPage, search]);

  // Rechercher les matières associées (indépendant des UEs)
  const fetchMattersList = async (reset = false) => {
    if (isFetchingMatters || (!hasMoreMatters && !reset)) return; // Éviter des appels inutiles
    setIsFetchingMatters(true);

    try {
      const page = reset ? 1 : currentMattersPage;
      const response = await fetchMatters(page, searchMatter);

      if (reset) {
        setAvailableMatters(response.matters); // Réinitialiser la liste
        setCurrentMattersPage(1);
      } else {
        setAvailableMatters((prev) => [
          ...new Map([...prev, ...response.matters].map((m) => [m.id, m])).values(),
        ]);
        setCurrentMattersPage((prev) => prev + 1); // Charger la page suivante
      }

      setHasMoreMatters(response.matters.length > 0);
    } catch (error) {
      console.error("Erreur lors du chargement des matières :", error);
    } finally {
      setIsFetchingMatters(false);
    }

  };

  // Réinitialiser et recharger les matières
  const handleSearchMatter = useCallback(
    debounce(async () => {
      setHasMoreMatters(true);
      setCurrentMattersPage(1);
      await fetchMattersList(true);
    }, 100),
    [searchMatter]
  );

  useEffect(() => {
    if (searchMatter.trim() !== "") {
      handleSearchMatter();
    }
  }, [searchMatter]);

  // Scroll infini pour les matières
  const handleScrollMatters = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      fetchMattersList();
    }
  };

  // Gérer l'ouverture/fermeture du dialog pour ajouter ou modifier une Ue
  const toggleAddEditDialog = (ue: Ue | null = null) => {
    if (!isAddEditDialogOpen) {
      setSelectedUe(null);
      setSearchMatter('');
      setSelectedUe(null);
    }
    setSelectedUe(ue);
    setIsAddEditDialogOpen(!isAddEditDialogOpen);
  };

  // Afficher les détails d'une matière
  const handleViewDetails = async (id: number) => {
    try {
      const details = await fetchUeDetails(id);
   
      setUesDetails({ ...details });
      setIsDetailsDialogOpen(true);

    } catch (error) {
      console.error("Erreur lors de la récupération des détails de la matière :", error);
    }
  };

  // Gérer la soumission du formulaire
  const handleSaveUe = async (values: UeFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    setLoading(true);
    try {
      if (selectedUe) {
        // Modification
        await updateUe(selectedUe.id, values.name, values.semester, values.level, values.Matter.map((m) => m.id));
        toast.success("Matière mis à jour avec succès.");
      } else {
        // Ajout
        await addUe(values.name, values.semester, values.level, values.Matter.map((m) => m.id));
        toast.success("Matière ajoutée avec succès.");

      }
      resetForm();
      setIsAddEditDialogOpen(false);
      fetchAllUes();
    } catch (error) {
      toast.error("Erreur lors de la soumission du formulaire.");
    } finally {
      setLoading(false);
    }
  };


  // Pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-xl">Unités d'enseignement</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <motion.div className="py-6 space-y-6"
           initial="hidden"
           animate="visible"
           variants={containerVariants}
      >
  
        <Toaster />
        {/* Barre de recherche */}
        <motion.div  variants={itemVariants} className="flex items-center justify-between mb-6">
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
                    placeholder="Rechercher une UE"
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
            Ajouter UE
          </Button>
        </motion.div>
        {/* Tableau des UEs */}
        <motion.div  variants={itemVariants}>
          <Table className="w-full border-collapse  rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900">
            <TableHeader  style={{backgroundColor:theme.primaryColor, color:theme.textColor }} className="">
              <TableRow className="divide-x divide-gray-300 dark:divide-gray-700" >
                <TableCell className="p-3 text-left font-semibold" >Nom de l'UE</TableCell>
                <TableCell className="p-3 text-left font-semibold" >Crédit UE</TableCell>
                <TableCell className="p-3 text-left font-semibold">Semestre</TableCell>
                <TableCell className="p-3 text-left  font-semibold" >Niveau</TableCell>
                <TableCell className="p-3 text-left font-semibold"  >Matières Associées</TableCell>
                <TableCell className="p-3 text-center font-semibold " >Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-3 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="spinner">
                        <span className="dark:text-white">Chargement...</span>
                        <div className="half-spinner"></div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : ues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-3 text-center text-gray-600 dark:text-white"  >
                    Aucune donnée disponible
                  </TableCell>
                </TableRow>
              ) : (
                ues.map((ue) => (
                  <TableRow key={ue.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm divide-x divide-gray-300 dark:divide-gray-700">
                    <TableCell className="p-3 text-left dark:text-gray-300">{ue.name}</TableCell>
                    <TableCell className="p-3 text-left dark:text-gray-300">{ue.credit}</TableCell>
                    <TableCell className="p-3 text-left dark:text-gray-300">{ue.semester}</TableCell>
                    <TableCell className="p-3 text-left dark:text-gray-300">{ue.level}</TableCell>
                    <TableCell className="p-3 text-left dark:text-gray-300">
                      {ue.Matter.map((matter) => matter.name).join(", ")}
                    </TableCell>
                    <TableCell className="p-3 text-center flex justify-center items-center">
                      <Button className="mr-2"
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          toggleAddEditDialog(ue);
                        }}
                      >
                        <PencilSquareIcon className="h-5 w-5 mx-auto" />
                      </Button>
                      <Button size="sm" variant="default"
                        onClick={() => handleViewDetails(ue.id)}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>
        {/* Pagination */}
        {ues.length > 0 && (
          <Pagination>
            <PaginationContent className="mt-4">
              <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={i + 1 === currentPage}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationContent>
          </Pagination>
        )}
      </motion.div>


      {/* Dialog pour ajouter ou modifier une UE */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent aria-describedby="details-description">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-50 text-gray-800">{selectedUe ? "Modifier l'UE" : "Ajouter une UE"}</DialogTitle>
          </DialogHeader>
          <Formik<UeFormValues>
            initialValues={{
              name: selectedUe?.name || "",
              semester: selectedUe?.semester || 1,
              level: selectedUe?.level || "",
              Matter: selectedUe?.Matter || [],
            }}

            validationSchema={Yup.object({
              name: Yup.string()
                .min(3, "Le nom est trop court.")
                .required("Nom requis"),
              semester: Yup.number().transform((value, originalValue) => (originalValue === "" ? undefined : Number(originalValue)))
                .min(1, "Semestre invalide")
                .max(10, "Semestre invalide")
                .required("Semestre requis"),
              level: Yup.string().required("Niveau requis"),
              Matter: Yup.array().required("Au moins une matière est requise"),
            })}
            onSubmit={handleSaveUe}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div>
                      <label htmlFor="name" className="block text-gray-700 dark:text-gray-50 mb-2">Nom de l'UE</label>
                      <Field
                        id="name"
                        name="name"
                        as={Input}
                        placeholder="Nom de l'UE"
                        className="block w-full"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 mt-1" />
                    </div>

                    <div>
                      <label htmlFor="semester" className="block text-gray-700 dark:text-gray-50 mb-2">Semestre</label>
                      <Field
                        id="semester"
                        name="semester"
                        type="number"
                        as={Input}
                        placeholder="Semestre"
                        className="block w-full"
                      />
                      <ErrorMessage name="semester" component="div" className="text-red-500 mt-1" />
                    </div>
                    <div>
                      <label htmlFor="level" className="block text-gray-700 dark:text-gray-50 mb-2">Niveau</label>
                      <Field
                        id="level"
                        name="level"
                        as={Input}
                        placeholder="Niveau"
                        className="block w-full"
                      />
                      <ErrorMessage name="level" component="div" className="text-red-500 mt-1" />
                    </div>
                  </div>

                  <div className="col-span-2 ">
                    <Input
                      placeholder="Rechercher une matière"
                      value={searchMatter}
                      onChange={(e) => {
                        setSearchMatter(e.target.value);
                      }}
                    />
                    <div className="mt-2 max-h-48 overflow-y-auto border p-2" onScroll={handleScrollMatters}>
                      {availableMatters.map((matter) => {
                        const isSelected = values.Matter.some((m) => m.id === matter.id); // Vérifie si la matière est sélectionnée
                        return (
                          <div key={matter.id} className={`flex justify-between items-center p-2 border-b ${isSelected ? " text-red-600" : ""}`}  >
                            <span>{matter.name}</span>
                            <button type="button" className={`p-1 rounded ${isSelected ? "opacity-50 cursor-not-allowed" : "bg-blue-500 text-white"}`}
                              onClick={() => {
                                if (!isSelected) {
                                  const updatedMatters = [...values.Matter, matter];
                                  setFieldValue("Matter", updatedMatters);
                                }
                              }}
                              disabled={isSelected}
                            >
                              {isSelected ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" >
                                  <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                  <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                          </div>
                        );
                      })}

                      {!hasMoreMatters && searchMatter && availableMatters.length === 0 && (
                        <div className="text-center text-gray-500">Aucune matière trouvée pour "{searchMatter}".</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Matières sélectionnées */}
                <div>
                  <h4 className="font-semibold mt-4 dark:text-gray-50 text-gray-800 mb-1">Matières Sélectionnées :</h4>
                  <div className="flex flex-wrap gap-2 overflow-x-auto max-w-full"
                    style={{ maxHeight: '3rem' }} // Optionnel : Limite de hauteur
                  >
                    {values.Matter.map((matter) => (
                      <Button key={matter.id} size="sm" variant="primary" className="whitespace-nowrap"
                        onClick={() => {
                          const updatedMatters = values.Matter.filter(
                            (m) => m.id !== matter.id
                          );
                          setFieldValue("Matter", updatedMatters);
                        }}
                      >
                        {matter.name} &times;
                      </Button>
                    ))}
                  </div>
                </div>


                {/* Ajoutez une section pour ajouter des matières */}
                <DialogFooter className="mt-4">
                  <Button type="submit" disabled={isSubmitting || values.Matter.length === 0}>
                    {isSubmitting ? "Chargement..." : "Soumettre"}
                  </Button>

                  <Button variant="outline" onClick={() => setIsAddEditDialogOpen(false)}>
                    Annuler
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>


      {/* Dialog pour afficher les détails  Ue */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent aria-describedby="details-description">
          <DialogHeader>
            <DialogTitle>Détails de l'UE</DialogTitle>
          </DialogHeader>

          {uesDetails ? (
            <div id="details-description" className="space-y-4">
              <div>
                <strong>Nom :</strong> {uesDetails.name}
              </div>
              <div>
                <strong>Crédit UE :</strong> {uesDetails.credit}
              </div>
              <div>
                <strong>Semestre :</strong> {uesDetails.semester}
              </div>
              <div>
                <strong>Niveau :</strong> {uesDetails.level}
              </div>
              <div>
                <strong>Matières associées :</strong> {uesDetails.Matter.map(m => m.name).join(" , ")}

              </div>
            </div>
          ) : (
            <p>Chargement des détails...</p>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)} >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UesPage;