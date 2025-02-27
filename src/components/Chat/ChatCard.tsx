import React, { useState, useEffect } from "react";
import { fetchDashboardTableData, Admin } from "@/api/Dashboard/DashboardTable";


const TopAdmins: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAdmins = async () => {
      try {
        const data = await fetchDashboardTableData();
        setAdmins(data.admins);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getAdmins();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">Erreur: {error}</p>;

  return (
    <div className="  col-span-12 rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Top Admins
      </h4>

      <div>
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="flex  gap-4 py-3 px-5 hover:bg-gray-100 dark:hover:bg-meta-4 rounded-lg transition-all"
          >
            <div className="relative h-12 w-12 rounded-full overflow-hidden border border-gray-300 dark:border-strokedark">
              <img
                src={admin.photo || "/src/images/brand/administrator_3551.webp"}
                alt={admin.name}
                className="h-full w-full object-cover dark:bg-white"
              />
            </div>

            <div className="flex flex-1 flex-col">
              <h5 className="text-base font-medium text-black dark:text-white">
                {admin.name}
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {admin.email}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {admin.phone}
              </p>
            </div>
          </div> 
        ))}
      </div>
    </div>
  );
};

export default TopAdmins;
