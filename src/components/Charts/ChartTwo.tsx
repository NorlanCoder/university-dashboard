import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchDashboardData, PromoStat } from '@/api/Dashboard/DashboardGraph';

const options: ApexOptions = {
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },

  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%',
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  dataLabels: {
    enabled: false,
  },

  xaxis: {
    categories: [],
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',

    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
};

// interface ChartTwoState {
//   series: {
//     name: string;
//     data: number[];
//   }[];
// }

const ChartTwo: React.FC = () => {
  const [chartData, setChartData] = useState<PromoStat[]>([]);
  const [xAxisCategories, setXAxisCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardData();
        const promoStat = data.promoStat;

        // Extraire les noms des promotions (x-axis) et les valeurs (y-axis)
        setChartData(promoStat);
        setXAxisCategories(promoStat.map((stat) => stat.promoName));
      }  catch (error) {
        console.error('Erreur lors du chargement des données :', error);
      }
    };

    loadData();
  }, []);

 // Préparer les séries pour ApexCharts
 const series = [
  {
    name: 'Classes',
    data: chartData.map((stat) => stat.classCount),
  },
  {
    name: 'Étudiants',
    data: chartData.map((stat) => stat.studentCount),
  },
];

  // const handleReset = () => {
  //   setState((prevState) => ({
  //     ...prevState,
  //   }));
  // };
  // handleReset;  

  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white p-7.5 shadow-lg dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Statistique Promo
          </h4>
        </div>
     
      </div>

      <div>
      <div id="chartTwo" className="-ml-5 -mb-9">
        <ReactApexChart
          options={{ ...options, xaxis: { categories: xAxisCategories } }}
          series={series}
          type="bar"
          height={350}
        />
      </div>
      </div>
    </div>
  );
};

export default ChartTwo;
