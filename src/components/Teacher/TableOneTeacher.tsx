import { TeacherData } from '@/api/teacher/dashboard';


interface DashboardProps {
  dataDashboard?: TeacherData;
}


const TableOne:React.FC<DashboardProps> = ({ dataDashboard }) => {

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Historiques
      </h4>

      <div className="flex flex-col overflow-x-auto">
        <div className="grid grid-cols-6 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-semibold uppercase xsm:text-base">Niveau</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-semibold uppercase xsm:text-base">Filières</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-semibold uppercase xsm:text-base">Cours</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-semibold uppercase xsm:text-base">Total Étudiant</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-semibold uppercase xsm:text-base">Total Validé</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-semibold uppercase xsm:text-base">Total Non Validé</h5>
          </div>
        </div>

        {dataDashboard?.histories?.map((value, key) => (
          <div key={key} className={`grid grid-cols-6 sm:grid-cols-6`}>
            <div className="flex items-center justify-start p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{value.level}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{value.class}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{value.course}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{value.studentCourse}</p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-3">{value.studentValid}</p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-1">{value.studentCourse - value.studentValid}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
