import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { EyeIcon, PlusIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { fetchMatters, addMatter, updateMatter, fetchMatterDetails } from "@/api/matter";
import ImportExcelMatters from "@/components/ExcelData/ImportExcelMatters";
import { motion } from "framer-motion";
import { useTheme } from "@/components/context/ThemeContext";

interface Matter {
  id: number;
  name: string;
  code: string;
  slug: string;
  credit: number;
  is_delete: boolean;
}

interface MatterFormValues {
  name: string;
  code: string;
  credit: number;
}

const Matieres: React.FC = () => {
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedMatter, setSelectedMatter] = useState<Matter | null>(null);
  // const [newMatter, setNewMatter] = useState({ name: "", credit: 0 });
  const [matters, setMatters] = useState<Matter[]>([]);
  const [matterDetails, setMatterDetails] = useState<Matter | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1); // Page actuelle 
  const [totalPages, setTotalPages] = useState(0); // Total de pages
  const [loading, setLoading] = useState(false);
  const [totalMatters, setTotalMatters] = useState(0); // Total des matières
  const perPage = 10; // Nombre d'éléments par page
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

  // Charger les matières au montage ou lorsque les dépendances changent

  const fetchAllMatters = async () => {
    setLoading(true);
    try {
      const response = await fetchMatters(page, search);
      if (response && response.matters) {
        const validMatters = response.matters.filter((matter) => !matter.is_delete);
        setMatters(validMatters);
        setTotalMatters(response.total); // Total des matières
        setTotalPages(Math.ceil(response.total / perPage)); // Calcul du total des pages
      } else {
        setMatters([]);
        setTotalMatters(0);
        setTotalPages(0);
        console.warn("Les données reçues ne sont pas valides :", response);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des administrateurs.");
      setMatters([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAllMatters();
  }, [page, search]);

  //fonction pour gérer le changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Ouverture/fermeture du modal pour ajout/modification
  const toggleAddEditDialog = (matter: Matter | null = null) => {
    setSelectedMatter(matter); // Définit l'admin sélectionné ou réinitialise à null
    setIsAddEditDialogOpen(!isAddEditDialogOpen);
  };

  // Ajouter ou modifier une matière

  // Gérer la soumission du formulaire
  const handleAddEditMatter = async (values: MatterFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    setLoading(true);
    try {
      if (selectedMatter) {
        // Modification
        await updateMatter(selectedMatter.id, values.name, values.credit, values.code);
        toast.success("Matière mis à jour avec succès.");
      } else {
        // Ajout
        await addMatter(values.name, values.credit, values.code);
        toast.success("Matière ajoutée avec succès.");

      }
      resetForm();
      setIsAddEditDialogOpen(false);
      fetchAllMatters();
    } catch (error) {
      toast.error("Erreur lors de la soumission du formulaire.");
    } finally {
      setLoading(false);
    }
  };


  // Ouvrir le modal pour afficher les détails
  const handleViewDetails = async (id: number) => {
    try {
      const details = await fetchMatterDetails(id);
      setMatterDetails({ ...details });
      setIsDetailsDialogOpen(true);
    } catch (error) {
      toast.error("Erreur lors de la récupération des détails.");
    }
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-xl">Matières</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <motion.div className="py-6 space-y-6"
       initial="hidden"
       animate="visible"
       variants={containerVariants}
      >
        <Toaster />
        {/* Barre de recherche et bouton */}
        <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
      >
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
           placeholder="Rechercher par nom matière"
           value={search}
           onChange={(e) => setSearch(e.target.value)}
           className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
         />
       </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <ImportExcelMatters onImportSuccess={fetchAllMatters} />
          <Button
            variant="primary"
            
            onClick={() => toggleAddEditDialog()}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter Matière
          </Button>
        </div>
      </motion.div>

        {/* Tableau des matières */}
        <motion.div variants={itemVariants}>
          <Table className="w-full border-collapse  rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900">
            <TableHeader style={{backgroundColor:theme.primaryColor, color:theme.textColor }} className="">
              <TableRow>
                <TableCell className="p-3 text-left font-semibold">
                  Nom et  slug de la Matière
                </TableCell>
                <TableCell className="p-3 text-left font-semibold">
                  Crédit
                </TableCell>
                <TableCell className="p-3 text-center font-semibold">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-3 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="spinner">
                        <span className="dark:text-white" >Chargement...</span>
                        <div className="half-spinner"></div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : matters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-3 text-center text-gray-600 dark:text-white">
                    Aucune donnée disponible
                  </TableCell>
                </TableRow>
              ) : (
                matters.map((matter) => (
                  <TableRow
                    key={matter.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm divide-x divide-gray-300 dark:divide-gray-700"
                  >
                    <TableCell className="p-3 text-left text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">{matter.name}  </span> --
                      <span className="text-sm text-gray-500 dark:text-gray-400 ">
                        {matter.slug}
                      </span>
                    </TableCell>
                    <TableCell className="p-3 text-left dark:text-gray-300">
                      {matter.credit}
                    </TableCell>
                    <TableCell className="p-3 text-center flex justify-center items-center">
                      <Button className="mr-2"
                        size="sm"
                        variant="primary"
                        onClick={() => toggleAddEditDialog(matter)}
                      >
                        <PencilSquareIcon className="h-5 w-5 mx-auto" />
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleViewDetails(matter.id)}
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
        {/*
          <div className="text-sm text-gray-500">
            Nombre total de matières : {totalMatters}
          </div>
        */}
        {matters.length > 0 && (
          <Pagination>
            <PaginationContent className="mt-4">
              {/* Bouton Précédent */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page - 1);
                  }}
                />
              </PaginationItem>
              {/* Numéros de pages */}
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(index + 1);
                    }}
                    isActive={page === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {/* Bouton Suivant */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </motion.div>

      {/* Dialog pour ajouter/modifier une matière */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent aria-describedby="details-description">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-50 text-gray-800">
              {selectedMatter ? "Modifier la Matière" : "Ajouter une Matière"}
            </DialogTitle>
          </DialogHeader>

          <Formik<MatterFormValues>
            initialValues={{
              name: selectedMatter?.name || "",
              credit: selectedMatter?.credit ? Number(selectedMatter.credit) : 0,
              code: selectedMatter?.code || "",
            }}
            validationSchema={Yup.object({
              name: Yup.string()
                .required("Nom requis"),
              credit: Yup.number()
                .transform((value, originalValue) => (originalValue === "" ? undefined : Number(originalValue)))
                .required("Crédit requis")
                .positive("Le crédit doit être un nombre positif"),
              code: Yup.string().required("Code requis")
            })}
            onSubmit={handleAddEditMatter}
          >
            {({ isSubmitting }) => (
              <Form>
                <div>
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-50 pb-4">
                    Nom de la Matière
                  </label>
                  <Field name="name" as={Input} placeholder="Nom " className="block mb-" />
                  <ErrorMessage name="name" component="div" className="text-red-500" />
                </div>

                <div>
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-50 my-4">
                    Code
                  </label>
                  <Field name="code" as={Input} placeholder="Code" className="block mt-4" />
                  <ErrorMessage name="code" component="div" className="text-red-500" />
                </div>

                <div>
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-50 my-4">
                    Crédit
                  </label>
                  <Field name="credit" as={Input} type="number" placeholder="Crédit" className="block my-4" />
                  <ErrorMessage name="credit" component="div" className="text-red-500" />
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
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

      {/* Dialog pour afficher les détails d'une matière */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent aria-describedby="details-description">
          <DialogHeader>
            <DialogTitle>Détails de la Matière</DialogTitle>
          </DialogHeader>
          {matterDetails ? (
            <div id="details-description" className="space-y-4">
              <div>
                <strong>Nom :</strong> {matterDetails.name}
              </div>
              <div>
                <strong>Crédit :</strong> {matterDetails.credit}
              </div>
              <div>
                <strong>Slug :</strong> {matterDetails.slug}
              </div>
            </div>
          ) : (
            <p>Chargement des détails...</p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Matieres;
