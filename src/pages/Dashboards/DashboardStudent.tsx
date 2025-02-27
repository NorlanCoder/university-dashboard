import React, { useEffect, useState } from 'react';
import CardDataStatsStudent from '../../components/CardDataStatsStudent';
import TableOneStudent from '../../components/Teacher/TableOneStudent';
import { Bilan, fetchStudent, LastClass, Stat, StudentData, ProcessedUE, SkillData, MetricData, GradeData } from '@/api/teacher/dashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast, { Toaster } from 'react-hot-toast';

const Dashboard: React.FC = () => {

  const [dataDashboard, setDataDashboard] = useState<StudentData | undefined>();
  const [dashboardBilan, setDashboardBilan] = useState<Bilan[]>();
  const [infoClass, setInfoClass] = useState<LastClass>();
  const [lastStat, setLastStat] = useState<Stat>();
  const [firstStat, setFirstStat] = useState<Stat[]>();
  const COLORS = ['#4f46e5', '#06b6d4', '#8b5cf6'];

  const loadDashboard = async () => {
    try {
      const response = await fetchStudent();
      console.log(response) 
      if (response) {
        setDataDashboard(response);
        setDashboardBilan(response.bilan);
        setInfoClass(response.lastClass);
        setLastStat(response.stat[response.stat.length - 1])
        setFirstStat(response.stat.slice(0, -1));
      } else {
        setDataDashboard(undefined);
        console.warn('Données non valides :', response);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des classes.');
      setDataDashboard(undefined);
    } finally {
      // setLoading(false);
    }
  };


  // Fonction pour extraire les données des UEs
  const extractUEData = (data: StudentData | undefined) => {
    const ueData: ProcessedUE[] = [];
    
    data?.bilan.forEach(semester => {
      semester.ues.forEach(ue => {
        if (ue.is_validate !== null) {
          let totalMoy = 0;
          let validMatters = 0;
          
          ue.matters.forEach(matter => {
            if (matter.stat.moy !== null) {
              totalMoy += matter.stat.moy;
              validMatters++;
            }
          });
          
          if (validMatters > 0) {
            const moyenne = totalMoy / validMatters;
            
            ueData.push({
              name: ue.name,
              moyenne: moyenne,
              credits: ue.credit,
              validated: ue.is_validate
            });
          }
        }
      });
    });
    
    return ueData;
  };

  const processedUEData = extractUEData(dataDashboard);


  // Fonction pour extraire les données des compétences
  const extractSkillsData = (data: StudentData | undefined): SkillData[] => {
    const skillsData: SkillData[] = [];
    
    data?.bilan.forEach(semester => {
      semester.ues.forEach(ue => {
        ue.matters.forEach(matter => {
          if (matter.stat.moy !== null) {
            skillsData.push({
              subject: matter.matter,
              value: matter.stat.moy
            });
          }
        });
      });
    });
    
    return skillsData;
  };


  const processedSkillData = extractSkillsData(dataDashboard);



  // Fonction pour extraire les métriques
  const extractMetricsData = (data: StudentData | undefined): MetricData[] => {
    let totalCredits = 0;
    let totalCourses = 0;
    let totalUEs = 0;

    data?.bilan.forEach(semester => {
      totalUEs += semester.ues.length;

      semester.ues.forEach(ue => {
        totalCredits += ue.credit;

        totalCourses += ue.matters.length;
      });
    });

    // Retourner les données formatées pour le donut
    return [
      { name: 'Total Crédits', value: totalCredits },
      { name: 'Total Cours', value: totalCourses },
      { name: 'UEs', value: totalUEs }
    ];
  };


  const metricsData = extractMetricsData(dataDashboard);


  // Fonction pour extraire les notes
  const extractGradesData = (data: StudentData | undefined): GradeData[] => {
    const gradesData: GradeData[] = [];
    
    data?.bilan.forEach(semester => {
      semester.ues.forEach(ue => {
        ue.matters.forEach(matter => {
          if (matter.stat.control !== null || matter.stat.exam !== null) {
            gradesData.push({
              subject: matter.matter,
              control: matter.stat.control,
              exam: matter.stat.exam,
              moyenne: matter.stat.moy
            });
          }
        });
      });
    });
    
    return gradesData;
  };

  const gradesData = extractGradesData(dataDashboard);


  useEffect(() => {
    loadDashboard();
  }, []);

  

  return (
    <>
      <Toaster />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-lg border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 1.367l6.5 2.817L7 7L.5 4.184z"/><path d="m3.45 5.469l.006 3.064S4.529 9.953 7 9.953s3.55-1.42 3.55-1.42l-.001-3.064m-8.854 5.132v-5.89m.001 8.282a1.196 1.196 0 1 0 0-2.392a1.196 1.196 0 0 0 0 2.392"/></g>
              </svg>
            </div>
            
            <div className='transition-all duration-300 text-left'>
              <h4 className="text-title-sm font-bold text-black dark:text-meta-2">{infoClass?.level ?? "..."}</h4>
              <p className="text-lg font-medium text-black dark:text-meta-2">{infoClass?.name ?? "..."}</p>
              <p className="text-lg font-medium text-black dark:text-meta-2">{infoClass?.promo.name ?? "..."}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 1.5H11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1h1.5"/><rect width="5" height="2.5" x="4.5" y=".5" rx="1"/><path d="M4.5 5.5h5M4.5 8h5m-5 2.5h5"/></g>
              </svg>
            </div>
            
            <div className='transition-all duration-300 text-left'>
              <h4 className="text-title-sm font-bold text-black dark:text-meta-2">Semestres</h4>
              <p className="text-lg">Total cours : <span className="text-xl font-bold text-black dark:text-meta-2">{lastStat?.course ?? "..." }</span></p> 
              <p className="text-lg">Total crédits : <span className="text-xl font-bold text-black dark:text-meta-2">{lastStat?.credit ?? "..."}</span></p>
            </div>
          </div>
        </div>

        {!firstStat &&  (
          <>
            <div className="rounded-lg border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex items-center justify-between">
                <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect width="13" height="8" x=".5" y="3" rx="1"/>
                    <path d="M3.5 8.25h7m-7-2.5h7"/></g>
                  </svg>
                </div>
                
                <div className='transition-all duration-300 text-left'>
                <h4 className="text-title-sm font-bold text-black dark:text-meta-2">Semestres 1</h4>
                  <p className="text-lg">Total cours : <span className="text-xl font-bold text-black dark:text-meta-2">{lastStat?.course ?? "..." }</span></p> 
                  <p className="text-lg">Total crédits : <span className="text-xl font-bold text-black dark:text-meta-2">{lastStat?.credit ?? "..."}</span></p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex items-center justify-between">
                <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect width="13" height="8" x=".5" y="3" rx="1"/>
                    <path d="M3.5 8.25h7m-7-2.5h7"/></g>
                  </svg>
                </div>
                
                <div className='transition-all duration-300 text-left'>
                <h4 className="text-title-sm font-bold text-black dark:text-meta-2">Semestres 2</h4>
                  <p className="text-lg">Total cours : <span className="text-xl font-bold text-black dark:text-meta-2">{lastStat?.course ?? "..." }</span></p> 
                  <p className="text-lg">Total crédits : <span className="text-xl font-bold text-black dark:text-meta-2">{lastStat?.credit ?? "..."}</span></p>
                </div>
              </div>
            </div>
          </>
        )}
        
        {firstStat?.map((value, index) =>
          <div key={index} className="rounded-lg border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect width="13" height="8" x=".5" y="3" rx="1"/>
                  <path d="M3.5 8.25h7m-7-2.5h7"/></g>
                </svg>
              </div>
              
              <div className='transition-all duration-300 text-left'>
                <h4 className="text-title-sm font-bold text-black dark:text-meta-2">{value.name ?? "..."}</h4>
                <p className="text-md">Total cours : <span className="text-lg font-bold text-black dark:text-meta-2">{value?.course ?? "..." }</span></p> 
                <p className="text-md">Total crédit : <span className="text-lg font-bold text-black dark:text-meta-2">{value?.credit ?? "..." }</span></p> 
              </div>
            </div>
          </div>
        )}

        
        {/* <CardDataStatsStudent title="Total Classes" total="2">
          <svg className="text-[#1f2937] dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16v6H4z" /><path d="M8 10v10h8V10" /><path d="M2 16h20M12 10v4" /><circle cx="12" cy="21" r="1" />
          </svg>
        </CardDataStatsStudent> */}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-1/2 my-6">
          <CardHeader>
            <CardTitle className="text-lg px-4">Tableau de Bord Académique</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="semester">
              <TabsList>
                <TabsTrigger value="semester">Semestres</TabsTrigger>
                <TabsTrigger value="ue">UEs</TabsTrigger>
                <TabsTrigger value="skills">Compétences</TabsTrigger>
              </TabsList>

              <TabsContent value="semester">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={firstStat}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="course" fill="#8884d8" name="Nombre de cours" />
                      <Bar dataKey="credit" fill="#82ca9d" name="Crédits" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="ue">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processedUEData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="moyenne" fill="#8884d8" name="Moyenne" />
                      <Bar dataKey="credits" fill="#82ca9d" name="Crédits" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="skills">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={processedSkillData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 20]} />
                      <Radar name="Notes" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="w-full md:w-1/2 my-6">
          <CardHeader>
            <CardTitle className="text-lg px-4">Bilan de la classe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metricsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {metricsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg px-4">Comparaison des Notes (Contrôle & Examen)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gradesData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="subject"
                  angle={-45}
                  textAnchor="end"
                  height={0}
                />
                <YAxis domain={[0, 20]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="control" name="Contrôle" fill="#8884d8" />
                <Bar dataKey="exam" name="Examen" fill="#82ca9d" />
                <Bar dataKey="moyenne" name="Moyenne" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne /> */}
        <div className="col-span-12 xl:col-span-12">
          <TableOneStudent dashboardBilan={dashboardBilan}/>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
