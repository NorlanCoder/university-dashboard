import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import toast, { Toaster } from "react-hot-toast";
import { NotePerson, Document, supportCourse } from "@/api/student/bilan";
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { DocumentIcon } from "@heroicons/react/24/solid";


const DocumentClass: React.FC = () => {

  {/* Utils*/ }
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalSupport, setTotalSupport] = useState(0);
  const [note, setNote] = useState<NotePerson | null>(null);
  const [supports, setSupports] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const { classId, courseId } = useParams<{ classId: string, courseId: string }>();
  const navigate = useNavigate();

  const perPage = 10;
  const loadCourses = async () => {
    if (!classId || !courseId) {
      toast.error('Invalid');
      return;
    }
    setLoading(true);
    try {
      const response = await supportCourse(Number(classId), page, search, Number(courseId));
      if (response && response.supports) {
        setNote(response.note);
        setSupports(response.supports);
        setTotalSupport(response.total);
        setTotalPages(Math.ceil(totalSupport / perPage));
      }

    } catch (error) {
      toast.error('Erreur lors de chargement.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadCourses();
  }, [page, search, classId]);


  // Changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleNavigate = (classId: number, courseId: number) => {
    navigate(`/student/note/${classId}/course/${courseId}`);
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/student/bilan">Bilan</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink><Link to={`/student/bilan/${Number(classId)}`}>Année Universitaire {note?.course?.class.promo.name!}</Link> </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink >{note?.course?.teacher.name}({note?.course?.matter.name})</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>
      <div className="container mx-auto p-4">
        <Toaster />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader
              className="cursor-pointer transition-shadow"
            >
              <div className="col-span-3 flex items-center justify-center">
                <CardTitle className="text-lg font-semibold">
                  <div className="flex justify-center text-center font-semibold text-xl uppercase mb-4">
                    Prof: {note?.course?.teacher.name}
                  </div>
                  UE: {note?.course?.ue.name}({note?.course?.ue.credit} crédits)
                  <br />
                  Matière: {note?.course?.matter.name}({note?.course?.matter.credit} crédits)
                </CardTitle>
              </div>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow  bg-black dark:bg-white text-white dark:text-black">
            <CardHeader
              className="cursor-pointer transition-shadow"
            >
              <div className="col-span-3 flex items-center justify-center">
                <CardTitle className="text-lg font-semibold">
                  <div className="flex justify-center text-center font-semibold text-xl uppercase mb-4">
                    Moyenne: {note?.moy ? note?.moy : 'Néant'}
                  </div>
                  Note: {note?.note && note?.note.length > 0
                    ? note?.note.map((n) => `${n}/20`).join(' , ')
                    : 'Aucune note'}
                  <br />
                  Examen: {note?.exam ? note?.exam : 'Néant'}
                </CardTitle>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <Input
              placeholder="Rechercher par titre, description"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm"
            />
          </div>

          <Table className="w-full border-collapse rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900">
            <TableHeader className="bg-slate-800 dark:bg-gray-50">
              <TableRow>
                <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                  Title
                </TableCell>
                <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                  Contenu
                </TableCell>
                <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                  Date
                </TableCell>
                <TableCell className="p-3 text-left text-white font-semibold dark:text-black">

                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
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
              ) : supports.length > 0 ? (
                supports.map((support) => (
                  <TableRow
                    key={support.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm"
                  >
                    <TableCell className="p-3 font-semibold text-left dark:text-gray-50">
                      {support.title}
                    </TableCell>
                    <TableCell className="p-3 text-center">
                      {support.content}
                    </TableCell>
                    <TableCell className="p-3 text-left">
                      {support.createdAt}
                    </TableCell>
                    <TableCell className="p-3 text-center">
                      <button className="bg-black p-1 mt-1 rounded-lg text-gray-50" onClick={() => handleNavigate(Number(classId!), support.courseId)}>
                        <DocumentIcon className="h-5 w-5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="p-3 text-center text-gray-600 dark:text-white"
                  >
                    Aucune donnée disponible
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Pagination */}
          {supports.length > 0 && (
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
        </div>

      </div>
    </>
  );
};

export default DocumentClass;