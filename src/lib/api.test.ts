import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from './api';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('api client', () => {
    beforeEach(() => {
        mockFetch.mockClear();
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('performs a GET request successfully', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: 'test' }),
        });

        const response = await api.get('/test');
        expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
                'Content-Type': 'application/json',
            }),
        }));
        expect(response).toEqual({ data: 'test' });
    });

    it('performs a POST request with body', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });

        const body = { key: 'value' };
        await api.post('/submit', body);

        expect(mockFetch).toHaveBeenCalledWith('/api/submit', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(body),
        }));
    });

    it('adds Authorization header if token exists', async () => {
        localStorage.setItem('accessToken', 'fake-token');
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        await api.get('/protected');

        expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            headers: expect.objectContaining({
                'Authorization': 'Bearer fake-token',
            }),
        }));
    });

    it('throws an error when response is not ok', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: async () => ({ message: 'Bad Request' }),
        });

        await expect(api.get('/error')).rejects.toThrow('Bad Request');
    });

    it('handles network errors', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network Error'));
        await expect(api.get('/network-error')).rejects.toThrow('Network Error');
    });
});
