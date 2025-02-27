import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { fetchBilan } from '@/api/student/bilan';
import toast, { Toaster } from 'react-hot-toast';
import "@/css/Loader.css";

export interface Bilan {
    id: number;
    studentId: number;
    classId: number;
    sem1: {
        moy: number;
        totals: number;
        credits: number;
    };
    sem2: {
        moy: number;
        totals: number;
        credits: number;
    };
    total: {
        moy: number;
        totals: number;
        credits: number;
    };
    is_pass: boolean;
    is_delete: boolean;
    createdAt: string;
    updatedAt: string;
    class: {
        id: number;
        name: string;
        slug: string;
        level: string;
        schoolId: number;
        promoId: number;
        is_delete: boolean;
        createdAt: string;
        updatedAt: string;
        promo: {
            id: number;
            name: string;
            slug: string;
            schoolId: number;
            is_delete: boolean;
            createdAt: string;
            updatedAt: string;
        }
    }
}

const BilanStudentHistory: React.FC = () => {
    const [bilans, setBilans] = useState<Bilan[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalBilan, setTotalBilan] = useState(0);
    const [loading, setLoading] = useState(false);
    const perPage = 10;
    const navigate = useNavigate();

    // Charger les promotions
    const loadbilans = async () => {
        setLoading(true);
        try {
            const response = await fetchBilan(page, search);
            if (response && response.bilans) {
                const validbilans = response.bilans
                setBilans(validbilans);
                setTotalBilan(response.total);
                setTotalPages(Math.ceil(response.total / perPage));
            } else {
                setBilans([]);
                setTotalBilan(0);
                setTotalPages(0);
                console.warn('Données non valides :', response);
            }
        } catch (error) {
            toast.error('Erreur lors du chargement des promotions.');
            setBilans([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadbilans();
    }, [page, search]);

    // Changement de page
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    // Gérer la navigation vers page classes
    const handleNavigate = (bilan: Bilan) => {
        navigate(`/student/bilan/${bilan.classId}`);
    };

    return (
        <>

            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink >Bilan</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                </BreadcrumbList>
            </Breadcrumb>


            <div className="p-6 space-y-6">
                <Toaster />
                <div className="flex items-center justify-between mb-6">
                    <Input
                        placeholder="Rechercher par nom"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full max-w-sm"
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center">
                        <div className="spinner">
                            <span className='dark:text-white'>Chargement...</span>
                            <div className="half-spinner">
                            </div>
                        </div>
                    </div>
                ) : bilans.length === 0 ? (
                    <div className="text-center text-gray-600 dark:text-white pt-16">
                        Aucune donnée pour promotion.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bilans.map((bilan) => (
                            <Card
                                key={bilan.id}
                                className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardHeader className="grid grid-cols-4 items-center gap-4"   >
                                    {/* Contenu centré */}
                                    <div className="col-span-3 flex items-center justify-center">
                                        <CardTitle className="text-lg font-semibold" onClick={() => handleNavigate(bilan)}>
                                            {bilan.class.promo.name}: {bilan.class.name}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}

                {bilans.length > 0 && (
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
        </>
    );
};

export default BilanStudentHistory;