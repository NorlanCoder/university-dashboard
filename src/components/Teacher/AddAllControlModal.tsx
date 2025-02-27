import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { StudentCourse, fetchStudentsByCourse } from '@/api/teacher/students';

interface AddControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  classeId: string;
  onSubmit: (notes: { student: number; control: number }[]) => void;
  validationSchema: Yup.ObjectSchema<any>;
}

const ITEMS_PER_PAGE = 20;

const AddAllControlModal: React.FC<AddControlModalProps> = ({ isOpen, onClose, courseId, classeId, onSubmit, validationSchema }) => {
  const [students, setStudents] = useState<StudentCourse[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastStudentElementRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour charger les étudiants depuis l'API
  const loadMoreStudents = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const response = await fetchStudentsByCourse(classeId, courseId, page, '');
      
      if (response && response.students) {
        const newStudents = response.students.filter(student => !student.is_delete);
        
        setStudents(prevStudents => {
          // Éviter les doublons
          const existingIds = new Set(prevStudents.map(s => s.studentId));
          const uniqueNewStudents = newStudents.filter(s => !existingIds.has(s.studentId));
          return [...prevStudents, ...uniqueNewStudents];
        });

        setHasMore(newStudents.length >= ITEMS_PER_PAGE);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      setError('Erreur lors du chargement des étudiants');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Configurer l'Intersection Observer
  useEffect(() => {
    if (!isOpen) return;

    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    };

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMoreStudents();
      }
    }, options);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [isOpen, page, loading, hasMore]);

  // Observer le dernier élément
  useEffect(() => {
    if (lastStudentElementRef.current && observer.current) {
      observer.current.observe(lastStudentElementRef.current);
    }
  }, [students]);

  // Réinitialiser l'état lors de l'ouverture du modal
  useEffect(() => {
    if (isOpen) {
      setStudents([]);
      setPage(1);
      setHasMore(true);
      setError(null);
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (isOpen && page === 1) {
      loadMoreStudents();
    }
  }, [isOpen, page]);

  
  const initialValues = {
    notes: students.map(student => ({
      student: student.studentId,
      control: 0
    }))
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="dark:text-gray-50 text-gray-600">
            Ajout de contrôle continu aux étudiants
          </DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values) => onSubmit(values.notes)}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <div className="mt-2 h-[45vh] overflow-y-auto border p-2">
                {students.map((student, index) => (
                  <div
                    key={student.studentId}
                    ref={index === students.length - 1 ? lastStudentElementRef : null}
                    className="grid grid-cols-4 items-center gap-4 py-2"
                  >
                    <span className="col-span-2 font-medium">
                      {student.student.name || 'Inconnu'}
                    </span>
                    <div className="col-span-2">
                      <Field
                        name={`notes.${index}.control`}
                        type="number"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="Note"
                      />
                      <ErrorMessage
                        name={`notes.${index}.control`}
                        component="div"
                        className="text-sm text-red-500 mt-1"
                      />
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                )}
              </div>

              <DialogFooter className="mt-6">
                <Button type="submit" disabled={isSubmitting || loading}>
                  {isSubmitting ? 'Chargement...' : 'Soumettre'}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddAllControlModal;