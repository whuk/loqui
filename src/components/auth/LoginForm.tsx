"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
    email: z
        .string()
        .min(1, '이메일을 입력해주세요')
        .email('올바른 이메일 형식이 아닙니다'),
    password: z.string().min(1, '비밀번호를 입력해주세요'),
    rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                    이메일
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register('email')}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                    비밀번호
                </label>
                <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            <div className="flex items-center">
                <input
                    id="remember"
                    type="checkbox"
                    {...register('rememberMe')}
                    className="w-4 h-4 text-primary border-[var(--border)] rounded focus:ring-primary"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-[var(--text-secondary)]">
                    로그인 상태 유지
                </label>
            </div>

            <button
                type="submit"
                className="w-full py-2 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
            >
                로그인
            </button>
        </form>
    );
}
