import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { EyeIcon, PlusIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { fetchMembersByRole, addMember, updateMember, fetchMemberDetails } from "@/api/members";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import ImportExcelMembers from "@/components/ExcelData/ImportExcelMembers";
import { motion } from "framer-motion";
import { useTheme } from "@/components/context/ThemeContext";

export interface Member {
  id: number;
  matricule: string;
  name: string;
  email: string | null;
  phone: string | null;
  photo: string | null;
  password?: string;
  role: string;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  schoolId: number;
}

interface AdminFormValues {
  name: string;
  email: string;
  phone: string;
}


const Admin: React.FC = () => {
  const [admins, setAdmins] = useState<Member[]>([]);
  const [adminDetails, setAdminDetails] = useState<Member | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<Member | null>(null);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [loading, setLoading] = useState(false);

    const { theme } = useTheme();

  const perPage = 10; // Nombre d'administrateurs par page

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

  // Charger les administrateurs

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const response = await fetchMembersByRole("admin", page, search);
      if (response && response.persons) {
        const validAdmins = response.persons.filter((admi) => !admi.is_delete);
        setAdmins(validAdmins);
        setTotalAdmin(response.total);
        setTotalPages(Math.ceil(response.total / perPage));
      } else {
        setAdmins([]); 
        setTotalAdmin(0);
        setTotalPages(0);
        console.warn("Les données reçues ne sont pas valides :", response);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des administrateurs.");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadAdmins();
  }, [page, search]);

  // Changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Ouverture/fermeture du modal pour ajout/modification
  const toggleAddEditDialog = (admin: Member | null = null) => {
    setSelectedAdmin(admin); // Définit l'admin sélectionné ou réinitialise à null
    setIsAddEditDialogOpen(!isAddEditDialogOpen);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (values: AdminFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    setLoading(true);
    try {
      if (selectedAdmin) {
        // Modification
        await updateMember(selectedAdmin.id, values.name, "admin", values.phone, values.email);
        toast.success("Administrateur mis à jour avec succès.");
      } else {
        // Ajout
        await addMember(values.name, "admin", values.phone, values.email);
        toast.success("Administrateur ajouté avec succès.");
      }
      resetForm();
      setIsAddEditDialogOpen(false);
      loadAdmins();
    } catch (error) {
      toast.error("Erreur lors de la soumission du formulaire.");
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir le modal pour afficher les détails
  const handleViewDetails = async (id: number) => {
    try {
      const details = await fetchMemberDetails(id);
      setAdminDetails({ ...details });
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
            <BreadcrumbLink className="text-xl">Promotions</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <motion.div className="py-6 space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Toaster />

        <motion.div    variants={itemVariants}  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center relative w-full max-w-sm">
            <span style={{color:theme.primaryColor}}  className="absolute left-3">
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
        
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <ImportExcelMembers role="admin" onImportSuccess={loadAdmins} />
            <Button variant="primary"  onClick={() => toggleAddEditDialog()}>
              <PlusIcon className="  h-5 w-5 mr-2" />
              Ajouter administrateur
            </Button>
          </div>
        </motion.div>

        {/* Tableau */}
        <motion.div   variants={itemVariants}>
          <Table className="w-full border-collapse  rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900">
            <TableHeader style={{backgroundColor:theme.primaryColor, color:theme.textColor }} className="">
              <TableRow className="divide-x divide-gray-300 dark:divide-gray-700" >
                <TableCell className="p-3 text-left font-semibold   ">Matricule</TableCell>
                <TableCell className="p-3 text-left font-semibold ">Nom complet</TableCell>
                <TableCell className="p-3 text-left font-semibold ">Email</TableCell>
                <TableCell className="p-3 text-left  font-semibold">Téléphone</TableCell>
                <TableCell className="p-3 text-left  font-semibold flex justify-center items-center">Actions</TableCell>
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
              ) : admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-3 text-center text-gray-600 dark:text-white">
                    Aucune donnée disponible
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm divide-x divide-gray-300 dark:divide-gray-700">
                    <TableCell className="p-3 text-left dark:text-gray-300">{admin.matricule}</TableCell>
                    <TableCell className="p-3 text-left dark:text-gray-300">{admin.name}</TableCell>
                    <TableCell className="p-3 text-left dark:text-gray-300">{admin.email}</TableCell>
                    <TableCell className="p-3 text-left dark:text-gray-300">{admin.phone}</TableCell>
                    <TableCell className="p-3 text-center flex justify-center items-center">
                      <Button className="mr-2"
                        size="sm"
                        variant="primary"
                        onClick={() => toggleAddEditDialog(admin)}
                      >
                        <PencilSquareIcon className="h-5 w-5 mx-auto" />
                      </Button>
                      <Button size="sm" variant="default" onClick={() => handleViewDetails(admin.id)}>
                        <EyeIcon className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>


        {admins.length > 0 && (
          <Pagination >
            <PaginationContent className="mt-4">
              <PaginationItem>
                <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink onClick={() => handlePageChange(index + 1)} isActive={page === index + 1}>
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


      {/* Modals */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAdmin ? "Modifier" : "Ajouter"} un administrateur</DialogTitle>
          </DialogHeader>
          <Formik<AdminFormValues>
            initialValues={{
              name: selectedAdmin?.name || "",
              email: selectedAdmin?.email || "",
              phone: selectedAdmin?.phone || "",
            }}
            validationSchema={Yup.object({
              name: Yup.string().matches(/^[A-Za-z\s]+$/, "Le nom ne doit contenir que des lettres.").required("Nom requis"),
              email: Yup.string().email("Email invalide"),

            })}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field name="name" as={Input} placeholder="Nom complet" />
                <ErrorMessage name="name" component="div" className="text-red-500" />
                <Field name="email" as={Input} placeholder="Email" className=" block mt-4" />
                <ErrorMessage name="email" component="div" className="text-red-500" />
                <Field name="phone" as={Input} placeholder="Téléphone" className=" block my-4" />
                <ErrorMessage name="phone" component="div" className="text-red-500" />
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

      <Dialog open={isDetailsDialogOpen} onOpenChange={() => setIsDetailsDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails administrateur</DialogTitle>
          </DialogHeader>
          {adminDetails ? (
            <div>
              <p className="mb-2"><strong>Matricule :</strong> {adminDetails.matricule}</p>
              <p className="mb-2"><strong>Nom :</strong> {adminDetails.name}</p>
              <p className="mb-2"><strong>Email :</strong> {adminDetails.email}</p>
              <p><strong>Téléphone :</strong> {adminDetails.phone}</p>
            </div>
          ) : (
            <p>Chargement des détails...</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Admin;
