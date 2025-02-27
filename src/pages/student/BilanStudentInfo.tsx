import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableRow, } from '@/components/ui/table';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchListBilan, Semester } from '@/api/student/BilanStudent';
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";


const BilanStudentInfo: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const [bilanData, setBilanData] = useState<Semester[] | null>(null);
  const [loading, setLoading] = useState(false);

  const [activeSemester, setActiveSemester] = useState<number | null>(null);
  const navigate = useNavigate();
  const toggleSemester = (index: number) => {
    setActiveSemester((prev) => (prev === index ? null : index));
  };

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {

  }, [isAuthenticated, user]);


  const loadBilan = async () => {
    if (!classId) {
      toast.error('ID de classe ou de bilan manquant');
      return;
    }
    setLoading(true);
    try {
      const response = await fetchListBilan(classId);
      if (response && response.data) {
        setBilanData(response.data);
      } else {
        setBilanData(null);
        console.warn('Données non valides :', response);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des relevés.');
      setBilanData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      loadBilan();
    }
  }, [classId]);


  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center">
          <div className="spinner">
            <span className="dark:text-white">Chargement...</span>
            <div className="half-spinner"></div>
          </div>
        </div>

      </>
    )
  }
  if (!bilanData) {
    return <p className="text-center text-red-500">Aucun relevé trouvé pour cet étudiant.</p>;
  }

  const general = bilanData;
  const student = user;

  return (
    <>
      <div>
        <button
          onClick={() => navigate(-1)}
          className=" rounded-md px-2 py-1  bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Relevé de Notes</h1>

        {/* Informations de l'étudiant */}
        <div className=" dark:bg-orange-400 bg-blue-700 mb-6 p-4 border shadow-md rounded-lg flex justify-between">
          <div className="flex items-center gap-4">
            <img
              src={student.photo || '/src/images/brand/administrator_3551.webp'}
              alt={`Photo de ${student.name}`}
              className="w-12 h-12 text-white rounded-full shadow border"
            />
            <div className='text-white'>
              <h2 className="text-xl font-semibold">{student.name}</h2>
              <p className="text-sm ">Matricule : {student.matricule}</p>
              <p className="text-sm ">Email : {student.email}</p>
              {student.phone && <p className="text-sm ">Téléphone : {student.phone}</p>}
            </div>
          </div>
        </div>

        {/* Accordéon des semestres */}
        {general.map((semester, index) => (
          <Card key={semester.id} className="mb-6 shadow-lg  dark:bg-gray-800 dark:border-gray-700">
            <CardHeader
              onClick={() => toggleSemester(index)}
              className="cursor-pointer flex justify-between items-center text-white p-4 bg-slate-800 dark:bg-gray-700 dark:text-gray-50  "
            >
              <div className='flex gap-4'>
                <h2 className="text-xl font-bold">{semester.sem}</h2>
                <button

                  aria-label={activeSemester === index ? 'Fermer le semestre' : 'Ouvrir le semestre'}
                >
                  {activeSemester === index ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m5 11H7v-2h10z" /></svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13v3q0 .425.288.713T12 17t.713-.288T13 16v-3h3q.425 0 .713-.288T17 12t-.288-.712T16 11h-3V8q0-.425-.288-.712T12 7t-.712.288T11 8v3H8q-.425 0-.712.288T7 12t.288.713T8 13zm1 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22" /></svg>
                  }
                </button>
              </div>
            </CardHeader>
            <AnimatePresence>
              {activeSemester === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0.5 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-200 my-4">
                      <span className="font-semibold">Moyenne:</span> {semester.moy.moy} | <span className="font-semibold">Total:</span> {semester.moy.totals} | <span className="font-semibold">Crédits:</span> {semester.moy.credits}
                    </p>
                    <Table className="w-full border border-gray-300 dark:border-gray-600">
                      <TableHeader className="bg-gray-100 dark:bg-gray-700">
                        <TableRow className='text-[16px] font-semibold'>
                          <TableCell className="font-bold text-gray-800 dark:text-gray-300">UE et Matières</TableCell>
                          <TableCell className="font-bold text-gray-800 dark:text-gray-300">Crédits</TableCell>
                          <TableCell className="font-bold text-gray-800 dark:text-gray-300">Note</TableCell>
                          <TableCell className="font-bold text-gray-800 dark:text-gray-300">Contrôle</TableCell>
                          <TableCell className="font-bold text-gray-800 dark:text-gray-300">Examen</TableCell>
                          <TableCell className="font-bold text-gray-800 dark:text-gray-300">Moyenne</TableCell>
                          <TableCell colSpan={4} className="font-bold text-gray-800 dark:text-gray-300">Statut</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {semester.ues.map((ue) => (
                          <React.Fragment key={ue.id}>
                            <TableRow className="bg-gray-50 dark:bg-gray-900">
                              <TableCell colSpan={7} className="font-semibold text-[16] text-gray-800 dark:text-gray-300">
                                {ue.name} ({ue.credit} crédits) |{' '}
                                <span
                                  className={`font-bold ${ue.is_validate
                                    ? 'text-green-600 dark:text-green-400'
                                    : ue.is_validate === false
                                      ? 'text-red-600 dark:text-red-400'
                                      : 'text-gray-500 dark:text-gray-400'
                                    }`}
                                >
                                  {ue.is_validate ? 'Validé' : ue.is_validate === false ? 'Non validé' : 'En attente'}
                                </span>
                              </TableCell>
                            </TableRow>
                            {ue.matters.map((matter) => (
                              <TableRow key={matter.code}>
                                <TableCell className="pl-6 dark:text-gray-300 text-[15px]">{matter.matter}</TableCell>
                                <TableCell className="dark:text-gray-300">{matter.credit}</TableCell>
                                <TableCell className="dark:text-gray-300">{matter.stat.note.join(', ') || 'N/A'}</TableCell>
                                <TableCell className="dark:text-gray-300">{matter.stat.control || 'N/A'}</TableCell>
                                <TableCell className="dark:text-gray-300">{matter.stat.exam || 'N/A'}</TableCell>
                                <TableCell className="dark:text-gray-300">{matter.stat.moy || 'N/A'}</TableCell>
                                <TableCell>
                                  <span
                                    className={`px-2 py-1 rounded-full text-white ${matter.stat.is_validate
                                      ? 'bg-green-500 dark:bg-green-600'
                                      : matter.stat.is_validate === false
                                        ? 'bg-red-500 dark:bg-red-600'
                                        : 'bg-gray-400 dark:bg-gray-500'
                                      }`}
                                  >
                                    {matter.stat.is_validate
                                      ? 'Validé'
                                      : matter.stat.is_validate === false
                                        ? 'Non validé'
                                        : 'En attente'}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>

            <CardFooter>
              <p className=" mt-2 text-right text-md font-semibold text-gray-500 dark:text-gray-400">
                {semester.sem} - Total Crédits: {semester.moy.credits} / {semester.moy.totals}
              </p>
            </CardFooter>
          </Card>
        ))}


      </div>
    </>
  );
};

export default BilanStudentInfo;
