interface AdminCheckOptions {
    isAdmin?: boolean;
}

/**
 * Check if the current user is an admin.
 * In development/test environments, always returns true.
 * In production, checks the user's admin role.
 */
export function isAdmin(options?: AdminCheckOptions): boolean {
    const env = process.env.NODE_ENV;

    // In development or test environment, always return true
    if (env === 'development' || env === 'test') {
        return true;
    }

    // In production, check the user's admin role
    return options?.isAdmin === true;
}
