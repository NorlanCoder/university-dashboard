import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EyeIcon } from '@heroicons/react/24/solid';
import { Student } from '@/api/teacher/classes';


interface ListStudentsProps {
  students: Student[];
}

const ListStudents: React.FC<ListStudentsProps> = ({ students }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };


  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (    
    <>
      <div className="py-4">
        {/* Barre de recherche */}
        <div className="max-w-sm mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
          />
        </div>

        <Table className="w-full border-collapse rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900">
          <TableHeader className="bg-slate-800 dark:bg-gray-50">
            <TableRow>
              <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                Matricule
              </TableCell>
              <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                Nom
              </TableCell>
              <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                Email
              </TableCell>
              <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                Téléphone
              </TableCell>
              <TableCell className="p-3 text-center text-white font-semibold dark:text-black">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="p-3 text-center text-gray-500">
                <div className="flex justify-center items-center">
                  <div className="spinner">
                    <span className="dark:text-white" >Chargement...</span>
                    <div className="half-spinner"></div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredStudents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="p-3 text-center text-gray-600 dark:text-white">
                Aucune donnée disponible
              </TableCell>
            </TableRow>
          ) : (
            filteredStudents.map((student) => (
              <TableRow key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm">
                <TableCell className="p-3 text-left dark:text-gray-300">
                  {student.matricule || 'Aucune donnée' }
                </TableCell>
                <TableCell className="p-3 text-left dark:text-gray-300">
                  {student.name || 'Aucune donnée' }
                </TableCell>
                <TableCell className="p-3 text-left dark:text-gray-300">
                  {student.email || 'Aucune donnée' }
                </TableCell>
                <TableCell className="p-3 text-left dark:text-gray-300">
                  {student.phone || 'Aucune donnée' }
                </TableCell>
                <TableCell className="p-3 text-center dark:text-gray-300">
                  <Button variant="default" size="sm" onClick={() => handleViewStudent(student)}>
                    <EyeIcon className="w-4 h-4" /> Voir
                  </Button>
                </TableCell>
              </TableRow>
            ))
        
          )}
          </TableBody>
        </Table>


        {/* Modal pour afficher les détails de l'étudiant */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent aria-describedby="student-details">
            <DialogHeader>
              <DialogTitle>Détails de l'étudiant</DialogTitle>
            </DialogHeader>
            {selectedStudent && (
              <div id="student-details" className="space-y-4">
                {/* <div>
                  <strong>Photo :</strong> {selectedStudent.photo ? <img src={selectedStudent.photo} alt="Photo" /> : 'Aucune photo'}
                </div> */}
                <div>
                  <strong>Matricule :</strong> {selectedStudent.matricule || 'Aucune donnée' }
                </div>
                <div>
                  <strong>Nom :</strong> {selectedStudent.name || 'Aucune donnée' }
                </div>
                <div>
                  <strong>Email :</strong> {selectedStudent.email || 'Aucune donnée' }
                </div>
                <div>
                  <strong>Téléphone :</strong> {selectedStudent.phone || 'Aucune donnée' }
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ListStudents;
