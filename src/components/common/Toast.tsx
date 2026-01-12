'use client';

import { createContext, useContext, useState, useCallback, ReactNode, HTMLAttributes } from 'react';

export type ToastType = 'info' | 'success' | 'error';

export interface ToastData {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastProps extends HTMLAttributes<HTMLDivElement> {
    message: string;
    type: ToastType;
    onClose: () => void;
}

export function Toast({ message, type, onClose, className = '', ...props }: ToastProps) {
    const typeStyles = {
        info: 'bg-blue-500',
        success: 'bg-green-500',
        error: 'bg-red-500',
    };

    return (
        <div
            className={`${typeStyles[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-3 ${className}`}
            role="alert"
            {...props}
        >
            <span>{message}</span>
            <button
                onClick={onClose}
                className="text-white hover:text-gray-200 font-bold"
                aria-label="닫기"
            >
                ×
            </button>
        </div>
    );
}

interface ToastContainerProps {
    toasts: ToastData[];
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => onRemove(toast.id)}
                />
            ))}
        </div>
    );
}

interface ToastContextType {
    toasts: ToastData[];
    showToast: (message: string, type: ToastType) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
