export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Singleton refresh promise — deduplicates concurrent 401 retries
let _refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
    try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        if (!refreshToken) return null;

        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) return null;

        const data = await response.json();
        const newAccessToken = data.accessToken || data.data?.accessToken;
        const newRefreshToken = data.refreshToken || data.data?.refreshToken;

        if (newAccessToken) {
            localStorage.setItem('accessToken', newAccessToken);
            if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
            return newAccessToken;
        }
        return null;
    } catch {
        return null;
    }
}

export async function fetchFromApi(endpoint: string, options: RequestInit = {}, _isRetry = false) {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    // Get token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }), // Add token if available
            ...options.headers,
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            // Attempt a transparent token refresh (only once per original call)
            if (!_isRetry) {
                if (!_refreshPromise) {
                    _refreshPromise = refreshAccessToken().finally(() => { _refreshPromise = null; });
                }
                const newToken = await _refreshPromise;
                if (newToken) {
                    // Retry original request with new token
                    return fetchFromApi(endpoint, options, true);
                }
            }

            console.warn(`[Auth Debug] API ${endpoint} triggered 401. Current Path: ${typeof window !== 'undefined' ? window.location.pathname : 'server'}`);
            const isLoginPage = typeof window !== 'undefined' && window.location.pathname.includes('/auth/login');

            if (typeof window !== 'undefined' && !isLoginPage) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                setTimeout(() => {
                    window.location.href = '/auth/login';
                }, 100);
            }
            throw new Error('Unauthorized: Redirecting to login...');
        }

        const errorBody = await response.text();
        throw new Error(`API Error: ${response.statusText} - ${errorBody}`);
    }

    // Try to parse as JSON, if it fails, return the text
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        try {
            return await response.json();
        } catch (error) {
            console.error('Failed to parse JSON response:', error);
            throw new Error('Invalid JSON response from server');
        }
    } else {
        // If response is not JSON, throw error with the text
        const text = await response.text();
        throw new Error(`Expected JSON response but got: ${contentType || 'unknown'}. Response: ${text.substring(0, 100)}`);
    }
}

export async function downloadFile(endpoint: string, filename: string) {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    try {
        const response = await fetch(url, {
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
        });

        if (!response.ok) {
            throw new Error(`Download failed: ${response.statusText}`);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('File download error:', error);
        throw error;
    }
}

