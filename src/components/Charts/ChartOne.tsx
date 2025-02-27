import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchDashboardData, BilanPromo } from '@/api/Dashboard/DashboardGraph';

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#28a745', '#FF0000'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  stroke: {
    width: [2, 2],
    curve: 'smooth',
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#28a745', '#FF0000'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {

      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 100,
  },
};

const BilanPromoChart: React.FC = () => {
  const [bilanPromo, setBilanPromo] = useState<BilanPromo[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<string>('');
  const [chartData, setChartData] = useState({
    series: [
      { name: 'Admins / Total', data: [] as number[] },
      { name: 'Refusé / Total', data: [] as number[] },
    ],
    categories: [] as string[],
    labels: {
      passedLabels: [] as string[],
      failedLabels: [] as string[],
    },
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setBilanPromo(data.bilanPromo);
        if (data.bilanPromo.length > 0) {
          setSelectedPromo(data.bilanPromo[0].promoName);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadDashboardData();
  }, []);

  useEffect(() => {
    if (selectedPromo) {
      const promo = bilanPromo.find((p) => p.promoName === selectedPromo);
      if (promo) {
        const categories = promo.classrooms.map((cls) => cls.nameClass);
  
        // Utiliser directement le nombre de réussites et d'échecs
        const passedData = promo.classrooms.map((cls) => cls.passed);
        const failedData = promo.classrooms.map((cls) => cls.failed);
  
        // Définir la valeur max sur l'axe Y comme le multiple de 10 supérieur au maximum des données
        const maxVal = Math.max(...passedData, ...failedData);
        const yAxisMax = Math.ceil(maxVal / 10) * 10 || 10; // Éviter un max à 0
  
        const passedLabels = promo.classrooms.map((cls) => `${cls.passed}/${cls.total}`);
        const failedLabels = promo.classrooms.map((cls) => `${cls.failed}/${cls.total}`);
  
        setChartData({
          series: [
            { name: 'Admins / Total', data: passedData },
            { name: 'Refusé / Total', data: failedData },
          ],
          categories,
          labels: { passedLabels, failedLabels },
        });
  
        setYAxisMax(yAxisMax);
      }
    }
  }, [selectedPromo, bilanPromo]);
  

  const [yAxisMax, setYAxisMax] = useState(100);

  const chartOptions: ApexOptions = {
  ...options,
  xaxis: {
    ...options.xaxis,
    categories: chartData.categories,
  },
  yaxis: {
    min: 0,
    max: yAxisMax,
    tickAmount: Math.max(5, yAxisMax / 10), 
    labels: {
      formatter: (value) => `${value}`, 
    },
  },
  tooltip: {
    enabled: true,
    shared: true,
    y: {
      formatter: (value, { seriesIndex, dataPointIndex }) => {
        if (seriesIndex === 0) {
          return ` ${chartData.labels.passedLabels[dataPointIndex]}`;
        } else {
          return `${chartData.labels.failedLabels[dataPointIndex]}`;
        }
      },
    },
  },
  
};

  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white px-5 pt-4 pb-5 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div> <h3 className="text-lg font-medium mb-3">Bilan Promo</h3></div>
     <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-green-600">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-green-600"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-green-600">Total Admis</p>
              
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-red-500">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-red-500"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-red-500">Total Refusé</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
        <div className="mb-4 justify-between  items-center gap-4 sm:flex">
        <div>
          <h4 className="text-lg font-semibold  text-black dark:text-white">
            Promo
          </h4>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select
            value={selectedPromo}
             onChange={(e) => setSelectedPromo(e.target.value)}
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
            >
              {bilanPromo.map((promo) => (
            <option key={promo.promoName} value={promo.promoName}>
              {promo.promoName}
            </option>
          ))}
            </select>
            <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                  fill="#637381"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                  fill="#637381"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
        </div>
      </div>
  
      <ReactApexChart
        options={chartOptions}
        series={chartData.series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default BilanPromoChart;
