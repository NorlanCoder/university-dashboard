import React, { useEffect, useState } from 'react';
import CardDataStats from '../CardDataStats';
import { fetchInfosStats, StatsData } from '@/api/Dashboard/CardFetch'; 
import { motion } from "framer-motion";

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /*Animation Cards */
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, 
      },
    },
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring", 
        stiffness: 50, 
        damping: 10,    
      },
    },
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetchInfosStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p>Chargement des statistiques...</p>;
  }

  if (error) {
    return <p className="text-red-500">Erreur : {error}</p>;
  }

  if (!stats) {
    return <p>Aucune donnée disponible.</p>;
  }

  return (
    <motion.div  
    variants={containerVariants}
    initial="hidden"
    animate="show"
    className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 xl:grid-cols-5 2xl:gap-4">
      <motion.div variants={cardVariants} >
          <CardDataStats title="Total Matières" total={stats.nbrMatter}>
          <svg xmlns="http://www.w3.org/2000/svg"  width="24" height="24" viewBox="0 0 24 24"><g fill='none' stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path d="M10 13h4m-2-7v7m4-5V6H8v2" /><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /></g>
                    </svg>
          </CardDataStats>
      </motion.div>

      <motion.div variants={cardVariants} >
          <CardDataStats title="Total UE" total={stats.nbrUe}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" /><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" /><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" /></g>
                    </svg>
          </CardDataStats>
      </motion.div>

      <motion.div variants={cardVariants} >
          <CardDataStats title="Total Étudiants" total={stats.nbrStudent}>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0zM22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" /></g>
                    </svg>
          </CardDataStats>
      </motion.div>

      <motion.div variants={cardVariants} >
          <CardDataStats title="Nbre de prof" total={stats.nbrTeacher}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M10.275 12q-.7 0-1.15-.525T8.8 10.25l.3-1.8q.2-1.075 1.013-1.763T12 6q1.1 0 1.913.688t1.012 1.762l.3 1.8q.125.7-.325 1.225T13.75 12zm.6-2h2.275l-.2-1.225q-.05-.35-.325-.562T12 8t-.612.213t-.313.562zM3.1 12.975q-.575.025-.988-.225t-.537-.775q-.05-.225-.025-.45t.125-.425q0 .025-.025-.1q-.05-.05-.25-.6q-.05-.3.075-.575T1.8 9.35l.05-.05q.05-.475.388-.8t.837-.325q.075 0 .475.1l.075-.025q.125-.125.325-.187T4.375 8q.275 0 .488.088t.337.262q.025 0 .038.013t.037.012q.35.025.612.212t.388.513q.05.175.038.338t-.063.312q0 .025.025.1q.175.175.275.388t.1.437q0 .1-.15.525q-.025.05 0 .1l.05.4q0 .525-.437.9t-1.063.375zM20 13q-.825 0-1.412-.587T18 11q0-.3.088-.562t.237-.513l-.7-.625q-.25-.2-.088-.5T18 8.5h2q.825 0 1.413.588T22 10.5v.5q0 .825-.587 1.413T20 13M0 17v-.575q0-1.1 1.113-1.763T4 14q.325 0 .625.013t.575.062q-.35.5-.525 1.075T4.5 16.375V18H1q-.425 0-.712-.288T0 17m6 0v-.625q0-1.625 1.663-2.625t4.337-1q2.7 0 4.35 1T18 16.375V17q0 .425-.288.713T17 18H7q-.425 0-.712-.288T6 17m14-3q1.8 0 2.9.663t1.1 1.762V17q0 .425-.288.713T23 18h-3.5v-1.625q0-.65-.162-1.225t-.488-1.075q.275-.05.563-.062T20 14m-8 .75q-1.425 0-2.55.375T8.125 16H15.9q-.225-.5-1.338-.875T12 14.75M12.025 9"/></svg>
          </CardDataStats>
      </motion.div>

      <motion.div variants={cardVariants} >
          <CardDataStats title="Nbre d'admins" total={stats.nbrAdmin}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <path d="M2 21a8 8 0 0 1 10.821-7.487m8.557 3.113a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" /><circle cx="10" cy="8" r="5" /></g>
                  </svg>
          </CardDataStats>
      </motion.div>
    
    </motion.div>
  );
};

export default DashboardStats;
