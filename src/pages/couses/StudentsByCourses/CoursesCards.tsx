import React from 'react';
import { Course } from '@/api/Classroom/StudentsByCourse';

interface CourseCardsProps {
  courses: Course;
}

  const CourseCards: React.FC<CourseCardsProps> = ({ courses }) => {

    const teacher = courses?.teacher;
    const matter = courses?.matter;
    const ue = courses?.ue; 
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte du professeur */}
        <div className="p-4 bg-slate-800 shadow-lg rounded-lg">
          <h3 className="text-lg text-white font-semibold mb-2">Professeur</h3>
          {teacher ? (
            <>
              <p className="text-gray-100">{teacher.name}</p>
              <p className="text-sm text-gray-200">{teacher.email} { ' / '} {teacher.phone}</p>
      
            </>
          ) : (
            <p className="text-gray-200">Aucun professeur assigné</p>
          )}
        </div>
  
        {/* Carte de la matière */}
        <div className="p-4 bg-slate-800 shadow-lg rounded-lg">
          <h3 className="text-lg text-white font-semibold mb-2">Matière</h3>
          {matter ? (
            <>
              <p className="text-gray-100">{matter.name}</p>
              <p className="text-sm text-gray-200">Crédits : {matter.credit}</p>
             
            </>
          ) : (
            <p className="text-gray-200">Aucune matière assignée</p>
          )}
        </div>
  
        {/* Carte de l'UE */}
        <div className="p-4 bg-slate-800 shadow-lg rounded-lg">
          <h3 className="text-lg text-white font-semibold mb-2">UE</h3>
          {ue ? (
            <>
              <p className="text-gray-100">{ue.name}</p>
              <p className="text-sm text-gray-200">Crédits : {ue.credit}</p>
              {/* <p className="text-sm text-gray-500">Niveau : {ue.level}</p> */}
              {/* <p className="text-sm text-gray-500">Semestre : {ue.semester}</p> */}
            </>
          ) : (
            <p className="text-gray-200">Aucune UE assignée</p>
          )}
        </div>
      </div>
    );
};

export default CourseCards;
