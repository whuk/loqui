import { isAdmin } from '@/lib/adminService';

interface SystemSettingsButtonProps {
    isAdmin?: boolean;
}

export function SystemSettingsButton({ isAdmin: isAdminProp }: SystemSettingsButtonProps) {
    const shouldShow = isAdmin({ isAdmin: isAdminProp });

    if (!shouldShow) {
        return null;
    }

    return (
        <button
            type="button"
            aria-label="시스템 설정"
        >
            시스템 설정
        </button>
    );
}
