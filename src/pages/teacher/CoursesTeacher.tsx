import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import toast, { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import "@/css/Loader.css";
import ListStudents from '@/components/Teacher/ListStudents';
import ListCourses from '@/components/Teacher/ListCourses';
import ListDocuments from '@/components/Teacher/DocumentListModal';


const CoursesTeacher: React.FC = () => {

  const location = useLocation();
  const classData = location.state?.classData;
  const [nameClass, setNameClass] = useState<string>("")
  const { classeId } = useParams<{ classeId: string }>();
  const [activeTab, setActiveTab] = useState<"courses" | "students">("courses");

  useEffect(() => {
    setNameClass(classData?.name)
  }, [classData])

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink asChild>
            <Link to="/teacher/filières">Classes</Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{classData?.name || "Cours"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="container mx-auto pt-12">
        <Toaster />

        {/* Navigation */}
        <div className="flex gap-4 mb-6 border-b-2 pb-1">
          <Button variant={activeTab === "courses" ? "default" : "ghost"} onClick={() => setActiveTab("courses")} >
            Liste des cours
          </Button>
          <Button variant={activeTab === "students" ? "default" : "ghost"} onClick={() => setActiveTab("students")}>
            Liste des étudiants 
          </Button>
        </div> 


        {/* Liste des cours */}
        {activeTab === "courses" && (
          <>
            <ListCourses classId={parseInt(classeId || "")} nameClass={nameClass} />     
          </>
        )}
        
        
        {/* Liste des étudiants */}
        {activeTab === "students" && (
          <>
            <ListStudents students={classData.Student} />
          </>
        )}
      </div>
    </>
  )
}

export default CoursesTeacher