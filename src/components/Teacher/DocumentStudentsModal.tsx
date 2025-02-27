import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';


interface DocumentStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string, file: File) => void;
  loading: boolean;
}

const DocumentStudentsModal: React.FC<DocumentStudentsModalProps> = ({ isOpen, onClose, onSubmit, loading }) => {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    if (!title || !content || !file) {
      return;
    }

    setTitle('');
    setContent('');
    setFile(null);

    onSubmit(title, content, file)
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Envoyer un document</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" encType="multipart/form-data">
          <div className="grid w-full gap-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre du document"
                disabled={loading}
              />
            </div>
            
            <div className="grid w-full gap-1.5">
              <Label htmlFor="content">Description</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Description du document"
                className="min-h-[100px]"
                disabled={loading}
              />
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="doc">Document</Label>
              <Input
                id="doc"
                type="file"
                className="cursor-pointer"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                disabled={loading}
              />
              {file && (
                <span className="text-sm text-gray-500">
                  Fichier sélectionné: {file.name}
                </span>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!title || !content || !file || loading}
              className="relative"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Envoi en cours...
                </div>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


export default DocumentStudentsModal;