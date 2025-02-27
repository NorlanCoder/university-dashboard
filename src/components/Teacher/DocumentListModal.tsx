import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { EyeIcon, TrashIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { fetchDocuments } from '@/api/teacher/students';


interface Support {
  id: number;
  teacherId: number;
  courseId: number;
  title: string;
  content: string;
  file: string;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  course: {
    id: number;
    classId: number;
    teacherId: number;
    matterId: number;
    ueId: number;
    is_delete: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface DocumentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Support[];
  loading: boolean;
  onDownload: (fileUrl: string, fileName: string) => void;
  onView: (fileUrl: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  classeId: string | undefined;
  courseId: string | undefined;
}

const DocumentListModal: React.FC<DocumentListModalProps> = ({ isOpen, onClose, onDownload, onView, totalPages, onPageChange, classeId, courseId }) => {

  const [documents, setDocuments] = useState<Support[]>([]);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [documentTotalPages, setDocumentTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const perPage = 20;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  // Charger les documents
  const loadDocuments = async () => {
    if (!classeId || !courseId) {
      toast.error('ID de classe et de cours manquants.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetchDocuments("3", "30", page, search);
      console.log(response)
      if (response && response.supports) {
        const validDocuments = response.supports.filter(
          (doc) => !doc.is_delete
        );
        setDocuments(validDocuments);
        setTotalDocuments(response.total);
        setDocumentTotalPages(Math.ceil(response.total / perPage));
      } else {
        setDocuments([]);
        setTotalDocuments(0);
        setDocumentTotalPages(0);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des documents.');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };


  const handleViewDocument = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  // Utiliser useEffect pour charger les documents quand nécessaire
  useEffect(() => {
    loadDocuments();
  }, [classeId, courseId, page, search]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Liste des Documents</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <Table>
            <TableHeader className="bg-slate-800 dark:bg-gray-50">
              <TableRow>
                <TableCell className="p-3 text-left text-white font-semibold dark:text-black">Titre</TableCell>
                <TableCell className="p-3 text-left text-white font-semibold dark:text-black">Description</TableCell>
                <TableCell className="p-3 text-left text-white font-semibold dark:text-black">Date d'ajout</TableCell>
                <TableCell className="p-3 text-center text-white font-semibold dark:text-black">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="h-[45vh] overflow-y-auto">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="p-3 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="spinner">
                        <span className="dark:text-white">Chargement...</span>
                        <div className="half-spinner"></div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="p-3 text-center text-gray-600 dark:text-white">
                    Aucun document disponible
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <TableCell className="p-3 text-left dark:text-gray-300">{doc.title}</TableCell>
                    <TableCell className="p-3 text-left dark:text-gray-300">{doc.content}</TableCell>
                    <TableCell className="p-3 text-left dark:text-gray-300">
                      {formatDate(doc.createdAt)}
                    </TableCell>
                    <TableCell className="p-3">
                      <div className="flex justify-center gap-2">
                        {doc.file}
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onView(doc.file)}
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                        <a href={doc.file} target='_blank'
                          // variant="default"
                          // size="sm"
                          // onClick={() => onDownload(doc.file, doc.title)} 
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 14 14">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M.5 10.5v1a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1M4 6l3 3.5L10 6M7 9.5v-9"/>
                          </svg>
                          Télécharger
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {documents.length > 0 && (
            <Pagination>
              <PaginationContent className="mt-4">
                <PaginationItem>
                  <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => handlePageChange(index + 1)}
                      isActive={page === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={() => handlePageChange(page + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentListModal;