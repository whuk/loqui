'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface ProfileFormProps {
    onSubmit: (data: { name: string }) => Promise<void>;
}

export function ProfileForm({ onSubmit }: ProfileFormProps) {
    const user = useAuthStore((state) => state.user);
    const [name, setName] = useState(user?.name || '');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('이름을 입력해주세요');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({ name: name.trim() });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                    이름
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="이름을 입력하세요"
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                    이메일
                </label>
                <input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                />
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
                {isSubmitting ? '저장 중...' : '저장'}
            </button>
        </form>
    );
}
