'use client';

import { useState } from 'react';

interface PasswordFormProps {
    onSubmit: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
}

export function PasswordForm({ onSubmit }: PasswordFormProps) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!currentPassword) {
            setError('현재 비밀번호를 입력해주세요');
            return;
        }

        if (!newPassword) {
            setError('새 비밀번호를 입력해주세요');
            return;
        }

        if (newPassword.length < 8) {
            setError('비밀번호는 최소 8자 이상이어야 합니다');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({ currentPassword, newPassword });
            // Clear form on success
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                    현재 비밀번호
                </label>
                <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                    새 비밀번호
                </label>
                <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                    비밀번호 확인
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
                {isSubmitting ? '변경 중...' : '변경'}
            </button>
        </form>
    );
}
