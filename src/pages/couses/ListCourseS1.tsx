import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {Breadcrumb,BreadcrumbItem,BreadcrumbLink,BreadcrumbList,BreadcrumbPage,BreadcrumbSeparator,} from "@/components/ui/breadcrumb"
import { Link } from "react-router-dom"; 
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {Table,TableBody,TableCell,TableHeader,TableRow} from '@/components/ui/table';
import {EyeIcon} from '@heroicons/react/24/solid';
import {  fetchCoursesBySemestre,  fetchListCourse,  Course} from '@/api/Classroom/ListCourses';
import { motion } from "framer-motion";
import { useTheme } from "@/components/context/ThemeContext";
import toast, { Toaster } from 'react-hot-toast';

const ListCoursesS1: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const [CoursesSemestre, setCoursesSemestre] = useState<Course[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCourseS1, setTotalCourseS1] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [ClassName, setClassName] = useState<string | null>(null);
  const perPage = 10; 

  const { theme } = useTheme();

  const navigate = useNavigate();

  const handleViewStudents = (course: Course) => {
    // Navigation dynamique vers la page StudentByCourse
    navigate(`/bilan/class/${classId}/course/${course.id}/students`);
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

// Récupération du nom de la promotion
  useEffect(() => {
    const loadClassName = async () => {
      if (classId) {
        try {
          const promoDetails = await fetchListCourse(classId!);
          setClassName(promoDetails.name);
        } catch (error) {
          console.error('Erreur lors du chargement du nom de la promotion:', error);
        }
      }
    };

    loadClassName();

  }, [classId]);


  const loadCoursesSemestre = async () => {
    if (!classId) {
      toast.error('ID de classe manquant.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetchCoursesBySemestre(classId,1,page,search);
      if (response && response.courses)
         {
          const validCourseSmes=response.courses;
          setCoursesSemestre(validCourseSmes);
          setTotalCourseS1(response.total);
          setTotalPages(Math.ceil(response.total / perPage));
          
      } else {
         setCoursesSemestre([]);
         setTotalCourseS1(0);
         setTotalPages(0);
        console.warn('Données non valides :', response);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des cours semestre 1.');
     
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
      if (classId) {
        loadCoursesSemestre();
      }
    }, [classId,search, page]);

      // Changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <>
          {loading ? (
        <p>Chargement...</p>
      ) : ( 
     <Breadcrumb>
          <BreadcrumbList>
   
            <BreadcrumbItem>
            <BreadcrumbLink >Filière</BreadcrumbLink>
            </BreadcrumbItem>    
            <BreadcrumbSeparator />
            <BreadcrumbItem>
            <BreadcrumbLink > {ClassName ? ClassName : 'Chargement'}</BreadcrumbLink>
            </BreadcrumbItem>   
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/bilan/filiere/${classId}/cours`}>cours</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>cours semestre 1</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      ) }

      <motion.div className="container mx-auto p-4 pt-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
      >
        <Toaster />
        
            <motion.div variants={itemVariants}  className="flex items-center  mb-6">
            <div className="flex items-center relative w-full max-w-sm">
            <span style={{color:theme.primaryColor}}  className="absolute left-3 ">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>
         </span>
              <Input
                placeholder="Rechercher par nom ou matricule dans Semestre 1"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              </div>
            </motion.div>
  
          <motion.div  variants={itemVariants}>
            <Table className="w-full border-collapse  rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900">
              <TableHeader style={{backgroundColor:theme.primaryColor, color:theme.textColor }} 
              className="">
                <TableRow  className="divide-x divide-gray-300 dark:divide-gray-700" >
                  <TableCell className="p-3 text-left  font-semibold ">
                    Enseignant S1
                  </TableCell>
                  <TableCell className="p-3 text-left  font-semibold  ">
                    Matière S1
                  </TableCell>
                  <TableCell className="p-3 text-left  font-semibold ">
                    UE S1
                  </TableCell>
                  <TableCell className="p-3 text-left  font-semibold  flex justify-center items-center divide-x divide-gray-300 dark:divide-gray-700">
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
              <span className='dark:text-white'>Chargement...</span>
              <div className="half-spinner"></div>
            </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : CoursesSemestre && CoursesSemestre.length > 0 ? (
                CoursesSemestre.map((course: Course) => (
                  <TableRow
                    key={course.id}
                    className="text-black-2 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm "
                  >
                    <TableCell className="p-3 font-semibold text-left dark:text-gray-200">
            {course.teacher?.matricule || 'Inconnu'} <br />
            {course.teacher?.name || 'Inconnu'}
                    </TableCell>
                    <TableCell className="p-3 text-md font-medium text-left dark:text-gray-300">
            {course.matter.name || 'Néant'}
                    </TableCell>
                    <TableCell className="p-3 text-md font-medium text-left dark:text-gray-300">
            {course.ue.name || 'Néant'}
                    </TableCell>
            
                    <TableCell className="p-3 text-center flex items-center justify-center">
            <Button variant="default" size="sm" onClick={() => handleViewStudents(course)}>
              <EyeIcon className="w-4 h-4" /> Voir détails
            </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) :  CoursesSemestre.length===0 && search ? (
                <TableRow>
                <TableCell colSpan={5} className="p-3 text-center text-gray-600 dark:text-white">
                  Aucun cours trouvé pour "<strong>{search}</strong>".
                </TableCell>
              </TableRow>
                ) 
                : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="p-3 text-center text-gray-500 "   >
                   <Button     variant="destructive" className="px-2 py-2 dark:bg-slate-800 dark:text-red-500">
            Aucune donnée disponible
                    </Button>
            
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            </Table>
          </motion.div>


          {CoursesSemestre.length > 0 && (
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
    </>
  );
};

export default ListCoursesS1;
