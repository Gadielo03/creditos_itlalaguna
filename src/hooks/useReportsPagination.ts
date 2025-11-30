import { useState, useMemo } from "react";
import type { AlumnoCreditosReport } from "../types/credito";

interface UseReportsPaginationProps {
    reports: AlumnoCreditosReport[];
}

export const useReportsPagination = ({ reports }: UseReportsPaginationProps) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredReports = useMemo(() => {
        if (!searchQuery.trim()) return reports;

        const searchLower = searchQuery.toLowerCase();
        
        return reports.filter((report) => {
            const nctrl = report.alumno.nctrl?.toLowerCase() || '';
            const nombres = report.alumno.nombres?.toLowerCase() || '';
            const apellidos = report.alumno.apellidos?.toLowerCase() || '';
            const fullName = `${nombres} ${apellidos}`.toLowerCase();
            
            return nctrl.includes(searchLower) || 
                   nombres.includes(searchLower) || 
                   apellidos.includes(searchLower) ||
                   fullName.includes(searchLower);
        });
    }, [reports, searchQuery]);

    const paginatedReports = useMemo(() => {
        return filteredReports.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );
    }, [filteredReports, page, rowsPerPage]);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); 
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setPage(0);
    };

    return {
        page,
        rowsPerPage,
        searchQuery,
        filteredReports,
        paginatedReports,
        handleChangePage,
        handleChangeRowsPerPage,
        handleSearchChange,
    };
};
