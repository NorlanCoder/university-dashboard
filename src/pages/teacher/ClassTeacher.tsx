import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination';
import { Table, TableBody,  TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Class, Courses, fetchClasses } from '@/api/teacher/classes';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { RootState } from '@/app/store';
import { EyeIcon } from 'lucide-react';
import "@/css/Loader.css";

const ClassTeacher: React.FC = () => {

  const [search, setSearch] = useState("");
  // const [inputValue, setInputValue] = useState("");
  // const [courses, setCourses] = useState<Courses[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  // const [totalCourses, setTotalCourses] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const navigate = useNavigate();


  // Charger les classes
  const loadClasses = async () => {
    setLoading(true);
    try {
      const response = await fetchClasses(page,  search);
  
      if(response&& response.classrooms) {
        const validClasses = response.classrooms.filter(
          (classe: Class) => !classe.is_delete,
        );
        setClasses(validClasses);
        setTotalClasses(response.total);
        setTotalPages(Math.ceil(response.total/perPage));
      } else { 
        setClasses([]);  
        setTotalClasses(0); 
        setTotalPages(0);
        console.warn("Les données reçues ne sont pas valides :", response);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des cours.");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  
  // Charger les courses
  

  useEffect(() => {
    loadClasses();
  }, [page, search]);

  // Changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };


  const handleNavigate = (classe: Class) => {
    navigate(`/classes/${classe.id}/filieres`, { state: { classData: classe } });
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Filières</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>


      <div className="py-4 pt-12">
        <Toaster />
        <div className="flex items-center justify-between mb-6">
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm"
          />
        </div>


        {loading ? (
          <div className="flex justify-center items-center">
            <div className="spinner">
              <span className='dark:text-white'>Chargement...</span>
              <div className="half-spinner">
              </div>
            </div>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-white pt-16">
            Aucune donnée pour promotion.
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {classes.map((classe) => (
              <div key={classe.id} className="card cursor-pointer hover:shadow-md border bg-white hover:scale-105 transition-all duration-300" onClick={() => handleNavigate(classe)}>
                <div className="p-3">
                  <span className="font-semibold text-2xl">{classe.name}</span>
                  <div className="py-2">
                    <p className="subtitle ">Niveau: {classe.level}</p>
                    <p className="">Effectif: {classe.Student?.length}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {classes.length > 0 && (
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
      </div>
    </>
  )
}

export default ClassTeacher