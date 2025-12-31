import { useState, useCallback } from "react";

export function useCasesFilter(initialFilters = {}) {
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        priority: "",
        type: "",
        ...initialFilters,
    });

    const updateFilter = useCallback((key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            search: "",
            status: "",
            priority: "",
            type: "",
        });
    }, []);

    return {
        filters,
        updateFilter,
        clearFilters,
        setFilters,
    };
}
