import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import toast, { Toaster } from "react-hot-toast";
import { Summary, Bilan, listCourse, listsummary } from "@/api/student/bilan";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';


const SummaryStudent: React.FC = () => {

  {/* Utils*/ }
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(false);
  const [bilan, setBilan] = useState<Bilan | null>(null);
  const { classId } = useParams<{ classId: string }>(); // Récupère classId de l'URL

  const loadCourses = async () => {
    if (!classId) {
      toast.error('ID de classe manquant.');
      return;
    }
    setLoading(true);
    try {

      const title = await listCourse(Number(classId), 1, '');
      if (title && title.bilan) {
        setBilan(title.bilan);
      }

      const response = await listsummary(Number(classId));
      if (response) {
        setSummaries(response);
      }


    } catch (error) {
      toast.error('Erreur lors de chargement.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadCourses();
  }, [classId]);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/student/bilan">Bilan</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink><Link to={`/student/bilan/${Number(classId)}`}>Année Universitaire {bilan?.class.promo.name!}</Link> </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink >Récapitulatif</BreadcrumbLink>
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
        <div className="mt-10">

          {loading ? (
            <Table className="w-full border-collapse rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900">

              <TableBody>
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

              </TableBody>
            </Table>
          ) : summaries.length > 0 ? (
            summaries.map((summary) => (
              <Table className="w-full border-collapse rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900 mt-5">
                <TableBody>
                  <TableRow key={summary.id} className="bg-primary text-white dark:hover:bg-gray-700 hover:shadow-sm" >
                    <TableCell
                      colSpan={3} className="p-3 font-semibold text-center dark:text-gray-50">
                      {summary.sem} ({summary.moy ? summary.moy.credits + ' crédits' : ''} )<br />
                    </TableCell>
                    <TableCell
                      colSpan={3} className="p-3 text-center">
                      {summary.moy ? (summary.moy.moy + ' ' + summary.moy.credits + '/' + summary.moy.totals + 'Crédits') : 'Moyenne   Crédits'}
                    </TableCell>
                  </TableRow>
                  {summary.ues.map((ue) => (
                    <>
                      <TableRow
                        key={ue.id}
                        className="text-gray-50 bg-bodydark2 hover:shadow-sm"
                      >
                        <TableCell colSpan={6} className="p-3 font-semibold text-center dark:text-gray-50">
                          {ue.name} ({ue.credit} crédits) <br />
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-slate-800 dark:bg-gray-50">
                        <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                          Cours
                        </TableCell>
                        <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                          Contrôle
                        </TableCell>
                        <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                          Moy Contrôle
                        </TableCell>
                        <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                          Note Examen
                        </TableCell>
                        <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                          Moyenne
                        </TableCell>
                        <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                          Statut
                        </TableCell>
                      </TableRow>

                      {ue.matters.map((matter) => (
                        <TableRow
                          key={matter.courseId}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm"
                        >
                          <TableCell className="p-3 font-semibold text-left dark:text-gray-50">
                            {matter.matter}<br />({matter.credit} crédits)
                          </TableCell>
                          <TableCell className="p-3 text-center">
                            <div className="font-semibold text-md">
                              {matter.stat.note && matter.stat.note.length > 0
                                ? matter.stat.note.map((n) => `${n}/20`).join(' , ')
                                : 'Aucune note'}
                            </div>
                          </TableCell>
                          <TableCell className="p-3 text-center">
                            {matter.stat.control !== null ? matter.stat.control : '-'}
                          </TableCell>
                          <TableCell className="p-3 text-left">
                            <div className="flex  items-center justify-between gap-4">
                              <div>{matter.stat.exam !== null ? matter.stat.exam : '-'}</div>
                            </div>
                          </TableCell>
                          <TableCell className="p-3 text-center">
                            {matter.stat.moy !== null ? matter.stat.moy.toFixed(2) : '-'}
                          </TableCell>
                          <TableCell className="p-3 text-center">
                            {matter.stat.is_validate ? (
                              <button className="bg-green-600 py-1 px-2 rounded-lg text-white">Validé</button>
                            ) : (
                              <button className="bg-red-600 py-1 px-2 rounded-lg text-gray-50">Non-validé</button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ))}

                </TableBody >
              </Table>
            ))
          ) : (
            <Table className="w-full border-collapse rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900">

              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="p-3 text-center text-gray-600 dark:text-white"
                  >
                    Aucune donnée disponible
                  </TableCell>
                </TableRow>

              </TableBody>
            </Table >
          )}
        </div >

      </div >
    </>
  );
};

export default SummaryStudent;