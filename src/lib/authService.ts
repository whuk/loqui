import { LoginResponse, User } from '@/types/auth';
import { api } from './api';

const DEV_USER: User = {
    id: 'dev-user',
    email: 'dev@local',
    name: 'Developer',
};

const DEV_TOKEN = 'dev-access-token';
const DEV_REFRESH_TOKEN = 'dev-refresh-token';

function isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
}

class AuthService {
    async login(email: string, password: string): Promise<LoginResponse> {
        if (isDevelopment()) {
            return {
                user: DEV_USER,
                accessToken: DEV_TOKEN,
                refreshToken: DEV_REFRESH_TOKEN,
            };
        }

        return api.post<LoginResponse>('/auth/login', { email, password });
    }
}

export const authService = new AuthService();
