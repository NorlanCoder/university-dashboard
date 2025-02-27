import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Loader2 } from "lucide-react";
import Loader from '../Loader/loader';

interface UpdateExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  initialValue: number;
  onSubmit: (value: number) => Promise<void>;
}

const UpdateExamModal: React.FC<UpdateExamModalProps> = ({ isOpen, onClose, studentName, initialValue, onSubmit }) => {
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    note: Yup.number()
      .min(0, 'La note ne peut être négative.')
      .max(20, 'La note ne peut excéder 20.')
      .required('Ce champ est requis.')
  });

  const handleSubmit = async (values: { note: number }, { resetForm }: any) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit(values.note);
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
            Modifier la note d'examen pour {studentName}
          </DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{ note: initialValue }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="note" className="block text-sm font-medium mb-2">
                  Note d'examen
                </label>
                <Input id="note" name="note" type="number" min="0" max="20" step="0.1" value={values.note} onChange={(e) => setFieldValue('note', e.target.value)} className="w-full" disabled={isSubmitting} />
                {errors.note && touched.note && (
                  <div className="text-red-500 text-sm mt-1">{errors.note}</div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit"  disabled={isSubmitting} className="relative">
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
}

export default UpdateExamModal