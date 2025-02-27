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
import { listCourse, Bilan, Note } from "@/api/student/bilan";
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
import { EyeIcon } from "@heroicons/react/24/solid";


const ClassCourses: React.FC = () => {

  {/* Utils*/ }
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalNote, setTotalNote] = useState(0);
  const [bilan, setBilan] = useState<Bilan | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const { classId } = useParams<{ classId: string }>(); // Récupère classId de l'URL
  const navigate = useNavigate();


  const perPage = 10;
  const loadCourses = async () => {
    if (!classId) {
      toast.error('ID de classe manquant.');
      return;
    }
    setLoading(true);
    try {

      const response = await listCourse(Number(classId), page, search);
      if (response && response.bilan) {
        setBilan(response.bilan);
        setNotes(response.notes);
        setTotalNote(response.total);
        setTotalPages(Math.ceil(totalNote / perPage));
      } else {
        setBilan(response.bilan);
        setNotes([]);
        setTotalNote(0);
        setTotalPages(0);
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
    navigate(`/student/bilan/${classId}/course/${courseId}`);
  };
  const handleNavigateBulletin = (classId: number) => {
    navigate(`/student/bilan/${classId}/summary`);
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink><Link to="/student/bilan">Bilan</Link> </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Année Universitaire {bilan?.class.promo.name!}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>
      <div className="container mx-auto p-4">
        <Toaster />

        {/* Boutons Semestre */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader
              className="cursor-pointer transition-shadow"
            >
              <div className="col-span-3 flex items-center justify-center">
                <CardTitle className="text-lg font-semibold">
                  <div className="flex justify-center text-center font-semibold text-xl uppercase mb-4">
                    Semestre 1
                  </div>
                  Moyenne: {bilan?.sem1 != null ? bilan?.sem1.moy : 'Néant'}
                  <br />
                  Crédit: {bilan?.sem1 != null ? bilan?.sem1.credits + '/' + bilan?.sem1.totals : 'Néant'}
                </CardTitle>
              </div>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader
              className="cursor-pointer transition-shadow"
            >
              <div className="col-span-3 flex items-center justify-center">
                <CardTitle className="text-lg font-semibold">
                  <div className="flex justify-center text-center font-semibold text-xl uppercase mb-4">
                    Semestre 2
                  </div>
                  Moyenne: {bilan?.sem2 != null ? bilan?.sem2.moy : 'Néant'}
                  <br />
                  Crédit: {bilan?.sem2 != null ? bilan?.sem2.credits + '/' + bilan?.sem2.totals : 'Néant'}
                </CardTitle>
              </div>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader
              className="cursor-pointer transition-shadow"
            >
              <div className="col-span-3 flex items-center justify-center">
                <CardTitle className="text-lg font-semibold">
                  <div className="flex justify-center text-center font-semibold text-xl uppercase mb-4">
                    Annuel
                  </div>
                  Moyenne: {bilan?.total != null ? bilan?.total.moy : 'Néant'}
                  <br />
                  Crédit: {bilan?.total != null ? bilan?.total.credits + '/' + bilan?.total.totals : 'Néant'}
                </CardTitle>
              </div>
            </CardHeader>
          </Card>
        </div>
        {loading ?
          <div className="flex justify-center items-center">
            <div className="spinner text-center">
              <span className="dark:text-white">Chargement...</span>
              <div className="half-spinner"></div>
            </div>
          </div> :
          <div className="my-5 px-4">
            <button onClick={() => handleNavigateBulletin(bilan?.classId!)}
              className="w-full py-2 px-3 rounded-lg text-white font-semibold text-lg bg-primary hover:bg-blue-700 focus:outline-none"
            >
              Récapitulatif
            </button>
          </div>
        }


        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <Input
              placeholder="Rechercher par Prof, Matière et Ue"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm"
            />
          </div>

          <Table className="w-full border-collapse rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900">
            <TableHeader className="bg-slate-800 dark:bg-gray-50">
              <TableRow>
                <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                  Cours
                </TableCell>
                <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                  Contrôle
                </TableCell>
                <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                  Examen
                </TableCell>
                <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                  Moyenne
                </TableCell>
                <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                  Statut
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
              ) : notes.length > 0 ? (
                notes.map((note) => (
                  <TableRow
                    key={note.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm"
                  >
                    <TableCell className="p-3 font-semibold text-left dark:text-gray-50">
                      {note.course.teacher.name} (Semestre {note.course.ue.semester}) <br />
                      {note.course.ue.name} ({note.course.ue.credit} crédits)<br />
                      {note.course.matter.name}({note.course.matter.credit} crédits)
                    </TableCell>
                    <TableCell className="p-3 text-center">
                      {note.control !== null ? note.control : '-'}
                    </TableCell>
                    <TableCell className="p-3 text-left">
                      <div className="flex  items-center justify-between gap-4">
                        <div>{note.exam !== null ? note.exam : '-'}</div>
                      </div>
                    </TableCell>
                    <TableCell className="p-3 text-center">
                      {note.moy !== null ? note.moy.toFixed(2) : '-'}
                    </TableCell>
                    <TableCell className="p-3 text-center">
                      {note.is_validate ? (
                        <button className="bg-green-600 py-1 px-2 rounded-lg text-white">Validé</button>
                      ) : (
                        <button className="bg-red-600 py-1 px-2 rounded-lg text-gray-50">Non-validé</button>
                      )} <br />
                      <button className="bg-black p-1 mt-1 rounded-lg text-gray-50" onClick={() => handleNavigate(Number(classId!), note.courseId)}>
                        <EyeIcon className="h-5 w-5" />
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
          {notes.length > 0 && (
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

export default ClassCourses;