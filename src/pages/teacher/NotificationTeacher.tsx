import React, { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import toast, { Toaster } from "react-hot-toast";
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { fetchNotification, Notification } from "@/api/teacher/notification";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotificationTeacher: React.FC  = () => {

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalNotification, setTotalNotification] = useState(0);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const perPage = 10;


  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetchNotification(page, search);
      if (response && response.notifications) {
        setNotifications(response.notifications);
        setTotalNotification(response.total);
        setTotalPages(Math.ceil(totalNotification / perPage));
      }

    } catch (error) {
      toast.error('Erreur lors de chargement.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadNotifications();
  }, [page, search]);


  const handleViewNotif = (notification: Notification) => {
    setSelectedNotif(notification);
    setIsModalOpen(true);
  };


  // Changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Notification</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="container mx-auto py-4">

        <Toaster />

        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm"
            />
          </div>

          <Table className="w-full border-collapse rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900">
            <TableHeader className="bg-slate-800 dark:bg-gray-50">
              <TableRow>
                <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                  Utilisateur
                </TableCell>
                <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                  Title
                </TableCell>
                <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                  Contenu
                </TableCell>
                <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                  Date
                </TableCell>
                <TableCell className="p-3 text-left text-white font-semibold dark:text-black">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-3 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="spinner">
                        <span className="dark:text-white">Chargement...</span>
                        <div className="half-spinner"></div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <TableRow key={notification.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm">
                    <TableCell className="p-3 font-semibold text-left dark:text-gray-50">
                      <div className="flex items-center space-x-4">
                        <img src={notification.admin.photo} alt="" className="flex-none w-10 h-10 rounded-full object-cover" loading="lazy" decoding="async" />
                        <div className="flex-auto">
                            <div className="text-base text-slate-900 font-semibold dark:text-slate-200">
                              {notification.admin.name}
                            </div>
                            <div className="mt-0.5 dark:text-slate-300">
                              {notification.admin.email}
                            </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-3 font-semibold text-left dark:text-gray-50">
                      {notification.title}
                    </TableCell>
                    <TableCell className="p-3 text-left">
                      {notification.content}
                    </TableCell>
                    <TableCell className="p-3 text-left">
                      {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: fr })}
                    </TableCell>
                    <TableCell className="p-3 text-left">
                      <Button variant="default" size="sm" onClick={() => handleViewNotif(notification)}>
                        <EyeIcon className="w-4 h-4" /> Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="p-3 text-center text-gray-600 dark:text-white">
                    Aucune donnée disponible
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>


          {/* Pagination */}
          {notifications.length > 0 && (
            <Pagination>
              <PaginationContent className="mt-4">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                  />
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


          {/* Modal pour afficher les détails de l'étudiant */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent aria-describedby="student-details">
              <DialogHeader>
                <DialogTitle>Détails notification</DialogTitle>
              </DialogHeader>
              {selectedNotif && (
                <div id="student-details" className="space-y-4">
                  {/* <div>
                    <strong>Photo :</strong> {selectedStudent.photo ? <img src={selectedStudent.photo} alt="Photo" /> : 'Aucune photo'}
                  </div> */}
                  {/* <div>
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
                  </div> */}

                  <div className="w-full flex flex-col gap-2 bg-white dark:bg-gray-800 p-2">
                    <div className="flex gap-2">
                      <img className="w-[3.3rem] h-[3.3rem] object-cover rounded-full" src={selectedNotif.admin?.photo} alt="Profile" />
                      <div className="flex flex-col">
                        <div className="flex gap-2 items-center dark:text-white">
                          <h4 className="text-lg font-semibold">{selectedNotif.admin?.name}</h4>
                          <p className="text-sm">made a new post</p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-300">{formatDistanceToNow(selectedNotif.createdAt, { addSuffix: true, locale: fr })}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 border border-gray-200 dark:border-gray-600 rounded-md">
                      <div className="flex flex-col p-4 hover:cursor-pointer">
                        <h4 className="text-md font-medium dark:text-white">{selectedNotif.content}</h4>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

    </>
  )
}

export default NotificationTeacher