import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import Loader from '../Loader/loader';

interface UpdateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number;
  initialNote: { position: number; value: number } | null;
  onSubmit: (studentId: number, position: number, value: number) => void;
  validationSchema: Yup.ObjectSchema<any>;
  notes?: number[];
}

const UpdateNoteModal: React.FC<UpdateNoteModalProps> = ({ isOpen, onClose, studentId, initialNote, onSubmit, validationSchema, notes = [] }) => {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: any, { resetForm }: any) => {

    if (values.notes && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit(
          studentId, 
          values.notes.position, 
          Number(values.notes.value)
        );
        resetForm();
        onClose();
      } catch (error) {
        console.error('Error submitting:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Modifier les contrôles continus
          </DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{ 
            notes: initialNote || { position: 0, value: 0 }
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="py-4 border rounded-lg p-4">
                {notes.map((note, index) => (
                  <div key={index} className="flex items-center gap-4 py-2">
                    <div className="flex gap-x-2 items-center">
                      <Field type="radio" name="selectedPosition" value={String(index)} checked={values.notes?.position === index}
                        onChange={() => {
                          setFieldValue('notes', { position: index, value: note });
                        }}
                        className="w-4 h-4"
                      />
                      <label htmlFor={`note-${index}`} className="font-medium dark:text-white">
                        Contrôle continu {index + 1}: {note}
                      </label>
                    </div>
                    {values.notes?.position === index && (
                      <div className="flex flex-col gap-2 flex-1">
                        <Input id={`note-${index}`} name="notes.value" type="number" min="0" max="20" step="0.1" value={values.notes.value}
                          onChange={(e) => 
                            setFieldValue('notes.value', e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                    )}
                  </div>
                ))}
                {notes.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Aucune note disponible
                  </p>
                )}
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit"  disabled={notes.length === 0 || isSubmitting} className="relative">
                  {isSubmitting ? (
                    <>
                      <Loader />
                    </>
                  ) : (
                    'Enregistrer'
                  )}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateNoteModal;