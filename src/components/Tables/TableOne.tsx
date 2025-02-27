import React, { useState, useEffect } from 'react';
import { fetchDashboardTableData, Stat } from "@/api/Dashboard/DashboardTable";


const TableOne: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardTableData();
        if (!data.Stats || !Array.isArray(data.Stats)) {
          throw new Error("Données invalides reçues pour les statistiques.");
        }
        setStats(data.Stats);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="rounded-lg border border-stroke bg-white px-3 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Statistiques des Promotions
      </h4>

      {loading ? (
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">Erreur : {error}</p>
      ) : stats.length > 0 ? (
        <div className="flex flex-col">
          <div className="grid grid-cols-6 rounded-sm bg-gray-2 dark:bg-meta-4">
            <div className="p-2.5 text-center"><h5 className="text-sm font-medium uppercase">Promotion</h5></div>
            <div className="p-2.5 text-center "><h5 className="text-sm font-medium uppercase">Classes</h5></div>
            <div className="p-2.5 text-center "><h5 className="text-sm font-medium uppercase">Étudiants</h5></div>
            <div className="p-2.5 text-center "><h5 className="text-sm font-medium uppercase">Admis</h5></div>
            <div className="p-2.5 text-center "><h5 className="text-sm font-medium uppercase">Échoués</h5></div>
            {/* <div className="p-2.5 text-center "><h5 className="text-sm font-medium uppercase">Taux d'Échec</h5></div> */}
            <div className="p-2.5 text-center "><h5 className="text-sm font-medium uppercase">Taux de Réussite</h5></div>
          </div>

          {stats.map((stat, index) => {
          const successRate = parseFloat(((stat.studentPass / stat.studentCount) * 100).toFixed(1));
          const failRate = parseFloat(((stat.studentFail / stat.studentCount) * 100).toFixed(1));
            return (
              <div key={index} className="grid grid-cols-6 border-b border-stroke dark:border-strokedark">
                <div className="p-2.5 text-center"><p className="text-black dark:text-white">{stat.promoName}</p></div>
                <div className="p-2.5 text-center "><p className="text-black dark:text-white">{stat.classCount}</p></div>
                <div className="p-2.5 text-center "><p className="text-black dark:text-white">{stat.studentCount}</p></div>
                <div className="p-2.5 text-center "><p className="text-meta-3">{stat.studentPass}</p></div>
                <div className="p-2.5 text-center "><p className="text-meta-5">{stat.studentFail}</p></div>
                {/* <div className="p-2.5 text-center xl:p-5 flex items-center justify-center">
                  <span className={`text-sm font-semibold ${failRate >= 50 ? 'text-red-500' : 'text-green-500'}`}>
                    {failRate}%
                  </span>
                  {failRate >= 50 ? 
                   <>
                   <div  className="h-5 w-5 text-red-500 ml-2" >
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path fill-rule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clip-rule="evenodd" />
                </svg>

                     </div>
                 </>
                         :
                         <>
                         <div  className="h-5 w-5 text-green-500 ml-2" >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                         <path fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
                                         </svg>
                           </div>
                       </>
                  }
                </div> */}
                <div className="p-2.5 text-center  flex items-center justify-center">
                  <span className={`text-sm font-semibold ${successRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                    {successRate}%
                  </span>
                  {successRate >= 50 ? 
                  <>
                    <div  className="h-5 w-5 text-green-500 ml-2" >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path fill-rule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clip-rule="evenodd" />
                </svg>

                      </div>
                  </>
                          :
                          <>
                          <div  className="h-5 w-5 text-red-500 ml-2" >
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                          <path fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
                                          </svg>
                            </div>
                        </>
                  }
                </div>
                
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">Aucune donnée disponible.</p>
      )}
    </div>
  );
};

export default TableOne;
