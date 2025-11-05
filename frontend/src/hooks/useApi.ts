import { useState, useEffect } from 'react';

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface UseApiOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    immediate?: boolean;
}

/**
 * Hook customizado para chamadas de API
 * Padroniza gerenciamento de loading, error e data
 */
export const useApi = <T>(
    apiCall: () => Promise<T>,
    options: UseApiOptions<T> = {}
) => {
    const { onSuccess, onError, immediate = true } = options;
    
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: false,
        error: null
    });

    const execute = async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        try {
            const result = await apiCall();
            setState({ data: result, loading: false, error: null });
            onSuccess?.(result);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            setState(prev => ({ ...prev, loading: false, error: errorMessage }));
            onError?.(errorMessage);
            throw err;
        }
    };

    const reset = () => {
        setState({ data: null, loading: false, error: null });
    };

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [immediate]);

    return {
        ...state,
        execute,
        reset,
        refetch: execute
    };
};

/**
 * Hook para operações CRUD padronizadas
 */
export const useCrud = <T, CreateData = Partial<T>, UpdateData = Partial<T>>(
    service: {
        getAll: () => Promise<T[]>;
        create: (data: CreateData) => Promise<T>;
        update: (id: number, data: UpdateData) => Promise<T>;
        delete: (id: number) => Promise<void>;
    }
) => {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await service.getAll();
            setItems(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    const createItem = async (data: CreateData) => {
        try {
            const newItem = await service.create(data);
            setItems(prev => [newItem, ...prev]);
            return newItem;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao criar item');
            throw err;
        }
    };

    const updateItem = async (id: number, data: UpdateData) => {
        try {
            const updatedItem = await service.update(id, data);
            setItems(prev => prev.map(item => 
                (item as any).id === id ? updatedItem : item
            ));
            return updatedItem;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao atualizar item');
            throw err;
        }
    };

    const deleteItem = async (id: number) => {
        try {
            await service.delete(id);
            setItems(prev => prev.filter(item => (item as any).id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao deletar item');
            throw err;
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    return {
        items,
        loading,
        error,
        createItem,
        updateItem,
        deleteItem,
        refetch: loadItems
    };
};
