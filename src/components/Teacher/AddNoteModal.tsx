import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (control: number) => void;
  initialValues: { control: number };
  validationSchema: Yup.ObjectSchema<any>;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, onClose, onSubmit, initialValues, validationSchema }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une note pour le contrôle continu</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            onSubmit(values.control);
            resetForm();
            onClose();
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="my-4">
                <label htmlFor="control" className="block text-md font-medium">Contrôle continu</label>
                <Field
                  name="control"
                  type="number"
                  placeholder="Contrôle continu"
                  className="w-full h-12 px-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-blue-300 focus:outline-none"
                />
                <ErrorMessage name="control" component="div" className="text-red-500" />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Chargement...' : 'Ajouter'}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteModal;
