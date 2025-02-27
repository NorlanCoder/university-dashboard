import React from 'react';
import CardDataStats from '@/components/DashboardComponents/DashboardStats'
import ChartOne from '../../components/Charts/ChartOne';
import ChartTwo from '../../components/Charts/ChartTwo';

import ChatCard from '../../components/Chat/ChatCard';
import TableOne from '../../components/Tables/TableOne';


const Dashboard: React.FC = () => {

  
  return (
    <>
      
 <CardDataStats/>

      <div className="  mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div>
    </>
  );
};

export default Dashboard;
