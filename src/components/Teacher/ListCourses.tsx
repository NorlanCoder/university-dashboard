import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

import { EyeIcon } from '@heroicons/react/24/solid';
import { Courses, fetchCourses } from '@/api/teacher/classes'; 
import toast, { Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';

interface ListeCoursesProps {
  classId: number;
  nameClass: string;
}

const ListeCourses: React.FC<ListeCoursesProps> = ({ classId, nameClass }) => {

  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<Courses[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 10;
  // const [selectedCourse, setSelectedCourse] = useState<Courses | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();


  const loadCourses = async (id: number, page: number) => {
    setLoading(true);
    try {
      const response = await fetchCourses(id, page,  search);
  
      if(response && response.courses) {
        const validCourses = response.courses
        setCourses(validCourses);
        setTotalCourses(response.total);
        setTotalCourses(response.total);
        setTotalPages(Math.ceil(response.total/perPage));
      } else { 
        setCourses([]);  
        setTotalCourses(0); 
        setTotalPages(0);
        console.warn("Les données reçues ne sont pas valides :", response);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des cours.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      loadCourses(classId, page);
    }
  }, [classId, page, search]);


  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleNavigate = (course: Courses) => {
    navigate(`/teacher/${classId}/course/${course.id}/students`, { state: { courseData: course, nameclassData: nameClass  } });
  };

  
  return (
    <>
      <div className="py-4">
        <Toaster />
        <div className="flex items-center justify-between mb-6">
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm"
          />
        </div>

        <Table className="w-full border-collapse rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900">
          <TableHeader className="bg-slate-800 dark:bg-gray-50">
            <TableRow>
              <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                Nom du cours
              </TableCell>
              <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                Credit
              </TableCell>
              <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                UE
              </TableCell>
              <TableCell className="p-3 text-center text-white font-semibold dark:text-black">
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
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-3 text-center text-gray-600 dark:text-white">
                  Aucune donnée disponible
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm divide-x divide-gray-300 dark:divide-gray-700">
                  <TableCell className="p-3 text-left dark:text-gray-300">
                    {course.matter.name}
                  </TableCell>
                  <TableCell className="p-3 text-left dark:text-gray-300">
                    {course.matter.credit}
                  </TableCell>
                  <TableCell className="p-3 text-left dark:text-gray-300">
                    {course.ue.name}
                  </TableCell>
                  <TableCell className="p-3 text-center dark:text-gray-300">
                    <Button variant="default" size="sm" onClick={() => handleNavigate(course)}>
                      <EyeIcon className="w-4 h-4" /> Voir détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {courses.length > 0 && (
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

export default ListeCourses