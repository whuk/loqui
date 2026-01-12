import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminSettingsPage from './page';

describe('AdminSettingsPage', () => {
    it('renders the page with title', () => {
        render(<AdminSettingsPage />);

        expect(screen.getByRole('heading', { name: '시스템 설정' })).toBeInTheDocument();
    });

    it('renders the page layout', () => {
        render(<AdminSettingsPage />);

        expect(screen.getByTestId('admin-settings-page')).toBeInTheDocument();
    });
});
