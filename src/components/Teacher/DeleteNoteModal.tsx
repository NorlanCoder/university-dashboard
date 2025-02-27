import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';


interface DeleteNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentNotes: number[];
  selectedPosition: number | null;
  onPositionSelect: (position: number) => void;
  isConfirmationOpen: boolean;
  setIsConfirmationOpen: (isOpen: boolean) => void;
  onConfirmationClose: () => void;
}


const DeleteNoteModal: React.FC<DeleteNoteModalProps> = ({ isOpen, onClose, onConfirm, studentNotes = [], selectedPosition, onPositionSelect, isConfirmationOpen, setIsConfirmationOpen, onConfirmationClose }) => {
  return (
    <>
      {/* Modal de sélection de note */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer une note</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Sélectionnez une note à supprimer :
            </p>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {studentNotes.map((note, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                >
                  <input
                    type="radio"
                    id={`note-${index}`}
                    name="noteSelection"
                    checked={selectedPosition === index}
                    onChange={() => onPositionSelect(index)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label 
                    htmlFor={`note-${index}`} 
                    className="ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
                  >
                    Contrôle continu {index + 1}: {note}/20
                  </label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedPosition !== null) {
                  setIsConfirmationOpen(true);
                  onClose();
                }
              }}
              disabled={selectedPosition === null}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation */}
      <Dialog open={isConfirmationOpen} onOpenChange={onConfirmationClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
          </DialogHeader>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible.
          </p>
          
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={onConfirmationClose}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onConfirm();
                onConfirmationClose();
              }}
            >
              Confirmer la suppression
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};


export default DeleteNoteModal