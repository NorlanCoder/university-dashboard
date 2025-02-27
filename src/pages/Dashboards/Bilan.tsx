import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from '@/components/ui/dialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { fetchPromo, updatePromo, addPromo } from '@/api/promos';
import toast, { Toaster } from 'react-hot-toast';
import { PlusIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import "@/css/Loader.css";
import ImportExcelPromos from '@/components/ExcelData/ImportExcelPromos';
import { motion } from "framer-motion";
import { useTheme } from "@/components/context/ThemeContext";
export interface Promo {
  id: number;
  name: string;
  slug: string;
  schoolId: number;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
}

const Bilan: React.FC = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPromo, setTotalPromo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [promoName, setPromoName] = useState('');
  const perPage = 10;
  const navigate = useNavigate();

const {theme} = useTheme();
  /*Animation Cards */
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Intervalle entre l'apparition de chaque carte
      },
    },
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring", // Animation fluide
        stiffness: 50,  // Rigidité pour l'effet spring
        damping: 10,    // Amorti pour une transition douce
      },
    },
  };

  // Charger les promotions
  const loadPromos = async () => {
    setLoading(true);
    try {
      const response = await fetchPromo(page, search);
      if (response && response.promos) {
        const validPromos = response.promos.filter(
          (prom: Promo) => !prom.is_delete,
        );
        setPromos(validPromos);
        setTotalPromo(response.total);
        setTotalPages(Math.ceil(response.total / perPage));
      } else {
        setPromos([]);
        setTotalPromo(0);
        setTotalPages(0);
        console.warn('Données non valides :', response);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des promotions.');
      setPromos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromos();
  }, [page, search]);

  // Changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Ouverture/fermeture du modal pour ajout/modification
  const toggleAddEditDialog = (promo: Promo | null = null) => {
    setSelectedPromo(promo);
    setPromoName(promo ? promo.name : '');
    setIsAddEditDialogOpen(!isAddEditDialogOpen);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (selectedPromo) {
        // Modification
        await updatePromo(selectedPromo.id, promoName);
        toast.success('Promotion mise à jour avec succès.');
      } else {
        // Ajout
        await addPromo(promoName);
        toast.success('Promotion ajoutée avec succès.');
      }
      setIsAddEditDialogOpen(false);
      loadPromos();
    } catch (error) {
      toast.error('Erreur lors de la soumission du formulaire.');
    } finally {
      setLoading(false);
    }
  };

  // Gérer la navigation vers page classes
  const handleNavigate = (promo: Promo) => {
    navigate(`/bilan/${promo.id}/filieres`);
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
       variants={containerVariants}
       initial="hidden"
       animate="show"
      >
        <Toaster />

        <motion.div  variants={cardVariants}
         className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            
             <div className="flex items-center relative w-full max-w-sm">
               <span style={{color:theme.primaryColor}} className="absolute left-3 ">
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
                           placeholder="Rechercher par nom"
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                         />
             </div>

        <div  className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <ImportExcelPromos onImportSuccess={loadPromos} />
          <Button
            variant="primary"
            
            onClick={() => toggleAddEditDialog()}
            >
            <PlusIcon className="h-5 w-5 mr-2 " />
            Ajouter une Promo
          </Button>
            </div>
        </motion.div>
     
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="spinner">
            <span className='dark:text-white'>Chargement...</span>
            <div className="half-spinner">
            </div>
          </div>
        </div>
      ) : promos.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-white pt-16">
          Aucune donnée pour promotion.
        </div>
      ) : (
        <>
          <motion.div    
           variants={containerVariants}
          initial="hidden"
          animate="show"  
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-8 mx-2">
            {promos.map((promo) => (
              <motion.div     variants={cardVariants} 
              className="max-w-xs bg-white border border-gray-200 rounded-lg shadow cursor-pointer z-40 scale-105" onClick={() => handleNavigate(promo)}>
                <div className="relative py-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAddEditDialog(promo)
                    }}
                    className="absolute right-2 top-2 p-1.5 z-50 bg-[#1c2434] text-white hover:text-gray hover:shadow-lg hover:scale-110 transition-all duration-300 rounded-full hover:bg-opacity-95"
                  >
                    <PencilSquareIcon className="h-5 w-5 mx-auto" />
                  </button>

                  <div className="group flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24"><g fill="none" stroke="#1c2434" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
                      <path d="M14 22v-4a2 2 0 1 0-4 0v4" /><path d="m18 10l3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10m12-5v17M4 6l7.106-3.553a2 2 0 0 1 1.788 0L20 6M6 5v17" /><circle cx="12" cy="9" r="2" /></g>
                    </svg>
                  </div>
                </div>
                <div className="p-3">
                  <h5 className="mb-2 text-xl font-bold tracking-tight text-center text-gray-900 transition-all duration-300 group-hover:underline hover:underline">{promo.name}</h5>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}

      {promos.length > 0 && (
        <Pagination>
          <PaginationContent className="mt-4">
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
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


      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {selectedPromo
                ? 'Modifier la promotion'
                : 'Ajouter une nouvelle promotion'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Input
              placeholder="Nom de la promotion"
              value={promoName}
              onChange={(e) => setPromoName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading}
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
        </DialogContent>
      </Dialog>
      </motion.div>
    </>
  );
};

export default Bilan;
