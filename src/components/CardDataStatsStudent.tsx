import React, { ReactNode } from 'react';

interface CardDataStatsProps {
  title: string;
  total: string | undefined;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({ title, total, children }) => {

  return (
    <div className="rounded-lg border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">

      <div className="flex items-center justify-between">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          {children}
        </div>
        
        <div className='transition-all duration-300 text-center'>
          {total ? (
            <h4 className="text-title-md font-bold text-black dark:text-white">{total}</h4>
          ) : (
            <h4 className="text-title-xs font-bold text-black dark:text-white">Chargement...</h4>
          )}
          <span className="text-lg font-medium">{title}</span>
        </div>
      </div>
    </div>
  );
};

export default CardDataStats;
