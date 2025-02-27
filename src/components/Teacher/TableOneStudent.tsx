import React from 'react';
import { Bilan } from '@/api/teacher/dashboard';
import {Table,TableBody,TableCell,TableHeader,  TableRow, } from '@/components/ui/table';


interface DashboardProps {
  dashboardBilan?: Bilan[] | undefined;
}


const TableOne:React.FC<DashboardProps> = ({ dashboardBilan }) => {

  return (
    <>
      {dashboardBilan?.map((data, index) =>

        <div key={index} className="rounded-md border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mb-5">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            SEMESTRE {index + 1}
          </h4>

          <div className="grid justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-4">
            <div className="py-2 text-center">
              <p className="text-lg">Moyenne : <span className="font-bold">{data.moy.moy}</span></p>
            </div>
            <div className="py-2 text-center">
              <p className="text-lg">Total Crédit : <span className="font-bold">{data.moy.totals}</span></p>
            </div>
            <div className="py-2 text-center">
              <p className="text-lg">Total Crédit Validé : <span className="font-bold">{data.moy.credits}</span></p>
            </div>
          </div>

          <Table className="w-full border border-gray-300 dark:border-gray-600 mb-8">
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
              {data.ues.map((ue) => (
                <React.Fragment key={ue.id}>
                  <TableRow className="bg-gray-50 dark:bg-gray-900">
                    <TableCell colSpan={7} className="font-semibold text-[16] text-gray-800 dark:text-gray-300">
                      {ue.name} ({ue.credit} crédits) |{' '}
                      <span
                        className={`font-bold ${
                          ue.is_validate
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
                          className={`px-2 py-1 rounded-full text-white ${
                            matter.stat.is_validate
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
        </div>
      )}
    </>
  );
};

export default TableOne;
